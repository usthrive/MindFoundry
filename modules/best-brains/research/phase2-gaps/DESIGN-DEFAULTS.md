# Design Defaults — Best Brains Math Module (Mind Foundry)

**Compiled:** 2026-07-19 (Phase 3 FINALIZER). **Companion to:** `EVIDENCE-LEDGER-FINAL.md` (frozen) and `GAP-LIST.md`.

**What this document is:** For every gap G1–G14 that Phase 3 left unresolved or only partially resolved, the explicit choice the module will use instead. Every choice here is **`[original design]`** — a learning-science or product-judgment decision, NOT a Best Brains fact. Phases 4–6 must implement against these defaults and must never present them as descriptions of Best Brains. Where a default **deliberately diverges** from evidenced or probable BB practice, the divergence is flagged **[DIVERGENCE]** and must stay visible in module design docs.

**Format per default:** gap ID · what remains unknown · the chosen default · the principle behind it · the risk if real BB practice differs · traceability line.

---

## DD1 — Mastery threshold + corrective loop `[original design]` **[DIVERGENCE]**

- **Unknown (G2 residual):** BB's exact Pass/Review cutoff (observed bracket ~45–62%; a school-style 50/60% fits); whether "reassigned" re-issues identical or modified pages; escalation policy after repeated Review.
- **Default:** Weekly mastery check scored on objective items; **Pass ≥ 85%** (design band 80–90%, tune within band only). Below 85% → **corrective loop**: (1) targeted micro-reteach on the specific missed skill (worked example first), (2) **parallel Form B** — isomorphic new items, never the identical pages, (3) re-score. Two failed cycles on the same concept → escalate: live teacher intervention + placement re-check (level may be wrong). Advancement blocks only the gated concept's strand; other strands continue so the week never fully stalls.
- **Principle:** Bloom's Learning-for-Mastery — mastery criterion 80–90% with corrective instruction and **parallel re-assessment forms** (re-testing on the same items measures memory of the items, not the skill).
- **[DIVERGENCE]:** deliberately stricter than BB's observed ~50–60% window, and stricter than BB's evidenced practice where pace pressure can override the gate (E50).
- **Risk if BB differs:** our pacing runs slower than real BB; students transferring from BB may feel "held back." Mitigation: fast-track rule — Form B ≥ 95% on first corrective pass skips the second cycle.
- (resolves G2; cites E31, E49, E50, E98, E42.)

## DD2 — Level ladder + modern level naming `[original design]`

- **Unknown (G1 residual):** BB's *current* level naming scheme ("Level M1" in-app vs ME/MF/MG print codes vs historical numerals — E95) and the modern per-level scope-and-sequence.
- **Default:** Adopt the **recovered historical ladder as the structural spine**: 16 booklet-levels (JrBG, SrBG, 0a, 0b, 1–8 with a/b splits at the upper levels), level n ≈ grade n, **26 weekly units per level**, Sep–Aug default calendar but calendar-decoupled (any start week allowed). Scope-and-sequence per level: anchored to the found grade guides (E35) filled to completeness from CCSS grade standards (see DD10). **User-facing level names are neutral letter codes** (our own series, e.g. MF-A … MF-P), never grade numbers — mirroring the destigmatization move the ME/MF/MG codes suggest — with an internal level↔grade map for parent reporting.
- **Principle:** CCSS-interpolated scope on a mastery ladder; off-grade placement destigmatization (a 5th grader working level-3 material should not see "Level 3").
- **Risk if BB differs:** our names will not match BB's real modern names — cosmetic, since we never claim name equivalence. Structural risk only if BB's modern curriculum re-segmented level boundaries (e.g., finer than yearly); mitigated because the grade guides remain standards-shaped and the 26-week cadence is Confirmed for the historical system.
- (resolves G1 residual; cites E93, E94, E95, E27, E28, E35.)

