/**
 * Level B · Week 9 — "Story problems within 20" (conceptId: story-problems-within-20).
 *
 * FILL-ARCHITECTURE §4 row B9: anchor "situation frames"; multi-step
 * "join-then-take chains"; error-analysis "answers the wrong question asked";
 * discrimination "'3 more than' comparison ≠ add-3-to-answer"; Day-5 signature
 * "write-your-own story (keyword)". Catalog cell: computational focus
 * "Result-unknown and change-unknown join/separate problems"; non-computational
 * focus "Write-your-own story problem for a given number sentence".
 *
 * ── 1. THE IDEA ─────────────────────────────────────────────────────────────
 *
 * Eight weeks of Level B have handed a child an arithmetic job already written
 * down. This week hands over English and asks them to find the job inside it,
 * which is a different skill and a much less reliable one. The pages are
 * deliberately easy to compute and hard to read: every sum here sits inside
 * twenty and most of them were fluent by B5, so nothing a child gets wrong on
 * these pages will be arithmetic.
 *
 * The idea that makes the reading tractable is a shape rather than a rule:
 *
 *     A STORY ABOUT A LOT OF THINGS HAS THREE PARTS — WHAT THERE WAS, WHAT
 *     HAPPENED, AND WHAT THERE IS NOW. TWO OF THE THREE ARE PRINTED. THE
 *     QUESTION WANTS THE THIRD.
 *
 * That sentence is the week. It converts "what do I do?" — a question a
 * six-year-old cannot answer by staring harder — into "which of the three is
 * missing?", which they can answer by reading twice. And it explains why the
 * same three numbers can want an addition on one page and a take-away on the
 * next without anything having lied to them: a story that joins still needs a
 * count UP when the part it withholds is the join itself.
 *
 * ── 2. WHAT B9 OWNS, USES, AND HANDS ON ─────────────────────────────────────
 *
 * Four neighbours point at this cell from inside their own files, and what a
 * neighbour has told its reader about this week is a debt this week owes them
 * (kit §E2.8). Every one of the four is quoted, because a paraphrase of a debt is
 * not the debt.
 *
 * OWNED — introduced here, assessed here, assumed nowhere earlier:
 *
 *   (a) STORY PROBLEMS WITHIN TWENTY, WHICH ALL FOUR NEIGHBOURS SAY IS THIS
 *       WEEK'S. b04: "**B9 owns story problems within 20** and **B15 owns
 *       comparison stories.**" b07: "B9 HAS STORY PROBLEMS AND B15 HAS
 *       COMPARISON." b08: "B9 HAS STORY PROBLEMS WITHIN TWENTY. This is a
 *       notation week by the catalog's own description of it… There is not one
 *       join-or-separate narrative here." b24: "**B9 owns story problems within
 *       20**". So the join-or-separate narrative b08 left out is here, six ways:
 *       two lots standing still, a lot that grows, a lot that shrinks, a lot
 *       whose change is the missing part, a lot changed twice, and a lot two
 *       people fill between them.
 *   (b) THE THREE-PART FRAME AS A NAMED OBJECT. It is glossed in
 *       `explanation.vocabulary` as "story frame", walked round in the script,
 *       and it is the thing Day 5 asks the child to produce rather than read.
 *   (c) CHANGE-UNKNOWN. The catalog names it outright ("Result-unknown and
 *       change-unknown join/separate problems"), and it is the week's real
 *       difficulty: the two printed numbers are the beginning and the end, and
 *       the answer is the distance between them. `sitChangeUnknown` is the page;
 *       `eaWrongMove` is the same page with a child's working on it.
 *   (d) THE TRAP: A PHRASE CAN NAME AN AMOUNT THAT IS NOWHERE ON THE PAGE.
 *       b24 states it in as many words — "its own trap ('3 more than' is not
 *       add-3-to-the-answer)" — and §3 below draws the line against b24's own
 *       trap, because the two are close enough to be confused and the confusion
 *       would cost b24 its subject.
 *   (e) WRITING A STORY FOR A NUMBER SENTENCE, the catalog's non-computational
 *       focus and the Day-5 signature.
 *
 * LEANED ON HERE, TAUGHT SOMEWHERE ELSE, AND CREDITED TO WHOEVER TAUGHT IT:
 *
 *   · B5'S BRIDGE. Every join on these pages crosses ten, so a child still
 *     assembling 8 + 5 spends the page on the sum and never reaches the reading.
 *     It is the first warm-up and it is the sprint.
 *   · B7'S THINK-ADDITION. The method for change-unknown is B7's, whole: stand
 *     on the count you can see and walk up to the one you cannot. b07 owns it —
 *     "THINK-ADDITION, by name and by habit" — so no page here teaches it and
 *     every rung-2 that needs it borrows it by name. The box `▢` appears once,
 *     in B7's own warm-up, and never on a core page.
 *   · B8'S RELATED FACT. A shrinking story ends in a take-away inside twenty,
 *     which b08 declares is its own and b14's ("the take-away FACT within twenty
 *     is this week's"). Third warm-up; nothing here is a fact-family page.
 *   · A16/A17'S `+`, `−` AND `=`. The three symbols a written number sentence
 *     needs, all introduced at band A.
 *
 * HANDED ON — owned by a week that already has it, so absent here:
 *
 *   1. B15 HAS COMPARISON, AND IT HAS ALL OF IT. b15's own header describes
 *      the split it is relying on: "B9 taught stories where something happens: a
 *      pile grows or shrinks, and the child follows the change. B15 hands them
 *      stories where NOTHING happens — two piles simply sit there being
 *      different sizes — and the whole question is which of two things the
 *      sentence wants." Both halves are kept. No page here asks HOW MANY MORE,
 *      no page asks for a difference between two lots, no page states two lots
 *      and asks which is bigger, and no comparison bar model exists in this file.
 *      Where a "more than" phrase appears it measures ONE CHANGE against
 *      ANOTHER CHANGE or against a lot's own count — it never sits between two
 *      standing piles, and it is always a given rather than a question. b15 also
 *      says what it wants from this week: "B9 (story problems within 20 — where
 *      'more' marks a CHANGE and really does add, which is half the evidence
 *      this week weighs)". That is exactly what "more" does here, on every page
 *      it appears on, with no counter-example anywhere — because the
 *      counter-example is B15's, and handing it over early would spend B15's
 *      week for it.
 *   2. B7 HAS THE MISSING PART OF A STATED WHOLE, AND THE BOX. `sitAltogether`
 *      only ever runs one way — two parts stated, the whole wanted. Reverse it
 *      and you have B7's page exactly, so no item anywhere in the daily core
 *      names a whole, names one part of it, and asks for the rest. Change-unknown looks neighbouring and is not the same page — B7's
 *      two numbers are a whole and a piece of it, standing still; these two are
 *      the same lot at two different moments, and which is bigger depends on
 *      what happened in between.
 *   3. B8 HAS FACT FAMILIES. No triangle, no four cards, no page asking which
 *      sentence does not belong, and no page asking for a related fact. The
 *      Day-5 production writes a STORY for a sentence, which is the opposite
 *      direction and a different object.
 *   4. B4 HAS DIRECTION FROM THE STORY, FOR A COUNT. b04 keeps the hop and the
 *      track — "B4 owns deciding direction from the story" — so nothing here is
 *      drawn on a number line, no page asks which WAY to travel, and every story
 *      states what happened in a plain verb the child has met since band A.
 *      Reading that verb is settled skill, borrowed; what is new is which of the
 *      three parts the question wants.
 *   5. B13/B14 HAVE THE WRITTEN COLUMN AND THE TRADE. Twenty is the ceiling on
 *      every page, which puts all three of those out of reach by arithmetic
 *      rather than by instruction. Exactly one numeral in the pack sits above
 *      twenty; it is a wrong answer on Day 5, and being too big is what makes it
 *      wrong.
 *   6. B10/B11 HAVE TENS; B19 HAS DOUBLES. No multiple of ten is added, and
 *      every drawn pair in this pack is UNEQUAL, so no page can be passed by
 *      halving or doubling.
 *   7. B6 HAS THE EQUAL SIGN. One number sentence is printed in the whole pack,
 *      on the Day-5 production, and it has an operation on the left and a single
 *      number on the right, and nothing in this pack asks whether that is allowed.
 *
 * ── 3. THE LINE AGAINST B24, WHICH IS THE ONE THAT MATTERS ──────────────────
 *
 * B24's entire subject is that the page will not say which move to make. Its own
 * header puts it in capitals — "**NOTHING ON THE PAGE SAYS WHICH MOVE THE STORY
 * WANTS**" — and it then makes three cue words betray on purpose: "'LEFT' WANTS
 * AN ADDITION", "'ALTOGETHER' WANTS A SUBTRACTION", "'ADDED' WANTS A
 * SUBTRACTION". Writing that here would be writing B24 fifteen weeks early, so
 * the boundary is stated as a rule this file obeys everywhere:
 *
 *     IN B9 THE WORDS NEVER LIE. Every story says what happened, in a verb that
 *     means what it says, and the verb is always true of the story. What a B9
 *     page withholds is not the MOVE but the NUMBER: either which of the three
 *     parts is missing, or — on the trap pages — what amount a phrase actually
 *     names.
 *
 *     B24'S TRAP: EVERY NUMBER IS PRINTED AND THE MOVE MUST BE CHOSEN.
 *     B9'S TRAP:  THE MOVE IS STATED AND A NUMBER MUST BE BUILT.
 *
 * They are orthogonal, and the test is simple: strike out every cue word on a
 * B24 page and the child loses nothing, because the cues were unreliable anyway;
 * strike them out here and the page becomes unanswerable, because the verb is
 * how the child knows what happened. Two consequences are enforced rather than
 * hoped for:
 *   · NO CUE WORD IN THIS PACK POINTS THE WRONG WAY. "More" always adds to a
 *     lot; "went in" always joins; "were eaten" always removes. There is not one
 *     page where reading the verb the obvious way is punished.
 *   · NO PAGE CARRIES A NUMBER THE QUESTION DOES NOT WANT. b24 records that
 *     "every item in Level B before this one consumed every number it mentioned"
 *     and makes dropping that habit its own work. So this pack consumes every
 *     number it prints, without exception, and `posing: 'has-distractor'` appears
 *     nowhere.
 *
 * The change-unknown page deserves a sentence here because it looks like a
 * betrayal and is not. "The jar held 6. More went in. Now there are 11. How many
 * went in?" is a JOIN whose answer is reached by counting UP from six to eleven —
 * which is B7's method applied to a join, not a subtraction dressed up. The cue
 * told the truth; it simply is not the cue's job to say which of the three parts
 * is missing. That is the frame's job, and the frame is what this week teaches.
 *
 * ── 4. THE SYMBOLS ─────────────────────────────────────────────────────────
 *
 * Exhaustively: the digits, `▢` (once, in the B7 warm-up), and `+`, `−` and `=`
 * (in the B8 warm-up and on the Day-5 production, which cannot exist without
 * them — the catalog cell asks for a story written "for a given number
 * sentence"). The minus is U+2212, the character b08, b13, b14 and c04 already
 * print. Absent: `>`, `<`, `×`, `÷`, `n/d`. B3 has the comparison signs; C6, C9
 * and C15 have the last three. The chains carry `{op:'add'}` / `{op:'sub'}`
 * inside `generator.params`, which is the op-chain library's vocabulary and is
 * not a child surface.
 *
 * ── 5. WHAT THE VERIFY LIBRARY WILL AND WILL NOT GENERATE HERE ─────────────
 *
 * L36 says prove impossibility FIRST, so each case below was pushed until it
 * either derived or provably could not.
 *
 * THE RECIPE'S NAMED MISCONCEPTION IS "ANSWERS THE WRONG QUESTION ASKED", AND IN
 * ITS SHARPEST FORM — reporting the halfway count of a two-change story — IT IS
 * NOT DERIVABLE. The proof is a counting argument rather than an opinion. The
 * halfway value of a story `s`, `+j`, `−t` is `s + j`, and the true value is
 * `s + j − t`; the two differ by `t`, so any transform producing both must be a
 * function of all THREE operands. Every registered two-value transform is a
 * function of at most two: `d_verify_binop_misconception_v1` varies the
 * operation over one fixed pair, the fraction/decimal/signed families vary the
 * move over one pair, `a_verify_count_slip_v1` and `a_verify_countback_slip_v1`
 * return `n ± 1` off one pair, and `d_verify_ratchain_v1` — the only transform
 * that takes a chain at all — is CORRECT-ONLY and returns no `wrong`. Solving
 * `a + b = s + j` with `a − b = s + j − t` gives `b = t/2` and
 * `a = s + j − t/2`, neither of which is a quantity in the story: that is the
 * fabrication §E2.12 warns about, with extra steps. Recorded rather than
 * reasoned around.
 *
 * THE TRAP'S OWN SLIP IS UNDERIVABLE FOR A REASON THE KIT HAS ALREADY PROVED.
 * A child who meets "three more went out than in the morning" and answers
 * "three" has reported ONE OF THE TWO GIVENS unchanged, and §E2.12 records that
 * exact class as proved-impossible: `d_verify_binop_misconception_v1` combines
 * both operands under an operation, so no `wrongOp` returns an operand. (Checked
 * anyway, because a proof about a different week is only a hint about this one:
 * over the pair `(s, N)` the four available operations give `s+N`, `s−N`, `sN`
 * and `s/N`, and none of them is `N` for any legal draw.)
 *
 * WHAT WAS DONE INSTEAD is §E2.3's third route, taken deliberately and in the
 * order the kit sets:
 *   · THE HALFWAY MISCONCEPTION IS RELOCATED TO A DISCRIMINATION OPTION, where
 *     it needs no `wrong` value at all: `discHalfwayNumber` offers the halfway
 *     count as one of three, and the item is PINNED to `d_verify_ratchain_v1`,
 *     whose `verifyFor` re-evaluates that chain and hands back the count the story
 *     really ends on. A mistakeBank row carries it as well, with its own
 *     `distractorRationale`.
 *   · THE TRAP IS RELOCATED THE SAME WAY: `discBuiltAmount` offers the lifted
 *     bare number as a live option, pinned by `d_verify_binop_v1` over the
 *     item's own operands, and it carries its own bank entry.
 *   · DAY 5 CARRIES A DERIVABLE COMPLEMENTARY SLIP, which is what the kit asks
 *     for. On a change-unknown story the child joins the two printed counts:
 *
 *         {a: end, b: start, op: '-', wrongOp: '+'}
 *              →  correct = end − start  (the change the story really made)
 *                 wrong   = end + start  (the two counts put together)
 *
 *     Neither numeral was chosen by an author, both operands appear in the
 *     sentences the child is reading, and QG-11 recomputes the pair from
 *     `generator.params`. It is
 *     complementary in the right direction: the trap uses a number the story
 *     never meant, and this uses the two numbers the story did print in the move
 *     the missing part did not want. Both fall to the same one-line test — could
 *     the story hold a number that size? — which is why they belong at opposite
 *     ends of one week.
 *
 * BOTH PINS ARE LOAD-BEARING RATHER THAN COINCIDENTAL, which matters after
 * QG-11's choice arm was tightened to a whole-value match. Every option on both
 * discriminations is a BARE NUMERAL, so the keyed option carries exactly one
 * number and the pin can only pass by agreeing with it; `bb-qg11-power-test`
 * reports neither item. The alternative design — options that are number
 * sentences — was rejected on exactly this ground before it was written.
 *
 * THREE FURTHER NEGATIVE RESULTS, recorded so the search is not repeated:
 *   · THE TRAP CAN BE MADE TO DERIVE, AND THE DERIVATION IS DISHONEST. Over the
 *     pair `(s + N, s)` the operation swap gives `correct = 2s + N` (how many
 *     across the whole day) and `wrong = N` (the lifted number). Both values are
 *     real quantities of the story, so it type-checks and it would go green. It
 *     is still fabrication, because the transform is not the move: a child who
 *     answers "three" did not subtract the morning count from the evening one,
 *     they read a numeral and stopped. b08's rule — the shown wrong value must
 *     be "arrived at by the operation the child actually performed" — refuses it,
 *     and so does this file.
 *   · THERE IS NO SET-OR-STRUCTURE TRANSFORM. What "answers the wrong question"
 *     really claims is that a value answers a DIFFERENT question of the same
 *     story, which is a statement about a pair of questions rather than about a
 *     pair of numbers. Nothing in the library has that shape, and building one
 *     means editing `lib/`, which is not a week's to edit (kit §G).
 *   · `d_verify_binop_v1` CANNOT PIN THE DAY-5 PRODUCTION. Its answer is a story
 *     a child writes, graded by keyword, so there is no value to recompute. That
 *     surface is uncovered on purpose and is listed as such below.
 *
 * WHICH GATE WATCHES WHICH SURFACE, WRITTEN DOWN SO NOBODY HAS TO INFER IT.
 * QG-5 recomputes `sitAltogether`, `sitBuiltAmount` and `sitChangeUnknown` off
 * `d_add_v1` and `d_sub_v1`, and `sitResultUnknown` and both chains off
 * `d_multistep_rat_v1`. QG-11 audits the two discriminations, and audits the
 * error analysis on both its halves.
 *
 * Four surfaces have no gate at all, and they are listed because a PASS that
 * looks total is how the last class of real bugs survived (L30): the story a
 * child writes on Day 5, which is graded by keyword; the always/sometimes/never
 * claim; the estimate-first probe, which has no key by definition (§8); and the
 * puzzle, which stands instead on a construction-time check that its own story
 * reverses back to the count it was built from.
 *
 * ── 6. THE PICTURES — WHAT IS DRAWN, AND WHAT IS REFUSED, AS A RESULT ───────
 *
 * The figure question is sharper in a story week than anywhere else, because
 * turning a story into a picture IS the task. The conclusion, stated as a result:
 *
 *     ON AN ASSESSED PAGE OF THIS WEEK, EVERY HONEST PICTURE IS EITHER THE
 *     ANSWER OR SOMEBODY ELSE'S ANCHOR. THERE IS NO THIRD KIND.
 *
 * It was reached by enumerating the primitives rather than by taste, and each
 * branch is a separate finding:
 *
 *   (i) A BAR OF THE THREE PARTS ANSWERS THE QUESTION. Draw the starting length
 *       above and the finished length below and the picture states which of the
 *       three parts is missing and how the three relate — which is the whole of
 *       what a B9 page asks. It is also twice-owned: b07/b08 have the part-whole
 *       bar and b15 has "comparison bars" as its declared anchor, so even a
 *       correct one would spend a sibling's week. Refused everywhere, including
 *       the script, where drawing it would teach the child to expect it.
 *  (ii) A NUMBER LINE IS b04'S TRACK. It also converts "what happened" into
 *       "where did you land", which is the substitution this week exists to stop.
 * (iii) COUNTERS ON A TRAP PAGE ARE UNBUILDABLE. The trap page states a count and
 *       a phrase; to draw the phrase you must first work out the amount it names,
 *       and that amount is the answer. There is no partial version: draw less and
 *       the picture shows only the count already printed on the line above it.
 *  (iv) COUNTERS ON A CHANGE-UNKNOWN PAGE ARE UNBUILDABLE FOR THE MIRROR REASON.
 *       The thing that changed is exactly what the question withholds.
 *   (v) SO NOTHING IS DRAWN ON ANY ASSESSED PAGE, and Level B sets
 *       `pictorialPerDay: 0`, so no gate is being dodged.
 *
 * WHAT IS DRAWN, ON THREE SURFACES WHERE THE ANSWER IS ALREADY PRINTED BESIDE
 * IT: `counterGroups`, on two script segments and on the modeled guided example.
 * A lot, with the lot that arrived brought alongside it; then a lot with the
 * departures struck through. That is A14's and A16's picture — "join stories
 * acted out", "take-away acted out" — brought back for the length of one lesson,
 * at the moment stories stop coming with pictures attached, and taken away again
 * straight after. Neither call asserts anything, for two separate reasons: a
 * script segment holds no answer and no params, so there is nothing for QG-13 to
 * weigh the drawing against, while the modeled example prints its total in the
 * prompt, so an assertion would audit a numeral the child can already read. The
 * alt text gives both lot sizes and the direction of travel, since that is all a
 * sighted child gets from these two pictures either.
 *
 * ALSO REFUSED: any mark, ring or brace (`counterGroups` exposes `crossedOut`
 * for the take-away picture and nothing else — `showPairs` and `markExtra` are
 * not reachable from this file); a picture on the puzzle, where reconstructing
 * the lot IS the puzzle; and a picture on either discrimination, where three
 * numbers are on offer and a drawing would rank them.
 *
 * ── 7. CAN A CHILD SCORE THESE WITHOUT THE MATHEMATICS? (kit §E2.11) ────────
 *
 * A story week has one habit that beats reading — "put the two numbers together"
 * — and one that beats it half as often — "take one off the other". Both were
 * measured over the whole pack rather than argued about.
 *
 *   · THE PACK'S OWN HABIT-MIX, MEASURED AND NOT FLATTERING. Eighteen slots of
 *     the daily core are non-retrieval, and fifteen of those carry a numeric key
 *     (the Day-5 three are written answers). Over 1,500 seeds, across those
 *     fifteen: "add the two printed numbers" produces the keyed answer on 39.8%,
 *     "take one printed number off the other" on 20.2%, and neither habit reaches
 *     it on the remaining 40.0% — 26.7% of the slots print three numbers, so no
 *     two-number habit applies at all, and 13.3% print two and want neither their
 *     sum nor their difference. Over the two mastery forms it is 41.7% and 25.0%.
 *     The first draft measured 68.3% for the adding habit, counted per operation
 *     rather than per page, and the day plan was changed on the strength of it:
 *     Day 3's second trap page became `discHalfwayNumber`, because the trap page
 *     is answered by adding the two printed numbers and there were three such
 *     pages in a row. What remains is reported rather than argued away. It is
 *     not a shortcut in the sense §E2.11 means, because these are free-entry
 *     pages where adding is the mathematics rather than a way round it — but a
 *     child who adds whatever is in front of them is right more often than they
 *     are wrong on this week's easier half, and that is worth a teacher knowing.
 *     The pages where the habit fails are the ones that matter: every
 *     change-unknown, every chain, and the page that asks where the story stops.
 *   · `discBuiltAmount` OFFERS FOUR HONEST WRONG VALUES, TWO BELOW THE KEY AND
 *     TWO ABOVE, and serves them in three pairings so the key's rank rotates.
 *     Measured over 7,500 draws the keyed value is the biggest of the three on
 *     32.7%, the middle on 32.8% and the smallest on 34.4% — so each of the three
 *     positional habits pays out at roughly the rate three options already give
 *     away before an author writes anything.
 *     The rank matters more here than usual: for a story week the wrong values
 *     ARE the printed numbers and their other combinations, so undershooting and
 *     bracketing are one defect wearing two coats, and only a rotating PAIRING
 *     escapes both (L43). One shortcut survives partially and is reported rather
 *     than hidden. On one of the three pairings the two distractors ARE the
 *     story's two printed numbers, so on that third of draws (32.7%, measured)
 *     two routes open at once: "pick the option that is not printed" is unique,
 *     and so is "add the other two options". Neither is free, and the second is
 *     not even a shortcut — adding the two printed numbers is precisely the
 *     mathematics the page is asking for, and the child who holds the
 *     misconception this page exists to catch adds nothing at all. It is recorded
 *     because a reader of the generated page sees `2 | 4 | 6` and should know
 *     which pairing produced it.
 *   · `discHalfwayNumber` IS BUILT THE SAME WAY, from four wrong values two above
 *     and two below, in three pairings. Measured over 10,000 draws the key is the
 *     biggest on 33.5%, the middle on 33.0% and the smallest on 33.4%. Every
 *     option is a count the story's own moves produce, so none can be struck out
 *     on sight, and all three are unprinted, so "pick the one that is not in the
 *     story" is unique on 0.4% of draws.
 *   · NOTHING IS OFFERED-ALWAYS AND KEYED-NEVER. Every option on both
 *     discriminations is a numeral built from that draw's own operands, so no
 *     option string is ever seen twice, and `DECLARED_LURES` needs no new row. The
 *     Exactly one answer in the pack never moves — "sometimes", on the
 *     always/sometimes/never page — and that is a fact about the claim rather
 *     than about any draw, and Day 5 is a teaching page rather than a
 *     certificate (L42).
 *   · THE FREE-ENTRY PAGES CANNOT BE RANKED and the entropy gate correctly
 *     reports nothing on them, so they were measured by hand instead. The two
 *     that flip come out even: `sitResultUnknown` is a growing story on 49.5% of
 *     10,000 exposures (±0.5) and `sitChangeUnknown` on 51.0%, so no slot becomes
 *     the adding slot. `sitAltogether` and `sitBuiltAmount` are single-direction
 *     by design, and on `sitBuiltAmount` that is not a weakness: knowing WHICH
 *     two numbers to add is the entire item, and the child who has the
 *     misconception adds nothing at all.
 *
 * ── 8. THE PROBE, AND ITS SERVED SPLIT AS MEASURED ─────────────────────────
 *
 * A probe has no answer key, so no gate can weigh it and a person has to read
 * the draw (L41). The probe is "will there be more at the end?" — six words,
 * inside §E2.9's seven-word budget, and it rides on `msTwoChanges`, the only
 * page where the answer genuinely is not obvious from a verb: two changes happen
 * and neither one alone decides the direction.
 *
 * THE SIDE IS DRAWN FIRST, AND THAT WAS NOT ENOUGH — WHICH IS THE POINT b22 MADE
 * AND THIS WEEK REPRODUCED BEFORE FIXING IT. `endsBigger` is the very first draw
 * of the generator. In the first draft the triple was then picked from one of two
 * precomputed pools, one where the arrival exceeds the departure and one where it
 * does not, which makes the INTENDED split exactly even. Measured, it was 47.9%.
 * The cause is the one b22 named: `drawUniqueItem` redraws an item whose numeric
 * surface is already used in the pack, a redraw re-runs the whole closure
 * including the flip, and the two pools printed DIFFERENT NUMBERS — so the side
 * whose numbers collided more often was quietly suppressed. Equalising the pool
 * sizes would not have fixed that, because the collision rate is a property of
 * the numerals, not of the pool length.
 *
 * What fixed it is a construction rather than a correction. One pool now holds
 * `[start, bigStep, smallStep]` with the larger change first, and the probe's
 * side decides WHICH OF THE TWO CHANGES ARRIVES. Both sides therefore print the
 * same three numerals in the same sentence positions, the freshness guard sees an
 * identical surface either way, and it has no side to prefer. Measured over 5,000
 * exposures: 50.1%, standard error 0.71. It is recorded because a probe has no
 * key, so this is the only account of it anyone will ever have.
 *
 * NO DAILY PAGE REACHES `msTwoChanges` EXCEPT THROUGH THE WRAPPER, per §E2.2. The
 * wrapper copies the ladder across unchanged, so putting both forms on the daily
 * pages would burn two of the three slots the dedup allows on a single idea. The
 * bare form has no home at all here, mastery included, and that is a decision
 * rather than an oversight: a page that hands the child a decision to commit to
 * has already given away what a certificate would be trying to measure. What
 * measures the two-change story instead is `discHalfwayNumber`, which asks the
 * harder half of it.
 *
 * ── 9. THE BAND, THE DOSE, AND THE FRAMES ──────────────────────────────────
 *
 * Every row of FILL-ARCHITECTURE §1 was checked against this pack. The fifteen-word
 * ceiling comes out at 0.00% across thirty seeds, and that is not free in a week
 * whose whole content is prose — it is why each story template is assembled from
 * three or four short sentences instead of one flowing one, and why the two-place
 * combine story names its places in separate sentences. Metacognition appears in
 * the band's prediction form, the error analysis asks for a single sentence, and
 * the sprint carries no grade and competes with nobody. The days run 5/5/5/5/4 and
 * land between 9.5 and 11.25 minutes each.
 *
 * FRAMES, SCANNED WHEN THE FILE WAS FINISHED, because the neighbours land while
 * this is being written (kit §E2.8). Zero hits corpus-wide for damsons, minnows,
 * rosehips, pompoms, breadsticks, oatcakes, bluebells, hairclips, plasters and
 * baubles. Rejected after the scan rather than shipped: conkers (b14, b15, b21,
 * c04, c09, c12), pebbles (b08, b15, b21, c08, c17), gooseberries (b08's, and b08
 * is the immediate neighbour), acorns (b14, b15, c09, c11, c17), and — found by
 * reading a generated page rather than by scanning — "the rock pool", which is
 * c10's own frame and had to give way to a jam jar. Moths survived the scan and
 * were dropped on realism instead: nobody puts a moth into a lamp, and two
 * generators here need a person who can add to the lot.
 *
 * Every frame binds its noun to the verbs that are true of it — a bauble is packed
 * in and taken out, an oatcake stacked in and shared out, a minnow netted in and
 * tipped back — so no draw can cross a noun with a stranger's predicate and
 * produce "the minnows were eaten in the morning". The minnows earned that rule
 * the hard way: their first frame had them swimming in and out of a tank, which
 * reads fine in a table and is nonsense on a page, because a tank is the one
 * container a fish cannot leave by itself.
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { counterGroups } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A16 = { level: 'A' as const, week: 16 };
const B5 = { level: 'B' as const, week: 5 };
const B7 = { level: 'B' as const, week: 7 };
const B8 = { level: 'B' as const, week: 8 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** A name off the pool. Nothing in this file may hardcode one of these (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two names that differ, so one child never fills a lot alongside themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/** The five DD7 error tags, so a distractor's tag is checked at compile time. */
type Tag = 'fact-recall' | 'procedure-slip' | 'concept-misconception' | 'representation-misread' | 'task-comprehension';

