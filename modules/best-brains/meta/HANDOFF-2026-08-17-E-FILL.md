# Handoff — resume the Level-E fill

Written 2026-08-17. Branch `best-brains-content-engine`, head `5314cbe`, everything below
committed. **Not pushed** — `git push` is a separate instruction the owner gives explicitly.

Supersedes `HANDOFF-2026-08-15-GUESSABILITY-SWEEP.md`, whose §2 task is done.

---

## 1. State

**Corpus 108/120. Level E is 12/24**: E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E13, E21.

Built this session: **E3** (meeting percent), **E4** (dividing fractions, R-lite), **E5** (GCF,
LCM & decimals), **E10** (exponents — opens the G6 block).

**Next: E11** (algebraic expressions). Its generators are pre-flighted and clean — see §4. Then
E12, E14, E15, E16 (G6, `algebra.ts`), then E22, E23 (G7, `stats.ts`), then E24.

**E18–E20 remain BLOCKED.** The geometry block has no generator family. `lib/` holds four
Level-D geometry generators (`rectArea`, `volumeBox`, `angleArith`, `classifyTriangleChoice`)
and nothing for composite decomposition, π, or nets. A G9 must be built first, the way G5 was
built before E6.

## 2. The guessability census is built, and it is the standing pre-flight

`frontend/scripts/bb-guessability-test.ts`. 237 generator configurations across eight `lib/`
families, 3,000 draws each, **report-only**.

    npx tsx scripts/bb-guessability-test.ts 3000 --all
    npx tsx scripts/bb-guessability-test.ts 3000 --only <generatorName>

**62 flags at the start of this work → 17 now**, and every one of the 17 is triaged (§5).
Seventeen generators were repaired, all of them on weeks a child is already served.

**Run it before briefing any author, and after every `lib/` repair.** Three separate repairs in
this program reintroduced the defect they were closing, and one of mine traded "always the
largest card" for "never the smallest" inside a single edit.

What it checks: answer concentration (nudge-collapse) · card rank · card identity · dead cards
(L38) · duplicate card sets · key position · text length · **structural surfaces** · a
report-only answer-in-prompt census. Every rate is printed against its **chance baseline**
(1/n for n cards, 1/distinct for free entry) and the sort is by *excess over chance* — a flat
threshold flags two-card items for keying option A half the time, which is exactly what a fair
shuffle does.

**Structural surfaces are the newest check and the one to understand** (`b5fad96`). A surface is
a SHAPE readable without doing the mathematics: this card is the only one with a bracket, the
only fraction, the only negative, the only one with a letter. `algebra.groupingToTarget` keyed
the only bracketed card on **100.0%** of draws and the census called it clean — correctly by its
own lights, because the key text varies (so identity stays low) and expressions are not scalars
(so no rank check runs). It took an author refusing to serve a generator its own recipe named.
Both directions are flagged: the odd card out being always the answer, or never it.

### What the census still cannot see

- **Authored week content.** `items.classify` takes its cards from the week module, so it is
  listed AUTHORED-CONTENT rather than swept. The ASN form has a permanently fixed verdict in
  **62 weeks** — see §6.
- **Week-module generators.** Authors must measure their own by hand; tell them so.
- **One difficulty per run** (3 by default; `--diff N`).
- **Whether the WEEK balances a generator.** A generator at 50% "largest" is fine if its week
  pairs it with one at 50% "smallest". That stays the author's job.

## 3. How to run a week — the cadence that works

**One authoring agent per week, one at a time.** `npx tsx scripts/bb-agent-budget.ts` prints the
number; it prints **1** on this machine (4 GB / 2 cores) and a killed agent costs its full
300–450k tokens and returns nothing.

1. **Pre-flight yourself.** Run the census over the generators the recipe names. Read them.
2. **Fix `lib/` defects BEFORE briefing** — `lib/` is the orchestrator's alone and may only be
   touched when no agent is running. Every fix triggers the full ten-gate battery.
3. **Brief from `build/FILL-AGENT-BRIEF.md` plus a per-week delta carrying your measured
   numbers.** Telling an author what is already known to be broken is what stops them working
   around it silently or serving it unaware. The last four briefs are worth copying in shape.
4. **Re-verify every claim that comes back.** Re-run the sweep, **read the served pack**,
   re-measure the blind strategies yourself.
5. **Battery, then explain-before-commit.**

### The battery (all ten, after every `lib/` change and every week)

    bb-verify-packs · bb-family-test · bb-answer-entropy-test · bb-spoken-answer-test
    bb-qg11-test · bb-qg12-test · bb-qg13-test · bb-figure-render-test
    bb-readability-test · bb-cross-week-test --strict · tsc --noEmit

### Re-verification has paid every single week

A reported 39.3% that measured 46.6% · three of ten reported numbers wrong · a claimed live gate
violation that was actually latent · a defect in a generator repaired two days earlier · and a
**100%-accurate tell nobody had found**, reached only by probing a number that looked fine.

## 4. E11 — pre-flighted and ready to brief

Recipe (FILL-ARCHITECTURE §6): variable as an any-number bag · evaluate at several x ·
EA "3 more than twice n" → 2(n+3) · discrimination **2n vs n² vs n+2** · Day-5 one expression,
three stories. Not R-flagged, so fully computable.

| generator | measured, 3,000 draws, difficulty 3 |
|---|---|
| `algebra.expressionMeaningTrap` | 3-card, top key **1.1%** — clean, **repaired in `5314cbe`** |
| `algebra.evaluateAtSeveralX` / `msEvaluateThenShare` | see a fresh run |
| `items.evalExpr(false/true)` | 84 / 70 distinct, top ≤4.3% |
| `algebra.groupingToTarget` | 32.6% both surfaces — **repaired in `b7ebcd5`** |

