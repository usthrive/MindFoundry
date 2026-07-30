# Best Brains Authenticity / Style Gate

**Rubric title:** Best Brains Authenticity/Style Gate — Hardened (v2): 10 hard gates + 14 weighted criteria, LLM-judge stage wired after `validator.ts`.

## Purpose

A required authenticity/style gate that scores every AI-generated `WeeklyConceptPack` for Best Brains style. It runs **after** the deterministic correctness validator (`validator.ts` / QG-1..10) has passed. Correctness is not style: a pack can be arithmetically flawless and schema-valid yet be mechanical, drill-like, off-voice, or off-band. This gate closes that gap and is a blocking pipeline stage, not advisory.

## How it runs

**Who/what.** An LLM reviewer prompted with THIS rubric (all 10 hard gates + 14 weighted criteria + `gateThreshold` + guards) acts as an automated authenticity judge, run once per generated `WeeklyConceptPack`, immediately after the deterministic correctness validator (`validator.ts`) has passed.

**Pipeline position.** Stage order in the generation pipeline:

```
generate(pack) -> validator.ts (deterministic, MUST pass) -> authenticityGate (LLM judge, this rubric, MUST pass) -> packStore
```

It is a REQUIRED stage, not advisory.

**Inputs** (all provided to the reviewer in one prompt):

