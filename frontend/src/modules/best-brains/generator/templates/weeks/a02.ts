/**
 * Level A · Week 2 — "Counting 6–10" (conceptId: counting-6-10).
 * CURRICULUM-MAP Level A row 2: counting collections to 10; last-number-counted
 * = how many. Day-5 focus: AB/ABB pattern spotting with shapes.
 *
 * Retrieval (QG-2): backward-only from A·W1 (the only earlier week).
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

const NOUNS = [
  'ducks', 'stars', 'apples', 'bears', 'fish', 'leaves', 'buttons', 'shells',
  'kites', 'frogs', 'pebbles', 'crayons',
] as const;
const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ella', 'Omar'] as const;
const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'moon'] as const;

type Arrangement = 'in a row' | 'in two rows' | 'scattered';

function drawCount(rng: Rng, guard: TupleGuard, kind: string, min: number, max: number) {
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
    prompt: `[image: ${n} ${noun} ${arrangement}] Count the ${noun}. How many?`,
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
      `Pick a starting ${noun.slice(0, -1)} so you don't lose your place.`,
      'Cross out each one as you count it.',
    ],
    errorTags:
      arrangement === 'scattered'
        ? ['representation-misread', 'procedure-slip']
        : ['representation-misread'],
  };
}

function tenFrameCount(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(rng, guard, (r) => r.int(6, 10), (v) => `frame:${v}`);
  return {
    type: 'representation',
    prompt: `[image: ten-frame with ${n} counters] How many counters are in the frame?`,
    answer: { value: String(n), acceptableForms: [smallWord(n)], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'ten_frame_count_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'The top row holds 5 when it is full.',
      'Count on from the full row instead of starting at 1.',
    ],
    errorTags: ['representation-misread'],
  };
}

function lastNumber(rng: Rng, guard: TupleGuard, min: number, max: number, difficulty: number): ItemDraft {
  const { n, noun } = drawCount(rng, guard, 'last', min, max);
  return {
    type: 'computation',
    prompt: `[image: ${n} ${noun} in a row] Count out loud. What was the LAST number you said?`,
    answer: { value: String(n), acceptableForms: [smallWord(n)], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'last_number_v1', params: { n, noun }, seed: rng.uint() },
    hintLadder: [
      'Count each one exactly once.',
      'The number you say as you touch the final one is the answer.',
    ],
    errorTags: ['concept-misconception'],
  };
}

function numeralChoice(rng: Rng, guard: TupleGuard, min: number, max: number, difficulty: number): ItemDraft {
  const { n, noun } = drawCount(rng, guard, 'numchoice', min, max);
  const { choices, correctKey } = makeChoices(rng, String(n), [
    {
      text: String(n - 1),
      errorTag: 'representation-misread',
      rationale: 'One too few - traps skipping an object in a bigger group.',
    },
    {
      text: String(n + 1),
      errorTag: 'representation-misread',
      rationale: 'One too many - traps double-counting in a bigger group.',
    },
  ]);
  return {
    type: 'representation',
    prompt: `[image: ${n} ${noun}] Circle the number that shows how many.`,
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

function countOutDraw(rng: Rng, guard: TupleGuard, min: number, max: number, difficulty: number): ItemDraft {
  const n = drawFresh(rng, guard, (r) => r.int(min, max), (v) => `draw:${v}`);
  return {
    type: 'drawing',
    prompt: `Draw ${n} circles in the box.`,
    answer: {
      value: String(n),
      acceptableForms: [`drawing shows ${n} circles`],
      validation: 'manual-review',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'count_out_draw_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Say one number for each circle you draw. Stop at the number in the box.'],
    errorTags: ['procedure-slip'],
  };
}

function countStory(rng: Rng, guard: TupleGuard, min: number, max: number, difficulty: number, withExtra: boolean): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ n: r.int(min, max), noun: r.pick(NOUNS), name: r.pick(NAMES) }),
    (v) => `story:${v.n}:${v.noun}`,
  );
  const { n, noun, name } = draw;
  const prompt = withExtra
    ? `(Read aloud) ${name} collects ${n} ${noun} in a bucket. A friend waves hello. How many ${noun} are in the bucket?`
    : `(Read aloud) ${name} collects ${n} ${noun} in a bucket. How many ${noun} are in the bucket?`;
  return {
    type: 'word-problem',
    prompt,
    answer: { value: String(n), acceptableForms: [smallWord(n)], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'count_story_v1', params: { n, noun, name, withExtra }, seed: rng.uint() },
    hintLadder: [
      `The question asks about the ${noun} only.`,
      `Picture the ${noun} in the bucket and touch-count them.`,
    ],
    errorTags: ['task-comprehension'],
  };
}

/** Retrieval warm-up from A·W1: count a small group (1–5). */
function retrCountSmall(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { n, noun } = drawCount(rng, guard, 'retr-count', 2, 5);
  return {
    type: 'computation',
    prompt: `Warm-up! [image: ${n} ${noun} in a row] How many ${noun}?`,
    answer: { value: String(n), acceptableForms: [smallWord(n)], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'A', week: 1 },
    generator: { templateId: 'retr_count_objects_v1', params: { n, noun }, seed: rng.uint() },
    hintLadder: ['Touch each one once as you count.'],
    errorTags: ['representation-misread'],
  };
}

