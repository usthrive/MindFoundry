/**
 * Level B · Week 10 — "Adding tens" (conceptId: adding-tens).
 *
 * FILL-ARCHITECTURE §4 row B10: anchor "tens-blocks"; multi-step "+tens then
 * +ones"; error-analysis "40+30=43"; discrimination "40+30 vs 40+3"; Day-5
 * signature "tens-pattern hunt". Catalog cell: computational focus "34+20,
 * 57+30; multiples of 10 on the hundred chart"; non-computational focus
 * "Hundred-chart movement puzzles (down = +10)".
 *
 * ── 1. THE IDEA ─────────────────────────────────────────────────────────────
 *
 * A child who can add four and three cannot yet add forty and thirty, and the
 * gap between those two sentences is the whole week. What closes it is not a
 * procedure but a re-description of what a two-digit number is made of:
 *
 *     A WHOLE TEN IS ONE THING. FOUR OF THEM AND THREE OF THEM ARE SEVEN OF
 *     THEM, EXACTLY AS FOUR APPLES AND THREE APPLES ARE SEVEN APPLES. SEVEN
 *     WHOLE TENS IS WRITTEN 70.
 *
 * Tens count like ones, once they are counted AS TENS. That sentence buys the
 * whole of this week's arithmetic from a fact the child has held since band A,
 * and it buys the week's second claim with it: if only the tens changed, only
 * the tens digit can change. Thirty-four with twenty put on is fifty-four, and
 * the four never moves. The loose ones are passengers.
 *
 * That invariant is worth more here than the sums are. It is what makes an
 * answer checkable by a six-year-old with no method at all — read the last
 * digit of the number you started with, read the last digit of the number you
 * wrote, and if they differ, something went wrong that has nothing to do with
 * how good your adding is. Every page of this week can be checked that way, the
 * puzzle turns on it, and Day 5 asks the child to state it.
 *
 * ── 2. WHAT B10 OWNS, USES, AND HANDS ON ────────────────────────────────────
 *
 * Nine siblings point at this cell from inside their own files. Whatever one of
 * them has already told its reader about this week is a constraint on it rather
 * than a compliment (kit §E2.8), so every one of those sentences is reproduced
 * below in the form it was written.
 *
 * OWNED — introduced here, assessed here, assumed nowhere earlier:
 *
 *   (a) ADDING WHOLE TENS, IN BOTH OF ITS SHAPES. b03: "**B10 owns adding
 *       tens** (40 + 30)". b24: "**B10 owns adding tens.**" b07 and b09 both
 *       say "B10/B11 HAVE TENS". b04: "**B10/B11 own adding tens and crossing a
 *       ten**". So the whole-ten sum is here, and so is the catalog's own
 *       second shape, a two-digit number with whole tens put on it: "34+20,
 *       57+30". `sitWholeTensJoin` is the first, `sitTensArrive` the second.
 *   (b) THE ONES DIGIT AS A PASSENGER. Named in `explanation.vocabulary` as
 *       "loose ones", walked round the script, settled on Day 5 as an
 *       always/sometimes/never claim, and used as the deduction the puzzle
 *       turns on. No earlier week states it: B2 says what 47 is MADE of, which
 *       is a fact about one number standing still; this is a fact about what
 *       happens to it.
 *   (c) A MOVE OF SEVERAL ROWS DOWN THE HUNDRED CHART. b13 says it in as many
 *       words — "B10 (adding whole tens on the hundred chart)" — and its own
 *       B10 warm-up is a counter moving down two to four rows. The catalog
 *       gives this week the chart twice over ("multiples of 10 on the hundred
 *       chart"; "Hundred-chart movement puzzles (down = +10)"). `sitRowsDown`
 *       is the page and the puzzle is its inverse.
 *   (d) COUNTING A TOTAL IN WHOLE TENS. b12 wants "B10 (adding tens) — the
 *       counting and tens work every schedule sum on Day 4 leans on"; b16 wants
 *       "B10 (adding tens — counting dimes)". A row of dimes and a run of ten
 *       minutes are both answered by knowing how many whole tens a lot holds
 *       after something has been added to it, which is `sitHowManyTens` — the
 *       one page here whose answer is a count of tens rather than a total.
 *   (e) THE TRAP THAT NAMES THE WEEK: A WHOLE TEN IS NOT A ONE. The recipe
 *       states it as an arithmetic (40+30=43) and it is this week's central
 *       misconception; §5 says where it is shown and why it is not shown as a
 *       worked slip.
 *
 * USED HERE, TAUGHT SOMEWHERE ELSE, AND CREDITED TO WHOEVER TAUGHT IT:
 *
 *   · B2'S TENS AND ONES. What 47 is made of is B2's, entirely: b24 states it —
 *     "**B2 owns tens-and-ones**" — and this week never asks a child to build a
 *     number from a tens count and a ones count as its own work. It is the
 *     first warm-up, it is how the script describes 34 before anything is added
 *     to it, and `sitHowManyTens` borrows B2's bundling picture for the
 *     counting it asks for.
 *   · B3'S COMPARISON. Deciding which of two two-digit numbers is bigger by
 *     looking at the tens first is B3's page, and it is a warm-up here because
 *     it rehearses the same claim from the other side: the tens column decides.
 *     `wWhichIsGreater` draws pairs where the ones digit points the wrong way,
 *     which is b03's own trap replayed rather than re-taught.
 *   · A22'S COUNTING IN TENS AND ITS TENS-TOWERS. "Count by tens, how many
 *     tens" is A22's row. `wCountTens` is that item, unchanged in substance,
 *     and it is where the ten-block on this week's pages comes from.
 *   · B1'S HUNDRED CHART, AND ITS SINGLE STEP DOWN. b03 draws the line for us
 *     inside its own file — "exactly ONE whole ten is ever added, so this is
 *     B1's chart step and not B10's" — so the chart itself and the one-row step
 *     are B1's, borrowed in `wStepDown`, and this week's own chart page always
 *     moves two rows or more.
 *
 * HANDED ON — owned by a week that already has it, so absent here:
 *
 *   1. B11 HAS TWO-DIGIT + ONE-DIGIT, AND IT HAS ALL OF IT. b03 states the
 *      split this week is relying on: "**B10 owns adding tens** (40 + 30) and
 *      **B11 owns two-digit + one-digit**". So 40 + 7 is not this week's, and
 *      the boundary is enforced rather than intended: EVERY amount added
 *      anywhere in this pack is a multiple of ten, asserted at construction
 *      time in `wholeTens()`, which throws on any addend that is not. No ones
 *      digit ever meets another ones digit, nothing crosses a ten in the ones
 *      column, and the "crosses-ten vs not" contrast B11's row is built on is
 *      left intact for B11 to spend.
 *      THE RECIPE'S OWN TWO-STEP IS WHERE THIS BITES, and the deviation is
 *      declared rather than buried. Row B10 offers "+tens then +ones" as the
 *      gentle two-step; the second half of that is B11's page by b03's ruling,
 *      and taking it would spend B11's week nine days early. What is kept is
 *      the tens half, doubled: `msTwoLoads` puts whole tens on twice over, and
 *      `msThreeTensLots` joins three whole-ten lots. The "+ones" half survives
 *      only as a DESCRIPTION — the script says the four loose ones come along
 *      unchanged, which is a statement about what did NOT happen to them, and
 *      no item anywhere asks a child to add ones to anything.
 *   2. B13/B14 HAVE THE WRITTEN COLUMN AND THE TRADE. b13's own header lists
 *      this week among what it retrieves from — "B10 (adding whole tens on the
 *      hundred chart)" — and keeps the algorithm: its anchor is "trade ten ones
 *      for a ten". Nothing here can need one. Every total in this pack is at
 *      most ninety-nine, asserted in every pool; the ones column never receives
 *      anything, so it can never spill; and no page prints a sum in columns or
 *      asks for one to be written down. This is a reasoning-with-tens week, and
 *      the reasoning is finished before a written method would begin.
 *   3. B18 HAS SKIP COUNTING IN TENS. The two look identical on the page and
 *      they are not the same question, so the line is drawn by construction and
 *      not by hope. b18 states what it wants from here: "B10 (adding a whole
 *      ten, the arithmetic a tens count runs on)" — the arithmetic of ONE rung
 *      is this week's, the RUN of rungs is B18's. What follows from that, and
 *      is enforced everywhere:
 *        · NO PAGE HERE PRINTS A SEQUENCE. Not one prompt shows a run of
 *          landings, asks what comes next, or names a first hop and a second.
 *          B18's page is a track; there is no track in this file.
 *        · THE ARRIVING TENS ARRIVE AS ONE AMOUNT. A story says thirty more
 *          came, never "three lots of ten came" — the second is a count of
 *          hops, which is B18's unit and C7's later.
 *        · NO HINT SAYS "COUNT ON IN TENS". Every rung-2 in this pack names the
 *          tens as a quantity to be joined ("put the tens together", "add the
 *          whole tens on"), never as steps to be walked.
 *      The one page where a child MAY walk is `sitRowsDown`, because a chart
 *      has rows and a finger can travel down them. It is still not B18's: the
 *      question is what a row is WORTH, the rows are given as a single count
 *      rather than met one at a time, and b13 has already assigned this exact
 *      move to this cell.
 *   4. B7 HAS THE MISSING PART. No page here states a total and asks what was
 *      added, and no `▢` appears anywhere in the pack. The puzzle comes nearest
 *      and stays clear: it withholds the LANDING, not the move.
 *   5. B19 HAS DOUBLES. Every pair of whole-ten lots this week draws is
 *      UNEQUAL, so no page can be passed by doubling or halving, and the
 *      three-lot chain is barred from drawing three equal lots.
 *   6. B20 AND C6 HAVE GROUPS. A ten is named as a unit here, never as a group
 *      to be counted a number of times: no page says "three lots of ten", no
 *      array is drawn, and no question asks how many groups there are.
 *   7. B15 HAS COMPARISON STORIES AND B14 THE TAKE-AWAY. Nothing in this pack
 *      is taken away, no difference is asked for, and the minus sign does not
 *      appear on any surface a child sees (§4).
 *
 * ── 3. THE LINE BETWEEN THIS WEEK AND B18, STATED ONCE MORE ────────────────
 *
 * It is worth one paragraph on its own, because "40 + 30" and "count on in tens
 * from 40" reach the same number and are not the same thought.
 *
 *     B18 ASKS WHERE A COUNT GETS TO. B10 ASKS WHAT TWO TENS-AMOUNTS MAKE.
 *
 * The test is whether the intermediate numbers exist. A child counting on in
 * tens from forty says fifty, sixty, seventy, and each of those is a real place
 * the count has been; the landing is the last one said. A child adding forty
 * and thirty says seven tens and writes 70, and fifty and sixty were never
 * anywhere. That is why every hint here counts TENS rather than counting IN
 * tens, why no prompt in this file prints two landings in a row, and why the
 * sprint drills sums within ten — the tens counts a whole-ten sum is really
 * adding — instead of a tens sequence, which is what b03 already drills from
 * A22 and what b18 will own outright.
 *
 * ── 4. THE SYMBOLS ─────────────────────────────────────────────────────────
 *
 * Exhaustively: the digits. There is no `+`, no `=`, no `−`, no `▢`, no `>` or
 * `<`, no `×` or `÷`, and no `n/d` on any child surface in this pack — every
 * page states its arithmetic in words. That is not an accident of style: the
 * whole risk of this week is a child reading a written sum digit by digit and
 * concluding that 40 + 30 has a 4, a 3 and therefore a 43 in it, and prose
 * gives the misconception nothing to stand on while the idea is being built.
 * B6 owns the equal sign, B13 owns the written column, and both are welcome to
 * the notation once this claim is secure. The op-chain params carry
 * `{op:'add'}` internally, which is the library's vocabulary and is not a child
 * surface — b18 made the same declaration about its own `{op:'mul'}`.
 *
 * ── 5. WHERE THE VERIFY LIBRARY STOPS, AND WHAT WAS DONE ABOUT IT ──────────
 *
 * L36 says prove impossibility FIRST, so the recipe's misconception was pushed
 * until it either derived or provably could not. It could not, and the proof is
 * two lines rather than an opinion.
 *
 * THE RECIPE'S OWN SLIP IS AN OPERAND SUBSTITUTION, AND THE LIBRARY VARIES ONLY
 * THE OPERATION. Write the story's numbers as a start `s` and an arriving
 * amount `10k`. The true answer is `s + 10k`. The child who writes 43 for
 * 40 + 30 has added `k` where `10k` belonged — they read the arriving number's
 * tens digit as a count of ones — so the wrong value is `s + k`. Now ask which
 * operand pair `d_verify_binop_misconception_v1` would need:
 *
 *     to PRODUCE `s + k`  the pair must be `(s, k)`   → its other three
 *                          operations give `s − k`, `s·k`, `s/k`, and the true
 *                          answer `s + 10k` is none of them;
 *     to PRODUCE `s + 10k` the pair must be `(s, 10k)` → its other three give
 *                          `s − 10k`, `10sk`, `s/10k`, and the wrong value
 *                          `s + k` is none of them.
 *
 * The pair that makes the truth cannot make the slip and the pair that makes
 * the slip cannot make the truth, which is §E2.12's proved class ("picks the
 * wrong one of the two givens") wearing this week's clothes. Checked
 * exhaustively as well as argued, because an argument about a different week is
 * only a hint about this one: over all 96 rows `DISC_ROWS` can draw, every
 * operand pair taken from the quantities the story prints or names
 * (`s`, `10k`, `k`, `t`, `o`, `10t`, `10`), and all twelve ordered
 * `{op, wrongOp}` pairs, ZERO combinations return both values. The recipe's own
 * instance was then checked without the story-quantity restriction at all:
 * `70 = a ∘ b` together with `43 = a ∘' b` has no solution over any integer pair
 * up to two hundred, because `{+,−}` forces `b = 13.5`, `{+,×}` forces two
 * factors of a prime to sum to 70, and every remaining pairing needs a
 * non-integer quotient. Recorded so nobody spends the ten minutes again.
 *
 * TWO FURTHER LIBRARY LIMITS, PROVED HERE RATHER THAN ASSUMED FROM §E2.12:
 *   · `e_verify_int_addsub_v1` IS A SECOND STRUCTURAL NULL AT LEVEL B, beside
 *     the comparison one the kit already records. Its `add-magnitudes` mode
 *     returns `sign(a)·(|a|+|b|)`, which for two positive addends is exactly
 *     `a + b`, so its own `wrong === correct` guard throws on every draw a
 *     week without negative numbers can make. `sign-dropped` throws for the
 *     same reason. Neither is reachable from a tens week at all.
 *   · THERE IS NO PLACE-VALUE TRANSFORM. What "counted the tens as ones" claims
 *     is that a digit was read in the wrong column, which is a statement about
 *     a NUMERAL rather than about a pair of numbers. `a_verify_teen_write_v1`
 *     is the corpus's only digit-level transform and it reverses the digits, so
 *     fed 70 it returns "07" — a string no child writes and no page can show.
 *     Building the right one means editing `lib/`, which is not a week's to
 *     edit (kit §G).
 *
 * A DERIVATION THAT WORKS AND WAS REJECTED ANYWAY, recorded because the search
 * found it and the rule refused it. Over the pair `(b, 10)` — the number of
 * whole tens and what one of them is worth, both real quantities of a
 * tens-block story — `{op:'*', wrongOp:'+'}` gives `correct = 10b` and
 * `wrong = b + 10`: "six tens" answered as sixteen. It type-checks, it would go
 * green, and both operands are printed. It is still not this week's item,
 * because the transform is not the move: a child who writes 16 for six tens has
 * mistaken a teen number for a tens count, which is A23's misconception and
 * A9's confusion, and showing it here would spend a Level-B page rejecting an
 * error the child left behind at band A. b08's rule — the shown wrong value
 * must be arrived at by the operation the child actually performed — refuses
 * it, and so does this file.
 *
 * WHAT WAS DONE INSTEAD is §E2.3's third route, taken in the order the kit
 * sets:
 *   · THE RECIPE'S MISCONCEPTION IS RELOCATED TO THE DISCRIMINATION, where it
 *     needs no `wrong` value at all. `discTensNotOnes` offers `s + k` as a live
 *     option beside three other honest wrong counts, and the item is PINNED to
 *     `d_verify_binop_v1` over its own `(s, 10k)`, so QG-11 recomputes the
 *     keyed total. It carries its own `mistakeBank` row with its own
 *     `distractorRationale`, and the Day-5 claim makes the same point from the
 *     other side.
 *   · DAY 5 SHOWS A SLIP THE LIBRARY CAN ACTUALLY PRODUCE, which is the other
 *     half of what §E2.3 asks for. On a story where whole tens are put on:
 *
 *         {a: s, b: 10k, op: '+', wrongOp: '-'}
 *              →  correct = s + 10k  (the count the story really reaches)
 *                 wrong   = s − 10k  (the tens moved down the number instead)
 *
 *     Both operands are printed in the sentences the child is reading, neither
 *     numeral is chosen by an author, and QG-11 recomputes the pair from
 *     `generator.params`. It is complementary in the direction that matters
 *     HERE, and the construction is what earns it a place rather than the
 *     transform (b03 had to make the same argument for the same swap). The two
 *     values differ ONLY IN THE TENS DIGIT — `s + 10k` and `s − 10k` end in the
 *     same digit as `s` — so the page is an exhibit of this week's own claim:
 *     the ones stood still in the true answer and in the false one alike, and
 *     everything that went wrong went wrong in the tens. The size check falls
 *     out of it and a six-year-old can run it unaided: the shed cannot hold
 *     fewer bricks after bricks were stacked into it.
 *
 * THE PIN IS LOAD-BEARING RATHER THAN COINCIDENTAL, which matters now that
 * QG-11's choice arm requires a whole-value match. Every option on the
 * discrimination is a BARE NUMERAL, so there is exactly one value for the
 * recomputed truth to be held against: a mis-registered template or a swapped
 * operand order fails the check instead of finding a numeral to latch onto.
 * `bb-qg11-power-test` lists no slot of this week. Options shaped as written sums were considered and
 * dropped before they were written, on b08's finding that a keyed equation
 * contains several numerals and turns the pin green for free — and on §4, which
 * keeps written sums off every child surface in this pack anyway.
 *
 * THE GATE MAP, SET OUT HERE RATHER THAN LEFT TO BE WORKED OUT.
 * QG-5 recomputes `sitWholeTensJoin`, `sitTensArrive` and `sitRowsDown` through
 * `add_within_100_v1`, `sitHowManyTens` through `tens_ones_decompose_v1`, all
 * four warm-ups through their own retrieval templates, and both chains through
 * `d_multistep_rat_v1`. QG-11 audits the discrimination and both halves of the
 * error analysis.
 *
 * FIVE SURFACES HAVE NO GATE AT ALL, listed because a PASS that looks total is
 * how the last class of real bugs survived (L30): the three answers of the
 * Day-5 pattern hunt, which are keyword-graded — they are computed at module
 * load from one step and one start list and asserted to share their ones digit,
 * so an authored arithmetic slip throws rather than ships; the
 * always/sometimes/never claim; the estimate-first probe, which has no key by
 * definition (§8); the puzzle, which stands on its own construction-time check
 * that the landing is reachable by whole tens and shares the start's ones
 * digit; and the discrimination's four wrong values, which are recomputed and
 * proved distinct on every draw inside the item.
 *
 * ── 6. THE PICTURES: WHAT COULD BE DRAWN, AND WHY ALMOST NONE OF IT IS ──────
 *
 * The recipe's anchor is tens-blocks and a tens-block is the most helpful
 * picture in Level B, which is exactly the problem (L33). The conclusion,
 * reached by enumerating the primitives and stated as a result:
 *
 *     ON AN ASSESSED PAGE OF THIS WEEK, A PICTURE OF THE TENS IS THE ANSWER,
 *     BECAUSE THE ANSWER IS NOTHING BUT A COUNT OF TENS. THE ONLY HONEST
 *     PICTURE LEFT SHOWS ONE OF THE TWO AMOUNTS, WHICH THE PROMPT HAS ALREADY
 *     PRINTED ON THE SAME LINE.
 *
 * Each branch was tested separately and each is a separate finding:
 *
 *   (i) TEN-BLOCKS FOR BOTH AMOUNTS ARE THE SUM, AND WORSE THAN THE SUM. Four
 *       blocks beside three blocks can be counted by a child who has understood
 *       nothing: seven blocks, seven tens, seventy. The page that was going to
 *       ask whether thirty is three or thirty has answered itself in a picture.
 *  (ii) A PLACE-VALUE CHART OF BOTH NUMBERS IS THE SAME DEFECT IN COLUMNS. Set
 *       34 above 20 in a tens-and-ones chart and the tens column reads three and
 *       two, which is the entire method with only the reading left to do.
 * (iii) A CHART OF THE START ALONE ASSERTS A GIVEN — legal, and empty. It says
 *       34 is three tens and four ones, which is B2's fact, printed in the
 *       prompt as a numeral the child can already decompose. It buys nothing on
 *       an assessed page, so it is kept for the script, where it earns its keep
 *       by showing the ones column standing still while the tens column climbs.
 *  (iv) A NUMBER LINE IS THE ONE PICTURE THIS WEEK MUST REFUSE ON PRINCIPLE.
 *       Draw a hop of thirty and the sum becomes a journey, which is B4's track
 *       and B18's count — the exact substitution §3 exists to prevent. Refused
 *       everywhere, including the script, because drawing it once teaches the
 *       child to expect it.
 *   (v) A HUNDRED CHART CANNOT BE DRAWN HONESTLY ON `sitRowsDown` EITHER. The
 *       chart with its numerals printed is a lookup table for the answer: the
 *       child slides a finger and reads, which is what the page is asking them
 *       to work out. A chart with the numerals hidden is not a hundred chart.
 *  (vi) THE ASSESSED PAGES THEREFORE CARRY NO PICTURE AT ALL. Level B's gate
 *       profile asks for none (`pictorialPerDay: 0`), so this costs the pack
 *       nothing it was required to have. It is a conclusion, not a shortcut.
 *
 * THE THREE SURFACES THAT DO CARRY A PICTURE ARE THE THREE WHERE THE ANSWER IS
 * ALREADY IN VIEW: two script segments and the modeled guided example. `tenBlocks` shows the
 * blocks of each amount side by side — the anchor itself, once, with the total
 * said out loud in the same breath — and `tensChart` shows one two-digit number
 * with its ones column picked out, so the claim the week rests on has a picture
 * behind it exactly where a teacher would point. Neither call asserts anything,
 * for two separate reasons: a script segment carries no answer and no params,
 * so QG-13 would have nothing to weigh the drawing against, and the modeled
 * example prints its total under the picture, so an assertion would audit a
 * numeral the child can already read. Both alt texts name the amounts and say
 * what a block is worth, since that is all a sighted child gets from them too.
 *
 * ALSO REFUSED: any mark, ring or strike-through (`counterGroups` exposes
 * `crossedOut` and nothing here removes anything, so it is never passed); a
 * picture on the discrimination, where three numbers are on offer and a drawing
 * would rank them; and a picture on the puzzle, where the landing IS the
 * deduction.
 *
 * ── 7. WHAT COULD BE SCORED HERE WITHOUT DOING THE TENS (kit §E2.11) ───────
 *
 * A tens week has a hazard of its own: every honest wrong answer is also a
 * multiple of ten, so a set of options can end up differing only in one digit,
 * and "pick the biggest" or "pick the middle" walks through the page. Both the
 * rank and the week's blind habits were measured rather than argued about.
 *
 *   · `discTensNotOnes` OFFERS FOUR HONEST WRONG COUNTS, TWO BELOW THE KEY AND
 *     TWO ABOVE, served two at a time over three pairings so the key's rank
 *     rotates: the two low ones together, the two high ones together, and one
 *     of each. Measured over 5,000 draws the keyed total is the biggest of the
 *     three on 34.7%, the middle on 32.5% and the smallest on 32.7%. Each of the
 *     three positional habits therefore pays about what three doors pay before
 *     anybody writes anything into them, and `bb-answer-entropy-test` reports no
 *     rank tell at any position.
 *     THE OPTION SET IS ALSO BUILT AGAINST TWO TELLS THIS WEEK CREATES.
 *     ONE: the key always ends in the same digit as the printed start, because
 *     that is the week's own claim, so "pick the option ending like the story's
 *     number" would be a free pass. Two of the four wrong counts — the one
 *     ten short and the one ten too many — end in that digit as well, and the
 *     pairings are chosen so that at least one of them is ALWAYS on the page:
 *     measured over 5,000 draws that habit picks out a unique option on 0.0%.
 *     TWO: the key can never end in a zero, so an option that does can be
 *     struck out unread. Two sources of one were found and both are closed. The
 *     wrong count that drops the loose ones always ends in zero, so it is never
 *     offered at all — it lives in the `mistakeBank` with its own rationale. The
 *     other was visible only once it was measured: on the rows where the loose
 *     ones and the tens count happen to make ten, two of the four wrong counts
 *     end in zero as well, which put a strikeable option on 12.8% of draws.
 *     `DISC_ROWS` now excludes those rows, and the figure is 0.0% over 5,000.
 *     One wrong count is deliberately NOT a multiple of ten and it is the
 *     week's own misconception: `s + k`, thirty read as a three. It is on the
 *     page in two of the three pairings, which is where the recipe wants it.
 *   · THE WEEK'S BLIND HABITS, MEASURED ACROSS THE WHOLE PACK RATHER THAN PER
 *     ITEM, because b09 found its day plan was the thing that needed changing.
 *     Fourteen non-retrieval slots of the daily core carry a numeric key (the
 *     Day-5 three are written or claim answers). Over 2,500 seeds — 35,000
 *     exposures of those fourteen slots — "add the two printed numbers"
 *     produces the keyed answer on 42.9%, "write the two printed numbers side
 *     by side" on 0.0%, and "answer with the bigger printed number" on 0.0%.
 *     The 42.9% is six slots — the two
 *     whole-ten joins, the two tens-arrive pages and the two discriminations —
 *     and on every one of them adding the two printed numbers IS the
 *     mathematics rather than a way round it, since the page's whole question
 *     is what the second number is worth. The habit is reported rather than
 *     argued away, and the eight slots where it fails are the ones that carry
 *     the week: the chart pages print a number and a row count and want neither
 *     their sum nor their difference; the tens-count pages print two numbers
 *     and want a single digit; and both chains print three.
 *   · A FREE-ENTRY PAGE HAS NO OPTIONS TO RANK, so the entropy gate is silent
 *     on eight of the fourteen slots by design; their answer spaces were counted
 *     instead, by hand, over
 *     2,500 seeds. No slot in the pack is anywhere near a constant answer, and
 *     the spread is reported rather than rounded up: the chart page reaches 59
 *     different landings, the two tens-arrive pages 54 totals each, the trap 44,
 *     the two-load story 18 and the tens-count page 6. The narrowest are the two
 *     pages that join whole tens only — five totals each, fifty to ninety — and
 *     that is a fact about the content rather than about the draw, since two
 *     lots of at least two whole tens cannot total anything else below a
 *     hundred. A child guessing blind there is right one time in five, which is
 *     worse odds than the three-option trap offers, and both pages sit beside
 *     pages where guessing pays nothing at all.
 *   · NO OPTION IS A PERMANENT DECOY. Each one is a numeral computed from the
 *     operands of its own draw, so no option text ever recurs from seed to seed
 *     and `DECLARED_LURES` has nothing to declare. One answer in the pack is
 *     fixed for good: the Day-5 claim is true, so "always" is keyed on every
 *     seed. That is a property of the claim rather than of a draw, and the slot
 *     teaches rather than certifies — it appears in neither mastery form (L42).
 *
 * ── 8. THE PROBE, AND THE SPLIT IT ACTUALLY SERVED ─────────────────────────
 *
 * Nothing downstream can grade a probe, because a probe has no key: the child
 * commits, then works, and the commitment is never marked. So the served split
 * has to be measured by hand and published (L41). The probe is
 * "will the count pass sixty on Monday?" — seven
 * words, at §E2.9's budget, and it rides on `msTwoLoads`, where a stock is
 * counted and two deliveries of whole tens arrive on named days.
 *
 * DRAWING THE SIDE FIRST IS NOT PROOF (kit rule 9a), so this week copies b09's
 * fix rather than b22's dodge and then measures what was actually served. The
 * pool holds one row, `[start, bigLoad, smallLoad]`, and the probe's side
 * decides WHICH OF THE TWO LOADS COMES ON MONDAY. Both branches therefore print
 * the same three numerals; the guard's signature is the COMMUTED one
 * (`surface.ts` sorts the tokens before joining), so the two branches are not
 * merely similar surfaces but the SAME surface, and `drawUniqueItem`'s redraws
 * cannot suppress a side even in principle. The final answer is the same either
 * way, too, so the total the child reaches never leaks which side was drawn.
 * Every row satisfies `start + bigLoad > 60 ≥ start + smallLoad`, so the probe
 * is a real fork on both branches rather than an obvious one on either.
 * Measured over 5,000 exposures: 50.4% Monday-passes-sixty, standard error
 * 0.71. It is written down because nothing in the pipeline will ever recompute
 * it: this paragraph is the whole audit trail for that scaffold.
 *
 * NO DAILY PAGE REACHES `msTwoLoads` EXCEPT THROUGH THE WRAPPER, per §E2.2 —
 * the wrapper copies the ladder across unchanged, so serving both forms would
 * spend two of the three ladder slots the dedup allows on a single idea. Nor is
 * the bare form kept for mastery, which is a decision and not an omission: a page
 * that asks a child to commit before working has already lent them the judgement
 * a certificate is supposed to be measuring. What measures the two-load story instead is
 * `msThreeTensLots`, which asks for the same joining with a third lot on it.
 *
 * ── 9. THE BAND, THE DOSE, AND THE FRAMES ──────────────────────────────────
 *
 * FILL-ARCHITECTURE §1 was worked through row by row against this pack. The
 * fifteen-word ceiling measures 0.00% across thirty seeds, which is what every
 * Level-B week measures and is not free: it is why each story is three or four
 * short sentences rather than one, and why the chart pages name the chart in a
 * sentence of its own. Metacognition is in the band's prediction form, the
 * error analysis asks for one sentence, and the sprint carries no grade and
 * competes with nobody. The days run 5/5/5/5/4 and land between 9.5 and 11.5
 * minutes; retrieval is 7 of 24 items, 29.2%.
 *
 * THE SPRINT IS SUMS WITHIN TEN, sourced from A15, and the parameters carry the
 * week's own constraint: `sumMax: 9`, not 10. The tens counts a whole-ten sum
 * really adds must not reach ten, because ten tens is one hundred and this week
 * never crosses one — so the sprint drills exactly the facts these pages lean
 * on and stops exactly where the pages stop.
 *
 * FRAMES, SCANNED AGAINST THE WEEKS DIRECTORY WHEN THE FILE WAS FINISHED (kit
 * §E2.8), because the neighbours land while this is being written. Zero hits
 * corpus-wide for teabags, sultanas, currants, safety pins, staples and
 * ribbons. Re-dressed after the scan rather than shipped: beads (sixteen
 * weeks), buttons (nineteen), marbles (fifteen), stickers (fifteen), shells,
 * cubes, tiles, pegs, seeds and counters — a tens week wants a small countable
 * object, which is precisely what every other week wanted too. Rejected on
 * realism rather than on collision: lentils and poppy seeds, which nobody
 * counts to ninety; and every noun a story would have to move in tens without
 * a container, since a lot of forty has to live somewhere.
 *
 * MAGNITUDES WERE READ AS WELL AS MEASURED, which a tens week has to do — the
 * arithmetic is happiest at eighty and eighty of the wrong noun is absurd on
 * the page. Every noun here is something a school or a kitchen genuinely holds
 * in tens: a caddy of teabags, a tub of sultanas, a jar of currants, a sewing
 * tin of safety pins, an office box of staples, a craft drawer of ribbons. No
 * animal, no vehicle and no person is ever counted in this pack, and no
 * container is asked to hold more than ninety-nine of anything.
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
import type { BBFigure, PlaceName } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A15 = { level: 'A' as const, week: 15 };
const A22 = { level: 'A' as const, week: 22 };
const B1 = { level: 'B' as const, week: 1 };
const B2 = { level: 'B' as const, week: 2 };
const B3 = { level: 'B' as const, week: 3 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** One drawn name. Nothing in this file may hardcode a name that is also in this pool (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two names that differ, so one child never joins their lot with their own. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/** The DD7 tag vocabulary as a union, so a mistyped tag is a compile error. */
type Tag = 'fact-recall' | 'procedure-slip' | 'concept-misconception' | 'representation-misread' | 'task-comprehension';

