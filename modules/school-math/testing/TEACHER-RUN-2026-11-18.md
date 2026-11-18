# TEACHER RUN — Grade 2 units to 1,000 (G2-U01 to G2-U04), the probe, G2-U02-CK, the mock, the preview

**Run 2026-11-18, 06:49 EST (from `date`).** No child's name anywhere. No curriculum file was
edited. The fixes below are for the curriculum owner to apply.

**Persona.** A Grade 2 teacher with fifteen years in US second-grade classrooms. Trained in the
Singapore model method, with three years teaching Math in Focus Grade 2 in a district that uses
it. Knows families whose children also do Kumon. Reviewing a module she did not write, before
any child sees it.

**What was read.** EXAM-READING.md (all, incl. R1 and the exam-values list), R3 §4 and §8
(format catalogue), GRADE-2.md §0, §3 (G2-U01 to U04, every row and entry check), §4.1
(G2-U02-CK), §7; EXAM-COVERAGE.md §1 to §4; METHODOLOGY-MODEL.md §2, §6, §7; DESIGN-DEFAULTS
DD10, DD11, DD16, DD17; METHOD-LEDGER A and B rows; tutoring-app-design §3, §4.

**The preview page was not found.** `/tmp/claude-1001/-home/de91b2f9-…/scratchpad/subtraction-preview.html`
does not exist, and a search of /tmp found no copy. The six preview items were tested from the
brief's description of them. The preview's 3-item chapter check could not be tested (its items
are not described).

**Root cause of most serious findings.** EXAM-READING.md's "Exam values" list now includes the
test's printed choices for Q1 (56, 60, 66, 67), Q2 (523, 73, 63, 53) and Q3 (17, 23, 27, 127),
and the Q6/Q7 values 173, 197, 355, 455. The number check that EXAM-COVERAGE §2 and §4 report as
"yes" was run against the older list in REVIEW-2026-11-17 B2, which did not have these. Re-run
against the current list, the gate fails in four places (findings 1 to 4). A word-bounded grep of
the whole curriculum folder for the newly listed three-digit values (127, 173, 197, 355, 455,
523) finds only GRADE-2.md:166.

---

## 1. Counts

| | Items | OK | FIX | NOTE |
|---|---|---|---|---|
| G2-U01 rows + entry check | 6 | 2 | 3 | 1 |
| G2-U02 rows + entry check | 8 | 4 | 3 | 1 |
| G2-U03 rows + entry check | 6 | 3 | 1 | 2 |
| G2-U04 rows + entry check | 8 | 4 | 3 | 1 |
| Placement probe (7 rows) | 7 | 5 | 1 | 1 |
| G2-U02-CK (8 items) + missing checks | 9 | 4 | 1 | 4 |
| Mock (9 items) | 9 | 8 | 1 | 0 |
| Preview (5 items + its check) | 6 | 2 | 2 | 2 |
| **Total** | **59** | **32** | **15** | **12** |

Arithmetic: `teacher_check.py` recomputed **241** keys, rule-made wrong values and checks: **0
mismatches**. Every stated key and every "wrong answer ← rule" value in scope is correct as
arithmetic. The FIXes are about test values, wording, ambiguity and diagnosis, not wrong sums.

The new review (G2-U01-REVIEW-2DAY.md) adds 18 items, all recomputed in the same run: 0
mismatches, no test value, no U01 worked-example value, every read-aloud sentence 9 words or
fewer.

---

## 2. Findings, most serious first

"Tier 1 / tier 2" are EXAM-COVERAGE §4's rules: no three-digit test number anywhere; no one- or
two-digit test number as an operand, a key or a printed choice on the named exam-skill surfaces
(which include G2-U03 L1–L5, G2-U04 L1–L3, L5, L6, the probe, G2-U02-CK and the mock).

