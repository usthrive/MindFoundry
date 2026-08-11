# Handoff — system-fix Phase 1, session 2 (supersedes session 1's text in place)

**Read `DEV-PROMPT-SYSTEM-FIX-PHASE-1.md` first; this file says where inside it we are.**
Branch `best-brains-content-engine`. Nothing committed by Phase-1 work yet — a commit package is
now PROPOSED (§4) and awaits owner approval.

---

## 1. Phase status at a glance

| Task | State |
|---|---|
| **Task 1 — WS-2 K–8 seam audit** | **DONE.** `build/SEAM-AUDIT-K8.md` written: 229/229 standards classified item-level at 5 seeds, six Grade-2 candidates settled first, splits determined, M0–M9 tables complete (252 rows, every NEW row carries the misconception + Day-5). Details §2. |
| Task 2a — Level A's 11 entropy-RED slots | ALREADY CLOSED (prior session). Re-verified this session: `--level A` PASS 0/0. |
| **Task 2b — d17** | **STILL OWED.** Not started this session. `weeks/d17.ts` absent; recipe hunt per prompt §5 (CONTENT-GENERATION-PLAN §3 row D17 = "± fractions (unlike), archetype A7, fixture MFM-D17" — that row is concept-level only, NOT an authoring recipe; expect to derive from d16/d18 + audit M6 wk7 row and **flag for owner review before authoring**). Wire into packGenerator BEFORE verifying. |
| Task 3a — `build/FLUENCY-LANE-SPEC.md` | NOT STARTED |
| Task 3b — `build/RETENTION-ENGINE-SPEC.md` | NOT STARTED |

## 2. Task 1 — what the audit found (headlines for the next reader)

**File: `build/SEAM-AUDIT-K8.md`** (§-refs below are inside it).

- **The six Grade-2 candidates (§1): 3 REFUTED, 2 downgraded to TOUCHED-ONLY, 1 confirmed.**
  2.MD.A.4/B.5 (+A.2) TAUGHT by B21 through measurement-framed generic arithmetic — confirmed at
  all 5 seeds incl. certifying slots. 2.MD.A.3 TOUCHED (estimate-first exists, cube units only).
  2.MD.B.6 TOUCHED (B4 = number PATH within 20, not a number-line diagram). 2.G.A.1 TOUCHED
  (identification core taught-but-misplaced in A7; draw/quadrilateral/cube acts nowhere).
  **2.G.A.2 = the one genuine ORPHAN** → early M3 NEW week (M3 wk9), ahead of the area chain.
- **Counts (§4):** K–8 = 229 standards → **93 TAUGHT · 47 TOUCHED-ONLY · 89 ORPHAN** (zero
  unexplained; every orphan names its M-row). Per grade: K 8/8/6 · G1 14/5/2 · G2 12/12/2 ·
  G3 21/2/2 · G4 18/6/4 · G5 16/8/2 · G6 4/5/20 · G7 0/1/23 · G8 0/0/28.
