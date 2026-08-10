# Fill Architecture — Levels A, B, C, E (Phase A → Opus executes as Phases B1–B5)

**Written:** 2026-07-27 (Fable 5, Phase A). Extends `FANOUT-AUTHORING-KIT.md` §D to the remaining 96
cells. Read with `POLISH-PASS-SPEC.md` (which must land FIRST — new families are born on `format.ts`,
the context-frame registry, and the revised metacog/error-analysis templates) and
`PHASE-B-BUILD-PLAN.md` (ordering, gates, cadence).

Existing A1/A2/B1/B2/C1/C2 template weeks are **old-engine ("before"-quality) and are rebuilt inside
their level's fill** — they are not shipped as-is. Fixtures MFM-A15/B14/D17 stay pinned as calibration
fixtures exactly as today.

---

## 1. Band settings (blueprint + presentation defaults per level)

| Setting | **A** (3–5) | **B** (6–7) | **C** (7–9) | **E** (10–12) |
|---|---|---|---|---|
| `audioFirst` | **true** (every prompt read aloud) | false (gloss audio available) | false | false |
| `oneOperationPerPage` | **true** | false | false | false |
| Timed elements | **NEVER — any timer is a hard FAIL** (`fluencySprint: null`) | sprint begins: ungraded, self-referenced | same as B | same, decoration-minimal |
| Dose | ~5 min, 3–4 items/day | ~8–10 min, 5 items | ~10 min, 5–6 items | ~10–15 min, 6 items |
| Sentences / vocab | ≤10 words, Tier-1 + taught words only | ≤15 words, terms glossed first use | ≤15 words, glossed | full precise vocab, unglossed |
| Answer modes | tap/circle/draw/color, oversized targets, icon-as-unknown | numeric pad + choice; box-as-unknown | numeric/choice/short-text | symbolic, ruled explanation lines, inequality/graph forms |
| Mascot / decoration | high | tapering | low | minimal |
| Multi-step (BB-G7) | **banned** — single-step pictorial real-world is the correct form | gentle 2-step (≥2/week per G7 B+) | 2-step standard, inverse-start enters (C5) | full D-contract incl. inverse-start, distractor-quantity |
| Metacog (BB-W12) | **N/A** | intro form: "will it pass 10?" predictions | estimate-first standard | full (check-back native in E13–E15) |
| Error-analysis | "help the puppet" — a *puppet/character* made the slip; oral/point response; truth still `verifyFor`-derived where numeric | written-lite (one sentence) | written | full ruled-lines + extension |
| Discrimination | perceptual contrast (see §3) | structural + first cross-op traps | cross-op standard | full |
| Parent strip | Teacher's-Note strip, **Day 5 only** (W7 A-form) — amended 2026-08-09, see note below | weekly note | weekly | weekly |

**Parent strip — AMENDED 2026-08-09 (owner ruling).** Rev 1 of this table mandated a Teacher's-Note
strip *every day* at band A. Nothing downstream can carry that: `validator.ts` (S-SCHEMA) rejects a
strip on Days 1–4, and `PuzzleGrove.tsx` renders `getPackDay(pack, 5).teacherNoteStrip` — hardcoded
to Day 5. A five-strip week therefore fails `bb-verify-packs` at every seed, and if it did not, four
of the five strips would render nowhere (the L27 class: content authored against a surface that does
not exist). A1 and A2 both shipped Day-5-only and each carried a disclosure saying so. Rather than
have all 24 Level-A weeks repeat that disclosure, the spec is amended to match the code: **the
band-A parent strip is weekly, on Day 5, exactly as at bands B–E.** Re-opening this means building
the renderer and relaxing the validator FIRST; it is not an authoring-time choice.

