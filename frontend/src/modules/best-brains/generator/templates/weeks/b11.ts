/**
 * Level B · Week 11 — "Two-digit + one-digit" (conceptId: two-digit-plus-one-digit).
 *
 * FILL-ARCHITECTURE §4 row B11: anchor "ones meet ones"; multi-step "add then
 * compare"; error-analysis "47+5 = 412 (concatenation)"; discrimination
 * "crosses-ten vs not"; Day-5 signature "sort: bridge or no bridge". Catalog
 * cell: computational focus "45+3, 38+6 with place-value models, no/with
 * crossing ten"; non-computational focus 'Estimate first: "will it cross a ten?"
 * prediction page'.
 *
 * ── 1. THE IDEA ─────────────────────────────────────────────────────────────
 *
 * Thirty-eight and six is not a harder sum than eight and six. It is the same
 * sum with something standing in front of it, and the whole week is spent making
 * sure the child knows that the something in front takes no part:
 *
 *     A SINGLE DIGIT CAN ONLY EVER MEET THE ONES. THE TENS ARE NOT IN THE SUM;
 *     THEY ARE SIMPLY ALREADY THERE. SO THE ONLY QUESTION IS WHETHER THE ONES
 *     COLUMN HAS ROOM.
 *
 * From that one sentence both of the week's shapes fall out without a procedure.
 * If the room is enough, the answer finishes in the ones and the front digit
 * never stirs. If it is not, the ones that fit finish a ten, that ten leaves as
 * one object and joins the tens, and what is left stays loose on top of it.
 *
 * The second half is the part worth being exact about, because it is where the
 * arithmetic and the writing come apart. A child who works the ones out and gets
 * twelve has done the mathematics correctly. What they then have to do is
 * something else entirely — hand ten of those twelve upward as a single thing
 * and keep two. Skip that and the twelve goes down whole, which is how 47 and 5
 * arrives on a page as 412. The recipe names that numeral as this week's error
 * and it is not a slip in adding at all; it is a claim about where a number is
 * allowed to sit.
 *
 * Two facts follow that a six-year-old can hold, and every page here leans on
 * one of them. The front digit climbs by ONE or by nothing — never by two,
 * because nine loose ones and nine more cannot build two tens between them. And
 * the last digit lands wherever the ones took it round a ring of ten, which is
 * the deduction the puzzle turns on.
 *
 * ── 2. THE FENCE — WHOSE PAGE IS WHOSE, AND WHO SAID SO ─────────────────────
 *
 * Six siblings name this cell inside their own files, and one of them enforces
 * the boundary in code. What a neighbour has already told its reader about this
 * week is a constraint on it, not a compliment (kit §E2.8), so each sentence is
 * reproduced as it was written.
 *
 * THIS WEEK'S OUTRIGHT — taught here, assessed here, presumed nowhere before:
 *
 *   (a) A SINGLE DIGIT LANDING ON A TWO-DIGIT COUNT, IN EVERY SHAPE IT COMES IN.
 *       b03: "**B10 owns adding tens** (40 + 30) and **B11 owns two-digit +
 *       one-digit across a ten** (38 + 6)". b04: "**B10/B11 own adding tens and
 *       crossing a ten by addition.**" b07: "B10/B11 HAVE TENS AND THE WRITTEN
 *       CROSSING". b09: "B10/B11 HAVE TENS". And b10, which is categorical about
 *       it: "B11 HAS TWO-DIGIT + ONE-DIGIT, AND IT HAS ALL OF IT." So all three
 *       shapes are here and each has its own page — `sitOnesSettle` where the
 *       room is enough (the catalog's 45 + 3), `sitOnesSpill` where it is not
 *       (38 + 6), and `sitOnesFillATen` where the ones make ten on the nose and
 *       the column is left holding nothing.
 *       INCLUDING THE ONE B10 HANDED BACK BY NAME. b10 writes "40 + 7 is not
 *       this week's", so a count with no loose ones at all belongs here. It is
 *       the one place `SETTLE_ROWS` allows a ones digit of zero, and it is
 *       confined to that table because it is the shape where the week's question
 *       does not arise: nothing meets anything.
 *   (b) THE CONTRAST ITSELF, WHICH IS A SKILL AND NOT A BY-PRODUCT. b10 leaves
 *       it deliberately unspent: "the 'crosses-ten vs not' contrast B11's row is
 *       built on is left intact for B11 to spend." Deciding BEFORE adding
 *       whether a new ten is coming is the catalog's own non-computational focus
 *       for this cell, and it is here three times over — as a choice among three
 *       counts (`discNewTen`), as the estimate-first commitment the week's chain
 *       carries, and as the Day-5 sort.
 *   (c) THE TEN THAT GETS BUILT, AS A THING THAT HAS TO GO SOMEWHERE. b10's own
 *       deepening note says what it is handing over: "B11 sends a single digit
 *       into the ones column that this week never touches." What that digit
 *       sometimes does is build a ten, and where that ten belongs is the whole
 *       of the Day-5 error analysis and the mistake bank's first two rows.
 *   (d) THE FLUENCY B13 EXPECTS TO INHERIT. b13 lists this cell among its
 *       prerequisites and sources its sprint from it — "Two-digit plus one-digit
 *       — the same trade in one column", drawn at `min: 23, max: 89,
 *       addendMax: 9`. Every count on every page here sits inside that range and
 *       every arrival is a single digit, so the fluency b13 asks for is the
 *       fluency these pages actually build.
 *   (e) THE NUMERAL THE RECIPE NAMES. 412 for 47 and 5. §5 says how it reaches
 *       the page without being typed, and why the search for a registered
 *       transform that produces it came back empty.
 *
 * LEANED ON WITHOUT BEING RE-TAUGHT — with the cell that taught it named:
 *
 *   · B5'S BRIDGE. Filling the ten and carrying the spill is B5's strategy
 *     entire, and no page here teaches it. It is the first warm-up (the partner
 *     of ten), it is the second rung of every hint that needs it, and it is what
 *     the sprint drills. §3 is about the line between the two weeks, because it
 *     is the one a reader is most likely to think is not there.
 *   · B10'S WHOLE TENS. `wWholeTensOn` is b10's page, retrieved unchanged, and
 *     `msTensThenOnes` uses it as the settled first step of a chain — the tens
 *     half declared as `usesPriorSkill`, only the ones half new.
 *   · B3'S COMPARISON. The last move on `sitWhoEndsAhead` is a judgement b03
 *     taught. All the page wants back is a winner; nothing measures a margin.
 *   · B2'S TENS AND ONES. `wWholeTensIn` reads a tens count straight off a
 *     numeral; no page in this file assembles a number out of its parts.
 *   · A23'S TEN AND SOME MORE. The shape a spill lands in, borrowed as a warm-up
 *     exactly as A23's row states it.
 *
 * LEFT ALONE — another cell already holds it, so it does not appear here:
 *
 *   1. B10 HAS THE WHOLE TENS, AND THE FENCE IS CODE. b10 enforces its side with
 *      `wholeTens()`, which throws on any addend that is not at least two whole
 *      tens; this file answers with `arrivingOnes()`, which throws on any
 *      arriving amount outside one to nine. Between the two functions there is
 *      no addend in Level B that both weeks could claim. The single exception is
 *      declared rather than smuggled: `msTensThenOnes` puts whole tens on as its
 *      FIRST step, under `usesPriorSkill`, on the page b10 explicitly declined —
 *      see §2's quotation of its ruling beside that generator.
 *   2. B5 HAS MAKING TEN TO ADD. See §3; the fence is that every count here
 *      opens with at least two whole tens, so no page in this file is a sum
 *      inside twenty and no page can be finished by filling one frame.
 *   3. B13/B14 HAVE THE WRITTEN COLUMN AND THE TRADE. Nothing in this pack is
 *      set out in columns, nothing is carried in writing, and `underAHundred()`
 *      refuses any total that reaches three digits — asserted inside every table
 *      at import. The one three-digit numeral in the pack is a child's wrong
 *      answer on Day 5, and being impossible is exactly what is wrong with it.
 *      b13 states the division from its own side: this cell is "the same trade in
 *      one column", and the second column is b13's to open.
 *   4. B19 HAS DOUBLES. No page can be passed by doubling or halving. The two
 *      arrivals in the chain are never equal, and neither are the two arrivals
 *      in the comparison; the two addends of a single-sum page cannot match at
 *      all, since one has two digits and the other one.
 *   5. B7 HAS THE MISSING PART. Nowhere in this pack is a total given and an
 *      addend asked for, and the `▢` does not appear at all. The puzzle runs
 *      nearest that line without touching it: an amount IS withheld, but there is
 *      no total to work back from — only two last digits, which is a deduction
 *      round the ring of ten and not a subtraction.
 *   6. B15 HAS "HOW MANY MORE" AND THE COMPARISON BARS. `sitWhoEndsAhead` asks
 *      which count ends larger and never by how much. No difference is taken
 *      anywhere in this pack and no bar model is drawn.
 *   7. B4 HAS COUNTING ON, AND B18 THE RUN OF HOPS. Counting on is available to
 *      a child as a method and no page prescribes it; more to the point, no
 *      prompt here prints a sequence, names a first hop and a second, or asks
 *      what comes next. The chain's two arrivals are two events in a story, not
 *      two steps along a track.
 *   8. C1 HAS THREE-DIGIT PLACE VALUE. Nothing crosses a hundred, so a hundreds
 *      column never exists — which is also why the Day-5 numeral is unarguable
 *      rather than merely large.
 *
 * ── 3. TELLING THIS PAGE FROM B5'S, AND FROM B10'S ─────────────────────────
 *
 * "Cross the ten" is B5's sentence as much as it is this week's, so the
 * difference has to be stated in something a child could actually see.
 *
 *     B5 BUILDS THE TEN. B11 BUILDS A TEN AND THEN HAS TO SAY WHICH ONE.
 *
 * In B5 the ten a child makes is the only ten in the problem. Eight and five
 * fills a frame and leaves three, and the answer is "ten and three" — a teen
 * number, read off the shape of the thing. Nothing has a tens digit before the
 * work starts, so nothing can have its tens digit changed by it. Here the count
 * already holds three or four whole tens before anything arrives, so the ten the
 * ones build is the FOURTH or the FIFTH, and reading the answer means naming it.
 * Filling the frame settles the ones and leaves the question open.
 *
 * THE TEST A CHILD CAN RUN, AND IT IS ON EVERY PAGE OF BOTH WEEKS: look at the
 * first number. B5's has one digit. This week's has two — every count in every
 * table here starts at twenty-one, and `SETTLE_ROWS` is the only one that even
 * allows a ones digit of zero.
 *
 * THE SAME TEST AGAINST B10, from the other end of the sentence: look at the
 * SECOND number. b10's is always a whole ten and has a zero on the end, and its
 * `wholeTens()` guarantees it. This week's is always a single digit, and
 * `arrivingOnes()` guarantees that. One digit or two — that is the whole
 * distinction, and it is visible before any adding starts.
 *
 * ── 4. THE SYMBOLS ─────────────────────────────────────────────────────────
 *
 * The digits, and nothing else. No `+`, `=`, `−`, `▢`, `>`, `<`, `×`, `÷` or
 * `n/d` is put in front of a child at any point; the arithmetic is spoken in
 * words on every page, and a sweep of every prompt, option, hint, script line,
 * guided-example step and puzzle across sixty seeds returns not one of those
 * characters anywhere. That is a decision rather
 * than a habit. This week's whole risk is a child reading digits positionally —
 * 47 and 5 giving a 4, a 7, a 5 and therefore something with three digits in it
 * — and prose leaves that reading nothing to hold onto while the idea is being
 * built. The notation belongs to B6 (the equal sign) and to B13 (the column),
 * and neither is short of it. Internally the chains carry `{op:'add'}`, which is
 * how the op-chain library names a step and is not read by anybody.
 *
 * ── 5. THE TRANSFORM THE LIBRARY HAS NOT GOT, AND THE WAY ROUND IT ─────────
 *
 * L36 is explicit that impossibility gets PROVED before an escape hatch gets
 * used, so the recipe's numeral was pursued until a search either produced it or
 * came back empty. It came back empty, twice, and here are both searches.
 *
 * THE CONCATENATION IS NOT A BINARY OPERATION ON ANYTHING THE STORY HOLDS.
 * Write the count as `s = 10t + o` and the arrival as `b`. The true answer is
 * `s + b`; the child who writes 412 has produced `100t + (o + b)`, the tens they
 * kept with the ones total set down beside them. `d_verify_binop_misconception_v1`
 * varies only the OPERATION over one fixed pair, so the question is whether any
 * pair yields both values under two different operations. Searched exhaustively
 * over all 252 rows this week can legally draw, every operand taken from the
 * quantities the story prints or names (`s`, `b`, `t`, `o`, `10t`, `10`, `o+b`,
 * `10−o`, `o+b−10`, `s+b`) and all twelve ordered `{op, wrongOp}` pairs:
 * **ZERO combinations return both values.**
 *
 * The restriction to story quantities was then dropped as well, because an
 * argument about which operands are "natural" is weaker than a search. Over
 * every integer pair in [−600, 600], every one of the 252 rows DOES have a
 * solution — and every solution is of the same useless shape. For the recipe's
 * own 47 and 5 there are exactly two: `(232, −180)` under `{+, −}` and
 * `(232, 180)` under `{−, +}`. In general the pair is `(a, ±90k)`, forced by the
 * fact that `wrong − correct = 90t` and the only operation pair that can span a
 * fixed difference is `{+, −}`. So the operands are a number with no referent in
 * the story and a negative — and Level B has no negative numbers at all (E6 owns
 * them). That is fabrication with two extra steps, which §E2.12 has already
 * named. Recorded here so nobody runs the search again.
 *
 * THE BLOCK IS GENERAL, NOT SPECIFIC TO THIS ONE NUMERAL, and that is the more
 * useful finding. Every misconception this week can name changes an operand's
 * PLACE VALUE rather than the operation: the arriving ones read as tens
 * (`s + 10b`), the ones digit overwritten (`10t + b`), the tens dropped and the
 * ones answered alone (`o + b`). Each was tried and each fails the same way b10
 * proved for its own week — the pair that produces the truth cannot produce the
 * slip, and the pair that produces the slip cannot produce the truth. A statement
 * naming the column a digit ended up in describes a NUMERAL, not a pair of
 * numbers. The library holds exactly one digit-level transform,
 * `a_verify_teen_write_v1`, and it reverses digits: fed 52 it returns 25, which
 * is the confusion A10 and A22 exist to clear up rather than anything here.
 *
 * TWO DERIVATIONS THAT WORK AND WERE REJECTED ANYWAY, recorded because the
 * search found them and the week refused them:
 *   · `a_verify_count_slip_v1` in `skip-count` mode over the TOTAL returns
 *     `{correct: n, wrong: n − 1}` — the spill counted one short, 38 and 6
 *     answered 43. It type-checks and it is a real child's error. It is also
 *     B5's error verbatim: row B5's own entry is "bridges to 12 (miscounts the
 *     spill)", and b05 ships exactly this transform for exactly this reason.
 *     Taking it would put B5's misconception under B11's title.
 *   · `d_verify_binop_misconception_v1` with `{op:'+', wrongOp:'-'}` over
 *     `(s, b)` is derivable, honest, and constructible so that the true answer
 *     climbs into a new ten while the shown one falls back below the old one.
 *     Rejected on two counts. Both b03 and b10 already spend that swap on their
 *     own Day 5, so a third adjacent week would make it the level's default
 *     rather than a choice. And the diagnosis it asks a child to write — that
 *     something was taken away instead of put on — is not about crossing a ten,
 *     which is the only thing this week is for.
 *
 * THE ROUTE TAKEN is the reframe, which is second on §E2.3's list, and its
 * attraction is that it keeps the recipe's numeral instead of trading it away.
 *   · THE PAGE ASKS ABOUT THE TENS, NOT THE TOTAL. The truth is how many whole
 *     tens the count really holds, and the slip is that count stopped one short —
 *     which is precisely what a child claims by keeping the front digit still
 *     while the ones ran past ten. `a_verify_count_slip_v1` in `skip-count` mode
 *     returns exactly that pair, and it is applied to the tens count rather than
 *     to a total, so it is not the reading b05 has.
 *   · THE NUMERAL IS BUILT, NOT AUTHORED. `written` is the recomputed wrong tens
 *     count with the item's own ones total set down after it, so 47 and 5 prints
 *     412 on the page with nothing chosen by hand. QG-11 recomputes both halves
 *     from `generator.params` and requires the shown wrong value in the prompt;
 *     it is spelled out as "5 whole tens" in words as well as standing at the
 *     front of 412, so the pin is met by the claim rather than by a digit that
 *     happens to be inside a longer numeral (b08's finding).
 *   · THE MISCONCEPTION IS ALSO WORKED FROM BOTH OTHER SIDES. It heads the
 *     mistake bank, with its own rationale for why it is never offered as an
 *     option — three digits beside two makes it strikeable unread, which is b10's
 *     finding about a round number applied to a long one. And the Day-5 claim
 *     attacks it from the opposite direction: a child who answers "never" to
 *     "adding loose ones changes the tens digit" is holding exactly the belief
 *     that writes 412.
 *
 * WHICH GATE COVERS WHICH PAGE, written down so a reader does not have to
 * reconstruct it. `add_within_100_v1` carries the four single-sum situations and
 * `d_multistep_rat_v1` the two chains, all six audited by QG-5; the warm-ups go
 * through their own retrieval templates. On the QG-11 side, `d_verify_binop_v1`
 * recomputes the numeric trap's key and `a_verify_count_slip_v1` recomputes both
 * halves of the Day-5 working. Running `bb-qg11-power-test --level B` returns no
 * slot of this week — every key here is one bare numeral or one plain word.
 *
 * NOTHING AUDITS THE REMAINING FIVE SURFACES, and they are named because a
 * green run that looks complete is how the previous crop of real bugs got
 * through (L30). They are: the Day-5 sort, whose four verdicts are worked out at
 * module load, held against their own arithmetic and held against an even split,
 * so a typo stops the build; the always/sometimes/never claim; the probe, which
 * by its nature has no key (§8); the sorting trap's three-way shape, proved
 * inside the draw instead of afterwards; and the puzzle, which rests on a
 * construction-time search across all nine arrivals a child could name.
 *
 * ── 6. EVERY PICTURE CONSIDERED, AND THE ONE THAT SURVIVED ─────────────────
 *
 * A row of ten with counters in it is the best picture in Level B for this
 * content, which is exactly the difficulty (L33). Working through the primitives
 * one at a time gives a conclusion rather than an excuse:
 *
 *     THE BARE BOXES ARE THE ANSWER TO THE QUESTION THIS WEEK ASKS. EVERY
 *     ASSESSED PAGE HERE TURNS ON HOW MUCH ROOM THE ONES HAVE, AND A DRAWN ROW
 *     OF TEN HAS ALREADY COUNTED IT.
 *
 * Six branches, six separate answers:
 *
 *   (i) A FRAME HOLDING THE COUNT'S LOOSE ONES SETTLES THE CLASSIFICATION. Show
 *       eight counters and two bare boxes beside an arrival of six and the child
 *       does not have to decide whether a new ten begins; they can see it. That
 *       kills `discNewTen`, the probe and the Day-5 sort outright, and it hands
 *       the first move of every computational page over as well.
 *  (ii) DRAWING BOTH AMOUNTS IS WORSE, AND IT IS ALSO THE PICTURE A TEACHER
 *       REACHES FOR FIRST. Put the count's ones in the row and the arrivals next
 *       to it and there is nothing left to work out, only something to count.
 * (iii) A FRAME DRAWN AFTER THE BRIDGE ASSERTS THE ANSWER. A double frame
 *       showing ten and four claims the total the item is asking for, so it can
 *       only appear where the total is already printed.
 *  (iv) A PLACE-VALUE CHART OF THE COUNT ALONE IS LEGAL AND EMPTY. It says 38 is
 *       three tens and eight ones, which is B2's fact about a numeral already
 *       printed in the prompt. It buys nothing on an assessed page and it is not
 *       drawn on one.
 *   (v) THE NUMBER LINE IS TURNED DOWN OUTRIGHT, THE SCRIPT INCLUDED. A hop of
 *       six drawn along a line turns the sum into a walk, which belongs to B4 and
 *       to B18 — and it swaps the week's question ("has the ones column got
 *       room?") for a different one ("where does the walk stop?"). Once is
 *       enough for a child to start expecting it, so it appears nowhere at all.
 *  (vi) THE COUNTER PRIMITIVE'S SCAFFOLDS ARE NEVER PASSED. `crossedOut` marks a
 *       removal and nothing is removed in this pack; `showPairs` and `markExtra`
 *       are not exposed by the builders used here and would do the child's work
 *       if they were.
 * (vii) WHICH LEAVES NO FIGURE ON ANY ASSESSED ITEM. Level B is not asked for
 *       one (`pictorialPerDay: 0`), so nothing required is missing — but the
 *       route here was elimination rather than convenience, and four weeks in a
 *       row (b07, b08, b09, b10) arrived at the same place from their own
 *       content.
 *
 * THE TWO SURFACES THAT DO CARRY THE ROW OF TEN are the first script segment and
 * the modelled guided example, and both say the total aloud on the same line.
 * Neither asserts anything: a script segment holds no answer and no params for
 * QG-13 to weigh a drawing against, and the modelled example prints 44 under the
 * picture, so an assertion would only be checking a numeral the child can
 * already read. Both alt texts name the counters AND the bare boxes, since the
 * bare boxes are what a sighted child is being shown as well.
 *
 * ── 7. HOW MUCH OF THIS PACK GUESSING WOULD PAY FOR (kit §E2.11) ───────────
 *
 * Everything below was measured, not reasoned about. Unless stated otherwise the
 * figures are over 2,500 packs.
 *
 *   · THE WEEK'S OWN HAZARD FIRST: CAN THE CROSSING AND NON-CROSSING PAGES BE
 *     TOLD APART BY A DIGIT? Partly, and it cannot be made otherwise — whether a
 *     new ten begins is `o + b ≥ 10`, a deterministic function of the two
 *     digits, so neither can be made independent of the outcome by any draw.
 *     Measured over 10,000 single-sum pages the overall split is 50.0%
 *     crossing, and the conditional shares are a staircase:
 *         P(crosses | ones digit) — 0: 0% · 1: 0% · 2: 13% · 3: 29% · 4: 41% ·
 *                                   5: 57% · 6: 72% · 7: 85% · 8: 100% · 9: 100%
 *         P(crosses | arrival)    — 2: 12% · 3: 22% · 4: 34% · 5: 44% · 6: 56% ·
 *                                   7: 66% · 8: 79% · 9: 88%
 *     THAT COSTS NOTHING WHERE IT WAS MEASURED, because on those pages the child
 *     is not asked to classify: knowing that 38 and 6 crosses does not produce
 *     44. It would cost everything on the pages where the classification IS the
 *     answer, so on those the independence is enforced per item instead of hoped
 *     for from the pool — see the two entries below.
 *   · `discNewTen` IS BUILT AGAINST BOTH DIGITS. `SORT_SHAPES` stores each
 *     three-pair row under which of the two the crossing pair leads on, refuses
 *     to store a row where it leads on both, and the draw takes a shape before it
 *     takes a row. Measured over 5,000 exposures, the crossing pair has the
 *     biggest ones digit on 34.3%, the biggest arrival on 32.3%, the biggest
 *     count on 32.6% and the biggest total on 32.7%; it is the first pair printed
 *     on 34.5%. Five habits, five doors, and none of them worth more than a
 *     guess.
 *   · `discWhichCount` OFFERS FIVE NAMED WRONG COUNTS, TWO BELOW THE KEY AND
 *     THREE ABOVE, two of them shown at a time over three fixed pairings.
 *     Measured across 10,000 exposures the true count is largest on 33.3%,
 *     middle on 34.3% and smallest on 32.5% — which is L43's rule read as the
 *     invariant it states rather than as the one shape it was first found in.
 *     THE PAIRINGS ARE ALSO CHOSEN ON THE LAST DIGIT, which is a tell this week
 *     creates and no other has. Three of the five wrong counts end in the digit
 *     the answer ends in and two end in the arriving digit, so a careless pairing
 *     leaves exactly one option identifiable without arithmetic — and in the
 *     worst arrangement the odd one out IS the key, which would be a free pass.
 *     Only all-alike and all-different pairings are stored, it is re-checked
 *     inside the item on every draw, and the measured rate at which any option is
 *     findable by its last digit alone is 0.0%. "Pick the one ending like the
 *     printed count" also selects the key uniquely on 0.0%, since the answer's
 *     last digit is never the count's.
 *     ONE PROPERTY IS REPORTED RATHER THAN FIXED. On the both-below pairing one
 *     of the two wrong counts is the ones total alone — eleven to eighteen,
 *     against an answer in the thirties or above. A child who checks the size of
 *     an answer will strike it, which leaves them a two-way page on a third of
 *     draws. That check is a habit this week is trying to build, and the count is
 *     a real thing children write, so it stays.
 *   · THREE MECHANICAL HABITS RUN AGAINST THE PACK AS A WHOLE, since a habit is
 *     a property of a week rather than of one page. Sixteen non-retrieval slots
 *     carry a numeric or keyed answer; over 2,500 seeds that is 40,000 exposures.
 *     "Add the two printed numbers" lands on the key 50.0% of the time; "write
 *     the two printed numbers side by side" 0.0%; "answer with the biggest
 *     printed number" 0.0%. The 50.0% is the eight single-sum slots, where adding
 *     the two printed numbers is not a shortcut past the mathematics but the
 *     mathematics itself. The eight it fails on are the ones doing the week's
 *     work: four numbers printed and one total wanted on the comparison, three on
 *     each chain, six on the sorting trap with none of them wanted, and a numeric
 *     trap whose answer never appears in the story at all.
 *   · RANK MEANS NOTHING WHERE THERE IS NO MENU, so the entropy gate is properly
 *     silent on nine of the sixteen slots and their answer spaces were counted by
 *     hand instead, over 2,500 seeds. Distinct keyed answers per slot: 216 and
 *     216 on the two sorting-trap slots, 73, 72, 71, 71, 64, 64, 57, 57, 56, 56
 *     and 42, 42 across the situations and the chains. The narrowest by a long
 *     way is the exactly-ten page at SEVEN, and that is a fact about the content
 *     rather than about the draw: a sum that lands on a whole ten below a hundred
 *     has only eight landings available and this week uses seven of them. It is a
 *     free-entry page, so there is no menu to guess from, and it sits beside
 *     pages where guessing pays nothing.
 *   · NO OPTION IS A PERMANENT DECOY. Every option on both traps is a numeral or
 *     a sum worked out from the numbers that draw happened to take, so no option
 *     string is ever seen twice and `DECLARED_LURES` has nothing to record. Exactly one
 *     answer stands still all year: the Day-5 claim keys "sometimes" on every
 *     seed. That is true of the claim and not of any draw, and the slot is there
 *     to teach rather than to certify — neither mastery form carries it (L42).
 *     `bb-answer-entropy-test --all` returns nothing against this week.
 *   · `sitWhoEndsAhead` COULD HAVE BEEN WON BY LOOKING AT THE STARTS. It is not:
 *     over 10,000 exposures the count that started BEHIND wins on 50.2% and the
 *     count named FIRST wins on 50.0%, because `AHEAD_ROWS` stores the upsets and
 *     the straight rows in equal numbers and a coin decides the printing order.
 *
 * ── 8. THE PROBE — WHAT IT ASKED, AND WHAT WAS SERVED ──────────────────────
 *
 * There is no key on a probe, which means no gate will ever look at it and the
 * only account of what was served is the one an author writes down (L41). The
 * words are "will a new ten start before lunch?" — seven of them, which is what
 * §E2.9 leaves once the wrapper's lead-in is counted, and it is the catalog's own
 * prediction column for this cell put into the week's own vocabulary.
 *
 * DRAWING THE SIDE FIRST IS NOT PROOF (kit rule 9a), so it is not what happens
 * here. `ARRIVAL_ROWS` prints `{start, first, second}`, the flip decides only
 * WHICH ARRIVAL COMES BEFORE LUNCH, and the guard's signature is the commuted
 * token list — so the two branches are not merely similar surfaces but the SAME
 * surface, and `drawUniqueItem`'s redraws cannot suppress a side even in
 * principle. Measured over 20,000 exposures across four independent seed
 * families: 49.9%, 50.6%, 49.5% and 50.3%; pooled 50.1%, standard error 0.35.
 *
 * A SECOND MEASUREMENT WAS NEEDED, AND IT CHANGED THE POOL. b09's construction
 * makes the flip carry the whole of the variation, which for this week would mean
 * every row holding exactly one arrival that starts a new ten. That is an even
 * split and a free question: whether an arrival starts a new ten climbs with its
 * SIZE, so on such a pool "the bigger one came first" answers the probe every
 * time. Measured at 100% by construction. The pool therefore also carries rows
 * where BOTH arrivals would start a new ten and rows where NEITHER would, in
 * equal numbers, with the rows the flip decides capped at half of that. The two
 * pressures pull against each other and the numbers are the argument for where
 * they were left:
 *       all rows decided by the flip — split 50%, size habit 100%
 *       flip rows uncapped            — split 48.6–49.8%, size habit 70.4–71.4%
 *       flip rows capped at the class — split 48.8–50.0%, size habit 65.9–66.8%
 *       flip rows capped at half      — split 49.5–50.6%, size habit 59.6–60.3%
 * The last is what ships. The flip still carries a fifth of the variation, which
 * is enough that the freshness guard has nothing to bias, and the size habit is
 * worth about ten points over a coin. That residual is reported rather than
 * hidden, and it is the general lesson this week adds to rule 9a: MAKING BOTH
 * BRANCHES PRINT THE SAME NUMERALS IS NECESSARY AND NOT SUFFICIENT — when the
 * probe's answer is monotone in one of those numerals, a pool where the branch
 * decides everything hands the child that numeral as the answer.
 *
 * THE WRAPPER IS THE ONLY WAY IN, per §E2.2: no daily slot serves
 * `msTwoArrivals` bare. The wrapper leaves the hint ladder untouched, so putting
 * putting both forms out would spend two of the dedup's three ladder slots on a
 * single idea. Mastery does not carry it either, and that is a choice worth stating:
 * asking a child to commit before working hands them the very judgement a
 * certificate is supposed to be taking a reading of. The joining it teaches is
 * measured by `msTensThenOnes` instead, which wants the same move with a
 * borrowed step standing in front of it.
 *
 * ── 9. BAND SETTINGS, DOSE, AND THE SETTINGS THE STORIES USE ───────────────
 *
 * THE BAND TABLE IN FILL-ARCHITECTURE §1 was taken one setting at a time. Its
 * fifteen-word ceiling reads 0.00% here over thirty seeds, with guided-example
 * `teacherSay` and `childDo` counted — two fields the gate only recently opened.
 * Reaching it cost something: the sorting trap prints each pair as a sentence of
 * its own for that reason, and the modelled think-aloud runs to three short lines
 * instead of one long one. Three sentences had to be shortened afterwards, all
 * three of them teacher's prose that had quietly stretched — a nineteen-word
 * script line, and a hint and a summary at sixteen apiece. Metacognition is the
 * band's prediction shape. One sentence is what the Day-5 working asks for. The
 * sprint runs against nothing and nobody. Day sizes are 5/5/5/5/4, costing 9.5 to
 * 11.75 minutes; 6 of the 24 items are retrieval, or 25.0%. Five situation
 * families appear: part-whole, combine, comparison, multi-stage, rate-of-change.
 *
 * THE SETTINGS WERE RE-SCANNED AGAINST THE WHOLE DIRECTORY AFTER THE FILE WAS
 * DONE, not before it was started (kit §E2.8) — siblings arrive while a week is
 * being written. Drawing pins, elastic bands, pumpkin seeds, milk caps, bulldog
 * clips and split pins return no hit anywhere in the corpus. Dropped on the
 * strength of that scan rather than shipped: pine cones (already b16's),
 * hairclips (b09), cotton reels (b06), lolly sticks and clothes pegs (b15), plus
 * beads, buttons, marbles, stickers, tiles, cups and counters, each of which
 * already carries between fifteen and thirty-three weeks. A week about
 * two-digit counts wants a small countable object; so, it turns out, does every
 * other week. The verbs went the same way — b10's amounts are tipped, dropped
 * and slid in, so this week's are pressed, flicked, shaken, posted, stacked and
 * pushed.
 *
 * THE SIZES WERE READ, NOT JUST COMPUTED. Counts here run into the high
 * eighties, and eighty of the wrong thing reads as nonsense however correct the
 * arithmetic is. Everything counted in this file is something a school cupboard
 * genuinely keeps in those numbers. No animal and no person is counted anywhere,
 * and no container is asked to hold a hundred of anything.
 */

