# Independent expert assessment — MindFoundry vs the true Best Brains model

2026-08-11. Written as an external curriculum consultant's review, to be handed to a working agent.
Stance: the reviewer audited the program's own prior claims as hard as the build — four corrections
to earlier program statements are recorded in §5. Evidence basis: the measured 2013 answer-key corpus
(`RESEARCH-DATA-weekly-signal.md`), the E1–E101 evidence ledger, DD1–DD13, `FILL-ARCHITECTURE.md`,
and the authored week files as of today (branch `best-brains-content-engine`).

---

## 1. The true Best Brains model, in ten statements

Each labelled with its strongest evidence.

1. **It is a supplement, not a school.** The child attends school five days a week; BB adds one
   30-minute class per subject per week plus daily homework. Every structural choice downstream
   follows from this. [Confirmed — E30, bb-connect]
2. **The ladder is a linear packet ladder, not grade-locked.** ~11 grade-years (JrBG → 8b), one
   level ≈ one grade, entered by placement test, advanced by mastery. E33's own words: "not
   grade-locked." [Confirmed — level map + E33]
3. **26 weekly booklets per level, one CCSS-sized standard per week.** Measured fit: Grade 1 = 21
   standards/26 weeks, Grade 2 = 26/26, Grade 3 = 25/26, Grade 4 = 28/26. The week IS the standard,
   with ~0–5 weeks of slack per level. This granularity is the single most important fact about the
   source curriculum. [Confirmed — measured vs CCSS enumeration]
4. **A week = 7 daily packets, homogeneous.** 5–9 pages/packet, ~6 items/page, ~22–48 items/day.
   No distinct test or review packet inside the week. [Confirmed — `PACKET-1..7` markup, measured]
5. **Volume is the engine, and it declines as concepts deepen.** Items/week measured: L0 ≈ 261,
   L1 ≈ 311, L2 ≈ 179, L3 ≈ 249, L4 ≈ 145, L5 ≈ 93–106. Early levels drill count/add facts in
   bulk; upper levels trade count for complexity. [Confirmed — measured]
6. **"Non-repetitive" is positioning, not mechanism.** Official copy simultaneously claims "students
   don't review old material" and "weekly repetition with increasing complexity." Reconciliation
   (E100): each week is one NEW named concept; prior skills recur *as substrate inside new pages*;
   there are no dedicated review pages. [Confirmed both claims — E4/E100]
7. **Review is failure-triggered only.** The weekly grade can reassign/reteach a booklet
   (Review status); nothing else systematically revisits old material. No evidence of engineered
   spaced retrieval. [Confirmed to public-evidence limit — E31/E39/E100]
8. **The year is filled by density, not padding.** 26 booklets + mastery-triggered repeats ≈ a
   30–32-week school year at one booklet per week. Summer is a separate accelerated product
   (**Summer Power Up**: a full grade's concepts in 8–9 weeks, 2–4 sessions/week, no homework —
   coverage, not review). [Confirmed — E33/E101]
9. **The weekly ritual is the retention product parents buy.** Teach → Perceive → Practice →
   Perfect; graded booklet returned weekly; Progress Book signed by the parent. [Confirmed — E41,
   E15, E97]
10. **Its evidenced weakness is teaching quality at the table, not curriculum design.** Recurring
    parent/student criticism: answers given without the why (E52/E88), teacher turnover, time
    pressure at mixed-level tables. Its own copy over-promises ("10 min/day" cannot cover the
    measured ~26 items/day at L2 unless items are pure drill — which at L0–L2 they largely are).
    [Confirmed — reviews; measured reconciliation]

---

## 2. What we built — scorecard

### Where the reconstruction is genuinely *better* than the source

These should be defended, not diluted, during any restructure:

- **A named misconception per week, taught against.** BB has nothing like the discrimination
  column. This is the module's core IP.
