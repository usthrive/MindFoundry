# BRIEF 2026-09-26 — Recall, not lookup: make the app know what the child knows

Repo: `/home/usthr/Penta_University/Math_Tutor/MindFoundry`, branch
`best-brains-content-engine` == `main` at `14e1087` (verify with `git log` first;
other sessions use this branch). Written by the session that shipped PRs #15–#19;
read this in full before touching code.

## 0. Why this exists — the owner's words, 2026-09-26

> "My son did Best Brains, wrote a wrong answer, and it didn't correct it or say
> the answer was wrong. And in the Kumon multiplication module he reached 50
> sheets but didn't understand anything, because he gamed the system by looking
> at the table. I want him to think critically and build this capacity, not
> cheat the system. Think like an amazing tutor who uses the Kumon approach but
> brings analytics aptitude."

The single defect under both reports: **the app records "finished", not "knows".**
It cannot tell recall from lookup, first-try from fifth-try, fluent from slow.
Everything below is measured from the production database (project
`mjooqyjofzsavuqqorcg`) for the owner's son (child
`018b019c-698a-44e1-a51b-70624072cfdf`, age 7).

## 1. Kumon lane, Level C multiplication — what the data says

Every Level C multiplication attempt, sheets 11–50 (13 Aug – 21 Sep):

| measure | value | meaning |
|---|---|---|
| answers recorded | 419 | — |
| recorded correct | **419 (100%)** | the stored result is the LAST try, so every sheet looks perfect |
| right on the first try | **305 (73%)** | the real accuracy; a Kumon instructor would not have advanced him |
| table peeks recorded | **0** | the peek flag is never set on the sheets where he looked (below) |
| per-question time recorded | **0 s on all 419** | the Kumon mastery signal — speed — does not exist in the data |
| sheets with first-try ≤ 50% that still passed | 13, 14, 15, 16, 17, 24, 28, **29 (0 of 15)**, 30, **45 (1 of 9)** | passed anyway |

Why each number is what it is (code-verified 2026-09-26):
- **Retry until right, then pass.** A sheet completes at `score >= total * 0.8`
  (`frontend/src/services/progressService.ts:199`) where `score` counts the final
  outcome of each problem, so guess-and-retry reaches 10/10.
- **The table is simply open on the first sheets of every table.**
  `getTimesTableSupport` (`services/generators/elementary-advanced/level-c.ts`)
  returns `support: 'open'` for the `ordered` beat, `'tap'` for random, `'covered'`
  for mixed. The peek flag is set only by the card's `onReveal`
  (`pages/StudyPage.tsx:1901`), so an always-open table is read with no record.
  Looking is invisible exactly where it happens most.
- **Time per question is written as 0.** `problem_attempts.time_spent` is 0 on
  every row; `worksheet_progress.sct_seconds` / `time_vs_sct` are null. The
  session total exists; the per-fact time does not.
- Signature of the gaming, visible even without peek or time data: runs of
  first-try misses corrected on the second try (sheet 29: 0/15 first try, 15/15
  final). That is either guessing through the answer space or reading the table.

What a Kumon instructor would say: he has not mastered ×2–×9. Kumon's rule is
**100% on the first attempt within the standard completion time**, and a sheet
is repeated until both hold. The app has neither half of that rule.

## 2. Best Brains — the "wrong answer, no correction" report

Level B week 3, 26 Sep 16:50–16:56: the **weekly mastery check** (Form A), not a
practice day. He got 4 of 6; below the 80% pass, so the week moved to
`near_miss_cycle1` (strengthening round next).

| item | question | his answer | right answer | tag |
|---|---|---|---|---|
| B3-MA-05 | "36, 54 and 47. Which count is the greatest?" | 47 | 54 | concept-misconception |
| B3-MA-06 | two-step tray problem (30, 61, 77; +2, then +10 on the middle tray) | 5 | 73 | task-comprehension |

- **By design**, the check holds per-item feedback (`components/CheckRunner.tsx`
  header: every answer gets the same neutral acknowledgement) so the check
  measures rather than teaches. That part is right.
- **The defect:** nothing after the check ever shows him WHICH answers were wrong
  or why. `StrengthenPlan` / `MicroReteach` read only the dominant error tag.
  A tutor always goes over the paper after a test.
