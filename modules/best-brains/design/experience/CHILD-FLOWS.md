# CHILD FLOWS — Best Brains-Inspired Math Module (Mind Foundry)

**Phase 5A deliverable · UI/UX Designer · 2026-07-19**
**Governed by:** `METHODOLOGY-MODEL.md` (10-step loop — these flows implement it exactly) and `PRODUCT-PRINCIPLES.md` (P1–P12). Cites E-rows / DDs; everything uncited is `[original design]`.
**Voice:** All Ms. Wren dialogue follows `TEACHER-PERSONA.md` (band rules §3, correction formula §4.3, mastery rubric §5). Content shapes follow `QUESTION-GENERATOR-SPEC.md` pack anatomy (days, warm-ups, puzzle, sprint, mastery check Forms A/B).

---

## 0. Canonical screen names (established here; specced in Part B)

Part B must use these names verbatim. Adding a screen requires adding it here first.

**Child screens (20):**

| Screen | Role | Loop step |
|---|---|---|
| `PlacementWelcome` | Warm "show us what you know" invitation | 1 |
| `PlacementActivity` | Adaptive placement items (per DD5) | 1 |
| `StartingPoint` | "We found your starting point!" reveal + strengths | 1–2 |
| `JourneyMap` | Level trail ("you are here"), Mastered Shelf, checkpoint markers — the child's only progress surface | 2, 10 |
| `ThisWeekHub` | The weekly home: concept card + five day-tiles + week state | 3 |
| `LessonRoom` | Ms. Wren's concept lesson (hook → why → worked examples) | 4 |
| `GuidedPractice` | Scaffold-fade practice with Ms. Wren (modeled → completion → prompted → independent) | 5 |
| `WarmUp` | 2–4 retrieval items styled as warm-up (per DD8) | 6 |
| `PracticePage` | Core items, one in focus at a time; modes: `fluency`, `application`, `word-problems` | 6 |
| `PuzzleGrove` | Day-5 non-computational page, band-matched (per DD12) | 6 |
| `DayDone` | Quiet daily completion state (P5 exception 3) | 6 |
| `SprintGate` | Sprint invitation with the three fixed facts (per DD11) | 6 |
| `SprintRun` | The 2-minute sprint itself | 6 |
| `SprintFinish` | Calm stop + self-referenced compare | 6 |
| `WeeklyCheck` | Form A objective items (feels like the last page, per METHODOLOGY-MODEL Step 9) | 9 |
| `WeekResolve` | Pass outcome: concept owned, shelf updated, next week previewed | 9–10 |
| `StrengthenPlan` | Non-pass outcome: "one more round" plan (per DD1; never shame, P6) | 9 |
| `MicroReteach` | Targeted reteach of the specific missed skill, worked example first (per DD1) | 9 |
| `FreshProblems` | Form B isomorphs — visually framed as brand-new (per DD1) | 9 |
| `TreasureChest` | Parked-mistake review (per TEACHER-PERSONA §4.2 move-on rule) | 6–9 |

**Child components (not screens, shared):** `AnchorPanel` (P7), `HintLadder` (P8), `WrenBubble` (persona presence on any screen), `ScratchPad` (P3), `AudioButton` (replayable TTS, P10).

**Band legend used below** (per E24/E60, CURRICULUM-MAP §0.3): **A band** = 4–6 (Level A, tap-first + audio-carried); **B band** = 6–9 (Levels B–C, dual audio+text, NumberPad entry); **C band** = 9–12 (Levels D–E, symbolic entry + typed explanation).

