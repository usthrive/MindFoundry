/**
 * Level B · Week 8 — "Fact families" (conceptId: fact-families-add-sub).
 *
 * FILL-ARCHITECTURE §4 row B8: anchor "part-part-whole triangle"; multi-step
 * "family then a new fact"; error-analysis "writes 5−4=9 into the 4/5/9 family";
 * discrimination "which fact does NOT belong"; Day-5 signature "build a family
 * from 2 numbers". Catalog cell: computational focus "Add/subtract fact
 * triangles within 20; related facts"; non-computational focus "Family sort:
 * which fact doesn't belong? Explain".
 *
 * ── 1. THE IDEA, AND WHY IT IS NOT LAST WEEK'S ──────────────────────────────
 *
 * Three numbers, two of them parts and one of them the whole those parts make,
 * are not three facts and they are not four facts. They are ONE fact with four
 * ways of being written down. That sentence is the entire week, and everything
 * below is an attempt to make a six-year-old meet it as a discovery rather than
 * as a rule.
 *
 * The pedagogical prize is large and immediate. A child who owns the family gets
 * every take-away inside twenty for free, because `15 − 6` stops being a journey
 * backwards and becomes a question about a partner: what goes with six to fill
 * fifteen. That is why b14 nominates this week as the source of the fluency its
 * own sprint drills, and it is why the four readings are worth a week rather than
 * a paragraph.
 *
 * ── 2. THE LINE BETWEEN THIS WEEK AND B7, DRAWN BEFORE ANYTHING ELSE ────────
 *
 * b07 and this week share a diagram and share three words, so the boundary is
 * the first thing to state, and it is a boundary of QUESTION rather than of
 * content:
 *
 *     B7 HAS ONE UNKNOWN AND A METHOD FOR REACHING IT.
 *     B8 HAS NO UNKNOWN AT ALL — IT HAS A RELATIONSHIP BETWEEN FOUR SENTENCES.
 *
 * Every B7 page prints a whole and a part and wants the part that is hidden;
 * the work is arriving at a number. Take that page, draw a triangle round it
 * and nothing has changed — which is exactly the trap this file was written to
 * avoid. So the pages here ask questions that have no missing-part reading at
 * all: which of these three cards is not one of this family's cards; which
 * adding card belongs to the same family as this take-away card; a card has a
 * sentence on each side, so what does the second side make; and — the one place
 * the two weeks genuinely touch — two of a family's numbers are on the page and
 * THE PAGE WILL NOT SAY WHICH ROLES THEY HOLD. That last one is the recipe's
 * "build a family from 2 numbers", and it is B8 rather than B7 precisely because
 * B7 always told the child which number was the whole. Deciding the roles is the
 * new work; the arithmetic that follows is borrowed from B5 and B7 and is
 * declared as borrowed below.
 *
 * ── 3. WHO OWNS WHAT ────────────────────────────────────────────────────────
 *
 * Three siblings name this cell in their own headers, and each claim is a promise
 * this file has to keep (kit §E2.8). All three are quoted, because a paraphrase
 * of a promise is not the promise.
 *
 * OWNED — introduced here, assessed here, assumed nowhere earlier:
 *
 *   (a) THE FACT FAMILY AND ITS FOUR CARDS. b24 states the boundary in as many
 *       words: "**B8 owns fact families** (the part-part-whole triangle, 'which
 *       fact does not belong')". Both halves are kept: `discImpostor` IS "which
 *       fact does not belong", and the triangle is this week's declared anchor.
 *   (b) THE PART-PART-WHOLE TRIANGLE, AS A NAMED OBJECT. c10 describes what it
 *       inherits: "B8 built fact families out of adding and taking away, where
 *       the three numbers sit in a line: two parts side by side and a whole
 *       across them." So the triangle is named, glossed, and walked round in the
 *       lesson script — and it is never DRAWN, for reasons set out in §6, which
 *       are reasons and not taste.
 *   (c) THE TAKE-AWAY FACTS INSIDE TWENTY, AND THE METHOD THAT DELIVERS THEM.
 *       b14 declares its own sprint "self-referenced on the take-away facts of
 *       B8 — the teen fact that hides inside every broken ten", and wires
 *       `sourceWeek: B8` with `{min: 11, max: 18, subtrahendMax: 9}`. That is a
 *       promise about range as well as about content, so every family in this
 *       pack has a whole of eleven to seventeen and two parts of two to nine,
 *       and `sitPartnerTakeAway` is the page that asks for such a fact cold.
 *   (d) THE RULE ABOUT WHICH NUMBER GOES FIRST. A family's two take-away cards
 *       both open with the whole, and nothing else can open one. It is settled
 *       on Day 5 as an always/sometimes/never claim and it is the repair the
 *       error analysis wants.
 *   (e) THE WORDS fact family, related fact, fact triangle and take-away card.
 *       Each is glossed in `explanation.vocabulary`, and no page uses one first.
 *
 * BORROWED — used here, taught by somebody else, and named as theirs:
 *
 *   · B7'S BOX AND B7'S THINK-ADDITION. `▢` appears once in this pack, in the
 *     B7 warm-up, in the second addend slot only — the slot ROTATION is b07's
 *     own device and is left to it. The forward method ("what joins this part to
 *     fill the whole") is B7's method, and this week's contribution is not a new
 *     method but the observation that the method answers take-away cards too.
 *   · B7'S THREE WORDS part, whole and missing part, all three glossed there.
 *     Re-glossing them here would announce that B7 had not happened.
 *   · A23'S FIRST FAMILY. Ten and some more, met as a teen number, is the first
 *     three numbers a child ever holds as a family; it opens Days 1 and 5.
 *   · A17'S TAKE-AWAY SENTENCE, which is what makes a take-away CARD readable at
 *     all, and B5'S BRIDGE, without which the adding half of a teen family is
 *     built rather than recalled.
 *
 * HANDED ON — owned by a week that already has it, so absent here:
 *
 *   1. B7 HAS THE MISSING PART OF A STATED WHOLE. No page in the daily core
 *      prints a whole, prints a part, and asks for the other part in B7's own
 *      shape. `sitThirdNumber` comes closest and is the one item that withholds
 *      the roles, which is the whole difference; it says so on its own page.
 *   2. B6 HAS THE EQUAL SIGN. Every sentence in this pack has an operation on the
 *      left and a single number on the right. Never an add on both sides, never a
 *      total written first, and no page argues about what may follow `=`.
 *   3. B9 HAS STORY PROBLEMS WITHIN TWENTY. This is a notation week by the
 *      catalog's own description of it, and that is deliberate rather than lazy:
 *      a part-whole STORY with one amount hidden is B7's page in every case, so
 *      the only way to leave B7's page is to leave stories. There is not one
 *      join-or-separate narrative here, and nothing is asked "how many more than".
 *   4. B13/B14 HAVE THE WRITTEN COLUMN AND THE TRADE. b07 records the handoff as
 *      "B14 replaces the count with a written take-away", meaning the ALGORITHM.
 *      The take-away FACT within twenty is this week's, per b14's own sprint; the
 *      column, the carry and the trade are not, and nothing here exceeds
 *      seventeen so none of them can occur.
 *   5. B19 HAS DOUBLES, AND SO HAS THE TWO-CARD FAMILY. Every family in this pack
 *      is drawn with its parts UNEQUAL (`PART_PAIRS` takes p strictly below q),
 *      which keeps the count of cards at four on every page and keeps halving off
 *      the table. The equal-parts family — genuinely interesting, genuinely a
 *      doubles fact — is left where the doubles live.
 *   6. B15 HAS COMPARISON. No card in this pack subtracts one part from the other
 *      as a legitimate move; the one place that shape appears it is the error
 *      being rejected. No difference is asked for and no comparison bar exists.
 *   7. C10 HAS THIS WEEK AT THE NEXT OPERATION UP. c10 is explicit that its own
 *      contribution is "the move B8 had no need of: with one bottom corner
 *      covered, the answer is a factor nobody has counted". Nothing here is
 *      multiplied or shared, and c10's framing device — naming which CORNER is
 *      covered — is deliberately not this week's, because covering a corner is
 *      the one-unknown page that belongs to B7.
 *
 * ── 4. THE SYMBOLS ─────────────────────────────────────────────────────────
 *
 * Exhaustively: the digits, `+`, `−`, `=` and (in one warm-up) `▢`. The minus
 * sign is granted by the B8 row's own words — "Add/subtract fact triangles within
 * 20" — and by A16/A17, which introduced it. It is written U+2212, the character
 * b13/b14/c04 already use, so a take-away reads the same across the corpus.
 * Absent: `>`, `<`, `×`, `÷`, `n/d`. B3 has the comparison signs; C6, C9 and C15
 * have the last three. The two chains carry `{op:'add'}` and `{op:'sub'}` inside
 * `generator.params`, which is the op-chain library's vocabulary and is not a
 * child surface.
 *
 * ── 5. THE VERIFY LIBRARY: ONE DERIVATION, ONE PROVED LIMIT ────────────────
 *
 * §E2.3 offers an escape hatch and LEARNINGS L36 records what happens when an
 * author reaches for it on reflex, so each case below was pushed until it either
 * derived or provably could not.
 *
 * IT DERIVES FOR THE ERROR ANALYSIS, exactly and without a reframe. The recipe
 * names the misconception by its output: "writes 5−4=9 into the 4/5/9 family".
 * The kit (§E2.3) describes what that template can do: hold one operand pair still
 * and change the sign between them. A family's two parts ARE such a pair, so:
 *
 *      {a: q, b: p, op: '-', wrongOp: '+'}  →  correct = q − p
 *                                              wrong   = q + p = the whole
 *
 * so the shown wrong value IS the family's whole, arrived at by the operation the
 * child actually performed — they wrote a take-away and did an add. Nothing is
 * invented, both operands are printed on the card the child is looking at, and
 * QG-11 recomputes both halves from `generator.params`. The stated true answer is
 * `q − p`, which is the honest value of the sentence as written and is the number
 * that makes the claim false.
 *
 * THE LIMIT, PROVED BEFORE IT WAS ACCEPTED: **no registered verify template can
 * audit a discrimination whose options are SENTENCES, and pinning one anyway
 * would be worse than not pinning it.** Every `verifyFor` in the library returns
 * a single numeral (`d_verify_binop_v1`, the fraction and decimal families, the
 * four signed ones, `d_verify_ratchain_v1`). QG-11's choice arm accepts a keyed
 * option when `correct.text.includes(truth.correct)` — and a keyed option of
 * `5 − 4 = 9` contains the character `9`, so a pin of `{a: p, b: q, op: '+'}`
 * would pass on every draw for a reason that has nothing to do with the item
 * being right. That is a green check that has audited nothing, which is the
 * failure mode b07 named for figure assertions and L30 named for gate coverage.
 * The alternative pin — `{a: q, b: p, op: '-'}`, whose truth is the real value of
 * the impostor's left-hand side — FAILS on every draw instead, because the keyed
 * sentence prints the whole where that value should be. Both directions were
 * checked rather than assumed.
 *
 * Three further negative results, recorded so the search is not repeated:
 *   · REFRAMING TO NUMERIC OPTIONS WAS TRIED AND REJECTED ON THE MATHEMATICS,
 *     not on taste. "Which of these three numbers starts the family's take-away
 *     card?" has a numeric key that `d_verify_binop_v1 {a: p, b: q, op: '+'}`
 *     recomputes exactly — and its key is the whole, which is the largest of the
 *     three numbers on offer on every legal draw. That is `ALWAYS_MAX` at 100%
 *     in whichever slot it sits (kit §E2.11, L43). An honest pin bought with a
 *     guessable item is not a trade worth making.
 *   · THE MIRROR ASK IS NOT UNIQUE. "Which number cannot start a take-away card
 *     here?" has TWO correct answers, one per part, so it is unanswerable in the
 *     §E2.7 sense however well it pins.
 *   · THERE IS NO SET-MEMBERSHIP TRANSFORM. What a fact-family discrimination
 *     actually claims is "this sentence is not one of the four this triple
 *     makes", which is a statement about a SET of four strings. The library has
 *     no transform of that shape and inventing one means editing `lib/`, which is
 *     not a week's to edit (kit §G).
 *
 * WHAT REPLACES THE PIN is stronger than a vacuous one and it ships inside this
 * file: both discriminations recompute their whole option list from the drawn
 * pair `(p, q)` and then ASSERT, at construction time, that the keyed option is
 * none of the family's four cards and that every distractor is one of them (or,
 * in `discWhichAdditionHelps`, that the key is the family's own adding card and
 * neither distractor is). A mis-derived option throws during pack generation, on
 * every seed, rather than shipping under a green gate.
 *
 * COVERAGE, STATED RATHER THAN LEFT TO BE NOTICED. `sitBackOfTheCard`,
 * `sitPartnerTakeAway` and `sitThirdNumber` are re-derived through `d_sub_v1` and
 * `d_add_v1`; both chains through `d_multistep_rat_v1`; all of them are QG-5. The
 * error analysis is QG-11. NOT audited by any gate: the two discriminations'
 * option lists (covered by the construction-time assertions above), the Day-5
 * production answer, the always/sometimes/never claim, and the puzzle key
 * (covered by its own construction-time family count). Those are this pack's
 * uncovered surfaces and they are where the next real bug will be (L30).
 *
 * ── 6. THE PICTURES, AND THE ONE THIS WEEK IS NAMED AFTER ──────────────────
 *
 * The anchor of this week is a triangle and NOT ONE PAGE DRAWS IT. Three separate
 * findings, in the order they were established:
 *
 *   (i) THERE IS NO TRIANGLE PRIMITIVE, and the one that looks like it is a
 *       different object. `FIGURE_TYPES` holds ten builders and none of them is a
 *       number bond. `angle-figure` accepts `shape: 'triangle'` with vertex
 *       `labels`, so three numerals could technically be placed at three corners
 *       — but it CONSTRUCTS the polygon from `angles`, draws the angle arcs by
 *       default and marks any right angle, so the output would be a geometry
 *       exhibit asserting that a fact triangle's corners have sizes. They do not.
 *       QG-13 would have no quantity to check, D23 and C22 own that primitive for
 *       classifying angles, and building the picture properly means editing
 *       `lib/figures.ts`, which is not this week's file.
 *
 *  (ii) EVEN WITH THE PRIMITIVE, AN ASSESSED PAGE COULD NOT CARRY IT. The result,
 *       stated as a result:
 *
 *           A FACT TRIANGLE WITH ALL THREE NUMBERS IN IT IS THE ANSWER TO EVERY
 *           QUESTION A FACT-FAMILY PAGE CAN ASK, AND A FACT TRIANGLE WITH ONE
 *           CORNER COVERED IS LAST WEEK'S PAGE.
 *
 *       Both halves bite. Filled in, it hands over which number is the whole and
 *       which two are the parts, and every question here is a question about
 *       exactly that; the impostor on `discImpostor` could be found by checking
 *       three corners against three numerals with no idea what a family is.
 *       Covered, it is a missing part with a diagram round it, which is the one
 *       thing §2 forbids. There is no third setting. b07 reached a neighbouring
 *       conclusion about bars on a missing-addend page and drew exactly one
 *       amount; here the conclusion is stronger, because the pages do not ask for
 *       an amount at all — the whole family is the GIVEN, so drawing the given
 *       leaves nothing.
 *
 * (iii) SO THE ASSESSED PAGES OF THIS WEEK CARRY NO FIGURE, and that is the
 *       decision rather than an omission. Level B sets `pictorialPerDay: 0`, so
 *       nothing is being smuggled past a gate. The band's model-beside-symbols
 *       expectation is met where a model can be honest: the lesson script and the
 *       two guided examples that print their answers beside them.
 *
 * WHAT IS DRAWN, TWICE IN THE SCRIPT AND ON TWO GUIDED EXAMPLES: `familyBars` —
 * the whole as one length, and beneath it the same length broken into its two
 * parts. This is the triangle lying down, and it is the closest a shipped
 * primitive comes to the anchor. It carries no `asserts` clause: a script segment
 * has neither answer nor params for QG-13 to check, and on a guided example the
 * number worth pinning is a SEGMENT, which the bar-model addresses through
 * neither `total` nor `bar:k`, so an assertion would audit a different quantity
 * while reading as though it had audited the right one. The alt text names all
 * three numbers and says which is the whole, because on these two surfaces the
 * answer is already printed and a screen-reader child must get the same picture a
 * sighted child gets. The fade is visible in the four guided examples: two carry
 * the model, two carry a note saying nothing is drawn.
 *
 * REFUSED, and why:
 *   · THE TRIANGLE ITSELF, everywhere — see (i) and (ii).
 *   · `familyBars` ON ANY ASSESSED PAGE. It states which number is the whole,
 *     which is the one thing `sitThirdNumber` exists to withhold and the thing
 *     `discImpostor` needs the child to hold in their head.
 *   · A BAR FOR THE WHOLE ALONE. It would assert a numeral the prompt has already
 *     printed on the same line, buying nothing, and it is b07's figure.
 *   · ANY MARK, RING, HATCH OR STRIKE-THROUGH. `familyBars` takes no scaffold
 *     flag, so no page can acquire one by accident.
 *   · A PICTURE ON THE PUZZLE. Drawing the four cards with the family ringed IS
 *     the puzzle; drawing them without is decoration.
 *
 * ── 7. CAN A CHILD SCORE THESE WITHOUT THE MATHEMATICS? (kit §E2.11) ───────
 *
 * A fact-family week has a specific danger the kit names directly: the wrong
 * values are usually the family's own other members, so the answer's place among
 * them has to be watched. Here the options are SENTENCES, so there is no numeric
 * rank for `bb-answer-entropy-test` to measure at all — which means the shortcuts
 * had to be enumerated by hand, and each is reported with the share of draws on
 * which it works.
 *
 *   · `discImpostor` HAS EXACTLY TWO ROUTES AND THE DRAW DECIDES WHICH WORKS.
 *     Route A is "pick the card whose arithmetic is wrong". Route B is "pick the
 *     card holding a number the family does not have". The four impostor kinds
 *     are drawn one in four:
 *         kind 0  the two parts subtracted, the whole written as what is left
 *                 — FALSE, and its three numbers are all the family's, so route
 *                   B finds nothing.
 *         kind 1  the whole take away a part, counted back one step too few
 *                 — FALSE, and one number is a stranger. Both routes work.
 *         kind 2  a TRUE adding card holding one family number and two strangers.
 *         kind 3  a TRUE take-away card that starts with the family's own whole.
 *     Measured over 1,600 draws: the four kinds come out at 24.8 / 22.5 / 26.4 /
 *     26.3 per cent, route A scores 47.3% and route B 75.2%, and the key sits at
 *     each of the three option positions between 31 and 37 per cent of the time.
 *     Neither route alone is worth playing, and route B is not a cheat in any
 *     case: a family IS its three numbers, so testing membership is the content
 *     rather than a way round it. Kind 3 is the sharpest card in the pack, because
 *     it defeats the one surface rule a child is most likely to invent — "family
 *     take-aways start with the whole" — which is true of the family's own cards
 *     and true of that stranger too.
 *   · `discWhichAdditionHelps` OFFERS THREE CARDS THAT ALL HOLD BOTH PRINTED
 *     NUMBERS, so no option can be struck out on sight, and on every draw at
 *     least two of the three END on the whole — so "pick the one that lands on the
 *     number in the question" is never unique (measured: 0.0% of 1,600 draws).
 *     The key is the family's own adding card; the FIVE named wrong cards are
 *     "added the two numbers printed on the take-away card", "counted on one step
 *     too many", "stopped one step short", "reached for a remembered partner near
 *     the right one" and "wrote a true adding card whose total stops one below the
 *     whole". Two are offered per draw over three pairings, and the pairings are
 *     there for something no gate can see. The options are equations, so
 *     `bb-answer-entropy-test` finds no numeric rank in them and correctly reports
 *     nothing — but there is a rank one layer down, in the MIDDLE NUMERAL of each
 *     card. With only three wrong cards the key's middle numeral came out the
 *     smallest of the three on a third of draws and the middle one on the other
 *     two thirds, never the biggest: L43's defect inside an equation rather than
 *     among options. Two of the five wrong cards now sit BELOW the key, which is
 *     what lets a pairing put it at the top. Measured over 1,600 draws: the key's
 *     middle numeral is the smallest 34.0%, the middle 38.6% and the biggest
 *     27.4%. Two of the five wrong cards are arithmetically TRUE, and they are
 *     paired so that "pick the true one" is unique on only 30.9% of draws — it was
 *     58.4% with a set that had one true card. Figures in the report.
 *   · `sitBackOfTheCard` IS SOLVABLE BY ELIMINATION AND THAT IS DELIBERATE, SO IT
 *     IS KEPT OUT OF MASTERY. The front prints all three of the family's numbers
 *     and the back prints two of them, so "say the one that is missing" scores
 *     every time. That reasoning IS this week's claim — a related fact is made of
 *     the same three numbers — so the item is the right first page and the wrong
 *     certificate. It appears on Days 1 and 2 and in neither mastery form, and
 *     `sitPartnerTakeAway` prints the take-away card ALONE, where elimination has
 *     nothing to work on and the fact has to come from somewhere.
 *   · `sitThirdNumber` PUTS TWO OPERATIONS ON ONE PAGE AT NEAR-EVEN ODDS.
 *     "Always add the two numbers" scores 48.1% of draws and "always take one off
 *     the other" the remaining 51.9%, measured over 1,400 exposures; §8 accounts
 *     for why it is not exactly half. Neither habit beats reading the page.
 *   · THE PUZZLE'S ANSWER IS THE LARGEST CARD ON HALF THE DRAWS AND THE SECOND
 *     LARGEST ON THE OTHER HALF. `strangerIsBigger` is drawn before any size is,
 *     and the fourth card is then placed above or below the whole to match, so the
 *     split is a construction rather than a hope: measured over 300 draws the
 *     answer is the biggest card 47.3% of the time and the second biggest 52.7%.
 *     "Pick the biggest" and "pick the second biggest" therefore each score about
 *     half, and nothing separates them without adding two cards together.
 *   · NOTHING IS OFFERED-ALWAYS AND KEYED-NEVER. Every option in the pack is an
 *     equation built from that draw's own numbers, so no option text recurs
 *     across draws at all and `DECLARED_LURES` gains no entry. The one fixed
 *     answer in the pack is the always/sometimes/never claim's "always", which is
 *     a property of the claim and not of a draw; it sits in a Day-5 teaching slot
 *     and appears nowhere a child is certified (L42).
 *
 * ── 8. THE PROBE ──────────────────────────────────────────────────────────
 *
 * A probe has no answer key, so no gate can weigh it and a person has to read the
 * draw (L41). The probe is "is the third number the whole?" — six words, well
 * inside the seven-word budget §E2.9 sets, and phrased so `lib/metacog.ts`'s
 * lead-in reads as one sentence in front of it.
 *
 * The SIDE IS DRAWN FIRST, at even odds: `missingIsWhole` is the very first thing
 * `sitThirdNumber` draws and the two printed numbers are then handed the roles
 * that flip decides. Measured rather than asserted, because the draw is not the
 * only thing that decides what ships: over 1,400 exposures the third number is
 * the whole on 48.1%. The 1.9 points come from the surface-freshness guard, which
 * redraws an item whose numbers are already used elsewhere in the pack — and
 * redrawing re-runs the flip. The two branches print different numbers of
 * numerals, so they collide at different rates. The first draft printed the two
 * parts once each, which put the split at 45.3%; naming both parts a second time
 * ("Both 4 and 9 are parts") widened that branch's surface space and took the
 * remaining gap under two points. It is recorded here because a probe has no key,
 * so the only account of it anyone will ever have is this one.
 *
 * And it earns its slot because it is the week's own decision in miniature — a child who has committed to "the whole" has
 * committed to putting the two parts together, and a child who has committed to
 * "a part" has committed to taking one off the whole. There is nothing left to
 * choose afterwards.
 *
 * `sitThirdNumber` is reachable on a daily page ONLY through the wrapper, which
 * is what §E2.2 requires: the wrapper leaves the hint ladder untouched, so
 * serving both forms in the core would spend two of the three ladder slots the
 * dedup allows on one idea. The bare form is kept for mastery, which the dedup
 * does not count, and where it belongs anyway — a page that lends the child the
 * decision cannot also measure it.
 *
 * ── 9. THE BAND, THE STRANDS, AND THE FRAMES ──────────────────────────────
 *
 * FILL-ARCHITECTURE §1 was worked through line by line. The fifteen-word ceiling
 * measures 0.00% over thirty seeds, which cost two hints and one production
 * prompt a rewrite after the sweep named them; every card is its own short
 * sentence, which helps, and a bare equation costs three words to a reader.
 * Metacognition is in the band's prediction form. The error analysis wants one
 * sentence. The sprint is ungraded and competes with nothing.
 *
 * STRANDS, WITH A DISAGREEMENT DISCLOSED. FILL-ARCHITECTURE §4 lists B8 among the
 * "on-thread algebra weeks (B6, B7, B8, B15)", which would argue for the
 * `algebra-geometry` tag; the frozen catalog row for this cell carries
 * `['addition-subtraction']` alone. The catalog is the cell's source of truth and
 * `bb-verify-packs` reads it, so the catalog wins and the tag list is the single
 * strand. The algebra is in the content regardless — a family is a relation, and
 * the pages ask which reading of it applies.
 *
 * FRAMES, SCANNED WHEN THE FILE WAS FINISHED. Kit §E2.8 is the reason for the
 * timing: the neighbours are being written at the same time as this, so a noun that
 * was free on Monday is somebody's anchor by Thursday. Zero hits corpus-wide for:
 * toffees, curtain rings, gooseberries and the fact tin. Four earlier drafts were
 * re-dressed rather than shipped — feathers (b03, b05, b21, c19), pebbles (b15,
 * b21), thimbles (b03, c19) and wax crayons, whose short form collides with the
 * crayons of five other weeks. Almost nothing in this pack needs a countable
 * noun, which is a consequence of §2 rather than a saving: the objects here are
 * cards, and the four warm-ups are the only pages with something to count.
 *
 * ONE COLLISION KEPT AND DISCLOSED: a "card" is the object every week reaches for
 * when it needs something with writing on it, and this week is about written
 * sentences, so it could not be avoided. What separates the pages is what the
 * card DOES — a card with a sentence on each side, a card drawn out of the fact
 * tin, four cards lying face up with a family hiding among them — and no page
 * here uses b07's wall card or its question.
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
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A17 = { level: 'A' as const, week: 17 };
const A23 = { level: 'A' as const, week: 23 };
const B5 = { level: 'B' as const, week: 5 };
const B7 = { level: 'B' as const, week: 7 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Never hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);

/** The five DD7 error tags, so a distractor's tag is checked at compile time. */
type Tag = 'fact-recall' | 'procedure-slip' | 'concept-misconception' | 'representation-misread' | 'task-comprehension';

