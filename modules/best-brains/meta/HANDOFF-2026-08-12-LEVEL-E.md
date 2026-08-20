# Handoff — Level-E fill, 2026-08-12

**Read `build/FILL-AGENT-BRIEF.md` first — especially §4a (band E).** It is the standing contract for
this work and every bar in it was earned from a defect that got past a clean 200-seed sweep.
Branch `best-brains-content-engine`. Everything below is committed and pushed.

---

## 1. Where the corpus is

| Level | State |
|---|---|
| A | **24/24 COMPLETE** (finished 2026-08-12, commit `549a5f3`) |
| B, C, D | 24/24 each (D completed when `d17` took its cell from the pinned fixture, `dd3f2ab`) |
| E | **3/24** — built: E1, E6, E13. **Missing (21): 2,3,4,5,7,8,9,10,11,12,14–24** |
| **Corpus** | **99 / 120 cells** |

Gate board at handoff, whole corpus: verify-packs **25,415 assertions / 0 failures** · readability ·
answer-entropy `--level A` 0 guessable / 0 tells · spoken-answer + selftest 13/13 · cross-week
`--strict` · family 9,660 instantiations / 60 seeds · qg11 · qg12 · qg13 54 · figure-render 41×3 ·
`tsc` exit 0.

## 2. What to do next, in order

1. **Triage E6's ten remaining library findings** (§4) before authoring E7/E8/E9 — three sit in the
   family those weeks use. A defect fixed once beats three weeks working around it.
2. **E21 next** — it is the last unproven generator family (G7 `stats.ts`). G4 proven by E1, G5 by
   E6 (after repair), G6 partly by E13.
3. **Then fan out the remaining 19.** Recipes are complete in `FILL-ARCHITECTURE.md` §6 (8 columns
   incl. `Flag`) — unlike Level A, whose recipes had gaps. Four weeks are R-flagged and ship a
   computable core plus an honestly flagged open part (§7), never a faked answer: **E12**
   prove-in-general · **E19** measure-π lab · **E22** build-a-histogram · **E23** fair-game design.
   E4/E9/E24 are R-lite.
