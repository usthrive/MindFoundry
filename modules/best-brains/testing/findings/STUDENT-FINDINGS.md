# STUDENT-FINDINGS — Phase 7 student-simulator run (Nora 5/A · Maya 8/B · Jordan 11/C)

**Run date:** 2026-07-20 · **Evaluator:** Phase-7 student-simulators runner
**Method:** three child personas played end-to-end IN CHARACTER against the live UI
(Playwright + mocked-Supabase harness; `testing/harness/run-students.ts`).
Evidence: `testing/screenshots/phase7/students/<name>/<stage>/…` and
`testing/runs/students-run.json` (131 tagged observations; final green run per
stage — 17/17 stages ok) + per-stage Playwright logs in `testing/runs/students/`.
The mastery RPC is the harness **emulation** — nothing here asserts server-side
behavior.

---

## D5 leakage check — top of file, as required

**No CRITICAL D5 leakage found on any child-visible screen.** Zero `%`, zero
letter grades, zero red error styling, zero ✗-marks, zero "wrong/fail/review"
*as judgment of the child*, zero score comparisons across all three journeys
(automated text scan on every screenshot + visual review). The scanner's only
hits are deliberate honest-framing or teaching copy, adjudicated LOW in S-16:
"never, ever gets a grade" (sprint gate), "No grade, no pass or fail — just
calibration" (C placement welcome), "so wrong answers feel wrong" (D17 lesson
summary), "PROVES Jo wrong" (Grove error-analysis fiction). The non-pass screen
(StrengthenPlan) is visually **exactly as warm** as the pass screen (teal/white,
same components — compare `maya/day5/07-strengthen-plan.png` with
`maya/nearmiss/07-resolve-post-corrective.png`).

---

## Scores at a glance

| Dim | Nora (5, band A) | Maya (8, band B) | Jordan (11, band C) |
|-----|------------------|------------------|----------------------|
| D1 Instruction comprehension | **2** | **4** | **5** |
| D2 Friction | **1** | **3** | **3** |
| D3 Attention-span fit (LS1-R1) | **4** | **4** | **4** |
| D4 Input ergonomics (band law) | **2** | **4** | **4** |
| D5 Emotional tone | **5** | **5** | **5** |

The tone architecture is the module's triumph — all three children end their
weeks feeling safe. The band-A **delivery** of that architecture is where it
breaks: Nora cannot actually operate two of her required surfaces without an
adult, and her daily entry is a coin-flip dead-end (S-1, S-2, S-3).

---

## Findings (ranked)

### CRITICAL

**S-1 — Blank-screen dead-end entering practice days (WarmUp navigate-during-render).**
- **What/where:** On any day whose pack has **zero retrieval items**, `WarmUp`
  calls `goOnward()` → `navigate()` *during render* (`WarmUp.tsx` `items.length===0`
  branch; React Router logs "You should call navigate() in a React.useEffect()").
  The redirect intermittently (in this environment: almost always) no-ops and the
  child is stranded on a **completely blank screen** at `/foundry/day/N/warmup`.
  No button, no Wren, no way back (bottom nav is the host app's, not the module's).
- **Who it hits:** Level A weeks — A1 days 2–4 all have `warm=0` (B1/D17 have ≥1),
  so the youngest band takes the full blast. Nora tapped her one big teal button
  ("Start Day 2's practice") and got nothing, eight times across two runs.