**`expressionMeaningTrap` was repaired immediately before this handoff and must not be undone.**
It keyed the un-bracketed reading on every draw, so `a(n + b)` — the only card with a bracket —
could never be the answer. The phrase now rotates over the same three expressions. If a week
constrains it back to one phrasing, the 100% strike-the-bracket strategy returns.

## 5. The 17 residual flags, triaged

- **Latent, fix when their week is authored** (7): `percentOfVsPercentOff`, `stackedPercentTrap`
  (E17) · `equalAtOneXVsAllX` (E12) · `barGraphVsHistogram`, `eaTallestBarRead` (E22) ·
  `eitherOrFiftyFifty` (E23) · `storyDivideUse`, `storyFractionCombine`.
- **Served, moderate** (+15–25 over chance): `puppetSlip` ×4, `minusNegativeTrap`,
  `fracEquivFill`, `fracAddSubLike` and a few nudge-collapse rows.
- **Structural, documented in the code, deliberately left**: `puppetSlip`'s rank (the puppet's
  number is on the page and each slip has one direction by definition — the only fixes would
  delete the error-analysis or change the slip the week asked for) · `solidChoice(rolls)` (no
  non-roller can key "which one rolls?"; that is the question having an answer) ·
  `fracAddSubLike` ("1" on 18% is 1/(d−1) by construction, and is the case the week most wants
  a child to meet).

## 6. Open owner decisions — none blocking

1. **`AnswerSpec.requireSimplestForm` is dead code.** Declared in `types.ts`, read by
   `answers.ts::checkAnswer`, **set by nothing**. Every "write it in simplest form" item ever
   shipped (D12, E1, E3, E5) is graded on value alone: `12/28` marks correct against a key of
   `3/7`. Not fixable from a week module — `SituationDraw` and `MultiStepDraw` have no field to
   pass it through.
2. **The verify library cannot express an OPERAND-swap misconception.** Every verify template
   varies the *operation* over a fixed ordered pair. E4's "inverts the wrong fraction" and E5's
   "LCM = just multiply them" both hit this; both shipped the misconception as a live evaluable
   card instead, per kit §E2.3 option 3. It will recur for any week whose named slip is a swap.
3. **The ASN form has a fixed verdict in 62 weeks.** `items.classify` keys one authored card, so
   the other two are offered always and keyed never. E3 and E10 draw the claim locally instead.
   Pushing that corpus-wide is ~62 weeks of work.
4. **Should the census become a tenth gate?** Advice: not yet. Seven of the 17 residuals are
   latent generators that get fixed as their weeks are authored, so the count is still falling
   on its own; freezing a threshold before it settles is how a gate ends up switched off.
5. **Concrete hints vs seed-invariance.** Ten `items.ts` ladders were flattened in `5944665`
   ("Think: 6 times WHAT lands on 72?" → "…the factor you are given times WHAT lands on the
   target?"). The rule forcing this is technical (pack-generation dedup, L19), not pedagogical.
   If concrete hints are worth having, the right fix may be to make dedup ignore hint text
   rather than to flatten the ladders. Untraced.
6. **`weeks/b01.ts` and `b02.ts` do not call `makeWeekBuilder`** (carried forward).
7. **B24 → C1 is a hard stop** — `advanceToNextWeek` clamps at `WEEKS_PER_LEVEL` and nothing
   changes `enrollment.level`. The consolidation-week spec is designed and unbuilt. Carried
   forward; ~23 weeks away for the one live child.

## 7. Gate holes closed this session — do not reopen

- **`bb-family-test` never scanned `lib/items.ts`** (`5944665`). ~50 generators, every Level-D
  week built from them, and one of the suite's own hard rules had never been applied there. Ten
  seed-variant hint ladders, one shipping 102 distinct ladders. Now scanned: 44,200
  instantiations, up from 9,660.
- **`verifyFrac` and `verifyDec` never refused `wrong === correct`** (`2296fe5`). The comment
  above the four *integer* verifies claims the property and reads as a claim about all six. The
  consequence reached a served page: an error-analysis offering "the student wrote 3.2" against
  a key of 3.2. **QG-11 structurally cannot see this** — it checks the prompt shows `wrong` and
  the answer carries `correct`, and when they coincide both checks pass on the same number.
- **The census's own arg parsing** (`8d1027f`) — `--diff` was read as `argv[0]` when absent, so
  the first full run swept at difficulty 3000 and said so in its own header. Also: a factory
  with required parameters is no longer swept bare (`Function.length`), because
  `stats.graphRead(kind, mode='bar')` returns a working closure when called with nothing and was
  being measured in a degenerate configuration.

## 8. House rules that bit during this work

- **Explain before commit** — exact contents + pathspec, owner approval BEFORE `git commit`.
  Ask before pushing; "commit" and "commit and push" are distinct instructions.
- `git merge` is classifier-blocked; use `gh pr merge --squash`.
- Another session commits to this branch. Check `git log` before staging; leave files you did
  not touch alone.
- **Never weaken a gate.** Strengthening is allowed, with the blast radius measured first —
  measure it across every validated surface, not just item prompts.
- **Hint ladders must be seed-invariant**, now enforced on `items.ts` too.
- `lib/ratio.ts` states its own arithmetic law in its header: scaled integers, never floats.
- **Draw the OUTCOME first, then build operands to match, then derive the cards from the truth.**
  That one move fixed most of the seventeen repairs. And **re-measure the rank afterwards** —
  fixing a rank tell without checking the surfaces just moves it.
