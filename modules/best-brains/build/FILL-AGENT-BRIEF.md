# FILL-AGENT-BRIEF — the standing contract for a one-week authoring agent

Written 2026-08-12, during the Level-A fill. This is the brief that survived eight weeks
(a03, a14, a16, a17, a18, a13, a10, …) and every bar in it was **added after a defect got past a
clean 200-seed sweep**. Copy it per week and add only the per-week delta.

Its point: an author who is told the bars up front catches them; an author who is not, ships them.
Measured across the fill — the first agent found defects only when prompted, the fourth found seven
before shipping. The difference is this document.

---

## 1. The orchestrator's own rules (do not delegate these)

- **Re-verify every agent claim.** Re-run the seed sweep, read the served pack, re-measure the
  blind-strategy numbers. Three of the sharpest catches in the previous Level-A session were agent
  claims that were wrong or incomplete; in this fill, one agent's report named two live-leak weeks
  and a corpus scan found four *different* ones.
- **Read the served pack, not just the gates.** The d17 allotment item ("1 1/3 of the plot is
  planted") and A14's spoken "two" were both found by reading, never by a gate.
- **Shared files are the orchestrator's alone.** Agents report `lib/` defects; the orchestrator
  fixes them, and only in a window when no agent is running. Every such fix triggers the FULL
  battery, not a spot check — a library change touches every level.
- **Measure the blast radius before changing a shared file.** The `conceptFamily` repair looked
  sweeping and turned out to touch exactly two weeks; that check is what made it safe to land.
- **Agent budget is the machine's call, not permission's.** `bb-agent-budget.ts` prints the number.
  At ~750 MB free it prints 1, and losing a 45-minute agent to an OOM costs more than parallelism
  buys.

## 2. The three hard bars (each cost a week)

**(a) No number an alt speaks may equal that item's key, at band A.** L48 — the description is
autoplayed to a pre-reader BEFORE the question, so a number in it can hand over the answer.

**State the rule that way, not as "no numbers at all."** The absolute form was tried on 2026-08-12
and is wrong in both directions. It is too weak — it says nothing about the *coincidences* that do
the damage (a number can be a legitimate given and still equal the answer: `partnerBox`'s "5 and ▢
make 10"). And it is too strong — the corpus is full of numbers in alts that no draw can key
(A6's "a number path reading 7, 8, blank, 10" IS the question; "three rows to count" is structural),
and enforcing absolutism on `countByTens` stripped "towers of **ten**" from a generator that draws
2–5 towers and keys 20–50, so the number could never be its answer. That change bought nothing and
**cost a screen-reader child the one fact the week teaches** — that the towers are tens. It was
reverted.

So: enumerate your slot's key set, enumerate the numbers your alt can speak, and prove the
intersection is empty. Using no numbers at all is the cheapest way to get there and usually right —
but where a number is load-bearing for a child who cannot see the picture, keep it and prove it safe.
Accessibility is not the thing to trade away.

The trap has been found five times, in five disguises:

| Disguise | Where | How it keyed the answer |
|---|---|---|
| `"two groups of …"` | a14, then the shared `pictureJoin` | smallest possible total was 2 |
| the crossed-out count | `pictureTakeAway` | difference equals it when a row holds twice what it loses |
| `"a ten-frame"` | `frameName()`, and hand-written in a02/a03/a04 | equals the count whenever the frame is FULL |
| the stated given | `partnerBox` | on the halfway bond, "5 and ▢ make 10" — the given IS the answer |
| `"one"` inside a path alt | a17 (self-caught) | count-back pages can key 1 |

Enforce a no-number rule on your own alts **at module load**, and report the scan (alts checked,
digits found, number words found).

**Note for the orchestrator:** `bb-spoken-answer-test` does NOT catch the compound-word form, and
that is deliberate — its tokenizer keeps `ten-frame` whole so `8:30`, `3.5` and `$4.50` survive.
The content is fixed corpus-wide; the detector is not. Making it a gate is a change to the standing
nine, and belongs to the owner.

**(b) Blind strategies above 5% are a defect, not residue.** L51 — ask whether guessing rewards the
misconception the week teaches against. a16 first shipped with "always subtract" certifying **60.6%**
of children in the week whose whole point is telling a join from a take-away. Report:

- always-largest / smallest / middle / first-card, and the week's own habits (always-add,
  always-subtract, always-the-five-partner, …);
- **the per-slot key table** — for each mastery slot, the share of forms where the key equals the
  sum / the difference. This is what shows WHERE a habit wins and is how a16's repair was aimed;
- **the teachability check**: the CORRECT rule's pass rate. It should be ~100%. A form that
  defeats every blind strategy might also defeat every child, and nothing else in the battery
  would say so. (Added after a13 reported it unprompted; now mandatory.)

Deal the balancing mix **per form**, never per page. "50% in expectation" is what let a16's blind
subtractor get lucky. Include at least one slot no arithmetic reflex can win (a17's `firstHop` is
the model — its key is neither the sum nor the difference of the numbers on the page).

Watch the coincidences that resurrect a beaten habit: when `a = 2b` the difference equals `b`;
when the parts are equal the given is the answer. a16 lost 19 points to the first of these *after*
its main repair.

**(c) No permanently unkeyable card** (L38). Six of the first seven weeks shipped one past a clean
sweep. Also: `makeWeekBuilder` rebuilds day items whose numeric tokens collide with a guided
example's, and **does not apply that filter to the mastery forms** — a13 found it silently punching
a card out of a day slot (offered 89.5%, keyed never). If your guided examples carry numerals,
check the SERVED key sets afterwards.

## 3. Band-A laws (hard fails)

`sprint: null` — a timer at band A is a hard fail and `makeWeekBuilder` refuses one outright ·
`GATE_PROFILE.A` = `multiStep: null` (a single-step pictorial real-world item is the correct band
form, never a watered-down two-step), `discrimination: 1` in Days 2–3, `errorAnalysis: true` in
puppet form, `metacog: false`, `situationTypes: 0`, `warmupFormats: 0`, `puzzleRemoveConcept: false`,
**`pictorialPerDay: 1`** · **≤10 words per SENTENCE**, enforced at draw time by the week's own
helper · **authored 3-option choices on every certifying slot** (L53: a choice-less numeric item
gets four runtime-invented buttons with the answer second-smallest; free-entry numeric is not a
band-A answer mode because a pre-reader cannot type) · never declare a lure in a certifying slot ·
puppet named, never "a student", and "wrong" never appears · the alt is spoken before the question.

## 4. Known library gaps — do not rediscover, do not fix

| Gap | Consequence | Asked by |
|---|---|---|
| No numeral-glyph primitive (drawn digit, mirror flag, trace path) | forced a03's discrimination substitution; band A has no symbol-shape item | a03 |
| No number-sentence primitive (numerals + operators + a blank box) | the `=` cannot be drawn; sentences must live in the prompt or on cards | a14, a15, a17, a18 |
| No empty-container primitive | a group of 0 renders as a caption beside a blank | a03 |
| `'set'` validation routes band A to a KEYBOARD (`needsTypedEntry`) | a pre-reader cannot answer; design around it | a12 |
| No verify twins for `a_join_v1`, `a_takeaway_v1`, partner/frame templates | QG-5 skips `choice-key`, so `answerFor` is dead for every band-A certifying page | a14, a16, a17, a13 |
| Form-B collision check treats `{templateId, params}` as a question's identity | several page types sharing one transform cause silent rebuilds that spend a freshness surface and discard it | a16, a17, a18 |
| `SituationType` has no `separate` member | join/separate/part-whole/compare is the early-years taxonomy; borrow `part-whole` | a16 |
| `conceptFamily` cannot match compound ids (`add-and-subtract-within-10`) | BB-G1 still cannot demand a delta there; ship one anyway | a18 |

## 5. Self-verify, then report

Run the 200-seed sweep (kit §G) until it prints SEED-INVARIANT; then `tsc --noEmit` **to completion,
reading the whole output** — a piped grep alone has produced a false clean. Do not run the nine-gate
battery; the orchestrator does.

Report: the sweep line verbatim · the tsc result · per-day build with measured option ranks, the
blind-strategy table, the per-slot key table and the alt scan, all with sample sizes · everything
you could not build honestly and what you did instead · any shared-file defect, reported not fixed ·
your own cross-week token-overlap scan (the strict gate does not see parent-vocabulary, rationale or
hint-template collisions, and every author so far found 20–50 hits on a first pass).
