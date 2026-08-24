# HANDOFF 2026-08-24 — Level E fill, resuming at E17

Written at the end of the session that shipped **E15** and **E16**. Supersedes
`HANDOFF-2026-08-21-LEVEL-E.md` (which still reads E at 14/24); that file's method sections stand
and §4's verification protocol is unchanged and still mandatory.

---

## 1. Where the corpus actually is

**111 of 120 weeks.** A 23/24 (a15 missing) · B 24/24 · C 24/24 · D 24/24 · **E 16/24**.

Level E holds: E1–E11, E13, E14, **E15**, **E16**, E21.

| Missing | Concept (catalog) | State |
|---|---|---|
| **E12** | Equivalent expressions | unblocked · **R-flagged** · the only hole left in the on-thread E10–E17 run |
| **E17** | Percent applications | unblocked · **cheapest next** |
| E18 | Area of polygons | **BLOCKED — no geometry family** |
| E19 | Circles | **BLOCKED** · also R-flagged (measure-π lab) |
| E20 | Surface area & volume | **BLOCKED** |
| **E22** | Data displays | unblocked · R-flagged (build-a-histogram) |
| **E23** | Probability | unblocked · R-flagged (invent-a-fair-game) |
| **E24** | Pre-algebra capstone | unblocked · R-lite |

