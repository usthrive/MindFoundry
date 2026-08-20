# Problem design rules

Rules for building assessment items that teach. Each is stated as an **invariant**, with the failure that earned it and how to check it. A rule written as the instance you happened to find first is a rule an author can satisfy while reproducing the defect in a form the rule does not name — so where a rule looks oddly general, that generality is the point.

`LEARNINGS.md` records these chronologically as failures. This file is the forward-facing version: how to build the thing correctly the first time.

---

## 1. Correctness — the answer must be impossible to get wrong

**1.1 Answers are computed by code, never authored.** A generator emits `params`; a registered `answerFor(params)` computes the key. An author who types an answer has created a defect the validator cannot see, because the validator compares the key against the params and both came from the same hand.

**1.2 Every embedded claim is computed too.** If an item says "Pip wrote 9", the 9 comes from a `verifyFor(params)` transform applying a *named misconception*, not from the author. This makes the wrong-answer-in-the-prose bug class structurally impossible.

**1.3 Never fabricate a wrong number. Prove impossibility first.** When the misconception a recipe names cannot be produced by any registered transform, the order is: (a) hunt for an algebraic identity that makes it derivable after all — the operation-swap template covers far more than it looks like it does; (b) reframe the question so the misconception value is genuinely computed; (c) relocate the misconception to a discrimination option or an always/sometimes/never claim, where it needs no wrong value; (d) document the choice in the file header.

> **And refuse an identity that has no referent.** One author found `{a:3, b:3, op:'+', wrongOp:'×'}` genuinely returns `{correct: 6, wrong: 9}` — exactly the 6-vs-9 flip their week needed. They refused it, because the week had taught neither addition nor multiplication and the operands 3 and 3 existed only because they hit the target values. A derivable number with no referent on the page is fabrication with extra steps.

**1.4 A computable answer is not the same as an askable question.** "How much trading does 601 − 462 need?" has two defensible answers. No gate can see this: gates check that the key matches the params, never that the prompt admits one reading. When an item counts or classifies something structural, state the quantity so precisely that the degenerate case still has one answer.

**1.5 Build a second, independent re-derivation inside the item.** Re-compute the answer from `generator.params` by a different route than the generator used, and **throw** if they disagree. Make it genuinely different — if the check echoes the generator's own arithmetic it proves nothing. Then corrupt something and watch it throw before you trust it.

---

## 2. Guessability — can a child score without doing the mathematics?

This is the largest body of hard-won rule, because every defect here passes every arithmetic check.

**2.1 The strong form of the question.** "Is this guessable?" is the weak form. The strong form is: **does guessing it reward the exact misconception this week teaches against?** A comparison generator once keyed the heavier-*looking* object 73.5% of the time in the week whose entire point is that looks deceive. The arithmetic was right, the picture agreed with the answer, and every gate passed it.

**2.2 Name the blind habit, then measure it against its chance floor.** For every discrimination and every certifying item, write down the shortcut a child could play — "tap the biggest", "tap the longer row", "tap the number you heard first", "tap the tilted one" — and measure its success rate over ≥500 packs. Report it as a number beside its floor, not as a judgement.

**2.3 The answer must not sit at a fixed rank.** Not always the biggest, not always the smallest, **and not always the middle**. An author who correctly defended against "all distractors below" built distractors that *bracket* the answer on every draw — making "pick the middle" score 100% in a mastery slot. State the invariant as *rank*, and rotate the **pairing** rather than the numbers: drawing the pairing from `n` ties the rank to the number, so recognising the count still tells you the rank.

**2.4 No option may be offered often and keyed never.** The working threshold is **offered on ≥50% of draws and correct on none**. A dead option is worse than no option: a child learns to strike it out and a three-way page becomes a coin flip. Two honest routes: widen the draw so it is sometimes right, or — only if it is false under *any* draw because it states a named misconception — hold it well under the threshold and say so with the measured rate.

**2.5 Rotate the relation, not just the numbers.** An item whose keyed text varies every seed can still be free. One week named three events and always drew a half-past clock, so the answer was the second event named — 800 times out of 800. Answer-text variety looked healthy; what was constant was the answer's *rank in the prompt*.