> **CORRECTION 2026-08-11 (C1) — "Sep–Aug default calendar" is withdrawn.** That phrase inherited G1
> Finding 1.2's claim that the answer-key weeks sit under month headings. They do not. Levels 0, 3 and
> 4 contain **zero** month tokens; only Level 1 contains month names, mid-page and in scrambled order,
> as **answers to a months-of-the-year exercise** around week 9–10. **No calendar anchoring is
> evidenced anywhere.** The operative half of the default — *calendar-decoupled, any start week* —
> is unaffected and stands. The **26 weekly units per level is re-confirmed** independently on six
> levels this pass. Also newly confirmed: the a/b pairs are **halves of one level's 26 weeks**
> (Level 5 = 15 + 11), not separate levels — so 16 booklet-levels ≈ **11 grade-years**.
> See `meta/RESEARCH-FINDINGS-CURRICULUM-SCOPE.md`.

## DD3 — Weekly packet anatomy + day-labeling `[original design]`

- **Unknown (G3 residual):** BB's day labels inside packets (none found in any indexed source), strand ordering within the week, exact interior page counts/density.
- **Default:** 1 packet = 1 week = **5 homework days, labeled "Day 1"–"Day 5"** (matching the decoded day digit x = 1–5, E94; day-numbered not weekday-named so a missed day shifts rather than skips), **2–3 pages/day, 3–6 problems/page** (sampled density, E64/E62), 5–15 min/day dose (E12). Fixed strand template: **packet front** = instructions + the worked examples from class (mirrors "check the front of your packet," E99); Day 1 = concept + guided practice echoing the worked examples; Days 2–3 = fluency + application; Day 4 = word problems / real-world; Day 5 = non-computational page (DD12) + mixed retrieval warm-up (DD8) + weekly check items (DD1). Daily unlock in-app (E79/E46).
- **Principle:** worked-example effect (study worked examples before problem solving); consistent authoring template so content generation is schema-driven.
- **Risk if BB differs:** BB interiors may order strands differently or run denser pages than the marketing samples — affects "feel-alike" fidelity for BB-transfer families, not learning validity. Revisit only if a real packet interior ever surfaces.
- (resolves G3 residual; cites E99, E94, E34, E62, E64, E12, E45, E79.)

> **CORRECTION 2026-08-11 (C2/C3) — the evidence under "5 homework days" is withdrawn; the decision
> needs re-ratification.** Three separate problems, in order of consequence:
>
> 1. **The count is 7, not 5.** The 2013 answer-key markup labels the sub-units `<!-- PACKET-1 -->` …
>    `<!-- PACKET-7 -->`; there are exactly 182 = 26 × 7 per level, on every level parsed, and the
>    seven are **homogeneous** (no distinct test or review packet). Official copy corroborates:
>    weekly class, "**Each day**, student log onto the app to complete **a section** of their homework
>    booklet", submitted end-of-week — and class-to-class is 7 days. The "x = 1–5" basis (E94) was
>    **9 marketing images**; P(all 9 ≤ 5 | uniform 1–7) ≈ 4.8%.
> 2. **The density is understated.** Measured, not sampled: **5–9 pages per packet, ~6 items per page,
>    ~22–48 items per day** by level — against this default's "2–3 pages/day, 3–6 problems/page".
>    This also **closes gap G-homework-volume**, previously listed as unresolved.
> 3. **The interior arc here is stale against the build.** This default says Days 2–3 = fluency +
>    *application*, Day 4 = word problems. The shipped build says Days 2–3 = fluency +
>    **discrimination**, Day 4 = application (`build/FILL-ARCHITECTURE.md` §3 and the authored
>    `a01.ts`). **The build is authoritative**; this wording is superseded.
>
> Shipping 5 days may still be the right product call — a school-week arc is defensible on its own
> merits. But it must now be made **as a decision, not inherited as a finding**. The interior arc
> remains genuinely `[original design]` and unresearchable: BB's in-packet day labels appear in no
> indexed source. See `meta/RESEARCH-FINDINGS-CURRICULUM-SCOPE.md`.

