# Stage 1, run 2 — build notes (2026-11-21)

Scope: NEXT-STEPS "Next" item 1. Nothing committed, pushed, merged or migrated. No child's
name; no exam value appears here or in code (the exam gate reads EXAM-READING.md at run time).

## Files

Changed
- `frontend/src/modules/best-brains/figures/types.ts` — ADDITIVE: part-whole figure types
  (`BondCell`, `BondShape`, `NumberBondParams` with `childWork?`, `GroupsParams`, `SplitListParams`,
  `MatchRowsParams`, `SceneParams`, `TrackWindowParams`, `PartWholeFigure`, `LibraryFigure`,
  `PART_WHOLE_FIGURE_TYPES`, `isPartWholeFigure`). Deliberately NOT in `BBFigure` / `FIGURE_TYPES`,
  so no Best Brains renderer, pack or gate sees a new member (renderers join at stage 2).
- `frontend/src/modules/best-brains/figures/assert.ts` — ADDITIVE: `checkFigureShape` and
  `figureValue` accept `LibraryFigure` (widened); one early branch routes part-whole figures to
  new `partWholeShape` / `partWholeValue`; `SELECTORS` gains the new kinds. Every Best Brains
  figure takes the old switch unchanged.
- `frontend/src/modules/best-brains/figures/prompt.ts` — ADDITIVE: `partWholeSpoken()`.
- `frontend/src/modules/school-math/types.ts` — figures now come from the library (one
  definition; SM adds only `interaction` and a required `spoken`); `methodLink?` on `SMItem`;
  day / attempt / state types (`SMDayKind`, `SMAttempt`, `SMSkillState`, `SMDaySlot`,
  `SMDayManifest`, `SMDay`).
- `engine/assemble.ts` — `lessonDay`, `practiceDay`, `itemsFromManifest`, `dayManifestHash`,
  blind-habit balance, `fixItAfterShown` / `queueAfterShown` (W1), `lookAgain` (W2), `dayScore`,
  `attemptFrom`, `CHECK_SCREEN_LINES`, `REVIEW_OPENING_LINE`, `LOOK_AGAIN_*`. Run-1 forms unchanged.
- `engine/validator.ts` — `roleAllowed` (exit templates may be starters; comebacks of any
  check / practice / return template), SM-FIGSHAPE (the library's `checkFigureShape` on every
  figure), figure reads through the library shape.
- `engine/units/g1u02.ts`, `engine/units/g1u01-returns.ts` — figures via `lib/figures.ts`;
  `asked` option added (default = run-1 draw) to `l4.sign_decides` (−) and `l6.takeaway_story`;
  `l4.take_away` honours `minPart` (identical draws without it); teacher fixes below.
- `engine/lib/ladders.ts` — new `box` ladder (teacher fix below).
- `frontend/scripts/sm-verify-units.ts` — forced-`asked` variants at 200 seeds; shape-hint check
  and control (o). 94/94.
- `frontend/scripts/sm-dump-unit.ts` — printer moved to `sm-lib-print.ts`; output unchanged
  except figure lines and the teacher fixes.
- `modules/school-math/testing/dump-g1u02-stage1.txt` — regenerated (documented command).

Added
- `engine/scheduler.ts` (comebacks, returns, `weakness()`, previews, fresh draws),
  `engine/mastery.ts`, `engine/lib/figures.ts`, `curriculum/ledgers.ts`.
- Gates: `sm-day-assembly-test`, `sm-mastery-test`, `sm-blind-habit-test`, `sm-exam-value-test`,
  `sm-no-name-test`, `sm-spoken-answer-test`, `sm-ledgers-test`, `sm-readability-test`,
  `sm-lesson-reuse-test`. Helpers (not gates): `sm-lib-sim.ts` (a simulated child walking the
  unit), `sm-lib-corpus.ts` (every Grade 1 surface), `sm-lib-print.ts`. Dump: `sm-dump-days.ts`
  → `testing/dump-g1u02-stage1-run2.txt`
  (`npx tsx scripts/sm-dump-days.ts > ../modules/school-math/testing/dump-g1u02-stage1-run2.txt`).

