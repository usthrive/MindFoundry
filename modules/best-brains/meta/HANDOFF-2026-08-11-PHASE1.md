# Handoff — system-fix Phase 1 (sessions 1–2; this file is the live state)

**Read `DEV-PROMPT-SYSTEM-FIX-PHASE-1.md` first; this file says where inside it we are.**
Branch `best-brains-content-engine`. **PHASE 1 IS COMPLETE.** Committed: Task 1 (`68f7969`),
Tasks 3a/3b + the d17 proposal (`d349569`). Task 2b was ruled option A and built the same day;
its package is proposed in §4 and is the only thing outstanding.

---

## 1. Phase status at a glance

| Task | State |
|---|---|
| **Task 1 — WS-2 K–8 seam audit** | **DONE + COMMITTED** (`68f7969`). `build/SEAM-AUDIT-K8.md`: 229/229 standards classified item-level at 5 seeds, six Grade-2 candidates settled first, splits determined, M0–M9 tables complete (252 rows). Summary §2. |
| Task 2a — Level A's 11 entropy-RED slots | CLOSED (prior session); re-verified twice this session: `--level A` PASS 0/0. |
| **Task 2b — d17** | **RULED (option A) AND DONE.** `weeks/d17.ts` authored + wired; the D17 cell now serves the seeded week; MFM_D17 untouched, still pinned as the calibration artifact; the enablement guardrail shipped with it. Detail §3; outcome record `build/D17-RECIPE-PROPOSAL.md` §6. |
| **Task 3a — `build/FLUENCY-LANE-SPEC.md`** | **DONE.** Ladder F1–F12, criterion, interleaving, DD11 law, parent trend, data model, 6-part acceptance test. |
| **Task 3b — `build/RETENTION-ENGINE-SPEC.md`** | **DONE.** Pool, expanding-interval schedule, daily selection, cold start, failure feedback/re-check, 7-part acceptance test incl. the 6-month simulated learner. |

**All four Phase-1 tasks are closed.** The only outstanding item is owner approval of commit
package #3 (§4).

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

## 3. Task 2b — ruled option A, built and shipped (record: `build/D17-RECIPE-PROPOSAL.md` §6)

**Why a ruling was needed.** The recipe hunt was DRY (`CONTENT-GENERATION-PLAN.md`'s D17 row is
concept + archetype + status only; Level D is absent from FILL-ARCHITECTURE; the fan-out kits carry
no D rows; `weeks/d17.ts` had never existed on any branch), and the hunt exposed an enablement gap:
`generatePack` resolves the **fixture first** (`packGenerator.ts:340`), so a generated week for a
fixture-backed cell is unreachable. Measured on B14 — `b14.ts` is 1,177 lines, registered in
`WEEK_BUILDERS` and `V2_WEEKS`, yet absent from `GENERATED_WEEKS`, served to nobody and exercised
by no gate. "Wire before verifying" is necessary but **not sufficient** for such cells.

**What shipped under option A:**

- **`weeks/d17.ts`** — v2 blueprint, anchor *the naming wall*; multi-step chains, generated
  tops-and-bottoms error analysis (1/3 + 1/4 → 2/7, both values recomputed), two discriminations
  (needs-renaming vs already-same-size; any-common-denominator vs only-the-least), estimate-first
  metacognition, Day-5 two-denominators write-up. MFM_D17's *design* preserved, none of its prose.
- **Fixture roles split** in `fixtures/index.ts`: `ALL_FIXTURES` (calibration, never shrinks) vs
  `SERVED_FIXTURES` (answers `getFixture`), plus `getPinnedFixture`. **MFM_D17 is byte-unchanged**
  and still exported; only its serving role ended.
- **The guardrail**: `SHADOWED_WEEKS` + `buildShadowedPack` (packGenerator) and a new
  `bb-verify-packs` section running the full template battery over fixture-shadowed builders.
  **b14 passes it** — it was never broken, only unverified. `bb-wire-weeks.ts`'s `FIXTURE_BACKED`
  set is now *derived* from the loader's served list instead of hand-listed, so unpinning a cell
  promotes it automatically.
