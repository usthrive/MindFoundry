# Brief — feed this to Fable 5 to write the v2 Master Meta-Prompt

*This is the exact task-prompt for the meta-prompt-synthesis step of the Strategic Top-Model Review
layer (L18). Run it in a **Fable 5** conversation. It is self-contained: everything it needs is on
disk in this repo.*

---

You are Fable 5, acting as the meta-prompt architect for a reusable "build a curriculum-content
module for program X" pipeline. The v1 pipeline built the **Best Brains** math module; a subsequent
rebuild proved a **question-generation engine + two-gate (correctness + authenticity) architecture**
that took Level D from 1/24 to 23/23 clean authenticity-ACCEPT without an AI ever asserting an answer.
Your job: **synthesize the v2 Master Meta-Prompt Template** so the next program (RSM, Mathnasium,
Singapore Math, …) inherits all of that, parameterized.

## Read first (the evidence base — all in `modules/best-brains/`)
- `meta/MASTER-META-PROMPT-v1.md` — the v1 template you are superseding (keep its research→design→build
  →test spine; it worked).
- `meta/LEARNINGS.md` — L1–L23. L17 (question-engine = its own phase) and L18 (top-model review layer)
  are the two mandated additions; L19–L23 are the rebuild's hard-won engineering rules.
- `meta/DECISIONS.md` — D25/D26/D27 (the style gate, the FAIL, the rebuild to 100%).
- `build/CONTENT-GENERATION-PLAN.md` — the reusable engine capability spec (deterministic templates +
  code-computed answers + validation gates + one-time AI authoring).
- `build/CONTENT-GENERATOR-FIX-SPEC.md` (Rev 2) — the v2 pedagogy contract: 13 seed-invariant preflight
  gates, QG-11 anchor/claim audit, the `verifyFor` registry, the migration-flag discipline. Note it was
  hardened by a 4-lens adversarial review that caught 7 blockers before any code — bake that
  "adversarial-spec-review-before-build" step into the template.
- `build/FANOUT-AUTHORING-KIT.md` — the per-week authoring recipe + the rules earned from real bugs.
- `build/CONTENT-STYLE-GATE.md` — the authenticity/style gate (10 hard + 14 weighted, LLM-judge,
  two-pass + adversarial anti-drift).
- `build/workflows/*.workflow.js` — the reusable fan-out and style-gate orchestration scripts.

## What v2 MUST add vs v1 (non-negotiable, per L17 + L18)
1. **A dedicated "Phase 4.5 — Question-Generation Engine" phase**, between teaching-system design and
   build. It must specify, as a portable capability: deterministic templates + seeded RNG (not
   live-AI at runtime); the **answer-correctness invariant** (answers computed by code / `answerFor`,
   re-audited, never asserted by an AI); the **authenticity layer** (a v2 pedagogy contract of
   preflight gates that make "structurally polished, pedagogically hollow" content impossible —
   multi-step load, discrimination, narrated modeling, error-analysis, metacognition, seed-invariant
   hints); the **two-gate shipping rule** (deterministic validator AND an LLM authenticity gate, both
   required); the **`verifyFor`/embedded-claim audit** (makes a mis-keyed or fabricated answer
   structurally impossible); and an **exemplar-first fan-out** method (prove one unit through both
   gates → distill an authoring kit → validation wave → scale), with a **coverage ledger**.
2. **A "Strategic Top-Model Review" layer** invoked at defined checkpoints (NOT as the default
   executor): (a) after the engine phase, a top-model pedagogy-ceiling pass over a content sample +
   the gate results; (b) a whole-build completeness critic; (c) the meta-prompt self-update. Encode
   the rule: **top model for judgment where gating can't reach (pedagogy ceiling, completeness, novel
   synthesis); strong workhorse under deterministic+adversarial gates for volume execution.**
3. Fold in L19–L23 as engineering guardrails: gates must be **seed-invariant** (they run at
   pack-generation time); **correctness ≠ prose-consistency** (keep both gates); code-derive
   embedded-claim truth; keep the adversarial re-check; exemplar-first + adversarial-spec-review.
4. One more lesson to encode (found while testing the rebuild): **cross-unit context variety** — the
   authenticity gate checks variety *within* a unit but not *across* units, so independent units in
   one topic family converge on the same real-world context. The template's engine phase must include
   a shared **situation/context ledger** so consecutive same-archetype units rotate contexts.

## Parameterization (the template is filled per program)
`{{PROGRAM_NAME}}` · `{{SUBJECT}}` · `{{DISAMBIGUATION}}` (how to name it for a private build without
claiming affiliation) · `{{KNOWN_DIFFERENTIATORS}}` · `{{COMPARISON_ANCHORS}}` (the competitor
programs to contrast against). Keep every brand-neutrality / child-safe / code-computed-answer law.

## Deliverables (write both to `modules/best-brains/meta/`)
1. **`MASTER-META-PROMPT-TEMPLATE-v2.md`** — the full parameterized pipeline template, with the two
   new phases integrated into the v1 spine, ready to paste for a new program.
2. **`NEXT-PROGRAMS-STARTER.md`** — pre-filled parameter blocks for **RSM**, **Mathnasium**, and
   **Singapore Math** (name, disambiguation codename, known differentiators, comparison anchors),
   each ready to drop into the v2 template.

Before writing, do a completeness pass: what did the Best Brains build get right that the template
must preserve, and what did it learn the hard way that the template must front-load? Then write.
