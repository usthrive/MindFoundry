# Screen-layer QA — report, 2026-09-04

Answers `BRIEF-2026-08-31-SCREEN-LAYER-QA.md`. Branch `best-brains-content-engine`
from `2f46483`. Everything below is measured on served packs or photographed in
Chrome; nothing is shipped on reasoning. The change set is in §7 (committed on the
branch after owner approval, 2026-09-04); A.2 awaits the owner's ruling (§3).

## 1. What the brief got right, and the one thing it got backwards

The brief's numbers reproduce exactly: warm-up built for ONE question on 97/120
Level A days and 84/120 Level B days; `pageCount` written as items-per-page in the
assembler and read as pages on the screen; 18 of 23 screens unmentioned by any
script (re-counted: 18).

The seam finding is sharper than the brief's. `pageCount` is a NUMBER OF PAGES at
every end but one — `types.ts` ("1–3 pages"), QG-6 ("1–3 pages/day", spec §QG-6),
both served fixtures (A15 writes 2, B14 writes 3), and `PracticePage`. The single
odd end is `assemble.ts`, which wrote items-per-page. So the fix belongs at the
WRITER, not at `perPage` as the brief suggested: changing the reader would have
broken the fixtures and the type contract to match one wrong constant.

And what a child SEES is smaller than the brief feared. `PracticePage` shows one
problem in focus at a time (P2) regardless of pages. `pageCount` drives exactly two
things: the header label "page k of N" and the sprint-offer boundary (`nextPage >
page`), which Level A never reaches. The photographs prove it — the before/after
pixel difference at band A is 95 and 188 pixels, all inside rows 41–52, the header
line; the problem, figure, hint ladder and answer buttons are byte-identical.
"Every item crammed onto one page" was never what the screen did; "page 1 of 1" on
every item was. That is still wrong and still fixed, but its cost to a child was a
label a pre-reader cannot read, not a wall of problems.

## 2. A.1 — measured before and after

Served packs, seed 12345, per level (days):

| level | pageCount written before | practice items/day | screen before (perPage → label) | screen after |
|---|---|---|---|---|
| A (120) | 1 ×115, 2 ×5 (A15 fixture) | 3 ×105, 2 ×8, 4 ×6, 5 ×1 | 3 per page → "page 1 of 1" on every item (115 days) | 1 per page → "page k of 3" (or of 2/4) |
| B (120) | 2 ×118, 3 ×2 | 3 ×57, 4 ×57, 5 ×6 | 2–3 per page → "of 2"; "of 3" never reached on 2 days | unchanged except those 2 days now reach page 3 |
| C/D/E | 2 | 3–5 | 2–3 per page → "of 2" | unchanged (0 differing pixels) |

Photographs (`bb-screen-visual.ts`, harness-mounted PracticePage, 430 px viewport,
Chrome 1× DPR):

| shot | before header | after header | pixels changed |
|---|---|---|---|
| A2 Day 2 item 1 (band A) | Day 2 · page 1 of 1 | Day 2 · page 1 of 3 | 95, rows 41–52 |
| A2 Day 2 item 3 | Day 2 · page 1 of 1 | Day 2 · page 3 of 3 | 188, rows 41–52 |
| A1 Day 2 item 4 of 4 | page 1 of 1 | page 4 of 4 | — |
| A15 Day 2 (served FIXTURE) | page 1 of 2 | page 1 of 2 | 0 (fixture untouched, see §2.2) |
| D1 Day 2 item 1 (band C) | page 1 of 2 | page 1 of 2 | 0 |
| B2 Day 1 items 1–4 (4 items, 3 declared pages) | 1,1,2,2 of 3 | 1,1,2,3 of 3 | 85, rows 41–52 on item 4 |

Tap targets at band A: minimum 48 px on PracticePage (Done for now / Anchor), 80×80
answer tiles, 56 px audio; WarmUp minimum 56 px. Resume-at-item (`completedIds`
walk) lands on the right item at every `done` count tried (0–3), with the label
following. The full-page screenshot is exactly the 900 px viewport at every shot —
nothing scrolls off.

### 2.1 What the gate found that the brief did not: the SCREEN side had a bug too

With honest page counts the new gate immediately failed two Level B packs: B2 and
B14 Day 1 declare 3 pages for 4 practice items (hand-written `makeDay(..., 3, ...)`
in `weeks/b02.ts:334`; the B14 fixture). `PracticePage` sized pages by
`ceil(items / pageCount)` = 2, so page 3 was never reached — the child read "page 2
of 3" on the last item. Photographed before (items 1–4: pages 1,1,2,2) and after
(1,1,2,3). The fix spreads items evenly over the declared pages
(`pageOf(i) = floor(i·pageCount / items) + 1`) and clamps `pageCount` to the item
count, so every "of N" is reachable for any pack. b01/b02 are the only two weeks
that call `makeDay` directly with literal page counts; all others go through the
assembler.

