# Content Generator Fix Spec — Level-D authenticity rebuild (the "v2 pedagogy contract")

**Status:** ACTIVE build contract, **Revision 2** (2026-07-21, after a 4-lens adversarial review
folded in 7 blockers + 11 majors). Supersedes Rev 1. It ADDS a pedagogy layer to the existing engine.
**Owner of truth:** every library change, assembler gate, validator extension, and per-week blueprint
rewrite must conform to this file. If code and this file disagree, fix one of them deliberately (P55).

**Read first:** `build/CONTENT-STYLE-GATE-RESULTS-LEVEL-D.md` (diagnosis + 9 fixes),
`build/CONTENT-STYLE-GATE.md` (the gate we must pass), `build/CONTENT-GENERATION-PLAN.md` (the engine).
The review that shaped Rev 2 lives in the session workflow journal (`wf_4b94c18b-67a`).

---

## 0. Root cause (one sentence)

The engine manufactures band-appropriate **surface** (5-day arc, fade tiers, hint ladders, mistakeBanks)
while defaulting every application item to a **single-step noun-swap**, confining discrimination /
error-analysis to Day-5 furniture, shipping **terse rule+answer modeled GEs**, and baking **static hint
arrays that repeat across ~20 items** — because the assembler enforces *mechanical* gates only, with zero
pedagogical-depth gates.

## 1. Fix philosophy — and its honest limit

Correctness is impossible to get wrong because **code computes every answer and the validator re-derives
it over identical params**. We apply the same discipline to depth **wherever the property is code-derivable**
— multi-step load, the answer-key/embedded-claim truth, situation structure, hint-leak — via authoring-time
preflight gates that THROW on drift, plus library primitives that make satisfying them a small composition.

**Honest limit (review M11):** several style criteria are *continuous LLM judgments* that no structural gate
can guarantee — BB-W1 (is the "why" genuine reasoning), BB-W9 (is the voice warm, does praise name a move),
the overall ≥3.5 mean. For these the preflight is a **necessary structural screen, not a sufficient predictor
of ACCEPT.** The sufficient check remains the actual style-gate run. Therefore we **prove one exemplar week
through BOTH gates before scaling**, and the go/no-go for the 111-week fill is the *measured* re-gate result
(§11), not preflight-pass.

## 2. Migration safety — `pedagogyContract` flag; what it guards (review B2, M1)

`bb-verify-packs` generates **every** week, so a throwing preflight or a blocking QG-11 would break all 23 at
once. Two tiers of change:

**Tier A — foundational, GLOBAL, un-flagged (safe for v1 because they touch neither operands nor answers):**
- Every `ItemGen` stamps `authorMeta` (default `{stepCount:1, cognitiveOp:<class>}`).
- Hint ladders become **orient→locate**, chosen by **pure param-keying with NO new rng draw** (variant index
  derived from an already-drawn operand, e.g. `(a+b)%pool.length`), so v1 operand surfaces are **bit-stable**.
  Hint *text* changes are not surface/answer changes; the correctness gate stays green.

**Tier B — v2-only, guarded by `pedagogyContract: 'v2'` on the blueprint (default `'v1'`):**
- The structural pedagogical preflight gates (§6).
- **QG-11 blocking** (§7). For `v1` packs and the three pinned fixtures (A15/B14/D17), QG-11 runs in
  **report-only** mode — it never fails the correctness gate. It BLOCKS only for `v2` packs. (This is the
  clean guarantee that "correctness gate GREEN after every commit" survives migration — review B2, B3, B4.)

A week is "migrated" when its blueprint sets `pedagogyContract:'v2'` and it passes both gates × 5 seeds. When
all 23 are `v2`, delete the flag and make v2 unconditional. **A25/B14/D17 fixtures are a pinned regression set
QG-11 must never fail (§11).**

## 3. Metadata plumbing (authoring-time only — never shipped) (review B1, M2, minor-leak)

Pedagogical preflight needs per-item facts the shipped `PackItem` does not carry. `authorMeta` is the **only**
stripped field — the "truth" for claim audits rides in the **already-shipped** `generator:{templateId,params}`
(see §5), so there is no closure to thread and nothing else to strip.