**Global edge rules (apply to every flow)** `[original design]`:
- **Offline (PWA):** the current week's pack is precached at week start; answers queue locally and sync on reconnect. If the LLM persona is unreachable, Ms. Wren falls back to the pack's authored scripts/hint ladders (packs are self-sufficient by design, per QUESTION-GENERATOR-SPEC pack anatomy) with slightly reduced conversationality — never a dead end. Weekly verdict computation requires sync; the UI says "I'll tally this when we're back online" rather than showing an error.
- **Mid-anything abandon:** every screen persists state on each interaction; re-entry resumes at the exact item, greeted warmly, never scolded ("Welcome back! We were right here."). No penalty, no reset, no streak-loss (P5.4).
- **Session cap:** the daily dose is 5–15 min (per E12); Level A caps ≈5 min (CURRICULUM-MAP Level A). If the idle-timeout fires (existing `useIdleTimeout` infra), state saves and the child lands softly on `DayDone`'s partial variant ("we'll finish this tomorrow — it will wait for you").
- **Frustration:** on `[[FLAG_FRUSTRATION]]` (TEACHER-PERSONA guardrails) the session shortens gracefully: current item parked to `TreasureChest`, day marked partially complete, warm close.

---

## Flow 1 — First-time placement → level assignment

**Implements:** loop Steps 1–2. **Framing law:** exploration, never a test (per DD5); no grade labels, no percentile, no "fail" (METHODOLOGY-MODEL Step 1).

**Entry point:** first launch of the module from the platform's module picker (`PracticeModulesPage` card), after child-profile selection. Also re-entered on placement re-check (per DD1 escalation).

