/**
 * G8 — counting, ten-frames, partners, patterns (Level A, B1-B5)
 *
 * FILL-ARCHITECTURE §2 row G8, written to the §3 design stance: **Level A is a
 * different pedagogy, not a scaled-down D.** What that means in code:
 *
 *  - **The picture IS the question.** `GATE_PROFILE.A` replaces the multi-step
 *    density gate with `pictorialPerDay: 1`, so almost every generator here
 *    returns an item carrying a `figure` built from its OWN drawn values.
 *  - **…and the picture must not ANSWER the question.** Comparison figures never
 *    pass `showPairs`/`markExtra` (they thread the one-to-one match and ring the
 *    leftovers — that performs the child's work), and every hiding-game frame
 *    passes `coverStyle: 'single'` so covers cannot be counted instead of the
 *    partner being reasoned about.
 *  - **≤10 words, Tier-1 only.** A pre-reader HEARS the prompt. `ask()` throws
 *    at authoring time on an eleventh word, so the law is structural rather than
 *    a review note. The `[image: …]` direction is the spoken SCENE and is not
 *    part of the sentence the child is asked (`figures/prompt.ts` splits them).
 *  - **No timers, ever** (enforced upstream: `makeWeekBuilder` refuses a sprint
 *    at Level A, QG-7 refuses a non-null `fluencySprint`).
 *  - **Answer modes are tap / circle / choose**, so most items are `choice-key`
 *    with two or three oversized options; the numeric ones stay ≤ 20.
 *  - **Error analysis is "help the puppet"** — a named puppet made the slip, the
 *    child fixes it by tapping, and the word "wrong" never appears. The numeric
 *    truth is still recomputed by a registered `verifyFor` (QG-11), so the shown
 *    slip is a genuine misconception output and the keyed option is the truth.
 *
 * Contract every family in this directory follows:
 *  - generators return an `ItemGen` (see lib/items.ts) and stamp `authorMeta`;
 *  - every computational item names a `templateId` registered in the array
 *    below, so QG-5 re-derives its answer from the same params the generator
 *    used and a wrong answer key is structurally impossible;
 *  - embedded-claim items (discrimination / error-analysis) register a
 *    `verifyFor` instead, which QG-11 calls the same way;
 *  - prose is interpolated ONLY through lib/format.ts, never a bare `${…}`;
 *  - figures come from lib/figures.ts and are built from the item's OWN drawn
 *    values, so QG-13 can prove the picture agrees with the answer.
 *
 * `registry.ts` spreads `EARLYNUMBER_TEMPLATE_DEFS`, so nothing else needs editing when
 * a template is added here.
 */

import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';
import { makeChoices, numberWords } from '../shared';
import type { ItemDraft, TupleGuard } from '../shared';
import type { AnswerDef, VerifyDef } from './compute';
import {
  assertsAnswer,
  assertsAnswerOf,
  assertsParam,
  barModel,
  counterGroups,
  counters,
  DRAWABLE_NOUNS,
  numberLine,
  shapeFigure,
  tenFrame,
} from './figures';
import { countNoun, unitFor } from './format';
import { drawUniqueItem } from './guard';
import type { ItemGen } from './items';
import type { AuthorMeta } from './meta';

// ---------------------------------------------------------------------------
// Band-A prose law
// ---------------------------------------------------------------------------

/** FILL-ARCHITECTURE §1, Level-A row: "≤10 words, Tier-1 + taught words only". */
const MAX_PROMPT_WORDS = 10;

/**
 * The sentence the child is ASKED, word-capped at authoring time.
 *
 * Structural, not advisory: a generator that grows an eleventh word throws the
 * moment any week draws it, at every seed. This is the `format.ts` move applied
 * to sentence length — the guarantee lives in the library, and no reviewer has
 * to count words on 100 generated surfaces.
 */
function ask(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length > MAX_PROMPT_WORDS) {
    throw new Error(
      `earlynumber: band-A prompt is ${words.length} words (max ${MAX_PROMPT_WORDS}): "${text}"`,
    );
  }
  return text;
}

/**
 * `[image: <scene>] <question>` — the a01 shape. The bracket is the picture's
 * spoken scene (audio-first band) and carries the item's operand surface for
 * QG-1 freshness; `promptText()` strips it before anything reaches the screen,
 * so only `question` counts against the word cap.
 */
function scenePrompt(scene: string, question: string): string {
  return `[image: ${scene}] ${ask(question)}`;
}

/**
 * The nouns a band-A item may name AND have honestly drawn.
 *
 * `DRAWABLE_NOUNS` minus 'fish': every other noun round-trips through
 * `format.ts` ("1 duck"/"3 ducks", "1 leaf"/"3 leaves"), but the +es rule turns
 * fish into "3 fishes". `format.ts` is not this family's file to change, so the
 * pool is narrowed instead of the grammar being bypassed — a wrong plural on an
 * audio-first page is read aloud to a pre-reader.
 */
export const COUNTABLE_NOUNS: readonly string[] = DRAWABLE_NOUNS.filter((n) => n !== 'fish');

/** Puppets, not "a student" — the band-A form of the third-party carve-out. */
export const PUPPETS = ['Pip', 'Bo', 'Nim', 'Tug', 'Wix'] as const;

/** Two distinct nouns from the drawable pool. */
function twoNouns(r: Rng): [string, string] {
  const [a, b] = r.shuffle([...COUNTABLE_NOUNS]);
  return [a, b];
}

/**
 * Every accepted surface for a small whole-number answer.
 *
 * `countNoun` (never `${v} ${noun}`) for the unit-bearing form: a drawn answer
 * of one would otherwise enter the accepted list as "1 ducks", which QG-12c
 * catches and an audio-first page reads aloud.
 */
function numForms(n: number, noun?: string): string[] {
  return noun ? [numberWords(n), countNoun(n, noun)] : [numberWords(n)];
}

/**
 * A drawn range must actually hold `want` distinct values, or the "three groups"
 * items quietly degrade to two. Thrown at authoring time, not silently absorbed.
 */
function distinctPool(min: number, max: number, want: number, who: string): number[] {
  const pool: number[] = [];
  for (let v = min; v <= max; v++) pool.push(v);
  if (pool.length < want) {
    throw new Error(`earlynumber ${who}: range ${String(min)}-${String(max)} holds ${String(pool.length)} values, needs ${String(want)}`);
  }
  return pool;
}

function metaOf(cognitiveOp: string, extra: Partial<AuthorMeta> = {}): AuthorMeta {
  return { stepCount: 1, cognitiveOp, ...extra };
}

// ---------------------------------------------------------------------------
// Shared option shapes
// ---------------------------------------------------------------------------

export interface CountOpts {
  /** Inclusive draw range for the counted quantity. */
  min: number;
  max: number;
  /** Prompt/figure arrangement: 'in a row' | 'in two rows' | 'scattered' | 'in a ring'. */
  arrangement?: string;
}

// ===========================================================================
// 1. Counting an arrangement  (A1, A2, A9)
// ===========================================================================

/**
 * Count a drawn arrangement of one kind of thing. The figure is built from the
 * same `n` the answer is, and asserts it, so the picture cannot show four ducks
 * beside an answer of five.
 */
export function countArrangement(opts: CountOpts): ItemGen {
  const arrangement = opts.arrangement ?? 'in a row';
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(opts.min, opts.max);
      const noun = r.pick(COUNTABLE_NOUNS);
      const scene = `${countNoun(n, noun)} ${arrangement}`;
      const draft: ItemDraft = {
        type: 'computation',
        // The QUESTION always names the plural: `unitFor(n, …)` here would say
        // "Count the duck" and hand a drawn count of one straight to the child.
        prompt: scenePrompt(scene, `Count the ${noun}. How many?`),
        figure: counters(n, noun, { arrangement, alt: scene, asserts: assertsAnswer }),
        answer: { value: String(n), acceptableForms: numForms(n), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_count_v1', params: { n, noun, arrangement }, seed: r.uint() },
        hintLadder: ['Touch each one as you count.', 'One touch, one number - go slowly.'],
        errorTags: ['representation-misread', 'procedure-slip'],
        authorMeta: metaOf('count-set'),
      };
      return draft;
    });
}

