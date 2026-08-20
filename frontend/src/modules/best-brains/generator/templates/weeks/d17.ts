/**
 * Level D · Week 17 — "± fractions (unlike denominators)"
 * (conceptId: frac-addsub-unlike-denominators).
 *
 * v2 PEDAGOGY BLUEPRINT, authored 2026-08-11 against `build/D17-RECIPE-PROPOSAL.md`
 * §4 (owner-ruled option A). Structure follows the D10/D18 shape.
 *
 * WHY THIS WEEK EXISTS AS A GENERATED WEEK. The (D,17) cell was served from the
 * pinned hand-authored fixture MFM-D17 from increment 2 until this build. The
 * fixture is excellent and stays on disk as the pinned CALIBRATION artifact (the
 * style-gate thresholds and QG-11's v1 set are defined against it, and
 * `bb-spoken-answer-test`/`bb-qg13-test` keep it as a regression fixture) — it is
 * simply no longer what a child receives, because a static pack serves one form to
 * every child forever, recomputes nothing, and carries no word-problem strand. What
 * is preserved is the fixture's DESIGN: the naming wall, the tops-and-bottoms
 * misconception, the estimate-against-1/2-and-1 habit, the already-same-size case
 * planted mid-week, and the any-common-denominator-is-legal insight. Every operand,
 * scene and sentence here is this week's own — echoing the fixture's prose would
 * ship the same page twice under two names (the b14 doctrine).
 *
 * Authoring choices (recipe D17):
 *  - Anchor: the NAMING WALL. Two fractions cannot be counted together until they
 *    are re-named into one size of piece. The common denominator is any number both
 *    bottoms divide into; the least is a convenience, never a law.
 *  - Multi-step (OP family → ≥2 week-wide incl. ≥1 on Day 4): three genuine chains —
 *    combine (two unlike pours, then a third), part-whole (one whole minus two
 *    unlike pieces), measurement (three unlike legs summed).
 *  - Error-analysis (Day 5, generated): tops-AND-bottoms via d_verify_frac_v1 mode
 *    'tops-bottoms' — 1/3 + 1/4 → 2/7. Shown-wrong and true sum are BOTH
 *    code-recomputed.
 *  - Discrimination (Days 2–3): needs-renaming vs already-same-size (the mid-week
 *    like-denominator case is deliberate), and any-common-denominator vs
 *    only-the-least.
 *  - Metacognition: estimate against 1/2 and 1 BEFORE renaming — the check that
 *    catches a tops-and-bottoms answer without doing the arithmetic twice.
 *  - Situations: combine (jug/recipe), part-whole (plot/day), measurement
 *    (trail/ribbon), sharing (tray) — structure-distinct, not noun-swaps.
 *  - SEED-INVARIANT hints: fixed, role-based, name-free / number-free; rung-1 an
 *    algorithm-free orienting question; every core generator reused ≤ 2×.
 */

