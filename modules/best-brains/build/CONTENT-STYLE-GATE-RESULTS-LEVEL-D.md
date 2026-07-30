# Content Style-Gate Results — Level D (24 weeks)

_Best Brains authenticity / anti-drift style gate applied to all 24 generated Level-D content packs (D01–D24). Two-stage pipeline: base **scorer** (weighted rubric + hard gates) then adversarial **anti-drift re-check** of every scorer-stage pass. Analysis run: workflow `wf_9b608910-d16` (37 agents). This document records the verdict, per-week detail, the recommended generator fixes, and two independent trust-checks on the FAIL verdict._

---

## Verdict headline

**engineAuthenticityVerdict = FAIL.**

| Outcome | Count | Weeks |
|---|---|---|
| **ACCEPT** (clean, adversarially confirmed) | **1** | W7 |
| **HUMAN_REVIEW** | **1** | W17 (the hand-authored calibration fixture) |
| **REJECT** | **22** | all others |
| **False passes caught by the adversarial stage** | **11 of 12** scorer-stage passes overturned | W1, W9, W10, W11, W12, W14, W15, W17, W18, W19, W24 |

Only **1 of 24** generated weeks (W7) is a clean, adversarially-confirmed ACCEPT — a **~4% authentic-pass rate**. The base scorer passed 12 weeks; the adversarial anti-drift gate overturned 11 of them, meaning the scorer was systematically fooled by presentation polish (clean 5-day arcs, fade tiers, hint ladders, mistakeBanks) into rating drill content as authentic. Weighted means cluster at the 3.4–3.9 line only because clean "furniture" criteria mask depth-subset means sitting at or below the 3.0 floor.

Note: W17 is **not** a generated pack — it is the hand-authored reference fixture used to calibrate this gate (see "Gate Calibration" below). Excluding it, the generator produced **exactly one** acceptable week out of 23.

---

## Per-week results

Adv-Final = adversarial final verdict (the binding one). wMean = weighted composite mean (accept floor 3.5). depthMean = depth-critical subset {W1..W5} mean (floor 3.0). Hard gates: FAIL forces REJECT; BORDERLINE routes to human review.

| Wk | Concept | Adv-Final | wMean | depthMean | Hard FAIL | Hard BORDERLINE |
|---|---|---|---|---|---|---|
| 1 | Place value to 1,000,000 | **REJECT** | 3.71 | 3.6 | — | — |
| 2 | Multi-digit add & subtract fluency | **REJECT** | 3.36 | 2.8 | G7 | G5 |
| 3 | Factors, multiples & primes | **REJECT** | 3.43 | 3.4 | G7 | — |
| 4 | Multiplicative comparison | **REJECT** | 3.43 | 3.2 | G7 | — |
| 5 | Area-model multiplication | **REJECT** | 3.43 | 2.8 | G7 | — |
| 6 | Division with remainders | **REJECT** | 3.50 | 2.8 | — | G5 |
| 7 | Interpreting remainders | **ACCEPT** | 3.86 | 4.0 | — | — |
| 8 | Two-digit × two-digit multiplication | **REJECT** | 3.57 | 3.0 | G7 | — |
| 9 | Fraction equivalence & comparison | **REJECT** | 3.36 | 3.0 | — | G1, G7, G8 |
| 10 | Add/sub fractions (like denominators) | **REJECT** | 3.71 | 3.4 | — | — |
| 11 | Fraction × whole number | **REJECT** | 3.86 | 3.4 | — | — |
| 12 | Meeting decimals | **REJECT** | 3.64 | 3.6 | — | G7 |
| 13 | Decimal place value to thousandths | **REJECT** | 3.36 | 3.2 | G7 | G1 |
| 14 | Add/sub decimals | **REJECT** | 3.86 | 3.4 | — | G7 |
| 15 | Multi-digit multiplication fluency | **REJECT** | 3.64 | 3.2 | — | G7 |
| 16 | Division with 2-digit divisors | **REJECT** | 3.86 | 3.6 | G7 | — |
| **17** | **Add/sub fractions (unlike denom.) — HAND-AUTHORED FIXTURE** | **HUMAN_REVIEW** | **4.93** | **4.8** | — | — |
| 18 | Multiplying fractions | **REJECT** | 3.43 | 3.0 | — | G5, G7 |
| 19 | Dividing with unit fractions | **REJECT** | 3.86 | 3.8 | — | G7 |
| 20 | Multiplying & dividing decimals | **REJECT** | 3.79 | 3.4 | G7 | — |
| 21 | Order of operations & expressions | **REJECT** | 3.43 | 3.4 | G7 | — |
| 22 | Coordinate plane (Q1) & patterns | **REJECT** | 3.57 | 3.6 | G7 | G1, G5 |
| 23 | Angles & shape hierarchies | **REJECT** | 3.36 | 3.0 | G7 | G1 |
| 24 | Volume + Ready for Level E | **REJECT** | 3.64 | 3.4 | — | G1, G7 |

