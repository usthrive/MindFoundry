# RETENTION-ENGINE-SPEC — the DD8 spaced-retrieval engine (WS-4 / R4)

**Written:** 2026-08-11, system-fix Phase 1 Task 3b. Spec only — no build in this phase.
Self-contained: an implementing agent needs this file, `types.ts`, `services/bbProgressService.ts`
and the nine-gate list, nothing else from Phase 1's context.

**What this fixes.** Two things at once.

1. **The integrity defect.** The parent report promised an engine-chosen "warm-up rotation" that
   does not exist. WS-0 has already reworded it to what is true today —
   `parentCopy.ts`: *"Warm-ups and optional sprints keep facts like this in practice until they
   come for free."* (was *"…will resurface it until it comes for free"*). **This engine is what
   earns the stronger claim back**, and the WS-0 rewording must not be reverted until the
   acceptance test in §7 passes.
2. **Retention decay** (assessment §3c-2). Forward-marching curriculum + a 6-item weekly check +
   no spaced re-check catches nothing between levels. DD8's divergence from Best Brains
   (whose review is failure-triggered only) is the design; it has been ratified and unbuilt since.

---

## 1. What exists today, and what is missing

| Piece | State |
|---|---|
| Retrieval **slots** in every authored week | **built** — `types.ts:129 isRetrieval` + `retrievalSource` (required, strictly-earlier week, QG-2-enforced); 20–30% of daily items are already retrieval, gate-enforced |
| The **items** in those slots | **statically authored** — each week hand-picks its sources (d01 draws C1/C2/C3/C12). Every child on week N sees the same warm-ups in the same order forever. |
| **Which** concept resurfaces **when**, per child | **missing — this spec** |
| Child history to select from | **built** — `bbProgressService.listWeekStates` (per-week state), `scoreMasteryCheck` (pass + margin), `recordItemAttempt` (per-item outcome, `hintRungsUsed`, `attemptNo`) |
| Retrieval ramp within a week | built — `applyRetrievalRamp` (Day 1 ≈20% → Day 5 ≈40%) |

So the engine is a **selector**, not new plumbing: it replaces the *choice* of warm-up items with a
per-child schedule, while the slots, the styling, the share and the gates all stay exactly as they
are. That is deliberate — it means the engine can ship without touching a single authored week.

## 2. The pool

**Pool = the child's own mastered weeks** (`WeekState = mastered`), each contributing its
**item generators**, never verbatim items. A concept enters the pool the day its week is passed
and never leaves.

Each pool entry:

```
{ conceptRef: WeekRef, generators: GeneratorSpec[], masteredAt, shakiness, lastSeenAt,
  intervalStage, nextDueAt, recentOutcomes[] }
```

- **`generators`**: the week's own item generators, minus its Day-5/manual-review templates
  (a warm-up must be computable and short). Re-drawn with a fresh seed at every resurfacing, so a
  child meets the *skill* again, never the *sheet* again — DD8's "new problem, old skill".
- **`shakiness` (0–1)**, computed at mastery time from data already persisted: mastery margin
  (5/6 vs 6/6), hint use (`hintRungsUsed`), and retry count (`attemptNo`). A concept passed at 5/6
  with hints is shakier than one passed 6/6 cold. This is the weighting the owner approved on
  2026-08-10 ("weighted by how shakily they passed").
- **Retired fluency families** also enter this pool (`FLUENCY-LANE-SPEC.md` §3) — the two lanes
  share one pool, one schedule, one rule.

## 3. The schedule — expanding intervals

Base ladder per concept: **~1 week → ~1 month → ~3 months**, then dormant-but-eligible (~6 months)
for as long as the child is enrolled.

| Stage | Nominal delay after | Advances when | Falls back when |
|---|---|---|---|
| S1 | mastery + 7 days | the S1 resurfacing is answered correctly first-try | any miss → re-schedule at +3 days, stage unchanged |
| S2 | S1 + ~30 days | correct first-try | miss → back to S1 (+7 days) |
| S3 | S2 + ~90 days | correct first-try | miss → back to S2 (+30 days) |
| S4 (maintenance) | S3 + ~180 days, repeating | — | miss → back to S2 |

- **Shakiness compresses the ladder**: `delay = nominal × (1 − 0.4·shakiness)`. A 6/6-cold concept
  waits the full week; a 5/6-with-hints concept comes back in ~4 days. Never below 2 days.
- **Jitter ±15%**, deterministic per `(childId, conceptRef, stage)` — so a child who masters five
  weeks in a row does not meet all five warm-ups on the same future day.
