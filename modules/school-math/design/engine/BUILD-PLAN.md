# BUILD-PLAN v2 — the Singapore Method module, Grade 1 first, then Grades 2–5

**Revised 2026-11-20, 18:05 EST (from `date`), by the engineering lead and expert teacher (Opus),
on the owner's delegation:** "I trust you and your skill of an expert teacher who is teacher
singapore math and what my son's school method is for children of different grades. Therefore, I
will let you prepare the plan." (DECISIONS M21.) The first version (2026-11-18, G2-U04 exemplar,
test prep as stage 6) is in git history; its stage numbers are mapped at the end (§12).
**Status:** plan, no code. Branch `best-brains-content-engine`. No child's name anywhere.
**Implements:** `ENGINE-SPEC.md` (the engine; its §7 G2-U04 becomes the Grade 2 exemplar),
`EXEMPLAR-G1-U02.md` (new: the Grade 1 exemplar), DD24 and DD25 (Settings and Placement),
DECISIONS M20 (one customizable module). **Not built now:** `TEST-PREP-SPEC.md` (kept as the
future feature; §11 says what the build keeps ready for it).

---

## 1. What the owner gets, and in what order

One module, **"Singapore Method"** (id `school-math`), the same for every child and set up by the
parent:

| Part | The child sees | The parent sees |
|---|---|---|
| **Settings** | — | grade · school book and the class's chapter (optional) · questions per day · days per week · topics the child finds hard · a test date (stored now, used by the future test prep) · read-aloud (on through Grade 2) |
| **Placement** | a short "let's see what you know" test, read aloud, no marks until the end | the result per unit in counts, the start unit, and the option to move it earlier or later or re-run the test |
| **My path** | the units of the grade in order; each day a lesson day or a practice day; "Question k of N"; the help ladder; a chapter check at the end of each unit, then a review of its misses | where the path is, beside the class's chapter; "on track to finish Grade N by <date>" |
| **My scorecard** | skills "got it / practising / coming up", sessions and checks, all in counts | below it: misses with the child's own answers, help used, time per skill, "stuck here" with one thing to try, check results with the two category rows, a four-part home note per unit |
| **Records** | — | everything in `sm_` tables, so the path follows the child to any device |

**Order: Grade 1 complete, live, then Grade 2, 3, 4, 5.** A grade is "complete" when every unit
has passed both gates, the persona runs are clean, and the owner has said GO-LIVE for it (§9).
Settings, Placement, My path and My scorecard are built once (on Grade 1) and serve every grade;
later grades add only their units, figures and inputs, and their placement ladder.

**The v1 page stays.** The Subtraction Test Prep page and its device scorecard stay on the module
home until the engine serves the same sessions (the future test prep); the first learner uses it.

---

## 2. Teaching decisions made under the delegation (DECISIONS M21)

The owner delegated the plan's teaching and screen decisions (as on 2026-11-10 for Kumon). Each
is recorded with its reason and what would overturn it; each can be changed in Settings or by the
owner's word.