| # | Item | Verdict | Why | Exact fix |
|---|---|---|---|---|
| 1 | Mock A1 · EXAM-COVERAGE.md:66 (and the claims at :78–91 and :125–126) | **FIX** | The operand 56 and the pool value 67 are both printed choices on the test's Q1 (56, 60, 66, 67). Tier 2 breach on the mock. The "number check" line and the §4 gate row say "yes", which is false against the current list. | Renumber: **Add mentally: 34 + 59 = □.** Key 93. Pool: 43 = only the ones of 59 added (34 + 9); 48 = the tens digit of 59 added as ones (34 + 5 + 9); 83 = the new ten lost (4 + 9 = 13 written as 3; tens 3 + 5 = 8); 95 = "add 60" done (34 + 60 = 94), then the 1 added instead of taken off; 103 = an extra ten; 813 = tens total then ones total (8, then 13). Three below, three above. Chips: jumps of ten · make ten · add 60 and take 1 · I pictured a column. Then re-run the §2 / §4 scans against EXAM-READING's current list and correct both lines. |
| 2 | G2-U02 L3 · GRADE-2.md:166 | **FIX** | The worked example 358 + 127: 127 is a test value (a printed Q3 choice). Tier 1: never, anywhere. | **358 + 126 → 474** ("write the 4 and forget the ten"): fourteen ones are one ten and four, and the ten joins the tens; the answer is 484. |
| 3 | Preview item 2 (463 − 127) | **FIX** | 127 again (tier 1). If any preview item becomes content, it fails the gate. | **463 − 129 = 334**; smaller-from-larger gives 346 (9 − 3, 6 − 2, 4 − 1). |
| 4 | G2-U03 L5 · GRADE-2.md:182 | **FIX** | 56 + 7 + 8: 56 is a printed Q1 choice, on a tier-2 surface (U03 L5 is Q6's repair lesson). The row also never states the wrong total. | **47 + 6 + 8 written with the 6 and 8 under the 4** → 187 (tens 4 + 6 + 8 = 18, ones 7: "line up on the left"); key 61. Keep the rest of the row. |
| 5 | G2-U04 L1 · GRADE-2.md:190 | **FIX** | (a) The wrong answer 53 is a printed Q2 choice; served in a choice pool it would breach tier 2. (b) 53 is also the first landing on the row's own number line (83 → 53). "Smaller from larger" and "stopped after the tens jump" give the same 53, so one answer cannot say which rule he used (E77). | **82 − 45**: jumps 82 → 42 → 37; key 37. Wrong values now differ: 43 ← "smaller digit from larger" (8 − 4, 5 − 2); 42 ← stopped after the tens jump. Text: "open a ten; 12 − 5 = 7, so 37." |
| 6 | Preview item 3 (bond 540 / 285) | **FIX** | A near copy of probe P3(a) (541 / 286): the same key 255 and the same rule value 345. A child who saw the preview has seen P3(a)'s answer, so P3 can no longer be read. | **Bond: whole 530, part 284** → 246; the rule gives 354 (4 vs 0, 8 vs 3, 5 − 2). Do not show the preview to the child before the probe in any case. |
| 7 | Probe P6 · GRADE-2.md:66 (with W, :60) | **FIX** | P6(a) 46 + 37 is W(a) 46 + 38 minus one. A child who just did W(a) = 84 can answer 83 by "one less" from memory, which is not the mental route P6 is meant to show. | **P6(a) 64 + 28 = 92.** P6(b) 58 + 26 = 84 stays once W(a) changes (#17). |
| 8 | G2-U01 L5 explain item · GRADE-2.md:156 | **FIX** | "Why does only one digit change?" is false on the lesson's own example: 695 + 10 = 705 changes two digits. A child who answers it truthfully contradicts the prompt; a teacher would never ask it beside that example. | Replace with: **"Which digits changed? Why did the hundreds change too?"** For items that do not cross a hundred, keep "Why did only the tens digit change?" and serve it only there. |
| 9 | G2-U02-CK A3 · GRADE-2.md:368 | **FIX** | "Which sum needs a regroup in the tens only?" reads two ways to a 7-year-old: (i) ten tens make a new hundred (the key, 362 + 254), or (ii) a new ten goes into the tens (347 + 226). A child holding reading (ii) picks 347 + 226 and is marked wrong for a wording problem. | Read aloud: **«Which sum makes a new hundred? It makes no new ten.»** (6 + 4 words). Keep the four sums. |
| 10 | G2-U02 L4 T1 item · GRADE-2.md:167 | **FIX** | Same two-way wording: "which sum needs a regroup in the tens?" | **«Which sum makes a new hundred?»** |
| 11 | G2-U04 L4 T1 item · GRADE-2.md:193 | **FIX** | "Which difference needs a regroup in the tens?" can mean "open a hundred" or "open a ten". | **«In which subtraction must you open a hundred?»** |
| 12 | G2-U01 L3 bond · GRADE-2.md:154 | **FIX** | The row asks for "a bond with three parts" (471 = 400 + 70 + 1), but N-F1 and N-I2 (METHODOLOGY §6) define a bond as a whole and **two** parts. For 605 the row's key is "600 + 5" (two parts), so it is not said whether the tens part takes 0. A grader cannot be built from this. | Add to METHODOLOGY §6.1–6.2: **N-F1 / N-I2 three-part form** (hundreds, tens, ones) for G2-U01 L3. In the row: "605 = 600 + 0 + 5: the tens part takes 0, and an empty tens part is 'not yet'." |
| 13 | G2-U04 L7 · GRADE-2.md:196 | **FIX** | "700 − 486 'estimated' as 700 − 400 = 300": 400 is not a rounding of 486 (nearest ten 490, nearest hundred 500), so the row stacks a second error on the one it names. Also 700 is one of his written test answers. | **900 − 486 estimated as 900 − 490 = 410, then 410 written as the answer**: an estimate checks the answer; it is not the answer (exact 414). |
| 14 | G2-U02 L2 · GRADE-2.md:165 | **FIX** | "324 + 251 → 5,75" is not a wrong number. It is 575 with a stray comma, cannot be typed into column boxes, and names no misconception. | **324 + 51 → 834** ("line up on the left": 51 written under 32): ones under ones; the answer is 375. This also prepares U03 L5. |
| 15 | G2-U01 L1 · GRADE-2.md:152 | **FIX** | "399 → 3100" does not say the step. Counting on by 1 gives 400 and the rule gives 3100; by 10 gives 409 and the same rule gives 3109. | **"399, count on by 1 → 3100"**: ten ones make a ten, ten tens make a hundred, so the next number is 400. |
| 16 | G2-U02-CK B6 true row · GRADE-2.md:372 | NOTE | The row "45 + 8 is already 53, so 52 is too small" prints 53, a printed Q2 choice, on a check. It is a working value rather than an operand or a choice, so it is within the rule's letter. | Use DD16's own wording: **"45 + 8 is already more than 52."** |
| 17 | Probe W · GRADE-2.md:60 | NOTE | W(b) 57 + 29 = 86 has the same answer as P1(a) (86), and W(a) 46 + 38 = 84 has the same answer as P6(b) (84). Repeated answers in one sitting make a remembered number look like a right one. | **W(a) 39 + 44 = 83; W(b) 47 + 28 = 75.** With #7 applied, the probe's fourteen answers are all different. |
| 18 | G2-U04 L1-style preview item 1 (74 − 28 on a number line) | NOTE | The same two-rule collision as #5: smaller-from-larger gives 54, and so does stopping after the tens jump (74 → 54). Also 46 (the key) is a probe operand. | If kept as content: **72 − 36** → jumps 72 → 42 → 36 (key 36); smaller-from-larger 44, tens-jump stop 42. |
| 19 | G2-U02-CK A2 pool · GRADE-2.md:367 | NOTE | The pool has no value for E232's rule B (ones mis-added, carry from that total), which the mock has. 292 ("the carry 2 written in front") is a rule I have not seen children use. | Replace 292 with **113**: ones mis-added to 23, carry 2 (tens 9 + 2 = 11). Pool stays three below, three above. |
| 20 | G2-U02-CK C7 · GRADE-2.md:373 | NOTE | "It is given 179 more books." is passive, which is hard to hear at 7. Three 3-digit addends with a carry of 2 is above 2.NBT.6 / 2.NBT.7, but it matches the school's habit (two-step over 100 on Ch 4, EdReports). | **«It gets 179 more books.»** Keep the numbers. |
| 21 | GRADE-2.md §4 (no checks for U01, U03, U04) | NOTE | Only G2-U02-CK and G2-U05-CK are written. U01's skills meet a check only as mock A3, and U04 runs beside Ch 3 with no check of its own. | Write G2-U04-CK before U04 runs (it is the next chapter test he will sit). The new 2-day review's mini check stands in for U01. |
| 22 | G2-U01 L4 · GRADE-2.md:155 | NOTE | The row names two rules, "9 is the biggest digit" and "comparing the ones first", but on 489 / 512 they pick the same number, so the row cannot tell them apart. | Fine as a lesson example. In practice pools add a pair that separates them, e.g. 391 vs 418 (biggest digit picks 391; ones first picks 418). |
| 23 | G2-U02 L7 · GRADE-2.md:170 | NOTE | Rounding to check is Common Core 3.NBT.A.1, not Grade 2. | Label it "school-beside (3.NBT.A.1)" like U09 and U12, or confirm from the school that its Grade 2 book rounds. |
| 24 | G2-U03 L1 · GRADE-2.md:178 | NOTE | Counting 54 loose counters is long for a concrete step and invites a slip (54 − 38 = 16 is right). | Show the counters in ten-frames (5 full frames and 4), so the whole is read, not counted. |
| 25 | G2-U03 L2 · GRADE-2.md:179 | NOTE | The jumps 356 → 456 → 526 → 531 include a jump of 70 that crosses a hundred (456 → 526), which is the hardest landing for a 7-year-old to type. | Teach the friendlier count-up first: **356 → 400 (+44) → 500 (+100) → 531 (+31)** = 175. N-I6 should accept either route. |
| 26 | G2-U04 L2 · GRADE-2.md:191 | NOTE | "Then add the answer to the smaller number" is adult wording. | **"Then add back the number you took away."** |
| 27 | Preview page and its 3-item chapter check | NOTE | The path given does not exist, so the page the parent has seen could not be read, and its check items are not described anywhere. Not tested. | Save the page beside the curriculum (not in /tmp), then re-run this check on the page itself before it is shown again. |
| 28 | G2-U01 L2 · :153 | OK | 3 flats, 0 rods, 7 cubes = 307; "write the digits you see" gives 37. | — |
| 29 | G2-U01-EC · :158 | OK | Prerequisites named correctly (G1-U10). | — |
| 30 | G2-U02 L1 · :164 | OK | 47 + 30 = 77, + 6 = 83; tens then ones gives 713. Answer typed first, jumps after: right order. | — |
| 31 | G2-U02 L5 · :168 | OK | 487 + 365 = 852; "fifteen tens, no new hundred" gives 752. | — |
| 32 | G2-U02 L6 · :169 | OK | Ones 1 + 8 + 8 + 9 = 26; carry 2 gives 96; "always 1" gives 86. The bond 26 = 20 + 6 is the right board picture. | — |
| 33 | G2-U02-EC · :172 | OK | — | — |
| 34 | G2-U03 L3 · :180 | OK | Smaller from larger on 356 / 531 gives 225 (5, 2, 2); key 175. | — |
| 35 | G2-U03 L4 · :181 | OK | 3□7 + 42□ = 765 has exactly one solution, 337 + 428. "Each column alone" gives 347 + 422 = 769, which does not check. | — |
| 36 | G2-U03-EC · :184 | OK | — | — |
| 37 | G2-U04 L3 · :192 | OK | 452 − 137 = 315; smaller from larger gives 325. "Why did the 5 become 4?" matches the example. | — |
| 38 | G2-U04 L5 · :194 | OK | 623 − 258 = 365; open a ten, then 5 − 1 in the tens, gives 445. | — |
| 39 | G2-U04 L6 · :195 | OK | 300 − 164 = 136; "0 − 4 write 4, 0 − 6 write 6" gives 264. | — |
| 40 | G2-U04-EC · :198 | OK | — | — |
| 41 | Probe P1 · :61 | OK | (a) ones 26 → 86, carry 1 → 76. (b) ones 25 → 95, carry 1 → 85. Rule B (step 1 = 15) also ends at 85, as designed: step 1 separates the rules. | — |
| 42 | Probe P2 · :62 | OK | 22 and 25. | — |
| 43 | Probe P3 · :63 | OK | 255 (rule 345); 237 (rule 363). | — |
| 44 | Probe P4 · :64 | OK | 365; 357. New numbers, as F4 asked. | — |
| 45 | Probe P5 · :65 | OK | One solution each: 264 + 315 and 266 + 317. "Each column alone" on (b) gives ones 3, tens 7. | — |
| 46 | G2-U02-CK A1 · :366 | OK | 81; all six pool values reproduce; three below, three above. | — |
| 47 | G2-U02-CK B4 · :369 | OK | 844; one carry gives 744. | — |
| 48 | G2-U02-CK B5a · :370 | OK | One solution, 462 + 235. | — |
| 49 | G2-U02-CK B5b · :371 | OK | One solution, 577 + 266; the rule gives 527 + 264 = 791. | — |
| 50 | Mock A2 · EXAM-COVERAGE.md:67 | OK | 98; pool 78, 80, 88 / 99, 108, 728 all reproduce. | — |
| 51 | Mock A3 · :68 | OK | 903; 803, 883, 894, 993, 8103, 8913 reproduce. | — |
| 52 | Mock B4 · :69 | OK | 256; rule 344; sum 1,190; count-up 200 + 50 + 6. | — |
| 53 | Mock B5a · :70 | OK | One solution, 376 + 422. | — |
| 54 | Mock B5b · :71 | OK | One solution, 448 + 356; rule 458 + 354 = 812. | — |
| 55 | Mock B6 · :72 | OK | 361; the child's 439 is smaller-from-larger; 371 and 379 reproduce; 439 + 239 = 678. | — |
| 56 | Mock C7a · :73 / C7b · :74 | OK | 743 (195 by subtracting). C7b: 170 and 210, checks 380 and 40. Stretch kept out of the count. | — |
| 57 | Preview 4 (400 − 158) · Preview 5 (702 − 146 shown as 644) | OK | 242, with the "0 − 8 write 8" rule giving 358. 644 is exactly "smaller from larger" (6 − 2, 4 − 0, 7 − 1), so the find-the-mistake is honest; the check 644 + 146 = 790 ≠ 702 makes a good true row. | — |

Count note: rows 56 (mock C7a and C7b) and 57 (preview items 4 and 5) each hold two items, so
the table has 57 rows for 59 items: 32 OK, 15 FIX, 12 NOTE. In the probe, W is the NOTE (#17)
and P6 the FIX (#7). The preview's NOTEs are item 1 (#18) and the missing page and check (#27).

---

## 3. Teaching each row through (one line each: how I would teach it and what goes on the board)

Every number on these lines was recomputed by the script (§4). Rows marked † carry a FIX above.

**G2-U01 Numbers to 1,000**
- L1† — Count aloud along a strip, stopping at 399, and ask "what do ten tens make?" before
  revealing 400. Board: a counting tape 396–404 with the window masked past the start.
- L2 — Bundle ten rods into a flat with the class, then build 307 and ask "what goes in the
  empty column?" Board: chart with 3 flats, empty tens, 7 cubes → 307, never 37.
- L3† — Sort the blocks by kind and write each kind's value in a bond part. Board: 471 = 400 + 70 + 1
  and 605 = 600 + 0 + 5, with the 0 written in.
- L4 — Two charts side by side; cover everything but the hundreds and decide there first. Board:
  489 | 512 with the hundreds column circled.
- L5† — Add one rod on the chart and say which columns changed; then cross a hundred (695 + 10)
  and watch ten rods become a flat. Board: 695 → 705, both changed digits marked.

**G2-U02 Addition within 1,000**
- L1 — "Keep 47 whole, jump 30, jump 6", landings typed first. Board: open line 47 → 77 → 83.
- L2† — Column by column with blocks, no trades. Board: 324 + 51 lined up by place, with the
  wrong left-aligned version beside it.
- L3† — Ten ones snap into a rod; write the carry 1 before adding the tens. Board: 358 + 126 with
  the carry row.
- L4† — Ten rods snap into a flat. Board: 453 + 281, the hundreds carry written first.
- L5 — Two trades in order, ones then tens. Board: 487 + 365 = 852 with two carries.
- L6 — Pour all the ones together, group them into tens: 26 ones are two rods and 6. Board: bond
  26 = 20 + 6 and the carry 2.
- L7 — Place each addend on a ticked line and pick the nearer ten. Board: 298 → 300, 456 → 460,
  760 next to the exact 754.

**G2-U03 The unknown part**
- L1 — Counters under a cup (in ten-frames), then a bond with the empty part. Board: whole 531,
  part 356, empty part → 175.
- L2 — Count up from the part to the whole on an open line, landings typed. Board: 356 → 400 →
  500 → 531, and 531 − 356 = □ beside 356 + □ = 531.
- L3 — Rebuild the boxed column as a bond beside it. Board: the T7 column with the box, the bond
  next to it, and the "smaller from larger" 225 crossed out.
- L4 — Ones column first: "did a ten come in?" Board: 3□7 + 42□ = 765, carry row filled before
  the digits.
- L5† — A wrong column beside a chart with the digits placed by value; fix it, then the reason
  rows. Board: 47 + 6 + 8 lined up left (187) and by place (61).

**G2-U04 Subtraction within 1,000**
- L1† — Jump back the tens, then the ones; and the "open a ten" way. Board: 82 → 42 → 37.
- L2 — Take away by columns, then add back to check. Board: 574 − 231 = 343; 343 + 231 = 574.
- L3 — Open one rod into ten cubes, said aloud. Board: 452 − 137, the 5 crossed to 4, 12 ones.
- L4† — Open one flat into ten rods. Board: 528 − 263 = 265.
- L5 — Two openings, ones first. Board: 623 − 258 = 365 with both marks.
- L6 — A zero has nothing to give: open the hundred, then a ten. Board: 300 − 164 = 136.
- L7† — Estimate first, exact second, compare. Board: 900 − 490 = 410 (estimate) beside
  900 − 486 = 414 (exact).

**Probe, U02-CK and mock.** These are checks, not lessons, so nothing is taught during them
(feedback held). The worked values are in §4.

**Judgement against the school's formats (R3 §8, EXAM-READING).** The probe, U02-CK and the mock
use the school's formats faithfully: T1/T5 choices with a blank, the T6 column of four addends,
the T7 column with a box, T9 shown work, T10 digit boxes with an open carry row, T12 error
analysis with a "why", T17 constructed response, A/B/C 2/2/3 = 15. Nothing is used before it is
taught, with one exception the plan already handles: the probe runs before U02/U03 by design and
holds no feedback. Read-aloud wording is short everywhere except the items in #9–#11 and #20.

---

## 4. Script output

Script: `/tmp/claude-1001/-home/de91b2f9-b4b8-4d2b-a980-1073d75fadb3/scratchpad/teacher_check.py`
(run with `python3 -I`). It recomputes every key and rule value, every proposed fix, the
review's 18 items, scans the in-scope lines for test values (the list is read from
EXAM-READING.md at run time, plus his written answers 426, 515, 700, 800, 839), and counts the
review's read-aloud words. In the scan, hits that are working values or range words are allowed:
15 (:61), 17 (:367) and 14 (:368–371, mock :71, :73) are column totals; 100 is "within 100",
"100 more" or "100s". The breaches are 127 (:166), 56 (:182, mock :66), 67 (mock :66) and 53 (:190).
53 at :372 is a working value inside a true row (NOTE #16); 700 at :196 is his written answer on
a surface outside tier 2 (folded into FIX #13).

```
== G2-U01 lesson rows (GRADE-2.md:152-156)
  OK  L1 399 count on by 1, key: got 400, stated 400
  OK  L1 399 +1, rule 'ten tens written as 10' -> 3100: got 3100, stated 3100
  OK  L1 (step unstated) 399 +10 under same rule: got 3109, stated 3109
  OK  L2 3 flats 0 rods 7 cubes key: got 307, stated 307
  OK  L2 'write the digits you see': got 37, stated 37
  OK  L3 471 expanded: got 471, stated 471
  OK  L3 605 key parts: got [600, 5], stated [600, 5]
  OK  L3 605 skip-zero rule parts: got [600, 50], stated [600, 50]
  OK  L4 489 vs 512 true greater: got 512, stated 512
  OK  L4 ones-first picks: got 489, stated 489
  OK  L5 695 + 10 key: got 705, stated 705
  OK  L5 'add to the tens digit and stop': got 605, stated 605
  OK  L5 digits that change in 695 -> 705 (explain item says 'only one'): got 2, stated 2
== G2-U02 lesson rows (GRADE-2.md:164-170)
  OK  L1 47+36 jumps: got (77, 83), stated (77, 83)
  OK  L1 tens-then-ones: got 713, stated 713
  OK  L2 324+251 key: got 575, stated 575
  OK  L2 proposed fix 324+51 key: got 375, stated 375
  OK  L2 proposed fix 'line up on the left' (51 under 32): got 834, stated 834
  OK  L3 358+127 key: got 485, stated 485
  OK  L3 forget the ten: got 475, stated 475
  OK  L4 453+281 key: got 734, stated 734
  OK  L4 forget the hundred: got 634, stated 634
  OK  L5 487+365 key: got 852, stated 852
  OK  L5 no new hundred: got 752, stated 752
  OK  L6 21+18+38+19 key: got 96, stated 96
  OK  L6 ones total: got 26, stated 26
  OK  L6 carry always 1: got 86, stated 86
  OK  L7 exact 298+456: got 754, stated 754
  OK  L7 nearest ten 300+460: got 760, stated 760
  OK  L7 round down 290+450: got 740, stated 740
== G2-U03 lesson rows (GRADE-2.md:178-182)
  OK  L1 counters 54-38 hidden: got 16, stated 16
  OK  L1 531-356 key: got 175, stated 175
  OK  L1 add the two: got 887, stated 887
  OK  L2 jumps 356->456->526->531: got (456, 526, 531, 175), stated (456, 526, 531, 175)
  OK  L3 smaller-from-larger 356/531: got 225, stated 225
  OK  L4 3?7+42?=765 solutions: got [(337, 428)], stated [(337, 428)]
  OK  L4 each column alone: got (347, 422), stated (347, 422)
  OK  L4 each-column value does not check: got 769, stated 769
  OK  L5 56+7+8 key: got 71, stated 71
  OK  L5 7 and 8 under the 5 (tens) -> unstated wrong total: got 206, stated 206
== G2-U04 lesson rows (GRADE-2.md:190-196)
  OK  L1 83-36 key, jumps: got (53, 47), stated (53, 47)
  OK  L1 smaller-from-larger: got 53, stated 53
  OK  L1 stopped after tens jump (2nd rule, same value): got 53, stated 53
  OK  L1 fix 82-45 key: got 37, stated 37
  OK  L1 fix smaller-from-larger: got 43, stated 43
  OK  L1 fix stopped after tens jump: got 42, stated 42
  OK  L2 574-231 key: got 343, stated 343
  OK  L2 added: got 805, stated 805
  OK  L2 check by adding back: got 574, stated 574
  OK  L3 452-137 key: got 315, stated 315
  OK  L3 smaller-from-larger: got 325, stated 325
  OK  L4 528-263 key: got 265, stated 265
  OK  L4 6-2 in tens (sfl): got 345, stated 345
  OK  L5 623-258 key: got 365, stated 365
  OK  L5 open ten, then sfl in tens: got 445, stated 445
  OK  L6 300-164 key: got 136, stated 136
  OK  L6 '0-4 write 4': got 264, stated 264
  OK  L7 700-486 exact: got 214, stated 214
  OK  L7 stated 'estimate' 700-400: got 300, stated 300
  OK  L7 486 to nearest ten / hundred: got (490, 500), stated (490, 500)
  OK  L7 fix estimate 700-490: got 210, stated 210
== Placement probe (GRADE-2.md:60-66)
  OK  W(a) 46+38: got 84, stated 84
  OK  W(b) 57+29: got 86, stated 86
  OK  P1(a) 38+19+13+16: got 86, stated 86
  OK  P1(a) ones: got 26, stated 26
  OK  P1(a) carry 1: got 76, stated 76
  OK  P1(b) 19+28+36+12: got 95, stated 95
  OK  P1(b) ones step: got 25, stated 25
  OK  P1(b) carry 1: got 85, stated 85
  OK  P1(b) rule B ones 15 carry 1 -> same 85: got 85, stated 85
  OK  P2 9+7+6 / 8+8+9: got (22, 25), stated (22, 25)
  OK  P3(a) 541-286: got 255, stated 255
  OK  P3(a) rule: got 345, stated 345
  OK  P3(b) 612-375: got 237, stated 237
  OK  P3(b) rule: got 363, stated 363
  OK  P4(a) 643-278: got 365, stated 365
  OK  P4(b) 524-167: got 357, stated 357
  OK  P5(a) 2?4+31?=579: got [(264, 315)], stated [(264, 315)]
  OK  P5(b) 2?6+31?=583: got [(266, 317)], stated [(266, 317)]
  OK  P5(b) each column alone -> ones 3, tens 7: got (276, 313), stated (276, 313)
  OK  P6 46+37 / 58+26: got (83, 84), stated (83, 84)
  NOTE keys shared inside the probe: W(b)=P1(a)=86; W(a)=P6(b)=84; P6(a)=W(a)-1
  OK  P6 fix 64+28: got 92, stated 92
  OK  W(b) fix 47+28: got 75, stated 75
  OK  W(a) fix 39+44: got 83, stated 83
  OK  probe answers all different after fixes: got 14, stated 14
  OK  U04 L1-style preview fix 72-36: got (42, 36, 44), stated (42, 36, 44)
  OK  U01 L4 note pair 391 vs 418: ones-first picks: got 418, stated 418
  OK  U03 L2 friendlier count-up: got 175, stated 175
== G2-U02-CK (GRADE-2.md:366-373)
  OK  A1 48+33: got 81, stated 81
  OK  A1 pool 54: got 54, stated 54
  OK  A1 pool 71: got 71, stated 71
  OK  A1 pool 78: got 78, stated 78
  OK  A1 pool 85: got 85, stated 85
  OK  A1 pool 91: got 91, stated 91
  OK  A1 pool 711: got 711, stated 711
  OK  A1 rank of key among pool: got (3, 3), stated (3, 3)
  OK  A2 34+37+16+25: got 112, stated 112
  OK  A2 pool 87: got 87, stated 87
  OK  A2 pool 92: got 92, stated 92
  OK  A2 pool 102: got 102, stated 102
  OK  A2 pool 122: got 122, stated 122
  OK  A2 pool 292: got 292, stated 292
  OK  A2 pool 922: got 922, stated 922
  OK  A2 proposed rule-B value: ones mis-added to 23, carry 2: got 113, stated 113
  OK  A3 345+231 regroups in: got '', stated ''
  OK  A3 362+254 regroups in: got 'tens', stated 'tens'
  OK  A3 347+226 regroups in: got 'ones', stated 'ones'
  OK  A3 376+258 regroups in: got 'onestens', stated 'onestens'
  OK  A3 645+432 regroups in: got 'hund', stated 'hund'
  OK  B4 576+268: got 844, stated 844
  OK  B4 second trade forgotten: got 744, stated 744
  OK  B5a 4?2+23?=697: got [(462, 235)], stated [(462, 235)]
  OK  B5b 5?7+26?=843: got [(577, 266)], stated [(577, 266)]
  OK  B5b each column alone: got (527, 264), stated (527, 264)
  OK  B5b rule sum does not check: got 791, stated 791
  OK  B6 45+8+9: got 62, stated 62
  OK  B6 ones: got 22, stated 22
  OK  B6 child's carry-1 answer: got 52, stated 52
  OK  B6 row 45+8: got 53, stated 53
  OK  C7 268+345+179: got (613, 792), stated (613, 792)
  OK  C7 one-column ones / tens: got (22, 19, 7), stated (22, 19, 7)
  OK  CK points: got 15, stated 15
== Mock test (EXAM-COVERAGE.md:66-74)
  OK  A1 56+29: got 85, stated 85
  OK  A1 pool 65: got 65, stated 65
  OK  A1 pool 67: got 67, stated 67
  OK  A1 pool 75: got 75, stated 75
  OK  A1 pool 87: got 87, stated 87
  OK  A1 pool 95: got 95, stated 95
  OK  A1 pool 715: got 715, stated 715
  OK  A1 FIX 34+59: got 93, stated 93
  OK  A1 FIX pool 43: got 43, stated 43
  OK  A1 FIX pool 48: got 48, stated 48
  OK  A1 FIX pool 83: got 83, stated 83
  OK  A1 FIX pool 95: got 95, stated 95
  OK  A1 FIX pool 103: got 103, stated 103
  OK  A1 FIX pool 813: got 813, stated 813
  OK  A1 FIX pool sides: got (3, 3), stated (3, 3)
  OK  A2 39+16+25+18: got 98, stated 98
  OK  A2 pool 78: got 78, stated 78
  OK  A2 pool 80: got 80, stated 80
  OK  A2 pool 88: got 88, stated 88
  OK  A2 pool 99: got 99, stated 99
  OK  A2 pool 108: got 108, stated 108
  OK  A2 pool 728: got 728, stated 728
  OK  A3 893+10: got 903, stated 903
  OK  A3 pool 803: got 803, stated 803
  OK  A3 pool 883: got 883, stated 883
  OK  A3 pool 894: got 894, stated 894
  OK  A3 pool 993: got 993, stated 993
  OK  A3 pool 8103: got 8103, stated 8103
  OK  A3 pool 8913: got 8913, stated 8913
  OK  B4 723-467: got 256, stated 256
  OK  B4 rule: got 344, stated 344
  OK  B4 sum: got 1190, stated 1190
  OK  B4 count-up: got (667, 717, 723), stated (667, 717, 723)
  OK  B5a 3?6+42?=798: got [(376, 422)], stated [(376, 422)]
  OK  B5b 4?8+35?=804: got [(448, 356)], stated [(448, 356)]
  OK  B5b each column alone: got (458, 354), stated (458, 354)
  OK  B5b rule sum: got 812, stated 812
  OK  B6 600-239: got 361, stated 361
  OK  B6 child's sfl: got 439, stated 439
  OK  B6 row 439+239: got 678, stated 678
  OK  B6 371 (tens left at 10): got 371, stated 371
  OK  B6 379 (only the hundred opened): got 379, stated 379
  OK  C7a 469+274: got 743, stated 743
  OK  C7a 469-274: got 195, stated 195
  OK  C7b (380-40)/2 and +40: got (170, 210), stated (170, 210)
  OK  C7b check: got (380, 40), stated (380, 40)
  OK  mock points: got 15, stated 15
== Preview items (from the brief's description; the .html is not on disk)
  OK  P-1 74-28 key: got 46, stated 46
  OK  P-1 sfl: got 54, stated 54
  OK  P-1 tens-jump landing (same value): got 54, stated 54
  OK  P-2 463-127: got 336, stated 336
  OK  P-2 sfl: got 344, stated 344
  OK  P-3 bond 540/285: got 255, stated 255
  OK  P-3 sfl: got 345, stated 345
  NOTE P-3 key 255 and rule value 345 = probe P3(a)'s key 255 and rule value 345
  OK  P-3 fix 530/284: got 246, stated 246
  OK  P-3 fix sfl: got 354, stated 354
  OK  P-4 400-158: got 242, stated 242
  OK  P-4 '0-8 write 8': got 358, stated 358
  OK  P-5 702-146: got 556, stated 556
  OK  P-5 shown 644 = sfl: got 644, stated 644
  OK  P-5 check row 644+146: got 790, stated 790
== 2-day review (G2-U01-REVIEW-2DAY.md)
  OK  D1-Q1 5 flats 0 rods 8 cubes: got 508, stated 508
  OK  D1-Q1 drop zero: got 58, stated 58
  OK  D1-Q1 as heard: got 5008, stated 5008
  OK  D1-Q1 zero last: got 580, stated 580
  OK  D1-Q1 rank: got 2, stated 2
  OK  D1-Q2 nine hundred thirty: got 930, stated 930
  OK  D1-Q2 as heard / drop zero: got (90030, 93), stated (90030, 93)
  OK  D1-Q3 904 parts: got [900, 0, 4], stated [900, 0, 4]
  OK  D1-Q3 skip-zero: got [900, 40], stated [900, 40]
  OK  D1-Q4 exactly one false (438>501): got ['438 > 501'], stated ['438 > 501']
  OK  D1-Q4 under ones-first, the key looks true and the rest look false: got ['438 > 501'], stated ['438 > 501']
  OK  D1-Q5 landings: got [392, 402, 412], stated [392, 402, 412]
  OK  D1-Q5 hundreds-stay: got 302, stated 302
  OK  D1-Q5 ten tens as 10: got 3102, stated 3102
  OK  D1-Q6 529-100: got 429, stated 429
  OK  D1-Q6 pool: got [519, 528, 629], stated [519, 528, 629]
  OK  D1-Q6 rank: got 1, stated 1
  OK  D1-Q7 296+10: got 306, stated 306
  OK  D1-Q7 rules: got [206, 2106, 297], stated [206, 2106, 297]
  OK  D1-Q8 3 boxes of 100 + 12 packs of 10: got 420, stated 420
  OK  D1-Q8 chart after grouping: got [4, 2, 0], stated [4, 2, 0]
  OK  D1-Q8 rules: got [312, 3120], stated [312, 3120]
  OK  D2-Q1 the 2 in 217: got 200, stated 200
  OK  D2-Q1 rank: got 3, stated 3
  OK  D2-Q2 3+40+900: got 943, stated 943
  OK  D2-Q2 order read: got 349, stated 349
  OK  D2-Q2 parts side by side: got 900403, stated 900403
  OK  D2-Q3 landings: got [898, 899, 900, 901], stated [898, 899, 900, 901]
  OK  D2-Q3 ten tens as 10: got 8100, stated 8100
  OK  D2-Q3 ones to 0, tens stay: got 890, stated 890
  OK  D2-Q4 order: got [368, 683, 836], stated [368, 683, 836]
  OK  D2-Q4 ones-first order: got [683, 836, 368], stated [683, 836, 368]
  OK  D2-Q4 greatest-first differs from ones-first: got True, stated True
  OK  D2-Q5 856+100: got 956, stated 956
  OK  D2-Q5 pool: got [756, 857, 866], stated [756, 857, 866]
  OK  D2-Q5 rank: got 4, stated 4
  OK  D2-Q6 350 in tens: got 35, stated 35
  OK  D2-Q6 rules: got [5, 8], stated [5, 8]
  OK  D2-Q7 418 = 400 + 18: got 418, stated 418
  OK  D2-Q8 603-10: got 593, stated 593
  OK  D2-Q8 pool: got [503, 613, 693], stated [503, 613, 693]
  OK  D2-Q8 rank: got 2, stated 2
  OK  D2-Q9 390 parts: got [300, 90, 0], stated [300, 90, 0]
  OK  D2-Q9 wrong chart value: got 309, stated 309
  OK  D2-Q10 greater: got 790, stated 790
  OK  D2-Q10 ones-first picks: got 709, stated 709
  OK  D2-Q10 rows: hundreds equal, tens 9 vs 0: got (True, 9, 0), stated (True, 9, 0)
  OK  mini check points: got 7, stated 7
  OK  MC key ranks not constant: got True, stated True
== Proposed fixes, recomputed
  OK  U02 L3 fix 358+126 key: got 484, stated 484
  OK  U02 L3 fix forget the ten: got 474, stated 474
  OK  U03 L5 fix 47+6+8 key: got 61, stated 61
  OK  U03 L5 fix 6 and 8 under the 4 (tens): got 187, stated 187
  OK  U04 L7 fix 900-486 exact: got 414, stated 414
  OK  U04 L7 fix estimate 900-490 (written as the answer): got 410, stated 410
  OK  Preview P-2 fix 463-129 key: got 334, stated 334
  OK  Preview P-2 fix sfl: got 346, stated 346
  OK  U02-CK B6 row fix: 45+8 more than 52: got True, stated True
== Test-value scan
  exam list (35): [14, 15, 17, 23, 24, 27, 49, 53, 56, 60, 63, 66, 67, 73, 100, 127, 173, 197, 240, 267, 305, 326, 348, 355, 413, 433, 455, 497, 523, 615, 635, 652, 738, 810, 823]
  his extra answers checked too: [426, 515, 700, 800, 839]
  GRADE-2:61 test values present: [15]
  GRADE-2:152 test values present: [100]
  GRADE-2:153 test values present: [100]
  GRADE-2:156 test values present: [100]
  GRADE-2:166 test values present: [127]
  GRADE-2:179 test values present: [100]
  GRADE-2:182 test values present: [56]
  GRADE-2:190 test values present: [53, 100]
  GRADE-2:196 test values present: [700]
  GRADE-2:367 test values present: [17]
  GRADE-2:368 test values present: [14]
  GRADE-2:369 test values present: [14]
  GRADE-2:371 test values present: [14]
  GRADE-2:372 test values present: [53]
  GRADE-2:373 test values present: [100]
  EXAM-COVERAGE:66 test values present: [15, 56, 67]
  EXAM-COVERAGE:71 test values present: [14]
  EXAM-COVERAGE:73 test values present: [14]
  review: numbers >= 10 used: [10, 12, 18, 20, 21, 25, 30, 35, 40, 58, 80, 90, 93, 100, 200, 206, 217, 289, 296, 297, 300, 302, 306, 309, 312, 316, 349, 350, 368, 372, 382, 390, 392, 402, 412, 418, 420, 429, 438, 500, 501, 503, 508, 519, 528, 529, 580, 593, 603, 613, 627, 629, 672, 683, 693, 709, 756, 790, 836, 856, 857, 866, 890, 897, 898, 899, 900, 901, 904, 905, 913, 930, 940, 943, 950, 956, 2106, 3102, 3120, 5008, 8100, 90030, 900403]
  review vs test list: [100]  (expected only the step size 100 / the box label 100)
  review vs his answers: []
  review vs U01 worked-example values: []
  review vs probe keys, mock A3 pool and preview values: []
== Read-aloud sentences in the review («...»), words per sentence
  sentences: 45, longest 9 words, over 10: []

TOTAL arithmetic checks 241, mismatches 0
```

---

## Fix log (2026-11-18)

**Applied 2026-11-18, 06:55–07:03 EST (from `date`)** by the repair author. Files edited:
`design/curriculum/` GRADE-2.md, EXAM-COVERAGE.md, METHODOLOGY-MODEL.md, G2-U01-REVIEW-2DAY.md,
GRADE-4.md (two gate-driven renumberings). Line numbers are the files' lines after the edit.
Script: `testing/fix_check_2026-11-18.py` (run with `python3 -I`): **109 checks, 0 mismatches**.
It reads the exam-value list from EXAM-READING.md's section at run time (digit-box fragments such
as the one in Q5a skipped; their wholes are listed) and adds his written answers.
Items #3 and #6 (the preview page) are handled separately and were not touched.

| # | Item · file:line | Old → new | Arithmetic (by hand) | Script |
|---|---|---|---|---|
| 1 | Mock A1 · EXAM-COVERAGE.md:67 | 56 + 29 (key 85; pool 65, 67, 75, 87, 95, 715) → **34 + 59** (key 93); pool 43, 48, 83 / 95, 103, 813; draw 48 · 93 · 95 · 103; chip "round 59 up and take 1"; the rounding value is not printed | 34 + 50 = 84, + 9 = 93 · 43 = 34 + 9 · 48 = 34 + 5 + 9 · 83: ones 13 → 3, tens 3 + 5 = 8 · 95 = 94 + 1 · 103 = 93 + 10 · 813 = 8 then 13 · 3 below, 3 above | OK (13 checks) |
| 1b | §2 number check · EXAM-COVERAGE.md:79–105; header :7–9; §4 rows :139–140; compliance :169 | "none… checked against REVIEW B2 list" → the list is EXAM-READING's values section (+ his answers); tier 1 / tier 2 rescanned; history line corrected; second list source dropped; 2-day review added as tier-2 surface (6); tier-2 control now a Q1 printed choice in a pool | — | tier-1 and tier-2 scans below |
| 2 | G2-U02 L3 · GRADE-2.md:167 | 358 + 127 → 475 → **358 + 126 → 474**, answer 484 | 8 + 6 = 14; 358 + 126 = 484; ten lost → 474 | OK |
| 4 | G2-U03 L5 · GRADE-2.md:183 | 56 + 7 + 8 (no wrong total) → **47 + 6 + 8, the 6 and 8 under the 4 → 187**; key 61 | 47 + 6 + 8 = 61; left-aligned: tens 4 + 6 + 8 = 18, ones 7 → 187 | OK |
| 5 | G2-U04 L1 · GRADE-2.md:191 | 83 − 36 (53 from two rules) → **82 − 45**: jumps 82 → 42 → 37; 43 ← smaller from larger; 42 ← stopped after the tens jump | 12 − 5 = 7, tens 7 − 4 = 3 → 37; |5−2| = 3, 8 − 4 = 4 → 43; 82 − 40 = 42 | OK |
| 7 + 17 | Probe W, P6 · GRADE-2.md:61, :67 | W 46 + 38, 57 + 29 → **29 + 36, 47 + 28** (65, 75); P6(a) 46 + 37 → **64 + 28** (92); P6(b) 58 + 26 = 84 kept. W(a) differs from the teacher's 39 + 44 because 83 is U02 L1's worked key (47 + 36) and a P6 answer would sit 1 from it | 29 + 36 = 65 (ones 15, one carry); 47 + 28 = 75; 64 + 28 = 92 | OK: 14 probe answers all different; no P6 answer within 1 of a W answer |
| 8 | G2-U01 L5 · GRADE-2.md:157 | "why does only one digit change?" → **"Which digits changed? Why did the hundreds change too?"**; "Why did only the tens digit change?" only on items that do not cross a hundred | 695 + 10 = 705: two digits change | OK |
| 9 | G2-U02-CK A3 · GRADE-2.md:369 | "regroup in the tens only" → **«Which sum makes a new hundred? It makes no new ten.»** (5 + 5 words); sums kept | only 362 + 254 (ones 6, tens 11); 376 + 258 makes both; 645 + 432 makes a new thousand, no new hundred | OK |
| 10 | G2-U02 L4 · GRADE-2.md:168; guided practice :346 | → **«Which sum makes a new hundred?»** | — | OK |
| 11 | G2-U04 L4 · GRADE-2.md:194 | → **«In which subtraction must you open a hundred?»** | 528 − 263: tens 2 < 6 → open a hundred; 265 | OK |
| 12 | G2-U01 L3 · GRADE-2.md:155; METHODOLOGY-MODEL.md:327 (N-F1), :345 (N-I2); review :67 | bond "three parts" undefined → **three-part form** (hundreds · tens · ones) in N-F1 / N-I2; row key **605 = 600 + 0 + 5**, an empty tens part "not yet"; the review's D1-Q3 now points to METHODOLOGY, not to this report | 600 + 0 + 5 = 605; rule 600 + 50 = 650 | OK |
| 13 | G2-U04 L7 · GRADE-2.md:197 | 700 − 486 "≈ 700 − 400" → **900 − 486 estimated as 900 − 490 = 410, written as the answer** (exact 414) | 486 → 490; 900 − 490 = 410; 900 − 486 = 414 | OK |
| 14 | G2-U02 L2 · GRADE-2.md:166 | 324 + 251 → "5,75" → **324 + 51 → 834** (51 under 32); answer 375; return target + U03 L5 | 324 + 51 = 375; 324 + 510 = 834 | OK |
| 15 | G2-U01 L1 · GRADE-2.md:153 | "399 → 3100" → **"399, count on by 1 → 3100"**; reason: ten ones make a ten, ten tens a hundred, so 400 | 399 + 1 = 400 | OK |
| N16 | G2-U02-CK B6 · GRADE-2.md:373 | "45 + 8 is already 53, so 52 is too small" → **"45 + 8 is already more than 52"** | 53 > 52 | OK |
| N19 | G2-U02-CK A2 · GRADE-2.md:368 | pool 292 → **113** (ones mis-added to 23, carry 2); draw 112 · 113 · 122 · 922 | tens 9 + 2 = 11, ones 3 → 113; 3 below, 3 above | OK |
| N20 | G2-U02-CK C7 · GRADE-2.md:374 | "It is given 179 more books." → **"It gets 179 more books."** | 792 unchanged | OK |
| N22 | G2-U01 L4 · GRADE-2.md:156 | adds a separating practice pair **291 vs 436** (biggest digit → 291; ones first → 436). Not the teacher's 391 vs 418: 418 is a review item | 436 > 291 | OK |
| N23 | G2-U02 L7 · :171; G2-U04 L7 · :197 | labelled "rounding: school-beside, 3.NBT.A.1" (E3; E71 for the school's Ch 2–3 rounding) | — | — |
| N24 | G2-U03 L1 · GRADE-2.md:179 | 54 loose counters → **ten-frames, 5 full and 4** | 54 − 38 = 16 | OK |
| N25 | G2-U03 L2 · GRADE-2.md:180 | count-up taught first **356 → 400 → 500 → 531** (44 + 100 + 31); N-I6 also accepts the old route | 44 + 100 + 31 = 175 | OK |
| N26 | G2-U04 L2 · GRADE-2.md:192 | "add the answer to the smaller number" → **"add back the number you took away"** | 343 + 231 = 574 | OK |
| G1 | G4-U03-CK B6 · GRADE-4.md:313 (gate, found by the wider tier-2 scan) | key 53 (a Q2 printed choice): 90 / gap 16 → **94 / gap 16**: 78 → 39 and 55; "78 and 16 differ by 62" | 94 − 16 = 78; 78 ÷ 2 = 39; 39 + 16 = 55; 39 + 55 = 94 | OK |
| G2 | G4-U03 L4 · GRADE-4.md:116 (gate) | rule value 56 (a Q1 printed choice): 68 / 12 → **86 / 18**: 34 and 52; rule 18 and 68 differ by 50 (34, 52 avoid G4-U03-CK A3's key 32) | (86 − 18) ÷ 2 = 34; 34 + 18 = 52 | OK |
| G3 | N-I8 example · METHODOLOGY-MODEL.md:351 | "□ + 18 = 53" → **"□ + 18 = 45"** (53 is a Q2 choice; engineers copy examples) | — | — |
| H | Header claims · GRADE-2.md:6–8; review :6–8 | "none of the test's numbers" → none except as the two tiers allow; review names itself a tier-2 surface and the full values section | — | — |

**Reuse rule (EXAM-COVERAGE §4) re-run on the new numbers.** No mock or G2-U02-CK key is a new lesson
number or a probe answer (script: OK ×3).

**Tier 1** (script, word-bounded, every file of `design/curriculum/`): hits only in
REVIEW-2026-11-17.md, which quotes the test for its review. GRADE-3's 3,523 is a different number
(compared as written).

**Tier 2, the brief's `grep -nwE` over the surfaces** (probe GRADE-2:51–68, G2-U01–U04 rows
:149–200, G2-U02-CK :362–375, mock EXAM-COVERAGE:65–76, the whole review), after the fixes:

| Hit | Where | Verdict |
|---|---|---|
| 15 | probe P1 reading :62 ("step 1 wrong, e.g. 15") | kept: a predicted wrong ones total in the reading, never shown; it is the rule-B value that collides with rule A at 85 by design (#41) |
| 100 | U01 :153 ("100s"; the rule quote "written 100 after the 3"), :154 ("say 100 as ten tens"), :157 ("100 more, 100 less"), :159 and :199 (entry checks "to 100", "within 100"), U03 L2 :180 (a jump of 100), U04 L1 :191 ("within 100"), CK C7 :374 ("numbers over 100") | kept: place words, range words, a jump, and the step size 2.NBT.B.8 names |
| 15 | CK header :362 ("15 points") | kept: the point total |
| 17, 23 | CK A2 :368 (ones 17 inside the 87 rule; ones mis-added to 23 inside the 113 rule) | kept: working values; 113 keeps the pool three-and-three (21 would give 111 and four values below) |
| 14 | CK A3 :369, B4 :370, B5b :372; mock B5b :72, C7a :74 | kept: column totals |
| 23 | CK B5a :371 ("23□") | kept: a three-digit numeral with a digit box, not the value 23 |
| 100 | review :9–10 (header), :27, :30 (skill table), D1-Q6 :101 and D2-Q5 :177 ("100 less / more than"), D1-Q8 :125, :127 (boxes of 100), :288 (coins of 100 cents) | kept: the step size and unit labels that 2.NBT.B.8 and place value name; never a key or choice |

No hit is an operand, a key or a printed choice. The script's wider scan (G2-U05 L3, L5; G2-U06;
G2-U07 L4, S1; G2-U13 L5; G2-U05-CK; G4-U03 L4; G4-U03-CK A3, B6) adds only working values
(14, 15 in G2-U05-CK A1) after G1 and G2 above.

**NOTEs not applied.** #18 and #27 (preview: handled separately). #21 (write G2-U04-CK before U04
runs): a new 15-point check is not a cheap edit; owed before U04. Out of scope but seen: GRADE-3
:116 and :128 use the same two-way "needs a regroup in the tens only / hundreds" wording as #9–#11
(Grade 3 readers; not changed).
