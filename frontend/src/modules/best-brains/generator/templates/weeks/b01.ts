/**
 * Level B · Week 1 — "Numbers to 120" (conceptId: numbers-to-120).
 * CURRICULUM-MAP Level B row 1: count/read/write to 120; number-path
 * navigation. Day-5 focus: hundred-chart hidden-picture logic puzzle.
 *
 * Retrieval (QG-2): cross-level backward from Level A (placement guarantees the
 * Level A exit profile): A13 partners of 10, A15 addition within 10, A22
 * counting by tens, A23 teen numbers.
 */

import type { WeeklyConceptPack } from '../../../types';
import { FAST_TRACK_PCT, MASTERY_THRESHOLD_PCT, SPRINT_DURATION_SECONDS } from '../../../constants';
import { streamRng, Rng } from '../../rng';
import {
  contentId,
  drawFresh,
  ItemDraft,
  makeChoices,
  makeDay,
  makeMasteryItems,
  numberWords,
  TupleGuard,
} from '../shared';

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor'] as const;

function numberAfter(
  rng: Rng,
  guard: TupleGuard,
  kind: 'plain' | 'decade' | 'hundred',
  difficulty: number,
): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => {
      if (kind === 'decade') return r.pick([29, 39, 49, 59, 69, 79, 89] as const) as number;
      if (kind === 'hundred') return r.int(99, 119);
      const base = r.int(21, 108);
      return base % 10 === 9 ? base - 1 : base; // keep 'plain' off decade edges
    },
    (v) => `after:${v}`,
  );
  return {
    type: 'computation',
    prompt: `What number comes just after ${n}?`,
    answer: { value: String(n + 1), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'number_after_v1', params: { n }, seed: rng.uint() },
    hintLadder:
      kind === 'plain'
        ? ['Say the count out loud, starting a little before.']
        : [
            'Say the count out loud, starting a little before.',
            'When the ones reach 9, a new ten begins - the song keeps going.',
          ],
    errorTags: kind === 'plain' ? ['fact-recall'] : ['procedure-slip'],
  };
}

function numberBefore(rng: Rng, guard: TupleGuard, cross: boolean, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => {
      if (cross) return (r.pick([3, 4, 5, 6, 7, 8, 9, 10, 11] as const) as number) * 10;
      const base = r.int(22, 118);
      return base % 10 === 0 ? base + 1 : base;
    },
    (v) => `before:${v}`,
  );
  return {
    type: 'computation',
    prompt: `What number comes just before ${n}?`,
    answer: { value: String(n - 1), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'number_before_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'Count up TO the number and listen for the one you pass on the way.',
      cross ? 'Just before a round ten comes a number ending in 9.' : 'Step back one on the number path.',
    ],
    errorTags: cross ? ['procedure-slip'] : ['fact-recall'],
  };
}

function numberBetween(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const a = drawFresh(rng, guard, (r) => r.int(20, 117), (v) => `between:${v}`);
  return {
    type: 'computation',
    prompt: `What number comes between ${a} and ${a + 2}?`,
    answer: { value: String(a + 1), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'number_between_v1', params: { a }, seed: rng.uint() },
    hintLadder: ['Say the number path out loud and listen for the gap.'],
    errorTags: ['fact-recall'],
  };
}

function fillPath(rng: Rng, guard: TupleGuard, kind: 'plain' | 'decade' | 'hundred', difficulty: number): ItemDraft {
  const start = drawFresh(
    rng,
    guard,
    (r) => {
      if (kind === 'decade') return (r.pick([2, 3, 4, 5, 6, 7, 8] as const) as number) * 10 + 8; // e.g. 38,39,▢,41
      if (kind === 'hundred') return r.int(97, 99); // crosses 100 inside the path
      const base = r.int(21, 114);
      return base % 10 >= 7 ? base - 4 : base;
    },
    (v) => `path:${v}`,
  );
  return {
    type: 'computation',
    prompt: `Fill in the missing number: ${start}, ${start + 1}, ▢, ${start + 3}`,
    answer: { value: String(start + 2), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'fill_path_v1', params: { start }, seed: rng.uint() },
    hintLadder: [
      'Say the numbers in order and listen for the missing one.',
      kind === 'hundred'
        ? 'The count crosses a whole hundred inside this path - say it out loud and keep going.'
        : 'Each step goes up by exactly one.',
    ],
    errorTags: kind === 'plain' ? ['fact-recall'] : ['procedure-slip'],
  };
}

