/**
 * Level D · Week 7 — "Interpreting remainders" (conceptId: interpreting-remainders).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rebuilt on the D4 exemplar
 * shape so it clears the §6 pedagogical preflight + QG-11 and is seed-invariant.
 *
 * Authoring choices:
 *  - Multi-step (op-family ⇒ ≥2, ≥1 on Day 4): genuine 2-op DIVISION chains that
 *    end in the "share-the-leftover-as-a-fraction" interpretation —
 *    combine→share (add,div), share→add-a-piece (div,add), take-away→share
 *    (sub,div). Each answer + step-count is folded by the shipped op-chain, never
 *    typed.
 *  - Error-analysis (Day 5, generated): a "dropped the leftover on a round-up
 *    story" slip — the shown wrong value (q) and the true value (q+1) are both
 *    recomputed by the d_verify_binop_misconception_v1 verify template, so QG-11
 *    re-derives them; fabrication is impossible.
 *  - Discrimination (Days 2–3): round-up-vs-drop-vs-leftover — an interpretation
 *    CHOICE with no worked number asserted in the stem.
 *  - Situations: sharing / measurement / part-whole / rate / combine (≥3 needed).
 *  - SEED-INVARIANT hints: fixed, role-based, name-free/number-free; each core
 *    generator reused ≤2×; rung-1 is always an algorithm-free orienting question.
 *  - Distinct names drawn fresh via two(r); no hardcoded name from the draw pool.
 */

