/**
 * Level C · Week 23 — "Scaled graphs" (conceptId: scaled-graphs).
 *
 * FILL-ARCHITECTURE §5 row C23: anchor "the key tells the worth"; multi-step
 * "read two, combine"; error-analysis "3 symbols read as 3 (ignores scale 5)";
 * discrimination "symbol count vs value"; Day-5 signature "build a scaled graph
 * question". Family G7 (`lib/stats.ts`).
 *
 * The week's whole claim is that a symbol on a scaled display is a PLACEHOLDER
 * for a group, not a tally mark, so the content is built to force that reading
 * rather than decorate it:
 *  - the recipe discrimination (`symbolCountVsValue`) sits beside a second one
 *    written here — two displays of the same thing whose KEYS differ, where the
 *    row with MORE symbols stands for FEWER things. That is the misleading-graph
 *    seed the catalog names, and the Day-5 Always/Sometimes/Never item is where
 *    "more symbols means more" finally gets its honest hearing;
 *  - a generated error-analysis whose shown wrong number is the genuine output
 *    of the week's defining misconception — the student's COUNT is correct (the
 *    row really does hold that many symbols), which is exactly why the item
 *    cannot be answered by re-counting;
 *  - six two-step items, including one posed inverse-start: the display states
 *    an AMOUNT and the child has to work back to how many symbols the row needs.
 *    That is the "build a scaled graph" direction, and it is the half of the
 *    concept a read-only week never touches;
 *  - a `has-distractor` two-step (a number on the same wall that counts
 *    something else), because a display page is exactly where "use all the
 *    numbers" is easiest to learn by accident.
 *
 * ⚠ FIGURE GAP — reported, not worked around (and see `lib/stats.ts` header).
 * The ten figure primitives include NO bar chart, pictograph or tally chart, so
 * THE DISPLAY ITSELF IS NOT DRAWN ANYWHERE IN THIS WEEK. Every graph read here
 * computes off explicit `counts` / `key` / `index` params carried in the item's
 * own `generator.params` and states the display in prose; no primitive was
 * invented and none was bent into pretending to be a chart. What the figures DO
 * draw is the one thing a strip and a number line can say honestly: WHAT ONE
 * SYMBOL IS WORTH. On an assessed item that is a GIVEN (the key is printed on
 * the page), asserted against the item's own `key` param — never the row value
 * the item asks for. The pictures that show a whole row being turned into an
 * amount live where the answer is already on the page: the lesson script and the
 * guided examples.
 *
 * Retrieval is backward-only into B23 (bar graphs and line plots — the same
 * displays with every key silently equal to one, which is precisely the habit
 * this week has to break), C7 skip counting by 2s/5s/10s (the keys ARE those
 * three numbers), and C2/C3/C12.
 */

import { addWhole, asWarmup, classify, compareWhole, multiply, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
// MUST be imported BEFORE '../lib/stats': erroranalysis.ts pulls in the template
// registry, and the registry spreads STATS_TEMPLATE_DEFS at module-evaluation
// time. Entering lib/stats FIRST therefore re-enters it through the registry
// while its own defs array is still in its temporal dead zone, and the week
// throws on import. Reported upward — it is a real trap for every future G7
// consumer (B23, E21–E23), and it belongs in erroranalysis.ts's lazy-lookup
// note, not in a week file.
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsAnswer, assertsParam, barModel, counters, numberLine } from '../lib/figures';
import {
  distinctSet,
  graphRead,
  msGraphCombineWithKey,
  symbolCountVsValue,
  tallestVsAskedBar,
} from '../lib/stats';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('C');

