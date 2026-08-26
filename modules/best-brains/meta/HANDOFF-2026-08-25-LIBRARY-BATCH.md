# HANDOFF 2026-08-25 (evening) — the library defect batch, the strict gates, and what is still owed

Written at the end of the session that merged **E22+E23+E24 to main (`477073a`, deployed and
hash-verified)** and then executed the approved backlog in order. Companion to
`HANDOFF-2026-08-25-LEVEL-E.md` (the morning state; its §5 defect list is now largely FIXED — this
file is the record of those fixes). Everything below is uncommitted at writing; the session ends
with an explain-before-commit.

---

## 1. THE STANDING BATTERY — now 16 scripts, TWO of them strict

Run from `frontend/`, after every `lib/` change and every week:

    bb-verify-packs · bb-family-test · bb-answer-entropy-test · bb-spoken-answer-test
    bb-qg11-test · bb-qg11-power-test · bb-qg12-test · bb-qg13-test
    bb-figure-render-test · bb-answerability-gate · bb-animation-test
    bb-broken-promise-scan · bb-readability-test · bb-guessability-test 3000 --all
    bb-cross-week-test --strict            ← STRICT as of this session (passes; keep it failing-on-regress)
    bb-probe-and-rank-test --seeds 60 --selftest --strict   ← STRICT as of this session (see §3)

`tsc --noEmit` to completion alongside. The two census gates (guessability, entropy) stay
report-only BY DESIGN — read and triage, never skim.

## 2. THE LIBRARY BATCH — eleven defects fixed, every one measured before and after

All measurements: ≥4,000 draws × two disjoint lattices (`i·7919+11`, `i·104729+3`), fresh
TupleGuard per draw. Baselines were taken BEFORE any edit; the delta is the evidence.

