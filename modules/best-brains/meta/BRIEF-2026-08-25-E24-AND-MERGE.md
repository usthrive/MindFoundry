Author Level E week 24 — the pre-algebra capstone — then take the branch to main.

Repo: /home/usthr/Penta_University/Math_Tutor/MindFoundry
Branch best-brains-content-engine, at 0eccee6, THREE commits ahead of origin/main
(6770b03 is what production serves). Check git log before staging; other sessions
use this branch.

STATE: corpus 115/120. A 23/24 · B 24/24 · C 24/24 · D 24/24 · E 20/24.
E24 is the LAST authorable cell. E18-E20 are blocked on a geometry family — an
owner decision and a shared-library commitment, NOT a week. Do not start it; §D
below asks you for a costed proposal instead. A15 has no generated week at all
(it is served from the pinned fixture mfm-a15.ts) — also not this session.

Read first, in this order:
1. modules/best-brains/meta/HANDOFF-2026-08-25-LEVEL-E.md — §2 (the standing
   finding, now seven for seven), §3 (what E22 and E23 established), §4 (the
   protocol, with three additions that each cost real time to learn), §5 (the
   library's seven open defects). This file is current; the 08-24 one carries a
   superseded banner and its §1 is two weeks stale.
2. modules/best-brains/build/FILL-AGENT-BRIEF.md §4a — GATE_PROFILE.E, every row
   a floor.
3. modules/best-brains/build/FANOUT-KIT-LEVELS-ABCE.md — §B, §C dose arithmetic,
   §E2 (read 2.2, 2.3, 2.7, 2.8, 2.9a, 2.11 in full), §F, §G.
4. modules/best-brains/build/FILL-ARCHITECTURE.md §6 row E24 and §7 (R-lite);
   catalog row is 'pre-algebra-capstone'.
5. weeks/e23.ts then weeks/e22.ts — the two current exemplars, both shipped this
   week. Their headers record the method; e23's decision 7 is the one that
   matters most to you (see §A below).

=== A. WHAT E24 IS, AND WHY IT IS NOT LIKE THE OTHERS ===

Recipe row: anchor "the year as one toolkit" · key multi-step "mixed cross-family
chains" · error-analysis "(mixed)" · discrimination "tool choice unsignalled" ·
Day-5 "exit check + written reflection" · Flag R-lite.
Catalog Day-5: "ANALYZE-style capstone: critique three worked solutions +
vocabulary review".

A capstone's discrimination is TOOL CHOICE UNSIGNALLED — the child must decide
WHICH machinery a problem wants when nothing on the page says. That makes E24
structurally different from every week you have read: it draws from FOUR
generator families at once (ratio G4, integers G5, algebra G6, stats G7) plus
items.ts, and its items must be recognisable as belonging to different weeks
while sitting on one page.

Two consequences, both load-bearing:

  · THE PRE-MEASUREMENT IS BIGGER THAN USUAL AND IT IS NOT OPTIONAL. Seven
    consecutive Level-E weeks have found their recipe-named item defective in the
    library, and E23's was catastrophic (a card offered on every draw and keyed on
    none, which was ALSO the middle option every draw by algebra — strike the
    middle, take the smaller, 90.3%). You will be serving generators from four
    families. Sweep every one you intend to serve, >= 4000 draws, BEFORE you write
    a line. Assume defect until measured.
  · e23's DECISION 7 IS THE WARNING. A design challenge counted E23's mastery
    form before anything was written and found it unfillable — house rules bar the
    discrimination, the error-analysis and the R-flagged task from certifying,
    which left three generators for six slots and zero multi-step items against a
    floor of two. The week would have failed assembly, not review. COUNT THE
    MASTERY FORM FIRST. A capstone is more exposed to this than any other cell,
    because "mixed" invites a shopping list rather than a spine.

=== B. THE PROTOCOL ===

