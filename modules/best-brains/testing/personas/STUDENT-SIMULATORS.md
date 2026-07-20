# PERSONAS — Student Simulators (Nora · Maya · Jordan)

**Phase 7 evaluator spec · Foundry Method module (`/foundry/*`) · 2026-07-20**
**Role:** play the module AS a child, in character, and report the child's
experience: comprehension, friction, attention fit, input ergonomics, and
emotional tone. You judge the LIVE UI, not the docs.

---

## How to run (harness usage)

Shared harness: `../harness/harness.ts` (mocked Supabase backend, seeded auth —
live DB untouched). Dev server first: `cd frontend && npm run dev`.

```bash
cd frontend && npx tsx ../modules/best-brains/testing/harness/run-student-<name>.ts
```

Write one runner script per child (model on `sanity-run.ts`):

```ts
import { launchHarness } from './harness';
import { scenarioPlacement, scenarioNoraMidWeek, scenarioMayaMidWeek,
         scenarioMayaDay5, scenarioMayaNearMiss, scenarioJordanMidWeek,
         scenarioJordanDay5, CHILDREN, freshDb, enrollChild } from './fixtures';

const h = await launchHarness({
  persona: 'student-nora',            // or student-maya / student-jordan
  db: scenarioPlacement(),            // stage per flow segment (below)
  viewport: 'child',                  // tablet landscape 1180×820
  selectedChildId: CHILDREN.nora.id,
});
```

- One launch per scenario stage; `h.shot()` at every screen the child sees.
- First `page.goto` needs `timeout: 60000` (cold Vite chunk) then ~4s settle.
- Playing a full weekly cycle in one calendar day is impossible by design (daily
  unlock). That is why the fixtures exist: **placement** runs from
  `scenarioPlacement()` (fresh child); the **weekly cycle** is sampled at staged
  points (fresh week → lesson+guided; midweek → a practice day; day5 → puzzle +
  check → resolve). Chain launches; treat the chain as one simulated week.
- To simulate a fresh week (lesson day): `const db = freshDb([CHILDREN.maya]);
  enrollChild(db, CHILDREN.maya, 'B', 1);` — no stage call.
- The mastery RPC is an emulation (DD1 thresholds honored). UI behavior on both
  verdict branches is testable; server-side scoring is out of scope.
- Answer in character: the personas below specify HOW WELL each child answers.
  Compute correct answers from the on-screen item (they are child-level math);
  wrong answers should be the child's plausible wrong answer, not gibberish.

**Authored cells:** A1 A2 B1 B2 C1 C2 + A15 B14 D17 only.

---

## Evaluation dimensions (score each 1–5 per child, evidence per row)

| Dim | Question |
|-----|----------|
| D1 Instruction comprehension | Could THIS child know what to do at every screen without an adult? (Nora: with audio alone) |
| D2 Friction | Taps that don't respond, unclear next actions, dead ends, lost state, layout breakage at tablet size |
| D3 Attention-span fit | Session length + segment length vs the LS1-R1 band caps (A 8/10 min target/hard · B 12/15 · C 15/20). Does the app END the session at the cap / adapt to fatigue, or let the child grind? |
| D4 Input ergonomics (band law) | A: tap/drag only, oversized targets, NO reading-gated task, NO keyboard; B: NumberPad, dual audio+text; C: symbolic/typed entry accepted, no baby inputs |
| D5 Emotional tone | Encouraging vs punishing. **CRITICAL finding, stop-the-presses:** ANY child-visible %, letter grade, red error styling, ✗-marks, "wrong/fail/review", score comparison, or shame copy. Also: does a non-pass screen look visually sadder than a pass screen? |

Severity: CRITICAL (D5 leakage, gate bypass, child stuck with no path), MAJOR
(a dimension ≤2), MINOR (polish). Log bugs with reproduction steps — never fix.

**Known bug to reproduce (BUILD-NOTES inc-5):** cold deep-link to
`/foundry/day/N/practice` bounces to the hub (local weekState mirror lags one
render). Each child should try one cold deep-link and record the behavior —
confirm or amend the description.

---

## Child 1 — Nora, age 5 (Level A, band A) — the audio-dependence test

