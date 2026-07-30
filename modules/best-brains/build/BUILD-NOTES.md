# BUILD NOTES — Best Brains-Inspired Module ("Foundry Method", module id `best-brains`)

Running engineering log for Phase 6. One entry per increment. Governed by
`METHODOLOGY-MODEL.md` (constitution), `QUESTION-GENERATOR-SPEC.md`, `SCREEN-SPECS.md`,
and `EXISTING-INFRASTRUCTURE-SURVEY.md`.

---

## Contract definition (summary)

`frontend/src/modules/core/contract.ts` defines the Mind Foundry Module Interface
Contract: **descriptive registry metadata + typed capability surfaces**, NOT a runtime
plugin system and NOT a refactor of Kumon internals.

- `MindFoundryModule` — { id, displayName, description, entryRoute, status, levels,
  placement, conceptCatalog(), sessionGenerator, progressSchema, parentReportSchema }.
- `LevelDescriptor` — level id + ordinal + unitKind (`worksheet` | `week`) + unitCount.
  The unit-of-progress difference between modules is first-class.
- `PlacementDescriptor` — `parent-selected` (Kumon today) vs `diagnostic-adaptive`
  (Foundry DD5), with `recheckSupported` for the DD1 escalation path.
- `SessionGeneratorDescriptor` — `worksheet-generator` (non-deterministic, Kumon) vs
  `weekly-pack-generator` (deterministic seeded regeneration, Foundry). `entry` is a
  documentation pointer, not a dynamic import.
- `ProgressSchemaDescriptor` / `ParentReportSchemaDescriptor` — which tables own
  progress; report cadence (`continuous` vs `weekly`) and `requiresAcknowledgement`.
- `conceptCatalog()` may honestly return `[]` (Kumon: concepts implicit in generators;
  Foundry: catalog lands with CURRICULUM-MAP port in increment 2).

`frontend/src/modules/core/registry.ts` holds `MODULE_REGISTRY` with two entries:
`kumon` (declarative description of the live module — imports only `LEVEL_ORDER` from
its published types; entryRoute `/study`) and `best-brains` (entryRoute `/foundry`,
status `in-development`, levels A–E × 24 weeks).

## Reused vs new

**Reused (described, untouched):** Kumon `LEVEL_ORDER` type/constant import;
`children` table as the FK anchor for all bb_ tables; house RLS child→parent
ownership pattern (`children.user_id = auth.uid()`); existing
`update_updated_at_column()` trigger fn (from init schema); JSONB-payload
convention (precedent: `problem_attempts`, cohorts `breakdown`/`settings`).

**New:** `frontend/src/modules/core/` (contract + registry + index),
`frontend/src/modules/best-brains/` (types + constants + index), and the four
`bb_` tables. No existing Kumon code was modified; no existing table altered.

**Deliberately NOT inherited (survey §Kumon-pedagogy):** worksheet pacing,
repetition-driven mastery/mastery_status semantics, 2-sessions/day structure,
Kumon hint escalation. The bb_ schema shares zero columns/semantics with
`worksheet_progress`/`mastery_status`.

## Data model rationale

Four `bb_`-prefixed tables, all keyed on the week (METHODOLOGY §2: "the week is the
primary key of the curriculum graph"), all RLS'd on the house pattern, all indexed on
`(child_id, level, week)` where applicable:

- **`bb_enrollment`** (UNIQUE child_id) — placed level, `placement_result` JSONB
  (DD5 `PlacementResult` shape), `current_week`, `settings` JSONB
  (`BBEnrollmentSettings`: sprintOptOut, sessionLength short/standard/full with the
  15-min hard cap, weekRevealDay, acceleratedMode…). One row per child; level
  changes in place on level-exit or placement re-check.
- **`bb_week_state`** (UNIQUE child/level/week) — `pack_seed` (BIGINT) +
  `content_version`: **packs are never stored**; they regenerate deterministically
  from seed + pinned contentVersion (QUESTION-GENERATOR-SPEC §3.1, DD15 versioned
  pointers — noted in SQL comments). `state` = the 8-value DD1 machine
  (not_started / in_week / mastery_check / passed / near_miss_cycle1 / cycle2 /
  escalated / fast_track) with a CHECK constraint; legal transitions live app-side
  in `WEEK_STATE_TRANSITIONS` (constants.ts). `day_progress` JSONB (5 day tiles),
  `mastery` JSONB (`WeekMasteryRecord`: Form A/B attempts with scores + cycles).
- **`bb_item_attempts`** — append-only telemetry (no UPDATE policy): answer,
  correct, `hint_rungs_used` 0–3, `attempt_no`, `day` (NULL for Form B/sprints),
  plus `error_tag` (closed DD7 enum CHECK) beyond the minimum spec because DD7
  tags drive reteach selection, PatternsView, and report generation. DELETE policy
  exists for the P12 parent data-deletion flow.
- **`bb_parent_reports`** (UNIQUE child/level/week) — `narrative` JSONB (E102
  4-field frame: whatWeWorkedOn / improving / strengthening / homeFocus +
  teacherNarrative), `verdict` CHECK ('passed','one_more_round','escalated' —
  "Review" never rendered), `percent` 0–100 (parent-only, P6), `acknowledged_at`
  (the sign-off ritual), partial index on unacknowledged.

`updated_at` triggers on the three mutable tables (enrollment, week_state,
parent_reports); attempts are immutable.

Types mirror the WeeklyConceptPack JSON schema 1:1 in
`frontend/src/modules/best-brains/types.ts`; DD1/dose/sprint/placement constants in
`constants.ts` (`MASTERY_THRESHOLD = 0.85`, `FAST_TRACK_PCT = 95`,
`MAX_CORRECTIVE_CYCLES = 2`, `WEEKS_PER_LEVEL = 24`, …).

## Known limitations

- JSON-schema constraints TypeScript can't express are now runtime-enforced by
  `generator/validator.ts` (QG-1..QG-10 + S-* structural checks) — increment 2.
  The validator's gate interpretations are FIXTURE-NORMATIVE (the spec's three
  worked packs pass by construction); see the increment-2 entry for the exact
  scoping decisions (QG-1 format-class scoping, QG-3/QG-9 non-retrieval bank
  coverage, QG-5 shown-in-prompt hint carve-out, A·W1 retrieval origin
  exception, §3.3 ordering ramps left generation-side).
- Seeded content covers 9 of 120 cells: A1, A2, B1, B2, C1, C2 (templates) +
  A15, B14, D17 (spec fixtures). `generatePack` throws a descriptive error for
  the other 111 cells.