**Gate parameterization (required spec change, Phase B1):** `lib/pedagogy.ts` gates become
**band-keyed** — a single table `GATE_PROFILE[band]` mapping each §6 gate to
{on | off | band-variant + threshold}. D/E rows reproduce today's behavior bit-for-bit (regression:
Level D preflight outcomes unchanged). A-row turns OFF multi-step density & metacog, swaps in:
"≥1 single-step pictorial real-world item/day", "puzzle may be sanctioned solve-and-color",
"≥1 perceptual-discrimination item Days 2–3", "EA in puppet form". B/C rows scale thresholds
(B: ≥2 gentle 2-step week-wide; C: D-thresholds minus the Day-4 ≥1-multistep clause → C5 onward it
matches D). The kit's 200-seed self-verify command gains a `band` arg. **Do not weaken any D/E gate.**

## 2. New generator families (build centrally, in this order, before any fan-out)

| # | Module | Serves | Core generators + `answerFor` | Key notes |
|---|---|---|---|---|
| G1 | `lib/figures.ts` **+ a renderer** | all levels | none — a **structured figure convention**: `[figure:{type:'clock'\|'bar-chart'\|'ten-frame'\|'number-line'\|'grid'\|'spinner'\|'net'\|'array', params:{…}}]` replacing free-text `[image: …]`, **plus the React/SVG component that draws it** | See §2a — the renderer does not exist and this spec wrongly assumed it did. |

### 2a. ⚠ CORRECTION (2026-07-27) — the figure RENDERER does not exist

Rev 1 of this file specified `figures.ts` as a *data convention* and assumed something
downstream drew the picture. Measured on the live corpus, nothing does:

| Surface | Visual support today |
|---|---|
| `explanation.script` | 76/76 Level-D segments carry a good `visual` direction — rendered as *italic text in a dashed box* (`LessonRoom.tsx:113`, comment: "the design pass renders real visuals"). The design pass never happened. |
| `guidedExamples` | **0/96 have any visual field** — the schema has no slot. This is the worst gap: worked examples are exactly where a teacher draws. |
| Day items (Level D) | **0/610 carry a figure.** D9's number-line equivalence item asserts in prose that a mark does not move when the partition changes — the whole insight is visual. |
| Day items (Level A) | **18/26 carry `[image: …]` that nothing renders.** `PracticePage.tsx:382` prints the prompt raw, so a pre-reader sees the literal characters `[image: 3 acorns in a row]`. **Level A cannot ship without the renderer.** |

What exists instead: a per-item scratchpad (child draws, never graded), the AnchorPanel,
audio narration, the hint ladder. The child can draw; the child is never shown.

**Also implicated: the authenticity gate.** BB-W6 (visual→symbolic register match) and BB-W8
(answer mode matches the task) have been scored by reading *stage directions* for pictures
nobody rendered — the same blind spot as the surface defects, one layer up.

**Required scope (~9 primitives, deterministic from the item's own params, so a figure cannot
disagree with its answer — the `answerFor` discipline applied to pictures):** number line with
partition + marked point · bar model · area grid with shaded and double-shaded regions ·
ten-frame / counter groups · place-value chart · clock face · coin set · coordinate grid ·
angle-and-shape figure. These recur constantly across A–E, which is why a small set goes far.

