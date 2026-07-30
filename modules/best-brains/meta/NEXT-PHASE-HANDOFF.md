# NEXT-PHASE HANDOFF — Best Brains: finish the module (A/B/C/E fill + polish + Fable-5 checkpoint)

*This file is a **paste-ready prompt** for the next AI-agent conversation. It orchestrates the work
across THREE model phases — **Fable 5 for judgment → Opus 4.8 for gated build → Fable 5 for final
check** — the model strategy the project settled on (L18/R5): the top model where judgment compounds
and gates can't reach; the strong workhorse under deterministic + adversarial gates for volume.*

**How to use:** Start the next conversation **in Fable 5**, paste everything from the line below down.

---

You are taking over the **Best Brains Method** module in Mind Foundry (repo:
`/home/usthr/Penta_University/Math_Tutor/MindFoundry`, git branch `best-brains-content-engine`). The
generator has been **rebuilt** and **Level D is complete** — the hard architectural work is done and
proven. Your job is to finish the module (fill Levels A, B, C, E), apply one polish pass, run the
Strategic Top-Model Review, and update the meta-prompt. **Run this in three model phases as marked.**

## 0. Ground truth — read before doing anything
- **State:** Level D = **23/23 generated weeks clean-ACCEPT on the authenticity gate (100%)**,
  adversarially confirmed (old corpus was 1/24). Correctness gate GREEN (`cd frontend && npx tsx
  scripts/bb-verify-packs.ts` → 7,877 assertions, 0 failures); QG-11 regression pass (`npx tsx
  scripts/bb-qg11-test.ts`); `npx tsc --noEmit` clean; every D week seed-invariant across 120 seeds.
