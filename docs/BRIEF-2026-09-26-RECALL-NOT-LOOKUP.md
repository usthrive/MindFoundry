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

## 7. Status — P0 built 2026-09-26 (records only; nothing on screen changes)

Owner said "commit and proceed" after the brief; P0 is the one phase that needs
none of the §6 rulings, so it was built first.

| piece | what it does now |
|---|---|
| `services/attemptEvidence.ts` (new) | a dwell clock that times a problem only while it is the ACTIVE problem, pauses while the app is hidden, and stops at the page's first check (retries are teaching, not first-try time); a ledger of whether the times table was on screen before the first check, and whether the child tapped to uncover the fact; the payload keys |
| `WorksheetView.tsx` (the grid he works in) | keeps the clock, the ledger and every answer tried per problem (keyed by problem id); hands them to the save path; takes the table's visibility and mode as props; the card's reveal reaches it through the ref. **No render change.** |
| `StudyPage.tsx` | all three save paths pass evidence; the grid path writes first-try SECONDS to `time_spent` (was a literal `0`) and the table flag (was never passed); the single-problem path records the same evidence; the sheet's focused time is written against Kumon's SCT (`worksheet_progress.sct_seconds` / `time_vs_sct`, never written before) |
| `progressService.ts` | evidence spread into `hints_used` (no migration); an unmeasured time is stored as NULL, never 0 (`time_spent` is nullable) |
| gate `scripts/kumon-attempt-evidence-test.ts` | 16 checks: clock, ledger, payload, sources (no literal 0, evidence on every save, props and reveal wired, no wall clock); each with a broken control that fires |
| browser proof `scripts/kumon-evidence-visual.ts` (by hand) | drives the real grid in Chrome like a child — thinking pause, one wrong answer fixed on retry, 4 s away mid-problem — at an open-table sheet and a closed-table sheet. Three consecutive runs PASS: every first-try time within 0.5 s of the page's monotonic clock, away time excluded, retry time excluded, both answers kept on the missed problem, table flag correct per run |

Found by rendering, not by any gate: **the wall clock jumps.** On this host the
page's `Date.now()` went 10–12 s backwards mid-run, which would have written
negative or inflated times. All durations now come from `performance.now()`,
and the gate fails any dwell step timed with the wall clock. The first two
driver versions also mis-measured (a fixed threshold, then a start time taken
after the sheet had appeared); the final one checks each time against the
page's own monotonic clock from the frame the problems appear.

**Not verifiable here:** a real sheet worked by the child on his device. After
deploy, the first sheet he works should show non-null `time_spent`, the new
`hints_used` keys, and `scaffoldShownBeforeFirstCheck: true` on ordered sheets.
Query: `select created_at, problem_data->>'question', time_spent, hints_used
from problem_attempts where child_id = '<id>' order by created_at desc limit 20`.

Next: the §6 rulings, then P1 (honest sheet pass) and P5 (post-check review).

## 8. The help ladder — built 2026-09-26 (owner direction)

Owner, after the P0 review: *"The problem is not about simplicity. The goal is how
do we ensure that my son learns and we are grooming critical thinking."* Then:
*"I like the table. It should just not be the only option. There should be a
progression of hints / help that helps him learn."*

This supersedes ruling R4 in §6 (the table is kept; it becomes the last rung).

| rung | 6 × 7 | what it builds |
|---|---|---|
| 1 Think about it | "6 × 7 means 6 groups of 7." | meaning |
| 2 Use a fact I know | "5 × 7 = 35. Add one more 7." | deriving the unknown from the known — the critical-thinking move |
| 3 Count it | "Count by 7s: 7, 14, 21… Count 6 numbers." | a way to finish without the answer |
| 4 Show me the table | the TimesTableCard, unchanged | the answer, when truly needed |

