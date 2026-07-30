# READY-TO-PASTE PROMPT FOR CLAUDE DESIGN

*(Everything below the line is the prompt. It is fully self-contained — the design AI sees nothing else.)*

---

## 1. Context

You are designing the visual layer of a new module inside **Mind Foundry**, a family math-learning web app (React PWA, phone-and-tablet-first, also used on laptops). The module is a **calm, teacher-led, weekly-cycle math enrichment experience for children ages 4–12**, with a separate read-mostly surface for parents. Its rhythm is: **weekly concept → daily short practice (5–15 min) → graded weekly check → warm parent report.** A friendly teacher character, **Ms. Wren**, teaches every concept before any practice, speaks in short warm turns, and narrates all feedback.

This is an original product. **Do not imitate the branding, layouts, mascots, color schemes, or trade dress of any existing math-enrichment, tutoring, or worksheet company.** Design from the principles below only.

Two audiences, strictly separated:
- **Child surfaces:** never show percentages, grades, scores, the word "Review," red X marks, or any fail state. The weekly outcome is either a warm "it's yours now" or "one more round to make it stick."
- **Parent surfaces:** see a two-value verdict ("Passed" / "One more round") plus a percentage shown exactly once per report — with **no red/green verdict color-coding**.

## 2. Product principles (condensed — all binding)

- **P1 The week is the product.** Everything is organized around one weekly cycle: one concept, five daily doses, one check, one report. Every screen must answer "which week and day am I in?" No endless feeds; tomorrow never unlocks early.
- **P2 One thing at a time.** Child screens are low-density and single-focus: one instruction, one task, one primary action. Practice shows one problem in focus at a time; whitespace is a first-class element; no scrolling walls of problems.
- **P3 Manual work spirit.** The child produces answers by doing — tapping, dragging, building, drawing, entering digits on a number pad — never keyboard-first, never passively watching. A scratch canvas is available on every computation screen.
- **P4 Praise the move, never the clock.** All praise names a specific mathematical move or self-check. No timers on graded work, no speed praise, no "smart," no leaderboards, no child-to-child comparison.
- **P5 Calm is the aesthetic; the exception list is closed.** Zero gamification: no points, coins, XP, badges, trophies, confetti, streak-guilt, or fanfare audio. Only these quiet signals are allowed: day-tiles filling across the week; a journey map advancing and a "Mastered Shelf" growing; one quiet daily "done" moment and a slightly warmer weekly one; a gentle practiced-days indicator with **no loss state**; playfulness inside the math task itself (puzzle mechanics).
- **P6 Never fail.** Children never see %, grades, "Review," red X, or a visually "worse" screen after a non-pass. Non-pass = "one more round," rendered exactly as warm as a pass. Re-checks always use brand-new problems.
- **P7 The anchor is one tap away.** This week's worked examples + strategy card + vocabulary live in a slide-in **AnchorPanel**, reachable in one tap from every practice screen. During the weekly check it shows the strategy card only (stated honestly, never removed silently).
- **P8 Teach first; help is a ladder.** No practice before the lesson; first-encounter lessons have **no skip control**. Help climbs a 3-rung hint ladder (orienting question → locate the step → similar worked example) before any answer is shown. A bare wrong-mark never appears; every miss gets a warm explanation.
- **P9 The parent signs, never grades.** Parent surface is read-mostly, weekly-cadenced: one short report, one acknowledge tap, two speakable coaching lines. No real-time mistake alerts, no deficit lists, no comparisons.
- **P10 Every age gets its own interface.** Three bands (rules in §3). Styling, input, density, and voice change together per band.
- **P11 The timer is a metronome.** Timed work exists only as optional 2-minute ungraded self-referenced fluency sprints (ages 6+): soft filling-arc time indicator, no ticking, no red endgame, "you versus your last time" only.
- **P12 No dark patterns, minimal data.** No guilt copy, urgency, or pre-checked boxes anywhere — child or parent.

## 3. Age-tier interaction rules

