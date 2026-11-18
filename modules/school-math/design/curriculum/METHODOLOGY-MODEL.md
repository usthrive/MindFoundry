# METHODOLOGY MODEL — school-math (the module's constitution)

**Written 2026-11-17, 20:05 EST (from `date`), by the Curriculum Architect. Phase 4, Part A.**
**Status:** constitution for Part B (the grade map), Phase 4.5 (engine), Phase 5 (experience) and
Phase 6 (build). Engineers and content authors implement against this document.

**Sources of authority, in order:** `research/phase2-gaps/EVIDENCE-LEDGER-FINAL.md` (E1–E269,
frozen — the only source of facts about Singapore-style maths, Math in Focus, the standards and
the child's test) → `DESIGN-DEFAULTS.md` (DD1–DD23, binding `[original design]` choices) → items
tagged `[original design]` here. The skill `tutoring-app-design` is binding throughout; its
sections are cited as "TAD §n".

**Legal posture.** The module is Singapore-style and original. It states chapter titles and topic
order descriptively (E152, E153), copies no page, item, character or layout, never uses the
school test's items (DECISIONS M6), claims no affiliation (M3). The teacher character is the
owner's decision (O4) and is called "the teacher" here. No child's name anywhere.

---

## 0. The model in one paragraph

This module teaches **the structure under the arithmetic**: why a carry is a ten, where the
unknown sits, what a story is asking. The Kumon-style module makes him fast at written columns
(E106, E198); the Best Brains-style module gives him one named concept a week with Ms. Wren (E198;
the sister module's own `modules/best-brains/design/curriculum/CURRICULUM-MAP.md`).
Neither has him **build a model**: Kumon has no pictures or word problems, and in the
Best Brains-style module the child looks at pictures but never makes one (E198). Here the child
does what a Singapore-style classroom asks (E39, E41): he **acts** on blocks on a place-value
chart, **builds** the number bond or bar himself, then **writes** the number sentence — concrete →
pictorial → abstract, every unit (E41), with the picture always ending in notation (E229). It
runs in **chapter-aligned units**, not weeks (DD1), beside what his school is teaching (E18,
DD5), and it **never drills speed** (DD13). What it records is "knows", never "finished" (TAD §1).

---

## 1. What this module is not (the inheritance it refuses)

| It does not | Because |
|---|---|
| Run a worksheet ladder or a sheet count | Kumon-style already does; this approach's practice sets are short and varied (E103, E107, E108) |
| Run a one-concept-a-week rhythm | The school moves by chapter (E109, E139); the sister module owns the week (HANDOFF §7) |
| Time the child or show a clock | Fluency drill is covered elsewhere (E167 Rec. 6, DD13); TAD §3.5 |
| Teach key words ("altogether means add") | The bar model exists to replace key-word reading (E52); IES advises against (E167, E211) |
| Show a model and ask the child only to read it | A picture only looked at is "skip", not CPA (E42); children judge given diagrams better than they draw them (E64) |
| Add a third method to a skill the sister modules teach | METHOD-LEDGER.md; HANDOFF §8 |
| Claim "research shows" for CPA, bonds or bars | No isolated evidence exists (E178); DD22 |

---

## 2. The learning loop — nine steps

Each step gives its purpose, the evidence, what the child sees and does, the input surface it
needs (named as in `inputSurface.ts`: `choices`, `tap`, `pad`, `text`, `truth`, `ack`, `explain`;
new surfaces are listed in §6), and what is **recorded as "knows"** (TAD §2). "Knows" is never
recorded during a lesson step; lesson steps record the scaffold rung used.

### Step 1 — Entry check (per unit)

- **Purpose.** Find the prerequisite the unit stands on, and whether the child already holds it.
  For the first learner the first entry check is the regrouping probe (DD4).
- **Evidence.** The school's own per-chapter prerequisite check (E109, E122); bugs are systematic
  and need two same-structure items before labelling (E77); mixed items so the child must
  discriminate (E90).
- **Child sees and does.** 4–8 short items in pairs, read aloud at Grades 1–2 (DD17), no
  feedback until the end; then "Here is where we start." Never a score, never "fail".
- **Input surface.** `choices`, `pad`; **column-digit boxes** (§6, N-I1) for missing-digit pairs;
  **bond input** (§6, N-I2) for the bond pair; `tap` for "which way did you do it?".
- **Recorded.** Per pair: holds / does not hold / unclear. A "holds" pair on two days counts
  toward "knows" for that prerequisite (TAD §2). Nothing else.

### Step 2 — Concrete: the child acts on objects (virtual manipulative)

- **Purpose.** Make the idea physical before it is pictured. The trade is acted out: ten ones
  become one ten on the chart; a set is split into two parts.
- **Evidence.** CPA is central and repeats inside every topic (E39, E41); the school regroups
  with base-ten blocks on a place-value chart in Grades 1–3 and disks from Grade 4 (E69, E71);
  manipulatives give moderate gains, more on retention than transfer (E164); virtual
  manipulatives show a moderate effect (E166); the concrete stage shrinks with age and with
  known ideas (E41), so a clean entry check skips it (DD3).
- **Child sees and does.** The teacher shows the move once with the objects (short, elicit-not-
  narrate: she asks "what do we have too many of?" rather than saying it — L25). Then the child
  does it: drags ten ones into the tens column and they snap into a rod; splits counters into two
  circles; moves disks. The regrouping language is said aloud (E72).
- **Input surface.** **Place-value chart build** (N-I3), **counter split** (N-I4), both graded
  against the item's computed state (code, never AI).
- **Recorded.** Scaffold rung "concrete" used; first-try on the build action. Not "knows".

### Step 3 — Pictorial: the child builds the model

- **Purpose.** Turn the action into a drawing the child owns: the number bond with its parts; the
  ten frame; the bar with its "?"; the open number line with its jumps. The rung climbs read →
  label → build → draw unaided by the child's streak (DD6).
- **Evidence.** The method fades from supplied models to child-built ones (E59); the model
  handover by grade (E247); the praised digital pattern build → label → numbers → solve (E219,
  E224); drawing mechanics cost working memory, so the tool draws and the child decides (E63,
  E228, DD7); the picture must connect to a number sentence (E229, E167 Rec. 3).
- **Child sees and does.** The story or sum, read aloud. The builder asks the decisions in order
  (how many bars; which is longer; where the numbers and the "?" go; the brace). Then "Write the
  number sentence." A self-check shows his model beside the item's own, with differences
  highlighted, after he commits (E219).
- **Input surface.** **Bond input** (N-I2), **bar builder** (N-I5), **open-number-line jumps**
  (N-I6), **ten-frame fill** (N-I7); the number sentence on `pad` or **math-sentence input**
  (N-I8). Touch and keyboard both.
- **Recorded.** Rung used (read / label / build / unaided); first-try on each decision; whether
  the self-check differed. "Knows: builds a [type] model" comes from **build or unaided items
  with no self-check difference, first try, on two days** (TAD §2).

### Step 4 — Abstract: the number sentence and the written method

- **Purpose.** Reach the symbols the school tests: the equation with a blank, the column with
  its carry, the mental strategy named.
- **Evidence.** The written column is Singapore P1 content (E73, E35); the carry is a composed
  ten (E75, E67); mental strategies are named routes (E80, E84); "add mentally" is a Grade 2 US
  demand (E83); the school's Ch 2 test is abstract (E242).
- **Child sees and does.** The column with the carry shown as "how many new tens" (the link to
  his Kumon columns is said once — METHOD-LEDGER); equations with the blank in every position;
  "do it in your head, then tap how you did it".
- **Input surface.** **Column-digit boxes with a carry row** (N-I1), `pad`, `tap` (strategy
  names as chips), `choices`.
- **Recorded.** First-try, time (recorded, not shown), scaffold visible or not. "Knows: [skill]"
  per TAD §2 once practice (Step 6) supplies two scaffold-free days.

### Step 5 — Guided practice with the help ladder

- **Purpose.** Practise with the least help that keeps him moving; the child climbs the ladder
  one rung at a time, and the rung used is recorded.
- **Evidence.** TAD §3.2–3.4; the school's "Try" items are formative checks after "Learn" (E110);
  systematic instruction is a strong recommendation (E167 Rec. 1).
- **Child sees and does.** 3–4 items. Help ladder per item: (1) **what it means** (re-read with
  the story words highlighted); (2) **use what you know** (the bond or the chart from Step 2–3
  appears, empty); (3) **a way to finish** (the first move is shown; he does the rest); (4) **the
  answer**, with the model filled. No rung below 4 states the answer (L33 check on every rung).
- **Input surface.** Whatever the item type uses, plus the ladder buttons.
- **Recorded.** Highest rung used per item; first-try before any rung. Never "knows".

### Step 6 — Independent practice (the practice day)

- **Purpose.** Scaffold-free evidence across days; mixed sets so the skill is chosen, not
  assumed; returns from earlier units (DD10).
- **Evidence.** Mixed practice is strong (E90, E167 Rec. 1); the unknown in every position (E167
  Rec. 5); the school's book gives no continual review, so this module must (E104, E193).
- **Child sees and does.** N items (DD1). About a quarter are returns from the weakest skills.
  "Question k of N" on every screen (TAD §4). Help is available, costed, recorded (TAD §3.3).
  A miss: "Here is what is right; look here; try once more" — never "wrong" (TAD §3.10).
- **Input surface.** All surfaces; Check is never locked; a blank is "not yet" (TAD §3.19).
- **Recorded.** First-try, tries, time, scaffold visible, every answer tried (TAD §8). **This is
  where "knows" is earned:** first try, no scaffold visible, within the skill's fluency time, on
  two separate days (TAD §2).

### Step 7 — Explain and journal

- **Purpose.** Put the reason into words the school scores; keep it short so it does not crowd
  out practice.
- **Evidence.** Mathematical language is a strong recommendation (E102, E167 Rec. 2);
  self-explanation helps when scaffolded, can hurt when not (E174); the school's Math Journal
  and Math Talk (E99); explain items from Grade 1 (E258, E259); his Q6 lost its point on the
  reason (E237).
- **Child sees and does.** One explain item per lesson day at most. The reason frame (DD16):
  tap the true claims (one per row), then say or type the sentence; the app reads it back. On an
  error-analysis item the order is fixed `[original design]`: **(1)** the child writes the fix and
  commits it (graded then); **(2)** only then do the claim rows appear; **(3)** then the sentence.
  Rows that state the repair are never on screen before the fix is committed (L25, L33). A
  journal line once per unit: "Tell the teacher one thing you learned" — ungraded, the button
  says so.
- **Input surface.** `truth` (graded), `explain` (formative AI reading from the item's own rubric,
  TAD §7), `ack` for the journal line.
- **Recorded.** The tap step counts toward "knows: explains [reason]" (TAD §2). Typed text and its
  reading go to the parent page; they never move a score.

### Step 8 — Chapter check, then review

- **Purpose.** Measure, in the school's format, without teaching mid-test; then teach from the
  misses.
- **Evidence.** Sections A/B/C (E124); points 2/2/3 on his paper (E125); a third of parts asked
  for shown work (E136); feedback held, then review, score unchanged (TAD §3.9); every miss comes
  back later (TAD §3.13).
- **Child sees and does.** About 8 items: A choices, B short answers (column boxes, "which way did
  you do it?"), C one built model or shown steps. Read aloud at Grades 1–2. No feedback until the
  end. Then the review: each missed item walked with the ladder; he may re-attempt once; the
  score stays. Then "What comes back and when" in plain words.
- **Input surface.** All; feedback suppressed by the check runner.
- **Recorded.** Score as counts; per item first-try; the two category rows (DD11); every miss into
  the 2 / 7 / 21-day comeback pool with new numbers (DD10). A check pass is **not** "knows";
  "knows" still needs the two-day rule.

### Step 9 — Spaced returns

- **Purpose.** Keep every skill alive until it is known, and known skills alive thereafter.
- **Evidence.** DD10; E104; TAD §2 (two days), §3.6 (schedule by weakness), §3.13.
- **Child sees and does.** Returns appear inside practice days with new numbers. He is never told
  "this is review"; the day looks the same.
- **Input surface.** As the item.
- **Recorded.** Normal practice records; the return schedule is rebuilt from the weakest skills
  after every save.

**Order of a unit.** Step 1 once → (Steps 2–5 per lesson, one idea each; Step 7 on lesson days)
→ Step 6 on practice days between lessons → Step 8 once → Step 9 forever. A clean entry pair
lets the child skip Step 2 for that idea (DD3). A unit has no fixed length (DD1).

---

## 3. The representation progression, Grades 1–5

**Built** = the child makes it (the "build" rung, DD6); **shown** = the child reads or labels a
supplied one; **—** = not used in that grade. Grades follow US grade levels (E16). The objects
match the school's where the ledger knows them (DD18); the number line is added from Grade 1
(E167 Rec. 4). All grade placements are `[original design]` unless an E-row is cited beside them.

| Representation | Gr 1 | Gr 2 | Gr 3 | Gr 4 | Gr 5 | Evidence for the school's use |
|---|---|---|---|---|---|---|
| Connecting cubes / counters, split into parts | **built** | built (make ten) | — | — | — | E116, E246 |
| Ten frame | **built** | built (mental make-ten) | — | — | — | E115; Grade 2 use unknown (E121) |
| Number bond (part-whole diagram) | **built** | **built** (mental ±, missing part) | built (split a number for ×) | shown (recall) | — | E49, E47, E116 |
| Counting tape / number track (count on by 1s, 10s, 100s) | shown; **jumps made on it** (N-I6 chips on the masked track N-F6, each landing typed) | shown | — | — | — | E116, E117, E87 |
| Base-ten blocks on a place-value chart (trade = regroup) | **built** (tens and ones) | **built** (to 1,000) | built (to 10,000; counters on a chart) | shown (recall) | — | E69, E71, E116–E118 |
| Place-value disks / chips | — | — | — | **built** (to 1,000,000; decimals) | **built** (decimals ×) | E68, E69, E119, E269 |
| Number line, ticked (rounding; fractions) — the existing `number-line` kind | shown | **built** (rounding to check) | **built** (fractions as numbers) | built | built | E117, E118; IES Rec. 4 (E167) |
| Open number line (jumps: N10, compensation) — N-F3, no ticks | — (Grade 1 jumps run on the masked number track, row above) | **built** | built (mental two 2-digit) | shown | — | E84, E233, E236 |
| Bar model: part-whole, one-step | — | read → label → **built** (first bar unit; built by unit end) | **built** | built | built | E60, E247, E251 |
| Bar model: comparison, one-step | — | label → **built** (after part-whole) | **built** | built | built | E60, E142, E251 |
| Bar model: two-step ± | — | label → **built** | **built** | built | built | E60, E243, E251 |
| Bar model: equal units (× ÷) | — | — | **built** | built | built | E118, E244, E251 |
| Bar model: fraction of a set / fraction bars | — | — | **built** (fraction of a set) | built | built (fraction × decimal problems) | E118, E251, E269 |
| Bar model: before-after | — | — | — | shown once → **built** | built | E251, E268 (Grade 4 heuristic) |
| Bar model: algebra-type (two from sum and difference; "times as many") | — | stretch, shown → built (DD12) | stretch | shown once → **built** | built, with a letter on the unit | E58, E255, E256, E65 |
| Array; area model for × | — | — | **built** (array; area model) | **built** (partial products) | built (fraction × fraction) | E118, E119 |
| Fraction strips / circles | — | — | **built** (fold a strip) | built | built | E68, E118, E119 |
| Hundred square (decimals, percent is Gr 6) | — | — | — | shown | built (decimals) | E119 |
| Column method with a carry row / regroup marks | shown (2-digit, after blocks) | **built** | built | built | built | E71, E73, E35 |
| Picture graph, bar graph, line plot | built (picture graph) | built | built | built (line graph) | built | E116, E117, E2–E5 |

**Three invariants** `[original design]`:
1. **Every picture ends in a number sentence** on the same screen (E229, E167 Rec. 3).
2. **Nothing is built at a grade before the school shows it** (so the child never meets a model at
   school that the module skipped), except the number line and the open number line, which the
   evidence supports on their own (E167 Rec. 4). In Grade 1 the jumps are made on the masked
   number track (N-F6) with the N-I6 jump chips, never on the open line.
3. **A supplied model is a one-time rung at first exposure**, never the default after Grade 2
   (E64, E247).

---

## 4. The mastery rule ("knows")

Verbatim from TAD §2, applied per skill: a skill is **known** when, **on at least two separate
days**, the child gets it **right on the first try**, **without any scaffold visible**, **within
its fluency time**. Anything less is "learning", and the app says so.

Module specifics `[original design]`:
- **Skills are small.** "Adds two 3-digit numbers with two regroupings in a column", "builds a
  comparison bar for a how-many-more story", "explains a place-value alignment error", "adds two
  2-digit numbers mentally and names the route". A unit holds 6–12 skills. The grade map (Part B)
  lists them.
- **Model skills are earned on model items** (build or unaided rung, no self-check difference);
  **solve skills on solve items by any sound method** (DD9).
- **Fluency time** is per skill, generous, and recorded from his own first days (TAD §3.18
  sets the pattern); it is never shown to him. Model items have a long time: thinking is the
  point. Procedure `[original design]`: the skill's fluency time is **1.5 × the median time of
  his first six first-try-right, scaffold-free attempts** on it; until six exist, no time limit
  applies (a clock that has no data never holds a child back, TAD §3.18). It is recomputed
  monthly from his last six such attempts and may fall by at most a fifth per month.
- **The way out of "learning" (stall rule)** `[original design]`; TAD §3.13 "trace every state to
  a way out". A **clean day** for a skill is a practice day on which every item of that skill was
  right on the first try with no scaffold visible. When a skill has been served on **6 practice
  days without one clean day**, it is marked **stuck**: (1) the next lesson day re-opens that
  lesson's concrete step and serves the model one rung lower (DD6); (2) the parent page shows
  "stuck here" with the skill, his last answers on it and one thing to try (TAD §3.12, §3.14).
  The first clean day returns it to "learning". If it is still stuck after **6 more** such days,
  the parent chooses: keep it in the day, park it (it stays in the return pool at a low rate and
  comes back with new numbers), or go back one unit. "Stuck" never blocks the next lesson or the
  chapter check, and the child is never told the word.
- **Every state has a way out:** not started → learning (first served) → known (the two-day
  rule above) → learning again (a miss on a return) · learning → stuck (6 days, no clean day) →
  learning (a clean day) or parked (parent) → learning (a parked skill's return answered right).
- **Stretch skills** carry the same rule and the tag "stretch" (DD12).
- **A chapter-check pass is not "knows"**; it is one day's evidence.
- **Known skills stay in the return pool** at a low rate; a miss on a return moves the skill back
  to "learning" and the parent sees it move.
- **Explain skills**: the graded tap step earns "knows: explains [reason]"; the typed sentence is
  never scored (DD16).
- **The parent sees** a skills map in four states — known / learning (marked "stuck here" when the
  stall rule fires, or "parked") / stretch / not started —
  plus the **exam-skills map** for the first learner (every skill his test touched, E240,
  mapped to a unit and a state; HANDOFF §8), and one small thing to try (TAD §3.12).

---

## 5. Beside Kumon-style and Best Brains-style, every day

- **What it does.** Structure and meaning: place-value trades, part-whole, models, word problems,
  mental routes, the written "why", the school's test formats.
- **What it does not do.** No timed drill, no fact sheets, no column-speed work (the Kumon-style
  module's job, E106, DD13); no weekly concept reveal, no weekly report (the Best Brains-style
  module's rhythm, HANDOFF §7). When both sister modules and this one touch a skill, METHOD-
  LEDGER.md names one method per module and the link sentence; the teacher says the link the
  first time and whenever the child uses the sister method (DD14).
- **Scheduling.** The first units come from the test's misses, ordered by error kind (DD5):
  concept misses (the carry; part-whole; the hidden-structure formats), then the explain miss,
  then the stretch. Not page 1 of a book (HANDOFF §8).
- **The day.** N questions (O3; DD1). The owner sets N; the module never asks the parent for more
  time, and never asks the parent to teach (TAD §3.12).
- **Shared plumbing.** The attempt fields, the figure renderer and kind gate, read-aloud, the
  explanation review and the parent-page pattern are reused (HANDOFF §7); the new figures and
  inputs in §6 join the shared library under the same gates.
- **Vocabulary.** "Number bond" = the diagram; "facts" = memorised sums (E200, DD14). The glossary
  (DD20) is shared with the parent page.

---

## 6. New figures and new input surfaces this curriculum needs

The Best Brains-style library has 19 figure kinds (`figures/types.ts`: number-line, bar-model,
area-grid, ten-frame, counters, place-value-chart, base-ten-blocks, clock, coin-set,
coordinate-grid, angle-figure, math-sentence, column-method, balance, tally, fraction-circle,
pictograph, number-track, line-plot) and seven input surfaces (choices, tap, ack, truth, explain,
pad, text — `inputSurface.ts`). The Kumon-style module has column-aligned digit boxes with a
tappable carry row (`components/worksheet/WorksheetProblem.tsx`). Every new figure below obeys
the **picture-kind rule** (TAD §3.21: the picture is the kind of thing the words name) and is
checked with **L33** (does it give the answer away, or let the child skip the step being asked?).
Every new input **grades what it asks** (TAD §4), works on **touch and keyboard** (HANDOFF §6),
and ships with a **gate with a broken control** (HANDOFF §12). All `[original design]`.

### 6.1 New figures (shown; the child reads)

| Id | Figure | Picture kind | Gives the answer away? (L33) |
|---|---|---|---|
| N-F1 | **Number bond** (whole circle joined to two part circles; any circle may be empty) | A part-whole diagram, not a sum sentence | Yes if all three are filled on an item that asks for one of them — so on asked items the asked circle is empty and the other two carry their numbers; never show a filled bond beside a "find the missing part" item. **Three-part form** (expanded form only, first used G2-U01 L3): the whole joined to three part circles headed hundreds · tens · ones; same rule — the asked circles are empty |
| N-F2 | **Place-value disks** (labelled 1 / 10 / 100 / 1,000 / 0.1 / 0.01 on a chart) | Disks, not blocks (Grade 4 up, E69) | Yes if the disks on the chart are the answer's count — on "regroup" items show the pre-trade state only; never show the post-trade count where the trade is the question |
| N-F3 | **Open number line** (no ticks; labelled start, jumps as arcs with +10 / +2 labels) | A number line, not a number track | Yes if every jump and landing is labelled — on "finish the jumps" items show the start and the jump sizes, landings blank |
| N-F4 | **Tape diagram / bar with a brace and a "?"** (extends `bar-model`: difference gap, bracket for the total, two-step chaining) | A bar model, not a column of blocks | The bar's proportions leak which part is larger — acceptable on solve items (the model is meant to help); on "which is more" items the bars must be drawn equal until the child decides |
| N-F5 | **Column with digit boxes** (operands with empty boxes; a carry row; subtraction regroup marks) | A written column, not a place-value chart | Yes if the carry row is pre-filled on a missing-digit item — leave it empty; a pre-filled carry tells the child a regroup happened |
| N-F6 | **Counting tape** (a strip of consecutive numbers with a window; count on by 1s / 10s / 100s) | A number track, not a line with jumps | Yes if the landing number is visible in the window — mask the strip beyond the start on count-on items |
| N-F7 | **Fraction strip, foldable** (a strip divided into equal parts, some shaded) | A strip, not a circle | Yes if the parts are numbered — never number the parts on "what fraction" items |
| N-F8 | **Comparison picture, two rows matched one-to-one** (Grade 1 pre-bar) | Two rows of objects, not a bar | Yes if the leftovers are ringed (L33's own case) — never ring; the child counts the gap |
| N-F9 | **Place-value chart with blocks (pre-trade and post-trade states)** (extends `place-value-chart` + `base-ten-blocks` with a "ten ones grouped into a rod" animation state) | Blocks on a chart, not disks (Grades 1–3, E69) | Yes if the chart shows the regrouped state on a "regroup" question — show only the state before the trade |

### 6.2 New input surfaces (the child builds; graded)

N-I12–N-I14 and N-I17–N-I24 are named in the grade file that first uses them (GRADE-3.md §7,
GRADE-4.md §7, GRADE-5.md §7). N-I15, N-I16 and N-I25 sit here because Grade 1 already uses them.

| Id | Input | What the child does (touch / keyboard) | What is graded (code-computed) | Gives the answer away? (L33) |
|---|---|---|---|---|
| N-I1 | **Column-digit boxes with a carry row** (reuse the Kumon-style digit grid) | Taps a box, enters a digit on the pad / arrow keys move, digits type, Enter advances; the carry row is tappable | Each digit against the computed column; the carry digit against the computed number of new tens (any correct carry value accepted, incl. 2 for four addends) | A highlighted empty box can read as "a digit is missing" (TAD §3.17) — highlight nothing until the child taps |
| N-I2 | **Number-bond input** | Taps the empty circle, enters a number / Tab to the circle, type | The part or whole against the computed value; the orientation (which circle is the whole) when the child must choose. **Three-part form** (G2-U01 L3 and its returns; N-F1): the whole is given and the hundreds, tens and ones parts are asked; each part is graded against its place value; a 0 part must be typed as 0 (605 = 600 + 0 + 5), an empty part circle is "not yet", not wrong; a value in the wrong part (605 = 600 + 50) is wrong | The other two numbers are givens — fine; never show a third filled circle. In the three-part form only the whole is given, and the part circles carry place headings, never values |
| N-I3 | **Place-value chart build** | Drags blocks or disks between columns; "group ten" button bundles ten ones into one ten / arrow keys select a column, number keys type how many pieces to move (Enter moves them to the column in focus), Space groups ten | The chart's state against the computed trade; the count per column | The target count is the answer — never show it; the child's chart is compared only on commit |
| N-I4 | **Counter split** | Drags counters into two part circles / number keys set a part's count | Both parts sum to the whole; a required part when specified | None if the whole is given and the parts are asked |
| N-I5 | **Bar builder** (guided construction, DD7) | Four decisions in order: bar count (tap 1 or 2); which is longer (tap a bar); place numbers and "?" (drag chips onto parts, brace, gap / Tab to a slot, Enter places); number sentence (pad or N-I8) | Bar count, longer bar, every chip's slot, the sentence — each against the item's schema (part-whole / comparison / two-step; unknown position). Two known parts on a part-whole bar are accepted in either order | The self-check (his model beside the item's) appears only after commit; the item's model is never visible before |
| N-I6 | **Open-number-line jumps** (in Grade 1 the same chips run on the masked number track, N-F6) | Taps "+10" / "+1" / "−10" … jump chips in order from the start; after each jump **he types the landing** before the next jump is drawn / number keys | Each typed landing against the computed one; the jump sequence lands on the target; the route is recorded as the strategy name. On "in your head" items he **types the final answer first**; the jumps are asked only after that answer is committed, as "show how" | **The tool never computes a landing for him**: a landing is drawn only after he has typed it and it is confirmed; the target is shown as the question, not as a landing. Broken control: a build that prints landings as chips are tapped must fail the model-input gate |
| N-I7 | **Ten-frame fill** | Taps cells to fill; drags counters across two frames to make ten / Space toggles a cell | The frame state against the computed make-ten step | Never show the total as a numeral while the child fills |
| N-I8 | **Math-sentence input with a movable blank** | Builds "□ + 18 = 45" from chips; places the blank; fills it / typed with a shape hint whose numbers are **unrelated to the item and to any number on the first learner's test** (e.g. "20 + 6 = 26" beside that item) | The sentence matches the model built in N-I5; the blank's value | The shape hint never contains the item's key, its blank's value or any of its numbers; gate: a hint that contains the key must fail |
| N-I9 | **Strategy chips** ("which way did you do it?") | Taps one of 3–4 named routes (make ten; tens then ones; jumps; column) | Recorded, not right/wrong; drives the link sentence and the parent's view | None — there is no keyed answer (L41: a probe has no key, so it is never scored) |
| N-I10 | **Reason frame** (one claim per row + typed sentence) | `truth` rows, then `explain`. On error-analysis items: the fix first (committed), then the rows, then the sentence (§2 Step 7) | Rows graded; the sentence read formatively from the item's own rubric (TAD §7) | The true rows must not be the only well-formed ones (L51: measure the blind habit; rows are shuffled and balanced). Rows that state the repair appear only after the fix is committed; rows that apply the idea are preferred to rows that recite a rule (TAD §3.8) |
| N-I11 | **Paper item** ("draw it on paper, then type the number sentence") | Types the sentence; taps "I drew it" | The typed sentence; the drawing is **not** graded and the record says "paper practice done" (DD8) | None |
| N-I15 | **Clock-hands set** (first used Grade 1, G1-U07; moved here from GRADE-3.md §7) | Drags the hour and the minute hand; they snap to the hour and half hour in Grade 1, to 5 minutes in Grade 2, to the minute from Grade 3 / Tab picks a hand, arrow keys turn it, Enter commits | Both hands against the computed time, including where the hour hand sits between two numbers | The digital time is never shown while he sets the hands; on reading items the hands are set and the time is asked |
| N-I16 | **Graph builder** (first used Grade 1, G1-U12; moved here from GRADE-3.md §7) | Grade 1: picture graph, one symbol for one, a key; Grade 2: bar graph to a scale of one and a line plot (an X above a number); Grade 3 on: a key or scale chosen / tap or Enter adds a symbol, arrow keys pick a category | Each category's count against the data; the key or scale chosen; each X above the right value | The data stay in view, but no category total is printed while he builds |
| N-I25 | **Shape compose / partition tool** (first used Grade 1, G1-U03 L2 and L4; T21) | Compose: pieces dragged until they snap edge to edge; partition: straight cuts drawn between snap points on the edge / Tab cycles snap points, Enter cuts, Space shades a part | Compose: the outline matches the target; partition: the number of parts and equal areas (computed by code on the snap grid); the shaded count | Parts are never numbered or labelled on "what fraction" or "are these equal?" items; the target outline is shown, never its pieces. Until N-I25 is built, T21 items are served as `choices` among drawn partitions |

### 6.3 Gates these need (HANDOFF §12; each with a broken control)

- **Picture kind** on every new figure, every surface (lesson, examples, practice, check, puzzle).
- **Model inputs grade what they ask**, on touch and on keyboard, with a fixture that must fail
  (a bar builder that accepts any slot).
- **Spoken lines never give the answer**: the `spoken` field of N-F1…N-F9 names the picture and
  its categories, never the asked-for value (L48 pattern).
- **Answer-giveaway**: for every figure next to an asked step, a check that the asked quantity is
  not countable or readable from the picture (L33); for N-I5, that the item's model is not in
  the DOM before commit.
- **Blind-habit rate** (L51): for comparison items, the answer is not the first thing named, and
  bars are drawn equal before the child decides.
- **Method ledger**: every skill in the grade map has a METHOD-LEDGER row (broken control: a
  ledger fixture with one row removed must fail).
- **Exam coverage**: every skill the first learner's test touched (E240) maps to a unit and a
  chapter-check item type; no exam number on any child-facing surface, and no check or mock item
  reusing a lesson example's numbers or having one as its key (EXAM-COVERAGE §4, with its broken
  controls).
- **Shape hints** (TAD §4 "typed answers state their shape"): no hint contains the item's key, its
  blank's value or any of its numbers, nor any number on the first learner's test (the
  EXAM-COVERAGE §4 list; hints are free to choose, so both tiers apply everywhere); broken
  control: a hint equal to the key must fail.
- **Choice rank** (L43, L53), measured on the four choices the child is shown, over all seeded
  draws of a template. Two measures, each with its broken control:
  (a) *display order*: no displayed position holds the key on more than 40 % of draws; broken
  control: a fixture whose key is always shown second must fail.
  (b) *numeric rank*, for every template whose choices are numbers (whole numbers, fractions,
  mixed numbers, decimals): **no numeric rank — smallest, any middle position, largest — holds
  the key on more than 40 % of the pool's draws**; broken control: a pool whose values all sit
  above the key must fail. One measure covers every position, so a pool that always brackets the
  key (key always in the middle, L43) fails exactly as one that always undershoots. A pool can
  put the key smallest only if three of its values sit above the key, and largest only if three
  sit below; a pool with fewer than two values on either side, or with exactly two on each side,
  reaches at most two ranks and cannot pass. Templates whose choices are sentences, stories, claims, place-value forms or
  pairs have no single numeric rank and are held by (a).

---

## 7. Engineering contract (what Phases 4.5–6 build against)

- **Addressing.** Grade × Unit × Lesson × Item; a unit names its school-chapter lookup and CCSS
  cluster (DD2). No publisher lesson titles.
- **Items** are deterministic templates with a seeded generator; answers and model schemas are
  computed by code; every error-analysis claim is recomputed by a `verifyFor` (HANDOFF §6).
- **Choice order** `[original design]` (L43, L53). The design files list one draw's choices in
  ascending order for reading only; that is never the served order. Two things rotate, and both
  are gated by the choice-rank gate (§6.3). **Display order:** each draw shuffles the four
  choices, and the key's displayed position is rotated by folding the item's answer into the
  shuffle hash (L53). **Numeric rank:** every template whose choices are numbers carries a
  **pool of honest misconception values** — at least four, each made by a named rule applied to
  the item's own numbers and recomputed by `verifyFor` — with values both below and above the
  key. Each draw shows the key and three pool values; the same hash first picks a target rank
  for the key among the ranks the pool can reach (smallest, second, third, largest), then three
  pool values that put it there, so the key's numeric rank rotates from draw to draw. The key
  can be the smallest only if three pool values sit above it and the largest only if three sit
  below, so the seed pools hold three honest values on each side wherever honest values exist
  (all four ranks reachable, a quarter of draws each); where a skill has only two honest values
  on one side (a Grade 1 bond's missing part), the pool reaches three ranks, a third of draws
  each, which is the least the gate passes. No rank — displayed or numeric — predicts the key.
- **Attempt record** (TAD §8): first-try, tries, monotonic time, scaffold visible, every answer
  tried, **plus** the model rung used (read / label / build / unaided), the self-check difference
  flag, the strategy chip, and the ladder rung reached.
- **Skill record:** state (not started / learning / stuck / parked / known / stretch-learning /
  stretch-known), the two qualifying days, the count of practice days since the last clean day
  (the stall rule, §4), the fluency time, the comeback schedule.
- **Check runner:** feedback suppressed; review mode after; score immutable in review.
- **Read-aloud:** on by default Grades 1–2; `spoken` never carries the asked value.
- **Parent page:** skills map, exam-skills map, glossary, one thing to try, every typed
  explanation with its reading.

---

## 8. Compliance map

| Rule or source | Where applied |
|---|---|
| Evidence rule | every E-row citation; everything else `[original design]` |
| TAD §1–§2 knows, not finished | §2 (every "Recorded" line), §4 |
| TAD §3.2–3.4 help ladder, costed fading scaffolds | §2 Steps 3, 5, 6 |
| TAD §3.5 speed recorded, not shown | §2 Step 4, §4 |
| TAD §3.6 schedule by weakness | §2 Steps 6, 9; §5 |
| TAD §3.7 thinking routes; "how did you get it?" | §2 Step 4; N-I9 |
| TAD §3.9 tests hold feedback, then review | §2 Step 8 |
| TAD §3.10 a miss is information | §2 Step 6 |
| TAD §3.11 day = question count | §2 Step 6; DD1 |
| TAD §3.12 parent sees knowing; like-instructor | §4; N-I11 |
| TAD §3.13 pass bar is not a wall; comebacks; every state has a way out | §2 Steps 8–9; §4 stall rule and state list |
| TAD §3.18 fluency time from his own records | §4 fluency-time procedure |
| TAD §3.15 read aloud; reading flag | §2 Steps 1, 8; DD17 |
| TAD §3.17 new input inherits habits | N-I1 |
| TAD §3.19 Check never locked; blank = not yet | §2 Step 6 |
| TAD §3.21 picture kind | §6 (every row) |
| TAD §4 every control grades what it asks; one claim per row | §6.2; N-I10, N-I11 |
| TAD §7 AI reads formatively from the item's own rubric | §2 Step 7; N-I10 |
| HANDOFF §6 child builds the model; touch + keyboard; new figures under the kind gate | §3, §6 |
| HANDOFF §7 no inherited pacing; neutral names; no exam items | §0, §1, legal posture |
| HANDOFF §8 one method per skill; link said aloud; schedule from weakness; exam-skills map | §5, §4 |
| HANDOFF §12 gates | §6.3 |
| L25 elicit, not narrate | §2 Step 2 |
| L27 a field needs a renderer | §6 lists figures as build blockers, not polish |
| L33 helpful figure gives it away | §6 every row |
| L41 a probe has no key | N-I9 |
| L51 blind-habit rate | §6.3; N-I10 |
| L43, L53 fixed rank; the surface the child touches | §7 choice order (display order and numeric rank); §6.3 choice-rank gate, both measures; gates read the rendered input, not the pack |
| L50 a gate's enablement list | EXAM-COVERAGE §4 names every tier-2 surface and the exam-number list's sources |
| REVIEW-2026-11-17 re-check N1, N2, N4 (Fix log 2) | §6.3 numeric-rank measure with its broken control; §7 pools on both sides of the key; §6.3 exam-coverage bullet covers keys; N-I8 example hint |
| TAD §4 typed answers state their shape (never the answer) | N-I8; §6.3 shape-hint gate |
| REVIEW-2026-11-17 B5, F5, F6, F11, F13, F14, A10, A13 | N-I6, N-I8; §7; §2 Step 7, N-I10; §4; §3; N-I15, N-I16, N-I25; N-I3, N-I5; §4 |
| DECISIONS M2, M3, M6 | §3 (Grades 1–5), legal posture |
