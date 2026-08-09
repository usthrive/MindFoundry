/**
 * Level B · Week 7 — "Missing addends" (conceptId: missing-addends).
 *
 * FILL-ARCHITECTURE §4 row B7: anchor "missing part on the balance"; multi-step
 * "two-part story"; error-analysis "adds the parts instead of finding the part";
 * discrimination "missing-part vs missing-whole"; Day-5 signature "write a
 * missing-part story". Catalog cell: computational focus "6+▢=13 and ▢+4=11 via
 * think-addition"; non-computational focus "Icon-equation puzzles (shape stands
 * for the hidden number)".
 *
 * ── 1. THE IDEA, AND WHY IT IS HARD ─────────────────────────────────────────
 *
 * Six weeks of Level B have handed the child two parts and asked for the total.
 * This week hands over a total and one part, and takes the other part away. That
 * one swap changes what a page IS, and two consequences run through everything
 * here.
 *
 * The first is a fact about kinds of number. Of the two numbers printed on a
 * missing-part page, one is a whole lot and one is a piece of it. They do not
 * behave alike: a piece cannot be the biggest number on the page, and any answer
 * that is has already gone wrong before the arithmetic starts. A six-year-old who
 * has spent six weeks adding whatever is in front of them will add these two as
 * well, cheerfully, and get a number larger than the whole they were given.
 *
 * The second is a fact about method. The way to a hidden part is FORWARDS. Stand
 * where you can see, walk up to the whole, and count the walking: the number of
 * steps is the part. Backwards would work too, but backwards at six is the thing
 * a child is still building, and forwards is the thing they already trust. This
 * is why the box is worth writing down at all — `6 + ▢ = 13` is not a disguised
 * take-away to a six-year-old, it is an instruction to set off from six and find
 * out how far away thirteen is.
 *
 * ── 2. WHO OWNS WHAT ────────────────────────────────────────────────────────
 *
 * Written out because five sibling weeks name this cell in their own headers, four
 * of them retrieving from it and one handing it a question (kit §E2.8). A claim a
 * neighbour makes about this week is a promise this week has to keep.
 *
 * OWNED — introduced here, assessed here, not assumed anywhere:
 *
 *   (a) THE MISSING PART OF A KNOWN WHOLE. b14 pulls it back out as "the missing
 *       part, which is the add-back check in its first form"; b15 as "missing
 *       addends — a part hidden inside a whole, which is what a gap is"; b19 as "a
 *       missing part of a whole, which is a fair share with one side covered".
 *       Each of those three writes it as a stated target and a count so far, so
 *       that is the form taught here: `sitCoveredPan` and `sitShelfSpace`.
 *
 *   (b) THE BOX. `6 + ▢ = 13` and `▢ + 4 = 11` — the catalog cell names both, and
 *       b04 and b24 each point at this week for the notation. `sitBoxEquation`
 *       puts the box in either addend slot on a coin flip, so a child cannot learn
 *       its POSITION in place of its meaning.
 *
 *   (c) THINK-ADDITION, by name and by habit. Every rung-2 hint in the week points
 *       at the same move: stand on the visible part, count up to the whole. No page
 *       offers a take-away route, because the written take-away is B14's and the
 *       method here is a walk.
 *
 *   (d) "HOW MANY STEPS WAS THAT?" — b04's handoff, stated in its header in as
 *       many words: "no page here leaves the HOP COUNT unknown … 'How many hops
 *       was that?' is B7's question and it is not asked once." So it is asked
 *       here. `sitHowManyClicks` prints a start and a finish and wants the COUNT
 *       between them, which is the missing addend with the story stripped off it.
 *       The same clicker turns up as the B4 warm-up with the count given and the
 *       landing hidden — the machine forwards first, then with its middle out.
 *
 *   (e) THE CHOICE BETWEEN A PART AND THE WHOLE. `discPartOrWhole` keeps the two
 *       children and the collection identical and moves only the question, so
 *       "put the numbers together" is right half the time and wrong half the time
 *       by construction.
 *
 *   (f) THE ERROR THE WEEK EXISTS TO REMOVE — adding the two printed numbers.
 *       Held up for rejection on Day 5, where both values are code-derived (§4
 *       below), and offered as a distractor on the discrimination.
 *
 *   (g) THE WORDS part, whole, missing part, the box and count on. Each is defined
 *       in `explanation.vocabulary`, and no page uses one until it has been.
 *
 * BORROWED — used on these pages, taught on somebody else's, and every one of
 * them in a warm-up slot, which is where a finished skill belongs:
 *
 *   · B6, THE EQUAL SIGN AS A BALANCE. This is the week B7 stands on; b06's header
 *     says so ("the one the other three stand on"). `wBothSides` replays a B6
 *     both-sides card with one number hidden. Nothing here argues about what may
 *     follow an equals sign and no page offers "that is not allowed".
 *   · A13, THE PARTNER OF TEN — the missing part at its smallest and most
 *     memorised. First warm-up.
 *   · B4, COUNTING ON FROM ANY NUMBER — the engine the whole method runs on.
 *   · B5, MAKING TEN TO ADD. A count on from six to thirteen crosses a ten; a
 *     child still assembling that spends the page on the bridge instead of on the
 *     question.
 *   · A15, THE SUMS WITHIN TEN. The sprint, and nothing but the sprint.
 *
 * HANDED ON — belongs to a week that already owns it, so it does not appear here:
 *
 *   1. B8 HAS FACT FAMILIES AND THE TRIANGLE. No triangle is drawn, described or
 *      alluded to; no page asks for a related fact; no page asks which sentence
 *      does not belong. One missing part at a time is this week. Collecting the
 *      four sentences a whole and its parts can make is next week.
 *   2. B6 HAS THE EQUAL SIGN. On an assessed page `=` only ever has an addition on
 *      one side and a single number on the other. Never an add on both sides,
 *      never the total written first, never a sentence to judge true or false.
 *      The one both-sides card in the pack is B6's warm-up.
 *   3. B4 HAS DIRECTION. Every move in this week goes forwards, no page asks which
 *      way to travel, and no track, square or hop is drawn anywhere.
 *   4. B5 HAS THE BRIDGE. No page here is about where to split a number, no
 *      ten-frame is drawn, no spill is counted.
 *   5. B9 HAS STORY PROBLEMS AND B15 HAS COMPARISON. "How many more THAN" is never
 *      asked, two children's counts are never compared, and no comparison bar
 *      exists in this file. `discPartOrWhole` names two children because a whole
 *      needs two parts; what it asks is which amount is missing, never who has more.
 *   6. B13/B14 HAVE THE COLUMNS AND THE TRADE. Nothing here exceeds twenty and
 *      every method is a count, so no column, carry or trade can occur.
 *   7. B10/B11 HAVE TENS AND THE WRITTEN CROSSING; B19 HAS DOUBLES. No multiple of
 *      ten is added, and the two parts of a whole are drawn UNEQUAL on every page
 *      in the pack, so nothing can be got by halving.
 *   8. C3 HAS THIS SHAPE AT THREE DIGITS. c03 calls its own `msShortOfTarget` "the
 *      missing-addend form, grown to three digits (B7's little sibling all the way
 *      up)", which is the right way round: the form is taught here, at a size a
 *      child can do on their fingers.
 *
 * ── 3. THE SYMBOLS ──────────────────────────────────────────────────────────
 *
 * Exhaustively: the digits, `+`, `=` and `▢`. All four are granted by name in the
 * catalog cell ("6+▢=13 and ▢+4=11"), which makes this the first Level-B week to
 * put an equation on a child's page. Absent: `>`, `<`, `−`, `×`, `÷`, `n/d`. B3
 * has the comparison signs, B14 has the written take-away, C6/C9/C15 have the last
 * three. The chains carry `{op:'add'}` and `{op:'sub'}` inside `generator.params`
 * because that is the only vocabulary the op-chain library has for "this much
 * arrives, this much goes", and it is what lets a chain's answer be folded rather
 * than typed. No string a child reads contains a minus sign. Written down here
 * because a symbol ban should not have to be inferred from a table.
 *
 * ── 4. THE VERIFY LIBRARY: NO LIMIT, AND THAT WAS CHECKED FIRST ─────────────
 *
 * §E2.3 lists an escape hatch and LEARNINGS L34/L36 record what happens when
 * authors reach for it by reflex, so the first move here was to try to DERIVE the
 * recipe's misconception rather than to relocate it. It derives.
 *
 * The misconception is "adds the parts instead of finding the part".
 * `d_verify_binop_misconception_v1` varies the operation over a single operand
 * pair — and the two numbers a missing-part page prints ARE a single pair: the
 * whole `w` and the visible part `k`. So `{a: w, b: k, op: '-', wrongOp: '+'}`
 * hands back
 *
 *      correct = w − k    what the box holds
 *      wrong   = w + k    the two printed numbers, added
 *
 * and `w + k` is exactly what a child produces when every number on a page looks
 * like something to combine. Both operands have a referent in the story (they are
 * printed on the card the child is looking at), the operation swap IS the named
 * mistake, and QG-11 recomputes both halves from `generator.params`. Nothing
 * relocated, nothing complemented, no number invented.
 *
 * Two negative results from the same search, recorded so nobody repeats it:
 *
 *   · THE OFF-BY-ONE TWIN IS NOT DERIVABLE. A child who counts on from the part
 *     but says the starting number as their first step lands one short, at
 *     `w − k − 1`. Getting that out of the operation-swap template needs one pair
 *     `(x, y)` with `x ∘ y = w − k` and `x ∘' y = w − k − 1`. Over {+, −} the two
 *     equations only agree at a half, and no other op pair has an integer solution
 *     at all. `a_verify_countback_slip_v1` returns the right NUMBER but
 *     names a count BACK, a mechanism this week never uses, so pinning to it would
 *     file a true value under a false label. The slip therefore lives only where
 *     it needs no `wrong` value: as a discrimination option computed from that
 *     item's own operands.
 *   · THE DISCRIMINATION IS PINNED CORRECT-ONLY, by `d_verify_binop_v1` over
 *     `{a, b, op}` where `op` is what the question asks for. That is the right
 *     thing to ask for here. Nothing on a discrimination page asserts a worked
 *     result — the wrong answers ARE the options — so the only truth it needs is
 *     one to hold the key up against (kit §F.1 / QG-11).
 *
 * COVERAGE, STATED RATHER THAN LEFT TO BE NOTICED. `sitCoveredPan`,
 * `sitBoxEquation`, `sitShelfSpace` and `sitHowManyClicks` are re-derived through
 * `d_sub_v1`; the three chains through `d_multistep_rat_v1`; both are QG-5.
 * `discPartOrWhole`'s keyed option and the Day-5 error analysis's two values are
 * re-derived by QG-11. The Day-5 story and the always/sometimes/never claim are
 * authored prose with no numeric key, so no gate audits them — that is the
 * uncovered surface in this pack, and it is where the next bug would live (L30).
 *
 * ── 5. CAN A CHILD SCORE THESE WITHOUT THE MATHEMATICS? (kit §E2.11) ────────
 *
 * A missing-addend week is the awkward case, because the two obvious wrong answers
 * — the whole, and the sum of what is printed — both sit ABOVE the answer. Build
 * it naively and "pick the smallest" is free.
 *
 *   · THE ASK ROTATES AND SO DOES THE PAIRING. `discPartOrWhole` draws its
 *     question on a coin flip, and each question keeps FOUR honest wrong values
 *     and offers two of them, chosen by a fourth draw. All eight are named
 *     misconceptions:
 *         a PART missing   the printed numbers added · the whole itself ·
 *                          one step too many · one step too few
 *         the WHOLE missing  one number taken off the other · the bigger number
 *                          alone · one step too few · one step too many
 *     The pairings were chosen so the key lands low, middle and high in turn. That
 *     is the defect b04 built while correctly defending against its mirror
 *     (LEARNINGS L43), so it was measured rather than reasoned about: over 200
 *     seeds, on the two day slots and the mastery slot, the key is the largest
 *     number on offer 27–34% of draws, the smallest 19–30%, and the middle the
 *     rest. No rank is worth playing. Figures in the report.
 *   · NOTHING IS OFFERED-ALWAYS AND KEYED-NEVER. Every option is that draw's own
 *     two operands under one of eight named operations, and every one of the eight
 *     is keyed on a real share of draws. `DECLARED_LURES` gains no entry.
 *   · NO POSITION TO PLAY. All three options are numerals, so none of them is a
 *     thing the prompt names in order; and `makeChoices` shuffles them.
 *   · THE PARTS ARE NEVER EQUAL, on any page in the pack. `hiddenPartFor` removes
 *     the visible part from the pool before drawing. Equal parts would make "write
 *     the number you can see" score full marks, and on the discrimination they
 *     would collapse two options into one.
 *   · ONE RESIDUAL, MEASURED AND DISCLOSED. The key is never a number already
 *     printed in the prompt, and some distractors are — so "strike out anything
 *     already on the page" is a real partial heuristic. It never scores outright:
 *     of the eight pairings, none offers two printed numbers at once, so the best
 *     that heuristic ever does is reduce a three-way page to a coin flip, on the
 *     minority of draws where it applies at all.
 *   · THE FIXED ANSWER IN THE PACK is the always/sometimes/never claim's
 *     "sometimes", which is a property of the claim rather than of a draw. It sits
 *     in a Day-5 teaching slot and appears nowhere a child is certified — L42's
 *     blocking-versus-teaching line, drawn at authoring time.
 *   · THE PUZZLE IS INVISIBLE TO THE SWEEP, which measures keyed options and a
 *     puzzle has none (the hole L41 records for probes). So it was read, and then
 *     re-derived from its own PROSE by an independent parser: 500 puzzles, 500
 *     agreements, 0 disagreements. Three things were built to stop it being
 *     guessed — the two lines print in a random order (measured 48/52), the shape
 *     asked for never appears in the solvable line, and the two hidden numbers
 *     differ in parity so their sum is odd and "they must be the same" is visibly
 *     impossible.
 *
 * ── 6. THE PROBE ────────────────────────────────────────────────────────────
 *
 * A probe has no answer key, so no gate can weigh it and a person has to read the
 * draw (L41: b16 shipped one a guesser won seven times in ten).
 *
 * The probe is "will the covered part be the smaller part?" — eight words, future
 * tense on purpose. `lib/metacog.ts` prepends the probe, so a present-tense
 * version arrives before the dish it refers to; that was caught by reading a
 * generated page and cost four words to fix.
 *
 * Its answer is a coin flip BY CONSTRUCTION. `coveredSmaller` is drawn before any
 * size is, and the two part sizes are then handed to whichever side won. Measured
 * over 800 exposures: the covered part is the smaller one 49.9% of the time.
 *
 * And it earns its place because it decides something. A child who has committed
 * to "smaller" has ruled out both of the week's wrong answers before counting.
 *
 * On a daily page there is no route to `msCoveredDish` except through the wrapper,
 * which is what §E2.2 asks for. The wrapper leaves the hint ladder untouched, so serving the base as
 * well would file one idea under two of the three ladder slots the dedup allows.
 * The bare form is kept for mastery, which the dedup does not count — and where it
 * belongs anyway, since a page cannot hand over the strategy and then measure it.
 *
 * ── 7. THE PICTURES, AND THE ONES REFUSED ───────────────────────────────────
 *
 * L33's test — what does this figure let the child SKIP? — has an unusually sharp
 * answer in this week, and it is worth stating as a result rather than a taste:
 *
 *     ON A MISSING-ADDEND PAGE, ANY HONEST DRAWING OF TWO OF THE THREE AMOUNTS
 *     GIVES AWAY THE THIRD.
 *
 * The whole above the visible part, to one scale, turns the answer into a gap a
 * fingertip can measure. A frame holding the visible part, with the whole as its
 * capacity, turns the answer into a run of empty cells. Those two are the natural
 * pictures for this concept and both of them replace the assessment with a
 * measurement. b03's author deleted one figure for this reason; here it rules out
 * the whole family.
 *
 * SO AN ASSESSED PAGE MAY DRAW EXACTLY ONE AMOUNT: the whole, as a single
 * unpartitioned bar carrying its own number, with no second bar and no shared
 * scale to lay it against. It asserts `param:a` or `param:initN` — a quantity the
 * first sentence of the prose has already given away — and never `answer`. What
 * the child gets is the half of the anchor that is safe to give: a whole is ONE
 * amount, not a pair of digits. What they cannot get is a length to measure.
 * `sitCoveredPan`, `sitShelfSpace` and `msStillNeeded` carry it, so Days 1, 3 and
 * 4 each show a picture; Days 2 and 5 show none, which is a consequence of the
 * result above rather than an oversight.
 *
 * THE FULL PICTURE — the whole above the same length split into the visible part
 * and the found part — appears in the lesson script and in the modeled and
 * completion guided examples, and nowhere else. On those surfaces the answer is
 * already printed beside it, and watching two parts fill a whole is the teaching.
 *
 * REFUSED, and why:
 *   · THE COVERED DISH, always. An unlabelled box drawn to its true length is
 *     still the answer to anyone who puts a finger against it. (b06 reached the
 *     same conclusion about its closed bag; the geometry is the same.)
 *   · THE VISIBLE PART, on any assessed page. Beside the whole it is half of a
 *     measurable gap. Alone it is a number the prose already printed, so it buys
 *     nothing and can be misread as the answer.
 *   · `discPartOrWhole`, entirely. A drawing of two collections announces which
 *     amount is missing before the question is read, and that reading is the item.
 *   · `predictCoveredDish`, entirely. The probe wants a judgement made BEFORE any
 *     work, and a bar invites totalling instead. Put a support under the very step
 *     a page is weighing and the page stops weighing anything (L33); here the step
 *     is the act of committing (L25).
 *   · THE PUZZLE, entirely. Drawing the two shapes with their numbers is the
 *     puzzle; drawing them without is decoration.
 *   · AND NOTHING IS EVER MARKED, RINGED, HATCHED OR STRUCK THROUGH. The whole-bar
 *     builder takes no scaffold flag, so an assessed page cannot acquire one by
 *     accident: no `showPairs`, no `markExtra`, no `crossedOut`.
 *
 * ONE FIGURE WAS DELETED ON READING. The A13 warm-up had a ten-frame, and the
 * warm-up asks how many holes of a ten-hole tin are still bare — which is
 * countable straight off the frame. That turns a recalled bond into a count and
 * quietly removes the one fluency the warm-up is there to check. b05 keeps the
 * same picture and is right to, because there the frame is the taught object. Here
 * it is not, so the picture went.
 *
 * ACCESSIBILITY. A whole-bar's accessible name reads "one bar standing for the
 * left pan, labelled 13, with no part marked on it" — including the last clause,
 * because a sighted child can see that nothing is marked and a screen-reader child
 * has to be told. Each bar names what it is a whole OF, so the balance page and
 * the shelf page do not describe themselves identically. Where both parts are
 * drawn (script and guided examples only) both are named, in the order the prose
 * names them. No alt text in the pack names a missing part.
 *
 * ── 8. THE BAND, AND THE FRAMES ─────────────────────────────────────────────
 *
 * FILL-ARCHITECTURE §1 was worked through line by line rather than trusted. The
 * fifteen-word ceiling measures 0.00% over thirty seeds; getting there cost three
 * hints and one claim, all of them trimmed after the sweep named them, and it is
 * why the balance stories run as three short sentences — one pan, the other pan,
 * then the levelness — since naming both pans at once came to sixteen words.
 * Metacognition is in its band form, a judgement the child lands on before being
 * allowed to work. The error analysis wants a sentence, not a paragraph. The sprint
 * competes with nothing but the child's previous go. And there is no "he" or "she"
 * in the pack, since every actor is a drawn name.
 *
 * FRAMES, GREPPED AT THE END OF THE BUILD, not the start — siblings land while you
 * write (kit §E2.8). Zero hits across all authored weeks for: glass nuggets, the
 * covered dish, cake cases and the cake tin, ping-pong balls, milk bottles,
 * luggage tags and the hook rail, clay tiles, spinning tops, the clicker, and the
 * cloud and crown of the puzzle. Four drafts were re-dressed rather than shipped:
 * corks, walnuts and wooden discs are b06's pan nouns, and this week shares b06's
 * balance so its countables had to be the part that differs; beads are b15's.
 *
 * TWO COLLISIONS KEPT DELIBERATELY, both disclosed. The BALANCE is b06's object on
 * purpose — the B7 row's anchor is "missing part on the balance" — and what
 * separates the two weeks is the question: b06 asks what the empty pan must hold,
 * this week asks what is under the cover. And "path" is a common noun four Level-B
 * weeks use for a NUMBER path, so the tiles here lie in a GARDEN path, named as
 * such in every sentence that mentions it, with a bar rather than a line for a
 * picture.
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt, unitFor } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { assertsParam, barModel } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A13 = { level: 'A' as const, week: 13 };
const A15 = { level: 'A' as const, week: 15 };
const B4 = { level: 'B' as const, week: 4 };
const B5 = { level: 'B' as const, week: 5 };
const B6 = { level: 'B' as const, week: 6 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two DIFFERENT names, so a whole is never shared between someone and themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

/**
 * THE SIZES A PART MAY TAKE, as one pool picked from once.
 *
 * Every draw in this pack takes the hidden part from this pool with the VISIBLE
 * part filtered out — one `r.pick`, and never a redraw loop, because a loop's draw
 * count varies with the values it happens to reject and every item after it in the
 * pack then inherits that variation (kit §E2.4). Two things follow for free, and
 * both are load-bearing:
 * the two parts of a whole are never equal, so "copy the number you can see"
 * never scores; and no part is ever 1, so `countNoun` never has to render a
 * singular for a quantity this week treats as a heap.
 */
