# Best Brains — Level A handoff, 2026-08-10

Supersedes `HANDOFF-2026-08-09-LEVEL-A.md` for state; that file's §1 (model tier)
and §6 (how to author) still apply and are not repeated in full. Read
`HANDOFF-2026-08-07.md` for the program frame.

**Nothing is merged.** 13 commits on `best-brains-content-engine`, `cba26e8`
through `0da761f`. The 12 pre-existing untracked files are untouched, as always.

---

## 1. MODEL TIER — unchanged, and it kept paying

| Work | Model |
|---|---|
| Main/orchestrator thread | **Opus 5** — coordinates and INDEPENDENTLY VERIFIES. Run every gate yourself; check every agent claim. Three of today's sharpest catches were agent claims that turned out to be wrong or incomplete. |
| Authoring / repairing a week | **Opus 5** sub-agent, one at a time (`bb-agent-budget.ts` prints **1**) |
| Shared-lib, renderer, validator, DB | **Opus 5, in the MAIN thread.** Agents report; the orchestrator fixes. |
| Reader evaluation / style gate | **FABLE 5** sub-agent, always |
| Pedagogical-ceiling, completeness, child-safety review | **FABLE 5** |

The Fable 5 reader evaluation cost one run and found the defect of the session
(A20's pools) plus the mastery-threshold arithmetic nobody had noticed in 120
cells. Spend it after every batch.

## 2. Where Level A is: **6 of 24**

| Week | State |
|---|---|
| A1 Counting 1–5 | shipped; **4 formA + 3 formB certifying slots still fail entropy** |
| A2 Counting 6–10 | shipped; **1 formB slot fails** |
| A6 Ordering to 10 | shipped, gates green; a false `isomorphNotes` no-reuse claim is unfixed (below) |
| A11 Patterns | shipped, judged **ACCEPT** both seeds — "the best generated week I have seen from this system"; **2 formA + 1 formB slots fail** |
| A12 Partners of 5 | shipped, judged ACCEPT, then repaired twice; **all slots clear** |
| A20 Weight & capacity | shipped, judged HUMAN_REVIEW, repaired; **all slots clear** |
| A3–A5, A7–A10, A13–A19, A21–A24 | **NOT STARTED — 18 weeks** |

Reader evaluation: **6/8 clean ACCEPT (75%)**, target ≥80%. ~880 recomputations,
**zero** wrong answers or distractors anywhere. All findings were claim-level.

## 3. THE QUEUE, in order

1. **The 11 open certifying slots** — A1 (7), A11 (3), A2 (1). All the same
   defect: a band-A numeric item with no authored `choices` gets four
   runtime-invented buttons, and the generator cannot know the item's answer
   RANGE, so it offers values the slot can never key. **Fix: author 3-option
   misconception-faithful choices on every certifying slot.** A12's repair is the
   worked example — copy its `withPartnerChoices` shape. Do NOT declare a lure in
   a certifying slot; that was refused twice today, for A11 and A12.
2. **A6's `isomorphNotes`** claims "no number, direction or run is reused from
   Form A or the daily pages" — false at both seeds ((7,after) appears in a daily
   AND a mastery slot; seed 33 has MA-02 and MA-03 both before-4→3). Either
   enforce or rewrite the claim.
3. **A3 and A8 substitute discriminations** — one FABLE 5 design pass. Both
   recipes are structurally unbuildable (§5). The capability map is written:
   `scratchpad/a3-a8-capability-map.md` if it survives, else re-derive from §5.
4. **Fan out the remaining 18 weeks**, one agent at a time, ~45–50 min each.
   Batch of 4, then a Fable 5 reader evaluation of that batch, then repairs, then
   re-judge. A15 must MIRROR `fixtures/mfm-a15.ts`. **A4, A9, A10, A13 need a
   `deepeningDelta`** — measured, and note A22 and A23 do NOT (the 08-09 handoff
   was wrong about A23).
5. **A5 is unblocked** — the `spread` primitive landed (§4).
6. Re-judge every repaired week.

