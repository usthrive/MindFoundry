/**
 * Level A · Week 1 — "Counting 1–5" (conceptId: counting-1-5).
 * CURRICULUM-MAP Level A row 1: one-to-one counting of objects to 5;
 * Day-5 focus: sort-and-match picture puzzle (count → group).
 *
 * NOTE (QG-2 origin exception): A·W1 is the curriculum-graph origin — there is
 * no earlier week to retrieve from, so this pack carries 0 retrieval items.
 * The validator carves out exactly this one cell.
 */

import type { WeeklyConceptPack } from '../../../types';
import { FAST_TRACK_PCT, MASTERY_THRESHOLD_PCT } from '../../../constants';
import { streamRng, Rng } from '../../rng';
import {
  contentId,
  drawFresh,
  ItemDraft,
  makeChoices,
  makeDay,
  makeMasteryItems,
  smallWord,
  TupleGuard,
} from '../shared';
import { countNoun, unitFor } from '../lib/format';
import { assertsAnswer, assertsParam, counterGroups, counters, DRAWABLE_NOUNS } from '../lib/figures';

const NOUNS = DRAWABLE_NOUNS;
const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Ken'] as const;

type Arrangement = 'in a row' | 'in two rows' | 'scattered';

interface CountDraw {
  n: number;
  noun: string;
}

function drawCount(
  rng: Rng,
  guard: TupleGuard,
  kind: string,
  min: number,
  max: number,
): CountDraw {
  return drawFresh(
    rng,
    guard,
    (r) => ({ n: r.int(min, max), noun: r.pick(NOUNS) }),
    (v) => `${kind}:${v.n}:${v.noun}`,
  );
}

function countObjects(
  rng: Rng,
  guard: TupleGuard,
  min: number,
  max: number,
  arrangement: Arrangement,
  difficulty: number,
): ItemDraft {
  const { n, noun } = drawCount(rng, guard, 'count', min, max);
  return {
    type: 'computation',
    prompt: `[image: ${countNoun(n, noun)} ${arrangement}] Count the ${unitFor(n, noun)}. How many?`,
    figure: counters(n, noun, { arrangement, alt: `${countNoun(n, noun)} ${arrangement}`, asserts: assertsAnswer }),
    answer: { value: String(n), acceptableForms: [smallWord(n)], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'count_objects_v1',
      params: { n, noun, arrangement },
      seed: rng.uint(),
    },
    hintLadder: [
      `Touch each of the ${noun} once as you count.`,
      'Go slowly - one touch, one number.',
    ],
    errorTags:
      arrangement === 'scattered'
        ? ['representation-misread', 'procedure-slip']
        : ['representation-misread'],
  };
}

function numeralChoice(
  rng: Rng,
  guard: TupleGuard,
  min: number,
  max: number,
  difficulty: number,
): ItemDraft {
  const { n, noun } = drawCount(rng, guard, 'numchoice', min, max);
  // WHICH PAIR OF WRONG COUNTS IS OFFERED DEPENDS ON THE COUNT ITSELF.
  //
  // It used to be n-1 and n+1 on every draw, which put the right number in the
  // MIDDLE of the three options every time — so "circle the middle number" was a
  // free pass, in a mastery slot, for the youngest children in the product.
  // Measured at 100% of draws in A1 and A2 before this changed.
  //
  // All four wrong counts are the same two real errors, made once or twice:
  // skipping objects while counting, or counting one twice. The pairing is derived
  // from n rather than drawn, so no rng call is added and the rest of the pack is
  // unchanged. Both-below needs n-2 to stay a countable number.
  const pairing = n >= 3 ? n % 3 : 0;
  const lower = { errorTag: 'representation-misread' as const, rationale: 'Too few - traps skipping an object while counting.' };
  const upper = { errorTag: 'representation-misread' as const, rationale: 'Too many - traps counting an object twice.' };
  const wrongPair = pairing === 0
    ? [{ text: String(n - 1), ...lower }, { text: String(n + 1), ...upper }]
    : pairing === 1
      ? [{ text: String(n + 1), ...upper }, { text: String(n + 2), ...upper }]
      : [{ text: String(n - 2), ...lower }, { text: String(n - 1), ...lower }];
  const { choices, correctKey } = makeChoices(rng, String(n), wrongPair);
  return {
    type: 'representation',
    prompt: `[image: ${n} ${noun}] Circle the number that shows how many.`,
    figure: counters(n, noun, { alt: countNoun(n, noun), asserts: assertsParam('n') }),
    choices,
    answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'numeral_choice_v1', params: { n, noun }, seed: rng.uint() },
    hintLadder: ['Count first. Then find the number you said last.'],
    errorTags: ['representation-misread'],
  };
}

