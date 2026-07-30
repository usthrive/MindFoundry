# Polish-Pass Spec — surface-realism layer (Phase A → Opus executes as Phase B0)

**Written:** 2026-07-27 (Fable 5, Phase A). Companion to `PEDAGOGY-CEILING-REVIEW.md`.
**Scope:** the four L24 defect classes (money rendering, unreduced real-world fractions, cross-week
context convergence, duplicate warm-up formats) **plus three new classes found in the Phase-A read**
(grammar agreement, noun–predicate mismatch, comma-less big numbers) and one pedagogy-polish item
(F1/F6 from the ceiling review), because it regenerates through the same pass.
**Discipline:** every item is a **library fix AND a gate** wherever both are possible — regression must
be structurally impossible, the same discipline that holds Level D at 100%.

---

## 0. Where each gate LIVES (seed-invariance ruling — read first)

L19 stands: a *generation-time preflight* may only assert **blueprint-structural** facts (declared
generators, declared contexts, flags) — never facts of drawn operands, or some learner's seed throws.
Surface-rendering rules, however, are facts of *drawn* text. Therefore this pass introduces a split:

- **Preflight (assemble.ts, throws at pack-gen):** only the blueprint-structural checks below (P3
  context declarations, P4 warm-up template distinctness, P7 wrapper shape).
- **QG-12 family (validator.ts, runs in `bb-verify-packs` over the full seed sweep, CI-blocking):**
  the text-scanning checks (P1/P2/P5/P6). They are backstops; the **formatting library is the actual
  guarantee** — templates that can only interpolate quantities through the formatters cannot emit a
  violation at any seed. A QG-12 hit in CI means a template bypassed the formatters; fix the template.
- QG-12 runs **report-only for the pinned fixtures** (A15/B14/D17) exactly as QG-11 does.

New library module: **`lib/format.ts`** — the single interpolation authority:
`fmtMoney(cents)`, `fmtInt(n)`, `fmtFrac(n,d,role)`, `countNoun(n, unit)`, `an(word)`.
Kit rule (add to FANOUT-AUTHORING-KIT §A): **prompts never interpolate a raw number/unit/price via
`${…}` directly; they call the formatter.** Reviewers reject any new template that doesn't.

---

## P1 — Currency & units rendering (library fix + QG-12a)

**Defect:** `"$0.1 of a dollar"`, `"saved $0.5 … spent $0.2"`, `"added $0.7 and $0.40"` (mixed inside
one prompt), and a modeled guided example teaching with `"a $0.4 pencil"` (D12-GE-04). D14 is equally
affected (`$2.7`, `$4.1`, `$27.5`). Also style split: D21 writes "7 dollars" while D12 writes "$…".

**Library fix:**
1. Money is represented as **integer cents** (`type Cents = number`) at the template-param level for
   every money-context generator; `fmtMoney(cents)` renders it. Rules:
   - Any amount with a fractional dollar part renders **exactly 2 decimals**: `$0.40`, `$2.70`.
   - Whole-dollar amounts render `$7` by default; **if any money amount in the same item has cents,
     ALL money in that item renders 2 decimals** (`$7.00` next to `$0.40`).
   - `"$X of a dollar"` is forbidden — the `$` sign and the phrase "of a dollar" are mutually
     exclusive. D12's decimal-of-a-dollar items say "A coin is worth 0.10 of a dollar" (no `$`), or
     "…worth $0.10" (no "of a dollar"). Note the **bare mathematical decimal is still the lesson
     object in D12** — "write 0.4 as a fraction" stays `0.4`; only *price/amount-of-money* surfaces
     take currency formatting.
2. `answers.ts::checkAnswer` and `acceptableForms` accept `0.4 / 0.40 / $0.40` as equivalent for
   money-valued answers (verify the numeric-equivalence path already does; add forms where authored).
3. Unify the prose style rule: D-band uses `$` notation; "dollars" as a word is fine in a *question*
   clause ("…find its value in dollars") but amounts render with `$`.

**Gate — QG-12a (validator scan over all child/parent-facing prose + acceptableForms):** flag
`\$\d+\.\d(?!\d)` (one-decimal money), `\$\d+\.\d{3,}`, and `\$[\d.]+ of a dollar`. Also flag an item
mixing `$X.YY` and `$Z` (whole) in one prompt (the all-or-none cents rule).

## P2 — Context-sensitive fraction simplification (library fix + QG-12b)

