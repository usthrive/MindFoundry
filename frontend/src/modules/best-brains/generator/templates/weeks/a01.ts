/**
 * Level A · Week 1 — "Counting 1–5" (conceptId: counting-1-5).
 *
 * The Level-A v2 EXEMPLAR, rebuilt onto `makeWeekBuilder` + `lib/earlynumber`.
 * FILL-ARCHITECTURE §3 row A1: anchor "touch-count, one tap per object"; core
 * forms count-arrangement and tap-count; perceptual discrimination "same 4 in a
 * row vs scattered — still 4?"; puppet error-analysis "double-counts one
 * object"; Day-5 "sort cards by how-many (+ an oral R-flagged part)".
 *
 * WHAT THE WEEK CLAIMS, and how the content forces it:
 *  - **One tap per object, and the last number said is how many.** Every core
 *    item is a drawn arrangement the child touches; the arrangement itself is
 *    the difficulty ramp (row → two rows → scatter → ring), because what breaks
 *    a four-year-old's count is losing their place, not the size of the number.
 *  - **Moving things never changes how many** (conservation). This is the A1
 *    perceptual discrimination, and it is real mathematics, not a symbol drill.
 *  - **The picture is the question.** `GATE_PROFILE.A` replaces the multi-step
 *    density gate with `pictorialPerDay: 1`; every non-retrieval item on Days
 *    1–4 carries a figure built from its own drawn values.
 *  - **No timers.** `sprint: null` — a timed element at band A is a hard fail.
 *  - **Zero retrieval.** A·W1 is the curriculum-graph origin: there is no
 *    earlier week to retrieve from. `preflight` and QG-2 carve out exactly this
 *    cell, and nothing else in the corpus may run without warm-ups.
 *
 * ── THREE DISCLOSURES (FANOUT kit §E2.3 "document the choice in the header") ──
 *
 * 1. **The rotating-pairing fix, stated as an INVARIANT: the answer must not sit
 *    at a FIXED RANK among the numbers offered** (kit §E2.11, LEARNINGS L43).
 *    The old hand-built "Circle the number that shows how many" keyed the
 *    SMALLEST option on 100% of draws; the version before that bracketed the
 *    answer (n−1, n, n+1), which made "circle the middle" a free pass in a
 *    mastery slot. Both are the same defect, mirrored. `howManyChoice` in
 *    `lib/earlynumber.ts` still brackets, so this week serves a local
 *    `tapTheNumber` instead: three honest miscount values (one/two too many,
 *    one/two too few) with the PAIRING rotated, so the truth lands low, middle
 *    and high in turn. Nothing is invented — every option offered is what a
 *    named counting error actually produces, and the keyed option is still
 *    re-derived by the registered `a_numeral_for_set_v1` verify template.
 *
 * 2. **The conservation picture cannot be drawn in ONE figure.** `CountersFig`
 *    takes a single `arrangement` for the whole picture, so "these four in a
 *    row, and the SAME four spread apart" is not expressible as one drawing —
 *    despite `figures/types.ts` naming "the scattered-vs-row conservation trap
 *    (A1/A5)" as a use case. The before/after journey therefore lives where the
 *    answer is already on the page (kit §E2.5): `script[0]→script[2]` push the
 *    same three apples apart, and GE-02→GE-03 recount the same four stars after
 *    they are pushed apart. The ASSESSED item shows the after-state only, and
 *    poses the conservation decision in the sentence the child hears; its
 *    over-count distractors are exactly the non-conserver's own answer
 *    ("spreading them out made more").
 *
 * 3. **Three thin local generators, and why each one is not in the family.**
 *    `tapTheNumber` (the rank fix above), `puppetDoubleCount` (the shared
 *    `puppetSlip` offers exactly two options whose keyed truth is always the
 *    SMALLER — an ALWAYS_MIN tell in every A week that uses it), and the
 *    counting word-problem forms (`lib/earlynumber.ts` has no story generator
 *    for pure counting; `pictureJoin`/`pictureTakeAway` are addition and
 *    subtraction, which A1 has not taught). All three follow the family's own
 *    conventions exactly — registered templateId, figure from `lib/figures`,
 *    prose through `lib/format`, `authorMeta` stamped — so they are the family's
 *    shape, not an escape from it. Recorded for the orchestrator.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { drawFresh, makeChoices, numberWords } from '../shared';
import type { ItemDraft } from '../shared';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import {
  countArrangement,
  pickExtreme,
  setForNumeral,
  sortAndTell,
  tenFrameBuild,
  COUNTABLE_NOUNS,
  PUPPETS,
} from '../lib/earlynumber';
import { assertsAnswer, assertsParam, counterGroups, counters } from '../lib/figures';
import { countNoun, unitFor } from '../lib/format';
import { drawUniqueItem } from '../lib/guard';
import type { ItemGen } from '../lib/items';

const ge = makeGe('A');

/** Drawn fresh per item; never hardcode a name that is also in this pool (kit §F.3). */
const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Ken'] as const;
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// The band-A prose law, applied per SENTENCE
//
// `lib/earlynumber.ts` caps a prompt at ten words, which is the law — but it
// caps the whole string, so a two-sentence prompt ("Oh no! Pip says 5. Tap the
// right number.") trips a cap it does not actually break, while a hint ladder
// is not capped at all. `bb-readability-test` measures per sentence with its own
// splitter and word counter; this mirrors BOTH exactly, and it is applied to
// every child-facing string this file authors — prompts, hints, choices, the
// hook, whyBeforeHow, the summary, script lines, guided-example steps and the
// puzzle. So the ceiling is structural here rather than a review note: an
// eleventh word throws the moment the module loads or the item is drawn.
//
// `[image: …]` alt text is EXEMPT and never passes through here — it is what a
// screen-reader child has INSTEAD of the picture, and the only way to shorten
// it is to describe the picture less.
// ---------------------------------------------------------------------------