**Why E17 is the cheapest next week.** Every generator its recipe names already exists in
`templates/lib/ratio.ts`: `percentOfCount`, `percentOffPrice`, `percentConversion`,
`percentOfVsPercentOff` (the recipe's discrimination), `msDiscountThenTax` (the native money chain,
and the family's only `multiStepDec`), `stackedPercentTrap` and `eaPercentPointDrop`. It is
blueprint-only. **Measure `percentOfVsPercentOff` and `stackedPercentTrap` before serving either** —
see §3.

**E12 is the harder of the two unblocked cells**, and it is worth saying why rather than
rediscovering it: it is R-flagged (the prove-in-general part ships as `manual-review`, §7), and it
has **no dedicated multi-step generator** — `evaluateBothAtX`, `equalAtOneXVsAllX` and
`eaDistributeOnce` are all single-step, so both of the E-gate's required chains have to be authored
locally. Its verify twins (`e_alg_verify_distribute_v1`, `e_alg_verify_agreement_v1`) are registered
and unused, waiting for it.

**The E18–E20 blocker is unchanged and is still an owner decision, not a week.** There is no
geometry family in `templates/lib/`. Do not start it inside a week.

---

## 2. Read these before writing a line

Unchanged from the 08-21 handover §2, with one addition: read **`weeks/e15.ts` and `weeks/e16.ts`**
as the current exemplars. E15 is the algebra-family shape, E16 the ratio-family shape, and both
carry the measurement discipline §3 below describes.

---

## 3. WHAT THESE TWO WEEKS ESTABLISHED — read this before authoring another E cell

**(a) THE RECIPE'S NAMED DISCRIMINATION HAS BEEN GUESSABLE IN THE LIBRARY TWICE RUNNING.** Both
weeks found their own recipe-named discrimination scoring 100% blind, and in both cases no gate
reported it:

| generator | defect | measured |
|---|---|---|
| `algebra.openOrClosedDotTrap` (E15) | key is the MAJORITY on both features (circle, direction) on every draw | 100.0% / 4,000 draws |
| `ratio.proportionalVsAdditiveTable` (E16) | key sits strictly BETWEEN the two distractors on the last row of every draw | 100.0% / 4,000 draws |

Neither is served. Each week authors a local replacement that **draws the rank or the pairing
first** and then picks the distractor parameters to realise it. `bb-answer-entropy-test` cannot see
either — the keyed text moves, no option is dead, the key sits at no fixed position — and
`bb-guessability-test` flags the second only under its card-identity metric, which also flags
legitimate items. **Assume the next recipe-named discrimination is guessable until measured.**

**(b) A METACOGNITION PROBE SHOULD ASK ABOUT THE SHAPE OF THE ANSWER, NOT ITS SIZE.** E15 spent
three attempts learning this. A magnitude probe's answer is a function of the numbers on the page,
so **one of them always carries the bit** — six draw variants and a dilution term, simulated over
200,000 rows each, bottomed out at 62.3%, against ~60% for the corpus's own b11 repair. A probe
about the shape (does the boundary count? does this start from nothing?) has no magnitude for a
habit to read. E16 applied it first time: probe split 49.3/50.8, every habit at chance.

**And measure the habit you did not think of.** E16's probe was clean on every magnitude and still
100% guessable by **counting how many numbers the story printed** — one branch stated a call-out
charge and the other omitted it. Fixed by stating the charge as `0 credits` in the proportional
branch, which made both stories the same sentence differing in one value — better teaching as well
as a better probe (it is literally `c = 0`).

**(c) READ THE SERVED WEEK. IT FOUND SOMETHING BOTH TIMES.** E15: a script segment promising "the
pair of drawings" with one figure attached; a guided example asking the child to draw exactly what
the figure beside it already drew; two vocabularies for one picture inside one week. E16: the same
given point (and so the same picture) on two consecutive days; two warm-ups dividing by 5; two
consecutive days opening on the same mortar mix. None of it is visible to any gate.

**(d) THE POOL SIZE OF A SHARED CONTEXT LIST IS A DAY-PLAN CONSTRAINT.** `ratio.ts`'s `RATES` holds
four frames and is drawn by `unitRate`, `constantOfProportionality` AND `msFindKThenPredict`. E16
serves four RATES items, so the day plan is built around **at most one RATES item per day** — that
constraint, not taste, fixed its shape. Check the pool size of any list your generators share before
placing items.

**(e) RUN YOUR OWN TOKEN-OVERLAP SCAN, AND SCAN AGAINST YOUR OWN LAST WEEK.** E16's scan found it had
borrowed a line from E15 — which E15 had itself written to fix a borrowing from E13/E14. The
`schoolSyncHook` formula ("if your child's class writes X as A or B, tell us and we will match…") is
shared by c06, c09, e01, e13, e15 and e16 and is the field's established shape, not borrowed voice.

---

## 4. The verification protocol

**Unchanged — use `HANDOFF-2026-08-21-LEVEL-E.md` §4 verbatim.** Both steps that are easiest to skip
(READ the served week; MEASURE rather than reason) paid for themselves again this session.

One addition to step 6: **measure the discrimination's rank distribution**, not only the mastery
slots. Both library defects above are rank defects on a teaching-slot item, which is exactly the
class `bb-answer-entropy-test` counts as report-only.

---

## 5. Reported, not fixed

- **`algebra.openOrClosedDotTrap`** — 100% majority-vote (see §3a). Owner decision: repair the
  library or leave the two local replacements standing.
- **`ratio.proportionalVsAdditiveTable`** — 100% middle-rank (see §3a).
- **`algebra.eaFlipWhenAdding`** prints *"They took 11 **units** off both sides"* on a pure-number
  inequality, which has no units.
- **`ratio.eaTableAsProportional`** fixes `b = 2`, so every serving says "plus 2" and pairs 2 with 4.
  The mathematics is sound and elegant (x = 2 is exactly the row where both readings agree); only
  the framing never varies.
- **`algebra.twoStepEquation`** — the 08-21 handover's report re-confirmed with a fresh instance:
  *"Leo fills 3 pages of photos … and 17 photos stay loose"*, 11 per page against 17 loose, plus "in
  each page" for "on each page".
- **`applyRetrievalRamp`** (packGenerator.ts) removes a Day-1 warm-up after ids are assigned, so
  every week serves a Day-1 id gap (`D1-03` absent). Pre-existing and identical in E14.
- **`requireSimplestForm` is dead code** — still open, carried from the earlier fill.
- **`npm run lint` is broken repo-wide** — ESLint 9 wants `eslint.config.js`, the repo has the old
  `.eslintrc.*`. Not a content issue; it means the lint script has not run for anyone.

## 6. Repository state

- Branch `best-brains-content-engine`. `origin/main` is at `6770b03` and is what production serves.
- The branch carries E14 (`9c35da5`), E15 (`8d242db`), the times-table/TTS fixes (`d27f22f`) and
  E16 — **none of it is merged**, so none of it is live.
- **Nothing auto-deploys.** A deploy is a manual zip + Netlify API POST (`zip` is not installed in
  this WSL; use python's `zipfile`).

## 7. Other threads left open

1. **The Level-C times-table card.** Four changes were agreed with the owner and are **unbuilt**:
   open the table by default on all 40 table sheets; delete the 12-second auto-close; record
   `tableChecked` as "visible while answering" (it currently fires only on the 8 `covered` sheets, so
   the peek signal reads "never checked" on the other 32); and — owner's call — stop covering
   products on the `covered` sheets. See the times-table memory.
2. **The Kumon return queue** — designed, unbuilt. Depends on the `tableChecked` repair above.
3. **The Fable verdict session** on the micro-animations (`d46c81d`), still owed.
