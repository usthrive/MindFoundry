# SCREEN SPECS — Best Brains-Inspired Math Module (Mind Foundry)

**Phase 5B deliverable · UI/UX Designer · 2026-07-19**
**Governed by:** `PRODUCT-PRINCIPLES.md` (P1–P12), `CHILD-FLOWS.md`, `PARENT-FLOWS.md`. Report structure owned by `TEACHER-PERSONA.md` §6. Content shapes per `QUESTION-GENERATOR-SPEC.md` pack anatomy. Everything uncited is `[original design]`.
**Nature of this document:** intent-based specs for the downstream visual-design agent — *what must exist and why*, never pixel prescriptions. Canonical screen names are used verbatim from the flow docs; no screens added.
**Global laws restated (bind every screen):** child surfaces never show %, grades, the word "Review," or red-X iconography (P6); the P5 exception list is closed (no points/badges/confetti; existing `CelebrationContext` unused); band input law (A: tap-first + audio-carried; B: dual audio+text + NumberPad; C: symbolic + typed) per P10; `AnchorPanel` one tap from every practice screen, strategy-card-only during `WeeklyCheck` (P7); DD1 state machine is the only mastery state space; daily unlock with no early unlock and a 15-min hard cap (P1, E12); every stored signal parent-visible (P12).

**Data-source vocabulary used below:** `pack.*` = `WeeklyConceptPack` fields (QUESTION-GENERATOR-SPEC §1–2); `profile.*` = learner-profile telemetry (DD7 tags, hint depth, gate state); `week.state` = DD1 machine state; `child.*` = platform child profile.

---

## A. Placement journey

### `PlacementWelcome`
**Purpose.** Warmly frame placement as exploration, never a test, and start the walk (DD5).
**Key elements.** `WrenBubble` with self-introduction ← child.age band guess; framing copy ("some easy, some new — both help me"); single primary CTA "Let's go"; `AudioButton` on all copy. No timer, no progress %, no mention of scoring.
**States.** default; re-check variant (DD1 escalation) with responsibility framing ("I want to double-check my own homework"); offline-uncached → calm parent-directed note ("Ms. Wren needs the internet to set up your journey").
**Success behavior.** CTA → `PlacementActivity`.
**Principle hooks.** P4 (no speed cues), P6 (no test framing), P10 (band voice), DD5.

### `PlacementActivity`
**Purpose.** Run the adaptive placement walk and collect level evidence without ever feeling like a test.
**Key elements.** One item in focus ← adaptive engine over the item bank (DD5: 4–6 items/cluster, ≥80% up, <50% down); band-law inputs (A: `TapToSelect`/drag/draw; B: `NumberPad`; C: symbolic); identical warm-neutral acknowledgment on every answer ("Got it!") — never right/wrong; soft pause offer every ~8 items ("Want to stretch, or keep going?"); no `AnchorPanel` (nothing taught yet); no score, progress-as-path only at B band.
**States.** in-progress; paused; resume (<7 days → same cluster; >7 days → fresh restart); A-band safety exit (3 idle timeouts or rapid random taps → end at safest lower placement); A-band ~15-min cap; re-check variant (shorter, doubted clusters only).
**Success behavior.** Walk converges → `StartingPoint`.
**Principle hooks.** P2 (one item in focus), P10 band law, DD5, P4.

### `StartingPoint`
**Purpose.** Reveal the placed level as a celebration of strengths, never a rank.
**Key elements.** "We found your starting point!" moment; 2–3 strengths named by concept ← placement evidence; level shown as neutral letter only (DD2 — never a grade); gentle "you are here" pin-drop preview of the trail; `WrenBubble` narration + `AudioButton`.
**States.** default; mid-level entry (front-block mastered → pin lands mid-trail, no comment on skipping); re-check variant (pin may move; framed as calibration, program-owned).
**Success behavior.** Single CTA → `JourneyMap` (first view).
**Principle hooks.** P6 (never a verdict), DD2, P4 (strengths by name), P5 (quiet, no confetti).

---

## B. Weekly cycle

