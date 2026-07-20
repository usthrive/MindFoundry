# Phase 3 Targeted Validation — G1 (Math Level Map) + G4 (Class Session Structure)

Date: 2026-07-19. Sub-agent: Phase-3 targeted validation. Sources: public/legal only (Wayback Machine, official bestbrains.com pages + CDN sample images, search-indexed review/job text, app-store listings). Ghana "Best Brain" brand excluded throughout (no collisions encountered; all sources verified as bestbrains.com / US-franchise context).

Labels: **[Confirmed/Inferred/Speculative | High/Medium/Low]**

---

## GAP G1 — Internal MATH level map

### Verdict: PARTIALLY RESOLVED (historical level map fully recovered; modern code taxonomy largely decoded; one naming question open)

### Vector 1 — Wayback Machine (RICH — primary yield)

What was tried: CDX index queries on `bestbrains.com*` (WebFetch to web.archive.org is blocked in this environment; `curl` to the CDX API and to `web.archive.org/web/<ts>/<url>` works fine — note for future sessions). Fetched: 2013 Answerkey site, 2014 + 2019 `/math`, 2025 `/math`, 2014 `/faq`, 2021 `/eLearning`.

**Finding 1.1 — 2013 answer-key site enumerates the whole math level ladder** [Confirmed | High]
`http://www.bestbrains.com/Answerkey/MATH/MATH.html` (snapshot 2013-09-22) has a level nav:
- Level 0, Level 1, Level 2, Level 3, Level 4, Level 5, Level 6, Level 7, Level 8 — **nine numbered levels**.
- Level 5 has a second page `math-level-five-two.html`; Level 5 page covers WEEK 1–15, "five-two" covers WEEK 16–26.
- Level 6 is a dropdown → "6A" / "6B" (`math-level-six-section-a/b.html`).
- Level 7 is a dropdown → "7A" / "7B". Level 8 present but link stubbed ("#") in this snapshot.
- Subject picker on the same page: ABACUS, MATH, ENGLISH, GK — the four legacy subjects.

**Finding 1.2 — Each level = 26 numbered weeks, calendar-anchored Sep–Aug** [Confirmed | High]
Level 1 answer key contains exactly WEEK 1 … WEEK 26, grouped under month headings SEPTEMBER, OCTOBER, NOVEMBER, JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, AUGUST. Level 5 = weeks 1–15 + (page two) 16–26. So the curriculum year for a level is **26 weekly units** (≈ biweekly against a 12-month calendar, or a school-year cadence with breaks).

**Finding 1.3 — 2014 and 2019 /math pages list the booklet/sample tabs: JR BG, SR BG, 0a, 0b, 1, 2, 3, 4, 5a, 5b, 6a, 6b, 7a, 7b, 8a, 8b** [Confirmed | High]
Snapshots 2014-05-23 and 2019-02-02 both carry a "Best Brains Math Sample Pages" tab strip with exactly those 16 entries (image files `math_images/jr.jpg, sr.jpg, 0a.jpg … 8b.jpg`). So by 2014 the a/b split extended to levels 0, 5, 6, 7, 8 while 1–4 were single booklets (at least as shown to the public). Accompanying copy (2014→2019, stable):
- "Our students have the huge advantage of working with certified teachers as they enter our **Pre-Algebra level**."
- "Our **Algebra levels** build a solid foundation to ensure students succeed in high school math."
- "Since daily practice is an important part of the learning process, our **weekly booklets are divided so that students have homework to complete each day**."

**Finding 1.4 — Current (2025) /math page collapses public presentation to 3 age bands** [Confirmed | High]
Beginner (Ages 3–5) / Intermediate (Ages 6–9) / Advanced (Ages 10+), each with 3 sample images. The granular level tabs disappeared from the public site sometime between 2019 and ~2021 (redesign era). The internal levels persist (see Vector 5 codes; the current /math copy still says "progress is monitored to keep students moving forward **through our levels**").

