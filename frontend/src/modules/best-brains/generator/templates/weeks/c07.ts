/**
 * Level C · Week 7 — "Facts: ×2, ×5, ×10" (conceptId: facts-2-5-10).
 *
 * FILL-ARCHITECTURE §5 row C7: anchor "skip-count ties" (`usesPriorSkill`, back
 * to B18); multi-step "fact then an add"; error-analysis "×10 treated as +10";
 * discrimination "×2 vs +2"; Day-5 signature "the product-pattern hunt (5s end
 * in 0 or 5)" posed as a pattern ARGUMENT, not a drill.
 *
 * The week's claim is that these three facts are not new knowledge — they are
 * counts the child has owned since B18, given a shorter name — and that naming a
 * count exposes a pattern the counting itself hides. So the content is built to
 * make the TIE visible and then to mine it:
 *  - every fact item is posed so the skip-count is the honest route to it
 *    (`usesPriorSkill: true`), and the three tables get three different
 *    situation structures rather than one story with the step size swapped:
 *    a rate (wheels per bicycle), a part-whole (a chart built of equal tally
 *    gates), a combine (towers of ten) and a comparison (doubling);
 *  - the discrimination is the sharpest thing on the page: "double that many"
 *    against "two more", where a child who joins instead of copying lands
 *    visibly elsewhere (the drawn count is ≥ 5, so the two answers are never
 *    within two of each other);
 *  - three genuine two-step items, all "fact then an add", but with three
 *    different second steps — loose items outside the packs, a one-off bonus on
 *    top of a repeated score, and the unpartnered leftovers of a set of pairs;
 *  - Day 5 hunts the pattern rather than reciting it: the child writes the fives
 *    count out, reads the last digits, and argues why the count HAS to keep
 *    doing that.
 *
 * THE 2×2 DEGENERATE, and where it gets an honest hearing. 2 is the one number
 * where doubling and adding two agree, so any ×2 item that draws a count of 2
 * makes the week's own diagnostic blind — a child who adds still lands on 4 and
 * nothing on the page can see it. Every ×2 draw here is nudged off that pair
 * DETERMINISTICALLY (kit §E2.4 — never a redraw loop, which would shift every
 * later draw in the pack). The fact itself is not suppressed, though: it is
 * moved to where it can be stated truthfully, the Day-5 Always/Sometimes/Never
 * item, whose correct answer is "sometimes" precisely because of it. (Same
 * manoeuvre as kit §E2.3's second option: put the awkward truth where the
 * machinery can express it, rather than pretending it is not there.)
 *
 * POSING (PEDAGOGY-CEILING-REVIEW F3). C5 spent `inverse-start` and C6 spent
 * `has-distractor`; this week spends `goal-first` — the lost-property item names
 * what is wanted before it gives a single number, so the child reads the story
 * backwards from the goal. One new posing per week is how the ceiling lifts
 * without any one page carrying two novelties at once.
 *
 * FIGURE LAW as applied here (FANOUT kit §F.7, §E2.5): each of the three tables
 * gets exactly one day-item picture, and each picture shows ONE group and
 * asserts its SIZE against the item's own drawn param — the two wheels a single
 * bicycle takes, the five strokes of a single tally gate, the ten cubes of a
 * single tower. The unit of count is the thing worth drawing; the product never
 * is, because the product is the question. The pictures that show a whole
 * structure live where the answer is already on the page: the lesson script and
 * the modeled guided example.
 *
 * Retrieval is backward-only into C2/C3/C4 (compare, ± within 1,000), into C6
 * (equal groups — the meaning these facts compress) and into B18 skip counting,
 * which is the substrate the whole week is a shorthand for.
 */

