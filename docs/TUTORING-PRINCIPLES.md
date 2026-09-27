# Tutoring principles — knows, not finished

> Versioned copy of the `tutoring-app-design` skill (`~/.claude/skills/tutoring-app-design/SKILL.md`), saved with the product at the owner's request on 2026-09-26. The skill is the working copy; update both together.

Earned in MindFoundry, a Kumon-plus-Best-Brains maths app used daily by the
owner's 7-year-old. Over two months the child found, by using the app, defects
that a 21-gate test battery with 30,000 assertions never saw. Every principle
below names the failure that earned it. Read the whole file before designing.

## 1. The one law

**Record "knows", never "finished".** A progress number that a child can reach
without learning misleads the child, the parent and the scheduler at once.

The founding measurement (2026-09-26): the child's times-table record showed
419 of 419 answers correct and 50 sheets passed. The truth was 305 right on the
first try (73%), a table he could read on the early sheets with no record of it,
and zero seconds of timing data. He had reached sheet 50 without knowing ×6 to
×9. Every design choice below exists to make that impossible.

## 2. What "knows" means

A fact or skill is **known** when, **on at least two separate days**, the child
gets it **right on the first try**, **without the scaffold**, **within its
fluency time**. Anything less is "learning", and the app must say so.

- First try is the measurement. Retries are the teaching. Store both.
- Scaffold-free means the evidence excludes any answer given while a table,
  hint, worked example or model was visible.
- Fluency time is recorded per fact, never shown to a young child as a race.
- Two days is the spacing check: same-session success is working memory.
- Mastery is per fact or skill, never per sheet or page. A sheet is a delivery
  unit, not a unit of knowledge.

## 3. The tutor's principles

1. **First try counts; retries teach.** A pass rule on the final answer rewards
   guessing through the answer space (sheet 29: 0 of 15 first try, 15 of 15
   "passed").
2. **Help is a ladder, not a jump to the answer.** The least help that gets the
   child moving, one rung at a time, the child choosing to climb: what it means →
   use a fact you already know → a way to finish by yourself → the answer (the
   table). Keep the answer rung — the owner likes the table; it just must not be
   the only option. No rung below the answer may state it (gate it for every
   fact), and record the highest rung used per fact: over days that rung should
   fall, which is the plainest record of learning there is.
3. **Scaffolds are visible, costed and fading.** Every look at a table or hint
   is recorded. The looked-up fact returns a few problems later without the
   scaffold. An answer given with the scaffold open never counts as known.
   Scaffold a skill with a short demo, a very short forced-practice window, then
   optional — driven by the child's first-try streak, with a parent override.
4. **Never leave a scaffold silently open.** An always-open aid produces zero
   recorded looks, and zero looks reads as "didn't need it". The table was open on
   every "ordered" sheet; the peek flag fired only on a tap.
5. **Record speed; don't show it to young children.** No timers for pre-readers
   ever. The parent and the scheduler see time; the child does not.
6. **Schedule by weakness, not by sheet number.** The next practice is built from
   the facts that are slow, looked-up or missed, with spaced returns.
7. **Teach thinking routes, not only answers.** Each fact family has a route
   (doubles, fives-then-adjust, ×9 = ×10 minus a group, turn-around). Ask "how
   did you get it?" on a sample of answers and read the reply.
8. **A child who can state a rule may not use it.** Check the application, not
   the recital. (He answered "the count with more ones is greater: sometimes"
   correctly, then chose 47 over 54 four days later — the biggest ones digit.)
9. **Tests hold feedback; after the test, go over the paper.** A check that
   teaches as it goes stops measuring. A check that never reviews the misses
   never teaches. Do both, in that order, and never change the score in review.
10. **A miss is information, not failure.** Name what is right, point to where to
   look, let the child finish it, allow one re-attempt. Never the word "wrong",
   never the answer at the first hint rungs.
11. **The day's length is its question count, not the clock.** A dose target is
    an offer to rest between questions, never a stop.
12. **The parent sees knowing, not finishing** — a fact map (fluent, slow,
    learning, looked-up) and one small thing to try. The parent is a
    like-instructor: offer the move, never assign it, never ask them to teach a
    second method.

## 4. Screen laws for children

- **The youngest band is not the oldest band with bigger text.** Pre-readers:
  audio-first, at most 10 words per sentence, one instruction per sentence,
  tap targets at least 48 px, no timers, tap-to-choose instead of typing.
- **Every control must be able to grade what it asks.** Never a "Check" button
  on something nothing checks (147 "explain" items sent typed text to a box that
  accepted anything and stored it where no screen read it). If an answer is
  ungraded, the button says what really happens ("Tell Ms. Wren", "I did it").
- **One claim per row.** Several statements to judge get one row each with a
  True/False toggle, graded; never a paragraph with "write TRUE beside each".
- **Typed answers state their shape** ("e.g. 3, 7, 12", "e.g. 4 + 3 = 7").
- **Prompts can break lines.** A renderer that collapses whitespace turns lists
  into walls; lists go on bullet lines.
- **Count the day, not the screen.** "Question 3 of 5" on every screen of the
  day, the same words in the same place; never a per-screen count that restarts.
- **Never build a screen for one question.** A one-item warm-up screen made a
  parent report "only 1–2 questions today" when the day held five.
- **Resume where the child left off, and never re-serve done work.** Re-read
  progress after every save, not only at day end (a stale copy re-served
  question 1 and overwrote an eight-minute answer).

