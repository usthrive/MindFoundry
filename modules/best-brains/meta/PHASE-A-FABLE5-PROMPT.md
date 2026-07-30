# PASTE-READY PROMPT — Phase A (Fable 5)

*Start a new conversation in **Fable 5**, paste everything below the line. Phase A is judgment and
design only — no volume authoring. It ends by handing back to Opus.*

---

You are the lead curriculum architect on **Mind Foundry**, a children's math-practice web app
(repo: `/home/usthr/Penta_University/Math_Tutor/MindFoundry`, git branch `best-brains-content-engine`,
baseline commit `faf8d53`). You are running **Phase A of a three-phase plan**: *Fable 5 for judgment →
Opus for gated build → Fable 5 for final sign-off.* This is the project's settled model strategy: the
top model where judgment compounds and automated gates cannot reach; a strong workhorse under
deterministic + adversarial gates for volume execution.

**Your job in this conversation: review, decide, and specify. Do not author content at scale, and do
not write production generator code — you produce specs that Opus will execute.**

## 1. What this project is

The **Best Brains Method** module (`/foundry` route) teaches math as **5 levels × 24 weekly concepts =
120 cells**, A (pre-K) → E (middle-school readiness). Each cell is a `WeeklyConceptPack`: a concept
explanation, guided examples that fade, 5 days of practice, a puzzle, a mastery check, a mistake bank,
and a parent summary. Packs are **generated deterministically by code** from `(level, week, seed)` —
never stored, never live-AI at runtime.

**The correctness architecture (inviolable):** an AI never asserts an answer. Every answer is computed
by code (`answerFor`) and independently re-derived by the validator. Items that embed a worked claim
(error-analysis) carry a `verifyFor` so the truth is recomputed too. A wrong answer key is
structurally impossible.

**The two-gate shipping rule:** every pack must pass (1) the deterministic validator (QG-1..11) **and**
(2) an LLM **authenticity/style gate** (10 hard gates + 14 weighted criteria, two-pass scoring plus an
adversarial anti-drift re-check). Correctness ≠ authenticity — both are required.

## 2. Verified state (re-confirmed by an Opus-5 audit, 2026-07-22)

- **Level D is COMPLETE and proven: 23/23 generated weeks clean-ACCEPT on the authenticity gate
  (100%)**, adversarially confirmed. The previous generation of this same content scored **1/24 (~4%)**
  — "structurally polished, pedagogically hollow." A generator rebuild closed that gap.
- Correctness gate: **7,877 assertions, 0 failures**. QG-11 regression suite passes. `tsc` clean.
  Every Level-D week is **seed-invariant** across 120 seeds.
- **Coverage is the gap: 32 of 120 cells exist.** Level A 3/24 · B 3/24 · C 2/24 · **D 24/24** · E 0/24.
  The A/B/C cells that exist are *old-engine* content (the "before" quality). **Level E is empty.**

## 3. Read these before deciding (all on disk)

| File | Why |
|---|---|
| `modules/best-brains/meta/HANDOVER.md` | Status banner + full project history |
| `modules/best-brains/build/CONTENT-GENERATOR-FIX-SPEC.md` | **The v2 pedagogy contract** — 13 preflight gates, QG-11, `verifyFor`. Rev 2, hardened by a 4-lens adversarial review that caught 7 blockers before any code was written |
| `modules/best-brains/build/FANOUT-AUTHORING-KIT.md` | Per-week authoring recipes + rules earned from real bugs |
| `modules/best-brains/build/CONTENT-STYLE-GATE.md` | The authenticity gate you are designing against |
| `modules/best-brains/build/CONTENT-GENERATION-PLAN.md` | Archetype taxonomy + the 120-cell coverage plan |
| `modules/best-brains/meta/LEARNINGS.md` | L1–L24 — especially **L17** (question-engine = its own phase), **L18** (top-model review layer), **L19–L24** (rebuild + audit lessons) |
| `modules/best-brains/meta/DECISIONS.md` | D25–D27 |
| Sample real content | `frontend/src/modules/best-brains/generator/templates/weeks/d04.ts` (the reference exemplar) and `d06.ts`, `d18.ts`, `d21.ts` |

To read *generated output* rather than source, run from `frontend/`:
```bash
npx tsx -e "import {generatePack} from './src/modules/best-brains/generator/packGenerator';
console.log(JSON.stringify(generatePack('D',18,777),null,2))"
```

## 4. ⚠ START FROM THESE FINDINGS — do not re-derive them

A fresh-eyes Opus-5 audit of the 100%-ACCEPT Level-D corpus confirmed the **depth is genuinely
strong** (the why-before-how, narrated think-alouds, multi-step problems and error-analysis are real
teaching). But it found four defect classes that **ship today despite both gates passing**, because
the gates score *pedagogical depth within one week* and never check **surface realism** or look
**across** weeks:

1. **Money formatting is systematically wrong** (D12; check D14/D20): `"$0.1 of a dollar"`,
   `"saved $0.5 … spent $0.2"`, and even `"added $0.7 and $0.40"` — inconsistent inside a single
   prompt. Currency must always render 2 decimal places. The arithmetic audit passes because the
   *value* is correct; only the presentation is broken. A parent notices instantly.