**Defect:** "a recipe uses 2/4 cup of flour", "cuts off 2/4 of the ribbon", "2/4 of them are planted",
"recipe fills 2/4 of a tray" (D9/D10/D11/D18). **The blanket rule is explicitly wrong** — D9's
comparison items ("Which is greater: 1/2 or 2/6?") and rename tasks NEED unreduced fractions; that IS
the lesson.

**The rule (three roles, decidable at template/situation level — no LLM judgment):**
1. **`lesson-object` — preserve unreduced.** The fraction is the thing being renamed/compared/judged:
   `d_frac_equiv_*` fill-ins and their situation wrappers' *target* fraction, `d_frac_compare_*`
   operands, error-analysis about renaming, ASN items about fraction forms.
2. **`partition-anchored` — unreduced is CORRECT when the prose physically instantiates the
   denominator.** "A path is split into 6 equal legs and a bench sits at the 2/6 mark" — the 6-way
   split exists in the story, so 2/6 is the honest name. Keep.
3. **`quantity` — must be in lowest terms.** A free real-world amount with no instantiated partition:
   flour in a recipe, a length of ribbon cut, a share of plots planted. A recipe card says 1/2 cup,
   never 2/4 cup.

**Library fix:** situation/multistep drafts declare `fracRole` per interpolated fraction (default
`quantity`); `fmtFrac(n,d,role)` reduces for `quantity`, preserves otherwise. For `quantity` draws,
reduce *after* drawing (answer math is already exact and reduction-safe in `compute.ts`; the equiv-task
draws are structured `d2 = k·d1` and are `lesson-object`, untouched). Check each affected generator's
operand space still satisfies its guards after reduction (dedup/TupleGuard).

**Gate — QG-12b:** scan word-problem/situation prose for `n/d` with `gcd(n,d) > 1` in items whose
generator/draft is not tagged `lesson-object`/`partition-anchored`. (Equivalence-week D9 keeps its
warm-up "1/2 or 2/6" — that item's generator is `lesson-object` by template.)

## P3 — Cross-week context rotation + situation-frame binding (library fix + preflight)

**Defect (a):** same-archetype weeks converge on the same context — D5/D8/D15 all seats/rows/theater;
D6/D7/D16 all tables/buses/boxes. A human spotted it in minutes. **Defect (b):** nouns and predicates
draw independently — "1/4 of the marbles are ripe" (D9-D2-06).

**Library fix — `situations.ts` context-frame registry:**
1. A **frame** binds noun(s) + verb/predicate set + unit + adjective pool *jointly*: `{id:'orchard',
   nouns:['apples','pears'], predicates:['are ripe','are picked'], …}` vs `{id:'marbles',
   predicates:['are blue','are striped']}`. Draws happen *within* one frame — "ripe marbles" becomes
   impossible. (Fixes b.)
2. **Per-archetype frame pools of ≥6**: multiplication/division draws from {seating, packing/crates,
   tiling, baking-batches, garden-plots, track-laps, bookshelf, ticket-sales, orchard-harvest,
   bead-craft}; decimals/money from {shop-change, allowance-saving, measurement-jug, mass-scale,
   race-times}; fractions from {recipe, ribbon/cloth, trail/path, garden-bed, pizza/tray, water-jug}.
   Authoring the pools is real prose work — Opus should write them with the same warmth bar as the
   D corpus, not as noun lists with one verb.
3. **`contextLedger(level, week)`** (extend `lib/ledger.ts`): the primary frames consumed by prior
   same-family weeks. Blueprints declare `primaryContexts: FrameId[]` (the frames used by ≥2 core
   items). **Preflight throws** if a declared primary frame matches either of the last two
   same-family weeks' primaries (rotation, not permanent ban — with ≥6 frames per pool the cycle is
   comfortable). This is blueprint-structural → seed-invariant → safe as a generation-time throw.
4. **Placement spacing (ceiling F4):** preflight also asserts, per blueprint: a generator's two core
   uses sit on different, non-adjacent days; Day 4 uses ≥3 distinct frames.

**Level-D repair:** re-assign primaries — D5 seats (keeps the area-model "rooms" anchor), D8 packing/
crates, D15 ticket-sales/bookshelf; D6 sharing-craft (beads/cards ok), D7 buses/tables (its anchor
stories), D16 orchard/track. Only the situation wrappers' prose changes; params/answers untouched.

## P4 — Warm-up format variety (preflight + kit rule)

**Defect:** two `d_mul_v1` warm-ups in one day — D6 day 2, D8 day 1, D15 days 1+2, D16 days 1+2.

