/**
 * Level B · Week 2 — "Tens and ones" (conceptId: tens-and-ones).
 * CURRICULUM-MAP Level B row 2: compose/decompose 2-digit numbers; tens|ones
 * column work (scaffold per E53). Day-5 focus: riddle cards ("I have 4 tens
 * and 7 ones - who am I?").
 *
 * Retrieval (QG-2): B·W1 (numbers to 120) + cross-level Level A sources
 * (A13 partners of 10, A22 counting by tens, A23 teen numbers).
 */

import type { WeeklyConceptPack } from '../../../types';
import { FAST_TRACK_PCT, MASTERY_THRESHOLD_PCT, SPRINT_DURATION_SECONDS } from '../../../constants';
import { streamRng, Rng } from '../../rng';
import { unitFor } from '../lib/format';
import {
  contentId,
  drawFresh,
  ItemDraft,
  makeChoices,
  makeDay,
  makeMasteryItems,
  TupleGuard,
} from '../shared';

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ella', 'Omar'] as const;
const THINGS = ['crayons', 'stickers', 'marbles', 'beads', 'blocks', 'cards'] as const;

function drawTO(
  rng: Rng,
  guard: TupleGuard,
  kind: string,
  tMin = 2,
  tMax = 9,
  oMin = 1,
): { t: number; o: number } {
  return drawFresh(
    rng,
    guard,
    (r) => ({ t: r.int(tMin, tMax), o: r.int(oMin, 9) }),
    // Order-insensitive signature so commuted digit pairs can't collide same-day.
    (v) => `${kind}:${[v.t, v.o].sort((a, b) => a - b).join(':')}`,
  );
}

function compose(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  // o >= 2 keeps compose surfaces disjoint from the "1 ten and o ones" warm-up.
  const { t, o } = drawTO(rng, guard, 'compose', 2, 9, 2);
  return {
    type: 'computation',
    prompt: `${t} ${unitFor(t, 'ten')} and ${o} ${unitFor(o, 'one')} make what number?`,
    answer: { value: String(10 * t + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'tens_ones_compose_v1', params: { t, o }, seed: rng.uint() },
    hintLadder: [
      'Count the tens first: 10, 20, 30...',
      'Then count the ones on, one at a time.',
    ],
    errorTags: ['concept-misconception'],
  };
}

function decompose(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { t, o } = drawTO(rng, guard, 'decompose');
  const n = 10 * t + o;
  return {
    type: 'computation',
    prompt: `${n} = ▢ tens and ${o} ${unitFor(o, 'one')}. How many tens?`,
    answer: { value: String(t), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'tens_ones_decompose_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'The tens digit is the one on the LEFT.',
      'How many bundles of ten hide inside the number?',
    ],
    errorTags: ['representation-misread', 'concept-misconception'],
  };
}

function expandedForm(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { t, o } = drawTO(rng, guard, 'expanded');
  return {
    type: 'computation',
    prompt: `${t * 10} + ${o} = ?`,
    answer: { value: String(10 * t + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'expanded_form_2digit_v1',
      params: { tens: t * 10, ones: o },
      seed: rng.uint(),
    },
    hintLadder: ['Say the tens number, then count the ones on.'],
    errorTags: ['fact-recall'],
  };
}

function rebundle(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ t: r.int(2, 8), o: r.int(11, 19) }),
    (v) => `rebundle:${v.t}:${v.o}`,
  );
  const { t, o } = draw;
  return {
    type: 'computation',
    prompt: `${t} ${unitFor(t, 'ten')} and ${o} ${unitFor(o, 'one')} - what number is that? (Careful: more than 9 ones!)`,
    answer: { value: String(10 * t + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'rebundle_v1', params: { t, o }, seed: rng.uint() },
    hintLadder: [
      'Ten of those loose ones can bundle into one more ten.',
      'Trade first, then read the tens and ones.',
    ],
    errorTags: ['procedure-slip', 'concept-misconception'],
  };
}