## DD4 — Minute-by-minute session script `[original design]`

- **Unknown (G4 residual):** BB's official class script; how the recovered hour-loop is actually timed per child.
- **Default:** Codify the evidenced teacher hour-loop (E43/E96) into a **30-min per-subject session script per student**: 0–5 min greet + review last week's graded work (feedback conversation, celebrate/diagnose); 5–15 min **1:1 explicit instruction** of the new week-concept at the child's own level (worked example → guided practice — "I do / we do"); 15–25 min independent start of Day-1 pages with monitoring ("you do," assist-start); 25–30 min wrap + progress note (feeds DD6/DD7). In the digital module, the "teacher slice" (5–15 min) is the instruction component; the loop's four accomplishments — feedback, new concept taught, practice launched, progress logged — are the invariants, the clock is ours.
- **Principle:** explicit-instruction arc (Rosenshine: review → present in small steps with worked examples → guided practice → independent practice); consistent with BB's own Teach→Perceive doctrine (E41).
- **Risk if BB differs:** real teachers may spend more of the slice grading in-hour (reviews suggest time pressure); low risk — our script preserves the same outcomes with the grading burden removed by DD13.
- (resolves G4 residual; cites E96, E43, E10, E41, E44, E8.)

## DD5 — Placement test `[original design]`

- **Unknown (G6):** BB placement-test content, length, adaptivity, scoring, and score→level mapping (confirmed-absent publicly).
- **Default:** **Adaptive mastery-band placement**: start at the level implied by age/grade; serve 4–6 items per exit-skill cluster of that level; **≥80% → step up, <50% → step down**, else probe adjacent clusters; place the student at the highest level whose exit skills they hold at ≥80%, starting at that level's week 1 (or mid-level entry if the front strands are mastered). Cap ~25–30 min. Output = a parent-facing results conversation (mirrors E20's director meeting): placed level, evidenced strengths, first-month plan.
- **Principle:** mastery-band placement / ZPD — place where instruction is needed, not where frustration lives; short adaptive walks beat long fixed forms for young children's attention.
- **Risk if BB differs:** BB's test is likely a fixed paper form; a BB-placed transfer student might land one level differently with us. Acceptable — our gate (DD1) self-corrects within 1–2 weeks, and escalation re-checks placement.
- (resolves G6; cites E20, E30, E93.)

## DD6 — Weekly parent report (Progress Book equivalent) `[original design]`

- **Unknown (G7):** Progress Book fields, rubric, comment template, sign-off mechanics — no page ever publicly shown.
- **Default:** Digital weekly parent artifact assembled from the confirmed ingredients: **level + week code · Passed/Review + % (E80) · "what we learned this week" · "what needs reinforcement" · "improvements noticed" (E47/E48) · 1–3 sentence teacher-voice narrative (max one behavior sentence) · ONE actionable next step for the week · parent acknowledge tap** (digital signature analog, E15) with streak-visible acknowledgment history. Full history browsable — this doubles as the persistent learner profile a new teacher inherits (answers E85).
- **Principle:** Hattie & Timperley — the parent narrative carries feed-up (goal), feed-back (where the child is), feed-forward (next step); the signed-weekly ritual is BB's one confirmed delighter (04 §3 via G14) and is preserved intact.
- **Risk if BB differs:** the real book may carry fields we omit (attendance, behavior codes, teacher initials) — cosmetic; nothing pedagogical lost.
- (resolves G7; cites E15, E48, E47, E80, E85.)

## DD7 — Feedback-writing guidelines + error diagnosis `[original design]`

