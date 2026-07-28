# Style-Gate Results — Level D at CONTENT_VERSION 1.2.0 (post-B0 polish pass)

**Run date:** 2026-07-27 · **Judges:** three independent Fable-5 agents, 8/8/7 packs each,
two-pass protocol + mandatory adversarial anti-drift pass, every distractor and stated answer
recomputed by hand. **Corpus:** the 23 generated Level-D weeks (D17 is the pinned hand-authored
fixture and is excluded from scoring).

---

## 1. First run — the honest number

| | ACCEPT | HUMAN_REVIEW | REJECT |
|---|---|---|---|
| D1–D8 | 6 | 2 | 0 |
| D9–D16 | 6 | 2 | 0 |
| D18–D24 | 6 | 1 | 0 |
| **Total** | **18** | **5** | **0** |

**Clean-ACCEPT rate 18/23 = 78.3%, against a go/no-go bar of ≥80%. The bar was NOT met on the
first run.** Zero REJECTs, and all 230 hard-gate checks passed on every pack — every
HUMAN_REVIEW was driven by a *weighted depth* criterion, not a structural failure.

**This is not directly comparable to the previous 23/23.** That figure came from a different
judging run; this one was instructed to recompute every distractor and stated answer by hand and
to default to overturning its own passes. It found defects that pre-date the B0 pass — in code
B0 never touched. A drop in the score with a harsher instrument is not the same as a regression
in the content, and the honest reading is that the earlier 100% was partly a measurement artefact.

## 2. What drove each HUMAN_REVIEW, and what was done

| Week | Driver | Class | Action |
|---|---|---|---|
| D7 | Day-5 exemplar claimed "how many boxes hold all the cookies" for 45÷6 "rounds up to 7" — it rounds up to **8**; 7 is the *drop* answer. Inverted the exact distinction the week teaches, on a manual-review item a grader would propagate. | answer-key semantics | **FIXED** — exemplar now pairs 7 with the full-boxes question and states the round-up value as 8 |
| D8 | Puzzle key named the missing room of 26×34 as "six ones times thirty… worth 80" — 6×30=**180**, and is one of the *given* rooms; the missing room is 20×4=80. Separately, a mistakeBank exemplar totalled **674** where the arithmetic gives **642** (32×21=672). | answer-key semantics | **FIXED** — both corrected and independently recomputed |
| D11 | The "puzzle" was a structural clone of the week's own daily template (k copies + a whole), identical in operation and step-count to D2-05/D3-05/D4-02 and mastery — a word problem wearing a Puzzle Grove label. | puzzle genuineness | **REPLACED** with an inverse threshold search (least whole laps of 3/8 km to pass 2 km, with a minimality argument) |
| D16 | The puzzle re-parameterised Day-5 item D5-02, which itself rehearses the worked example in `script[2]`. "Show the bracketing products" is show-your-work, not a new application. | puzzle genuineness | **REPLACED** with a constraint search (find every dividend whose quotient is in the thirties with remainder 5, and argue the list is complete — verified to be exactly ten values, 635…824) |
| D19 | Puzzle hint rung 2 — "Halving the scoop doubles the number of scoops" — was verbatim the answer's own explanation clause, so the covariation the puzzle exists to teach was told, not discovered. | hint leak | **FIXED** — rung 2 now locates ("re-fill that SAME cup with the smaller scoop — how many sit where each big one did?") |

## 3. Systemic findings fixed beyond the five

- **Incoherent distractor rationales (BB-W4), found in D9, D13, D14.** The comparison generators
  hard-coded "judges by the bigger bottom" / "chooses the one with more digits" regardless of the
  drawn operands — so whenever the *correct* answer happened to be the one with the bigger
  denominator or more digits, the named misconception would have selected the RIGHT answer and the
  label was nonsense. **Fixed in `items.ts`:** both generators now choose the rationale from the
  operands, and 126 mechanism-tagged distractors were verified to be genuinely produced by their
  named misconception.
- **Hint rungs that state what the item asks for**, found across D5, D8, D22, D23, D24 — a
  recurring authoring habit, not a one-off. All five rewritten to locate rather than tell.

## 4. Findings recorded but NOT actioned in this pass

- **Day-4 pages built largely from re-skinned Day-2/3 sentence templates** (capped BB-W5 at 3–4
  across most packs). Real, systemic, and a genuine authoring-cost decision rather than a bug —
  belongs with the context-frame work, not a same-day patch.
