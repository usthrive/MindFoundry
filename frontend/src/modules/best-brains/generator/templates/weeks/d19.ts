/**
 * Level D · Week 19 — "Dividing with unit fractions" (conceptId: dividing-unit-fractions).
 * Whole ÷ unit fraction; unit fraction ÷ whole via models. Day-5: story-matching
 * (pick the story that fits 4 ÷ 1/3). Retrieval: D18 fraction ×, D11 frac×whole, C12 × facts.
 */

import { asWarmup, classify, fracDivide, fracTimesFrac, fracTimesWhole, multiply, reasoning, storyFracDivide } from '../lib/items';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D11 = { level: 'D' as const, week: 11 };
const D18 = { level: 'D' as const, week: 18 };

const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wTimesFrac = asWarmup(fracTimesFrac(), D18);
const wTimesWhole = asWarmup(fracTimesWhole(), D11);

export const buildD19 = makeWeekBuilder({
  week: 19,
  conceptId: 'dividing-unit-fractions',
  conceptName: 'Dividing with unit fractions',
  strandTags: ['decimals-fractions', 'multiplication-division'],
  prerequisiteWeeks: [D11, D18],
  explanation: {
    hook: 'How many 1/3-cup scoops fill 4 cups? Twelve! Dividing by a small fraction gives a BIG answer, because you are counting how many tiny pieces fit — and lots of tiny pieces fit.',
    whyBeforeHow:
      '4 ÷ 1/3 asks "how many thirds are in 4?" Each whole holds 3 thirds, so 4 wholes hold 12 — dividing by 1/3 is the same as multiplying by 3. The reverse, 1/3 ÷ 4, splits one small piece into 4 even smaller shares, giving 1/12. Models make both directions obvious before any "flip and multiply" rule.',
    script: [
      { say: '4 ÷ 1/3: count the 1/3-pieces in 4 wholes. Each whole = 3 thirds, so 4 × 3 = 12.', visual: 'Four bars each cut into thirds; twelve pieces counted.' },
      { say: '1/3 ÷ 4: cut one third into 4 equal shares — each is 1/12 of the whole.', visual: 'One third splits into four twelfth-pieces.' },
      { say: 'So dividing by 1/3 multiplies by 3, and dividing a piece by 4 makes twelfths — the model, then the rule.', visual: 'The flip-and-multiply rule appears beside the model.' },
    ],
    summary: 'Whole ÷ unit fraction counts how many tiny pieces fit (a big answer); unit fraction ÷ whole splits a piece into smaller shares. Models first, then flip-and-multiply.',
    vocabulary: [
      { term: 'unit fraction', kidGloss: 'a fraction with 1 on top, like 1/3' },
      { term: 'how many fit', kidGloss: 'the question whole ÷ unit fraction answers' },
      { term: 'reciprocal / flip', kidGloss: 'turn a fraction upside down to divide by it' },
    ],
  },
  guidedExamples: [
    ge(19, 1, 'modeled', '5 ÷ 1/2.', [
      { teacherSay: 'How many halves in 5 wholes? Each whole has 2, so 5 × 2 = 10.', expected: '10' },
    ], '10'),
    ge(19, 2, 'prompted', '1/4 ÷ 3.', [
      { teacherSay: 'Split one quarter into 3 equal shares — what size is each?', expected: 'twelfths' },
      { childDo: 'Name the share.', expected: '1/12' },
    ], '1/12'),
    ge(19, 3, 'independent', '6 ÷ 1/3. Solve cold.', [
      { childDo: 'Count the thirds in 6 wholes.', expected: '18' },
    ], '18'),
  ],
  days: [
    [
      { gen: wMul, diff: 2 },
      { gen: fracDivide(), diff: 2 },
      { gen: fracDivide(), diff: 3 },
      { gen: fracDivide(), diff: 3 },
      { gen: fracDivide(), diff: 3 },
      { gen: fracDivide(), diff: 4 },
    ],
    [
      { gen: wTimesFrac, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracDivide(), diff: 3 },
      { gen: fracDivide(), diff: 3 },
      { gen: storyFracDivide(), diff: 4 },
      { gen: fracDivide(), diff: 4 },
    ],
    [
      { gen: wTimesWhole, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: fracDivide(), diff: 3 },
      { gen: fracDivide(), diff: 3 },
      { gen: storyFracDivide(), diff: 4 },
      { gen: fracDivide(), diff: 4 },
    ],
    [
      { gen: wMul, diff: 2 },
      { gen: storyFracDivide(), diff: 4 },
      { gen: storyFracDivide(), diff: 4 },
      { gen: storyFracDivide(), diff: 5 },
    ],
    [
      {
        gen: classify({
          prompt: 'Which story fits 4 ÷ 1/3?',
          correct: 'how many 1/3-cup scoops fill 4 cups',
          distractors: [
            { text: 'sharing 4 cups equally among 3 friends', errorTag: 'task-comprehension', rationale: 'That is 4 ÷ 3, not 4 ÷ 1/3.' },
            { text: 'one-third of 4 cups', errorTag: 'concept-misconception', rationale: 'That is 1/3 × 4, a multiply, not a divide.' },
          ],
          hints: ['Dividing by 1/3 asks how many thirds fit.', 'Match the words to "how many pieces."'],
          errorTags: ['task-comprehension', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Explain why 6 ÷ 1/2 is BIGGER than 6, using the words "how many". (Written explanation required.)',
          value: 'it counts how many halves fit in 6, and lots of small halves fit — 12',
          acceptableForms: ['how many', 'halves', '12'],
          keywords: true,
          hints: ['How many halves are in one whole?', 'Then in six wholes?'],
          errorTags: ['concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: reasoning({
          prompt: 'Draw a model for 1/4 ÷ 2 and name the resulting piece. Explain why dividing a small piece makes an even smaller one. (Show your model.)',
          value: 'split 1/4 into 2 shares → 1/8; a share of a piece is smaller',
          acceptableForms: ['1/8'],
          keywords: true,
          hints: ['Cut one quarter into 2 equal shares.', 'What size is each share of the whole?'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always/sometimes/never: dividing a whole number by a unit fraction gives an answer larger than the whole number.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'A unit fraction is always less than 1, so many fit — the answer always grows.' },
            { text: 'never', errorTag: 'task-comprehension', rationale: 'Reverses the truth; small pieces mean many fit.' },
          ],
          hints: ['A unit fraction is less than one whole.', 'Many small pieces fit into each whole.'],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 4,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D19-PZ-01',
    title: 'Puzzle Grove: Scoop Count',
    puzzleType: 'logic',
    prompt: 'A recipe uses a 1/4-cup scoop. How many scoops empty a 3-cup jar? Then: how does the answer change if the scoop is 1/8 cup instead? Explain the pattern.',
    answer: { value: '12 scoops with 1/4-cup; 24 with 1/8-cup — smaller scoop, twice as many', acceptableForms: ['12', '24'], validation: 'short-text-keyword' },
    hintLadder: ['How many 1/4-cups in one cup? In three?', 'Halving the scoop doubles the count.'],
    errorTags: ['concept-misconception', 'task-comprehension'],
  }),
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: fracDivide(), diff: 3 },
    { gen: fracDivide(), diff: 3 },
    { gen: fracDivide(), diff: 3 },
    { gen: storyFracDivide(), diff: 3 },
    { gen: fracDivide(), diff: 4 },
    { gen: fracDivide(), diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same template and difficulty per slot. 01–03/05/06: whole ÷ unit fraction OR unit fraction ÷ whole (both directions modeled). 04: how-many-scoops word problem. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'divide-shrinks', description: 'Expects dividing to always shrink, so under-counts how many pieces fit.', exampleWrongAnswer: '4 ÷ 1/3 → 1 1/3', distractorRationale: 'Offer a multiply-instead-of-count result.', reteachPointer: 'explanation/script[0] (count how many fit)' },
    { errorTag: 'task-comprehension', subtype: 'direction-swap', description: 'Confuses whole ÷ fraction with fraction ÷ whole (swaps the story).', exampleWrongAnswer: '1/3 ÷ 4 answered as 12', distractorRationale: 'Offer the other-direction answer.', reteachPointer: 'Day-5 classify (match the story)' },
    { errorTag: 'procedure-slip', subtype: 'flip-slip', description: 'Flips the wrong number, or forgets to flip when applying the rule.', exampleWrongAnswer: '5 ÷ 1/2 → 2.5', distractorRationale: 'Offer the un-flipped result.', reteachPointer: 'guidedExamples/D19-GE-01 (count, then the rule)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Dividing with unit fractions — counting how many small pieces fit into a whole (whole ÷ unit fraction gives a big answer) and splitting one piece into equal shares (unit fraction ÷ whole gives a smaller piece), with models before the flip-and-multiply rule.',
    improvingCandidates: ['counting how many unit-fraction pieces fit', 'splitting a piece into equal shares', 'matching a story to a fraction division'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'that dividing by a small fraction gives a BIG answer — the scoop-counting warm-ups build this' },
      { errorTag: 'task-comprehension', text: 'keeping whole ÷ fraction and fraction ÷ whole straight' },
      { errorTag: 'procedure-slip', text: 'flipping the right number when using the rule' },
    ],
    homeFocus: {
      praiseLine: 'You figured out that twelve 1/3-cups fill 4 cups — seeing why dividing by a small fraction gives a big answer is the heart of this week.',
      questionForChild: 'How many 1/2-cup scoops empty a 3-cup jar — and why is the answer bigger than 3?',
      schoolSyncHook: 'If your child\'s class uses measuring-cup or number-line models, tell us and we will feature them.',
    },
    vocabularyForParent: ['unit fraction (1 on top, like 1/3)', 'how many fit (whole ÷ unit fraction)', 'flip/reciprocal (to divide by a fraction)'],
  },
});