**2.6 Measure what is SERVED, not what you meant to draw.** A uniqueness filter sitting between the pool and the page is not neutral: it discards colliding draws and takes the next, so values that collide often are suppressed. Balanced pools have produced 62% skews on the page.

**2.7 A balanced pool is not a balanced page.** A marginal over thousands of draws answers "is the generator fair?". A child sits **one pack**. State every such property as a per-pack guarantee and enforce it by **dealing from the pack's own guard before any page is built** — not by drawing independently and trusting the average. One week's pools were fine on average and gameable on every page.

**2.8 Never name a thing after the attribute the item asks about.** A "long stick" in a longer/shorter item hands over the answer when it is right and is absurd when it is wrong. Distinguish by a property orthogonal to the question — colour, kind, owner.

**2.9 Watch for the mirror.** Defending against a habit often installs its complement. "The spread-out row never has more" teaches "the spread-out row has fewer", which is just as free. Draw the trap's direction **independently** of the trap's presence, and report the joint distribution, not the marginal.

**2.10 A scaffold whose whole purpose is to make a child commit must be near a coin flip.** A prediction probe that is 70/30 teaches the guess instead of the commitment. Drawing the side first is necessary but not sufficient — check that no blind habit answers the probe either.

---

## 3. Display — what the child actually meets

**3.1 A figure must never hand over the answer it asks for.** Ask of every picture: *what does this let the child skip?* A one-to-one matching figure on a conservation item rings the leftovers and destroys the item. A fully-labelled chart answers the question it illustrates.

**3.2 The dangerous figure is the helpful one.** A wrong picture gets caught. A correct, generous picture passes every gate and removes the assessment.

**3.3 Scaffolds default OFF on assessed items.** Matching threads, marked extras, cover styles — turn them on to *model* a strategy in the lesson and the guided examples, where the answer is already on the page. Never on an item that assesses that strategy.

**3.4 A figure asserts a GIVEN, not the answer.** Show one group and assert the group size; mark only the quantity the child was handed.

**3.5 Render it and measure the render.** A data validator cannot see a drawing that disagrees with its own parameters. A triangle labelled 40/60/80 drew as equilateral for months — the params were honest and the renderer fell back to a regular shape. Where a picture encodes a quantity, **recompute that quantity from the rendered output** and compare it with the label.

**3.6 A word-valued option must be a word the pack has spoken.** No gate checks this. One week keyed "pentagon" and "hexagon" on half its assessed pages and never said either word anywhere in the lesson — to a child who cannot read the buttons.