import { asWarmup, classify, divideExact, divideRemainder, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { article, countNoun } from '../lib/format';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C9 = { level: 'C' as const, week: 9 };
const C12 = { level: 'C' as const, week: 12 };
const D5 = { level: 'D' as const, week: 5 };
const D6 = { level: 'D' as const, week: 6 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** Two distinct names. */
const two = (r: { shuffle: <T>(a: readonly T[]) => T[] }) => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMulFact = asWarmup(multiply(2, 9, 2, 9), C12);
const wArea = asWarmup(multiply(11, 49, 3, 9), D5);
const wDiv = asWarmup(divideRemainder(3, 9, 20, 89), D6);
const wDivExact = asWarmup(divideExact(2, 9, 3, 9), C9);     // C9 exact division — the contrast partner to a remainder

// --- Single-step interpret-the-remainder situations (fixed, role-free hints) ----
const siRoundUp = situation({
  situationType: 'sharing', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 92);
    if (a % b === 0) a += 1;
    const q = Math.floor(a / b); const rem = a % b;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} is driving ${a} riders, with ${b} to a van. How many vans are needed so everyone gets a ride?`,
      answerValue: String(rem > 0 ? q + 1 : q), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'round-up' }, units: 'vans',
      hints: ['Does a leftover after dividing still need a whole group of its own?', 'Set out the full groups, then look at what the last leftover needs.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const siDrop = situation({
  situationType: 'measurement', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 92);
    if (a % b === 0) a += 1;
    const q = Math.floor(a / b);
    return {
      prompt: `A ${a} cm ribbon is cut into bows that each use ${b} cm. How many whole bows can be made?`,
      answerValue: String(q), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'drop' }, units: 'bows',
      hints: ['Can a leftover that is too small to fill a group still count as one?', 'Keep only the groups that are completely full.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const siRemainder = situation({
  situationType: 'part-whole', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 92);
    if (a % b === 0) a += 1;
    const rem = a % b;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} shares ${a} marbles equally among ${b} friends. How many marbles are left over?`,
      answerValue: String(rem), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'remainder' }, units: 'marbles',
      hints: ['Is the question asking for the groups, or for what is left behind?', 'Divide, then look only at the piece that did not fit.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// Metacognition base: a round-up rate problem, only ever served through the estimate wrapper.
const siRate = situation({
  situationType: 'rate', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(6, 12);
    let a = r.int(40, 130);
    if (a % b === 0) a += 1;
    const q = Math.floor(a / b); const rem = a % b;
    return {
      prompt: `A ferry carries ${b} passengers each trip. ${a} passengers are waiting. How many trips are needed to carry them all?`,
      answerValue: String(rem > 0 ? q + 1 : q), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'round-up' }, units: 'trips',
      hints: ['Does every leftover passenger still need a trip of their own?', 'Picture the full trips, then the few still waiting.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});
const siRateEstimate = withEstimateFirst(siRate, 'will the number of trips be exactly an even split, or one more than that?');

// --- Multi-step DIVISION problems (share the leftover as a fraction) ------------
// SIGNAL FADE (PEDAGOGY-CEILING-REVIEW F2). Days 1-3 name the affordance
// ("so everyone gets a ride", "whole bows", "left over"), which is right while
// the idea is new. By Day 4 and the mastery check those phrases let a child
// answer from vocabulary without performing the interpretation the week teaches,
// so the late-week twins ask the same questions NEUTRALLY. Each remains uniquely
// determined by the situation itself — a partly-filled van still has to drive,
// a part-cut bow still is not a bow — the child just has to notice that.
const siRoundUpNeutral = situation({
  situationType: 'sharing', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 92);
    if (a % b === 0) a += 1;
    const q = Math.floor(a / b); const rem = a % b;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} is driving ${a} riders, with ${b} to a van. How many vans will ${name} drive?`,
      answerValue: String(rem > 0 ? q + 1 : q), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'round-up' }, units: 'vans',
      hints: ['After the full vans are loaded, is anyone still standing on the kerb?', 'Set out the full groups, then decide what the last few riders mean.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const siDropNeutral = situation({
  situationType: 'measurement', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 92);
    if (a % b === 0) a += 1;
    const q = Math.floor(a / b);
    return {
      prompt: `A ${a} cm ribbon is cut into bows that each use ${b} cm. How many bows does it make?`,
      answerValue: String(q), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'drop' }, units: 'bows',
      hints: ['Is a piece too short to finish a bow still a bow?', 'Count only what the ribbon can actually finish.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const siRemainderNeutral = situation({
  situationType: 'part-whole', cognitiveOp: 'div-interpret',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 92);
    if (a % b === 0) a += 1;
    const rem = a % b;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} shares ${a} marbles equally among ${b} friends. How many marbles does ${name} still hold?`,
      answerValue: String(rem), templateId: 'd_interpret_rem_v1', params: { a, b, mode: 'remainder' }, units: 'marbles',
      hints: ['Which pile does the question point at — the shares, or what never left the hand?', 'Divide, then look only at the piece that did not fit.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const msCombineShare = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const p = r.int(2, 6); const w = r.int(3, 12); const num = r.int(1, p - 1);
    const total = w * p + num;
    const y = r.int(1, total - 1); const x = total - y;
    const [n1, n2] = two(r);
    return {
      prompt: `${n1} pours ${countNoun(x, 'liters')} of juice and ${n2} pours ${countNoun(y, 'liters')} into one bowl, then they share it equally among ${countNoun(p, 'cups')}. How many liters go in each cup?`,
      initN: x, steps: [{ op: 'add', n: y, d: 1 }, { op: 'div', n: p, d: 1 }], units: 'liters',
      validation: 'equivalent-fraction',
      hints: ['Which comes first — joining the two amounts, or splitting them up?', 'Join the two amounts into one, then split that total into equal shares.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msSharePlus = multiStep({
  situationType: 'measurement', cognitiveOp: 'multi-step',
  draw: (r) => {
    const p = r.int(2, 6); const w = r.int(3, 10); const num = r.int(1, p - 1);
    const total = w * p + num;
    const w2 = r.int(2, 9);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} cuts ${article(total, 'cm rope')} into ${countNoun(p, 'equal pieces')}, then tapes ${article(w2, 'cm strip')} onto one piece. How long is that piece now?`,
      initN: total, steps: [{ op: 'div', n: p, d: 1 }, { op: 'add', n: w2, d: 1 }], units: 'cm',
      validation: 'equivalent-fraction',
      hints: ['Should you split the whole into equal shares before or after adding the extra piece?', 'Share the whole into equal parts first, then join the extra piece to one share.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const msSubShare = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const p = r.int(2, 6); const w = r.int(3, 10); const num = r.int(1, p - 1);
    const total = w * p + num;
    const s = r.int(2, 12);
    const start = total + s;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} has ${countNoun(start, 'meters')} of wire, cuts off ${countNoun(s, 'meters')} for a repair, then bends the rest into ${countNoun(p, 'equal loops')}. How long is each loop?`,
      initN: start, steps: [{ op: 'sub', n: s, d: 1 }, { op: 'div', n: p, d: 1 }], units: 'm',
      validation: 'equivalent-fraction',
      hints: ['Are you sharing everything, or only what is left after some is taken away?', 'Take away the used part first, then share the rest equally.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Discrimination traps (which remainder move; name-free orienting hints) ------
const discrimWhich = discrimination({
  variant: 'structural',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 90);
    if (a % b === 0) a += 1;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} loads ${a} boxes onto carts that each hold ${b}. To move every box, what should be done with the leftover after dividing?`,
      correct: 'round up — send one more cart for the leftover boxes',
      distractors: [
        { text: 'drop the leftover — send only the full carts', errorTag: 'task-comprehension', rationale: 'The leftover boxes would be left behind with no cart.' },
        { text: 'report the leftover as the answer', errorTag: 'concept-misconception', rationale: 'The question asks for carts, not for the leftover boxes.' },
      ],
      hints: ['After dividing, does the leftover need a group of its own or not?', 'Reread the exact question before deciding what the leftover means.'],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

const discrimReport = discrimination({
  variant: 'structural',
  draw: (r) => {
    const b = r.int(3, 9);
    let a = r.int(20, 90);
    if (a % b === 0) a += 1;
    return {
      prompt: `A box holds ${b} muffins, and ${a} muffins are baked. The question asks how many muffins are left over once every box is filled. Which number should you report?`,
      correct: 'the leftover — the remainder after filling the boxes',
      distractors: [
        { text: 'the number of full boxes — the quotient', errorTag: 'concept-misconception', rationale: 'That answers "how many boxes", not "how many are left over".' },
        { text: 'the total number of muffins', errorTag: 'task-comprehension', rationale: 'The total ignores the sharing the question describes.' },
      ],
      hints: ['Is the question counting the full groups, or the piece left over?', 'Point to the exact quantity the words ask for.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth + shown wrong) ------
const eaWrongInterpret = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const c = r.int(3, 8);
    const q = r.int(4, 9);
    const extra = r.int(1, c - 1);
    const t = c * q + extra;
    // correct = q+1 (round up for the leftover), wrong = q (dropped the leftover).
    return { a: q, b: 1, op: '+', wrongOp: '*', t, c };
  },
  build: (v, p) => ({
    prompt: `A field trip has ${p.t} students, and each bus holds ${p.c}. After dividing, a student decided that ${v.wrong} buses are enough.`,
    extension: 'Explain why that leaves some students without a seat, then give the number of buses actually needed.',
    hints: ['Do the leftover students still need a seat somewhere?', 'Picture the full buses, then the few riders still standing after the last full one.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
    answerKeywords: ['round up'],
  }),
});

export const buildD07 = makeWeekBuilder({
  week: 7,
  conceptId: 'interpreting-remainders',
  conceptName: 'Interpreting remainders',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [D5, D6],
  pedagogyContract: 'v2',
  conceptualAnchor: 'fair-sharing',
  explanation: {
    hook: '"26 ÷ 4 = 6 R 2" is finished math — but the answer to the STORY might be 6, or 7, or 2, or "six and a half." The numbers are done; now the story decides what the leftover means.',
    whyBeforeHow:
      'A remainder is real, but what to DO with it depends on the question, so the fair-sharing model settles it every time: because a leftover either still needs a whole group of its own, cannot complete a group, or IS the very thing being counted, you reread the question after dividing instead of guessing. Round up when the leftover needs its own group, drop it when it cannot fill one, report it when the question asks for the leftover, and split it into a fraction when the story shares it out. Interpreting is a reading skill riding on top of the fair-sharing picture, which is why one division can honestly give four different answers.',
    script: [
      { say: 'Watch me share 26 riders into buses that hold 4. Six buses fill up and 2 riders are still standing; those 2 still need a seat, so I round UP to 7 buses.', visual: 'Six full buses; two riders board a seventh.' },
      { say: 'Same numbers, new story: 26 cm of ribbon at 4 cm per bow makes only 6 whole bows — the 2 leftover cm cannot make a bow, so I DROP them.', visual: 'Six bows tied; a 2 cm scrap set aside.' },
      { say: 'Before answering, estimate whether the leftover needs its own group, cannot fill one, or IS what is counted — that quick check tells me to round up, drop, or report the leftover. The fair-sharing picture keeps the three moves apart.', visual: 'Three labeled bins: round up, drop, report the leftover.' },
    ],
    summary: 'Do the division, then let the story interpret the leftover: round up when it needs its own group, drop it when it cannot fill one, or report the leftover itself — and sometimes share it out as a fraction.',
    vocabulary: [
      { term: 'round up', kidGloss: 'add a whole group for a leftover that still needs one' },
      { term: 'drop the remainder', kidGloss: 'ignore a leftover that cannot complete a group' },
      { term: 'remainder-as-answer', kidGloss: 'when the question asks for the leftover itself' },
    ],
  },
  guidedExamples: [
    ge(7, 1, 'modeled', 'A club has 50 members riding vans that hold 8 each. How many vans are needed?', [
      { teacherSay: 'Let me read it first: 50 riders, and each van holds 8. I will share the riders into vans and watch what is left over.' },
      { teacherSay: 'Six full vans carry 48 riders, and 2 riders are still standing — they still need a ride, so I round UP. How many vans are needed now?', expected: '7' },
    ], '7'),
    ge(7, 2, 'completion', 'A ribbon is 45 cm long, and each bow uses 8 cm. How many whole bows can be tied?', [
      { teacherSay: 'Same kind of division — but can the few leftover centimeters finish one more bow?', expected: 'no' },
      { childDo: 'Count only the bows that are completely tied.', expected: '5' },
    ], '5 bows'),
    ge(7, 3, 'prompted', '38 stickers are shared equally among 8 friends. How many stickers are left over?', [
      { childDo: 'Divide, then report only the leftover.', expected: '6' },
    ], '6'),
    ge(7, 4, 'independent', 'A packer has 30 mugs and puts 4 in each box, and every mug must be boxed. How many boxes are needed? Solve on your own.', [
      { childDo: 'Decide what the leftover mugs need, then answer.', expected: '8' },
    ], '8 boxes'),
  ],
  days: [
    // Day 1 — concept echo: single-step interpretation only, blocked
    [
      { gen: wMulFact, diff: 2 },
      { gen: wDiv, diff: 2 },
      { gen: wDivExact, diff: 2 },
      { gen: siRoundUp, diff: 2 },
      { gen: siDrop, diff: 3 },
      { gen: siRemainder, diff: 3 },
    ],
    // Day 2 — fluency + application: metacognition + discrimination + multi-step enter
    [
      { gen: wMulFact, diff: 2 },
      { gen: wDiv, diff: 2 },
      { gen: siRateEstimate, diff: 3 },
      { gen: discrimWhich, diff: 3 },
      { gen: msCombineShare, diff: 3 },
      { gen: siRemainder, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wArea, diff: 2 },
      { gen: discrimWhich, diff: 3 },
      { gen: discrimReport, diff: 4 },
      { gen: msSharePlus, diff: 3 },
      { gen: siDrop, diff: 3 },
      { gen: siRateEstimate, diff: 3 },
    ],
    // Day 4 — multi-step division word problems (3 of 4 multi-step)
    [
      { gen: msCombineShare, diff: 4 },
      { gen: msSharePlus, diff: 4 },
      { gen: msSubShare, diff: 5 },
      { gen: siRoundUpNeutral, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + classification + written reasoning
    [
      { gen: eaWrongInterpret, diff: 4 },
      {
        gen: classify({
          prompt: 'A crate holds 9 apples, and 58 apples are picked. For "how many FULL crates can be filled?", which move fits the leftover?',
          correct: 'drop the leftover — count only the crates that are completely full',
          distractors: [
            { text: 'round up — count a partly-full crate as a full one', errorTag: 'task-comprehension', rationale: 'A partly-full crate is not full, so it must not be counted.' },
            { text: 'report the leftover apples as the answer', errorTag: 'concept-misconception', rationale: 'The question asks for crates, not leftover apples.' },
          ],
          hints: ['Does a partly-filled crate count as a full one?', 'Match the leftover move to the exact words of the question.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: reasoning({
          prompt: 'Think about a batch of 45 cookies packed 6 to a box. Write one question about this batch whose answer is 7 and one whose answer is 3, then explain in writing why the SAME division gives two different answers.',
          value: '"how many FULL boxes can be packed" drops the leftover and gives 7; "how many cookies are left over" reports the remainder 3; the same 45 shared into 6s gives 7 full boxes with 3 left over, and the story decides which part to report (asking how many boxes hold ALL the cookies would round up to 8)',
          acceptableForms: [],
          hints: ['Which of your two questions counts whole boxes, and which asks for the leftover?', 'Picture the same leftover reported two different ways.'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D7-PZ-01',
    title: 'Puzzle Grove: Same Numbers, Four Answers',
    puzzleType: 'logic',
    prompt: 'Using only 34 ÷ 4, write four short stories whose correct answers are 8, 9, 2, and "eight and a half." Label the remainder move each story uses.',
    answer: { value: 'drop 8, round-up 9, remainder 2, share-the-remainder 8 1/2', acceptableForms: ['8', '9', '2', '8 1/2'], validation: 'short-text-keyword' },
    hintLadder: ['Which part of the answer changes when only the QUESTION changes?', 'Keep 34 and 4 fixed; let the story pick drop, round-up, leftover, or share.'],
    errorTags: ['task-comprehension', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: siRoundUpNeutral, diff: 3 },
    { gen: msCombineShare, diff: 3 },
    { gen: siDropNeutral, diff: 3 },
    { gen: msSharePlus, diff: 3 },
    { gen: siRemainderNeutral, diff: 4 },
    { gen: msSubShare, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step remainder interpretation (round-up / drop / leftover-as-answer — one affordance each). 02/04/06: two-step division that shares the leftover as a fraction (combine-then-share / share-then-add / take-away-then-share). No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'task-comprehension', subtype: 'wrong-interpretation', description: 'Applies the wrong remainder move — drops when the story needs an extra group, or rounds up when only complete groups count.', exampleWrongAnswer: 'buses problem answered with the plain quotient instead of one more', distractorRationale: 'Offer the drop result on a round-up story (and vice versa).', reteachPointer: 'explanation/script[0]' },
    { errorTag: 'concept-misconception', subtype: 'reports-wrong-part', description: 'Reports the quotient when the leftover is asked, or the remainder when the number of groups is asked.', exampleWrongAnswer: '"how many are left over" answered with the number of full groups', distractorRationale: 'Offer the quotient when the remainder is the answer.', reteachPointer: 'guidedExamples/D7-GE-03' },
    { errorTag: 'procedure-slip', subtype: 'division-slip', description: 'The underlying division is wrong, so every interpretation is off.', exampleWrongAnswer: 'a leftover as large as, or larger than, the divisor', distractorRationale: 'Offer a result with an oversized remainder.', reteachPointer: 'explanation/script[1]' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Interpreting remainders — doing the division, then letting the story decide whether to round up, drop the leftover, report the leftover itself, or share it out as a fraction.',
    improvingCandidates: ['matching the remainder move to the story', 'restating the exact question after dividing', 'explaining an interpretation in writing'],
    strengtheningByTag: [
      { errorTag: 'task-comprehension', text: 'choosing round-up vs drop vs remainder-as-answer — the warm-ups cycle all three' },
      { errorTag: 'concept-misconception', text: 'reporting the part the question actually asks for (groups vs leftover)' },
      { errorTag: 'procedure-slip', text: 'a clean underlying division so the interpretation stands on solid ground' },
    ],
    homeFocus: {
      praiseLine: 'You noticed that the leftover riders still need a bus of their own, and you checked the story before answering — reading the remainder\'s meaning is the whole skill.',
      questionForChild: 'For "45 cookies, 6 per box," when would the answer be 7, and when would it be 3?',
      schoolSyncHook: 'If your child\'s class uses particular remainder contexts, share them and we will feature those stories.',
    },
    vocabularyForParent: ['round up (a leftover needs its own group)', 'drop the remainder (a leftover cannot complete a group)', 'remainder-as-answer (the leftover itself)'],
  },
});