type Params = Record<string, unknown>;

// ---------------------------------------------------------------------------
// The week's one hard invariant, enforced rather than intended
//
// B11 owns two-digit + one-digit (b03), so no amount added anywhere in this
// pack may be anything but a multiple of ten. Every pool runs its arriving
// amounts through this, so a future edit that widens a range cannot quietly
// hand a ones digit to a ones digit: it throws at module load, on every seed.
// ---------------------------------------------------------------------------

function wholeTens(amount: number, where: string): number {
  if (amount % 10 !== 0 || amount < 20) {
    throw new Error(`b10 ${where}: ${amount} is not a lot of two or more whole tens — B11 owns anything else`);
  }
  return amount;
}

/**
 * A pool's size decides whether the pack can be built at all, so it is asserted
 * at module load instead of hoped for. Each floor counts the distinct numeric
 * surfaces its consumers ask for across the five days and both mastery forms —
 * the point at which `drawUniqueItem` would have to give up and repeat one.
 */
function pool<T>(name: string, rows: readonly T[], floor: number): readonly T[] {
  if (rows.length < floor) {
    throw new Error(`b10 ${name}: ${rows.length} rows will not cover a pack that draws ${floor} distinct surfaces from it`);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// The frames — a noun, the place it lives, and the way more of it arrives
//
// Drawn as one row, never as independent noun and predicate draws (L26): that
// is how "the minnows were eaten" happens. Everything here is a small object a
// school or a kitchen really keeps by the tens, because a tens week deals in
// forties and eighties and the page has to survive being read (kit §E2.10).
// ---------------------------------------------------------------------------

interface Frame {
  /** The thing being counted, in the plural form the page prints. */
  noun: string;
  /** Where the lot lives, with its article. */
  place: string;
  /** How more of it arrives, third-person plural past. */
  arrived: string;
}

const FRAMES: readonly Frame[] = [
  { noun: 'teabags', place: 'the caddy', arrived: 'were tipped in' },
  { noun: 'sultanas', place: 'the tub', arrived: 'were scooped in' },
  { noun: 'currants', place: 'the jar', arrived: 'were poured in' },
  { noun: 'safety pins', place: 'the sewing tin', arrived: 'were dropped in' },
  { noun: 'staples', place: 'the office box', arrived: 'were slid in' },
  { noun: 'ribbons', place: 'the craft drawer', arrived: 'were laid in' },
];

const frame = (r: Rng): Frame => r.pick(FRAMES);

// ---------------------------------------------------------------------------
// The number tables — enumerated at import, picked from once
//
// Each ends in a single `r.pick`, and none is a filter applied after a draw. A
// redraw loop burns an unpredictable number of rng values, which leaves every
// item drawn after it standing somewhere different in the stream (kit §E2.4).
// Writing the tables out also forces the constraints into the open — see
// `LOAD_ROWS`, where the requirement that one row be a genuine fork on BOTH
// sides is what makes this week's coin flip an even one (§8).
// ---------------------------------------------------------------------------

/** Two UNEQUAL whole-ten lots whose total stays inside ninety (B19 keeps the doubles). */
const JOIN_ROWS = pool(
  'JOIN_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let a = 2; a <= 7; a++) {
      for (let b = 2; b <= 7; b++) {
        if (a === b || a + b > 9) continue;
        out.push([wholeTens(10 * a, 'JOIN_ROWS'), wholeTens(10 * b, 'JOIN_ROWS')] as const);
      }
    }
    return out;
  })(),
  16,
);