import { asWarmup, classify, reasoning } from '../lib/items';
import type { ItemGen } from '../lib/items';
import { situation } from '../lib/situations';
import { multiStep } from '../lib/multistep';
import { discrimination } from '../lib/discrimination';
import { errorAnalysis } from '../lib/erroranalysis';
import { withEstimateFirst } from '../lib/metacog';
import { article, countNoun, fmtInt } from '../lib/format';
import { makeGe, makeWeekBuilder } from '../lib/assemble';
import { tenFrame } from '../lib/figures';
import type { BBFigure } from '../../../figures/types';
import type { Rng } from '../../rng';

const ge = makeGe('B');

const A23 = { level: 'A' as const, week: 23 };
const B2 = { level: 'B' as const, week: 2 };
const B5 = { level: 'B' as const, week: 5 };
const B10 = { level: 'B' as const, week: 10 };

const NAMES = ['Maya', 'Leo', 'Ava', 'Ben', 'Mia', 'Sam', 'Ria', 'Noor', 'Ken', 'Pia', 'Tom', 'Zoe'] as const;
/** A name, drawn. No literal anywhere in this file may repeat one of these (kit §A.3). */
const one = (r: Rng): string => r.pick(NAMES);
/** Two names that differ, so no page sets a child against themselves. */
const two = (r: Rng): [string, string] => r.shuffle([...NAMES]).slice(0, 2) as [string, string];

