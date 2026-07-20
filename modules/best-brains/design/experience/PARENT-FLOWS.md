# PARENT FLOWS — Best Brains-Inspired Math Module (Mind Foundry)

**Phase 5A deliverable · UI/UX Designer · 2026-07-19**
**Governed by:** `METHODOLOGY-MODEL.md` (Steps 2 & 8) and `PRODUCT-PRINCIPLES.md` (esp. P9 parent-ritual fidelity, P12 data minimalism). Cites E-rows / DDs; everything uncited is `[original design]`.
**Surface law:** the parent surface is read-mostly, weekly-cadenced, phone-first (per E81's evidenced shape and DD15's device posture). The parent is a witness and cheerleader, never a grader (per E15, E71). Report voice is Ms. Wren's, generated per TEACHER-PERSONA §6 from `parentSummarySeed` + weekly telemetry.

---

## 0. Canonical parent screen names (established here; specced in Part B)

| Screen | Role |
|---|---|
| `ParentWelcome` | Module introduction: what this is, the weekly rhythm, expectation setting |
| `PlacementStory` | Placement explained + results conversation (level, strengths, first-month plan) |
| `ParentHome` | The module's parent tab: this-week glance + report state + entry to all views |
| `WeeklyReport` | The Ms. Wren four-field weekly report + acknowledge interaction |
| `ReportHistory` | Browsable acknowledged-report archive = the persistent learner profile |
| `TrendsView` | Accuracy/untimed-pace trends across weeks |
| `MasteryMap` | Parent view of the level's 24 concepts and their gate states |
| `PatternsView` | Mistake-pattern view in parent language (DD7 tags translated) |
| `CoachCorner` | "What to say tonight" — the current week's two coaching lines, standalone |
| `SchoolSync` | Optional school-syllabus input |
| `ParentControls` | Module settings: sprint opt-out, audio, session length, data |