## 4. WHAT WAS BUILT TODAY (tools you now have)

- **`CountersParams.groups[].spread`** — multiplies ONE row's spacing, counters
  unchanged in size. Unblocks A5's conservation trap ("a long row of 5 beside a
  tight row of 6"), which was structurally undrawable. Proven inert: 433/433
  existing figures byte-identical. Proven to work: 5-spread row 228.8 units wide
  vs 6-tight at 130, single counter radius.
- **`hundredChart({start, rows, highlight, blank, alt})`** in `lib/figures.ts`,
  on a new `AreaGridParams.shadedCells`. `blank` is the parameter that decides
  whether the chart teaches or cheats — see §6.
- **Full-screen scratch pad** — pins the prompt AND the figure above the canvas,
  with replay-aloud. Pass `item` to `BBScratchPad` to enable it.
- **Band-A acknowledge entry** — `manual-review` renders one "I did it!" tap, not
  a keyboard. It was already ungraded; the keyboard was pure harm.
- **`bb-spoken-answer-test`** (from 08-09) and its `--selftest`.

## 5. STRUCTURAL BLOCKERS (a feasibility sweep of all 22 recipes, do not re-derive)

- **A3** "correct 3 vs mirrored 3" — blocked THREE ways: no numeral-glyph
  primitive; a reversed 3 is not an ASCII character so it cannot be an option
  string; and its alt would have to name the digit on an autoplay band. **A new
  renderer would not rescue it.** Substitute needed. Strong candidate: ZERO is
  A3's genuinely new content (A1 was 1–5; the catalog says "writing 0–5") and an
  empty five-frame is both drawable and speakable.
- **A5** — WAS blocked, now fixed by `spread`.
- **A8** — only HALF blocked. Sorting is fully drawable today (`counterGroups`
  with per-group icon + label). Above/below is expressible honestly as ROW ORDER:
  the compare branch stacks group 0 above group 1, verifiable from params.
- **NOT blocked, despite appearances:** A11 (`patternNext` does emit a figure),
  A19/A20 (`compareMeasure` compares through a common unit — better than a drawn
  balance), A21 (`solidChoice` is deliberately text-and-choice; pair it with a
  pictorial item that day).

## 6. THE LESSONS THAT COST THE MOST (L48–L53 in LEARNINGS.md)

Every defect of consequence today was **a check that was not running**, not a
wrong answer. In order of what they'd cost you again:

1. **A gate must measure the surface the CHILD TOUCHES, not the artefact the
   author wrote.** `tapOptionsFor` invented four buttons at render time and always
   put the answer second-smallest — **100% of 7,440 Level-A items**, over half the
   level tappable without counting — while six gates said PASS, because they all
   stop at the pack boundary. `bb-answer-entropy-test` now projects those buttons
   in. (L53)
2. **A green board is only as wide as the gate list you run.** `bb-family-test`
   is not in the seven-gate list and had been failing 180× since morning on a
   regression I introduced. **The standing list is now NINE:** verify-packs ·
   readability · answer-entropy · spoken-answer (+`--selftest`) · cross-week
   `--strict` · **bb-family-test** · **bb-qg13-test** · figure-render · `tsc`.
3. **Audit a gate's ENABLEMENT list as hard as its logic.** `'set'` answers were
   never arithmetically checked; `V2_WEEKS` had never been regenerated so A1/A2
   were validated as v1; `FIGURE_DEBT` held four permits matching nothing. (L49,
   L50)
4. **Measure the property a child MEETS — per pack, not per draw.** A20's pools
   were balanced on average and gameable on every page. Deal balances from the
   pack's own guard before any page is built. (L52)
5. **Ask whether guessing rewards the misconception the week teaches against.**
   `compareMeasure` keyed the heavier-LOOKING object 73% of the time in the week
   whose whole point is "bigger ≠ heavier". Every gate passed it; the entropy gate
   EXEMPTS comparison items. (L51)
6. **A number word is a number, wherever it appears** — three instances (the
   spoken alt, "one number missing", the plural "the ducks"). (L48)