type Params = Record<string, unknown>;

/**
 * U+2212, the character b08, b13, b14 and c04 already print, so the one number
 * sentence in this pack looks identical to every take-away elsewhere in the
 * corpus. Not the hyphen and not the en dash: QG-11(b)'s prose scanner reads both
 * of those as arithmetic continuation, and the sentence splitter treats an en
 * dash as a word boundary.
 */
const MINUS = '−';

/** "the basket" → "The basket", for a place that opens a sentence. */
const cap = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

// ---------------------------------------------------------------------------
// The frames — a noun bound to the places it sits in and the things that can
// truthfully happen to it
//
// Nouns and predicates drawn independently is how "1/4 of the marbles are ripe"
// happened (L26), so a frame is one row and a draw takes the row whole. Every
// verb below is third-person plural past, because a story problem is told in the
// past — except `sitAltogether`, whose two lots are not doing anything and are
// therefore described in the present. The tense difference is not decoration: it
// is the surface signal of the frame contrast the week is built on.
// ---------------------------------------------------------------------------

interface Frame {
  /** The countable thing, plural, exactly as the child reads it. */
  noun: string;
  /** Where the lot sits, with its article. */
  here: string;
  /** A second place the same noun can sit, for the two-lot story. */
  there: string;
  /** What ARRIVING looks like for this noun. */
  wentIn: string;
  /** What LEAVING looks like for this noun. */
  wentOut: string;
}