- **Verbatim cross-week reuse of retrieval warm-ups and an identical fluency-sprint seed in all
  packs** ("3 × 7" recurs in six weeks). Worth a rotating operand stream; queued.
- **Two dangling reteach pointers** (D15's "D8 review" points outside the pack; D16's mistakeBank
  references buses/adults problems that do not exist in that pack).
- **D16's modeled example GE-01 skips the trial-adjust loop** and rounds 14→15, contradicting the
  round-to-a-friendly-ten rule it teaches (BB-W2 = 3).
- Minor: D11 `script[0]` say/visual mismatch; D10-D2-06 question/quantity mismatch; D14 rounding
  answers display as `1.4` where "nearest hundredth" wants `1.40`.

## 5. Honest limits of this result

1. **The 78.3% is the measured first-run figure.** The repairs above were made *after* judging;
   the re-run over the five repaired packs is what establishes the final rate, and no claim about
   crossing 80% is valid until that lands.
2. **LLM judgment is the instrument.** Three independent agents scored disjoint slices under an
   identical protocol; they agreed closely on structure but their weighted scores are not
   calibrated against each other.
3. **The two answer-key errors are the important finding, not the score.** Both were semantically
   wrong content that passed 7,877 deterministic assertions and an earlier 100% authenticity run,
   because the deterministic gate audits computed answers and these were hand-authored prose in a
   `manual-review` exemplar and a mistakeBank entry. Recomputation by a reader is what caught them
   — which is exactly the argument for keeping an adversarial LLM stage that recomputes rather
   than trusts labels (L20, L22).

---

## 6. Re-judge of the five repaired packs — the final number

A fourth, fresh Fable-5 judge re-scored D7, D8, D11, D16 and D19 without sight of the earlier
verdicts, instructed to verify each repair independently rather than take it on trust, and to
default to overturning its own passes.

**Result: 5 ACCEPT / 0 HUMAN_REVIEW / 0 REJECT.** Every repair held under attack:

- **D7 / D8 answer keys** recomputed from scratch: 45÷6 now pairs round-up = 8, full boxes = 7,
  leftover = 3; D8's puzzle names the tens-by-ones room (20×4 = 80, total 884 = 26×34) and the
  mistakeBank exemplar reads 642 against a true product of 672.
- **D11 / D16 replacement puzzles** were attacked as "the daily template in costume" and survived:
  D11's threshold search inverts a forward 1-step multiply into a minimal-*k* search with a
  bracketing exhibit and a minimality argument (it shares only the context noun); D16's puzzle
  inverts division to reconstruct *all* dividends and argue completeness — verified as exactly ten
  values, 635…824, step 21.
- **D19's hint** now poses the correspondence as a question; the judge checked every rung in all
  five packs and found no rung stating or paraphrasing an answer.
- **Distractor coherence**: ~210 arithmetic checks across the five packs, 0 mismatches.

### Final tally

| | ACCEPT | HUMAN_REVIEW | REJECT |
|---|---|---|---|
| First run (23 weeks) | 18 | 5 | 0 |
| Re-judge of the 5 repaired | +5 | −5 | 0 |
| **Final** | **23 / 23 = 100%** | **0** | **0** |

**The ≥80% go/no-go bar is met.**

**Honest caveat on that 100%.** It combines two runs. The 18 first-run ACCEPTs were scored *before*
I applied the advisory fixes those same judges recommended — the hint-rung leaks in D5/D22/D23/D24
and the incoherent comparison-distractor rationales in D9/D13/D14. Those changes only removed
deductions the judges had already booked (BB-W3 and BB-W4), so they can only raise those packs'
scores; but a single-snapshot 23/23 would require re-running all 23 against the current tree, which
has not been done. The defensible claim is: **every week that was ever flagged has been repaired and
independently re-cleared, and no week is currently known to fall short.**

### Residual, non-blocking

The judges converged on one systemic weakness that no repair addressed and none of them treated as
blocking: **Day-4 pages are largely re-runs of Day-2/3 sentence templates with new numbers**
(BB-W5 = 3 in D8/D11/D16/D19), plus scattered isomorph-freshness slips (D11's MB-06 = MA-05
operands, D19's MA-01/MB-01 near-clone) and D16's stale "buses/adults" mistakeBank artifact. This is
authoring cost, not a bug, and belongs with the context-frame work in the fill.
