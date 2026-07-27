# HANDOVER — Best Brains Method Module (Mind Foundry)

*Written 2026-07-21 for a fresh AI agent (new conversation) taking over this build. Read this top-to-bottom, then the files in "Orient yourself." Everything needed is on disk and in git — nothing critical lives only in the prior conversation.*

---

## ⭐ STATUS UPDATE 2026-07-21 — GENERATOR REBUILT; LEVEL D PASSES BOTH GATES (100%)

**The Step-2 generator rebuild is COMPLETE and PROVEN.** The Level-D style-gate FAIL described below (1/24) has been resolved by rebuilding the generator per the 9 fixes (NOT hand-patching weeks). Current state:

- **Level D: 23/23 generated weeks = clean ACCEPT (100%), 0 REJECT, 0 HUMAN_REVIEW** — adversarially confirmed on the same rubric that failed the old corpus (which scored 1/24 ≈ 4%). D17 stays the calibration fixture.
- **Correctness gate GREEN** (`npx tsx scripts/bb-verify-packs.ts` — 7,877 assertions, 0 failures); **QG-11 regression test passes** (`scripts/bb-qg11-test.ts`); **`tsc --noEmit` clean**; every week seed-invariant across 120 seeds under the v2 contract.
- **What changed (all on branch `best-brains-content-engine`, uncommitted until you approve — see §4 R4):** a v2 pedagogy layer — new lib modules `meta.ts / ledger.ts / situations.ts / multistep.ts / discrimination.ts / erroranalysis.ts / metacog.ts / pedagogy.ts` (13 seed-invariant preflight gates), `validator.ts` QG-11 (anchor/claim audit + week-independent regression test proving it catches the original D6/D8 bugs), a `verifyFor` registry so error-analysis truth is code-derived (the D6/D8 fabrication class is now structurally impossible), and all 23 `weeks/dNN.ts` rewritten to `pedagogyContract:'v2'`. `V2_WEEKS` in `packGenerator.ts` gates the migration; the correctness gate stayed green at every step.
- **Build contract + kit** (read these before touching the generator): `build/CONTENT-GENERATOR-FIX-SPEC.md` (Rev 2 — the 9-fix architecture, hardened by a 4-lens adversarial review of 7 blockers + 11 majors) and `build/FANOUT-AUTHORING-KIT.md` (per-week recipes + the hard rules earned from real bugs).

**NEXT (your decisions — now unblocked):** (1) merge `best-brains-content-engine → main` (still a clean fast-forward); (2) the ~80-week fill of Levels A/B/C/E — reuse `FANOUT-AUTHORING-KIT.md` + the style-gate workflow, requiring the same ≥80% clean-ACCEPT per level (Level B needs clock/coin generators; Level E has figure/proof cells to keep human/AI-flagged); (3) the **Fable-5 strategic-review checkpoint** (per L18/R5): a top-model pedagogy-ceiling pass over a sample + the v2 meta-prompt (`MASTER-META-PROMPT-TEMPLATE-v2.md`) + `NEXT-PROGRAMS-STARTER.md`. No merge/push/fill has been done — those are yours.

*(The sections below are the ORIGINAL 2026-07-21 handover, pre-rebuild, kept for context. Where they say "fix the generator / FAILED authenticity," that work is DONE per this banner.)*

---

## 0. What this project is

**Mind Foundry** is a children's math-practice web app (React 18 + TypeScript + Vite + Tailwind frontend; Supabase backend; deploys to Netlify). It has two learning modules, both live behind cards on the post-child-select home menu (`PracticeModulesPage`, route `/home`):
- **📚 Kumon Method** (`/study`) — the original worksheet-drill module (pre-existing).
- **🧠 Best Brains Method** (`/foundry`) — a **Best Brains-*inspired*** weekly-concept module built by a 7-phase autonomous pipeline. **This is the module you're working on.** All its content is 100% original; "Best Brains" is used as a methodology label for a private/family build (see Rule R6).

The Best Brains module was produced by a documented pipeline: research the real Best Brains program → design the pedagogy & experience → build → test with personas. That pipeline is complete. You are now in the **post-pipeline content + review phase**.

**Repo root (git):** `/home/usthr/Penta_University/Math_Tutor/MindFoundry`
**Supabase project:** `mjooqyjofzsavuqqorcg` (MCP alias `MindFoundry_SB`)

---

## 1. Orient yourself (read in this order)

