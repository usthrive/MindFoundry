# ENGINE-SPEC — school-math question engine (Phase 4.5)

**Written 2026-11-18, 09:20 EST (from `date`), by the engineering lead. Phase 4.5.**
**Status:** spec only, no code. Starts Phase 4.5 (DECISIONS M16). Owner words still needed for
every commit, push, merge and migration (HANDOFF §10 O7). No child's name anywhere.

**Sources of authority, in order.** `docs/HANDOFF-2026-11-17-NEW-MATH-APPROACH.md` §6, §7, §8, §11,
§12 (binding) → `design/curriculum/METHODOLOGY-MODEL.md` (§2 the loop, §4 "knows", §6 figures and
inputs, §6.3 gates, §7 engineering contract) → `DESIGN-DEFAULTS.md` (DD1–DD24) → `GRADE-2.md`,
`EXAM-COVERAGE.md`, `CURRICULUM-MAP.md` §7, `PACING-GUIDE.md` → the Best Brains engine
(`modules/best-brains/build/CONTENT-GENERATION-PLAN.md`, `CONTENT-GENERATOR-FIX-SPEC.md`,
`FANOUT-AUTHORING-KIT.md`, `CONTENT-STYLE-GATE.md`, `meta/LEARNINGS.md` L17–L53) → the skill
`tutoring-app-design` ("TAD §n"). Learnings of this module are "S1–S5"
(`modules/school-math/meta/LEARNINGS.md`).

**Exam values.** This spec quotes none of the school test's numbers. Every gate that needs them
reads the section "Exam values for the no-exam-items gate" of `research/phase0/EXAM-READING.md`
at run time (EXAM-COVERAGE §4) and never copies them into code, content or fixtures.

---

## 0. The engine in one paragraph

The engine turns the written curriculum into the questions a child meets, the same way the Best
Brains engine does (L17): **deterministic templates with a seeded generator**; every key, every
model schema and every wrong-answer value **computed by code** (`answerFor`, `verifyFor`); a
**deterministic validator** and an **LLM authenticity gate with an adversarial re-check** that
must both pass; gates that hold for **every seed**; a **coverage ledger** and a **cross-unit
context ledger**. What changes is the shape around the items: Best Brains packs a **week** of five
days for everyone; this module serves **units** of lessons, aligned to school chapters (DD1, DD2),
and builds each **day** from the child's own records — a lesson day or a practice day, with
returns (DD10), previews (DD24) and comebacks — closed by a **chapter check** in the school's
A/B/C shape with feedback held (DD11). And the child no longer only types a number: he **builds**
the model (bond, chart, bar, jumps, digit boxes), so the engine grades models, not just answers
(HANDOFF §6).

---

## 1. Reuse map at a glance

| Part | Reused as-is | Extended | New |
|---|---|---|---|
| Seeded generator | `generator/rng.ts` (`streamRng`, xmur3 → mulberry32) | stream labels per (child seed, unit, day, slot) — L45 | — |
| Answers by code | `TemplateDef { answerFor, verifyFor }` pattern, `templates/registry.ts` lookup | new validations (§3.3) each with an `answerFor` | subtraction / regroup misconception library (§3.4) |
| Surfaces & identity | `generator/surface.ts` signatures, `lib/guard.ts` `drawUniqueItem`, `lib/format.ts` | — | lesson-example exclusion list per unit (CURRICULUM-MAP §7.12) |
| Validator | `validator.ts` QG-1, QG-3, QG-4, QG-5, QG-11, QG-12a–d, QG-13 | runs on a new item shape (`SMItem`, §4.2); enablement list covers the new validations (L50) | SM-V gates (§6) |
| Figures | 19 kinds, `components/figures/*`, `figures/assert.ts`, `figures/prompt.ts` (`spoken`, `figureScene`) | 9 new kinds N-F1–N-F9 (§3.1) | — |
| Inputs | `inputSurface.ts` law (one description the screen and the gate both read), `answers.ts` `checkAnswer` | 11 new surfaces N-I1–N-I11 (§3.2) | multi-part items with ordered reveal (§4.2) |
| Evidence | `services/attemptEvidence.ts` (monotonic clock, tried answers, scaffold seen, help rung) | + model rung, self-check diff, strategy chip, ladder rung, misconception rule | skill-state machine with stall rule (§4.6) |
| Checks | `session/checkReview.ts` (held feedback, review, score unchanged), `session/comebacks.ts` (2/7/21), `session/freshForm.ts` | A/B/C sections with 2/2/3 points and two category rows | chapter check runner + mock + test-prep mock (§4.8) |
| Day flow | `session/dayFlow.ts` rule ("k of N"; never a one-item screen) | — | unit/lesson/day model: lesson day, practice day, returns, previews (§4) |
| Authenticity gate | `CONTENT-STYLE-GATE.md` two-pass protocol, decision logic, JSON verdict | new rubric for this module (§5.2) | adversarial recompute pass (§5.3) |
| Ledgers | `lib/ledger.ts` prior-cell ledger; `bb-cross-week-test.ts` corpus scan | keyed by unit, not week | coverage ledger from GRADE-n item-type columns (§5.5) |
| Read-aloud, AI reading | `ttsService` / `AudioButton`; `ai-service` explanation review | per-teacher voice map (MS-WREN handoff) | — |

**Ownership rule.** Pure Best Brains modules (`rng.ts`, `surface.ts`, `format.ts`, `guard.ts`,
`figures/prompt.ts`, `answers.ts`) are **imported read-only** from
`frontend/src/modules/best-brains/`. The figure library is shared by the handoff's own rule (§6:
"new figures join that library under the same rule"), so the nine new kinds are **added to it in
place, additively**: the Best Brains packs must stay byte-identical (proved by hashing every pack
at two seeds before and after; TAD §6 "prove the content bytes unchanged"). Kumon's live
`WorksheetProblem.tsx` is **not edited**: N-I1 is a new component that copies its interaction
rules (§3.2). Moving shared code into `modules/shared/` is a later refactor, on the owner's word.

---

## 2. What is reused as-is (exact list)

1. **`rng.ts`.** `streamRng(seed, label)`. Labels are `sm:<childSeed>:<unitId>:<dayIndex>:<slot>`
   for day items and `sm:<childSeed>:<unitId>:CK:<form>` for checks. Per L45, the seed pair used
   by any rotation test is checked for independence first (the Best Brains pair 11 / 202 was
   correlated; 11 / 33 is not).
2. **The registry contract.** `TemplateDef { id, answerFor?, verifyFor? }`. The module's own
   registry (`frontend/src/modules/school-math/engine/registry.ts`) has the same shape, so the
   QG-5 arithmetic audit and the QG-11 claim audit run unchanged. Every emitted item's
   `templateId` must resolve (FIX-SPEC §5 "templateId-resolves").
