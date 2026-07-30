/**
 * Level B · Week 24 — "Ready for Level C (consolidation)" (conceptId:
 * ready-for-level-c). THE LEVEL-EXIT GATE, and the week a child finishes Level B
 * on.
 *
 * FILL-ARCHITECTURE §4 row B24: concept "Ready for C"; anchor "mixed 2-step
 * stories"; multi-step "native"; error-analysis "(mixed)"; discrimination
 * "+/−/story-type choice"; Day-5 signature "exit check + reflection (oral R)".
 * Catalog cell: computational focus "Mixed capstone: place value, ±within 100,
 * time, money"; non-computational focus "Math-vocabulary crossword + logic
 * mini-puzzle set"; `isLevelExit: true`.
 *
 * IT IS A CONSOLIDATION WEEK, AND §3's CONSOLIDATION LAW IS WHAT CHANGES THE
 * PEDAGOGY. The law is explicit: A24/B24/C24/E24 are "documented *deepening* —
 * integration of the level's skills at raised complexity, explicit
 * `deepeningDelta`, retrieval share raised toward 30%, and a real exit-check
 * emphasis… never a bare mixed-review pile." So this week is NOT built the way a
 * new-concept week is. There is no new procedure to teach, no new vocabulary to
 * gloss into existence, and no new model to draw. What is new is a DEMAND, and
 * everything on the page exists to make that demand unavoidable rather than to
 * decorate it:
 *
 *   **NOTHING ON THE PAGE SAYS WHICH MOVE THE STORY WANTS.**
 *
 * Every earlier week of Level B announced its move by announcing itself. B13 was
 * the adding page, B14 the taking-away page, B10 the tens page, B16 the money
 * page, B17 the clock page. A child can be fluent in all twenty-three and never
 * once have CHOSEN — because the page title always chose for them. B24 takes the
 * title away, and then makes the surface cues unreliable on purpose:
 *
 *   - "LEFT" WANTS AN ADDITION. `sitHatsStart` says "27 hats are left in the
 *     basket" and the question is how many there were at the start, so the two
 *     parts have to be joined. A child holding "left means take away" is wrong.
 *   - "ALTOGETHER" WANTS A SUBTRACTION. `sitTrayRest` states the whole tray with
 *     the word "altogether" and asks for one part of it. A child holding
 *     "altogether means add" is wrong.
 *   - "ADDED" WANTS A SUBTRACTION. `sitTreeAdded` asks how many nest boxes were
 *     ADDED between spring and autumn, which is the gap between two stated
 *     counts. Three cue words, three betrayals, and the Day-5
 *     Always/Sometimes/Never asks the child to say so out loud.
 *   - ONE STORY STATES A NUMBER THE QUESTION NEVER WANTS (`msQueueSpare`,
 *     `posing: 'has-distractor'`, and `predictStallCost` carries one too). Every
 *     item in Level B before this one consumed every number it mentioned, which
 *     quietly teaches "use all the numbers" as a winning strategy. Here that
 *     strategy has to be dropped.
 *   - EVERY CHAIN CROSSES TWO CHAPTERS OF THE LEVEL, never one chapter twice:
 *     time feeding an addition (`msRideThenWalk`, B17 × B13), tens-and-ones
 *     feeding a subtraction (`msFirConesThenHome`, B2 × B14), and a queue that
 *     grows then shrinks around a spare number (`msQueueSpare`, B9 × B13/B14).
 *     That is the integration the law asks for: a child who can do every B week
 *     separately still meets something new here.
 *   - RETRIEVAL IS RAISED TO THE TOP OF THE BAND — 7 of 25 daily items (28.0%) —
 *     and sourced across the WHOLE level (B2, B13, B14, B17), so what is
 *     revisited is the year and not last week.
 *
 * SCOPE — WHAT THIS WEEK DELIBERATELY DOES NOT RE-LITIGATE. Week 24 of 24 means
 * nearly every idea it touches is already owned by a sibling, so the boundaries
 * are stated rather than hoped over:
 *
 *  1. **B15 owns the word "more"** — "'more than' as add vs 'how many more' as
 *     subtract" is its discrimination and its whole reason to exist. So the word
 *     "more" is never the unreliable cue here, "how many more" is never asked,
 *     and NO COMPARISON BAR MODEL is drawn anywhere in this pack. B24's cue axis
 *     is a different three words — **altogether, left, added** — and B15's
 *     settled skill is not revisited at all. (Its arithmetic still turns up, as
 *     arithmetic, inside `sitTreeAdded`'s gap.)
 *  2. **B7 owns missing addends** (6 + ▢ = 13, think-addition, the box as the
 *     unknown) and **B8 owns fact families** (the part-part-whole triangle,
 *     "which fact does not belong"). `discWhichNumber` lives next door to both
 *     and is neither: there is no box, no equation and no triangle: three
 *     NUMBERS are offered and the child has to say which one the QUESTION points
 *     at. The reasoning is part-whole; the task is choosing, which is what B7/B8
 *     never had to ask because their pages named the missing slot.
 *  3. **B9 owns story problems within 20** and its own trap ("'3 more than' is
 *     not add-3-to-the-answer"). B24 works within 100 and never poses a
 *     multiplicative or comparison-language story.
 *  4. **B13/B14 own the written column methods** and their trade. Not one page
 *     here is about WHERE a trade happens; the arithmetic is deliberately the
 *     easy half of every item, and both weeks appear as warm-ups, which is where
 *     a settled skill belongs.
 *  5. **B12/B17 own reading a clock.** There is no single-step clock-reading item
 *     in this pack, no quarter-past/quarter-to contrast and no hand-swap. Time
 *     enters twice only: as a B17 warm-up (elapsed inside one hour — settled
 *     skill, warm-up slot) and as the FIRST MOVE of `msRideThenWalk`, whose
 *     second move is an addition from another chapter. The child is never asked
 *     to NAME a time.
 *  6. **B16 owns coins.** No coin is drawn, counted or identified in this week —
 *     no `coin-set` figure, no nickel-as-one slip, no "more coins ≠ more money",
 *     no paying and no change. Money appears once, as PRICES already written as
 *     amounts (`predictStallCost`), because the level-exit check has to include
 *     money and the only honest way to do that without re-running B16 is to let
 *     the amounts be given. `centsLabel` is imported from `lib/money` so the
 *     `¢`/`$` rule stays in one place (POLISH §P1, and see the note on it below).
 *  7. **B2 owns tens-and-ones** and **B10 owns adding tens.** The tens structure
 *     is used, never taught: it is the B2 warm-up, and it is the first move of
 *     `msFirConesThenHome`, where "6 boxes of ten" has to become a number before
 *     any subtraction can start.
 *  8. **B19/B20/B21/B22/B23** (even-odd, arrays, measuring, halves, graphs) are
 *     not touched at all. A level exit cannot cover twenty-three weeks in
 *     twenty-five items, so the four the catalog names — place value, ± within
 *     100, time, money — are the four that are checked, and the rest are left to
 *     the Mid-Level Checkpoint and to Level C.
 *
 * NO ×, NO ÷ AND NO `n/d` FRACTION NOTATION ANYWHERE CHILD-FACING. The B24 row
 * grants none of them; C6/C9 own the operation symbols and C15 owns `n/d`. Every
 * calculation in this pack is an add or a take-away — which is what the catalog
 * cell says ("±within 100") — and the two-step items are spelled out as two
 * things a child does in order, never as an expression. (b19–b23 each made the
 * same declaration; it is repeated rather than assumed.)
 *
 * VERIFY-LIBRARY LIMIT — THERE ISN'T ONE, AND THE IMPOSSIBILITY WAS TESTED FIRST
 * (kit §E2.3, LEARNINGS L36: prove X is impossible BEFORE reaching for the
 * escape hatch). The recipe cell is "(mixed)", and the mix this week is really
 * about is the MOVE chosen with no signal, so the misconception to generate is
 * "joined two amounts when the story split one". That is an operation swap over
 * one fixed operand pair, which is exactly what
 * `d_verify_binop_misconception_v1` was built for: `{a, b, op:'-', wrongOp:'+'}`
 * returns `correct = a − b` and `wrong = a + b`, both code-derived from the
 * item's own operands. Nothing was reframed, nothing relocated and no number
 * invented. Two consequences worth copying:
 *   - the student's ADDITION IS PERFECTLY CORRECT (68 + 24 really is 92), so
 *     there is nothing to find in the digits. The only way into `eaMoveChosen` is
 *     to ask what a number that size could be a count OF — which is the size
 *     check the whole week is built on;
 *   - the same registry gives both discriminations a real pin (kit §F.1 / QG-11).
 *     `discWhichNumber` ships `d_verify_binop_v1` params, so its keyed option is
 *     RECOMPUTED from the operands — a wrong key is structurally impossible, not
 *     merely unlikely. `discTwoStepMiddle` ships `d_verify_ratchain_v1` params,
 *     so the option keyed correct is recomputed by folding the item's own chain.
 *     Both templates are correct-only (no `wrong`), which is what a
 *     discrimination needs: its wrong answers are its options, not a claim.
 *
 * GUESSABILITY, MEASURED NOT ASSUMED (kit §E2.11 — the newest trap, and the one
 * that bites hardest in a week whose items are all ± on two-digit numbers). Both
 * discriminations were designed against the three named shapes and then swept:
 *   - NO DEAD OPTION. Every option is a value drawn fresh each seed, and each
 *     one is keyed on a real share of the draws, because WHAT THE STORY ASKS FOR
 *     ROTATES. `discWhichNumber` asks for the whole on half its draws and for a
 *     part on the other half; `discTwoStepMiddle` runs its chain up-then-down on
 *     half and down-then-up on the other half. Nothing is offered-always and
 *     keyed-never, so `DECLARED_LURES` needed no new entry.
 *   - NO RELATIONAL INVARIANT. Rotating the ASK is what rotates the relation, not
 *     just the numbers (L39). On `discWhichNumber` the keyed value is the middle
 *     of the three offered when the whole is asked for and the smallest when a
 *     part is asked for; on `discTwoStepMiddle` it is the smallest on the
 *     up-then-down draws and the middle on the down-then-up draws. Measured over
 *     400 seeds: `discWhichNumber` keys the smallest option on 49% of its day
 *     draws and on 49% / 51% of its two mastery forms, `discTwoStepMiddle` on
 *     53%. So "pick the smallest" is a coin flip rather than a strategy, and the
 *     keyed option is the largest on 0% of every slot's draws.
 *   - AT LEAST ONE DISTRACTOR OVERSHOOTS, on both. This is the commonest defect
 *     in the corpus and it is easy to walk into here, because every ± mistake a
 *     six-year-old makes ("stop early", "take away instead of add") lands BELOW
 *     the answer, so "pick the biggest" would score 100%. So each discrimination
 *     carries a distractor ABOVE its answer, and both are real named errors
 *     rather than padding: `discWhichNumber` offers "counted the second pile
 *     twice" (whole + p2) and "joined the two stated numbers when the story
 *     splits one" (whole + p1); `discTwoStepMiddle` offers "did both jobs as
 *     joins, so nothing was ever taken out" (a + b + c). The keyed option is
 *     never the largest on any draw of either item.
 *
 * FIGURE LAW as applied here, and this week's application is UNUSUAL enough to
 * state as a decision rather than a formula (kit §F.7 / §E2.5 / L33). A picture
 * of a STRUCTURE — a part-whole bar, a filled grid, two bars side by side —
 * announces the shape of the story. Announcing the shape is precisely what this
 * week refuses to do. So b24 is deliberately a SPARSE week for figures, and the
 * ones it carries are chosen by one test: does the prose already name what the
 * picture shows?
 *   1. THE TWO CLOCKS. The B17 warm-up draws the face at the START of story
 *      corner and asserts `param:m` (`of:'minutes-past'`) — the very minute the
 *      prose states, so the picture claims a GIVEN. `msRideThenWalk` draws the
 *      face at the ARRIVAL time and asserts `param:initN`, because the arrival
 *      minute is the number its chain starts FROM; the same posture b23 used for
 *      the bar its chain opens on. Neither face is ever the answer: both items
 *      answer in minutes elapsed, which no clock in this pack shows.
 *      BOTH FACES CARRY A LABELLED ACCESSIBLE NAME (`labelledClockAlt`), and that
 *      is a departure from B12/B17 with a reason. `clockAlt` names only where the
 *      hands point, which is exactly right when reading the face IS the question.
 *      Here it is not: both items state TWO times in prose, so an unlabelled face
 *      leaves the reader — sighted or not — to guess which of the two is drawn.
 *      The label names the MOMENT ("the clock as the minibus reaches the pond")
 *      and still never names the reading, so the time itself lives only in the
 *      hands. Found by reading a generated page, not by a gate.
 *   2. THE TENS BAR on `msFirConesThenHome`: t segments of ten, to one shared
 *      scale, asserting `param:initN`. It shows the boxes of ten and NOT the
 *      loose cones, so it states the quantity the story hands over and leaves
 *      both moves — join the loose ones, then take the collage away — entirely to
 *      the child. `initN` is recoverable from the item's own params (initN/10
 *      segments), so this figure needs no box.
 *   3. THE WHOLE BAR on `eaMoveChosen`: one undivided bar for the whole crate,
 *      asserting `param:a`. Nothing is marked off. That is the one picture in the
 *      pack that does pedagogical work on a trap page, and it works by making
 *      the SIZE argument visible without making the number visible: a part of
 *      that bar obviously cannot be longer than the bar.
 *
 * WHAT IS DELIBERATELY NOT DRAWN, and why each absence is the content:
 *   - NEITHER DISCRIMINATION CARRIES A PICTURE. A part-whole bar beside
 *     `discWhichNumber` would announce that the story is a part-whole, which is
 *     the entire thing the item asks the child to notice; a two-bar picture of
 *     `discTwoStepMiddle`'s barrow would let the answer be counted off the page
 *     instead of planned. Both pages are bare on purpose. (This is also why the
 *     figure-per-working-day requirement is met from the chains and the warm-ups
 *     rather than by hanging a picture on the assessed choice.)
 *   - NO SPARE-NUMBER PICTURE. `msQueueSpare` and `predictStallCost` each state a
 *     quantity the question does not want. Drawing it would either flag it as
 *     important or flag it as decoration, and both answer the question for the
 *     child.
 *   - NO FINISHED PARTITION ON AN ASSESSED PAGE. A bar cut into its two parts
 *     with both labelled IS the answer to five items here. It therefore appears
 *     only in `explanation.script[0]` and `guidedExamples[0]`, where the answer
 *     is already spoken and watching the cut IS the teaching.
 *
 * CONCEPT FAMILY: `'operation'`, the full row (≥2 genuine multi-step week-wide at
 * band B). Declaring `'place-value'` would have been a dodge twice over — the row
 * says the multi-step here is "native", and it is: three chains, five core slots,
 * every one of them two moves a child performs in order, with `stepCount` read
 * off the chain rather than claimed.
 *
 * THE METACOGNITION PROBE, AND ITS SPLIT (kit §E2.9 / L41 — no gate can see
 * this, because a probe has no answer key). `predictStallCost` asks the child to
 * commit before working: "will the two pots pass fifty cents?" — seven words,
 * because `metacog.ts` prepends its own lead-in and an eighth word puts the
 * combined sentence over the Level-B ceiling. The SIDE is drawn first and the two
 * prices are then drawn on that side, so the call is a coin flip BY
 * CONSTRUCTION: measured over 800 exposures the two pots pass fifty cents 392
 * times and fall short 408 times, and land on exactly fifty never — the two price
 * ranges cannot reach it, so the unanswerable draw does not exist rather than
 * being filtered out. That is the fix b16's 70/30 probe needed. The carrier is
 * reachable ONLY through the wrapper (kit §E2.2), so the pack never ships two
 * identical hint ladders for one idea.
 *
 * MONEY RENDERING, DISCLOSED. Nothing on the money page is ever a fraction of a
 * dollar: the two prices are whole cents when they are drawn, whole cents when
 * they are added, and whole cents in the answer, and the only function that turns
 * any of them into text is `centsLabel` — which `lib/money.ts` owns as the B-band
 * cents renderer and which hands every dollar-shaped amount straight back to
 * `format.ts`. There is no float anywhere for "$0.5" to come out of.
 * Both price ranges are capped under fifty cents, so this week never crosses a
 * dollar and only the `¢` arm is exercised — B16 is where the dollar arm lives.
 *
 * Level-B band settings honoured (FILL-ARCHITECTURE §1): every child-facing
 * sentence ≤15 words, counted rather than estimated (two short sentences beat one
 * long one at six); `a job`, `altogether`, `the rest` and `a spare number`
 * glossed in `explanation.vocabulary` before any item leans on them;
 * metacognition in the B row's intro form (a "will it pass…?" call);
 * error-analysis written-lite, one sentence; the sprint ungraded and
 * self-referenced. No gendered pronoun appears in any prompt, because every name
 * is drawn.
 *
 * FRAMES, re-checked against the weeks directory at the END of the build (kit
 * §E2.8) with plain substring greps rather than word boundaries. Fifteen scenes,
 * one per generator, no two generators sharing a place:
 *   - c24 is the dangerous neighbour, because it is the same recipe cell one
 *     level up. Its scenes are sports-day cool boxes, swimming badges, a club
 *     fund, flower bulbs, a display board, paper cranes, camp labels, a raffle
 *     book, a gallery wall, class crayons, fair paper cups and craft-club wax;
 *     its cue word is "each" and its operations are × and ÷. Not one of those
 *     appears here.
 *   - what is kept returns ZERO hits across all sixty-three authored weeks:
 *     tadpoles, pond skaters, a pond dip, nest boxes, a village wood, a swap
 *     shelf, comics, a sun hat basket, a plant stall, a tuck shop, a minibus, a
 *     cake stall, book bags, cress trays, fir cones, a bug hotel, a wheelbarrow,
 *     story corner and paper aeroplanes. Three near-misses were re-dressed rather
 *     than shipped: "bean seedlings" (b19/b20/c06/c11 all grow seedlings) became
 *     fir cones in boxes of ten, "pond creatures" (b18 counts creatures in a
 *     hint) became "small animals", and "newts" became "pond skaters" — the
 *     second of those for realism as well as freshness, see `sitTrayRest`.
 *     ("snail" was considered for the same slot and dropped: b14 and b18 both own
 *     a snail as a character.) Plurals were checked through `format.ts` as well
 *     as against the corpus, and every unit noun in the pack was run through
 *     `countNoun` at 1 and at 7: "more children" was dropped because `unitFor`
 *     pluralises it to "more childrens", which is how a formatter catches an
 *     author.
 *   - the two "groups of ten" scenes are deliberate and not a collision: the B2
 *     warm-up counts cress trays of ten shoots and `msFirConesThenHome` opens on
 *     boxes of ten fir cones, so the warm-up warms exactly the move the chain
 *     starts with. Different objects, different days, one purpose.
 *
 * THE END-OF-BUILD PASS, and what each part of it actually caught — recorded
 * because the next author's cheapest win is knowing which sweeps pay:
 *   - THE PROSE SWEEP found nothing, which is worth reporting rather than
 *     omitting: every child-facing sentence was counted while it was written (two
 *     short sentences instead of one comma-joined one, every time), and the sweep
 *     confirmed 0.00% of 9,585 sentences over the ceiling at 30 seeds. (One
 *     19-word script line did appear after the clock rewrite below and was split
 *     in two; that is the only offender the sweep ever reported.) The alt-text
 *     advisory is clean too — the longest accessible name in the pack is a
 *     labelled clock face at 27 words, under the 30-word advisory, and it earns
 *     every word: a screen-reader child has it instead of the picture (L40).
 *   - THE ANSWER-ENTROPY SWEEP found nothing at 80 seeds, with or without --all.
 *     That is because the rotation was designed in rather than discovered: see the
 *     guessability section above for the four numbers that prove it.
 *   - THE CORPUS SCAN (token overlap of every string here against all 6,446
 *     authored strings in the weeks directory, computed rather than eyeballed)
 *     earned its keep sixteen times over, and it is the single most valuable
 *     sweep this week ran. c24 is the same recipe cell one level up, so the pull
 *     is structural and unconscious: the parent summary's opening, its
 *     `strengtheningByTag` lines, its `schoolSyncHook`, its `questionForChild`
 *     shape and FOUR mistake-bank descriptions had all drifted into c24's
 *     phrasing (one at 0.94, one at 0.90, one verbatim at 1.00), two rationales
 *     had come out as b23's finger-counting formula, the puzzle's second rung was
 *     c05's "walk the story backwards", and one reteachPointer was b20's. All
 *     sixteen rewritten. What is left above 0.45 is the Always/Sometimes/Never
 *     STEM, which five weeks share because it is a question format and not a
 *     voice, and the decorator comment block, which documents a shared idiom.
 *   - READING IT found four things no gate did, and every one of them was content
 *     rather than mathematics:
 *       · a nine-metre-sandpit. `sitTrayRest` read "the dipping tray holds 83
 *         pond animals altogether, 22 of them newts" — no tray holds eighty-three
 *         animals and no pond yields twenty-two newts. It is now a whole-class
 *         POND DIP counting small animals, of which the named part is pond
 *         skaters. Same mathematics, honest world.
 *       · TWO UNRELATED FIFTEENS. The money page drew its spare from the same
 *         range as its prices, so a bean pot cost 15¢ two sentences from "15 pots
 *         are still on the table". The spare is now a stretch of TIME, which
 *         cannot be mistaken for a price on any draw.
 *       · A CLOCK THAT DID NOT SAY WHICH TIME IT WAS. Both clock items state two
 *         times in prose, and `clockAlt` deliberately names only where the hands
 *         point — so a generated page showed "leaves school at 8 o'clock" beside a
 *         face reading half past 8, with nothing to say which moment was drawn.
 *         `labelledClockAlt` now names the moment and still never names the
 *         reading.
 *       · A CHAIN THAT CANCELLED ITSELF. A mastery draw of `msQueueSpare` had
 *         twenty children join and twenty leave, so the queue ended where it
 *         started and both moves could be skipped for a free mark. One
 *         deterministic nudge, no redraw.
 *   - MEASURING THE PROBE, because no gate can (L41). See the split above.
 *
 * Retrieval is backward-only and every warm-up is load-bearing rather than
 * decorative: B2 (tens and ones — the first move of a chain here), B13 (addition
 * within 100 — the join two of these items resolve to), B14 (subtraction within
 * 100 — the split the other two resolve to) and B17 (elapsed time inside one
 * hour — the first move of the time chain).
 */

