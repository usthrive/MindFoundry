# NEXT STEPS — `school-math` (state 2026-11-20)

Start here (any model). No child's name anywhere; the exam photos are never in the repo.
**The full build (Grade 1 first) starts from `docs/HANDOFF-2026-11-20-SINGAPORE-METHOD-FULL-BUILD.md`.**

## Done
- Research R1–R5, frozen evidence ledger (E1–E269 + P3.1 E270–E291): `research/`.
- Curriculum Grades 1–5 (59 units, 285 lessons; Grade 2 = 71), defaults DD1–DD25, method ledger,
  exam coverage, 2-day Numbers-to-1,000 review, pacing to the school year: `design/curriculum/`.
- Reviews: Fable review + re-check, expert-teacher run, all fixes applied (scripts in `testing/`).
- Engine, test-prep feature and build plan specs: `design/engine/`.
- Two stopgap pages (outside the app): `design/experience/PREVIEW-G2-U04-SUBTRACTION.html`,
  `design/experience/TEST-PREP-SUBTRACTION.html` (12 sessions to 1 Dec; check: `testing/test_prep_check.js`).
- Decisions M1–M18: `meta/DECISIONS.md`. Lessons S1–S5: `meta/LEARNINGS.md`.

## Shipped
- v1 LIVE 2026-11-20 (PR #32, then the rename): module `school-math`, shown as **"Singapore Method"**;
  /school-math home → Subtraction Test Prep (page served from `frontend/public/school-math/`,
  regenerate with `node frontend/scripts/sm-sync-test-prep.mjs`) + My Scorecard; device records.

## Owner direction for v2 (DECISIONS M20)
One customizable module: My path (placement → all Grade 1–5 units) · Test prep as an option
(chapter + test date) · My scorecard · parent Settings (grade, school chapter, questions/day,
days/week, test date).

## Next (in order) — BUILD-PLAN v2 (2026-11-20, owner delegation M21)
Follow `design/engine/BUILD-PLAN.md` (v2; Fable design review REFINE, its 7 fixes applied) and
`design/engine/EXEMPLAR-G1-U02.md`. Grade 1 first, complete and live, then Grades 2–5.
1. Stage 0: `sm_` tables + RLS, contract kinds (migration applied only on the owner's word).
2. Stage 1: engine + G1-U02 (and its four outside templates) through both gates.
3. Stage 2a: G1-U02's figures and inputs; then Settings + move path (3), Placement (4), My path +
   chapter check + review (5), My scorecard + parent view (6), Grade 1 fan-out (7), personas (8),
   Grade 1 GO-LIVE.
4. Owed (with Grade 2): Fable sign-off on the review's N1 fix and on the proposed G2-U04 chapter check.

## Owner decisions still open
Teaching decisions T-1..T-8 were made under the delegation (BUILD-PLAN §2). Still the owner's:
the no-name list file (BUILD-PLAN §8.1; he creates it, the build gets the path only) · the school
calendar · importing the v1 device records (dry-run list first) · T-8 (offer Grade 1 units to the
first learner as a repair path) · every commit, push, merge, migration apply and GO-LIVE.

## House rules (binding)
`docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md` "House rules": explain before commit; commit,
push, merge are separate words; migrations through the Supabase management API, dry-run, recorded;
battery serial on a 4 GB machine; tsc at most twice per change set; every screen photographed in
the harness; every gate has a broken control; never send the child's name to any service.