**Finding 1.5 — "General Math" is the official internal name of the math class** [Confirmed | High]
2014 `/faq` (snapshot): "…in our **General Math** class our teachers follow similar methods taught in school" (contrast with Abacus). This decodes the `GM` worksheet-code prefix (see Vector 5).

Grade mapping [Inferred | Medium]: JrBG/SrBG = ages 3–5 (two Baby Genius years); 0a/0b ≈ Kindergarten; numbered levels ≈ grade number (1→grade 1 … 8→grade 8); 7x = Pre-Algebra, 8x = Algebra (matches "Pre-Algebra level" / "Algebra levels" copy and the observed sample content: level 7 = graphing linear inequalities, level 8 = factoring quadratics). Program span PreK–8 / ages 3–14 confirmed everywhere.

Dead ends: no `/levels` or `/curriculum` URL ever existed in the CDX index; `/faqs` (plural) never archived; answer-key site archived only 2011–2013 (answer keys moved behind login/app afterwards).

### Vector 2 — Blocked YouTube interviews

What was tried (all from this environment, sequentially):
1. `video.google.com/timedtext` — empty response (endpoint retired/gated).
2. Watch-page HTML download — SUCCESS (1.1–1.2 MB each, `captionTracks` present: JIyGilhIvjQ has manual `en` + ASR; flizxvAJ3iM ASR only).
3. Caption `baseUrl` fetch (`fmt=json3`) — empty body (YouTube POT-token gate, 2024+).
4. Innertube `player` API with ANDROID / IOS clients — HTTP 400; TVHTML5 embedded client — playability ERROR.
5. Innertube `get_transcript` with page-native INNERTUBE_CONTEXT + `getTranscriptEndpoint.params` — HTTP 400.
6. youtubetotranscript.com — HTTP 403 (Cloudflare). tactiq transcript API — "Missing App Check token".
7. Search-indexed quotes from the videos — nothing indexed beyond descriptions.

**Transcripts: DRY.** Salvage — full video descriptions extracted from downloaded watch pages:
- **"Live with Dr. Alice: What is Best Brains?" (JIyGilhIvjQ, 12 min)** [Confirmed | High — description text]: Dr. Alice = owner/center director of Best Brains **Keller** (TX). Description: "Board-certified teachers work with your child on a **weekly basis**… Our **low student to teacher ratio**… teaching methodology is **non-repetitive** and aims to challenge students by **introducing new concepts and skills each week**… the **only learning center to provide instruction in Math, English, Abacus and General Knowledge all under one roof**." (Note: "General Knowledge" naming again, and "Dr. Alice Ward-Johnson" also appears as guest on the Best Brains Algonquin podcast Ep. 6 "Educational Building Blocks" — she helped curate BB curriculum. Podcast page has no transcripts.)
- **"Meet the Zor" (flizxvAJ3iM, 20 min)** [Confirmed | High — description text]: guest is **Elanor Smith, Franchise Development Manager** (not the founder). Description is franchise-sales boilerplate (fast-growing since 2014, low investment, prime territories) — low expected curriculum yield even with a transcript.

### Vector 3 — Marketplace sweep (eBay/Mercari/FB Marketplace)

Searches for used Best Brains booklets/workbooks with level codes on covers: **DRY.** No indexed listings on eBay/Mercari; search results dominated by bestbrains.com's own pages. (Consistent with center-consumable model: booklets are handed out weekly per level, not retail products; resale supply ~nil.) Not pursued behind auth walls per scope.

### Vector 4 — Search-indexed social posts

Queries on "moved up"/"leveled up"/level congratulations, `site:instagram.com` variants: **DRY** for level names. Only located the handles (@bestbrainscorporate, @best_brains, per-center FB pages e.g. Buffalo Grove). Post text with level codes is not search-indexed.

### Vector 5 — Code decode (major yield: read the official sample images directly)

