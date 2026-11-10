# Whole-app evaluation — 2026-11-09 (owner: "evaluate for other issues that might have been missed")

Method: (1) the owner's son's real records since 2026-09-27 (Kumon `worksheet_progress`,
`problem_attempts`, `practice_sessions`; Best Brains `bb_week_state`, `bb_item_attempts`);
(2) every new-concept intro and every miss-help path read against what its sheets ask,
Levels C–F (read-only audit); (3) every Kumon answer format from C61 to D81 driven in the
screen harness at 430 px like a 7-year-old; (4) the 2026-09-04 screen-review defect list
re-checked against today's code. The heaviest claims were re-verified by hand (marked ✔).
Nothing was changed by this evaluation.

## 0. A correction to 2026-11-09 §12

The touch number pad has NO Enter key (`WorksheetNumberPad.tsx:353` — ✓ is Check, "disabled
until all questions answered"; Enter exists only on a hardware keyboard, `StudyPage.tsx:839`) ✔.
So on a tablet his stray single digits (31 of 70 on C51–C55) were not the Enter jump. The
pattern — a lone digit kept unchanged through several Checks, ~1 s on that problem — fits a
child FILLING the empty problems to unlock Check so he can check the one he just did. The
Enter guard shipped in #25 is harmless and helps keyboard users; the real cause is the
Check-locked-until-all-answered rule. (Owner to confirm his device: tablet or keyboard.)

## 1. His records

Kumon (C15–C55 since Sep 27):
- **He always moves on.** `nextWorksheet = currentWorksheet + 1` after every sheet
  (`StudyPage.tsx:1346`) ✔; the 80% rule (`progressService.ts:207`) only labels the row.
  C17, C35, C47, C48, C50, C52 are "in_progress" (below the bar) and were never redone.
- **The bar measures something muddled.** Totals count retries: 10-problem sheets record
  10/13, 10/14, 10/15 (practice_sessions: "15 completed, 10 correct").
- **Speed is recorded, never used.** time_vs_SCT 1.1–12× (C40 12×, C53 10.5×, C30 10.8×);
  median seconds to first answer per times-table fact 6–25 s (C30 43 s) vs ~9 s implied by
  the 90 s SCT. Kumon repeats a sheet done well over SCT; the app does not.
- First-try on times tables 70–100% (up from 73% before Sep 26); help ladder almost never
  opened (1 problem); table checked on C41–46 only.
- Instrument faults: `hintLevelReached` is empty on all 390 times-table rows (the level is
  cleared when the answer turns right, before it is recorded); `avg_focus_score` never
  written (focus lives only on sessions); an empty session opens after most sheets.
- The child sees a running ⏱ stopwatch and a coloured focus % (`StudyPage.tsx:2014`) —
  ruling open since 2026-09-26.

Best Brains: week 4 passed 10-17 (second re-check 6/6); week 5 Form A 4/6, strengthening
waiting. Comebacks work: B3 misses on 11-05 came back 11-07 with new numbers, both right
first try. Pattern: on a missed comeback he typed the same answer three times ("77", "77",
"77") through both hint steps.

## 2. Teaching and miss help, Levels C–F (intro = new-concept modal; miss = hints)

Mechanisms behind most findings:
1. Times-table TEACHING runs the ADDITION steps: id `multiplication-as-repeated-addition`
   contains "addition", checked first (`FullTeaching.tsx:416` before `:462`) ✔ → "We start
   with 8… count up 2 more" (number line 8 + 2 = 10), then "8 × 2 = 16". He reached this
   step on 31 of 390 times-table problems ✔.
2. FullTeaching invents its demo from `problem.type`; every fraction gets an ADDITION demo
   with 3 operands → a red "Invalid Fraction … divide a pizza into 0 slices" panel.
3. The visual hint draws the CHILD'S OWN numbers; unmapped ids fall back by operation
   (multiplication → array, division → fair sharing, fraction → bar; conversion / word
   problem / decimal → an emoji).
4. Two intro animations ignore the operation (FractionOperation, PlaceValue → addition).
5. Intros fire only on the exact first sheet except C51/C101 (`through`).

Level C (his next year):
- C111–115 missing factor "8 × ___ = 24": operands [8, 3], `missing-factor-setup`
  unmapped → the array "8 × 3 = ?, 8 groups of 3" = **the answer** ✔. Not introduced.
- C111–120 exact division: hints mix "make groups of" and "share among"; teaching example
  keeps his quotient ("20 ÷ 4 = 5. Now try 15 ÷ 3!") (`hintGenerator.ts:49`, `FullTeaching.tsx:316`).
- **Any remainder is accepted on an exact problem:** "40 ÷ 8 = 5 R 3" ✓ (`parseFloat`,
  `WorksheetView.tsx:1031`) ✔ — every remainder-0 problem C111–D.
- C121–160 remainders: the R key is never explained on screen (the only "tap R" text is in
  `problem.hints`, which no worksheet renders); no hint mentions a leftover; the visual
  asks to "share 16 equally among 5 groups"; the teaching example is exact.
- C161–200 "long division": no layout at all — "835 ÷ 6 = ?" on one 16 px line, mental or
  scratch pad only; intro teaches Divide-Multiply-Subtract-Bring-down with a demo that never
  brings down; the visual hint draws the dividend as emoji (503 flowers, a 2,128 px card);
  teaching examples contain his quotient.
- Times tables C11–50: intros partly mismatched (the 4 × 5 = 5 × 4 claim never shown, the
  "digits add to 9" never shown); miss teaching = mechanism 1.
- Seed videos for 2-digit × 1-digit are "Area Model Multiplication" (production table not checked).

Level D:
- D11–50 2-digit × 2-digit: intro "area model: 4 smaller rectangles" draws 1,035 emoji
  (5,535 at D41); hints "44 groups of 38"; nothing teaches the two partial-product rows.
  INPUT BLOCKER on touch: a short partial product lets the next digit fill the empty box
  (43% of problems); typing the answer straight puts it in the working rows, the total stays
  empty and **Check stays disabled with no message**; tapping a non-active card's total only
  selects the card; two boxes highlighted at once; C clears only the total. Emoji walls
  pushed Chrome to 1.3 GB.
- D1–10, D51–70 (3-digit × 1-digit review, stacked): get the area-model hints (the #25
  column-method hints are gated `level === 'C'`).
- D71 long division by 2-digit begins; its intro waits until D81. The only bracket the
  child ever sees is the D-level visual hint.
- **D131–150 and D181–200 fractions cannot be typed on a tablet:** the pad's one special
  key is R on all of Level D, so "/" never appears (`StudyPage.tsx:503`,
  `WorksheetNumberPad.tsx:218`) ✔. Questions name a circle that is never drawn
  (`visualAssets` unrendered); "shade 3/7" sheets have no shape and no shading tool.
- Equivalent fractions: the teaching text gives the answer ("1/4 = multiply both by 4: 4/16").
- Intros on the wrong sheets: D141 (shading sheets), D161 (equivalent sheets); nothing at D151, D181.

Levels E–F: subtraction/multiplication/division intros animate ADDITION; every fraction
teaching shows the "Invalid Fraction" panel; "Count 8 objects… NaN/8" for conversion
sheets; decimals F181+ have no "." key; several intros 10 sheets late (E91, E131, F121).
7A `counting_to_5` intro text says "Subtract hundreds, tens, and ones".

## 3. Answer formats driven at 430 px (C61–D81)

- Stacked C61–110: the #25 fixes hold (quiet box, "from the left" note, lesson, hints).
  3-digit answers are 69–86% of C61–C100 and 86% of C101–110 — the "only if needed" box is
  usually needed. **Carries are computed from the correct answer**, not his digits, and the
  red carry over the empty hundreds box IS the hundreds digit (design call).
- Horizontal formats: keyboard Enter mid-answer still jumps (keyboard only).
- Remainders: quotient, R, remainder; "6R2" = "6 R 2"; quotient alone rejected.
- 16 px one-line question text for division; duplicate problems on a page; sheet ranges drift
  (C101 floor 99; C161/C181 dividends out of range).

## 4. The 2026-09-04 screen-review list, today

Fixed: #1 escalated dead end (#23), #8 same re-check questions (#22).
Still present: #2 placement result lost on refresh; #3 an enrolled child can be re-placed by
deep link; #4 placement ladder stops at C; #5 reload after the last check answer strands the
child (no hand-in button); #6 a failed scoring call discards the answers; #7 Form A reachable
any day by deep link; #9 40 px audio target in MicroReteach; #10 `passThresholdPct` unread.