- **Error-analysis as content** ("help the puppet" → written EA) — directly targets BB's evidenced
  worst failure (answers without the why).
- **Verified truth.** Every numeric answer is `verifyFor`-recomputed; reader evaluation found zero
  wrong answers across ~880 recomputations. BB ships static answer keys.
- **Band-aware presentation** (audio-first at A, no timers at A, tapering mascot, child-safe
  language law) — BB differentiates only by content difficulty.
- **Retention engineering (DD8) and cumulative gating (DD9) as *designs*** — both deliberately
  exceed BB (its review is failure-triggered only). But see §3: designed ≠ built.
- **QA gates** (nine standing gates, entropy, spoken-answer, cross-week strict) — no equivalent
  exists in a worksheet company.

### Where we fall short of the source — the four structural deficits

**D1 — Coverage: 120 weeks where ~286 are needed.** 5 levels × 24 vs ~11 grade-years × 26. The
5-level mandate compresses ~2.2 grades into each level. Build status today: A 10/24 · B 24/24 ·
C 24/24 · D 23/24 (d17 missing) · E 2/24. **83/120 authored of a target that is itself 42% of the
real ladder.**

**D2 — Granularity: ~2 standards per week where BB does 1.** Direct consequence of D1. Our B covers
Grade 1 + Grade 2 in the weeks BB gives Grade 2 alone. This is what produced the "only 12 weeks of
Grade 2" observation, and it is *our* artifact, not BB's.

**D3 — Volume: ~14% of BB's item count, ~60–70% of its time-dose.** Level B: 5 items/day × 5 days
= 25/week vs BB L2's ~179/week. The fair comparison is time (our items are ~2-min items, BB's are
~23-sec items): ~40–50 min/week vs BB's claimed 70. The real casualty is **automaticity**: CCSS
names memory standards (2.OA.B.2 "know from memory," 3.OA.C.7) that require many light reps; our
heavy items build understanding but cannot automatize facts. The band-B fluency sprint exists but is
ungraded, unscheduled, and untracked.

**D4 — Grade drift with seam gaps.** Levels open by finishing the previous grade (C1–C4 are
Grade 2 material), so grade labels slip ~a quarter-year per level and standards can fall through
seams. Demonstrated at Grade 2: of 26 standards, **14 reached in B**, ~5 more in C1–C4, 2.NBT.B.9
pervasive by design — and **~6 with no found home anywhere**: 2.MD.A.3, 2.MD.A.4, 2.MD.B.5,
2.MD.B.6, 2.G.A.1, 2.G.A.2 (length estimation/comparison, lengths on a number line, Grade-2 shape
work, rectangle partitioning — the last is the *seed of area*, so C20 currently teaches area to a
child who never partitioned a rectangle). Audited from recipe tables, not item level — the agent
must verify — but the class of defect is established.

### Designed-but-not-built (integrity items)

