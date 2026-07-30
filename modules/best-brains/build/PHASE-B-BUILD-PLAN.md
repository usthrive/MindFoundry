# Phase-B Build Plan — ordered task list for Opus (gated volume execution)

**Written:** 2026-07-27 (Fable 5, Phase A). Executes `POLISH-PASS-SPEC.md` then
`FILL-ARCHITECTURE.md`, applying the lifts in `PEDAGOGY-CEILING-REVIEW.md`.
**Baseline:** branch `best-brains-content-engine` @ `faf8d53` (Level D 23/23 ACCEPT, correctness
7,877/0, tsc clean). **End state:** 120/120 cells generated+gated (R-cells with flagged parts),
every level ≥80% clean-ACCEPT, meta docs current, commits approved+made per checkpoint —
**no merge, no push** (user decisions), then STOP for the Phase-C Fable sign-off.

## Standing rules (apply to every task)

1. **Gates over inspection.** Correctness gate (`npx tsx scripts/bb-verify-packs.ts`) GREEN + `npx tsx
   scripts/bb-qg11-test.ts` + `npx tsc --noEmit` after **every** task marked ✅gate. Style gate per
   level via `build/workflows/bb-style-gate.workflow.js` (two-pass + adversarial re-check — the
   adversarial stage is not optional; L20/L22).
2. **Exemplar-first, wave-second, fan-out-third** for every level (L23). Never fan out on an unproven
   kit addendum.
