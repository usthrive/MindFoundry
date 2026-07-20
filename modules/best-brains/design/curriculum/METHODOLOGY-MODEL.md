# METHODOLOGY MODEL — Best Brains-Inspired Math Module (Mind Foundry)

**Phase 4A deliverable · Curriculum Architect · 2026-07-19**
**Status:** Constitution for Phases 5–6. Engineers and content authors implement against this document.

**Sources of authority (in order):** `EVIDENCE-LEDGER-FINAL.md` (E1–E101, frozen — the only permissible source of factual claims about Best Brains) → `DESIGN-DEFAULTS.md` (DD1–DD15, binding `[original design]` choices) → items tagged `[original design]` in this document.

**Legal posture:** This module is Best Brains-INSPIRED and original. Nothing herein copies Best Brains' level sequence, worksheet content, or branding. Where we describe Best Brains, we cite ledger rows; where we design, we cite DDs or tag `[original design]`. We never claim affiliation, endorsement, or equivalence.

---

## 0. The model in one paragraph

The unit of learning is the **week** (per E11, E29): one new named concept per week (per E4), taught by a teacher persona in a short explicit-instruction session (per E41, E43, E96 / DD4), perceived through guided worked examples, practiced daily in small doses (5–15 min/day, per E12, E45), checked by an objective weekly mastery gate (per E31, E42 / DD1), narrated to the parent in a signed weekly report (per E15, E48 / DD6), and only then advanced to the next concept — with a corrective reteach loop (per E49 / DD1) when mastery is not shown, and engineered retention (spaced retrieval + interleaving, per DD8 **[DIVERGENCE]**) running silently underneath the "something new every week" surface. Every week carries **both a computational and a non-computational strand** (per E26, E66 / DD12). The whole loop is the branded cycle **Teach → Perceive → Practice → Perfect** (per E41) rebuilt as software.

---

## 1. The core loop — ten steps

The loop below is the digital re-architecture of the fully triangulated Best Brains cycle (per E42: placement test → weekly small-group class → daily homework → weekly submission → human grading → Passed/Review + % + narrative → reteach on Review → parent signs → next week). Each step gives Purpose (why it exists in the Best Brains model, cited), Cognitive benefit (learning science), Child experience, and Digital translation (with divergences flagged).

### Step 1 — Placement

**Purpose.** Every enrollment in the Best Brains model begins with a free diagnostic/placement test that decouples the child's working level from their school grade (per E30); results feed a director meeting and a personalized academic plan (per E20). The program explicitly serves students behind or above grade level (per E3). Placement is what makes a fixed-sequence curriculum personal: the sequence is fixed, the *entry point* is not.

**Cognitive benefit.** Placement into the zone of proximal development: instruction lands where the child needs teaching, not where frustration or boredom lives (per DD5 principle). A mastery ladder only works if the first rung is the right one — a mis-placed child experiences either drill of the known or failure on the unreachable, both of which corrode math self-concept.

**Child experience.** A short (~25–30 min max, per DD5), friendly "show us what you know" session, framed as exploration, never as a test to pass. Items get easier or harder in response to answers; the child never sees a grade label, a percentile, or the word "fail." It ends with something warm: "We found your starting point!"

**Digital translation.** Adaptive mastery-band placement per DD5 `[original design]`: start at the level implied by age/grade; serve 4–6 items per exit-skill cluster; ≥80% steps up, <50% steps down, else probe adjacent clusters; place at the highest level whose exit skills the child holds at ≥80%, at that level's Week 1 (or mid-level entry if front-block skills are mastered, per DD5). Output feeds Step 2. **Divergence flag:** Best Brains' test internals were never published (per E30 — Confirmed-absent); adaptivity is our design, not a Best Brains description. Placement is re-checkable: two failed corrective cycles on one concept trigger a placement re-check (per DD1).

### Step 2 — Personalized Plan

**Purpose.** In the Best Brains funnel the placement result flows into a director meeting over the results plus a personalized academic plan, then enrollment and a starter kit (per E20). The plan is the moment the program tells the family *why this level, and what happens next* — the trust-building hinge between diagnosis and delivery.

**Cognitive benefit.** Goal clarity ("feed-up" in the Hattie & Timperley framing adopted by DD6): learners and parents who know the target and the path show better persistence. For parents, an explicit plan converts an opaque subscription into a visible trajectory, which sustains the daily-practice habit the whole model depends on (per E45).