- **First, check git state:** `git -C <repo> status`. The rebuild may be **uncommitted** on
  `best-brains-content-engine`. If so, review the diff and **commit it pathspec-only** (never
  `git add .`; never sweep the pre-existing untracked junk — see §Non-negotiables) before building on
  top, so you start from a clean base. Do NOT merge to main or push (user's call).
- **Read, in order:** `modules/best-brains/meta/HANDOVER.md` (top status banner),
  `build/CONTENT-GENERATOR-FIX-SPEC.md` (Rev 2 — the v2 pedagogy contract, the 9 fixes, the 13 gates),
  `build/FANOUT-AUTHORING-KIT.md` (per-week recipes + the hard rules), `build/CONTENT-STYLE-GATE.md`
  (the authenticity gate), `build/CONTENT-GENERATION-PLAN.md` (coverage plan for the remaining ~90
  cells), `meta/LEARNINGS.md` (L1–L23), `meta/DECISIONS.md` (D25–D27).
- **Reusable tools already in the repo:** `build/workflows/bb-fanout-weeks.workflow.js` (one agent per
  week authors + self-verifies a blueprint) and `build/workflows/bb-style-gate.workflow.js` (two-pass
  scorer + adversarial anti-drift over a list of packs). Re-launch them with the Workflow tool via
  `{scriptPath}`. A live in-app preview of any generated week is at route **`/test-foundry`**
  (`frontend/src/pages/FoundryPreviewPage.tsx`) — pick a week, reroll the seed, toggle three styles.

## 1. The model-phase workflow (follow this structure)
- **PHASE A — Fable 5 (you, now): judgment & design.** Do the pedagogy-ceiling review + design the
  polish + design the A/B/C/E fill + draft the meta-prompt plan → produce a concrete BUILD PLAN → then
  **STOP and tell the user: "Switch to Opus 4.8 (`/model`) and continue."**
- **PHASE B — Opus 4.8: gated build.** Execute the BUILD PLAN under both gates → when every level
  clears ≥80% clean-ACCEPT and correctness is green → **tell the user: "Switch back to Fable 5 for the
  final check."**
- **PHASE C — Fable 5: completeness critic & sign-off.** Whole-build review + finalize the meta-prompt
  → produce the final report + the merge/deploy recommendation (the merge/push/deploy itself is the
  user's decision).

---

## 2. PHASE A — Fable 5 (DO THIS NOW)
Spend the top model where it compounds. Produce, as artifacts on disk under `build/`:

> ### ⚠ START FROM THESE FINDINGS — an Opus-5 audit (2026-07-22) already found what the gates miss
> Both gates score **pedagogical depth within one week**. They do **not** check **surface realism**,
> and they never look **across** weeks. A fresh-eyes audit of generated Level-D content confirmed the
> depth is genuinely strong (the why-before-how, narrated modeling, multi-step problems and
> error-analysis are real teaching) but found four defect classes that ship today. Do not re-derive
> these — design the fix:
> 1. **Money formatting is wrong, systematically** (D12, check D14/D20): `"$0.1 of a dollar"`,
>    `"saved $0.5 … spent $0.2"`, and even `"added $0.7 and $0.40"` — inconsistent inside one prompt.
>    Currency must always render 2 decimal places. The arithmetic audit passes because the *value* is
>    right; only presentation is broken. A parent notices instantly.
> 2. **Unreduced fractions in real-world prose**: `"a recipe uses 2/4 cup of flour"`, `"cuts off 2/4
>    of the ribbon"`. **Nuance — do NOT write a blanket "always reduce" rule:** in D9's comparison
>    items (`"Which is greater: 1/2 or 2/6?"`) unreduced fractions are *pedagogically correct* — that
>    IS the lesson. The rule must be context-sensitive: reduce in real-world quantities, preserve in
>    equivalence/comparison tasks.
> 3. **Context repetition across weeks** (a human tester caught this): multiply weeks D5/D8/D15 all use
>    theater/stadium seats; division weeks D6/D7/D16 all use seating-at-tables/buses. The gate checks
>    variety *within* a week only, and single-step fluency items repeat one context.
> 4. **Duplicate warm-up formats within a day** (minor, but visible).

1. **Pedagogy-ceiling review of Level D.** Sample ~5 generated weeks across archetypes + read the
   style-gate ACCEPTs. You are looking for the ceiling the LLM gate can't enforce: is the *why*
   genuinely illuminating, are the multi-step problems *interesting* (not just two ops stapled
   together), do the error-analysis tasks target the misconception a real 10-year-old holds? Note
   anything Opus should lift in the fill. (Do NOT re-run the gates — they pass; review the ceiling.)
2. **Design the POLISH PASS** (`build/POLISH-PASS-SPEC.md`) covering all four findings above:
   (a) a **currency/units rendering rule** (money always 2dp; enforced in the library so no week can
   get it wrong); (b) the **context-sensitive fraction-reduction rule**; (c) a broadened
   situation-context pool per archetype plus a shared **cross-week context ledger** so consecutive
   same-topic weeks rotate contexts; (d) warm-up format variety. For each, say whether it is a
   library fix, a new **preflight gate**, or both — prefer *both*, so a regression is impossible
   (that discipline is exactly why Level D holds at 100%). This is Opus's first build task: prove on
   Level D, then re-gate the changed weeks and require they stay ACCEPT.
3. **Design the A/B/C/E fill plan.** For each level: which existing archetypes cover it, which **new
   generator families** are needed (Level B: clock/time + coin/money; Level E: ratio/percent/integers/
   exponents/algebra + figure-handling for data-displays/circles/probability — keep genuinely
   figure-/proof-dependent Day-5 cells human/AI-runtime-flagged, per CONTENT-GENERATION-PLAN §4), the
   per-week concept recipes (extend FANOUT-AUTHORING-KIT §D with A/B/C/E rows), and the band settings
   (A = beginner/audio-first; B/C = intermediate; E = advanced). Sequence: build the new shared
   generator families FIRST (centrally, to avoid concurrent-edit conflicts), then fan out weeks.
4. **Draft the v2 meta-prompt plan.** Skim `meta/FABLE5-METAPROMPT-BRIEF.md` — that is the exact task
   for the meta-prompt synthesis (deferred to PHASE C). Here in PHASE A, just confirm the plan and
   flag anything the fill should capture for it.
5. **Write a BUILD PLAN** (`build/PHASE-B-BUILD-PLAN.md`) Opus will execute: ordered tasks, the new
   generator families with signatures, per-level week recipes, the gate/commit cadence, and the
   ≥80%-per-level go/no-go. Then **STOP and instruct the user to switch to Opus 4.8.**

---

## 3. PHASE B — Opus 4.8 (after the user switches models)
Execute `build/PHASE-B-BUILD-PLAN.md`. The gates — not the model — are the correctness bottleneck, so
this is the right phase for Opus. In order:

1. **Context-variety pass** (from PHASE A design): broaden situations + cross-week ledger + the light
   gate; prove on Level D; **re-run correctness + re-gate the changed weeks; require they stay ACCEPT.**
2. **Build the new generator families** centrally (clock/coin for B; ratio/percent/integers/figure for
   E) — with `answerFor` registrations and, for any embedded-claim items, `verifyFor` — so QG-5/QG-11
   still audit every answer. Add tests.
3. **Fill each level** (recommended order C → B → A → E, easiest reuse first; E last) using
   `bb-fanout-weeks.workflow.js` under the FANOUT-AUTHORING-KIT contract. For EACH level: exemplar-
   first (prove one week both gates) → validation wave of ~4 → fan out the rest → integrate into
   `V2_WEEKS` → **correctness gate green + 120-seed sweep + `bb-style-gate.workflow.js` ≥80% clean-
   ACCEPT** before moving to the next level. Fix stragglers (the gate emits precise regeneration
   hints, as it did for D10/D2/D24). Keep `tsc` clean and commit pathspec-only per level.
4. When all 120 cells are built + every level clears ≥80% + correctness green → **tell the user to
   switch back to Fable 5.**

## 4. PHASE C — Fable 5 (final check)
1. **Whole-build completeness critic:** across all 120 cells, what's missing — a modality never
   exercised, a claim unverified, a level whose depth sags, the honest human/AI-runtime-flagged cells?
2. **Final pedagogy-ceiling review:** a sample from each level; confirm the module reads as one
   coherent program A→E, not five disjoint fan-outs.
3. **Finalize the meta-prompt:** execute `meta/FABLE5-METAPROMPT-BRIEF.md` →
   `MASTER-META-PROMPT-TEMPLATE-v2.md` + `NEXT-PROGRAMS-STARTER.md`.
4. **Final report + recommendation:** the coverage ledger (X/120 auto-generated+gated, Y flagged),
   the gate results per level, and a merge/deploy recommendation — leaving the actual merge/push/
   Netlify deploy as the **user's** decision.

## 5. Backlog / additional items to fold in
- The context-variety polish (§2.2 / §3.1) — the concrete tester finding.
- The `/test-foundry` preview page + its `App.tsx` route are **dev-only tooling** — decide whether to
  keep in the tree or gate behind `import.meta.env.DEV`.
- The ~8 genuinely open cells (proofs E12; figure/lab E19/E22; open-design E23; scattered oral/figure
  Day-5s) — ship a computable core + an `[image: …]`/`manual-review` flag; never fake them.
- Owed from the original pipeline: first-fill reconciliation, dashboard onboarding of the new content.

## 6. Non-negotiables (unchanged — obey exactly)
- **R1 Code-computed answers** — `answerFor` computes, the validator re-audits; an AI never asserts an
  answer. Embedded-claim items carry a `verifyFor`.
- **R2 Two gates, both required** — deterministic `validator.ts` (QG-1..11) AND the LLM authenticity
  gate. ≥80% clean-ACCEPT per level before that level ships.
- **R3 Child-safe law** — no %, red, "fail", "wrong"/"Review" aimed at a child ("wrong" is allowed only
  inside a hypothetical-third-party error-analysis task).
- **R4 Git hygiene** — pathspec-only commits, never `git add .`; never touch the repo's pre-existing
  untracked junk (`PLAN.md`, `QA_REPORT_FINAL.md`, `qa*-screenshots/`, `frontend/dev-dist/`, `video/`,
  the `docs/*.md` drops). Keep `main`/branch buildable. Do NOT push without the user's say-so (push =
  a Netlify production deploy). Commit trailer per the model doing the work.
- **R5 Model strategy** — this document. Opus for gated volume; Fable 5 only at the review checkpoints.
- **R6 Branding** — "Best Brains Method" is the private-build label; neutral codename "Foundry Method"
  in code; never claim affiliation.
- **R7 Self-document** — keep PROGRESS/DECISIONS/LEARNINGS/HANDOVER current as you go.

## 7. How to verify anything
- Correctness: `cd frontend && npx tsx scripts/bb-verify-packs.ts` (add each new week to `V2_WEEKS`).
- QG-11: `npx tsx scripts/bb-qg11-test.ts`. Types: `npx tsc --noEmit`. Build: `npm run build`.
- Authenticity: dump packs to JSON + run `build/workflows/bb-style-gate.workflow.js` (compact args
  `{packsDir, weeks, algebra}`).
- Eyeball content live: dev server `npm run dev -- --host` → `http://<wsl-ip>:5173/test-foundry`.