import { addWhole, asWarmup, classify, compareWhole, reasoning, subWhole } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { areaGrid, assertsAnswer, assertsParam, barModel, counterGroups, counters, numberLine } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B10 = { level: 'B' as const, week: 10 };
const B18 = { level: 'B' as const, week: 18 };
const B20 = { level: 'B' as const, week: 20 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C4 = { level: 'C' as const, week: 4 };
const C6 = { level: 'C' as const, week: 6 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two distinct names, for the comparison trap. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep) carry no figure slot, and lib/
// is not ours to edit, so this wrapper does what `withEstimateFirst` does: all
// of it happens inside the returned closure, it takes no new rng draw, and it
// leaves the prompt (and therefore the QG-1/QG-4 surface signature) untouched.
// It reads the drafted item's `generator.params` — the very numbers the answer
// was computed from — so "a figure is built from the item's own drawn values"
// holds by construction. (Pattern established by c06, the Level-C exemplar.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/** C3 — addition within 1,000; the arithmetic a "fact then an add" ends on. */
const wAdd = asWarmup(addWhole(118, 462), C3);
/** C4 — subtraction within 1,000, kept warm across a multiplication fortnight. */
const wSub = asWarmup(subWhole(134, 916), C4);
/** C2 — compare, so "which is bigger" survives the switch to products. */
const wCompare = asWarmup(compareWhole(3), C2);

/**
 * B18 — skip counting, this week's whole substrate, retrieved as a GAP rather
 * than a next-number. A gap has to be reached from the number in front of it,
 * which is the same move a fact asks for; a next-number can be answered by
 * momentum alone.
 */
const wCountGap = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'multiple',
    usesPriorSkill: true,
    draw: (r) => {
      const step = r.pick([2, 5, 10] as const);
      const len = r.int(5, 6);
      const gap = r.int(3, len - 1);
      const written = Array.from({ length: len }, (_, i) => (i + 1 === gap ? '__' : String(step * (i + 1)))).join(', ');
      return {
        prompt: `${one(r)} is counting in ${step}s and writes the count down. One number is smudged: ${written}. Which number belongs where the smudge is?`,
        answerValue: String(step * gap),
        templateId: 'd_multiple_v1',
        params: { base: step, k: gap },
        hints: [
          'How much does this count grow by from one number to the number after it?',
          'Start at the number just in front of the smudge. Take one more step of that size.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B18,
);

/** C6 — equal groups, the meaning a times fact compresses into one name. */
const wEqualGroups = asWarmup(
  situation({
    situationType: 'rate',
    cognitiveOp: 'mul',
    draw: (r) => {
      const per = r.int(3, 8);
      const tanks = r.int(3, 6);
      return {
        prompt: `Every tank in the pet shop holds ${countNoun(per, 'guppies')}. The shop has ${countNoun(tanks, 'tanks')}. How many guppies are in the shop?`,
        answerValue: String(per * tanks),
        templateId: 'd_mul_v1',
        params: { a: per, b: tanks },
        units: 'guppies',
        hints: [
          'Do all the tanks in this story hold the same amount, or different amounts?',
          'Take what one tank holds. Take it again once for every tank the shop has.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  C6,
);

// ---------------------------------------------------------------------------
// Single-step facts — one situation STRUCTURE per table, not one story with the
// step size swapped. Each carries `usesPriorSkill`: the honest route to every
// one of these answers is the B18 count.
// ---------------------------------------------------------------------------

/** ×2 as a RATE: two wheels for every bicycle. Figure = the wheels ONE takes. */
const factWheels = withFigure(
  situation({
    situationType: 'rate',
    cognitiveOp: 'mul',
    usesPriorSkill: true,
    draw: (r) => {
      // A rack of two bicycles is the pair where doubling and adding two agree,
      // so the week's own diagnostic would go blind on it; the draw starts above
      // it rather than being redrawn (kit §E2.4). The fact that they agree there
      // is not hidden — the Day-5 claim item is where it is stated outright.
      const bikes = r.int(3, 12);
      return {
        prompt: `[image: one bicycle and the wheels it takes] Every bicycle in the school rack needs ${countNoun(2, 'wheels')}. Today the rack holds ${countNoun(bikes, 'bicycles')}. How many wheels are there on all of them?`,
        answerValue: String(2 * bikes),
        templateId: 'd_mul_v1',
        params: { a: 2, b: bikes },
        units: 'wheels',
        hints: [
          'Does every bicycle in this story need the same number of wheels?',
          'Count the rack in twos, one bicycle at a time. Stop when the last bicycle has its pair.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  (p) =>
    counterGroups([{ count: numOf(p, 'a'), noun: 'balls', label: 'one bicycle' }], {
      alt: 'the two wheels a single bicycle takes',
      asserts: assertsParam('a'),
    }),
);

/**
 * ×5 as PART-WHOLE: a chart whose whole is built of equal gates. Figure = one
 * gate. A week-long bird count and not a class vote, because a full chart here
 * reaches sixty and no single class has sixty voters in it — the tally gate is
 * the artefact worth keeping, not the ballot.
 */
const factTallyGates = withFigure(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'mul',
    usesPriorSkill: true,
    draw: (r) => {
      const gates = r.int(3, 12);
      const name = one(r);
      return {
        prompt: `[image: one full tally gate] ${name}'s class keeps a bird-watch chart by the window. A full tally gate on it stands for ${countNoun(5, 'birds')}. By Friday the chart shows ${countNoun(gates, 'full gates')} and no loose strokes. How many birds have been counted?`,
        answerValue: String(5 * gates),
        templateId: 'd_mul_v1',
        params: { a: 5, b: gates },
        units: 'birds',
        hints: [
          'What does one whole gate on this chart stand for?',
          'Run the fives count along the chart, saying one number as you pass each gate.',
        ],
        errorTags: ['representation-misread', 'fact-recall'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'a'), 'buttons', {
      alt: 'one full tally gate: five strokes',
      asserts: assertsParam('a'),
    }),
);

/** ×10 as COMBINE: equal towers gathered into one heap. Figure = one tower. */
const factCubeTowers = withFigure(
  situation({
    situationType: 'combine',
    cognitiveOp: 'mul',
    usesPriorSkill: true,
    draw: (r) => {
      const towers = r.int(3, 12);
      const name = one(r);
      return {
        prompt: `[image: one tower of ten cubes] ${name} builds towers out of linking cubes. Every tower is the same height: ${countNoun(10, 'cubes')} to a tower. ${name} has built ${countNoun(towers, 'towers')} so far. How many cubes are standing on the table?`,
        answerValue: String(10 * towers),
        templateId: 'd_mul_v1',
        params: { a: 10, b: towers },
        units: 'cubes',
        hints: [
          'Is the question about one tower, or about everything standing on the table?',
          'Count the towers in tens, taking a whole ten as each new tower goes up.',
        ],
        errorTags: ['concept-misconception', 'fact-recall'],
      };
    },
  }),
  (p) =>
    counters(numOf(p, 'a'), 'blocks', {
      arrangement: 'a tower',
      alt: 'one tower of ten cubes',
      asserts: assertsParam('a'),
    }),
);

/** ×2 as COMPARISON: the same person, twice over. The honest twin of the trap. */
const factDoubleDay = situation({
  situationType: 'comparison',
  cognitiveOp: 'mul',
  usesPriorSkill: true,
  draw: (r) => {
    // Four and up: at two, doubling and adding two land together, and the
    // comparison this item teaches would have nothing to show.
    const monday = r.int(4, 12);
    const name = one(r);
    return {
      prompt: `${name} folded ${countNoun(monday, 'paper cranes')} on Monday. On Tuesday ${name} folded double that many. How many paper cranes did ${name} fold on Tuesday?`,
      answerValue: String(2 * monday),
      templateId: 'd_mul_v1',
      params: { a: 2, b: monday },
      units: 'paper cranes',
      hints: [
        'Does doubling make a second copy of Monday, or add a couple more to it?',
        'Lay Monday out, lay the very same amount beside it, and read the two together.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * Metacognition base — served ONLY through the estimate-first wrapper, never
 * raw, so its ladder is counted once (kit §E2.2).
 *
 * The probe is the week's own pattern turned into a genuine call: a fives answer
 * ends in a five or a zero depending on whether the count of dominoes is odd or
 * even, so "which one?" cannot be guessed by reflex — it has to be reasoned
 * before a single multiplication happens, and it doubles as the child's check.
 */
const factDominoLine = situation({
  situationType: 'measurement',
  cognitiveOp: 'mul',
  usesPriorSkill: true,
  draw: (r) => {
    const dominoes = r.int(4, 14);
    const name = one(r);
    return {
      prompt: `Each domino in the box is ${countNoun(5, 'cm')} long. ${name} lays ${countNoun(dominoes, 'dominoes')} end to end in one straight line. How long is the line of dominoes?`,
      answerValue: String(5 * dominoes),
      templateId: 'd_mul_v1',
      params: { a: 5, b: dominoes },
      units: 'cm',
      hints: [
        'Which of the three counts steps along this line one domino at a time?',
        'Take that step once for every domino on the table. Then read the number you stop on.',
      ],
      errorTags: ['task-comprehension', 'fact-recall'],
    };
  },
});
const factDominoEstimate = withEstimateFirst(
  factDominoLine,
  'will the length of the line end in a five, or end in a zero?',
);

// ---------------------------------------------------------------------------
// Multi-step: the C7 recipe row is "fact then an add". Same skeleton, three
// genuinely different second steps — what is left OUTSIDE the equal packs, a
// one-off bonus ON TOP of a repeated score, and the unpartnered remnant of a set
// of pairs — and one of the three posed goal-first.
// ---------------------------------------------------------------------------

/** ×10, then the loose ones that never made it into a strip. */
const msStampStrips = multiStep({
  situationType: 'multi-stage',
  usesPriorSkill: true,
  draw: (r) => {
    const strips = r.int(3, 9);
    // Fewer loose stamps than a whole strip holds — otherwise the loose pile is
    // really another strip, and the two steps stop being two different ideas.
    const loose = r.int(1, 9);
    const name = one(r);
    return {
      prompt: `A strip of stamps from the post office holds ${countNoun(10, 'stamps')}. ${name} buys ${countNoun(strips, 'strips')} for a collection. Then ${name} finds ${countNoun(loose, 'loose stamps')} in a drawer at home. Those go into the same album. How many stamps go into the album?`,
      initN: 10,
      steps: [
        { op: 'mul', n: strips, d: 1 },
        { op: 'add', n: loose, d: 1 },
      ],
      units: 'stamps',
      hints: [
        'Which of these stamps arrived in whole strips, and which arrived on their own?',
        'Count the strips in tens first. Bring in the loose ones only after that count has finished.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/** ×5 as a repeated score, then a single bonus that is not another right answer. */
const msQuizPoints = multiStep({
  situationType: 'combine',
  usesPriorSkill: true,
  draw: (r) => {
    const right = r.int(3, 9);
    let bonus = r.int(2, 9);
    // A bonus of five would read as one more right answer, blurring the very
    // boundary between the two steps that this item exists to draw.
    if (bonus === 5) bonus = 4;
    const name = one(r);
    return {
      prompt: `In the fast round of a quiz every right answer is worth ${countNoun(5, 'points')}. ${name} gets ${countNoun(right, 'answers')} right in that round. Then ${name} earns ${countNoun(bonus, 'points')} for the picture question at the end. How many points does ${name} score altogether?`,
      initN: 5,
      steps: [
        { op: 'mul', n: right, d: 1 },
        { op: 'add', n: bonus, d: 1 },
      ],
      units: 'points',
      hints: [
        'Are all of these points scored at the same rate? Or does one of them come from somewhere else?',
        'Score the fast round on its own first. Then put the picture question on top of that total.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * ×2, then the shoes with no partner — posed GOAL-FIRST (F3): the sentence that
 * says what is wanted arrives before any number does, so the child reads the
 * story backwards from the goal rather than being carried through it in order.
 */
const msLostProperty = multiStep({
  situationType: 'part-whole',
  usesPriorSkill: true,
  posing: 'goal-first',
  draw: (r) => {
    const pairs = r.int(3, 12);
    // Odd counts only: an even pile of unpartnered shoes invites the question of
    // why they are not paired up, and it keeps the leftover clear of the pair
    // size itself.
    const odd = r.pick([1, 3, 5, 7] as const);
    const name = one(r);
    return {
      prompt: `Work out how many shoes are in the lost-property box. ${name} has been asked to sort it. Every pair in the box is ${countNoun(2, 'shoes')}. The box holds ${countNoun(pairs, 'pairs')}, along with ${countNoun(odd, 'shoes')} that never found a partner.`,
      initN: 2,
      steps: [
        { op: 'mul', n: pairs, d: 1 },
        { op: 'add', n: odd, d: 1 },
      ],
      units: 'shoes',
      hints: [
        'Which shoes come two at a time? Which ones arrived alone?',
        'Count the matched pairs in twos first. Only then go near the ones on their own.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's sharpest page, forced as a CHOICE
// ---------------------------------------------------------------------------

/**
 * ×2 against +2 (the C7 recipe row). The trap is a single word: "double" copies
 * the amount, "two more" joins two things to it, and the distractor IS the
 * genuine output of hearing the second where the first was said. The drawn count
 * starts at five so the two answers are never within two of each other — a child
 * who adds has to land somewhere they can SEE is a different place.
 */
const discrimDoubleOrTwoMore = discrimination({
  variant: 'cross-op',
  cognitiveOp: 'choose-operation',
  draw: (r) => {
    // Five and up. At two the two moves agree exactly, and this item would be
    // asking a question it could not mark; from five up the gap is at least
    // three, which is the point of the page.
    const found = r.int(5, 12);
    const [first, second] = two(r);
    return {
      prompt: `${first} found ${countNoun(found, 'pinecones')} along the woodland path. ${second} found double that many. Which number tells how many pinecones ${second} found?`,
      correct: String(2 * found),
      distractors: [
        {
          text: String(found + 2),
          errorTag: 'concept-misconception',
          rationale: 'Hears "double" as "two more" — two extra pinecones added to the pile, rather than the whole pile taken a second time.',
        },
        {
          text: String(found),
          errorTag: 'task-comprehension',
          rationale: 'Reports the count the story opened with, so the second child\'s haul is never worked out at all.',
        },
      ],
      hints: [
        'Does doubling copy what someone already has? Or does it slip a couple more onto the top?',
        'Picture the first pile, then build a second pile exactly like it, and count both.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The structural sibling: which numbers BELONG to a count. Its two distractors
 * are the week's two live confusions, side by side — a number off the fives
 * ladder (the pattern read one notch too loosely: "ends in five or zero" is the
 * FIVES rule, not the tens rule), and a number reached by counting on ten once
 * rather than taking ten again and again, which is the same slip the Day-5
 * error-analysis then shows worked out in full.
 */
const discrimInTheCount = discrimination({
  variant: 'structural',
  cognitiveOp: 'pattern-membership',
  draw: (r) => {
    const rung = r.int(4, 9);
    const name = one(r);
    return {
      prompt: `${name} is counting in tens: ten, twenty, thirty, and on. The count stops before it passes one hundred. Which of these numbers does ${name} say?`,
      correct: String(10 * rung),
      distractors: [
        {
          text: String(10 * rung + 5),
          errorTag: 'representation-misread',
          rationale: 'Reads the rule as "ends in a five or a zero", which is the pattern the FIVES count makes; a count of tens steps straight over this number.',
        },
        {
          text: String(rung + 10),
          errorTag: 'concept-misconception',
          rationale: 'Reached by counting on ten a single time from the rung number, rather than taking a whole ten again for every rung climbed.',
        },
      ],
      hints: [
        'Look at the last digit of every number in a count of tens. What do they all have in common?',
        'Say the tens count aloud from its start. Listen for each of these numbers as you pass.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's error, and the one the verify library expresses natively: ×10
// carried out as +10. `d_verify_binop_misconception_v1` computes the truth from
// {a, b, op:'*'} and the shown value from the same operands under wrongOp:'+',
// so the number the student is holding is a real output of a real misconception
// — nothing about it is authored.
// ---------------------------------------------------------------------------

const eaTenAsPlusTen = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ a: r.int(3, 9), b: 10, op: '*', wrongOp: '+' }),
  build: (v, p) => ({
    prompt: `The art cupboard is being counted. There are ${countNoun(Number(p.a), 'boxes')} on the shelf, and every box holds ${countNoun(Number(p.b), 'pencils')}. Asked how many pencils the cupboard holds, a student wrote ${p.a} + ${p.b} = ${v.wrong}.`,
    extension: 'Draw the shelf. Write how many pencils are really in the cupboard. Then say in one sentence what the student did with the two numbers.',
    hints: [
      'Would a whole shelf of boxes really hold only a handful more pencils?',
      'Open the boxes one at a time. Take a full ten out of each. See where that count finishes.',
    ],
    errorTags: ['concept-misconception', 'fact-recall'],
  }),
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC07 = makeWeekBuilder({
  level: 'C',
  week: 7,
  conceptId: 'facts-2-5-10',
  conceptName: 'Facts: ×2, ×5, ×10',
  strandTags: ['multiplication-division'],
  prerequisiteWeeks: [B18, B20, C6],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the skip-count ladder',
  conceptFamily: 'operation',
  deepeningDelta:
    'C6 asked only whether a story was an equal-groups story at all, and any picture it drew could honestly be counted one thing at a time. C7 keeps that structure and changes what has to be quick: on the three ladders a child already owns — twos, fives and tens — the count becomes a named fact, and the naming exposes a pattern in the products that counting one by one never shows.',
  explanation: {
    hook:
      'You have been saying 5, 10, 15, 20, 25, 30 since you were small. This week that count gets a shorter name. The moment it has a name, it starts showing you patterns. Those are patterns the counting was hiding.',
    whyBeforeHow:
      'You already know how to count in twos, in fives and in tens. A times fact only ever asks where one of those counts lands. That is why the ×2, ×5 and ×10 facts are nothing new. They are things you can already do, wearing a shorter name. Picture the skip-count ladder. Every rung is one more equal group. Climbing six rungs of the fives ladder puts you on 30. And 6 × 5 is simply the name of that rung. Knowing the rung instead of climbing to it is what matters. That is the whole difference between counting and a fact. The three ladders also leave tracks. The tens ladder only ever lands on numbers ending in zero. The fives ladder swings between five and zero. So a fives answer ending in a three has to be a slip. And the shortest ladder is the one to watch. Taking two AGAIN is not the same as taking two MORE.',
    script: [
      {
        say: 'Watch me climb. I am counting in fives. Each jump is one whole group of five: five, ten, fifteen, twenty, twenty-five, thirty. Six jumps got me to thirty. Notice that I said six numbers and I landed on thirty. The number of jumps and the number I land on are two different things. I keep them apart on purpose.',
        visual: 'A number line from 0 to 30 with the fives marked, and the first two jumps drawn.',
        figure: numberLine(
          {
            min: 0,
            max: 30,
            step: 5,
            labels: 'majors',
            marks: [
              { at: 5, label: '5', style: 'flag' },
              { at: 30, label: '30', style: 'flag' },
            ],
            hops: [
              { from: 0, to: 5, label: 'one five' },
              { from: 5, to: 10, label: 'another five' },
            ],
          },
          { alt: 'a number line from 0 to 30 marked in fives, with the first two jumps of five drawn from 0' },
        ),
      },
      {
        say: 'Here is the same climb as groups. Six groups, five in each, thirty in all. So when I write 6 × 5 = 30, I am not learning a new number. I am giving the rung I landed on its name. That is why a forgotten fact is never lost. I can always climb back up to it.',
        visual: 'Six groups of five counters, thirty counters in all.',
        figure: counterGroups(
          [
            { count: 5, noun: 'counters', label: 'group' },
            { count: 5, noun: 'counters', label: 'group' },
            { count: 5, noun: 'counters', label: 'group' },
            { count: 5, noun: 'counters', label: 'group' },
            { count: 5, noun: 'counters', label: 'group' },
            { count: 5, noun: 'counters', label: 'group' },
          ],
          { alt: 'six groups of five counters, thirty counters in all' },
        ),
      },
      {
        say: 'The tens ladder is the friendliest of the three. Four rows of ten cubes: ten, twenty, thirty, forty. Every rung of this ladder ends in a zero, every single time. That is worth trusting. It tells me the answer forty belongs to the tens. It tells me the answer fourteen does not.',
        visual: 'Four rows of ten cubes, forty cubes in all.',
        figure: areaGrid(
          { rows: 4, cols: 10, rowLabels: ['10', '10', '10', '10'] },
          { alt: 'four rows with ten cubes in each row, forty cubes in all' },
        ),
      },
      {
        say: 'One last habit before any answer goes down. I check the size and the last digit. Double seven is seven taken twice, which is fourteen. Seven and two more is only nine. Say I am about to double. If my answer is barely bigger than what I started with, I joined. I should have copied. And say a fives answer ends in anything but a five or a zero. Then I have slipped somewhere on the ladder.',
        visual: 'A long bar for double seven beside a short bar for seven and two.',
        figure: barModel(
          [
            { label: 'double seven', segments: [{ value: 7, label: '7' }, { value: 7, label: '7' }], total: '14' },
            { label: 'seven and two more', segments: [{ value: 7, label: '7' }, { value: 2, label: '2', fill: 'hatch' }], total: '9' },
          ],
          { scaleMax: 14, alt: 'a bar of fourteen made of two sevens, beside a shorter bar of nine made of a seven and a two' },
        ),
      },
    ],
    summary:
      'The ×2, ×5 and ×10 facts are counts you already own, named. If a fact will not come, climb the ladder to it. Then check what you landed on. A tens answer ends in zero. A fives answer ends in five or zero. A double is always the amount taken a second time. It is never the amount with two more on top.',
    vocabulary: [
      { term: 'skip-count', kidGloss: 'counting in equal jumps — 5, 10, 15, 20 …' },
      { term: 'times fact', kidGloss: 'the number a skip-count lands on, known straight off rather than counted up to' },
      { term: 'double', kidGloss: 'the same amount taken a second time — that is what ×2 means' },
      { term: 'last digit', kidGloss: 'the digit on the end of a number, which tells you which counts it belongs to' },
    ],
  },
  guidedExamples: [
    {
      ...ge(7, 1, 'modeled', 'The school rack holds 6 bicycles. Every bicycle needs 2 wheels. How many wheels are on the bicycles in the rack?', [
        {
          teacherSay:
            'First I check that the groups really do match. Every bicycle needs two wheels, not two for some and three for others. That is what lets me count the whole rack in twos. I do not have to count wheels one at a time.',
        },
        {
          teacherSay: 'Now I climb the twos ladder, one bicycle per rung. Two, four, six… where does the sixth bicycle put me?',
          expected: '12',
        },
      ], '12'),
      visual: 'Six bicycles, each with the two wheels it takes.',
      figure: counterGroups(
        [
          { count: 2, noun: 'balls', label: 'bicycle' },
          { count: 2, noun: 'balls', label: 'bicycle' },
          { count: 2, noun: 'balls', label: 'bicycle' },
          { count: 2, noun: 'balls', label: 'bicycle' },
          { count: 2, noun: 'balls', label: 'bicycle' },
          { count: 2, noun: 'balls', label: 'bicycle' },
        ],
        { alt: 'six bicycles, each with two wheels, twelve wheels in all', asserts: assertsAnswer },
      ),
    },
    {
      ...ge(7, 2, 'completion', 'Ben builds towers of 10 linking cubes, all the same height. Ben has built 8 towers. How many cubes are standing on the table?', [
        { teacherSay: 'Which ladder does a story about towers of ten hand you?', expected: 'the tens' },
        { childDo: 'Climb the tens ladder once for every tower. Say where the eighth tower puts you.', expected: '80' },
      ], '80'),
      // COMPLETION fade: the child produces 80, so the picture shows only what a
      // single tower holds. Drawing all eight would finish the climb for them.
      visual: 'One tower of ten cubes. The other towers are yours to count on.',
      figure: counters(10, 'blocks', { arrangement: 'a tower', alt: 'one tower of ten cubes' }),
    },
    ge(7, 3, 'prompted', 'A bird-watch chart records what the class sees in tally gates. A full gate stands for 5 birds. By Friday the chart shows 7 full gates and no loose strokes. How many birds have been counted?', [
      { childDo: 'Say what one gate is worth, then run the fives count along the chart.', expected: '35' },
    ], '35'),
    {
      // Independent stage: no picture at all. Deciding that the fast round is one
      // job and the picture question is another IS the task, so any drawing of
      // the two parts would hand over the plan the item exists to ask for.
      ...ge(7, 4, 'independent', 'In the fast round of a quiz every right answer is worth 5 points. Zoe gets 6 right in that round. Then Zoe earns 3 points for the picture question at the end. How many points does Zoe score altogether? Solve cold.', [
        { childDo: 'Settle the fast round first, then deal with the picture question.', expected: '33' },
      ], '33'),
    },
  ],
  days: [
    // Day 1 — concept echo: one fact per table, one situation structure each,
    // single-step only. No two-step load and no trap yet.
    [
      { gen: wAdd, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: wEqualGroups, diff: 2 },
      { gen: factWheels, diff: 2 },
      { gen: factTallyGates, diff: 3 },
      { gen: factCubeTowers, diff: 3 },
    ],
    // Day 2 — fluency + application: the estimate-first probe (which is the
    // week's own last-digit check), the ×2-vs-+2 trap, and the first two-step.
    [
      { gen: wSub, diff: 2 },
      { gen: wCountGap, diff: 2 },
      { gen: factDominoEstimate, diff: 3 },
      { gen: discrimDoubleOrTwoMore, diff: 3 },
      { gen: msStampStrips, diff: 4 },
      { gen: factDoubleDay, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations against a second two-step and two
    // single-step facts, so the page shape never announces which is coming.
    [
      { gen: wEqualGroups, diff: 2 },
      { gen: discrimInTheCount, diff: 3 },
      { gen: discrimDoubleOrTwoMore, diff: 4 },
      { gen: msQuizPoints, diff: 4 },
      { gen: factWheels, diff: 3 },
      { gen: factTallyGates, diff: 3 },
    ],
    // Day 4 — word problems: all three two-steps, including the goal-first one,
    // with two single-step facts mixed in so "it must be two steps" never becomes
    // the cue the child reads instead of the story.
    [
      { gen: msStampStrips, diff: 4 },
      { gen: msQuizPoints, diff: 4 },
      { gen: msLostProperty, diff: 5 },
      { gen: factCubeTowers, diff: 4 },
      { gen: factDoubleDay, diff: 3 },
    ],
    // Day 5 — non-computational: the ×10-as-+10 error-analysis, the fives
    // pattern hunt written as an argument, and the claim that gives the one
    // number where doubling and adding two agree its honest hearing.
    [
      { gen: wCountGap, diff: 2 },
      { gen: eaTenAsPlusTen, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Count in fives and write down the first ten numbers you say. Now cover everything except the LAST digit of each number. Read those digits along the row. Write what those last digits do. Then say in one sentence why the count must keep doing it.',
          value: 'the last digits take turns — five, zero, five, zero all the way along — because every jump of five carries the last digit on by five, which turns a zero into a five and a five back into a zero',
          acceptableForms: ['five', 'zero', 'last digit', 'jump of five', 'take turns'],
          keywords: true,
          hints: [
            'What do you notice about the last digits as your eye travels along the row?',
            'Take one jump of five from a number ending in zero. Then take one more from where that lands. Watch what the end digit does each time.',
          ],
          errorTags: ['representation-misread', 'concept-misconception'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? Doubling a number gives the same answer as adding two to it. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'never',
              errorTag: 'concept-misconception',
              rationale: 'Rules out the single number where the two moves really do meet — a pile of two taken twice is the same size as a pile of two with two more beside it.',
            },
            {
              text: 'always',
              errorTag: 'representation-misread',
              rationale: 'Treats doubling and adding two as two names for one move, which they are at exactly one number and nowhere else.',
            },
          ],
          hints: [
            'Is there a number where both moves finish in the same place? Try copying it, then try putting two more with it.',
            'Work up from the smallest numbers, one at a time. Watch the gap between the two answers open out.',
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
    'For grown-ups: a forgotten fact is not a lost fact this week — it is a fact your child can climb back to. If "7 × 5" draws a blank, do not supply 35; ask them to count in fives and keep track on their fingers. Getting there slowly a dozen times is what makes getting there instantly possible, and children who are allowed to climb stop being frightened of the tables.',
  ],
  puzzle: (r) => {
    // Where the twos ladder and the fives ladder meet is the tens ladder — a
    // small genuine discovery, and the completeness argument ("how do you know
    // none is missing?") is the part that is really being asked for.
    const cap = r.pick([45, 55, 65, 75, 85] as const);
    const shared: string[] = [];
    for (let n = 10; n <= cap; n += 10) shared.push(String(n));
    const [counterA, counterB] = two(r);
    return {
      id: 'C7-PZ-01',
      title: 'Puzzle Grove: Where the Ladders Meet',
      puzzleType: 'logic',
      prompt: `${counterA} counts in twos: two, four, six, and on. ${counterB} counts in fives: five, ten, fifteen, and on. Both of them stop as soon as the count would pass ${cap}. Write down every number that BOTH of them say. Then say how you can be sure that none is missing.`,
      answer: {
        // `set` and not `short-text-keyword`: the task is to find EVERY meeting
        // point, and a keyword check would mark a child correct for naming one
        // of them. A set answer is graded unordered but complete, which is what
        // the question actually asks for.
        value: shared.join(', '),
        acceptableForms: [shared.join('; ')],
        validation: 'set',
      },
      hintLadder: [
        'What must a number be like to turn up in both counts? It must appear in the twos count and the fives count.',
        'Walk the shorter of the two counts. Test each number you say against the other count. Stop when the cap is passed.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'pattern-search' },
  sprint: {
    skill: 'Adding tens — the single jump the count of tens is built out of',
    sourceWeek: B10,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'add_tens_2digit_v1',
    params: { baseRange: [13, 78], tensRange: [10, 40], noCross100: true },
  },
  mastery: [
    { gen: factWheels, diff: 3 },
    { gen: msStampStrips, diff: 3 },
    { gen: factTallyGates, diff: 3 },
    { gen: msQuizPoints, diff: 4 },
    { gen: factCubeTowers, diff: 3 },
    { gen: msLostProperty, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: one single-step fact from each table — twos as a rate, fives as a chart built of equal gates, tens as equal towers combined — with the one-group figure affordance preserved on all three. 02/04/06: the three two-steps, one per table, with their three different second steps (loose items, a one-off bonus, unpartnered leftovers) and the goal-first posing kept on the last. No operand surface reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'joined-instead-of-copied',
      description: 'Carries out a times fact as an addition of the two numbers — doubling read as "two more", and ×10 read as "ten more".',
      exampleWrongAnswer: '6 boxes of 10 pencils answered as 16',
      distractorRationale: 'Offer the sum of the two stated numbers.',
      reteachPointer: 'explanation/script[3] (the long bar for a double beside the short bar for two more)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'wrong-ladder-pattern',
      description: 'Applies one ladder\'s pattern to another — treating "ends in five or zero" as a test for the tens count, or reading a chart of gates as a count of single strokes.',
      exampleWrongAnswer: '75 offered as a number said while counting in tens',
      distractorRationale: 'Offer a number one rung of five off the tens ladder.',
      reteachPointer: 'explanation/script[2] (every rung of the tens ladder ends in a zero, every single time)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stops-before-the-add',
      description: 'Answers with what the equal groups came to and stops, leaving the loose items, the bonus or the unpartnered leftovers out of the total the question asked for.',
      exampleWrongAnswer: 'a strips-plus-loose-stamps story answered with the strips alone',
      distractorRationale: 'Offer the product on its own, without the quantity the second step adds.',
      reteachPointer: 'guidedExamples/C7-GE-04 (settle the first job, then deal with the second)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'lands-one-rung-out',
      description: 'Chooses the right ladder and then loses the thread on the way up, landing one group short or one group over.',
      exampleWrongAnswer: '7 tally gates of 5 birds answered as 30',
      distractorRationale: 'Offer the product one group short.',
      reteachPointer: 'guidedExamples/C7-GE-03 (say the running count aloud, one number per gate), then the 2-minute adding-tens sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The ×2, ×5 and ×10 facts, built on the counts your child already knows — climbing the twos, fives and tens counts to reach a product, telling doubling apart from adding two, two-step stories that need a fact and then an addition, and the patterns the products leave behind (tens end in zero, fives end in five or zero).',
    improvingCandidates: [
      'reaching a forgotten fact by counting up to it rather than guessing',
      'keeping the number of groups apart from the number the count lands on',
      'checking the last digit of an answer before writing it down',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'doubling versus adding two — the two bars side by side settle it in a second, and the same picture covers ×10 against "ten more"',
      },
      {
        errorTag: 'representation-misread',
        text: 'keeping each ladder\'s pattern to itself, so the fives rule is not used to test the tens count',
      },
      {
        errorTag: 'task-comprehension',
        text: 'finishing a two-step story, including the few that sit outside the equal groups',
      },
      {
        errorTag: 'fact-recall',
        text: 'holding the count steady on the way up, so the answer lands on the right rung',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted your way up to the fact instead of guessing at it, and then you checked the last digit before writing it down — that check is the habit this whole week is built on.',
      questionForChild: 'If every bicycle needs 2 wheels, how many wheels do 7 bicycles need — and which count did you use to get there?',
      schoolSyncHook: 'If your child\'s class learns these tables in a set order — twos, then tens, then fives — tell us which order and we will follow it.',
    },
    vocabularyForParent: [
      'skip-count (counting in equal jumps: 5, 10, 15 …)',
      'times fact (the number a skip-count lands on, known straight off)',
      'double (the same amount taken a second time — exactly what ×2 means)',
    ],
  },
});
