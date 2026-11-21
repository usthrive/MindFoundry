# NEXT STEPS — `school-math` (state 2026-11-21)

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

## State (2026-11-21 11:43 EST)
- Stage A (plan v2) + stage 0 (`sm_` tables, applied, migration 20261120000001) — merged, PR #35.
- Stage 1 run 1 — engine + G1-U02 exemplar — committed 6af7314 on the branch, NOT pushed.
- **Stage 1 run 2 — DONE, uncommitted** (waits for the owner's read of the dump and his commit word):
  lesson / practice days, W1 fix-it, W2 look again, blind-habit balance, rotation by practice day
  (`engine/assemble.ts`); scheduler (weakness, comebacks 2/7/21 from check + practice misses, previews);
  mastery; part-whole figure types added additively to the Best Brains library (packs hashed identical);
  9 new gates → battery 42 runs, 41 green, **sm-no-name fails closed until the owner sets
  `MF_NO_NAME_LIST`**; sm-verify-units 119/119. tsc 6 runs on this change set (over the house limit of
  2, disclosed each time).
- **Gates on G1-U02 (seeds 29 / 9001 / 70001, checked independent):** Fable authenticity REJECT → fixes
  (M24) → fresh Fable ACCEPT (M25; hard gates all PASS, weighted 4.1, depth 3.8) → follow-ups → Fable
  planted-defect control REJECT with all three defects cited (M26: the gate is trusted; not repeated per
  unit) → merged Opus re-check + teacher read: 7,626 values, 2 mismatches, both fixed with 13 more
  teacher fixes (M27). Packs: `testing/gate-g1u02-2026-11-21/`; notes: `testing/STAGE1-RUN2-NOTES.md`;
  owner's dump: `testing/dump-g1u02-stage1-run2.txt`.
- **Device switch (separate branch `sm-device-switch`, worktree `../MindFoundry-sm-switch`, from main
  2eb35be):** "Singapore Method on this device" in Settings (iPad home-screen apps keep their own
  storage); gate sm-device-switch-test 8/8, battery 33/33 there, tsc 1 run, photos in
  `testing/photos-2026-11-21-device-switch/`. Uncommitted; waits for the owner's words.
- Owner additions 11-21 (DECISIONS M22): Best Brains wrong-work practices W1–W9 (BUILD-PLAN §13),
  his day budget (§14), the future 30-minute combined daily plan (`docs/FUTURE-MIND-FOUNDRY-DAILY-PLAN.md`).
- Model use (owner, M25): Fable for verdicts / design sign-offs / the control once; Opus for builds, PASS 1
  tagging and every recompute (adversarial re-check merged with the teacher run).

## Next (in order)
1. Owner reads `testing/dump-g1u02-stage1-run2.txt` (one lesson day, one practice day, look again, the check, at two
   seeds) → commit word for stage 1 run 2 → push → PR → squash-merge → sync the branch by a normal merge
   (the switch branch merges first or after; the battery-count line in the KUMON handoff will need a one-line merge).
2. Owner decision on his path while Grade 1 is built (options A/B/C in the 11-21 session: B = his Grade 2 units
   right after stages 2–6; C = a stopgap page for his class's next chapter after the 1 Dec test).
3. Stage 2a: G1-U02's figures and inputs (touch + keyboard, harness photos); then stages 3–6 and the Grade 1
   fan-out (BUILD-PLAN §7), with the authoring kit written from what G1-U02 taught (M23–M27, S7).
- Owed to stage 5: "=" voiced "is the same as", a speech form for − and □ with a gate; the say/type-the-
  sentence step after error rows; the comeback source 'practice' migration.
- Owed with Grade 2: Fable sign-off on the review's N1 fix and on the proposed G2-U04 chapter check.

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