- **Unknown (G8):** BB's teacher-training content, comment-writing rubric, mistake-diagnosis method (nothing public).
- **Default:** A comment rubric for generated or teacher-assisted feedback: (1) **task/process level, never person level** ("the regrouping step" not "she's careless"); (2) name the skill + cite this week's evidence; (3) exactly one actionable next step; (4) ≤1 behavior sentence. Behind it, a per-strand **error-analysis taxonomy** driving the "needs reinforcement" line: fact-recall error · procedure slip · concept misconception · representation misread · task-comprehension miss. Every graded miss is tagged with one of these; the weekly narrative and the corrective micro-reteach (DD1) both consume the tags.
- **Principle:** Hattie & Timperley feedback levels (task/process/self-regulation, avoid self-level); error-analysis as first-class pedagogy — BB itself values it for students (ANALYZE pages, E59); we extend it to the teacher side. Also directly answers the evidenced failure mode "answers without explanation" (E52/E88).
- **Risk if BB differs:** BB's real comments are likely looser and more behavior-mixed; our stricter rubric can read as clinical — mitigated by the teacher-voice narrative layer.
- (resolves G8; cites E51, E48, E52, E59, E88.)

## DD8 — Retention design: spaced retrieval + interleaving `[original design]` **[DIVERGENCE]**

- **Unknown (G5, resolved-to-limit):** Evidence shows BB's per-student review of old material is **failure-triggered only** (Review-status reassignment); skills recur as substrate ("weekly repetition with increasing complexity") but no dedicated review pages are evidenced, and Summer Power Up is coverage, not review (E100/E101).
- **Default:** Keep the weekly-new-concept surface (the brand experience: "something new every week") but **engineer retention underneath**: **20–30% of each day's items are spaced cumulative retrieval** (styled as "warm-up," drawn from concepts at expanding intervals ~1 week / 1 month / 3 months back), and fluency pages **interleave** problem types rather than blocking one type. Retrieval items stay inside the 5–15 min daily dose by trading, not adding, item count.
- **Principle:** spacing effect (Ebbinghaus; Cepeda et al. — expanding schedules) + retrieval practice + interleaving (Rohrer). Forgetting is the default outcome of pure forward-marching; failure-triggered review alone catches only what already failed a weekly gate, not slow decay.
- **[DIVERGENCE]:** this deliberately contradicts BB's literal "students don't review old material" claim. Marketing frame: "a new concept every week — with built-in memory maintenance." Never claim BB does this.
- **Risk if BB differs:** none pedagogically (this is strictly safer); product risk is feel-difference for BB-transfer families expecting purely-new pages — mitigated by the warm-up styling.
- (resolves G5; cites E100, E4, E39, E101, E49.)

## DD9 — Test cadence + cumulativeness `[original design]` **[DIVERGENCE]**

- **Unknown:** BB test frequency, composition, whether tests are cumulative, retake policy (all confirmed-absent; evidence leans "periodic monitoring instruments, no gate," E97).
- **Default:** **Monthly test every 4 completed weeks** (aligns with the 4-booklets/month rhythm, E99) — composition **60% current month / 40% cumulative** from earlier in the level; plus a **level-exit test** covering the whole level, **Pass ≥ 85% required to advance level** (same band as DD1), retake with a parallel form after one corrective week. Tests keep BB's confirmed UX shape: separate Test Log, per-page detail, parent-viewable graded pages (E32/E97). Timed sections: never scored (consistent with BB's own philosophy, E54 rev; see DD11).
- **Principle:** cumulative testing is the spacing effect applied to assessment (successive relearning); a gate at level boundaries is where a mastery claim must actually be enforced.
- **[DIVERGENCE]:** BB's tests appear to be non-gating monitors; ours gate level advancement. Flag in all module docs.
- **Risk if BB differs:** if BB tests are per-topic snapshots, our cumulative tests will look harder; mitigated by DD8 (students are continuously rehearsed on exactly the cumulative pool).
- (resolves the test-mechanics residual of G2/G5; cites E32, E97, E99, E54, E100.)

## DD10 — Scope completion for grades 4, 6, 8 `[original design]`