**3.7 A size prop may govern only part of what renders.** A canvas component took a `height` and also drew a tool strip above it and a caption below, so a container sized from the viewport overflowed by exactly that chrome — and pushed the answer control off the bottom of a phone, leaving a child able to see two of three options. Measure what the component actually rendered and subtract the difference; do not compute a layout from the viewport when the pieces inside it are variable. (Related and easy to lose: `clientHeight` **includes** the element's own padding.)

**3.8 Know which surface is identity-bearing.** Freshness signatures, operand-uniqueness and audit checks parse numeric tokens off the *raw prompt*. Stripping numbers from a prompt for good pedagogical reasons can silently un-guard the item. Keep the identity-bearing surface intact and change the surface the child meets.

---

## 4. Modality — who consumes this, in what form?

**4.1 Ask of every field: who consumes this, and how?** A field the schema calls accessibility text may be the first thing the child *hears*. A field a comment calls teacher framing may be spoken aloud to the child by the lesson screen. Verify the consumer in the shipped UI, never from the field's name.

**4.2 Where prompts are read aloud, the figure's alt is part of the question.** If the reader prefers the alt over the prompt's own image bracket, then the alt is what the child hears first, and it must never name the quantity being asked for.

**4.3 A NUMBER WORD IS A NUMBER.** "five ducks" discloses an answer of 5 exactly as "5 ducks" does. So does "one number is missing" when the answer is 1, and so does a plural that implies a count.

**4.4 Numbers that are GIVENS may stay.** A build task's "draw 3 counters", a frame's stated capacity, a story that states its own count. The test is whether the number is what the question *asks for*, not whether a number is present.

**4.5 Do not assume every element is delivered in the same modality.** In one system the prompt and figure autoplay but the answer buttons are silent — so a pre-reader can hear the question and cannot read the options. Check each surface separately.

---

## 5. Claims a pack makes about itself

**5.1 Enforce it or rewrite it.** When a pack asserts an invariant about itself — a freshness note, a mistake-bank description, a distractor rationale — either make it true by construction or replace it with what is actually true. A claim nothing enforces is how defects ship past every gate. Freshness claims have been measured false in **12 of 18** weeks in one level and **3 of 4** in another.

**5.2 Prove infeasibility with arithmetic, not with assertion.** "Cannot be enforced" is a measurement, not an opinion. One week showed its claim needed 63 distinct pairs while 46 were printed before the final form drew — then wrote the arithmetic into the file instead of a vague apology.

**5.3 Split the claim when only half is enforceable.** Enforce the half that certifies, disclose the half that cannot be, and give the measured rate for the second half.

**5.4 A stated rule must be re-derived, not just its numbers.** Apply every generalisation to the pack's own worked examples and check what each noun phrase refers to. One week taught "a ten-count writes the number of groups with a zero behind it" in five child-facing places. Every worked number beside it was correct; the sentence was false; no arithmetic audit could object.

**5.5 Report the unflattering unit too.** A defect at "12% of pages" may be "88% of packs". Give both, and put the per-pack number second so it cannot be skipped.

---

## 6. What gates cannot see — read before trusting green

**6.1 A gate must measure the surface the CHILD TOUCHES, not the artefact the author wrote.** When a rendering layer synthesises part of the question, the gate must import that same function and measure its output. A display layer once invented four answer buttons at render time and always placed the answer second-smallest — 100% of items across an entire level — while six gates reported PASS, because all six stopped at the content boundary.

**6.2 Audit a gate's enablement list as hard as its logic.** "Which items does this rule apply to?" is a separate question from "is this rule correct?", and it fails silently in a way that looks exactly like a clean pass. Found repeatedly: a validation mode missing from a whitelist, a week missing from a contract set, a permit outliving what it permitted, a filter keyed on a field that is never set.

**6.3 When a detector never fires across a whole corpus, suspect the detector.** Four separate gates were found reading fields that are never set, permitting ids that no longer exist, or validating half the corpus under the wrong contract.

**6.4 Prove a check FIRES before trusting it green — with a negative control.** Corrupt the thing it guards and watch it fail; then corrupt something it should ignore and watch it stay quiet. A probe that fires nowhere proves nothing, and one that fires everywhere proves nothing either.

**6.5 An exemption is a blind spot, not a clearance.** Where a gate carves out a class — comparison items that key an extreme by definition, retrieval items that legitimately replay another unit — those items are *unmeasured*, not proven safe. Measure them yourself.

**6.6 A green board is only as wide as the list you run.** Keep the gate list explicit and versioned. One gate sat failing 180 times for a whole session while six others stayed green, because it was not on the list anyone was running.

**6.7 A feature behind an optional prop is dead until a caller passes it — audit the call sites, not the component.** A full-screen working pad shipped and was reported "not working": the code was live and correct, but the prop that enables it was passed by **two of five** screens, and the prop enabling its read-aloud control was passed by **none of five**. The component looked complete from the inside. Nothing type-checks this, and no content gate reaches display code. Whenever a capability is gated on an optional input, enumerate every call site and record which ones satisfy it — the same enablement-list discipline as 6.2, one layer out.

**6.8 A store that holds a child's work must outlive the failure it exists to survive.** A weekly check kept its resume state in `sessionStorage`, which a device clears when the browser session ends — so a reload was survivable and a restart was not, and a child who lost his tablet mid-check sat five questions twice. His answers were never lost: they were banked server-side as he made them. **Only the resume was ephemeral, which is the cruellest version — the record was intact and the child was made to redo the work anyway.** Ask of any persisted state: what event is it protecting against, and does the store actually survive that event? Then check the same choice against any *integrity* rule it also serves — here the file claimed "answered items stand, no restart-scumming", and the ephemeral store defeated that rule too, so the child-facing bug and the integrity rule wanted the same fix.

**6.9 State that outlives the session needs guards that ephemeral state did not.** Promoting a store from session to durable changes what can be wrong in it. Two guards were needed the moment the store survived a restart: **filter loaded entries to the items actually on the page** (content regenerates per child and per seed, and stale entries from another draw could otherwise satisfy a completion count for work never done), and **key on the user** (a key with no child id is invisible on a one-child device and silently cross-contaminates the moment a sibling shares the tablet).

**6.10 Write down what a gate does NOT cover, in the gate's own header.** The uncovered surface is where the next real defect lives. Known uncovered classes: prose inside manual-review answers, exemplar text in mistake banks, puzzle keys, prediction probes with no key, and free-entry answers with nothing to rank.

---

## 7. Process

**7.1 Wire the unit in before you verify it.** Corpus-level gates import the registry, so an author physically cannot run them on their own new unit. Wire, then verify, as an explicit step — several units once passed by luck.

**7.2 Read your own generated output.** Every author who did this found something no gate did: a row of one duck, "colour the apple box" with no box drawn, a page with no task in it, an item asking about "the frame" over two frames. The gates prove the mathematics; only reading proves the content.

**7.3 Scan for borrowed prose across the whole corpus, with a comment-aware scanner.** Per-unit gates dedupe *within* a unit and are structurally blind to imitation — and imitation is exactly what exemplar-first authoring encourages. Two traps: a regex that strips comments lets an apostrophe mis-pair quotes and silently shift every later literal; and **the strongest attractor is the same cell one level up**, a file the author may never have opened. Convergence is not a defence when the shared run is five words long.

**7.4 Budget the reusable pieces before the items.** Hint ladders have a reuse cap, so a 19-item unit may need ten distinct ladders. This decides the unit's shape and nothing else will tell you.

**7.5 Nudge deterministically; never loop a redraw.** A retry loop consumes a variable number of random draws, which makes every later item depend on this one and breaks seed stability. One deterministic step is almost always enough.

**7.6 If your change shifts random consumption, every later draw moves.** That is not automatically wrong — but measure it before and after and say so. Never claim a surface is unchanged without diffing it.

**7.7 Run the feasibility sweep across all units BEFORE fanning out.** Ask of every recipe: can the renderer draw what this names, and can it be spoken? Asking once across a level costs minutes; discovering it per-unit costs a full authoring run each time, and tempts each author to quietly substitute rather than escalate — which is how a unit silently loses the misconception it is named for. Record both verdicts: blocked *and* cleared.

---

## 8. Band overlays

Rules that change with the age band. Everything above applies at every band.

| | Youngest band (pre-readers) | Middle bands | Oldest bands |
|---|---|---|---|
| Sentence ceiling | ≤10 words **per sentence** | ≤15, terms glossed on first use | full vocabulary, unglossed |
| Timing | **any timer is a hard failure** | self-referenced, ungraded sprints | same, decoration-minimal |
| Answer mode | tap/choose, oversized targets | numeric pad + choice | symbolic, written explanation |
| Free-entry numeric | **not a real mode** — a pre-reader cannot type, so it becomes generated buttons with invented distractors. Certifying slots must carry **authored** choices | available | standard |
| Multi-step | **banned** — single-step pictorial is the correct form | gentle two-step | full, inverse-start |
| Every working day | **must show a picture** | — | — |
| Error analysis | "help the puppet" — a character made the slip; avoid the word "wrong" even here | written, one sentence | full analysis with an extension |
| Metacognition | not yet | intro predictions | estimate-first standard |

---

## 9. Checklist before an item ships

1. Is the answer computed, and does a second independent re-derivation agree?
2. Is every distractor a **named** misconception, and does its value equal what that misconception actually yields?
3. Name the blind habit this item's week exists to punish. **Measure it.** Does it beat its chance floor?
4. Is every offered option correct on some draw — or, if not, held well below the dead-option threshold with the reason stated?
5. Does the key rotate across low, middle and high rank?
6. Does the picture give away the answer, or short-circuit the strategy being assessed?
7. In the modality the child receives it, does anything disclose the answer before the question is asked?
8. Is every claim the item makes about itself true, measured?
9. Have you read the generated page, as a child would meet it?
10. If a gate says this is fine — do you know what that gate does not look at?