## Best Brains pack hashes
Every Best Brains pack (all available and shadowed cells) at two seeds, plus each pack figure's
`checkFigureShape` / `figureValue` results, hashed BEFORE the first library edit and AFTER the
last: 236 lines, **identical**. `bb-figure-kind-test`, `bb-figure-render-test`, `bb-verify-packs`
green after the edits.

## tsc
2 runs. Run 1: one error (TS6133, an unused parameter in `buildPlanned`), fixed. Run 2: clean.

## Teaching readings (each with why)
1. Lesson day order: starter → demo → steps → explain → exits. The starter is yesterday's
   review; the demo opens the new idea right before its steps.
2. Lesson N scaling (4–8): starter 1 (2 from N 7), exits 2, steps the rest; explain and a stuck
   re-open each add one (N + 1), as EXEMPLAR §3 does for the explain.
3. "Already knows" (or known) on every lesson skill → one step: the last CPA step that BUILDS a
   model (L3 → `l3.join_bond`), no explain; starter and exits kept. SM-H1: build before abstract.
4. Stall rule re-open: one stuck skill of an earlier lesson re-opens its lesson's concrete step
   (`cpaSteps[0]`), slot records `modelRung` one below the item's (DD6), counted in N.
5. Lesson days avoid the lesson's own demo fact, and the starter, steps and exits use no part
   of 1 (`minPart 2`): a part of 1 is counting on by one, not part-whole (as checks and stories).
6. Practice current share: the lesson just taught gets ceil(current/2), the lesson before the
   rest (L1: all L1; L6: two stories — one join or take-away story, then the paper bond once in
   the unit, else "which bond"). Teacher order lists per lesson are in `JUST` / `PREV`.
7. "Unknown in every position" from L5: the first box item takes the start (□ − p = k).
8. Day order: half the current items, then comebacks and returns, then the rest, preview last.
9. Preview from the practice day after L4 on (it builds on the bonds of 10); cap 2 a unit;
   "never two days running" = not on the module day just before (by local day keys).
10. Returns scale with N (2; 3 from N 10); comebacks capped at 2 in Grade 1 inside them.
11. Return candidates: skills whose lessons are all before the current share, plus earlier
   units' skills, that have a template served as `return` and have been served (or are confirm
   skills). K1, K2, K4, K8, K9, K10 have no `return` template in EXEMPLAR §4, so they never
   return (they come back as comebacks after a miss).
12. Blind-habit balance: missing-part items = empty_part_bond, sub_pad, sign_decides (−),
   box_any_place (places 1–3), takeaway_story, take_away, missing_part_choice, missing_addend_choice.
   Forceable ones alternate smaller / larger with the larger answers capped so that, counting the
   always-larger choice items, at most half are larger. If the always-larger items alone pass half,
   the composer (practice days) first turns a "+" sign item into "−", then swaps the previous
   lesson's always-larger item for its forceable sibling, then turns a current item into a forced
   smaller one. Comebacks and returns are NOT forced (they keep their whole space for fresh
   numbers, W5) and are counted as larger (worst case). A forced smaller part is never 1, and no
   missing-part item on a day is a double (8 − 4: copying the shown part would pass).
   Result: max 50 % over 600 days. Note: some days end with every missing-part item smaller
   (87 of 600, mostly one-item days); the gate holds only the 60 % ceiling.
