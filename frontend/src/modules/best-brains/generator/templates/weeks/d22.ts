/**
 * Level D · Week 22 — "Coordinate plane (Q1) & patterns"
 * (conceptId: coordinate-plane-q1-patterns).
 *
 * v2 PEDAGOGY BLUEPRINT (CONTENT-GENERATOR-FIX-SPEC). Rewritten on the proven D4
 * shape: module-scope generators with FIXED role-based, name-free / number-free
 * hints (seed-invariant dedup), each generator reused ≤2× in the daily core.
 *
 * Concept family = PLACE-VALUE (per lib/pedagogy PLACE_VALUE_FAMILY), so §6.1
 * asks for ≥1 week-wide multi-step composed with a prior-week op (usesPriorSkill).
 * The raw patternTerm()/plotChoice() library items cannot be used in v2 core —
 * their rung-1 hints ("The 1st number is the start…") are not orienting questions
 * and the §6.5 linter throws — so every pattern/coordinate core item here is a
 * situation()/multiStep()/discrimination() with an author-written orienting rung.
 *
 * Authoring choices (§6 gates):
 *  - Multi-step (PV, ≥1, prior-op): "grow the step across all steps THEN add the
 *    start" (mul→add) and a 3-op level-up chain (mul→add→add) — answer + step-count
 *    from the shipped rational op-chain; usesPriorSkill (× from C12, + from D2).
 *  - Error-analysis: the repeated-growth "add instead of multiply" slip, whose
 *    shown wrong value + true answer are re-derived by d_verify_binop_misconception_v1
 *    (a {correct, wrong} verify) — fabrication impossible; the x/y-swap is carried
 *    by the discrimination trap + a Day-5 classify instead (no numeric "wrong").
 *  - Discrimination: (x, y) vs (y, x) — an ordered-pair ORDER trap forcing a choice.
 *  - Situations: pattern growth (rate-of-change), grid/robot move (measurement),
 *    treasure-map legs (combine), staircase/level-up (multi-stage) — ≥3 distinct.
 *  - Metacognition: estimate-first on a growth term, woven into Days 2–3 core AND
 *    modeled in the explanation script.
 */