| # | File | What it gives you |
|---|------|-------------------|
| 1 | `modules/best-brains/meta/PROGRESS.md` | The state index + dated log of everything that happened |
| 2 | `modules/best-brains/meta/DECISIONS.md` | Every judgment call (D1–D25) with rationale |
| 3 | `modules/best-brains/meta/LEARNINGS.md` | L1–L18 — what would improve the pipeline; **feeds the v2 meta-prompt** |
| 4 | `modules/best-brains/build/CONTENT-GENERATION-PLAN.md` | The content-engine design: 14 generation archetypes, the code-computed-answer architecture, the 120-cell coverage table, effort estimates per level |
| 5 | `modules/best-brains/build/CONTENT-STYLE-GATE.md` | The Best Brains authenticity/style gate (10 hard gates + 14 weighted; LLM-judge protocol) |
| 6 | `modules/best-brains/build/BUILD-NOTES.md` | Build increments, module contract, known limitations |
| 7 | `modules/best-brains/build/EXISTING-INFRASTRUCTURE-SURVEY.md` | What app infra was reused vs newly built |
| 8 | `modules/best-brains/research/phase2-gaps/EVIDENCE-LEDGER-FINAL.md` | The 118-row research ledger (E-rows) — the factual foundation; every style/design claim traces here |

---

## 2. Where things stand at handoff

- **The pipeline (Phases 1–7) is complete.** The module is live behind its home-screen card, with placement → weekly cycle → daily practice → mastery check → parent report all built and (for the child flow) live-verified against Supabase. Phase-7 persona testing found 8 critical/high bugs; **all fixed + re-run-confirmed** (commit `a9beb59`).
- **Content engine built; passed CORRECTNESS, FAILED AUTHENTICITY.** A reusable generator (deterministic templates + a shared `lib/` that computes every answer) was built and Level D fully generated (24/24 weeks) and passed the **correctness** gate cleanly (32 packs × 5 seeds, 2,857 assertions, 0 failures). BUT when the **authenticity/style gate** was applied, Level D **FAILED: 1/24 clean ACCEPT, 1 HUMAN_REVIEW, 22 REJECT** (adversarial re-check overturned 11 of 12 scorer passes). Diagnosis: "structurally polished, pedagogically hollow" — single-step noun-swap application items, no multi-step word problems, no discrimination traps, thin modeled examples, no error-analysis, plus real correctness bugs *outside* the answerFor audit (see `build/CONTENT-STYLE-GATE-RESULTS-LEVEL-D.md`). **This is the two-gate architecture working — it caught hollow content the correctness gate passed, before the 111-week fill.** The engine + `lib/` infrastructure is sound; the *content-composition strategy* is what's flawed. On branch `best-brains-content-engine` (commit `290bfb1`) — **NOT merged; do not merge until it passes BOTH gates.**
- **Side requests done + committed** (on main): renamed cards to "Kumon Method"/"Best Brains Method", added the two methodology reference docs (`docs/methodology/`), added the Best Brains progress tab to My Progress (child-safe), changed the module icon to 🧠.

### Git state (important)
- `main` — 7 Best Brains commits (through the style-gate spec `592b2f8`).
- `best-brains-content-engine` — `main` **+ exactly 1 commit** (`290bfb1`, Level-D content). **No divergence → merge is a clean fast-forward.**
- **Nothing is pushed to GitHub** — all commits are local; the live Netlify site does NOT have the module. Test locally (`npm run dev`). Pushing = a production deploy decision for the user.

---

## 3. Your next steps (in order)

**The plan changed after the Level-D style-gate FAIL. Do NOT proceed to the full fill until the generator is fixed and Level D re-passes BOTH gates.**

1. **Read `build/CONTENT-STYLE-GATE-RESULTS-LEVEL-D.md`** — the per-week verdicts, the systemic diagnosis, the 9 concrete generator fixes. **The calibration question is already settled: the hand-authored D17 fixture PASSED (ACCEPT 4.93/4.8) vs the generated corpus at 3.36–3.86 → the gate is WELL-CALIBRATED and the generated content is genuinely hollow. Trust the FAIL; the GENERATOR is the target, not the gate** (one minor adversarial-G7 tuning noted, changes no verdict). Also settled: the two flagged correctness bugs (W6 grades a correct answer wrong; W8 fabricated anchor number) are REAL — the correctness validator QG-5 has **coverage holes** (it audits computational keyed answers but NOT classification-item keys nor narrative/anchor numbers in prose/mistakeBank/hints/parent copy); fix #6 must close these.
2. **Fix the GENERATOR / `lib/`, not individual weeks** (per the 9 recommended changes): the big ones are a **multi-step word-problem synthesizer** (+ a Day-4 multi-step quota enforced by a pre-emit validator that rejects "one-step-arithmetic-with-a-name"), a **situation-type taxonomy** (replace the noun-swap bank), a **discrimination-trap injector**, a **narrated modeled-example template**, a **hint-ladder linter**, a **distractor+answer-key verifier** (also audit narrative/anchor numbers — a correctness-validator hole), an **error-analysis item type**, a **metacognition weaver**, and making the **prior-week concept ledger a required generator input**.
3. **Regenerate Level D + re-run BOTH gates** (correctness via `bb-verify-packs`, authenticity via the style-gate workflow — resumable at `scriptPath` in PROGRESS). **Require ≥80% clean-ACCEPT before authorizing the fill.**
4. **Then merge `best-brains-content-engine` → `main`** (fast-forward) and **do the full content fill**: the remaining ~80 weeks — Levels A, B, C, E to 24 weeks each. **Level B needs new clock/time + coin/money item generators**; **Level E** has the riskier data-display + proof cells (keep human/AI-runtime-flagged). Every generated week must pass BOTH gates.
5. **Fable-5 strategic review batch** (switch model with `/model` — see Rule R5): (a) a Fable pass over a *sample* of generated weeks + the style-gate results, hunting pedagogy/authenticity gaps the LLM-judge missed; (b) **write the v2 meta-prompt** — `modules/best-brains/meta/MASTER-META-PROMPT-TEMPLATE-v2.md` (parameterized: `{{PROGRAM_NAME}}`, `{{SUBJECT}}`, `{{DISAMBIGUATION}}`, `{{KNOWN_DIFFERENTIATORS}}`, `{{COMPARISON_ANCHORS}}`) **+ `NEXT-PROGRAMS-STARTER.md`** (pre-filled blocks for RSM, Mathnasium, Singapore Math). The v2 template MUST add: a dedicated **Question-Generation Engine phase** (per L17) and the **Strategic Top-Model Review layer** (per L18); (c) a final whole-build **completeness critic** pass.