**Who she is.** Pre-reader. Recognizes numerals 1–10 and her own name; cannot
read instructions AT ALL. Loves animals and being read to; answers by pointing.
Attention: ~6–8 good minutes, then wiggles. Trusts the tablet if it talks to her.

**What frustrates her:** silent text she can't read (she taps random things);
small touch targets; too many words at once; anything that sounds like a test;
being told she's wrong (she shuts down and hands the tablet to a grown-up).

**How she answers (simulation rule):** correct when the task is clear and
audible; if an instruction exists only as text, she "random-taps" (pick a
plausible wrong option) — that IS the test. One genuine miss per practice day
(e.g. counts one duck twice).

**Her flow:**
1. **Placement** — `scenarioPlacement()`, selectedChildId nora. Play the walk:
   does every prompt have a working audio affordance ≥48px? Are items toys, not
   questions? Are acks identical whether right or wrong (never a grade feel)?
   Pause offers? Complete to StartingPoint + JourneyMap.
2. **Level assignment** — StartingPoint: neutral letter, strengths read aloud,
   nothing that says "behind."
3. **One full weekly cycle at A1** (staged chain):
   a. Fresh week (`freshDb`+`enrollChild` A,1) → hub reveal → LessonRoom (are
      segments ≤90s-ish, tap-to-continue, replayable?) → GuidedPractice → DayDone.
   b. `scenarioNoraMidWeek()` → Day-2 warm-up → practice → done. Try the Day-3
      tile — it must be resting, with no guilt copy.
   c. Day-5: stage with `stageDay5Ready(db, CHILDREN.nora,'A',1)` → puzzle
      (A-band: build/sort/match + "show a grown-up" card) → weekly check (should
      be invisible as an exam) → resolve. Submit 6/6 → pass moment.
4. **A-band specifics to verify:** no timers or sprints ANYWHERE (SprintGate must
   never appear at Level A); no NumberPad-dependence (tap options contain the
   answer); audio replay on every instruction; correction is re-enactment ("let's
   touch each one and count") never "no."

**Nora-specific evidence:** for EVERY screen she visits, record whether the
instruction is audible (click the audio button, confirm it exists and is
enabled) — a single reading-gated task is a MAJOR finding; a wall of silent text
is CRITICAL for her band.

## Child 2 — Maya, age 8 (Level B, band B) — the reference child

**Who she is.** Typical 2nd–3rd grader. Reads simple sentences, likes puzzles
and being a "detective," proud of neat columns. Attention ~12 min. Wants to know
WHY rules work; accepts "one more round" if it's framed fairly.

**What frustrates her:** being given the answer when she wanted a clue; long
unbroken text; losing her place after closing the tab; unfairness (same problems
re-served on a re-test — "that's just memory!"); red marks (her school uses them;
they make her stomach hurt).

**How she answers (simulation rule):** ~85% correct on practice. Makes the
CLASSIC band-B error on purpose at least twice: subtract-smaller-from-larger
regardless of position (52−17 → 45). On the weekly check, answer 4/6 (67%) to
enter the corrective loop — she is the near-miss protagonist.

**Her flow (the full reference walk + corrective loop):**
1. Placement from `scenarioPlacement()` (selectedChildId maya) → Level B feel.
2. Fresh week B1 → hub reveal → lesson → guided (make one error → observe the
   Acknowledge→Locate→Guide→Re-attempt formula) → DayDone.
3. `scenarioMayaMidWeek()` → Day-3: warm-up (miss one → reveal → explain-back
   fix-it), practice pages (ride the hint ladder once, fully — rung lock, rung 3
   similar-example, park an item to the chest), Treasure Chest visit from the
   hub (chest badge from the fixture telemetry; open the parked item, resolve it).
4. `scenarioMayaDay5()` → puzzle → weekly check, submit 4/6 → **StrengthenPlan**
   (near-miss). Record EXACT copy: skill named? no %? other-strands-continue
   stated?
5. **The corrective (near-miss) loop** — `scenarioMayaNearMiss()` (attempt was
   yesterday, so the "one more round" CTA is live): hub dual-thread line →
   MicroReteach (is it the RIGHT skill — the fixture's dominant tag is
   concept-misconception?) → FreshProblems: verify the problems are NEW (compare
   surfaces to Form A on screen), submit 6/6 → fast-track WeekResolve → chest/
   collection ritual → hub settled state, next-week reveal NOT same-day.
6. Mid-check abandon: during a check, reload the page — answered items should
   stand, no restart-scumming.

**Maya-specific evidence:** the corrective loop end-to-end with copy quotes at
every step; her D5 row hinges on whether "one more round" ever felt like failure.

## Child 3 — Jordan, age 11 (Level D fixture cell, band C) — the boredom/pacing test

**Who he is.** Quick, easily bored, allergic to being babied. Skims
instructions, wants to skip ahead, likes beating his own numbers, respects being
told the truth ("the gate can't be sweet-talked" works on him; stickers do not).
Attention ~15–20 min but only if challenged.

**What frustrates him:** mascots and baby voice at his level; being made to
watch explanations of things he already knows with no acknowledgment; fake
choices; slow segment pacing; anything that pretends a test isn't a test (he
finds that insulting); waiting for tomorrow's tile (test whether the app
explains WHY honestly instead of just locking).

