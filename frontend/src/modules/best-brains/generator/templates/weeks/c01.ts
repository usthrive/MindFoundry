/**
 * Level C · Week 1 — "Place value to 1,000" (conceptId: place-value-to-1000).
 * CURRICULUM-MAP Level C row 1: read/write/expand 3-digit numbers;
 * hundreds|tens|ones columns (scaffold per E53). Day-5 focus: number riddles
 * with place-value clues.
 *
 * Retrieval (QG-2): cross-level backward from Level B (placement guarantees the
 * Level B exit profile): B2 tens and ones, B13 addition within 100, B14
 * subtraction within 100, B18 skip counting.
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
import { countNoun } from '../lib/format';

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor'] as const;

interface HTO {
  h: number;
  t: number;
  o: number;
}

/** Distinct nonzero digits so digit-value questions are unambiguous. */
function drawHTO(rng: Rng, guard: TupleGuard, kind: string): HTO {
  return drawFresh(
    rng,
    guard,
    (r) => {
      const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
      return { h: digits[0], t: digits[1], o: digits[2] };
    },
    // Order-insensitive: permuted digit triples read as the same surface.
    (v) => `${kind}:${[v.h, v.t, v.o].sort((a, b) => a - b).join('')}`,
  );
}

function compose3(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { h, t, o } = drawHTO(rng, guard, 'compose3');
  return {
    type: 'computation',
    prompt: `${countNoun(h, 'hundreds')}, ${countNoun(t, 'tens')}, and ${countNoun(o, 'ones')} make what number?`,
    answer: {
      value: String(100 * h + 10 * t + o),
      acceptableForms: [],
      validation: 'exact-numeric',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'compose_3digit_v1', params: { h, t, o }, seed: rng.uint() },
    hintLadder: [
      'Fill the seats left to right: hundreds, tens, ones.',
      'Each digit goes in its own seat - no seat stays empty here.',
    ],
    errorTags: ['concept-misconception'],
  };
}

function expanded3(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { h, t, o } = drawHTO(rng, guard, 'expanded3');
  return {
    type: 'computation',
    prompt: `${h * 100} + ${t * 10} + ${o} = ?`,
    answer: {
      value: String(100 * h + 10 * t + o),
      acceptableForms: [],
      validation: 'exact-numeric',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'expanded_3digit_v1', params: { h, t, o }, seed: rng.uint() },
    hintLadder: ['Each part already names its seat - slide them together.'],
    errorTags: ['fact-recall'],
  };
}

function digitValue(rng: Rng, guard: TupleGuard, place: 10 | 100, difficulty: number): ItemDraft {
  const { h, t, o } = drawHTO(rng, guard, `dv${place}`);
  const n = 100 * h + 10 * t + o;
  const digit = place === 100 ? h : t;
  const placeName = place === 100 ? 'hundreds' : 'tens';
  return {
    type: 'computation',
    prompt: `What is the VALUE of the digit ${digit} in ${n}?`,
    answer: { value: String(digit * place), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'digit_value_v1',
      params: { n, digit, place },
      seed: rng.uint(),
    },
    hintLadder: [
      `Find which seat the ${digit} sits in.`,
      `A digit in the ${placeName} seat counts ${placeName}, not ones.`,
    ],
    errorTags: ['concept-misconception'],
  };
}

function digitValueChoice(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { h, t, o } = drawHTO(rng, guard, 'dvmc');
  const n = 100 * h + 10 * t + o;
  const { choices, correctKey } = makeChoices(rng, String(t * 10), [
    {
      text: String(t),
      errorTag: 'concept-misconception',
      rationale: 'The digit itself, not its value - the seat was ignored.',
    },
    {
      text: String(t * 100),
      errorTag: 'representation-misread',
      rationale: 'Right idea, wrong seat - the digit was read as hundreds.',
    },
  ]);
  return {
    type: 'representation',
    prompt: `In ${n}, what is the value of the digit ${t}?`,
    choices,
    answer: { value: correctKey, acceptableForms: [String(t * 10)], validation: 'choice-key' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'digit_value_choice_v1',
      params: { n, digit: t, place: 10 },
      seed: rng.uint(),
    },
    hintLadder: [
      `Point to the ${t} - which seat is it sitting in?`,
      'The seat multiplies the digit.',
    ],
    errorTags: ['concept-misconception', 'representation-misread'],
  };
}