```ts
// lib/meta.ts (new)
export type SituationType =
  | 'rate' | 'area' | 'sharing' | 'comparison' | 'measurement'
  | 'money-change' | 'combine' | 'multi-stage' | 'rate-of-change' | 'part-whole';

export interface AuthorMeta {
  /** DERIVED, never hand-set outside the owning generator (review B5). Number of distinct chained ops.
   *  1 = single-step. Only multistep.ts may stamp >= 2. */
  stepCount: number;
  /** Cognitive-operation class for BB-G5 clustering — the registered op class of the item's compute
   *  template (NOT a free-text label; review M-labels). e.g. 'mul','div-interpret','add-frac-unlike'. */
  cognitiveOp: string;
  situationType?: SituationType;                 // word problems only
  isDiscrimination?: boolean;                     // set ONLY by discrimination.ts
  isErrorAnalysis?: boolean;                       // set ONLY by erroranalysis.ts
  isMetacog?: boolean;                             // set ONLY by metacog.ts wrappers
  /** True when >=1 solution step invokes a strictly-prior-week skill (BB-W13 substrate; review m1). */
  usesPriorSkill?: boolean;
}
```

- `ItemDraft` (`templates/shared.ts`) becomes `Omit<PackItem,'id'> & { authorMeta?: AuthorMeta }`.
- **Strip by explicit whitelist**, not spread: `makeDay`/`makeMasteryItems` build the emitted `PackItem` by
  copying only known fields (or route every draft through one `stripDraft()` that deletes `authorMeta`).
- The **puzzle** also carries authoring-time `authorMeta` (review M5); strip it likewise.
- **CI deep-scan (new verify assertion):** every emitted pack (days, mastery, puzzle) must contain **no**
  `authorMeta` key anywhere. Fails CI if a strip site is forgotten (leaking self-assessed tags would bias the
  independent LLM judge — review minor-leak).
- `makeWeekBuilder` refactor: **generate all day/mastery/puzzle drafts (with authorMeta) → run pedagogical
  preflight over the drafts → strip → assemble.** Keep the existing `gen()` call order and puzzle/mastery
  ordering UNCHANGED relative to the shared `TupleGuard`/streams so v1 output is bit-stable (review M3).

## 4. New / changed library modules

### 4.1 `lib/situations.ts` (new) — situation taxonomy (fix #2)
A `Situation` binds a `SituationType`, a role schema, a prose template, and a **code-computed** answer; the
generator stamps `authorMeta.situationType`. Require **≥3 distinct situationTypes** per week among word problems,
**AND those types must differ in operation/step-structure** (not just the enum tag — review M-labels), so the
LLM's cognitive clustering agrees. Replaces the noun-swap `THINGS`/`UNITS` arrays.

### 4.2 `lib/multistep.ts` (new) — multi-step synthesizer (fix #1; review B5)
Composes **N≥2 registered compute ops over one real context**. It **derives** `stepCount = N` from the
composition (never a hand-set integer) and stamps it. Each multi-step skill owns a **distinct
`d_multistep_<skill>_v1` templateId** whose registered `answerFor` **re-executes the identical composition**
over serializable params and is **total** across the generator's param space (guard non-terminating
decimal/fraction sub-steps by construction). Preflight asserts the composed op-count equals `stepCount`.
**Forbidden:** reusing a single-op templateId for a `stepCount≥2` item (would make QG-5 audit only one op —
review B5, determinism-major). At least one step SHOULD invoke a prior-week skill → set `usesPriorSkill`.

### 4.3 `lib/discrimination.ts` (new) — discrimination-trap generator (fix #3; review M9)
Two variants, both `type:'classification'`, `authorMeta.isDiscrimination:true`, correct option **code-selected**,
carrying a real `generator:{templateId,params}` with a registered **verify** truth (§5):
- **cross-op** — surface cues mislead across operations (add-vs-multiply, times-as-many-vs-more-than,
  longer-decimal-vs-larger).
- **within-concept structural** — a same-operation contrast the child must NOTICE (rename-one vs rename-both,
  regroup vs no-regroup, like vs unlike denominators). This is the AUTHENTIC discrimination for fixed-operation
  weeks (D17-D3-05 "Notice the difference from the others!") and BB-W5 explicitly blesses it.