- `components/tables/helpLadder.ts` generates every rung per fact; the easier
  factor is used as "groups" (with the turn-around said aloud: "7 × 4 is the same
  as 4 × 7"). Routes lean only on anchors (×1, ×2, ×5, ×10) or on doubling.
- `components/tables/HelpLadder.tsx`: one rung at a time, the child chooses to
  climb, each rung read aloud, "I'll try it now" closes and keeps his place.
- StudyPage: on every table sheet "🧩 Help me" opens the ladder. On the ORDERED
  sheets (where the table is the lesson) the table keeps its own button; on the
  random and mixed sheets the table is rung 4.
- Recorded: `helpRungBeforeFirstCheck` (0–4) per problem, highest rung before the
  first check, on the grid and the one-problem path. Over days it should fall.
- Gate `kumon-help-ladder-test` (all 169 facts 0..12 × 0..12): rungs 1–3 never
  print the answer, every printed sum is true, counts stop before the answer,
  sentences ≤ 14 words; plus the page wiring. Six broken controls all fire.
- Photographed (`docs/screens-2026-09-26/`, `kumon-help-ladder-visual.ts`): 6 × 7,
  9 × 8, 7 × 4 climbed rung by rung at 430 px; the answer is nowhere on the
  rendered page before rung 4; buttons 48 px. The first photographs showed the
  "Read it to me" labels squeezing each sentence into half the card — the
  read-aloud is now an icon, and the sentences read across.

Not yet built (next, in teaching order): the looked-up or rung-3 fact returning a
few problems later; opening the ladder automatically after a first miss (the
grid's own miss hints still run: a generic "how many groups?" prompt, then an
array prompt, then a worked example of a different fact with a "Skip to Answer"
button — fold them into the ladder so a miss climbs the same steps); "How did
you get it?" moments; the facts map. (Checked: the per-problem `hints` field,
e.g. "Count by 6s: 6, 12, 18, 24" on 6 × 4, does state the answer but is not
shown on these screens.)

Seen while photographing, owner's call: the Kumon page shows the child a running
timer and a "focus score" (`EnhancedTimerDisplay`). Our principles say a young
child should not see a clock; the time is recorded either way.

## 9. Going over the paper (P5) — built 2026-09-27 (owner "go")

The Best Brains half of the report: his two check misses were never shown to him.

- `session/checkReview.ts` (pure): the misses of the LATEST sitting of a form, per
  item the latest answer that is not a review; which are already reviewed. The
  `review: ` answer prefix marks a re-answer — attempt_no cannot, because Form B
  writes attempt_no = its cycle. Plain-word skill names for the strengthening card.
- `components/CheckReview.tsx`: "Looking back · k of n"; the question read again;
  his own answer ("On the last page you chose 47."); one guiding step — the item's
  own first hint (census: none of 1,404 check items' first two hints states the
  answer); another go; right → confirm, not yet → step 2, then the answer with its
  reasoning. Score never changes. Re-answers recorded with the steps he had
  (`hint_rungs_used`), the review prefix, and NO error tag (never feeds the
  parent's miss patterns as a new error).
- Wired: WeeklyCheck and FreshProblems show it right after scoring — rendered
  BEFORE their route guards, because the week leaves the check state the moment it
  is scored — then hand off with `reviewed: true`. StrengthenPlan reads the last
  check's misses and reviews any not yet gone over first (this is where HIS check
  of 26 Sep will come back: verified on his real attempt log — B3-MA-05 "47",
  B3-MA-06 "5", both unreviewed). The skill card says "Comparing numbers" instead
  of "compares by the ones digit" (the adult slug named the mistake, not the skill).
- Gate `bb-check-review-test` (10 checks, broken controls; one control was silent
  on first run — the hand-off check passed if ANY hand-off was marked, and Form B
  has two — tightened to every hand-off). Photographed on his real items
  (`docs/screens-2026-09-26/bb-*`, `bb-check-review-visual.ts`): 20 checks pass on
  the rendered page, including "73 nowhere on screen until both steps were tried".

Seen, not fixed (next):
- The final reveal repeats the last hint and states the number; it does not show
  the working (61 is the middle tray → 63 → 73). No item carries a worked solution;
  adding one is a content-engine change across templates.
- B3-MA-05's picture draws only one of the three piles (36) beside "which is the
  greatest?" — an authored figure that may mislead; to triage in the figure lane.