| Item | Design status | Build status |
|---|---|---|
| Adaptive spaced re-check (DD8's engine) | Ratified; **parent report already promises the "warm-up rotation"** | Static cross-level warm-ups exist in authored weeks (e.g. d01 draws C1/C2/C3/C12); the engine-chosen rotation does not. Owner-approved, unbuilt. |
| Monthly test (60% month / 40% cumulative) | Ratified DD9 | Not found in code |
| Level-exit test, ≥85% gate, parallel-form retake | Ratified DD9 | Not found in code (B24/C24/D24 exist as *content* weeks, ungated) |
| Placement test | Ratified DD5 (adaptive, ≥80% step-up) | Not built |
| 5-day vs 7-day week | Evidence withdrawn 2026-08-11 (source is 7) | Awaiting owner re-ratification |
| "Solved independently" flag, two-tier pass | Owner-approved 2026-08-10 | Unbuilt |

The parent-report line promising a warm-up rotation that does not exist is the most urgent of these:
it is the one place the product currently *says something untrue to a parent*.

---

## 3. The owner's three questions, answered

### 3a. "Grade 2 is only B13–B24 = 12 weeks. What fills the year?"

Three answers, in order of importance:

1. **BB never has this problem — the 12-week year is our compression artifact (D2).** BB gives
   Grade 2 twenty-six weeks because Level 2 *is* Grade 2. 26 booklets + a few mastery-triggered
   repeats ≈ one school year exactly. Restore one-standard-per-week granularity (§4, R2) and the
   year fills itself with *new* material — no padding required.
2. **The ladder is continuous — a child who finishes B rolls into C the next week.** Levels are not
   school years; BB is calendar-decoupled and so are we. Nobody idles in April because the level
   ended in March.
3. **Reinforcement without brainless repetition is a solved design problem in this repo — it is
   just unbuilt.** The owner's instinct ("I don't want brainless reinforcement but I want concepts
   clear") is precisely DD8: 20–30% of each day's items are spaced *retrieval* (styled as warm-up,
   at expanding intervals — new problem, old skill, never the same worksheet again), plus
   interleaved fluency, plus the discrimination items which are themselves anti-mechanical (each
   contrasts the concept with its misconception). This beats both BB's answer (raw volume) and
   Kumon's (drill repetition) — *if it ships*.

### 3b. "Where is my son by Grade 5?" (starting Grade 2 now, on Level B)

Two scenarios, stated assumptions: school year ≈ 30–32 usable weeks; placement puts him at B13
(Grade-1 half confirmed quickly, not skipped — see 3d).

**Nominal pace (one 24-week level per school year):**

| End of | Position | Standing vs class |
|---|---|---|
| Grade 2 | B done | on grade (3-digit block deferred into C) |
| Grade 3 | C done | on grade / slightly ahead |
| Grade 4 | D done | ~1 year ahead (D reaches into Grade 5) |
| Grade 5 | E done — *if E exists* | **~2 years ahead** (ratios, integers, one/two-step equations = Grade 6–7) |
| Grade 6 | — | **ladder exhausted** |

**Mastery pace (continuous, ~30 weeks/school-year):** B13→B24 (12 wks) + C1–C18 in Grade 2;
C done + all of D by end of Grade 3; **hits the Level-E wall around the start of Grade 4** —
fall 2028, roughly two school years from now. By Grade 5 he is either idle or, with an extended
ladder, into Grade 7–8 material.

So: **E must be built within ~2 years (mastery pace) or ~3 (nominal), and the ladder must extend
past E within ~3–4.** These are the two hard deadlines his enrollment creates.

### 3c. "Far ahead but weak foundation?"

Being ahead is not the risk — BB's whole model produces ahead-of-grade kids, and the concept-first
design here is *stronger* per concept than BB's sheets. The risk is specific and threefold:

1. **Automaticity debt (D3).** A child can be two years ahead conceptually and still finger-count
   7×8 — and that debt is called in at Grade 4–5, when multi-digit algorithms and fraction
   operations need facts to be free. This is the single most likely way "ahead but brittle" happens
   at the current dose. Fix = R3 (fluency lane), not more concept weeks.
2. **Retention decay.** Forward-marching curriculum + weekly 6-item check + no spaced re-check =
   nothing catches slow forgetting between levels. The 6-item check (pass 5/6) is a thin gate; DD9's
   cumulative monthly + exit gates are the designed backstop and are unbuilt.
3. **Seam gaps (D4).** The compounding kind of gap: a missing Grade-2 seed (2.G.A.2) surfaces as a
   Grade-3 struggle (area) that looks like a math-ability problem and is actually a curriculum hole.

All three are fixable and enumerated in §4. None argues for slowing the child down; they argue for
instrumenting the ladder he's climbing.

### 3d. Recommendation for the son, concretely, starting now

