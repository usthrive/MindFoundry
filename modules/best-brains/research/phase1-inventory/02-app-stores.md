# Phase 1 Inventory — 02: App Stores (bbConnect + Best Brains app family)

Research date: 2026-07-19. Category: APP STORES. All sources public (Google Play, Apple App Store, Apple iTunes Search/Lookup API, Apple customer-review RSS, official bestbrains.com pages, third-party review roundup). Labels: **Confirmed** = official store listing/API; **Inferred** = pattern across user reviews or multiple public sources; **Speculative** = plausible reading, single weak source.

---

## 0. The Best Brains app family (map)

Best Brains does NOT run on one app. Five apps, all developed by **Advansoft International Inc** (iOS seller) / published as **Best Brains Inc.** (Google Play developer account, links to bestbrains.com):

| App | Role | iOS id | Android package | iOS since | Android installs |
|---|---|---|---|---|---|
| **bbConnect** | Student virtual classroom + homework + parent monitoring (Android) | 1526879337 | com.bestbrains.bbconnect | 2021-06-18 | 1K+ |
| **bbParent** ("BBConnect Parent") | iPhone parent companion (schedule, progress log, test log) | 1547858377 | — (no Android version; Play returns 404) | 2021-06-17 | — |
| **bbSupport** | On-demand live homework-help sessions (1:1 with a teacher) | 6473837922 | com.bestbrains.bbsupport | 2024-08-16 | 5K+ |
| **bbSlate** | Homework-only app for center (in-person) students: receive weekly packet, write with stylus, submit | 6747179521 | com.bestbrains.bbslate | 2025-09-18 | 100+ |
| **bbAnswerKeys** | Staff/teacher tool: answer keys for all levels of Math/English/Coding — homework booklet keys, test keys | (Amazon Appstore too) | com.bestbrains.bbanswerkeys | — | 1K+ |
| **bbEnroll** | Franchisee tool: paperless enrollment forms → uploaded to franchisee "Portal"; 10-part parent-education video series | — | com.bestbrains.bbenroll | — | 500+ |

