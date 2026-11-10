# Handoff — Kumon teaching and screen fixes (planned 2026-11-10)

Start here in a new conversation. Read, in order: this file; `docs/AUDIT-2026-11-09-WHOLE-APP.md`
(the evaluation this plan answers, with file:line evidence); `docs/BRIEF-2026-09-26-RECALL-NOT-LOOKUP.md`
§11–§12 (the last two shipped change sets); `docs/TUTORING-PRINCIPLES.md`; the memory file
`mindfoundry-recall-not-lookup.md`. This file and the audit were committed locally on 2026-11-10 (NOT
pushed) — they go up with the first change set's push.

## Status (updated 2026-11-10)

- **Change set 1 BUILT, uncommitted** (brief §13): R1 pass rule + repeat + parent card and
  moves, R2 Check never locked, R4 no clock for the child, the record fixes, the keyboard
  Enter rule. His C15–C55 re-scored: 10 of 42 sittings pass, 32 would repeat (19 time,
  2 first try, 11 both). Gate `kumon-pass-rule-test` (45 checks), photographs
  `docs/screens-2026-11-10/`.
- **Ship order (each step on the owner's word):** commit → apply migration
  `20261110000001_kumon_sheet_pass_rule.sql` through the management API (dry-run as ONE
  statement that rolls itself back, e.g. a DO block ending in RAISE EXCEPTION — a BEGIN
  and a ROLLBACK sent as two calls is not a dry run), record it in
  `supabase_migrations.schema_migrations`, confirm the three columns → push → PR → merge.
  The migration must be live BEFORE the frontend deploys (without `sittings` the try
  count is never stored and the third-try rule never fires).
- After deploy: his next sheet (C56) should write a `sittings` entry; check
  `worksheet_progress` for C56 and the parent card.
- A Fable review (read-only) ran before push; its "fix before push" items are fixed (brief
  §13, "Review"). SHIPPED: migration applied, PR #26 merged (b1b97ba), live 13:40Z.
- **Owner ruling on time (brief §14):** start at 10 min per sheet and come down slowly to
  5 min — built as 5× the run's standard on a new skill, 0.25× less per new sheet, floor 2.5×
  (stacked: 10 → 5 min by C66). Supersedes the 2× limit and the 4-vs-3-min question.
- Later (from the review): gate "End Session" on the child's screen or record an abandoned
  sitting; scope the time half to levels Kumon times; server-side append for `sittings`;
  the recap's empty stars; "0 / 10" per problem; record lesson replays.
- Next: change set 2 (R3 carries) — also fix the C51–C70 header label
  (`sessionManager.ts:344-347` says "×6-9 Tables" on stacked sheets).

## The owner's delegation (2026-11-10)

"You are the expert teacher. And I trust your teaching and UI/UX understanding for students of
different age. Please make necessary updates." → teaching and screen decisions are ours to make
and report; the owner is still asked before every commit, push and merge (house rule), and before
anything that changes his son's position or records by hand.

## Devices (owner, 2026-11-10)

"He uses tablet but other students in future could use computer with keyboard." So:
- His path is the TOUCH number pad (`WorksheetNumberPad.tsx`): digits, one special key (R / ± / "/"),
  Pad, C, ⌫, ✓ Check — no Enter. His placeholder digits come from the locked Check (R2 fixes it).
- Future students may use a PHYSICAL KEYBOARD (`StudyPage.tsx:839` maps Enter → `handleWorksheetInput('enter')`).
- Every input change is built and tested BOTH ways: touch pad and keyboard (digits, Backspace, Enter,
  "r"/"R" for remainders, "/" for fractions, "." for decimals). The photo drivers drive both.
- Keyboard Enter rule, completed in Phase 1: Enter never moves to another problem while the answer is
  shorter than any answer of the problem's shape can be (`getMinAnswerDigits` — done for stacked
  problems in #25; extend to horizontal answers and to the Level D total row, `WorksheetView.tsx:1364`
  skips partial-row problems today), and never right after an "R" with nothing after it. At or above
  the minimum, Enter means "done with this one" (the quiet box's caption already says when a third
  digit is needed). Nothing in this rule may depend on the actual answer.