### `ThisWeekHub`
**Purpose.** The module's home: answer "which week and day am I in?" at a glance and offer exactly one primary action (P1, P2).
**Key elements.** Concept card ← `pack.identity.conceptName` + one-line why ← `pack.explanation.whyBeforeHow` (kid-shortened); five day-tiles ← `pack.days[]` + completion state (today lit, done filled, future locked — a lock that reads as "resting," not forbidding); `AnchorPanel` handle (empty until lesson complete); `TreasureChest` entry with quiet count badge only when occupied; `JourneyMap` link; corrective thread line when active ("This week: Fractions · Still strengthening: Renaming").
**States.** Monday reveal (concept card flips open, Day 1 behind lesson gate); mid-week (today's tile = single primary action); week-complete settled state; partial-day tile fill; corrective dual-thread; repeat-visit-after-done (read-only pages, chest only actionable); offline (fully cached).
**Success behavior.** Tile tap → `WarmUp` (or `LessonRoom` first on Day 1); no early unlock ever, nothing extra for finishing early (P1 violation test).
**Principle hooks.** P1, P2, P5.1/P5.4 (tiles + no-loss indicator), P7, E46/E79, DD3 (Day labels, never weekday names).

### `LessonRoom`
**Purpose.** Deliver Ms. Wren's 5–10 min concept lesson: hook → why-before-how → worked examples thinking-aloud → summary → vocabulary (DD4, E5).
**Key elements.** Segment player ← `pack.explanation.script[]` (say + visual); pause / replay-segment / "explain that again" controls; vocabulary cards ← `pack.explanation.vocabulary[]` (term + kidGloss); segment progress as simple dots; on completion, a visible "pinning" of worked examples ← `pack.guidedExamples[]` into the `AnchorPanel` ("These stay right here all week," E99). Band A: segments ≤90s with tap-to-continue; C: denser, structure announced.
**States.** first-encounter (**no skip control exists** — P8 hard law); replay (freely navigable); resume-at-segment-boundary; stale-return (2+ days → 60-second recap offer); offline (cached scripts).
**Success behavior.** Final segment + pin animation → `GuidedPractice`.
**Principle hooks.** P8 (unskippable first pass), P7 (anchor filled here), P10, E68/E44, DD4.

### `GuidedPractice`
**Purpose.** Practice *with* Ms. Wren through the scaffold fade: modeled → completion → prompted → independent (DD4).
**Key elements.** One example in focus ← `pack.guidedExamples[]` in fadeLevel order; per-step interaction ← `steps[]` (teacherSay narrated, childDo as the input moment); band inputs per law; `HintLadder` + Acknowledge→Locate→Guide→Re-attempt on errors (never a bare ✗, DD13); `AnchorPanel` + `ScratchPad` available; nothing graded — telemetry (hint depth, DD7 tags) flows silently.
**States.** modeled (child taps along); completion (child fills missing steps); prompted; independent; struggle (2 interventions → item parks to `TreasureChest`; whole-set labor → offer `LessonRoom` segment replay, then resume); resume-at-step.
**Success behavior.** Last example done → return to `ThisWeekHub`; Day-1 tile lights; strategy-praise + done-ritual line.
**Principle hooks.** P8, P3 (manual work), P2, P4, DD4, TEACHER-PERSONA §4.3.

---

## C. Daily practice

### `WarmUp`
**Purpose.** Open every practice day with 2–4 fast retrieval items styled as warm-ups, never "review of what you forgot" (DD8, Ms. Wren law 7).
**Key elements.** Items ← `pack.days[n].items` where `isRetrieval=true`; one in focus; immediate friendly confirm on answer; band inputs; `AudioButton` everywhere; a light "warming up" frame (stretching metaphor welcome, no timer).
**States.** default; miss (correction formula inline, brief); complete → auto-flow onward; resume.
**Success behavior.** Last warm-up → `PracticePage` (Days 1–4) or `PuzzleGrove` (Day 5).
**Principle hooks.** DD8, P2, P4 (no speed), P10.

### `PracticePage`
**Purpose.** The core daily work surface: the day's 2–3 pages, 3–6 problems each, one problem in focus at a time (P2, E64/E62). Modes: `fluency`, `application`, `word-problems`.
**Key elements.** Focused item ← `pack.days[n].items` (non-retrieval); page indicator "page 2 of 3" (quiet); band inputs per law (A: oversized tap/drag/draw boxes, one operation per page early weeks per E62; B: `NumberPad` + visible scaffolds e.g. place-value columns per E53; C: symbolic + typed short answers, estimation-first prompts); immediate feedback per DD13 — correct → brief specific confirm; miss → `HintLadder` + correction formula, DD7 tag logged silently; `AnchorPanel` handle and `ScratchPad` persistent (P7/P3); word-problems mode: read-aloud on every story at all bands (E38), A-band app-read by default.
**States.** in-progress; hint-open; miss-explaining; item-parked (2 interventions → `TreasureChest`, warm copy); inline micro-reteach (patterned misconception → 60–90s reteach + fresh isomorph, DD7 pattern flag); page transition; resume-at-item ("we were right here"); idle-timeout → soft landing on `DayDone` partial; offline (cached).
**Success behavior.** Last page done → `DayDone` (Days 2–3 may interpose `SprintGate` between pages).
**Principle hooks.** P2, P3, P7, P8, DD13, DD7, DD3, P10.

### `PuzzleGrove`
**Purpose.** The week's one non-computational page — same-concept transfer under the module's own "Puzzle Grove" mark (DD12, E26; never any other company's puzzle branding).
**Key elements.** Puzzle ← `pack.puzzle` (title, prompt, hintLadder); band formats: A = build/sort/color/match manipulative task + "show a grown-up" card ← `pack.days[4].teacherNoteStrip` (E57); B = logic puzzle (riddles, balance-scale, codes — play lives in the task, P5.5); C = error-analysis / Always-Sometimes-Never / "both students are right — explain" with typed justification (E59); qualitative Ms. Wren response (strategy talk, never a score); `AnchorPanel` + `ScratchPad` available.
**States.** default; parked ("brain marinating — we can come back after the check") — Day-5 tile stays partial until the puzzle closes the week (dual-strand law, E26); manual-review answers acknowledged without grading; corrective-state (puzzle stays available — other strands keep moving, DD1).
**Success behavior.** Done (or parked) → transition to `WeeklyCheck` framed as "last page of the week."
**Principle hooks.** DD12, E26/E57–E59, P5.5, P4.

### `DayDone`
**Purpose.** The quiet daily completion moment (P5 exception 3) — settled, never celebratory.
**Key elements.** Day-tile fill on a soft transition ← day completion state; one strategy-praise naming today's best move ← session telemetry; done-ritual line + tomorrow preview ("Tomorrow's tile unlocks in the morning!", Ms. Wren law 6); A band: small "show a grown-up" affordance. **No confetti, no fanfare audio, no points** (P5 closed list).
**States.** full completion; partial (idle timeout / frustration flag: "we'll finish this tomorrow — it will wait for you"); repeat visit (settled state, pages read-only, chest link if occupied).
**Success behavior.** Single dismiss → `ThisWeekHub`. Nothing extra unlocks for finishing early (P1).
**Principle hooks.** P5.3, P4, P1, Ms. Wren law 6.

### `SprintGate`
**Purpose.** Offer the fluency sprint with the three fixed facts, making "no" a real choice (P11, DD11, TEACHER-PERSONA B6).
**Key elements.** Ms. Wren states, before any start control: two minutes · you versus your own last time · never graded; skill named and dated as old ← `pack.fluencySprint.skill`/`sourceWeek` ("your ×5 facts from three weeks ago — already yours"); two buttons of **equal visual weight**: "Let's go" / "Not today"; first-ever variant adds one demystifying sentence.
**States.** default; first-ever; hidden entirely when `fluencySprint=null`, Level A, parent opt-out, or ≤2/week spent; never re-asks same day after decline.
**Success behavior.** "Let's go" → `SprintRun`; "Not today" → back into `PracticePage` flow with zero comment or record shown.
**Principle hooks.** P11, DD11, E54, B-band+ only.

### `SprintRun`
**Purpose.** The 2-minute self-referenced sprint — a metronome, not a judge (P11).
**Key elements.** One item at a time ← sprint generator (`pack.fluencySprint.generator`); soft filling-arc time indicator — **no ticking, no pulsing red endgame, no countdown numerals**; wrong answers simply advance (no mid-sprint correction — flow protected); calm "done for now" early-exit always visible; B-band `NumberPad` / C-band symbolic entry.
**States.** running; early-exit (partial counts fine); interrupted (tab close/call → discarded silently, not counted against ≤2/week); offline (fully local).
**Success behavior.** Timer "sings" → everything simply stops → `SprintFinish`.
**Principle hooks.** P11, DD11, E54, P4.

### `SprintFinish`
**Purpose.** Close the sprint with calm self-reference only.
**Key elements.** Today's count vs *your* last time ← sprint history (this child only) — no stars, no grade, no confetti; Ms. Wren automaticity framing ("those facts are becoming automatic — that frees your brain for the new stuff"); C band: tiny personal history sparkline (self-referenced only); worse-than-last-time honesty ("counts wobble — the you-versus-you game is long"); missed facts silently join DD8 retrieval + next sprint pool (no visible miss list).
**States.** improved; steady; wobbled; first-ever (no comparison line — "now you have a number to play against").
**Success behavior.** Dismiss → resume `PracticePage` flow.
**Principle hooks.** P11, P4, DD11, DD8.

### `TreasureChest`
**Purpose.** Turn parked misses into tomorrow's warm ritual — an opener, never a gate or guilt pile.
**Key elements.** Parked items as small closed chests ← `profile` parked-item log (no red marks, P6); opening replays the item's context; per-item DD7-tag routing (slip → same-item re-attempt; misconception → mini worked example + **fresh isomorph**, never the identical item post-reteach; misread → re-read together; comprehension → restate the task); resolution praise names the move; empty-chest tiny settled moment. C band: optional one-line "what tricked me" note (feeds DD7).
**States.** occupied (count badge on hub); empty; item-missed-again (re-parks max twice, then folds to warm-up rotation — never an ever-growing pile); stale items >14 days silently retire.
**Success behavior.** Chest emptied or dismissed → `ThisWeekHub`; never blocks the day's tile.
**Principle hooks.** P6, P5, DD7/DD8, TEACHER-PERSONA §4.2.

---

## D. Mastery journey

### `WeeklyCheck`
**Purpose.** The Form A weekly check, dressed as "the last page of the week," never an exam (METHODOLOGY-MODEL Step 9).
**Key elements.** Items one-in-focus ← `pack.masteryCheck.formA` — **same visual dress as `PracticePage`**; two honest differences, stated by Ms. Wren (gently at A/B, plainly at C): per-item feedback pauses ("I'll hold my comments till the end so you can show me your own thinking"), and `AnchorPanel` shows **strategy card only, worked examples hidden** (P7 exception — the check measures the skill, framed honestly, never silently); `ScratchPad` stays; no timer anywhere (P4/P11: graded work is never timed).
**States.** in-progress; resume-at-item (answered items stand — Form A served once, no restart-scumming); submitting; offline-at-submission (answers queue, "I'll tally this when we're back online" — verdict lands on sync).
**Success behavior.** Submit → platform computes score (Ms. Wren can never alter it) → routes on the DD1 machine: ≥85% → `WeekResolve`; <85% → `StrengthenPlan`. **No other outcome states exist.**
**Principle hooks.** P6, P7 (strategy-card-only), P4, DD1, P2.

### `WeekResolve`
**Purpose.** The week's slightly-warmer completion moment (P5 exception 3): concept owned, shelf grows, next week previewed.
**Key elements.** Concept named as owned ("two-digit subtraction is *yours* now") ← `pack.identity.conceptName`; visible Mastered Shelf addition + `JourneyMap` rung advance; next-week preview ← next pack identity; warm-up foreshadowing ("it'll sneak back into warm-ups — you'll squash it every time"); fast-track variant adds the strategy-credit line ("one reteach and you *owned* it"). **No %, no grade, no confetti** — warmth over fanfare.
**States.** standard pass; fast-track pass (Form B ≥95% first corrective pass); post-corrective pass (identical warmth to first-pass — visually indistinguishable in tone).
**Success behavior.** Continue → `JourneyMap` auto-shown once, then `ThisWeekHub` (next week reveal when the cycle turns).
**Principle hooks.** P5.3, P6, P1, DD1, TEACHER-PERSONA §5.

### `StrengthenPlan`
**Purpose.** The non-pass outcome as continuation: "one more round to make it stick" — visually exactly as warm as `WeekResolve` (P6 violation test).
**Key elements.** The one wobbly skill named specifically ← dominant DD7 tag ("just the renaming step, nothing else"); the plan stated: short revisit + brand-new problems; the non-stuck guarantee ("everything else keeps moving") with the other strands visibly alive; schedule hint (reteach "tomorrow"). **Absent by law:** %, "Review," red, sad iconography, darker styling of any kind.
**States.** cycle-1 entry; cycle-2 entry (different angle promised); escalation variant (second cycle <85%): friendly "a real teacher from our team wants to look at this with you" card + visible queue/scheduled state + placement re-check framing owned by the program ("too steep a hill — that's *ours* to fix"), other strands and chest remain active.
**Success behavior.** Acknowledge → `ThisWeekHub` (dual-thread state); next day → `MicroReteach`.
**Principle hooks.** P6 (hard law), DD1, TEACHER-PERSONA §5, P5.

### `MicroReteach`
**Purpose.** 2–4 minute worked-example-first reteach of only the missed skill (DD1).
**Key elements.** Reteach segment ← `pack.mistakeBank[tag].reteachPointer` → the pointed explanation segment / guided example, rebuilt from the lesson's concrete model; replay control; cycle-2 uses a different angle ← alternate reteach pointer by DD7 tag; `AnchorPanel` available; band-voiced framing (A: "let's watch my favorite example again"; C: debugging frame).
**States.** cycle-1; cycle-2 (new angle); resume.
**Success behavior.** Reteach complete → `FreshProblems`.
**Principle hooks.** DD1, P8 (teach before re-attempt), DD7, P10.

### `FreshProblems`
**Purpose.** The Form B re-check, explicitly framed as brand-new problems — never the old ones (DD1 Form-B law).
**Key elements.** Items one-in-focus ← `pack.masteryCheck.formB` (index-paired isomorphs; **never identical to Form A** — enforced upstream by QG-4, honored here by never re-serving Form A surfaces); framing copy ("brand-new problems — not the old ones, that would just test your memory of the pages"); same visual dress as `WeeklyCheck` (feedback held, strategy-card-only anchor, `ScratchPad` on).
**States.** in-progress; resume; submitting; offline-queue.
**Success behavior.** Re-score on the DD1 machine: ≥95% → `WeekResolve` fast-track; ≥85% → `WeekResolve`; <85% → cycle 2 (`MicroReteach` new angle) or, after cycle 2, `StrengthenPlan` escalation variant. No other routes.
**Principle hooks.** DD1, P6, P7, P2.

### `JourneyMap`
**Purpose.** The child's **only** progress surface: trail, Mastered Shelf, effort strip — moves and effort, never scores (P4/P5).
**Key elements.** Trail ← curriculum graph: 24 concept stops, "you are here" pin, checkpoint (wk 12) + level-exit (wk 24) landmarks, future stops named-but-dimmed, neutral level letter (DD2); Mastered Shelf ← passed concepts (tap → Ms. Wren recalls it; C band sees a worked example again; "sneaks into warm-ups" note); effort strip ← this week's tile fills + days-practiced count, effort-framed ("you showed up 4 days this week") — **no accuracy stats, no comparison, no miss history**.
**States.** first view (empty shelf: "this shelf is going to fill up"); normal; strengthening stop (same warm visual language as `StrengthenPlan`); checkpoint/level-exit arrival (one quiet landmark animation); long-absence ("your trail waited for you" — pin unmoved, zero guilt); no-data → placement CTA; band variants (A picture-book path → C clean cartography, decoration collapsible per E60).
**Success behavior.** Browse-and-return → `ThisWeekHub`; auto-shown once after each `WeekResolve`.
**Principle hooks.** P4, P5.2, P6, DD2, E60, METHODOLOGY-MODEL Step 10.

---

## E. Parent journey

### `ParentWelcome`
**Purpose.** Educate the parent up front in three ~20-second cards: the rhythm, your role, what this is not (E114 pattern, compressed).
**Key elements.** Card 1 rhythm (one concept/week, 5–15 min/day, weekly check, weekly report — E11/E12/E42; "consistency beats bingeing," E45); Card 2 role ("read one short report, say one praise line, ask one question — you never grade," E15/E71/E102); Card 3 what-it-is-not (not drill, not speed, not a game; sprints ungraded + optional; mastery gates mean some weeks take "one more round" and that's the system working); expandable verdict pre-framing (child never sees "Review" or a % — and why, P6); CTA "Find {child}'s starting point" with honest preview ("~25 minutes, feels like exploring, never like a test").
**States.** first-run; skipped (cards persist in `ParentHome` help sheet); pre-placement abandoned ("ready when you are," one gentle reminder max).
**Success behavior.** CTA → child placement (Flow 1); on completion → `PlacementStory`.
**Principle hooks.** P9, P12 (no dark patterns), P6 pre-framing, E114.

### `PlacementStory`
**Purpose.** The placement-results conversation: level, strengths, first-month plan — trust built through honesty (E20 analog).
**Key elements.** Placed level ← placement result: neutral letter + parent-only level↔grade context sentence (DD2); 2–3 strengths by name; 2–3 first-month targets + calendar ← curriculum graph; standing promise: placement is re-checkable (DD1/DD5); report-day scheduler.
**States.** below-grade placement (destigmatizing: "we start where instruction lands, not where frustration lives" — "behind" never said; compressible pacing noted); above-grade (enrichment + school-complement framing, E3); per-child instances (multi-child).
**Success behavior.** Schedule set → `ParentHome`.
**Principle hooks.** DD2, P9, P12 (no fear levers), E20.

### `ParentHome`
**Purpose.** The parent tab: this-week glance + report state + doorway to every view — readable in under a minute (DD15).
**Key elements.** Per-child week strip ← child day-tile states (done/partial/today/upcoming) + concept name + report state (ready / acknowledged / in progress); tile detail on tap ← session log: done state, ~minutes, one strategy note if logged — **never item-level right/wrong** (P9); consistency line, effort-framed ("4 practice days this week") — a gap is simply unfilled, "missed" never said (P5.4); entries to `WeeklyReport`, `ReportHistory`, `TrendsView`/`MasteryMap`, `PatternsView`, `CoachCorner`, `ParentControls`; help sheet (onboarding cards).
**States.** normal; report-ready; unacknowledged reports stacking quietly (no penalty); corrective week ("strengthening" thread matter-of-fact); stale sync ("as of…" stamp); multi-child stacked strips — **never ranked, never compared**; new week Monday reset.
**Success behavior.** Pull-only surface — no daily notifications ever; taps route to the named views.
**Principle hooks.** P9, P5.4, P12, E81, DD15.

### `WeeklyReport`
**Purpose.** Render the TEACHER-PERSONA §6 weekly artifact verbatim and host the acknowledge ritual — the product's trust engine.
**Key elements.** Structure **owned by §6.1, not re-invented here**: header (level letter + week code, concept, **Passed / One more round** + % — % appears exactly once, "Review" never rendered even to parents, no red/green verdict coding) → What we worked on → Where {child} is improving → What we're strengthening (ONE skill + the program's plan) → What to focus on at home (praise line + teach-it-back question ← `pack.parentSummarySeed.homeFocus` + telemetry; ≤monthly school-sync hook) → footer: **Acknowledge tap** ("Seen it — {child} will know their week counted") + history link. Post-acknowledge options: read-aloud TTS, jump to `CoachCorner`. 90–150 words body (§6.2 rule 8).
**States.** pass week; one-more-round week (same calm register); escalation week (program-owns-it + live-teacher scheduling + re-check explanation — calibration, never crisis); verdict-pending ("still finishing up" — notification waits); generation-failure fallback ← `parentSummarySeed` alone (never a missed week); acknowledged (timestamp shown).
**Success behavior.** Acknowledge tap timestamps and files to `ReportHistory`; arrives via the module's **single weekly notification**.
**Principle hooks.** P9, P6 (parent-side softening), TEACHER-PERSONA §6 (owner), E102/E15/E80, DD6.

### `ReportHistory`
**Purpose.** The browsable acknowledged-report archive — the persistent learner profile the family can always revisit (E85).
**Key elements.** Reverse-chronological report list ← report store (week code, concept, verdict word, acknowledged stamp); full report on tap (rendered as originally delivered); profile header (placement story + onboarding cards persist here); export/print affordance.
**States.** populated; sparse (<3 weeks: warm "the story is just starting"); unacknowledged items flagged quietly; multi-child (per-child archives, no combined view).
**Success behavior.** Read-and-return; no actions required.
**Principle hooks.** P9, P12 (everything stored is visible here), E85, DD6.

### `TrendsView`
**Purpose.** At most three honest longitudinal graphics, each carried by teacher voice — trends that prevent anxiety, never create it.
**Key elements.** (1) Untimed accuracy by week ← weekly-check first-pass % — the only % *series* anywhere; 85% gate line explained plainly ("we call it mastered at 85%+ — stricter than school, on purpose," DD1 divergence footnoted as our own standard); (2) retention curve ← warm-up retrieval accuracy on older material (DD8/DD14); (3) fluency self-referenced ← sprint counts (labeled ungraded; hidden entirely on sprint opt-out). Every chart carries a one-sentence Ms. Wren interpretation. **Banned:** red zones, down-arrow iconography, projections/"on track for…".
**States.** <3 weeks data ("still gathering the story"); missed weeks shown as plain gaps (never interpolated); corrective-heavy stretch (reframe copy: "strengthening rounds are the gate doing its job"); sprint-opt-out (panel absent).
**Success behavior.** Tabbed with `MasteryMap`; read-only.
**Principle hooks.** P4 (effort/retention equal weight), P9, P12, DD14, DD15.

### `MasteryMap`
**Purpose.** The parent's gate-state view of the level's 24 concepts — the adult twin of `JourneyMap`, with states the child never sees.
**Key elements.** 24 cells ← curriculum graph + gate outcomes: *mastered* / *mastered after strengthening* (equally mastered, small "took the strong road" annotation) / *strengthening now* / *upcoming*; checkpoint (wk 12) + level-exit (wk 24) marks; monthly-test outcomes ← Test Log (per-test drill-down, DD9); export/print (paper-friendly).
**States.** current level; archived level maps stacked on transition; corrective cell highlighted matter-of-factly; empty (pre-placement).
**Success behavior.** Cell tap → concept detail (what it is, when passed, plan if strengthening); read-only.
**Principle hooks.** P9, P6-spirit (no red/fail cells), DD1, DD9.

### `PatternsView`
**Purpose.** DD7 error patterns translated into parent language, always with the program's own plan attached — diagnosis-and-treatment, never symptoms-for-the-parent-to-treat.
**Key elements.** Miss groups by DD7 primary tag ← `profile` telemetry, each with the fixed gloss (fact-recall → "a math fact that isn't automatic yet"; procedure slip → "knows the idea, skips a step under load"; misconception → "a rule that needs rebuilding"; representation misread → "misread the picture, not the math"; task-comprehension → "answered a different question than asked"); per group: skill name, 1–2 anonymized example *items* (never the child's failed work), pattern-vs-one-off in plain words, **what the program is already doing**; standing footer ("You don't need to fix any of this — it's ours. If you want to help, CoachCorner has tonight's two lines.").
**States.** patterns present; none this week (celebrate briefly + last resolved pattern: "beaten: the renaming step, two weeks ago"); persistent 3+ weeks (notes the escalation machinery and whether engaged); example-item detail (static — no "quiz your child" affordance).
**Success behavior.** Read → optionally `CoachCorner`; linked from report field 3.
**Principle hooks.** DD7 (task-level language always), P9, DD6, P12.

### `CoachCorner`
**Purpose.** Exactly two speakable lines per week — extend instruction into the home without transferring burden.
**Key elements.** Praise-line card ← `pack.parentSummarySeed.homeFocus.praiseLine` + week telemetry (strategy-specific, quotes real evidence) with tap-to-hear Ms. Wren delivery; teach-it-back question card ← `homeFocus.questionForChild` with the why ("kids consolidate by teaching"); fixed three-line etiquette footer (praise the move, not speed/smartness · mid-"one more round" say "strengthening," never "redo" · never quiz — ask to be taught); optional one-tap "used it" (one bit, nothing gamified).
**States.** current week; report-pending (last week's lines, "from last week" tag); first week (honest starter lines from placement strengths); corrective week (genuine praise line guaranteed — parent never armed only with concern); per-child corners.
**Success behavior.** Read/hear/use; deep-linked from `WeeklyReport` field 4.
**Principle hooks.** P9, P4, DD6 (one next step), E71/E102, TEACHER-PERSONA §6.2 rule 9.

### `SchoolSync`
**Purpose.** Optional school-topic input that leans warm-ups toward overlap — never reorders the ladder (E103).
**Key elements.** One input: "What is {child}'s class working on right now?" — free text or strand-tag topic picker; optional syllabus photo → processed to topics then **discarded** (P12); honest effect statement on-screen ("We'll lean {child}'s warm-ups toward overlapping skills when they exist" — backward-only DD8 weighting); no-overlap honesty ("Fractions arrive at Week 15 on {child}'s trail — we won't rush the ladder, and here's why"); ~6-week expiry with gentle "still current?" on the next monthly hook (never a push).
**States.** empty (zero degradation if never used); active entry; topic-behind ("already on the Mastered Shelf — warm-ups will polish it"); topic-ahead (honest wait framing); unparseable (stored as report-generator note only). School name never requested nor stored.
**Success behavior.** Save → confirmation of the honest effect; reachable from `ParentControls` + monthly report hook.
**Principle hooks.** E103, DD8, P12, §6.2 rule 10 (never ahead/behind framing).

### `ParentControls`
**Purpose.** Parent-owned boundaries that can soften but never break the constitution; every control states *why the boundary exists*.
**Key elements.** Sprints on/off per child (DD11/P11; informed copy with the three facts, no steering, no "recommended!"); audio (decorative Ms. Wren voice optional; **instruction TTS never removable** — P10 accessibility floor; sound-effects toggle); session length Short ≈5 / Standard ≈10 / Full ≈15 — **hard-capped at 15, no setting extends the dose** ("more isn't better here — consistency is," E45); schedule (week-reveal day, report notification day/time — the module's only notification); accelerated mode request (2–4 cycles/week, gates intact, honest "mastery still decides pace" note); data panel (view exactly what is stored in plain words — the P12 list; export profile; delete child practice data with plain-language consequence list then hard-delete); escalation contact (live-teacher scheduling with visible queue state, DD15).
**States.** per-child settings; change-pending (effects apply next session, never mid-session); multi-parent last-write-wins + change note; deletion confirm flow.
**Success behavior.** Settings persist; sprint-off hides `SprintGate` and the `TrendsView` fluency panel silently.
**Principle hooks.** P11, P10, P12 (violation tests live here), E12/E45, DD11, DD15.

---

## F. Shared components (5)

### `AnchorPanel` (P7)
**Purpose.** The digital wall poster: this week's worked examples, strategy card, and glossed vocabulary — one tap from every practice screen, always.
**Prop sketch.** `{ pack: WeeklyConceptPack, mode: 'full' | 'strategy-only' | 'empty', band: 'A'|'B'|'C', onClose }` — content ← `pack.guidedExamples[]` (full mode), strategy steps in Ms. Wren's words ← `pack.explanation.summary`/script distillation, vocabulary ← `pack.explanation.vocabulary[]`.
**States.** `empty` (pre-lesson: handle visible, panel says the lesson fills it); `full` (all practice screens); `strategy-only` (**`WeeklyCheck`/`FreshProblems` only** — worked examples hidden with the honest framing, never silently); open/closed (slide-in over the current screen; the item stays visible beneath — the anchor never navigates away); band styling: pictorial at A, scaffold diagrams at B, symbolic summaries at C (E60).
**Interaction law.** Opens in exactly one tap from every practice/check screen; never shows or solves the current live item (that's a leak, not an anchor); never disabled during practice.
**Hooks.** P7, E99/E116, E63, E60.

### `HintLadder` (P8)
**Purpose.** Enforce help-as-a-ladder: three rungs before any answer, one rung at a time.
**Prop sketch.** `{ item: Item, rung: 0–3, onRequestRung, onAttempt }` — rung text ← `item.hintLadder[]` (rung 1 orienting question, rung 2 locate the step/model, rung 3 similar worked example — never the literal answer, QG-5).
**States.** closed (help affordance visible on every child item); rung 1 / 2 / 3 open (rungs revealed strictly in order, each requiring a fresh request); post-rung-3-attempt (only now may the answer appear, always with full reasoning); miss-triggered (auto-opens at rung 1 within the Acknowledge→Locate→Guide→Re-attempt formula, DD13 — a bare ✗ never renders).
**Interaction law.** Shortest stuck-to-answer path is ≥3 interactions (P8 violation test); rung requests are unlimited-replay but never skippable forward.
**Hooks.** P8, DD13, DD7, E52/E88.

### `WrenBubble`
**Purpose.** Ms. Wren's presence on any screen: one conversational turn at a time, band-voiced.
**Prop sketch.** `{ band, text, audio?: boolean, emotion?: 'warm'|'curious'|'settled', onReplay }` — text ← authored scripts / LLM persona (offline: pack scripts fallback, never a dead end); paired `AudioButton` always.
**States.** speaking (turn lengths per band: 1–3 sentences A, 2–4 B, 3–6 C — never a wall of text); idle/ambient; question-waiting (one question at a time); band decoration law: mascot-adjacent warmth at A, light at B, none at C (no emoji at C unless the child used one, TEACHER-PERSONA C3).
**Interaction law.** Never blocks input to the current task; never two competing bubbles (P2); praise text always names a specific move (P4 violation test: a string reusable for different work without editing is invalid).
**Hooks.** P4, P10, P2, TEACHER-PERSONA §3.

### `ScratchPad` (P3)
**Purpose.** A place for intermediate thinking on every computation screen — the manual-work spirit, honestly adapted.
**Prop sketch.** `{ tools: ['draw','erase','clear'], persistPerItem: true, band }` — free-draw canvas (stylus/touch/mouse; supported where present, never required); per-item persistence so work survives navigation; oversized at A.
**States.** collapsed (persistent affordance on computation screens — a computation screen with no scratch access is a P3 violation); open (shares the screen with the item, never replaces it); content-saved indicator (quiet); cleared.
**Interaction law.** Never auto-solves or renders answers; contents are the child's own and never graded; never claimed as handwriting practice in any copy (P3 honesty rule).
**Hooks.** P3, P2, E76/E78 (spirit, adapted).

### `AudioButton` (P10)
**Purpose.** Replayable TTS on every child instruction at every band — the accessibility floor.
**Prop sketch.** `{ text, autoplay?: boolean, speed?: 'normal'|'slow', size: bandScaled }` — voice ← `ttsService`; A band: autoplay on item entry (audio-carried instruction — a 4-year-old never needs a reader); B+: tap-to-hear alongside always-present text.
**States.** idle; playing (visible speaking state, captioned); replay (unlimited — audio that cannot be replayed is a P10 violation); slow-speed variant; muted-device fallback (text always exists at B+, pictorial+retry prompt at A).
**Interaction law.** Every instruction exists in both audio and text form at bands B+ (either alone is a violation); target ≥48px at all bands, larger at A.
**Hooks.** P10, A3 (audio-first law), accessibility floor.

---

## G. Routing map

Edges are the only legal transitions; the DD1 machine governs all mastery edges (no state outside it).

```
[Module card] → PlacementWelcome → PlacementActivity → StartingPoint → JourneyMap → ThisWeekHub

ThisWeekHub → LessonRoom → GuidedPractice → ThisWeekHub          (Day 1 first entry)
ThisWeekHub → WarmUp → PracticePage (×pages) → DayDone → ThisWeekHub   (Days 1–4)
PracticePage ⇄ SprintGate → SprintRun → SprintFinish → PracticePage    (Days 2–3, ≤2/wk, B+, opt-in)
ThisWeekHub → WarmUp → PuzzleGrove → WeeklyCheck                        (Day 5)
WeeklyCheck → [≥85%] WeekResolve → JourneyMap → ThisWeekHub (next week)
WeeklyCheck → [<85%] StrengthenPlan → ThisWeekHub …(next day)… MicroReteach → FreshProblems
FreshProblems → [≥95%] WeekResolve(fast-track) | [≥85%] WeekResolve
FreshProblems → [<85%, cycle 1] MicroReteach (new angle) → FreshProblems
FreshProblems → [<85%, cycle 2] StrengthenPlan(escalation) → live-teacher card + PlacementActivity(re-check)
ThisWeekHub ⇄ TreasureChest · ThisWeekHub ⇄ JourneyMap · ThisWeekHub ⇄ LessonRoom(replay)
AnchorPanel / HintLadder / ScratchPad / AudioButton / WrenBubble: overlays, never route targets.

[Parent tab] ParentWelcome → (child placement) → PlacementStory → ParentHome
ParentHome → WeeklyReport → (acknowledge) → ReportHistory | CoachCorner
ParentHome → TrendsView ⇄ MasteryMap (tabs) · ParentHome → PatternsView → CoachCorner
ParentHome → CoachCorner · ParentHome → ParentControls → SchoolSync
WeeklyReport field 3 → PatternsView · field 4 → CoachCorner
```

---

## H. Copy-tone appendix — canonical microcopy (Ms. Wren's voice)

Strings are canonical: implementers may localize but not re-tone. Band column follows TEACHER-PERSONA §3 (A ≤10 words/sentence; B ≤15; C natural, collegial). All strings pass P4 (name the move, never speed/"smart") and P6 (no fail-words).

| # | Moment | A band (4–6) | B band (6–9) | C band (9–12) |
|---|--------|--------------|--------------|----------------|
| 1 | Day complete | "Done for today! Your tile is glowing." | "That's the whole dose. Tomorrow's tile unlocks in the morning!" | "Done — on time, like always. Tomorrow's set unlocks in the morning." |
| 2 | Strategy praise (generic slot — always filled with the specific move) | "You matched every duck to a dot!" | "You checked with an estimate first — that's how mathematicians catch sneaky answers." | "You noticed your answer was bigger than 1 and stopped to ask why — that instinct is the whole game." |
| 3 | Near-miss (StrengthenPlan) | "One more round to make it stick — like gluing!" | "So close — just the renaming step is wobbly. Tomorrow we glue it down with brand-new problems." | "One step is still fighting you: renaming. Short revisit tomorrow, then fresh problems — everything else keeps moving." |
| 4 | Sprint intro (three facts) | — (no sprints at A) | "Two calm minutes. Just you versus last time. This never, ever gets a grade." | "Two minutes, you versus your last count, never graded. Musicians and athletes train exactly this way." |
| 5 | Sprint end | — | "The timer sang — we simply stop and see." | "Time. Pencils down, no drama — let's see the count." |
| 6 | Sprint declined | — | "Not today — that's completely fine. Back to the good stuff." | "Noted. The offer comes back another day; nothing changes." |
| 7 | Week passed (WeekResolve) | "This one goes on your shelf!" | "Two-digit subtraction is *yours* now. Up on the shelf it goes." | "That concept is yours — shelved. It'll sneak into warm-ups; you'll squash it every time." |
| 8 | Welcome back after absence | "Welcome back! We were right here." | "Welcome back! Your trail waited for you — no hurry, we pick up right here." | "Good to see you. Everything's where you left it — your trail doesn't expire." |
| 9 | Item parked (TreasureChest) | "This one goes in our treasure chest for tomorrow!" | "Into the treasure chest — we'll catch this sneaky one tomorrow." | "Parking this one in the log. Professionals keep a list of bugs they've beaten." |
| 10 | Lesson pin (AnchorPanel fill) | "Our examples live right here all week!" | "These examples stay pinned right here all week — come peek any time." | "The worked examples are pinned for the week. Stuck later? Start there, not with a guess." |
| 11 | Check framing (WeeklyCheck open) | "Last page of the week! You know these." | "The show-what-you-know page. I'll hold my comments till the end so you can show me your own thinking." | "Last page of the week. I hold comments till the end — and the anchor shows only the strategy card, so it's really you." |
| 12 | Offline tally | "I'll count these when the internet comes back!" | "I'll tally this when we're back online — your answers are safe with me." | "Answers saved locally; I'll score the check when we reconnect. Nothing is lost." |
| 13 | Idle timeout soft close | "We'll finish tomorrow. It will wait for you." | "Let's stop here — the rest will wait for you tomorrow." | "Good stopping point. The remainder holds until tomorrow — consistency beats bingeing." |
| 14 | Warm-up open | "Warm-up time! Quick and easy." | "Warm-ups first — quick ones to wake your math up." | "Warm-ups first. Old friends — you'll recognize them." |
| 15 | Fast-track pass | "One more look and you got it ALL!" | "One reteach and you didn't just fix it — you *owned* it." | "One reteach, near-perfect Form B. Your brain was one small idea away the whole time." |

**Parent-surface canonical strings** (register per TEACHER-PERSONA §6.2): verdict labels "Passed" / "One more round" (never "Review"/"Failed"); acknowledge microcopy "Seen it — {child} will know their week counted"; consistency line "{n} practice days this week" (never "missed {n} days"); gate explainer "we call it mastered at 85%+ — stricter than school, on purpose."

---

*End of screen specs. 20 child screens + 11 parent screens + 5 shared components specced; all names verbatim from `CHILD-FLOWS.md` §0 and `PARENT-FLOWS.md` §0. Companion Phase-5B artifact: `CLAUDE-DESIGN-PROMPT.md`.*
