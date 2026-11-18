# TEST-PREP-SPEC — a test-prep plan built from what the child has been taught

**Written 2026-11-18, 09:20 EST (from `date`), by the engineering lead. Phases 4.5–6.**
**Status:** spec only, no code. No child's name anywhere. Built on `ENGINE-SPEC.md` (the
engine, the weakness function §4.5, the check runner §4.8) and binding on the BUILD-PLAN stage 6.

**The owner's words (DECISIONS M16, 2026-11-18):**

> "I want the regular pages built. And then a possibility to add a customization option where we
> create a test prep set based on when the test might be coming. This could be an additional
> option that builds on the questions and concepts that have been practiced."

**Read as:** an **option on top of** the regular module, not a separate product. The parent says
when a school test is coming and on which chapter; the app plans the days left from what the child
has **already been taught and practised**, weakest first, ends with a practice test in the school's
format, and uses the last session on what that practice test showed. Nothing new is taught under
the name "test prep".

---

## 1. What it is, and what it is not

| It is | It is not |
|---|---|
| A plan of this module's own sessions between today and the test | Extra time or an extra session on top of the day (TAD §3.11) |
| Built from skills whose lesson day is done, ranked by his records | A cram of untaught lessons (only labelled preview items, §3.5) |
| Items from the engine's templates, keys computed by code | AI-written questions, or questions from photos of school work (DECISIONS M6, M9) |
| A mock in the school's A/B/C shape, feedback held, then a review | A timed test; a percentage; a pass or fail (DD11, DD13; TAD §3.5, §3.14) |
| "Ready / needs work" per skill for the parent, as counts | A new mastery rule: "knows" stays the two-day rule (METHODOLOGY §4) |

**Not reused:** the app's older homework/exam-prep tables (`homework_sessions`, `exam_prep_tests`,
`homework_attempts`, migration `20260131000002`) are built on uploaded photos, AI-generated
problems, a timer option and a percentage score. Each of those breaks a rule of this module, so the
feature neither reads nor writes them.

---

## 2. Setting it up (parent page, about one minute)

| Field | Default | Rule |
|---|---|---|
| **Test date** | none | a calendar date in the family's local time zone; stored as a date, not a timestamp |
| **Chapter** | the class's current chapter from the intake's "school layer" (DD24: "the chapter the class is on now") | or picked from a list of the school's chapters **by number and topic only** (DD2), or "I don't know the chapter: pick the topics" (units listed in plain words). The chapter maps to one or more units through `SMUnit.schoolChapter` (e.g. Grade 2 Ch 4 → G2-U05, U06, U07) |
| **Session days** | the enrollment's days (PACING-GUIDE: Mon–Fri); **weekends** toggle | owner, M15: "sessions may include weekends" |
| **No-session days** | none | tap any date in the plan to mark "no session" (a busy day, a holiday) |
| **Test day itself** | no session | the plan never puts a session on the test date |
| **Questions per session** | the module's N (owner O3) | shown, not asked again; the parent may pick "lighter days" (N − 3, never below 5) |
| **Mock** | the session two before the test if S ≥ 4, else as §4 | "one day before" or "two days before" (owner: "one or two days before the test") |
| **Untaught lessons in the chapter** | asked only when some exist (§3.2) | "teach them first" or "practise only what he has learned" |
| **Stretch item in the mock** | off | on only when the parent says the school's test carries one (DD12; EXAM-COVERAGE §2 C7b) |

**Counting the days.** `S` = the number of session dates from the next session not yet done (today
counts if today's session is not done) up to the day before the test, less no-session days. The
setup screen shows one line: "**S sessions** before the test on <date>." If S = 0, no plan is made
(§9).

---

## 3. What goes into the plan

### 3.1 Which skills (taught only)

- A skill is **taught** when its lesson's **lesson day is done** (the lesson's steps and its two exit
  items served, DD1 lesson-day anatomy), or when it is marked "already knows" from previews (DD24).
- The **plan pool** = the taught skills of the chapter's unit(s), plus their entry-check
  prerequisites when those are `learning` or `stuck` (a gap under the chapter shows up on the test).
- Stretch skills join only if the stretch toggle is on, and never count toward "ready".

### 3.2 Untaught lessons

- **Practise only** (always the rule for prep items): no prep item is drawn from an untaught lesson.
  The parent page lists those lessons as **"not taught yet — the test may ask these"**.