13. One fact family once a day (a teacher's rule: one answer must not hand over another); W5
   outranks it. Fresh-draw fallbacks, best first: fresh → fresh with a repeated family (marked) →
   met in 21 days ("older", marked, as BB's ComebackKind). Older draws happen only in small spaces
   (count_set, bond_from_split, missing_part_choice): 14 of 1,680 in the gate.
14. Mastery: evidence roles practice / return / comeback; a check pass "is one day's evidence,
   never knows" = a check day may be ONE of the two days, never both, never alone; days are the
   local day key; fluency waived until six times exist, then 1.5 × median of the first six,
   recomputed at the first attempt of each later month, falling ≤ a fifth (rising unlimited);
   preview and placement answers never start a skill and mark "already knows" after two days;
   a return miss resets the qualifying days; park only when stuck and 12 unclean practice days
   (6 + 6), otherwise the event is reported, not applied.
15. `weakness()` state key: "known with a return miss (moved back)" is read before "learning
   with a recent miss" — the miss that moved it back is always recent, and the list puts moved-back
   below plain learning. "Served" = any role but review / preview / placement.
16. Comebacks keyed by item family = template + structural options (place, kind, op, story, dir,
   rule; not the blind-habit `asked`). Practice-miss sources: roles practice / return on a
   practice day, ladder rung 3–4.
17. W2 look again: roles practice / return / comeback only (previews never count against him),
   in the day's order; a rung-4 miss returns as a fresh twin with no "own answer" shown (his
   answer was to other numbers). Lines: "Let us look at this one again. Here is what you wrote."
18. Coverage format codes read as lesson formats (L1 concrete, L3 bond from a set, L7 join, L16
   list); the ledger maps each GRADE-1 item type to templates (`curriculum/ledgers.ts`). Method
   ledger: K5, K7 → B1; K6 → B1, B2; K8 → B2, B16 (B16 names G1-U02 L5 itself).
19. Exam tier 2 enablement list written from EXAM-COVERAGE §4, with lesson-count checks against
   the GRADE files; Grade 1 is on none of it.

## Teacher fixes from reading the dump
- `l4.empty_part_bond` part 1 (the bond, no sign on screen) said "Look at the sign" for w + p;
  it now says `bond.added` ("We are finding a part. A part is smaller."); the sentence part keeps
  "Look at the sign".
- `l5.box_any_place` used the four-facts ladder: "Read the bond" with no bond on screen, and "take
  a part from the whole" when the box IS the whole (□ − p = k). New authored `box` ladder: "Is the
  box a part, or the whole?" · bond shown at rung 2 · "To find a part, take away. To find the whole,
  add." **EXEMPLAR §6 should gain this row (main session; design docs not edited here).**
- Parts of 1 on lesson days ("Take away 1 counter", "10 with part 9") → `minPart 2` on lesson
  starters, steps and exits, and on every forced smaller part.
- Doubles on missing-part items (8 with part 4) let copying the shown part pass → rejected on days.
- Look-again twin seeds were negative numbers (XOR) → unsigned.
- Observed, not changed (spec): a lesson's exit template can repeat its last step (L3 add_pad ×3,
  L5 equals_truth ×3 on a 5-item day) — EXEMPLAR §3 names one exit template for those lessons.