| # | Decision | Default | Why (teacher's reading) | Overturned by |
|---|---|---|---|---|
| T-1 | Exemplar unit | **G1-U02 Number bonds; + and − within 10** (not G1-U01) | It is the unit every later strand stands on (part-whole is the bar model's root, E246); GRADE-1 §4.1 already expands it with a written, reviewed chapter check; it exercises five input kinds (counter split, bond build, sentence chips, truth rows, picture stories), choice pools with numeric rank, and an error-analysis item, so it proves the engine on almost everything. U01 is counting and would prove little. | — |
| T-2 | Questions per day (O3) | **Grade 1: lesson day 5, practice day 8. Grades 2–5: lesson day 6, practice day 10.** Parent range 4–8 (lesson) and 6–12 (practice). | A Grade 1 child builds most answers (drags counters, taps circles), which takes two to three times as long as typing a number; 8 build items is about 10–12 minutes, the short day of DD1. Lesson steps count inside N (DD1 note); the explain item runs on alternate lesson days. GRADE-1 §4.1's 10-item practice anatomy scales to 8 in the same shares (5 current, 2 returns, 1 preview at most). | Records: first-try accuracy falling across the day (N too high), or the rest offer declined on most days (N too low). |
| T-3 | Days per week | **5 short days**, weekends off; the parent may add weekend days | PACING-GUIDE's year is 36 weeks × 5 days; every grade fits with spare days (Grade 1: 39 spare). | The parent's setting. |
| T-4 | Placement design (§6) | a **core-strand ladder** with early stop, plus side units sampled only up to the stop | DD25, with one teacher's refinement: two items cannot place a child out of time, length, shapes, graphs or money reliably, and those units are short and cheap; the number spine is where placement saves weeks. | Records: placed-out skills failing their confirm returns (DD25). |
| T-5 | Order of the path | **the curriculum's unit order, which is the school's chapter order** (Grade 1 maps unit n to chapter n); the class chapter sets the pacing target and the "beside" line, never a skip | A child is never moved past an unplaced unit because the class has moved on; the gap is shown to the parent and closed by pace (shortened lessons for "already knows" skills, PACING-GUIDE's catch-up rules), never by skipping prerequisites. | The parent moves the start (one move path, §5.4). |
| T-6 | Sister-module link sentences (DD14) | said **only when the child is enrolled in that module** (Kumon / Best Brains enrollment read at day start) | A child with no Kumon does not need "you already know this fast from Kumon"; for the first learner the links stay, as METHOD-LEDGER intends. | — |
| T-7 | The teacher character and voice (O4) | **a new character, not Ms. Wren**, on the free voice tier, through the per-teacher voice map; name and look chosen at stage 5 with a Fable review | One character per module keeps the sister modules distinct for the child (HANDOFF-2026-11-17-MS-WREN-VOICE). | The owner's word; anything paid is the owner's word (O6). |
| T-8 | Placement for the first learner | he is Grade 2 and takes the **Grade 2** placement when Grade 2 ships; the Grade 1 path is available to him earlier as a repair path only if the owner chooses | DD25 "the first learner"; Grade 1 holds his known gaps (part-whole, place value; DECISIONS M2). | The owner's word. |

Still the owner's: **commit, push, merge, migration apply, GO-LIVE** (separate words, O7); the
**school calendar** (his pacing dates); **importing the v1 device records** (dry-run list first);
the **no-name list file** (§8.1); anything that costs money or changes a child's records by hand.

---

## 3. House rules that shape every stage

(Binding; KUMON handoff "House rules", HANDOFF-2026-11-20 §5.)
- **Explain before commit**: exact pathspec and contents, then the owner's word. Push with
  `git push origin best-brains-content-engine:best-brains-content-engine`; squash-merge the PR;
  then **sync the branch with main by a normal merge** (a hard reset + force push was blocked by the
  safety check on 11-18).
- **Migrations** through the Supabase management API only: a dry run as ONE statement that rolls
  itself back (a `DO` block ending in `RAISE EXCEPTION`), shown to the owner; apply on his word;
  record the version in `supabase_migrations.schema_migrations`; confirm the tables and policies.
  Never `migration repair` blind. A migration is live before the frontend that needs it deploys.
- **4 GB machine**: one agent at a time (owner, 2026-11-20); the battery runs serially; `tsc` at
  most twice per change set (extra runs disclosed); the 30 existing runs stay green; every new gate
  joins the battery with a broken control seen to fire; existing debt is a ratchet.
- **Every screen change** rendered in `frontend/scripts/screen-harness/` and looked at, on tablet
  portrait and on a laptop with the keyboard focus ring visible; audio changes get sample files.
- **Verify live** by fetching the deployed site and grepping the bundle for a string of the new
  chunk (Netlify deploys `main` about two minutes after a merge).
- **No child's name** in any file, prompt or outbound text; the exam photos never enter the repo;
  agents read `research/phase0/EXAM-READING.md` only; exam values never appear as operands, keys or
  choices (EXAM-COVERAGE §4 tiers).
- **Model routing**: Fable for design reviews, verdicts and the authenticity gates; Opus for
  building; the main session verifies every number an agent reports.

---

## 4. The stages at a glance

| # | Stage | Change sets | Gates after (battery runs) | Fable | Owner words | Child sees anything? |
|---|---|---|---|---|---|---|
| A | This plan + `EXEMPLAR-G1-U02.md` | 1 (docs) | 30 | design review | commit | no |
| 0 | Records: `sm_` tables, contract kinds | 1 | 30 → 32 | — | commit · **migration apply** · push · merge | no |
| 1 | Engine core + G1-U02 (and the three U01 return templates) through both gates | 2 (1a engine, 1b unit) | 32 → 44 | authenticity gate + adversarial re-check | commit · push · merge | no (inert) |
| 2 | Grade 1 figures and inputs | 2–3 | 44 → 47 | — | per change set | no (harness only) |
| 3 | Settings (parent) + module home v2 | 1 | 47 → 48 | — | commit · push · merge | parent only, hidden route |
| 4 | Placement (Grade 1 ladder) | 1 | 48 → 49 | design sign-off before build | commit · push · merge | no (hidden until GO-LIVE) |
| 5 | My path: day flow, chapter check + review, the teacher | 2 | 49 → 53 | teacher character review | commit · push · merge | no (hidden until GO-LIVE) |
| 6 | My scorecard + parent view | 1 | 53 → 54 | — | commit · push · merge | no (hidden until GO-LIVE) |
| 7 | Grade 1 fan-out: authoring kit → validation wave (2 units) → 10 units in waves of 2 | 1 per wave | units join existing runs | kit review; both gates per unit | **each wave** · commit · push · merge | no |
| 8 | Grade 1 persona tests, mock chapter check, photographs | 1 (docs + fixes) | 54 | — | fixes' words | — |
| G1 | **Grade 1 GO-LIVE** | — | — | — | **GO-LIVE** | **yes** |
| G2–G5 | Each grade: exemplar unit → figures/inputs → placement ladder → fan-out → persona tests → GO-LIVE | per grade | +2–4 per grade | per grade | the same words | per grade |

Sizes are estimates from the Best Brains build: stage 0 one session; stage 1 three to four; stage 2
four to five; stages 3–6 one to three each; stage 7 one session a unit; stage 8 two.

---

## 5. Stage 0 — records

### 5.1 Contract (`frontend/src/modules/core/contract.ts`), new kinds, never an overloaded one
- `PlacementDescriptor.kind` += `'placement-ladder'` (DD25: a ladder test with early stop and
  confirm-by-returns); the registry entry moves from `'parent-selected'` to it at stage 4.
- `ProgressSchemaDescriptor.kind` += `'sm-skill-state'` (the v1 `'sm-device-local'` stays until
  the v1 page is retired); `tables` lists the `sm_` tables.
- `ParentReportSchemaDescriptor.kind` stays `'sm-scorecard'` (continuous, no acknowledgement).
- `LevelDescriptor.unitKind` `'chapter-unit'` and `SessionGeneratorDescriptor.kind`
  `'chapter-unit-generator'` already exist (v1) and are kept.

### 5.2 Migration `supabase/migrations/20261121000001_sm_module_schema.sql` (date set when written)

| Table | One row per | Holds | Writes |
|---|---|---|---|
| `sm_enrollment` | child | grade; `settings` jsonb (lesson N, practice N, days per week, weekend days, read-aloud); school (book, the class's chapter, updated at); `calendar` jsonb (school breaks, for the pacing line); `hard_units` text[] (a unit ticked hard is at most `short-check` in placement, never `placed-out`); `wants` text[] (e.g. "word problems", "more advanced"); `test_date` (stored for the future feature); `start_unit`; `status` | upsert |
| `sm_placement_sittings` | sitting | grade, seed, form, items (template id, seed, role), per-unit result (`placed-out` / `short-check` / `start-here` / `not-reached`), stop reason, the start unit it proposed, whether the parent changed it, started / finished at | insert; update only to finish |
| `sm_unit_state` | child × unit | state (`not-started` / `in-progress` / `check-due` / `checked` / `placed-out`); lesson days done; entry-check pair results; "already knows" marks; lesson demos seen, per content version (TAD §3.16); check sittings | upsert |
| `sm_day_state` | child × local day | day kind (lesson / practice / entry / check / placement); the **manifest** (slot → template id, seed, role) frozen at day start; place k; done at — so a reload resumes at the same question and count (TAD §3.20) | upsert |
| `sm_item_attempts` | attempt | child, unit, lesson, item id, template id, seed, role, skill ids, per-part results, first-try correct, tries, every answer tried, first-try ms (monotonic, paused while hidden), scaffold visible, ladder rung 0–4, model rung, self-check differed, strategy chip, misconception rule matched, day kind, **local day key** (the device's calendar day, as `comebacks.ts` `localDay()`; "two separate days", clean days and 2 / 7 / 21 are counted on it, never on UTC `created_at`), created at (TAD §8; METHODOLOGY §7) | **append-only** |
| `sm_skill_state` | child × skill | a **rebuildable projection** of the attempt log: state, the two qualifying days, practice days since a clean day, fluency ms, stretch, parked at | upsert (never the source of truth) |
| `sm_check_sittings` | sitting | unit (or cumulative / mock), form, seed, section counts, the two category rows, held-feedback flag, review done at | insert; update only for review done |
| `sm_comebacks` | child × item family | source (check / placement / return), next due, clean-in-a-row count, settled at (2 / 7 / 21 days, three clean in a row) | upsert |
| `sm_parent_moves` | move | kind (move start / park / unpark / go back a unit / re-run placement / setting changed), from, to, by, at — the **one move path's** audit row (TAD §8 "every way a grown-up can move a child goes through the one move path") | append-only |
| `sm_explanation_reviews` | review | the `bb_explanation_reviews` shape with `unit_id` | insert |

- **RLS on every table**, the `bb_` pattern (`children.user_id = auth.uid()`): four policies on
  upsert tables; append-only tables (`sm_item_attempts`, `sm_parent_moves`) have no UPDATE policy,
  as `bb_item_attempts`.
- **Roles** (`SMItem.role`, recorded on every attempt): ENGINE §4.2's list plus `placement` and
  `warm` (placement items are read differently from a unit's entry check: placement proposes a start,
  an entry check opens a lesson) and `demo` is never an attempt (demos are recorded as "seen").
- Test-prep tables (`sm_test_prep_plans`, `sm_test_prep_sessions`) are **not** created now.
- **The v1 device records**: not imported. If the owner wants them, a dry-run listing of what would
  be written (as attempts with `role: 'interim'`) is shown first; only then a write.

**Gates (2 runs):** `sm-contract-test` (each module's descriptor uses only its own kinds; broken
control: a fixture module reusing `'bb-week-state'` must fail) · `sm-schema-test` (every table
`sm_`-prefixed, RLS enabled, four policies or three-and-append-only by declaration; broken
controls: a table without RLS, an append-only table with an UPDATE policy).
**Photographs:** none (no screen change).

---

## 6. Placement (stage 4; DD25 with decision T-4)

**The Grade 1 ladder.**
1. **Warm items (2, not scored, prerequisites first):** count a set to 10 by touch; say which of
   two small sets has more by matching — GRADE-1 §6 entry profile. If both miss, the test ends
   kindly ("Let's start at the beginning together") and the start is G1-U01; the parent sees it.
2. **The core ladder (8 units × one pair = 16 items):** U01 → U02 → U04 → U05 → U06 → U08 → U10 →
   U11, each pair two items of the same structure with different numbers on the unit's core skill
   (the unit's own templates at a placement seed, school formats, `role: 'placement'`; warm items
   `role: 'warm'`). **Typed or built answers, not choices**, wherever the skill allows: on two
   four-way choices a guessing child places out one time in sixteen.
3. **Side units (U03, U07, U09, U12, U13):** one pair each, served only when the ladder has cleared
   the core unit just before it in curriculum order; otherwise `not-reached` = start here when the
   path gets there (their entry checks still skip a concrete step when clean, DD3).
4. **Early stop:** misses on two core units in a row (both items of each pair wrong, or one wrong and
   one blank) end the ladder.
5. **Served over at most two short days** (about 10–12 items a day), read aloud, untimed, Check
   never locked, **feedback held** until the end; the end screen says how many were done, never a
   score, and "your teacher has picked where to start".
6. **Reading it (DD25):** both right first try → `placed-out`; one right → `short-check` (that
   unit's entry check opens it, DD3); none → `start-here`. **Start = the first unit in curriculum
   order that is not placed out.** The parent sees each unit's result and can move the start
   (through the move path) or re-run the test.
7. **Placed-out is confirmed, not assumed:** each placed-out unit's skills enter the return pool in
   the first two weeks; right unaided on a separate day → "knows"; a miss → the lesson opens and the
   skill is "learning" (DD25).
8. Later grades: the ladder runs the previous grade's last two core units first (prerequisites),
   then the grade's own core strand; side units as above. Grade 2's ladder uses the first learner's
   test reading and the regrouping probe as prior evidence (DD4, DD25).

**Gate (1 run):** `sm-placement-test` — the ladder's order; early stop exactly after two missed core
units; side units only after their core neighbour; the reading rule on every result combination;
feedback held (no per-item signal); the start rule; placed-out skills scheduled as returns;
determinism and resume after a reload. Broken controls: a runner that stops after one missed unit;
a reading that places out on one right answer; a runner that colours a wrong answer.
**Fable sign-off** of the ladder (item choice per unit, the stop rule) before it is built.

---

## 7. Stage-by-stage detail

### Stage A — this plan and the exemplar spec (docs only)
`BUILD-PLAN.md` (this file) and `EXEMPLAR-G1-U02.md`. One Fable design review (read-only) of both;
its fix-before-build items applied; then the owner's commit word.

### Stage 1 — engine core + G1-U02 through both gates
**1a: the engine** in `frontend/src/modules/school-math/`: `types.ts` (`SMUnit`, `SMLesson`,
`SMSkill`, `SMItem` with parts, roles, rungs; ENGINE §4.1–4.2) · `curriculum/grade1.ts` (13 units,
57 lessons, skills, school-chapter lookup, `lessonExampleNumbers`) · `curriculum/methodLedger.ts`
(parsed rows) · `curriculum/examMap.ts` (Grade 2 parts; empty for Grade 1, honestly) ·
`engine/registry.ts` · `engine/lib/` (`bonds.ts`, `within10.ts`, `misconceptions.ts` with every
rule's `verifyFor`, `choices.ts` display order + numeric rank, `contexts.ts` story settings) ·
`engine/validator.ts` (the Best Brains QG gates on `SMItem`; the new validations on the QG-5
enablement list, L50) · `engine/assemble.ts` (lesson day, practice day, entry check, placement form,
chapter check) · `engine/scheduler.ts` (returns, comebacks, previews, `weakness()`) ·
`engine/mastery.ts` (skill states, stall rule, fluency).
**Stage 1 does not wait for stage 2's renderers:** 1a adds the new figure **types**, their
`checkFigureShape` branches, `figureValue` selectors and `spoken` strings to the shared figure library
additively (no renderers, Best Brains packs hashed identical before and after), and the new input
surface **descriptions** to `school-math/inputSurface.ts`, so QG-13 and the pack-level L33 sub-check
run on real data. The choice-rank gate's display-order measure runs pack-level at stage 1 and is
re-run on the rendered surface at stage 2 (L53). The authenticity gate reads a text dump.
**1b: the unit** `engine/units/g1u02.ts` (every template of EXEMPLAR §4, its entry check, its
chapter check) and `engine/units/g1u01-returns.ts` (the three U01 templates the entry check and the
practice-day returns need; they become part of G1-U01 at fan-out).
**Reuse, imported read-only:** `best-brains/generator/rng.ts` (`streamRng`), `surface.ts`,
`templates/lib/format.ts`, `templates/lib/guard.ts`, the `validator.ts` gate functions, `answers.ts`;
`services/attemptEvidence.ts` at stage 5.
**Gates (12 runs):** `sm-verify-units` (200 seeds `i × 13 + 3`; 0 throws, 0 invalid; broken control:
a corrupted `bond-parts` key must fire) · `sm-exam-value-test` (both tiers; reads EXAM-READING at run
time; enablement list printed; three broken controls) · `sm-choice-rank-test` · `sm-shape-hint-test` ·
`sm-ladder-test` · `sm-lesson-reuse-test` · `sm-blind-habit-test` · `sm-answer-entropy-test` ·
`sm-readability-test` (≤ 10 words a spoken sentence; two story sentences and one question) ·
`sm-ledgers-test` (coverage ledger from GRADE-1's item-type column with reasoned deferrals as a
ratchet; prior-unit; method ledger) · `sm-no-name-test` (content + payload halves; §8.1) ·
`sm-spoken-answer-test`. Each with the broken control ENGINE §6 names (cut to what Grade 1 needs).
`sm-exam-value-test`'s stage-1 broken controls: a tier-1 fixture built at run time from the list; a
tier-2 fixture item whose lesson id is one on EXAM-COVERAGE §4's enablement list, carrying a tier-2
value as its key (proves the tier-2 path runs, though no Grade 1 lesson is on the list); an
enablement fixture with an unknown surface id that must be reported, not silently skipped.
**The authenticity gate** (ENGINE §5.2–5.3, Fable): the unit's surfaces at three independent seeds,
GRADE-1's U02 rows, METHOD-LEDGER B1–B2, the rubric; ACCEPT, then the adversarial re-check that
recomputes every key and pool value; its planted broken unit (a teacher line that states the missing
part before the child acts; a key-word hint, "altogether means add"; a pool value whose named rule
gives another number) must come back REJECT with all three cited. Then an **Opus teacher-persona
run** (Grade 1 teacher, Singapore-trained) over the generated unit with a code recompute: 0
mismatches.
**Owner reads:** a dump of one lesson day, one practice day and one chapter check at two seeds.

### Stage 2 — Grade 1 figures and inputs (touch and keyboard)
**Split so Grade 1 reaches a child sooner:** **2a** = what G1-U02 and its outside templates need
(N-F1 + N-I2, N-I4, N-I8, `truth` + N-I10, the `groups` picture, N-F8, N-I11, picture choices for the
preview) before stage 3; **2b** = the rest, each built with the fan-out wave that first needs it (the
ten frame with the validation wave's G1-U04, and so on), same gates.
**Order:** N-F1 + N-I2 (bond, build with
"which circle is the whole") → N-I4 (counter split) → N-I8 (sentence chips, movable blank) →
`truth` rows (existing) + N-I10 (reason frame, fix first) → fixed-shape group picture for stories
(an extension of `counters`: a group drawn as one shape carrying its number, nothing countable,
L33) → N-F8 (matched rows, nothing ringed) → N-I7 (ten-frame fill) → N-F6 + N-I6 (masked tape,
jump chips, typed landings) → N-F9 + N-I3 (blocks on a chart, group ten / open a ten) → N-I9
(strategy chips). With their units at fan-out: N-I15 (clock, U07), N-I16 (picture graph, U12),
N-I25 (partition, U03; served as `choices` among drawn cuts until built, recorded as debt).
**Files:** new kinds added **additively** to the shared figure library
(`best-brains/figures/types.ts`, `assert.ts`, `components/figures/`, `BBFigureView.tsx`), with every
Best Brains pack hashed at two seeds before and after — identical; inputs in
`school-math/inputs/*.tsx` and `school-math/inputSurface.ts`; Kumon's `WorksheetProblem.tsx` not
edited; harness screen `sm-inputs` + driver `scripts/sm-screen-visual.ts`.
**Gates (3 runs):** `sm-figure-kind-test` (kind vs words on every surface + the L33 giveaway
sub-check; broken controls: a "number bond" drawn as a bar, a story group drawn as countable dots
where the child answers, a filled bond beside a find-the-part item) · `sm-figure-render-test`
(measure the drawing: circle count, which circle is empty, counters per part, landing positions;
broken control: a renderer that draws a filled asked circle) · `sm-model-input-test` (by pointer
events and by key events only: right, each single wrong decision, blank = "not yet", unchanged =
not a new try; broken controls: a bond accepting a value in the wrong circle, a split graded on one
part, a jump tool printing landings, a sentence hint containing the key). `bb-figure-kind-test` and
`bb-figure-render-test` stay green.
**Photographs:** each input empty, part-filled, right, one wrong decision, blank checked; tablet
portrait and laptop with focus ring.

### Stage 3 — Settings and the module home v2
**Builds:** `screens/parent/SettingsPage.tsx` (the §1 fields, plain words, defaults from T-2/T-3;
the grade picker shows only grades that are live, plus "coming soon" for the rest); the module home
v2 (My path · My scorecard · Settings for the grown-up · the v1 Subtraction Test Prep tile kept);
`services/smEnrollmentService.ts`; and **the one move path** `services/smMovePath.ts`: the only
code that changes where a child is (grade, start unit, park / unpark, go back a unit, re-run
placement). It writes `sm_parent_moves`, sets the new position, clears today's frozen day manifest,
re-evaluates due comebacks against the new position, and clears the "seen" marks of lesson demos the
child is moved back into (TAD §3.16, §8). Settings, placement results and the parent page all call it.
**Gate (1 run):** `sm-settings-test` (every field round-trips; ranges enforced; every caller that
moves a child goes through `smMovePath`, checked by a scan of the module for writes to
`start_unit` / unit state outside it; a move clears the manifest and the seen marks; broken controls:
a settings save that writes `start_unit` directly; a move that leaves today's manifest in place).
**Photographs:** Settings empty, filled, with the school layer set; the home v2.

### Stage 5 — My path (after placement, stage 4, §6)
**5a the day** (ENGINE §4.3–4.7; METHODOLOGY §2; EXEMPLAR §3): lesson day (one starter, the
lesson's steps with the teacher's demo — elicit, not narrate, L25 — the ladder, two exits); practice
day (current unit, returns weakest first, due comebacks, at most one labelled "try a new one");
"Question k of N" on every screen; a rest offered after N, never a stop; Check never locked;
read-aloud on through Grade 2; no clock for the child; resume to the same question and count;
the stall rule's re-opened concrete step; the teacher character (T-7).
**5b the chapter check and its review** (ENGINE §4.8; DD11): A / B / C, 2 / 2 / 3, feedback held,
end screen in counts, review of misses with the ladder and one re-attempt (`review:` answers never
count, the score never changes), "what comes back and when" in plain words, misses into the 2 / 7 /
21 pool, fresh forms for a re-sit.
**Reuse:** `attemptEvidence.ts`; the `dayFlow.ts` rule; `checkReview.ts`, `comebacks.ts`,
`freshForm.ts` logic ported to `SMItem`; `ttsService` / `AudioButton` with the voice map.
**Gates (4 runs):** `sm-day-flow-test` · `sm-mastery-test` (re-scores a fixture history and prints
which "knows" would not have held) · `sm-screen-contract-test` · `sm-check-runner-test` (broken
controls: a runner that colours a wrong answer; a review that raises the score).
**Photographs:** a lesson day at question 1, mid and exit; a practice day with a return and a
preview; each ladder rung 1–4; Check on a blank; a reload mid-day (same question, same k of N); the
rest screen; the check mid-way, its end screen, a review of one miss with the child's answer.

### Stage 6 — My scorecard and the parent view
**Child part:** skills got it / practising / coming up for the current unit and the grade; sessions
done; checks done; counts only, never a percentage, never "failed".
**Parent part below:** the skills map in four states (known / learning — "stuck here" or "parked" —
/ stretch / not started); misses with the child's own answers; help used (highest rung per skill,
falling over days is the record of learning); time per skill against its fluency time (shown to the
grown-up only); check results in counts with the two category rows; the class-chapter line; "on
track to finish Grade N by <date>"; one four-part home note per unit (DD24) and the glossary (DD20);
every typed explanation with its reading; the stall rule's parent choice after 6 more days (keep /
park / go back one unit — through the move path; **asked of the owner before this action ships**).
**Gate (1 run):** `sm-parent-page-test` (no "%" anywhere; every skill in one state; the home note's
four parts; no promise of help without who / when / what next — `bb-broken-promise-scan` extended;
broken controls: a "%" in a fixture row; a skill missing from the map).

### Stage 7 — Grade 1 fan-out (exemplar first, L23)
1. **Authoring kit** `modules/school-math/build/AUTHORING-KIT.md` from what G1-U02 taught (hard
   rules: answers and every wrong value by code; number-free, seed-invariant ladders; misconception
   values only from named rules, identity first, L36; distinct context nouns per unit; the self-verify
   command; "do not edit shared files"). Fable reviews it.
2. **Validation wave — G1-U01 and G1-U04** (U01 completes the return templates already begun;
   U04 brings the ten frame, the first new input after the exemplar's). Both units through both gates;
   the kit is revised from what went wrong.
3. **Fan-out, waves of two, one agent at a time:** U05 + U06 → U08 + U10 → U11 + U03 → U07 + U09 →
   U12 + U13. Each unit: templates, entry check, chapter check (U08-CK is written in GRADE-1 §4.2;
   the others are written first as a blueprint, Fable-reviewed, as U02's was), both gates, the
   cross-unit ledger re-run over the corpus (L35). The coverage-ledger debt must fall unit by unit.
**Workflows run only on the owner's word, one wave per word.**

### Stage 8 — Grade 1 persona tests
Teacher persona over every generated unit with a code recompute; a **child proxy on a tablet**
driven through the harness with TAD §3.17's habits, and a keyboard child; a **parent proxy** through
Settings, Placement and the scorecard; a mock chapter check (a multi-unit blueprint) end to end;
every screen photographed at both devices under `docs/screens-<date>/`. Outputs: `testing/FINDINGS.md`,
`meta/LEARNINGS.md`, fixes as their own change sets.

### Grade 1 GO-LIVE (owner's word)
`status: 'live'` for the module with only live grades selectable; the card visible to the child;
the v1 access flag kept for grades not yet live. Verified live by fetching the deployed bundle.

### Grades 2–5
Each grade repeats: its exemplar unit through both gates (Grade 2: **G2-U04**, ENGINE-SPEC §7, whose
proposed chapter check gets the Fable sign-off owed since 11-18; the owed sign-off on REVIEW-2026-11-17
N1 is done then too) → its new figures and inputs (Grade 2: column digit boxes N-F5/N-I1, open number
line N-F3, bar model N-F4/N-I5; Grade 3 on: arrays, fraction strips N-F7, disks N-F2 from Grade 4) →
its placement ladder (§6.8) → fan-out with the kit → persona tests → GO-LIVE. Grade 2's entry plan
(GRADE-2 §0) and the first learner's exam-skills map (stage 6 parent view) land with Grade 2.

---

## 8. Gates that need something from outside the repo

### 8.1 The no-name list (`sm-no-name-test`)
The gate scans every generated surface, every authored string in `frontend/src/modules/school-math/`
and every file in `modules/school-math/` for any name on a **local list that never enters the
repo**, read from the path in the environment variable `MF_NO_NAME_LIST`, matched as **whole words,
case-insensitive** (so a short name that is also part of an English word does not fire on every
file). It **fails closed** with a
plain message when the variable or file is missing. **The owner creates that file himself** (one
name per line) and tells the build only its path; no agent ever reads it aloud, prints it or copies
it. Its broken control plants a fixture string built at run time from the list's first line and
asserts the gate fires, printing only "planted name found: yes".

### 8.2 The exam values (`sm-exam-value-test`)
Read at run time from `research/phase0/EXAM-READING.md` ("Exam values for the no-exam-items gate");
never copied into code, content or fixtures (S3, S4). Grade 1 surfaces are tier 1 (no Grade 1
lesson is on EXAM-COVERAGE §4's enablement list); the gate prints the list it enforced.

---

## 9. What "Grade 1 complete" means

1. All 13 units: `sm-verify-units` green at 200 seeds; every gate green with its broken control seen
   to fire; the authenticity gate ACCEPT and the adversarial re-check with no hard-gate FAIL; the
   teacher-persona recompute 0 mismatches.
2. Every Grade 1 figure and input gated by touch and keyboard and photographed; the coverage-ledger
   debt at 0, or each remaining deferral reasoned and accepted by the owner.
3. Settings, Placement, My path, the chapter checks with review, My scorecard and the parent view
   working end to end in the harness for a fixture child at three placements (start at U01; placed
   out to U05; placed out to U11).
4. Persona runs clean (stage 8); every screen photographed at both devices.
5. The owner's GO-LIVE word.

---

## 10. Owner decisions (inline, with a recommendation)

| # | Decision | Needed by | Recommendation |
|---|---|---|---|
| — | No-name list file path (§8.1) | end of stage 1 | a file under the home folder, e.g. `~/.config/mindfoundry/no-name-list.txt`; tell the build the path only |
| — | His school calendar | Grade 2 (his pacing line) | when convenient |
| — | Import the v1 device records | any time after stage 0 | do not import; a dry-run list first if wanted |
| T-8 | **What the first learner gets from this build, and when.** Building Grade 1 first means he sees nothing new from the module until either (a) Grade 1 is live and offered to him as a repair path, or (b) Grade 2 is live. At the stage estimates (§4), Grade 1 GO-LIVE is several weeks of sessions away and Grade 2 longer. The v1 test-prep page serves him meanwhile. | at Grade 1 GO-LIVE | offer him Grade 1's part-whole and place-value units (U02, U05, U06, U08, U11) as a short repair path, placed by the Grade 1 ladder, while Grade 2 is built; the owner decides |
| O7 | Every commit, push, merge, migration apply, GO-LIVE | every stage | separate words, as always |

T-1 to T-7 are decided under the delegation (§2) and reported, not asked.

---

## 11. Keeping the future test prep easy (TEST-PREP-SPEC; not built)

The build keeps these so test prep is an addition, not a rework: `test_date` in `sm_enrollment`;
one `weakness()` shared by practice days and the future planner (ENGINE §4.5); the check runner
taking any blueprint (a test-prep mock is a fresh-form chapter check); the `prep` and `short-check`
roles in `SMItem.role`; the exam-value gate's enablement list ready to take test-prep surfaces. The
v1 page is retired, archived with a README, only when the engine serves its sessions.

**Another future idea, saved, not planned (owner, 2026-11-21):** a Mind Foundry **daily plan** of
about 30 minutes that combines Kumon sheets, Best Brains and Singapore Method in one day, each with
fewer questions, the three approaches taught in parallel — possibly a distinctive Mind Foundry
approach. Written up in `docs/FUTURE-MIND-FOUNDRY-DAILY-PLAN.md`; nothing in this build depends on it,
but the build keeps it possible (a day is a question count per module; the time per day is recorded).

---

## 12. Mapping from BUILD-PLAN v1 (2026-11-18)

| v1 stage | Now |
|---|---|
| 0 register + `sm_` tables | stage 0 (registration was done in v1; tables extended with placement, comebacks, parent moves) |
| 1 engine + G2-U04 exemplar | stage 1 with **G1-U02**; G2-U04 is the Grade 2 exemplar |
| 2 figures and inputs (G2-U04's) | stage 2 with Grade 1's; Grade 2's with Grade 2 |
| 3 the child's day | stage 5a (after Settings, stage 3, and Placement, stage 4) |
| 4 chapter check + review | stage 5b |
| 5 the parent page | stage 6 (with the child's scorecard) |
| 6 test prep | **future** (§11) |
| 7 fan-out of Grade 2 | stage 7 for Grade 1; Grade 2's with Grade 2 |
| 8 persona tests | stage 8, per grade |

---

## 13. Reviewing wrong work — what this module takes from Best Brains (owner, 2026-11-21; DECISIONS M22)

The owner: "think about incorporating best practices from Best Brains enhancements like reviewing
wrong material." Best Brains earned each of these from a real miss of the first learner's (the
code files say which). The Singapore Method takes every one, and applies them on **every** day kind,
not only after a check. Built in stage 5 (5a day flow, 5b check and review) unless named otherwise.

| # | Practice | Best Brains source | In this module | Records |
|---|---|---|---|---|
| W1 | **Fix-it after a shown answer.** When the ladder reaches rung 4 (the answer shown), the day does not just move on: the next screen is a **same-structure twin** with new numbers (the same template at a fresh seed), or, where the template has no twin, an explain-back (tap the true rows about the answer just shown) | `session/fixit.ts` | every lesson-step, practice, return and comeback item | role `review` (id marked `-FX-`): never "knows" evidence (same-minute success is working memory, TAD §2); the skill goes to the comeback pool (W3) |
| W2 | **"Look again" at the end of a practice day.** After the day's N, up to **2** (Grade 1) / **3** (Grades 2–5) of the day's first-try misses come back one at a time: the question read again, **his own answer shown**, rung 1 of the ladder, one more go; "Show me how" replays the lesson demo. Short, kind, never "wrong"; skipped if the child takes the rest | `CheckReview.tsx` (going over the paper), widened from the weekly check to every practice day | practice days; lesson days use W1 only (the lesson is the teaching) | role `review` (id `-LA-`); the score of the day never changes |
| W3 | **Misses come back with new numbers at 2, 7 and 21 days** until right unaided three times in a row | `session/comebacks.ts` (check misses only) | from chapter checks (as Best Brains) **and** from practice-day items missed on the first try that needed rung 3 or 4; check misses first; at most 2 a day in Grade 1, 3 from Grade 2 | `sm_comebacks`; stage 5 adds `'practice'` to its `source` check (a small migration, on the owner's word) |
| W4 | **Going over the paper after every check**: each miss with his own answer, the ladder, one re-attempt; the score never changes | `session/checkReview.ts` | chapter checks, cumulative checks, mocks (already ENGINE §4.8). Placement is the exception: its misses are units not yet taught, so they are taught in the path, not reviewed (the grown-up sees them) | `review:` answers never count |
| W5 | **Fresh questions on every second look**: a re-sit or a comeback is never a question he has already seen answered | `session/freshForm.ts` | re-sits, comebacks, the W1 twin, W2 never re-serves the shown answer's numbers after rung 4 | gate `sm-check-runner-test` |
| W6 | **The same answer twice gets the clue again**, and a third time "You wrote 7 again. Let's read it together." | owner's Best Brains leftover (KUMON handoff); S6 | every surface | the repeat is recorded, not a new try |
| W7 | **Re-teach the skill, worked example first**, before the comebacks of a skill missed on a check | `screens/MicroReteach.tsx` | the next lesson day after a check opens with that skill's demo ("Show me how") if two or more check parts on it were missed | demo seen, per content version |
| W8 | **"Where the unit is at"** when a unit is waiting (check due, a skill stuck): what happened in counts, what moving on needs, what comes next and when; then a grown-up part with the misses and his own answers and one thing to do together | `session/weekStatus.ts` | module home and the parent view (stage 6) | — |
| W9 | **His working kept for the grown-up** (the scratch pad's strokes, the paper items' "I drew it") — never marked | `services/bbNotebookStore.ts` | from Grade 2, when the column and bar items bring the scratch pad (Grade 1 builds on screen) | IndexedDB on the device, as Best Brains |

**Gate additions** (stage 5): `sm-day-flow-test` asserts W1 (a twin follows every rung-4 item; it is
never mastery evidence), W2 (the look-again list is the day's first-try misses, capped, his answers
shown, the score unchanged; broken control: a look-again that re-serves an item answered right), W3
(practice misses scheduled; the daily cap; broken control: a comeback that counts a `review` answer
as clean), W6 (the third same answer gets the read-together line).

## 14. The first learner's day budget (owner, 2026-11-21; DECISIONS M22)

"For my son for now, he will be doing Kumon at 15-20 min (2 sheets - 20 questions), Best Brains at
10-15 min, and Singapore at 15 min. I don't want to overwhelm him, so I have reduced the workload and
diversified." So, when his Grade 2 path starts: **lesson day 6, practice day 8 plus up to 2
"look again"**, aiming at 15 minutes; the parent view shows his **typical day length** (median
minutes over his last five days, grown-up only, never a clock for him) so the owner can move N up or
down. The module never asks for more time (METHODOLOGY §5).

---

## Compliance map

| Rule or source | Where applied |
|---|---|
| Owner 2026-11-20: Grade 1 first, full solution, test prep later; one customizable module (M20); delegation (M21) | §1, §2, §11 |
| DD24 intake, DD25 placement, DD3 entry checks | §5.2, §6, stage 3 |
| DD1 day = N, lesson-day anatomy; DD10 returns; DD11 check; DD14 link sentences; DD17 read-aloud | §2 T-2, T-6; stages 5a, 5b |
| ENGINE-SPEC §2–§6 (reuse, extensions, gates); §7 kept for Grade 2 | stages 1, 2; Grades 2–5 |
| L23 exemplar first, kit, validation wave; L18 model routing; L35 corpus ledgers; L50 enablement lists | stages 1, 7; §3 |
| TAD §2, §3.2, §3.9, §3.13, §3.17–§3.21, §4, §6, §8 | §5.2, §6, stages 2, 5, 6 |
| House rules (KUMON handoff; HANDOFF-2026-11-20 §5) | §3, every stage |
| S3–S6 (exam values, misconception values, two-faced labels) | §8.2; stage 1 gates; EXEMPLAR §5 |
