# EXEMPLAR G1-U02 — Number bonds; + and − within 10 (the Grade 1 exemplar unit)

**Written 2026-11-20, 18:05 EST (from `date`), by the engineering lead and expert teacher (Opus),
under DECISIONS M21. Status: spec, no code.** It plays for Grade 1 the part ENGINE-SPEC §7 plays for
Grade 2: every template, rule, ladder, day and check the engine must serve for one unit, proven
through both gates before any other unit is built (L23; BUILD-PLAN stage 1).
**Sources, in order:** GRADE-1.md (U02 lesson table, §4.1 expanded unit and G1-U02-CK, §7 band
notes) → METHODOLOGY-MODEL §2–§4, §6, §7 → DESIGN-DEFAULTS DD1, DD3, DD8–DD11, DD14–DD17, DD24 →
ENGINE-SPEC §2–§6 → METHOD-LEDGER B1, B2 → TAD (the skill). No child's name; no exam item.

---

## 1. The unit card

| Field | Value |
|---|---|
| id · title | `G1-U02` · Number bonds; + and − within 10 |
| Beside | the school's Grade 1 chapter 2, addition and subtraction within 10 (bonds open the chapter, E49) |
| CCSS | 1.OA.A.1 · 1.OA.B.3–4 · 1.OA.C.5–6 · 1.OA.D.7–8 |
| Lessons | 6 (L1 split · L2 bond · L3 add · L4 subtract · L5 four facts and "=" · L6 stories) |
| Model built · rung | number bond from a split set · **build** |
| Heuristic | guess and check (named in L1's "another way" and L6's check step); make a list in L1 |
| Number range | wholes 2–10; parts 1–9 (no 0 part in this unit; 0 + 10 arrives with G1-U04 L4) |
| Days (PACING-GUIDE) | 13: six lesson days, six practice days, one check day (review follows the check) |
| Person names | **none**: stories use things and animals, error items say "a child wrote" (keeps the no-name gate's surface empty by design) |

**Lesson examples (the teacher's demos; fixed, authored, never drawn by the generator).**

| Lesson | Demo | Facts it fixes |
|---|---|---|
| L1 | 6 counters split, "how else?" → 2 and 4, 1 and 5, 3 and 3 | 6 = 2 + 4 · 6 = 1 + 5 · 6 = 3 + 3 |
| L2 | 5 counters split into 2 and 3 → the bond | 5 = 2 + 3 |
| L3 | 3 and 4 put together → 3 + 4 = 7 | 7 = 3 + 4 |
| L4 | 7 counters, 3 taken away → 7 − 3 = 4 | (7, 3, 4) |
| L5 | the bond 7, 3, 4 → its four facts; 7 = 3 + 4 read "is the same as" | (7, 3, 4) |
| L6 | 5 birds, 3 more come (8); 9 apples, 4 eaten (5) | (8, 5, 3) · (9, 4, 5) |

**Local reuse rule (stricter than CURRICULUM-MAP §7.12, which exempts Grade 1 facts):** no
entry-check, placement or chapter-check item uses a demo's exact fact — the same three numbers in
the same structure (e.g. whole 7 with shown part 3). Keys may repeat (within 10 they must). Practice
and return items may use any fact. `sm-lesson-reuse-test` runs in this Grade 1 mode.

---

## 2. Skills (10)

| Skill | Kind | Lesson | Earned on (DD9) | Fluency kind |
|---|---|---|---|---|
| K1 splits a number to 10 into two parts | model | L1 | `l1.split_any`, `l1.split_another_way` | model-long |
| K2 lists the ways to split a number in order | solve | L1 | `l1.list_splits`, `l1.missing_split_choice` | standard |
| K3 builds a bond: the whole in the whole circle | model | L2 | `l2.bond_from_split`, `l2.bond_given` | model-long |
| K4 matches a bond to its picture or sentence | solve | L2, L3 | `l2.which_bond`, `l3.which_sentence` | standard |
| K5 adds within 10 by putting the parts together | solve | L3 | `l3.join_bond`, `l3.add_pad`, `l4.sign_decides` (+) | standard |
| K6 finds a missing part; subtracts within 10 | solve | L4 | `l4.empty_part_bond`, `l4.sub_pad`, `l4.missing_part_choice`, `l4.sign_decides` (−), `l5.box_any_place` | standard |
| K7 writes the four facts of one bond | solve | L5 | `l5.four_facts` | standard |
| K8 reads "=" as "is the same as" and judges sentences | solve | L5 | `l5.equals_truth`, `l5.missing_addend_choice` | standard |
| K9 builds the bond for a join or take-away story | model | L6 | `l6.join_story` (bond part), `l6.takeaway_story` (bond part), `l6.which_bond_story` | model-long |
| K10 explains a take-away mistake (whole and parts) | explain | L4, L6 | `l4.error_take_away` (fix + rows) | model-long |

Story answers (the third part of `l6.*_story`) earn K5 or K6 by any sound method (DD9).

---

## 3. The days (decision T-2: lesson day N = 5, practice day N = 8 in Grade 1)

**Lesson day** (one lesson; the teacher's demo comes first and is not counted in N):

| Slot | Count | Source | Role |
|---|---|---|---|
| starter | 1 | the Entry-check line for L1–L2 (U01 skills); from L3 on, the previous lesson's exit template | `starter` |
| steps | 2 (3 on L4 and L6) | the lesson's CPA templates in order: step 1 concrete, step 2 the built model (L4: `l4.empty_part_bond`, so the child always builds before the abstract step, SM-H1). On **L4 and L6** a third step is the explain item (`l4.error_take_away`; on L6 in its story form), so the explain lands on alternate lesson days (DD1 note) and those two days run **N + 1** (6 at the default; the Settings help says so) | `step` (rung recorded) |
| exit | 2 | the lesson's key point, unaided (the ladder is still there; its use is recorded). Exit templates per lesson: L1 `l1.missing_split_choice` · L2 `l2.which_bond`, `l2.whole_part_truth` · L3 `l3.add_pad` · L4 `l4.missing_part_choice` · L5 `l5.equals_truth` · L6 `l6.which_bond_story` | `exit` |

- The **demo** is a scripted screen: the teacher asks, the child acts on the demo's own objects
  (elicit, not narrate, L25), nothing graded. It is "seen" per content version; a "Show me how"
  button replays it on every later item of the lesson (TAD §3.16).
- **The entry check is its own short sitting** (day kind `entry`, before the L1 lesson day, §7).
  DD3's "a clean pair skips that idea's concrete step" applies only where a pair tests the lesson's
  own idea; G1-U02's pairs test U01 prerequisites, so in this unit a clean pair skips no step and a
  failed pair opens the named U01 lesson. The L1–L2 starters are fresh draws of the same templates.
  A skill marked "already knows" (two right preview / placement-confirm first tries on separate
  days) cuts the steps to one.
- A **stuck** skill (stall rule) re-opens its lesson's concrete step one rung lower on the next lesson
  day (METHODOLOGY §4).

**Practice day** (N = 8; GRADE-1 §4.1's 10-item anatomy in the same shares):

| Share | Items | Rule |
|---|---|---|
| current | 5 | the lesson just taught and the one before; from L4 on, adds and take-aways side by side (E90); from L5 on, the unknown in every position; from L6 on, one or two stories |
| returns | 2 | due comebacks first (**at most 2 a day in Grade 1**, so new learning is not crowded out; ENGINE §4.4's cap of 3 applies from Grade 2), then the weakest earlier skills by `weakness()` (U01 and, for a placed-out child, confirm returns) |
| preview | 0–1 | `preview.g1u04.ten_and_some`, labelled "try a new one", at most 2 in the unit, never two days running; else the slot goes to current |

**Blind habit across the day.** `l4.missing_part_choice` and `l5.missing_addend_choice` always ask
for the larger part (their pools need it). The day assembler therefore serves `l4.empty_part_bond`,
`l4.sub_pad` and `l5.box_any_place` with the asked part the smaller one on about half their draws,
and `sm-blind-habit-test` measures "the answer is bigger than the shown part" over a whole practice
day's items (not per template): no more than 60 % of a day's missing-part items.

"Knows" is earned only on practice days and returns (TAD §2). "Question k of 8" on every screen; a
rest offered after 8, never a stop.

**Reviewing wrong work (BUILD-PLAN §13).** After any item whose ladder reached rung 4, a same-template
twin at a fresh seed follows at once (W1; never "knows" evidence). The practice day closes with
**"Look again"**: up to 2 of the day's first-try misses, his own answer shown, the question read
again, one more go (W2; role `review`; not in N; skipped if he takes the rest). First-try misses that
needed rung 3 or 4 join the comeback pool (W3).

**Check day:** G1-U02-CK (§7), feedback held; the **review of misses** follows at once (or first
thing next day if the child rests); every miss enters the 2 / 7 / 21 comeback pool.

---

## 4. Templates

`sm.g1u02.<lesson>.<name>`. **Figures:** `bond` = N-F1; `groups` = two fixed shapes each carrying its
number (an extension of `counters`; nothing countable, L33); `counters` = countable counters, used
**only where counting is the step** (L1 split, L4 take-away concrete, U01 count). **Surfaces:** N-I2
bond, N-I4 split, N-I8 sentence, `pad`, `choices`, `truth`, N-I11 paper. "Lesson-only" templates
are never served on practice, return, check or placement days.

### L1 — split a set into two parts

| Template | Parts · surface · figure | Draw | Key / grading | Pool or claim rules | Skill · use |
|---|---|---|---|---|---|
| `l1.split_any` | (1) N-I4 on `counters` w; (2) N-I8 "w is □ and □" | w 3–10 | (1) both parts ≥ 1 and sum to w (any split); (2) his own split | — | K1 · step, practice |
| `l1.split_another_way` | N-I4; one split already shown as `groups` (a, b); prompt "Use different numbers." | w 4–10; shown a ≠ b | a pair ≠ {a, b} in either order, summing to w | review line names `split.same-pair` when he repeats {a, b} | K1 · step, practice |
| `l1.list_splits` | "Make a list": rows 1 and □ … (w−1) and □, two to three rows open, pad per row | w 4–7 | each open row = w − first part | `count.stop-short`, `count.start-counted` (review line) | K2 · step, practice |
| `l1.missing_split_choice` | T1: the ordered list with one row missing; "Which way is missing?" four pair choices | w 5–8 | the missing pair | distractors: a pair summing to w − 1, one summing to w + 1 (`bond.sum-off-by-one`), a pair already listed (`split.same-pair`) | K2 · practice, exit |

### L2 — build a number bond

| Template | Parts · surface · figure | Draw | Key / grading | Pool or claim rules | Skill · use |
|---|---|---|---|---|---|
| `l2.bond_from_split` | (1) N-I4 split; (2) N-I2 **build**: three empty circles, he taps which is the whole, then fills all three | w 3–10 | (1) as L1; (2) orientation (the whole circle chosen) + whole = w + parts = his split | `bond.whole-as-part` (orientation miss, named in review) | K3 · step, practice, return (the K3 evidence item) |
| `l2.bond_given` | words "w things: a here, b there" + `groups` a, b; N-I2 build | w 3–10, a + b = w | orientation + three values | `bond.whole-as-part` | K3 · step only (the numbers are given, so it is weak "knows" evidence) |
| `l2.which_bond` | T1: "Which bond shows w?" four drawn bonds | w 4–10 | whole w at the top, parts summing to w | `bond.whole-as-part` (w in a part circle), `bond.sum-off-by-one` (parts sum w ± 1, whole w) — sentence-type choices, display order only | K4 · practice, exit, check |
| `l2.whole_part_truth` | `truth`, 4 rows from a pool of 6 ("w is the whole", "a is a part", "a is the whole", "w is a part" …), 2 true + 2 false, shuffled | w 4–10, **a ≠ b** (else "a is the whole" = "b is the whole" and the pool collapses) | each row by rule | L51 balance | K3 · exit, practice |

### L3 — add by putting the parts together

| Template | Parts · surface · figure | Draw | Key / grading | Pool or claim rules | Skill · use |
|---|---|---|---|---|---|
| `l3.join_bond` | `groups` a, b; (1) N-I2 bond, whole empty (the asked circle empty, N-F1); (2) N-I8 "a + b = □" built from chips | a + b ≤ 10, a, b ≥ 1 | whole = a + b; the sentence matches the bond (either order) | `add.count-first-twice` (a + b + 1), `add.stop-short` (a + b − 1) review lines | K5 · step, practice, return |
| `l3.add_pad` | T8 `pad` "a + b = □" | as above | a + b | as above | K5 · step, practice, return, exit, check |
| `l3.which_sentence` | T1 (CK A2 shape): bond w (a, b); four sentences | a ≠ b | "a + b = w" | `bond.whole-as-part` ("w + a = b"), `sub.bigger-than-whole` ("larger − smaller = w", e.g. GRADE-1's "5 − 3 = 8"), `add.part-from-sum` ("b + w = a") | K4 · practice, check |

### L4 — subtract: take away, or find the missing part

| Template | Parts · surface · figure | Draw | Key / grading | Pool or claim rules | Skill · use |
|---|---|---|---|---|---|
| `l4.take_away` | `counters` w; he taps p to take away (they dim); `pad` "how many are left?" | w 4–10, p 1..w−1 | w − p | `sub.added` (w + p) review line | K6 · step (lesson-only: counting is the step) |
| `l4.empty_part_bond` | `bond` w with part p, the other part empty; (1) N-I2 the part; (2) N-I8 "w − p = □" | w 3–10 | w − p | `bond.repeat-shown`, `bond.whole-as-part`, `sub.added`, `count.stop-short`, `count.start-counted` (review lines) | K6 · step, practice, return, placement |
| `l4.sub_pad` | T8 `pad` "w − p = □" | w 3–10 | w − p | `sub.added` | K6 · practice, return, check |
| `l4.missing_part_choice` | T1 (CK A1 shape): `bond` w, p, empty; four number choices | **p is the smaller part: 2 ≤ p, 2p ≤ w − 2** (so two honest values sit below the key; w 6–10) | k = w − p | pool (five honest values): p (`bond.repeat-shown`), k − 1 (`count.stop-short`), k + 1 (`count.start-counted`), w (`bond.whole-as-part`), w + p (`bond.added`); two below, three above → three ranks reachable, a third each (METHODOLOGY §7) | K6 · practice, exit, check, placement |
| `l4.sign_decides` | T8 mixed set: + or − by draw, balanced across the day | a + b ≤ 10 | per draw | `sub.added`, `add.subtracted` | K5, K6 · practice, return |
| `l4.error_take_away` | T12 (Grade 1 form): "A child wrote w − p = X." The child's work is also **shown as a figure**, the child's bond (whole w, parts p and X), not only as a sentence (CURRICULUM-MAP §7.15). (1) `pad` the right answer (the fix); (2) `truth` rows, **drawn only after (1) is committed**: 3 true, 3 false, shuffled. On L6 the same item is told as a short take-away story | w 5–10, **p 2..w−1** (at p = 1, `count.start-counted` and `bond.whole-as-part` both give X = w and the rule could not be named), X made by one named rule of {`sub.added`, `count.start-counted`, `bond.whole-as-part`} | (1) w − p; (2) rows by rule. True: "w is the whole" · "taking away leaves less than w" · and one row that engages X: when X > w, "X is more than w, so it cannot be what is left"; when X ≤ w, "p and X together make more than w" (true for X = k + 1 and X = w). False: "w is a part" · "the − sign means put together" · "p is the whole" | `verifyFor` recomputes X from its rule and every row's truth from w, p, X | K10 · step (L4, L6), practice, check |

### L5 — four facts; "=" is "is the same as"

| Template | Parts · surface · figure | Draw | Key / grading | Pool or claim rules | Skill · use |
|---|---|---|---|---|---|
| `l5.four_facts` | `bond` w (a, b), a ≠ b; four N-I8 sentences, one blank each: a + b = □ · b + a = □ · w − a = □ · w − b = □; one part per sentence, advanced by the main button | w 3–10 | w, w, b, a | `fact.order-swapped` (review line when he writes a − w) | K7 · step, practice, return |
| `l5.equals_truth` | `truth`, 4 rows from a pool of 6: "w = a + b" · "a + b = b + a" · "w − a = b" (true); "a − w = b" · "w = a − b" · "a + b = w + 1" (false); 2 + 2, shuffled | w 4–10, a ≠ b | rows by rule | L51 balance; `fact.order-swapped` | K8 · step, practice, exit |
| `l5.box_any_place` | N-I8 with the blank in one of four places: a + □ = w · □ + b = w · w − □ = b · □ − a = b; the shape hint uses numbers unrelated to the item (e.g. "2 + 1 = 3" never beside an item with 1, 2 or 3) | w 3–10, place balanced | the blank | `box.copy-seen` (a number already in the sentence), `bond.added` (w + a); on the unknown-start form □ − p = k, `sub.subtracted-seen` (k − p, takes away the two numbers seen; GRADE-1's "6 − 3 = 3") | K6, K8 · step, practice, check |
| `l5.missing_addend_choice` | T1 (CK A3 shape): "Which number makes a + □ = w true?" | **w 6–10; 2 ≤ a, 2a ≤ w − 2** | k = w − a | pool: a (`box.copy-seen`), k − 1 (`count.stop-short`), k + 1 (`count.start-counted`), w (`bond.whole-as-part`), w + a (`bond.added`) | K8 · practice, check |

### L6 — join and take-away stories

Every story runs DD17's routine: read aloud → "tell it back" (an `ack` "I know what it says", never
graded) → what is asked (the ladder's rung 1) → the bond labelled → the answer checked in the story.
Two story sentences and one question; ≤ 10 words a sentence; no key-word teaching.

| Template | Parts · surface · figure | Draw | Key / grading | Pool or claim rules | Skill · use |
|---|---|---|---|---|---|
| `l6.join_story` | `groups` a, b in the scene; (1) N-I2 bond with "?" placed by him (the whole); (2) N-I8 sentence; (3) `pad` the answer | a + b ≤ 10, setting from §8 | (1) "?" in the whole, a, b as parts; (2) a + b = □ (either order); (3) a + b | `story.wrong-operation` (|a − b|) | K9 (1), K5 (3) · step, practice, check |
| `l6.takeaway_story` | `groups` w (one shape, carrying w) and the taken-away count in words; (1) N-I2 bond: w the whole, p a part, "?" the other; (2) N-I8; (3) `pad` | w 4–10 | w − p | `story.wrong-operation` (w + p) | K9 (1), K6 (3) · step, practice, check |
| `l6.which_bond_story` | T1: "Which bond fits the story?" four bonds | either story kind | the bond with "?" in the right circle | `story.unknown-in-wrong-circle`, `bond.whole-as-part`, `bond.sum-off-by-one` | K9 · practice, exit |
| `l6.paper_bond` | N-I11: "Draw a bond for this story on paper." Tap "I drew it", then the sentence by chips | as `l6.join_story` | the sentence only; the record says "paper practice done" (DD8) | — | K9 (sentence) · once in the unit, practice |

### Outside the unit (built with it, BUILD-PLAN stage 1b)

| Template | What | Skill · use |
|---|---|---|
| `g1u01.l1.count_set` | `counters` 4–10, scattered; he taps each (it dims), then `pad` "how many?"; rules `count.double-touch` (+1), `count.skip` (−1) | U01 · entry check, return |
| `g1u01.l3.match_more` | N-F8 two rows matched one to one, nothing ringed; one row spread out; "Which row has more?" tap a row; the spread row is the bigger on half the draws and named first on half (L51) | U01 · entry check, return |
| `g1u01.l4.one_more_less` | number track window; "What comes just before n?" / "just after"; `pad`; rule `order.before-after-swap` | U01 · entry check, return |
| `preview.g1u04.ten_and_some` | "Which picture shows 10 and n?" (spoken: "ten and n"); four **picture** choices: a full ten frame + n (the key), a full frame + n − 1 and + n + 1 (`teen.count-slip`), and n alone (`teen.ones-only`). Picture choices have no numeric rank, so the choice-rank gate holds it by display order only, declared in the gate's list with the reason printed (L50). n 2–8 | U04 preview |

---

## 5. Misconception rules (`engine/lib/misconceptions.ts`; each a pure function with a `verifyFor`)

| Rule id | What the child does | Value | Side |
|---|---|---|---|
| `bond.repeat-shown` | writes the part he can see in the empty part | p | below (p is the smaller part) |
| `bond.whole-as-part` | puts the whole in a part's place (or picks a bond with the whole in a part circle) | w | above |
| `bond.added` | adds the whole and the shown part | w + p | above |
| `bond.sum-off-by-one` | a bond whose parts make one more or one fewer than the whole (a counting slip) | parts summing to w ± 1 | — (bonds) |
| `count.stop-short` | counts on from the part and stops one word before the whole | k − 1 | below |
| `count.start-counted` | counts on with the start counted as the first word | k + 1 | above |
| `add.count-first-twice` | counts all and counts the first object twice | a + b + 1 | above |
| `add.stop-short` | counts on and stops one early | a + b − 1 | below |
| `add.subtracted` | takes away on a + item | \|a − b\| | below |
| `add.part-from-sum` | a sentence with a part equal to whole + part (claim row / choice) | — | — |
| `sub.added` | adds whenever two numbers appear | w + p | above |
| `sub.bigger-than-whole` | a take-away whose answer is bigger than its start (claim row / choice) | — | — |
| `box.copy-seen` | copies a number already in the sentence into the box | a | below |
| `sub.subtracted-seen` | on □ − p = k, takes away the two numbers he sees | k − p | below |
| `fact.order-swapped` | "w − a = b, so a − w = b" | claim | — |
| `split.same-pair` | gives the shown split again (or its turnaround) as "another way" | {a, b} | — |
| `story.wrong-operation` | takes away in a join story, adds in a take-away story | \|a − b\| or w + p | either |
| `story.unknown-in-wrong-circle` | puts "?" in a part when the whole is asked, or the reverse | bond | — |
| `count.double-touch` · `count.skip` · `order.before-after-swap` · `teen.count-slip` · `teen.ones-only` | U01 / U04 rules for the outside templates | as named | — |

A pool value with no rule is not allowed (L34); authors look for the identity before reframing (L36).
Values that collide with the key or each other on a draw are dropped by the generator and redrawn.
**Each rule's honest condition** is in its code (e.g. `bond.repeat-shown` is below the key only when
p < k, which the `l4.missing_part_choice` draw guarantees); `sm-verify-units` checks every drawn pool
against it.

---

## 6. Ladders (four rungs, number-free, the same at every seed)

| Family | Rung 1 · what it means | Rung 2 · use what you know | Rung 3 · a way to finish | Rung 4 · the answer |
|---|---|---|---|---|
| split | "How many in all? Move some to the other circle." | the two circles light up | "Both circles together must still have all of them." | one split shown, the bond filled |
| bond build | "Which circle holds everything?" | the whole circle is lit | the whole is placed for him | the bond filled |
| missing part / take-away | "What is the whole? Which part is hidden?" | the empty bond appears (or lights up) with the known numbers | "Start at the part you know. Count on to the whole." | the bond filled, the sentence read |
| add | "Are we putting together or taking away?" | the empty bond appears with both parts | "Start at the bigger part. Count on the other part." | the whole filled, the sentence read |
| four facts / "=" | "Read the bond: the whole, then the parts." | the bond is lit beside the sentence | "Two parts make the whole. Take a part from the whole." | the sentence filled |
| truth rows | "Read one row. Look at the bond." | the bond is lit | "The whole is the biggest number in the bond." | each row marked |
| story | the story read again; "What do we want to find?" | an empty bond with "?" to place | the known numbers placed in the bond | the bond and the sentence filled |
| error | "What was the whole? What was taken away?" | the empty bond with the whole and the part taken | "What is left must be less than the whole." | the right answer and its bond |

No rung below 4 contains a key (`sm-ladder-test`); rung 1 is always an orienting question. A repeated
answer repeats the last clue (S6); a re-check of the same answer is not a new try (TAD §3.19).

**Spoken lines.** Every prompt, figure `spoken`, ladder rung and review line is read aloud (Grade 1);
≤ 10 words a sentence; the `bond` figure says "a number bond: a whole and two parts", never a value it
asks for; `groups` say "two groups" (their numbers are printed and read only where they are givens).

---

## 7. Checks

**Entry check G1-U02-EC (DD3; GRADE-1's line):** its own short sitting (day kind `entry`, role
`entry`), before the L1 lesson day; three pairs, read aloud, feedback held: count a set to 10
(`g1u01.l1.count_set` × 2) · one more and one less (`g1u01.l4.one_more_less` × 2) · more or fewer by
matching (`g1u01.l3.match_more` × 2). Per pair: holds / does not hold / unclear. A failed pair opens
the named U01 lesson first (for a child placed into U02 directly); a clean pair skips no U02 step (§3)
and is recorded as a confirm return for U01.

**Placement pair for U02 (BUILD-PLAN §6):** `l4.empty_part_bond`, part (1) only (the missing part
typed into the bond), × 2 at the placement seed, role `placement`. A typed answer, not a choice: a
guessing child must not place out of the unit's core skill (on two four-way choices a guess places
out one time in sixteen).

**Chapter check G1-U02-CK** — GRADE-1 §4.1's blueprint, each row served by a template at the check
seed (fresh form for any re-sit; never a demo fact, §1):

| § · pts | Template | Format | Skill | Note |
|---|---|---|---|---|
| A1 · 2 | `l4.missing_part_choice` | T1 + bond | K6 | five-value pool, three ranks |
| A2 · 2 | `l3.which_sentence` | T1 | K4 | sentence choices |
| A3 · 2 | `l5.missing_addend_choice` | T1 | K8 | five-value pool, three ranks |
| B4 · 2 | `l3.join_bond` (bond: parts given, whole empty; then the sentence) | N-I2, N-I8 | K3, K5 | 1 the whole, 1 the sentence |
| B5a · 1 | `l4.sub_pad` | T8 | K6 | — |
| B5b · 1 | `l5.box_any_place` with the blank first in a take-away (□ − p = k) | T8, N-I8 | K6, K8 | unknown start |
| B6 · 2 | `l4.error_take_away` | T12, `truth` | K10 | 1 the fix, 1 the rows (all 6 rows right = 1 point; rows appear only after the fix) |
| C7 · 3 | `l6.join_story` | T17 | K9, K5 | 1 the bond, 1 the sentence, 1 the answer |

15 points. "Concepts and procedures" = A1–B5b, C7; "reasoning" = B6 (DD11; the module's categories,
not the school's). The end screen shows counts ("12 of 15 points", "7 of 8 questions") to the child
and grown-up; the review walks each missed part with the ladder, one re-attempt, `review:` answers,
the score unchanged.

---

## 8. Story settings (cross-unit ledger)

G1-U02 owns: ducks on a pond (GRADE-1's C7), birds on a fence, apples in a bowl, boats at a dock,
shells in a bucket, fish in a tank, stickers on a page, balloons at a party. Later Grade 1 units may
not reuse these as a set (`sm-cross-unit-test`, L35); a setting's nouns go through `countNoun`
(singular for 1).

**Note for the authenticity judges:** the generator draws fresh facts and never a demo's fact on a
check (§1), so GRADE-1 §4.1's printed numbers (e.g. A2's 8, 5, 3, which is also the L6 demo) will not
appear on generated check forms. That is by design, not a defect.

---

## 9. Coverage ledger (GRADE-1's U02 item-type column → templates)

| Lesson | Item types (GRADE-1) | Served by | Deferral |
|---|---|---|---|
| L1 | N-I4; L1; L16 make a list | `l1.split_any`, `l1.split_another_way`, `l1.list_splits`, `l1.missing_split_choice` | — |
| L2 | L3; N-I2; T1 "which bond shows 7?" | `l2.bond_from_split`, `l2.bond_given`, `l2.which_bond`, `l2.whole_part_truth` | — |
| L3 | L7; T8; T1 | `l3.join_bond`, `l3.add_pad`, `l3.which_sentence` | — |
| L4 | N-I2; T8 | `l4.take_away`, `l4.empty_part_bond`, `l4.sub_pad`, `l4.missing_part_choice`, `l4.sign_decides`, `l4.error_take_away` | — |
| L5 | `truth`; T8 | `l5.four_facts`, `l5.equals_truth`, `l5.box_any_place`, `l5.missing_addend_choice` | — |
| L6 | T17; N-I2, N-I8 | `l6.join_story`, `l6.takeaway_story`, `l6.which_bond_story`, `l6.paper_bond` | — |

Debt at the start: 0.

---

## 10. Definition of done (BUILD-PLAN stage 1)

1. `sm-verify-units` green on G1-U02 and the four outside templates at 200 seeds: 0 throws, 0
   invalid; every BUILD-PLAN stage-1 gate green; every broken control seen to fire.
2. The authenticity gate ACCEPT and the adversarial re-check with no hard-gate FAIL, at three
   independent seeds (checked for independence first, L45); the planted broken unit REJECTED with
   its three defects cited.
3. An Opus teacher-persona run (Grade 1 teacher, Singapore-trained) over the generated unit — keys,
   pools by rule, truth rows, wording, ladders, the check — with a code recompute: 0 mismatches.
4. The owner has read the dump of one lesson day, one practice day and the check at two seeds.
5. Only then: the authoring kit and the Grade 1 validation wave (BUILD-PLAN stage 7).

---

## Compliance map

| Rule or source | Where applied |
|---|---|
| GRADE-1 U02 rows, §4.1, §7 | §1, §4, §7, §9 |
| METHODOLOGY §2 loop, §3 (no bars in Grade 1), §4 knows / stall, §6 N-F1, N-F8, N-I2, N-I4, N-I8, N-I10, N-I11, §7 choice order | §2–§7 |
| DD1 (N, lesson-day anatomy), DD3, DD8, DD9, DD10, DD11, DD14 (METHOD-LEDGER B1–B2 links, T-6), DD15, DD17, DD24 | §2, §3, §4, §7 |
| ENGINE-SPEC §2 reuse, §3.3 validations (`bond-parts`, `sentence-match`, `paper-ack`), §3.4 verifyFor, §3.5, §4.2–§4.8, §6 gates | §4–§7, §10 |
| CURRICULUM-MAP §7.12 (made stricter for Grade 1) | §1 |
| TAD §2, §3.2, §3.9, §3.16, §3.19, §3.21; L25, L33, L34, L36, L45, L51 | §3, §4, §6, §7, §10 |
| S5 (misconception values by code), S6 (one quantity per label; a repeated answer repeats the clue) | §5, §6; `l1.split_another_way` "Use different numbers" |
