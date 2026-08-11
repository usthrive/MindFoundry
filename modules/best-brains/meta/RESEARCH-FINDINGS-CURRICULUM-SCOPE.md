# Research findings — curriculum scope, level ladder, year structure

Executed against `RESEARCH-PROMPT-CURRICULUM-SCOPE.md`, 2026-08-11.
Primary sources fetched and parsed this session; local corpus re-read rather than re-derived.

**Method note.** The brief's §2 pointed at `docs/Best Brains Math Program and Method.md` as the
record of prior work. That file does not contain the level ladder or the week count. Both were
already recovered in `modules/best-brains/research/phase3-validation/G1-G4-levelmap-class-structure.md`
and ratified in `phase2-gaps/DESIGN-DEFAULTS.md` (DD2). The brief has been corrected. What follows is
new work layered on that, plus **three corrections to the prior pass**.

---

## 0. Headline

| | Prior belief | Finding |
|---|---|---|
| Weeks per programme year | open (assumed ~40 needed) | **26 per level, and a level ≈ a grade ≈ a year** — Confirmed |
| Weeks per level in our build | 24, feared wrong | **near-correct (24 vs 26)** — the error was never here |
| Number of levels | 5 (self-imposed mandate) | **16 booklet-levels** — Confirmed |
| Homework days per week | 5 (`[original design]`, DD3) | **7 packets per weekly booklet** — Confirmed structure, Inferred/High as days |
| Calendar anchoring | "Sep–Aug calendar-anchored" | **no calendar anchoring exists** — prior finding was a misread |

**The structural problem in the brief's §0 was misdiagnosed.** Our 24-week level is fine. The ladder
is too short by a factor of ~3, and the 5-day arc is the wrong shape.

---

## 1. Deliverable 1 — Evidence ledger (new findings only)

Sources fetched directly this session, all `bestbrains.com` (US). Ghana "Best Brain" excluded; no
collisions encountered.

| # | Finding | Label | Source |
|---|---|---|---|
| N1 | Every archived math level contains exactly **26 numbered weeks**. Verified independently on levels 0,1,2,3,4 and 5 (5 splits 1–15 + 16–26). | **Confirmed / High** | Wayback `Answerkey/MATH/math-level-{zero,one,two,three,four,five,five-two}.html`, snapshots 2013-09-22/23, retrieved 2026-08-11 |
| N2 | Each week contains exactly **7 sub-units, labelled PACKET in the source markup** (`<!-- PACKET-1 -->` … `<!-- PACKET-7 -->`, number rendered on `packetz.jpg`). 182 packet-blocks per level = 26 × 7, exact, on every level parsed. | **Confirmed / High** | same |
| N3 | The 7 packets are **homogeneous** — same median page count and problem count at every index 1–7. There is no distinct "test" or "review" packet. | **Confirmed / High** | measured, all levels |
| N4 | Packet size by level: L0/L1 ≈ 8 pages ≈ 48 items; L3 ≈ 6 pages ≈ 36; L4 ≈ 6 pages ≈ 22; L5 ≈ 5 pages ≈ 24. Page holds ~6 items throughout. | **Confirmed / High** | measured |
| N5 | Whole-level volume: L1 ≈ 1,496 pages / 8,091 items; L0 ≈ 1,416 / 6,775; L3 ≈ 1,306 / 6,479; L4 ≈ 1,153 / 3,758. **Item count falls as level rises** while item difficulty climbs. | **Confirmed / High** | measured |
| N6 | Official: weekly live class, **"Each day, student log onto the app to complete a section of their homework booklet — identical to the ones used for our in-person program"**, homework submitted end-of-week. | **Confirmed / High** | `bestbrains.com/bb-connect`, fetched 2026-08-11 |
| N7 | **7 packets = 7 daily sections.** A weekly class cycle is 7 days; official copy assigns one booklet section per day; the booklet holds exactly 7. Two independent lines converge. | **Inferred / High** | N2 + N6 |
| N8 | Level nav in the 2013 answer-key source exposes **Level 0–8, with 6A/6B and 7A/7B** as JS dropdown targets (`math-level-six-section-{a,b}.html`, `7a.html`). Corroborates the 16-entry tab strip from 2014/2019 independently. | **Confirmed / High** | `math-level-one.html` menu source |
| N9 | Answer keys for levels **6a, 6b, 7a, 7b, 8** were **never archived** (CDX empty). The recoverable syllabus ends at Level 5. | **Confirmed / High** — absence | CDX queries, 2026-08-11 |
| N10 | Content fingerprints place each level at **grade = level number** (§4). Fractions open at L4 w18–20 and resume at L5 w1–7 — a continuous vertical handoff. | **Confirmed / High** for the trajectory; **Inferred / Medium-High** for grade equivalence | measured |

### Corrections to the prior pass