/**
 * Tens towers (A22): count by tens. Drawn as `k` stacks of ten, so "how many
 * tens" and "how many in all" are the same picture read two ways.
 */
export function countByTens(opts: { minTens: number; maxTens: number }): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const k = r.int(opts.minTens, opts.maxTens);
      const scene = `${countNoun(k, 'towers')} of ten blocks`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, 'Count by tens. How many blocks?'),
        figure: counterGroups(
          Array.from({ length: k }, () => ({ count: 10, noun: 'blocks' })),
          { arrangement: 'towers', alt: scene, asserts: assertsAnswer },
        ),
        answer: { value: String(10 * k), acceptableForms: numForms(10 * k), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_count_tens_v1', params: { k }, seed: r.uint() },
        hintLadder: ['Point at each tower and say ten, twenty, thirty.', 'Every tower is one ten - none are loose.'],
        errorTags: ['concept-misconception', 'procedure-slip'],
        authorMeta: metaOf('count-tens'),
      };
      return draft;
    });
}

// ===========================================================================
// 2. Numeral ↔ set matching  (A3, A4, A10)
// ===========================================================================

/**
 * Set → numeral: the picture is drawn, the child taps the number word for it.
 * Distractors are ±1, which is exactly what a skipped or double-counted object
 * produces — a real misconception output, not a decoy.
 */
