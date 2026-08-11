# SEAM-AUDIT-K8 — full-ladder CCSS coverage matrix (WS-2)

**Written:** 2026-08-11 (system-fix Phase 1, Task 1, session 2). Executes `meta/DEV-PROMPT-SYSTEM-FIX-PHASE-1.md`
§4 and `meta/PROGRAM-PLAN-2026-08-11.md` WS-2. Ruling-independent: the CCSS→week mapping below is
true under any ladder naming; the M0–M9 tables presuppose no R1/R2 outcome — they are the §1a
recommendation made concrete, and re-labelling them costs nothing.

## 0. Method — and the governing rule

**Classify from the SERVED PROMPT, never from the templateId and never from the recipe table row.**
B21 is the proof case: its served templates are `d_multistep_rat_v1 · d_sub_v1 · d_mul_v1 · d_add_v1`
— generic arithmetic, no measurement generator anywhere — and the week still *teaches* four
measurement standards, because the measurement content lives in the prompts those templates wear.
The inventory narrows the candidates; the prompts decide. (The reverse case also occurred: C16's
recipe row *claims* a number-line anchor and the served items contain none — §5, F2.)

**Evidence base.** All **85 servable cells** (82 generated weeks + pinned fixtures A15, B14, D17)
were generated at **five seeds (11, 33, 55, 77, 99)**, contentVersion 1.2.0, and every served item
(day items, warm-ups, mastery Forms A+B) dumped with prompt, templateId, answer, and choices —
~16,000 item instances. Every classification below cites that surface. Single-seed observations from
the 2026-08-11 handoff were re-confirmed at all five seeds before entering this matrix; nothing
below rests on one seed.

**Classes.** **TAUGHT(id)** — a built week serves the standard's essential act, at every seed, in
core (non-warm-up) slots. **TOUCHED-ONLY(id, gap)** — the standard's substrate or a fragment is
served; the named act is not. **ORPHAN** — no built week serves the act. A *Planned home* column
records unbuilt recipes (FILL-ARCHITECTURE §3–§6) so downstream authoring inherits them; a recipe
is never evidence of coverage.

**Corpus-wide DRY sweep** (absence is a finding; grep over all 85 dumps × 5 seeds):

| Absent from every served item | First standard it strands |
|---|---|
| ruler / inch / foot / measuring tape (any measuring tool) | 2.MD.A.1 |
| estimation of length in standard units | 2.MD.A.3 |
| a.m. / p.m. | 2.MD.C.7 |
| dollar bills, `$` notation (B16 is ¢-only) | 2.MD.C.8 |
| number line as a rendered/length object (paths & hop-stories exist; no line diagram) | 2.MD.B.6, 3.NF.A.2 |
| line plots of *measurements* (B23's line plot counts peas per pod) | 2.MD.D.9, 3.MD.B.4, 4.MD.B.4, 5.MD.B.2 |
| unit conversion acts (units appear only as story dressing) | 4.MD.A.1, 5.MD.A.1 |
| symmetry | 4.G.A.3 |
| counting by 100s / any counting past ~120 | 2.NBT.A.2 |
| mental ±10/±100 on 3-digit numbers | 2.NBT.B.8 |
| subtracting multiples of 10 (B10 adds tens only) | 1.NBT.C.6 |
| protractor / angle measuring | 4.MD.C.6 |

## 1. Priority settlement — the six Grade-2 orphan candidates

The assessment (§2 D4) listed six standards with "no found home anywhere", audited from recipe
tables. Item-level, multi-seed verdict: **three REFUTED (taught in B21), two DOWNGRADED to
TOUCHED-ONLY, one CONFIRMED ORPHAN.** B21 (`measuring-length`) is the load-bearing week: every
one of its five seeds serves the same blueprint slots in measurement frames.

| Standard | Verdict | Served-prompt evidence (present at ALL 5 seeds unless noted) |
|---|---|---|
| **2.MD.A.4** measure to compare lengths, standard units | **TAUGHT(B21) — orphan claim REFUTED** | "Mia brings a courgette 28 cm long… Pia's is 14 cm. How much longer…" (D1 + MA + MB — certifying slots); cube-count differences "It is 18 cubes long… lays 8, then 7 more… how much longer" (d_multistep, 2–3×/pack) |
| **2.MD.B.5** ± within 100 word problems with lengths | **TAUGHT(B21) — orphan claim REFUTED** | "beanstalk measured 48 cm… today 68 cm. How much has it grown?" (D2 warm-up); "white part is 12 cubes… green part 9 cubes… whole leek?" (d_add core slot); courgette differences within 100 cm |
| **2.MD.A.2** (not on the list; settled for completeness) two units, relate to unit size | **TAUGHT(B21)** | "The same hairbrush is measured twice… each paperclip is as long as 3 cubes. One count is 24. The other is 8. Which came from the paperclips? Or must one be mistaken?" (~4×/pack incl. MA/MB); D5: "Measure one thing twice… why are the two numbers not the same" ⇒ "a cube is shorter, so more fit" |
| **2.MD.A.3** estimate lengths in standard units (in/ft/cm/m) | **TOUCHED-ONLY(B21) — orphan claim refuted, TAUGHT refused** | Estimate-first is served: "Predict first. Will ten cubes reach the tail? Decide, then solve." (D2+D4, all seeds) — but always in **cube units**. Standard-unit estimation is corpus-DRY. The act exists; the register doesn't. |
| **2.MD.B.6** number line: numbers as lengths from 0; ± within 100 on it | **TOUCHED-ONLY(B4) — not an orphan, not taught** | B4 serves hop-stories on a numbered hopscotch track within 20 ("stands on square 9… hops on 2… which square?") + B18/B21 skip-count hops. That is a number *path* (ordinal squares), not a number-line *diagram* (lengths from 0), and nothing reaches within-100 ± as line jumps. |
| **2.G.A.1** recognize/draw shapes by attributes; triangles, quadrilaterals, pentagons, hexagons, cubes | **TOUCHED-ONLY — core TAUGHT-BUT-MISPLACED in A7** | A7 serves name-by-corner-count for triangle/square/pentagon/hexagon with rotation invariance at every seed (`a_shape_name_v1`×14 + `a_shape_corners_v1`×12; "Bo calls it a diamond. Tap its real name."). Pentagon/hexagon appear in **no other week** (corpus grep). A7 sits at pre-K/K band → the identification core needs a **MOVE/lift**, and the G2 acts — *draw* with specified attributes, *quadrilateral* as a category word, *cube* — are served nowhere. |
| **2.G.A.2** partition a rectangle into rows × columns of same-size squares; count them | **ORPHAN — CONFIRMED (the one genuine orphan of the six)** | Count-side only, one grade late: C20 serves "pigeonhole rack… 8 compartments across, 3 down — how many?" and squares "laid over" regions — at Grade-3 **area register** (cm²/m²), partition always given. B22 partitions 1-D strips into halves/quarters ("12 equal squares along it, fold in half"), never rows×columns. B20 arrays arrange *objects*, not partitioned regions. The child never partitions a rectangle. Becomes an early M3 NEW week (seed of area → C20). |

## 2. Split points — from content, not plan docs

| Seam | Verdict | Evidence line |
|---|---|---|
| **B → M2\|M3 at B12\|B13** | **CONFIRMED** | B1–B12 are wall-to-wall Grade 1: B1 to-120 (1.NBT.A.1), B2 tens/ones (1.NBT.B.2), B3 compare (1.NBT.B.3), B4 count-on/back (1.OA.C.5), B5 make-ten (1.OA.C.6), B6 equal sign (1.OA.D.7), B7 missing addends (1.OA.D.8), B8 fact families (1.OA.B.3/4), B9 stories within 20 (1.OA.A.1), B10/B11 tens + 2-digit+1-digit (1.NBT.C.4), B12 hour/half-past (1.MD.B.3). B13 opens regrouping within 100 = 2.NBT.B.5. One back-half exception: **B22 (halves/quarters) is exactly 1.G.A.3** (2.G.A.3 needs thirds, which B22 never serves — grep 0 at all seeds) → B22 **moves down** to M2. |
| **C → M3\|M4 at C4\|C5** | **CONFIRMED, one impurity** | C1–C4 are the Grade-2 back half: place value to 1,000 (2.NBT.A.1/A.3), compare (2.NBT.A.4), ± within 1000 (2.NBT.B.7). C5 opens the G3 register (two-step stories + inverse-start, 3.OA.D.8), C6 meets multiplication (3.OA.A.1). Impurity: **C2's rounding half is 3.NBT.A.1** sitting in the G2 block — acceptable as seam-seeding (BB's own tail-seeds-next-level behavior), resolved by an M4-native rounding week (M4 wk24). |
| **D → M5\|M6 at D12\|D13** | **DETERMINED (was unknown)** | D12 serves decimal *notation* as fractions — "A jug holds 1/50 of a litre. Write that amount as a decimal." (4.NF.C.6 register; note 1/50 exceeds the G4 denominators 10/100 — lift note). D13 opens **thousandths** — "In 4.983, which digit is in the thousandths place?", "Round 7.167 to the nearest hundredth" (5.NBT.A.1/A.3/A.4). D1–D12 = Grade 4 (place value/×÷/fractions/decimal-meeting), D13–D24 = Grade 5 (decimal ops, fraction ops, volume, plane). Impurity noted: D23 (angles, 4.MD.C.7) sits in the G5 half; its hierarchy ASN ("every square is a rectangle") is the 5.G.B.3/4 fragment. |
| **E → M7\|M8 at E13\|E14, with 6 cross-moves** | **DETERMINED (was unknown): E does NOT split cleanly** | By standard: E1–E7, E10–E13 are Grade 6 (6.RP, 6.NS, 6.EE.A/B.7); E14–E17, E19, E23 are Grade 7 (7.EE.B.4, 7.RP, 7.G.B.4, 7.SP.C). But **E8/E9 (± and ×÷ rationals = 7.NS.A.1/A.2) sit in the front half**, and **E18/E20/E21/E22 (6.G.A.1/A.2/A.4, 6.SP) sit in the back half**. Nearest boundary = E13\|E14 with cross-moves: E8, E9 → M8; E18, E20, E21, E22 → M7. Only E1 and E13 are built, so the "moves" are recipe re-assignments, costless today. |
| **A → M0\|M1 at A11\|A12** | **DETERMINED** | A1–A11 = pre-K register (count/write to 10, compare, order, shapes, position, patterns); A12 opens the operations thread (partners-of-5, icon-as-unknown = K.OA) and the back half carries K.OA/K.NBT/K.MD (teens=10+n, add/sub meeting, measurement). A9/A10 (teens) sit at the M0 tail as K-seeding — the same tail-seeds-next-level behavior BB exhibits (fractions L4w18 → L5w1). |

## 3. Classification matrix — Grades K–8

Levels below are the current A–E ladder; **M-home** is where the row lands in §6. Per-grade
headlines in §4. "lane" = the WS-3 fluency lane (automaticity is a lane job, not a week job —
plan §1b).

### Kindergarten (22 standards)

| Standard | Verdict | Evidence / gap | M-home |
|---|---|---|---|
| K.CC.A.1 count to 100 by 1s/10s | TOUCHED-ONLY(A9: to 20; A20/B3 `a_count_tens` substrate) — to-100 absent | planned A22 (to 50) + gap | M1 |
| K.CC.A.2 count on from any number | TAUGHT(A6 next/before; B4 hop-on) | "Which number comes just after 7?" | M0/M2 |
| K.CC.A.3 write numerals 0–20 | TOUCHED-ONLY(A4: 6–10 via `a_numeral_for_set`; A9 teen numerals) — 0–5 and 11–20 writing unbuilt | planned A3, A10 | M0 |
| K.CC.B.4 counting ↔ cardinality | TAUGHT(A1/A2) | count arrangements, frame reads, verify-count-slip EA | M0 |
| K.CC.B.5 count out ≤20, arrangements | TAUGHT(A1/A2/A9) | rows/scattered/frames at all seeds | M0 |
| K.CC.C.6 compare groups | TAUGHT(A5) | conservation trap is the week's core ("row of 5 spread far apart above a tight row of 8 — which has more?") | M0 |
| K.CC.C.7 compare written numerals 1–10 | TOUCHED-ONLY(A5/A6) — sets and order served; numeral-pair comparison item absent at all seeds | M1 NEW | M1 |
| K.OA.A.1 represent +/− with objects | ORPHAN-as-built | planned A14 (join stories), A16 (take-away) | M1 |
| K.OA.A.2 word problems within 10 | TOUCHED-ONLY(A15 fixture: addition side) — subtraction side unbuilt | planned A17 | M1 |
| K.OA.A.3 decompose ≤10 | TOUCHED-ONLY(A12: partners of 5, all-ways set answer) — partners of 10 unbuilt | planned A13 | M1 |
| K.OA.A.4 make 10 from a given number | ORPHAN-as-built | planned A13 (frame-hiding = exactly this act) | M1 |
| K.OA.A.5 fluently ± within 5 | TOUCHED-ONLY(A15 within-10 items) — automaticity has no lane | WS-3 lane + A15 | M1+lane |
| K.NBT.A.1 teens = ten + ones | TAUGHT(A9 `a_teen_ten_and_v1`: "A full frame holds 10… 4 loose beside it. How many?") | planned A23 deepens | M0/M1 |
| K.MD.A.1 describe measurable attributes | TOUCHED-ONLY(A20: weight/capacity described) — length words at A19 unbuilt | planned A19 | M1 |
| K.MD.A.2 compare two objects by attribute | TAUGHT(A20) | heavier/lighter, holds-more; `compare_measure`; bigger≠heavier trap | M1 |
| K.MD.B.3 classify & count categories | TOUCHED-ONLY(A1 `sort_and_tell`, A7 Day-5 shape sort) — dedicated sort week unbuilt | planned A8 | M0/M1 |
| K.G.A.1 position words | ORPHAN-as-built | planned A8 (above/below/beside scene) | M0 |
| K.G.A.2 name shapes regardless of orientation | TAUGHT(A7) | rotation-invariance IS its discrimination ("turned 270°, still standing upright") | M0 |
| K.G.A.3 flat vs solid | ORPHAN-as-built | planned A21 | M1 |
| K.G.B.4 analyze/compare shapes (parts) | TAUGHT(A7 corner-counting core) | "Count the corners. Tap how many." | M0 |
| K.G.B.5 model/build/draw shapes | ORPHAN-as-built | planned A21 build-and-tell (R medium) | M1 |
| K.G.B.6 compose simple shapes into larger | **ORPHAN — no recipe anywhere** | genuine K gap → M1 NEW | M1 |