HANDOFF-2026-08-21-LEVEL-E.md §4 verbatim, PLUS the 08-24 addition (measure the
discrimination's rank distribution, not only the mastery slots), PLUS the three
additions in the 08-25 handoff §4, each of which caught something real:

  1. npx tsx scripts/bb-probe-and-rank-test.ts --level E --seeds 60 --selftest
     ALWAYS with --selftest. It proves the detectors still fire against two
     known-defective generators before you trust a clean census. A clean run
     without the control is not evidence.
  2. GIVE EVERY DETECTOR A LIVENESS SENTINEL. Point it at something you KNOW it
     must flag and do not believe a 0.0% until the sentinel reads 100%. E22's
     answer-in-prompt detector read 79.4% on an item whose answer is on the page
     BY DEFINITION; the same bug reads 0.0% against a 100.0% truth on E23's
     error-analysis. It does not degrade — on the wrong prompt shape it reports
     perfection.
  3. VARY THE SEED LATTICE, NOT THE SAMPLE SIZE. Three runs at 800, 1,600 and
     1,200 packs that share a seed prefix are nested samples, not replications.
     E22 chased a phantom skew for an hour because of this.

  PLUS two that E23 added and are not yet in any handoff:
  4. ASSERT EVERY SERVED ANSWER IS POSITIVE AND THE QUESTION IS ASKABLE. E22
     shipped a chain keying a NEGATIVE answer on 8.0% of servings, minimum -10,
     onto a mastery slot. The 200-seed sweep, the validator and tsc all passed it.
     Four lines of script found it.
  5. A GUIDED EXAMPLE'S NUMERALS ARE PART OF THE DRAW SPACE. E23 guaranteed its
     discrimination's key-rank at 33.3/33.3/33.3 by construction and measured
     39.4/31.9/28.7 on the page, on two disjoint lattices. Two guided examples
     used number pairs that were legal cells of that very item, so the
     assembler's echo guard deleted those cells silently — and they were not
     rank-neutral.

Do NOT delegate: writing the week, READING the served week prompt by prompt, or
deciding the final numbers. The served-week read has found real defects in every
week so far, including all five in E23 and all six in E22.

Sub-agents (Fable = design/verdict; cheap models = mechanical sweeps; judgement
stays with you). Cap 2 concurrent — 4GB/2 cores.
  A. Sonnet, FIRST and in parallel: (i) pre-measure every generator E24 might
     serve across ratio.ts, integers.ts, algebra.ts, stats.ts and items.ts,
     >=4000 draws, reporting keyed-answer distribution, option-set count, rank
     among options, never-keyed cards, constant-position rates, and key-in-prompt
     with a digit boundary that does NOT reject a match followed by a full stop;
     (ii) enumerate the real-world nouns already used across weeks/ for whatever
     domains you intend to stage, word-boundary, one line of context per hit.
  B. Fable, DESIGN CHALLENGE before you write: give it the recipe row, your claim,
     your probe, your discrimination design, your day plan AND YOUR MASTERY FORM,
     and A's table. Ask it explicitly whether the six certifying slots can be
     filled, whether the multi-step floor is met, and whether "tool choice
     unsignalled" is discriminable without the tool being named.
  C. Fable, VERDICT after the battery.

Discipline: tsc at most twice, reading the WHOLE output — I overran this in both
E22 and E23 and it cost nothing but sloppiness; batch your edits. Full battery
once at the end (all 16 bb-* scripts, run from frontend/ — they fail from the
repo root). Collision scan AND your own token-overlap scan at the END against the
whole weeks directory, and against e22.ts and e23.ts specifically.

=== C. THEN: HOLISTIC TESTING, BEFORE ANY MERGE ===

With E24 in, the corpus is 116/120 and Level E is 21/24. Do a whole-corpus pass,
not just the per-week battery:

  1. Full battery, all 16, from frontend/. Report the table.
  2. TURN ON --strict FOR THE TWO GATES THAT ARE CURRENTLY REPORT-ONLY and see
     what happens: bb-probe-and-rank-test --strict and bb-cross-week-test
     --strict. The probe-and-rank corpus is clean (0 findings, 0 on a certifying
     slot) so --strict should be free — if it is, say so and propose adding it to
     the standing battery. bb-cross-week --strict compares hint ladders and prompt
     shapes across all 116 weeks and has NEVER been run to failure; expect real
     hits and triage them as voice (rewrite) or API shape (keep).
  3. TRIAGE THE TWO CENSUS GATES rather than reading "census complete" as a pass.
     bb-guessability-test reports 17 flagged configurations and
     bb-answer-entropy-test reports 28 actionable teaching-slot tells. Nobody has
     worked through either list. Produce a ranked triage: which are real, which
     are declared lures, which are structural and defensible. This is where the
     next class of E15-through-E23 defect is already sitting in plain sight.
  4. B14 HAS NEVER BEEN MEASURED BY ANY GATE. A generated b14.ts exists and is in
     WEEK_BUILDERS, but the pinned fixture mfm-b14.ts is what is served, so every
     gate that walks GENERATED_WEEKS skips it. Either un-shadow it (the
     D17-RECIPE-PROPOSAL.md option-A precedent did exactly this for D17 and is
     worth reading) or state in writing that it stays shadowed and why.
  5. npm run build must succeed, and check the bundle has not regressed — b814f6d
     records a constant that once dragged 7 MB into the app shell.

=== D. THEN: MOVE TO MAIN ===

  · gh pr merge --squash. Plain git merge is classifier-blocked in this repo.
  · BINDING, from the PR-#6 memory: RESET THE BRANCH ONTO MAIN AFTER THE
    SQUASH-MERGE. Skipping this has caused real trouble before.
  · NOTHING AUTO-DEPLOYS. A deploy is manual: npm run build, zip dist with
    python's zipfile (zip is not installed in this WSL), POST to
    /api/v1/sites/4c6ca283-d712-41de-aba4-f206bdc0f496/deploys with the token from
    the WINDOWS netlify CLI config at
    /mnt/c/Users/usthr/AppData/Roaming/netlify/Config/config.json
  · Verify the deploy against the live entry chunk hash, the way the 08-21
    handoff §7 records doing it. A deploy nobody verified is not a deploy.
  · Explain-before-commit and explain-before-merge both apply. Commit, push and
    merge are THREE separate instructions.

=== E. WHAT ELSE IS LEFT IN BEST BRAINS — identify, cost, and pursue in this order ===

Everything below is real and open. Bring me a costed list before starting any of
it; do not silently pick.

  CONTENT
  · E18/E19/E20 — blocked on a geometry family. Bring a COSTED PROPOSAL: what
    G9 needs (design, the exact-arithmetic audit compute.ts demands, registered
    template defs, a full battery), how long, and what it unblocks. It is the
    single biggest remaining content item and it has been deferred three times.
  · A15 — the only cell with NO generated week; it is served from a pinned
    fixture whose four broken picture-promises cannot be fixed without authoring
    it. Level A reaches 24/24 only when this is written.

  THE LIBRARY — seven measured defects, all reported and none fixed. Full detail
  and measurements in HANDOFF-2026-08-25 §5. Ranked by damage:
  · stats.eitherOrFiftyFifty — two independent 100% defects, plus prose that
    prints "2 of thems are green" on every draw and has never been seen because
    no week serves it.
  · stats.eaTallestBarRead — names the shortest bar every draw, so "write the
    smallest number printed" scores 100%. The 2026-08-15 sweep repaired exactly
    this in tallestVsAskedBar and left the twin.
  · stats.complementProbability / probabilityOfEvent — key exactly 1/2 on 16.1%
    and 15.8% of draws with no guard, marking a child right for the misconception
    E23 exists to destroy.
  · stats.histogramBinRead — answer is a printed numeral on 22.6% of draws.
  · stats.tallestVsAskedBar — rank middle 42.4%, recorded as repaired.
  · stats.graphRead('difference','pictograph') — keys the key itself on 32.3%.
  · stats.barGraphVsHistogram — dead card, not in DECLARED_LURES.
  · PLUS the one ADDITION worth costing: stat_verify_bin_span_v1, which would let
    a data-display cell ship the error-analysis its recipe names. E22's header
    decision 4 writes out the two identities that LOOK like solutions and the
    measurements that kill them — read it before reopening.
  · requireSimplestForm is dead code; every "simplest form" item is graded on
    value alone. Carried since the original fill.

  INFRASTRUCTURE
  · npm run lint HAS NEVER RUN FOR ANYONE. The script is
    "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
    and there is NO eslint config in frontend/ — not eslint.config.js, not
    .eslintrc.*. This is not "ESLint 9 wants a flat config", as the older
    handoffs say; there is no config at all. Expect a large first-run backlog and
    cost it before starting.

  PRODUCT (outside the content engine, all agreed with the owner and unbuilt)
  · The Level-C times-table card, four agreed changes: open the table by default
    on all 40 table sheets; delete the 12-second auto-close; record tableChecked
    as "visible while answering" (it currently fires only on the 8 covered sheets,
    so the peek signal reads "never checked" on the other 32); and — owner's call
    — stop covering products on the covered sheets.
  · The Kumon return queue — designed, unbuilt, depends on the tableChecked
    repair above.
  · The Fable verdict session on the micro-animations (d46c81d), owed since the
    spec was written.
  · The scratch pad's pen-size picker was removed to fit one row; "More space" was
    measured, cost 40-60px of canvas, and was NOT shipped.

House rules: explain-before-commit (exact pathspec + approval BEFORE git commit);
commit, push and merge are separate instructions; push the branch explicitly
(git push origin best-brains-content-engine:best-brains-content-engine), never
bare; decisions as inline tables and text, never AskUserQuestion modals.

Report: the sweep line verbatim · the tsc result · the battery table · the served
probe split and mastery blind-strategy table with sample sizes · the
discrimination's rank distribution · what reading the week found that no gate
caught · anything you could not build honestly and what you did instead · any
shared-file defect, reported not fixed · the --strict results · the census triage
· the merge and deploy verification.