function writeWords3(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => {
      const h = r.int(1, 9);
      const rest = r.int(1, 99);
      return 100 * h + rest;
    },
    (v) => `words3:${v}`,
  );
  return {
    type: 'representation',
    prompt: `Write the numeral for: "${numberWords(n)}".`,
    answer: { value: String(n), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'write_words_3digit_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'Split the words: hundreds part, then the rest.',
      'Three seats total - a silent seat still needs its 0.',
    ],
    errorTags: ['concept-misconception', 'representation-misread'],
  };
}

function zeroTens(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ h: r.int(2, 9), o: r.int(1, 9) }),
    // Shared "digit pair" namespace with the tens-and-ones warm-up: both render
    // two single-digit tokens, so they must stay mutually fresh (QG-1).
    (v) => `digitpair:${[v.h, v.o].sort((a, b) => a - b).join(':')}`,
  );
  const { h, o } = draw;
  return {
    type: 'computation',
    prompt: `${h} hundreds and ${o} ones - no tens at all. What number is that?`,
    answer: { value: String(100 * h + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'compose_3digit_v1',
      params: { h, t: 0, o },
      seed: rng.uint(),
    },
    hintLadder: [
      'Three seats: hundreds, tens, ones. What fills the empty tens seat?',
      'A zero holds the seat so the other digits keep their worth.',
    ],
    errorTags: ['procedure-slip', 'concept-misconception'],
  };
}

/** Day-5 place-value riddles (map's Day-5 focus). */
function pvRiddleDouble(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ h: r.int(1, 9), o: r.int(1, 4) }),
    (v) => `riddle2:${v.h}:${v.o}`,
  );
  const { h, o } = draw;
  const n = 100 * h + 10 * (2 * o) + o;
  return {
    type: 'reasoning',
    prompt:
      `Riddle: I am a three-digit number. My hundreds digit is ${h}. My tens digit is ` +
      `DOUBLE my ones digit. My ones digit is ${o}. Who am I?`,
    answer: { value: String(n), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'pv_riddle_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'Work out each digit first, then seat them.',
      'Start with the ones clue - the tens clue depends on it.',
    ],
    errorTags: ['task-comprehension', 'concept-misconception'],
  };
}

function pvRiddleSum(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const { h, t, o } = drawHTO(rng, guard, 'riddlesum');
  const n = 100 * h + 10 * t + o;
  return {
    type: 'reasoning',
    prompt:
      `Riddle: my hundreds digit is ${h} and my tens digit is ${t}. All three of my digits ` +
      `add up to ${h + t + o}. Who am I?`,
    answer: { value: String(n), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'pv_riddle_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      'Two digits are given. Which seat is still empty?',
      'What must the missing digit be so the three add up right?',
    ],
    errorTags: ['task-comprehension', 'fact-recall'],
  };
}

function whichWorthMore(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const d = r.int(2, 9);
      const others = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== d));
      // d sits in the hundreds seat of n1 and in the tens seat of n2 — nowhere else.
      const n1 = 100 * d + 10 * others[0] + others[1];
      const n2 = 100 * others[2] + 10 * d + others[3];
      return { d, n1, n2 };
    },
    (v) => `worth:${v.n1}:${v.n2}`,
  );
  const { d, n1, n2 } = draw;
  return {
    type: 'reasoning',
    prompt:
      `The digit ${d} appears in both ${n1} and ${n2}. In which number is that ${d} worth ` +
      'MORE? Explain with seats.',
    answer: {
      value: `in ${n1}, because there the ${d} sits in the hundreds seat`,
      acceptableForms: [String(n1), 'hundreds'],
      validation: 'short-text-keyword',
    },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'pv_riddle_v1', params: { n: n1 }, seed: rng.uint() },
    hintLadder: [
      `Find the seat of the ${d} in each number.`,
      'Hundreds seats beat tens seats, whatever the digit.',
    ],
    errorTags: ['concept-misconception'],
  };
}

// --- Day-4 stories ----------------------------------------------------------