- **Teach them first** (offered when S ≥ 2 × (untaught lessons) + 3): the unit's normal **lesson
  days** for those lessons are placed at the start of the plan, in the unit's order, each followed
  by its practice inside the prep sessions. These are teaching days of the regular unit, not prep
  items, and once a lesson day is done its skills join the pool. When S is short of that, the plan
  says plainly: "With S sessions we can teach K of the M lessons left; the others will be new to
  him on the test." The parent picks which K (default: the lessons whose formats the school test
  weighs most, from EXAM-COVERAGE / the unit's check blueprint).

### 3.3 Weakest first (ENGINE-SPEC §4.5, one function)

Skills in the pool are ranked by the engine's `weakness()` tuple: state (stuck > learning with a
recent miss > learning > known that slipped > known) → first-try misses on its last three served
days → the highest help rung used → a scaffold seen on a first try → slow first-try rights (over
his own fluency time, recorded never shown) → days since last served → curriculum order. A skill
with fewer than two served days ranks as "little evidence", just under a recent miss. The split:

- **weak** = stuck, learning, little evidence, or known with a miss in the last 21 days;
- **steady** = known, no miss in 21 days.

### 3.4 Spacing and mixing

- Every **weak** skill is served on **at least two separate sessions** before the mock (TAD §2: same
  session is working memory), with at least one session between them when the plan allows; the
  three weakest come back a third time.
- Each session mixes skills (no session is one skill; E90, DD10 "mixed sets by rule"); a weak
  skill takes **two items** in a session it appears in, with new numbers each time.
- Every school format the chapter's test uses (A choices, B digit boxes / "which way did you do it?"
  / show your work, C a worked problem with a model) appears **at least twice before the mock**.
- Steady skills get one appearance each, as the last item of a session where possible, so a session
  ends on something he can do `[original design]`.
- **Capacity check.** A session of N = 10 holds about 7 weak-skill items, 2 format or steady items and
  at most 1 other slot (§3.5). When 2 × (weak skills) exceeds the plan's capacity before the mock,
  the weakest are served first and the parent sees which skills will be practised once or not at all
  before the test — never silently dropped.

### 3.5 What else may appear in a prep session

| Slot | During a plan | Rule |
|---|---|---|
| **Comebacks** (2 / 7 / 21 days from any check miss, DD10) | at most 1 per session; one due from the test chapter counts as a weak-skill item | the comeback schedule is never reset by a plan; skipped ones keep their order |
| **Returns from other units** | 0 (prep replaces the return share) | resume after the test |
| **Preview** | at most 1, and only if S ≥ 7, never in the last two sessions | labelled "try a new one" (DD24), full ladder, never counts against him; drawn only from the test chapter's untaught lessons |
| **Explain item** | at most 1 per session, on a reason-frame skill of the chapter | DD16 |

Every item is an engine template at a fresh seed: keys and wrong values by code, held by every
ENGINE-SPEC §6 gate (exam values included: test-prep items are a tier-2 surface, §7).

---

## 4. Plan length: rules for 1, 2–3, 4–7, 8–13 and 14+ sessions

`s1 … sS` are the sessions in date order; `sS` is the last session before the test.

| S | Sessions | Why |
|---|---|---|
| **0** | no plan (§9) | — |
| **1** | **s1: a short check, then go over it, then practise its misses.** 5 items in the school's formats, one each on the 5 weakest skills, feedback held → the review of misses (ladder, one re-attempt, score unchanged) → the rest of N: new items on the skills he missed, ending on a steady skill | Even one session keeps the test rule (hold, then review; TAD §3.9); the check finds the misses, the practice works on them |
| **2** | **s1: the mock**, then its review · **s2: from the mock's misses** | With two sessions the mock gives the most information first, and it falls two days before the test |
| **3** | **s1:** weakest-first practice · **s2: the mock** + review · **s3:** from its misses | — |
| **4–7** | **s1 … s(S−2):** weakest-first practice, spaced (§3.4) · **s(S−1): the mock** + review · **sS:** from its misses, then the weakest remaining. With "mock one day before": the mock moves to sS and its misses take the first half of the same session after the review | Two practice sessions at least before the mock, so each weak skill can appear twice |
| **8–13** | lesson days first if "teach them first" (§3.2) · practice sessions spaced · **a mid-plan short check** (5 items, held, reviewed) at about the middle, which re-ranks the pool · **the mock** at s(S−1) (or sS) · **sS** from its misses | The mid check replaces guesswork about what is still weak; the plan re-ranks from it |
| **14+** | the **regular unit calendar runs** (lesson days and practice days as PACING-GUIDE), with the test chapter's skills taking the whole return share by weakness; if the test chapter is the current unit, its **chapter check** is placed at least 3 sessions before the test window and serves as a first mock · **the last 7 sessions follow the 4–7 rule** (fresh-form mock) | A long lead keeps teaching new lessons; prep only steers returns until the last week |

