# Handoff: the full Singapore Method module, starting with Grade 1 (2026-11-20)

Start here in a new conversation. The start prompt is at the bottom (§9).

## 1. The owner's ask (verbatim, 2026-11-20)

> "Please commit, merge and push your enhancements now. And draft me a handoff prompt to start
> bigger work in a new conversation. Start with Grade 1. I want the full solution. I also want a
> capability to create a test prep guide but that is a future enhancement."

> Earlier the same day: "I want just one setting i.e. the singapore math module but it is
> customizable based on the needs." · "the real module should start from the beginning for general
> students but there should be a test to see where he stands."

## 2. Where things stand (all on `main`, commit 0150c4a and the commit carrying this file)

- **Live in the app (v1):** module id `school-math`, shown as **"Singapore Method"**. Route
  `/school-math` → a home with **Subtraction Test Prep** (12 sessions + a practice test, served as a
  static page from `frontend/public/school-math/test-prep.html`) and **My Scorecard**. Records stay
  on the device, per child (`?c=<child id>`). The dashboard card appears on a device after a grown-up
  opens `/school-math` there (`frontend/src/modules/school-math/access.ts`). No database tables yet.
- **The curriculum (documents, checked):** Grades 1–5, 59 units, 285 lessons, design defaults
  DD1–DD25, the method ledger (one method per skill across Kumon / Best Brains / this module),
  pacing to a 36-week school year, the Grade 2 entry plan and mock test:
  `modules/school-math/design/curriculum/`. Evidence: `modules/school-math/research/` (frozen ledger
  E1–E269 + post-freeze P3.1 E270–E291).
- **The build specs (written, not built):** `modules/school-math/design/engine/ENGINE-SPEC.md`,
  `TEST-PREP-SPEC.md`, `BUILD-PLAN.md` (stages 0–8; a "fast track" part was replaced by v1 above).
- **History and rules:** `modules/school-math/meta/` — `NEXT-STEPS.md`, `DECISIONS.md` (M1–M20),
  `LEARNINGS.md` (S1–S6), `PROGRESS.md`.
- **The first learner:** age 7, Grade 2, school uses Math in Focus Grade 2; also does Kumon (Level C)
  and Best Brains (Level B). His exam reading has no name: `research/phase0/EXAM-READING.md`. He likes
  the test-prep sessions "because they are related to his school problems" (owner, 11-19).

## 3. The goal of this build: one customizable Singapore Method module (DECISIONS M20)

