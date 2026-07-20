# Phase 7 — Consolidated Findings & Fix Loop

**Date:** 2026-07-20 · **Module:** Foundry Method (`best-brains`, `/foundry/*`) · **Build @ finding time:** `d8c82e0`
**Method:** 3 evaluator personas drove the live UI (Playwright headless, mocked backend with real pack-generator fixtures + DD1/LS1-R5 RPC emulation). Per-persona detail: `findings/TEACHER-FINDINGS.md`, `findings/PARENT-FINDINGS.md`, `findings/STUDENT-FINDINGS.md`. Screenshots: `screenshots/phase7/<persona>/`; run logs: `runs/`.

## Scorecard

| Persona | Score | Verdict | C | H | M | L |
|---|---|---|---|---|---|---|
| Teacher (concept-first instructor) | 23.5/35 | AUTHENTIC-WITH-FIXES | 1 | 2 | 2 | 3 |
| Parent (progress-book ritual) | 27/35 | PARTIAL — leaning yes | 0 | 2 | 2 | 3 |
| Students (Nora 5 / Maya 8 / Jordan 11) | Nora NO · Maya YES · Jordan maybe-yes | mixed | 3 | 4 | 6 | 7 |

**Cross-cutting read:** No pedagogy or tone failure — **zero D5 leakage** (no child-visible %, red, ✗, or fail-words anywhere; StrengthenPlan is pixel-identical warmth to the pass screen), the near-miss corrective loop is the standout, and the parent progress-book ritual is faithfully reproduced with no brand leakage. All CRITICAL/HIGH items are **wiring bugs**, concentrated in the youngest-child path and a few gate/threshold mismatches.

---

## MASTER LIST — severity-ranked, deduplicated

### 🔴 CRITICAL (fix now — block a real user)

| ID | Title | Where | Root cause | Fix |
|---|---|---|---|---|
| **C1** = S-1 | Zero-retrieval days strand the child on a blank screen | `WarmUp` (child daily flow); all A1 days 2–4 | `WarmUp` calls `navigate()` during render; the redirect no-ops when there are 0 retrieval items → dead-end blank screen (8 stranded entries reproduced) | When a day has no retrieval/warm-up items, skip WarmUp entirely (route straight to core PracticePage); never `navigate()` during render — use an effect/guard |
| **C2** = S-2 | Band-A child cannot complete Day 1 (reading- AND keyboard-gated) | `GuidedPractice` (+ AnswerEntry) at band A | Silent `childDo` instruction text with 0 audio affordances, over a free-text field expecting typed "3, 4" — a pre-reader can neither read the step nor type the answer | Band-A GuidedPractice: audio-carry every instruction (AudioButton/auto-play per band law), replace free-text with tap-first entry (TapToSelect-style) for band A |
| **C3** = S-3 | Placement over-places into the level the child just failed | placement walk logic (`PlacementActivity`/placement service) | `canDown` excludes already-visited levels, so after passing A and failing B the walk can't settle back to A → "starts at Level B"; Maya 40%@C → Level C | Settle at the highest level the child actually **passed**; allow settle-down to a visited level; never assign a level whose entry check the child failed |
| **C4** = T-1 | Teach-first law has a bypass (practice can render before the lesson) | `weekLogic.ts:107-110` `isDayActionable` | `isDayActionable` never calls the existing `isLessonComplete`; in-app nav can surface `/foundry/day/1/practice` pre-lesson | Gate day actions on lesson completion for the first practice of a new concept; add the `isLessonComplete` check |

### 🟠 HIGH (fix now)

| ID | Title | Where | Root cause | Fix |
|---|---|---|---|---|
| **H1** = T-2 ≡ S-4 | Hint-ladder reveal + fix-it is unreachable dead code | `PracticePage.tsx:254` (reveal gate) vs authored ladders | Reveal requires `rung >= 3`, but authored ladders are 1–2 rungs → items always park at 2 misses; on-screen "answer comes after rung 3" is an unkeepable promise; LS1-R3(b) never fires | Make reveal fire after the **last available rung + one attempt** (not hardcoded 3); align caption to actual ladder length; ensure the fix-it/near-transfer step then runs |
| **H2** = S-6 | NumberPad retains previous wrong digits → phantom second misses | shared NumberPad / AnswerEntry in PracticePage | Answer field not cleared between attempts; child's stale digits count as a fresh wrong submit (discovered organically by Maya) | Clear the entry buffer on each new attempt / after a miss before re-attempt |
| **H3** = S-10 | Sprint's 2×/week budget is UI-unreachable past run 1 | Sprint trio (`SprintGate`/`SprintRun`) | No path to a second sprint within the week even though budget allows 2 | Expose the remaining sprint run in the UI; honor the 2/week budget + parent opt-out |
| **H4** = P-1 | Parent surface fails silently → enrolled child shown as "not started yet" | `FoundryParentLayout.tsx:62` (`refresh()` `Promise.all`) | Transient `Failed to fetch` caught at :71-72 with console-only logging; no error UI/retry; enrolled child renders as "not started" | Add error/retry UI on parent-data fetch failure; distinguish "load failed" from "genuinely not started" |