### Grade 1 (21 standards)

| Standard | Verdict | Evidence / gap | M-home |
|---|---|---|---|
| 1.OA.A.1 word problems within 20 | TAUGHT(B9) | situation frames; answers-wrong-question EA; "3 more than" trap | M2 |
| 1.OA.A.2 three addends within 20 | TOUCHED-ONLY(B13 "three addends" at within-100 register; B9 chains) — within-20 3-addend never the focus | M2 NEW | M2 |
| 1.OA.B.3 properties as strategies | TAUGHT(B8 fact families; B5 make-ten) | | M2 |
| 1.OA.B.4 subtraction as unknown addend | TAUGHT(B7) | "adds the parts instead of finding the part" EA | M2 |
| 1.OA.C.5 relate counting to ± | TAUGHT(B4) | hop stories; count-the-start off-by-one EA | M2 |
| 1.OA.C.6 ± within 20, strategies | TAUGHT(B5; A15 within 10) — from-memory floor is the lane's job | WS-3 | M2+lane |
| 1.OA.D.7 equal sign meaning | TAUGHT(B6) | "is 8 = 3+5 OK?" true/false sort | M2 |
| 1.OA.D.8 unknown in any position | TAUGHT(B7) | missing-part vs missing-whole discrimination | M2 |
| 1.NBT.A.1 count/read/write to 120 | TAUGHT(B1) | `number_after/before/between`, `fill_path`, words | M2 |
| 1.NBT.B.2 tens and ones | TAUGHT(B2) | compose/decompose/rebundle; "writes 302 for 3 tens 2 ones" EA | M2 |
| 1.NBT.B.3 compare 2-digit, symbols | TAUGHT(B3) | `e_int_compare_symbol` + ones-digit trap (39>41) | M2 |
| 1.NBT.C.4 add within 100 (2d+1d, +tens) | TAUGHT(B10/B11) | `add_within_100`; concatenation trap 47+5=412 | M2 |
| 1.NBT.C.5 mentally 10 more/less | TOUCHED-ONLY(B1: +10 chart walks/`chart_below`) — **10-less direction absent at all seeds** | M2 NEW completes | M2 |
| 1.NBT.C.6 subtract multiples of 10 | TOUCHED-ONLY(B10: adds tens only; subtract-multiples act corpus-DRY) | M2 NEW | M2 |
| 1.MD.A.1 order 3 lengths; indirect compare | ORPHAN-as-built (A19 recipe is the pre-K seed; B21 never orders 3) | planned A19 + M2 NEW | M2 |
| 1.MD.A.2 length as iterated whole units | TAUGHT(B21 — cube-laying end-to-end/no-gaps IS the act) — sited in the G2 half; M2 NEW gives it a G1 home | M2 |
| 1.MD.B.3 time: hour & half-hour | TAUGHT(B12) | reads/sets/elapsed; hand-swap trap | M2 |
| 1.MD.C.4 data, ≤3 categories | TOUCHED-ONLY(B23 at G2 register) — G1-register organize-ask absent from B1–B12 | M2 NEW | M2 |
| 1.G.A.1 defining vs non-defining attributes | TOUCHED-ONLY(A7 naming/corners at K register) — defining-attribute language absent | M2 NEW | M2 |
| 1.G.A.2 compose 2D/3D shapes | **ORPHAN — no recipe** (K.G.B.6's sibling) | M2 NEW | M2 |
| 1.G.A.3 halves/fourths | TAUGHT(B22) — halves/quarters partitioning with the 2-equal-parts trap; **exactly the G1 standard** (thirds never served → 2.G.A.3 is the G2 gap, not this) | M2 (MOVE) |

### Grade 2 (26 standards)

| Standard | Verdict | Evidence / gap | M-home |
|---|---|---|---|
| 2.OA.A.1 1–2-step word problems within 100 | TAUGHT(B15 + B9/B13 substrate) | comparison bars; "more as add vs how-many-more as subtract" | M3 |
| 2.OA.B.2 fluently ± within 20 from memory | TOUCHED-ONLY(B5/B8 strategies) — no automaticity lane (D3 defect) | WS-3 | M3+lane |
| 2.OA.C.3 even/odd | TAUGHT(B19) | pair-up test; "15 is even — ends in 5's count" EA | M3 |
| 2.OA.C.4 arrays, repeated addition | TAUGHT(B20) | rows-of items + commutativity discrimination | M3 |
| 2.NBT.A.1 hundreds/tens/ones | TAUGHT(C1) | compose/expanded/riddles | M3 (MOVE) |
| 2.NBT.A.2 count within 1000; skip 5/10/100 | TOUCHED-ONLY(B18: 2/5/10 within ~100) — by-100s and past-120 corpus-DRY | M3 NEW | M3 |
| 2.NBT.A.3 read/write to 1000 | TAUGHT(C1 `write_words_3digit`, `expanded_3digit`) | | M3 (MOVE) |
| 2.NBT.A.4 compare 3-digit | TAUGHT(C2 compare half, `d_pv_compare`) | | M3 (MOVE) |
| 2.NBT.B.5 fluently ± within 100 | TAUGHT(B13; B14 fixture) | regrouping ladder; carry-drop/smaller-from-larger EA | M3 |
| 2.NBT.B.6 add up to FOUR 2-digit numbers | TOUCHED-ONLY(B13: three addends) — four-addend absent at all seeds | M3 NEW | M3 |
| 2.NBT.B.7 ± within 1000 | TAUGHT(C3/C4) | borrow-across-zero week | M3 (MOVE) |
| 2.NBT.B.8 mentally ±10/±100 on 100–900 | **ORPHAN** — B1's +10 walks stop at 120 (G1); C3's algorithm is a different act; 3-digit mental jumps corpus-DRY | M3 NEW | M3 |
| 2.NBT.B.9 explain why strategies work | TAUGHT-distributed(B13/B14/C3/C4) | `verify_binop_misconception` written EA every week — the house EA strand is this standard | M3 |
| 2.MD.A.1 measure with appropriate tools | TOUCHED-ONLY(B21: cube/paperclip units, cm in prose) — **no ruler/tool anywhere in the corpus** | M3 NEW | M3 |
| 2.MD.A.2 two units, relate to unit size | TAUGHT(B21) — §1 | M3 |
| 2.MD.A.3 estimate in standard units | TOUCHED-ONLY(B21) — §1 | M3 NEW completes | M3 |
| 2.MD.A.4 how much longer (standard units) | TAUGHT(B21) — §1 | M3 |
| 2.MD.B.5 ± within 100 with lengths | TAUGHT(B21) — §1 | M3 |
| 2.MD.B.6 number line diagram | TOUCHED-ONLY(B4) — §1 | M3 NEW | M3 |
| 2.MD.C.7 time to 5 min; a.m./p.m. | TOUCHED-ONLY(B17: quarter-hours; 5-min granularity lives in C18 one level up; **a.m./p.m. corpus-DRY**) | M3 NEW completes | M3 |
| 2.MD.C.8 money: $ and ¢ | TOUCHED-ONLY(B16: ¢ thorough — coin totals, fewest-coins, short-by; **$ and dollar bills absent at all seeds**) | M3 NEW completes | M3 |
| 2.MD.D.9 measure lengths → line plot | TOUCHED-ONLY(B23: line-plot mechanics on counts, incl. build-your-own Day-5) — measurement data absent | M3 NEW | M3 |
| 2.MD.D.10 picture/bar graphs, 4 categories | TAUGHT(B23) | reads, two-bar combines, build-a-plot | M3 |
| 2.G.A.1 shapes by attributes | TOUCHED-ONLY(A7 misplaced core) — §1 | M3 NEW lift | M3 |
| 2.G.A.2 partition rectangle rows×columns | **ORPHAN** — §1. The seed of area (C20) | M3 NEW (early) | M3 |
| 2.G.A.3 halves, thirds, fourths | TOUCHED-ONLY(B22: halves/quarters; **thirds only in C15**, one level up) | M3 NEW completes | M3 |

### Grade 3 (25 standards)

| Standard | Verdict | Evidence / gap | M-home |
|---|---|---|---|
| 3.OA.A.1 multiplication meaning | TAUGHT(C6) | "3 groups of 4 vs 3 and 4" discrimination | M4 |
| 3.OA.A.2 division meanings | TAUGHT(C9) | sharing vs grouping is the week | M4 |
| 3.OA.A.3 ×÷ word problems | TAUGHT(C6/C9 + facts weeks) | | M4 |
| 3.OA.A.4 unknown factor | TAUGHT(C10) | missing-factor = division | M4 |
| 3.OA.B.5 properties (comm/assoc/dist) | TAUGHT(C13 + B20/C8) | split-the-array; double-count EA | M4 |
| 3.OA.B.6 division as unknown factor | TAUGHT(C10) | | M4 |
| 3.OA.C.7 fluently ×÷ within 100, memory | TOUCHED-ONLY(C7/C8/C11/C12 strategies) — automaticity = lane | WS-3 | M4+lane |
| 3.OA.D.8 two-step problems, estimate | TAUGHT(C5) | inverse-start enters; estimate-first metacog | M4 |
| 3.OA.D.9 arithmetic patterns | TAUGHT(C7/C12) | 5s end in 0/5 hunt; 9s digit-sum proof | M4 |
| 3.NBT.A.1 round to 10/100 | TAUGHT(C2 rounding half — sits at the M3 seam; M4 gets a native week) | M3-seam/M4 |
| 3.NBT.A.2 fluently ± within 1000 | TAUGHT(C3/C4) | | M3-seam |
| 3.NBT.A.3 one-digit × multiples of 10 | TAUGHT(C14) | zero-dropped EA (3×40=12) | M4 |
| 3.NF.A.1 unit fractions | TAUGHT(C15) | equal-thirds discrimination; strip folds | M4 |
| 3.NF.A.2 fractions ON a number line | **ORPHAN-by-surface** — C16's recipe claims "number line + benchmark" anchor; served items are rename/compare with **zero number-line items at any seed** (grep 0); D9 asserts line-equivalence in prose at G4. Recipe-claims ≠ serve (L-class). | M4 NEW | M4 |
| 3.NF.A.3 equivalence/compare | TAUGHT(C16 acts minus the line; D9 deepens) | bigger-bottom trap | M4 |
| 3.MD.A.1 time to minute; intervals | TAUGHT(C18) | to-the-minute + elapsed-within-hour; hour-hand-drift trap. Gap: crossing the hour → M4 NEW completes | M4 |
| 3.MD.A.2 mass & liquid volume | TAUGHT(C19) | g/kg/L benchmarks; estimate-first is the content | M4 |
| 3.MD.B.3 scaled graphs | TAUGHT(C23) | scale-key trap (3 symbols ≠ 3) | M4 |
| 3.MD.B.4 lengths to half/quarter inch, line plots | **ORPHAN** — inches, fraction rulers, measurement line plots all corpus-DRY | M4 NEW | M4 |
| 3.MD.C.5 area concept | TAUGHT(C20) | cover-and-count | M4 |
| 3.MD.C.6 count unit squares | TAUGHT(C20) | sticker charts, chocolate slabs, cm²/m² | M4 |
| 3.MD.C.7 area ↔ multiplication | TAUGHT(C20/C21 + C13 tie) | rows×columns; irregular row-sums | M4 |
| 3.MD.D.8 perimeter | TAUGHT(C21) | fence-vs-field; THE cross-op week | M4 |
| 3.G.A.1 classify quadrilaterals | TAUGHT(C22) | property nesting; square-IS-a-rectangle | M4 |
| 3.G.A.2 partition into equal areas | TOUCHED-ONLY(C15 strips) — area-partition of 2-D shapes with unit-fraction naming absent | M4 NEW | M4 |

### Grade 4 (28 standards)

| Standard | Verdict | Evidence / gap | M-home |
|---|---|---|---|
| 4.OA.A.1 multiplicative comparison | TAUGHT(D4) | times-as-many vs more-than | M5 |
| 4.OA.A.2 × comparison problems | TAUGHT(D4) | | M5 |
| 4.OA.A.3 multi-step, remainders, reasonableness | TAUGHT(D7 + D-wide multistep strand) | round-up/drop/leftover modes | M5 |
| 4.OA.B.4 factors, multiples, prime | TAUGHT(D3) | factor pairs, kth multiple, prime choice | M5 |
| 4.OA.C.5 generate/analyze patterns | TOUCHED-ONLY(D22: `d_pattern_term` at G5 half) — rule-feature analysis absent | M5 NEW | M5 |
| 4.NBT.A.1 place value ×10 relation | TAUGHT(D1) | | M5 |
| 4.NBT.A.2 read/write/compare multi-digit | TAUGHT(D1) | expanded/words/compare | M5 |
| 4.NBT.A.3 round multi-digit | TAUGHT(D1 `d_round`) | | M5 |
| 4.NBT.B.4 fluent multi-digit ± | TAUGHT(D2) | | M5 |
| 4.NBT.B.5 multiply 4×1, 2×2 | TAUGHT(D5/D8) | area-model partial products | M5 |
| 4.NBT.B.6 divide, 1-digit divisors | TAUGHT(D6) | remainder < divisor guard | M5 |
| 4.NF.A.1 equivalence | TAUGHT(D9) | scale-both; scale-one-only EA | M5 |
| 4.NF.A.2 compare unlike | TAUGHT(D9 `d_frac_compare`) | benchmark strategies | M5 |
| 4.NF.B.3 ± like, decompose, mixed | TAUGHT(D10) — mixed-number ± register thin → M5 NEW deepens | M5 |
| 4.NF.B.4 fraction × whole | TAUGHT(D11) | | M5 |
| 4.NF.C.5 tenths + hundredths | TOUCHED-ONLY(D12 conversion focus) — the 3/10+4/100 addition act absent | M5 NEW | M5 |
| 4.NF.C.6 decimal notation | TAUGHT(D12) | fraction↔decimal both ways (note: denominators like 1/50 exceed G4's 10/100 — lift, not defect) | M5 |
| 4.NF.C.7 compare decimals | TAUGHT(D13/D14 `d_dec_compare` — sits in G5 half) | 0.8 vs 0.11 longer-is-bigger | M5 NEW gives G4 home |
| 4.MD.A.1 unit conversions within system | **ORPHAN** — conversion acts corpus-DRY (units are story dressing only) | M5 NEW | M5 |
| 4.MD.A.2 measure word problems (incl. simple frac/dec) | TOUCHED-ONLY(D-multistep liters/km stories = substrate) — conversion-bearing problems absent | M5 NEW | M5 |
| 4.MD.A.3 area/perimeter formulas | TOUCHED-ONLY(C21 at G3 grid register; D5 area-model-as-multiplication) — formula application with unknown side absent | M5 NEW | M5 |
| 4.MD.B.4 line plots with fractions | **ORPHAN** — corpus-DRY | M5 NEW | M5 |
| 4.MD.C.5 angle as turn, degrees | TOUCHED-ONLY(D23 arithmetic on given measures) — angle-as-turn concept absent | M5 NEW | M5 |
| 4.MD.C.6 measure/sketch angles | **ORPHAN** — no protractor in the medium; DRY. Flag: needs the angle-figure primitive + R part | M5 NEW (R) | M5 |
| 4.MD.C.7 additive angles | TAUGHT(D23) | "folds a square corner into two angles… one is 33°" | M6 (D23 home) |
| 4.G.A.1 draw/identify lines, rays, angles | TOUCHED-ONLY(D23 implies types) — points/lines/rays/parallel/perpendicular identification absent | M5 NEW | M5 |
| 4.G.A.2 classify by lines/angles | TAUGHT(D23: "A triangle has angles 63°, 60°, 57°. Acute, right, or obtuse?") — classify-by-sides/parallel-sides absent → completes in M5 NEW | M5/M6 |
| 4.G.A.3 line of symmetry | **ORPHAN** — symmetry corpus-DRY | M5 NEW | M5 |

### Grade 5 (26 standards)

| Standard | Verdict | Evidence / gap | M-home |
|---|---|---|---|
| 5.OA.A.1 parentheses, evaluate | TAUGHT(D21 `d_eval_expr`) | left-to-right slip EA | M6 |
| 5.OA.A.2 write/interpret expressions | TAUGHT(D21 `d_write_expr`) | phrase-reversal distractor | M6 |
| 5.OA.B.3 two patterns, correspondences | TOUCHED-ONLY(D22 single-rule terms) — two-rule ordered-pair correspondence absent | M6 NEW | M6 |
| 5.NBT.A.1 digit ×10 relations (incl. decimals) | TAUGHT(D13 `d_dec_pv`) | | M6 |
| 5.NBT.A.2 powers of 10 | TOUCHED-ONLY(D14/D20 point-moves) — 10^n exponent notation absent | M6 NEW | M6 |
| 5.NBT.A.3 read/write/compare to thousandths | TAUGHT(D13) | 4.983 thousandths digit; compare | M6 |
| 5.NBT.A.4 round decimals | TAUGHT(D13 `d_dec_round`) | 7.167→7.17 | M6 |
| 5.NBT.B.5 fluent multi-digit × | TAUGHT(D15) | | M6 |
| 5.NBT.B.6 quotients, 2-digit divisors | TAUGHT(D16) | estimate-quotient | M6 |
| 5.NBT.B.7 decimal ± × ÷ | TAUGHT(D14/D20) | align-the-point vs place-the-point | M6 |
| 5.NF.A.1 ± unlike denominators | TAUGHT(D17 **fixture, pinned v1**) | "2/3 + 1/6", "5/6 − 1/4" — the owed d17 rebuild (Task 2b) regenerates this cell | M6 |
| 5.NF.A.2 word problems, estimate (unlike) | TOUCHED-ONLY(D17 computation-only surfaces) — story + benchmark-estimate register absent | M6 NEW | M6 |
| 5.NF.B.3 fraction as division | TOUCHED-ONLY(D7: "share 10 liters among 3 cups → 3 1/3" — the act appears, never named/taught) | M6 NEW | M6 |
| 5.NF.B.4 fraction × fraction | TAUGHT(D18) | area-square model | M6 |
| 5.NF.B.5 scaling without computing | TOUCHED-ONLY(D18 computes) — predict-the-size-vs-factor act absent | M6 NEW | M6 |
| 5.NF.B.6 real-world fraction problems | TAUGHT(D18 stories + D-multistep) | | M6 |
| 5.NF.B.7 divide unit fractions | TAUGHT(D19) | "shares 1/7 litre among 9 pots" | M6 |
| 5.MD.A.1 convert measurement units | **ORPHAN** — corpus-DRY | M6 NEW | M6 |
| 5.MD.B.2 line plots with fractions + ops | **ORPHAN** — corpus-DRY | M6 NEW | M6 |
| 5.MD.C.3 volume concept | TAUGHT(D24) | unit-cube packing | M6 |
| 5.MD.C.4 count unit cubes | TAUGHT(D24 `d_volume`) | "9 by 4 by 3 — how many unit cubes fill it exactly?" | M6 |
| 5.MD.C.5 volume formula; additive | TAUGHT(D24: l×w×h) — additive/composite (C.5c) absent → M6 NEW completes | M6 |
| 5.G.A.1 coordinate system | TAUGHT(D22) | "(7,1) names it"; x/y-swap distractor | M6 |
| 5.G.A.2 real-world Q1 problems | TOUCHED-ONLY(D22 x-only robot chains) — full (x,y) interpretation thin | M6 NEW | M6 |
| 5.G.B.3 hierarchy properties | TOUCHED-ONLY(D23 one ASN slot: "every square is a rectangle, or every rectangle a square?"; C22 at G3) — G5 reasoning register thin | M6 NEW | M6 |
| 5.G.B.4 classify in hierarchy | TOUCHED-ONLY(same evidence) | M6 NEW | M6 |

### Grade 6 (29 standards) — built coverage = E1, E13 + D-tail

| Standard | Verdict | Evidence / gap | M-home |
|---|---|---|---|
| 6.RP.A.1 ratio concept & language | TAUGHT(E1) | `ratio_equivalent/table_cell/part_whole`; additive-growth EA | M7 |
| 6.RP.A.2 unit rate concept | ORPHAN-as-built; recipe E2 | | M7 |
| 6.RP.A.3 ratio/rate problems (tables, percent, plots) | TOUCHED-ONLY(E1 tables/cells) — percent (E3), speed (E2), find-the-whole all unbuilt | recipes E2/E3 + M7 NEW | M7 |
| 6.NS.A.1 divide fractions general | ORPHAN-as-built; recipe E4 (D19 = unit fractions only, G5) | | M7 |
| 6.NS.B.2 standard algorithm division | TAUGHT(D16) | G5/G6 bridge content | M6/M7 |
| 6.NS.B.3 decimal algorithms | TAUGHT(D14/D20) | | M6/M7 |
| 6.NS.B.4 GCF & LCM | ORPHAN-as-built; recipe E5 (D3 factor substrate) | | M7 |
| 6.NS.C.5 negatives in context | ORPHAN-as-built; recipe E6 | | M7 |
| 6.NS.C.6 number line & plane with negatives | ORPHAN-as-built; recipes E6/E7 | | M7 |
| 6.NS.C.7 order & absolute value | ORPHAN-as-built; recipe E6 covers order; **|x| not in any recipe** → M7 NEW completes | M7 |
| 6.NS.C.8 four-quadrant real-world | ORPHAN-as-built; recipe E7 | | M7 |
| 6.EE.A.1 whole-number exponents | ORPHAN-as-built; recipe E10 | | M7 |
| 6.EE.A.2 write/read/evaluate expressions | TOUCHED-ONLY(D21 G5 register; E13 `e_alg_eval`×2) | recipe E11 | M7 |
| 6.EE.A.3 equivalent via properties | ORPHAN-as-built; recipe E12 (C13 G3 substrate) | | M7 |
| 6.EE.A.4 identify equivalent | ORPHAN-as-built; recipe E12 | | M7 |
| 6.EE.B.5 solution as truth value | TOUCHED-ONLY(E13 plug-back check IS substitution-testing; never the named act) | M7 NEW | M7 |
| 6.EE.B.6 variables represent numbers | TOUCHED-ONLY(E13 unknown-as-letter) — any-number-bag generality at E11 | recipe E11 | M7 |
| 6.EE.B.7 one-step equations | **TAUGHT(E13)** | `e_alg_one_step`×14; wrong-inverse EA; balance stories | M7 |
| 6.EE.B.8 inequalities as conditions | ORPHAN-as-built; recipe E15 (sits M8 side → M7 NEW intro) | M7 |
| 6.EE.C.9 dependent/independent variables | **ORPHAN — no recipe** (E16 is the G7 proportional week) | M7 NEW | M7 |
| 6.G.A.1 areas by compose/decompose | ORPHAN-as-built; recipe E18 | | M7 |
| 6.G.A.2 volume, fractional edges | TOUCHED-ONLY(D24 whole-number packing) | recipe E20 + M7 NEW completes | M7 |
| 6.G.A.3 polygons in the plane | **ORPHAN — no recipe** (E7 hidden-picture adjacent) | M7 NEW | M7 |
| 6.G.A.4 nets & surface area | ORPHAN-as-built; recipe E20 | | M7 |
| 6.SP.A.1 statistical question | **ORPHAN — no recipe** | M7 NEW | M7 |
| 6.SP.A.2 distribution (center/spread/shape) | ORPHAN-as-built; recipe E21 partial | | M7 |
| 6.SP.A.3 center vs spread | ORPHAN-as-built; recipe E21 | | M7 |
| 6.SP.B.4 histograms/box plots | ORPHAN-as-built; recipe E22 (R: figures) | | M7 |
| 6.SP.B.5 summarize distributions | ORPHAN-as-built; recipes E21/E22 | | M7 |

### Grade 7 (24 standards) — nothing built; 9 recipes exist

| Standard | Verdict | Planned home | M-home |
|---|---|---|---|
| 7.RP.A.1 unit rates with fractions | ORPHAN | M8 NEW (E2 is the G6 sibling) | M8 |
| 7.RP.A.2 proportional relationships | ORPHAN | recipe E16 | M8 |
| 7.RP.A.3 multi-step percent | ORPHAN | recipe E17 | M8 |
| 7.NS.A.1 ± rationals | ORPHAN | recipe E8 (front-half cross-move) | M8 |
| 7.NS.A.2 × ÷ rationals | ORPHAN | recipe E9 (cross-move) | M8 |
| 7.NS.A.3 four-op problems | ORPHAN | E8/E9 + M8 NEW | M8 |
| 7.EE.A.1 linear expressions | ORPHAN — no recipe | M8 NEW | M8 |
| 7.EE.A.2 rewriting reveals | ORPHAN — no recipe | M8 NEW | M8 |
| 7.EE.B.3 multi-step with rationals | ORPHAN — no recipe | M8 NEW | M8 |
| 7.EE.B.4 equations & inequalities | ORPHAN | recipes E14/E15 | M8 |
| 7.G.A.1 scale drawings | ORPHAN — no recipe | M8 NEW (R figure) | M8 |
| 7.G.A.2 draw from conditions | ORPHAN — no recipe | M8 NEW (R medium) | M8 |
| 7.G.A.3 cross-sections | ORPHAN — no recipe | M8 NEW (R figure) | M8 |
| 7.G.B.4 circles | ORPHAN | recipe E19 (R: π lab) | M8 |
| 7.G.B.5 angle equations | TOUCHED-ONLY(D23 supplement/complement arithmetic at G4/5) — equation register absent | M8 NEW | M8 |
| 7.G.B.6 area/volume/SA problems | ORPHAN | E18/E20 substrate + M8 NEW | M8 |
| 7.SP.A.1 sampling | ORPHAN — no recipe | M8 NEW | M8 |
| 7.SP.A.2 inference from samples | ORPHAN — no recipe | M8 NEW | M8 |
| 7.SP.B.3 comparative overlap (MAD) | ORPHAN — no recipe | M8 NEW | M8 |
| 7.SP.B.4 compare centers | ORPHAN — no recipe | M8 NEW | M8 |
| 7.SP.C.5 probability scale | ORPHAN | recipe E23 | M8 |
| 7.SP.C.6 long-run frequency | ORPHAN | recipe E23 partial + M8 NEW | M8 |
| 7.SP.C.7 probability models | ORPHAN | recipe E23 | M8 |
| 7.SP.C.8 compound events | ORPHAN | M8 NEW (E23's R part) | M8 |

### Grade 8 (28 standards) — nothing built, no recipes

All 28 are **ORPHAN**: 8.NS.A.1–2, 8.EE.A.1–4/B.5–6/C.7–8, 8.F.A.1–3/B.4–5, 8.G.A.1–5/B.6–8/C.9,
8.SP.A.1–4. M9 is authored from zero — full 26-row table in §6, every row NEW with concept, anchor,
misconception, Day-5. Nearest built substrate, for the authoring agent: D22/E7 plane work (→8.G.B.8),
D21/E10–E14 expression chain (→8.EE), C13/E12 distributive lineage (→8.EE.C.7), D23 angle facts
(→8.G.A.5).

## 4. Headline counts

| Grade | Standards | TAUGHT | TOUCHED-ONLY | ORPHAN | Notes |
|---|---|---|---|---|---|
| K | 22 | 8 | 8 | 6 | 5 orphans have unbuilt A-recipes; K.G.B.6 has none |
| 1 | 21 | 14 | 5 | 2 | orphans: 1.MD.A.1 (A19 recipe), 1.G.A.2 (none) |
| 2 | 26 | 12 | 12 | 2 | orphans: 2.NBT.B.8, **2.G.A.2** (the confirmed one of the six) |
| 3 | 25 | 21 | 2 | 2 | orphans: 3.NF.A.2 (recipe-claims-line, serve-has-none), 3.MD.B.4 |
| 4 | 28 | 18 | 6 | 4 | orphans: 4.MD.A.1, 4.MD.B.4, 4.MD.C.6, 4.G.A.3 |
| 5 | 26 | 16 | 8 | 2 | orphans: 5.MD.A.1, 5.MD.B.2 |
| 6 | 29 | 4 | 5 | 20 | 17 orphans carry E-recipes; **3 have none** (6.EE.C.9, 6.G.A.3, 6.SP.A.1) |
| 7 | 24 | 0 | 1 | 23 | 9 carry E-recipes; 14 have none |
| 8 | 28 | 0 | 0 | 28 | no recipes exist — M9 authored from zero |
| **K–8** | **229** | **93** | **47** | **89** | zero unexplained: every ORPHAN names its M-row in §6 |

The shape of the deficit is exactly D4's prediction plus one twist: the gaps cluster in **MD and G
families** (measurement tools/registers, number-line-as-object, data-of-measurements, symmetry,
conversions) at every grade — the arithmetic spine K–5 is nearly seamless — and from G6 up the
deficit is simply D1 (the ladder ends).

## 5. Findings register (beyond the six)

| # | Finding | Class |
|---|---|---|
| F1 | **B21 teaches four standards through generic arithmetic templates** (2.MD.A.2/A.4/B.5 TAUGHT; A.3 touched). Template ids say "no measurement content"; prompts say otherwise. The audit's governing rule is earned here. | method |
| F2 | **C16's recipe claims a "number line + benchmark" anchor; the served week contains zero number-line items at any seed.** 3.NF.A.2 is orphaned *by the surface*, not by the plan — the recipe-table row is exactly what rule 2 forbids trusting. Same lesson one layer up: D9's line-equivalence lives in prose. | L-class (measure the child's surface) |
| F3 | **The measurement-tool register is corpus-DRY**: no ruler, inch, protractor, measuring tape, or unit-conversion act anywhere in 85 cells × 5 seeds. Estimation exists only in cube units (B21). This strands 7 standards across G2–G5 (2.MD.A.1/A.3, 3.MD.B.4, 4.MD.A.1/C.6, 5.MD.A.1 + line-plot family). One figure primitive (ruler/tape with fractional ticks) unblocks most of it. | content family |
| F4 | **The number-line-as-object register is corpus-DRY** (paths and hop-stories exist; no rendered line, no lengths-from-0). Strands 2.MD.B.6 and 3.NF.A.2; weakens D9. The `number-line` figure primitive exists in the B1.0 renderer scope — the weeks that need it don't. | content family |
| F5 | **B16 money is ¢-only** ($/dollar bills absent all seeds) and **B17/C18 clocks never say a.m./p.m.** — each a one-generator-extension away from closing 2.MD.C.8/C.7. | small completions |
| F6 | **A24/B24/C24/D24 already give each level a native exit week**; M-tables keep the pattern (every M-level ends in a Ready-for-next row). | structure |
| F7 | Fixtures A15/B14/D17 serve v1 surfaces inside a v2 corpus (D17 = the owed Task-2b rebuild; A15 keyboard items are the known band-A debt). The matrix treats them as built-but-owed. | debt |
| F8 | Beyond-grade lifts found while classifying (not defects; note for parent-report honesty): D12 serves 1/50-denominators at a 4.NF.C.6 week; B20 arrays exceed 5×5; D23 triangle-sum arithmetic reaches an 8.G.A.5 fact at G4/5 register. | register |

## 6. M0–M9 scope-and-sequence tables

Marks: **EXISTS(id)** built week (content cells = as built; recipe row cited). **MOVE(id)** built
week crossing an old level boundary. **NEW** unbuilt; every NEW row carries concept, anchor, named
misconception (in the Discrimination/EA cells), and Day-5 signature. **NEW(recipe xN)** = unbuilt
but its recipe row exists (FILL §3–§6) — author from that row; any delta is stated. Headers are the
per-level authoring formats from the corrected Deliverable-4 spec (`RESEARCH-PROMPT-CURRICULUM-SCOPE.md`).
Grand totals: **252 weeks — 80 EXISTS (3 of them pinned fixtures) · 5 MOVE · 35 NEW-with-recipe ·
132 NEW.** Lane reminder: every "fluently/from memory" standard is carried by the WS-3 lane, never
by adding drill weeks.

### M0 — pre-K (24 weeks; A-format)

Seeded from A1–A11 (§2 split). Pre-K carries no CCSS codes of its own; codes shown are the K
standards each row seeds. Band-A laws apply (audio-first, no timers, puppet-EA, tap/point answers).

| Wk | Concept | Anchor | Core forms (G8) | Discrimination (perceptual) | Puppet-EA | Day-5 |
|----|---|---|---|---|---|---|
| 1 | **NEW** Same & different | two trays side by side | choose same/different, match pairs | same KIND vs same COLOR (a red ball and blue ball are "the same toy") | Pip sorts a red car with red apples "because red" | sort-and-tell: my rule (+oral R) |
| 2 | **NEW** Counting 1–3 & subitizing | see-it-say-it (no touch needed for 1–3) | count 1–3, flash-recognize | 3 seen at a glance vs 3 counted — same 3? | Pip recounts "1,2" after already saying "two" (last-word slip) [K.CC.B.4] | flash-and-match game |
| 3 | EXISTS(A1) Counting 1–5 | touch-count, one tap per object | as built | scattered-vs-row still 4 | double-counts one object | sort cards by how-many (+oral R) |
| 4 | **NEW** Give me N | count-out from a pile stops at N | count out ≤5 (build the set) | counting all vs taking N ("give me 3" from 7) | Pip keeps handing toys past 3 [K.CC.B.5] | build-the-basket to order |
| 5 | EXISTS(A2) Counting 6–10 | ten-frame | as built | longer row of 5 vs tight 6 | skips an object | match sets ↔ numerals |
| 6 | **NEW(recipe A3)** Writing 0–5 | trace → write; ZERO = the empty five-frame (per HANDOFF-08-10 §5 substitute — mirrored-3 discrimination is structurally blocked) | trace, write-from-count, empty-frame zero | an empty frame vs a frame with 1 | Pip writes "3" for an empty frame [K.CC.A.3] | numeral↔set match |
| 7 | EXISTS(A4) Writing 6–10 | trace → write | as built | 6 vs 9 flip | writes 9 for six | numeral↔set match |
| 8 | **NEW** One more, one fewer | the staircase of towers | say/build one-more, one-fewer ≤10 | one MORE vs just ANOTHER (add to the group vs a new group) | Pip rebuilds the whole tower to add one [K.CC.A.2 seed] | staircase build + tell |
| 9 | EXISTS(A5) More, fewer, same | one-to-one matching lines | as built | longer-line-vs-more (THE trap) | says spread row has more | sort pairs: more/fewer/same |
| 10 | EXISTS(A6) Ordering to 10 | number path | as built | forward vs backward neighbor | puts 7 after 5 | fix the mixed-up path |
| 11 | **NEW** Size words | stand them side by side | choose big/small, long/short, tall/short | big vs TALL (a long snake lying down is big too) | Pip calls the lying ladder "small" [K.MD.A.1 seed] | order 3 by size + tell (+oral R) |
| 12 | EXISTS(A7) Flat shapes | sides-and-corners feel | as built | rotated square still a square | tilted square "a diamond" | shape sort by property (+oral R) |
| 13 | **NEW** Shape hunt | shapes live inside things | match object↔shape (clock↔circle) | the OBJECT vs its SHAPE (a door is also a rectangle) | Pip says the plate "is just a plate" [K.G.A.2 apply] | hunt-and-name three (+oral R) |
| 14 | **NEW(recipe A8)** Position & sorting | above/below/beside scene | as recipe (choose position word, attribute sort) | left/right vs above/below | sorts one item by wrong attribute [K.G.A.1, K.MD.B.3] | two-way sort |
| 15 | **NEW** Sound & movement patterns | clap-clap-stomp your body knows the unit | continue/perform AB/ABB patterns (choice + acknowledge) | a repeating UNIT vs a repeated THING (clap-clap-clap is not yet a pattern) | Pip claps on without the stomp | perform-your-own pattern (R oral) |
| 16 | EXISTS(A11) Patterns | say-the-pattern-aloud | as built | AB vs ABB | continues ABB as AB | fix-the-broken-pattern; make-your-own (R) |
| 17 | **NEW** Copy & extend trains | the unit is the wagon, not the toy | copy a train, extend by one UNIT | extend by unit vs restart the unit mid-cycle | Pip starts the unit over halfway | fix-the-train |
| 18 | EXISTS(A9) Counting 11–20 | ten-frame + extras | as built | thirteen vs thirty (audio) | counts "…12, 14…" | match teen sets |
| 19 | **NEW(recipe A10)** Writing 11–20 | "ten and 3 more" | as recipe (write teens, frame→numeral) | 13 vs 31 | writes 31 for thirteen [K.CC.A.3] | numeral↔set match |
| 20 | **NEW** Count to 20 aloud & in motion | count-along on the move | oral count sequence to 20 (acknowledge + choice checkpoints) | -teen vs -ty endings by ear (A9's trap, sequence register) | Pip says "ten-one, ten-two" | count-along game (R oral) |
| 21 | **NEW** How many now? | one joins / one leaves the group | count after adding/removing ONE ≤10 | changed group vs new group (recount everything?) | Pip recounts from 1 after one duck leaves [K.OA seed] | hide-and-peek one |
| 22 | **NEW** Zero means none | the empty plate at snack time | choose the empty set, order 0–5, "how many left when all gone" | zero vs "nothing to answer" (0 is a number on the path) | Pip skips the empty plate when counting plates [K.CC.A.3] | empty-frame match |
| 23 | **NEW** Longer or shorter | line them up at the wall (common start) | choose longer/shorter with aligned ends | staggered-baseline (A19's trap, seeded) | Pip compares without lining up [1.MD.A.1 seed] | line-up-and-tell (+oral R) |
| 24 | **NEW** Ready for M1 | my counting toolkit | retrieval mix of wk1–23 (raised share) | mixed | mixed | "my favorite way to show 5" (oral R) |

### M1 — Kindergarten (24 weeks; A-format)

Seeded from A12–A24 + K gaps. EXISTS: A12, A15 (fixture), A20. Ten NEW(recipe) rows from FILL §3.

| Wk | Concept | Anchor | Core forms (G8) | Discrimination (perceptual) | Puppet-EA | Day-5 |
|----|---|---|---|---|---|---|
| 1 | EXISTS(A12) Partners of 5 [K.OA.A.3] | 5-frame hiding game | as built | partners vs plain count | says 2 hiding when 3 shown | show ALL ways to make 5 (set) |
| 2 | **NEW(recipe A13)** Partners of 10 [K.OA.A.3/**A.4**] | ten-frame hiding | as recipe | partner-of-5 vs of-10 | uses the 5-partner for 10 | partner-pairs match |
| 3 | **NEW** Ten-frame flash [K.CC.B.4c seed] | five-and-some structure seen, not counted | flash-read frames ≤10, build-to-match | SEEING 8 (5+3 structure) vs counting 8 dots | Pip counts a full row dot-by-dot | flash-and-build game |
| 4 | **NEW(recipe A14)** Meeting addition [K.OA.A.1] | join stories acted out | as recipe | joining vs just-looking scenes | counts only the new birds | tell a join story for 2+3 (oral R) |
| 5 | EXISTS(A15, fixture) Addition within 10 [K.OA.A.2/1.OA.C.6] | count-on from bigger | as pinned (MFM-A15; generated week mirrors) | count-all vs count-on | starts count-on AT the first number | (fixture) |
| 6 | **NEW(recipe A16)** Meeting subtraction [K.OA.A.1] | take-away acted out | as recipe | which picture shows take-away? | adds when the story removes | story-sort: add vs take-away |
| 7 | **NEW(recipe A17)** Subtraction within 10 [K.OA.A.2] | count-back on path | as recipe | count-back vs count-on | off-by-one count-back | match story ↔ number sentence |
| 8 | **NEW(recipe A18)** Add & subtract together [K.OA.A.2] | choose the move | as recipe | +/− choice from picture | picks + for removal | true/false sentence sort |
| 9 | **NEW** Take-apart stories [K.OA.A.3 applied] | one number, many break-ups, in stories | decompose ≤10 in context (icon-as-unknown) | a number breaks MANY ways vs "the" one way | Pip insists 6 is only 3-and-3 | show-all-ways theater (set) |
| 10 | **NEW** More/fewer stories [K.CC.C.6 applied; 1.OA seed] | compare scenes side by side | choose who-has-more/fewer from stories | "more" in the story vs "more" as an instruction to add | Pip adds when asked who has more | match story↔picture |
| 11 | **NEW** Compare numerals [K.CC.C.7] | numerals over hidden sets | choose greater/less from numeral pair 1–10 | the numeral's SIZE vs its VALUE (9 written small still beats 6) | Pip picks the "bigger-looking" digit | numeral-war sort |
| 12 | **NEW** Count forward from anywhere [K.CC.A.2] | hop on the path mid-stream | count on 3–5 steps from any start ≤20 | counting ON vs restarting at 1 | Pip restarts at 1 every time | start-anywhere chorus (R oral) |
| 13 | **NEW(recipe A22)** Counting to 50 & tens [K.CC.A.1 part] | tens-towers | as recipe | 24 vs 42 | reads 24 as "forty-two" | tens-and-more match |
| 14 | **NEW** Count to 100 [K.CC.A.1] | the chart's last row is a cliff-edge | count by 1s/10s to 100; decade crossings | crossing a decade vs crossing to 100 ("ninety-nine, one hundred" not "ninety-ten") | Pip says "twenty-ten" after 29 | hundred-chart walk-and-sing (R oral) |
| 15 | **NEW(recipe A23)** Teens = 10 + some [K.NBT.A.1] | full frame + extras | as recipe | 10+3 vs 3+10 vs 13 (all same!) | breaks 17 into 7 and 7 | break-apart match |
| 16 | **NEW(recipe A19)** Length & height [K.MD.A.1/A.2] | line up at a common start | as recipe | staggered-baseline trap | compares without aligning | order 3 objects (figure, R) |
| 17 | EXISTS(A20) Weight & capacity [K.MD.A.2] | balance tilts down = heavier | as built | big balloon vs small stone | bigger = heavier | predict-then-sort (+oral R) |
| 18 | **NEW** Measure with footsteps [K.MD process; B21 seed] | heel-to-toe, no gaps | count footsteps along a path (whole units) | giant steps vs baby steps — same path, different counts | Pip leaves gaps between steps | measure-the-mat two ways (R) |
| 19 | **NEW** Sort, count & compare categories [K.MD.B.3] | sort first, then count each bin | two-bin/three-bin sort, count, compare | the bin with BIGGER things vs the bin with MORE things | Pip says three big boxes "are more" than five crayons | two-way sort-and-count |
| 20 | **NEW(recipe A21)** Solid shapes [K.G.A.3/B.4] | roll / stack / slide test | as recipe | circle (flat) vs sphere (solid) | stacks the sphere | build-and-tell (R) |
| 21 | **NEW** Build & draw shapes [K.G.B.5] | sticks-and-corners construction | choose-the-parts (n sticks for an n-gon), acknowledge-build, trace-draw | a triangle needs 3 sticks vs "pointy means triangle" | Pip leaves a corner open and calls it done | build-from-sticks + draw (R medium) |
| 22 | **NEW** Compose shapes [K.G.B.6; 1.G.A.2 seed] | two pattern blocks snap into a new shape | which-two-make-it (choice), build-to-match | the parts SURVIVE inside the whole (two triangles ARE the square) | Pip says the square "isn't triangles anymore" | make-a-picture from named shapes (R figure) |
| 23 | **NEW** Story problems with objects [K.OA.A.1/A.2 capstone] | act it out, then say the sentence | mixed ± within 10 from acted stories | the story's ACTION vs the numbers heard (two numbers ≠ always add) | Pip adds whenever two numbers appear | act-out-and-tell (R oral) |
| 24 | **NEW(recipe A24)** Ready for M2 | mixed stories | as recipe (retrieval-heavy mix) | mixed +/− choice | mixed | "my favorite way to make 10" (oral R) |

### M2 — Grade 1 (24 weeks; B-format)

EXISTS B1–B12 (order kept); MOVE(B22) down from the old B back half (§2); 11 NEW.

| Wk | Concept | Anchor | Multi-step (gentle) | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| 1–12 | EXISTS(B1…B12) as built, in order: numbers-to-120 · tens-and-ones · comparing · count-on/back · make-ten · balanced equal sign · missing addends · fact families · story problems within 20 · adding tens · two-digit+one-digit · time hour/half | (FILL §4 rows B1–B12) | | | | |
| 13 | MOVE(B22) Halves & quarters [1.G.A.3] | fair fold | as built (halves/quarters only = exactly the G1 standard; thirds live at M3 wk20) | shades 1 of 2 UNequal parts as half | 2 parts vs 2 EQUAL parts | fold-and-tell (figure R) |
| 14 | **NEW** Three addends [1.OA.A.2] | two join, then one more joins | the concept IS the chain (a+b, then +c ≤20) | Pip stops after the first pair and answers | which pair to add FIRST (make-ten pairs vs left-to-right) | make-20 three ways (set) |
| 15 | **NEW** Taking away tens [1.NBT.C.6] | tens-blocks: whole rods leave | 70−30 then compare to 7−3 | writes "4" for 70−30 (drops the zero) | 70−30 vs 73−3 | tens-pattern hunt downward |
| 16 | **NEW** Ten more, ten less in your head [1.NBT.C.5] | ride the chart column both ways | +10 then −10 chains (no counting) | changes the ones digit too (47+10=58) | ten-jump vs one-jump | elevator-rides production |
| 17 | **NEW** Order three lengths [1.MD.A.1] | common start line, then a middle object bridges | order 3; indirect compare (A vs C through B) | orders by one endpoint only (staggered baseline) | taller vs longer (orientation) | order-3 + prove-it line-up (figure R) |
| 18 | **NEW** Measure with same-size units [1.MD.A.2] | units end-to-end, no gaps, no overlaps (B21's anchor at G1, whole units) | measure then compare two objects | counts a gapped line as full length | gaps vs overlaps (which lies bigger?) | measure two things + tell the rule |
| 19 | **NEW** Sort & show our data [1.MD.C.4] | real objects → tally → picture columns | count each of 3 categories, then compare two | reads the tallest column for whatever is asked | most vs asked-for (B23's trap, seeded) | ask-your-own question of the chart |
| 20 | **NEW** What makes a shape [1.G.A.1] | defining attributes decide; color/size/turn do not | build-then-check (n corners → name) | rejects a tilted/skinny triangle "because it looks wrong" | defining (corners/sides) vs non-defining (color/size/orientation) | monster-shapes sort + defend (R oral) |
| 21 | **NEW** Compose flat shapes [1.G.A.2] | pattern-block snap (M1 wk22 grown up) | compose, then count the parts inside | says the parts are "gone" inside the new shape | same outline, different part-lists | two-ways-to-build challenge (figure R) |
| 22 | **NEW** Doubles & near-doubles [1.OA.C.6 strategy] | double, then one more or one less | near-double = double±1 chain | adjusts the WRONG addend (6+7 = 6+6−1) | double vs near-double scenes | doubles-machine hunt |
| 23 | **NEW** The mystery box [1.OA.D.8 capstone] | the unknown can sit anywhere in the story | unknown-start stories (hardest position) | solves unknown-start as result-unknown | where is the mystery: start, change, result? | write-your-own mystery-box story |
| 24 | **NEW** Ready for M3 | the year in one toolkit | retrieval-heavy mixed 2-step | mixed | +/− choice unsignalled | exit check + reflection (oral R) |

### M3 — Grade 2 (26 weeks; B-format)

EXISTS B13–B21, B23, B16, B17, B24; MOVE(C1–C4); 11 NEW (incl. the confirmed orphan, early).

| Wk | Concept | Anchor | Multi-step (gentle) | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| 1 | EXISTS(B13) Addition within 100 [2.NBT.B.5] | trade ten ones for a ten | as built | carry dropped | regroup vs no-regroup | two ways to add 38+25 |
| 2 | EXISTS(B14, fixture) Subtraction within 100 [2.NBT.B.5] | break a ten | as pinned (MFM-B14) | smaller-from-larger | needs-borrow vs not | (fixture) |
| 3 | EXISTS(B15) Compare & change stories [2.OA.A.1] | comparison bars | as built | subtracts on "more" | "more" add vs "how many more" subtract | write both questions |
| 4 | **NEW** Mental jumps: 10 and 100 [2.NBT.B.8] | the place-value slider (only ONE digit moves) | +10/−10/+100/−100 chains on 100–900 | changes the tens digit for ±100 | ten-jump vs hundred-jump; crossing 396+10 | jump-chain production |
| 5 | EXISTS(B18) Skip counting 2/5/10 [2.NBT.A.2 part] | hops on the line | as built | loses the pattern mid-stream | 2s vs 5s | pattern-hunt production |
| 6 | **NEW** Counting past 100 [2.NBT.A.2] | the chart stacks: another hundred, same song | count by 5s/10s/100s within 1000 | says "9100" after 995 (or "one-hundred-ten" after 109) | crossing a ten vs crossing a hundred | pattern-hunt across 100s |
| 7 | EXISTS(B19) Even, odd & fair shares [2.OA.C.3] | pair-up test | as built | ends-in-5's-count slip | ends-in digit vs pair test | ASN: even shares fairly by 2 |
| 8 | EXISTS(B20) Arrays & repeated addition [2.OA.C.4] | rows of the same size | as built | counts one row for total | 3×4 vs 4×3 same total? | build all arrays for 12 (set) |
| 9 | **NEW** Partition rectangles [**2.G.A.2** — the confirmed orphan; seed of area→C20] | fold-then-draw: grid lines make same-size squares | partition into r rows × c columns, then count (count feeds B20's array eyes) | counts only the squares along two edges (r+c) for the total | equal-square grid vs unequal "grid" (wobbly lines still a partition?) | same rectangle, two grids: 2×6 and 3×4 — what stays the same? (figure R) |
| 10 | EXISTS(B21) Measuring length [2.MD.A.1 part/A.2/A.4/B.5] | units end-to-end, no gaps | as built | gap-in-the-line slip | same object, two units → different counts | measure with two units + why differ |
| 11 | **NEW** Rulers & standard units [2.MD.A.1/**A.3**] | a ruler is a row of cm glued down (B21's cubes, fused into a tool) | estimate in cm/m FIRST, then measure and check | reads from the ruler's cut end, not from 0 | counting marks vs counting gaps; cm vs m for a door | estimate-then-measure gallery (figure R: ruler primitive — flag) |
| 12 | **NEW** The number line [2.MD.B.6] | a ruler for numbers: distance from 0 IS the number | show a+b and a−b as two jumps within 100 | places 35 at the 35th tick counted from 1 (position vs length) | number PATH (squares) vs number LINE (lengths) — B4's world grows up | show 35+27 two ways: jumps of tens, then one jump (figure R) |
| 13 | **NEW** Measure, record, plot [2.MD.D.9] | every measurement becomes one dot over its number | measure classmates' objects in cm, build the line plot | gives a repeated measurement a second "spot" sideways | line plot of MEASUREMENTS vs of counts (B23's plot, new data) | class-objects line plot + one question it answers (figure R) |
| 14 | EXISTS(B23) Bar graphs & line plots [2.MD.D.10] | bars are stacked counts | as built | tallest-bar-for-anything | tallest vs asked-for | build a line plot from data (figure R) |
| 15 | EXISTS(B16) Money [2.MD.C.8 part] | count coins by value order | as built | nickel = 1 | 3 pennies vs 1 dime | two ways to make 25¢ (set) |
| 16 | **NEW** Dollars meet cents [2.MD.C.8] | $1 is a bag of 100¢ | pay with $ and ¢, make change across $1 | reads $1.05 as "1 dollar 5" = 15¢ (point ignored) | $ vs ¢ symbols on one price tag; 100¢ = $1 | shop with mixed $/¢ tags (fmtMoney) |
| 17 | EXISTS(B17) Time: quarter hours [2.MD.C.7 part] | the minute hand's journey | as built | quarter-to as quarter-past | quarter-past vs quarter-to | order a day's schedule |
| 18 | **NEW** Five minutes & a.m./p.m. [2.MD.C.7] | the minute hand rides a 5-count track; the day has two laps | read/write to 5 min, tag a.m./p.m. | assigns p.m. to "after lunch" events at 11:30 | a.m. vs p.m. at the noon/midnight seams; hand-swap (kept) | my-day timeline with a.m./p.m. |
| 19 | **NEW** Shapes by their attributes [2.G.A.1 — lifts A7's core] | corners-and-sides decide; "quadrilateral" is the 4-family's surname | name/draw by attribute count incl. pentagon/hexagon/cube | Bo calls the tilted square "a diamond" (A7's trap, kept on purpose) | quadrilateral (any 4 sides) vs rectangle (special 4); flat pentagon vs solid cube | draw-a-shape-to-order (R draw capture) |
| 20 | **NEW** Fair shares: halves, thirds, fourths [2.G.A.3] | fold circles AND rectangles (B22 grown: thirds enter) | partition, name the share, compare share sizes | three unequal parts called "thirds" (C15's trap, on time) | halves vs thirds vs fourths of the SAME whole; equal shares that LOOK different | two ways to fourth a square + why both fair (figure R) |
| 21 | MOVE(C1) Place value to 1,000 [2.NBT.A.1/A.3] | h-t-o chart | as built | reads 407 as "forty-seven" | face vs value | number riddles |
| 22 | MOVE(C2) Compare & round [2.NBT.A.4; carries 3.NBT.A.1 at the seam] | number-line neighborhoods | as built | rounds 45 down "4 is small" | which ten is NEARER vs which digit is bigger | ASN: rounding to 10 zeroes the ones |
| 23 | MOVE(C3) Addition within 1,000 [2.NBT.B.7] | column + regroup | as built | carry dropped across hundreds | one- vs two-regroup | two strategies for one sum |
| 24 | MOVE(C4) Subtraction within 1,000 [2.NBT.B.7] | break across zero | as built | borrow-across-zero | where the borrow lands | error-hunt gallery (verify) |
| 25 | **NEW** Four numbers, one sum [2.NBT.B.6] | stack them; hunt friendly pairs first | add four 2-digit numbers (pair-then-add plans) | carries once no matter how many columns overflow | pair-hunting vs left-to-right grinding | four-addend puzzle: hit exactly 100 |
| 26 | EXISTS(B24) Ready for M4 | mixed 2-step stories | as built | mixed | +/−/story-type choice | exit check + reflection (oral R) |

### M4 — Grade 3 (25 weeks; C-format)

EXISTS C5–C24 (order kept); 5 NEW. C2's rounding half re-lands natively at wk24.

| Wk | Concept | Anchor | Multi-step | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| 1–11 | EXISTS(C5…C15) as built, in order: two-step stories · meeting multiplication · facts ×2×5×10 · facts ×3×4 · meeting division · fact families ×÷ · facts ×6×7 · facts ×8×9 · distributive thinking · multiply by tens · meeting fractions | (FILL §5 rows C5–C15) | | | | |
| 12 | **NEW** Fractions on the number line [3.NF.A.2 — closes F2] | a unit fraction is a JUMP SIZE; 3/4 = three jumps of 1/4 from 0 | place, then compare two placements | puts 1/4 at the 4th tick (counts ticks, not intervals) | tick-count vs interval-count; 3/4 of the line vs 3/4 ON the line | build-a-line for 3/4 and defend it (figure R — number-line primitive) |
| 13 | EXISTS(C16) Equivalent & comparing fractions [3.NF.A.3] | benchmark strategies (line act lives at wk12) | as built | 1/8 > 1/3 "8 > 3" | bigger-bottom trap | benchmark sort |
| 14 | EXISTS(C17) Fractions of a set | share the set into groups | as built | answers with the denominator | 1/3 of 12 vs 3 of 12 | two stories for 1/4 of 8 |
| 15 | **NEW** Equal areas, equal shares [3.G.A.2] | cut the SAME shape into parts of equal AREA — they needn't be twins | partition, name each part as a unit fraction of the whole | calls unequal-area parts fair because the COUNT matches | equal area vs congruent parts (two fair cuts can look different) | two different fair cuts of one rectangle, both named 1/4 (figure R) |
| 16 | EXISTS(C18) Time to the minute [3.MD.A.1 part] | minute marks ride in fives | as built | 2:55 read as 3:55 | 5-min marks vs single minutes | schedule + elapsed production |
| 17 | **NEW** Across the hour [3.MD.A.1] | ride to the top of the clock, then keep going (two hops) | elapsed spanning the hour (2:50→3:10); start/end unknowns | subtracts clock digits (3:10−2:50 = "0:40") | within-hour vs across-hour journeys | journey timetable production |
| 18 | EXISTS(C19) Mass & liquid volume [3.MD.A.2] | benchmark units | as built | wrong scale interval | g vs kg choice | estimate-first benchmark hunt |
| 19 | **NEW** Half inches & quarter inches [3.MD.B.4 — inches enter the corpus] | zoom into the inch: it splits into fair shares (wk12's line, on a ruler) | measure to the half/quarter inch, then plot the data | reads the half-tick as a whole unit | half-inch tick vs quarter-inch tick (which family?) | measure-to-the-half-inch line plot (figure R — fractional ruler) |
| 20–23 | EXISTS(C20…C23) as built, in order: area · perimeter vs area · quadrilateral families · scaled graphs | (FILL §5 rows C20–C23) | | | | |
| 24 | **NEW** Rounding on its own ground [3.NBT.A.1 — resolves the C2 seam impurity] | number-line neighborhoods to 10 AND 100 (C2's anchor, both scales) | round two ways, then use the round to check a sum | rounds by the digit's size, not the neighbor's distance | nearest ten vs nearest hundred of the SAME number | rounding-detective: which roundings lie? |
| 25 | EXISTS(C24) Ready for M5 | mixed multi-step | as built | mixed | operation choice unsignalled | exit check + strategy reflection |

### M5 — Grade 4 (26 weeks; C-format header ADOPTED)

Header note (per the Deliverable-4 spec: state the adoption): Level D is not in FILL-ARCHITECTURE;
its plan rows (`CONTENT-GENERATION-PLAN.md` §3) are `Wk|Concept|Archetype|Status` — no
misconception column, so they cannot serve as an authoring format. The C header is adopted for
M5/M6: it is the nearest-band 7-column format, and the built D weeks already carry EA/discrimination
in their blueprints, so EXISTS rows lose nothing. EXISTS D1–D12 (order kept); 14 NEW.

| Wk | Concept | Anchor | Multi-step | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| 1–5 | EXISTS(D1…D5) as built, in order: place value to 1,000,000 · multi-digit ± fluency · factors, multiples & primes · multiplicative comparison · area-model multiplication | (CGP §3 rows D1–D5) | | | | |
| 6 | **NEW** Area & perimeter formulas at work [4.MD.A.3] | the formula is C20's grid, compressed | find the unknown side from area or perimeter; both measures on one figure | adds all four sides for area (C21's trap at formula register) | which formula owns the question: fence or field? | design a pen: fixed fence, biggest field |
| 7–9 | EXISTS(D6…D8) as built: division with remainders · interpreting remainders · 2-digit × 2-digit | (CGP §3) | | | | |
| 10 | **NEW** Patterns with rules [4.OA.C.5] | the rule-machine generates; the child interrogates | generate terms, then analyze a feature the rule never stated (parity, digits) | reads the pattern from term-differences only, misses structure | same start, different rules — when do they part ways? | two rules, same first three terms: tell them apart |
| 11–12 | EXISTS(D9, D10) as built: fraction equivalence & comparison · ± like denominators | (CGP §3) | | | | |
| 13 | **NEW** Mixed numbers ± [4.NF.B.3b/c] | the tape measure: wholes and parts on one strip | ± mixed numbers with regrouping across the whole | subtracts the fraction parts backwards when the top is smaller (3 1/4 − 1 3/4) | regroup-the-whole vs borrow-a-ten (B14's ghost in fraction clothes) | two paths to one difference, both shown |
| 14 | EXISTS(D11) Fraction × whole | as built | (CGP §3) | | | |
| 15 | **NEW** Tenths meet hundredths [4.NF.C.5] | 3/10 = 30/100 on the hundred-grid | rename, then add tenths + hundredths | adds denominators straight (3/10 + 4/100 = 7/110) | tenths-grid vs hundredths-grid of the SAME shading | shade-two-ways proof (figure R — area grid) |
| 16 | EXISTS(D12) Meeting decimals [4.NF.C.6] | as built | (CGP §3) | | | |
| 17 | **NEW** Decimal compare & order [4.NF.C.7 — G4-native home] | overlay the grids; longer writing ≠ bigger number | compare, then order three | 0.8 < 0.35 "because 35 > 8" (D13's warm-up, now the concept) | 0.8 vs 0.80 vs 0.08 — which pair is equal? | decimal-war defense |
| 18 | **NEW** Convert within a system [4.MD.A.1 — closes a corpus DRY] | the two-column table: 1 m \| 100 cm, and the table only grows | build tables km/m/cm, kg/g, L/mL, hr/min/sec, ft/in; convert larger→smaller | divides when going to smaller units ("meters are bigger so divide") | which row of the table answers it; cm→m vs m→cm | build the conversion table + set one trap |
| 19 | **NEW** Measurement word problems [4.MD.A.2] | units ride the numbers through every step | multi-step with mixed units (incl. simple fractions/decimals of units) | adds 30 cm to 2 m as 32 | same-unit-first vs convert-at-the-end plans | fix-the-mixed-units story |
| 20 | **NEW** Fraction line plots [4.MD.B.4] | wk19-M4's plot, now in eighths | build from data, then ± on the plot (largest−smallest) | places 3/8 by numerator count at the 3 | eighths ticks vs quarters ticks on one line | plot-and-answer: the range question (figure R) |
| 21 | **NEW** Angles: the turn meter [4.MD.C.5/C.6-concept] | an angle is an amount of TURN; a degree is 1/360 of the way around | turn-then-name (quarter turn = 90°); sketch-to-order | says the wider-drawn rays make the bigger angle (ray length ≠ angle) | turn size vs ray length; quarter-turn vs 25° | turn-hunt: doors, clock hands, sketches (R — protractor is out of medium; sketch + choice core) |
| 22 | **NEW** Lines, rays & the angle families [4.G.A.1/A.2 completion] | point → ray → angle → the shape wears them | identify/draw parallel & perpendicular; classify triangles by angle AND by sides | "perpendicular means one line is vertical" | parallel vs perpendicular vs neither; right triangle by MARK vs by look | attribute-order drawing (R draw capture) |
| 23 | **NEW** Symmetry [4.G.A.3 — closes a corpus DRY] | the fold test: halves that land on each other | find all lines, then complete the half | draws the rectangle's diagonal as a mirror line | fold-symmetric vs turn-symmetric (looks balanced ≠ folds clean) | complete-the-half (figure R) |
| 24 | **NEW** The algorithms, end to end [4.NBT.B.4/5/6 consolidation — D2/D15 fluency-week pattern] | one page, three algorithms, raised complexity (deepeningDelta) | chains: multiply then subtract then divide | regroup dropped across zeros | which algorithm does the story want? | error-hunt gallery across all three |
| 25 | **NEW** Money through the year [4.MD.A.2 money register] | dollars are decimals done honestly (fmtMoney) | price → change → split across items | handles the point like a digit ($3.5 + $1.25 = $4.30) | cents-as-hundredths vs cents-as-count (B16→M3-wk16 lineage) | budget-a-party production |
| 26 | **NEW** Ready for M6 | the year as one toolkit | mixed retrieval-heavy multi-step | mixed | tool choice unsignalled | exit check + reflection |

### M6 — Grade 5 (26 weeks; C-format header adopted — same note as M5)

EXISTS D13–D16, D18–D24 + D17 (pinned fixture; its regeneration is the owed Task-2b build); 14 NEW.

| Wk | Concept | Anchor | Multi-step | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| 1–2 | EXISTS(D13, D14) as built: decimal place value to thousandths · ± decimals | (CGP §3) | | | | |
| 3 | **NEW** Powers of ten [5.NBT.A.2] | ×10 is an escalator; 10³ names three rides | multiply/divide by 10^n, point-moves predicted then verified | ×1000 "adds three zeros" to 2.5 → 2.5000 | exponent counts RIDES, not zeros-in-the-answer | powers-of-ten zoom story (small→cosmic) |
| 4–5 | EXISTS(D15, D16) as built: multi-digit × fluency · division 2-digit divisors | (CGP §3) | | | | |
| 6 | **NEW** A fraction IS a division [5.NF.B.3 — names D7's act] | 3 bars shared by 4 people: each gets 3/4 (the juice items, finally taught) | share-stories → mixed-number answers, both directions | reads a/b as "bigger into smaller" always (b÷a) | 3÷4 vs 4÷3 stories — which is which? | share-anything theater + when is the answer > 1? |
| 7 | EXISTS(D17, fixture) ± unlike denominators [5.NF.A.1] | as pinned (MFM-D17) — **owed: Task-2b regeneration of this cell** | | | | |
| 8 | **NEW** Estimate before you add [5.NF.A.2] | benchmarks first: is 5/6 + 1/4 more than 1? | estimate → exact → reconcile (word problems, unlike denominators) | adds tops-and-bottoms then "checks" nothing (D9's refuted move, story register) | closer-to-0 / closer-to-1/2 / closer-to-1 sort | is-it-more-than-1 tournament |
| 9 | EXISTS(D18) Multiplying fractions | as built | (CGP §3) | | | |
| 10 | **NEW** Scaling without computing [5.NF.B.5] | ×(<1) shrinks, ×(>1) grows, ×1 keeps — before any arithmetic | predict the size, then verify one | "multiplication always makes bigger" (E4's sibling, on time) | shrink vs grow vs keep, from the factor alone | predict-then-verify gallery |
| 11–12 | EXISTS(D19, D20) as built: dividing unit fractions · ×÷ decimals | (CGP §3) | | | | |
| 13 | **NEW** The metric ladder [5.MD.A.1 — closes a corpus DRY] | M5-wk18's table grows decimal rungs | convert with decimals mid-problem (0.35 km + 420 m) | moves the point the wrong way | up-the-ladder vs down-the-ladder rides | conversion-chain relay |
| 14 | **NEW** Fraction line plots + redistribution [5.MD.B.2] | plot eighths; then even the jugs out (the mean, seeded) | build plot → redistribute-equally question | dots-as-counts vs dots-as-measurements (M3-wk13's trap, fraction register) | even-out vs add-up questions | even-out-the-jugs (figure R) |
| 15–16 | EXISTS(D21, D22) as built: order of operations & expressions · coordinate plane Q1 & patterns | (CGP §3) | | | | |
| 17 | **NEW** Two patterns, one table [5.OA.B.3] | two rule-machines run side by side; rows become ordered pairs | generate both, form pairs, plot them (feeds D22's plane) | compares single terms, not the RELATION between sequences | "+3 each" vs "×3 each" — same start, different worlds | graph the pair-walk |
| 18 | EXISTS(D23) Angles & shape hierarchies [4.MD.C.7 home] | as built | (CGP §3) | | | |
| 19 | **NEW** The hierarchy courtroom [5.G.B.3/B.4] | properties inherit DOWNWARD (D23's ASN, grown into the week) | classify, then defend a membership two levels apart | "a square stops being a rectangle" (exclusive categories) | belongs-to vs is-typical-of (a square is an untypical rectangle) | build the family tree + defend one surprise (figure R) |
| 20 | EXISTS(D24) Volume [5.MD.C.3/C.4/C.5ab] | as built | (CGP §3) | | | |
| 21 | **NEW** Volume by parts [5.MD.C.5c] | an L-shaped tank is two boxes wearing one skin | decompose, compute both, add | uses the outer bounding box's three dimensions | which cut makes the two boxes (two valid cuts exist) | design-a-desk-organizer: 24 cubes, two compartments |
| 22 | **NEW** Coordinate stories [5.G.A.2] | (x, y) pairs narrate a walk (D22's plane, real data) | read a path, answer distance-along-axis questions | x/y swap (E7's trap, on time) | along-x vs along-y moves | hidden-picture from real data (figure R) |
| 23 | **NEW** Order of operations with all numbers [5.OA.A.1 deepened] | D21's rules survive fractions and decimals | evaluate with (), fractions, decimals mixed | drops the brackets when fractions appear | same tokens, moved brackets — which value changes? | build-an-expression to hit 2 1/2 |
| 24 | **NEW** Real-world fraction problems [5.NF.B.6] | the bar-model plans the story before arithmetic | multi-step ×/÷ fraction stories | operation chosen by keyword, not structure | "of" as multiply vs "of" as belongs-to | write the recipe-scaling story |
| 25 | **NEW** The fluency line [5.NBT.B.5/6/7 consolidation — fluency-week pattern] | all three algorithms, decimals included, raised complexity | chains across algorithms | decimal point placed by digit-count, not reasoning | which algorithm + which point-rule | error-hunt across algorithms |
| 26 | **NEW** Ready for M7 | the year as one toolkit (D24's exit role, transferred) | mixed retrieval-heavy | mixed | tool choice unsignalled | exit check + reflection |

### M7 — Grade 6 (26 weeks; E-format)

EXISTS E1, E13. Cross-moves per §2: E18/E20/E21/E22 recipes land here; E8/E9 leave for M8.
13 NEW(recipe) rows author from FILL §6 verbatim (+ stated deltas); 11 NEW.

| Wk | Concept | Anchor | Key multi-step | EA (verify) | Discrimination | Day-5 signature | Flag |
|----|---|---|---|---|---|---|---|
| 1 | EXISTS(E1) Ratios [6.RP.A.1] | ratio table as structure-preserving machine | as built | adds to both terms | additive vs multiplicative growth | "which is more lemony" defense | exemplar |
| 2 | **NEW(recipe E2)** Rates & unit rates [6.RP.A.2/A.3b] | for-ONE price | as recipe | compares totals not rates | cheaper-per-unit vs cheaper-total | design the better deal | |
| 3 | **NEW** Ratio tables & tape diagrams [6.RP.A.3a] | the table IS the ratio made visible (E1's machine becomes the object) | fill, extend, plot the pairs | additive fill (E1's trap at table register) | table rows vs tape parts — same ratio, two pictures | two tables, one lemonade: same recipe? | |
| 4 | **NEW(recipe E3)** Meeting percent [6.RP.A.3c part] | per-HUNDRED grid | as recipe | 25% → 25.0 | 40% of 50 vs 50% of 40 | three names, one amount | |
| 5 | **NEW** Percent both ways [6.RP.A.3c completion] | the hundred-grid runs backwards: the part knows the whole | find-the-whole from part+percent; find-the-percent | always multiplies (30 is 60% of → 18) | percent-of vs is-what-percent vs find-the-whole | reverse-percent shop | |
| 6 | **NEW(recipe E5)** GCF, LCM & decimals [6.NS.B.4] | factor rectangles / common ladders | as recipe | LCM "just multiply" | GCF story vs LCM story | one pair, both tools | |
| 7 | **NEW(recipe E4)** Dividing fractions [6.NS.A.1] | scooping: how many 1/3s in 2? | as recipe | inverts the wrong fraction | ÷ by <1 makes MORE | why invert-and-multiply | R-lite |
| 8 | **NEW** The division we own [6.NS.B.2/B.3 — G6's fluency-line week] | D16/D20's algorithms, consolidated at G6 size | multi-digit ÷ and all decimal ops in chains | remainder vs decimal continuation confused | when to STOP dividing: remainder, decimal, or round? | which-form-of-the-answer court | |
| 9 | **NEW(recipe E6)** Negative numbers [6.NS.C.5/C.6a/C.7ab] | elevator / mirror line | as recipe | −8 > −3 "8 > 3" | bigger magnitude, smaller number | order a mixed weather week | |
| 10 | **NEW** Absolute value [6.NS.C.7cd] | distance-from-home has no direction | order by value AND by distance; interpret \|−30\| < \|−45\| | \|−5\| = −5 ("the bars keep the sign") | value order vs distance order (−45 is smaller AND farther) | cold-day ranking: coldest vs biggest-drop | |
| 11 | **NEW(recipe E7)** Four-quadrant plane [6.NS.C.6bc/C.8] | signs name the quadrant | as recipe | x/y swap | (−3,2) vs (2,−3) | hidden-picture | |
| 12 | **NEW** Polygons on the plane [6.G.A.3] | vertices are addresses; same-x/same-y sides have countable lengths | plot the vertex list, find side lengths, then perimeter/area | subtracts coordinates across the sign change raw (from 3 to −2 is 1?) | same-axis distance vs diagonal (which can we count today?) | draw-my-garden from a vertex list | figure R |
| 13 | **NEW(recipe E10)** Exponents & expressions [6.EE.A.1] | repeated × vs repeated + | as recipe | 3⁴ = 12 | 2³ vs 3² | insert grouping to hit a target | |
| 14 | **NEW(recipe E11)** Algebraic expressions [6.EE.A.2/B.6] | variable as any-number bag | as recipe | "3 more than twice n" → 2(n+3) | 2n vs n² vs n+2 | one expression, three stories | |
| 15 | **NEW(recipe E12)** Equivalent expressions [6.EE.A.3/A.4] | test-at-many vs true-for-all | as recipe | distribute-once | equal-at-one-x vs equal-at-ALL-x | prove-in-general | **R** |
| 16 | EXISTS(E13) One-step equations [6.EE.B.7/B.5] | balance — undo ONE move | as built | wrong inverse | which inverse move | equation from a balance story | |
| 17 | **NEW** The truth test [6.EE.B.5/B.8-intro] | an equation is a gate; numbers queue up to try it | test candidate sets; describe ALL numbers that pass an inequality | an inequality "has the one answer" | equation gate (one passes) vs inequality gate (a crowd passes) | describe-the-crowd + graph the ray | |
| 18 | **NEW** Two columns, one story [6.EE.C.9] | d = 65t is a machine with a t-dial | table → equation → graph; identify dependent | "time depends on distance" (dial confusion) | which column turns the dial (independent) vs reads out | two-column story → equation → graph | |
| 19 | **NEW(recipe E18, cross-move)** Area of polygons [6.G.A.1] | cut and rearrange | as recipe | slant side as height | base-height pair choice | two decompositions, one area | |
| 20 | **NEW(recipe E20, cross-move)** Surface area & volume [6.G.A.4/A.2 part] | unwrap the box (nets) | as recipe | counts 4 faces | SA (units²) vs volume (units³) | design a box for 24 cubes | |
| 21 | **NEW** Volume with fractional edges [6.G.A.2 completion] | quarter-cubes fill what unit cubes can't | pack with 1/2-unit cubes, reconcile with l·w·h | counts only whole cubes in a 3×2×1½ box | packing count vs formula — must agree | pack-the-half-height box | figure R |
| 22 | **NEW** What is a statistical question [6.SP.A.1/B.5ab context] | a statistical question expects answers that VARY | sort, fix, then plan one survey (n, units, question) | any question containing a number is "statistical" | one-answer questions vs varied-answer questions | fix-the-question + plan the survey | |
| 23 | **NEW(recipe E21, cross-move)** Center & spread [6.SP.A.2/A.3/B.5c] | mean as fair-share redistribution | as recipe | median without sorting | mean vs median on skew | one data set, two honest summaries | |
| 24 | **NEW(recipe E22, cross-move)** Data displays [6.SP.B.4] | bins group, bars count | as recipe | histogram bar read as one value | bar graph vs histogram | build-a-histogram | **R** |
| 25 | **NEW** Choosing the honest summary [6.SP.B.5cd] | three summaries audition for one data set | compute all, pick with reasons; watch one outlier move them | the mean is "the" answer everywhere | which summary a striking deviation drags | misleading-summary detective | |
| 26 | **NEW** Ready for M8 | the year as one toolkit | mixed retrieval-heavy chains | mixed | tool choice unsignalled | exit check + reflection | |

### M8 — Grade 7 (25 weeks; E-format)

Nothing built. 9 NEW(recipe) rows (E8/E9 cross-moves + E14–E17, E19, E23, E24); 16 NEW.

| Wk | Concept | Anchor | Key multi-step | EA (verify) | Discrimination | Day-5 signature | Flag |
|----|---|---|---|---|---|---|---|
| 1 | **NEW(recipe E8, cross-move)** ± integers [7.NS.A.1] | zero pairs | as recipe | −5+3 = −8 | minus-a-negative vs minus-a-positive | story where −(−3) is real | |
| 2 | **NEW(recipe E9, cross-move)** ×÷ rational numbers [7.NS.A.2ab] | continue the table downward | as recipe | neg×neg = neg | count-the-signs | why neg×neg is positive | R-lite |
| 3 | **NEW** Every rational, every form [7.NS.A.2d/A.3] | long division decides the decimal's fate: it ends or it loops | convert, then compute across forms | 1/3 = 0.3 "exactly" | terminating vs repeating (what the denominator predicts) | predict-the-decimal tournament | |
| 4 | **NEW** Unit rates with fractions [7.RP.A.1] | the for-ONE question survives fractions ((1/2 mi)/(1/4 hr)) | complex-fraction rates → compare | divides the "nicer" way (smaller by bigger) | per-one-hour vs per-one-mile (both are unit rates!) | fastest-walker defense | |
| 5 | **NEW(recipe E16)** Proportional relationships [7.RP.A.2] | through-the-origin line | as recipe | any increasing table is proportional | proportional vs additive table | is it proportional? defend | |
| 6 | **NEW(recipe E17)** Percent applications [7.RP.A.3 part] | percent-of as scaling | as recipe | 40% off then 20% off = 60% off | percent-of vs percent-off | best-deal tournament | |
| 7 | **NEW** Percent change & error [7.RP.A.3 completion] | the change rides on the ORIGINAL | increase/decrease/markup/percent-error chains | +20% then −20% "returns to start" (E17's trap, formalized) | change-of-what: original vs current base | price-history detective | |
| 8 | **NEW** Linear expressions [7.EE.A.1] | the area model runs both ways (C13→E12 lineage) | expand, factor, combine with rational coefficients | 2(x+3) = 2x+3 (distribute-once, G7 register) | factoring OUT vs dividing AWAY (the 1 that remains) | expression-makeover gallery | |
| 9 | **NEW** Rewriting tells a story [7.EE.A.2] | a + 0.05a vs 1.05a — same bill, two lights | rewrite, then read the new form's meaning | a rewritten form is "a different problem" | which form answers which question fastest | which-form-wins court | |
| 10 | **NEW(recipe E14)** Two-step equations [7.EE.B.4a] | undo in REVERSE order | as recipe | divides before un-adding | which move first | one equation, two paths | |
| 11 | **NEW(recipe E15)** Inequalities [7.EE.B.4b + 6.EE.B.8 carried] | the tipping balance + a ray of answers | as recipe | flips the symbol when adding | open vs closed dot; < vs ≤ | ASN: adding keeps the tip | |
| 12 | **NEW** Multi-step with every number [7.EE.B.3] | estimate → exact → sense-check, one pipeline | rational-number word problems, forms mixed mid-stream | converts everything to "the" one form even when it hurts | which form is KIND here (mental %, fraction shortcut, decimal grind) | three-forms one-answer relay | |
| 13 | **NEW** Scale drawings [7.G.A.1] | the scale factor is a ×-machine running both directions | lengths both ways + the area surprise (×k² not ×k) | doubling lengths "doubles" area | length scale vs area scale | redraw-the-map at a new scale | figure R |
| 14 | **NEW** Drawing from conditions [7.G.A.2] | three sticks decide a triangle — or refuse to | test triples (triangle inequality); unique vs many vs none | any three lengths make a triangle | determines-one vs determines-many vs impossible | possible-impossible-unique sort | R (construction medium) |
| 15 | **NEW** Slicing solids [7.G.A.3] | the cut face is a brand-new flat shape | predict the cross-section, then verify against the net/figure | every slice of a box is a rectangle "like its face" | parallel-cut vs diagonal-cut faces | predict-the-slice gallery | figure R |
| 16 | **NEW(recipe E19)** Circles [7.G.B.4] | wrap the string: π lives in every circle | as recipe | A = πd² | radius vs diameter | measure-π lab | **R** |
| 17 | **NEW** Angle equations [7.G.B.5 — D23's facts, equation register] | the unknown angle is an x inside a fact | write & solve from supplementary/complementary/vertical setups | applies the wrong fact (vertical treated as supplementary) | which fact the FIGURE licenses | build-an-angle-puzzle | |
| 18 | **NEW** Area, volume & surface area problems [7.G.B.6] | decompose-then-total (E18/E20 lineage, problem register) | composite 2-D and 3-D real-world chains | SA and volume swapped mid-problem (E20's trap, applied) | paint questions vs fill questions | paint-and-fill one object: two answers, two units | |
| 19 | **NEW** Sampling [7.SP.A.1/A.2] | a fair spoonful tastes the whole soup | sample → estimate → vary the sample, watch the estimate | a bigger sample fixes a BIASED method | random vs convenient spoonfuls | design-a-fair-survey + one deliberate trap | |
| 20 | **NEW** Comparing two groups [7.SP.B.3/B.4] | overlap measured in MAD-widths | compare centers as a multiple of spread | compares single members, not distributions | visibly-apart vs overlapping clouds | which-class-jumped-farther verdict | |
| 21 | **NEW(recipe E23)** Probability [7.SP.C.5/C.7a] | the 0–1 certainty line | as recipe | past flips change the next | "either-or means 50-50" | fair-game design | **R** |
| 22 | **NEW** The long run [7.SP.C.6/C.7b] | the spinner's promise vs its afternoon | predicted vs observed frequencies; estimate from data | a short run must match the model | model probability vs observed frequency | is-the-die-loaded trial | |
| 23 | **NEW** Compound events [7.SP.C.8] | trees and tables enumerate the worlds | list the space, then count the event | multiplies when outcomes overlap; adds when independent | AND-events vs OR-events in one game | two-spinner game design | R |
| 24 | **NEW(recipe E24)** Pre-algebra capstone [7.NS/7.EE mixed] | the year as one toolkit | as recipe (at M8 scope) | mixed | tool choice unsignalled | exit check + written reflection | R-lite |
| 25 | **NEW** Ready for M9 | placement-forward mix (the M9 seams previewed: exponents, plane, data) | retrieval-heavy chains | mixed | mixed | exit check + reflection | |

### M9 — Grade 8 (26 weeks; E-format; ALL NEW — no recipes exist)

BB parity: levels 8a/8b (Algebra). Built substrate to draw on: D21/E10–E14 expression-equation
chain, D22/E7 plane, C13/E12 distributive lineage, D23 angle facts, E21/E22 data.

| Wk | Concept | Anchor | Key multi-step | EA (verify) | Discrimination | Day-5 signature | Flag |
|----|---|---|---|---|---|---|---|
| 1 | **NEW** Rigid moves [8.G.A.1] | trace it, slide it, turn it, flip it — nothing stretches | apply two moves in a row, name what's preserved | a rotation "makes it smaller" | slide vs turn vs flip from before/after pairs | which-move-took-it-there | figure R |
| 2 | **NEW** Congruent by moves [8.G.A.2] | congruence = a move-recipe exists | find the recipe (sequence of two) between figures | congruent must face the same way | congruent vs merely-same-area | prove-it-with-moves | figure R |
| 3 | **NEW** Dilations [8.G.A.3] | the projector at the origin: coordinates multiply | dilate on coordinates, then compose with a slide | dilation ADDS to coordinates | scale factor 2 vs "+2 to every coordinate" | shadow-math gallery | figure R |
| 4 | **NEW** Similar by moves [8.G.A.4] | similar = congruent after a zoom | find recipe incl. one dilation; check side ratios | "similar means looks alike" | similar vs congruent vs neither (ratio check decides) | find-the-impostor | |
| 5 | **NEW** Angle facts, proved [8.G.A.5] | the transversal ladder (parallel lines wear matching angles) | chase angles through parallel cuts + triangle sum | alternate-interior claimed without parallelism | which pairs match BECAUSE parallel vs by vertical | the 180° tear-and-line argument | R-lite |
| 6 | **NEW** Integer exponents [8.EE.A.1] | the laws fall out of counting factors | simplify with all three laws, negatives included | 3²·3³ = 9⁵ (base multiplied); a⁰ = 0 | aᵐ·aⁿ vs (aᵐ)ⁿ | derive-the-law from factor-counting | |
| 7 | **NEW** Roots [8.EE.A.2] | √ undoes the square: area → side | solve x² = p, x³ = p; place √p between integers | √(a+b) = √a + √b | square root vs half; ∛ vs ÷3 | between-which-integers hunt | |
| 8 | **NEW** The size of numbers [8.EE.A.3/A.4] | ×10ⁿ is the zoom dial | estimate as one-digit ×10ⁿ; multiply/divide in scientific notation | 3.5×10⁴ "has 4 zeros" | 10× bigger vs 10ⁿ bigger | universe-scale ladder | |
| 9 | **NEW** Irrational numbers [8.NS.A.1/A.2] | some decimals never settle into a loop | classify; trap √2 between fraction fences | "every long decimal repeats eventually" / π = 22/7 | repeats vs terminates vs neither | fence-in-√2 (tighter and tighter) | R-lite |
| 10 | **NEW** Slope is a unit rate [8.EE.B.5] | the tilt IS the for-one price (E16's k, drawn) | compare two proportional relationships across representations | steeper judged by where lines exit the frame | steeper vs higher-at-one-point | two-runners graph verdict | |
| 11 | **NEW** Why slope is one number [8.EE.B.6] | every stair on the line is the same shape (wk4's similarity pays off) | derive y = mx (+b) from stair-triangles | slope "changes along" a straight line | same-line stairs vs different-line stairs | staircase proof | R-lite |
| 12 | **NEW** Linear equations, all terrain [8.EE.C.7] | the balance survives every legal move (E13→E14 grown up) | variables both sides, distribute, collect; count solutions | sign lost crossing "=" ; "every equation has one answer" | one vs none vs infinitely-many (x = x) | build an equation with NO solution | |
| 13 | **NEW** Systems [8.EE.C.8] | two stories, one meeting point | solve by graph + substitution; interpret the point | "the solution solves one of the lines" | crossing vs parallel vs same-line stories | break-even story design | |
| 14 | **NEW** What is a function [8.F.A.1] | the vending machine: one in, exactly one out | classify relations (tables/graphs/arrows) | a function "must have a formula" | one-output rule vs one-to-one (allowed repeats confuse) | function-or-not gallery | |
| 15 | **NEW** Comparing functions [8.F.A.2] | rate & start read from ANY costume (table, graph, rule, words) | compare two functions given differently | bigger starting value = "faster" | rate vs initial value | which-plan-wins tournament | |
| 16 | **NEW** Linear or not [8.F.A.3] | y = mx + b is a straight promise; x² bends | test linearity from equation/table/graph | "anything with an x is linear" | equal-differences vs equal-ratios tables | catch-the-curve | |
| 17 | **NEW** Build the function [8.F.B.4] | start + rate rebuild the whole rule | model from two points / a description; interpret m and b in units | rate read from y-differences alone (run ignored) | which number is the START vs the PER | taxi-fare reverse-engineering | |
| 18 | **NEW** The graph tells a story [8.F.B.5] | the graph is a diary, not a photograph | sketch from a story; read episodes (increase/flat/curve) | reads the graph as a picture of the road | steep vs fast; flat vs stopped | sketch-my-day + swap-and-read | |
| 19 | **NEW** The Pythagorean theorem [8.G.B.6] | three squares grow on a right triangle | verify the areas; state the converse | a + b = c (squares dropped) | legs vs hypotenuse (which square is alone?) | rearrangement-proof build | R |
| 20 | **NEW** Using the theorem [8.G.B.7] | hunt the right angle first | unknown sides in 2-D/3-D setups | hypotenuse mislabeled (longest LEG squared alone) | given-two-legs vs given-leg-and-hyp | ladder-and-wall problem set | |
| 21 | **NEW** Distance on the plane [8.G.B.8] | every segment owns a right triangle (D22/E7 pay off) | distance between coordinate pairs | distance = Δx + Δy (taxicab slip) | along-axis vs diagonal distance (M7-wk12's gap, closed) | treasure-map shortest path | |
| 22 | **NEW** Cylinders, cones & spheres [8.G.C.9] | the cone fills the cylinder three times | volumes; solve for a dimension | doubling the radius doubles the volume | r² vs r; cone vs cylinder vs sphere family | fill-lab: predict-then-pour | R |
| 23 | **NEW** Scatter plots [8.SP.A.1/A.2] | the cloud has a lean | describe association; fit a line by eye | association = causation; one outlier "breaks" it | positive vs negative vs none; linear vs curved lean | fit-and-defend the line | figure R |
| 24 | **NEW** The line that predicts [8.SP.A.3] | slope & intercept re-read in data units (wk17 pays off) | predict inside the cloud; interpret m and b | extrapolation trusted blindly far outside the cloud | interpolate vs extrapolate | predict-and-doubt | |
| 25 | **NEW** Two-way tables [8.SP.A.4] | rows and columns interrogate each other | build from survey data; compare row-relative frequencies | compares raw counts across unequal groups | counts vs percents-of-row | build-a-table + one honest claim | |
| 26 | **NEW** Algebra capstone: ready beyond [8.EE/8.F/8.G mixed] | the whole ladder as one toolkit | cross-family chains | mixed | tool choice unsignalled | exit check + written reflection | R-lite |

## 7. Acceptance check (prompt §4)

- **Every K–8 standard classified** — 229/229 in §3, each with served-prompt evidence or an explicit
  DRY citation. ✓
- **Zero unexplained ORPHANs** — all 88 name their M-table row (§3 M-home column ↔ §6 rows). ✓
- **M0–M9 tables complete enough to author from** — every NEW row carries concept, anchor, named
  misconception, Day-5 signature; every NEW(recipe) row points at its FILL §3–§6 source + delta;
  EXISTS rows cite the built week. Headers follow the per-level Deliverable-4 formats (M5/M6
  adoption stated). ✓
- **Split points stated with evidence** — §2: A11\|A12 · B12\|B13 · C4\|C5 · D12\|D13 ·
  E13\|E14 + 6 cross-moves, each with its content line. ✓
- Priority order honored — the six Grade-2 candidates settled first (§1), multi-seed, before the
  matrix was populated; 2.G.A.2 confirmed as the genuine orphan and seeded early (M3 wk9, ahead of
  the area chain it feeds). ✓


