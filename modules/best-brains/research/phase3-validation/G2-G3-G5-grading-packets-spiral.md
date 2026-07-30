# Phase 3 Targeted Validation — G2 (Passed/Review gate), G3 (packet internals), G5 (spiral vs non-repetitive)

Research date: 2026-07-19. Public/legal sources only. Ghana "Best Brain" excluded (no collisions encountered this pass).
Labels: **Confirmed** = directly observed on source; **Inferred** = reasoned from sources; **Speculative** = plausible, unverified. Confidence H/M/L.

---

## GAP G2 — Passed/Review mastery-gate mechanics — PARTIALLY RESOLVED

### Vector 1: bbConnect app-store listings + version history

**Student app (Best Brains bbConnect, Apple id1526879337) — Confirmed / High**
- Description: mastery-progression language — "each student works at their own pace," students must "perfect each concept before moving on"; "Homework is graded weekly to check progress"; "Teachers also monitor periodic tests to measure improvement."
- Version history (latest 1.4.6, June 2026): all notes are generic perf/bugfix EXCEPT v1.4.4 (11/24/2025) "Homework Bookmark feature." **No grading/threshold-related release notes ever published. Dead end for threshold. Confirmed-absent / High.**

**Parent app (BBConnect Parent, Apple id1547858377) — Confirmed / High — NEW STRUCTURAL FIND**
- Description verbatim: "Parents are able to view their child's weekly **Progress Log**, with homework results and feedback from the teacher, view test results in the **Test Log**, and view their child's Schedule."
- Full version history captured (1.0 06/17/2021 → 1.1.2 Mar 2026). One informative note: **v1.0.7 (06/13/2023): "Test log pages details screen changed"** — i.e., the Test Log drills down to a per-page details screen. Tests and homework are tracked in SEPARATE logs with separate UI. **Confirmed / High.**
- No "Passed"/"Review" strings, no thresholds anywhere in store copy. **Confirmed-absent / High.**

### Vector 2: Glassdoor / Indeed employee text