- **Due but not urgent:** overdue concepts sort first; the schedule never "catches up" by
  overfilling a day (§4's budget is hard).

## 4. Daily selection algorithm

Run once per practice day, deterministic given `(childId, date, pool state)`:

1. **Budget.** `k = 20–30% of the day's item count` — today 3–5 items, exactly the slots the pack
   already carries. **The budget is a ceiling and a floor: the engine never adds items to a day.**
   It fills existing `isRetrieval` slots. (Time comes from trading, not adding — DD8.)
2. **Candidates.** Pool entries with `nextDueAt ≤ today`, sorted by (overdue days desc, shakiness
   desc, lastSeenAt asc).
3. **Diversity filters, in order:**
   - no concept twice in one day;
   - no concept seen in the last 2 practice days (unless it is a fallback re-schedule from a miss);
   - at most 2 concepts from the same strand (number / measurement / geometry / data) per day —
     interleaving, per DD8;
   - **at most 1 from the current level's immediately-previous 2 weeks** (those are still fresh;
     retrieval should reach further back or it is just review).
4. **Representation shift.** Prefer a generator from the concept's week that is *not* the form the
   child last met it in (a story if they last saw a bare computation, a comparison if they last saw
   a fill-in). The owner's approved wording is "in a DIFFERENT representation" — this is that.
5. **Fill.** Realize each chosen generator at a fresh seed; stamp `isRetrieval: true` and
   `retrievalSource = conceptRef` (QG-2 requires a strictly-earlier week — the pool guarantees it).
6. **Shortfall → cold-start fallback (§5).**
7. **Emit** the day's warm-ups; record `lastSeenAt`, advance/retard `intervalStage` on the outcome.

## 5. Cold start and fallback

- **A child with fewer than 3 mastered weeks** (new enrollment, placement mid-ladder) has a thin
  pool. **Fallback = the existing static authored warm-ups** in the week's own blueprint — the
  content that ships today. No behaviour changes for a brand-new child; the engine simply has
  nothing better yet.
- **Partial fill** is allowed and normal: engine-chosen items first, static ones for the remaining
  slots. The switchover is gradual and invisible.
- **Placed children** (WS-5's placement test): weeks *skipped* by placement are **not** in the
  pool — the child never demonstrated them. Placement seeds `shakiness` for the entry week only.

## 6. Failure feedback — the approved re-check

A missed warm-up is the engine's most valuable signal, and it does two things:

1. **Re-schedules the concept sooner** — stage falls back per §3, and the concept is flagged
   `needsRecheck`.
2. **Can trigger the engine-chosen spaced re-check** (owner-approved 2026-08-10, unbuilt): 1–2
   items from that concept, in a **different representation**, inserted into the *next* practice
   day's retrieval slots ahead of the normal queue. Cap: **at most one concept in re-check at a
   time**, and a re-check never displaces more than 2 of the day's slots — a struggling child must
   not have their whole warm-up strand replaced by their weakest concept.

**A missed warm-up never**: fails anything, appears as a wrong answer in the parent report's
standing, affects streaks, or blocks the day. It is diagnostic only. (Same law as the fluency lane,
for the same reason.)

## 7. Acceptance tests

The engine ships — and WS-0's sentence may be strengthened — when **all** pass:

1. **The simulated-learner 6-month log** (the prompt's named test): a synthetic child mastering one
   week per week for 26 weeks produces a daily log in which **every mastered concept resurfaces on
   schedule** — each concept's gaps match its S1/S2/S3 ladder within the ±15% jitter and the
   shakiness compression, no concept goes >100 days unseen while eligible, and no day exceeds the
   20–30% budget. Failing any of these is a hard FAIL, not a tuning note.
2. **Nine gates green** with the engine on: in particular `bb-verify-packs`' QG-2 (retrieval share
   + strictly-earlier source) must pass on **engine-filled** packs, not just authored ones.
3. **No-verbatim-repeat test:** across the 6-month log, no item tuple (generator + operands) is
   served twice to the same child. (The pool draws generators; this proves it.)
4. **Interleaving test:** no simulated day draws >2 concepts of one strand; no concept appears on
   consecutive practice days except as a §6 re-check.
5. **Cold-start test:** a child with 0, 1 and 2 mastered weeks gets exactly today's static
   warm-ups, and the transition to engine-chosen items is monotonic (no oscillation).
6. **Failure-feedback test:** a deliberately-missed warm-up re-schedules its concept sooner,
   triggers at most one re-check, and leaves mastery/streak/gate state byte-identical.
7. **Parent-copy truth check:** the strengthened sentence is re-introduced **in the same commit**
   that lands the engine, and never before. Until then WS-0's wording stands.

## 8. Boundaries

- The engine never authors content and never edits a week. It chooses among generators that
  already exist and passed their gates.
- It does not gate advancement — DD9's monthly and level-exit tests (WS-5) do that. This engine
  feeds them: a child rehearsed on the cumulative pool is exactly the child a cumulative test is
  fair to.
- It does not change the daily dose. 20–30% of existing slots, no additions (owner time ceiling).
- Days 6–7 (R6/D37, opt-in extra credit) run lanes 2–3 only; the engine serves them by the same
  rules, and opting out costs the child nothing — the schedule is date-based, so a skipped optional
  day simply means those concepts surface on the next real day.