**Steps:**
1. `PlacementWelcome` — Ms. Wren introduces herself (band-guessed from profile age) and frames the activity: "Let's find your perfect starting point. Some of this will feel easy, some might feel new — both help me." No mention of testing, scoring, or time. Single action: "Let's go."
2. `PlacementActivity` — adaptive walk per DD5: start at the age/grade-implied level, 4–6 items per exit-skill cluster; ≥80% steps up, <50% steps down, else probe adjacent clusters. Cap ~25–30 min total, but **chunked**: a soft pause offer every ~8 items ("Want to stretch, or keep going?") `[original design]`. Items use band-appropriate inputs (A: tap/drag/draw; B: NumberPad; C: symbolic). No per-item right/wrong display — every answer gets the same warm neutral acknowledgment ("Got it!") because placement feedback would make it feel like a test `[original design; consistent with DD5's never-a-test framing]`. `AnchorPanel` is absent here (nothing has been taught).
3. `StartingPoint` — the reveal: "We found your starting point!" Ms. Wren names 2–3 evidenced strengths by concept name (per METHODOLOGY-MODEL Step 2 — strengths celebrated by name), shows the placed level as a neutral letter (never a grade, per DD2), and animates a gentle "you are here" pin dropping on the trail.
4. `JourneyMap` — first view: the level trail with weekly concept names ahead, "you are here" marker, empty Mastered Shelf ("this shelf is going to fill up"). Nothing about the map says "behind" (per METHODOLOGY-MODEL Step 2). CTA: "See you Monday for Week 1!" (or "Start Week 1 now" if the family's cycle begins immediately — calendar-decoupled per DD2).

**Decision branches:**
- **Multi-cluster child (front-block mastered):** mid-level entry at Week 13 (per DD5/CURRICULUM-MAP entry points) — the map simply pins them mid-trail; no comment on skipping.
- **Age-implied level clearly wrong early:** the adaptive walk steps silently; the child never sees "moving you down" — items just continue.
- **Placement re-check entry (per DD1):** framing changes to Ms. Wren's responsibility language: "I want to double-check my own homework — it's possible I started you on too steep a hill" (TEACHER-PERSONA §5 second-fail script). Shorter walk, only the clusters in doubt.

**Emotional design by band:**
- **A:** every prompt audio-carried with `AudioButton` replay; mascot present; items are toys, not questions ("Can you tap five ducks?"). Pause offers become "wiggle breaks." Cap the walk at ~15 min even if unfinished — DD5's gate self-corrects within weeks (per DD5 risk note).
- **B:** light narrative frame ("a little tour of math land"); dual audio+text; progress shown as steps on a path, never as a score.
- **C:** honest, collegial framing: "This helps me skip what you already own. Skipping earned material is the whole point." No babying; C-band children know what tests are, so name the difference explicitly: "No grade, no pass or fail — just calibration."

**Failure / edge cases:**
- **Abandon mid-placement:** resume from the last completed cluster; if >7 days stale, restart the walk fresh (skills may have shifted) with re-welcome framing `[original design]`.
- **Offline:** placement requires the item bank + adaptivity — precache the starting bank on module install; if fully offline before any cache, show a calm "Ms. Wren needs the internet to set up your journey" parent-directed note.
- **Child freezes / random-taps (A band):** three consecutive no-interaction timeouts or rapid-fire taps → the walk ends early at the safest (lower) placement; DD1's corrective machinery adjusts upward naturally later.

---

## Flow 2 — The weekly cycle home: concept intro → lesson → guided practice

**Implements:** loop Steps 3–5 (Teach → Perceive, per E41). **Spine law:** P1.

**Entry point:** `ThisWeekHub` is the module's home screen every launch after placement. On the first launch of a new week it plays the reveal state.

**Steps:**
1. `ThisWeekHub` (reveal state) — Monday-morning reveal (per METHODOLOGY-MODEL Step 3): concept card flips open with a kid-readable name and one-sentence why-it-matters; five day-tiles shown, Day 1 dimly lit behind the lesson gate; the same shape every week so the child always knows where they are (per E48-analog ritual consistency… per METHODOLOGY-MODEL Step 3 child experience). The hub also shows: `AnchorPanel` handle (empty until the lesson fills it), `TreasureChest` (if occupied), `JourneyMap` link.
2. `LessonRoom` — Ms. Wren's 5–10 min lesson (per DD4 instruction slice): hook → why-before-how → visual-first worked examples with thinking aloud → summary → vocabulary with kid glosses (pack `explanation` component). Controls: pause, replay-segment, "explain that again" (re-explanation on demand, per METHODOLOGY-MODEL Step 4 repairing E52/E88). **Not skippable on first encounter** (P8); replayable forever after. Finishing the lesson visibly pins the worked examples into the `AnchorPanel` ("These stay right here all week", per E99's packet-front convention).
3. `GuidedPractice` — 3–5 problems *with* Ms. Wren in the scaffold-fade order (modeled → completion → prompted → independent, per DD4/QUESTION-GENERATOR-SPEC): child taps along in the modeled example; fills missing steps; then solo with a check. Errors get the Acknowledge → Locate → Guide → Re-attempt formula (TEACHER-PERSONA §4.3), never a bare ✗ (per DD13). Nothing here is graded (per METHODOLOGY-MODEL Step 5); telemetry (hint depth, DD7 tags) flows silently.
4. Return to `ThisWeekHub` — Day 1 tile lights up ("ignition, not assessment" — METHODOLOGY-MODEL Step 5). Ms. Wren: strategy-praise + the done-ritual line (TEACHER-PERSONA response format).

**Decision branches:**
- **Guided practice struggle** (2 interventions on one item, per TEACHER-PERSONA §4.2 move-on rule): item parks to `TreasureChest`; if the *whole set* labors, Ms. Wren offers "want to watch my favorite example again?" → `LessonRoom` segment replay, then resume.
- **Returning mid-week:** hub shows current unlocked day tile as the single primary action; lesson and anchor accessible but secondary.
- **Accelerated mode** (per METHODOLOGY-MODEL Step 10): the hub's "next week" reveal can occur same-calendar-week after a pass; visual rhythm identical — the cycle, not the calendar, is invariant (per DD2).