3. **`surface.ts` + `guard.ts`.** Numeric-token and commuted signatures; `drawUniqueItem` so QG-1
   (no repeated operand tuple in a day or a check form) passes by construction.
4. **`format.ts`.** Every interpolated quantity goes through the semantic formatter (L26, L28):
   `fmtInt` for numbers to 1,000 (comma from 1,000), unit nouns ("1 ten", "12 ones") through
   `countNoun`. No raw `${n}` in a prompt.
5. **Validator gates** QG-1, QG-3 (each distractor has a misconception), QG-4 (form
   disjointness), QG-5 (arithmetic re-derivation), QG-11 (embedded-claim audit, prose anchor
   audit), QG-12a–d (surface defects: singular/plural, articles, "1 hundreds"), QG-13 (figure
   asserts agree with the item).
6. **Figure library.** All 19 kinds and their renderers; `checkFigureShape`, `figureValue`;
   `figures/prompt.ts` `speakablePrompt` and the `spoken` field (L48: the spoken line names the
   picture, never the asked value).
7. **`attemptEvidence.ts`.** `monotonicNow()`, the dwell clock paused while the app is hidden,
   `triedAnswers`, `scaffoldShownBeforeFirstCheck`, `helpRungBeforeFirstCheck` (TAD §5.4, §8).
8. **`checkReview.ts`, `comebacks.ts`, `freshForm.ts`.** The review reads the attempt log and
   marks review re-answers with the `review:` prefix so they never count; the comeback schedule
   (2 → 7 → 21 days, three clean answers in a row settle it); a fresh form keeps only if every
   item differs from every earlier form.
9. **`dayFlow.ts` rule.** A screen exists only with its items; "Question k of N" counts the day,
   not the screen (TAD §4).
10. **The explanation review.** The `ai-service` edge function reads the child's typed sentence
    formatively from the item's own rubric (TAD §7): never moves a score, short timeout, daily
    quota, no name in the payload.

---

## 3. What is extended

### 3.1 Nine new figure kinds (METHODOLOGY §6.1)

Each joins `BBFigureType`, gets a renderer in `components/figures/`, a `checkFigureShape` branch,
a `figureValue` selector for QG-13, a kind-gate vocabulary entry (§6.2) and a render test that
measures the drawing (L32). The L33 column is a rule the generator obeys and the answer-giveaway
gate checks.

| Id | Kind name | Built on | What the generator must withhold where the child answers (L33) | `spoken` (never the asked value) |
|---|---|---|---|---|
| N-F1 | `number-bond` (2- and 3-part) | new | the asked circle(s) are empty; never a filled bond beside a find-the-part item; 3-part form: part circles carry place headings, never values | "a number bond: a whole and two parts" |
| N-F2 | `pv-disks` | `place-value-chart` | on regroup items, the pre-trade state only | "place-value disks on a chart" |
| N-F3 | `open-number-line` | `number-line` (no ticks) | landings blank on "finish the jumps"; the target is the question, never a landing | "an open number line with jumps" |
| N-F4 | `bar-model` v2: brace, "?", difference gap, chained bars | `bar-model` | on "which is more" items, bars equal until the child decides (L51) | "a bar model" + the labels' names, no values asked |
| N-F5 | `column-digits` (operands with boxes, carry row, subtraction regroup row) | `column-method` | the carry / regroup row empty on missing-digit items; no box highlighted until tapped (TAD §3.17) | "a column subtraction with boxes" |
| N-F6 | `counting-tape` with a mask | `number-track` | the strip beyond the start masked on count-on/back items | "a counting tape" |
| N-F7 | `fraction-strip` | new | parts never numbered on "what fraction" items | "a strip in equal parts" |
| N-F8 | `match-rows` (two rows matched one-to-one) | `counters` | leftovers never ringed (L33's own case) | "two rows of objects" |
| N-F9 | `pv-blocks-chart` with pre-trade / post-trade states | `place-value-chart` + `base-ten-blocks` | on "regroup" questions, only the state before the trade | "blocks on a place-value chart" |

G2-U04 needs N-F1, N-F3, N-F4 (read rung, beside the column in L2–L3), N-F5, N-F6, N-F9. N-F2, N-F7
and N-F8 are built when Grades 1, 3 and 4 fan out (BUILD-PLAN stage 7).

### 3.2 Eleven new input surfaces (METHODOLOGY §6.2)

Each joins the `InputSurface` union in this module's `inputSurface.ts` (same law: the screen
renders from it and the gate asserts against it), works with a finger and with a keyboard, and
grades only what it asks. "Graded" means against a code-computed target.

| Id | Surface kind | Touch / keyboard | Graded against | Broken control (must fail the model-input gate) |
|---|---|---|---|---|
| N-I1 | `column-digits` | tap a box, pad digit; arrow keys move, digits type, Enter advances; carry or regroup row tappable | each box vs the computed column digit; the carry as "how many new tens" (any correct value, 2 or 3 included); subtraction: the donor digit and the "1" prefix of the receiver vs the computed regroup chain | a grid that accepts any carry value |
| N-I2 | `bond` (2- and 3-part) | tap the empty circle / Tab, type | the part or whole; the orientation when the child picks the whole; 3-part: each part by its place value, a 0 part typed as 0, an empty circle is "not yet" | a bond that accepts a value in the wrong part |
| N-I3 | `pv-build` | drag pieces, "group ten" / "open one" button; arrow keys pick a column, digits say how many to move, Enter moves, Space groups or opens | the chart state after the asked trade; count per column; compared only on commit | a chart that shows the target count while building |
| N-I4 | `counter-split` | drag counters into two circles / number keys | both parts sum to the whole; a required part | a split graded on one part only |
| N-I5 | `bar-build` (DD7) | four decisions: bar count, the longer bar, chips onto parts / brace / gap, the sentence; Tab to a slot, Enter places | each decision vs the item's schema (part-whole / comparison / two-step; unknown position); two known parts in either order | a builder that accepts any slot; the item's own model present in the DOM before commit |
| N-I6 | `jumps` | jump chips in order; after each jump the child **types the landing** before the next is drawn | each typed landing; the route lands on the target; on "in your head" items the answer is typed **first**, the jumps after | a tool that prints landings as chips are tapped |
| N-I7 | `ten-frame-fill` | tap cells / Space toggles | the frame state vs the make-ten (or take-from-ten) step | a frame that prints the total while filling |
| N-I8 | `sentence` (movable blank) | chips or typed with a shape hint | the sentence matches the model; the blank's value | a shape hint that contains the key (also the shape-hint gate) |
| N-I9 | `strategy-chips` | tap one of 3–4 named routes | **not graded** (L41: a probe has no key); recorded | a chip that writes `correct: true/false` |
| N-I10 | `reason-frame` | `truth` rows, then `explain`; on error analysis the fix first | rows graded (balanced, shuffled, L51); the sentence read formatively | rows that state the repair shown before the fix is committed |
| N-I11 | `paper` | type the sentence; tap "I drew it" | the typed sentence only; record says "paper practice done" (DD8) | a button labelled "Check" on the drawing |