export function howManyChoice(opts: CountOpts): ItemGen {
  const arrangement = opts.arrangement ?? 'in a row';
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(opts.min, opts.max);
      const noun = r.pick(COUNTABLE_NOUNS);
      const scene = `${countNoun(n, noun)} ${arrangement}`;
      const { choices, correctKey } = makeChoices(r, String(n), [
        {
          text: String(n + 1),
          errorTag: 'representation-misread',
          rationale: 'One too many - what double-counting one object gives.',
        },
        {
          text: String(Math.max(0, n - 1)),
          errorTag: 'procedure-slip',
          rationale: 'One too few - what skipping an object gives.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(scene, 'Tap the number that shows how many.'),
        figure: counters(n, noun, { arrangement, alt: scene, asserts: assertsParam('n') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_numeral_for_set_v1', params: { n, noun }, seed: r.uint() },
        hintLadder: ['Count first, then look for the number you said last.'],
        errorTags: ['representation-misread'],
        authorMeta: metaOf('match-numeral'),
      };
      return draft;
    });
}

/**
 * Numeral → set: the number is named, the child taps the group that shows it.
 * The other groups are real counts drawn beside it, so "guess by size" fails.
 */
export function setForNumeral(opts: CountOpts & { groups?: number }): ItemGen {
  const groupCount = opts.groups ?? 3;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const picked = r.shuffle(distinctPool(opts.min, opts.max, groupCount, 'setForNumeral')).slice(0, groupCount);
      const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, groupCount);
      const targetIdx = r.int(0, picked.length - 1);
      const n = picked[targetIdx];
      const scene = picked.map((c, i) => countNoun(c, nouns[i])).join(', ');
      const { choices, correctKey } = makeChoices(
        r,
        `the ${nouns[targetIdx]}`,
        picked
          .map((c, i) => ({ c, i }))
          .filter(({ i }) => i !== targetIdx)
          .map(({ c, i }) => ({
            text: `the ${nouns[i]}`,
            errorTag: 'representation-misread' as ErrorTag,
            rationale: `That group shows ${String(c)} - traps answering from a glance instead of counting.`,
          })),
      );
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, `Tap the group that shows ${String(n)}.`),
        figure: counterGroups(
          picked.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
          { alt: scene, asserts: assertsParam('n', `group:${targetIdx}`) },
        ),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${nouns[targetIdx]}`], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        // counts + nouns ship so `verifyFor` can FIND the group that holds n
        // rather than take the generator's word for which one it was.
        generator: {
          templateId: 'a_set_for_numeral_v1',
          params: { n, counts: picked, nouns },
          seed: r.uint(),
        },
        hintLadder: ['Count one group at a time, all the way.', 'Stop when a group lands on the number you were given.'],
        errorTags: ['representation-misread', 'task-comprehension'],
        authorMeta: metaOf('match-set'),
      };
      return draft;
    });
}

// ===========================================================================
// 3. Ten-frame read / build  (A2, A4, A9)
// ===========================================================================

export interface FrameOpts {
  min: number;
  max: number;
  /** Cells per frame: 5 for the five-frame, 10 for the ten-frame. Default 10. */
  size?: 5 | 10;
  /** 1 or 2 frames — a double frame is how a teen number is SEEN. Default 1. */
  frames?: number;
}

/** Read a filled frame: how many counters are in it. */
export function tenFrameRead(opts: FrameOpts): ItemGen {
  const size = opts.size ?? 10;
  const frames = opts.frames ?? 1;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(opts.min, Math.min(opts.max, size * frames));
      const scene = `a frame with ${countNoun(n, 'counters')}`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, 'How many counters are in the frame?'),
        figure: tenFrame(n, { size, frames, alt: scene, asserts: assertsAnswer }),
        answer: { value: String(n), acceptableForms: numForms(n), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_read_v1', params: { n }, seed: r.uint() },
        hintLadder: ['Read the full row first, then count the rest on.', 'A full row is five - carry on from there.'],
        errorTags: ['representation-misread', 'concept-misconception'],
        authorMeta: metaOf('read-frame'),
      };
      return draft;
    });
}

/**
 * BUILD, not read: the frame is empty and the child puts the counters in. The
 * answer stays code-computed (it is the drawn `n`), and the frame carries no
 * assertion because an empty frame is the workspace, not a claim.
 */
export function tenFrameBuild(opts: FrameOpts): ItemGen {
  const size = opts.size ?? 10;
  const frames = opts.frames ?? 1;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(opts.min, Math.min(opts.max, size * frames));
      const scene = 'an empty frame';
      const draft: ItemDraft = {
        type: 'drawing',
        prompt: scenePrompt(scene, `Draw ${String(n)} counters in the frame.`),
        figure: tenFrame(0, { size, frames, alt: scene }),
        answer: {
          value: String(n),
          acceptableForms: [`${countNoun(n, 'counters')} drawn`],
          validation: 'manual-review',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_build_v1', params: { n }, seed: r.uint() },
        hintLadder: ['Say a number for every counter you put in.', 'Fill the top row first, then start the next.'],
        errorTags: ['procedure-slip'],
        authorMeta: metaOf('build-frame'),
      };
      return draft;
    });
}

/** How many cells are still empty — the visible, countable rung below partners. */
export function tenFrameEmpty(opts: FrameOpts): ItemGen {
  const size = opts.size ?? 10;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      // At least one cell filled and at least one empty, whatever the caller asks.
      const lo = Math.min(Math.max(1, opts.min), size - 1);
      const hi = Math.max(lo, Math.min(opts.max, size - 1));
      const filled = r.int(lo, hi);
      const scene = `a frame of ${String(size)} with ${countNoun(filled, 'counters')}`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, 'How many boxes are empty?'),
        figure: tenFrame(filled, { size, alt: scene, asserts: assertsAnswerOf('empty') }),
        answer: {
          value: String(size - filled),
          acceptableForms: numForms(size - filled),
          validation: 'exact-numeric',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_frame_empty_v1', params: { filled, cap: size }, seed: r.uint() },
        hintLadder: ['Point at the boxes with nothing in them.', 'Count only the empty ones.'],
        errorTags: ['task-comprehension', 'representation-misread'],
        authorMeta: metaOf('frame-empty'),
      };
      return draft;
    });
}

// ===========================================================================
// 4. Partners of 5 / 10 — the band-A algebra thread  (A12, A13)
// ===========================================================================

export interface PartnerOpts {
  /** The whole being partitioned: 5 (five-frame) or 10 (ten-frame). */
  total: 5 | 10;
}

/**
 * The hiding game. `coverStyle: 'single'` is load-bearing: the default 'cells'
 * draws one cover per hidden counter, and a child who can COUNT the covers has
 * not found the partner. One continuous cover with one '?' forces the reasoning.
 */
export function partnersHiding(opts: PartnerOpts): ItemGen {
  const { total } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const shown = r.int(1, total - 1);
      const hidden = total - shown;
      const scene = `a frame of ${String(total)} with ${countNoun(shown, 'counters')} showing and some hidden`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, 'How many counters are hiding?'),
        figure: tenFrame(shown, {
          size: total,
          hidden,
          coverStyle: 'single',
          alt: scene,
          asserts: assertsAnswerOf('hidden'),
        }),
        answer: { value: String(hidden), acceptableForms: numForms(hidden), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_partner_hidden_v1', params: { total, shown }, seed: r.uint() },
        hintLadder: ['How many would fill the whole frame?', 'Count on from the counters you can see.'],
        errorTags: ['concept-misconception', 'fact-recall'],
        authorMeta: metaOf('partner-of'),
      };
      return draft;
    });
}

/**
 * The same partner, written as the band-A algebra sentence: an empty BOX stands
 * for the unknown ("3 and ▢ make 5"). This is the icon-as-unknown form the fill
 * spec names as A's on-thread algebra — the box is a variable a four-year-old
 * can point at.
 */
export function partnerBox(opts: PartnerOpts): ItemGen {
  const { total } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const shown = r.int(1, total - 1);
      const hidden = total - shown;
      const scene = `a frame of ${String(total)} with ${countNoun(shown, 'counters')} and a covered box`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, `Fill the box: ${String(shown)} and ▢ make ${String(total)}.`),
        figure: tenFrame(shown, {
          size: total,
          hidden,
          coverStyle: 'single',
          alt: scene,
          asserts: assertsAnswerOf('hidden'),
        }),
        answer: { value: String(hidden), acceptableForms: numForms(hidden), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_partner_box_v1', params: { total, shown }, seed: r.uint() },
        hintLadder: ['The box hides the missing part.', 'Build the whole frame and see what the box must be.'],
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: metaOf('partner-box'),
      };
      return draft;
    });
}

/**
 * Day-5 production form: show ALL the ways to make N. The answer is a code-built
 * SET (every ordered pair), so the completeness claim is checked, not trusted;
 * the frame is the anchor the child works on.
 */
export function allWaysToMake(opts: PartnerOpts): ItemGen {
  const { total } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const pairs: string[] = [];
      for (let a = 0; a <= total; a++) pairs.push(`${String(a)}+${String(total - a)}`);
      const scene = `an empty frame of ${String(total)}`;
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(scene, `Show all the ways to make ${String(total)}.`),
        figure: tenFrame(0, { size: total, alt: scene }),
        answer: { value: pairs.join('; '), acceptableForms: [], validation: 'set' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_all_ways_v1', params: { total }, seed: r.uint() },
        hintLadder: ['Start with none on this side, then move one over each time.', 'Keep going until that side is full.'],
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: metaOf('make-all-ways'),
      };
      return draft;
    });
}

// ===========================================================================
// 5. Order & neighbours  (A6)
// ===========================================================================

export interface NeighbourOpts {
  kind: 'before' | 'after' | 'between';
  min: number;
  max: number;
}

/**
 * Before / after / between on a number path.
 *
 * The path prints only the numbers it GIVES: tick labels are off and each known
 * value carries its own label, while the gap is an 'unknown'-styled mark with no
 * label. So the picture shows WHERE the answer sits without ever printing it —
 * and the assertion proves the gap is drawn at exactly the answer's position.
 */
export function neighbourNumber(opts: NeighbourOpts): ItemGen {
  const { kind } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(Math.max(opts.min, kind === 'before' ? 2 : 1), opts.max);
      const answer = kind === 'before' ? n - 1 : n + 1;
      const given = kind === 'between' ? [n, n + 2] : [n];
      const lo = Math.max(0, Math.min(...given, answer) - 1);
      const hi = Math.max(...given, answer) + 1;
      const marks = [
        ...given.map((g) => ({ at: g, label: String(g), style: 'point' as const })),
        { at: answer, style: 'unknown' as const },
      ].sort((a, b) => a.at - b.at);
      const unknownIdx = marks.findIndex((m) => m.style === 'unknown');
      const question =
        kind === 'before'
          ? `What number comes before ${String(n)}?`
          : kind === 'after'
            ? `What number comes after ${String(n)}?`
            : `What number goes between ${String(n)} and ${String(n + 2)}?`;
      const scene = 'a number path with one number missing';
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, question),
        figure: numberLine(
          { min: lo, max: hi, step: 1, labels: 'none', marks },
          { alt: scene, asserts: assertsAnswerOf(`mark:${String(unknownIdx)}`) },
        ),
        answer: { value: String(answer), acceptableForms: numForms(answer), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_neighbour_v1', params: { n, kind }, seed: r.uint() },
        hintLadder:
          kind === 'before'
            ? ['Walk backwards one step on the path.', 'Say the counting words and stop one step early.']
            : kind === 'after'
              ? ['Take one step forward on the path.', 'Say the counting words and take the next one.']
              : ['Look at the empty spot between the two numbers.', 'Count up from the smaller one.'],
        errorTags: ['fact-recall', 'concept-misconception'],
        authorMeta: metaOf(`neighbour-${kind}`),
      };
      return draft;
    });
}

/** Smallest / biggest of three drawn sets — ordering in a tap-sized answer mode. */
export function pickExtreme(opts: { which: 'smallest' | 'biggest'; min: number; max: number }): ItemGen {
  const { which } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const picked = r.shuffle(distinctPool(opts.min, opts.max, 3, 'pickExtreme')).slice(0, 3);
      const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
      const targetIdx = picked.indexOf(which === 'smallest' ? Math.min(...picked) : Math.max(...picked));
      const scene = picked.map((c, i) => countNoun(c, nouns[i])).join(', ');
      const { choices, correctKey } = makeChoices(
        r,
        `the ${nouns[targetIdx]}`,
        picked
          .map((c, i) => ({ c, i }))
          .filter(({ i }) => i !== targetIdx)
          .map(({ c, i }) => ({
            text: `the ${nouns[i]}`,
            errorTag: 'representation-misread' as ErrorTag,
            rationale: `That group shows ${String(c)} - judged by how the group looks, not by counting.`,
          })),
      );
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, `Tap the group with the ${which === 'smallest' ? 'fewest' : 'most'}.`),
        figure: counterGroups(
          picked.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
          { relation: 'compare', alt: scene, asserts: assertsParam('a', 'group:0') },
        ),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${nouns[targetIdx]}`], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_pick_extreme_v1',
          // `a` is the first row's count (the figure's assertion handle);
          // counts/nouns let verifyFor re-find the extreme independently.
          params: { a: picked[0], counts: picked, nouns, which },
          seed: r.uint(),
        },
        hintLadder: ['Count every group before you choose.', 'A long line is not always the bigger number.'],
        errorTags: ['representation-misread', 'concept-misconception'],
        authorMeta: metaOf('order-sets'),
      };
      return draft;
    });
}

// ===========================================================================
// 6. Patterns  (A11)
// ===========================================================================

const PATTERN_UNITS: Record<'AB' | 'ABB' | 'AAB', ReadonlyArray<0 | 1>> = {
  AB: [0, 1],
  ABB: [0, 1, 1],
  AAB: [0, 0, 1],
};

