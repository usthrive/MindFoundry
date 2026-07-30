# Best Brains — Content Generation Plan & Reusable Capability Spec

**Status:** Level D fully generated + validated (proof). Engine + template library live.
**Author:** Content-Generation Architect pass, 2026-07.
**Scope:** the system that fills the missing 111 of 120 concept cells with
correctness-guaranteed content, the reusable infrastructure that makes it
tractable, and a proof that it works end-to-end on one complete level.

> Written as a **portable capability spec** (not only a Best Brains note): the
> "engine capability" section is reusable by any future curriculum-content build.

---

## 1. The engine capability (reusable pattern)

**Problem shape.** A curriculum needs thousands of practice items across many
concepts, at many difficulties, each with a teacher explanation, hints,
distractors, a mastery check with parallel forms, and a spaced-review schedule —
and **the answer key must never be wrong**. Naively asking an LLM to emit
question+answer JSON fails on correctness (LLMs miscompute), cost (per-item
inference at runtime), and reproducibility (non-deterministic output).

**The pattern that solves it — "deterministic templates + code-computed answers
+ validation gates + one-time AI authoring."**

1. **AI never asserts an answer.** Every item's final answer is produced by a
   deterministic `answerFor(params)` function written in code. The AI's job is
   the *question structure* and the *language* — teacher scripts, hint-ladder
   wording, word-problem phrasing, puzzle design, distractor rationales — never
   the numeric/final answer. A wrong answer key becomes *structurally
   impossible*.
   - Realized here as a **single source of truth**: `lib/compute.ts` holds one
     `compute*` function per skill; the item generator calls it to fill
     `answer.value`, and the validator's QG-5 arithmetic audit calls the *same*
     function (via the template registry) to re-derive it. If the two ever
     disagreed, the pack fails validation and cannot ship.

2. **Determinism.** A pack regenerates byte-identically from
   `(level, week, packSeed, contentVersion)` via a seeded PRNG with per-section
   sub-streams (`rng.ts`). Packs are never stored; they are *recomputed*. Same
   seed → deep-equal pack; different seed → fresh surfaces.

3. **Validation gates as the shipping contract.** Every generated pack must pass
   the existing `validator.ts` (QG-1..QG-10 + structural + the arithmetic
   audit + Form-A/B disjointness) before it ships. A pack that fails is fixed or
   its cell is flagged — never shipped unvalidated. The verify harness runs
   every cell × ≥5 seeds.

4. **AI is used once, at authoring time — not at runtime.** The language a
   concept needs (explanation, guided examples, mistake-bank prose, parent
   summary, puzzle design) is authored once into a compact per-week *blueprint*.
   Runtime is pure, cheap, deterministic code. This is where AI legitimately
   helps: **structure + language + one-time authoring at scale**, never
   arithmetic.

5. **Honesty about the ungradeable.** Concepts whose correctness cannot be
   code-computed (open "explain why", proofs, some geometry-with-figure, open
   design) are represented as `manual-review` or `short-text-keyword` items and
   **flagged for AI-runtime grading** (Haiku 4.5 at runtime, out of scope here)
   — never faked as deterministic.

**Why deterministic beats live-AI (cost & correctness).**

| Dimension | Live-AI-per-item | Deterministic templates (this) |
|---|---|---|
| Answer correctness | LLM can miscompute silently | Code-computed + re-audited → impossible to ship wrong |
| Cost | inference per item served | zero marginal cost; pure function |
| Reproducibility | non-deterministic | byte-identical from a seed |
| Review surface | every item | the template + the blueprint prose, once |
| Latency | network round-trip | synchronous |

**Where the code lives (reusable infrastructure).**

```
generator/
  rng.ts            seeded PRNG, named sub-streams (pre-existing)
  surface.ts        numeric-token / commuted signatures (pre-existing)
  validator.ts      QG-1..QG-10 + arithmetic audit (pre-existing)
  templates/
    shared.ts       makeDay / makeMasteryItems / TupleGuard (pre-existing)
    registry.ts     templateId -> answerFor (extended: spreads lib defs)
    lib/            ★ NEW reusable template library
      compute.ts    single-source-of-truth answers (Frac/Dec exact math)
      guard.ts      drawUniqueItem — QG-1/QG-4 pass by construction
      items.ts      ~40 parameterized item generators (ItemGen factories)
      assemble.ts   makeWeekBuilder(blueprint) + preflight gate
    weeks/dNN.ts    ★ NEW compact per-week blueprints (composition + prose)
```