- (a) the full pack JSON (`WeeklyConceptPack`: `explanation`, `guidedExamples`, day1-5 items with their per-item `strand` tag, `puzzle`, `masteryCheck.formA/formB`, `mistakeBank`, `hintLadders`, `reteachPointers`, `parentSummarySeed`, `teacherNoteStrip`, `fluencySprint`, `metadata`);
- (b) the band/level (A/B/C/D/E) and week index;
- (c) the **PRIOR-WEEK CONCEPT LEDGER** (list of prior weeks' `conceptId`s + difficulty/representation) — REQUIRED for BB-G1 newness/deepening and BB-G8 backward-retrieval semantic checks; without it G1 and G8 cannot be adjudicated and the pack must route to human review, not auto-pass;
- (d) whether the week is on/off the algebra thread (for BB-W13);
- (e) this rubric.

**Two-pass protocol** (mandatory, to make scoring reproducible):

- **PASS 1 — TAG** every item, emitting per item: `{itemId, day, strand (comp/non-comp), cognitiveOperation, solutionStepCount, templateSkeleton, contextNoun}`. Compute the BB-G5 cognitive clustering here (cluster by `cognitiveOperation` + `solutionStepCount`, NOT `templateSkeleton`), the cognitive-demand spread, and the BB-G7 multi-step share. Recompute every false-distractor's arithmetic for BB-W4. Resolve every `reteachPointer` to a real segment. This pass is evidence-gathering only.
- **PASS 2 — EVALUATE** each hard gate PASS/FAIL and each weighted criterion 1-5 (or N/A) USING the Pass-1 tags, citing specific `itemId`s/segment-ids as evidence for every verdict. Apply band-conditioning (G6/G7/W6/W7/W12) and the referent-check carve-out (G9) explicitly.

**Output** (strict JSON, machine-readable):

```json
{
  "packId": "...", "band": "...", "weekIndex": 0,
  "hardGates": [ {"id": "...", "verdict": "PASS|FAIL|NEEDS_HUMAN", "evidence": "string", "citedItemIds": []} ],
  "weighted":  [ {"id": "...", "score": "1-5|N/A", "evidence": "string", "citedItemIds": []} ],
  "computed": {
    "cognitiveClusters": "...", "cognitiveDemandSpread": 0, "multiStepShare": 0,
    "distractorArithmeticChecks": "...", "retrievalSourceWeeks": [],
    "weightedMeanApplicable": 0, "depthSubsetMean": 0, "anyWeighted1": false
  },
  "decision": "ACCEPT | REJECT | HUMAN_REVIEW",
  "failingGateIds": [],
  "regenerationHints": [ "per failing gate: a concrete repair instruction" ]
}
```

**Decision logic.** Apply `gateThreshold` exactly — any hard-gate FAIL => REJECT; any hard-gate NEEDS_HUMAN => HUMAN_REVIEW; else apply the weighted thresholds (mean >= 3.5, depth-subset >= 3.0, no-1s) with the 3.3-3.5 / single-depth-2 human-review band. The reviewer must never ACCEPT when the prior-week ledger was missing and G1/G8 could not be adjudicated. Determinism aids: always cite `itemId`s, always recompute arithmetic rather than trusting labels, always cluster by cognitive operation rather than surface format.

**Gate threshold (summary).** ACCEPT requires **ALL 10 hard gates PASS** AND weighted composite mean **>= 3.5** over applicable criteria AND the depth-critical subset {BB-W1, BB-W2, BB-W3, BB-W4, BB-W5} mean **>= 3.0** AND **no applicable weighted criterion scores 1**. Full text and the HUMAN_REVIEW band are in the [Weighted criteria — gate threshold](#gate-threshold-weighted-total) section below.

### Division of labor with `validator.ts`

To avoid double-work and reduce LLM load:

- **`validator.ts` (deterministic code) owns:** schema/field presence, arithmetic correctness of stated answers, item-count/dose bounds, day-slot numbering, presence of `masteryCheck` object, and the CHEAP DETERMINISTIC halves of two gates — BB-G8(a) retrieval source-week indices strictly < current week (pure integer check), and a first-pass token scan for brand names (BB-G10) and for child-surface banned tokens (BB-G9) that FLAGS candidates for the LLM's referent check. `validator.ts` emits these pre-computed facts into the pack's sidecar so the LLM does not recompute them.
- **`authenticityGate` (LLM) owns everything semantic:** the BB-G5 cognitive clustering, BB-G7 band-conditioning + puzzle remove-the-concept test, BB-G1 newness/deepening vs the ledger, BB-G8(b) skill-instance semantics, BB-G9 referent carve-out adjudication of validator's flagged tokens, and all 14 weighted scores.

### Control flow / feedback loop

- **decision=ACCEPT** commits to `packStore` and appends this week's `conceptId` + difficulty to the ledger.
- **decision=REJECT** returns `failingGateIds` + `regenerationHints` to the generator for a TARGETED repair regeneration (regenerate only the failing sections where possible, e.g. re-draw Day-4 for a G7 fail), with a max-retries cap (recommend 2); on exhaustion escalate to HUMAN_REVIEW.
- **decision=HUMAN_REVIEW** queues the pack for a human with the reviewer's evidence attached.
- **Determinism / versioning:** run at low temperature, pin the rubric version hash into the verdict, and log per-gate evidence so a regression in the judge itself is auditable. Because the judge is an LLM, treat its hard-gate FAILs as blocking but its ACCEPTs as sampled — periodically re-score a random accepted slice with a second model or a human to detect judge drift (the authenticity analog of the correctness validator's own test suite).

---

## Hard gates

Any single hard-gate FAIL rejects the pack outright, regardless of weighted polish. The detection rules carry their false-pass and false-fail guards inline and are transcribed verbatim.

### 1. BB-G1 — One new-or-deepened concept per week (with structural through-line)

Confirm exactly one `conceptId`/objective at the pack top; the explanation introduces exactly ONE idea; every day item AND the puzzle instantiate that same concept. NEWNESS-OR-DEEPENING (check against the supplied prior-week concept ledger): the concept is either NEW vs all prior weeks, OR a documented deepening extension of a prior-week concept carrying an explicit delta — larger magnitude range, a harder subtype, or a new representation (e.g. join-to-5 -> join-to-10). FAIL if (a) the week is a topic sampler mixing 2+ unrelated concepts with no through-line, or (b) it re-serves a prior week's concept at the SAME difficulty AND SAME representation with no stated advance. FALSE-FAIL GUARD: do NOT fail a legitimate deepening week merely for sharing a named concept with a prior week — sharing a concept family across consecutive weeks is standard pacing on hard early concepts; the fail condition is same-difficulty repetition, not same name.

### 2. BB-G2 — Dual strand present, coupled, and non-comp demands reasoning beyond recognition

Read the per-item `strand` tag (the schema carries a PER-ITEM strand tag, NOT top-level `computational_focus`/`noncomputational_focus` fields — do not fail for those field names being absent). Tag every item; require non-computational count > 0 AND computational count > 0. COUPLING: the non-computational content must be a transfer/reasoning form of the SAME named concept as the computational core. REASONING-BEYOND-RECOGNITION (false-pass guard): the non-comp task must demand justify / compare / generalize / defend / classify — evidenced by a required explanation-or-defense element, an always/never classification, or a solution step-count > 1. A bare recognition task ('circle the pictures that show 3x4') does NOT satisfy coupling UNLESS it also requires the child to state/justify how they knew (drawn/audio justification acceptable at Level A). FAIL if either strand is empty, the pack is 100% calculation, the non-comp concept differs from the week concept, or the non-comp task is pure recognition with no justification demand.

### 3. BB-G3 — Day-5 non-computational page + weekly mastery check exist

Locate the Day-5 slot: confirm a dedicated non-computational page physically exists there (not a computational drill). SEPARATELY confirm a weekly mastery-check item set exists that feeds the >=85% gate — ACCEPT it whether it lives on the Day-5 page OR in a distinct top-level `masteryCheck` object (`masteryCheck.formA`/`formB`). FALSE-FAIL GUARD: do NOT require the mastery check to be physically co-located on the Day-5 page; a separate end-of-week `masteryCheck` block satisfies this. Sanity-check non-computational share ~15-20% of weekly pages. FAIL only if Day 5 is a computational drill, no non-computational page exists anywhere, or no weekly mastery-check item set exists at all. Band-appropriateness of the Day-5 page type is scored under BB-W6.

### 4. BB-G4 — Concept is actually taught (explanation + worked example, before independent practice)

Verify the pack contains (a) an explicit weekly concept-explanation block, (b) at least one worked/guided example for the concept, and (c) ordering explanation -> guided examples -> independent day items (examples BEFORE practice). FAIL if the pack is a bare problem list with no lesson object, if there is no worked example for the concept, or if items jump from a terse rule straight to independent practice. Depth/genuine-fade is scored under BB-W2; this gate checks presence + ordering only.

### 5. BB-G5 — Anti-drill by COGNITIVE OPERATION + step-count (representational variety is not a defense)

Cluster the week's items by COGNITIVE OPERATION and SOLUTION STEP-COUNT — NOT by template/answer-capture skeleton and NOT by surface representation. FALSE-PASS GUARD: representational variety (picture -> number sentence -> word -> solve-and-color -> puzzle) is explicitly NOT evidence of anti-drill; two items that both reduce to the same single one-step operation over a small operand/fact set collapse into ONE cluster even in different costumes. HARD COGNITIVE FLOOR: FAIL if the week's entire pool never exceeds one-step recall/computation over a small closed fact set, no matter how many formats appear (this is the mechanical-variety camouflage). Compute a cognitive-demand spread = number of non-isomorphic solution structures present; require >= 2 distinct solution structures across the week (>=2 step-count tiers, or genuinely different operations/decompositions). Also FAIL on raw density: any page with more than ~6-8 discrete problems in tight multi-column drill grids, a single computational skill filling a whole day with no format change, or >2-3 items on one page collapsing to one cluster differing only in swapped operands. A word problem that is one-step arithmetic with a name attached counts as drill.

### 6. BB-G6 — No speed-gating / timed advancement

Search for any timer that FEEDS a score or verdict, any item scored on latency, any 'complete in X minutes to pass', or speed as an input to the mastery/advancement check. A timed element is allowed ONLY if optional, private, self-referenced ('beat your own time'), ungraded, and explicitly NON-gating. FAIL if speed touches the weekly check, unlocks the next concept, or attaches a rank/score. BAND-CONDITIONAL: at Level A ANY timed element at all is a FAIL (sprints begin at Level B); at B+ a self-referenced ungraded sprint is compliant.

### 7. BB-G7 — Engagement levers, BAND-CONDITIONAL: word/real-world problem (right cognitive load) + genuine puzzle

BAND-CONDITIONAL (this gate is now on the band-conditional list). Level A (3-5): require >=1 genuine SINGLE-STEP pictorial/real-world problem (a name/context on a concrete picture) AND a genuine puzzle. FALSE-FAIL GUARD: multi-step word problems are cognitively band-inappropriate at Level A, so single-step picture problems are CORRECT there and must not fail; a sanctioned solve-and-color / color-by-value page IS a valid Level-A puzzle lever (blessed by BB-W8) and must NOT be failed as 'decorated arithmetic'. Level B+ (6+): require a MULTI-STEP word/real-world problem SHARE — at least 2 multi-step items OR >=25% of Day-4 items multi-step (FALSE-PASS GUARD: one token 2-step item cannot launder a drill week) AND a genuine puzzle. PUZZLE REMOVE-THE-CONCEPT TEST (all bands): the puzzle's solution must require the week's concept applied a NEW way; run a step-count/operation check — if the puzzle reduces to the SAME operation AND SAME step-count as a Day-1 core item (a multi-clue riddle wrapper around one bare product), it is decorated arithmetic -> FAIL. FAIL if items are all context-free bare calculations, if the band word-problem requirement is unmet, or if the puzzle fails the remove-the-concept test.

### 8. BB-G8 — Spaced retrieval is backward-only (by skill-instance) warm-up, never labeled 'review'

If retrieval/warm-up items exist: (a) every retrieval source-week index must be STRICTLY LESS than the current week — FAIL on any current- or future-week source (forward leak = impossible prerequisite); this numeric check can be pre-run deterministically in `validator.ts`. (b) Key the concept check on the specific SKILL INSTANCE / DIFFICULTY, not the concept FAMILY: retrieval must be a strictly-prior-week item the current week does NOT re-teach at the same level. FALSE-FAIL GUARD: a prior-week prerequisite that the current week DEEPENS (join-to-5 warming up this week's join-to-10) is legitimate backward retrieval and must PASS even though it shares the concept family; FAIL only when the warm-up duplicates THIS week's exact new target at the same difficulty. (c) items styled as low-stakes 'Warm-up!' framing, short, early in the day. Scan ALL prose (prompts, teacher-note strip, parent seed) for 'review'/'revision'/'stuff you forgot' framing the retrieval -> FAIL. Also FAIL on a dedicated 'review'/'mixed-practice' bolt-on section (spiral must be embedded substrate).

### 9. BB-G9 — Never-shame child surface, with hypothetical-third-party carve-out

Scan every CHILD-FACING string (hints, corrections, reveals, mastery/gate messages). FAIL on: any raw percentage shown to the child more than once, or any percentage/red-X/'fail'/'wrong'/'incorrect'/'Review' verdict STYLING directed AT the child; banned person-level tokens ('silly','you always','you should know this','careless'); any comparison to other children/siblings/class/percentile; or a corrective that re-serves the SAME missed items instead of fresh problems. FALSE-FAIL GUARD (carve-out): the words 'wrong'/'mistake' inside an error-analysis task ABOUT A HYPOTHETICAL THIRD PARTY ('What went wrong in Sam's work?', 'the step that proves Jo wrong') are NOT child-directed verdicts and must NOT fail this gate — the error-analysis strand legitimately needs them; only verdicts aimed at the child fail. Do a referent check, not a bare token scan. PASS requires near-miss language framed as 'one more round to make it stick' naming a specific wobbly skill; scores may live in the parent report only.

### 10. BB-G10 — No brand names / affiliation user-facing

Scan every user-facing string (explanations, hints, mastery messages, parent summary) for competitor or tutoring-company brand names (Best Brains, Kumon, RSM, Mathnasium, etc.) or any affiliation claim. Any occurrence FAILS. The voice must present as the independent original program (Ms. Wren) with no outside-brand identity. (This is distinct from BB-W7, which scores the program's OWN internal furniture on structure, not brand tokens.)

---

## Weighted criteria

Each criterion is scored on a 1-5 scale (or N/A where conditional). Detection rules and 1-5 anchors are transcribed verbatim. The composite threshold over these criteria is in [Gate threshold (weighted total)](#gate-threshold-weighted-total).

### BB-W1 — Concept-first depth (why-before-how is genuine reasoning, not a restated recipe)

**Detection rule.** Read `explanation.whyBeforeHow` / the lesson opening. It must justify WHY the procedure works with a concrete idea/model and a 'because' clause that PRECEDES the first imperative step. Score down if it merely lists algorithm steps with no motivating reason, opens on notation, or is boilerplate.

**Anchors.** 1 = opens straight on a rule/step-list with no why; 3 = a why is present but thin or partly a restated procedure; 5 = a concrete conceptual rationale clearly motivates and precedes every procedure.

### BB-W2 — Guided examples genuinely fade with think-aloud, reteach-complete

**Detection rule.** Walk `guidedExamples` in order (modeled -> completion -> prompted -> independent). 'modeled' must carry a first-person think-aloud with predict-pauses; `teacherSay` volume must monotonically shrink; 'independent' should be essentially `childDo` (solve cold). Confirm examples are fully worked and self-contained enough for a parent to re-instruct cold. Score down if steps are all independent from the start, scaffolding does not decrease, 'modeled' omits think-aloud, or examples show only final answers.

**Anchors.** 1 = no worked example or a flat answer-key with no fade; 3 = labeled fade present but support does not clearly decrease OR think-aloud is thin; 5 = monotonic fade from fully-narrated think-aloud to cold solo, self-contained enough to reteach from.

### BB-W3 — Hint ladder teaches rather than tells (orient->locate gradient; worked isomorph is a bonus)

**Detection rule.** For each item/puzzle `hintLadder` confirm rungs that ESCALATE support without reaching the answer: rung 1 = orienting question, rung 2 = locate the step/point at the model. A rung-3 worked SIMILAR example with DIFFERENT operands is an ASPIRATION, not the bar. FALSE-FAIL RECALIBRATION: authentic ladders are often 1-2 rungs (orient -> locate) and must not be hard-capped at 3 for lacking a worked-isomorph rung. Score down only if a single rung just states the algorithm, rungs restate the same tell, rung 3 (if present) reuses this item's own numbers, or ANY rung leaks the final answer (even implicitly).

**Anchors.** 1 = one rung that states the procedure OR any rung leaks the answer; 3 = rungs present but weak gradient / some repetition; 4 = a clean orient->locate 2-rung ladder that teaches without leaking; 5 = full orient->locate->model gradient with a similar-not-same worked example, no leak.

### BB-W4 — Distractors are misconception-faithful and reteach pointers land correctly

**Detection rule.** For each MC choice with `isCorrect:false`, recompute what the tagged misconception would actually yield and confirm `distractor.text` equals it (e.g. smaller-from-larger on 63-47 = 24; tops-and-bottoms fraction add = (a+c)/(b+d)); confirm the rationale names the real cognitive slip (not 'common mistake') and the mechanism appears in `mistakeBank`. Resolve each `reteachPointer` to a real segment (`script[i]`/GE-id) and verify that segment treats THAT error. Score down for arbitrary wrong-number distractors, generic/mislabeled rationales, or dangling/mismatched pointers.

**Anchors.** 1 = distractors are arbitrary wrong numbers OR rationales are platitudes / pointers dangle; 3 = most distractors trace a real error but some are arbitrary or a pointer misses; 5 = every distractor equals its named misconception's output and every reteach pointer hits the segment treating it.

### BB-W5 — Genuine conceptual variety / interleaving (complements the BB-G5 cognitive floor)

**Detection rule.** Per day count distinct COGNITIVE subtypes among core items; Days 2-3 must show >=2 genuinely different subtypes (e.g. forced-regroup mixed with no-regroup, or an 'is this ADDING or MULTIPLYING?' discrimination trap) so the child must NOTICE which is which. Across the week, word problems/puzzles should use varied real situations (pages, seats, money, recipes), not the same noun swapped. For any Form-B confirm it is not Form-A's numbers +1 in an identical sentence. Score down if a day is one template re-numbered, or interleaving appears on Day 1 before the concept is stable. (Density/one-step camouflage is already hard-gated in BB-G5; this scores the QUALITY of the discrimination.)

**Anchors.** 1 = every day is one template re-numbered; 3 = some format variety but little true interleaving/discrimination by Day 3; 5 = Days 2-3 interleave 2+ subtypes as real discrimination traps, contexts genuinely vary, isomorphs are surface-fresh.

### BB-W6 — Age-band presentation match (visual->symbolic, dose, decoration, sentence/vocab tier, input)

**Detection rule.** Match representation register and metadata to band. A (3-5): manipulative/pictorial, draw/color/circle answer modes, icon-as-unknown, mascot-high, audio-first, ~5-min dose, parent Teacher's-Note strip, sentences <=10 words, Tier-1 + taught words only, NO timed anything. B-C (6-9): place-value color-header columns, balance-scale/missing-factor graphics, branded logic puzzle, mascot tapering, ~10-min dose, sentences <=15 words with terms glossed on first use, sprints ungraded/self-referenced. D-E (10+): symbolic, inequalities, coordinate grids, written-explanation lines, decoration-minimal, full precise vocabulary unglossed. Verify `kidGloss` is truly child-level and stylus/handwriting-first input. Score down for cross-band mismatch (symbolic drill at A; coloring-as-answer or mascots at E; missing mid-band visual scaffolds at 6-9; over-length sentences; unglossed jargon at A/B).

**Anchors.** 1 = register inverts the band or sentences/vocab far off band; 3 = mostly band-appropriate with some misfit (dose, a scaffold, or a gloss off); 5 = representation, dose, decoration, sentence length, vocab tier and input all match the band's law.

### BB-W7 — Band-specific strand furniture present — scored on STRUCTURE, not brand token

**Detection rule.** For the pack's band, confirm the signature strand STRUCTURE: 3-5 = a parent-directed pedagogical-rationale strip alongside multi-modal tasks; 6-9 = a multi-clue DEDUCTIVE logic page that resolves into a computation; 10+ = an error-analysis task (two approaches / a worked error) with ruled written-explanation lines and an extension prompt. FALSE-FAIL RECALIBRATION: the program brands ALL puzzle furniture uniformly (e.g. 'Puzzle Grove') and may distribute error-analysis across daily items — accept the strand under ANY label and do NOT score down for a missing 'Brain Buster'/'ANALYZE'/etc. token it never claims. Score down ONLY if the structural signature is absent — a single-clue puzzle where multi-clue deduction is required, or error-analysis with no written-argument lines.

**Anchors.** 1 = no band furniture structure (generic challenge / no parent note); 3 = an equivalent strand present but off-form (logic without multi-clue deduction, or explanation without ruled prose lines); 5 = the authentic band strand structure present with its structural signature intact, under any brand label.

### BB-W8 — Page anatomy & answer-capture matches the task (embedded directions accepted)

**Detection rule.** Verify each section is framed as its own unit with a directions cue and an answer field whose TYPE matches the task: draw/color or oversized box for 3-5 pictorial; numeric square for computation; ruled multi-line region for explain/analyze; two-column Always/Never table for classification; checkboxes for verify-the-pair; coloring-as-answer with close distractors for solve-and-color. FALSE-FAIL RECALIBRATION: a directions cue EMBEDDED in the prompt string ('(Read aloud)', 'Write the number sentence') satisfies the requirement — do NOT require a literal 'Directions:' token. Score down for a genuinely missing direction, or an answer mode that cannot capture the required response (numeric box where a written explanation is required).

**Anchors.** 1 = answer mode mismatches the task (numeric box for an explain task) or no directions anywhere; 3 = conventions mostly present with a mismatch or two; 5 = every section framed with a direction cue (embedded or explicit) and a task-matched answer field.

### BB-W9 — Warm, wondering teacher voice; praise names a strategy, not speed or trait

**Detection rule.** Read the hook — it should invite wonder or tell a mini-story, not just announce a topic. Read all praise strings (hints, session-end, mastery, parent summary): each must name a specific deliberate MOVE ('you traded a ten', 'you estimated first', 'you checked before anyone asked'). Score down for clinical/robotic phrasing, speed praise ('fast','record time'), trait praise applied to the child ('so smart','genius','clever'), or bare generic praise ('good job','great!') with no named move.

**Anchors.** 1 = cold/topic-announcing voice and speed/trait/generic praise; 3 = warm but some generic praise or a flat hook; 5 = wonder/story hook throughout and all praise names an observable strategy move.

### BB-W10 — Correction arc materials: Acknowledge->Locate->Guide->Re-attempt with a fresh isomorph

**Detection rule.** Evaluate the correction MATERIALS present in the static pack, not assembled runtime dialogue. Confirm the pack carries: a laddered hint path (one rung at a time), a `mistakeBank` locate/point-at-the-step mechanism, and a FRESH Form-B isomorph (same skill, DIFFERENT operands) routed for the re-attempt. FALSE-FAIL RECALIBRATION: if the acknowledgment/location DIALOGUE is generated by the session engine at runtime and is absent from the content pack, mark that sub-check N/A and score the materials that ARE present — do NOT cap the score merely because assembled dialogue is unevidenceable from a static seed. Score down only if Form-B reuses Form-A's numbers, no re-attempt routing exists, or the reteach re-serves the identical failed item.

**Anchors.** 1 = no fresh isomorph / re-serves the same item / no re-attempt routing; 3 = materials present but one is thin (e.g. Form-B only partially fresh, or locate mechanism weak); 5 = laddered guide + concrete-model reteach + a genuinely fresh Form-B isomorph, all present in the pack (runtime dialogue N/A does not lower this).

### BB-W11 — Parent summary seed: four-field, plain, growth-framed, narrowable-to-one, speakable teach-back

**Detection rule.** Parse `parentSummarySeed` for the four Progress-Book slots in warmth order: (1) what we worked on [+ <=1 attitude sentence], (2) where improving, (3) what we're strengthening, (4) home focus — 'improving' before 'strengthening', task-level not person-level, a plan attached to the growth area, ~90-150 words when rendered. Slot 4 must give a non-math parent ~2 speakable lines (named strategy-praise + a teach-back question), no grading duty, no raw `errorTag`/indicator jargon in surface text. FALSE-FAIL RECALIBRATION: the seed intentionally supplies candidate POOLS (`improvingCandidates[]`, `strengtheningByTag[]`) narrowed to ONE at runtime per child — evaluate whether the pool CAN narrow to exactly one task-level growth area with a plan; do NOT score down for multiple candidates in the seed pool. Score down for deficit lists, person-level framing, internal tags leaking into surface text, missing plan, or a vague/ungrounded home question.

**Anchors.** 1 = deficit list / jargon in surface text / person-level framing OR no speakable teach-back; 3 = four fields present but order/word-count off, or the growth candidate lacks a plan; 5 = warmth-ordered four fields, a narrowable task-level growth pool each with a plan, plain language, two speakable teach-back lines.

### BB-W12 — Metacognitive self-check woven in (estimate-first, reasonableness, check-back) — CONDITIONAL

**Detection rule.** Scan `explanation.script`, guided examples, and Day 2-4 items for estimate-first framing ('about 50-20=30, so near 30 makes sense'), reasonableness checks against benchmarks (1/2, 1), and verification steps ('add your answer back to 18 — do you land on 45?'). CONDITIONAL: mark N/A at Level A (exempt); at Level B+ treat total absence as a soft style regression, not a hard fail.

**Anchors.** 1 = no estimation, reasonableness, or check-your-work anywhere (Levels B+); 3 = present in one place only; 5 = estimate-first and self-checking modeled in the explanation and recurring across Day 2-4 items.

### BB-W13 — Embedded spiral as rising-complexity substrate + on-thread algebra rendered in band form — CONDITIONAL

**Detection rule.** Confirm new-concept items assume and exercise previously taught skills as building blocks at higher complexity, not the brand-new skill in a vacuum. Separately decide whether the week sits ON the algebra thread (missing part/addend, equal-sign-as-balance, missing factor, variables, equations, inequalities, error-analysis of algebraic claims); if ON-thread verify the unknown is rendered in the band's form (A icon-as-unknown; B-C balance-scale/missing-factor; D-E variable/inequality with written error-analysis) and any continuity callbacks are preserved. Off-thread weeks are N/A on the algebra check. Score down if old skills never re-enter as scaffold, or an on-thread week renders the unknown as bare numeric drill / wrong-band form.

**Anchors.** 1 = items use only the new skill in isolation OR an on-thread week shows no unknown representation; 3 = some substrate but thin, or on-thread form present but band-off; 5 = old skills re-enter as harder substrate and any on-thread unknown is rendered in the correct band form with continuity intact.

### BB-W14 — 5-day arc + daily bite-size pacing

**Detection rule.** Check the five day-slots: Day 1 = concept echo + guided-style practice on the concept (blocked, no interleaving); Days 2-3 = fluency then application with interleaving/discrimination by Day 3; Day 4 = word problems / real-world (band-appropriate load per BB-G7); Day 5 = non-computational page + mixed retrieval + weekly check (mastery check may be a separate `masteryCheck` block per BB-G3 — do not penalize non-co-location). Slots must be Day1-5 numbered, not weekday-named. Each day a light dose (~a handful of problems, ~5-15 min, one page). Score down if interleaving appears on Day 1, Day 4 lacks word problems, the weekly check set is absent, days are weekday-named, or the week is one undifferentiated / front-loaded pile.

**Anchors.** 1 = undifferentiated pile or arc scrambled (interleave on Day 1 / no Day-4 word problems / no weekly check); 3 = day structure present but one slot off or dose uneven; 5 = full novelty->discrimination->application->check arc, day-numbered, even ~5-15 min daily doses.

### Gate threshold (weighted total)

ACCEPT requires ALL of:

1. **ALL 10 hard gates PASS** — any single hard-gate FAIL rejects the pack outright, regardless of weighted polish.
2. The weighted composite over APPLICABLE criteria has **mean >= 3.5** on the 1-5 scale. Criteria marked N/A are EXCLUDED from the mean and denominator: BB-W12 is N/A at Level A; BB-W13 algebra sub-score is N/A off-thread; BB-W10's runtime-dialogue sub-check is N/A when acknowledgment text is engine-generated (score the materials only); BB-W7 is scored on the band's furniture.
3. **No applicable weighted criterion scores 1.**
4. The **depth-critical subset {BB-W1, BB-W2, BB-W3, BB-W4, BB-W5} has mean >= 3.0** — a structurally-clean but pedagogically-hollow pack is rejected even if presentation criteria (W6-W9, W14) inflate the overall mean; this closes the residual mechanical-variety exit where the false-pass pack scored ~3 across the board.

**ROUTE TO HUMAN REVIEW** (neither auto-accept nor auto-reject) when: overall mean is 3.3-3.5, OR any single depth-critical criterion scores 2, OR a hard gate is CONFIRMED-borderline (the reviewer's own confidence < high).

**Rationale for the two-tier weighted floor.** The mechanical-variety attack is designed to sit exactly at the old ~3.0 mean; requiring 3.5 overall AND a 3.0 depth-subset floor AND no-1s means format-costume drill (which genuinely earns low W1/W4/W5) can no longer clear on presentation alone even in the event it slipped past hardened BB-G5.

---

## False-pass guards

Guards that stop authentic-LOOKING mechanical drill from passing (from the false-pass red-team):

1. BB-G5 clusters by COGNITIVE OPERATION + STEP-COUNT, not template/answer-capture skeleton — the x3/x4 pack's five costumes (picture, skip-count, array, match, solve-and-color) collapse into ONE cluster because they share one one-step product. Representational variety is explicitly declared NON-evidence of anti-drill.
2. BB-G5 hard cognitive floor: FAIL if the entire week never exceeds one-step recall over a small closed fact set, no matter how many formats; plus a cognitive-demand spread >=2 non-isomorphic solution structures.
3. BB-G7 multi-step SHARE (>=2 items or >=25% of Day-4 at B+) replaces 'at least one' — one token 2-step item can no longer launder a drill week.
4. BB-G7 puzzle REMOVE-THE-CONCEPT test: if the Brain Buster reduces to the same operation and step-count as a Day-1 item, the multi-clue riddle wrapper does not save it -> FAIL (kills the '4x4 riddle' camouflage).
5. BB-G2 reasoning-beyond-recognition: the non-comp strand must demand justify/compare/generalize/defend/classify (explanation or step-count>1) — a 'circle the ones that show 3x4' recognition task does NOT satisfy the coupling gate.
6. BB-G1 depth: rejects a pack whose whole week is one fact family re-skinned (works with the G5 spread metric).
7. Weighted backstop: `gateThreshold` now requires overall mean >= 3.5 AND depth-subset {W1,W2,W3,W4,W5} mean >= 3.0 AND no criterion = 1. The camouflage pack, engineered to sit at ~3.0, genuinely earns low W1/W4/W5 (no real why, arbitrary-fact distractors, no true discrimination), so it fails the depth floor even in the unlikely event it slipped past hardened G5.

## False-fail guards

Guards that stop authentic packs from being wrongly rejected (from the false-fail attack + the three authored fixtures MFM-A15/B14/D17):

1. BB-G7 is now BAND-CONDITIONAL and on the band-conditional list: Level A requires a single-step pictorial problem (multi-step is band-inappropriate there), and a sanctioned solve-and-color / color-by-value page is a valid Level-A puzzle — MFM-A15's Day-4 join problems and 'Add-and-Color Garden' now PASS.
2. BB-G1 fail condition redefined as same-difficulty/same-representation repetition, NOT same named concept — a deepening extension week (join-to-5 -> join-to-10) with an explicit delta PASSES.
3. BB-G8 keys on skill-INSTANCE/difficulty, not concept family — a prior-week prerequisite warm-up on a concept the current week DEEPENS is legitimate backward retrieval and PASSES.
4. BB-G3 accepts a separate top-level `masteryCheck.formA/formB` block as satisfying the weekly-check requirement — no physical Day-5 co-location demanded (rescues all three fixtures).
5. BB-G9 uses a referent check with a hypothetical-third-party carve-out — 'What went wrong in Sam's work?' / 'proves Jo wrong' are error-analysis prompts, not child-directed verdicts, and PASS.
6. BB-W7 scores STRUCTURE not brand token — a uniformly 'Puzzle Grove'-labeled multi-clue page or an unlabeled-but-complete error-analysis strand is not marked down for missing a 'Brain Buster'/'ANALYZE' name it never claims.
7. BB-W11 evaluates the seed's candidate POOLS as narrowable-to-one, not as multiple final growth areas — `improvingCandidates[3]`+`strengtheningByTag[3]` no longer scores down.
8. BB-W10 scores the correction MATERIALS present and marks engine-generated runtime dialogue N/A — no longer caps every static pack at ~3.
9. BB-W3 recalibrated so a clean orient->locate 2-rung ladder reaches 4; the worked-isomorph 3rd rung is aspirational, not the 5-bar.
10. BB-W8 accepts embedded directions ('(Read aloud)', 'Write the number sentence') — no literal 'Directions:' token required.
11. BB-G2 reads the PER-ITEM 'strand' tag; it does not fail for the absence of `computational_focus`/`noncomputational_focus` fields that the schema never had.

---

## Open concerns

Honest limitations of this gate as adopted:

1. Two hard gates (BB-G1 newness/deepening, BB-G8 skill-instance retrieval) are only as good as the PRIOR-WEEK CONCEPT LEDGER. If the ledger is stale, incomplete, or the 'deepening delta' is undocumented, the gate cannot distinguish a legitimate deepening week from a lazy re-run — hence the rule to route to HUMAN_REVIEW rather than auto-pass when the ledger is missing. A structured per-week `deepeningDelta` field in the pack would let this become deterministic; recommend adding it to the schema.
2. LLM-judge reliability on the numeric sub-checks (BB-G5 cognitive clustering, BB-G7 share, BB-W4 distractor arithmetic) is the main residual risk — these are exactly where an LLM can hand-wave. The two-pass protocol and 'recompute, don't trust labels' instruction mitigate but do not eliminate this; consider migrating the pure-arithmetic BB-W4 recomputation and the BB-G7 step-count share into `validator.ts` as deterministic code once the tagging schema stabilizes.
3. 'Cognitive operation' and 'solution step-count' are judgment calls at the margin (is estimate-then-compute one step or two?). Different reviewer runs may cluster borderline items differently, causing BB-G5 spread to wobble around the >=2 threshold. A short worked taxonomy of cognitive operations per band would tighten this.
4. The depth-subset floor (>=3.0 on W1-W5) and overall 3.5 were set to bracket the specific false-pass pack at ~3.0; they are calibrated against one adversarial example plus three authentic fixtures. They should be re-tuned once a larger labeled corpus of accept/reject packs exists, to confirm they do not systematically reject authentic-but-terse packs or admit borderline drill.
5. BB-W10 and parts of BB-W11 judge a pre-runtime SEED against behavior finalized by the session engine. The gate now marks those sub-checks N/A, but that means genuine defects in the runtime assembly (e.g. the engine re-serving the same item despite a fresh Form-B being available) are invisible to this content-time gate — they need a separate runtime/session-level check.
6. BB-G6/BB-G7/BB-W6/BB-W7/BB-W12 band-conditioning assumes the band label is trustworthy; a mislabeled band would misapply every conditional rule. `validator.ts` should assert band-vs-content register consistency as a cheap pre-check.
7. Human-review queue volume is unquantified — if the 3.3-3.5 band catches too many packs, the gate becomes a throughput bottleneck; monitor the HUMAN_REVIEW rate after launch and adjust the review band width.

---

## Provenance

This rubric was derived from the Best Brains research evidence ledger via a 6-source marker extraction + synthesis, then hardened through a 3-way adversarial stress-test (false-pass red-team, false-fail attack, and fixture calibration against the three authored fixtures MFM-A15/B14/D17) — 11 agents in total. It scores **style / authenticity only**; correctness remains the responsibility of the deterministic validator (`validator.ts` / QG-1..10), which must pass before this gate runs.