type Params = Record<string, unknown>;
const numOf = (p: Params, k: string): number => Number(p[k]);

/**
 * U+2212, the same character b13, b14 and c04 print, so a take-away card looks
 * identical wherever in the corpus a child meets one. Not the hyphen and not the
 * en dash: QG-11(b)'s prose scanner treats both of those as arithmetic
 * continuation characters, and the sentence splitter treats an en dash as a word
 * boundary.
 */
const MINUS = '−';

/**
 * ONE CARD, BUILT FROM FOUR NUMBERS THAT ARE ALL PASSED IN.
 *
 * The result is an argument rather than a computed default, which is what lets a
 * WRONG card be built without a wrong value ever being hand-written: a false card
 * is this builder called with a result that is itself a named transform of the
 * family's numbers (`q + 1`, `p + w`, `w − 1`). Every numeral goes through
 * `fmtInt`, so the one interpolation authority holds even for a two-digit whole
 * that will never need grouping.
 */
const card = (left: number, op: '+' | typeof MINUS, right: number, makes: number): string =>
  `${fmtInt(left)} ${op} ${fmtInt(right)} = ${fmtInt(makes)}`;

/**
 * THE FAMILIES THIS WEEK MAY DRAW, as one pool built once and picked from once.
 *
 * `p` is strictly below `q`, which is load-bearing three times over: the parts
 * are never equal, so every family here has four cards rather than two and B19
 * keeps the doubles; the two take-away cards are always distinguishable; and no
 * page can be passed by halving. The whole runs eleven to seventeen, which is
 * b14's declared range for the sprint it draws from this week — a family whose
 * whole never crosses ten would deliver take-away facts a child already has.
 *
 * One `r.pick` from a precomputed pool, never a redraw loop: a loop consumes a
 * variable number of draws and every later item in the pack then inherits that
 * variation (kit §E2.4).
 */
