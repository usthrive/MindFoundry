# Handoff — system-fix Phase 1 (sessions 1–2; this file is the live state)

**Read `DEV-PROMPT-SYSTEM-FIX-PHASE-1.md` first; this file says where inside it we are.**
Branch `best-brains-content-engine`. Task 1 is committed (`68f7969`). Tasks 3a/3b and the d17
recipe proposal are written and await an owner-approved commit (§4).

---

## 1. Phase status at a glance

| Task | State |
|---|---|
| **Task 1 — WS-2 K–8 seam audit** | **DONE + COMMITTED** (`68f7969`). `build/SEAM-AUDIT-K8.md`: 229/229 standards classified item-level at 5 seeds, six Grade-2 candidates settled first, splits determined, M0–M9 tables complete (252 rows). Summary §2. |
| Task 2a — Level A's 11 entropy-RED slots | CLOSED (prior session); re-verified twice this session: `--level A` PASS 0/0. |
| **Task 2b — d17** | **BLOCKED ON AN OWNER RULING, by design.** No recipe exists anywhere; the hunt surfaced an enablement finding that changes what "author d17" means. Derived recipe + the three options + a recommendation: **`build/D17-RECIPE-PROPOSAL.md`**. See §3 — this is the one thing that needs you. |
| **Task 3a — `build/FLUENCY-LANE-SPEC.md`** | **DONE.** Ladder F1–F12, criterion, interleaving, DD11 law, parent trend, data model, 6-part acceptance test. |
| **Task 3b — `build/RETENTION-ENGINE-SPEC.md`** | **DONE.** Pool, expanding-interval schedule, daily selection, cold start, failure feedback/re-check, 7-part acceptance test incl. the 6-month simulated learner. |

**Phase 1 is complete except Task 2b's authoring**, which is deliberately gated on §3.

## 2. Task 1 — the audit, in brief (full detail in the file)

- **Six Grade-2 candidates:** 2.MD.A.4/B.5 (+A.2) **TAUGHT(B21)** — orphan claims REFUTED (B21
  teaches measurement through generic arithmetic templates wearing measurement frames, at all 5
  seeds incl. certifying slots). 2.MD.A.3 and 2.MD.B.6 **TOUCHED-ONLY**. 2.G.A.1 taught-but-
  misplaced in A7. **2.G.A.2 the one genuine ORPHAN** → M3 wk9 NEW, seeded ahead of C20's area.
- **Counts:** 229 standards → **93 TAUGHT · 47 TOUCHED-ONLY · 89 ORPHAN**, zero unexplained.
- **Splits:** A11|A12 · B12|B13 ✓ · C4|C5 ✓ · **D12|D13** (was unknown) · **E13|E14 + 6
  cross-moves** (was unknown; E does not split cleanly). **B22 MOVEs down to M2** (as built it is
  exactly 1.G.A.3 — thirds are never served).
- **Two findings that generalise:** C16's recipe claims a number-line anchor while the served week
  has **zero** number-line items at any seed (3.NF.A.2 orphaned by the surface — the recipe-table
  trap in the other direction from B21); and the measurement-tool register is **corpus-DRY** (no
  ruler, inch, protractor, conversion, a.m./p.m., `$`, symmetry anywhere in 85 cells × 5 seeds),
  stranding ~7 standards across G2–G5 that are mostly one figure primitive away.
- **Method that must survive:** classify from the SERVED PROMPT — never the templateId, never the
  recipe row. Evidence base regenerable via `generatePack` over `AVAILABLE_WEEKS` at 5 seeds.

## 3. Task 2b — the ruling that is wanted (read `build/D17-RECIPE-PROPOSAL.md`)

**Recipe hunt: DRY.** `CONTENT-GENERATION-PLAN.md` §3's D17 row is concept + archetype + status
only (no anchor, no misconception, no Day-5 — not authorable); Level D is **absent from
FILL-ARCHITECTURE entirely**; the fan-out kits carry no D rows; `git log --all -- "*d17*"` shows
`weeks/d17.ts` has never existed on any branch. The cell has been fixture-served since increment 2.

**The finding.** `generatePack` resolves **fixture first** (`packGenerator.ts:340`), so a generated
d17 can never be reached while MFM-D17 is pinned. Measured on B14, the precedent the prompt's
"mirror" language comes from: `b14.ts` is 1,177 lines, registered in `WEEK_BUILDERS`, listed in
`V2_WEEKS` — and **not in `GENERATED_WEEKS`, served to nobody, and exercised by no gate**
(verify-packs and cross-week enumerate `AVAILABLE_WEEKS` → the fixture; entropy enumerates
`GENERATED_WEEKS` → absent; the only script touching `WEEK_BUILDERS` is the wiring generator).
So "wire before verifying" is necessary but **not sufficient** for a fixture-backed cell.