function whichShows(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { t, o } = drawFresh(
    rng,
    guard,
    (r) => {
      const t2 = r.int(2, 9);
      let o2 = r.int(1, 9);
      if (o2 === t2) o2 = t2 === 9 ? 8 : t2 + 1; // keep digits distinct so the reversal differs
      return { t: t2, o: o2 };
    },
    (v) => `whichmc:${v.t}:${v.o}`,
  );
  const { choices, correctKey } = makeChoices(rng, String(10 * t + o), [
    {
      text: String(10 * o + t),
      errorTag: 'representation-misread',
      rationale: 'The digits swapped - traps reading "tens and ones" in the wrong order.',
    },
    {
      text: String(t + o),
      errorTag: 'concept-misconception',
      rationale: 'Adds the digit counts (tens plus ones as plain numbers) - place value ignored.',
    },
  ]);
  return {
    type: 'representation',
    prompt: `Circle the number that shows ${t} ${unitFor(t, 'ten')} and ${o} ${unitFor(o, 'one')}.`,
    choices,
    answer: { value: correctKey, acceptableForms: [String(10 * t + o)], validation: 'choice-key' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'which_shows_choice_v1', params: { t, o }, seed: rng.uint() },
    hintLadder: [
      'The tens digit sits on the left, the ones digit on the right.',
      `${t} ${unitFor(t, 'ten')} is worth much more than ${t} ${unitFor(t, 'one')}.`,
    ],
    errorTags: ['representation-misread', 'concept-misconception'],
  };
}

function boxStory(rng: Rng, guard: TupleGuard, difficulty: number, twist: boolean): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({
      t: r.int(2, 8),
      o: twist ? r.int(11, 16) : r.int(2, 9),
      name: r.pick(NAMES),
      thing: r.pick(THINGS),
    }),
    (v) => `boxstory:${[v.t, v.o].sort((a, b) => a - b).join(':')}`,
  );
  const { t, o, name, thing } = draw;
  return {
    type: 'word-problem',
    prompt:
      `${thing[0].toUpperCase()}${thing.slice(1)} come in boxes of 10. ${name} has ${t} full ` +
      `boxes and ${o} loose ${thing}. How many ${thing} in all?`,
    answer: {
      value: String(10 * t + o),
      acceptableForms: [`${10 * t + o} ${thing}`],
      validation: 'exact-numeric',
      units: thing,
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'tens_ones_compose_v1',
      params: { t, o },
      seed: rng.uint(),
    },
    hintLadder: [
      'Each full box is one ten.',
      twist
        ? 'More than 9 loose ones - ten of them fill another box!'
        : 'Count the boxes by tens, then the loose ones on.',
    ],
    errorTags: twist ? ['procedure-slip', 'task-comprehension'] : ['task-comprehension'],
  };
}

/** Day-5 riddles (map's Day-5 focus: riddle cards). */
function riddleItem(rng: Rng, guard: TupleGuard, difficulty: number, reversedClues: boolean): ItemDraft {
  const { t, o } = drawTO(rng, guard, 'riddle');
  const prompt = reversedClues
    ? `Riddle card: my ones digit is ${o}. I have ${t} ${unitFor(t, 'ten')}. Who am I?`
    : `Riddle card: I have ${t} ${unitFor(t, 'ten')} and ${o} ${unitFor(o, 'one')}. Who am I?`;
  return {
    type: 'reasoning',
    prompt,
    answer: { value: String(10 * t + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'tens_ones_riddle_v1', params: { t, o }, seed: rng.uint() },
    hintLadder: [
      'Build it: tens first, then ones.',
      'Read the clues in place-value order, not the order they were said.',
    ],
    errorTags: ['representation-misread', 'concept-misconception'],
  };
}

function makeYourOwnRiddle(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { t, o } = drawTO(rng, guard, 'ownriddle');
  const n = 10 * t + o;
  return {
    type: 'reasoning',
    prompt: `Write your own riddle card for the number ${n}. Use the words "tens" and "ones".`,
    answer: {
      value: `I have ${t} ${unitFor(t, 'ten')} and ${o} ${unitFor(o, 'one')}`,
      acceptableForms: ['tens', 'ones'],
      validation: 'short-text-keyword',
    },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'tens_ones_riddle_v1', params: { t, o }, seed: rng.uint() },
    hintLadder: [
      'Which digit tells the tens? Which tells the ones?',
      'Say it like a riddle: "I have ▢ tens and ▢ ones."',
    ],
    errorTags: ['concept-misconception'],
  };
}

