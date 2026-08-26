/**
 * Level E · Week 24 — "Pre-algebra capstone" (conceptId: pre-algebra-capstone).
 *
 * FILL-ARCHITECTURE §6 row E24: anchor "the year as one toolkit"; key multi-step
 * "mixed cross-family chains"; error-analysis "(mixed)"; discrimination "tool
 * choice unsignalled"; Day-5 signature "exit check + written reflection". Flag
 * **R-lite** — §7 gives the computable core as the mixed computational capstone
 * and the flagged open part as the written reflection.
 * Catalog: "Mixed capstone: equations, proportions, rationals, percent", Day-5
 * "ANALYZE-style capstone: critique three worked solutions + vocabulary review".
 *
 * THE WEEK'S CLAIM. A problem never tells you which tool it wants. What it tells
 * you is what you have NOT been told — and the unknown's place decides the move.
 *
 *  - THE STORY DOES SOMETHING TO A NUMBER AND ASKS WHERE IT ENDS. Then you can
 *    walk straight through it, doing what it says in the order it says it.
 *  - THE STORY DOES SOMETHING TO A NUMBER AND HANDS YOU WHERE IT ENDED. Then you
 *    walk it backwards, undoing each move — and in the OPPOSITE order, because
 *    the last thing done to a number is the first thing that has to come off it.
 *  - THE STORY DOES NOTHING AT ALL. It finishes one pair of numbers and leaves a
 *    second pair half-written. Then there is nothing to walk: you find what the
 *    finished pair does and do the same to the other one.
 *
 * The nouns can be identical in all three. The numbers can be identical in all
 * three. That is not a trick, it is the year's real difficulty arriving at once:
 * every week until now put the tool on the page beside the question.
 *
 * NEGATIVE NUMBERS ARE NOT A FOURTH MOVE, and saying so is a content decision
 * rather than a tidying one. A signed value is the number system the three moves
 * run on, not a fourth thing to choose between — which is why `sitSignedShift`
 * sits inside the week as ordinary work and never appears as a card on the
 * discrimination. A child who reads "−9 rises 14" as a fourth kind of problem has
 * learned the wrong lesson from a capstone.
 *
 * ---------------------------------------------------------------------------
 * NINE AUTHORING DECISIONS, recorded here rather than buried (kit §E2.3).
 *
 *  1. THE MASTERY FORM WAS COUNTED BEFORE A LINE WAS WRITTEN, and that is the
 *     first thing this file did. E23's design challenge found its form
 *     UNFILLABLE — the three-option discrimination, the error-analysis and the
 *     R-flagged task are all barred from certifying, which left three generators
 *     for six slots and zero multi-step items against `GATE_PROFILE.E`'s floor of
 *     two week-wide and one on Day 4. That week would have failed assembly rather
 *     than review.
 *
 *     A CAPSTONE IS THE CELL MOST EXPOSED TO IT, because "mixed" invites a
 *     shopping list — one item per family — and a shopping list has no spine and
 *     no chains. The six certifying generators were therefore fixed first, and
 *     the claim was written to fit them rather than the other way round:
 *
 *       01 `sitScaleTheRun`             ACROSS             1 step   E1/E2/E16
 *       02 `msTakeOffThenShare`         FORWARDS           2 steps  E3/E17 × sharing
 *       03 `sitSignedShift`             the system         1 step   E6/E8
 *       04 `msUndoTheBuild`             BACKWARDS          2 steps  E13/E14
 *       05 `sitBackToTheStartEstimate`  EITHER, DRAWN      1 step   E17 (+ the probe)
 *       06 `msSpareReading`             FORWARDS           2 steps  E2/E17
 *
 *     SLOT 05 IS BOTH DIRECTIONS AND THE ROW SAYS SO, because the first version
 *     of this table called it BACKWARDS and that was false on half its draws:
 *     the `before` branch hands over the count before the cut and asks where it
 *     ends up, which is forwards. Decision 3's own text always described both
 *     branches; the table row contradicted it. That is the point of the item —
 *     the same sentence skeleton and the same two numerals put the unknown at
 *     either end, drawn — and a summary row that names one end throws the whole
 *     design away.
 *
 *     Six distinct · three chains against a floor of two · six distinct
 *     `situationType`s against a floor of three · one metacognition carrier.
 *
 *  2. THE DISCRIMINATION DRAWS THE QUESTION, NOT THE SCENE — and the three
 *     surfaces print THE SAME THREE NUMERALS. This is E22 decision 1's move
 *     (make every card keyable by drawing what is asked) crossed with E22
 *     decision 7's repair (a question surface carrying a different count of
 *     numerals collides with the pack at a different rate, so the served card
 *     split skews away from the draw). Here the scene is drawn from three
 *     workplaces INDEPENDENTLY of the shape, so the scene cannot signal the
 *     tool; and all six question surfaces print exactly the three drawn numbers,
 *     so the item's numeric signature is identical whichever shape is drawn and
 *     `drawUniqueItem` has nothing to prefer.
 *
 *     THE CARDS NAME WHERE THE UNKNOWN SITS, NOT WHAT YOU DO. "Work forwards"
 *     and "work across" were drafted first and dropped: asked what you DO, a
 *     child can defend "forwards" on a scaling draw, because scaling really is
 *     something you do in a forward direction. Asked where the missing number
 *     SITS, the three are mutually exclusive on every draw — a scaling story
 *     does nothing to any number, so the two action cards are false on it by
 *     inspection rather than by argument. Every card was hand-checked against
 *     all six surfaces for a second defensible answer (kit §E2.7).
 *
 *  3. THE PROBE IS DECIDED BY A DRAWN WORD AND THE TWO BRANCHES PRINT THE SAME
 *     TWO NUMERALS IN THE SAME TWO PLACES. E15 proved a magnitude probe cannot
 *     be made unguessable while it stays estimable; E16 gave the cure and b09
 *     gave its strongest form — make both sides print the SAME numerals, so the
 *     freshness guard has nothing to prefer and no size on the page moves with
 *     the answer.
 *
 *     The obvious probe for a capstone — "will you work forwards or backwards?"
 *     — CANNOT be built that way, and the reason is worth recording because it
 *     looks buildable. Forwards and backwards have different givens by
 *     definition: the forward branch prints the start and the backward branch
 *     prints the end, and the end of a reduction is always the smaller of the
 *     two. So "the given is the big number, therefore backwards" reads the
 *     branch off a size, which is exactly E15's class.
 *
 *     `sitBackToTheStart` removes it: the SAME printed number is the before-price
 *     on one branch and the after-price on the other, so the numeral multiset is
 *     identical and the branch turns on a five-word phrase of one word count and
 *     one character length (measured 5w/21c on every served item). The closing
 *     question differs too — "does it put on sale now" against "did it put on
 *     sale before" — which is the same semantic bit said twice rather than a
 *     second channel, but "only the phrase differs" would be textually false and
 *     a header is a contract. The probe then asks for
 *     the consequence rather than the branch — whether the number being looked
 *     for is larger or smaller than the number handed over — which is one
 *     inferential step, is the misconception "a reduction always makes things
 *     smaller" stated as a commitment, and is consumed by the arithmetic itself.
 *
 *  4. THE ERROR-ANALYSIS IS THE CLAIM'S OWN FAILURE MODE.
 *     `e_alg_verify_step_order_v1` computes (c − b) / a against c / a − b: the
 *     child who correctly decides to go backwards and then undoes in the order
 *     the sentence is written rather than in reverse. Both values are code-
 *     derived and the prompt states the student's CLAIM without naming the move,
 *     so the diagnosis stays the child's answer (`erroranalysis.ts` refuses a
 *     prompt that hands it over).
 *
 *     THE RECIPE SAYS "(MIXED)" AND THIS IS ONE SLIP, SO THE MIXING IS DONE
 *     WHERE IT BELONGS. `errorAnalysis` binds one registered verify at factory
 *     time, so a genuinely mixed error-analysis would be three pages or a
 *     fabricated wrong number. The catalog's own Day-5 line — "critique three
 *     worked solutions" — is the mixed item, and `capstoneCritique` below is it:
 *     three workings, one per move, two of them carrying named misconceptions
 *     from different families. The two lines describe one page each, not one
 *     page twice.
 *
 *  5. THE R-LITE PART CARRIES CHOSEN NUMBERS, NOT DRAWN ONES, and E23's
 *     `fairGameDesign` is the precedent. An invented critique is not a number:
 *     what can be graded is stated in `value` for whoever marks it, and what
 *     cannot be recomputed — a child's account of how they decide before
 *     calculating — is `manual-review`, never a faked computable answer (§7).
 *     The three workings are chosen because the lesson is in their shape: the
 *     additive-scaling slip (E1's) on a story that does nothing, the step-order
 *     slip on a story handed its own result, and a forward story answered with
 *     the part taken rather than the part left. One per move, and the two wrong
 *     ones are wrong in ways this year has a name for.
 *
 *  6. THE VOCABULARY ITEM'S DISTRACTORS ARE THE YEAR'S REAL CONFUSIONS, and each
 *     term carries its own pair. A term-to-meaning page drawn from one shared
 *     pool of meanings is a lookup table after two exposures; worse, a card
 *     offered with every term and keyed with one is a dead card by construction
 *     (L38). Here the correct meaning and both distractors are drawn together
 *     with the term, so every card is keyed exactly when its own term comes up.
 *     STATED PRECISELY: the twelve distractor texts ARE permanently wrong — they
 *     are misconceptions, and a misconception no draw can make true is what
 *     `DECLARED_LURES` exists for. The property this design actually buys is the
 *     one L38 is about: no card is OFFERED on every draw. A dead card is only a
 *     free strike when a child meets it repeatedly, and here a card appears only
 *     beside its own term. The distractors are named misconceptions
 *     rather than nonsense: the unit rate confused with the total, the range with
 *     the largest reading, the inverse with the repeat.
 *
 *  7. THE PUZZLE IS A SEARCH, AND ITS UNIQUENESS IS ENUMERATED RATHER THAN
 *     ASSERTED. Three moves and a start, and only one order reaches the target.
 *     Every cell is built once at module load and kept only if at least THREE of
 *     the six orders keep every stage a positive whole number while exactly ONE
 *     of those reaches the target — so the puzzle is a target search and not a
 *     divisibility hunt, which is what it would collapse to if only one order
 *     were legal at all. The three moves are shuffled before they are lettered,
 *     so the answer is not "A, B, C" more often than a sixth of the time.
 *
 *     It removes the concept in the §6.10 sense: every day item is handed the
 *     moves in the order the story fixes and has to carry them out, and this one
 *     is handed the moves with no order at all and has to find it.
 *
 *  8. ONE SCENE PER GENERATOR, ASSIGNED RATHER THAN DRAWN (E22 decision (d)), so
 *     no day can open two items on one workplace. Eight generators own a scene
 *     outright — a cable car (across) · a tank gauge (signed) · a climbing wall
 *     (forwards) · a sawmill (backwards) · a cinema (the probe) · a sorting
 *     office (the spare) · a sports centre (the error-analysis) — the
 *     discrimination draws from three more (a dairy, a foundry line, a
 *     laundry), and the Day-5 critique carries three fixed ones of its own (urns
 *     and mugs, a tea-room bill, a hire desk). Fourteen distinct scenes, and no
 *     two generators share one.
 *
 *     EVERY ONE OF THEM WAS CHECKED IN CONTEXT, WHICH IS NOT THE SAME AS
 *     CHECKING A COUNT. "lift" returns 27 files, "skip" 41 and "scaffold" 21, and
 *     every one of those is an API word rather than a scene. Read in context, the
 *     first drafts of four of these were already taken and were changed: a
 *     printing press (e05 runs sheets through one), a printer at a steady rate
 *     (e16's own header warns about it), a cold store (e06 logs its shelves) and
 *     a canal (e08 stages a has-distractor on two stretches of one) — the last
 *     three being the exact items this week would have staged on them.
 *
 *     A SEA-LEVEL FRAME WAS DRAFTED FOR THE SIGNED ITEM AND CUT. It is the
 *     obvious two-sided frame and e06 and e08 both own it — e08's own decision 6
 *     is about keeping its sea-level frames off one page. A tank gauge reading
 *     above and below a marked line is the same mathematics on a surface nothing
 *     else in the corpus stands on.
 *
 *  9. WHAT THIS WEEK DOES NOT COVER, DECLARED RATHER THAN QUIETLY DROPPED. The
 *     catalog's concept line is "equations, proportions, rationals, percent" and
 *     all four are live items. Its strand tags also name probability-statistics,
 *     and NO summary or chance item is authored here: E21, E22 and E23 own that
 *     ground three weeks running, and a capstone that re-taught it would be a
 *     fifth week of it rather than a capstone. It is carried by retrieval
 *     instead — `rangeOfSet` from E21 is a warm-up, and the vocabulary item
 *     keys "the range" and "the complement" among its SIX terms (six, not five:
 *         the count is load-bearing for the 2/2/2 length-rank balance asserted
 *         at module load). Owner
 *     decision, reported not taken.
 *
 *     GEOMETRY IS ABSENT because E18-E20 do not exist; the level has no geometry
 *     family and the capstone cannot consolidate what was never taught.
 *
 * ---------------------------------------------------------------------------
 * 10. WHAT THE LOCAL DECISION ITEMS MEASURE, off SERVED packs and never off the
 *     draw (L39), on THREE DISJOINT SEED LATTICES of 900 packs each. Three
 *     because a measurement repeated on a prefix of its own seeds has been
 *     repeated zero times — and because the third one changed an answer here.
 *
 *       - THE PROBE, 8,100 served items: put-before 51.1% / put-after 48.9%
 *         (52.1/47.9 · 51.1/48.9 · 50.1/49.9). So "always say larger" scores
 *         48.9% and "always say smaller" 51.1%. Across every served item the
 *         branch phrase has ONE word count (five) and ONE character length
 *         (twenty-one), and the two branches print the same two numerals in the
 *         same two places, so neither a size nor a sentence length moves with
 *         the answer.
 *       - `discrimWhichEnd`, 2,700 served items: ends 34.0% / pair 33.7% /
 *         began 32.3%, a best single card 0.7 points over chance and well inside
 *         the corpus's five-point bar. Every card is OFFERED on 100% of draws and
 *         every card is keyed about a third of the time — no dead card (L38).
 *         Blind habits: always-longest-card 33.9%, always-first-card 32.9%.
 *
 *         THE THIRD LATTICE IS WHY THERE IS A THIRD LATTICE. On the first two,
 *         the pair card read 35.4% and 34.1% — the same card high, twice, on
 *         disjoint seeds, which is the shape E22 records as structural rather
 *         than noise. On the third it read 31.6% and the ends card took the top
 *         at 35.8%. Two agreeing lattices are still two draws from one
 *         distribution; the skew was noise and only a third disjoint sample said
 *         so.
 *       - `toolkitVocab`, 2,700 served items: always-longest-card 33.2%,
 *         always-shortest-card 31.9%, key position 32.8-37.4%. The six terms are
 *         drawn at 15.6-18.3%. Before the six-term rebuild, always-longest-card
 *         scored 100.0% (see the note above the term table).
 *       - THE PUZZLE, 2,700 served packs: the six letter orders answer 14.2% to
 *         18.3%, against a 16.7% floor.
 *       - THE SIX MASTERY SLOTS, 1,800 forms per slot per lattice: key-in-prompt
 *         0.0% on ALL SIX. Key larger than every printed numeral 100.0 / 0.0 /
 *         23.2-25.4 / 0.0 / 43.7 / 100.0; key smaller than every printed numeral
 *         0.0 / 6.9-7.2 / 46.5-48.2 / 0.0 / 25.4 / 0.0. Slots 01 and 06 sit at
 *         100.0% by construction and it is not exploitable: every slot on this
 *         form is free-entry, and knowing an answer is large names no number
 *         (E22 measured and stated the same thing about its slot 05). Minimum
 *         answers 54 / 2 / -32 / 5 / 2 / 50; distinct answers 169 / 17 / 62 /
 *         10 / 37 / 219.
 *       - EVERY SERVED ANSWER IS POSITIVE AND ASKABLE except slot 03's, which is
 *         a signed gauge reading and negative on 50.9-52.1% of forms BY DESIGN.
 *         Across 34,500 served items the only value below zero came from that
 *         generator, no answer is zero and none is fractional. E22 shipped a
 *         chain keying a negative COUNT on 8.0% of servings and the sweep, the
 *         validator and tsc all passed it, so this is asserted rather than
 *         assumed. Scene coherence is asserted too, and both assertions were
 *         earned: the sawmill's waste is bounded at 20.0% of the batch (it
 *         reached 40.0% before the bound) and the spare vans collide with the
 *         letters left over in 0 of 1,500 packs (they collided in two of the
 *         first three packs read).
 *
 *     THE ANSWER-IN-PROMPT DETECTOR WAS PROVED TO FIRE BEFORE ANY 0.0% ABOVE WAS
 *     BELIEVED. Pointed at `stats.graphRead('value','bar')`, whose answer is a
 *     numeral its own prompt prints by definition, it reads 100.0% over 4,000
 *     draws; pointed at `stats.histogramBinRead` it reads 21.7% against the 22.6%
 *     this programme recorded for that generator a week ago. Its left boundary
 *     also excludes a bare minus sign, without which an unsigned "17" matches
 *     inside a printed "-17" and the rate is INFLATED — the mirror of the
 *     boundary bug that deflates, and a live risk in a week that prints negative
 *     gauge readings. A gate that cannot be seen to fire has not been seen to pass.
 *
 * ANSWER-IN-PROMPT NOTE. Two generators clear their own answer off the page BY
 * CONSTRUCTION rather than by a walk, and it is worth stating which:
 * `sitScaleTheRun`'s answer is the scale factor times a total that is already the
 * largest numeral printed, and `msSpareReading`'s answer is at least fifty while
 * every numeral it prints is at most thirty. The other four walk one drawn dial
 * deterministically (kit §E2.4 — never a redraw loop, which consumes a variable
 * number of rng values and makes every later item in the pack depend on this one).
 *
 * Retrieval reaches back to one week per move, which is the week's own structure
 * turned into its warm-ups: E13's one-step equation (backwards), E17's percent of
 * a count (forwards), E2's unit rate (across), and E21's range — the summary the
 * capstone does not re-teach and does not drop.
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { barModel } from '../lib/figures';
import { percentOfCount, unitRate } from '../lib/ratio';
import { oneStepEquation } from '../lib/algebra';
import { rangeOfSet } from '../lib/stats';
import type { ItemGen } from '../lib/multistep';
import type { ErrorTag } from '../../../types';

const ge = makeGe('E');

const E2 = { level: 'E' as const, week: 2 };
const E13 = { level: 'E' as const, week: 13 };
const E17 = { level: 'E' as const, week: 17 };
const E21 = { level: 'E' as const, week: 21 };

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
//
// ONE PER MOVE, which makes the warm-up strip the week's own table of contents.
// Four distinct registered templateIds, so §6.14's week-wide variety floor of
// three is cleared with one to spare and no day carries two of a kind.
// ---------------------------------------------------------------------------

/** E13 — the one-step equation. The BACKWARDS move at its shortest. */
const wEquation = asWarmup(oneStepEquation('mul'), E13);
/** E17 — a percent of a count. The FORWARDS move at its shortest. */
const wPercent = asWarmup(percentOfCount(), E17);
/** E2 — the unit rate. The ACROSS move at its shortest: one finished pair. */
const wRate = asWarmup(unitRate(), E2);
/** E21 — the spread. The summary this week retrieves rather than re-teaches. */
const wSummary = asWarmup(rangeOfSet({ n: 5 }), E21);