G2-U04 needs N-I1, N-I2, N-I3, N-I6, N-I7 (take-from-ten), N-I8, N-I9, N-I10, N-I11. N-I4 and N-I5
come with G2-U03 and G2-U05. Until N-I5 exists, bar items are served as `choices` among drawn
bars (the N-I25 pattern in METHODOLOGY §6.2) and the coverage ledger records the debt.

**N-I1 and the Kumon grid.** The new component copies the Kumon grid's tested habits — right-to-left
boxes, the carry row, the subtraction "regrouped values row" between the top number and the
second (Kumon's convention: the donor shows its reduced digit, the receiver a small "1" prefix),
Enter after the last box — so a child moving between modules meets one way of writing a column
(METHOD-LEDGER B8, B9: "Kumon: a crossed digit; here: the trade"). Kumon's own file and its
gates (`kumon-stacked-multiplication-test`, `kumon-help-ladder-test`) are not touched.

### 3.3 New answer validations (each registered in the validator's QG-5 enablement list, L50)

| Validation | Answer stored as | Graded part by part | `answerFor` returns |
|---|---|---|---|
| `digit-boxes` | `{ boxes: {col: digit}, marks: {col: digit} }` | each box; each carry / regroup mark; a mark is graded only where the item asks for marks (B4-style "show your work": 1 point the answer, 1 point the marks) | the full column with marks |
| `bond-parts` | `{ whole, parts[] }` | the asked circle(s); orientation when chosen | the bond |
| `chart-state` | `{ h, t, o }` after the trade | each column count | the post-trade state |
| `jump-landings` | `{ landings[], route }` | each landing in order; the final landing = target | the landings of every accepted route (e.g. U04 L1 accepts count-back and count-up routes) |
| `frame-state` | cell bitmap | the count and the make-ten step | the target state |
| `bar-schema` | `{ bars, longer, slots{}, unknown }` | each decision; parts commute | the schema |
| `sentence-match` | normalised sentence | matches the model's relation; the blank's value | the set of true sentences for the model |
| `probe` | chip id | never graded | `undefined` (the audit skips it by design and says so) |
| `paper-ack` | the typed sentence | the sentence only | the set of true sentences |

**Multi-part items** (§4.2) carry one validation per part. A part is graded on its own Check; the
item's first try is the **first Check of each part** (TAD §3.19: a blank part is "not yet", not
wrong; an unchanged answer is not a new try).

### 3.4 The misconception library (`verifyFor`) — the cure for S5

S5: the curriculum's keys were right while 5 of 339 "wrong answer ← rule" pairs were wrong,
because nothing checked the second. So every wrong value the engine shows — a choice-pool value,
an error-analysis figure's wrong column, a review line that names his likely rule — is made by a
**named rule in code** and re-derived by `verifyFor`. A value with no rule is not allowed (L34);
authors look for the identity **before** reframing (L36).