### 2.2 The A15 fixture — a standing exception, reported not fixed

`MFM_A15` is the served pack for Level A week 15 and a pinned calibration artifact.
It writes `pageCount: 2` on 3–5-item days at `oneOperationPerPage: true`, so it
reads "page 1 of 2" with two items to a page-label. Editing it changes served bytes
of a pinned fixture; it leaves the served set when the generated A15 lands (backlog
item, `BRIEF-2026-08-26-A15-AND-G9.md`). The gate carries it as a named
report-only exception (15 findings, all A15).

### 2.3 QG-6 widened honestly

QG-6 said 1–3 pages; band A's law is one page per item and Level A Day 1–4 of week
1 carry 4 practice items. QG-6 now allows `1 ≤ pageCount ≤ max(3, practiceItems)`.
The exact agreement (declared pages = pages the screen reaches, and one item per
page where `oneOperationPerPage`) lives in the new gate, not the validator.

## 3. A.2 — the owner's decision (waiting)

Measured across every served day (seed 12345; 3 seeds give the same shape):

| level | days | 0 retrieval | exactly 1 | 2+ |
|---|---|---|---|---|
| A | 120 | 20 | 97 (81%) | 3 |
| B | 120 | 4 | 84 (70%) | 32 |
| C | 120 | 23 | 31 (26%) | 66 |
| D | 120 | 24 | 48 (40%) | 48 |
| E | 105 | 19 | 28 (27%) | 58 |

WarmUp's own header promises "2–4 fast retrieval items" (`WarmUp.tsx:2`). Options:

| option | what changes | cost | what it fixes |
|---|---|---|---|
| (a) fold a 1-item warm-up into the top of PracticePage | WarmUp forwards when `items.length === 1`; PracticePage takes the retrieval item as item 0 (its confirm/miss path is the same DD13 formula) | touches both screens and the sprint-boundary/progress maths; photographs at A and C required; `completedItemIds` must include the retrieval id | the day reads as one run; "only 1–2 questions" cannot recur |
| (b) keep WarmUp only for 2+ items; 1-item days forward straight to practice, retrieval item dropped from the day | WarmUp forward guard `items.length < 2`; the retrieval item is never served on those days | loses 1 retrieval item on 288 days; the 20–30% retrieval-share gate is then violated on paper, so the gate or the generator must move | simplest; nothing else moves |
| (c) leave it, make "more to come" much louder | copy + a progress strip on WarmUp ("1 of 4 today") | photographs only | the parent's report, not the screen's size |

Recommendation: (a). The retrieval item is a real item the child should meet; (b)
throws it away or forces generator churn on 288 days; (c) keeps building a screen
for one question and leans on copy at a band that cannot read it. (a) is the one
that makes the day feel like a day. It is a screen change at band A and it will be
photographed before/after like A.1. The gate ships report-only for this contract
until the ruling; `--strict-warmup` turns it into a failure.

Photographs of the current state for the ruling: `warmup-A2d2-1item.png` (band A,
one tap-to-choose item), `warmup-B1d2-1item.png` (band B, keypad for one item),
`warmup-D1d2-2items.png`.

## 4. A.3 — the gate: `scripts/bb-screen-contract-test.ts`

Runs every served cell × 3 seeds (351 packs). Each check re-implements the
screen's own reading, line-referenced:

| check | writer | reader | result on the fixed tree |
|---|---|---|---|
| pageCount | assemble.ts / weeks / fixtures | PracticePage `pageOf` | 0 strict; 15 report-only (A15) |
| oneOperationPerPage (E62) | presentation | PracticePage | 0 strict; 15 report-only (A15) |
| warm-up "2–4" contract | generator retrieval share | WarmUp header | 717 report-only until A.2 rules (`--strict-warmup`) |
| sprint at Level A | `makeWeekBuilder` throws; every A pack `fluencySprint === null` | `sprintEligible`, SprintGate, SprintRun `!pack.fluencySprint` guard | 0 |
| teacherNoteStrip Day 5 only | validator | PuzzleGrove | 0 |
| audioFirst ⇔ Level A | presentation | PracticePage/WarmUp autoplay at band A | 0 |