- **Unknown (G9):** BB grade guides found for Gr 1, 2, 3, 5, 7 only; 4/6/8 missing — exactly the fraction-operations, ratio/proportion, and pre-algebra-transition years.
- **Default:** Fill levels 4, 6, and 8's scope directly from **CCSS grade-level standards** (4.NF/4.NBT…, 6.RP/6.NS/6.EE…, 8.EE/8.F/8.G…), sequenced to interpolate smoothly between the found adjacent guides; level 7 = Pre-Algebra and level 8 = Algebra framing preserved (E93).
- **Principle:** the five found guides are demonstrably standards-shaped (E35), so standards interpolation is the minimum-risk reconstruction.
- **Risk if BB differs:** BB may order topics within those grades differently — low; the ladder position and mastery gates matter more than intra-year topic order.
- (resolves G9; cites E35, E93.)

## DD11 — Timed-quiz / fluency mechanics `[original design]`

- **Unknown (G10 residual):** frequency, format, placement of BB's timed elements.
- **Default:** Short **2-minute low-stakes fluency sprints, only on facts/skills mastered ≥2 weeks prior** (never the current week's new concept), **self-referenced** (beat your own last time), **never graded** — accuracy grading happens on untimed work only. Cadence: ≤2 sprints/week, embedded in Day 2–3 fluency pages.
- **Principle:** fluency = accuracy first, then rate; timed pressure on unmastered material produces math anxiety, on mastered material it builds automaticity. This default now *aligns* with BB's own published philosophy (timed tests ungraded, "grading should reflect comprehension, not speed" — E54 rev), so it is low-divergence.
- **Risk if BB differs:** minimal — worst case BB times more aggressively; ours is the defensible position.
- (resolves G10; cites E38, E54.)

## DD12 — Non-computational strand cadence `[original design]`

- **Unknown (G11):** the real proportion/cadence of Brain Buster / ANALYZE / enrichment pages inside packets.
- **Default:** **≥1 non-computational page in every weekly packet** (placed Day 5), band-matched to the sampled page types: multi-modal/manipulative + Teacher's-Note parent strip (ages 3–5, E57), Brain-Buster-style logic puzzle (6–9, E58), ANALYZE-style error-analysis/written-explanation page (10+, E59); plus vocabulary-as-content elements in the E63 style at elementary levels. Target ~15–20% of weekly page count.
- **Principle:** the dual-strand mix is the visible brand differentiator and is Confirmed present at every level (E26/E66); written error analysis doubles as formative data for DD7's taxonomy.
- **Risk if BB differs:** real proportion may be higher — cheap to raise later; template is already authored per band.
- (resolves G11; cites E26, E57, E58, E59, E63, E66.)

## DD13 — Feedback turnaround `[original design]` **[DIVERGENCE]**

- **Unknown (G12):** BB's grading turnaround (same-class vs next-week; latency to Progress Log entry).
- **Default:** **Immediate item-level feedback on objective items** the moment a page is submitted (digital auto-check with explanation-on-miss — never a bare "wrong," per the E52/E88 lesson), while the **narrative + Passed/Review verdict stays weekly** so the parent ritual (DD6) and the teacher session (DD4) keep their confirmed weekly rhythm (E11).
- **Principle:** feedback-timing research favors immediacy for procedural skill acquisition; the weekly cadence is preserved where it carries relational value, collapsed where delay only costs learning.
- **[DIVERGENCE]:** BB's paper reality is weekly-batch human grading (E13/E79/E83). This is a deliberate digital advantage; flag it and never describe BB as offering it.
- **Risk if BB differs:** immediate feedback removes the teacher's "let's review your mistakes together" moment — mitigated: the weekly session script (DD4, 0–5 min slice) opens with a recap of the week's auto-flagged misses, so the human conversation keeps its material.
- (resolves G12; cites E13, E79, E83, E11, E52, E88.)

## DD14 — Outcome instrumentation `[original design]`

- **Unknown (G13):** no independent efficacy evidence for BB exists; only the 2020 self-survey (96%/90%).
- **Default:** Build measurement in from day one: placement-level→current-level delta per student-quarter; DD1 gate first-pass rate and corrective-loop success rate; DD8 retrieval-item accuracy as a retention curve; 6-month parent-reported school-grade change (survey, labeled self-report). **Never quote BB's 96%/90% as fact** — if referenced at all, only as "the company's own 2020 survey claims…" per E19.
- **Principle:** don't inherit an unverifiable claim AND don't recreate the credibility hole; instrument the mastery ladder you already run.
- **Risk if BB differs:** none — internal honesty requirement.
- (resolves G13; cites E19.)

## DD15 — Demand-signal grounding `[original design]`

- **Unknown (G14):** near-zero authentic parent discourse; genuine parent values visible only through curated reviews and the complaint set.
- **Default:** Treat the triangulated complaint set as the demand signal and design directly against each item: **continuity** — persistent learner profile any new teacher inherits (DD6 history view; vs E85); **responsiveness** — hard SLA on help requests with visible queue state (vs E86); **reliability** — versioned content pointers, no center-pushed "wrong book" state possible (vs E87); **explanation quality** — explanation-required feedback, no bare answers (DD13/DD7; vs E88/E52); **device breadth** — parent surface phone-first, student surface tablet-first but not iPad-exclusive (vs E89). Preserve the one confirmed delighter: the weekly signed progress ritual (DD6). Do not spend further research budget on parent forums (demonstrated near-zero yield).
- **Principle:** when organic demand data is absent, verified pain points are the only demand evidence that isn't marketing; complaints are revealed preference.
- **Risk if BB differs / limitation:** complaint sets overweight vocal minorities and unhappy churners; mitigated by DD14's own instrumentation replacing borrowed signals over time.
- (resolves G14; cites E85, E86, E87, E88, E89, E52, E21.)

---

## Coverage map — Phase 3 gate

| Gap | Phase 3 status | Ledger resolution | Design Default |
|---|---|---|---|
| G1 level map | Partially resolved | E93 (historical ladder Confirmed), E94 (codes), E27/E28 rev; naming open (E95) | **DD2** (+DD10 scope fill) |
| G2 Pass/Review + reteach | Partially resolved | E31/E49 rev, E98 (computed status); cutoff + reissue-form still dark | **DD1** (+DD9 for test gating) |
| G3 packet anatomy | Partially resolved | E34 rev, E99 (weekly-vs-monthly reconciled, 1 pg/day); day labels + strand order dark | **DD3** |
| G4 session structure | Partially resolved | E10 rev (30 min/subject), E43 rev, E96 (hour-loop); official script dark | **DD4** |
| G5 spiral/retention | Resolved to public-evidence limit | E100 (skill-strand spiral, failure-triggered review only), E101, E4/E39 rev | **DD8** (+DD9) — deliberate divergence |
| G6 placement internals | Unresolved (by disposition) | E20/E30 (mechanism only) | **DD5** |
| G7 Progress Book | Unresolved | E48/E15/E80 (ingredients only) | **DD6** |
| G8 feedback guidelines | Unresolved | E51 (existence only) | **DD7** |
| G9 grade 4/6/8 guides | Unresolved | E35 (5 of 8 grades) | **DD10** |
| G10 timed quizzes | Partially resolved | E54 rev (ungraded philosophy Confirmed) | **DD11** |
| G11 non-comp cadence | Unresolved | E26/E57–E59/E66 (page types only) | **DD12** |
| G12 grading turnaround | Unresolved | E13/E79/E83 (weekly batch) | **DD13** — deliberate divergence |
| G13 efficacy evidence | Unresolved (structurally) | E19 (self-survey only) | **DD14** |
| G14 parent demand | Unresolved (structurally) | E85–E89 (complaint set) | **DD15** |

**Gate statement:** every gap G1–G14 is either resolved in the frozen ledger or covered by an explicit Design Default above; no gap is left silently open. Divergences from Best Brains practice are flagged in DD1, DD8, DD9, DD13.