const FRAMES: readonly Frame[] = [
  { noun: 'damsons', here: 'the basket', there: 'the bowl', wentIn: 'went in', wentOut: 'were lifted out' },
  { noun: 'minnows', here: 'the pail', there: 'the jam jar', wentIn: 'were netted in', wentOut: 'were tipped back' },
  { noun: 'baubles', here: 'the box', there: 'the sack', wentIn: 'were packed in', wentOut: 'were taken out' },
  { noun: 'rosehips', here: 'the jar', there: 'the pouch', wentIn: 'were dropped in', wentOut: 'were tipped out' },
  { noun: 'plasters', here: 'the case', there: 'the pocket', wentIn: 'were slipped in', wentOut: 'were used' },
  { noun: 'pompoms', here: 'the tub', there: 'the bag', wentIn: 'were pushed in', wentOut: 'were pulled out' },
  { noun: 'breadsticks', here: 'the pot', there: 'the plate', wentIn: 'were stood in', wentOut: 'were eaten' },
  { noun: 'oatcakes', here: 'the tin', there: 'the rack', wentIn: 'were stacked in', wentOut: 'were shared out' },
  { noun: 'bluebells', here: 'the jug', there: 'the vase', wentIn: 'were added', wentOut: 'were taken out' },
  { noun: 'hairclips', here: 'the dish', there: 'the drawer', wentIn: 'were tipped in', wentOut: 'were fished out' },
];