After every session the plan **re-ranks the future sessions** from the new records (TAD §4: re-read
progress after every save); the mock's date never moves unless the parent moves the test.

---

## 5. The mock (the practice test)

- **Shape:** the chapter check's A / B / C sections, weights 2 / 2 / 3, about 8 items, at least a third
  of the parts asking for a model or shown steps (DD11; EXAM-COVERAGE §2). For a subtraction chapter
  it is the G2-U04-CK blueprint at a fresh seed (ENGINE-SPEC §7.4). A chapter spanning several units
  uses the multi-unit blueprint restricted to those units.
- **Only taught skills.** A part whose skill is not taught is left out and the parent page says which
  test topics the mock did not cover. Points are reported over the parts sat ("9 of 12 points").
- **Fresh form:** every item differs in prompt and numeric surface from every check form he has sat
  (`freshForm.ts`); no lesson example's operands or keys (CURRICULUM-MAP §7.12); no exam value
  (tier 2).
- **Feedback held:** no colour, sound or "try again" until the end; Check never locked; a blank is
  recorded as blank; read aloud (DD17); **no clock on the child's screen** — the parent sees a
  suggested time only (EXAM-COVERAGE §2).
- **Review after:** each missed part walked with the ladder (what it means → use what you know → a
  way to finish → the answer), one re-attempt, answers written with the `review:` prefix; **the
  score never changes** (TAD §3.9; `checkReview.ts`).
