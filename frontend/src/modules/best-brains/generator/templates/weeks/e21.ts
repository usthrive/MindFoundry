/**
 * Level E · Week 21 — "Measures of center & spread" (conceptId: measures-center-spread).
 *
 * FILL-ARCHITECTURE §6 row E21: anchor "the mean as fair-share redistribution";
 * key multi-step "add a point — what happens to the mean"; error-analysis
 * "median without sorting"; discrimination "mean vs median on skewed data";
 * Day-5 signature "one data set, two honest summaries". No R flag: every strand
 * of this week is computable and code-keyed.
 *
 * THE WEEK'S CLAIM. A summary is a QUESTION ASKED OF A DATA SET, not a property
 * the data set has. Four summaries are computed here and each answers a
 * different question — what an even share would be, what stands in the middle,
 * what turns up most, how far the data stretches — so "the average" is not one
 * number a data set carries around but four different readings of it, which
 * agree only when the data is balanced and separate the moment it is not.
 * Everything below is built to force that reading rather than announce it:
 *  - the anchor is the LEVELLING itself. Pour every pile into one heap, share it
 *    back in equal handfuls, and what each pile ends up holding is the mean —
 *    which is why the mean can land on a value no pile ever held, and why one
 *    huge pile lifts every other pile's share;
 *  - two discriminations attack the confusion from opposite ends.
 *    `compareTheTwoCentres` asks the child to PRODUCE the verdict from a data
 *    set — which of the two centres comes out larger, if either — and the answer
 *    is computed from the readings, never read off the shape they were drawn in.
 *    `discrimWhichSummary` asks the prior question: given what somebody wants to
 *    know, which summary answers it at all. A child who can compute all four and
 *    cannot choose between them has learned nothing this week is for;
 *  - the error-analysis is the family's own `eaMedianWithoutSorting`, whose
 *    shown wrong number is re-derived by `stat_verify_median_v1` and is always
 *    the middle of the list AS WRITTEN — a real misconception output, never an
 *    invented one;
 *  - three genuine chains, one per posing shape the E band owes: a forward
 *    add-a-point chain (the recipe's headline: total, fold in, re-share), an
 *    INVERSE-START recovery where the stated mean is the RESULT of a sharing and
 *    the opening move is to undo it, and a HAS-DISTRACTOR levelling problem that
 *    states a quantity it never uses.
 *
 * ---------------------------------------------------------------------------
 * SIX AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3). Four of
 * them are forced by measured properties of `lib/stats.ts`, reported upward and
 * NOT fixed here (lib/ is not this week's to edit).
 *
 *  1. `balancedSet` MAKES A SYMMETRIC SET, SO ITS MEAN IS ALWAYS ITS MEDIAN.
 *     The constructor pairs each +d with a −d about the target, which is what
 *     makes the mean exact — and also makes the data set exactly symmetric, so
 *     the two centres coincide. Measured over 3,000 draws at each of n = 4, 5, 6,
 *     7, 8: mean === median on 3,000/3,000 every time. Consequence for a week
 *     whose whole subject is the two centres coming apart: on `meanOfSet` with
 *     `clean: true`, "report the middle value once the data is sorted" is the
 *     RIGHT ANSWER on 100% of draws (1,500 draws measured), and the mean is one
 *     of the printed values on 100% of them.
 *
 *     So `meanOfSet({ n: 5 })` is served EXACTLY ONCE, on Day 1, where a whole
 *     fair share is the point being established and the coincidence is honest
 *     (a balanced set really does have mean = median). It certifies nothing.
 *     Every other mean item — Day 2 and the mastery slot — is
 *     `meanOfSet({ n: 4, clean: false })`, whose mean is a quarter and therefore
 *     is neither a member of its own data (0/1,500) nor its median (0/1,500).
 *     That form is also the week's own content: a mean need not be a value
 *     anybody recorded.
 *
 *  2. `unsortedMiddle` DEFEATS ONE HABIT AND FEEDS ANOTHER. It does what it
 *     promises — the middle of the list as written is never the median, 0/3,000
 *     at n = 4, 5, 6 and 7 — but the repair it performs is a swap with position
 *     ZERO, so whenever the median would have landed in the middle it is moved
 *     to the FRONT of the printed list. Measured on `medianOfSet({ n: 5 })` over
 *     1,500 draws, the median sits at printed position 0 on 41.1% of them
 *     (chance is 20%), so "take the first number you are given" answers the
 *     week's median item four times in ten. `medianOfSet({ n: 7 })` measures
 *     30.5% for the same reason.
 *
 *     Day 1's median item is therefore served through `medianAwayFromTheFront`,
 *     a rejection filter over the generator's OWN draw (no fabrication: the
 *     accepted item is one the family produced). `eaMedianWithoutSorting` draws
 *     its data the same way and inherits the same front-loading — the median a
 *     child has to produce in its extension would sit first on 41% of draws — so
 *     it is filtered on the same condition. Day 3's and the mastery slot's
 *     median item is `medianOfSet({ n: 6 })`, where the median is the average of
 *     the two middle values, is never a member of the data at all, and every
 *     positional reflex measures 0.0%.
 *
 *     What the filter cannot buy is a flat distribution. With position 2 ruled
 *     out by the library and position 0 ruled out here, the served median sits
 *     at position 1, 3 or 4 about a third of the time each (measured 32.8% /
 *     30.8% / 36.5%), against the 20% five positions would give. That residue is
 *     stated rather than hidden: it is one non-certifying Day-1 item, "take the
 *     last one" is not a misconception anybody holds, and the alternative — a
 *     filter narrow enough to flatten it — would pin the item to two positions
 *     and make the reflex worse, which is the mirrored-defect trap of kit
 *     §E2.11.
 *
 *  3. `msMissingValueFromMean` CAN KEY THE NUMBER IT PRINTS. Its data comes from
 *     `balancedSet`, which at odd n always contains the mean itself; when that is
 *     the value held back, the answer to "what is the remaining value?" is the
 *     mean the prompt has already stated. Measured over 1,200 draws: 19.0%
 *     overall (n = 5: 21.9%, n = 7: 15.9%). It is served through
 *     `missingValueIsNotTheStatedMean`, the same rejection-filter shape, which
 *     takes that to 0.0%.
 *
 *  4. THE ESTIMATE-FIRST PROBE IS ON THE RECOVERY CHAIN, NOT THE ADD-A-POINT
 *     CHAIN. The obvious probe — "will the new mean come out above or below the
 *     old one?" — is one-sided: `msMeanAfterExtraValue` draws its new mean as
 *     `mean + int(1, 3)`, so the mean RISES on 100% of 1,200 draws, and a probe
 *     answered "up" every time teaches the guess instead of the commitment
 *     (kit §E2.9a). The probe is carried instead by the recovery chain, where
 *     "is the value that is missing above the mean or below it?" is decidable
 *     before any arithmetic and measures 51.3% / 48.7% over the served draws.
 *     Per §E2.2, `msMissingValueFromMean` is reachable ONLY through the wrapper.
 *
 *  5. `meanVsMedianOnSkew` SHIPS A PERMANENTLY UNKEYABLE OPTION, so a local
 *     generator stands in its place. The recipe's own discrimination offers
 *     "they come out the same" on every exposure and its draw then guarantees
 *     the two centres differ — the outlier is nudged whenever `sum === median·n`
 *     — so that option is correct at no seed. Measured over 4,000 draws: keyed
 *     0/4,000, and a child who meets the item twice has learned to strike it out
 *     and is answering a two-way question, which lifts "always answer the mean"
 *     from a 33% chance to a coin flip. This is the L38 card `compareWhole` was
 *     repaired for in the Level-D library and the same shape E6 found in
 *     `compareNegativesTrap`.
 *
 *     `compareTheTwoCentres` keeps the recipe's bite and makes every option
 *     live, by using decision 1's defect as a feature: the third shape in its
 *     pool is a `balancedSet`, which is symmetric by construction, so the two
 *     centres genuinely coincide and "they come out the same" is the true
 *     answer. Its three shapes are drawn uniformly, so no blind answer beats the
 *     33% a three-option page gives away anyway, and the verdict is computed
 *     from the readings by exact integer arithmetic (`sum` against `median·n`)
 *     rather than read off the shape label. The two lopsided shapes are also
 *     built to SEPARATE: the family's low-outlier branch puts the two centres
 *     within one unit of each other on 13.0% of its draws, where the divergence
 *     is real but has to be computed rather than seen; the pool below is bounded
 *     so the gap is at least 2.6 units on the low branch and 5.2 on the high one.
 *
 *  5b. NEITHER DISCRIMINATION CERTIFIES. Both live on Days 2 and 3, where they
 *     are taught and practised, and the mastery form carries none of them: a
 *     three-option page hands a guesser a third of a slot outright, and this
 *     week certifies only where the arithmetic has to be done.
 *
 *  5c. `discrimWhichSummary` IS SERVED ONCE, NOT TWICE. Its variable part is the
 *     SENTENCE saying what somebody wants to know, and that sentence is what
 *     decides the answer; the numerals are scenery. So two servings collide on
 *     the same question one time in four (the surface guard compares numeric
 *     tokens and cannot see it) — and at seed 1301 they did, printing the
 *     fair-share question twice with different bowls. One serving, on Day 3.
 *
 *  6. THE MODE IS TAUGHT AND PRACTISED, NOT CERTIFIED. A mode occupies two of
 *     the six or seven printed positions by construction, so "take the first
 *     value" and "take the last value" answer `modeOfSet` about three times in
 *     ten (n = 7: 29.9% and 29.8% over 1,500 draws) — an intrinsic property of
 *     the statistic, not a fault in the generator, and not something a mastery
 *     slot should hand out. The mode appears on Day 2 and Day 4 and stays off
 *     the form, for the same reason `absoluteValue` stays off E6's.
 *
 * ---------------------------------------------------------------------------
 * ANSWER-IN-PROMPT NOTE. Four items here key a number the prompt prints, and
 * every one of them does so because of what the statistic IS, not because a draw
 * went wrong. The mode is always a value of its own data (800/800 servings). The
 * median of an ODD-length set always is (400/400 of the Day-1 servings; the
 * even-length one, 400/400, never is). A range sometimes coincides with a
 * reading (17.3% of `rangeOfSet` servings). And the Day-1 balanced mean always
 * does, which is decision 1 above — a property of `balancedSet`, confined to one
 * non-certifying item and never repeated on the form.
 *
 * No item whose answer COULD have been kept off the page leaves it on. The
 * fractional mean, both multi-step chains, the levelling problem, the
 * error-analysis and the puzzle all key numbers the prompt never prints
 * (0/4,800 across the chains, 0/400 for the rest), and the one draw that leaked
 * by accident rather than by definition — the recovery chain keying its own
 * stated mean, 19.0% unfiltered — is filtered to 0.0%.
 *
 * Retrieval is backward-only into the three skills a summary actually runs on:
 * D2 addition (the totalling every mean begins with), D16 exact division (the
 * sharing it ends on) and C23 scaled graphs, where a key already stood between
 * a mark on a display and the amount it stood for — the same move a summary
 * makes between a data set and one number standing for it. D15 multiplication
 * supplies the fourth format, because rebuilding a total from a stated mean is
 * the move both chains open on.
 */