### 🟡 HARNESS / EVIDENCE (not app bugs — fix harness + re-run)

| ID | Title | Action |
|---|---|---|
| **E1** = T-3 | Harness clicked "Anchor ⌗" on SprintGate (mounts no panel by design) → teacher run truncated at Day-3, R6 unwitnessed | Harden runner: don't click Anchor where absent; re-run teacher R3-back-half + R6 (mastery gate, StrengthenPlan/FreshProblems/both resolve screens, child %-sweep) |
| **E2** = P-2 | Parent run status "failed"; 24/27 screenshots were "Setting up…" placeholders → several checks vacuous | Harden waits (settle for FoundryParentLayout grace window; assert screen ready before capture); re-run parent Q1/Q4 child-leak + reload-persistence stages |
| **E3** | Cold deep-link race confirmed by all 3 children + teacher (≈1–4s "Setting up…" then bounce to hub) | App-side: acceptable degradation (in-app nav unaffected); note in known-limitations. Harness: always warm the route before asserting |

### 🟢 MEDIUM / LOW (log + defer past the fix loop unless cheap)

- **P-5 (LOW)** SchoolSync JSX whitespace bug renders "conceptsMaya"/"onMaya's" — *cheap, fix in the loop.*
- **T-5 (LOW)** C-band emoji bleed in copy (source-only) — cheap, fix if touched.
- Remaining MEDIUM/LOW (P-3 reload-persistence unobserved, P-4/P-6/P-7, T-4/T-6/T-7/T-8, S-5/S-7…S-20 minor friction/ergonomics): logged in the per-persona files; triage into a post-Phase-7 backlog in BUILD-NOTES.

---

## Fix status (commit `a9beb59`, 2026-07-20)

**Landed (tsc+build clean, committed):** C1 ✅ C2 ✅ C3 ✅ C4 ✅ H1 ✅ H2 ✅ H3 ✅ H4 ✅ P-5 ✅ — all CRITICAL + HIGH app bugs fixed. C1 additionally driven end-to-end in the real UI (Nora reaches Day-2 practice, no blank screen).
**Deferred to backlog (LOW):** T-5 C-band emoji bleed — exact sites known (`WeekResolve.tsx:37,80`, `StrengthenPlan.tsx:61,83`, `CheckRunner.tsx:119`); gate glyphs on `band !== 'C'` in a future pass. Plus all other MEDIUM/LOW per-persona items → BUILD-NOTES backlog.
**Harness/evidence (E1/E2/E3):** pending in the re-run pass below.

## Fix-loop plan

1. **Builder A — child critical path** (disjoint files): C1 WarmUp, C2 band-A GuidedPractice, C3 placement settle-down, C4 teach-first gate (`weekLogic.ts`), H1 hint-reveal threshold, H2 NumberPad buffer. Re-run Nora (fresh + mid-week), Maya (near-miss), teacher R1/R5.
2. **Builder B — parent + sprint + copy** (disjoint files): H3 sprint second-run, H4 parent silent-failure UI, P-5 SchoolSync copy, T-5 emoji if trivial. Re-run parent Q1/Q4, Jordan sprint.
3. **Harness hardening** (E1/E2): Anchor-guard, ready-asserts before capture, route warming → re-run the vacuous stages.
4. **Verify:** `tsc --noEmit` + `npm run build` clean; `bb-verify-packs` green if generator touched; re-run persona stages; append fix results here. Commit pathspec-only per increment.

**Deferred (logged):** all MEDIUM/LOW above → BUILD-NOTES backlog.

---

## Fix-loop re-run results (2026-07-20)

**Build:** `a9beb59` (8 critical/high fixes). **Method:** hardened the Phase-7 harness/runners for the fixes' new behavior, then re-ran the affected persona stages headless (Playwright + real pack-generator fixtures + mocked Supabase, DD1/LS1-R5 RPC emulation). Honest re-run screenshots: `screenshots/phase7-rerun/<persona>/…` (kept beside the original `phase7/` set, not over it). Run logs: `runs/students-run.json`, `runs/teacher-run.json`, `runs/parent-audit.json`.

### Verdicts — one row per fixed finding