**How a new week is built now (the tractability win).** A week builder is a
small composition: pick item generators for each day slot + author the concept's
language. The assembler owns every mechanical gate (day skeleton, retrieval
share, dose, Form-A/B pairing, distractor-coverage), so the author cannot get
them wrong — `makeWeekBuilder` throws a precise error at authoring time if a
blueprint drifts out of band. A bespoke week used to be ~500–780 lines; a
blueprint is ~110–170 lines, most of it genuine prose.

---

## 2. Archetype taxonomy

The 120 concept cells group into **14 generation archetypes**. For each: the
item-template design, parameterization + difficulty ramp, the `answerFor`
computation, the Form-B isomorph rule, the distractor/error-tag design, the
band-appropriate presentation, and a **style/authenticity** note (the Best
Brains markers a generated week of this archetype must exhibit — a separate
style gate, being derived in parallel, will score generated weeks against
these).

> Shared rules for **all** archetypes:
> - **`answerFor`** is the sole answer authority; the generator echoes it.
> - **Form-B isomorph rule (QG-4):** Form B reuses the *same generator +
>   difficulty per index* off a separate RNG stream, so type/difficulty/
>   templateId match while operands (and thus prompt + surface) differ. The
>   pack-wide surface guard guarantees disjointness by construction.
> - **Difficulty ramp:** 1–5, band-relative; retrieval warm-ups capped ≤3;
>   the assembler's dose model keeps each day at 5–15 min.
> - **Distractors (QG-3/QG-9):** every MC distractor carries a closed-enum DD7
>   `errorTag` + rationale, computed from the same params; the week's
>   mistake-bank must cover every tag used (preflight-enforced).
> - **Style/authenticity (all):** dual computational + non-computational
>   strands each week; a Day-5 non-computational page; a concept-first "why
>   before how" explanation; non-repetitive variety (fresh surfaces via the
>   guard; no two items sharing an operand tuple); spiral retrieval woven at
>   20–30%; band-appropriate visual→symbolic presentation.

### A1 — Number sense & counting (Level A)
- **Template:** count objects / ten-frames / order / compare small sets;
  read-write numerals. **Params:** count range, arrangement, noun. **answerFor:**
  the cardinality / numeral. **Distractors:** ±1 (skip/double-count),
  space-vs-count. **Presentation:** audio-first, one-operation-per-page, oversized
  targets. **Style:** manipulative-first, warm counting language; Day-5 sort/match.
- Live: `count_objects_v1`, `ten_frame_count_v1`, `numeral_choice_v1` (A1/A2).

### A2 — Single-operation arithmetic ± (regrouping ladder) (A, B)
- **Template:** `a ± b` picture→numeral→column; make-ten; regroup. **Params:**
  operand ranges, crossing-ten flag, model. **answerFor:** `a+b` / `a−b`.
  **Distractors:** carry/borrow drop, off-by-ten. **Style:** base-ten model
  introduced then faded; estimate-first by Level B.
- Live library: `addWhole`, `subWhole` (also serve Level D multi-digit).

### A3 — Multiplicative reasoning / arrays (B, C, D)
- **Template:** arrays / equal groups / "n times as many" / area-model
  multiplication (2–3-digit × 1–2-digit). **Params:** factor ranges, split style.
  **answerFor:** `a*b` (partial-product decomposition preserved in the prompt).
  **Distractors:** missing partial, dropped placeholder zero, add-instead-of-
  multiply. **Style:** array→repeated-addition→× bridge; Day-5 "which shows a×b?".
- Live: `multiply`, `storyMultiply`, `storyMulCompare` (D4/D5/D8/D15).