const PART_SIZES = [2, 3, 4, 5, 6, 7, 8, 9] as const;

/**
 * A hidden part to go with a visible one, drawn so the WHOLE reaches at least
 * eleven — which is a fix, not a flourish. Reading a generated pack turned up
 * `3 + ▢ = 5` on a Day-2 page and a mastery slot asking what is under a dish
 * when one pan holds seven, and neither is this week's question: a count on that
 * never leaves the first ten is over before the child has had to decide anything.
 * Every whole `hiddenPartFor` builds is now a teen or close to it, which is also
 * what the catalog cell's own example (`6+▢=13`) is. The claim is scoped to that
 * helper on purpose: `discPartOrWhole` draws from its own `PART_PAIRS` pool and
 * still serves wholes below ten, which is defensible there — that item asks WHICH
 * amount is missing, not for a count that has to bridge — but the earlier wording
 * said "every whole in the pack" and was simply false. The filter can never empty: for the
 * largest visible part every size qualifies, and for the smallest, three still do.
 */
const hiddenPartFor = (r: Rng, shown: number): number =>
  r.pick(PART_SIZES.filter((v) => v !== shown && shown + v >= 11));

// ---------------------------------------------------------------------------
// The one figure this week draws, and the one it draws only while teaching
// ---------------------------------------------------------------------------