## Four rulings, decided (the evaluation's recommendations)

**R1 — when a child moves on (Kumon's rule: accuracy AND speed).**
- A sheet PASSES when (a) at least 80% of its problems are right on the FIRST check with no help
  before it (no help-ladder rung, no table reveal, no hint), and (b) the time with the app in view
  is ≤ 2 × the level's standard completion time (`getSctForLevel`, `progressService.ts:63`).
- Not passed → the next session serves the SAME sheet number with fresh numbers; the position does
  not advance (today `StudyPage.tsx:1346` always does `currentWorksheet + 1`).
- After the third non-pass of one sheet → move on anyway, and log it for the parent ("C52: moved on
  after 3 tries — first try 60%, 2.5× standard time"). No automatic step-back; the parent decides.
- Parent controls on the parent progress page: "Move on anyway", "Repeat this sheet", "Go back to C__"
  (a move must go through the app path that clears seen intros — `clearConceptsFromWorksheet` — never
  a bare database update; that mistake cost him the C51 lesson).
- Child copy on a repeat: no score, no clock — e.g. "Same sheet, new numbers — let's make it steady
  and smooth." Never "failed".
- Starts from his next sheet; nothing retroactive. Before shipping, re-score his C15–C55 history under
  the rule and show the owner which sheets would have repeated (principle: re-score a real child
  before changing a pass rule). The 80% label in `progressService.ts:207` must count PROBLEMS, not
  retries (today 10-problem sheets record 10/13, 10/14, 10/15).

**R2 — Check is never locked.**
- Check is enabled as soon as one problem has an answer (today it stays disabled until every
  problem is answered: `WorksheetNumberPad.tsx:353`, `onAllAnsweredChange` → `StudyPage.tsx:2051/2077`).
- A blank problem at a check is "not yet": no try recorded, no hint step, not marked wrong. The page
  still completes only when every problem is resolved.
- Why: on C51–C55, 31 of 70 problems began with a lone placeholder digit kept through several
  checks — almost certainly typed to unlock Check (the touch pad has no Enter key). That polluted
  first-try data and taught "type anything". (Ask the owner once whether he ever uses a keyboard.)

**R3 — he writes the carries.**
- Stacked multiplication (C51–C110; also D1–D10, D51–D70 reviews): carries are NOT filled in from the
  correct answer any more (`computeCarries`, `WorksheetView.tsx:288-316`: today the red carry appears
  the moment a digit is typed and the one over the empty hundreds box IS the hundreds digit).
- The small box above each column is an optional input: tap it, type the carry, the cursor returns to
  the answer row. Answer entry stays ones → tens → hundreds. Carries are recorded, not graded (paper).
- Diagnosis note, like the "from the left" note: a wrong digit equal to the carry above it (his
  17 × 9 → "163") → "Did you add the carry after you multiplied?".
- The C51 lesson already shows writing the carry; keep the worksheet and the lesson identical.
- Level B addition's manual-carry mode stays as it is.

**R4 — no clock in front of the child.**
- Hide the stopwatch and the focus % from the child (`EnhancedTimerDisplay` at `StudyPage.tsx:2014`).
  Keep recording; show time-vs-standard and focus per sheet to the PARENT (parent progress pages;
  `worksheet_progress.avg_focus_score` is never written today — write it).

## Phase 1 — this week (affects him now, C56–C110)

Suggested change sets (each: tests with broken controls → battery → photographs → owner reads the
pathspec → commit / push / merge on his separate words):
0. **Both input paths.** Every change set below is driven on the touch pad AND a keyboard (see Devices).
1. **R2 + R1 + R4 + records + the keyboard Enter rule.** Check unlocked; pass rule + repeat + parent controls + child copy;
   timer hidden, shown to parent; records fixed: `hintLevelReached` is cleared before it is recorded
   (`WorksheetView.tsx` ~1166 vs the save) so it is empty on all 390 times-table rows; sheet totals and
   `practice_sessions.problems_completed` count problems not retries; first-try score stored (a column
   may be needed → migration via the Supabase management API, recorded in schema_migrations);
   `avg_focus_score` written; the stale "Keep going" toast clears when the problem changes.
2. **R3 carries** — the input, the cursor flow, the copy-the-carry note; photographed on a phone width.
3. **Times-table teaching bug.** `FullTeaching.getTeachingSteps` checks `animationId.includes('addition')`
   (`:416`) before multiplication (`:462`), and the times-table id is `multiplication-as-repeated-addition`
   → the teaching screen shows "8 + 2 = 10" then "8 × 2 = 16". He saw it on 31 of 390 times-table
   problems. Replace with a real count-by-the-table teaching (rows ≤ 10, never a giant array).
4. **Best Brains #5 and #6** (`components/CheckRunner.tsx`): a reload after the last answer must show
   "Hand it to Ms. Wren" (today: no button, stuck); answers must stay in local storage until scoring
   SUCCEEDS, and the failed screen offers "Try again" (today: answers discarded, blank re-sit).

## Phase 2 — before the division block (C111; about 7–8 weeks at his pace)

- **Missing factor "8 × ___ = 24" (C111–C115):** `missing-factor-setup` is unmapped → the array
  "8 groups of 3" shows the answer. Give it a non-leaking visual (skip-count by 8 on a number line to
  24 — he counts the jumps), a teaching example with a different factor, and an intro for the format.
- **Exact division accepts any remainder:** `checkAnswer` uses `parseFloat` for numeric answers
  (`WorksheetView.tsx:1031`) → "40 ÷ 8 = 5 R 3" is marked right. Parse quotient and remainder;
  "5 R 0" may be accepted, "5 R 3" not.
- **Division teaching examples share his quotient** (`hintGenerator.ts:49`, `FullTeaching.tsx:316`).
  Generate a similar problem with a different quotient. Use one model of division throughout (the
  multiplication-fact link "8 × ? = 40", which is how Kumon frames it), not "groups of" in one hint and
  "share among" in the next.
- **Remainders (C121):** a lesson like the stacked one (13 ÷ 4 = 3 R 1, the leftover shown, where the R
  key is and how to enter "3 R 1"); hints that mention the leftover and R; a visual that shows the
  leftover. Today the only "tap R" text sits in `problem.hints`, which no worksheet renders.
- **Long division (C161–C200, and D71+):** today one 16 px line, "835 ÷ 6 = ?". Build a bracket
  workspace (the same family as `StackedGrid`): quotient digits above the bracket, multiply / subtract /
  bring-down rows below, entry in the algorithm's order, the "only if needed" logic, the Enter/Check
  rules; a lesson with real bring-downs (the current intro demo 48 ÷ 6 never brings down); step hints.
  The answer is still entered as "q R r". This is its own change set.
- **Emoji walls:** every counting/sharing animation must cap what it draws (a miss on 503 ÷ 5 drew 503
  flowers in a 2,128 px card; D11 arrays reach 6,880 and pushed Chrome to 1.3 GB). Above a small count,
  switch to a number line or skip counting.
- **Intros:** give every Level C concept a `through` run (only C51/C101 have one) and fix the times-table
  intro claims that are never shown (4 × 5 = 5 × 4, "digits add to 9").

## Phase 3 — Level D and beyond (months away)

- D11–D50 partial products on touch (BLOCKER): a short partial product lets the next digit fill the
  empty box (43% of problems); the answer typed straight lands in the working rows; Check stays
  disabled with no message; two boxes highlighted at once (`WorksheetProblem.tsx:574`); C clears only the
  total; tapping a non-active card's total only selects the card. Needs a "row done" control, clear
  row targeting, and a lesson for partial products (replacing the "area model" intro that draws 1,035
  emoji) — hints too (the column-method hints are gated `level === 'C'`, `hintGenerator.ts:489`).
- "/" key at Level D: the pad's one special slot is R on all of D (`StudyPage.tsx:503`,
  `WorksheetNumberPad.tsx:218`) → fraction sheets D131–D150, D181–D200 cannot be typed on a tablet.
- Fraction pictures (`visualAssets`) never drawn; "shade 3/7" sheets have no shape or tool.
- Intros on the wrong sheets (D71/D81, D141, D161; E91, E131, F121; F151–170 none) and with the wrong
  operation (E–F fraction subtraction/multiplication/division animate ADDITION).
- `FullTeaching` builds every fraction demo as addition with 3 operands → "Invalid Fraction" panel; the
  equivalent-fractions teaching text states the answer.
- Decimals F181+: no "." key. 7A `counting_to_5` intro text says "Subtract hundreds…".

## Best Brains leftovers (low; placement screens he no longer uses)

#2 placement result lost on refresh · #3 an enrolled child can be re-placed by deep link · #4 placement
ladder stops at C · #7 Form A reachable any day by deep link · #9 40 px audio target in MicroReteach ·
#10 `passThresholdPct` unread. Seen in his data: on a missed comeback he typed the same answer three
times through both hint steps — consider a "you wrote 77 again; read the question with me" step.

## House rules (binding)

Explain before commit (exact pathspec + contents, wait for the word); commit, push and merge are
three separate instructions; push explicitly `git push origin best-brains-content-engine:best-brains-content-engine`;
squash-merge the PR, then reset the branch onto main and `push --force-with-lease`; migrations through
the Supabase management API and recorded in `supabase_migrations.schema_migrations` (never
`migration repair` blind); decisions as inline tables, never pop-up questions; never send the
child's name to an AI; run the battery serially (4 GB machine); `tsc` at most twice per change set
(disclose extra runs); every screen change rendered in the harness and LOOKED at; every gate has
broken controls that must fire; verify live by grepping the deployed bundle. GitHub: a fine-grained
token for usthrive/MindFoundry is set up in `gh` (it expires; a new one is made at
https://github.com/settings/personal-access-tokens/new — Contents + Pull requests read/write).

Battery (27 runs, serially, from `frontend/`, each `npx tsx <script> [args]`):
bb-verify-packs · bb-family-test · bb-answer-entropy-test · bb-spoken-answer-test · bb-qg11-test ·
bb-qg11-power-test · bb-qg12-test · bb-qg13-test · bb-figure-render-test · bb-answerability-gate ·
bb-animation-test · bb-broken-promise-scan · bb-readability-test · `bb-guessability-test 3000 --all` ·
`bb-cross-week-test --strict` · `bb-probe-and-rank-test --seeds 60 --selftest --strict` ·
bb-lesson-audio-test · kumon-sheet-coverage-test · `bb-screen-contract-test --selftest` ·
kumon-attempt-evidence-test · kumon-help-ladder-test · bb-check-review-test · bb-fresh-form-test ·
bb-comeback-test · bb-week-status-test · kumon-stacked-multiplication-test · kumon-pass-rule-test
(all in `scripts/`) · `src/qa/concept-intro-audit.ts` — 28 runs since 2026-11-10. By-hand photo drivers:
`scripts/kumon-pass-rule-visual.ts`, `kumon-stacked-visual.ts`, `bb-moving-on-visual.ts`, `bb-check-review-visual.ts`,
`kumon-evidence-visual.ts`, `kumon-help-ladder-visual.ts`, `bb-screen-visual.ts`; harness
`scripts/screen-harness/` (screens include `kumon-study` — the REAL StudyPage over an in-memory
database —, `kumon-parent`, `kumon`, `kumon-intro`, `hub`, `strengthen`, `parent`, …).

## Where he is (2026-11-10)

Kumon Level C sheet 56 (stacked 2-digit × 1-digit; the new lesson shows on his next sheet). Best
Brains Level B week 5, Form A 4/6 → a practice round waiting; comebacks working.