const PART_PAIRS: ReadonlyArray<readonly [number, number]> = (() => {
  const out: Array<readonly [number, number]> = [];
  for (let p = 2; p <= 9; p++) {
    for (let q = p + 1; q <= 9; q++) {
      if (p + q >= 11) out.push([p, q] as const);
    }
  }
  return out;
})();

/**
 * The subset `discWhichAdditionHelps` may draw from: smaller part at least three,
 * and the two parts at least two apart. Both bounds were put there by READING a
 * generated page, and each closes a real hole.
 *
 * The three-floor is arithmetic: that generator offers a card reading
 * `part − 1`, and a card with a one in it is not a card anyone writes.
 *
 * The two-apart rule is the interesting one. With the parts one apart, `part − 1`
 * or `part + 1` lands on the OTHER number already printed, and the option comes
 * out as `6 + 6 = 13` — a doubles fact, which B19 owns, and worse, a card a child
 * rejects on sight for a reason that has nothing to do with families. It appeared
 * on a generated Day-4 page.
 */
const PART_PAIRS_APART: ReadonlyArray<readonly [number, number]> = PART_PAIRS.filter(
  ([p, q]) => p >= 3 && q - p >= 2,
);

/**
 * A pool's size is a fact about whether the pack can be built, so it is asserted
 * rather than assumed. Each floor below is the number of DISTINCT surfaces the
 * generators drawing from that pool need before `drawUniqueItem` starts having to
 * accept a repeat, counted from the day plan and both mastery forms.
 */
