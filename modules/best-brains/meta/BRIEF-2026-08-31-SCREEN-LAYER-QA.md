Fix what a child SEES, then find out what else the screen layer is hiding.

Repo: /home/usthr/Penta_University/Math_Tutor/MindFoundry
Branch best-brains-content-engine at `2f46483`, IDENTICAL to origin/main and
deployed (entry `index-DuDawHvl.js`, sha256 `1556e3f4d7771835`, verified against
local dist chunk by chunk). Working tree clean. Check `git log` before staging;
other sessions use this branch.

STATE: content 116/120 cells with a builder, 117 servable. 21 bb-* gates, all
green. `npm run lint` is real and RED (139 errors / 87 warnings, pre-existing).

=== WHY THIS BRIEF EXISTS, IN ONE PARAGRAPH ===

Over three days the owner's children found five defects by using the app. Not
one was caught by the battery, and the battery is not weak — it is 21 gates and
30,120 assertions. It is aimed somewhere else. EVERY GATE TESTS THE PACK; ALMOST
NOTHING TESTS THE SCREEN THE PACK LANDS ON. Measured: 23 screens, 0 component
tests of any kind, and 18 of the 23 screens are not so much as mentioned by any
script. Three gates touch presentation at all — `bb-figure-render-test` and
`bb-animation-test` (figures) and `bb-answerability-gate` (the input surface).
Pagination, screen sequencing, audio, and the pack↔screen seam are unmeasured.

The five defects, all in that blind spot:

  · Ms. Wren cut off mid-sentence — our own 30s watchdog cancelled live speech
    (26.7% of segments) and Chrome kills a long utterance at ~15s (59.2%). FIXED.
  · the longest spoken surface had no picture — 117 of 117 why-segments. The
    field now exists (`Explanation.whyFigure`); ONE week uses it. 185 remain.
  · a chart named in the prompt and never drawn (b03). FIXED for that item.
  · `pageCount` means opposite things at its two ends. OPEN — this brief §A.1.
  · a whole screen built for one warm-up question. OPEN — this brief §A.2.

=== A. THE TWO OPEN DEFECTS ===