- Ledger corrected: `CONTENT-GENERATION-PLAN.md` D17 row + "Level D result" line.

**Measured:** `bb-verify-packs` **22,059 assertions / 0 failures** (was 21,653; +406 = the
shadowed-builder battery plus D17 moving to template checks), and **Level D coverage now reads
24/24 servable — 24 template, 0 fixture.** A read of the served pack found one content bug the
gates cannot catch (the allotment item could total more than one whole plot — arithmetically true,
pedagogically nonsense); the draw is now constrained by construction and a 200-seed sweep confirms
**1,400 part-whole items, 0 out of range**.

## 4. Gate board + PROPOSED commit package #3

**Full nine-gate battery after d17 landed — ALL GREEN:** verify-packs **22,059/0** · readability
PASS · entropy `--level A` 0/0 (full corpus: 0 guessable mastery slots, 31 pre-existing
non-blocking teaching-slot tells, B–E) · spoken-answer PASS + selftest 13/13 · cross-week
`--strict` PASS · family 9,660/60 seeds PASS · qg13 54 PASS · figure-render 41×3 PASS ·
`tsc --noEmit` exit 0. Extras also green: **QG-11 and QG-12 regression suites**.

**Package #3 — the d17 build:**

```
git add frontend/src/modules/best-brains/generator/templates/weeks/d17.ts \
        frontend/src/modules/best-brains/generator/fixtures/index.ts \
        frontend/src/modules/best-brains/generator/packGenerator.ts \
        frontend/src/modules/best-brains/generator/index.ts \
        frontend/scripts/bb-verify-packs.ts \
        frontend/scripts/bb-wire-weeks.ts \
        modules/best-brains/build/CONTENT-GENERATION-PLAN.md \
        modules/best-brains/build/D17-RECIPE-PROPOSAL.md \
        modules/best-brains/meta/HANDOFF-2026-08-11-PHASE1.md
git commit -m "content(best-brains): d17 authored + serves its cell; fixture-shadowed builders now validated (Phase 1 Task 2b, option A)"
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
  branch now carries 16 commits (17 with package #3).
- WSL budget: `bb-agent-budget.ts` printed **1** this session (≈810 MB free, load ~3.8). Both
  sessions used **0 sub-agents** — batched `tsx` scripts beat agents for read-heavy work at this
  budget, and the whole 85-week × 5-seed dump cost one script run.
- Scripts import `packGenerator` from `frontend/` — run `tsx` from `frontend/` or use absolute
  paths. `cd frontend` may fail because the shell is already there; check `pwd`.

## 6. What the next session should do, in order

1. **Land package #3** (§4) if the owner has not already.
2. **A Fable-5 reader evaluation of d17** — the house rule after any authored week (it is what
   caught A20's pools and D17's own threshold arithmetic historically). Nothing in the gate battery
   reads a week the way a child does; the one content bug found this session was found by reading,
   not by a gate.
3. **Consider unpinning B14 too.** Its shadowed builder is now visible and passing, so promoting it
   is a one-line change to `SERVED_FIXTURES` + a re-wire + the battery. Worth a deliberate ruling
   rather than drift: A15 and B14 are still the only static cells, and B14 is in a level a real
   child is using.
4. **Phase 2 (from the program plan), unblocked by the audit:** WS-6 item 2 — the M3/M2 seam-fill
   weeks. Highest-leverage single week in the ladder is **M3 wk9 (2.G.A.2)**; the ruler and
   number-line figure primitives unblock ~7 stranded standards at once (SEAM-AUDIT §5 F3/F4) and
   should probably precede the measurement weeks that need them.
3. **Still waiting on you elsewhere:** R1 (identity) and R2 (ladder adoption) — the audit and both
   specs were written ruling-independent, so nothing here blocks on them, but WS-6's authoring
   targets do.