## W1: templates with no twin
None: every template made a fresh-number twin in the gate (29 templates × 40 seeds). The
explain-back fallback (`l2.whole_part_truth` on the item's own fact) exists but never ran.

## Not done, and why
- `sm-no-name-test` fails closed today (MF_NO_NAME_LIST unset) — expected; the owner creates the
  list. Its content half was proven once with a TEMPORARY list holding one nonsense token, in
  the session scratch directory, passed by the env var for that run only.
- No school-math payload builder leaves the device yet; the payload half checks the attempt
  record's keys structurally (allowed set, no name field) and a `childName` fixture fails.
- No item speaks a method-ledger link sentence yet (T-6, enrollment read at stage 5); the gate
  proves the sentence check on a fixture.
- `sm-choice-rank-test`, `sm-shape-hint-test`, `sm-ladder-test`, `sm-answer-entropy-test` remain
  measured inside `sm-verify-units` (as run 1), not as separate scripts; the shape-hint check is
  there now with its control.
- The DB check constraint for comeback source 'practice' is stage 5 (no migration written).
- Practice days after the chapter check reuse lesson L6's share (the next unit is not built).

## Teacher fixes (main session read)
1. `l4.error_take_away` with X = w (bond.whole-as-part): the child's bond shows w in a part
   circle, so the false row "w is a part" was two-faced (S6). On that draw it is replaced by the
   false row "Taking away p leaves w." (`leaves-w`; `verifyFor` recomputes w − p = w → false);
   still 3 true / 3 false, shuffled. X ≠ w unchanged. New validator gate SM-TWOFACE: a truth
   row "N is a part." / "N is the whole." must agree with every bond drawn on the item.
   Control (q) in sm-verify-units: the old row set on an X = w draw fires it.
2. `l5.four_facts` p3 / p4: the unreachable `fact.order-swapped` review ("a − w = b" on a pad)
   is replaced by `sub.added` (w + a on p3, w + b on p4; `verifyFor` gives per-part args).
   New validator gate SM-ENTER: every review answer must be enterable on its part (a number on
   a pad, a typed sentence blank or a bond; a split on the counters; a sentence only on chips or
   paper). Control (p): the old four_facts p3 fires it. The same gate showed one more dead line,
   fixed: `l3.join_bond` p2 (chips a, b, w) carried the numeric counting-slip lines, which cannot
   be built from those chips; p2 now has none (p1, the bond, keeps them).
3. `l4.take_away` has its own `take-away` ladder: "How many at the start? How many go away?" ·
   "Tap the ones that go away." [light-counters-to-take] · "Count the ones still here." ·
   "Here is what is left. Let us read the sentence." [dim-taken-read-sentence].
4. W2 after W1: a first-try miss whose W1 fix-it twin he answered right first try is not a
   look-again candidate; look again moves to the day's next miss (cap 2). A missed twin keeps the
   item a candidate (fresh-number twin). `fixItAttempt()` finds the twin's answer by its id
   (`FX:<the item's stream>`, `-FX-`, same day). sm-day-assembly-test asserts it; control: a
   look-again blind to the twin's result fires.
Seen, not changed (outside the four): `l4.take_away`'s review line for w + p says "Look at the
sign", but that screen shows no sign (counters and an empty pad).
tsc: this change set's third run, clean.

## Fable gate fixes (authenticity gate REJECT, seeds 29 / 9001 / 70001; main session decisions)
1. SM-H10: `l6.which_bond_story` has its own `story-choice` ladder: rung 2 "Here is a bond.
   Where does the question mark go?" [show-empty-bond, nothing placed]; rung 3 text only "Find
   the bonds with both story numbers. Then check where the question mark is." ("question mark"
   spelled out: a "?" inside a sentence splits it in two for the read-aloud and the word count).
   sm-verify-units: on every choice item no rung below 4 has a placing screen
   (place-known-numbers, fill-*, show-one-split-*, ring-answer-*); control (r) the old story ladder.
   Seen, not changed: `l2.which_bond` (a bond choice) uses bond-build rung 3 `place-whole`; it is
   not on the placing list and does not single out the key (two choices keep the whole w).
2. SM-H2: `l4.take_away` p1 is the sentence "w − p = □" (pad), "Tap the ones you take away. Then
   finish the sentence."; `take.added` review and the take-away ladder kept.
3. SM-H2: `l1.split_another_way` gains p2 "Now fill in the sentence." "w is □ and □." (his split
   from p1, as l1.split_any).
4. Heuristic and story check: (a) `l1.split_another_way` prompt "Here is one way to split w. Guess
   a new way. Use different numbers. Then check: do both circles make w?"; (b) l6.join_story and
   l6.takeaway_story (so CK C7 too) end with p4, an ungraded ack "Check it in the story. Does your
   answer fit?" with buttons "Yes, it fits" / "Let me look again" (the second re-opens p3; the ack
   surface carries `lookAgain: { label, reopens }`; the validator checks it re-opens an earlier
   part and is never scored). C7 stays 3 points. l6.paper_bond has no answer part (its graded part
   is the sentence), so no check part there.
5. `sub.subtracted-seen` line: "The box is the whole. The whole is the biggest." (used only on
   box place 4, □ − a = b, where the box is the whole — confirmed).
6. `order.before-after-swap` line: "Before is on the left. After is on the right."
7. W1 twins keep clear of every fact family on the day (`fixItTwinAvoiding`; same seed and stream
   names, so with nothing to avoid it is the old twin); fallback to the old twin is marked
   (`note`). Look-again twins use the same. sm-day-assembly-test: 3,435 twins, 0 clashes;
   control (m) the old twin clashes 1,019 times.
8. D9: the box place, the sign's first sign, the L6 story kind and which_bond_story's kind turn by
   the day (`structureTurn` = practice days before today + an offset from his first logged day),
   not by the day's seed (any seed scheme rotates). Box places turn through 4, 1, 2, 3. The
   per-day "unknown at the start" requirement in sm-day-assembly-test moved to a cross-day check
   (the start comes round with the turn); every child sees ≥ 3 box places over his L5–L6 practice
   days; control (n) the old pinned structure fails for every child. Note: simulated children all
   start on one date, so they share one turn sequence; real children differ by first day.