**Global parent-surface rules** `[original design unless cited]`:
- Weekly cadence is the heartbeat: exactly one report notification per child per week (per E11's rhythm); daily surfaces are pull-only, never push (P9 anti-surveillance).
- The child is never shown parent surfaces; verdict + % language exists **only** here (per E80 shape; P6's two-audience split).
- No comparative framing anywhere: no percentiles, class averages, or "children this age usually…" (TEACHER-PERSONA §6.2 rule 5).
- Every screen readable on a phone in under a minute (per DD15; report length law 90–150 words per TEACHER-PERSONA §6.2 rule 8).
- No dark patterns: no guilt copy, no fear-of-falling-behind conversion levers, no pre-checked options (P12).

---

## Flow 1 — Onboarding: what is this, placement, expectations

**Implements:** the E20 funnel's trust-building hinge (placement → plan conversation) and the evidenced pattern of educating parents up front — the inspiration model runs a 10-part video series during the diagnostic visit (per E114). We keep the *educate-first* pattern but compress it: brief cards, not ten videos `[original design adaptation]`.

**Entry point:** parent adds the module (module card on the platform's picker) or taps "learn more" before the child's first placement.

**Steps:**
1. `ParentWelcome` — three swipeable cards, ~20 seconds each `[original design; educate-up-front pattern per E114]`:
   - **Card 1 — The rhythm:** one new concept a week, taught by a teacher persona, practiced 5–15 minutes a day, checked at week's end, reported to you every week (per E11, E12, E42). "The week is the unit. Consistency beats bingeing" (per E45, E106).
   - **Card 2 — What you do:** "Read one short report a week. Say one praise line. Ask one question. You never grade anything" (per E15, E71, E102). Sets the acknowledge-tap ritual expectation.
   - **Card 3 — What this is not:** not drill, not speed, not a game — timed sprints are ungraded and optional (per E54/DD11); no points or streak pressure (per E84/P5); mastery gates advancement, so some weeks take "one more round" and that is the system working (per DD1).
2. Expectation-setting detail (expandable, not forced): the Passed/Review verdict explained in advance — including that the child will never see "Review" or a % and why (P6) — so the first non-pass week is pre-framed, not a surprise `[original design]`.
3. CTA: "Find {child}'s starting point" → child placement (CHILD-FLOWS flow 1), with a one-line preview: "~25 minutes, feels like exploring, never like a test" (per DD5).
4. After placement completes → `PlacementStory` — the digital analog of the evidenced director-meeting-over-results (per E20): the placed level (neutral letter + the internal level↔grade context sentence for the parent only, per DD2), 2–3 evidenced strengths by name, 2–3 first-month targets, the first-month calendar, and the plan's standing promise: re-checkable placement (per DD1/DD5). Ends by scheduling the weekly report day.

**Decision branches:**
- **Placement lands below the school-grade-implied level:** `PlacementStory` uses destigmatizing framing (per DD2's principle): "we start where instruction lands, not where frustration lives" — level letter shown, "behind" never said; the mastery ladder explained as the fix, and the compressible pacing noted (per E33-analog acceleration, METHODOLOGY-MODEL Step 10).
- **Placement lands above grade:** enrichment framing; school-complement positioning stated (per E3 — complements school, never competes).
- **Parent skips onboarding cards:** allowed (never force-read); cards remain in `ParentHome`'s help sheet.

**Emotional design notes:** the tone target is the evidenced praise pattern — patient, invested, structured (per E108) — and the anti-pressure position families switch *for* (per E110, E112). Onboarding must feel like meeting a calm teacher, not activating software. Honesty beats promises: no outcome claims; if efficacy is ever referenced, only our own instrumented data per DD14 (never the inspiration company's self-survey, per E19).

**Failure / edge cases:** parent abandons before placement → module card shows "ready when you are" state, one gentle reminder max `[original design]`; multiple children → onboarding runs once, `PlacementStory` per child; parent re-reads later → all cards and the placement story persist in `ReportHistory`'s profile header.

---

## Flow 2 — The Weekly Report ritual (read + acknowledge)

**Implements:** loop Step 8 — the model's confirmed delighter (per DD6/DD15): weekly narrative in the E102 four-field Progress-Book frame, read-and-acknowledge as the digital signing analog (per E102/E15/E48 — the physical book's look was never public, so this rendering is `[original design]`). Mirrors the evidenced per-class report-writing cadence (per E115).

**Entry point:** the module's single weekly notification ("Ms. Wren's note about {child} is ready") after the week resolves; or `ParentHome`'s report card-state.

**Steps:**
1. `WeeklyReport` — the TEACHER-PERSONA §6.1 artifact, verbatim structure:
   - **Header:** level letter + week code, concept name, **Passed / One more round** + % (the E80 verdict shape; % appears once, per §6.2 rule 7; "Review" is rendered as "One more round" even here, keeping one vocabulary across household conversations `[original design — divergence from E80's literal "Review" label, flagged]`).
   - **What we worked on** (E102 field 1) — concept in parent-plain words + the one engagement sentence.
   - **Where {child} is improving** (E102 field 3, warmth-ordered before the growth area per §6.1's ordering note) — skill + this week's concrete evidence.
   - **What we're strengthening** (E102 field 2) — ONE skill, task-level, with the program's own plan attached (per DD7/DD6).
   - **What to focus on at home** (E102 field 4) — two speakable lines: one praise sentence + one teach-it-back question (see Flow 6); monthly-at-most school-sync hook (per E103).
   - **Footer:** **Acknowledge tap** + link to full history.
2. The acknowledge tap — the signature analog (per E15/E102): one tap, timestamped, visible in history. Micro-copy: "Seen it — {child} will know their week counted" (per METHODOLOGY-MODEL Step 8's child-experience note: someone signed it). No penalty for late acknowledgment; unacknowledged reports simply stack quietly on `ParentHome`.
3. Post-acknowledge: optional one-tap reactions ("read it aloud to {child}" TTS, jump to `CoachCorner`) `[original design]`.

**Decision branches:**
- **Pass week:** report per TEACHER-PERSONA §6.3 example register.
- **Corrective ("one more round") week:** same calm register (per §6.2 rule 7): the loop described as the plan working, fresh problems promised, "not stuck" stated (per DD1); no red styling, verdict color-coding avoided entirely `[original design — softening E80's evidenced red/green for our build; P6 spirit extended to parents]`.
- **Escalation week (two failed cycles):** the report carries Ms. Wren's program-owns-it framing (TEACHER-PERSONA §5) plus the concrete next step: live teacher session scheduling + placement re-check explanation — presented as calibration, never crisis.
- **Verdict pending (offline child / unfinished week):** report holds in "still finishing up" state; the weekly notification waits — rhythm bends, never breaks (per DD2 cycle law).

**Emotional design notes:** this is the product's trust engine — the artifact through which teacher quality is *experienced* (per the E21-nuance note in P3.2: parents feel the teacher through the weekly ritual artifacts). Every report must pass the §6.2 testable rules (one growth area, ≤1 behavior sentence, no jargon without gloss, 90–150 words, speakable home lines). The parent should finish feeling *equipped*, not evaluated.

**Failure / edge cases:** report generation failure → last-resort template from `parentSummarySeed` alone (packs carry the seed, per QUESTION-GENERATOR-SPEC #11) — never a missed week; multi-child → one notification per child, never digested into a comparison view (rule: no cross-child screens at all `[original design]`); acknowledgment offline → queued.

---

## Flow 3 — Daily completion glance

**Implements:** the read-only parent surface (per E81) with per-day completion (per E46/E79's completion-bar precedent) — reframed as rhythm, not surveillance (P9).

**Entry point:** `ParentHome`, pull-only (no daily notifications, ever).

**Steps:**
1. `ParentHome` shows a **week strip** per child: five day-tiles mirroring the child's own hub state (done / partial / today / upcoming), the current concept name, and the report state (ready / acknowledged / in progress).
2. Tapping a done tile shows *only*: done state, approximate minutes, and one strategy note if Ms. Wren logged one ("used estimation to self-check today") — never item-level right/wrong (P9: the parent hears about mistakes through the weekly rhythm, not in real time).
3. A quiet consistency line, effort-framed: "4 practice days this week" — with no loss state and no guilt copy on gaps (P5.4): a missed day shows as simply unfilled, and the copy never says "missed."

**Decision branches:** several idle days (≥4) → the *weekly* report's home-focus line may gently address rhythm (per E45's momentum doctrine, delivered in Ms. Wren's warmth) — the glance itself never nags; child in corrective loop → the strip shows the "strengthening" thread matter-of-factly.

**Emotional design notes:** the glance answers exactly one parental question — "is the rhythm alive?" — because rhythm is the model's real predictor (per E45, E106, E112). Anything more granular would convert the parent into a supervisor, which the model explicitly avoids (per E71).

**Failure / edge cases:** offline child device → tiles show last-synced state with a "as of…" stamp; multiple children → stacked strips, no ranking; brand-new week → strip resets Monday morning with the new concept name.

---

## Flow 4 — Trends: accuracy, pace, and the 24-week mastery map

**Implements:** the parent-side longitudinal view over DD14's instrumented signals; the mastery map is the parent's version of the child's `JourneyMap` (per METHODOLOGY-MODEL Step 2's feed-up principle) with gate states the child never sees.

**Entry point:** `ParentHome` → "Progress" → `TrendsView` / `MasteryMap` (two tabs, one mental model).

**Steps:**
1. `MasteryMap` — the level's 24 concept weeks (per CURRICULUM-MAP §0.1) as a simple list/grid: each cell = concept name + state: *mastered* (first-pass) / *mastered after strengthening* (corrective loop succeeded — shown as equally mastered, with a small "took the strong road" annotation `[original design]`) / *strengthening now* / *upcoming*. Checkpoint (wk 12) and level-exit (wk 24) marked; monthly-test outcomes from the separate Test Log surface here per DD9's E32/E97-shaped detail (per-test drill-down with per-page detail).
2. `TrendsView` — at most three graphics, phone-first (per DD15):
   - **Untimed accuracy by week** (weekly-check first-pass %) — the only place a % series exists; framed with the gate line at 85% (per DD1) explained in plain words ("we call it mastered at 85%+ — stricter than school, on purpose"). The DD1 strictness divergence is honestly footnoted as our own standard `[original design; divergence per DD1 stays flagged]`.
   - **Retention curve** — warm-up (retrieval) accuracy on older material (per DD8/DD14): "how well last month's concepts are sticking." This is the module's proudest honest chart `[original design]`.
   - **Fluency, self-referenced** — sprint counts over time, explicitly labeled ungraded and pace-not-speed ("automaticity on already-mastered facts", per DD11/E54). Hidden entirely if sprints are opted out (Flow 8).
3. Every chart carries a one-sentence Ms. Wren interpretation, task-level (per DD7) — data never appears without teacher voice `[original design]`.

**Decision branches:** corrective-heavy stretch → `TrendsView` surfaces the reframe ("strengthening rounds are the gate doing its job — see how week 14 stuck after its second round"); level transition → maps stack (Level B map archived under Level C's).

**Emotional design notes:** trends exist to *prevent* anxiety, not create it: no red zones, no down-arrows iconography, no projections ("on track for…" is banned — no promises, per DD14's honesty posture). Effort and retention are given equal visual weight to accuracy (P4).

**Failure / edge cases:** <3 weeks of data → charts replaced by "still gathering the story — trends appear after a few weeks"; missed weeks → gaps shown plainly, not interpolated; export/print of the mastery map allowed (paper-friendly, in the model's spirit per E76's paper-first sensibility) `[original design]`.

---

## Flow 5 — Mistake-pattern view (parent language)

**Implements:** DD7's error taxonomy translated for parents — the "what needs reinforcement" evidence base (per E102 field 2) made browsable.

**Entry point:** `ParentHome` → `PatternsView`; also linked from the report's "what we're strengthening" line ("see the pattern").

**Steps:**
1. `PatternsView` — the child's recent misses grouped by DD7 primary tag, each translated to parent language with a gloss `[original design translation layer]`:
   - fact-recall → "a math fact that isn't automatic yet" (plan: warm-ups + sprints will resurface it, per §4.2 routing)
   - procedure slip → "knows the idea, skips a step under load" (plan: located-step practice)
   - concept misconception → "a rule that needs rebuilding" (plan: micro-reteach with models, fresh problems)
   - representation misread → "misread the picture/graph, not the math" (plan: read-the-model-first practice)
   - task-comprehension → "answered a different question than asked" (plan: restate-the-task practice)
2. Each group shows: the skill name, 1–2 anonymized example items (the *item*, never a scan of the child's failed work `[original design — no shame artifacts]`), the pattern-vs-one-off flag in plain words ("happened twice this week" vs "a one-time slip"), and **what the program is already doing about it** (per DD6's plan-attached law) — so the parent never converts a pattern into homework-policing (per E71).
3. A standing footer: "You don't need to fix any of this — it's ours. If you want to help, `CoachCorner` has tonight's two lines."

**Decision branches:** no patterns this week → the view says so warmly and shows the most recent resolved pattern ("beaten: the renaming step, two weeks ago"); persistent pattern across 3+ weeks → the view notes the escalation machinery exists (per DD1) and whether it has engaged.

**Emotional design notes:** the tone bar: a parent reading `PatternsView` should feel the program is *diagnosing and treating*, not reporting symptoms for the parent to treat. Language stays task-level always (per DD7: "the regrouping step," never "careless").

**Failure / edge cases:** very few misses (strong week) → celebrate briefly, don't scrape for content; parent taps into an example item → static view, no "quiz your child" affordance (P9).

---

## Flow 6 — "What to say to your child" coaching

**Implements:** E102 field 4 realized as conversation-not-grading (per E71), generated from the pack's `parentSummarySeed` (per QUESTION-GENERATOR-SPEC #11) + the week's telemetry; rules per TEACHER-PERSONA §6.2 (speakable verbatim, no math background needed, never assigns teaching duty).

**Entry point:** `CoachCorner` from `ParentHome`; deep-linked from every `WeeklyReport` field 4.

**Steps:**
1. `CoachCorner` — exactly two cards per week (never a library to browse — one week, two lines, per DD6's one-next-step law):
   - **The praise line** — strategy-specific, quoting this week's real evidence ("I heard you check your answer with an estimate before anyone asked — that's real mathematician behavior," per §6.3 register). Tap-to-hear Ms. Wren say it, so the parent can borrow the delivery `[original design]`.
   - **The teach-it-back question** — one question inviting the child to explain the week's concept ("Can you show me why you sometimes trade a ten for ten ones?"). Framed with the why: "kids consolidate by teaching" (per DD6's feed-forward principle).
2. A fixed three-line etiquette footer, always visible `[original design, distilled from the module's laws]`: praise the move, not speed or smartness (per E54/DD7) · if they're mid-"one more round," say "strengthening," never "redo" (per DD1/P6) · never quiz — ask to be taught.
3. On corrective weeks, the praise line is guaranteed to exist and be genuine (per TEACHER-PERSONA §6.4's example — effort/strategy evidence is always available), so the parent is never armed only with concern.

**Decision branches:** parent taps "used it" (optional, one bit) → nothing gamified, just tunes future line style `[original design]`; multiple children → per-child corners, no shared screen.

**Emotional design notes:** this flow is where the module extends instruction into the home *without* transferring burden (the anti-Kumon position, per E71). Lines must survive being said by a tired parent at 7pm: short, concrete, warm.

**Failure / edge cases:** report pending → last week's lines remain with a "from last week" tag; child placed this week (no evidence yet) → generic-but-honest starter lines from the placement strengths (per `PlacementStory` data).

---

## Flow 7 — Optional school-syllabus sync

**Implements:** E103 — sharing the school's current units is officially encouraged in the inspiration model; our realization: warm-up leaning, never sequence changes `[original design]`.

**Entry point:** `SchoolSync` from `ParentControls` or the at-most-monthly report hook (per TEACHER-PERSONA §6.1 slot 4 / §6.2 rule 10).

**Steps:**
1. `SchoolSync` — one simple input: "What is {child}'s class working on right now?" — free text or topic picker (mapped to the module's strand tags per E25's labels); optional photo of a syllabus/newsletter, processed to topics then discarded (P12: the image is not retained) `[original design]`.
2. Effect, stated honestly on-screen: "We'll lean {child}'s warm-ups toward overlapping skills when they exist" (retrieval-pool weighting per DD8 — backward-only: only already-taught module concepts can be leaned into; the weekly ladder itself never reorders, per METHODOLOGY-MODEL §2's fixed-sequence law). If there is no overlap yet, say so: "Fractions arrive at Week 15 on {child}'s trail — we won't rush the ladder, and here's why" (per DD1 mastery rationale, E3 complement positioning).
3. Entries expire after ~6 weeks with a gentle "still current?" prompt on the next monthly hook (never a push) `[original design]`.

**Decision branches:** topic ahead of child's level → honest response (above); topic behind → "already on the Mastered Shelf — warm-ups will polish it"; never any "your school is wrong" or "we're ahead/behind" framing (per §6.2 rule 10).

**Emotional design notes:** this feature signals partnership with school (per E3/E72's complement stance) — micro-copy must never position the module as competing with or auditing the school.

**Failure / edge cases:** unparseable input → store as note for the report generator only; parent never uses it → zero degradation (strictly optional); privacy: school name is not requested and, if volunteered, not stored (TEACHER-PERSONA guardrail alignment, P12).

---

## Flow 8 — Settings & controls

**Implements:** the parent-owned toggles, each mapped to a module law it may tune *within band* — settings can soften, never break, the constitution `[original design]`.

**Entry point:** `ParentControls` from `ParentHome`.

**Steps / contents:**
1. **Sprints:** on/off per child (opt-out per DD11 posture / P11). Off → `SprintGate` never appears; `TrendsView` fluency panel hides. Copy explains what sprints are (three facts, per TEACHER-PERSONA B6) so the choice is informed, with no steering (P12: no "recommended!" nudge on either option).
2. **Audio:** Ms. Wren voice on/off + volume; instruction TTS stays available at all bands regardless (accessibility floor per P10 — the *decorative* voice is optional, the *access* voice is not); sound effects toggle (module default is already minimal, P5).
3. **Session length:** dose within the evidenced band only — Short (≈5 min) / Standard (≈10) / Full (≈15) per E12's honest 5–15 range; hard-capped at 15 ("more isn't better here — consistency is," per E45/E106; no setting can extend the dose, per Ms. Wren law 6).
4. **Schedule:** which day the week reveals (default Monday), report notification day/time — the module's only notification (per Flow 0 rules).
5. **Accelerated mode:** request compressed pacing (2–4 cycles/week, gates intact, reduced-but-nonzero practice — per METHODOLOGY-MODEL Step 10) — framed for catch-up or get-ahead seasons (per E33's evidenced compression), with the honest note that mastery gates still decide pace.
6. **Data:** view exactly what is stored (the P12 list, in plain words), export the learner profile, delete child practice data (full deletion honored — the E117 bar consciously exceeded).
7. **Escalation contact:** where live-teacher-intervention scheduling appears when DD1 escalation triggers; help requests show visible queue state (per DD15's SLA posture vs E86).

**Decision branches:** every toggle change takes effect next session, not mid-session (never yank a child's session state) `[original design]`; sprint opt-out mid-week → remaining offers vanish silently, child-side framing unchanged.

**Emotional design notes:** settings copy carries the same calm register as everything else; each control states *why the boundary exists* rather than just enforcing it — parents get the pedagogy, not a locked door.

**Failure / edge cases:** conflicting multi-parent households → last-write-wins with a change note in `ParentControls` history; deletion requested → confirm with a plain-language consequence list, then hard-delete (P12 violation test).

---

## Flow-to-ritual coverage check

| Weekly-teacher-feedback rhythm element | Flow |
|---|---|
| Educate-parents-up-front (per E114 pattern) | Flow 1 |
| Placement → plan conversation (per E20) | Flow 1 (`PlacementStory`) |
| Weekly narrative + sign (per E102/E15/E115) | Flow 2 |
| Read-only daily visibility (per E81/E46) | Flow 3 |
| Progress/Test-Log-shaped longitudinal detail (per E80/E32/E97 shapes) | Flow 4 |
| "Needs reinforcement" made legible (per E102/DD7) | Flow 5 |
| Home focus as conversation (per E102 field 4, E71) | Flow 6 |
| School-syllabus sharing (per E103) | Flow 7 |
| Parent-owned boundaries (DD11, E12, DD15) | Flow 8 |

*End of parent flows. Part B screen specs must implement these screens by canonical name; the report artifact structure is owned by TEACHER-PERSONA §6 and may not be re-invented; verdict + % never leak to child surfaces.*