**Read of the table:** the reference fixture (W17) is a clear outlier at 4.93 / 4.8; the entire generated corpus sits in a tight 3.36–3.86 band. **BB-G7 (multi-step word-problem share)** is the decisive gate — 11 hard FAILs plus 7 borderlines, implicated in 18 of 24 weeks. Every generated pack that "cleared" the scorer did so on furniture criteria while its depth subset sat at or under the floor.

---

## Weakest hard gates (from synth)

1. **BB-G7 — Level-D multi-step word-problem share.** The dominant failure mode: **11 hard FAILs + 7 borderlines = implicated in 18 of 24 weeks.** The single decisive gate for the level.
2. **BB-G1 — concept newness / deepening.** Borderline in 5 weeks, driven structurally because the **prior-week concept ledger was never supplied** (unadjudicable → forced route-to-human, never auto-pass).
3. **BB-G5 — anti-drill cognitive density.** Borderline in 4 weeks (W2, W6, W18, W22); passes elsewhere only because Day-5 / puzzle items rescue an otherwise drill-collapsed Day-1–4 body.
4. **BB-G8 — skill-instance retrieval.** Borderline (W9); also a casualty of the missing ledger.

## Weakest weighted criteria (from synth)

- **W5 (interleaving / genuine discrimination trap)** — the most pervasive depth failure: scored 2 in W4/5/6/8/11/13/15/18 and 3 nearly everywhere else. Word problems are one template with the noun swapped; no add-vs-multiply / operation-choice trap.
- **W2 (guided-example modeled think-aloud)** — near-universally 3: the "modeled" GE-01 is a terse rule + answer with no first-person think-aloud, no predict-pauses, often no completion-tier fade.
- **W3 (hint-ladder gradient)** — repeatedly 2–3: boilerplate copy-pasted across ~20 items with rung-1 stating the algorithm instead of orienting/locating.
- **W4 (distractor faithfulness & answer-key correctness)** — outright broken in several weeks: mislabeled misconception distractors (W9, W12, W23) and hard arithmetic bugs including **W6 grading the correct answer wrong** and **W8's fabricated anchor number**.
- **W7 (Level-D error-analysis strand)** — the D-band "analyze a worked error / two approaches with ruled argument lines" signature is absent or off-form across W1, W11, W13, W19, W20, W24.
- **W12 (metacognition / reasonableness)** — estimate-first / check-back confined to warm-up hints, not woven into the core Day-2–4 concept work (W12, W13, W19, W21, W22).

---

## Common weakness patterns & systemic diagnosis

The corpus exhibits a **single systemic signature: structurally polished, pedagogically hollow.** Recurring patterns in order of prevalence:

1. **Day-4 drill disguised as application** — the "word-problem" day is bare computation or single-step "one-step arithmetic with a name attached," 0% multi-step share. This is the #1 cause of rejection and the exact pattern the hardened G7 targets.
2. **Noun-swap camouflage** — Days 1–4 are one template re-numbered (pencils/apples/muffins; Zoe/Maya/Ria), no context-type variety and no operation-discrimination trap, so the child never decides which operation applies (drives W5=2 and G5 borderline).
3. **Thin modeled fade** — "modeled" guided examples state the rule + answer with no first-person narration or predict-pauses; the fade is structural only (W2).
4. **Boilerplate tell-y hints** — identical 2-rung ladders pasted across ~20 items; rung-1 states the algorithm (W3).
5. **Defective correction material** — mislabeled misconception distractors that would select the correct answer, dangling reteachPointers, and genuine arithmetic bugs incl. a keyed answer that grades a correct child wrong (W6) and a fabricated anchor product (W8).
6. **Missing D-band furniture** — no true error-analysis strand (W7); metacognition exiled to warm-ups (W12).
7. **Ledger absence** — no prior-week concept ledger supplied, making G1/G8 unadjudicable across the level.