const MAX_WORDS = 10;

function say(text: string): string {
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    const n = sentence
      .replace(/[—–]/g, ' ')
      .split(/\s+/)
      .filter((w) => /[a-z0-9]/i.test(w)).length;
    if (n > MAX_WORDS) {
      throw new Error(`A1: band-A sentence is ${String(n)} words (max ${String(MAX_WORDS)}): "${sentence}"`);
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
 * Two reasons, both real. (a) The ladder DEDUP counts a template at most twice
 * across the non-retrieval core, and a counting week's core form IS "count the
 * arrangement" — so the four arrangements need four ladders, and they genuinely
 * want different advice (a row wants "start at one end", a scatter wants "slide
 * each one aside", a ring wants "remember where you began"). (b) All 24 Level-A
 * weeks draw on the same family, so shipping its built-in ladders verbatim would
 * make every A week's hints identical to every other's — invisible to the
 * per-pack gates, and exactly what `bb-cross-week-test` exists to find (§E2.6).
 *
 * Works entirely inside the returned closure, takes no rng draw and leaves the
 * prompt untouched, so the QG-1/QG-4 surface signature is unchanged — the same
 * contract c06's `withFigure` follows.
 */
function withHints(base: ItemGen, ladder: string[]): ItemGen {
  return (rng, guard, difficulty) => ({ ...base(rng, guard, difficulty), hintLadder: ladder });
}

/**
 * SHIM — a family bug, not a week decision. Six of `lib/earlynumber.ts`'s eleven
 * verify-backed choice generators key their correct option as `the <noun>` while
 * their registered `verifyFor` returns the BARE noun, and `acceptableForms`
 * repeats the article. QG-11 compares whole values, so every one of them fails
 * `option keyed correct ("the apples") ≠ recomputed truth "apples"` at EVERY
 * seed: `setForNumeral`, `pickExtreme`, `patternNext`, `compareSets`,
 * `compareMeasure`, `solidChoice` (measured 25/25 draws each). Nothing caught it
 * because both shipped Level-A weeks are old-engine and no week has ever drawn
 * from them — the first week that does is this one.
 *
 * The article is right on the page ("Tap the group that shows 3" wants "the
 * apples"), so the honest fix is the accepted-form list, not the prose: add the
 * bare noun as what it already is, another surface form of the same answer. Done
 * here as a no-rng, prompt-preserving wrapper; the one-line library fix belongs
 * in `earlynumber.ts` and is recorded for the orchestrator, because it blocks
 * A2, A5, A6, A7, A11, A19, A20 and A21 exactly as it blocked this week.
 */
function acceptBareNoun(base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const bare = d.answer.acceptableForms
      .map((f) => f.replace(/^the\s+/i, ''))
      .filter((f) => !d.answer.acceptableForms.includes(f));
    return bare.length === 0
      ? d
      : { ...d, answer: { ...d.answer, acceptableForms: [...d.answer.acceptableForms, ...bare] } };
  };
}

// ===========================================================================
// Local generator 1 — tap the number, with the pairing ROTATED
// ===========================================================================

type TapFraming = 'row' | 'spread';

/**
 * The child counts the picture and taps the numeral.
 *
 * Every option is a real counting outcome, so no value is invented:
 *   n+1 / n+2   one (or two) objects touched twice
 *   n−1 / n−2   one (or two) objects never touched
 * WHICH PAIR IS OFFERED IS DRAWN, so the truth is sometimes the smallest number
 * on the page, sometimes the middle, sometimes the largest. That is the whole
 * fix: a fixed rank — either end OR the middle — is a page a child can score
 * without counting anything.
 *
 * `framing: 'spread'` is the A1 perceptual discrimination. The picture is the
 * after-state of a row that has been pushed apart; the sentence the child hears
 * says so; and the over-count options are precisely what a child who has not yet
 * conserved answers, because "it takes up more room" reads to them as "more".
 */
function tapTheNumber(opts: { framing: TapFraming; min: number; max: number }): ItemGen {
  const { framing } = opts;
  return (rng, guard, difficulty) => {
    /**
     * FRESHNESS ON {count, noun}, NOT ON THE COUNT ALONE — and this was measured,
     * not assumed (kit §E2.9a: a balanced draw still makes an unbalanced page
     * once a uniqueness filter sits between them).
     *
     * `drawUniqueItem` signs a one-token prompt as `<type>|1tok|<n>`, which the
     * validator never flags — it exists only to keep Form B off Form A. But this
     * week has SEVEN tap-a-numeral items and a number range of 1–5, so by the
     * time Form A is drawn the guard has taken every count but one: measured over
     * 800 seeds, the Form-A mastery slot keyed "2" on 77% of draws and offered
     * "1" as an option that could never be right. A certifying slot a child
     * passes by tapping the same numeral is precisely what this rebuild exists to
     * remove, and it arrived from the guard rather than from the draw.
     *
     * `drawFresh` with the noun in the signature gives 4 counts × 9 nouns = 36
     * fresh surfaces instead of 4, so the filter never binds. Same primitive, one
     * namespace up.
     */
    const draw = drawFresh(
      rng,
      guard,
      (r) => {
        const n = r.int(Math.max(2, opts.min), opts.max);
        // Deterministic nudge, never a redraw loop (§E2.4): a count of two has no
        // honest "two too few" (it would offer zero), so that pairing steps down
        // one. It costs a little rank spread and keeps every option countable.
        let pairing = r.int(0, 2);
        if (n < 3 && pairing === 2) pairing = 1;
        return { n, noun: r.pick(COUNTABLE_NOUNS), pairing, seed: r.uint() };
      },
      (v) => `tap:${framing}:${String(v.n)}:${v.noun}`,
    );
    const { n, noun, pairing } = draw;

    const over = (k: number) => ({
      text: String(n + k),
      errorTag: (framing === 'spread' ? 'concept-misconception' : 'representation-misread') as ErrorTag,
      rationale:
        framing === 'spread'
          ? `${k === 1 ? 'One' : 'Two'} too many - the non-conserver's answer: spread out takes more room, so it reads as more.`
          : `${k === 1 ? 'One' : 'Two'} too many - what touching an object twice gives.`,
    });
    const under = (k: number) => ({
      text: String(n - k),
      errorTag: 'procedure-slip' as ErrorTag,
      rationale: `${k === 1 ? 'One' : 'Two'} too few - what never touching an object gives.`,
    });
    const wrongs =
      pairing === 0
        ? [over(1), over(2)] // truth is the SMALLEST number offered
        : pairing === 1
          ? [under(1), over(1)] // truth is the MIDDLE number offered
          : [under(2), under(1)]; // truth is the LARGEST number offered

    const { choices, correctKey } = makeChoices(rng, String(n), wrongs);
    const scene =
      framing === 'spread' ? `${countNoun(n, noun)} spread far apart` : `${countNoun(n, noun)} in a row`;
    const question =
      framing === 'spread'
        ? 'The row was pushed apart. Tap the number.'
        : 'Tap the number that shows how many.';

    const draft: ItemDraft = {
      type: 'representation',
      prompt: scenePrompt(scene, question),
      // THE ALT MUST NOT ANSWER THE QUESTION (see `lib/earlynumber.ts`). This
      // item asks the child to count the picture and tap the numeral, and band A
      // AUTOPLAYS `speakablePrompt(prompt, figure.alt)` — so an alt of "4 ducks
      // spread far apart" reads the answer out before the question is asked.
      // The arrangement is what the picture looks like and is the whole point of
      // the spread framing, so it stays; the count goes.
      figure: counters(n, noun, {
        arrangement: framing === 'spread' ? 'scattered' : 'in a row',
        alt: framing === 'spread' ? `some ${noun} spread far apart` : `some ${noun} in a row`,
        asserts: assertsParam('n'),
      }),
      choices,
      answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
      difficulty,
      strand: 'computational',
      isRetrieval: false,
      generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun }, seed: draw.seed },
      hintLadder:
        framing === 'spread'
          ? hints('Pushing them apart never makes more.', 'Count them again and see for yourself.')
          : hints('Count the picture before you look at the numbers.', 'The number you said last is the one.'),
      errorTags:
        framing === 'spread'
          ? ['concept-misconception', 'representation-misread']
          : ['representation-misread', 'procedure-slip'],
      authorMeta:
        framing === 'spread'
          ? { stepCount: 1, cognitiveOp: 'conserve-count', isDiscrimination: true }
          : { stepCount: 1, cognitiveOp: 'match-numeral' },
    };
    return draft;
  };
}