- **Band A (ages 4–6):** tap-first + audio-carried. Every instruction works heard-aloud with **no reading required**; audio auto-plays and is replayable via a large AudioButton. Inputs: tap, drag, circle, draw in oversized boxes. One operation per page. Large type, high warmth, friendly mascot-level decoration allowed. Sessions ≈5 min. **No timers or sprints at this band, ever.**
- **Band B (ages 6–9):** dual audio + text on every instruction; numeric entry via an on-screen **NumberPad** (never a keyboard field); visible scaffolds (labeled place-value columns, ten-frames, balance scales). Light, puzzle-flavored decoration. Sessions ≈10 min. Sprints begin here.
- **Band C (ages 9–12):** symbolic entry and typed short explanations are normal work; clean, respectful, near-decoration-free styling (no mascots, no emoji); estimation-first prompts; denser but still one-problem-in-focus. Sessions 10–15 min.
- **All bands:** text and audio always both exist at B+; captions on audio; no color-only meaning; reduced-motion respected; touch targets ≥48px (48–80px at A).

## 4. Screens to design (canonical names — use exactly)

### Child — placement
- **PlacementWelcome** — Ms. Wren introduces herself and frames placement as exploration ("some easy, some new — both help me"). One primary CTA "Let's go," audio on all copy. No timer, no test language.
- **PlacementActivity** — one adaptive item in focus; band-appropriate input; every answer gets the same warm neutral "Got it!" (never right/wrong); soft pause offer every ~8 items. States: paused, resume, gentle early-exit for young children.
- **StartingPoint** — "We found your starting point!" reveal: 2–3 strengths named by concept, level as a neutral letter (never a grade), gentle "you are here" pin-drop. Quiet warmth, no confetti.

### Child — weekly cycle
- **ThisWeekHub** — the home screen: concept card (name + one-line why), five day-tiles (today lit, done filled, future "resting" — locks must not read as punishment), AnchorPanel handle, quiet TreasureChest count, JourneyMap link. States: Monday reveal (card flips open), mid-week, week-complete, dual-thread ("This week: Fractions · Still strengthening: Renaming").
- **LessonRoom** — segment-based lesson player (hook → why → worked examples → summary → vocabulary cards): pause / replay-segment / "explain that again"; segment dots; **no skip control on first viewing**; ends by visibly "pinning" the worked examples into the AnchorPanel.
- **GuidedPractice** — practice *with* Ms. Wren in fading scaffolds (she models → child fills steps → child solos). One example in focus, step-by-step interactions, hint ladder on misses, scratch pad available. Nothing graded.

### Child — daily practice
- **WarmUp** — 2–4 quick retrieval items styled as friendly warm-ups (stretching metaphor), immediate warm confirm, auto-flows onward.
- **PracticePage** — the core surface: one problem in focus, quiet "page 2 of 3," band-law inputs, AnchorPanel + ScratchPad always reachable, hint ladder + warm explanation on miss (never a bare X). Modes: fluency / application / word-problems (read-aloud on every story). States: hint-open, item-parked, resume ("we were right here").
- **PuzzleGrove** — the week's one playful non-computational page under the module's own "Puzzle Grove" mark. Band A: build/sort/color/match + a "show a grown-up" card; Band B: logic puzzles; Band C: error-analysis / "both students are right — explain" with typed justification. Qualitative response, never scored.
- **DayDone** — quiet completion: day-tile fills softly, one strategy-praise line, "Tomorrow's tile unlocks in the morning!" No confetti, no rewards. Partial variant: "we'll finish this tomorrow — it will wait for you."
- **SprintGate** — sprint invitation stating three facts before any start: two minutes · you versus your last time · never graded. Two buttons of **equal visual weight**: "Let's go" / "Not today."
- **SprintRun** — one item at a time, soft filling-arc indicator (no numerals counting down, no ticking, no red), calm "done for now" exit always visible.
- **SprintFinish** — today's count vs your own last time only; no stars or grades; Band C may show a tiny personal sparkline.
- **TreasureChest** — parked misses as small closed chests (no red marks); opening replays the item warmly; resolved chests leave with specific praise; empty state is a tiny settled moment.