const frame = (r: Rng): Frame => r.pick(FRAMES);

/**
 * Whether a pool is big enough decides whether the pack can be built at all, so it
 * is checked at module load instead of being hoped for. Each floor below counts the
 * distinct numeric surfaces its consumers ask for across the five days and the two
 * mastery forms — the point at which `drawUniqueItem` would have to give up and
 * repeat one.
 */
function atLeast<T>(name: string, rows: readonly T[], floor: number): readonly T[] {
  if (rows.length < floor) {
    throw new Error(`b09 ${name}: built ${rows.length} rows, and the day plan plus both mastery forms need ${floor}`);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Every number pool this week draws from, built once at module load
//
// Each of these ends in a single `r.pick`, and none of them is a filter applied
// after a draw. A retry loop burns an unpredictable number of rng values, which
// leaves every item drawn after it standing somewhere different in the stream
// (kit §E2.4). Writing the tables out also forces constraints into the open that a
// post-hoc filter would have buried — see `STEP_ROWS` and `TWO_CHANGE_ROWS`,
// where the requirement that ONE row be legal in both directions is what makes
// two of this week's coin flips genuinely even (header §7 and §8).
// ---------------------------------------------------------------------------

/** Two unequal lots whose total crosses ten — B5's bridge, which is why it is the sprint. */
const BRIDGE_PAIRS = atLeast(
  'BRIDGE_PAIRS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let a = 3; a <= 9; a++) {
      for (let b = a + 1; b <= 9; b++) {
        if (a + b >= 11 && a + b <= 18) out.push([a, b] as const);
      }
    }
    return out;
  })(),
  12,
);

/**
 * `[start, change]` for a lot changed once — LEGAL IN EITHER DIRECTION, and that
 * is the whole reason the pool is built this way rather than as two.
 *
 * The first draft held a growing pool and a shrinking pool and drew the direction
 * first, which is what §E2.2 and b22's finding both ask for. It still came out at
 * 45.0% joins over 1,600 exposures, because drawing the side first is not proof:
 * `drawUniqueItem` redraws an item whose numeric surface is already used in the
 * pack, a redraw re-runs the whole closure INCLUDING the flip, and the two pools
 * had different sizes (62 against 72) and different number-spaces, so the branch
 * that collided more often was quietly suppressed. Making the pools the same size
 * would not have fixed it, because the collision rate is a property of the
 * NUMBERS, not of the pool.
 *
 * One pool legal both ways fixes it exactly: the prompt prints `start` and
 * `change` whichever way the story runs, so the surface a redraw is testing is
 * identical on both branches and the guard cannot prefer either. `s ≥ c + 2`
 * keeps the shrinking reading above one; `s + c ≤ 19` keeps the growing one
 * inside twenty; `s + c ≥ 11` makes every growing story cross ten, which is what
 * the sprint is for; `s ≠ 2c` keeps the shrinking answer off the change itself,
 * so no page can be passed by halving.
 */
const STEP_ROWS = atLeast(
  'STEP_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let s = 4; s <= 17; s++) {
      for (let c = 2; c <= 8; c++) {
        if (s < c + 2) continue;
        if (s + c > 19 || s + c < 11) continue;
        if (s === 2 * c) continue;
        out.push([s, c] as const);
      }
    }
    return out;
  })(),
  30,
);

/**
 * The two counts of a change-unknown story, smaller first. The change is their
 * distance, and it is never equal to either count, so no page can be passed by
 * reading a number off the line.
 */
const TWO_COUNTS = atLeast(
  'TWO_COUNTS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let small = 3; small <= 12; small++) {
      for (let gap = 2; gap <= 8; gap++) {
        const big = small + gap;
        if (big <= 20 && gap !== small && gap !== big) out.push([small, big] as const);
      }
    }
    return out;
  })(),
  30,
);

/**
 * The same pair, with the two counts constrained to total twenty or less.
 *
 * Only the Day-5 error analysis needs this: the value it shows a child is the two
 * counts JOINED, and a week called "within 20" should not print a numeral above
 * twenty unless the size of that numeral is the whole point. Here it is — but the
 * point lands harder when the number is still a number a six-year-old handles.
 */
const EA_COUNTS = atLeast(
  'EA_COUNTS',
  TWO_COUNTS.filter(([small, big]) => small + big <= 20),
  10,
);

/**
 * `[s, N]` for the trap: a count, and the number a "more than" phrase measures
 * from it.
 *
 * `N` is strictly below `s`, which keeps the phrase a modest step rather than a
 * second lot, and `2s + N` is held inside twenty because that value is one of the
 * offered options. All five values the trap pages produce — `N`, `s`, `s + N`,
 * `s + 2N` and `2s + N` — are distinct for every row here, which the assertion in
 * `discBuiltAmount` re-proves on every draw rather than trusting this comment.
 */
const PHRASE_PAIRS = atLeast(
  'PHRASE_PAIRS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let s = 4; s <= 9; s++) {
      for (let n = 2; n <= 5; n++) {
        if (n < s && 2 * s + n <= 20) out.push([s, n] as const);
      }
    }
    return out;
  })(),
  14,
);

/** `[a, n]` for two people filling one lot: the first amount, and the step up to the second. */
const HELPER_PAIRS = atLeast(
  'HELPER_PAIRS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let a = 3; a <= 8; a++) {
      for (let n = 2; n <= 6; n++) {
        if (n !== a && 2 * a + n <= 20) out.push([a, n] as const);
      }
    }
    return out;
  })(),
  12,
);

/**
 * `[start, bigStep, smallStep]` — a lot and its two changes, with the LARGER
 * change first and both readings legal.
 *
 * The estimate-first probe asks whether the lot ends bigger than it started,
 * which is decided by whether the arrival or the departure is the larger of the
 * two changes. So the probe's side is chosen by deciding WHICH OF THESE TWO
 * NUMBERS ARRIVES, not by picking from a different pool — and that makes the
 * numeric surface `{start, bigStep, smallStep}` identical on both sides of the
 * probe, so the freshness guard's redraws cannot suppress a side. The first
 * draft used two pools and measured 47.9% (header §8); this construction is what
 * closed the gap, and it is the same argument as `STEP_ROWS`.
 *
 * Both story orders also have to be legal from one row, because join-first is
 * drawn afterwards: the lot never falls below two on the take-first reading and
 * never passes twenty on the join-first one, whichever change is the arrival.
 * `small < big` is load-bearing beyond the probe — b24 records a chain "where 20
 * children joined and 20 left so both moves cancelled for a free mark", and a
 * story whose two changes undo each other is a page a child passes by noticing
 * that the numbers match.
 */
const TWO_CHANGE_ROWS = atLeast(
  'TWO_CHANGE_ROWS',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (let big = 3; big <= 7; big++) {
      for (let small = 2; small < big; small++) {
        for (let s = 5; s <= 14; s++) {
          // The binding pair of constraints, and they bind on the reading where
          // the LARGER change is the one being applied: the lot must survive the
          // larger departure and must not overflow on the larger arrival.
          if (s - big < 2) continue;
          if (s + big > 20) continue;
          out.push([s, big, small] as const);
        }
      }
    }
    return out;
  })(),
  40,
);

/**
 * `[s, j, t]` for the possession story: what was held, what was given to the
 * child, and what the child then gave away.
 *
 * Four wrong values are read off these three numbers and all of them have to be
 * whole counts a child could plausibly write, so the row keeps `s − j − t` at one
 * or more and `s + j + t` inside twenty. That is a tight window, which is why the
 * starting count sits higher here than anywhere else in the pack.
 */
const HELD_ROWS = atLeast(
  'HELD_ROWS',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (let s = 8; s <= 14; s++) {
      for (let j = 2; j <= 6; j++) {
        for (let t = 2; t <= 6; t++) {
          if (j === t) continue;
          if (s + j + t > 20) continue;
          if (s - j - t < 1) continue;
          if (s + j - t < 2) continue;
          out.push([s, j, t] as const);
        }
      }
    }
    return out;
  })(),
  20,
);

// ---------------------------------------------------------------------------
// The pin
//
// Choice items built by `discrimination()` arrive with no `generator` attached, so
// there is nothing for QG-11 to recompute a truth from and the keyed option would
// travel unaudited. A one-slot letterbox closes that: the draw posts the operands
// it used, the decorator collects them on the very next line, and the item carries
// its spec from then on. Collecting immediately is what keeps it honest, because
// `drawUniqueItem` may run a draw repeatedly and only the last run's letter is
// still in the box when its draft is handed back. b03, b04, b07 and b24 each
// carry their own copy of this shape; the alternative is editing `lib/`, which is
// not a week's to edit (kit §G).
// ---------------------------------------------------------------------------

interface Pin {
  params: Params;
  seed: number;
}

function pinSlot(): { last: Pin | null } {
  return { last: null };
}

