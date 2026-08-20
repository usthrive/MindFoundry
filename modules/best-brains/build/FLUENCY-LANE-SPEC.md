# FLUENCY-LANE-SPEC — the automaticity lane (WS-3 / R3)

**Written:** 2026-08-11, system-fix Phase 1 Task 3a. Spec only — no build in this phase.
Self-contained: an implementing agent needs this file, `types.ts`, `generator/sprintItems.ts`
and the nine-gate list, nothing else from Phase 1's context.

**What this fixes.** Defect D3: our weeks build understanding with ~5 heavy items/day, and CCSS
names standards that understanding alone cannot satisfy — `K.OA.A.5`, `1.OA.C.6`, **`2.OA.B.2`
("know from memory")**, **`3.OA.C.7`**, `4.NBT.B.4`, `5.NBT.B.5`. `SEAM-AUDIT-K8.md` classifies
every one of them TOUCHED-ONLY with the note "automaticity = lane", and this lane is what turns
those rows TAUGHT. It is **not** more concept weeks: the authoring budget stays on concepts
(plan §1b), and volume comes from generators.

---

## 1. Position in the day, and the law it obeys

Lane 2 of three (plan §1b): **15–20 items, 2–3 minutes, every practice day**, beside the authored
concept lane (5–6 heavy items) and the retrieval warm-up (3–5 items; `RETENTION-ENGINE-SPEC.md`).
Day total ≈ 25–30 items / **10–13 minutes**, inside the owner's 20–30 min hard ceiling with room
to spare. **Never grow the lane to fill the ceiling** — if a band's day exceeds ~15 min, the lane
shrinks first.

**DD11 law — timed, never scored, never blocking.** Non-negotiable and gate-enforced:

| Rule | Consequence in code |
|---|---|
| Timed | a countdown runs; `durationSeconds: 120` today, 180 permitted for the 20-item upper bands |
| **Never scored** | no percentage, no pass/fail, no verdict; results never enter mastery, streaks, gates, or parent-report *standing* |
| **Never blocking** | a sprint can be skipped, abandoned, or ignored forever with zero downstream effect |
| **Self-referenced only** | the only comparison shown to the child is their own previous run |
| **Mastered material only** | a family enters the lane only after its concept week is passed (≥2 weeks prior, DD11) — never the current week's new concept |
| **Band A: no lane at all** | `fluencySprint: null` is a hard FAIL condition at band A (FILL §1). M0/M1 get finger-games and oral counting inside the concept lane instead; the lane begins at M2. |

Existing machinery to build on, not replace: `types.ts:256 FluencySprint` (already carries
`selfReferenced: true`, `graded: false`, `sourceWeek`, `generator: GeneratorSpec`) and
`generator/sprintItems.ts` (deterministic realizer, 6 templates registered). The lane is a
**scheduler + a generator family set + a trend view** on top of these.

## 2. The fact-family ladder

A **family** is the unit of automaticity: a small closed set of facts a child should retrieve, not
compute. Families are keyed to bands, not weeks — ~a dozen generators cover K–8.

| # | Family | Generator | Enters at | Retires into retrieval when | Items/sprint |
|---|---|---|---|---|---|
| F1 | Subitize & count-on within 10 | `sprint_subitize_v1` | M1 (oral, inside the concept lane — no timer at band A) | never timed at band A; carried by M2's F2 | — |
| F2 | ± within 10 | `sprint_add_sub_10_v1` | M2 wk1 | criterion met (§3) | 20 |
| F3 | ± within 20, bridging ten | `sprint_add_sub_20_v1` | M2 wk8 (after B5 make-ten) | criterion met | 20 |
| F4 | **± within 20 from memory** [2.OA.B.2] | `sprint_add_sub_20_v1` (`fromMemory: true` — no bridging scaffold in the prompt) | M3 wk1 | criterion met → this is the standard's evidence | 20 |
| F5 | ± within 100 (tens/ones, mental) | `sprint_add_sub_100_v1` | M3 wk4 | criterion met | 15 |
| F6 | Skip-count 2/5/10 | `sprint_skip_count_v1` | M3 wk5 | folds into F7 | 20 |
| F7 | **× ÷ within 100** [3.OA.C.7] | `sprint_mul_div_100_v1` (per-table subsets: ×2/5/10 → ×3/4 → ×6/7 → ×8/9 → mixed) | M4 wk3, one subset at a time, tracking C7–C12 | each subset retires independently; the FAMILY retires when mixed meets criterion | 20 |
| F8 | Multi-digit ± fluency [4.NBT.B.4] | `sprint_multidigit_addsub_v1` | M5 wk2 | criterion met | 15 |
| F9 | Multi-digit × / ÷ facts extended [5.NBT.B.5] | `sprint_multidigit_mul_v1` | M6 wk4 | criterion met | 15 |
| F10 | Fraction ↔ decimal ↔ percent benchmarks | `sprint_benchmark_forms_v1` | M5 wk16 (after D12) | criterion met | 15 |
| F11 | Signed-number facts | `sprint_signed_v1` | M8 wk1 | criterion met | 15 |
| F12 | Squares, roots & powers of ten | `sprint_powers_v1` | M9 wk6 | criterion met | 15 |

**Ladder rule:** a family may not enter the lane before the concept week that teaches it has been
passed. The scheduler reads the child's own mastered-week history (same source as the retention
engine), so a child who is ahead or behind gets the families they have actually earned.

## 3. The automaticity criterion (the promotion rule)