Must appear in Days 2–3 core (§6.3).

### 4.4 `lib/erroranalysis.ts` (new) — error-analysis generator (fix #7; closes the W6/W8 bug class; review M7,M8,M10)
Emits `type:'error-analysis'`, **`strand:'noncomputational'`** (so it couples the two strands — review M7), with:
a worked solution containing a **generated** bug, "find the error, explain in ruled lines, give the true answer,"
plus an **extension prompt**. The bug number = a named misconception transform applied **by code** to the
code-computed correct answer; the true number = the code-computed answer. It carries a real
`generator:{templateId,params}` with a registered **verify** truth. Therefore the "wrong" number is a real
misconception output and the "true" number cannot be fabricated → **the D6 (keyed a wrong answer correct) and
D8 (invented 674) classes become structurally impossible for this item type.** Required once per D-week (§6.7).

### 4.5 `lib/metacog.ts` (new) — metacognition weaver (fix #8; review M3, M8)
`withEstimateFirst(gen)`, `withReasonableness(gen)`, `withCheckBack(gen)` wrap a core generator: prepend an
estimate/benchmark prompt or append a plug-back check, set `authorMeta.isMetacog:true`. **All work inside the
returned closure (model on `asWarmup`); NO wrap-time or new rng draw.** Benchmarks are **VERBAL — inject no
numeric tokens** (e.g. "estimate against one half first"), so the surface signature is unchanged and QG-1/QG-4
hold (review M3). Must land on ≥1 Day 2–4 core item AND estimate-first must ALSO be modeled in ≥1
`explanation.script` segment (raises the W12 ceiling — review M8, m2).

### 4.6 `lib/items.ts` (changed) — authorMeta + orient→locate hints (fix #5; review M1, determinism-major)
Every generator (a) stamps `authorMeta` (default `stepCount:1` + its `cognitiveOp`), and (b) emits an
orient→locate ladder chosen by **pure param-keying, no new rng draw**. Rung-1 is an **orienting question that
contains no imperative algorithm verb** (not merely "ends in ?"). Provide `orientLocate(orientQ, locateHint,
workedIso?)`. These are Tier-A global changes (§2).

## 5. `compute.ts` / `registry.ts` — answers AND verify truths (review B1, B5, determinism-minor)

- **New `answerFor`** for every new computational/multi-step template (`d_multistep_*`, situation-backed
  templates). Each multi-step `answerFor` shares the exact composition code with its generator.
- **New `verifyFor` registry** for embedded-claim items (discrimination + error-analysis). Keyed by templateId,
  it recomputes the truth from **plain serializable `generator.params`** (e.g. `d_div_verify_v1
  {a:29,b:4,claimedQ:7,claimedR:3}` → recompute `7 R 1` → the claim "7 R 3" is false → the correct option is
  "no, 7 R 1"). QG-11(a) calls `verifyFor` exactly as QG-5 calls `answerFor`. **No closures, nothing to strip;
  params already ship in `generator`.** Generated items pass by construction because the generator selects the
  correct option by the same code.