/**
 * THE WHOLE, AS ONE BAR. A single unpartitioned length carrying its own number,
 * and nothing else on the page to measure it against.
 *
 * This is the only figure an assessed page in this week may carry, for the reason
 * set out in the header: two of the three amounts drawn to one scale hand over
 * the third. What survives that constraint is the part of the anchor that is
 * genuinely worth showing — the whole is ONE amount, not a pair of digits — and
 * it asserts a number the prose has already stated.
 */
const wholeBar = (whole: number, what: string, asserts?: BBFigure['asserts']): BBFigure =>
  barModel([{ label: what, segments: [{ value: whole, label: fmtInt(whole) }] }], {
    alt: `one bar standing for ${what}, labelled ${fmtInt(whole)}, with no part marked on it`,
    ...(asserts ? { asserts } : {}),
  });

/**
 * THE WHOLE ABOVE ITS TWO PARTS, to one scale — the picture the whole week is
 * about, and the picture that answers it.
 *
 * Allowed on three surfaces and no others: the lesson script, and the two guided
 * examples that print their answer next to the picture (kit §E2.5). Neither surface
 * carries an `asserts` clause. A script figure has neither an answer nor params for
 * QG-13 to check against; and on a guided example the number worth pinning is a
 * SEGMENT, which the bar-model addresses through neither `total` nor `bar:k`, so an
 * assertion there would audit some other quantity and read as if it had audited
 * the right one.
 */
const partWholeBars = (known: number, missing: number): BBFigure =>
  barModel(
    [
      { label: 'the whole lot', segments: [{ value: known + missing, label: fmtInt(known + missing) }] },
      {
        label: 'its two parts',
        segments: [
          { value: known, label: fmtInt(known) },
          { value: missing, label: fmtInt(missing) },
        ],
      },
    ],
    {
      scaleMax: known + missing,
      alt: `a bar labelled ${fmtInt(known + missing)} for the whole lot, and under it the same length split into ${fmtInt(known)} and ${fmtInt(missing)}`,
    },
  );

// ---------------------------------------------------------------------------
// Two decorators, both of them decorating a draft that has already been made
//
// `lib/` belongs to the whole corpus and is not a week's to edit, and the shipped
// primitives take neither a picture nor a template id. A week that needs either
// therefore bolts it on afterwards, which is safe under exactly two conditions,
// both enforced by the shape of the code below rather than by intention: nothing
// in here consumes the rng, and nothing in here rewrites `prompt`. The stream
// therefore advances identically with or without the decorator, and the surface
// that QG-1/QG-4 signed is the surface that ships.
//
// The picture decorator can only read `generator.params` — the very numbers the
// answer came out of — so there is no number available to it with which to draw
// something the item disagrees with.
//
// The template-id decorator solves a different problem. `discrimination()` emits
// no `generator` block, so a choice item arrives with nothing for QG-11 to
// recompute its key from. The fix is a one-slot letterbox: the draw closure posts
// what it drew, and the line below collects it. Collecting it AFTER the draft has
// come back is what makes this correct — `drawUniqueItem` is free to run the draw
// as many times as it likes, and the letterbox always holds the run that won.
// (b03 and b04 each arrived at this independently; the mechanism is theirs.)
// ---------------------------------------------------------------------------

function withWholeBar(base: ItemGen, key: string, what: string): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    if (!draft.generator) return draft;
    return { ...draft, figure: wholeBar(numOf(draft.generator.params, key), what, assertsParam(key)) };
  };
}

interface ClaimSpec {
  params: Params;
  seed: number;
}