function sized<T>(name: string, rows: readonly T[], least: number): readonly T[] {
  if (rows.length < least) {
    throw new Error(`b08 ${name}: ${rows.length} rows is not enough for this pack, which needs at least ${least}`);
  }
  return rows;
}

const FAMILIES = sized('PART_PAIRS', PART_PAIRS, 12);
const FAMILIES_APART = sized('PART_PAIRS_APART', PART_PAIRS_APART, 8);

interface Family {
  /** The smaller part. */
  p: number;
  /** The bigger part. */
  q: number;
  /** The whole the two parts make. */
  w: number;
}

const drawFamily = (r: Rng, pool: readonly (readonly [number, number])[] = FAMILIES): Family => {
  const [p, q] = r.pick(pool);
  return { p, q, w: p + q };
};

/** The four cards a family makes, in the order the lesson script walks them. */
const familyCards = (f: Family): readonly string[] => [
  card(f.p, '+', f.q, f.w),
  card(f.q, '+', f.p, f.w),
  card(f.w, MINUS, f.p, f.q),
  card(f.w, MINUS, f.q, f.p),
];

// ---------------------------------------------------------------------------
// The one picture this week draws, and only where the answer is already printed
// ---------------------------------------------------------------------------

/**
 * THE WHOLE OVER ITS TWO PARTS — the triangle lying down.
 *
 * Allowed on three surfaces and no others: the lesson script and the two guided
 * examples that print their answer beside the picture (kit §E2.5). No `asserts`
 * clause, for the reason set out in the header: a script segment has nothing for
 * QG-13 to check against, and on a guided example the quantity worth pinning is a
 * segment, and `bar-model` exposes no selector that reaches inside a bar.
 *
 * The accessible name says which number is the whole, because that is what a
 * sighted child reads off the drawing and a screen-reader child would otherwise
 * have to infer from two numbers in a list.
 */
const familyBars = (p: number, q: number): BBFigure =>
  barModel(
    [
      { label: 'the whole', segments: [{ value: p + q, label: fmtInt(p + q) }] },
      {
        label: 'the two parts',
        segments: [
          { value: p, label: fmtInt(p) },
          { value: q, label: fmtInt(q) },
        ],
      },
    ],
    {
      scaleMax: p + q,
      alt: `a bar of ${fmtInt(p + q)} for the whole, and below it the same length broken into ${fmtInt(p)} and ${fmtInt(q)}`,
    },
  );

// ---------------------------------------------------------------------------
// Four warm-ups, each a component of the week rather than a recap
//
// None of the four is here to fill a slot; drop any one and some core page starts
// failing for a reason that is not about fact families at all. A23's
// ten-and-some-more IS the first family a child ever held, which is why it opens
// the week. A17 is what makes a take-away
// CARD readable at all — a child who cannot read the sentence cannot judge
// whether it belongs. B7's box is the notation the whole week grew out of. And
// B5's bridge is what the adding half of a teen family runs across; without it
// the child builds 6 + 9 instead of recalling it and never reaches the question.
// All four sources sit strictly earlier in the ladder (QG-2), and retrieval slots
// are outside the pedagogy gates.
// ---------------------------------------------------------------------------

/**
 * A23 — a teen number as ten and some more, which is the first three numbers a
 * child ever holds as a family. The extras are never one, so the row and the
 * extras can never be confused for each other, and never ten, which would make
 * the answer a doubles fact.
 */
const wTenAndSome = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'teen-as-ten-and-some',
    draw: (r) => {
      const extras = r.int(2, 9);
      return {
        prompt: `Ten toffees fill a row. ${countNoun(extras, 'toffees')} lie beside the row. How many toffees are there?`,
        answerValue: String(10 + extras),
        templateId: 'retr_teen_ten_ones_v1',
        params: { o: extras },
        units: 'toffees',
        hints: [
          'Is the row full, and how many are outside it?',
          'Hold the ten in your head and carry on from there.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  A23,
);

/**
 * A17 — a take-away inside ten, which is what makes a take-away CARD legible.
 * The rod always keeps at least three rings, so the answer is never a number a
 * child can see at a glance without counting.
 */
const wRingsOnARod = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'take-away-within-ten',
    draw: (r) => {
      const onIt = r.int(7, 10);
      const slidOff = r.int(2, 4);
      const name = one(r);
      return {
        prompt: `A rod holds ${countNoun(onIt, 'curtain rings')}. ${name} slides ${countNoun(slidOff, 'rings')} off it. How many rings are still on the rod?`,
        answerValue: String(onIt - slidOff),
        templateId: 'retr_sub_within_10_v1',
        params: { a: onIt, b: slidOff },
        units: 'rings',
        hints: [
          'How many rings were on the rod before anything moved?',
          'Take the rings that came off away from the rings that started there.',
        ],
        errorTags: ['procedure-slip', 'task-comprehension'],
      };
    },
  }),
  A17,
);

/**
 * B7 — the box, in the second addend slot only.
 *
 * The slot ROTATION is b07's own device and stays there; a warm-up replays a
 * settled skill and has no business teaching the half of it that makes it hard.
 * The whole is kept at eleven or more so the card is the same size as the
 * families the core pages use, and the two parts are never equal.
 */
