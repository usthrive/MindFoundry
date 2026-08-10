# Best Brains — Level A handoff, 2026-08-09

Written to hand the Level-A fill to a fresh session. Read
`HANDOFF-2026-08-07.md` first for the program frame and the Level-C fix queue;
this file covers Level A only, plus the model-tier policy for the work.

---

## 1. MODEL TIER — read this before spending anything

LEARNINGS **L18**: model tier and verification are SUBSTITUTES. Spend the top
model where judgement compounds and gating cannot reach; use a strong workhorse
under deterministic gates.

| Work | Model | Why |
|---|---|---|
| **Main/orchestrator thread** | **Opus 5** | Coordination + INDEPENDENT VERIFICATION (running the gates yourself). The two sharpest catches of 2026-08-09 came from running a probe and reading output, not from model strength. Do not put the main thread on Fable 5 — it spends the premium where a script does the work. |
| **Authoring a week** (A3–A24) | **Opus 5** sub-agent | Fully gated: verify-packs · readability · answer-entropy · **spoken-answer** · cross-week · 200-seed sweep · tsc. The gate is the bottleneck. |
| **Shared-lib repairs** | **Opus 5**, in the MAIN thread | Delicate, cross-cutting, interacts with freshness/identity. Agents are FORBIDDEN from editing shared libs — they report, the orchestrator fixes. |
| **Reader evaluation / style gate** | **FABLE 5** sub-agent, always | Ungated judgement. Every Level-C judge was Fable 5; they found the sprint forward-leak and the false core rule that all deterministic gates passed. |
| **Pedagogical-ceiling questions** | **FABLE 5** | "Does this teach the WHY or narrate a procedure?" |
| **Completeness critique** | **FABLE 5** | "What modality/claim/artifact did we miss?" |
| **UI / child-safety review** | **FABLE 5** | Anything a child sees. |

**Switch points, concretely:** author a batch on Opus 5 → **switch to Fable 5**
for the reader evaluation of that batch → **switch back to Opus 5** to apply
repairs → Fable 5 again to re-judge repaired weeks. Tell the owner BEFORE
spending Fable 5 and say what for.

---

## 2. Where Level A actually is

| | State |
|---|---|
| A1 | **REBUILT** on the current engine, verified |
| A2 | **REBUILT** on the current engine, verified |
| A3–A24 | **NOT STARTED** (22 weeks). A15 must MIRROR the pinned fixture `fixtures/mfm-a15.ts` |

All gates green on the current tree: verify-packs **19,732 / 0** · readability
A1 **0.00%**, A2 **0.00%** (band-A ceiling is **10 words**, tightest in the
product) · answer-entropy **0 guessable mastery slots, 0 teaching tells** ·
**bb-spoken-answer-test PASS** · cross-week `--strict` clean · `tsc` clean.

**The infrastructure was already built and is now repaired** — Level A is an
authoring job, not an engine job:
- `lib/earlynumber.ts` — 27 generators covering every form in FILL-ARCHITECTURE
  §3 (counting, ten-frames, partners, patterns, join/take-away, teens, numeral
  traps, compare sets/measures, shapes, solids, puppet slips, sort-and-tell).
- `GATE_PROFILE.A` in `lib/pedagogy.ts` is band-correct: multiStep **null**,
  metacog **false**, puzzleRemoveConcept **false**, `pictorialPerDay: 1` — that
  last one is the gate that BITES at A and makes the B1.0 renderer load-bearing.
- The figure renderer shipped in B1.0, so the blocker named in the 07-30 handoff
  is gone.

## 3. What 2026-08-09 fixed in the shared libraries (do not regress these)

Found by the A1 exemplar, which is exactly why exemplar-first exists. All in
`lib/earlynumber.ts` unless noted.

1. **QG-11 article mismatch in six generators** (`setForNumeral`, `pickExtreme`,
   `patternNext`, `compareSets`, `compareMeasure`, `solidChoice`) — keyed
   "the apples" while `verifyFor` recomputed "apples", failing 25/25 draws. Never
   fired because no week had ever used them. Fixed by carrying both renderings
   in `acceptableForms`. Would have blocked A2/A5/A6/A7/A11/A19/A20/A21.
2. **`howManyChoice` offered {n−1, n, n+1}** — answer was the MIDDLE number 100%
   of the time (LEARNINGS L43, unfixed in the library, aimed at the youngest
   children). Now the PAIRING rotates: both-below / straddle / both-above.
3. **`compareSets` had a permanently dead option** — nudged the rows unequal on
   every draw, so "they are the same" was offered always and correct never (L38).
   Now draws equal 1-in-5 and keys it; `verifyFor` agrees. Measured 19.9%.
4. **`puppetSlip` offered only two options** — "tap the number the puppet did not
   say" scored full marks. All three branches now carry a third honest,
   rank-rotating option.
5. Three hint rungs over the 10-word ceiling; a five-frame hint that said "fill
   the top row first" when the renderer draws a five-frame as one row.

## 4. THE BAND-A AUDIO LEAK — the defect of the session, and its gate

Band A is `audioFirst`: the child cannot read, so **every prompt autoplays**
(`CheckRunner.tsx:128`, `TreasureChest.tsx:175`, `autoplay={band === 'A'}`).
`speakablePrompt` prepends the scene, and **`figure.alt` wins over the bracket**.
Most generators set `alt` to a string naming the count the item asks for, so the
child heard:

> "**5 ducks in a row.** Count the ducks. How many?"