- Place at **B13**, but run **B6→B7→B8 first** as a 3-week on-ramp (equal-sign-as-balance, missing
  addends, fact families). These are the highest-leverage weeks in the level and most Grade-2
  children carry exactly the misconception B6 kills.
- Then B13–B24 in sequence, **plus a daily 2-minute fact sprint** (add/subtract within 20 to
  automatic, then ×2/×5/×10) — this is the manual stand-in for R3 until it ships.
- Roll directly into C1–C4 (they are the back half of Grade 2). Cover the six seam standards
  (lengths, number-line, shape partitioning) with any Grade-2 workbook for now — ~3 weeks of
  material — until R5 closes them properly.
- Expect to enter D during Grade 3. Watch one signal: **speed on known facts**. If accuracy is high
  but everything is slow, pause the ladder and drill fluency for two weeks; the ladder will still
  be there.

---

## 4. The workplan (hand this section to the agent)

> **SUPERSEDED 2026-08-11 (same day, owner direction "fix the system"):** the execution plan now
> lives in **`PROGRAM-PLAN-2026-08-11.md`** — target ladder (M0–M9), three-lane volume model,
> workstreams WS-0…WS-7 with acceptance criteria, and the start-today list. The R-numbers below are
> preserved because the plan references them; where they conflict, the plan wins.

No code in this document; each item = why → what done looks like. Sequence within priority bands.

### P0 — decisions and integrity (blocked on owner where marked)

**R1. [OWNER] Identity ruling: supplement or standalone curriculum.**
Every open number (dose, days, calendar, volume target) depends on whether MindFoundry accompanies
school (BB's model: school carries volume, we carry concepts) or replaces/fully-parallels it (we
must carry automaticity too). The Grade-2 questions in §3 assume *supplement-plus* — supplement
that owns its own fluency floor. *Done =* one paragraph in DECISIONS.md naming the identity and the
volume target per band.

**R2. [OWNER] Ladder ruling: re-index to grade-anchored levels.**
Adopt ~11–12 levels × 24–26 weeks, one level ≈ one grade (recommended in the research findings;
restores one-standard-per-week granularity, dissolves the 12-week problem, fixes drift). Existing
content survives: B splits into Grade-1 and Grade-2 levels each gaining ~12 authored weeks of
headroom; C likewise. This is re-labeling plus seam-filling, not rewriting. *Done =* a level↔grade
map in DECISIONS.md + a migration note per existing week (keep / move / split).