/**
 * `[start, arriving]` — a two-digit count with LOOSE ONES in it, and the whole
 * tens that arrive on top.
 *
 * The ones digit is never zero, and that is the pool's whole point: a start of
 * forty would make the ones digit invisible on the very pages built to show it
 * standing still, and it would collapse two of the discrimination's wrong
 * counts onto the key. The whole-ten start lives in `JOIN_ROWS` instead, where
 * it belongs.
 */
const ARRIVE_ROWS = pool(
  'ARRIVE_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let t = 2; t <= 6; t++) {
      for (let o = 1; o <= 9; o++) {
        for (let k = 2; k <= 4; k++) {
          const start = 10 * t + o;
          const arriving = wholeTens(10 * k, 'ARRIVE_ROWS');
          if (start + arriving > 99) continue;
          out.push([start, arriving] as const);
        }
      }
    }
    return out;
  })(),
  60,
);

/**
 * The same rows with ten to spare at the top, because the discrimination offers
 * "one whole ten too many" as a wrong count and that value has to remain a
 * number this week can print.
 *
 * The second filter closes a tell that only a tens week can have. Two of the
 * four wrong counts end in `(o + k) mod 10`, so on the rows where the loose
 * ones and the tens count happen to make ten, one option on the page is a round
 * number — and since the key never is, "strike out the multiple of ten" would
 * knock a door out of a three-door page. Measured at 12.8% of draws before this
 * line and 0.0% after it (§7).
 */