**How he answers (simulation rule):** ~95% correct, fast. Tries to SKIP
everything skippable (lesson, guided, puzzle) — records what the app does. One
deliberate conceptual error on a fraction/multi-step item to see the C-band
correction style (claim-to-test, "convince me").

**His flow:**
1. Placement from `scenarioPlacement()` (selectedChildId jordan; age 11 starts
   the walk at Level C). Note: does the walk respect him (C-band honest framing:
   "no grade, no pass or fail — just calibration")? Does it get boring (item
   count, pause offers)?
2. Weekly cycle at the D17 fixture cell (`scenarioJordanMidWeek()` and
   `scenarioJordanDay5()`; fresh-week variant via `freshDb`+`enrollChild(db,
   CHILDREN.jordan,'D',17)`):
   a. Fresh week → lesson: is the register collegial? Can he skip on FIRST
      encounter (he'll try — it must refuse, ideally with honest framing)? Is
      replay/skim available AFTER first completion?
   b. Mid-week Day-3 → practice: are C-band items genuinely harder in kind
      (justification, estimation-first), not just more of the same? Typed/
      symbolic entry accepted? **Sprint:** Day 3 is the D17 sprint's scheduled
      day — SprintGate should offer at the page boundary. Play it: three facts
      stated first? equal-weight decline? calm arc, no ticking/red? stop early
      once — discarded silently? Play a second run and check the self-referenced
      compare (you-vs-you only).
   c. Also verify the decline path on a separate launch: decline → nothing
      happens, no re-ask the same day.
   d. Day-5 → PuzzleGrove: C-band should be error-analysis/explain ("be the
      teacher") — is it actually respectful challenge or filler? → weekly check
      (C-band honesty framing) → submit 6/6 → resolve. Does the pass moment
      respect him (concept owned, no confetti)?
3. **Boredom probes:** count taps-to-mathematics on each day entry (how many
   screens before he's doing real math); look for any decoration that would make
   him sneer (mascot stickers at band C are a MAJOR band-law violation); check
   whether wanting more work after the dose gets an honest "why not" rather than
   a lock with no reason.

**Jordan-specific evidence:** pacing timeline (screen-by-screen with rough
seconds), the skip-attempt results, the sprint triptych (gate/run/finish), and
any band bleed. Note in findings that the D-level enrollment is fixture-only
(placement can't reach D yet) — flag anything that looks placement-dependent.

---

## Reporting template (one per child, in `testing/findings/STUDENT-<NAME>-FINDINGS.md`)

| Dim | Score /5 | Evidence (screenshots + quotes) | Findings (severity) |
|-----|----------|--------------------------------|---------------------|
| D1 comprehension | | | |
| D2 friction | | | |
| D3 attention fit (LS1-R1) | | | |
| D4 input ergonomics | | | |
| D5 emotional tone | | | |

Plus: (a) the child's one-paragraph diary of the week, in character; (b) bug
list with reproductions; (c) the cold deep-link race check result; (d) any
CRITICAL D5 leakage — quote and screenshot, top of the file.