**≥95% correct at ≤3 s/item, sustained across 3 consecutive sprint days on that family.**

- **Accuracy first, then rate** (DD11's principle): a family below 95% never promotes on speed
  alone, and a fast-but-inaccurate run is a signal to return the family to the *concept* lane's
  retrieval pool, not to sprint it harder.
- **≤3 s/item** is measured as the median per-item latency of the run, not the mean — one
  interruption must not deny a child a retirement they have earned.
- **3 consecutive days** = three sprint runs on that family, not three calendar days.
- **On retirement** the family leaves the lane and joins the **retrieval pool**
  (`RETENTION-ENGINE-SPEC.md` §2), where it resurfaces at expanding intervals. Retirement is a
  promotion, and the child is told so in exactly those terms — never "you passed a test".
- **Re-entry:** if a retired family's retrieval items fall below 90% accuracy on two consecutive
  resurfacings, it re-enters the lane at the back of the queue. Silent, no verdict shown.

**Anti-anxiety guardrails** (this is where a fluency lane goes wrong, so they are spec, not
polish): no countdown *sound*; the timer is a quiet bar; the run ends by exhausting items, never by
cutting the child off mid-item; abandoning a run records nothing; and the child sees "you answered
14 — last time 12", never a percentage.

## 4. Interleaving rules (from DD8)

- **Never block.** A sprint draws from **2–3 active families**, shuffled — never 20 items of one
  table. Blocked practice inflates within-session performance and depresses retention (Rohrer);
  the criterion in §3 would be measuring the wrong thing on blocked runs.
- **Mix ratio:** ~60% the newest active family, ~40% older active families. The newest family gets
  the most reps without ever being the only thing on the page.
- **Discriminability pairing is deliberate:** interleave families whose *confusion* is the week's
  named misconception where one exists (×2 with +2 at M4; ×÷ inverse pairs at M4 wk6+;
  percent-of with percent-off at M8). This is the lane borrowing the discrimination doctrine.
- **No item repeats inside one run**; across runs, surfaces are re-drawn (seeded), so a child never
  memorises the *sheet* instead of the *facts*.
- **Retired families still appear** in the mix at ~10% — the lane's own small holdover, distinct
  from the retention engine's warm-ups.

## 5. Parent report — trend, never a score

The parent sees **one sparkline per active family: items-per-minute over time, plus a single word
for state** (`building` → `nearly automatic` → `automatic`). Explicitly forbidden: percentages,
letter grades, comparisons to other children, age norms, and any sentence implying the sprint gates
anything. The report line must survive the WS-0 truth rule — describe only what runs.

Copy pattern (parent surface): *"Times tables: automatic. Adding within 100: building — about 9
facts a minute, up from 6 three weeks ago."*

## 6. Data model & scheduling

- **Per-run row** (attempt log, `-FS-` infix already reserved by `sprintItems.ts`):
  `{childId, familyId, runAt, itemCount, correctCount, medianLatencyMs, abandoned}`.
  Never joined to mastery scoring.
- **Per-family state:** `{familyId, state: 'queued'|'active'|'retired', consecutiveCriterionRuns,
  enteredAt, retiredAt}`.
- **Scheduler**, run once per practice day, in order: (1) list families whose gating week is
  mastered; (2) drop retired ones (keep ~10% holdover); (3) take the newest as primary + 1–2 older
  as interleave; (4) emit a `FluencySprint` with the seeded `GeneratorSpec`; (5) `sprintItems.ts`
  realizes it. Deterministic given `(childId, date, state)` — same day re-opened serves the same
  run.
- **Cold start** (a child with no mastered weeks — placement pending): lane is **off**, not
  guessed. It switches on with the first mastered week.
- **Band A:** the scheduler returns `null`, always.

## 7. Acceptance test

The lane ships when **all** of these pass:

1. **Nine gates green** with the lane's generators registered (the sprint families join
   `bb-family-test`'s instantiation sweep and `bb-verify-packs`'s determinism checks).
2. **DD11 conformance test** (new, `bb-fluency-law-test.ts`): asserts mechanically, over a
   simulated corpus, that no sprint run can (a) produce a score in any child- or parent-facing
   surface, (b) alter mastery/streak/gate state, (c) block a session, (d) appear at band A, or
   (e) draw a family whose gating week is unmastered. Each assertion has a deliberately-broken
   fixture proving the check fires (the QG-12 pattern).
3. **Simulated-learner criterion test:** a synthetic child answering at 97%/2.5 s retires F2 in
   exactly 3 runs; one at 97%/4 s never retires; one at 80%/1 s never retires (accuracy-first);
   a retired family re-enters after two sub-90% resurfacings.
4. **Dose test:** across every band and every day of a simulated month, concept + fluency +
   retrieval stays ≤15 min at the measured per-item times, with the lane at 2–3 min.
5. **Interleaving test:** no run is >70% one family; no item tuple repeats within a run.
6. **Parent-surface audit:** no sentence in the parent report describes an unbuilt mechanism, and
   no numeric score from the lane appears anywhere (WS-0 rule).

## 8. What this spec deliberately does NOT do

- It does not touch the authored 5-day concept arc. Lane 2 is additive and independent.
- It does not gate anything, ever — DD9's monthly/level-exit tests (WS-5) are the only gates.
- It does not add authored content: ~12 generators cover K–8, per plan §1b.
- Days 6–7, where a family opts in, run **lanes 2–3 only** as optional extra credit (R6/D37) —
  identical mechanics, zero effect on standing.