const DISC_ROWS = pool(
  'DISC_ROWS',
  ARRIVE_ROWS.filter(([s, a]) => s + a <= 89 && (s + a / 10) % 10 !== 0),
  40,
);

/**
 * The error analysis needs the swap to produce a count a child could plausibly
 * have written down, so the tens taken off must leave a two-digit number
 * standing. Below eleven the wrong answer stops being a rival and starts being
 * obviously impossible, which would let the page be passed on sight.
 */
const EA_ROWS = pool('EA_ROWS', ARRIVE_ROWS.filter(([s, a]) => s - a >= 11), 20);

/**
 * `[start, rows]` for the hundred chart. Two rows at least: b03 assigns the
 * single step down to B1, so a one-row move is a retrieval here and never a
 * core page.
 */
const CHART_ROWS = pool(
  'CHART_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let start = 21; start <= 79; start++) {
      for (let rows = 2; rows <= 5; rows++) {
        if (start + 10 * rows > 99) continue;
        out.push([start, rows] as const);
      }
    }
    return out;
  })(),
  60,
);

/**
 * `[start, bigLoad, smallLoad]` — a counted stock and its two whole-ten
 * deliveries, with the LARGER load first and both readings legal.
 *
 * The probe asks whether the count passes sixty by Monday, which is decided by
 * WHICH LOAD COMES ON MONDAY — so the side is chosen by assigning these two
 * numbers to days rather than by picking from a second pool. Both branches
 * print `{start, bigLoad, smallLoad}`, the guard keys on the sorted token list,
 * and so the two sides are the same surface and the freshness redraws have no
 * side to prefer (§8, kit rule 9a).
 *
 * `start + big > 60 ≥ start + small` on every row is what makes the fork real
 * in both directions; the ones digit is never zero, so the invariant this week
 * teaches is visible in the answer; and the two loads are never equal, which
 * keeps the page off B19's doubles and stops the probe becoming a coin the
 * child can see is two-headed.
 */
const LOAD_ROWS = pool(
  'LOAD_ROWS',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (let start = 21; start <= 49; start++) {
      if (start % 10 === 0) continue;
      for (let big = 3; big <= 6; big++) {
        for (let small = 2; small < big; small++) {
          const b = wholeTens(10 * big, 'LOAD_ROWS');
          const s = wholeTens(10 * small, 'LOAD_ROWS');
          if (start + b <= 60) continue;
          if (start + s > 60) continue;
          if (start + b + s > 99) continue;
          out.push([start, b, s] as const);
        }
      }
    }
    return out;
  })(),
  24,
);

/**
 * `[init, first, second]` — three whole-ten lots emptied into one place, never
 * all three the same size, total inside ninety. The lots that ARRIVE are two
 * whole tens or more; only the lot already there may be a single ten, since
 * nothing is being added to it when it is counted.
 */
const THREE_ROWS = pool(
  'THREE_ROWS',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (let init = 1; init <= 4; init++) {
      for (let a = 2; a <= 4; a++) {
        for (let b = 2; b <= 4; b++) {
          if (init === a && a === b) continue;
          if (init + a + b > 9) continue;
          out.push([10 * init, wholeTens(10 * a, 'THREE_ROWS'), wholeTens(10 * b, 'THREE_ROWS')] as const);
        }
      }
    }
    return out;
  })(),
  16,
);