## 10. Fresh questions for the second re-check — built 2026-10-14 (owner "go")

What the record showed (Level B week 4): all five days genuinely done (Oct 2–12);
weekly check 6/6 but HELD by the stability rule (Day 4 was 40% first try); first
re-check today 4/6 → second strengthening round. The review ran after today's
re-check: one miss fixed after one step; the other missed twice and its answer was
shown. The second round re-checked the SAME six questions — so he would have been
re-checked on a question whose answer he had just been shown.

- `session/freshForm.ts`: cycle 2 draws Form B again from the week's builder at
  seeds derived from the child's pack seed, SLOT BY SLOT: each slot takes the first
  question that is new this week (prompt and numeric surface differ from Form A and
  the first re-check) AND uses the same template as the first re-check's slot (same
  skill, new numbers). Ids re-minted past the first set (B4-MB-07..12). Stable per
  child. Fallback to the first set only where no builder exists (A15, a fixture).
- Measured: 348 of 351 week × seed cases get a fresh set (the 3 misses are A15);
  worst case 17 ms. Whole-set retries failed on small Level-A spaces (A12) — slot by
  slot fixed it. The gate caught a wrong assumption on first run: A24's slot 6 changes
  template with the seed, so slots are now template-matched.
- His next re-check (pack seed 645474193): six new questions; the one whose answer he
  saw ("square 8, back 1, then turns") becomes "square 9, back 3, then turns".
- Wired: FreshProblems serves `formBForCycle` for the week's cycle; StrengthenPlan's
  review can find the second set's questions. Real screen in the harness: round 1
  opens "Ben stands on square 12…", round 2 "Mia stands on square 5…"
  (`docs/screens-2026-10-14/`).
- Gate `bb-fresh-form-test` (117 weeks × 3 seeds; fresh / blueprint / ids / stable /
  cycle 1 unchanged / sources; six broken controls fire).

## 11. Moving on, coming back, and "where the week is at" — built 2026-10-15 (owner)

The owner asked what happens after the "a teacher will help" step. Verified in code:
nothing. The RPC set `escalated` + `placementRecheckRequested`; nothing ever read the
flag, no teacher was notified, no code left `escalated`, the hub had no button and
the next week only opened from a PASSED week — so a second missed re-check stopped
Best Brains for good. The parent report said "a teacher from our team is stepping
in". Owner rulings, same day: the bar stays 5 of 6 (80%, already the rule since
2026-08-10); a child may miss for reading, not maths (his week-4 miss was a 31-word
question the app itself tagged "didn't understand what was asked"), so the week
must not stall — move on, and bring the concept back later so it is understood and
not forgotten; and "include a call-out … what is going on and what is needed to move
forward so that he can show me".

- **Check questions read themselves aloud at band B** (CheckRunner; the review and
  the comebacks too). A was already; C still taps.
- **A closed week moves on.** `escalated` stays the state (routing, guard trigger and
  report CHECK untouched) but now means closed: the hub opens the next week the day
  after, as for a pass. Child copy `movedOn` replaces the teacher promise; the parent
  label is "Moved on · practice continues"; the mastery map says "Moved on · missed
  questions coming back". Migration `20261015000001` patches the report's sentence in
  place (asserted count; dry-run in a rolled-back transaction on the live DB:
  replaced, apostrophe intact, threshold 80 intact).
- **Comebacks** (`session/comebacks.ts`): every question missed on any check at the
  level comes back as a warm-up with new numbers — 2 days after the miss, then 7,
  then 21 — until right on the first try with no step showing, three times in a row
  on different days. A miss goes back to 2 days. At most 2 a day; under-way ones
  first, then newest misses. Derived from the attempt log (no new table): one entry
  per (week, slot); review re-answers never count. Questions come from the slot's own
  template at derived seeds (A14/A16/A24/B19/B21 needed up to 51 tries → 64);
  where a week's space for a skill is used up (A2, A12, A22, B22 by round 2–3) an
  older question comes back — never the missed one, never last round's; A15 (no
  builder) brings the missed one back. Ids `B4-CB-05-2` dodge every other reader of
  the log. Served by `screens/Comebacks.tsx` (the review component, `when="comeback"`)
  before Days 2–5; it forwards straight on when none is due or the log cannot load.
  Logged under the origin week, day null, no error tag.
  His backlog at rollout: 13 (B1 ×4, B2 ×4, B3 ×3, B4 ×2); week 3's come first.
