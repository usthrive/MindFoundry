# Development prompt — system-fix Phase 1 (seam audit + owed content + lane specs)

**Hand this file to a development agent verbatim.** It is written to be executed, not read for
context. Scope: the first execution phase of `PROGRAM-PLAN-2026-08-11.md` — everything that can
move **without** the pending owner rulings. Est. 3–5 working sessions.

---

## 0. Mission

The module's weeks are excellent; the ladder around them is wrong (compressed, drifting, with
standards falling through seams) and its volume/retention machinery is designed but unbuilt. The
program plan fixes this in workstreams. **Your phase: produce the seam-audit matrix that all
future authoring depends on (WS-2), finish the owed content (d17 + Level A's 11 RED slots), and
write the two lane specs (WS-3/WS-4).** You do not author new-ladder content in this phase — the
targets for that come out of your own audit plus three owner rulings that are still pending.

## 1. Read first, in this order

1. `meta/PROGRAM-PLAN-2026-08-11.md` — the plan you are executing. §1a ladder, §1b lanes + the
   **owner time ceiling** (daily practice ≤20–30 min hard, ~10–13 min target — never design past it).
2. `meta/EXPERT-ASSESSMENT-2026-08-11.md` — the why behind every task here (defects D1–D4,
   corrections C1–C5). §2's Grade-2 audit is your WS-2 template.
3. `meta/RESEARCH-FINDINGS-CURRICULUM-SCOPE.md` + `RESEARCH-DATA-weekly-signal.md` — the measured
   source-program facts (26 wks/level, 7 packets, one-standard-per-week, volume tables).
4. `build/FILL-ARCHITECTURE.md` — band settings (§1), per-level recipe tables **with per-level
   column headers** (§3–§6; they differ per level — see the corrected Deliverable-4 spec in
   `meta/RESEARCH-PROMPT-CURRICULUM-SCOPE.md`), the not-fully-computable list (§7).
5. `meta/HANDOFF-2026-08-10-LEVEL-A.md` — **the authoritative nine-gate list and how to run each
   gate.** Do not trust gate names quoted anywhere else, including in this file.
6. `research/phase2-gaps/DESIGN-DEFAULTS.md` — DD1–DD13 with the 2026-08-11 correction blocks on
   DD2/DD3. Anything `[original design]` is ours; anything in a correction block supersedes the
   text above it.
7. `research/phase2-gaps/EVIDENCE-LEDGER-FINAL.md` — E1–E101. **House rule (earned twice): the
   E-ledger is part of "already known" — check it before claiming anything is unknown.**

## 2. Decided vs pending — respect both

**Decided (do not re-open):**
- **R6 (D37, 2026-08-11): the week is 5 days; days 6–7 are OPTIONAL extra credit only** —
  generator-lane content, opt-in, never required, never affecting verdicts, streaks, or
  parent-report standing. Write the lane specs' days-6–7 sections as opt-in extra credit.
- Daily time ceiling (above). Mastery pass = **80** (constants + RPC; changed from 85 on
  2026-08-10 — copy was just fixed to match, keep it sourced from `MASTERY_THRESHOLD_PCT`).
- Parent-facing copy may never describe an unbuilt mechanism (WS-0 class).
- Volume comes from **generators, never authoring** (plan §1b).
- The nine gates and all D/E gate thresholds are floors — never weaken.

**Pending owner rulings (R1 identity · R2 ladder adoption).** Consequence for you: produce the
audit and specs so they are **ruling-independent** — the CCSS-to-week mapping is true under any
ladder naming, and nothing you write may presuppose an R1/R2 outcome.

## 3. Workspace state (verify before starting)

Branch `best-brains-content-engine`; substantial **unmerged and uncommitted** work exists,
including this phase's meta docs and the WS-0 copy fixes (`parentCopy.ts`, `TrendsView.tsx`,
`FreshProblems.tsx`, `WeeklyCheck.tsx` — tsc verified green 2026-08-11). House rules:
**explain-before-commit** (exact contents + pathspec, owner approval BEFORE any `git commit`);
`git merge` is classifier-blocked here — use `gh pr merge --squash`. WSL budget: **1–2 agents max**
(`bb-agent-budget.ts` prints the number — check it before any fan-out).

## 4. Task 1 — WS-2 seam audit (the keystone; do this first)

Deliverable: `build/SEAM-AUDIT-K8.md`. For each grade K–8:

1. Enumerate the grade's CCSS standards (cite by code, e.g. `2.MD.B.5`).
2. For each standard, find the week that **teaches** it. Item-level verification: open the week's
   template file and check what its generators/slots actually produce — do not trust the recipe
   table row. (Lesson L-class: measure the surface the child touches, not the artefact the author
   wrote.)