/**
 * `[tens, ones]` for the B2 warm-up, and `[lowTens, highTens, lowOnes,
 * highOnes]` for the B3 one, where the ONES DIGIT POINTS THE WRONG WAY: the
 * number with the smaller ones digit is the greater number, so the pair can
 * only be settled by reading the tens. That is b03's own trap, replayed as
 * retrieval rather than re-taught.
 */
const BUILD_ROWS = pool(
  'BUILD_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let t = 2; t <= 9; t++) for (let o = 1; o <= 9; o++) out.push([t, o] as const);
    return out;
  })(),
  40,
);

const COMPARE_ROWS = pool(
  'COMPARE_ROWS',
  (() => {
    const out: Array<readonly [number, number, number, number]> = [];
    for (let lowT = 2; lowT <= 8; lowT++) {
      for (let lowO = 4; lowO <= 9; lowO++) {
        for (let highO = 1; highO < lowO - 1; highO++) {
          out.push([lowT, lowT + 1, lowO, highO] as const);
        }
      }
    }
    return out;
  })(),
  40,
);

// ---------------------------------------------------------------------------
// The pin
//
// `discrimination()` emits no `generator` spec, so there is nothing for QG-11 to
// recompute a truth from and the keyed option would ship unchecked. The fix is a
// single-slot handover: the draw closure writes the operands it used into a box,
// and the wrapper reads that box on the line immediately after the draw returns,
// attaching them to the draft. Reading it immediately is what makes it safe —
// `drawUniqueItem` can run a draw many times, and the box always holds whichever
// run produced the draft that came back. Five weeks before this one carry their
// own copy of the device (b03, b04, b07, b09, b24); the tidier alternative would
// be a change to `lib/`, which no single week may make (kit §G).
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
    if (!pin) throw new Error('b10/withPin: the letterbox was empty, so this keyed option cannot be audited');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

// ---------------------------------------------------------------------------
// The two pictures, and only where the answer is already printed beside them
// ---------------------------------------------------------------------------

/**
 * THE ANCHOR: one block per whole ten, in two lots side by side.
 *
 * Three call sites and no others (§6): the first and third script segments and
 * the worked example at the top of the fade. `asserts` is left off both times on
 * purpose — a script segment holds neither answer nor params for QG-13 to test a
 * drawing against, and on the worked example the total is printed under the
 * picture, so an assertion would be auditing a numeral already in view.
 */
const tenBlocks = (here: number, arriving: number): BBFigure =>
  counterGroups(
    [
      { count: here, noun: 'blocks', label: 'here already' },
      { count: arriving, noun: 'blocks', label: 'arriving' },
    ],
    {
      relation: 'join',
      alt: `${fmtInt(here)} ten-blocks with ${fmtInt(arriving)} more ten-blocks brought alongside, each block worth ten`,
    },
  );

/** ONE two-digit number in a tens-and-ones chart, with a column picked out. */
const tensChart = (value: number, highlight: PlaceName, alt: string): BBFigure => ({
  type: 'place-value-chart',
  alt,
  params: { digits: String(value), highlight },
});

// ---------------------------------------------------------------------------
// Four warm-ups, each a piece of machinery a core page runs on
//
// None is filling a slot. Drop B2's tens and ones and no page can say what the
// tens digit is FOR. Drop A22's tens count and a ten-block is a block. Drop
// B1's chart step and `sitRowsDown` has no unit to travel in. Drop B3's
// tens-first comparison and the week's claim has only ever been met from one
// side. QG-2 wants every retrieval source to lie strictly behind this week on
// the ladder, and all four of these do.
// ---------------------------------------------------------------------------

/** A22 — a tower is ten, so a number of towers is that many tens. */
const wCountTens = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'count-tens-towers',
    draw: (r) => {
      const k = r.int(3, 9);
      return {
        prompt: `A shelf holds ${countNoun(k, 'towers')} of ten cubes. How many cubes is that?`,
        answerValue: String(10 * k),
        templateId: 'a_count_tens_v1',
        params: { k },
        units: 'cubes',
        hints: [
          'How much is one tower worth on its own?',
          'Count the towers, then say that many tens.',
        ],
        errorTags: ['fact-recall', 'concept-misconception'],
      };
    },
  }),
  A22,
);

/** B2 — a number built from its tens and its ones. */
const wTensAndOnes = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'build-from-tens-and-ones',
    draw: (r) => {
      const [t, o] = r.pick(BUILD_ROWS);
      return {
        prompt: `Which number is built from ${countNoun(t, 'tens')} and ${countNoun(o, 'ones')}?`,
        answerValue: String(10 * t + o),
        templateId: 'retr_tens_ones_v1',
        params: { t, o },
        hints: [
          'Which of the two digits tells you the tens?',
          'Write the tens digit first and the ones digit after it.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  B2,
);

/** B1 — one row down the hundred chart, which is B1's step and stays B1's. */
const wStepDown = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'chart-one-row-down',
    draw: (r) => {
      const n = r.int(12, 88);
      return {
        prompt: `On the hundred chart, which number sits one row below ${fmtInt(n)}?`,
        answerValue: String(n + 10),
        templateId: 'retr_chart_below_v1',
        params: { n },
        hints: [
          'What does one row down the chart add to a number?',
          'A row down is one whole ten, so the tens digit climbs by one.',
        ],
        errorTags: ['procedure-slip', 'representation-misread'],
      };
    },
  }),
  B1,
);

/**
 * B3 — which of two numbers is greater, with the ones digit pointing the wrong
 * way. The answer is the greater number, and `tens_ones_riddle_v1` rebuilds it
 * from the tens and ones the prompt names for it, so the value is recomputed
 * from the description rather than asserted.
 */
const wWhichIsGreater = asWarmup(
  situation({
    situationType: 'comparison',
    cognitiveOp: 'compare-tens-first',
    draw: (r) => {
      const [lowT, highT, lowO, highO] = r.pick(COMPARE_ROWS);
      return {
        prompt: `Which is greater: ${countNoun(lowT, 'tens')} and ${countNoun(lowO, 'ones')}, or ${countNoun(highT, 'tens')} and ${countNoun(highO, 'ones')}? Write that number.`,
        answerValue: String(10 * highT + highO),
        templateId: 'tens_ones_riddle_v1',
        params: { t: highT, o: highO },
        hints: [
          'Which part of a two-digit number decides its size first?',
          'Compare the tens. Only look at the ones if the tens match.',
        ],
        errorTags: ['concept-misconception', 'representation-misread'],
      };
    },
  }),
  B3,
);

// ---------------------------------------------------------------------------
// THE HEADLINE PAGE — two whole-ten lots, joined
//
// The recipe's own sum. Nothing has loose ones anywhere on this page, so the
// only thing being asked is whether four tens and three tens are seven tens.
// The two lots are always different sizes, which keeps B19's doubles out.
// ---------------------------------------------------------------------------

