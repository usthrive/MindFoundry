/**
 * Level C · Week 17 — "Fractions of a set" (conceptId: fractions-of-a-set).
 *
 * FILL-ARCHITECTURE §5 row C17: anchor "share the set into equal groups";
 * multi-step "fraction-of-set then add or remove"; error-analysis "answers with
 * the denominator"; discrimination "1/3 of 12 vs 3 of 12"; Day-5 signature "two
 * stories for 1/4 of 8".
 *
 * The week's whole claim is that the BOTTOM number of a fraction counts SHARES,
 * never objects — so "1/3 of 12" and "3 of 12" are different instructions that
 * land on different numbers. Everything is built to force that choice:
 *  - a cross-op discrimination whose first distractor IS the denominator (the
 *    "3 of 12" reading) and whose second is the set with the denominator taken
 *    off it — the two things a child does when they grab the bottom number;
 *  - a structural sibling that offers the same contrast as PHRASES rather than
 *    numbers, so the child names the difference instead of computing past it;
 *  - a generated error-analysis whose shown wrong number is the denominator,
 *    reached honestly (see below);
 *  - four genuine two-step items ("share then add", "share then remove", and one
 *    carrying a quantity that is NOT used), plus an inverse-start single-step
 *    where the SHARE is given and the whole set is the unknown.
 *
 * WHOLE-COUNTERS LAW: every drawn set is a multiple of its denominator, so the
 * fraction of the set is always a whole number of objects. Half a counter cannot
 * be shared, drawn or handed to a child, and a story that produces one is a lie
 * about the model. Every `draw` here builds the set AS `d × groupSize`, so the
 * property holds by construction rather than by a filter that might miss.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7): the pictures on DAY items show
 * the set BEFORE it is shared — loose counters, or one undivided bar — and
 * assert the total, which the prompt already states. The sharing is the work, so
 * a picture that drew the groups would hand it over. The one exception is the
 * inverse item, where the SHARE is the given and the whole is the unknown: there
 * the picture shows the single known share and asserts its size. Pictures that
 * DO show the finished sharing live where the answer is already on the page —
 * the lesson script and the modeled/completion guided examples.
 *
 * ERROR-ANALYSIS NOTE (the one place the engine had to be met halfway). The
 * recipe's misconception is "answers with the denominator", and no shared verify
 * template implements a "report the bottom number" transform — there is provably
 * no honest params pair for `d_verify_*` whose `wrong` is the denominator of the
 * stated fraction while its `correct` is that fraction OF the set (the algebra
 * forces a degenerate family). The item therefore poses the COMPLEMENT question,
 * where the denominator IS a real computed quantity: for "1/5 of 20 pebbles
 * tipped out", the truth is `20 − 4` (the pebbles left) and the misconception
 * output is `20 ÷ 4` — literally "how many equal groups there are", which is the
 * bottom number of the fraction and exactly what the denominator-answerer wrote.
 * Both numbers are code-computed by `d_verify_binop_misconception_v1` over
 * params that describe the item's own arithmetic, so nothing is fabricated and
 * the child still meets a student who answered 5 to a question about pebbles.
 *
 * Retrieval is backward-only into C9 (sharing/grouping division — the substrate
 * this week names with a fraction), C16 (comparing fractions), C12 (the ×/÷
 * facts a share rests on) and C3/C4 (± within 1,000).
 */