- **Confirmed / High** — family membership, developer, package names, install brackets (Google Play developer page + individual listings + iTunes Lookup API).
- **Inferred / High** — division of labor: bbConnect = *online* program students; bbSlate = *in-center* students' homework digitization (launched Sept 2025, "make homework smoother, faster, and greener", "no printing or scanning"); bbSupport = homework help between classes; bbAnswerKeys/bbEnroll = internal/franchise ops.
- **Inferred / Medium** — the paper homework booklet is being actively digitized franchise-wide (bbSlate's late-2025 launch + "greener" framing + bbAnswerKeys "homework booklet key" wording implies booklets still exist in paper form at centers).

---

## 1. bbConnect — Google Play listing

Source: https://play.google.com/store/apps/details?id=com.bestbrains.bbconnect (full HTML captured 2026-07-19).

### Description (paraphrase of official text)
- Official virtual classroom app for Best Brains Learning Centers; "live weekly classes, certified teachers, and daily app-based homework" for Math and English, ages 3–14. **Confirmed / High**
- Live weekly classes: one certified teacher + up to 3 peers, real-time instruction and feedback. **Confirmed / High**
- Daily homework in the app: 15-minute daily assignments **per subject**, done with a stylus; "interactive, skill-based". **Confirmed / High**
- "Weekly Grading & Ongoing Progress Checks — Homework is graded every week, and students take periodic tests so teachers can track improvement." **Confirmed / High**
- Mastery pacing: "Students only move forward after mastering each concept." **Confirmed / High** (marketing claim; review evidence below complicates it)
- Parent monitoring: "Parents can install bbConnect on any Android phone to view homework, test scores, weekly grades, and class consistency—anytime." → On Android the PARENT view lives inside bbConnect itself (no Android bbParent app exists). **Confirmed / High**
- Curriculum: teacher-designed, "introduces one new concept each week, reinforced through daily practice"; supports both above-grade-level work and catch-up. **Confirmed / High**
- Teachers: licensed, background-checked, US/Canada-based; same teacher every week. **Confirmed / High** (as a claim)

### Store stats
- 1K+ downloads; content rating Everyone; free, no IAP. **Confirmed / High**
- Last updated **Jun 3, 2026**; Android version string ~1.4.10. **Confirmed / High**
- No aggregate star rating displayed on Play and no server-rendered reviews → below Google's minimum ratings threshold. **Confirmed / High** (that it's not shown); **Inferred / High** (very small Android review base; the online program's student base skews iPad).

### Google Play screenshots (described)
1. Brand slide: "Bring out the best in your kids" / tablet showing "A Learning app for Every Child". **Confirmed / High**
2. Caption "Login daily for new assignments, live teaching, and feedback." Phone dashboard: "Hi, Melissa"; big class card "English (test) / Math (test), 10:00–11:00, James Bush, [Join]"; "View schedule" list (Next: English 3:00 February 20; Math 10:00 February 21); Homework section below. **Confirmed / High**
3. Progress screen (phone): entries grouped by date (November 20, November 21…), each date shows Math and English rows with "Week: 13-IC" and score chips "**Passed** 63%" (green) / "**Review** 23%" (red), plus free-text teacher comment block ("…independent and has an excellent memory. Needs to work on her writing."). **Confirmed / High**
4. Schedule screen (phone): "Next Classes" — cards "2:00 pm – 3:00pm | Math [Test badge] | Level: A-1 | Week: 2-D" and "English | Level: A-1 | Week: 2-D"; test sessions highlighted yellow; recurring same weekly slot (November 12 shows identical cards). **Confirmed / High**
5. Login screen: bbConnect logo, username/password + "Forgot the password?" — credentialed accounts (center-issued), no self-signup visible. **Confirmed / High**
6. In-app Privacy Policy page (bestbrains branding, "BBConnect Privacy Policy"). **Confirmed / High**

---

## 2. bbConnect — Apple App Store listing

Source: https://apps.apple.com/us/app/bbconnect-best-brains/id1526879337 + iTunes Lookup API.

### Stats (iTunes API, authoritative)
- Rating **3.71 stars from 7 ratings** (US). Released 2021-06-18. Current version **1.4.6 (2026-06-09)**. Category Education, 4+, ~55 MB. **Confirmed / High**
- Platforms: **iPad-first** (iPadOS 15+), Mac (M1+), Vision; NOT an iPhone app (0 iPhone screenshots, 4 iPad screenshots). Student experience is tablet+stylus by design. **Confirmed / High**
- Marketing bullets same as Play, plus: "Over 95% of students earn BETTER GRADES", "9 out of 10 outperform peers in Math/English". **Confirmed / High** (as claims)
- Privacy label: only non-identifying diagnostics (crash data), not linked to identity. **Confirmed / High**

### iOS version history (What's New) — update cadence
| Version | Date | Notes |
|---|---|---|
| 1.0.6 | 2022-05-06 | redesign, new features |
| 1.0.7 | 2022-12-22 | functionality changes |
| 1.0.8 | 2023-01-19 | small UI fixes |
| 1.1.0 | 2023-05-15 | **answer keys for teachers**, UI/UX |
| 1.2.0 | 2024-05-17 | **enhanced survey logging, improved scheduling, mandatory test navigation** |
| 1.3.0/1.3.1 | 2024-10 | UI/performance |
| 1.4.0 | 2024-12-20 | performance |
| 1.4.1–1.4.3 | 2025 Q2–Q3 | performance |
| 1.4.4 | 2025-11-24 | **Homework Bookmark feature** |
| 1.4.5–1.4.6 | 2026 Q1–Q2 | performance |

- **Confirmed / High** — table above (App Store version history).
- **Inferred / Medium** — feature signals: "mandatory test navigation" (1.2.0) = tests are gated flows students must complete in order; "Homework Bookmark" (1.4.4) = students needed a way to mark/resume spots in multi-page homework packets — consistent with ~23-page weekly packets seen in screenshots. Update cadence ≈ every 2–4 months, maintenance-mode not rapid feature growth.

### iPad screenshots (described in detail — the richest public artifact)
1. Brand slide (same as Play). **Confirmed / High**
2. **Student dashboard** ("Log in daily for new assignments, live teaching, and feedback"): greeting "Hi, Melissa Bryden!" with account switcher; class card "English (test) / Math (test) 10:00–11:00, James Bush, [Join]" — note test sessions get a 60-min block vs the standard 30-min/subject; schedule rail showing English classes on **April 15, April 22, April 29 at the same 2:30pm slot** (weekly same-slot cadence); **Homework panel: "Will be submitted on 05.27"** with per-subject progress bars (English ~93%, Math ~43%); **Progress Log panel**: English "Passed 86%", Math "Review 23%" + teacher comment ("…making great progress in subtraction. She would benefit from extra practice."); **Test Log strip**: ✓ English "Pass: 66%" (Nov 26), ✗ Math "Review: 23%" (Mar 23), ⏱ English "Pending" (Dec 4). **Confirmed / High**
3. **Live class + Progress Log detail**: video-call layout with teacher tile (camera on) + up to 3 student tiles (one empty slot visible) above a shared worksheet; worksheet header is a digital replica of the paper booklet: "bestbrains | Level M1 | Week 10 | Name/Date fields"; page indicator "2/23"; bottom tabs "English beginning | Math beginning | Test beginning"; stylus toolbar (multiple pen types, ruler, 8 colors). Progress Log detail shows per-DATE entries: "November 20 / Math / Week: 13-M / Score: Passed 63% / Comments: …". **Confirmed / High**
4. **Worksheet close-up** ("Colorful worksheets to engage the mind"): English page 23 with picture-based person/place/thing exercises, worksheet corner code "EF1Z1.3"; header progress bar; same stylus toolbar. **Confirmed / High**

- **Inferred / High** — internal content coding scheme: Level codes (M1, A-1, 6A, 5B, H1), Week numbers 1–~14 per level segment, week suffix letters (13-M, 12-L, 10-J, 2-D, 13-IC), and per-page IDs like "EM1J1.1"/"EF1Z1.3" (E=English, level, unit, page). A level ≈ a lettered stage; a "week" is the atomic curriculum unit (one concept/packet per week).
- **Inferred / High** — weekly packet ≈ 23 pages (page counter "2/23"), split across 7 daily ~15-min assignments.

### iOS user reviews (all that exist publicly, via Apple review RSS)
Only **1 review** in the US feed:
- 5★, "CBF", 2025-04-08 (v1.4.0): app is very helpful and used all the time; "sometimes teachers just give you the answer without explaining" (short quote, <25 words). **Confirmed / High** (review exists); **Inferred / Medium** (answer-giving-without-explanation as a real pedagogy failure mode — corroborated by bbSupport reviews and third-party roundups).

---

## 3. bbParent (iOS) — the parent lens

Source: https://apps.apple.com/us/app/bbconnect-parent/id1547858377 + iTunes API.

- iPhone companion to bbConnect; 5.0★ from 2 ratings; v1.1.2 (2026-03-30, "iOS 26 support"); free; privacy label "no data collected". **Confirmed / High**
- Features per official description: **Weekly Progress Log** (homework results + teacher feedback), **Test Log** (test results), **child's class schedule**, **contact program administrator** links. **Confirmed / High**
- Screenshots (described):
  1. "All important data on one screen" — dashboard: Welcome + child switcher; Schedule (Aug 1 "English / Math 7:00–8:00 AM"; Aug 8 same slot with yellow **Test** badge); Progress Log summary (English "Passed 91%", Math "Review 42%"); dated teacher comment ("…making great progress with vocabulary. He needs to pay attention to directions." Apr 7 2023). **Confirmed / High**
  2. "Follow your child's schedule" — month accordion; per week: "Monday, August 1, Teacher: Teacher Dec"; two stacked 30-min blocks: "7:00–7:30 English | **Master Reader** | Week: 10-J" then "7:30–8:00 Math | **Level 6A** | Week: 12-L"; next week English shows Week: 11-K (weekly increment). Test week rows highlighted yellow. **Confirmed / High**
  3. "Weekly feedback from your child's teacher" — Progress Log entry "April 7": English Week 8-H "Passed 91%" / Math Week 13-M "Review 42%" + narrative comment. **Confirmed / High**
  4. "Periodic testing keeps students on top" — Test Log: "April 26 | English | Level: H1 | Passed 80%" and "Math | Level: 5B | Review 25%", each with a "**See pages**" link (parents can open the actual graded test pages) and a comments area ("There are no comments here yet"). **Confirmed / High**
- **Inferred / High** — grading taxonomy is binary-with-percent: **Passed (green)** vs **Review (red)** + raw % score, applied identically to weekly homework and periodic tests; "Review" = below pass threshold → concept gets reassigned/retaught. Observed passing examples at 63–91%; failing at 23–42%; exact threshold not published (Pass shown at 63% and 66%; Review at 42% → threshold somewhere in ~45–62%). **Speculative / Low** on the precise cutoff.
- **Inferred / Medium** — "Master Reader" is a named English curriculum track (subject line shows a program name where Math shows "Level 6A").
- **Not present**: no payments, no attendance ledger, no in-app messaging/chat with the teacher (only "contact administrator" links). **Inferred / High** (absence across description + screenshots).

---

## 4. bbSupport — the homework-help loop (and its reviews = best public signal on real UX)

Sources: App Store listing id6473837922, Play listing, Apple review RSS (17 reviews — the largest public review corpus for any BB app).

### Listing facts
- "Virtual classroom" app hosting Math/English **help sessions**: a certified teacher + a single student, for questions about Best Brains homework. Launched 2024-08-16. iOS 2.6★ (56 ratings), v1.8.3 (2026-07-09); Play 3.0★ (15 ratings), 5K+ installs, updated 2026-07-07. **Confirmed / High**
- Update cadence very fast (1.4.0 → 1.8.3 between early 2025 and mid-2026); recent notes: network stability, audio/video recovery. **Confirmed / High**

### Review-mined findings (Apple RSS, 17 reviews 2025-03 → 2026-07)
- **On-demand live teacher queue**: students request a session and wait for a teacher to pick up; evening availability exists (one 5★ reviewer got a teacher "in seconds at 9:00 pm"). **Confirmed (pattern) / High**
- **Wait times are the #1 complaint**: "took so long for the teacher, they never attended" (1★), "sheer waste of time to wait" (1★), "I hate waiting for this crazy amount of time" (2★). **Inferred / High** (4+ independent reviews)
- **"Books not updated" recurring bug**: the app must be synced to the student's current homework booklet/level; multiple reviewers report it showing the wrong book/level and center staff having to fix it ("my books are not being updated and the teachers can do nothing about it", "sometimes the app is on the wrong book"). → The homework content pipeline is center-pushed, and the sync is fragile. **Inferred / High** (3 reviews + bbSlate's "assignments automatically received from your center" design)
- **Device restriction friction**: "it only works on iPad and MacBook" (2★/3★ reviews) — students want phone support. **Confirmed (pattern) / High**
- **Video explainer library "coming soon"** that was late: reviewer frustrated pre-recorded help videos hadn't shipped ("the videos that are coming soon needed to come out when this app came out"). **Confirmed (single review) / Medium**
- **Usage incentive program**: a reviewer says heaviest users of bbSupport "would get 30 bucks". **Speculative / Low** (single child-written review; but consistent with a franchise engagement promo)
- **Positive pattern**: when a teacher does connect, explanations are rated well — "explain the challenging problems in an efficient solving method and with great simplicity"; named-teacher praise (e.g., "Mrs. Turner"). **Inferred / Medium**
- **Grading grievances spill into app reviews**: "they marked answers wrong even if the answer was actually correct" (1★, about a physical center); "teachers won't explain the topic". **Inferred / Medium** (individual anecdotes; consistent with the answer-without-explanation theme)
- Several pure-anger 1★ reviews ("scam", "lost all my money") targeting the program's value, not the software. **Inferred / Medium** (program-level dissatisfaction bleeding into app ratings; explains the 2.6★)