function lastNumber(
  rng: Rng,
  guard: TupleGuard,
  min: number,
  max: number,
  difficulty: number,
): ItemDraft {
  const { n, noun } = drawCount(rng, guard, 'last', min, max);
  return {
    type: 'computation',
    prompt: `[image: ${countNoun(n, noun)} in a row] Count out loud. What was the LAST number you said?`,
    figure: counters(n, noun, { arrangement: 'in a row', alt: `${countNoun(n, noun)} in a row`, asserts: assertsAnswer }),
    answer: { value: String(n), acceptableForms: [smallWord(n)], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'last_number_v1', params: { n, noun }, seed: rng.uint() },
    hintLadder: [
      'Count each one exactly once.',
      'When you run out of things to touch, stop - that number is your answer.',
    ],
    errorTags: ['concept-misconception'],
  };
}

function countOutDraw(
  rng: Rng,
  guard: TupleGuard,
  min: number,
  max: number,
  difficulty: number,
  strand: 'computational' | 'noncomputational',
): ItemDraft {
  const n = drawFresh(rng, guard, (r) => r.int(min, max), (v) => `draw:${v}`);
  return {
    type: 'drawing',
    prompt: `Draw ${n} dots in the box.`,
    answer: {
      value: String(n),
      acceptableForms: [`drawing shows ${n} dots`],
      validation: 'manual-review',
    },
    difficulty,
    strand,
    isRetrieval: false,
    generator: { templateId: 'count_out_draw_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Say one number for each dot you draw. Stop when you say the number in the box.'],
    errorTags: ['procedure-slip'],
  };
}

function countStory(
  rng: Rng,
  guard: TupleGuard,
  min: number,
  max: number,
  difficulty: number,
  withExtra: boolean,
): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ n: r.int(min, max), noun: r.pick(NOUNS), name: r.pick(NAMES) }),
    (v) => `story:${v.n}:${v.noun}`,
  );
  const { n, noun, name } = draw;
  const prompt = withExtra
    ? `(Read aloud) ${name} lines up ${n} ${noun} on the table. A cat watches. How many ${noun} are on the table?`
    : `(Read aloud) ${name} lines up ${n} ${noun} on the table. How many ${noun} are on the table?`;
  return {
    type: 'word-problem',
    prompt,
    answer: { value: String(n), acceptableForms: [smallWord(n)], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'count_story_v1',
      params: { n, noun, name, withExtra },
      seed: rng.uint(),
    },
    hintLadder: [
      `The question asks about the ${noun} only.`,
      `Picture the ${noun} in a row and touch-count them.`,
    ],
    errorTags: ['task-comprehension'],
  };
}

function matchSet(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const a = r.int(2, 5);
      let b = r.int(1, 5);
      if (b === a) b = a === 5 ? 4 : a + 1;
      const nounA = r.pick(NOUNS);
      let nounB = r.pick(NOUNS);
      if (nounB === nounA) nounB = NOUNS[(NOUNS.indexOf(nounA) + 1) % NOUNS.length];
      return { a, b, nounA, nounB };
    },
    (v) => `match:${v.a}:${v.b}:${v.nounA}`,
  );
  const { a, b, nounA, nounB } = draw;
  const { choices, correctKey } = makeChoices(rng, `the ${nounA}`, [
    {
      text: `the ${nounB}`,
      errorTag: 'representation-misread',
      rationale:
        'The other group in the picture - traps answering from a glance instead of counting.',
    },
  ]);
  return {
    type: 'classification',
    prompt: `[image: a group of ${countNoun(a, nounA)} and a group of ${countNoun(b, nounB)}] Circle the group that shows ${a}.`,
    figure: counterGroups(
      [{ count: a, noun: nounA, label: nounA }, { count: b, noun: nounB, label: nounB }],
      { alt: `a group of ${countNoun(a, nounA)} and a group of ${countNoun(b, nounB)}`, asserts: assertsParam('a', 'group:0') },
    ),
    choices,
    answer: { value: correctKey, acceptableForms: [`the ${nounA}`], validation: 'choice-key' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: {
      templateId: 'match_set_v1',
      params: { a, b, nounA, nounB },
      seed: rng.uint(),
    },
    hintLadder: ["Don't trust your eyes - count each group."],
    errorTags: ['representation-misread'],
  };
}