2. **Unreduced fractions in real-world prose**: `"a recipe uses 2/4 cup of flour"`, `"cuts off 2/4 of
   the ribbon"`. **⚠ Do NOT specify a blanket "always reduce" rule** — in D9's comparison items
   (`"Which is greater: 1/2 or 2/6?"`) unreduced fractions are *pedagogically correct*; that IS the
   lesson. The rule must be **context-sensitive**: reduce in real-world quantities, preserve in
   equivalence/comparison tasks.
3. **Context repetition across weeks** (a human tester spotted this within minutes): multiplication
   weeks D5/D8/D15 all use theater/stadium seats; division weeks D6/D7/D16 all use seating-at-tables
   or buses. Each week was authored independently and each picked the most natural context.
4. **Duplicate warm-up formats within a single day** — minor, but visible.

## 5. Your Phase-A deliverables

**(a) Pedagogy-ceiling review.** Sample ~5 Level-D weeks across archetypes (place value, division,
fractions, decimals, geometry/algebra). Judge what no rubric can: is the *why* genuinely
illuminating or merely accurate? Are the multi-step problems *interesting*, or two operations stapled
together? Do the error-analysis tasks target the misconception a real 10-year-old actually holds? Is
the voice warm without being saccharine? Write `build/PEDAGOGY-CEILING-REVIEW.md` — findings plus the
specific lifts Opus should apply when filling the remaining levels. (Do **not** re-run the gates; they
pass. Review the ceiling above them.)

**(b) `build/POLISH-PASS-SPEC.md`** covering all four findings in §4: a currency/units rendering rule;
the context-sensitive fraction-simplification rule; a broadened situation-context pool per archetype
plus a shared **cross-week context ledger** so consecutive same-archetype weeks rotate contexts; and
warm-up format variety. For each item state whether it is a **library fix**, a **new preflight gate**,
or **both** — prefer *both*, so regression is impossible. (That "make it structurally impossible"
discipline is precisely why Level D holds at 100%.)

**(c) `build/FILL-ARCHITECTURE.md`** for Levels A, B, C, E. For each level: which existing archetypes
cover it; which **new generator families** are needed (**Level B**: clock/time + coin/money;
**Level E**: ratio/percent/integers/exponents/algebra, plus figure handling for data displays,
circles, probability); the band settings (A = beginner, audio-first, no timed elements ever; B/C =
intermediate; E = advanced); and per-week concept recipes extending FANOUT-AUTHORING-KIT §D. Level A
is a genuinely different pedagogy for ages 3–5 — treat it as a design problem, not a scaling problem.
Be explicit about the ~8 cells that are honestly **not** fully code-computable (proofs E12; figure/lab
E19/E22; open design E23) — they ship a computable core plus a flagged open part, and are never faked.

**(d) `build/PHASE-B-BUILD-PLAN.md`** — the ordered task list Opus will execute: new generator
families first (built centrally, to avoid concurrent-edit conflicts), then per-level fills, with the
gate and commit cadence and the ≥80%-clean-ACCEPT-per-level go/no-go.

**Then STOP and tell me to switch to Opus.** Do not begin the build yourself.

## 6. Method that works here (proven, reuse it)

**Exemplar-first:** prove ONE unit through both gates → distill the pattern into an authoring kit →
run a small validation wave (~4 units) → only then fan out. A validation wave caught a real bug before
it propagated to 18 weeks. **Adversarial review before building:** a 4-lens critique of the build spec
caught 7 blockers including a mechanism that could not physically run. **Gates over inspection:** if a
quality property matters, encode it as a throwing preflight gate, not a guideline.

## 7. Non-negotiables

- **Code-computed answers.** An AI never asserts an answer; embedded-claim items carry a `verifyFor`.
- **Both gates required**; ≥80% clean-ACCEPT per level before that level ships.
- **Child-safe law:** on any child-facing surface — never a %, a red mark, "fail", or "Review".
  ("Wrong" is permitted *only* inside an error-analysis task about a hypothetical third party.)
- **Gates must be seed-invariant** — they run at pack-generation time, so a gate that depends on drawn
  operands breaks packs for untested seeds.
- **Git:** pathspec-only commits, never `git add .`; never touch the repo's pre-existing untracked
  files (`PLAN.md`, `QA_REPORT_FINAL.md`, `PEDAGOGICAL_QA_REPORT.md`, `qa*screenshots/`,
  `frontend/dev-dist/`, `video/`, the `docs/*.md` drops). **Do not merge or push** — those are my
  decisions (a push triggers a production deploy).
- **Branding:** "Best Brains Method" is the label for this private build; the neutral codename
  "Foundry Method" stays in code; never claim affiliation with any real company.
- Keep `PROGRESS.md` / `DECISIONS.md` / `LEARNINGS.md` current.

## 8. Verification commands (from `frontend/`)

```bash
npx tsx scripts/bb-verify-packs.ts   # correctness gate (QG-1..11, determinism, seeds)
npx tsx scripts/bb-qg11-test.ts      # QG-11 anchor/claim regression suite
npx tsc --noEmit                     # types
npm run dev -- --host                # then http://<wsl-ip>:5173/test-foundry to eyeball any week
```
Reusable orchestration lives in `modules/best-brains/build/workflows/` —
`bb-fanout-weeks.workflow.js` (one agent authors + self-verifies one week) and
`bb-style-gate.workflow.js` (two-pass scorer + adversarial re-check over a list of packs).

**Begin with §5(a): read real generated content and tell me what you actually think of it.**