**Emotional design by band:**
- **A:** lesson segments ≤90 seconds each with a tap-to-continue between; mascot watches the lesson too; guided practice is "let's do it together" hand-over-hand (tap where Ms. Wren points).
- **B:** puzzle-flavored hook welcome; child predicts the next step aloud/tapped during modeled examples ("what do I do next?" choice chips); two-step instructions max (TEACHER-PERSONA B1).
- **C:** lesson is denser and honest about structure ("three examples, then you take over"); prediction prompts become "convince me" micro-questions; guided practice fades scaffolds explicitly and says so (per E60's fade-visible convention at D).

**Failure / edge cases:**
- **Lesson abandoned mid-way:** resumes at segment boundary; after 2+ days idle, Ms. Wren offers a 60-second recap first `[original design]`.
- **Offline:** the whole flow works from the precached pack (scripts + examples authored upstream); only LLM extemporization degrades (global rule).
- **Repeat week (child re-enters a completed week's hub):** hub shows the settled done-state; lesson and puzzle replayable; practice pages read-only — no re-grinding completed pages (P1: no extra dose).

---

## Flow 3 — Daily independent practice (Days 1–4 core pattern)

**Implements:** loop Step 6 (Practice, per E41). Day content per DD3 template: Day 1 concept echo; Days 2–3 fluency + application (sprints live here); Day 4 word problems.

**Entry point:** today's lit day-tile on `ThisWeekHub` (daily unlock enforced, per E46/E79; day-numbered so a missed day shifts, per DD3).

**Steps:**
1. Tile tap → `WarmUp` — 2–4 quick items that are secretly spaced retrieval of older concepts (per DD8, styled per Ms. Wren law 7: "warm-ups," never "review of what you forgot"). Fast, friendly, immediate confirm-on-answer.
2. `PracticePage` — the day's 2–3 pages, 3–6 problems each (per DD3/E64), one problem in focus at a time (P2). Each objective item auto-checks on submit with **immediate feedback** (per DD13): correct → brief specific confirm; miss → explanation-on-miss via the correction formula and `HintLadder` (P8), DD7 tag logged silently. `AnchorPanel` and `ScratchPad` always available (P7/P3). Page transitions show "page 2 of 3" quietly.
3. *(Days 2–3 only, ≤2/week)* `SprintGate` may appear between pages — see Flow 5. Declining is frictionless and unremarkable.
4. *(Day 4)* `PracticePage` in `word-problems` mode: story problems, read-aloud available at all bands (per E38/DD3); band A stories are app-read by default (CURRICULUM-MAP Level A audio-first).
5. `DayDone` — the quiet daily completion state (P5.3): the day-tile fills on a soft transition; Ms. Wren gives one strategy-praise naming today's best move + the done-ritual line + tomorrow preview ("Tomorrow's tile unlocks in the morning!", per Ms. Wren law 6). **Nothing extra unlocks for finishing early** (per METHODOLOGY-MODEL Step 6).

**Decision branches:**
- **Miss → hint ladder:** rung 1 orienting question → rung 2 locate the step → rung 3 similar worked example → attempted again → answer with full reasoning only after (P8). Same-item re-attempt after slips/misreads; fresh isomorph after a reteach (TEACHER-PERSONA §4.2 routing).
- **Two interventions spent:** item parks to `TreasureChest` warmly ("this one goes in our treasure chest for tomorrow") and the flow continues — the weekly gate, not any item, decides advancement (TEACHER-PERSONA §4.2).
- **Patterned misconception detected** (per DD7 pattern flag): Ms. Wren inserts a 60–90s micro-reteach inline (worked example first), then a fresh isomorph — not saved for Friday; the cheapest moment is now (per DD13 rationale).

**Emotional design by band:**
- **A:** ≈5 min total; one operation per page early weeks (per E62); answers drawn/tapped/circled in oversized boxes (per E62/E65); every instruction has `AudioButton`; correction is re-enactment, never labeling (TEACHER-PERSONA A5). Done-state includes a small "show a grown-up" moment (Teacher's-Note strip pattern surfaces on Day 5, per E57).
- **B:** ≈10 min; NumberPad entry; scaffolds visible (place-value columns per E53); Ms. Wren's "find the sneaky step" correction style (B4); light challenge framing permitted (B3).
- **C:** 10–15 min; symbolic entry, typed short-answers where the page demands; interleaved items presented without apology ("mixed set — you have to notice which tool fits", per DD8 interleaving); estimation-first prompts before computation (per CURRICULUM-MAP D/E conventions).

**Failure / edge cases:**
- **Mid-day abandon:** state saved per item; tile shows a partial-fill; re-entry resumes at the exact item with a warm "we were right here." No time pressure to return, no push notification guilt (P12).
- **Repeat day (child returns same day after finishing):** `DayDone` settled state; pages browsable read-only; Ms. Wren celebrates the appetite and protects the ritual (law 6). The only actionable item: `TreasureChest` if occupied.
- **Missed day(s):** Day labels shift (Day 3 is simply next, per DD3); no "you missed 2 days" messaging ever (P5 no-loss-state). After ≥7 idle days, next entry opens with a 60-second lesson recap offer.
- **Offline:** full flow works from cache; sync later (global rule).

---

## Flow 4 — Day-5 special: PuzzleGrove page by band

**Implements:** the non-computational strand (per DD12, E26/E66); Day 5 also carries the weekly check (Flow 6) — order: warm-up → puzzle → check `[original design: puzzle before check keeps Day 5 feeling like play-then-finish, not exam day]`.

**Entry point:** Day-5 tile on `ThisWeekHub` (visually identical to other tiles — Day 5 is "the last page of the week, not an exam", per METHODOLOGY-MODEL Step 9).

**Steps:**
1. `WarmUp` — as Flow 3 (mixed retrieval slice per DD3).
2. `PuzzleGrove` — the week's one non-computational page, always same-concept transfer (strand-coupling law, per E26/METHODOLOGY-MODEL §3), under the module's own puzzle mark "Puzzle Grove" (per QUESTION-GENERATOR-SPEC legal note — never Best Brains' branded page names):
   - **A band:** multi-modal/manipulative task (build, sort, color, match — per E57/DD12) + the parent-facing Teacher's-Note-style strip rendered as a "show a grown-up" card (per E57).
   - **B band (Levels B–C):** logic-puzzle page (per E58): riddles, balance-scale logic, secret codes. Playfulness lives in the task mechanics (P5.5).
   - **C band (Levels D–E):** error-analysis / written-explanation page (per E59): spot-the-mistake, Always/Sometimes/Never, "both students are right — explain." Typed justification lines are normal work, not extra (TEACHER-PERSONA C4).
3. Ms. Wren responds to puzzle work qualitatively (strategy talk, not scoring) — the puzzle is never part of the objective gate %, but written explanations are DD7-tagged as formative data (per DD12/METHODOLOGY-MODEL §3).
4. Transition to `WeeklyCheck` (Flow 6) framed as "last page of the week."

**Decision branches:** puzzle skippable *only* by parking ("brain marinating — we can come back after the check") `[original design]`; it must be completed before the week fully closes (dual-strand law, per E26), so an unfinished puzzle keeps Day 5's tile partial even after the check.

**Emotional design by band:** A = the puzzle is the week's dessert, mascot most present here; B = "Puzzle Grove" framed as a place ("back to the Grove!"); C = framed as the week's most respectful challenge ("this is the page where you get to be the teacher").

**Failure / edge cases:** open-ended answers (draw/build) are stored and shown to the parent in the report context where relevant, judged locally by simple satisfiability checks or acknowledged without grading `[original design]`; abandon/offline per global rules; if the child's week is in corrective state, PuzzleGrove stays available — other strands keep moving (per DD1).

---

## Flow 5 — Timed fluency sprint (Level B+)

**Implements:** DD11 exactly; framing per TEACHER-PERSONA B6 and P11. Never at Level A (CURRICULUM-MAP Level A notes).

**Entry point:** `SprintGate` offered between pages on Day 2 or 3 (per DD3), ≤2/week, only when the pack carries a sprint (`fluencySprint` non-null, per QUESTION-GENERATOR-SPEC) and the parent hasn't opted out (per DD11 posture / `PARENT-FLOWS.md` flow 8).

**Steps:**
1. `SprintGate` — Ms. Wren states the three fixed facts before every start (TEACHER-PERSONA B6): two minutes · you versus your own last time · never graded. Skill named and explicitly old ("your ×5 facts from three weeks ago — already yours"). Buttons: "Let's go" / "Not today" (equal visual weight `[original design]` — declining is a real option, P11).
2. `SprintRun` — items served one at a time; soft filling-arc time indicator, no ticking, no red endgame (P11); wrong answers simply advance (no correction mid-sprint — flow state protected `[original design]`); child may stop early via a calm "done for now" — partial sprints are fine.
3. `SprintFinish` — the timer "sings" and everything simply stops (Ms. Wren's metronome framing, TEACHER-PERSONA §1). Display: today's count vs *your* last time only — no stars, no grade, no confetti (per DD11/E54). Ms. Wren's comment is strategy/automaticity-framed ("those facts are becoming automatic — that frees your brain for the new stuff"). Missed facts silently join the DD8 retrieval pool and next sprint pool (TEACHER-PERSONA §4.2 fact-recall routing).

**Decision branches:** decline → nothing happens, no record shown, re-offer next eligible day at most (never same-day re-ask); first-ever sprint gets an extra sentence of demystification; a *worse* count than last time gets honest calm ("counts wobble — the you-versus-you game is long").

**Emotional design by band:** **B:** the metronome/music metaphor, warm and brief. **C:** collegial framing ("automaticity training — musicians and athletes do exactly this"); child sees their own small history sparkline (self-referenced only, P4).

**Failure / edge cases:** interruption mid-sprint (call, tab close) → sprint discarded without comment, not counted against the ≤2/week; repeated declines (3+ consecutive) → module quietly reduces offers and surfaces a gentle note in the parent's `PatternsView` (not a nag, an observation) `[original design]`; offline → sprints fully local.

---

## Flow 6 — Weekly mastery check → Passed / "one more round" → corrective loop

**Implements:** loop Steps 7–9 and DD1 verbatim (Pass ≥85%; micro-reteach → Form B isomorphs → re-score; fast-track ≥95%; two failures → live-teacher escalation + placement re-check). Child-facing language law: P6 (no "Review," no %, no fail).

**Entry point:** final section of Day 5, after `PuzzleGrove` (Flow 4).

**Steps:**
1. `WeeklyCheck` — Form A objective items, presented as "the last page of the week" in the same visual dress as `PracticePage` (per METHODOLOGY-MODEL Step 9 — it feels like the last page, not an exam). Differences, stated honestly by Ms. Wren at C band and shown gently at all bands: immediate per-item feedback pauses here ("I'll hold my comments till the end so you can show me your own thinking"), and the `AnchorPanel` shows only the strategy card, not the worked examples (`[original design]` — the check measures the skill, not example-copying; the honesty framing satisfies P7's violation test). `ScratchPad` stays.
2. Submission → platform computes score (per DD1/E98-analog computed verdict; Ms. Wren can never alter it, TEACHER-PERSONA §5).
3. **Branch A — Pass (≥85%):** `WeekResolve` — the week's slightly-warmer completion moment (P5.3): concept named as owned ("two-digit subtraction is *yours* now"), Mastered Shelf gains the concept (visible add), `JourneyMap` advances one rung, next week previewed (TEACHER-PERSONA §5 pass script). The mastered concept quietly enters the DD8 warm-up rotation ("it'll sneak back into warm-ups — you'll squash it every time").
4. **Branch B — Below 85%:** `StrengthenPlan` — Ms. Wren's near-miss script (TEACHER-PERSONA §5): the specific wobbly skill named ("just the renaming step, nothing else"), the plan stated (short revisit + brand-new problems), and the non-stuck guarantee ("everything else keeps moving"). No %, no "Review," no red, and the screen is visually as warm as `WeekResolve` (P6 violation test). Then, usually next day (1–2 days, per METHODOLOGY-MODEL Step 9):
5. `MicroReteach` — worked-example-first reteach of only the missed skill, selected by the DD7 tags (per DD1/§5 state machine). Short: 2–4 minutes.
6. `FreshProblems` — Form B isomorphs, explicitly framed as new ("brand-new problems — not the old ones, that would just test your memory of the pages", TEACHER-PERSONA §5). Re-score.
   - **≥95% on first corrective pass:** fast-track — `WeekResolve` with the extra strategy-credit script ("one reteach and you *owned* it").
   - **≥85%:** `WeekResolve`, standard warm pass.
   - **<85%:** cycle 2 → back to `MicroReteach` with a different angle (per DD7 tag routing), then `FreshProblems` (new isomorphs again).
7. **Branch C — second cycle also <85%:** escalation (per DD1): Ms. Wren's second-fail script — reinforcements framing, live human teacher handoff presented as an upgrade, placement re-check owned by the program ("too steep a hill — that's *ours* to fix", TEACHER-PERSONA §5). Child-side: a friendly "a real teacher from our team wants to look at this with you" card with the scheduled/queued state; meanwhile other strands and `TreasureChest` remain active (per DD1's blocks-only-the-gated-strand law). Placement re-check runs as Flow 1's re-check variant.

**Decision branches (summary):** Pass / near-miss / fast-track / cycle-2 / escalation — exactly the DD1 state machine (METHODOLOGY-MODEL §5 pseudocode); no UI state exists outside it.

**Emotional design by band:**
- **A:** the check is invisible as an event — just the week's final items; outcomes delivered as story ("this one goes on your shelf!" / "one more round to make it stick — like gluing"). Re-teach is "let's watch my favorite example again."
- **B:** check named honestly but lightly ("show-what-you-know page"); on near-miss, the wobbly step gets a name the child can repeat; Form B introduced with the fairness argument (new problems = real test of the skill).
- **C:** full honesty: the child may be told the gate exists and is un-negotiable but kind ("the gate can't be sweet-talked — that's what makes passing it mean something") `[original design]`; % still not shown (P6); the reteach is framed as debugging, not punishment.

**Failure / edge cases:**
- **Abandon mid-check:** resumes at the same item; items answered stand (no restart-scumming — Form A is served once `[original design]`).
- **Offline at submission:** answers queue; Ms. Wren defers the tally warmly; verdict lands on next sync; the parent report waits for it (weekly rhythm bends, never breaks, per DD2's cycle-not-calendar law).
- **Corrective loop spanning a week boundary:** the next week's reveal waits for the gated strand only if the child is fully blocked; otherwise the new week opens while the corrective thread runs alongside (per DD1). The hub shows both threads without alarm: "This week: Fractions · Still strengthening: Renaming."
- **Escalation queue delays:** visible queue state, honest wait framing (per DD15's SLA-with-visible-queue posture vs E86).

---

## Flow 7 — Mistake review (`TreasureChest`)

**Implements:** the parked-item ritual (TEACHER-PERSONA §4.2 move-on rule) + DD8's principle that errors become tomorrow's material. `[original design]` assembly.

**Entry point:** the `TreasureChest` affordance on `ThisWeekHub`, badged only with a quiet count; also offered by Ms. Wren at the start of the next day's session ("shall we open the treasure chest first?") — feedback-first session opening, per DD4's 0–5 min slice.

**Steps:**
1. `TreasureChest` — parked items shown as small closed chests, one per item, no red marks (P6). Opening one replays the item's context.
2. For each item, Ms. Wren runs the §4.2 route for its logged DD7 tag: slip → hint at the located step, same item re-attempt; misconception → mini worked example, then a *fresh isomorph* (never the identical parked item after a reteach, per DD1's Form-B principle); representation misread → re-read the picture together; task-comprehension → re-hear the story, child restates it.
3. Resolved items leave the chest with a specific strategy-praise; the resolution flows to the learner profile (per DD7 telemetry) and the DD8 scheduler.
4. Empty chest → tiny settled moment, back to the hub.

**Decision branches:** an item missed *again* in the chest parks once more with tomorrow's date, max twice — then it stops appearing as a chest and its skill is folded into warm-up rotation instead (never an ever-growing guilt pile `[original design]`; the weekly gate remains the only judge, per DD1).

**Emotional design by band:** **A:** chest is literal treasure play; re-attempts are re-enactments (A5). **B:** "sneaky ones we caught" framing — the child is the detective. **C:** framed as an error log a mathematician keeps ("professionals keep a list of bugs they've beaten"); child may add a one-line "what tricked me" note (feeds DD7 as self-explanation) `[original design]`.

**Failure / edge cases:** chest never blocks the day's tile (it's an opener, not a gate); items older than 14 days silently retire to the retrieval pool (no stale guilt); offline-safe (items are local pack content).

---

## Flow 8 — Weekly progress view (child-facing, effort-framed)

**Implements:** loop Steps 2/10's map + shelf; P4/P5 framing laws. The child's *only* progress surface is `JourneyMap` `[original design]` — no child-facing dashboards, charts, or percentages (those live on the parent side, per E80/E81's split).

**Entry point:** `JourneyMap` link on `ThisWeekHub`; auto-shown once after each `WeekResolve`.

**Steps:**
1. `JourneyMap` — three zones:
   - **The trail:** the level's 24 concept stops (per CURRICULUM-MAP §0.1), "you are here" pin, mid-level checkpoint and level-exit gate shown as landmarks (bridge/arch), future concepts named but dimmed (feed-up per DD6's goal-clarity principle). Neutral level letter only (per DD2).
   - **The Mastered Shelf:** every passed concept as a named object on a shelf (per METHODOLOGY-MODEL Step 10) — tap one to hear Ms. Wren recall what it is and (C band) see one worked example again; a small note that shelf items "sneak into warm-ups."
   - **This week's effort strip:** the five day-tiles' fill states and days-practiced count — effort-framed ("you showed up 4 days this week"), with no comparison, no history-of-misses, no accuracy stats (P4: effort and moves, never scores).
2. Checkpoint/level-exit moments (weeks 12/24, per CURRICULUM-MAP): the landmark animates once, quietly ("a bigger sense of arrival," per METHODOLOGY-MODEL Step 10); Level-exit passing relocates the pin to the next level's trailhead.

**Decision branches:** during a corrective loop, the current stop shows the "strengthening" state (same warm visual language as Flow 6); in accelerated mode the trail simply advances faster — the map never displays pace.

**Emotional design by band:** **A:** the map is a picture-book path; shelf items are toys; narration by Ms. Wren. **B:** the trail is an adventure map; landmarks named. **C:** cleaner cartography, the shelf reads like a table of contents of owned mathematics; the child may collapse decoration entirely (per E60's decoration-drops-away law).

**Failure / edge cases:** a long absence shows the same map, pin unmoved, zero guilt copy ("your trail waited for you"); no data → placement CTA; offline → fully cached.

---

## Flow-to-loop coverage check

| Loop step (METHODOLOGY-MODEL §1) | Flow |
|---|---|
| 1 Placement | Flow 1 |
| 2 Personalized Plan | Flow 1 (`StartingPoint`→`JourneyMap`) |
| 3 Weekly Concept | Flow 2 (`ThisWeekHub`) |
| 4 Teacher Explanation | Flow 2 (`LessonRoom`) |
| 5 Guided Practice | Flow 2 (`GuidedPractice`) |
| 6 Daily Independent Practice | Flows 3–5 |
| 7 Weekly Grading | Flow 6 (immediate item feedback per DD13 lives in Flow 3) |
| 8 Parent Feedback | `PARENT-FLOWS.md` flow 2 (witness thread) |
| 9 Mastery Check | Flow 6 |
| 10 Next Concept | Flows 6→8 (`WeekResolve`→`JourneyMap`) |

*End of child flows. Part B screen specs must implement these screens by canonical name, cite P-numbers for layout decisions, and may not add child-facing scores, skips of first-encounter lessons, or any state outside the DD1 machine.*