/** The element at 0-based position `i` of a repeating unit. */
function patternAt(kind: 'AB' | 'ABB' | 'AAB', i: number): 0 | 1 {
  const unit = PATTERN_UNITS[kind];
  return unit[i % unit.length];
}

/**
 * What comes next in an AB / ABB / AAB pattern.
 *
 * The figure draws the run as single counters in order and STOPS before the
 * answer, so the picture states the pattern without completing it. It carries no
 * assertion on purpose: what the picture claims here is an ORDER, not a number,
 * and the guarantee is structural — the drawn run and the choices come from the
 * same `patternAt` call. The registered `verifyFor` re-derives the next element
 * so QG-11 proves the keyed option is the truth.
 */
export function patternNext(opts: { kind: 'AB' | 'ABB' | 'AAB'; length?: number }): ItemGen {
  const { kind } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const unit = PATTERN_UNITS[kind].length;
      const len = opts.length ?? unit * 2;
      const [nounA, nounB] = twoNouns(r);
      const nouns = [nounA, nounB];
      const run = Array.from({ length: len }, (_, i) => patternAt(kind, i));
      const nextIdx = patternAt(kind, len);
      const nextNoun = nouns[nextIdx];
      const otherNoun = nouns[1 - nextIdx];
      const scene = run.map((slot) => unitFor(1, nouns[slot])).join(', ');
      const { choices, correctKey } = makeChoices(r, `the ${nextNoun}`, [
        {
          text: `the ${otherNoun}`,
          errorTag: 'concept-misconception',
          rationale: 'Swaps every time - reads any pattern as a simple back-and-forth.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, 'What comes next in the pattern?'),
        figure: counterGroups(
          run.map((slot) => ({ count: 1, noun: nouns[slot] })),
          { alt: scene },
        ),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${nextNoun}`], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_pattern_next_v1',
          params: { kind, len, nounA, nounB },
          seed: r.uint(),
        },
        hintLadder: ['Say the pattern out loud from the start.', 'Listen for the part that keeps coming back.'],
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: metaOf('pattern-next'),
      };
      return draft;
    });
}

// ===========================================================================
// 7. Picture join & take-away  (A14–A18)
// ===========================================================================

/** Join two groups and count them all. The picture asserts the total. */
export function pictureJoin(opts: { min: number; max: number; maxTotal?: number }): ItemGen {
  const maxTotal = opts.maxTotal ?? 10;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      // Draw the first group with room left for a legal second, so the joined
      // total can never quietly exceed the week's declared number range.
      const a = r.int(opts.min, Math.max(opts.min, Math.min(opts.max, maxTotal - opts.min)));
      const b = r.int(opts.min, Math.max(opts.min, Math.min(opts.max, maxTotal - a)));
      const noun = r.pick(COUNTABLE_NOUNS);
      const scene = `${countNoun(a, noun)} and ${countNoun(b, noun)} together`;
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(scene, `How many ${noun} in all?`),
        figure: counterGroups(
          [{ count: a, noun }, { count: b, noun }],
          { relation: 'join', alt: scene, asserts: assertsAnswer },
        ),
        answer: {
          value: String(a + b),
          acceptableForms: numForms(a + b, noun),
          validation: 'exact-numeric',
          units: noun,
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_join_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['Both groups belong to the story now.', 'Start on the bigger group and count the other on.'],
        errorTags: ['task-comprehension', 'procedure-slip'],
        authorMeta: metaOf('join', { situationType: 'combine' }),
      };
      return draft;
    });
}

/** Take away: one group with the removed counters crossed out; count what is left. */
export function pictureTakeAway(opts: { min: number; max: number }): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(Math.max(2, opts.min), opts.max);
      const b = r.int(1, a - 1);
      const noun = r.pick(COUNTABLE_NOUNS);
      const scene = `${countNoun(a, noun)} with ${String(b)} crossed out`;
      const draft: ItemDraft = {
        type: 'word-problem',
        prompt: scenePrompt(scene, `How many ${noun} are left?`),
        figure: counterGroups(
          [{ count: a, noun }],
          { relation: 'remove', crossedOut: b, alt: scene, asserts: assertsAnswerOf('remaining') },
        ),
        answer: {
          value: String(a - b),
          acceptableForms: numForms(a - b, noun),
          validation: 'exact-numeric',
          units: noun,
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_takeaway_v1', params: { a, b }, seed: r.uint() },
        hintLadder: ['The crossed-out ones have gone away.', 'Count only the ones still standing.'],
        errorTags: ['task-comprehension', 'representation-misread'],
        authorMeta: metaOf('take-away', { situationType: 'part-whole' }),
      };
      return draft;
    });
}

/**
 * Perceptual discrimination (A16/A18): does this picture JOIN or TAKE AWAY?
 * No arithmetic — the child reads the structure of the picture and names the
 * move, which is the decision the recipe row is about.
 */
export function joinOrTakeAway(opts: { min: number; max: number }): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const isJoin = r.chance(0.5);
      const a = r.int(Math.max(2, opts.min), opts.max);
      const b = r.int(1, Math.max(1, Math.min(a - 1, 4)));
      const noun = r.pick(COUNTABLE_NOUNS);
      const scene = isJoin
        ? `${countNoun(a, noun)} and ${countNoun(b, noun)} joined`
        : `${countNoun(a, noun)} with ${String(b)} crossed out`;
      const { choices, correctKey } = makeChoices(r, isJoin ? 'add' : 'take away', [
        {
          text: isJoin ? 'take away' : 'add',
          errorTag: 'task-comprehension',
          rationale: 'Names the other move - reads the numbers and not the picture.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, 'Does this picture add or take away?'),
        figure: isJoin
          ? counterGroups([{ count: a, noun }, { count: b, noun }], { relation: 'join', alt: scene })
          : counterGroups([{ count: a, noun }], { relation: 'remove', crossedOut: b, alt: scene }),
        choices,
        answer: {
          value: correctKey,
          acceptableForms: [isJoin ? 'add' : 'take away'],
          validation: 'choice-key',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_join_or_take_v1', params: { a, b, isJoin }, seed: r.uint() },
        hintLadder: ['Look for a plus sign or a cross-out.', 'Are things arriving, or going away?'],
        errorTags: ['task-comprehension', 'concept-misconception'],
        authorMeta: metaOf('choose-move', { isDiscrimination: true }),
      };
      return draft;
    });
}

// ===========================================================================
// 8. Teen numbers as 10 + n  (A9, A10, A23)
// ===========================================================================

/** "Ten and 3 more" → the teen numeral, seen as a full frame plus extras. */
export function teenTenAnd(opts: { min?: number; max?: number } = {}): ItemGen {
  const lo = opts.min ?? 1;
  const hi = opts.max ?? 9;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const o = r.int(lo, hi);
      const scene = `a full frame of ten and ${countNoun(o, 'counters')} more`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, `Ten and ${String(o)} more. What number?`),
        figure: tenFrame(10 + o, { frames: 2, alt: scene, asserts: assertsAnswer }),
        answer: { value: String(10 + o), acceptableForms: numForms(10 + o), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_teen_ten_and_v1', params: { o }, seed: r.uint() },
        hintLadder: ['The first frame is already a full ten.', 'Start at ten and count the extra ones on.'],
        errorTags: ['concept-misconception', 'fact-recall'],
        authorMeta: metaOf('teen-compose'),
      };
      return draft;
    });
}

/** The inverse read: a teen number is ten and HOW MANY more. */
export function teenExtra(opts: { min?: number; max?: number } = {}): ItemGen {
  const lo = opts.min ?? 11;
  const hi = opts.max ?? 19;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const n = r.int(lo, hi);
      const scene = `a full frame of ten and ${countNoun(n - 10, 'counters')} more`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, `${String(n)} is ten and how many more?`),
        figure: tenFrame(n, { frames: 2, alt: scene, asserts: assertsParam('n', 'filled') }),
        answer: { value: String(n - 10), acceptableForms: numForms(n - 10), validation: 'exact-numeric' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_teen_extra_v1', params: { n }, seed: r.uint() },
        hintLadder: ['Cover the full frame with your hand.', 'Count only what is left outside it.'],
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: metaOf('teen-decompose'),
      };
      return draft;
    });
}

// ===========================================================================
// 9. Perceptual discrimination — symbols  (A3, A4, A9, A10, A22)
// ===========================================================================

export type NumeralTrap = 'six-nine' | 'teen-ty' | 'digit-swap';

/**
 * The symbol-confusion traps §3 names by name: the 6/9 flip, thirteen-vs-thirty
 * (an AUDIO confusion, so both numerals sit side by side and the picture
 * decides), and the 24/42 digit swap. The distractor is not a decoy — it is the
 * exact numeral the named confusion produces, and `verifyFor` recomputes which
 * of the two the picture actually shows.
 */
export function numeralTrap(opts: { trap: NumeralTrap }): ItemGen {
  const { trap } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      let n: number;
      let confused: number;
      if (trap === 'six-nine') {
        n = r.chance(0.5) ? 6 : 9;
        confused = n === 6 ? 9 : 6;
      } else if (trap === 'teen-ty') {
        const o = r.int(3, 9);
        n = 10 + o;
        confused = o * 10;
      } else {
        const t = r.int(2, 4);
        // o !== t, or "the same two digits swapped" would BE the same number and
        // the trap would offer the correct answer twice.
        const opts2 = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== t && 10 * v + t <= 99);
        const o = r.pick(opts2);
        n = 10 * t + o;
        confused = 10 * o + t;
      }
      const rationale =
        trap === 'six-nine'
          ? 'The same digit turned upside down.'
          : trap === 'teen-ty'
            ? 'The teen name and the tens name sound alike.'
            : 'The same two digits in the other order.';
      const { choices, correctKey } = makeChoices(r, String(n), [
        { text: String(confused), errorTag: 'representation-misread', rationale },
      ]);
      // Each trap gets the picture that can actually SAY its number: a row for a
      // single digit, a double frame for a teen, tens-towers-plus-loose-ones for
      // a two-digit swap (which no ten-frame can hold — its cap is twenty).
      const scene =
        trap === 'six-nine'
          ? `${countNoun(n, 'buttons')} in a row`
          : trap === 'teen-ty'
            ? `two frames holding ${countNoun(n, 'counters')}`
            : `${countNoun(Math.floor(n / 10), 'towers')} of ten and ${countNoun(n % 10, 'loose blocks')}`;
      const figure =
        trap === 'six-nine'
          ? counters(n, 'buttons', { arrangement: 'in a row', alt: scene, asserts: assertsParam('n') })
          : trap === 'teen-ty'
            ? tenFrame(n, { frames: 2, size: 10, alt: scene, asserts: assertsParam('n') })
            : counterGroups(
                [
                  ...Array.from({ length: Math.floor(n / 10) }, () => ({ count: 10, noun: 'blocks' })),
                  ...(n % 10 > 0 ? [{ count: n % 10, noun: 'blocks' }] : []),
                ],
                { arrangement: 'towers', alt: scene, asserts: assertsParam('n') },
              );
      const draft: ItemDraft = {
        type: 'representation',
        prompt: scenePrompt(scene, 'Tap the number that shows how many.'),
        figure,
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_numeral_trap_v1', params: { n, trap }, seed: r.uint() },
        hintLadder: ['Count the picture before you look at the numbers.', 'Say the number you counted out loud, slowly.'],
        errorTags: ['representation-misread', 'concept-misconception'],
        authorMeta: metaOf('numeral-trap', { isDiscrimination: true }),
      };
      return draft;
    });
}

// ===========================================================================
// 10. Direct comparison  (A5, A19, A20)
// ===========================================================================

/**
 * Which group has more / fewer — the one-to-one comparison item.
 *
 * The figure uses `relation: 'compare'` (rows stacked partner above partner on a
 * shared pitch) and deliberately does NOT enable `showPairs` or `markExtra`:
 * threading the match and ringing the leftovers is the child's work, and a
 * picture that draws them has answered the question.
 */
export function compareSets(opts: { which: 'more' | 'fewer'; min: number; max: number }): ItemGen {
  const { which } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const a = r.int(opts.min, opts.max);
      let b = r.int(opts.min, opts.max);
      if (b === a) b = a === opts.max ? a - 1 : a + 1;
      const [nounA, nounB] = twoNouns(r);
      const winner = which === 'more' ? (a > b ? nounA : nounB) : a < b ? nounA : nounB;
      const loser = winner === nounA ? nounB : nounA;
      const scene = `a row of ${countNoun(a, nounA)} above a row of ${countNoun(b, nounB)}`;
      const { choices, correctKey } = makeChoices(r, `the ${winner}`, [
        {
          text: `the ${loser}`,
          errorTag: 'concept-misconception',
          rationale: 'Judged by how the row LOOKS instead of matching one to one.',
        },
        {
          text: 'they are the same',
          errorTag: 'representation-misread',
          rationale: 'Treats two rows of the same length as the same number.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, `Which row has ${which}?`),
        figure: counterGroups(
          [{ count: a, noun: nounA, label: nounA }, { count: b, noun: nounB, label: nounB }],
          { relation: 'compare', alt: scene, asserts: assertsParam('a', 'group:0') },
        ),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${winner}`], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_compare_sets_v1',
          params: { a, b, nounA, nounB, which },
          seed: r.uint(),
        },
        hintLadder: ['Match them up one for one.', 'Whichever row runs out first has fewer.'],
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: metaOf('compare-sets', { isDiscrimination: true }),
      };
      return draft;
    });
}