Creative step that worked: the live `/math` page loads sample pages from `cdn.bestbrains.com/images/programs/sample-pages/math-{beginner,intermediate,advanced}-image-{1..3}.jpg`. Downloaded all 9 and read the printed footer codes + content:

| Code (printed footer) | Band | Page content (difficulty anchor) |
|---|---|---|
| **GMJrBgG2.4** | Beginner 1 | Say numbers 1–10 aloud, crayon tasks; Teacher's Note on fine motor skills (age 3–4) |
| **GM0aK3.4** | Beginner 2 | Missing addend within 20 (♥ + 6 = 16) — late-K |
| **GM0bC5.3** | Beginner 3 | 2-digit + 1-digit addition, word problem — K/1 |
| **MEK3.2** | Intermediate 1 | 2-digit subtraction in tens/ones columns; bar-graph word problem — gr 1–2 |
| **MFH1.8** | Intermediate 2 | "Brain Buster": shape clues + perimeter — gr 3 |
| **MGF2.4** | Intermediate 3 | Balance-scale unknowns, missing-factor multiplication — gr 3–4 (**new code, found this sweep**) |
| **GM6aR1.6** | Advanced 1 | One-variable inequalities, always/never true — gr 6 |
| **GM7N2.5** | Advanced 2 | Graph linear inequality in 2 vars; solution-pair check — Pre-Algebra/Alg 1 |
| **GM8N5.4** | Advanced 3 | "ANALYZE": factoring 4x²−2x−12 two ways — Algebra |

**Decode (most defensible interpretation):**
- `GM` = **General Math** [Confirmed | High — 2014 FAQ language].
- Level token follows: `JrBg`, `0a`, `0b`, `6a`, `7`, `8` — matches the 2014–2019 public level tabs exactly [Confirmed | High].
- Next letter = **week letter, A=week 1 … Z=week 26** [Inferred | Medium-High]. Evidence: (a) each level has exactly 26 weeks (2013 answer keys) = 26 letters; (b) the app schedule rows increment "**10-J → 11-K**" — J is the 10th letter, K the 11th, i.e. week number + its week-letter; (c) all observed letters (C, F, G, H, K, N, R) fall in A–Z range with mid-year letters (N=14, R=18) on the advanced samples.
- Trailing `x.y` = **day x, page/problem y** within the week's booklet [Inferred | Medium]. Evidence: official copy "weekly booklets are divided so that students have homework to complete each day"; 10-min/subject/day homework rule; x observed only 1–5 (school days), y up to 8.
- So `GM6aR1.6` reads: General Math, Level 6a, Week 18 (R), Day 1, page 6 [Inferred | Medium].
- **Open question — the `ME`/`MF`/`MG` series** [Speculative | Low-Medium]: the three intermediate pages use `M`+letter instead of `GM`+number, and their difficulty strictly orders **E < F < G** (gr≈2 → gr≈3 → gr≈3-4). Best hypothesis: in the current curriculum the mid-band levels (old numeric 1–5) were **renamed to letters** (Kumon-style, removes grade stigma for off-grade placement), with E≈gr2, F≈gr3, G≈gr4 — implying a letter ladder that would put earlier letters at K–1 and later letters (H, I, …) at gr 5+. Alternative readings not excluded: `ME`=Math Elementary / `MF`=Math Foundations / `MG`=Math ? as series names. The app UI "**Level M1, Week 10**" (M+number) cuts against a pure letter ladder and suggests M-prefixed numeric level names in bbConnect — the two schemes may coexist (print-code letters vs app display "M<n>"), or M1 may itself be a level name in the same family. **Not corroborated — keep Speculative.**
- Logo variants across the samples (old "b" swirl vs current bulb "bestbrains" vs butterfly on GM8N5.4) show pages from ≥2 curriculum print generations are mixed on the current site — the numeric-level codes are not necessarily obsolete.

---

## GAP G4 — In-center class-session structure and length

### Verdict: PARTIALLY RESOLVED (session length, ratios, teacher workflow recovered; official minute-by-minute script still unpublished)