function readWriteWords(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => (r.chance(0.6) ? r.int(101, 120) : r.int(21, 99)),
    (v) => `words:${v}`,
  );
  return {
    type: 'representation',
    prompt: `Write the numeral for: "${numberWords(n)}".`,
    answer: { value: String(n), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'read_write_words_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'Listen for the biggest part first - is there a hundred?',
      'Write the parts in place: hundreds, then tens, then ones - with no extra zeros.',
    ],
    errorTags: ['concept-misconception', 'representation-misread'],
  };
}

function nextAfterChoice(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(rng, guard, (r) => r.pick([109, 110, 113, 118] as const) as number, (v) => `nextmc:${v}`);
  // The "gluing" misconception writes "one hundred <rest>" as 100 glued to <rest>.
  const gluedText = `100${(n % 100) + 1}`;
  const { choices, correctKey } = makeChoices(rng, String(n + 1), [
    {
      text: gluedText,
      errorTag: 'concept-misconception',
      rationale: 'Glues the spoken parts together instead of using place value.',
    },
    {
      text: String(n + 10),
      errorTag: 'procedure-slip',
      rationale: 'Jumps a whole ten instead of counting on by one.',
    },
  ]);
  return {
    type: 'computation',
    prompt: `Circle the number that comes just after ${n}.`,
    choices,
    answer: { value: correctKey, acceptableForms: [String(n + 1)], validation: 'choice-key' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'next_after_choice_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Count on by ONE.', 'The ones place climbs first; only a full 9 rolls the tens.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  };
}

// --- Retrieval warm-ups (Level A sources) ----------------------------------

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
    hintLadder: [`Count up from ${a} to 10 on your fingers.`],
    errorTags: ['fact-recall'],
  };
}

function retrAdd10(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const a = r.int(2, 8);
      const b = r.int(1, Math.min(9, 10 - a));
      return { a, b };
    },
    (v) => `a10:${v.a}:${v.b}`,
  );
  const { a, b } = draw;
  return {
    type: 'computation',
    prompt: `Warm-up! ${a} + ${b} = ?`,
    answer: { value: String(a + b), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'A', week: 15 },
    generator: { templateId: 'retr_add_within_10_v1', params: { a, b }, seed: rng.uint() },
    hintLadder: ['Start with the bigger number and count on.'],
    errorTags: ['fact-recall'],
  };
}

function retrTeen(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const o = drawFresh(rng, guard, (r) => r.int(1, 9), (v) => `teen:${v}`);
  return {
    type: 'computation',
    prompt: `Warm-up! 1 ten and ${o} ones make what number?`,
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
  const start = drawFresh(rng, guard, (r) => (r.pick([1, 2, 3, 4, 5] as const) as number) * 10, (v) => `ctens:${v}`);
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

// --- Day-4 stories and Day-5 hundred-chart reasoning -----------------------

function pageStory(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ n: r.pick([88, 89, 98, 99, 108, 109] as const) as number, name: r.pick(NAMES) }),
    (v) => `page:${v.n}`,
  );
  const { n, name } = draw;
  return {
    type: 'word-problem',
    prompt: `${name} is reading page ${n} of a big picture book. What page comes next?`,
    answer: { value: String(n + 1), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'number_after_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Pages count up by one.', 'When the ones reach 9, a new ten begins.'],
    errorTags: ['procedure-slip', 'task-comprehension'],
  };
}

