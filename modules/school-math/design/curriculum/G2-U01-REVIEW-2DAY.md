# G2-U01 REVIEW — Numbers to 1,000 in two days (first learner)

**Written 2026-11-18 (from `date`) by the teacher-run reviewer (a Grade 2 teacher persona), at
the parent's request.** Two days, not more. Day 1: 8 questions. Day 2: 10 questions, the last
three a mini check in the school's A / B / C sections with feedback held. No child's name. Every
number is original: none of the test's values (EXAM-READING.md, "Exam values for the no-exam-items
gate", choices included, and his written answers in the reading table; this review is a tier-2
surface of EXAM-COVERAGE §4) and none of the G2-U01 lesson rows' worked-example values
(GRADE-2.md §3 G2-U01). The only shared values are the step sizes 10 and 100, which the
standard itself names (2.NBT.B.8 "mentally add 10 or 100"); they are never a key, a choice or a
number to be found. One-digit counts (5 flats, 8 cubes) are exempt as everywhere in the module.
Verified by `teacher_check.py` (output in `testing/TEACHER-RUN-2026-11-18.md`).

**How to read an item.** Lines in «guillemets» are read aloud, word for word (DD17: read aloud
on by default; every sentence at most 10 words, inside the brief's 12). The spoken line never
says an asked value (METHODOLOGY §6.3). Choices are listed **ascending, for reading only**; the
app serves them shuffled (METHODOLOGY §7). "Checked" says what code compares. A blank is "not
yet" (TAD §3.19). On Day 1 and on Day 2 Q1–Q7 a miss gets the normal practice-day reply: what
is right, where to look, one more try (TAD §3.10). Q8–Q10 of Day 2 hold all feedback until the
end, then review (DD11).

**What the five lessons are, and where each comes back.**

| U01 lesson (skill) | Common Core | Day 1 | Day 2 |
|---|---|---|---|
| L1 count on and back by 1s, 10s, 100s; number patterns | 2.NBT.A.2 | Q5 | Q3 |
| L2 place value of each digit, including a zero; 100 as ten tens | 2.NBT.A.1 | Q1, Q3, Q8 | Q1, Q6, Q9 |
| L3 read and write numbers: numerals, words, expanded form | 2.NBT.A.3 | Q2, Q3 | Q2, Q7, Q9 |
| L4 compare and order | 2.NBT.A.4 | Q4 | Q4, Q10 |
| L5 10 more, 10 less, 100 more, 100 less, in the head | 2.NBT.B.8 | Q6, Q7 | Q5, Q8 |

Formats (school catalogue, R3 §8): multiple choice T1 / T2 / T3; short answer T8; "show your
work" T9-style (a built chart and a filled bond are the shown work at this unit); constructed
response T17 with T24 (place-value chart). Blocks or chart: Day 1 Q1, Q3, Q8; Day 2 Q6, Q9, Q10.
Open number line: Day 1 Q5; Day 2 Q3. One explain item a day (DD16): Day 1 Q7; Day 2 Q10.

**Lessons added after this review (R5 apply, 2026-11-18).** G2-U01 now has seven lessons: L2 and
L3 were widened ("how many tens in a number"; parts in any order) and L6 (split a number more than
one way) and L7 (the number line to 1,000) were added (GRADE-2.md §3). This review samples the
five lessons above and is unchanged; L6 and L7 run afterwards as short lessons (L7 before U02 L7,
L6 before U04 L3; GRADE-2 §0.1). Their example numbers were checked not to repeat any number of
this review (`testing/r5_check_2026-11-18.py`), so no answer carries over between them.

---

## Day 1 — 8 questions ("Question k of 8" on every screen)

### D1-Q1 · Multiple choice from a picture (T2) · 2.NBT.A.1
- **Read aloud:** «Look at the blocks on the chart. What number do they show?»
- **On screen:** a place-value chart (hundreds · tens · ones) with 5 flats in the hundreds
  column, nothing in the tens column, 8 cubes in the ones column (N-F9, picture kind: blocks on a
  chart). No digits under the columns. Four choice buttons.
- **Answer:** 508.
- **Checked:** the tapped choice against 508, by code.
- **Common wrong answer:** 58 ← "write the digits you see": the empty tens column gets no 0.
- **Choices (one draw):** 58 · **508** · 580 · 5008.
  58 ← the empty place dropped · 580 ← the empty place written last ("the zero goes at the end")
  · 5008 ← written the way it sounds: 500, then 8. Key rank: 2nd of 4.

### D1-Q2 · Short answer (T8) · 2.NBT.A.3
- **Read aloud:** «Write this number with digits. Nine hundred thirty.»
- **On screen:** the words "nine hundred thirty" printed; a number pad with one answer line (no
  fixed digit boxes, so the box count gives nothing away). Shape hint: "e.g. 25".
- **Answer:** 930.
- **Checked:** the typed number against 930, by code.
- **Common wrong answer:** 90030 ← each part written as it is heard: 900, then 30. Also 93 ← the
  zero dropped ("a zero is nothing"); 913 ← "thirty" heard as "thirteen" (flag as a hearing or
  reading slip, not place value).

### D1-Q3 · Show your work: build, then the bond (T9-style with T24) · 2.NBT.A.1, 2.NBT.A.3
- **Read aloud:** «Build 904 on the chart. Then fill the three parts of the bond.»
- **On screen:** step 1, an empty place-value chart (N-I3); step 2, after the chart is committed,
  a number bond with the whole 904 and three empty part circles under the headings hundreds,
  tens, ones (N-I2, three-part form: METHODOLOGY §6.1–6.2, N-F1 / N-I2).
- **Answer:** chart 9 flats, 0 rods, 4 cubes; bond 900 + 0 + 4.
- **Checked:** the chart state (9, 0, 4) and each part (900, 0, 4), by code. A 0 in the tens
  circle is required; an empty tens circle is "not yet", not wrong.
- **Common wrong answer:** 9 flats and 4 rods, bond 900 + 40 ← "skip the zero; the next digit
  takes the next place" (that would be 940). Also 9 + 0 + 4 ← each digit written as its face
  value.

### D1-Q4 · Multiple choice "which is false" (T3) · 2.NBT.A.4
- **Read aloud:** «Three of these are true. Which one is false?» Each card is read when tapped,
  e.g. «438 is greater than 501.»
- **On screen:** four cards, each a comparison with its symbol and the words "is greater than" /
  "is less than" under the symbol.
- **Answer:** 438 > 501 (false: 4 hundreds is less than 5 hundreds).
- **Checked:** the tapped card against the one false statement, by code (each card's truth
  computed).
- **Common wrong answer:** any true card ← "compare the ones first": 627 < 672 looks false (7 > 2),
  950 > 905 looks false (0 < 5), 289 < 316 looks false (9 > 6, and 8 > 1 in the tens); under the
  same rule the false card 438 > 501 looks true (8 > 1).
- **Choices:** 438 > 501 (key) · 627 < 672 · 950 > 905 · 289 < 316. Statements have no numeric
  rank; the key's displayed place rotates (METHODOLOGY §7).

### D1-Q5 · Open number line, count on by tens (T22 pattern; N-I6) · 2.NBT.A.2
- **Read aloud:** «Count on by tens. Type where each jump lands.»
- **On screen:** an open number line (N-F3). The start 372 and one jump arc "+10" to 382 are
  drawn as the pattern. Three more "+10" chips; each landing is blank until he types it, and a
  jump is drawn only after its landing is typed and confirmed (N-I6).
- **Answer:** 392, 402, 412.
- **Checked:** each typed landing against the computed one, by code.
- **Common wrong answer:** 302 at the second landing ← "the hundreds digit does not change":
  9 tens and 1 ten make 10 tens, he writes 0 and keeps the 3. Also 3102 ← ten tens written as
  "10" in the tens place. If 302 is typed, the next landing usually shows the rule again (312).

### D1-Q6 · Multiple choice (T1) · 2.NBT.B.8
- **Read aloud:** «What is 100 less than 529?»
- **On screen:** the question in digits; four choice buttons.
- **Answer:** 429.
- **Checked:** the tapped choice against 429, by code.
- **Common wrong answer:** 519 ← took away a ten, not a hundred.
- **Choices (one draw):** **429** · 519 · 528 · 629.
  519 ← took away ten · 528 ← took away one · 629 ← added a hundred ("less" heard as "more").
  Key rank: smallest.

### D1-Q7 · Short answer, in the head, then one explain (T5-style, T8; N-I9; N-I10) · 2.NBT.B.8
- **Read aloud:** «What is 10 more than 296? Do it in your head.» After the answer: «Which way
  did you do it?» Then: «Tap true or false for each sentence.»
- **On screen:** step 1, the question and the pad (answer typed first, no column offered);
  step 2, strategy chips (jump of ten · I pictured a column · I counted on) — recorded, never
  scored (L41); step 3, after the answer is committed, six rows, each with True / False.
- **Answer:** 306. Rows true: «9 tens and 1 more ten make 10 tens.» «10 tens make 1 hundred.»
  «So 2 hundreds become 3 hundreds.» Rows false: «Only the tens digit changes.» «The hundreds
  never change when you add 10.» «The answer is 206.»
- **Checked:** the typed answer against 306 and each row against its computed truth, by code
  (3 true / 3 false, shuffled; L51). The chip is recorded for the parent.
- **Common wrong answer:** 206 ← "add one to the tens digit and stop": 9 + 1 = 10, he writes 0
  and the new hundred is lost. Also 2106 ← ten tens written as "10"; 297 ← added one.

### D1-Q8 · Constructed response with the chart (T17 with T24) · 2.NBT.A.1
- **Read aloud:** «A shop has 3 boxes of 100 pens.» «It also has 12 packs of 10 pens.» «How
  many pens does the shop have?» «Show it on the chart.»
- **On screen:** a picture of 3 boxes, each labelled "100", and 12 packs, each labelled "10"
  (picture kind: boxes and packs; no loose pens to count). An empty place-value chart (N-I3) with
  a "group ten" button; then the pad.
- **Answer:** 420 (3 flats and 12 rods; ten rods grouped into a flat → 4 flats, 2 rods).
- **Checked:** the chart's final state (4, 2, 0) and the typed number 420, by code. A chart
  left at 3 flats and 12 rods is "almost": the app says "Is any column too full?" once.
- **Common wrong answer:** 312 ← "write the numbers you see": 3, then 12 (no trade). Also 3120 ←
  3, 12 and 0 written side by side.

---

## Day 2 — 10 questions ("Question k of 10" on every screen)

### D2-Q1 · Multiple choice (T1) · 2.NBT.A.1
- **Read aloud:** «In 217, what does the 2 stand for?»
- **On screen:** 217 large, the 2 not highlighted; four choice buttons.
- **Answer:** 200.
- **Checked:** the tapped choice against 200, by code.
- **Common wrong answer:** 2 ← the digit alone (face value).
- **Choices (one draw):** 2 · 20 · **200** · 217.
  2 ← face value · 20 ← the wrong place named (tens) · 217 ← the whole number. Key rank: 3rd of 4.

### D2-Q2 · Short answer, expanded form out of order (T8) · 2.NBT.A.3
- **Read aloud:** «What number is 3 plus 40 plus 900?»
- **On screen:** "3 + 40 + 900 = ☐" printed; the pad. Shape hint: "e.g. 25".
- **Answer:** 943.
- **Checked:** the typed number against 943, by code.
- **Common wrong answer:** 349 ← the digits written in the order they are read. Also 900403 ←
  each part written whole, side by side.

### D2-Q3 · Open number line, count on by ones (U01 L1 skill on N-I6) · 2.NBT.A.2
- **Read aloud:** «Count on by ones. Type where each jump lands.»
- **On screen:** an open number line with the start 897 and four "+1" chips; landings blank
  until typed (N-I6).
- **Answer:** 898, 899, 900, 901.
- **Checked:** each typed landing, by code.
- **Common wrong answer:** 8100 at the third landing ← ten tens written as "10" after the 8. Also
  890 ← the ones go back to 0 and the tens stay.

### D2-Q4 · Short answer, order (T8; tap-to-order tiles) · 2.NBT.A.4
- **Read aloud:** «Put these numbers in order. Start with the least.»
- **On screen:** three tiles 683, 836, 368 (shuffled per draw) and three slots marked "least"
  … "greatest". He taps a tile, then a slot (touch and keyboard).
- **Answer:** 368, 683, 836.
- **Checked:** the order against the computed order, by code.
- **Common wrong answer:** 683, 836, 368 ← ordered by the ones digit (3, 6, 8). Also 836, 683,
  368 ← greatest first ("least" not held: a reading flag, DD17). The numbers were chosen so these
  two rules give different orders.

### D2-Q5 · Multiple choice (T1) · 2.NBT.B.8
- **Read aloud:** «What is 100 more than 856?»
- **On screen:** the question; four choice buttons.
- **Answer:** 956.
- **Checked:** the tapped choice against 956, by code.
- **Common wrong answer:** 866 ← added ten, not a hundred.
- **Choices (one draw):** 756 · 857 · 866 · **956**.
  756 ← took away a hundred ("more" heard as "less") · 857 ← added one · 866 ← added ten. Key
  rank: largest.

### D2-Q6 · Show your work on the chart: a hundred as ten tens (T24; N-I3) · 2.NBT.A.1a
- **Read aloud:** «Build 350 on the chart.» «Now open each hundred into tens.» «How many
  tens is that?»
- **On screen:** an empty chart (N-I3) with an "open a hundred" button (one flat becomes ten
  rods, the reverse of "group ten"); after both steps are committed, the pad.
- **Answer:** chart 3 flats, 5 rods → 0 flats, 35 rods; typed 35.
- **Checked:** both chart states and the typed 35, by code.
- **Common wrong answer:** 5 ← counted only the rods that were in the tens column at the start.
  Also 350 ← named the number, not the tens; 8 ← counted the pieces (3 + 5).

### D2-Q7 · Multiple choice, number words (T1) · 2.NBT.A.3
- **Read aloud:** «Look at the number. Tap the words that name it.» (The number is shown, never
  spoken. Each card's words are read when he taps it.)
- **On screen:** 418 in digits; four word cards.
- **Answer:** four hundred eighteen.
- **Checked:** the tapped card against the key, by code.
- **Common wrong answer:** four hundred eighty ← "-teen" and "-ty" sound alike (18 heard as 80).
- **Choices:** four hundred eighteen (key) · four hundred eighty · four hundred eight ← the ten
  dropped · forty-one eight ← the digits read in pairs, no hundreds. Words have no numeric rank;
  the display place rotates.

### Mini check — Day 2 Q8 to Q10 (7 points; feedback held; review after; DD11)
The screen says «Now three check questions. I will tell you after.» (two sentences, 5 and 4
words). Read aloud as always. No hint ladder during the check; the score never changes in
review; every miss returns at 2 / 7 / 21 days with new numbers (DD10).

#### D2-Q8 · Section A · multiple choice (2 points) · 2.NBT.B.8
- **Read aloud:** «What is 10 less than 603?»
- **On screen:** the question; four choice buttons.
- **Answer:** 593.
- **Checked:** the tapped choice against 593, by code. 2 points or 0.
- **Common wrong answer:** 693 ← "the hundreds digit does not change": 0 tens take 1 ten, he
  writes 9 and keeps the 6.
- **Choices (one draw):** 503 · **593** · 613 · 693.
  503 ← took away a hundred · 613 ← added ten · 693 ← the hundred not opened. Key rank: 2nd of 4.

#### D2-Q9 · Section B · show your work (2 points) · 2.NBT.A.1, 2.NBT.A.3
- **Read aloud:** «Build 390 on the chart. Then fill the three parts of the bond.»
- **On screen:** as Day 1 Q3 (chart, then a three-part bond with the whole 390).
- **Answer:** chart 3 flats, 9 rods, 0 cubes; bond 300 + 90 + 0.
- **Checked:** 1 point the chart (3, 9, 0); 1 point the bond (300, 90, 0), by code.
- **Common wrong answer:** 3 flats and 9 cubes, bond 300 + 0 + 9 ← "the last digit I see is the
  ones" (that is 309; the zero and the 9 traded places).

#### D2-Q10 · Section C · constructed response with a reason (3 points) · 2.NBT.A.4, 2.NBT.A.1
- **Read aloud:** «The red barn has 709 eggs.» «The blue barn has 790 eggs.» «Which barn has
  more eggs?» «Build both numbers. Then tap true or false.»
- **On screen:** two empty charts (N-I3) side by side; then two buttons (red barn · blue barn);
  then, after that answer is committed, six rows with True / False (N-I10).
- **Answer:** the blue barn (790). Rows true: «Both numbers have 7 hundreds.» «790 has 9 tens.
  709 has 0 tens.» «So 790 is greater than 709.» Rows false: «709 has 9 ones, so it is
  greater.» «The number that ends in 9 is greater.» «The 0 in 790 makes it smaller.»
- **Checked:** 1 point both charts right (7, 0, 9 and 7, 9, 0); 1 point the barn; 1 point all six
  rows right (3 true / 3 false, shuffled; L51). By code.
- **Common wrong answer:** the red barn ← "compare the ones first": 9 ones > 0 ones.

**Parent view after the mini check.** Counts, not percents ("5 of 7 points"); each missed item
with his own answer; the skill line it belongs to (the table at the top). Then the review: each
miss walked with the help ladder, one re-try, score unchanged.

---

## Teacher's notes

**What to watch for with this child (from his Chapter 2 test reading, not from these items).**
1. **Hidden regrouping.** On the test he was right on every plain two-number column and wrong
   whenever the regrouping was hidden (four addends, unknown addend, missing digits). In this
   unit the same idea hides inside "10 more" and "10 less" across a hundred and inside counting
   on past 899. Watch Day 1 Q5 and Q7, Day 2 Q3 and Q8. A 302, 206, 8100 or 693 is the same
   root as his carry misses: ten of one place is one of the next.
2. **The zero.** On his error-analysis item the mistake involved a dropped zero; he found where
   the digits belonged but not why. Watch Day 1 Q1, Q2, Q3 and Day 2 Q9: does he hold the empty
   place with a 0 every time?
3. **Positions, not reasons.** He describes where a digit goes, not what it is worth. On Day 1
   Q7 and Day 2 Q10, listen to the rows he taps and the sentence he says. The words to hear are
   "tens", "hundreds" and "a hundred is ten tens". Prompt once: «Say it with the word tens.»
4. **"In your head."** He wrote a column when the test said "add mentally". On Day 1 Q7 the chip
   matters more than the answer: "I pictured a column" on a 10-more item means the mental route
   is not yet there. Do not mark him down for it; note it for U02 L1.
5. **Numbers in the text.** On the last test item he took a number from the text as an answer.
   On Day 1 Q8 a 312 is that habit (3 and 12 copied); ask «What is in each box?» once.
6. **Speed and help.** No timer is shown. If he opens help on an item, the item comes back later
   in the day with new numbers (TAD §3.3).

**How to know after two days whether he needs more review.** Read it per skill, not by total
score. Each skill line in the top table has three to six items over the two days.

| What the two days show | Reading | What happens next |
|---|---|---|
| Every item of a skill right on first try, on both days, no help | **holds** for now (one review is not "knows"; TAD §2 still needs two clean practice days) | the skill joins the U02 practice days as a normal return (DD10) |
| One miss in a skill, the other items right | **unclear** | one return item with new numbers inside the first U02 practice day |
| The same wrong rule on both days (for example 302 on Day 1 Q5 and 693 on Day 2 Q8, or a dropped zero on Day 1 Q3 and Day 2 Q9) | **does not hold: a rule** (two same-structure answers, E77) | one short extra lesson day on that skill only (the U01 lesson's concrete step: the chart trade), then returns; no third full review day |
| Mini check 5 of 7 or better, and no rule seen twice | **ready** | start the regrouping probe (GRADE-2 §0.2) and U02 L1 |
| Mini check 4 of 7 or lower | look at which items: if both misses are crossing-a-hundred items (Q8 and the Day 1 pair), that is one rule, so one extra day on L5 only | then the probe |

Two cautions. A right answer with "I pictured a column" counts as right but is reported to the
parent as a hidden miss, as on the test. A miss on a long item where his answer shows he did
not parse the question (for example ordering greatest first) is flagged as **reading**, not
place value (DD17), and the item is re-read aloud once before it counts.

**What the parent sees.** One line per skill: holds / unclear / does not hold, with his own
answers beside each miss, and one thing to try at home (offered, never assigned): build a number
with coins of 1, 10 and 100 cents and ask "what is 10 more?" across a hundred.

---

## Compliance map

| Rule or source | Where applied |
|---|---|
| Brief: 8 + 10 items; five U01 lessons; formats mixed; blocks and number line each day; one constructed response each day | top table; D1-Q8, D2-Q10 |
| No test value, no U01 worked-example value | header; `teacher_check.py` gate (output in the testing report) |
| DD10 returns and 2 / 7 / 21 comebacks | mini check; teacher's notes table |
| DD11 A / B / C, 2 / 2 / 3, feedback held, review after | D2-Q8 to Q10 |
| DD16 one explain a day; rows graded, sentence formative | D1-Q7, D2-Q10 |
| DD17 read aloud, ≤ 10 words a sentence, no key words | every «» line (word counts in the script output) |
| METHODOLOGY §7 choice order and numeric rank | MC key ranks: 2nd, smallest, 3rd, largest, 2nd |
| N-I6 landings typed before they are drawn | D1-Q5, D2-Q3 |
| L33 nothing in the picture gives the asked step away | D1-Q1 (the blocks are the question), D1-Q8 (labelled boxes, no loose pens), D2-Q7 (number never spoken) |
| TAD §3.10, §3.19 | header |