3. Classify: **TAUGHT(week-id)** / **TOUCHED-ONLY(week-id, what's missing)** / **ORPHAN**.
4. Output per proposed level M0–M9 (plan §1a): a full scope-and-sequence table in that level's
   authoring format, each row marked EXISTS(id) / MOVE(id) / NEW. Every NEW row must carry concept,
   anchor, **named misconception**, and Day-5 signature — a row without the misconception cannot be
   authored and will be rejected downstream.
5. Determine the split points from content, not from plan docs: B→M2/M3 (expected B12|B13 — verify),
   C→M3/M4 (expected C4|C5 — verify), **D→M5/M6 and E→M7/M8 (unknown — read the d/e week files)**.
6. Priority order inside the audit: the six known Grade-2 orphans first (`2.MD.A.3`, `2.MD.A.4`,
   `2.MD.B.5`, `2.MD.B.6`, `2.G.A.1`, `2.G.A.2`) — confirm or refute each at item level.
   `2.G.A.2` matters most: it is the conceptual seed of area (C20).

Accept: every K–8 standard classified; zero unexplained ORPHANs; M0–M9 tables complete enough that
an authoring agent needs no other input; split points stated with the evidence line per split.

## 5. Task 2 — owed content (parallel-safe with Task 1 if budget allows)

**2a. Level A's 11 entropy-RED certifying slots** (A1 ×7, A11 ×3, A2 ×1): author 3-option
misconception-faithful tap choices, copying A12's `withPartnerChoices` pattern. Law: **never
declare a lure in a certifying slot**; band-A certifying slots MUST carry authored choices
(pre-readers cannot type — "free-entry numeric" is not a real band-A answer mode).
**2b. d17**: first locate its recipe (check `build/CONTENT-GENERATION-PLAN.md` and
`PHASE-B-BUILD-PLAN.md`; the row-format differs from FILL-ARCHITECTURE). If no recipe exists,
derive one from d16/d18 continuity + the audit's Grade-4/5 mapping, and flag it for owner review
**before** authoring. Wire the week into `packGenerator` BEFORE verifying — `bb-verify-packs`
imports packGenerator, so an unwired week cannot be validated (lesson L-class).

Accept: all nine gates green (including entropy `--level A` no longer RED on those slots), through
the full battery per the HANDOFF's invocations.

## 6. Task 3 — lane specs (WS-3 / WS-4; documents only, no build)

**3a. `build/FLUENCY-LANE-SPEC.md`** — per-band fact-family ladder (K subitize → G1 ±within-20 →
G2 from-memory + within-100 → G3 ×/÷ single-digit → G4+ multi-digit + fraction benchmarks);
automaticity criterion (recommend ≥95% at ≤3 s/item, 3 consecutive days → family retires into the
retrieval pool); interleaving rules; **DD11 law: timed, never scored, never blocking**; parent
report shows trend, never a score. Size: 15–20 items, 2–3 min/day. ~A dozen generators cover K–8 —
enumerate them.
**3b. `build/RETENTION-ENGINE-SPEC.md`** — DD8 selection algorithm: pool = the child's mastered
weeks; expanding intervals ~1 wk / 1 mo / 3 mo; 20–30% of daily items; draws item *generators*
(never verbatim repeats); cold-start fallback = the existing static authored warm-ups; failure
feedback (a missed warm-up re-schedules that concept sooner and can trigger the approved
"engine-chosen spaced re-check"). Include the simulated-learner acceptance test: a 6-month
synthetic log must show every mastered concept resurfacing on schedule.

Accept: each spec self-contained enough to implement without re-reading this phase's context, and
each names its acceptance test.

## 7. Traps (each earned from a recorded failure — L48–L53 class)

- A green board is only as wide as the gate list you run — run **all nine**, from the HANDOFF list.
- Audit a gate's ENABLEMENT list as hard as its logic (stale `V2_WEEKS`, dead permits).
- Measure per PACK, not per draw; ask whether guessing rewards the misconception the week teaches
  against.
- When a constant claims a mirror exists (constants ↔ RPC), the mirror is part of the change.
- When a regression harness reports a failure, check the harness first.
- Absence is a finding — record DRY results in the audit rather than silently skipping.

## 8. Report back

End-of-phase handoff at `meta/HANDOFF-<date>-PHASE1.md`: what closed, what's blocked and on what,
audit headline numbers (TAUGHT/TOUCHED/ORPHAN counts per grade), gate board state, and the exact
proposed commit package (contents + pathspec) for owner approval. Do not commit without it.