The anti-drill spread that lets weak weeks scrape the numeric floors is carried almost entirely by Day-5 + puzzle items while Days 1–4 collapse to one cognitive cluster.

**Diagnosis:** the failure is not idiosyncratic per-week noise but one reproducible generator behavior — it manufactures band-appropriate surface structure (5-day arc, fade tiers, hint ladders, mistakeBanks) while defaulting every application item to a single-step noun-swap, which fails the defining Best Brains Level-D demands: multi-step word-problem load (G7, 18/24 weeks), genuine within-concept discrimination (W5), narrated modeling (W2), and error-analysis (W7). **Content this uniform in its shortfall cannot be spot-fixed per week — the generator must change before the 111-week fill.** The QC pipeline itself (scorer + adversarial anti-drift gate) is validated and should be retained; it correctly quarantined the corpus.

---

## Recommended GENERATOR fixes (from synth.recommendedFixes)

> **Fix the generator/library first; do not hand-patch weeks.**

1. **Multi-step word-problem synthesizer** _(kills G7, the dominant failure)_ — add a required item type that composes ≥2 operations over a real context; enforce a Day-4 quota of **≥2 genuine multi-step problems OR ≥25% multi-step**, and add a **pre-emit validator** that classifies any "one-step arithmetic with a name attached" as drill and rejects the pack — the same guard the adversarial stage uses, moved upstream.
2. **Situation library, not a noun list** — replace the noun-swap bank with a taxonomy of distinct **situation types** (rate, area, sharing, comparison, measurement, money-with-change) and require **≥3 distinct types per week**; forbid reusing one template with only the proper-noun/operand changed.
3. **Discrimination-trap injector** — for every concept, auto-insert contrasting items whose surface cues mislead (add-vs-multiply, times-as-many-vs-more-than, longer-decimal-vs-larger) so **W5 exercises operation choice by Day 3.**
4. **Modeled-example template** — mandate first-person think-aloud with explicit **predict-pause slots** and a **completion-tier fade rung**; lint any GE that is a bare rule + answer (raises W2).
5. **Hint-ladder linter** — reject rung-1 text that states the algorithm; require **orient → locate → worked-isomorph** progression, and de-duplicate verbatim ladders across items (raises W3).
6. **Distractor + answer-key verifier** _(highest-severity correctness fix)_ — generate each distractor by applying the named misconception transform and **assert distractor ≠ keyed correct answer** (catches W9/W12/W23 mislabels); run **every keyed answer AND every in-text anchor number** through an arithmetic checker in CI (catches the W6 correct-graded-wrong bug and the W8 fabricated product); resolve or drop every reteachPointer against the pack's actual segment ids.
7. **Error-analysis item type** — add a first-class "analyze-a-worked-error" generator with ruled written-argument lines + an extension prompt, **required once per D-band week** (raises W7).
8. **Metacognition weaver** — inject estimate-first / reasonableness / plug-back checks into **Day-2–4 core items**, not just warm-ups (raises W12).
9. **Ledger pipeline** — make the prior-week concept ledger a **required generator input and a gate precondition** — without it, G1/G8 must route to human, never auto-pass.

> After the fixes, **re-run the full validated scorer + adversarial pipeline on regenerated W1–W24 and require the clean-ACCEPT rate to clear a threshold (e.g. ≥80%) before authorizing the 111-week fill.**

---

## GATE CALIBRATION (D17 fixture)

**Purpose of the check:** W17 (D17) is a **hand-authored reference pack** — written to be authentically Best Brains and used to calibrate this very gate during its derivation. If the gate had *rejected* its own hand-authored reference, the gate would be over-strict (false-fails), and the "generator is broken" conclusion would be partly the gate's fault. If the reference passed, the gate is well-calibrated and the generated content is genuinely hollow.

