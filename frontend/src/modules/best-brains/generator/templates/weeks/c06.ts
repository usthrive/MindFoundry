/**
 * Level C · Week 6 — "Meeting multiplication" (conceptId: meeting-multiplication).
 *
 * The Level-C v2 EXEMPLAR. FILL-ARCHITECTURE §5 row C6: anchor "equal groups";
 * multi-step "groups then extras"; error-analysis "adds 3+4 for 3×4";
 * discrimination "3 groups of 4 vs 3 and 4"; Day-5 "draw a groups story two ways".
 *
 * The week's whole claim is that "3 groups of 4" and "3 and 4" are DIFFERENT
 * STORIES, not two spellings of one sum, so the content is built to force that
 * choice rather than decorate it:
 *  - a cross-op discrimination whose distractor IS the add-instead-of-copy
 *    output (k+n), beside a structural discrimination that separates 3 groups of
 *    4 from 4 groups of 3 — same total, different grouping — which the Day-5
 *    Always/Sometimes/Never item then resolves honestly;
 *  - a generated error-analysis whose shown wrong number is the genuine output
 *    of the add-instead-of-multiply misconception (QG-11 re-derives both);
 *  - five genuine two-step items ("groups then extras", "groups then a change",
 *    and one carrying a quantity that is NOT used — the has-distractor posing).
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7): every figure attached to a DAY
 * ITEM depicts exactly ONE group — one basket, one row, one hop — and asserts
 * that group against the item's own drawn param. The picture therefore teaches
 * the unit of count and can never hand over the product the item asks for. The
 * pictures that DO show the whole structure live where the answer is already on
 * the page: the lesson script and the modeled/completion guided examples.
 *
 * Retrieval is backward-only into C2/C3/C4 (compare, ± within 1,000) and into
 * Level B's two enabling skills — B18 skip counting and B20 repeated addition,
 * which are precisely the substrate multiplication is about to compress.
 */

import { addWhole, asWarmup, classify, compareWhole, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor, wholeMoney } from '../lib/format';
import { frame } from '../lib/contexts';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel, counterGroups, counters, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B13 = { level: 'B' as const, week: 13 };
const B18 = { level: 'B' as const, week: 18 };
const B20 = { level: 'B' as const, week: 20 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

// ---------------------------------------------------------------------------
// Context frames — container and contents drawn as ONE bound pair (contexts.ts),
// so "6 books into each basket" can never be assembled. The verb/preposition
// column is local grammar the registry does not carry.
// ---------------------------------------------------------------------------

const GROUP_FRAMES = [
  { id: 'orchard', verb: 'puts', prep: 'into' },
  { id: 'baking', verb: 'puts', prep: 'onto' },
  { id: 'packing', verb: 'packs', prep: 'into' },
  { id: 'bookshelf', verb: 'puts', prep: 'onto' },
  { id: 'bead-craft', verb: 'threads', prep: 'onto' },
] as const;

/** Frames that can also be UNLOADED, with the preposition each one needs. */
const CHANGE_FRAMES = [
  { id: 'orchard', into: 'into', outOf: 'out of', inOn: 'in' },
  { id: 'packing', into: 'into', outOf: 'out of', inOn: 'in' },
  { id: 'bead-craft', into: 'onto', outOf: 'off', inOn: 'on' },
  { id: 'bookshelf', into: 'onto', outOf: 'off', inOn: 'on' },
] as const;

interface Scene {
  group: string;
  noun: string;
}

function sceneOf(r: Rng, id: string): Scene {
  const f = frame(id);
  return { group: f.group ?? 'box', noun: r.pick(f.nouns) };
}

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep / discrimination) have no figure
// slot, and lib/ is not ours to edit, so this wrapper does what `withEstimateFirst`
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

const wAdd = asWarmup(addWhole(124, 468), C3);
const wSub = asWarmup(subWhole(152, 884), C4);
const wCompare = asWarmup(compareWhole(3), C2);