import {
  addWhole,
  asWarmup,
  classify,
  divideExact,
  fracCompareChoice,
  multiply,
  reasoning,
  subWhole,
} from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtFrac, unitFor, wholeMoney } from '../lib/format';
import { gcd } from '../lib/compute';
import { frame } from '../lib/contexts';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsAnswerOf, assertsParam, barModel, counterGroups, counters } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C9 = { level: 'C' as const, week: 9 };
const C12 = { level: 'C' as const, week: 12 };
const C15 = { level: 'C' as const, week: 15 };
const C16 = { level: 'C' as const, week: 16 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/** Denominators a Level-C child can share a set into and still see the groups. */
const DEN = [2, 3, 4, 5, 6] as const;

/**
 * A set built as `d` equal shares of `size`, so the fraction of it is ALWAYS a
 * whole number of objects and the total stays inside what a picture can draw
 * (`counters` refuses more than 30). This is the week's whole-counters law in
 * one function — no draw here builds a set any other way.
 */
function shareSet(r: Rng, sizeLo = 2, sizeHi = 5, dens: readonly number[] = DEN): { d: number; size: number; whole: number } {
  const d = r.pick(dens);
  const size = r.int(sizeLo, sizeHi);
  return { d, size, whole: d * size };
}

/** Denominators with at least one coprime numerator of 2 or more. */
const MULTI_SHARE_DEN = [3, 4, 5, 6] as const;

/**
 * A numerator of 2 or more that shares no factor with `d`, so the stated
 * fraction is in lowest terms AND asks for more than one share — the contrast
 * that keeps the several-shares items from collapsing into the unit-share ones.
 * (`coprimeNumerator` would happily return 1, which is the other generator.)
 */
function sharesToKeep(r: Rng, d: number): number {
  const options: number[] = [];
  for (let i = 2; i < d; i++) if (gcd(i, d) === 1) options.push(i);
  return options.length ? r.pick(options) : 1;
}

// ---------------------------------------------------------------------------
// Context — one frame per generator, so no two pages in a day share a scene.
// Nouns and their containers come from the bound registry (contexts.ts) wherever
// a container is named; the verb/preposition column is local grammar.
// ---------------------------------------------------------------------------

const sceneOf = (r: Rng, id: string): { group: string; noun: string } => {
  const f = frame(id);
  return { group: f.group ?? 'box', noun: r.pick(f.nouns) };
};

/**
 * Noun + an attribute that is genuinely TRUE of it — a subset of the registry's
 * ATTRIBUTE_PAIRS chosen so this generator's scene collides with no other page
 * in the week. Drawing noun and adjective from separate pools is what once
 * produced "1/4 of the marbles are ripe".
 */
const SET_ATTRIBUTES = [
  { noun: 'marbles', attribute: 'blue' },
  { noun: 'shells', attribute: 'spotted' },
  { noun: 'cards', attribute: 'shiny' },
  { noun: 'buttons', attribute: 'wooden' },
] as const;

/** Scenes for the numeric discrimination — a container that can hold a set. */
const TRAP_SCENES = [
  { group: 'box', noun: 'crayons' },
  { group: 'tub', noun: 'blocks' },
  { group: 'folder', noun: 'photos' },
] as const;

/** Collectables for the phrase discrimination — no container needed. */
const PHRASE_NOUNS = ['stamps', 'tokens', 'acorns'] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep / discrimination) have no figure
// slot and lib/ is not ours to edit, so this wrapper does what `withEstimateFirst`
// does: it works entirely inside the returned closure, takes no new rng draw, and
// leaves the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It
// reads the drafted item's `generator.params` — the very numbers the answer was
// computed from — so the figure law ("built from the item's own drawn values")
// holds by construction, exactly as it does for a figure built inside a generator.
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);
const strOf = (p: Params, k: string): string => String(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C9 — sharing a set equally. The move this week is about to give a name to. */
const wDivide = asWarmup(divideExact(2, 6, 2, 9), C9);
/** C12 — the fact table a share is read off. */
const wMultiply = asWarmup(multiply(2, 9, 2, 9), C12);
/** C16 — which fraction is greater; keeps the bottom-number meaning warm. */
const wFracCompare = asWarmup(fracCompareChoice(), C16);
const wAdd = asWarmup(addWhole(124, 468), C3);
const wSub = asWarmup(subWhole(152, 884), C4);

// ---------------------------------------------------------------------------
// Single-step fractions of a set
// ---------------------------------------------------------------------------

/**
 * The anchor form: a whole set, shared into d equal groups, one group taken.
 * The picture shows the set STILL UNSHARED and asserts the total the prompt
 * already states, so the sharing — which is the question — stays with the child.
 */
const sfShare = withFigure(
  situation({
    situationType: 'sharing',
    cognitiveOp: 'frac-of-set',
    draw: (r) => {
      const { d, whole } = shareSet(r, 3, 5);
      const s = sceneOf(r, 'orchard');
      const name = one(r);
      return {
        prompt: `[image: ${countNoun(whole, s.noun)} in a loose pile] ${name} tips ${countNoun(whole, s.noun)} out and shares them equally between ${countNoun(d, s.group)}, so one ${s.group} holds ${fmtFrac(1, d)} of them. How many ${unitFor(2, s.noun)} are in one ${s.group}?`,
        answerValue: String(whole / d),
        templateId: 'd_frac_times_whole_v1',
        params: { k: whole, n: 1, d, noun: s.noun, group: s.group },
        units: s.noun,
        hints: [
          'How many equal shares does the bottom number of the fraction ask for?',
          'Deal the whole pile out one at a time, a turn for each share, and count what a single share ends up with.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'k'), strOf(p, 'noun'), {
      arrangement: 'scattered',
      alt: `${countNoun(numOf(p, 'k'), strOf(p, 'noun'))} in a loose pile, not yet shared`,
      asserts: assertsParam('k'),
    }),
);

/**
 * The part-of-a-collection form: a NON-unit fraction of the set, so the child
 * must take several shares rather than one. The bar shows the collection whole
 * and undivided — the child draws the partition.
 */
const sfPartWhole = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'frac-of-set',
    draw: (r) => {
      const { d, whole } = shareSet(r, 2, 5, MULTI_SHARE_DEN);
      // Lowest terms, and never a single share: a real collection is described
      // as 3/4 blue, never as 6/8 blue — and "1/4 blue" is the other generator.
      const n = sharesToKeep(r, d);
      const a = r.pick(SET_ATTRIBUTES);
      const name = one(r);
      return {
        prompt: `${name} lays out ${countNoun(whole, a.noun)}. ${fmtFrac(n, d)} of them are ${a.attribute}. How many ${unitFor(2, a.noun)} are ${a.attribute}?`,
        answerValue: String((whole * n) / d),
        templateId: 'd_frac_times_whole_v1',
        params: { k: whole, n, d, noun: a.noun },
        units: a.noun,
        hints: [
          'Which number in the fraction tells you how many equal groups to make, and which tells you how many to keep?',
          'Cut the whole collection into that many equal groups first, then count up only the groups the story keeps.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  (p) =>
    barModel(
      [{ label: 'the whole collection', segments: [{ value: numOf(p, 'k') }], total: String(numOf(p, 'k')) }],
      {
        scaleMax: numOf(p, 'k'),
        alt: `one unbroken bar standing for all ${countNoun(numOf(p, 'k'), strOf(p, 'noun'))}`,
        asserts: assertsParam('k'),
      },
    ),
);

/** The comparison form: a second set that is a fraction AS MANY as the first. */
const sfCompare = situation({
  situationType: 'comparison',
  cognitiveOp: 'frac-of-set',
  draw: (r) => {
    const { d, whole } = shareSet(r, 3, 6);
    const s = sceneOf(r, 'bookshelf');
    const first = one(r);
    let second = one(r);
    if (second === first) second = first === 'Zoe' ? 'Ken' : 'Zoe';
    return {
      prompt: `${first} owns ${countNoun(whole, s.noun)}. ${second} owns ${fmtFrac(1, d)} as many ${unitFor(2, s.noun)} as ${first}. How many ${unitFor(2, s.noun)} does ${second} own?`,
      answerValue: String(whole / d),
      templateId: 'd_frac_times_whole_v1',
      params: { k: whole, n: 1, d, noun: s.noun },
      units: s.noun,
      hints: [
        'Does "a fraction as many" make the second collection larger or smaller than the first?',
        'Share the first collection into the number of equal groups the bottom number names, and read off one of them.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * Inverse-start (PEDAGOGY-CEILING-REVIEW F3, the Level-C ceiling lift): the
 * SHARE is stated and the whole set is the unknown, so the opening move is the
 * one the sentence order does not hand over. The picture shows the known share
 * and asserts its size — here that is a given, not the answer.
 */
const sfMissingWhole = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'frac-of-set-inverse',
    draw: (r) => {
      const { d, size } = shareSet(r, 3, 6);
      const s = sceneOf(r, 'packing');
      const name = one(r);
      return {
        prompt: `[image: one ${s.group} holding ${countNoun(size, s.noun)}] One ${s.group} holds ${countNoun(size, s.noun)}, and that ${s.group} is ${fmtFrac(1, d)} of all of ${name}'s ${s.noun}. How many ${unitFor(2, s.noun)} does ${name} have altogether?`,
        answerValue: String(size * d),
        templateId: 'd_mul_v1',
        params: { a: size, b: d, noun: s.noun, group: s.group },
        units: s.noun,
        hints: [
          'Is the number you are given one share, or the whole collection?',
          'Copy that single share once for every share the bottom number names, then count the lot.',
        ],
        errorTags: ['task-comprehension', 'representation-misread'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'a'), strOf(p, 'noun'), {
      alt: `one ${strOf(p, 'group')} holding ${countNoun(numOf(p, 'a'), strOf(p, 'noun'))}`,
      asserts: assertsParam('a'),
    }),
);

/** Metacognition base — only ever served through the estimate-first wrapper. */
const sfMoney = situation({
  situationType: 'money-change',
  cognitiveOp: 'frac-of-set',
  draw: (r) => {
    const { d, whole } = shareSet(r, 3, 6);
    const item = r.pick(['eraser', 'pencil', 'badge']);
    const name = one(r);
    return {
      prompt: `${name} has ${wholeMoney(whole)} saved and spends ${fmtFrac(1, d)} of it on ${item}s. How much does ${name} spend?`,
      answerValue: String(whole / d),
      templateId: 'd_frac_times_whole_v1',
      params: { k: whole, n: 1, d },
      units: 'dollars',
      acceptableForms: [wholeMoney(whole / d)],
      hints: [
        'Is the money being split into equal parts, or spent all at once?',
        'Break the saved amount into the number of equal parts the bottom number names, and hand over one part.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});
const sfMoneyEstimate = withEstimateFirst(
  sfMoney,
  'will the amount spent be more than half of the savings, or less?',
);

// ---------------------------------------------------------------------------
// Multi-step: "fraction of the set, THEN add or remove" (the C17 recipe row)
// ---------------------------------------------------------------------------

/** Take a share of the set, then add a few more of the same thing. */
const msShareThenAdd = multiStep({
  situationType: 'combine',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    const { d, size, whole } = shareSet(r, 3, 6);
    // The extra must not be the size of a share, or "threads 1/3 of them, then 6
    // more" reads as a second share and blurs the boundary this item draws. It
    // also stays small beside the share, so the story is a share plus a
    // handful — not a handful with a share attached.
    let extra = r.int(2, 6);
    if (extra === size) extra = size === 2 ? 3 : size - 1;
    const s = sceneOf(r, 'bead-craft');
    const name = one(r);
    return {
      prompt: `${name} has ${countNoun(whole, s.noun)} in a bowl, threads ${fmtFrac(1, d)} of them onto a bracelet, then adds ${extra} more ${unitFor(extra, s.noun)} to the bracelet. How many ${unitFor(2, s.noun)} are on the bracelet?`,
      initN: whole,
      steps: [
        { op: 'mul', n: 1, d },
        { op: 'add', n: extra, d: 1 },
      ],
      units: s.noun,
      hints: [
        'Does the question ask about the share taken, or about the bracelet at the very end?',
        'Take the share first and count it, then bring in the few that were added afterwards.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/** Take a share of the set, then take some of that share back out again. */
const msShareThenRemove = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    const { d, whole } = shareSet(r, 3, 6, MULTI_SHARE_DEN);
    const n = sharesToKeep(r, d);
    const moved = (whole * n) / d;
    // At least two are left in the tin, so the story never resolves to nothing.
    const back = r.int(2, Math.min(6, Math.max(2, moved - 2)));
    const s = sceneOf(r, 'baking');
    const name = one(r);
    return {
      prompt: `A ${s.group} holds ${countNoun(whole, s.noun)}. ${name} lifts ${fmtFrac(n, d)} of them into a tin, then takes ${back} of those ${unitFor(2, s.noun)} back out. How many ${unitFor(2, s.noun)} are in the tin now?`,
      initN: whole,
      steps: [
        { op: 'mul', n, d },
        { op: 'sub', n: back, d: 1 },
      ],
      units: s.noun,
      hints: [
        'Is the last sentence describing a new set, or a change to the set already in the tin?',
        'Move the whole share across first, then take away the few that come back.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * The same two-step shape, posed with a quantity that is NOT used
 * (PEDAGOGY-CEILING-REVIEW F3 `has-distractor`): every item in the corpus
 * consuming every number it states quietly teaches "use all the numbers".
 */
const msSeedsWithSpare = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'multi-step',
  posing: 'has-distractor',
  draw: (r) => {
    const { d, size, whole } = shareSet(r, 3, 6);
    let more = r.int(2, 6);
    if (more === size) more = size === 2 ? 3 : size - 1;
    const cans = r.int(2, 4);
    const name = one(r);
    return {
      prompt: `${name} has ${countNoun(whole, 'seeds')} in a packet, plants ${fmtFrac(1, d)} of them in the front bed, then plants ${more} more seeds in the same bed. A shed by the gate holds ${countNoun(cans, 'watering cans')}. How many seeds are planted in the front bed?`,
      initN: whole,
      steps: [
        { op: 'mul', n: 1, d },
        { op: 'add', n: more, d: 1 },
      ],
      units: 'seeds',
      hints: [
        'Which numbers in this story are counting seeds, and which one is counting something else?',
        'Plant the share first, then the few added after it — and leave the number that counts other things alone.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — "1/3 of 12" against "3 of 12", the week's point as a CHOICE
// ---------------------------------------------------------------------------

/**
 * The numeric form. The first distractor IS the denominator ("3 of 12"), the
 * second is the set with the denominator taken off it — between them they cover
 * both things a child does after grabbing the bottom number.
 */
const discrimShareVsCount = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    // Halves are excluded here: "1/2 of 10 vs 2 of 10" is a much duller trap
    // than "1/3 of 12 vs 3 of 12", and this item exists for the sharp version.
    const d = r.pick(MULTI_SHARE_DEN);
    let size = r.int(3, 6);
    // size === d would print the correct answer twice over: the share and the
    // bottom number would be the same numeral, and the trap would vanish.
    if (size === d) size = d === 6 ? 3 : d + 1;
    const whole = d * size;
    const s = r.pick(TRAP_SCENES);
    const name = one(r);
    return {
      prompt: `${name} keeps ${countNoun(whole, s.noun)} in a ${s.group}. Which number is ${fmtFrac(1, d)} of the ${whole} ${s.noun}?`,
      correct: String(size),
      distractors: [
        {
          text: String(d),
          errorTag: 'concept-misconception',
          rationale: `Reads the bottom number as a handful of ${s.noun} — "${d} of the ${whole}" — when it is counting the equal shares the set is broken into.`,
        },
        {
          text: String(whole - d),
          errorTag: 'representation-misread',
          rationale: 'Takes the bottom number away from the set, as though a fraction removed that many objects rather than naming a share.',
        },
      ],
      hints: [
        'Does the bottom number count objects, or count the equal shares?',
        'Break the collection into that many equal shares, then read how much a single share holds.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The structural sibling: the same contrast as PHRASES, so the child names the
 * difference rather than computing past it. The swap distractor ("d groups of
 * the whole set") is the multiply reading, which the Day-5 items revisit.
 */
const discrimWhichPhrase = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const d = r.pick(MULTI_SHARE_DEN);
    let size = r.int(3, 6);
    if (size === d) size = d === 6 ? 3 : d + 1;
    const whole = d * size;
    const noun = r.pick(PHRASE_NOUNS);
    const name = one(r);
    return {
      prompt: `${name} shares ${countNoun(whole, noun)} into ${countNoun(d, 'equal groups')} and picks up one group. Which phrase describes what ${name} picked up?`,
      correct: `${fmtFrac(1, d)} of the ${countNoun(whole, noun)}`,
      distractors: [
        {
          text: `${countNoun(d, noun)} out of the ${whole}`,
          errorTag: 'concept-misconception',
          rationale: 'Names the bottom number as a count of objects, so the phrase describes a small handful rather than one of the equal shares.',
        },
        {
          text: `${countNoun(d, 'groups')} of ${countNoun(whole, noun)}`,
          errorTag: 'representation-misread',
          rationale: 'Copies the whole collection once per group, which grows the collection rather than breaking it up.',
        },
      ],
      hints: [
        'What is the bottom number of a fraction counting in this story — objects, or shares?',
        'One share of a collection is always smaller than the collection it came from.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// See the file header: `correct` is `whole − share` (the objects left behind)
// and `wrong` is `whole ÷ share` — the number of equal groups, which is exactly
// the fraction's bottom number and exactly what the shown student wrote.
// ---------------------------------------------------------------------------

const eaAnsweredWithTheBottomNumber = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const d = r.pick([3, 4, 5, 6] as const);
    const size = r.int(3, 6);
    return { a: d * size, b: size, op: '-', wrongOp: '/' };
  },
  build: (v, p, r) => {
    const whole = Number(p.a);
    const share = Number(p.b);
    const name = one(r);
    return {
      prompt: `A jar holds ${countNoun(whole, 'pebbles')}. ${name} tips ${fmtFrac(1, whole / share)} of them into a bowl. A student was asked how many pebbles are still in the jar, and wrote ${v.wrong}.`,
      extension: `Share the ${whole} pebbles into equal groups, write how many pebbles are really still in the jar, and explain what the student's ${v.wrong} was counting.`,
      hints: [
        'What does the bottom number of the fraction count in this story?',
        'Draw the groups, ring the one that leaves the jar, and count what is still sitting in the jar.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: ['equal groups', 'shares', 'the number of groups'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC17 = makeWeekBuilder({
  level: 'C',
  week: 17,
  conceptId: 'fractions-of-a-set',
  conceptName: 'Fractions of a set',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [C9, C15, C16],
  pedagogyContract: 'v2',
  conceptualAnchor: 'share the set into equal groups',
  conceptFamily: 'operation',
  deepeningDelta:
    'C15 and C16 cut ONE whole into equal parts and named or compared those parts. C17 keeps the same bottom-number meaning but applies it to a COLLECTION of separate objects: the thing being cut is a count, the parts are groups of objects, and the answer is a number of things rather than a name for a piece. That is also why the whole must be a multiple of the bottom number here — you cannot hand a child half a counter.',
  explanation: {
    hook:
      '"One third of twelve" and "three of the twelve" both use a 3, and they are not the same instruction. One shares the whole pile out; the other just grabs a few. This week we learn to hear which one a story is asking for.',
    whyBeforeHow:
      'A fraction of a set is an instruction to share the set into equal groups, because the bottom number tells you how many equal groups to make and the top number tells you how many of those groups to keep. That is why one third of twelve is not three: the three is counting groups, not counters. Share twelve counters into three equal groups and each group holds four, so one third of twelve is four counters. The bottom number never counts objects — it counts shares. And the shares have to come out even, which is why the sets in this week always break up cleanly: nobody can hand over half a counter.',
    script: [
      {
        say: 'Watch me take one third of twelve shells. I do not touch the twelve yet — first I read the bottom number, and it tells me to make three equal groups. Four here, four here, four here. Now one third is one of those groups.',
        visual: 'Twelve shells dealt into three baskets, four in each.',
        figure: counterGroups(
          [
            { count: 4, noun: 'shells', label: 'share' },
            { count: 4, noun: 'shells', label: 'share' },
            { count: 4, noun: 'shells', label: 'share' },
          ],
          { alt: 'twelve shells dealt into three equal shares of four' },
        ),
      },
      {
        say: 'Here is the trap, side by side. The short bar is three shells picked off the top — that is "three of the twelve". The long bar is one whole share — that is "one third of the twelve". Same numbers in the story, and the bars are not even close.',
        visual: 'A short bar of three beside a longer bar of four, both against the twelve.',
        figure: barModel(
          [
            { label: 'three of the twelve', segments: [{ value: 3, label: '3', fill: 'hatch' }], total: '3' },
            { label: 'one third of the twelve', segments: [{ value: 4, label: '4' }], total: '4' },
            { label: 'the whole set', segments: [{ value: 4 }, { value: 4 }, { value: 4 }], total: '12' },
          ],
          { scaleMax: 12, alt: 'a short bar of three, a longer bar of four, and the whole set of twelve drawn as three fours' },
        ),
      },
      {
        say: 'When the top number is bigger than one, I keep more than one share. Twenty counters, five equal rows of four, and three fifths means I keep three of those rows: twelve counters.',
        visual: 'A twenty-counter array in five rows of four, with three rows shaded.',
        figure: areaGrid(
          { rows: 5, cols: 4, shadedRows: 3, rowLabels: ['4', '4', '4', '4', '4'] },
          { alt: 'twenty counters in five rows of four, with three whole rows shaded' },
        ),
      },
      {
        say: 'Before I share anything I check roughly where the answer should land: one share out of several has to be a good deal smaller than the whole pile, and keeping most of the shares has to land close to the whole pile. If my answer breaks that, I grabbed the bottom number by mistake and I go back to the groups.',
        visual: 'The whole pile beside a single share, so the size difference is obvious.',
      },
    ],
    summary:
      'The bottom number of a fraction tells you how many equal groups to share the set into; the top number tells you how many groups to keep. Share first, then count. If a set will not share evenly, that fraction of it is not a whole number of objects.',
    vocabulary: [
      { term: 'set', kidGloss: 'a collection of separate things you can count' },
      { term: 'equal share', kidGloss: 'one of the groups you get when a set is split so every group holds the same' },
      { term: 'bottom number', kidGloss: 'it counts the equal shares — never the objects' },
      { term: 'top number', kidGloss: 'it counts how many of those shares you keep' },
    ],
  },
  guidedExamples: [
    {
      ...ge(17, 1, 'modeled', 'Find 1/3 of 12 shells.', [
        {
          teacherSay:
            'First I read the bottom number, because that is the number that tells me what to DO: make three equal shares. I notice it is not telling me to count out three shells — three is how many groups I need, not how many shells I take.',
        },
        {
          teacherSay: 'Now I deal the twelve shells out, one at a time, three shares going round. How many shells does one share end up holding?',
          expected: '4',
        },
      ], '4'),
      visual: 'Twelve shells dealt into three equal shares.',
      figure: counterGroups(
        [
          { count: 4, noun: 'shells', label: 'share' },
          { count: 4, noun: 'shells', label: 'share' },
          { count: 4, noun: 'shells', label: 'share' },
        ],
        { alt: 'twelve shells dealt into three equal shares of four', asserts: assertsAnswerOf('group:0') },
      ),
    },
    {
      ...ge(17, 2, 'completion', 'A tray holds 20 buttons. 2/5 of the buttons are wooden. How many buttons are wooden?', [
        { teacherSay: 'What does the bottom number ask you to do to the twenty buttons?', expected: 'make 5 equal groups' },
        { childDo: 'Make the equal groups, then keep as many of them as the top number names.', expected: '8' },
      ], '8'),
      visual: 'Twenty buttons in five rows of four, with two rows shaded.',
      figure: areaGrid(
        { rows: 5, cols: 4, shadedRows: 2 },
        { alt: 'twenty buttons in five rows of four, with two whole rows shaded', asserts: assertsAnswer },
      ),
    },
    ge(17, 3, 'prompted', 'A box holds 18 crayons. How many crayons is 1/6 of the crayons in the box?', [
      { childDo: 'Name how many equal shares the bottom number asks for, then share the crayons out and read one share.', expected: '3' },
    ], '3'),
    {
      // Independent stage: ONE share only. Deciding "take the share first, then
      // deal with what was added" IS the task here, so drawing the finished
      // bracelet would hand the child the plan the item exists to ask for.
      ...ge(17, 4, 'independent', 'Ava has 16 beads in a bowl. She threads 1/4 of them onto a bracelet, then threads 3 more beads onto it. How many beads are on the bracelet? Solve cold.', [
        { childDo: 'Take the share out of the bowl first, then bring in the extra beads.', expected: '7' },
      ], '7'),
      visual: 'The bowl of sixteen beads. The bracelet is yours to work out.',
      figure: counters(16, 'beads', {
        arrangement: 'scattered',
        alt: 'sixteen beads loose in a bowl, not yet shared',
      }),
    },
  ],
  days: [
    // Day 1 — concept echo: the share, the several-shares form and the
    // comparison form, single-step only, on top of three warm-ups.
    [
      { gen: wDivide, diff: 2 },
      { gen: wFracCompare, diff: 2 },
      { gen: wMultiply, diff: 2 },
      { gen: sfShare, diff: 2 },
      { gen: sfPartWhole, diff: 3 },
      { gen: sfCompare, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first metacognition and the
    // numeric discrimination enter, and the first two-step story arrives.
    [
      { gen: wSub, diff: 2 },
      { gen: wMultiply, diff: 2 },
      { gen: sfMoneyEstimate, diff: 3 },
      { gen: discrimShareVsCount, diff: 3 },
      { gen: msShareThenAdd, diff: 4 },
      { gen: sfPartWhole, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations against a two-step "then remove".
    [
      { gen: wFracCompare, diff: 2 },
      { gen: discrimWhichPhrase, diff: 3 },
      { gen: discrimShareVsCount, diff: 4 },
      { gen: msShareThenRemove, diff: 4 },
      { gen: sfShare, diff: 3 },
      { gen: sfCompare, diff: 4 },
    ],
    // Day 4 — word problems: three genuine two-steps (including the one with a
    // quantity that must be left alone) beside the inverse-start item.
    [
      { gen: msShareThenAdd, diff: 4 },
      { gen: msShareThenRemove, diff: 4 },
      { gen: msSeedsWithSpare, diff: 5 },
      { gen: sfMissingWhole, diff: 4 },
      { gen: sfMoneyEstimate, diff: 3 },
    ],
    // Day 5 — non-computational: error-analysis + the two-stories production +
    // the even-sharing claim (+ a ramped warm-up).
    [
      { gen: wAdd, diff: 2 },
      { gen: eaAnsweredWithTheBottomNumber, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Write two different stories that both end with the question "what is 1/4 of 8?". One story must share a set of objects between people; the other must be about a different set of 8 things. Work out the answer to each story, then write one sentence saying why both stories land on the same number.',
          value: 'both stories break one set of eight into four equal shares, so one share is the same size in either story',
          acceptableForms: ['equal shares', 'equal groups', 'same size', 'one share', 'share'],
          keywords: true,
          hints: [
            'What has to be the same in both of your stories for the answer to be the same?',
            'Check that each story really splits its set into equal shares, not into any old pieces.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: 1/2 of a set of counters is a whole number of counters. In one sentence, explain how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'A set with an odd count cannot be split into two equal groups of whole counters — one counter is always left over.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads an even set as unshareable, when an even count splits into two equal groups every time.',
            },
          ],
          hints: [
            'Try it on a small even set, then try the same thing on an odd one — what changes?',
            'Deal the counters out two shares at a time and watch whether anything is left over at the end.',
          ],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the bottom number of a fraction counts SHARES, not things. If your child answers 3 for "1/3 of 12", do not correct the number — hand them 12 buttons and ask them to make three fair piles. The moment they see four in a pile, the idea lands, and that is the picture they will use all year. Keep the sets easy to share (12, 16, 20) so nobody has to cut a button in half.',
  ],
  puzzle: (r) => {
    const total = r.pick([12, 16, 18, 20, 24] as const);
    const ways: string[] = [];
    for (let d = 2; d <= total / 2; d++) {
      if (total % d === 0) ways.push(`1/${d}`);
    }
    const name = one(r);
    return {
      id: 'C17-PZ-01',
      title: 'Puzzle Grove: Every Fair Share',
      puzzleType: 'construction',
      prompt: `[image: ${countNoun(total, 'counters')} in a loose pile] ${name} wants to share ${countNoun(total, 'counters')} into equal shares, with at least 2 shares and at least 2 counters in every share. Find EVERY unit fraction that names one of those shares, and say how you know none is missing.`,
      figure: counters(total, 'counters', {
        arrangement: 'scattered',
        alt: `${countNoun(total, 'counters')} in a loose pile, not yet shared`,
      }),
      answer: { value: ways.join('; '), acceptableForms: ways, validation: 'short-text-keyword' },
      hintLadder: [
        'How could you be sure you had found them ALL, and not just some?',
        'Walk up in order — two shares, then three, then four — and stop when a share would hold fewer than two counters.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Multiplication facts to nine — the table a fair share is read off',
    sourceWeek: C12,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 9] },
  },
  mastery: [
    { gen: sfShare, diff: 3 },
    { gen: msShareThenAdd, diff: 3 },
    { gen: sfPartWhole, diff: 3 },
    { gen: msShareThenRemove, diff: 4 },
    { gen: sfCompare, diff: 3 },
    { gen: msSeedsWithSpare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step fractions of a set — the equal-share form, the several-shares form and the "a fraction as many" comparison, each keeping its own figure affordance. 02/04/06: two-step share-then-add, share-then-remove, and a share story carrying a quantity that must be left unused. Every set is drawn as a whole number of equal shares, so no form can ask for part of an object. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'answers-with-the-bottom-number',
      description: 'Reads the bottom number of the fraction as a count of objects, so "1/3 of 12" is answered with 3.',
      exampleWrongAnswer: '1/3 of 12 answered as 3',
      distractorRationale: 'Offer the denominator itself on any fraction-of-a-set choice item.',
      reteachPointer: 'explanation/script[1] (the three-of-twelve bar beside the one-third bar)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'bottom-number-taken-away',
      description: 'Grabs the bottom number and subtracts it from the set, as though a fraction removed that many objects.',
      exampleWrongAnswer: '1/3 of 12 answered as 9',
      distractorRationale: 'Offer the set with the denominator subtracted from it.',
      reteachPointer: 'guidedExamples/C17-GE-01 (the bottom number says how many shares to make, not what to take away)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-the-share',
      description: 'Finds the share correctly but answers with it, forgetting the add or remove a two-step story asks for — or, on an inverse story, answers with the share when the whole set was wanted.',
      exampleWrongAnswer: '1/4 of 16 beads then 3 more answered as 4',
      distractorRationale: 'Offer the value of the first share on two-step and inverse items.',
      reteachPointer: 'guidedExamples/C17-GE-04 (take the share, then deal with what happens next)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'uneven-shares',
      description: 'Chooses the right move but deals the set out unevenly, so the groups do not all hold the same and the share read off is one too many or one too few.',
      exampleWrongAnswer: '1/5 of 20 counted as 5',
      distractorRationale: 'Offer the share one object short.',
      reteachPointer: 'explanation/script[0] (deal one at a time, a turn for each share), then the 2-minute facts sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Fractions of a set — reading the bottom number of a fraction as an instruction to share a collection into that many equal groups, taking one or several of those groups, and telling "1/3 of 12" apart from "3 of 12". We also worked backwards from a single share to the whole collection.',
    improvingCandidates: [
      'making the groups equal before counting anything',
      'reading the bottom number as a number of shares rather than a number of things',
      'answering the question the story actually asked at the end of a two-step share',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping the bottom number in its job — it counts the fair shares, never the objects',
      },
      {
        errorTag: 'task-comprehension',
        text: 'carrying a share story through to its last sentence instead of stopping at the share',
      },
      {
        errorTag: 'representation-misread',
        text: 'telling a share of a collection apart from a few objects taken off the top',
      },
    ],
    homeFocus: {
      praiseLine:
        'You shared the whole set into equal groups before you counted, and you checked that every group held the same — that is exactly the move this week is built on.',
      questionForChild: 'If we share 12 grapes fairly between 4 people, how many does each person get — and how did you work it out?',
      schoolSyncHook: 'If your child\'s class says "one third of" where we say "1/3 of", tell us and we will match the wording they hear.',
    },
    vocabularyForParent: [
      'set (a collection of separate things you can count)',
      'equal share (one of the groups a set is split into, all the same size)',
      'the bottom number counts the shares, the top number counts how many shares you keep',
    ],
  },
});
