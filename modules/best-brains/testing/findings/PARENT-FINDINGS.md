# PARENT-EVALUATOR Findings — Foundry Method parent surface (Phase 7)

**Persona:** Anjali ("Priya's mom") — three years of a weekly-cycle enrichment center; judging whether this reproduces the ritual online.
**Run artifacts:** `runs/parent-run.json` (status: **failed** — welcome goto timeout 90s, acknowledge reload timeout 30s), `runs/parent-audit.json`, `runs/parent-childcheck-run.json`. Duplicate files `parent-run-run1.json` and `parent-audit-run2.json` are **byte-identical** (md5 match) to the primaries — no discrepancies to reconcile; the redundant re-run copied the same data.
**Evidence caveat (see P-2):** 24 of 27 screenshots are duplicated "Setting up…" loading placeholders (two md5 groups). Only three substantive UI captures exist: `04-report-maya-acknowledged.png` (= `06-…` from run 1), `02-welcome-verdict-preframing-open.png` (run 1), `14-controls-maya-sprint-toggled.png`. Screens without an interaction step were screenshotted before content loaded. The audit JSON's whole-page text extraction is likewise vacuous (every screen text = "Setting up…"), but its element-level probes (verdict styling, red-element scan, word counts, Review/failed scan) and the dbWrites wire ledger contain real data. Scores below blend on-screen evidence, audit element probes, the wire ledger, and read-only source review — each citation says which.

---

## Scoring table

| # | Question | Score /5 | Key evidence | Violations |
|---|----------|----------|--------------|------------|
| Q1 | Weekly glance | 3 | ParentHome.tsx:17-40 (day strip), :136 (concept), :139-142 ("{n} practice days this week"), :151 ("Weekly report ready — read it"); NO loaded live screenshot (01/03-parent-home = "Setting up…") | None in copy; silent-failure fallback renders enrolled child as "not started yet" (P-1) |
| Q2 | Report = progress book | 4 | `04-report-maya-acknowledged.png` (four fields in order, "Passed" underline + "92% on the weekly check" exactly once); audit reportJordan: text "One more round", identical typography, redElements = apricot label only, hasReviewWord/hasFailedWord false | Word counts 157/168 vs ~90–150 budget (P-6); Jordan verified by DOM probe, not pixels |
| Q3 | Acknowledge = signature | 4 | dbWrites PATCH `/rest/v1/bb_parent_reports` body exactly `{"acknowledged_at":"2026-07-20T16:04:57.511Z"}` applied; screenshot 04: "Seen 7/20/2026 — Maya will know their week counted."; parentCopy.ts:24 ackLabel | Reload-persistence check timed out — unverified (P-3) |
| Q4 | No gamification/ranking | 4 | Source sweep of all 12 parent screens: zero points/badges/streaks/leaderboards/percentile/class-average; TrendsView.tsx:9-10 bans red zones/down-arrows/projections and renders only teal bars; children stacked never ranked (ParentHome.tsx:5) | No live hit; child-hub cross-check vacuous at runtime (P-4), child source clean |
| Q5 | Coaching usable | 4 | Screenshot 04 homeFocus: praise line + "What number comes right after 109 — and how do you know?" verbatim-speakable; CoachCorner.tsx:42-68 (exactly two lines), :93-99 etiquette footer; parentCopy.ts:58-59 patterns footer "You don't need to fix any of this — it's ours." | Live coach/patterns screens are placeholders |
| Q6 | Ritual recognizable, no brand imitation | 4 | `02-welcome-verdict-preframing-open.png` (three cards + expanded "About Passed and One more round"); brand grep: "Best Brains" only in code comment parentCopy.ts:2, never rendered; UI identity = "Foundry Method · Parents" + Ms. Wren; PlacementStory.tsx:49-52 destigmatizing | None |
| Q7 | Boundaries & controls | 4 | `14-controls-maya-sprint-toggled.png` ("hard-caps at 15 — no setting extends it. More isn't better here; consistency is."; plain-words data list); dbWrites PATCH `/rest/v1/bb_enrollment` `{"settings":{"sprintOptOut":true,"sessionLength":"standard"}}` applied; audit controls before/after checked true→false | SchoolSync live unverified; JSX text run-together bug (P-5) |
| **Total** | | **27/35** | | |