**Fix:** preflight (blueprint-structural): within a day, retrieval warm-up slots must use **distinct
templateIds**; across the week, ≥3 distinct warm-up formats (facts / fill-in / compare / mini-story).
Blueprint repair for the four weeks: swap one duplicate for a different prior-skill generator (D8/D15/
D16 have add/sub/round/compare available; keep sources strictly-prior per BB-G8). Kit §C gains the
rule so fan-out authors satisfy it by construction.

## P5 — Grammar agreement (library fix + QG-12c)

**Defect (new, Phase-A):** "Tom pours 1 liters", "1 marbles" (prompt AND acceptableForms), "a 8 cm
strip" ("a" before vowel-sound numeral).

**Library fix:** `countNoun(n, unit)` → "1 liter" / "13 liters" (irregular table for the small unit
lexicon: box/boxes, bus/buses, inch/inches…); `an(next)` → "a"/"an" by vowel-SOUND including numerals
(8, 11, 18, 80…). Route all `${n} ${unit}` and `a ${x}` interpolations through them — including the
**answer-assembly path** that builds `acceptableForms` ("1 marbles" came from there). Optionally floor
juice-pour-style draws at 2 where a 1-unit story reads oddly; grammar fix is the requirement, the
floor is taste.

**Gate — QG-12c:** scan prose + acceptableForms for `\b1 (<unit-lexicon>)s\b` and `\ba (8|11|18|8\d)\b`.

## P6 — Large-number formatting (library fix + QG-12d) ⚠ touches guards — sequence carefully

**Defect (new, Phase-A):** D1 — the place-value week — *teaches* "read big numbers in groups of three"
and writes 507,036 in its own script, then prints every item operand bare: 433606, 517634, 733695.
The "comma-free surfaces for clean tokenization" engineering choice is overriding the concept being
taught, in the one week where formatting IS the content.

**Library fix:** `fmtInt(n)` inserts thousands separators for n ≥ 10,000 in child/parent-facing prose
(C+ bands; A/B never reach 10k). **Prerequisites, in order, before flipping the formatter on:**
1. `checkAnswer` numeric paths strip commas from child input and keys (accept "460000" and "460,000").
2. `surface.ts` numeric-token signatures normalize commas (else QG-1 freshness / QG-4 isomorph
   signatures fracture). 3. QG-5's expression parser and QG-11(b)'s anchor matcher tolerate grouped
   literals. 4. Re-run the full verify sweep. This ordering is mandatory; do it as its own commit.

**Gate — QG-12d:** flag any `\d{5,}` bare integer in child-facing prose (C+ bands). Report-only for
one build while the formatter lands, then blocking.

## P7 — Metacog wrapper + error-analysis prompt polish (library fix; from ceiling review F1/F6)

In this pass because it's a `metacog.ts`/`erroranalysis.ts` template change that regenerates Level D
with everything above. (a) `withEstimateFirst` prefix becomes an **eliciting question** ("Before you
solve: will the answer be more than an even split, or less? Decide why, then solve.") — it must never
state the structural reason or name the move/operation the item tests; provide 2–3 phrasings keyed by
`(a+b) % pool.length`-style param-keying (no new rng draw — same Tier-A discipline as hints). The
verbal-benchmark parameter each week supplies moves from the prefix into the **rung-1 hint**.
(b) `erroranalysis.ts` prompt templates show the student's *work/claim only* — the wrapper never emits
"ignoring that…"-style diagnosis clauses; the diagnosis is the child's answer. Preflight (structural):
the EA prompt template id used must be from the claim-only set.

---

## Execution notes for Opus (Phase B0)

1. **Order:** P5+P1 (format.ts core) → P2 → P3 → P4 → P7 → P6 (last — it touches guards/validator).
   Correctness gate GREEN after each; full 200-seed self-verify per touched week.
2. **Bit-stability is NOT expected** — this pass deliberately changes surfaces across most of Level D.
   That is fine: determinism (same seed → same pack) is re-established at the new content, and
   `CONTENT_VERSION` bumps to 1.2.0. What must hold: correctness gate 0-fail, QG-11 clean, fixtures
   pinned, no `authorMeta` leaks.
3. **Re-run the style gate on all 24 D weeks after the pass** (the LLM judge reads the changed prose).
   Expect ≥ the current 23/23; investigate any regression — it means a polish change damaged voice.
4. **QG-12 regression fixtures:** add deliberately-broken mini-fixtures (a `$0.5` prompt, a `2/4 cup`
   quantity, a "1 liters", a bare `433606`) to the QG-11 test harness style, proving each scan fires.
5. Commit checkpoint at pass end (pathspec-only; present the commit plan to the user first, per R4).
