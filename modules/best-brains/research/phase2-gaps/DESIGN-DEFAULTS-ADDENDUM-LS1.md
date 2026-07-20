# Design Defaults — Addendum LS1 (Learning-Science External Review)

**Date:** 2026-07-19 (mid-Phase-6) · **Source:** `research/external-inbox/2026-07-19-external-learning-science-defaults.md` (independent literature review: distributed practice, successive relearning, interleaving RCTs, worked-example fading, ITS hint research, CRA/concreteness fading, SDT motivation — full bibliography in source).
**Nature:** This is NOT Best Brains evidence — no ledger rows. It audits DD1–DD15 against the research base. Verdict: **no DD is contradicted**; several are strengthened; six refinements adopted below. Traceability tag for all items: `[original design — LS1]`.

## Validations (no change)

| DD | Verdict |
|---|---|
| DD1 (85% mastery band) | Validated — mastery-learning criterion band is 80–90% |
| DD8 (20–30% spaced retrieval, engineered spiral) | Validated — distributed practice + cumulative review (WWC) |
| DD11 (sprints: narrow, private, self-referenced, never gating, Level B+) | Strongly validated — timed-pressure/anxiety literature; our design already implements every caution |
| DD13 (immediate item feedback + weekly narrative) | Validated as the exact evidence-aligned hybrid ("immediate micro + delayed macro"); "comments beat grades" further supports the child-side no-% law (P6) |
| P5/zero-gamification | Validated — gamification meta-analyses mixed; SDT (autonomy/competence/relatedness) is the durable lever, which our design already targets |
| LessonRoom visual-first arc | Validated — CRA / concreteness-fading; keep representations linked to symbols, not decorative |

## Refinements ADOPTED

| # | Refinement | Changes | Build impact |
|---|---|---|---|
| LS1-R1 | **Age-banded session caps** replace the flat 15-min cap: target/hard-cap = 8/10 min (band 4–6), 12/15 (6–9), 15/20 (9–12) | PRODUCT-PRINCIPLES P2/P11 dose model; ParentControls copy | Increment 4/5: settings default per band; enforcement in session timer |
| LS1-R2 | **Adaptive stop rule**: two fatigue signals in one session (accuracy below recent baseline, repeated rapid guesses, heavy hint dependence) → warm early end, concept resurfaces tomorrow | CHILD-FLOWS daily loop edge case | Increment 4/5 (session engine); MVP-acceptable as v1 heuristic |
| LS1-R3 | **Hint-ladder discipline**: require a genuine attempt before rung escalation; after any bottom-out reveal, serve a near-transfer "fix-it" item (or explain-back prompt) before the day continues | HintLadder component behavior | **Increment 3 (in flight — messaged)** |
| LS1-R4 | **Retrieval ramp across the week**: current-concept share ~75–80% days 1–2 → 60–50% days 4–5 (retrieval share ramps 20%→40%), old items sampled recent / 2–4 wks back / long-gap maintenance; avoid adjacent same-strategy items late-week | QUESTION-GENERATOR-SPEC day-mix rules (within existing QG bounds where possible) | Increment 4/5 generator tweak; if bounds conflict with QG gates, QG gates win until a coordinated spec bump |
| LS1-R5 | **Mastery stability rule (DD1.1)**: the weekly verdict considers week stability, not the check alone — advance requires check ≥85% AND no practice day materially below 80%; mastery check includes ≥1 surface-varied transfer item + ≥1 cumulative item (spec's Form-B isomorph rule unchanged) | DD1 refinement; WeeklyCheck scoring | Increment 4 (mastery engine) — verdict computation reads day_progress |
| LS1-R6 | **Bounded choice for autonomy**: where content allows, offer 2–3 equivalent practice-path choices inside the same objective (e.g., pick the Day-5 puzzle theme); personal-best framing only | PRODUCT-PRINCIPLES P5-compatible (not a reward mechanic) | Post-MVP nice-to-have; log in BUILD-NOTES known-limitations |

## Refinements DEFERRED (logged, not adopted now)

- **Multi-day 3-opportunity gate** (≥85% on three spaced daily sets + delayed 90% check): stricter than DD1.1; deferred because week structure already spaces practice across 5 days and the corrective loop covers failure; revisit after Phase 7 persona data.
- **5-rung worked-example fade with automatic rung-back** (expertise-reversal adaptation): GuidedPractice currently implements the spec's fade levels; full adaptive re-escalation engine deferred to post-MVP.

**Phase 6/7 obligation:** builders cite `LS1-Rn` in code comments/BUILD-NOTES where a refinement lands; Phase 7 testing personas should verify LS1-R3 behavior explicitly.