const sitWholeTensJoin = situation({
  situationType: 'combine',
  cognitiveOp: 'add-whole-tens',
  draw: (r) => {
    const f = frame(r);
    const [x, y] = r.pick(JOIN_ROWS);
    const [a, b] = two(r);
    return {
      prompt: `${a} has ${countNoun(x, f.noun)}. ${b} has ${countNoun(y, f.noun)}. Both lots go into ${f.place}. How many ${f.noun} are in ${f.place}?`,
      answerValue: String(x + y),
      templateId: 'add_within_100_v1',
      params: { a: x, b: y },
      units: f.noun,
      hints: [
        'How many whole tens is each child holding?',
        'Put the tens counts together, then say that many tens.',
      ],
      errorTags: ['concept-misconception', 'fact-recall'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE CATALOG'S SECOND SHAPE — a counted stock with whole tens put on it
//
// "34+20, 57+30", in the catalog's own words. The start always carries loose
// ones, because the loose ones are the point: they are what the arriving tens
// must be seen to leave alone.
// ---------------------------------------------------------------------------

const sitTensArrive = situation({
  situationType: 'part-whole',
  cognitiveOp: 'add-tens-to-a-two-digit',
  draw: (r) => {
    const f = frame(r);
    const [start, arriving] = r.pick(ARRIVE_ROWS);
    const name = one(r);
    return {
      prompt: `${name} counted ${countNoun(start, f.noun)} in ${f.place}. Then ${fmtInt(arriving)} more ${f.arrived}. How many ${f.noun} are in ${f.place} now?`,
      answerValue: String(start + arriving),
      templateId: 'add_within_100_v1',
      params: { a: start, b: arriving },
      units: f.noun,
      hints: [
        'Which digit will the arriving tens change?',
        'Climb the tens by the number that arrived and leave the loose ones alone.',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE CHART — several rows down at once
//
// b13 assigns this move to this cell by name. It is the one page where a child
// may travel rather than combine, and it stays this week's rather than B18's
// because the rows arrive as a single count and the question is what a row is
// WORTH. The one-row step is B1's and appears only as a warm-up.
//
// The two printed numbers are a number and a row count, so "add the two numbers
// on the page" fails here — which is half of why the page is in the pack (§7).
// ---------------------------------------------------------------------------

const sitRowsDown = situation({
  situationType: 'rate-of-change',
  cognitiveOp: 'slide-down-the-chart',
  draw: (r) => {
    const [start, rows] = r.pick(CHART_ROWS);
    const name = one(r);
    return {
      prompt: `${name} puts a finger on ${fmtInt(start)} on the hundred chart. The finger slides down ${countNoun(rows, 'rows')}. Which number is under it now?`,
      answerValue: String(start + 10 * rows),
      templateId: 'add_within_100_v1',
      params: { a: start, b: 10 * rows },
      hints: [
        'Is one row down worth a single one, or a whole ten?',
        'Work out what the rows are worth in all, then put that on.',
      ],
      errorTags: ['representation-misread', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE PAGE WHOSE ANSWER IS A COUNT OF TENS
//
// b12 and b16 both lean on this: a schedule of ten-minute slots and a row of
// dimes are counted in tens, not in ones. It is also the one page a child can
// finish without ever forming the total — add the tens counts and stop — which
// is the week's own claim used as a method rather than stated as one.
// ---------------------------------------------------------------------------

const sitHowManyTens = situation({
  situationType: 'part-whole',
  cognitiveOp: 'count-the-tens-in-a-total',
  draw: (r) => {
    const f = frame(r);
    const [start, arriving] = r.pick(ARRIVE_ROWS);
    const name = one(r);
    return {
      prompt: `${name} is sorting ${f.noun} into tens. The pile holds ${countNoun(start, f.noun)}. Then ${fmtInt(arriving)} more arrive. How many whole tens can ${name} make?`,
      answerValue: String(Math.floor((start + arriving) / 10)),
      templateId: 'tens_ones_decompose_v1',
      params: { n: start + arriving },
      units: 'tens',
      hints: [
        'Is this question after the whole pile, or after the tens in it?',
        'Count the whole tens in each lot, then put those counts together.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE RECIPE'S DISCRIMINATION — 40 + 30 against 40 + 3
//
// The whole week on one page: is the second number thirty, or is it a three
// standing in a tens column? The misconception the recipe names is the first
// wrong count offered, and it is here rather than on Day 5 because no
// registered transform can generate it as a worked slip (§5).
//
// FOUR NAMED WRONG COUNTS, TWO BELOW THE KEY AND TWO ABOVE, served two at a
// time over three pairings so the key lands biggest, smallest and middle in
// turn. That is L43's rule taken as the invariant rather than as its first
// instance, and it is doing more work than usual here: in a tens week the
// honest wrong values sit a whole ten above and below the answer, so
// undershooting and bracketing are one defect in two coats and only a rotating
// PAIRING escapes both. The measured shares are in §7.
//
// THE PIN is `d_verify_binop_v1` fed this draw's own two operands. It does real
// work here rather than nominal work: with three bare numerals on offer there is
// a single value under the key for the recomputed total to be held against, so a
// swapped operand order would fail the check rather than survive it.
// ---------------------------------------------------------------------------

interface Wrong {
  value: number;
  errorTag: Tag;
  rationale: string;
}

/**
 * Which two of the four wrong counts are offered, and therefore where the key
 * ranks. The two low ones, the two high ones, then one of each — and every
 * pairing carries at least one count that ends in the START'S OWN ones digit,
 * so "pick the one whose last digit matches the story" is never unique (§7).
 */
const DISC_PAIRINGS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [2, 3],
  [0, 2],
];

const tensNotOnesBox = pinSlot();

const discTensNotOnes = withPin(
  tensNotOnesBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'is-it-tens-or-ones',
    draw: (r) => {
      const f = frame(r);
      const [start, arriving] = r.pick(DISC_ROWS);
      const name = one(r);
      const tensCount = arriving / 10;
      const total = start + arriving;
      tensNotOnesBox.last = { params: { a: start, b: arriving, op: '+' }, seed: r.uint() };
      const wrong: readonly Wrong[] = [
        {
          // [0] BELOW — the recipe's own misconception, and the only offered
          // count that is not a whole ten away from the key.
          value: start + tensCount,
          errorTag: 'concept-misconception',
          rationale:
            'Reads the arriving number by its first digit and puts that many single ones on, so a lot of whole tens is spent as a handful.',
        },
        {
          // [1] BELOW — one whole ten short.
          value: total - 10,
          errorTag: 'procedure-slip',
          rationale:
            'Counts the tens on but stops one ten early, which happens when the ten already sitting in the pile is counted as one of the arrivals.',
        },
        {
          // [2] ABOVE — one whole ten too many.
          value: total + 10,
          errorTag: 'procedure-slip',
          rationale:
            'Counts one ten more than arrived, which is the same slip as stopping early with the count running the other way.',
        },
        {
          // [3] ABOVE — the tens put on, then counted again as ones.
          value: total + tensCount,
          errorTag: 'representation-misread',
          rationale:
            'Puts the whole tens on correctly and then adds the first digit of that number as well, so the arriving lot is paid for twice.',
        },
      ];
      // WHAT MAKES THE PAIRINGS SAFE TO WRITE DOWN. The five values are compared
      // on every single draw, so a later widening of `DISC_ROWS` that let two
      // counts collide — or dropped one onto the key — stops pack generation
      // dead rather than shipping a page with two true answers on it.
      const all = [total, ...wrong.map((w) => w.value)];
      if (new Set(all).size !== all.length) {
        throw new Error(`b10 discTensNotOnes: ${all.join(', ')} are not four distinct wrong counts beside one key`);
      }
      if (Math.max(...all) > 99) {
        throw new Error(`b10 discTensNotOnes: ${all.join(', ')} runs past ninety-nine, which this week never does`);
      }
      const [i, j] = r.pick(DISC_PAIRINGS);
      return {
        prompt: `${name} has ${countNoun(start, f.noun)}. Then a packet of ${fmtInt(arriving)} more ${f.noun} is opened. How many ${f.noun} does ${name} have now?`,
        correct: String(total),
        distractors: [
          { text: String(wrong[i].value), errorTag: wrong[i].errorTag, rationale: wrong[i].rationale },
          { text: String(wrong[j].value), errorTag: wrong[j].errorTag, rationale: wrong[j].rationale },
        ],
        hints: [
          'Is the second number whole tens, or is it single ones?',
          'Count the tens in both numbers, then keep the loose ones you started with.',
        ],
        errorTags: ['concept-misconception', 'procedure-slip', 'representation-misread'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// THE PROBE'S PAGE — a stock, and two deliveries of whole tens
//
// Two loads arrive on named days, so the tens go on twice and the question is
// where the count finishes. The probe asks whether Monday alone takes it past
// sixty, and the side is chosen by deciding WHICH LOAD COMES ON MONDAY — which
// is why both branches print the same three numerals and the freshness guard
// has no side to prefer (§8).
//
// The recipe's own two-step is "+tens then +ones"; the ones half is B11's, so
// what is here is the tens half twice over (§2.1).
// ---------------------------------------------------------------------------

const msTwoLoads = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'two-loads-of-whole-tens',
  draw: (r) => {
    const bigOnMonday = r.chance(0.5);
    const f = frame(r);
    const [start, big, small] = r.pick(LOAD_ROWS);
    const monday = bigOnMonday ? big : small;
    const tuesday = bigOnMonday ? small : big;
    return {
      prompt: `${one(r)} counted ${countNoun(start, f.noun)} in ${f.place}. On Monday ${fmtInt(monday)} more ${f.arrived}. On Tuesday ${fmtInt(tuesday)} more ${f.arrived}. How many ${f.noun} are in ${f.place} now?`,
      initN: start,
      steps: [
        { op: 'add', n: monday, d: 1 },
        { op: 'add', n: tuesday, d: 1 },
      ],
      units: f.noun,
      hints: [
        'How many deliveries land before the question is asked?',
        'Take one delivery at a time and say the running count out loud.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * Seven words, at the §E2.9 budget, and a real fork: Monday's load decides it
 * on its own, and the pool guarantees that whichever load lands on Monday
 * genuinely settles the question one way or the other. There is nothing left to
 * decide once the child has committed, which is what a commitment probe is for
 * (L25).
 */
const predictMondayCount = withEstimateFirst(msTwoLoads, 'will the count pass sixty on Monday?');

// ---------------------------------------------------------------------------
// THE SECOND CHAIN — three whole-ten lots emptied into one place
//
// The week's claim at its plainest: three tens and four tens and two tens are
// nine tens, and nothing but the tens count has to be held in the head. No lot
// is described as a number of tens, only as an amount, so nothing here is a
// count of groups (B20/C6) or a run of hops (B18).
// ---------------------------------------------------------------------------

const msThreeTensLots = multiStep({
  situationType: 'combine',
  cognitiveOp: 'join-three-whole-ten-lots',
  draw: (r) => {
    const f = frame(r);
    const [init, first, second] = r.pick(THREE_ROWS);
    return {
      prompt: `Three bags are emptied into ${f.place}. The first holds ${countNoun(init, f.noun)}. The next holds ${fmtInt(first)}. The last holds ${fmtInt(second)}. How many ${f.noun} are in ${f.place}?`,
      initN: init,
      steps: [
        { op: 'add', n: first, d: 1 },
        { op: 'add', n: second, d: 1 },
      ],
      units: f.noun,
      hints: [
        'How many tens is each bag holding before anything is joined?',
        'Add the three tens counts, then read that many tens as a number.',
      ],
      errorTags: ['fact-recall', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, first page — the only wrong number in this week that code can honestly
// make
//
// One operand pair and two operations: the stock and the whole tens that
// arrived, put on to give the count the story reaches, and taken off to give
// the count the child wrote. Neither numeral is chosen by an author and QG-11
// recomputes both from the shipped params.
//
// Nothing on the page says a mistake has been made. There is a story, a written
// count, and no comment; diagnosing it is the child's job, so the page cannot
// do that job for them (L25). The arithmetic is flawless too — the tens really
// were counted, and counted accurately — so re-checking the tens count finds
// nothing at all. What gives it away is that the tin ends up holding fewer than
// it started with, on a page where nothing was ever taken out. And both numbers
// end in the same digit, which is this week's claim standing over a wrong
// answer as calmly as it stands over a right one.
// ---------------------------------------------------------------------------

const eaTensWentDown = errorAnalysis({
  verifyTemplateId: 'd_verify_binop_misconception_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const [start, arriving] = r.pick(EA_ROWS);
    return { a: start, b: arriving, op: '+', wrongOp: '-' };
  },
  build: (v, p, r) => {
    const f = frame(r);
    const start = Number(p.a);
    const arriving = Number(p.b);
    const name = one(r);
    return {
      prompt: `${name} counted ${countNoun(start, f.noun)} in ${f.place}. Then ${fmtInt(arriving)} more ${f.arrived}. ${name} writes that ${f.place} holds ${countNoun(Number(v.wrong), f.noun)}.`,
      extension:
        'Write one sentence comparing that number with the count at the start. Then write the true total.',
      hints: [
        'Can a lot end up smaller when more of it arrives?',
        'Look at the tens digit in both counts. Which way did it move?',
      ],
      errorTags: ['procedure-slip', 'concept-misconception'],
      answerKeywords: [
        'the tens went down when whole tens were put on',
        'nothing was taken out, so the count cannot be smaller',
        'the ones digit stayed and only the tens moved the wrong way',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, second page — the tens-pattern hunt
//
// The recipe's Day-5 signature. Three starts that share a ones digit, one
// whole-ten step, and a sentence about what the ones digit did — which is the
// week's claim arrived at by the child rather than announced by the page.
//
// The three answers are COMPUTED at module load, not typed out, and then
// checked: each stays inside ninety-nine and each ends in the digit its start
// ended in. An authored slip in this prompt would be invisible to every gate
// (the answer is keyword-graded), so the arithmetic is made structural instead.
// ---------------------------------------------------------------------------

const HUNT_STEP = 30;
const HUNT_STARTS = [12, 42, 62] as const;
const HUNT_ANSWERS = HUNT_STARTS.map((n) => n + HUNT_STEP);
for (const [i, n] of HUNT_STARTS.entries()) {
  if (HUNT_ANSWERS[i] > 99 || HUNT_ANSWERS[i] % 10 !== n % 10) {
    throw new Error(`b10 pattern hunt: ${n} plus ${HUNT_STEP} does not land inside the week on the same ones digit`);
  }
}

const reasoningTensHunt = reasoning({
  prompt: `Put ${fmtInt(HUNT_STEP)} more on each of these: ${HUNT_STARTS.map((n) => fmtInt(n)).join(', ')}. Write the three answers. Then write one sentence about the last digit.`,
  value: `${HUNT_ANSWERS.join(', ')} — the last digit never changed, because only whole tens were put on`,
  acceptableForms: [
    ...HUNT_ANSWERS.map((n) => String(n)),
    'the last digit stayed the same',
    'the ones digit did not change',
    'only the tens changed',
  ],
  keywords: true,
  hints: [
    'What is the same about the last digit of all three starting numbers?',
    'Finish all three answers first, then look along their last digits.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The claim the week rests on, given to the child as something to decide rather
 * than as something to be told.
 *
 * "Always" is the honest answer here, which is rare enough to be worth saying:
 * a whole ten has no ones in it to give, so there is nothing that could reach
 * the ones column. Neither wrong option is padding. A child who has met the
 * chart and the loose ones separately will say sometimes, because the pages
 * where the start was a whole ten looked like a different kind of sum; and a
 * child still reading the arriving tens as ones will say never, because in
 * their arithmetic the ones digit changes every single time.
 */
const asnOnesStandStill = classify({
  prompt:
    'Always, sometimes or never true? Putting whole tens on a number leaves its ones digit alone. Write a sentence that would convince somebody else.',
  correct: 'always',
  distractors: [
    {
      text: 'sometimes',
      errorTag: 'concept-misconception',
      rationale:
        'Holds the rule for numbers with loose ones but not for whole-ten starts, as though a ones digit of nothing were a different case.',
    },
    {
      text: 'never',
      errorTag: 'task-comprehension',
      rationale:
        'Expects every arriving amount to reach the ones column, which is what a child sees if whole tens are being read as single ones.',
    },
  ],
  hints: [
    'Which column does a whole ten land in?',
    'Try it on a number with loose ones, then on a number without.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB10 = makeWeekBuilder({
  level: 'B',
  week: 10,
  conceptId: 'adding-tens',
  conceptName: 'Adding tens',
  strandTags: ['addition-subtraction', 'number-sense-counting'],
  prerequisiteWeeks: [A22, B1, B2, B3],
  pedagogyContract: 'v2',
  conceptualAnchor: 'ten-blocks',
  conceptFamily: 'operation',
  deepeningDelta:
    'B2 took a two-digit number apart and showed what it is made of, and B3 used those parts to decide which of two numbers is bigger. Both weeks held their numbers still: nothing was ever put on them, so the tens and the ones were features of a number rather than things that could move. B10 sets them moving, and only one of the two is allowed to. Adding whole tens is the first arithmetic in Level B that reaches past twenty, and it is deliberately the first, because it is the only two-digit addition a child can do without a method at all: four tens and three tens are seven tens by a fact settled in B5, and the loose ones are not part of the question. That reframes B2 rather than repeating it — the tens digit stops being a label on a column and becomes a count of things that can be added — and it hands B11 the contrast that week is built on, since B11 sends a single digit into the ones column that this week never touches. B13 then has both columns moving at once, which is the point at which a written method starts to earn its keep.',
  explanation: {
    hook: 'A block of ten is one thing you can count. So tens can be added like anything else.',
    whyBeforeHow:
      'Ask a six-year-old what four and three make and they will tell you at once. Ask them what forty and thirty make and many will stop, and some will write 43. That is not a gap in their arithmetic. It is a question about what the numeral 30 stands for, and it is worth answering properly before any sum is attempted. The answer is the ten-block. A ten-block is ten ones fastened together so that they travel as one object, and once ten ones have become one thing they can be counted like any other thing: four ten-blocks and three ten-blocks are seven ten-blocks, because that is what four and three do to anything. Seven ten-blocks is seventy. So the sum a child already owns does all the work, and the only new step is agreeing what is being counted. That is why these pages say "whole tens" out loud instead of showing written sums. A child who reads 40 + 30 digit by digit sees a four, a three and nothing to stop them writing 43; a child who hears "four whole tens and three whole tens" has already been told what to count. The second half of the week follows from the first. If only tens were added, then only tens can have changed, so the ones digit of the answer is the ones digit you started with. Thirty-four with twenty put on is fifty-four, and the four is untouched because nothing arrived that had any ones in it to give. That is not a trick for getting answers. It is a check any child can run without help, and it catches the very mistake this week exists to prevent: a number whose last digit has moved is a number that was never really adding tens at all.',
    script: [
      {
        say: 'Watch. Four ten-blocks here. Three more ten-blocks arriving. Count the blocks with me.',
        visual: 'Four ten-blocks, and three more brought alongside them.',
        figure: tenBlocks(4, 3),
      },
      {
        say: 'Seven blocks. Each block is ten. So seven whole tens, and that is seventy.',
      },
      {
        say: 'Now a number with loose ones. Here is 34. Three whole tens, and four loose ones.',
        visual: 'The number 34 set out in two columns, with the ones column marked.',
        figure: tensChart(34, 'ones', 'a chart of two columns making 34, a three standing in the tens column and a four in the ones column'),
      },
      {
        say: 'Twenty arrives. Two more whole tens. The tens climb to five and the four sits still.',
      },
      {
        say: 'One habit before I stop. I check the last digit of my answer against the one I started with.',
      },
    ],
    summary:
      'Whole tens are counted like anything else, and they only ever change the tens digit. The loose ones stay exactly as they were.',
    vocabulary: [
      { term: 'whole ten', kidGloss: 'ten ones held together as one thing, like a block or a bundle of ten' },
      { term: 'ten-block', kidGloss: 'a stick of ten cubes counted as one, so ten of them is a hundred' },
      { term: 'loose ones', kidGloss: 'the single ones left over once the whole tens have been made' },
    ],
  },
  guidedExamples: [
    {
      ...ge(10, 1, 'modeled', 'Ria has 40 staples. Ken has 30 staples. How many staples is that?', [
        {
          teacherSay:
            'Watch me. I am not adding forty and thirty at all. I am counting blocks: forty is four whole tens and thirty is three.',
        },
        {
          teacherSay: 'Four blocks and three more blocks. So how many blocks am I holding?',
          expected: 'seven',
        },
        {
          teacherSay: 'Seven blocks, and every block is ten. Seven whole tens is what I write.',
        },
      ], '70'),
      // The anchor is drawn here and nowhere else on a working page. Seventy is
      // printed underneath it, so what the picture demonstrates is what a block
      // is worth, not what the answer is (kit §E2.5).
      visual: 'Four ten-blocks, and three more ten-blocks beside them.',
      figure: tenBlocks(4, 3),
    },
    {
      ...ge(10, 2, 'completion', 'The sewing tin held 46 safety pins. Then 30 more were dropped in. How many now?', [
        { teacherSay: 'How many whole tens arrived, and how many loose ones came with them?', expected: 'three tens, and no loose ones' },
        { childDo: 'Climb the tens by three and leave the six exactly where it is.', expected: '76' },
      ], '76'),
      // The fade begins one example early. Drawing 46 beside 30 would show the
      // tens columns side by side, which is the whole method (§6).
      visual: 'Nothing drawn — the two lots side by side would count themselves.',
    },
    {
      ...ge(10, 3, 'prompted', 'A finger sits on 27 on the hundred chart. It slides down 4 rows. Which number is under it?', [
        { childDo: 'Work out what four rows are worth before you move anything.', expected: '67' },
      ], '67'),
      visual: 'No picture — a printed chart would let the answer be read instead of worked out.',
    },
    {
      ...ge(10, 4, 'independent', 'Three bags go into the tub. They hold 10, 40 and 20 sultanas. How many sultanas is that?', [
        { childDo: 'Count the whole tens in all three bags, then say that many tens.', expected: '70' },
      ], '70'),
      visual: 'No picture — this one is held in the head from the first bag to the last.',
    },
  ],
  days: [
    // Day 1 — concept echo, single-step only: a tens count recalled, a number
    // taken apart, then the week's two shapes and the chart at full stride.
    [
      { gen: wCountTens, diff: 2 },
      { gen: wTensAndOnes, diff: 2 },
      { gen: sitWholeTensJoin, diff: 2 },
      { gen: sitTensArrive, diff: 2 },
      { gen: sitRowsDown, diff: 3 },
    ],
    // Day 2 — the trap arrives, the two-load story asks for a commitment before
    // any working, and the tens-count question closes the day by changing what
    // is being asked for rather than what is being added.
    [
      { gen: wStepDown, diff: 2 },
      { gen: sitWholeTensJoin, diff: 3 },
      { gen: discTensNotOnes, diff: 3 },
      { gen: predictMondayCount, diff: 4 },
      { gen: sitHowManyTens, diff: 3 },
    ],
    // Day 3 — the hardest day: B3's comparison and B2's build open it, then the
    // trap again beside the three-lot chain, so three quite different questions
    // arrive wearing the same short sentences.
    [
      { gen: wWhichIsGreater, diff: 2 },
      { gen: wTensAndOnes, diff: 2 },
      { gen: discTensNotOnes, diff: 4 },
      { gen: msThreeTensLots, diff: 4 },
      { gen: sitTensArrive, diff: 3 },
    ],
    // Day 4 — application: both chains beside the chart and the tens count, so
    // the shape of the page never signals which kind of answer is wanted.
    [
      { gen: wCountTens, diff: 2 },
      { gen: msThreeTensLots, diff: 4 },
      { gen: predictMondayCount, diff: 4 },
      { gen: sitRowsDown, diff: 3 },
      { gen: sitHowManyTens, diff: 3 },
    ],
    // Day 5 — a written count taken apart, the pattern hunt, and the week's
    // claim argued over.
    [
      { gen: wStepDown, diff: 2 },
      { gen: eaTensWentDown, diff: 4 },
      { gen: reasoningTensHunt, diff: 3 },
      { gen: asnOnesStandStill, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the sentence worth repeating this week is "how many whole tens?", and it works on almost anything lying about. Count out forty pasta shells into a bowl, put thirty more in, and ask it before anyone reaches for the answer. If your child says four and three, they have done the week. If they answer 43 to a sum like 40 and 30, do not correct the number. Ask them what the 3 in thirty is standing for, and then ask them to put out that many blocks or coins — the gap between three blocks and three ones is the whole lesson, and it lands much harder in the hand than on the page. The other thing to listen for is the check: the last digit of the answer should match the last digit you started with. Thirty-four and twenty makes fifty-four, and the four never budges. A child who runs that check catches their own mistakes without being told, which is the habit we are really after. Ten pennies stacked into a tower, or ten cubes clicked together, is all the equipment any of this needs.',
  ],
  puzzle: (r) => {
    // READ THE LANDING OFF THE TENS — a deduction no core page asks for.
    //
    // Every daily page is handed a start and a move and walks forward. This page
    // withholds the MOVE and hands over a fact about the finish instead: which
    // decade it lands in. That is only answerable through the week's own
    // invariant — whole tens cannot touch the ones digit, so the landing is the
    // one number in that decade ending as the start ended. It is a uniqueness
    // argument rather than a sum, and nothing on Day 1 travels that way.
    //
    // No picture: a printed chart is a lookup table for the answer (§6).
    const [start, rows] = r.pick(CHART_ROWS);
    const landing = start + 10 * rows;
    const landingTens = Math.floor(landing / 10);
    // THE PUZZLE PROVES ITS OWN ANSWER IS THE ONLY ONE. The landing must be
    // reachable from the start by whole tens, must share the start's ones digit
    // — which is what makes it unique in its decade — and must be far enough
    // below a hundred that the decade named is a real place on the chart.
    if ((landing - start) % 10 !== 0 || landing <= start) {
      throw new Error(`b10 puzzle: ${landing} is not reachable from ${start} by whole tens`);
    }
    if (landing % 10 !== start % 10) {
      throw new Error(`b10 puzzle: ${landing} does not end as ${start} ends, so the deduction has no grip`);
    }
    if (landing > 99) {
      throw new Error(`b10 puzzle: ${landing} runs off the hundred chart`);
    }
    return {
      id: 'B10-PZ-01',
      title: 'Puzzle Grove: Land in the Right Row',
      puzzleType: 'logic',
      prompt: `A counter sits on ${fmtInt(start)} on the hundred chart. Each row down puts one whole ten on. The counter slides down and stops on a number holding ${countNoun(landingTens, 'tens')}. Which number is it on?`,
      answer: {
        value: String(landing),
        acceptableForms: [],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which digit of the starting number can a row down never reach?',
        'Only one number in that row ends the way the starting number ends.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  // A core page is handed a start and a move and works out where it finishes.
  // This page is handed the start and the FINISHING ROW and has to name the
  // landing, which only the ones-digit invariant settles. Nothing on Day 1 is
  // answered that way.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'name-the-landing-from-its-row' },
  // DD11 asks for a source settled at least two weeks back, and choosing WHICH
  // settled fluency is the part worth thinking about. It is not a tens
  // sequence — that is b03's sprint and B18's week. It is the small sum hiding
  // inside every whole-ten sum: four tens and three tens needs four and three,
  // and nothing else. `sumMax: 9` rather than 10 is the week's own ceiling, since
  // ten whole tens is a hundred and nothing here crosses one.
  sprint: {
    skill: 'Sums within ten — the small addition hiding inside every whole-ten sum',
    sourceWeek: A15,
    itemCount: 16,
    scheduledDay: 3,
    templateId: 'add_within_10_facts_v1',
    params: { min: 2, max: 7, sumMax: 9 },
  },
  mastery: [
    { gen: sitWholeTensJoin, diff: 3 },
    { gen: sitTensArrive, diff: 3 },
    { gen: sitRowsDown, diff: 3 },
    { gen: sitHowManyTens, diff: 3 },
    { gen: discTensNotOnes, diff: 3 },
    { gen: msThreeTensLots, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: two whole-ten lots joined, with both lot sizes redrawn so a form cannot be passed by remembering the last one. 02: a counted stock with whole tens put on, fresh in both the stock and the amount arriving. 03: a slide down the hundred chart, with a fresh starting number and a fresh row count. 04: the same joining asked for as a count of whole tens rather than a total. 05: the tens-or-ones trap as a choice, with the pair of wrong counts rotated so the key does not sit at the same rank on both forms. 06: the three-lot chain, with a fresh set of bags. Three generators are deliberately ABSENT from both forms: the two-load story, which is served only through its estimate-first wrapper and so lends the child the judgement a certificate has to measure; the pattern hunt and the always/sometimes/never claim, which want a written argument rather than a key; and the four warm-ups, which are settled work from earlier weeks. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'reads-a-whole-ten-as-a-one',
      description:
        'Takes the first digit of a round number as a count of single ones, so thirty is spent as a three. It is the week\'s defining error and it is invisible in the child\'s working, because the arithmetic they carried out was correct for the numbers they thought they had.',
      exampleWrongAnswer: '43 given as the total when 30 was put on a lot of 40',
      distractorRationale:
        'Offer it as a live count on the tens-or-ones page, where every other option is also a whole count built from the same two numbers, so it cannot be struck out for looking wrong.',
      reteachPointer: 'explanation/script[0] (four ten-blocks here, three more ten-blocks arriving)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'tens-counted-one-out',
      description:
        'Counts the whole tens on and stops one ten early or runs one ten late, usually by counting the ten already sitting in the pile as one of the arrivals. The place value is understood; the count of tens is not yet safe.',
      exampleWrongAnswer: '64 or 84 given as the total when 30 was put on a lot of 44',
      distractorRationale:
        'Offer both directions on the tens-or-ones page as a pair, so neither "the answer is the biggest" nor "the answer is the smallest" survives, and the child has to settle the count itself.',
      reteachPointer: 'guidedExamples/B10-GE-02 (climb the tens by three and leave the six where it is)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'the-arriving-tens-counted-twice',
      description:
        'Puts the whole tens on correctly and then adds the first digit of that same number as well, as though the numeral had to be used twice over. It shows up most on the pages where the arriving amount is printed as a numeral rather than described.',
      exampleWrongAnswer: '57 given as the total when 30 was put on a lot of 24',
      distractorRationale:
        'Offer it as the higher of the two rival counts, where it sits close enough to the true total that telling them apart needs the tens counted rather than the answer eyeballed.',
      reteachPointer: 'explanation/script[3] (twenty arrives, two more whole tens, the four sits still)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'answers-the-total-when-the-tens-were-asked-for',
      description:
        'Reads any page about tens as a page wanting a total, and writes the whole number when the question asked how many whole tens there are. The arithmetic is right and the answer is to a question nobody asked.',
      exampleWrongAnswer: '54 given when the question asked how many whole tens could be made',
      distractorRationale:
        'It needs no distractor and would make a dishonest one, since the total is the right answer to the neighbouring page. It is met by putting the two questions on the same day in the same words, so the difference has to be read.',
      reteachPointer: 'explanation/summary (whole tens only ever change the tens digit)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'tens-count-assembled-every-time',
      description:
        'Rebuilds the small sum underneath each whole-ten sum from the beginning every time — four and three counted out on fingers before four tens and three tens can be reached. That is honest arithmetic and slow arithmetic, and the reasoning these pages are really about gets whatever attention is left.',
      exampleWrongAnswer: 'four and three counted one at a time on every whole-ten sum of the week',
      distractorRationale:
        'There is no honest distractor for being right slowly, so this one is answered by the Day-3 sprint and the tens-tower warm-up rather than by a page of its own.',
      reteachPointer: 'explanation/whyBeforeHow (the sum a child already owns does all the work)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'the-loose-ones-dropped',
      description:
        'Adds the tens correctly and lets the loose ones fall off on the way, so 34 with 20 put on becomes 50. The tens are handled properly; what is missing is that the ones were never part of the sum and therefore never needed doing anything to.',
      exampleWrongAnswer: '50 given as the total when 20 was put on a lot of 34',
      distractorRationale:
        'Deliberately NOT offered as an option: it is the only wrong count in the family that ends in a zero, so a page carrying it can be played by striking out the round number. It is shown instead in the script, where the ones column is picked out and watched.',
      reteachPointer: 'explanation/script[2] (three whole tens, and four loose ones)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Adding whole tens — 40 and 30, and 34 with 20 put on — by counting the tens instead of the ones. The sums stayed easy on purpose. The work this week was in seeing that a ten can be counted as one thing, and that the ones digit never moves when only tens arrive.',
    improvingCandidates: [
      'saying how many whole tens each amount holds before adding anything',
      'leaving the loose ones alone while the tens are counted on',
      'checking an answer by its last digit against the number it started from',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'reading a round number as whole tens rather than as the single digit printed at its front',
      },
      {
        errorTag: 'procedure-slip',
        text: 'counting the arriving tens exactly, without gaining or losing one along the way',
      },
      {
        errorTag: 'task-comprehension',
        text: 'noticing whether a question wants the whole total or the number of whole tens in it',
      },
      {
        errorTag: 'fact-recall',
        text: 'having the small sums within ten arrive without effort, which is what the Day-3 sprint is for',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the tens first and noticed that the last digit had not moved, so you knew your answer had come out right.',
      questionForChild: 'How many whole tens is that altogether, and what happened to the loose ones?',
      schoolSyncHook:
        'School may call these multiples of ten, tens numbers or bundles, and may talk about place value where we say whole tens and loose ones. The idea underneath is the same, so use whichever words come home.',
    },
    vocabularyForParent: [
      'whole ten (ten ones counted as a single thing — a block, a bundle, a stack of ten pennies)',
      'loose ones (the single ones left over once the whole tens have been made)',
      'tens digit (the digit that counts the whole tens, and the only one that changes this week)',
    ],
  },
});