/** Retrieval warm-up from A·W1: circle the numeral for a small group. */
function retrNumeralSmall(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { n, noun } = drawCount(rng, guard, 'retr-num', 2, 5);
  const { choices, correctKey } = makeChoices(rng, String(n), [
    {
      text: String(n + 1),
      errorTag: 'representation-misread',
      rationale: 'One too many - traps double-counting.',
    },
  ]);
  return {
    type: 'representation',
    prompt: `Warm-up! [image: ${n} ${noun}] Circle the number that shows how many.`,
    choices,
    answer: { value: correctKey, acceptableForms: [String(n)], validation: 'choice-key' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'A', week: 1 },
    generator: { templateId: 'retr_numeral_choice_v1', params: { n, noun }, seed: rng.uint() },
    hintLadder: ['Count first, then find the numeral.'],
    errorTags: ['representation-misread'],
  };
}

/** Day-5 noncomputational: AB / ABB pattern spotting (map's Day-5 focus). */
function patternNext(rng: Rng, guard: TupleGuard, kind: 'AB' | 'ABB', difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const s1 = r.pick(SHAPES);
      let s2 = r.pick(SHAPES);
      if (s2 === s1) s2 = SHAPES[(SHAPES.indexOf(s1) + 1) % SHAPES.length];
      return { s1, s2 };
    },
    (v) => `pattern:${kind}:${v.s1}:${v.s2}`,
  );
  const { s1, s2 } = draw;
  const unit = kind === 'AB' ? [s1, s2] : [s1, s2, s2];
  const shown = [...unit, ...unit, ...(kind === 'AB' ? [s1] : [s1, s2])];
  const next = s2; // both AB and ABB sequences above stop right before an s2 slot
  const wrong = s1;
  const { choices, correctKey } = makeChoices(rng, next, [
    {
      text: wrong,
      errorTag: 'concept-misconception',
      rationale: 'Repeats the most recent shape instead of following the repeating unit.',
    },
  ]);
  return {
    type: 'classification',
    prompt: `[image: pattern of shapes: ${shown.join(', ')}, ?] What shape comes next?`,
    choices,
    answer: { value: correctKey, acceptableForms: [next], validation: 'choice-key' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'pattern_next_v1', params: { kind, s1, s2 }, seed: rng.uint() },
    hintLadder: [
      'Say the pattern out loud and clap its beat.',
      `Find the chunk that repeats. Where are you inside the chunk?`,
    ],
    errorTags: ['concept-misconception'],
  };
}

