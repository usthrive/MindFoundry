# 06 — Officially Published Sample Material (Best Brains MATH)

Research date: 2026-07-19. Scope: ONLY material Best Brains itself published publicly for marketing.
Labels: **Confirmed** = directly observed on official source; **Inferred** = reasoned from official material; **Speculative** = plausible but unverified. Confidence H/M/L.

---

## A. USABLE PUBLIC MATERIAL

### A1. Official math sample pages — bestbrains.com/math (PRIMARY FIND)

**Confirmed / High.** The official program page (https://bestbrains.com/math) publishes exactly **9 sample worksheet pages** as clickable marketing images, 3 per level, hosted on the official CDN:

- `https://cdn.bestbrains.com/images/programs/sample-pages/math-beginner-image-{1,2,3}.jpg`
- `https://cdn.bestbrains.com/images/programs/sample-pages/math-intermediate-image-{1,2,3}.jpg`
- `https://cdn.bestbrains.com/images/programs/sample-pages/math-advanced-image-{1,2,3}.jpg`

All ~591×900 px JPEG (portrait US-letter proportions). Local copies saved to scratchpad `bb-samples/` for this session. Because Best Brains published these deliberately as samples, structural analysis is fully usable. Structure-only descriptions follow (no problem sequences reproduced beyond what is needed to name the task type).

#### Universal page anatomy (all 9 pages) — Confirmed / High
- Best Brains logo top-right corner on every page (two logo generations visible across the set — older "b" mark and newer "bestbrains" bulb mark → samples drawn from at least two curriculum print generations. **Inferred / Medium**).
- **Worksheet code bottom-right** on every page (see A2).
- Red-bold **"Directions:"** convention inside a rounded, color-outlined banner box; one banner per section.
- 1–3 sections per page, each framed in its own rounded rectangle.
- **Low problem density: roughly 3–6 problems per page** at every level; large fonts, generous whitespace, dedicated answer boxes (red-outlined squares) or ruled lines.
- Full color throughout: color-coded direction bars, colored problem numbers in yellow circles, colored key words.

#### Beginner (ages 3–5) — Confirmed / High
1. (code GMJrBgG2.4) Oral + motor combo page: say 4 large numerals aloud (each numeral drawn on an illustrated notepad graphic), then a numbered 3-step instruction list mixing color words with marks ("circle X with a yellow crayon / connect / draw an X") — number recognition fused with listening-comprehension and fine-motor work. Footer contains a **"Teacher's Note" strip with a pedagogical rationale for parents** (fine-motor skill development) plus a teacher mascot graphic.
2. (GM0aK3.4) Pre-algebra with pictures: three boxed problems of the form *symbol + n = m, what does the symbol equal?* (heart/star/flower icons as unknowns), one problem per box, red answer square each. Missing-addend algebra taught pictorially at age ~5.
3. (GM0bC5.3) Two-section page: (a) additive word problem with the instruction "write a number sentence and solve" over a large empty workspace; (b) "solve and color the petal" — a vertical 2-digit + 1-digit sum printed in a flower's center, four candidate answers on the petals (close distractors), coloring as the answer mechanism.

**Structural takeaways (Beginner):** multi-modal (oral, coloring, drawing, writing), embedded parent/teacher notes, real-world word problems and missing-addend pre-algebra already present at the earliest band.

#### Intermediate (ages 6–9) — Confirmed / High
1. (MEK3.2) Two sections: (a) three 2-digit subtractions typeset inside explicit **tens|ones place-value column scaffolds** with labeled color headers; (b) a bar-graph interpretation problem: short narrative context, a 4-category colored bar chart with numbered y-axis, and a comparison question underneath.
2. (MFH1.8) **"Brain Buster"** branded page (weight-lifting brain mascot, green-outlined directions): deductive shape identification from three sequential verbal clues (side counts/lengths/directions), choose among three dimensioned shape diagrams, then compute the perimeter. Logic puzzle and computation on one page.
3. (MGF2.4) Three sections: (a) balance-scale graphic equation (three identical star icons balancing a number → find the unit value), (b) multiplication word problem with open workspace, (c) four missing-factor equations (`a × □ = b` forms) in a two-column grid with red answer boxes.

**Structural takeaways (Intermediate):** heavy visual scaffolding (place-value columns, balance scales, graphs), named puzzle strand ("Brain Buster"), pre-algebra continued via missing factors/unknown-value icons, mixed computational + non-computational sections on a single page.

#### Advanced (ages 10+) — Confirmed / High
1. (GM6aR1.6) Inequalities concept page: fill a two-column **Always/Never table** for values of x in a one-step inequality, a conceptual short-answer ("is there a value that *sometimes* makes it true?"), multiple-choice identification of a valid inequality, and graphing on a printed number line. Concept-classification rather than drill.
2. (GM7N2.5) Two-variable linear inequality: graph and shade the solution set on a full 10×10 labeled coordinate grid; then verify ordered pairs with Yes/No checkboxes plus an error-correction prompt ("If no, give a pair that is"). Typography shifts to a serif, textbook-like style; direction banners give way to arrow-bullet headers.
3. (GM8N5.4) **"ANALYZE"** tagged page (magnifier badge): error-analysis prompt — two students factor the same quadratic differently; explain why both can be right, on ~6 ruled writing lines; extension task "factor a different way." Writing-about-math / metacognitive strand at the top band.

**Structural takeaways (Advanced):** decoration drops away, symbolic algebra and coordinate work dominate, and there is an explicit written-explanation / error-analysis strand.

#### Cross-level progression (from the 9 official samples) — Confirmed / High
- Algebraic thinking is threaded through all three bands: icon-as-unknown (3–5) → balance scale & missing factor (6–9) → variables, inequalities, factoring (10+).
- Non-computational reasoning appears at every level (color-instruction sequences, clue puzzles, always/never classification, error analysis) — matching the site's claim that "computational and non-computational concepts are covered weekly."
- Page furniture matures with age: mascots/coloring → branded puzzle badges → textbook typography.

### A2. Worksheet coding taxonomy (visible on official samples) — Confirmed (codes) / High; interpretation Inferred / Medium
Codes observed: `GMJrBgG2.4`, `GM0aK3.4`, `GM0bC5.3`, `MEK3.2`, `MFH1.8`, `MGF2.4`, `GM6aR1.6`, `GM7N2.5`, `GM8N5.4`.
- **Inferred / Medium:** Two schemes coexist. Newer: `GM` (G? Math) + level token (`JrBg` = Junior/Beginner; `0a`,`0b` = two kindergarten-ish sub-levels; `6a`,`7`,`8` = grade-aligned levels) + a topic letter (G, K, C, R, N…) + `sheet.page` decimal (e.g., 2.4 = unit 2, page 4). Older: `M` + level letter (`E`,`F`,`G`) + topic letter + n.n.
- **Inferred / Medium:** the decimal suffixes (x.2…x.8 observed) imply multi-page weekly packets per topic unit — consistent with the publicly described homework-booklet model.
- **Speculative / Low:** letter levels E/F/G suggest an A…-lettered internal level ladder in the older generation.

### A3. Official program-page topic list — Confirmed / High
bestbrains.com/math publishes the program-wide topic list: Number Sense & Counting; Addition & Subtraction; Multiplication & Division; Decimals & Fractions; Probability & Statistics; Algebra & Geometry. Three levels: Beginner 3–5 (number identification, sequence, writing numbers, manipulatives), Intermediate 6–9 (word problems, higher-level critical thinking, logic puzzles), Advanced 10+. Strategies named: word problems, real-world applications, **timed quizzes**, puzzle solving. Weekly instruction by certified teachers.

### A4. Baby Genius Math (ages 3–5) — Confirmed / High
https://bestbrains.com/baby-genius-math: number comprehension; counting with manipulatives; sequencing/ordering; number writing & recognition; **basic addition 0–10**. Materials: "colorful worksheets and manipulatives." Stated outcomes: fine motor, cognitive development, number fluency, classroom etiquette. No samples on this page.

### A5. Grade-level math curriculum guide articles (official center pages) — Confirmed / High (existence & content)
Best Brains centers publish grade-by-grade math syllabus articles (Cary NC center, bestbrains.com/cary/article/…; dated e.g. June 2026). Found in this sweep:
- **Grade 1** (`grade-1-math-curriculum-guide`): counting to 120 fwd/bwd; addition strategies (objects, visual models, number lines, make-ten); subtraction & fact families; place value (tens/ones); measurement (std/non-std units); time to hour/half-hour analog+digital; money; 2D/3D geometry; patterns & algebraic thinking; sorting/picture graphs.
- **Grade 2** (`grade-2-math-curriculum-guide`): numbers to 1,000, skip counting 2/5/10/100, odd/even; 2–3 digit +/− with regrouping; 1- and 2-step word problems; length customary+metric; time & money incl. making change; picture/bar graphs & tally charts; 2D/3D shapes & partitioning; visual halves/thirds/fourths.
- **Grade 3** (`grade-3-math-curriculum-guide`): multiplication as repeated addition, ×/÷ relationship; place value to 1,000+ w/ rounding; +/− within 1,000, mental math, multi-step; fractions as parts of whole (visual); measurement & data incl. elapsed time; geometry incl. symmetry, perimeter, area.
- **Grade 5** (`article/MathGrade5`): four operations on fractions, mixed numbers, equivalence; decimals all four ops; multi-digit ×, long ÷; coordinate plane, classifying shapes, angles; volume V=l×w×h; multi-step word problems.
- **Grade 7** (`article/MathGrade7`): ratios/rates/unit rates/proportions/percents; integers & rational numbers, absolute value; expressions, 1- and 2-step equations; geometry (circumference, surface area, volume); probability (experimental vs theoretical), mean/median/mode/range; percent applications (tax/tip/discount).
- Also: Mechanicsburg article on complementing "Bridges Math" district curriculum; Morrisville article on WCPSS Single Subject Acceleration (test-prep positioning).
**Caveat — Inferred / Medium:** these read as *school-standards* outlines (Common-Core-shaped) used for SEO/parent marketing, not a disclosure of Best Brains' internal level scope-and-sequence. They confirm Best Brains aligns its pitch (and likely its levels) to grade standards, but the internal level map is NOT published. Grades 4, 6, 8 guides were not found in this sweep (may exist; **Speculative / Low**).

### A6. Method / operational structure (official pages + official method article) — Confirmed / High
Sources: bestbrains.com/math, /bb-connect, /bb-support, columbia/article/meet-the-best-brains-method-why-our-program-works, plus site FAQ text surfaced in search:
- Weekly small-group class led by certified teachers; "students don't review old material — they learn something new every week."
- **Daily homework** from a **homework booklet**, ~10 minutes per subject per day; homework submitted and **graded weekly** with feedback.
- **Progress Book**: weekly written report that parents must review and **sign**; end-of-class verbal parent feedback (progress, behavior, improvement areas).
- bbConnect (online delivery): max 4 students/class, 30 min live instruction/week/subject, tablet+stylus homework mirroring center booklets, teachers may **reassign content for mastery** before advancing.
- bbSupport: free 24/7 homework-help app for enrolled students (one-on-one with certified teachers; closed Dec 25 + Jan 1).
- Math+Abacus positioned as complementary mental-math development ("solve problems quickly and accurately — often without a calculator").

### A7. Placement / initial assessment — Confirmed / High (description only)
Official description (bestbrains.com FAQ/home): **free placement test** in math and/or English, framed as comprehensive but "not a stressful school test"; purpose = assess current knowledge base and place the child into the Math/English curriculum; followed by a free detailed meeting with the **center director** going over results, orientation, and a **personalized academic plan**. **Confirmed absent / High: no sample or item-level description of the placement test is published anywhere official.**

### A8. Historical official freebies (2020, COVID era) — Confirmed / Medium-High
- Press coverage (Patch Naperville; greatandhra) of the official 2020 program: **free printable weekly workbooks, grades PreK–8, 20+ activities per week, open to non-enrolled families**, distributed via bestbrains.com/eLearning; plus official **YouTube videos with free follow-along downloadable worksheets**.
- Today: bestbrains.com/eLearning returns **404**; Wayback snapshots (2021, 2025) show it became a paid online-classes marketing page with no free PDFs. Only non-math stragglers remain on the CDN (`cdn.bestbrains.com/pdf/ASL-Worksheet-1.pdf`, `eLearning-Letter-Ww.pdf`, `Louis-Braille.pdf`, referral form). Probes for math PDFs under `cdn.bestbrains.com/pdf/` 404'd.
- **Conclusion — Confirmed / High: no free official math worksheet PDFs are currently downloadable from the official domain; the 9 sample images on /math are the only live official math samples.**

### A9. Official social channels (inventory; not mined) — Confirmed existence / High
- YouTube: youtube.com/bestbrains (a.k.a. /user/bestbrainslearning) — official; historically paired videos with worksheets.
- Instagram: @bestbrainscorporate — official corporate account.
- Per-center Facebook pages exist (linked from center subpages). Auth walls prevented content review this pass; no worksheet-structure photos were captured from social in this sweep. **Follow-up target if the pipeline needs more: browse @bestbrainscorporate and 2–3 large-center FB pages for progress-book / classroom-material photos.**

---

## B. EXISTS BUT OFF-LIMITS (proprietary / third-party — DO NOT MINE CONTENT)

1. **Scribd doc 760101551 — "Weekly Workbook for Grades PK3-4" (Wb Pk 3-4 Weeks 9-12)**, 64 pp, third-party uploader. Apparent nature: a Best Brains 2020-era free weekly workbook (PreK band, weeks 9–12; daily activities incl. mood tracker/reading log). Originally an official free publication (see A8), but the live copy is a **third-party re-upload → off-limits for content mining**. Its existence confirms the weekly-packet structure (week-numbered, ~daily activity cadence). Status: exists, off-limits.
2. **Scribd doc 794779530 — "B9 Best Brain Mathematics"**, 291 pp. **DIFFERENT ENTITY**: Ghana "Best Brain" (mock/exam papers, "B9" = Basic 9). Not the US franchise. Exclude entirely — this is the main disambiguation hazard when searching "Best Brains math" material. Status: exists, irrelevant + off-limits.
3. **Pinterest** pins tagged "Best Brains worksheets" (e.g., brain-teaser pin boards): third-party pinned images, some appearing to be worksheet scans/derivatives. Off-limits; low value anyway (mostly generic brain-teaser content, uncertain provenance).
4. **TeachersPayTeachers store named "Best Brains" (seller "By Felicia")**: third-party teacher storefront; naming coincidence, **not** the franchise (Speculative it has any relation / Low). Exclude.
5. No CourseHero/eBay listings of actual Best Brains center worksheets surfaced in this sweep (**Confirmed-absent in this sweep / Medium** — deeper marketplace sweeps not exhausted).

---

## C. WHAT DOES NOT EXIST PUBLICLY (gaps the pipeline must not pretend to fill)

- Internal **level map** (number of levels, level names, level→grade mapping) — only the 3 marketing bands + worksheet-code hints (A2). Not published.
- **Placement test samples** or item specs — described only at brochure level (A7).
- Full **scope-and-sequence** per Best Brains level (the grade guides in A5 are school-standards outlines, not internal sequence).
- **Progress Book** sample pages — described verbally, never shown officially in anything found this sweep.
- Downloadable brochures/curriculum PDFs for math on the official domain — none live (A8).
- Summer-camp math materials — program described (K–8, daily math+English instruction, field trips, chess/financial-literacy/space/public-speaking enrichment) but no material samples.

## D. Source register

| # | Source | Type | Status |
|---|--------|------|--------|
| 1 | bestbrains.com/math + 9 CDN sample images | Official marketing | Live; primary usable sample set |
| 2 | bestbrains.com/baby-genius-math | Official program page | Live |
| 3 | bestbrains.com/cary/article/{grade-1,grade-2,grade-3}-math-curriculum-guide, /article/MathGrade5, /article/MathGrade7 | Official center articles | Live, June-2026 era |
| 4 | bestbrains.com/columbia/article/meet-the-best-brains-method-why-our-program-works | Official method article | Live |
| 5 | bestbrains.com/bb-connect, /bb-support | Official product pages | Live |
| 6 | bestbrains.com/summer-camp (+ /article/best-brains-summer-camp-is-serious-fun) | Official | Live (fetched via search summaries) |
| 7 | bestbrains.com/eLearning | Official (dead) | 404; Wayback 2021/2025 = marketing only |
| 8 | cdn.bestbrains.com/pdf/* | Official CDN | Only non-math PDFs remain |
| 9 | patch.com Naperville; greatandhra.com | Press on official 2020 freebies | Live |
| 10 | youtube.com/bestbrains; instagram.com/bestbrainscorporate | Official social | Not mined (auth) |
| 11 | Scribd 760101551, 794779530; Pinterest; TPT | Third-party | OFF-LIMITS catalog only |