function groupChoice(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const counts = r.shuffle([2, 3, 4, 5]).slice(0, 3);
      const nouns = r.shuffle(NOUNS).slice(0, 3);
      return { counts, nouns, targetIdx: r.int(0, 2) };
    },
    // Order-insensitive: the prompt's token multiset (counts + target) must be
    // fresh, or two same-day group-choice items could commute into each other.
    (v) =>
      `groups:${[...v.counts, v.counts[v.targetIdx]].sort((a, b) => a - b).join(',')}`,
  );
  const { counts, nouns, targetIdx } = draw;
  const target = counts[targetIdx];
  const distractors = [0, 1, 2]
    .filter((i) => i !== targetIdx)
    .map((i) => ({
      text: `the ${nouns[i]}`,
      errorTag: 'representation-misread' as const,
      rationale: `Shows ${counts[i]}, not ${target} - traps guessing without counting.`,
    }));
  const { choices, correctKey } = makeChoices(rng, `the ${nouns[targetIdx]}`, distractors);
  return {
    type: 'classification',
    prompt: `[image: three groups: ${countNoun(counts[0], nouns[0])}, ${countNoun(counts[1], nouns[1])}, ${countNoun(counts[2], nouns[2])}] Circle the group that shows ${target}.`,
    // No assertion: `counts` ships as an array, and the picture's claim here is
    // "these three groups", not one number. The guarantee is structural — the
    // figure is built from the very array the choices were built from.
    figure: counterGroups(
      counts.map((c, i) => ({ count: c, noun: nouns[i], label: nouns[i] })),
      { alt: `three groups: ${countNoun(counts[0], nouns[0])}, ${countNoun(counts[1], nouns[1])}, ${countNoun(counts[2], nouns[2])}` },
    ),
    choices,
    answer: {
      value: correctKey,
      acceptableForms: [`the ${nouns[targetIdx]}`],
      validation: 'choice-key',
    },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: {
      templateId: 'sort_count_v1',
      params: { counts, nouns, target },
      seed: rng.uint(),
    },
    hintLadder: ['Count each group one at a time.', 'Cross out each thing as you count it.'],
    errorTags: ['representation-misread', 'task-comprehension'],
  };
}

