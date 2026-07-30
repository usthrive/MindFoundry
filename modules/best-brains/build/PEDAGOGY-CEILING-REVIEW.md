# Pedagogy-Ceiling Review — Level D corpus (Phase A, Fable 5)

**Written:** 2026-07-27, Phase A of the three-phase plan (Fable judgment → Opus gated build → Fable sign-off).
**What this is:** a review of what the gates cannot score — is the teaching genuinely good, above the
rubric floor? Both gates PASS and are not re-litigated here.
**Sample reviewed (full generated packs, seed 777):** D1 (place value, A6), D7 (interpreting
remainders, A4), D9 (fraction equivalence, A7), D12 (meeting decimals, A8), D21 (order of operations,
A10), plus D18 Days 4–5 (fraction × fraction, A7) and the D4 exemplar source. That spans place-value,
division, fractions, decimals, and the algebra thread.

---

## 1. Verdict

**The depth is real, and it is worth saying so precisely.** This corpus earns its ACCEPTs on substance,
not polish:

- **Hooks genuinely provoke.** D7: *"'26 ÷ 4 = 6 R 2' is finished math — but the answer to the STORY
  might be 6, or 7, or 2, or 'six and a half.'"* D1: *"The same digit 4 can be worth four, forty, or
  four HUNDRED THOUSAND. Nothing about the 4 changed — only how far left it sits."* These are real
  intellectual hooks, not topic announcements.
- **The whys are causal, not restated recipes.** D9's equivalence why ("scaling the top and bottom by
  the same factor only re-cuts each piece, so the amount cannot move — the point on the line does not
  budge") is the actual mathematical mechanism, stated in child-reachable language. D21's "math has
  traffic rules... parentheses are the override" gives the *reason the convention exists* — that is
  rare even in commercial curricula.
- **Day 5 is the best page in the product.** Production and reversal tasks dominate: D7 "write one
  question whose answer is 7 and one whose answer is 3, then explain why the SAME division gives two
  answers"; D9 "order 3/4, 1/2, 5/8 using ONLY the one-half benchmark — no common denominators";
  D21 "insert one pair of parentheses so 2 + 3 × 4 equals 20"; D1 "is 1,000,000 seconds closer to a
  WEEK or a YEAR?" (a genuine Fermi task). These demand the concept be *used as a tool*, not repeated.
- **Puzzles honestly pass remove-the-concept.** "Same Numbers, Four Answers" (D7), "Benchmark Sort —
  WITHOUT computing" (D9), "The Parenthesis Switch" (D21) are real transfer, not riddle-wrapped drill.
- **Error-analysis targets real misconceptions** (add-instead-of-scale numerators, right-align decimal
  addition, quotient-without-round-up buses) — these are the mistakes an actual 10-year-old makes, and
  the verify-derived truth means none of it can be fabricated.

The rebuild closed the "pedagogically hollow" gap for real. The findings below are ceiling lifts and
one systemic weakness — none of them re-opens the D26 diagnosis.

## 2. Ceiling findings (ranked; each with the lift Opus should apply)

### F1 — The metacog wrapper narrates the insight instead of eliciting it ⭐ highest-leverage
Every estimate-first item opens with a *declarative explanation*: "Estimate first — rounding up for a
leftover always adds one more whole trip, so a sensible answer sits just above a plain even split.
Then solve: …" (D7-D2-03). The prefix does the estimating **for** the child — and in D7 it literally
names the remainder move (round up) that the item exists to make the child choose. D21-D2-03 similarly
pre-explains the grouping structure. Metacognition is only practiced if the *child* produces the
estimate; as implemented, this is teacher-voice satisfying a presence-gate.
**Lift (library, `metacog.ts`):** convert the prefix to an eliciting question with its own answer
moment: "Before you solve: will the answer be MORE than an even split or LESS? Say why to yourself,
then solve." Never state the structural reason; never name the operation/move the item tests. The
same verbatim prefix also repeats 2–3× per week — vary or shorten it. (Scheduled as POLISH-PASS-SPEC
§P7; it regenerates Level D too.)

### F2 — Signal-word scaffolding never fades within the week
In D7 every round-up prompt carries "so everyone has a seat," every drop prompt carries "whole bows" —
including Day 4 and BOTH mastery forms. By mid-week the child can answer from the signal vocabulary
without performing the interpretive act the week teaches. Real mastery of D7 is deciding the remainder
move when the question is neutral: "How many buses should the school book?"
**Lift (authoring rule, kit §C):** each interpretive/discrimination concept declares its signal
phrases; Days 1–2 may use them, Day 4 and mastery items must use *neutral-but-unambiguous* phrasings
(the neutral form must still uniquely determine the answer — this needs authoring care, not automation).
This is the in-week analog of the fade the guided examples already do.

### F3 — Multi-step problems are "and-then" chains; the interesting structures are underused
Most multi-step items narrate their steps in execution order (pour, add, share; cut, tape, measure) —
genuine 2-step load, but no *problem tension*. The strongest existing item shape is D4's
`msPartWhole`: "Ken has 48 cards, which is 3 times as many as Pia — how many together?" — the child
must *discover* that the first move is an inverse (divide), not read it off the sentence order.
**Lifts (library, `multistep.ts` variants; apply to all new levels and sprinkle into D):**
1. **Inverse-start** structures (the given is the *result* of the first operation) — at least one per
   operation-family week.