---

## 4. Non-negotiable rules

- **R1 — Correctness architecture.** Answers are **computed by code** (`frontend/src/modules/best-brains/generator/templates/lib/compute.ts` — exact Frac/Dec math), **never asserted by an AI**. The AI designs question *structure* + *language*; code computes the answer; the validator re-derives it (QG-5 audit). A wrong answer key must remain structurally impossible.
- **R2 — Two gates, both required.** Every generated pack passes `generator/validator.ts` (QG-1..10 + arithmetic audit) **and** the authenticity gate (`CONTENT-STYLE-GATE.md`, applied by an LLM judge) before it ships. Correctness ≠ authenticity.
- **R3 — Child-safe law.** On any child-reachable surface, the child **never** sees a %, a red mark, the word "Review", or "fail". Verdicts/percentages are parent-surface only. (This is enforced in the built UI; preserve it.)
- **R4 — Git hygiene.** Commit **pathspec-only** (never `git add .`). **Never** sweep the repo's pre-existing untracked junk (`PLAN.md`, `QA_REPORT_FINAL.md`, `PEDAGOGICAL_QA_REPORT.md`, `qa-screenshots/`, `qa_screenshots/`, `frontend/dev-dist/`, `video/`, the `docs/*.md` research drops). Keep `main` buildable (`npm run build`) at every commit. Commit trailer: `Co-Authored-By: Claude <model> <noreply@anthropic.com>`. Do NOT push to GitHub without the user's explicit say-so (it triggers a Netlify production deploy).
- **R5 — Model strategy (per L18).** Use a strong workhorse (**Opus 4.8**) for gated volume work (content generation, fixes) — the gates, not the model tier, are the correctness bottleneck. Reserve **Fable 5** for the strategic-review layer: pedagogy-ceiling review, completeness critic, and the v2 meta-prompt synthesis. The user switches models with `/model`; flag when you've reached a Fable checkpoint.
- **R6 — Branding.** "Best Brains Method" / "Kumon Method" are the user's chosen labels for this **private build**. The neutral codename **"Foundry Method"** is kept in code comments (`registry.ts`, `PracticeModulesPage.tsx`) — revert the registry `displayName` to it for any public/commercial release. The module `id` stays `best-brains`. Never claim affiliation.
- **R7 — Self-document.** Keep `PROGRESS.md`, `DECISIONS.md`, `LEARNINGS.md` current as you work — they are the handoff mechanism.

---

## 5. Key architecture facts