const wBoxInTheTin = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'missing-addend-box',
    draw: (r) => {
      const f = drawFamily(r);
      const shown = r.chance(0.5) ? f.p : f.q;
      return {
        prompt: `A card in the fact tin reads ${fmtInt(shown)} + ▢ = ${fmtInt(f.w)}. What is the box hiding?`,
        answerValue: String(f.w - shown),
        templateId: 'd_sub_v1',
        params: { a: f.w, b: shown },
        hints: [
          'Which number on this card is the whole?',
          'Work out what the shown part still wants before it fills the whole.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  B7,
);

/**
 * B5 — the bridge across ten, which is what the adding half of a teen family
 * runs through. Drawn from the same family pool as everything else, so the sums
 * the warm-up rehearses are the sums the core pages need.
 */
const wOverTheTen = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'bridge-to-ten',
    draw: (r) => {
      const f = drawFamily(r);
      const name = one(r);
      return {
        prompt: `${name} drops ${countNoun(f.p, 'gooseberries')} into a bowl. Then ${fmtInt(f.q)} more go in. How many gooseberries are in the bowl?`,
        answerValue: String(f.w),
        templateId: 'retr_add_within_100_v1',
        params: { a: f.p, b: f.q },
        units: 'gooseberries',
        hints: [
          'Which of the two handfuls is closer to ten?',
          'Split the other handful so the first one reaches ten, then bring on the rest.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B5,
);

// ---------------------------------------------------------------------------
// DAY 1'S OPENING CLAIM — one card, two sides, three numbers
//
// The front carries a complete adding card and the back carries a take-away made
// from the same three numbers, with its result hidden. Nothing has to be counted:
// the back is missing exactly one of the three numbers the front printed, so the
// child who has understood the week says it straight out.
//
// That is why this page is on Days 1 and 2 and in NEITHER mastery form. A page
// solvable by elimination teaches the relationship and certifies nothing, and the
// header says so under §7 rather than leaving it to be discovered.
//
// Which part the back subtracts is drawn independently of the order the front
// prints its two addends, so "take the first number off" is not a rule.
// ---------------------------------------------------------------------------

const sitBackOfTheCard = situation({
  situationType: 'part-whole',
  cognitiveOp: 'read-the-other-side',
  draw: (r) => {
    const f = drawFamily(r);
    const [first, second] = r.chance(0.5) ? [f.p, f.q] : [f.q, f.p];
    const takenOff = r.chance(0.5) ? f.p : f.q;
    const kept = f.w - takenOff;
    return {
      prompt: `A card reads ${card(first, '+', second, f.w)} on the front. The back reads ${fmtInt(f.w)} ${MINUS} ${fmtInt(takenOff)}. What does the back make?`,
      answerValue: String(kept),
      templateId: 'd_sub_v1',
      params: { a: f.w, b: takenOff },
      hints: [
        'Do the two sides of this card use the same three numbers?',
        'One of the three numbers is not on the back yet. Name it.',
      ],
      errorTags: ['concept-misconception', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE FACT THE WEEK PAYS OUT — a take-away card standing on its own
//
// Nothing here can be got by elimination: the card prints two numbers and the
// third is nowhere on the page. The route is the family, and the hint ladder is
// where it is named, because a prompt that named it would answer the item.
//
// This is the fluency b14 nominates this week as the source of, which is why it
// appears in mastery and why every whole is a teen.
// ---------------------------------------------------------------------------

const sitPartnerTakeAway = situation({
  situationType: 'part-whole',
  cognitiveOp: 'partner-for-a-take-away',
  draw: (r) => {
    const f = drawFamily(r);
    const takenOff = r.chance(0.5) ? f.p : f.q;
    const name = one(r);
    return {
      prompt: `${name} draws a card out of the fact tin. It reads ${fmtInt(f.w)} ${MINUS} ${fmtInt(takenOff)}. Which number does the card make?`,
      answerValue: String(f.w - takenOff),
      templateId: 'd_sub_v1',
      params: { a: f.w, b: takenOff },
      hints: [
        'What are the three numbers of this card, and how many can you see?',
        'Ask which part joins the shown part to fill the whole.',
      ],
      errorTags: ['fact-recall', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE ROLES WITHHELD — the recipe's "build a family from 2 numbers"
//
// The one page where this week and B7 come within touching distance, and the
// difference is one sentence long: B7 always said which number was the whole.
// Here the page says either "both of these are parts" or "this one is the whole",
// drawn on a coin flip, so the child cannot know in advance whether the third
// number is reached by putting two together or by taking one off.
//
// `missingIsWhole` is drawn FIRST and the printed numbers are assigned to match,
// which is what makes the estimate-first probe a genuine coin flip rather than a
// coin flip that happened (L41). The arithmetic that follows is borrowed whole
// from B5 and B7 and is declared as borrowed in the header; the decision is what
// is new, and the decision is the item.
//
// THE TEMPLATE IS `d_multistep_rat_v1` WITH A CHAIN OF ONE, and that is a fix
// rather than a flourish. The two branches perform different operations, so the
// obvious pinning is `d_add_v1` on one and `d_sub_v1` on the other — and QG-4
// requires a mastery slot to carry the SAME templateId in Form A and Form B, so
// that pinning made the item unusable in mastery, which is the one place a
// rotation like this earns its keep. `d_multistep_rat_v1` is the library's op-CHAIN
// evaluator and a chain of one step is exactly what this page asks a child to do,
// so both branches ship honest operands under one id and QG-5 re-derives either.
// Nothing claims to be two-step: `situation()` stamps `stepCount: 1`.
// ---------------------------------------------------------------------------

const sitThirdNumber = situation({
  situationType: 'part-whole',
  cognitiveOp: 'name-the-third-number',
  draw: (r) => {
    const missingIsWhole = r.chance(0.5);
    const f = drawFamily(r);
    // The ladder is FIXED across both branches, which is a requirement rather
    // than a convenience: a ladder that changed with the draw would be
    // seed-variant and the dedup would throw on seeds the CI never ran (L19).
    // It is also the right pedagogy — rung 1 asks the question the page is
    // really about, and it asks it without naming either operation.
    const hints: [string, string] = [
      'Does this family already show you its whole?',
      'If the whole is showing, take a part off it. If not, put the two parts together.',
    ];
    if (missingIsWhole) {
      return {
        prompt: `Two numbers of a family are ${fmtInt(f.p)} and ${fmtInt(f.q)}. Both ${fmtInt(f.p)} and ${fmtInt(f.q)} are parts. What is the third number?`,
        answerValue: String(f.w),
        templateId: 'd_multistep_rat_v1',
        params: { initN: f.p, initD: 1, steps: [{ op: 'add', n: f.q, d: 1 }] },
        hints,
        errorTags: ['task-comprehension', 'concept-misconception'],
      };
    }
    const shown = r.chance(0.5) ? f.p : f.q;
    return {
      prompt: `Two numbers of a family are ${fmtInt(f.w)} and ${fmtInt(shown)}. The whole is ${fmtInt(f.w)}. What is the third number?`,
      answerValue: String(f.w - shown),
      templateId: 'd_multistep_rat_v1',
      params: { initN: f.w, initD: 1, steps: [{ op: 'sub', n: shown, d: 1 }] },
      hints,
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

/**
 * Six words, present tense, and a real fork in the road: a child who answers
 * "yes" has committed to putting the two parts together and a child who answers
 * "no" has committed to taking one off the whole. There is nothing left to
 * decide afterwards, which is what a commitment probe is for (L25).
 */
const predictThirdNumber = withEstimateFirst(sitThirdNumber, 'is the third number the whole?');

// ---------------------------------------------------------------------------
// THE RECIPE'S DISCRIMINATION — which card does not belong
//
// The family's whole and both parts are printed, so the page is not asking which
// number is the whole (that is B7's question and b24's). It is asking which of
// three sentences is not one of the four this triple makes.
//
// FOUR IMPOSTOR KINDS, one drawn per page, because two of them are FALSE and two
// are TRUE. If the odd card were always the false one, "check the arithmetic"
// would score every time — and checking arithmetic is last week's skill, not this
// week's. Rotating in two true-but-foreign cards forces the other question: are
// these the family's three numbers at all? Kind 3 is the sharpest, because it
// starts with the family's own whole and so survives the surface rule a child is
// most likely to invent. §7 of the header reports which route works on which
// kind, with shares.
//
// The two distractors are genuine members of the family, drawn as a pair so the
// page sometimes offers two adding cards, sometimes two take-aways and sometimes
// one of each — otherwise "the odd one out is the only take-away" would be a rule
// worth learning instead of the mathematics.
//
// NOT PINNED TO A VERIFY TEMPLATE, and §5 of the header proves why no honest pin
// exists for an item whose options are sentences. What replaces it is the
// assertion below, which recomputes the family's four cards and throws if the
// keyed card is one of them or if a distractor is not.
// ---------------------------------------------------------------------------

interface OddCard {
  text: string;
  errorTag: Tag;
  rationale: string;
}

/**
 * A card that does not belong to `f`, built by one of four named transforms of
 * the family's own numbers. Never a hand-written wrong value: the false cards
 * pass a result that is itself an expression in `p`, `q` and `w`, and the true
 * cards pass their own honest result over a stranger operand drawn from a pool
 * that excludes every number the family holds.
 */
const oddCardFor = (r: Rng, f: Family): OddCard => {
  const kind = r.int(0, 3);
  if (kind === 0) {
    // The recipe's own: the two parts subtracted, with the whole written as what
    // is left. All three numbers belong to the family, so a membership check
    // finds nothing and the arithmetic has to be done.
    return {
      text: card(f.q, MINUS, f.p, f.w),
      errorTag: 'concept-misconception',
      rationale: 'Takes the smaller part off the bigger one and writes the whole as what is left over. A whole is what the parts make, so it can never be what is left of one of them.',
    };
  }
  if (kind === 1) {
    // Starts correctly at the whole, counts back one step too few, and so lands
    // on a number the family does not hold.
    return {
      text: card(f.w, MINUS, f.p, f.q + 1),
      errorTag: 'procedure-slip',
      rationale: 'Starts at the whole and takes a part off, but counts back one step too few, so what is left is one too big and belongs to no family on this page.',
    };
  }
  if (kind === 2) {
    const strangers = [2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== f.p && v !== f.q && v !== f.q - f.p);
    // BUILT OFF THE BIGGER PART, AND PREFERRING A TEEN TOTAL. Built off the
    // smaller part it came out as "2 + 3 = 5" beside two teen cards, and "pick
    // the card with the small numbers" would have scored on every draw of this
    // kind. The bigger part is at least six on every legal pair, so the filter
    // can never empty; it is written as a two-tier pick rather than a loop so the
    // rng stream advances identically whichever tier wins (kit §E2.4).
    const teenSized = strangers.filter((v) => f.q + v >= 11);
    const stranger = r.pick(teenSized.length ? teenSized : strangers);
    return {
      text: card(f.q, '+', stranger, f.q + stranger),
      errorTag: 'task-comprehension',
      rationale: 'A true adding card that happens to hold one of the family\'s numbers. Sharing one number is not joining a family, which needs all three.',
    };
  }
  const strangers = [2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== f.p && v !== f.q && f.w - v >= 2);
  const stranger = r.pick(strangers);
  return {
    text: card(f.w, MINUS, stranger, f.w - stranger),
    errorTag: 'representation-misread',
    rationale: 'A true take-away card that opens with this family\'s whole, so it looks like a member. Its other two numbers are strangers, and a family is all three.',
  };
};

/** Why each of the four genuine cards DOES belong — the rationale for choosing it. */
const memberRationales: readonly { errorTag: Tag; rationale: string }[] = [
  {
    errorTag: 'concept-misconception',
    rationale: 'This card puts the two parts together, which is how the whole was made, so it is a member of the family.',
  },
  {
    errorTag: 'concept-misconception',
    rationale: 'This card adds the same two parts the other way round. A family allows both orders, so this one belongs.',
  },
  {
    errorTag: 'representation-misread',
    rationale: 'This card opens with the whole and takes one part off, leaving the other part. That is one of the family\'s take-aways.',
  },
  {
    errorTag: 'representation-misread',
    rationale: 'This card takes the other part off the whole. What is left is the first part, so the card belongs.',
  },
];

/** Which two of the four members are offered: two adds, two take-aways, or one of each. */
const MEMBER_PAIRINGS: ReadonlyArray<readonly [number, number]> = [
  [0, 2],
  [1, 3],
  [0, 1],
  [2, 3],
];

const discImpostor = discrimination({
  variant: 'structural',
  cognitiveOp: 'card-in-or-out-of-the-family',
  draw: (r) => {
    const f = drawFamily(r);
    const cards = familyCards(f);
    const odd = oddCardFor(r, f);
    const [i, j] = r.pick(MEMBER_PAIRINGS);
    // THE ASSERTION THAT STANDS IN FOR A VERIFY PIN (header §5). Recomputed from
    // the drawn pair, so a future edit to a transform that made an impostor
    // accidentally legal — or a member accidentally malformed — throws during
    // pack generation on every seed instead of shipping under a green gate.
    if (cards.includes(odd.text)) {
      throw new Error(`b08 discImpostor: the odd card "${odd.text}" is one of the family's own four cards`);
    }
    if (cards[i] === cards[j]) {
      throw new Error(`b08 discImpostor: the two offered members are the same card "${cards[i]}"`);
    }
    return {
      prompt: `One family has the whole ${fmtInt(f.w)} and the parts ${fmtInt(f.p)} and ${fmtInt(f.q)}. Which card does not belong to it?`,
      correct: odd.text,
      distractors: [
        { text: cards[i], errorTag: memberRationales[i].errorTag, rationale: memberRationales[i].rationale },
        { text: cards[j], errorTag: memberRationales[j].errorTag, rationale: memberRationales[j].rationale },
      ],
      hints: [
        'Which three numbers is this family allowed to use?',
        'Read each card twice: once for its numbers, once to check it is true.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE THINK-ADDITION LINK — which adding card is from the same family
//
// A take-away card is printed and the child has to name the adding card that
// belongs beside it. This is the page that makes the week pay out, because the
// adding card is the thing that answers the take-away.
//
// ALL THREE OPTIONS HOLD BOTH PRINTED NUMBERS, so none can be struck out on
// sight, and two of the three wrong cards land on the right whole. The three
// named wrong cards rotate two at a time, which matters for something no gate can
// see: with only "added both printed numbers" and "one step too many" on offer,
// the key would carry the smallest middle numeral on every draw. Adding "stopped
// one step short" lets that rank move, and on the third pairing every card ends
// on the whole so nothing survives but the fact.
//
// Drawn from `PART_PAIRS_APART`, whose two bounds were both put there by reading
// a generated page rather than by reasoning about one — see the pool's own note.
// The short version: a card reading "+ 1" is not a card anyone writes, and with
// the parts one apart the stopped-short card collapses into a doubles fact.
// ---------------------------------------------------------------------------


const discWhichAdditionHelps = discrimination({
  variant: 'structural',
  cognitiveOp: 'choose-the-adding-card',
  draw: (r) => {
    const f = drawFamily(r, FAMILIES_APART);
    const takenOff = r.chance(0.5) ? f.p : f.q;
    const other = f.w - takenOff;
    const right = card(takenOff, '+', other, f.w);
    // FOUR NAMED WRONG CARDS, and the fourth is here for a measurement rather
    // than for variety. The middle numeral of `addedBoth` and of `oneOver` both
    // sit ABOVE the key's, and `oneShort`'s sits below — so with three cards the
    // key's middle numeral was the smallest of the three on a third of draws and
    // the middle one on the other two thirds, and never the biggest. That is
    // L43's shape one layer down: not a rank among the options, which are
    // equations and which the entropy gate correctly finds nothing in, but a rank
    // inside them. `mistakenPartner` is a second card BELOW the key, which is what
    // lets a pairing put the key at the top.
    const wrong: readonly OddCard[] = [
      {
        text: card(takenOff, '+', f.w, takenOff + f.w),
        errorTag: 'task-comprehension',
        rationale: 'Adds the two numbers printed on the take-away card, which treats the whole as though it were a part. The sum runs past the whole instead of reaching it.',
      },
      {
        text: card(takenOff, '+', other + 1, f.w),
        errorTag: 'procedure-slip',
        rationale: 'Counts on from the shown part but takes one step too many, so the card claims a total it does not make.',
      },
      {
        text: card(takenOff, '+', other - 1, f.w),
        errorTag: 'procedure-slip',
        rationale: 'Counts on from the shown part and stops one step short, so the card claims a total it falls below.',
      },
      {
        text: card(takenOff, '+', other - 2, f.w),
        errorTag: 'fact-recall',
        rationale: 'Reaches for a remembered partner that is near the right one but not it, so the card is written down without the total ever being checked.',
      },
      {
        text: card(takenOff, '+', other - 1, f.w - 1),
        errorTag: 'concept-misconception',
        rationale: 'A true adding card holding the shown part, but its total stops one below the whole, so the three numbers on it are a different family\'s.',
      },
    ];
    // WHICH TWO ARE OFFERED, AND WHY THE THIRD PAIRING EXISTS. `addedBoth` and the
    // last card are the only two wrong cards whose arithmetic is TRUE, and the
    // first is the only one whose middle numeral sits above the key's. Pairing
    // them one way or the other therefore trades two shortcuts against each other,
    // so all three pairings were measured rather than reasoned about:
    //   [0,1] the key's middle numeral is the smallest of the three; two cards are
    //         true, so "pick the true one" fails;
    //   [1,2] the key's is the middle one, and it is the only true card;
    //   [3,4] the key's is the biggest, and two cards are true.
    // On every one of them at least two cards END on the whole, so "pick the card
    // that lands on the number in the question" is never unique.
    //
    // The third needs two cards below the key, which the mistaken partner cannot
    // supply if it would fall under two or land on the shown part itself. On those
    // draws it falls back to a pairing that puts the key in the middle — a
    // deterministic swap that takes no rng draw (§E2.4).
    const canGoLow = other - 2 >= 2 && other - 2 !== takenOff;
    const pairings: ReadonlyArray<readonly [number, number]> = [
      [0, 1],
      [1, 2],
      canGoLow ? [3, 4] : [0, 2],
    ];
    const [i, j] = r.pick(pairings);
    // The construction-time assertion, again standing in for a pin (header §5):
    // the key must be one of the family's own cards and neither offered wrong
    // card may be.
    const cards = familyCards(f);
    if (!cards.includes(right)) {
      throw new Error(`b08 discWhichAdditionHelps: the keyed card "${right}" is not one of the family's four`);
    }
    if (cards.includes(wrong[i].text) || cards.includes(wrong[j].text)) {
      throw new Error(`b08 discWhichAdditionHelps: a wrong card is a genuine member of the family`);
    }
    return {
      prompt: `${one(r)} must work out ${fmtInt(f.w)} ${MINUS} ${fmtInt(takenOff)}. Which adding card is from the same family?`,
      correct: right,
      distractors: [
        { text: wrong[i].text, errorTag: wrong[i].errorTag, rationale: wrong[i].rationale },
        { text: wrong[j].text, errorTag: wrong[j].errorTag, rationale: wrong[j].rationale },
      ],
      hints: [
        'Which number on the take-away card is the whole?',
        'Find the part that joins the shown part to fill that whole.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// The chains — the §4 row's "family then a new fact", two ways
//
// Both are two-step by construction and both make the FAMILY the thing being
// carried from step to step, which is what stops them being one-step arithmetic
// with a name attached. `msSharedWhole` finishes one family and hands its whole
// to a second; `msNewWhole` runs the other way, recovering a part from a family
// and then building a different whole out of it. Neither answer is printed
// anywhere on its page.
//
// Both draw from precomputed triples rather than filtering after the fact, so a
// single `r.pick` satisfies every constraint at every seed with no redraw loop
// (kit §E2.4). Building the tables also settled a question that a filter would
// have hidden: for the largest families there is NO second part that keeps both
// wholes in range, so a naive filter would have run dry at the top of the pool.
// ---------------------------------------------------------------------------

/**
 * `[p, q, second]` — two parts making a whole, and a part of a second family that
 * shares that whole. The second family's other part is never one of the three
 * printed numbers, so the answer cannot be copied off the page, and never equal
 * to the part it sits beside, which would make the second family a doubles fact.
 */
const SHARED_WHOLE_TRIPLES: ReadonlyArray<readonly [number, number, number]> = sized(
  'SHARED_WHOLE_TRIPLES',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (const [p, q] of PART_PAIRS) {
      const w = p + q;
      for (let second = 2; second <= 9; second++) {
        if (second === p || second === q) continue;
        const rest = w - second;
        if (rest < 2 || rest > 9) continue;
        if (rest === second || rest === p || rest === q) continue;
        out.push([p, q, second] as const);
      }
    }
    return out;
  })(),
  20,
);

const msSharedWhole = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'two-families-one-whole',
  draw: (r) => {
    const [p, q, second] = r.pick(SHARED_WHOLE_TRIPLES);
    return {
      prompt: `The parts ${fmtInt(p)} and ${fmtInt(q)} make a whole. A second family has that whole and the part ${fmtInt(second)}. What is the second family's other part?`,
      initN: p,
      steps: [
        { op: 'add', n: q, d: 1 },
        { op: 'sub', n: second, d: 1 },
      ],
      hints: [
        'Which of the two families can you finish first?',
        'Build the shared whole, then take the second family\'s part off it.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

/**
 * `[whole, shown, joins]` — a family stated as a whole and one part, and a
 * further part for its other part to join. The new whole is kept inside eleven to
 * eighteen so the second step is still a teen fact, and it is never the old
 * whole, which would make the page a circle.
 */
const NEW_WHOLE_TRIPLES: ReadonlyArray<readonly [number, number, number]> = sized(
  'NEW_WHOLE_TRIPLES',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (const [p, q] of PART_PAIRS) {
      const w = p + q;
      for (const shown of [p, q]) {
        const rest = w - shown;
        for (let joins = 2; joins <= 9; joins++) {
          if (joins === rest || joins === shown) continue;
          const fresh = rest + joins;
          if (fresh < 11 || fresh > 18 || fresh === w) continue;
          out.push([w, shown, joins] as const);
        }
      }
    }
    return out;
  })(),
  20,
);

const msNewWhole = multiStep({
  situationType: 'combine',
  cognitiveOp: 'a-part-into-a-new-whole',
  draw: (r) => {
    const [whole, shown, joins] = r.pick(NEW_WHOLE_TRIPLES);
    return {
      prompt: `A family has the whole ${fmtInt(whole)} and the part ${fmtInt(shown)}. Its other part joins with a part of ${fmtInt(joins)}. What whole do those two make?`,
      initN: whole,
      steps: [
        { op: 'sub', n: shown, d: 1 },
        { op: 'add', n: joins, d: 1 },
      ],
      hints: [
        'Which of this family\'s three numbers has nobody written down?',
        'Find the part that is missing, then join it to the new one.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, first page — the wrong card, generated rather than written down
//
// One operand pair and two operations: the family's two parts under `-` give the
// honest value of the sentence as written, and the same pair under `+` gives the
// whole — which is the number the child put on the right of a take-away. Neither
// number is chosen by an author and QG-11 recomputes both from the shipped params.
//
// The page performs the slip rather than announcing it: three numbers, a card,
// and a child who has written it. Naming the mistake is the child's answer, so it
// cannot also be the question (L25).
// ---------------------------------------------------------------------------

const eaCardOutOfOrder = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const [p, q] = r.pick(FAMILIES);
    return { a: q, b: p, op: '-', wrongOp: '+' };
  },
  build: (v, p, r) => {
    const bigPart = numOf(p, 'a');
    const smallPart = numOf(p, 'b');
    const whole = Number(v.wrong);
    const name = one(r);
    return {
      prompt: `${name} is writing the cards for the family ${fmtInt(smallPart)}, ${fmtInt(bigPart)} and ${fmtInt(whole)}. ${name} writes the card ${card(bigPart, MINUS, smallPart, whole)}.`,
      extension: 'Write the two take-away cards this family really makes. Then write one sentence about which number has to come first.',
      hints: [
        'Which of these three numbers is the whole of the family?',
        'Read the card on its own and work out what its two numbers really make.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: [
        'a take-away card in a family always opens with the whole',
        'the two parts have to be put together to reach the whole, not taken apart',
        'a part is smaller than the whole, so no part can be left over as the whole',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, second page — the §4 signature: build the family from two numbers
//
// Written by hand and pinned to one pair on purpose. What is being marked is the
// child's own four cards, and a roomful of children can only be compared if the
// pair they all started from was the same pair.
//
// The last question is the one that carries the week: both take-away cards open
// with the same number, and saying WHY is the difference between having learnt
// four cards and having understood one family.
// ---------------------------------------------------------------------------

const reasoningBuildTheFamily = reasoning({
  prompt:
    'The two parts of a family are 6 and 9. Write the whole. Then write all four of the family\'s cards. Both take-away cards open with the same number: say why they have to.',
  value:
    'the whole is 15; the four cards are 6 + 9 = 15, 9 + 6 = 15, 15 − 6 = 9 and 15 − 9 = 6; both take-aways open with 15 because only the whole has parts inside it to take away',
  hints: [
    'Which of a family\'s three numbers is always the biggest?',
    'Try opening a take-away card with a part and see how far you get.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The week's rule handed to the child to settle rather than announced.
 *
 * "Always" is the honest answer and it is provable at this age: a family's two
 * take-away cards are the whole less each part, and any sentence that opens with
 * a part and uses the family's numbers is false. Both wrong options are positions
 * children actually hold — "sometimes" belongs to the child who has learnt the
 * four cards as four separate things, and "never" to the child who reads a
 * take-away as something that happens to parts.
 */
const asnWholeOpensIt = classify({
  prompt:
    'Always, sometimes or never true? A family\'s take-away card opens with the whole. Then write one sentence saying how you know.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale: 'Holds the four cards as four separate facts, so which number opens a take-away looks like something that varies from card to card.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Reads a take-away as something done to the parts, so the whole is expected on the far side of the equals sign rather than at the front.',
    },
  ],
  hints: [
    'Could a family\'s take-away card ever open with one of the parts?',
    'Write a family\'s four cards out and look at where its biggest number sits.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB08 = makeWeekBuilder({
  level: 'B',
  week: 8,
  conceptId: 'fact-families-add-sub',
  conceptName: 'Fact families',
  // The catalog row for this cell carries this strand alone; FILL-ARCHITECTURE §4
  // also counts B8 among the on-thread algebra weeks. The catalog is the cell's
  // source of truth and bb-verify-packs reads it, so the catalog wins (header §9).
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [A17, A23, B5, B7],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the part-part-whole triangle',
  conceptFamily: 'operation',
  deepeningDelta:
    'The part-whole thread runs back a long way. Partners of five and of ten came first, then the frame that still had room in it, then B7, which let the whole reach twenty, gave the unknown a written home and named a way to it. What every one of those weeks has in common is the shape of the question: one number is absent and the page wants it found. B8 changes what is being asked rather than how big the numbers are. Nothing is missing on most of these pages: the three numbers are all printed and the question is which of the sentences they could make is really one of theirs. That turns a method into a relationship, and it pays out twice. A take-away inside twenty stops needing a method at all, because the adding card beside it already holds the answer, which is the fluency B14 draws on. And the roles stop being given: B7 always said which number was the whole, while B8 hands over two numbers and makes naming their roles the work. C10 then rebuilds the whole idea on multiplying and sharing, where the missing corner needs an operation nobody here has met.',
  explanation: {
    hook:
      'Learn one fact and three more come free. The same three numbers write four different cards.',
    whyBeforeHow:
      'Two parts and the whole they make are not three separate numbers that happen to get on well. They are one relationship, and that is why the part-part-whole triangle is the picture this week is built on: the whole sits in the top corner, the two parts sit in the corners below it, and the three of them cannot be rearranged without breaking the relationship. Because there is only one relationship, there is really only one fact — and the four cards a child writes are four ways of saying it out loud, not four things to remember. Two consequences run through every page here. The first is about adding. Six and nine make fifteen, and nine and six make fifteen, because the two parts sit side by side and neither of them is first; a child who has to rebuild the second sum from scratch has not yet seen that it is the same sum. The second is about taking away, and it is the one that pays. A take-away card can only ever open with the whole, since the whole is the only one of the three numbers that has parts inside it to remove. So fifteen take away six is not a journey backwards at all: it is a question about a partner, and the partner is already written on the adding card. That is what makes this week worth a week. A child who owns one family owns every take-away inside twenty that the family covers, without counting back once. What has to be guarded against is the opposite habit, which is real and common: a child who has met the three numbers and not the relationship writes any sentence those numbers will fit into, including five take away four makes nine. The repair is not arithmetic. It is asking which of the three numbers is the whole before a single sign is written down.',
    script: [
      {
        say: 'Here are three numbers: 4, 9 and 13. The parts are 4 and 9. The whole is 13.',
        visual: 'The whole of 13 as one bar, and below it the same length broken into 4 and 9.',
        figure: familyBars(4, 9),
      },
      {
        // NAMED, AND DRAWN BY THE ADULT RATHER THAN BY THE APP. There is no
        // triangle primitive (header §6), so this segment carries a direction
        // instead of a figure — which is the honest form, because a fact triangle
        // is a thing a teacher draws on paper while talking.
        say: 'The triangle holds them. The whole goes in the top corner. The two parts go below.',
        visual: 'Draw a triangle on paper: 13 in the top corner, 4 and 9 in the two corners below.',
      },
      {
        say: 'Read the parts side by side. 4 + 9 = 13. Turn them round. 9 + 4 = 13.',
      },
      {
        say: 'Now open with the whole. 13 − 4 = 9. And 13 − 9 = 4. Four cards, one family.',
        visual: 'The same bar again, with the whole above and its two parts below it.',
        figure: familyBars(4, 9),
      },
      {
        say: 'One habit before I stop. I check a take-away card by adding the two parts back.',
      },
    ],
    summary:
      'A family is two parts and the whole they make. It writes four cards: two adding and two taking away. Every take-away card opens with the whole.',
    vocabulary: [
      { term: 'fact family', kidGloss: 'three numbers that belong together — two parts and the whole they make' },
      { term: 'fact triangle', kidGloss: 'the family drawn in three corners, with the whole on top and the parts below' },
      { term: 'related fact', kidGloss: 'another card written from the very same three numbers' },
      { term: 'take-away card', kidGloss: 'a card with a take-away on it, which always starts from the whole' },
    ],
  },
  guidedExamples: [
    {
      ...ge(8, 1, 'modeled', 'The two parts of a family are 4 and 9. What four cards does the family write?', [
        {
          teacherSay:
            'Watch me. I put the two parts together first, because that hands me the third number.',
        },
        {
          teacherSay: 'So the whole is 13. Now I have two adding cards and two take-aways. Which number opens the take-aways?',
          expected: '13',
        },
      ], '4 + 9 = 13, 9 + 4 = 13, 13 − 4 = 9, 13 − 9 = 4'),
      // Drawn in full, and only here and in the script: all four cards are printed
      // beside it, so the picture hands over nothing (kit §E2.5).
      visual: 'The whole of 13 as one bar, and below it the same length broken into 4 and 9.',
      figure: familyBars(4, 9),
    },
    {
      ...ge(8, 2, 'completion', 'A card reads 7 + 8 = 15. Write the same family\'s two take-away cards.', [
        { teacherSay: 'Which of these three numbers is the whole?', expected: '15' },
        { childDo: 'Open each take-away card with the whole and take one part off.', expected: '15 − 7 = 8 and 15 − 8 = 7' },
      ], '15 − 7 = 8 and 15 − 8 = 7'),
      visual: 'The whole of 15 as one bar, and below it the same length broken into 7 and 8.',
      figure: familyBars(7, 8),
    },
    {
      ...ge(8, 3, 'prompted', 'Two numbers of a family are 16 and 9. The whole is 16. What is the third number?', [
        { childDo: 'Say which number is missing, then check by adding the two parts.', expected: '7' },
      ], '7'),
      // The fade: nothing is drawn from here on, because on an assessed page a
      // family bar says which number is the whole and that is the question.
      visual: 'Nothing drawn — the two numbers are only words on this page.',
    },
    {
      ...ge(8, 4, 'independent', 'A card reads 14 − 6. Which number does the card make?', [
        { childDo: 'Work it out on your own, then check by adding your answer to 6.', expected: '8' },
      ], '8'),
      visual: 'No picture here either — the family is held in the head.',
    },
  ],
  days: [
    // Day 1 — concept echo. The first family a child ever met, then a card with
    // two sides, a card standing alone, the adding card that answers it, and one
    // gentle chain in which a whole is handed from one family to another.
    [
      { gen: wTenAndSome, diff: 2 },
      { gen: sitBackOfTheCard, diff: 2 },
      { gen: sitPartnerTakeAway, diff: 2 },
      { gen: discWhichAdditionHelps, diff: 3 },
      { gen: msSharedWhole, diff: 3 },
    ],
    // Day 2 — fluency and application: the sort, then something to commit to
    // before any working, then the two card pages at a step up.
    [
      { gen: wRingsOnARod, diff: 2 },
      { gen: discImpostor, diff: 3 },
      { gen: predictThirdNumber, diff: 4 },
      { gen: sitBackOfTheCard, diff: 3 },
      { gen: sitPartnerTakeAway, diff: 3 },
    ],
    // Day 3 — the sort, the prediction and a chain share a spread, so three quite
    // different questions arrive wearing the same equations and a page's look
    // stops telling the child what kind of thinking it wants.
    [
      { gen: wBoxInTheTin, diff: 2 },
      { gen: wOverTheTen, diff: 2 },
      { gen: discImpostor, diff: 3 },
      { gen: predictThirdNumber, diff: 4 },
      { gen: msNewWhole, diff: 4 },
    ],
    // Day 4 — the chains, one carrying a whole forward and one recovering a part
    // and building something new out of it, with the adding-card choice beside
    // them so the day is not two runs of the same machinery.
    [
      { gen: wBoxInTheTin, diff: 3 },
      { gen: msSharedWhole, diff: 4 },
      { gen: msNewWhole, diff: 4 },
      { gen: discWhichAdditionHelps, diff: 3 },
    ],
    // Day 5 — a card taken apart, a family built from two numbers, and the
    // week's rule finally argued over.
    [
      { gen: wTenAndSome, diff: 2 },
      { gen: eaCardOutOfOrder, diff: 4 },
      { gen: reasoningBuildTheFamily, diff: 3 },
      { gen: asnWholeOpensIt, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the whole of this week is one question, and it is worth asking it out loud until it is boring. Which of these three numbers is the whole? Write 6, 9 and 15 on a scrap of paper and ask your child for every sentence those three can make. Four is the right answer, and the ones they miss tell you what to do next. If the two adding cards come and the take-aways do not, they have the idea and need the habit — say "and now open with fifteen" and let them finish it. If they offer something like 9 − 6 = 15, do not correct the arithmetic, because the arithmetic is not the problem: ask which number is the whole, and then ask whether a part can have the whole left over inside it. That question does the work by itself. The payoff to listen for arrives a few days in. Ask what 15 − 6 makes, and if you hear a pause and then "nine, because six and nine make fifteen", the week has landed — they are answering a take-away by remembering an addition, which is faster than counting back and far more reliable. A saucer over one of two heaps of buttons is all the equipment this needs.',
  ],
  puzzle: (r) => {
    // FOUR CARDS AND A FAMILY HIDING AMONG THEM — a search, which is a move no
    // daily page makes. Every core page here is handed a family and asked
    // something about it; this page is handed no family at all and has to find
    // one, by trying pairs of cards and looking for their total on a third.
    //
    // The stranger card sits ABOVE the whole on half the draws and below it on
    // the other half, so neither "pick the biggest" nor "pick the second biggest"
    // is worth learning; `strangerIsBigger` is drawn first so that split is a
    // construction rather than a hope.
    //
    // No picture: drawing the four cards with the family ringed IS the puzzle.
    const f = drawFamily(r);
    const strangerIsBigger = r.chance(0.5);
    // Every number that would make a SECOND family possible among the four, so
    // the page has one answer rather than two. Excluded: the family's own three
    // numbers; the difference of the two parts (which would pair with the smaller
    // part to reach the bigger); and either part added to the whole.
    const banned = new Set([f.p, f.q, f.w, f.q - f.p, f.p + f.w, f.q + f.w]);
    const pool: number[] = [];
    if (strangerIsBigger) {
      for (let v = f.w + 1; v <= 18; v++) if (!banned.has(v)) pool.push(v);
    } else {
      for (let v = 2; v < f.w; v++) if (!banned.has(v)) pool.push(v);
    }
    if (pool.length === 0) {
      throw new Error(`b08 puzzle: no stranger card is available beside the family ${f.p}/${f.q}/${f.w}`);
    }
    const stranger = r.pick(pool);
    const cards = r.shuffle([f.p, f.q, f.w, stranger]);
    // THE ANSWER IS UNIQUE, PROVED BY COUNTING RATHER THAN BY ARGUING. Every pair
    // of the four cards is added and looked for among the four; exactly one such
    // sum may land. The exclusions above are what makes that true, and this is
    // what proves they are complete on every draw.
    let familiesFound = 0;
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        if (cards.includes(cards[i] + cards[j])) familiesFound++;
      }
    }
    if (familiesFound !== 1) {
      throw new Error(`b08 puzzle: ${familiesFound} families among ${cards.join(', ')} — the page must hold exactly one`);
    }
    const printed = `${fmtInt(cards[0])}, ${fmtInt(cards[1])}, ${fmtInt(cards[2])} and ${fmtInt(cards[3])}`;
    return {
      id: 'B8-PZ-01',
      title: 'Puzzle Grove: The Family in the Heap',
      puzzleType: 'logic',
      prompt: `Four cards lie face up: ${printed}. Three of them make one family. Which card is the whole?`,
      answer: {
        value: String(f.w),
        acceptableForms: [],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which two of these cards could be the two parts?',
        'Put two cards together and hunt for their total on a third card.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // A core page is given the family and asked about it. This page is given four
  // loose cards and has to find the family, which means trying pairs and testing
  // each total against what is on the table. Nothing on Day 1 searches.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'hunt-the-family' },
  // DD11 wants a source settled at least two weeks earlier, and the harder part
  // is choosing a fluency this week genuinely leans on. Every family here has a
  // teen whole, so every adding card crosses ten. A child still assembling those
  // sums spends the page on the crossing and never reaches the question of which
  // card belongs.
  sprint: {
    skill: 'Sums that land in the teens — the adding card every family here is built on',
    sourceWeek: B5,
    itemCount: 18,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 2, max: 9, sumMin: 11, sumMax: 18 },
  },
  mastery: [
    { gen: sitPartnerTakeAway, diff: 3 },
    { gen: sitThirdNumber, diff: 3 },
    { gen: discImpostor, diff: 3 },
    { gen: discWhichAdditionHelps, diff: 3 },
    { gen: msSharedWhole, diff: 4 },
    { gen: msNewWhole, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: a take-away card standing alone, with a fresh family and either part taken off. 02: two of a family\'s numbers with their roles stated, and no probe in front of it — the daily pages put the prediction there and a certificate must not, since the prediction IS what is being certified; the third number is the whole on one form and a part on the other. 03: the odd-card sort, with the impostor kind drawn fresh per form and the pair of genuine members rotated, so neither form can be passed by remembering whether the odd card was the false one. 04: the adding-card choice, with the pair of wrong cards rotated so the key does not sit at the same rank on both forms. 05: the shared-whole chain, with both families fresh. 06: the part-into-a-new-whole chain, with a fresh starting family and a fresh partner. Two generators are deliberately ABSENT from both forms: the two-sided card, which is solvable by elimination and belongs on a teaching page, and the Day-5 pages, which want a written argument rather than a key. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'take-away-does-not-open-with-the-whole',
      description:
        'Treats the three numbers of a family as free to be arranged any way a sentence will take, so a take-away is written opening with a part and the whole is left standing on the far side of the equals sign.',
      exampleWrongAnswer: '5 − 4 = 9 offered as a card of the family 4, 5 and 9',
      distractorRationale:
        'Offer it as the odd card on the family sort, where all three of its numbers belong to the family so only the arithmetic gives it away, and show it worked on the Day-5 error analysis, where the operation swap generates it.',
      reteachPointer: 'explanation/script[3] (open with the whole — 13 take away 4, and 13 take away 9)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'adds-the-two-printed-numbers',
      description:
        'Reads a take-away card as one more adding page and puts its two printed numbers together, which treats the whole as though it were a part and lands well past the whole.',
      exampleWrongAnswer: '6 + 15 = 21 chosen as the adding card belonging to 15 − 6',
      distractorRationale:
        'Offer it on the adding-card choice, where its arithmetic is true and only its family is wrong, so a child cannot reject it by checking the sum.',
      reteachPointer: 'guidedExamples/B8-GE-02 (which of these three numbers is the whole?)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'one-step-out-in-the-count',
      description:
        'Has the right family and the right move but arrives one number out, either by counting back one step too few from the whole or by stopping one step short on the way up to it.',
      exampleWrongAnswer: '13 − 4 = 10 written as a card of the family 4, 9 and 13',
      distractorRationale:
        'Offer it as an odd card whose stray number is next door to a real one, and on the adding-card choice offer both the step too many and the step too short, so the key is not always the middle of what is on offer.',
      reteachPointer: 'explanation/script[4] (check a take-away card by adding the two parts back)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'one-shared-number-counts-as-membership',
      description:
        'Accepts any true sentence that holds one of the family\'s numbers as a member of it, so a card that merely opens with the whole, or merely uses a part, is read as belonging.',
      exampleWrongAnswer: '13 − 5 = 8 accepted into the family 4, 9 and 13 because it opens with 13',
      distractorRationale:
        'Offer two true-but-foreign cards on the family sort — one adding card holding a part and one take-away card opening with the whole — so surface resemblance has to be tested against all three numbers.',
      reteachPointer: 'explanation/vocabulary (fact family — three numbers that belong together)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'teen-sums-not-yet-quick',
      description:
        'Rebuilds every crossing-of-ten sum from scratch, which is correct and slow, and leaves nothing spare for the question of which card a family actually writes.',
      exampleWrongAnswer: 'six and nine counted up one at a time on every page of the week',
      distractorRationale:
        'Offer a remembered partner that sits near the right one on the adding-card choice — the card a child writes when the sum is reached for rather than worked out. A slow-but-correct sum needs no distractor and is met by the Day-3 sprint instead.',
      reteachPointer: 'guidedExamples/B8-GE-04 (check by adding your answer back to the part)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Fact families — how two parts and the whole they make write four different cards between them, and why a take-away card always opens with the whole. The payoff we were after all week is that a take-away inside twenty can be answered by remembering the adding card beside it, instead of counting backwards.',
    improvingCandidates: [
      'saying which of a family\'s three numbers is the whole before any sign is written',
      'answering a take-away card by naming the adding card that belongs beside it',
      'testing a card against all three of a family\'s numbers rather than one of them',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'opening every take-away card with the whole, because only a whole has parts inside it to remove',
      },
      {
        errorTag: 'task-comprehension',
        text: 'reading a take-away card as a question about a partner rather than as one more sum to add up',
      },
      {
        errorTag: 'representation-misread',
        text: 'checking all three numbers before letting a card into a family, not just the one it shares',
      },
      {
        errorTag: 'fact-recall',
        text: 'getting the sums that cross ten to arrive without effort, which is what the Day-3 sprint is for',
      },
    ],
    homeFocus: {
      praiseLine:
        'You noticed that both take-away cards had to start with the whole, and then you checked one by putting the parts back together.',
      questionForChild: 'Which of these three numbers is the whole — and how many cards can the three of them write?',
      schoolSyncHook:
        'School may call these number bonds, related facts or a fact triangle, and may draw them as a triangle where we lay them out as cards. The three numbers underneath are the same, so use whichever words come home.',
    },
    vocabularyForParent: [
      'fact family (a whole, its two parts, and the cards those three numbers are allowed to write)',
      'related fact (another card written from the very same three numbers)',
      'take-away card (a take-away written down; in a family it always opens with the whole)',
    ],
  },
});
