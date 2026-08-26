/**
 * Level E · Week 22 — "Data displays" (conceptId: data-displays).
 *
 * FILL-ARCHITECTURE §6 row E22: anchor "bins group, bars count"; key multi-step
 * "reads off given displays (computable core)"; error-analysis "histogram bar
 * read as one value"; discrimination "bar graph vs histogram"; Day-5 signature
 * "build-a-histogram: flagged figure part". Flag **R** — the drawing ships as
 * `manual-review`, never as a faked computable answer (§7).
 * Catalog: "Histograms, box plots, dot plots; shape of distributions", Day-5
 * "Misleading-display detective: same data, two stories".
 *
 * THE WEEK'S CLAIM. A display is a DECISION ABOUT HOW TO GROUP, and the two
 * displays this week sets against each other make opposite decisions.
 *
 *  - A bar graph's bars stand over NAMES. Each bar carries its own name with it,
 *    so the bars can be dealt out in any order at all and every question the
 *    display can answer still gets the same answer.
 *  - A histogram's bars stand over RANGES cut out of a number line. Put them in
 *    another order and no single reading becomes false — but the number line is
 *    gone, and with it adjacency, "the next band along", and the shape. The
 *    shape is the only thing you built a histogram for.
 *  - So a histogram bar answers "how many lie inside this range" and never "what
 *    is this one reading". A question covering two bands needs two bars joined,
 *    which is the whole of the week's arithmetic.
 *  - And because the bands are a choice, the SAME readings grouped at a
 *    different width tell a different story. Neither display is lying. That is
 *    what makes a display something to interrogate rather than read, and it is
 *    the Day-5 task.
 *
 * ---------------------------------------------------------------------------
 * SEVEN AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3). Four
 * are forced by MEASURED properties of `lib/stats.ts`, reported upward and NOT
 * fixed here (lib/ is not this week's to edit).
 *
 *  1. THE RECIPE'S OWN DISCRIMINATION IS NOT SERVED, AND THIS IS THE SIXTH
 *     CONSECUTIVE LEVEL-E WEEK ABLE TO SAY SO WITH A MEASUREMENT.
 *     `stats.barGraphVsHistogram` has ONE distinct option set across 4,000
 *     draws — three fixed texts — and only TWO of them are ever keyed:
 *
 *         "the bar graph"                          50.2%
 *         "the histogram"                          49.8%
 *         "either one, they show the same thing"    0.0%   (offered 4000/4000)
 *
 *     The dead card is a LEGITIMATE lure by the corpus's own test — a bar graph
 *     and a histogram never do show the same thing, so no draw can make it true
 *     — but it is not in `DECLARED_LURES`, and a child who meets the item twice
 *     strikes it out unread and is answering a coin flip. Text length carries
 *     nothing either way (both live cards are thirteen characters), which is why
 *     `bb-answer-entropy-test` reports the item clean.
 *
 *     `discrimWhichDisplay` below does not delete the card; it makes it
 *     KEYABLE, by drawing the QUESTION rather than the display. One of the three
 *     questions is about a range, one is about a name, and one — how many people
 *     took part — is answerable off either display, because both group the same
 *     people and so must agree on how many there are. The dead card becomes the
 *     truth on a third of draws, and it becomes true for the one fact the two
 *     displays genuinely share.
 *
 *  2. THE DISCRIMINATION ASKS WHICH DISPLAY YOU WOULD HAVE TO BE HANDED, and
 *     that wording is load-bearing rather than decorative. Asked plainly "which
 *     display would you read to find how many took part?", the card "the
 *     histogram" is TRUE — you can total its bars — so the draw would ship an
 *     item with two right answers and nothing in the battery would say so (kit
 *     §E2.7; E17 enumerated and dropped every such triple for the same reason).
 *     Asked which display you would HAVE to be handed, exactly one card is true
 *     on every draw: the range questions need the histogram, the name questions
 *     need the bar graph, and the total needs neither in particular.
 *
 *     Two further hardenings, both from the same reading. The cards are bare —
 *     "either one", not "either one, they show the same thing" — because a card
 *     carrying its own argument is the only one with a clause, and because that
 *     clause is a TRUE sentence offered as a wrong answer on two-thirds of
 *     draws; the argument belongs in `rationale`, which this factory has for
 *     exactly that. And each card is reachable through TWO question surfaces
 *     rather than one, so the item is not a three-row lookup table a child has
 *     seen out after two packs. It cannot be diluted to nothing — the question's
 *     subject names the display's variable, and there is no way to ask about a
 *     range without time words — which is why it is served ONCE per pack and
 *     certifies nothing (E21 decision 5b: a three-option page concedes a third
 *     of a slot before any reasoning happens).
 *
 *     No count is printed anywhere in the item, so the two displays cannot
 *     disclose two different totals and the "either one" card cannot be checked
 *     false against a survey that could not exist.
 *
 *  3. THE PROBE IS DECIDED BY A DRAWN WORD AND CARRIES NO MAGNITUDE AT ALL.
 *     E15 established that a probe about a SIZE cannot be made unguessable while
 *     it stays estimable (six variants, 200,000 rows each, bottoming out at
 *     62.3%); E16 established the cure — let a drawn branch decide it and print
 *     the same numerals in both branches. The obvious probe for THIS cell fails
 *     E15's test and it is worth recording why, because it looks like a shape
 *     question: "will your answer come from one bar, or from more than one?" is
 *     settled by the GAP between the two range endpoints the prompt prints, and
 *     on a bounded axis the extreme endpoints are reachable by only one span —
 *     so "a big upper edge means more than one bar" scores 59-67% depending on
 *     how many bands the display has. It is a magnitude probe in a shape
 *     costume, which is exactly E17's finding one week earlier.
 *
 *     `sitDisplayGap` instead draws WHAT THE BARS STAND OVER — four class names
 *     or four bands of step count — prints the same four heights and the same
 *     word "four" either way, and asks whether the order of the bars is a free
 *     choice or is settled for you. Both branch phrases are eleven words long
 *     (E17's standard: its two branch words are nine letters each), so branch
 *     length carries nothing either.
 *
 *     THE PREDICATE IS NOT "IS IT HONEST", and that is a repair rather than a
 *     preference. A child who reasons BETTER than the item — every band keeps
 *     its own label, so every read still comes out right, so nothing dishonest
 *     has happened — answers "yes" on the histogram branch and is marked wrong.
 *     That is a defensible answer scored as the misconception. What is actually
 *     true of a histogram is not that reordering lies but that the order is not
 *     yours to choose, and that is what the probe asks.
 *
 *     THE COMMITMENT IS CONSUMED BY THE CONTRAST, NOT BY THE ARITHMETIC, and
 *     this is the first probe in the corpus of which that is true. E17's fed the
 *     solve (a direction chooses a multiplier) and E21's fed the check (is the
 *     missing value above the mean). Here the carrier asks for the gap between
 *     the busiest group and the quietest, which is deliberately the SAME
 *     question on both branches and has the same answer — group arithmetic is
 *     display-blind. So the child predicts that the two displays differ, then
 *     finds an arithmetic that does not care, and the difference is shown to
 *     live somewhere other than in the sums. That is the week's own point and it
 *     is stated here rather than left for an auditor to call a bolted-on line.
 *
 *     "The group with the most in it" and "the fewest", never "the largest
 *     group": on the histogram branch "largest" has a second reading — the band
 *     of longest journeys, the rightmost bar — and on the bar branch it has
 *     only one, so the ambiguity would be branch-asymmetric.
 *
 *  4. THE RECIPE'S ERROR-ANALYSIS IS NOT DERIVABLE, AND THE REASON IS NOT THE
 *     ONE IT LOOKS LIKE. The recipe names "histogram bar read as one value" — a
 *     question spanning two bands (correct = c0 + c1) answered with one band
 *     (wrong = c1). `errorAnalysis` refuses an authored wrong number; both
 *     values come from a REGISTERED `verifyFor`. The first pass here concluded
 *     that no operand pair solves it. THAT IS FALSE, and the next author would
 *     find the counterexample in ten minutes, so it is written out:
 *     `d_verify_binop_misconception_v1` computes binop(a, b, op) against
 *     binop(a, b, wrongOp), and with a = c0 and b = c1 — both of which have a
 *     referent, they are the two printed band counts — there are two solutions:
 *
 *         c0 = 2·c1, op '+' against '-'   → correct = 3c1,      wrong = c1
 *         c0 = c1²,  op '+' against '/'   → correct = c1² + c1, wrong = c1
 *
 *     Both are real identities and both are unservable, for reasons this
 *     programme exists to catch. Over counts drawn 3-18 the first family admits
 *     seven pairs (6/3, 8/4, 10/5, 12/6, 14/7, 16/8, 18/9) and correct ÷ wrong
 *     takes exactly ONE value across all seven: three. So "treble what the
 *     student wrote" scores 100% after a single exposure, and every page is
 *     fingerprinted by a first band exactly twice its neighbour. The second
 *     family admits TWO pairs in the whole range (9/3 and 16/4). Unlike C4's
 *     borrow-across-zero identity — where the constrained operand family is the
 *     misconception's own natural habitat — these constraints have no relation
 *     to the error being narrated. They are an algebraic alibi.
 *
 *     So the misconception is RELOCATED, per kit §E2.3's third option: into the
 *     Day-5 always/sometimes/never claim, into the discrimination's rationales,
 *     into the mistake bank, and above all into the live items — `sitBandSpan`
 *     and `msSpanThenCompare` make joining two bands the ordinary work of the
 *     week, four times over, which is a better cure than one page about it.
 *
 *  5. WHAT SHIPS IN ITS PLACE IS THE FIRST USE OF A REGISTERED, NEVER-CALLED
 *     TRUTH — AND ITS DRAW IS REPAIRED HERE. `stat_verify_graph_read_v1` (the
 *     named entry's value against the display's tallest) is registered and no
 *     week has ever called it; the same situation E17 found with
 *     `ratio_verify_stacked_pct_v1`. Its library wrapper `eaTallestBarRead`
 *     CANNOT be served, and the defect is new:
 *
 *         drawParams names `index = order[order.length - 1]`, and `order` sorts
 *         DESCENDING — so the bar the question names is the SHORTEST of the
 *         three on every draw. Measured over 4,000 draws the true answer is the
 *         minimum of three distinct values from 3-14: 3 on 25.3%, 4 on 20.2%,
 *         5 on 16.0%, … 12 on 0.4% — which is exactly the analytic
 *         C(11,2)/C(12,3) = 25.0% and C(10,2)/C(12,3) = 20.45%. "Write the
 *         smallest number printed" scores 100%, and the number the student is
 *         shown is always the largest.
 *
 *     This is the SAME defect the 2026-08-15 sweep repaired in
 *     `tallestVsAskedBar`, whose own comment records the repair ("The question
 *     always named the SHORTEST bar … The named bar is now drawn from the two
 *     that are not the tallest"). Its error-analysis twin was left behind.
 *     Reported, not edited. `eaBandNamedNotRead` below applies that same repair
 *     locally: the named band is drawn from the three that are NOT the tallest,
 *     which is also what the verify's own guard requires.
 *
 *     BE HONEST ABOUT WHAT THE ITEM IS. The transform is B23's — reads the
 *     tallest bar rather than the bar named — and putting interval labels on the
 *     axis changes the display, not the misconception. It is the best available
 *     host: `graph_scale` needs a key a histogram has not got, `median` and
 *     `next_trial` belong to E21 and E23, and `ratchain` is correct-only. So it
 *     ships on Day 5, once, and CERTIFIES NOTHING — the week's own misconception
 *     is carried by decision 4's relocation, not by this page.
 *
 *  6. THE COMPUTABLE CORE IS AUTHORED HERE, BECAUSE THE LIBRARY'S IS LEAKY AND
 *     SPEAKS ONCE. `stats.histogramBinRead` is the recipe's own core item and it
 *     is unserved in the corpus. Over 4,000 draws its answer, c0 + c1, IS a
 *     numeral its own prompt prints on 22.6% of them — the band edges are
 *     multiples of five or ten and the counts run 3-18, so the collision is
 *     structural rather than unlucky. And its prose is FIXED: every serving is
 *     the same sentence about reading times and readers, so two servings in one
 *     pack read as a page nobody proofread (L24) — and "readers … books" is
 *     E21's `modeOfSet`, one week earlier.
 *
 *     Every histogram item below therefore draws its frame from a pool of four
 *     and clears its own answer off the page by `clearOfThePage`, a bounded
 *     deterministic walk of ONE drawn count (kit §E2.4 — never a redraw loop,
 *     which would consume a variable number of rng values and make every later
 *     item in the pack depend on this one).
 *
 *  7. WHAT THE LOCAL DECISION ITEMS MEASURE. Read off SERVED packs, never off
 *     the draw (L39), because a balanced draw and a balanced page are different
 *     things once the pack-level uniqueness filter sits between them.
 *
 *       - the probe, 2,400 served items: free 50.4% / settled 49.6%. Blind
 *         habits at chance: always-free 50.4%, big-gap 49.2%. The two other
 *         habits cannot be expressed at all rather than merely scoring badly,
 *         and that is the stronger statement: across every served item the
 *         branch phrase has ONE distinct word count (eleven), three character
 *         lengths within two of each other (50/51/52), and ZERO digits either
 *         way, so branch length and numeral count have nothing to read.
 *       - `discrimWhichDisplay`, 3,600 served items over THREE DISJOINT seed
 *         lattices: the histogram 34.0% / the bar graph 33.6% / either one
 *         32.4%, against a 33.3% floor — a best single card 0.7 points over
 *         chance. The six question surfaces are flat (χ² 0.98 and 11.16 on 5 df
 *         across the two independent lattices, against an 11.07 critical value),
 *         and `r.pick` over a six-element array was measured uniform in its own
 *         right at 16.58–16.77% over 300,000 draws. Key position 33.5 / 33.8 /
 *         32.8.
 *
 *         THREE LATTICES BECAUSE THE FIRST ONE LIED, and the lesson is about
 *         measurement rather than about this item. Sampled on seeds i·7919+11
 *         the six surfaces split cleanly at the array's midpoint — entries 0–2
 *         at ~18.0% and entries 3–5 at ~15.3% — and it reproduced at 800, 1,600
 *         and 1,200 packs, which reads as systematic until you notice those
 *         three runs are NESTED samples of one lattice and not three
 *         replications. On genuinely disjoint seeds the split vanishes. A
 *         measurement repeated on a prefix of its own seeds has been repeated
 *         zero times.
 *       - `displayClaimASN`, 1,200 served items: always 32.3%, never 34.3%,
 *         sometimes 33.4% — so "answer sometimes and read nothing" sits at
 *         chance.
 *       - the mastery slots, 2,400 forms each: key-in-prompt 0.0% on all six.
 *         Key-is-largest 0.0 / 23.4 / 42.6 / 0.0 / 64.1 / 0.0 and
 *         key-is-smallest 0.0 / 0.0 / 0.0 / 0.0 / 0.0 / 20.9. Slot 05 keys an
 *         answer larger than every printed numeral on 64.1% of forms because it
 *         joins three bands against band edges that are often smaller; it is
 *         structural rather than exploitable, since every slot on this form is
 *         free-entry and knowing an answer is large names no number.
 *
 *  8. WHAT THIS WEEK DOES NOT COVER, DECLARED RATHER THAN QUIETLY DROPPED. The
 *     catalog line reads "Histograms, box plots, dot plots; shape of
 *     distributions". Histograms are the week. Dot plots are covered as the
 *     display that keeps every reading — the Day-5 task hands the child a raw
 *     list and has them build from it, which is the dot plot doing its only job
 *     in a codebase with no chart primitive. BOX PLOTS ARE OMITTED, on two
 *     grounds: there is no figure primitive to draw one, and — decisive — no
 *     week in the corpus has taught a quartile. E21 taught mean, median, mode
 *     and range and nothing else, so a box plot here would be five numbers
 *     pretending to be a picture, resting on a statistic no child has met. It
 *     belongs after a quartile cell exists. Owner decision, reported not taken.
 *
 *     THE ANCHOR ALSO DIVERGES FROM THE RECIPE'S WORDING and that is deliberate.
 *     "Bins group, bars count" names two roles inside one histogram; this week
 *     is about two DISPLAYS, and a child reading "a bin counts" stalls on it,
 *     since a bin is a range and it is the bar over it that counts. "A bar
 *     stands over a name, a bin stands over a range" is the same idea said so
 *     that it can be repeated back.
 *
 * ---------------------------------------------------------------------------
 * ANSWER-IN-PROMPT AUDIT, measured per generator over 1,200 servings of each.
 * `sitBandRead` keys a number its own prompt prints on 100.0% of them and always
 * will: reading one band off a stated display IS the task, exactly as
 * `graphRead('value','bar')` does at 100%. It is confined to Days 1 and 3, where
 * the band is being established, and it certifies nothing. Every other generator
 * measures 0.0% — `sitBandSpan`, `sitWholeSurvey`, `sitDisplayGap`,
 * `msSpanThenCompare`, `msRecoverBand`, `msSpareCount`, all of them.
 *
 * `sitBandRead` IS ALSO THIS AUDIT'S LIVENESS SENTINEL, and it earned the title.
 * The first detector wrote its digit boundary as `(?![\d.,])`, which refuses a
 * match followed by a full stop — and the last band of every display is followed
 * by one. It reported `sitBandRead` at 79.4% instead of 100%, and since that
 * item's answer is on the page BY DEFINITION, the shortfall could only be the
 * detector. Repairing it to a plain digit boundary took the sentinel to 100.0%,
 * and every 0.0% above is a reading from the repaired detector. A gate that
 * cannot be seen to fire has not been seen to pass.
 *
 * Retrieval reaches back to the three things a display is made of: C23's key,
 * where a mark on a page and the amount it stood for came apart for the first
 * time; E21's range and median, the summaries a shape is worth comparing
 * against; and D2's addition, which is what joining two bands actually is.
 */

