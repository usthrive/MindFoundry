# BUILD-PLAN — school-math, from the engine to a module the child uses (Phases 4.5–6)

**Written 2026-11-18, 09:20 EST (from `date`), by the engineering lead.**
**Status:** plan only, no code. Implements `ENGINE-SPEC.md` and `TEST-PREP-SPEC.md` against the
module contract (HANDOFF §7). Branch `best-brains-content-engine`. No child's name anywhere.

**House rules that shape every stage** (HANDOFF §11; KUMON handoff "House rules"):
- **Explain before commit**: the exact pathspec and contents, then the owner's word. Commit, push and
  merge are three separate words (O7). Push: `git push origin
  best-brains-content-engine:best-brains-content-engine`; squash-merge the PR, then reset the branch
  onto main and push with `--force-with-lease`.
- **Migrations** through the Supabase management API only (`supabase db push` refuses: remote history
  differs from the folder): a **dry run as ONE statement that rolls itself back** (a `DO` block ending
  in `RAISE EXCEPTION`; a BEGIN and a ROLLBACK sent as two calls is not a dry run), then the apply,
  then the version recorded in `supabase_migrations.schema_migrations`, then the columns confirmed.
  Never `migration repair` blind. A migration is live **before** the frontend that needs it deploys.
- **4 GB machine**: one or two agents at a time; the battery runs **serially**; `tsc` at most **twice
  per change set** (extra runs disclosed); the 29 existing runs stay green and every new gate joins
  the battery with a broken control seen to fire; existing debt is a ratchet.
- **Every screen change** is rendered in the harness (`frontend/scripts/screen-harness/`) and looked
  at; every audio change gets sample files the owner listens to.
- **Verify live** by grepping the deployed bundle (mindfoundry.netlify.app) for a string literal of the
  new lazy chunk; Netlify deploys `main` about two minutes after a merge.
- **Fan-out workflows run only on the owner's word.** Fable makes verdicts and reviews; Opus builds
  (L18; DECISIONS M4). Fable is paused until **2026-11-20 18:00 ET** (M8).
- **Ask first** before anything that changes the child's records or costs money.

---

## The stages at a glance

| # | Stage | Change sets | Rough size | Battery after | Child sees anything? |
|---|---|---|---|---|---|
| 0 | Register the module; `sm_` tables + migration | 1 | ~250 lines TS, ~300 lines SQL; 1 session | 29 → 31 | no (card hidden, route inert) |
| 1 | Engine core + G2-U04 exemplar through both gates | 2 | ~3,500–4,500 lines (engine ~1,800, U04 templates ~1,200, gates ~1,200); 3–4 sessions | 31 → 37 | no |
| 2 | New figures and inputs, with gates (touch and keyboard) | 2–3 | ~4,000–5,000 lines; 4–6 sessions | 37 → 40 | no (harness only) |
| 3 | The child's day flow | 1–2 | ~2,000–2,500 lines; 3–4 sessions | 40 → 43 | **yes, on the owner's GO-LIVE word** |
| 4 | Chapter check + review | 1 | ~800 lines; 1–2 sessions | 43 → 44 | yes |
| 5 | The parent page | 1 | ~1,500 lines; 2–3 sessions | 44 → 45 | parent only |
| 6 | Test prep | 1 (+ a migration) | ~1,500 lines + ~120 lines SQL; 2–3 sessions | 45 → 47 | yes |
| 7 | Fan-out of the other 13 Grade 2 units | one per wave of 2 units | ~700–900 lines a unit; 10–15 sessions | 47 (units join existing runs) | each unit as it passes |
| 8 | Persona tests, the mock in the school's format, photographs | 1 (docs + fixes) | 2–3 sessions | 47 | — |

A **session** here is one agent working one change set to its gates; sizes are estimates from the Best
Brains build (its `validator.ts` ~1,100 lines, `types.ts` ~700, one Level-D blueprint ~110–170).

---

## Stage 0 — Register the module, and its tables