**R3. Fluency lane design.**
A daily 2–3-minute timed-but-unscored sprint strand, separate from the concept arc, tracked to
automaticity criteria per CCSS memory standard (2.OA.B.2, 3.OA.C.7, and the band-D division
equivalents), with the interleaving rules from DD8. Never graded, never blocking, always visible to
the parent report. *Done =* a spec (strand ladder, item mix, promotion criterion e.g. "≥95% correct
at ≤3s/item across 3 consecutive days") ratified against DD11's no-scored-timers law.

**R4. Build the adaptive spaced re-check (DD8 engine).**
The parent report already promises it (integrity defect). Expanding-interval selection from the
child's own mastered weeks, 20–30% of daily items, styled as warm-up. Static authored warm-ups
remain as fallback where history is thin. *Done =* the report's warm-up-rotation sentence is true.

**R5. Full-ladder CCSS seam audit.**
The Grade-2 audit in §2/D4 is the template: for every grade K–6, map every standard to the week
that teaches it (not merely touches it), produce the coverage matrix, and give every unmapped
standard one of: assigned week / new week / explicit deferral with rationale. Item-level
verification, not recipe-table level. *Done =* matrix committed; zero unexplained gaps; the six
Grade-2 orphans resolved first.

**R6. [OWNER] Re-ratify the week length (5 vs 7 days).**
Evidence packet is ready (source = 7 homogeneous packets; our arc = 5; either is defensible — 7
fits daily-habit + retrieval better, 5 fits school-week rhythm). If 7 is chosen: Days 6–7 should be
the R3 fluency lane + R4 retrieval, *not* two more concept days — this fills the week without
touching the authored 5-day arcs. *Done =* DD3 annotation replaced by a ratified decision.

### P1 — build-out (ordered by the son's own deadline: E by fall 2028)

**R7. Finish Level A (18 weeks) and author d17.** A's entropy RED on 11 certifying slots first
(authored 3-option misconception-faithful choices). Known pipeline, ~45–50 min/week solo cadence.

**R8. Build Level E (22 weeks).** The hard deadline (§3b). E1/E13 exist as exemplars; the recipes
table is complete in FILL-ARCHITECTURE §6 including the R-flagged open parts. Budget the four
R-flag weeks (E12/E19/E22/E23) as computable-core + flagged-part per §7 of that doc.

**R9. Build DD9's gates.** Monthly test (60/40 cumulative) + level-exit test with ≥85% gate and
parallel-form retake. This is what makes acceleration safe (§3c-2) and makes "mastery-based" a
mechanism rather than a slogan. Reuse the existing mastery-check RPC pattern.

**R10. Build the placement test (DD5).** Needed the moment any real child starts mid-ladder — the
B13-vs-B1 question of §3d *is* the placement test. Adaptive walk, ≥80% step-up/<50% step-down,
25–30 min cap, parent-facing results conversation.

### P2 — horizon

**R11. Extend the ladder past E** (Grades 7–8: full pre-algebra → algebra, matching BB levels
7a–8b). Needed ~3–4 years from now on the son's own timeline; sooner for older users.
**R12. Summer mode** (optional): a Power-Up-style compressed track is evidenced as viable (E33 —
2–4 sessions/week, no homework); natural fit for R2's grade-anchored levels.
**R13. Deferred research:** modern level naming (cosmetic), placement thresholds (subsumed by R10).

Dependencies: R1 → R2 → (R5, R6); R3/R4 independent of R2, start immediately; R8 after R6 (don't
author 22 weeks into an unratified week shape); R9/R10 after R1.

---

## 5. Corrections to this program's own prior claims (recorded per house rule)

| # | Prior claim | Status |
|---|---|---|
| C1 | "26 weeks calendar-anchored Sep–Aug" (phase-3 G1, inherited by DD2) | **Withdrawn** — month tokens were exercise answers; annotated in DESIGN-DEFAULTS |
| C2 | "5 homework days" as a finding (E94 → DD3) | **Withdrawn** — 7 packets; 5-vs-7 now an owner decision (R6) |
| C3 | "Homework volume unknown" | **Closed** with measured data |
| C4 | "Summer track: no evidence" (this morning's findings doc) | **Wrong** — E33/E101 had it Confirmed; findings doc corrected. Cause: partial read of the local corpus — the same failure the brief was corrected for. Rule going forward: the E-ledger is part of "already known." |
| C5 | "Level C is Grade 3, cleanly" (yesterday's session summary) | **Wrong** — C1–C4 are Grade-2 material; the ladder drifts (D4) |

---

## 6. Close — the consultant's one-paragraph verdict

The pedagogy per week is the best thing in this product and is ahead of the source program; the
*architecture around the weeks* is behind it. Best Brains wins on scaffolding a year — granularity
(one standard per week), volume (automaticity by repetition), and ritual (weekly grade + Progress
Book). MindFoundry wins on what a week teaches — misconceptions, error analysis, verified truth,
band-appropriate presentation — and its designed-but-unbuilt retention system (DD8/DD9) would beat
BB's failure-triggered review outright. The work, therefore, is not to write better weeks; it is to
give the excellent weeks a ladder shaped like the real one (R2), a fluency floor (R3), a memory
system that actually runs (R4, R9), and no holes between the rungs (R5). Do that, and a child on
this program is not "ahead but brittle" — he is ahead *because* the foundation is instrumented.