**Child experience.** The child sees a simple visual "map": their level (a neutral letter name — never a grade number, per DD2), the trail of weekly concepts ahead, and a marker saying "you are here." Strengths found at placement are celebrated by name. Nothing about the map says "behind."

**Digital translation.** Auto-generated plan screen from placement data `[original design]`, mirroring the E20 director-conversation function: placed level and entry week, 2–3 evidenced strengths, 2–3 first-month targets, the weekly rhythm explained to the parent (class day → daily practice → weekly report), and the first-month calendar. The plan doubles as the start of the **persistent learner profile** — the continuity artifact Best Brains' record demonstrably lacks when teachers turn over (per E85 [OPPORTUNITY], answered by DD6's browsable history). Level names are our own neutral codes with an internal level↔grade map for parent reporting only (per DD2).

### Step 3 — Weekly Concept

**Purpose.** The Best Brains week is the atomic operating unit: one weekly teacher-led class per subject, daily home practice from a packet, weekly feedback (per E11); one NEW concept per week, one weekly packet per concept (per E29, E4); content addressed as Level × Week (per E27), with historical levels running 26 numbered weeks (per E93). "Non-repetitive" is anti-drill positioning — a new named concept every week — while prior skills recur as substrate at rising complexity (per E100 reconciliation).

**Cognitive benefit.** A fixed weekly concept gives the child a *nameable achievement* ("this week I learned long division") — chunking the curriculum into narratively complete units. The week-length cycle matches a realistic consolidation window for one concept at the daily dose the model prescribes, and the fixed cadence builds the momentum the model itself warns about breaking ("missing weeks breaks momentum," per E45).

**Child experience.** Monday-morning reveal: a concept card with a kid-readable name ("Making Ten!"), a one-sentence why-it-matters, and the week laid out as five daily tiles that unlock day by day (per E46, E79). Every week has the same shape, so the child always knows where they are.

**Digital translation.** Each level = a fixed ordered sequence of **24 weekly concepts** `[original design — our variant of the evidenced 26-week level structure, per E93]`, in two blocks of 12 with a mid-level checkpoint (see `CURRICULUM-MAP.md`). Weekly packet anatomy per DD3: Day 1–Day 5 labels (day-numbered, not weekday-named, so a missed day shifts rather than skips), 2–3 pages/day, 3–6 problems/page (density per E64/E62), 5–15 min/day dose (per E12). Content addressing is Level × Week × Day × Page — our own code scheme `[original design]`, structurally inspired by the decoded evidence that Best Brains addresses content the same way (per E94) but sharing none of its codes. **Content pointers are versioned** so a "wrong book" state is impossible (per DD15, vs E87 [OPPORTUNITY]).

### Step 4 — Teacher Explanation

**Purpose.** "A teacher actually teaches" is the model's #1 perceived differentiator vs drill programs (per E68): concept introduction happens in the weekly live class (per E44), delivered by certified teachers (per E6) executing centrally authored material (per E7 — local teachers are deliverers, not designers). The recovered in-center reality is a rotation of short 1:1 teaches at the child's own level, because tablemates sit at different levels (per E43, E8, E96). The branded cycle names this **Teach** (per E41).

**Cognitive benefit.** Explicit instruction with worked examples before problem solving (Rosenshine arc adopted by DD4; worked-example effect per DD3 principle). Concept-first teaching — "the why behind the math" (per E5) — builds the schema that makes subsequent practice meaningful instead of mechanical. The 1:1-at-your-level form (per E43) means instruction is never pitched at a group average.

**Child experience.** A warm 5–10 minute teacher-persona session that opens with a hook or story, shows the idea concretely (visual model first), works 2–3 examples aloud with visible thinking ("watch how I decide what to do first"), and explicitly names the *why*, never just the *how*. The child can pause, replay, and ask for a re-explanation — the digital repair of the evidenced complaint pattern of teachers "giving readily available answers without solving step by step" (per E52, E88 [OPPORTUNITY]).