- **The engine is a deterministic, template-based generator** — NOT live-AI at runtime. `generatePack(level, week, packSeed, contentVersion)` (`frontend/src/modules/best-brains/generator/packGenerator.ts`) is a pure function → same seed = identical pack. **Packs are never stored**; they're regenerated on demand from `bb_week_state.pack_seed`.
- **The shared library** (`generator/templates/lib/`): `compute.ts` (answer source-of-truth), `guard.ts` (makes structural gates pass by construction), `items.ts` (item generators), `assemble.ts` (owns the day skeleton, 20–30% spaced retrieval, dose, Form-A/B pairing, distractor coverage — throws at authoring time on drift). Week builders (`templates/weeks/*.ts`) are ~110–170-line compositions.
- **Coverage now: 32/120 cells** generated+validated (A1,A2,B1,B2,C1,C2 templates + A15,B14,D17 fixtures + Level D d01–d24). ~80 auto-generatable pending. ~8 need human/AI-runtime review.
- **A pack contains:** identity, teacher explanation, guided examples (fading), days[1..5] of items, a puzzle, a fluency sprint (null at Level A), a mastery check (Form A + Form B isomorphs), a mistake bank (error-tagged), a parent-summary seed.
- **Grading is algorithmic + server-authoritative.** `answers.ts::checkAnswer` (equivalent fractions/numerics/commutativity/lists). The weekly Passed/Review verdict is computed by a SECURITY DEFINER RPC `bb_score_mastery_check` (85% threshold + stability rule; clients can't self-award a pass). **No AI is used to grade.** AI's future runtime role (Haiku 4.5) is limited to open-response grading + the weekly parent narrative — see the plan.
- **Supabase tables:** `bb_enrollment`, `bb_week_state`, `bb_item_attempts`, `bb_parent_reports` (+ the RPC), all live on the project with RLS. Read them via `services/bbProgressService.ts` / `screens/parent/bbParentService.ts`.
- **Module Interface Contract:** `frontend/src/modules/core/contract.ts` + `registry.ts` — both Kumon and Best Brains conform; this is what lets new program-modules (RSM/Mathnasium/Singapore) slot in.

---

## 6. How to test (headless, no live auth needed)

- **Default: Playwright headless driving system Chrome** (`channel: 'chrome'`, `playwright-core` is a devDependency). See `modules/best-brains/testing/BROWSER-TESTING-TOOLING.md` (gotchas: block the service worker, warm the cold route, mock the Supabase backend for auth-gated flows).
- **Harness:** `modules/best-brains/testing/harness/` (`harness.ts` + `fixtures.ts` — honest scenario builders using the real generator; `run-*.ts` per persona).
- **Persona specs:** `modules/best-brains/testing/personas/` (teacher / 3 student simulators / parent).
- **To test the live app:** `cd frontend && npm run dev` → localhost:5173 → log in → **use a fresh child** → 🧠 Best Brains Method card. (Fresh child = clean placement into Levels A/B/C/**D**; the placement content spans those.)
- **To run the correctness gate:** `cd frontend && npx tsx scripts/bb-verify-packs.ts`.

---

## 7. What's owed / open

- **The full content fill** (Step 3 above) — the biggest remaining job.
- **Phase 7c** — the v2 meta-prompt + next-programs starter (Fable task, Step 4).
- **The ~8 human-review cells** (proofs E12; figure/lab E19,E22; open design E23; scattered A/C oral/figure Day-5 pages) — flagged in the plan; need either human authoring or an AI-runtime open-response grader.
- **Netlify deploy** — nothing is pushed; the live site lacks the module. Push is a user decision.
- **Original pipeline meta-prompt** is archived at `modules/best-brains/meta/MASTER-META-PROMPT-v1.md`.

---

## 8. How to start (paste-prompt for the new conversation)

> You are taking over the **Best Brains Method** module build in Mind Foundry (repo: `/home/usthr/Penta_University/Math_Tutor/MindFoundry`). The active work is on git branch **`best-brains-content-engine`** (confirm you're on it: `git branch --show-current`; `main` is the clean pipeline-complete state one commit behind). Read `modules/best-brains/meta/HANDOVER.md` in full, then `modules/best-brains/meta/PROGRESS.md`, `modules/best-brains/build/CONTENT-STYLE-GATE-RESULTS-LEVEL-D.md`, `modules/best-brains/build/CONTENT-GENERATION-PLAN.md`, and `modules/best-brains/build/CONTENT-STYLE-GATE.md`. **Status: the content engine passed the correctness gate but FAILED the authenticity/style gate on Level D (1/24) — the generated content is "structurally polished, pedagogically hollow." The gate is confirmed well-calibrated (the hand-authored D17 fixture passed at 4.93 vs the corpus at ~3.4), so the GENERATOR is the target, not the gate.** Start from Step 2 of the handover: FIX THE GENERATOR/LIBRARY per the 9 recommended changes (multi-step word-problem synthesizer, situation-type taxonomy, discrimination-trap injector, narrated modeled examples, hint linter, distractor+answer-key verifier that also audits classification-item keys + narrative/anchor numbers, error-analysis item type, metacognition weaver, prior-week ledger input) — do NOT hand-patch individual weeks. Then regenerate Level D and re-run BOTH gates, requiring ≥80% clean-ACCEPT before filling the remaining ~80 weeks. Do NOT merge the branch or scale up until Level D re-passes both gates. Obey the non-negotiable rules (code-computed answers, both gates required, child-safe law, pathspec-only commits, model strategy). Orchestrate with sub-agents/workflows; use Opus 4.8 for gated volume and tell me when you've reached a Fable-5 strategic-review checkpoint. Keep the meta docs current.