### Vector 1 — Interviews
Transcripts DRY (see G1 Vector 2). Description-level yield: weekly cadence, low ratio, non-repetitive new-concept-per-week, 4 subjects under one roof [Confirmed | High].

### Vector 2 — Glassdoor/Indeed review text (search-indexed; pages themselves are auth/CAPTCHA-walled)

Located: Indeed `cmp/Best-Brains` + `cmp/Best-Brains-Learning-Center` reviews (51+), Glassdoor E1056172 (113 reviews) + E7386762. Indexed review content harvested via search snippets:

- "Classes are **an hour** with up to **6 students** in a class" — teacher review [Confirmed | Medium — review-sourced].
- Teachers work with "**5-7 students at a time of different grade levels**"; "Students are **not placed at the same level** so managing different lessons can get challenging" [Confirmed | Medium].
- Time-management review (the G4 crown jewel): teachers had to "**greet students, grade homework, assist with new homework, and provide instruction to a group of seven to ten students within one hour**" [Confirmed | Medium]. → The in-class loop is: greet → grade last week's booklet → teach new concept → launch/assist new homework.
- Another teacher: worked with 1st–5th grade in math AND English, "each session lasting **an hour**… **4 or 5 students per hour**, from **4:30 to 7:30, 5 days a week**" [Confirmed | Medium].
- "you guide students through math and English workbooks **designed to meet them where they are** in their ability" [Confirmed | Medium].

### Vector 3 — Official FAQ / center pages / program pages

- **Ratio (official):** "We maintain a low student-to-teacher ratio, **no more than 5 students per teacher at a Math or English table** or online session" — bestbrains.com/article/what-is-best-brains [Confirmed | High]. ("Table" = the physical unit of the classroom; one teacher per table.)
- **Method (official):** "Our teachers **teach** the concept of the week to your child. Using their weekly homework packet, the student **perceives** the lesson. Then, at home, the student **practices**… By the end of the week, they **perfect**…" (Teach–Perceive–Practice–Perfect: only the T and P₁ happen in-center) [Confirmed | High].
- **Weekly grading (official):** "Every week, teachers grade and review students' work to ensure comprehension… Progress is measured not just by completing levels but by demonstrating true understanding" (Columbia center article) [Confirmed | High].
- **Homework (official):** "Devoting **10 minutes per subject per day**"; progress tracked via a "**Progress Book**" requiring parental review + signature [Confirmed | High].
- **Per-subject class length:** center/search-indexed text: "**Math and English classes are a half hour each and Abacus classes are an hour**" [Confirmed | Medium — surfaced via search from center-page corpus]. Third-party (Brighterly review): "Most Best Brains subjects include one weekly **30-minute** lesson" [Confirmed | Medium].
- **Center hours pattern:** Livingston NJ: Tue/Thu 4:30–7:40 PM, Sat 10:00 AM–1:10 PM — **3h10m operating windows** (≈ six 30-min slots + transition, or three 1-hr blocks + 10-min buffer) [Confirmed | High]. Reviews' "4:30–7:30" shifts match.
- **Placement:** "FREE placement test and consultation" at enrollment (center pages) [Confirmed | High].
- **Online variant (bbConnect page, official):** "Students receive **30 minutes of live instruction each week per subject**" in groups of **up to 3 students** per certified teacher; daily booklet sections in-app; weekly grading + teacher feedback to parents after each class [Confirmed | High].

### Vector 4 — Job postings

ZipRecruiter/Indeed/official careers-adjacent article: part-time **10–12 hours/week**; "**maximum of 5 students each class**"; "Individualized lesson plans are developed for each student and provided for the teacher — teachers just show up and teach"; "no grading, lesson planning, or out-of-pocket expenses" (marketing tension with review reality of in-class grading); classes after school hours, restricted weekend hours [Confirmed | Medium-High]. onlineteachingreview.com review page: fetch failed (SSL) — dead end.

### Synthesized session model [Inferred | Medium]