const B23 = { level: 'B' as const, week: 23 };
const C2 = { level: 'C' as const, week: 2 };
const C3 = { level: 'C' as const, week: 3 };
const C7 = { level: 'C' as const, week: 7 };
const C12 = { level: 'C' as const, week: 12 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

/** The keys a Level-C display may carry — 2s, 5s and 10s are C7's skip counts. */
const KEYS = [2, 5, 10] as const;

/**
 * What a display counts, bound to the symbol its key uses. The same four pairs
 * `lib/stats.ts` draws from, deliberately: across a whole week the child should
 * meet ONE display language, not eight.
 */
const DISPLAY_SUBJECTS = [
  { thing: 'books', symbol: 'stars' },
  { thing: 'laps', symbol: 'circles' },
  { thing: 'tickets', symbol: 'squares' },
  { thing: 'litres', symbol: 'drops' },
] as const;

/**
 * Subjects that can also be ADDED TO or TAKEN FROM after the display is drawn,
 * with the clause each one needs. Container and contents travel as ONE bound
 * pair, so "8 laps were returned to the library" can never be assembled.
 */
const CHANGE_FRAMES = [
  { thing: 'books', symbol: 'stars', gone: 'were returned to the library', arrived: 'were finished', spare: 'posters' },
  { thing: 'tickets', symbol: 'squares', gone: 'were handed back', arrived: 'were sold at the door', spare: 'posters' },
  { thing: 'litres', symbol: 'drops', gone: 'were poured out onto the garden', arrived: 'were collected', spare: 'watering cans' },
] as const;

// ---------------------------------------------------------------------------
// withFigure — attach a picture built from the item's OWN generator params.
//
// The shipped primitives (situation / multiStep / discrimination) have no figure
// slot, and lib/ is not ours to edit, so this wrapper does what `withEstimateFirst`
// does: it works entirely inside the returned closure, takes no new rng draw, and
// leaves the prompt (and therefore the QG-1/QG-4 surface signature) untouched. It
// reads the drafted item's `generator.params` — the very numbers the answer was
// computed from — so the figure law ("built from the item's own drawn values")
// holds by construction. (Pattern copied from c06/c05, the Level-C exemplars.)
// ---------------------------------------------------------------------------

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

/**
 * The key, drawn as ONE step on an honest ruler: from 0 to what a single symbol
 * is worth. The line's length depends ONLY on the key, never on the row the
 * question names, so it cannot leak the amount the item asks for — it states the
 * given the display already prints at the bottom of the page.
 */
function keyStepFigure(p: Params): BBFigure {
  const key = numOf(p, 'key');
  const max = key * 5;
  return numberLine(
    {
      min: 0,
      max,
      step: key,
      labels: 'majors',
      marks: [{ at: key, label: String(key), style: 'flag' }],
      hops: [{ from: 0, to: key, label: 'one symbol' }],
    },
    {
      alt: `a number line from 0 to ${max} counted in steps of ${key}, with the very first step marked — what one symbol on this display is worth`,
      asserts: assertsParam('key', 'mark:0'),
    },
  );
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * B23 — a bar graph read, where the height IS the amount. This is the display
 * the child already owns, and putting it on Day 1 is what makes the week's new
 * sentence ("each symbol stands for more than one") land as a CHANGE rather than
 * as a rule out of nowhere.
 */
const wBarRead = asWarmup(graphRead('value', 'bar'), B23);

/** B23 — its discrimination too: the bar that stands out vs the bar named. */
const wTallestBar = asWarmup(tallestVsAskedBar(), B23);

/** C7 — skip counting by 2s, 5s and 10s: the keys this week uses, and the move. */
const wSkipCount = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'multiple',
    draw: (r) => {
      const step = r.pick(KEYS);
      const k = r.int(4, 6);
      const shown = Array.from({ length: k - 1 }, (_, i) => String(step * (i + 1))).join(', ');
      return {
        prompt: `${one(r)} counts on in ${step}s: ${shown}. What number comes next?`,
        answerValue: String(step * k),
        templateId: 'd_multiple_v1',
        params: { base: step, k },
        hints: ['What is the same jump from each number to the next one?', 'Add that jump to the last number in the list.'],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  C7,
);

/** C12 — multiplication facts, the arithmetic a keyed row turns into. */
const wFacts = asWarmup(multiply(3, 9, 2, 9), C12);

/** C3 — addition within 1,000, for the totals a whole display adds up to. */
const wAdd = asWarmup(addWhole(105, 480), C3);

/** C2 — compare, so "which row stands for more" keeps its meaning. */
const wCompare = asWarmup(compareWhole(3), C2);

// ---------------------------------------------------------------------------
// Single-step reads — the three things a scaled display can be asked
// ---------------------------------------------------------------------------

/**
 * The anchor read: one named row, turned into its amount. `graphRead` never
 * names the longest row, so the tallest-row misread produces a genuinely
 * different number. Figure = the key's one step (see `keyStepFigure`).
 */
const readScaledRow = withFigure(graphRead('value', 'pictograph'), keyStepFigure);

/** "How many more" — the comparison read, in the key's units rather than symbols. */
const readHowManyMore = graphRead('difference', 'pictograph');

/**
 * The read run backwards: the amount is stated and the ROW has to be built.
 * This is the half of the concept a read-only week never touches, and it is the
 * computational sibling of the Day-5 production task.
 */
const buildRowFromTotal = situation({
  situationType: 'sharing',
  cognitiveOp: 'graph-build',
  draw: (r) => {
    const s = r.pick(DISPLAY_SUBJECTS);
    const key = r.pick(KEYS);
    const symbols = r.int(3, 9);
    const total = key * symbols;
    const day = r.pick(DAYS);
    return {
      prompt: `A pictograph of ${s.thing} is being drawn. Each ${unitFor(1, s.symbol)} on it stands for ${countNoun(key, s.thing)}. On ${day} the class counted ${countNoun(total, s.thing)} altogether. How many ${unitFor(2, s.symbol)} should ${day}'s row show?`,
      answerValue: String(symbols),
      templateId: 'd_div_v1',
      params: { a: total, b: key },
      units: s.symbol,
      hints: [
        'Does one symbol on this display carry one thing, or a whole group of them?',
        'Work out how many groups of that size the total is made of.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * The whole display at once — every row gathered, then the key applied. Served
 * ONLY through the estimate-first wrapper (kit §E2.2: the wrapper does not
 * change the hint ladder, so a generator used both raw and wrapped would emit
 * two identical ladders and burn the dedup budget).
 *
 * The probe is a genuine call and it is the week's central check: with a key
 * bigger than one, the amount MUST come out above the symbol count, so a child
 * who predicts "fewer" has already caught their own misreading.
 */
const readWholeDisplay = situation({
  situationType: 'part-whole',
  cognitiveOp: 'graph-total',
  draw: (r) => {
    const s = r.pick(DISPLAY_SUBJECTS);
    const labels = r.shuffle([...DAYS]).slice(0, 3);
    const counts = distinctSet(r, 3, 2, 8);
    const key = r.pick(KEYS);
    return {
      prompt: `A pictograph of ${s.thing} shows ${labels[0]} with ${countNoun(counts[0], s.symbol)}. ${labels[1]} has ${countNoun(counts[1], s.symbol)}, and ${labels[2]} has ${countNoun(counts[2], s.symbol)}. Each ${unitFor(1, s.symbol)} stands for ${countNoun(key, s.thing)}. How many ${s.thing} does the whole display stand for?`,
      answerValue: String((counts[0] + counts[1] + counts[2]) * key),
      templateId: 'stat_graph_total_v1',
      params: { counts, key },
      units: s.thing,
      hints: [
        'How many rows does this question reach across — one of them, or every one?',
        'Gather the symbols from every row. Then let the key turn that gathering into an amount.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});
const readWholeDisplayEstimate = withEstimateFirst(
  readWholeDisplay,
  'will the whole display stand for more things than symbols, or fewer?',
);

// ---------------------------------------------------------------------------
// Multi-step — the recipe's "read two, combine", plus its three siblings
// ---------------------------------------------------------------------------

/** The recipe row: two entries gathered, then the key applied (from G7). */
const msTwoRowsTotal = msGraphCombineWithKey();

/** Read a row in full, then a change to the AMOUNT it stands for. */
const msRowThenChange = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'graph-combine',
  draw: (r) => {
    const f = r.pick(CHANGE_FRAMES);
    const key = r.pick(KEYS);
    const symbols = r.int(3, 7);
    const day = r.pick(DAYS);
    // Never more than the row holds, and never all of it: an answer of nothing
    // ends the story rather than continuing it.
    const gone = r.int(2, symbols * key - 3);
    return {
      prompt: `On a pictograph of ${f.thing}, each ${unitFor(1, f.symbol)} stands for ${countNoun(key, f.thing)}. ${day}'s row shows ${countNoun(symbols, f.symbol)}. After the display was drawn, ${countNoun(gone, f.thing)} ${f.gone}. How many of ${day}'s ${f.thing} are left?`,
      initN: symbols,
      steps: [
        { op: 'mul', n: key, d: 1 },
        { op: 'sub', n: gone, d: 1 },
      ],
      units: f.thing,
      hints: [
        'Is the second sentence changing symbols on the display, or changing the things themselves?',
        'Turn the row into its amount first, and only then take away what has gone.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * INVERSE-START. The number the story hands you is an AMOUNT — the result of a
 * row having already been read through the key — so the closing move is the
 * inverse: turn things back into symbols. Every word in the prompt is about
 * things, and the answer is measured in symbols, which is the whole reason the
 * key has to be read before anything is written.
 */
const msSymbolsForNewTotal = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'graph-build',
  posing: 'inverse-start',
  usesPriorSkill: true,
  draw: (r) => {
    const f = r.pick(CHANGE_FRAMES);
    const key = r.pick(KEYS);
    const total = key * r.int(2, 6);
    const more = key * r.int(1, 4);
    const day = r.pick(DAYS);
    return {
      prompt: `On a pictograph of ${f.thing}, ${day}'s row stood for ${countNoun(total, f.thing)}. Later that day another ${countNoun(more, f.thing)} ${f.arrived}. Each ${unitFor(1, f.symbol)} on the display stands for ${countNoun(key, f.thing)}. How many ${unitFor(2, f.symbol)} should ${day}'s row show now?`,
      initN: total,
      steps: [
        { op: 'add', n: more, d: 1 },
        { op: 'div', n: key, d: 1 },
      ],
      units: f.symbol,
      hints: [
        'Are the numbers in this story counting symbols, or counting things?',
        'Settle the new amount first. Then ask how many key-sized groups it takes.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

/**
 * The same two-step shape carrying a quantity that is NOT used
 * (PEDAGOGY-CEILING-REVIEW F3 `has-distractor`). A display wall is exactly where
 * a child meets numbers that count something else, and every item consuming
 * every number it states quietly teaches "use all the numbers".
 */
const msRowPlusSpare = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'graph-combine',
  posing: 'has-distractor',
  draw: (r) => {
    const f = r.pick(CHANGE_FRAMES);
    const key = r.pick(KEYS);
    const symbols = r.int(3, 7);
    const more = r.int(4, 19);
    const spare = r.int(2, 5);
    const day = r.pick(DAYS);
    return {
      prompt: `On a pictograph of ${f.thing}, each ${unitFor(1, f.symbol)} stands for ${countNoun(key, f.thing)}. ${day}'s row shows ${countNoun(symbols, f.symbol)}. After the display was drawn, another ${countNoun(more, f.thing)} ${f.arrived}. The same wall also carries ${countNoun(spare, f.spare)}. How many ${f.thing} is that in all?`,
      initN: symbols,
      steps: [
        { op: 'mul', n: key, d: 1 },
        { op: 'add', n: more, d: 1 },
      ],
      units: f.thing,
      hints: [
        'Which numbers on this wall count the thing the question asks about?',
        'Read the row through the key first. Then bring in only what was added.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination — the week's point, forced as a CHOICE
// ---------------------------------------------------------------------------

/** The recipe row: the symbol count vs the value the key gives it (from G7). */
const discrimSymbolVsValue = symbolCountVsValue();

/**
 * The second discrimination, and the misleading-graph seed the catalog names:
 * two displays of the same thing with DIFFERENT keys, where the row holding
 * MORE symbols need not stand for more things.
 *
 * WHICH DISPLAY WINS ROTATES, and one draw in three makes the two amounts equal.
 * The first version pinned the trap to one direction — `c1 > c2` while
 * `c1·k1 < c2·k2` on every seed — so that "the second display" was correct on
 * 60/60 exposures and BOTH other options were dead. That is a page a child
 * answers correctly, twice, without once multiplying a row by its key. Keeping
 * the trap live at every seed was the stated intent, and it is worth keeping;
 * what it must not do is keep the ANSWER fixed as well.
 *
 * All three branches still hold the trap open: the display with more symbols is
 * never the one to pick on trust, and on the equal branch the longer row is
 * still the wrong answer. The key is computed from the two products rather than
 * named per branch, so no branch can key the wrong display.
 * (Found by scripts/bb-answer-entropy-test.ts.)
 */
const discrimKeysDiffer = discrimination({
  variant: 'structural',
  cognitiveOp: 'compare-scaled-rows',
  draw: (r) => {
    const s = r.pick(DISPLAY_SUBJECTS);
    const day = r.pick(DAYS);
    const branch = r.int(1, 3); // 1 the second row wins · 2 the first row wins · 3 equal
    let k1: number, k2: number, c1: number, c2: number;
    if (branch === 1) {
      k1 = 2;
      k2 = r.pick([5, 10] as const);
      c1 = r.int(4, 9);
      // The floor makes the second row's amount STRICTLY larger, and c1 - 1 keeps
      // its symbol count strictly smaller — so "more symbols" and "more things"
      // point at different displays.
      c2 = r.int(Math.floor((c1 * k1) / k2) + 1, c1 - 1);
    } else if (branch === 2) {
      // The same trap mirrored: the big key sits on the FIRST display, so the
      // shorter row is the larger amount and the answer moves.
      k2 = 2;
      k1 = r.pick([5, 10] as const);
      c2 = r.int(4, 9);
      c1 = r.int(Math.floor((c2 * k2) / k1) + 1, c2 - 1);
    } else {
      // Genuinely equal, and still trapped: the first row shows more symbols and
      // stands for exactly the same amount. 5×2 = 2×5 and 10×2 = 4×5.
      k1 = 2;
      k2 = 5;
      c2 = r.pick([2, 4] as const);
      c1 = (c2 * k2) / k1;
    }
    // Both amounts, and therefore the answer, are computed — never named by the
    // branch that drew the numbers.
    const t1 = c1 * k1;
    const t2 = c2 * k2;
    const longer = c1 > c2 ? 'the first display' : 'the second display';
    const shorter = c1 > c2 ? 'the second display' : 'the first display';
    const keyed = t1 > t2 ? 'the first display' : t2 > t1 ? 'the second display' : 'both rows stand for the same amount';
    const OPTIONS: ReadonlyArray<{ text: string; errorTag: 'representation-misread' | 'concept-misconception'; rationale: string }> = [
      {
        text: longer,
        errorTag: 'representation-misread',
        rationale: 'Picks the longer row, which compares how much ink each row uses and leaves both keys out of the comparison.',
      },
      {
        text: shorter,
        errorTag: 'representation-misread',
        rationale: 'Picks the row with the bigger key on the assumption that a bigger key must win, without working either row into an amount.',
      },
      {
        text: 'both rows stand for the same amount',
        errorTag: 'concept-misconception',
        rationale: 'Treats the key as decoration, so two displays are read as though one symbol meant the same thing on both.',
      },
    ];
    return {
      prompt: `Two pictographs of ${s.thing} are pinned side by side. On the first, each ${unitFor(1, s.symbol)} stands for ${countNoun(k1, s.thing)}. ${day}'s row shows ${countNoun(c1, s.symbol)}. On the second, each ${unitFor(1, s.symbol)} stands for ${countNoun(k2, s.thing)}. ${day}'s row shows ${countNoun(c2, s.symbol)}. Which display's ${day} row stands for more ${s.thing}?`,
      correct: keyed,
      distractors: OPTIONS.filter((o) => o.text !== keyed).map((o) => ({ ...o })),
      hints: [
        'Do these two displays agree about what one symbol is worth?',
        'Work each row into an amount using its own key. Then hold the two amounts side by side.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe's error: 3 symbols read as 3 when the key says each symbol is worth
// 5. What makes this the week's item rather than a counting item is that the
// student's COUNT IS CORRECT — the row really does hold that many symbols — so
// there is nothing to find by re-counting, and the only way in is to read the
// key and ask what one symbol was standing for all along.
//
// Built on G7's OWN `stat_verify_graph_scale_v1`, the same verify truth
// `stats.ts::eaSymbolScaleIgnored` uses, so the shown wrong number is still the
// code-derived output of the named misconception and QG-11 re-derives both. It
// is written here rather than called from the family for two reasons: the
// erroranalysis import is what breaks the registry cycle above (see the import
// block), and the prose then speaks the week's own display language — the key
// "at the bottom of the page", and an extension that runs the misconception
// backwards into the week's Day-5 build-a-display move.
// ---------------------------------------------------------------------------

const eaScaleIgnored = errorAnalysis({
  verifyTemplateId: 'stat_verify_graph_scale_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => ({ count: r.int(3, 7), key: r.pick(KEYS) }),
  build: (v, p, r) => {
    const s = r.pick(DISPLAY_SUBJECTS);
    const day = r.pick(DAYS);
    const name = one(r);
    return {
      prompt: `${name}'s class pinned up a pictograph of ${s.thing}. The key at the bottom of it reads: each ${unitFor(1, s.symbol)} stands for ${countNoun(Number(p.key), s.thing)}. ${day}'s row holds ${countNoun(Number(p.count), s.symbol)}, and a student wrote that ${day} counted ${countNoun(Number(v.wrong), s.thing)}.`,
      extension:
        'Write what that row really stands for. Then write the key that would have made the student\'s number right.',
      hints: [
        'Which of the two sentences on that page did the student use?',
        'Say aloud what a single symbol is worth here. Then count on by that, once for every symbol.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildC23 = makeWeekBuilder({
  level: 'C',
  week: 23,
  conceptId: 'scaled-graphs',
  conceptName: 'Scaled graphs',
  strandTags: ['probability-statistics'],
  prerequisiteWeeks: [B23, C7, C12],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the key tells the worth',
  conceptFamily: 'operation',
  deepeningDelta:
    'B23 read displays where every bar height and every mark was worth exactly one, so counting the picture and reading the data were the same act. C23 breaks them apart: a symbol now stands for a group whose size the page decides, so the child must read a key before counting anything, must multiply to get out of the picture, and — new here — must divide to get back INTO it when a row has to be built from an amount.',
  explanation: {
    hook:
      'Three stars in a row. Are they three books, six books, or thirty? Nobody can tell you until they read one short sentence. It is printed at the bottom of the page.',
    whyBeforeHow:
      'A scaled display draws one symbol for a whole group of things. A symbol can stand for a group of any size. So the picture on its own says nothing. You have to read the sentence beside it, because the key tells the worth. Three stars is not three books. Three stars is three of whatever one star is worth. Only the key can settle which. That is why the key is read FIRST and the symbols are counted second. The other order gives a number that looks like an answer. It is really just how much ink the row used. It also means two honest displays of the same data can look completely different. Each one is free to choose its own key.',
    script: [
      {
        say: 'Watch me try to read a row before I know the key. Three stars. Three what? I genuinely cannot say. A star is not a book until this page tells me its worth. So my first move on any display is to hunt for that sentence.',
        visual: 'Three stars in a row, with nothing yet to say what one star is worth.',
        figure: counters(3, 'stars', {
          alt: 'three stars in a row, with nothing yet to say what one star is worth',
        }),
      },
      {
        say: 'Here it is: each star stands for 5 books. Now the row can be read. I lay down one worth-five strip for every star — five, ten, fifteen. Those three stars stand for 15 books. The key is the only reason I can say so.',
        visual: 'Three strips of five joined into one bar of fifteen.',
        figure: barModel(
          [
            {
              label: 'three stars, each worth five books',
              segments: [{ value: 5, label: '5' }, { value: 5, label: '5' }, { value: 5, label: '5' }],
              total: '15',
            },
          ],
          { scaleMax: 15, alt: 'a bar built from three strips of five, braced as fifteen books' },
        ),
      },
      {
        say: 'Now watch what happens when I change nothing at all except the key. Same three stars. If each star stands for 2 books, the row is worth 6 books. If each star stands for 5 books, the same row is worth 15. The picture never moved, and the amount changed. That is why the key is not decoration.',
        visual: 'The same three stars drawn twice, once against a key of two and once against a key of five.',
        figure: barModel(
          [
            { label: 'if each star is worth two', segments: [{ value: 2 }, { value: 2 }, { value: 2 }], total: '6' },
            { label: 'if each star is worth five', segments: [{ value: 5 }, { value: 5 }, { value: 5 }], total: '15' },
          ],
          { scaleMax: 15, alt: 'a short bar of six above a longer bar of fifteen, both built from three equal strips' },
        ),
      },
      {
        say: 'One habit before I write any answer down: I check the size I should expect. One symbol is worth more than one thing. So a row stands for MORE things than it shows symbols. Never fewer. If my answer is smaller than the symbol count, I read the key backwards. Then I go back to the key, not to my counting.',
        visual: 'A number line counted in the key\'s steps, with the very first step marked.',
        figure: numberLine(
          {
            min: 0,
            max: 25,
            step: 5,
            labels: 'majors',
            marks: [{ at: 5, label: '5', style: 'flag' }],
            hops: [{ from: 0, to: 5, label: 'one star' }],
          },
          { alt: 'a number line from 0 to 25 counted in fives, with the first step of five marked from 0' },
        ),
      },
    ],
    summary:
      'On a scaled display, one symbol stands in for a group. Read the key first. Count the symbols second. Then count on by what one symbol is worth. To build a row instead of reading one, run it the other way. Ask how many key-sized groups the amount holds. And expect the amount to come out bigger than the symbol count, every time.',
    vocabulary: [
      { term: 'key', kidGloss: 'the sentence on a display that tells you what one symbol is worth' },
      { term: 'symbol', kidGloss: 'a picture that stands in for a whole group of things, not for one thing' },
      { term: 'scaled graph', kidGloss: 'a display where one symbol, or one step of the scale, is worth more than one' },
      { term: 'scale', kidGloss: 'the size of the jump between one mark and the next' },
    ],
  },
  guidedExamples: [
    {
      ...ge(23, 1, 'modeled', 'A pictograph of books read shows Monday with 3 stars. Each star stands for 5 books. How many books does Monday show?', [
        {
          teacherSay:
            'Before I count a single thing I hunt for the key. The key is the one sentence that tells me what a star is worth. It reads: each star stands for 5 books. So this row is not three of anything yet. It is three fives, and now I can say that out loud.',
        },
        {
          teacherSay: 'Now I count on by fives, once for every star. Five, ten… where does the third star land me?',
          expected: '15',
        },
      ], '15'),
      visual: 'Three strips of five joined into one bar.',
      figure: barModel(
        [
          {
            label: 'three stars, each worth five books',
            segments: [{ value: 5, label: '5' }, { value: 5, label: '5' }, { value: 5, label: '5' }],
            total: '15',
          },
        ],
        { scaleMax: 15, alt: 'a bar built from three strips of five, braced as fifteen books', asserts: assertsAnswer },
      ),
    },
    {
      ...ge(23, 2, 'completion', 'A pictograph of laps shows Tuesday with 4 circles and Thursday with 3 circles. Each circle stands for 10 laps. How many laps do the two days show altogether?', [
        {
          teacherSay: 'Two numbers here are counting symbols. One is doing a different job. Which one is the key?',
          expected: 'the 10',
        },
        { childDo: 'Gather the circles from both rows first. Then let the key turn them into laps.', expected: '70' },
      ], '70'),
      visual: 'Tuesday\'s row and Thursday\'s row, each drawn as strips of ten.',
      figure: barModel(
        [
          { label: 'Tuesday', segments: [{ value: 10 }, { value: 10 }, { value: 10 }, { value: 10 }], total: '40' },
          { label: 'Thursday', segments: [{ value: 10 }, { value: 10 }, { value: 10 }], total: '30' },
        ],
        { scaleMax: 40, alt: 'a bar of four strips of ten above a bar of three strips of ten', asserts: assertsAnswer },
      ),
    },
    ge(23, 3, 'prompted', 'A pictograph of tickets shows Friday with 6 squares and Monday with 2 squares. Each square stands for 5 tickets. How many more tickets does Friday show than Monday?', [
      { childDo: 'Read each named row all the way into tickets first. Then compare the two amounts.', expected: '20' },
    ], '20'),
    {
      // Independent stage: the KEY only. Working out how many of those key-sized
      // groups the total holds IS the task here, so drawing the row would hand
      // the child the answer the item exists to ask for.
      ...ge(23, 4, 'independent', 'A pictograph of litres is being drawn. Each drop on it stands for 10 litres. On Wednesday the class collected 60 litres. How many drops should Wednesday\'s row show? Solve cold.', [
        { childDo: 'Say what one drop is worth. Then work out how many of those fit inside the total.', expected: '6' },
      ], '6'),
      visual: 'One strip standing for what a single drop is worth. The row itself is yours to work out.',
      figure: barModel(
        [{ label: 'what one drop is worth', segments: [{ value: 10, label: '10' }] }],
        { scaleMax: 10, alt: 'a single strip standing for the ten litres one drop is worth' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: the B23 display the child already owns, then the
    // same display with a key on it, read forwards and backwards. Single-step only.
    [
      { gen: wBarRead, diff: 2 },
      { gen: wSkipCount, diff: 2 },
      { gen: wAdd, diff: 2 },
      { gen: readScaledRow, diff: 2 },
      { gen: readHowManyMore, diff: 3 },
      { gen: buildRowFromTotal, diff: 3 },
    ],
    // Day 2 — fluency + application: the recipe discrimination, the second one
    // beside it, the estimate-first metacognition and the first two-step read.
    [
      { gen: wCompare, diff: 2 },
      { gen: wFacts, diff: 2 },
      { gen: discrimSymbolVsValue, diff: 3 },
      { gen: readWholeDisplayEstimate, diff: 4 },
      { gen: msTwoRowsTotal, diff: 4 },
      { gen: discrimKeysDiffer, diff: 3 },
    ],
    // Day 3 — interleave: B23's own discrimination as the warm-up, both of this
    // week's discriminations against a two-step and the two directions of the read.
    [
      { gen: wTallestBar, diff: 3 },
      { gen: discrimKeysDiffer, diff: 4 },
      { gen: discrimSymbolVsValue, diff: 4 },
      { gen: msRowThenChange, diff: 4 },
      { gen: buildRowFromTotal, diff: 4 },
      { gen: readScaledRow, diff: 3 },
    ],
    // Day 4 — word problems: four two-steps, one of them inverse-start and one
    // carrying a number that must be left alone, with a single-step read mixed in
    // so "it must be two steps" never becomes the cue.
    [
      { gen: msTwoRowsTotal, diff: 4 },
      { gen: msRowThenChange, diff: 4 },
      { gen: msSymbolsForNewTotal, diff: 5 },
      { gen: msRowPlusSpare, diff: 5 },
      { gen: readHowManyMore, diff: 3 },
    ],
    // Day 5 — non-computational: the scale-ignored error-analysis, the
    // build-a-question production, and the claim that settles what "more
    // symbols" is and is not evidence of (+ a ramped warm-up).
    [
      { gen: wFacts, diff: 2 },
      { gen: eaScaleIgnored, diff: 4 },
      {
        gen: reasoning({
          prompt:
            'Design a scaled display of your own. Write a key saying what one symbol is worth. Draw two rows, with a different number of symbols in each. Then write ONE question about your display. It must be a question a reader can only answer by using your key. Underneath, write the answer to your own question. Show how the key got you there.',
          value: 'a key naming what one symbol is worth, two rows of symbols, and a question whose answer needs the symbol count counted on by the key',
          acceptableForms: ['key', 'stands for', 'each symbol', 'worth', 'rows', 'how many'],
          keywords: true,
          hints: [
            'What must a reader be told before your rows mean anything?',
            'Write the key first. Work out what one of your rows is worth. Then turn that into the question.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        }),
        diff: 3,
      },
      {
        gen: classify({
          prompt:
            'Always, sometimes, or never true? A row with more symbols stands for more things. In one sentence, say how you know.',
          correct: 'sometimes',
          distractors: [
            {
              text: 'always',
              errorTag: 'concept-misconception',
              rationale: 'Reads symbol counts as amounts, which only holds while both rows are being read against one and the same key.',
            },
            {
              text: 'never',
              errorTag: 'representation-misread',
              rationale: 'Rules out the ordinary case, where every row on one display shares a key and the longest row really does stand for the most.',
            },
          ],
          hints: [
            'Is there only one key in the world, or may displays differ?',
            'Try it twice. First with two rows on one display. Then with two rows whose keys differ.',
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
    'For grown-ups: the whole week is one habit — read the key before counting the picture. If your child answers 3 for a row of 3 symbols, do not correct the number; their counting was perfect. Ask instead what one symbol is worth here, and then ask them to count on by that. Newspapers and sports pages are full of scaled displays, and this is the week your child stops taking a picture at face value.',
  ],
  puzzle: (r) => {
    const s = r.pick(DISPLAY_SUBJECTS);
    // Two CONSECUTIVE multipliers guarantee the four totals share no factor
    // beyond the key itself, so "the largest worth that works" is exactly the
    // key — by construction, not by a lucky draw.
    const key = r.pick([3, 4, 5, 6] as const);
    const m1 = r.int(2, 6);
    const rest = r.shuffle(Array.from({ length: 8 }, (_, i) => i + 2)).filter((m) => m !== m1 && m !== m1 + 1);
    const totals = r.shuffle([m1, m1 + 1, rest[0], rest[1]]).map((m) => m * key);
    return {
      id: 'C23-PZ-01',
      title: 'Puzzle Grove: Choosing the Key',
      puzzleType: 'logic',
      prompt: `A pictograph of ${s.thing} has to show four totals: ${totals.join(', ')}. Every row must be drawn in whole ${unitFor(2, s.symbol)}. No half ${unitFor(1, s.symbol)} anywhere on the page. What is the LARGEST number of ${s.thing} one ${unitFor(1, s.symbol)} could stand for? How can you be sure no larger number works?`,
      answer: {
        value: String(key),
        acceptableForms: [countNoun(key, s.thing)],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which of the four totals is the fussiest about what one symbol could be worth?',
        'Test a worth against every total in turn. Keep only the worths that leave no part-symbol anywhere.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'key-design' },
  sprint: {
    skill: 'Multiplication facts — turning a row of symbols into an amount',
    sourceWeek: C12,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 10] },
  },
  mastery: [
    { gen: readScaledRow, diff: 3 },
    { gen: msTwoRowsTotal, diff: 3 },
    { gen: buildRowFromTotal, diff: 3 },
    { gen: msRowThenChange, diff: 4 },
    { gen: discrimKeysDiffer, diff: 3 },
    { gen: msSymbolsForNewTotal, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step work — one named row read through the key (with the key-step figure affordance preserved), a row BUILT from a stated amount, and the two-displays-two-keys discrimination. 02/04/06: two-step work — two rows gathered then keyed, a row read then changed, and the inverse-start item whose stated quantity is an amount and whose answer is a symbol count. No operand surface reused from Form A or the daily pages.',
  mistakeBank: [
    {
      errorTag: 'representation-misread',
      subtype: 'symbols-read-as-amounts',
      description: 'Reads the number of symbols in a row as the amount itself, so the key is printed on the page and does no work at all.',
      exampleWrongAnswer: 'a row of 3 symbols on a display keyed to 5 answered as 3',
      distractorRationale: 'Offer the bare symbol count.',
      reteachPointer: 'explanation/script[1] (one worth-five strip laid down for every symbol in the row)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'key-joined-not-applied',
      description: 'Treats the key as one more amount to join on, or as decoration that two different displays may safely be compared across.',
      exampleWrongAnswer: 'a row of 4 symbols on a display keyed to 5 answered as 9',
      distractorRationale: 'Offer the symbol count added to the key, or the row with more symbols when the two displays carry different keys.',
      reteachPointer: 'explanation/script[2] (changing nothing but the key changes what the same row is worth)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-a-different-row',
      description: 'Answers about a row the question did not name, or gives a comparison when a single row was asked for — and on a two-step display story, stops once the row has been read and never applies the change.',
      exampleWrongAnswer: 'a "how many for Friday" question answered with the longest row',
      distractorRationale: 'Offer the value of the row that stands out rather than the row the question names.',
      reteachPointer: 'guidedExamples/C23-GE-03 (read each named row all the way into things before comparing)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'skip-count-slip',
      description: 'Chooses the right move but loses the thread while counting on by the key, landing one key-step short or one over.',
      exampleWrongAnswer: 'a row of 6 symbols on a display keyed to 5 counted as 25',
      distractorRationale: 'Offer the amount one key-step short of the true one.',
      reteachPointer: 'guidedExamples/C23-GE-01 (say the running total aloud once per symbol), then the 2-minute facts sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Scaled graphs — reading the key before counting the picture, turning a row of symbols into an amount by counting on, working backwards to decide how many symbols a stated amount needs, and spotting that two displays of the same data can look completely different when their keys differ.',
    improvingCandidates: [
      'reading the key before counting any symbols',
      'counting on by what the key says each symbol is worth',
      'building a row from an amount, not only reading one',
    ],
    strengtheningByTag: [
      {
        errorTag: 'representation-misread',
        text: 'holding on to the difference between how many symbols a row holds and how many things it stands for',
      },
      {
        errorTag: 'concept-misconception',
        text: 'comparing two displays fairly when each one has chosen its own key',
      },
      {
        errorTag: 'task-comprehension',
        text: 'answering about the row the question names, and finishing a two-step display story rather than stopping at the row',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping the count steady while skip-counting a long row — the sprints keep that part quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You found the key before you counted a single symbol, and you checked that your amount came out bigger than the row you could see — that is exactly the move this week is built on.',
      questionForChild: 'If every star on a chart stands for 4 books and a row has 3 stars, how many books is that — and how did you work it out?',
      schoolSyncHook: 'If your child\'s class calls this a "pictograph", a "picture graph" or a "pictogram", tell us and we will match the word they hear.',
    },
    vocabularyForParent: [
      'key (what one symbol on the display is worth)',
      'scaled graph (one symbol stands for a group, not for one thing)',
      'scale (the size of the jump from one mark to the next)',
    ],
  },
});