// ===========================================================================
// Local generator 2 — help the puppet (the A1 double-count slip)
// ===========================================================================

/**
 * A NAMED puppet double-counted one object, so it says one too many. The child
 * taps the true number; the word "wrong" never appears; and the numeric truth is
 * recomputed by the registered `a_verify_count_slip_v1`, which QG-11 calls to
 * prove BOTH halves — that the shown slip is the genuine output of the named
 * misconception, and that the keyed option is the truth.
 *
 * A THIRD option is offered, and it rotates. Two reasons, the second sharper
 * than the first. (1) The shared `puppetSlip` offers only {n, n+1}, so its answer
 * is the smaller number on 100% of draws — a page a child passes by always
 * tapping the smaller numeral. (2) In ANY error-analysis item the puppet's own
 * number is never the answer, so a child who notices that has eliminated one
 * option for free; on a two-option page that is not a hint, it is the whole
 * answer. A third option makes "the puppet is never right" worth half a page
 * instead of all of it — which is as far as this form can be pushed without
 * making the puppet sometimes correct, and then it is not error analysis.
 * The third value is drawn from three real miscounts (one too few, two too few,
 * two too many), so the truth moves between the middle and the bottom of the
 * list instead of being pinned to one rank.
 */
function puppetDoubleCount(opts: { min: number; max: number }): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const noun = r.pick(COUNTABLE_NOUNS);
      const n = r.int(Math.max(3, opts.min), opts.max);
      const slipped = n + 1; // one object touched twice — the A1 recipe's slip
      const third = [
        {
          text: String(n - 1),
          errorTag: 'procedure-slip' as ErrorTag,
          rationale: 'One too few - what skipping an object gives, the opposite slip.',
        },
        {
          text: String(n - 2),
          errorTag: 'procedure-slip' as ErrorTag,
          rationale: 'Two too few - the same skip made twice in a scattered group.',
        },
        {
          text: String(n + 2),
          errorTag: 'representation-misread' as ErrorTag,
          rationale: 'Two too many - the puppet\'s own slip made twice over.',
        },
      ][r.int(0, 2)];
      const { choices, correctKey } = makeChoices(r, String(n), [
        {
          text: String(slipped),
          errorTag: 'representation-misread',
          rationale: 'The puppet\'s count: one object was touched twice, so it ran one too far.',
        },
        third,
      ]);
      const scene = `${countNoun(n, noun)} scattered`;
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(scene, `Oh no! ${puppet} counted and says ${String(slipped)}. Tap the right number.`),
        // The item asks for the TRUE count, so the alt must not state it: "4
        // flowers scattered. Oh no! Nim counted and says 5." is the answer
        // followed by the question. The puppet's number stays in the prompt —
        // naming it is the form.
        figure: counters(n, noun, { arrangement: 'scattered', alt: `some ${noun} scattered`, asserts: assertsParam('n') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: {
          templateId: 'a_verify_count_slip_v1',
          params: { n, slip: 'double-count' },
          seed: r.uint(),
        },
        hintLadder: hints('Count along with the puppet and watch their finger.', 'One of them got two taps. Which one?'),
        errorTags: ['representation-misread', 'procedure-slip'],
        authorMeta: { stepCount: 1, cognitiveOp: 'puppet-fix', isErrorAnalysis: true },
      };
      return draft;
    });
}