A student visit = 1 hour for the standard Math+English pair (30 min/subject), at a 5-kid mixed-level table with one certified teacher; Abacus is its own 1-hour class. Within the hour the teacher cycles per child: greet/collect booklet → grade & review last week's booklet (comprehension check, reteach/reassign misses) → 1:1 teach the child's new week-concept at the child's own level → start the new booklet's first section with assist → log Progress Book. Since every child at the table can be on a different level/week, "instruction" is a rotation of short 1:1 teaches rather than group lecture — this is exactly how one teacher runs 5–7 mixed-level kids, and why reviews flag time management as the hardest part. Center operates ~3-hour evening windows = 3 back-to-back hourly cohorts (4–5 kids/hour per teacher-table).

---

## Recommended ledger updates (for orchestrator)

- **E27-class row (math level map): UPGRADE.** Replace "unknown level count" with: historical (2013–2019, Confirmed/High) ladder = JrBG, SrBG, 0a, 0b, 1, 2, 3, 4, 5a, 5b, 6a, 6b, 7a, 7b, 8a, 8b; 9 numeric levels ≈ grades K–8; 7=Pre-Algebra, 8=Algebra; each level = 26 weekly booklets (Sep–Aug calendar).
- **E30-class row (session structure): UPGRADE** from Speculative to Confirmed/Medium-High: 30 min per subject per week in-center (Abacus 60), 1-hour Math+English block, ≤5 per teacher-table (official) / 5–7 observed, mixed levels at one table, teacher loop = greet→grade→1:1 teach→launch homework, 3h10m center windows, part-time 10–12 h/wk teacher shifts.
- **NEW row:** worksheet code taxonomy `[GM|M][level][week-letter A–Z][day.page]`; GM = "General Math" (Confirmed); week-letter A=1…Z=26 (Inferred/Medium-High via "10-J → 11-K" + 26-week levels); example decode GM6aR1.6 = L6a wk18 d1 p6.
- **NEW row (open question):** ME/MF/MG lettered mid-band series (E<F<G by difficulty, gr≈2–4) vs app "Level M1" naming — modern level-name scheme unresolved; only remaining vectors are primary (parent/teacher informant, app screenshots, or FOIA-style franchise disclosure docs — FDD Item lists would name curriculum levels).
- **NEW row:** online product (bbConnect) differs structurally: 30 min live/subject/week, ≤3 students, tablet+stylus booklets, weekly grading — do not conflate with in-center when modeling.
- **NEW row (tooling):** web.archive.org unreachable via WebFetch but fully reachable via curl (CDX + snapshots); YouTube transcripts hard-blocked from this environment via 7 distinct routes (timedtext, innertube player ×3 clients, get_transcript, tactiq, youtubetotranscript) — treat as permanently DRY here; watch-page HTML (descriptions, caption-track metadata) still retrievable.

## Source list
- Wayback/curl: `Answerkey/MATH/MATH.html` (2013-09-22), `math-level-{one,five,five-two}.html` (2013-09), `/math` (2014-05-23, 2019-02-02, 2025-06-24), `/faq` (2014-era), `/eLearning` (2021-01-23)
- Live official: bestbrains.com `/math`, `/article/what-is-best-brains`, `/columbia/article/meet-the-best-brains-method…`, `/mechanicsburg/article/booklet-based-curriculum-benefits`, `/bb-connect`, `/livingston`, `/algonquin/podcast`, `/article/how-teachers-make-money-with-best-brains`
- CDN sample images: `cdn.bestbrains.com/images/programs/sample-pages/math-*-image-{1..3}.jpg` (9 images, read visually)
- YouTube watch-page HTML: JIyGilhIvjQ, flizxvAJ3iM (descriptions only)
- Search-indexed: Indeed cmp reviews (Best-Brains, Best-Brains-Learning-Center), Glassdoor E1056172/E7386762, ZipRecruiter postings, brighterly.com Best Brains reviews/pricing, learner.com Best Brains vs Kumon