- **Splits (§2):** A11|A12 · B12|B13 ✓ · C4|C5 ✓ (C2-rounding impurity noted) · **D12|D13**
  (decimal notation vs thousandths — was unknown) · **E13|E14 + 6 cross-moves** (E does NOT split
  cleanly: E8/E9→M8, E18/E20/E21/E22→M7 — was unknown). One true down-MOVE: **B22→M2** (its
  halves/quarters = exactly 1.G.A.3; thirds never served → 2.G.A.3 gap is M3's).
- **New findings register (§5):** F2 = **C16's recipe claims a number-line anchor; the served week
  has ZERO number-line items at any seed** (3.NF.A.2 orphan-by-surface — the recipe-table trap in
  the other direction). F3/F4 = the measurement-tool and number-line-as-object registers are
  corpus-DRY (no ruler/inch/protractor/conversion/am-pm/$ anywhere in 85 cells × 5 seeds) — that
  one family strands ~7 standards across G2–G5 and is mostly one figure-primitive away.
- **M0–M9 (§6):** 252 rows = 80 EXISTS (3 pinned fixtures) · 5 MOVE · 35 NEW-with-recipe ·
  132 NEW. M5/M6 adopt the C-format header (stated why — D has no FILL header). M9 authored from
  zero, full 26 rows.
- **Method note that must survive:** classify from the SERVED PROMPT (B21 proves recipe-blind
  reading fails one way; C16 proves recipe-trusting fails the other). Evidence base = all 85
  servable cells × seeds 11/33/55/77/99 dumped item-level (~16k items); regenerate with the §1
  script of the session-1 handoff text (preserved in git history of this file) or
  `scratchpad/dump-weeks.ts` if it survives.

## 3. Gate board — full nine-gate battery run this session, ALL GREEN

Per `HANDOFF-2026-08-10-LEVEL-A.md` §6.2 (the authoritative list):

| # | Gate | Result |
|---|---|---|
| 1 | `bb-verify-packs` | 21,653 assertions, 0 failures, ALL GREEN (D 24/24 servable) |
| 2 | `bb-readability-test` | PASS — 0 weeks over 2% tolerance |
| 3 | `bb-answer-entropy-test` | `--level A`: PASS 0 guessable / 0 tells. Full corpus: PASS 0 guessable mastery slots; **31 non-blocking teaching-slot tells corpus-wide (pre-existing, B–E, not Task-2a's)** |
| 4 | `bb-spoken-answer-test` (+`--selftest`) | PASS; selftest 13/13 |
| 5 | `bb-cross-week-test --strict` | PASS — no cross-week ladder reuse |
| 6 | `bb-family-test` | 9,660 instantiations / 60 seeds — ALL PASS |
| 7 | `bb-qg13-test` | 54 passed, 0 violations |
| 8 | `bb-figure-render-test` | 41 figures × 3 sizes — ALL PASS |
| 9 | `tsc --noEmit` | exit 0 |

## 4. PROPOSED commit package (explain-before-commit; awaiting owner approval — DO NOT commit without it)

**Contents:** the Phase-1 Task-1 deliverable + this handoff. Both are new files; no source, no
generator, no week file was modified by Task 1 (it was a read-and-classify pass; its scripts lived
in the session scratchpad).

**Pathspec (exact):**

```
git add modules/best-brains/build/SEAM-AUDIT-K8.md \
        modules/best-brains/meta/HANDOFF-2026-08-11-PHASE1.md
git commit -m "best-brains: WS-2 seam audit — K-8 CCSS matrix, M0-M9 tables (Phase 1 Task 1)"
```

**Explicitly EXCLUDED** (unrelated uncommitted work in the tree; do not sweep — §5):
`frontend/src/components/ui/ScratchPad.tsx` · `frontend/src/modules/best-brains/components/BBScratchPad.tsx` ·
`frontend/src/modules/best-brains/screens/PracticePage.tsx` ·
`frontend/src/modules/best-brains/generator/templates/weeks/a11.ts` (provenance still unverified) ·
`frontend/src/modules/best-brains/services/bbNotebookStore.ts` · `…/bbNotebookExport.ts` ·
`PEDAGOGICAL_QA_REPORT.md` · `PLAN.md` · `QA_REPORT_FINAL.md` · `qa-screenshots/` · `qa_screenshots/` ·
`qa_test_script.md` · `video/` · `frontend/dev-dist/` · the 12 long-standing pre-existing untracked files.

## 5. Standing cautions (carried from session 1, still true)

- Unrelated uncommitted work sits in the tree (list above). Owner rulings already taken: notebook
  download belongs in the parent area, no child-facing notebook button; `a11.ts`'s modification was
  not made by Phase-1 work — check provenance before anyone commits it.
- `git merge` is classifier-blocked in this repo — use `gh pr merge --squash`.
- WSL budget: `bb-agent-budget.ts` printed **1 safe agent** this session (825→810 MB free, load
  ~3.8). Check before any fan-out; owner allows 1–2 when the box permits. This session used 0
  agents — batch tsx scripts beat agents for read-heavy work at this budget.
- `cd frontend` may fail because the shell is already there — check `pwd`.
- Scripts import `packGenerator` from `frontend/` — run tsx from `frontend/` or use absolute paths.

## 6. What the next session should do, in order

1. **Present §4's commit package to the owner** (if not already ruled on) — the audit is the
   dependency of everything downstream and should land.
2. **Task 2b (d17):** derive the recipe (see §1 row); **flag for owner review BEFORE authoring**;
   wire into `packGenerator` (bb-wire-weeks) BEFORE `bb-verify-packs`; then the full nine gates.
3. **Task 3a/3b specs** (`FLUENCY-LANE-SPEC.md`, `RETENTION-ENGINE-SPEC.md`) — documents only, no
   build; each names its acceptance test; days-6–7 sections are opt-in extra credit per R6 (D37).
4. On phase close: re-run all nine gates, update this handoff, propose the phase commit package.

Audit-born candidates for WS-6 sequencing (feed to the plan, not this phase): the ruler/number-line
figure primitives unblock 7 stranded standards (SEAM-AUDIT §5 F3/F4); M3 wk9 (2.G.A.2) is the
highest-leverage single NEW week in the ladder.