// Insurance, not superstition: `registry.ts` spreads each family's defs array
// and the families import `erroranalysis.ts`, which reads the registry. Touching
// the registry first means every family has finished evaluating before anything
// asks it for a template. (b17 opens the same way; both halves of the cycle are
// lazy now, so this is a signpost as much as a guard.)
import '../registry';

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { spokenTime } from '../lib/clock';
import { centsLabel } from '../lib/money';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsParam, barModel, clock as clockFigure, clockAlt } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const B2 = { level: 'B' as const, week: 2 };
const B13 = { level: 'B' as const, week: 13 };
const B14 = { level: 'B' as const, week: 14 };
const B17 = { level: 'B' as const, week: 17 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/**
 * The quarter marks this week is allowed to speak, as ordered pairs.
 *
 * B17 reads the quarters, so a time on these pages is an o'clock, a quarter
 * past, a half past or a quarter to — never a single minute, which belongs to
 * C18. Each pair is a start and a finish inside ONE hour, and the three possible
 * gaps (fifteen, thirty and forty-five minutes) all appear, so an elapsed answer
 * is never a constant a child could memorise.
 */
const QUARTER_PAIRS: ReadonlyArray<readonly [number, number]> = [
  [0, 15], [0, 30], [0, 45], [15, 30], [15, 45], [30, 45],
];

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

/**
 * A clock's accessible name with a LABEL on the front.
 *
 * `clockAlt` describes where the hands point and deliberately never says what
 * time that makes (L33 applied to a screen reader). That is right on B12/B17,
 * where reading the face IS the question. It is not enough here: both of this
 * week's items state TWO times in prose, so an unlabelled face leaves a teacher —
 * and a child — guessing which of the two the picture is. Found by reading a
 * generated page, where "leaves school at 8 o'clock" sat beside a face showing
 * half past 8. The label names the MOMENT, never the reading, so the hands are
 * still the only place the time itself lives.
 */
const labelledClockAlt = (label: string, h: number, m: number): string =>
  clockAlt(h, m).replace(/^a clock face /, `${label}, `);

// ---------------------------------------------------------------------------
// Three decorators, and what each of them is for.
//
// `lib/` is not ours to edit and none of the shipped primitives exposes a figure
// slot or lets a caller pin a truth onto a choice item, so each of these wraps a
// generator from the outside. The rule they all obey is the one
// `withEstimateFirst` set: touch nothing until the inner draw has finished, take
// no rng draw of your own, and leave the prompt alone — so the surface signature
// the guard has already recorded for QG-1/QG-4 cannot move underneath it.
//
// `withFigure` is the cheap case: an item that carries a `generator` carries the
// numbers its answer came from, so a figure rebuilt from those numbers cannot
// disagree with the answer — it is not that a lying picture is unlikely, it is
// that there is nothing to build one out of.
//
// The other two exist because two primitives withhold what a decorator needs.
// `discrimination()` ships no generator spec at all, so `withPin` writes one,
// which is the whole mechanism that brings a keyed option under QG-11.
// `multiStep()` ships exactly {initN, initD, steps} and nothing else, so the
// minibus clock — which needs an HOUR that no step carries — has to be handed
// its draw through a one-slot box. Both boxes are written by the draw closure and
// read on the next line; `drawUniqueItem` hands back whatever its LAST build call
// produced, so the box and the returned draft are always the same draw.
// (The box idiom is c06's, by way of b15/b19/b21/b22/b23.)
// ---------------------------------------------------------------------------

function withFigure(base: ItemGen, build: (params: Params) => BBFigure): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    return d.generator ? { ...d, figure: build(d.generator.params) } : d;
  };
}