### A4 — Division & remainders (C, D)
- **Template:** exact division; division with remainder (ordered pair
  "quotient, remainder"); 2-digit divisors via estimate-quotient; interpreting
  remainders (round-up / drop / leftover). **Params:** divisor & dividend ranges,
  interpretation mode. **answerFor:** `⌊a/b⌋, a%b`; interpreted value by mode.
  **Distractors:** remainder ≥ divisor, wrong interpretation, trial-product slip.
  **Style:** sharing model → written method; Day-5 "same numbers, four answers".
- Live: `divideExact`, `divideRemainder`, `storyDivideUse` (D6/D7/D16).

### A5 — Number theory: factors, multiples, primes (C, D, E)
- **Template:** complete a factor pair; kth multiple; prime-vs-composite; GCF/LCM
  (E). **Params:** composite pool, base, k. **answerFor:** `n/f`, `base*k`,
  prime membership (choice). **Distractors:** missed factor, skip-count slip,
  prime/composite mixup. **Style:** rectangles = factor pairs; Day-5 sieve +
  "true for all numbers?".
- Live: `factorPair`, `multipleFill`, `primeChoice` (D3).

### A6 — Large-number place value & rounding (C, D)
- **Template:** expanded↔standard; digit value; compare (<,>,=); round to a
  named place. **Params:** digit count, place, ranges (comma-free surfaces for
  clean tokenization). **answerFor:** value / `digit*10^place` / `roundInt`.
  **Distractors:** face-vs-value, wrong-direction round, period-misread "equal".
  **Style:** ×10 place chart, groups of three; Day-5 "how big is a million?".
- Live: `expandedForm`, `digitValue`, `compareWhole`, `roundWhole` (D1).

### A7 — Fraction operations (C, D, E)
- **Template:** equivalence (scale-both); compare (benchmark / common size);
  ± like & unlike denominators; × whole; × fraction (area square); ÷ unit
  fractions. **Params:** denominator pools, numerators, op, direction.
  **answerFor:** exact rational math (`compute.ts` Frac ops, reduced/mixed).
  **Validation:** `equivalent-fraction` (numeric-value audit → any equivalent
  form passes). **Distractors:** add-the-bottoms, scale-one-only, part-of-a-part
  confusion. **Style:** unit-brick / number-line / area-square models faded
  across the week; Day-5 "refute tops-and-bottoms with a picture".
- Live: `fracEquivFill`, `fracCompareChoice`, `fracAddSubLike`,
  `fracAddSubUnlike`, `fracTimesWhole`, `fracTimesFrac`, `fracDivide` + stories
  (D9/D10/D11/D18/D19; D17 fixture).

### A8 — Decimal operations (D, E)
- **Template:** fraction↔decimal; decimal place value / rounding to thousandths;
  compare; ± (align the point); × whole & × decimal (place-the-point); ÷ whole.
  **Params:** scales, ranges. **answerFor:** exact integer-scaled decimal math
  (`compute.ts` Dec ops — never floats). **Distractors:** longer-is-bigger,
  right-align, point-miscount. **Style:** money / grid models; Day-5
  "why 0.8 > 0.35" and "where does the point go?".
- Live: `decCompareChoice`, `fractionToDecimal`, `decimalToFraction`,
  `decPlaceValue`, `decRound`, `decAddSub`, `decMultiply`, `decDivideWhole` +
  stories (D12/D13/D14/D20).

### A9 — Ratio / rate / percent (E)  *(archetype specified; not yet built)*
- **Template:** equivalent ratios / ratio tables; unit rate & better-buy;
  percent↔fraction↔decimal; percent applications (tax/tip/discount). **Params:**
  ratio pairs, scale, base & percent. **answerFor:** exact ratio/percent math via
  `compute.ts` (percent = `base*p/100` with integer scaling). **Distractors:**
  additive-instead-of-multiplicative, part:part vs part:whole, "40% then 20% =
  60%". **Style:** ratio table as structure-preserving machine; Day-5 "which is
  more lemony?" justification. **Risk:** low — pure arithmetic core.