/** The five DD7 tags written as a union, so a typo stops the build. */
type Tag = 'fact-recall' | 'procedure-slip' | 'concept-misconception' | 'representation-misread' | 'task-comprehension';

type Params = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Two fences, and both of them are code
//
// A boundary a file only PROMISES to respect is one edit away from moving. Both
// of this week's are therefore functions that throw. `arrivingOnes` refuses any
// amount outside one to nine, which is how B10 keeps its whole tens; and
// `underAHundred` refuses any total that reaches three digits, which is how B13
// keeps its written column. Every table runs its numbers through them at import,
// so a future range change fails the build rather than quietly writing somebody
// else's page.
// ---------------------------------------------------------------------------

function arrivingOnes(amount: number, where: string): number {
  if (!Number.isInteger(amount) || amount < 1 || amount > 9) {
    throw new Error(`b11 ${where}: ${amount} is not a single-digit amount of ones — B10 owns anything made of whole tens`);
  }
  return amount;
}

function underAHundred(total: number, where: string): number {
  if (total > 99) {
    throw new Error(`b11 ${where}: ${total} runs past ninety-nine, which needs the column B13 owns`);
  }
  return total;
}

/**
 * How many rows a table has to hold before the pack it feeds can be assembled.
 * The number is the count of different numeric surfaces that table's readers ask
 * for over five days and two mastery forms; below it, the freshness guard runs
 * out of fresh draws and starts handing back what it has already used.
 */
