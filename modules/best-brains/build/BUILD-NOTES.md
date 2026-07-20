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