function packStory(rng: Rng, guard: TupleGuard, difficulty: number, zeroTensTwist: boolean): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({
      h: r.int(2, 8),
      t: zeroTensTwist ? 0 : r.int(2, 9),
      o: r.int(2, 9),
      name: r.pick(NAMES),
    }),
    (v) => `pack:${[v.h, v.t, v.o].sort((a, b) => a - b).join(':')}`,
  );
  const { h, t, o, name } = draw;
  const n = 100 * h + 10 * t + o;
  const middle = zeroTensTwist ? '' : ` ${t} packs of 10 pencils,`;
  return {
    type: 'word-problem',
    prompt:
      `${name}'s school orders ${h} boxes of 100 pencils,${middle} and ${o} loose pencils. ` +
      'How many pencils is that in all?',
    answer: {
      value: String(n),
      acceptableForms: [`${n} pencils`],
      validation: 'exact-numeric',
      units: 'pencils',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'compose_3digit_v1', params: { h, t, o }, seed: rng.uint() },
    hintLadder: [
      'Boxes of 100 fill the hundreds seat; packs of 10 fill the tens seat.',
      zeroTensTwist
        ? 'No packs of ten at all - what holds the tens seat?'
        : 'Read the three amounts straight into their seats.',
    ],
    errorTags: zeroTensTwist ? ['procedure-slip', 'task-comprehension'] : ['task-comprehension'],
  };
}

function shelfStory(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ h: r.int(2, 7), t: r.int(2, 9), o: r.int(2, 9), name: r.pick(NAMES) }),
    (v) => `shelf:${v.h}:${v.t}:${v.o}`,
  );
  const { h, t, o, name } = draw;
  const n = 100 * h + 10 * t + o;
  return {
    type: 'word-problem',
    prompt:
      `A library shelf note says: "${numberWords(n)} books." ${name} must write the count ` +
      'as a numeral on the label. What should the label say?',
    answer: {
      value: String(n),
      acceptableForms: [`${n} books`],
      validation: 'exact-numeric',
      units: 'books',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'write_words_3digit_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Split the words: hundreds part first, then the rest.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  };
}

// --- Retrieval warm-ups (Level B sources) -----------------------------------

function retrTensOnes(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => ({ t: r.int(2, 9), o: r.int(1, 9) }),
    (v) => `digitpair:${[v.t, v.o].sort((a, b) => a - b).join(':')}`,
  );
  const { t, o } = draw;
  return {
    type: 'computation',
    prompt: `Warm-up! ${t} tens and ${o} ones make what number?`,
    answer: { value: String(10 * t + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'B', week: 2 },
    generator: { templateId: 'retr_tens_ones_v1', params: { t, o }, seed: rng.uint() },
    hintLadder: ['Count the tens by ten, then the ones on.'],
    errorTags: ['fact-recall'],
  };
}

function retrAdd100(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const a = r.int(24, 58);
      const b = r.int(13, 39);
      return { a, b: a % 10 + (b % 10) >= 10 ? b : b - (b % 10) + Math.min(9, 10 - (a % 10)) };
    },
    // Shared "2-digit pair" namespace with the subtraction warm-up: the same
    // ordered (a, b) tuple must not reappear across adjacent days (QG-1).
    (v) => `pair100:${v.a}:${v.b}`,
  );
  const { a, b } = draw;
  return {
    type: 'computation',
    prompt: `Warm-up! ${a} + ${b} = ?`,
    answer: { value: String(a + b), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'B', week: 13 },
    generator: { templateId: 'retr_add_within_100_v1', params: { a, b }, seed: rng.uint() },
    hintLadder: ['Ones first - carry the new ten if they cross.'],
    errorTags: ['procedure-slip'],
  };
}

function retrSub100(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const a = r.int(41, 92);
      const bOnes = Math.min(9, (a % 10) + r.int(1, 4));
      const bTens = r.int(1, Math.floor(a / 10) - 1);
      return { a, b: 10 * bTens + bOnes };
    },
    (v) => `pair100:${v.a}:${v.b}`,
  );
  const { a, b } = draw;
  return {
    type: 'computation',
    prompt: `Warm-up! ${a} - ${b} = ?`,
    answer: { value: String(a - b), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'B', week: 14 },
    generator: { templateId: 'retr_sub_within_100_v1', params: { a, b }, seed: rng.uint() },
    hintLadder: ['Can the ones pay? If not, trade a ten first.'],
    errorTags: ['procedure-slip'],
  };
}