**Files touched**
- `frontend/src/modules/core/contract.ts` — **new kinds, never an overloaded one** (HANDOFF §7):
  `ModuleId` += `'school-math'`; `LevelDescriptor.unitKind` += `'unit'`; `PlacementDescriptor.kind` +=
  `'parent-intake-review'` (DD24: intake → 2-day review → entry check / probe); `SessionGeneratorDescriptor.kind`
  += `'unit-day-generator'`; `ProgressSchemaDescriptor.kind` += `'sm-skill-state'`;
  `ParentReportSchemaDescriptor.kind` += `'sm-skills-map'` (cadence `'continuous'`, no acknowledgement).
- `frontend/src/modules/core/registry.ts` — the `school-math` entry: levels = Grades 1–5 with unit
  counts 13 / 14 / 12 / 10 / 10 (CURRICULUM-MAP), `status: 'in-development'`, `entryRoute:
  '/school-math'` (working id, renameable before release; DECISIONS M3), `conceptCatalog()` from the
  stage-1 catalogue (returns `[]` until then, honestly).
- `frontend/src/modules/school-math/index.ts`, `SchoolMathRoutes.tsx` (a lazy chunk with one inert
  "coming soon" route for the parent only), `App.tsx` (mount `/school-math/*`), the module-card list
  (hide `in-development` modules from the child's card list).
- `supabase/migrations/20261119000001_sm_module_schema.sql` (date set when written):
  - `sm_enrollment` (child, grade, settings: N per lesson / practice day, session days, weekends,
    read-aloud; intake: book, the class's chapter, units ticked hard, wants; DD24);
  - `sm_unit_state` (child, unit, state, lesson days done, entry-check pairs, "already knows" marks,
    check sittings);
  - `sm_day_state` (child, date, day kind, **manifest** of slots — template id, seed, role — frozen at
    day start, place k; TAD §3.20 resume);
  - `sm_item_attempts` (child, unit, lesson, item id, template id, seed, role, skill ids, per-part
    results, first-try correct, tries, every answer tried, first-try ms on the monotonic clock,
    scaffold visible, ladder rung 0–4, model rung, self-check differed, strategy chip, misconception
    rule, day kind, plan id, created at — TAD §8 plus METHODOLOGY §7);
  - `sm_skill_state` (a rebuildable projection: state, the two qualifying days, practice days since a
    clean day, fluency ms, stretch, parked at);
  - `sm_check_sittings` (child, unit or mock, form, seed, section counts, category rows, created at);
  - `sm_explanation_reviews` (the `bb_explanation_reviews` shape with `unit_id`).
  - RLS on every table, the `bb_` pattern (`children.user_id = auth.uid()`), four policies each.

**Reuse:** the `bb_` schema's RLS and trigger patterns; the registry's declarative style.
**Gates added (2 runs):** `sm-contract-test` (each module's descriptor uses only its own kinds; broken
control: a fixture module that reuses `'bb-week-state'` must fail) · `sm-schema-test` (every table in
the migration is `sm_`-prefixed, has RLS enabled and four policies; broken control: a fixture SQL table
without RLS must fail).
**Photographs:** the module card list with the new module hidden; the parent's "coming soon" route.
**Owner's word:** commit · push · merge · **migration apply** (dry run first, shown to the owner;
nothing changes for the child — empty tables) · the module's neutral product name (open; M3) can wait
for stage 3.

---

## Stage 1 — Engine core and the G2-U04 exemplar through both gates

**Change set 1a: the engine.** `frontend/src/modules/school-math/`
- `types.ts` (`SMUnit`, `SMLesson`, `SMSkill`, `SMItem` with parts, roles, rungs; ENGINE §4.1–4.2);
- `curriculum/grade2.ts` (the 14 units, 71 lessons, skills, school-chapter lookup,
  `lessonExampleNumbers`), `curriculum/examMap.ts`, `curriculum/methodLedger.ts` (parsed rows);
- `engine/registry.ts`, `engine/lib/subtraction.ts` (+ `addition.ts` stubs for U02 returns),
  `engine/lib/misconceptions.ts` (ENGINE §3.4, every rule with `verifyFor`), `engine/lib/choices.ts`
  (display order + numeric rank, ENGINE §3.5), `engine/validator.ts` (wraps the Best Brains QG gates on
  `SMItem`; the §3.3 validations on the QG-5 enablement list);
- `engine/assemble.ts` (lesson day, practice day, entry check, chapter check, mock), `engine/scheduler.ts`
  (returns, comebacks, previews, `weakness()`), `engine/mastery.ts` (skill states, stall rule, fluency).
**Change set 1b: the exemplar.** `engine/units/g2u04.ts` (the ENGINE §7 templates, entry check, the
proposed G2-U04-CK), and the U03-L6 template the check borrows.
**Reuse (imported read-only):** `best-brains/generator/rng.ts`, `surface.ts`,
`templates/lib/format.ts`, `guard.ts`, `validator.ts` gate functions, `answers.ts`; the
`CONTENT-STYLE-GATE` protocol for the authenticity run.
**Gates added (6 runs):** `sm-verify-units` (200 seeds; QG-1/3/4/5/11/12/13 on `SMItem`; broken
control: a corrupted `digit-boxes` key must fire, proving the new validation is enabled, L50) ·
`sm-exam-value-test` (ENGINE §6.1, both tiers, enablement list printed; its three broken controls) ·
`sm-content-rules-test` (choice rank, shape hint, ladder, lesson-example reuse, blind habit, answer
entropy, readability — one result line and one broken control each, ENGINE §6.8) · `sm-ledgers-test`
(coverage, cross-unit context, prior-unit, **exam coverage** §6.6, **method ledger** §6.7 — each with
its broken control) · `sm-no-name-test` (content and payload halves, §6.5) · `sm-spoken-answer-test`
(prompt and ladder lines now; figure `spoken` lines join in stage 2).
**The authenticity gate** (ENGINE §5.2–5.3) runs once on Fable after 2026-11-20 18:00 ET: ACCEPT plus an
adversarial re-check with no hard-gate FAIL, its planted broken unit REJECTED. Before it: the **Fable
curriculum architect signs off the proposed G2-U04-CK** (ENGINE §7.4). After it: a teacher-persona run
with a code recompute, 0 mismatches (ENGINE §7.5).
**Photographs:** none (no screen). A dump of one generated lesson day and one practice day at two seeds
goes in the change set's notes, for the owner to read.
**Owner's word:** commit · push · merge (inert code: no route serves it).

---

## Stage 2 — The new figures and inputs, with their gates

**Order (what G2-U04 needs first):** N-F5 + N-I1 (column with digit boxes and the regroup row) → N-F9 +
N-I3 (blocks on the chart, open a ten / a hundred) → N-F3 + N-I6 (open number line, typed landings) →
N-F1 + N-I2 (bond, 2- and 3-part) → N-F6 (counting tape, masked) → N-I7 (take from ten frames) → N-I8
(sentence) → N-I9 (chips) → N-I10 (reason frame, fix first) → N-I11 (paper) → N-F4 v2 (bar read rung).
N-I4, N-I5 (bar builder) and N-F2, N-F7, N-F8 follow in stage 7 with the units that need them (U03,
U05; Grades 1, 3, 4).

**Files touched**
- Figures, joining the shared library **additively** (HANDOFF §6): `best-brains/figures/types.ts`
  (new kinds in `BBFigureType`), `figures/assert.ts` (shape checks and `figureValue` selectors),
  `components/figures/` (one renderer per kind), `BBFigureView.tsx` (dispatch). **Proof that Best
  Brains did not move:** every Best Brains pack hashed at two seeds before and after — identical.
- Inputs: `school-math/inputSurface.ts` (the union, read by the screen and the gate),
  `school-math/inputs/*.tsx` (one component per N-I), `school-math/answers.ts` (part grading).
  N-I1 copies the Kumon grid's interaction rules, not its file; `components/worksheet/WorksheetProblem.tsx`
  is not edited (Kumon is live every day).
- Harness: `scripts/screen-harness/main.tsx` gains an `sm-inputs` screen (a gallery of every new input
  in its states) and `scripts/sm-screen-visual.ts` drives it.
**Gates added (3 runs):** `sm-figure-kind-test` (ENGINE §6.2, with the L33 answer-giveaway sub-check;
broken controls: a bond item drawn as a bar, a regroup item in its post-trade state, a pre-filled carry
row) · `sm-figure-render-test` (render each new kind and **measure** the drawing: box count, landing
positions, block counts per column — L32; broken control: a renderer that draws one box too few) ·
`sm-model-input-test` (ENGINE §6.3, by **pointer events and by key events only**; its four broken
controls must fail both ways). `sm-spoken-answer-test` extends to every new figure's `spoken`. The
existing `bb-figure-kind-test` and `bb-figure-render-test` stay green.
**Photographs** (tablet portrait — his device — and a laptop with a keyboard focus ring visible): each
input empty, part-filled, committed right, committed with one wrong decision, blank checked ("not
yet"); the regroup row before and after a trade; the jump tool after each typed landing (no landing
drawn before it is typed); the reason frame before the fix (no rows) and after.
**Owner's word:** commit · push · merge per change set (still inert for the child).

---

## Stage 3 — The child's day

**What it builds** (ENGINE §4.3–4.7; METHODOLOGY §2): intake and placement for the first learner (his
2-day G2-U01 review, owner M10, then the probe over two days, GRADE-2 §0.2); the **lesson day** (starter
→ teacher demo, elicit-not-narrate → concrete → build → abstract → guided items with the four-rung
ladder → explain → exit); the **practice day** (current unit, returns weakest first, due comebacks, one
labelled preview "try a new one"); the stall rule's re-opened concrete step; "Question k of N" on every
screen; a rest offered after N, never a stop; **Check never locked** (a blank is "not yet"; an unchanged
answer is not a new try); read-aloud on by default (DD17); no clock anywhere for the child; resume to
the same place and count after a reload.
**Files:** `school-math/screens/` (Home, LessonDay, PracticeDay, ItemScreen, Rest, DayDone),
`school-math/session/` (dayFlow, resume, evidence capture), `school-math/services/smProgressService.ts`.
**Reuse:** `attemptEvidence.ts` (monotonic dwell clock, tried answers, scaffold seen, help rung),
`dayFlow.ts`'s screen rule, `ttsService` / `AudioButton` with the per-teacher voice map from the Ms. Wren
voice change set, the Best Brains help-ladder and review components' patterns.
**Gates added (3 runs):** `sm-day-flow-test` (k of N everywhere; no one-item screen; resume never
re-serves; starter and exit never in the mastery count; previews labelled and never scored against; the
practice-day shares) · `sm-mastery-test` (the state machine: two days, first try, no scaffold, fluency
time; stuck after 6 practice days without a clean day; every state has a way out — re-scores a fixture
history and prints which "knows" would not have held, TAD §8) · `sm-screen-contract-test` (every field
the engine writes and a screen reads means the same at both ends, the `bb-screen-contract-test`
pattern; broken control: a field written as "items per page" and read as "pages").
**Photographs:** a lesson day at question 1, mid-lesson and the exit; a practice day with a return and a
preview (its label); each ladder rung 1–4 on one item; Check pressed on a blank; a **reload mid-day**
showing the same question and the same "k of N" (TAD §3.20: the first such fix in Kumon was caught only
by the photograph); the rest screen.
**Owner decisions needed first:** **O3** (questions per day; DD1 recommends N = 5–6 on lesson days, 10
on practice days); **O4** (the teacher's character and voice — a new character, not Ms. Wren); the
**product name** on the card (M3); **O6** if the chosen voice costs money.
**Owner's word:** commit · push · merge · **GO-LIVE** (`status: 'live'`, card visible to the child) —
a separate word from the merge.

---

## Stage 4 — The chapter check and its review

**What it builds** (ENGINE §4.8; DD11): the A / B / C runner with 2 / 2 / 3 points, feedback held, Check
never locked, read aloud; the end screen in counts the child can show a grown-up; the review of misses
(ladder, one re-attempt, `review:` answers, score unchanged); "what comes back and when" in plain words;
every miss into the 2 / 7 / 21 pool; fresh forms for any re-sit.
**Reuse:** `checkReview.ts`, `comebacks.ts`, `freshForm.ts` (logic ported to `SMItem`), the Best Brains
WeeklyCheck / review screens' patterns.
**Gate added (1 run):** `sm-check-runner-test` (no per-item feedback during the check; the score is
identical before and after review; review answers never count as evidence; every miss scheduled at 2 / 7
/ 21 days; a re-sit form differs from every earlier form; broken controls: a runner that colours a wrong
answer; a review that raises the score).
**Photographs:** the check mid-way (no feedback visible), the end screen, the review of one miss with his
own answer shown, the comeback line.
**Owner's word:** commit · push · merge (the deploy carries it to the child).

---

## Stage 5 — The parent page

**What it builds** (METHODOLOGY §4, §7; DD11, DD20, DD24; HANDOFF §8): the skills map in four states
(known / learning — marked "stuck here" or "parked" — / stretch / not started) with **counts, never
percentages**; the **exam-skills map** (every part of his test → unit → state, from `examMap.ts`); the
**class-chapter line** ("His class is on chapter N; this module is on unit X, which comes just before /
beside it"; GRADE-2 §0.3); the **four-part home note** per unit (DD24) and the glossary (DD20); every
typed explanation with its reading (TAD §7); check results as counts with his answers and the two
category rows; "stuck here" with his last answers and one thing to try (TAD §3.12); the stall rule's
parent choice after 6 more days (keep / park / go back one unit — **a move of his position, so it goes
through the one move path**, TAD §8); the pacing line "on track to finish Grade 2 by <date>" (PACING-GUIDE).
**Reuse:** the Best Brains parent pages' layout pattern (`screens/parent/`), `bb-broken-promise-scan`
(extended to this module's copy: no "a teacher will help" without who, when, what next).
**Gate added (1 run):** `sm-parent-page-test` (no percent anywhere; every skill in one of the four
states; the exam-skills map covers the eight scored parts; the home note has its four parts; broken
controls: a "%" in a fixture row; a skill missing from the map).
**Photographs:** the parent page with skills in every state, the exam-skills map, the class-chapter line,
one home note, one check result.
**Owner's word:** commit · push · merge. **Ask before** any parent-page action that changes his records
(park, go back a unit) is shipped.

---

## Stage 6 — Test prep (TEST-PREP-SPEC)

**What it builds:** setup, plan builder, re-planning after each session, the short check, the mock, the
misses session, the parent plan page with ready / needs work / not taught yet, the after-the-test note.
**Files:** `school-math/testprep/` (`plan.ts` pure builder, `screens/`), `smProgressService.ts`
additions; migration `supabase/migrations/2026MMDD000001_sm_test_prep.sql` (`sm_test_prep_plans`,
`sm_test_prep_sessions`, RLS as stage 0).
**Reuse:** the engine's `weakness()`, assembler, check runner and fresh forms; nothing from the older
`homework_*` / `exam_prep_tests` tables (TEST-PREP-SPEC §1).
**Gates added (2 runs):** `sm-prep-plan-test` (taught-only, spacing, every length 1–20 with weekends on
and off, determinism and resume — each with its broken control, TEST-PREP-SPEC §7) · `sm-prep-mock-test`
(held feedback, score unchanged, misses into comebacks, child copy with no percent / countdown / "fail").
The exam-value gate's enablement list gains test-prep items and mocks (ENGINE §6.1).
**Photographs:** setup (with weekends on, one no-session day); the plan for S = 1, 3, 7 and 14; a mock
mid-way; the mock's review; the parent's "ready / needs work / not taught yet" after the mock.
**Owner's word:** commit · push · merge · **migration apply** (dry run first). **Records:** whether to
import the interim page's device records (localStorage) as attempts with `role: 'interim'` — it changes
his records, so only on the owner's word, and only with a dry-run listing of what would be written. When
the feature is live, the interim page is **archived with a short README** (what it was, why it existed),
not deleted.

---

## Stage 7 — Fan-out of the remaining Grade 2 units

**Exemplar first (L23).** Nothing fans out until G2-U04 has passed both gates and the teacher-persona run
(ENGINE §7.5).
1. **Authoring kit** — `modules/school-math/build/AUTHORING-KIT.md`, written from what the exemplar
   taught, on the `FANOUT-AUTHORING-KIT.md` pattern: hard rules (answers by code; seed-invariant,
   number-free ladders; misconception values only from named rules, identity first, L36; distinct
   context nouns per unit), the library API, the per-unit checklist, the self-verify command (200 seeds,
   `contract: 'sm-v1'`), and "do not edit shared files".
2. **Validation wave** — two units authored from the kit alone: **G2-U03 and G2-U05**, because they are
   his next units (DECISIONS M15: after the subtraction test his calendar resumes at the unknown part
   and part-whole bars). This wave brings N-I4 and **N-I5, the bar builder** (stage 2's deferred inputs,
   with their gates). Both units through both gates; Fable reviews the kit against what went wrong;
   the kit is revised.
3. **Fan-out** — the other 11 units in waves of two (1–2 agents): U02 and U01 (his returns), U06 and
   U07 (bars, with the stretch lane), then U08–U14. Each unit: its templates, its entry check, its
   chapter check (U02-CK and U05-CK are already written; the others are written by the Fable architect
   first, as U04-CK was), both gates, the cross-unit ledger re-run over the corpus (L35).
**Workflows** live in `modules/school-math/build/workflows/` and **run only on the owner's word**, one
wave per word.
**Gates:** no new runs; each unit joins `sm-verify-units`, `sm-content-rules-test`, `sm-ledgers-test`,
`sm-exam-value-test` and the kind / input / spoken gates. The coverage ratchet must fall unit by unit.
**Photographs:** per unit, one lesson day and one check screen for every new figure or input it uses.
**Owner's word:** each wave's workflow · commit · push · merge per wave · going live per unit (a unit is
served only when it has passed).

---

## Stage 8 — Persona tests, the mock, photographs

- **Persona runs** (Phase 7 pattern): the Grade 2 teacher (as `testing/TEACHER-RUN-2026-11-18.md`, now on
  generated content, with a code recompute); a **child proxy on a tablet** driven through the harness with
  the habits TAD §3.17 predicts (Enter after each digit, left-to-right typing into right-to-left boxes, a
  highlighted box read as "a digit is missing") and a keyboard child; a **parent proxy** reading the
  parent page and setting up a test-prep plan.
- **The Grade 2 mock in the school's format** (EXAM-COVERAGE §2: A / B / C, 15 points, held feedback,
  review after), generated at a fresh seed and run through the harness end to end; whether the child sits
  it is the owner's call.
- **Photographs** of every screen of the module at both devices, saved under `docs/screens-<date>/`, and
  the deployed bundle grepped for the module's chunk.
- **The outside check:** the next real school test, read the Phase 0 way (photos outside the repo,
  agents work from the written reading only).
- Outputs: `modules/school-math/testing/FINDINGS.md`, `meta/LEARNINGS.md`, fixes as their own change sets.
**Owner's word:** each fix's commit / push / merge; anything that writes to his records.

---

## What can be live before 1 December, and what cannot

**Today is Wed 18 Nov.** Twelve days to 1 Dec, with Thanksgiving (26 Nov) and a weekend between; Fable
returns on 20 Nov at 18:00 ET; one or two agents at a time; each stage waits for owner words.

| By 1 Dec | Realistic? | Why |
|---|---|---|
| The **interim Subtraction Test Prep page** (M15) for his early-December test | **yes** — built separately | it is the stopgap the owner already chose |
| Stage 0 merged (module registered, hidden; `sm_` tables applied, empty) | yes, on the owner's words | small; nothing changes for the child |
| Stage 1: engine + G2-U04 through the deterministic gate (200 seeds, every broken control fired) | yes, on the branch | 3–4 sessions |
| Stage 1: the authenticity gate + adversarial re-check on G2-U04 | likely, late in the window | needs Fable (after 20 Nov 18:00 ET) and the architect's sign-off of the U04 check first |
| Stage 2: the inputs G2-U04 needs (digit boxes, chart, jumps, bond), gated by touch and keyboard, photographed | partly (two or three of them) | 4–6 sessions for the whole stage |
| **Any module screen the child uses** (stages 3–4) | **no** | the day flow and the check runner each need their own gates, photographs and the owner's O3 / O4 / name / GO-LIVE words; shipping them in under two weeks would mean cutting gates, which the house rules forbid |
| Test prep inside the module (stage 6) | **no** | it stands on stages 3–5 |

**Likely next dates (estimates, not promises):** stages 2–4 through the first half of December; the
parent page in the second half; U03 and U05 (the validation wave) and test prep ready for the first school
days of January — his calendar's next block (the unknown part and part-whole bars) and, after it, the
bar-model chapter test, which is the first test the in-module test prep would serve. The school break
(21 Dec – 1 Jan in PACING-GUIDE's assumption) gives slack. Whether to bridge the weeks between his
December test and the module's first live day (pause the new module's days, or another stopgap page) is
the owner's decision.

---

## Owner decisions this plan needs (inline, with a recommendation)

| # | Decision | Needed by | Recommendation |
|---|---|---|---|
| O3 | Questions per day | stage 3 | lesson days 5–6 with the lesson steps counted; practice days 10 (DD1 note) |
| O4 | The teacher's character and voice | stage 3 | a new character, not Ms. Wren; voice through the per-teacher voice map |
| M3 | The module's product name on the card | stage 3 | a neutral name, no program name |
| O6 | Anything that costs money (a paid voice) | stage 3 | the free voice tier unless the owner chooses otherwise |
| — | Sign-off of the proposed G2-U04-CK | stage 1 | Fable architect, before the authenticity run |
| — | Import the interim page's device records | stage 6 | do not import by default; offer a dry-run listing |
| O7 | Every commit, push, merge, migration apply, GO-LIVE | every stage | separate words, as always |

---

## Compliance map

| Rule or source | Where applied |
|---|---|
| HANDOFF §7 module shape (ModuleId, registry, route, prefixed tables, new kinds never overloaded, migrations via the API, reuse the plumbing) | stage 0, stages 2–5 |
| HANDOFF §11 house rules (explain before commit, three words, push / merge commands, 4 GB, `tsc` twice, harness photos, verify live, workflows on the word) | header; every stage |
| HANDOFF §12 gates with broken controls | stages 1, 2 (ENGINE §6) |
| HANDOFF §6 exemplar-first, authoring kit, then fan-out (L23); Fable verdicts, Opus build (L18) | stages 1, 7 |
| TAD §3.19 Check never locked; §3.20 reload; §4 k of N; §6 render and look, broken controls, ratchets; §8 checklist | stages 3–5 |
| KUMON handoff migration and live-verification steps | stage 0, stage 6 |
| DECISIONS M10 (2-day review first), M15 (interim page), M16 (this work) | stages 3, 6, 7; the 1 Dec table |
| PACING-GUIDE his calendar | stage 7 order; the 1 Dec table |