- **"Where the week is at"** (`session/weekStatus.ts`, `components/WeekStatusCard`):
  on the hub (and the closed week's strengthen screen) whenever a week has not moved
  on after Day 5 — what happened (counts, never a percent), what moving on needs
  ("5 of 6 right on brand-new questions"), what is next and when, then "Show this to
  a grown-up": dates and scores, the held day, the questions missed with HIS answers,
  one thing to try by mistake type, and the pack's own question to ask plus "How did
  you get 6?". It replaced "Still strengthening: <the mistake's adult slug>". The
  parent home gets the same facts in one line, plus the comeback list.
- Found on the way: the near-miss line said "just the renaming step is wobbly" in
  EVERY week — SCREEN-SPECS row 3's worked-example skill, shipped verbatim. Now
  generic; the card names the real skill.
- Gates `bb-comeback-test` (22 checks: his real log, the schedule, the daily cap,
  2,808 slots × 3 rounds over 117 weeks × 2 seeds, isolation, sources; ten controls)
  and `bb-week-status-test` (15 checks; nine controls). Photographed on his real
  record (`bb-moving-on-visual.ts`, harness `real=b4`, fixture
  `scripts/screen-harness/his-log.ts`; the closed week's second re-check is
  hypothetical): `docs/screens-2026-10-15/`.

Not changed: the Day-4 stability rule (held a 6/6; kept — it catches a lucky check
day; whether it should look past reading-type misses is open). JourneyMap still
shows a closed week as "strengthening".

## 12. Stacked multiplication is taught, and the sheet stops tripping him — built 2026-11-09 (owner "go")

The owner: on the Kumon stacked multiplication sheets the third box shows even when
it is not needed, and nothing teaches how to do this kind of multiplication. Read
from his record (C51–C55, Nov 4–7, 70 problems): first-try right 20/70 (29%); 31 of
the 70 began with a stray single digit; "665" for 13 × 5; "69" for 96, "54" for 45;
real misses were carry errors (17 × 9 → "163", 18 × 8 → "164", 19 × 9 → "181") and
20 × 5 → "105". Causes, all verified in code and reproduced in the harness:

- No lesson. `concepts_seen` had "multiplication_2digit_by_1digit" from **Sep 21**
  (first time at C51). The Sep 27 move back to C15 was a direct database change,
  which skipped the app's own `clearConceptsFromWorksheet`, and "seen" is forever.
  The intro itself was an optional array animation ("break apart"), not the method
  the sheet uses. After a miss, every Level C multiplication got times-table help: "how
  many groups of 5?", a 28-row array, repeated addition. The step-by-step
  "multi-digit-multiplication" teaching id was unmapped and Level D-only.
- The third box: 3 columns for every 2-digit × 1-digit (deliberate: width must not
  leak the answer's size), but after two digits the cursor sat in it, highlighted.
- Enter: on a stacked problem, a digit + Enter (the times-table habit) jumped to the
  next problem — the next digit landed there.
- Boxes fill from the ones; typing a number as it reads reverses it.
- Found on the way: the Level B "carry it yourself" / "regroup it yourself" pop-ups
  are on for every Level C+ sheet; a fresh device met a 43 − 18 card over C51.

Built:
- `services/stackedMultiplication.ts` (pure): frames of the column method, the guided
  prompts (multiply; then ADD the carry, on its own), the setup sentence, the
  backwards-digits test. `StackedMultiplicationSteps` draws it as the sheet does
  (same boxes, red carries, dashed "only if needed" box);
  `StackedMultiplicationLesson`: 23 × 4 and 28 × 5 worked, then his turn on 17 × 4
  (a miss gets a nudge, never the number; a second, the number and the step).
- Intros: both stacked concepts → `stacked-multiplication`, version 2. "Seen" is now
  recorded per content version (`seenKey`: "…@v2"; version-1 records count as before),
  and a concept may carry `through` (C51–C100, C101–C110): an unseen intro shows on
  ANY sheet of its run. His next sheet (C56) opens with the lesson; "💡 Show me how"
  replays it.
- Hints: Level C stacked problems → column method (micro: where to start, no answer;
  visual: his problem, setup only; teaching: a similar problem frame by frame).
- Sheet: the optional column is dashed and quiet even with the cursor in it, with
  "Only if a carry is left. If not, you're done."; Enter never leaves a stacked answer
  shorter than any answer of its shape can be (`getMinAnswerDigits` — leaks nothing;
  never holds a complete answer, checked over 7,920 products and ~30,000 sums);
  "You wrote it from the left…" when the answer is the right digits reversed; the Level
  B pop-ups only on pages that have stacked addition / subtraction.
- Gate `kumon-stacked-multiplication-test` (25 checks, 12 controls); photographs
  `docs/screens-2026-11-09/` (`kumon-stacked-visual.ts`, 27 rendered-page checks).

Next (agreed step 2): every concept's intro read against what its sheets ask —
Levels C and D first (D11/D41 teach an "area model"; the sheets are stacked with
partial products). Seen, not changed: the sheet fills each carry in from the real
problem as soon as a digit is typed (he still wrote "163" with the 6 shown).

## 13. A sheet moves on when it is passed; Check is never locked; no clock for the child — built 2026-11-10 (owner delegated)

The owner delegated the teaching and screen calls (rulings R1–R4 in
`docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md`) and asked for Phase 1 change set 1:
Check never locked, the pass rule with repeat-the-sheet and parent controls, the timer
hidden from his son and shown to him, the record fixes — his C15–C55 history re-scored
first.

**His history under the rule** (8 in 10 first try with no help, AND ≤ 2 × the standard
time for the run — 90 s a page for the times tables, 120 s for C51+; his records since the
Sep 27 move-back; filler digits set aside, as R2 removes them; pages the app re-served
count in the time allowed): **10 of 42 sittings pass** (C18, C19, C23, C26, C28, C32,
C36, C42, C45, C55); **32 would have repeated** — 19 on time alone, 2 on first try alone
(C41, C46: facts uncovered on the table), 11 on both. The reading: he gets the facts right
but works them out instead of recalling them (C30: 974 s for ten facts); counting only
first-pass time does not change the picture. Nothing is retroactive.

Found on the way (all verified in code or on the rendered page):
- **A reload re-served a page and double-counted it.** The restore put the saved page in
  slot 1 whatever page it was, seeded the totals from that page's own answers and added
  them again when it resolved, then served page 2 again: C22/C29/C40/C47 saved a page
  twice, C35 three times, and "10/13, 10/14, 10/15" are this, not retries (C17: 3 restored
  answers + 5 + 5). The audit's "totals count retries" reading was wrong.
- **An unchanged wrong answer was re-graded at every check** and climbed the hints to the
  teaching screen (C20 3 × 5: "35" ×4 while he checked the others) — with Check unlocked
  this would have been every check.
- **A blank on a checked page is drawn red ✗** (`isSubmitted` was the page's flag).
- **The sheet clock ticked on the wall clock** and ran during the new-concept lesson.
- **Finishing a sheet, or Save & Exit, wrote over a grown-up's move** made on another
  device (old sheet + 1 is not a "decrease"). **Edit Child changed the sheet with a bare
  update** — the exact path that cost him the C51 lesson.
- My own restore fix dropped the page number (the restore copies fields one by one) —
  caught by the reload photograph, not by any gate.

Built:
- `services/sheetPass.ts` (pure): the rule (`decideSheet`), first try unaided (a help rung
  or a tap to uncover is help; a table simply open on an ordered sheet is not), the
  sheet's ledger BY PLACE ("page:index", so a page shown twice is still ten problems), the
  run of tries (trailing repeats since anything else), the record (`mergeSitting`:
  `status` completed = passed, totals out of problems, `avg_focus_score` written), and the
  words. `services/sct.ts`: the standard time per run of sheets (top of the Kumon
  reference range; C51–100 = 120 s, C101–110 = 150 s), re-exported by progressService.
- R1 in `StudyPage`: every path (grid, one-at-a-time, tap) records first checks; the end
  of a sheet is judged once (`concludeSheet`) and recorded (`recordSheetSitting` →
  `worksheet_progress.sittings`); a pass or the third try moves on, otherwise the same
  sheet again — the grid remounts with `variant` = times done before, and a times-table
  sheet asks the same ten facts in a new order (`repeatPlace`, a bijection; ordered sheets
  keep their walk and their copy says "Same sheet again"). Child words: a pass names a
  count ("🎉 C56 done! ✅ 9 of 10 right the first time · Next: C57"), a repeat "Same
  sheet, new numbers — let's make it steady and smooth." (no score, no clock), the third
  try "Time for a new sheet: C57." A repeated sheet carries the line on the sheet itself
  (🔁, read-aloud). A grown-up's move made while the sheet was open stands.
- Parent: `components/parent/KumonSheetsCard` on the progress page — each sitting's first
  try, time against the standard, focus (amber where it fell short), the "C52: moved on
  after 3 tries — first try 60%, 2.5× standard time" line, and "Move on anyway" /
  "Repeat C__" / "Go back to C__", each behind the parent check and through
  `services/kumonPosition.ts` (clears seen intros on a move back, logs the move, ends the
  run). Parent Mode's jump and Edit Child use the same path.
- R2 in `WorksheetView`: `problemsToGrade` — Check is on as soon as one answer is new; a
  blank is "not yet" (no try, no hint, not wrong, not red); an unchanged answer is not a
  new try; after a right check the cursor moves to the next problem; "Keep going — N more
  on this page."
- R4: the stopwatch and focus score show only in Parent Mode; "Welcome back!" no longer
  reads out the time away; the idle warning has no countdown (`showCountdown={false}`).
  The clock ticks on `performance.now()` and holds while a lesson is open.
- Records: `hintLevelReached` is the highest hint reached (was cleared first — empty on
  all 390 times-table rows); tried answers, checked answers and the page number live in
  the page state, so a reload keeps them; the restore puts the page back where it was
  with the totals from the pages before it; the "Keep going" nudge leaves with its
  problem. Keyboard Enter: never off an answer shorter than any answer of its shape
  across the line (7 × 10 → 2 digits; a missing factor → 1), the Level D total row
  (81 × 63 → 3), or "13 R".
- Migration `supabase/migrations/20261110000001_kumon_sheet_pass_rule.sql`:
  `worksheet_progress.first_try_correct`, `problems_total`, `sittings jsonb` (additive).
  **Not yet applied** — it must be applied (and recorded in schema_migrations) BEFORE the
  frontend deploys, or the try count is never stored and the third-try rule never fires.
- Gate `scripts/kumon-pass-rule-test.ts` (45 checks, 23 broken controls; his 42 sittings
  as a numbers-only fixture reproduce 10 / 32 and 19 / 2 / 11). Harness: the REAL
  StudyPage (`screen=kumon-study`, auth stub, the Supabase stub as an in-memory database
  when `__sbApplyUpdates`) and the parent card (`screen=kumon-parent`). Photographs
  `docs/screens-2026-11-10/` by `scripts/kumon-pass-rule-visual.ts` (touch pad at 820 px,
  keyboard at 430 px; 41 rendered-page checks, all pass).

Seen, not changed (next): carries are still drawn from the true answer (R3, change set 2);
the C51–C70 header still says "Multiplication ×6-9 Tables" / "All Times Tables Mixed"
(`sessionManager.ts:344-347`); at 430 px "Show me how" runs off the header; the cohort
"Great practicing!" card covers the end-of-sheet message; the first-try dwell clock is
not kept across a reload (first-try seconds are null on a restored page); an empty
session still opens after every sheet.