**Digital translation.** The instruction slice of the DD4 session script (the 5–15 min "I do / we do" segment) becomes an interactive teacher-persona lesson `[original design; teacher persona spec = Part B]`. Invariants preserved from the evidenced hour-loop (per E96/DD4): feedback on last week opens the session, the new concept is taught at the child's own level, practice is launched before the session ends, progress is logged. Explanation content follows the visual→symbolic progression by band (per E60; see §6). Every lesson is centrally authored against this document — the module keeps the E7 division of labor: curriculum system designs, teacher persona delivers. **Explanation is never optional and never skippable on first encounter** `[original design]`.

### Step 5 — Guided Practice

**Purpose.** The **Perceive** stage of the branded cycle: the student perceives the concept via the weekly packet, started in class with the teacher assisting (per E41, E43 — "assist with new homework" is an explicit duty in the recovered hour-loop; per E96 "assist-start the new booklet"). The packet front carries the worked examples from class (per E99), so home practice always has a model to look back at.

**Cognitive benefit.** The "we do" bridge: faded scaffolding between demonstration and independence. Guided practice catches misconceptions in the minutes after first exposure — the cheapest possible moment to fix them — and the retained worked example supports self-repair all week (worked-example effect, per DD3).

**Child experience.** Immediately after the lesson, 3–5 problems solved *with* the teacher persona: first with step-by-step prompting, then with hints available on demand, then solo with a check. Errors get a warm, step-targeted response — "let's look at just the regrouping step" — never a bare ✗ (per DD13, answering E52/E88). Finishing guided practice unlocks Day 1 and feels like ignition, not assessment.

**Digital translation.** Scaffold-fade sequence per DD4's 15–25 min assist-start slice `[original design]`: worked example (persona solves, child watches/taps along) → completion problems (child fills the missing steps) → prompted solo → clean solo. Hint ladders are authored per concept (Part B question-generator spec). The class-worked examples are pinned to the packet front all week, mirroring the E99 front-matter convention. Nothing in guided practice is graded; telemetry (hint depth, error type per DD7 taxonomy) flows silently to the learner profile.

### Step 6 — Daily Independent Practice

**Purpose.** The **Practice** stage (per E41): daily home practice from the packet is half the operating model (per E11). The practice doctrine is explicit — daily consistency over bingeing, "one page completed consistently" beats cramming, skip class days (per E45); the daily dose is 5–15 min/subject (per E12, honest official range), ~one page/day (per E99); online, new pages unlock each day between classes with per-subject completion bars (per E46, E79). Marketed and perceived as the low-burden option vs ~30 min drill programs (per E70).

**Cognitive benefit.** Distributed practice: five short spaced doses beat one massed session for retention. The small dose sustains the habit for young children (habit formation needs a repeatable, low-friction ritual), and — per DD8 — the daily page is also where spaced cumulative retrieval and interleaving live, converting mere exposure into durable memory.

**Child experience.** Each day one tile unlocks: 2–3 pages, 5–15 minutes, opening with a short "warm-up" (2–4 quick items that are secretly retrieval of older concepts, per DD8) and closing with a satisfying done-state and a gentle streak indicator `[original design — Best Brains' ecosystem shows zero gamification, per E84; we add only habit-supporting progress signals, no points economy]`. Day 4 is word problems; Day 5 is the puzzle/reasoning page plus the weekly check (per DD3 template). Handwriting-first input on tablets (stylus, not keyboard) preserves the evidenced handwriting-first resolution of the screen-policy tension (per E76, E78).

**Digital translation.** DD3 fixed strand template governs authoring: Day 1 = concept echo + guided-style practice; Days 2–3 = fluency + application (with ≤2 optional 2-minute ungraded fluency sprints on material mastered ≥2 weeks prior, per DD11 — timing philosophy consistent with the evidenced "grading should reflect comprehension, not speed," per E54); Day 4 = word problems/real-world; Day 5 = non-computational page (per DD12) + mixed retrieval + weekly-check items (per DD1). **[DIVERGENCE per DD8]:** 20–30% of daily items are spaced cumulative retrieval at expanding intervals (~1 week/1 month/3 months), styled as warm-up, traded (not added) within the dose — this deliberately contradicts the literal "students don't review old material" claim (per E4) and must never be described as Best Brains practice. Daily unlock is enforced; finishing early unlocks nothing extra that day (protects the E45 doctrine) `[original design]`.

### Step 7 — Weekly Grading