**D17's exact verdict:**
- **Scorer stage: ACCEPT** — weightedMean **4.93**, depthSubsetMean **4.8**, zero hard-gate fails, zero borderlines.
- **Adversarial stage: HUMAN_REVIEW** (`adversarialFoundFalsePass = true`, downgraded one notch from ACCEPT).

**D17 was NOT rejected → the gate is WELL-CALIBRATED. This is the "trust the FAIL" case.**

Supporting evidence (I opened D17.json and confirmed the reference genuinely contains the D-band furniture the generated packs lack):
- **Genuine multi-step word problem** — `D17-D4-03`: "A tank held 7/8 gallon; 1/2 gallon was used, then 1/4 gallon was poured in. How much is in the tank now?" (two operations: 7/8 − 1/2 + 1/4). The generated packs' Day-4 items are 0% multi-step.
- **Narrated think-aloud modeling** — `D17-GE-01` (modeled tier): "Direct adding fails: the pieces don't match, so there is nothing to count. **I need same-size pieces.**" — a first-person strategic narration, versus the generated packs' terse rule+answer GEs.
- **First-class error-analysis item type** — `D17-D5-01`: "Jo claims 1/3 + 1/4 = 2/7. Draw or describe a picture that PROVES Jo wrong, then write the true sum. (Written explanation required.)" `type: "error-analysis"`. This is exactly the W7 D-band signature that is **absent** from the generated corpus.

The separation is decisive: D17 scores **4.93 / 4.8** while the entire generated corpus sits in a tight **3.36–3.86** band. The gate cleanly passes its authentic reference and rejects the hollow generated content. **The FAIL verdict is trustworthy.**

**One calibration caveat (a minor tuning note, not a reason to distrust the FAIL):** the adversarial stage downgraded even D17 from ACCEPT to HUMAN_REVIEW, on the grounds that the **Day-4 multi-step share sits exactly at the 25% threshold** (only D4-03 is strictly two-step among four Day-4 items) and that a few easy items carry thin single-rung hints (W3 unevenness). The pack clears because week-wide multi-step density (three-addend, mixed-number regrouping, the tank problem) is genuine — but the adversarial **G7 Day-4-slot clause dinged a genuinely rich, hand-authored pack**. That indicates the adversarial G7 clause is *slightly* aggressive on the Day-4 slot specifically; it should measure **week-wide multi-step density**, not only the Day-4 slot, so it does not one-notch-penalize authentic packs. This is a small refinement to the adversarial G7 clause, **not** a false-fail (D17 was never rejected) and does not change the corpus verdict.

---

## CORRECTNESS-VALIDATOR COVERAGE HOLES (D06 / D08 findings)

The generator's correctness validator **QG-5** audits each item's keyed answer via a code-computed `answerFor`, so a wrong *computational item key* should be impossible. The style judges nonetheless flagged apparent arithmetic/answer-key bugs. I opened D06.json and D08.json and checked the cited items directly. **Both bugs are REAL** — and both fall in a **coverage HOLE**: QG-5 audits the keyed answer of a *computational* item, but does **not** audit (a) the internal arithmetic of a "classification / analyze-this-worked-answer" item, nor (b) narrative/anchor numbers baked into prompt prose, mistakeBank examples, hint text, or parent copy.

### W6 (D06) — REAL bug: correct child graded wrong

Item `D6-D5-02` (`type: "classification"`, `validation: "choice-key"`):
- **Prompt:** "29 cookies shared among 4 children. A student wrote 7 R 3. Is that right?"
- **True arithmetic:** 29 ÷ 4 = **7 R 1** (7×4 = 28, 29 − 28 = 1).
- **Keyed answer:** `answer.value = "B"`; choice **B "yes, 7 R 3 is correct"** carries `isCorrect: true`.
- Choice **C "no, it should be 7 R 1"** is keyed `isCorrect: false`, with a rationale that calls the *correct* subtraction a slip: _"Miscomputes the leftover (29 − 28 = 1 is a subtraction slip)."_
- **Corroborating defect:** the hint ladder says _"Check with 7 × 4 + 3"_ — but 7×4+3 = **31 ≠ 29** (the correct check is 7×4+1 = 29).