---

## 5. bbSlate — homework digitization for center students

Sources: App Store id6747179521, Play listing.

- Official homework app "designed to make practice and progress simpler": weekly assignments arrive automatically from the student's center; students write/draw directly in-app ("no printing or scanning"); **one-tap submission**; parents can follow assignments and submissions; accounts only created by Best Brains centers; explicitly also for "internal staff managing homework assignments". iPad (16+)/Mac/Vision; released 2025-09-18, v1.0.5 (2026-05-26); 100+ Android installs; no ratings yet on either store. Collects only "basic information like student name, assignments, and **optional voice input**". **Confirmed / High**
- **Inferred / High** — before bbSlate, in-center students did homework in **paper booklets** (the thing being replaced; bbAnswerKeys still references "homework booklet key"); rollout is very early (100+ installs vs a multi-hundred-center franchise).
- **Inferred / Medium** — "optional voice input" suggests early-learner (age 3–6) answer capture or reading exercises.

## 6. bbAnswerKeys + bbEnroll (ops apps — what they leak about the program)

- bbAnswerKeys: answer keys for **all levels** of Math, English, and Coding — "homework booklet key, test keys, and Coding teacher guides"; 1K+ installs; also distributed on Amazon Appstore. **Confirmed / High**
  - **Inferred / High** — grading of weekly homework/tests is done by humans against fixed keys (not auto-graded); level-based booklet+test structure spans all three subjects; Coding is taught from teacher guides.
  - **Inferred / Medium** — 1K+ installs of a staff-only tool ≈ order-of-magnitude of teachers/graders across the franchise.
