# Program plan — fixing the system

2026-08-11. Supersedes §4 of `EXPERT-ASSESSMENT-2026-08-11.md` (which holds the findings and the
why; this file holds the work). Written to be executed by an agent, workstream by workstream.
No code in this document — every task names its deliverable and its acceptance test.

**The four defects this plan resolves** (evidence in the assessment):
- **D1 coverage** — 120-week ladder where ~250–260 is needed (5-level mandate).
- **D2 granularity** — ~2 standards/week where the source does 1 (compression artifact; this is
  what created "Grade 2 = only 12 weeks").
- **D3 volume** — 25 heavy items/week vs the source's measured 180 light ones; no automaticity path.
- **D4 seams** — grade drift (each level opens with the prior grade) + standards with no home
  (6 found at Grade 2 alone).

Plus three integrity items: the parent report promises a warm-up rotation that does not exist;
DD9's gates are ratified but unbuilt; placement (DD5) is unbuilt.

---

## 1. Target architecture

### 1a. The ladder (D1 + D2 + D4)

Grade-anchored levels, one level ≈ one grade-year, week count set by that grade's standard count
(CCSS: K 22 · G1 21 · G2 26 · G3 25 · G4 28 · G5 26 · G6 29). Internal IDs stay stable
(`b13` stays `b13`); levels are re-grouped by a level-map, and user-facing names are neutral codes
with an internal level↔grade map for parent reporting (DD2's destigmatization principle, unchanged).

| New level | Grade anchor | Weeks | Seeded from (audit finalizes splits) | New weeks (est.) |
|---|---|---|---|---|
| M0 | pre-K | 24 | Level A front half | ~12 |
| M1 | K | 24 | Level A back half + K gaps | ~12–14 |
| M2 | Grade 1 | 24 | B1–B12 | ~12 |
| M3 | Grade 2 | 26 | B13–B24 + C1–C4 | ~10 |
| M4 | Grade 3 | 25 | C5–C24 | ~5 |
| M5 | Grade 4 | 26 | D front (split point from audit) | ~12 |
| M6 | Grade 5 | 26 | D back | ~15 |
| M7 | Grade 6 | 26 | E front | ~14 |
| M8 | Grade 7 | 25 | E back (pre-algebra) | ~14 |
| M9 | Grade 8 | 26 | — (algebra, matches BB 8a/8b) | 26 |

Totals: ~254 weeks; 83 authored today; ~171 to author (of which 37 were already owed under the old
plan: A×14, d17, E×22). **Net new from the ladder fix ≈ 134 weeks.** At the measured solo cadence
(~45–50 min/authored week through all gates) this is a long program — which is why §1b moves volume
off the authoring budget entirely.

Nothing already certified is rewritten. Existing weeks migrate by re-grouping; content edits happen
only where the seam audit (WS-2) finds a defect in the week itself.

### 1b. The volume model (D3) — volume comes from generators, not authoring

The economics that make this plan feasible: BB's 180 items/week are mostly light drill. We match
the *function* of that volume with two machine-generated lanes, so the authoring budget stays on
concepts where our advantage lives.

Each day = three lanes:

| Lane | Source | Size | Time | Purpose |
|---|---|---|---|---|
| 1. Concept | the authored week (existing 5-day arc, **unchanged**) | 5–6 heavy items | ~6–8 min | understanding, discrimination, EA |
| 2. Fluency sprint | **generator** per fact-family, band-keyed | 15–20 light items | 2–3 min | automaticity (2.OA.B.2, 3.OA.C.7 class) — timed, never scored (DD11) |
| 3. Retrieval warm-up | **DD8 engine** from the child's own mastered weeks | 3–5 items | ~2 min | retention at expanding intervals |

Day ≈ 25–30 items / 10–13 min. Week at 5 days ≈ **125–150 items** (~70–80% of BB's count at ~parity
of time-on-task, with far heavier items). **R6 RULED 2026-08-11 (D37): the week is 5 days; days 6–7
exist only as OPTIONAL extra credit** — lanes 2–3 only, opt-in, never required, never affecting
verdicts, streaks, or parent-report standing. A child who opts in reaches ≈165–190 items/week.

> **OWNER CONSTRAINT (ruled 2026-08-11): daily practice must not exceed 20–30 minutes; target well
> under it.** The three-lane day above is designed to **10–13 min** and this is a design target, not
> a floor — never grow the dose to fill the ceiling. Item *count* is not the burden metric; minutes
> are. BB's own 180/week reconciles to ~10 min/day of ~23-second drill items — its bulk is
> page-count economics and perceived-value packaging, not a pedagogical requirement, and this
> program matches its *function* (daily habit, automaticity, spaced retrieval) at roughly a third
> of the item-time. Any future proposal that pushes a band's day past ~15 min must argue from a
> named learning outcome, not from parity with the source.

This dissolves the "what fills the year" problem a second way: the year is filled by *daily habit*
(lanes 2–3 run every day regardless of concept pace) + *new material* (D2 fix gives each grade
24–26 concept weeks) + *mastery repeats* — the same three mechanisms as the source, minus the drill
monotony.

---

## 2. Workstreams

### WS-0 — Integrity hotfix (first task, ~minutes)

The parent report's warm-up-rotation sentence (`parentCopy.ts`) claims a rotation that doesn't
exist. **Reword to describe what is true today** (static warm-ups drawn from earlier weeks);
restore the stronger claim when WS-4 ships. *Accept:* no sentence in any parent-facing surface
describes an unbuilt mechanism. (One-line change; still passes the gate battery.)

### WS-1 — Decision packet (owner; everything else in this plan survives any outcome)

One page, three rulings, each with the recommended default:

- **R1 identity** — recommend **supplement-plus**: accompanies school, but owns its own fluency
  floor (lane 2). Sets the volume target at §1b's numbers.
- **R2 ladder** — recommend the §1a table. Alternative (rejected by the evidence): keep 5 levels
  and lengthen — reproduces D2 and leaves the drift.
- **R6 week shape** — **RULED 2026-08-11 (D37): 5 days; days 6–7 optional extra credit only.**

*Accept:* remaining rulings (R1, R2) recorded in `DECISIONS.md` with rationale.

### WS-2 — Seam audit + master scope-and-sequence (the keystone; start today)

The Grade-2 audit is the template. For every grade K–8:

1. Enumerate the grade's CCSS standards.
2. Map each to the week that **teaches** it (item-level check, not recipe-table check) across the
   whole current ladder.
3. Classify every standard: TAUGHT (week id) / TOUCHED-ONLY / ORPHAN.
4. Output per new level (M0–M9): the full 24–26-row scope-and-sequence in the authoring format
   (per-level column headers per the corrected Deliverable-4 spec in
   `RESEARCH-PROMPT-CURRICULUM-SCOPE.md`), marking each row EXISTS(id) / MOVE(id) / NEW.
   Every NEW row carries concept, anchor, named misconception, and Day-5 signature — a row missing
   the misconception cannot be built and will be sent back.
5. Fix the split points: B→M2/M3 (known: B12|B13), C→M3/M4 (known: C4|C5), D→M5/M6 and E→M7/M8
   (unknown — read the D/E week files, not the plan docs).

Priority inside the audit: the six known Grade-2 orphans first (2.MD.A.3/A.4/B.5/B.6, 2.G.A.1/A.2)
— 2.G.A.2 blocks area (C20) conceptually and should become one of M3's first NEW weeks.

*Accept:* one matrix file, every K–8 standard classified, zero unexplained ORPHANs; M0–M9 tables
complete enough that an authoring agent needs no other input. This is ~2–3 sessions of reading, no
authoring, and **unblocks everything else**.

### WS-3 — Fluency lane (D3; spec now, generators after)

Spec first: per-band fact-family ladder (K: subitize/compare → G1: +/− within 20 → G2: within 20
from memory + within 100 strategies → G3: ×/÷ single-digit → G4+: multi-digit fluency, fraction
benchmarks), automaticity criterion per family (recommend: ≥95% correct at ≤3 s/item on 3
consecutive days → family retires into the retrieval pool), interleaving rules from DD8, and the
DD11 law (timed, never scored, never blocking). Generators are per-family, not per-week — ~a dozen
generators cover the whole ladder. *Accept:* spec ratified; then generators pass the existing gate
battery; sprint results visible in the parent report as trend, not score.

### WS-4 — Retention engine (DD8 build)

Selection algorithm over the child's mastered-week history: expanding intervals (~1 wk / 1 mo /
3 mo), 20–30% of daily items, styled as warm-up, drawing item *generators* from mastered weeks
(never verbatim repeats). Static authored warm-ups remain the cold-start fallback. Ships with the
re-check the owner already approved ("engine-chosen spaced re-check"). *Accept:* WS-0's original
sentence can be restored truthfully; a simulated 6-month learner log shows every mastered concept
resurfacing on schedule.