**Verdict line: WOULD TRIAL WITH RESERVATIONS.** "The report IS my progress book — the four sections, the warm verdict, my signature that Priya's sibling would actually feel; nobody has copied a brand, they've understood the ritual. But twice while I browsed, the app just said 'Setting up…' and once it would have told me my enrolled child hadn't started yet — if that happens on week one of a paid month, I'm gone. Fix the plumbing and I'd sign the book every Friday."

---

## Q1 — Does ParentHome reproduce the weekly glance? — 3/5

- **Week strip:** `DayStrip` (ParentHome.tsx:17-40) renders 5 day cells, done = full teal, partial = 35% teal, unfilled = neutral fill — no red, no X, a gap is simply unfilled.
- **Concept in parent words:** line 136 renders `catalogWeek.conceptName` (e.g. "Numbers to 120" per Maya's report header).
- **Report state:** line 151 `Weekly report ready — read it` (unacknowledged latest); acknowledged latest shows quiet "seen {date} — read again" (line 159).
- **Effort framing:** lines 139-142 `{n} practice {day(s)} this week` — "missed" never appears (file-level comment at :5 states the law; grep confirms). Nora's mid-week state renders as fewer filled cells + the same neutral line, not a failure state.
- **No daily right/wrong detail:** nothing item-level on the home; only the strip and the weekly rhythm.
- **Why not higher:** the run produced **no screenshot of a loaded ParentHome** — both captures (`01-parent-home.png`, `03-parent-home.png`) show "Setting up…" ~20s after navigation, and the layout's silent-failure path (P-1) makes an enrolled child indistinguishable from "not started yet" (ParentHome.tsx:100-115). The glance is well-designed in source and unproven — and demonstrably fragile — live.

## Q2 — Is the WeeklyReport the progress-book ritual? — 4/5

- **Maya (passed, 92%), pixel evidence** `04-report-maya-acknowledged.png`: header "MAYA · LEVEL B · WEEK 1 / Numbers to 120 / **Passed** 92% on the weekly check" — verdict as underlined typography, no badge, no green; the **% appears exactly once** (WeeklyReport.tsx:95 is the only render site; the audit's `percentSigns: 0` was measured against the loading screen and is wrong — trust the pixels and the source).
- **Four fields in the warmth order** (screenshot + WeeklyReport.tsx:100-131): What we worked on → Where Maya is improving (cites "counting across tens without stalling (39 to 40, 89 to 90)") → What we're strengthening (ONE skill: decade-crossing, with the program's plan "warm-ups will keep one decade-crossing in the mix") → At home this week (praise + teach-back).
- **Teacher voice:** closing italic line "Maya settled into the weekly rhythm and closed the week with the concept owned." — reads like a person, not a dashboard.
- **Jordan (one_more_round, 67%), audit element probes:** verdict text "One more round" with byte-identical typography to Maya's (same color rgb(43,50,56), weight 700, no background, no underline-decoration difference); `hasReviewWord: false`, `hasFailedWord: false`; the only warm-hued element is the same apricot "At home this week" label both reports share — the non-pass report is **not** visually worse. Fixture narrative (harness/fixtures.ts:389-391) carries the not-stuck register: "worked steadily all week; one step needs one more round, and the plan for it is already set." Fresh-problems promise lives in the pre-framing ("a short revisit, then brand-new problems") and the strengthening plans.
- **Why not 5:** word counts 157 (Maya) / 168 (Jordan) against the ~90–150 phone-minute budget (audit-counted, including labels — borderline, P-6); and Jordan's report was never captured as pixels, so the side-by-side comparison the spec asks for rests on DOM probes.

## Q3 — Does acknowledge feel like signing the book? — 4/5

- **Wire evidence (quoted):** `runs/parent-run.json` dbWrites[0]:
  ```json
  { "ts": "2026-07-20T16:04:57.870Z", "method": "PATCH", "path": "/rest/v1/bb_parent_reports",
    "body": { "acknowledged_at": "2026-07-20T16:04:57.511Z" }, "outcome": "applied" }
  ```
  Body is EXACTLY `{"acknowledged_at": …}` — the mock (mirroring the live column grant) applied it.
- **Signature register, on-screen:** button copy `Seen it — Maya will know their week counted` (parentCopy.ts:23-25), in-flight state "Signing…" (WeeklyReport.tsx:144), settled state visible in screenshot 04: "Seen 7/20/2026 — Maya will know their week counted." This is a signature for the child, not a read-receipt.
- **History:** ReportHistory.tsx:66-68 shows "seen {date}" per row; the unacknowledged state is a quiet "not seen yet" — no penalty framing anywhere (ParentHome's late state is "read again").
- **Why not 5:** the reload-persistence check **did not complete** — `page.reload` timed out (run note) and `07-report-maya-after-reload.png` is a "Setting up…" placeholder. The mock ledger says applied; the UI's persisted state was never observed (P-3).

## Q4 — Is anything gamified or ranked? — 4/5

- **Parent screens, source sweep (all 12 files under `frontend/src/modules/best-brains/screens/parent/`):** no points, badges, trophies, streaks, leaderboards, percentiles, class averages, or "children this age usually…" anywhere; the only "points" matches are chart data variables (TrendsView.tsx:32,95-97).
- **Multi-child home:** children stacked in list order, never ranked or compared (ParentHome.tsx:5 states it; the render confirms — no cross-child aggregates exist).
- **TrendsView bans honored:** header law at :9-10 ("Banned by law: red zones, down-arrows, projections"); the implementation renders teal-on-warm-fill bars only (:54-63), gaps shown plainly, `<3` weeks → "Still gathering the story — a few dots don't make a trend" (:138). Sprint panel is self-referenced ("Maya versus Maya only… never a grade", :183-185) and disappears entirely on opt-out (:167).
- **Positive space:** completion states are quiet ("Strong weeks look exactly like this", PatternsView.tsx:52-53); nothing rewards anything but completed real work.
- **Child-surface cross-check:** the runtime check is vacuous (P-4 — the child hub screenshot and text capture are the "Setting up…" loading state, so `has92: false` proves nothing). Source review of child screens fills the gap: `%` appears only in comments and modulo arithmetic; "Review"/"Failed" never rendered (only a `failedSubmit` retry state variable); StrengthenPlan.tsx:7 codifies "no %, 'Review', red, sad iconography." No CRITICAL hit anywhere — but a runtime leak-check that never executed can't earn the 5.

## Q5 — Is "what to say to your child" usable at 7pm? — 4/5

- **Exactly two lines** (CoachCorner.tsx:40-68): the praise line and the teach-it-back question, both from the latest report's homeFocus, both with a "hear it aloud" TTS button.
- **Speakable verbatim, zero math background** — pixel evidence from the report's At-home block (screenshot 04): praise "You sailed straight past 99 to 100 and kept going — that used to be a wall, and now it is just a step." and teach-back "What number comes right after 109 — and how do you know?" Both survive being read aloud by a tired parent.
- **Praise names a move, not "smart/fast":** the line above praises the decade-crossing move; guidance text "strategy praise sticks where 'so smart' slides off" (CoachCorner.tsx:53).
- **Etiquette footer always visible** (CoachCorner.tsx:93-99, parentCopy.ts:74-78): praise the move · say "strengthening," never "redo" · never quiz — ask to be taught.
- **One_more_round child still armed with genuine praise:** homeFocus comes from the pack's parentSummarySeed regardless of verdict (fixtures.ts putReport; same recipe as the production RPC) — the praise line exists on Jordan's week too.
- **Patterns:** DD7 tags translated (parentCopy.ts:34-55 — e.g. "knows the idea, skips a step under load") each with "What the program is doing" attached (PatternsView.tsx:77-80); standing footer "You don't need to fix any of this — it's ours." Nothing converts her into homework police; language stays task-level (":5-6 — 'the regrouping step,' never 'careless'").
- **Why not 5:** the coach and patterns screens were never captured loaded (`09/10-coach-*.png`, `08-patterns-maya.png` all placeholders); the two-line experience is verified through the report screenshot and source only.

## Q6 — "My center's program, online" WITHOUT brand imitation? — 4/5

- **Brand scan — clean:** grep across all parent screens + parentCopy for real-company names (Best Brains, Kumon, Mathnasium, Sylvan, RSM, bbConnect, etc.) → the ONLY hit is a source-code comment, `parentCopy.ts:2` ("Best Brains-inspired module — …"), never rendered. On-screen identity is original: "FOUNDRY METHOD · PARENTS" wordmark + WrenMark + Ms. Wren (screenshots 02/04/14). Internal `bb_` table prefixes and the `[bb]` console tag never reach the UI. No logos, mascots, or "as seen at…" claims. No CRITICAL legal finding.
- **The ritual synthesis:** weekly narrative (four-field note) + verdict ("Passed"/"One more round" as vocabulary, not color) + sign ("Seen it" = the signature) + named next step (strengthening plan + At-home lines) + a consistent teacher voice = the progress-book ritual, earned by method and tone.
- **Onboarding, pixel evidence** (`02-welcome-verdict-preframing-open.png`): the three cards set expectations honestly — "One concept a week… The week is the unit. Consistency beats bingeing." / "Read, praise, ask… You never grade anything." / "Not drill, not speed, not a game… some weeks take 'one more round' — and that is the system working, not a setback." The verdict pre-framing is expandable (shown expanded): "You will see the verdict and the percentage — your child never will… No 'Review,' no red marks, no percentages on child screens." Never force-read ("Skip for now" visible).
- **Placement story** (PlacementStory.tsx, source): neutral letter + parent-only age-context sentence (parentCopy.ts LEVEL_CONTEXT), strengths named ("What Maya already owns"), destigmatizing "We start where instruction lands, not where frustration lives — the level letter is a starting point, never a rank" (:49-52), and no outcome promises — the standing promise is re-checkable placement, not results.
- **Why not 5:** placement story and most of the connective tissue were never seen loaded in this run; the recognition verdict rests on three screenshots plus source.

## Q7 — Boundaries and controls in the parent's hands — 4/5

- **Sprint opt-out, informed and non-steering** — pixel evidence (`14-controls-maya-sprint-toggled.png`): "Two calm minutes, you-versus-you, never graded — and genuinely optional… Neither choice is 'recommended'; it's yours." Audit confirms toggle before/after `true → false`.
- **Wire write (quoted):** dbWrites[1]: `PATCH /rest/v1/bb_enrollment` body `{"settings":{"sprintOptOut":true,"sessionLength":"standard"}}` → applied. Goes to `bb_enrollment.settings` as specified.
- **Session cap with the WHY:** "At Maya's band the day targets 12 minutes and hard-caps at 15 — no setting extends it. More isn't better here; consistency is." (on-screen; ParentControls.tsx:141-144).
- **Plain-words data list (P12), on-screen:** the five stored items + "Nothing else — no recordings, no photos, no comparisons to other children… deletion is honored fully."
- **SchoolSync honest, never school-competitive** (source): one optional input, honest effect ("We'll lean warm-ups toward overlapping skills… The weekly ladder itself never reorders"), school name never requested, entries fade ~6 weeks, no ahead/behind framing.
- **Why not 5:** SchoolSync never captured loaded (`12-school-maya.png` is a placeholder), and it carries a real copy-rendering bug (P-5).

---

## Findings (ranked)

### P-1 · HIGH — Parent surface load failure is silent and masquerades as "not started yet"
- **What:** the parent layout's data load (`refresh()`) failed at runtime with `TypeError: Failed to fetch`; the error is caught and only logged — no user-visible error, no retry — and downstream screens then render as if the data legitimately doesn't exist. Because ParentHome treats a missing enrollment as "not started yet" (ParentHome.tsx:100-115), a transient failure would show a parent her **enrolled child as never having started**.
- **Where:** `/foundry/parent/*` shell — `frontend/src/modules/best-brains/screens/parent/FoundryParentLayout.tsx:51-76`.
- **Evidence:** three UNEXPECTED console errors (parent-run.json unexpectedConsole): `[bb] parent surface load failed {message: TypeError: Failed to fetch … FoundryParentLayout.tsx:62:25}` at 16:06:35 (×2, during trends-maya) and `…:64:13` at 16:07:48 (during coach-maya).
- **Read-only diagnosis:** line 62 is the `Promise.all(` fanning out `listReports(id)` per enrolled child inside `refresh()` (line 64 = the `.map` frame of the same block — same failure, different stack row). The thrown error is a network-level fetch failure from the Supabase client, i.e. the request escaped or was dropped by the harness mock — the **same failure family** as the known `SubscriptionContext.tsx:73` "Failed to fetch" errors logged seconds earlier (16:07:13), so the trigger is environmental, not a logic bug. The product defect is the handling: `catch (e) { console.error(…) }` then `finally { setLoading(false) }` (lines 71-75) leaves `enrollments`/`reportsByChild` empty or stale with no error state, no retry affordance, and a misleading empty-state rendering. Not a crash; a resilience gap with a trust-damaging face.
- **Why it matters to a parent:** the entire pitch is weekly reliability. One flaky network moment and the ritual surface says her child hasn't started. She won't file a bug; she'll churn.
- **Suggested fix:** track a `loadError` state in the layout; on catch, render a gentle "We couldn't load this just now — tap to retry" card instead of the empty/enrollment-missing states, and have ParentHome distinguish "no enrollment (loaded)" from "load failed."

### P-2 · HIGH — Run evidence is largely vacuous: 24/27 screenshots are loading placeholders and the audit's text checks measured "Setting up…"
- **What:** the browser run (status **failed**) screenshotted most screens before content rendered; the audit's whole-page text extraction captured the same loading state, so its headline checks are vacuous — `hits: []` (gamification scan), `reportMaya.percentSigns: 0` (contradicted by pixel evidence of exactly one "92%"), and `childCheck.has92: false` (the child-hub leak check ran against a loading screen).
- **Where:** harness/runner timing — `runs/parent-run.json`, `runs/parent-audit.json`, `screenshots/phase7/parent/` (md5 grouping: 8 files = one placeholder, 14 files = the other; only 3 unique content captures, all following an explicit interaction that forced a wait).
- **Evidence:** md5 duplicate groups across the directory; audit `screens.*.text` all `"Setting up…"`; stageErrors: welcome `page.goto` 90s timeout, acknowledge `page.reload` 30s timeout.
- **Why it matters to a parent (and the program):** the persona's verdict is only as good as its evidence; today the anti-gamification and child-leak verdicts rest on source review, not the live UI. It also documents genuinely slow surface readiness under run conditions (~20s+ after navigation, still loading).
- **Suggested fix (harness):** wait for a content selector (e.g. `h1`, `.mf-card`) rather than a fixed delay before each screenshot/text extraction; fail the stage loudly when "Setting up…" is still the page text; re-run the welcome and reload stages.

### P-3 · MEDIUM — Acknowledge persistence after reload never verified
- **What:** the spec requires reloading Maya's report and seeing the acknowledged state persist; the reload timed out and the post-reload screenshot is a loading placeholder.
- **Where:** `/foundry/parent/report/<maya>/B/1` — run note (`acknowledge: TimeoutError: page.reload…`), `07-report-maya-after-reload.png` (run 1).
- **Evidence:** the mock ledger shows the PATCH applied, and the pre-reload UI settled ("Seen 7/20/2026 — …" in screenshot 04), but the round-trip (reload → re-fetch → acknowledged rendering) is unobserved.
- **Why it matters:** the signature must survive closing the book; if it ever reverts, the child's "your week counted" moment silently un-happens.
- **Suggested fix:** re-run the reload stage with a content-selector wait; assert the "Seen {date}" line renders from fresh data.

### P-4 · MEDIUM — Child-hub %/verdict leak check inconclusive at runtime
- **What:** the cross-check that "92" / "Passed" / "%" never reach child surfaces executed against a loading screen (child hub stuck at "Setting up…"), so the runtime evidence is vacuous.
- **Where:** `/foundry` (child viewport) — `runs/parent-childcheck-run.json`, `screenshots/phase7/parent-childcheck/01-child-hub-crosscheck.png`, audit `childCheck`.
- **Evidence:** childCheck.text = "Setting up…"; source review fills the gap cleanly (no rendered `%`, "Review", or "Failed" on any child screen; StrengthenPlan.tsx:7 codifies the ban), so this is an evidence gap, not a suspected leak — kept at MEDIUM because a %-leak, if ever present, is CRITICAL by rubric.
- **Suggested fix:** re-run the child cross-check with a loaded-content wait, ideally traversing the child weekly hub and the strengthen (one-more-round) screen for Jordan.

### P-5 · LOW — SchoolSync copy renders with missing spaces ("conceptsMaya", "onMaya's")
- **What:** two JSX text-run bugs — a line break directly between trailing text and a `{name}` expression strips the whitespace, so the honest-effect paragraph renders "…only concepts**Maya** has already been taught…" and "…stored in plain words on**Maya's** settings…".
- **Where:** School sync screen (`/foundry/parent/school/:id`) — `frontend/src/modules/best-brains/screens/parent/SchoolSync.tsx:99-100` (`— only concepts\n{name} has…`) and `:102-103` (`…in plain words on\n{name}'s settings…`).
- **Evidence:** source (JSX strips end-of-line whitespace before an expression on the next line); no loaded screenshot exists to show it, which is itself P-2's point.
- **Why it matters to a parent:** the school-sync paragraph is precisely where the product earns trust as "honest about its small effect" — typos in the trust paragraph read as carelessness.
- **Suggested fix:** end line 99 with `concepts{' '}` (and line 102 with `on{' '}`), or join the lines.

### P-6 · LOW — Report body slightly exceeds the phone-minute word budget
- **What:** audit word counts: Maya 157, Jordan 168, against the ~90–150 target (counts include header/labels, so the true body is borderline rather than clearly over).
- **Where:** WeeklyReport narrative assembly (pack `parentSummarySeed` + RPC recipe; fixture mirror at `testing/harness/fixtures.ts` putReport).
- **Evidence:** `runs/parent-audit.json` reportMaya.reportWordCount / reportJordan.reportWordCount.
- **Why it matters:** the ritual's contract is 60–90 seconds per sitting; drift accumulates one clause at a time.
- **Suggested fix:** budget the seed fields (e.g. cap strengthening + improving at one sentence each) and count words in the authoring lint, excluding labels.

### P-7 · LOW — DEV chrome overlaps the parent nav on phone viewport
- **What:** a purple "DEV: Foundation"/"DEV: None" pill floats over the bottom-right of the tab bar, covering the Settings tab (and partially Progress) at 390×844 in every capture.
- **Where:** global shell over `/foundry/parent/*` — visible in screenshots 01, 02, 04, 14 and both placeholder variants.
- **Evidence:** all three content screenshots show the pill overlapping nav items.
- **Why it matters:** dev-only presumably, but if any environment flag leaks to prod it sits exactly on the parent's Settings touch target; it also degraded this run's captures.
- **Suggested fix:** hide the pill on parent routes / phone widths in test runs, or dock it above the tab bar.

---

*No CRITICAL findings: the violation hunts (gamification, ranking, brand leakage, %-leak to child, guilt copy) all came back clean in source and in every loaded capture — but two of them (Q4 runtime leak check, welcome/reload stages) must be re-executed with proper waits before this surface is called fully certified. Bugs logged only; nothing fixed, nothing committed.*