// ===========================================================================
// Local generator 3 — the Day-4 real-world counting picture problem
// ===========================================================================

/**
 * `GATE_PROFILE.A.multiStep` is null on purpose: a single-step pictorial
 * real-world item is the CORRECT band-A form, not a watered-down two-step. The
 * family has no counting story generator (its word problems all join or take
 * away, which A1 has not taught), so the two forms live here.
 */
interface StoryFrame {
  /** The story sentence. */
  line: (name: string, n: number, noun: string) => string;
  /** What the picture actually shows — the alt, so it must be true of the drawing. */
  scene: (n: number, noun: string) => string;
  /** The SPOKEN description: layout only, never the count being asked for. */
  alt: (noun: string) => string;
  arrangement: string;
  ladder: string[];
}

const STORY_FRAMES: Record<'picnic' | 'path', StoryFrame> = {
  picnic: {
    line: (name, _n, noun) => `${name} lays out some ${unitFor(2, noun)} on the rug.`,
    scene: (n, noun) => `${countNoun(n, noun)} in a row on a picnic rug`,
    alt: (noun) => `${unitFor(2, noun)} in a row on a picnic rug`,
    arrangement: 'in a row',
    ladder: ['Start at one end of the rug.', 'Touch one, say one number. Then the next.'],
  },
  path: {
    line: (name, _n, noun) => `${name} finds some ${unitFor(2, noun)} by the garden path.`,
    scene: (n, noun) => `${countNoun(n, noun)} in a ring beside a garden path`,
    alt: (noun) => `${unitFor(2, noun)} in a ring beside a garden path`,
    arrangement: 'in a ring',
    ladder: ['Pick one to be first, then go round.', 'Stop at the one you started on.'],
  },
};