import { asWarmup, addWhole, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel } from '../lib/figures';
import { drawUniqueItem } from '../lib/guard';
import { makeChoices, numberWords } from '../shared';
import { clearOfPage, distinctSet, graphRead, medianOfSet, rangeOfSet } from '../lib/stats';
import type { ItemDraft } from '../shared';
import type { ItemGen } from '../lib/multistep';
import type { ErrorTag } from '../../../types';
import type { Rng } from '../../rng';

const ge = makeGe('E');

const C23 = { level: 'C' as const, week: 23 };
const D2 = { level: 'D' as const, week: 2 };
const E21 = { level: 'E' as const, week: 21 };

// ---------------------------------------------------------------------------
// The displays this week states in prose
//
// FOUR FRAMES, not one (decision 6). The library's own histogram item speaks a
// single fixed sentence, and this week serves a histogram on every working day.
// Each frame binds what was measured to the unit it was measured in and to the
// noun being counted, so a band width is always a plausible width for the thing
// it cuts up — five minutes of waiting, fifty grams of litter.
//
// None of the four collides with a sibling week. B23 counts kinds of creature
// found on a walk, C23 owns every scaled pictograph and the books/laps/tickets/
// litres subjects with them, and E21 counts visitors, bowls, crates and a
// trading run. `canteen`, `pedometer`, `litter` and `stopwatch` return no hits
// anywhere in the weeks directory.
// ---------------------------------------------------------------------------

interface HistFrame {
  /** Opens the sentence, so it must take "A"/"An" correctly on its own. */
  subject: string;
  act: string;
  unit: string;
  counted: string;
  /** Band widths that suit the unit; the base is always zero for these four. */
  widths: readonly number[];
}