function pool<T>(name: string, rows: readonly T[], floor: number): readonly T[] {
  if (rows.length < floor) {
    throw new Error(`b11 ${name}: ${rows.length} rows cannot cover a pack drawing ${floor} distinct surfaces from it`);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Six settings, each fixed as a single row
//
// Noun, container and arriving verb travel together and are picked together;
// drawing them apart is how a sentence ends up shaking milk caps or posting
// seeds (L26). What limits the list is arithmetic rather than taste: these pages
// reach into the eighties, so every noun had to be something a school cupboard
// really does hold that many of, and anything a reader would stumble over at
// eighty was dropped before it was written down (kit §E2.10).
// ---------------------------------------------------------------------------

interface Frame {
  /** What is being counted, plural, exactly as a prompt sets it down. */
  noun: string;
  /** The container it lives in, article included. */
  place: string;
  /** The verb an incoming amount takes, third-person plural past. */
  arrived: string;
}

const FRAMES: readonly Frame[] = [
  { noun: 'drawing pins', place: 'the pin pot', arrived: 'were pressed in' },
  { noun: 'elastic bands', place: 'the band jar', arrived: 'were flicked in' },
  { noun: 'pumpkin seeds', place: 'the seed tub', arrived: 'were shaken in' },
  { noun: 'milk caps', place: 'the collecting box', arrived: 'were posted in' },
  { noun: 'bulldog clips', place: 'the desk tray', arrived: 'were stacked in' },
  { noun: 'split pins', place: 'the fastener tin', arrived: 'were pushed in' },
];

const frame = (r: Rng): Frame => r.pick(FRAMES);

/** A place name opens a sentence as often as it closes one, so it is capitalised
 *  through one helper rather than by hand in six prompts. */
const cap = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

// ---------------------------------------------------------------------------
// The tables, built once at import and read with one pick
//
// Nothing here is a draw that gets rejected and retried. A retry spends an
// unpredictable number of values out of the seeded stream, and every item after
// it in the pack then lands somewhere else entirely (kit §E2.4), so each legal
// combination is worked out in a loop up front and the item takes exactly one.
// Doing it that way also makes each constraint visible as a line of code, which
// is what let the crossing balance below be argued about at all.
// ---------------------------------------------------------------------------

/**
 * `[start, more]` where the arriving ones SETTLE — the ones column takes them
 * all and the tens digit never moves. 45 + 3, in the catalog's own words.
 *
 * The ones digit runs from ZERO here and nowhere else in the pack. A count of
 * forty has no loose ones for the arrivals to meet, so it is the shape where
 * this week's question does not arise — and b10 hands it over by name ("40 + 7
 * is not this week's"), so it belongs here rather than nowhere. It is confined
 * to the settling pool, where nothing depends on a ones digit being visible.
 */
const SETTLE_ROWS = pool(
  'SETTLE_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let t = 2; t <= 9; t++) {
      for (let o = 0; o <= 7; o++) {
        for (let b = 2; b <= 9; b++) {
          if (o + b > 9) continue;
          const start = 10 * t + o;
          underAHundred(start + arrivingOnes(b, 'SETTLE_ROWS'), 'SETTLE_ROWS');
          out.push([start, b] as const);
        }
      }
    }
    return out;
  })(),
  60,
);

/**
 * `[start, more]` where the arriving ones SPILL — the ones fill a ten and some
 * are left over, so the tens digit climbs by exactly one. 38 + 6.
 *
 * `o + b >= 11` rather than `>= 10`: the sum that lands ON a ten is a shape of
 * its own and has its own table, because a page whose answer ends in a zero
 * behaves differently everywhere it is used.
 */
const SPILL_ROWS = pool(
  'SPILL_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let t = 2; t <= 9; t++) {
      for (let o = 2; o <= 9; o++) {
        for (let b = 2; b <= 9; b++) {
          if (o + b < 11) continue;
          const start = 10 * t + o;
          const total = start + arrivingOnes(b, 'SPILL_ROWS');
          if (total > 99) continue;
          out.push([start, b] as const);
        }
      }
    }
    return out;
  })(),
  60,
);

/**
 * `[start, more]` where the ones make EXACTLY ten, so the count lands on a whole
 * ten and the ones digit becomes nothing at all. 47 + 3.
 */
const EXACT_ROWS = pool(
  'EXACT_ROWS',
  (() => {
    const out: Array<readonly [number, number]> = [];
    for (let t = 2; t <= 8; t++) {
      for (let b = 2; b <= 9; b++) {
        const o = 10 - b;
        const start = 10 * t + o;
        underAHundred(start + arrivingOnes(b, 'EXACT_ROWS'), 'EXACT_ROWS');
        out.push([start, b] as const);
      }
    }
    return out;
  })(),
  40,
);

/**
 * `[start, more]` for the numeric trap. Every offered wrong count has to remain
 * a number this week can print, and the widest of them is `total + 10`, so the
 * total is capped at eighty-nine. `o !== b` keeps the two above-the-key counts
 * apart from each other; `t >= 2` keeps the ones-only count apart from the
 * dropped-ten count. Both are re-checked inside the item on every draw.
 */
const TRAP_ROWS = pool(
  'TRAP_ROWS',
  SPILL_ROWS.filter(([s, b]) => s + b <= 89 && s % 10 !== b && Math.floor(s / 10) >= 2),
  40,
);

/**
 * `[start, more]` for the Day-5 worked answer. The tens count of the true total
 * is what the item is really about, so the start must carry at least two whole
 * tens for "one ten short" to be a count a child could plausibly have reached.
 */
const WORKED_ROWS = pool('WORKED_ROWS', SPILL_ROWS.filter(([s]) => Math.floor(s / 10) >= 3), 30);

/**
 * `[start, first, second]` — one count, two separate arrivals of loose ones. It
 * is the only table the estimate-first wrapper reads through.
 *
 * THE PROBE'S SIDE IS DECIDED BY WHICH ARRIVAL COMES FIRST, so both branches
 * print `{start, first, second}` and the freshness guard sees one surface either
 * way (kit rule 9a; b09's construction rather than b22's dodge).
 *
 * WHY THE TABLE MIXES THREE CLASSES RATHER THAN HOLDING ONE. Whether an arrival
 * starts a new ten climbs with its size, so a table where exactly one of the two
 * arrivals crosses would make "the bigger one came first" a perfect answer to the
 * probe — the flip would be even and the probe would still be free. So the table
 * also carries rows where BOTH arrivals would start a new ten and rows where
 * NEITHER would, in equal numbers, and caps the rows that genuinely turn on the
 * flip at half of that. The two shares pull opposite ways and the header reports
 * where they were left: the flip carries a fifth of the variation, which is
 * enough to keep the freshness guard out of it, and the size habit is worth
 * little more than a guess.
 *
 * The two arrivals are never equal, which keeps the page off B19's doubles and
 * stops the probe becoming a coin a child can see is two-headed.
 */
type Triple = readonly [number, number, number];

const ARRIVAL_ROWS: readonly Triple[] = pool(
  'ARRIVAL_ROWS',
  (() => {
    const both: Triple[] = [];
    const neither: Triple[] = [];
    const split: Triple[] = [];
    for (let t = 2; t <= 8; t++) {
      for (let o = 1; o <= 8; o++) {
        for (let p = 2; p <= 9; p++) {
          for (let q = 2; q < p; q++) {
            const start = 10 * t + o;
            const total = start + arrivingOnes(p, 'ARRIVAL_ROWS') + arrivingOnes(q, 'ARRIVAL_ROWS');
            if (total > 99) continue;
            const row: Triple = [start, p, q];
            if (o + q >= 10) both.push(row);
            else if (o + p < 10) neither.push(row);
            else split.push(row);
          }
        }
      }
    }
    // TRIMMED TO THE SHORTER SIDE so the two lopsided classes cancel exactly.
    // A row where both arrivals would start a new ten answers the probe "yes"
    // whichever one comes first; a row where neither would answers "no"; equal
    // counts of the two leave the probe even before the flip is consulted at
    // all. The rows the flip DOES decide are then capped at half of that, which
    // is what holds the size habit down without handing the split back to the
    // freshness guard.
    const n = Math.min(both.length, neither.length);
    return [...both.slice(0, n), ...neither.slice(0, n), ...split.slice(0, Math.floor(n / 2))];
  })(),
  60,
);

/**
 * `[start, tens, ones]` — a count, a delivery of whole tens, then loose ones.
 *
 * The whole-ten step is B10's settled work carried in as a prior skill; the
 * loose-ones step is this week's. The tens are never fewer than two whole ones,
 * which is b10's own floor, so the borrowed half is unmistakably the page b10
 * taught rather than B1's single step down the chart.
 */
const TENS_THEN_ONES_ROWS = pool(
  'TENS_THEN_ONES_ROWS',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (let t = 2; t <= 5; t++) {
      for (let o = 1; o <= 8; o++) {
        for (let k = 2; k <= 4; k++) {
          for (let b = 2; b <= 9; b++) {
            const start = 10 * t + o;
            const total = start + 10 * k + arrivingOnes(b, 'TENS_THEN_ONES_ROWS');
            if (total > 99) continue;
            out.push([start, 10 * k, b] as const);
          }
        }
      }
    }
    return out;
  })(),
  60,
);

/**
 * `[lowStart, lowMore, highStart, highMore]` for the add-then-compare page —
 * two counts, one arrival of loose ones each, and the question of which finishes
 * ahead. The starts are always different and the totals are always different.
 *
 * HALF THE ROWS ARE UPSETS. On an upset the count that started behind finishes
 * in front, because its ones filled a ten and the other's did not — which is the
 * only reason a page like this belongs in THIS week rather than in B3, where
 * comparing two two-digit numbers was settled. The other half run straight, so
 * "the one that started behind wins" is worth nothing either.
 */
type Quad = readonly [number, number, number, number];

const AHEAD_ROWS: readonly Quad[] = pool(
  'AHEAD_ROWS',
  (() => {
    const upset: Quad[] = [];
    const straight: Quad[] = [];
    for (let lowStart = 21; lowStart <= 88; lowStart++) {
      if (lowStart % 10 === 0) continue;
      for (let gap = 1; gap <= 6; gap++) {
        const highStart = lowStart + gap;
        if (highStart % 10 === 0 || highStart > 89) continue;
        for (let lowMore = 2; lowMore <= 9; lowMore++) {
          for (let highMore = 2; highMore <= 9; highMore++) {
            if (lowMore === highMore) continue;
            const lowTotal = lowStart + arrivingOnes(lowMore, 'AHEAD_ROWS');
            const highTotal = highStart + arrivingOnes(highMore, 'AHEAD_ROWS');
            if (lowTotal === highTotal) continue;
            if (lowTotal > 99 || highTotal > 99) continue;
            const row: Quad = [lowStart, lowMore, highStart, highMore];
            if (lowTotal > highTotal) upset.push(row);
            else straight.push(row);
          }
        }
      }
    }
    const n = Math.min(upset.length, straight.length);
    return [...upset.slice(0, n), ...straight.slice(0, n)];
  })(),
  100,
);

/**
 * The sorting trap's rows: three counts, three arrivals, exactly ONE of the
 * three pairs moving into a new ten.
 *
 * THE SHAPE FIELD IS WHY THIS IS A TABLE. Whether a pair moves into a new ten is
 * decided by the ones digit and the arrival TOGETHER, so if the crossing pair
 * always carried the biggest ones digit — or always the biggest arrival — the
 * page could be sorted without adding anything at all. Each row therefore
 * records which of those two the key leads on:
 *   0 — the key has the biggest ones digit and NOT the biggest arrival;
 *   1 — the key has the biggest arrival and NOT the biggest ones digit;
 *   2 — the key leads on neither.
 * A row where the key leads on both is never stored, and the draw takes a shape
 * first, so each habit is worth about what a blind guess is worth. Measured
 * shares are in the header.
 */
interface SortRow {
  /** [onesDigit, arriving] for the pair that moves into a new ten. */
  key: readonly [number, number];
  /** The two pairs whose ones settle. */
  rest: readonly [readonly [number, number], readonly [number, number]];
}

const SORT_SHAPES: readonly (readonly SortRow[])[] = (() => {
  const crossing: Array<readonly [number, number]> = [];
  const settling: Array<readonly [number, number]> = [];
  for (let o = 1; o <= 8; o++) {
    for (let b = 2; b <= 9; b++) {
      if (o + b >= 10) crossing.push([o, b] as const);
      else settling.push([o, b] as const);
    }
  }
  const buckets: SortRow[][] = [[], [], []];
  for (const key of crossing) {
    for (let i = 0; i < settling.length; i++) {
      for (let j = i + 1; j < settling.length; j++) {
        const a = settling[i];
        const c = settling[j];
        const ones = [key[0], a[0], c[0]];
        const adds = [key[1], a[1], c[1]];
        if (new Set(ones).size !== 3 || new Set(adds).size !== 3) continue;
        const leadsOnes = key[0] > a[0] && key[0] > c[0];
        const leadsAdds = key[1] > a[1] && key[1] > c[1];
        if (leadsOnes && leadsAdds) continue;
        const shape = leadsOnes ? 0 : leadsAdds ? 1 : 2;
        buckets[shape].push({ key, rest: [a, c] as const });
      }
    }
  }
  for (const [i, b] of buckets.entries()) {
    if (b.length < 20) throw new Error(`b11 SORT_SHAPES: shape ${i} holds only ${b.length} rows`);
  }
  return buckets;
})();