function retrSkip(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const k = r.pick([2, 5, 10] as const) as number;
      const start = k * r.int(3, 8);
      return { k, start };
    },
    (v) => `rskip:${v.k}:${v.start}`,
  );
  const { k, start } = draw;
  return {
    type: 'computation',
    prompt: `Warm-up! Count by ${k}s: ${start}, ${start + k}, ▢`,
    answer: { value: String(start + 2 * k), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'B', week: 18 },
    generator: { templateId: 'retr_skip_count_v1', params: { start, k }, seed: rng.uint() },
    hintLadder: [`${k} more each time.`],
    errorTags: ['fact-recall'],
  };
}

export function buildC01(packSeed: number, contentVersion: string): WeeklyConceptPack {
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
    makeDay('C', 1, 1, 'concept-echo', 3, [
      retrTensOnes(d1, guard, 2),
      retrAdd100(d1, guard, 2),
      compose3(d1, guard, 2),
      expanded3(d1, guard, 2),
      digitValue(d1, guard, 100, 3),
      compose3(d1, guard, 3),
    ]),
    makeDay('C', 1, 2, 'fluency-application', 2, [
      retrSub100(d2, guard, 3),
      compose3(d2, guard, 2),
      expanded3(d2, guard, 3),
      digitValue(d2, guard, 10, 3),
      writeWords3(d2, guard, 3),
      zeroTens(d2, guard, 4),
    ]),
    makeDay('C', 1, 3, 'fluency-application', 2, [
      retrSkip(d3, guard, 2),
      expanded3(d3, guard, 2),
      digitValue(d3, guard, 10, 3),
      writeWords3(d3, guard, 3),
      zeroTens(d3, guard, 4),
      digitValueChoice(d3, guard, 4),
    ]),
    makeDay('C', 1, 4, 'word-problems', 2, [
      packStory(d4, guard, 3, false),
      shelfStory(d4, guard, 3),
      retrSub100(d4, guard, 3),
      packStory(d4, guard, 4, true),
    ]),
    makeDay('C', 1, 5, 'noncomputational', 2, [
      pvRiddleDouble(d5, guard, 3),
      pvRiddleSum(d5, guard, 3),
      whichWorthMore(d5, guard, 4),
      retrTensOnes(d5, guard, 2),
    ]),
  ];

  const pzDigits = drawFresh(
    pz,
    guard,
    (r) => r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3),
    (v) => `pz:${v.join('')}`,
  );
  const sorted = pzDigits.slice().sort((a, b) => b - a);
  const largest = Number(sorted.join(''));
  const smallest = Number(sorted.slice().reverse().join(''));

  const formA = makeMasteryItems('C', 1, 'MA', [
    compose3(ma, guard, 2),
    expanded3(ma, guard, 3),
    digitValue(ma, guard, 10, 3),
    writeWords3(ma, guard, 3),
    zeroTens(ma, guard, 4),
    digitValueChoice(ma, guard, 3),
  ]);
  const formB = makeMasteryItems('C', 1, 'MB', [
    compose3(mb, guard, 2),
    expanded3(mb, guard, 3),
    digitValue(mb, guard, 10, 3),
    writeWords3(mb, guard, 3),
    zeroTens(mb, guard, 4),
    digitValueChoice(mb, guard, 3),
  ]);

  return {
    schemaVersion: '1.0',
    packId: 'MFM-C1',
    contentVersion,
    identity: {
      level: 'C',
      week: 1,
      conceptId: 'place-value-to-1000',
      conceptName: 'Place value to 1,000',
      band: 'intermediate',
      strandTags: ['number-sense-counting'],
      prerequisiteWeeks: [
        { level: 'B', week: 2 },
        { level: 'B', week: 13 },
        { level: 'B', week: 14 },
      ],
    },
    presentation: {
      audioFirst: false,
      oneOperationPerPage: false,
      scaffoldNotes:
        'Labeled hundreds|tens|ones columns with color headers on Days 1-2 (per E53); ' +
        'base-ten flat/rod/cube imagery on Day 1; scaffold optional from Day 3.',
    },
    explanation: {
      hook:
        'One little digit - 4 - can mean four, forty, or four hundred. Same symbol, wildly ' +
        'different worth. What changed? Only its SEAT.',
      whyBeforeHow:
        'We write every number - even huge ones - with just ten digits, because the seat a ' +
        'digit sits in multiplies it. Ten ones make a ten; ten tens make a hundred; the ' +
        'seats grow by tens forever. The why: without seats we would need a new symbol for ' +
        'every number. With them, 3 digits can say anything up to 999.',
      script: [
        {
          say: 'Ten rods snap into one flat square: a hundred. Flats, rods, cubes - hundreds, tens, ones.',
          visual: 'Ten rods merge into one flat labeled 100; the three block types line up.',
        },
        {
          say: 'Watch me build 452: 4 flats - 100, 200, 300, 400 - then 5 rods - 410, 420... 450 - then 2 cubes: 451, 452.',
          visual: 'Hundreds|tens|ones columns fill left to right; numeral 452 forms above.',
        },
        {
          say: 'The digit 4 in 452 is worth 400. The digit 4 in 245 is worth only 40. The seat multiplies the digit!',
          visual: 'The two 4s highlighted; blocks show 400 vs 40 beneath them.',
        },
        {
          say: 'Trap: six hundred four. No tens! The tens seat cannot stay empty - a 0 holds it: 604, never 64.',
          visual: 'Empty tens column flashes; a 0 slides in; 604 vs 64 comparison.',
        },
      ],
      summary:
        'Three seats - hundreds, tens, ones - and the seat multiplies the digit. Empty ' +
        'seats get a 0 so every other digit keeps its worth.',
      vocabulary: [
        { term: 'hundred', kidGloss: 'ten tens bundled into one flat' },
        { term: 'place / seat', kidGloss: 'where a digit sits; it multiplies the digit' },
        { term: 'expanded form', kidGloss: 'a number stretched into its parts: 452 = 400 + 50 + 2' },
        { term: 'placeholder zero', kidGloss: 'the 0 that holds an empty seat' },
      ],
    },
    guidedExamples: [
      {
        id: contentId('C', 1, 'GE', 1),
        fadeLevel: 'modeled',
        prompt: 'Build 327 with flats, rods, and cubes.',
        steps: [
          {
            teacherSay:
              'I take 3 flats - 100, 200, 300 - then 2 rods - 310, 320 - then 7 cubes: 321 up to 327. Three seats, three digits: 327.',
            expected: '327',
          },
        ],
        answer: '327',
      },
      {
        id: contentId('C', 1, 'GE', 2),
        fadeLevel: 'completion',
        prompt: 'Stretch 581 into expanded form.',
        steps: [
          { teacherSay: 'The 5 sits in the hundreds seat: 500.' },
          { childDo: 'Stretch the other two digits.', expected: '80 and 1' },
          { teacherSay: 'So 581 = 500 + 80 + 1.' },
        ],
        answer: '500 + 80 + 1',
      },
      {
        id: contentId('C', 1, 'GE', 3),
        fadeLevel: 'prompted',
        prompt: 'What is the value of the 9 in 792?',
        steps: [
          { teacherSay: 'Which seat is the 9 sitting in?', expected: 'the tens seat' },
          { childDo: 'Multiply the digit by its seat.', expected: '90' },
        ],
        answer: '90',
      },
      {
        id: contentId('C', 1, 'GE', 4),
        fadeLevel: 'independent',
        prompt: 'Write "seven hundred six" as a numeral. Solve cold.',
        steps: [
          { childDo: 'Three seats - fill each one, use a placeholder if needed.', expected: '706' },
        ],
        answer: '706',
      },
    ],
    days,
    puzzle: {
      id: contentId('C', 1, 'PZ', 1),
      title: 'Puzzle Grove: Three-Card Builder',
      puzzleType: 'logic',
      prompt:
        `You have three digit cards: ${pzDigits.join(', ')}. Using each card exactly once, ` +
        'build the LARGEST 3-digit number you can, and then the SMALLEST. What is your rule ' +
        'for choosing the hundreds card?',
      answer: {
        value: `largest ${largest}; smallest ${smallest}`,
        acceptableForms: [String(largest), String(smallest)],
        validation: 'short-text-keyword',
      },
      hintLadder: [
        'The hundreds seat multiplies its digit the most.',
        'Biggest number: spend the biggest card on the biggest seat. Smallest: opposite.',
      ],
      errorTags: ['concept-misconception'],
    },
    fluencySprint: {
      id: contentId('C', 1, 'FS', 1),
      skill: 'Addition within 100 (with and without regrouping)',
      sourceWeek: { level: 'B', week: 13 },
      durationSeconds: SPRINT_DURATION_SECONDS,
      itemCount: 16,
      scheduledDay: 3,
      selfReferenced: true,
      graded: false,
      generator: {
        templateId: 'add_within_100_facts_v1',
        params: { min: 11, max: 88, regroup: 'mixed' },
        seed: fs.uint(),
      },
    },
    masteryCheck: {
      passThresholdPct: MASTERY_THRESHOLD_PCT,
      fastTrackPct: FAST_TRACK_PCT,
      formA,
      formB,
      isomorphNotes:
        'Pairs by index; same template and difficulty per slot. 01: compose from ' +
        'hundreds/tens/ones. 02: expanded form to numeral. 03: value of the tens digit ' +
        '(digit-vs-value affordance preserved). 04: word form to numeral. 05: zero-tens ' +
        'trap (placeholder affordance preserved). 06: digit-value multiple choice with ' +
        'digit-itself and wrong-seat distractors. All digit triples distinct; no triple ' +
        'reused from Form A or the daily pages.',
    },
    mistakeBank: [
      {
        errorTag: 'concept-misconception',
        subtype: 'digit-vs-value',
        description:
          'Answers with the digit itself instead of its seat-multiplied value (the 7 in 472 is "7").',
        exampleWrongAnswer: 'value of 7 in 472 -> 7',
        distractorRationale: 'Offer the bare digit as a distractor on digit-value items.',
        reteachPointer: 'explanation/script[2] (the seat multiplies the digit)',
      },
      {
        errorTag: 'procedure-slip',
        subtype: 'placeholder-zero-skip',
        description: 'Drops the zero that holds an empty seat: six hundred four becomes 64.',
        exampleWrongAnswer: 'six hundred four -> 64',
        distractorRationale: 'Offer the zero-dropped numeral on zero-seat items.',
        reteachPointer: 'explanation/script[3] + guidedExamples/C1-GE-04 (a 0 holds the seat)',
      },
      {
        errorTag: 'representation-misread',
        subtype: 'wrong-seat-read',
        description: 'Reads a digit from the wrong column, or reads the value into the wrong seat.',
        exampleWrongAnswer: 'value of 9 in 792 -> 900',
        distractorRationale: 'Offer the digit multiplied by the neighboring seat.',
        reteachPointer: 'guidedExamples/C1-GE-03 (point to the seat before multiplying)',
      },
      {
        errorTag: 'fact-recall',
        subtype: 'expanded-slip',
        description: 'Adds expanded-form parts carelessly (500 + 80 + 1 = 586).',
        exampleWrongAnswer: '500 + 80 + 1 -> 586',
        distractorRationale: 'Offer near-miss sums on expanded-form items.',
        reteachPointer: '60-second expanded-form snap-together drill; feed the sprint pool',
      },
    ],
    parentSummarySeed: {
      whatWeWorkedOn:
        'Place value to 1,000 - building and reading 3-digit numbers as hundreds, tens and ' +
        'ones, telling a digit apart from its value (the 4 in 452 is worth 400), and the ' +
        'placeholder zero (six hundred four is 604, never 64).',
      improvingCandidates: [
        'naming the value of a digit from its seat, not its face',
        'writing spoken hundreds with a placeholder zero where a seat is empty',
        'stretching numbers into expanded form and snapping them back',
      ],
      strengtheningByTag: [
        {
          errorTag: 'concept-misconception',
          text: 'the digit-versus-value distinction (the 7 in 472 is worth 70) - seat-pointing stays in the warm-ups',
        },
        {
          errorTag: 'procedure-slip',
          text: 'keeping the placeholder zero when a seat is empty - one zero-seat number will keep visiting',
        },
        {
          errorTag: 'representation-misread',
          text: 'reading digits from the correct column before multiplying by the seat',
        },
      ],
      homeFocus: {
        praiseLine:
          'You caught that "six hundred four" needs a zero in the tens seat - placeholder thinking is real place-value mastery.',
        questionForChild: 'In the number 452, which digit is worth the most - and how do you know?',
        schoolSyncHook:
          'If you share how big the numbers are in your child\'s class right now, we will lean the warm-ups toward that range.',
      },
      vocabularyForParent: [
        'place value (the seat multiplies the digit)',
        'expanded form (452 = 400 + 50 + 2)',
        'placeholder zero (holds an empty seat)',
      ],
    },
  };
}
