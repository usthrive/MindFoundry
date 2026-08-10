# Fan-out Authoring Kit — Levels A, B, C, E

**Companion to `FANOUT-AUTHORING-KIT.md`** (the Level-D kit, still normative for everything not
overridden here) and to `FILL-ARCHITECTURE.md` (which carries the 96 per-week recipes: §3 Level A,
§4 Level B, §5 Level C, §6 Level E). Read your level's recipe row before you write a line.

**Reference exemplars:** `weeks/d04.ts` (the v2 architecture), `weeks/a01.ts` (the band-A shape:
figures built from the item's own drawn values, drawable-noun pool).

---

## A. What B1.2 changed, and what it means for you

The assembler used to be Level-D only. It is now level-parameterised, and the pedagogy gates are
keyed per level. Three consequences for your blueprint:

```ts
import { makeGe, makeWeekBuilder } from '../lib/assemble';
const ge = makeGe('E');                 // ids read E13-GE-01, not D13-GE-01

export const buildE13 = makeWeekBuilder({
  level: 'E',                           // REQUIRED for every non-D week
  week: 13,
  conceptId: '…',                       // must match content/catalog.ts for this cell
  …
  pedagogyContract: 'v2',
  conceptualAnchor: '…',
  conceptFamily: 'operation' | 'place-value',   // picks the §6.1 multi-step row
});
```

- `level` defaults to `'D'`. Omit it and your week is assembled as a Level-D pack with the wrong ids
  and the wrong band. **Always set it.**
- `conceptFamily` replaces the hard-coded Level-D conceptId lookup. `'place-value'` (classification /
  place-value / geometry-property concepts) needs **≥1** week-wide multi-step; `'operation'` needs the
  full row. If the concept genuinely cannot carry a within-concept two-step, declare `'place-value'`
  and compose with a strictly-prior-week skill (`usesPriorSkill: true`), documenting it in
  `deepeningDelta`.
- Band A carries its parent strip on **Day 5 only**, like every other band: pass `teacherNoteStrips`
  with four `undefined` entries and the strip fifth. (Rev 1 of this file said "every day"; the
  validator's S-SCHEMA rejects a strip on Days 1–4 and `PuzzleGrove.tsx` renders Day 5's, hardcoded,
  so a five-strip week fails `bb-verify-packs` at every seed and would put four strips nowhere.
  Ruled Day-5-only 2026-08-09 and amended in FILL-ARCHITECTURE §1 to match — see §E item 3.)

## B. Your level's gate profile (`lib/pedagogy.ts` → `GATE_PROFILE`)

| Gate | **A** | **B** | **C** | **E** |
|---|---|---|---|---|
| Multi-step week-wide / Day-4 | **OFF** | 2 / 0 | 2 / 0 | 2 / 1 |
| Instead: items carrying a FIGURE, per day (Days 1–4) | **≥1** | — | — | — |
| Discrimination in Days 2–3 | ≥1 (perceptual) | ≥1 | ≥1 | ≥1 |
| Distinct `situationType`s | off | ≥2 | ≥3 | ≥3 |
| Error-analysis item | ≥1 (puppet form) | ≥1 | ≥1 | ≥1 |
| Metacognition (item + modeled in script) | **off** | required | required | required |
| Rung-1 must be an orienting question | **off** | required | required | required |
| Distinct warm-up formats week-wide | off | ≥3 | ≥3 | ≥3 |
| Puzzle ≠ a Day-1 structure | off | required | required | required |

The hint-ladder **dedup** runs at every level regardless (no ladder template more than twice across
non-retrieval core). It is seed-invariant only if your hints are fixed, role-based, name-free and
number-free — this is the rule that breaks real learners' packs when ignored.

## C. The dose budget — do the arithmetic before you pick day sizes

`preflight` throws unless every day lands in **5–15 minutes**, computed as:

```
minutes = 2.5 + Σ_items ( base + 0.25 × difficulty )
base: A 0.8 · B 1.0 · C 1.0 · D 1.1 · E 1.2
```

That ceiling bites at the top levels and it is easy to trip:

| Level | 6 items | 5 items | 4 items |
|---|---|---|---|
| **E** (base 1.2) | avg difficulty **≤ 3.5** | ≤ 5 | ≤ 5 |
| **C** (base 1.0) | ≤ 4.3 | ≤ 5 | ≤ 5 |
| **B** (base 1.0) | ≤ 4.3 | ≤ 5 | ≤ 5 |
| **A** (base 0.8) | ≤ 5 | ≤ 5 | ≤ 5 |

So a Level-E day of six difficulty-4 items **throws** (15.7 min). Either drop to five items on the
hard days or keep six-item days at difficulty ≤3. Suggested shapes: **A** 4/4/4/4/3 · **B** 5/5/5/5/4 ·
**C** 6/6/6/5/4 · **E** 6/6/6/5/4 with the difficulty ramp on the shorter days.

Retrieval share must be **20–30%** of daily items. The only exemption is **A·W1**, the
curriculum-graph origin, which has no earlier week to retrieve from.

## D. Which generator families serve your level

| Level | Families | Notes |
|---|---|---|
| **A** | `earlynumber` (G8) + `figures` | Everything is pictorial. No sprint — a timer at band A is a hard fail. |
| **B** | `earlynumber` (reuse for B1–B5), `clock` (B12/B17), `money` (B16), `stats` (B23) + the Level-D whole-number generators in `items.ts` | Sprint begins: ungraded, self-referenced. |
| **C** | `items.ts` whole-number/fraction generators, `clock` (C18), `stats` (C23) | Inverse-start multi-step enters at C5. |
| **E** | `ratio` (G4), `integers` (G5), `algebra` (G6), `stats` (G7), plus `items.ts` | Full D contract + the F1–F6 ceiling lifts. |

Every computational item must name a `templateId` registered in its family's own defs array. An
unregistered id silently skips the QG-5 audit, so `bb-verify-packs` asserts every id resolves.

## E. Level-specific hard rules

### Level A — a different pedagogy, not a scaled-down D (FILL-ARCHITECTURE §3)
- **≤10 words per prompt, Tier-1 vocabulary.** The child hears it; they do not read it.
- **No timers, no speed, ever.** `sprint: null` (the assembler throws otherwise).
- Answers are tap/circle/choose with oversized targets — prefer `choice-key` and small numerics.
- **Error-analysis is "help the puppet."** A named puppet double-counts or writes 31 for thirteen; the
  child points at the slip. Avoid the word "wrong" even here. The truth is still `verifyFor`-computed.
- **Discrimination is perceptual and it is real mathematics:** conservation (longer row ≠ more),
  scattered-vs-row, 6/9 flips, 13-vs-31, teen-vs-ty, bigger ≠ heavier.
- **Every working day shows a picture** — that is the gate that replaces multi-step.

#### A-band lessons from the A1 exemplar (2026-08-09) — these cost real time, read them

1. **Budget LADDERS before items.** A ladder may appear ≤2× across the non-retrieval core, so a
   19-item week needs ≥10 DISTINCT ladders — in a band whose core form is one generator used many
   ways. This decides the week's shape and nothing else in the kit says it. Wrap family generators
   in a local `withHints` closure (no rng draw, prompt untouched): it buys the ladder budget and
   stops all 24 A weeks shipping identical hints.
2. **The ≤10-word law is per SENTENCE, not per prompt.** `earlynumber`'s `ask()` caps prompts;
   `bb-readability` measures every sentence on every child-facing surface. Two different laws — write
   to the gate's.
3. **Ship the teacher's-note strip on DAY 5 ONLY**, whatever §1 of FILL-ARCHITECTURE says. The
   validator enforces Day-5-only (`validator.ts` S-SCHEMA) and `PuzzleGrove.tsx` renders
   `getPackDay(pack, 5).teacherNoteStrip` — hardcoded. Five strips would put four of them nowhere
   (the L27 class). The every-day strip needs a renderer first; it is an open decision.
4. **`[image: …]` and the figure `alt` are the same sentence at band A** (`speakablePrompt` prefers
   the alt), so any narrative the picture cannot show — "these were in a row a moment ago" — must
   live in the QUESTION, not the scene.
5. **With a 1–5 range, `drawUniqueItem`'s one-token signature will pin your mastery slots.** A1
   measured a Form-A slot keyed "2" on 77% of draws with a permanently-dead option, because a
   one-token prompt signs as `type|1tok|n` and a 1–5 week has 4 counts for 7 items. Sign on
   `{count, noun}` via `drawFresh` (4 → 36 surfaces) and **measure what is SERVED**, not what you
   meant to draw (L39, kit §E2.9a).
6. **Rotate the PAIRING, not the numbers.** Draw which pair of honest miscounts is offered — both
   below, one either side, both above — so the truth lands low, middle and high in turn. Drawing the
   pairing from `n` spreads the rank but ties it to the number, so recognising the count still tells
   you the rank. A1 measures ≤38% at the top rank in every slot after this.
7. **Read your generated week.** A row of one duck, "colour the apple box" with no box drawn, and a
   `reteachPointer` lifted verbatim from a sibling week all passed every gate and died on reading.

### Level B
- Gentle two-step only; the bridge (8+5 via 8+2+3) IS the two-step in B5.
- Metacognition in its intro form: "will it pass 10?" predictions.
- Error-analysis is written-lite: one sentence.

### Level C
- Inverse-start multi-step enters at C5 and is the week's point, not a garnish.
- C is where sharing-vs-grouping (C9) and area-vs-perimeter (C21) live — the discriminations are the
  content, not an add-on.

### Level E
- Full D contract plus the ceiling lifts: inverse-start, distractor-quantity, check-back native.
- The four R-cells (E12 prove-in-general, E19 measure-π lab, E22 build-a-histogram, E23 fair-game
  design) ship a **computable core plus a flagged open part** — `manual-review` /
  `short-text-keyword`, exactly as Level D does. Never fake a computable answer for an open task.

## E2. Traps found by the weeks already authored — read these, they cost real time

1. **`mistakeBank` requires `distractorRationale` on EVERY entry**, not only the entries that back a
   live distractor. It is a schema rule in `validator.ts` (S-SCHEMA), not a pedagogy one, and it is
   the most common first-run failure.

2. **The metacognition wrapper does not change the hint ladder.** So serving the same generator both
   raw and wrapped in `withEstimateFirst` yields two IDENTICAL ladders, which counts twice against
   the "no ladder more than twice" dedup. Rule: a generator that is used through a metacog wrapper
   should be reachable ONLY through the wrapper.

3. **⚠ THE VERIFY LIBRARY CANNOT EXPRESS EVERY MISCONCEPTION THE RECIPES NAME.** Three of the first
   five Level-C weeks hit this independently, so expect it. The existing templates vary the
   OPERATION over one fixed operand pair (`d_verify_binop_misconception_v1`) or the fraction move
   (`d_verify_frac_v1` / `d_verify_dec_v1`); `d_verify_ratchain_v1` is correct-only. So there is no
   template for a two-step step-order slip, a distributive double-count (2ab), or "reports the
   denominator" — and no honest way to derive one from story-native operands.

   **The rule when you hit it: NEVER fabricate the wrong number.** Take one of these, in order of
   preference:
   - **FIRST, look for an algebraic identity that makes it derivable after all.** C4 was told the
     borrow-across-zero slip could not be generated, and found that it can: with a round-hundred
     minuend `a = 100h` and a two-digit `b = 10t + o`, writing each column smaller-from-larger gives
     `o|t|h` = `100h + 10t + o` = **exactly `a + b`**. So `{a, b, op:'-', wrongOp:'+'}` produces the
     recipe's own misconception, code-derived, across two zeros. Spend ten minutes here before
     reframing — the operation-swap template covers more misconceptions than it looks like it does,
     and the recipe's intended item is always the better one.
   - **Reframe the item so the misconception value IS genuinely computed.** C17's is the model: for
     "1/3 of a jar of 15 pebbles", it poses the COMPLEMENT (how many are left, 15−5=10) so that the
     student's shown error, 15÷5 = 3, is a real division output — literally the number of equal
     groups, which is the denominator. Nothing invented, recipe intent preserved.
   - **Move the misconception to where it can be shown honestly** — a discrimination option or an
     Always/Sometimes/Never claim — and give Day 5 a complementary slip that IS derivable. C13 did
     this for the double-count.
   - Document the choice in the file header, not buried in a comment.

   Adding the missing transforms to `compute.ts` is scheduled work; until then this is the contract.

4. **Guard every draw against degenerate cases, and nudge DETERMINISTICALLY** — never a redraw loop.
   A loop consumes a variable number of rng draws, which makes every later item in the pack depend on
   this one and breaks seed-stability (L19). One deterministic step is almost always enough.

5. **A figure on an assessed item asserts a GIVEN, not the answer.** The proven pattern (c06, c05):
   show ONE group and assert the group SIZE, or mark only the quantity the child was handed. Full
   worked journeys belong in the script and the guided examples, where the answer is already on the
   page.

6. **Write your hints in YOUR week's voice.** You are told to copy an exemplar's SHAPE; copying its
   hint sentences is plagiarism the per-pack gates cannot see (they dedup within a week, not across
   the corpus). `scripts/bb-cross-week-test.ts` reads every pack at once and reports shared ladders
   and shared prompt shapes — run it after your week lands.

7. **A computable answer is not the same as an askable question.** C4's prediction item asked how
   much trading `601 − 462` needs — which has two defensible answers (two columns get broken, but it
   is one cascade). The arithmetic was correct and the question was unanswerable, and no gate can see
   that: the gates check that the key matches the params, not that the prompt admits one reading.
   Found by writing an independent simulator and disagreeing with their own code. When an item
   classifies or counts something structural ("how many trades", "how many steps", "which comes
   first"), state the quantity so precisely that the empty/degenerate case still has one answer.

8. **Re-check context availability at the END of your week, not the start.** In a parallel fan-out
   the sibling weeks land WHILE you write: one author began when five of their neighbours did not
   exist, and by the time they finished their stamp-sheet, tulip-bulb, domino, guppy, patchwork and
   greenhouse scenes had each been claimed by a week written alongside theirs. Scan the weeks
   directory for your nouns immediately before reporting done, and re-dress what collides. A repeated
   real-world frame across two weeks is the corpus's documented weakness (L24), and it is invisible
   to every per-pack gate.

9a. **A metacognition probe must be near a coin flip, and DRAWING THE SIDE FIRST IS NOT PROOF.**
   b16 shipped a probe that was 70/30, so the scaffold taught the guess instead of the commitment it
   exists to demand. No gate can catch this — a probe has no answer key — so measure the SERVED split
   yourself and report it. Two weeks drew the side first and were still biased:
   - **b22** measured 67%, then 56%, then 57.6% over three attempts. `drawUniqueItem` retries when an
     item's operand surface collides with another in the same pack, and a retry is not neutral: it
     discards the draw and takes the next, so values that collide often are suppressed. A whole of 8 was
     served 85 times against 125–167 for the rest, because 8 and 4 are everywhere in a halves week. It
     settled at 53.4% by using mid-range wholes only — dodging the mechanism.
   - **b09** measured 47.9% for the same reason and found the better fix: **make both sides print the
     SAME NUMERALS.** It replaced two pools with one (`[start, bigStep, smallStep]`) and let the probe
     choose only *which* change arrives. With identical numerals on both branches the freshness guard has
     nothing to prefer, so the mechanism is removed rather than avoided: 50.1% over 5000 draws. It then
     found the same defect in a second generator (45.0% → 49.5%).

   Prefer b09's construction — but it is NECESSARY, NOT SUFFICIENT, and b11 measured why. Applied
   naively, "every row is decided by the flip" means exactly one of the two amounts crosses on every
   row; and since crossing climbs with size, **"the bigger one came first" then answers the probe 100%
   of the time.** The numerals matched and the page was still free. b11's pool therefore carries
   both-cross and neither-cross rows in equal number, with flip-decided rows capped at half:

   | pool | probe split | size habit scores |
   |---|---|---|
   | every row decided by the flip | 50% | **100%** |
   | flip rows uncapped | 48.6–49.8% | 70.4–71.4% |
   | capped at the class | 48.8–50.0% | 65.9–66.8% |
   | **capped at half (shipped)** | **49.5–50.6%** | **59.6–60.3%** |

   So measure the probe's split AND at least one blind habit that could answer it. A 50/50 answer
   distribution is not the same as an unguessable question.

   And note the general lesson, which is not about probes: **a balanced draw can still produce an
   unbalanced page once a uniqueness filter sits between them.** Measure what is served, never what you
   intended to draw.

9. **The metacognition probe now stands as its own sentence — but keep it tight.** Historically
   `lib/metacog.ts` welded its lead-in onto the probe (an em-dash on `withEstimateFirst`, later a
   colon on `withCheckBack`/`withReasonableness`), so a probe of 8+ words broke the Level-B/C
   15-word ceiling however careful the rest of the pack was; two authors measured it independently,
   and a C10 check-back authored at 18 words shipped as a 22-word sentence. As of 2026-08 all three
   wrappers emit CLOSED lead sentences, so the probe/check/benchmark carries the full ≤15-word
   budget on its own. Still write it as one tight question — "will ten cubes reach the tail?" is
   the shape that works — and remember it is sentence-cased automatically (author it lowercase).

10. **Read your own generated week before you report done.** Every author who did this found things no
   gate did: a 9-metre sandpit, "Every sack holds 10 sacks", a bow described as a length, hints
   plagiarised from a sibling week, a discrimination whose grammar leaked the answer. The gates prove
   the mathematics; only reading proves the content.

11. **Can a child score your item WITHOUT doing the mathematics?** Ask it of every discrimination and
   every mastery item, then MEASURE it — `npx tsx scripts/bb-answer-entropy-test.ts --level <L>` groups
   each slot across seeds and reports a keyed answer that never moves, an option that is never correct,
   and the answer that is always the Nth thing named in the prompt. Eight real defects were found this
   way, four of them in levels already certified. Two shapes to avoid when you draw:
   - **A dead option.** If an option is offered every time and correct never, a child learns to strike
     it out and your three-way page becomes a coin flip. Either widen the draw so it is sometimes right,
     or — if it is FALSE UNDER ANY DRAW because it states a named misconception — add it to
     `DECLARED_LURES` in that script *with the argument for why no draw can make it true*.
   - **A relational invariant.** The keyed text can vary on every seed and the item still be guessable:
     b12 named three events and always drew a half-past clock, so the answer was the second event on the
     page 800 times out of 800. Rotate the *relation*, not just the numbers.
   - **The answer sitting at a FIXED RANK among the numbers on offer.** State it as rank, not as
     "undershooting" — the first version of this rule said undershooting, an author correctly defended
     against it by making the distractors BRACKET the answer on every draw, and that made "pick the
     middle" score 100% in a mastery slot. Same defect, mirrored.
     - all distractors below → "pick the biggest" wins. The commonest case, because "stop early" and
       "add instead of multiply" misconceptions are all smaller than a product. 23 slots still carry it
       (C6, C7, C11, C20, C23, D4 and others).
     - one below and one above on EVERY draw → "pick the middle" wins.
     The fix for both is the same: have **enough honest wrong values that the PAIRING can rotate**, so
     the answer lands low, middle and high in turn. Two more named misconceptions is usually all it takes
     — b04 added "counted only the first move" and "counted only the second" beside its two turn-round
     slips; b13 added "the traded ten counted twice" and "the tens added with the ones forgotten". Then
     measure: `bb-answer-entropy-test` reports `CONSTANT_NUMERIC_RANK` at any position, not just the ends.
     A comparison item ("which is greater?") is exempt — it keys the extreme by definition, and the gate
     knows that.

12. **Two verify-library facts already proved, so you do not have to.** Both came from authors who
   proved impossibility properly (L36) instead of reframing on reflex:
   - **`e_verify_int_compare_v1` is a structural NULL at Level B.** It is the library's only
     comparison-misconception transform, but for positive `a, b` the larger magnitude IS the larger
     number, so its own `wrong === correct` guard throws on every draw a two-digit week can make.
   - **A "picks the wrong one of the two givens" misconception is not derivable from
     `d_verify_binop_misconception_v1`.** It varies the OPERATION over a fixed pair, so producing a
     given pair `{A, B}` as `{correct, wrong}` forces operands `((A+B)/2, (A−B)/2)` — for 39 and 41
     that is `(40, 1)`, a pair with no referent in the story. That is fabrication with extra steps.
     Relocate the misconception to a discrimination option, an ASN claim and the mistakeBank (§E2.3),
     and give Day 5 a *derivable complementary* slip instead — b03 used `{op:'+', wrongOp:'-'}` on a
     ±10 step, constructed so repairing the arithmetic FLIPS the comparison, which is why it earns its
     place in a comparing week rather than sitting beside it.

13. **The strongest plagiarism attractor is the same recipe cell ONE LEVEL UP, and `--strict` cannot see
   it.** `bb-cross-week-test --strict` compares hint ladders and prompt shapes. It does not compare
   `reteachPointer`s, header declarations, parent lines or rationale phrasing — and that is exactly
   where borrowing lands: b24 found 16 borrowed formulas mostly pulled from **c24**, one verbatim at
   1.00 similarity; b03 found 10 including a 1.00 match with b24. Every author who ran their own
   token-overlap scan of their strings against the whole weeks directory found something; every author
   who relied on `--strict` alone would have shipped it. Run your own scan, and judge each hit as voice
   (rewrite) or API shape (keep).

## F. The rules that do not change (from the Level-D kit §A)

1. **Answers are code-computed, never authored.** A wrong key must remain structurally impossible.
2. **Seed-invariant hints** — fixed, role-based, name-free, number-free. Reuse each generator ≤2× in
   the daily core (warm-ups and mastery are exempt).
3. **Distinct names**, drawn fresh per item; never hardcode a name that is also in the draw pool.
4. **Both gates.** 200 seeds clean, then the style gate — plus the answer-entropy sweep (§E2.11), which
   neither of the other two can replace.
5. **Child-safe.** No %, no red, no "fail", no "Review" aimed at the child. The only "wrong" allowed is
   inside an error-analysis task about a hypothetical third party (a puppet, at band A).
6. **`lib/format.ts` is the single interpolation authority** — a prompt never interpolates a raw
   quantity, price, unit or article with a bare `${…}`.
7. **A figure is built from the item's own drawn values** (`lib/figures.ts`), and it must never hand
   over the answer the item is asking for. Scaffolds like `showPairs` / `markExtra` / `coverStyle`
   default off for that reason — turn them on to MODEL a strategy, never on an item that assesses it.

## G. Self-verify — run before reporting done

Import YOUR OWN builder, never `packGenerator` (it imports every sibling week, so a sibling being
written in parallel would spuriously break your check). Replace `<L>`/`<WEEK>`:

```bash
cd frontend && npx tsx -e "
import { build<L><WEEK> } from './src/modules/best-brains/generator/templates/weeks/<l><week>';
import { validatePack } from './src/modules/best-brains/generator/validator';
let bad = '';
for (let i = 0; i < 200; i++) { const s = i * 13 + 3;
  try { const p = build<L><WEEK>(s, '1.2.0'); const r = validatePack(p, { contract: 'v2' });
    if (!r.valid && !bad) bad = 'INVALID seed ' + s + ': ' + r.violations.map(v => v.gate + '@' + v.path + ' ' + v.message).slice(0, 3).join(' | '); }
  catch (e) { if (!bad) bad = 'THROW seed ' + s + ': ' + e.message; } }
console.log(bad || '<L><WEEK> SEED-INVARIANT: 200 seeds, 0 throws, 0 invalid');"
```

**Run `npx tsc --noEmit` to completion and read its whole output — do NOT rely on
`tsc | grep <yourfile>` as the only check.** One author's piped grep printed nothing on a run where
their file did have an error, and they nearly reported clean; the error was a dead comparison TypeScript
had narrowed away. Pipe it to a file if sibling weeks are noisy, then grep the file.

Iterate your blueprint until it prints SEED-INVARIANT. **Edit only your own `weeks/<l><week>.ts`** —
never a shared `lib/` file, never `packGenerator.ts`, never another week. The orchestrator wires the
builder in and runs the style gate over the whole level afterwards.