const claimSlot = (): { posted: ClaimSpec | null } => ({ posted: null });

/** Give a choice item the generator spec QG-11 recomputes its keyed option from. */
function withClaimSpec(slot: { posted: ClaimSpec | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const draft = base(rng, guard, difficulty);
    const spec = slot.posted;
    if (!spec) throw new Error('b07/withClaimSpec: nothing was posted to the slot, so the keyed option has no truth to be checked against');
    return { ...draft, generator: { templateId, params: spec.params, seed: spec.seed } };
  };
}

// ---------------------------------------------------------------------------
// Four warm-ups, and each one is a component rather than a recap
//
// Take any of these away and a core page gets harder for a reason that has
// nothing to do with missing addends. A13's bond is what makes a short count on
// arrive instead of being built. B4's count on IS the method, met here on the
// device a core page later takes the middle out of. B6's reading of `=` is what
// permits a box to sit in the first addend slot at all. And B5's bridge is what a
// count from six to thirteen walks across; without it the child spends the page
// on the ten and never reaches the question. All four sources sit strictly earlier
// in the ladder (QG-2), and retrieval slots are outside the pedagogy gates.
// ---------------------------------------------------------------------------

/**
 * A13 — the partner that finishes a ten.
 *
 * The pool skips five. At five the cases in the tin and the holes left over are
 * the same number, so a child who reads the wrong one of the two still scores full
 * marks and the page has told nobody anything. It is left out of the pool rather
 * than corrected after the draw, so the rng stream is never spent on a value that
 * will not be used.
 */
const wCakeTin = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'partner-of-ten',
    draw: (r) => {
      const set = r.pick([2, 3, 4, 6, 7, 8, 9] as const);
      const name = one(r);
      return {
        prompt: `A cake tin has ten holes. ${name} sets ${countNoun(set, 'cake cases')} into it. How many holes are still bare?`,
        answerValue: String(10 - set),
        templateId: 'retr_partners_of_10_v1',
        params: { a: set },
        units: 'holes',
        hints: [
          'Is this tin nearly full, or nearly bare?',
          'Name the partner that takes this many cases up to ten.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  A13,
);

/**
 * B4 — counting on from any number, on the device `sitHowManyClicks` later takes
 * the middle out of. Here the number of clicks is given and the landing is
 * hidden; there the landing is given and the number of clicks is hidden. Meeting
 * the machine forwards first is the whole reason this warm-up is the one chosen.
 */
const wClicker = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'count-on',
    draw: (r) => {
      const start = r.int(6, 14);
      const clicks = r.pick([2, 3, 4] as const);
      const name = one(r);
      return {
        prompt: `${name}'s clicker reads ${fmtInt(start)}. ${name} clicks it ${countNoun(clicks, 'more times')}, once for each number. What does the clicker read now?`,
        answerValue: String(start + clicks),
        templateId: 'count_on_v1',
        params: { start, hop: clicks },
        hints: [
          'Which number is the clicker showing before any of this happens?',
          'Say the next number out loud for every single click.',
        ],
        errorTags: ['procedure-slip', 'fact-recall'],
      };
    },
  }),
  B4,
);

/**
 * B6 — an add may stand on either side of the equals sign, so a hidden number may
 * too. The visible number on the right is drawn from a pool that excludes both
 * numbers on the left, because with `5 + 4 = 5 + ▢` the box can be read off by
 * matching numbers and no totalling ever happens. The pool is built and picked
 * from once (kit §E2.4), and it cannot run dry: the range holds at least five
 * values and at most two are removed.
 */