**Purpose.** In the Best Brains model, homework is submitted once weekly and human-graded against fixed answer keys, yielding a Passed/Review verdict plus a % score (per E13, E79, E83); grading is structurally split from teaching — a clerical grader role marks against keys, the teacher writes the personalized feedback (per E14, E47); the Passed/Review status is system-computed from the raw %, with teacher discretion entering only at the what-to-do-about-it step (per E98). Grading exists to make the week *conclude in evidence*, not impressions.

**Cognitive benefit.** Objective, criterion-referenced scoring makes the mastery gate honest, and error data is the raw material of diagnosis. But feedback-timing research favors immediacy for procedural skills — a week-old correction lands on a cold trail — which is exactly where the module diverges.

**Child experience.** Two rhythms. In the moment: every objective item confirms or corrects instantly, and a miss always comes with an explanation, never a bare "wrong" (per DD13, engineered against E52/E88). At week's end: the child sees their week resolve — score, strengths named, and (if below the gate) a no-shame "let's strengthen this one" path rather than a red FAIL.

**Digital translation. [DIVERGENCE per DD13]:** item-level feedback is immediate on submission of each page (auto-check with explanation-on-miss), while the **verdict + narrative stay weekly** so the parent ritual and teacher session keep the confirmed weekly rhythm (per E11, E13). This is a deliberate digital advantage — never describe Best Brains as offering it (Best Brains' reality is weekly-batch human grading, per E13/E79/E83, with no evidence of auto-grading anywhere, per E83). Structural inheritances kept: scoring against fixed keys (auto-check is our "answer key," echoing the E83 keys-based structure), verdict computed from raw % against a fixed system-side cutoff (echoing E98's computed-status finding — our cutoff is DD1's 85%, not the evidenced ~45–62% bracket **[DIVERGENCE per DD1]**), and every miss tagged with one DD7 error class (fact-recall · procedure slip · concept misconception · representation misread · task-comprehension miss) to feed Steps 8–9.

### Step 8 — Parent Feedback

**Purpose.** The parent is a structural role in the Best Brains loop: reads AND signs the weekly Progress Book, receives weekly emailed narrative feedback, and explicitly does NOT grade homework (per E15, E71); feedback covers what was taught, what needs reinforcement, and improvements noticed, in 1–3 sentence teacher-voice narratives (per E48); the app surface shows week code, Passed/Review, %, and comment (per E80). The weekly signed ritual is the model's one confirmed delighter (per DD6 principle note).

**Cognitive benefit.** Feed-up / feed-back / feed-forward for the adult who controls the practice environment (Hattie & Timperley, per DD6). A parent who knows this week's one next step becomes an extension of instruction; a parent who only sees a % becomes an anxiety amplifier. The sign-off ritual creates parental accountability *without* parental grading burden (the anti-Kumon position, per E71).

**Child experience.** Indirect but felt: the parent knows what "making ten" is and asks about it; the child gets specific praise tied to named skills. The child can see that their week "counts" — someone signed it.

**Digital translation.** DD6 weekly artifact `[original design assembled from confirmed ingredients]`: level + week code · verdict + % (shape per E80) · "what we learned" · "what needs reinforcement" (driven by DD7 error tags) · "improvements noticed" · 1–3 sentence teacher-voice narrative (≤1 behavior sentence) · exactly ONE actionable next step · parent acknowledge-tap with visible acknowledgment history. Comment generation obeys the DD7 rubric: task/process level never person level, skill named + this week's evidence cited, one next step. The full browsable history IS the persistent learner profile — the continuity answer to evidenced teacher-turnover breakage (per E85, E21 [OPPORTUNITY]). Parent surface is read-mostly, weekly-cadenced, phone-first (per E81 shape; device-breadth per DD15 vs E89).

### Step 9 — Mastery Check

**Purpose.** The **Perfect** stage (per E41) and the model's advancement gate: "Homework may be reassigned and retaught so that the student can perfect each concept before moving on to a new topic" — the canonical official sentence (per E31, E49). The claim "students only move forward after mastering each concept" is official; the counter-pattern (pace pressure overriding the gate) is evidenced too (per E50 ⚠). The module resolves that tension by making the gate un-overridable.

**Cognitive benefit.** Bloom's Learning-for-Mastery (per DD1 principle): advancement contingent on demonstrated mastery at 80–90%, with corrective instruction and **parallel re-assessment forms** — re-testing the identical items measures memory of the items, not the skill. Prerequisite-complete progression is what makes a cumulative subject like math compound instead of crumble.

**Child experience.** Day 5 contains the weekly check items — it feels like the last page of the week, not an exam. Pass: a completion moment, concept marked mastered on the map. Below the gate: framed as "one more round to make it stick" — a micro-reteach on the *specific* missed skill, then a fresh set of similar problems (never the same ones), usually within 1–2 days. Other strands keep moving, so the child is never globally "stuck."

**Digital translation.** DD1 corrective loop, verbatim `[original design]` **[DIVERGENCE — deliberately stricter than the evidenced ~45–62% bracket, per E31/E98]**: weekly mastery check scored on objective items; **Pass ≥ 85%** (band 80–90, tune within band only). Below 85% → (1) targeted micro-reteach on the missed skill, worked example first; (2) **parallel Form B** — isomorphic new items, never identical pages (our resolution of the identical-vs-modified unknown, per E49 Confirmed-absent); (3) re-score. Fast-track: Form B ≥ 95% first pass skips cycle two. Two failed cycles on the same concept → escalate to live teacher intervention + placement re-check (per DD1). Advancement blocks only the gated strand; other strands continue. Separately, per DD9 **[DIVERGENCE]**: monthly tests every 4 completed weeks (60% current month / 40% cumulative), kept in a separate Test Log with per-page detail (UX shape per E32/E97), plus a gating level-exit test at ≥85% with parallel-form retake — noting Best Brains' own tests appear to be non-gating monitors (per E97).

### Step 10 — Next Concept

**Purpose.** The loop closes: verdict logged, parent signed, the ladder advances one rung (per E42). Because the curriculum is a linear packet ladder rather than a grade-locked calendar, pacing is compressible — the evidenced summer product covers a full grade in 8–9 weeks at 2–4 sessions/week (per E33, E101). The week-index advances with the student, not the calendar (per E27, E93 structure).

**Cognitive benefit.** Momentum with safety: the child experiences continuous novelty ("something new every week," the motivational surface per E4/E100) while DD8's retrieval engine and DD1's gate guarantee the old material neither decays nor gets skipped past. Compressible pacing lets fast learners accelerate without a different curriculum and struggling learners decelerate without a different product.

**Child experience.** The map advances; the just-mastered concept joins a visible "mastered" shelf (and quietly enters the warm-up rotation). Next Monday, a new concept card. At weeks 12 and 24, checkpoint moments give a bigger sense of arrival (see `CURRICULUM-MAP.md`).

**Digital translation.** Advancement is automatic on Pass `[original design]`; calendar-decoupled (any start week, per DD2), with an accelerated mode capping at 2–4 concept-cycles/week for catch-up/get-ahead use, structurally inspired by the evidenced compression (per E33) — in accelerated mode the mastery gate still applies to every concept `[original design]` and, unlike the evidenced no-homework summer format (per E101), our compressed mode keeps a reduced daily-practice dose because DD8's retention engine must not switch off `[original design]` **[DIVERGENCE]**. Mastered concepts feed the DD8 retrieval scheduler at 1-week/1-month/3-month expanding intervals.

---

## 2. The week as the atomic unit

Binding structural law (per E11, E29, E27, E93):

1. **One week = one new named concept = one packet** (per E29). No concept spans two weeks by design; a concept too big for a week is two concepts.
2. **Address space = Level × Week × Day × Page** `[original design scheme]`, structurally mirroring the evidenced Level→Week addressing (per E27) and week/day/page decomposition (per E94) with none of its codes.
3. **Levels are fixed ordered sequences of 24 weeks** `[original design variant]` — two blocks of 12 with a mid-level checkpoint — against the evidenced 26-week historical levels (per E93). Rationale for 24: aligns exactly with the 4-week test cadence (6 test points/level, per DD9) and the monthly packet rhythm (per E99, E34), and is legally clean (not Best Brains' number).
4. **The week-cycle is invariant; the calendar is not** (per DD2, E33): a "week" is a completed cycle, which the accelerated mode may run 2–4× per calendar week.
5. **All state rolls up to weeks.** Progress display, parent reports (per DD6), test scheduling (per DD9), and the retrieval scheduler (per DD8) all key on the week index. Engineers: the week is the primary key of the curriculum graph.

## 3. The dual-strand structure

Every week carries BOTH a computational and a non-computational strand, designed to complement each other — a stated core design element of the inspiration model, visible in its artifacts at every level (per E26, E66), with the non-computational side expressed as word problems, real-world applications, timed elements, and puzzles (per E38), and as logic pages, error-analysis pages, math-art, and vocabulary-as-content (per E58, E59, E63).

Module law (per DD12 `[original design]`):

- **Computational strand:** the week's procedural/fluency core — Days 1–3 backbone.
- **Non-computational strand:** ≥1 dedicated page every week (Day 5), band-matched: multi-modal/manipulative task + parent-facing Teacher's-Note-style strip at ages 4–6 (page-type per E57); logic-puzzle page at 6–9 (per E58); error-analysis/written-explanation page at 10+ (per E59); vocabulary-as-content elements at elementary levels (per E63). Target 15–20% of weekly page count (per DD12).
- **The strands are coupled, not parallel:** the Day-5 page always exercises the *same* concept as the week's computational core, in transfer form (per E26 "designed to complement each other"). The `CURRICULUM-MAP.md` tables specify both strand foci for every week.
- Word problems are additionally guaranteed weekly by the DD3 Day-4 slot (lever per E38).
- Error-analysis pages double as formative data: written explanations are tagged against the DD7 taxonomy (per DD12).

## 4. Teach → Perceive → Practice → Perfect, mapped

The branded cycle (per E41; only Teach + the first Perceive happen in-center in the inspiration model) maps onto our loop as:

| Stage (per E41) | Loop steps | Module realization |
|---|---|---|
| **Teach** | Step 4 | Teacher-persona explicit-instruction session (DD4 slice); concept-first, "the why" (per E5) |
| **Perceive** | Step 5 | Guided practice with faded scaffolds; worked examples pinned to packet front (per E99) |
| **Practice** | Step 6 | Five daily doses, 5–15 min (per E12, E45), DD3 template, DD8 retrieval underneath |
| **Perfect** | Steps 7–9 | Immediate item feedback (DD13) → weekly verdict vs the DD1 gate → corrective loop until mastered (per E31/E49 verbs "reassigned and retaught") |

Steps 1–2 (Placement, Plan) are the cycle's on-ramp (per E20, E30); Step 10 restarts the cycle one rung higher. Step 8 (Parent Feedback) is the cycle's witness — it runs parallel to Perfect and closes the trust loop (per E15).

## 5. The reteach / corrective loop (normative spec)

Per DD1 `[original design]`, resolving the evidenced-but-dark gate mechanics (per E31 threshold Speculative; E49 reissue-form Confirmed-absent; E98 computed-status; E50 fidelity doubts):

```
score = weekly_check_% (objective items only)
if score >= 85:                         # band 80–90, tune in-band only
    advance(concept)                    # Step 10
else:
    for cycle in (1, 2):
        micro_reteach(missed_skills)    # worked example first; DD7 error tags select content
        serve(parallel_form_B)          # isomorphic NEW items — never identical pages
        rescore()
        if score >= 95 and cycle == 1: break   # fast-track
        if score >= 85: break
    if still < 85:
        escalate(live_teacher_intervention)    # per DD1
        placement_recheck()                    # level may be wrong — per DD1, DD5
advance_other_strands_regardless()      # only the gated strand blocks — per DD1
```

Design intent: the loop preserves the official promise ("perfect each concept before moving on," per E31) while repairing the evidenced failure mode where pace pressure overrides the gate (per E50 ⚠) — in software, the gate cannot be socially pressured. The reteach content is selected by the DD7 error-analysis taxonomy, so a procedure slip gets a different reteach than a concept misconception `[original design]`.

## 6. Age-band presentation law

Three presentation bands, matching the evidenced marketing bands (per E24: 3–5 / 6–9 / 10+) and the evidenced visual→symbolic progression (per E60: mascots/coloring/multi-modal → visual scaffolds + branded puzzle badges → symbolic work + written explanation; decoration drops away with age). Algebraic thinking threads through all bands: icon-as-unknown → balance-scale/missing-factor → variables and inequalities (per E37). Concrete page-type anchors: E57 (beginner), E58 (intermediate), E59 (advanced), E62 (early-years draw-the-answer), E53 (place-value column scaffolds). Application to Levels A–E is specified in `CURRICULUM-MAP.md` §0.3.

## 7. What we refuse to inherit from Kumon-style drill

Cited to the ledger's vs-Kumon section (E67–E76). The inspiration model's entire market identity is anti-drill (per E67: concept-first, "non-repetitive," "why behind the math," parents citing drill fatigue); the module keeps that identity and hardens it:

1. **No mastery-through-repetition worksheets.** No long columns of near-identical problems; density stays 3–6 problems/page (per E64) and every week is a new named concept (per E4/E29). Fluency comes from interleaved, spaced practice (per DD8), not sheet volume.
2. **No self-learning-without-teaching.** A teacher (persona) actively teaches every concept before any practice (per E68 — "a teacher actually teaches" is the #1 differentiator; per E44). Practice never introduces content cold.
3. **No 30-minute daily grind.** The dose stays 5–15 min/subject/day (per E12, E70) — the low-burden position is a feature, not a compromise; retention is engineered inside the dose (per DD8), not by extending it.
4. **No parent-as-grader.** Parents review and sign; they never grade (per E71, E15). All grading is system-side (per DD13).
5. **No score-only feedback.** Every week produces a narrative with a named skill and one next step (per E73, DD6/DD7), and every wrong answer produces an explanation (per DD13 vs E52/E88) — never a bare mark.
6. **No speed-as-virtue.** Timed elements are ungraded, self-referenced, and only run on previously mastered material (per DD11), consistent with the evidenced philosophy that "grading should reflect comprehension, not speed" (per E54). Accuracy grading happens on untimed work only.
7. **No proprietary sequence detached from school.** Scope stays school-standards-shaped (per E72, E35; CCSS interpolation per DD10, DD2) — the module complements the child's school math (per E3), it does not compete with it.
8. **No keyboard-first math.** Handwriting-first input (stylus) preserved as the evidenced resolution of screen-policy tension (per E76, E78).

**What we deliberately do NOT inherit from the inspiration model either** (divergence register, per DD flags): the ~45–62% pass bracket → 85% gate (DD1); failure-triggered-only review → engineered spaced retrieval (DD8); non-gating tests → gating level-exit tests (DD9); weekly-batch-only grading → immediate item feedback under a weekly narrative (DD13); no-homework compressed pacing → reduced-but-nonzero practice in accelerated mode (§1 Step 10). Each is flagged at point of use above and must remain flagged in all downstream docs (per DESIGN-DEFAULTS preamble).

## 8. Engineering contract (what Phases 5–6 build against)

- **Curriculum graph:** Level → Week(1–24) → Day(1–5) → Page, with per-week `{concept, computational_focus, noncomputational_focus, prerequisite_weeks[]}` from `CURRICULUM-MAP.md`. Week = primary key (§2).
- **Schedulers:** daily unlock (per E46/E79); DD8 retrieval scheduler (expanding intervals over the mastered-concept set); DD9 test scheduler (every 4 completed weeks; level-exit at 24); DD1 corrective-loop state machine (§5).
- **Scoring:** objective auto-check with explanation-on-miss (DD13); DD7 error-tag on every miss; verdict = fixed 85% cutoff (DD1); verdict/narrative emitted weekly (E11 rhythm).
- **Artifacts:** weekly parent report + acknowledge-tap + browsable history = learner profile (DD6, answering E85); separate Test Log with per-page detail (shape per E32/E97).
- **Instrumentation from day one** (per DD14): placement→current level delta per student-quarter; gate first-pass rate; corrective-loop success rate; retrieval-item accuracy as a retention curve; labeled self-report parent survey. Never quote the inspiration company's 96%/90% self-survey as fact (per E19).
- **Reliability & reach** (per DD15): versioned content pointers (vs E87); help-response SLA with visible queue state (vs E86); parent surface phone-first, student surface tablet-first but not iPad-exclusive (vs E89, E78).
- **Deferred to Part B:** teacher-persona voice/behavior spec; question-generator spec (item templates, parallel-form isomorph generation for DD1 Form B, hint ladders, DD7 tag rubrics, DD12 puzzle/error-analysis page generators); placement item bank.

*End of methodology model. Any conflict between this document and `CURRICULUM-MAP.md` resolves in favor of this document; any conflict with the ledger or DDs resolves in favor of the ledger, then the DDs.*
