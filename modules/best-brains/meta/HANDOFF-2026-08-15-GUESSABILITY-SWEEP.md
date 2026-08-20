# Handoff — the guessability sweep, then resume the fill

Written 2026-08-15. Branch `best-brains-content-engine`, everything below is committed and pushed
(head `1dfb346`).

**Start with §2. Do not author another week until it is done.** The reason is in §1.

---

## 1. Why this comes first

Six generator families have been pre-flighted before authoring their week. **Six of six had a defect
where a child could score without doing any mathematics**, and in three cases the first repair
introduced a fresh instance of the same class. A sample of what was found *after* the standing
nine-gate battery passed clean:

| generator | the free strategy | rate |
|---|---|---|
| `percentOfEquality` | say "they are equal", never read the numbers | **100%** |
| `partWholeVsPartPart` | pick the smallest fraction | **100%** |
| `stackedPercentTrap` | pick the middle amount | **100%** |
| `betterBuy` | pick the bigger pack | **100%** |
| `minusNegativeTrap` | pick the biggest number | **100%** |
| `countTheSignsTrap` | say "positive" | 68.7% |
| `signedAddSubStory` | say "2" | 27.2% |
| `temperatureSwing` | say "3" | 12.9% |

Every one of these passed `bb-verify-packs`, `bb-family-test`, QG-5/11/12/13 and the rest, because
**every item's answer was correct**. Correctness is what the battery measures. Guessability is not,
except `bb-answer-entropy-test`, which only looks at mastery slots — and most of these live on
teaching slots.

They are being found one week at a time, by hand, which is slow and depends on remembering to look.
There are ~90 generators in `lib/`. The remaining ones have not been checked.

**Two signatures account for nearly all of it** (recorded in memory as
`feedback-generator-defect-signatures`):

- **Nudge-collapse** — a repair loop that *walks* a value toward legality (`while (bad) x += 1`)
  does not remove the excluded answers, it shunts them onto their neighbours, piling mass on the
  first legal value. Cure: resample the whole draw in a bounded loop with a documented fallback.
- **Constant-rank / constant-identity** — options generated from one construction have a fixed
  ORDER, or a fixed WINNER, even when the values vary. Cure: draw the OUTCOME first, then build
  operands to match, and derive the card set from the truth. **Then re-measure the rank** — two
  separate repairs replaced "pick the biggest" at 100% with "pick the middle" at 100%.

---

## 2. What to build: a guessability sweep over every generator

A script — suggested `frontend/scripts/bb-guessability-test.ts` — that enumerates every exported
`ItemGen` in `lib/` the way `bb-family-test.ts` already does (copy its `ARGS` table and family list;
it handles factories needing options and reports UNEXERCISED rather than skipping silently), draws
each ~3,000 times, and reports per generator:

1. **Answer concentration** — distinct answers, and the top answer's share. Flag > ~15% for a
   free-entry slot. Catches nudge-collapse.
2. **Card rank** — for choice items whose options are all numeric, the share of draws where the key
   is the largest / middle / smallest. Flag any bucket > ~60%. Catches constant-rank.
   **Parse values properly**: `"2/5"` is a fraction, `"$4.50"` is money, `"2 1/2"` is a mixed
   number. Stripping non-digits (`"2/5"` → `25`) produced a false diagnosis during this work — it
   reported a middle-rank defect on a generator whose real fault was smallest-rank.
3. **Card identity** — any single card text keyed > ~50% of draws (catches `percentOfEquality`), and
   any card offered on > ~40% of draws and keyed on **none** (catches the L38 unkeyable card, found
   six times so far).
4. **Duplicate card sets** — the same text twice in one set. Appears whenever a previously-impossible
   card becomes reachable and the distractor list was hard-coded beside the truth.
5. **Self-leak** — the answer printed in its own prompt, matched as a whole token. Report-only:
   a mode is always in its data, a translation task legitimately prints its own operands.

Report-only, like `bb-family-test`'s answer-in-prompt census. **Do not make it a hard gate in the
same change** — many flags will be legitimate (a "which is greater" item's key is genuinely the
larger card ~50% of the time) and a gate that cries wolf gets switched off. Land the census, read it,
triage, and only then decide what becomes binding. That is an owner decision.

### Then triage what it finds

`lib/` is the orchestrator's alone and only when no authoring agent is running. Every fix needs the
FULL battery afterwards, and **the sweep re-run after the fix, not only before it** — three repairs
in this program reintroduced the defect they were closing.