7. **The dangerous figure is the HELPFUL one.** A fully-labelled hundred chart
   answers "what sits below 87?"; blanking only that square makes it an
   interpolation puzzle, so blank the whole ROW.
8. **`bb-verify-packs` cannot see a week until the orchestrator wires it in.**
   Wire, THEN verify — as an explicit step. Three weeks passed it by luck.
9. **When a constant says it is mirrored somewhere, the mirror is part of the
   change.** The threshold sat in `constants.ts` AND in the SQL RPC.
10. **When a regression harness reports a failure, check the harness first.** A
    probe forcing `contract: 'v2'` "found" D17 broken; D17 is a pinned v1 fixture.

## 7. OWNER DECISIONS TAKEN (do not re-open without asking)

- **Mastery pass 85 → 80.** 85% over a 6-item form demanded a perfect score; 5/6
  is 83.3% and failed, on all 120 cells, and fast-track was unreachable. Changed
  in `constants.ts` AND in the live `bb_score_mastery_check` RPC (migration
  `20260810000001`). 5/6 passes, 6/6 fast-tracks.
- **Parent strip: Day 5 only.** `FILL-ARCHITECTURE.md` §1 amended to match the
  validator and renderer. No week should disclose this any more.
- **A5 → extend the primitive. A3/A8 → substitute discriminations.**
- **Approved but NOT YET BUILT:** (a) record "solved independently" =
  first-attempt AND no hint — `hintRungsUsed` and `attemptNo` are ALREADY
  persisted per attempt, so this is a derivation, not new plumbing; (b) an
  engine-chosen spaced re-check of 1–2 warm-up items from concepts passed 2–4
  weeks ago, weighted by how shakily they passed, in a DIFFERENT representation;
  (c) a two-tier "passed" vs "passed with support", parent-visible only.
  **Note:** the parent report already TELLS the parent a passed concept "now
  joins the warm-up rotation" — and no such rotation exists. (b) makes that
  sentence true; until then it is a promise the software does not keep.

## 8. LIVE SURFACES TOUCHED TODAY (Level B is in use by a real child)

- `bb_score_mastery_check` RPC — threshold 80. Verified after: c_fast 95 and
  c_stability 75 unchanged, function otherwise byte-identical.
- **B1, B10, B13** — 13 items that named the hundred chart and drew nothing now
  draw one, with the answer's row blanked. 715,513 checks confirm the answer's
  numeral appears in zero printed cells. **Two things want a human eye on the
  real device:** B1's chart is 12 rows, squeezing 3-digit labels to ~8.8px; and
  B10-PZ-01 says "a number holding 8 tens" where the drawn row is 81–90.
- `AnswerEntry.tsx`, `BBScratchPad.tsx`, `CountersFig.tsx`, `AreaGridFig.tsx`.

## 9. KNOWN-OPEN, MEASURED, NOT YET FIXED

- **Entropy `--level A` is RED on 11 slots, deliberately.** It is a new detection
  of a pre-existing condition, left visible rather than carved out.
- **14 band-A items still show a keyboard**: 12 `number-sentence` in the PINNED
  A15 fixture, 2 `set` ("Show all the ways to make 5"). Both are graded so
  neither can become an acknowledge. Right fix: make the picture the input — tap
  cells in the frame, tap digits for a sentence.
- **~68 items name a manipulative they do not draw** (26 hundred-chart — now
  fixed — 30 number-line/path, 12 ten-frame). The detector is measured but NOT a
  gate: it over-fires on stories ABOUT a manipulative ("Ravi worked out 9 + 5 on
  a ten-frame"), which need no picture. Needs a human read before it can block.
- `figureValue` for `area-grid` reads `shaded`/`shadedRows`/`shadedCols` and
  never `cellLabels`/`shadedCells`, so a chart cannot assert anything.
- No two-pan balance primitive (blocks B6/B7/B15's balance-scale algebra).
- No `cup` counter icon — capacity pictures draw dots while the audio says cups.
- `a_verify_countup_slip_v1` alias would document A6/A12's honest template reuse.