### WS-5 — Assessment system (DD9 + DD5)

- Monthly test: every 4 completed weeks, 60% current month / 40% cumulative.
- Level-exit test: whole-level form, **≥85% to advance**, parallel form after one corrective week.
- Placement test: DD5's adaptive walk (≥80% step-up, <50% step-down, 25–30 min cap), reporting a
  placed level + entry week + parent-facing summary. Placement is what makes the M-ladder usable by
  real children who start mid-stream.
Reuse the existing mastery-check RPC pattern for all three. *Accept:* a child cannot cross a level
boundary below 85%; placement lands a test child of known profile at the expected week.

### WS-6 — Content build-out (through the NINE gates, 1–2 agents max)

Order chosen by value-per-week and the one hard external deadline (Grade-6/7 content needed by
~fall 2028 for the first live learner):

1. **d17** (closes Level D) and **Level A's 11 entropy-RED certifying slots** (unblocks A). Owed
   under the old plan already.
2. **M3/M2 seam-fill weeks** (~22 NEW weeks incl. the six Grade-2 orphans) — cheapest, highest
   foundation value, makes Grades 1–2 complete end-to-end.
3. **M4 fills** (~5 weeks) — completes Grade 3.
4. **E-block → M7/M8** (~22 weeks + ~6 fills) — the deadline item; recipes already exist in
   FILL-ARCHITECTURE §6 including the four R-flagged weeks (computable core + flagged part, per §7).