/** Tens digits for the three sorted counts, drawn distinct so no two counts collide. */
const SORT_TENS = pool(
  'SORT_TENS',
  (() => {
    const out: Array<readonly [number, number, number]> = [];
    for (let a = 2; a <= 8; a++) {
      for (let b = 2; b <= 8; b++) {
        for (let c = 2; c <= 8; c++) {
          if (a === b || b === c || a === c) continue;
          out.push([a, b, c] as const);
        }
      }
    }
    return out;
  })(),
  100,
);

/**
 * `[onesDigit, arriving]` for the puzzle, which never looks at the tens at all.
 * The last digit must genuinely move (`arriving` is never ten) and the two
 * directions are stored in equal numbers, so a child cannot learn that the digit
 * always falls back or always climbs.
 */
const PUZZLE_DIGITS = pool(
  'PUZZLE_DIGITS',
  (() => {
    const climbs: Array<readonly [number, number]> = [];
    const falls: Array<readonly [number, number]> = [];
    for (let o = 1; o <= 8; o++) {
      for (let b = 1; b <= 9; b++) {
        const row = [o, arrivingOnes(b, 'PUZZLE_DIGITS')] as const;
        if (o + b < 10) climbs.push(row);
        else falls.push(row);
      }
    }
    const n = Math.min(climbs.length, falls.length);
    return [...climbs.slice(0, n), ...falls.slice(0, n)];
  })(),
  40,
);

/** `[tens, ones]` for the B2 warm-up and `[o]` for the two ten-frame warm-ups. */
const WHOLE_TENS_ROWS = pool(
  'WHOLE_TENS_ROWS',
  (() => {
    const out: number[] = [];
    for (let n = 23; n <= 98; n++) if (n % 10 !== 0) out.push(n);
    return out;
  })(),
  60,
);

// ---------------------------------------------------------------------------
// Getting the operands out of a discrimination
//
// The shared `discrimination()` primitive returns no `generator` spec at all, so
// a keyed option leaves the pack with no params for QG-11 to recompute anything
// from — the audit simply skips it. What follows is the smallest way round that:
// one mutable slot, written by the closure that did the drawing and read one
// statement later by the wrapper that received the draft. The ordering is the
// whole safety argument. A draw may be re-run any number of times before one is
// accepted, and whichever run produced the returned draft is also the run that
// wrote the slot last. Five earlier weeks reached the same device independently.
// Putting it in `lib/` instead would be a shared-file edit, which kit §G reserves.
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
    if (!pin) throw new Error('b11/withPin: nothing was left in the slot, so this key would ship unaudited');
    return { ...d, generator: { templateId, params: pin.params, seed: pin.seed } };
  };
}

// ---------------------------------------------------------------------------
// One drawing, twice, and both times beside a spoken answer
//
// Fill a row of ten with the loose ones a count is carrying and the bare boxes
// have already told the child how much more will fit — which is the judgement
// every assessed page here exists to demand. So the row appears in the lesson
// script and at the top of the fade, where the total is said aloud in the same
// breath, and on no page a child is being measured on (header §6).
// ---------------------------------------------------------------------------

const onesFrame = (ones: number, alt: string): BBFigure => tenFrame(ones, { alt });

// ---------------------------------------------------------------------------
// Four warm-ups, and each of them is load-bearing later in the same week
//
// Take B5's partner of ten away and "how much room is left" stops being a
// question anyone can answer. Take A23's ten-and-some away and a spill has no
// shape to land in. Take B2's tens count away and the phrase "a new ten" names
// nothing in particular. Take B10's whole tens away and the second chain opens
// on a step that has never been settled. Every one of the four sits strictly
// behind this cell on the ladder, which is what QG-2 asks of a retrieval source.
// ---------------------------------------------------------------------------

/** B5 — the partner of ten, the fact every bridge turns on. */
const wPartnerOfTen = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'partner-of-ten',
    draw: (r) => {
      const o = r.int(1, 9);
      return {
        prompt: `A row of ten has ${countNoun(o, 'counters')} sitting in it. How many boxes are still bare?`,
        answerValue: String(10 - o),
        templateId: 'retr_partners_of_10_v1',
        params: { a: o },
        units: 'boxes',
        hints: [
          'Where along the row do the counters stop?',
          'Point at the first bare box and count on to the end of the row.',
        ],
        errorTags: ['fact-recall', 'representation-misread'],
      };
    },
  }),
  B5,
);

/** A23 — a ten with singles on top of it, which is what is left after a row fills. */
const wTenAndSome = asWarmup(
  situation({
    situationType: 'combine',
    cognitiveOp: 'teen-as-ten-and-some',
    draw: (r) => {
      const o = r.int(1, 9);
      return {
        prompt: `What number is one whole ten with ${countNoun(o, 'single ones')} on top of it?`,
        answerValue: String(10 + o),
        templateId: 'retr_teen_ten_ones_v1',
        params: { o },
        hints: [
          'Where does a count get to once a whole ten is made?',
          'Start at ten and say the single ones on from there.',
        ],
        errorTags: ['concept-misconception', 'fact-recall'],
      };
    },
  }),
  A23,
);

/** B2 — reading the whole tens straight off a two-digit numeral. */
const wWholeTensIn = asWarmup(
  situation({
    situationType: 'part-whole',
    cognitiveOp: 'count-tens-in-a-number',
    draw: (r) => {
      const n = r.pick(WHOLE_TENS_ROWS);
      return {
        prompt: `How many whole tens are inside ${fmtInt(n)}?`,
        answerValue: String(Math.floor(n / 10)),
        templateId: 'tens_ones_decompose_v1',
        params: { n },
        units: 'tens',
        hints: [
          'Which of the two digits counts the whole tens?',
          'Read the front digit. That is the count of whole tens.',
        ],
        errorTags: ['representation-misread', 'concept-misconception'],
      };
    },
  }),
  B2,
);

/** B10 — whole tens put on a count, which is the settled half of the second chain. */
const wWholeTensOn = asWarmup(
  situation({
    situationType: 'rate-of-change',
    cognitiveOp: 'add-whole-tens',
    draw: (r) => {
      const start = r.pick(WHOLE_TENS_ROWS.filter((n) => n <= 68));
      const k = r.int(2, 3);
      return {
        prompt: `What number does ${fmtInt(start)} reach when ${countNoun(k, 'whole tens')} go on?`,
        answerValue: String(start + 10 * k),
        templateId: 'retr_add_within_100_v1',
        params: { a: start, b: 10 * k },
        hints: [
          'Which digit do whole tens ever reach?',
          'Climb the front digit by the tens put on and leave the back digit.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception'],
      };
    },
  }),
  B10,
);

// ---------------------------------------------------------------------------
// THE FIRST SHAPE — the ones settle, and the front digit never stirs
//
// 45 + 3. Everything the arrivals bring fits in the ones column, so the page is
// finished in the ones and the tens are only carried along.
// ---------------------------------------------------------------------------