import { asWarmup, addWhole, classify, divideExact, multiply, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import type { ItemDraft } from '../lib/assemble';
import { barModel } from '../lib/figures';
import {
  balancedSet,
  distinctSet,
  eaMedianWithoutSorting,
  graphRead,
  meanOfSet,
  medianOf,
  medianOfSet,
  modeOfSet,
  msMeanAfterExtraValue,
  msMissingValueFromMean,
  rangeOfSet,
  sumOf,
} from '../lib/stats';
import { numberWords } from '../shared';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const C23 = { level: 'C' as const, week: 23 };
const D2 = { level: 'D' as const, week: 2 };
const D15 = { level: 'D' as const, week: 15 };
const D16 = { level: 'D' as const, week: 16 };

// ---------------------------------------------------------------------------
// redrawUntil — a rejection FILTER over a family generator's own draw.
//
// Same shape as e06's `belowZero`: it re-runs the generator's draw and keeps the
// first item that satisfies the condition, so nothing is fabricated and the
// accepted item is one `lib/stats.ts` itself produced. It is bounded, so a draw
// space that cannot satisfy the condition degrades to the family's own behaviour
// rather than hanging. Used only where a MEASURED property of the shared library
// would otherwise hand a certifying slot to a reflex (header decisions 2 and 3).
// ---------------------------------------------------------------------------

function redrawUntil(base: ItemGen, holds: (draft: ItemDraft) => boolean, tries = 12): ItemGen {
  return (rng, guard, difficulty) => {
    let d = base(rng, guard, difficulty);
    for (let i = 0; i < tries && !holds(d); i++) d = base(rng, guard, difficulty);
    return d;
  };
}

/** The median must not be the first value in the printed list (header decision 2). */
const medianAwayFromTheFront = (d: ItemDraft): boolean => {
  const values = d.generator?.params.values;
  return !Array.isArray(values) || String(values[0]) !== d.answer.value;
};

/**
 * The same condition for the error-analysis, which draws its data through the
 * same `unsortedMiddle` and so inherits the same front-loading: the median the
 * child has to produce in the extension must not be the first value on the line.
 * Read off the item's own params through the library's own `medianOf`, so the
 * filter and the shipped truth cannot disagree.
 */
const eaMedianAwayFromTheFront = (d: ItemDraft): boolean => {
  const values = d.generator?.params.values;
  return !Array.isArray(values) || medianOf(values as number[]) !== String(values[0]);
};

/** The held-back value must not be the mean the prompt states (header decision 3). */
const missingValueIsNotTheStatedMean = (d: ItemDraft): boolean => {
  const stated = d.generator?.params.initN;
  return stated === undefined || String(stated) !== d.answer.value;
};

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * D2 — the join. Every mean begins by pooling a data set into one total, and
 * that total is the only quantity in the week larger than anything recorded.
 */
const wTotal = asWarmup(addWhole(126, 489), D2);
/**
 * D16 — exact division, the sharing every mean ends on.
 *
 * Divisor and quotient ranges are DISJOINT on purpose. `divideExact` draws the
 * two independently, so overlapping ranges let them coincide and print a warm-up
 * whose answer is one of the numerals in its own question. Keeping 4–9 clear of
 * 21–38 makes that impossible: the quotient is larger than every divisor and
 * smaller than every dividend.
 */
const wShare = asWarmup(divideExact(4, 9, 21, 38), D16);
/** D15 — the product, so rebuilding a total from a stated mean never stalls. */
const wRebuild = asWarmup(multiply(4, 9, 12, 24), D15);
/**
 * C23 — a scaled display, where a key already stood between a mark and the
 * amount it stood for. `combine` rather than `value` or `difference` for a
 * reason that is arithmetic, not taste: the combined amount is at least two
 * symbols times the smallest key, so it is always larger than any symbol count
 * on the page and can never equal the key itself, whereas a difference of one
 * symbol can print its own answer.
 */
const wKeyedDisplay = asWarmup(graphRead('combine', 'pictograph'), C23);

// ---------------------------------------------------------------------------
// The four summaries, single-step (see header decisions 1, 2 and 6)
// ---------------------------------------------------------------------------

/** Day 1 only: a balanced set, a whole fair share, and the two centres agreeing. */
const sitMeanBalanced = meanOfSet({ n: 5 });
/** The mean that is not a member of its own data — a quarter, exact by construction. */
const sitMeanFractional = meanOfSet({ n: 4, clean: false });
/** The odd-length median, with BOTH positional habits measured off it. */
const sitMedianOdd = redrawUntil(medianOfSet({ n: 5 }), medianAwayFromTheFront);
/** The even-length median: the average of the two middles, never a member. */
const sitMedianEven = medianOfSet({ n: 6 });
/** The mode — taught, practised, never certified (header decision 6). */
const sitMode = modeOfSet({ n: 7 });
/** The spread statistic, deliberately worked beside the three centres. */
const sitRange = rangeOfSet({ n: 5 });
/** The week's named misconception, with the same front-loading filtered out. */
const eaMedianOnTheLine = redrawUntil(eaMedianWithoutSorting(), eaMedianAwayFromTheFront);

// ---------------------------------------------------------------------------
// Multi-step: three chains, one per posing shape the E band owes
// ---------------------------------------------------------------------------

/** The recipe's headline chain: rebuild the total, fold the new value in, re-share. */
const msAddAPoint = msMeanAfterExtraValue();

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The quantity the story hands over
 * is the RESULT of a sharing, so the opening move is to undo it — turn the mean
 * back into the total it stands for — and nothing in the sentence order asks for
 * that. Filtered so the value held back is never the stated mean itself, and
 * served ONLY through the estimate-first wrapper (header decisions 3 and 4).
 */
const msRecoverMissingValue = withEstimateFirst(
  redrawUntil(msMissingValueFromMean(), missingValueIsNotTheStatedMean),
  'is the value that is missing larger than the stated mean, or smaller than it?',
);

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3), and the anchor made literal: the
 * takings of a whole run are levelled across its days, and the question is what
 * the quietest day gains by it. The bucket count is stated, is never used, and
 * is the seductive kind of spare quantity — a count of containers, in a problem
 * whose real move is a division.
 *
 * No leak by construction. The answer is the gap between the quiet day and the
 * even share, drawn at 3–9; the quiet day is drawn at 14 or more, the spare
 * count at 11 or more and the total at 85 or more, so no numeral the prompt
 * prints can equal the number it is asking for. Drawing the gap FIRST is what
 * makes that provable: the quiet day and the even share are both derived from
 * it, rather than the gap being whatever the two happened to leave.
 *
 * Three trades rather than one, because this generator is the busiest in the
 * week — Day 3, Day 4 and a slot on both mastery forms, so four servings land in
 * every pack and one frame repeated four times reads as a page nobody proofread
 * (kit §E2.8, L24). The stock word is drawn WITH the trade, so the spare
 * quantity is always a container the goods could plausibly sit in.
 */