export function buildA02(packSeed: number, contentVersion: string): WeeklyConceptPack {
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
    makeDay('A', 2, 1, 'concept-echo', 2, [
      retrCountSmall(d1, guard, 1),
      retrNumeralSmall(d1, guard, 2),
      countObjects(d1, guard, 6, 7, 'in a row', 2),
      countObjects(d1, guard, 8, 10, 'in a row', 2),
      tenFrameCount(d1, guard, 3),
      lastNumber(d1, guard, 6, 10, 3),
    ]),
    makeDay('A', 2, 2, 'fluency-application', 2, [
      retrCountSmall(d2, guard, 2),
      countObjects(d2, guard, 6, 8, 'in two rows', 2),
      numeralChoice(d2, guard, 6, 9, 3),
      tenFrameCount(d2, guard, 3),
      countObjects(d2, guard, 7, 10, 'scattered', 3),
      countOutDraw(d2, guard, 6, 8, 4),
    ]),
    makeDay('A', 2, 3, 'fluency-application', 2, [
      retrNumeralSmall(d3, guard, 2),
      countObjects(d3, guard, 6, 8, 'in two rows', 2),
      lastNumber(d3, guard, 6, 10, 3),
      numeralChoice(d3, guard, 6, 9, 3),
      countOutDraw(d3, guard, 8, 10, 4),
      countObjects(d3, guard, 9, 10, 'scattered', 4),
    ]),
    makeDay('A', 2, 4, 'word-problems', 2, [
      countStory(d4, guard, 6, 7, 3, false),
      countStory(d4, guard, 7, 9, 3, false),
      retrCountSmall(d4, guard, 2),
      countStory(d4, guard, 8, 10, 4, true),
    ]),
    makeDay(
      'A',
      2,
      5,
      'noncomputational',
      2,
      [
        patternNext(d5, guard, 'AB', 3),
        patternNext(d5, guard, 'ABB', 3),
        patternNext(d5, guard, 'ABB', 4),
        retrCountSmall(d5, guard, 2),
      ],
      'For grown-ups: counting to 10 adds a new challenge - keeping track. Your child ' +
        'practiced picking a starting point and crossing things off so nothing is missed ' +
        'or counted twice. The Day-5 shape patterns train the same "find the repeating ' +
        'chunk" thinking that later powers skip counting. At home, count stairs or ' +
        'buttons past five, and cheer the careful pointing, not the speed.',
    ),
  ];

  const puzzleUnit = drawFresh(
    pz,
    guard,
    (r) => {
      const s1 = r.pick(SHAPES);
      let s2 = r.pick(SHAPES);
      if (s2 === s1) s2 = SHAPES[(SHAPES.indexOf(s1) + 2) % SHAPES.length];
      return { s1, s2 };
    },
    (v) => `pz:${v.s1}:${v.s2}`,
  );

  const formA = makeMasteryItems('A', 2, 'MA', [
    countObjects(ma, guard, 6, 7, 'in a row', 2),
    tenFrameCount(ma, guard, 2),
    countObjects(ma, guard, 8, 10, 'scattered', 3),
    numeralChoice(ma, guard, 6, 10, 3),
    lastNumber(ma, guard, 6, 10, 3),
    countStory(ma, guard, 6, 10, 4, true),
  ]);
  const formB = makeMasteryItems('A', 2, 'MB', [
    countObjects(mb, guard, 6, 7, 'in a row', 2),
    tenFrameCount(mb, guard, 2),
    countObjects(mb, guard, 8, 10, 'scattered', 3),
    numeralChoice(mb, guard, 6, 10, 3),
    lastNumber(mb, guard, 6, 10, 3),
    countStory(mb, guard, 6, 10, 4, true),
  ]);

  return {
    schemaVersion: '1.0',
    packId: 'MFM-A2',
    contentVersion,
    identity: {
      level: 'A',
      week: 2,
      conceptId: 'counting-6-10',
      conceptName: 'Counting 6–10',
      band: 'beginner',
      strandTags: ['number-sense-counting'],
      prerequisiteWeeks: [{ level: 'A', week: 1 }],
    },
    presentation: {
      audioFirst: true,
      oneOperationPerPage: true,
      scaffoldNotes:
        'All prompts read aloud; ten-frames available from Day 1; cross-out marks ' +
        'encouraged on scattered sets; mascot present.',
    },
    explanation: {
      hook:
        'A whole parade of ducks marches by - too many to see in one look! When groups get ' +
        'big, our eyes fool us. Careful counting never does.',
      whyBeforeHow:
        'Counting big groups works exactly like counting small ones - one touch, one number - ' +
        'but now KEEPING TRACK matters. The why: past five or six, it is easy to lose your ' +
        'place, so smart counters pick a starting point, follow a path, and mark off what ' +
        'they have counted. The rule never changes; the group just gets bigger.',
      script: [
        {
          say: 'Watch me count 7 buttons. I pick the top-left button first, and I follow a path: 1, 2, 3, 4, 5, 6, 7.',
          visual: 'Seven buttons; a dotted path appears as each is tapped and numbered.',
        },
        {
          say: 'When buttons are scattered, I cross each one out as I count it. No button gets skipped, none gets counted twice.',
          visual: 'Scattered buttons gain check marks one by one.',
        },
        {
          say: 'A ten-frame makes big counts fast: the top row is 5 when full. 5... then 6, 7, 8. Eight!',
          visual: 'Ten-frame fills; the full top row flashes as "5" before counting on.',
        },
        {
          say: 'And the last number I say still tells how many in all. 8 counters - I do not need to recount.',
          visual: 'Numeral 8 glows above the frame.',
        },
      ],
      summary:
        'Big groups, same rule: one touch, one number. Pick a starting point, mark off as ' +
        'you go, and the last number tells how many.',
      vocabulary: [
        { term: 'keep track', kidGloss: 'remember which ones you already counted' },
        { term: 'ten-frame', kidGloss: 'a 2-row box that holds up to 10 counters' },
        { term: 'in all', kidGloss: 'how many when you count everything' },
      ],
    },
    guidedExamples: [
      {
        id: contentId('A', 2, 'GE', 1),
        fadeLevel: 'modeled',
        prompt: '[image: 6 fish in a row] How many fish?',
        steps: [
          {
            teacherSay: 'I start at the left and touch each fish: 1, 2, 3, 4, 5, 6. Six fish!',
            expected: '6',
          },
        ],
        answer: '6',
      },
      {
        id: contentId('A', 2, 'GE', 2),
        fadeLevel: 'completion',
        prompt: '[image: 8 leaves in two rows] Count the leaves with me.',
        steps: [
          { teacherSay: 'Top row first: 1, 2, 3, 4.' },
          { childDo: 'Count the bottom row, continuing where I stopped.', expected: '5, 6, 7, 8' },
        ],
        answer: '8',
      },
      {
        id: contentId('A', 2, 'GE', 3),
        fadeLevel: 'prompted',
        prompt: '[image: 9 pebbles scattered] Count the pebbles.',
        steps: [
          { teacherSay: 'Scattered! What will you do so no pebble is missed?' },
          { childDo: 'Cross out each pebble as you count it.', expected: '1 through 9' },
        ],
        answer: '9',
      },
      {
        id: contentId('A', 2, 'GE', 4),
        fadeLevel: 'independent',
        prompt: '[image: ten-frame with 10 counters] How many counters? Count and say the answer.',
        steps: [{ childDo: 'Use the full rows to count fast.', expected: '10' }],
        answer: '10',
      },
    ],
    days,
    puzzle: {
      id: contentId('A', 2, 'PZ', 1),
      title: 'Puzzle Grove: Shape Train',
      puzzleType: 'pattern',
      prompt:
        `[image: a train whose cars repeat the pattern ${puzzleUnit.s1}, ${puzzleUnit.s2}, ` +
        `${puzzleUnit.s2} - shown twice, then two empty cars] The train's cars follow a ` +
        'repeating pattern. Which TWO shapes go on the empty cars, in order?',
      answer: {
        value: `${puzzleUnit.s1}, ${puzzleUnit.s2}`,
        acceptableForms: [`${puzzleUnit.s1} then ${puzzleUnit.s2}`],
        validation: 'ordered-list',
      },
      hintLadder: [
        'Say the shapes out loud from the front of the train - hear the beat.',
        'Find the chunk that repeats. Which part of the chunk comes next?',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    },
    fluencySprint: null,
    masteryCheck: {
      passThresholdPct: MASTERY_THRESHOLD_PCT,
      fastTrackPct: FAST_TRACK_PCT,
      formA,
      formB,
      isomorphNotes:
        'Pairs by index; same template and difficulty per slot. 01: row count 6-7. ' +
        '02: ten-frame read 6-10. 03: scattered count 8-10 (keep-track affordance ' +
        'preserved). 04: circle-the-numeral 6-10 with +/-1 distractors. 05: last-number ' +
        'cardinality 6-10. 06: counting story with a distractor sentence. No count/noun ' +
        'pair reused from Form A or the daily pages.',
    },
    mistakeBank: [
      {
        errorTag: 'representation-misread',
        subtype: 'lost-place-scattered',
        description: 'Loses track in scattered groups past six - skips or double-counts.',
        exampleWrongAnswer: 'counts 9 pebbles as 8',
        distractorRationale: 'Offer (correct +/- 1) on scattered-count items.',
        reteachPointer: 'explanation/script[1] (cross out as you count)',
      },
      {
        errorTag: 'procedure-slip',
        subtype: 'restart-midway',
        description: 'Loses the count word sequence past six and restarts or repeats a number.',
        exampleWrongAnswer: 'counts "...5, 6, 6, 7" and lands on 9 for 10 objects',
        distractorRationale: 'Offer (correct - 1) on longer row counts.',
        reteachPointer: 'guidedExamples/A2-GE-02 (continue counting where the row ended)',
      },
      {
        errorTag: 'concept-misconception',
        subtype: 'pattern-repeats-last',
        description:
          'Continues a repeating pattern by copying the most recent shape instead of following the repeating chunk.',
        exampleWrongAnswer: 'circle-square-circle-square, then answers "square" after square',
        distractorRationale: 'Offer the most recent shape as a distractor on pattern items.',
        reteachPointer: 'Day-5 replay: clap the pattern, find the chunk',
      },
      {
        errorTag: 'task-comprehension',
        subtype: 'story-miscount',
        description: 'Counts things mentioned in the story that the question does not ask about.',
        exampleWrongAnswer: 'adds the waving friend into the bucket count',
        distractorRationale: 'Offer (correct + 1) on story items with an extra actor.',
        reteachPointer: 'Day-4 replay: "which things is the question asking about?"',
      },
    ],
    parentSummarySeed: {
      whatWeWorkedOn:
        'Counting groups of 6 to 10 - picking a starting point, following a path, and ' +
        'crossing things off so nothing is missed, plus reading amounts fast on a ten-frame.',
      improvingCandidates: [
        'keeping track while counting scattered groups',
        'using the full ten-frame row as a shortcut instead of counting from 1',
        'spotting and continuing a repeating shape pattern',
      ],
      strengtheningByTag: [
        {
          errorTag: 'representation-misread',
          text: 'marking off scattered objects while counting - the cross-out habit will stay in the warm-ups',
        },
        {
          errorTag: 'procedure-slip',
          text: 'holding the number-word order steady past six - we will keep counting aloud together',
        },
        {
          errorTag: 'concept-misconception',
          text: 'following the repeating chunk of a pattern instead of copying the last shape',
        },
      ],
      homeFocus: {
        praiseLine:
          'You crossed off every pebble as you counted - that is exactly how careful counters handle big groups.',
        questionForChild: 'Can you count out 8 blocks - and how do you make sure you don\'t count one twice?',
      },
      vocabularyForParent: [
        'keep track (remember what is already counted)',
        'ten-frame (2-row box of 10)',
        'pattern chunk (the part that repeats)',
      ],
    },
  };
}