/** One kind of thing, counted. The figure asserts the answer it is drawn from. */
function countStory(which: 'picnic' | 'path', opts: { min: number; max: number }): ItemGen {
  const frame = STORY_FRAMES[which];
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(opts.min, opts.max);
      const noun = r.pick(COUNTABLE_NOUNS);
      const name = one(r);
      const scene = frame.scene(n, noun);
      const spokenAlt = frame.alt(noun);
      const draft: ItemDraft = {
        type: 'word-problem',
        // The QUESTION always names the plural: `unitFor(n, …)` would say "How
        // many shell?" and hand a drawn count of one straight to the child.
        // GIVEN, kept: the STORY states the count ("Maya lays out 4 apples on
        // the rug. How many apples?"), so the number is already in the sentence
        // the child is asked. An alt repeating it discloses nothing new — this
        // form's work is matching the told number to the drawn set.
        prompt: scenePrompt(scene, `${frame.line(name, n, noun)} How many ${noun}?`),
        figure: counters(n, noun, { arrangement: frame.arrangement, alt: spokenAlt, asserts: assertsAnswer }),
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

/**
 * Two kinds tipped out together, and the question names ONE of them.
 *
 * The unused quantity is DRAWN rather than narrated (the old build said "a cat
 * watches" and drew no cat, so the sentence had no referent on the page). It is
 * the `has-distractor` posing in its band-A form: every item that consumes every
 * number it states quietly teaches "use all the numbers", and children learn it.
 */
function countOneKind(opts: { min: number; max: number }): ItemGen {
  return (rng, guard, difficulty) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(Math.max(2, opts.min), opts.max);
      const [nounA, nounB] = r.shuffle([...COUNTABLE_NOUNS]);
      let m = r.int(1, 3);
      if (m === n) m = n === 3 ? 2 : 3; // deterministic nudge: two equal heaps hide the choice
      const name = one(r);
      const scene = `${countNoun(n, nounA)} and ${countNoun(m, nounB)} tipped out together`;
      const draft: ItemDraft = {
        type: 'word-problem',
        // GIVEN, kept: the story states BOTH heaps, and the item's difficulty is
        // choosing the kind the question names rather than counting at all.
        prompt: scenePrompt(scene, `${name} tips out ${countNoun(n, nounA)} and ${countNoun(m, nounB)}. How many ${nounA}?`),
        figure: counterGroups(
          [
            { count: n, noun: nounA, label: nounA },
            { count: m, noun: nounB, label: nounB },
          ],
          { alt: scene, asserts: assertsParam('n', 'group:0') },
        ),
        answer: {
          value: String(n),
          acceptableForms: [numberWords(n), countNoun(n, nounA)],
          validation: 'exact-numeric',
          units: nounA,
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_count_v1',
          params: { n, noun: nounA, arrangement: 'in a row' },
          seed: r.uint(),
        },
        hintLadder: hints('The question asks about one kind only.', 'Count that kind. Leave the other heap alone.'),
        errorTags: ['task-comprehension', 'representation-misread'],
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
// The family generators, bound to A1's range and given this week's voice
// ===========================================================================

/**
 * The arrangement IS the difficulty ramp. What breaks a four-year-old's count is
 * losing their place, not the size of the number — so 1–5 stays 1–5 all week and
 * the picture gets harder to keep track of instead.
 */
// Floor of two, found by reading the generated week: a min of one served "Count
// the ducks. How many?" over a picture whose own alt read "1 duck in a row",
// which is not a row and is not a count. One still appears all week — in the
// three-group match, the fewest-group sort and the puzzle — where a group of one
// is a real thing to notice rather than a row of itself.
const countRow = withHints(
  countArrangement({ min: 2, max: 3, arrangement: 'in a row' }),
  hints('Start at one end of the line.', 'Touch one, say one number. Then the next.'),
);
const countRowMore = withHints(
  countArrangement({ min: 3, max: 5, arrangement: 'in a row' }),
  hints('Start at one end of the line.', 'Touch one, say one number. Then the next.'),
);
const countTwoRows = withHints(
  countArrangement({ min: 2, max: 4, arrangement: 'in two rows' }),
  hints('Finish the top line before you start the next.', 'Say a number for every single one.'),
);
const countScatter = withHints(
  countArrangement({ min: 3, max: 5, arrangement: 'scattered' }),
  hints('Pick one to start on, so none are missed.', 'Slide each one aside once it is counted.'),
);
const countRing = withHints(
  countArrangement({ min: 2, max: 5, arrangement: 'in a ring' }),
  hints('Choose one to be first in the ring.', 'Go round once and stop where you began.'),
);

/**
 * Count OUT a number — the production half of counting, and the harder half.
 * The frame is EMPTY, which is the point: there is nothing to read at a glance,
 * so the child must put one counter down per number word. A filled five-frame
 * would let a full row be seen as five without touching anything, which is the
 * one strategy this week must not let the child skip (kit §F.7 / L33).
 */
const countOut = withHints(
  tenFrameBuild({ min: 2, max: 5, size: 5 }),
  hints('Say a number for every counter you draw.', 'Stop when you reach the number you were given.'),
);

/** Numeral → set: the number is named, the child taps the group that holds it. */
const whichGroupShows = withHints(
  acceptBareNoun(setForNumeral({ min: 1, max: 5, groups: 3 })),
  // The family ladder's second rung runs to eleven words, over the band-A
  // ceiling. Re-voiced here; recorded for the orchestrator.
  hints('Count one group all the way before the next.', 'Stop at the group that lands on your number.'),
);

/** Sorting by how-many, in a tap-sized answer mode (the Day-5 signature). */
const fewestGroup = withHints(
  acceptBareNoun(pickExtreme({ which: 'smallest', min: 1, max: 5 })),
  hints('A wide group is not always a big number.', 'Count all three, then choose.'),
);

/** Sort fewest-first AND say how you knew — the computable core plus the oral R part. */
const sortCards = withHints(
  sortAndTell({ min: 1, max: 5 }),
  hints('Count every group before you move a card.', 'Say each number out loud as you place it.'),
);

const tapNumber = tapTheNumber({ framing: 'row', min: 2, max: 5 });
const tapAfterSpreading = tapTheNumber({ framing: 'spread', min: 3, max: 5 });
const puppetMiscount = puppetDoubleCount({ min: 3, max: 5 });
const storyPicnic = countStory('picnic', { min: 2, max: 4 });
const storyPath = countStory('path', { min: 3, max: 5 });
const storyOneKind = countOneKind({ min: 2, max: 5 });

// ===========================================================================
// The week
// ===========================================================================

export const buildA01 = makeWeekBuilder({
  level: 'A',
  week: 1,
  conceptId: 'counting-1-5',
  conceptName: 'Counting 1–5',
  strandTags: ['number-sense-counting'],
  prerequisiteWeeks: [],
  pedagogyContract: 'v2',
  conceptualAnchor: 'one tap per object',
  presentation: {
    audioFirst: true,
    oneOperationPerPage: true,
    scaffoldNotes:
      'Every prompt read aloud; one question to a page; oversized tap targets. Objects sit in straight rows on Day 1 and are spread further apart as the week goes on, because keeping your place — not the size of the number — is what a counter of this age loses. Real objects to touch beat any screen: count with the child, not at them. Mascot present.',
  },
  explanation: {
    hook: say(
      'Five teddies sit down for a picnic. How many plates do we need? We touch each teddy and find out. Counting tells us how many. It never has to guess.',
    ),
    whyBeforeHow: say(
      'Counting is not just saying the number words. It is one tap per object, in order. We go slowly because a rushed tap can miss one. Miss one, and the number is not true. Touch it, say it, move on. The last number you say is the answer.',
    ),
    script: [
      {
        say: say('Watch my finger. I touch each apple and say a number. One. Two. Three. Three apples!'),
        visual: 'Three apples in a row, touched one at a time.',
        figure: counters(3, 'apples', { arrangement: 'in a row', alt: 'three apples in a row' }),
      },
      {
        say: say('Now I rush. I touch one apple twice. I get four! But only three apples sit here. Slow taps keep the count true.'),
        visual: 'The same three apples. A finger lands twice on one of them.',
        figure: counters(3, 'apples', { arrangement: 'in a row', alt: 'the same three apples in a row' }),
      },
      {
        // The conservation journey, DRAWN — and it lives here, in the lesson,
        // where the answer is already on the page (kit §E2.5).
        say: say('Now I push the same apples far apart. They take up more room. But nothing was added. I count again. Still three!'),
        visual: 'The same three apples, now spread far apart.',
        figure: counters(3, 'apples', { arrangement: 'scattered', alt: 'the same three apples, spread far apart' }),
      },
      {
        say: say('Five ducks now. One. Two. Three. Four. Five. The last number I say tells how many.'),
        visual: 'Five ducks in a row, the last one reached.',
        figure: counters(5, 'ducks', { arrangement: 'in a row', alt: 'five ducks in a row' }),
      },
    ],
    summary: say(
      'Touch each thing once. Say one number for each touch. The last number you say tells how many. Moving them never changes how many.',
    ),
    vocabulary: [
      { term: 'count', kidGloss: 'touch each thing and say one number' },
      { term: 'how many', kidGloss: 'the question counting answers' },
      { term: 'last number', kidGloss: 'the number that tells how many in all' },
      { term: 'still the same', kidGloss: 'moving things never makes more or fewer' },
    ],
  },
  guidedExamples: [
    {
      ...ge(1, 1, 'modeled', scenePrompt('three apples in a row', 'How many apples?'), [
        {
          teacherSay: say('Watch my finger. I touch one apple and say one.'),
          expected: '1',
        },
        { childDo: say('Touch the last two apples along with me.'), expected: '2, 3' },
        { teacherSay: say('Three! The last number tells how many.') },
      ], '3'),
      visual: 'Three apples in a row.',
      figure: counters(3, 'apples', { arrangement: 'in a row', alt: 'three apples in a row', asserts: assertsAnswer }),
    },
    {
      ...ge(1, 2, 'completion', scenePrompt('four stars in a row', 'Count the stars with me.'), [
        { teacherSay: say('I will start you off. One... two...') },
        { childDo: say('Touch the last two stars and keep counting.'), expected: '3, 4' },
        { teacherSay: say('Four! You stopped when the stars ran out.') },
      ], '4'),
      visual: 'Four stars in a row.',
      figure: counters(4, 'stars', { arrangement: 'in a row', alt: 'four stars in a row', asserts: assertsAnswer }),
    },
    {
      // THE SAME FOUR STARS from GE-02, pushed apart. Two examples in a row are
      // what makes the rearrangement visible; one picture never could.
      ...ge(1, 3, 'prompted', scenePrompt('four stars pushed far apart', 'Now they are pushed apart. How many?'), [
        { teacherSay: say('Nothing arrived. Nothing left. I only moved them.') },
        { childDo: say('Count them again and see for yourself.'), expected: '4' },
      ], '4'),
      visual: 'The same four stars, now pushed far apart.',
      figure: counters(4, 'stars', { arrangement: 'scattered', alt: 'four stars pushed far apart', asserts: assertsAnswer }),
    },
    {
      ...ge(1, 4, 'independent', scenePrompt('five shells in a ring', 'Count the shells. Say how many.'), [
        { childDo: say('Pick one shell to start on. Go round once.'), expected: '5' },
      ], '5'),
      visual: 'Five shells laid out in a ring.',
      figure: counters(5, 'shells', { arrangement: 'in a ring', alt: 'five shells in a ring', asserts: assertsAnswer }),
    },
  ],
  days: [
    // Day 1 — concept echo: one tap per object, in the tidiest arrangement
    // there is, plus the production half (count OUT a number).
    [
      { gen: countRow, diff: 1 },
      { gen: countRowMore, diff: 2 },
      { gen: countOut, diff: 2 },
      { gen: tapNumber, diff: 2 },
    ],
    // Day 2 — the arrangement starts to fight back, and conservation arrives.
    [
      { gen: countTwoRows, diff: 2 },
      { gen: tapAfterSpreading, diff: 3 },
      { gen: whichGroupShows, diff: 2 },
      { gen: countScatter, diff: 3 },
    ],
    // Day 3 — the hardest arrangement to keep a place in, conservation again,
    // and the first "help the puppet".
    [
      { gen: countRing, diff: 2 },
      { gen: tapAfterSpreading, diff: 3 },
      { gen: fewestGroup, diff: 3 },
      { gen: puppetMiscount, diff: 3 },
    ],
    // Day 4 — real-world single-step picture problems (band-A form of G7),
    // including two that state a quantity the question does not want.
    [
      { gen: storyPicnic, diff: 2 },
      { gen: storyOneKind, diff: 3 },
      { gen: storyPath, diff: 3 },
      { gen: storyOneKind, diff: 3 },
    ],
    // Day 5 — sort by how-many, tell how you knew (the oral R part), and fix
    // the puppet's count.
    [
      { gen: fewestGroup, diff: 2 },
      { gen: sortCards, diff: 3 },
      { gen: puppetMiscount, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    // FILL-ARCHITECTURE §1 asks for a Teacher's-Note strip EVERY day at band A,
    // and `makeWeekBuilder` will happily place five. The validator will not:
    // `S-SCHEMA days[i].teacherNoteStrip — teacherNoteStrip belongs on Day 5
    // only` fires for days 1–4, so a five-strip week fails bb-verify-packs at
    // every seed. Shipping the Day-5 strip and recording the conflict; this
    // blocks the every-day parent strip for all 24 Level-A weeks, not just A1.
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this week is one touch, one number word, and then trusting that the last number said IS "how many". Two things look like mistakes and are not. If your child recounts from one every time you ask "how many?", that is a normal stage — ask again straight after they count, rather than correcting. And if they say a spread-out row has more than the same things bunched together, they are not guessing; that judgement is genuinely how it looks at this age. Push a handful of buttons apart in front of them and count together. The counting settles it far better than being told. Laying the table is the best practice there is: count out four forks, and stop at four.',
  ],
  /**
   * The sanctioned band-A solve-and-colour puzzle — and the colouring is the
   * mathematics here, not decoration. You cannot colour every apple green
   * without touching every apple exactly once, and an apple left white is the
   * page telling the child they missed one. So it is this week's one-tap-per-
   * object law in a second mode, and it checks itself.
   *
   * The colour lands on things that are actually DRAWN. An earlier draft asked
   * the child to colour "the apple box", which is worksheet furniture no
   * primitive draws — a direction with no referent on the page, which is the
   * whole class of defect the figure renderer exists to end.
   */
  puzzle: (r) => {
    const counts = r.shuffle([1, 2, 3, 4, 5]).slice(0, 3);
    const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
    const kinds = counts.map((c, i) => ({ c, noun: nouns[i] }));
    const scene = `a picnic rug holding ${kinds.map((k) => countNoun(k.c, k.noun)).join(', ')}`;
    const colors = ['green', 'yellow', 'blue'] as const;
    return {
      id: 'A1-PZ-01',
      title: 'Puzzle Grove: Count-and-Color Picnic',
      puzzleType: 'math-art',
      prompt: [
        `[image: ${scene}]`,
        ...kinds.map((k, i) => say(`Color every ${unitFor(1, k.noun)} ${colors[i]}.`)),
        say('Now say how many of each kind.'),
      ].join(' '),
      // The puzzle's answer IS the three counts ("ducks: 3; leaves: 1; stars:
      // 5"), and the old alt read every one of them out. The kinds on the rug
      // are what the picture looks like; counting them is the puzzle.
      figure: counterGroups(
        kinds.map((k) => ({ count: k.c, noun: k.noun, label: k.noun })),
        { alt: `a picnic rug holding ${kinds.slice(0, -1).map((k) => k.noun).join(', ')} and ${kinds[kinds.length - 1].noun}` },
      ),
      answer: {
        value: kinds.map((k) => `${k.noun}: ${String(k.c)}`).join('; '),
        acceptableForms: [],
        validation: 'set',
      },
      hintLadder: hints('Color one kind first. Leave the rest white.', 'Nothing white left of that kind? Then count them.'),
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
  puzzleMeta: { stepCount: 1, cognitiveOp: 'count-and-color' },
  sprint: null,
  mastery: [
    { gen: countRowMore, diff: 2 },
    { gen: tapNumber, diff: 2 },
    { gen: countScatter, diff: 3 },
    { gen: whichGroupShows, diff: 3 },
    { gen: storyOneKind, diff: 3 },
    { gen: tapAfterSpreading, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: count a row of 3-5. 02: tap the numeral for a drawn row, with the wrong values rotated so the truth is not at a fixed rank. 03: count a scattered group of 3-5 (the arrangement, not the number, is the load). 04: numeral to set, three drawn groups. 05: a two-kind story where the question names one kind and the other quantity is drawn but unused. 06: tap the numeral after the row has been pushed apart — the conservation check, certified rather than only taught. No count/noun pair reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'double-count',
      description: 'Touches one object twice — the fingers and the number words fall out of step, especially in a scattered group.',
      exampleWrongAnswer: 'counts 4 shells as 5',
      distractorRationale: 'Two options above the true count - one too many, then two too many.',
      reteachPointer: 'explanation/script[1] (the rushed finger that lands twice)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'skipped-object',
      description: 'Never touches one of the objects, so the count stops one short. A ring or a scatter makes it far likelier than a row.',
      exampleWrongAnswer: 'counts 5 shells as 4',
      distractorRationale: 'Two options below the true count - one too few, then two too few.',
      reteachPointer: 'guidedExamples/A1-GE-04 (pick a first one and go round once)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'spreading-makes-more',
      description: 'Says a spread-out group has more than the same group bunched up — judging by the room it takes up rather than by counting. The A-band conservation trap.',
      exampleWrongAnswer: 'four counters pushed apart answered as 5',
      distractorRationale: 'Offer a number ABOVE the true count on any item whose picture has been spread out.',
      reteachPointer: 'explanation/script[2] (the same apples pushed apart, counted again)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'counts-everything',
      description: 'Counts every object on the page instead of only the kind the question named.',
      exampleWrongAnswer: 'asked for the shells, counts the shells and the leaves together',
      distractorRationale: 'Draw a second heap of a different kind and ask about one of them.',
      reteachPointer: 'Day-4 two-heap page: name the kind out loud before any counting begins',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Counting groups of 1 to 5 the careful way — touching each object exactly once, saying one number per touch, and trusting that the last number said tells how many. We also met the idea that spreading things out never changes how many there are.',
    improvingCandidates: [
      'touching each object exactly once while counting',
      'answering "how many?" with the last number instead of counting again',
      'keeping their place in a scattered group or a ring',
      'counting OUT a number of things and stopping at the right one',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'keeping the counting words and the pointing finger in step — slow counting is strong counting, and speed is not the goal',
      },
      {
        errorTag: 'concept-misconception',
        text: 'knowing that pushing things apart never makes more of them — we will keep counting the same handful twice, spread out and bunched up',
      },
      {
        errorTag: 'task-comprehension',
        text: 'counting only the kind the question asked about, when there is something else on the page too',
      },
    ],
    homeFocus: {
      praiseLine:
        'You touched every single one and counted it once, and when I spread them out you counted again and found the same number.',
      questionForChild: 'Can you count out 4 forks for the table — and how do you know when to stop?',
      schoolSyncHook: 'Tell us what your child counts at nursery or school and we will lean the pictures toward it.',
    },
    vocabularyForParent: [
      'count (one touch, one number word)',
      'how many (the question counting answers)',
      'last number (the answer to "how many")',
      'conservation (moving things about never changes how many there are)',
    ],
  },
});