### A10 — Expressions & equations / order of operations (D, E)
- **Template:** evaluate with/without parentheses; words→expression (choice);
  one/two-step equations (E); inequalities (E). **Params:** operands, structure.
  **answerFor:** evaluate the parsed expression; equation solution by inverse.
  **Distractors:** left-to-right slip, ignore-parentheses, phrase-reversal.
  **Style:** balance-scale model for equations; Day-5 insert-parentheses / error
  analysis. **Risk (E equations):** medium — solution is computable; some E
  "both students right?" items are Day-5 reasoning.
- Live: `evalExpr`, `writeExprChoice` (D21).

### A11 — Measurement & geometry with a computable answer (A–E)
- **Template:** angle relationships (supplementary/complementary/triangle-sum);
  classify triangle by angles; rectangle area; box volume `l×w×h`; perimeter;
  area of polygons (E). **Params:** dimensions, angle relationship.
  **answerFor:** `180−a` / `180−a−b` / `l*w` / `l*w*h`; classification computed
  from the angles. **Distractors:** area-vs-volume, classify-by-smallest-angle,
  wrong-total. **Style:** unit-cube / grid models; Day-5 Always/Sometimes/Never
  ("a square is a rectangle"). **Risk:** figures are described in `[image: …]`
  placeholders; the numeric answer is always code-computed.
- Live: `angleArith`, `classifyTriangleChoice`, `rectArea`, `volumeBox` (D23/D24).

### A12 — Coordinate plane & patterns (D, E)
- **Template:** name/plot ordered pairs (Q1; four quadrants in E); arithmetic-
  pattern nth term; proportional relationships (E). **Params:** coordinates,
  start/step/n. **answerFor:** `start + step*(n−1)`; ordered pair (choice).
  **Distractors:** x/y swap, off-by-one term, axis misread. **Style:** treasure-
  map framing; Day-5 hidden-picture + "what does the pattern predict?".
- Live: `patternTerm`, `plotChoice` (D22).

### A13 — Data / statistics / probability (B, C, E)  *(archetype specified; partial)*
- **Template:** read bar/line/scaled graphs ("how many more"); mean/median/
  mode/range; probability 0–1. **Params:** data arrays, query. **answerFor:**
  graph-read value; `sum/n`, sorted-median, etc. (computable). **Distractors:**
  scale misread, mean-vs-median confusion. **Style:** build-and-read; Day-5
  "misleading graph detective" / "fair-game design". **Risk:** medium — center/
  spread and single-graph reads are computable; **histograms / box plots / dot
  plots and "invent a fair game" are figure- or open-ended → need-review**
  (Day-5 flagged manual-review).

### A14 — Open-response / explain / proof  *(flagged — AI-runtime graded)*
- **Template:** "explain why", written justification, Always/Sometimes/Never with
  a fixed correct classification, error-analysis, open design/estimation puzzles.
  **answerFor:** *none* for the open part — `short-text-keyword` (keyword match)
  or `manual-review` (acknowledged, AI-runtime graded). ASN/error-analysis with a
  fixed correct choice are code-selected but assert a **standard mathematical
  fact** authored once (counted as review-worthy). **Every Day-5 page and every
  weekly puzzle draws on this archetype** — it is the non-computational strand.
  **Style:** this archetype IS the Best Brains "why/transfer" signature; it must
  appear every week and must never leak the answer in a hint (QG-5).
- Live: `reasoning`, `classify` helpers + every `puzzle` (all D weeks).

---

## 3. Coverage plan — all 120 cells

Legend: **G** = generated + validated now · **B** = auto-generatable, pending
build (archetype covers it; blueprint prose to author) · **R** = needs
human/AI-runtime review for full correctness (open/figure/proof; ships with a
computable core + flagged Day-5).

**Build order:** Level D (done, proof) → Level E (user-facing older level,
mostly computable) → Level C → Level B → Level A. Older levels first per the
user ask.