- **The diagnostic he gave us:** 47 has the biggest ONES digit. This week's whole
  concept is "compare by the tens first", and four days earlier he answered the
  abstract version correctly ("Always, sometimes or never: the count with more
  ones is the greater count" → sometimes). He can say the rule and does not yet
  use it. That gap — knowing a rule vs applying it — is exactly what the review
  step must surface.
- The AI explanation review (PR #19) has **never been called** — no rows in
  `bb_explanation_reviews`; his Day 5 explanation item was answered before it
  shipped. It is live and untested.

## 3. The tutor's model — what "knows" means (proposed; owner rules in §6)

A fact or skill is **known** when, across **at least two separate days**, the child
answers it **right on the first try**, **without the table**, **within its fluency
time**. Everything else is "learning". Per band the fluency times are an owner
ruling (§6); starting proposal: ×-facts 3 s (Kumon C ≈ 3 s/fact), Best Brains
first-try only (no clock — band laws forbid timers at A, and B/C practice is
untimed).

Principles, each answering a failure above:
1. **First try is the measurement; retries are the teaching.** Record both;
   pass on the first.
2. **Scaffolds are visible, costly and fading.** The table is a tool with a price:
   every look is recorded, the looked-up fact returns 3–5 problems later without
   the table, and a sheet with looks cannot pass.
3. **Speed is recorded per fact, never shown as a race.** A 7-year-old never sees
   a timer; the parent and the scheduler do.
4. **Mastery is per fact, not per sheet.** 64 core facts (×2..×9); each has a
   state: new → learning → slow → fluent. The next sheet is built from the
   weakest facts (spaced retrieval), not from the next sheet number.
5. **Strategies, not rote.** Every ×-fact has a thinking route taught once and
   asked back occasionally: doubles (×2, ×4, ×8), fives-then-adjust (×6 = ×5 + one
   more group), ×9 = ×10 − one group, turn-around (7×3 = 3×7). "How did you get
   it?" on a sample of answers, read by the existing Ms. Wren reviewer.
6. **After every test, go over the paper.** Missed items come back as a short,
   no-score review: his answer, what the question asked, one guided step.
7. **The parent sees knowing, not finishing.** A fact map (fluent / slow /
   learning / looked-up) and one line of what to try this week
   ([[mindfoundry-parent-like-instructor]]: offer the move, never assign it).

Gaming signatures the system must catch (and respond to kindly, never punish):
answer within 1 s then corrected; a look immediately before a correct answer;
cycling through answers (3+ tries); first-try accuracy collapsing on mixed sheets
while ordered sheets stay perfect.

## 4. Build plan — one lane at a time, each photographed and gated

| phase | what | where | proves itself by |
|---|---|---|---|
| **P0 Instrument** (no child-visible change) | write per-question `time_spent` (ms from display to first answer); record `first_try_correct`, `tries`, `table_open` (true whenever the table was visible, not only on tap) per attempt; backfill nothing | StudyPage, progressService | a new gate asserting every attempt row carries the fields; one real sheet shows non-zero times |
| **P1 Honest sheet pass** | a sheet passes on FIRST-try ≥ 90% with 0 looks; retries still allowed and taught; a failed sheet is repeated (Kumon) | progressService, StudyPage | photograph the end-of-sheet screen; data test on the son's history shows sheets 13–17, 24, 28–30, 45 would not have passed |
| **P2 Multiplication check-in** | a 2-minute, no-table, 64-fact diagnostic (not called a test) that seeds the fact map and places him on the weakest table | new screen in the Kumon lane | the map for his account; a re-placement recommendation the OWNER approves before it moves him |
| **P3 Fact map + returns** | per-fact states; the looked-up / slow fact returns within the sheet and seeds the next; table support by fact state, not by sheet beat | level-c.ts, StudyPage, TimesTableCard | the kumon-sheet-coverage gate extended with return and fade laws; photographs at open/tap/covered |
| **P4 Strategy moments** | one thinking route per fact family; "how did you get it?" on ~1 in 8 answers via the Ms. Wren reviewer | TimesTableCard, ai-service reviewer reuse | eval fixtures for strategy explanations |
| **P5 Best Brains check review** | after hand-in: "Let's look at two" — each missed item, his answer, the question re-read, one guided step; no score change; then the strengthening round | CheckRunner / WeekResolve | photographs of the review at bands B and C; the seam gate asserts every missed check item is reviewable |
| **P6 Parent view** | fact map + "knows vs finished" line on the parent dashboard; Best Brains "In their own words" already exists | parent screens | owner looks at it with real data |

P0 and P5 are the fastest wins and have no pedagogical risk; start there.

## 5. How work is done here (house rules — binding)

- Explain-before-commit: exact pathspec + approval before `git commit`; commit,
  push, merge are separate instructions; push the branch explicitly; after a
  squash-merge, reset the branch onto main and push with `--force-with-lease`.
- Netlify **auto-deploys `main`** ~2 min after merge; verify by grepping a string
  literal in the live chunk (the screens live in the lazy `FoundryRoutes-*.js`;
  the Kumon lane lives in the entry or its own chunk — find it first).
- **Migrations:** `supabase db push` refuses (remote history ≠ repo folder).
  Apply one migration's SQL through the management API (`POST
  https://api.supabase.com/v1/projects/mjooqyjofzsavuqqorcg/database/query` with
  the token in `~/.supabase/access-token`) and record its version in
  `supabase_migrations.schema_migrations`. Never run `migration repair` blind.
- Render and look: the screen harness (`frontend/scripts/screen-harness/`,
  `bb-screen-visual.ts`) photographs Best Brains screens; the Kumon StudyPage has
  no harness yet — building one is part of P1.
- Battery: 19 scripts from `frontend/`, serially (4 GB machine); tsc at most twice.
- Routing: Fable for design and verdict, Opus sub-agents for building; re-verify
  every agent claim.
- No popups: decisions as inline tables.

## 6. Owner rulings needed before P1 (bring these first, with a recommendation)

| # | ruling | recommendation |
|---|---|---|
| R1 | Pass rule for a Kumon sheet | first-try ≥ 90% and no looks; Kumon's 100% is too harsh for a 7-year-old on the app |
| R2 | Fluency time per fact | 3 s for ×-facts, recorded only, never shown to the child |
| R3 | What happens to his 50 "completed" sheets | keep the record; the P2 check-in decides where he really is; the owner approves any move back |
| R4 | Table on the first sheet of a new table | open on sheet 1 only, then tap-to-look with the look counted |
| R5 | Best Brains post-check review | show the missed items after hand-in, before the strengthening round |
