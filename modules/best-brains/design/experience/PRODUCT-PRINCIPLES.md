# PRODUCT PRINCIPLES — Best Brains-Inspired Math Module (Mind Foundry)

**Phase 5A deliverable · UI/UX Designer · 2026-07-19**
**Governed by:** `METHODOLOGY-MODEL.md` (the pedagogy constitution). Cites `EVIDENCE-LEDGER-FINAL.md` (E-rows) and `DESIGN-DEFAULTS.md` (DD-rows); everything not cited is `[original design]`.
**Legal posture:** These principles describe an original Mind Foundry product. No Best Brains logo, colors-as-trade-dress, layouts, or branded page names are imitated. Where Best Brains is described, a ledger row is cited; where we design, we cite DDs or tag `[original design]`.
**Scope:** This is the module's design constitution. `CHILD-FLOWS.md`, `PARENT-FLOWS.md`, and all Part-B screen specs must comply. Any conflict resolves in favor of `METHODOLOGY-MODEL.md`, then this document.

**The one-line identity:** a calm, structured, confidence-building weekly math ritual — worksheet-inspired, teacher-led, never a game. The emotional bar is set by the evidence: children in the inspiration program genuinely "look forward to homework" and parents credit patient, invested teaching (per E108); families choose this model *over* higher-pressure programs (per E110); it fits children who need structure, weekly accountability, and bite-size daily work (per E112). Our product must earn that same feeling with software.

---

## P1 — The Week Is the Product

**Statement.** Everything the child and parent see is organized around one weekly cycle: one concept, five daily doses, one check, one report. The week is the spine; every screen knows what week it is.

**Why.** The week is the atomic operating unit of the model (per E11, E29, E42) and the primary key of the curriculum graph (METHODOLOGY-MODEL §2). Consistency of ritual is the practice doctrine itself — "one page completed consistently" beats bingeing, and "missing weeks breaks momentum" (per E45, E106). The fit profile says this structure is *why* the right families choose the model (per E112).

**Permits.** Monday concept reveal; five day-tiles that unlock one per day (per E46, E79); a weekly resolve moment; week-indexed history everywhere; "repeat-day" shifting (Day labels, not weekday names, per DD3).

**Forbids.** Endless practice feeds; unlocking tomorrow's tile early "as a reward"; any screen or notification that makes sense only outside the weekly rhythm; content browsing outside the current week (mastered-shelf review excepted).

**Violated when…** a child can do more than today's dose by tapping around; or a screen cannot answer "which week and day am I in?"; or finishing early yields extra content (protecting the E45 doctrine, per METHODOLOGY-MODEL Step 6).

---

## P2 — One Thing at a Time on Screen

**Statement.** Screens are low-density and single-focus: one instruction, one task, one primary action. Practice pages carry 3–6 problems, presented one problem in focus at a time on child screens.

**Why.** The evidenced worksheet anatomy is the model's calm made visible: 1–3 framed sections per page, dedicated answer boxes, ~3–6 problems per page, large fonts, generous whitespace (per E55, E62, E64); one operation per page in the early years (per E62); decoration falls away with age (per E60). Low density is not a style choice — it is the anti-drill, anti-overwhelm position (per E67) rendered in layout.

**Permits.** A visible "page" metaphor (page x of y within a day); framed answer areas sized for children (48–80px touch targets, per existing infrastructure conventions); a single secondary affordance (the Anchor Panel, P7); whitespace as a first-class element.

**Forbids.** Scrolling walls of problems; two competing calls to action; sidebars, tickers, or notification badges on child screens; decorative elements that compete with the math for attention.