- **Evidence:** `nora/midweek/02-blank-warmup-attempt1.png` … `05-blank-warmup-attempt4.png`
  (fully blank content area, four consecutive attempts in one run; a later run
  hit it again — 8 stranded entries total across runs before the harness
  recovered via programmatic client-side navigation, "a real child could not do
  this" — `bug:blank-warmup*` notes in `students-run.json`); react-router
  navigate-during-render warnings in `runs/students/nora/midweek-run.json`.
- **Why it matters to Nora:** she trusts the tablet when it talks. A silent blank
  screen is precisely her shutdown trigger — she hands the tablet to a grown-up
  and the day is over. Severity ladder: *child stuck with no path* = CRITICAL.
- **Fix:** move the empty-warm-up forward into a `useEffect` (or render a
  `<Navigate>`), and add a route-level fallback so `/day/N/warmup` never renders
  null.

**S-2 — Band-A GuidedPractice is reading-gated AND keyboard-gated (double band-law breach).**
- **What/where:** Day-1 guided steps at Level A render the `childDo` instruction
  as **silent text** (no AudioButton anywhere on the card) above a **free-text
  keyboard field** ("Your step" + Check). A1 has 3 such steps expecting typed
  strings like `3, 4` and `1, 2, 3, 4, 5` (commas included).
- **Evidence:** `nora/freshweek/05-guided-typed-step-1.png` ("Touch the last two
  stars and keep counting." → text input); `guided:banda-input` ×3, all with
  `audio on the childDo instruction: 0`.
- **Why it matters to Nora:** she cannot read the instruction at all and cannot
  type — in character she random-taps, gets nowhere, and Day 1 is unfinishable
  without an adult. Band law says A = tap/drag only, no reading-gated task, no
  keyboard; this is both, on the very first day of her program. (The runner had
  to type as "the grown-up" to proceed — recorded as such.)
- **Fix:** A-band guided steps need tap-to-choose affordances (the expected
  answers are tiny sets) and an AudioButton on every `childDo`.

**S-3 — Placement over-places into the FAILED level (walk cannot settle back down).**
- **What/where:** `PlacementActivity.completeCluster`: after stepping up, the
  child fails the upper cluster, but `canDown` excludes visited levels, so the
  decision is `hold` and `finishWalk` places at the **current (failed) level**.
  - Nora: 5/5 at A → step up → **0/5 at B** → "YOUR TRAIL STARTS AT **Level B**".
  - Maya: 4/5 at B → step up → **2/5 (40%) at C** → placed **Level C**.
- **Evidence:** `nora/placement/05-placement-startingpoint.png` (Level B for a
  pre-reader who answered zero level-B items), `maya/placement/05-…` (Level C);
  `placement:decision` notes replicate the app's own thresholds (≥80% up, <50%
  down).
- **Why it matters:** placement is the gate everything sits on. A 5-year-old
  enrolled at Level B gets band-B surfaces (NumberPad, silent text) for her whole
  program; a 40%-at-C Maya starts above her demonstrated level and her first
  weekly check becomes a designed near-miss. This is the inverse of "skipping
  earned material."
- **Fix:** on a failed step-up, place at the highest cluster the child actually
  passed (the level below), not the current level.

### HIGH

**S-4 — Hint ladder promises an answer path that can never arrive (parks instead).**
- **What/where:** The ladder sheet shows rung-3 previews ("a worked twin") and the
  caption "**The answer only comes after rung 3 and one try — with the why.**"
  But `PracticePage.handleAnswer` parks the item on the 2nd miss unless
  `rung>=3`, and rung escalation (LS1-R3(a)) requires an attempt between rungs —
  so **rung 3 is unreachable before the parking rule fires**; the bottom-out
  reveal in practice is dead code. Maya rode the ladder exactly as designed
  (rung 1 → try → rung 2 → try) and the item vanished into the chest at rung 2.
- **Evidence:** `maya/midweek/06-ladder-rung2-day3.png` (rung 2 open, caption
  visible), `07-ladder-outcome-day3.png` (parked copy); `ladder:end` note.
- **Why it matters to Maya:** unfairness is her trigger — the screen made a
  promise ("the answer comes after rung 3") and then took the problem away. She
  reads contracts; this one is broken. (The chest DOES warmly re-serve the item
  next day, so the outcome is caring — but the stated rule is false.)
- **Fix:** either allow the 2nd miss to reveal when rung 2 is open (then fix-it),
  or reword the caption to match the parking rule.

**S-5 — Band-A typed entry beyond guided: Grove page + featured puzzle.**
- **What/where:** A1 Day-5 Grove serves `set`/`manual-review` items that fall
  through AnswerEntry to the **typed** branch at band A: `A1-PZ-01` ("Count each
  kind…") and the featured puzzle — whose prompt says "**Color the box** RED /
  BLUE / GREEN" while the affordance offered is a **text field** (no coloring, no
  taps).
- **Evidence:** `banda:input-breach` notes; `nora/day5/02-grove-puzzle-day5.png`
  (long silent-text puzzle + typed entry; audio button present on the prompt).
- **Why it matters:** the week's "play" moment is the one that most needs to be
  manipulable; instead it's the most text-bound screen of her week. The
  "Show a grown-up" card IS present (verified) — but the child's own task should
  not require the grown-up.
- **Fix:** author A-band Day-5 items as choices/taps; never let `manual-review`
  fall to a keyboard at band A.

**S-6 — NumberPad keeps the child's previous WRONG digits after a miss.**
- **What/where:** `AnswerEntry` resets its value only on `item.id` change, so
  after a miss the answer box still shows the wrong entry (e.g. Maya's classic
  "82"). A child who types the correction without first pressing **C** gets
  `82104`-style input → a phantom second miss → the item parks.
- **Evidence:** reproduced organically — `maya/midweek/06-ladder-rung2-day3.png`
  shows "81" still sitting in the box on the re-attempt; `driver:parked-continue`
  after `miss:correction` on B1-D3-02/D3-05 (both parked via this exact path).
- **Why it matters to Maya:** proud of neat columns; the machine "keeping her
  mistake" and then punishing the merged number feels like the app cheated —
  and it burns one of the only two interventions per item.
- **Fix:** clear the entry when an attempt is submitted (keep it only while typing).

**S-7 — Cold deep-link race CONFIRMED (all three children) — amended description.**
- **What/where (BUILD-NOTES inc-5 reproduction, required):** cold navigation to
  `/foundry/day/N/practice` on the actionable day shows "Setting up…" for
  ~1–4 s, then **bounces to the hub** — trajectory recorded:
  `1s:/day/N/practice[setting-up] → 2s:/foundry/hub`. Confirmed identically for
  Nora (day 2), Maya (day 3), Jordan (day 3). Amendment to the inc-5 note: there
  is a visible loading limbo first, and the bounce lands on the hub in a safe,
  recoverable state (one tap re-enters the day). Mechanism consistent with the
  local `weekState` mirror lagging one render in `PracticePage`.
- **Evidence:** `deeplink` notes + `*/deeplink/01-deeplink-landing.png`.
- **Severity note:** HIGH as a correctness bug for bookmarks/refresh mid-day, but
  the failure mode is benign (hub), so child impact is bounded.

### MEDIUM

**S-8 — Near-miss copy names the WRONG skill right above the correct one.**
  The canonical B-band line renders "So close — just **the renaming step** is
  wobbly…" directly above the card naming the actual skill, "**decade word
  confusion**" (Maya, Form-A 4/6). The hard-coded example skill from the spec's
  canonical string leaks verbatim. A detective child notices the contradiction at
  the exact moment trust matters most. Same line reappears on the corrective hub.
  Evidence: `maya/day5/07-strengthen-plan.png`. Fix: fill the slot from the
  dominant-tag skill (the code already computes it for the card).

**S-9 — The hub (and StartingPoint strengths) are silent at band A.**
  The hub's Wren line does **not** autoplay (autoplay is reserved for
  items/lesson), the concept card's paragraph and the single CTA label are plain
  text, and StartingPoint's strengths list ("read aloud" per the flow spec) has
  no per-item audio — one tappable 🔊 exists on the bubble only. Nora can operate
  the hub because there is exactly one big teal button (good design), but she
  cannot know *what* she's agreeing to without tapping the small speaker.
  Evidence: `hub:audio` (1 audio affordance), `placement:startingpoint-audio`.
  Fix: autoplay the hub Wren line at band A; give strengths rows AudioButtons.