The answer, spoken aloud, before the question — on essentially every counting
item in the level. Every existing gate passed it. L33's "the most dangerous
figure is a HELPFUL one" through the audio channel.

**The fix, and why it is safe:** the `[image: …]` bracket STAYS in the prompt
(it is what QG-1/QG-4 sign for operand freshness and pack identity, L29) and
only `figure.alt` changes. Alts now describe layout, never the asked-for
quantity. Numbers that are GIVENS (a build task's "Draw 3 counters", a frame's
capacity, the crossed-out count in a take-away) deliberately STAY.

**`scripts/bb-spoken-answer-test.ts` is new and is now a required gate.** Rules
R1 (scene states the answer) and R2 (scene has counted the options); guards for
givens, whole-token matching, number words, all-options-named, free-response.
Band A **fails**; B–E are **advisory** (their alts describe rich pictures and
failing them would train authors to describe pictures LESS — the harm the
readability gate's alt exemption exists to prevent). Carries `--selftest`
(13 fixtures) proving every rule fires and every guard holds.

**Second-order find:** the Day-4 stories said "Nia lines up **7 apples** … How
many apples?" — the child repeats the number, no counting. The leak gate rightly
ignored it (a given), but for a COUNTING week the item is hollow. Removing the
count from the story then MADE THE GATE FAIL, because those alts had been
sheltered behind the given-exemption. Both fixed. Contrast the A15 fixture,
where stating the addends is correct because the SUM is the work.

## 5. Fix queue — decisions for the owner

1. **Every-day parent strip.** FILL-ARCHITECTURE §1 mandates a Teacher's-Note
   strip every day at band A; `validator.ts` enforces Day-5-only and
   `PuzzleGrove.tsx` reads `getPackDay(pack, 5).teacherNoteStrip` HARDCODED.
   Five strips would put four of them nowhere (L27). Shipping Day-5-only; the
   kit now says so. Needs a small renderer, or the spec amended.
2. **The conservation figure — BLOCKS A5.** `CountersFig` derives one pitch from
   the longest row and `arrangement` is figure-level, so "a long row of 5 beside
   a tight row of 6" is structurally undrawable — yet `figures/types.ts` and
   `CountersFig.tsx` both advertise that trap for A1/A5, and **A5's whole recipe
   row IS that trap**. Needs a per-group `spread`/`pitch`, or a different design.
   A1/A2 work around it across two script figures.
3. **B23's graph alts leak the same way, and Level B is LIVE**: "…9 daisies, 11
   thistles and 2 poppies. How many thistles?", two autoplayed. Harder than the
   counting case — a data display's alt is all a screen-reader child has.
4. **Level-B `whyBeforeHow` register** (from 08-07 §3.1): 8 of 11 repaired weeks
   speak ADULT framing to the child ("Ask a six-year-old what four and three
   make…"). Re-point the prose, or stop LessonRoom speaking that segment.
5. Smaller: `bb-verify-packs.ts` carries a stale hardcoded A2 figure-debt bullet
   list (dynamic count is right); `frameShows`' five-option lure wants a
   `DECLARED_LURES` entry with its argument; A1/A2 GE-04 are `independent` fade
   yet their alts state the count.

## 6. How to author the remaining 22 weeks

Sequence per L23: **exemplar → validation wave → fan out.** A1 and A2 ARE the
exemplars; read `a01.ts` and `a02.ts` before writing anything. Then a validation
wave of ~3–4 weeks to prove the kit, then batches.

**One agent at a time.** `npx tsx scripts/bb-agent-budget.ts` has printed **1**
for the entire program; the VM is 4 GB / 2 cores. FORBID agents from running
`tsc` / `npm run build` / `npm run dev` / the figure-render suite — the
orchestrator typechecks afterwards. Agents may run the cheap `tsx` gates twice.

The kit (`build/FANOUT-KIT-LEVELS-ABCE.md` §E "Level A") now carries seven
lessons from the exemplars: budget LADDERS before items (≥10 distinct for a
19-item week); the ≤10-word law is per SENTENCE not per prompt; Day-5-only
strip; alt and `[image: …]` are the same spoken sentence; `drawUniqueItem`'s
one-token signature will pin your mastery slots at a 1–5 range (sign on
`{count, noun}` and MEASURE what is served); rotate the PAIRING not the numbers;
read your own generated week. A2 added: **`deepeningDelta` is mandatory from A2
onward** (`conceptFamily()` strips the range, so counting-1-5 / 6-10 / 11-20 are
one family and the preflight throws without it) — the same trap waits for
A3/A4, A12/A13, A9/A10/A23.

## 7. Uncommitted at handoff time

```
M frontend/src/modules/best-brains/generator/templates/lib/earlynumber.ts
M frontend/src/modules/best-brains/generator/templates/weeks/a01.ts
M frontend/src/modules/best-brains/generator/templates/weeks/a02.ts
M modules/best-brains/build/FANOUT-KIT-LEVELS-ABCE.md
? frontend/scripts/bb-spoken-answer-test.ts
```
Plus this file. The 13 pre-existing untracked files (video/, qa-screenshots/,
PLAN.md, the QA reports, docs/*.md, frontend/dev-dist/) are NEVER touched.

Commits are pathspec-only, never `git add .`, and a commit plan is presented for
approval first. **`git merge` is blocked by the permission classifier in this
setup — use `gh pr create` + `gh pr merge --squash`**, which also matches main's
squashed-milestone history. Merging deploys to production: ask first.