export function buildA01(packSeed: number, contentVersion: string): WeeklyConceptPack {
  const guard = new TupleGuard();
  const d1 = streamRng(packSeed, 'd1');
  const d2 = streamRng(packSeed, 'd2');
  const d3 = streamRng(packSeed, 'd3');
  const d4 = streamRng(packSeed, 'd4');
  const d5 = streamRng(packSeed, 'd5');
  const pz = streamRng(packSeed, 'pz');
  const ma = streamRng(packSeed, 'ma');
  const mb = streamRng(packSeed, 'mb');

  const days = [
    makeDay('A', 1, 1, 'concept-echo', 2, [
      countObjects(d1, guard, 1, 3, 'in a row', 1),
      countObjects(d1, guard, 3, 5, 'in a row', 1),
      countObjects(d1, guard, 4, 5, 'in a row', 2),
      numeralChoice(d1, guard, 2, 5, 2),
      lastNumber(d1, guard, 3, 5, 3),
      countOutDraw(d1, guard, 3, 5, 3, 'computational'),
    ]),
    makeDay('A', 1, 2, 'fluency-application', 2, [
      countObjects(d2, guard, 2, 4, 'in two rows', 2),
      numeralChoice(d2, guard, 3, 5, 2),
      countObjects(d2, guard, 4, 5, 'scattered', 3),
      lastNumber(d2, guard, 4, 5, 3),
      countOutDraw(d2, guard, 2, 4, 3, 'computational'),
      countObjects(d2, guard, 3, 5, 'scattered', 3),
    ]),
    makeDay('A', 1, 3, 'fluency-application', 2, [
      countObjects(d3, guard, 2, 4, 'in two rows', 2),
      numeralChoice(d3, guard, 2, 5, 2),
      lastNumber(d3, guard, 3, 5, 3),
      countObjects(d3, guard, 3, 5, 'scattered', 3),
      countOutDraw(d3, guard, 4, 5, 3, 'computational'),
      countObjects(d3, guard, 5, 5, 'scattered', 4),
    ]),
    makeDay('A', 1, 4, 'word-problems', 2, [
      countStory(d4, guard, 2, 3, 2, false),
      countStory(d4, guard, 3, 5, 3, false),
      countStory(d4, guard, 4, 5, 3, false),
      countStory(d4, guard, 3, 5, 4, true),
    ]),
    makeDay(
      'A',
      1,
      5,
      'noncomputational',
      2,
      [
        matchSet(d5, guard, 2),
        groupChoice(d5, guard, 3),
        groupChoice(d5, guard, 3),
        countOutDraw(d5, guard, 3, 5, 3, 'noncomputational'),
      ],
      'For grown-ups: this week your child practiced one-to-one counting - one touch, ' +
        'one number word, and the last number said is "how many". If they recount the ' +
        'whole group when you ask "how many?", that is a normal stage: invite them to ' +
        'trust the last number instead of correcting. Counting out napkins or steps ' +
        'together - and stopping at the right number - is exactly the skill.',
    ),
  ];

  // Puzzle Grove — count-and-color (math-art; sort-and-match transfer of counting).
  const puzzleDraw = drawFresh(
    pz,
    guard,
    (r) => r.shuffle([2, 3, 4, 5]).slice(0, 3),
    (v) => `pzcounts:${v.join(',')}`,
  );
  const [pa, pb, pc] = puzzleDraw;

  const formA = makeMasteryItems('A', 1, 'MA', [
    countObjects(ma, guard, 2, 4, 'in a row', 2),
    numeralChoice(ma, guard, 2, 5, 2),
    countObjects(ma, guard, 4, 5, 'scattered', 3),
    lastNumber(ma, guard, 3, 5, 3),
    countStory(ma, guard, 3, 5, 4, true),
    countObjects(ma, guard, 3, 5, 'in two rows', 3),
  ]);
  const formB = makeMasteryItems('A', 1, 'MB', [
    countObjects(mb, guard, 2, 4, 'in a row', 2),
    numeralChoice(mb, guard, 2, 5, 2),
    countObjects(mb, guard, 4, 5, 'scattered', 3),
    lastNumber(mb, guard, 3, 5, 3),
    countStory(mb, guard, 3, 5, 4, true),
    countObjects(mb, guard, 3, 5, 'in two rows', 3),
  ]);

  return {
    schemaVersion: '1.0',
    packId: 'MFM-A1',
    contentVersion,
    identity: {
      level: 'A',
      week: 1,
      conceptId: 'counting-1-5',
      conceptName: 'Counting 1–5',
      band: 'beginner',
      strandTags: ['number-sense-counting'],
      prerequisiteWeeks: [],
    },
    presentation: {
      audioFirst: true,
      oneOperationPerPage: true,
      scaffoldNotes:
        'All prompts read aloud; oversized tap targets and answer boxes; objects in ' +
        'straight rows on early days, gentle scatters later in the week; mascot present.',
    },
    explanation: {
      hook:
        'Three teddy bears are lined up for a picnic. How many plates do we need? ' +
        "Let's touch each bear and find out - counting is how we ask \"how many?\" and really know.",
      whyBeforeHow:
        'Counting is not just saying number words - it is matching ONE word to ONE thing. ' +
        'We touch each object exactly once, in order. The why: if we skip one or touch one ' +
        'twice, our answer lies to us. One touch, one number - that is the whole secret.',
      script: [
        {
          say: 'Watch me count these 3 apples. I touch each apple as I say its number: 1... 2... 3. One touch, one number.',
          visual: 'Three apples in a row.',
          figure: counters(3, 'apples', { alt: 'three apples in a row' }),
        },
        {
          say: 'If I rush and touch an apple twice, I get 4 - but there are not 4 apples! Slow touching keeps the count true.',
          visual: 'The same three apples - still three, however fast I point.',
          figure: counters(3, 'apples', { alt: 'the same three apples' }),
        },
        {
          say: "The LAST number I say is the answer. 1, 2, 3 - so there are 3 in all. I don't need to count again.",
          visual: 'Three apples with the last one reached.',
          figure: counters(3, 'apples', { alt: 'three apples, the last one reached' }),
        },
        {
          say: "Now five ducks, the same careful way: 1, 2, 3, 4, 5. Five ducks - and I knew when to stop, because I ran out of ducks to touch!",
          visual: 'Five ducks in a row.',
          figure: counters(5, 'ducks', { alt: 'five ducks in a row' }),
        },
      ],
      summary:
        'Touch each object once while saying one number for it. The last number you say tells how many in all.',
      vocabulary: [
        { term: 'count', kidGloss: 'touch and say one number for each thing' },
        { term: 'how many', kidGloss: 'the question counting answers' },
        { term: 'last number', kidGloss: 'the number that tells how many in all' },
      ],
    },
    guidedExamples: [
      {
        id: contentId('A', 1, 'GE', 1),
        fadeLevel: 'modeled',
        prompt: '[image: 2 red balls and 1 blue ball in a basket] How many balls?',
        visual: 'Two balls and one more ball.',
        figure: counterGroups([{ count: 2, noun: 'balls' }, { count: 1, noun: 'balls' }], {
          alt: 'two balls and one more ball', asserts: assertsAnswer,
        }),
        steps: [
          {
            teacherSay: 'I touch each ball once: 1... 2... 3. Three balls in all!',
            expected: '3',
          },
        ],
        answer: '3',
      },
      {
        id: contentId('A', 1, 'GE', 2),
        fadeLevel: 'completion',
        prompt: '[image: 4 stars in a row] Count the stars with me.',
        visual: 'Four stars in a row.',
        figure: counters(4, 'stars', { alt: 'four stars in a row', asserts: assertsAnswer }),
        steps: [
          { teacherSay: 'I start: 1... 2...' },
          { childDo: 'Touch the last two stars and keep counting.', expected: '3, 4' },
          { teacherSay: 'Four! The last number you said tells how many.' },
        ],
        answer: '4',
      },
      {
        id: contentId('A', 1, 'GE', 3),
        fadeLevel: 'prompted',
        prompt: '[image: 5 shells in a curvy line] Count the shells.',
        visual: 'Five shells in a curvy line.',
        figure: counters(5, 'shells', { arrangement: 'curvy', alt: 'five shells in a curvy line', asserts: assertsAnswer }),
        steps: [
          { teacherSay: 'Which shell will you touch first, so you don\'t lose your place?' },
          { childDo: 'Touch each shell once and say the numbers.', expected: '1, 2, 3, 4, 5' },
        ],
        answer: '5',
      },
      {
        id: contentId('A', 1, 'GE', 4),
        fadeLevel: 'independent',
        prompt: '[image: 4 fish in a row] How many fish? Count and say the answer.',
        visual: 'Four fish in a row.',
        figure: counters(4, 'fish', { alt: 'four fish in a row', asserts: assertsAnswer }),
        steps: [{ childDo: 'Count each fish once. Say how many in all.', expected: '4' }],
        answer: '4',
      },
    ],
    days,
    puzzle: {
      id: contentId('A', 1, 'PZ', 1),
      title: 'Puzzle Grove: Count-and-Color Picnic',
      puzzleType: 'math-art',
      prompt:
        `[image: picnic scene with ${pa} apples, ${pb} leaves, and ${pc} shells] ` +
        'Count each kind. Color the box that shows the number of apples GREEN, the number of ' +
        'leaves YELLOW, and the number of shells BLUE.',
      figure: counterGroups(
        [{ count: pa, noun: 'apples', label: 'apples' }, { count: pb, noun: 'leaves', label: 'leaves' }, { count: pc, noun: 'shells', label: 'shells' }],
        { alt: `a picnic scene with ${pa} apples, ${pb} leaves and ${pc} shells` },
      ),
      answer: {
        value: `apples: ${pa}; leaves: ${pb}; shells: ${pc}`,
        acceptableForms: [],
        validation: 'set',
      },
      hintLadder: [
        'Count one kind at a time - apples first.',
        'Cross out each thing after you count it so nothing gets counted twice.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    },
    fluencySprint: null,
    masteryCheck: {
      passThresholdPct: MASTERY_THRESHOLD_PCT,
      fastTrackPct: FAST_TRACK_PCT,
      formA,
      formB,
      isomorphNotes:
        'Pairs by index; same template and difficulty per slot. 01: row count 2-4. ' +
        '02: circle-the-numeral 2-5 with +/-1 distractors. 03: scattered count 4-5. ' +
        '04: last-number cardinality 3-5. 05: counting story with an extra watcher ' +
        '(task-comprehension affordance preserved). 06: two-row count 3-5. No count/noun ' +
        'pair reused from Form A or the daily pages.',
    },
    mistakeBank: [
      {
        errorTag: 'representation-misread',
        subtype: 'skip-or-double-count',
        description: 'Skips an object or counts one twice, especially in scattered groups.',
        exampleWrongAnswer: 'counts 5 shells as 6',
        distractorRationale: 'Offer (correct +/- 1) on picture-count items.',
        reteachPointer: 'explanation/script[1] (one touch, one number)',
      },
      {
        errorTag: 'concept-misconception',
        subtype: 'last-number-not-trusted',
        description:
          'Recounts from 1 when asked "how many?" - does not yet trust that the last number said IS the answer.',
        exampleWrongAnswer: 'counts 1-4 correctly, then recounts instead of answering 4',
        distractorRationale: 'On last-number items, offer the first number counted as a distractor.',
        reteachPointer: 'explanation/script[2] (the last number tells how many)',
      },
      {
        errorTag: 'procedure-slip',
        subtype: 'words-outrun-fingers',
        description: 'Says number words faster than the finger moves, so words and objects fall out of step.',
        exampleWrongAnswer: 'says 6 while touching the 5th duck',
        distractorRationale: 'Offer (correct + 1) on row-count items.',
        reteachPointer: 'guidedExamples/A1-GE-03 (pick a first shell, touch slowly)',
      },
      {
        errorTag: 'task-comprehension',
        subtype: 'counts-everything',
        description: 'Counts every object in the picture instead of only the kind the question asks about.',
        exampleWrongAnswer: 'asked for suns, counts suns and moons together',
        distractorRationale: 'Offer the total of all pictured objects on sort-and-count items.',
        reteachPointer: 'Day-5 replay: "which things is the question asking about?"',
      },
    ],
    parentSummarySeed: {
      whatWeWorkedOn:
        'Counting groups of 1 to 5 the careful way - touching each object exactly once, ' +
        'saying one number per touch, and trusting that the last number said tells how many in all.',
      improvingCandidates: [
        'touching each object exactly once while counting',
        'answering "how many?" with the last number instead of recounting',
        'counting scattered groups without skipping any',
      ],
      strengtheningByTag: [
        {
          errorTag: 'representation-misread',
          text: 'careful touch-counting of scattered pictures - crossing things out as we go, speed is not the goal',
        },
        {
          errorTag: 'concept-misconception',
          text: 'trusting the last number said as "how many" - we will keep asking right after each count until it settles',
        },
        {
          errorTag: 'procedure-slip',
          text: 'keeping the counting words and the pointing finger in step - slow counting is strong counting',
        },
      ],
      homeFocus: {
        praiseLine:
          'I watched you touch every bear exactly once and stop at just the right number - that is real careful counting.',
        questionForChild: 'Can you count out 4 spoons for the table - and how do you know when to stop?',
      },
      vocabularyForParent: [
        'count (one touch, one number)',
        'how many (the counting question)',
        'last number (the answer to "how many")',
      ],
    },
  };
}