import { addWhole, asWarmup, classify, evalExpr, multiply, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C12 = { level: 'C' as const, week: 12 };
const D2 = { level: 'D' as const, week: 2 };
const D21 = { level: 'D' as const, week: 21 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
const wMul = asWarmup(multiply(2, 9, 2, 9), C12);
const wAdd = asWarmup(addWhole(1200, 88000), D2);
const wEval = asWarmup(evalExpr(false), D21);

// --- Single-step PATTERN-GROWTH situations (fixed, role-based, name-free hints) --
const gGrow = situation({
  situationType: 'rate-of-change', cognitiveOp: 'pattern-term',
  draw: (r) => {
    const start = r.int(2, 15); const step = r.int(2, 9); const k = r.int(4, 8);
    return {
      prompt: `A seedling is ${start} cm tall and grows ${step} cm each week. Counting the first measurement as week 1, how tall is it in week ${k}?`,
      answerValue: String(start + step * (k - 1)), templateId: 'd_pattern_term_v1', params: { start, step, k }, units: 'cm',
      hints: ['Which term already counts as the start, before any step is added?', 'Add the weekly step onto the start one time fewer than the week number you want.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

const gStack = situation({
  situationType: 'rate-of-change', cognitiveOp: 'pattern-term',
  draw: (r) => {
    const start = r.int(3, 12); const step = r.int(2, 7); const k = r.int(4, 8);
    return {
      prompt: `A tower pattern begins with ${start} blocks, and each new tower adds ${step} more blocks than the one before. How many blocks are in the ${k}th tower?`,
      answerValue: String(start + step * (k - 1)), templateId: 'd_pattern_term_v1', params: { start, step, k }, units: 'blocks',
      hints: ['Before adding anything, which tower is the starting one?', 'Stack the extra blocks onto the start, one tower fewer than the tower you want.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// Metacog base: a growth term, only ever served through the estimate-first wrapper.
const gTemp = situation({
  situationType: 'rate-of-change', cognitiveOp: 'pattern-term',
  draw: (r) => {
    const start = r.int(5, 18); const step = r.int(2, 9); const k = r.int(4, 8);
    return {
      prompt: `The temperature at dawn reads ${start} degrees and climbs ${step} degrees every hour after dawn. Counting dawn as the first reading, what is the reading at the ${k}th hour?`,
      answerValue: String(start + step * (k - 1)), templateId: 'd_pattern_term_v1', params: { start, step, k }, units: 'degrees',
      hints: ['Picture the equal jumps from the start — do they pile up fast, or barely move?', 'Count the jumps as one fewer than the hour, then add them onto the start.'],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});
const gMeta = withEstimateFirst(gTemp, 'a pattern that climbs by the same amount every step should land far above where it began — never close to the start, since the equal jumps keep piling up.');

// --- Single-step COORDINATE situations (grid moves; x before y) -----------------
const gRobot = situation({
  situationType: 'measurement', cognitiveOp: 'pattern-term',
  draw: (r) => {
    const start = r.int(1, 9); const step = r.int(2, 8); const k = r.int(4, 9);
    return {
      prompt: `A robot starts on a grid at x = ${start} and rolls ${step} units right at each turn. Counting its starting spot as the 1st mark, what is its x-coordinate at the ${k}th mark?`,
      answerValue: String(start + step * (k - 1)), templateId: 'd_pattern_term_v1', params: { start, step, k },
      hints: ['Does the starting spot count as the first grid mark, or the zero-th?', 'From the start, add the right-move once for every mark after the first.'],
      errorTags: ['procedure-slip', 'representation-misread'],
    };
  },
});

const gMap = situation({
  situationType: 'combine', cognitiveOp: 'add',
  draw: (r) => {
    const a = r.int(3, 20); const b = r.int(2, 15); const name = r.pick(NAMES);
    return {
      prompt: `On ${name}'s treasure map you begin at the origin, step ${a} units right to a palm tree, then ${b} more units right to the chest. What is the chest's x-coordinate?`,
      answerValue: String(a + b), templateId: 'd_add_v1', params: { a, b },
      hints: ['Does stepping right a second time change the across-number, or the up-number?', 'Combine both right-steps into a single across-distance from the origin.'],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// --- Multi-step (PV family: ≥1 week-wide, composed with a prior-week op) ---------
const msReach = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const step = r.int(2, 9); const m = r.int(3, 7); const start = r.int(2, 12);
    return {
      prompt: `A staircase of dots rises ${step} units at every step. Climbing ${m} steps up from a starting height of ${start}, what height does the top dot reach?`,
      initN: step, steps: [{ op: 'mul', n: m, d: 1 }, { op: 'add', n: start, d: 1 }], units: 'units',
      hints: ['Is the total climb one step, or the step repeated for every stair?', 'Find the whole climb first by copying the step for each stair, then add the start.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const msLevelUp = multiStep({
  situationType: 'multi-stage', cognitiveOp: 'multi-step', usesPriorSkill: true,
  draw: (r) => {
    const step = r.int(2, 8); const m = r.int(3, 6); const start = r.int(3, 12); const bonus = r.int(2, 9);
    return {
      prompt: `A game gives ${step} points for each of the ${m} rooms you clear, then a one-time bonus of ${bonus} points on top of a starting score of ${start}. What is the final score?`,
      initN: step, steps: [{ op: 'mul', n: m, d: 1 }, { op: 'add', n: start, d: 1 }, { op: 'add', n: bonus, d: 1 }], units: 'points',
      hints: ['Which part of the plan repeats every room, and which happens only once?', 'Grow the per-room points across all the rooms first, then add the start and the one-time bonus.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// --- Discrimination trap: (x, y) vs (y, x) ordered-pair ORDER --------------------
const discXY = discrimination({
  variant: 'structural', cognitiveOp: 'plot-order',
  draw: (r) => {
    const x = r.int(1, 9); let y = r.int(1, 9); if (y === x) y = x === 9 ? 8 : x + 1;
    return {
      prompt: `A point sits ${x} units right and ${y} units up from the origin (0, 0). Which ordered pair names it?`,
      correct: `(${x}, ${y})`, correctForms: ['across then up'],
      distractors: [
        { text: `(${y}, ${x})`, errorTag: 'representation-misread', rationale: 'Writes up before across — swaps the two coordinates.' },
        { text: `(${x}, 0)`, errorTag: 'task-comprehension', rationale: 'Drops the up-move, staying on the across-axis.' },
      ],
      hints: ['Which number of an ordered pair tells you the across-move — the first or the second?', 'Right before up: the first coordinate is the across-step, the second is the up-step.'],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives the truth) ---------------
const eaGrowth = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(3, 9), b: r.int(3, 7), op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `A pattern grows by ${p.a} at every step. Asked for the TOTAL growth after ${p.b} steps, a student wrote ${v.wrong}.`,
    extension: 'Sketch the equal jumps stacked end to end to show why the total growth is a multiply, then write the correct total growth.',
    hints: ['Does repeating the same growth over many steps add the two numbers, or copy the growth that many times?', 'Draw the equal jumps in a row and count what they really make together.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
});

export const buildD22 = makeWeekBuilder({
  week: 22,
  conceptId: 'coordinate-plane-q1-patterns',
  conceptName: 'Coordinate plane (Q1) & patterns',
  strandTags: ['algebra-geometry'],
  prerequisiteWeeks: [D2, D21],
  pedagogyContract: 'v2',
  conceptualAnchor: 'coordinate grid',
  explanation: {
    hook: 'An ordered pair like (3, 4) is a treasure-map instruction: go 3 right, then 4 up. Get the order wrong and you dig in the wrong spot. A number pattern is the same idea in a table — a rule that predicts what comes next without counting them all out.',
    whyBeforeHow:
      'Every point on a coordinate grid is named by how far RIGHT (x) and how far UP (y) it sits from the origin (0, 0), so the order is x-before-y for a reason: the first number is the across-move because that is the direction we count from the origin first. A number pattern is honest in the same way — it has a starting value and one fixed step, so its rule, start + step × (n − 1), can predict any term without listing them all, since every term is just the start plus that many equal jumps. Plotting the terms turns the rule into a straight staircase on the grid, which is why the picture and the rule always tell the same story.',
    script: [
      { say: '(3, 4): from the origin, count 3 to the right first, then 4 up. The first number is always the across-move.', visual: 'A dot walks 3 right, then 4 up on a grid.' },
      { say: 'A pattern that starts at 2 and adds 5 goes 2, 7, 12, 17 — the 1st term is the start, and each later term adds one more 5.', visual: 'A table fills as a staircase of dots climbs the grid.' },
      { say: 'Before listing every term, estimate: the 6th term is about six equal jumps above the start, so a sensible answer sits far past the start — the rule then pins it exactly, and you can check the two agree.', visual: 'The rule jumps straight to the 6th term; a benchmark bar shows it far above the start.' },
    ],
    summary: 'Plot a point as (right, up) from the origin — x before y. A pattern\'s nth term is start + step × (n − 1); use the rule to predict any term, then estimate to check it is sensible.',
    vocabulary: [
      { term: 'ordered pair', kidGloss: '(across, up) — x before y' },
      { term: 'origin', kidGloss: 'the corner (0, 0) where the axes meet' },
      { term: 'term', kidGloss: 'one number in a pattern (1st, 2nd, ...)' },
    ],
  },
  guidedExamples: [
    ge(22, 1, 'modeled', 'A pattern starts at 3 and grows by 4 each step. What is the 5th term?', [
      { teacherSay: 'Let me read this as steady growth: it begins at the start value, and each step adds the SAME 4 — so I copy that step, I never add the step to itself.' },
      { teacherSay: 'Now the trap: how many jumps happen before the 5th term — five, or one fewer?', expected: 'one fewer (four jumps)' },
      { teacherSay: 'Four jumps of 4 is 16; on top of the start 3 that lands at 19. Estimate check: four biggish jumps should clear the start by a lot, and it does.', expected: '19' },
    ], '19'),
    ge(22, 2, 'completion', 'A pattern starts at 6 and grows by 3 each step. What is the 7th term?', [
      { teacherSay: 'Which move turns "grows by 3 each step" into a jump — add the step, or multiply the whole thing?', expected: 'add the step each jump' },
      { childDo: 'Count the jumps (one fewer than 7), then add them onto 6.', expected: '24' },
    ], '24'),
    ge(22, 3, 'prompted', 'Name the ordered pair for a point 5 units right and 2 units up from the origin.', [
      { childDo: 'Write the across-move first, then the up-move.', expected: '(5, 2)' },
    ], '(5, 2)'),
    ge(22, 4, 'independent', 'A pattern starts at 2 and grows by 5 each step. Find the 6th term, then read it as a point (term-number, value). Solve cold.', [
      { childDo: 'Rule first, then read the point as (across, up).', expected: '27' },
    ], '27'),
  ],
  days: [
    // Day 1 — concept echo: single-step only (growth + grid), ~3 retrieval, no interleaving
    [
      { gen: wAdd, diff: 2 },
      { gen: wMul, diff: 2 },
      { gen: wEval, diff: 2 },
      { gen: gGrow, diff: 2 },
      { gen: gMap, diff: 2 },
      { gen: gRobot, diff: 3 },
    ],
    // Day 2 — fluency + application: discrimination + metacognition enter
    [
      { gen: wMul, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: gMeta, diff: 3 },
      { gen: discXY, diff: 3 },
      { gen: gStack, diff: 3 },
      { gen: gRobot, diff: 3 },
    ],
    // Day 3 — interleave discrimination with multi-step
    [
      { gen: wEval, diff: 2 },
      { gen: gMeta, diff: 4 },
      { gen: discXY, diff: 4 },
      { gen: msReach, diff: 3 },
      { gen: gStack, diff: 3 },
      { gen: msLevelUp, diff: 4 },
    ],
    // Day 4 — word problems (growth + coordinate + multi-step)
    [
      { gen: gGrow, diff: 3 },
      { gen: gMap, diff: 3 },
      { gen: msReach, diff: 4 },
      { gen: msLevelUp, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + reasoning + classification (+ ramped warm-up)
    [
      { gen: eaGrowth, diff: 4 },
      {
        gen: reasoning({
          prompt: 'A pattern is 4, 9, 14, 19, ... In writing, state its rule, then predict the 10th term and show how the rule got you there.',
          value: 'start 4, add 5 each step; the 10th term is 4 + 5 × 9 = 49',
          acceptableForms: ['add 5', '49'],
          keywords: true,
          hints: ['How much does each step change the pattern from the term before it?', 'Use start plus step times one-less-than-the-term.'],
          errorTags: ['procedure-slip', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: a point whose across-value (x) is zero sits on the up-axis (the y-axis). In one sentence, say how you know.',
          correct: 'always',
          distractors: [
            { text: 'sometimes', errorTag: 'concept-misconception', rationale: 'An across-value of zero means no across-move, so the point is always pinned to the up-axis.' },
            { text: 'never', errorTag: 'representation-misread', rationale: 'Confuses which coordinate pins a point to the axis.' },
          ],
          hints: ['What does an across-value of zero tell you about where the point sits?', 'No across-move keeps a point on the up-axis.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D22-PZ-01',
    title: 'Puzzle Grove: Hidden Picture',
    puzzleType: 'construction',
    prompt: 'Plot (1, 1), (1, 4), (4, 4), (4, 1) and connect them in order. What shape appears? Then predict: if a fifth corner continued the rule "add 3 to x," where along the across-axis would its x-value land?',
    answer: { value: 'a square (side 3); the next x-value lands at 7', acceptableForms: ['square', '7'], validation: 'short-text-keyword' },
    hintLadder: ['Which move does each ordered pair tell you to do first — across or up?', 'Plot each point as (across, up), connect them to read the shape, then step the x-rule once more.'],
    errorTags: ['representation-misread', 'concept-misconception'],
  }),
  puzzleMeta: { stepCount: 2, cognitiveOp: 'multi-step' },
  sprint: { skill: 'Single-digit multiplication facts (full table)', sourceWeek: C12, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [2, 9] } },
  mastery: [
    { gen: gGrow, diff: 3 },
    { gen: msReach, diff: 3 },
    { gen: gRobot, diff: 3 },
    { gen: msLevelUp, diff: 4 },
    { gen: gMap, diff: 3 },
    { gen: discXY, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step growth term / grid x-coordinate / treasure-map across-distance (x-before-y and copy-the-step affordances preserved). 02/04: multi-step (grow-then-add / grow-then-add-a-bonus). 06: the (x, y)-order discrimination. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    { errorTag: 'representation-misread', subtype: 'xy-swap', description: 'Swaps the coordinates (writes up before across).', exampleWrongAnswer: '(2, 5) read as 5 right, 2 up', distractorRationale: 'Offer the swapped ordered pair.', reteachPointer: 'explanation/script[0] (x before y)' },
    { errorTag: 'procedure-slip', subtype: 'off-by-one-term', description: 'Adds the step one too many or too few times when finding a term.', exampleWrongAnswer: '5th term of start 3 add 4 → 23', distractorRationale: 'Offer the off-by-one term.', reteachPointer: 'guidedExamples/D22-GE-01 (start + step × (n − 1))' },
    { errorTag: 'concept-misconception', subtype: 'add-instead-of-multiply', description: 'Adds the step and the number of steps instead of copying the step for each one (repeated-growth as a sum).', exampleWrongAnswer: 'total growth of 5 over 4 steps written as 9', distractorRationale: 'Offer the add-instead-of-multiply total.', reteachPointer: 'explanation/script[1] (each later term adds one more step) then the Day-4 staircase multi-step, which copies the step for every stair' },
    { errorTag: 'task-comprehension', subtype: 'axis-misread', description: 'Ignores one of the two moves, landing on the wrong axis or spot.', exampleWrongAnswer: '(2, 5) plotted on the bottom axis', distractorRationale: 'Offer an on-axis mislanding.', reteachPointer: 'Day-5 classify (an across-value of zero stays on the up-axis)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Plotting points in the first quadrant as (across, up) from the origin — x before y — and using a pattern\'s rule (start + step per term) to predict any term without listing them all, with an estimate-first check.',
    improvingCandidates: ['plotting points as x-before-y', 'finding a pattern\'s rule', 'predicting a distant term with the rule instead of counting'],
    strengtheningByTag: [
      { errorTag: 'representation-misread', text: 'plotting across BEFORE up — the (x, y)-order trap makes the swap visible' },
      { errorTag: 'procedure-slip', text: 'counting the right number of steps to a term (one fewer than the term number)' },
      { errorTag: 'concept-misconception', text: 'copying the step for every stair instead of adding the two numbers' },
    ],
    homeFocus: {
      praiseLine: 'You used the rule to jump straight to a far term instead of listing every one, and you checked it against a quick estimate — that is real structure-spotting.',
      questionForChild: 'For the point (2, 5), which way do you move first — and how far?',
      schoolSyncHook: 'If your child\'s class plots on a particular grid or uses input/output tables, tell us and we will match that format.',
    },
    vocabularyForParent: ['ordered pair ((across, up))', 'origin ((0, 0))', 'term (one number in a pattern)'],
  },
});