| # | Prior claim | Correction | Basis |
|---|---|---|---|
| **C1** | G1 Finding 1.2: weeks are "grouped under month headings SEPTEMBER, OCTOBER … calendar-anchored Sep–Aug"; DD2 inherits "Sep–Aug default calendar". | **False.** Levels 0, 3 and 4 contain **zero** month tokens. Only Level 1 contains month names, clustered mid-page in scrambled order (OCTOBER, JUNE, SEPTEMBER, APRIL…) — they are **answers to a months-of-the-year exercise** around week 9–10, not headings. **No calendar anchoring evidence exists in this source.** | parsed token streams, all levels |
| **C2** | E94 decode: trailing `x.y` = "day x", "x observed only 1–5 (school days)" → DD3's 5-day arc. | The sample is **n=9 marketing images**; P(all 9 ≤ 5 \| uniform 1–7) ≈ **4.8%**. The exhaustive answer-key enumeration (182 packets/level × 6 levels, perfectly regular) says the slot runs **1–7**. The `x` range was a small-sample artifact. | N2 + binomial check |
| **C3** | Gap #2 "no corporate standard found for homework volume per level" listed as unclosed. | **Closed** by N4/N5 with primary measured data. | measured |

---

## 2. Deliverable 2 — The year structure

- **Weeks per level: 26.** Confirmed, six levels independently. Unit = **26 weekly booklets**, not 26 calendar weeks and not 26 class meetings-plus-breaks.
- **A level maps to a grade** (§3, §4), and a grade is a school year. So the programme delivers **26 booklets per programme year** — *not* the ~40 the brief assumed a weekly programme needs. The premise that drove §0's crisis was wrong.
- **Calendar pattern: none is evidenced** (C1). Mastery-based advancement (reteach/reassign until perfected — `bb-connect`, Confirmed) means elapsed time per level is a student variable, not a calendar constant. Treat the ladder as **calendar-decoupled**, which is what DD2 already does operationally — only DD2's stated justification was wrong.
- **What one "week" physically consists of** — Confirmed, and this is the sharpest new data:
  - 1 weekly booklet
  - **7 packets** per booklet, one per day (Inferred/High)
  - 5–9 pages per packet, ~6 items per page
  - ≈ 22–48 items per day depending on level
  - 30 minutes live instruction per subject per week; official home guidance 10 min/subject/day
- **Summer:** ~~unresolved~~ — **CORRECTED 2026-08-11 (C4): the ledger already had this.** E33/E101
  (Confirmed/High): **Summer Power Up** = accelerated *forward* coverage — "complete the concepts for
  an entire grade level in just 8–9 weeks," 2-hr sessions 2–4×/week, 12/18/24-session packages, **no
  homework**. It is coverage, not review. E33's own conclusion: the curriculum is a **linear packet
  ladder, not grade-locked** — pacing is compressible. (This section's author read the phase-3 file
  and DD2/DD3 but not the full ledger — the same incomplete-local-read failure the brief was
  corrected for. Rule: the E-ledger is part of "already known," always.)

---

## 3. Deliverable 3 — The level ladder

16 booklet-levels. Rows marked *recovered* are Confirmed from the 2014/2019 tab strips and the 2013
nav (N8); syllabus evidence exists only where noted.

| Level | Age (inferred) | Grade | Syllabus evidence | Weeks |
|---|---|---|---|---|
| JrBG | 3–4 | pre-K | none (sample page only) | 26 *assumed* |
| SrBG | 4–5 | pre-K/K | none (sample page only) | 26 *assumed* |
| 0a | 5 | K | **measured** (partial, wks 4–26) | 26 |
| 0b | 5–6 | K/1 | **measured** (same key) | 26 |
| 1 | 6–7 | 1 | **measured, full 26** | 26 |
| 2 | 7–8 | 2 | **measured, full 26** | 26 |
| 3 | 8–9 | 3 | **measured, full 26** | 26 |
| 4 | 9–10 | 4 | **measured, full 26** | 26 |
| 5a | 10–11 | 5 | **measured, wks 1–15** | 15 |
| 5b | 10–11 | 5 | **measured, wks 16–26** | 11 |
| 6a / 6b | 11–12 | 6 | **not archived** (N9) | 26 *assumed* |
| 7a / 7b | 12–13 | 7 — Pre-Algebra | **not archived** | 26 *assumed* |
| 8a / 8b | 13–14 | 8 — Algebra | **not archived** | 26 *assumed* |

Note the a/b pairs are **halves of one level's 26 weeks** (proven at Level 5: 15 + 11 = 26), not two
separate levels. So the ladder is **~11 grade-years** presented as 16 booklet artefacts.

**Modern naming (ME/MF/MG vs app "Level M1") remains unresolved** — Speculative, unchanged from the
prior pass. No new vector paid out. Only primary access (an informant, app screenshots, or an FDD)
will close it, and it is cosmetic for us: we never claim name equivalence.

---

## 4. Deliverable 4 — Scope and sequence

Answer keys carry **numeric answers only, no topic labels**. Topic is therefore recovered from the
*shape and magnitude* of each week's answers. Per-week measured tables: `RESEARCH-DATA-weekly-signal.md`.