A.1 `pageCount` IS READ BACKWARDS, AND IT INVERTS EXACTLY AT BAND A.

  `generator/templates/lib/assemble.ts:58` writes it as ITEMS PER PAGE:
      /** Band A works one operation to a page (E62); the rest carry two. */
      const PAGE_COUNT = { beginner: 1, intermediate: 2, transition: 2, advanced: 2 };

  `screens/PracticePage.tsx:73` reads it as NUMBER OF PAGES:
      const perPage = Math.max(1, Math.ceil(items.length / pageCount));

  At B-E the two readings coincide by luck (2 items ≈ 2 pages) and nothing looks
  wrong. At band A they invert:

      intended   1 item  per page  → ~2.9 pages
      actual     2.9 items per page → 1 page

  So the YOUNGEST children — the ones whose pack sets `oneOperationPerPage: true`
  and whose band law is "one operation to a page" — get every item of the day
  crammed onto a single page. It is the exact opposite of the rule, on the band
  least able to cope with it, and it has never been seen because Levels B-E are
  unaffected in practice.

  THE FIX IS ONE LINE AND THAT IS THE TRAP. Changing `perPage` to `pageCount`
  changes what every band-A child sees. Do not ship it on reasoning: RENDER IT.
  `playwright-core` and `/usr/bin/google-chrome` are both installed and
  `scripts/bb-animation-visual.ts` is the worked precedent — mount the screen on
  a temporary unprotected route, drive Chrome, PHOTOGRAPH the result at band A
  and at band C, and measure. The scratchpad work is the standing warning here:
  three plausible fixes died on the photographs, including one where dropping a
  ref killed auto-measurement with tsc clean.

  Check while you are there: with one item per page, does the day's progress
  indicator ("Day 2 · page 1 of 3") still read sensibly at 4 pages? Does
  resume-at-item (PracticePage's `completedIds` walk) still land correctly?

A.2 A WHOLE SCREEN FOR ONE QUESTION.

  `screens/WarmUp.tsx` filters `isRetrieval` items and its own header promises
  "2-4 fast retrieval items". Measured across every served day:

      level   days   0 items   exactly 1        2+
        A      120      20     97  (81%)         3
        B      120       4     84  (70%)        32
        C      120      23     31  (26%)        66
        D      120      24     48  (40%)        48
        E      105      19     28  (27%)        58

  70% of Level B days and 81% of Level A days build a screen to ask ONE question.
  That is what made a parent report "only 1-2 questions on Day 2" — the day has
  five, split one/two/two across three screens, and the first screen holds one.
  The retrieval-share gate (20-30% of daily items) is satisfied; this is not a
  content shortfall, it is a screen that should not exist at that size.

  THIS ONE IS A UX DECISION, NOT A BUG, AND IT IS THE OWNER'S. Bring him the
  options rather than picking:
    (a) fold a 1-item warm-up into the top of the practice flow, so the day
        reads as one continuous run;
    (b) keep the separate screen but only when there are genuinely 2+ items;
    (c) leave it and make the "more to come" signal much louder.
  Say which you would choose and why, then wait.

A.3 THE GATE THAT WOULD HAVE CAUGHT BOTH.
  Additive, cheap, and it is the point of the exercise: assert that the two
  readings of `pageCount` AGREE (build a day, page it both ways, compare), and
  that no screen is built to show fewer items than its own contract states.
  Put it in `scripts/bb-screen-contract-test.ts` and give it a control that
  proves it fires — the house rule is that a gate which has never been seen to
  fail is unproven, and `bb-probe-and-rank-test.ts --selftest` is the pattern.

=== B. THE PROTOCOL FOR UI WORK — it is NOT the content protocol ===

The authoring protocol (pre-measure the generator, read the served week) does not
transfer. The equivalent discipline for a screen is:

 1. RENDER IT AND LOOK. A screen change verified by reading the diff is not
    verified. Drive Chrome, photograph, measure pixels where a claim is about
    size or space. `bb-animation-visual.ts` shows the shape.
 2. MEASURE BEFORE AND AFTER, on the same surface. Every claim in §A above is a
    number taken off served packs; keep that standard.
 3. BAND A IS NOT LEVEL E WITH BIGGER TEXT. Its laws are different and stricter
    (`FILL-AGENT-BRIEF` §3): audio-first, one operation per page, >=48px targets,
    <=10 words per SENTENCE, no timers ever. A change that is fine at Level E can
    be a hard fail at A — which is exactly what A.1 is.
 4. `tsc` AT MOST TWICE, whole output read. Battery ONCE at the end, all 21 from
    `frontend/`, plus both strict gates. RUN THEM SERIALLY — a 13-script loop
    OOM-killed this machine at exit 137 (~4GB, 2 cores). Check `free -m` between.
 5. RE-VERIFY EVERY AGENT CLAIM. Two of this week's sub-agent "blocking" findings
    were stale or wrong on inspection.

Sub-agents, the owner's standing routing: **Fable** for design challenge and
verdict, **Opus** for development, cheap models for mechanical sweeps. Cap from
`npx tsx scripts/bb-agent-budget.ts`, not from permission — it has printed 1 all
week.

=== C. THE QA REVIEW — the screen layer, on purpose this time ===

Aim at the blind spot the five defects came from. Suggested order, worst-exposure
first; bring findings with measurements, not impressions.

 1. THE PACK↔SCREEN SEAM. Every field a screen reads that the generator writes,
    and whether both ends agree on its meaning. `pageCount` is one such field and
    it was wrong; `teacherNoteStrip` is another (validator says Day 5 only,
    `PuzzleGrove` hardcodes Day 5 — those agree, check the rest). Enumerate the
    seam rather than sampling it.
 2. THE 18 UNCOVERED SCREENS, worst first by what a failure costs a child:
    `SprintRun`/`SprintGate`/`SprintFinish` (a timer at band A is a HARD FAIL —
    prove band A can never reach them), `WeeklyCheck` and `WeekResolve` (they
    promote or hold a child back), `PlacementActivity` (it decides where a child
    starts), `MicroReteach` and `StrengthenPlan` (they fire on failure, so a
    child meeting them is already struggling).
 3. AUDIO, now that it is chunked. `AudioButton` forces the browser voice on the
    lesson screen while `ttsService` has an OpenAI path — check that is deliberate.
    Verify pause/resume across a chunk boundary on real Chrome and, if reachable,
    on iOS Safari, where `pause()` is documented as unreliable.
 4. THE 36 `react-hooks/rules-of-hooks` LINT ERRORS, all in 8 animation
    components — hooks after an early return, which is a latent crash class in the
    presentation layer. This is the same blind spot wearing a different hat, and
    it pairs with the Fable verdict session owed on the micro-animations.
 5. THE 185 BARE SPOKEN SEGMENTS (`bb-lesson-audio-test` reports them). C1 is the
    only week with a `whyFigure`. Worst: B9 164s, E5 148s, B8 145s, E24 140s.
    Owner ruling stands — the why stays long, PROVIDED it is shown in action.

=== D. MERGE AND DEPLOY ===

Unchanged, verified three times this week:
 · `gh pr create`, then `gh pr merge --squash` (plain `git merge` is
   classifier-blocked). Then RESET the branch onto main and push it with
   `--force-with-lease`; confirm HEAD, origin/main and origin/<branch> are one sha
   and that `git diff <pre-merge> HEAD --stat` is empty.
 · NOTHING AUTO-DEPLOYS. REBUILD FROM THE MERGED TREE — a dist built before a late
   edit is stale and has nearly shipped twice — then zip with python's `zipfile`
   (`zip` is not installed in this WSL) and POST to
   `/api/v1/sites/4c6ca283-d712-41de-aba4-f206bdc0f496/deploys` with the token from
   the WINDOWS netlify CLI config at
   `/mnt/c/Users/usthr/AppData/Roaming/netlify/Config/config.json`.
 · VERIFY: poll to `ready`, then sha256 the live entry chunk AND every
   `bb-content-*` chunk against local dist, and grep a live bundle for a string
   only your change contains. Note that MINIFICATION RENAMES IDENTIFIERS — grep a
   string or regex literal, never a function name. A deploy nobody verified is not
   a deploy.
 · A.1 CHANGES WHAT EVERY BAND-A CHILD SEES. Say so at the merge and let the
   owner time the deploy.

=== E. THE STANDING BACKLOG (unchanged, still owner-ordered) ===

 · A15 and G9 → E18/E19/E20: `BRIEF-2026-08-26-A15-AND-G9.md`, committed. G9 is
   approved as a shared-library commitment; A15 carries the one-line
   `SERVED_FIXTURES` fact that would otherwise cost a session.
 · "Show me" as hint rung 0 — the owner's own idea, and the right answer for the
   items deliberately left undrawn (B11's ten-frame, whose hint says "count the
   bare boxes", and the number-path hops, which assess rather than model). Peeks
   are already recorded, so it feeds the Kumon return queue.
 · B22 fails `validatePack` on 25/400 seeds (QG-1 same-day operand reuse,
   pre-existing, SERVABLE — `generatePack` does not validate at serve time). Own
   commit; see `HANDOFF-2026-08-25-LIBRARY-BATCH.md` §8.2.
 · `npm run lint` red baseline: 139 errors / 87 warnings. Do not go green by
   softening rules without a recorded ruling.
 · Entropy census reads 29 teaching-slot tells (was 28); stash-verified as
   arriving with PR #13, untriaged.
 · Product: the Level-C times-table card's four agreed changes; the Kumon return
   queue; the Fable verdict owed on the micro-animations; the scratch pad's
   "More space" ruling.

House rules: explain-before-commit (exact pathspec + approval BEFORE
`git commit`); commit, push and merge are THREE separate instructions; push the
branch explicitly (`git push origin
best-brains-content-engine:best-brains-content-engine`), never bare; decisions as
inline tables and text, never AskUserQuestion modals.

Report: the before/after measurement for each fix · the tsc result · the battery
table including both strict gates · PHOTOGRAPHS or pixel measurements for any
screen change · what rendering it found that no gate caught · anything you could
not verify and what you did instead · any shared-file defect, reported not fixed ·
the merge and deploy verification.
