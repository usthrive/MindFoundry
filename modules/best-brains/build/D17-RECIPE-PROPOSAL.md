# d17 — recipe hunt result, an enablement finding, and a derived recipe

> **RULED 2026-08-11: option A. BUILT AND SHIPPED the same day.** `weeks/d17.ts` is authored to the
> §4 recipe and now serves the (D,17) cell; MFM_D17 is untouched on disk and stays in the
> calibration set. Delivered with the §3 guardrail. Outcome record at the foot of this file (§6);
> everything above it is the pre-ruling analysis, left unedited.

**Original status: FLAGGED FOR OWNER REVIEW — nothing authored yet.** 2026-08-11, system-fix Phase 1 Task 2b.
The phase prompt (§5.2b) requires: locate the recipe; if none exists, derive one from d16/d18
continuity + the audit's Grade-4/5 mapping and **flag it for owner review before authoring**. No
recipe exists (§1), and the hunt surfaced something that changes what "author d17" should mean
(§2), so the ruling in §3 is wanted before any line is written.

---

## 1. Recipe hunt — DRY, and the cell was never authored

| Source checked | Result |
|---|---|
| `CONTENT-GENERATION-PLAN.md` §3 Level-D table | row 17 = `± fractions (unlike) \| A7 \| **G (fixture MFM-D17)**` — concept + archetype + status only. **Not an authoring recipe**: no anchor, no named misconception, no Day-5 signature. A row in this format cannot be authored from (the same reason the prompt warns its row-format differs from FILL-ARCHITECTURE). |
| `FILL-ARCHITECTURE.md` §3–§6 | **Level D is not in this file at all** (§3 A, §4 B, §5 C, §6 E). No D recipe table exists anywhere. |
| `PHASE-B-BUILD-PLAN.md` | D is the *proof* level (Phase B0), built before the recipe-table format existed; its per-week rows were never written. |
| `FANOUT-AUTHORING-KIT.md`, `FANOUT-KIT-LEVELS-ABCE.md` | no D rows (the kits cover the fill levels A/B/C/E). |
| `git log --all -- "*d17*"` | one hit: `b248cb4` "increment 2 … seed content" — that is the **fixture** landing. `weeks/d17.ts` has never existed on any branch. |

**So:** D17 has been fixture-served since increment 2, and no week-builder was ever written for it.

## 2. The finding that changes the task — the b14 precedent ships dead code

`generatePack` resolves **fixture first**:

```
frontend/src/modules/best-brains/generator/packGenerator.ts:340
  const fixture = getFixture(level, week);
  if (fixture) return fixture;              // ← a generated d17 can never be reached
  const builder = WEEK_BUILDERS.get(...)
```

B14 is the precedent the prompt's "mirror" language comes from, and measured on this tree:

| Check | B14 |
|---|---|
| `weeks/b14.ts` authored | **yes** — 1,177 lines, the most heavily documented blueprint in the corpus |
| registered in `WEEK_BUILDERS` | yes (`packGenerator.ts:147`) |
| listed in `V2_WEEKS` | yes |
| in `GENERATED_WEEKS` | **no** (verified: `B14 in GENERATED_WEEKS: false`) |
| served to a child | **no** — the fixture wins at the resolution above |
| exercised by any gate | **no** — `bb-verify-packs` and `bb-cross-week-test` enumerate `AVAILABLE_WEEKS` (B14 resolves to the fixture); `bb-answer-entropy-test` enumerates `GENERATED_WEEKS` (B14 absent); the only script that touches `WEEK_BUILDERS` at all is `bb-wire-weeks.ts`, the wiring generator |

`buildB14` is therefore **authored, wired, validated by nothing and read by nobody**. This is the
L49/L50 class exactly ("audit a gate's ENABLEMENT list as hard as its logic") — and it means the
prompt's instruction "wire the week into packGenerator BEFORE verifying" cannot do its job for a
fixture-backed cell: wiring is necessary but **not sufficient**, because the fixture shadows the
builder before any gate sees it.

Authoring d17 as a b14-style mirror would add a second such artifact: ~350–1,200 lines that no gate
checks and no child ever meets.