const wBothSides = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'both-sides-total',
    draw: (r) => {
      const a = r.int(4, 8);
      // The two numbers on the left are drawn DIFFERENT, so the warm-up never
      // opens with a doubles fact — `8 + 8` is answered from memory and B19 owns
      // doubles anyway, so the totalling this warm-up exists to rehearse would
      // simply not happen.
      const b = r.pick([4, 5, 6, 7, 8, 9].filter((v) => v !== a));
      const total = a + b;
      const pool: number[] = [];
      for (let c = 2; c <= total - 2; c++) if (c !== a && c !== b && c * 2 !== total) pool.push(c);
      const shown = r.pick(pool);
      return {
        prompt: `A card reads ${fmtInt(a)} + ${fmtInt(b)} = ${fmtInt(shown)} + ▢. Which number makes both sides the same?`,
        answerValue: String(total - shown),
        templateId: 'd_sub_v1',
        params: { a: total, b: shown },
        hints: [
          'Which of the two sides has no box on it?',
          'Work that side right out, then ask what the other side is missing.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  B6,
);

/** B5 — the bridge past ten, which is what a longer count on runs through. */
const wBridgePastTen = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'bridge-to-ten',
    draw: (r) => {
      const inTube = r.int(6, 9);
      // Never equal to what is already in the tube, for the same reason the
      // both-sides card avoids it: a double is recalled, not bridged.
      const dropped = r.pick([4, 5, 6, 7, 8, 9].filter((v) => v !== inTube));
      const name = one(r);
      return {
        prompt: `${name} has ${countNoun(inTube, 'ping-pong balls')} in a tube. Then ${fmtInt(dropped)} more go in. How many balls are in the tube?`,
        answerValue: String(inTube + dropped),
        templateId: 'retr_add_within_100_v1',
        params: { a: inTube, b: dropped },
        units: 'balls',
        hints: [
          'Which of the two piles is nearer to ten?',
          'Break the second pile so the first reaches ten, then bring on the rest.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B5,
);

// ---------------------------------------------------------------------------
// THE ANCHOR — a level balance with a dish upside down on one pan
//
// B6 settled what a level bar means: the two sides come to the same amount. The
// new thing is that one of those sides cannot be counted, and that closes off
// every route except the forward one — leave the heap you can see, walk up to the
// pan you can, and count the walk.
//
// The picture is one bar, labelled with the countable pan's own number, asserted
// against the item's `a`. Neither the dish nor the visible heap is drawn; §7 of
// the header sets out why not, and it is a result rather than a preference.
// ---------------------------------------------------------------------------

const sitCoveredPan = withWholeBar(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'missing-part-balance',
    draw: (r) => {
      const shown = r.int(4, 9);
      const hidden = hiddenPartFor(r, shown);
      const whole = shown + hidden;
      return {
        prompt: `The left pan holds ${countNoun(whole, 'glass nuggets')}. The right pan holds ${countNoun(shown, 'nuggets')} and one covered dish. The balance is level. How many ${unitFor(2, 'nuggets')} are in the dish?`,
        answerValue: String(hidden),
        templateId: 'd_sub_v1',
        params: { a: whole, b: shown },
        units: 'nuggets',
        hints: [
          'What must the two pans of a level balance come to?',
          'Count on from the heap you can see until you reach the other pan.',
        ],
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    },
  }),
  'a',
  'the left pan',
);

// ---------------------------------------------------------------------------
// THE BOX ON PAPER — both of the catalog cell's forms
//
// `6 + ▢ = 13` on half the draws and `▢ + 4 = 11` on the other half. A box that
// always sat in the same slot would be learnable as a slot, and a child who has
// learnt where to look has not learnt what a box is. Undrawn: a bar for one addend
// next to a written sentence adds nothing to it, and a bar for both is the answer.
// ---------------------------------------------------------------------------

const sitBoxEquation = situation({
  situationType: 'part-whole',
  cognitiveOp: 'missing-addend-box',
  draw: (r) => {
    const shown = r.int(4, 9);
    const hidden = hiddenPartFor(r, shown);
    const whole = shown + hidden;
    const boxFirst = r.chance(0.5);
    const sentence = boxFirst
      ? `▢ + ${fmtInt(shown)} = ${fmtInt(whole)}`
      : `${fmtInt(shown)} + ▢ = ${fmtInt(whole)}`;
    return {
      prompt: `A card on the wall shows ${sentence}. Which number belongs in the box?`,
      answerValue: String(hidden),
      templateId: 'd_sub_v1',
      params: { a: whole, b: shown },
      hints: [
        'Which number on this card stands for the whole lot?',
        'Put a finger on the part you can see, and count up to the whole.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// A TARGET, AND HOW FAR OFF IT IS — the shape three later weeks come back for
//
// b14, b15 and b19 each write this as a stated target and a count so far, so it is
// taught in that form. Here the whole is a capacity: what the shelf takes when it
// is full. The numbers run higher than the balance pages deliberately — four
// generators drawing two-number surfaces out of one range would compete with each
// other for the pack's freshness budget instead of varying anything a child sees.
//
// It carries the whole-bar too, which is what puts the anchor on the page on the
// word-problems day and not only on the day it is introduced.
// ---------------------------------------------------------------------------

const sitShelfSpace = withWholeBar(
  situation({
    situationType: 'measurement',
    cognitiveOp: 'missing-part-capacity',
    draw: (r) => {
      const onIt = r.int(7, 12);
      const room = r.pick([3, 4, 5, 6, 7, 8].filter((v) => v !== onIt));
      const full = onIt + room;
      const name = one(r);
      return {
        prompt: `A shelf is full when it holds ${countNoun(full, 'milk bottles')}. ${name} puts ${countNoun(onIt, 'bottles')} on it. How many more bottles will fit?`,
        answerValue: String(room),
        templateId: 'd_sub_v1',
        params: { a: full, b: onIt },
        units: 'bottles',
        hints: [
          'Is the shelf nearer to full, or nearer to bare?',
          'Keep putting bottles up in your head until the shelf fills, and count them.',
        ],
        errorTags: ['task-comprehension', 'fact-recall'],
      };
    },
  }),
  'a',
  'a full shelf',
);

// ---------------------------------------------------------------------------
// THE COUNT ITSELF AS THE UNKNOWN — keeping b04's promise
//
// b04 withheld one question on the grounds that it belongs here, and named it: how
// many hops was that. This is it. The clicker's start and its finish are both on
// the page and what is missing is the journey between them, which is the missing
// addend with the story taken off it and nothing else changed.
//
// The number of clicks is drawn from a pool with the starting number taken out, so
// the answer is never something the child can read off the page.
// ---------------------------------------------------------------------------

const sitHowManyClicks = situation({
  situationType: 'rate-of-change',
  cognitiveOp: 'count-the-steps',
  draw: (r) => {
    const start = r.int(5, 11);
    // NEVER FEWER THAN THREE CLICKS. The first draft allowed two, and a generated
    // mastery slot duly asked what it takes to get from 5 to 7 — a distance a child
    // sees rather than counts. A certifying page has to demand the method, so the
    // floor moved up.
    const clicks = r.pick([3, 4, 5, 6, 7].filter((v) => v !== start));
    const finish = start + clicks;
    const name = one(r);
    return {
      prompt: `${name}'s clicker reads ${fmtInt(start)}. ${name} clicks it up to ${fmtInt(finish)}, one number at a time. How many clicks was that?`,
      answerValue: String(clicks),
      templateId: 'd_sub_v1',
      params: { a: finish, b: start },
      units: 'clicks',
      hints: [
        'Which number does the clicker start on, and which does it stop on?',
        'Say the numbers after the start, and put up one finger for each.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE RECIPE'S DISCRIMINATION — is a part missing, or the whole?
//
// The same two children and the same collection either way; only the question
// moves. A child holding "put the two numbers together" is right on the draws
// where the whole is missing and wrong on the draws where a part is, by
// construction rather than by luck.
//
// EIGHT NAMED WRONG VALUES, TWO OFFERED PER DRAW, AND THE PAIRING ROTATES. The
// reason is L43: making the distractors bracket the answer on every draw defeats
// "pick the biggest" and installs "pick the middle" in its place. So each ask
// keeps four honest wrong values and offers a drawn pair of them, which puts the
// answer at the bottom, the middle and the top of the option list in turn.
//
// `d_verify_binop_v1` recomputes the key from `{a, b, op}`, and `op` is set by the
// QUESTION rather than by the draw, so an option keyed against what the page asked
// for cannot get out of this file.
//
// The hint ladder is FIXED across both asks, which is a requirement and not a
// convenience: a ladder that changed with the draw would be seed-variant and the
// dedup would throw for seeds the CI never tested (L19). It also happens to be
// the right pedagogy — a hint that named the operation would answer the item.
// ---------------------------------------------------------------------------

/**
 * The (visible part, hidden part) pairs this item may draw. Both between three
 * and nine, at least two apart, and neither double the other. Built once, so a
 * single `r.pick` guarantees every constraint at every seed with no redraw loop:
 *   · at least two apart  — so "one step too few" never collides with the other
 *     part, and so the parts are never equal;
 *   · neither double the other — so the difference of the two parts is never
 *     equal to one of them, which would collapse two options into one on the
 *     missing-whole draws.
 */
const PART_PAIRS: ReadonlyArray<readonly [number, number]> = (() => {
  const out: Array<readonly [number, number]> = [];
  for (let p = 3; p <= 9; p++) {
    for (let q = 3; q <= 9; q++) {
      if (Math.abs(p - q) >= 2 && p !== 2 * q && q !== 2 * p) out.push([p, q] as const);
    }
  }
  return out;
})();

type DistractorTag = 'task-comprehension' | 'concept-misconception' | 'procedure-slip' | 'representation-misread';

const partOrWholeClaim = claimSlot();

const discPartOrWhole = withClaimSpec(
  partOrWholeClaim,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'part-or-whole',
    draw: (r) => {
      const askWhole = r.chance(0.5);
      const [shown, hidden] = r.pick(PART_PAIRS);
      const whole = shown + hidden;
      const [first, second] = two(r);
      const pairing = r.int(0, 3);
      const hints: [string, string] = [
        'What is this question actually asking you to find?',
        'Decide whether the missing amount is a part or the whole, then work it out.',
      ];

      if (askWhole) {
        // Both parts are printed; the whole is what nobody has counted yet.
        const tookOneOff = Math.abs(shown - hidden);
        const biggerAlone = Math.max(shown, hidden);
        const oneShort = whole - 1;
        const oneOver = whole + 1;
        const WHY: Record<number, string> = {
          [tookOneOff]: 'Takes one amount off the other, so the two piles are measured against each other rather than joined.',
          [biggerAlone]: 'Answers with the bigger of the two piles, so the smaller one is never counted at all.',
          [oneShort]: 'Counts on from one pile but says that number as the first step, so the count stops one short.',
          [oneOver]: 'Slips a place while counting on, so one number is counted twice and the total runs one over.',
        };
        const TAG: Record<number, DistractorTag> = {
          [tookOneOff]: 'task-comprehension',
          [biggerAlone]: 'representation-misread',
          [oneShort]: 'procedure-slip',
          [oneOver]: 'procedure-slip',
        };
        const pairs: ReadonlyArray<readonly [number, number]> = [
          [tookOneOff, oneOver],
          [biggerAlone, oneShort],
          [oneShort, oneOver],
          [tookOneOff, biggerAlone],
        ];
        const chosen = pairs[pairing];
        partOrWholeClaim.posted = { params: { a: shown, b: hidden, op: '+' }, seed: r.uint() };
        return {
          prompt: `${first} has ${countNoun(shown, 'spinning tops')}. ${second} has ${countNoun(hidden, 'tops')}. How many tops do the two of them have?`,
          correct: String(whole),
          distractors: chosen.map((v) => ({ text: String(v), errorTag: TAG[v], rationale: WHY[v] })),
          hints,
          errorTags: ['task-comprehension', 'representation-misread', 'procedure-slip'],
        };
      }

      // The whole and one part are printed; the other part is what is missing.
      const addedThePrinted = whole + shown;
      const theWholeItself = whole;
      const oneOver = hidden + 1;
      const oneShort = hidden - 1;
      const WHY: Record<number, string> = {
        [addedThePrinted]: 'Adds the two numbers printed on the page, so the whole lot is counted again on top of a part.',
        [theWholeItself]: 'Answers with the whole lot, which is the amount the two parts have to make between them.',
        [oneOver]: 'Counts on from the part but says that number as the first step, so one step too many is counted.',
        [oneShort]: 'Counts on from the part and stops one number early, before the whole is reached.',
      };
      const TAG: Record<number, DistractorTag> = {
        [addedThePrinted]: 'task-comprehension',
        [theWholeItself]: 'concept-misconception',
        [oneOver]: 'procedure-slip',
        [oneShort]: 'procedure-slip',
      };
      const pairs: ReadonlyArray<readonly [number, number]> = [
        [addedThePrinted, oneShort],
        [theWholeItself, oneOver],
        [oneShort, shown],
        [addedThePrinted, theWholeItself],
      ];
      // The fourth pairing offers the printed part itself — a real slip, and the
      // only wrong value that can fall BELOW the answer as often as above it,
      // which is what lets the key reach the top of the list on some draws.
      const WHY_SHOWN = 'Copies the part already printed on the page, which is the part nobody asked about.';
      const chosen = pairs[pairing];
      partOrWholeClaim.posted = { params: { a: whole, b: shown, op: '-' }, seed: r.uint() };
      return {
        prompt: `${first} and ${second} have ${countNoun(whole, 'spinning tops')} between them. ${first} has ${countNoun(shown, 'tops')}. How many tops does ${second} have?`,
        correct: String(hidden),
        distractors: chosen.map((v) => ({
          text: String(v),
          errorTag: v === shown ? ('representation-misread' as const) : TAG[v],
          rationale: v === shown ? WHY_SHOWN : WHY[v],
        })),
        hints,
        errorTags: ['task-comprehension', 'concept-misconception', 'procedure-slip'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// The chains — the §4 row's "two-part story", three ways
//
// `msCoveredDish` is the metacognition carrier: the whole arrives as two heaps on
// one pan, so before any counting there is a real judgement to make about which
// of the two parts is the bigger. `coveredSmaller` is drawn FIRST and the sizes
// are handed out to match, so the probe's answer is a coin flip by construction
// and not by luck (LEARNINGS L41).
//
// `msStillNeeded` is the recipe's story form: the known part arrives in two lots
// and the target is stated first. `msLostSome` turns the second step round — some
// of what was put out is taken away again — so a week whose every chain runs the
// same direction cannot teach alternation instead of reading.
// ---------------------------------------------------------------------------

const msCoveredDish = multiStep({
  situationType: 'part-whole',
  cognitiveOp: 'balance-two-heaps',
  draw: (r) => {
    const coveredSmaller = r.chance(0.5);
    const small = r.int(4, 7);
    const big = small + r.int(2, 4);
    const covered = coveredSmaller ? small : big;
    const shown = coveredSmaller ? big : small;
    const whole = small + big;
    // The left pan's two heaps, split so that NEITHER heap equals the heap on the
    // right: with `6 and 9` facing `6 and a dish`, the dish can be read off by
    // matching heap to heap and no totalling ever happens (b06 hit the same trap
    // and closed it the same way). An even split is excluded too, since `7 and 7
    // more` is a doubles fact rather than a total. The pool is built and picked
    // from once, and it cannot run dry: the whole is at least ten, so the range
    // holds five values or more and at most three are removed.
    const pool: number[] = [];
    for (let h = 3; h <= whole - 3; h++) {
      if (h !== shown && whole - h !== shown && h * 2 !== whole) pool.push(h);
    }
    const firstHeap = r.pick(pool);
    const secondHeap = whole - firstHeap;
    // The step chain below computes the answer as firstHeap + secondHeap - shown.
    // `covered` is the story's own name for that amount, so the two must agree —
    // asserted at construction rather than trusted, because the heaps are drawn
    // from a filtered pool and a future edit to that filter could silently break
    // the identity while every gate still passed.
    if (firstHeap + secondHeap - shown !== covered) {
      throw new Error(`b07 msCoveredDish: the chain lands on ${firstHeap + secondHeap - shown}, not the covered heap ${covered}`);
    }
    return {
      prompt: `The left pan holds ${countNoun(firstHeap, 'glass nuggets')} and ${fmtInt(secondHeap)} more. The right pan holds ${countNoun(shown, 'nuggets')} and one covered dish. The balance is level. How many ${unitFor(2, 'nuggets')} are in the dish?`,
      initN: firstHeap,
      steps: [
        { op: 'add', n: secondHeap, d: 1 },
        { op: 'sub', n: shown, d: 1 },
      ],
      units: 'nuggets',
      hints: [
        'How many separate heaps does the left pan have on it?',
        'Add the two heaps on the left, then set the visible heap aside.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * The probe is phrased in the FUTURE ("will … be"), which reads as a question
 * about the page that follows rather than about a dish the child has not met yet.
 * `lib/metacog.ts` prepends the probe, so a present-tense probe arrives before
 * its own referent — found by reading a generated page, and fixed in four words.
 */
const predictCoveredDish = withEstimateFirst(msCoveredDish, 'will the covered part be the smaller part?');

const msStillNeeded = withWholeBar(
  multiStep({
    situationType: 'multi-stage',
    cognitiveOp: 'missing-part-two-lots',
    draw: (r) => {
      const firstLot = r.int(3, 6);
      const secondLot = r.pick([3, 4, 5, 6].filter((v) => v !== firstLot));
      const stillNeeded = r.pick(
        [2, 3, 4, 5, 6, 7, 8].filter((v) => v !== firstLot && v !== secondLot && v !== firstLot + secondLot),
      );
      const target = firstLot + secondLot + stillNeeded;
      const name = one(r);
      return {
        prompt: `A stall needs ${countNoun(target, 'luggage tags')} on its hook rail. ${name} hangs up ${countNoun(firstLot, 'tags')}. Then ${fmtInt(secondLot)} more go up. How many more tags must go on the rail?`,
        initN: target,
        steps: [
          { op: 'sub', n: firstLot, d: 1 },
          { op: 'sub', n: secondLot, d: 1 },
        ],
        units: 'tags',
        hints: [
          'How many tags are on the rail once both lots are up?',
          'Put the two lots together, then count on from there to the number wanted.',
        ],
        errorTags: ['task-comprehension', 'procedure-slip'],
      };
    },
  }),
  'initN',
  'the tags the rail needs',
);

const msLostSome = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'missing-part-after-loss',
  draw: (r) => {
    const cracked = r.int(2, 4);
    const stillDown = r.int(5, 9);
    const laid = stillDown + cracked;
    // The gap is drawn strictly bigger than the cracked tiles, so the first step
    // of the chain never reaches below zero on a Level-B page. The pool holds at
    // least four values before two are removed, so it cannot run dry.
    const pool: number[] = [];
    for (let v = cracked + 1; v <= 8; v++) if (v !== stillDown && v !== laid) pool.push(v);
    const stillNeeded = r.pick(pool);
    const target = stillDown + stillNeeded;
    const name = one(r);
    return {
      prompt: `A garden path needs ${countNoun(target, 'clay tiles')}. ${name} lays ${countNoun(laid, 'tiles')}. Then ${fmtInt(cracked)} of them crack and come up. How many more tiles are wanted?`,
      initN: target,
      steps: [
        { op: 'sub', n: laid, d: 1 },
        { op: 'add', n: cracked, d: 1 },
      ],
      units: 'tiles',
      hints: [
        'How many tiles are left lying in the path in the end?',
        'Work out what is really down first, then count on to the number wanted.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, first page — the recipe's misconception, derived rather than described
//
// One operand pair and two operations: `{a: whole, b: part}` under `-` gives what
// the box holds, and the same pair under `+` gives the two printed numbers added.
// Neither number is chosen by an author, and QG-11 recomputes both of them from
// the params that ship with the item.
//
// The page performs the slip instead of announcing it. There is a card, a number
// written into the box, and a child pointing at the two numbers the sum was made
// from. Anything more explicit would be the child's answer printed above the
// question (L25), so the naming is left to them.
// ---------------------------------------------------------------------------

const eaAddedThePrinted = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const shown = r.int(4, 9);
    const hidden = hiddenPartFor(r, shown);
    return { a: shown + hidden, b: shown, op: '-', wrongOp: '+' };
  },
  build: (v, p, r) => {
    const whole = numOf(p, 'a');
    const shown = numOf(p, 'b');
    const name = one(r);
    return {
      prompt: `${name}'s card reads ${fmtInt(shown)} + ▢ = ${fmtInt(whole)}. ${name} writes ${fmtInt(Number(v.wrong))} in the box. ${name} points at the two numbers already printed on the card.`,
      extension: 'Write the number that really belongs in the box. Then write one sentence about what the box stands for.',
      hints: [
        'How many of the numbers on this card were already known?',
        'Read the card again, and say what the box must make with the part shown.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
      answerKeywords: [
        'a box stands in for a piece of the whole, and a piece cannot be the biggest number on the card',
        'the two printed numbers are a part and the whole, not two parts',
        'the box is what the part still needs to reach the whole',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, second page — the §4 signature: invent the story the card is about
//
// Written out by hand and pinned to one card, on purpose. The thing being marked
// is the child's own invention, and a roomful of children can only compare
// inventions if the card they were all given is the same card. (Three siblings
// made this call before me and for this reason.)
//
// THE STORY HAS NO SINGLE RIGHT SHAPE, so the answer field describes a class of
// answers rather than pretending to name one. Fifteen split into eight and a
// hidden part is a missing-part story whether the things are nuggets, tiles or
// children queuing. What DOES have one answer is the number in the box, and that
// is asked for as a separate line — asking for "the story" as if it had one answer
// is precisely the unanswerable-question failure §E2.7 describes.
// ---------------------------------------------------------------------------

const reasoningWriteMissingPartStory = reasoning({
  prompt:
    'A card reads 8 + ▢ = 15. Write a story about a whole and its two parts that this card could tell. Say which of the numbers is the whole. Then write the number that belongs in the box.',
  value:
    'any story in which a whole lot of fifteen is made of a part of eight and a hidden part, with fifteen named as the whole and the box filled as seven',
  hints: [
    'Which number on a missing-part card is always the biggest one?',
    'Think of one lot of things that splits into two smaller lots.',
  ],
  errorTags: ['task-comprehension', 'concept-misconception'],
});

/**
 * The week's rule handed to the child to settle, rather than announced.
 *
 * "Sometimes" is the honest answer, and saying WHEN is the week's whole content:
 * the hidden part is the smaller one exactly when the part you can see is the
 * bigger, and nothing about being hidden makes an amount small. Both wrong
 * options are positions children genuinely hold — 'always' belongs to the child
 * for whom a covered thing is a scrap, and 'never' to the child who reads a
 * covered thing as the important half. `predictCoveredDish` and
 * `discPartOrWhole` spend the week taking both apart.
 */
const asnSmallerPart = classify({
  prompt:
    'Always, sometimes or never true? The number in the box is smaller than the part you can see. Write one sentence that shows how you decided.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Treats a hidden amount as a small one every time, when either of the two parts may be the bigger.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Treats a hidden amount as the bigger one every time, which only holds when the shown part is small.',
    },
  ],
  hints: [
    'Could the hidden part ever be the bigger of the two parts?',
    'Try a card where the part you can see is nearly the whole lot.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB07 = makeWeekBuilder({
  level: 'B',
  week: 7,
  conceptId: 'missing-addends',
  conceptName: 'Missing addends',
  strandTags: ['addition-subtraction', 'algebra-geometry'],
  prerequisiteWeeks: [A13, B4, B5, B6],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the missing part on the balance',
  conceptFamily: 'operation',
  deepeningDelta:
    'A12 and A13 hid a part of five or of ten behind a hand and asked what was under it, with the whole always the same number and always small enough to picture. B5 asked what a frame still had room for, where the whole was the frame. B7 lets the whole be ANY number up to twenty, states it in words rather than in the shape of a container, and writes it down as a sentence with a box in it. Three things are new. The whole is a number the child has to recognise as the whole, because the page prints two numbers and only one of them is the whole lot. The unknown gets a written home, so the same question can be asked with the box in either addend slot. And the method is named: counting on from the part you can see, with the count itself as the answer. B8 then collects the four sentences one whole and its two parts can make, and B14 replaces the count with a written take-away.',
  explanation: {
    hook:
      'Two pans balance. One pan has a dish upside down on it. You can still say exactly what is under the dish.',
    whyBeforeHow:
      'A whole lot of something can be split into two parts. That is a fact about the amounts, not about the way they are written. So if you know the whole and one part, the other part is already decided. There is nothing left to choose. That is why one picture runs through the week: the missing part on the balance. A level balance tells you the two sides come to the same amount. If one side is partly hidden, the hidden bit is pinned down. It has to be whatever the visible side is short of. It cannot be anything else. What a child needs from that is a way IN. The way in is forwards. Stand on the part you can see and count on to the whole. Count your steps as you go. The number of steps is the missing part. Going forwards matters at this age for two reasons. It uses the counting a child already trusts. It does not lean on the taking away they are still building. It also makes the size of the answer obvious. You can feel whether you are nearly there. That is what stops the two wrong answers this week exists to remove. The first is answering with the whole. The whole is the biggest number on the page and it looks important. The second is adding the two printed numbers. A child who has spent every previous week adding will do that without noticing. One question rules both out before any arithmetic. A part cannot be bigger than the whole it came out of. Once the count is secure it can be written down. A box is just the place a number sits before you know it. The box may stand first or second in the sentence. The two parts of a whole do not take turns.',
    script: [
      {
        say: 'Here is the balance. The left pan holds 13 nuggets. The right pan holds 6 and a dish.',
        visual: 'The left pan of 13 drawn as one bar, with no part marked on it.',
        figure: wholeBar(13, 'the left pan'),
      },
      {
        say: 'The dish is not empty. Something is under it, and the bar between the pans is level.',
      },
      {
        say: 'So I stand on 6 and I count on. Seven, eight, nine, ten, eleven, twelve, thirteen.',
      },
      {
        say: 'That was seven numbers. So there are seven nuggets under the dish, and no other number will do.',
        visual: 'The whole of 13 drawn as one bar, and under it the same length split into 6 and 7.',
        figure: partWholeBars(6, 7),
      },
      {
        say: 'One habit before I finish. I check by putting the two parts back together again.',
      },
    ],
    summary:
      'A part is missing when you know the whole and you know the other part. Stand on the part you can see and count on to the whole. The number of steps you took is the missing part.',
    vocabulary: [
      { term: 'part', kidGloss: 'one of the two pieces a whole lot has been split into' },
      { term: 'whole', kidGloss: 'the amount the two parts make once they are put together' },
      { term: 'missing part', kidGloss: 'the part you cannot see yet — the one the box is standing in for' },
      { term: 'the box', kidGloss: 'a square drawn where a number is hiding, until you work out which number it is' },
      { term: 'count on', kidGloss: 'start on the part you can see and say the next numbers, up to the whole' },
    ],
  },
  guidedExamples: [
    {
      ...ge(7, 1, 'modeled', 'The left pan holds 12 nuggets. The right pan holds 5 nuggets and a covered dish. The balance is level. How many nuggets are in the dish?', [
        {
          teacherSay:
            'Watch me. I know the whole is 12, and I know one part is 5. I do not know the other part yet.',
        },
        {
          teacherSay: 'So I stand on 5 and count on. Six, seven, eight, nine, ten, eleven, twelve. How many numbers was that?',
          expected: '7',
        },
      ], '7'),
      // Drawn in full, and only here and in the script: the answer is on the page
      // beside it, and two parts filling a whole is what there is to see (§E2.5).
      visual: 'The whole of 12 as one bar, and under it the same length split into 5 and 7.',
      figure: partWholeBars(5, 7),
    },
    {
      ...ge(7, 2, 'completion', 'A card reads 9 + ▢ = 16. Which number belongs in the box?', [
        { teacherSay: 'The whole is 16. Which of the two parts can you already see?', expected: '9' },
        { childDo: 'Count on from that part up to the whole, and count your steps.', expected: '7' },
      ], '7'),
      // Fading: the picture is down to the whole alone. One part is in the sentence
      // and the other is the child's job.
      visual: 'The whole of 16 as one bar, with no part marked on it.',
      figure: wholeBar(16, 'the whole lot'),
    },
    {
      ...ge(7, 3, 'prompted', 'A garden path needs 15 clay tiles. Only 6 tiles are down. How many more tiles are wanted?', [
        { childDo: 'Say which number is the whole, then count on from the part.', expected: '9' },
      ], '9'),
      visual: 'Nothing drawn — the whole is only a number on this page.',
    },
    {
      ...ge(7, 4, 'independent', 'A card reads ▢ + 6 = 14. Which number belongs in the box?', [
        { childDo: 'Work it out on your own, then check by putting the two parts back together.', expected: '8' },
      ], '8'),
      visual: 'No picture here either — both parts are held in the head.',
    },
  ],
  days: [
    // Day 1 — concept echo. The balance, the card, a capacity and a journey with
    // its middle removed. One step per page and no chain anywhere.
    [
      { gen: wCakeTin, diff: 2 },
      { gen: sitCoveredPan, diff: 2 },
      { gen: sitBoxEquation, diff: 2 },
      { gen: sitShelfSpace, diff: 3 },
      { gen: sitHowManyClicks, diff: 3 },
    ],
    // Day 2 — fluency and application: something to commit to before any counting
    // happens, then the page that turns on reading the question.
    [
      { gen: wClicker, diff: 2 },
      { gen: predictCoveredDish, diff: 4 },
      { gen: discPartOrWhole, diff: 3 },
      { gen: sitBoxEquation, diff: 3 },
      { gen: sitHowManyClicks, diff: 3 },
    ],
    // Day 3 — interleaved on purpose: the choice page and the plain balance page
    // share a spread, so a page's appearance stops announcing its task.
    [
      { gen: wBothSides, diff: 2 },
      { gen: wBridgePastTen, diff: 2 },
      { gen: discPartOrWhole, diff: 3 },
      { gen: predictCoveredDish, diff: 4 },
      { gen: sitCoveredPan, diff: 3 },
    ],
    // Day 4 — word problems: both chains, one running forwards and one turning
    // round in the middle, beside the single-step capacity story.
    [
      { gen: wBridgePastTen, diff: 3 },
      { gen: msStillNeeded, diff: 4 },
      { gen: msLostSome, diff: 4 },
      { gen: sitShelfSpace, diff: 3 },
    ],
    // Day 5 — the signature: a card taken apart, a story written, and the week's
    // rule finally argued about.
    [
      { gen: wCakeTin, diff: 2 },
      { gen: eaAddedThePrinted, diff: 4 },
      { gen: reasoningWriteMissingPartStory, diff: 3 },
      { gen: asnSmallerPart, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: there is one thing to listen for this week and you can hear it from across the room. Ask your child what goes in the box on a card reading 6 + ▢ = 13, and listen to what they say FIRST. If you hear "nineteen", they have added the two numbers they can see, which is what every page before this one asked them to do — it is a habit, not a gap, and it goes when the question is read out loud slowly. If you hear "thirteen", they have answered with the whole. Both are fixed by the same question, asked before any counting: which of these two numbers is the whole lot? A part cannot be bigger than the whole it came out of, so once that is settled the wrong answers are already gone. Then let them count FORWARDS. Six, and on to thirteen, one finger per number — seven fingers, seven in the box. Counting forwards is not a slower version of taking away; at six it is the version that works, because it uses the counting they already trust. A tin of buttons and a saucer to cover some of them is all the equipment this needs, and the question is always the same one: I know how many there are altogether, and I can see these — so how many are under the saucer?',
  ],
  puzzle: (r) => {
    // TWO SHAPES, ONE UNLOCKED BY THE OTHER — a search, which is a move nothing
    // in the daily core makes. Every core page prints the whole and one part and
    // wants the other. This page prints two sentences, only ONE of which can be
    // worked out on its own, so the child has to find that one first and carry
    // what it gives them into the other. The catalog cell asks for an
    // icon-equation puzzle where a shape stands for the hidden number; the search
    // is which shape can be pinned down at all.
    //
    // THREE THINGS ARE DRAWN SO THE PAGE CANNOT BE PASSED BY POSITION. The two
    // sentences are printed in a random ORDER, so "do the first one" is not a
    // rule. The shape that is ASKED for never appears in the solvable sentence,
    // so its number cannot be read off. And the two shapes are drawn to hide
    // DIFFERENT numbers, so "they must be the same" is never the answer.
    //
    // No picture: drawing the two shapes with their hidden numbers beside them is
    // the puzzle, and drawing them without their numbers is decoration.
    const [keyShape, askShape] = r.shuffle(['moon', 'cloud', 'crown']).slice(0, 2);
    const keyValue = r.int(3, 9);
    // THE TWO HIDDEN NUMBERS ALWAYS DIFFER IN PARITY, which makes their sum ODD,
    // which makes "the two shapes must be hiding the same number" visibly wrong
    // rather than merely wrong. Reading a generated page is what raised it: with
    // an even sum on the chained line, halving it is a guess a child can make
    // without touching the other line at all.
    const askValue = r.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v % 2 !== keyValue % 2));
    // The plain number in the solvable sentence differs from both hidden numbers,
    // so no sentence can be settled by matching two numerals.
    const plain = r.pick([2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== keyValue && v !== askValue));
    const solvable = r.chance(0.5)
      ? `The ${keyShape} and ${fmtInt(plain)} make ${fmtInt(keyValue + plain)}.`
      : `${fmtInt(plain)} and the ${keyShape} make ${fmtInt(keyValue + plain)}.`;
    const chained = r.chance(0.5)
      ? `The ${askShape} and the ${keyShape} make ${fmtInt(askValue + keyValue)}.`
      : `The ${keyShape} and the ${askShape} make ${fmtInt(askValue + keyValue)}.`;
    const solvableFirst = r.chance(0.5);
    const lineOne = solvableFirst ? solvable : chained;
    const lineTwo = solvableFirst ? chained : solvable;
    return {
      id: 'B7-PZ-01',
      title: 'Puzzle Grove: The Two Hidden Shapes',
      puzzleType: 'logic',
      prompt: `Two shapes each hide a number. ${lineOne} ${lineTwo} Which number is the ${askShape} hiding?`,
      answer: {
        value: String(askValue),
        acceptableForms: [],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which of the two sentences has only one shape in it?',
        'Settle that shape first, then carry its number into the other sentence.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // A core page prints the whole and one part and wants the other. The puzzle
  // prints two sentences and wants a shape, so one of them has to be found,
  // settled, and its answer carried. Nothing on Day 1 has that shape.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'unlock-two-shapes' },
  // DD11 asks for a source settled at least two weeks earlier; the harder part is
  // choosing a fluency this week actually leans on rather than whichever one is to
  // hand. Six up to thirteen is seven small sums in a row. A child who has to build
  // each of them has nothing spare for the question of which number is the whole.
  sprint: {
    skill: 'Small sums within ten — the facts a count on leans on when it gets going',
    sourceWeek: A15,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'add_within_10_facts_v1',
    params: { min: 1, max: 9, sumMax: 10 },
  },
  mastery: [
    { gen: sitCoveredPan, diff: 3 },
    { gen: sitBoxEquation, diff: 3 },
    { gen: sitShelfSpace, diff: 3 },
    { gen: sitHowManyClicks, diff: 3 },
    { gen: msCoveredDish, diff: 4 },
    { gen: discPartOrWhole, diff: 3 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: the covered dish on a level balance, with a fresh whole and a fresh visible heap. 02: the written box, drawn into the first addend slot on one form and the second on the other, so a form cannot be passed by remembering where the box sat. 03: the capacity story, with the shelf and the count so far both fresh. 04: the count with its middle out — a fresh start and a fresh finish, so the number of clicks cannot be carried across. 05: the two-heap chain served RAW here rather than through the estimate-first wrapper the daily pages use, because a check that lends the child the strategy is not checking it; the covered part is the smaller one on one form and the bigger on the other. 06: the part-or-whole choice, with the question drawn fresh per form and the pair of wrong values rotated, so neither form can be passed by picking an extreme. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'task-comprehension',
      subtype: 'adds-the-two-printed-numbers',
      description:
        'Reads a missing-part page as one more adding page and puts the two printed numbers together, so the whole lot is counted a second time on top of one of its own parts.',
      exampleWrongAnswer: '19 written in the box of a card reading 6 + ▢ = 13',
      distractorRationale:
        'Offer the whole plus the visible part on the part-or-whole choice, and show it as the worked slip in the Day-5 error analysis, where the operation swap generates it.',
      reteachPointer: 'guidedExamples/B7-GE-01 (the whole is 12, one part is 5, and the other part is not known yet)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'answers-with-the-whole',
      description:
        'Gives the whole lot as the missing part, because it is the biggest number printed and it looks like the important one; the child has not yet separated a whole from a piece of it.',
      exampleWrongAnswer: '13 written in the box of a card reading 6 + ▢ = 13',
      distractorRationale:
        'Offer the whole itself beside the true part on the part-or-whole choice, where it is a real option on the draws that ask for the whole and a trap on the draws that ask for a part.',
      reteachPointer: 'explanation/script[3] (seven under the dish, and no other number will do)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'loses-a-step-in-the-count-on',
      description:
        'Counts on from the visible part but says that number as the first step, or slips a place along the way, so the count of steps finishes one either side of the missing part.',
      exampleWrongAnswer: '8 given for the missing part of 13 when 6 is showing',
      distractorRationale:
        'Offer the true part one step up and one step down, which are the two ways a count on goes astray, and pair them so the answer is not always the middle number.',
      reteachPointer: 'explanation/script[2] (stand on the part and count on — seven, eight, nine and on to thirteen)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'copies-a-number-off-the-page',
      description:
        'Answers with one of the numbers already printed, usually the bigger of two parts or the part that was visible, without settling which amount the question is actually about.',
      exampleWrongAnswer: '9 given for how many the two children have when one has 9 and the other 5',
      distractorRationale:
        'Offer the bigger of the two printed amounts on the draws that ask for the whole, and the visible part itself on the draws that ask for a part.',
      reteachPointer: 'guidedExamples/B7-GE-02 (the whole is 16 — which of the two parts can you already see?)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'short-counts-not-yet-quick',
      description:
        'Rebuilds every small count from one, which is correct and slow, and leaves no attention over for deciding whether the amount wanted is a part or the whole.',
      exampleWrongAnswer: 'a count on from six to thirteen restarted from one on every page',
      distractorRationale:
        'Offer the true part with one step added and with one taken off: a count rebuilt from one loses its place at the end, not in the middle.',
      reteachPointer: 'explanation/vocabulary (count on) — plus the Day-3 sprint, where the small sums stand alone',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Finding a missing part when the whole lot and one part are known — under a cover on a balance, as a shelf that is not yet full, and written down as a sentence with a box in it. The method all week was counting forwards from the part you can see up to the whole, and using the number of steps as the answer.',
    improvingCandidates: [
      'deciding which of the two printed numbers is the whole lot, before any counting',
      'counting forwards from the part you can see, rather than reaching for a take-away',
      'keeping track of the steps, so the count finishes on the whole and not beside it',
    ],
    strengtheningByTag: [
      {
        errorTag: 'task-comprehension',
        text: 'reading a missing-part page as a part-and-whole question rather than one more adding question',
      },
      {
        errorTag: 'concept-misconception',
        text: 'ruling out any answer bigger than the whole before a single number is counted',
      },
      {
        errorTag: 'procedure-slip',
        text: 'counting on without saying the starting number as a step, so the count of steps comes out right',
      },
      {
        errorTag: 'fact-recall',
        text: 'getting the short counts to come without effort, which is what the Day-3 sprint is for',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted on from the part you could see, and you found the part that was hiding.',
      questionForChild: 'Before you count anything, which of these two numbers is the whole lot?',
      schoolSyncHook:
        'You may hear "missing addend" or "number bond" at school, and a blank line where we draw a box. The question underneath is identical, so use whichever words land at home.',
    },
    vocabularyForParent: [
      'part and whole (two parts go together to make the whole lot — so a part is always the smaller number)',
      'missing part (the part you cannot see, which the box on the card is standing in for)',
      'count on (stand on the part you can see, say the next numbers up to the whole, and count the steps)',
    ],
  },
});