const STALL_TRADES = [
  { seller: 'A flower stall', goods: 'stems', store: 'buckets' },
  { seller: 'A cheese counter', goods: 'wedges', store: 'chiller drawers' },
  { seller: 'A newspaper kiosk', goods: 'papers', store: 'wire racks' },
] as const;

const msLevelTheRun = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'mean-share-gap',
  posing: 'has-distractor',
  draw: (r) => {
    const gap = r.int(3, 9);
    const quiet = r.int(14, 34);
    const perDay = quiet + gap;
    const days = r.pick([5, 6, 8]);
    const total = perDay * days;
    const spare = r.int(11, 19);
    const trade = r.pick(STALL_TRADES);
    return {
      prompt: `${trade.seller} sold ${countNoun(total, trade.goods)} over ${numberWords(days)} days of trading, and keeps its stock in ${countNoun(spare, trade.store)}. Its quietest day sold ${countNoun(quiet, trade.goods)}. Had that same total been spread evenly across the ${numberWords(days)} days, how many more ${trade.goods} would the quietest day have sold?`,
      initN: total,
      steps: [
        { op: 'div', n: days, d: 1 },
        { op: 'sub', n: quiet, d: 1 },
      ],
      units: trade.goods,
      hints: [
        'Which number here describes every day of the run at once, and which one describes a single day?',
        'Turn the whole run into what one even day would hold, then set the quiet day against that.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination 1 — PRODUCE the verdict: which of the two centres is larger
//
// Three shapes, drawn uniformly, each keying a different one of the three
// options, so nothing on this page is offered without ever being right (header
// decision 5) and no blind answer beats the third a three-option page concedes:
//   'high-tail'  a tight cluster with one reading far ABOVE it — the summary
//                that shares every value out is dragged up past the middle one;
//   'low-tail'   the same with one reading far BELOW, which is the direction
//                children rarely meet and never expect;
//   'level'      a set balanced about its centre, where the two agree. This is
//                the shape that makes "they come out the same" a real answer,
//                and it is the ONE place `balancedSet`'s symmetry is what a
//                week wants rather than what it has to work around.
//
// The bands are chosen so the verdict is never a photo-finish: on 'high-tail'
// the two centres stand at least 5.2 apart, on 'low-tail' at least 2.6. The
// verdict itself is computed from the readings — total against median times the
// count, whole numbers throughout — so the shape label decides what is drawn
// and never what is keyed.
// ---------------------------------------------------------------------------

type CentreShape = 'high-tail' | 'low-tail' | 'level';

const CENTRE_SHAPES: readonly CentreShape[] = ['high-tail', 'low-tail', 'level'];

const LOPSIDED_RATIONALE =
  'Names the wrong one of the two centres. The summary that shares every reading out is the one a single far-off reading pulls with it; the reading standing in the middle only counts how many lie either side of it, so it barely stirs.';
const NOT_BALANCED_RATIONALE =
  'Reads a set holding one reading far from the rest as though it were balanced about its centre, so a summary that every reading feeds into is expected to land exactly where the middle one does.';
const EXPECTS_A_DRAG_RATIONALE =
  'Expects the summary that uses every reading to sit above the middle one whatever the data looks like. Here the readings above the centre pull exactly as hard as the ones below, and the two land together.';
const NO_OUTLIER_RATIONALE =
  'Reaches for the summary that a far-off reading cannot drag, on a set of readings that holds no far-off reading to drag anything.';

function centreDistractor(option: string, balanced: boolean): { text: string; errorTag: ErrorTag; rationale: string } {
  if (option === 'they come out the same') {
    return { text: option, errorTag: 'representation-misread', rationale: NOT_BALANCED_RATIONALE };
  }
  if (!balanced) {
    return { text: option, errorTag: 'concept-misconception', rationale: LOPSIDED_RATIONALE };
  }
  return option === 'the mean'
    ? { text: option, errorTag: 'concept-misconception', rationale: EXPECTS_A_DRAG_RATIONALE }
    : { text: option, errorTag: 'representation-misread', rationale: NO_OUTLIER_RATIONALE };
}

const compareTheTwoCentres = discrimination({
  variant: 'structural',
  cognitiveOp: 'compare-centres',
  draw: (r) => {
    const shape = r.pick(CENTRE_SHAPES);
    const values =
      shape === 'high-tail'
        ? r.shuffle([...distinctSet(r, 4, 10, 18), r.int(55, 90)])
        : shape === 'low-tail'
          ? r.shuffle([...distinctSet(r, 4, 28, 34), r.int(1, 8)])
          : balancedSet(r, 5, r.int(12, 26), 4);
    // Exact integer arithmetic: the total against the middle reading taken as
    // many times as there are readings. No division, so no float decides which
    // option is keyed, and the shape a set was drawn in is never consulted.
    const total = sumOf(values);
    const level = Number(medianOf(values)) * values.length;
    const correct = total > level ? 'the mean' : total < level ? 'the median' : 'they come out the same';
    const balanced = total === level;
    return {
      prompt: `A data set reads ${values.join(', ')}. Set its mean against its median: which of the two comes out larger, if either?`,
      correct,
      distractors: ['the mean', 'the median', 'they come out the same']
        .filter((o) => o !== correct)
        .map((o) => centreDistractor(o, balanced)),
      hints: [
        'Before working anything out, is there a reading in this set that is nothing like the others?',
        'Find the reading standing in the middle, then work out what the whole set would share out to, and hold the two numbers side by side.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Discrimination 2 — the question that has to be settled first
//
// Four different questions pick four different summaries out of one data set,
// so a child who believes "the average" names one fixed number will choose
// wrongly here and reason wrongly above. Served once (header decision 5c).
// ---------------------------------------------------------------------------

type SummaryName = 'the mean' | 'the median' | 'the mode' | 'the range';

const SUMMARY_NAMES: readonly SummaryName[] = ['the mean', 'the median', 'the mode', 'the range'];

/** What somebody wants to know — one sentence per summary, none naming it. */
const SUMMARY_ASK: Record<SummaryName, string> = {
  'the mean':
    'The studio wants the weight every bowl would come to if the whole firing were shared out equally between them.',
  'the median':
    'The studio wants the weight with as many bowls heavier than it as there are lighter.',
  'the mode': 'The studio wants the weight that came up more often than any other.',
  'the range':
    'The studio wants one number saying how far the weights stretch from the lightest to the heaviest.',
};

/**
 * What each summary genuinely reports, written as the rationale for offering it
 * where it was not asked for. Every option is correct on a quarter of draws, so
 * none of these is a permanently dead card and none of them is a lure.
 */
const SUMMARY_REPORTS: Record<SummaryName, { tag: ErrorTag; rationale: string }> = {
  'the mean': {
    tag: 'task-comprehension',
    rationale:
      'Reports what every value would become if the total were shared out equally — a centre reached by fair share, which is not the reading this question asks for.',
  },
  'the median': {
    tag: 'representation-misread',
    rationale:
      'Reports the value standing in the middle once the data is put in order — a centre reached by position, which is not the reading this question asks for.',
  },
  'the mode': {
    tag: 'task-comprehension',
    rationale:
      'Reports the value recorded more often than any other, which names the commonest reading rather than the one this question asks for.',
  },
  'the range': {
    tag: 'concept-misconception',
    rationale:
      'Reports the distance between the two ends of the data, which measures how far it spreads rather than saying anything about where it sits.',
  },
};

const discrimWhichSummary = discrimination({
  variant: 'structural',
  cognitiveOp: 'choose-summary',
  draw: (r) => {
    // The lightest and heaviest are stated, so the spread question is genuinely
    // answerable from the page; the other three summaries live in data the
    // studio holds and the reader does not, which is what keeps the item about
    // choosing a summary rather than computing one.
    const bowls = r.int(11, 24);
    const lightest = r.int(180, 240);
    const heaviest = lightest + r.int(40, 120);
    const wanted = r.pick(SUMMARY_NAMES);
    const offered = r.shuffle(SUMMARY_NAMES.filter((s) => s !== wanted)).slice(0, 2);
    return {
      prompt: `A pottery studio weighed every one of the ${countNoun(bowls, 'bowls')} from one firing. The lightest came out at ${countNoun(lightest, 'grams')} and the heaviest at ${countNoun(heaviest, 'grams')}. ${SUMMARY_ASK[wanted]} Which summary of the ${countNoun(bowls, 'weights')} answers that?`,
      correct: wanted,
      distractors: offered.map((s) => ({
        text: s,
        errorTag: SUMMARY_REPORTS[s].tag,
        rationale: SUMMARY_REPORTS[s].rationale,
      })),
      hints: [
        'Does this question want to know where the weights sit, or how far apart they lie?',
        'Say in your own words what each offered summary reports, then keep the one whose job matches what was asked.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand
// ---------------------------------------------------------------------------

/**
 * The recipe's Day-5 signature: ONE DATA SET, TWO HONEST SUMMARIES. Fixed prose,
 * because the demand is on the defence rather than on the arithmetic — and the
 * numbers are chosen so both summaries come out whole and both are defensible.
 * Nine hours: 6, 7, 7, 8, 9, 9, 10, 11, 41. They total 108, so the mean is
 * exactly 12; ordered, the fifth is 9, so the median is 9. Neither summary is
 * wrong and neither is the whole story, which is the only honest thing to say
 * about a data set with one full week in it and eight part ones.
 */
const twoHonestSummaries = reasoning({
  prompt:
    'A tool-hire shop\'s timesheet lists the hours its nine staff worked last week: 6, 7, 7, 8, 9, 9, 10, 11, 41. Work out both the mean and the median of those nine numbers. Then decide which of the two a job advert should quote as a typical week at this shop, and write a defence of your choice aimed at a reader who insists the mean has to be the fairer number, on the grounds that it uses every value on the list. Your defence has to say what the mean is doing with the 41.',
  value:
    'the mean is 12 hours and the median is 9 hours; the median describes a typical week here, because the single 41-hour week lifts the mean above eight of the nine staff',
  acceptableForms: [
    'the mean is 12 and the median is 9',
    'mean 12',
    'median 9',
    'the median',
    'above eight of the nine',
    'one long week',
    'typical',
  ],
  keywords: true,
  hints: [
    'Which of the nine numbers on this list is unlike all the others?',
    'Total the nine and share that total across the nine staff, then order the nine and read off the one standing in the middle.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The always-sometimes-never item takes the add-a-point chain and asks whether
 * what happened on Day 4 was a property of arithmetic or of the numbers drawn. It is also the one
 * always-sometimes-never item in the E corpus so far that does not key
 * `sometimes`: E1 and E13 both key it, and a child who has learned that a hedged
 * verdict is usually the safe one should not be rewarded for it a third time
 * (the reasoning E6 set down when it keyed `never`).
 */
const claimAddingAboveTheMean = classify({
  prompt:
    'Always, sometimes, or never true: recording one more value that is larger than the mean pulls the mean up. In one sentence, say what happens to the mean instead when the value recorded is exactly equal to it.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale:
        'Confuses how far the mean moves with whether it moves at all. A value only a little above the mean lifts it only a little, and a value far above it lifts it a long way, but every value above the mean lifts it.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale:
        'Treats a mean as fixed once it has been written down, as though a later value could join the data without being shared back across all of it.',
    },
  ],
  hints: [
    'What has to happen to the total, and to the number of values, when one more reading is recorded?',
    'Try a small set and add a value just above its mean, then start again and add one far above it, and see whether one verdict covers both.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE21 = makeWeekBuilder({
  level: 'E',
  week: 21,
  conceptId: 'measures-center-spread',
  conceptName: 'Measures of center & spread',
  strandTags: ['probability-statistics'],
  prerequisiteWeeks: [C23, D2, D16],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the fair share that levelling leaves behind',
  conceptFamily: 'operation',
  deepeningDelta:
    'B23 and C23 built and read displays: the data stayed in front of the child as separate bars, and every question was answered by pointing at one of them or comparing two. C23 added a key, so a mark on the page and the amount it stood for came apart for the first time. E21 takes the whole data set away and replaces it with one number — which means choosing WHICH one number, since four different summaries answer four different questions about the same readings, and they agree only while the data is balanced. The read-off skill becomes a reduce-to-one skill, and the new work is deciding what has been lost in the reduction.',
  explanation: {
    hook:
      'Nine people work at a tool-hire shop. Eight of them work part-time and one works a full week. Ask what a typical week looks like there and you can get twelve hours or nine, both worked out correctly, from the same nine numbers. Neither is a mistake. They are answers to different questions.',
    whyBeforeHow:
      'A summary is a question asked of a data set, not a property the data set carries around. That is why we work with the fair share that levelling leaves behind: pour every pile into one heap, share the heap back out in equal handfuls, and what each pile ends up holding is the mean. Levelling explains everything the mean does. It explains why the mean can land on a number nobody recorded, because a fair share does not have to match any pile that existed before. It explains why one enormous pile lifts every other pile, because that pile is poured into the heap along with the rest. And it explains what the mean is for: it is the summary that uses every value, so it is the summary a single far-off value can drag. The median asks a different question. Put the readings in order and take the one standing in the middle, and what you get depends on how many readings lie either side of it and not at all on how big they are, so a far-off value moves it by at most one place. The mode asks which reading turns up most, and the range asks nothing about the centre at all — it measures how far the data stretches from end to end. Four summaries, four questions. On balanced data the two centres land on the same number and the choice looks as if it does not matter. It matters exactly when the data is lopsided, which is most of the time.',
    script: [
      {
        say: 'Watch me level four piles. Twelve, six, nine and thirteen — I pour all four into one heap, which gives me forty, and I share the heap back into four equal piles of ten. Nobody had ten. Ten is not in the data at all, and it is still the honest answer to "what would each pile hold if they all held the same?" That is the mean, and that is the whole move.',
        visual: 'The four unequal piles as bars, and beneath them the same total drawn as four equal bars.',
        figure: barModel(
          [
            { label: 'the four piles as they stand', segments: [{ value: 12, label: '12' }, { value: 6, label: '6' }, { value: 9, label: '9' }, { value: 13, label: '13' }], total: '40' },
            { label: 'the same total, levelled', segments: [{ value: 10, label: '10' }, { value: 10, label: '10' }, { value: 10, label: '10' }, { value: 10, label: '10' }], total: '40' },
          ],
          { scaleMax: 40, alt: 'one bar carrying parts of 12, 6, 9 and 13 that come to 40, with a second bar of the same length below it cut into four equal tens' },
        ),
      },
      {
        say: 'Now drop one huge pile in beside them. Twelve, six, nine, thirteen and sixty. The heap is now a hundred, shared across five piles, so the mean is twenty. Look at what that number is telling you: four of the five piles are nowhere near it. The mean did not lie to you. It used every value, exactly as it promised, and one of those values was sixty.',
        visual: 'The five piles against a marked line showing where the level of twenty falls.',
        figure: barModel(
          [
            { label: 'the five piles as they stand', segments: [{ value: 12, label: '12' }, { value: 6, label: '6' }, { value: 9, label: '9' }, { value: 13, label: '13' }, { value: 60, label: '60' }], total: '100' },
            { label: 'the same total, levelled', segments: [{ value: 20, label: '20' }, { value: 20, label: '20' }, { value: 20, label: '20' }, { value: 20, label: '20' }, { value: 20, label: '20' }], total: '100' },
          ],
          { scaleMax: 100, alt: 'one bar carrying parts of 12, 6, 9, 13 and 60 that come to 100, with a second bar of the same length below it cut into five equal twenties' },
        ),
      },
      {
        say: 'Here is the summary that does not budge. I put the same five readings in order: six, nine, twelve, thirteen, sixty. The one standing in the middle is twelve. That is the median, and notice what I did NOT need — I never added anything up. I only needed to know how many readings lie on each side. Push the sixty up to six hundred and the middle reading is still twelve, because ordering does not care how far away a value is, only which side of the middle it sits on.',
        visual: 'The five readings written in order along a line, with the middle one marked.',
        figure: barModel(
          [
            { label: 'the five readings, put in order', segments: [{ value: 6, label: '6' }, { value: 9, label: '9' }, { value: 12, label: '12' }, { value: 13, label: '13' }, { value: 60, label: '60' }] },
          ],
          { scaleMax: 100, alt: 'one bar built from the five readings in order, 6, 9, 12, 13 and 60, with 12 standing third of the five' },
        ),
      },
      {
        say: 'One habit before any of the arithmetic. I look down the data for a value that is nothing like the others, and I call the two centres apart before I work either of them out. If one reading is miles above the rest, the mean is going to come out above the middle reading, and it is going to come out roughly where the level of the heap falls, not where most of the piles are. So if my mean lands tucked in among the ordinary readings after I have spotted a monster in the list, I have not been lucky. I have made a mistake, and I go and find it rather than believing the page.',
        visual: 'The five readings with the middle one marked and the levelled height drawn well above it.',
        figure: barModel(
          [
            { label: 'the middle reading', segments: [{ value: 12, label: '12' }] },
            { label: 'the levelled height of the same data', segments: [{ value: 20, label: '20' }] },
          ],
          { scaleMax: 20, alt: 'a bar of 12 for the middle reading beside a longer bar of 20 for the level the same data shares out to' },
        ),
      },
    ],
    summary:
      'Four summaries answer four different questions about one data set. The mean is what every value would become if the total were shared out equally, so it uses every value and a single far-off value drags it. The median is the value standing in the middle once the data is ordered, so it counts how many readings lie either side and a far-off value barely moves it. The mode is the value recorded most often. The range is not a centre at all: it measures how far the data stretches from end to end. On balanced data the mean and the median land together. On lopsided data they come apart, the mean leaning towards the far-off values and the median staying with the crowd, and choosing between them means saying which question you were really asking.',
    vocabulary: [
      { term: 'mean', kidGloss: 'the value every reading would become if the total were shared out equally between them; it need not be a value anybody recorded' },
      { term: 'median', kidGloss: 'the value standing in the middle once the data is put in order, with as many readings above it as below' },
      { term: 'mode', kidGloss: 'the value recorded more often than any other' },
      { term: 'range', kidGloss: 'the distance from the smallest reading to the largest — a measure of spread, not of centre' },
      { term: 'outlier', kidGloss: 'a reading sitting far away from the rest of the data, which drags the mean and leaves the median where it was' },
    ],
  },
  guidedExamples: [
    {
      ...ge(21, 1, 'modeled', 'Five deliveries carried 17, 11, 24, 14 and 19 crates. What is the mean number of crates?', [
        {
          teacherSay:
            'Let me settle what this question is asking before I touch a single number. It is not asking which delivery was typical, and it is not asking me to pick one of the five. It is asking what every delivery would have carried if the whole load had been divided up equally between them.',
        },
        {
          teacherSay:
            'So I pour all five into one heap. Seventeen and eleven make twenty-eight, and twenty-four takes me to fifty-two, and fourteen to sixty-six, and nineteen to eighty-five. Now I share that heap between five deliveries. What does each one get?',
          expected: '17',
        },
        {
          childDo: 'Check the answer against the data: count how many of the five deliveries carried less than that, and how many carried more.',
          expected: '2 below and 2 above',
        },
      ], '17'),
      visual: 'The five loads as bars, and beneath them the same total drawn as five equal bars.',
      figure: barModel(
        [
          { label: 'the five deliveries as they came', segments: [{ value: 17, label: '17' }, { value: 11, label: '11' }, { value: 24, label: '24' }, { value: 14, label: '14' }, { value: 19, label: '19' }], total: '85' },
          { label: 'the same total, levelled', segments: [{ value: 17 }, { value: 17 }, { value: 17 }, { value: 17 }, { value: 17 }], total: '85' },
        ],
        { scaleMax: 85, alt: 'one bar carrying loads of 17, 11, 24, 14 and 19 that come to 85, with a second bar of the same length below it cut into five equal parts of 17' },
      ),
    },
    {
      ...ge(21, 2, 'completion', 'A shop logged its returns on six days: 21, 9, 30, 12, 25, 16. What is the median number of returns?', [
        {
          teacherSay: 'What has to be done to a list of readings before the middle of it means anything — and how many middles does a list of six have?',
          expected: 'put them in order; six readings have two middle values',
        },
        {
          childDo: 'Write the six in order, take the two standing in the middle, and find the value halfway between them.',
          expected: '18.5',
        },
      ], '18.5'),
      visual: 'The six readings written out in order along one bar.',
      figure: barModel(
        [
          { label: 'the six readings, put in order', segments: [{ value: 9, label: '9' }, { value: 12, label: '12' }, { value: 16, label: '16' }, { value: 21, label: '21' }, { value: 25, label: '25' }, { value: 30, label: '30' }] },
        ],
        { scaleMax: 113, alt: 'one bar built from the six readings in order, 9, 12, 16, 21, 25 and 30, with 16 and 21 standing third and fourth' },
      ),
    },
    ge(21, 3, 'prompted', 'A set of eight readings has a mean of 15. A ninth reading of 33 is added. What is the mean of all nine?', [
      {
        childDo: 'Turn the stated mean back into the total it stands for, fold the new reading into that total, then share the bigger total across the bigger set.',
        expected: '17',
      },
    ], '17'),
    {
      // Independent stage: the summaries only. Deciding WHICH summary the claim
      // needs is the task here, so drawing the levelled bars would hand over the
      // reasoning the item exists to ask for (L33).
      ...ge(21, 4, 'independent', 'Seven houses on a street sold for these amounts in thousands: 210, 195, 240, 205, 230, 220, 900. A listing claims that houses on this street sell for about 314 thousand on average. Work out both the mean and the median, then say in one sentence whether the listing is honest. Solve cold.', [
        { childDo: 'Work out both summaries before judging the claim, and decide what the 900 is doing to each of them.', expected: 'mean 314, median 220' },
      ], 'mean 314, median 220'),
      visual: 'The seven sale prices as bars on one scale. What each summary comes to is yours to work out.',
      figure: barModel(
        [
          { label: 'the seven sale prices, in thousands', segments: [{ value: 210, label: '210' }, { value: 195, label: '195' }, { value: 240, label: '240' }, { value: 205, label: '205' }, { value: 230, label: '230' }, { value: 220, label: '220' }, { value: 900, label: '900' }] },
        ],
        { scaleMax: 2200, alt: 'one bar built from seven sale prices, six of them between 195 and 240 and the last one 900; neither summary is drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: one data set read three ways (its fair share, its
    // middle, its stretch). Single-step throughout; no chain and no choice yet.
    [
      { gen: wTotal, diff: 2 },
      { gen: wShare, diff: 2 },
      { gen: wKeyedDisplay, diff: 2 },
      { gen: sitMeanBalanced, diff: 3 },
      { gen: sitMedianOdd, diff: 3 },
      { gen: sitRange, diff: 3 },
    ],
    // Day 2 — fluency + application: the mean that is not a member, the mode,
    // the two-centres discrimination, and the estimate-first recovery chain.
    [
      { gen: wRebuild, diff: 2 },
      { gen: wTotal, diff: 2 },
      { gen: sitMode, diff: 3 },
      { gen: compareTheTwoCentres, diff: 4 },
      { gen: msRecoverMissingValue, diff: 4 },
      { gen: sitMeanFractional, diff: 3 },
    ],
    // Day 3 — interleave: both discriminations sit either side of two chains of
    // different shapes, so nothing on the page announces which kind of work is
    // coming.
    [
      { gen: wShare, diff: 2 },
      { gen: discrimWhichSummary, diff: 3 },
      { gen: msAddAPoint, diff: 4 },
      { gen: sitMedianEven, diff: 3 },
      { gen: compareTheTwoCentres, diff: 4 },
      { gen: msLevelTheRun, diff: 3 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus two
    // single-step items so "it must be multi-step" never becomes the cue.
    [
      { gen: msAddAPoint, diff: 5 },
      { gen: msRecoverMissingValue, diff: 5 },
      { gen: msLevelTheRun, diff: 4 },
      { gen: sitMode, diff: 4 },
      { gen: sitRange, diff: 3 },
    ],
    // Day 5 — written: the error-analysis on the week's named slip, one data set
    // summarised two honest ways, and the claim that makes the add-a-point chain
    // a general fact rather than an accident of the numbers (+ a ramped warm-up).
    [
      { gen: wRebuild, diff: 2 },
      { gen: eaMedianOnTheLine, diff: 4 },
      { gen: twoHonestSummaries, diff: 3 },
      { gen: claimAddingAboveTheMean, diff: 4 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the phrase to watch for this week is "the average", because it names four different numbers and children hear it as one. If your child computes a mean where a median was wanted, the arithmetic is usually right and the choice is what went astray. Do not correct the number. Ask what question the answer is supposed to settle, and whether one enormous reading in the list ought to be allowed a vote in it.',
  ],
  puzzle: (r) => {
    // The week's move run BACKWARDS: a day item reduces a data set to a summary,
    // and here the summaries are given and the data set has to be rebuilt. It is
    // uniquely determined, which is the point of the second half — the smallest
    // and the range fix the two ends, the two middles are stated equal, and the
    // mean then fixes what they must be.
    //
    // `least` starts at 26 so every unknown reading is larger than any range the
    // puzzle can print, and the offset avoids the one value that would make the
    // middle reading equal the stated mean. Both are deterministic steps, not
    // redraws (kit §E2.4).
    const spread = 4 * r.int(2, 6);
    const least = r.int(26, 44);
    let step = r.int(1, spread / 2 - 1);
    if (step === spread / 4) step = step === 1 ? 2 : step - 1;
    const middle = least + 2 * step;
    const greatest = least + spread;
    const mean = (2 * least + 2 * middle + spread) / 4;
    return {
      id: 'E21-PZ-01',
      title: 'Puzzle Grove: The Readings Behind the Summaries',
      puzzleType: 'construction',
      prompt: `Four whole-number readings have a mean of ${mean} and a range of ${spread}. The smallest of the four is ${least}. Put in order, the two middle readings are the same number as each other. Write all four readings in order, smallest first. Then say why no other four whole numbers could fit all three of those facts at once.`,
      answer: {
        value: `${least}, ${middle}, ${middle}, ${greatest}`,
        acceptableForms: [
          `${least}, ${middle}, ${middle}, ${greatest}`,
          `${least} ${middle} ${middle} ${greatest}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'Which of the three facts you are given says something about all four readings at once?',
        'Turn the mean into the total it stands for, take off the two readings the other facts already fix, and share what is left between the two that are equal.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'data-from-summaries' },
  sprint: {
    skill: 'Addition within 100 — the pooling every mean opens with, before anything is shared out',
    sourceWeek: D2,
    itemCount: 20,
    scheduledDay: 2,
    templateId: 'add_within_100_facts_v1',
    params: { min: 18, max: 89 },
  },
  mastery: [
    { gen: sitRange, diff: 3 },
    { gen: msAddAPoint, diff: 4 },
    { gen: sitMedianEven, diff: 3 },
    { gen: msRecoverMissingValue, diff: 4 },
    { gen: sitMeanFractional, diff: 3 },
    { gen: msLevelTheRun, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: single-step summaries chosen so no positional habit can answer them — the range of a set of readings, the median of an even-length set (which is never one of the values printed), and a mean that comes out a quarter and so is neither a member of its data nor its median. 02/04/06: chains — rebuild a total from a stated mean and re-share it after one more value arrives, recover a value held back from a stated mean (inverse-start, with the estimate named and the held-back value never the mean itself), and level a whole run of trading across its days while a stated quantity goes deliberately unused. The two discriminations are deliberately absent: a three-option page concedes a third of a slot to a guesser before any reasoning happens, and this form certifies only where the arithmetic has to be done. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'one-average-for-all',
      description:
        'Treats "the average" as a single number a data set carries, so whichever summary is easiest to reach is offered whatever was asked. The arithmetic is usually right; the question the answer settles is not the question that was posed, and nothing on the page signals the mismatch.',
      exampleWrongAnswer: 'the mean of nine shifts offered as the typical shift, on a rota holding one full week and eight part ones',
      distractorRationale:
        'Offer a different summary of the same data, correctly described, so only reading what the question wants separates it from the right one.',
      reteachPointer: 'explanation/whyBeforeHow (four summaries, four questions) then explanation/script[1] (the mean used every value, and one of them was sixty)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'median-without-sorting',
      description:
        'Reads the median off the middle of the list as it happens to be written, without putting the readings in order first. The move looks like the definition and produces a value that is genuinely in the data, so nothing about the answer looks wrong.',
      exampleWrongAnswer: 'the median of 16, 7, 40, 35, 28 given as 40',
      distractorRationale:
        'Offer the value standing in the middle of the unsorted list, which is what the misconception genuinely produces.',
      reteachPointer: 'explanation/script[2] (put them in order first, then read the middle) then guidedExamples/E21-GE-02',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'centre-for-spread',
      description:
        'Answers a question about how far the data stretches with a summary of where it sits, or the other way round, so a range is offered for a typical reading or a median for the gap between the extremes.',
      exampleWrongAnswer: 'the spread of a firing of bowls reported as the weight standing in the middle of the ordered list',
      distractorRationale:
        'Offer the summary that reports the OTHER of the two things a data set can be asked about, described accurately, so only the question separates them.',
      reteachPointer: 'explanation/summary (the range is not a centre at all) then the Day-3 and Day-4 summary-choice items',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'spends-the-spare-count',
      description:
        'Treats every number printed on a page as an ingredient of the answer, so a count that only furnishes the scene — how many containers a trader keeps stock in — is spent on a division nobody called for. It is a habit learned honestly, from years of problems where every number stated was a number needed, and a levelling question is exactly where it starts costing marks.',
      exampleWrongAnswer: 'an even daily share worked out correctly and then shared a second time between the racks the stock sits on',
      distractorRationale:
        'Offer the number the spare count produces when it is spent on a division of its own, so the working looks finished and every printed quantity has been used.',
      reteachPointer: 'guidedExamples/E21-GE-04 (settle which summary a claim needs before computing anything), then the Day-3 and Day-4 levelling problems',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Measures of centre and spread — working out the mean, median, mode and range of a data set, reading the mean as the fair share left when unequal amounts are levelled, watching what one far-off reading does to each summary, and choosing which summary actually answers the question that was asked.',
    improvingCandidates: [
      'putting a data set in order before reading its median',
      'turning a stated mean back into the total it stands for',
      'choosing between the mean and the median when one reading sits far from the rest',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'treating each summary as the answer to its own question rather than as one interchangeable "average"',
      },
      {
        errorTag: 'procedure-slip',
        text: 'ordering the readings before taking the middle one, so the median is read off the data and not off the page',
      },
      {
        errorTag: 'representation-misread',
        text: 'telling apart the two things a data set can be asked — where it sits, and how far it spreads',
      },
      {
        errorTag: 'task-comprehension',
        text: 'sorting the numbers a question needs from the ones that only furnish the scene, and spending nothing on the second kind',
      },
    ],
    homeFocus: {
      praiseLine:
        'You sorted the readings before you took the middle one, and you checked what the one enormous value was doing to the mean before you trusted it — those are the two habits the whole week rests on.',
      questionForChild:
        'If four friends have 3, 4, 5 and 12 stickers and they share them all out equally, how many does each end up with — and would you call that a typical number of stickers to own?',
      schoolSyncHook:
        'If your child\'s class says "average" for the mean, or writes the median as the middle value of an ordered list, tell us which words they use and we will match them.',
    },
    vocabularyForParent: [
      'mean (the fair share left when a total is divided equally between the readings)',
      'median (the middle reading once they are put in order)',
      'range (how far the data stretches from smallest to largest — a spread, not a centre)',
    ],
  },
});