- Fixture cells are STATIC: seed and contentVersion arguments are ignored for
  (A,15), (B,14), (D,17); they stay pinned at their authored 1.0.0.
- Sprint set generators (`add_within_10_facts_v1`, `numeral_writing_v1`,
  `add/sub_within_100_facts_v1`, spec's `add_tens_2digit_v1`/`mult_facts_v1`)
  are registry-declared with params only; realizing a sprint's 10–30 timed
  items is deferred to the session-flow increment (sprints carry generator
  specs, not item arrays, per schema).
- `frontend/scripts/bb-verify-packs.ts` runs manually via `npx tsx`; not wired
  into an npm script or CI yet. It is also outside tsconfig `include`, so
  `tsc --noEmit` does not cover it (tsx type-strips at run time).
- Kumon `conceptCatalog()` still returns `[]` (concepts implicit in its
  generators); the best-brains catalog is live (120 cells).
- DD1 transition legality is enforced app-side (`WEEK_STATE_TRANSITIONS`), not by a
  DB trigger; the CHECK constraint only bounds the state set. A SECURITY DEFINER
  scoring RPC (so the client can't self-award `passed`) is a candidate for the
  increment that builds `WeeklyCheck` submission.
- `/foundry` route does not exist yet; registry `entryRoute` is forward-declared.
  No card added to `PracticeModulesPage` yet (screens increment).
- Kumon `unitCount: 200` worksheets is asserted uniformly per level; electives
  (XV/XM/XP/XS) may differ — cosmetic only, nothing reads it yet.
- Monthly/level-exit Test Log (DD9) has no table yet — deferred until the test
  scheduler increment (will be `bb_test_log`, same RLS pattern).
- Migration applied to live DB via MCP `apply_migration` (recorded in Supabase
  migration history as `bb_module_schema`); the repo file
  `20260719000001_bb_module_schema.sql` is byte-identical to what was applied.

## Increment log

### Increment 1 — 2026-07-19 — commit `981cd735195c1f17df15657cc9bc5c3081efa00a`

Module Interface Contract + TS domain types + Supabase `bb_` schema.

- Files: `frontend/src/modules/core/{contract,registry,index}.ts`,
  `frontend/src/modules/best-brains/{types,constants,index}.ts`,
  `supabase/migrations/20260719000001_bb_module_schema.sql`.
- Migration applied to project `mjooqyjofzsavuqqorcg`; verified via `list_tables`:
  4 new `bb_` tables present, RLS enabled on all, 43 pre-existing tables untouched.
- `npx tsc --noEmit` clean; `npm run build` clean (pre-existing chunk-size warning
  only). Committed pathspec-only on `main`.
- Next (increment 2): pack generator + seed content — template registry (§3.1),
  Form-B isomorph rules (§3.2), QG gates, CURRICULUM-MAP concept catalog wiring.

### Increment 2 — 2026-07-19 — deterministic pack generator, catalog, seed content, validator

(Committed together with this entry; BUILD-NOTES intentionally joined the repo here.)

**Files** (all under `frontend/src/modules/best-brains/` unless noted):

- `content/catalog.ts` — typed port of CURRICULUM-MAP's 5 × 24-week tables
  (`CatalogWeek`: conceptId, name, computational + noncomputational strand
  focus, band, strandTags, checkpoint/exit flags). `bestBrainsModule.conceptCatalog()`
  in `core/registry.ts` now returns the 120 `ConceptRef`s. conceptIds for A15/
  B14/D17 match the spec packs exactly.
- `generator/rng.ts` — xmur3 + mulberry32 seeded PRNG; NAMED SUB-STREAMS per
  pack section (`streamRng(packSeed, 'd1'|'d2'|...|'pz'|'fs'|'ma'|'mb')`) so a
  reorder in one section never cascades into another's draws.
- `generator/templates/registry.ts` — item-template registry: spec templates
  (`count_on_v1`, `sub_2digit_regroup_v1`, `frac_addsub_unlike_v1`, ...) plus
  the increment's A/B/C templates, each with `answerFor(params)` where a
  closed-form answer exists — powers the QG-5 arithmetic audit (fixtures'
  generator-carrying items are re-verified too).
- `generator/templates/shared.ts` — day/mastery assemblers, id minting
  (`<Level><Week>-<slot>-<nn>`), `TupleGuard` + `drawFresh` (pack-wide operand-
  surface freshness; Form B disjoint from Form A and daily pages by
  construction), choice shuffler (exactly one correct, tagged distractors),
  number-words 0–999.
- `generator/templates/weeks/{a01,a02,b01,b02,c01,c02}.ts` — full seed content
  for the natural post-placement entry weeks (A1 counting-1-5, A2 counting-6-10,
  B1 numbers-to-120, B2 tens-and-ones, C1 place-value-to-1000, C2
  compare-and-round): explanation (hook → why-before-how → script → summary →
  vocab), 4 fade-ordered guided examples, 6/6/6/4/4 day structure, Day-5
  noncomputational page per the map's focus column, Puzzle Grove page, hint
  ladders (≤3 rungs, no answer leaks), mistakeBank with DD7 tags + subtypes,
  E102 parentSummarySeed, index-paired Form-B isomorphs, sprints for B/C
  (sources ≥2 weeks prior / cross-level; A packs `fluencySprint: null`),
  beginner-band Day-5 teacherNoteStrip, 20–30% backward-only retrieval
  (6/26 = 23%; cross-level per the map's rule; A·W1 = curriculum origin, 0).
- `generator/fixtures/{mfm-a15,mfm-b14,mfm-d17}.ts` + `fixtures/index.ts` —
  the spec's three worked packs ported VERBATIM; loader serves a structuredClone
  when (level, week) matches, templates otherwise.
- `generator/validator.ts` — `validatePack(pack) → {valid, violations[]}`
  implementing QG-1..QG-10 + structural checks (regexes, counts, slot/prefix id
  discipline, retrieval sourcing, distractor tags, threshold consistency via
  constants, dose model 5–15 min/day, sprint legality). All thresholds imported
  from `constants.ts`.
- `generator/packGenerator.ts` — `generatePack(level, week, packSeed,
  contentVersion='1.0.0')`: PURE function, fixture-first resolution, plus
  `getPackDay(pack, day)`, `hasPackContent`, `AVAILABLE_WEEKS`/`GENERATED_WEEKS`.
- `generator/surface.ts` — operand-surface extraction shared by validator and
  verify script.
- `frontend/scripts/bb-verify-packs.ts` — 9 packs × 3 seeds: validator green,
  same-seed deep-equality, different-seed surface divergence (template cells),
  fixture seed-independence, per-index Form-B disjointness, catalog agreement.

**Verification** (all green at commit time):

- `npx tsx scripts/bb-verify-packs.ts` — 423 assertions, 0 failures.
- Stress: 6 template cells × 1,500 seeds each (9,000 packs) — all validator-
  clean; plus a negative test (mutated pack) confirming the validator catches
  injected difficulty/threshold/retrieval violations.
- Gate catches fixed during the run: D17 fixture warm-up hint referencing a
  shown-in-prompt option (led to the QG-5 shown-in-prompt carve-out); B1
  fill-path hint naming "100" when 100 was the answer (hint rewritten); several
  rare-seed same-day commuted operand collisions (freshness signatures made
  order-insensitive / namespace-shared in a01, b02, c01, c02).
- `npx tsc --noEmit` clean; `npm run build` clean (pre-existing chunk-size
  warning only).

**Next (increment 3 — child session flow screens):** consume
`generatePack(level, week, weekState.packSeed, weekState.contentVersion)` +
`getPackDay(pack, day)`; packs regenerate per render — never persist them;
sprint item realization from the sprint's GeneratorSpec; placement flow still
unbuilt (DD5 walk); `/foundry` route + PracticeModulesPage card still owed.

---

## Increment 3 — child session flow (placement, weekly hub, daily practice) · 2026-07-19

**Scope shipped:** `/foundry` routing shell + Flow 1 (placement), Flow 2 (weekly
cycle: hub → lesson → guided), Flow 3 (daily practice: warm-up → practice →
day-done), shared components, and the persistence service. Increment-4 surfaces
(SprintGate/Run/Finish, PuzzleGrove, WeeklyCheck chain, TreasureChest, parent
screens, PracticeModulesPage card) are warm "coming this week" route stubs.

**Design inbound status:** `modules/best-brains/design/inbound/` was EMPTY at
build time → screens are clean neutral Tailwind (theme tokens only — primary/
secondary/surface/text-*; no hardcoded hex), semantic class groupings,
presentational components (`components/`) split from containers (`screens/`)
so the token/skin pass can restyle without rewrites.

**Files (all under `frontend/src/modules/best-brains/` unless noted):**

- `FoundryRoutes.tsx` — lazy route tree; mounted in `App.tsx` as `/foundry/*`
  behind `ProtectedRoute` + `Suspense` (own chunk, ~246 kB incl. pack content).
- `screens/FoundryLayout.tsx` — selected-child guard (→ `/select-child`),
  `FoundrySessionProvider`, calm max-w-2xl canvas. `screens/FoundryIndex.tsx`
  routes unenrolled → placement, enrolled → hub.
- `session/FoundrySession.tsx` — loads enrollment + week state, regenerates the
  pack via `generatePack(level, week, packSeed, contentVersion)` per mount
  (never persisted), derives interaction band (level A→A, B/C→B, D/E→C; age
  pre-placement), session clock for the dose cap.
- `session/weekLogic.ts` — PURE: `deriveTiles` (daily-unlock law: first
  not-done day is today IFF the previous day wasn't completed the same
  calendar day → finishing early leaves tomorrow "resting"; no early unlock
  path exists), `LESSON_KEY` Day-1 lesson gate, `sessionCapMinutes`
  (short 5/standard 10/full 15, hard cap 15).
- `copy.ts` — band-keyed microcopy: SCREEN-SPECS appendix H rows 1–15
  verbatim (`COPY`), module strings in-voice (`MODULE_COPY`), rotating
  specific confirms (`CONFIRMS`), miss openers (`MISS_OPENER`).
- `answers.ts` — `checkAnswer(spec, given)` for the AnswerSpec validations
  (manual-review → acknowledged ungraded), `tapOptionsFor` (band-A tap
  options: answer + deterministic near-miss distractors, stable order).
- `services/bbProgressService.ts` — `getEnrollment` / `enroll` (upsert from
  PlacementResult), `getOrInitWeekState` (creates row with fresh pack_seed +
  pinned CONTENT_VERSION; 23505-safe), `listWeekStates`,
  `transitionWeekState` (validates WEEK_STATE_TRANSITIONS, throws on illegal
  edges, stamps started/completed), `updateDayProgress` (JSONB merge),
  `recordItemAttempt` (append-only; hint_rungs_used + error_tag; never throws
  into the session).
- Components: `WrenBubble` (band voice/decoration law, paired AudioButton),
  `AudioButton` (ttsService browser voice, ≥48px, A-band autoplay),
  `HintLadder` (rungs strictly in order, labels, fresh request per rung),
  `AnchorPanel` (full/strategy-only/empty; slide-in; never the live item),
  `BBScratchPad` (wraps existing ui/ScratchPad; session-scoped per-item stroke
  store), `AnswerEntry` (band input law: choices tappable everywhere, A tap
  options, B NumberPad, C typed; text-shaped validations typed at any band).
- Screens: `PlacementWelcome` / `PlacementActivity` / `StartingPoint` /
  `JourneyMap` / `ThisWeekHub` / `LessonRoom` / `GuidedPractice` / `WarmUp` /
  `PracticePage` / `DayDone` / `ComingThisWeek` (stub).

**Placement (how level+week are assigned):** adaptive walk over ladder A→B→C
(the levels with entry-week content); start level from age (≤6 A, ≤8 B, else
C); cluster = 5 exit-skill items from `generatePack(level, 1, walkSeed)
.masteryCheck.formA`; ≥80% steps up, <50% steps down, else place here (DD5
thresholds from constants); every answer gets the identical "Got it!" ack —
right/wrong never shown; pause offer every 8 items; `StartingPoint` reveals
strengths (catalog concept names of ≥60% clusters) + neutral letter, then
writes `bb_enrollment` via `enroll()` with entryWeek=1.

**Ambiguity resolutions / deferred (owed to increment 4):**

- **Sprint realization from GeneratorSpec — DEFERRED** (SprintGate/Run/Finish
  are increment-4 screens; the owed sprint-item realizer goes with them).
- **Day 1 = Lesson → GuidedPractice → done** (Flow 2 step 4 verbatim; the
  hub's "WarmUp or LessonRoom first" line resolved in favor of the flow doc).
  Day-1 concept-echo pack items are therefore unserved in this increment —
  increment 4 may fold them into warm-up rotation or a Day-1 practice slice.
- **Day 5** = WarmUp → stub (PuzzleGrove/WeeklyCheck are increment 4); the
  Day-5 tile is marked `partial` so the week cannot close without them
  (dual-strand law holds).
- Parking (2 interventions) records telemetry + warm copy and moves on; the
  chest ritual itself is increment 4. A-band placement safety-exit (idle/
  random-tap detection) and placement resume >7-days deferred with it.
- Mid-level entry (front-block mastery → week 13) deferred until post-week-2
  content exists; D/E join the placement ladder with their week-1 packs.
- Offline/PWA answer queueing not wired (global edge rule) — service is
  console-safe on failure but no local queue yet.

**Verification:** `npx tsc --noEmit` clean; `npm run build` clean (pre-existing
chunk warning only; FoundryRoutes is its own lazy chunk). Headless smoke
(tsx): pack serving for A1/B1/C1/B2, deterministic regen, daily-unlock law
(fresh week / same-day rest / next-day unlock), lesson gate, 15-min hard cap,
checkAnswer matrix, tap-options-contain-answer — all pass (A1 day-2 has zero
retrieval items by design: no earlier week exists; WarmUp skips an empty
slice). Browser smoke via chrome-devtools MCP against `npm run dev`:
`/foundry` + 9 child routes each load the lazy chunk and redirect
unauthenticated to `/login` with zero console errors/warnings. No test
account exists in .env/seed and none was created against the live DB —
authenticated screen walk is owed to the first seeded QA pass.

**LS1-R3 retrofit (adopted mid-increment from
`research/phase2-gaps/DESIGN-DEFAULTS-ADDENDUM-LS1.md`):**

- (a) Hint-ladder escalation discipline — DONE: `HintLadder` takes
  `escalationLocked`; rung 1 opens freely (incl. miss auto-open) but rungs 2–3
  require a genuine attempt since the last rung (`attemptedSinceRung` in
  `PracticePage`); locked state shows a band-keyed "try it first" line, never
  a dead end. Cited `LS1-R3(a)` at both sites.
- (b) Post-reveal fix-it — DONE at increment 3's only bottom-out reveal site
  (WarmUp miss path): bands B/C get an explain-back ("first step in your own
  words", recorded as ungraded telemetry `explain-back: …`, with an "I said it
  out loud instead" escape); band A re-enacts the same item once
  (tap-to-choose re-attempt), closing warmly either way. Cited `LS1-R3(b)`.
  OWED to increment 4: near-transfer variant items where the template surface
  makes them cheap; the PracticePage bottom-out case (it parks after 2
  interventions without revealing — reveal+fix-it there belongs to the
  TreasureChest/reteach ritual).

**Live authenticated smoke (chrome-devtools MCP, user session, child "test
old child"):** full Flow 1 driven — PlacementWelcome (C-band voice) → 5-item
C-cluster walk (NumberPad, identical "Got it." acks) → StartingPoint (Level C,
2 strengths) → enroll → JourneyMap (24-stop C trail, "you are here", empty
shelf, effort strip) → ThisWeekHub (concept card, Day 1 lit, Days 2–5
resting) → LessonRoom (7 segments, dots disabled first-encounter, no skip) →
pin moment → GuidedPractice (modeled tap-along; completion/prompted/
independent exercised via the miss→park path) → DayDone (canonical B-band
dose line + specific praise). Day-2 deep-link: WarmUp miss → reveal →
"Let's fix it" → explain-back → PracticePage (page 1 of 2; rung-1 open →
escalation LOCKED until attempt → unlocked after attempt; park copy on 2nd
miss). Zero console errors/warnings throughout. Supabase verified read-only:
bb_enrollment (level C, placement_result, strengths), bb_week_state
(pack_seed pinned, content_version 1.0.0, state in_week, day_progress
lesson+day-1 done), bb_item_attempts (placement day=NULL rows; day-1 guided
rows; day-2 rows with error_tag procedure-slip/concept-misconception,
hint_rungs_used=1, explain-back row). Fixes from the live walk: FoundryLayout
grace window for the AuthContext children-restore race (full-page reload was
bouncing to /select-child); GuidedPractice attemptNo reset on example
advance.

**Known limitation:** day screens trust the hub for the unlock law — a child
deep-linking `/foundry/day/N/...` bypasses tile gating (hub is the only
child-side entry; add a route-level guard with the increment-4 pass).
*(Fixed in increment 4: `isDayActionable` route guards.)*

---

## Increment 4 — mastery engine, corrective loop, sprint, puzzle, treasure chest · 2026-07-19/20

**Scope shipped:** server-side mastery scoring (SECURITY DEFINER RPC + DB
guard trigger), the full Flow-6 mastery journey (WeeklyCheck → WeekResolve /
StrengthenPlan → MicroReteach → FreshProblems, incl. fast-track, cycle-2 and
escalation variants), Flow-5 sprints (gate/run/finish + item realizer),
Flow-4 PuzzleGrove, Flow-7 TreasureChest (+ the weekly collection ritual),
and the LS1 session-engine refinements R1/R2/R4/R5 + R3(b) completion.
Design inbound still EMPTY → neutral-Tailwind conventions from increment 3.

### T1 — server-side mastery scoring (`supabase/migrations/20260719000002_bb_mastery_rpc.sql`, APPLIED to live DB as `bb_mastery_rpc`)

- **`bb_score_mastery_check(p_child_id, p_level, p_week, p_form, p_answers, p_summary_seed)`**
  (SECURITY DEFINER, `search_path=public`, EXECUTE granted to `authenticated`
  only): explicit child-ownership check (`children.user_id = auth.uid()`),
  `FOR UPDATE` row lock, form/state legality (Form A only from
  `in_week|mastery_check`, Form B only from `near_miss_cycle1|cycle2`),
  server-side percent recompute, dominant-DD7-tag extraction (top 2),
  DD1 routing verbatim (85/95/2-cycle) + **LS1-R5 stability rule**, mastery
  JSONB attempt append (+ `finalScorePct` / `escalatedAt` +
  `placementRecheckRequested`), `completed_at` stamp, and the
  **`bb_parent_reports` upsert** (E102 four-field narrative assembled from
  the pack's `parentSummarySeed` + computed fields; `strengthening` selected
  by dominant tag from `strengtheningByTag`; verdict
  passed/one_more_round/escalated; percent parent-only). Returns
  `{state, score_pct, verdict, stability_hold}`.
- **Enforcement (honest description):** the house RLS pattern legitimately
  gives parents UPDATE on their children's `bb_week_state` rows
  (day_progress writes), so a column-revoke would break the session flow.
  Instead a **BEFORE UPDATE guard trigger** (`bb_week_state_guard`) rejects
  ANY state change except `not_started→in_week` and `in_week→mastery_check`,
  and ANY `mastery` JSONB write, unless the transaction-local `bb.rpc` flag
  is set — which only the RPC does. Verified live: direct
  `UPDATE ... SET state='passed'` and `SET mastery=...` both raise.
  Maintenance edits need `SELECT set_config('bb.rpc','on',true)` in the same
  transaction. `bb_parent_reports`: INSERT policy dropped + INSERT/UPDATE
  privileges revoked; `authenticated` keeps a **column-level UPDATE grant on
  `acknowledged_at` only** (the E15 acknowledge tap) — verified via
  `information_schema.column_privileges`.
- **Honest limit:** per-item `correct` flags are client-asserted (packs
  regenerate deterministically client-side; items are never stored
  server-side, so the server cannot re-derive answers). The RPC owns
  aggregation, thresholds, stability, DD1 routing, the state write, and the
  report. A forged sheet could inflate item flags but can never skip states,
  change thresholds, or write `passed` directly.
- LS1-R5 implementation detail: "no completed practice day materially below
  0.80" = first-attempt accuracy < **75%** (`STABILITY_MIN_PCT`, mirrored in
  SQL) on any DONE independent-practice day (days 2–4; Day 1 is
  instructional). Source: `day_progress.accuracyPct` (now written by
  PracticePage), fallback derivation from `bb_item_attempts`
  (`attempt_no=1`, ≥3 rows so tiny samples never veto). A stability hold on
  a ≥85% check routes to `near_miss_cycle1` with `stabilityHold: true` in
  the attempt record (parent report says one_more_round; child sees the
  normal warm StrengthenPlan).

### T2 — WeeklyCheck / WeekResolve / corrective loop

- `components/CheckRunner.tsx` — shared Form A/B surface: PracticePage dress,
  one-in-focus, **no back**, feedback held (identical "Got it." ack per
  item), strategy-card-only AnchorPanel (P7 exception), ScratchPad, no
  timer; resume via sessionStorage (answered items stand — no
  restart-scumming; best-effort, documented).
- `WeeklyCheck` — framing line (row 11), `in_week→mastery_check` transition
  on entry (client-legal edge), per-item attempts (day=5), submit → RPC →
  routes passed→`/resolve`, near-miss→`/strengthen`; offline/transient
  submit failure → warm offline-tally copy (row 12), answers stand.
- `WeekResolve` — shelf add, canonical row 7 with the concept slot filled
  (`weekPassedLine` — the spec's "Two-digit subtraction" is its worked
  example; found rendering literally during the smoke and fixed), fast-track
  credit (row 15), post-corrective warmth indistinguishable from first-pass,
  next-week preview from the catalog, CTA → TreasureChest (collection
  ritual). **Next-week reveal lives on the hub** and waits for the cycle to
  turn (completedAt not today → "reveal" CTA advances
  `bb_enrollment.current_week`; nothing extra unlocks the same day, P1).
- `StrengthenPlan` — the one wobbly skill named from the dominant tag's
  mistakeBank subtype; plan + non-stuck guarantee; cycle-2 "different angle"
  line; escalation variant (live-teacher card + program-owned re-check
  framing). No %, no "Review", no red.
- `MicroReteach` — reteachPointer resolver (parses `script[N]` +
  `guidedExamples/<id>` refs; prose pointers fall back to the modeled
  example — worked-example first, always); cycle 2 = alternate bank entry
  for the same tag when authored, else example-first presentation.
- `FreshProblems` — Form B via CheckRunner (QG-4 disjointness honored by
  never re-serving Form A surfaces), attempts day=NULL, attempt_no=cycle;
  RPC routes fast_track/passed → resolve, cycle2/escalated → strengthen.
- Hub: corrective dual-thread line ("This week: X · Still strengthening: Y"),
  "one more round" CTA gated to the NEXT day (same-day rest per Flow 6's
  "usually next day"); escalated card; passed settled state; chest count
  badge (quiet number, no red).

### T3 — sprint (`generator/sprintItems.ts`, `session/sprintLogic.ts`, three screens)

- `realizeSprintItems(sprint)` — deterministic (seeded sub-stream off
  `generator.seed`), 10–30 items honoring `itemCount`; covers all six
  registered sprint templates (`add_within_10_facts_v1`,
  `numeral_writing_v1`, `add/sub_within_100_facts_v1`, fixture
  `add_tens_2digit_v1`, `mult_facts_v1`) with surface-freshness within a run.
- Offer law (`sprintEligible`): pack sprint non-null ∧ today =
  `scheduledDay` ∧ Level B+ ∧ `settings.sprintOptOut` false ∧ <2 done this
  week ∧ not declined today. Offer site = PracticePage page boundary.
- `SprintGate` — three facts before any start control, skill named as old,
  equal-weight "Let's go"/"Not today", first-ever demystifier; decline =
  localStorage same-day flag only (nothing stored server-side, nothing
  shown, P11); re-guards on deep link.
- `SprintRun` — soft filling arc (no numerals/ticking/red), wrong answers
  simply advance, "done for now" always visible, interruption (unmount)
  discards silently and never spends the budget; timer end → finish.
- `SprintFinish` — persists ONLY here (partial counts fine): attempt rows
  `item_id = <sprintId>#<nn>` (the `-FS-` infix marks sprint telemetry),
  `day NULL`, **`attempt_no` = sprint ordinal within the week** (chosen
  convention — makes you-vs-you queryable); budget entry in `day_progress`
  under `sprint-1|2`; self-referenced compare (improved/steady/wobbled/
  first-ever) + C-band personal sparkline.

### T4 — PuzzleGrove + TreasureChest

- `PuzzleGrove` — serves the Day-5 noncomputational page items (DD3's Day-5
  slice, unserved in increment 3) then the featured `pack.puzzle` under the
  Grove mark; qualitative Ms. Wren close (strategy talk, never a score);
  manual-review acknowledged ungraded; park option ("brain marinating") —
  the Day-5 tile stays partial until the puzzle closes the week (WeeklyCheck
  marks day 5 done only when the puzzle id is in completedItemIds);
  available during corrective weeks (DD1); band-A "show a grown-up" card
  from `teacherNoteStrip`.
- `TreasureChest` — parked items DERIVED from the append-only attempt log
  (`listParkedItems`: ≥2 misses, latest still a miss, <4 total misses =
  re-park max twice then folds to warm-up rotation, >14 days silently
  retires; daily `-D#-` slots only); DD7-tag routing (misconception → bank
  gloss FIRST then re-attempt; slip/misread/comprehension → oriented
  re-attempt with the located step); resolution praise names the move;
  PLUS the weekly collection: mastered concept cards from passed/fast_track
  week states (quiet, no points/confetti — the WeekResolve ritual target).
  *Fresh-isomorph re-attempt after a chest reteach is a same-item re-attempt
  in v1 (template instantiators aren't exposed outside the builders) —
  increment 5 owes the true isomorph regeneration.*

### T5 — LS1 session-engine refinements (all cited in code)

- **R1 age-banded caps** — `BAND_SESSION_CAPS` target/hard 8/10 (A), 12/15
  (B), 15/20 (C); `sessionCapMinutes(setting, band)` (short 5 / standard
  target / full hard, hard un-extendable); FoundrySession passes the band.
- **R2 adaptive stop** — signals: rolling first-attempt accuracy <0.6 over
  last 5; ≥2 rapid wrong answers <2s; ladder ridden to rung 3 on ≥2
  consecutive items. TWO distinct signals, checked between items only →
  warm early DayDone variant (`adaptiveStop` copy), day stays partial so
  the concept resurfaces tomorrow.
- **R4 retrieval ramp** — `CONTENT_VERSION` bumped to **1.1.0**;
  version-gated post-pass `applyRetrievalRamp` in packGenerator relocates
  Day 1's last retrieval warm-up to Day 5 (re-minted D5 id): template weeks
  now run D1 20% → D5 40% retrieval (was 33% → 25%), pack-wide share
  unchanged so QG-2 holds; per-day counts stay in QG-8 bounds; fixtures
  verbatim; learners pinned at 1.0.0 regenerate their original packs
  byte-identically (verified). `bb-verify-packs` green (423 assertions).
- **R5** — see T1 (verdict = check ≥85 AND week stability);
  `DayProgressEntry.accuracyPct` written by PracticePage (merged over
  partial visits).
- **R3(b) completion** — PracticePage bottom-out site: with the ladder at
  rung 3, a second miss now REVEALS the answer with the rung-3 reasoning
  (P8: only after 3 rungs + real attempts) and routes into fix-it:
  `nearTransferVariant` (session/fixit.ts — deterministic operand-shifted
  variant when the surface is simple arithmetic) or explain-back otherwise;
  both close warmly and advance. Below rung 3 the §4.2 two-intervention park
  is unchanged.
- **Route-level day-unlock guard** (increment-3 bug) — `isDayActionable`
  enforced in WarmUp + PracticePage; every mastery screen re-guards on the
  DD1 state; SprintGate re-guards eligibility; Day-5 re-entry forwards to
  the Grove instead of replaying warm-ups.

### Verification

- `npx tsc --noEmit` clean; `npm run build` clean (pre-existing chunk
  warning only); `npx tsx scripts/bb-verify-packs.ts` — 423 assertions,
  0 failures (generator changed: ramp + version bump).
- Migration applied via MCP `apply_migration` as `bb_mastery_rpc`; verified:
  RPC present + SECURITY DEFINER (pg_proc), guard trigger enabled
  (pg_trigger), column grant exactly `acknowledged_at` — and both illegal
  writes raise (live negative test).
- **Live authenticated smoke** (chrome-devtools MCP, user session, test
  child "test old child", Level C week 1, content pinned 1.0.0): Day-3
  chain — hub (chest badge "1" from real increment-3 telemetry) → WarmUp →
  PracticePage p1 → **SprintGate at the page boundary** (three facts,
  first-ever line) → SprintRun (4 answered, early exit) → SprintFinish
  (count 4, first-ever framing; FS rows + sprint-1 budget verified in DB) →
  resume-at-item p2 → DayDone (praise line, accuracyPct 100 persisted).
  Day-5 chain — WarmUp → PuzzleGrove (3 page items + featured puzzle,
  qualitative close, park control present) → WeeklyCheck (row-11 framing,
  identical acks, no back) with 4/6 → **RPC verdict near_miss_cycle1
  (67%)** → StrengthenPlan naming "digit vs value" → DB: mastery attempt
  {A, 0, 67, tags [concept-misconception, representation-misread]}, report
  verdict one_more_round percent 67, strengthening text selected by tag →
  hub dual-thread + next-day rest (attempt rewound to yesterday via
  flagged SQL) → "one more round" CTA → MicroReteach (script segment +
  guided example) → FreshProblems 6/6 → **RPC verdict fast_track**,
  finalScorePct 100, completed_at set, report flipped to passed/100 →
  WeekResolve (fast-track credit, next-week preview) → TreasureChest
  (collection card + parked misconception item: bank gloss → re-attempt →
  resolution praise; badge cleared) → hub settled passed state with NO
  same-day reveal (P1). Zero console errors/warnings.
  **Both verdict ends driven** (one_more_round + passed-via-fast-track);
  not driven live: plain Form-A pass, cycle-2/escalation, stability-hold
  (logic SQL-reviewed; hold needs a low-accuracy day + ≥85 check).
- Smoke DB mutations (test child 453ec35a… ONLY, bb_week_state.day_progress
  + mastery timestamp): day-1 completedAt rewound to yesterday; days 2 & 4
  marked done (yesterday, accuracyPct 100, plausible completedItemIds);
  day-3 completedAt rewound after the live run; mastery attempts[0]
  attemptedAt rewound (with the bb.rpc flag). No Kumon tables touched.

### Known limitations / owed to increment 5

- **Parent screens + PracticeModulesPage module card** (increment 5 scope):
  ParentWelcome/PlacementStory/ParentHome/WeeklyReport (report READING +
  acknowledge tap — rows exist and are written by the RPC now)/
  ReportHistory/TrendsView/MasteryMap/PatternsView/CoachCorner/SchoolSync/
  ParentControls (incl. LS1-R1 band-cap copy + sprint opt-out + session
  length; settings currently defaults-only).
- Escalation aftermath: `escalated` state renders the card, but live-teacher
  queue state + placement re-check launch (Flow 1 re-check variant) are not
  wired; `escalated→passed` resolution path unbuilt.
- Chest fresh-isomorph after reteach (see T4); C-band "what tricked me"
  note; chest offered by Ms. Wren at session start (currently hub-entry
  only).
- Check resume is sessionStorage-only (a reload mid-check on another device
  restarts unanswered items; answered items still stand via the log rules
  only client-side). Offline answer queueing still unbuilt (global edge).
- Sprint personal best is within-week (attempt_no ordinal per pack);
  cross-week same-skill history needs more content + a skill-keyed query.
- Accelerated mode ignores `weekRevealDay`; reveal is simply next-calendar-
  day after a pass. LS1-R6 bounded choice still post-MVP.
- `ComingThisWeek.tsx` no longer routed (kept for possible reuse).
- Day-1 non-retrieval concept-echo items remain unserved (Day 1 = lesson +
  guided); one former Day-1 warm-up now serves on Day 5 via the R4 ramp.

---

## Increment 5 — parent view, module card, Claude-Design skin · 2026-07-20 (FINAL build increment)

**Scope shipped:** the full parent journey (`/foundry/parent/*`, 11
SCREEN-SPECS §E screens), the PracticeModulesPage module card + registry
status flip to `live` + ProgressDashboard parent entry, and the
Claude-Design skin (design/inbound tokens + four reference screens) applied
module-wide.

### T1 — design-token integration & skin

- `theme/tokens.css` — three layers, ALL scoped under a `.mf-foundry` root
  class (applied by FoundryLayout and FoundryParentLayout), so Kumon screens
  are untouched:
  1. the inbound token variables verbatim (paper/ink/teal/apricot, band type
     scales, radii, shadows, calm motion, tap targets);
  2. a **Tailwind semantic-utility remap** — increment 3 deliberately styled
     every screen with theme tokens only, so re-pointing those utilities
     (`bg-primary`→teal #3B7B78, `bg-surface`/grays→warm paper neutrals,
     `warning`→apricot, **`error`→lavender #8B819B (never red)**, shadows→the
     calm scale, `rounded-3xl/2xl/xl`→20/16/14) *is* the skin pass for every
     child screen at once, hover/focus/ring variants included, plus the
     shared NumberPad/ScratchPad utilities used inside the module;
  3. component classes for the reference grammar: `.mf-card` (white,
     radius-20, shadow, 6px teal top-rule), `.mf-tile-done/active/resting`
     (+ apricot dot), `.mf-bubble`/`.mf-bubble-teal` (radius 4/16/16/16),
     `.mf-sheet` (+handle) hint bottom-sheet, `.mf-label`/`.mf-chip`,
     `.mf-report-body` (serif), `.mf-verdict` (underline typography),
     `.mf-ack-btn` (ink), `.mf-btn-primary/quiet`, `.mf-pad-tray`.
- `components/WrenMark.tsx` — the reference bird motif recreated as a React
  SVG (teal circles + paper eye + apricot beak; decorative, aria-hidden).
- **Reference-fidelity restyles:** `ThisWeekHub` (greeting header + WrenMark,
  concept card with chip/CTA/dose line, day tiles per the tile grammar —
  "Day N" labels kept per DD3, weekday names in the reference NOT adopted —
  quiet Anchor/Chest/Journey-map action row) and `PracticePage` (mf-label
  header, edge-bleeding Anchor tab, white item card, warm NumberPad tray
  with dashed teal answer box). `WrenBubble` (WrenMark + bubble radii),
  `HintLadder` (bottom-sheet dress, dashed future-rung previews, "answer
  only after rung 3" footer), `AnswerEntry` (tray dress) carry the grammar
  into every screen that uses them.
- **Grammar-generalized (remap + shared components, no per-screen rewrite):**
  LessonRoom, GuidedPractice, WarmUp, DayDone, WeeklyCheck, WeekResolve,
  StrengthenPlan, MicroReteach, FreshProblems, Sprint trio, PuzzleGrove,
  TreasureChest, placement screens, JourneyMap. FoundryLayout column tightened
  to 430px (reference frame is 390px mobile).

### T2 — parent journey (`screens/parent/`, `services/bbParentService.ts`, `parentCopy.ts`)

- `FoundryParentLayout` — parent-mode guard per the app's own convention
  (ProgressDashboard precedent): parent surfaces are account-owner routes
  behind ProtectedRoute; the layout never touches the selected child and no
  child-side screen links to `/foundry/parent/*` (P6: verdict + % exist only
  here). Provides a ParentContext (children, enrollments, reports per child).
- `bbParentService.ts` — listReports/getReport/**acknowledgeReport** (the
  only report write; DB grants UPDATE on `acknowledged_at` alone),
  listEnrollments, updateEnrollmentSettings (read-merge-write on
  `bb_enrollment.settings`), listWeekStatesReadOnly (never initializes rows
  from the parent surface), listMissGroups (DD7 misses, 28-day window),
  listSprintCounts. `parentCopy.ts` — verdict labels (Passed / One more
  round / Extra support — "Review" never rendered), DD7 parent glosses with
  program-plan attached, LEVEL_CONTEXT (DD2 parent-only level↔age
  sentences), coach etiquette, gate explainer.
- Screens (all 11): **ParentWelcome** (three cards + expandable verdict
  pre-framing + LS1-R1 band-cap dose honesty; once-flag in localStorage,
  cards persist from ParentHome's help link) · **PlacementStory** (level +
  DD2 context, strengths, first-month targets from the catalog,
  re-checkable-placement promise, destigmatizing register) · **ParentHome**
  (per-child week strips from day_progress, effort-framed consistency line,
  "Weekly report ready — read it" state, links row — matches the reference)
  · **WeeklyReport** (renders `bb_parent_reports.narrative` E102 four-field
  frame verbatim — serif body, sans labels, verdict-as-typography, % exactly
  once, apricot "At home this week" box, "Seen it — {child} will know their
  week counted" ink button writing `acknowledged_at`; verdict-pending state)
  · **ReportHistory** (archive + profile header) · **TrendsView** (three
  honest graphics max: Form-A check % with the 85% gate explained, day
  accuracy + minutes from day_progress, sprint counts hidden on opt-out;
  "still gathering the story" under 3 weeks; no red/arrows/projections) ·
  **MasteryMap** (24 cells; "took the strong road" = any Form-B attempt on a
  passed week; checkpoint/exit chips) · **PatternsView** (DD7 groups in
  parent language, pattern-vs-one-off, plan attached, standing footer) ·
  **CoachCorner** (report homeFocus praise + teach-it-back with TTS
  delivery, placement-strength starter lines pre-report, etiquette footer) ·
  **SchoolSync** (settings.schoolTopic, honest lean-warm-ups-only effect
  statement, ~6-week staleness prompt, no school name) · **ParentControls**
  (sprint opt-out, persona voice — instruction TTS never removable, sound
  effects, session length inside LS1-R1 band caps with the un-extendable
  hard-cap copy, P12 plain-words data list, escalation note).

### T3 — module card + registry + parent entry

- `core/registry.ts`: best-brains `status: 'in-development'` → **`'live'`**.
- `PracticeModulesPage.tsx`: calm card in the module grid — title from
  `getModule('best-brains').displayName` ("Foundry Method"; "Best Brains"
  appears nowhere user-facing), 🪶 icon, quiet "Weekly" teal badge, route
  `/foundry`; rendered only while the registry says `live`.
- `ProgressDashboard.tsx`: one-line teal banner under the progress tabs →
  `/foundry/parent` (smallest clean integration on the existing parent
  surface).

### T4 — verification

- `npx tsc --noEmit` clean; `npm run build` clean (pre-existing chunk-size
  warning only).
- **Auth blocker (reported per BROWSER-TESTING-TOOLING):** headless test
  signup is email-confirmation-blocked (valid-format `.test`/unregistered
  domains rejected outright; MX-valid address accepted but no session
  returned) and anonymous sign-ins are disabled — so a live-DB authenticated
  drive was NOT possible from Playwright. One orphan unconfirmed auth user
  (`bb.inc5.smoke.mindfoundry@gmail.com`) exists from the attempt; no rows
  were created in any table. The increment-4 test child (453ec35a…) lives
  under the user's own login and is unreachable headlessly.
- **Fallback A — read-only live smoke:** /login, /foundry, /foundry/parent,
  /foundry/parent/welcome all load and redirect unauthenticated → /login
  with zero console errors (3 pre-existing app-wide warnings only).
- **Fallback B — full UI drive against a mocked backend** (Playwright
  channel:'chrome', every request to the Supabase host intercepted and
  served from fixtures; live DB untouched): ParentHome → WeeklyReport →
  **acknowledge tap verified** (PATCH body exactly
  `{"acknowledged_at": …}` — the column-grant write) → post-ack state; all
  11 parent screens rendered; child hub (mid-week fixture: done/active/
  resting tiles, concept card, CTA) and hub-CTA → Day-3 WarmUp (item card +
  tray NumberPad dress). Screenshots 01–18 in
  `modules/best-brains/testing/screenshots/inc5/`. Console: module screens
  clean; remaining entries are pre-existing app-level noise (celebration
  config/subscription singletons, navigation-aborted fetches) plus the
  app-shell bottom-nav/DEV-badge overlay visible in full-page captures.
- Found during the drive: **PracticePage cold deep-link race** — its local
  `weekState` mirror lags one render behind the session context, so a direct
  URL hit bounces to the hub (hub click-through, the only child-side entry,
  is unaffected). Logged below as a limitation.

### Reused vs new (whole module, §9)

**Reused:** house auth/session (AuthContext, ProtectedRoute, selected-child
convention), `children` as the FK anchor, house RLS pattern, Supabase JSONB
convention, ttsService (AudioButton + CoachCorner delivery), ui/ScratchPad
(wrapped), NumberPad (re-dressed via scoped CSS only), lazy-route + Suspense
convention, ProgressDashboard as the parent-surface precedent, Tailwind
theme-token vocabulary (as the skin's remap surface). **New:** module core
contract/registry, 4 `bb_` tables + guard trigger + scoring RPC, the
deterministic pack generator + catalog + validator + fixtures, 23 child
screens + 11 parent screens + 8 module components, week/sprint/fixit logic,
bbProgressService/bbParentService, band-keyed copy + parent copy, the
module-scoped design-token skin. **Deliberately not inherited:** Kumon
worksheet pacing/mastery semantics, points/streaks/confetti, red error
styling, % on child surfaces.

### Module Interface Contract (summary)

`core/contract.ts`: descriptive registry metadata + typed capability
surfaces, not a runtime plugin system — `MindFoundryModule` {id, displayName,
description, entryRoute, status, levels (unitKind worksheet|week),
placement (parent-selected | diagnostic-adaptive + recheck), conceptCatalog(),
sessionGenerator (worksheet | deterministic weekly-pack), progressSchema,
parentReportSchema (continuous | weekly + requiresAcknowledgement)}.
`MODULE_REGISTRY` holds `kumon` (live, described declaratively) and
`best-brains` (now `live`; entryRoute `/foundry`; weekly cadence with
acknowledgement). The unit-of-progress difference stays first-class.

### Known limitations (increment-5 close-out; carries forward increment 4's)

- Escalation aftermath unwired (live-teacher queue, placement re-check
  launch, `escalated→passed` resolution); ParentControls shows the framing
  only. Schedule controls (week-reveal day, report notification day) and the
  module's single weekly notification are not implemented — reports are
  pull-only from ParentHome today. Accelerated-mode request UI not exposed.
- Data export / hard-delete are described in the P12 panel but route to
  account contact, not a self-serve flow. SchoolSync stores the topic;
  generator-side warm-up leaning is not wired (honest copy says "when
  overlap exists"). No syllabus-photo input (P12-safe text only).
- TrendsView retention curve (warm-up retrieval accuracy on older material)
  deferred: attempts don't tag retrieval provenance yet; shown instead are
  check %, day accuracy/minutes, sprint counts. PatternsView shows tag
  groups + concepts, not 1–2 anonymized example items. Monthly Test Log
  (DD9) still has no table, so MasteryMap has no per-test drill-down.
- PracticePage cold deep-link race (above). Chest fresh-isomorph after
  reteach, C-band "what tricked me" note, offline queueing, cross-week
  sprint history — all still open from increment 4. Seeded content still
  covers 9/120 cells; unseeded cells show the calm coverage note.
- Skin: ThisWeekHub + PracticePage are reference-fidelity; the other child
  screens carry the grammar via the utility remap + shared components and
  may drift from the untransferred 30 design files in fine detail (fetchable
  on demand per LINK-RECEIVED). The app-shell bottom nav overlays module
  pages on mobile heights — an app-chrome matter outside module scope.
- Live authenticated browser verification is owed to the next session with
  the user's Chrome (chrome-devtools MCP): drive ParentHome → WeeklyReport →
  acknowledge on the real increment-4 report (child 453ec35a…), and clean up
  the orphan unconfirmed auth user.

### Phase 6 gate self-check

**Does the module run end-to-end placement → weekly cycle → parent report?
YES, with the caveats above.** Placement (DD5 walk → enroll) was driven live
in increment 3; the weekly cycle (hub → lesson → guided → daily practice →
sprints → puzzle → WeeklyCheck → RPC verdicts both directions → corrective
loop → chest/resolve) was driven live in increment 4 with server-side
scoring verified; increment 5 closes the loop's last leg — the report is
now READ and ACKNOWLEDGED on a real parent surface (rendered from the
RPC-written narrative; acknowledge write verified as the exact column-grant
PATCH, against a mocked backend due to the auth blocker). The module card
and registry expose the module as live. Remaining gaps are enumerated
honestly above; none break the core loop.