## 3. The ruling wanted (three options)

| | Option | What happens | Cost | Risk |
|---|---|---|---|---|
| **A** | **Author `d17.ts` + take D17 out of the fixture-served set** — the fixture stays on disk as the pinned *regression* artifact (still the calibration standard for the style gate and QG-11's v1 set), but the D17 **cell** is served by the seeded week, joining `GENERATED_WEEKS`. | Level D becomes genuinely 24/24 generated at v2/1.2.0; d17 enters all nine gates; the cell gains seed variety (today every child in the world sees the identical D17 pack) and the v2 pedagogy contract (situation frames, code-generated EA, `verifyFor` truth). | one authored week (~45–50 min) + a wiring change + a full gate battery | the fixture is a **pinned regression set** used to calibrate thresholds ("ACCEPT a D17-equivalent, not exceed it" — CONTENT-GENERATOR-FIX-SPEC §6.4) and QG-11 runs in v1 mode for it. Unpinning the *serving* must not unpin the *regression* use. Verified as separable: the style/QG calibration reads the fixture module directly, not the served cell. |
| **B** | **Author `d17.ts` as a b14-style mirror, leave the fixture serving.** | Matches the existing precedent exactly; the "23 of 24 authored" ledger closes. | same authoring cost | ships a second unvalidated, unserved artifact (§2). Closes a ledger row without changing anything a child touches. |
| **C** | **Author nothing; correct the ledger** — record D17 as *served by design* and retire "d17 missing" from the owed list. | zero. | zero | the D17 cell stays static v1 forever: one form for every child, no seed variety, no `verifyFor` recomputation of its answers, and the 5.NF.A.2 gap the seam audit found (§5 below) stays open. |

**Recommendation: A.** It is the only option that changes what a child receives, and the audit gives
it a second reason: `SEAM-AUDIT-K8.md` §3 records **5.NF.A.1 TAUGHT(D17 fixture)** but
**5.NF.A.2 TOUCHED-ONLY** — the fixture's unlike-denominator work is computation-and-reasoning but
carries no word-problem/benchmark-estimate strand, which is precisely what a v2 week's `situation`
+ `withEstimateFirst` machinery adds. Option A closes a real standards gap; B and C do not.

**If A is ruled, one guardrail is part of the change** (the "when a constant says it is mirrored,
the mirror is part of the change" rule): `bb-verify-packs` must be taught to enumerate
**WEEK_BUILDERS ∪ AVAILABLE_WEEKS**, so that any future builder shadowed by a fixture is still
validated — otherwise b14 stays invisible and the next d17 repeats this.

## 4. The derived recipe (authorable the moment a ruling lands)

Derived from d16/d18 continuity, the pinned fixture's design (which is good and should be
preserved as *design*, not copied as prose — the b14 doctrine), and `SEAM-AUDIT-K8.md` §6 M6 wk7.
Header: the C-format adopted for M5/M6 in the audit (Level D has no FILL header).

| Wk | Concept | Anchor | Multi-step | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| D17 | ± fractions, unlike denominators [5.NF.A.1, opening 5.NF.A.2] | **the naming wall** — two fractions cannot be counted together until they are re-named into one size of piece; the common denominator is any size BOTH divide into, and the least is a convenience, not a law | rename → combine → **estimate-check against 1/2 and 1** (op-family ≥2; the fixture's estimate-first habit becomes a generated chain: two-addend rename, then a three-addend or a mixed-number regroup) | **tops-and-bottoms**: 1/3 + 1/4 = 2/7 (`d_verify_frac_v1`, wrong-op-add) — the distractor `(a+c)/(b+d)` on every unlike-denominator MC item, per the fixture's own mistake-bank instruction | **needs-renaming vs already-same-size** (5/8 − 1/8 sits in the middle of the week on purpose), and **any common denominator vs only-the-least** (the fixture's "6 and 8 → 24 or 48, both legal" item is the model) | one sum, two common denominators — show both routes reach the same answer, then say which you'd choose and why (written; the fixture's picture-proof page is the retained alternative for the R-lite part) |

**Operand-space design** (the d18/d16 pattern — depth from *where the difficulty sits*, never from
bigger numbers):

- denominators drawn from pairs where one divides the other (2/8, 3/6, 5/10) **and** pairs that need
  a genuine product (3/4, 4/6, 6/8) — the discrimination above needs both families in every pack;
- at least one item per pack where the sum crosses 1 (answer as a mixed number) and one where a
  subtraction needs a whole regrouped (the fixture's 4 1/4 − 2 3/4 case);
- warm-ups: `fracEquivFill` (D9) and `fracAddSubLike` (D10) — the two prerequisite skills, which is
  also what the audit's M6 sequence expects to be retrievable by then;
- every answer via `compute.ts` Frac ops with `validation: 'equivalent-fraction'`, so any equivalent
  form passes (the D10/D18 convention).

**Existing generators cover it** — `d_frac_like_v1`, `d_frac_equiv_v1`, `d_verify_frac_v1`,
`fracAddSubUnlike` (registered; `frac_addsub_unlike_v1` already appears in the fixture's own
templateId) — so this is a blueprint-only build, no new library work.

## 5. What is NOT owed here

The seam audit's M6 wk8 ("Estimate before you add", 5.NF.A.2 word problems) remains a **separate
NEW week** under the M-ladder. D17 opens that standard; it does not close it. Nothing in this
proposal presupposes R1/R2.

---

## 6. Outcome record (post-ruling, 2026-08-11)

**What shipped**

| Change | File |
|---|---|
| The week — v2 blueprint to the §4 recipe, anchor "naming wall" | `generator/templates/weeks/d17.ts` (new) |
| Fixture roles split: `ALL_FIXTURES` (calibration, never shrinks) vs `SERVED_FIXTURES` (answers `getFixture`). D17 left the served set; **MFM_D17 is byte-unchanged and still exported**, plus a new `getPinnedFixture` for calibration reads | `generator/fixtures/index.ts` |
| `SHADOWED_WEEKS` + `buildShadowedPack` — a cell with a builder that a fixture shadows is now enumerable and buildable, for gates only | `generator/packGenerator.ts` |
| **The §3 guardrail**: the full template battery (validator, determinism, no-authorMeta, templateId resolution, Form-A/B disjointness, catalog agreement, seed sensitivity) now runs over shadowed builders | `scripts/bb-verify-packs.ts` |
| `FIXTURE_BACKED` derived from the loader's served list instead of hand-listed, so unpinning a cell promotes it automatically | `scripts/bb-wire-weeks.ts` |
| d17 wired (import · `WEEK_BUILDERS` · `V2_WEEKS` · `GENERATED_WEEKS`) | `generator/packGenerator.ts` (generated regions) |

**Measured after**

- `bb-verify-packs`: **22,059 assertions, 0 failures** (was 21,653 — the +406 are the shadowed-builder
  battery now running on b14, plus D17 moving from fixture checks to template checks).
  **Level D coverage now reads 24/24 servable — 24 template, 0 fixture.**
- **b14's shadowed builder PASSES** the battery it had never been run through. It was never broken;
  it was unverified. That distinction is the whole point of the guardrail.
- Full nine gates green, plus QG-11 and QG-12 regression suites green.
- 200-seed content sweep: 1,400 part-whole items, **0 out of range** — added after a read of the
  served pack found the allotment item could total more than one whole plot (a generated-content
  bug the gates do not catch, because "1 1/3 of a plot is planted" is arithmetically true and
  pedagogically nonsense). The draw is now constrained by construction.

**What is deliberately unchanged**

- `MFM_D17` itself, its style-gate calibration role, and QG-11's v1 fixture set.
- The A15 and B14 cells: still fixture-served. `weeks/b14.ts` remains shadowed — now visible and
  validated, so unpinning B14 later is a one-line change to `SERVED_FIXTURES` plus a re-wire.
- `SEAM-AUDIT-K8.md`'s classification of 5.NF.A.1 (still TAUGHT at this cell) and 5.NF.A.2 (still
  TOUCHED-ONLY — the M6 wk8 NEW week closes it; d17 only opens the standard, per §5).