3. **Fan-out worker contract** = FANOUT-AUTHORING-KIT §E: one agent per week, edits ONLY its
   `weeks/xNN.ts`, self-verifies 200 seeds with the band arg, never touches shared `lib/` during a
   fan-out wave. All `lib/` work happens centrally between waves (that's why B0/B1 precede B2–B5).
4. **Seed-invariance ruling** (POLISH §0): generation-time preflight asserts blueprint-structural
   facts only; drawn-text scans live in the QG-12 validator family run over the CI seed sweep.
5. **Git:** pathspec-only; never `git add .`; never touch the pre-existing untracked files; commit at
   the checkpoints below and **present each commit plan to the user before committing**; trailer
   `Co-Authored-By: Claude <model> <noreply@anthropic.com>`. Keep the branch buildable at every commit.
6. **Meta docs** (PROGRESS/DECISIONS/LEARNINGS) updated at every checkpoint; artifacts written to
   disk as completed, never batched (L11).
7. Child-safe law everywhere; band A additionally: no timers, no sprint, puppet-form EA.

## Phase B0 — Polish pass (POLISH-PASS-SPEC §P1–P7) — Level D regenerates

| # | Task | Gate |
|---|---|---|
| B0.1 | `lib/format.ts` (fmtMoney/Cents, countNoun, an) + route D12/D14/D20 money and all unit/article interpolations through it (P1, P5) | ✅gate |
| B0.2 | Fraction-role rule: `fracRole` on drafts, `fmtFrac`, reduce `quantity` draws; tag lesson-object/partition-anchored templates (P2) | ✅gate |
| B0.3 | Context-frame registry + `contextLedger` + blueprint `primaryContexts` + placement-spacing preflight; re-assign D5/D8/D15 and D6/D7/D16 primaries per P3; author the ≥6-frame pools with D-corpus warmth | ✅gate |
| B0.4 | Warm-up variety preflight + repair D6/D8/D15/D16 blueprints (P4) | ✅gate |
| B0.5 | Metacog wrapper → eliciting form; error-analysis claim-only templates (P7 / ceiling F1+F6). `AuthorMeta.posing` + inverse-start items (F3); D21 grouping-required situation + mastery slot (F5); signal-fade neutral twins for D7's Day-4/mastery (F2). **DONE.** | ✅gate |
| B0.5-defer | ⏸ **`has-distractor` items DEFERRED to an exemplar, not shipped in B0.** A prompt that states a quantity it never uses is the one F3 variant an LLM judge may read as an authoring bug rather than a deliberate trap, and B0.8's style-gate re-run is the go/no-go for everything else in this pass — so it must not ride along unproven. Per L23 (exemplar-before-fanout): build ONE, clear it through the style gate on its own, then adopt. The `posing: 'has-distractor'` tag already exists for it. | deferred |
| B0.6 | QG-12a–d validator family + deliberately-broken regression fixtures proving each scan fires (P1/P2/P5/P6) | ✅gate |
| B0.7 | **Large-number formatting LAST** in its own commit: checkAnswer comma-normalize → surface.ts signature normalize → QG-5/QG-11(b) parser tolerance → flip `fmtInt` → full sweep (P6) | ✅gate |
| B0.8 | Regenerate Level D (`CONTENT_VERSION` 1.2.0) → full correctness suite → **style-gate re-run on all 24 D weeks** → require ≥ current 23/23-equivalent (≥80% hard floor; investigate ANY regression as a voice-damage signal) | ✅both gates |
| **CP-0** | **Commit checkpoint** (present plan → user approval → pathspec commit). Update meta docs. | |

## Phase B1 — New generator families (central, no concurrent lib edits)

Order per FILL-ARCHITECTURE §2 dependencies. Each family lands with: `answerFor`/`verifyFor`
registrations, unit tests, a scratch-blueprint demo item, correctness gate green.

| # | Task | Gate |
|---|---|---|
| **B1.0** | ⚠ **FIGURE RENDERER — blocking for Level A, do FIRST.** ~9 parameterised SVG primitives (number line · bar model · area grid · ten-frame · place-value chart · clock · coin set · coordinate grid · angle figure), driven by the item's own computed params so a figure cannot contradict its answer. Add a `visual` slot to `GuidedExample` (0/96 have one today) and render `explanation.script[].visual` as a real picture instead of italic placeholder text. Migrate Level A's 18 unrendered `[image: …]` prompts. Rationale + measurements: `FILL-ARCHITECTURE.md` §2a. | ✅gate + eyeball in `/test-foundry` |
| B1.1 | `figures.ts` structured figure convention (G1) — the data half, consumed by B1.0's renderer | ✅gate |
| B1.2 | **Band-keyed gate table** `GATE_PROFILE[band]` in `pedagogy.ts` + regression proof that D preflight outcomes are bit-identical; kit self-verify gains `band` arg (FILL §1) | ✅gate |
| B1.3 | `clock.ts` (G2) · B1.4 `money.ts` (G3, on fmtMoney) · B1.5 `ratio.ts` (G4) | ✅gate each |
| B1.6 | **Signed-math audit of `compute.ts`** + extension + unit tests, THEN `integers.ts` (G5) | ✅gate |
| B1.7 | `algebra.ts` (G6) · B1.8 `stats.ts` (G7) · B1.9 `earlynumber.ts` (G8) | ✅gate each |
| **CP-1** | **Commit checkpoint** + meta docs | |

## Phases B2–B5 — Level fills (each = exemplar → wave → fan-out → gate → checkpoint)

Per-level template (replaces "task list per week" — the kit + FILL recipes carry the detail):

1. **Kit addendum** for the level (band settings, recipes table pointer, any level-specific hard rules).
2. **Exemplar week** through BOTH gates (iterate the addendum, not the week, if it can't reach ACCEPT).
3. **Validation wave: 4 weeks** chosen to cover the level's distinct families; both gates on all 4
   before fanning out (this step caught D10's `initD` bug — do not skip).
4. **Fan-out** the remaining weeks via `bb-fanout-weeks.workflow.js` (one agent per week, §E contract).
5. **Style-gate the full level** (`bb-style-gate.workflow.js`, adversarial stage on).
   **Go/no-go: ≥80% clean-ACCEPT, zero hard-gate FAIL, adversarially confirmed.** Repair borderlines
   via the generator/blueprint (never hand-patch answers), re-gate.
6. **Commit checkpoint** + meta docs.

| Phase | Level | Exemplar | Validation wave | Notes |
|---|---|---|---|---|
| **B2** | **E** (first — user-facing older level) | **E1** Ratios (proves G4, the biggest new family) | E6 (G5), E10 (G6), E13 (equations — on-thread heart), E21 (G7) | R-cells E12/E19/E22/E23 ship computable core + flagged part per FILL §7. E4/E9 Day-5 arguments R-lite. |
| **B3** | **C** | **C6** Meeting multiplication (the conceptual heart; mostly existing generators — isolates kit-addendum risk from family risk) | C5 (inverse-start), C13 (distributive), C17 (new gen), C21 (cross-op week) | Rebuild old-engine C1/C2 as part of the fill. C18 uses G2. |
| **B4** | **B** | **B12** Time (proves G2 in context) | B5 (bridge), B6 (equal sign, on-thread), B16 (G3 money), B23 (G7-lite) | Rebuild old-engine B1/B2. Fixture B14 stays pinned; generated b14 mirrors it. |
| **B5** | **A** | **A5** More/fewer/same (the conservation-trap week — proves the A-band design stance, puppet-EA, perceptual discrimination) | A1 (counting+figure), A11 (patterns), A14 (meeting addition), A19 (baseline trap + figure) | Rebuild old-engine A1/A2 (a01/a02 templates). Fixture A15 pinned. **A is a design problem: if the exemplar fights the band-keyed gates, fix `GATE_PROFILE['A']` deliberately (never by weakening D/E rows) and record the decision.** |

Level A goes LAST deliberately: its `GATE_PROFILE` work benefits from B/C experience, and it is the
least user-urgent (placement starts children above A more often than not).

## Phase B6 — Whole-corpus close-out

| # | Task |
|---|---|
| B6.1 | Full `bb-verify-packs` over all 120 cells × seed sweep; QG-11 + QG-12 clean; no-authorMeta-leak; every `prerequisiteWeeks`/retrieval source resolves cross-level; tsc + `npm run build` clean |
| B6.2 | Style-gate summary table per level (A/B/C/D/E accept rates) appended to `CONTENT-STYLE-GATE-RESULTS-LEVEL-D.md`'s successor doc `CONTENT-STYLE-GATE-RESULTS-ALL-LEVELS.md` |
| B6.3 | Coverage ledger in `CONTENT-GENERATION-PLAN.md` §3 updated: every cell G or R-with-flagged-part; zero B-bucket remaining |
| B6.4 | Update HANDOVER banner + PROGRESS/DECISIONS/LEARNINGS; final commit checkpoint (user-approved) |
| B6.5 | **STOP. Signal the Fable-5 Phase-C checkpoint**: fresh-eyes pedagogy audit on a SAMPLE of A/B/C/E weeks (the L24 lesson — gate authors and content authors share blind spots), completeness critic over the whole build, and the merge/push conversation with the user |

## Failure protocol

- A wave/exemplar that can't reach ACCEPT after 2 targeted regenerations → stop the level, diagnose at
  the kit/library layer, update the addendum, re-run — never brute-force per-week.
- Any QG-12 hit in CI = a template bypassed `format.ts` → fix the template, add the case to the
  regression fixtures.
- Any style-gate regression on previously-ACCEPT content after a lib change → treat as a voice/depth
  damage signal from that change, not judge noise; bisect the lib change.
- Interruptions: `git status` + artifact listing first, resume with a state summary (L15); browser or
  long drives synchronous, never background-waited (L16).