import { asWarmup, classify, fracAddSubLike, fracCompareChoice, fracEquivFill, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { addFrac, formatFrac, subFrac } from '../lib/compute';
import { partitionWord } from '../lib/format';
import { barModel } from '../lib/figures';
import { ge, makeWeekBuilder } from '../lib/assemble';

const C15 = { level: 'C' as const, week: 15 };
const C16 = { level: 'C' as const, week: 16 };
const D9 = { level: 'D' as const, week: 9 };
const D10 = { level: 'D' as const, week: 10 };

const NAMES = ['Yusuf', 'Nadia', 'Otto', 'Bea', 'Ines', 'Rafa', 'Suki', 'Marta', 'Emre', 'Livia', 'Dario', 'Wren'] as const;

/**
 * Denominator pairs, deliberately in two families the week must contrast:
 *  - NESTED: one bottom divides the other, so only ONE fraction is re-cut (2&8, 3&6…)
 *  - CROSSED: neither divides the other, so BOTH are re-cut (3&4, 4&6, 5&2…)
 * Both families appear in every pack — the discrimination items depend on it.
 */
const NESTED: Array<[number, number]> = [[2, 8], [3, 6], [2, 6], [5, 10], [4, 8], [2, 4], [3, 12], [4, 12]];
const CROSSED: Array<[number, number]> = [[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [4, 10], [6, 8], [3, 8]];

const lcm = (a: number, b: number): number => {
  const g = (x: number, y: number): number => (y === 0 ? x : g(y, x % y));
  return (a * b) / g(a, b);
};

// --- Retrieval warm-ups (prior-week skills; exempt from the pedagogical gates) --
// Three distinct formats (§6.14): fill-the-equivalent, compare-choice, like-denominator ±.
const wEquiv = asWarmup(fracEquivFill(), D9);
const wCompare = asWarmup(fracCompareChoice(), C16);
const wLike = asWarmup(fracAddSubLike(1), D10);

// --- Single-step unlike-denominator situations (fixed, role-based, name-free hints)
const sCombinePour = situation({
  situationType: 'combine', cognitiveOp: 'frac-add-unlike',
  draw: (r) => {
    const [d1, d2] = r.pick([...CROSSED, ...NESTED]);
    const n1 = r.int(1, d1 - 1); const n2 = r.int(1, d2 - 1);
    const name = r.pick(NAMES);
    const drink = r.pick(['apple juice', 'lemonade', 'barley water', 'ginger cordial']);
    return {
      prompt: `${name} pours ${n1}/${d1} of a litre of ${drink} into a jug, then ${n2}/${d2} of a litre more. How much is in the jug now?`,
      answerValue: formatFrac(addFrac({ n: n1, d: d1 }, { n: n2, d: d2 })),
      templateId: 'd_frac_unlike_v1', params: { n1, d1, n2, d2, op: 1 }, units: 'litre', validation: 'equivalent-fraction',
      hints: ['Are these two amounts measured in the same size of piece, or in two different sizes?', 'Re-name both into one shared size of piece, then count.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const sMeasureLeft = situation({
  situationType: 'measurement', cognitiveOp: 'frac-sub-unlike',
  draw: (r) => {
    const [dSmall, dBig] = r.pick([...CROSSED, ...NESTED]);
    // Keep the difference positive without leaning on a retry loop.
    const n1 = dBig - 1; const d1 = dBig; const n2 = 1; const d2 = dSmall;
    const name = r.pick(NAMES);
    const unit = r.pick(['kilometre', 'mile']);
    return {
      prompt: `A towpath walk is ${n1}/${d1} of a ${unit} long. ${name} has already walked ${n2}/${d2} of a ${unit} of it. How much of the walk is still ahead?`,
      answerValue: formatFrac(subFrac({ n: n1, d: d1 }, { n: n2, d: d2 })),
      templateId: 'd_frac_unlike_v1', params: { n1, d1, n2, d2, op: -1 }, validation: 'equivalent-fraction',
      hints: ['Can you take one amount from the other while the two are cut into different sizes?', 'Give both distances the same size of piece first, then take one count from the other.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const sPartWholePlot = situation({
  situationType: 'part-whole', cognitiveOp: 'frac-add-unlike',
  draw: (r) => {
    // NESTED pairs only, and the two planted parts may never exceed the plot:
    // d1 divides d2, so n1 is worth n1·k pieces of size 1/d2 and n2 takes what is left.
    const [d1, d2] = r.pick(NESTED);
    const k = d2 / d1;
    const n1 = r.int(1, d1 - 1);
    const n2 = r.int(1, d2 - n1 * k);
    const name = r.pick(NAMES);
    const crop = r.pick(['onions', 'squash', 'leeks', 'rhubarb']);
    return {
      prompt: `${name} divides one allotment plot into ${partitionWord(d1)} for the big crops and into ${partitionWord(d2)} for everything else. ${n1}/${d1} of the plot holds ${crop} and ${n2}/${d2} of it holds herbs. What fraction of the plot is planted altogether?`,
      answerValue: formatFrac(addFrac({ n: n1, d: d1 }, { n: n2, d: d2 })),
      templateId: 'd_frac_unlike_v1', params: { n1, d1, n2, d2, op: 1 }, validation: 'equivalent-fraction',
      hints: ['One of these two piece-sizes fits neatly inside the other — which way round does the re-cutting go?', 'Re-name the larger piece into the smaller one, then add the counts.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const sSharingTray = situation({
  situationType: 'sharing', cognitiveOp: 'frac-sub-unlike',
  draw: (r) => {
    const [dSmall, dBig] = r.pick(CROSSED);
    const n1 = dBig - 1; const d1 = dBig; const n2 = 1; const d2 = dSmall;
    const name = r.pick(NAMES);
    const bake = r.pick(['tray of flapjack', 'sheet of focaccia', 'tray of brownie']);
    return {
      prompt: `A ${bake} is left over after the fair. ${n1}/${d1} of it comes home, and ${name} gives ${n2}/${d2} of the whole tray to a neighbour. What fraction of the tray is left?`,
      answerValue: formatFrac(subFrac({ n: n1, d: d1 }, { n: n2, d: d2 })),
      templateId: 'd_frac_unlike_v1', params: { n1, d1, n2, d2, op: -1 }, validation: 'equivalent-fraction',
      hints: ['Neither piece-size fits inside the other here — so what has to happen to both of them?', 'Cut both into a size they share, then take the given-away count off.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// Metacognition base: served ONLY through the estimate wrapper (the 1/2-and-1 check).
const meBase = situation({
  situationType: 'combine', cognitiveOp: 'frac-add-unlike',
  draw: (r) => {
    const [d1, d2] = r.pick(CROSSED);
    const n1 = r.int(1, d1 - 1); const n2 = r.int(1, d2 - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} mixes ${n1}/${d1} of a tub of blue paint with ${n2}/${d2} of a tub of white. How much paint is mixed in all?`,
      answerValue: formatFrac(addFrac({ n: n1, d: d1 }, { n: n2, d: d2 })),
      templateId: 'd_frac_unlike_v1', params: { n1, d1, n2, d2, op: 1 }, units: 'tub', validation: 'equivalent-fraction',
      hints: ['Compare each amount to half a tub before you touch the arithmetic — what does that tell you about the total?', 'Now re-name both into one shared piece-size and add the counts.'],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});
const meEstimate = withEstimateFirst(meBase, 'is each amount above or below one half, and so should the total land under one tub or over it?');

// --- Multi-step unlike-denominator chains (≥2 ops each; fixed name-free hints) ---
const msJug = multiStep({
  situationType: 'combine', cognitiveOp: 'multi-step',
  draw: (r) => {
    const [d1, d2] = r.pick(CROSSED);
    const n1 = r.int(1, d1 - 1); const n2 = r.int(1, d2 - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `A jug holds ${n1}/${d1} of a litre of squash. ${name} tops it up with ${n2}/${d2} of a litre of water, then pours 1/${d1} of a litre into a glass. How much is left in the jug?`,
      initN: n1, initD: d1, steps: [{ op: 'add', n: n2, d: d2 }, { op: 'sub', n: 1, d: d1 }], units: 'litre', validation: 'equivalent-fraction',
      hints: ['Does the question ask about one pour, or about what is standing in the jug after all of them?', 'Work the changes in the order they happen, giving the pieces a shared size each time they meet.'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

const msDay = multiStep({
  situationType: 'part-whole', cognitiveOp: 'multi-step',
  draw: (r) => {
    const [d1, d2] = r.pick(NESTED);
    const n1 = 1; const n2 = 1;
    const name = r.pick(NAMES);
    return {
      prompt: `${name} plans one whole afternoon. ${n1}/${d1} of it goes on homework and ${n2}/${d2} of it on football practice. What fraction of the afternoon is still free?`,
      initN: 1, initD: 1, steps: [{ op: 'sub', n: n1, d: d1 }, { op: 'sub', n: n2, d: d2 }], validation: 'equivalent-fraction',
      hints: ['Is the whole afternoon staying whole, or is it being spent piece by piece?', 'Start from one whole and take each spent piece away, re-naming as you go.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

const msLegs = multiStep({
  situationType: 'measurement', cognitiveOp: 'multi-step',
  draw: (r) => {
    const [d1, d2] = r.pick(CROSSED);
    const n1 = r.int(1, d1 - 1); const n2 = r.int(1, d2 - 1);
    const name = r.pick(NAMES);
    return {
      prompt: `${name} cycles ${n1}/${d1} of a mile to the bridge, ${n2}/${d2} of a mile to the lock, then 1/${d2} of a mile home. How far did ${name} cycle altogether?`,
      initN: n1, initD: d1, steps: [{ op: 'add', n: n2, d: d2 }, { op: 'add', n: 1, d: d2 }], units: 'mile', validation: 'equivalent-fraction',
      hints: ['Do you want the longest leg, or the whole journey once every leg is counted?', 'Add the legs one at a time; two legs already share a size, the other must be re-named.'],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

// --- Discrimination 1: needs-renaming vs already-same-size --------------------
const discNeedsRenaming = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const [d1, d2] = r.pick(CROSSED);
    const n1 = r.int(1, d1 - 1); const n2 = r.int(1, d2 - 1);
    const dSame = r.pick([5, 7, 9, 11]);
    const a = r.int(1, dSame - 2); const b = r.int(1, dSame - 1 - a);
    return {
      prompt: `Two sums are waiting: ${n1}/${d1} + ${n2}/${d2}, and ${a}/${dSame} + ${b}/${dSame}. Which one can be counted straight away, with no re-cutting at all?`,
      correct: `${a}/${dSame} + ${b}/${dSame}`,
      distractors: [
        { text: `${n1}/${d1} + ${n2}/${d2}`, errorTag: 'representation-misread', rationale: 'Picks the sum whose bottoms differ — those pieces are different sizes and cannot be counted together yet.' },
        { text: 'both of them, since every pair of fractions can be added as it stands', errorTag: 'concept-misconception', rationale: 'The tops-and-bottoms belief in its purest form: treats two fractions as two pairs of whole numbers.' },
      ],
      hints: ['What has to be true about two amounts before you are allowed to count them together?', 'Look only at the bottom numbers and ask which pair already names the same-size piece.'],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// --- Discrimination 2: any common denominator vs only the least ---------------
const discAnyCommon = discrimination({
  variant: 'structural', cognitiveOp: 'structural-contrast',
  draw: (r) => {
    const [d1, d2] = r.pick(CROSSED);
    const least = lcm(d1, d2);
    const bigger = d1 * d2 === least ? least * 2 : d1 * d2;
    const notCommon = least + 1;
    return {
      prompt: `To add ${1}/${d1} and ${1}/${d2}, which piece-sizes could you legally re-name both fractions into?`,
      correct: `${least} or ${bigger} — both work`,
      distractors: [
        { text: `only ${least}`, errorTag: 'concept-misconception', rationale: 'Believes the LEAST common denominator is the only legal one; any common multiple works, the least merely keeps the numbers small.' },
        { text: `${notCommon}`, errorTag: 'procedure-slip', rationale: 'Not a multiple of both bottoms, so neither fraction can be re-named into it exactly.' },
      ],
      hints: ['What must a new piece-size be able to do for BOTH of the old ones?', 'Test each offered size: does each of the two bottoms divide into it exactly?'],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// --- Day-5 error-analysis (generated; QG-11 re-derives truth AND the shown wrong)
const eaTopsBottoms = errorAnalysis({
  verifyTemplateId: 'd_verify_frac_v1', cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const [d1, d2] = r.pick(CROSSED);
    return { n1: r.int(1, d1 - 1), d1, n2: r.int(1, d2 - 1), d2, op: '+', wrongMode: 'tops-bottoms' };
  },
  build: (v, p) => ({
    prompt: `A student worked out ${p.n1}/${p.d1} + ${p.n2}/${p.d2} by adding the two tops and then the two bottoms, and wrote ${v.wrong}.`,
    extension: 'Show with one bar picture why that answer cannot be right — compare it with the larger of the two amounts — then write the true sum.',
    hints: ['Should joining two amounts ever leave you with less than one of them on its own?', 'Re-name both into a shared piece-size, then count; compare that with what the student wrote.'],
    errorTags: ['concept-misconception', 'representation-misread'],
  }),
});

export const buildD17 = makeWeekBuilder({
  week: 17,
  conceptId: 'frac-addsub-unlike-denominators',
  conceptName: 'Adding & subtracting fractions (unlike denominators)',
  strandTags: ['decimals-fractions'],
  prerequisiteWeeks: [C15, D9, D10],
  pedagogyContract: 'v2',
  conceptualAnchor: 'naming wall',
  deepeningDelta:
    'D10 added and subtracted fractions that already shared a denominator, so the counting was immediate; D17 removes that gift. The pieces now arrive in two different sizes, and the work moves one step earlier — deciding what single size both amounts can be re-named into (D9\'s equivalence, used as a tool rather than an answer) before any counting is legal at all.',
  explanation: {
    hook: 'Thirds and quarters will not be counted together. Not because the arithmetic is hard — because "one third and one quarter" names two different-sized pieces, and there is no such thing as counting two different pieces as one number. First you re-name. Then you count.',
    whyBeforeHow:
      'A fraction counts pieces of one particular size, and its bottom number names that size. Two fractions with different bottoms are counting different things, so they run into a naming wall: nothing can be added until both are re-named into one shared size. Equivalence is what gets you over the wall — 1/3 and 1/4 both live comfortably as twelfths, because twelve is a size that three and four both divide into. Any such shared size is legal; the least one simply keeps the numbers small. Once both amounts wear the same size of piece, the week you already know takes over: count the tops, keep the shared bottom. The slip this week exists to kill is adding the bottoms as well as the tops — it looks like arithmetic, but it quietly swaps the piece-size mid-count, and it can hand you a total smaller than one of the amounts you started with.',
    script: [
      {
        say: 'Watch the wall first. I want 1/3 + 1/4. I lay a third-bar beside a quarter-bar and try to count them as one number — and I cannot, because they are not the same size. So I look for a size they both fit: twelfths. 1/3 is 4/12, 1/4 is 3/12.',
        visual: 'A third-bar and a quarter-bar drawn above a twelfths ruler, each re-named on it — the third as 4/12, the quarter as 3/12.',
        figure: barModel(
          [
            { label: '1/3 = 4/12', segments: [{ value: 4 }] },
            { label: '1/4 = 3/12', segments: [{ value: 3 }] },
            {
              label: 'the twelfths ruler',
              segments: [
                { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 },
                { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 },
              ],
            },
          ],
          { scaleMax: 12, alt: 'a third-bar and a shorter quarter-bar drawn above a full ruler of twelve equal twelfths, so the third covers four of them and the quarter covers three' },
        ),
      },
      {
        say: 'Now the counting is the easy part, and it is last, not first: four twelfth-pieces and three twelfth-pieces make seven twelfth-pieces, 7/12. Notice the bottom I kept is the shared one — twelfths — not three plus four.',
        visual: 'Seven twelfth-pieces on one bar — four, then three more — braced and labelled 7/12.',
        figure: barModel(
          [
            {
              segments: [
                { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 },
                { value: 1, fill: 'soft' }, { value: 1, fill: 'soft' }, { value: 1, fill: 'soft' },
              ],
            },
          ],
          { scaleMax: 12, brace: { label: '7/12' }, alt: 'a bar of twelve places carrying seven twelfth-pieces, four in one shade and three in another, braced underneath and labelled 7/12' },
        ),
      },
      {
        say: 'And I estimate before I ever start, to protect myself: 1/3 is under a half, 1/4 is under a half, so the total must stay under one whole. If my answer came out at 2/7, I would stop — 2/7 is smaller than the 1/3 I started with, and joining things cannot shrink them.',
        visual: 'The two under-half bars added into seven twelfths, a full bar beneath for comparison, and a hatched 2/7 bar shorter than the third it started from.',
        figure: barModel(
          [
            {
              label: '1/3 + 1/4',
              segments: [
                { value: 1 }, { value: 1 }, { value: 1 }, { value: 1 },
                { value: 1, fill: 'soft' }, { value: 1, fill: 'soft' }, { value: 1, fill: 'soft' },
              ],
            },
            { label: 'one whole', segments: [{ value: 12 }] },
            { label: '2/7', segments: [{ value: 24 / 7, fill: 'hatch' }] },
          ],
          { scaleMax: 12, alt: 'a bar of seven twelfths, a full bar below it, and a short hatched bar for 2/7 that stops before even the four twelfths the first bar started from' },
        ),
      },
    ],
    summary: 'Different bottoms mean different-sized pieces, and different-sized pieces cannot be counted together. Re-name both into a shared size — any common one works, the least is tidiest — then count the tops and keep that shared bottom. Estimate against 1/2 and 1 first, and simplify at the end.',
    vocabulary: [
      { term: 'unlike denominators', kidGloss: 'different-sized pieces, not ready to count yet' },
      { term: 'common denominator', kidGloss: 'one size of piece that both fractions can be re-named into' },
      { term: 'equivalent fraction', kidGloss: 'the same amount, written in a different size of piece' },
      { term: 'least common denominator', kidGloss: 'the smallest shared size — tidy, but not the only one allowed' },
    ],
  },
  guidedExamples: [
    ge(17, 1, 'modeled', '1/2 + 1/6.', [
      { teacherSay: 'I notice the two bottoms are different, so I am not allowed to count yet. I check whether one size fits inside the other — sixths are smaller than halves, and two goes into six, so I can re-name the half as sixths and leave the other alone.' },
      { teacherSay: 'One half re-named into sixths is how many sixths — and then what is the total?', expected: '2/3' },
    ], '2/3'),
    ge(17, 2, 'completion', '3/4 − 2/3.', [
      { teacherSay: 'Neither bottom divides the other here. What size of piece do three and four both fit into, and what do the two amounts become?', expected: 'twelfths; 9/12 and 8/12' },
      { childDo: 'Take one count from the other and read off the answer.', expected: '1/12' },
    ], '1/12'),
    ge(17, 3, 'prompted', '2/5 + 1/2, and say which shared size you chose and why.', [
      { childDo: 'Re-name both, add the counts, keep the shared bottom.', expected: '9/10' },
    ], '9/10'),
    ge(17, 4, 'independent', 'A tank is 5/6 full. You draw off 1/4 of a tank. How much is left? Solve cold, and estimate first.', [
      { childDo: 'Estimate against one half, then re-name both into a shared size and subtract.', expected: '7/12' },
    ], '7/12'),
  ],
  days: [
    // Day 1 — concept echo: the wall, on single-step problems (nested and crossed both appear)
    [
      { gen: wEquiv, diff: 2 },
      { gen: wCompare, diff: 2 },
      { gen: wLike, diff: 2 },
      { gen: sCombinePour, diff: 3 },
      { gen: sPartWholePlot, diff: 3 },
      { gen: sMeasureLeft, diff: 3 },
    ],
    // Day 2 — estimate-first metacognition + the first discrimination + a chain
    [
      { gen: wEquiv, diff: 2 },
      { gen: wLike, diff: 2 },
      { gen: meEstimate, diff: 3 },
      { gen: discNeedsRenaming, diff: 3 },
      { gen: msJug, diff: 4 },
      { gen: sSharingTray, diff: 3 },
    ],
    // Day 3 — the any-common-denominator insight, interleaved with multi-step
    [
      { gen: wCompare, diff: 2 },
      { gen: sCombinePour, diff: 3 },
      { gen: discAnyCommon, diff: 4 },
      { gen: discNeedsRenaming, diff: 4 },
      { gen: msDay, diff: 4 },
      { gen: sMeasureLeft, diff: 4 },
    ],
    // Day 4 — multi-step word problems (3 of 4 multi-step; ≥3 situation types week-wide)
    [
      { gen: msLegs, diff: 4 },
      { gen: msJug, diff: 5 },
      { gen: msDay, diff: 4 },
      { gen: sSharingTray, diff: 4 },
    ],
    // Day 5 — non-computational: error-analysis + the two-denominators write-up + ASN
    [
      { gen: eaTopsBottoms, diff: 4 },
      {
        gen: reasoning({
          prompt: 'Take 1/2 + 1/3. Work it out twice: once by re-naming both into sixths, and once by re-naming both into twelfths. Write both answers down, say whether they are the same amount, and explain in one sentence why choosing a different shared size cannot change the answer.',
          value: 'both routes give the same amount (3/6 + 2/6 = 5/6 and 6/12 + 4/12 = 10/12, and 10/12 is 5/6); re-naming changes only the size of the pieces being counted, never how much there is',
          acceptableForms: ['5/6', '10/12', 'same', 'equivalent'],
          keywords: true,
          hints: ['Does re-cutting a cake into more slices change how much cake there is?', 'Say what re-naming changes and what it leaves alone.'],
          errorTags: ['concept-misconception'],
        }),
        diff: 4,
      },
      {
        gen: classify({
          prompt: 'Always, sometimes, or never true: when you add two fractions whose bottoms are different, the bottom of the answer is the two bottoms added together. Explain how you know in one sentence.',
          correct: 'never',
          distractors: [
            { text: 'always', errorTag: 'concept-misconception', rationale: 'The tops-and-bottoms rule stated as law — it swaps the piece-size in the middle of the count.' },
            { text: 'sometimes', errorTag: 'representation-misread', rationale: 'Hedges on a rule that never holds: a sum of the two bottoms is not a size either fraction can be re-named into.' },
          ],
          hints: ['If you add the two bottoms, can each of the original pieces be re-named into that new size exactly?', 'Test it on a pair you know, and compare the answer with the amounts you started from.'],
          errorTags: ['concept-misconception', 'representation-misread'],
        }),
        diff: 3,
      },
    ],
  ],
  puzzle: () => ({
    id: 'D17-PZ-01',
    title: 'Puzzle Grove: The Shared-Size Ladder',
    puzzleType: 'logic',
    prompt: 'Three amounts are on the bench: 1/2 of a jar, 1/3 of a jar, and 1/4 of a jar. Find ONE size of piece that all three can be re-named into at once, write each amount in that size, and give the total. Then find a second size that also works for all three, and say what every size that works has in common.',
    answer: { value: 'twelfths work (6/12 + 4/12 + 3/12 = 13/12, or 1 1/12); twenty-fourths also work; every size that works is a common multiple of 2, 3 and 4', acceptableForms: ['13/12', '1 1/12', 'twelfths', 'common multiple'], validation: 'short-text-keyword' },
    hintLadder: ['A size that suits all three must be reachable from every one of the three bottoms — what does that make it?', 'Hunt for a number that 2, 3 and 4 all divide into, then re-name each amount into it.'],
    errorTags: ['concept-misconception', 'procedure-slip'],
  }),
  puzzleMeta: { stepCount: 3, cognitiveOp: 'common-multiple-search' },
  sprint: { skill: 'Adding & subtracting fractions with like denominators', sourceWeek: D10, itemCount: 20, scheduledDay: 3, templateId: 'mult_facts_v1', params: { factorRange: [3, 9] } },
  mastery: [
    { gen: sCombinePour, diff: 3 },
    { gen: msJug, diff: 4 },
    { gen: sMeasureLeft, diff: 3 },
    { gen: msDay, diff: 4 },
    { gen: sPartWholePlot, diff: 4 },
    { gen: msLegs, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step unlike-denominator ± (combine-pour, measurement-remaining, part-whole-plot — the re-name-then-count affordance preserved, with the nested and crossed denominator families both represented). 02/04/06: two-step chains (top-up-then-pour-off, whole-minus-two-parts, three legs summed). No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    { errorTag: 'concept-misconception', subtype: 'tops-and-bottoms', description: 'Adds the numerators and the denominators separately (1/3 + 1/4 read as 2/7), treating one fraction as two independent whole numbers and swapping the piece-size mid-count.', exampleWrongAnswer: '1/3 + 1/4 answered as 2/7', distractorRationale: 'Offer (a+c)/(b+d) on unlike-denominator choices.', reteachPointer: 'explanation/script[2] (a joined amount cannot be smaller than a piece of it)' },
    { errorTag: 'procedure-slip', subtype: 'renamed-one-side-only', description: 'Finds a shared size but re-names only one of the two fractions, or scales the bottom without scaling the top, then counts.', exampleWrongAnswer: '1/2 + 1/6 answered as 2/6', distractorRationale: 'Offer the result of counting after only one side was re-named.', reteachPointer: 'guidedExamples/D17-GE-01 (both amounts must reach the shared size)' },
    { errorTag: 'representation-misread', subtype: 'kept-a-wrong-bottom', description: 'Counts correctly but writes an answer over a bottom that is neither the shared size nor a legal re-naming — commonly one of the two original bottoms.', exampleWrongAnswer: '3/4 − 2/3 answered as 1/4', distractorRationale: 'Offer the correct count over an original denominator.', reteachPointer: 'explanation/script[1] (the bottom you keep is the shared one)' },
    { errorTag: 'task-comprehension', subtype: 'stopped-at-step-one', description: 'Re-names both fractions correctly and then answers with the renamed amount, or answers one leg of a multi-step chain instead of the state after every change.', exampleWrongAnswer: 'gives 4/12 when the question asked for 4/12 + 3/12', distractorRationale: 'Offer the intermediate value as a near-answer.', reteachPointer: 'guidedExamples/D17-GE-04 (read what the question is asking for)' },
  ],
  parentSummarySeed: {
    whatWeWorkedOn: 'Adding and subtracting fractions whose bottom numbers differ — recognising that different-sized pieces cannot be counted together, re-naming both amounts into one shared size, estimating against a half and a whole to check, and simplifying at the end.',
    improvingCandidates: ['spotting when two fractions are not ready to be counted together', 'finding a size of piece both fractions can be re-named into', 'estimating the answer before doing the arithmetic'],
    strengtheningByTag: [
      { errorTag: 'concept-misconception', text: 'NOT adding the bottom numbers — the estimate check makes that slip visible, because it produces a total smaller than the amounts you started with' },
      { errorTag: 'procedure-slip', text: 'renaming BOTH fractions, not just one, and scaling top and bottom together' },
      { errorTag: 'representation-misread', text: 'keeping the shared bottom in the answer rather than one of the two originals' },
      { errorTag: 'task-comprehension', text: 'carrying a two-step story all the way to the end instead of stopping at the renaming' },
    ],
    homeFocus: {
      praiseLine: 'You checked whether the pieces were the same size before adding, then renamed both into one shared size — that pause and that move are the whole skill this week.',
      questionForChild: 'Why can 1/2 and 1/3 not be counted together as they are, and what do you do about it?',
      schoolSyncHook: 'If your child\'s class insists on the LEAST common denominator every time, tell us — we teach that any shared size is legal and the least is simply tidiest, and we can match the school\'s habit.',
    },
    vocabularyForParent: ['unlike denominators (different-sized pieces)', 'common denominator (a shared piece-size)', 'equivalent fraction (same amount, different-sized pieces)', 'least common denominator (the smallest shared size)'],
  },
});