**S-10 — The second weekly sprint is unreachable through the UI.**
  Budget is ≤2/week, but the offer exists only at ONE page boundary on the
  scheduled day (D17 day-3 has a single boundary). Jordan — the child who
  "beats his own numbers" — finished run 1 and had **no affordance anywhere** to
  run again; the runner had to deep-link `/foundry/sprint` (which the gate's
  re-guard happily allows, proving the budget is live). Evidence:
  `sprint:boundary-count: offers seen today: 1 (budget 2/week)`.
  Fix: after a completed sprint with budget remaining, surface a quiet re-offer
  (hub tile or practice header), still opt-in.

**S-11 — Interruption replays warm-ups and forgets the sprint context.**
  Day progress records practice `completedItemIds` but never warm-up completion,
  so ANY mid-day exit (sprint interruption, tab close) forces the child to redo
  all warm-ups on re-entry (Jordan redid 2; Maya's "losing my place" trigger).
  Practice resume-at-item itself works (verified: resumed past 2 banked items).
  Evidence: `resume:` notes, `jordan/midweek/05-first-item-day3-resume.png`.

**S-12 — The 11-at-Level-C band question (placement-dependent, flagged as required).**
  Placement tops out at Level C, and `bandForLevel(C)='B'`: a quick 11-year-old
  who aces everything gets band-B dress — NumberPad, "A little tour of math
  land…", B-voiced acks — both during the walk's C cluster and for his real
  enrollment. Jordan's actual week (D17, fixture-only) was properly C-banded and
  respectful; the mismatch lives in what placement can reach today. Evidence:
  `jordan/placement/02-placement-c-item1.png` (NumberPad + tour line),
  `placement:ceiling` note. Fix: ship D/E entry-week content, or band the walk
  presentation by age rather than item level.

**S-13 — Locks state facts, not reasons, to the child who respects reasons.**
  After finishing a day, tomorrow's tile says "resting"/"Unlocks tomorrow
  morning" (C). The honest *why* ("consistency beats bingeing") exists in the
  copy table but only on soft-stop/adaptive variants Jordan never hits when he
  finishes cleanly wanting more. He reads a lock with no reason as arbitrary.
  Evidence: `jordan/freshweek/07-hub-after-day1.png`, copy audit of
  `MODULE_COPY.tileResting` / `COPY.dayComplete`. Fix: one C-band line of honest
  rationale on the resting state.

### LOW

**S-14 —** Deep-linking `/foundry/sprint` after a same-day decline re-shows the
  gate (`SprintGate`'s re-guard checks budget/opt-out/level but not
  `declinedToday`). The offer site honors the decline correctly (verified: no
  re-ask at any boundary). Evidence: `sprint:decline-reask`,
  `jordan/decline/03-sprint-gate-reask-after-decline.png`.
**S-15 —** `navigate()` called during render also in `PuzzleGrove.toCheck()` and
  `WeeklyCheck`'s effect-less transition path — console warnings on clean runs;
  same bug class as S-1 without (yet) a visible dead-end. Evidence: console
  entries in `runs/students/*/day5-run.json`.
**S-16 —** D5 scanner hits, all adjudicated non-violations (see top-of-file):
  honest-framing "grade" mentions (gate/welcome), teaching-copy "wrong" (D17
  summary; Grove's "PROVES Jo wrong" is about a fictional character). Consider a
  copy pass at band B where "grade" may still evoke school anxiety.
**S-17 —** TreasureChest misconception reteach card renders a raw
  `reteachPointer` fragment ("parts snap into places") as child-facing copy —
  reads like an internal note. Evidence: `chest:setup` note,
  `maya/midweek/12-chest-setup.png`.
**S-18 —** Mid-check reload re-shows the check FRAMING screen ("Last page —
  let's go") before resuming. Answered items stand (verified — resumed at the
  next unanswered item; no restart-scumming), so the fairness law holds; the
  extra ceremonial tap is mildly confusing. Evidence: `check:reframing`,
  `maya/day5/05-check-resumed.png`.
**S-19 —** Locked Day-5 tile is labeled "check day" even at band A — the one
  test-scented word on Nora's hub. Evidence: `nora/midweek/06-hub-day3-resting.png`.
**S-20 —** NumberPad's Clear key uses the error-red tint (`text-error`) — the
  only red-adjacent element band B ever sees; it is an affordance, not feedback,
  and renders pale. Watch it in the design pass.

---

## Nora — age 5, Level A, band A (the audio-dependence test)

| Dim | Score | Evidence highlights |
|-----|-------|---------------------|
| D1 comprehension | 2 | Placement A-cluster, lesson segments, warm-ups, practice items and check items all autoplay + tap (`placement-a-item1`, `first-item-day2`); but guided childDo = silent text (S-2), hub/StartingPoint silent (S-9), Grove typed (S-5). Without an adult she finishes placement and Day-2-style practice, but NOT Day 1 or Day 5. |
| D2 friction | 1 | S-1 blank dead-end on her primary daily tap (reproduced ×8); S-7 deep-link bounce; otherwise taps respond and one-primary-action layout suits her. |
| D3 attention fit | 4 | Day dose ≈ 6 tap items (~3–5 min) + lesson 7 short segments — inside the 8/10 A-cap; soft-stop between items and LS1-R2 adaptive stop verified in code (not exercisable at driver speed); no grinding paths found. Day-1 lesson+guided ≈ 7–9 min is the longest sit. |
| D4 input ergonomics | 2 | Tap targets oversized (80px answer tiles, 72px choices, 56px audio) and tap options contain the answer (`04-miss-a1-d2-02` shows re-tap correction); but keyboard fields on guided + Grove + a full NumberPad served to her in the placement B-cluster (S-2, S-5). No timers/sprints anywhere at Level A (verified: gate never appeared; `sprintEligible` blocks level A). |
| D5 emotional tone | 5 | Identical "Got it!" acks in placement and check; misses open "Good try! Let's look together." + re-enactment ("Your turn — let's do it together!" observed on her genuine day-2 miss); parked = treasure chest; resting tiles warm; pass = quiet shelf moment, no confetti. |

**Nora's diary (in character):** "The bird lady talks to me and I tap the
number and she says Got it! I like the ducks. But one day the tablet went all
empty when I pressed my button and I gave it to Mama. And one time it wanted me
to WRITE with the letters and I don't know letters, Mama did it. The puzzle
picnic wanted coloring but there was no coloring. My shelf has Counting on it.
The chest keeps my tricky one for tomorrow."

**Bugs with repro (Nora):** S-1 (`scenarioNoraMidWeek` → hub → "Start Day 2's
practice" → blank `/day/2/warmup`; ~90% of attempts in this environment), S-2
(fresh A1 week → lesson → guided → step 2), S-3 (placement: answer A cluster
5/5, B cluster 0/5 → StartingPoint says Level B), S-5 (Day-5 grove → item 1 and
puzzle), S-9 (hub load → no autoplay).
**Deep-link check:** BOUNCED to hub after ~1s "Setting up…" (trajectory in
`students-run.json`).

## Maya — age 8, Level B, band B (the reference child + near-miss protagonist)

| Dim | Score | Evidence highlights |
|-----|-------|---------------------|
| D1 comprehension | 4 | Every screen states its job in her register; check framing "show-what-you-know page… I'll hold my comments till the end" and Form-B rationale "reusing the old ones would test your memory" answer her fairness question before she asks it. Deductions: S-4's false ladder promise, S-8's wrong-skill line. |
| D2 friction | 3 | S-6 lingering digits cost her two parked items; S-11 warm-up replay after exits; S-18 reload re-framing; S-7 deep-link bounce. Resume-at-item, chest flow, corrective chain all worked without dead ends. |
| D3 attention fit | 4 | Day 3 = 1 warm-up + 5 practice (+ optional sprint) ≈ 8–12 min vs 12/15 cap; the corrective loop is split across days (same-day re-entry rests: "The strengthening round opens tomorrow — it will wait for you"), which is pacing done right. |
| D4 input ergonomics | 4 | NumberPad + dual audio/text on every item (`02-first-item-day3`); explain-back asks an 8-year-old to type a sentence but offers "I said it out loud instead" (used and verified). S-6 is the real ergonomic wound. |
| D5 emotional tone | 5 | THE dimension she was sent to test: Form A 4/6 → StrengthenPlan is warm teal, names ONE skill, no %, no red, "Everything else keeps moving", chest offered — visually indistinguishable in warmth from the pass screen. "One more round" then delivered: right skill reteach (concept-misconception per fixture), genuinely fresh Form B (0/6 prompt overlap, verified), 6/6 → fast-track credit "you didn't just fix it — you *owned* it", collection ritual, and the next-week reveal correctly did NOT appear same-day. At no point did the near-miss feel like failure. |

**Maya's diary (in character):** "I like that she holds her comments till the
end so it's really me. When I got four out of six she didn't say four out of
six — she said one step was wobbly and everything else keeps moving, and the
next day the problems were actually NEW ones, not the same ones, which is fair.
The hint ladder said the answer comes after rung three but it took my problem
away at rung two — hey. And the number box kept my old 82 in it and mushed my
new answer. The chest gave my sneaky ones back and I caught them. My shelf says
Numbers to 120 is mine now, which is true."

**Bugs with repro (Maya):** S-4 (day-3 practice: open rung 1, miss, open rung 2,
miss → parked under the rung-3 promise), S-6 (miss with pad entry → old digits
remain), S-8 (`scenarioMayaDay5` → check 4/6 with concept-miss dominant →
StrengthenPlan line vs card), S-18 (mid-check reload).
**Deep-link check:** BOUNCED to hub (same trajectory as Nora).

## Jordan — age 11, Level D17 fixture cell, band C (the boredom/pacing test)

| Dim | Score | Evidence highlights |
|-----|-------|---------------------|
| D1 comprehension | 5 | C register is collegial and honest end to end: "reading the bug report", "the anchor shows only the strategy card, so it's really you", "That concept is yours — shelved… you'll squash it every time." |
| D2 friction | 3 | S-7 deep-link bounce; S-10 no path to sprint run 2; S-11 warm-up replay after his sprint interruption; typed entry accepted everything including `3 5/6`. |
| D3 attention fit | 4 | Taps-to-mathematics: hub → 1 tap → warm-up item on screen (~5 s) — no ceremony. Day 3 ≈ 10–14 min vs 15/20 cap; lesson = 8 tight segments (~3–4 min of listening). Deduction: finishing early wanting more gets a lock with no honest why (S-13). |
| D4 input ergonomics | 4 | At D17: typed/symbolic everywhere, zero baby inputs, no mascot stickers (Wren mark shrinks at C; decoration audit clean). Deduction: the placement walk he actually played served band-B dress (NumberPad + "A little tour of math land…") — the S-12 ceiling. |
| D5 emotional tone | 5 | The sprint triptych is exactly as promised: three facts BEFORE any start control; "Let's go" and "Not today" pixel-identical (189×64 both); run = soft filling arc, no numerals, no red, calm "Done for now"; interruption silently discarded (verified in state: no `sprint-1` key); finish = count + "you vs. you" + 2-bar self-history sparkline; second run compared only to himself ("Same count as last time — steady hands"). Decline path: zero comment, no re-ask at any boundary. Pass moment: no confetti, concept named as owned. |

**Jordan's diary (in character):** "It doesn't sugarcoat — the check says it
holds comments and hides the worked examples so it's really you, fine, respect.
The lesson wouldn't let me skip and wouldn't say why, it just ignored my taps
on the dots. Sprint is the best part: nobody grades it, the no button is the
same size as the yes button, and when I bailed halfway it just… never happened.
But then I wanted a rematch and there was literally no button for it anywhere,
which is dumb because the rules say two a week. The Grove thing where I prove
Jo's fraction claim is wrong — okay, that's actually good. Tomorrow's tile says
'resting'. Resting from what? Tell me the reason, I can take it."

**Bugs with repro (Jordan):** S-10 (finish sprint run 1 on day 3 → no second
offer anywhere; `/foundry/sprint` deep-link works, proving budget remains),
S-14 (decline at gate → deep-link `/foundry/sprint` → gate again), S-11
(interrupt sprint mid-run → re-enter day 3 → warm-ups replay), S-13 (finish day
→ resting tile, no rationale). Note: D-level enrollment is **fixture-only**
(placement reaches C max — S-12); nothing else in his week looked
placement-dependent.
**Deep-link check:** BOUNCED to hub (same trajectory).

---

## What genuinely works (so it doesn't get "fixed")

- **The tone system holds under stress.** Near-miss, parking, wrong answers,
  early exits, escalation copy — every failure path lands as continuation, and
  the non-pass screen passes the P6 warmth-parity test pixel-for-pixel.
- **The check never feels like an exam** at any band (dress identical to
  practice, held feedback with identical acks — observed on right AND wrong
  answers, strategy-card-only anchor, no timer).
- **Form-B novelty is real** (0/6 surface overlap, computed from the app's own
  generator) and the app *says why* — the single best trust-builder for Maya.
- **The sprint contract is honored end to end** (facts first, equal decline,
  no numerals, silent discard, you-vs-you only).
- **Daily-unlock reads as rest, not punishment** ("resting", "check day",
  "It will wait for you"), and the same-day next-week reveal is correctly gated.
- **A-band item surfaces (where authored as such) are genuinely tappable** with
  oversized targets and autoplay on every item prompt.

## Harness notes (for the next runner)
- Dev server flake: two stage failures were environment (Vite/WSL2 stall on a
  lazy chunk; documented in BROWSER-TESTING-TOOLING) — re-run the stage.
- `run-students.ts` supports `[child] [stage,stage]` args; observations merge
  per (child, stage) into `students-run.json`.
- The S-1 dead-end forced a programmatic recovery (client-side route dispatch);
  screenshots of the driver's own recovery are labeled as such and were not
  scored as app behavior.