function withPin(box: { last: Pin | null }, templateId: string, base: ItemGen): ItemGen {
  return (rng, guard, difficulty) => {
    const d = base(rng, guard, difficulty);
    const pin = box.last;
    if (!pin) throw new Error('b09/withPin: nothing was left in the letterbox, so this option cannot be audited');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

// ---------------------------------------------------------------------------
// The one picture this week draws, and only where the answer is already printed
// ---------------------------------------------------------------------------

/**
 * A LOT, AND BESIDE IT THE LOT THAT ARRIVED — A14's join picture.
 *
 * Reachable from exactly three places — two script segments and the modeled
 * guided example — and nowhere else (header §6). Neither call carries `asserts`, and for two different reasons:
 * a script segment holds no answer and no params, so QG-13 would have nothing to
 * compare the picture against, while the modeled example prints its total in the
 * prompt, so an assertion there would audit a numeral already visible.
 */
const joinPicture = (start: number, arrived: number, noun: string): BBFigure =>
  counterGroups(
    [
      { count: start, noun, label: 'at the start' },
      { count: arrived, noun, label: 'arrived' },
    ],
    {
      relation: 'join',
      alt: `a lot of ${fmtInt(start)} ${noun} with a lot of ${fmtInt(arrived)} more brought alongside it`,
    },
  );

/** A lot with the departures struck through — A16's take-away picture, same rules. */
const leavePicture = (start: number, left: number, noun: string): BBFigure =>
  counterGroups([{ count: start, noun, label: 'at the start' }], {
    relation: 'remove',
    crossedOut: left,
    alt: `a lot of ${fmtInt(start)} ${noun} with ${fmtInt(left)} of them crossed through`,
  });

// ---------------------------------------------------------------------------
// Three warm-ups, each a piece of machinery a core page runs on
//
// None is here to fill a slot. Drop B5's bridge and every growing story becomes a
// page about assembling a sum that crossed ten. Drop B7's box and the
// change-unknown pages have no method behind them, because counting up to a
// target is B7's and is borrowed rather than taught. Drop B8's related fact and
// every shrinking story ends in a take-away the child rebuilds from scratch. All
// All three sources lie behind this week on the ladder, which QG-2 requires, and a
// retrieval slot is exempt from the pedagogy gates anyway.
// ---------------------------------------------------------------------------

/** B5 — the bridge across ten, stated as a bare sum so it is plainly not a story. */
const wFillTheTen = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'bridge-to-ten',
    draw: (r) => {
      const [a, b] = r.pick(BRIDGE_PAIRS);
      return {
        prompt: `What do ${fmtInt(a)} and ${fmtInt(b)} make? Fill the ten first.`,
        answerValue: String(a + b),
        templateId: 'retr_add_within_100_v1',
        params: { a, b },
        hints: [
          'Which of the two numbers is nearer to ten?',
          'Split the other number so the first one fills the ten.',
        ],
        errorTags: ['fact-recall', 'procedure-slip'],
      };
    },
  }),
  B5,
);

/**
 * B7 — the box, and the only `▢` in the pack.
 *
 * The box sits after the visible number and stays there. Moving it about is b07's
 * device for making the notation hard, and it stays b07's: a retrieval slot exists
 * to replay something already settled, not to reopen the part that was difficult.
 */
const wBoxOnTheLabel = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'missing-addend-box',
    draw: (r) => {
      const [small, big] = r.pick(TWO_COUNTS);
      return {
        prompt: `A label reads ${fmtInt(small)} + ▢ = ${fmtInt(big)}. What belongs in the box?`,
        answerValue: String(big - small),
        templateId: 'd_sub_v1',
        params: { a: big, b: small },
        hints: [
          'Which number on this label is the whole lot?',
          'Stand on the number that is shown and count up to the whole.',
        ],
        errorTags: ['concept-misconception', 'task-comprehension'],
      };
    },
  }),
  B7,
);