function seatStory(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const n = (r.pick([4, 5, 6, 7, 8, 9, 10, 11] as const) as number) * 10;
      return { n, name1: r.pick(NAMES), name2: r.pick(NAMES) };
    },
    (v) => `seat:${v.n}`,
  );
  const { n, name1 } = draw;
  const name2 = draw.name2 === name1 ? 'Ken' : draw.name2;
  return {
    type: 'word-problem',
    prompt: `Theater seats are numbered in order. ${name1} sits in seat ${n}. ${name2} sits in the seat just before. Which seat is ${name2}'s?`,
    answer: { value: String(n - 1), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'number_before_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['"Just before" means one step back on the number path.', 'Just before a round ten comes a number ending in 9.'],
    errorTags: ['procedure-slip', 'task-comprehension'],
  };
}

function nextTwoStory(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ n: r.pick([97, 98, 107, 108, 117] as const) as number, name: r.pick(NAMES) }),
    (v) => `next2:${v.n}`,
  );
  const { n, name } = draw;
  return {
    type: 'word-problem',
    prompt: `${name} counts "${n}, ${n + 1}" and stops. What are the NEXT TWO numbers, in order?`,
    answer: {
      value: `${n + 2}, ${n + 3}`,
      acceptableForms: [`${n + 2} ${n + 3}`],
      validation: 'ordered-list',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'next_two_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Keep the count going one at a time.', 'A new ten (or hundred) is not a wall - the song keeps going.'],
    errorTags: ['procedure-slip'],
  };
}

function chartBelow(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => {
      const base = r.int(21, 89);
      return base % 10 === 0 ? base + 3 : base;
    },
    (v) => `below:${v}`,
  );
  return {
    type: 'reasoning',
    prompt: `On the hundred chart, what number sits directly BELOW ${n}?`,
    answer: { value: String(n + 10), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'chart_below_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'Each chart row holds ten numbers.',
      'Moving down one row keeps the ones digit and grows the tens by one.',
    ],
    errorTags: ['representation-misread', 'concept-misconception'],
  };
}

function chartColumn(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ a: r.int(11, 49), name: r.pick(NAMES) }),
    (v) => `col:${v.a}`,
  );
  const { a, name } = draw;
  return {
    type: 'reasoning',
    prompt:
      `${name} shades ${a}, ${a + 10}, ${a + 20}, and ${a + 30} on the hundred chart - ` +
      'a straight line of squares going down. What number does the line hit next?',
    answer: { value: String(a + 40), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'chart_column_v1', params: { a }, seed: rng.uint() },
    hintLadder: ['Look at the shaded squares on the chart - they make a straight line.', 'How much bigger is each shaded number than the one before?'],
    errorTags: ['concept-misconception'],
  };
}

function chartWalk(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => {
      const base = r.int(22, 77);
      return base % 10 === 9 || base % 10 === 0 ? base - 2 : base;
    },
    (v) => `walk:${v}`,
  );
  return {
    type: 'reasoning',
    prompt: `Start at ${n} on the hundred chart. Move DOWN one row, then RIGHT one square. What number are you on?`,
    answer: { value: String(n + 11), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'chart_walk_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Down one row first. What did that do to the number?', 'Then one square right - one more.'],
    errorTags: ['representation-misread', 'procedure-slip'],
  };
}