Measure blast radius before each fix: `grep -l <generator> templates/weeks/*.ts`. Most G4/G5 defects
turned out to be *latent* (no week served them yet), which is the cheap case. A generator that IS
served needs the served packs re-read, not just the generator re-measured.

---

## 3. Then resume the fill

**Corpus 104/120. Level E at 8/24**: E1, E2, E6, E7, E8, E9, E13, E21.

- **Next up: E3** (meeting percent). Its three discrimination generators were repaired in `1dfb346`,
  so it is unblocked — but re-measure them yourself before briefing an author; that is the standing
  rule and it has paid every time.
- **Then E4, E5** (G4, family proven), **E10–E12, E14–E16** (G6, `algebra.ts`, proven by E13),
  **E22, E23** (G7, `stats.ts`, proven by E21 — note E21's report lists four unrepaired defects in
  that family, including `meanVsMedianOnSkew` shipping an L38 card).
- **BLOCKED: E18, E19, E20** — the geometry block has **no generator family**. The architecture's
  table stops at G8; the library holds four Level-D geometry generators (`rectArea`, `volumeBox`,
  `angleArith`, `classifyTriangleChoice`) and nothing for composite decomposition, π, or nets. A G9
  must be built first, the way G5 was built before E6.

Cadence, unchanged and it works: **one authoring agent per week, one at a time** (`bb-agent-budget.ts`
prints the number; it prints 1 on this machine). Brief from `build/FILL-AGENT-BRIEF.md` §4a plus a
per-week delta that includes **the measured numbers from your pre-flight** — telling an author what
is already known to be broken is what stops them working around it silently or serving it unaware.

Then, as orchestrator: re-run the sweep, **read the served pack**, re-measure the blind-strategy
numbers. In this session that caught a report claiming a live QG-12c violation that was actually
latent, three of E6's ten reported numbers being wrong, and a defect in a generator I had repaired
myself two days earlier.

---

## 4. Open decisions for the owner — none blocking

- **The ASN verdict tell.** On Always/Sometimes/Never items, `sometimes` is keyed **47.7%** across
  432 items in 70 cells, and it is the longest of the three words, so "pick the longest" beats
  chance by 14 points without reading the claim. Each week authored one honest claim; the bias is
  emergent across authors. Rebalancing means revisiting ~33 weeks of authored content. New weeks
  since E9 deliberately key `always` or `never`.
- **Should the alt-leak scan become a tenth gate?** (carried forward, unresolved)
- **A proper audit of QG-11's option branch.** (carried forward, unresolved)
- **B24 → C1 is a hard stop.** `advanceToNextWeek` clamps at `WEEKS_PER_LEVEL` and nothing changes
  `enrollment.level`, so a child finishing a level has nowhere to go. The consolidation-week spec in
  `build/CONSOLIDATION-WEEK-SPEC.md` is designed and ratified but unbuilt. ~23 weeks away for the
  one live child.
- **`weeks/b01.ts` and `b02.ts` do not call `makeWeekBuilder`** — they hand-roll their pack, so the
  guided-example redraw, the Form-B core check, the band-A sprint refusal and the same-day name guard
  all skip them.
- **`packOffers` residual**: the bigger pack always has the bigger total, so "cheaper at the till"
  and "pick the smaller pack" are one strategy. Both sit at chance, so not exploitable.

## 5. House rules that bit during this work

- **Explain before commit** — exact contents + pathspec, owner approval BEFORE `git commit`. Ask
  before pushing too; "commit" and "commit and push" have been distinct instructions.
- `git merge` is classifier-blocked here; use `gh pr merge --squash`.
- Another session commits to this branch. Check `git log` before staging; leave files you did not
  touch alone.
- **Never weaken a gate.** Strengthening is allowed, deliberately, with the blast radius measured
  first — and measure it across EVERY validated surface, not just item prompts. Tightening QG-12c's
  stem minimum from 4 to 3 was measured on prompts, came back clean, and then failed on a lesson
  script (`"a carried 1 hops"`, where `1` is the noun and `hops` the verb).
- Hint ladders must be **seed-invariant**. A ladder that branches on the draw fails `bb-family-test`
  — the obvious fix for a hint that contradicted its item was exactly this, and was rejected.
- `lib/ratio.ts` states its own arithmetic law in its header: scaled integers, never floats. It was
  broken during this session by drawing money in 20c steps as a float; `0.2 * 6` is
  `1.2000000000000002` and it threw inside `money()`.