const CANTEEN: HistFrame = { subject: 'A canteen', act: 'timed how long each child waited at the counter', unit: 'minutes', counted: 'children', widths: [5, 10] };
const LITTER: HistFrame = { subject: 'A litter-pick', act: 'weighed what every pair brought back', unit: 'grams', counted: 'pairs', widths: [50, 100] };
const SCREEN: HistFrame = { subject: 'A screen-time log', act: 'recorded what each pupil used after supper', unit: 'minutes', counted: 'pupils', widths: [10, 15] };
const STOPWATCH: HistFrame = { subject: 'A stopwatch', act: 'timed every entrant over one short course', unit: 'seconds', counted: 'entrants', widths: [5, 10] };
const DOORSTEP: HistFrame = { subject: 'A questionnaire', act: 'asked how far every household walks to the corner shop', unit: 'metres', counted: 'households', widths: [100, 200] };
const SWIM: HistFrame = { subject: 'A sponsored swim', act: 'timed how long each swimmer stayed in', unit: 'minutes', counted: 'swimmers', widths: [5, 10] };

/**
 * What the Day-5 error-analysis may draw. It is the only generator here that
 * draws its frame rather than owning one — and the CANTEEN is deliberately not
 * on the list: Day 5's build-and-compare task is a canteen by fixed prose, and
 * this is the only other display item on that page.
 */
const EA_FRAMES: readonly HistFrame[] = [LITTER, SCREEN, STOPWATCH, DOORSTEP, SWIM];

/**
 * ONE FRAME PER GENERATOR, ASSIGNED RATHER THAN DRAWN — and reading a served
 * week is what forced it. With all six in one pool and every item picking
 * independently, seed 90210 opened THREE of Day 4's four items with "A stopwatch
 * timed every entrant over one short course", and seed 4242 ran two litter-picks
 * on the same page. Clustering is what independent draws from a small pool do;
 * hoping for spread is not a design.
 *
 * Binding a frame to a generator makes the property structural instead: no two
 * items on any day come from the same generator, so no day can open twice on one
 * scene. What a generator's own servings share is the opening sentence, and they
 * differ in band width, in every count and in the question — which is exactly
 * what `rangeOfSet` and `medianOfSet` already do across the corpus.
 *
 * The error-analysis is the exception and draws from `EA_FRAMES`, because it is
 * the only display item on Day 5 apart from the fixed canteen task it must not
 * collide with. Measured after all of this: 0 of 2,500 served day pages open two
 * items on one scene, down from 90.
 */

/**
 * A PEDOMETER STUDY IS NOT IN THAT POOL, and reading a served week is why. The
 * probe carrier below is always a step study, and while the pool held one too,
 * seed 4242 served four pedometer items across Days 2, 3 and 4 — the shared-pool
 * constraint E16 recorded (its `RATES` pool is drawn by three generators, so its
 * day plan carries at most one RATES item a day). The carrier owns the step
 * study outright and the reading items never touch it.
 */

/** "0–4", "5–9", … — the band a bar stands over, written as a child reads it. */
const bandLabel = (i: number, width: number): string =>
  `${fmtInt(i * width)}–${fmtInt((i + 1) * width - 1)}`;

/** The display, stated: every band and what it holds. */
const bandList = (counts: readonly number[], width: number): string =>
  counts.map((c, i) => `${bandLabel(i, width)} holds ${fmtInt(c)}`).join(', ');

/**
 * Every numeral a display's sentence prints APART from the band counts: the band
 * width, both edges of every band, and the two edges a two-band or three-band
 * stretch is quoted between. The counts are handled separately, because they are
 * what `clearOfThePage` is allowed to move.
 */
const displayNumerals = (width: number, bands = 4): number[] => {
  const out = [width];
  for (let i = 0; i <= bands; i++) {
    out.push(i * width, i * width - 1);
  }
  return out;
};

/**
 * Replace ONE drawn count so that the answer is not a numeral the prompt already
 * prints.
 *
 * The count's own range is walked from the value that was drawn and the first
 * legal replacement is taken, so this is a bounded DETERMINISTIC step and never
 * a redraw loop — a loop consumes a variable number of rng values and would make
 * every later item in the pack depend on this one (kit §E2.4, L19). Distinctness
 * of the four counts is preserved, so no band is ever a twin of another and the
 * display still reads as four different heights.
 *
 * If no replacement clears the page the drawn counts stand rather than the build
 * failing. Walking only ONE count left a residue the range could not always
 * clear — 2 leaks in 3,200 served `sitDisplayGap` items, which is a mastery slot
 * — so every slot is tried in turn. Measured after: 0.0% on every generator.
 */
// HOISTED 2026-08-25: this helper now lives in lib/stats.ts as `clearOfPage`,
// byte-for-byte (pack-hash verified at the move), because histogramBinRead
// needed the identical walk and a second copy is how twins drift apart. The
// design history — why every slot is tried, why the walk is deterministic,
// why printedBy is the caller's — moved with it.
const clearOfThePage = clearOfPage;

const COUNT_LO = 4;
const COUNT_HI = 19;

/** A width and four band counts for a generator's OWN frame (see above). */
function drawDisplay(r: Rng, frame: HistFrame): { frame: HistFrame; width: number; counts: number[] } {
  return { frame, width: r.pick(frame.widths), counts: distinctSet(r, 4, COUNT_LO, COUNT_HI) };
}

/**
 * A quantity in this week's own units, grouped the way the band labels are.
 * `countNoun` alone prints a bare 1000 while `bandList` prints 1,000–1,999 from
 * `fmtInt`, so one served page carried "equal bands 1000 steps wide: 0–999 holds
 * 12, 1,000–1,999 holds 9" — the same quantity spelled two ways in one sentence.
 * Found by reading the pack; no gate looks at grouping consistency.
 */
const measure = (n: number, unit: string): string => countNoun(fmtInt(n), unit);

const displaySentence = (frame: HistFrame, width: number, counts: readonly number[]): string =>
  `${frame.subject} ${frame.act}. The ${frame.counted} are grouped into equal bands ${measure(width, frame.unit)} wide: ${bandList(counts, width)}.`;

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
// ---------------------------------------------------------------------------

/**
 * C23 — a scaled display, where a mark on the page and the amount it stood for
 * came apart. `value` rather than `combine`: E21 already spends `combine` on its
 * own C23 warm-up, and the two register different templates, so Level E does not
 * retrieve the same cell the same way a fortnight running. `difference` was
 * ruled out by measurement — a gap of one symbol times the key IS the key, which
 * the prompt prints, so its answer stands in its own question on 32.3% of draws.
 */
const wKeyedRead = asWarmup(graphRead('value', 'pictograph'), C23);
/** D2 — the join. Reading a range off a histogram is this and nothing else. */
const wJoin = asWarmup(addWhole(126, 489), D2);
/** E21 — the spread, which is what a shape is first compared against. */
const wSpread = asWarmup(rangeOfSet({ n: 5 }), E21);
/**
 * E21 — the middle reading, at EVEN length deliberately. E21's own header
 * records `medianOfSet({ n: 5 })` putting its answer first in the printed list
 * on 41.1% of draws; at n = 6 the median is the average of the two middles, is
 * never a member of the data at all, and every positional reflex measures 0.0%.
 */
const wMiddle = asWarmup(medianOfSet({ n: 6 }), E21);

// ---------------------------------------------------------------------------
// The computable core — one band, two bands, the whole survey
// ---------------------------------------------------------------------------

/**
 * ONE BAND. MEASUREMENT, and the floor the rest of the week stands on: the bar
 * over 10-14 does not report a reading of 10, or of 14, it reports how many
 * readings landed anywhere in between.
 *
 * It keys a number its own prompt prints, on every draw and by definition — the
 * display states every band, and finding the named one is the task (decision 6's
 * audit). So it is taught and practised and never certified, for the same reason
 * E21 keeps the mode off its mastery form.
 */