export type MeasureAttr = 'length' | 'weight' | 'capacity';

/**
 * Direct comparison of a measurable attribute, decided by a figure.
 *
 * - `length` draws two bars to ONE shared scale, so the comparison is the
 *   picture (and the assertion proves the first bar is drawn at its stated
 *   length).
 * - `weight` and `capacity` are compared through a common unit — how many
 *   blocks the thing balances, how many cups it fills — which is the
 *   band-appropriate honest model and, unlike a drawn balance or jug, is
 *   something the counters primitive can actually say.
 */
export function compareMeasure(opts: { attr: MeasureAttr }): ItemGen {
  const { attr } = opts;
  const SCENES: Record<MeasureAttr, { things: ReadonlyArray<readonly [string, string]>; unit: string; question: string }> = {
    length: {
      things: [['red ribbon', 'blue ribbon'], ['green string', 'yellow string'], ['long stick', 'short stick']],
      unit: 'steps',
      question: 'Which one is longer?',
    },
    weight: {
      things: [['bag', 'ball'], ['book', 'leaf'], ['rock', 'feather']],
      unit: 'blocks',
      question: 'Which one is heavier?',
    },
    capacity: {
      things: [['jug', 'mug'], ['pot', 'cup'], ['bucket', 'bowl']],
      unit: 'cups',
      question: 'Which one holds more?',
    },
  };
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const scene0 = SCENES[attr];
      const [thingA, thingB] = r.pick(scene0.things);
      const a = r.int(4, 9);
      let b = r.int(2, 8);
      if (b === a) b = a > 4 ? a - 2 : a + 2;
      const winner = a > b ? thingA : thingB;
      const loser = a > b ? thingB : thingA;
      const verb = attr === 'length' ? 'measures' : attr === 'weight' ? 'balances' : 'fills';
      const scene = `the ${thingA} ${verb} ${countNoun(a, scene0.unit)}, the ${thingB} ${verb} ${countNoun(b, scene0.unit)}`;
      const { choices, correctKey } = makeChoices(r, `the ${winner}`, [
        {
          text: `the ${loser}`,
          errorTag: 'concept-misconception',
          rationale: 'Chose by how big the thing looks, not by the units it measures.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, scene0.question),
        figure:
          attr === 'length'
            ? barModel(
                [
                  { label: thingA, segments: [{ value: a, fill: 'solid' }] },
                  { label: thingB, segments: [{ value: b, fill: 'soft' }] },
                ],
                { scaleMax: Math.max(a, b), alt: scene, asserts: assertsParam('a', 'bar:0') },
              )
            : counterGroups(
                [
                  { count: a, noun: scene0.unit, label: thingA },
                  { count: b, noun: scene0.unit, label: thingB },
                ],
                { relation: 'compare', alt: scene, asserts: assertsParam('a', 'group:0') },
              ),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${winner}`], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_compare_measure_v1',
          params: { a, b, attr, thingA, thingB },
          seed: r.uint(),
        },
        hintLadder: ['Both were measured with the same unit.', 'Count the units for each one and compare.'],
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: metaOf(`compare-${attr}`, { isDiscrimination: true }),
      };
      return draft;
    });
}

// ===========================================================================
// 11. Shape & solid choice  (A7, A21)
// ===========================================================================

interface FlatShape {
  name: string;
  corners: number;
  build: (rotation: number) => Parameters<typeof shapeFigure>[0];
}

const FLAT_SHAPES: readonly FlatShape[] = [
  {
    name: 'triangle',
    corners: 3,
    build: (rotation) => ({ shape: 'triangle', angles: [60, 60, 60], sideMarks: [1, 1, 1], rotation }),
  },
  {
    name: 'square',
    corners: 4,
    build: (rotation) => ({ shape: 'quadrilateral', angles: [90, 90, 90, 90], sideMarks: [1, 1, 1, 1], rotation }),
  },
  {
    name: 'pentagon',
    corners: 5,
    build: (rotation) => ({ shape: 'polygon', sides: 5, rotation }),
  },
  {
    name: 'hexagon',
    corners: 6,
    build: (rotation) => ({ shape: 'polygon', sides: 6, rotation }),
  },
];

/**
 * Name the flat shape. `tilt: true` rotates it, which is A7's whole point — a
 * square turned on its corner is still a square, and "diamond" is offered as the
 * distractor because that is precisely what a child calls it.
 */
export function shapeName(opts: { tilt?: boolean } = {}): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const shape = opts.tilt ? FLAT_SHAPES[1] : r.pick(FLAT_SHAPES);
      const rotation = opts.tilt ? r.int(30, 50) : 0;
      const others = FLAT_SHAPES.filter((s) => s.name !== shape.name);
      const distractors = opts.tilt
        ? [
            {
              text: 'diamond',
              errorTag: 'concept-misconception' as ErrorTag,
              rationale: 'Renames the shape because it is turned - a turned square is still a square.',
            },
            {
              text: r.pick(others).name,
              errorTag: 'representation-misread' as ErrorTag,
              rationale: 'Names a shape with a different number of corners.',
            },
          ]
        : r.shuffle(others).slice(0, 2).map((s) => ({
            text: s.name,
            errorTag: 'representation-misread' as ErrorTag,
            rationale: `That shape has ${countNoun(s.corners, 'corners')}, not ${countNoun(shape.corners, 'corners')}.`,
          }));
      const { choices, correctKey } = makeChoices(r, shape.name, distractors);
      const scene = opts.tilt ? `a ${shape.name} turned on its corner` : `a ${shape.name}`;
      const draft: ItemDraft = {
        type: 'classification',
        prompt: scenePrompt(scene, 'Tap the name of this shape.'),
        figure: shapeFigure(shape.build(rotation), { alt: scene }),
        choices,
        answer: { value: correctKey, acceptableForms: [shape.name], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: {
          templateId: 'a_shape_name_v1',
          params: { corners: shape.corners, tilt: opts.tilt === true },
          seed: r.uint(),
        },
        hintLadder: ['Run your finger round the edge and feel the corners.', 'Count the corners - turning it never changes them.'],
        errorTags: ['concept-misconception', 'representation-misread'],
        authorMeta: metaOf('name-shape', opts.tilt ? { isDiscrimination: true } : {}),
      };
      return draft;
    });
}

/** Count the corners of a drawn shape — the property behind the name. */
export function shapeCorners(opts: { tilt?: boolean } = {}): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const shape = r.pick(FLAT_SHAPES);
      const rotation = opts.tilt ? r.int(20, 60) : 0;
      const scene = opts.tilt ? `a ${shape.name} turned round` : `a ${shape.name}`;
      const draft: ItemDraft = {
        type: 'computation',
        prompt: scenePrompt(scene, 'How many corners does it have?'),
        figure: shapeFigure(shape.build(rotation), { alt: scene }),
        answer: {
          value: String(shape.corners),
          acceptableForms: numForms(shape.corners),
          validation: 'exact-numeric',
        },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_shape_corners_v1', params: { corners: shape.corners }, seed: r.uint() },
        hintLadder: ['Put a finger on one corner to start.', 'Go round once and stop where you began.'],
        errorTags: ['procedure-slip', 'representation-misread'],
        authorMeta: metaOf('count-corners'),
      };
      return draft;
    });
}

interface Solid {
  name: string;
  rolls: boolean;
  stacks: boolean;
}
const SOLIDS: readonly Solid[] = [
  { name: 'ball', rolls: true, stacks: false },
  { name: 'box', rolls: false, stacks: true },
  { name: 'can', rolls: true, stacks: true },
  { name: 'cone', rolls: true, stacks: false },
];

/**
 * The roll / stack test (A21). Solids have **no figure primitive** — the nine
 * shipped families draw flat figures only — so this item is deliberately
 * text-and-choice and must be paired on its day with a pictorial item to keep
 * `pictorialPerDay` satisfied. Flagged in the report rather than faked with a
 * flat picture pretending to be a solid.
 */
export function solidChoice(opts: { test: 'rolls' | 'stacks' }): ItemGen {
  const { test } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const yes = SOLIDS.filter((s) => s[test]);
      const no = SOLIDS.filter((s) => !s[test]);
      const correct = r.pick(yes);
      const wrong = r.pick(no);
      const { choices, correctKey } = makeChoices(r, `the ${correct.name}`, [
        {
          text: `the ${wrong.name}`,
          errorTag: 'concept-misconception',
          rationale: test === 'rolls' ? 'Has flat faces, so it slides instead of rolling.' : 'Has no flat face to rest another on.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'classification',
        prompt: ask(test === 'rolls' ? 'Which one rolls?' : 'Which one can we stack?'),
        choices,
        answer: { value: correctKey, acceptableForms: [`the ${correct.name}`], validation: 'choice-key' },
        difficulty,
        strand: 'computational',
        isRetrieval: false,
        generator: { templateId: 'a_solid_v1', params: { name: correct.name, test }, seed: r.uint() },
        hintLadder: ['Think about giving each one a gentle push.', 'Flat faces stay put; curved faces travel.'],
        errorTags: ['concept-misconception', 'task-comprehension'],
        authorMeta: metaOf('choose-solid'),
      };
      return draft;
    });
}

// ===========================================================================
// 12. "Help the puppet" — the band-A error-analysis form  (every week)
// ===========================================================================

export type PuppetSlip = 'double-count' | 'skip-count' | 'count-back-start' | 'teen-writing';

/**
 * Help-the-puppet error analysis.
 *
 * §3's rules, all four kept: a NAMED puppet made the slip (never "a student");
 * the child fixes it by TAPPING, not writing; the word "wrong" never appears
 * ("Pip got mixed up!"); and the numeric truth is recomputed by a registered
 * `verifyFor`, so QG-11 proves the shown slip is a genuine misconception output
 * and the keyed option is the true value. The slip values are not invented —
 * each is what its named mistake actually produces:
 *   double-count      n + 1      (one object touched twice)
 *   skip-count        n − 1      (one object never touched)
 *   count-back-start  a − b + 1  (counting back starting ON the start number)
 *   teen-writing      digits swapped (31 written for thirteen)
 */
export function puppetSlip(opts: { slip: PuppetSlip; min?: number; max?: number }): ItemGen {
  const { slip } = opts;
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const puppet = r.pick(PUPPETS);
      const noun = r.pick(COUNTABLE_NOUNS);

      if (slip === 'count-back-start') {
        const a = r.int(Math.max(4, opts.min ?? 4), opts.max ?? 10);
        const b = r.int(1, Math.min(3, a - 1));
        const correct = a - b;
        const wrong = correct + 1;
        const scene = `${countNoun(a, noun)} with ${String(b)} crossed out`;
        const { choices, correctKey } = makeChoices(r, String(correct), [
          {
            text: String(wrong),
            errorTag: 'procedure-slip',
            rationale: 'Counted back starting ON the first number, so one step was never taken.',
          },
        ]);
        const draft: ItemDraft = {
          type: 'error-analysis',
          prompt: scenePrompt(scene, `${puppet} says ${String(wrong)}. Tap the right number.`),
          figure: counterGroups(
            [{ count: a, noun }],
            { relation: 'remove', crossedOut: b, alt: scene, asserts: assertsParam('a', 'group:0') },
          ),
          choices,
          answer: { value: correctKey, acceptableForms: [String(correct)], validation: 'choice-key' },
          difficulty,
          strand: 'noncomputational',
          isRetrieval: false,
          generator: { templateId: 'a_verify_countback_slip_v1', params: { a, b }, seed: r.uint() },
          hintLadder: ['Count back with the puppet and watch the first step.', 'The first step back lands on the next number down.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
          authorMeta: metaOf('puppet-fix', { isErrorAnalysis: true }),
        };
        return draft;
      }

      if (slip === 'teen-writing') {
        // 11 is its own reversal, so the "puppet wrote it backwards" slip would
        // offer the right answer twice. Excluded at the SOURCE, and the verify
        // template refuses a palindrome too, so neither half can drift.
        const teens: number[] = [];
        for (let v = Math.max(12, opts.min ?? 11); v <= (opts.max ?? 19); v++) {
          if (Number(String(v).split('').reverse().join('')) !== v) teens.push(v);
        }
        const n = r.pick(teens);
        const wrong = Number(String(n).split('').reverse().join(''));
        const scene = `a full frame of ten and ${countNoun(n - 10, 'counters')} more`;
        const { choices, correctKey } = makeChoices(r, String(n), [
          {
            text: String(wrong),
            errorTag: 'representation-misread',
            rationale: 'Writes the digits in the order the teen name says them.',
          },
        ]);
        const draft: ItemDraft = {
          type: 'error-analysis',
          prompt: scenePrompt(scene, `${puppet} wrote ${String(wrong)}. Tap the right number.`),
          figure: tenFrame(n, { frames: 2, alt: scene, asserts: assertsParam('n') }),
          choices,
          answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
          difficulty,
          strand: 'noncomputational',
          isRetrieval: false,
          generator: { templateId: 'a_verify_teen_write_v1', params: { n }, seed: r.uint() },
          hintLadder: ['A teen number always starts with its ten.', 'Which digit tells the ten? It goes first.'],
          errorTags: ['representation-misread', 'concept-misconception'],
          authorMeta: metaOf('puppet-fix', { isErrorAnalysis: true }),
        };
        return draft;
      }

      const n = r.int(Math.max(3, opts.min ?? 3), opts.max ?? 9);
      const wrong = slip === 'double-count' ? n + 1 : n - 1;
      const scene = `${countNoun(n, noun)} scattered`;
      const { choices, correctKey } = makeChoices(r, String(n), [
        {
          text: String(wrong),
          errorTag: slip === 'double-count' ? 'representation-misread' : 'procedure-slip',
          rationale:
            slip === 'double-count'
              ? 'One object was touched twice, so the count ran one too far.'
              : 'One object was never touched, so the count stopped one too soon.',
        },
      ]);
      const draft: ItemDraft = {
        type: 'error-analysis',
        prompt: scenePrompt(scene, `${puppet} says ${String(wrong)}. Tap the right number.`),
        figure: counters(n, noun, { arrangement: 'scattered', alt: scene, asserts: assertsParam('n') }),
        choices,
        answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_verify_count_slip_v1', params: { n, slip }, seed: r.uint() },
        hintLadder: ['Count with the puppet and watch their finger.', 'Cross each one off as it is counted.'],
        errorTags: ['representation-misread', 'procedure-slip'],
        authorMeta: metaOf('puppet-fix', { isErrorAnalysis: true }),
      };
      return draft;
    });
}

// ===========================================================================
// 13. Day-5 oral production  (the R-flagged half of the A signature)
// ===========================================================================

/**
 * Sort-and-tell: the child sorts the pictured groups and SAYS how they knew.
 * The telling is oral and manual-reviewed (the honest not-fully-computable
 * part), while the picture it is told about is code-drawn. Also the item that
 * satisfies the dual-strand coupling gate, which wants one non-computational
 * item demanding a justification.
 */
export function sortAndTell(opts: { min: number; max: number }): ItemGen {
  return (rng: Rng, guard: TupleGuard, difficulty: number) =>
    drawUniqueItem(rng, guard, (r) => {
      const picked = r.shuffle(distinctPool(opts.min, opts.max, 3, 'sortAndTell')).slice(0, 3);
      const nouns = r.shuffle([...COUNTABLE_NOUNS]).slice(0, 3);
      const order = picked
        .map((c, i) => ({ c, noun: nouns[i] }))
        .sort((x, y) => x.c - y.c)
        .map((e) => e.noun);
      const scene = picked.map((c, i) => countNoun(c, nouns[i])).join(', ');
      const draft: ItemDraft = {
        type: 'reasoning',
        prompt: scenePrompt(scene, 'Sort them, fewest first. Tell how you know.'),
        figure: counterGroups(
          picked.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
          { relation: 'compare', alt: scene, asserts: assertsParam('a', 'group:0') },
        ),
        answer: { value: order.join(', '), acceptableForms: [], validation: 'manual-review' },
        difficulty,
        strand: 'noncomputational',
        isRetrieval: false,
        generator: { templateId: 'a_sort_and_tell_v1', params: { a: picked[0] }, seed: r.uint() },
        hintLadder: ['Count each group before you move any cards.', 'Say the number for each group as you place it.'],
        errorTags: ['task-comprehension', 'representation-misread'],
        authorMeta: metaOf('sort-and-tell'),
      };
      return draft;
    });
}

// ===========================================================================
// Template registry — QG-5 answers, QG-11 truths
// ===========================================================================

type Params = Record<string, unknown>;

function num(p: Params, key: string): number {
  const v = p[key];
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new Error(`earlynumber template param '${key}' missing or non-numeric`);
  }
  return v;
}

function str(p: Params, key: string): string {
  const v = p[key];
  if (typeof v !== 'string') throw new Error(`earlynumber template param '${key}' missing or non-string`);
  return v;
}

function arrOf(p: Params, key: string): unknown[] {
  const v = p[key];
  if (!Array.isArray(v) || v.length === 0) {
    throw new Error(`earlynumber template param '${key}' missing or not a non-empty array`);
  }
  return v;
}

/** Corner count → the shape a child names it by (A7's property-first stance). */
const SHAPE_BY_CORNERS: Record<number, string> = {
  3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon',
};

/** Which solids pass which test — the truth `a_solid_v1` re-derives. */
const SOLID_PROPS: Record<string, { rolls: boolean; stacks: boolean }> = {
  ball: { rolls: true, stacks: false },
  box: { rolls: false, stacks: true },
  can: { rolls: true, stacks: true },
  cone: { rolls: true, stacks: false },
};

export const EARLYNUMBER_TEMPLATE_DEFS: Array<AnswerDef | VerifyDef> = [
  // --- counting ------------------------------------------------------------
  { id: 'a_count_v1', answerFor: (p) => String(num(p, 'n')) },
  { id: 'a_count_tens_v1', answerFor: (p) => String(10 * num(p, 'k')) },
  // --- numeral ↔ set -------------------------------------------------------
  // Both are choice items, so their truth registers as a `verifyFor` (QG-11),
  // not an `answerFor` the arithmetic audit would skip. Chained with the
  // figure's own assertion this closes the loop: QG-13 proves the picture holds
  // n, QG-11 proves the option keyed correct is the one naming n.
  { id: 'a_numeral_for_set_v1', verifyFor: (p) => ({ correct: String(num(p, 'n')) }) },
  {
    id: 'a_set_for_numeral_v1',
    verifyFor: (p) => {
      const n = num(p, 'n');
      const counts = arrOf(p, 'counts');
      const nouns = arrOf(p, 'nouns');
      const i = counts.indexOf(n);
      if (i < 0) throw new Error(`a_set_for_numeral_v1: no group holds ${String(n)}`);
      return { correct: String(nouns[i]) };
    },
  },
  // --- ten-frame -----------------------------------------------------------
  { id: 'a_frame_read_v1', answerFor: (p) => String(num(p, 'n')) },
  { id: 'a_frame_build_v1', answerFor: (p) => String(num(p, 'n')) },
  { id: 'a_frame_empty_v1', answerFor: (p) => String(num(p, 'cap') - num(p, 'filled')) },
  // --- partners (the band-A algebra thread) --------------------------------
  { id: 'a_partner_hidden_v1', answerFor: (p) => String(num(p, 'total') - num(p, 'shown')) },
  { id: 'a_partner_box_v1', answerFor: (p) => String(num(p, 'total') - num(p, 'shown')) },
  {
    // Every ordered way to make `total` — the completeness claim, code-built.
    id: 'a_all_ways_v1',
    answerFor: (p) => {
      const total = num(p, 'total');
      const pairs: string[] = [];
      for (let a = 0; a <= total; a++) pairs.push(`${String(a)}+${String(total - a)}`);
      return pairs.join('; ');
    },
  },
  // --- order & neighbours --------------------------------------------------
  {
    id: 'a_neighbour_v1',
    answerFor: (p) => {
      const n = num(p, 'n');
      switch (str(p, 'kind')) {
        case 'before': return String(n - 1);
        case 'after': return String(n + 1);
        case 'between': return String(n + 1);
        default: throw new Error(`a_neighbour_v1: bad kind '${String(p.kind)}'`);
      }
    },
  },
  {
    id: 'a_pick_extreme_v1',
    verifyFor: (p) => {
      const counts = arrOf(p, 'counts').map(Number);
      const nouns = arrOf(p, 'nouns');
      const want = str(p, 'which') === 'smallest' ? Math.min(...counts) : Math.max(...counts);
      return { correct: String(nouns[counts.indexOf(want)]) };
    },
  },
  // --- patterns: the next element is the CLAIM, so it registers a verify ---
  {
    id: 'a_pattern_next_v1',
    verifyFor: (p) => {
      const kind = str(p, 'kind') as 'AB' | 'ABB' | 'AAB';
      const unit = PATTERN_UNITS[kind];
      if (!unit) throw new Error(`a_pattern_next_v1: bad kind '${kind}'`);
      const nouns = [str(p, 'nounA'), str(p, 'nounB')];
      return { correct: nouns[unit[num(p, 'len') % unit.length]] };
    },
  },
  // --- join / take away ----------------------------------------------------
  { id: 'a_join_v1', answerFor: (p) => String(num(p, 'a') + num(p, 'b')) },
  { id: 'a_takeaway_v1', answerFor: (p) => String(num(p, 'a') - num(p, 'b')) },
  {
    id: 'a_join_or_take_v1',
    verifyFor: (p) => ({ correct: p.isJoin === true ? 'add' : 'take away' }),
  },
  // --- teen numbers as 10 + n ----------------------------------------------
  { id: 'a_teen_ten_and_v1', answerFor: (p) => String(10 + num(p, 'o')) },
  { id: 'a_teen_extra_v1', answerFor: (p) => String(num(p, 'n') - 10) },
  // --- perceptual discrimination -------------------------------------------
  { id: 'a_numeral_trap_v1', verifyFor: (p) => ({ correct: String(num(p, 'n')) }) },
  {
    id: 'a_compare_sets_v1',
    verifyFor: (p) => {
      const a = num(p, 'a');
      const b = num(p, 'b');
      const first = str(p, 'nounA');
      const second = str(p, 'nounB');
      const more = a > b ? first : second;
      const fewer = a > b ? second : first;
      return { correct: str(p, 'which') === 'more' ? more : fewer };
    },
  },
  {
    id: 'a_compare_measure_v1',
    verifyFor: (p) => ({ correct: num(p, 'a') > num(p, 'b') ? str(p, 'thingA') : str(p, 'thingB') }),
  },
  // --- shapes & solids -----------------------------------------------------
  {
    // The name is DERIVED from the corner count the figure was built with, so a
    // tilted square keyed as "diamond" would be caught rather than trusted.
    id: 'a_shape_name_v1',
    verifyFor: (p) => {
      const name = SHAPE_BY_CORNERS[num(p, 'corners')];
      if (!name) throw new Error(`a_shape_name_v1: no shape with ${String(p.corners)} corners`);
      return { correct: name };
    },
  },
  { id: 'a_shape_corners_v1', answerFor: (p) => String(num(p, 'corners')) },
  {
    // Not an echo: the named solid is looked up and must actually PASS the test
    // the item asks about, so a keyed "the box rolls" fails to recompute.
    id: 'a_solid_v1',
    verifyFor: (p) => {
      const name = str(p, 'name');
      const test = str(p, 'test');
      const props = SOLID_PROPS[name];
      if (!props || (test !== 'rolls' && test !== 'stacks')) {
        throw new Error(`a_solid_v1: unknown solid "${name}" or test "${test}"`);
      }
      if (!props[test]) throw new Error(`a_solid_v1: the ${name} does not ${test}`);
      return { correct: name };
    },
  },
  // --- help-the-puppet: {correct, wrong} so QG-11 proves BOTH halves -------
  {
    id: 'a_verify_count_slip_v1',
    verifyFor: (p) => {
      const n = num(p, 'n');
      const slip = str(p, 'slip');
      if (slip !== 'double-count' && slip !== 'skip-count') {
        throw new Error(`a_verify_count_slip_v1: bad slip '${slip}'`);
      }
      return { correct: String(n), wrong: String(slip === 'double-count' ? n + 1 : n - 1) };
    },
  },
  {
    id: 'a_verify_countback_slip_v1',
    verifyFor: (p) => {
      const diff = num(p, 'a') - num(p, 'b');
      return { correct: String(diff), wrong: String(diff + 1) };
    },
  },
  {
    id: 'a_verify_teen_write_v1',
    verifyFor: (p) => {
      const n = num(p, 'n');
      const wrong = String(n).split('').reverse().join('');
      // A palindrome (11) makes the slip indistinguishable from the truth — the
      // item would offer its own answer as the distractor. Refuse to certify it.
      if (Number(wrong) === n) throw new Error(`a_verify_teen_write_v1: ${String(n)} reads the same reversed`);
      return { correct: String(n), wrong };
    },
  },
  // --- Day-5 oral production ------------------------------------------------
  { id: 'a_sort_and_tell_v1' }, // manual-review: the telling is the open part
];
