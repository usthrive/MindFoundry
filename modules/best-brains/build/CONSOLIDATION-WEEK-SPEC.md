# CONSOLIDATION-WEEK-SPEC — the assessment layer (WS-5, owner-directed 2026-08-11)

**Owner direction:** *"add a week of assessment where the past 6 weeks of content is reviewed and
assessed and re-taught in that week over 5–6 days."* Plus a scope change: the system is no longer
only for one child — it must be teachable at a **community centre**, and the deadline is **2 weeks**,
not 2028.

Spec only. Build order in `meta/PLAN-2WEEK-CENTRE.md`.

---

## 0. The one design decision everything follows from

A review week that teaches the same review to every child is worth very little: it bores the child
who knows it and misses the actual gap of the child who doesn't. In a **mixed-level community room**
that failure is fatal — it is precisely the evidenced weakness of the source programme (mixed-level
tables, teacher time spread thin).

So the week is **diagnostic-first**: it *assesses on Day 1* and lets the result **route Days 2–4**.
Same week structure for every child in the room, different content per child, no extra authoring.

The second decision: **every item in this week is generated from the six source weeks' own
generators at fresh seeds.** Nothing here is hand-authored. Build the engine once and it serves all
ten levels and every week authored hereafter, forever. That is what makes an assessment layer
affordable in a two-week window.

## 1. Shape of a level

| | |
|---|---|
| Block | 6 content weeks + **1 consolidation week** = 7 |
| Level | 4 blocks = **24 content + 4 consolidation = 28 weeks** |
| The 4th consolidation week | is also the **level-exit gate** (§6) |
| With mastery repeats | typically 30–33 weeks ≈ **one school year per level** |

This replaces the dormant single `CHECKPOINT_WEEK = 12` constant (currently a cosmetic label in the
parent Mastery Map and an `isCheckpoint` catalog flag) with four real ones.

## 2. Day 1 — The Sweep (diagnose, never grade)

**12 items — 2 from each of the block's 6 concepts.** Drawn from each source week's own generators
at a fresh seed, and where the week offers more than one generator, **deliberately not the form the
child last met it in** (a story if they last saw bare computation, a comparison if they last saw a
fill-in). Untimed. No score is shown to anyone.

Child-facing frame: *"Let's find out what's still sharp."* Output shown to the child is a plan for
the week, never a mark.

**Why this diagnosis is better than a test score — and it is already in our data.** Every week
carries a *named misconception* with authored distractors tagged by `errorTag`, plus a
`mistakeBank`. So a wrong answer does not merely say "missed it"; it says **which misconception
fired**. The sweep therefore produces, per concept, one of:

| State | Meaning | Routes to |
|---|---|---|
| `sharp` | both correct | extension pool |
| `shaky` | one wrong, or right-but-hinted | practice at the exposed difficulty |
| `lost` | both wrong, or a repeated `errorTag` | full re-teach in a new representation |

A concept whose two misses share an `errorTag` is flagged **`misconception:<tag>`** — the strongest
signal the system can produce, and the one a worksheet company cannot generate at all.

## 3. Days 2–4 — The Repair Loop (three slots, personalised)

The sweep ranks the six concepts (`lost` before `shaky`, misconception-flagged first within each).
Each day takes the top unresolved concept and runs one cycle:

1. **Re-teach, in a different representation.** Pull the source week's `explanation.script` and one
   `guidedExample`, but prefer the *other* model the concept supports (bar → number line, area →
   equal groups, symbolic → pictorial). Never a replay of the original page.
2. **Practise at the failure point.** 4–5 items generated at the difficulty the sweep exposed and,
   where the flag is `misconception:<tag>`, weighted to the discrimination items that contrast the
   concept with exactly that misconception. Not a re-run from difficulty 1.
3. **Re-check, 2 items.** Clears the concept, or leaves it in the queue for the next slot.

**If the sweep came back all-`sharp`, the same three days become EXTENSION, not idle review:**
cross-concept problems at raised complexity drawn from the same six weeks (the `multiStep` factory
already composes chains across concepts). The strong child is stretched inside the identical week
structure.

That is the property that makes a mixed-level room work: **every child is doing "the consolidation
week", and no two children are doing the same items.**