- bbEnroll: franchisee-only paperless enrollment; forms include policies, payment info, photo release; syncs to a central franchisee "Portal"; contains a 10-part video series parents watch during the diagnostic-test visit; 500+ installs; category Business; updated 2026-06-08. Play data-safety: "data isn't encrypted / can't be deleted" declared. **Confirmed / High**
  - **Inferred / High** — enrollment funnel: walk-in **diagnostic test** → parent watches marketing videos in-app → paperless enrollment on the spot → central Portal.

---

## 7. Third-party app-intelligence and review-roundup sources

- chrome-stats.com, apkpure.com, justuseapp.com, appbrain.com pages exist for these packages but returned HTTP 403 to automated fetch — not usable this pass. **Confirmed / High** (pages exist; content not retrieved)
- Brighterly (competitor blog, bias noted) roundup of Best Brains reviews (brighterly.com/blog/best-brains-reviews/): cites AppsHunter app reviews — technical problems hindering study; bbConnect/bbSupport iPad/MacBook-only; "app support is simply nonexistent"; teachers "follow the curriculum without paying attention to whether kids are able to finish"; teachers give answers without step-by-step logic; also Yelp positives (academic growth, standards-aligned curriculum, patient teachers) and negatives (teacher turnover — "new teachers every week" at some centers, contradicting the same-teacher-weekly marketing claim). Pricing cited: 1 subject $159/mo, 2 = $259, 3 = $299, 4 = $399. **Inferred / Medium** (competitor-authored aggregation; individual claims not independently verified; pricing plausibly US-market current but unverified against official source)