interface Pin {
  params: Params;
  seed: number;
}

function pinSlot(): { last: Pin | null } {
  return { last: null };
}

/** Give a choice item the generator spec that lets QG-11 recompute its claim. */
function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = box.last;
    if (!pin) throw new Error('b24/withPin: the draw posted nothing to build from');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

/** What a drawn trip needs that its chain params do not carry. */
interface Ride {
  h: number;
  arrive: number;
}

function rideSlot(): { last: Ride | null } {
  return { last: null };
}

function withRideFigure(
  box: { last: Ride | null },
  base: ItemGen,
  build: (ride: Ride) => BBFigure,
): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const ride = box.last;
    if (!ride) throw new Error('b24/withRideFigure: the draw posted no trip to draw');
    return { ...d, figure: build(ride) };
  };
}

// ---------------------------------------------------------------------------
// Retrieval warm-ups (strictly earlier weeks; exempt from the pedagogy gates)
//
// Four formats spanning the level, and each one is the settled skill some page
// of this week then has to CHOOSE to use. A warm-up should read as the earlier
// week's own page, so the child arrives at the choosing with the arithmetic
// already quiet.
// ---------------------------------------------------------------------------

/**
 * B2 — tens and ones, which is the first move of `msFirConesThenHome`. Trays of
 * ten and a few singles: the bundle structure stated in prose, not drawn, because
 * a picture of the trays and the singles together IS this warm-up's answer.
 */
