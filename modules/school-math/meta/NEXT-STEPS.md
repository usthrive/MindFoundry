# NEXT STEPS — `school-math` (state 2026-11-18)

Start here (any model). No child's name anywhere; the exam photos are never in the repo.

## Done
- Research R1–R5, frozen evidence ledger (E1–E269 + P3.1 E270–E291): `research/`.
- Curriculum Grades 1–5 (59 units, 285 lessons; Grade 2 = 71), defaults DD1–DD25, method ledger,
  exam coverage, 2-day Numbers-to-1,000 review, pacing to the school year: `design/curriculum/`.
- Reviews: Fable review + re-check, expert-teacher run, all fixes applied (scripts in `testing/`).
- Engine, test-prep feature and build plan specs: `design/engine/`.
- Two stopgap pages (outside the app): `design/experience/PREVIEW-G2-U04-SUBTRACTION.html`,
  `design/experience/TEST-PREP-SUBTRACTION.html` (12 sessions to 1 Dec; check: `testing/test_prep_check.js`).
- Decisions M1–M18: `meta/DECISIONS.md`. Lessons S1–S5: `meta/LEARNINGS.md`.

## Next (in order)
1. **Fast track (owner wants it in the app):** BUILD-PLAN stage 0 (register `school-math`, card
   "School Math" behind a dev/allow-list flag, `sm_` tables as a migration file — applied only on
   the owner's word) + the 12 test-prep sessions as app screens + a standalone scorecard for the
   child (counts, never percentages; parent detail below). Port the generators from
   TEST-PREP-SUBTRACTION.html to TypeScript; turn `test_prep_check.js` into a battery gate with
   broken controls.
2. Add the **placement test** (DD25) as a stage before the child's day flow.
3. Then BUILD-PLAN stages 1–8 (engine + G2-U04 exemplar through both gates first).
4. Owed: Fable sign-off on the review's N1 fix and on the proposed G2-U04 chapter check.

## Owner decisions still open
Questions per day (rec. 5–6 lesson day, ~10 practice day) · teacher character + voice (rec. a new
character, free voice) · card name (working: "School Math") · days per week (rec. 5) and the
school calendar · go-live.

## House rules (binding)
`docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md` "House rules": explain before commit; commit,
push, merge are separate words; migrations through the Supabase management API, dry-run, recorded;
battery serial on a 4 GB machine; tsc at most twice per change set; every screen photographed in
the harness; every gate has a broken control; never send the child's name to any service.