---

## 8. What bbConnect reveals about the weekly homework/grading rhythm

Assembled from official descriptions + screenshot UI + version notes + reviews:

1. **The week is the atomic unit.** One new concept per week; content is organized as Level → Week (e.g., "Level M1, Week 10"; schedule rows "Week: 12-L" incrementing weekly). **Confirmed / High**
2. **Weekly live class, same slot, same teacher**: 30 min per subject (Math and English back-to-back, e.g., 7:00–7:30 + 7:30–8:00), up to 3 students + 1 teacher, video tiles above a shared annotatable worksheet. The new concept is taught here. **Confirmed / High**
3. **Daily homework, ~15 min/subject/day**, drawn from a ~23-page weekly packet, done with a stylus on a tablet (writing on a digital replica of the paper booklet; page-level IDs like EM1J1.1). Dashboard shows per-subject completion % filling over the week. **Confirmed / High** (packet size Inferred / High)
4. **Single weekly submission deadline**: dashboard literally says "Homework — Will be submitted on 05.27" — daily work accumulates locally and is submitted/collected weekly for grading. **Confirmed / High**
5. **Human grading against answer keys** (bbAnswerKeys), returned as a **weekly Progress Log entry**: Week code + % score + binary verdict **Passed** (green) / **Review** (red) + a free-text teacher comment written to the parent about attitude/strengths/needs. **Confirmed / High** (mechanism Inferred / High)
6. **"Review" triggers reteach/reassign**: official text — homework "may be reassigned and retaught so that the student can perfect each concept before moving on." Mastery gate sits on the weekly verdict. **Confirmed / High** (as policy; fidelity in practice disputed by reviews — Inferred / Medium)
7. **Periodic tests as separate gated events**: scheduled into the weekly slot (yellow "Test" badge; a 60-min combined block "English (test) / Math (test)"), with "mandatory test navigation" enforced by the app; results land in a **Test Log** with Level code + Passed/Review %, "Pending" while ungraded, and parent-viewable graded pages ("See pages"). **Confirmed / High**
8. **Parent visibility is read-only and weekly-cadenced**: schedule, weekly progress verdicts + comments, test log. No payments, attendance ledger, or teacher chat in-app; escalation = "contact program administrator". **Inferred / High**
9. **Between-class help is a separate queue** (bbSupport): stuck-on-homework students wait for an on-demand 1:1 teacher; chronic complaints about wait times and the app pointing at the wrong booklet week. **Confirmed / High**
10. **The rhythm's failure modes (from reviews)**: answer-given-without-explanation; wrong-book sync errors requiring center intervention; teacher no-shows in the help queue; grading disputes; pace pressure ("follow the curriculum without paying attention to whether kids can finish"). **Inferred / High** (consistent multi-review patterns), individual anecdotes Medium/Low.

---

## 9. What could NOT be determined from app-store sources

- Google Play user reviews for bbConnect/bbSlate/bbEnroll/bbAnswerKeys (too few to render; Play shows no aggregate rating for them).
- Exact Pass/Review percentage threshold (observed Pass ≥63%, Review ≤42%; cutoff in between).
- Whether homework auto-grades any portion (evidence points to fully human grading).
- Precise weekly packet structure per subject/level (only one 23-page English M1 packet observed).
- Download totals beyond Play brackets (app-intelligence sites 403'd); iOS download counts (never public).
- Whether bbConnect Android is used by students (tablets) or is parent-view-only in practice.
- How the leaderboard/incentive ("$30 for most bbSupport usage") actually works, if real.
- Current in-app payment/billing surface: none found in any app; billing appears entirely center-side (bbEnroll collects payment info at enrollment).