| Part | What it does | Source |
|---|---|---|
| **Settings** (parent) | grade · the school's book and current chapter (optional) · questions per day · days per week · topics the child finds hard · a test date when one is coming | DD24, DD25, PACING-GUIDE |
| **Placement** | starts every child at Unit 1 of the grade; a short placement test (two same-structure items per unit, prerequisites first, early stop, feedback held) places out what the child already knows; placed-out skills are confirmed by returns | DD25, DD3, DD4 |
| **My path** | the units of the grade in order (school-chapter order when the school layer is set), lesson days and practice days, help ladder, returns (DD10), preview items (DD24), chapter checks in the school's A/B/C format with feedback held and a review after (DD11), then the next grade | METHODOLOGY-MODEL §2, GRADE-n.md |
| **My scorecard** | the child's view: skills got it / practising / coming up, sessions and checks in counts (never percentages); the parent's view below: misses with his own answers, help used, time | tutoring-app-design §2, §3.12 |
| **Records** | `sm_`-prefixed tables so progress follows the child to any device; the v1 device records may be offered for import (dry-run list first, owner's word) | BUILD-PLAN stage 0 |
| *Future (not now)* | **Test prep guide**: the parent enters a chapter and a test date and the module builds a prep plan from taught skills, weakest first, ending with a mock and a session on its misses | TEST-PREP-SPEC.md (keep the design; build after the path) |

## 4. Order of work: Grade 1 first, then the full solution

1. **Read** (§8), then re-check `BUILD-PLAN.md` against this handoff: placement and settings are new
   stages; test prep moves to "future"; the start grade is **Grade 1**, not the G2-U04 exemplar.
2. **Stage 0 — records:** `sm_` tables + RLS mirroring `bb_`; migration through the Supabase
   management API: dry-run as ONE statement that rolls itself back, apply only on the owner's word,
   record in `supabase_migrations.schema_migrations`.
3. **Stage 1 — engine + the Grade 1 exemplar:** the engine (ENGINE-SPEC) with **G1-U02 (number
   bonds; + and − within 10)** or **G1-U01** as the exemplar unit, proven through BOTH gates
   (deterministic validator incl. code-computed answers, `verifyFor`, picture-kind, exam-value tiers;
   and an LLM authenticity gate with an adversarial re-check) before any other unit (L23).
4. **Stage 2 — the Grade 1 figures and inputs** (METHODOLOGY §6: number bond, ten frame, counters,
   masked counting tape, blocks on a chart, shape partition, clock, picture graph), touch AND keyboard,
   each with a gate that has a broken control.
5. **Stages 3–5 — Settings, Placement, My path (day flow, chapter check + review), My scorecard +
   parent view** — for Grade 1.
6. **Stage 7 — fan-out of the other Grade 1 units** (authoring kit from the exemplar → a validation
   wave of 2 units → the rest), then Grade 2, 3, 4, 5 in the same way. Fan-out workflows run only on
   the owner's word.
7. **Stage 8 — persona tests** (an expert-teacher persona works every item; a child persona; the
   parent), photographs in the harness, a mock chapter check in the school's format.
8. Replace the v1 test-prep page in the module home only when its sessions exist in the engine
   (keep it until then; he uses it).

## 5. Binding rules (from the house rules and this program)

- **Commit, push, merge, migration apply and go-live are separate owner words.** Explain before
  commit: the exact pathspec and contents. Push `git push origin best-brains-content-engine:best-brains-content-engine`;
  squash-merge; then sync the branch with main by a normal merge (a hard reset + force push was blocked
  by the safety check on 11-18).
- **Never** the child's name in any file, prompt or outbound text; the exam photos never enter the repo;
  agents read EXAM-READING.md only. The school test's values never appear as operands, keys or choices
  (EXAM-READING "Exam values"; EXAM-COVERAGE §4 tiers).
- tutoring-app-design skill, all of it: "knows" = first try, no help, two separate days; help is a
  ladder; Check never locked; read aloud through Grade 2; tests hold feedback, then review; every picture
  is the kind of thing its words name and gives nothing away; every label asks for exactly one quantity
  (LEARNINGS S6); a repeated answer repeats the clue; a multi-part question advances with the main button.
- Every gate ships a broken control that must fire; existing debt is a ratchet. Run the battery
  serially (4 GB machine, 1–2 agents at a time), `tsc` at most twice per change set, photograph every
  screen change in `frontend/scripts/screen-harness/` and look at it; verify live by fetching the deployed
  site.
- After editing the v1 page source, run `node frontend/scripts/sm-sync-test-prep.mjs` (and `--check`).
- Decisions go to the owner as inline tables with a recommendation; ask before anything that costs money
  or changes the child's records. The owner wants usage kept modest: one agent at a time where possible,
  no long fan-outs without his word.

## 6. Model routing

Fable for design reviews, verdicts and the authenticity/pedagogy gates (the monthly Fable limit reset on
Nov 20, 6 pm ET); Opus for building and research. Owed Fable items: sign-off on REVIEW-2026-11-17's N1
fix and on the proposed G2-U04 chapter check (BUILD-PLAN).

## 7. Owner decisions still open (ask inline, with a recommendation)

| # | Decision | Recommendation |
|---|---|---|
| O3 | questions per day, days per week | 5–6 on a lesson day, ~10 on a practice day; 5 short school days |
| O4 | the teacher's character and voice | a new character (not Ms. Wren); free voice tier; per-teacher voice map (see `docs/HANDOFF-2026-11-17-MS-WREN-VOICE.md`) |
| — | the school calendar (his) | needed for his pacing dates |
| — | import the v1 device records into `sm_` tables | dry-run list first |
| O7 | each commit, push, merge, migration, go-live | separate words |

## 8. Read first, in order

1. This file.
2. `modules/school-math/meta/NEXT-STEPS.md`, `DECISIONS.md` (M1–M20), `LEARNINGS.md`.
3. `docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md` (house rules, the battery, devices).
4. The `tutoring-app-design` skill.
5. `modules/school-math/design/curriculum/METHODOLOGY-MODEL.md`, `DESIGN-DEFAULTS.md` (DD1–DD25),
   `CURRICULUM-MAP.md`, `GRADE-1.md`, `METHOD-LEDGER.md`, `PACING-GUIDE.md`.
6. `modules/school-math/design/engine/ENGINE-SPEC.md`, `BUILD-PLAN.md` (TEST-PREP-SPEC.md only to keep
   the future feature in mind).
7. Best Brains' engine lessons: `modules/best-brains/meta/LEARNINGS.md` (L17–L53) and the reuse points in
   ENGINE-SPEC.
8. Code: `frontend/src/modules/core/contract.ts`, `registry.ts`, `frontend/src/modules/school-math/`,
   `frontend/src/modules/best-brains/` (patterns), `frontend/scripts/screen-harness/`.

## 9. Start prompt (paste into a new conversation)

```
Continue MindFoundry: build the full Singapore Method module (repo
/home/usthr/Penta_University/Math_Tutor/MindFoundry, branch best-brains-content-engine).
Read docs/HANDOFF-2026-11-20-SINGAPORE-METHOD-FULL-BUILD.md first and follow its reading list (§8).

Goal: one customizable Singapore Method module — parent Settings, a placement test, My path through
every unit, chapter checks with held feedback and review, and the child's scorecard with a parent
view — with records in sm_ tables. Start with Grade 1 and finish it fully before Grade 2; then
Grades 2–5 the same way. The test prep guide is a future enhancement: keep its spec, do not build it now.

Work stage by stage as §4 lays out: the engine with one Grade 1 exemplar unit through both gates
before any fan-out. Show me a short plan first, then stop for my word at each owner decision in §7,
before every commit, push, merge and migration, and before going live. Fable for design reviews and
gates, Opus for building. Keep usage modest: one agent at a time unless I say otherwise.
Never use my son's name anywhere.
```