5. **A remainder → M0/M1** (~14 + gap fills).
6. **M5/M6 fills** (~27), then **M9** (26, all NEW — Grade 8/algebra; also the least urgent).

*Accept per week:* all nine gates green + auditor pass, same bar as today. *Accept per level:*
WS-2 matrix shows 100% of that grade TAUGHT.

### WS-7 — Program governance

Per-level certification = gates + seam matrix + a written level verdict (5-row evolution style),
recorded in `DECISIONS.md`. Cadence check monthly: weeks authored vs plan, deadline tracking for
item 4. Corrections to prior claims keep being logged (the C1–C5 discipline) — this program has
now caught five, and each one was caught by re-reading evidence, not by re-running work.

---

## 3. What starts today vs what waits

**No owner input needed — start immediately:** WS-0 (hotfix) · WS-2 (audit — the keystone) ·
WS-3/WS-4 specs · WS-6 item 1 (d17 + A entropy fixes).

**Waits on WS-1 rulings (R1, R2; R6 is ruled — D37):** final level naming/grouping (R2) ·
WS-6 items 2+ (authored against the M-ladder's finalized tables).

**Waits on WS-2 output:** all NEW-week authoring targets; D/E split points; M5–M9 tables.

---

## 4. Definition of done (program level)

1. Every CCSS standard K–8 is TAUGHT by exactly one week or carries a logged deferral.
2. Weekly practice volume meets §1b targets per band; automaticity tracked per fact family.
3. No parent-facing sentence describes anything unbuilt.
4. Monthly + level-exit gates live; no advancement below 85%; placement live.
5. Every authored week passes the nine-gate battery + auditor.
6. Grade-6/7 content (M7/M8) complete before **2028-09**.
7. The ladder reaches Grade 8 (M9) — full parity with the source program's span.