`--selftest` builds five broken control packs and each fires its check; an unbroken
A2 pack yields zero strict findings. On the PRE-fix assembler the gate fails 351 of
351 packs (`pageCount/E62`); the first draft's "pages unreachable" control was
silent because B1 Day 2 happens to hold 5 items, so it now declares items+2 pages.

## 5. C — the QA review of the screen layer

### 5.1 The pack↔screen seam, enumerated

Fields the screen layer reads (grep over screens/ and components/):
pack: `explanation`, `packId`, `identity.conceptName`, `mistakeBank`, `masteryCheck`,
`puzzle`, `fluencySprint`, `parentSummarySeed`, `guidedExamples`, `days`.
day: `pageCount`, `items`, `focus`. item: `id`, `prompt`, `answer`, `figure`,
`hintLadder`, `choices`, `errorTags`, `type`.

Findings:
- `pack.presentation` (`audioFirst`, `oneOperationPerPage`, `scaffoldNotes`) is
  read by NO screen. The screens key every band behaviour on the session `band`
  (Level → A/B/C) instead. The block is write-only documentation; the gate asserts
  it at least agrees with what the screens do.
- `pageCount`: was wrong at the writer (A) and at the reader (B2/B14). Fixed both.
- `teacherNoteStrip`: validator (Day 5) and PuzzleGrove (Day 5) agree; asserted.
- `day.focus === 'word-problems' && item.type === 'word-problem'` drives autoplay at
  bands B/C (`PracticePage.tsx:388`); QG-8 fixes Day 4 to `word-problems`, so
  that reads correctly.
- Interaction band (A/B/C) vs presentation band (beginner/…/advanced): two
  vocabularies for one idea, mapped in two places (`copy.ts bandForLevel`,
  `assemble.ts DEFAULT_BAND`). They agree today; no gate says so — added to the
  gate's audioFirst check by implication (Level A ⇔ beginner ⇔ band A).

### 5.2 Sprints at band A — proven unreachable

Three independent guards, each sufficient: `makeWeekBuilder` throws on a Level A
sprint (`assemble.ts:165`), so every A pack carries `fluencySprint: null` (gate
asserts it on 351 packs); `sprintEligible` returns false at Level A
(`sprintLogic.ts:54`); `SprintGate` redirects at Level A (`SprintGate.tsx:34`);
`SprintRun` and `SprintFinish` redirect when `pack.fluencySprint` is null
(`SprintRun.tsx:54`), so a deep link to `/foundry/sprint/run` cannot start a timer.

### 5.3 WeeklyCheck / WeekResolve / PlacementActivity / MicroReteach / StrengthenPlan

One Fable review agent traced these screens plus CheckRunner, weekLogic,
placementProgress, bbProgressService and the mastery RPC SQL. Every finding below
was RE-VERIFIED by me against the code (several of its line numbers had drifted;
the code paths held). Ranked by cost to the child; all CONFIRMED.

| # | screen | defect | evidence |
|---|---|---|---|
| 1 | StrengthenPlan / ThisWeekHub | **An escalated week is a permanent dead end.** Cycle-2 fail writes `escalated`; nothing leaves it — `WEEK_STATE_TRANSITIONS.escalated: ['passed']` has no caller, the hub renders only a Wren line (`ThisWeekHub.tsx:130-136`), PlacementWelcome redirects enrolled children, the promised re-check exists only as a comment ("increment 4"). The band-A child is told a teacher friend will explore it, then nothing. | grep `recheck` → comments only |
| 2 | PlacementActivity / StartingPoint | **Placement result lost on refresh; the whole walk is re-sat.** `clearPlacementProgress` fires at `:159` BEFORE navigation; the result travels only in `location.state`; StartingPoint redirects to welcome when it is absent (`:24-25`). | verified |
| 3 | PlacementActivity / StartingPoint | **An enrolled child can be re-placed by a deep link.** Neither screen reads `enrollment` (0 references in PlacementActivity); `enroll()` upserts level + week 1. | verified |
| 4 | PlacementActivity | **Ladder stops at C** (`LADDER = ['A','B','C']`, `:37`) while D01/E01 content exists: a child who aces C is placed at C week 1. | verified |
| 5 | CheckRunner | **Reload after the last answer strands the child.** Answers restore from localStorage, `acked` starts false, `done` is true → AnswerEntry renders and `handleAnswer` returns early (`:109-112`, `:196-204`); no hand-in button exists in that state. | verified |
| 6 | WeeklyCheck / CheckRunner | **A failed scoring RPC discards the sheet.** `localStorage.removeItem` runs before `onComplete` (`:131-137`); on RPC failure the only button is "Back to my week" and re-entry serves a blank Form A, while band-A copy promises "I'll count these when the internet comes back!". | verified |
| 7 | WeeklyCheck | **Form A reachable on any day.** The guard checks only the DD1 state; a Day-2 deep link from `in_week` performs the `mastery_check` transition on mount and serves Form A. No day-5/tile check in the file. | verified |
| 8 | MicroReteach → FreshProblems | **Cycle 2 "brand-new way" serves the same Form B** (`FreshProblems.tsx:39-40` uses `formB` for both cycles; there is no Form C). | verified |
| 9 | MicroReteach / StrengthenPlan | **Band-A breaches:** 40 px audio target (`h-10 w-10`, MicroReteach `:130`); step "expected"/"Answer:" lines and the named skill are unspoken; the skill is a raw slug ("six nine turned round"). | verified |
| 10 | pack ↔ RPC | `masteryCheck.passThresholdPct` is written and validated but read by no code; the RPC scores at a hard 80. | grep: constants comment only |