2. **Goal-first phrasing** sometimes ("How much does each cup get, if …") so the child plans backward.
3. **A distractor quantity** occasionally — a stated number that is *not used*. Today every stated
   number is consumed, so "use all the numbers" is a winning strategy that children absolutely learn.
   One per week on Day 3 or 4 is enough to break it (tag it in `authorMeta` so the style gate's
   G5 clustering isn't confused; the mastery forms should stay distractor-free).

### F4 — Same-generator re-use lands adjacently and reads as a re-run
The ≤2× core reuse rule is honored, but placement isn't: D21's Day 4 repeats two of Day 3's exact
costumes (tickets+combo, garden rows+pot) with re-drawn numbers; D1 repeats festival-attendance and
crate→pallet→truck on Days 3 AND 4; D18's Day 4 runs the same recipe generator twice back-to-back.
The child experiences Day 4 as "yesterday's page with new numbers" — precisely the impression the
program exists to avoid.
**Lift (assembler placement rule):** a generator's two core uses must sit ≥2 days apart and never
twice in the same day; Day 4's items must use ≥3 distinct context frames. (Merges with the
cross-week context ledger — POLISH-PASS-SPEC §P3.)

### F5 — D21 never tells a story that *requires* parentheses
All four Day-4 stories are `a×b+c` (tickets then a snack; rows then a pot). The parenthesis-override —
the actual point of the week — appears only as bare computation and on Day 5. The missing story class
is per-bundle grouping: "5 party bags, each with 2 pencils and 3 stickers → 5 × (2 + 3)."
**Lift:** add a grouping-required situation to the D21 blueprint (and to the E10/E11 recipes, where
this structure is load-bearing). One Day-3/4 item + one mastery slot.

### F6 — A few error-analysis prompts name the error they ask the child to find
D21-D5-01: "…but, ignoring that × outranks +, the student added those two numbers instead" — the
diagnosis is in the prompt, so "explain what went wrong" collapses to paraphrase. Contrast D9-D5-01,
which shows the move ("multiplied the bottom by 4 but ADDED 4 to the top") without editorializing —
that one still leans toward telling. The D7 bus item gets it right: state the student's *claim* only,
make the child produce the diagnosis.
**Lift (library, `erroranalysis.ts` prompt templates):** show the work/claim; never the verdict-plus-
reason. The reason is the child's answer. Audit the 24 D-weeks' EA prompt templates once, centrally.

### F7 — Ritual structure is right; ritual *phrasing* is drifting toward formula
The fixed weekly furniture (hook → why → 3-segment script with an estimate segment → EA + reasoning +
ASN on Day 5) is good design for children — predictability lowers load. But some sentence-level
formulas repeat across all 24 weeks: every ASN ends "In one sentence, say how you know", every hook is
a two-beat "X — but Y". Within one week it's invisible; across a year a child notices the mold.
**Lift (cheap, blueprint-prose):** 2–3 alternate closers for ASN/reasoning stems, rotated by week
parity; keep the structure identical. Low priority — do not spend Opus budget here before F1–F5.

## 3. Surface defects observed (routed to POLISH-PASS-SPEC, not judged here)

While reading for pedagogy, these surfaced; they are specified for repair in `POLISH-PASS-SPEC.md`:
the §4 handover four (money one-decimal rendering incl. inside a D12 *guided example*; unreduced
real-world fractions; seats/buses context convergence across D5/D8/D15 and D6/D7/D16; duplicate
same-day warm-up formats in D6/D8/D15/D16) **plus three found in this review**:
1. **Grammar agreement:** "Tom pours 1 liters", "1 marbles" (also in `acceptableForms`), "a 8 cm strip"
   (D7); article/plural agreement is unhandled in interpolation.
2. **Noun–predicate mismatch:** "A crate holds 12 marbles. 1/4 of them are ripe" (D9-D2-06) — nouns
   and verb frames drawn independently.
3. **Comma-less big numbers in the place-value week itself:** D1's explanation *teaches* "read in
   groups of three" and writes 507,036 — then every item prints 433606, 517634, 733695. The week's own
   content law is violated by its own items ("comma-free surfaces for clean tokenization" was an
   engineering choice; it must not override the concept being taught).

## 4. What Opus should carry into the A/B/C/E fill (summary)

1. Fix the metacog wrapper (F1) and EA prompt templates (F6) in the LIBRARY before any new level —
   both regenerate D for free and set the pattern everywhere.
2. Adopt the F3 multi-step variants (inverse-start, goal-first, distractor quantity) as first-class
   `multistep.ts` options; require ≥1 inverse-start per operation-family week in the new levels.
3. Bake F2 (signal-fade by Day 4/mastery) and F4 (placement spacing) into the kit checklist so the
   fan-out authors satisfy them by construction.
4. The Day-5 production-task pattern (write-the-question, benchmark-only, insert-the-parentheses) is
   the house signature — every new level's recipes should name a production task of this quality, in
   band-appropriate form (see FILL-ARCHITECTURE per-week tables).
5. Keep the hooks honest: a hook must state a *surprise or tension*, not a topic. The D corpus is the
   calibration bar.