tsc: this change set's fourth run (result in the report).

## Fable ACCEPT follow-ups
1. `l2.which_bond` has its own `bond-choice` ladder: "Which number is the whole? Do the parts
   make it?" · "Look at the whole circle of each bond." [light-whole-circles] · "Both parts
   together must make the whole. Check each one." · "Here is the bond. Let us read it."
   [ring-answer-bond]. The choice-ladder check now also lists `place-whole` as a placing screen
   and fails rung 2–3 TEXT that tells him to fill / place / put / move / drag on a choice screen;
   control (s) the old bond-build ladder fails on both counts. Audit of every choice template
   (rungs 2–3 text and screens): missing_split_choice (list), which_sentence (four-facts),
   missing_part_choice and missing_addend_choice (missing-part: the empty bond is SHOWN with the
   known numbers, nothing placed), which_bond_story (story-choice), match_more (match), the U04
   preview (teen) — none tells him to place or fill; only l2.which_bond did (fixed).
2. Story frames: three per kind (contexts.ts `STORY_FRAMES`), drawn per item and kept in params:
   join — "There are a X P. b more X come. How many X are P now?" · "a X are P. b more come. How
   many X are there now?" · "The C has a X. Then b more X come. How many X are P now?";
   take-away — the old one · "The C has w X. p go. How many X are P now?" · "w X are P. Then p X
   go. How many X are there now?" (C = the setting's own noun: bowl, pond …). All result-unknown,
   no cue words (no "left", "altogether", "in all"; the main session's example "How many apples
   are left?" was not used, run 1 bans "left" as a cue in the question). sm-verify-units: each
   story template uses every frame on ≥ 15 % of 200 seeds; control (t) one frame only.
3. Check-slot entropy (200 forms; "shown part" = the part he is shown or takes away: A1 p, A3 a,
   B5a p, B5b a, B6 p; A2, B4 and C7 give both parts and have no single one):
   before — A1 p = 2 on 62 %; A3 a = 2 on 62 %; B5a p = 1 on 47 % (key 1 on 34 %); B5b a part of
   1 on 77 % of forms (wholes 3–4 on 43 %); error rules 35 / 33 / 32 % (B6 alone 37 / 33 / 31).
   Changes: (a) the two pooled choice items draw the shown part first, about in thirds, then the
   whole (they were whole-first: p = 2 by structure); A1 and A3 take turns being drawn first
   (they share one small pool); price: whole 10 on about 55 % of A1 / A3 forms (was 31–37 %).
   (b) B5b and B5a (1-point quick sums) are drawn last and ask for parts of 2 or more, not a
   double, first; only when none is left do they fall back to a part of 1.
   after — A1 p 3 / 2 / 4 = 39 / 33 / 29 %; A3 a 2 / 4 / 3 = 39 / 32 / 30 %; B5a p = 1 on 30 %
   (key 2 on 30 %); B5b a = 2 on 32 % (a part of 1 rare); error rules 36 / 33 / 32 % — every rule
   was already ≥ 15 %, so no rotation was added. sm-verify-units measures it: no CK slot key
   constant, no shown part on > 40 % of forms, each error rule ≥ 15 %; controls (u) and (v).
   A1 / A3 sit at 39 % against a 40 % line: the pool has three values, so this check is tight.
tsc: this change set's fifth run (result in the report).

## Opus re-check fixes (7,626 values recomputed; 2 mismatches + teacher findings)
MUST-FIX
1. Balloons join verb "are blown up" (read as "popped") → "are tied on". Every story sentence now
   names its thing (the two noun-less frames used "N more come" / "N go"; both now use the setting's
   own sentence with the noun). Scan of every frame × setting for a verb a child could read as the
   other operation — join: come (ducks), land (birds), are put in (apples, shells, fish), sail in
   (boats), are stuck on (stickers), are tied on (balloons); take-away: swim away, fly away, are
   eaten, sail away, fall out, are taken out, are peeled off, pop — none reads as the opposite now.
   Gate: both story sentences name the thing (800 draws); control (z).
2. Chapter check variety. Measured top fact-family share per row over 200 forms (before → after):
   A1 29 → 21 %, A2 23 → 17 %, A3 32 → 21 %, B4 17 → 21 % (7 families now: no doubles, item 8),
   B5a 18 → 23 %, B5b 21 → 19 %, B6 18 → 18 %, C7 13 → 14 %. Why the gate seeds looked fixed: the
   last weighting pushed the one p = 4 fact (10 = 4 + 6) to ~30 % of A1 / A3, and A2 was drawn
   after five rows that use the same seven non-double families. Fixes: the 2-point rows are drawn
   in an order shuffled by the seed (fallback to the old safe order if a shuffle cannot be
   completed); A1 / A3 shown-part weights 39 / 43 / 18 (p 2 / 3 / 4). At the three gate seeds A2
   still lands on 8 = 6 + 2 drawn cold (A2's own stream: seed 29's first candidate 7 = 5 + 2 was
   taken by A1, the next is 8 = 6 + 2; 70001's first candidate is 8 = 6 + 2) — over 200 forms that
   family is on 17 %. Gate measure (replacing "no key constant"): no fact family on > 25 % of a
   row's forms where its pool has ≥ 5 families; shown-part line 40 %, 50 % for A1 / A3 (three shown
   parts over seven facts 4 / 2 / 1: under 40 % for p = 2 pushes 10 = 4 + 6 over 25 %; the family
   line was made primary). Control (u). AND `chapterCheck(unit, seed, priorForms, recent)` never
   repeats an item served in the last 7 local days (same template, same numbers; `recentServed`);
   practice may share families. The sim draws the check with his real history. Day gate: 60
   checks, 480 rows, 0 repeats; control: a form copying a box item served 3 days earlier fails.
3. Entry pairs never share their numbers; match_more's row with more is top on one item, bottom
   on the other (`keyRow` option, default = run 1). one_more_less keeps one direction per pair.
4. Placement: never a double; a whole of 5 or more when one is free.
5. W1 twin and the day's families: the engine's `fixItAfterShown(item, dayItems)` already avoided
   them (family = whole + sorted parts for every template); the dump and the corpus called it
   WITHOUT the day's items. Fixed; control (o) on a missing-addend vs sum pair: the old twin lands
   on 10 = 4 + 6 14 times in 200, the new 0.
SHOULD-FIX
6. Review-line collisions keep ONE line by priority (bond.repeat-shown > bond.whole-as-part >
   box.copy-seen > count.* > the rest); `reviewRules(..., 'drop-both')` is run 1's, kept for the
   control (y). Gate: every empty_part_bond draw (600) has a line for the shown part (when it is
   not the key) and for the whole.
7. `sub.subtracted-seen` = |k − p| (never 0); it needs the box's `seen` input, so it no longer
   collides with the error item's shown answer.
8. join_bond and add_pad (the add ladder: "start at the bigger part") draw no doubles.
9. split_another_way: "Do not use a and b again." (the numbers filled).
10. L1 words: new rule `count.stop-short-split` "Count on again. Stop at the number we split."
   (same act as count.stop-short, in SAME_ACT) on l1.list_splits; list ladder rung 3 "Each row
   makes the number we split. Count on from the first." (ladders stay number-free).
11. The list figure says "a list of the ways to split 6" (library `partWholeSpoken`; the number is a given).
12. "Finish the four facts of the bond."
13. `story.wrong-operation` line: "Look at the bond. Is the whole missing, or a part?"
14. B5a / B5b never a double, also in the part-of-1 fallback.
15. which_bond_story take-away choices whose whole is off by one: new rule `bond.whole-off-by-one`
   (line "How many were there at the start?"); `bond.sum-off-by-one` keeps the part-sum slips.
NOT CHANGING (main session): rung 1 "What is the whole? Which part is hidden?" on sentence items;
one_more_less direction per pair; bonds of ten crowding; the "Look at the sign." voice clone.
OWED TO STAGE 5: a speech form for symbols (− "take away", □ "what number", = "is the same as")
with a gate.
tsc: this change set's sixth run (result in the report).
