/**
 * Level C · Week 2 — "Compare & round" (conceptId: compare-and-round).
 * CURRICULUM-MAP Level C row 2: compare to 1,000 with <, >, =; round to the
 * nearest 10/100 on the number line. Day-5 focus: "About how many?" estimation
 * reasoning page.
 *
 * Retrieval (QG-2): C·W1 (place value) + cross-level Level B sources
 * (B14 subtraction within 100, B18 skip counting).
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
  TupleGuard,
} from '../shared';

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor'] as const;

function compareChoice(rng: Rng, guard: TupleGuard, close: boolean, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      if (close) {
        // Same hundreds digit; the decision lives in the tens/ones.
        const h = r.int(1, 9);
        const t1 = r.int(0, 8);
        const a = 100 * h + 10 * t1 + r.int(0, 9);
        const b = 100 * h + 10 * r.int(t1 + 1, 9) + r.int(0, 9);
        return r.chance(0.5) ? { a, b } : { a: b, b: a };
      }
      const a = r.int(102, 987);
      let b = r.int(102, 987);
      if (b === a) b = a + r.int(1, 5);
      return { a, b };
    },
    (v) => `cmp:${[v.a, v.b].sort((x, y) => x - y).join(':')}`,
  );
  const { a, b } = draw;
  const correct = a < b ? '<' : '>';
  const wrong = a < b ? '>' : '<';
  const { choices, correctKey } = makeChoices(rng, correct, [
    {
      text: wrong,
      errorTag: 'concept-misconception',
      rationale: 'Compares a later seat (tens or ones) first instead of starting at the biggest seat.',
    },
    {
      text: '=',
      errorTag: 'representation-misread',
      rationale: 'Sees shared digits and calls the numbers equal without checking the seats.',
    },
  ]);
  return {
    type: 'computation',
    prompt: `Compare: ${a} ▢ ${b}. Circle the symbol that belongs in the box.`,
    choices,
    answer: { value: correctKey, acceptableForms: [correct], validation: 'choice-key' },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'compare_symbol_choice_v1', params: { a, b }, seed: rng.uint() },
    hintLadder: [
      'Start at the biggest seat - the hundreds - and compare seat by seat.',
      'The open mouth of the symbol always eats the bigger number.',
    ],
    errorTags: ['concept-misconception', 'representation-misread'],
  };
}

function orderThree(rng: Rng, guard: TupleGuard, tricky: boolean, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      if (tricky) {
        // Permutations of the same digits — seats decide, not digit faces.
        const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
        const [x, y, z] = digits;
        const nums = [
          100 * x + 10 * y + z,
          100 * y + 10 * z + x,
          100 * z + 10 * x + y,
        ];
        return { nums: r.shuffle(nums) };
      }
      const base = r.int(1, 8) * 100;
      const nums = [base + r.int(1, 60), base + r.int(61, 99), base + 100 + r.int(0, 80)];
      return { nums: r.shuffle(nums) };
    },
    (v) => `order:${v.nums.slice().sort((x, y) => x - y).join(',')}`,
  );
  const { nums } = draw;
  const sorted = nums.slice().sort((x, y) => x - y);
  return {
    type: 'computation',
    prompt: `Write these numbers from least to greatest: ${nums.join(', ')}`,
    answer: {
      value: sorted.join(', '),
      acceptableForms: [sorted.join(' ')],
      validation: 'ordered-list',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'order_three_v1',
      params: { a: nums[0], b: nums[1], c: nums[2] },
      seed: rng.uint(),
    },
    hintLadder: [
      'Compare hundreds seats first; only tie-breaks move to the tens.',
      'Find the smallest first, set it aside, then compare the rest.',
    ],
    errorTags: ['concept-misconception'],
  };
}

function roundTen(rng: Rng, guard: TupleGuard, trap: boolean, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => {
      const base = r.int(11, 98) * 10;
      if (trap) return base + 5;
      const ones = r.pick([1, 2, 3, 4, 6, 7, 8, 9] as const) as number;
      return base + ones;
    },
    (v) => `rten:${v}`,
  );
  return {
    type: 'computation',
    prompt: `Round ${n} to the nearest ten.`,
    answer: {
      value: String(Math.round(n / 10) * 10),
      acceptableForms: [],
      validation: 'exact-numeric',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'round_ten_v1', params: { n }, seed: rng.uint() },
    hintLadder: trap
      ? ['Find the two nearest tens - the number sits exactly in the middle.', 'Exactly-in-the-middle rounds UP. That is the agreed rule.']
      : ['Find the two nearest tens on the number line.', 'Which of the two is a shorter walk away?'],
    errorTags: ['procedure-slip'],
  };
}

function roundHundred(rng: Rng, guard: TupleGuard, trap: boolean, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => {
      const h = r.int(1, 8);
      if (trap) return 100 * h + 50;
      const rest = r.pick([12, 23, 34, 41, 63, 68, 77, 82, 89, 96] as const) as number;
      return 100 * h + rest;
    },
    (v) => `rhun:${v}`,
  );
  return {
    type: 'computation',
    prompt: `Round ${n} to the nearest hundred.`,
    answer: {
      value: String(Math.round(n / 100) * 100),
      acceptableForms: [],
      validation: 'exact-numeric',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'round_hundred_v1', params: { n }, seed: rng.uint() },
    hintLadder: trap
      ? ['The number sits exactly halfway between two hundreds.', 'Exactly-in-the-middle rounds UP.']
      : ['Find the two nearest hundreds.', 'The tens digit tells you which hundred is closer.'],
    errorTags: ['procedure-slip', 'task-comprehension'],
  };
}

// --- Day-4 stories ----------------------------------------------------------

function compareStory(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const h = r.int(2, 8);
      const a = 100 * h + r.int(10, 49);
      const b = 100 * h + r.int(50, 99);
      return r.chance(0.5) ? { a, b } : { a: b, b: a };
    },
    (v) => `cmpstory:${v.a}:${v.b}`,
  );
  const { a, b } = draw;
  return {
    type: 'word-problem',
    prompt:
      `Two schools collected cans for recycling: Oak School collected ${a} cans and Pine ` +
      'School collected ' +
      `${b}. How many cans did the WINNING school collect?`,
    answer: {
      value: String(Math.max(a, b)),
      acceptableForms: [`${Math.max(a, b)} cans`],
      validation: 'exact-numeric',
      units: 'cans',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: {
      templateId: 'compare_symbol_choice_v1',
      params: { a, b },
      seed: rng.uint(),
    },
    hintLadder: [
      'Same hundreds - so the tens seat decides.',
      'The question asks for the winner\'s COUNT, not the winner\'s name.',
    ],
    errorTags: ['concept-misconception', 'task-comprehension'],
  };
}

function newspaperStory(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const n = drawFresh(
    rng,
    guard,
    (r) => 100 * r.int(2, 8) + r.pick([17, 26, 38, 44, 61, 73, 85, 92] as const),
    (v) => `paper:${v}`,
  );
  return {
    type: 'word-problem',
    prompt:
      `A stadium gate counted ${n} fans. The newspaper prints attendance to the nearest ` +
      'hundred. What number does the paper print?',
    answer: {
      value: String(Math.round(n / 100) * 100),
      acceptableForms: [`about ${Math.round(n / 100) * 100}`],
      validation: 'exact-numeric',
      units: 'fans',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: false,
    generator: { templateId: 'round_hundred_v1', params: { n }, seed: rng.uint() },
    hintLadder: ['Nearest hundred - let the tens digit decide.'],
    errorTags: ['task-comprehension', 'procedure-slip'],
  };
}

// --- Day-5 estimation reasoning ("About how many?") -------------------------

function jarYesNo(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const h = r.int(2, 8);
      const yes = r.chance(0.5);
      let k = r.int(0, 99);
      if (k === 50) k = 51; // avoid n === h·100 exactly (degenerate surface)
      const n = yes
        ? 100 * h - 50 + k // rounds to h00
        : 100 * h + 60 + r.int(0, 30); // rounds elsewhere
      return { h, n, yes };
    },
    (v) => `jar:${v.n}`,
  );
  const { h, n, yes } = draw;
  return {
    type: 'reasoning',
    prompt:
      `A jar label says "about ${h * 100} marbles" (rounded to the nearest hundred). ` +
      `Could the jar really hold ${n} marbles? Answer yes or no, and say why.`,
    answer: {
      value: yes ? 'yes' : 'no',
      acceptableForms: yes ? ['yes'] : ['no'],
      validation: 'short-text-keyword',
    },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'round_hundred_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      `Round ${n} to the nearest hundred yourself.`,
      'Does your rounded number match the label?',
    ],
    errorTags: ['concept-misconception', 'task-comprehension'],
  };
}

function roundErrorAnalysis(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const base = r.int(12, 88) * 10;
      const ones = r.pick([6, 7, 8, 9] as const) as number;
      return { n: base + ones, name: r.pick(NAMES) };
    },
    (v) => `rerr:${v.n}`,
  );
  const { n, name } = draw;
  const wrong = Math.floor(n / 10) * 10;
  const right = Math.round(n / 10) * 10;
  return {
    type: 'error-analysis',
    prompt:
      `${name} rounded ${n} to the nearest ten and wrote ${wrong}. What went wrong? ` +
      'Give the correct answer and the reason.',
    answer: {
      value: `${right}; the ones digit is 5 or more, so it rounds UP, not down`,
      acceptableForms: [String(right), 'up'],
      validation: 'short-text-keyword',
    },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'round_ten_v1', params: { n }, seed: rng.uint() },
    hintLadder: [
      `Which two tens is ${n} between?`,
      'Which of the two is the shorter walk? Count the steps.',
    ],
    errorTags: ['procedure-slip'],
  };
}

function nameANumber(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const h = drawFresh(rng, guard, (r) => r.int(2, 9), (v) => `namenum:${v}`);
  const target = h * 100;
  return {
    type: 'reasoning',
    prompt:
      `Name a number that rounds to ${target} (nearest hundred) but is SMALLER than ` +
      `${target}. How many such numbers are there?`,
    answer: {
      value: `any number from ${target - 50} to ${target - 1}; there are 50 of them`,
      acceptableForms: [],
      validation: 'manual-review',
    },
    difficulty,
    strand: 'noncomputational',
    isRetrieval: false,
    generator: { templateId: 'round_hundred_v1', params: { n: target - 25 }, seed: rng.uint() },
    hintLadder: [
      `Which numbers below ${target} still have ${target} as their nearest hundred?`,
      'Walk down from the target - where does "nearest" flip to the lower hundred?',
    ],
    errorTags: ['concept-misconception'],
  };
}

// --- Retrieval warm-ups -----------------------------------------------------

function retrDigitValue(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
      const place = r.chance(0.5) ? 100 : 10;
      return { h: digits[0], t: digits[1], o: digits[2], place };
    },
    (v) => `rdv:${v.h}${v.t}${v.o}`,
  );
  const { h, t, o, place } = draw;
  const n = 100 * h + 10 * t + o;
  const digit = place === 100 ? h : t;
  return {
    type: 'computation',
    prompt: `Warm-up! What is the value of the digit ${digit} in ${n}?`,
    answer: { value: String(digit * place), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'C', week: 1 },
    generator: { templateId: 'retr_digit_value_v1', params: { n, digit, place }, seed: rng.uint() },
    hintLadder: ['Find its seat first - the seat multiplies the digit.'],
    errorTags: ['concept-misconception'],
  };
}

function retrCompose3(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const digits = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
      return { h: digits[0], t: digits[1], o: digits[2] };
    },
    (v) => `rcomp:${v.h}${v.t}${v.o}`,
  );
  const { h, t, o } = draw;
  return {
    type: 'computation',
    prompt: `Warm-up! ${h} hundreds, ${t} tens, and ${o} ones make what number?`,
    answer: { value: String(100 * h + 10 * t + o), acceptableForms: [], validation: 'exact-numeric' },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'C', week: 1 },
    generator: { templateId: 'compose_3digit_v1', params: { h, t, o }, seed: rng.uint() },
    hintLadder: ['Seat each digit: hundreds, tens, ones.'],
    errorTags: ['fact-recall'],
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
    (v) => `rsub:${v.a}:${v.b}`,
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
      const start = k * r.int(4, 9);
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

function retrWordSub(rng: Rng, guard: TupleGuard, difficulty: number): ItemDraft {
  const draw = drawFresh(
    rng,
    guard,
    (r) => {
      const a = r.int(52, 94);
      const bOnes = Math.min(9, (a % 10) + r.int(1, 3));
      const bTens = r.int(1, Math.floor(a / 10) - 2);
      return { a, b: 10 * bTens + bOnes, name: r.pick(NAMES) };
    },
    (v) => `rwsub:${v.a}:${v.b}`,
  );
  const { a, b, name } = draw;
  return {
    type: 'word-problem',
    prompt:
      `Warm-up! ${name}'s class had ${a} craft sticks. ${b} were used for a project. ` +
      'How many craft sticks are left?',
    answer: {
      value: String(a - b),
      acceptableForms: [`${a - b} sticks`],
      validation: 'exact-numeric',
      units: 'craft sticks',
    },
    difficulty,
    strand: 'computational',
    isRetrieval: true,
    retrievalSource: { level: 'B', week: 14 },
    generator: { templateId: 'retr_word_sub_v1', params: { a, b }, seed: rng.uint() },
    hintLadder: ['Sticks are leaving - which operation?'],
    errorTags: ['task-comprehension'],
  };
}

export function buildC02(packSeed: number, contentVersion: string): WeeklyConceptPack {
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
    makeDay('C', 2, 1, 'concept-echo', 3, [
      retrDigitValue(d1, guard, 2),
      retrSkip(d1, guard, 2),
      compareChoice(d1, guard, false, 2),
      roundTen(d1, guard, false, 2),
      compareChoice(d1, guard, true, 3),
      orderThree(d1, guard, false, 3),
    ]),
    makeDay('C', 2, 2, 'fluency-application', 2, [
      retrSub100(d2, guard, 3),
      roundTen(d2, guard, false, 2),
      roundHundred(d2, guard, false, 3),
      compareChoice(d2, guard, true, 3),
      orderThree(d2, guard, true, 4),
      roundTen(d2, guard, true, 4),
    ]),
    makeDay('C', 2, 3, 'fluency-application', 2, [
      retrCompose3(d3, guard, 2),
      compareChoice(d3, guard, false, 2),
      roundHundred(d3, guard, false, 3),
      orderThree(d3, guard, true, 3),
      roundHundred(d3, guard, true, 4),
      roundTen(d3, guard, true, 4),
    ]),
    makeDay('C', 2, 4, 'word-problems', 2, [
      compareStory(d4, guard, 3),
      newspaperStory(d4, guard, 3),
      retrWordSub(d4, guard, 3),
      newspaperStory(d4, guard, 4),
    ]),
    makeDay('C', 2, 5, 'noncomputational', 2, [
      jarYesNo(d5, guard, 3),
      roundErrorAnalysis(d5, guard, 4),
      nameANumber(d5, guard, 4),
      retrDigitValue(d5, guard, 2),
    ]),
  ];

  const pzDraw = drawFresh(
    pz,
    guard,
    (r) => {
      const lo = 100 * r.int(2, 8) - 10;
      const hi = lo + 30;
      const inside = lo + r.int(5, 25);
      const below = lo - r.int(8, 60);
      const above = hi + r.int(8, 60);
      return { lo, hi, guesses: r.shuffle([inside, below, above]), inside };
    },
    (v) => `pzjar:${v.inside}`,
  );

  const formA = makeMasteryItems('C', 2, 'MA', [
    compareChoice(ma, guard, false, 2),
    roundTen(ma, guard, false, 3),
    roundHundred(ma, guard, false, 3),
    orderThree(ma, guard, true, 3),
    roundTen(ma, guard, true, 4),
    compareChoice(ma, guard, true, 3),
  ]);
  const formB = makeMasteryItems('C', 2, 'MB', [
    compareChoice(mb, guard, false, 2),
    roundTen(mb, guard, false, 3),
    roundHundred(mb, guard, false, 3),
    orderThree(mb, guard, true, 3),
    roundTen(mb, guard, true, 4),
    compareChoice(mb, guard, true, 3),
  ]);

  return {
    schemaVersion: '1.0',
    packId: 'MFM-C2',
    contentVersion,
    identity: {
      level: 'C',
      week: 2,
      conceptId: 'compare-and-round',
      conceptName: 'Compare & round',
      band: 'intermediate',
      strandTags: ['number-sense-counting'],
      prerequisiteWeeks: [
        { level: 'C', week: 1 },
        { level: 'B', week: 3 },
        { level: 'B', week: 18 },
      ],
    },
    presentation: {
      audioFirst: false,
      oneOperationPerPage: false,
      scaffoldNotes:
        'Open number line printed under rounding items on Days 1-2; comparison items show ' +
        'seat-by-seat column guides on Day 1 only.',
    },
    explanation: {
      hook:
        'Two collectors brag: "I have 546 cards!" - "I have 552!" Who really has more? ' +
        'And when the newspaper says "about 500 fans" - where did the real number go?',
      whyBeforeHow:
        'Comparing and rounding are both SEAT games. To compare, start at the biggest seat: ' +
        'whoever wins the hundreds wins the number - later seats only break ties. To round, ' +
        'find the two nearest landmarks and take the shorter walk. The why: big seats carry ' +
        'almost all of a number\'s size, so smart readers look there first.',
      script: [
        {
          say: 'Compare 546 and 552. Hundreds: 5 and 5 - tie! Move right. Tens: 4 against 5. Done: 552 is bigger. The ones never even voted.',
          visual: 'Seat-by-seat columns; hundreds tie grays out, tens column flashes the win.',
        },
        {
          say: 'The symbol has an open mouth - and it always eats the bigger number: 546 < 552.',
          visual: 'The < symbol animates, mouth opening toward 552.',
        },
        {
          say: 'Now rounding. 673 lives between the landmarks 670 and 680 on the number line. It is 3 steps from 670, 7 steps from 680 - so "about 670".',
          visual: 'Number line 670-680; hops counted from 673 both ways.',
        },
        {
          say: 'The halfway case: 675 is 5 steps from BOTH. Mathematicians agreed: exactly-in-the-middle rounds UP. 675 becomes 680.',
          visual: 'Balanced hops both directions; the up-arrow rule stamps 680.',
        },
        {
          say: 'Rounding to the nearest hundred is the same walk with bigger landmarks: 673 sits between 600 and 700, and the tens digit - 7 - says 700 is closer.',
          visual: 'Zoomed-out line 600-700; 673 marker; tens digit highlighted.',
        },
      ],
      summary:
        'Compare seat by seat from the left; the open mouth eats the bigger number. Round ' +
        'by walking to the nearer landmark; exactly-in-the-middle rounds up.',
      vocabulary: [
        { term: 'compare', kidGloss: 'decide which number is bigger' },
        { term: 'greater than / less than', kidGloss: 'what the open-mouth symbols say' },
        { term: 'round', kidGloss: 'swap a number for the nearest friendly landmark' },
        { term: 'about', kidGloss: 'the word that signals a rounded number' },
      ],
    },
    guidedExamples: [
      {
        id: contentId('C', 2, 'GE', 1),
        fadeLevel: 'modeled',
        prompt: 'Compare 734 and 738.',
        steps: [
          {
            teacherSay:
              'Hundreds: 7 and 7, tie. Tens: 3 and 3, tie again! Ones: 4 against 8 - finally a vote. 734 < 738.',
            expected: '734 < 738',
          },
        ],
        answer: '734 < 738',
      },
      {
        id: contentId('C', 2, 'GE', 2),
        fadeLevel: 'completion',
        prompt: 'Compare 465 and 456.',
        steps: [
          { teacherSay: 'Hundreds tie at 4. Which seat votes next?' },
          { childDo: 'Compare that seat and write the symbol.', expected: '465 > 456' },
        ],
        answer: '465 > 456',
      },
      {
        id: contentId('C', 2, 'GE', 3),
        fadeLevel: 'prompted',
        prompt: 'Round 267 to the nearest ten.',
        steps: [
          { teacherSay: 'Which two tens is 267 between?', expected: '260 and 270' },
          { childDo: 'Take the shorter walk.', expected: '270' },
        ],
        answer: '270',
      },
      {
        id: contentId('C', 2, 'GE', 4),
        fadeLevel: 'independent',
        prompt: 'Round 450 to the nearest hundred. Solve cold - careful, it is a special case.',
        steps: [{ childDo: 'Apply the halfway rule.', expected: '500' }],
        answer: '500',
      },
    ],
    days,
    puzzle: {
      id: contentId('C', 2, 'PZ', 1),
      title: 'Puzzle Grove: The Jar Label',
      puzzleType: 'estimation',
      prompt:
        `Three friends guess how many beads are in a jar: ${pzDraw.guesses.join(', ')}. ` +
        `The label says "between ${pzDraw.lo} and ${pzDraw.hi} beads." Whose guess could ` +
        'be right? Prove the other two cannot.',
      answer: { value: String(pzDraw.inside), acceptableForms: [], validation: 'exact-numeric' },
      hintLadder: [
        'Check each guess against BOTH ends of the label.',
        'A good proof says: "too small, because..." or "too big, because..."',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    },
    fluencySprint: {
      id: contentId('C', 2, 'FS', 1),
      skill: 'Subtraction within 100 (with and without regrouping)',
      sourceWeek: { level: 'B', week: 14 },
      durationSeconds: SPRINT_DURATION_SECONDS,
      itemCount: 16,
      scheduledDay: 3,
      selfReferenced: true,
      graded: false,
      generator: {
        templateId: 'sub_within_100_facts_v1',
        params: { min: 21, max: 95, regroup: 'mixed' },
        seed: fs.uint(),
      },
    },
    masteryCheck: {
      passThresholdPct: MASTERY_THRESHOLD_PCT,
      fastTrackPct: FAST_TRACK_PCT,
      formA,
      formB,
      isomorphNotes:
        'Pairs by index; same template and difficulty per slot. 01: compare, far apart. ' +
        '02: round to nearest ten, no trap. 03: round to nearest hundred, no trap. 04: ' +
        'order three permuted-digit numbers (seat-vs-face affordance preserved). 05: ' +
        'round-to-ten halfway trap (ends in 5). 06: compare, same hundreds (tens decide). ' +
        'No operand pair or triple reused from Form A or the daily pages.',
    },
    mistakeBank: [
      {
        errorTag: 'concept-misconception',
        subtype: 'wrong-seat-first',
        description:
          'Compares ones (or the biggest digit anywhere) instead of starting at the biggest seat: thinks 546 > 552 because 6 > 2.',
        exampleWrongAnswer: '546 > 552',
        distractorRationale: 'Offer the flipped symbol on same-hundreds comparisons.',
        reteachPointer: 'explanation/script[0] (seat-by-seat, left first)',
      },
      {
        errorTag: 'procedure-slip',
        subtype: 'halfway-rounds-down',
        description: 'Rounds the exactly-halfway case down (675 to 670), or always rounds down.',
        exampleWrongAnswer: '675 -> 670',
        distractorRationale: 'Offer the rounded-down landmark on items ending in 5.',
        reteachPointer: 'explanation/script[3] (the agreed up-rule) + guidedExamples/C2-GE-04',
      },
      {
        errorTag: 'task-comprehension',
        subtype: 'wrong-landmark-size',
        description: 'Rounds to the nearest ten when the question asks for the nearest hundred (or vice versa).',
        exampleWrongAnswer: '673 to the nearest hundred -> 670',
        distractorRationale: 'Offer the correctly-rounded WRONG place as a distractor.',
        reteachPointer: 'explanation/script[4] (read the landmark size first)',
      },
      {
        errorTag: 'representation-misread',
        subtype: 'symbol-direction',
        description: 'Knows which number is bigger but writes the symbol facing the wrong way.',
        exampleWrongAnswer: '546 > 552 (meant less-than)',
        distractorRationale: 'Offer the reversed symbol as a distractor.',
        reteachPointer: 'explanation/script[1] (the mouth eats the bigger number)',
      },
    ],
    parentSummarySeed: {
      whatWeWorkedOn:
        'Comparing numbers to 1,000 seat by seat with <, > and =, and rounding to the ' +
        'nearest ten or hundred by walking to the closer landmark - including the ' +
        'exactly-halfway rule (it rounds up).',
      improvingCandidates: [
        'starting every comparison at the hundreds seat instead of the biggest digit',
        'rounding by counting the walk to each landmark',
        'handling the halfway case (ends in 5 or 50) with the round-up rule',
      ],
      strengtheningByTag: [
        {
          errorTag: 'concept-misconception',
          text: 'letting the LEFT seat vote first when comparing (552 beats 546 even though 6 beats 2) - seat-race items stay in the warm-ups',
        },
        {
          errorTag: 'procedure-slip',
          text: 'the halfway rule - exactly-in-the-middle rounds UP - one trap case will keep visiting',
        },
        {
          errorTag: 'task-comprehension',
          text: 'checking WHICH landmark the question wants (nearest ten or nearest hundred) before rounding',
        },
      ],
      homeFocus: {
        praiseLine:
          'You compared seat by seat and never fell for the big ones digit - that is disciplined number reading.',
        questionForChild: 'The sign says "about 400 people". What is the smallest real count that could be - and the biggest?',
      },
      vocabularyForParent: [
        'seat-by-seat comparison (hundreds first)',
        'landmark (the friendly ten or hundred nearby)',
        'halfway rule (exactly in the middle rounds up)',
      ],
    },
  };
}