4. **Then the assessment layer** — `build/CONSOLIDATION-WEEK-SPEC.md`, already designed and ratified
   by the owner. Two facts make it urgent: there is **no code path from B24 to C1 at all**
   (`advanceToNextWeek` clamps at 24 and nothing changes a child's level), and without consolidation
   weeks a child finishes a level in 24 weeks rather than a school year.

## 3. How to run it (the cadence that worked for 13 Level-A weeks)

**One agent per week, one at a time.** `bb-agent-budget.ts` prints the number; at ~750 MB free it
prints 1, and losing a 45-minute agent to an OOM costs more than parallelism buys. Give each agent
the brief plus a per-week delta (recipe row, catalog row, the week's own hazard). Then, as
orchestrator:

- **Re-verify every claim.** Re-run the 200-seed sweep, read the served pack, re-measure the
  blind-strategy numbers. This caught: a report naming the wrong live-leak weeks (a corpus scan found
  four others), a gate claim that failed a negative control, and a library defect that was real but
  latent rather than shipped.
- **Read the served pack.** Every single Level-A author found defects that way that no gate saw.
  So did I — the d17 item asking what fraction of a plot was planted and answering "1 1/3".
- **Shared files are yours alone.** Agents report `lib/` defects; you fix them, only when no agent is
  running, and always followed by the FULL battery — a library change touches every level.
- **Measure the blast radius before changing anything shared.** The `conceptFamily` repair looked
  sweeping and touched exactly two weeks; that check is what made it safe.
- Wire with `npx tsx scripts/bb-wire-weeks.ts` after each week (it derives all four regions).

## 4. Open library defects — E6 reported 12; two are fixed, ten are not

**Fixed** (in `lib/integers.ts`, this commit): `compareNegativesTrap` offered `=` on 2,000/2,000
draws and keyed it on **none** (L38 — a card a child learns to strike unread), and its pair was
always both-negative so "compare the digits, then flip" won 100% of draws. Both closed by drawing
the pair SHAPE first (below / across / on-zero / tie). Fixing it exposed a third: with ties drawable,
the hard-coded `=` distractor could duplicate the keyed card — distractors are now derived from the
truth. Measured after: 0 duplicate card sets, `=` keyed 16.5%, flip-rule 100% → 81.5% (still high,
because it is genuinely correct for both-negative pairs; it no longer certifies).

**Still open, from E6's report — triage before E7/E8/E9:**

1. `eaMagnitudeOrder` positional tell — the correct (warmer) reading is named **second on 500/500
   draws**. Manual-review so it cannot certify, but "answer the second one" is learnable.
2. `temperatureSwing` answer spike — a monotone bump out of {−1,0,1} puts **22% of the mass on two
   of 25 outcomes** ("3" at 14.1%). A resample instead of a bump fixes it.
3. `temperatureSwing` prints its own answer on **5.5%** of draws.
4. `orderTemperatures` **never draws zero** — the mirror line the week is about, absent from its own
   Day-5 generator.
5. `absoluteValue` is an identity task on ~50% of draws, where the misconception scores 100%.
6. `distanceBetween` compares two same-sign readings ~50% of the time — no signed content.
7. `oppositeValue` prose bug: *"On a lift shaft…"* should be "in" (~25% of draws).
8. **No cross-item name guard anywhere in the library** — two name-drawing generators on one day
   repeat a child's name on **4.2%** of day-pages. Affects every level.
9. `fracCompareChoice` / `decCompareChoice` carry the same unkeyable "equal" card as the one fixed
   here — **Level-D warm-ups, corpus-wide**.
10. Stale rationale in `compute.ts` ~505–516 and `erroranalysis.ts`: says `verifyTemplateId` resolves
    "against LIB_VERIFY_DEFS ONLY"; `verifyTruth()` checks the registry first now.

Longer-standing, recorded by many Level-A weeks (see `FILL-AGENT-BRIEF.md` §4): no numeral-glyph or
number-sentence primitive · `'set'` validation routes band A to a keyboard · missing verify twins for
the band-A families (QG-5 skips `choice-key`) · Form-B collision check compares `{templateId,
params}` only · `ledger.ts` needs an explicit `deepens` edge · `howManyChoice` ships dead cards at
every range · `Puzzle` has no `choices` field.

## 5. Two decisions the owner has not made

- **Should the alt-leak scan become a tenth gate?** It found 518 leaking items the standing battery
  passes *by design* (its tokenizer keeps `ten-frame` whole so `8:30` and `$4.50` survive). The
  content is fixed corpus-wide; the detector is not. I introduced one of those leaks myself while
  fixing the class — it is a detector gap, not a discipline problem.
- **QG-11's option branch.** A mis-keyed card IS caught today, but incidentally — by QG-13's figure
  assertion or QG-3's error-tag bookkeeping, not by the arithmetic audit. Items with no figure
  assertion may be undefended. Verified with a working liveness sentinel; worth a proper audit.

Also still open from Phase 1: **R1 (identity) and R2 (ladder adoption)**. Finishing Level E completes
the 5-level ladder at 120/120; against the grade-anchored ladder the seam audit recommends
(`build/SEAM-AUDIT-K8.md`), that is ~120 of 252.

## 6. House rules that bit during this fill

- **Explain before commit** — exact contents + pathspec, owner approval BEFORE `git commit`.
- `git merge` is classifier-blocked here; use `gh pr merge --squash`.
- **Another session commits to this branch.** It has taken files out of my working tree mid-session
  (an `a11.ts` change and two of my docs). Check `git log` before staging, and leave files you did
  not touch alone.
- Never weaken a gate. Strengthening is allowed; do it deliberately, not as a side effect.