### Level D — Upper Elementary — **FULLY GENERATED (proof level)**
| Wk | Concept | Archetype | Status |
|---|---|---|---|
|1|Place value to 1,000,000|A6|G|
|2|Multi-digit ± fluency|A2/A6|G|
|3|Factors, multiples & primes|A5|G|
|4|Multiplicative comparison|A3|G|
|5|Area-model multiplication|A3|G|
|6|Division with remainders|A4|G|
|7|Interpreting remainders|A4|G|
|8|2-digit × 2-digit|A3|G|
|9|Fraction equivalence & comparison|A7|G|
|10|± fractions (like)|A7|G|
|11|Fraction × whole|A7|G|
|12|Meeting decimals (checkpoint)|A8|G|
|13|Decimal place value (thousandths)|A8/A6|G|
|14|± decimals|A8|G|
|15|Multi-digit × fluency|A3|G|
|16|Division: 2-digit divisors|A4|G|
|17|± fractions (unlike)|A7|**G (fixture MFM-D17)**|
|18|Multiplying fractions|A7|G|
|19|Dividing with unit fractions|A7|G|
|20|× ÷ decimals|A8|G|
|21|Order of operations & expressions|A10|G|
|22|Coordinate plane (Q1) & patterns|A12|G|
|23|Angles & shape hierarchies|A11|G|
|24|Volume + Ready for E (exit)|A11|G|

**Level D result: 24/24 (23 template + 1 fixture), all validated × 5 seeds.**

### Level E — Middle-School Readiness — pending (mostly computable)
| Wk | Concept | Archetype | Status |
|---|---|---|---|
|1 Ratios|A9|B| |2 Rates & unit rates|A9|B| |3 Meeting percent|A9|B|
|4 Dividing fractions|A7|B| |5 GCF, LCM & decimal fluency|A5/A8|B|
|6 Negative numbers|A6|B| |7 Four-quadrant plane|A12|B|
|8 ± integers|A2|B| |9 × ÷ rational numbers|A7/A8|B|
|10 Exponents & expressions|A10|B| |11 Algebraic expressions|A10|B|
|12 Equivalent expressions|A10|**R** (prove-in-general)|
|13 One-step equations|A10|B| |14 Two-step equations|A10|B|
|15 Inequalities|A10|B| |16 Proportional relationships|A9/A12|B|
|17 Percent applications|A9|B| |18 Area of polygons|A11|B|
|19 Circles|A11|**R** (measure-π lab)| |20 Surface area & volume|A11|B|
|21 Measures of center & spread|A13|B| |22 Data displays|A13|**R** (histograms/box plots = figures)|
|23 Probability|A13|**R** (compound / fair-game design)| |24 Pre-algebra capstone|mixed|B|
*(E rows: ~19 B, ~4 R — every R still ships a computable core + flagged Day-5.)*

### Levels A, B, C — pending (archetype-covered)
- **Level A (24):** A1 counting/number-sense, A2 single-op ±, A11 geometry-intro,
  measurement. **Done:** A1, A2 (template), A15 (fixture). **Remaining 21 = B**,
  a small number of Day-5 "explain the rule orally" flagged **R** within
  otherwise-B weeks.
- **Level B (24):** A2/A3 arithmetic, A6 place value, A11 time/money/measure,
  A13 graphs. **Done:** B1, B2 (template), B14 (fixture). **Remaining 21 = B**;
  time-telling and money need a small dedicated generator family (clocks/coins).
- **Level C (24):** A3 multiplication/division facts, A7 meeting-fractions,
  A11 area/perimeter/geometry, A13 scaled graphs. **Done:** C1, C2 (template).
  **Remaining 22 = B**; a few figure-heavy geometry Day-5 pages flagged **R**.

### 120-cell tally (current)
| Bucket | Count |
|---|---|
| **(a) Generated + validated now** | **32** (A1,A2,B1,B2,C1,C2 + fixtures A15,B14,D17 + **Level D ×23**) |
| (b) Auto-generatable, pending build | ~80 |
| (c) Needs human / AI-runtime review | ~8 (E12, E19, E22, E23 + scattered A/C figure/oral Day-5 pages) |

*(b)/(c) are estimates on the un-built levels; note that most **R** cells are
"R only on the Day-5/figure part" — their computational strand is fully
auto-generatable, so they still ship a validated core.*

---

## 4. What needs human / AI-runtime review (the honest list)