### Child — mastery
- **WeeklyCheck** — Form A check dressed **identically to PracticePage** ("the last page of the week," not an exam): feedback held to the end (stated warmly), AnchorPanel in strategy-card-only mode, ScratchPad on, no timer.
- **WeekResolve** — the weekly warm moment: concept named as owned, visible Mastered Shelf addition, map advances, next week previewed. Slightly warmer than DayDone; still no confetti.
- **StrengthenPlan** — non-pass outcome, **visually as warm as WeekResolve**: the one wobbly skill named, the plan (short revisit + brand-new problems), "everything else keeps moving." Absolutely no %, red, or sad styling. Escalation variant: friendly "a real teacher from our team wants to look at this with you" card.
- **MicroReteach** — short (2–4 min) worked-example-first replay of just the missed skill; replay control; warm framing.
- **FreshProblems** — the re-check with brand-new problems, framed as fair ("not the old ones — that would just test your memory of the pages"); same dress as WeeklyCheck.
- **JourneyMap** — the child's only progress surface: a trail of 24 concept stops with a "you are here" pin and landmark checkpoints; the **Mastered Shelf** (each passed concept as a named object); an effort strip ("you showed up 4 days this week"). No accuracy stats, no comparisons. Band A: picture-book path → Band C: clean cartography.