- Grader job listings (Glassdoor: Middletown DE, Round Rock TX; Indeed cmp pages) — **Confirmed / High**: graders "accurately grade student assignments in Math and English **using provided answer keys**"; they support teachers "by reviewing and checking student workbooks for **accuracy, consistency, and completeness**"; grading "must be completed in a timely manner to support class flow." Grader is an entry-level clerical role (high-school/college students).
- Indeed grader reviews (6 reviewed): nothing on thresholds/mechanics — content is working-conditions complaints ("grader position is very easy... mundane and repetitive," mold-smelling grading room, children's chairs) and logistics ("getting the correct books, making sure that everything goes where it is supposed"). **Dead end for mechanics. Confirmed-absent / Medium** (Glassdoor review full-text partially unindexed; not exhausted).
- **Inference from the grader role (Inferred / Medium):** graders mark against answer keys and produce a raw score; they have no pedagogical discretion. The Passed/Review status is therefore almost certainly computed from the raw % (system-side cutoff), not a teacher judgment call per packet. Teacher discretion enters afterwards (what to do about a Review).

### Vector 3: Official bestbrains.com corpus

- bestbrains.com/bb-connect — **Confirmed / High** (canonical official sentence, appears verbatim on bb-connect page and app-store description): "**Homework may be reassigned and retaught so that the student can perfect each concept before moving on to a new topic.**" FAQ on same page: "How often is homework graded?" → "Homework is graded each week and feedback is provided on student's performance and progress."
- bestbrains.com/columbia/article/meet-the-best-brains-method... (Feb 2026) — **Confirmed / High**: "progress measured not just by completing levels but by demonstrating true understanding"; weekly grading + regular parent reports.
- No official page states a numeric pass threshold, what "reassign" concretely re-issues (same packet vs modified), or a test-retake policy. Site-wide searches for %-thresholds return nothing. **Confirmed-absent / High.**

### G2 synthesis

| Question | Best current answer | Label |
|---|---|---|
| Numeric Pass/Review cutoff | NOT public anywhere. Observed bracket ~45–62% (from Phase-1/2 app observations: Pass ≥63, Review ≤42) stands as the only estimate. A conventional 50% or 60% school-style cutoff fits the bracket. | Confirmed-absent (public) / High; bracket Inferred / Medium; "50 or 60%" Speculative / Low |
| Who/what assigns the status | Raw % from answer-key grading by clerical graders → status computed by system against a fixed cutoff; not per-packet teacher judgment | Inferred / Medium |
| What "reassign/reteach" does | Official verb pair only: "reassigned AND retaught" — i.e., (a) content re-issued in-app/booklet and (b) teacher re-instruction, before advancing to a new topic. Whether the re-issued packet is identical or modified is not public. | Confirmed (verbs) / High; mechanics Confirmed-absent / High |
| Tests vs homework consequence | Structurally separate: weekly Progress Log (homework results + teacher feedback) vs Test Log (per-page details screen). Tests are "periodic... to measure improvement" — monitoring instruments; no published gate/retake consequence attached to tests. | Confirmed (separation) / High; "no gate on tests" Inferred / Medium |

**Residual dark spot:** exact cutoff + identical-vs-modified reassignment. Only realistic public paths left: parent-forum screenshots (none indexed as of this pass — Reddit has "no substantial feedback on Best Brains as of June 2026" per Brighterly), or first-party observation in the bbConnect Parent app.

---

## GAP G3 — Weekly packet internals — PARTIALLY RESOLVED (structure yes, exact page counts no)

### Vector 1: The YouTube walkthrough (cvVeL689g9M) — DEAD END beyond metadata

- Metadata recovered via oEmbed + page parse — **Confirmed / High**: title "New bestbrains app called BBCONNECT," channel "Shaurya" (@shaurya4833), uploaded 2021-07-05, length 749 s (12:29), 18 views.
- **Description is EMPTY; zero caption tracks (no ASR transcript exposed).** No text to mine. **Dead end / High.**
- Uploader channel: only 3 other videos, all unrelated kid gaming ("The video ends when I drop the ball," "Stream," "Fortnite gameplay"). **Dead end / High.**
- Note: video is from July 2021 = bbConnect v1.0 era; in-app pagination it shows may predate current UI (Homework Bookmark etc. came 2025).

### Vector 2: Official structure statements — NEW FINDS

- bestbrains.com/article/best-brains-online-a-how-to-guide — **Confirmed / High**, verbatim: "When you sign up for online learning, you'll be getting all your materials on a **month-by-month basis**. If you're signed up for Math, English, and Abacus, **that's 12 books**." → 12 books/month ÷ 3 subjects = **4 books per subject per month = one booklet per subject per week, shipped in monthly batches** (Inferred / Medium-High). Also: "check the **front of your packet** for instructions and the answers you went through with the teacher" (packet front = instructions + in-class worked answers); "doing **each section** of the homework **every day**"; "no more than 15 minutes per subject."
- bestbrains.com/mechanicsburg/article/how-to-get-the-most-out-of-best-brains (Apr 2026) — **Confirmed / High**, verbatim: "Even: **5–10 minutes per day / One page completed consistently** / A few math problems done with focus — creates powerful compounding growth." → official copy equates a day's dose to roughly **one page**. (Framed as a minimum-consistency example, not a spec; Inferred / Medium that nominal load ≈ 1–2 pages/day.)
- bestbrains.com/bb-connect — **Confirmed / High**: "Each day, students log onto the app to complete a **section** of their homework booklet — identical to the ones used for our in-person program"; "**Each daily assignment will be ready when the student signs in**" (= daily unlock, corroborating the video's daily page-unlock).
- bestbrains.com/mechanicsburg/article/booklet-based-curriculum-benefits (Sep 2025) — **Confirmed / High**: 100% booklet/paper-based positioning; "students feel successful as they complete **each booklet** and move on to the next."
- Day-labeling: NOT found in any indexed official text (no "Day 1"/weekday labels described). **Confirmed-absent this pass / Medium.** Strand ordering within a week: not public; only the worksheet-code system (unit.page decimals x.2–x.8 on official samples, see phase1 06-sample-materials.md A2) hints at multi-page per-topic units. **Inferred / Medium.**

### Vector 3: 23-page vs 56-page reconciliation

Data points now on the table:
1. 56-page booklet paginated in-app (2021 video, Phase-1/2 observation).
2. 23-page figure (prior phase note).
3. 2020-era free weekly workbook (Scribd 760101551, off-limits for content but catalogued): "Weeks 9–12" compilation = **64 pp for 4 weeks ≈ 16 pp/week** (PreK band).
4. Official: one booklet ≈ one week; materials shipped monthly (4 books/subject); ~1 page (5–15 min)/day/subject.

**Best reconciliation (Inferred / Medium):** ~56–64 pages ≈ a FOUR-WEEK (monthly) compilation volume (~14–16 pp/week), consistent with the Scribd 4-week/64pp datapoint — the 2021 bbConnect app likely paginated a month's booklet with daily unlocks. The 23-page figure ≈ a SINGLE-WEEK packet (≈3–4 printed pages/day over 6 days incl. cover/instructions page), plausibly a different band/subject or the in-center weekly packet. Contradiction is then "monthly volume vs weekly packet," not a real conflict. **Alternative (Speculative / Low):** 56-page = one week at a high level with multi-page daily sections. No official page-count statement exists to settle it. **Confirmed-absent / High.**

---

## GAP G5 — Spiral review under "non-repetitive" — RESOLVED (to the limit of public evidence)

### The two official claims (both Confirmed / High, verbatim)

1. **Anti-review copy:** bestbrains.com/columbia/article/meet-the-best-brains-method (Feb 2026): "Students at Best Brains **don't review old material — they learn something new every week**. Our curriculum is thoughtfully designed to **build skills sequentially**..." bestbrains.com/article/what-is-best-brains: "We take a fun, **non-repetitive** approach... teaching kids **one concept at a time**"; "concept of the week... By the end of the week, they perfect their understanding of the concept, and are ready to learn something new!"
2. **Pro-reinforcement copy:** bestbrains.com/mechanicsburg/article/booklet-based-curriculum-benefits (Sep 2025): "Our curriculum is designed to **build incrementally, reinforcing concepts over time** through: Step-by-step instruction / Skill-specific exercises / **Weekly repetition with increasing complexity**. This mastery-based approach... helps prevent gaps in understanding." Also how-to-get-the-most (Apr 2026): Progress Book helps parents "**Reinforce key skills during the week**."

### Reconciliation — Inferred / Medium-High

"Non-repetitive" is competitive positioning (vs Kumon-style drill: no repeating the same worksheet type for weeks). It does NOT mean strictly-new content: official copy elsewhere admits **skill-strand spiral — the same skills recur at increasing complexity across weeks** ("weekly repetition with increasing complexity," "build incrementally, reinforcing concepts over time"). So: each week = one NEW named concept; prior SKILLS re-enter as substrate inside new-concept pages, not as dedicated review pages.

### Corroboration from the 9 official sample pages (phase1 06-sample-materials.md, reread)

- Cross-LEVEL spiral confirmed on official samples: algebraic thinking threaded icon-unknowns (3–5) → balance-scale/missing-factor (6–9) → variables/inequalities/factoring (10+). **Confirmed / High** (strand recurrence at rising complexity is visible in Best Brains' own chosen marketing samples).
- Worksheet codes (topic-letter + unit.page) indicate topic-organized units, no "review"/"mixed" code variant observed among the 9 codes. **Weak negative for dedicated review pages / Inferred / Low** (n=9).

### Mastery loop as the review mechanism — Inferred / Medium

The ONLY officially described mechanism that re-touches old material is failure-triggered: "homework may be reassigned and retaught" before moving on (G2). I.e., review is exception-driven (per-student, on Review status), not built into every student's weekly packet.

### Summer Power Up — NOT review-heavy — Confirmed / High

bestbrains.com/redmond-northeast/summer-power-up (also allensouth): accelerated program — "complete the concepts for an **entire grade level in just 8–9 weeks**," goals = "Get ahead... / **Catch up to grade level** / Strengthen foundational skills"; 2-hr sessions 2–4×/week, 12/18/24-session packages, **"No homework."** It is compressed forward-coverage (or catch-up re-coverage of a full grade), not a spiral-review add-on. Does not evidence in-year spiral either way.

### Tests cumulative? — DRY

Only official language: "Teachers also monitor **periodic tests** to measure improvement" (bbConnect); "monitors student performance weekly through scores on practice tests and quizzes" (why-us-adjacent copy, search snippet). Nothing public on whether tests cover prior weeks. **Confirmed-absent / Medium.**

---

## Dead ends (explicit)

- YouTube cvVeL689g9M: empty description, 0 caption tracks, uploader channel unrelated. Nothing mineable beyond metadata.
- bbConnect student-app version history: generic notes only; no grading semantics.
- Glassdoor/Indeed grader REVIEW text: working conditions only; no threshold/mechanics. (Glassdoor full text partially unindexed — not exhausted.)
- Numeric threshold, day-labels, identical-vs-modified reassignment, test-retake policy, cumulative-test composition: absent from all indexed public sources.
- Reddit/DCUM/City-Data: no substantive Best Brains grading threads indexed as of this pass.
- Google Play listing fetch truncated (nav only); store description matches Apple copy per search snippets, no unique info lost.

## Source register (this pass)

| Source | Use |
|---|---|
| apps.apple.com/us/app/best-brains-bbconnect/id1526879337 | Student-app copy + version history |
| apps.apple.com/us/app/bbconnect-parent/id1547858377 | Parent-app copy + FULL version history (Progress Log / Test Log / per-page test details) |
| bestbrains.com/bb-connect | Canonical reassign/reteach + daily-section + weekly-grading copy |
| bestbrains.com/article/best-brains-online-a-how-to-guide | Month-by-month materials, 12 books/3 subjects, packet-front instructions |
| bestbrains.com/mechanicsburg/article/how-to-get-the-most-out-of-best-brains | "One page... 5–10 minutes per day" |
| bestbrains.com/mechanicsburg/article/booklet-based-curriculum-benefits | "Weekly repetition with increasing complexity" |
| bestbrains.com/columbia/article/meet-the-best-brains-method-why-our-program-works | "don't review old material" + mastery measurement |
| bestbrains.com/article/what-is-best-brains | "non-repetitive," concept-of-the-week loop |
| bestbrains.com/redmond-northeast/summer-power-up | Summer Power Up structure |
| bestbrains.com/article/timed-math-tests | Philosophy: timed tests ungraded, "grading should reflect comprehension, not speed" |
| Glassdoor/Indeed grader listings + reviews | Answer-key clerical grading role |
| youtube.com watch cvVeL689g9M + @shaurya4833 | Video metadata; dead end |
| brighterly.com/blog/best-brains-reviews | Third-party; confirms non-repetitive marketing + parent complaints; no grading mechanics |