**Robustness caveat:** the median is the trustworthy statistic. Extreme tails (5–6 digit values at
L0–L3) are column-concatenation artifacts of flattening the HTML tables, not content. Do not read
`max` as curriculum.

| Level | Measured trajectory (median answer magnitude) | Onsets | CCSS anchor | Grade |
|---|---|---|---|---|
| 0 | mostly ≤ 20; number-writing weeks reach 3 digits (w10, 13, 25, 26) | decimal w23 (1 wk) | K.CC.A, K.OA.A, 1.NBT.A.1 | K |
| 1 | ≤ 24 through w13, then **step change** to ~90–98 from w14 | none — no fractions, decimals, money or time anywhere | 1.OA.C.6, 1.NBT.B.2, 1.NBT.C.4 | 1 |
| 2 | opens at 79–123, sustained 3-digit | none | 2.NBT.A.1–3, 2.NBT.B.5–7 | 2 |
| 3 | 42 → 285 | negatives w16 | 3.OA.A–C, 3.NBT.A.2–3 | 3 |
| 4 | large multi-digit throughout | **decimals w18, fractions w19 (6 wks), mixed numbers w20** | 4.NBT.B.4–6, 4.NF.A.1–2, 4.NF.B.3 | 4 |
| 5 | fraction-dominant | **fractions from w1 (7 wks)**, mixed w5; decimals w23 | 5.NF.A.1–2, 5.NF.B.3–7, 5.NBT.B | 5 |

**The single most useful pedagogical find:** fractions are introduced at **Level 4 week 18** and the
next level **opens on them at week 1**. The vertical handoff is deliberate and tight — the last third
of a level seeds the opening of the next. Our ladder should reproduce that seam behaviour, not treat
levels as self-contained.

Level 1's week-13/14 step change (≤24 → ~98) is the clean internal example: thirteen weeks within 20,
then the whole second half in two-digit territory.

**Not delivered:** authored 7-column rows for all 416 weeks. That is authoring, not research, and the
column set differs per level — see the corrected Deliverable-4 spec in the brief. The measured tables
above are the evidence those rows should be authored against.

---

## 5. Deliverable 5 — Standards alignment

Level n aligns to Grade n, **at grade level, not ahead of it** — on the evidence, for L0–L5.

Two places where the programme is plausibly **ahead**: Level 0 does 3-digit number writing (a Grade-2
`2.NBT.A.1` behaviour) inside a Kindergarten level; Level 4 opens fractions at week 18 and Level 5
sustains them from week 1, which is denser fraction exposure than a typical Grade 4→5 sequence.

**Flag, per the brief's instruction to report anything behind grade expectation:** nothing measured is
behind. But note the density argument cuts the other way — 26 weeks/year against a school year's ~36
means BB covers a grade's standards in fewer, denser units. Our 24 weeks sits inside that same
compression, so it is defensible.

---

## 6. Deliverable 6 — The gap statement

**A complete ages-3-to-14 ladder needs ~11 grade-years × 26 weeks ≈ 286 weeks** of distinct content
(416 if every a/b booklet is counted as its own 26, which the Level 5 evidence says it is not).

Against our **120** (5 × 24):

- We are short by roughly **166 weeks**, i.e. **~7 more levels** at our 24-week length.
- **Our 24-week level length is not the defect** — it is within 8% of BB's 26. Do not lengthen levels.
- **The 5-level mandate is the defect.** Five levels cannot carry eleven grade-years; each of ours is
  currently absorbing ~2.2 of BB's.
- **The 5-day arc is a second, independent defect** (C2/N7). Our 120 cells are built on 5 days where
  the source structure is 7. Whether we adopt 7 is a product decision — a 5-day school-week arc is
  defensible on its own merits — but it must now be made **as a decision, not inherited as a finding**,
  because the evidence that justified 5 has been withdrawn.

**Recommended shape:** keep 24 weeks; go from 5 levels to 11–12, one per grade-year from pre-K to
Grade 8. That reproduces the evidenced ladder, fixes the age-band arithmetic in §0 of the brief, and
leaves the already-built levels intact if they are re-indexed onto grade anchors.

---

## 7. Search log — what paid, what was dry

**Paid:**
- Wayback **CDX via `curl`** (WebFetch to web.archive.org is blocked; curl is not — prior note holds).
- **Reading HTML comments and image filenames, not just rendered text.** `<!-- PACKET-1 -->` and
  `L-0-w-11-pk-5-pg-1-1.jpg` are self-documenting schema. This was the highest-yield technique of the
  session and generalises: the markup names the structure the page renders anonymously.
- **Statistical fingerprinting of answer values** to recover topics from a key with no topic labels.

**Dry:**
- Levels 6/7/8 answer keys — never archived (N9).
- Modern level naming — no new vector.
- Weeks-per-year stated outright anywhere in parent-facing copy — never stated; it had to be derived.
- Summer track — no evidence either way.