// --- Retrieval warm-ups -----------------------------------------------------

function retrNumberAfter(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(rng, guard, (r) => r.pick([59, 79, 99, 109] as const) as number, (v) => `rafter:${v}`);
  return {
    type: 'computation',
    prompt: `Warm-up! What number comes just after ${n}?`,
    answer: { value: String(n + 1), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'B', week: 1 },
    generator: { templateId: 'retr_number_after_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['The ones are full - a new ten begins.'],
    errorTags: ['procedure-slip'],
  };
}

function retrPartners10(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const a = drawFresh(rng, guard, (r) => r.pick([1, 2, 3, 4, 6, 7, 8, 9] as const) as number, (v) => `p10:${v}`);
  return {
    type: 'computation',
    prompt: `Warm-up! ${a} and ▢ make 10.`,
    answer: { value: String(10 - a), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'A', week: 13 },
    generator: { templateId: 'retr_partners_of_10_v1', params: { a }, seed: rng.uint() },
    hintLadder: [`Count up from ${a} to 10.`],
    errorTags: ['fact-recall'],
  };
}

function retrTeen(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const o = drawFresh(rng, guard, (r) => r.int(1, 9), (v) => `teen:${v}`);
  return {
    type: 'computation',
    prompt: `Warm-up! 1 ten and ${o} ${unitFor(o, 'one')} make what number?`,
    answer: { value: String(10 + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'A', week: 23 },
    generator: { templateId: 'retr_teen_ten_ones_v1', params: { o }, seed: rng.uint() },
    hintLadder: ['Ten... and count the extras on.'],
    errorTags: ['fact-recall'],
  };
}

function retrCountTens(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const start = drawFresh(rng, guard, (r) => (r.pick([2, 3, 4, 5, 6] as const) as number) * 10, (v) => `ctens:${v}`);
  return {
    type: 'computation',
    prompt: `Warm-up! Count by tens: ${start}, ${start + 10}, ${start + 20}, ▢`,
    answer: { value: String(start + 30), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'A', week: 22 },
    generator: { templateId: 'retr_count_by_tens_v1', params: { start }, seed: rng.uint() },
    hintLadder: ['Ten more each time.'],
    errorTags: ['fact-recall'],
  };
}

export function buildB02(packSeed: number, contentVersion: string): WeeklyConceptPack {
  const guard = new TupleGuard();
  const d1 = streamRng(packSeed, 'd1');
  const d2 = streamRng(packSeed, 'd2');
  const d3 = streamRng(packSeed, 'd3');
  const d4 = streamRng(packSeed, 'd4');
  const d5 = streamRng(packSeed, 'd5');
  const pz = streamRng(packSeed, 'pz');
  const fs = streamRng(packSeed, 'fs');
  const ma = streamRng(packSeed, 'ma');
  const mb = streamRng(packSeed, 'mb');

  const days = [
    makeDay('B', 2, 1, 'concept-echo', 3, [
      retrNumberAfter(d1, guard, 2),
      retrPartners10(d1, guard, 1),
      compose(d1, guard, 2),
      expandedForm(d1, guard, 2),
      decompose(d1, guard, 3),
      compose(d1, guard, 3),
    ]),
    makeDay('B', 2, 2, 'fluency-application', 2, [
      retrTeen(d2, guard, 2),
      compose(d2, guard, 2),
      decompose(d2, guard, 3),
      expandedForm(d2, guard, 3),
      whichShows(d2, guard, 4),
      rebundle(d2, guard, 4),
    ]),
    makeDay('B', 2, 3, 'fluency-application', 2, [
      retrCountTens(d3, guard, 2),
      expandedForm(d3, guard, 2),
      decompose(d3, guard, 3),
      compose(d3, guard, 3),
      whichShows(d3, guard, 4),
      rebundle(d3, guard, 4),
    ]),
    makeDay('B', 2, 4, 'word-problems', 2, [
      boxStory(d4, guard, 3, false),
      boxStory(d4, guard, 3, false),
      retrPartners10(d4, guard, 2),
      boxStory(d4, guard, 5, true),
    ]),
    makeDay('B', 2, 5, 'noncomputational', 2, [
      riddleItem(d5, guard, 3, false),
      riddleItem(d5, guard, 3, true),
      makeYourOwnRiddle(d5, guard, 4),
      retrTeen(d5, guard, 2),
    ]),
  ];

  const pzDraw = drawFresh(
    pz,
    guard,
    (r) => {
      const d1v = r.int(1, 8);
      let d2v = r.int(2, 9);
      if (d2v === d1v) d2v = d1v + 1;
      return [Math.min(d1v, d2v), Math.max(d1v, d2v)] as const;
    },
    (v) => `pz:${v[0]}:${v[1]}`,
  );
  const big = Number(`${pzDraw[1]}${pzDraw[0]}`);
  const small = Number(`${pzDraw[0]}${pzDraw[1]}`);

  const formA = makeMasteryItems('B', 2, 'MA', [
    compose(ma, guard, 2),
    decompose(ma, guard, 3),
    expandedForm(ma, guard, 3),
    whichShows(ma, guard, 3),
    rebundle(ma, guard, 4),
    boxStory(ma, guard, 3, false),
  ]);
  const formB = makeMasteryItems('B', 2, 'MB', [
    compose(mb, guard, 2),
    decompose(mb, guard, 3),
    expandedForm(mb, guard, 3),
    whichShows(mb, guard, 3),
    rebundle(mb, guard, 4),
    boxStory(mb, guard, 3, false),
  ]);

  return {
    schemaVersion: '1.0',
    packId: 'MFM-B2',
    contentVersion,
    identity: {
      level: 'B',
      week: 2,
      conceptId: 'tens-and-ones',
      conceptName: 'Tens and ones',
      band: 'intermediate',
      strandTags: ['number-sense-counting'],
      prerequisiteWeeks: [
        { level: 'B', week: 1 },
        { level: 'A', week: 22 },
        { level: 'A', week: 23 },
      ],
    },
    presentation: {
      audioFirst: false,
      oneOperationPerPage: false,
      scaffoldNotes:
        'Labeled tens|ones columns with color headers on Days 1-2 (convention per E53); ' +
        'base-ten rod/cube imagery on Day 1; scaffold optional from Day 3. Dual ' +
        'audio+text directions.',
    },
    explanation: {
      hook:
        'Counting 47 loose marbles one at a time takes forever - and one sneeze ruins ' +
        'everything. What if we bagged them in tens? Suddenly you can SEE how many there are.',
      whyBeforeHow:
        'We bundle by ten because counting bundles is fast and safe. A two-digit number is ' +
        'a code for bundles-and-loose: in 47, the 4 counts bags of ten and the 7 counts ' +
        'loose marbles. The why: the POSITION of a digit tells what it counts - that is the ' +
        'whole trick of writing big numbers with only ten digits.',
      script: [
        {
          say: 'Watch me bundle: ten loose cubes snap into one rod. Rods are tens; loose cubes are ones.',
          visual: 'Ten cubes magnetize into a single rod labeled 10.',
        },
        {
          say: 'Now 47: I grab 4 rods - 10, 20, 30, 40 - and 7 loose cubes: 41, 42... 47. Four tens and seven ones.',
          visual: 'Tens|ones columns fill: 4 rods left, 7 cubes right; numeral 47 forms above.',
        },
        {
          say: 'The code reads left to right: tens digit first, ones digit second. 47 and 74 use the same digits but are very different numbers!',
          visual: '47 and 74 side by side; rods/cubes show the size gap.',
        },
        {
          say: 'Trap time: 3 tens and 12 ones. Too many loose ones! Ten of them bundle into another rod - now 4 tens, 2 ones. Same amount, tidy code: 42.',
          visual: 'Twelve cubes; ten flash and snap into a rod that slides to the tens column.',
        },
      ],
      summary:
        'Two-digit numbers are a bundles-code: the left digit counts tens, the right counts ' +
        'ones. More than 9 loose ones? Bundle ten into a new ten first.',
      vocabulary: [
        { term: 'ten (bundle)', kidGloss: 'ten ones snapped together' },
        { term: 'ones', kidGloss: 'the loose, unbundled things' },
        { term: 'digit', kidGloss: 'a symbol 0-9; its seat decides what it counts' },
        { term: 'place value', kidGloss: 'the rule that the seat gives a digit its worth' },
      ],
    },
    guidedExamples: [
      {
        id: contentId('B', 2, 'GE', 1),
        fadeLevel: 'modeled',
        prompt: 'Build 35 with rods and cubes.',
        steps: [
          {
            teacherSay:
              'I take 3 rods - 10, 20, 30 - and 5 cubes: 31, 32, 33, 34, 35. Three tens, five ones: 35.',
            expected: '35',
          },
        ],
        answer: '35',
      },
      {
        id: contentId('B', 2, 'GE', 2),
        fadeLevel: 'completion',
        prompt: '[image: 6 rods and 2 cubes in labeled columns] Read the number.',
        // The direction stays in the prompt (it is what QG-1/QG-4 sign), but the
        // picture is now DRAWN. Without this the child was shown the direction
        // itself — "🖼 6 rods and 2 cubes in labeled columns" — and asked to read
        // a number off a diagram that was never on the screen.
        figure: {
          type: 'place-value-chart',
          alt: '6 rods and 2 cubes in labeled tens and ones columns',
          params: { digits: '62', showValues: true },
        },
        steps: [
          { teacherSay: 'Count the rods by tens with me: 10, 20...' },
          { childDo: 'Finish the tens, then count the cubes on.', expected: '60... 61, 62' },
        ],
        answer: '62',
      },
      {
        id: contentId('B', 2, 'GE', 3),
        fadeLevel: 'prompted',
        prompt: 'Build the number 81 yourself.',
        steps: [
          { teacherSay: 'Which digit tells you how many rods?', expected: 'the 8' },
          { childDo: 'Set out the rods and cubes.', expected: '8 rods, 1 cube' },
        ],
        answer: '8 rods and 1 cube',
      },
      {
        id: contentId('B', 2, 'GE', 4),
        fadeLevel: 'independent',
        prompt: 'Trap case: 2 tens and 15 ones. What number is that? Rebundle first.',
        steps: [
          { childDo: 'Bundle ten loose ones into a rod, then read the number.', expected: '3 tens 5 ones -> 35' },
        ],
        answer: '35',
      },
    ],
    days,
    puzzle: {
      id: contentId('B', 2, 'PZ', 1),
      title: 'Puzzle Grove: Digit Flip',
      puzzleType: 'logic',
      prompt:
        `You have two digit cards: ${pzDraw[0]} and ${pzDraw[1]}. Make the BIGGEST two-digit ` +
        'number you can, and the SMALLEST. Which card did you put in the tens seat each time - and why?',
      answer: {
        value: `biggest ${big}; smallest ${small}`,
        acceptableForms: [String(big), String(small)],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'The tens seat is worth more - which card deserves it for the biggest number?',
        'For the smallest number, think the opposite way.',
      ],
      errorTags: ['concept-misconception'],
    },
    fluencySprint: {
      id: contentId('B', 2, 'FS', 1),
      skill: 'Writing numbers 0-20 from spoken words',
      sourceWeek: { level: 'A', week: 10 },
      durationSeconds: SPRINT_DURATION_SECONDS,
      itemCount: 15,
      scheduledDay: 2,
      selfReferenced: true,
      graded: false,
      generator: {
        templateId: 'numeral_writing_v1',
        params: { min: 0, max: 20 },
        seed: fs.uint(),
      },
    },
    masteryCheck: {
      passThresholdPct: MASTERY_THRESHOLD_PCT,
      fastTrackPct: FAST_TRACK_PCT,
      formA,
      formB,
      isomorphNotes:
        'Pairs by index; same template and difficulty per slot. 01: compose tens+ones. ' +
        '02: decompose (name the tens). 03: expanded form. 04: circle-the-code with ' +
        'digit-swap and digits-added distractors (both affordances preserved). 05: ' +
        'rebundle trap with 11-19 loose ones. 06: boxes-of-ten story. No tens/ones pair ' +
        'reused from Form A or the daily pages.',
    },
    mistakeBank: [
      {
        errorTag: 'representation-misread',
        subtype: 'digit-swap',
        description: 'Reads or writes the digits in the wrong seats: 4 tens 7 ones becomes 74.',
        exampleWrongAnswer: '4 tens and 7 ones -> 74',
        distractorRationale: 'Offer the digit-swapped number on compose/read items.',
        reteachPointer: 'explanation/script[2] (47 vs 74 - the seat decides)',
      },
      {
        errorTag: 'concept-misconception',
        subtype: 'digits-as-counts',
        description:
          'Treats tens and ones as plain counts and adds them: 5 tens and 3 ones becomes 8.',
        exampleWrongAnswer: '5 tens and 3 ones -> 8',
        distractorRationale: 'Offer (t + o) as a distractor on compose items.',
        reteachPointer: 'guidedExamples/B2-GE-01 (count rods by TENS, not by rods)',
      },
      {
        errorTag: 'procedure-slip',
        subtype: 'rebundle-skip',
        description:
          'Writes extra ones straight into the code instead of bundling: 3 tens 12 ones becomes 312.',
        exampleWrongAnswer: '3 tens and 12 ones -> 312',
        distractorRationale: 'Offer the glued form (t then o) on rebundle items.',
        reteachPointer: 'explanation/script[3] + guidedExamples/B2-GE-04 (bundle ten first)',
      },
      {
        errorTag: 'fact-recall',
        subtype: 'tens-count-slip',
        description: 'Counts rods by ones ("1, 2, 3, 4") and answers with the rod count.',
        exampleWrongAnswer: 'reads 4 rods 7 cubes as 11',
        distractorRationale: 'Offer (t + o) alongside the structural distractors.',
        reteachPointer: '60-second count-by-tens chant; feed the sprint pool',
      },
    ],
    parentSummarySeed: {
      whatWeWorkedOn:
        'Reading and building two-digit numbers as tens and ones - 47 is 4 bags of ten plus ' +
        '7 loose - including the trap case where more than 9 loose ones must be bundled ' +
        'into a new ten first.',
      improvingCandidates: [
        'building a number from "tens and ones" clues without counting by ones',
        'catching the digit-swap trap (47 vs 74)',
        'rebundling extra ones into a new ten before writing the number',
      ],
      strengtheningByTag: [
        {
          errorTag: 'representation-misread',
          text: 'keeping each digit in its seat (4 tens 7 ones is 47, never 74) - riddle cards will stay in the warm-ups',
        },
        {
          errorTag: 'concept-misconception',
          text: 'remembering a tens digit counts BUNDLES (5 tens and 3 ones is 53, not 8) - the rod-and-cube pictures stay alongside a little longer',
        },
        {
          errorTag: 'procedure-slip',
          text: 'bundling ten loose ones into a new ten before reading the number - one trap case will keep visiting',
        },
      ],
      homeFocus: {
        praiseLine:
          'You spotted that 12 loose ones were hiding another ten - bundling before reading is expert place-value thinking.',
        questionForChild: 'If crackers come in packs of 10 and you have 3 packs and 4 loose, how many crackers - and how did you count?',
      },
      vocabularyForParent: [
        'place value (the seat gives the digit its worth)',
        'ten / bundle (ten ones grouped)',
        'rebundle (trade ten loose ones for one ten)',
      ],
    },
  };
}