**Options (full table in the proposal):** **A** author + let the seeded week serve the cell (fixture
stays pinned as the regression/calibration artifact) · **B** b14-style mirror, fixture keeps serving
· **C** author nothing, correct the ledger. **Recommended: A** — it is the only option that changes
what a child receives, and the audit gives it a second reason (5.NF.A.1 is TAUGHT by the fixture but
5.NF.A.2 is TOUCHED-ONLY precisely because the static pack has no word-problem/estimate strand).
If A is ruled, one guardrail rides along: teach `bb-verify-packs` to enumerate
**WEEK_BUILDERS ∪ AVAILABLE_WEEKS** so a fixture-shadowed builder is still validated.

## 4. Gate board + PROPOSED commit package #2

**Full nine-gate battery re-run after the specs were written — ALL GREEN** (identical to the
Task-1 run; these three deliverables are documents, nothing executable changed):
verify-packs 21,653/0 · readability PASS · entropy `--level A` 0/0 (full corpus: 0 guessable
mastery slots, 31 pre-existing non-blocking teaching-slot tells, B–E) · spoken-answer PASS +
selftest 13/13 · cross-week `--strict` PASS · family 9,660/60 seeds PASS · qg13 54 PASS ·
figure-render 41×3 PASS · `tsc --noEmit` exit 0.

**Package #2 — three new files, no source touched:**

```
git add modules/best-brains/build/FLUENCY-LANE-SPEC.md \
        modules/best-brains/build/RETENTION-ENGINE-SPEC.md \
        modules/best-brains/build/D17-RECIPE-PROPOSAL.md \
        modules/best-brains/meta/HANDOFF-2026-08-11-PHASE1.md
git commit -m "docs(best-brains): WS-3/WS-4 lane specs + d17 recipe proposal (Phase 1 Tasks 3a/3b/2b)"
```

**Explicitly EXCLUDED** (unrelated uncommitted work; do not sweep):
`frontend/src/components/ui/ScratchPad.tsx` · `.../components/BBScratchPad.tsx` ·
`.../screens/PracticePage.tsx` · `.../generator/templates/weeks/a11.ts` (provenance unverified —
note `882bf20` already committed an a11 expansion, so the working-tree change sits **on top** of
that and is a separate edit) · `.../services/bbNotebookStore.ts` · `.../bbNotebookExport.ts` ·
`PEDAGOGICAL_QA_REPORT.md` · `PLAN.md` · `QA_REPORT_FINAL.md` · `qa-screenshots/` ·
`qa_screenshots/` · `qa_test_script.md` · `video/` · `frontend/dev-dist/` · the 12 long-standing
pre-existing untracked files.

## 5. Standing cautions

- Owner rulings already taken on the excluded tree work: notebook download belongs in the parent
  area, no child-facing notebook button.
- `git merge` is classifier-blocked here — use `gh pr merge --squash`. Nothing is merged; the
  branch now carries 15 commits.
- WSL budget: `bb-agent-budget.ts` printed **1** this session (≈810 MB free, load ~3.8). Both
  sessions used **0 sub-agents** — batched `tsx` scripts beat agents for read-heavy work at this
  budget, and the whole 85-week × 5-seed dump cost one script run.
- Scripts import `packGenerator` from `frontend/` — run `tsx` from `frontend/` or use absolute
  paths. `cd frontend` may fail because the shell is already there; check `pwd`.

## 6. What the next session should do, in order

1. **Get the §3 ruling**, then execute Task 2b accordingly. If **A**: author `d17.ts` from the
   proposal's §4 recipe (blueprint-only — every generator it needs exists), move D17 out of the
   fixture-served set, wire via `bb-wire-weeks.ts`, add the verify-packs enumeration guardrail,
   then the full nine gates. If **B** or **C**: the proposal says exactly what each entails.
2. **Phase 2 (from the program plan), unblocked by the audit:** WS-6 item 2 — the M3/M2 seam-fill
   weeks. Highest-leverage single week in the ladder is **M3 wk9 (2.G.A.2)**; the ruler and
   number-line figure primitives unblock ~7 stranded standards at once (SEAM-AUDIT §5 F3/F4) and
   should probably precede the measurement weeks that need them.
3. **Still waiting on you elsewhere:** R1 (identity) and R2 (ladder adoption) — the audit and both
   specs were written ruling-independent, so nothing here blocks on them, but WS-6's authoring
   targets do.