Scoring audit: denominators, 80/95/75 thresholds, placement up/down rules all
consistent with constants and the SQL; no off-by-one. No rules-of-hooks defect in
any of the five files. **WeekResolve: no defect found** (two unspoken sub-10-word
lines at band A are the only nit).

None of these is fixed in this change set — each is a behaviour decision (1, 4, 8),
a persistence-order change with its own test (2, 5, 6), or a guard (3, 7) that
should land as its own commit with a photograph. Cost order for the owner: 1, 2, 5, 6.

### 5.4 Audio

- **Measured defect, band A WarmUp: Ms. Wren's opener is never spoken.** The
  harness stubs `speechSynthesis` and logs call order. On `warmup A2 Day 2` two
  autoplays fire on mount (WrenBubble's "Warm-up time! Quick and easy." and the
  prompt's AudioButton, both `band === 'A'`). `speak()` calls `stop()` first
  (`ttsService.ts:399`), which bumps `stopGeneration` and drops the in-flight
  first request while it is still waiting on voices — only ONE utterance reaches
  `speechSynthesis.speak()`, the prompt's. The opener's AudioButton never gets
  `onEnd`, so it stays in the "playing" state (both ⏸ icons in
  `warmup-A2d2-1item.png`). On PracticePage only the prompt autoplays (correct).
  18 screens mount an autoplay WrenBubble; any of them that also autoplays a prompt
  at band A has the same race. This is the "cut off" class again, one layer up from
  the watchdog fix. Not fixed here — it is a sequencing design (speak the opener,
  then the prompt) and touches the shared pattern; reported for a ruling.
- Browser voice on the lesson screen is DELIBERATE: `AudioButton.tsx:2-4` names it
  the accessibility floor and passes `'browser'` explicitly; `ttsService`'s OpenAI
  path is reached only via `'auto'`/`'google'`, which no best-brains caller uses
  (`personaVoiceEnabled` is declared in the enrollment settings type and read
  nowhere).
- Pause across a chunk boundary: every chunk is enqueued synchronously
  (`ttsService.ts:~745`) and `pause()`/`resume()` act on the global synthesis
  queue, so a boundary is not a special state in Chrome. Could NOT be verified
  with a real voice: headless Chrome here ships no voices (the probe had to stub
  one), and iOS Safari is not reachable from this machine. AudioButton's
  120 ms `isPaused()` verify-then-stop fallback is the right shape for iOS.

### 5.5 The rules-of-hooks errors — re-verified, the brief's location is wrong

`eslint -f json` over `src/`: 36 `react-hooks/rules-of-hooks` errors, in TEN files,
none of them in `src/modules/best-brains` (0 errors there, 13 warnings):
`components/animations/visualizations/{algebra,calculus,elementary,functions,trigonometry}/*Animation.tsx`
(35) and `hooks/useDailySaveLimit.ts` (1). Tree-wide: 95 errors / 89 warnings
(the brief's 139/87 counted a wider `npm run lint` scope). So this is the older
Math_Tutor animation system, not the Best Brains micro-animations, and it does not
pair with the micro-animations verdict. Untouched.

### 5.6 The 185 bare spoken segments

`bb-lesson-audio-test`: 117 weeks · 823 spoken segments · 3027 chunks · chunking
0 defects · **185 long segments with nothing to look at** (unchanged; C1 remains
the only `whyFigure` week). Untouched this session — content work, owner-ordered.

## 6. What rendering found that no gate caught

1. Two autoplays racing on the band-A warm-up; the opener silently dropped (§5.4).
2. Page 3 of 3 unreachable on B2/B14 Day 1 (§2.1) — found by the gate, confirmed
   by photograph.
3. The hint ladder shows a dashed "Rung 2 · find the step" preview before any miss
   at band A (`HintLadder.tsx:72-82`, by design: rung 1 is the "Help me" button).
   Readable text a pre-reader cannot read; cosmetic, not changed.
4. `pack.presentation` is decorative (§5.1).

## 7. tsc, battery, and the change set

tsc run 1: clean, 62 s (run 2 not needed — no source changed after it).

Battery, run serially from `frontend/` after all changes, `free -m` between gates:

| gate | exit | time | avail after | result |
|---|---|---|---|---|
| bb-verify-packs | 0 | 7s | 1868 MB | 30120 assertions, 0 failures |
| bb-family-test | 0 | 2s | 1879 | ALL FAMILY CHECKS PASS |
| bb-answer-entropy-test | 0 | 28s | 1734 | 0 guessable mastery slots; 29 teaching-slot tells (= baseline) |
| bb-spoken-answer-test | 0 | 13s | 1685 | PASS |
| bb-qg11-test | 0 | 3s | 1634 | PASS |
| bb-qg11-power-test | 0 | 13s | 1545 | PASS |
| bb-qg12-test | 0 | 4s | 1460 | 34 passed |
| bb-qg13-test | 0 | 4s | 1483 | 74 passed |
| bb-figure-render-test | 0 | 2s | 1465 | 50 figures × 3 sizes PASS |
| bb-answerability-gate | 0 | 4s | 1438 | PASS |
| bb-animation-test | 0 | 6s | 1399 | PASS |
| bb-broken-promise-scan | 0 | 3s | 1368 | PASS |
| bb-readability-test | 0 | 14s | 1284 | 0 weeks over tolerance |
| bb-guessability-test 3000 --all | 0 | 15s | 1210 | census: 238 configs, 16 flagged (no recorded baseline; content proven byte-identical below) |
| bb-cross-week-test --strict | 0 | 5s | 1206 | STRICT PASS (1 pair below 0.7) |
| bb-probe-and-rank-test --seeds 60 --selftest --strict | 0 | 24s | 1197 | STRICT PASS, control fired |
| bb-lesson-audio-test | 0 | 2s | 1033 | PASS (185 bare segments, census) |
| kumon-sheet-coverage-test | 0 | 3s | 1087 | PASS |
| bb-screen-contract-test --selftest (NEW) | 0 | 4s | 1134 | PASS, 5/5 controls fire |

Content identity: every served cell × 3 seeds generated on the old and the new
assembler, `pageCount` stripped — sha `0fc15e073e9addb4` on both; the pageCount
vector alone differs (`44ab24e0…` → `78b8e0ad…`). No item byte moved.

Change set (approved and committed 2026-09-04):

```
frontend/src/modules/best-brains/generator/templates/lib/assemble.ts   pagesPerDay(band, practiceItems)
frontend/src/modules/best-brains/generator/validator.ts                QG-6 bound max(3, practiceItems)
frontend/src/modules/best-brains/types.ts                              PackDay.pageCount doc
frontend/src/modules/best-brains/screens/PracticePage.tsx              pageOf(): even spread, clamp
frontend/src/modules/best-brains/session/FoundrySession.tsx            export FoundrySessionContext (+type)
frontend/scripts/bb-screen-contract-test.ts                            NEW gate (+--selftest, --strict-warmup)
frontend/scripts/bb-screen-visual.ts                                   NEW by-hand photograph driver
frontend/scripts/screen-harness/{index.html,main.tsx,vite.config.ts,supabase-stub.ts}   NEW harness
modules/best-brains/meta/BRIEF-2026-08-31-SCREEN-LAYER-QA.md           the brief (was untracked, not committed as stated)
modules/best-brains/meta/REPORT-2026-09-04-SCREEN-LAYER-QA.md          this report
```

Deploy note for the merge: A.1 changes the header label every band-A child sees
("page 1 of 1" → "page k of N") and the last-item label on B2/B14 Day 1. Nothing
else on any screen changes (pixel-verified). Content bytes: `pageCount` moves on
every generated Level A day (1 → 2..4); item content is unchanged, so no child
re-sits a drifted item. Deploy timing is the owner's.

## 8. Not verified, and what was done instead

- Real speech on Chrome and iOS: no voices in headless Chrome, no iOS here. The
  call ORDER was measured through a stub instead; the pause/resume claim is by
  reading.
- The harness mounts screens under a stub session with Supabase aliased to a
  rejecting stub, so persistence side effects (`updateDayProgress`) are not
  exercised — the photographs cover render and resume-at-item, not writes.
- One Fable review agent read the five gated screens; its findings are marked
  with what I re-checked (§5.3).
