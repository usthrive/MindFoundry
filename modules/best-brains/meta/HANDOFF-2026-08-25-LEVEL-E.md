# HANDOFF 2026-08-25 — Level E fill, resuming at E23

Written at the end of the session that shipped **E22** (`adcb2e8`, pushed). Supersedes
`HANDOFF-2026-08-24-LEVEL-E.md`, whose §1 is now two weeks stale. That file's §3 still stands and is
worth reading; §4's protocol is unchanged and still mandatory, with the additions in §4 below.

---

## 1. Where the corpus actually is

**114 of 120 weeks.** A 23/24 (a15 missing) · B 24/24 · C 24/24 · D 24/24 · **E 19/24**.

Level E holds: E1–E17, E21, **E22**.

| Missing | Concept (catalog) | State |
|---|---|---|
| E18 | Area of polygons | **BLOCKED — no geometry family** |
| E19 | Circles | **BLOCKED** · also R-flagged (measure-π lab) |
| E20 | Surface area & volume | **BLOCKED** |
| **E23** | Probability | unblocked · R-flagged (invent-a-fair-game) · **cheapest next, but see the warning** |
| **E24** | Pre-algebra capstone | unblocked · R-lite · closes the unblocked run |

**E23 LOOKS CHEAPER THAN IT IS, AND THIS IS THE ONE THING TO READ BEFORE STARTING IT.** Every
generator its recipe names already exists in `lib/stats.ts` — `probabilityOfEvent`,
`complementProbability`, `eitherOrFiftyFifty` (the recipe's discrimination) and
`eaPastTrialsChangeNext` (the recipe's error-analysis). It is blueprint-only. But **not one of them
has ever been served by any week**: no week file imports them, and the `CHANCE_ITEMS` pool is
unconsumed. So the entire probability half of that file is **unmeasured**, and by §2 below the
recipe-named discrimination should be assumed guessable until swept. Budget that sweep up front.
E22 discovered its computable core was leaky halfway through and paid for it.

**That sweep has now been run (6,000 draws per generator) and every warning above was justified.
Read this before designing E23:**

- **`eitherOrFiftyFifty` — the recipe's own discrimination — carries TWO independent 100%
  defects.** `"1/2"` is offered on 6000/6000 draws and keyed on 0. And it is ALWAYS the middle
  option, which is algebra rather than luck: the three cards are `p = f/t`, its complement `1−p`,
  and `1/2`; if `p < ½` then `1−p > ½` and vice versa, and `p = ½` is excluded by the generator's
  own guard, so `1/2` lies strictly between the other two on every legal draw. The exploit is
  therefore *strike the middle, take the smaller*: the key is smallest on **90.3%** of draws and
  middle on **0.0%**. The item is WORSE after a child spots the dead card than before — 33% blind
  becomes 90.3%. Seven distinct option sets over 6,000 draws.
- **The obvious repair does not work, and this is the constraint to design around.** Letting the
  spinner be exactly half — so `1/2` becomes keyable — collapses the set: at `f = t/2` the correct
  answer, the complement distractor and the `1/2` card are all the same value. **A live `1/2` card
  and a complement distractor are mutually exclusive.**
- **`complementProbability` keys exactly `1/2` on 16.1% of draws with NO guard against it**, and
  `probabilityOfEvent` on 15.8% (four of its twenty-four cells collapse onto `1/2`). So a child
  answering "a half" *from the very misconception the week exists to break* is marked correct on
  roughly one item in six.
- **`eaPastTrialsChangeNext` is clean** and can be served close to as-is: correct distribution flat
  (25.8/25.1/25.1/24.0), wrong-vs-correct ordering NOT fixed (91.8/8.2), ratio NOT fixed (19
  distinct values).
- **The four generators are a spinner monoculture.** `CHANCE_ITEMS` holds **3** entries and is
  module-private (an `e23.ts` cannot import it). `probabilityOfEvent` is the only one that surfaces
  the full bag/jar/tin scene; `complementProbability` draws the pool but discards everything except
  `.target`, wrapping it in a hardcoded spinner sentence; the other two never touch the pool and are
  permanently "A spinner has N equal parts … green". Wire all four up as-is and the week serves
  three near-identical spinner sentences — the L24 defect that E22's §3(d) exists to prevent.
- **The corpus has ZERO child-facing chance prompts** — no dice roll, coin toss, spinner or blind
  draw in any of the 114 weeks — so E23 owns the mechanic outright. The raw noun counts mislead
  badly: `chance` (54 files) is mostly the `r.chance(` API call, `coin` (48) is the money domain and
  never a toss, `card` (56) is the app's answer-choice UI, and `flip`/`toss`/`shuffle` are RNG design
  commentary. Clean and unclaimed: spinner, even chance, lucky dip, dice roll, gumball, vending
  machine, capsule, sweets, jelly bean, traffic light, lottery, weather forecast, darts, hoopla,
  coconut shy. Already owned: b18 the sock drawer · b20/c07 lost property · c10 tombola · c24 bulbs
  and raffle · c12 skittles · e08 the word "penalty". And `ATTRIBUTE_PAIRS`' `['buttons','wooden']`
  (d09) is the exact pairing `CHANCE_ITEMS`' tin entry uses.

**The E18–E20 blocker is unchanged and is still an owner decision, not a week.** There is no
geometry family in `templates/lib/`. Do not start it inside a week; it needs a costed proposal.

---

## 2. THE STANDING FINDING, now six for six

**Every Level-E week since E15 has found its recipe-named item defective in the shared library, and
no gate reported any of them.**

| week | generator | defect | measured |
|---|---|---|---|
| E15 | `algebra.openOrClosedDotTrap` | key is the MAJORITY on both features every draw | 100.0% / 4,000 |
| E16 | `ratio.proportionalVsAdditiveTable` | key strictly BETWEEN the distractors on the last row | 100.0% / 4,000 |
| E17 | `ratio.percentOfVsPercentOff` | dead card + key is the larger of the rest | 83.9% / 5,000 |
| E12 | `algebra.equalAtOneXVsAllX` | one option set; key constant | 100.0% / 4,000 |
| **E22** | `stats.barGraphVsHistogram` | one option set; dead card offered 4000/4000, keyed 0.0% | 50.2/49.8 with it struck |
| **E22** | `stats.histogramBinRead` (the computable core, not the discrimination) | answer is a numeral its own prompt prints | 22.6% / 4,000 |

**ASSUME E23's `eitherOrFiftyFifty` IS GUESSABLE UNTIL YOU HAVE MEASURED IT.** It is the recipe's own
discrimination, it has never been served, and its whole subject — "either it happens or it doesn't,
so it's fifty-fifty" — is a claim that is FALSE under every draw, which is exactly the shape that
produces a permanently unkeyable card.

---

## 3. WHAT E22 ESTABLISHED that the next week inherits

**(a) A DEAD CARD CAN BE REPAIRED BY DRAWING THE QUESTION INSTEAD OF DELETING THE CARD.** E22's
recipe-named discrimination offered "either one, they show the same thing", keyed on 0 of 4,000
draws. Deleting it leaves a coin flip. Instead the QUESTION is drawn: one asks about a range (only
the histogram answers it), one about a name (only the bar graph), and one about the total — which
either display answers, because both group the same people and so must agree on how many there are.
The dead card becomes the truth on a third of draws, for a true reason. **This is the general
move: when a card is unkeyable, look for the draw that makes it true rather than for a replacement
card.**

**(b) "WHICH WOULD YOU READ" HAD TO BECOME "WHICH WOULD YOU HAVE TO BE HANDED".** Asked plainly,
E22's third question had TWO right answers — you really can total a histogram's bars to get the
number surveyed, so the card "the histogram" was also true. Nothing in the battery checks that
distractors are false (kit §E2.7; E17 enumerated and dropped such triples for the same reason).
Forcing the question to necessity made exactly one card true on every draw. **Check every
discrimination for a second defensible answer by hand.**

**(c) A PROBE CAN BE DECIDED BY A DRAWN WORD WITH NO MAGNITUDE ANYWHERE.** E15 proved a magnitude
probe cannot be made unguessable while it stays estimable; E16 gave the cure. E22 adds two things.
First, the obvious "shape" probe for a banded display — "will your answer come from one bar or more
than one?" — is a MAGNITUDE probe in a shape costume, because the span is a difference between the
two printed range endpoints and on a bounded axis the extreme endpoints are reachable by only one
span; it scores 59–67%. Second, **the predicate matters as much as the branch**: "could these bars
be put in any order and still be HONEST?" scores a child who reasons BETTER than the item as wrong
(if every band keeps its label, every read is still true), so it became "is the order a free choice,
or is it settled for you?" Served 50.4/49.6, with the branch phrase carrying one word count, three
character lengths and zero digits.

**(d) BIND A SHARED SCENE POOL TO A GENERATOR RATHER THAN DRAWING FROM IT.** With six frames in one
pool and every item picking independently, one served seed opened THREE of Day 4's four items with
the same sentence. Independent draws from a small pool cluster; hoping for spread is not a design.
Binding one frame per generator makes it structural — no two items on a day come from the same
generator, so no day can repeat a scene. Measured after: **0 of 2,500 served day pages**, down from
90. (The last 90 were the Day-5 error-analysis drawing the same frame as the fixed Day-5 task; it
now draws from a list that excludes it.)

**(e) READ THE SERVED WEEK. It found SIX things this session, and one of them was serious.**
- **A chain keyed a NEGATIVE answer on 8.0% of servings, minimum −10, on a mastery slot** — "how
  many more in the two bands under 30 minutes than in the band 45–59" with 4+5 against 19. The
  200-seed sweep, the validator and `tsc` all passed it. Rebuilt so positivity is structural: the
  two pools **overlap but do not nest**.
- An error-analysis whose shown figure was both the tallest band's count AND the named band's own
  edge — two defensible diagnoses on one page.
- `countNoun` printing "1000 steps" beside `fmtInt`'s "1,000–1,999" in one sentence.
- A spare quantity ("on each of 8 school days") that made its own scene incoherent — a pair could be
  counted more than once, so the display could not exist.
- One always/sometimes/never demand that could not fit three claims.
- Plus (d) above.

---

## 4. The verification protocol

**Use `HANDOFF-2026-08-21-LEVEL-E.md` §4 verbatim**, plus the 08-24 addition (measure the
discrimination's RANK distribution, not only the mastery slots), plus these three, each of which
earned its place this session:

1. **`npx tsx scripts/bb-probe-and-rank-test.ts --level E --seeds 60 --selftest` — ALWAYS with
   `--selftest`.** The control proves the detectors still fire against two known-defective
   generators before you trust a clean census. A clean run without the control is not evidence.
2. **GIVE EVERY DETECTOR A LIVENESS SENTINEL.** E22's answer-in-prompt detector reported the
   single-band read at 79.4% when that item's answer is on the page BY DEFINITION. Its digit
   boundary was `(?![\d.,])`, which refuses a match followed by a full stop — i.e. the last band of
   every display. Point each detector at something you KNOW it should flag, and do not believe a
   0.0% until the sentinel reads 100%.

   **On E22 that bug cost about a quarter of the leaks; it is not bounded there.** The E23
   pre-sweep ran the same check against `eaPastTrialsChangeNext`, whose prompt ends
   `"…is ${v.wrong}."` — so EVERY shown value is followed by a full stop and the naive boundary
   reports **0.0% where the truth is 100.0%**. A detector with this bug does not degrade; on the
   wrong prompt shape it reports perfection.
3. **VARY THE SEED LATTICE, NOT JUST THE SAMPLE SIZE.** E22 saw an apparent systematic skew in its
   discrimination's question surfaces and watched it "reproduce" at 800, 1,600 and 1,200 packs —
   but those runs all sampled seeds `i·7919+11`, so they are NESTED samples of one lattice and not
   three replications. On disjoint seeds the skew vanished (χ² 0.98 and 11.16 on 5 df). **A
   measurement repeated on a prefix of its own seeds has been repeated zero times.**

And one arithmetic check that no gate performs: **assert every served answer is positive and the
question is askable.** E22's negative-key defect was invisible to the sweep, the validator and
`tsc`, and took a four-line script to find.

---

## 5. Reported, not fixed — `lib/stats.ts`

All measured this session. All are shared-file changes and belong to whoever holds the orchestrator
role, with owner approval.

- **`eaTallestBarRead` names the SHORTEST bar on every draw.** `drawParams` sets
  `index = order[order.length - 1]` and `order` sorts DESCENDING, so the bar the question names is
  the smallest of three. The true answer is therefore the minimum of three distinct draws from
  3–14: measured 3 on 25.3%, 4 on 20.2%, … 12 on 0.4%, against the analytic C(11,2)/C(12,3) = 25.0%
  and C(10,2)/C(12,3) = 20.45%. **"Write the smallest number printed" scores 100%**, and the figure
  the student is shown is always the largest. This is the SAME defect the 2026-08-15 sweep repaired
  in `tallestVsAskedBar` — whose own comment records the repair — and the error-analysis twin was
  left behind. E22 applies the repair locally instead.
- **`tallestVsAskedBar` is not as healthy as the record says.** Rank over 4,000 draws: smallest
  24.4% / **middle 42.4%** / largest 33.3% — nine points past chance, over the corpus's five-point
  bar. It is recorded in the 08-24 brief as repaired and healthy; the repair fixed the dead-card
  half, not the rank.
- **`histogramBinRead` keys a numeral its own prompt prints on 22.6% of 4,000 draws** (the band
  edges are multiples of 5 or 10 and the counts run 3–18, so the collision is structural), and its
  prose is FIXED — every serving is the same sentence about reading times and readers, and
  "readers … books" is E21's `modeOfSet` one week earlier. E22 authors its core locally instead.
- **`graphRead('difference','pictograph')` keys the key itself on 32.3% of draws** — a gap of one
  symbol times the key IS the key, which the prompt prints. E21's choice of `combine` over
  `difference` was right for a reason its header only half states.
- **`barGraphVsHistogram`'s dead card is a legitimate lure and is NOT in `DECLARED_LURES`.** A bar
  graph and a histogram genuinely never show the same thing, so no draw can make that card true. It
  either belongs in that list with the argument written out, or the generator needs E22's repair.
- **`requireSimplestForm` is dead code** — carried from the earlier fill; still open.
- **`npm run lint` is broken repo-wide** — ESLint 9 wants `eslint.config.js`, the repo has the old
  `.eslintrc.*`. Not a content issue; it means lint has not run for anyone.

### The one library ADDITION worth costing

`stat_verify_bin_span_v1` — `correct` = the sum over a span of bands, `wrong` = the single named
band. About six lines plus one registered id. It would let E22 ship the error-analysis its recipe
actually names ("histogram bar read as one value") instead of the relocation it ships today, and it
would serve any future data-display cell. **It is genuinely not derivable from what exists**, and
the header of `weeks/e22.ts` decision 4 writes out why in full, including the two identities that
LOOK like solutions (`c0 = 2c1` with `+/−`; `c0 = c1²` with `+/÷`) and the measurements that kill
them — the first admits seven pairs over counts 4–19 with `correct ÷ wrong` taking exactly one
value, three, so "treble what the student wrote" scores 100%; the second admits two pairs in the
whole range. Read that before reopening the question; E14's precedent says adding the transform
beats borrowing a sibling's misconception, but it is a shared-file change.

---

## 6. Repository state

- Branch `best-brains-content-engine` at **`adcb2e8`** (E22) — **pushed**.
- `origin/main` is at `993c13d`, which **is** what production serves.
- E22 is committed and pushed but **NOT LIVE**. The path is: PR → `gh pr merge --squash` (plain
  `git merge` is classifier-blocked) → **reset the branch onto main after the squash-merge** (this
  is binding; see the PR-#6 memory) → manual deploy.
- **Nothing auto-deploys.** A deploy is a manual `npm run build`, zip `dist` with python's `zipfile`
  (`zip` is not installed in this WSL), and POST to
  `/api/v1/sites/4c6ca283-d712-41de-aba4-f206bdc0f496/deploys` with the token from the **Windows**
  netlify CLI config at `/mnt/c/Users/usthr/AppData/Roaming/netlify/Config/config.json`.

---

## 7. Other threads left open

1. **`--strict` for `bb-probe-and-rank-test` in the battery.** The corpus is clean (0 findings, 0 on
   a certifying slot, across 19 E weeks × 60 seeds with the control passing), so the switch can be
   thrown whenever somebody wants it to start failing rather than reporting.
2. **B14 is fixture-shadowed and absent from `GENERATED_WEEKS`**, so no gate that walks that list has
   ever measured it. Unchanged.
3. **a15** leaves Level A at 23/24.
4. **The Level-C times-table card** — four changes agreed with the owner and still unbuilt: open the
   table by default on all 40 table sheets; delete the 12-second auto-close; record `tableChecked`
   as "visible while answering" (it currently fires only on the 8 `covered` sheets); and — owner's
   call — stop covering products on the `covered` sheets.
5. **The Kumon return queue** — designed, unbuilt, depends on the `tableChecked` repair above.
6. **The Fable verdict session** on the micro-animations (`d46c81d`), still owed.
7. **The scratch pad's pen-size picker** was removed to fit one row; "More space" was measured, cost
   40–60px of canvas, and was NOT shipped.