- **Verify assertion (new):** every emitted computational item's `generator.templateId` must resolve in the
  registry (an unregistered/typo'd id silently skips the QG-5 audit — review determinism-minor).

## 6. Assembler pedagogical preflight gates (`lib/assemble.ts`) — enforced when `pedagogyContract==='v2'`

Gates treat **missing `authorMeta` defensively** (undefined ⇒ single-step, its own cluster) so they cannot
crash on a partially-stamped week (review M1). Thresholds calibrated to **ACCEPT a D17-equivalent, not exceed
it** (review B6, M4). Each throws a precise `D<week>: …`.

1. **Multi-step density — WEEK-WIDE + concept-conditional (BB-G7; review B6).** Measure genuine multi-step
   (`stepCount≥2`) across all **non-retrieval core** items, not the Day-4 slot alone.
   - **operation-family** concepts (D4, D5, D6, D7, D8, D10, D11, D14, D15, D16, D18, D19, D20, D21): **≥2**
     genuine multi-step week-wide, **≥1 of them on Day 4**.
   - **place-value / classify-family** concepts (D1, D3, D9, D12, D13, D22, D23, D24): **≥1** genuine
     multi-step week-wide; where a within-concept 2-step is impossible (D1 place value to 1,000,000; D13
     decimal place value), the week must **compose the concept with a declared strictly-prior-week op**
     (`usesPriorSkill:true`) and document it in `deepeningDelta`. A `word-problem` on Day 4 with `stepCount:1`
     counts as drill and does not satisfy this gate. (This matches D17: one two-step on Day 4 + multi-addend /
     mixed-regroup elsewhere = genuine week-wide density.)
2. **Anti-drill cluster floor (BB-G5).** Cluster non-retrieval core items by `(cognitiveOp, stepCount)` — keys
   from the **registered** op class, not free text. Require **≥2 distinct solution structures**; THROW if the
   whole non-retrieval pool collapses to one one-step op.
3. **Discrimination by Day 3 (BB-W5; review M9).** **≥1 `isDiscrimination` item (cross-op OR within-concept
   structural) among Days 2–3 core.**
4. **Modeled think-aloud + fade (BB-W2; review M4, M8).** `guidedExamples[0].fadeLevel==='modeled'`, and its
   modeled step(s) contain a genuine first-person narration marker (from a set like `I can't / I'm stuck /
   I need / watch / notice / on purpose / the trick / let me / first I'll try`) AND are longer than a bare
   `A op B = C` (a bare rule+answer THROWS). A **predict-pause** exists = a modeled `teacherSay` that states an
   `expected` value/prediction, OR a step with `childDo`+`expected`, OR a `?` in a modeled `teacherSay` (this
   set is calibrated so a **D17-GE-01 clone PASSES** — locked by a unit test over the D17 fixture GEs). A
   `'completion'`-tier GE must exist.
5. **Hint-ladder linter (BB-W3).** Rung-1 of every non-retrieval item must be an orienting question that
   **contains no imperative algorithm verb** ("Line up the places, right?" FAILS despite the "?"). No identical
   joined hint-ladder on **> 2** non-retrieval items (verbatim-dedup).
6. **Situation variety (BB-W5).** **≥3 distinct `situationType`s** among word-problem items, differing in
   operation/step-structure, not only enum tag.
7. **Error-analysis present (BB-W7).** **≥1 `type==='error-analysis'`** item, `strand:'noncomputational'`,
   with a ruled/manual-review answer field + extension prompt + a `verifyFor` truth.
8. **Metacognition woven (BB-W12; review M8, m2).** **≥1 `isMetacog` item in Days 2–4 core** AND estimate-first
   modeled in **≥1 `explanation.script` segment**.
9. **Concept-first "why" (BB-W1; review B7).** THROW unless `explanation.whyBeforeHow` (a) contains a causal
   marker (`because/since/so that/that is why/the reason`) **before its first imperative sentence**, and (b)
   names the blueprint's declared `conceptualAnchor` (a required v2 blueprint string naming the concrete
   model/idea, e.g. "unit-brick", "bar model", "four rooms"). This is a floor, not a guarantee — W1 is a
   §11 DoD spot-check too.