These cannot be *fully* correctness-guaranteed by code and are represented as
`manual-review` / `short-text-keyword` (flagged for Haiku-4.5 runtime grading),
or as an authored standard-fact classification (review-worthy):

1. **Open "explain why" / written justification** — every Day-5 page carries at
   least one. Keyword-matched or acknowledged; the *concept* is sound but free
   text is not machine-graded. (All levels.)
2. **Proofs / prove-in-general** — E12 "are these always equal, argue in
   general", E9 "why does negative×negative", D19/E4 "why invert-and-multiply".
   The worked instance is computable; the general argument is runtime-graded.
3. **Figure-dependent geometry & data** — E19 measure-π lab, E22 histograms/box
   plots, some C/E area-decomposition and coordinate hidden-pictures. Rendered as
   `[image: …]` placeholders; numeric answers are computed, the figure/reading is
   review-worthy.
4. **Open design / estimation puzzles** — "invent a fair game" (E23),
   box-packing/optimization, benchmark-estimation. `manual-review` by design
   (Flow-4 acknowledged-not-graded).
5. **Always/Sometimes/Never with a fixed answer** — code-selected choice, but the
   correct classification is an authored mathematical fact (e.g. "a square is
   always a rectangle"). Standard and low-risk, but listed for one-time human
   sign-off.

**Nothing in these buckets is faked as deterministic.** Where a cell is **R**,
its computational strand is still fully generated and validated; only the
open/figure part is flagged.

---

## 5. Proof summary (Level D)

- **Chosen level: D** — the prioritized older level, dominantly arithmetic (so
  every answer is cleanly code-computed), and anchored by the existing validated
  D17 fixture. 23 week builders authored on the library + D17 fixture = **24/24**.
- **Validation:** `frontend/scripts/bb-verify-packs.ts` over all 32 servable
  packs × **5 seeds** — QG-1..QG-10, structural, arithmetic audit, determinism,
  seed-sensitivity, Form-A/B disjointness, catalog agreement. **0 failures.**
- **Two real gaps were caught by the gates during the build** and fixed (a
  fraction-division operand space that exhausted under one seed → widened; a
  Day-5 distractor tag not covered by its mistake-bank → added). This is the
  system working as designed: the gates, not the author, are the shipping
  contract.

## 6. Effort estimate to complete the remaining levels

Per fully-built level (24 weeks) on top of the existing library:
- **Level E:** ~1 new generator family (ratio/percent/integers/exponents) + 24
  blueprints. ~19 straightforward (B), ~4 need-review Day-5s. **Est: 1 focused
  build pass**; risk concentrated in A13 data-displays (figures) and A10 E-level
  equation "both-right" reasoning.
- **Level C:** reuse A3/A7/A11/A13 generators; add a fractions-of-a-set and a
  scaled-graph generator. **Est: ~0.8 pass**, low risk.
- **Level B:** reuse A2/A3/A6; add **clock/time** and **coin/money** generator
  families (the only genuinely new primitives). **Est: ~1 pass**, low risk.
- **Level A:** extend existing A1/A2 families (counting, shapes, patterns,
  bonds); audio-first presentation already handled. **Est: ~0.8 pass**, low risk.

**Riskiest archetypes** (call out for the fan-out): **A13 data displays**
(histograms/box plots are figures, not computable reads) and **A14 proofs** (must
stay honestly flagged, never auto-"graded"). Everything else is arithmetic-core
and rides the existing `compute.ts`/`items.ts`/`assemble.ts` stack.

---

## 7. Style / authenticity gate (coordination note)

A separate **Best Brains authenticity/style gate** (being derived from the
evidence ledger in a parallel workstream) will score generated weeks *alongside*
the correctness validator. Every archetype above lists the style markers it must
exhibit; the assembler already enforces the structural ones that overlap
(dual strands, Day-5 non-computational page, DD3 day order, 20–30% spiral
retrieval, why-before-how explanation slot, non-repetitive surfaces). The
remaining markers the style gate should score are qualitative: concept-first
framing depth, visual→symbolic fade within the week, band-appropriate voice, and
transfer coupling between the Day-5 page and the weekly puzzle. These are
authored into each blueprint's prose; the style gate is the check that they
landed.