Rules G2-U04 needs (subtraction within 1,000; each a pure function of the item's own numbers):

| Rule id | What the child does | Usual side of the key |
|---|---|---|
| `sub.smaller-from-larger` | in every column, the smaller digit from the larger (E233; his Q3 rule) | above |
| `sub.no-decrement` | opens a ten (or hundred) for the column but leaves the donor digit as it was | above (+10 / +100) |
| `sub.zero-gives-nothing` | across zeros: writes the bottom digit under each 0 (`0 − d → d`) | above |
| `sub.double-decrement` | reduces the donor twice (once for each column it is next to) | below |
| `sub.added` | adds the two numbers (the sign ignored; L2 "two numbers, add") | above |
| `sub.stop-after-tens` | mental: stops after the tens jump | above |
| `sub.extra-ten` | mental: takes one ten too many and does not give back | below |
| `sub.compensate-wrong-way` | mental: rounds the subtrahend up, then takes the extra away again | below |
| `sub.count-start` | on a tape or line, counts the start as the first jump (off by one) | below |
| `est.as-answer` | writes the estimate as the exact answer (L7) | either |
| `est.round-down-always` | rounds both numbers down whatever the ones digit (U02 L7's mirror) | either |

Each template declares its pool by rule ids. The pool holds at least four honest values with
values on both sides of the key; three on each side wherever honest values exist (all four ranks
reachable), otherwise the template documents that it reaches three ranks, the least the
numeric-rank gate passes (METHODOLOGY §7). Values that collide with the key or with each other on
a draw are dropped by the generator and re-drawn, never patched by hand.

### 3.5 Choice order (METHODOLOGY §7; L43, L53)

Unchanged from the curriculum's contract: display order shuffled with the key's position folded
into the hash; for numeric choices, a target rank for the key picked first, then three pool values
that put it there. **The gate reads the rendered surface, not the pack** (L53: half of a Best
Brains level was answerable by the second-smallest button because the buttons were not in the
content).

---

## 4. What is new

### 4.1 The address and the catalogue

`Grade × Unit × Lesson × Item` (METHODOLOGY §7). The catalogue is code, ported from the grade
files and checked against them by the coverage gate (§5.5):

- **`SMUnit`** `{ id: 'G2-U04', grade, title, schoolChapter: { number, topic }, ccss[], lessons[],
  entryCheck, chapterCheck, heuristic, lessonExampleNumbers }`. `schoolChapter` is a lookup, never
  a publisher lesson title (DD2). `lessonExampleNumbers` lists every number the unit's authored
  teacher demos and worked examples give or work out; checks and mocks may not use them as operand
  sets or keys (CURRICULUM-MAP §7.12).
- **`SMLesson`** `{ id: 'G2-U04-L3', iCan, cpaSteps[], templates[], skills[], returnTargets[],
  explainItem? , isPaperLesson }`.
- **`SMSkill`** `{ id, lessonId, kind: 'solve' | 'model' | 'explain' | 'stretch', examPart?,
  methodLedgerRow, fluencyKind: 'standard' | 'model-long' }`. Model skills are earned on model
  items only; solve skills on solve items by any sound method (DD9).

### 4.2 The item: `SMItem`

`SMItem` keeps the Best Brains fields that gates read (`id`, `prompt`, `hintLadder` → here
`ladder`, `generator { templateId, params, seed }`, `figure`, `choices`, `statements`) and adds:

- `parts[]` — one or more parts, each `{ surface, answer, reveal: 'with-item' | 'after-part:<k>' }`.
  The error-analysis order is a reveal rule, not a convention: the fix (N-I1) → then the claim
  rows (N-I10) → then the sentence (METHODOLOGY §2 Step 7). Rows that state the repair do not
  exist in the DOM before the fix is committed (gate in §6.4).
- `role` — `starter | step | exit | practice | return | comeback | preview | entry | check |
  mock | prep | short-check | review` (recorded on every attempt; starter and exit never enter
  the mastery count, DD1; preview never counts against the child, DD24; `review` answers never
  count as evidence). `interim` is reserved for records imported from the interim page, only if
  the owner allows the import (BUILD-PLAN stage 6).
- `modelRung` — `read | label | build | unaided` (DD6).
- `skillIds[]`, `misconceptionRules[]`, `formatCode` (T1 … T17, L1 … L16 of GRADE-2's legend),
  `spokenLines[]` (every line the read-aloud will say; the spoken gate reads these).
- `ladder` — four rungs (METHODOLOGY §2 Step 5): what it means → use what you know (the empty
  model appears) → a way to finish (the first move shown) → the answer with the model filled.
  Rungs are role-based and number-free so they hold for every seed (FANOUT kit rule 2); no rung
  below 4 contains the key (TAD §3.2).

### 4.3 The two kinds of day (DD1; METHODOLOGY §2)

A day is a question count N (owner O3; recommended N = 5–6 on lesson days with the lesson steps
counted in N, N = 10 on practice days; DD1 note). A rest is offered after N, never a stop.

**Lesson day** (one lesson, one idea):

| Slot | Count (N = 8 / N = 5–6) | Source | Recorded as |
|---|---|---|---|
| starter | 2 / 1 | the unit's Entry-check line for this lesson's prerequisites | `starter` (never mastery) |
| steps | 4 / 2–3 | the lesson's CPA templates in order: concrete (N-I3 / N-I7) → pictorial build → abstract → guided items with the ladder | `step`, with the rung used |
| explain | ≤ 1 (alternate lesson days at N = 5–6) | the lesson's reason-frame template | `step` |
| exit | 2 / 2 | the lesson's key point, unaided | `exit` (never mastery; "exit 2 of 2" on the parent page) |

The teacher's demo before the steps is authored prose with fixed numbers (the lesson examples),
elicit-not-narrate (L25). A clean entry pair for the idea skips the concrete step (DD3). A stalled
skill re-opens the concrete step one rung lower (METHODOLOGY §4).

**Practice day** (N = 10; DD10, DD24):

| Share | Items (N = 10) | Rule |
|---|---|---|
| current unit | 6 | the lesson just taught and the one before, mixed so some items need no regroup (E90; DD10 "mixed sets by rule"); unknown in every position once taught |
| returns | 2–3 | due comebacks first (2/7/21 from any check miss), then the weakest skills of earlier units (§4.5) |
| preview | 0–1 (1–2 per unit, never two days running) | DD24 "try a new one": in Grade 2 autumn, reading a part-whole or comparison bar within 20 — never solving |

"Knows" is earned only here and on returns (TAD §2): first try, no scaffold visible, within the
skill's fluency time, on two separate days.

### 4.4 Returns (DD10) and previews (DD24)

- Returns are never labelled "review"; the day looks the same (METHODOLOGY Step 9).
- A return item is a fresh draw from the source lesson's templates (new numbers; surface signature
  differs from every item of that skill the child saw in the last 21 days).
- Comebacks from a check (or a mock, or a test-prep check) follow `comebacks.ts`: 2, 7, 21 days,
  settled after three clean answers in a row; at most 3 per day so new learning is not crowded
  out (DD10 "overturned by").
- Preview items carry `role: 'preview'`, the label "try a new one", the full ladder, and never
  move a skill to "learning" on a miss. Two first-try right answers on separate days mark that
  skill "already knows", which lets its later lesson run short (lesson day keeps starter and
  exit; steps cut to one).

### 4.5 One weakness function (shared with test prep)

`weakness(skill, attempts, today)` returns a rank tuple, compared in order, used by practice-day
returns, the stall rule's parent line and TEST-PREP-SPEC §3:

1. state: `stuck` > `learning` with a miss in its last 3 served days > `learning` > `known` with a
   return miss (moved back) > `known`;
2. first-try misses on the skill over its last 3 served days (more = weaker);
3. highest ladder rung used on its last 3 items (higher = weaker; TAD §3.2 "the rung should fall");
4. scaffold visible on a first try in its last 3 items (yes = weaker);
5. slow: first-try right but over its fluency time, count in its last 3 items;
6. days since last served (longer = weaker);
7. tie-break: curriculum order (earlier lesson first).

Counts only; never a percentage (TAD §3.14). A skill with fewer than two served days counts as
"little evidence" and ranks just below `learning` with a miss.

### 4.6 The skill-state machine (METHODOLOGY §4)

A pure function of the attempt log (the log is the record; `sm_skill_state` is a rebuildable
projection for the parent page, never the source of truth):

`not started → learning (first served) → known (two days: first try, no scaffold, within fluency
time) → learning (a miss on a return) · learning → stuck (6 practice days without a clean day) →
learning (a clean day) or parked (parent, after 6 more) → learning (a parked skill's return right)`.
Stretch skills carry the same rule and the tag. Fluency time = 1.5 × the median of the first six
first-try-right, scaffold-free times; none applies before six exist; recomputed monthly, falling at
most a fifth per month (METHODOLOGY §4). A check pass, a mock pass and a test-prep "ready" are one
day's evidence, never "knows".

### 4.7 Entry check and the probe

Pairs of the same structure with different numbers (DD3; E77): a gap is labelled only when both
miss; "holds / does not hold / unclear" per pair, never a score; feedback held to the end. The
regrouping probe (GRADE-2 §0.2) is a fixed-number form (its numbers are authored and exam-checked)
served over two days; every other entry check is generated from the unit's Entry-check line.

### 4.8 The chapter check (DD11) and its review

- About 8 items, Sections A (choices) / B (short answer: digit boxes, "which way did you do it?")
  / C (one worked problem with a model or shown steps), weighted 2 / 2 / 3; at least a third of
  the parts ask for a model or shown steps.
- **Feedback held**: the runner suppresses every per-item signal (no colour, no sound, no "try
  again"); Check is never locked (a blank is recorded as blank and the child may move on).
- **Review after**: each missed part walked with the ladder; one re-attempt; answers written with
  the `review:` prefix; **the score never changes** (TAD §3.9; `checkReview.ts`).
- **Recorded**: counts per section, the two category rows "concepts and procedures" /
  "reasoning" with the note that they are the module's categories (DD11; E262), every miss into
  the comeback pool.
- **Forms**: Form A from the unit's check blueprint at seed `CK:A`; a re-sit, a mock or a
  test-prep mock draws a **fresh form** (every item differs in prompt and numeric surface from
  every earlier form the child sat, `freshForm.ts`), never a lesson example's operands or keys
  (CURRICULUM-MAP §7.12), never an exam value (§6.1).
- The cumulative check (once a half-year) and the Grade 2 mock (EXAM-COVERAGE §2) are the same
  runner with a multi-unit blueprint.

---

## 5. The two shipping gates, and the ledgers

### 5.1 The deterministic validator (must pass first)

Every generated day, entry check, chapter check and mock, for every template, **across 200 seeds**
(FANOUT kit E; seeds `i × 13 + 3`) with 0 throws and 0 invalid: QG-1, QG-3, QG-4, QG-5 (every
validation in §3.3 on the enablement list), QG-11 (every `verifyFor`), QG-12a–d, QG-13, plus the
SM gates of §6. A gate is **seed-invariant**: it must hold at every seed, not on average (L19).
Measures over draws (choice rank, blind habit, answer entropy) are taken over the 200-seed
population of each template and slot (L38: group by slot identity, measure the key across seeds).

### 5.2 The LLM authenticity gate (must pass second)

Run on the unit, once the validator is green, with the `CONTENT-STYLE-GATE.md` protocol (PASS 1 tag
every item; PASS 2 judge with cited item ids; strict JSON verdict; ACCEPT / REJECT /
HUMAN_REVIEW; any hard-gate FAIL → REJECT; weighted mean ≥ 3.5, depth subset ≥ 3.0, no 1s).
Inputs: the unit's generated surfaces at three independent seeds, the unit's GRADE-n rows, the
METHOD-LEDGER rows, the neighbouring units' context ledger, and this rubric. Model routing: Fable
judges (HANDOFF §6, L18); Fable is paused until 2026-11-20 18:00 ET (DECISIONS M8), so the first
run waits for it.

**Hard gates of this module's rubric (SM-H):**
1. The child builds: each lesson has a concrete action and a built model before the abstract step,
   except where a clean entry pair skips it (METHODOLOGY §2–3; DD3).
2. Every picture ends in a number sentence on the same screen (§3 invariant 1).
3. Elicit, not narrate: the teacher's line never performs the move the item asks the child to make
   (L25).
4. No key-word teaching; a key word said as a rule is answered "check it on the bar" (E211; DD17).
5. One method per skill, the METHOD-LEDGER link sentence said where the ledger says (DD14).
6. Never shaming; "wrong" only inside a third-party error analysis (BB-G9 carve-out).
7. No publisher title, brand, page, item or character; no exam item (DD2; M6).
8. No clock, no speed language, no speed praise (DD13; TAD §3.5).
9. Every named misconception is honest: applying the rule to the item's numbers gives the shown
   value (S5; L47 "apply each stated rule to the pack's own examples").
10. The ladder teaches: rung 1 is an orienting question, no rung below 4 gives the answer.

**Weighted criteria (1–5):** unit nouns in every column line (DD20); reading load ≤ 10 words a
sentence, two story sentences, one question (DD17); the story routine (DD17); discrimination items
present (E90); unknown in every position once taught (E167 Rec. 5); the unit's heuristic named
with a check step (DD15); the reason frame on explain items (DD16); return targets honoured; the
lesson-day anatomy (starter / steps / exit); variety of situations across the unit; the home note's
four parts (DD24).

### 5.3 The adversarial re-check

A second, independent Fable judge (fresh context) is told to **recompute** rather than read (L30):
every key, every pool value by its named rule, every truth row, every number in the teacher's
lines; to apply every stated rule to the unit's own examples and check its referents (L47); and to
compare the unit with its neighbours for voice and template clones (L31, L35). Its hard-gate FAILs
block; its ACCEPTs are sampled — one accepted unit in three is re-scored later by a different
judge to watch for drift (CONTENT-STYLE-GATE "judge drift").

**Broken control (the gate must be seen to fail):** a planted copy of the exemplar unit with three
known defects — a teacher line that states the regroup answer before the child acts (SM-H3), a
key-word hint (SM-H4), and a pool value whose named rule gives a different number (SM-H9) — must
come back REJECT with all three cited. If it does not, the gate's verdicts are not used.

### 5.4 Ledgers that see the corpus, not one unit (L35)

- **Cross-unit context ledger** (port of `bb-cross-week-test.ts`): story settings and nouns,
  prompt shapes (digits stripped) and ladder text across all units; neighbouring units may not
  share a story setting set, no ladder text repeats across units, no prompt shape repeats more
  than twice in a grade.
- **Prior-unit ledger** (port of `lib/ledger.ts`): every strictly earlier unit's skills, so a
  unit that re-opens a family (U04 mirrors U02) must state its deepening (`deepeningDelta`).

### 5.5 The coverage ledger

A machine table generated from GRADE-n's "Item types" column: every lesson × format code × model
input → the template(s) that serve it. The gate fails when a listed format has no template and no
declared, reasoned deferral (e.g. "N-I5 not built: served as choices among drawn bars"). Deferrals
are a ratchet: the count may fall, never rise.

---

## 6. The module's gates, each with its broken control (HANDOFF §12; METHODOLOGY §6.3)

Every gate is a script in `frontend/scripts/sm-*.ts`, runs serially in the battery, runs on the
real generated content (200 seeds) **and** on deliberately broken fixtures that must fire (TAD §6).
Existing debt is a ratchet.

### 6.1 Exam-value gate (`sm-exam-value-test`) — EXAM-COVERAGE §4

- **Source:** reads the section "Exam values for the no-exam-items gate" of
  `research/phase0/EXAM-READING.md` at run time, plus the written answers in that file's reading
  table. The list is never copied into code, content or fixtures (S3, S4).
- **Tier 1:** every three-digit value on the list (round hundreds excepted, they are tier 2) never
  appears anywhere a child or the read-aloud can meet it: not an operand, a key, a choice, a pool
  value, a worked example, a working value, a teacher line, a ladder rung, a figure label.
- **Tier 2:** every value on the list (one- and two-digit values, printed choices and round
  hundreds included) is never an operand, a key or a printed choice (every pool value counts as
  printed) on the named surfaces. **Enablement list (L50), explicit in the gate's code:** the
  exam-skill lessons and the "also practised in" lessons of EXAM-COVERAGE §4 (G2-U04 L1–L3, L5,
  L6 among them); the probe; G2-U02-CK, G2-U05-CK and the G4-U03-CK items named there; the Grade
  2 mock; the 2-day review; every return and comeback for an exam skill; **and, new here, every
  test-prep item and test-prep mock** (TEST-PREP-SPEC §7). A surface not on the list is checked at
  tier 1 only, and the gate prints the list it enforced.
- **Not restricted:** working values inside a computation, range and place words, and the step
  size of "10 more / 100 more" (EXAM-COVERAGE §4).
- **Broken controls:** tier 1 — a fixture item whose second addend is the value at the position
  EXAM-COVERAGE §4 names (the gate builds the fixture from the list at run time) must fail;
  tier 2 — a mock fixture whose choice pool holds one of the first question's printed choices (a
  choice only, not an operand or the key) must fail; enablement — a test-prep fixture with a tier-2
  value as a key must fail (proves the new surface is on the list).

### 6.2 Picture-kind gate (`sm-figure-kind-test`, extends `bb-figure-kind-test`)

- **Rule:** when the words name a thing, the picture is that thing or there is no picture (TAD
  §3.21). Vocabulary → kind: "number bond", "whole", "part" → `number-bond`; "bar", "brace" →
  `bar-model`; "tape", "count on / back by" → `counting-tape`; "open number line", "jump" →
  `open-number-line`; "number line" with ticks → `number-line`; "blocks", "rod", "flat", "cube",
  "chart" → `pv-blocks-chart` / `base-ten-blocks`; "disks" → `pv-disks`; "ten frame" →
  `ten-frame`; "column", "carry", "regroup mark" → `column-digits`.
- **Every surface:** teacher demo, lesson steps, practice, returns, previews, entry check, chapter
  check, mock, test prep, review.
- **Answer-giveaway sub-check (L33):** a regroup item shows only the pre-trade state; an asked bond
  circle is empty; landings are blank on finish-the-jumps; the carry or regroup row is empty on
  missing-digit items; comparison bars are equal until the child decides; nothing countable where
  the child answers.
- **Broken controls:** a "number bond" item drawn as a bar must fail; a regroup item drawn in its
  post-trade state must fail; a missing-digit column with a pre-filled carry must fail.

### 6.3 Model-input gate (`sm-model-input-test`)

- **Rule:** each input of §3.2 grades exactly what it asks (TAD §4), on touch **and** keyboard:
  the gate drives each surface through the harness with pointer events and with key events only,
  commits the right model, a wrong model per decision, and a blank.
- **Asserts:** right → every part correct; each single-decision error → exactly that part wrong;
  blank → "not yet", no try counted; an unchanged answer re-checked → not a new try; the item's own
  model (N-I5) and any landing (N-I6) absent from the DOM before commit.
- **Broken controls:** the four fixtures in §3.2's last column (a grid accepting any carry; a bond
  accepting a value in the wrong part; a bar builder accepting any slot; a jump tool printing
  landings) — each must fail, by touch and by keyboard.

### 6.4 Spoken-answer gate (`sm-spoken-answer-test`, extends `bb-spoken-answer-test`)

- **Rule:** no line the read-aloud says — prompt, figure `spoken`, ladder rung 1–3, the teacher's
  check-screen lines, the review's opening line — contains the asked value, a landing the child is
  to type, a part the child is to fill, or the key of any part not yet committed (L48).
- **Also:** on error-analysis items, no spoken line before the fix is committed names the repair.
- **Broken controls:** an N-F1 figure whose `spoken` names the missing part must fail; an N-F3
  figure whose `spoken` reads a blank landing must fail; a review line that reads the key of a part
  he has not re-attempted must fail.

### 6.5 No-name gate (`sm-no-name-test`)

- **Content:** scans every generated surface (200 seeds), every authored string in
  `frontend/src/modules/school-math/`, and every file in `modules/school-math/` for any name on a
  **local list that never enters the repo** (path in an environment variable, e.g. a file under the
  owner's home directory; the gate fails closed with a plain message if the list is missing).
- **Outbound:** every payload builder that leaves the device (the explanation review, TTS requests,
  any analytics) is checked structurally: its type admits no name field, and a run of each builder
  on a fixture child asserts the serialised payload's keys are exactly the allowed set.
- **Broken controls:** a fixture item carrying a planted test name from the local list must fail;
  a payload fixture with a `childName` key must fail.

### 6.6 Exam-coverage gate (`sm-exam-coverage-test`)

- **Rule:** every scored part of the first learner's test (E239, eight parts) maps to at least one
  unit, one lesson and one mock item; every exam format (six, EXAM-COVERAGE §1.1) maps to a module
  surface and a mock item. Read from a machine table `curriculum/examMap.ts`, checked line by line
  against EXAM-COVERAGE §1 and §1.1.
- **Broken control:** a fixture map with the second missing-digit part mapped to no item must fail.

### 6.7 Method-ledger gate (`sm-method-ledger-test`)

- **Rule:** every skill in the catalogue that another module touches has a METHOD-LEDGER row
  (parsed from `design/curriculum/METHOD-LEDGER.md`), and the link sentence the item speaks is the
  ledger's sentence (CURRICULUM-MAP §7 rule 8).
- **Broken control:** a ledger fixture with one row removed must fail; an item whose link sentence
  differs from its row must fail.

### 6.8 Other gates that join the battery

| Gate | Rule | Broken control |
|---|---|---|
| `sm-choice-rank-test` | (a) no displayed position holds the key on > 40 % of draws; (b) no numeric rank holds it on > 40 % (METHODOLOGY §6.3) | key always shown second; a pool with every value above the key |
| `sm-shape-hint-test` | no shape hint contains the key, the blank's value, any of the item's numbers, or any exam value | a hint equal to the key |
| `sm-ladder-test` | no rung below 4 contains the key; rung 1 is an orienting question; ladders seed-invariant | a rung 2 that contains the key |
| `sm-lesson-reuse-test` | no check, mock or test-prep-mock item uses a lesson example's operand set or key; no Grade 2 check key is a probe whole or key (CURRICULUM-MAP §7.12) | a check item copying a lesson example; a mock key equal to a lesson's worked answer |
| `sm-blind-habit-test` | truth rows balanced and shuffled; the answer is not the first thing named on > 60 % of comparison draws (L51) | rows always true-first |
| `sm-answer-entropy-test` | per slot across seeds: no constant answer, no always-max/min, no dead option (L38, L42) | a slot whose key never changes |
| `sm-readability-test` | read-aloud sentences ≤ 10 words; two story sentences, one question (DD17) | an 11-word spoken sentence |
| `sm-cross-unit-test` | §5.4 | two units sharing a ladder |
| `sm-coverage-test` | §5.5 | a lesson format with no template and no deferral |
| `sm-verify-units` | §5.1 over every built unit | a corrupted `digit-boxes` key (proves the new validation is enabled, L50) |

---

## 7. The exemplar: G2-U04 Subtraction within 1,000 — the mirror

**Beside** the school's Grade 2 chapter on subtraction within 1,000 (DD2) · CCSS 2.NBT.B.5, 7, 9 ·
heuristic: work backwards · 7 lessons (GRADE-2 §3). Every template draws its numbers from ranges
and structure constraints (which columns regroup, whether a zero is crossed); none is fixed except
the authored teacher demos, which are the lesson examples already in GRADE-2 (exam-checked
2026-11-18) and form the unit's `lessonExampleNumbers`. Templates are `sm.g2u04.<lesson>.<name>`.

### 7.1 Skills (12)

| Skill | Kind | Lesson | Exam part it serves (EXAM-COVERAGE §1 "also practised in") |
|---|---|---|---|
| S1 subtracts within 100 in his head and names the route | solve | L1 | Q1's mirror (mental) |
| S2 jumps back (or counts up) on an open line, typing each landing | model | L1 | — |
| S3 subtracts 3-digit numbers with no regroup in a column | solve | L2 | — |
| S4 checks a subtraction by adding back | solve | L2, L7 | Q3 (inverses) |
| S5 opens a ten (column, regroup marks) | solve | L3 | Q3 |
| S6 builds the trade on the chart (ten → ones; hundred → tens) | model | L3, L4 | — |
| S7 opens a hundred | solve | L4 | — |
| S8 regroups twice | solve | L5 | Q4's mirror |
| S9 subtracts across zeros | solve | L6 | Q5's mirror |
| S10 decides whether a ten or a hundred must be opened | solve (discrimination) | L3–L5 | — |
| S11 finds, fixes and explains a regroup mistake in tens and ones | explain | L3, L6 | Q6 |
| S12 estimates by rounding to check, and chooses a route | solve | L7 | — |

### 7.2 Templates per lesson

| Lesson | Template | Format · surface · figure | Draw constraints | Pool / `verifyFor` rules | Skill |
|---|---|---|---|---|---|
| L1 | `l1.take_from_ten` | L1 concrete · N-I7 (take from two frames) | 2-digit − 1-digit crossing a ten | — | S2 |
| L1 | `l1.jumps_back` | L3 · N-I6 on N-F3 | 2-digit − 2-digit crossing a ten; route tens then ones | landings recomputed; `sub.count-start` in the review line | S2 |
| L1 | `l1.mental_sub` | T5 · `pad` first, then N-I6 "show how", then N-I9 | as above; its answer differs from every other answer of the day, so none can be recalled (the probe's P6 rule) | `sub.smaller-from-larger`, `sub.stop-after-tens`, `sub.extra-ten`, `sub.compensate-wrong-way` (review line only) | S1 |
| L1 | `l1.count_up_close` | T5 · `pad` + N-I6 (count-up route accepted) | two close numbers either side of a ten | `sub.smaller-from-larger` | S1, S2 |
| L1 | `l1.mental_choice` | T5 · `choices` (pool ≥ 4, both sides) + N-I9 | as `mental_sub` | the four L1 rules + `sub.added` | S1 |
| L2 | `l2.chart_remove` | L4 · N-I3 on N-F9 | 3-digit − 3-digit, no regroup | chart state recomputed | S6 |
| L2 | `l2.tape_back` | L2 · N-I6 on N-F6 (masked) | hundreds, tens, ones jumps back | landings; `sub.count-start` | S2 |
| L2 | `l2.column_plain` | L5, T8 · N-I1 with N-F4 (read) beside it, whole on top | no column regroups | `sub.added` (review line) | S3 |
| L2 | `l2.add_back` | T8 · two parts: N-I1 then N-I8 ("add back to check") | as `column_plain` | sentence-match | S4 |
| L2 | `l2.sign_decides` | T8 · mixed + and − set | the sign varies by draw, balanced | `sub.added` / its mirror | S3 |
| L3 | `l3.open_ten_chart` | L1/L4 · N-I3 on N-F9 (pre-trade only) | ones of the top number fewer than the bottom's | chart state | S6 |
| L3 | `l3.split_another_way` | L3 · N-I2 3-part ("5 tens 2 ones is 4 tens □ ones" form) | any 2- or 3-digit number with nonzero tens | bond-parts | S5 |
| L3 | `l3.column_open_ten` | L5, T9 · N-I1 with the regroup row | one regroup, in the ones | `sub.smaller-from-larger`, `sub.no-decrement`, `sub.double-decrement`, `sub.added` | S5 |
| L3 | `l3.must_open_ten` | T1 · `choices` (sentences; display-order measure) | four subtractions, exactly one needs a ten opened | each option's need computed | S10 |
| L3 | `l3.explain_donor` | T12-lite · N-I10 ("why did the tens digit go down by one?") | from the child's own previous column | truth rows by rule | S11 |
| L4 | `l4.open_hundred_chart` | L4 · N-I3 on N-F9 | tens of the top fewer than the bottom's, ones fine | chart state | S6 |
| L4 | `l4.column_open_hundred` | L5, T9 · N-I1 | one regroup, in the tens | as L3 column | S7 |
| L4 | `l4.must_open_hundred` | T1 · `choices` | exactly one of four needs a hundred opened | computed | S10 |
| L5 | `l5.two_trades_chart` | L4 · N-I3 (ones first) | two regroups | chart state | S6 |
| L5 | `l5.column_two` | T9 · N-I1 "show your work" (1 point answer, 1 point marks) | two regroups | as L3 + `sub.no-decrement` on the second trade | S8 |
| L5 | `l5.mixed_012` | L5 · N-I1, a set slot | 0, 1 or 2 regroups, balanced across the day (E90) | per draw | S3, S5, S7, S8, S10 |
| L6 | `l6.tens_in_hundreds` | L3 · `pad` ("a round hundred is □ tens") | round hundreds | computed | S9 |
| L6 | `l6.zero_chart` | L4 · N-I3 (hundred → tens, then ten → ones) | a zero in the tens of the top number | chart state | S6, S9 |
| L6 | `l6.column_across_zero` | T9 · N-I1, both marks | a zero (or two) to cross | `sub.zero-gives-nothing`, `sub.smaller-from-larger`, `sub.no-decrement`, `sub.double-decrement` | S9 |
| L6 | `l6.error_across_zero` | T12 · 3 parts: N-I1 fix → N-I10 rows → `explain` | a fictional child's column made by `sub.zero-gives-nothing` or `sub.no-decrement` | `verifyFor` recomputes the shown wrong column from its rule and the right one | S11 |
| L7 | `l7.round_on_line` | T1 · `number-line` (ticked) + `tap` the nearer ten | 2- and 3-digit numbers | computed | S12 |
| L7 | `l7.estimate_then_exact` | T8 · 2 parts: `pad` estimate, N-I1 exact | 3-digit with trades | `est.as-answer`, `est.round-down-always` | S12 |
| L7 | `l7.count_up_hundred` | T8 · N-I6 + N-I9 (route: count up to the next hundred) | a round-hundred minuend | landings; `sub.zero-gives-nothing` | S9, S12 |
| L7 | `l7.mixed_pm` | T8 · mixed + and − (DD10) | balanced signs and regroups | per draw | S3–S9 |
| L7 | `l7.journal` | L15 · `ack`, button "Tell the teacher" (ungraded, says so) | — | — | — |
| L7 | `l7.paper` | N-I11 (DD8: the unit's last lesson carries the paper item) | a take-away story with a bar | sentence-match | S4 |
| all | `preview.read_bar_within20` | DD24 · `choices` (which sentence / which bar) | part-whole or comparison, within 20 | the bar–sentence relation computed | (U05 skills, preview) |

### 7.3 Entry check G2-U04-EC (DD3; GRADE-2 line under the U04 table)

Three pairs, read aloud, held feedback: (1) a 3-digit number split another way, one of the pair
with a zero (← U01 L6, U01 L2) — `ec.split_with_zero`, N-I2 3-part; (2) subtract within 100
across a ten with blocks (← G1-U11 L5) — `ec.sub100_blocks`, N-I3; (3) a hidden part found by
subtracting (← U03 L2) — `ec.hidden_part`, N-I2. A failed pair opens the named lesson first.

### 7.4 Chapter check G2-U04-CK — engine proposal, owed to the curriculum architect

GRADE-2.md expands the checks of U02 and U05 only; U04's check is not yet written. The engine needs
one, so this is the **proposed blueprint** (sections, weights, templates), with no numbers: the
Fable curriculum architect signs it off (or rewrites it) before the exemplar's authenticity run.

| § · pts | Template (fresh form, check seed) | Format | Skill | Exam part mirrored |
|---|---|---|---|---|
| A1 · 2 | `l1.mental_choice` + chips | T5 + N-I9 | S1 | Q1 (mental) |
| A2 · 2 | `l4.must_open_hundred` | T1 | S10 | — |
| A3 · 2 | `l7.estimate_then_exact` (choice form: which estimate fits) | T1 | S12 | — |
| B4 · 2 | `l5.column_two` (show your work: 1 answer + 1 marks) | T9, N-I1 | S8 | Q4's mirror |
| B5 · 2 | the box in a subtraction's other places (U03 L6 return) — `u03.l6.box_any_place` | T7, N-I1 | U03 skill | Q3 |
| B6 · 2 | `l6.error_across_zero` (1 the fix, 1 the rows) | T12, N-I10 | S9, S11 | Q6 |
| C7 · 3 | a take-away or missing-start story, bar supplied (read rung; U05 builds bars), show work: plan 1, work 1, answer 1 | T17 with a read bar, N-I1 | S4, S8 | — |

15 points; "concepts and procedures" = A1–B5, C7; "reasoning" = B6. Any sound method earns the
answer mark (DD9). The same blueprint, at a fresh seed, is the **test-prep mock** for a subtraction
chapter test (TEST-PREP-SPEC §5).

### 7.5 Exemplar definition of done

1. `sm-verify-units` green on G2-U04 at 200 seeds (0 throws, 0 invalid), every §6 gate green and
   every broken control seen to fire.
2. The authenticity gate (§5.2) ACCEPT and the adversarial re-check (§5.3) with no hard-gate FAIL,
   at three independent seeds; its broken control REJECTED.
3. A teacher-persona run in the style of `testing/TEACHER-RUN-2026-11-18.md` over the generated
   unit (keys, rules, wording, diagnosis), with a code recompute: 0 mismatches.
4. The authoring kit written from what the exemplar taught (BUILD-PLAN stage 7) — only then the
   fan-out (L23).

---

## 8. Porting the interim test-prep page

The interim page (`design/experience/TEST-PREP-SUBTRACTION.html`, DECISIONS M15; not edited here)
and the preview page hold hand-written generators for U04 items. They are a **draft**: each one is
ported to a template above only after (1) its numbers are drawn through `streamRng`, (2) its key
and every wrong value go through `answerFor` / `verifyFor`, and (3) it passes the §6 gates. Its
localStorage records are not imported into the child's records without the owner's word
(BUILD-PLAN stage 6).

---

## 9. Compliance map

| Rule or source | Where applied |
|---|---|
| HANDOFF §6 engine additions (L17, L19–L23) | §0, §1, §2, §5 |
| HANDOFF §6 the child builds; touch + keyboard; kind gate for new figures | §3.1, §3.2, §6.2, §6.3 |
| HANDOFF §7 contract kinds, reuse the plumbing, no exam items | §1 ownership rule, §2, §6.1 |
| HANDOFF §8 one method per skill; exam-skills map | §6.7, §7.1 |
| HANDOFF §12 picture kind, model inputs, spoken lines, no name, exam coverage, method ledger | §6.2–§6.7 |
| METHODOLOGY §2 loop, §4 knows and stall, §6 figures and inputs, §6.3 gates, §7 contract | §3, §4, §6 |
| DD1 day = N; lesson-day anatomy | §4.3 |
| DD3 / DD4 entry check, probe | §4.7, §7.3 |
| DD6 / DD7 rungs, guided bar construction | §3.2, §4.2 |
| DD9 model vs solve skills | §4.1, §7.4 |
| DD10 returns, comebacks, mixed sets, stall | §4.3–§4.6 |
| DD11 chapter check A/B/C, held feedback, review | §4.8, §7.4 |
| DD24 previews, "already knows" | §4.4 |
| CURRICULUM-MAP §7.12 no lesson-example reuse | §4.1, §6.8 |
| EXAM-COVERAGE §4 tiers, enablement list, broken controls | §6.1 |
| TAD §2, §3.2, §3.9, §3.13, §3.17, §3.19, §3.21, §4, §6, §7, §8 | §4.2–§4.8, §6 |
| L25, L26, L28, L30–L36, L38, L41–L53 | §2, §3.4, §3.5, §5, §6 |
| S3, S4 (exam numbers recur), S5 (misconception values unchecked) | §6.1, §3.4 |