/** B20 — repeated addition, the skill this week compresses into a multiply. */
const wRepeatedAdd = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add',
    draw: (r) => {
      const per = r.int(3, 8);
      const groups = r.int(3, 5);
      const s = sceneOf(r, r.pick(GROUP_FRAMES).id);
      const chain = Array.from({ length: groups }, () => String(per)).join(' + ');
      return {
        prompt: `Each ${s.group} holds ${countNoun(per, s.noun)}. ${one(r)} counts them one ${s.group} at a time: ${chain}. How many ${unitFor(2, s.noun)} is that in all?`,
        answerValue: String(per * groups),
        templateId: 'd_mul_v1',
        params: { a: per, b: groups },
        units: s.noun,
        hints: ['How many times does the same number appear?', 'Count on by that number once for every time it appears.'],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B20,
);

/** B18 — skip counting, the fastest honest way to reach a product this week. */
const wSkip = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add',
    draw: (r) => {
      const step = r.pick([2, 5, 10] as const);
      const k = r.int(4, 6);
      const shown = Array.from({ length: k - 1 }, (_, i) => String(step * (i + 1))).join(', ');
      return {
        prompt: `${one(r)} skip-counts by ${step}s: ${shown}. What number comes next?`,
        answerValue: String(step * k),
        templateId: 'd_multiple_v1',
        params: { base: step, k },
        hints: ['What is the same jump from each number to the next one?', 'Add that jump to the last number in the list.'],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B18,
);

// ---------------------------------------------------------------------------
// Single-step equal-groups situations
// ---------------------------------------------------------------------------

/** The anchor form: k containers, each holding the same n. Figure = ONE container. */
const grpEqualGroups = withFigure(
  situation({
    situationType: 'rate',
    cognitiveOp: 'mul',
    draw: (r) => {
      const per = r.int(2, 9);
      let groups = r.int(2, 6);
      // 2 groups of 2 is the ONE pair where a + b = a × b, so a child who joins
      // instead of copying — the exact misconception this week exists to catch —
      // still lands on 4 and the item cannot see the error. Nudged
      // deterministically (never redrawn: a loop would shift every later draw).
      if (per === 2 && groups === 2) groups = 3;
      const f = r.pick(GROUP_FRAMES);
      const s = sceneOf(r, f.id);
      const name = one(r);
      return {
        prompt: `[image: one ${s.group} with ${countNoun(per, s.noun)} in it] ${name} ${f.verb} ${countNoun(per, s.noun)} ${f.prep} each of ${countNoun(groups, s.group)}. How many ${unitFor(2, s.noun)} is that in all?`,
        answerValue: String(per * groups),
        templateId: 'd_mul_v1',
        params: { a: per, b: groups, noun: s.noun, group: s.group },
        units: s.noun,
        hints: [
          'Does every group in this story hold the same amount?',
          'Draw one group, then count on by that amount once for every group in the story.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'a'), strOf(p, 'noun'), {
      alt: `one ${strOf(p, 'group')} with ${countNoun(numOf(p, 'a'), strOf(p, 'noun'))} in it`,
      asserts: assertsParam('a'),
    }),
);

/** The array form: equal groups tidied into rows. Figure = ONE row. */
const grpArray = withFigure(
  situation({
    situationType: 'area',
    cognitiveOp: 'mul',
    draw: (r) => {
      const rows = r.int(2, 7);
      let cols = r.int(2, 9);
      // Same guard as the equal-groups item: a 2×2 array is the one case where
      // joining and copying agree, so the week's own diagnostic goes blind.
      if (rows === 2 && cols === 2) cols = 3;
      const noun = r.pick(frame('tiling').nouns);
      const name = one(r);
      return {
        prompt: `[image: one row of ${countNoun(cols, noun)}] ${name} lays a path with ${countNoun(rows, 'rows')} of ${unitFor(2, noun)}. Each row has ${countNoun(cols, noun)}. How many ${unitFor(2, noun)} are in the path?`,
        answerValue: String(rows * cols),
        templateId: 'd_mul_v1',
        params: { a: rows, b: cols, noun },
        units: noun,
        hints: [
          'Which part of this path is one equal group — a row, or the whole path?',
          'Count what a single row holds, then count on by that amount once for every row.',
        ],
        errorTags: ['representation-misread', 'procedure-slip'],
      };
    },
  }),
  (p) =>
    areaGrid(
      { rows: 1, cols: numOf(p, 'b') },
      {
        alt: `one row of ${countNoun(numOf(p, 'b'), strOf(p, 'noun'))}`,
        asserts: assertsParam('b', 'cells'),
      },
    ),
);

/** The measurement form: the same LENGTH repeated, not the same count. */
const grpLaps = situation({
  situationType: 'measurement',
  cognitiveOp: 'mul',
  draw: (r) => {
    const lap = r.int(4, 12);
    const laps = r.int(2, 6);
    const name = one(r);
    return {
      prompt: `One lap of the school track is ${countNoun(lap, 'm')}. ${name} runs ${countNoun(laps, 'laps')}. How far does ${name} run in all?`,
      answerValue: String(lap * laps),
      templateId: 'd_mul_v1',
      params: { a: lap, b: laps },
      units: 'm',
      hints: [
        'Is the question asking about one lap, or about the whole run?',
        'Lay the same length down again for every lap, then read how far that reaches.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** The number-line form: equal hops. Figure = ONE hop on an honest ruler. */
const grpHops = withFigure(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'mul',
    draw: (r) => {
      const hop = r.int(2, 9);
      // Three hops minimum: two hops is a double, and doubling is not yet a
      // convincing reason to reach for a multiply.
      const hops = r.int(3, 5);
      const name = one(r);
      return {
        prompt: `${name} starts at 0 on a number line. Every hop moves ${countNoun(hop, 'places')} forward. Where does ${name} land after ${countNoun(hops, 'hops')}?`,
        answerValue: String(hop * hops),
        templateId: 'd_mul_v1',
        params: { a: hop, b: hops },
        hints: [
          'Are the hops all the same size, or do they change?',
          'Start at zero and count on by one hop at a time until every hop is used.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  (p) => {
    const hop = numOf(p, 'a');
    // The line's length depends ONLY on the hop size (never on how many hops),
    // so the ruler cannot leak the landing point the item asks for.
    const max = 10 * Math.ceil((hop * 6) / 10);
    return numberLine(
      {
        min: 0,
        max,
        step: 5,
        labels: 'majors',
        marks: [{ at: hop, label: String(hop), style: 'flag' }],
        hops: [{ from: 0, to: hop, label: 'one hop' }],
      },
      {
        alt: `a number line from 0 to ${max} with one hop of ${countNoun(hop, 'places')} marked from 0`,
        asserts: assertsParam('a', 'mark:0'),
      },
    );
  },
);

/** Metacognition base — only ever served through the estimate-first wrapper. */
const grpPrice = situation({
  situationType: 'rate',
  cognitiveOp: 'mul',
  draw: (r) => {
    const price = r.int(2, 9);
    // At least three, so the estimate probe ("close to one, or many times one?")
    // is a real call rather than a coin flip between doubling and not.
    const count = r.int(3, 6);
    const item = r.pick(['pass', 'badge', 'sticker sheet', 'pencil']);
    const name = one(r);
    return {
      prompt: `Each ${item} costs ${wholeMoney(price)}. ${name} buys ${countNoun(count, item)}. How much does ${name} pay in all?`,
      answerValue: String(price * count),
      templateId: 'd_mul_v1',
      params: { a: price, b: count },
      units: 'dollars',
      acceptableForms: [wholeMoney(price * count)],
      hints: [
        'Are all of these the same price, or different prices?',
        'Pay for one, then pay that same amount again for each one after it.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});
const grpPriceEstimate = withEstimateFirst(
  grpPrice,
  'will the total be close to the price of one, or many times that price?',
);

// ---------------------------------------------------------------------------
// Multi-step: "groups then extras" (the C6 recipe row) and its two siblings
// ---------------------------------------------------------------------------

/** Equal groups, then a few MORE of the same thing that are not a whole group. */
const msGroupsThenExtras = multiStep({
  situationType: 'combine',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    const per = r.int(3, 8);
    const groups = r.int(3, 6);
    // The extra must not be the size of a whole group: "puts 4 in each of 6
    // baskets, then adds 4 more" reads as a seventh basket, which blurs exactly
    // the boundary this item exists to draw.
    let extra = r.int(2, 9);
    if (extra === per) extra = per === 2 ? 3 : per - 1;
    const f = r.pick(GROUP_FRAMES);
    const s = sceneOf(r, f.id);
    const name = one(r);
    return {
      prompt: `${name} ${f.verb} ${countNoun(per, s.noun)} ${f.prep} each of ${countNoun(groups, s.group)}, then adds ${countNoun(extra, s.noun)} more. How many ${unitFor(2, s.noun)} is that in all?`,
      initN: per,
      steps: [
        { op: 'mul', n: groups, d: 1 },
        { op: 'add', n: extra, d: 1 },
      ],
      units: s.noun,
      hints: [
        'Does the question ask about one container, or about everything at the end?',
        'Fill the equal containers first, then bring in what was added afterwards.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/** Equal groups, then a CHANGE to one of them — the extras trap in reverse. */
const msGroupsThenChange = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'multi-step',
  draw: (r) => {
    const per = r.int(4, 9);
    const groups = r.int(3, 6);
    const taken = r.int(2, per - 1);
    const f = r.pick(CHANGE_FRAMES);
    const s = sceneOf(r, f.id);
    const name = one(r);
    return {
      prompt: `${name} puts ${countNoun(per, s.noun)} ${f.into} each of ${countNoun(groups, s.group)}, then takes ${countNoun(taken, s.noun)} back ${f.outOf} one ${s.group}. How many ${unitFor(2, s.noun)} are ${f.inOn} the ${unitFor(2, s.group)} now?`,
      initN: per,
      steps: [
        { op: 'mul', n: groups, d: 1 },
        { op: 'sub', n: taken, d: 1 },
      ],
      units: s.noun,
      hints: [
        'Is the last sentence adding a new group, or changing a group that is already there?',
        'Build every equal group first, then take away what leaves.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * Same two-step shape, posed with a quantity that is NOT used
 * (PEDAGOGY-CEILING-REVIEW F3 `has-distractor`): every item in the corpus
 * consuming every number it states quietly teaches "use all the numbers".
 */
const msRowsWithSpare = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'multi-step',
  posing: 'has-distractor',
  draw: (r) => {
    const per = r.int(4, 8);
    const rows = r.int(3, 6);
    const more = r.int(2, 9);
    const cans = r.int(2, 4);
    const name = one(r);
    return {
      prompt: `${name} plants ${countNoun(per, 'seedlings')} in each of ${countNoun(rows, 'rows')}, then plants ${countNoun(more, 'seedlings')} more along the fence. A shed by the gate holds ${countNoun(cans, 'watering cans')}. How many seedlings does ${name} plant in all?`,
      initN: per,
      steps: [
        { op: 'mul', n: rows, d: 1 },
        { op: 'add', n: more, d: 1 },
      ],
      units: 'seedlings',
      hints: [
        'Which numbers in this story are counting seedlings, and which one is not?',
        'Plant the equal rows first, then the few by the fence — and leave the number that counts something else alone.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's point, forced as a CHOICE
// ---------------------------------------------------------------------------

const TRAP_SCENES = [
  { group: 'bag', noun: 'marbles' },
  { group: 'box', noun: 'crayons' },
  { group: 'pocket', noun: 'coins' },
  { group: 'tin', noun: 'buttons' },
] as const;

/** "k groups of n" vs "k and n": the distractor IS the add-instead-of-copy output. */
const discrimGroupsVsSum = discrimination({
  variant: 'cross-op',
  draw: (r) => {
    let groups = r.int(2, 8);
    let per = r.int(2, 9);
    // (2,2) is the one pair where the sum and the product collide, which would
    // print two identical options.
    if (groups === 2 && per === 2) {
      groups = 3;
      per = r.int(3, 9);
    }
    const s = r.pick(TRAP_SCENES);
    const name = one(r);
    return {
      prompt: `${name} has ${countNoun(groups, s.group)}. Each ${s.group} holds ${countNoun(per, s.noun)}. Which number tells how many ${s.noun} ${name} has in all?`,
      correct: String(groups * per),
      distractors: [
        {
          text: String(groups + per),
          errorTag: 'concept-misconception',
          rationale: `Joins the two numbers as though the story read "${groups} and ${per}" — one pile beside another, not ${groups} copies of a group.`,
        },
        {
          text: String(per),
          errorTag: 'task-comprehension',
          rationale: 'Answers with what ONE container holds and stops, leaving the other containers uncounted.',
        },
      ],
      hints: [
        'Does this story join two different piles, or copy one equal group?',
        'Picture the containers side by side, then count on by what one container holds.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The structural sibling: which ADDITION matches "k groups of n"? The swap
 * distractor (n copies of k) reaches the same total and is still the wrong
 * grouping — the Day-5 Always/Sometimes/Never item is where that same-total fact
 * gets its honest hearing.
 */
const discrimWhichAddition = discrimination({
  variant: 'structural',
  cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const groups = r.int(3, 5);
    let per = r.int(3, 6);
    if (per === groups) per = groups === 6 ? 3 : groups + 1;
    const name = one(r);
    const repeat = (value: number, times: number) => Array.from({ length: times }, () => String(value)).join(' + ');
    return {
      prompt: `${name} makes ${countNoun(groups, 'equal groups')}, with ${countNoun(per, 'counters')} in every group. Which addition matches what ${name} made?`,
      correct: repeat(per, groups),
      distractors: [
        {
          text: `${groups} + ${per}`,
          errorTag: 'concept-misconception',
          rationale: 'Adds the number of groups to the size of a group — that is two piles joined once, not equal groups.',
        },
        {
          text: repeat(groups, per),
          errorTag: 'representation-misread',
          rationale: 'Repeats the number of GROUPS instead of the size of a group. It reaches the same total, but it describes a different arrangement.',
        },
      ],
      hints: [
        'What repeats in this story — the number of groups, or the size of one group?',
        'The number being added again and again is the size of ONE group.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
// ---------------------------------------------------------------------------

const eaAddedInsteadOfGrouped = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(3, 8), b: r.int(3, 9), op: '*', wrongOp: '+' }),
  build: (v, p, r) => {
    const name = one(r);
    return {
      prompt: `A student read this story: "Each tray holds ${countNoun(Number(p.b), 'rolls')}. ${name} bakes ${countNoun(Number(p.a), 'trays')}." The student wrote that ${name} baked ${v.wrong} rolls.`,
      extension: 'Draw the trays, write how many rolls there really are, and explain what the student heard in the story.',
      hints: [
        'Which of the two numbers in the story tells the size of one group?',
        'Draw the groups, then count what the picture really makes.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC06 = makeWeekBuilder({
  level: 'C',
  week: 6,
  conceptId: 'meeting-multiplication',
  conceptName: 'Meeting multiplication',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [B18, B20, C3],
  pedagogyContract: 'v2',
  conceptualAnchor: 'equal groups',
  conceptFamily: 'operation',
  explanation: {
    hook:
      '"Three and four" lands on seven. "Three groups of four" lands on twelve. The same two numbers, and the answers are not even close — this week we learn to hear which one a story is asking for.',
    whyBeforeHow:
      'Multiplication is a shortcut for counting equal groups, and the shortcut is only safe because every group holds exactly the same amount — if one basket held five and the next held three, counting by fives would never land on the truth. That is why we check that the groups match before we count anything. "Three groups of four" tells you to copy one group over and over; "three and four" tells you to join two different piles once. Same two numbers, two different pictures, two different totals.',
    script: [
      {
        say: 'Watch me build three equal groups. I put four shells in this basket, four in the next, four in the last. Every basket holds the same amount — that is what makes them EQUAL groups, and it is the only reason a shortcut is allowed.',
        visual: 'Three baskets, each holding four shells.',
        figure: counterGroups(
          [
            { count: 4, noun: 'shells', label: 'basket' },
            { count: 4, noun: 'shells', label: 'basket' },
            { count: 4, noun: 'shells', label: 'basket' },
          ],
          { alt: 'three baskets, each holding four shells' },
        ),
      },
      {
        say: 'Now a different story with the same two numbers: three counters here, four counters there, pushed together once. That is "three and four", and it lands on seven.',
        visual: 'A pile of three counters joined to a pile of four counters.',
        figure: counterGroups(
          [
            { count: 3, noun: 'counters', label: 'three' },
            { count: 4, noun: 'counters', label: 'four' },
          ],
          { relation: 'join', alt: 'a pile of three counters joined to a pile of four counters, seven in all' },
        ),
      },
      {
        say: 'Back to the groups. Three groups of four, tidied into rows: four, eight, twelve. I can write that short as 3 × 4, and the short way still means "three groups of four".',
        visual: 'Three rows with four counters in each row.',
        figure: areaGrid(
          { rows: 3, cols: 4, rowLabels: ['4', '4', '4'] },
          { alt: 'three rows with four counters in each row, twelve counters in all' },
        ),
      },
      {
        say: 'Before I work out any "groups of" problem I check the size I expect: more than one whole group means the answer has to be a good deal bigger than one group. If my answer is only a little bigger, I joined two piles when I meant to copy a group.',
        visual: 'The joined piles beside the copied groups: a short bar of seven and a long bar of twelve.',
        figure: barModel(
          [
            { label: 'three and four', segments: [{ value: 3, label: '3' }, { value: 4, label: '4', fill: 'hatch' }], total: '7' },
            { label: 'three groups of four', segments: [{ value: 4 }, { value: 4 }, { value: 4 }], total: '12' },
          ],
          { scaleMax: 12, alt: 'a bar of seven from joining three and four, beside a longer bar of twelve from three groups of four' },
        ),
      },
    ],
    summary:
      'Equal groups all hold the same amount. "Groups of" tells you to copy a group again and again, so you multiply; "and" tells you to join two piles once, so you add. Skip-count the groups to check that your answer is the right size.',
    vocabulary: [
      { term: 'equal groups', kidGloss: 'groups that all hold the same amount' },
      { term: 'groups of', kidGloss: 'the signal to copy one group again and again — that is a multiply' },
      { term: 'multiply (×)', kidGloss: 'a short way to add the same number over and over' },
      { term: 'array', kidGloss: 'equal groups tidied into rows and columns' },
    ],
  },
  guidedExamples: [
    {
      ...ge(6, 1, 'modeled', 'Ria puts 4 shells into each of 3 baskets. How many shells is that in all?', [
        {
          teacherSay:
            'First I hunt for the words that promise the groups are equal: "into each of" — every basket gets four, not four in one and two in another. That tells me I may copy one group instead of joining two different piles.',
        },
        {
          teacherSay: 'Now I skip-count one basket at a time — four, eight… what does the third basket take me to?',
          expected: '12',
        },
      ], '12'),
      visual: 'Three baskets, each holding four shells.',
      figure: counterGroups(
        [
          { count: 4, noun: 'shells', label: 'basket' },
          { count: 4, noun: 'shells', label: 'basket' },
          { count: 4, noun: 'shells', label: 'basket' },
        ],
        { alt: 'three baskets, each holding four shells', asserts: assertsAnswer },
      ),
    },
    {
      ...ge(6, 2, 'completion', 'A path is laid with 5 rows of tiles. Each row has 3 tiles. How many tiles are in the path?', [
        { teacherSay: 'Which part of the path is one equal group — a row, or the whole path?', expected: 'a row' },
        { childDo: 'Skip-count the rows: three, six, and keep going.', expected: '15' },
      ], '15'),
      visual: 'Five rows with three tiles in each row.',
      figure: areaGrid(
        { rows: 5, cols: 3, rowLabels: ['3', '3', '3', '3', '3'] },
        { alt: 'five rows with three tiles in each row', asserts: { of: 'cells', ...assertsAnswer } },
      ),
    },
    ge(6, 3, 'prompted', 'A tray holds 6 muffins. Leo bakes 4 trays. How many muffins does Leo bake?', [
      { childDo: 'Name the size of one group and how many groups there are, then count on.', expected: '24' },
    ], '24'),
    {
      // Independent stage: ONE string only. Deciding "equal groups first, then the
      // extra" IS the task here, so drawing the other strings would hand the child
      // the plan the item exists to ask for.
      ...ge(6, 4, 'independent', 'Ava threads 5 beads onto each of 4 strings, then adds 3 more beads. How many beads has Ava used? Solve cold.', [
        { childDo: 'Build the equal groups first, then deal with the extra.', expected: '23' },
      ], '23'),
      visual: 'One string with five beads. The other strings and the extra beads are yours to work out.',
      figure: counters(5, 'beads', { alt: 'one string with five beads on it' }),
    },
  ],
  days: [
    // Day 1 — concept echo: equal groups in three models, single-step only.
    [
      { gen: wAdd, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: wRepeatedAdd, diff: 2 },
      { gen: grpEqualGroups, diff: 2 },
      { gen: grpArray, diff: 3 },
      { gen: grpHops, diff: 3 },
    ],
    // Day 2 — fluency + application: the discrimination and the estimate-first
    // metacognition enter, and the first two-step story arrives.
    [
      { gen: wSub, diff: 2 },
      { gen: wSkip, diff: 2 },
      { gen: grpPriceEstimate, diff: 3 },
      { gen: discrimGroupsVsSum, diff: 3 },
      { gen: msGroupsThenExtras, diff: 4 },
      { gen: grpLaps, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations against a two-step change story.
    [
      { gen: wRepeatedAdd, diff: 2 },
      { gen: discrimWhichAddition, diff: 3 },
      { gen: discrimGroupsVsSum, diff: 4 },
      { gen: msGroupsThenChange, diff: 4 },
      { gen: grpArray, diff: 3 },
      { gen: grpEqualGroups, diff: 3 },
    ],
    // Day 4 — word problems: three genuine two-steps (including the one with a
    // quantity that must be left alone) beside two single-step models.
    [
      { gen: msGroupsThenExtras, diff: 4 },
      { gen: msGroupsThenChange, diff: 4 },
      { gen: msRowsWithSpare, diff: 5 },
      { gen: grpLaps, diff: 4 },
      { gen: grpHops, diff: 3 },
    ],
    // Day 5 — non-computational: error-analysis + the two-ways production +
    // the same-total / different-grouping claim (+ a ramped warm-up).
    [
      { gen: wSkip, diff: 2 },
      { gen: eaAddedInsteadOfGrouped, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Draw a picture for "3 groups of 5" and a picture for "3 and 5". Work out both totals, then write one sentence saying why the two pictures cannot end up the same.',
          value: '"groups of" copies one equal group again and again, while "and" joins two piles once, so the totals differ',
          acceptableForms: ['groups of', 'equal groups', 'copy', 'join', 'add'],
          keywords: true,
          hints: [
            'Which of your two pictures copies a group, and which one only joins two piles?',
            'Count each picture, then hold the two totals side by side.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true: "6 groups of 3" and "3 groups of 6" reach the same total. In one sentence, explain how you know.',
          correct: 'always',
          distractors: [
            {
              text: 'sometimes',
              errorTag: 'concept-misconception',
              rationale: 'Hedges on something that holds for every pair of whole numbers — it is one array looked at from two sides.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Reads two different-looking arrangements as two different totals.',
            },
          ],
          hints: [
            'Picture the counters in rows, then turn the picture a quarter turn — what do you see?',
            'The rows become columns and the columns become rows; count the same counters both ways.',
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
    'For grown-ups: "groups of" is a copy instruction, not a joining instruction, and that one idea is the whole week. If your child answers 7 for "3 groups of 4", do not correct the number — ask them to draw the three groups and count. The picture settles it faster than any rule, and it is the picture they will lean on all year.',
  ],
  puzzle: (r) => {
    const total = r.pick([12, 16, 18, 20, 24] as const);
    const ways: string[] = [];
    for (let rows = 2; rows <= total / 2; rows++) {
      if (total % rows === 0) ways.push(`${rows} rows of ${total / rows}`);
    }
    const name = one(r);
    return {
      id: 'C6-PZ-01',
      title: 'Puzzle Grove: Every Equal Way',
      puzzleType: 'construction',
      prompt: `[image: ${countNoun(total, 'stickers')} in a loose pile] ${name} wants to lay ${countNoun(total, 'stickers')} out in equal rows, with at least 2 rows and at least 2 stickers in every row. Find EVERY arrangement that works, and say how you know none is missing.`,
      figure: counters(total, 'stickers', {
        arrangement: 'scattered',
        alt: `${countNoun(total, 'stickers')} in a loose pile, not yet arranged`,
      }),
      answer: { value: ways.join('; '), acceptableForms: ways, validation: 'short-text-keyword' },
      hintLadder: [
        'How could you be sure you had found them ALL, and not just some?',
        'Walk up in order — two rows, then three, then four — and stop when the rows outnumber what would fit in a row.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: {
    skill: 'Addition within 100 — the repeated-addition substrate',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 11, max: 88 },
  },
  mastery: [
    { gen: grpEqualGroups, diff: 3 },
    { gen: msGroupsThenExtras, diff: 3 },
    { gen: grpArray, diff: 3 },
    { gen: msGroupsThenChange, diff: 4 },
    { gen: grpHops, diff: 3 },
    { gen: msRowsWithSpare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step equal groups, array and number-line hops — the three models the week teaches, one each, with the one-group figure affordance preserved. 02/04/06: two-step groups-then-extras, groups-then-a-change, and a groups story carrying a quantity that must be left unused. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'added-instead-of-grouped',
      description: 'Hears "k groups of n" as "k and n" and joins the two numbers instead of copying a group.',
      exampleWrongAnswer: '3 groups of 4 answered as 7',
      distractorRationale: 'Offer the sum of the two stated numbers.',
      reteachPointer: 'explanation/script[1] (two piles joined once) beside script[0] (one group copied)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-at-one-group',
      description: 'Answers with what a single group holds, or reports the groups and forgets the extras a two-step story adds.',
      exampleWrongAnswer: '4 baskets of 6 answered as 6',
      distractorRationale: 'Offer the size of one group on equal-groups choice items.',
      reteachPointer: 'guidedExamples/C6-GE-01 (skip-count every group, not only the first)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'roles-swapped',
      description: 'Swaps the number of groups with the size of a group, so the repeated addition describes a different arrangement.',
      exampleWrongAnswer: '4 groups of 6 written as 4 + 4 + 4 + 4 + 4 + 4',
      distractorRationale: 'Offer the repeated addition built from the number of groups instead of the group size.',
      reteachPointer: 'explanation/script[2] (the number inside each row is the size of one group)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'skip-count-slip',
      description: 'Chooses the right move but loses the thread while skip-counting, landing one group short or one group over.',
      exampleWrongAnswer: '5 rows of 4 counted as 16',
      distractorRationale: 'Offer the product one group short.',
      reteachPointer: 'guidedExamples/C6-GE-02 (say the running total aloud once per row), then the 2-minute addition sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Meeting multiplication — reading a story for EQUAL groups, telling "3 groups of 4" (copy a group, so multiply) apart from "3 and 4" (join two piles, so add), and counting groups with skip-counting, arrays and number-line hops.',
    improvingCandidates: [
      'checking that every group holds the same amount before counting',
      'skip-counting the groups instead of counting one thing at a time',
      'reading an array as rows of equal size',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'keeping "groups of" apart from "and" — the group pictures make the difference visible in a second',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering the question that was actually asked, including the extras at the end of a two-step story',
      },
      {
        errorTag: 'representation-misread',
        text: 'tracking which number is the size of a group and which one counts the groups',
      },
    ],
    homeFocus: {
      praiseLine:
        'You drew the equal groups before you counted, and you checked that every group held the same amount — that is exactly the move this week is built on.',
      questionForChild: 'If 4 plates each hold 3 crackers, how many crackers is that — and how did you count them?',
      schoolSyncHook: 'If your child\'s class writes this as 3 × 4 or as 4 × 3, tell us and we will match the order they use.',
    },
    vocabularyForParent: [
      'equal groups (every group holds the same amount)',
      'groups of (copy a group — that is a multiply)',
      'array (equal groups tidied into rows and columns)',
    ],
  },
});