const wTensAndOnes = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'tens-and-ones',
    draw: (r) => {
      const trays = r.int(4, 9);
      const loose = r.int(2, 9);
      return {
        prompt: `The nursery has ${countNoun(trays, 'trays')} of cress. Each tray holds ten shoots. ${countNoun(loose, 'shoots')} sit in single pots. How many cress shoots is that?`,
        answerValue: String(10 * trays + loose),
        templateId: 'retr_tens_ones_v1',
        params: { t: trays, o: loose },
        units: 'shoots',
        hints: [
          'How many shoots does one whole tray hold?',
          'Count the trays in tens first. Then count the single shoots on.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  B2,
);

/** B13 — addition within 100, the join two of this week's stories resolve to. */
const wAddWithin100 = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'add-within-100',
    draw: (r) => {
      const low = r.int(26, 48);
      const high = r.int(19, 41);
      return {
        prompt: `The cloakroom holds ${countNoun(low, 'book bags')} on the low shelf. ${countNoun(high, 'book bags')} sit on the high shelf. How many book bags is that in all?`,
        answerValue: String(low + high),
        templateId: 'retr_add_within_100_v1',
        params: { a: low, b: high },
        units: 'book bags',
        hints: [
          'Do both shelves belong in this answer?',
          'Keep one shelf count in mind. Then count the other shelf onto it.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B13,
);

/** B14 — subtraction within 100, the split the other two stories resolve to. */
const wSubWithin100 = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'sub-within-100',
    draw: (r) => {
      const start = r.int(58, 92);
      const sold = r.int(23, 45);
      return {
        prompt: `The cake stall started with ${countNoun(start, 'buns')}. ${countNoun(sold, 'buns')} have been sold. How many buns are still on the stall?`,
        answerValue: String(start - sold),
        templateId: 'retr_sub_within_100_v1',
        params: { a: start, b: sold },
        units: 'buns',
        hints: [
          'Is the stall getting fuller here, or emptier?',
          'Begin at the count the stall opened with. Then count the sold buns back off it.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  B14,
);

/**
 * B17 — elapsed time inside one hour, the first move of `msRideThenWalk`.
 *
 * The face is drawn at the START and asserts `param:m` (`of:'minutes-past'`), so
 * the picture claims a minute the prose has already stated. The answer is how
 * many minutes go by, and no clock here shows that.
 */
const wElapsedQuarter = asWarmup(
  withFigure(
    situation({
      situationType: 'measurement',
      cognitiveOp: 'elapsed-within-hour',
      draw: (r) => {
        const hour = r.int(1, 11);
        const [start, finish] = r.pick(QUARTER_PAIRS);
        return {
          prompt: `[image: ${labelledClockAlt('the clock as story corner begins', hour, start)}] Story corner starts at ${spokenTime(hour, start)}. It finishes at ${spokenTime(hour, finish)}. How many minutes long is story corner?`,
          answerValue: String(finish - start),
          templateId: 'clock_elapsed_v1',
          params: { h: hour, m: start, m2: finish },
          units: 'minutes',
          hints: [
            'Which hand shows the minutes going by?',
            'Find where the long hand begins. Then count the minutes it travels.',
          ],
          errorTags: ['representation-misread', 'procedure-slip'],
        };
      },
    }),
    (p) =>
      clockFigure(
        { h: numOf(p, 'h'), m: numOf(p, 'm') },
        {
          marks: 'five',
          alt: labelledClockAlt('the clock as story corner begins', numOf(p, 'h'), numOf(p, 'm')),
          asserts: assertsParam('m', 'minutes-past'),
        },
      ),
  ),
  B17,
);

// ---------------------------------------------------------------------------
// Single-step core — three structures, three unreliable cue words, no labels
//
// These are the menu the week refuses to label. All three are part-whole or
// change stories on two-digit numbers, which every child arriving here can
// compute; what none of them says is WHICH way round the computing goes.
// ---------------------------------------------------------------------------

/**
 * "LEFT" WANTS AN ADDITION.
 *
 * Both stated counts are parts — the hats that went and the hats still here —
 * and the question asks for the whole. A child holding "left means take away"
 * takes one part from the other and gets a number smaller than either.
 */
const sitHatsStart = situation({
  situationType: 'part-whole',
  cognitiveOp: 'choose-move-join',
  draw: (r) => {
    const gone = r.int(18, 38);
    const here = r.int(14, 32);
    return {
      prompt: `The sun hat basket started the week with every hat in it. ${countNoun(gone, 'hats')} have gone home since then. ${countNoun(here, 'hats')} are left in the basket. How many hats were in the basket at the start?`,
      answerValue: String(gone + here),
      templateId: 'd_add_v1',
      params: { a: gone, b: here },
      units: 'hats',
      hints: [
        'Which hats does this question count — some of them, or all of them?',
        'Put the hats that went beside the hats still here.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * "ALTOGETHER" WANTS A SUBTRACTION.
 *
 * The whole count is stated, one part of it is stated, and the other part is
 * what the question wants. A child holding "altogether means add" joins the
 * whole to one of its own parts, and ends up with more animals than the pond dip
 * found.
 *
 * The frame is A WHOLE-CLASS POND DIP, not one tray, and that was a reading fix
 * rather than a preference. The first draft had "the dipping tray holds 83 pond
 * animals altogether, 22 of them newts", which is two impossibilities in one
 * sentence: no dipping tray holds eighty-three animals, and no pond gives up
 * twenty-two newts in a morning. A session tally across a whole class holds
 * fifty to ninety honestly, and pond skaters and tadpoles really do arrive in
 * those numbers.
 */
const sitTrayRest = situation({
  situationType: 'part-whole',
  cognitiveOp: 'choose-move-split',
  draw: (r) => {
    const whole = r.int(54, 86);
    const skaters = r.int(17, 35);
    return {
      prompt: `The pond dip counted ${countNoun(whole, 'small animals')} altogether. ${countNoun(skaters, 'pond skaters')} were among them. The rest were tadpoles. How many tadpoles did the pond dip count?`,
      answerValue: String(whole - skaters),
      templateId: 'd_sub_v1',
      params: { a: whole, b: skaters },
      units: 'tadpoles',
      hints: [
        'Is the whole pond-dip count wanted here, or one part of it?',
        'Begin from the whole count. Then take the pond skaters out of it.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * "ADDED" WANTS A SUBTRACTION.
 *
 * The third structure, and the one no other B week poses this way: two counts of
 * the SAME collection at two different times, with the change unknown. The word
 * in the question is "added", and the move that finds it is a take-away.
 */
const sitTreeAdded = situation({
  situationType: 'rate-of-change',
  cognitiveOp: 'choose-move-change',
  draw: (r) => {
    const spring = r.int(14, 30);
    const autumn = spring + r.int(19, 38);
    return {
      prompt: `The village wood had ${countNoun(spring, 'nest boxes')} in the spring. By the autumn it had ${countNoun(autumn, 'nest boxes')}. How many nest boxes were added over the summer?`,
      answerValue: String(autumn - spring),
      templateId: 'd_sub_v1',
      params: { a: autumn, b: spring },
      units: 'nest boxes',
      hints: [
        'Which two counts does this question hold against each other?',
        'Line the spring count up under the autumn count.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// Metacognition — the Level-B intro form, a call made before any working
//
// The B row's own "will it pass…?" prediction, pointed at this week's own money
// page. The SIDE is drawn first and the two prices are then drawn on that side,
// so the call is a coin flip BY CONSTRUCTION rather than by luck — the fix L41
// records after b16 shipped a probe a child could be right about 70% of the time
// by always saying "more". No gate can catch that: a probe has no answer key.
//
// Seven words is the budget, and it is arithmetic rather than taste: the wrapper
// supplies a lead-in sentence of its own, and an eighth word in the probe pushes
// the sentence it opens past the fifteen the band allows (kit §E2.9).
//
// Nothing reaches this generator except through the wrapper (kit §E2.2). Serving
// it both ways would put the same hint ladder in the pack twice for one idea, and
// the dedup only allows three.
//
// The stall also states a count the question never wants. A page where the size
// call and the spare number arrive together is the honest shape of a real
// question, and it is the last place in the level a child meets either.
// ---------------------------------------------------------------------------

const sitStallCost = situation({
  situationType: 'money-change',
  cognitiveOp: 'choose-move-price',
  draw: (r) => {
    // The SIDE first, then the prices on it. A total of exactly fifty would make
    // the probe unanswerable — the child would be right whatever they said (kit
    // §E2.7) — so neither branch can reach it: the over branch starts at 52 and
    // the under branch stops at 42. Both consume the same two draws, so the
    // stream lands in the same place whichever way it falls.
    const overFifty = r.int(0, 1) === 0;
    const bean = overFifty ? r.int(22, 45) : r.int(8, 22);
    const mint = overFifty ? r.int(30, 48) : r.int(6, 20);
    // The spare is a stretch of TIME, not a count of pots, and that is a reading
    // fix. The first draft said "15 pots are still on the table" on a page whose
    // bean pot cost 15¢, so two unrelated fifteens sat two sentences apart. Hours
    // cannot be confused with a price at a glance whatever the draw does, and a
    // spare borrowed from another chapter of the level is the right shape for an
    // exit check anyway.
    const hoursOpen = r.int(2, 4);
    const total = bean + mint;
    return {
      prompt: `The plant stall sells a bean pot for ${centsLabel(bean)}. A mint pot costs ${centsLabel(mint)}. The stall has been open for ${countNoun(hoursOpen, 'hours')}. What is the cost of one bean pot and one mint pot?`,
      answerValue: String(total),
      templateId: 'd_add_v1',
      params: { a: bean, b: mint },
      units: 'cents',
      // Enumerated rather than left to `valueForms`: a cents answer is not a
      // dollars answer, and the money arm of `valueForms` would render 65 as
      // "$65.00". `centsLabel` is the family's own authority for the `¢` form.
      acceptableForms: [centsLabel(total), countNoun(total, 'cents')],
      hints: [
        'Which of these three numbers does the question ask about?',
        'Take the price of one pot. Then bring the other price in.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

const predictStallCost = withEstimateFirst(sitStallCost, 'will the two pots pass fifty cents?');

// ---------------------------------------------------------------------------
// Discriminations — the §4 row's "+/−/story-type choice", twice, one per axis
//
// WHICH NUMBER THE QUESTION POINTS AT (Day 2). Three numbers are offered and
// none of them can be settled by arithmetic alone, because all three are honest
// outputs of honest moves over the same two stated counts. What the story ASKS
// FOR rotates on a coin flip — the whole shelf on half the draws, one part of it
// on the other half — so a child holding "join them" or "split them" is wrong on
// half the page by construction, and the keyed value is the middle of the three
// on some draws and the smallest on others. `d_verify_binop_v1` recomputes the
// keyed value from the item's own operands.
//
// WHICH NUMBER IS THE ANSWER AND WHICH IS ONLY HALFWAY (Day 3). The classic
// two-step failure, and the one a consolidation week owes a page: the child does
// both jobs correctly and then reports the number from between them. The chain
// runs up-then-down on half the draws and down-then-up on the other half, which
// moves the middle number from above the answer to below it, so neither "pick the
// biggest" nor "pick the smallest" survives. `d_verify_ratchain_v1` recomputes
// the keyed value by folding the item's own chain.
//
// Neither page carries a picture. See the header: a structure drawing announces
// the structure, which is the one thing this week withholds.
// ---------------------------------------------------------------------------

const whichNumberBox = pinSlot();

const discWhichNumber = withPin(
  whichNumberBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'choose-the-number',
    draw: (r) => {
      // football > space always, so every option stays a whole count a Level-B
      // child can read, and the "gap between the piles" distractor is positive
      // without a nudge or a redraw (kit §E2.4).
      const football = r.int(24, 44);
      const space = r.int(8, 21);
      const shelf = football + space;
      const asksWhole = r.chance(0.5);
      whichNumberBox.last = {
        params: asksWhole
          ? { a: football, b: space, op: '+' }
          : { a: shelf, b: football, op: '-' },
        seed: r.uint(),
      };
      if (asksWhole) {
        return {
          prompt: `The swap shelf holds ${countNoun(football, 'football comics')} and ${countNoun(space, 'space comics')}. Which number tells how many comics are on the shelf?`,
          correct: String(shelf),
          distractors: [
            {
              text: String(shelf + space),
              errorTag: 'concept-misconception' as const,
              rationale: 'Counts the smaller pile a second time, so one lot of comics is paid for twice.',
            },
            {
              text: String(football - space),
              errorTag: 'task-comprehension' as const,
              rationale: 'Takes one pile from the other, which measures the gap between them and not the shelf.',
            },
          ],
          hints: [
            'Does this question want the whole shelf, or one part of it?',
            'Say the whole and the two parts out loud. Then pick the one that is missing.',
          ],
          errorTags: ['concept-misconception', 'task-comprehension'],
        };
      }
      return {
        prompt: `The swap shelf holds ${countNoun(shelf, 'comics')} altogether. ${countNoun(football, 'football comics')} sit among them. Which number tells how many comics are not football comics?`,
        correct: String(space),
        distractors: [
          {
            text: String(shelf + football),
            errorTag: 'concept-misconception' as const,
            rationale: 'Joins the two stated counts, so the answer comes out larger than the whole shelf.',
          },
          {
            text: String(football),
            errorTag: 'task-comprehension' as const,
            rationale: 'Hands back the pile the sentence has just named, which is not the pile the question asks for.',
          },
        ],
        hints: [
          'Does this question want the whole shelf, or one part of it?',
          'Say the whole and the two parts out loud. Then pick the one that is missing.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
);

const middleNumberBox = pinSlot();

const discTwoStepMiddle = withPin(
  middleNumberBox,
  'd_verify_ratchain_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'choose-the-final-number',
    draw: (r) => {
      const held = r.int(42, 68);
      const moved = r.int(12, 28);
      const later = r.int(7, 18);
      const joinFirst = r.chance(0.5);
      const steps = joinFirst
        ? [{ op: 'add' as const, n: moved, d: 1 }, { op: 'sub' as const, n: later, d: 1 }]
        : [{ op: 'sub' as const, n: moved, d: 1 }, { op: 'add' as const, n: later, d: 1 }];
      const finish = joinFirst ? held + moved - later : held - moved + later;
      const halfway = joinFirst ? held + moved : held - moved;
      const bothJoined = held + moved + later;
      middleNumberBox.last = {
        params: { initN: held, initD: 1, steps },
        seed: r.uint(),
      };
      const opening = `The wheelbarrow held ${countNoun(held, 'bricks')} for the bug hotel.`;
      const tippedIn = (n: number) => `${countNoun(n, 'more bricks')} were tipped in.`;
      const builtIn = (n: number) => `${countNoun(n, 'bricks')} were built into the wall.`;
      const story = joinFirst
        ? `${opening} ${tippedIn(moved)} Then ${builtIn(later)}`
        : `${opening} ${builtIn(moved)} Then ${tippedIn(later)}`;
      return {
        prompt: `${story} Which number tells how many bricks are in the wheelbarrow now?`,
        correct: String(finish),
        distractors: [
          {
            text: String(halfway),
            errorTag: 'task-comprehension' as const,
            rationale: 'Stops after the first job and reports the count from halfway through the story.',
          },
          {
            text: String(bothJoined),
            errorTag: 'concept-misconception' as const,
            rationale: 'Treats both jobs as joins, so nothing is ever taken out of the barrow at all.',
          },
        ],
        hints: [
          'How many jobs does this story ask for?',
          'Do the first job and hold its count. Then do the second job to it.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// Multi-step — "native" (FILL-ARCHITECTURE §4), and every chain crosses two
// chapters of the level rather than repeating one.
//
//   THE RIDE AND THE WALK   time (B17) → addition (B13). The first move is a
//   measurement nobody states: how long the minibus was moving. The second joins
//   a stated walk to it, so the second move works on the result of the first.
//
//   THE BOXES AND THE COLLAGE   tens-and-ones (B2) → subtraction (B14). The
//   first move turns "6 boxes of ten and 4 loose" into a number; only then is
//   there anything for the collage to be taken out of.
//
//   THE QUEUE   a join and a split around a SPARE number (B9 → B13/B14). Two
//   moves in the order the sentences give them, and one stated count the question
//   never wants, so `posing: 'has-distractor'`.
//
// A child who has met only one of these has learnt a sequence; a child who has
// met all three has learnt to plan.
// ---------------------------------------------------------------------------

const rideBox = rideSlot();

const msRideThenWalk = withRideFigure(
  rideBox,
  multiStep({
    situationType: 'measurement',
    cognitiveOp: 'time-then-walk',
    usesPriorSkill: true,
    draw: (r) => {
      const hour = r.int(1, 11);
      const [leave, arrive] = r.pick(QUARTER_PAIRS);
      const walk = r.int(6, 18);
      rideBox.last = { h: hour, arrive };
      return {
        prompt: `[image: ${labelledClockAlt('the clock as the minibus reaches the pond', hour, arrive)}] The minibus leaves school at ${spokenTime(hour, leave)}. It reaches the pond at ${spokenTime(hour, arrive)}. The class then walks for ${countNoun(walk, 'minutes')} to the dipping platform. How long is that from school to the platform?`,
        initN: arrive,
        steps: [
          { op: 'sub', n: leave, d: 1 },
          { op: 'add', n: walk, d: 1 },
        ],
        units: 'minutes',
        hints: [
          'Which two parts of this trip have to end up joined?',
          'Measure the ride on the clock first. Then bring the walk in.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  // The face shows the ARRIVAL, which is the minute the chain starts from, so it
  // asserts `param:initN` — the strongest claim available when a factory owns the
  // params. The answer is minutes elapsed, which no clock in this pack draws.
  (ride) =>
    clockFigure(
      { h: ride.h, m: ride.arrive },
      {
        marks: 'five',
        alt: labelledClockAlt('the clock as the minibus reaches the pond', ride.h, ride.arrive),
        asserts: assertsParam('initN', 'minutes-past'),
      },
    ),
);

const msFirConesThenHome = withFigure(
  multiStep({
    situationType: 'part-whole',
    cognitiveOp: 'tens-then-take',
    usesPriorSkill: true,
    draw: (r) => {
      // Ranges, not a nudge: the smallest possible table (4 boxes and 2 loose) is
      // 42 and the largest collage is 34, so the answer is always a positive
      // whole count and nothing is ever redrawn (kit §E2.4).
      const boxes = r.int(4, 8);
      const loose = r.int(2, 9);
      const collage = r.int(12, 34);
      return {
        prompt: `[image: one bar of ${countNoun(boxes, 'boxes')} of ten fir cones, with the loose cones not drawn] The nature table has ${countNoun(boxes, 'boxes')} of fir cones. Each box holds ten cones. ${countNoun(loose, 'loose cones')} sit beside the boxes. ${countNoun(collage, 'cones')} go home for a collage. How many fir cones are left on the table?`,
        initN: 10 * boxes,
        steps: [
          { op: 'add', n: loose, d: 1 },
          { op: 'sub', n: collage, d: 1 },
        ],
        units: 'fir cones',
        hints: [
          'How many cones does one whole box hold?',
          'Build the whole table count first. Then take the collage cones away.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip'],
      };
    },
  }),
  // t segments of ten, to one shared scale, rebuilt from `initN` — so the picture
  // shows the boxes and NOT the loose cones, and both moves stay the child's.
  (p) => {
    const tens = numOf(p, 'initN') / 10;
    return barModel(
      [
        {
          label: 'the boxes of ten',
          segments: Array.from({ length: tens }, () => ({ value: 10 })),
        },
      ],
      {
        scaleMax: numOf(p, 'initN'),
        alt: `one bar of ${countNoun(tens, 'boxes')} of ten fir cones, with the loose cones not drawn`,
        asserts: assertsParam('initN'),
      },
    );
  },
);

const msQueueSpare = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'queue-change',
  usesPriorSkill: true,
  posing: 'has-distractor',
  draw: (r) => {
    const helpers = r.int(3, 6);
    const waiting = r.int(28, 46);
    const joining = r.int(12, 24);
    // The two moves must not cancel. A draw where the same number joins and
    // leaves ends the queue exactly where it started, which reads to a child as
    // "nothing happened" and lets the whole chain be skipped — and on a mastery
    // form that is a free mark. Nudged DETERMINISTICALLY by one, never redrawn: a
    // redraw loop would consume a variable number of draws and shift every later
    // item in the pack (kit §E2.4 / L19).
    const drawnLeaving = r.int(8, 20);
    const leaving = drawnLeaving === joining ? drawnLeaving - 1 : drawnLeaving;
    return {
      prompt: `${countNoun(helpers, 'helpers')} stand behind the tuck shop counter. ${countNoun(waiting, 'children')} are waiting in the queue. ${countNoun(joining, 'children')} come and join the queue. Then ${countNoun(leaving, 'children')} go back to the field. How many children are waiting now?`,
      initN: waiting,
      steps: [
        { op: 'add', n: joining, d: 1 },
        { op: 'sub', n: leaving, d: 1 },
      ],
      units: 'children',
      hints: [
        'Which of these counts does the question actually use?',
        'Read the last sentence again. Then use only the counts it needs.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day-5 error-analysis (generated; QG-11 re-derives both numbers)
//
// The recipe cell is "(mixed)", and the mix is the MOVE. The library already had
// the transform: `d_verify_binop_misconception_v1` with {op:'-', wrongOp:'+'}
// returns the true part AND the genuine output of joining the whole to one of its
// own parts, both computed from the same two operands.
//
// What makes this the week's own item rather than an arithmetic item: THE
// STUDENT'S ADDITION IS CORRECT. There is nothing wrong in the digits, so
// re-checking them cannot rescue anybody. The only way in is to ask what a
// number that size could be a count of — which is the size check the whole week
// has been building.
//
// The prompt shows the work and the claim and then stops. Naming what went wrong
// would BE the answer, so the extension asks for the true count and for one way
// to check a size, and leaves the diagnosis to the child.
// ---------------------------------------------------------------------------

const eaMoveChosen = withFigure(
  errorAnalysis({
    verifyTemplateId: 'd_verify_binop_misconception_v1',
    cognitiveOp: 'error-analysis',
    drawParams: (r) => {
      const crate = r.int(54, 86);
      const green = r.int(18, 34);
      return { a: crate, b: green, op: '-', wrongOp: '+' };
    },
    build: (v, p, r) => {
      const crate = Number(p.a);
      const green = Number(p.b);
      const name = one(r);
      return {
        prompt: `The sports-day crate holds ${countNoun(crate, 'water bottles')} altogether. ${countNoun(green, 'green bottles')} are in the crate. ${name} was asked how many bottles are not green. ${name} wrote ${crate} + ${green} = ${v.wrong}.`,
        extension: `Write how many bottles really are not green. Then tell ${name} one way to check the size of an answer.`,
        hints: [
          'Can one part of the crate hold more bottles than the whole crate?',
          'Begin from the whole crate. Then take the green bottles out of it.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
        answerKeywords: [
          'a part is always smaller than the whole',
          'the bottles were split, not joined',
          'take the green bottles away from the crate',
        ],
      };
    },
  }),
  // One undivided bar for the whole crate, asserting a GIVEN. It makes the size
  // argument visible without making the number visible: a part of that bar
  // cannot be longer than the bar.
  (p) =>
    barModel(
      [
        {
          label: 'the whole crate',
          segments: [{ value: numOf(p, 'a'), label: String(numOf(p, 'a')) }],
        },
      ],
      {
        scaleMax: numOf(p, 'a'),
        alt: `one bar for all ${countNoun(numOf(p, 'a'), 'water bottles')} in the crate, with the green ones not marked off`,
        asserts: assertsParam('a'),
      },
    ),
);

// ---------------------------------------------------------------------------
// Day-5 production — the §4 signature: "exit check + reflection (oral R)", and
// the catalog's own non-computational focus for this cell (vocabulary work plus
// a logic mini-puzzle).
//
// Authored rather than generated, because what is being produced is a QUESTION
// and a spoken reason: there is no operand to draw, and the reflection is the
// flagged part FILL-ARCHITECTURE §7 lists for the level-exit cells. It ships as
// `short-text-keyword` so the naming half is checkable while a person reads the
// child's own question.
//
// The three words handed over are the three this week has been undermining, and
// none of them settles anything on its own. That is the reflection: the child has
// to say what DID settle it.
// ---------------------------------------------------------------------------

const reasoningWordBank = reasoning({
  prompt:
    'Here are three words from this year: altogether, left, added. Write one short story question of your own. Use one of those three words in it. Then say out loud which job your question needs, and how you knew.',
  value:
    'a story question built on one of the three words, plus a spoken reason that names the job and says the word alone did not settle it',
  acceptableForms: [
    'adding',
    'taking away',
    'the word does not decide',
    'the question decides',
  ],
  keywords: true,
  hints: [
    'Which of the three words could point either way?',
    'Write your question first. Then read it back and name the job.',
  ],
  errorTags: ['task-comprehension', 'concept-misconception'],
});

/**
 * The claim the week's whole method rests on, given a hearing.
 *
 * "Sometimes" is the honest answer and both distractors are real children's
 * positions rather than padding. A story that puts two amounts together and asks
 * for the whole really does want an adding job, and it will very often say
 * "altogether". A story that states the whole with that same word and asks for a
 * part does not. 'always' is the child who lets a word choose; 'never' is the
 * overcorrection that throws away the joining stories.
 */
const asnCueWord = classify({
  prompt:
    'Always, sometimes or never true? A story with the word altogether needs an adding job. Write one sentence saying how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Lets one word choose the job, but that word also sits in stories where a part has to be taken out.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Throws away the joining stories, where two amounts really are going together and the word marks it.',
    },
  ],
  hints: [
    'Can you think of a story with that word that takes away?',
    'Write one story where the word joins. Then write one where it splits.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB24 = makeWeekBuilder({
  level: 'B',
  week: 24,
  conceptId: 'ready-for-level-c',
  conceptName: 'Ready for Level C (consolidation)',
  strandTags: ['number-sense-counting', 'addition-subtraction'],
  prerequisiteWeeks: [B2, B14, B17],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the job before the numbers',
  conceptFamily: 'operation',
  deepeningDelta:
    'Every week of Level B so far handed the child the move by naming itself: B13 was the adding page, B14 the taking-away page, B10 the tens page, B16 the money page, B17 the clock page. A child could be fluent in all twenty-three and never once have CHOSEN. B24 takes the page title away, and then makes the surface words unreliable on purpose — a story that says "left" wants an addition, a story that says "altogether" wants a subtraction, and a story that asks how many were "added" wants a subtraction too. One story states a count the question never uses, which is the first time in the level that "use all the numbers" stops paying. And every two-step item crosses TWO chapters rather than repeating one: a time measured on a clock feeding an addition, boxes of ten turned into a number before anything can be taken out of it, and a queue that grows and then shrinks around a spare number. Retrieval is raised to the top of the band and drawn from across the whole level, so what is revisited is the year rather than last week.',
  explanation: {
    hook:
      'Two stories can hold the same two numbers and want opposite moves. Nothing in the numbers tells you which. The story does, and this week nothing on the page will say it for you.',
    whyBeforeHow:
      'The numbers in a story never say what should happen to them, because a number is only ever a count of something — the job is carried by the story, not by the digits. That is why the job before the numbers is the thing to settle first. Ask what the story is doing: are two amounts going together to make a whole, or is one whole being split so that a part can be found, or is one collection being counted twice at two different times? Once that is settled the arithmetic is the easy half, and you already know it. Here is the part that catches everybody. Single words look like signposts and they are not. The word "altogether" turns up in stories that join and in stories that split. The word "left" turns up in both as well. So a word can say what it likes; what decides is what is happening to the amounts. Some jobs here want two moves, one after the other, and one or two stories say a number the question never wanted.',
    script: [
      {
        say: 'Here are two stories holding the same two numbers. Story one: the shelf holds 45 comics altogether, and 18 are space comics. Story two: the shelf holds 45 football comics and 18 space comics. Story one answers 27. Story two answers 63.',
        visual: 'Story one drawn: one bar of 45 comics cut into a part of 27 and a part of 18.',
        // The finished partition MAY be shown here: the answer is already spoken,
        // and watching the whole get cut is the teaching. It carries no assertion
        // because a script surface has no answer or params to assert against.
        figure: barModel(
          [
            {
              label: 'the whole shelf',
              segments: [
                { value: 27, label: '27' },
                { value: 18, label: '18' },
              ],
              total: '45',
            },
          ],
          { scaleMax: 45, alt: 'one bar of 45 comics cut into a part of 27 and a part of 18' },
        ),
      },
      {
        say: 'The word altogether did not choose my job. It sat in both stories and pointed two ways. So I read what the story does to the amounts.',
        visual: 'The word altogether written once between the two stories, with an arrow to each.',
      },
      {
        say: 'Now a story with two jobs. We left at quarter past 2. This clock says quarter to 3. So the ride took 30 minutes. Then we walk for 12. That is 42 minutes.',
        visual: 'The clock as the minibus arrives: quarter to 3, with the walk still to come.',
        figure: clockFigure(
          { h: 2, m: 45 },
          { marks: 'five', alt: labelledClockAlt('the clock as the minibus arrives', 2, 45) },
        ),
      },
      {
        say: 'Some stories say a number the question never wants. Four helpers stand behind the counter. The queue does not care how many helpers there are.',
        visual: 'Three numbers in a row, with a light ring round the one the question leaves alone.',
      },
      {
        say: 'One habit before any writing. I ask about how big my answer should be. Splitting makes it smaller, joining makes it bigger. Then I check.',
        visual: 'Two arrows from one number, one running up and one running down.',
      },
    ],
    summary:
      'A story carries its job; the numbers do not. Ask first whether two amounts are going together, or one whole is being split, or one collection is being counted twice. Single words are not signposts — altogether and left both point either way. Then check the size: splitting makes a smaller number, joining makes a bigger one. Some jobs want two moves in order, and some stories say a number nobody wanted.',
    vocabulary: [
      { term: 'a job', kidGloss: 'one calculation a story is asking you to do' },
      { term: 'altogether', kidGloss: 'the whole lot, with every part counted in' },
      { term: 'the rest', kidGloss: 'the part of a whole that is not the part just named' },
      { term: 'a spare number', kidGloss: 'a count the story says out loud that the question never reaches for' },
    ],
  },
  guidedExamples: [
    {
      ...ge(24, 1, 'modeled', 'A pond dip counted 62 small animals altogether. 25 of them were pond skaters. How many were tadpoles?', [
        {
          teacherSay:
            'Watch me read the whole story before I touch a number. I am hunting for what it does to the count. The 62 is every animal, and the skaters are one part of it. So my answer has to come out smaller than 62.',
        },
        {
          teacherSay: 'Now the easy half. How many tadpoles did the dip count?',
          expected: '37',
        },
      ], '37 tadpoles'),
      visual: 'One bar of 62 small animals cut into a part of 25 and a part of 37.',
      figure: barModel(
        [
          {
            label: 'every animal counted',
            segments: [
              { value: 25, label: '25' },
              { value: 37, label: '37' },
            ],
            total: '62',
          },
        ],
        { scaleMax: 62, alt: 'one bar of 62 small animals cut into a part of 25 and a part of 37' },
      ),
    },
    ge(24, 2, 'completion', 'The same two numbers, a different story. A pond dip counted 25 pond skaters and 62 tadpoles. How many small animals is that?', [
      { teacherSay: 'Is either number the whole count here?', expected: 'no, both are parts' },
      { childDo: 'Name the job this story needs, then work it out.', expected: '87' },
    ], '87 small animals'),
    ge(24, 3, 'prompted', 'The minibus leaves at quarter past 9 and reaches the farm at quarter to 10. The class then walks for 8 minutes. How long is that from school to the farm?', [
      { childDo: 'Measure the ride first, then bring the walk in.', expected: '38' },
    ], '38 minutes'),
    ge(24, 4, 'independent', 'A box holds 74 pencils altogether. 26 of them are blunt. 5 boxes are stacked beside it. How many pencils are not blunt? Solve cold.', [
      { childDo: 'One of these numbers is not needed. Find the job first.', expected: '48' },
    ], '48 pencils'),
  ],
  days: [
    // Day 1 — concept echo: the three story structures met one at a time and
    // never announced, with two settled skills warmed first. No trap, no chain,
    // no page anywhere that says which move it wants.
    [
      { gen: wElapsedQuarter, diff: 2 },
      { gen: wTensAndOnes, diff: 2 },
      { gen: sitHatsStart, diff: 2 },
      { gen: sitTrayRest, diff: 3 },
      { gen: sitTreeAdded, diff: 3 },
    ],
    // Day 2 — fluency + application: the size call made before any working, the
    // first which-number trap, and the week's first two-chapter chain.
    [
      { gen: wAddWithin100, diff: 2 },
      { gen: predictStallCost, diff: 3 },
      { gen: discWhichNumber, diff: 3 },
      { gen: msRideThenWalk, diff: 4 },
      { gen: sitHatsStart, diff: 3 },
    ],
    // Day 3 — interleave at full width: the two-step middle-number trap and the
    // tens chain beside two single-step reads, so the shape of a page never
    // signals the task.
    [
      { gen: wSubWithin100, diff: 2 },
      { gen: wTensAndOnes, diff: 2 },
      { gen: discTwoStepMiddle, diff: 4 },
      { gen: msFirConesThenHome, diff: 4 },
      { gen: sitTrayRest, diff: 3 },
      { gen: sitTreeAdded, diff: 3 },
    ],
    // Day 4 — word problems: the integration day. All three chains, each crossing
    // two chapters and one carrying a spare number, plus the size call — so "it
    // must need two steps" never becomes the cue either.
    [
      { gen: wAddWithin100, diff: 2 },
      { gen: msRideThenWalk, diff: 4 },
      { gen: msFirConesThenHome, diff: 4 },
      { gen: msQueueSpare, diff: 5 },
      { gen: predictStallCost, diff: 4 },
    ],
    // Day 5 — the exit check and the reflection: the chosen-move slip taken
    // apart, a question the child writes and then explains out loud, and the
    // claim about cue words settled for good.
    [
      { gen: wElapsedQuarter, diff: 2 },
      { gen: eaMoveChosen, diff: 4 },
      { gen: reasoningWordBank, diff: 3 },
      { gen: asnCueWord, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: this is the last week of the level, and it stops telling your child which calculation to do. If an answer comes out wrong, do not check the arithmetic first — ask what the story is DOING to the amounts. Are two amounts going together? Is one whole being split so a part can be found? Is one collection being counted twice, at two different times? Nine times in ten the adding and taking away were fine and it was the choosing that slipped. Two habits are worth carrying into the next level. Before writing anything, say out loud whether the answer should come out bigger or smaller than the number you started from. And when a story mentions three numbers, ask which of them the question actually wanted — real questions do not always want all of them, and children who have only met tidy ones find that out the hard way.',
  ],
  puzzle: (r) => {
    // A REPAIR, and it is the one posture no page of this week uses: every daily
    // chain runs forwards in the order its sentences arrive, and this one runs
    // backwards from the end. The start count is never stated, so it has to be
    // recovered by undoing the last job first — which is also why nothing on
    // Day 1 has this shape (its items are single-step and forward).
    //
    // Deterministic construction: the start, the folding and the giving away are
    // drawn and the ending count is COMPUTED from them, so the puzzle always has
    // exactly one whole-number answer and the count never falls below one.
    const start = r.int(14, 38);
    const folded = r.int(8, 20);
    const givenAway = r.int(6, 16);
    const now = start + folded - givenAway;
    const name = one(r);
    return {
      id: 'B24-PZ-01',
      title: 'Puzzle Grove: Back To The Start',
      puzzleType: 'logic',
      prompt: `${name} folded some paper aeroplanes for the flying contest. ${countNoun(folded, 'more aeroplanes')} were folded by a friend. Then ${countNoun(givenAway, 'aeroplanes')} were given away. Now there are ${countNoun(now, 'aeroplanes')}. How many aeroplanes were there at the start?`,
      answer: {
        value: String(start),
        acceptableForms: [countNoun(start, 'aeroplanes')],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Would the starting count be bigger or smaller than the count now?',
        'Take the last sentence first. Put the given-away planes back, then remove the folded ones.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // Every core page is handed a story and asked which job it needs, in the order
  // the sentences arrive. The puzzle is handed the END of a story and asked for
  // its beginning, so the jobs have to be undone in reverse — a repair, not a
  // read, and nothing on Day 1 has that shape.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'undo-the-story' },
  sprint: {
    skill: 'Addition within 100 — the join this level keeps coming back to',
    sourceWeek: B13,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 18, max: 78 },
  },
  mastery: [
    { gen: sitHatsStart, diff: 3 },
    { gen: msRideThenWalk, diff: 4 },
    { gen: sitTrayRest, diff: 3 },
    { gen: msFirConesThenHome, diff: 4 },
    { gen: msQueueSpare, diff: 4 },
    { gen: discWhichNumber, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01/03: the two single-step structures the week keeps unsignalled — two parts joined into a whole where the word "left" points the other way, and a whole split so one part can be found where the word "altogether" points the other way. 02/04: two-chapter chains, one measuring a ride on a clock and then joining a walk to it (its clock face preserved, asserting the arrival minute the chain starts from), one turning boxes of ten into a number before taking a collage out of it (its tens bar preserved, asserting the same). 05: the chain that states a count the question never wants, so a form cannot be passed by consuming every number on the page. 06: the which-number trap, redrawn from a fresh shelf; whether the question asks for the whole or for a part rotates per draw, and the keyed value is recomputed from the fresh operands, so a form cannot be passed by remembering which way round the last one went. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'cue-word-chose-the-job',
      description: 'Hears one word and does what that word usually means. "Altogether" becomes a join even when it labels a whole that is about to be split; "left" becomes a take-away even when both stated counts are parts.',
      exampleWrongAnswer: 'a pond dip of 68 animals with 24 skaters answered as 92 tadpoles',
      distractorRationale: 'Offer the total the cue word invites, which lands above the whole the question was asked about.',
      reteachPointer: 'explanation/script[1] (altogether sat in both stories and settled neither)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'stopped-halfway',
      description: 'Plans a two-job story correctly, carries out the first job, and hands in that count. The second job is never wrong — it simply never happens.',
      exampleWrongAnswer: 'a barrow of 54 bricks with 18 tipped in and 11 built out answered as 72',
      distractorRationale: 'Offer the count that sits between the two jobs, and the pile the sentence has just named aloud.',
      reteachPointer: 'guidedExamples/B24-GE-03 (measure the ride first, then bring the walk in)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'used-a-number-the-question-left-alone',
      description: 'Reaches for every count on the page. Twenty-three weeks of tidy items have taught that a stated number is always wanted, so a spare one gets folded in without a second look.',
      exampleWrongAnswer: 'a plant-stall total with the hours the stall was open added to the two prices',
      distractorRationale: 'Offer the result with a stated but unwanted count folded into it.',
      reteachPointer: 'explanation/script[3] (the queue does not care how many helpers there are)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'second-job-slip',
      description: 'Gets the plan and the order right, then loses a ten or a one inside one of the two jobs. Nothing is wrong with the thinking; the columns wobbled.',
      exampleWrongAnswer: 'a whole table count of 64 with 26 taken away given as 48',
      distractorRationale: 'Offer a result a whole ten off, which is what a rushed second job produces.',
      reteachPointer: 'explanation/summary (settle the size first), and the untimed Day-3 sprint',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'joins-and-splits-not-yet-quick',
      description: 'Picks the right job and then builds the arithmetic from scratch, one finger at a time. Nothing is left over for the choosing, which is the part this week is actually assessing.',
      exampleWrongAnswer: 'a correctly planned join of 38 and 27 counted on fingers and given as 64',
      distractorRationale: 'Offer a total a single count adrift, which is where a finger-counted two-digit join lands.',
      reteachPointer: 'guidedExamples/B24-GE-01 (the arithmetic is the easy half), plus the ungraded sprint',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'The level ends on the one thing twenty-three weeks of practice cannot give a child: choosing. None of these pages announces its calculation. Your child had to read each story and decide what it was doing to the amounts — two of them going together, one whole being split so a part could be found, or one collection counted twice at two different times — and only then reach for the arithmetic. Several jobs needed two of the year\'s skills one after the other: a clock reading feeding an addition, boxes of ten turned into a number before a take-away could start. And on a page or two, a count was stated that the question never reached for.',
    improvingCandidates: [
      'reading a story for what it does to the amounts, and only then picking a move',
      'carrying a two-job story through to the second job',
      'spotting a count a story states and its question never reaches for',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'not letting a single word decide — "altogether" and "left" both turn up in joining stories and in splitting ones',
      },
      {
        errorTag: 'task-comprehension',
        text: 'finishing a two-job story instead of handing in the count from the middle of it',
      },
      {
        errorTag: 'representation-misread',
        text: 'using only the counts the question reaches for, and letting the others sit',
      },
      {
        errorTag: 'procedure-slip',
        text: 'the adding and taking away inside each job once the plan is settled — the sprint keeps that quick',
      },
    ],
    homeFocus: {
      praiseLine:
        'You read each story right through and noticed what it was doing to the amounts before you chose a calculation — and you checked whether your answer should come out bigger or smaller.',
      questionForChild: 'Here are two sentences about hats. A basket holds 40 hats and 15 of them are sun hats. A basket holds 40 sun hats and 15 rain hats. Which sentence needs the bigger answer, and how could you tell before working it out?',
      schoolSyncHook: 'Level C starts choosing between four operations rather than two. Tell us what their new class opens with and we will slip it into the warm-ups.',
    },
    vocabularyForParent: [
      'a job (one calculation a story is asking for)',
      'the rest (the part of a whole that is not the part just named)',
      'a spare number (a count the story states and its question never reaches for)',
    ],
  },
});
