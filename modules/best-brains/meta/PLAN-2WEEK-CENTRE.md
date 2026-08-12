# 2-week plan — make MindFoundry teachable at a community centre

**Set 2026-08-11 by owner direction.** Two changes to the programme: the audience is a **community
centre**, not one child; the deadline is **2 weeks**, not September 2028.

## 0. The pivot, stated plainly

**Stop authoring content. Start building delivery.** Levels B, C and D are complete — **72 weeks,
Grade 1 through Grade 5** — which is already enough to run a centre for the ages that will actually
turn up. What is missing is not weeks; it is the machinery that lets a teacher enrol a walk-in
child, place them, keep them moving, and know who needs help on Tuesday.

The 167 unauthored weeks are **out of scope for this fortnight**. So are Level A's 13 gaps
(under-6s) and Level E's 22 (over-11s), unless §4's answers change the age band.

## 1. What already exists (verified in code 2026-08-11, not from docs)

| Capability | State |
|---|---|
| **Placement test** | **BUILT and wired** — 25 items over 5 level clusters, seed persisted and resumable (`session/placementProgress.ts`), → `enroll(childId, {placedLevel, entryWeek})`. *(The expert assessment listed this as unbuilt; that was written from docs, not code.)* |
| Content, Grades 1–5 | 72 weeks, all nine gates green |
| Weekly mastery check | Built; server-scored RPC at 80%; gates the next week |
| Week-to-week gate | Built — `revealReady = weekPassed && …` |
| Parent report / trends / mastery map | Built |
| **Level → level advancement** | **ABSENT** — `advanceToNextWeek` clamps at 24; nothing changes a child's level. A child finishing B24 stops dead. |
| **Consolidation / assessment weeks** | Absent (a dormant cosmetic `CHECKPOINT_WEEK = 12` label exists) |
| **Teacher roster (many children, one adult)** | Absent — the parent surfaces assume one adult's own children |
| **Print / paper packets** | Absent — no print stylesheet, no PDF path anywhere |

## 2. The fortnight, in order of "the centre cannot open without it"

| Days | Work | Why it is here |
|---|---|---|
| **1–2** | **Consolidation engine core** (`CONSOLIDATION-WEEK-SPEC.md` §2–§3): block state, sweep builder + scorer (concept → sharp/shaky/lost + misconception flag), repair-plan ranking | The owner's ask, and the spine everything else hangs on |
| **3–4** | **Repair loop + Day-5 gate** (§3–§4): re-teach-in-a-new-representation selection, failure-point practice, parallel gate form, server-side scoring, block-repeat routing on <80% | Makes the week actually adaptive rather than a fixed review |
| **5** | **Level-exit variant + `advanceToLevel`** (§6) | Closes the hole that stops any child ever reaching Level C |
| **6–7** | **Teacher surface**: roster of N children under one adult, each with the three-second line (§8), sorted by who needs the teacher; assign/unlock controls | The one screen a mixed-level room genuinely cannot run without |
| **8–9** | **Paper path** — print stylesheet + "print this week / this child's block" (see §4 Q2; if the centre is screens-only this drops and days 8–9 go to Level A) | A community centre may have more children than devices |
| **10–11** | **End-to-end rehearsal**: 3 synthetic children at different levels and different sweep profiles, walked from placement → block → gate → next level; fix what breaks | Nothing here has ever been run end to end |
| **12–13** | **Nine-gate battery + acceptance tests** (spec §9), repairs, a Fable-5 read of the generated consolidation packs | Same bar as every authored week |
| **14** | **Teacher run-book** + handoff: how to enrol, what to hand out, what the roster means, what to do when a child fails a gate | The system is only as good as the adult running it |

## 3. Explicitly cut from this fortnight

- Authoring any of the 167 unbuilt weeks.
- Level A's 13 gaps and Level E's 22 (revisit after §4 Q1).
- The fluency lane and retention engine (specs exist; both are additive and neither blocks a centre).
- The M-ladder re-grouping (R2). Levels stay A–E for now; the seam audit stands ready when R2 is
  ruled, and nothing built this fortnight presupposes an answer.

## 4. Three questions whose answers change the plan — defaults chosen so work starts now

| # | Question | Default I am building to |
|---|---|---|
| Q1 | Which ages/grades will actually attend? | **6–11 (Levels B/C/D — 72 complete weeks)**. If under-6s are expected, Level A's 13 gaps become the priority and something in days 8–11 gives way. |
| Q2 | Paper packets, or children on screens? | **Screens, with a printable fallback built days 8–9.** If it is paper-first, print moves to days 3–4 and is a bigger job than one line suggests. |
| Q3 | One teacher account holding every child, or one account per family? | **One teacher account, many children** — the roster in §2. Family accounts still work unchanged. |

## 5. Standing constraints that do not relax for the deadline

- Nine gates green before anything ships. A two-week clock is not a reason to lower the bar that has
  caught every defect so far.
- Server-side scoring only; a client may never write a verdict.
- No parent- or teacher-facing sentence may describe an unbuilt mechanism (WS-0 rule).
- Daily dose stays ≤ 20–30 min, target 10–13.