// ---------------------------------------------------------------------------
// ACROSS — the story does nothing; one finished pair, one half-written
// ---------------------------------------------------------------------------

/**
 * A CABLE CAR, and the purest ACROSS item in the week: nothing happens to any
 * number, a pair is finished and its partner is asked for.
 *
 * NO LEAK IS POSSIBLE BY CONSTRUCTION, and that is worth stating rather than
 * walking. The prompt prints the trip count, the people carried over them, and a
 * later trip count. The answer is the scale factor times the people carried, so
 * it exceeds the people carried; the people carried is `trips × per` with `per`
 * at least nine, and the later trip count is `trips × factor` with `factor` at
 * most seven, so the people carried is the largest numeral on the page and the
 * answer is larger than all three.
 */
const sitScaleTheRun = situation({
  situationType: 'rate',
  cognitiveOp: 'scale-a-pair',
  draw: (r) => {
    const trips = r.pick([3, 4, 5, 6]);
    const per = r.int(9, 24);
    const carried = trips * per;
    const factor = r.int(2, 7);
    const later = trips * factor;
    return {
      prompt: `A cable car carries the same number of people on every trip. Over ${countNoun(trips, 'trips')} it carried ${countNoun(carried, 'people')} to the summit. How many people does it carry over ${countNoun(later, 'trips')}?`,
      answerValue: String(factor * carried),
      templateId: 'ratio_table_cell_v1',
      params: { a: trips, b: carried, x: later },
      units: 'people',
      hints: [
        'Does anything in this story happen to a number, or are you being handed one finished pair and half of another?',
        'Settle how many times over the second run of trips is the first, then take the people carried that many times.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// The number system the three moves run on (decision 8)
// ---------------------------------------------------------------------------

/**
 * A TANK GAUGE, above and below a marked line. The reading is signed on both
 * sides of the line and the shift is drawn in either direction, so the answer is
 * genuinely either sign — which a depth frame cannot manage, and which is the
 * reason the obvious diver scene was not used.
 *
 * The shift is walked deterministically so the reading it lands on is never a
 * numeral already on the page, and never zero: a gauge reading of nothing is a
 * legitimate value and a poor question, since "level with the line" is a state
 * rather than a distance and a child may reasonably write either 0 or "level".
 *
 * (HISTORY: until 2026-08-25 this walk ALSO excluded readings of exactly ±1,
 * because `lib/format.ts`'s `exactlyOne` was sign-blind — `valueForms('-1',
 * 'centimetres')` printed "-1 centimetres" and QG-12c rejected the pack, 43 of
 * 200 seeds. The formatter is fixed; the workaround came off with it, per the
 * dead-permit rule — a guard that outlives its defect becomes a false record.
 * Removing it shifts this generator's draws on the seeds the exclusion used to
 * touch; the week was re-swept and its slot-03 measurements re-taken.)
 */
const sitSignedShift = situation({
  situationType: 'measurement',
  cognitiveOp: 'signed-shift',
  draw: (r) => {
    const start = r.pick([-14, -12, -11, -9, -8, -6, -5, -3, 3, 5, 6, 8, 9, 11, 12, 14]);
    const rises = r.int(0, 1) === 1;
    const drawnShift = r.int(3, 18);
    let shift = drawnShift;
    for (let k = 0; k < 16; k++) {
      const cand = 3 + ((drawnShift - 3 + k) % 16);
      const end = rises ? start + cand : start - cand;
      if (end !== 0 && Math.abs(end) !== Math.abs(start) && Math.abs(end) !== cand) {
        shift = cand;
        break;
      }
    }
    const end = rises ? start + shift : start - shift;
    return {
      prompt: `A water tank is kept at a marked line, and its gauge writes how far the water stands from that line, with a minus sign when it is below. The gauge reads ${start}. Over the next hour the water ${rises ? 'rises' : 'falls'} ${countNoun(shift, 'centimetres')}. What does the gauge read then?`,
      answerValue: String(end),
      templateId: 'e_int_addsub_v1',
      params: { a: start, b: shift, op: rises ? '+' : '-' },
      units: 'centimetres',
      hints: [
        'Which side of the marked line does this gauge start on, and which way is the water going?',
        'Put the starting reading on a line with the mark at nothing, then step the stated distance in the stated direction and read where you land.',
      ],
      errorTags: ['representation-misread', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// FORWARDS — the story does something and asks where it ends
// ---------------------------------------------------------------------------

/**
 * Each percent's remaining share as an EXACT fraction, so nothing here is ever a
 * rounded decimal. The pairs are (100 − pct) / 100 reduced.
 */
const REMAINING: ReadonlyArray<{ pct: number; rn: number; rd: number }> = [
  { pct: 20, rn: 4, rd: 5 },
  { pct: 25, rn: 3, rd: 4 },
  { pct: 40, rn: 3, rd: 5 },
  { pct: 60, rn: 2, rd: 5 },
  { pct: 75, rn: 1, rd: 4 },
];

/**
 * FORWARDS, and a chain that crosses two families: a percent taken off (E3/E17)
 * and then an equal share (D-era sharing). Two operations, each doing real work.
 *
 * THE OPERANDS ARE BUILT FROM THE ANSWER OUTWARDS so the arithmetic is exact
 * without a single guard. With the remaining share `rn/rd` in lowest terms, a
 * total of `rd · schools · s` leaves `rn · schools · s` and shares to `rn · s`,
 * all three whole for every legal draw. `s` is then walked so the answer is not
 * one of the three numerals the prompt prints.
 */
const msTakeOffThenShare = multiStep({
  situationType: 'sharing',
  cognitiveOp: 'reduce-then-share',
  draw: (r) => {
    const { pct, rn, rd } = r.pick(REMAINING);
    const schools = r.int(2, 6);
    const drawnS = r.int(2, 7);
    let s = drawnS;
    for (let k = 0; k < 6; k++) {
      const cand = 2 + ((drawnS - 2 + k) % 6);
      const each = rn * cand;
      if (![rd * schools * cand, pct, schools].includes(each)) {
        s = cand;
        break;
      }
    }
    const total = rd * schools * s;
    return {
      prompt: `A climbing wall keeps ${countNoun(total, 'session places')} for the school week. A club books ${pct}% of them, and the places still free are shared equally between ${countNoun(schools, 'schools')}. How many places does each school get?`,
      initN: total,
      steps: [
        { op: 'mul', n: rn, d: rd },
        { op: 'div', n: schools, d: 1 },
      ],
      units: 'places',
      hints: [
        'Are the places being shared out all of them, or only the ones the club has left behind?',
        'Settle how many places are still free once the club has taken its share, and only then cut that number into equal parts.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * FORWARDS with a HAS-DISTRACTOR posing (PEDAGOGY-CEILING-REVIEW F3). The vans
 * waiting in the yard are stated, are never used, and are the seductive kind of
 * spare quantity — a count of vehicles in a problem about counting letters, which
 * a child taught that every printed number is a needed number will reach for.
 *
 * THE POST ARRIVES; IT IS NOT UNPACKED. That distinction is the whole reason this
 * item reads the way it does, and the first version got it wrong in a way a
 * design challenge caught: it said the post "filled 9 bundles and left 4 letters
 * over" and asked how many letters came in. Temporally the post came in FIRST and
 * was packed afterwards, so the missing number sat where the story BEGAN — and
 * the week's own cards would have keyed it "began" while the header stamped it
 * FORWARDS and the modeled guided example narrated "I am being asked where it
 * ends up". The claim would have been contradicted by its own worked example, on
 * a scene served three times including a mastery slot.
 *
 * Nothing about the arithmetic changes. The sacks and the loose letters are now
 * what ARRIVES, and the total is what the arrival comes to, so the unknown really
 * does sit at the end of what the story does. A spine that leaks on the week's
 * own items is worse than no spine, because the discrimination teaches the
 * trichotomy as though it were clean.
 *
 * NO LEAK IS POSSIBLE BY CONSTRUCTION: the answer is at least fifty (four sacks
 * of twelve and two over) and every numeral the prompt prints is at most thirty.
 */
const msSpareReading = multiStep({
  situationType: 'combine',
  cognitiveOp: 'rebuild-from-parts',
  posing: 'has-distractor',
  draw: (r) => {
    const per = r.int(12, 30);
    const sacks = r.int(4, 9);
    const over = r.int(2, 11);
    // THE SPARE QUANTITY MUST NOT BE ONE OF THE NUMBERS IT SITS BESIDE, and
    // reading a served week is why: two of the first three packs printed "left 4
    // letters over, and 4 vans were waiting", which reads as though the two were
    // connected and quietly suggests the spare is doing work. Nudged
    // deterministically rather than redrawn (kit §E2.4). A BUNDLE, not a tray:
    // e02's kiln already loads identical trays, and the library's own one-step
    // warm-up draws trays too, so a served pack opened Day 1 and Day 3 on the
    // same noun.
    const drawnVans = r.int(3, 8);
    let vans = drawnVans;
    for (let k = 0; k < 6; k++) {
      const cand = 3 + ((drawnVans - 3 + k) % 6);
      if (![over, sacks, per].includes(cand)) { vans = cand; break; }
    }
    return {
      prompt: `This morning's post reaches a sorting office in ${countNoun(sacks, 'sacks')}, each holding ${countNoun(per, 'letters')}, with ${countNoun(over, 'letters')} loose on top, and ${countNoun(vans, 'vans')} are waiting in the yard. How many letters are there to sort?`,
      initN: sacks,
      steps: [
        { op: 'mul', n: per, d: 1 },
        { op: 'add', n: over, d: 1 },
      ],
      units: 'letters',
      hints: [
        'Is every number printed here a number this question needs, or is one of them only telling you what else was going on?',
        'Work out what the full sacks hold between them, then join on the letters that came loose.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// BACKWARDS — the story hands you where it ended
// ---------------------------------------------------------------------------

/**
 * INVERSE-START (PEDAGOGY-CEILING-REVIEW F3). The quantity the story hands over
 * is what the yard RECEIVED, which is the result of the whole process, so the
 * opening move is to put back what was taken out — and nothing in the order the
 * sentence is written asks for that. Then the restored total is cut by the logs.
 *
 * Undoing in reverse order is the point: the splits came off last, so they go
 * back on first. That is the exact move the Day-5 error-analysis catches a
 * student getting the wrong way round.
 */
const msUndoTheBuild = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'recover-the-unit',
  posing: 'inverse-start',
  draw: (r) => {
    // THE WASTE IS BOUNDED, AND READING A SERVED WEEK IS WHY. Drawing the split
    // count freely served "from 5 logs the yard received 12 sound planks, after 8
    // planks were set aside as split" — forty per cent of the batch ruined, on a
    // mastery form. The arithmetic was faultless and the yard was not a business.
    // This is the lopsided-scene class the handoff reports live in
    // `algebra.twoStepEquation`, which the library sweep measured at 81% of
    // draws; the cure is to bound the ratio rather than the operand. The split
    // count is now under one log's yield AND under a fifth of the batch, so the
    // worst scene this can serve loses one plank in five.
    //
    // Bounding it also removes the collision guard the first version needed: the
    // answer `per` cannot equal `split`, since split < per by construction, and
    // it cannot equal `good` = per·logs − split, which exceeds per whenever
    // logs ≥ 2. Only `per` against `logs` is left, and that is one nudge.
    // The yield is drawn 5-14 rather than 5-12: the answer to this slot IS the
    // yield, and a narrower range left the mastery slot with only eight distinct
    // answers across 1,800 forms. Still under the entropy gate's flag, but a
    // capstone slot with eight possible answers is thin.
    const logs = r.int(4, 8);
    const drawnPer = r.int(5, 14);
    const per = drawnPer === logs ? (drawnPer === 14 ? 13 : drawnPer + 1) : drawnPer;
    const split = r.int(2, Math.min(9, per - 1, Math.floor((per * logs) / 5)));
    const good = per * logs - split;
    return {
      prompt: `A sawmill cuts every log into the same number of planks. From ${countNoun(logs, 'logs')} the yard received ${countNoun(good, 'sound planks')}, after ${countNoun(split, 'planks')} were set aside as split. How many planks does one log give?`,
      initN: good,
      steps: [
        { op: 'add', n: split, d: 1 },
        { op: 'div', n: logs, d: 1 },
      ],
      units: 'planks',
      hints: [
        'Is the number of planks you are given what the logs produced, or what was left after some were taken out?',
        'Put the split planks back with the sound ones first, and share what that comes to between the logs.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * THE METACOGNITION CARRIER (decision 3), served ONLY through the wrapper below
 * (kit §E2.2) so its ladder is spent once.
 *
 * The SAME printed number is the before-count on one branch and the after-count
 * on the other, so both branches print exactly two numerals, the same two, in the
 * same two places, and the branch phrase is five words either way. Nothing about
 * a size on the page and nothing about a sentence length moves with the answer.
 *
 * `ratio_table_cell_v1` on both branches deliberately, so the two branches also
 * share an answer SURFACE: a whole number of seats either way. Registering the
 * forward branch as a percent-off truth would have keyed it through a money
 * formatter and given the two branches visibly different answer shapes.
 */
const sitBackToTheStart = situation({
  situationType: 'comparison',
  cognitiveOp: 'undo-a-reduction',
  draw: (r) => {
    const { pct, rn, rd } = r.pick(REMAINING);
    const before = r.int(0, 1) === 1;
    const drawnM = r.int(2, 9);
    let m = drawnM;
    for (let k = 0; k < 8; k++) {
      const cand = 2 + ((drawnM - 2 + k) % 8);
      const seats = rn * rd * cand;
      const answer = before ? (seats / rd) * rn : (seats / rn) * rd;
      if (answer !== pct && answer !== seats) {
        m = cand;
        break;
      }
    }
    const seats = rn * rd * m;
    return {
      prompt: `A cinema has cut the number of seats it puts on sale for the late screening by ${pct}%. ${before ? 'Before the cut it put' : 'After the cut it puts'} ${countNoun(seats, 'seats')} on sale. How many seats ${before ? 'does it put on sale now' : 'did it put on sale before'}?`,
      answerValue: String(before ? (seats / rd) * rn : (seats / rn) * rd),
      templateId: 'ratio_table_cell_v1',
      params: before ? { a: rd, b: rn, x: seats } : { a: rn, b: rd, x: seats },
      units: 'seats',
      hints: [
        'Is the number of seats you have been given the one before the cut was made, or the one left after it?',
        'Write the sale as a pair — how many seats survive out of every so many — and carry the number you were given across that same pair.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

const sitBackToTheStartEstimate = withEstimateFirst(
  sitBackToTheStart,
  'will the number you are looking for be larger than the one you are given, or smaller?',
);

// ---------------------------------------------------------------------------
// Discrimination — tool choice unsignalled (decision 2)
// ---------------------------------------------------------------------------

type Place = 'ends' | 'began' | 'pair';

/**
 * Three workplaces, drawn INDEPENDENTLY of the question shape. That independence
 * is the whole design: if the scaling questions always arrived at a dairy and
 * the undoing questions always at a foundry, the scene would signal the tool and
 * the item would measure nothing.
 */
/*
 * A DAIRY, NOT A CONVEYOR, AND THE COLLISION SCAN'S SCOPE IS THE LESSON. The
 * first version opened on "A conveyor … crates", which returns no hits across
 * `weeks/` — and `lib/ratio.ts`'s own `RATES` pool holds
 * `{ agent: 'A conveyor', out: 'crates', per: 'minutes' }`, which this week
 * SERVES through its Day-2 `unitRate` warm-up, two slots above this item. About
 * one pack in twelve therefore opened two conveyor-crate stories on one page —
 * and the warm-up is always a steady-rate pair story, so on the two-thirds of
 * those where this item had drawn an action shape, the page had just taught
 * "conveyor means steady rate" directly above the item whose entire design claim
 * is that the scene signals nothing. It primed the WRONG card.
 *
 * A scan of `weeks/` is not a scan of what a week serves. `lib/` has to be in
 * scope too, because a week's warm-ups come from there.
 */
const WORKPLACES = [
  { subject: 'A dairy', thing: 'churns', per: 'hour' },
  { subject: 'A foundry line', thing: 'moulds', per: 'hour' },
  { subject: 'A laundry', thing: 'sheets', per: 'hour' },
] as const;

type Workplace = (typeof WORKPLACES)[number];

/**
 * Six question surfaces, two per card, so the item is not a three-row lookup
 * table a child has seen out after two packs (E22 decision 2).
 *
 * EVERY SURFACE PRINTS EXACTLY THE THREE DRAWN NUMBERS, in the same roles, so
 * the item's numeric-token signature does not move with the shape. E22 measured
 * what happens without that: six asks carrying different token counts collided
 * with the pack at different rates and pushed a uniformly drawn three-card split
 * to 28.5 / 33.8 / 37.8 on the page.
 *
 * The two action surfaces describe a single arrival and a single removal rather
 * than repeated lots, deliberately: "three lots of eight" reads as a finished
 * pair, and a child could then defend the pair card on an action draw.
 */
const SHAPE_ASKS: ReadonlyArray<{ place: Place; ask: (w: Workplace, p: number, q: number, s: number) => string }> = [
  {
    place: 'pair',
    ask: (w, p, q, s) =>
      `${w.subject} handles the same number of ${w.thing} every ${w.per}. In ${fmtInt(p)} ${w.per}s it handled ${fmtInt(q)} ${w.thing}. How many will it handle in ${fmtInt(s)} ${w.per}s?`,
  },
  {
    // NOT "all shift", and a design challenge is why. Framed as one continuous
    // run, a cumulative reading is defensible whenever the second figure is the
    // larger — "the running total is 40 at five hours, so where does it END UP
    // three hours later" grounds the *ends* card in that card's own words, on
    // half this surface's draws. Surface 0 already dodges it with a future tense
    // that makes the two runs separate episodes; this one now does the same.
    place: 'pair',
    ask: (w, p, q, s) =>
      `${w.subject} works at the same steady rate on any day. On one day ${fmtInt(q)} ${w.thing} went through in ${fmtInt(p)} ${w.per}s. On another day, how many will go through in ${fmtInt(s)} ${w.per}s?`,
  },
  {
    place: 'ends',
    ask: (w, p, q, s) =>
      `${w.subject} starts the shift with ${fmtInt(q)} ${w.thing} waiting. ${fmtInt(s)} are taken away, and then ${fmtInt(p)} more arrive. How many ${w.thing} are waiting now?`,
  },
  {
    place: 'ends',
    ask: (w, p, q, s) =>
      `${w.subject} has ${fmtInt(q)} ${w.thing} waiting at the start of the day. ${fmtInt(p)} more arrive, and then ${fmtInt(s)} are taken away. How many ${w.thing} are waiting then?`,
  },
  {
    place: 'began',
    ask: (w, p, q, s) =>
      `${w.subject} ends the shift with ${fmtInt(q)} ${w.thing} waiting, after ${fmtInt(s)} were taken away and ${fmtInt(p)} more arrived. How many were waiting at the start?`,
  },
  {
    place: 'began',
    ask: (w, p, q, s) =>
      `${w.subject} is left with ${fmtInt(q)} ${w.thing} waiting, after ${fmtInt(p)} arrived and ${fmtInt(s)} were taken away. How many were waiting before any of that?`,
  },
];

/**
 * The three cards are FIXED and the key rotates uniformly among them, so "pick
 * the longest card" is only a relabelling of "always say the same thing" and
 * cannot beat a third. They are still written to within two characters of each
 * other — asserted below — so that nothing about the SHAPE of the page suggests
 * one card is the considered answer and the other two the fillers. The first
 * draft had the pair card three characters clear of the rest.
 */
const PLACE_CARD: Record<Place, string> = {
  ends: 'the story does something to a number, and the missing one is where it ends up',
  began: 'the story does something to a number, and the missing one is where it began',
  pair: 'the story finishes one pair of numbers, and the missing one completes another',
};

{
  const lens = Object.values(PLACE_CARD).map((s) => s.length);
  if (Math.max(...lens) - Math.min(...lens) > 2) {
    throw new Error(`E24 discrimWhichEnd: card lengths ${lens.join('/')} differ by more than two characters`);
  }
}

/**
 * THE RATIONALES ARE TRUTH-AGNOSTIC, AND THE FIRST VERSION'S WERE NOT.
 *
 * A rationale is keyed by the CARD the child picked, but whether a given
 * sentence is TRUE depends on which shape was actually drawn. The first version
 * wrote each rationale for the action draws, so on a pair draw — a third of
 * them — a child picking "began" was told "Nothing has to be undone here, the
 * moves can simply be carried out", when the story does nothing at all and there
 * are no moves; and a child picking "ends" was told the number was "what the
 * story finished with", when nothing finished it. Both sentences asserted
 * falsehoods about the page they were attached to, and both misdiagnosed the
 * actual error, which is reading accumulation into a story that has none.
 *
 * Each rationale now states what its CARD claims and what to check the story
 * for, so it is true on every draw the card can lose on. (A rationale is shown
 * to the child; a false one teaches something.)
 */
const PLACE_WRONG: Record<Place, { tag: ErrorTag; rationale: string }> = {
  ends: {
    tag: 'task-comprehension',
    rationale:
      'This card claims you were handed the number the story starts from and asked where it finishes. Read the story again for what you were actually given: if you were handed the finished amount, the work runs the other way — and if nothing is done to any number at all, there is no direction to run in.',
  },
  began: {
    tag: 'concept-misconception',
    rationale:
      'This card claims you were handed the number the story finishes with and asked where it started. Read the story again: if you were handed the starting amount you can simply carry the moves out — and if nothing is done to any number at all, there is nothing to undo.',
  },
  pair: {
    tag: 'representation-misread',
    rationale:
      'This card claims the story sets out one finished pair of numbers and asks for the partner of a second. Read the story again for a change being made: if something is done to a number once, there are no pairs to match, only a before and an after.',
  },
};

/**
 * The recipe's discrimination: TOOL CHOICE UNSIGNALLED. The scene, the numbers
 * and the nouns carry nothing at all — only the shape of the sentence does, which
 * is the week's claim made into a page.
 *
 * The cards name where the unknown SITS rather than what you do (decision 2), so
 * exactly one is true on every draw and the other two are false by inspection.
 */
const discrimWhichEnd = discrimination({
  variant: 'structural',
  cognitiveOp: 'choose-the-move',
  draw: (r) => {
    const place = r.pick(['ends', 'began', 'pair'] as const);
    const surfaces = SHAPE_ASKS.filter((a) => a.place === place);
    const chosen = surfaces[r.int(0, surfaces.length - 1)];
    const w = r.pick(WORKPLACES);
    // THE STOCK IS A WHOLE MULTIPLE OF THE FIRST FIGURE ON EVERY SURFACE, AND
    // READING A SERVED WEEK IS WHY. The item tells the child not to work it out,
    // so divisibility looked like it could not matter — but the pair surfaces ask
    // a question that has to HAVE an answer, and drawing the stock freely served
    // "in 7 minutes it handled 25 crates" one time in several. Fixing it only on
    // the pair surfaces would have been worse than leaving it: "the big number
    // divides by the small one" would then BE the tell the item exists to remove.
    // Applying it everywhere makes divisibility carry nothing.
    const p = r.int(3, 9);
    const q = p * r.int(4, 12);
    let s = r.int(3, 9);
    if (s === p) s = s === 9 ? 8 : s + 1;
    return {
      prompt: `${chosen.ask(w, p, q, s)} Do not work it out. Say where the missing number sits in this story.`,
      correct: PLACE_CARD[place],
      distractors: (['ends', 'began', 'pair'] as const)
        .filter((c) => c !== place)
        .map((c) => ({
          text: PLACE_CARD[c],
          errorTag: PLACE_WRONG[c].tag,
          rationale: PLACE_WRONG[c].rationale,
        })),
      hints: [
        'Does this story do anything at all to a number, or does it just tell you what goes with what?',
        'If something is done, decide whether you have been handed what it started from or what it ended at; if nothing is done, look for the pair that is already finished.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5 — the written strand, including the flagged open part (§7)
// ---------------------------------------------------------------------------

/**
 * THE ERROR-ANALYSIS (decision 4). `e_alg_verify_step_order_v1` returns
 * (c − b) / a against c / a − b: the student who correctly saw that the story
 * hands over its own result, and then undid the moves in the order the sentence
 * wrote them rather than in reverse.
 *
 * The draw follows E14's arithmetic because it is the constraint rather than the
 * prose: the loose amount is a multiple of the hourly charge, so the verify's own
 * `whole()` guard is satisfied on both orders, and the hours are drawn far enough
 * above the shortfall `k(a − 1)` that the wrong value stays positive. Both values
 * are then cleared off the printed page by a deterministic walk on the hours.
 */
const eaUndoOutOfOrder = errorAnalysis({
  verifyTemplateId: 'e_alg_verify_step_order_v1',
  cognitiveOp: 'recover-the-unit',
  drawParams: (r) => {
    const a = r.int(2, 5);
    const k = r.int(2, 6);
    const b = a * k;
    const lift = k * (a - 1);
    const drawnX = r.int(lift + 2, lift + 20);
    let x = drawnX;
    for (let j = 0; j < 19; j++) {
      const cand = lift + 2 + ((drawnX - lift - 2 + j) % 19);
      const c = a * cand + b;
      const wrong = c / a - b;
      if (![a, b, c].includes(cand) && ![a, b, c].includes(wrong) && wrong !== cand) {
        x = cand;
        break;
      }
    }
    return { a, b, c: a * x + b };
  },
  build: (v, p) => ({
    // A TERM'S BILL, NOT ONE BOOKING, AND READING A SERVED WEEK IS WHY. The
    // verify's own guard forces the hours well clear of the shortfall k(a − 1),
    // so they land between eight and twenty-eight — and "a court booked for
    // eighteen hours" is not a thing that happens. Nothing about the arithmetic
    // changes; the bill is a term's, and eighteen hours across a term is what a
    // club actually books. Same lopsided-scene class as the sawmill above.
    prompt: `A sports centre charges £${fmtInt(Number(p.a))} for every hour a court is booked, and £${fmtInt(Number(p.b))} a term for the floodlight key, however much the court is used. One club's bill for the whole term came to £${fmtInt(Number(p.c))}. Asked how many hours the club had booked over the term, a student wrote ${v.wrong}.`,
    extension: 'Write how many hours the club really booked, and say at which point the student stopped following the story.',
    hints: [
      'Which of the charges on this bill was the last one to be added on?',
      'Take the bill apart in the reverse of the order it was built up in, and check your answer by building the bill again from it.',
    ],
    errorTags: ['procedure-slip', 'task-comprehension'],
    answerKeywords: [v.correct],
  }),
});

/**
 * THE R-LITE PART (decision 5), and the catalog's own Day-5 line: three worked
 * solutions to critique, one per move, plus the written reflection §7 names as
 * the flagged open part.
 *
 * The numbers are chosen rather than drawn because the lesson is in their shape.
 * Nell's story does nothing to any number, so it wants the pair — and she adds
 * the difference instead of scaling, which is E1's named slip arriving one last
 * time. Omar's story hands over its own result, so it wants undoing in reverse —
 * and he divides before subtracting, which is the same slip the error-analysis
 * above catches. Priya's story does something and asks where it ends, and her
 * arithmetic is faultless: she reports the part taken rather than the part left,
 * which is the one wrong answer on the page that no rule about tools can fix.
 *
 * That last one is deliberate and is the reason the page ends where it does. A
 * capstone that taught "pick the right tool and you are safe" would be teaching
 * something false.
 */
const capstoneCritique = reasoning({
  // THREE SCENES, NOT TWO, and reading a served week is why: the first version
  // put Omar's bill and Priya's tray both on scones, so two of the three
  // workings on one page were about the same thing. E22 and E23 each found the
  // identical collision on their own Day 5. A hire desk shares nothing with a
  // tea room, and the urns are not d19's paint pots.
  prompt:
    'Three students answered three different questions. NELL: "3 urns fill 18 mugs, so how many mugs do 8 urns fill? 8 is 5 more than 3, so 18 and 5 more is 23 mugs." OMAR: "A bill is the same price for each of 5 scones, with a £4 charge for the table on top, and it came to £29. 29 shared between 5 is 5.80, then take off the 4, so a scone is £1.80." PRIYA: "A hire desk has 24 helmets and a quarter of them are signed out before noon, so how many are still on the desk? A quarter of 24 is 6, so 6." For each student, say where the missing number sat in their story — was it where the story ended, where it began, or the partner of a finished pair? Then say which student\'s METHOD was sound, and why being right about the method was still not enough. For each of the other two, write the one sentence you would say to them. Finish by writing how YOU decide, before calculating anything, which of the three moves a question is asking for.',
  value:
    'Nell wanted the partner of a finished pair and scaled by adding rather than multiplying: 8 urns is not 5 more urns but the same pair taken over again, and 3 urns to 18 mugs makes 6 mugs an urn, so 8 urns fill 48. Omar wanted the start of a story handed its own result, and undid the moves in the order they were MADE rather than in reverse: the £4 went on last, so it has to come off first, and it was never part of any scone\'s price to be shared by five — take it off and £25 over 5 scones is £5 each. Priya is the one whose method was sound and it was not enough: she chose the forward move correctly and then answered a different question from the one asked, because a quarter of 24 is 6 signed out and the desk still holds 18. All three answers are wrong; only one of the three mistakes is about choosing.',
  keywords: false,
  hints: [
    'Before you check any of the arithmetic, does each of these three stories actually do something to a number?',
    'Take each story in turn and name the number that is missing, then follow only that student whose working starts from the right end.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * THE VOCABULARY REVIEW the catalog names (decision 6). Every term carries its
 * own correct meaning and its own two confusions, so each card is keyed exactly
 * when its term is drawn and no card can be permanently wrong.
 *
 * ---------------------------------------------------------------------------
 * THE CARD LENGTHS ARE PART OF THE DESIGN, AND THE FIRST VERSION OF THIS ITEM
 * WAS A 100% GIVEAWAY BECAUSE THEY WERE NOT.
 *
 * Measured over 1,400 served packs on two disjoint lattices, "pick the longest
 * card and read nothing" scored 100.0% — all five correct meanings were the
 * longest of their three, because a true definition wants a qualifying clause
 * and a stated misconception does not. Nothing in the battery looks at text
 * length: `bb-answer-entropy-test` reports a keyed text that never moves, a card
 * that is never correct, and a constant NUMERIC rank, and this item trips none
 * of them. It is kit §E2.11's fixed-rank defect wearing characters instead of
 * digits, and it is a new instance of that class.
 *
 * The cure is the same one §E2.11 prescribes for the numeric case — rotate the
 * rank rather than flatten it — made structural: SIX terms, and the correct card
 * is the longest of its three on exactly two of them, the middle on exactly two,
 * and the shortest on exactly two. The term is drawn uniformly, so each length
 * rank is keyed exactly a third of the time BY CONSTRUCTION rather than by
 * hope, and the assertion below fails the build if a later edit unbalances it.
 * ---------------------------------------------------------------------------
 */
const TERMS = [
  {
    // correct = SHORTEST
    term: 'the unit rate',
    correct: 'how much of one thing goes with one of the other',
    wrong: [
      {
        text: 'how much of one thing goes with all of the other put together',
        tag: 'concept-misconception' as ErrorTag,
        rationale: 'Names the total rather than the rate. A rate survives being scaled up or down; a total does not.',
      },
      {
        text: 'how much of one thing there is once the counting is finished',
        tag: 'representation-misread' as ErrorTag,
        rationale: 'Reads a single count off the page. A rate is always two quantities set against each other, never one on its own.',
      },
    ],
  },
  {
    // correct = LONGEST
    term: 'the range',
    correct: 'how far apart the largest and the smallest readings are',
    wrong: [
      {
        text: 'how large the largest reading is',
        tag: 'representation-misread' as ErrorTag,
        rationale: 'Reports one end of the data instead of the distance between the two ends, so two sets equally spread at different heights would come out different.',
      },
      {
        text: 'how many readings were taken',
        tag: 'task-comprehension' as ErrorTag,
        rationale: 'Counts the readings rather than measuring them. How many there are says nothing at all about how spread out they are.',
      },
    ],
  },
  {
    // correct = MIDDLE
    term: 'the inverse',
    correct: 'the move that puts back what another move did',
    wrong: [
      {
        text: 'the move that does the same thing again',
        tag: 'procedure-slip' as ErrorTag,
        rationale: 'Repeats the move instead of undoing it, which takes you twice as far the wrong way rather than back where you started.',
      },
      {
        text: 'the move that comes next in the order it was written in',
        tag: 'task-comprehension' as ErrorTag,
        rationale: 'Confuses which move to make with when to make it. Undoing runs backwards through a story, so the written order is the order NOT to use.',
      },
    ],
  },
  {
    // correct = SHORTEST
    term: 'the complement',
    correct: 'the chance of the thing not happening',
    wrong: [
      {
        text: 'the chance of the thing happening a second time over',
        tag: 'concept-misconception' as ErrorTag,
        rationale: 'Reads it as a repeat of the event rather than the other piece of the same whole.',
      },
      {
        text: 'the chance of the thing happening, written upside down',
        tag: 'representation-misread' as ErrorTag,
        rationale: 'Turns the fraction over, which is a change of notation rather than a change of event, and gives a size above one whenever the event is likely.',
      },
    ],
  },
  {
    // correct = LONGEST
    term: 'the constant of proportionality',
    correct: 'the number every value is multiplied by to reach its partner',
    wrong: [
      {
        text: 'the number added to every value',
        tag: 'concept-misconception' as ErrorTag,
        rationale: 'The additive reading of a proportional table, and this year\'s most durable slip: it fits any single row and fails every other one.',
      },
      {
        text: 'the number that repeats down a column',
        tag: 'representation-misread' as ErrorTag,
        rationale: 'Looks for a repeated value in the table rather than a repeated relationship between the two columns.',
      },
    ],
  },
  {
    // correct = MIDDLE
    term: 'a spare quantity',
    correct: 'a number the question states and does not need',
    wrong: [
      {
        text: 'a number left over at the end of a division',
        tag: 'procedure-slip' as ErrorTag,
        rationale: 'Confuses it with a remainder. A remainder is produced by the arithmetic; a spare quantity was printed before any arithmetic began.',
      },
      {
        text: 'a number you have to work out before you can start on the rest',
        tag: 'task-comprehension' as ErrorTag,
        rationale: 'Describes the first step of a chain, which is a number the question very much does need — the opposite of a spare one.',
      },
    ],
  },
] as const;

/**
 * The length-rank balance asserted rather than trusted (see the note above).
 * Two terms at each rank, so a uniform draw over the six keys each rank at
 * exactly a third.
 */
{
  const ranks = TERMS.map((t) => {
    const lens = [t.correct, ...t.wrong.map((w) => w.text)].map((s) => s.length).sort((a, b) => a - b);
    return t.correct.length === lens[2] ? 'longest' : t.correct.length === lens[0] ? 'shortest' : 'middle';
  });
  for (const want of ['longest', 'middle', 'shortest']) {
    const n = ranks.filter((x) => x === want).length;
    if (n !== 2) {
      throw new Error(`E24 toolkitVocab: the correct card is the ${want} of its three on ${n} terms, not 2 — "pick the ${want} card" would score ${((100 * n) / TERMS.length).toFixed(1)}%`);
    }
  }
}

const toolkitVocab: ItemGen = (rng, guard, difficulty) => {
  const pick = TERMS[rng.int(0, TERMS.length - 1)];
  return classify({
    prompt: `A word from this year, and three accounts of what it means. Which one says what ${pick.term} is?`,
    correct: pick.correct,
    distractors: pick.wrong.map((w) => ({ text: w.text, errorTag: w.tag, rationale: w.rationale })),
    hints: [
      'Is this word naming a single number that was printed somewhere, or something you have to work out from two numbers together?',
      'Try each account on a table you remember from this year and keep the one that still holds on the second row.',
    ],
    errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
  })(rng, guard, difficulty);
};

// ---------------------------------------------------------------------------
// The puzzle — three moves, one order (decision 7)
// ---------------------------------------------------------------------------

type Move = { text: string; op: 'mul' | 'add' | 'div'; n: number };

const step = (v: number, m: Move): number | null => {
  if (m.op === 'mul') return v * m.n;
  if (m.op === 'add') return v + m.n;
  return v % m.n === 0 ? v / m.n : null;
};

const ORDERS: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0],
];

type PuzzleCell = { start: number; moves: readonly [Move, Move, Move]; target: number };

/**
 * Every legal puzzle, enumerated ONCE at module load rather than drawn and
 * repaired — the shape E17's `SIGN_CARDS` and E23's `CELLS` established, and the
 * only way to make uniqueness a fact rather than a hope.
 *
 * A cell is kept only when at least THREE of the six orders keep every stage a
 * positive whole number and exactly ONE of those reaches the target. With fewer
 * than three legal orders the puzzle stops being a search and becomes a
 * divisibility hunt, which is a different and much smaller task.
 */
function buildPuzzleCells(): PuzzleCell[] {
  const out: PuzzleCell[] = [];
  for (let start = 4; start <= 12; start++) {
    for (let mul = 2; mul <= 5; mul++) {
      for (let add = 6; add <= 20; add++) {
        for (let div = 2; div <= 5; div++) {
          if (div === mul) continue;
          const moves = [
            { text: `multiply by ${mul}`, op: 'mul' as const, n: mul },
            { text: `add ${add}`, op: 'add' as const, n: add },
            { text: `divide by ${div}`, op: 'div' as const, n: div },
          ] as const;
          const results: number[] = [];
          // Every order's result with FRACTIONS ALLOWED. A design challenge
          // measured that on 15.0% of otherwise-legal cells a second order also
          // lands exactly on the target and is rejected only by the printed
          // "no stage is ever a fraction" clause. Uniqueness that depends on the
          // solver honouring a clause is not enumerated uniqueness, so those
          // cells are dropped and the answer is unique even to a solver who
          // ignores the clause entirely.
          const loose: number[] = [];
          for (const order of ORDERS) {
            let v: number | null = start;
            let f: number | null = start;
            for (const i of order) {
              const m = moves[i];
              if (f !== null) {
                f = m.op === 'mul' ? f * m.n : m.op === 'add' ? f + m.n : f / m.n;
                if (f <= 0) f = null;
              }
              v = v === null ? null : step(v, m);
              if (v === null || v <= 0) { v = null; }
            }
            if (v !== null) results.push(v);
            if (f !== null) loose.push(f);
          }
          if (results.length < 3) continue;
          for (const target of new Set(results)) {
            if (results.filter((x) => x === target).length !== 1) continue;
            if (loose.filter((x) => x === target).length !== 1) continue;
            if ([start, mul, add, div].includes(target)) continue;
            out.push({ start, moves, target });
          }
        }
      }
    }
  }
  return out;
}

const PUZZLE_CELLS = buildPuzzleCells();
if (PUZZLE_CELLS.length < 200) {
  throw new Error(`E24 puzzle: only ${PUZZLE_CELLS.length} cells have a unique order among three or more legal ones`);
}

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildE24 = makeWeekBuilder({
  level: 'E',
  week: 24,
  conceptId: 'pre-algebra-capstone',
  conceptName: 'Pre-algebra capstone',
  strandTags: ['algebra-geometry', 'probability-statistics'],
  prerequisiteWeeks: [E2, E13, E17, E21],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the unknown\'s place decides the move',
  conceptFamily: 'operation',
  deepeningDelta:
    'Every week of this year handed the child the tool along with the question. A percent week asked percent questions; an equations week asked for a solution and had already drawn the balance. The mathematics was hard and the choosing was free, and a child could be fluent all year without ever once deciding what kind of problem was in front of them. E24 takes the label off. Its items come from four families and sit on one page in no announced order, so the first move on every question is a decision that no earlier week required: read what has NOT been given, and find where it sits. That is the genuinely new work, and it is not a review of anything — it is the skill the whole year was the prerequisite for. Two further things arrive with it. Because the same three numbers can be arranged into a story that walks forwards, one that walks backwards and one that does not move at all, the surface stops being evidence: nouns, sizes and sentence length all say nothing. And because a right choice of move can still be followed by an answer to the wrong question, the week ends by making that its third worked solution rather than pretending that choosing well is the whole of it.',
  explanation: {
    hook:
      'Here is a question you have met a hundred times this year, with one thing taken away: nobody has told you what kind of question it is. No chapter heading, no worked example above it, no week it belongs to. Just a story, some numbers, and a thing you have not been told. That is what every question outside a school book looks like.',
    whyBeforeHow:
      'Start by finding the thing you have NOT been told, because the unknown\'s place decides the move, and it decides it before you know a single thing about the numbers. There are only three places it can sit. Sometimes the story does something to a number and asks you where it ends up — three hundred seats and a fifth of them go, how many now. You can walk straight through that, doing what it says in the order it says it. Sometimes the story does exactly the same thing to a number but hands you where it ENDED, and asks where it began. Now you must walk it backwards, undoing each move — and here is the part that costs marks, you must undo them in the OPPOSITE order, because the last thing that was done to a number is the first thing that has to come off it. Think of a parcel: the last piece of tape on is the first one you cut. And sometimes the story does nothing to anything at all. It finishes one pair of numbers and leaves a second pair half-written — three trips carried ninety, so what do eight trips carry — and there is nothing to walk in either direction. You find what the finished pair does, and you do the same to the other one. The reason this is worth its own week is that the surface will not tell you which of the three you are in. The nouns can be identical. The numbers can be identical. A sensible-looking estimate will not save you, because a story that walks backwards from a reduction gives an answer BIGGER than the number you were handed, and every instinct says a reduction makes things smaller. So the first thing you do is not arithmetic. Name the missing number, ask where it sits, and only then pick the move.',
    script: [
      {
        say: 'Watch me do the first thing I do on any question, which is not arithmetic. A cinema puts three hundred seats on sale and cuts that by a fifth. How many now? I am not going to work that out yet. First: what have I not been told? The number of seats after the cut. Where does that sit? The story does something — it cuts — and I am asked where it ends up. So I can walk straight through, in the order it is written. A fifth of three hundred is sixty, and three hundred less sixty is two hundred and forty.',
        visual: 'Three hundred seats, a fifth of them taken away, and what is left.',
        figure: barModel(
          [
            { label: 'on sale before the cut', segments: [{ value: 240, label: '240' }, { value: 60, label: '60', fill: 'hatch' }], total: '300' },
            { label: 'on sale now', segments: [{ value: 240, label: '240' }] },
          ],
          { scaleMax: 300, alt: 'a bar of 300 split into 240 and a hatched 60, above a bar of just 240' },
        ),
      },
      {
        say: 'Now the same cinema, the same fifth, and one word moved. It puts two hundred and forty seats on sale AFTER the cut. How many before? Nothing about the mathematics has changed and everything about the work has. What I have not been told is now at the other end. So I walk backwards: two hundred and forty is four fifths of what I want, one fifth is sixty, and five fifths is three hundred. And notice what my instinct did there — it wanted a smaller answer, because a cut makes things smaller. Undoing a cut does not. If you check nothing else, check that the direction of your answer is the direction the question actually asked for.',
        visual: 'The same two bars, with the known and the unknown swapped.',
        figure: barModel(
          [
            { label: 'on sale now', segments: [{ value: 240, label: '240' }] },
            { label: 'on sale before the cut', segments: [{ value: 240, label: '240' }, { value: 60, label: '?', fill: 'hatch' }], total: '?' },
          ],
          { scaleMax: 300, alt: 'a bar of 240, above a longer bar made of 240 and a hatched unknown piece' },
        ),
      },
      {
        say: 'Third one, and it is the one people get wrong for a reason that has nothing to do with arithmetic. A cable car carried ninety people over three trips. How many over eight? Ask my question. What have I not been told? The people over eight trips. Where does it sit? Now — does this story DO anything to a number? Read it again. No. Nothing is added, nothing is taken, nothing is cut. It hands me one finished pair, three trips with ninety people, and half of another, eight trips with a gap. There is no direction to walk in. I find what the finished pair does — thirty people a trip — and I do the same to the other one. Two hundred and forty.',
        visual: 'One finished pair beside one half-written pair.',
        figure: barModel(
          [
            { label: 'three trips', segments: [{ value: 30, label: '30' }, { value: 30, label: '30' }, { value: 30, label: '30' }], total: '90' },
            { label: 'eight trips', segments: [{ value: 30, label: '30' }, { value: 30, label: '30' }, { value: 30, label: '30' }, { value: 30, label: '30' }, { value: 30, label: '30' }, { value: 30, label: '30' }, { value: 30, label: '30' }, { value: 30, label: '30' }], total: '?' },
          ],
          { scaleMax: 240, alt: 'a bar of three equal parts totalling 90, above a bar of eight of the same parts whose total is not given' },
        ),
      },
      {
        say: 'One last habit, and it is the one that will still catch you when everything else is right. A tray holds twenty-four scones and a quarter go before noon. How many are LEFT? A quarter of twenty-four is six. Six is a perfectly good number, correctly worked out, and it is the wrong answer, because it is how many went. Choosing the right move gets you to the right arithmetic. It does not get you to the right question. So the last thing I do, every time, is read the question again and ask what it actually wanted a number OF.',
        visual: 'The tray, with what went and what is left named separately.',
        figure: barModel(
          [
            { label: 'the tray at the start', segments: [{ value: 6, label: '6 went', fill: 'hatch' }, { value: 18, label: '18 left' }], total: '24' },
          ],
          { scaleMax: 24, alt: 'one bar of 24 cut into a hatched 6 and a plain 18' },
        ),
      },
    ],
    summary:
      'A question outside a textbook does not say what kind of question it is, so the first move is never arithmetic: find the thing you have not been told, and the unknown\'s place decides the move. If the story does something to a number and asks where it ends, walk forwards through it in the order it is written. If the story does the same thing but hands you where it ended, walk backwards and undo the moves in the OPPOSITE order — the last thing done is the first thing off. And if the story does nothing at all, it has finished one pair of numbers and left another half-written, so find what the finished pair does and do the same to the other. The surface will not help you choose: the nouns can match, the numbers can match, and undoing a reduction gives an answer larger than the one you were handed however wrong that feels. Choose the move first. Then, having chosen well, read the question once more, because the right arithmetic can still answer the wrong question.',
    vocabulary: [
      { term: 'the unknown', kidGloss: 'the thing the question has not told you — the first thing to find, before any arithmetic' },
      { term: 'the inverse', kidGloss: 'the move that puts back exactly what another move did; undoing runs through them in reverse order' },
      { term: 'the unit rate', kidGloss: 'how much of one thing goes with exactly one of the other, which is what makes a pair scalable' },
      { term: 'the constant of proportionality', kidGloss: 'the number every value is multiplied by to reach its partner, the same all the way down a proportional table' },
      { term: 'a spare quantity', kidGloss: 'a number the story states and the question does not need; printed is not the same as needed' },
    ],
  },
  guidedExamples: [
    {
      ...ge(24, 1, 'modeled', 'This morning\'s post reaches a sorting office in 7 sacks, each holding 15 letters, with 9 letters loose on top, and 4 vans are waiting in the yard. How many letters are there to sort?', [
        {
          teacherSay:
            'Before I touch a number, let me find what I have not been told: how many letters there are to sort. Now, does this story do something to a number? Yes — the sacks and the loose letters are being brought together. And it hands me the parts and asks what they come to, so the missing number is where the story ends up. I walk forwards.',
        },
        {
          teacherSay:
            'But first, one thing I always check on a page with this many numbers. Is every number here a number I need?',
          expected: 'no, the four vans are not used',
        },
        {
          childDo: 'Work out what the full sacks hold between them, then join on the letters that came loose.',
          expected: '114',
        },
      ], '114'),
      visual: 'The seven full sacks and the loose letters, joined into one morning\'s post.',
      figure: barModel(
        [
          { label: 'seven full sacks', segments: [{ value: 105, label: '105' }] },
          { label: 'the whole post', segments: [{ value: 105, label: '105' }, { value: 9, label: '9', fill: 'hatch' }], total: '114' },
        ],
        { scaleMax: 114, alt: 'a bar of 105, and beneath it the same bar with a hatched 9 added, totalling 114' },
      ),
    },
    {
      ...ge(24, 2, 'completion', 'A sawmill cuts every log into the same number of planks. From 6 logs the yard received 51 sound planks, after 3 planks were set aside as split. How many planks does one log give?', [
        {
          teacherSay: 'What have I not been told here, and is the number I have been given what the logs produced or what was left after some came out?',
          expected: 'the planks per log; 51 is what was left',
        },
        {
          childDo: 'Put the split planks back with the sound ones, and share what that comes to between the logs.',
          expected: '9',
        },
      ], '9'),
      visual: 'The split planks put back before anything is shared.',
      figure: barModel(
        [
          { label: 'what the yard received', segments: [{ value: 51, label: '51' }] },
          { label: 'what the logs produced', segments: [{ value: 51, label: '51' }, { value: 3, label: '3', fill: 'hatch' }], total: '54' },
        ],
        { scaleMax: 54, alt: 'a bar of 51, and beneath it the same bar with a hatched 3 put back, totalling 54' },
      ),
    },
    ge(24, 3, 'prompted', 'Here are two stories. A gauge reads -11 and the water then rises 14 centimetres; what does it read now? A cable car carried 84 people over 4 trips; how many over 12? Say where the missing number sits in each — where the story ends, where it began, or the partner of a finished pair — and give both answers.', [
      {
        childDo: 'Ask of each story whether anything is actually done to a number, and let that decide before you calculate.',
        expected: 'where it ends, 3; the partner of a pair, 252',
      },
    ], 'where it ends, 3; the partner of a pair, 252'),
    {
      // Independent stage: no figure. Deciding which of the three moves the
      // question wants IS the task, so a drawn bar model would hand over the
      // shape the item exists to ask for (L33).
      ...ge(24, 4, 'independent', 'A cinema has cut the number of seats it puts on sale by 25%. After the cut it puts 96 seats on sale. Before you work anything out, say whether the answer will be larger or smaller than 96, and why you are sure. Then find how many seats it put on sale before the cut. Solve cold.', [
        { childDo: 'Name the missing number and say where it sits, commit to a direction out loud, and only then calculate.', expected: 'larger; 128' },
      ], 'larger; 128'),
    },
  ],
  days: [
    // Day 1 — concept echo: one item for each of the three places the unknown
    // can sit, single-step throughout, no chains and no choices yet.
    //
    // The warm-up ORDER is load-bearing, which nothing in the kit says and only
    // reading a served pack shows: `applyRetrievalRamp` moves the LAST Day-1
    // retrieval item to Day 5, which carries no warm-up of its own. The range
    // sits last, so Day 5 gains the one format the rest of the week never uses.
    [
      { gen: wEquation, diff: 2 },
      { gen: wPercent, diff: 2 },
      { gen: wSummary, diff: 2 },
      { gen: sitScaleTheRun, diff: 3 },
      { gen: sitSignedShift, diff: 3 },
    ],
    // Day 2 — fluency + application: the commitment made before any arithmetic,
    // the unsignalled choice itself, and the first cross-family chain.
    [
      { gen: wRate, diff: 2 },
      { gen: wPercent, diff: 2 },
      { gen: sitBackToTheStartEstimate, diff: 3 },
      { gen: discrimWhichEnd, diff: 4 },
      { gen: msTakeOffThenShare, diff: 4 },
    ],
    // Day 3 — interleave: a backwards chain and a forwards chain either side of
    // a single scaling read, so nothing on the page signals what comes next.
    [
      { gen: wEquation, diff: 2 },
      { gen: msUndoTheBuild, diff: 4 },
      { gen: sitScaleTheRun, diff: 3 },
      { gen: msSpareReading, diff: 4 },
    ],
    // Day 4 — word problems: all three chains at full difficulty, plus one
    // single-step item so "it must be a chain" never becomes the cue.
    [
      { gen: msTakeOffThenShare, diff: 5 },
      { gen: msUndoTheBuild, diff: 5 },
      { gen: msSpareReading, diff: 4 },
      { gen: sitSignedShift, diff: 3 },
    ],
    // Day 5 — written: the claim's own failure mode, the three-solution critique
    // with the reflection, and the vocabulary review (+ a ramped warm-up).
    [
      { gen: eaUndoOutOfOrder, diff: 4 },
      { gen: capstoneCritique, diff: 4 },
      { gen: toolkitVocab, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this week takes the label off. All year the page has told your child what kind of question was coming — a percent chapter asks percent questions — and that is a scaffold nobody outside a textbook gets. So the first move here is not arithmetic at all: find the thing the question has NOT told you, and ask where it sits. If the story does something to a number and asks where it ends up, work forwards. If it hands you where it ended and asks where it began, work backwards and undo the moves in the reverse of the order they were done — the last thing on is the first thing off, like tape on a parcel. And if the story does nothing to anything, it has finished one pair of numbers and left another half-written, so find what the finished pair does and do the same. One thing worth knowing, because it feels wrong and is right: undoing a reduction gives an answer BIGGER than the number you were handed. If your child says "but it was a sale, it should be less", that is the exact moment the week is for. And a last one that is not about choosing at all — check what the question asked for a number OF. A quarter of the tray sold is a perfectly good number and it is not how many are left.',
  ],
  puzzle: (r) => {
    // THREE MOVES AND NO ORDER, which is the week run backwards: every day item
    // is handed the moves in the order the story fixes and has to carry them
    // out, and this one is handed the moves with no order at all. Neither Day-1
    // structure produces it — both hand over a settled sequence.
    //
    // Uniqueness is enumerated at module load, never asserted (decision 7), and
    // the three moves are shuffled before they are lettered so the answer is
    // not "A, B, C" more often than a sixth of the time.
    const cell = r.pick(PUZZLE_CELLS);
    const order = r.shuffle([0, 1, 2]);
    const lettered = order.map((i, slot) => ({ letter: 'ABC'[slot], move: cell.moves[i] }));
    let solution: string[] = [];
    for (const perm of ORDERS) {
      let v: number | null = cell.start;
      for (const i of perm) {
        v = v === null ? null : step(v, cell.moves[i]);
        if (v === null || v <= 0) { v = null; break; }
      }
      if (v === cell.target) {
        solution = perm.map((i) => lettered.find((l) => l.move === cell.moves[i])?.letter ?? '?');
      }
    }
    return {
      id: 'E24-PZ-01',
      title: 'Puzzle Grove: The Order of the Moves',
      puzzleType: 'construction',
      prompt: `Start at ${fmtInt(cell.start)}. Three moves have to be made, each exactly once: ${lettered.map((l) => `${l.letter} — ${l.move.text}`).join('; ')}. Done in the right order they finish on ${fmtInt(cell.target)}, and no stage along the way is ever a fraction or below nothing. Write the three letters in the order the moves must be made. Then say in one sentence what you looked at first to rule an order out.`,
      answer: {
        value: solution.join(', '),
        acceptableForms: [solution.join(', '), solution.join(' '), solution.join('')],
        validation: 'ordered-list',
      },
      hintLadder: [
        'Which of these three moves is the fussiest about the number it is handed?',
        'Try each order in turn and stop the moment a stage gives you a fraction, then check what the survivors finish on.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
  puzzleMeta: { stepCount: 3, cognitiveOp: 'order-the-moves' },
  sprint: {
    skill: 'Multiplication and division facts to 12 — the arithmetic every one of the three moves runs on',
    sourceWeek: E13,
    itemCount: 20,
    scheduledDay: 3,
    templateId: 'mult_facts_v1',
    params: { factorRange: [2, 12] },
  },
  // THE DISCRIMINATION AND THE VOCABULARY ITEM ARE BOTH ABSENT, for E21 decision
  // 5b's reason: a three-option page concedes a third of a slot to a guesser
  // before any reasoning happens, and this form certifies only where the work
  // has to be done. The error-analysis and the R-lite critique are barred for
  // the ordinary reason — neither is machine-scored.
  mastery: [
    { gen: sitScaleTheRun, diff: 3 },
    { gen: msTakeOffThenShare, diff: 4 },
    { gen: sitSignedShift, diff: 3 },
    { gen: msUndoTheBuild, diff: 4 },
    { gen: sitBackToTheStartEstimate, diff: 3 },
    { gen: msSpareReading, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. The form is built so that the six slots between them demand all three moves rather than six exercises of one. 01: ACROSS — a finished pair of trips and people, and its partner, with nothing done to any number. 02/06: FORWARDS chains — a percentage taken off before an equal share, and a rebuild from filled trays and a remainder that also states a quantity it never spends. 03: the number system the moves run on, a signed gauge reading either side of a marked line, drawn so the answer is genuinely either sign. 04: BACKWARDS, inverse-start — the yard is handed what it received, so the opening move is to put back what was taken out before anything can be shared. 05: BACKWARDS again behind a commitment made before any arithmetic — the same printed number is the count before the cut on one branch and the count after it on the other, drawn, so no size on the page moves with the answer. What the pairing does not claim: slots 02 and 05 draw their percentage from one five-entry table, so the two forms can present the same percentage with different counts; the counts always differ, so no answer carries across.',
  mistakeBank: [
    {
      errorTag: 'task-comprehension',
      subtype: 'walked-forwards-from-the-end',
      description:
        'Takes the number the story hands over as the one to start from, whichever end of the story it came from. It is the single most expensive habit this year produces, because it is right on every forward question and every forward question is the majority — so it survives all the way to a page where nobody says which kind is coming.',
      exampleWrongAnswer: 'a sale price reduced a second time when the question asked what the price had been before the sale',
      distractorRationale:
        'Offer the value the forward moves produce from the number given, so only reading which end of the story that number came from separates it from the truth.',
      reteachPointer: 'explanation/script[1] (nothing about the mathematics has changed and everything about the work has) then guidedExamples/E24-GE-02',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'undone-in-the-written-order',
      description:
        'Decides correctly to go backwards and then undoes the moves in the order the sentence wrote them rather than in reverse. What makes it durable is that it looks like following the story faithfully; the parcel image is the cure, since the last piece of tape on is the first one that has to be cut.',
      exampleWrongAnswer: 'a bill divided by the number of items before the fixed charge was taken off it',
      distractorRationale:
        'Offer the value the moves undone in the written order produce, so only asking which move was made last separates it from the truth.',
      reteachPointer: 'explanation/whyBeforeHow (the last thing that was done to a number is the first thing that has to come off it) then the Day-5 error-analysis',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'scaled-by-adding',
      description:
        'Scales a finished pair by adding the difference instead of multiplying by the factor, so three trips going to eight is read as five more of something. It fits the row it was invented on and fails every other row, which is exactly why it survives a single check and dies on the second.',
      exampleWrongAnswer: 'eighteen cups from three pots read as twenty-three cups from eight pots',
      distractorRationale:
        'Offer the additively scaled partner, so only asking whether the pair keeps a difference or a multiplier separates it from the truth.',
      reteachPointer: 'explanation/script[2] (I find what the finished pair does and I do the same to the other one) then guidedExamples/E24-GE-03',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'two-numbers-read-as-a-rate',
      description:
        'Sees two numbers standing near each other and reads them as a pair that must scale, on a story where something was simply done once. Nothing stays the same from one lot to the next in those stories, because there are no lots — and a scaling answer to a one-off change is wrong by a whole order of size rather than a little.',
      exampleWrongAnswer: 'a queue of ninety with three taken off read as thirty a time',
      distractorRationale:
        'Offer the scaled value, so only asking whether the story does anything at all to a number separates it from the truth.',
      reteachPointer: 'explanation/script[2] (does this story DO anything to a number? Read it again) then guidedExamples/E24-GE-03',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The capstone — choosing which tool a question wants when nothing on the page says. We worked on finding the thing a question has not told you and asking where it sits: at the end of what the story does, at the start of it, or as the partner of a pair the story has already finished. We also worked on undoing moves in the reverse of the order they were made, and on checking at the end what the question actually asked for a number of.',
    improvingCandidates: [
      'naming the missing number before doing any arithmetic',
      'telling a story that does something from one that only sets out a pair',
      'undoing a sequence of moves in reverse rather than in writing order',
    ],
    strengtheningByTag: [
      {
        errorTag: 'task-comprehension',
        text: 'reading which end of a story the number you were handed came from',
      },
      {
        errorTag: 'procedure-slip',
        text: 'undoing the last move first, the way tape comes off a parcel',
      },
      {
        errorTag: 'concept-misconception',
        text: 'scaling a pair by what it multiplies by, never by the difference between its terms',
      },
      {
        errorTag: 'representation-misread',
        text: 'checking whether a story really repeats before treating two numbers as a rate',
      },
    ],
    homeFocus: {
      praiseLine:
        'You noticed that the number you had been given was the one the story ended on, and you turned the whole thing round before you calculated anything. Deciding which way to walk before you start is the whole of this week.',
      questionForChild:
        'I paid £31 for a table at a cafe: a £4 charge for the table, and the same price for each of the 5 cakes. What is the first thing you would do, and why that one first?',
      schoolSyncHook:
        'If your child\'s class calls these inverse operations, or working backwards, or "doing the opposite in the opposite order", tell us the wording they use and we will match it.',
    },
    vocabularyForParent: [
      'the unknown (the thing the question has not told you — the first thing to find)',
      'the inverse (the move that puts back what another move did; undoing runs in reverse order)',
      'a spare quantity (a number the story states and the question does not need)',
    ],
  },
});