### Parent (phone-first, readable in under a minute)
- **ParentWelcome** — three swipeable ~20-second cards: the rhythm / your role ("you never grade anything") / what this is not (not drill, not speed, not a game). CTA: "Find {child}'s starting point."
- **PlacementStory** — placement results as a conversation: level letter + context, strengths, first-month plan, "placement is re-checkable" promise, report-day scheduler.
- **ParentHome** — per-child week strip (five tiles mirroring the child's), concept name, report state (ready/acknowledged/in progress), effort-framed consistency line ("4 practice days this week" — never "missed"), entries to all parent views. Multi-child: stacked, never ranked.
- **WeeklyReport** — the weekly note from Ms. Wren, fixed structure: header (level + week code, concept, **Passed / One more round** + % shown once, no verdict color-coding) → what we worked on → where {child} is improving → what we're strengthening (one skill + our plan) → what to focus on at home (one praise line + one teach-it-back question) → **Acknowledge tap** ("Seen it — {child} will know their week counted"). Body 90–150 words.
- **ReportHistory** — browsable archive of acknowledged reports; profile header; export/print.
- **TrendsView** — at most three calm charts: untimed accuracy by week (with the 85% mastery line explained), retention on older material, self-referenced sprint counts (hidden if sprints off). Each chart carries one teacher-voice sentence. No red zones, no down-arrows, no projections.
- **MasteryMap** — grid/list of the level's 24 concepts: mastered / mastered-after-strengthening (equally mastered, small "took the strong road" note) / strengthening now / upcoming; checkpoint + level-exit marks; printable.
- **PatternsView** — recent misses grouped into five plain-language patterns (e.g., "knows the idea, skips a step under load"), each with 1–2 example items and **what the program is already doing about it**; footer: "You don't need to fix any of this — it's ours."
- **CoachCorner** — exactly two cards: a speakable praise line (tap-to-hear Ms. Wren say it) and one teach-it-back question; fixed three-line etiquette footer.
- **SchoolSync** — one input ("What is {child}'s class working on right now?"), honest effect statement ("we'll lean warm-ups toward overlap"), no-overlap honesty state.
- **ParentControls** — sprints on/off, audio, session length (Short/Standard/Full, hard cap), schedule, accelerated-mode request, plain-words data panel with export + delete, escalation contact. Every control explains *why the boundary exists*.

### Shared components
- **component-AnchorPanel** — slide-in panel: worked examples, strategy card, vocabulary; states: empty / full / strategy-only; band styling (pictorial → diagrams → symbolic). Never covers the current problem entirely.
- **component-HintLadder** — the three-rung help surface: rungs revealed one at a time on request; the answer (with reasoning) only after rung 3 + an attempt.
- **component-WrenBubble** — Ms. Wren's speech presence: one short turn, replay audio affordance, band-tuned warmth (decorated at A, plain at C). Never blocks input.
- **component-ScratchPad** — collapsible free-draw canvas sharing the screen with the problem; draw/erase/clear; never graded.
- **component-AudioButton** — large replayable speak-aloud control; playing/caption state; auto-play at Band A.

## 5. Guardrails

- **Mood:** calm, structured, warm, confident — a tidy sunlit classroom, not an arcade. If a design choice feels "engaging" but not "learning," remove it.
- **Closed exception list:** the only celebratory signals allowed are the ones named in P5. No confetti, particles, coins, badges, streak flames, sound fanfares, or mascot cheering loops.
- **No fail states child-side:** no red X, no shaking inputs, no error-red fields, no sad mascots, no darker "you lost" screens. Misses are met with warmth and a hint ladder.
- **Verdict color law:** parent verdicts are typographic, not color-coded; never map pass/non-pass to green/red.
- **Accessibility:** WCAG AA contrast minimum; touch targets ≥48px (48–80px for young children); dyslexia-aware type choices (generous x-height, open apertures, wide default letter/word spacing, never justified text, generous line-height ≥1.5); captions for all audio; no color-only meaning; honor `prefers-reduced-motion`.
- **Theme:** design a single calm **light** default; dark mode is not required.
- **Brand independence:** do not reference, imitate, or approximate the look of any existing math-enrichment, tutoring, or worksheet-franchise company. Character design for Ms. Wren (if depicted) must be original: a warm small-bird motif is acceptable; keep her simple and non-babyish so she scales across ages.

## 6. Design tokens (deliver first)

Produce a token set as **CSS custom properties in `tokens.css` plus an exact JSON mirror in `tokens.json`**, covering:
- **Colors:** base neutrals, one calm primary, one warm accent, and **semantic roles** (surface, surface-raised, ink, ink-muted, focus, success-quiet, info, warning-quiet — note: no "error-red" role for child surfaces; use a neutral "attention" role instead).
- **Type scale per band:** three scales (A/B/C) — A is largest and roundest; C is a clean reading scale. Include font family choices (system-safe or embeddable), sizes, weights, line-heights.
- **Spacing scale, radii, elevation/shadow levels, motion durations** (calm: 150–300ms, gentle easings).
Use these tokens consistently in every mockup.

## 7. Deliverable format

- **Self-contained HTML mockups, one file per screen**, named exactly `screen-<CanonicalName>.html` (e.g., `screen-ThisWeekHub.html`, `screen-WeeklyReport.html`) — one for each of the 31 screens in §4. Shared pieces as `component-<Name>.html` (5 files). Plus `tokens.css`, `tokens.json`, and an `INDEX.html` that links every file with a one-line description.
- **All CSS inline or in the file** (a `<style>` block importing nothing); **no external assets, fonts, CDNs, or scripts** — the files must render offline. Inline SVG for illustration. React TSX versions are welcome *in addition* if you can produce them, but the HTML set is the required deliverable.
- Mockups should show a realistic phone-width layout (≈390px) and remain presentable at tablet width; wide content scrolls inside its own container.
- Show meaningful states where they matter (e.g., ThisWeekHub in Monday-reveal and mid-week; StrengthenPlan next to WeekResolve to prove equal warmth) — multiple states may live in one screen file, stacked with labels.
- **Placeholder math content must be original** and band-appropriate. You may use these samples (or write similar originals — never copy any company's worksheet content):
  - **Band A:** "[picture: 4 ducks in a pond, 3 ducks arriving] How many ducks in all?" · "Start at 6. Count on 2. Where do you land?" · "Draw your own picture for 2 + 3."
  - **Band B:** "52 − 17 = ?" (with place-value column scaffold) · "Maya has 4 crackers. Dad gives her 5 more. How many now?" · sprint items like "7 × 5 = ?"
  - **Band C:** "1/3 + 1/4 = ? Estimate first: bigger or smaller than 1/2?" · "A student says 1/3 + 1/4 = 2/7. Test the claim on 1/2 + 1/2 and explain what breaks." · "Always, sometimes, or never true: multiplying makes a number bigger."
- Sample child name for mockups: "Maya" (Band B) or "Dev" (Band C). Sample week: "Level B · Week 14 — Subtraction with Regrouping."

## 8. Priority order

If effort is limited, deliver in this order — earlier items at full polish:
1. `screen-ThisWeekHub.html`
2. `screen-PracticePage.html` (with hint-ladder and miss states)
3. `screen-LessonRoom.html`
4. `screen-WeeklyCheck.html` + `screen-WeekResolve.html` + `screen-StrengthenPlan.html` (the last two side-by-side proves the equal-warmth law)
5. `screen-WeeklyReport.html` (parent)
6. `screen-ParentHome.html`
7. Then: JourneyMap, DayDone, sprint trio, GuidedPractice, WarmUp, PuzzleGrove, TreasureChest, placement trio, remaining parent screens, components, INDEX.

Your output will be dropped into a repo folder (`design/inbound/`) and committed as-is — file names and self-containment matter.