## 4. Day 5 — The Gate (the only graded surface)

A **fresh parallel form: 12 items across all 6 concepts**, disjoint by construction from the Sweep's
surfaces (the existing pack-wide surface guard + Form-A/B disjointness machinery). Scored
**server-side** by the existing `bb_score_mastery_check` RPC pattern extended with a block form —
the client can never write a verdict, exactly as today.

| Result | Consequence |
|---|---|
| ≥ 80% | block passes → next block unlocks |
| < 80% | the **specific weak weeks repeat** (never the whole block), then a parallel-form retake |
| ≥ 95% on a block whose sweep was all-`sharp` | `fast_track` — the block's extension strand is recorded for the parent/teacher report |

## 5. Day 6 — The Long Problem (optional, extra credit)

One rich task requiring **2–3 of the block's concepts together**. Opt-in, never required, never
affecting standing (R6/D37). Transfer across concepts is the thing six separate weeks never build,
and this is its natural home.

## 6. The level-exit variant — and the hole it closes

The **4th consolidation week of a level** runs the same five days over the whole level (2 items per
block on the Sweep; a 20-item Day-5 form spanning all four blocks) and gates at **≥85%**, with one
corrective week and a parallel-form retake on failure.

**Passing it performs the level transition — which today does not exist at all.**
`advanceToNextWeek` increments a week number and clamps it at 24; nothing anywhere changes a
child's level. A child who finishes B24 currently stops dead. The level-exit gate is where
`advanceToLevel(child, nextLevel, entryWeek = 1)` gets built, so the gate and the transition are the
same mechanism and a child can never cross a level boundary un-assessed.

## 7. Data model

```
bb_block_state   (child_id, level, block_index 1..4)
  sweep_seed, sweep_completed_at
  concept_states  jsonb  -- [{ week, state, errorTag?, difficultyAtFailure }]
  repair_plan     jsonb  -- ordered concept refs, one per Day 2..4 slot
  gate_attempt_no, gate_score, gate_passed_at
  repeat_weeks    jsonb  -- weeks to re-run on failure
```

Deterministic: the sweep seed is persisted (the placement walk already proves this pattern —
`session/placementProgress.ts` persists its seed so a resumed walk is item-for-item identical). A
re-opened consolidation day serves the same items.

## 8. Teacher-facing output (community-centre requirement)

Per child, one line the teacher can read in three seconds:

> **Ravi · Level C · Block 2 · Day 3** — repairing *equivalent fractions* (bigger-bottom
> misconception); *rounding* cleared Tuesday. Gate Friday.

Per class, one roster view sorted by *who needs the teacher this week* (concepts `lost` first).
This is the single highest-value screen for a mixed-level room and it is pure derivation from
`bb_block_state` — no new content, no new scoring.

## 9. Acceptance tests

1. **Routing test.** A synthetic child with a known profile (strong on 4, one `shaky`, one
   `lost`-with-repeated-errorTag) produces a repair plan in the right order, and the misconception
   concept gets the discrimination-weighted items.
2. **All-sharp test.** A perfect sweep yields three *extension* days, never three empty ones.
3. **No-repeat test.** Across Sweep → repair → gate, no item tuple is served twice inside a block.
4. **Gate integrity.** The Day-5 form is surface-disjoint from the Sweep at every seed; scoring is
   server-side only; a client cannot write a verdict.
5. **Failure routing.** A 60% gate repeats exactly the weak weeks, not the block; the retake form is
   parallel, not identical.
6. **Level boundary.** A child cannot reach C1 without passing B's level-exit at ≥85%. (Today this
   test would fail by being impossible to run — there is no path to C1 at all.)
7. **Nine gates green** on every generated consolidation pack, same bar as an authored week.
8. **Dose.** Each consolidation day stays inside the 10–13 min target and the 20–30 min ceiling.

## 10. What this deliberately does not do

- It does not author content. Zero new hand-written weeks; the engine composes from the 85 built.
- It does not gate on time, only on readiness — a child who passes moves, whatever the calendar says.
- It does not show a child a score. Only the Day-5 gate is graded, and only the parent/teacher sees
  the number.