const sitOnesSettle = situation({
  situationType: 'part-whole',
  cognitiveOp: 'ones-settle-in-the-ones',
  draw: (r) => {
    const f = frame(r);
    const [start, more] = r.pick(SETTLE_ROWS);
    const name = one(r);
    return {
      prompt: `${name} counted ${countNoun(start, f.noun)} in ${f.place}. Then ${countNoun(more, f.noun)} ${f.arrived}. How many ${f.noun} are in ${f.place} now?`,
      answerValue: String(start + more),
      templateId: 'add_within_100_v1',
      params: { a: start, b: more },
      units: f.noun,
      hints: [
        'How many more will fit before a new ten begins?',
        'Join the arrivals to the loose ones and read the count.',
      ],
      errorTags: ['fact-recall', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// SHAPE TWO — there is not enough room, so a ten gets built
//
// 38 + 6. Some of the arrivals finish the row, the finished row leaves as one
// whole ten, and the remainder stays loose on top of it. The front digit gains
// one, and one is the most it can ever gain.
// ---------------------------------------------------------------------------

const sitOnesSpill = situation({
  situationType: 'combine',
  cognitiveOp: 'ones-spill-into-a-new-ten',
  draw: (r) => {
    const f = frame(r);
    const [start, more] = r.pick(SPILL_ROWS);
    const [a, b] = two(r);
    return {
      prompt: `${a} had ${countNoun(start, f.noun)} in ${f.place}. Then ${countNoun(more, f.noun)} from ${b} ${f.arrived}. How many ${f.noun} are in ${f.place} now?`,
      answerValue: String(start + more),
      templateId: 'add_within_100_v1',
      params: { a: start, b: more },
      units: f.noun,
      hints: [
        'Is a new ten going to begin here, or not?',
        'Fill the ten first. Then count what is left over on top of it.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE THIRD SHAPE — the ones make ten on the nose
//
// 47 + 3. Nothing at all is left over, so the ones column is emptied and the
// count lands on a whole ten. It is the one page here whose answer ends in a
// zero, and the only page where B10's numbers turn up as an ANSWER.
// ---------------------------------------------------------------------------

const sitOnesFillATen = situation({
  situationType: 'combine',
  cognitiveOp: 'ones-make-exactly-a-ten',
  draw: (r) => {
    const f = frame(r);
    const [start, more] = r.pick(EXACT_ROWS);
    const name = one(r);
    return {
      prompt: `${name} added ${countNoun(more, f.noun)} to ${f.place}, which already held ${countNoun(start, f.noun)}. How many ${f.noun} are in ${f.place}?`,
      answerValue: String(start + more),
      templateId: 'add_within_100_v1',
      params: { a: start, b: more },
      units: f.noun,
      hints: [
        'What is left over once these ones have finished the ten?',
        'Work out the room left, then check what is still in hand.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// ADD, AND THEN COMPARE — the row's own gentle two-step
//
// Two counts, an arrival of loose ones apiece, and a question neither total can
// answer alone. The second move only becomes available once the first has been
// made twice over, which is what lifts the page off a single sum.
//
// Judging two two-digit numbers against each other was B3's work and is spent
// here rather than repeated. What the page wants back is a winner, never a
// margin — nothing measures a gap, no bar model is drawn, and the phrase B15 is
// built around does not occur anywhere in this file.
// ---------------------------------------------------------------------------

const sitWhoEndsAhead = situation({
  situationType: 'comparison',
  cognitiveOp: 'add-then-compare',
  draw: (r) => {
    const f = frame(r);
    const [lowStart, lowMore, highStart, highMore] = r.pick(AHEAD_ROWS);
    const [a, b] = two(r);
    const lowFirst = r.chance(0.5);
    const lowTotal = lowStart + lowMore;
    const highTotal = highStart + highMore;
    const winner = lowTotal > highTotal ? [lowStart, lowMore] : [highStart, highMore];
    const line = (who: string, st: number, m: number) =>
      `${who} had ${countNoun(st, f.noun)} and ${fmtInt(m)} more ${f.arrived}.`;
    const first = lowFirst ? line(a, lowStart, lowMore) : line(a, highStart, highMore);
    const second = lowFirst ? line(b, highStart, highMore) : line(b, lowStart, lowMore);
    // `article()` rather than a hand-written "a": the container name is drawn, so
    // the article that goes in front of it is not this file's to guess (kit §F.6).
    const holder = article(f.place.replace(/^the /, ''));
    return {
      prompt: `${a} and ${b} each keep ${holder} of ${f.noun}. ${first} ${second} Which count ends up bigger? Write it down.`,
      answerValue: String(winner[0] + winner[1]),
      templateId: 'add_within_100_v1',
      params: { a: winner[0], b: winner[1] },
      units: f.noun,
      hints: [
        'Can a count that starts behind end up in front?',
        'Settle both counts on their own before you look at either again.',
      ],
      errorTags: ['task-comprehension', 'concept-misconception'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE SORTING TRAP — which one moves into a new ten
//
// The recipe's own discrimination, and the page the catalog's prediction column
// is built on. Three counts, three arrivals, and exactly one pair that carries
// the count into the next ten.
//
// It cannot be settled by either digit on its own, and that is enforced by the
// table rather than left to the draw: on a third of exposures the crossing pair
// has the biggest ones digit, on a third the biggest arrival, on a third neither,
// and a pair that leads on both is never stored (see `SORT_SHAPES`).
// ---------------------------------------------------------------------------

const discNewTen = discrimination({
  variant: 'structural',
  cognitiveOp: 'will-a-new-ten-begin',
  draw: (r) => {
    const shape = r.int(0, 2);
    const row = r.pick(SORT_SHAPES[shape]);
    const [tK, t1, t2] = r.pick(SORT_TENS);
    const pairs = [
      { count: 10 * tK + row.key[0], more: row.key[1], crosses: true },
      { count: 10 * t1 + row.rest[0][0], more: row.rest[0][1], crosses: false },
      { count: 10 * t2 + row.rest[1][0], more: row.rest[1][1], crosses: false },
    ];
    // PROVED ON EVERY DRAW rather than trusted: one pair moves into a new ten,
    // the other two do not, no count is repeated, and nothing reaches a hundred.
    const crossing = pairs.filter((p) => (p.count % 10) + p.more >= 10);
    if (crossing.length !== 1 || !crossing[0].crosses) {
      throw new Error(`b11 discNewTen: ${crossing.length} of the three pairs move into a new ten`);
    }
    if (new Set(pairs.map((p) => p.count)).size !== 3) {
      throw new Error('b11 discNewTen: two of the three counts are the same number');
    }
    for (const p of pairs) underAHundred(p.count + p.more, 'discNewTen');
    const shown = r.shuffle(pairs);
    const label = (p: { count: number; more: number }) => `${fmtInt(p.count)} and ${fmtInt(p.more)} more`;
    const settling = shown.filter((p) => !p.crosses);
    return {
      prompt: `Three counts each get more loose ones. ${shown.map((p) => `${label(p)}.`).join(' ')} Only one of them ends with a new tens digit. Which one?`,
      correct: label(pairs[0]),
      distractors: [
        {
          text: label(settling[0]),
          errorTag: 'concept-misconception',
          rationale:
            'Reads the arriving amount on its own and calls the biggest one a new ten, without weighing it against the loose ones already sitting there.',
        },
        {
          text: label(settling[1]),
          errorTag: 'representation-misread',
          rationale:
            'Reads the loose ones on their own and calls the fullest count the one that spills, without weighing it against what is arriving.',
        },
      ],
      hints: [
        'How many more will each of these three take before a new ten begins?',
        'Hold each arriving amount against the room left in that count.',
      ],
      errorTags: ['concept-misconception', 'representation-misread', 'task-comprehension'],
    };
  },
});

// ---------------------------------------------------------------------------
// THE NUMERIC TRAP — which count the arrivals really reach
//
// Five named wrong counts, every one of them computed from this draw's own two
// numbers, served two at a time over three pairings so the true count lands
// biggest, smallest and middle in turn (L43 read as the invariant rather than as
// its first instance).
//
// THE PAIRINGS ARE ALSO CHOSEN ON THE LAST DIGIT, which a bridging week has to
// watch: the true count ends in whatever the ones made past ten, and three of
// the five wrong counts end in that same digit while two end in the arriving
// digit. A pairing that mixed those unevenly would leave one option identifiable
// without any arithmetic at all — and in the worst arrangement the ODD ONE OUT
// would be the answer. So every pairing is either all-alike or all-different on
// the last digit, and nothing in between is stored.
//
// WHY THE PIN IS WORTH ANYTHING. `d_verify_binop_v1` is handed the two numbers
// this draw printed and recomputes the count they reach. Because every option is
// a bare numeral, the recomputed value has exactly one thing to be compared with
// — so if the operands were ever shipped the wrong way round, the audit fails
// rather than finding some other digit inside the option to agree with. b08
// found the opposite case: a keyed option holding several numerals turns the
// whole check green for free.
// ---------------------------------------------------------------------------

interface Wrong {
  value: number;
  errorTag: Tag;
  rationale: string;
}

/** Which two of the five go on the page — and so, by construction, where the true count sits among them. */
const TRAP_PAIRINGS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [2, 3],
  [0, 4],
];

const trapBox = pinSlot();

const discWhichCount = withPin(
  trapBox,
  'd_verify_binop_v1',
  discrimination({
    variant: 'structural',
    cognitiveOp: 'which-count-the-ones-reach',
    draw: (r) => {
      const f = frame(r);
      const [start, more] = r.pick(TRAP_ROWS);
      const name = one(r);
      const ones = start % 10;
      const total = start + more;
      trapBox.last = { params: { a: start, b: more, op: '+' }, seed: r.uint() };
      const wrong: readonly Wrong[] = [
        {
          // [0] BELOW — the ten the ones just made never reached the tens.
          value: total - 10,
          errorTag: 'procedure-slip',
          rationale:
            'Writes what the ones had left over and leaves the whole ten they built standing in the ones column, so the tens digit is never told about it.',
        },
        {
          // [1] BELOW — the tens the count already had were dropped on the way.
          value: ones + more,
          errorTag: 'concept-misconception',
          rationale:
            'Works the loose ones out correctly and answers with them alone, as though the whole tens already in the count had stopped being part of it.',
        },
        {
          // [2] ABOVE — filled the ten, then put the whole arrival on again.
          value: total + 10 - ones,
          errorTag: 'procedure-slip',
          rationale:
            'Climbs to the next whole ten first, which uses some of the arrivals up, and then puts the arriving amount on a second time in full.',
        },
        {
          // [3] ABOVE — a ten was heard of, so a ten went on and the ones did not.
          value: total + 10 - more,
          errorTag: 'representation-misread',
          rationale:
            'Hears that a whole ten gets made and puts a whole ten on, so the loose ones that actually arrived are never counted at all.',
        },
        {
          // [4] ABOVE — the ten counted in both columns at once.
          value: total + 10,
          errorTag: 'concept-misconception',
          rationale:
            'Climbs the tens digit for the new ten and then writes the whole ones amount underneath it as well, so one ten is paid for twice.',
        },
      ];
      const [i, j] = r.pick(TRAP_PAIRINGS);
      const offered = [total, wrong[i].value, wrong[j].value];
      // THE PAIRINGS ARE ONLY SAFE BECAUSE OF WHAT COMES NEXT. All three counts
      // are held against each other on every draw. Widen `TRAP_ROWS` later in a
      // way that lets two of them meet, or lets one land on the answer, and the
      // pack stops being generated — rather than reaching a child with two
      // right answers on the same page.
      if (new Set(offered).size !== offered.length) {
        throw new Error(`b11 discWhichCount: ${offered.join(', ')} are not two distinct wrong counts beside one key`);
      }
      if (Math.max(...offered) > 99 || Math.min(...offered) < 1) {
        throw new Error(`b11 discWhichCount: ${offered.join(', ')} leaves the two-digit range this week works in`);
      }
      const lastDigits = new Set(offered.map((v) => v % 10));
      if (lastDigits.size === 2) {
        throw new Error(`b11 discWhichCount: ${offered.join(', ')} leaves one option findable by its last digit alone`);
      }
      return {
        prompt: `${name} counted ${countNoun(start, f.noun)} in ${f.place}. Then ${countNoun(more, f.noun)} ${f.arrived}. Which count does ${f.place} hold now?`,
        correct: String(total),
        distractors: [
          { text: String(wrong[i].value), errorTag: wrong[i].errorTag, rationale: wrong[i].rationale },
          { text: String(wrong[j].value), errorTag: wrong[j].errorTag, rationale: wrong[j].rationale },
        ],
        hints: [
          'How much room is left in the ones before a new ten begins?',
          'Use the arrivals to finish the ten, then put what is left on top.',
        ],
        errorTags: ['procedure-slip', 'concept-misconception', 'representation-misread'],
      };
    },
  }),
);

// ---------------------------------------------------------------------------
// WHERE THE PROBE LIVES — one count, two arrivals, either side of lunch
//
// The ones column is put to the question twice on this page, and it may build a
// ten on the first visit, on the second, on both or on neither. The probe puts
// only the first visit to the child. Which arrival that IS comes down to a coin,
// and the coin moves nothing else: the same three numerals are printed on either
// outcome, so there is no surface for the freshness guard to prefer and no
// suppression it can do (header §8, kit rule 9a).
// ---------------------------------------------------------------------------

const msTwoArrivals = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'ones-arriving-twice',
  draw: (r) => {
    const biggerFirst = r.chance(0.5);
    const f = frame(r);
    const [start, big, small] = r.pick(ARRIVAL_ROWS);
    const early = biggerFirst ? big : small;
    const late = biggerFirst ? small : big;
    return {
      prompt: `${one(r)} counted ${countNoun(start, f.noun)} in ${f.place}. Before lunch ${countNoun(early, f.noun)} ${f.arrived}. After lunch ${countNoun(late, f.noun)} ${f.arrived}. How many ${f.noun} are in ${f.place} now?`,
      initN: start,
      steps: [
        { op: 'add', n: early, d: 1 },
        { op: 'add', n: late, d: 1 },
      ],
      units: f.noun,
      hints: [
        'How many times do loose ones turn up before the question?',
        'Take one arrival at a time and say the running count out loud.',
      ],
      errorTags: ['procedure-slip', 'task-comprehension'],
    };
  },
});

/**
 * Seven words, which is all §E2.9 leaves once the wrapper's own lead-in is
 * counted. What the child is asked to weigh is the first arrival against the
 * room the count has, before a single sum has been done, and the table behind
 * the page makes that judgement genuinely open. Committing to it settles nothing
 * about the rest of the story, so the working still has to happen afterwards —
 * which is the only reason a commitment is worth asking for (L25).
 */
const predictNewTen = withEstimateFirst(msTwoArrivals, 'will a new ten start before lunch?');

// ---------------------------------------------------------------------------
// THE SECOND CHAIN — whole tens first, then loose ones
//
// This is the chain b10 wrote out and then handed over. Quoting its file: "Row
// B10 offers '+tens then +ones' as the gentle two-step; the second half of that
// is B11's page by b03's ruling, and taking it would spend B11's week nine days
// early." So b10 doubled the tens half and left the rest here. Both halves run
// on this page, in the recipe's order, with the whole-ten step carried in as
// settled prior work and only the closing step new.
//
// What the page is really about is the columns taking turns — which is precisely
// the comfort B13 removes when it starts them both at once.
// ---------------------------------------------------------------------------

const msTensThenOnes = multiStep({
  situationType: 'multi-stage',
  cognitiveOp: 'whole-tens-then-loose-ones',
  usesPriorSkill: true,
  draw: (r) => {
    const f = frame(r);
    const [start, tens, ones] = r.pick(TENS_THEN_ONES_ROWS);
    const name = one(r);
    return {
      prompt: `${cap(f.place)} held ${countNoun(start, f.noun)}. ${name} emptied in a bag of ${countNoun(tens, f.noun)}. Then ${countNoun(ones, f.noun)} ${f.arrived}. How many ${f.noun} are in ${f.place}?`,
      initN: start,
      steps: [
        { op: 'add', n: tens, d: 1 },
        { op: 'add', n: ones, d: 1 },
      ],
      units: f.noun,
      hints: [
        'Which of the two arrivals can reach the ones column?',
        'Put the whole tens on first, then join the loose ones to the ones.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, first page — the recipe's own numeral, and how it got onto the page
//
// A child joins the loose ones, gets a number past nine, sets the whole of it
// down where the ones go, and leaves the tens exactly as they found them. That
// is the recipe's 412 for 47 and 5, and it is assembled here from the item's own
// digits rather than typed: the tens the child kept, with the ones total written
// straight after them.
//
// Both halves of the truth come from a registered transform — the tens count the
// real total has, and that same count one short, which is what the child claimed
// by keeping the front digit still. Header §5 records the search that showed the
// three-digit numeral itself cannot be produced by any transform in the library.
//
// The page never says anything went wrong. It sets out a situation, a piece of
// working and a written result, and stops. Naming what happened is the answer
// being asked for, so it cannot also be part of the question (L25).
// ---------------------------------------------------------------------------

const eaOnesWrittenWhole = errorAnalysis({
  verifyTemplateId: 'a_verify_count_slip_v1',
  cognitiveOp: 'error-analysis',
  drawParams: (r) => {
    const [start, more] = r.pick(WORKED_ROWS);
    return { n: Math.floor((start + more) / 10), slip: 'skip-count', start, more };
  },
  build: (v, p, r) => {
    const f = frame(r);
    const start = Number(p.start);
    const more = Number(p.more);
    const name = one(r);
    const onesTotal = (start % 10) + more;
    // THE WRITTEN COUNT IS BUILT, NOT TYPED: the tens the child kept, with the
    // ones total set down beside them exactly as they wrote it.
    const written = `${v.wrong}${onesTotal}`;
    return {
      prompt: `${cap(f.place)} held ${countNoun(start, f.noun)}. Then ${countNoun(more, f.noun)} ${f.arrived}. ${name} joined the loose ones and reached ${fmtInt(onesTotal)}. ${name} kept the ${countNoun(Number(v.wrong), 'whole tens')} and wrote that ${f.place} holds ${written}.`,
      extension:
        'Write how many whole tens the count really holds now. Then write one sentence about the ten the loose ones built.',
      hints: [
        'Where does the ten that the loose ones just built have to go?',
        'Count the whole tens again, and count the new one among them.',
      ],
      errorTags: ['concept-misconception', 'procedure-slip'],
      answerKeywords: [
        String(start + more),
        'the loose ones built a whole ten and it joins the tens',
        'the tens digit climbs by one when the ones fill a ten',
      ],
    };
  },
});

// ---------------------------------------------------------------------------
// Day 5, second page — four sums put into two groups
//
// Three counts, each with loose ones arriving, sorted by whether a new ten
// begins. The three verdicts are COMPUTED at module load and then checked: each
// stays inside ninety-nine, each verdict matches its own arithmetic, and both
// groups are non-empty. The answer is keyword-graded, so an authored slip here
// would be invisible to every gate — the arithmetic is made structural instead.
// ---------------------------------------------------------------------------

const SORT_TASK = [
  [34, 5],
  [46, 7],
  [52, 6],
  [61, 9],
] as const;
const SORT_VERDICTS = SORT_TASK.map(([s, b]) => (s % 10) + b >= 10);
for (const [i, [s, b]] of SORT_TASK.entries()) {
  if (s + b > 99 || s % 10 === 0 || b < 2 || b > 9) {
    throw new Error(`b11 sort task: ${s} and ${b} is not a two-digit count with loose ones arriving`);
  }
  if (SORT_VERDICTS[i] !== (Math.floor((s + b) / 10) > Math.floor(s / 10))) {
    throw new Error(`b11 sort task: ${s} and ${b} is sorted into the wrong group`);
  }
}
// THE TWO GROUPS ARE THE SAME SIZE, checked rather than eyeballed: an odd split
// would let "most of them change" score without anything being sorted at all.
if (SORT_VERDICTS.filter(Boolean).length * 2 !== SORT_VERDICTS.length) {
  throw new Error('b11 sort task: the two groups are not the same size, so the sort can be guessed by weight');
}
const SORT_NEW = SORT_TASK.filter((_, i) => SORT_VERDICTS[i]).map(([s, b]) => `${fmtInt(s)} and ${fmtInt(b)}`);
const SORT_SAME = SORT_TASK.filter((_, i) => !SORT_VERDICTS[i]).map(([s, b]) => `${fmtInt(s)} and ${fmtInt(b)}`);

const reasoningSortTheFour = reasoning({
  prompt: `Sort these four into two groups: the tens digit changes, or it stays. ${SORT_TASK.map(([s, b]) => `${fmtInt(s)} and ${fmtInt(b)}.`).join(' ')} Then write the rule you sorted by.`,
  value: `tens digit changes: ${SORT_NEW.join('; ')} — stays: ${SORT_SAME.join('; ')} — the tens digit changes when the loose ones fill a ten`,
  acceptableForms: [
    ...SORT_TASK.map(([s, b]) => String(s + b)),
    'the tens digit changes when the loose ones fill a ten',
    'it changes when the ones reach ten',
    'compare what arrives with the room left in the ones',
  ],
  keywords: true,
  hints: [
    'How much room does each count have left in its ones?',
    'Work out the room left first, then hold each arrival against it.',
  ],
  errorTags: ['concept-misconception', 'task-comprehension'],
});

/**
 * The one claim this week rests on, put to the child as an open question.
 *
 * Both of the other two options are places a real child stands. "Always" is
 * where you land if the spilling pages are the ones you remember, because in
 * that memory the front digit moves every single time. "Never" is where you land
 * if you have taken "ones belong in the ones column" at its word — and that is
 * the very reading that produces the three-digit answer on the page before this.
 */
const asnTensDigitMoves = classify({
  prompt:
    'Always, sometimes or never true? Adding loose ones to a two-digit count changes its tens digit. Write a sentence that would convince somebody else.',
  correct: 'sometimes',
  distractors: [
    {
      text: 'always',
      errorTag: 'concept-misconception',
      rationale:
        'Expects every arrival to reach the tens, which is what a child sees who has met the spilling pages and not the settling ones.',
    },
    {
      text: 'never',
      errorTag: 'representation-misread',
      rationale:
        'Holds that loose ones can only ever touch the ones column, so the whole ten they sometimes build has nowhere to go.',
    },
  ],
  hints: [
    'What happens on a count with plenty of room left in its ones?',
    'Compare what arrives with the room left, and watch the front digit.',
  ],
  errorTags: ['concept-misconception', 'representation-misread'],
});

// ---------------------------------------------------------------------------
// The week
// ---------------------------------------------------------------------------

export const buildB11 = makeWeekBuilder({
  level: 'B',
  week: 11,
  conceptId: 'two-digit-plus-one-digit',
  conceptName: 'Two-digit + one-digit',
  strandTags: ['addition-subtraction'],
  prerequisiteWeeks: [A23, B2, B5, B10],
  pedagogyContract: 'v2',
  conceptualAnchor: 'ones meet ones',
  conceptFamily: 'operation',
  deepeningDelta:
    'B5 built a ten out of two small numbers and read the answer as ten and some more, and the ten it built was the only ten there was. B10 then moved whole tens about and never let a ones digit change at all. B11 is where the two columns are finally in the same sentence: loose ones meet loose ones, and what they build has to be handed upward into a tens column that already has something in it. That is the new demand. In B5 the child who fills the frame is finished, because the frame IS the answer; here filling the ten only settles the ones, and the count still has to be named — which means saying WHICH ten was reached, not just that a ten was. So the same bridge is walked over a count that already holds three or four tens, the answer is a two-digit number rather than a teen, and for the first time the front digit is allowed to move as a consequence of something that happened in the back one. B13 takes it from here by giving the second column something of its own to add.',
  explanation: {
    hook: 'Ones can only meet ones. When enough of them meet, they build a ten.',
    whyBeforeHow:
      'Eight and six is easy for a child who then stalls on thirty-eight and six. It is worth being clear about what has actually changed here. The adding is not what changed. The arriving six has nowhere to go except the ones column. So the only question is whether the ones column can hold it. That is why these pages say ones meet ones before they say anything else. The tens standing in front are not part of the sum at all. They are simply already there. Now look at the ones. Thirty-eight has eight loose ones and room for two more before the row is full. Six arrive. Two of them finish the ten and four are left over. So the count has one more whole ten than it had. It also has four loose ones on top of it. Forty-four. Nothing was carried, borrowed or written in a column. A ten was built out of loose ones and put where whole tens live. And that is the whole difference between the two shapes this week draws. When the arrivals fit in the room that was left, the front digit never stirs. The answer is finished in the ones. When they do not fit, a new ten begins. The front digit climbs by exactly one, and never by two. Nine loose ones and nine more cannot build two tens between them. So a child can check any answer here before they even trust it. Count the room and decide whether a new ten begins. Then see whether the answer they wrote agrees.',
    script: [
      {
        say: 'Here is 38. Look only at the loose ones. Eight of them, and two boxes bare.',
        visual: 'A row of ten holding eight counters, with two boxes still bare.',
        figure: onesFrame(8, 'a row of ten holding eight counters, with two boxes left bare'),
      },
      {
        say: 'Six more are coming. Two of them will finish the row. Watch what happens next.',
      },
      {
        say: 'The row is full, so it becomes one whole ten. Four ones are left standing outside it.',
      },
      {
        say: 'Three tens and one more ten is four tens. Four tens and four loose ones. Forty-four.',
      },
      {
        say: 'I check the bare boxes first. Then I know if a new ten is near.',
      },
    ],
    summary:
      'Loose ones meet loose ones. Fill the row and one whole ten joins the tens. The rest stay loose.',
    vocabulary: [
      { term: 'loose ones', kidGloss: 'the single ones a count has on top of its whole tens' },
      { term: 'a new ten', kidGloss: 'the whole ten that gets built when the loose ones fill a row of ten' },
      { term: 'room left', kidGloss: 'how many more loose ones will fit before the row of ten is full' },
    ],
  },
  guidedExamples: [
    {
      ...ge(11, 1, 'modeled', 'The pin pot held 38 drawing pins. Then 6 more were tipped in. How many now?', [
        {
          teacherSay:
            'Watch me. I am not adding thirty-eight and six. I am looking at eight loose ones and two bare boxes.',
        },
        {
          teacherSay: 'Two of the six will finish that row. So how many of them are left over?',
          expected: 'four',
        },
        {
          teacherSay: 'The full row is one whole ten. Three tens and that one is four tens, and four are loose.',
        },
      ], '44'),
      // The only working page in the pack that carries a picture, and it can,
      // because the total is written underneath it. What the row of ten shows is
      // the room available; what the example is about is where the count gets to
      // (kit §E2.5).
      visual: 'A row of ten holding eight counters, with two boxes still bare.',
      figure: onesFrame(8, 'a row of ten holding eight counters, with two boxes left bare'),
    },
    {
      ...ge(11, 2, 'completion', 'The band jar held 45 elastic bands. Then 3 more were dropped in. How many now?', [
        { teacherSay: 'How much room is left in the ones of this count?', expected: 'five' },
        { childDo: 'Three will fit in that room, so nothing is left over. Say the count.', expected: '48' },
      ], '48'),
      // No picture. A frame holding five with five bare boxes beside an arrival
      // of three answers the question the page is asking (header §6).
      visual: 'Nothing drawn — the bare boxes would settle this one without the child.',
    },
    {
      ...ge(11, 3, 'prompted', 'The seed tub held 47 pumpkin seeds. Then 3 more were shaken in. How many now?', [
        { childDo: 'Work out the room left before you decide what is left over.', expected: '50' },
      ], '50'),
      visual: 'No picture — this one lands on a whole ten and a drawing would show it landing.',
    },
    {
      ...ge(11, 4, 'independent', 'The desk tray held 56 bulldog clips. A bag of 20 went in, then 7 more. How many?', [
        { childDo: 'Put the whole tens on first, then let the loose ones meet the loose ones.', expected: '83' },
      ], '83'),
      visual: 'No picture — this one is held in the head from the bag to the last loose one.',
    },
  ],
  days: [
    // Day 1 — concept echo: the room left, the tens a count holds, then the two
    // shapes side by side and the comparison that needs both of them worked out.
    [
      { gen: wPartnerOfTen, diff: 2 },
      { gen: wWholeTensIn, diff: 2 },
      { gen: sitOnesSettle, diff: 2 },
      { gen: sitOnesSpill, diff: 3 },
      { gen: sitWhoEndsAhead, diff: 3 },
    ],
    // Day 2 — the classification opens, the two-arrival story demands a verdict
    // with nothing worked out yet, and the day shuts on the shape where the ones
    // column is emptied outright.
    [
      { gen: wTenAndSome, diff: 2 },
      { gen: sitOnesSpill, diff: 3 },
      { gen: discNewTen, diff: 3 },
      { gen: predictNewTen, diff: 4 },
      { gen: sitOnesFillATen, diff: 3 },
    ],
    // Day 3 — the heaviest day. Both classifications land in one sitting, the
    // borrowed whole-ten move gets a new second step, and a settling page is
    // dropped in among them so nothing about a page's look tells the child what
    // kind of answer it wants.
    [
      { gen: wWholeTensOn, diff: 2 },
      { gen: sitOnesSettle, diff: 3 },
      { gen: discNewTen, diff: 4 },
      { gen: discWhichCount, diff: 4 },
      { gen: msTensThenOnes, diff: 4 },
    ],
    // Day 4 — the two chains put to work beside the numeric choice and the
    // comparison. Four pages, four different demands, and hardly a sentence
    // between them to tell one from another.
    [
      { gen: wPartnerOfTen, diff: 2 },
      { gen: msTensThenOnes, diff: 4 },
      { gen: predictNewTen, diff: 4 },
      { gen: discWhichCount, diff: 3 },
      { gen: sitWhoEndsAhead, diff: 3 },
    ],
    // Day 5 — one child's working pulled apart, four sums put into groups, and
    // the week's claim handed over to be defended.
    [
      { gen: wWholeTensIn, diff: 2 },
      { gen: eaOnesWrittenWhole, diff: 4 },
      { gen: reasoningSortTheFour, diff: 3 },
      { gen: asnTensDigitMoves, diff: 3 },
    ],
  ],
  teacherNoteStrips: [
    undefined,
    undefined,
    undefined,
    undefined,
    'For grown-ups: the question worth asking all week is "how much room is left?", and it works on anything you can line up ten of. Put out a row of ten egg cups with seven buttons in it, hand over five more buttons, and ask it before anybody starts adding. Three finish the row and two are left over — that is the whole week in your hands. If an answer comes back that is ten too small, do not correct the number. Ask where the full row went; nine times out of ten the child built the ten perfectly and then left it sitting in the ones instead of counting it with the tens. And if you see a three-digit answer to something like 47 and 5, that is the same thing wearing a different coat: they worked the ones out correctly, got twelve, and wrote the twelve down whole. Ask them how many whole tens their answer has, and then how many the pot really has. A row of ten of anything is all the equipment any of this needs.',
  ],
  puzzle: (r) => {
    // WORK BACK FROM THE LAST DIGIT — which nothing in the daily core does.
    //
    // What is withheld here is the arrival, and what is given instead is a single
    // fact about the finish: the digit it ends on. The tens are never mentioned
    // and never needed. Loose ones walk the last digit round a ring of ten, and
    // for any two digits on that ring there is exactly ONE amount under ten that
    // gets from the first to the second — so the answer is settled by a
    // uniqueness argument, not by adding anything.
    //
    // Nothing is drawn. A row of ten on the page would let the amount be counted
    // off the bare boxes instead of reasoned out.
    // HALF THE ROWS SPILL AND HALF DO NOT, because a page where the last digit
    // always fell backwards would be answerable by one subtraction learnt once.
    const [ones, more] = r.pick(PUZZLE_DIGITS);
    const start = 10 * r.int(2, 8) + ones;
    const landing = (ones + more) % 10;
    // THE UNIQUENESS IS CHECKED, NOT ASSERTED. Every amount from one to nine is
    // tried against the two digits, and the puzzle refuses to ship unless
    // precisely one of them works and it is the one drawn.
    const solutions: number[] = [];
    for (let k = 1; k <= 9; k++) if ((ones + k) % 10 === landing) solutions.push(k);
    if (solutions.length !== 1 || solutions[0] !== more) {
      throw new Error(`b11 puzzle: ${solutions.length} amounts take a count ending in ${ones} to one ending in ${landing}`);
    }
    if (landing === ones) {
      throw new Error(`b11 puzzle: the last digit did not move, so there is nothing to deduce`);
    }
    underAHundred(start + more, 'puzzle');
    return {
      id: 'B11-PZ-01',
      title: 'Puzzle Grove: The Digit That Moved',
      puzzleType: 'logic',
      prompt: `A count ends in ${fmtInt(ones)}. Fewer than ten loose ones are added to it. Afterwards the count ends in ${fmtInt(landing)}. How many loose ones were added?`,
      answer: {
        value: String(more),
        acceptableForms: [],
        validation: 'exact-numeric',
      },
      hintLadder: [
        'Which digit of a count can loose ones ever reach?',
        'Count on from that last digit and watch where it goes past ten.',
      ],
      errorTags: ['concept-misconception', 'task-comprehension'],
    };
  },
  // Daily pages hand over a count and an arrival and want the finish. This one
  // hands over two last digits and wants the arrival — a question the ring of ten
  // answers and no forward sum does.
  puzzleMeta: { stepCount: 2, cognitiveOp: 'name-the-arrival-from-the-last-digit' },
  // A sprint has to drill something already settled two weeks back, and picking
  // WHICH is the decision worth defending. Not the bridge: B5 owns that move and
  // these pages are still building it out. The thing underneath it — the small
  // sums that land exactly on ten. `sumMax: 10` follows from the content rather
  // than from taste, because a row holds ten, and going past ten is the next
  // week's arithmetic rather than this one's.
  sprint: {
    skill: 'Sums that finish a ten — the fact every new ten is built on',
    sourceWeek: B5,
    itemCount: 16,
    scheduledDay: 2,
    templateId: 'add_within_10_facts_v1',
    params: { min: 3, max: 9, sumMax: 10 },
  },
  mastery: [
    { gen: sitOnesSettle, diff: 3 },
    { gen: sitOnesSpill, diff: 3 },
    { gen: sitOnesFillATen, diff: 3 },
    { gen: sitWhoEndsAhead, diff: 3 },
    { gen: discWhichCount, diff: 3 },
    { gen: msTensThenOnes, diff: 4 },
  ],
  isomorphNotes:
    'Pairs by index; same generator and difficulty per slot, fresh operands off a separate stream. 01: an arrival the ones column absorbs, with both the count and the arrival redrawn. 02: an arrival that builds a new ten, fresh in both numbers. 03: an arrival that makes a ten exactly, so the count lands on a whole ten and the ones empty. 04: two counts and two arrivals compared, with the upset and the straight row redrawn so a form cannot be passed by remembering which one won last time. 05: the numeric trap, with the pair of wrong counts rotated so the key does not sit at the same rank on both forms. 06: the whole-tens-then-loose-ones chain, fresh in all three numbers. Three generators are deliberately ABSENT from both forms: the two-arrival story, which is served only through its estimate-first wrapper and so lends the child the judgement a certificate exists to measure; the sorting trap, which is a classification rather than a count and is measured instead by the numeric trap beside it; and the Day-5 pages, which want a written argument rather than a key. No operand surface is reused from Form A or from the daily pages.',
  mistakeBank: [
    {
      errorTag: 'concept-misconception',
      subtype: 'ones-total-written-whole',
      description:
        'Joins the loose ones correctly, gets a number past ten, and writes the whole of it into the ones place beside the tens that were already there — so 47 with 5 more is set down as 412. The ones arithmetic is perfect; what is missing is that a count past nine cannot stand in one column.',
      exampleWrongAnswer: '412 written as the count when 5 loose ones went on a count of 47',
      distractorRationale:
        'Never offered as an option, because it is the only wrong count in the family with three digits and a page carrying it can be played by striking out the long number unread. It is shown instead on Day 5, where the child has to say how many whole tens the answer really claims.',
      reteachPointer: 'explanation/script[2] (the row is full, so it becomes one whole ten)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'the-new-ten-left-in-the-ones',
      description:
        'Builds the ten out of the loose ones, writes down what was left over, and leaves the ten itself standing where it was made, so the answer is a whole ten short. It is the same slip as the one above with the writing tidied up, and it is much harder to see.',
      exampleWrongAnswer: '34 given as the count when 6 loose ones went on a count of 38',
      distractorRationale:
        'Offered as the lower of two rival counts on the numeric trap, where every option is a two-digit count built from the same two numbers, so it cannot be struck out for looking wrong.',
      reteachPointer: 'explanation/script[3] (three tens and one more ten is four tens)',
    },
    {
      errorTag: 'procedure-slip',
      subtype: 'the-arrival-spent-twice',
      description:
        'Climbs to the next whole ten first, which quietly spends some of the arriving ones, and then puts the arriving amount on again in full. The strategy is right and the accounting is not: what goes on after the ten is what is LEFT of the arrival.',
      exampleWrongAnswer: '46 given as the count when 6 loose ones went on a count of 38',
      distractorRationale:
        'Offered as the higher of two rival counts, close enough to the true count that telling them apart needs the leftover counted rather than the answer eyeballed.',
      reteachPointer: 'guidedExamples/B11-GE-01 (two of the six will finish that row)',
    },
    {
      errorTag: 'representation-misread',
      subtype: 'a-ten-heard-of-is-a-ten-added',
      description:
        'Hears that a new ten gets built, puts a whole ten on the count, and never adds the loose ones that actually arrived. The word "ten" has been taken as the size of the arrival rather than as something the arrival made.',
      exampleWrongAnswer: '48 given as the count when 6 loose ones went on a count of 38',
      distractorRationale:
        'Offered beside the arrival-spent-twice count so that both above-the-key options are honest, which is what keeps "the answer is the smallest" from paying on that pairing.',
      reteachPointer: 'explanation/whyBeforeHow (a ten was built out of loose ones)',
    },
    {
      errorTag: 'concept-misconception',
      subtype: 'the-tens-already-there-dropped',
      description:
        'Works the ones column out on its own and answers with it, as though the whole tens the count already held had stopped being part of the count while the ones were being dealt with.',
      exampleWrongAnswer: '14 given as the count when 6 loose ones went on a count of 38',
      distractorRationale:
        'Offered as the second of the two below-the-key counts, where it is far enough under the answer that a child who checks the size of their answer catches it — which is the check this week wants built.',
      reteachPointer: 'explanation/hook (ones can only meet ones)',
    },
    {
      errorTag: 'task-comprehension',
      subtype: 'every-page-read-as-a-spilling-page',
      description:
        'Learns that this is the week where a new ten begins and starts one on every page, including the counts with plenty of room left in their ones. The reasoning is sound and it is being applied without the check that decides whether it applies at all.',
      exampleWrongAnswer: 'a new tens digit claimed for a count of 45 when 3 loose ones went on',
      distractorRationale:
        'It needs no distractor of its own and would make a dishonest one, since the two shapes sit on the same day in the same words. It is met by the sorting trap, where three counts are on the page and only one of them spills.',
      reteachPointer: 'explanation/summary (if they fill the row, one whole ten joins the tens)',
    },
    {
      errorTag: 'fact-recall',
      subtype: 'room-left-recounted-every-time',
      description:
        'Rebuilds the partner of ten from scratch on every page — counting the bare boxes one at a time before the arrival can even be weighed against them. That is honest arithmetic and slow arithmetic, and the deciding these pages are really about gets whatever attention is left.',
      exampleWrongAnswer: 'the room left in a count of 38 counted out on fingers on every page of the week',
      distractorRationale:
        'There is no honest distractor for being right slowly, so this one is answered by the Day-2 sprint and the partner-of-ten warm-up rather than by a page of its own.',
      reteachPointer: 'explanation/script[0] (eight of them, and two boxes bare)',
    },
  ],
  parentSummarySeed: {
    whatWeWorkedOn:
      'Adding a few loose ones to a two-digit count — 45 and 3, and 38 and 6 — by looking at the room left in the ones before adding anything. The sums stayed small on purpose. The work this week was in deciding whether a new ten was about to begin, and in knowing where that ten goes once it does.',
    improvingCandidates: [
      'working out how much room is left in the ones before adding',
      'counting the new ten in with the tens instead of leaving it behind',
      'saying which ten the count has reached, not only that it reached one',
    ],
    strengtheningByTag: [
      {
        errorTag: 'concept-misconception',
        text: 'seeing that ten loose ones become one whole ten, and that the whole ten belongs with the tens',
      },
      {
        errorTag: 'procedure-slip',
        text: 'spending each arriving one exactly once — some to finish the ten, the rest on top of it',
      },
      {
        errorTag: 'task-comprehension',
        text: 'checking whether a new ten is coming at all before reaching for the strategy that handles one',
      },
      {
        errorTag: 'fact-recall',
        text: 'having the partners of ten arrive without effort, which is what the Day-2 sprint is for',
      },
    ],
    homeFocus: {
      praiseLine:
        'You counted the room left in the ones first, so you knew a new ten was coming before you worked anything out.',
      questionForChild: 'How much room was left, and did a new ten begin?',
      schoolSyncHook:
        'School may call this bridging through ten, making ten, or regrouping, and may talk about carrying where we talk about a new ten joining the tens. The idea underneath is the same, so use whichever words come home.',
    },
    vocabularyForParent: [
      'loose ones (the single ones a count has on top of its whole tens)',
      'room left (how many more will fit before a row of ten is full)',
      'a new ten (the whole ten built when the loose ones fill the row, which then joins the tens)',
    ],
  },
});