| Finding | Verdict | Evidence (re-run) |
|---|---|---|
| **C1** zero-retrieval day strands child on blank screen | **PASS** | Nora mid-week: Day-2 pack has `warm=0/practice=6`; `enterDay` (workaround removed) landed straight on `/day/2/practice` via the declarative redirect and drove to `day/2/done` (`day2:drive result=end`) — no blank-warmup, no `REGRESSION` note. `students/nora/midweek/*` |
| **C2** band-A can't complete Day-1 (reading/keyboard-gated) | **PASS** | Nora fresh-week guided: all 3 input steps are **tap tiles** (targets 4, 5, 4), audio affordance present on every childDo (`silent=0`), deliberate wrong-tile miss recovered, reached `day/1/done` unaided. `students/nora/freshweek/05-08` + `09-day1-done` |
| **C3** placement over-places into the level just failed | **PASS** | `placement:C3-settle` — Nora `passed=[A] failed=[B] → Level A`; Maya `passed=[B] failed=[C] → Level B`; `assigned-a-failed-level=false` both. StartingPoint shows the highest **passed** level. |
| **C4** teach-first bypass (practice before lesson) | **PASS (BLOCKED)** | Teacher r1 in-app `history.push` to `/foundry/day/1/practice` on a fresh, pre-lesson week now **bounces to hub** (`bounced:true, c4Pass:true`). Screenshot `teacher/04-r1-day1-practice-inapp-probe` shows the hub ("Week 1 begins with a lesson… Start the lesson with Ms. Wren"), not a practice item. |
| **H1** hint-ladder reveal + fix-it was dead code | **PASS** | Reveal now fires at the ladder's **real last rung + one attempt**. Maya mid-week B1-D3-03 (2-rung): REVEAL after 3 misses, caption *"The answer only comes after rung 2 and one try — with the why."* (matches ladder length), fix-it = explain-back that advances the day. Teacher r5: item1 (1-rung) reveals not parks (`h1Pass:true, parked:false`); item2 second miss opens rung 2 then reveals; caption "rung 2", stale "rung 3" gone; `rung3PreviewVisible:false`. `teacher/08,12`, `students/maya/midweek/05-06` |
| **H2** NumberPad keeps stale digits → phantom miss | **PASS** | Maya mid-week, driven **without** a manual clear: `h2:buffer-clears` — after a NumberPad miss the answer box reads `""` (`H2 clears=true`); the next attempt starts empty. |
| **H3** 2×/week sprint budget UI-unreachable past run 1 | **PASS** | Jordan `sprint2`: after sprint 1, SprintFinish shows **"Another two minutes"** (`present=true`); via it, sprint 2 is reached and completed; after run 2 the affordance is **gone** (`present=false`) — caps at 2. `jordan/sprint2/*` |
| **H4** parent load failure shown as "not started" | **PASS** | Parent load-failure probe (forced `bb_enrollment` GET→500 via mock): renders the calm **"Couldn't load this just now / Try again"** card — never "not started" (`calmCardShown:true, misleadingNotStartedShown:false`); disabling the fault + tapping Try again recovers the surface (`recoveredOnRetry:true`). `parent-loadfail/01-h4-load-failure-retry-card`, `02-h4-recovered-after-retry` |

### Harness / evidence items

| ID | Verdict | Notes |
|---|---|---|
| **E1** Anchor click on SprintGate truncated the teacher run | **FIXED** | `openAnchorIfPresent`/`closeAnchorIfOpen` guards only click Anchor where it mounts. Teacher r2 (previously died at Day-3 item 4 on the sprint gate) now runs clean; r3/r4/r5 (R6) are reachable — **R6 mastery gate witnessed end-to-end** (Form A near-miss → StrengthenPlan with `r6_strengthen_leaks=[]`, identical "Got it!"×6 acks, FreshProblems Form B 0/6 overlap, fast-track resolve, first-pass resolve; child %-sweep `hubPct:false, mapPct:false`). `teacher/10-r6-strengthen-plan`, `06-r6-resolve-fasttrack` |
| **E2** vacuous "Setting up…" screenshots | **FIXED** | `settle()` now gates on loading-text-gone **and** real content (`length>120`); report/child stages add screen-specific ready-asserts. Parent run: `stageErrors:[]` (was "failed"), `reportMaya ready:true, percentSigns:1` (the "92%"), Q4 child hub **loaded** — `percentSigns=0, has92=false, passed=false, review=false` (was vacuous). |
| **E3** cold deep-link race | **HELD** | Route-warming was already in place (first `goto` 60s + FoundryLayout settle in `go`/`nav`/`firstNav`/`visit`); every re-run stage reached its target screen with no "Setting up…" capture. In-app nav unaffected. |

### Harness / runner files changed (test-side only — no app source touched)