| target | defect (measured) | after |
|---|---|---|
| `algebra.whichInverseMove` (E13) | one equation form → "take…off" keyed **100.0%**, two L38-dead cards | three forms drawn; 33.4-33.6%, all three cards keyed |
| `algebra.whichMoveFirst` (E14) | one form + `b=a+…` → largest-numeral rule **100.0%**, divide card dead | spread/grouped forms; ≤52.4% incl. ties, both verbs keyed |
| `algebra.twoStepEquation` (E14/E15) | loose ≥ one group on **80-82%** of scenes | b < x by construction; **0.0%** |
| `stats.tallestVsAskedBar` (C23) | key rank mid **40.9-42.4%** + a 40-iteration redraw loop | want-rank-first; 33-35% each; loop deleted |
| `stats.graphRead('difference','pictograph')` (C23) | answer == printed key **24-26%** | max-gap switch; **0.0%** |
| `stats.meanOfSet` (E21) | mean ∈ its own data **100.0%** | default mean-free **0.0%**; `memberMean: true` opt-in for e21's documented Day-1 choice (packs byte-identical) |
| `stats.probabilityOfEvent` (E23) | keys exactly ½ **15.8-16.5%** | nudged; **0.0%** (e23's now-dead filter retired) |
| `stats.complementProbability` | keys exactly ½ **15.1-16.7%** | nudged; **0.0%** |
| `stats.eaTallestBarRead` | names the SHORTEST bar **100.0%** | either non-tallest; ~50/50 |
| `stats.histogramBinRead` | answer printed on page **21.7-22.6%** | `clearOfPage` walk; hoisted helper (e22 repointed, hash-identical `7ccf0f78…`) |
| `format.exactlyOne` | sign-blind → "-1 centimetres", 43/200 E24 seeds invalid | magnitude-1 singular; E24's local guard unwound, ±1 serves with singular nouns |
| `stats.eitherOrFiftyFifty` | unserviceable (dead ½ card, strike-middle 90.3%) | prose bug fixed, **@deprecated** with the algebraic argument + pointer to e23's design |
| + `stat_verify_bin_span_v1` | (addition) | registered with c0 ≥ 1 AND c0 ≠ c1 guards; lets a data-display cell ship its recipe EA |

**`balancedSet` itself is UNTOUCHED** — e21's `compareTheTwoCentres` depends on the symmetric
pool to keep its "they come out the same" card keyable. The mean-free construction is the sibling
`balancedSetMeanFree` (odd-n: largest magnitude skewed by a drawn, mirrored offset so mean−median
varies in size AND sign — a constant offset would have minted "sort, take the middle, add one").
A design challenge caught the in-place version before it shipped; treat this as the standing
example of a lib fix that would have swapped one measured defect for two unmeasured ones.

## 3. THE TWO CERTIFYING-SLOT WEEK FIXES (B22, B24) + the gate that found them

`bb-probe-and-rank --strict` corpus-wide failed at the start of the session: 37 findings, 20
certifying, collapsing to 14 slots in B3/B22/B24. Triage: B3 = clean comparison items (the gate
lacked the entropy gate's exemption); B22/B24 = real E17-class conditional-rank pins on certifying
slots (fraction word / question form → rank, 100.0% on served forms, measured).

- **Gate repairs**: comparison exemption (three legs: interrogative-extreme prompt on EVERY arm
  draw + pinned rank IS the asked extreme + 100% of the arm), suppressions PRINTED never silent,
  findings deduped per (slot, rank, arm-membership) instead of per token, and the `--selftest`
  control extended with a two-sided synthetic pair — a clean comparison the exemption must be SEEN
  to withhold on, and a broken one (keys the opposite extreme) that must still flag.
- **B22**: distractor pairing rotates through named misconceptions (folds count, parts count,
  other share, take-away misread, doubled share); rank measured 34/33/33 (half) and 37/33/31
  (quarter), from 100% pins. t=16 exclusions and the ≥20 fold for quarter-largest are documented
  in the item.
- **B24**: pairing rotates over {bigger pile, gap, double-count, join, whole-back}; whole-ask
  0/49/51, part-ask 51/49/0 (bounded two-rank rotation, documented).
- **THE STREAM LESSON, learned twice**: drawing want/pick as NEW rng shifted every later item in
  the pack and surfaced QG-1 collisions on 23/400 B22 seeds. The fix: derive want/pick from the
  pin's own `r.uint()` (already in the stream) — rng consumption stays byte-identical, no other
  item moves. Use this trick for any future card-rotation on a pinned slot.

**Result: `bb-probe-and-rank --seeds 60 --selftest --strict` passes corpus-wide** (6 findings, 0
certifying — the six are the pre-existing MAJORITY_VOTE day rows in C14/C17/D14×2/D24×2, still
open as census work).

## 4. NEW FINDINGS, REPORTED NOT FIXED

- **B22 at true HEAD fails `validatePack` on 25/400 seeds** (QG-1 same-day commuted operand
  reuse; seed 16 is inside the standard 200-seed lattice). Pre-existing in production — the batch
  neither causes nor worsens it (identical count and seed list, stash-verified both ways). ~6% of
  served B22 packs carry a same-day duplicate-operand blemish. `bb-verify-packs` misses it because
  its seed lattice differs. The fix belongs with whoever next opens B22: find which two generators
  share the colliding surface and widen one's draw, then re-run this 400-seed check.
- The six MAJORITY_VOTE day rows (C14, C17, D14×2, D24×2) — report-only, never triaged.
- `graphRead` has no general answer-off-the-page guard (this batch fixed the gap-1/key channel
  only); difference/combine on bar mode remain unmeasured for the printed-count channel.
- The `countNoun('of them')` class: a lexical sweep of lib/ for countNoun with non-head-noun
  phrases has not been run; `eaPastTrialsChangeNext` escapes only because its count is pinned to 1.

## 5. ESLINT — first config in the package's history

`eslint.config.js` (flat, untyped recommended) + the `lint` script's invalid `--ext` removed.
First measured run: **615 files · 137 errors · 87 warnings · 1 auto-fixable**. Breakdown:
58 `no-explicit-any` · 53 `exhaustive-deps` (warn) · **36 `rules-of-hooks` — all in 8 animation
visualization components (early-return-before-hooks; latent crash class; pairs with the owed
micro-animations verdict session)** · 34 `only-export-components` (warn) · 41 mechanical
(case-declarations 21, unused-vars 7, empty-object-type 6, require-imports 4, useless-escape 3).
Costed: mechanical ≈ one Opus agent pass; hooks ≈ one careful session WITH bb-animation-test and
visual verification; deps/any ≈ judgment work, one session. `--max-warnings 0` stays honest —
lint will exit 1 until the backlog is worked; that is the point of measuring it.

## 6. RULINGS RECORDED

- **`requireSimplestForm` is NOT dead code** — answers.ts:80 implements it (flag set → only exact
  `acceptableForms` surfaces pass; the numeric-equality fallback is skipped). No content sets it.
  Activating it marks unreduced-but-equal answers wrong, a pedagogy change: OWNER decision.
  The three week headers calling it dead (e05, e10, e11) describe the consumer side truthfully —
  nothing sets the flag — but the standing "implement or delete" framing is closed: keep, unset.
- **B14 stays shadowed** (ruled at the E24 merge): its builder now appears in BOTH census gates as
  `B14~builder` (never strict-blocking). Un-shadowing waits on widening mastery slots 05/06
  (8 and 3 distinct answers) — an owner decision with the D17 option-A precedent.
- **Guessability census triage** (from the E24 session, unchanged): 12 of 17 (now 16) flags are on
  generators no week imports — measured and declined by the weeks whose recipes named them; 1 is
  the probe gate's own negative control (never "fix"); 1 computes +0.0% excess. Live and material:
  `earlynumber.puppetSlip` (a02/a18, ~50% rank strategies) — the one census row worth a session.

## 7. REMAINING BACKLOG (order ruled by the owner 2026-08-25)

1. ~~cross-week --strict into battery~~ DONE (§1). 2. ESLint backlog (§5, costed). 3. ~~library
batch~~ DONE (§2). 4. ~~probe gate + B22/B24~~ DONE (§3). 5. **A15** — the only cell with no
generated week; Level A → 24/24; kills the 5 standing broken-promise rows. 6. **G9 geometry
family → E18/E19/E20** — approved as a shared-library commitment; family first (design + the
exact-arithmetic audit compute.ts demands + registered defs + full battery), then one week per
session; E19 is R-flagged (measure-π lab). 7. Product items: times-table card four changes,
Kumon return queue (depends on tableChecked), micro-animations Fable verdict (pairs with the
hooks fixes, §5), scratch-pad "More space" ruling.

Deploy note: the batch changes served surfaces for B22/B24/C23/E13/E14/E15/E23/E24 at unchanged
content-version — the 2026-08-15 precedent (ten served generators repaired in place). A child
mid-week re-sits against a drifted form; deploy timing is the owner's call, and nothing
auto-deploys.

## 8. FABLE VERDICT RIDERS (batch ruled SHIP; these five lines are the inheritance)

1. **`npm run lint` baseline at this commit: exit 1 · 139 errors · 87 warnings, tree-wide,
   pre-existing** — the first time the command has ever run. Six of the errors are `any`s in the
   two bb gate scripts (including this batch's own `level: any` lines). Going green is a separate
   deliberate decision: a fix pass or recorded rule downgrades, never a silent config soften.
2. **B22's 25/400 QG-1 seeds are SERVABLE TODAY** — `generatePack` does not call `validatePack`
   at serve time (verified at packGenerator.ts:473), so those packs reach children with a
   same-day duplicate-operand blemish. Fix in its OWN commit: deterministic nudge at the second
   consumer's draw site, before/after seed lists printed, target 0/400, then re-run B22's
   want/pick rank distributions (the streams shift).
3. **whichMoveFirst's ~50% residual is a PROVEN STRUCTURAL FLOOR, not a tuning gap** — "pick the
   card whose numeral appears once" identifies the subtract card and is right on exactly the
   spread half, regardless of magnitudes. Do not re-sweep it; only a third form (e.g. a·x − b = c
   keying "add b") moves it, and that dilutes E14's named divide-too-early pedagogy — an owner
   redesign decision.
4. **TRIPWIRE: the pin seed is now load-bearing for card layout on B22 and B24** (want/pick derive
   from `r.uint()`). Any change to the withPin/QG-11 seed plumbing — what the uint returns or when
   it is drawn — silently re-deals both slots' card ranks: re-sweep both rank distributions if
   that path is ever touched.
5. Cosmetic debt accepted: b24's whole-ask `errorTags` declares a superset of the tags its
   wantHigh branch serves (declared-superset semantics; fixing it would change served bytes for
   nothing). The `tallestVsAskedBar` dead-code warts Fable listed were removed pre-commit,
   measurement-verified identical.