10. **Puzzle remove-the-concept (BB-G7 second prong; review M5).** THROW if the puzzle's `(cognitiveOp,
    stepCount)` equals any Day-1 core item's — the puzzle must apply the concept a genuinely new way.
11. **Voice / praise linter (BB-W9/G9; review M6).** THROW on speed/trait/generic praise tokens (`fast, record,
    smart, genius, clever, good job, great!`) in any child/parent-facing praise string; require
    `homeFocus.praiseLine` to name an observable strategy move.
12. **Dual-strand coupling (BB-G2; review M7).** **≥1 non-comp item demands justification** (manual-review /
    explanation answer OR `stepCount>1`) coupled to the week concept. (The §6.7 error-analysis item satisfies
    this.)
13. **Ledger precondition (BB-G1/G8; fix #9).** Builder requires a `priorLedger` (§8). If the concept shares a
    family with a prior week (`priorSameFamily` non-empty), the blueprint must supply a non-empty
    `deepeningDelta`; THROW if absent.

Existing mechanical preflight (retrieval share, dose, distractor-tag coverage) stays and runs for v1 + v2.

## 7. Validator — QG-11 (`validator.ts`, fix #6). BLOCKS for v2 packs; report-only for v1 + fixtures (review B2,B3,B4,M10)

- **(a) Claim / answer-key audit.** For any item with a registered `verifyFor` (discrimination / error-analysis),
  recompute the truth from `generator.params` and assert the option keyed `isCorrect:true` matches. Catches the
  D6 class. **Embedded-claim detector** (v2 hard-FAIL if an item asserts a specific worked result but lacks a
  `verifyFor`): recognizes `A <op> B = C`, **remainder notation `q R r`**, and **verbal claims**
  (`wrote|got|claims|says … <number>`) — the exact forms of the live d06 ("wrote 7 R 3") and d08 ("got 674")
  bugs. In v2, hand-authored `classify()`/`reasoning()` items with an embedded numeric claim are **forbidden**;
  use the generated `discrimination.ts`/`erroranalysis.ts` primitives (which carry a `verifyFor`). Regression
  tests assert the detector flags the d06/d08 items.
- **(b) Prose anchor audit — robust matcher (review B3).** Scan `explanation.script[].say`, `explanation.summary`,
  `guidedExamples[].steps[].teacherSay`, and puzzle prose. **Parse each candidate into a FULL expression**
  (multi-term, left-assoc, parentheses; fraction / mixed-number / decimal / `q R r` aware) and flag ONLY when
  the whole LHS evaluates exactly to a **bare literal RHS**. **Carve-outs:** skip any equation inside a
  `mistakeBank[].description`/`distractorRationale`/`exampleWrongAnswer`, a `choices[].rationale`, or an
  `error-analysis`/misconception-labeled item (these legitimately state wrong equations); skip pure equivalence
  lines with no binary op (`1/2 = 3/6`); skip operands/RHS carrying an unparsed unit word ("3 + 2 sixths = 5/6");
  skip en-dash ranges (`20–30%`, `6/6/6/4/4`) and id hyphens (`D17-GE-01`); accept `x` as multiply only when
  digit-flanked with spaces. **Close the false-negative:** recompute `"Check with <expr>"`-style hints against
  the item's OWN answer even with no `=` (catches the live d06 `"Check with 7 × 4 + 3"` → 31≠29). Pin
  A15/B14/D17 as a must-pass regression set.
- **(c) Reteach-pointer resolution (review B4).** A pointer must resolve **only if it contains a structured
  reference token** (`script[i]` / a `GE-id` / `Day-N` / `explanation` / `guidedExamples`); purely descriptive
  pointers ("60-second × fact refresh; feeds the sprint pool") PASS. FAIL only a structured token that does not
  resolve. (Keeps D17/d04/d06 green.)

## 8. Prior-week concept ledger (fix #9) — `lib/ledger.ts` (BUILT)

`priorLedger(level, week)` → every strictly-earlier cell `{level, week, conceptId, conceptName, band,
computationalFocus, noncomputationalFocus}` from `content/catalog.ts`. `priorSameFamily(level, week,
conceptId)` powers §6.13. Threaded as a REQUIRED input to `makeWeekBuilder` (v2) and passed as input (c) to the
style-gate run. `deepeningDelta` documents the explicit advance vs a shared-family prior week.

## 9. Per-week blueprint authoring contract (checklist each v2 week satisfies)

- [ ] `pedagogyContract: 'v2'`; `conceptualAnchor` set; `priorLedger` passed; `deepeningDelta` when shared-family.
- [ ] **Narrated modeled GE** (`guidedExamples[0]` modeled, genuine first-person think-aloud + predict-pause;
      a `completion` tier exists; monotonic fade to `independent`) — model on D17-GE-01..05.
- [ ] **Multi-step**: week-wide density per §6.1 (operation-family ≥2 incl. ≥1 on Day 4; place-value-family ≥1
      or compose-with-prior-op). No Day-4 item is one-step-with-a-name.
- [ ] **≥3 distinct `situationType`s** differing in structure.
- [ ] **≥1 discrimination trap** (cross-op or within-concept structural) in Days 2–3.
- [ ] **≥1 error-analysis item** (generated; `verifyFor`; ruled answer + extension; `noncomputational`).
- [ ] **Metacognition** woven into ≥1 Day 2–4 core item AND modeled in ≥1 `explanation.script` segment.
- [ ] **≥2 distinct non-comp reasoning FORMS on Day 5** (review m2).
- [ ] **Hints** orient→locate, rung-1 an algorithm-free orienting question, no ladder repeated > 2×.
- [ ] **`whyBeforeHow`** has a causal clause before the first imperative + names the `conceptualAnchor`.
- [ ] **Praise** names a strategy move; no speed/trait/generic tokens.
- [ ] **Distractors** each equal their named misconception's output; each rationale maps to a named mistakeBank
      **subtype** (review m2); every structured `reteachPointer` resolves.
- [ ] Correctness gate GREEN × 5 seeds; QG-11 clean; no `authorMeta` leaks into the shipped pack.

## 10. The 9 recommended fixes → this spec (traceability)

| # | Recommended fix | Realized here |
|---|---|---|
| 1 | Multi-step synthesizer + drill guard | §4.2 `multistep.ts` (code-derived stepCount) + §6.1 week-wide quota |
| 2 | Situation library | §4.1 `situations.ts` + §6.6 (structure-distinct) |
| 3 | Discrimination-trap injector | §4.3 (cross-op + within-concept) + §6.3 |
| 4 | Modeled-example template + lint | §4.6 + §6.4 (D17-calibrated) |
| 5 | Hint-ladder linter | §4.6 (pure param-keyed) + §6.5 |
| 6 | Distractor + answer-key + anchor verifier | §5 `verifyFor` + §7 QG-11(a/b/c) |
| 7 | Error-analysis item type | §4.4 (`noncomputational`, generated) + §6.7 |
| 8 | Metacognition weaver | §4.5 (verbal, closure-safe) + §6.8 |
| 9 | Ledger pipeline | §8 `lib/ledger.ts` (BUILT) + §6.13 + `deepeningDelta` |

## 11. Definition of done (this rebuild phase)

1. **Correctness gate GREEN** (`npx tsx scripts/bb-verify-packs.ts`) after **every** commit and with all 23
   Level-D weeks `v2`; the new **no-authorMeta-leak** and **templateId-resolves** assertions pass; A15/B14/D17
   never fail QG-11.
2. `npx tsc --noEmit` clean; `npm run build` clean.
3. **Style gate re-run on Level D (D01–D24):** hard floor = **no hard-gate FAIL, every generated week
   HUMAN_REVIEW-or-better, D17 stays ACCEPT/HUMAN_REVIEW**; **target = ≥80% clean-ACCEPT** (adversarially
   confirmed) — the go/no-go for the fill (the handover mandate). Preflight-pass is a necessary screen; the
   measured re-gate is the decision (§1).
4. Meta docs (PROGRESS / DECISIONS / LEARNINGS / HANDOVER) updated; pathspec-only commit.
5. Only then: merge branch + authorize the 111-week fill (a separate, later decision).

## 12. Build order (de-risked, exemplar-first)

1. Tier-A foundation: `lib/meta.ts`; `authorMeta` + orient→locate hints across `lib/items.ts`;
   strip-by-whitelist in `shared.ts`; verify assertions (no-leak, templateId-resolves). **Gate: correctness
   GREEN, v1 output bit-stable.**
2. Library primitives: `situations.ts`, `multistep.ts`, `discrimination.ts`, `erroranalysis.ts`, `metacog.ts`
   + their `answerFor`/`verifyFor` registrations.
3. Assembler §6 gates (behind `v2`) + QG-11 §7 (blocking for v2, report-only for v1/fixtures) + the D17 GE /
   fixture regression tests.
4. **Rewrite D4 as the exemplar `v2` week; prove BOTH gates** (correctness + a style-gate run). Iterate the
   contract if the exemplar can't reach ACCEPT/HUMAN_REVIEW.
5. Fan out the remaining 22 blueprints under the frozen contract; re-gate all 24 to §11.3.