const sitBandRead = situation({
  situationType: 'measurement',
  cognitiveOp: 'hist-band-read',
  draw: (r) => {
    const { frame, width, counts } = drawDisplay(r, CANTEEN);
    const index = r.int(0, 3);
    return {
      prompt: `${displaySentence(frame, width, counts)} How many ${frame.counted} are in the band ${bandLabel(index, width)}?`,
      answerValue: String(counts[index]),
      templateId: 'stat_graph_value_v1',
      params: { counts, key: 1, index },
      units: frame.counted,
      hints: [
        'Does one bar of this display stand for a single reading, or for everybody whose reading landed inside one stretch?',
        'Find the band the question names along the bottom, then read how many that band holds.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

/**
 * TWO BANDS. COMBINE, and the recipe's computable core, authored here for the
 * reasons in decision 6. The question names a range that covers two bands, so
 * one bar cannot answer it — which is the misconception the recipe wanted an
 * error-analysis for, met as ordinary work instead (decision 4).
 *
 * The pair is drawn from the three adjacent pairs, so the answer is not pinned
 * to the low end or to the two tallest, and the sum is walked clear of every
 * numeral the display prints. No leak: measured 0.0% key-in-prompt on the served
 * week, against 22.6% for the library item this replaces.
 */
const sitBandSpan = situation({
  situationType: 'combine',
  cognitiveOp: 'hist-span-read',
  draw: (r) => {
    const { frame, width, counts: drawn } = drawDisplay(r, LITTER);
    const first = r.int(0, 2);
    const counts = clearOfThePage(
      drawn, first + 1, COUNT_LO, COUNT_HI,
      (c) => c[first] + c[first + 1],
      (c) => [...c, ...displayNumerals(width)],
    );
    return {
      prompt: `${displaySentence(frame, width, counts)} How many ${frame.counted} are in the two bands running from ${fmtInt(first * width)} up to ${fmtInt((first + 2) * width - 1)}?`,
      answerValue: String(counts[first] + counts[first + 1]),
      templateId: 'stat_graph_total_v1',
      params: { counts, key: 1, indices: [first, first + 1] },
      units: frame.counted,
      hints: [
        'How many of the bands does the stretch in this question cover — one of them, or more than one?',
        'Settle which bands lie inside the stretch, then gather what those bands hold and nothing else.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

/**
 * THE WHOLE SURVEY. PART-WHOLE, and the fact the two displays share: every
 * reading falls into exactly one band, so the bands added together are the
 * survey. It is also what makes the discrimination's third card true, computed
 * rather than asserted.
 */
const sitWholeSurvey = situation({
  situationType: 'part-whole',
  cognitiveOp: 'hist-whole-survey',
  draw: (r) => {
    const { frame, width, counts: drawn } = drawDisplay(r, SCREEN);
    const counts = clearOfThePage(
      drawn, 3, COUNT_LO, COUNT_HI,
      (c) => c[0] + c[1] + c[2] + c[3],
      (c) => [...c, ...displayNumerals(width)],
    );
    return {
      prompt: `${displaySentence(frame, width, counts)} How many ${frame.counted} were recorded in the whole study?`,
      answerValue: String(counts[0] + counts[1] + counts[2] + counts[3]),
      templateId: 'stat_graph_total_v1',
      params: { counts, key: 1 },
      units: frame.counted,
      hints: [
        'Can a single reading be counted in two of these bands at once, or does each one have exactly one home?',
        'Take the bands in turn and gather what each of them holds, leaving none of them out.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// The commitment, made before any arithmetic (the metacog carrier, decision 3)
// ---------------------------------------------------------------------------

/**
 * TWO STUDIES, not one, and reading a served week is why: with a single study
 * the item printed the identical sentence on two consecutive days about half the
 * time, since the branch is a coin flip and everything else was fixed. Both
 * branch phrases in BOTH studies are exactly eleven words long and every one of
 * them spells "four" as a word, so no numeral and no sentence length moves with
 * the answer (decision 3).
 */
const GAP_STUDIES = [
  {
    subject: 'A pedometer study',
    names: 'one bar for each of the four classes that took part',
    bands: 'one bar for each of the four bands of steps walked',
    // NOT "walkers": e04 and e15 both stage one at this level, and a Level-E
    // noun repeated three times inside seven weeks is the L24 shape even where
    // the scenes differ. Found by the collision scan, which runs at the end.
    counted: 'children',
  },
  {
    subject: 'A sunshine record',
    names: 'one bar for each of the four streets that took part',
    bands: 'one bar for each of the four bands of sunlit minutes',
    counted: 'gardens',
  },
] as const;

/**
 * A display whose bars stand over NAMES or over RANGES, drawn. COMPARISON, and
 * the week's metacognition carrier — served ONLY through the wrapper below
 * (kit §E2.2), so its ladder is spent once.
 *
 * The two branch phrases are eleven words each and the numeral multiset is
 * identical: both print "four" and the same four heights. Nothing about a size
 * on the page moves with the answer, and nothing about the length of a sentence
 * does either.
 *
 * No leak: the gap between the busiest band and the quietest is walked clear of
 * all four heights, so the answer is never a number the display states.
 */
const sitDisplayGap = situation({
  situationType: 'comparison',
  cognitiveOp: 'display-gap',
  draw: (r) => {
    const study = r.pick(GAP_STUDIES);
    const overNames = r.int(0, 1) === 1;
    const drawn = distinctSet(r, 4, COUNT_LO, COUNT_HI);
    // Nothing but the four heights is printed as a numeral here — "four" is
    // spelled as a word in both branches, deliberately (decision 3) — so the
    // four counts are the whole of the page the answer must clear.
    const counts = clearOfThePage(
      drawn, 3, COUNT_LO, COUNT_HI,
      (c) => Math.max(...c) - Math.min(...c),
      (c) => c,
    );
    const most = counts.indexOf(Math.max(...counts));
    const fewest = counts.indexOf(Math.min(...counts));
    return {
      prompt: `${study.subject} is drawn as a display with ${overNames ? study.names : study.bands}. The bars stand at ${counts.map((c) => fmtInt(c)).join(', ')}. How many more ${study.counted} are counted in the group with the most in it than in the group with the fewest?`,
      answerValue: String(counts[most] - counts[fewest]),
      templateId: 'stat_graph_diff_v1',
      params: { counts, key: 1, i: most, j: fewest },
      units: study.counted,
      hints: [
        'Which two of the four bars does this question actually use, and does it want their sizes or the distance between them?',
        'Read the tallest bar and the shortest bar in full, then set one against the other.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

const sitDisplayGapEstimate = withEstimateFirst(
  sitDisplayGap,
  'is the order of these bars a free choice, or is it settled for you?',
);

// ---------------------------------------------------------------------------
// Discrimination — which display would you have to be handed (decisions 1, 2)
// ---------------------------------------------------------------------------

type DisplayCard = 'the histogram' | 'the bar graph' | 'either one';

/**
 * Six question surfaces, two per card, so the item is not a three-row lookup
 * table (decision 2). `needs` is what the question could not be answered
 * without; the cards below are built from it, never asserted beside it.
 *
 * EVERY ASK IS SPELLED IN WORDS AND PRINTS NO DIGIT, and that is a repair rather
 * than a style. The first version wrote its band edges as numerals, so the six
 * asks did not all give the item the same numeric-token signature — and
 * `drawUniqueItem` guards on exactly that signature, so the asks carrying two
 * extra tokens collided with the rest of the pack at a different rate from the
 * asks carrying none. Measured over 400 served packs the six surfaces came out
 * at 13.0% to 19.3% against a 16.7% floor, which pushed the three CARDS to
 * 28.5 / 33.8 / 37.8. Nothing was wrong with the draw, which is uniform; the
 * skew appeared between the draw and the page. This is E17 decision 7's
 * mechanism, and spelling the edges removes it rather than dodging it: with no
 * digit in any ask, the item's signature is {commuters, width} whichever
 * question is drawn, so the filter cannot prefer one.
 */
const DISPLAY_ASKS: ReadonlyArray<{ needs: DisplayCard; ask: (w: number, mode: string) => string }> = [
  { needs: 'the histogram', ask: (w) => `how many journeys take at least ${numberWords(w)} but less than ${numberWords(2 * w)} minutes` },
  { needs: 'the histogram', ask: (w) => `how many journeys run under ${numberWords(w)} minutes` },
  { needs: 'the bar graph', ask: (_w, mode) => `how many people travel by ${mode}` },
  { needs: 'the bar graph', ask: () => 'which way of travelling was chosen by the most people' },
  { needs: 'either one', ask: () => 'how many people took part in the survey' },
  { needs: 'either one', ask: () => 'how many journeys were recorded in all' },
];

// NOT 'ferry': d07 already counts a ferry's passengers, and a survey counting
// people by how they travel is close enough to that to read as the same page.
const TRAVEL_MODES = ['bicycle', 'tram', 'moped', 'minibus'] as const;

const DISPLAY_CARDS: readonly DisplayCard[] = ['the histogram', 'the bar graph', 'either one'];

const DISPLAY_WRONG: Record<DisplayCard, { tag: ErrorTag; rationale: string }> = {
  'the histogram': {
    tag: 'concept-misconception',
    rationale:
      'Reaches for the display whose bars stand over a number line when the question names something that has no size at all. A way of travelling is a name, and a name cannot be given a place on a number line.',
  },
  'the bar graph': {
    tag: 'representation-misread',
    rationale:
      'Reaches for the display whose bars stand over names when the question asks about a stretch of the number line. Named bars cannot be cut into ranges, so no arrangement of them answers it.',
  },
  'either one': {
    tag: 'task-comprehension',
    rationale:
      'Treats the two displays as interchangeable. They group the same people, so they must agree on how many people there are — and they agree on nothing else, because each one throws away exactly what the other keeps.',
  },
};

const discrimWhichDisplay = discrimination({
  variant: 'structural',
  cognitiveOp: 'choose-display',
  draw: (r) => {
    const width = r.pick([5, 10, 15]);
    const people = r.int(40, 90);
    const mode = r.pick(TRAVEL_MODES);
    const chosen = r.pick(DISPLAY_ASKS);
    return {
      prompt: `A survey of ${countNoun(people, 'commuters')} recorded two things about every person: which way they travel, and how many minutes their journey takes. The results are drawn twice — one display carries a bar for each way of travelling, the other a bar for each band of ${countNoun(width, 'minutes')}. To find out ${chosen.ask(width, mode)}, which display would you HAVE to be handed?`,
      correct: chosen.needs,
      distractors: DISPLAY_CARDS.filter((c) => c !== chosen.needs).map((c) => ({
        text: c,
        errorTag: DISPLAY_WRONG[c].tag,
        rationale: DISPLAY_WRONG[c].rationale,
      })),
      hints: [
        'Does the thing this question asks about have a size, or is it only a name?',
        'Say what sits along the bottom of each display — names, or a number line cut into equal pieces — and keep the one the question needs.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// Chains — forward, backwards, and one carrying a quantity it never spends
// ---------------------------------------------------------------------------

/**
 * FORWARD, and the week's arithmetic at full stretch: gather a stretch that
 * covers two bands, then set it against a single band. Two operations, each
 * doing real work — the join is the thing a histogram forces and the comparison
 * is what the join was for.
 *
 * THE ANSWER IS POSITIVE BY CONSTRUCTION, and the first draft's was not. Drawing
 * four counts from one pool and asking how much MORE the stretch holds than a
 * single band assumes the stretch is the larger, and over 2,400 served items it
 * was not on 8.0% of them — minimum −10, on a served page reading "the two bands
 * under 30 minutes" holding 4 and 5 against a band holding 19. A negative key on
 * a question that cannot be asked, reaching a mastery slot; the 200-seed sweep,
 * the validator and tsc all passed it, and only asking the question directly
 * found it.
 *
 * The repair is the shape E21's `msLevelTheRun` established: the two pools
 * OVERLAP BUT DO NOT NEST. A band inside the stretch is drawn 9–19 and the band
 * it is set against 4–14, so the stretch holds at least 19 and the single band
 * at most 14 and the answer is at least 5 — while the pools still share 9–14, so
 * "the two bands being joined are the two tallest" is false often enough not to
 * be a strategy. The question names the stretch by its range in any case, so
 * which bands to join was never the child's to choose.
 *
 * No leak: the band being compared is walked inside its OWN pool until the
 * answer is not a numeral the display prints, which keeps the guarantee above
 * intact because that pool tops out below the stretch.
 */
const msSpanThenCompare = multiStep({
  situationType: 'comparison',
  cognitiveOp: 'hist-span-compare',
  draw: (r) => {
    const frame = STOPWATCH;
    const width = r.pick(frame.widths);
    const first = r.int(0, 2);
    const rest = [0, 1, 2, 3].filter((i) => i !== first && i !== first + 1);
    const other = rest[r.int(0, 1)];
    const filler = rest.find((i) => i !== other) as number;
    const tall = distinctSet(r, 2, 9, COUNT_HI);
    const low = distinctSet(r, 2, COUNT_LO, 14);
    const counts: number[] = [];
    counts[first] = tall[0];
    counts[first + 1] = tall[1];
    counts[other] = low[0];
    counts[filler] = low[1];
    const span = tall[0] + tall[1];
    // Walk the compared band across its own eleven values (kit §E2.4).
    const edges = displayNumerals(width);
    for (let k = 0; k < 11; k++) {
      const cand = COUNT_LO + ((counts[other] - COUNT_LO + k) % 11);
      const trial = counts.map((c, j) => (j === other ? cand : c));
      const ans = span - cand;
      if (!trial.includes(ans) && !edges.includes(ans)) { counts[other] = cand; break; }
    }
    return {
      prompt: `${displaySentence(frame, width, counts)} How many more ${frame.counted} are in the two bands running from ${fmtInt(first * width)} up to ${fmtInt((first + 2) * width - 1)} than in the band ${bandLabel(other, width)}?`,
      initN: counts[first],
      steps: [
        { op: 'add', n: counts[first + 1], d: 1 },
        { op: 'sub', n: counts[other], d: 1 },
      ],
      units: frame.counted,
      hints: [
        'Which part of this question is about a stretch of the number line, and which part is about a single band?',
        'Gather the bands that lie under the stated figure into one amount, then take the single band away from it.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The quantity the story hands over
 * is the RESULT of the grouping — the whole study — so the opening move is to
 * undo it, and nothing in the order the sentence is written asks for that. It is
 * also the honest converse of `sitWholeSurvey`: if the bands add to the study,
 * then the study less the bands you can see is the band you cannot.
 *
 * No leak by construction: the hidden band is drawn FIRST, at 4-19, and the
 * total is built from it, so it cannot equal a numeral the prompt prints unless
 * it collides with one of the three stated bands — which the walk removes.
 */
const msRecoverBand = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'hist-recover-band',
  posing: 'inverse-start',
  draw: (r) => {
    const { frame, width, counts: drawn } = drawDisplay(r, DOORSTEP);
    const hidden = r.int(0, 3);
    // The hidden band's own count is the answer and is NOT printed, so what it
    // must clear is the three bands that ARE printed, the study total, and the
    // band edges. The three shown counts are cleared by construction, since
    // `distinctSet` draws the four apart.
    const counts = clearOfThePage(
      drawn, hidden, COUNT_LO, COUNT_HI,
      (c) => c[hidden],
      (c) => [
        ...c.filter((_, j) => j !== hidden),
        c[0] + c[1] + c[2] + c[3],
        ...displayNumerals(width),
      ],
    );
    const shown = counts.map((c, i) => (i === hidden ? null : { i, c })).filter((x): x is { i: number; c: number } => x !== null);
    const total = counts[0] + counts[1] + counts[2] + counts[3];
    const stated = shown.map((s) => `${bandLabel(s.i, width)} holds ${fmtInt(s.c)}`).join(', ');
    return {
      prompt: `${frame.subject} ${frame.act}, and grouped the ${frame.counted} into equal bands ${measure(width, frame.unit)} wide. Altogether ${countNoun(total, frame.counted)} were recorded. Three of the four bands can still be read: ${stated}. The count for the band ${bandLabel(hidden, width)} is missing from the write-up. How many ${frame.counted} does it hold?`,
      initN: total,
      steps: [
        { op: 'sub', n: shown[0].c, d: 1 },
        { op: 'sub', n: shown[1].c, d: 1 },
        { op: 'sub', n: shown[2].c, d: 1 },
      ],
      units: frame.counted,
      hints: [
        'Which of the numbers you are given describes the whole study at once, and which describe only a part of it?',
        'Start from what the whole study holds and take away each band you can still read, one at a time.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * HAS-DISTRACTOR (PEDAGOGY-CEILING-REVIEW F3). The study states how many days it
 * ran for, that number is never used, and it is the seductive kind of spare
 * quantity — a count of occasions, in a problem whose real move is a join. A
 * child who has learned that every number printed is a number needed will divide
 * by it, and a grouped display is exactly where that habit starts costing marks.
 *
 * No leak by construction: the answer covers three of the four bands, so it is
 * larger than any single band, and it is walked clear of the day count and the
 * band edges alike.
 */
const msSpareCount = multiStep({
  situationType: 'combine',
  cognitiveOp: 'hist-span-three',
  posing: 'has-distractor',
  draw: (r) => {
    const { frame, width, counts: drawn } = drawDisplay(r, SWIM);
    const helpers = r.int(3, 9);
    // The spare count is printed too, so the answer has to clear it as well —
    // otherwise the one number the item wants left unused could BE the answer.
    const counts = clearOfThePage(
      drawn, 2, COUNT_LO, COUNT_HI,
      (c) => c[0] + c[1] + c[2],
      (c) => [...c, helpers, ...displayNumerals(width)],
    );
    return {
      prompt: `${frame.subject} ${frame.act}, with ${countNoun(helpers, 'helpers')} taking the readings. The ${frame.counted} are grouped into equal bands ${measure(width, frame.unit)} wide: ${bandList(counts, width)}. How many ${frame.counted} are in the three bands under ${measure(3 * width, frame.unit)}?`,
      initN: counts[0],
      steps: [
        { op: 'add', n: counts[1], d: 1 },
        { op: 'add', n: counts[2], d: 1 },
      ],
      units: frame.counted,
      hints: [
        'Is every number printed here a number this question needs, or is one of them only telling you about the study?',
        'Decide which bands lie under the stated figure, then gather what those bands hold and leave everything else alone.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand, including the flagged open part (§7)
// ---------------------------------------------------------------------------

/**
 * THE ERROR-ANALYSIS (decision 5). The truth comes from
 * `stat_verify_graph_read_v1`, registered since the family was written and never
 * called by any week: the value of the band the question NAMES, against the
 * value of the display's tallest band. Both numbers are code-computed and the
 * student's figure is a real misconception's real output.
 *
 * The draw carries the repair its library wrapper never received: the named band
 * is taken from the three that are NOT the tallest, so the answer is not the
 * smallest number on the page. `order` is sorted descending, so `order[0]` is
 * the tallest and the named band is drawn from `order[1..3]` — which is also
 * what the verify's own guard requires, since it refuses a named entry that IS
 * the tallest.
 *
 * The prompt states the display, the question the student was asked and the
 * figure they wrote. It does not name the move: the diagnosis is the child's
 * answer and cannot also be the question (`erroranalysis.ts` refuses a prompt
 * that hands it over).
 */
const eaBandNamedNotRead = errorAnalysis({
  verifyTemplateId: 'stat_verify_graph_read_v1',
  cognitiveOp: 'hist-band-read',
  drawParams: (r) => {
    // THE FRAME AND THE WIDTH ARE DRAWN HERE, not in `build`, because the guard
    // below has to see them. A served draw named the band 10–19 and showed the
    // student writing 19 — which is the tallest band's count AND the named
    // band's own top value, so the page admitted two defensible diagnoses and
    // nothing in the battery could say so (kit §E2.7). The figure the student is
    // shown must therefore clear every band edge. `stat_verify_graph_read_v1`
    // reads only `counts`, `key` and `index`; the two extra params ride along in
    // `generator.params` and it ignores them.
    // NOT the canteen: Day 5's build-and-compare task is a canteen by fixed
    // prose, and this is the only other display item on that page, so drawing
    // the canteen here opened Day 5 twice on one scene — 90 of 2,500 served day
    // pages before this line, and nothing but reading the page can see it.
    const frameIndex = r.int(0, EA_FRAMES.length - 1);
    const width = r.pick(EA_FRAMES[frameIndex].widths);
    const drawn = distinctSet(r, 4, COUNT_LO, COUNT_HI);
    const edges = displayNumerals(width);
    const counts = clearOfThePage(
      drawn, drawn.indexOf(Math.max(...drawn)), COUNT_LO, COUNT_HI,
      (c) => Math.max(...c),
      () => edges,
    );
    const order = [0, 1, 2, 3].sort((a, b) => counts[b] - counts[a]);
    return { counts, key: 1, index: order[r.int(1, 3)], width, frameIndex };
  },
  build: (v, p) => {
    const frame = EA_FRAMES[p.frameIndex as number];
    const width = p.width as number;
    const counts = p.counts as number[];
    const index = p.index as number;
    return {
      prompt: `${displaySentence(frame, width, counts)} Asked how many ${frame.counted} are in the band ${bandLabel(index, width)}, a student wrote ${fmtInt(Number(v.wrong))}.`,
      extension: `Write the number that band really holds, and say which band the student's figure is the count of.`,
      hints: [
        'Which band did the question point at, and is it the band that stands out on this display?',
        'Put a finger on the named band along the bottom first, and only then read how high its bar goes.',
      ],
      errorTags: ['representation-misread', 'task-comprehension'],
    };
  },
});

/**
 * THE R-FLAGGED PART, and the only honest way to ship this cell — fused with the
 * catalog's own Day-5 line, because they are one task rather than two.
 *
 * The recipe asks the child to BUILD a histogram; the catalog asks them to catch
 * a display telling a different story from the same data. Handed a raw list, a
 * child who bins it at one width and then at twice that width has done both: the
 * bin counts are fully code-keyable (they are stated in `value` for whoever
 * marks it), and what cannot be graded by recomputation is the drawing and the
 * judgement — which is precisely why this cell is R-flagged.
 *
 * THE NUMBERS ARE CHOSEN, not drawn, because the lesson lives in their shape.
 * Eighteen waits: 1, 2, 2, 3, 4, 4, 4, 7, 11, 13, 15, 16, 16, 17, 18, 18, 19,
 * 19. At five minutes wide the bands hold 7, 1, 2, 8 — two crowds with almost
 * nobody between them, which is what two sittings looks like. At ten wide they
 * hold 8 and 10, which reads as a mild drift towards longer waits and hides the
 * two crowds completely. Both displays are correct. Only one of them tells you
 * there are two sittings.
 *
 * The raw list is also this week's dot plot: in a codebase with no chart
 * primitive, the display that keeps every reading is the reading list itself,
 * and building from it is the only honest way to show what binning costs.
 */
const buildTwoDisplays = reasoning({
  prompt:
    'A canteen timed how long each of eighteen children waited at the counter. The waits, in minutes, were 1, 2, 2, 3, 4, 4, 4, 7, 11, 13, 15, 16, 16, 17, 18, 18, 19, 19. Group them into bands five minutes wide and write the four counts in order. Then group the same waits into bands ten minutes wide and write the two counts. Draw both displays, with the bands labelled along the bottom. Then say in one sentence which of the two displays a parent should be shown, and what the wider one stops anybody from seeing.',
  value:
    'five minutes wide: 7, 1, 2, 8; ten minutes wide: 8 and 10; the narrow display shows two separate crowds with almost nobody waiting in between, and the wide one hides them behind a near-even split',
  keywords: false,
  hints: [
    'Before you count anything, does a reading of exactly five minutes belong in the first band or the second?',
    'Take the waits in order and put a mark against the band each one lands in, then count the marks band by band and do it again with the wider bands.',
  ],
  errorTags: ['representation-misread', 'concept-misconception'],
});

/**
 * The always/sometimes/never item, WITH ITS CLAIM DRAWN — one claim per verdict,
 * so "answer sometimes and read nothing" sits at a third rather than at
 * everything. `items.classify` takes its three cards as config, which means a
 * week authoring a single claim ships a slot whose key never moves; E3 measured
 * exactly that and this is the shape its repair established.
 *
 * The third claim IS the anchor, put where a child has to defend it — and it is
 * the one place the week states the reorder question as a claim about both
 * displays at once rather than about the one in front of them.
 */
const ASN_CLAIMS = [
  {
    claim: 'regrouping the same readings into wider bands leaves the number of readings unchanged',
    verdict: 'always',
    demand: 'Say what becomes of a single reading when the bands around it are widened.',
    wrong: {
      sometimes: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'Allows a regrouping to lose or gain a reading on some data. Every reading still has exactly one band to fall into however the bands are cut, so nothing can go missing and nothing can be counted twice.',
      },
      never: {
        tag: 'procedure-slip' as ErrorTag,
        rationale:
          'Reads a change in the number of BARS as a change in the number of readings. Widening the bands halves how many bars there are and moves not one reading out of the study.',
      },
    },
  },
  {
    claim: 'a histogram whose bands are wider than one lets you name the exact value of a reading it counts',
    verdict: 'never',
    demand: 'Say in one sentence what a band DOES tell you about a reading inside it.',
    wrong: {
      always: {
        tag: 'representation-misread' as ErrorTag,
        rationale:
          'Reads a band as though it were a value, so a bar over a stretch of the number line is taken to report the readings inside it one at a time. It reports only how many of them there are.',
      },
      sometimes: {
        tag: 'task-comprehension' as ErrorTag,
        rationale:
          'Hopes that a band holding just one reading gives that reading away. It narrows it to a stretch and stops there; the value could be anywhere inside the band and the display has not kept it.',
      },
    },
  },
  {
    claim: 'the bars of a display can be put in a different order without losing anything the display shows',
    verdict: 'sometimes',
    demand: 'Name the display that settles it, and say what its bars stand over.',
    wrong: {
      always: {
        tag: 'concept-misconception' as ErrorTag,
        rationale:
          'Treats every display as a set of bars that happen to sit side by side. On a display whose bars stand over a number line the order is what carries the shape, and shuffling them throws the shape away.',
      },
      never: {
        tag: 'representation-misread' as ErrorTag,
        rationale:
          'Rules out reordering everywhere, when a bar carrying its own name takes that name with it — deal those bars out in any order at all and every question the display answers gets the same answer.',
      },
    },
  },
] as const;

const VERDICTS = ['always', 'sometimes', 'never'] as const;

const displayClaimASN: ItemGen = (rng, guard, difficulty) =>
  drawUniqueItem(rng, guard, (r) => {
    const c = r.pick(ASN_CLAIMS);
    const distractors = VERDICTS.filter((v) => v !== c.verdict).map((v) => ({
      text: v,
      errorTag: (c.wrong as Record<string, { tag: ErrorTag; rationale: string }>)[v].tag,
      rationale: (c.wrong as Record<string, { tag: ErrorTag; rationale: string }>)[v].rationale,
    }));
    const { choices, correctKey } = makeChoices(r, c.verdict, distractors);
    const item: ItemDraft = {
      type: 'classification',
      // THE DEMAND IS DRAWN WITH THE CLAIM, not shared. "Write one sentence
      // naming the case that settles it" is e03's, e12's and e17's, and my own
      // overlap scan matched it at 0.56 against e17 — but the stronger reason is
      // that reading the served page showed one demand cannot fit three claims:
      // "name the display that settles it" is right for the reorder claim and
      // odd for the two that are about histograms in particular.
      prompt: `Always, sometimes, or never true: ${c.claim}. ${c.demand}`,
      choices,
      answer: { value: correctKey, acceptableForms: [c.verdict], validation: 'choice-key' },
      difficulty,
      strand: 'noncomputational',
      isRetrieval: false,
      hintLadder: [
        'Which of the two displays would you try this claim on first, and would the other one agree?',
        'Try the claim on a display whose bars carry names, then on one whose bars stand over a number line, and let the pair of answers choose the verdict.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
    return item;
  });

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE22 = makeWeekBuilder({
  level: 'E',
  week: 22,
  conceptId: 'data-displays',
  conceptName: 'Data displays',
  strandTags: ['probability-statistics'],
  prerequisiteWeeks: [C23, D2, E21],
  pedagogyContract: 'v2',
  conceptualAnchor: 'a bar stands over a name, a bin stands over a range',
  conceptFamily: 'operation',
  deepeningDelta:
    'B23 and C23 built displays whose bars carried names — a kind of bird, a day of the week — and every question was answered by pointing at one bar or comparing two, with C23 adding a key so that a mark on the page and the amount it stood for came apart. E21 then took the display away entirely and reduced a whole data set to one number. E22 puts a display back and changes what the bottom of it is made of: not names any more, but a number line cut into equal bands. That single change is the week. A bar over a band cannot be asked what any one reading was, only how many landed inside it, so a question about a range that covers two bands needs two bars joined — arithmetic B23 and C23 never had to do, because a name cannot be joined to the name beside it. And because the width of the bands is a choice, the same readings grouped two ways tell two different stories, which is the first time in the ladder that a correct display can still mislead.',
  explanation: {
    hook:
      'Two displays are drawn from one survey. One of them can be cut up, shuffled and dealt back out in any order you like and it still answers every question the same way. Do that to the other one and every number on it is still right, and the thing you built it for is gone.',
    whyBeforeHow:
      'A display is a decision about how to group, and the two you meet this week decide the opposite way, so a bar stands over a name, a bin stands over a range. That is why the same shuffle does two different things to them. A bar graph counts named groups — walking, cycling, the bus — and every bar carries its own name with it, so the order they stand in is a free choice and nothing at all depends on it. A histogram counts everything falling inside a stretch of a number line: the bars stand over 0 to 4, 5 to 9, 10 to 14, and those stretches came in that order before anybody drew anything. Reorder them and you have not made any single number false, because each band still says how many landed in it. What you have destroyed is the number line, and with it which band is next to which, and with that the shape — which is the only reason anybody draws a histogram rather than writing a list. Two things follow, and they are the whole week. First, a histogram bar can never tell you what one reading was, only how many readings landed somewhere inside a band, so a question about a stretch covering two bands has to join two bars, and one bar can never answer it. Second, because the width of the bands is a choice somebody made, the same readings cut into wider bands make a different picture of the same truth. Neither picture is a lie. That is exactly what makes a display something to interrogate rather than something to read.',
    script: [
      {
        say: 'Here is a bar graph of how forty children come to school. Walking, twenty-two. Cycling, nine. The bus, six. A car, three. Now watch me do something to it. I am going to cut the four bars out and deal them back in a different order — the bus first, then walking, then a car, then cycling. Ask me anything. How many cycle? Nine. How many walk? Twenty-two. Nothing has changed, because every bar took its name with it when I moved it.',
        visual: 'The four bars of the travel survey, each labelled with a way of travelling.',
        figure: barModel(
          [
            { label: 'walking', segments: [{ value: 22, label: '22' }] },
            { label: 'cycling', segments: [{ value: 9, label: '9' }] },
            { label: 'the bus', segments: [{ value: 6, label: '6' }] },
            { label: 'a car', segments: [{ value: 3, label: '3' }] },
          ],
          { scaleMax: 22, alt: 'four separate bars of 22, 9, 6 and 3, each one labelled with a way of travelling' },
        ),
      },
      {
        say: 'Same forty children, different question. How many minutes does the journey take? I cannot draw a bar for every answer, so I cut the minutes into equal bands — nought to nine, ten to nineteen, twenty to twenty-nine, thirty to thirty-nine — and count how many children land in each. Five, eighteen, twelve, five. Now look hard at what a bar means here. The bar over ten to nineteen is eighteen high. That does not mean anybody took eighteen minutes. It means eighteen children took somewhere between ten and nineteen, and this display has thrown away which.',
        visual: 'Four bars standing over four bands of the number line, not over names.',
        figure: barModel(
          [
            { label: '0–9', segments: [{ value: 5, label: '5' }] },
            { label: '10–19', segments: [{ value: 18, label: '18' }] },
            { label: '20–29', segments: [{ value: 12, label: '12' }] },
            { label: '30–39', segments: [{ value: 5, label: '5' }] },
          ],
          { scaleMax: 18, alt: 'four bars of 5, 18, 12 and 5, labelled with the bands 0 to 9, 10 to 19, 20 to 29 and 30 to 39' },
        ),
      },
      {
        say: 'So try the shuffle on this one. I put thirty to thirty-nine first and nought to nine third. Every band still says the right number — the twelve is still the twelve. But the bands are not in order any more, so I can no longer see that the tall one has short ones either side of it, and that is the shape. The order of these bars is not mine to choose. And here is the arithmetic it forces: how many took under twenty minutes? Not one bar can tell me. Five and eighteen, joined, is twenty-three.',
        visual: 'The first two bands joined into the one amount the question asked for.',
        figure: barModel(
          [
            { label: '0–9', segments: [{ value: 5, label: '5' }] },
            { label: '10–19', segments: [{ value: 18, label: '18' }] },
            { label: 'under 20 minutes', segments: [{ value: 5, label: '5' }, { value: 18, label: '18' }], total: '23' },
          ],
          { scaleMax: 23, alt: 'a bar of 5 and a bar of 18, and beneath them one bar made of both, totalling 23' },
        ),
      },
      {
        say: 'Last thing, and it is the one to be suspicious about. I will regroup the same forty children into bands twenty minutes wide instead of ten. Nought to nineteen holds twenty-three, twenty to thirty-nine holds seventeen. Both displays are correct. But the first one showed a clear peak at ten to nineteen and the second one shows two bars of nearly the same height and no peak at all. So before I trust any display I check who chose the bands, and I ask myself what a wider band would have hidden.',
        visual: 'The same forty children at two band widths, drawn to one scale.',
        figure: barModel(
          [
            { label: 'ten wide: 0–9, 10–19, 20–29, 30–39', segments: [{ value: 5, label: '5' }, { value: 18, label: '18', fill: 'hatch' }, { value: 12, label: '12' }, { value: 5, label: '5' }], total: '40' },
            { label: 'twenty wide: 0–19, 20–39', segments: [{ value: 23, label: '23' }, { value: 17, label: '17' }], total: '40' },
          ],
          { scaleMax: 40, alt: 'a bar cut into 5, a hatched 18, 12 and 5 totalling 40, above a bar of the same length cut into just 23 and 17' },
        ),
      },
    ],
    summary:
      'A display is a decision about how to group. A bar graph counts named groups, and because every bar carries its own name, the bars may stand in any order at all without a single question changing its answer. A histogram counts everything falling inside equal bands of a number line, so its bars come in the order the number line put them, and reordering them leaves every number true while destroying the shape the display was drawn for. That is why a histogram bar never says what one reading was, only how many landed inside a band — and why a question about a stretch covering two bands has to join two bars. The bands themselves are somebody\'s choice: regroup the same readings into wider bands and every count is still correct, the total is still the same, and the picture can tell a different story. Ask who chose the bands, and ask what a wider one would hide.',
    vocabulary: [
      { term: 'histogram', kidGloss: 'a display whose bars stand over equal bands of a number line and count how many readings fall inside each band' },
      { term: 'bar graph', kidGloss: 'a display whose bars stand over names, counting how many chose each one; the bars may be put in any order' },
      { term: 'band (or bin)', kidGloss: 'one stretch of the number line a histogram groups readings into — 10 to 19 minutes, say' },
      { term: 'frequency', kidGloss: 'how many readings a band holds; it is what the height of a histogram bar tells you' },
      { term: 'the shape of the data', kidGloss: 'where the readings pile up and where they thin out, which only shows while the bands stay in order' },
    ],
  },
  guidedExamples: [
    {
      ...ge(22, 1, 'modeled', 'A histogram groups the minutes thirty children waited: 0–4 holds 6, 5–9 holds 11, 10–14 holds 9, 15–19 holds 4. How many children waited less than 10 minutes?', [
        {
          teacherSay:
            'Before I add anything, let me be sure what one of these bars is telling me. The bar over 5 to 9 is eleven high. That is not a child who waited eleven minutes — it is eleven children who each waited somewhere between five and nine, and this display is never going to tell me which.',
        },
        {
          teacherSay:
            'Now the question. Less than ten minutes. Which bands does that stretch cover — one of them, or more than one?',
          expected: 'two of them, 0–4 and 5–9',
        },
        {
          childDo: 'Join what those two bands hold, and leave the other two bands out.',
          expected: '17',
        },
      ], '17'),
      visual: 'The first two bands joined into the amount the question asked for.',
      figure: barModel(
        [
          { label: '0–4', segments: [{ value: 6, label: '6' }] },
          { label: '5–9', segments: [{ value: 11, label: '11' }] },
          { label: 'less than 10 minutes', segments: [{ value: 6, label: '6' }, { value: 11, label: '11' }], total: '17' },
        ],
        { scaleMax: 17, alt: 'a bar of 6 and a bar of 11, and beneath them one bar made of both, totalling 17' },
      ),
    },
    {
      ...ge(22, 2, 'completion', 'A litter-pick weighed what each pair brought back and grouped the pairs into bands 50 grams wide: 0–49 holds 5, 50–99 holds 8, 100–149 holds 12, 150–199 holds 6. Altogether how many pairs took part?', [
        {
          teacherSay: 'Can one pair be counted in two of these bands at the same time, or does every pair have exactly one band it belongs in?',
          expected: 'exactly one band each',
        },
        {
          childDo: 'Gather what all four bands hold, leaving none of them out.',
          expected: '31',
        },
      ], '31'),
      visual: 'The four bands drawn as parts of one whole study.',
      figure: barModel(
        [
          { label: 'the four bands, joined', segments: [{ value: 5, label: '5' }, { value: 8, label: '8' }, { value: 12, label: '12' }, { value: 6, label: '6' }], total: '31' },
        ],
        { scaleMax: 31, alt: 'one bar cut into parts of 5, 8, 12 and 6 that come to 31' },
      ),
    },
    ge(22, 3, 'prompted', 'A survey of 60 shoppers recorded which entrance each one used, and how many minutes each one stayed. The results are drawn twice: one display has a bar for each entrance, the other a bar for each band of 10 minutes. Say which display you would have to be handed to find how many shoppers stayed under 20 minutes, and which one to find how many used the side entrance.', [
      {
        childDo: 'Ask of each question whether the thing it names has a size or is only a name, then match it to the display whose bottom edge is made of that.',
        expected: 'the histogram, then the bar graph',
      },
    ], 'the histogram, then the bar graph'),
    {
      // Independent stage: the wider display is NOT drawn. Working out what the
      // regrouping does to the picture is the task, so drawing it would hand over
      // the answer the item exists to ask for (L33).
      ...ge(22, 4, 'independent', 'A histogram of 24 finish times in seconds, in bands 5 wide, holds 9, 2, 3 and 10. Regroup the same times into bands 10 seconds wide, write the two counts, and say in one sentence what the wider display stops anybody from seeing. Solve cold.', [
        { childDo: 'Decide which of the narrow bands fall inside each wide one, join them, then compare the picture you get with the one you started from.', expected: '11 and 13' },
      ], '11 and 13'),
      visual: 'The narrow display only. What the wider bands make of it is yours to work out.',
      figure: barModel(
        [
          { label: '0–4', segments: [{ value: 9, label: '9' }] },
          { label: '5–9', segments: [{ value: 2, label: '2' }] },
          { label: '10–14', segments: [{ value: 3, label: '3' }] },
          { label: '15–19', segments: [{ value: 10, label: '10' }] },
        ],
        { scaleMax: 10, alt: 'four bars of 9, 2, 3 and 10 over the bands 0 to 4, 5 to 9, 10 to 14 and 15 to 19; no wider display is drawn' },
      ),
    },
  ],
  days: [
    // Day 1 — concept echo: one band, two bands, the whole study. Single-step
    // throughout; no chains and no choices yet.
    //
    // The warm-up ORDER is load-bearing, which nothing in the kit says and only
    // reading a served pack shows: `applyRetrievalRamp` moves the LAST Day-1
    // retrieval item to Day 5. Day 5 already carries the even-length median, so
    // the keyed pictograph read sits last and the day it lands on gains a format
    // it did not have.
    [
      { gen: wJoin, diff: 2 },
      { gen: wSpread, diff: 2 },
      { gen: wKeyedRead, diff: 2 },
      { gen: sitBandRead, diff: 3 },
      { gen: sitBandSpan, diff: 3 },
      { gen: sitWholeSurvey, diff: 3 },
    ],
    // Day 2 — fluency + application: the commitment made before any arithmetic,
    // the display decision, and the recovery chain.
    [
      { gen: wJoin, diff: 2 },
      { gen: wMiddle, diff: 2 },
      { gen: sitDisplayGapEstimate, diff: 3 },
      { gen: discrimWhichDisplay, diff: 4 },
      { gen: msRecoverBand, diff: 4 },
      { gen: sitBandSpan, diff: 3 },
    ],
    // Day 3 — interleave: two chains of different shapes sit either side of two
    // single-step reads, so nothing on the page signals what kind of work is
    // coming next.
    [
      { gen: wJoin, diff: 2 },
      { gen: msSpanThenCompare, diff: 4 },
      { gen: sitBandRead, diff: 3 },
      { gen: msSpareCount, diff: 3 },
      { gen: sitDisplayGapEstimate, diff: 4 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus one
    // single-step item so "it must be a chain" never becomes the cue.
    [
      { gen: msSpanThenCompare, diff: 5 },
      { gen: msRecoverBand, diff: 5 },
      { gen: msSpareCount, diff: 4 },
      { gen: sitWholeSurvey, diff: 4 },
    ],
    // Day 5 — written: the error-analysis, the flagged build-and-compare, and
    // the claim that makes the reorder question general (+ a ramped warm-up).
    [
      { gen: wSpread, diff: 2 },
      { gen: eaBandNamedNotRead, diff: 4 },
      { gen: buildTwoDisplays, diff: 4 },
      { gen: displayClaimASN, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the useful question this week is not "what does the graph say?" but "who chose the bands?". A histogram groups readings into equal stretches — 0 to 9 minutes, 10 to 19 — and whoever draws it picks how wide those stretches are. Pick them wide enough and two separate crowds merge into one gentle hump, with every number on the display still perfectly correct. That is worth knowing for life, and it is the whole of the Day-5 page. One thing to listen for: if your child reads a bar over 10 to 19 as "somebody took nineteen minutes", the display has been read as a list of readings rather than as a count of them, and it is worth stopping there rather than correcting the arithmetic. Newspapers and news sites are full of real examples and they are free.',
  ],
  puzzle: (r) => {
    // THE WEEK'S MOVE RUN BACKWARDS. A day item groups readings into wider
    // bands; here the WIDE display is given and the narrow one has to be
    // rebuilt — which cannot be done at all without extra facts, and that is the
    // point rather than a difficulty. Coarsening always works; refining needs
    // information the coarse display threw away. The pairing with the Day-5
    // task is deliberate: that page builds outward from readings and this one
    // fails to build back in without help.
    //
    // Uniquely determined by construction: the first wide band is split in the
    // ratio 1:2 and the second so that the two parts differ by three, so
    // b0 = P/3, b1 = 2P/3, b2 = (Q-3)/2, b3 = (Q+3)/2 — whole numbers for every
    // legal draw, since P is a multiple of three and Q is odd.
    const p = 3 * r.int(3, 7);
    const q = 2 * r.int(3, 8) + 1;
    const b0 = p / 3;
    const b1 = (2 * p) / 3;
    const b2 = (q - 3) / 2;
    const b3 = (q + 3) / 2;
    return {
      id: 'E22-PZ-01',
      title: 'Puzzle Grove: The Display Behind the Display',
      puzzleType: 'construction',
      prompt: `A stopwatch timed every entrant over one short course. On a display with bands 10 seconds wide, the first band holds ${fmtInt(p)} and the second holds ${fmtInt(q)}. The same times were also drawn with bands 5 seconds wide. On that narrower display the second band holds twice as many as the first, and the fourth band holds three more than the third. Write the four counts of the narrower display in order. Then say in one sentence why the wider display on its own could never have told you them.`,
      answer: {
        value: `${b0}, ${b1}, ${b2}, ${b3}`,
        acceptableForms: [
          `${b0}, ${b1}, ${b2}, ${b3}`,
          `${b0} ${b1} ${b2} ${b3}`,
        ],
        validation: 'ordered-list',
      },
      hintLadder: [
        'Which of the narrow bands together make up the first wide band, and how do you know it is those ones?',
        'Share the first wide band between two narrow ones so that one is twice the other, then split the second wide band so the two parts differ by three.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 2, cognitiveOp: 'refine-display' },
  sprint: {
    skill: 'Subtraction within 100 — recovering a band from the study it was counted into',
    sourceWeek: D2,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'sub_within_100_facts_v1',
    params: { min: 23, max: 97 },
  },
  // SLOT 03 IS NOT `sitBandRead`, and the reason is decision 6's audit: a
  // single-band read keys a number its own prompt prints on every draw, because
  // the display states every band and finding the named one IS the task. It runs
  // on Days 1 and 3, where it belongs, and certifies nothing. The discrimination
  // and the always/sometimes/never item are absent for E21's reason: a
  // three-option page concedes a third of a slot to a guesser before any
  // reasoning happens, and this form certifies only where the work has to be done.
  mastery: [
    { gen: sitBandSpan, diff: 3 },
    { gen: msSpanThenCompare, diff: 4 },
    { gen: sitWholeSurvey, diff: 3 },
    { gen: msRecoverBand, diff: 4 },
    { gen: msSpareCount, diff: 3 },
    { gen: sitDisplayGapEstimate, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03/05: one display read three ways — the stretch covering two bands (combine), the whole study the four bands add to (part-whole), and three bands joined while a stated number of school days goes deliberately unspent (combine, has-distractor). 02/04: chains in both directions — a two-band stretch gathered and then set against a single band (forward, comparison), and a smudged band recovered from the study it was counted into, where the stated quantity is the RESULT of the grouping so the opening move is undoing it (inverse-start). 06: a display whose bars stand over names or over bands, drawn, behind a commitment to whether their order is a free choice made before any arithmetic. Every answer is walked clear of the numerals its own prompt prints, so no slot can be scored by copying a number off the page. What the pairing does not claim: the two forms draw independently over a pool of four study frames, so they can land on the same frame carrying a different band width; the counts always differ, so no answer carries across.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'band-read-as-one-value',
      description:
        'Reads a histogram bar as though it reported a single reading rather than a count of readings, so a question about a stretch covering two bands is answered with one bar. The reading is the one a bar graph taught and it transfers wrongly: there, one bar really did answer one question, because a bar over a name has nothing beside it to be joined to.',
      exampleWrongAnswer: 'a question about everyone under twenty minutes answered with the count of the 10–19 band alone',
      distractorRationale:
        'Offer the count of one of the two bands the question covers, so only noticing that the stretch spans more than one band separates it from the truth.',
      reteachPointer: 'explanation/script[2] (not one bar can tell me — five and eighteen, joined) then guidedExamples/E22-GE-01',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'shape-read-for-the-band-named',
      description:
        'Answers with the tallest band on the display rather than the band the question named. It is a habit this week creates by teaching shape: a child who has just learned to look for where the readings pile up looks there again when a particular band was asked for, and the answer produced is a real number off a real bar.',
      exampleWrongAnswer: 'a question about the 0–4 band answered with the count of the busiest band on the display',
      distractorRationale:
        'Offer the count of the display\'s tallest band, so only tracking from the named band along the bottom separates it from the truth.',
      reteachPointer: 'explanation/script[1] (what a bar means here) then the Day-5 error-analysis',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'wrong-display-for-the-question',
      description:
        'Reaches for whichever display is nearer rather than the one the question needs, so a question about a range is taken to a display made of names or the other way about. What the two displays share is the total and nothing else, and nothing on either page announces which one a question belongs to.',
      exampleWrongAnswer: 'a question about journeys under twenty minutes taken to a bar graph of ways of travelling',
      distractorRationale:
        'Offer the other display of the same survey, correctly described, so only asking whether the thing named has a size separates them.',
      reteachPointer: 'explanation/whyBeforeHow (a bar stands over a name, a bin stands over a range) then guidedExamples/E22-GE-03',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'spends-the-spare-count',
      description:
        'Spends a number that was only ever scenery. The study says how many helpers took the readings; no question this week needs them; and a child who has learned that a printed number is a needed number divides by them anyway. A grouped display makes the pull worse than usual, because bands already look like something waiting to be shared out.',
      exampleWrongAnswer: 'three bands joined correctly and the total then split between the helpers who did the recording',
      distractorRationale:
        'Offer what the helper count yields once the joined bands are shared between them, so the working reads as finished and no quantity on the page has been left over.',
      reteachPointer: 'the Day-3 and Day-4 problems where a study names its helpers and no question ever asks about them',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Data displays — reading histograms, where the bars stand over equal bands of a number line instead of over names. We worked on what one bar of a histogram does and does not tell you, on joining two bands when a question covers a stretch wider than one of them, on choosing which of two displays a question actually needs, and on what happens to the picture when the same readings are regrouped into wider bands.',
    improvingCandidates: [
      'reading a bar as a count of readings rather than as a reading',
      'joining two bands when a question covers both',
      'asking who chose the width of the bands before trusting a display',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'seeing that a bar over a band counts everybody inside it, so a stretch covering two bands needs both',
      },
      {
        errorTag: 'representation-misread',
        text: 'tracking from the band the question names rather than from the band that stands out',
      },
      {
        errorTag: 'task-comprehension',
        text: 'telling which of two displays of one survey a question can actually be answered from',
      },
      {
        errorTag: 'procedure-slip',
        text: 'keeping a number that only describes how a study was run out of the arithmetic that answers it',
      },
    ],
    homeFocus: {
      praiseLine:
        'You noticed that the question covered two bands and not one, and you joined them instead of reaching for the nearest bar. Seeing how far a question reaches across a display is the harder half of reading one.',
      questionForChild:
        'If a display says eleven children waited between five and nine minutes, can you tell me how long any one of those children waited — and if not, what has the display kept and what has it thrown away?',
      schoolSyncHook:
        'If your child\'s class calls these bands bins, groups or class intervals, or says frequency where we say how many, tell us which words they use and we will match them.',
    },
    vocabularyForParent: [
      'histogram (bars standing over equal bands of a number line, counting how many readings fall in each)',
      'band or bin (one stretch of the number line the readings are grouped into)',
      'frequency (how many readings a band holds — the height of its bar)',
    ],
  },
});