**Violated when…** a child screen requires scrolling to understand the current task; or a screenshot of any practice screen shows more than one unanswered problem in focus; or a Level E screen carries Level A decoration (per E60's progression).

---

## P3 — Manual Work Spirit, Honestly Adapted `[original design adaptation]`

**Statement.** The child works with their hands: building, dragging, drawing, tapping, writing numbers on a pad — never passively watching, never keyboard-first. We adapt the handwriting-first spirit to the browser honestly, and we never claim handwriting parity.

**Why.** The inspiration model's resolution of its own screen-policy tension is handwriting-first — stylus on a digital replica of the paper booklet, no keyboard entry by design (per E76, E78, E82). Our platform is a browser PWA on mixed devices (per the infrastructure survey), so a stylus mandate would be dishonest. What we preserve is the *pedagogical function* of manual work: the child produces the answer through action, and intermediate thinking has a place to live.

**Permits.** Manipulate-first input hierarchy: drag/build/tap-to-construct interactions first, NumberPad numeric entry second (existing `NumberPad`/`TapToSelect` components), free-draw scratch canvas where the device supports it, typed text only where the band demands written explanation (Levels D–E, per E59/E60). A persistent optional `ScratchPad` on computation screens. Stylus/touch drawing supported where present, never required.

**Forbids.** Keyboard text fields as the default answer input; multiple-choice-only weeks (recognition is not production); auto-solving animations that do the work while the child watches; describing our input as equivalent to handwriting practice (honesty rule).

**Violated when…** a full week passes where every answer was a tap on a pre-made option; or handwriting/fine-motor benefit is claimed in any parent-facing copy; or a computation screen offers no scratch space.

---

## P4 — Praise the Move, Never the Clock

**Statement.** All praise — spoken by Ms. Wren, written in reports, implied by UI states — names a specific mathematical move, strategy, or self-check. Speed and "smart" are never praised.

**Why.** The evidenced philosophy: "grading should reflect comprehension, not speed" (per E54); praise is task/process-level, never person-level (per DD7); Ms. Wren's highest praise is naming the move a child made on purpose (TEACHER-PERSONA §1, laws 4–5). The teacher-care pattern parents actually praise is patience and investment, not pace (per E108).

**Permits.** Strategy-named praise ("you estimated first"); effort-framed progress views; Ms. Wren redirecting speed pride to accuracy/strategy (per TEACHER-PERSONA rule B5).

**Forbids.** Timers on graded work; per-item response-time display to the child; "Fast!"/"Quick!" copy anywhere; "you're so smart"; leaderboards or any child-to-child comparison (per DD6 rule 5's no-comparison law, extended module-wide `[original design]`).

**Violated when…** any UI element gets more prominent, louder, or shinier because the child answered *faster*; or a praise string could be reused for a different child's different work without editing (it named nothing specific).

---

## P5 — Calm Is the Aesthetic; the Exception List Is Closed

**Statement.** The module is zero-gamification: no points, coins, XP, badges, levels-as-score, leaderboards, loot, or streak-guilt. A closed, narrow exception list of quiet progress-of-real-work signals is permitted — and nothing else.

**Why.** The authentic experience is calm: the inspiration ecosystem shows zero gamification anywhere — it is a paper-workflow digitizer, not a points machine (per E84) — and families choose it *because* it is lower-pressure than alternatives (per E110, E112). Yet the evidence also shows the model is not joyless: centers mix printed work with manipulatives and tabletop-game *elements* (per E116), puzzle pages are branded and playful (per E58), and children genuinely enjoy it (per E108). So: play lives *inside the mathematics*, not layered on top as an economy. The existing Kumon module's celebration system (`CelebrationContext`, achievements) is **not reused here** (survey notes it must be used "sparingly if at all"; we resolve that to: not at all).

**The closed exception list** `[original design]`:
1. Day-tiles filling in across the week (completion state, per E46/E79's completion bars).
2. The Journey Map advancing and the Mastered Shelf growing (per METHODOLOGY-MODEL Step 10's map/shelf).
3. One quiet completion moment per day and one slightly warmer one per passed week (a settled "done" state — never confetti, never fanfare audio).
4. A gentle practiced-days indicator with **no loss state** (per METHODOLOGY-MODEL Step 6's "gentle streak indicator"; a missed day simply shifts, per DD3 — it never "breaks" anything on screen).
5. Game-like *task mechanics inside a math item* (puzzle formats, matching, building — per E116's nuance and E58's puzzle-page precedent) — the play IS the math.

**Forbids.** Everything not on the list. Specifically: points/currency; badges/trophies; confetti or celebration animations; variable/random rewards; streak-loss messaging; countdown scarcity; sound-effect fanfares; the existing achievements/celebrations infrastructure.

**Violated when…** an element rewards anything other than completed mathematical work; or removing an element would change "engagement" but not learning; or a child could want to finish *to get the thing* rather than to be done.

---

## P6 — "Passed" or "One More Round" — Never Fail

**Statement.** The weekly verdict is two-valued and warm. Parents see Passed / Review with the % (once). Children never see the word "Review," never see a %, never see red-X iconography — they see "one more round to make it stick," a targeted reteach, and brand-new problems.

**Why.** The verdict surface (week code + Passed/Review + % + comment) is the evidenced parent-facing shape (per E80, E13); the corrective loop is DD1's law (micro-reteach → parallel Form B, never identical items → re-score; escalation with responsibility placed on the program, never the child). Child-facing language rules come from TEACHER-PERSONA §5: "Review" never appears in child speech; the % is stated at most once and only to the parent `[original design]`.

**Permits.** Parent report header verdict + % (per E80 shape, our own visual design); child-facing "Strengthen" path framed as continuation ("you're not stuck, you're strengthening"); other strands visibly continuing on every non-pass outcome (per DD1).

**Forbids.** Child-facing percentages, letter grades, red/green verdict color-coding for children; the words "fail," "wrong," "review" in child copy; re-serving identical check items (per DD1's Form-B law); any full-screen sad state.

**Violated when…** a child can tell you their score; or a non-pass week's screen looks visually "worse" (darker, redder, sadder) than a pass week's; or the same problems reappear on the re-check.

---

## P7 — The Anchor Is Always One Tap Away

**Statement.** This week's worked examples and strategy card are pinned to a persistent Anchor Panel, reachable from every practice screen in one tap — the digital wall poster.

**Why.** Centers hang wall posters summarizing stepwise problem-solving processes (per E116 — the anchor-chart pattern is authentic); the packet front carries the worked examples from class all week (per E99, DD3), which is what makes home practice self-serviceable. The evidenced failure mode we repair is the child who gets a bare answer instead of a path (per E52, E88).

**Permits.** A slide-in `AnchorPanel` on all practice/check screens showing: the week's pinned worked examples (per E99), the strategy steps in Ms. Wren's words, and the week's glossed vocabulary (per E63's vocabulary-as-content). Band-styled: pictorial at A, scaffold diagrams at B–C, symbolic summaries at D–E (per E60).

**Forbids.** The anchor ever solving or revealing the *current live item* (it teaches the method, never the answer); the anchor being disabled during practice; hiding the anchor behind more than one tap.

**Violated when…** a stuck child's only options are guessing or the hint ladder — with no way back to the worked example; or the anchor content shows the answer to an item currently on screen (that's a leak, not an anchor); or during the weekly check the anchor silently disappears without the honest framing specced in `CHILD-FLOWS.md` flow 6.

---

## P8 — A Teacher Teaches First; Help Is a Ladder, Not an Answer

**Statement.** No practice on a new concept before Ms. Wren has taught it. Every request for help climbs the hint ladder one rung at a time; every miss gets an explanation; a bare ✗ never appears.

**Why.** "A teacher actually teaches" is the model's #1 differentiator (per E68, E44); the explanation is never skippable on first encounter (METHODOLOGY-MODEL Step 4). The hint ladder (rung 1 orienting question → rung 2 point at the step → rung 3 similar worked example → only then the answer with reasoning) is Ms. Wren's law 3, engineered against the evidenced "answers without step-by-step" complaint (per E52, E88). Immediate explanation-on-miss is DD13.

**Permits.** Pause/replay/re-explain controls in the lesson (the digital repair of E52, per METHODOLOGY-MODEL Step 4); "watch again" always available after first viewing; the Acknowledge → Locate → Guide → Re-attempt correction formula (TEACHER-PERSONA §4.3).

**Forbids.** A skip button on a first-encounter lesson; hint rung 3 jumping to the current item's answer; correct/incorrect marks with no path forward; auto-advancing past a miss.

**Violated when…** a child reaches an item Ms. Wren never taught; or the shortest path from "stuck" to "answer shown" is fewer than three interactions; or telemetry shows a miss with no explanation view following it.

---

## P9 — The Parent Signs; the Parent Never Grades

**Statement.** The parent's role is the weekly ritual: read the four-field report, use the coaching lines, acknowledge with a tap. The module never assigns the parent checking, grading, or teaching duty — and never surveils the child to the parent in real time.

**Why.** The parent reads AND signs weekly and explicitly does not grade (per E15, E71, E102); the weekly signed ritual is the model's one confirmed delighter (per DD6/DD15). The report frame is the confirmed Progress Book field structure — what was covered / needs reinforcement / improving / focus at home (per E102) — delivered per-class by teachers in the evidenced operation (per E115). Our acknowledge-tap is the digital signature analog `[original design]` (per E48 — no Progress Book page was ever publicly shown, so its look is ours).

**Permits.** Weekly report in the E102 four-field frame with DD6/DD7 rubric; a read-only daily completion glance (per E81's read-only parent surface); acknowledgment history; exactly one growth area + one next step per week (per DD6).

**Forbids.** Asking parents to verify answers; real-time "your child got one wrong!" notifications; deficit lists; daily nag pushes; comparative framing (percentiles, class averages, siblings — per TEACHER-PERSONA §6.2 rule 5).

**Violated when…** a parent-facing surface implies action needed on a specific math problem; or the parent hears about a mistake before the child has finished the week's own corrective rhythm; or a week's report contains two next steps.

---

## P10 — Every Age Gets Its Own Interface

**Statement.** Three interaction bands, enforced: 4–6 tap-first with audio-carried instruction; 6–9 light reading with dual audio+text and guided numeric entry; 9–12 symbolic entry and written explanation. Band styling, input, and voice change together.

**Why.** The marketed bands (3–5 / 6–9 / 10+, per E24) and the evidenced visual→symbolic progression (mascots/coloring → scaffolds/puzzle badges → symbolic work/written explanation, decoration dropping with age — per E60, E57–E59) are presentation law (METHODOLOGY-MODEL §6, CURRICULUM-MAP §0.3). Level A is audio-first with no reading required (CURRICULUM-MAP Level A). Accessibility floor `[original design]`: touch targets 48–80px (existing infra convention), TTS on all child instructions at every band, captions on all audio, no color-only meaning, reduced-motion respected, dyslexia-considerate type at B+.

**Permits.** Band-specific components (oversized draw/tap boxes at A per E62/E65; place-value scaffolds at B–C per E53/E58; explanation lines at D–E per E59); Ms. Wren's band voice rules (TEACHER-PERSONA §3) mirrored by UI copy length and register.

**Forbids.** Reading-gated tasks at Level A; babyish decoration or emoji at Levels D–E (per TEACHER-PERSONA C1/C3); one-size-fits-all screens; audio that cannot be replayed.

**Violated when…** a 4-year-old needs a reader to proceed; or an 11-year-old's screen has a mascot sticker on it; or an instruction exists in audio with no text equivalent (or vice versa at bands 6+).

---

## P11 — The Timer Is a Metronome, Not a Judge

**Statement.** Timed work exists only as 2-minute, ungraded, self-referenced fluency sprints on material mastered ≥2 weeks prior, Level B and up, ≤2 per week — framed calmly, endable early, opt-outable by the parent, and never on the current week's concept.

**Why.** DD11 verbatim, aligned with the evidenced official philosophy: timed tests are ungraded, "grading should reflect comprehension, not speed" (per E54). Level A has no timed anything (CURRICULUM-MAP Level A notes). Ms. Wren's sprint frame is fixed: two minutes, you-versus-your-last-time, never graded — stated before every start (TEACHER-PERSONA B6).

**Permits.** A soft visual time indicator (filling arc, no ticking sound, no red endgame `[original design]`); "beat your own last time" self-reference; a calm ending exactly at time ("the timer sings, we simply stop and see," per TEACHER-PERSONA §1); a parent opt-out toggle (per DD11 posture; surfaced in `PARENT-FLOWS.md` flow 8).

**Forbids.** Countdown anxiety cues (ticking, pulsing red, klaxons); scores or grades attached to sprints; sprint results in the weekly verdict; sprints on unmastered or current-week material; ranking sprint results against anyone else.

**Violated when…** a child's accuracy on graded work is influenced by a visible timer (graded work is never timed); or a sprint result appears anywhere in mastery computation; or a child shows sprint-avoidance and the UI pushes instead of quietly reducing (per the frustration-flag pattern, TEACHER-PERSONA guardrails).

---

## P12 — Collect Nothing You Wouldn't Show the Parent

**Statement.** Child-data minimalism: the module stores only what pedagogy consumes (answers, DD7 error tags, hint depth, completion, gate outcomes) plus the account data the platform already holds. Every stored signal is visible in some parent surface. No dark patterns anywhere, for anyone.

**Why.** The bar to beat is low — the inspiration ecosystem's own declaration includes "not encrypted / cannot be deleted" (per E117); we exceed it by design (RLS, deletability — per the infrastructure survey). The persona guardrails already forbid soliciting personal information from children (TEACHER-PERSONA §2). Dark-pattern prohibition is a module hard rule extended to parents `[original design]`: no guilt-copy, no cancellation traps, no artificial urgency, no pre-checked boxes.

**Permits.** Pedagogical telemetry flowing to the learner profile (per DD7/DD6); parent-visible history (per E85's continuity answer); labeled self-report surveys (per DD14).

**Forbids.** Free-text child inputs harvested for anything beyond the math task; third-party trackers or ads on child surfaces; retention of data with no consuming feature; "your child is falling behind — upgrade now" style copy; countdown offers.

**Violated when…** a stored field has no screen that shows it and no scheduler that consumes it; or any copy uses fear of a child's failure as a conversion lever; or deleting a child profile leaves recoverable practice data.

---

## Principle index (for citation in Part B)

| # | Name | Anchor evidence |
|---|------|-----------------|
| P1 | The Week Is the Product | E11, E29, E42, E45, E46, E79, E112 |
| P2 | One Thing at a Time on Screen | E55, E60, E62, E64, E67 |
| P3 | Manual Work Spirit, Honestly Adapted | E76, E78, E82 `[original adaptation]` |
| P4 | Praise the Move, Never the Clock | E54, E108, DD7, DD11 |
| P5 | Calm Is the Aesthetic; Closed Exception List | E84, E110, E112, E116, E58, E108 |
| P6 | "Passed" or "One More Round" — Never Fail | E80, DD1, TEACHER-PERSONA §5 |
| P7 | The Anchor Is Always One Tap Away | E116, E99, E52/E88, E63 |
| P8 | A Teacher Teaches First; Help Is a Ladder | E68, E44, E52/E88, DD13 |
| P9 | The Parent Signs; the Parent Never Grades | E102, E15, E71, E115, DD6 |
| P10 | Every Age Gets Its Own Interface | E24, E60, E57–E59, E62 |
| P11 | The Timer Is a Metronome, Not a Judge | E54, DD11 |
| P12 | Collect Nothing You Wouldn't Show the Parent | E117, DD14 `[original design]` |

*End of product principles. `CHILD-FLOWS.md` and `PARENT-FLOWS.md` implement these; Part B (SCREEN-SPECS, CLAUDE-DESIGN-PROMPT) must cite principle numbers when making layout and component decisions.*