So the pack **affirms the wrong answer (7 R 3) as correct and marks the truly correct answer (7 R 1) as wrong** — a child who answers correctly is graded wrong. This is the pack's only MC/distractor item, so it collapses W4. **Verdict: REAL, not a judge misread** (the judge's description is precisely accurate).

**Why QG-5 missed it — coverage hole:** the keyed answer is a choice-key ("B"), and the correctness of that choice hinges on evaluating the embedded claim "7 R 3" against 29 ÷ 4. QG-5's `answerFor` validates *computational* keyed answers, not the embedded-claim logic of a "is this worked answer right?" verification/classification item — so it never reconciles the labeled-correct option against the true quotient. **Classification / verify-a-worked-answer items are not arithmetic-audited.**

### W8 (D08) — REAL bug: fabricated anchor number, propagated

Item `D8-D5-02` (`type: "classification"`):
- **Prompt:** "A student multiplied 32 × 21 and **got 674** by using only 30×20, 2×20, and 2×1. Which partial went missing?"
- **True arithmetic:** the three rooms used sum to 600 + 40 + 2 = **642**; the full correct product is 32 × 21 = **672** (the missing room 30×1 = 30 makes 642 + 30 = 672). **674 is neither 642 nor 672 — it is fabricated.**
- The *pedagogical* keyed answer is fine: choice **B "30 × 1 (the tens-times-ones room)"** is correctly keyed as the missing partial.
- **The fabricated 674 propagates:** `mistakeBank[0].exampleWrongAnswer = "32 × 21 → 674 (missing 30 × 1)"`, and `parentSummarySeed.homeFocus.praiseLine` = "You caught the missing room in 32 × 21 …". Choice A also embeds "none — 674 is correct."

**Verdict: REAL, not a judge misread.** The keyed answer is correct, but the anchor number the whole item is built on is invented and then repeated in the mistakeBank and the parent praise line.

**Why QG-5 missed it — coverage hole:** QG-5 validates the keyed choice (B, which is correct → passes), but it does **not recompute narrative/anchor numbers embedded in the prompt prose, mistakeBank example strings, or parent copy.** The fabricated "674" lives entirely in un-audited free text.

### Net finding on coverage holes

Both cited bugs are real defects, and neither is the kind QG-5 was built to catch. **QG-5 has two coverage holes:**
1. It does not arithmetic-audit **classification / "analyze-a-worked-answer" items** — the embedded claim number and which option is labeled `isCorrect` (the W6 class of bug, where the keyed answer is itself wrong).
2. It does not audit **anchor/narrative numbers** in prompt prose, hint ladders, mistakeBank `exampleWrongAnswer`, distractor text, or parent `praiseLine` (the W8 class of bug, where the keyed answer is right but a story number is fabricated and propagates).

This is exactly the scope that **recommended generator fix #6** must close: "run every keyed answer **and every in-text anchor number** through an arithmetic checker in CI," extended to cover verification/classification item types and all propagated copy.

---

## Bottom line

**Fix the generator — that is the primary action; the gate is trustworthy.** The D17 calibration fixture passed (ACCEPT → HUMAN_REVIEW, never rejected) at 4.93/4.8 against a generated corpus stuck at 3.36–3.86, so the FAIL is real and the content is genuinely "structurally polished, pedagogically hollow" — not a false-fail artifact of an over-strict gate. Execute the 9 generator fixes (chiefly the multi-step word-problem synthesizer + upstream drill guard, the situation library, the discrimination-trap injector, and an expanded QG-5 that also audits classification-item arithmetic and in-prose anchor numbers) and re-run the same validated pipeline, requiring ≥80% clean-ACCEPT before the 111-week fill. The only gate-side action is a **minor** softening of the adversarial G7 Day-4-slot clause (score week-wide multi-step density, not just the Day-4 slot) so it stops one-notch-dinging genuinely rich packs like D17 — a tuning refinement, not a recalibration that changes any corpus verdict.
