# INVENTORY — Phase 1 index (school-math)

Written 2026-11-17 19:26 EST by the Phase 2 analyst. Synthesis only: no new web research.
No child's name or personal data anywhere, by rule.

Citation style used across Phase 2: `R1:S14` = lane R1, source S14. `R4:P19` = lane R4, source P19.
`R2:B4` = lane R2, book B4. `EXAM` = phase0/EXAM-READING.md (its "Revision R1" block = `EXAM-rev`).
`CB` = phase0/COVERAGE-BASELINE.md (the app's own Kumon and Best Brains maps, cited by EXAM and R4).

External inbox (`research/external-inbox/`): **empty** at 19:26 EST. The module folder was also
checked for drops outside the inbox (LEARNINGS L12); none found. No revision block is needed yet.

## 1. Lane index

| Lane | File | Scope | Sources | Key yield |
|---|---|---|---|---|
| R1 | R1-GRADE-CONTENT.md | What each grade teaches and in what order: Singapore ministry 2021 syllabus (2013 contrast), Math in Focus 2020 chapter lists K–5, district pacing, Primary Mathematics 2022 / Dimensions / PM Common Core, Common Core Grades 1–5, trademarks | 25 (S1–S25): 4 official ministry (S1–S4), 5 district (S7–S11), 1 EdReports set (S13), 3 publisher/distributor (S14–S16), 5 Singapore Math Inc. scope files (S18–S22), 1 standards PDF (S23), 6 other (tuition, edtech, vendor, retailers, trademark aggregators) | The full 2021 ministry syllabus read in full; Math in Focus 2020 chapter order Gr 1–5; a per-grade matrix with "Singapore earlier / later" flags; Grade 2 pacing from three districts and the likely current chapter (Ch 3); EdReports' above-grade and thin-practice findings (incl. 2.NBT.6 = his Q2); trademark owners |
| R2 | R2-PEDAGOGY-AND-BOOKS.md | The method's parts (CPA, number bonds, bar model, place value and regrouping, mental strategies, variation, heuristics, metacognition), the research evidence, the key books, and the exam misses mapped to method parts | 46 (S1–S46) + 9 books (B1–B9): 4 ministry/government, ~22 peer-reviewed studies or reviews, 3 practice guides/government reports, 2 international surveys, 1 independent review, ~8 practitioner | Origins and grade use of each method part; IES 2021 guide (six strong recommendations, "avoid key words"); schema-instruction effects (large on researcher tests, near zero vs strong tutoring); whole-curriculum effects small (+0.10 to +0.15 SD); bug research (smaller-from-larger = his Q3); the 2007 syllabus mental-calculation rows; book list with what each would add |
| R3 | R3-SCHOOL-CLASSROOM.md | How a Math in Focus 2020 classroom teaches and tests (Grades 1–5, weight on 1–3): lesson parts, representations by grade, chapter tests and benchmarks, home connection, licence, criticisms, format catalogue | 29 (S1–S29): 7 publisher/distributor (Program Guide, Components brochure, Research page, Foundations paper, programme page, sample page, store), 6 EdReports pages, 3 district, 2 school/teacher, 3 legal/trademark/government, 3 retailer, 1 consultant site, 1 HMH help page, 2 press/blog, 1 local (prior lanes) | The 2020 lesson and chapter anatomy from the publisher; the assessment layers (no Gr 1–2 benchmark); **his paper is the publisher's own Chapter Test 2** (EdReports cites the same Q4); base-ten blocks in Gr 1–3, place-value chips from Gr 4; how Ch 2–3 teach regrouping and Ch 4 introduces bars; a 26 + 18 format catalogue with the 7 formats the app cannot take; licence limits |
| R4 | R4-PARENT-VOICE-AND-CONFLICTS.md | Parent and teacher voice on Singapore-style maths, combining it with Kumon or a weekly-concept programme, young-child load (bars, reading, handwriting, practice volume), digital bar-model and number-bond products, the method-clash table | 59 (P1–P59) + in-repo files: 2 official ministry, 4 homeschool reviews, ~14 parent forums (mostly search excerpts), 4 news, 5 provider/competitor, 4 research, 8 product docs/reviews, others | Parents do not recognise the representations; children with a fast method resist bars; ministry: any sound working earns marks; the "column-first vs mental-first" framing corrected; "number bond" means a fact in Kumon's usage and a diagram in Singapore's; guided construction (build → label → number → solve, self-check) is the praised digital pattern; no public account of this child's three-programme situation |
| Phase 0 | EXAM-READING.md (+ Revision R1); COVERAGE-BASELINE.md | His Grade 2 Chapter 2 test: 8 scored parts, misses, diagnoses; what Kumon and Best Brains have taught | the paper (photos read in place; agents see the table only) | 6/15; right every time on a plain two-number column, wrong every time when regrouping is hidden (0 of 4); misses by kind (revised): concept 4, explain 1 |

## 2. What we found (merged, deduplicated across lanes)

Labels are the strongest the evidence supports; where lanes differ, the reconciled label is
given and the ledger's "Conflicts resolved" section explains it.

**Content and order**
1. The current Singapore ministry syllabus (2021, Oct 2025 update) was read in full: problem
   solving at the centre of a five-part framework, 4 themes, 6 big-idea clusters, 3 strands, a
   topic list for P1–P6; in 2026 it covers all of P1–P6. Its text never uses the words
   "concrete-pictorial-abstract", "bar model" or "number bond"; those live in the textbooks and in
   the ministry's other documents (TIMSS 2023 chapter, 2007 syllabus). (R1:S1; R2:S7, S1 — Confirmed · High)
2. Math in Focus 2020 chapter titles and order for Grades 1–5 (13 / 11 / 12 / 9 / 10 chapters,
   151–163 days) from district guides, cross-checked by EdReports. Grade 2: Numbers to 1,000 →
   Addition → Subtraction → Using Bar Models → Length → Mass | Graphs → Multiplication and
   Division → Tables → Time and Money → Shapes. Chapters 1–4 are the same in the older edition.
   (R1:S7–S13 — Inferred · High; titles partly Confirmed)
3. Singapore order runs about a year ahead of Common Core in ×/÷, fractions, measurement units,
   decimals and percent/ratio/rate, and later on rounding, bar graphs and the coordinate plane.
   Math in Focus keeps much of that order, so EdReports rates its focus "Does Not Meet" in Grades
   1, 2, 3 and 5; Grade 4 is the best-aligned year. The publisher says it "intentionally" includes
   next-grade foundations. Primary Mathematics 2022 is re-sequenced closer to Common Core;
   Dimensions keeps the classic order. (R1 §7; R1:S13, S14 — Inferred · High / Confirmed · High)
4. EdReports finds thin Grade 2 practice on adding four 2-digit numbers (2.NBT.6, his Q2), 100 as
   ten tens, odd/even and time to 5 minutes, and above-grade items on Grade 2 chapter tests.
   (R1:S13; R2:S39; R3:S6 — Confirmed · High as EdReports' finding)
5. Grade 2 pacing from three districts: Ch 1 Sept, Ch 2 Oct, Ch 3 Oct–Dec, Ch 4 (bar models)
   Nov–Jan; Book B order varies. His class tested Ch 2 on Oct 27, so mid-November is most likely
   Ch 3 (Subtraction Within 1,000), with Ch 4 next. (R1 §4.5; EXAM — Inferred · Medium)
6. Common Core Grades 1–5 domains, clusters and critical areas, from the official PDF.
   (R1:S23 — Confirmed · High)

**Method parts**
7. CPA is the ministry's central primary pedagogy, from Bruner, adopted by Kho Tek Hong at the
   start of the Primary Mathematics Project (1979–80); it repeats inside every topic at every
   level. Two named failure modes: lingering in the concrete, or skipping it. Math in Focus says
   CPA is used at all grades. (R2:S1, S2, S7; R1:S14 — Confirmed · High)
8. The bar model was built to replace key-word reading (a 1975 ministry study: 46 % solved
   problems lacking cue words), first written up by Kho (1987); three basic forms (part-whole,
   comparison, change), then equal units, fractions, ratio. Scaffolds fade from supplied models to
   child-built ones. (R2:S8, S11, S12 — Inferred · Medium-High)
9. Bar models start in Grade 2 Ch 4 in Math in Focus and Primary Mathematics 2022, in Grade 3 in
   Dimensions and in older US editions; algebra-type problems (two quantities from total and
   difference) start in Grade 4 in older Singapore texts. (R1:S14, S19, S20; R2:S46; R4:P17 —
   Confirmed · High)
10. In Math in Focus Grade 2, bars are usually supplied: Ch 4 sections go part-whole → adding
    on/taking away → comparison → two-step; the Ch 4 test prints a blank bar to fill, the Ch 6 test
    asks the child to draw one; one district expects independent drawing only in Grade 3.
    (R3:S6, S11, S12; R1:S7 — Confirmed / Inferred · High)
11. Regrouping in Math in Focus Grades 1–3 is taught with base-ten blocks on a place-value chart,
    then the vertical algorithm; place-value chips/disks arrive in Grade 4. Number bonds carry the
    mental strategies in Grades 1–3; a counting tape carries counting on by 1s, 10s, 100s.
    (R3:S2, S6–S9, S11, S12 — Inferred · High)
12. Singapore teaches the written column from P1 and keeps mental calculation to no-renaming cases
    and single-unit additions until P3 (two 2-digit numbers). This holds in both the 2007 and the
    2021 syllabus. So "column-first vs mental-first" is the wrong frame for the clash with Kumon.
    (R2:S1; R1:S1; R4 §7 — Confirmed · High; framing Inferred · High)
13. The ministry names heuristics in four groups and uses Pólya's four steps; Math in Focus prints
    a four-step poster and closes chapters with "Put On Your Thinking Cap!"; Primary Mathematics
    2022 closes chapters with named "Solve!" heuristics. No primary source gives a grade sequence
    of heuristics. (R2:S1, S29; R3:S1, S2; R1:S19 — Confirmed · High; sequence absent)
14. Metacognition (awareness, monitoring, regulation) is a framework component since 1990 and got
    more emphasis in 2021; Math in Focus carries it in Math Journal and Math Sharing.
    (R2:S7, S31; R1:S1; R3:S1, S3 — Confirmed · High)
15. Multi-digit errors are systematic "bugs" (smaller-from-larger is his Q3 rule), arise as repairs
    at impasses and migrate; invention before algorithm aids base-ten knowledge; Ma frames carry
    and borrow as one idea (composing / decomposing a higher-value unit).
    (R2:S19–S24 — Confirmed · High / Medium-High)

**Classroom and tests**
16. The 2020 lesson and chapter anatomy from the publisher: Opener → Recall Prior Knowledge +
    Quick Check → ~5 sections (Think → Engage–Learn–Try → hands-on / Math Sharing / Game / Let's
    Explore → Independent Practice) → Math Journal → Thinking Cap → Wrap Up → Review → Test →
    Performance Task. (R3:S1, S3 — Confirmed · High)
17. Chapter tests have sections A multiple choice / B short answer / C constructed response,
    rubrics for constructed response; ~7 items in Grade 2, ~11–12 in Grade 3. **No publisher
    benchmark in Grades 1–2.** Digital items are auto-scored and worded differently; some tests
    stay on paper so the teacher sees the work. (R3:S2, S3, S7, S22; EXAM — Confirmed · High)
18. **His paper is the publisher's own Chapter Test 2**: EdReports cites the same Problem 4.
    (R3:S6 vs EXAM — Confirmed · High)
19. A format catalogue for Grades 1–3: 26 test/review formats and 18 lesson formats; the app
    cannot yet take digits in boxes inside a column, shown work, filling or drawing a bar model,
    drawing/partitioning shapes, number-bond entry, building on a place-value chart, or a graded
    written "why". (R3 §8 — Confirmed per row; app gap Inferred · High)
20. Home connection: one School-to-Home letter per chapter inside the Extra Practice book; Family
    Room, Learn Videos and HMH Go behind the child's Ed login; no free public publisher page
    explains bonds, regrouping talk or bars to parents. (R3 §5 — Confirmed / Inferred)
21. Licence: HMH's web terms forbid copying, derivative works, framing and scraping; titles, short
    phrases, methods and layout are not protected, selection and arrangement can be. Every item we
    show must be original; Math in Focus® may be named only to say truthfully what the school uses.
    Marks: Math in Focus® and Marshall Cavendish® (Times Publishing Limited), Singapore Math®
    (Singapore Math Inc., possibly jointly), Dimensions Math® (Singapore Math Inc.).
    (R3:S19, S21; R1 §8 — Confirmed · High; consequence Inferred · High, not legal advice)

**Evidence of effect**
22. Whole Singapore-lineage curricula show small positive effects: Math in Focus cluster RCT
    +0.11 to +0.15 SD (Grades 3–5), Evidence for ESSA "Strong" (+0.15); Inspire Maths England ES
    ≈ 0.42 in term 3 only, attitudes dipped in term 1; EEF Mathematics Mastery +0.10 n.s. No WWC
    review of Math in Focus. (R2:S27, S37, S38, S40 — Confirmed · High)
23. The strongest matching US evidence is the IES 2021 practice guide: six recommendations, all
    strong (systematic instruction, mathematical language, concrete and semi-concrete
    representations, number lines, word problems taught by schema type with the unknown in every
    position, timed fluency), and "avoid key words". Schema instruction is large on researcher tests
    (g 1.57) and positive in Grades 1–2, but near zero against strong active tutoring.
    (R2:S28, S42–S45 — Confirmed · High)
24. Implementation is the recurring failure (US pilots, Wilton, Seattle; teachers used the bar
    model as a picture on a solved problem in year 1). (R2:S3, S41; R4:P9, P10, P18 — Confirmed /
    Inferred)

**Families, clashes, screens**
25. Parents do not recognise bonds, bars or place-value charts; the guide is essential; the
    ministry says any sound working earns marks but some schools look for the class method, and
    advises asking the child to explain. (R4:P1–P7, P19 — Inferred · High / Confirmed · High)
26. Children with a fast method resist drawing bars; a US classroom marked a child down for an
    equation. The usual family pattern is "outside programme for drill, Singapore for concepts",
    side by side and unaligned. (R4:P11, P12, P14, P15 — Inferred · Medium)
27. "Number bond" means a memorised fact in Kumon's usage (and in the 2007 ministry syllabus's
    "addition bonds … committing to memory") but a part-whole diagram in Singapore textbooks.
    Popular US parent advice teaches key words, which the bar model was built to replace.
    (R4:P27, P42; R2:S1, S8, S28 — Inferred · Medium / Confirmed · High per source)
28. On screen, the praised pattern is guided construction (build → label → number → solve, with a
    self-check against the program's model; read-aloud for Grades 1–2); fill-the-blank number-bond
    apps are criticised as flashcards. Children judge given diagrams better than they draw them.
    (R4:P35, P38, P40, P43, P56, P57 — Inferred · Medium; P40 Confirmed · Medium)

**His exam**
29. Each miss maps to a method part: Q2 (four addends) → place-value trade of 23 ones; Q3 (missing
    addend) → part-whole with the unknown part, counting up; Q5b → each column is not alone,
    varied sets; Q7 (sum and difference) → comparison bar and a check against both conditions; Q1
    hidden miss → mental jumps of ten; Q6 → structured "because" in mathematical language.
    (R2 §5; EXAM-rev — Inferred · Medium)

## 3. What appears not to exist publicly (merged, deduplicated)

1. **Any Math in Focus 2020 lesson or test page beyond what EdReports and his paper describe**;
   the HMH sample needs an educator sign-up (work email + institution); Learn Videos and Family
   Room sit behind the Ed login. (R1, R3)
2. **The publisher's own Math in Focus 2020 scope and sequence or pacing** (the 160-day "Common
   Core Pathway" is cited by EdReports but not public). (R1)
3. **His school's or district's pacing calendar** (not searched, by the no-personal-data rule). (R1)
4. **A primary-source grade sequence of bar-model types** (when comparison, change, equal-unit,
   before-after models begin) and the poster of "visual models at each grade level". (R2, R3)
5. **Whether Grade 2 pupils draw bars or only label supplied ones**, beyond test descriptions and
   one district rule; **whether Primary Mathematics 2022 lesson "4A Sum and Difference" is the
   two-unknowns problem type** (his Q7). (R1, R2, R3)
6. **Chapter-test point values and section mix beyond his Ch 2 test**; item counts for Grade 1 tests;
   the origin of the "concepts, skills and procedures" vs "reasoning" split on his cover sheet. (R3)
7. **Independent rigor/practice reviews of Math in Focus Grades 1–3** (EdReports stopped at
   Gateway 1); item counts per day for Singapore-style Grade 2 books. (R3, R4)
8. **Which digital tools Math in Focus gives pupils on Ed** (bar model? number bond? disks?). (R4)
9. **Contents of the Transition Guide** (the only publisher diagnostic) and any Grade 1–2 placement
   test. (R3)
10. **A 2020-edition School-to-Home letter**; whether letters explain bonds or regrouping talk. (R3)
11. **Controlled studies of**: CPA as a Singapore package; the number bond as a diagram;
    place-value disks vs base-ten blocks; Dienes-style variation as a package; math-journal
    writing; general (Pólya) heuristics transfer in Grades 1–3. (R2)
12. **Any study of 6–8-year-olds building bar models on screen vs drawing them on paper**; any
    reviewer description of resizing bars by dragging. (R4)
13. **Any WWC review of Math in Focus** or of any Singapore-lineage curriculum. (R2)
14. **Any independent evaluation of Best Brains** or any one-concept-a-week programme; **any
    head-to-head study** of Kumon vs Singapore-style vs weekly-concept; **any account of a child doing
    two or three of them at once** (Kumon + weekly-concept + Singapore-style school is undocumented). (R4)
15. **Research on the handwriting load of "show your work" at ages 6–8.** (R4)
16. **Kumon's own guidance for when school teaches a different method.** (R4)
17. **A grade sequence for heuristics and for explain/journal routines** from any primary source. (R2)
18. **The 2013 ministry syllabus PDF** (every official copy 404s; web.archive.org blocked); the
    2013 → 2021 changes rest on secondary descriptions. (R1; R2 used the 2007 syllabus instead)
19. **Full texts** of several key studies (Ng & Lee 2009, Kaur 2019, Fyfe 2014, Peltier & Vannest
    moderators, Carpenter 1998, Fuson 1997, Brown & Burton 1978); bug prevalence (~40 %) is
    second-hand. (R2)
20. **Contents of the 2009 ministry model-method monograph, Yeap's *Bar Modeling* TOC, any open
    chapter of *The Singapore Journey*, any model-method book by Fong Ho Kheong.** (R2)
21. **USPTO TSDR primary records** for SINGAPORE MATH and MATH IN FOCUS (joint ownership
    unverified); a publisher page stating Math in Focus ↔ *My Pals Are Here!* (third parties and
    Evidence for ESSA say it). (R1, R2)
22. **Full text of Reddit and Well-Trained Mind threads** (tool block, 403); every WTM point is a
    search excerpt. (R4)
23. **A US district that dropped Math in Focus over parent complaints, 2016–2026** (true absence
    or search limit). (R4)

## 4. Excluded sources (merged)

| Class | Items (lanes) | Why |
|---|---|---|
| Re-uploads of protected books, tests, articles | Scribd copies of MOE 2013/2021 syllabi, Math in Focus books/letters/tests ("Math-In-Focus-1B", "chapter3", "End-of-Year-Test-Grade2", …), the AIR 2005 report, Ng & Lee, Fyfe, Askey review, Fuson 1998, Fuchs 2004, a self-explanation paper, TME 7(1), Kumon "Description of Study Levels" and answer books (R1, R2, R3, R4) | copyright; publisher or author copies used instead |
| SlideShare decks | MOE syllabi, Math in Focus training, "parent part-whole", bar modelling (R1, R3, R4) | third-party re-uploads |
| Paywall bypasses and course re-postings | springerlink.bibliotecabuap.elogim.com proxy (R2, R4); course-hosted Carbonneau 2013 and Brown & VanLehn 1980 (R2); typeset.io copy of Ma's book; gwern.net copy of Bisra 2018; cliffsnotes notes (R2) | bypass or unknown provenance |
| Spam / AI-generated "scope and sequence" PDFs | conceito.jhsf.com.br, dev.seamlesshiring.com, happysocks, richmondbizsense, ncuscr, wiki.uep.edu.py, zixgate.hioscar, cms.theglasshouse, ava.ead.domalberto.edu.br, library.peoplespharmacy.com, db2.clearout.io, anonymous SEO tuition pages (R1, R2, R3, R4) | unreliable |
| Commercial derivatives | Teachers Pay Teachers listings; tuition-agency syllabus summaries except thelearninglab.com.sg (R1) | derivative |
| Gated publisher material | HMH full sample site learning.hmhco.com/mif-dse (educator sign-up); any Teacher Edition, Assessment Guide, answer key, student book, app screen (R1, R3, R4) | rule: teacher-only / paid; never sign up as a non-educator |
| Blocked or refused hosts | web.archive.org (tool block); reddit.com and mirrors/aggregators (deliberately not used); forums.welltrainedmind.com (403), teamblind (402), tapatalk (403), kumon.com/.co.uk (403/timeout), hellothinkster (429), appadvice/148apps (403/DNS), smarterlearningguide (affiliate redirect) (R1, R3, R4) | not bypassed; excerpts only where labelled |
| Out of lane | Singapore Math Inc. Primary Mathematics test samples; tcatitans.org Dimensions chapter PDFs; learningplus.ph Philippine adaptation; Rainbow Resource MIF placement PDFs (provenance unclear); GitHub syllabus dataset (R1, R3) | not this program / not needed |
| Unreadable here | A Singapore school's 2026 model-drawing parent deck (image PDF in R4; R2 read it as text — see ledger conflict note), an EdReports tech PDF, Montgomery County 2003 report (encrypted), JICA working paper (signed link), Common Sense Education Thinking Blocks review (withdrawn) (R2, R4) | could not be read |
| Dead links (absence recorded) | old MOE 2013 paths, NIE copy, HMH old scope PDF (503), Orange NJ planning PDFs, TESD bar-model PDF, Clayton letters, sososeussey letters, ThinkCentral parent videos (403), Singapore school P2 briefing decks (404) (R1, R3, R4) | unavailable; search snippets used only where labelled |