**Sequencing (user-approved 2026-07-27):** deferred, not dropped. Finish B0 (its fixes are
independent of rendering), then build the renderer as **B1.0, before any level fill** — Level A
is blocked on it and B/C/E lean on it heavily.
| G2 | `lib/clock.ts` | B12 B17 C18 | read analog (h, m granularity by week), position→time, elapsed-within-hour; `answerFor` from `{h,m[,m2]}` | Distractors: hand-swap, quarter-past/to flip, hour-hand-drift near o'clock (C18). Figure = clock params. |
| G3 | `lib/money.ts` | B16 (+E2/E17 prose) | count coin set, choose-coins-to-pay, two-ways-to-make-N¢ (set answer); `answerFor` over integer **Cents** | Born on `fmtMoney` (POLISH P1). B band: `¢` for sub-dollar, `$` for wholes. Distractors: count-coins-not-values, nickel=1. |
| G4 | `lib/ratio.ts` | E1 E2 E3 E16 E17 | equivalent-ratio fill, ratio-table cell, unit rate, better-buy (choice), pct↔frac↔dec, percent-of/off, k-of-proportionality | Exact integer-scaled math in `compute.ts` (percent = base·p/100). Distractors: additive-scaling, part:part↔part:whole, stacked-percents. |
| G5 | `lib/integers.ts` | E6 E7 E8 E9 | order/oppose/abs, signed add/sub chains, signed mul/div, four-quadrant plot/name/reflect | **`compute.ts` audit required:** Frac/Dec ops must be signed-safe (they were built for non-negative D content). Extend + unit-test before authoring. |
| G6 | `lib/algebra.ts` | E10–E15 | evaluate exponent expr, evaluate-at-x, one/two-step equation solve (inverse ops), inequality solve + `{op,bound}` answer form, equal-at-x checks | `verifyFor` twins for EA (wrong-inverse, distribute-once, flip-when-adding). Inequality answers validate as `{symbol,bound}` pairs, not free text. |
| G7 | `lib/stats.ts` | E21 E22 E23, B23 C23 | mean/median/mode/range over drawn arrays, graph reads (value, how-many-more) off figure params, probability as reduced fraction, complement | Guard drawn arrays for clean medians/means where the week wants them (or teach the fraction mean deliberately — blueprint decides, don't leave to chance). |
| G8 | `lib/earlynumber.ts` | Level A (+B1–B5 reuse) | count arrangement, ten-frame read/build, numeral↔set match, order/neighbor, pattern-next (AB/ABB/AAB), partners-of-5/10 (icon-as-unknown), picture join/take-away, direct compare (length/weight/capacity via figure), shape/solid choice, teen = 10+n | All answers computable (cardinality, bond partner, next-in-pattern…). Puppet-EA variants carry `verifyFor` on the numeric truth. |

Dependencies: G1 first (everything emits it); G3 after POLISH P1; G5's compute audit before G6
(equations reuse signed ops). G2/G8 independent — parallelizable if two builders, else in table order.

## 3. Level A — a different pedagogy, not a scaled-down D (design section)

**The design stance:** at 3–5 the "why" is enacted, not read. The modeled think-aloud is a read-aloud
script over a picture; "independent" means *the child does it with objects*, not "solves cold on
paper". Production tasks (the house Day-5 signature) become **make/show/build**: "show me all the ways
to make 5", "build the pattern", "sort and tell me how you knew" — the telling is oral (R-flagged),
the making is computable (a set/choice answer).

**A-band discrimination is perceptual, and it is real math.** The misconception space at this age is
conservation and symbol confusions, and the recipes below target them by name: longer-row-means-more
(A5), scattered-vs-row same count (A1/A2), digit reversals and 6/9 flips (A3/A4), teen-vs-ty audio
confusion (A9), 24-vs-42 digit order (A22), bigger-means-heavier (A20), rotated-square-is-a-diamond
(A7), 2-parts-vs-2-EQUAL-parts readiness (B22's seed lives in A7's equal-corners talk).

**A-band error-analysis = "help the puppet."** A named puppet (not "a student") double-counts, skips
an object, starts counting-back on the wrong number, writes 31 for thirteen. The child *points at* or
*fixes* the slip; the numeric truth is still `verifyFor`-recomputed. The word "wrong" is avoided even
here — "Pip got mixed up! Where?" (Child-safe law: this is the A-band form of the third-party
carve-out.)

**Structure per A-week:** 3–4 items/day; Day 1 concept-echo with manipulative figure; Day 2–3 practice
+ one perceptual discrimination; Day 4 one real-world *single-step* picture problem (G7 A-form); Day 5
sort/match/build + oral tell (computable core + R oral part). Puzzle: sanctioned solve-and-color /
color-by-value or a build task. Retrieval: warm-up games ("show 4 fingers"), never labeled review.

### Level A per-week recipes

| Wk | Concept | Anchor | Core forms (G8) | Discrimination (perceptual) | Puppet-EA | Day-5 |
|----|---|---|---|---|---|---|
| A1 | Counting 1–5 | touch-count, one tap per object | count arrangement, tap-count | same 4 in a row vs scattered — still 4? | double-counts one object | sort cards by how-many (+oral R) |
| A2 | Counting 6–10 | ten-frame | frame read/build, count row | longer row of 5 vs tight row of 6 — which is MORE? | skips an object mid-count | match sets ↔ numerals |
| A3 | Writing 0–5 | trace → write | trace, write-from-count | correct 3 vs mirrored 3 | puppet writes the mirror digit | numeral↔set match |
| A4 | Writing 6–10 | trace → write | write-from-count, frame→numeral | 6 vs 9 flip | writes 9 for six | numeral↔set match |
| A5 | More, fewer, same | one-to-one matching lines | compare sets via pairing | **longer-line-vs-more (conservation — THE A trap)** | says the spread-out row has more | sort pairs: more/fewer/same |
| A6 | Ordering to 10 | number path | next/before, order 3 cards | forward vs backward neighbor | puts 7 right after 5 | fix the mixed-up path |
| A7 | Flat shapes | sides-and-corners feel | choose shape, count corners | rotated square is still a square | calls the tilted square "a diamond" | shape sort by property (+oral R) |
| A8 | Position & sorting | above/below/beside scene | choose position word, attribute sort | left/right vs above/below | sorts one item by the wrong attribute | two-way sort |
| A9 | Counting 11–20 | ten-frame + extras | count on from 10 | **thirteen vs thirty (audio!)** | counts "…12, 14…" | match teen sets |
| A10 | Writing 11–20 | "ten and 3 more" | write teens, frame→numeral | 13 vs 31 | writes 31 for thirteen | numeral↔set match |
| A11 | Patterns | say-the-pattern-aloud | what-comes-next (AB/ABB/AAB) | AB vs ABB | continues ABB as AB | fix-the-broken-pattern; make-your-own (R) |
| A12 | Partners of 5 | 5-frame hiding game | how-many-hiding (**icon-as-unknown** — algebra thread A-form) | partners vs plain count | says 2 hiding when 3 shown of 5 | show ALL ways to make 5 (set answer) |
| A13 | Partners of 10 | ten-frame hiding | partner of 10 | partner-of-5 vs of-10 | uses the 5-partner for 10 | partner-pairs match |
| A14 | Meeting addition | join stories acted out | picture-join count-all | joining vs just-looking scenes | counts only the new birds | tell a join story for 2+3 (oral R) |
| A15 | Addition within 10 | count-on from bigger | picture add, count-on | count-all vs count-on | starts count-on AT the first number | (fixture MFM-A15 pinned; generated week mirrors it) |
| A16 | Meeting subtraction | take-away acted out | picture take-away | **which picture shows take-away?** (join vs remove) | adds when the story removes | story-sort: add vs take-away |
| A17 | Subtraction within 10 | count-back on path | picture sub, count-back | count-back vs count-on | counts back starting at the start number (off-by-one) | match story ↔ number sentence |
| A18 | Add & subtract together | choose the move | mixed picture problems | +/− choice from picture | picks + for a removal story | true/false sentence sort (3+1=4 ✓, 5−1=3 ✗) |
| A19 | Length & height | line up at a common start | longer/shorter/taller choice | **staggered-baseline trap** | compares without aligning ends | order 3 objects (figure, R) |
| A20 | Weight & capacity | balance tilts down = heavier | heavier/lighter, holds-more | **big balloon vs small stone** (bigger ≠ heavier) | says the bigger one is heavier | predict-then-sort (+oral R) |
| A21 | Solid shapes | roll / stack / slide test | which solid, which rolls | circle (flat) vs sphere (solid) | stacks the sphere | build-and-tell (R) |
| A22 | Counting to 50 & tens | tens-towers | count by tens, how many tens | **24 vs 42** | reads 24 as "forty-two" | tens-and-more match |
| A23 | Teen numbers = 10+some | full frame + extras | 10+n choice, icon-as-unknown | 10+3 vs 3+10 vs 13 (all the same!) | breaks 17 into 7 and 7 | break-apart match |
| A24 | Ready for B | mixed stories | retrieval-heavy mix of A12–A23 | mixed +/− choice | (mixed) | "my favorite way to make 10" (oral R) |

**Consolidation weeks (A24/B24/C24/E24) vs BB-G1:** frame as documented *deepening* — "integration of
the level's skills at raised complexity", explicit `deepeningDelta`, retrieval share raised toward
30%, and a real exit-check emphasis (D24 is the pattern). Never a bare mixed-review pile.

## 4. Level B per-week recipes

On-thread algebra weeks: **B6, B7, B8, B15** (balance-scale / missing-part forms — W13 band form).
New families used: G2 (B12/B17), G3 (B16), G7-lite (B23). Everything else reuses A2/A6/G8 + situations.

| Wk | Concept | Anchor | Multi-step (gentle) | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| B1 | Numbers to 120 | 100-chart walks | chart chain: 47 → +10 → +1 | reads 106 as "sixteen" | 106 vs 160 | chart-hole fill + pattern tell |
| B2 | Tens and ones | bundles & sticks | build then add a stick | writes 302 for "3 tens 2 ones" | 3t2o vs 2t3o | build-the-number two ways |
| B3 | Comparing | tens first | +10 then compare | compares by ones digit (39>41) | 39 vs 41 | true/false symbol sort |
| B4 | Count on & back | number-line hops | on 3 then back 2 | hops the start number | on vs back from story | write the hop story |
| B5 | Make ten to add | fill the frame, carry the spill | 8+5 via 8+2+3 (the bridge IS 2-step) | bridges to 12 (miscounts spill) | needs-bridge vs not (8+5 vs 8+1) | show the bridge two ways |
| B6 | Balanced equal sign | balance scale | both-sides totals | says 3+4=7+2 is fine "because 3+4 is 7" | "= means the answer comes next" trap: is 8 = 3+5 OK? | true/false equation sort |
| B7 | Missing addends | missing part on the balance | two-part story | adds the parts instead of finding the part | missing-part vs missing-whole | write a missing-part story |
| B8 | Fact families | part-part-whole triangle | family then a new fact | writes 5−4=9 into the 4/5/9 family | which fact does NOT belong | build a family from 2 numbers |
| B9 | Story problems within 20 | situation frames | join-then-take chains | answers the wrong question asked | **"3 more than" comparison ≠ add-3-to-answer** | write-your-own story (keyword) |
| B10 | Adding tens | tens-blocks | +tens then +ones | 40+30=43 | 40+30 vs 40+3 | tens-pattern hunt |
| B11 | Two-digit + one-digit | ones meet ones | add then compare | **47+5 = 412 (concatenation)** | crosses-ten vs not | sort: bridge or no bridge |
| B12 | Time: hour & half **G2** | short hand tells the hour story | (n/a — reads) | reads the long hand as the hour | **hand-swap trap** | match times ↔ daily events; draw hands (figure R) |
| B13 | Addition within 100 | trade ten ones for a ten | three addends | carry dropped (63 for 47+26 → 613/63 pair) | regroup vs no-regroup | two ways to add 38+25 |
| B14 | Subtraction within 100 | break a ten | sub then check by adding back (metacog) | **smaller-from-larger (63−47=24)** | needs-borrow vs not | (fixture MFM-B14 pinned; week mirrors) |
| B15 | Compare & change stories | comparison bars | 2-step by construction | subtracts when "more" appears in comparison | **"more" as add vs "how many more" as subtract** | write both questions for one picture |
| B16 | Money **G3** | count coins by value order | pay then count what's left | counts a nickel as 1 | **3 pennies vs 1 dime (more coins ≠ more money)** | two ways to make 25¢ (set answer) |
| B17 | Time: quarter hours **G2** | the minute hand's journey | schedule ordering | quarter-to read as quarter-past | quarter-past vs quarter-to | order a day's schedule |
| B18 | Skip counting 2/5/10 | hops on the line | skip-count then add extras (pre-×, `usesPriorSkill`) | loses the pattern mid-stream | 2s vs 5s pattern spot | pattern-hunt production |
| B19 | Even, odd & fair shares | pair-up test | share then check pairs | "15 is even — it ends in 5's count" | ends-in digit vs pair test | ASN: "an even number always shares fairly by 2" |
| B20 | Arrays & repeated addition | rows of the same size | array + extras | counts one row for the total | **3 rows of 4 vs 4 rows of 3 — same total?** | build all arrays for 12 (set answer) |
| B21 | Measuring length | units end-to-end, no gaps | measure two, compare | gaps-and-overlaps count | **same object, different units → different numbers** | measure with two units + why differ |
| B22 | Halves & quarters | fair fold | fold then count parts | shades 1 of 2 UNequal parts as "half" | **2 parts vs 2 EQUAL parts** | fold-and-tell (figure R) |
| B23 | Bar graphs & line plots **G7** | bars are stacked counts | read two bars, combine | reads the tallest bar for the asked category | tallest vs asked-for | build a line plot from data (figure R) |
| B24 | Ready for C | mixed 2-step stories | native | (mixed) | +/−/story-type choice | exit check + reflection (oral R) |

## 5. Level C per-week recipes

C reuses A2/A3/A4/A6/A7/A11/A13 archetype generators; new small generators: fraction-of-a-set (C17)
and scaled-graph reads (C23, via G7). Inverse-start multi-step (ceiling F3) enters at C5.

| Wk | Concept | Anchor | Multi-step | EA (verify) | Discrimination | Day-5 signature |
|----|---|---|---|---|---|---|
| C1 | Place value to 1,000 | h-t-o chart | build then compare | reads 407 as "forty-seven" | face vs value | number riddles ("I have 4 hundreds…") |
| C2 | Compare & round | number-line neighborhoods | round two then compare | rounds 45 down "because 4 is small" | which ten is nearer vs which digit is bigger | ASN: rounding to 10 changes the ones to 0 |
| C3 | Addition within 1,000 | column + regroup | three addends; add-then-estimate check | carry dropped across hundreds | one-regroup vs two-regroup | two strategies for one sum |
| C4 | Subtraction within 1,000 | break across zero | sub then add-back check | **302−158 borrow-across-zero** | where the borrow lands | error-hunt gallery (verify) |
| C5 | Two-step +/− stories | the plan before the math | **the concept IS multi-step; inverse-start enters** | does the steps in sentence order when wrong | which operation FIRST | write-the-question production |
| C6 | Meeting multiplication | equal groups | groups then extras | adds 3+4 for 3×4 | **3 groups of 4 vs 3 and 4** | draw a groups story two ways |
| C7 | Facts ×2 ×5 ×10 | skip-count ties (`usesPriorSkill` B18) | fact then add | ×10 as +10 | ×2 vs +2 | product-pattern hunt (5s end in 0/5) |
| C8 | Facts ×3 ×4 | double, then double again | fact chain | adds a group instead of doubling | ×3 vs ×4 array slice | which facts can doubling reach? |
| C9 | Meeting division | **sharing vs grouping — two meanings** | share then leftover | 12÷3 = 9 ("take 3 away") | sharing story vs grouping story sort | write one story of each meaning |
| C10 | Fact families ×/÷ | triangle | family then a missing-factor | 12÷3 = 36 | which member is missing | missing-factor = division (on-thread) |
| C11 | Facts ×6 ×7 | 5s + one more group (distributive seed) | near-fact estimate then exact (metacog) | 6×7 off by one group | 6×7 vs 6×6+6 (same!) | build a hard fact from an easy one |
| C12 | Facts ×8 ×9 | 9s digit-sum pattern; ×8 = double ×4 | fact then compare | 9×7 = 62 (pattern slip) | 8s vs 9s pattern | pattern-proof: why 9s digits sum to 9 (R-lite) |
| C13 | Distributive thinking | split-the-array | native 2-step | multiplies both parts by both (double-count) | valid vs invalid split | split 7×8 three ways |
| C14 | Multiply by tens | 3×4 tens | multiply then add | zero dropped (3×40=12) | 3×40 vs 3×4 | how many zeros and WHY |
| C15 | Meeting fractions | equal-parts naming | (single-step; band) | counts the unshaded parts | **1/3 needs EQUAL thirds** | fold/draw thirds (figure R) |
| C16 | Equivalent & comparing | number line + benchmark | rename then compare | 1/8 > 1/3 "because 8 > 3" | bigger-bottom trap | benchmark sort (D9's little sibling) |
| C17 | Fractions of a set **new gen** | share the set into groups | fraction-of-set then add/remove | answers with the denominator | 1/3 of 12 vs 3 of 12 | two stories for 1/4 of 8 |
| C18 | Time to the minute **G2** | minute marks ride in fives | elapsed within the hour (2-step) | **2:55 read as 3:55 (hour-hand drift)** | 5-min marks vs single minutes | schedule + elapsed production |
| C19 | Mass & liquid volume | benchmark units | combine then compare | reads the wrong scale interval | g vs kg choice | **estimate-first is the content** — benchmark hunt |
| C20 | Area | cover and count | rows × columns (ties to arrays, `usesPriorSkill`) | skips partial rows in the count | area count vs side count | same area, different shapes |
| C21 | Perimeter vs area | fence vs field | both on one figure (2-step) | adds all sides for area | **THE cross-op week by design** | same perimeter, different areas (deep) |
| C22 | Quadrilateral families | property nesting | classify then justify | "a tilted square is a diamond, not a square" | ASN across the hierarchy | **a square IS a rectangle** — sort + defend (figure R) |
| C23 | Scaled graphs **G7** | the key tells the worth | read two, combine | **3 symbols read as 3 (ignores scale 5)** | symbol count vs value | build a scaled graph question |
| C24 | Ready for D | mixed multi-step | native | (mixed) | operation choice unsignalled | exit check + strategy reflection |

## 6. Level E per-week recipes

Full D-contract (all 13 gates + F1–F6 lifts). New families G4/G5/G6/G7 carry it. On-thread: E11–E16.

| Wk | Concept | Anchor | Key multi-step | EA (verify) | Discrimination | Day-5 signature | Flag |
|----|---|---|---|---|---|---|---|
| E1 | Ratios **G4** | ratio table as a structure-preserving machine | scale then compare recipes | **adds the same number to both terms** | additive vs multiplicative growth | "which is more lemony" defense | exemplar |
| E2 | Rates & unit rates | for-ONE price | unit rate → total; better-buy chain | compares totals, not rates | cheaper-per-unit vs cheaper-total | design the better deal | |
| E3 | Meeting percent | per-HUNDRED grid | convert then compare | 25% written 25.0 (point drop) | **40% of 50 vs 50% of 40 (equal!)** | three names, one amount (pct/frac/dec) | |
| E4 | Dividing fractions | scooping (how many 1/3s in 2?) | scoops in one whole → in k wholes | inverts the wrong fraction | **÷ by a fraction < 1 makes MORE** | why invert-and-multiply (instance computable) | R-lite |
| E5 | GCF, LCM & decimals | factor rectangles / common ladders | GCF then simplify | LCM "just multiply them" | **GCF story vs LCM story** (tiles vs meeting buses) | one number pair, both tools | |
| E6 | Negative numbers **G5** | elevator / mirror line | temp drop then rise | **−8 > −3 "because 8 > 3"** | bigger magnitude, smaller number | order a mixed weather week | |
| E7 | Four-quadrant plane | signs name the quadrant | plot then reflect | x/y swap | (−3,2) vs (2,−3) | hidden-picture (figure params) | |
| E8 | ± integers | zero pairs | signed chains | −5+3 = −8 (adds magnitudes) | minus-a-negative vs minus-a-positive | write a story where −(−3) is real | |
| E9 | × ÷ rational numbers | continue the table downward (the honest why) | sign chains | neg × neg = neg | count-the-signs | why neg×neg is positive (pattern argument) | R-lite |
| E10 | Exponents & expressions **G6** | repeated × vs repeated + | order-of-ops with exponents; **grouping-required story (F5)** | **3⁴ = 12 (base × exponent)** | 2³ vs 3² | insert grouping to hit a target (D21's sibling) | |
| E11 | Algebraic expressions | variable as an any-number bag | evaluate at several x | "3 more than twice n" → 2(n+3) | 2n vs n² vs n+2 | one expression, three stories | |
| E12 | Equivalent expressions | test-at-many-values vs true-for-all | evaluate both at drawn x (computable core) | 2(x+3) = 2x+3 (distribute once) | equal-at-one-x vs equal-at-ALL-x | **prove-in-general: flagged open part** | **R** |
| E13 | One-step equations | balance — undo ONE move | solve then **plug back (check-back native)** | adds to both sides when it should subtract | which inverse move | write the equation from a balance story | |
| E14 | Two-step equations | undo in REVERSE order | native | divides before un-adding | which move first | one equation, two solution paths | |
| E15 | Inequalities | the tipping balance + a ray of answers | solve then graph | flips the symbol when adding | **open vs closed dot; < vs ≤** | ASN: adding to both sides keeps the tip | |
| E16 | Proportional relationships | through-the-origin line | find k then predict | reads any increasing table as proportional | **proportional vs additive table** | is this relationship proportional? defend | |
| E17 | Percent applications | percent-of as scaling | price → discount → tax (native chains) | **"40% off then 20% off = 60% off"** | percent-of vs percent-off | best-deal tournament (fmtMoney) | |
| E18 | Area of polygons | cut and rearrange | composite decomposition | uses the slant side as height | base-height pair choice | two decompositions, one area | |
| E19 | Circles | wrap the string (π lives in every circle) | C and A numeric (π≈3.14 declared) | A = πd² | **radius vs diameter** | **measure-π lab: flagged open part** | **R** |
| E20 | Surface area & volume | unwrap the box (nets) | SA from net; compare two boxes | counts 4 faces, not 6 | **SA (units²) vs volume (units³)** | design a box for 24 cubes | |
| E21 | Center & spread **G7** | mean as fair-share redistribution | add a point → what happens to the mean | median without sorting | **mean vs median on skewed data** | one data set, two honest summaries | |
| E22 | Data displays | bins group, bars count | reads off given displays (computable core) | histogram bar read as one value | bar graph vs histogram | **build-a-histogram: flagged figure part** | **R** |
| E23 | Probability | the 0–1 certainty line | P as fraction; complement | **past flips change the next flip** | "either it happens or not, so 50-50" | **fair-game design: flagged open part** | **R** |
| E24 | Pre-algebra capstone | the year as one toolkit | mixed cross-family chains | (mixed) | tool choice unsignalled | exit check + written reflection | R-lite |

## 7. The honest not-fully-computable list (ships computable core + flagged part; never faked)

| Cell | Computable core | Flagged open part |
|---|---|---|
| **E12** Equivalent expressions | evaluate-both-at-x items, code-checked distribute/combine instances | the prove-in-general argument (manual-review) |
| **E19** Circles | C/A numerics with declared π≈3.14, r-vs-d items | the measure-π string lab |
| **E22** Data displays | reads/compares off figure-param displays | build-a-histogram / box-plot pages |
| **E23** Probability | P-as-fraction, complement, 0–1 placement | invent-a-fair-game design |
| A-band oral Day-5s (A1, A7, A11, A14, A20, A21, A24 …) | the sort/match/build choice core | the oral "tell how you know" |
| B12/B17 draw-the-hands; B22 fold; B23 build-a-plot | the read/match core | the figure-draw/build capture |
| C15 fold thirds; C22 figure sort | the classify/choice core | the fold/draw part |
| E24 reflection | the mixed computational capstone | the written reflection |

Every flagged part renders as `manual-review` / `short-text-keyword` exactly per the D-established
convention; the correctness gate still covers 100% of the computable strand in these weeks.