## 5. The analytical method — diagnosing a child or an app from data

1. **Start from the actual child's records**, not the design doc. Query the
   attempts table for the complaint's exact date and item.
2. **Put the recorded number beside the real one.** Recorded correct vs first-try
   correct; sheets passed vs facts known. The gap is the finding.
3. **A zero is a question about the instrument first.** 0 peeks and 0 seconds on
   every row meant the sensors were blind, not that the child never looked.
   Before concluding behaviour, prove the field can be non-zero — in a real
   browser, driven the way a child uses it.
4. **Time durations with a monotonic clock** (`performance.now()`), never the wall
   clock. The browser proof of the timing fix caught the wall clock jumping
   10–12 s backwards mid-sheet; wall-clock durations would have stored negative
   or inflated first-try times. Check a timer against the page's own monotonic
   clock, not against a fixed threshold — the host's timing is noisy too.
5. **Read the wrong answer as a diagnosis.** 47 over 54 is "compares by ones";
   "5" on a two-step tray problem is "did not parse the task". Tag the error and
   ask what rule would produce exactly that answer.
6. **Look for gaming signatures** and respond kindly, never punitively: an
   answer within about a second then corrected; a scaffold look just before a
   correct answer; three or more tries cycling through answers; first-try
   accuracy that collapses on mixed practice while ordered practice stays
   perfect.
7. **Check where the complaint actually happened.** "It didn't correct him" was
   the weekly check (feedback held by design), not a practice day. The defect was
   the missing review afterwards, not the held feedback.
8. **Count across the whole corpus before fixing one item.** One reported item
   became 147 items of the same shape, and 12 more run-together prompts.
9. **Report numbers, then the tutor's reading of them**, then the smallest safe
   change. Owner rulings come as a table with a recommendation.

## 6. The verification method — test the screen, not only the content

- **Content gates do not see screens.** Enumerate the seam: every field the
  content writes and the screen reads, and assert both ends mean the same thing
  (a page count written as "items per page" and read as "number of pages").
- **Render it and look.** Mount the screen, drive a real browser, photograph at
  the youngest and oldest band, pixel-diff before and after. A diff that is
  confined to the header proves the change's reach. Several correct-looking fixes
  died on the photograph.
- **A gate never seen to fail is unproven.** Every check ships a self-test
  control that is deliberately broken and must fire; one control was silent on
  its first run and would have guarded nothing.
- **Existing debt becomes a ratchet**, never a silent exception: counts may fall,
  never rise.
- **Measure before and after on the same surface**, and prove the content bytes
  unchanged when only presentation should move.
- **Defects the child finds by using the app mark the test suite's blind spot.**
  Aim the next gate there.

## 7. AI that reads a child's answer

- **Rubric from the item's own authored content** — model answer, accepted forms,
  hint ladder, error tags, the week's explanation — never the model's idea of the
  concept. Spelling never counts.
- **Formative only.** The reading never moves a score or a pass.
- **Never block the child.** Short timeout, no retries, a plain acknowledgement
  on any failure; a daily per-child quota; a parent-of-child check; never send
  the child's name.
- **Persona rules in the prompt** (band voice, sentence limits, never "wrong",
  never the answer on a miss) and a code check that swaps any line breaking them.
- **The parent can read every sentence and its reading.**
- **Evaluate before a child sees it**, with fixtures that include the item's own
  misconception and an off-topic answer, not only correct ones.
- **Cost is trivial when scoped** (a third of a cent per reading on a mid-tier
  model); scope it to the items that need judgement, not every answer.

## 8. Checklist — a new tutoring app, or an audit of one

- [ ] Every attempt stores: first-try result, number of tries, time to first
      answer (monotonic clock, paused while the app is hidden), whether any
      scaffold was visible, every answer tried.
- [ ] Pass and mastery rules use first-try, scaffold-free, timed evidence across days.
- [ ] Every scaffold records its use and fades by the child's own streak.
- [ ] Practice is scheduled from the weakest facts, with spaced returns.
- [ ] Tests hold feedback; a review of misses follows every test.
- [ ] Every control can grade what it asks, or says honestly that it doesn't.
- [ ] The day shows "k of N" everywhere; resume never re-serves; no one-item screens.
- [ ] Youngest-band laws hold (audio, sentence length, targets, no timers).
- [ ] The parent view shows knowing vs finishing, with one optional move.
- [ ] Gates: seam contract, screen photographs, self-test controls, ratchets.
- [ ] Before shipping a pass-rule change, re-score a real child's history under
      the new rule and show which "passes" would not have passed.

## Provenance (MindFoundry, all under `/home/usthr/Penta_University/Math_Tutor/MindFoundry`)

- 2026-09-04 page-count seam, one-question warm-up screens, 18 untested screens:
  `modules/best-brains/meta/REPORT-2026-09-04-SCREEN-LAYER-QA.md` §1–§8.
- 2026-09-13 session cap ended days early; re-entry re-served and overwrote: §10.
- 2026-09-22 ungraded "Check" boxes, run-together claims, true/false form: §11.
- 2026-09-22 AI explanation review: §12 and `SPEC-2026-09-22-EXPLANATION-REVIEW.md`.
- 2026-09-26 recorded 100% vs first-try 73%, invisible table, zero timing:
  `docs/BRIEF-2026-09-26-RECALL-NOT-LOOKUP.md`.
