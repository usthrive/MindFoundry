# Evidence Ledger — school-math (Phase 2)

**Written:** 2026-11-17, started 19:26 EST, by the Phase 2 analyst (synthesis only; no new web
research). **Inputs:** R1–R4 lane files, phase0/EXAM-READING.md (incl. its Revision R1). The
external inbox was empty when this was written; any later drop is ingested as a numbered revision
block at the end (P2.1, P2.2, …), never by rewriting rows.

**Totals: 242 rows** — A 38 · B 70 · C 47 · D 26 · E 37 · F 11 · G 13; 15 conflicts resolved
(CR-1 … CR-15). **Labels:** single-label rows Confirmed 104 · Inferred 82 · Speculative 14; plus 42
hybrid rows (e.g. "Confirmed / Inferred"). Counted by strongest component: Confirmed 139 ·
Inferred 89 · Speculative 14.

**Labels.** **Confirmed** = a primary source states it (the ministry, the standards, the study
itself, the publisher or distributor, EdReports as to its own judgment, the child's paper, the
app's own maps). **Inferred** = several secondary sources agree, or it is a synthesis across
rows (every synthesis made here is Inferred, never Confirmed). **Speculative** = one weak source
(a single forum post always stays here) or reasoning without support. Confidence High / Medium /
Low. Hybrid rows give both parts ("Confirmed / Inferred"). Labels were upgraded only where a
second lane supplied the evidence; every change is listed in **Conflicts resolved** (CR-n) and the
superseded reading is kept there, annotated, not deleted.

**Citation style.** `R1:S14` = lane R1 source S14; `R4:P19` = lane R4 source P19; `R2:B4` = lane R2
book B4; `R3 §8` = a lane section; `EXAM` = phase0/EXAM-READING.md; `EXAM-rev` = its Revision R1
block; `CB` = phase0/COVERAGE-BASELINE.md (the app's own Kumon / Best Brains maps, as cited by
EXAM and R4). "Gap?" points to GAP-LIST.md (G1…G22).

**Rule for later phases.** The curriculum may not state a fact about Singapore-style maths, Math in
Focus, the standards or the child's exam that is not in a row here; where the ledger is silent it
uses a labelled design default from GAP-LIST.md.

No child's name appears anywhere, by rule.

---

## A. Grade-level content and order, Grades 1–5

### A.1 Common Core spine

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E1 | Common Core Grade 1. Critical areas: +/− strategies within 20; place value (tens and ones); length by iterating units; shape attributes. Domains: OA (problems, properties, within 20, equations) · NBT (count to 120; place value; ± using place value) · MD (length; time to the hour and half hour; data) · G (incl. halves and fourths) | R1:S23 (official CCSS PDF), R1 §6 | Confirmed | High | — |
| E2 | Common Core Grade 2. Critical areas: base-ten notation; fluency with + and −; standard units; shapes. OA: one- and two-step ± problems within 100; fluency within 20; equal groups (odd/even, arrays to 5×5). NBT: place value to 1,000; fluent within 100; **add up to four 2-digit numbers (2.NBT.6)**; ± within 1,000; mental ±10/±100; explain why strategies work. MD: standard length; time to 5 min and a.m./p.m.; money; line plots, picture and bar graphs. G: halves, thirds, fourths | R1:S23, R1 §6 | Confirmed | High | — |
| E3 | Common Core Grade 3: × ÷ within 100; unit fractions as numbers; area and perimeter; 2-D shapes; round to 10/100; fluent ± within 1,000; 1-digit × multiples of 10; time intervals, liquid volume, mass | R1:S23 | Confirmed | High | — |
| E4 | Common Core Grade 4: multi-digit × ÷; fraction equivalence, like-denominator ±, fraction × whole; decimal notation for fractions; factors and multiples; place value to 1,000,000; larger-to-smaller unit conversions; angles; classify by lines, angles, symmetry | R1:S23 | Confirmed | High | — |
| E5 | Common Core Grade 5: fraction ± with unlike denominators, fraction ×, limited ÷; 2-digit divisors; decimals to hundredths; numerical expressions; volume; coordinate plane; classify 2-D figures | R1:S23 | Confirmed | High | — |
| E6 | Absent from CCSS K–5: pie charts, line graphs (line plots only), percent/ratio/rate (Gr 6), nets (Gr 6), angle sum (Gr 7–8). Customary units are CCSS-only; the Singapore ministry list is metric only | R1 §6 (reading of S23 grade lists) | Confirmed | High | — |

### A.2 Singapore ministry placement

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E7 | 2021 syllabus framework: problem solving at the centre of a pentagon (concepts, skills, processes, metacognition, attitudes); 4 themes; 6 big-idea clusters (Diagrams, Equivalence incl. part-whole, Invariance, Measures, Notations, Proportionality); 3 strands (Number and Algebra; Measurement and Geometry; Statistics); pedagogy in three phases (Readiness, Engagement, Mastery); relational over instrumental understanding | R1:S1 (read in full); R2:S7 (TIMSS 2023 ministry chapter, same five components) | Confirmed | High | — |
| E8 | In 2026 the 2021 syllabus covers all of P1–P6 (P6 joined from 2026); P1–P4 common; P5–P6 split Standard / Foundation; assumes no formal maths before P1; the ministry permits reproduction for personal non-commercial use | R1:S1 | Confirmed | High | — |
| E9 | The 2021 syllabus text never uses "concrete-pictorial-abstract", "bar model", "model drawing" or "number bond"; only "part-whole relationships" (under Equivalence) and "diagrams". The method vocabulary lives in textbooks, the older syllabi and the ministry's TIMSS 2023 chapter | R1:S1 (full-text search); R2:S1, S7 | Confirmed | High | — (CR-1) |
| E10 | MOE P1 (≈ Grade 1): numbers to 100, ordinals to 10th; + and − concepts and relationship; three 1-digit addends; **± within 100 with written algorithms**; mental within 20, 2-digit ± ones without renaming, 2-digit ± tens; × within 40, ÷ within 20; money (cents to $1, dollars to $100); length in cm; time to 5 min, a.m./p.m.; 2-D shapes incl. half/quarter circles; picture graphs | R1:S1 pp. 31–44 | Confirmed | High | — |
| E11 | MOE P2: numbers to 1,000, odd/even; ± algorithms up to 3 digits; mental 3-digit ± ones/tens/hundreds; tables of 2, 3, 4, 5, 10 with ÷; **fractions** (of a whole; compare unit and like fractions ≤ 12; ± like fractions within one whole); money in decimal notation; m, kg, g, ℓ; time to the minute, h ↔ min; 2-D patterns; 3-D shapes; picture graphs with scales | R1:S1 | Confirmed | High | — |
| E12 | MOE P3: numbers to 10,000; ± algorithms to 4 digits; mental two 2-digit numbers; tables 6–9; ÷ with remainder; 3-digit × 1-digit; equivalent fractions, simplest form, compare unlike, ± related fractions; money ±; km, ml, compound units and conversions; seconds, 24-hour clock; area and perimeter; angles; perpendicular and parallel lines; bar graphs | R1:S1 | Confirmed | High | — |
| E13 | MOE P4: numbers to 100,000 with rounding; factors and multiples; × to 4×1 and 3×2 digits, ÷ 4 by 1 digit; mixed/improper fractions, fraction of a set, ± with up to two denominators; decimals to 3 places with ± and × ÷ by a 1-digit whole; composite area/perimeter; angles in degrees; line symmetry; nets; tables, line graphs, pie charts | R1:S1 | Confirmed | High | — |
| E14 | MOE P5 Standard: numbers to 10 million; order of operations; fraction × fraction, fraction as division; percentage (discount, GST, interest); rate; area of triangle; volume of cube/cuboid; angle facts; triangle and quadrilateral properties. P6: fraction ÷, ratio, algebra (letters, simple equations), circles, average | R1:S1 | Confirmed | High | — |
| E15 | 2013 → 2021 moves: cm, time to 5 min, half/quarter circles into P1; time to the minute into P2; 24-hour clock P4 → P3; pie charts and nets P6 → P4; average and ratio P5 → P6; speed to secondary | R1:S5 (tuition centre), MOE briefing slides via search snippets; consistent with R1:S1 | Inferred | Medium | G21 |
| E16 | Grade mapping used throughout: Singapore P1 ≈ US Grade 1 (children turn 7 in the year), P2 ≈ Grade 2, and so on | R1 §7 (general knowledge, not from S1); R2 §2 | Inferred | Medium | — |

### A.3 Math in Focus 2020 chapter order

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E17 | Grade 1 (13 chapters, 163 days, 131 aligned): Numbers to 10 · ± Within 10 · Shapes and Patterns · Numbers to 20 · ± Facts Within 20 · Numbers to 40 · Calendar and Time · ± Within 40 · Length and Weight · Numbers to 120 · ± Within 100 · Graphs · Money (Book B from Ch 8) | R1:S7 (Nutley), R1:S13 (EdReports confirms 9 titles) | Inferred (titles partly Confirmed) | High | G17 |
| E18 | Grade 2 (11 chapters, 160 days): 1 Numbers to 1,000 · 2 Addition Within 1,000 · 3 Subtraction Within 1,000 · 4 Using Bar Models: Addition and Subtraction · 5 Length · 6 Mass (EdReports: mass and liquid volume) · 7 Graphs and Line Plots (Book B) · 8 Multiplication and Division · 9 Multiplication Tables · 10 Time and Money · 11 Shapes | R1:S7–S10 (three districts agree), R1:S13 (EdReports confirms Ch 1–4, 7, 10, 11); EXAM (Ch 2 title on the paper) | Inferred (Ch 1–4, 7, 10, 11 Confirmed) | High | G17 (Ch 6, Ch 8 titles) |
| E19 | Grade 3 (12 chapters, 158 days): Numbers to 10,000 · Addition Within 10,000 · Subtraction Within 10,000 · Multiplication Tables · Multiplication · Using Bar Models: The Four Operations · Fractions · Measurement · Area and Perimeter · Time · Graphs and Line Plots · Angles, Lines and 2-D Figures | R1:S7, S13 | Inferred | High | G17 |
| E20 | Grade 4 (9 chapters, 151 days): Working with Whole Numbers · Multiplication and Division · Fractions and Mixed Numbers · Decimals · Conversion of Measurements (also "Units of Measurement") · Area and Perimeter · Angles and Line Segments · Polygons and Symmetry · Tables and Line Graphs | R1:S7, S13 | Inferred | Medium (Ch 5 title inconsistent) | G17 |
| E21 | Grade 5 (10 chapters, 156 days): Whole Numbers and the Four Operations · Fractions and Mixed Numbers · × ÷ Fractions and Mixed Numbers · Decimals · Four Operations of Decimals · Volume · Line Plots and the Coordinate Plane · Polygons · Ratio · Percent | R1:S7, S13 | Inferred | High | G17 |
| E22 | Grade 2 lesson structure (district-listed): Ch 2 = add fluently within 100; no regrouping; regroup ones; tens; ones and tens; **add four 2-digit numbers**. Ch 3 = the mirror for subtraction, incl. **across zeros**. Ch 4 = part-whole; adding on and taking away sets; comparing two sets; two-step real-world problems | R1:S7, S8, S9, S10; R3:S11, S12 | Inferred | High | — |
| E23 | Chapters 1–4 (numbers to 1,000 → addition → subtraction → bar models) are the same four topics in the same order in the older 19-chapter edition still used in some districts; the editions diverge from Ch 5 | R1:S11, S12 | Inferred | High | — |
| E24 | Math in Focus is "the U.S. Edition" of a Singapore curriculum developed by Marshall Cavendish Education, Grades K–8, distributed in the US by HMH; it adapts Singapore's *My Pals Are Here! Maths* (said by third parties and Evidence for ESSA; no publisher page found) | R1:S14, S15; R2:S38; R1 §4.4 | Confirmed (edition, distributor) / Inferred (lineage) | High / Medium | — (CR-2) |
| E25 | EdReports, Math in Focus "2021" listing, Grade 2 Gateway 1: Does Not Meet (focus 0/6, coherence 5/8, ≈ 35 %); 31 of 160 days not aligned to Grade 2; ≈ 54 % of days on major work (threshold 65 %); Ch 6, 8, 9 above grade (3.MD.2, 3.OA) | R1:S13; R2:S39 | Confirmed (as EdReports' judgment) | High | — |
| E26 | EdReports rates focus 0/6 in Grades 1, 2, 3 and 5 because whole chapters teach the next US grade (Gr 3 tests mostly 4.NBT.4/4.NBT.5/4.MD.1; Gr 5 Ch 9–10 all Grade 6 ratio/percent); Grade 4 "Partially Meets" (78 %) is the best-aligned year | R1:S13; R3:S5–S8 | Confirmed (ratings) / Inferred (pattern) | High | — |
| E27 | The publisher says it "intentionally included foundational work for the next grade" | R1:S14 | Confirmed | High | — |
| E28 | EdReports: thin Grade 2 practice on 2.NBT.6 (up to four 2-digit addends; only Section 2.6 Independent Practice cited, two problems), 2.NBT.1a (100 as ten tens), 2.NBT.3, 2.OA.3 (odd/even), 2.MD.2, 2.MD.7 (time to 5 min) | R1:S13; R2:S39; R3:S6 | Confirmed (as EdReports' finding) | High | — |
| E29 | 2.G.3 partitioning lives in Grade 2 Ch 11: the Ch 11 test asks pupils to partition two rectangles into thirds two ways and shade | R3:S6 | Confirmed | High | — (CR-6) |

### A.4 Other Singapore-lineage US editions

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E30 | Primary Mathematics 2022 Grades 1–5 chapter lists (Books A/B); re-sequenced closer to CCSS: no ÷, tables or mass in Gr 2; ratio, rate, percent in Gr 6; the publisher's FAQ calls it "entirely new" | R1:S19 (titles); R1 §5.1 (FAQ via snippets) | Confirmed (titles) / Inferred (reading; FAQ) | High / Medium | — |
| E31 | PM 2022 Grade 2 lesson titles: 2E "add three or four 2-digit numbers"; 3E "relate addition and subtraction"; Ch 4 = 4A Sum and Difference · 4B Part-Whole Model · 4C Comparison Model · 4D Word Problems. Whether 4A is the two-unknowns problem (his Q7) is not visible publicly | R1:S19 | Confirmed (titles) / Speculative (4A content) | High / Low | G4 |
| E32 | Dimensions Math Grades 1–5 chapter lists with suggested class periods; keeps the classic Singapore order (×/÷ tables and fractions in Gr 2; ratio, rate, percentage in Gr 5); number bonds are a whole Gr 1 chapter | R1:S20 | Confirmed | High | — |
| E33 | Primary Mathematics Common Core Edition: Gr 2 units include "add more than two numbers", "finding the missing number", mental addition near 100; Gr 3 Unit 2 has a lesson titled "Sum and Difference" | R1:S21 | Confirmed (titles) | High | G4 |

### A.5 Where Singapore is earlier or later

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E34 | Singapore runs ≈ one year ahead of CCSS in ×/÷ (P1–P2), fractions (P2–P4), measurement units and conversions (P1–P3), decimals (P4), percent/rate/ratio (P5–P6); later on rounding (P4 vs Gr 3), bar graphs (P3 vs Gr 2), coordinate plane (secondary vs Gr 5); no line plots or customary units | R1 §7 (S1 and S23 read side by side) | Inferred | High | — |
| E35 | The written algorithm for 2-digit ± is P1 in Singapore; CCSS Gr 1 asks for strategies (1.NBT.4), standard-algorithm fluency at 4.NBT.4 | R1 §7; R2:S1 | Inferred | High | — |
| E36 | Grade 2 fractions: Singapore P2 teaches fractions of a whole and ± like fractions (≈ 1–2 years ahead of CCSS); CCSS Gr 2 has only partitioning shapes; Math in Focus 2020 has no Grade 2 fractions chapter (the older edition had one) | R1 §7; R1:S12 | Inferred | High | — |
| E37 | Grade 2 multiplication: Math in Focus Ch 8–9 teach ×, ÷ and tables of 2, 5, 10, 3, 4 (CCSS Grade 3 content per EdReports); PM 2022 Gr 2 has equal groups, even/odd, skip counting only; Madison NJ does not teach Ch 6 or Ch 9 | R1:S9, S13, S19 | Confirmed (EdReports, PM titles) / Inferred (district) | High | G1 |
| E38 | Districts reorder Book B freely: Time and Money anywhere Feb–May; Mass (Ch 6) moved to June "in preparation for Grade 3" or dropped; one district teaches Grade 4 Ch 6 before Ch 5 | R1:S7, S8, S9 | Inferred | High | G1 |

---

## B. Method parts

### B.1 Concrete → pictorial → abstract (CPA)

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E39 | CPA = act on real objects → work with pictures that stand for them → symbols alone. The ministry calls CPA "central" to primary pedagogy (TIMSS 2023 chapter); the 2007 syllabus says it "is advocated" | R2:S7, S1 | Confirmed | High | — |
| E40 | Origin: Bruner (1966) enactive-iconic-symbolic; Kho Tek Hong adopted CPA at the start of the Primary Mathematics Project (1979–80); in PMP materials from 1981 | R2:S2 | Confirmed | High | — |
| E41 | CPA repeats inside every new topic at every primary level (spiral curriculum); the concrete stage shrinks with age and with topics that build on known ideas | R2:S1, S7 (every level); R2:S2 + practitioners (shrinking) | Confirmed / Inferred | High / Medium | — |
| E42 | Two named failure modes: lingering too long in concrete/pictorial work, and skipping it to reach symbols fast; the scholarly record on CPA's classroom use is thin. A picture the child only looks at is closer to "skip" than to CPA | R2:S2; R2 §2.1 (the screen reading is R2's inference) | Confirmed (failure modes) / Inferred (screen reading) | High / Medium | — |
| E43 | Math in Focus uses CPA at all grades; each Teacher Edition chapter overview carries a "Concrete-Pictorial-Abstract Progression" and a grade-to-grade "Learning Continuum"; Learn Videos walk the CPA sequence | R1:S14, S15; R3:S2 | Confirmed | High | G2 |
| E44 | Time pressure makes some teachers jump to the abstract stage | R2 §2.1 (one practitioner site) | Speculative | Low | — |

### B.2 Number bonds

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E45 | A number bond is a small diagram of a whole joined to its parts; one bond carries a fact family; it is the first pictorial form of part-whole, which the bar model later scales up | R2 §2.2 (R2:S10, S1) | Inferred | Medium | — |
| E46 | The 2007 syllabus places "addition bonds up to 9 + 9 … committing to memory" in P1 — the official text also uses "bonds" for memorised facts | R2:S1 | Confirmed | High | — (CR-9) |
| E47 | Sequence: P1 bonds to 10 then 20, memorised; bonds drive make-ten and the move from take-away to find-the-missing-part; from P2 the bond's job passes to the bar model (word problems) and to place-value decomposition (652 = 600 + 50 + 2) | R2:S1 (P1); R2:S10 (parent-facing summaries) | Inferred | Medium | — |
| E48 | The child's act in Singapore practice: split a real set → fill the empty circle of a drawn bond → write the matching sentences; filling the missing part is the same structure as 635 + ? = 652 | R2:S10 | Inferred | Medium | — |
| E49 | Math in Focus: number bonds open Grade 1 Ch 2; Grade 2 Ch 2–3 use bonds for mental + and − (2.1, 2.3–2.5; 3.1, 3.3–3.5); Grade 3 Section 5.2 splits a number into parts for × | R3:S5, S7 (Gr 1, 3); R3:S11, S12 (Gr 2, district wording mirroring publisher objectives) | Confirmed (Gr 1, 3) / Inferred (Gr 2) | High | — |
| E50 | PM 2022 uses number bonds for number combinations in Grade 1 (1C); Dimensions gives bonds a whole Grade 1 chapter, drops them from the 2B/3 overviews, and says bonds are not used for × (bars instead, 2A Ch 7) | R1:S19; R1:S20 (overview objectives) | Confirmed / Inferred | High / Medium | — |

### B.3 The bar (model) method — types and order across grades

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E51 | The child draws rectangles sized roughly to the quantities, labels known and unknown parts, and reads the operation off the picture. Three basic forms: **part-whole**, **comparison**, **change / before-after**; then equal units (× ÷), fractions, ratio, percentage | R2:S8, S11, S12, S13; R2:B1 (monograph contents via retailer) | Inferred | Medium-High | G3 |
| E52 | Why it exists: a 1975 ministry study found only 46 % of pupils solved word problems that lacked cue words ("altogether", "left"); the method was built to replace key-word reading with structure | R2:S8 (Kaur 2019, abstract via search) | Inferred | Medium-High | — |
| E53 | History: first written up by Kho (1987, ICMI-SEAMS); entry date given as 1983 and as "late 1980s for P5–P6, now from P1" by the same author in different documents | R2:S11, S8 | Inferred | Medium | — (CR-13) |
| E54 | The ministry's monograph *The Singapore Model Method for Learning Mathematics* (CPDD 2009, Marshall Cavendish/Panpac) was launched in the US for Primary Mathematics and Math in Focus users; it gives the model taxonomy (part-whole and comparison per operation family, change, the unitary approach) but no lesson plans or grade sequence | R2:S14 (release); R2:B1 (retailer contents) | Confirmed (release) / Inferred (contents) | High / Medium | G3 |
| E55 | Math in Focus's publisher: the bar model method is "first introduced in Grade 2" and used through Course 2 (Grade 7) | R1:S14 | Confirmed | High | — |
| E56 | Start by series: Math in Focus 2020 and PM 2022 = Grade 2 Ch 4; Dimensions = Grade 3 (3A Ch 3 objectives); older Primary Mathematics US texts = Grade 3 (3A) (Beckmann 2004; ASCD 2007); Singapore schools' P2 decks list model drawing as new in P2 | R1:S14, S19, S20; R2:S46; R4:P17, P37 | Confirmed (MIF, PM 2022, Beckmann, ASCD) / Inferred (Dimensions overview reading; school decks) | High / Medium | — (CR-3) |
| E57 | Model forms by level in Singapore texts: P1–P2 part-whole and comparison, one-step; P3 two-step with a bracketed model, equal units for × ÷; P4 fractions (a fractional part becomes the unit); P5–P6 ratio, percentage, before-after and algebra-type problems before letter algebra | R2:S12 (Hoven & Garelick's reading), S13 (one school), S6 (P5–P6) | Inferred (no primary grade sequence) | Medium | G3 |
| E58 | Beckmann's reading of Singapore Primary Mathematics: a small set of strip diagrams reused across types and grades from Grade 3 (3A); **algebra story problems begin in Grade 4**, e.g. two groups from their total and their difference | R2:S46 | Confirmed (as Beckmann's reading of older editions) | High | G4 (CR-3, CR-4) |
| E59 | Fading rule: early items supply the model; later items require the child to build it | R2:S12; R4:P17 | Confirmed (article) | Medium | G2 |
| E60 | Math in Focus Grade 2 Ch 4: 4.1 part-whole (concrete sets → one-bar model) · 4.2 adding on / taking away (concrete → pictorial; write a number sentence from the picture) · 4.3 comparing two sets (→ two-bar comparison model) · 4.4 two-step problems with bar models | R3:S11, S12, S6 | Inferred | High | G2 |
| E61 | In Math in Focus the model is usually **supplied**: Grade 2 Cumulative Review 1 gives a bar diagram (multiple choice); the Ch 4 test prints a blank bar model + blank equation; the Ch 6 test asks the pupil to draw one; Grade 4 Gateway 2: pupils are usually given the model, MP4/MP5 "not met" | R3:S6, S9 | Confirmed | High | G2 |
| E62 | One district (Nutley): Grade 2 pupils need not draw bar models independently until Grade 3; in Grade 2 they use paper strips and label pictures of bar models containing a "?" | R1:S7; R3:S12 | Inferred (district rule, not publisher) | Medium | G2 |
| E63 | Working memory explained about a quarter of the variance in both drawing the model and solving (Singapore P5) | R2:S16 (search summaries of the NIE record) | Inferred | Medium | — |
| E64 | Production deficit: Singapore P5 and Sec 2 pupils judged given bar diagrams more correctly than their own drawings showed; they did draw longer bars for bigger numbers | R4:P40 | Confirmed | Medium | G8 |
| E65 | Critiques: bars are not meaningful without the underlying concepts; P6 pupils stuck to a wrong model for 15 minutes without switching plans; secondary pupils cling to models when algebra is due (advice: link each rectangle to a letter) | R2:S12, S30 (Confirmed); R2:S15, S16 (Inferred) | Confirmed / Inferred | Medium | — |
| E66 | Model-drawing routines in use: a US school's 7-step routine (read; rewrite the question as an answer sentence; name the units; one bar for part-whole or one per person for comparing; chunk the story onto the bars; compute; answer and check — school-authored, older edition); a Singapore school's "R.I.G.H.T." (Read, Identify keywords, Get a plan, Have it done, Triple check) | R3:S16; R2:S13 | Inferred / Confirmed (that school) | Medium | G6 (CR-15) |

### B.4 Place-value representations and regrouping

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E67 | Base-ten blocks are proportional; place-value disks/chips are not (value from label or column). Regrouping (Singapore textbook word "renaming", 2007 syllabus) is acted out as a trade on a place-value chart (ten 1s → one 10; one 10 → ten 1s), before and alongside the written column | R2:S1 (term); R2 §2.4 | Confirmed (term) / Inferred (description) | High / Medium | — |
| E68 | Math in Focus 2020 classroom kit: base-ten units, rods, flats Gr 1–4; thousand cubes Gr 2–4; **place-value chips only Gr 4–5**; place-value mats Gr 1–5; fraction circles/tiles Gr 3–5 | R3:S2 (kit-table columns rebuilt from PDF text positions) | Inferred | Medium | G14 |
| E69 | EdReports names place-value blocks in Grade 2 Section 2.5, counters on a place-value chart in Grade 3 Section 5.3, and place-value chips/disks in Grade 4 Sections 1.1, 1.3, 2.1, 4.3. With the kit table: **Math in Focus's concrete regrouping tool in Grades 1–3 is base-ten blocks on a place-value chart; chips arrive in Grade 4** | R3:S6, S7, S8, S9; R3:S2 | Confirmed (citations) / Inferred (conclusion; three sources agree) | High | — (CR-5) |
| E70 | Disks carry place value to 4–5 digits and to decimals at P3–P4, where proportional blocks become impractical | R2 §2.4 (retailer / practitioner) | Inferred | Medium | — |
| E71 | Grade 2 Ch 2–3 regrouping sequence: number-bond mental strategies within 100 → no regrouping (concrete + counting tape, then the vertical algorithm) → regroup ones, then tens, then both, each with blocks on a place-value chart first, then the algorithm → four addends (Ch 2) / across zeros, hundreds first (Ch 3); compensation ("add 10 and take away the extra ones"); rounding on a number line to check reasonableness | R3:S11, S12 | Inferred | High | G14 |
| E72 | The language of regrouping said aloud (not enough ones; regroup a ten as ten ones; how many tens are left; a hundred becomes ten tens) | R3:S16 (one school's parent workshop, older edition) | Inferred | Medium | — |
| E73 | Singapore P1 already teaches formal written algorithms for two 2-digit numbers (2007 syllabus; 2021 P1 lists algorithms within 100) | R2:S1; R1:S1 | Confirmed | High | — |
| E74 | Eureka Math (US, similar lineage): children draw chips on a place-value chart and bundle; regrouping with tens and ones comes before three places | R2:S18 | Inferred | Medium | — |
| E75 | Ma (1999): most of 23 US teachers taught a rote "borrowing" rule; many of 72 Chinese teachers framed it as decomposing a higher-value unit, grounded in subtraction within 10 and 20 — carry and borrow become one idea | R2:S23, S24 | Confirmed | High | — |
| E76 | Fuson et al. (1997): five conceptual structures for 2-digit numbers; link ten-based quantities, number words and numerals ("triads"); typical errors are tied to each method | R2:S21 | Confirmed (abstract) | Medium-High | — |
| E77 | Multi-digit errors are systematic "bugs" (Brown & Burton 1978; smaller-from-larger is the classic); bugs arise as repairs at impasses and "migrate" over days (Brown & VanLehn 1980; VanLehn 1990). One wrong answer is a patch, not a stable belief: a second same-structure item is needed before labelling | R2:S19, S20 | Confirmed | High / Medium-High | G7 |
| E78 | About 40 % of pupils in the bug data showed consistent bugs, mostly in borrowing | R2:S19 (secondary summaries; original not checked) | Inferred | Low-Medium | — |
| E79 | Carpenter et al. (1998): 82 children, Grades 1–3; ~90 % used invented strategies; inventing before learning standard algorithms went with better base-ten knowledge and transfer (longitudinal, not randomised) | R2:S22 | Confirmed | High (finding) / Medium (causation) | — |

### B.5 Mental strategies and when

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E80 | Named mental strategies: make ten (8 + 5 = 8 + 2 + 3), compensation (49 + 26 = 50 + 26 − 1), tens-then-ones, adding on 10s/100s, doubles and near doubles | R2 §2.5 | Inferred | Medium | — |
| E81 | 2007 syllabus mental-calculation rows: P1 within 20, 2-digit ± ones without renaming, 2-digit ± tens; P2 3-digit ± ones/tens/hundreds, × ÷ within tables; **P3 two 2-digit numbers** | R2:S1 | Confirmed | High | — |
| E82 | The 2021 syllabus keeps the same placement: P1 mental within 20, 2-digit ± ones without renaming, 2-digit ± tens; P2 3-digit ± ones/tens/hundreds and within the tables; **P3 two 2-digit numbers** | R1:S1 §2.4 (read in full) | Confirmed | High | — (CR-1) |
| E83 | So Q1 ("add mentally", two 2-digit numbers with regrouping, Grade 2) is a US-standards demand (CCSS 2.NBT.5) one year ahead of the ministry's mental placement; the US edition teaches it in Grade 2 Ch 2.1 with number bonds | R2 §2.5; R1:S1; R3:S11; EXAM | Inferred | High (raised from Medium, CR-1) | — |
| E84 | Beishuizen (1993), Dutch Grade 2: N10 (keep one number whole, jump by tens) is more effective and less error-prone but harder to learn; 1010 (split both into tens and ones) is preferred by weaker pupils; teach both. Klein, Beishuizen & Treffers (1998, N = 275): empty-number-line programs | R2:S26 | Confirmed (abstract) | Medium-High | — |
| E85 | Fuson & Kwon (1992): Korean children solved about two-thirds of sums above 10 by ten-based recomposition or known facts (language may not be the main cause) | R2:S25 | Confirmed (abstract) | Medium-High | — |
| E86 | Invented strategies can harden into new rote algorithms if handed out as recipes | R2 §2.5 (NCTM blog citing Carpenter) | Inferred | Medium | — |
| E87 | Math in Focus Grade 2 folded the older edition's "Mental Math and Estimation" chapter into Ch 2–3 as number-bond mental strategies; a counting tape (a number-line-like strip) carries counting on/back by 1s, 10s, 100s | R3 §2.4, §3.3; R3:S11; R1 §4.5 | Inferred | High | G14 |

### B.6 Systematic variation

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E88 | Dienes' perceptual variability (one structure, many surface forms) and mathematical variability (vary every non-essential feature) are cited as the basis for variation in Singapore-lineage materials | R2:S27 | Inferred | Medium-High | — |
| E89 | Math in Focus "Learn" uses variation: carefully ordered number strings; several pictures of one idea | R3:S1, S3 | Confirmed | High | — |
| E90 | IES 2021: once regrouping is taught, mix in items that do not need it so students must discriminate (Recommendation 1, strong, 43 studies) | R2:S28 | Confirmed | High | — |

### B.7 Heuristics

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E91 | Ministry heuristics (2007) in four groups: give a representation (diagram, list, equations); make a calculated guess (guess and check, patterns, suppositions); go through the process (act it out, work backwards, before-after); change the problem (restate, simplify, solve part) | R2:S1 | Confirmed | High | G6 |
| E92 | Pólya's four phases (understand, plan, carry out, look back) frame problem solving; Math in Focus prints a four-step poster (understand → plan → carry out → check) and a heuristics poster (draw a diagram, before-after, systematic list, restate, guess and check, solve part, patterns, work backwards, supposition) | R2:S29; R3:S2 | Confirmed (book, poster titles) / Inferred (four phases not on the publisher page) | High | — |
| E93 | PM 2022 closes many chapters with a "Solve! Heuristics" feature: make a list, guess and check, work backwards, draw a diagram, look for a pattern, act it out, make a supposition, before-after, simplify, restate, write an equation | R1:S19 | Confirmed (titles) | High | G6 |
| E94 | Problem-solving framework published 1990; problem-solving curriculum from 1992; explicit heuristics and thinking skills added 1997–2001; later shift toward "habits of mind" incl. metacognition | R2:S30, S31 | Confirmed / Inferred | Medium / Medium-High | — |
| E95 | No primary source gives a grade sequence of heuristics. R2's working guess: P1–P2 act it out, draw, look for a pattern; P3–P4 guess and check, list, before-after; P5–P6 work backwards, supposition, simplify | R2 §2.7 | Speculative | Low | G6 |
| E96 | Math in Focus "Put On Your Thinking Cap!" = non-routine problems solved with the four-step model and heuristics, after Math Journal at chapter end; the publisher calls it an extended-response assessment; also in Extra Practice | R3:S1, S3, S5–S7 | Confirmed | High | — |
| E97 | Heuristics without monitoring fail (P6 pupils stuck on a wrong model for 15 minutes) | R2:S30 | Confirmed | Medium | — |

### B.8 Metacognition, explain and journal routines

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E98 | Metacognition = awareness, monitoring and regulation of one's thinking; a framework component since 1990; one of the 2021 revision's three focus areas | R2:S7, S31; R1:S1 | Confirmed | High | — |
| E99 | Math in Focus 2020 carries metacognition in Math Journal (write in own words what was learned) and Math Sharing / Math Talk (discuss methods aloud); the 2020 edition states added emphasis here | R3:S1, S3 | Confirmed | High | — |
| E100 | Classroom forms: think-aloud questions ("How do you know? Is there another method?"), checking the answer against the problem, journals, "log writing" (NIE, Lee Ngan Hoe); an NIE book on journal writing exists | R2:S13 (one school), S33 | Confirmed (that school) / Inferred | Medium / Low-Medium | — |
| E101 | No grade sequence for explain/journal routines was found; practitioner accounts show them from P1, explanations growing with age | R2 §2.8 | Speculative | Low | G9 |
| E102 | IES 2021 Recommendation 2: teach clear, concise mathematical language and expect students to use it (strong, 16 studies) | R2:S28 | Confirmed | High | — |

### B.9 Practice and review volume

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E103 | Math in Focus practice sets are short: 16 problems in each of two Grade 3 sections on fluent ± within 1,000 ("not extensive"); for four-addend sums EdReports points to two problems in Grade 2 Section 2.6 | R3:S6, S7 | Confirmed | High | G10 |
| E104 | Math in Focus gives no continual review of earlier concepts (by design: teach thoroughly enough); Singapore textbooks do not reteach prior content, so gaps compound | R4:P2 (Duffy); R2:S3 (AIR) | Confirmed (reviewer; report) | High | G10 |
| E105 | Math in Focus has Fact Fluency activities in every chapter plus a Fact Fluency book; Extra Practice and Homework, Reteach (Gr 1+) and Enrichment, one activity per section; these have no days of their own in the pacing | R3:S1, S2, S5–S8 | Confirmed | High | — |
| E106 | Kumon: about 30 minutes per subject per day; the app's own Kumon: 10+ items a sheet, 100+ calculations a day at fluency levels | R4:P47 (excerpt), P48; CB | Inferred | Medium | — |
| E107 | Singapore-style Grade 2, first half-year: Dimensions Workbook 2A = 184 pages vs 57–64 class periods (≈ 3 workbook pages a lesson); PM 2022 Student Book 2A 224 pages, Additional Practice 2A ≈ 164 pages | R4:P49, P50; R1:S20 | Inferred | Medium (Dimensions) / Low (PM) | G10 |
| E108 | Kumon gives several times more computations a day than a Singapore-style workbook; Singapore books give fewer, more varied items and leave extra practice to the adult (a ratio estimate; items per page not counted) | R4 F5.15 | Inferred | Low | G10 |

---

## C. The school's classroom

### C.1 Lesson parts

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E109 | 2020 chapter flow: Chapter Opener + Essential Question → Recall Prior Knowledge + Quick Check (pre-chapter quiz on prerequisites, Gr 1 up) → ≈ 5 sections (1–5 days each) → Math Journal → Put On Your Thinking Cap! → Chapter Wrap Up → Chapter Review (incl. state-test-style "Assessment Prep") → Chapter Test (Assessment Guide) → Performance Task (rubric) → STEAM project (some chapters) | R3:S1, S2, S3, S5–S8 | Confirmed | High | — |
| E110 | Inside a section: Think (a problem pupils cannot yet solve, revisited at the end — "productive struggle") → one or more Engage (inquiry with objects) – Learn (teacher-led, with variation) – Try (guided practice, each item a formative check) cycles → Hands-on Activity, Math Talk/Sharing, Game, Let's Explore → Independent Practice (used to form small groups); Differentiated Instruction notes; Fact Fluency | R3:S1, S3, S6–S8; R1:S14 | Confirmed | High | — |
| E111 | Publisher pacing per EdReports: Recall + Quick Check 1 day per chapter (Gr 4: 1–2); Journal + Thinking Cap 1 day; closing parts (Review, Performance Task, Project, Test) 2 days; 4–8 days a year for Cumulative Reviews and Benchmarks | R3 §2.1 (EdReports Gr 3, 4) | Confirmed (as EdReports' reading) | High | — |
| E112 | Older-edition names parents may still see: Let's Learn (≈ Engage + Learn), Guided Practice (≈ Try), Let's Practice / Workbook (≈ Independent Practice / Extra Practice); Let's Explore, Math Journal, Thinking Cap, Wrap Up, Review/Test unchanged | R3 §2.4; R3:S3, S10 | Inferred | Medium | — |
| E113 | A lesson is one idea per section taught three ways (concrete → picture → symbols), a short guided set and a short independent set; challenge items sit at chapter end (Thinking Cap) and are optional for many classes; the chapter test mixes them all, incl. the Thinking-Cap kind (his Q7) | R3 §2.4 design reading | Inferred | High | — |
| E114 | The 2020 parts group into the ministry's Readiness (Opener/Recall, Think, Engage) / Engagement (Learn) / Mastery (Try, Journal, Thinking Cap, Performance Task, STEAM) | R3:S15 (a Dimensions author's comparison site); R1:S1 | Inferred | Medium | — |

### C.2 Representations by grade (Math in Focus)

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E115 | Publisher's hallmark models: ten frames, number bonds, number lines, place-value charts, fraction models, bar models | R3:S4 | Confirmed | High | — |
| E116 | Grade 1: connecting cubes; counting tape; place-value chart with ten-rods and unit cubes; bundles of ten straws; balance scale; picture graph + tally; number bonds open Ch 2 | R3:S5 | Confirmed | High | — |
| E117 | Grade 2: base-ten blocks + place-value charts (Ch 1–3); counting tape (2.2, 3.2); number bonds for mental ± (Ch 2–3); vertical algorithm after the concrete step; bar models (all of Ch 4; also length, money); number line for rounding; cubes for odd/even (8.4); picture/bar graphs and line plots (Ch 7) | R3:S11, S12, S6 | Inferred | High | G14 |
| E118 | Grade 3: number bonds (5.2); counters on a place-value chart (5.3); number line for rounding (1.5); arrays (4.1); area model (Ch 5); square tiles (9.1); folded paper strips for unit fractions (7.1); bar models for fraction of a set (7.3) and the whole of Ch 6 | R3:S7 | Confirmed | High | — |
| E119 | Grade 4: place-value chips/disks and blocks (1.1, 1.3, 2.1, 4.3); bar models (1.6, 2.4, 2.7, 3.9); number lines; hundred squares; fraction circles/strips; geoboards; protractor | R3:S8, S9 | Confirmed | High | — |
| E120 | Grade 5: not re-read; the kit lists place-value chips, fraction circles/tiles, a litre cube | R3:S2 | Inferred | Medium | G14 |
| E121 | Whether Grade 2 Ch 2–3 use ten frames or number lines beyond the counting tape and the rounding number line is not public | R3 §10 item 8 | Confirmed (absence) | Medium | G14 |

### C.3 Chapter tests, sections and the assessment calendar

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E122 | Assessment layers: Quick Check (the only per-chapter diagnostic) · Try (formative) · Independent Practice (formative, auto-scored on Ed) · Chapter Review · Chapter Test (summative; teacher Assessment Guide + consumable Student Assessment Guide; also on Ed) · Performance Task · Cumulative Review · Mid-/End-of-Year Benchmarks (Grade 3 to Course 3) · Transition Guide (Gr 2–5, for pupils new to the program; contents not public) · a MAP Growth link | R3:S1, S2, S3, S22, S23, S24 | Confirmed | High | G19 |
| E123 | Grades 1–2 have no publisher benchmark: a Grade 2 parent sees chapter-test scores, never a benchmark, until Grade 3 | R3 §4.1 (absence in three publisher documents; EdReports cites none) | Inferred | High | — |
| E124 | Chapter tests have three sections: A multiple choice · B short answer · C constructed response | EXAM; R3:S7, S8 | Confirmed | High | — |
| E125 | Points: A and B items 2 each, C 3 (his Ch 2 test: 7 items, 15 points, 30 minutes); ≈ 7 items per Grade 2 test, ≈ 11–12 per Grade 3 test; whether 2/2/3 holds across Grades 1–3 is unknown | EXAM; R3:S7 | Confirmed (his test; Gr 3 counts) / Inferred (pattern) | High / Medium | G5 |
| E126 | Rubrics exist for some short-answer and all constructed-response items; answers at the back of the teacher guide; the Assessment Guide says teachers decide how to use the tests | R3:S5–S8, S22 | Confirmed | High | G9 |
| E127 | **His paper is the publisher's own Chapter Test 2**: EdReports cites Chapter Test 2, page 7, Problem 4 as a two 3-digit "show your work" sum — the same item as his Q4 (same numbers). So EdReports reviewed his print edition | R3:S6 vs EXAM | Confirmed | High | — (CR-2) |
| E128 | Above-grade test items are common: Grade 2 Ch 4 test has five two-step problems with numbers over 100; Ch 6 and Ch 9 tests are Grade 3 content; Grade 3 tests are mostly Grade 4 standards | R3:S6, S7; R2:S39 | Confirmed (as EdReports' judgment) | High | — |
| E129 | Bar models appear on Grade 2 tests: Cumulative Review 1 (multiple choice with a bar diagram), Ch 4 test (blank bar + equation to complete), Ch 6 test (draw a bar model) | R3:S6 | Confirmed | High | — |
| E130 | Grade 3 tests add error analysis + explain, yes/no judgements, judge a claim and explain, a missing digit in vertical multiplication, choose items to fit a budget and explain | R3:S7 | Confirmed | High | G18 |
| E131 | Grade 1 tests are heavily pictorial (bundled straws, picture-supported word problems, tallies, "which comparison is false"); the Ch 10 Performance Task has pupils show numbers on place-value charts | R3:S5 | Confirmed | High | — |
| E132 | Digital items are auto-scored and may be worded differently from paper; some assessments stay paper-only so the teacher can see the work and the "CPA toolbox"; Ed offers editable assessments and a grouping tool | R3:S1, S2, S3 | Confirmed | High | — |
| E133 | The "concepts, skills and procedures" vs "mathematical reasoning through statements, arguments or justifications" split on his cover sheet is in no public publisher or EdReports text; it resembles state-test reporting claims (e.g. Smarter Balanced) | R3 §4.2; EXAM | Speculative (origin) | Low | G5 |
| E134 | Format catalogue, Grades 1–3: 26 chapter-test/review formats (T1–T26) and 18 lesson formats (L1–L18), each with a starting grade and response mode (writes / draws / builds / chooses) | R3 §8 (from EXAM, R3:S1–S3, S5–S7, S11, S12) | Confirmed (per row) | High | — |
| E135 | Formats the school scores that the app cannot take today: digits in boxes inside a column (T7, T10, T11), shown work (T9, T17), filling or drawing a bar model (T15, T16, L6), drawing/partitioning shapes (T21), number-bond entry (L3), building on a place-value chart (L1, L4), a graded written "why" (T12, T13) | R3 §8 design reading; EXAM; CB | Inferred | High | G8 |
| E136 | Shown work is a real share of a Grade 2 test: 3 of 8 scored parts on his Ch 2 test said "show your work" (Q4, Q6, Q7) | EXAM; R4 F5.10 | Confirmed | High | — |
| E137 | District layers on top: Nutley NJ Grade 2 runs a September Baseline, four Fact Fluency assessments, Benchmark #1 (Ch 1–3) and #2 (Ch 4, 5, 7), and a Spring Summative; Wilton CT added MAP | R3:S12, S27 | Inferred | High / Medium | G1 |
| E138 | Cumulative Reviews come every few chapters (Grade 2 district plans: after Ch 3 … after Ch 11; a retailer: every three chapters in Grade 3) | R3:S6, S12, S22 | Confirmed (exist) / Inferred (spacing) | High / Medium | G1 |

### C.4 Pacing and the likely current chapter

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E139 | Grade 2 district pacing: Ch 1 Sept (Madison 15 days) · Ch 2 Oct (–Nov; Madison 20) · Ch 3 Oct–Dec (22) · Ch 4 Nov–Jan (22) · Ch 5 Dec–Feb (23); Nutley teaches Ch 2 and Ch 3 both in October and benchmarks Ch 1–3 at the end of October | R1:S7, S8, S9 | Inferred | High | G1 |
| E140 | His class took the Ch 2 test on October 27 (date on the paper) | EXAM | Confirmed | High | — |
| E141 | On 17 Nov the class is most likely in Ch 3 (Subtraction Within 1,000), in the regrouping lessons; Ch 4 (the first bar-model chapter) likely from late Nov / early Dec into January. Exact lesson unknown | R1 §4.5 | Inferred (chapter) / Speculative (lesson) | Medium / Low | G1 |
| E142 | The comparison bar model his Q7 needs is taught in Ch 4.3 — after the test he took | R3 §3.4 design reading | Inferred | High | — |

### C.5 Home connection

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E143 | One School-to-Home Connections letter per chapter, Grades K–5, printed inside the Extra Practice and Homework book (activities outside class + the chapter's key objectives); sold as letter sets; English and Spanish | R3:S2; HMH listings via search (Spanish) | Confirmed / Inferred (Spanish) | High / Medium | G15 |
| E144 | An older-edition Ch 4 letter opened by saying the child will learn bar models for + and − and showed addition, subtraction and comparison models; a Ch 5 letter named one key skill; no 2020 letter seen | R3 §5 (search snippets of a deleted blog) | Inferred | Medium | G15 |
| E145 | Digital home channels: Family Room (caregiver articles/videos, English/Spanish, via the child's Ed login, launched 2020); Learn Videos (Gr 1–5); HMH Go (offline eBook); older ThinkCentral parent videos now return 403 | R3:S1, S2, S26, S17 | Confirmed (exist) / Inferred (MIF-specific content) | High / Medium | G16 |
| E146 | No free public publisher page explains number bonds, the regrouping talk or bar models to parents; free help is district- or school-authored (one district page read in full had no such explanation) | R3 §5; R3:S16, S17 | Inferred | Medium | G15 |
| E147 | What a Grade 2 parent most likely receives: Extra Practice pages (chapter letter at the front), the chapter test back with a score, an Ed login if the district bought digital; Ed is not sold to homeschool or individual buyers | R3 §5; R3:S22 | Inferred / Confirmed (Ed not for homeschool) | Medium | — |

### C.6 Licence and names

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E148 | Student books and assessment guides are © Marshall Cavendish Education Pte Ltd (his test: "© 2020 Marshall Cavendish Education Pte Ltd"); US distribution by HMH | EXAM; R1:S14; R3 §6 | Confirmed | High | — |
| E149 | Marks: Math in Focus® and Marshall Cavendish® = Times Publishing Limited (HMH trademark page). Singapore Math® = "Singapore Math Inc." (HMH trademark page) or "Singapore Math Inc. and Marshall Cavendish Education Pte. Ltd." (2020 Program Guide); the US register lists joint owners Singapore Math, Inc. and Marshall Cavendish International (Singapore) (aggregator). Dimensions Math® = Singapore Math Inc. No claim found on "Primary Mathematics" | R1:S16, S20, S24, S25; R3:S1 | Confirmed (HMH and publisher statements) / Inferred (register via aggregators) | High / Medium | G20 (CR-7) |
| E150 | "Singapore-style", "bar model", "number bond", "concrete-pictorial-abstract" are generic method words used by ministry, publishers and researchers; no mark found on them (no USPTO search was run) | R1 §8 | Inferred | Medium | G20 |
| E151 | HMH website terms (4 Mar 2022): limited licence to view and print one copy for personal non-commercial use; no copying, reproducing, publishing, derivative works or framing without permission; no bots or scrapers; no implied affiliation | R3:S19 | Confirmed | High | — |
| E152 | US Copyright Office Circular 33: titles, names and short phrases are not copyrightable; ideas, procedures, methods and systems are excluded (17 U.S.C. §102(b)); general layout is not protected; a creative selection and arrangement can be | R3:S21 | Confirmed | High | — |
| E153 | Consequence: the module may state chapter titles, a grade's topic order, part names used descriptively, item formats and methods; every page, picture, worked example, exercise and test item must be original; Math in Focus® is named only to say truthfully what the school uses — no logos, no implied affiliation (not legal advice) | R3 §6 (from S19 + S21); R1 §8; DECISIONS M3, M6 | Inferred | High | — |
| E154 | Residual risk: copying a full lesson-by-lesson sequence with its titles could be argued as copying a protected compilation; keep the module's own sequence mapped to CCSS, with Math in Focus chapters as a lookup only | R3 §6 | Speculative | Low-Medium | — |
| E155 | HMH's full teacher/student samples require a work email and institution; not used (signing up as a non-educator would breach the gate's spirit) | R3:S14 | Confirmed | High | G2 |

---

## D. Evidence of effect (and what is not evidenced)

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E156 | Math in Focus cluster RCT (Jaciw et al. 2016, *JREE*; Clark County NV 2011–12): 22 grade-level teams, 12 schools, Grades 3–5, N ≈ 2,067; **+0.11 to +0.15 SD** (SAT-10, state test); no difference by prior achievement, minority status or grade; no difference between procedures and problem-solving subscales. Caveats: one district, one year, incomplete implementation, publisher-funded evaluator, business-as-usual comparison | R2:S37 | Confirmed (abstract) | High | — |
| E157 | Evidence for ESSA rates Math in Focus "Strong": +0.15 average over 4 studies, 3,444 students, Grades 2–5; two of the four studies publisher-commissioned; per-study sizes not shown | R2:S38 | Confirmed | High | — |
| E158 | No What Works Clearinghouse report or study review of Math in Focus (or any Singapore-lineage curriculum) was found | R2 (two targeted searches) | Confirmed (absence) | Medium | — |
| E159 | Inspire Maths (UK adaptation of *My Pals Are Here!*), England: cluster RCT, delayed treatment, 12 schools, 576 Year 1 pupils; no difference in terms 1–2; term 3 ES ≈ 0.42 (p = .046); pupils' attitudes more negative in term 1, then equal; small volunteer sample, test level changed between terms | R2:S27 | Confirmed | High | — |
| E160 | EEF Mathematics Mastery (primary): cluster RCT, 83 schools, 4,176 Year 1 pupils: +0.10 (95 % CI −0.01 to +0.21), not significant; its link to Singapore is drawn by Lindorff et al., not by the EEF text | R2:S40, S27 | Confirmed (result) / Inferred (link) | High | — |
| E161 | AIR (2005) for the US Department of Education: Singapore's lead credited to a coherent system (≈ 15 topics per grade vs 18–39 in US states; problem-based textbooks; demanding tests; trained teachers; help for slower pupils); exploratory | R2:S3 | Confirmed | High | — |
| E162 | US pilots: North Middlesex "advanced" share up 32 % over 2 years (strong district support); Baltimore gifted program share ≥ 97th percentile up 17 %; Paterson (≈ 40 % turnover) no better than district; Montgomery mixed, 3 of 4 schools dropped it (late materials, little training, thin guides, misalignment, cost) | R2:S3 (Confirmed); R2:S41 (Garelick advocacy; district report encrypted) | Confirmed / Inferred | High / Medium | — |
| E163 | System-level context only: TIMSS 2023 Grade 4 Singapore 615 (1st), US 517; PISA 2022 Singapore 575 (1st, 41 % top performers), US 465; Singapore 1st at Grade 4 in TIMSS 1995–2003. Ranks a whole system, not a method | R2:S35, S36, S31 | Confirmed | High | — |
| E164 | Manipulatives meta-analysis (Carbonneau et al. 2013): 55 studies, N = 7,237; small-to-moderate advantage over symbols only; retention moderate-to-large; transfer and problem solving small; depends on how it is taught | R2:S4 | Confirmed (abstract) | High | — |
| E165 | Concreteness fading (concrete → idealised → abstract, faded explicitly) is argued to aid transfer (Fyfe et al. 2014); a 2021 analysis says it may generalise less than claimed | R2:S5 | Inferred | Medium | — |
| E166 | Virtual manipulatives meta-analysis (Moyer-Packenham & Westenskow 2013; 32 reports, 82 effect sizes): moderate effect 0.34; 2016 revisit: varies by comparison, domain and grade | R4:P59 (search summaries) | Inferred | Medium | G8 |
| E167 | IES 2021 practice guide (struggling students, elementary): six recommendations all **strong** — systematic instruction (43 studies), mathematical language (16), concrete and semi-concrete representations explicitly connected to notation (28), number lines (14), word problems taught by schema type with the unknown in different places (18), timed fluency activities (27); avoid key words; one problem type can need different operations. Population: students with or at risk for difficulties | R2:S28 | Confirmed | High | — |
| E168 | Schema-instruction meta-analysis (Peltier & Vannest 2017): 21 studies, 3,408 pupils; g 1.57 immediate, 1.09 transfer (researcher-built measures typical) | R2:S42 | Confirmed (abstract via search) | Medium-High | — |
| E169 | Schema instruction in Grades 1–2 (Hardy, Powell & Saglam-Ak 2026): 13 experimental studies, ≈ 2,100 children, positive; common parts: explicit schema teaching, diagrams, meta-equations, gesture, a heuristic, numberless problems, vocabulary, manipulatives, fact fluency, self-monitoring | R2:S43 | Confirmed (abstract) | High | — |
| E170 | Fuchs et al. (2008): 35 Grade-3 pupils with maths and reading difficulties; schema-broadening tutoring ES 1.80 (researcher test), 0.69 (standard story-problem test), 0.21 n.s. (ITBS); small, underpowered | R2:S44 | Confirmed | High | — |
| E171 | Jitendra et al.: SBI beat general strategy instruction (88 Grade-3 pupils, 2007); against standard tutoring (136 pupils, 2013, meets WWC standards) the word-problem edge was tiny (ES 0.02), gone at 6 weeks, with lower computation fluency | R2:S45 | Confirmed | High | — |
| E172 | Bar-model drawing within explicit instruction (paraphrase, visualise, hypothesise, check) raised strategy use and word-problem accuracy for students with maths difficulties; gains held (single-case, multiple baseline, small n) | R2:S17 | Confirmed (abstract) | Medium | — |
| E173 | Ng & Lee (2009): descriptive, 151 P5 children, 14 teachers; the model method lets children without letter algebra represent and solve algebraic word problems; success falls as structure varies | R2:S6, S11 | Confirmed (abstract) / Inferred | Medium-High / Medium | — |
| E174 | Prompted self-explanation (Rittle-Johnson, Loehr & Durkin 2017 meta-analysis): small-to-moderate gains in procedural and conceptual knowledge, but in numerous cases no help or harm; scaffold explanations; do not let prompts crowd out practice | R2:S34 | Confirmed (abstract) | High | G9 |
| E175 | Kumon evidence: England, 310 Year 6 Kumon pupils matched in the National Pupil Database, +1.80 KS2 scaled-score points (observational); Bangladesh non-formal schools, Grades 3–4, gains after eight months vs control (RCT, read as a summary) | R4:P32, P33 | Confirmed / Inferred | Medium | — |
| E176 | Whole-curriculum Singapore-lineage effects are small (+0.10 to +0.15 SD; one small UK RCT 0.42 late in the year); large effects come only from targeted schema tutoring on researcher tests and shrink to near zero against a strong active comparison | R2 §3.6 (from E156–E171) | Inferred | High | — |
| E177 | Implementation and teacher knowledge are the recurring failure: thin training, late materials, turnover, the book without the system; year-1 teachers used the bar model as an illustration of a worked problem and used it to plan only in year 2; most-requested help: decomposing/composing (primary), bar model (upper), mental math (all) | R2:S3 (incl. Appendix B), S41; R4:P9, P18 | Confirmed / Inferred | High / Medium | — |
| E178 | **Not evidenced** (no controlled study found): CPA as a Singapore package; the number bond as a diagram; place-value disks vs base-ten blocks; Dienes-style variation as a package; math-journal writing; general (Pólya) heuristics transferring in Grades 1–3 | R2 §2.1–2.8, §6 (searches) | Confirmed (absence) | Medium | G22 |
| E179 | **Not evidenced**: 6–8-year-olds building bar models on screen vs drawing them on paper; the handwriting load of "show your work" at ages 6–8 | R4:P41, F6.13, F5.12 (searches) | Confirmed (absence) | Medium | G8 |
| E180 | **Not evidenced**: any independent evaluation of Best Brains or any one-concept-a-week programme; any head-to-head study of Kumon vs Singapore-style vs weekly-concept; any study of children doing two at once | R4 F4.10 (searches) | Confirmed (absence) | Medium | G12 |
| E181 | Part-whole understanding is a well-established foundation of early word-problem solving (Fischer 1990 kindergarten part-part-whole curriculum; Resnick), known through citing papers only | R2:S9 | Inferred | Medium | — |

---

## E. Children's and parents' experience; clashes with Kumon and Best Brains-style; bridges

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E182 | Parents do not recognise number bonds, bar models or place-value charts; schools run Parent Nights whose questions repeat; Seattle ran a district "Parent University" in Math in Focus's first term; a journalist was baffled by number-bond homework | R4:P5, P6, P7 | Inferred (three independent sources) | High | G15 |
| E183 | The method has to be taught and the guide is essential: Primary Mathematics' need for parent instruction "high", younger grades one-to-one; the Math in Focus 2020 Teacher's Edition is essential and classroom-geared; Dimensions textbooks are not meant to be used alone | R4:P1, P2, P4 | Confirmed (reviewer's assessment) | High | — |
| E184 | Teachers quoted in the press: a parent may show carrying if they say other methods exist; ask the child to teach the parent; contact the teacher when the child is repeatedly stuck. A Denver teacher: fewer problems, several shown methods | R4:P6 | Confirmed (as reported) | Medium | — |
| E185 | In some districts the book does not come home; only worksheets or portfolios | R4:P8; R3:S28 | Speculative | Low | — |
| E186 | Singapore ministry to parents: any sound, clear, logical working earns marks (algebra included), but some schools look for the class method; some parents find the model harder than algebra | R4:P19 | Confirmed | High | G11 |
| E187 | Ministry advice: do not do the homework for the child; ask the child to explain; tell the teacher about recurring errors before adding practice; drilling past papers without clearing misconceptions can reinforce errors; do not call yourself "weak at maths" in front of the child | R4:P19 | Confirmed | High | — |
| E188 | Bar modelling is a persistent "thorn" for teachers and pupils after a Math in Focus adoption (a few hours' training); teachers needed more bar-model training in year 1 | R4:P18, P8; R2:S3 | Inferred | Medium | — |
| E189 | Children with another working method resist the model, and marking can penalise them (a child lost 2 of 6 points for an equation; the teacher praised it and asked for the model too); WTM excerpts: a child calling bars a waste of time, a reluctant child getting most wrong, a home guide saying not to push bars on a child who gets answers without them | R4:P12, P14 | Inferred (several anecdotes agree; each post alone Speculative) | Medium | G11 |
| E190 | Models are optional in P1–P2 and useful from about P3 (a parent's report of a school P1 workshop) | R4:P26 (one forum post) | Speculative (held, CR-8) | Low | G11 |
| E191 | Reading load is recognised officially: the ministry checks word counts and language demand when building exam items and says overly complex word problems confuse young learners; read-aloud separates a reading barrier from a maths barrier | R4:P20, P19 (ministry); R4:P42 | Confirmed (ministry) / Inferred (read-aloud test) | High | G13 |
| E192 | Math in Focus is lighter on text than enVision / Everyday Math (a stated reason for Seattle's adoption), but one first-grade teacher found it wordy | R4:P10 (board's reasons); R4:P7 (teacher) | Confirmed / Speculative | Medium / Low | G13 |
| E193 | Little built-in cumulative review; reviewers advise outside fact practice; forums split between "not enough review" and "review left to the teacher on purpose" | R4:P2, P4 (reviewer); P13, P14 (forums) | Inferred | High / Medium | G10 |
| E194 | Positive voices are about structure, not speed: a child excited by the book, less repetition than Kumon with concepts reinforced several ways, cleaner pages helping a distractible child | R4:P11, P7 | Speculative | Low | — |
| E195 | The usual family pattern is "Kumon for computation drill, Singapore for concepts", run side by side without aligning them | R4:P14, P15, P11 | Inferred | Medium | G12 |
| E196 | Some families avoid Kumon for its drill; a Singapore parent found nightly supervising and timing exhausting and stopped | R4:P14, P21 | Speculative | Low | — |
| E197 | Kumon's own stance: it does not follow school; children advance on ability alone and learn from worked examples; word-problem trouble often signals a reading gap | R4:P23 (excerpts), P24 | Inferred | Medium | — |
| E198 | The app's own maps: Kumon never covers word problems, models, time, money, measurement, geometry, data or "explain". Best Brains-style shows 19 figure kinds (bar model included) but no number bond, no place-value disks, no child-sized tape diagram, and the child never builds a model; it cannot take a digit in a box inside a column or shown work | CB (cited in EXAM and R4 §7) | Confirmed (our own maps) | High | — |
| E199 | A competitor claims Kumon pupils are above grade in arithmetic but at or below in word problems (no data) | R4:P25 | Speculative | Low | — |
| E200 | Vocabulary clash: "number bond(s)" = memorised single-digit facts in Kumon's usage (and in the 2007 syllabus's "addition bonds … committing to memory"); = a part-whole diagram in Singapore textbooks | R4:P27 (excerpt); R2:S1, §2.2 | Inferred | Medium | — (CR-9) |
| E201 | Framing: the clash is not "column vs no column" — Singapore teaches the written column in P1. The real clashes are (a) a speed-drilled column vs a column whose carry is explained as a trade of ten ones, (b) the US edition's Grade 2 "add mentally" items, (c) word problems, where Kumon gives nothing and Singapore expects a model | R4 §7; R2 §2.5; R1:S1 | Inferred | High | — (CR-12) |
| E202 | Clash — facts within 20: Kumon memorises by speed; Best Brains-style counts on and makes ten, untimed; Singapore uses a bond diagram and named strategies. Low clash on answers; a vocabulary clash. No public bridge found | R4 §7 | Inferred | Medium | — |
| E203 | Clash — 2-digit addition with regrouping (incl. "add mentally", 3–4 addends): Kumon column with a written carry, timed; Best Brains B13 column with block pictures, no "add mentally" item; Singapore column built from place-value trades, plus mental strategies. Seen in his Q1 and Q2. Bridges: a parent may show carrying if other methods are acknowledged; any sound method earns marks; praise the child's method, then ask for the other way; do easy sums mentally, write only when the problem is too big | R4 §7; R4:P6, P19, P12, P44; EXAM | Inferred | Medium | G12 |
| E204 | Clash — 3-digit subtraction: the procedure is in hand from Kumon; the place-value meaning is not always (his Q3/Q5b rule). No family bridge found publicly; the research bridge is carry and borrow as one compose/decompose idea (Ma) | R4 §7; R2:S23; EXAM-rev | Inferred | Medium | — |
| E205 | Clash — missing addend (635 + ? = 652): a column-only habit applies each column alone (his Q3 → 023); Singapore expects the part-whole picture first. Bridge (forum excerpt only): draw the bars together when the child is stuck | R4 §7; R4:P14, P43 | Inferred / Speculative (bridge) | Medium / Low | — |
| E206 | Clash — word problems: Kumon gives none; popular US parent advice teaches key words against the Singapore method; a fast child may refuse bars; some classrooms mark the model itself. Bridges: accept any sound working and ask the child to explain (ministry); guided bar practice (Thinking Blocks) | R4 §7; R4:P19, P42, P12, P18, P43 | Inferred | Medium | G11 |
| E207 | Clash — multiplication facts: little clash on answers (Kumon is ahead; he has ×2–×9); clash on meaning (equal groups and bars for × stories may feel redundant). Bridge: the outside programme supplies fact drill, school supplies concepts | R4 §7; R4:P14, P11, P4 | Inferred | Medium | — |
| E208 | Clash — multi-digit multiplication: Kumon is ≥ 1 year ahead (he is at 2-digit × 1-digit now); school's Grade 3 partial products with disks/area may meet resistance later. No bridge found publicly | R4 §7; R1 §5 | Inferred | Medium | — |
| E209 | Clash — fractions: future, not current (procedural later in Kumon vs bar-based meaning first) | R4 §7 | Inferred | Low | — |
| E210 | Clash — explain / show your work: Kumon trains silent speed; Best Brains-style takes typed explanations formatively only; school marks shown work and a written "why" (Q6 lost its point). Bridges: say what to write, why and where (AoPS); ask the child to explain aloud (ministry); a structured "because" frame (R2 design cue) | R4 §7; R4:P44, P19; R2 §5 | Inferred | Medium | G9 |
| E211 | Popular US parent advice (key-phrase cards: "in all" means add) undoes the Singapore method; the IES 2021 panel advises against key words; one Singapore school deck also teaches a keyword step | R4:P42; R2:S28, S13, S8 | Confirmed (each source's content) / Inferred (the clash) | High / Medium | — |
| E212 | Hand-drawn models frustrate young children and cause errors (the stated reason one author built virtual blocks) | R4:P38 | Speculative | Low | G8 |
| E213 | Teacher-side mistakes with young children (a UK Singapore-style publisher): leaving concrete objects too early; not modelling how to draw bars; every adult drawing bars differently (agree one style, share it with parents); starting too hard; the wrong model type; staying pictorial instead of moving to the number sentence | R4:P39 | Inferred | Medium | — |
| E214 | "Show your work" practice view: write when the problem is too big to hold in the head, not for easy sums; tell the child what to write, why and where | R4:P44, P6 | Confirmed (as each author's view) | Medium | — |
| E215 | The physical cost of writing steps is reported by parents only; letter formation should be automatic by Grade 2 (commercial blog) | R4:P45, P46 | Speculative | Low | G8 |
| E216 | The algorithm-first debate is unresolved and is not about Kumon (early rote column may crowd out place-value sense vs algorithm first but tied to place value) | R4:P29, P30 | Inferred | Low | — |
| E217 | Public comparison posts are almost all sellers' marketing repeating one stereotype (Kumon = timed drill; Singapore = CPA, bars, problem solving; RSM = advanced; Mathnasium = remediation); "combining requires careful management" with no detail | R4:P16, P34, P36, P25, P15, P31 | Inferred (as a description) / Speculative (claims) | High / Low | — |
| E218 | No public account exists of a child doing Kumon + a weekly-concept programme + a Singapore-style school, or Best Brains with any Singapore curriculum; Best Brains' only comparison is its own marketing, which does not mention bar models | R4 §3, P31 | Confirmed (absence) | Medium | G12 |

---

## F. Digital interaction: building models on a screen

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E219 | Thinking Blocks (free web and iPad; Addition version ages 6–9; Common Sense 7+): read a short problem → build the model from blocks → label → put numbers on blocks (numbers and "?" dragged into place) → solve; a modelling tool lets the child build any problem's model and compare it with the program's own (self-check); an on-screen step note; videos; a drawing pad | R4:P35, P51, P52, P43, P38 | Inferred (step order) / Speculative (exact drag mechanics) | High / Low | G8 |
| E220 | Reviewers on Thinking Blocks: the step order makes children approach each problem systematically; a teacher-trainer calls it the best bar-model app; but help at the "solve" step is thin and appears only after a wrong answer, and it "feels more like work than fun" | R4:P35, P43 | Confirmed (reviewer) | Medium | — |
| E221 | The Thinking Blocks author's classroom sequence: plain unlabelled blocks first → brackets for a difference → numbers and labels; the unknown placed in different positions | R4:P38 | Speculative | Low | G3 |
| E222 | Other bar-model products: HMH "Singapore Math Bar Models" app (Gr 2–5, paid; reviewer unimpressed); Xyla and Yabu (Gr 1–2 parts-and-wholes problems with bar hints, then three choices; no read-aloud); Visual Word Problems (Gr 1–2, read aloud by default, guided steps); Toy Theater colour bars (free canvas, no unknown piece) | R4:P43, P53 | Speculative | Low | — |
| E223 | Number bonds on screen: Zearn K (freeze a ten frame, complete the bond — a fill-in); Gynzy (move the missing part into a two-part shape; teacher sets the largest whole, choices, set length; progress bar; sounds); Hive (drag counters into part/whole boxes, flip, show/hide counts, no checking); most bond apps are fill-the-blank "video flashcards"; one narrated bead-chain app praised | R4:P56, P57 (product docs); R4:P55, P43, P58 | Confirmed (Gynzy, Hive docs) / Inferred (others) | Medium | — |
| E224 | Three interaction styles: guided construction (praised for thinking), fill the blank (criticised as flashcards), free canvas (depends on an adult) | R4 §6 pattern | Inferred | Medium | G8 |
| E225 | Read-aloud by default is valued for Grade 1–2 word-problem apps; its absence is noted as a weakness | R4:P43, P42 | Inferred | Medium | G13 |
| E226 | Math in Focus 2020 on Ed: virtual manipulatives (Gr 1–Course 3), Learn Videos, mini-games and eBooks exist; whether a bar-model builder, number bond or disks are among the tools is not public | R3:S2; R4:P54 | Confirmed (they exist) / unknown (tool list) | Medium | G16 |
| E227 | No reviewer describes resizing bars by dragging their ends in any Singapore-style app | R4 F6.13 | Confirmed (absence) | Medium | G8 |
| E228 | The drawing itself costs working memory, so a tool that does the drawing mechanics may lower the load | R2 §2.3 (from R2:S16) | Inferred | Low | G8 |
| E229 | Concreteness fading and IES Rec. 3 both say the semi-concrete picture must be explicitly connected to notation; one publisher warns against staying pictorial — each model should end in a number sentence | R2:S5, S28; R4:P39 | Inferred | Medium | — |

---

## G. The child's exam: each miss mapped to method part and evidence

| ID | Claim | Evidence (lane + source #) | Label | Confidence | Gap? |
|---|---|---|---|---|---|
| E230 | The paper: Grade 2, "Second Grade – Math In Focus"; Chapter Test 2 "Addition Within 1,000"; © 2020 Marshall Cavendish Education; Oct 27; 30 min; A (Q1–3, 2 pts each), B (Q4–6, 2 pts each), C (Q7, 3 pts); 15 points; **score 6/15**. Teacher sheet: Q6 the only "reasoning" item; Q2, 3, 5, 6, 7 circled; small-group tiered support planned | EXAM | Confirmed | High | — |
| E231 | Pattern: a plain two-number column sum is right every time (Q1, Q4, Q5a); regrouping that is hidden or different (four addends, unknown addend, unknown digits with regrouping, a word relation) is wrong every time (0 of 4). "One root" is too strong for one test: Q3/Q5b share one rule, Q2 is ambiguous; every count ±1 part (±12 %) | EXAM, EXAM-rev | Confirmed (counts) / Inferred (pattern) | High / Medium | G7 (CR-10) |
| E232 | **Q2** (four 2-digit addends; 63, key 73): two rules fit — "the carry is always 1", or ones mis-added to 13 with a correct carry; Kumon C has him carrying 2–8 daily in multiplication, so "always 1" is at most a two-addend habit. → Method: the place-value trade (23 ones = 2 tens + 3 ones; the carry is how many new tens; Ma's composing a higher unit); bond 23 = 20 + 3. → Evidence: bugs are systematic and migrate, so one answer cannot fix the rule; EdReports: thin Gr 2 practice on 2.NBT.6; PM 2022 2E teaches three or four addends; IES: mix problem types | EXAM-rev; R2 §5; R2:S19–S21, S23, S28; R1:S13, S19 | Confirmed (answer) / Inferred (mapping) | High / Medium | G7 |
| E233 | **Q3** (635 + ? = 652 → 23; key 17): "smaller digit from larger in each column" → 023, which is the test's own distractor; borrowing is in hand (Kumon B); the gap is part-whole (not seeing it as 652 − 635). → Method: bond or bar with the unknown part; count up on an open number line (635 → 645 → 652); + and − as inverses (PM 2022 3E; PMCC "finding the missing number"). → Evidence: smaller-from-larger is the textbook Brown & Burton bug; unknown in every position (IES Rec. 5, strong; Fuchs 2008); part-whole knowledge (Fischer); invention before algorithm (Carpenter) | EXAM-rev; R2 §5; R2:S9, S19, S22, S26, S28, S44; R1:S19, S21 | Inferred | Medium | — |
| E234 | **Q5b** (missing digits, two regroupings; wrote 413 + 426): best single rule "each column alone, no carry in or out" (same as Q3); his tens digit fits no named rule. → Method: a carry comes in from the right; varied sets where only the presence of regrouping changes ("what changed?"). → Evidence: IES Rec. 1 interleave regrouping and non-regrouping (strong); repair theory; Fuson | EXAM-rev; R2 §5; R2:S20, S21, S28 | Inferred (rule) / Speculative (tens digit) | Medium / Low | G7 |
| E235 | **Q7** (two numbers from sum 810 and difference 100; wrote 100 and 700): took the "100" as one of the numbers and built toward 800; never checked against 810 or the difference. Revised error kind: concept (strategy) — no tool to hold two conditions at once; the hardest item (3 pts). → Method: comparison bar model (two bars, mark the difference, remove it, halve); heuristic "draw a diagram"; a check against both conditions. → Evidence: an algebra-type problem from Grade 4 in older Singapore texts (Beckmann); a PMCC Grade 3 "Sum and Difference" lesson; PM 2022 Grade 2 "4A Sum and Difference" (content unknown); Math in Focus teaches comparison bars in Ch 4.3, after this test; EdReports finds above-grade items on Gr 2 tests; schema instruction positive in Gr 1–2 with diagrams and self-monitoring; the model method replaces key-word reading; working-memory load | EXAM-rev; R2 §5; R2:S8, S16, S39, S43, S46; R1:S19, S21; R3 §3.4 | Inferred | Medium | G4 (CR-4) |
| E236 | **Q1** hidden miss ("add mentally"; right answer 66, solved with a written column and a margin carry). → Method: mental strategies (number-bond splits taught in MIF Ch 2.1; N10 jumps on an open number line; make ten; compensation); ask "which way did you do it?" rather than forbid columns. → Evidence: Singapore places mental two 2-digit addition at P3 (2007 and 2021); CCSS 2.NBT.5; N10 vs 1010 (Beishuizen); IES Rec. 4 number lines (strong) | EXAM; R2 §5; R2:S1, S26, S28; R1:S1; R3:S11 | Inferred | Medium-High | — |
| E237 | **Q6** (error analysis: found where the digits of 240 belong, described positions, not the reason; 1 of 2). Revised error kind: "explain" (not "format"); Best Brains B13/C3 cover the skill, neither module grades the written "why"; he scored on the only "reasoning" item. → Method: explain-your-thinking with a structured "because" frame in mathematical language. → Evidence: IES Rec. 2 mathematical language (strong); scaffolded self-explanation (small-to-moderate); Ma: the place-value "why" | EXAM, EXAM-rev; R2 §5; R2:S23, S28, S34 | Inferred | Medium | G9 |
| E238 | **Q4** (two 3-digit addends, two regroupings): right (615) after self-correcting a first 515 (dropped hundreds carry) — a slip caught. **Q5a** (missing digits, no regrouping): right; credited to his Kumon columns | EXAM, EXAM-rev | Confirmed | High | — |
| E239 | Revised coverage (8 parts): Best Brains taught by B6 = 0; Best Brains Levels B–C = 3 full (Q1, Q4, Q6), 2 partial (Q3, Q7), 3 none (Q2, Q5a, Q5b); Kumon = 2 full (Q1, Q4), 3 partial (Q2, Q3, Q5a), 3 none (Q5b, Q6, Q7). Misses by kind: concept 4 (Q2, Q3, Q5b, Q7), explain 1 (Q6), reading 0, slip 0 | EXAM-rev | Confirmed (as read) | High (±1 part) | — |
| E240 | Formats on the test: multiple choice with a blank (3), missing numbers in boxes inside a column (3), "show your work" (3), "add mentally" (1), error analysis with a written "why" (1), constructed word problem (1) | EXAM | Confirmed | High | — |
| E241 | Across the misses, every concept miss sits where the format hides the structure (four addends, unknown in the middle, unknown digits, a word relation) — what part-whole/bar models and schema-broadening target, and what his two current programmes rarely show (Kumon: columns; Best Brains: shows models, the child never builds one) | R2 §5; CB | Inferred | Medium | — |
| E242 | The Ch 2 test itself is abstract (no number bond, bar model or disks printed); the models live in the Ch 2–3 lessons (blocks, place-value chart, bonds, counting tape), and later tests (Ch 4, Ch 6, Cumulative Review 1) do print or ask for bar models | EXAM (this test); R3:S6, S11, S12 | Confirmed (this test) / Inferred (lessons) | High | — (CR-11) |

---

## Conflicts resolved

Each entry names the lanes, what each said, the resolution, and the rows it touches. Superseded
readings are kept here and stay unedited in their lane files.

**CR-1 — The current (2021) ministry syllabus: read or not?** R1 read the 2021 syllabus (Oct 2025
update) in full from moe.gov.sg (R1:S1). R2 could not reach it (school-hosted copies 404) and used
the 2007 syllabus (R2:S1) plus the ministry's TIMSS 2023 chapter (R2:S7); R2 marked the current
mental-calculation placement "unconfirmed". **Resolution:** R1's reading stands (Confirmed · High).
The 2021 mental-calculation rows match the 2007 rows (P3 for two 2-digit numbers), so R2's point
holds and is now confirmed (E82); E83 is raised from Inferred · Medium to Inferred · High. R2's
not-found item 1 is **superseded** by R1. The 2007 rows (E46, E73, E81, E91) stay as lineage,
labelled 2007. No true contradiction on CPA: the 2021 content list omits the words (E9) while the
ministry's TIMSS chapter calls CPA "central" (E39) — different documents, both Confirmed. Note the
two lanes' predecessors differ (R2: 2007; R1: 2013, unreadable); both are older than 2021.

**CR-2 — Is his paper the publisher's own Chapter Test 2, and which edition?** R1 inferred the
2020 edition from the "Within 1,000" title (Inferred · High) and rated "EdReports' '2021' listing
is the same print edition the child uses" Inferred · Medium. EXAM's fingerprint left "Math in
Focus is the US edition of a Singapore series" for Phase 1 to confirm. R3 found EdReports citing
Chapter Test 2, page 7, Problem 4 — the same item as his Q4, same numbers (R3:S6). **Resolution:**
upgraded to Confirmed · High (E127): the paper is the publisher's Chapter Test 2 and EdReports
reviewed his edition (the "2021" listing name = the © 2020 books). The US-edition fingerprint is
Confirmed by the publisher's background and HMH's page (E24). R1's Medium label is superseded.

**CR-3 — When do bar models start?** Math in Focus: "first introduced in Grade 2", Ch 4 (R1:S14).
PM 2022: Grade 2 Ch 4 (R1:S19). Dimensions: part-whole and comparison bars named in Grade 3 (3A Ch 3)
(R1:S20). Older US Primary Mathematics: Grade 3 (Beckmann 2004, R2:S46; ASCD 2007, R4:P17).
Singapore P2 school decks: model drawing new in P2 (R4:P37). One district: no independent drawing
until Grade 3 (R1:S7). **Resolution:** all are true for their series; "Singapore-style Grade 2" is
not one thing (E56). Beckmann's Grade-3 start describes the older editions and is **superseded for
current Math in Focus / PM 2022 placement** but kept as lineage (E58). For alignment to this child:
bars arrive in Grade 2 Ch 4; in Grade 2 they are mostly supplied, the Ch 4 test asks him to complete
one and the Ch 6 test to draw one (E61, E129); one district expects independent drawing in Grade 3
(E62, district rule). Exact rung (label vs draw) in Grade 2 lessons stays open (G2).

**CR-4 — Q7 (sum and difference): a Grade-4 problem on a Grade-2 test?** Beckmann: algebra story
problems such as two groups from their total and difference begin in Grade 4 in Singapore texts
(R2:S46). PM Common Core Edition has a Grade 3 "Sum and Difference" lesson (R1:S21). PM 2022 has a
Grade 2 lesson "4A Sum and Difference", content unseen (R1:S19, Speculative). EdReports finds
above-grade items on Math in Focus Grade 2 tests (R2:S39; R3:S6) and the publisher includes
"foundational work for the next grade" (R1:S14). The comparison model comes in Ch 4.3, after the
test (R3). **Resolution:** the structure is typically Grade 3–4 in the Singapore lineage; its
presence on a Grade 2 Math in Focus test fits EdReports' above-grade finding and the publisher's
stated policy, not a different Singapore grade placement. EXAM's "Q7 is the classic problem the bar
model is taught for" (Inferred) is supported by Beckmann and stays Inferred, now High. Design
consequence for later phases: practise it in Grade 2 because the school tests it, but only after
comparison bars, as stretch (E235). Whether PM 2022 4A is this type: open (G4).

**CR-5 — Place-value disks or base-ten blocks in Grade 2?** R2 described regrouping as a trade
with place-value disks/chips and gave a Q2 design cue with "one-disks"; it could not find when Math
in Focus moves to chips (R2 not-found 7). R4's clash table describes Singapore 3-digit subtraction
as "a trade with disks". R3: the 2020 kit lists chips only in Grades 4–5 (Inferred · Medium), and
EdReports names blocks in Grade 2 (2.5), counters on a chart in Grade 3 (5.3), chips in Grade 4.
**Resolution:** Math in Focus Grades 1–3 regroup with **base-ten blocks on a place-value chart**;
chips/disks arrive in Grade 4 (E69, Inferred · High, three sources agree). R2's disk description
remains valid for the Singapore lineage at larger numbers and decimals (E70). R2's "one-disks" cue
and R4's "with disks" wording are **superseded for Grades 1–3 alignment** (the trade idea stands;
the object is blocks). R2 not-found item 7 is answered.

**CR-6 — Where is Grade 2 partitioning (2.G.3)?** R1 §7: "partition probably inside Ch 11 —
Speculative". R3: EdReports cites a Ch 11 test item partitioning rectangles into thirds two ways
(R3:S6). **Resolution:** Confirmed · High (E29); R1's Speculative note superseded.

**CR-7 — Who owns Singapore Math®?** HMH trademark page: Singapore Math Inc. (R1:S16). 2020 Program
Guide: Singapore Math Inc. and Marshall Cavendish Education Pte. Ltd. (R3:S1). Aggregator: joint
owners Singapore Math, Inc. and Marshall Cavendish International (Singapore) (R1:S24). **Resolution:**
both publisher statements stand (Confirmed as statements); joint ownership is Inferred · Medium
until TSDR is read (G20). The design consequence is unchanged: never use the name as a product name
(E149, E153; DECISIONS M3).

**CR-8 — Are bar models optional in Grades 1–2?** R4 F5.2 rated "models optional in P1–P2,
useful from P3" Inferred · Medium, from one KiasuParents post (P26) plus the ministry's "any sound
working earns marks" (P19). The ministry text does not speak to P1–P2 optionality. **Resolution:**
the optionality claim rests on a single forum post, so it is **held at Speculative · Low** (E190);
the ministry rule stays Confirmed · High (E186). Counter-evidence for this child: Math in Focus Grade
2 tests do require completing (Ch 4) and drawing (Ch 6) a bar model (E129), and one US classroom
marked a child down for skipping the model (E189). R4's label is annotated, not deleted.

**CR-9 — "Number bond": fact or diagram?** R4 framed it as Kumon's meaning (memorised facts) vs
Singapore's (part-whole diagram). R2 shows the 2007 ministry syllabus itself speaks of "addition
bonds up to 9 + 9 … committing to memory" (R2:S1). **Resolution:** both senses exist inside the
Singapore lineage — facts in the older ministry text, the diagram in the textbooks (E46, E200). The
clash is real for the child; the app must name which sense it means (Inferred · Medium).

**CR-10 — The exam reading was revised.** EXAM's first pass: Q6 error kind "format"; Q7 "reading +
concept"; misses = concept 3 / reading + concept 1 / format 1; one root for the concept misses;
Q5a Kumon "None"; Q6 Best Brains "Partial". EXAM-rev (after an independent review): Q6 → "explain",
Q7 → concept (strategy), misses = concept 4 / explain 1; "one root" too strong (Q3/Q5b share a rule,
Q2 ambiguous; ±1 part); Q5a Kumon → Partial; Q6 Best Brains → Full on skill. **Resolution:** the
ledger uses the revised reading (E231–E239); the first pass stays in EXAM unedited.

**CR-11 — Do the models live only in lessons, never on tests?** EXAM fingerprint: "the models live
in the lessons and homework, not the chapter test — Speculative". R3: Grade 2 Ch 2–3 lessons use
blocks, place-value charts, bonds and a counting tape (Inferred · High from district objectives);
but the Ch 4 test, Ch 6 test and Cumulative Review 1 print or ask for bar models (Confirmed).
**Resolution:** true for the Ch 2 test (E242), false as a general rule; later Grade 2 tests carry
bars (E129).

**CR-12 — "Column-first (Kumon) vs model/mental-first (Singapore)".** The R4 brief used this
shorthand. R2 found Singapore teaches the written column in P1 and keeps mental two 2-digit work to
P3 (Confirmed, now in both syllabi, CR-1). **Resolution:** the framing is replaced by E201: the
clashes are the meaning of the carry, the US Grade 2 "add mentally" items, and word problems.

**CR-13 — Bar-model entry date.** "Introduced in 1983" and "late 1980s for P5–P6, now from P1",
both from Berinderjeet Kaur in different documents (R2:S8, S11). **Unresolved and immaterial to
design**; both kept (E53).

**CR-14 — EdReports percentages.** R1 reports "≈ 54 % of days on major work" (Grade 2); R2 reports
"35 %" for Grade 2 Gateway 1; R3 reports "≈ 49–54 % of days on major work in Gr 1–2". **Not a
conflict:** 35 % is the Gateway 1 score (5 of 14 points: focus 0/6 + coherence 5/8); 49–54 % is the
share of instructional days across Grades 1 and 2 (E25).

**CR-15 — The Singapore school's 2026 model-drawing parent deck (R2:S13).** R2 used its content
(P2 part-whole model within 1,000; "R.I.G.H.T."; a keyword step; think-aloud prompts) as Confirmed
for that school · Medium. R4 downloaded the same file and could not read it (image-based PDF, no PDF
tools). **Resolution:** R2's rows stand as recorded at Medium confidence (E57, E66, E100, E211); no
row rests on this deck alone for a design-critical claim. A re-read with a PDF/OCR tool is folded
into G6.

**Also annotated (not conflicts, answered gaps):** R1 not-found 3 (Gr 2 partition) → answered
(CR-6); R1 not-found 6 and R2 not-found 7 (how Math in Focus presents bonds, bars and disks) →
partly answered by R3 (E49, E60–E62, E69, E71), rest is G2; EXAM fingerprint "Math in Focus is
taught CPA with number bonds and bar models — Phase 1 must confirm" → Confirmed (E43, E55, E115).

---

## Revision blocks

None yet. The external inbox was empty at writing. A later drop (inside or outside the inbox) is
ingested as **P2.1, P2.2, …** below: new rows are appended to their section with new IDs from E243
on; changed rows keep their IDs and gain a "(rev. P2.n)" marker; conflicts go to new CR entries.