/** B8 — one take-away card recalled from the family its three numbers make. */
const wRelatedFact = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'related-take-away-fact',
    draw: (r) => {
      const [a, b] = r.pick(BRIDGE_PAIRS);
      const whole = a + b;
      const takenOff = r.chance(0.5) ? a : b;
      return {
        prompt: `${fmtInt(a)}, ${fmtInt(b)} and ${fmtInt(whole)} are one family. What does ${fmtInt(whole)} ${MINUS} ${fmtInt(takenOff)} make?`,
        answerValue: String(whole - takenOff),
        templateId: 'retr_sub_within_100_v1',
        params: { a: whole, b: takenOff },
        hints: [
          'Which two of these numbers go together to make the third?',
          'Take one part off the whole and the other part is what is left.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  B8,
);

// ---------------------------------------------------------------------------
// THE FRAME WHERE NOTHING HAPPENS — two lots, and the whole they make
//
// The simplest page of the week and the one that makes the other frames visible:
// there is no before and no after, the two lots are simply where they are, and
// the tense says so. It is here to be contrasted with, which is why it is drawn
// from the same bridge pool as the B5 warm-up — the arithmetic is settled and the
// only new thing on the page is the shape of the sentence.
//
// The reverse direction — a stated whole and one part, asking for the other — is
// B7's page and is not asked anywhere in this pack.
// ---------------------------------------------------------------------------

const sitAltogether = situation({
  situationType: 'combine',
  cognitiveOp: 'story-two-lots',
  draw: (r) => {
    const f = frame(r);
    const [a, b] = r.pick(BRIDGE_PAIRS);
    const [first, second] = r.chance(0.5) ? [a, b] : [b, a];
    return {
      prompt: `${cap(f.here)} holds ${countNoun(first, f.noun)}. ${cap(f.there)} holds ${countNoun(second, f.noun)}. How many ${f.noun} is that?`,
      answerValue: String(a + b),
      templateId: 'd_add_v1',
      params: { a: first, b: second },
      units: f.noun,
      hints: [
        'Does anything happen in this story, or do both lots stay put?',
        'Put the two lots together to find the whole set.',
      ],
      errorTags: ['task-comprehension', 'fact-recall'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE FRAME WHERE SOMETHING HAPPENS — the end is the missing part
//
// A lot, a change, and the question is what is there now. Whether the lot grows
// or shrinks is drawn FIRST, at even odds, and the operands come from whichever
// pool that direction allows, so a slot cannot become the adding slot. The verb
// says which way it went and the verb is always true: choosing the move is B24's
// week and reading it is b04's, so what is left here is the frame.
//
// THE TEMPLATE IS `d_multistep_rat_v1` OVER A ONE-STEP CHAIN. The device is b08's
// and is used here with acknowledgement, because the constraint it solves is
// identical. Pinning the growing branch to `d_add_v1` and the shrinking one to
// `d_sub_v1` is the obvious move and it locks the generator out of mastery, since
// QG-4 pairs Form A with Form B by templateId — and mastery is the one place a
// direction that rotates is worth having. A chain of a single step describes what
// this page asks a child to do, so both branches travel under one id with honest
// operands underneath. No false claim of depth follows: `situation()` writes
// `stepCount: 1`.
// ---------------------------------------------------------------------------

const sitResultUnknown = situation({
  situationType: 'part-whole',
  cognitiveOp: 'story-end-unknown',
  draw: (r) => {
    const grows = r.chance(0.5);
    const f = frame(r);
    const [start, change] = r.pick(STEP_ROWS);
    // ONE LADDER FOR BOTH DIRECTIONS, and that is forced rather than tidy. Hints
    // that varied with the draw would make the ladder dedup depend on operands,
    // and it would then fire on learner seeds nobody ever generated (L19).
    const hints: [string, string] = [
      'Does this story add to the lot, or take from it?',
      'Begin at the count the story opens with, then follow the change.',
    ];
    return {
      prompt: `${cap(f.here)} held ${countNoun(start, f.noun)}. Then ${countNoun(change, f.noun)} ${grows ? f.wentIn : f.wentOut}. How many ${f.noun} are there now?`,
      answerValue: String(grows ? start + change : start - change),
      templateId: 'd_multistep_rat_v1',
      params: { initN: start, initD: 1, steps: [{ op: grows ? 'add' : 'sub', n: change, d: 1 }] },
      units: f.noun,
      hints,
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE HARD ONE — the CHANGE is the missing part
//
// Both printed numbers are counts of the same lot at two different moments, and
// the answer is the distance between them. This is where a story stops being an
// instruction: the story joined, and the way to the answer is still a count UP
// from the smaller number, which is B7's method borrowed whole and named as
// borrowed in rung two.
//
// It is also the page b24 later turns into a betrayal, and the difference is
// worth keeping straight. Nothing here misleads: "more went in" is true, more did
// go in. What the sentence does not say — and is not supposed to — is which of
// the three parts of the frame the question wants.
//
// Both branches ship `d_sub_v1` over the same ordered pair, so the mastery slot
// carries one templateId while the story still flips.
// ---------------------------------------------------------------------------

const sitChangeUnknown = situation({
  situationType: 'part-whole',
  cognitiveOp: 'story-change-unknown',
  draw: (r) => {
    const grew = r.chance(0.5);
    const f = frame(r);
    const [small, big] = r.pick(TWO_COUNTS);
    const opened = grew ? small : big;
    const closed = grew ? big : small;
    const hints: [string, string] = [
      'Which of the two counts came first in this story?',
      'Count up from the smaller count until you reach the bigger one.',
    ];
    return {
      prompt: grew
        ? `${cap(f.here)} held ${countNoun(opened, f.noun)}. More ${f.noun} ${f.wentIn}. Now there are ${countNoun(closed, f.noun)}. How many ${f.wentIn}?`
        : `${cap(f.here)} held ${countNoun(opened, f.noun)}. Some ${f.noun} ${f.wentOut}. Now there are ${countNoun(closed, f.noun)}. How many ${f.wentOut}?`,
      answerValue: String(big - small),
      templateId: 'd_sub_v1',
      params: { a: big, b: small },
      units: f.noun,
      hints,
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE TRAP, FREE ENTRY — a phrase names an amount that is nowhere on the page
//
// "Three more than the tub held" is not three. It is a number the child has to
// build before they can use it, and building it is the whole item. The phrase is
// always a GIVEN and never a question, and it always measures a CHANGE against a
// count rather than one standing lot against another — which is what keeps it out
// of B15, whose two piles sit still and whose question is which of two things the
// sentence wants.
//
// Every number on this page is consumed and the move is stated outright, so
// nothing here is B24's page either.
// ---------------------------------------------------------------------------

const sitBuiltAmount = situation({
  situationType: 'combine',
  cognitiveOp: 'story-amount-from-a-phrase',
  draw: (r) => {
    const f = frame(r);
    const [held, step] = r.pick(PHRASE_PAIRS);
    const name = one(r);
    return {
      prompt: `${cap(f.here)} held ${countNoun(held, f.noun)}. ${name} added ${fmtInt(step)} more ${f.noun} than ${f.here} held. How many ${f.noun} did ${name} add?`,
      answerValue: String(held + step),
      templateId: 'd_add_v1',
      params: { a: held, b: step },
      units: f.noun,
      hints: [
        'Which number does the phrase in this story really name?',
        'Build the amount the phrase describes before you use it.',
      ],
      errorTags: ['task-comprehension', 'representation-misread'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE TRAP, AS THE RECIPE'S DISCRIMINATION — two changes, one measured from the
// other
//
// The same trap on a page that offers three numbers, because a child who can
// build the amount and a child who can pick it out of a line-up are not the same
// child. The story is a morning and an evening, so the phrase measures one CHANGE
// against another CHANGE and there is no standing pile anywhere on the page.
//
// FOUR NAMED WRONG VALUES, TWO BELOW THE KEY AND TWO ABOVE, served two at a time
// over three pairings so the key lands biggest, middle and smallest in turn. This
// is L43's rule taken as an invariant rather than as its first instance: for a
// story week the wrong values are the printed numbers and their combinations, so
// undershooting and bracketing are the same defect wearing different clothes, and
// only a rotating PAIRING escapes both. The shares are in header §7.
//
// PINNED to `d_verify_binop_v1` over the item's own operands, and the pin is
// load-bearing because every option is a bare numeral: the keyed option carries
// exactly one number, so the whole-value match can only pass by agreeing with it.
// ---------------------------------------------------------------------------

interface Wrong {
  value: number;
  errorTag: Tag;
  rationale: string;
}

/** Which two of the four wrong values are offered, and therefore where the key ranks. */
const PHRASE_PAIRINGS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [2, 3],
  [0, 2],
];

const builtAmountBox = pinSlot();

const discBuiltAmount = withPin(
  builtAmountBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'read-the-amount-a-phrase-names',
    draw: (r) => {
      const f = frame(r);
      const [morning, step] = r.pick(PHRASE_PAIRS);
      const evening = morning + step;
      const away = r.chance(0.5);
      const verb = away ? f.wentOut : f.wentIn;
      builtAmountBox.last = { params: { a: morning, b: step, op: '+' }, seed: r.uint() };
      const wrong: readonly Wrong[] = [
        {
          value: step,
          errorTag: 'task-comprehension',
          rationale:
            'Lifts the bare number out of the phrase and hands it back, as though the phrase named an amount all on its own.',
        },
        {
          value: morning,
          errorTag: 'representation-misread',
          rationale:
            'Gives back the count the phrase is measured from, which is the amount the morning had rather than the amount the evening had.',
        },
        {
          value: evening + step,
          errorTag: 'procedure-slip',
          rationale:
            'Builds the evening amount correctly and then puts the phrase number on a second time, so the step up is counted twice.',
        },
        {
          value: morning + evening,
          errorTag: 'concept-misconception',
          rationale:
            'Totals the whole day, which answers a question this story raises and does not ask on this page.',
        },
      ];
      // THE ASSERTION THAT EARNS THE PAIRINGS. Recomputed from the drawn pair on
      // every seed, so a future edit that let two options coincide — or let a
      // wrong value land on the key — throws during pack generation instead of
      // shipping a page with two right answers on it.
      const all = [evening, ...wrong.map((w) => w.value)];
      if (new Set(all).size !== all.length) {
        throw new Error(`b09 discBuiltAmount: ${all.join(', ')} are not four distinct wrong values beside one key`);
      }
      const [i, j] = r.pick(PHRASE_PAIRINGS);
      return {
        prompt: `In the morning ${countNoun(morning, f.noun)} ${verb}. In the evening ${fmtInt(step)} more ${verb} than in the morning. How many ${f.noun} was that in the evening?`,
        correct: String(evening),
        distractors: [
          { text: String(wrong[i].value), errorTag: wrong[i].errorTag, rationale: wrong[i].rationale },
          { text: String(wrong[j].value), errorTag: wrong[j].errorTag, rationale: wrong[j].rationale },
        ],
        hints: [
          'What is the evening count being measured against?',
          'Build the evening amount first, then read the question again.',
        ],
        errorTags: ['task-comprehension', 'representation-misread', 'concept-misconception'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// THE §4 ROW'S CHAIN — a lot changed twice
//
// Two things happen and the question is what is left at the end, which is the
// first page of the week where no single verb settles the direction. That is why
// this is the page the estimate-first probe rides on, and why the order of the
// two changes flips: a lot that grows then shrinks and a lot that shrinks then
// grows are the same arithmetic and a genuinely different read.
//
// The direction of the WHOLE story — whether it ends bigger than it started — is
// drawn first, and the triple comes from the pool that direction allows. Both
// pools are the same length, so nothing about the freshness guard's redraws can
// tilt the probe (header §8).
// ---------------------------------------------------------------------------

const msTwoChanges = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'story-changed-twice',
  draw: (r) => {
    const endsBigger = r.chance(0.5);
    const joinFirst = r.chance(0.5);
    const f = frame(r);
    const [start, big, small] = r.pick(TWO_CHANGE_ROWS);
    // The probe's side is WHICH OF THE TWO CHANGES ARRIVES, so both sides print
    // the same three numerals and the freshness guard has no side to prefer.
    const arrived = endsBigger ? big : small;
    const left = endsBigger ? small : big;
    const first = joinFirst
      ? `Then ${countNoun(arrived, f.noun)} ${f.wentIn}.`
      : `Then ${countNoun(left, f.noun)} ${f.wentOut}.`;
    const second = joinFirst
      ? `Then ${countNoun(left, f.noun)} ${f.wentOut}.`
      : `Then ${countNoun(arrived, f.noun)} ${f.wentIn}.`;
    return {
      prompt: `${cap(f.here)} held ${countNoun(start, f.noun)}. ${first} ${second} How many ${f.noun} are there now?`,
      initN: start,
      steps: joinFirst
        ? [
            { op: 'add', n: arrived, d: 1 },
            { op: 'sub', n: left, d: 1 },
          ]
        : [
            { op: 'sub', n: left, d: 1 },
            { op: 'add', n: arrived, d: 1 },
          ],
      units: f.noun,
      hints: [
        'How many things happen to this lot before the question?',
        'Do the first change, say the count out loud, then do the second.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * Six words, and a real fork: the two changes pull opposite ways and neither one
 * decides on its own, so a child who commits has had to weigh them against each
 * other. There is nothing left to decide afterwards, which is what a commitment
 * probe is for (L25).
 */
const predictTwoChanges = withEstimateFirst(msTwoChanges, 'will there be more at the end?');

// ---------------------------------------------------------------------------
// THE SECOND CHAIN — two people fill one lot, and the second amount is a phrase
//
// The trap and the chain in one page: the second helper's amount has to be built
// out of the first helper's before either can be joined. The lot starts empty and
// the story says so, because a story that quietly assumed an empty basket would
// be unanswerable and would look answerable.
//
// The two helpers are compared, and the comparison is bounded on purpose: the
// question is always the lot, never the gap, and no page asks who put in more.
// The difference between two standing amounts is B15's, and it is not asked here.
// ---------------------------------------------------------------------------

const msTwoHelpers = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'story-two-helpers',
  draw: (r) => {
    const f = frame(r);
    const [first, step] = r.pick(HELPER_PAIRS);
    const [a, b] = two(r);
    return {
      prompt: `${a} and ${b} filled ${f.here}. ${a} put in ${countNoun(first, f.noun)}. ${b} put in ${fmtInt(step)} more than ${a}. How many ${f.noun} are in ${f.here}?`,
      initN: first,
      steps: [
        { op: 'add', n: step, d: 1 },
        { op: 'add', n: first, d: 1 },
      ],
      units: f.noun,
      hints: [
        'Whose amount does this story hand you first?',
        'Build the second amount from the first, then join both lots.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE RELOCATED MISCONCEPTION — where the story stops and where the question does
//
// The recipe's error analysis names "answers the wrong question asked", and its
// sharpest form — reporting the count from between the two changes — is provably
// not derivable as a verify `wrong` (header §5). §E2.3's sanctioned move is to
// show it where it needs no `wrong` value at all, so it is a live option here,
// beside three other honest ones.
//
// The story is a POSSESSION rather than a container, which keeps it clear of the
// chain's own page: a child holds a lot, is given more, and gives some away. Only
// one order is drawn, because the rank rotation is carried by the pairings and
// flipping the order as well would move two things at once for no gain.
//
// PINNED to `d_verify_ratchain_v1`, which folds the item's own chain. Every option
// is a bare numeral, so the pin is load-bearing.
// ---------------------------------------------------------------------------

/** Which two of the four wrong counts are offered — the same rank rotation as the trap page. */
const HELD_PAIRINGS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [2, 3],
  [0, 2],
];

const halfwayBox = pinSlot();

const discHalfwayNumber = withPin(
  halfwayBox,
  'd_verify_ratchain_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'finish-the-story-before-answering',
    draw: (r) => {
      const f = frame(r);
      const [held, given, gaveAway] = r.pick(HELD_ROWS);
      const name = one(r);
      halfwayBox.last = {
        params: {
          initN: held,
          initD: 1,
          steps: [
            { op: 'add', n: given, d: 1 },
            { op: 'sub', n: gaveAway, d: 1 },
          ],
        },
        seed: r.uint(),
      };
      const ending = held + given - gaveAway;
      const wrong: readonly Wrong[] = [
        {
          value: held + given,
          errorTag: 'procedure-slip',
          rationale:
            'Stops as soon as the first change is done and reports the count from the middle of the story.',
        },
        {
          value: held + given + gaveAway,
          errorTag: 'concept-misconception',
          rationale: 'Joins every number the story prints, so the amount that left is added on as though it had arrived.',
        },
        {
          value: held - gaveAway,
          errorTag: 'task-comprehension',
          rationale: 'Carries out the second change and leaves the first one out, so the lot never receives what it was given.',
        },
        {
          value: held - given - gaveAway,
          errorTag: 'representation-misread',
          rationale: 'Reads both changes as things going away, so the arrival is taken off instead of put on.',
        },
      ];
      const all = [ending, ...wrong.map((w) => w.value)];
      if (new Set(all).size !== all.length) {
        throw new Error(`b09 discHalfwayNumber: ${all.join(', ')} are not four distinct wrong counts beside one key`);
      }
      if (Math.min(...all) < 1) {
        throw new Error(`b09 discHalfwayNumber: ${all.join(', ')} contains a count below one`);
      }
      const [i, j] = r.pick(HELD_PAIRINGS);
      return {
        prompt: `${name} had ${countNoun(held, f.noun)}. ${name} was given ${fmtInt(given)} more ${f.noun}. Then ${name} gave ${fmtInt(gaveAway)} away. How many ${f.noun} are left?`,
        correct: String(ending),
        distractors: [
          { text: String(wrong[i].value), errorTag: wrong[i].errorTag, rationale: wrong[i].rationale },
          { text: String(wrong[j].value), errorTag: wrong[j].errorTag, rationale: wrong[j].rationale },
        ],
        hints: [
          'Where does this story stop, and where does the question stop?',
          'Follow both changes right to the end before you choose.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception', 'task-comprehension'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// Day 5, first page — the one slip in this week that code can produce
//
// One operand pair and two operations: the two counts of a change-unknown story
// under `-` give how far apart they are, which is what the story really changed,
// and the same pair under `+` gives them joined, which is what the child wrote.
// Neither number is chosen by an author and QG-11 recomputes both from the
// shipped params.
//
// Nothing on the page says a mistake has been made. There are two counts, a
// question, and somebody's answer to it; diagnosing it is the child's job, so the
// page cannot do that job for them (L25). The arithmetic is flawless, too —
// six and eleven really do make seventeen — so re-checking the sum finds nothing
// at all. What gives the answer away is that no lot on that page was ever big
// enough to lose seventeen of anything.
// ---------------------------------------------------------------------------

const eaWrongMove = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const [small, big] = r.pick(EA_COUNTS);
    return { a: big, b: small, op: '-', wrongOp: '+' };
  },
  build: (v, p, r) => {
    const f = frame(r);
    const opened = Number(p.b);
    const closed = Number(p.a);
    const name = one(r);
    return {
      prompt: `${cap(f.here)} held ${countNoun(opened, f.noun)}. More ${f.noun} ${f.wentIn}. Now there are ${countNoun(closed, f.noun)}. ${name} works out that ${fmtInt(Number(v.wrong))} ${f.wentIn}.`,
      extension:
        'Write one sentence about the size of that number. Then write the count the story really changed by.',
      hints: [
        'Could a change be bigger than the whole lot it happened to?',
        'Work out how far apart the two counts in this story are.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
      answerKeywords: [
        'the two counts were joined when the story wanted the distance between them',
        'nothing that arrives can be bigger than the lot it arrives into',
        'count up from the first number to the second one',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, second page — the child supplies the story, not the answer
//
// Authored, and pinned to one number sentence on purpose. What is being marked is
// a story a child invents, and a class of them can only be read side by side if
// everyone started from the same sentence.
//
// The sentence is a take-away, which is the harder of the two to write: a child
// who has only met "and then some more came" has to reach for the other frame,
// and the three-part instruction is there so that a story with no beginning — the
// commonest thing a six-year-old produces — is visibly incomplete against the
// prompt rather than merely disappointing.
// ---------------------------------------------------------------------------

const reasoningWriteStory = reasoning({
  prompt:
    `Write a story that this number sentence tells: 12 ${MINUS} 5 = 7. Say what there was, what happened, and what there is now.`,
  value: 'a story that starts with 12 of something, has 5 of them go away, and ends with 7',
  acceptableForms: ['12', 'went away', 'were taken', 'were eaten', '7 left', 'there are 7'],
  keywords: true,
  hints: [
    'What are the three parts every story this week has had?',
    'Say what there was first, then what happened, then what is there now.',
  ],
  errorTags: ['task-comprehension', 'concept-misconception'],
});

/**
 * The week's own rule handed to the child to settle rather than announced.
 *
 * "Sometimes" is the honest answer, and settling it needs one story of each kind
 * — which is a proof a six-year-old can actually carry out, unlike most claims
 * about "always". A lot that grows finishes larger than anything printed on the
 * page; a lot that shrinks does not. Neither wrong option is padding: a child
 * whose stories have all been arrivals will say always, and a child who hears the
 * biggest number as the thing the story is ABOUT will say never.
 */
const asnBiggestIsTheAnswer = classify({
  prompt:
    'Always, sometimes or never true? The biggest number in a story is the answer. Then write one sentence saying how you know.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale: 'Holds every story as a joining story, so the answer is expected to be bigger than anything printed.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale: 'Reads the biggest number as the lot being talked about, so it can never also be the thing wanted.',
    },
  ],
  hints: [
    'Think of a story where something left the lot. Where is the answer?',
    'Try one story of each kind and look at where the answer lands.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB09 = makeWeekBuilder({
  level: 'B',
  week: 9,
  conceptId: 'story-problems-within-20',
  conceptName: 'Story problems within 20',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [A16, B5, B7, B8],
  pedagogyContract: 'v2',
  conceptualAnchor: 'the story frame',
  conceptFamily: 'operation',
  deepeningDelta:
    'Every adding and taking-away week so far handed the child a job already written down, or a picture of one. B5 said which two numbers to bridge, B7 printed a box where the unknown went, and B8 laid the three numbers out and asked which sentences they could write. The arithmetic climbed and the reading did not, because there was almost nothing to read. B9 does not advance the arithmetic at all — every sum here sits inside twenty and most were fluent by B5 — and puts the whole of the new load on the sentence. What is new is the story frame: what there was, what happened, what there is now, with two of the three printed and the third wanted. That reframes B7 rather than repeating it, because the missing part is no longer marked with a box and can be any of the three; and it hands B15 the contrast it is built on, since B15 takes the same words into stories where nothing happens at all and the question is which of two things the sentence wants. B24 then removes the last support by making the verbs unreliable, which only works because this week made them reliable first.',
  explanation: {
    hook: 'Two numbers sit on the page and a third one hides. The story says where.',
    whyBeforeHow:
      'A six-year-old who cannot start a word problem is almost never stuck on the arithmetic. Ask them what eight and five make and they will tell you. Now put the same sum inside four sentences about a basket. They will look for a signal instead. It might be a word they have been told means add. It might be simply the two numbers with a plus between them. That is a guess. It works often enough to survive and rarely enough to hurt. The repair is the story frame. It is worth teaching as a shape, because a shape can be checked. A hunch cannot be checked at all. A story about a lot of things has three parts. They are what there was, what happened, and what there is now. Two of the three are always printed and the question always wants the third. So the first move on any of these pages is not arithmetic at all. It is reading twice and asking which of the three is missing. Once that is settled the arithmetic settles itself. There is only ever one sensible thing to do with the two numbers left. That is also why the same three numbers can want different moves. Different pages can ask differently without anything having tricked anybody. A story that joins can still need a count upwards. That happens when the part it withholds is the join itself. The basket held six, more went in, and now there are eleven. So finding what went in means walking from six up to eleven. Nothing lied. The verb told the truth about what happened. It was never the verb job to say which of the three parts was missing. One more thing runs through the week and it is the thing children find hardest. The numbers printed in a story are not always the numbers you use. A sentence might say three more went in than in the morning. It has named an amount without printing it. A child who reaches for the three has answered a question nobody asked. Building that amount first is the habit these pages are here to lay down. Build it before anything is joined or taken.',
    script: [
      {
        say: 'A story has three parts. There were 8 damsons. Then 5 more went in.',
        visual: 'A lot of 8 damsons, and beside it the 5 that arrived, brought together.',
        figure: joinPicture(8, 5, 'damsons'),
      },
      {
        say: 'What there was, what happened, what there is now. Two are printed. One is the question.',
      },
      {
        say: 'Here it goes the other way. There were 14 oatcakes. Then 6 were eaten.',
        visual: 'A lot of 14 oatcakes with 6 of them crossed through.',
        figure: leavePicture(14, 6, 'oatcakes'),
      },
      {
        say: 'Sometimes the middle part hides. There were 6, more went in, and now there are 11.',
      },
      {
        say: 'One habit before I stop. I check whether my answer is a size this story could hold.',
      },
    ],
    summary:
      'Every story here has three parts: what there was, what happened, what there is now. Two are printed and the third is the question.',
    vocabulary: [
      { term: 'story frame', kidGloss: 'the three parts of a story — what there was, what happened, what there is now' },
      { term: 'the change', kidGloss: 'the amount that came or went while the story was happening' },
      { term: 'more than', kidGloss: 'a way of naming an amount by counting on from another one' },
    ],
  },
  guidedExamples: [
    {
      ...ge(9, 1, 'modeled', 'The tin held 9 oatcakes. Then 6 more were stacked in. How many oatcakes are there now?', [
        {
          teacherSay:
            'Watch me. I read it twice before I write anything. The first read tells me what happened. The second tells me which part is missing.',
        },
        {
          teacherSay: 'There were 9. What happened is that 6 arrived. So which part is the question after?',
          expected: 'what there is now',
        },
      ], '15'),
      // The picture appears on this example and in the script, nowhere else. Fifteen
      // is written underneath it, so what the drawing demonstrates is the shape of
      // the frame and not the size of the answer (kit §E2.5).
      visual: 'A lot of 9 oatcakes, and beside it the 6 that arrived, brought together.',
      figure: joinPicture(9, 6, 'oatcakes'),
    },
    {
      ...ge(9, 2, 'completion', 'The jug held 13 bluebells. Some were taken out. Now there are 8. How many were taken out?', [
        { teacherSay: 'Which two parts of the frame are printed here?', expected: 'what there was and what there is now' },
        { childDo: 'Start at 8 and count up to 13. The steps you count are the answer.', expected: '5' },
      ], '5'),
      // The fade begins one example early, because the missing part on this page is
      // the change and drawing a change means drawing the answer (header §6).
      visual: 'Nothing drawn — the part that moved is the part the question wants.',
    },
    {
      ...ge(9, 3, 'prompted', 'The tub held 7 pompoms. Ria pushed in 4 more pompoms than the tub held. How many did Ria push in?', [
        { childDo: 'Work out what the phrase names before you write anything down.', expected: '11' },
      ], '11'),
      visual: 'No picture here either — drawing the phrase would mean working it out first.',
    },
    {
      ...ge(9, 4, 'independent', 'The case held 12 plasters. Then 3 were used. Then 5 more were slipped in. How many now?', [
        { childDo: 'Do one change, say the count out loud, then do the other.', expected: '14' },
      ], '14'),
      visual: 'No picture — this one is held in the head from start to finish.',
    },
  ],
  days: [
    // Day 1 — the three frames, met in order: two lots standing still, a lot that
    // changes once, a phrase that names an amount, and one story two people fill.
    [
      { gen: wFillTheTen, diff: 2 },
      { gen: sitAltogether, diff: 2 },
      { gen: sitResultUnknown, diff: 2 },
      { gen: sitBuiltAmount, diff: 3 },
      { gen: msTwoHelpers, diff: 3 },
    ],
    // Day 2 — the missing part moves to the middle of the frame, the trap arrives,
    // and the two-change story asks for a commitment before any working.
    [
      { gen: wBoxOnTheLabel, diff: 2 },
      { gen: sitChangeUnknown, diff: 3 },
      { gen: discBuiltAmount, diff: 3 },
      { gen: predictTwoChanges, diff: 4 },
      { gen: sitResultUnknown, diff: 3 },
    ],
    // Day 3 — two warm-ups of different formats open the hardest day, and then a
    // page that asks where the story stops sits beside the chain and a
    // change-unknown, so three quite different questions arrive wearing the same
    // short sentences. This slot held a second trap page in the first draft; it
    // was swapped because the trap page is answered by adding the two printed
    // numbers, and the pack was leaning on that habit (header §7).
    [
      { gen: wRelatedFact, diff: 2 },
      { gen: wFillTheTen, diff: 2 },
      { gen: discHalfwayNumber, diff: 3 },
      { gen: predictTwoChanges, diff: 4 },
      { gen: sitChangeUnknown, diff: 3 },
    ],
    // Day 4 — application: the standing lots return beside the trap, then the page
    // that asks where the story stops, then the chain with two helpers.
    [
      { gen: wBoxOnTheLabel, diff: 2 },
      { gen: sitAltogether, diff: 3 },
      { gen: sitBuiltAmount, diff: 3 },
      { gen: discHalfwayNumber, diff: 3 },
      { gen: msTwoHelpers, diff: 4 },
    ],
    // Day 5 — a worked slip taken apart, a story written from a sentence, and the
    // week's rule argued over.
    [
      { gen: wRelatedFact, diff: 2 },
      { gen: eaWrongMove, diff: 4 },
      { gen: reasoningWriteStory, diff: 3 },
      { gen: asnBiggestIsTheAnswer, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the fastest way to help this week is to stop asking "what do you do?" and start asking "which bit is missing?". Say a story out loud while you are doing something ordinary — there were six plums in the bowl, I ate two, how many now — and then say the same story with a different bit left out: there were six, I ate some, now there are four. The second one is much harder and it is the one worth repeating, because the answer is found by counting up from four to six even though the story took plums away. If your child answers the first number they hear, do not correct the number. Ask them to say the story back to you in three parts, and the missing one usually announces itself. The one to listen out for is a sentence like "three more went in than yesterday". A lot of children will answer three. Ask how many actually went in, count it out on fingers, and then ask the original question again — the gap between those two answers is exactly what this week is for. A handful of buttons and a saucer is all the equipment any of this needs.',
  ],
  puzzle: (r) => {
    // RUN THE STORY BACKWARDS — a move no page of the week makes.
    //
    // Every core page walks forwards from a count the story hands over. Here the
    // count at the START is the thing missing, so the child has to undo two
    // changes in reverse order to recover it. That is the same frame read the
    // other way round, and there is nothing on Day 1 that reads it that way.
    //
    // No picture: reconstructing the lot IS the puzzle, and any drawing of the
    // opening lot is the answer.
    const f = frame(r);
    const [start, big, small] = r.pick(TWO_CHANGE_ROWS);
    const grows = r.chance(0.5);
    const arrived = grows ? big : small;
    const left = grows ? small : big;
    const ending = start + arrived - left;
    // THE PUZZLE CHECKS ITS OWN ANSWER BY RUNNING ITSELF BACKWARDS. Reversing the
    // printed story must land on the count the story was built from, and the two
    // changes must not be the same size. Either failure throws at pack-generation
    // time on every seed, so a later edit to a pool cannot ship a puzzle whose
    // opening count is unrecoverable or whose moves cancel.
    if (ending + left - arrived !== start) {
      throw new Error(`b09 puzzle: undoing ${arrived} in and ${left} out of ${ending} does not rebuild ${start}`);
    }
    if (arrived === left) {
      throw new Error(`b09 puzzle: ${arrived} in and ${left} out cancel, so the opening count is not recoverable`);
    }
    return {
      id: 'B9-PZ-01',
      title: 'Puzzle Grove: Wind the Story Back',
      puzzleType: 'logic',
      prompt: `Some ${f.noun} were in ${f.here}. Then ${countNoun(arrived, f.noun)} ${f.wentIn}. Then ${countNoun(left, f.noun)} ${f.wentOut}. Now there are ${countNoun(ending, f.noun)}. How many were there at the start?`,
      answer: {
        value: String(start),
        acceptableForms: [countNoun(start, f.noun)],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which part of the frame is missing this time?',
        'Start at the count on the last line and put the story into reverse.',
      ],
      errorTags: ['task-comprehension', 'procedure-slip'],
    };
  },
  // A core page is handed the opening count and walks forwards. This page is
  // handed the closing count and has to walk back through both changes, undoing
  // each one. Nothing on Day 1 travels in that direction.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'undo-the-story' },
  // DD11 wants a source settled at least two weeks earlier, and the harder part is
  // picking a fluency the pages actually stand on. `STEP_ROWS` forces every
  // single-change growing story past ten, deliberately: a story whose total stays
  // under ten is answered before it has been read, and a child who is still
  // assembling those totals spends the page on the crossing and never arrives at
  // the frame at all.
  sprint: {
    skill: 'Sums that cross ten — the arithmetic every growing story in this week runs through',
    sourceWeek: B5,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_100_facts_v1',
    params: { min: 3, max: 9, sumMin: 11, sumMax: 18 },
  },
  mastery: [
    { gen: sitResultUnknown, diff: 3 },
    { gen: sitChangeUnknown, diff: 3 },
    { gen: sitBuiltAmount, diff: 3 },
    { gen: discBuiltAmount, diff: 3 },
    { gen: discHalfwayNumber, diff: 3 },
    { gen: msTwoHelpers, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: a lot changed once with the end withheld, and the direction redrawn per form, so a form cannot be passed by remembering whether the last one added. 02: the same lot at two moments with the change withheld, its direction likewise redrawn. 03: an amount named by a phrase, with a fresh count and a fresh step. 04: the trap as a choice, with the pair of wrong values rotated so the key does not sit at the same rank on both forms. 05: the two-change possession story, with the pairing rotated for the same reason. 06: the two-helper chain, with a fresh first amount and a fresh step. Three generators are deliberately ABSENT from both forms: the two standing lots, which is settled B5 arithmetic wearing a sentence and belongs on a teaching page; the two-change chain, which is served only through its estimate-first wrapper and so lends the child the decision a certificate has to measure; and the Day-5 pages, which want a written argument rather than a key. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'task-comprehension',
      subtype: 'lifts-the-number-out-of-the-phrase',
      description:
        'Reads a phrase like "three more than the morning" as though the three were the amount itself, so the number that is printed is handed back and the amount it was measuring is never built.',
      exampleWrongAnswer: '3 given as the evening count when 3 more went in than the morning count of 7',
      distractorRationale:
        'Offer it as a live option on the phrase page, where every other option is also a whole count built from the same two numbers, so it cannot be struck out for looking wrong.',
      reteachPointer: 'guidedExamples/B9-GE-03 (work out what the phrase names before you write anything down)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'joins-the-two-counts-of-one-lot',
      description:
        'Meets a story that prints the same lot at two moments and puts the two counts together, which treats a beginning and an end as two separate piles and produces a change larger than the lot it happened to.',
      exampleWrongAnswer: '17 given as the amount that went in when a lot of 6 became a lot of 11',
      distractorRationale:
        'Show it worked on the Day-5 error analysis, where the operation swap generates it, and offer it on the two-change page as the count that joins every number the story printed.',
      reteachPointer: 'explanation/script[3] (sometimes the middle part hides)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'stops-at-the-middle-of-the-story',
      description:
        'Carries out the first change correctly, arrives at a true count, and reports it — which is right about the middle of the story and wrong about the question, since a second change has still to happen.',
      exampleWrongAnswer: '15 given as the ending count of a story that reached 15 and then gave 4 away',
      distractorRationale:
        'Offer it on the two-change page as one of three counts the story itself produces, so telling it from the answer needs the story followed to the end rather than the arithmetic rechecked.',
      reteachPointer: 'guidedExamples/B9-GE-04 (do one change, say the count out loud, then do the other)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'hands-back-a-number-that-is-printed',
      description:
        'Answers with a number lifted straight off the page — the count a phrase is measured from, or the lot before anything happened — so the answer is true of the story somewhere and true of the question nowhere.',
      exampleWrongAnswer: '7 given as the evening count when 7 is the morning count the phrase was measured from',
      distractorRationale:
        'Offer the measured-from count beside the built amount on the phrase page, and offer the reversed reading of both changes on the two-change page, so a printed number always has an honest rival.',
      reteachPointer: 'explanation/vocabulary (more than — a way of naming an amount by counting on from another one)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'crossing-ten-not-yet-quick',
      description:
        'Assembles each crossing of ten from the beginning every time. That is honest arithmetic and slow arithmetic, and the reading these pages are really about gets whatever attention is left.',
      exampleWrongAnswer: 'eight and five counted up one at a time on every growing story of the week',
      distractorRationale:
        'A slow-but-correct sum needs no distractor and would make a dishonest one, so it is met by the Day-3 sprint and by the bridge warm-up instead of on a page.',
      reteachPointer: 'explanation/script[0] (there were 8 damsons, then 5 more went in)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Word problems inside twenty, and one shape that makes them readable: what there was, what happened, what there is now. Two of the three are printed and the question wants the third. The arithmetic stayed easy on purpose — the work this week was all in the reading.',
    improvingCandidates: [
      'saying which part of a story is missing before doing any arithmetic',
      'finding a change by counting up from the smaller count to the bigger one',
      'working out the amount a phrase names before using it',
    ],
    strengtheningByTag: [
      {
        errorTag: 'task-comprehension',
        text: 'building the amount a phrase describes, rather than answering with the number the phrase happens to print',
      },
      {
        errorTag: 'concept-misconception',
        text: 'reading two counts of one lot as a beginning and an end, not as two separate piles to be added',
      },
      {
        errorTag: 'procedure-slip',
        text: 'following a story with two changes all the way to the end before answering',
      },
      {
        errorTag: 'fact-recall',
        text: 'getting the sums that cross ten to arrive without effort, which is what the Day-3 sprint is for',
      },
    ],
    homeFocus: {
      praiseLine:
        'You read that story twice and noticed which part was missing, then checked that your answer was a size the story could hold.',
      questionForChild: 'Which part of that story is missing — what there was, what happened, or what there is now?',
      schoolSyncHook:
        'School may call these word problems, story sums or problem solving, and may talk about join and separate stories where we say what happened. The three parts underneath are the same, so use whichever words come home.',
    },
    vocabularyForParent: [
      'story frame (the three parts of any story about a lot of things: what there was, what happened, what there is now)',
      'change-unknown (a story that prints the beginning and the end and asks what happened in between)',
      'more than (a phrase that names an amount by measuring it from another one, so the number printed is not the amount)',
    ],
  },
});