- `testing/harness/harness.ts` — `PHASE7_SHOTS` env for the screenshot root (→ `phase7-rerun`); `HarnessFault` injection (fail first N matching table requests) for H4.
- `testing/harness/run-students.ts` — C2 `playGuided` band-A tap-tile entry (+ `guidedBandATarget`, audio assert); C1 `enterDay` workaround removed (blank-warmup now a logged regression, not masked); H1 `ladderRide` rewritten to the miss-driven reveal→fix-it flow with reveal-caption==ladder-length check; H2 NumberPad buffer-clear probe; C3 `playPlacementWalk` settle-level assertion; H3 `jordan/sprint2` stage + `completeSprintFromGate`.
- `testing/harness/run-teacher.ts` — E1 Anchor guards; C4 r1 in-app-probe verdict (bounce=blocked); H1 r5 item1/item2/ceiling rewritten (reveal+fix-it, "rung 2" caption, no rung-3 preview); E2 `settled()` content gate + `waitReady`; **fixed the r3 mid-check-reload flaw** (the reload advances past item-4's held-feedback, so the loop must not click a consumed "Next" — it timed out and blocked StrengthenPlan capture).
- `testing/harness/run-parent.ts` — E2 `settle()` content gate + `assertReady` + report ready-asserts; H4 `load-failure` stage (persistent fault → calm card, then disable-the-shared-fault-array → Try again → recovery); `PARENT_STAGES` filter.
- `testing/harness/introspect.ts` — new throwaway pack-introspection helper (ground-truth for tap targets / ladder lengths / fix-it type).

### New findings / regressions

- **No new app bugs. No regressions.** Every fixed finding holds; no fix was found not-holding.
- **R-1 (harness, fixed):** teacher r3's mid-check reload consumed item-4's "Next" transition, so the loop hung clicking a button that no longer existed (`TimeoutError`). Never surfaced before because the old run truncated at r2 (E1). Fixed with a `continue` after the reload; r3 now reaches StrengthenPlan.
- **R-2 (harness, fixed):** H4's one-shot 500 fault self-healed — React StrictMode double-invokes the layout's `refresh()` effect, so the 2nd (successful) fetch cleared `loadError` before capture. Fixed by making the fault persistent, then disabling it (shared-array mutation) before the retry.
- **R-3 (harness caveat, not fixed):** `run-teacher.ts` uses `persona:'teacher'`, so each `h.finish()` writes `runs/teacher-run.json` — the same path `main()` writes the merged `{runs,observations}` to. Mid-run reads therefore show a single run's shape; the merged file is correct only after the process completes `main()`. Cosmetic (evidence is intact on completion); worth de-colliding later.

### Honest "can't verify in headless + mock" note

- **Server-side scoring correctness** — the mastery RPC is the harness **emulation** (DD1 routing + LS1-R5 stability, same thresholds). Both verdict branches' UI is verified; server RPC/trigger/RLS correctness is **not** claimed here (that was verified live in increment 4).
- **Actual TTS speech** — only the audio **affordance** (aria-labelled buttons, autoplay presence) is asserted; browser voices are blocked/mocked, so audible playback is unverified.
- **Real network-failure semantics (H4)** — the failure is an injected mock 500, which exercises the app's `catch → loadError → calm card` path faithfully; a genuine `Failed to fetch`/timeout/offline may differ in timing.
- **Offline sync, service-worker paths** — out of scope (SW blocked in the harness).

### Full clean child week per band

- **Band B (Maya) — YES, witnessed end-to-end this pass:** placement → Level B; lesson + guided Day-1; Day-3 practice incl. the reveal→fix-it loop and treasure-chest resolve; and (teacher r3/r4/r5) Day-5 WeeklyCheck → verdict → StrengthenPlan (near-miss) / FreshProblems → resolve, both the near-miss and pass branches, child surface verdict-free.
- **Band A (Nora) — critical path clean, week unblocked:** the two week-blocking bugs (C1 blank screen, C2 can't-finish-Day-1) are fixed and confirmed — placement → Level A, lesson + guided Day-1 via tap tiles, Day-2 practice, all completed **unaided**. Day-5 → check → resolve for band A was not re-driven this pass (it was green in the prior full student run and the C1 day-5 bank-and-forward path is fixed), so a full A-week is unblocked but the tail is asserted from the fix + prior evidence, not a fresh end-to-end drive.
- **Band C (Jordan, D17 fixture cell) — sprint path confirmed:** H3 second-sprint reachability/cap verified; no band-C week-blocker was in the fix set. A full end-to-end band-C week was not re-driven this pass (the D-level cell is fixture-only; placement walks A→C).

*Test-side changes only; no app source modified; nothing committed.*