- **Records:** score as counts per section and the two category rows ("concepts and procedures",
  "reasoning", the module's categories, DD11); every missed part enters the 2 / 7 / 21-day comeback
  pool (TAD §3.13); the mock is **one day's evidence**, never "knows" (METHODOLOGY §4).
- **Short mock:** if the parent set N below 8, the mock is still one sitting of the full form (the
  plan shows that session as "practice test, about 8 questions"); the parent may pick "short practice
  test" (Sections A and B only).

## 6. The last session: from the mock's misses

1. For each part missed on the mock (re-attempted or not): **two new items of the same skill and
   format**, the ladder available, new numbers.
2. Then the weakest skills not on the mock, if N allows.
3. **Ends on a steady skill** he gets right `[original design]`.
4. If the mock had no misses: a mixed session of the weakest skills in the school's formats.

---

## 7. Gates for the feature (each with a broken control)

| Gate | Rule | Broken control (must fail) |
|---|---|---|
| `sm-prep-taught-only-test` | no prep, mid-check or mock item comes from an untaught lesson, except `role: preview` items, which are labelled and never scored | a plan fixture drawing one item from an untaught lesson without the preview role |
| `sm-prep-spacing-test` | every weak skill is on ≥ 2 separate sessions before the mock whenever capacity allows; the shortfall list is shown when it does not | a plan serving a weak skill twice in one session and never again |
| `sm-prep-length-test` | each S in 1 … 20, with weekends on and off and random no-session days, builds the shape of §4 (mock position, misses session last, no session on the test date) | a builder that puts the mock on the test day |
| `sm-prep-mock-test` | the mock runner emits no per-item feedback; the review never changes the score; misses enter the comeback pool | a runner that colours a wrong answer during the mock |
| `sm-prep-determinism-test` | the same plan inputs and the same records give the same plan; a reload restores the session's place and count (TAD §3.20) | a builder reading the wall clock inside the plan |
| `sm-prep-child-copy-test` | no percent, no "fail", "wrong", "not ready", no countdown on child surfaces (TAD §3.14; BB-G9) | a child line "70% ready" |
| `sm-exam-value-test` (ENGINE §6.1) | test-prep items and mocks are on the tier-2 enablement list | a prep fixture whose key is a tier-2 value |

---

## 8. What the parent and the child see

**The parent (plan page).**
1. One line: "**Subtraction test, <date>. 6 sessions before it.**" (the chapter by number and topic).
2. **The plan**: one row per session — date, kind (practice / lesson / short check / practice test /
   from the test's misses), the skills in plain words (DD20 glossary). Days off greyed with "no
   session". Done sessions show "done" and the counts ("8 of 10 right on the first try").
3. **Skills for this test**, three groups, counts only:
   - **ready** — right on the first try with no help on the last **two separate sessions** it was
     served (including the mock if it was there), and no miss since; if it also meets the full
     two-day rule within his fluency time, the skills map already says "known";
   - **needs work** — served, but not yet ready; with his last answers on it and **one thing to
     try**, offered, never assigned (TAD §3.12); a stuck skill says "stuck here" (METHODOLOGY §4);
   - **not taught yet** — the test may ask these (§3.2).
   The header counts them: "4 ready · 2 need work · 1 not taught yet."
4. **After the mock:** "**11 of 15 points**" (A, B, C), the items missed with his own answers, the two
   category rows, and what the last session will do with them. Never a percentage.
5. **After the test:** an optional note — "How did it go?" — where the parent may type a score as
   counts and a line. It is a note, never evidence; **no photos are asked for** (M6, M9). The plan
   closes; the exam-skills map stays as it is (HANDOFF §8).

**The child.** "Test practice · session 3 of 6" on the start screen and "Question k of N" on every
screen (TAD §4); the same teacher, ladder, read-aloud and Check as any day; the mock is "a practice
test: I will tell you how it went at the end"; the end screen gives counts in words he can show a
grown-up ("You did 8 questions. Let's look at 3 together."), never a score, a percent, a countdown of
days or the words "fail" / "wrong" (TAD §3.10, §3.14). Whether he is told the test date is the
parent's choice (a toggle, default off).

---

## 9. Edge cases

| Case | What happens |
|---|---|
| **Date in the past** | refused: "That date has passed." Offers the after-the-test note (§8.5) |
| **Date is today** | no plan; offers the after-the-test note for later |
| **Date is tomorrow, today's session not done** | S = 1: the one-session rule |
| **Date far off (S > 40)** | the plan is saved; the regular calendar runs; the parent sees "test practice starts on <date>" (the date S becomes 14) |
| **Test on an untaught chapter** (no lesson day done in its units) | "Teach them first" is the only offer when S ≥ 4: lesson days in the unit's order, two sessions per lesson, short lessons (one day each, the GRADE-2 §0.3 pattern) when S is short; prep items only as lessons become taught; the mock covers only taught parts. With S ≤ 3: no mock; one line to the parent — "his class is ahead of this module; the home note for this chapter is here" (DD24 four-part note) — and the sessions run as lesson days. No untaught item is ever called practice |
| **Partly taught chapter** | §3.2 choice |
| **Two tests close together** | two plans may be active, never more; one combined session a day; while both are pending, the nearer test gets at least 60 % of each session's items `[original design]`; each test has its own mock; never two mocks in one session — on a clash the nearer test keeps the slot and the other mock moves one session earlier. **Same chapter twice** (a quiz then a test): one plan; a second mock (fresh form) only if the dates are ≥ 3 sessions apart |
| **Test date moved** | done sessions stay done; future sessions re-planned; the mock re-placed; if the mock was already sat and the test moved ≥ 4 sessions later, a second fresh-form mock is offered |
| **A session missed** | never doubled up; the remaining sessions re-plan by §4 for the new S; a missed mock moves to the next session if one remains, else the last session becomes the one-session rule |
| **Everything ready** | the plan keeps the mock and the misses session; practice sessions become mixed maintenance in the test's formats; the parent may choose lighter days |
| **No records for taught skills** (e.g. taught only on the interim page, whose records stay on the device) | ranked as little evidence; the first session is the short check of the one-session rule, which ranks them. Importing the interim page's records is a separate owner decision (BUILD-PLAN stage 6) |
| **Chapter spans several units** | skills pooled; the multi-unit mock blueprint (§5) |
| **Chapter not in the lookup** (another book, another grade) | the parent picks topics from the unit list in plain words |
| **N changed mid-plan, or a weekend toggled** | re-plan the future sessions; the mock stays on its date if that date is still a session |
| **A stuck skill** | served with the model one rung lower (METHODOLOGY §4) and shown "stuck here" with one thing to try; prep never hides it |
| **Plan cancelled or deleted** | the attempts stay (they are real evidence of his work); only the plan rows go |

---

## 10. How it fits the regular calendar and the other two programs

- **PACING-GUIDE.** Prep sessions **replace** this module's sessions on those dates; they never add a
  session. When the test is on the **current unit**, prep sessions are that unit's practice days with
  a test focus, so the calendar barely moves. When the test is on a **past chapter**, the prep
  sessions are days the calendar did not plan: the plan page says how many and what it does to the
  year ("Test practice uses 5 days. The year now has 1 spare day."), and if the calendar falls more than
  a week behind, PACING-GUIDE's own rule applies (measurement, data and shape lessons drop to one day,
  previews pause; number, operation and bar-model lessons are never cut).
- **His calendar now.** The class's subtraction test falls in the first week of December (M15); the
  interim page covers it, because the module cannot be built and gated by then. The feature is for
  the tests after it (the bar-model chapter test is the next likely one, PACING-GUIDE "his calendar").
- **Kumon and Best Brains.** Untouched. Test prep adds no minutes and no sessions to them, and never
  asks the parent to teach a second method (HANDOFF §8; TAD §3.12). Prep items use this module's
  method and its METHOD-LEDGER link sentence. Where a fact gap shows (a facts pair missed), the parent
  page may name the Kumon-style sheet range, offered, never assigned (DD13). The parent's "no session"
  toggle is the release valve on heavy days.

---

## 11. Data it reads and writes

**Reads** (ENGINE-SPEC tables, BUILD-PLAN stage 0): `sm_enrollment` (N, session days, weekends,
read-aloud, intake: grade, book, the class's chapter) · `sm_unit_state` (lesson days done, checks sat,
"already knows" marks) · `sm_item_attempts` (first try, tries, every answer tried, first-try time on the
monotonic clock, scaffold visible, ladder rung, model rung, role) · `sm_skill_state` (the projection the
weakness function reads) · the comeback ledger (derived from attempts, as `comebacks.ts`) · the
catalogue (units, chapter lookup, skills, check blueprints).

**Writes:**
- `sm_test_prep_plans` — `id, child_id, chapter jsonb {number, topic}, unit_ids text[], test_date
  date, settings jsonb {weekends, off_dates[], mode: 'teach-first' | 'practise-only', mock_offset:
  1 | 2, short_mock, include_stretch, lighter_days, tell_child_date}, plan_seed bigint, status
  ('active' | 'done' | 'cancelled'), after_test_note jsonb, created_at, updated_at`.
- `sm_test_prep_sessions` — `id, plan_id, session_index, date date, kind ('lesson' | 'practice' |
  'short-check' | 'mock' | 'misses'), planned_skill_ids text[], manifest jsonb (slots: templateId,
  seed, role — frozen when the session starts, so a reload restores it), status, completed_at`.
  Future sessions are rewritten by re-planning; started and done sessions never are.
- Attempts go to the ordinary `sm_item_attempts` with `role` `prep` / `short-check` / `mock` /
  `review` and the `plan_id`, so prep work is ordinary evidence (review answers never count).
- Mock scores go to `sm_check_sittings` with `kind: 'mock'`.

RLS as the `bb_` tables (a row is readable and writable only by the parent who owns the child). A plan
**never writes a skill state**; only attempts move states, through the engine's pure function.

---

## 12. Compliance map

| Rule or source | Where applied |
|---|---|
| Owner M16 (the option builds on what has been practised) | §1, §3.1 |
| Owner M15 (weekends allowed; the interim page for 1 Dec) | §2, §10 |
| TAD §2 knows = first try, no scaffold, two days | §3.4, §5, §8 "ready" |
| TAD §3.2 help ladder; §3.3 scaffolds recorded | §5 review, §6 |
| TAD §3.5 speed not shown | §5 no clock, §3.3 time recorded only |
| TAD §3.6 schedule by weakness, spaced returns | §3.3, §3.4 |
| TAD §3.9 tests hold feedback, then review, score unchanged | §4 (S = 1 included), §5 |
| TAD §3.10 a miss is information | §8 child copy |
| TAD §3.11 day = question count, never more time | §1, §2, §10 |
| TAD §3.12 parent: knowing not finishing; offer, never assign; one method | §8, §10 |
| TAD §3.13 every miss comes back; every state a way out | §3.5, §5, §9 |
| TAD §3.14 counts not percents; a stalled screen says where it is at | §8 |
| TAD §3.20, §4 resume, k of N | §7 determinism, §8 |
| DD1 N; DD2 chapters by number and topic; DD10 returns and comebacks; DD11 the check; DD12 stretch; DD13 no clock; DD16 explain; DD17 read aloud; DD20 glossary; DD24 intake, previews, home note | §2–§8 |
| PACING-GUIDE (replace, never add; the behind-a-week rule) | §10 |
| EXAM-COVERAGE §2 (mock shape), §4 (tier 2 surfaces) | §5, §7 |
| CURRICULUM-MAP §7.12 (no lesson-example reuse) | §5 |
| DECISIONS M6, M9 (no exam items, no photos) | §1, §8 |
| ENGINE-SPEC §4.5 weakness, §4.8 check runner, §6 gates | §3.3, §5, §7 |