export function buildB01(packSeed: number, contentVersion: string): WeeklyConceptPack {
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
    makeDay('B', 1, 1, 'concept-echo', 2, [
      retrPartners10(d1, guard, 1),
      retrAdd10(d1, guard, 2),
      numberAfter(d1, guard, 'plain', 2),
      numberBefore(d1, guard, false, 2),
      fillPath(d1, guard, 'plain', 3),
      numberAfter(d1, guard, 'decade', 3),
    ]),
    makeDay('B', 1, 2, 'fluency-application', 2, [
      retrTeen(d2, guard, 2),
      numberBetween(d2, guard, 2),
      fillPath(d2, guard, 'decade', 3),
      readWriteWords(d2, guard, 3),
      numberAfter(d2, guard, 'hundred', 3),
      nextAfterChoice(d2, guard, 4),
    ]),
    makeDay('B', 1, 3, 'fluency-application', 2, [
      retrCountTens(d3, guard, 2),
      numberBetween(d3, guard, 2),
      numberBefore(d3, guard, true, 3),
      readWriteWords(d3, guard, 3),
      fillPath(d3, guard, 'hundred', 4),
      numberAfter(d3, guard, 'hundred', 4),
    ]),
    makeDay('B', 1, 4, 'word-problems', 2, [
      pageStory(d4, guard, 3),
      seatStory(d4, guard, 3),
      retrAdd10(d4, guard, 2),
      nextTwoStory(d4, guard, 4),
    ]),
    makeDay('B', 1, 5, 'noncomputational', 2, [
      chartBelow(d5, guard, 3),
      chartColumn(d5, guard, 3),
      chartWalk(d5, guard, 4),
      retrCountTens(d5, guard, 2),
    ]),
  ];

  const riddle = drawFresh(
    pz,
    guard,
    (r) => {
      const t = r.int(3, 10);
      const d = r.int(1, 9);
      return { x: 10 * t + d, d };
    },
    (v) => `riddle:${v.x}`,
  );

  const formA = makeMasteryItems('B', 1, 'MA', [
    numberAfter(ma, guard, 'plain', 2),
    numberBefore(ma, guard, true, 3),
    fillPath(ma, guard, 'decade', 3),
    readWriteWords(ma, guard, 3),
    numberAfter(ma, guard, 'hundred', 4),
    numberBetween(ma, guard, 3),
  ]);
  const formB = makeMasteryItems('B', 1, 'MB', [
    numberAfter(mb, guard, 'plain', 2),
    numberBefore(mb, guard, true, 3),
    fillPath(mb, guard, 'decade', 3),
    readWriteWords(mb, guard, 3),
    numberAfter(mb, guard, 'hundred', 4),
    numberBetween(mb, guard, 3),
  ]);

  return {
    schemaVersion: '1.0',
    packId: 'MFM-B1',
    contentVersion,
    identity: {
      level: 'B',
      week: 1,
      conceptId: 'numbers-to-120',
      conceptName: 'Numbers to 120',
      band: 'intermediate',
      strandTags: ['number-sense-counting'],
      prerequisiteWeeks: [
        { level: 'A', week: 9 },
        { level: 'A', week: 22 },
        { level: 'A', week: 23 },
      ],
    },
    presentation: {
      audioFirst: false,
      oneOperationPerPage: false,
      scaffoldNotes:
        'Hundred chart available on every page (extends to 120 on Days 2-5); dual ' +
        'audio+text directions; number-path strips for before/after items on Day 1.',
    },
    explanation: {
      hook:
        'After 99, what comes next? Some kids say "ninety-ten"! Today we find out how ' +
        'numbers keep marching past 100 - without ever running out.',
      whyBeforeHow:
        'Numbers follow one repeating song: the ones climb 0 to 9, then a new ten begins. ' +
        '100 is not a wall - it is just ten tens, and the song keeps going: 101, 102, 103... ' +
        'The why: once you hear the pattern, you can start counting from ANY number - no ' +
        'need to go back to 1.',
      script: [
        {
          say: 'Listen to the count cross a ten: 37, 38, 39... the ones are full, so a new ten begins: 40!',
          visual: 'Number path with 37-41; the 39→40 hop glows as the tens digit flips.',
        },
        {
          say: 'The hundred chart shows the song as rows. Every row is ten numbers; the end of a row is where the new ten begins.',
          visual: 'Hundred chart; one full row highlights, then the first square of the next row.',
        },
        {
          say: 'Now the big crossing: 98, 99, 100... and the song keeps going: 101, 102! One hundred, then one hundred one.',
          visual: 'Chart extends past 100 to 120; the 99→100→101 squares light in sequence.',
        },
        {
          say: 'Number words are the same code: "one hundred twelve" means 1 hundred, 1 ten, 2 ones - written 112, not 10012.',
          visual: '"one hundred twelve" splits into 100 + 12 and snaps together as 112.',
        },
      ],
      summary:
        'The ones climb 0-9, then a new ten begins; after 99 comes 100 and the count keeps ' +
        'going to 120. Read and write numbers by their parts: hundreds, tens, ones.',
      vocabulary: [
        { term: 'number path', kidGloss: 'the counting line where every number has a spot' },
        { term: 'hundred chart', kidGloss: 'the counting song written in rows of ten' },
        { term: 'digit', kidGloss: 'one of the symbols 0-9 that build every number' },
      ],
    },
    guidedExamples: [
      {
        id: contentId('B', 1, 'GE', 1),
        fadeLevel: 'modeled',
        prompt: 'Count from 97 to 103 out loud.',
        steps: [
          {
            teacherSay:
              'I count: 97, 98, 99... the ones are full AND the tens are full, so a whole new hundred begins: 100! Then the song keeps going: 101, 102, 103.',
            expected: '97, 98, 99, 100, 101, 102, 103',
          },
        ],
        answer: '97, 98, 99, 100, 101, 102, 103',
      },
      {
        id: contentId('B', 1, 'GE', 2),
        fadeLevel: 'completion',
        prompt: 'Fill the missing numbers: 58, 59, ▢, 61, ▢',
        steps: [
          { teacherSay: 'The ones hit 9 at 59 - so what begins next?' },
          { childDo: 'Fill both boxes.', expected: '60 and 62' },
        ],
        answer: '60 and 62',
      },
      {
        id: contentId('B', 1, 'GE', 3),
        fadeLevel: 'prompted',
        prompt: 'Write the numeral for "one hundred seven".',
        steps: [
          { teacherSay: 'How many hundreds? How many tens? How many ones?', expected: '1 hundred, 0 tens, 7 ones' },
          { childDo: 'Write it - remember the empty tens place needs a 0.', expected: '107' },
        ],
        answer: '107',
      },
      {
        id: contentId('B', 1, 'GE', 4),
        fadeLevel: 'independent',
        prompt: 'What number comes just before 110? Solve cold.',
        steps: [{ childDo: 'Step one back on the number path.', expected: '109' }],
        answer: '109',
      },
    ],
    days,
    puzzle: {
      id: contentId('B', 1, 'PZ', 1),
      title: 'Puzzle Grove: The Hiding Number',
      puzzleType: 'logic',
      prompt:
        `I am hiding on the hundred chart. I am bigger than ${riddle.x - 3} and smaller ` +
        `than ${riddle.x + 3}. My ones digit is ${riddle.d}. Who am I?`,
      answer: { value: String(riddle.x), acceptableForms: [], validation: 'exact-numeric' },
      hintLadder: [
        'List every number between the two clues.',
        'Now check each one\'s ones digit against the last clue.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    },
    fluencySprint: {
      id: contentId('B', 1, 'FS', 1),
      skill: 'Addition facts within 10',
      sourceWeek: { level: 'A', week: 15 },
      durationSeconds: SPRINT_DURATION_SECONDS,
      itemCount: 20,
      scheduledDay: 3,
      selfReferenced: true,
      graded: false,
      generator: {
        templateId: 'add_within_10_facts_v1',
        params: { min: 1, max: 9, sumMax: 10 },
        seed: fs.uint(),
      },
    },
    masteryCheck: {
      passThresholdPct: MASTERY_THRESHOLD_PCT,
      fastTrackPct: FAST_TRACK_PCT,
      formA,
      formB,
      isomorphNotes:
        'Pairs by index; same template and difficulty per slot. 01: plain number-after, ' +
        'off decade edges. 02: number-before across a round ten (ending-9 affordance ' +
        'preserved). 03: fill-the-path across a decade. 04: word-form to numeral (mix of ' +
        'two- and three-digit). 05: number-after in the 99-120 range (hundred-crossing ' +
        'affordance preserved). 06: number-between. No operand reused from Form A or the ' +
        'daily pages.',
    },
    mistakeBank: [
      {
        errorTag: 'procedure-slip',
        subtype: 'decade-cross-stall',
        description:
          'Counts smoothly inside a decade but stalls or invents "eighty-ten" when the ones reach 9.',
        exampleWrongAnswer: 'after 89: "eighty-ten" (or 810)',
        distractorRationale: 'Offer the same-decade repeat (80) or a glued form on after-x9 items.',
        reteachPointer: 'explanation/script[0] (the ones fill up, a new ten begins)',
      },
      {
        errorTag: 'concept-misconception',
        subtype: 'hundred-gluing',
        description:
          'Writes spoken hundreds by gluing the parts: "one hundred twelve" becomes 10012.',
        exampleWrongAnswer: 'one hundred twelve -> 10012',
        distractorRationale: 'Offer the glued form as a distractor on word-to-numeral items.',
        reteachPointer: 'explanation/script[3] + guidedExamples/B1-GE-03 (parts snap into places)',
      },
      {
        errorTag: 'representation-misread',
        subtype: 'teen-reversal',
        description: 'Reverses teen numbers when writing: hears "twelve", writes 21.',
        exampleWrongAnswer: 'twelve -> 21',
        distractorRationale: 'Offer the digit-swapped numeral on word-form items.',
        reteachPointer: 'guidedExamples/B1-GE-03 (say the parts before writing)',
      },
      {
        errorTag: 'fact-recall',
        subtype: 'decade-word-confusion',
        description: 'Mixes up decade words and teen words (forty vs fourteen).',
        exampleWrongAnswer: 'forty -> 14',
        distractorRationale: 'Offer the teen/decade twin on word-form items.',
        reteachPointer: '60-second decade-word chant; feed the sprint pool',
      },
    ],
    parentSummarySeed: {
      whatWeWorkedOn:
        'Counting, reading and writing numbers all the way to 120 - especially the tricky ' +
        'crossings (39 to 40, 99 to 100) and writing number words like "one hundred twelve" ' +
        'as 112 using place value.',
      improvingCandidates: [
        'counting across tens without stalling (39 to 40, 89 to 90)',
        'crossing 100 and continuing to 101, 102 with confidence',
        'writing spoken numbers with the digits in the right places',
      ],
      strengtheningByTag: [
        {
          errorTag: 'procedure-slip',
          text: 'the moment the ones reach 9 and a new ten begins - warm-ups will keep one decade-crossing in the mix',
        },
        {
          errorTag: 'concept-misconception',
          text: 'writing hundreds without gluing the parts together (112, not 10012) - we will keep splitting the words into hundreds, tens and ones',
        },
        {
          errorTag: 'representation-misread',
          text: 'teen numbers in the right order (twelve is 12, not 21) - a little daily word-to-number practice continues',
        },
      ],
      homeFocus: {
        praiseLine:
          'You sailed straight past 99 to 100 and kept going - that used to be a wall, and now it is just a step.',
        questionForChild: 'What number comes right after 109 - and how do you know?',
        schoolSyncHook:
          'If you share how high your child\'s class is counting right now, we will lean the warm-ups toward it.',
      },
      vocabularyForParent: [
        'number path (the counting line)',
        'hundred chart (numbers in rows of ten)',
        'digit (a symbol 0-9; position gives it value)',
      ],
    },
  };
}
