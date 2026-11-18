# Handoff: a third teaching approach, built as its own module (2026-11-17)

Start here in a new conversation. The start prompt is at the bottom (§14).

## Status (2026-11-17 16:36 EST)

- **Drafted, not committed.** House rule: explain before commit.
- **Phase 0 DONE (2026-11-17 18:28 EST).** §3 and §5 are filled below; the owner ruled for a
  full grade-aligned module (`modules/school-math/meta/DECISIONS.md` M1). Phase 1 research started
  18:28 EST; progress in `modules/school-math/meta/PROGRESS.md`.
- **Separate and still open:** the Ms. Wren voice handoff
  (`docs/HANDOFF-2026-11-17-MS-WREN-VOICE.md`). §9 explains how the two fit together.

## 1. The owner's ask (verbatim, 2026-11-17)

> "my first task would be to create a new version of practice problems. I will feed you some
> pictures from my Son's math exam, and we might ahve to create a new set of problems or style
> of math studying approach to complement Best Brains and Kumon."

> "it will be a standalone module like Best BRains and Kumon... Please tell me if Best Brains
> can make him reach there or we need another approach like Singapore Math. If we need another
> approach, please us ethe framework that you used previosuly to build thje approach for Best
> Brains and Kumon starting with reserach and approprioate teacher persona to byuild the
> curriculum and the n bhuild the course / content"

## 2. The goal, and how we will know

His school exam shows two things: **what** his school expects him to do, and **how** it
teaches. "How" means the pictures, models and wording the exam uses. Kumon builds speed with
written methods. Best Brains teaches one concept a week. Neither was built from his school's
approach.

**Goal:** he can do that exam's kind of work, in that exam's formats, right on the first try
and without help.

**How we will know** (Phase 0 sets the measures; Phase 7 checks them):
- **A mock test.** Original items in the school's format, at his grade. He sits it with no help,
  and only first tries count.
- **The real exam's error kinds go down.** Phase 0 sorts his misses into kinds (§3), and each
  kind should shrink.
- **The next real school exam.** The owner sends photos. This is the only true outside check:
  the module never sees it in advance.

## 3. The exam — READ 2026-11-17

**Result** (full table: `modules/school-math/research/phase0/EXAM-READING.md`, no name in it):
- **School curriculum: Math in Focus, Grade 2** (2020 edition, Marshall Cavendish Education,
  a Singapore publisher) — Confirmed, printed on every page.
- Chapter 2 test "Addition Within 1,000", Oct 27, **6/15**. Right on plain two-number column
  sums; wrong whenever the regrouping was hidden (four addends, a missing addend, missing digits
  with regrouping, two numbers from their sum and difference): 0 of 4.
- Best Brains had taught 0 of 8 scored parts by week B6; Kumon fully covers 2 (the plain column).
- Misses: concept 4, explain 1, reading 0, slip 0. One 7-question test: every count is ±1 part.
- The owner's photos are NOT name-covered on two pages; they stay outside the repo and are never
  given to an agent.

**The original instructions for this section:**

- **Photos** live OUTSIDE the repo, at `/home/usthr/Penta_University/Math_Tutor/exam-photos/<date>/`.
  - His name is covered.
  - They are never committed or copied into the repo.
  - Agents work from the written reading below, not from the photos.
- **Reading table.** One row per item, saved as `modules/<id>/research/phase0/EXAM-READING.md`
  with no name in it:

| # | Skill (grade standard) | Format: picture / model / wording | His answer | Mark | Error kind | Best Brains: week, same format? | Kumon? |
|---|---|---|---|---|---|---|---|

- **Error kinds:**
  - concept: the idea isn't there yet;
  - slip: he knows it but made a careless or step-order error;
  - reading: he misread the question;
  - format: he had not seen this kind of picture or model before.
  - Read each wrong answer as a diagnosis: what rule would produce exactly that answer?
    (skill, §5.5)
- **Approach fingerprint:** which teaching approach the exam's formats point to, with a
  Confirmed / Inferred / Speculative label.
  - Clues to look for: number bonds, tape or bar diagrams, ten frames, place-value disks,
    open number lines, "show two ways", "explain your thinking", strategy names.
  - The cheapest evidence is the **name of the school's math curriculum**. The owner may know
    it, or it may appear on the school's site or on homework pages.
- **Verdict:** see §5.

## 4. Where he is now

- **Age 7.** He uses a tablet with the touch number pad. Future students may use a keyboard, so
  every input is built and tested both ways.
- **Kumon:** Level C, stacked 2-digit × 1-digit multiplication. He was on C56 on 11-10, and the
  pass rule has been live since 11-10.
- **Best Brains:** Level B, week 6 (the balance week) on 11-17.
- **School grade and school curriculum:** ask the owner. Neither is in the repo.
- **His name** is never sent to any AI or outside service and never appears in any content.

## 5. Can Best Brains get him there? How Phase 0 decides

**What the Best Brains module covers** (`modules/best-brains/design/curriculum/CURRICULUM-MAP.md`):
- **Level B is about US grades 1–2:** numbers to 120, make ten, the balanced equal sign,
  missing addends, adding and subtracting within 100 with regrouping, bar-model pictures (B15),
  time, money, graphs, arrays, halves.
- **Level C is about grades 2–3:** numbers to 1,000, × and ÷ facts, fractions, area,
  two-step stories.

**Prior, before the photos (to be confirmed or overturned):** Best Brains plus Kumon probably
cover the exam's TOPICS. If there is a gap, it is likely one of three things:
1. **Method or format.** The school may use representations as solving tools: number bonds,
   tape or bar diagrams, place-value disks, open number lines. In Best Brains the child looks at a
   picture and types a number. He never builds the model himself.
2. **"Show or explain your thinking" items.** Best Brains reviews explanations (formative only,
   `modules/best-brains/meta/SPEC-2026-09-22-EXPLANATION-REVIEW.md`), but only on some items.
3. **Pace and order.** Best Brains moves one concept a week from his placement (B6 now). If the
   school is already on 2-digit regrouping, Best Brains reaches it at B13–B14, about 8 weeks
   from now.

**Singapore-style math** is the right candidate when the exam is built on number bonds, bar
models and mental strategies, taught concrete → pictorial → abstract (CPA). Several US
curricula draw on that tradition. Phase 1 verifies with sources which ones do, and whether his
school's does.

**Verdict options.** The owner rules, from an inline table that shows the counts:

| Verdict | When | What gets built |
|---|---|---|
| **A — Best Brains is enough** | Best Brains teaches both the exam's topics and its formats; the gap is pace or a few items | No new module. Re-check placement, add items in the exam's formats, and add a "school mix" review day inside Best Brains as a normal change set. |
| **B — a new method module** | Topics are covered, but the exam's models and reasoning are a method Best Brains doesn't teach (e.g. CPA, number bonds, bar models as a tool) | The standalone module, Phases 1–7 (§6) |
| **C — a school companion** | The exam follows a named school curriculum whose units and order matter more than any outside method | The standalone module, sequenced to the school's units and using its representations (it can be Singapore-style inside) |

**RULED 2026-11-17 (O1/O2):** recommendation C (independently confirmed by a Fable review); the
owner then asked for a FULL curriculum for the new style, aligned to grade levels, that helps
where he is and keeps building. Recorded as DECISIONS M1: a new standalone Singapore-style
module, Grades 1–5 (M2), working id `school-math` (M3). Best Brains cannot get him there alone:
it had taught none of the test and reaches 3-digit addition about 21 weeks after the school.
O3 (daily time), O4 (teacher), O5 (starting point) are still open.

- **Decide by counts, not impressions.** Count the share of exam items whose skill Best Brains
  teaches by his current week, the share whose format Best Brains uses, and his misses by error
  kind.
- **Say plainly** whether Best Brains can get him there.

## 6. The framework: how Best Brains was built, and what this run adds

**The spine** is `modules/best-brains/meta/MASTER-META-PROMPT-v1.md` §4–§10. It worked; keep it.
This run adds Phase 0 at the start and Phase 4.5 in the middle.

| Phase | What | Output (in `modules/<id>/`) |
|---|---|---|
| 0 | The exam reading, coverage counts, fingerprint, verdict | `research/phase0/`; the owner rules |
| 1 FIND | Public-source inventory of the approach the verdict names | `research/phase1-inventory/INVENTORY.md`, "found / not found" lists |
| 2 CHECK | Evidence ledger: every claim labeled Confirmed / Inferred / Speculative, with a confidence level | `research/phase2-gaps/EVIDENCE-LEDGER.md`, `GAP-LIST.md` |
| 3 FILL | Close the top gaps; turn each gap that stays open into an explicit design default | `EVIDENCE-LEDGER-FINAL.md` (frozen), `DESIGN-DEFAULTS.md` |
| 4 TEACHING | A curriculum-architect persona writes the teaching system | `design/curriculum/` METHODOLOGY-MODEL, CURRICULUM-MAP, TEACHER-PERSONA, QUESTION-GENERATOR-SPEC |
| 4.5 ENGINE | The question-generation engine (learning L17) | engine spec plus one exemplar unit through both gates |
| 5 EXPERIENCE | Child flows, parent flows, screen specs, and a Claude Design prompt | `design/experience/` |
| 6 BUILD | Build to the module contract (§7) | code, `build/BUILD-NOTES.md` |
| 7 TEST | Persona evaluators, the mock test, photographs, the battery, self-update | `testing/FINDINGS.md`, `meta/LEARNINGS.md`, the v2 template |

**Additions the Best Brains build learned the hard way.** The improved v2 template was briefed
in `modules/best-brains/meta/FABLE5-METAPROMPT-BRIEF.md` but never written. Carry all of these
from day one:
- **A question engine as its own phase (L17).**
  - Deterministic templates with a seeded random-number generator.
  - Answers are computed by code, never asserted by an AI.
  - A `verifyFor` registry recomputes the claim inside each error-analysis item (L21).
  - Two gates must both pass: the deterministic validator, and an LLM authenticity gate with an
    adversarial re-check (L19–L20, L22).
  - Gates are seed-invariant (L19).
  - Scale exemplar-first: prove one unit through both gates, write the authoring kit, then fan
    out (L23).
  - A coverage ledger, plus a cross-unit context ledger so neighbouring units don't all reuse
    the same story setting.
- **A top-model review at the checkpoints (L18).**
  - Fable makes the verdicts and reviews: Phase 0, the pedagogy-ceiling pass after 4.5, and
    the whole-build completeness critic.
  - Opus does the research fan-out and the build. This is the owner's routing rule.
- **The `tutoring-app-design` skill is binding from the first design doc.** All 21 principles
  and its checklist apply. Above all:
  - record "knows", not "finished";
  - first try, without help, on two separate days;
  - help is a ladder;
  - Check is never locked;
  - read check questions aloud to the young band;
  - a test holds its feedback until the end, and its misses are reviewed afterwards;
  - every picture is the kind of thing its words name.
- **Pictures.** Reuse the Best Brains figure library and its kind gate
  (`scripts/bb-figure-kind-test.ts`). New figures (number bond, tape diagram, place-value disks,
  ten frame, open number line) join that library under the same rule: where the child answers,
  nothing in the picture can be counted or measured in place of the step being asked.
- **If the method is concrete → pictorial → abstract, the child BUILDS the model.** He fills a
  number bond's parts, and sizes and labels bars. Each such surface:
  - is graded (principle: every control must be able to grade what it asks);
  - works on the touch pad and on a keyboard;
  - has a gate with a broken control.

**Research specifics (Phase 1)**, if the verdict names a Singapore-style approach:
- **Public sources:**
  - Singapore's Ministry of Education primary mathematics syllabus;
  - publishers' public scope-and-sequence pages (read them, never copy pages or items);
  - research on CPA, the bar or "model" method, number bonds, and US adoption;
  - parent voice;
  - comparisons with Kumon and Best Brains.
- **If the school's curriculum is named:** read its public family and parent pages. Check the
  licence before using any material for more than reference.
- **External inbox.** The owner may drop deep-research reports from other AI agents into
  `research/external-inbox/`. Adapt Appendix A of the v1 meta-prompt for the approach.
- **Evidence rule.** No design doc may make a factual claim about the approach that is not in
  the frozen ledger. Anything else is tagged `[original design]`.

**Personas (Phase 4).**
- **The curriculum architect** is a design persona, for example: "a primary maths specialist
  trained in the Singapore model method, who has taught US second grade and knows families who
  also do Kumon and Best Brains." It writes the curriculum from the ledger and from his exam
  reading.
- **The child-facing teacher** gets a NEW character with an original name and voice, not
  Ms. Wren, so he can tell which program he is in (owner decision O4). TEACHER-PERSONA.md
  contains:
  - the system prompt;
  - tone rules by age band;
  - a mistake-diagnosis template;
  - the mastery rubric;
  - a parent-summary template.

## 7. Module shape (Phase 6)

- **Standalone, like Best Brains:**
  - research, design and meta docs go in `modules/<id>/`;
  - code goes in `frontend/src/modules/<id>/`;
  - add the id to the `ModuleId` union (`frontend/src/modules/core/contract.ts:17`) and to
    `frontend/src/modules/core/registry.ts`;
  - give it its own route and its own prefixed tables.
  - Migrations go through the Supabase management API and are recorded in
    `supabase_migrations.schema_migrations`.
- **Contract kinds.** The kind unions in `contract.ts` (`unitKind`, the session generator kind,
  the progress kind, the parent report kind) are extended with new kinds, never overloaded.
- **Reuse the plumbing:**
  - auth;
  - the screen harness (`scripts/screen-harness/`);
  - the figure renderer;
  - `ttsService` / `AudioButton`, plus the Azure voice once it is built (§9);
  - the attempt fields: first try, number of tries, monotonic time, whether a scaffold was
    visible, every answer tried;
  - the explanation review;
  - the pattern of the parent pages.
- **Do not inherit** Kumon's worksheet pacing or Best Brains' weekly rhythm unless the
  evidence says this approach uses it.
- **Naming and originality:**
  - The product gets a neutral name of its own. Program names appear only descriptively, in
    docs, and claim no affiliation.
  - Never copy pages, items, characters or layouts.
  - **Never put the school exam's own items in the app.** Write original items in the same
    format.

## 8. Three programs, one child: rules

- **Time.** He already does Kumon and Best Brains every day. The owner sets the daily budget
  for the new module (O3). A day's length is its question count, not a clock.
- **One method per skill across modules.**
  - Keep a cross-module METHOD LEDGER, `modules/<id>/design/curriculum/METHOD-LEDGER.md`: for
    each skill, the method each module teaches. Example: 2-digit subtraction is the column method
    in Kumon, base-ten blocks then columns in Best Brains, and a number bond or tape diagram in
    the new module.
  - Where two modules differ, the new module says the link out loud ("this is the same as the
    column way you do in Kumon"). It never adds a third, unconnected method.
  - The parent is never asked to teach a second method (principle 12).
- **Schedule from weakness.** The first units come from the exam's misses, ordered by error
  kind, not from page 1 of a textbook.
- **Records.** The module writes the same knows-not-finished evidence. The parent page shows
  an exam-skills map: known / learning / not started.

## 9. Order of work with Ms. Wren's voice

**Recommendation:**
1. Do the voice change set first. It is small, and he hears her every day.
2. Build it with a per-teacher voice map, so the new teacher gets a voice for free.
3. Run this module's Phases 0–5 alongside it. They are research and design, with no code.

The owner decides the order.

## 10. Owner decisions (inline tables, never pop-ups)

| # | Decision | When | Default / recommendation |
|---|---|---|---|
| O1 | Verdict A / B / C | end of Phase 0 | from the counts in §5 |
| O2 | Which approach: Singapore-style, school companion, or a hybrid | Phase 0 | from the fingerprint |
| O3 | Daily time and days per week for the new module | Phase 0 | start small and grow from his records |
| O4 | The teacher's character and voice | Phase 4 (voice from the Azure audition) | a new character, not Ms. Wren |
| O5 | Starting point: his exam misses, or a placement check | Phase 4 | from the misses, then a short check |
| O6 | Anything that costs money (books, paid research, paid voices) | any time | public sources only |
| O7 | Each commit, push and merge | each change set | three separate words |

## 11. House rules (binding; the full list is in `docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md`)

- **Explain before commit:** show the exact pathspec and contents, then wait for the owner's
  word. Commit, push and merge are separate instructions.
  - Push with `git push origin best-brains-content-engine:best-brains-content-engine`.
  - Squash-merge the PR, then reset the branch onto main and push with `--force-with-lease`.
- **Never send the child's name** to an AI or an outside service.
  - The exam photos never enter the repo.
  - Agents read `EXAM-READING.md`, not the photos.
- **Gates have broken controls** that must be seen to fire. Existing debt becomes a ratchet:
  counts may fall, never rise.
- **The battery runs serially.** This is a 4 GB machine: 1–2 agents at once. Run `tsc` at most
  twice per change set and disclose any extra runs. The 29 existing runs must stay green, and
  the new module's gates join the battery.
- **Every screen change is rendered in the harness and looked at** (photographed). Every audio
  change gets sample files the owner listens to.
- **Verify live** by grepping the deployed bundle (mindfoundry.netlify.app).
- **Fan-out workflows** in `modules/best-brains/build/workflows/` run only on the owner's word.
- **Decisions go in inline tables with a recommendation.** Ask before anything that costs money
  or changes his records.

## 12. New gates this module needs (each with a broken control)

- **Picture kind.** The kind gate covers every new figure on every surface.
- **Model inputs** (bond, bar) grade what they ask, on touch and on a keyboard.
- **Spoken lines** never give the answer. This extends `bb-spoken-answer-test`.
- **No name** in content or in outbound text.
- **Exam coverage.** Every exam skill maps to at least one unit and at least one mock-test item.
- **Method ledger.** Every skill in the curriculum map has a method-ledger row.

## 13. Read first, in order

1. This file.
2. `docs/HANDOFF-2026-11-10-KUMON-TEACHING-PLAN.md`: house rules, the battery, the devices.
3. The skill `tutoring-app-design`.
4. `modules/best-brains/meta/MASTER-META-PROMPT-v1.md`: the spine.
5. `modules/best-brains/meta/FABLE5-METAPROMPT-BRIEF.md`: the v2 additions.
6. `modules/best-brains/meta/LEARNINGS.md` (L17 onward) and `DECISIONS.md`.
7. `modules/best-brains/design/curriculum/CURRICULUM-MAP.md` (Levels B and C), for the coverage
   table, and `TEACHER-PERSONA.md`, as the model for the new persona.
8. `docs/methodology/PROGRAM-COMPARISON.md`. The new approach becomes a column at the end.
9. `frontend/src/modules/core/contract.ts` and `registry.ts`.
10. Memory: `mindfoundry-picture-kind.md`, `mindfoundry-recall-not-lookup.md`,
    `mindfoundry-parent-like-instructor.md`, `mindfoundry-new-math-approach.md`.

## 14. Start prompt (paste into a new conversation)

Use Fable for Phases 0–4.5 and the reviews, and Opus for the build.

```
Continue MindFoundry: the third teaching module (repo
/home/usthr/Penta_University/Math_Tutor/MindFoundry, branch best-brains-content-engine).
Read docs/HANDOFF-2026-11-17-NEW-MATH-APPROACH.md first and follow its reading list (§13).

The exam photos are in /home/usthr/Penta_University/Math_Tutor/exam-photos/ (outside the
repo; never commit or copy them; my son's name is covered and must never appear anywhere).

If §3 and §5 of the handoff are filled and my verdict is recorded, start at Phase 1 for the
approach I chose. If not, run Phase 0 only and stop: the exam reading table, the coverage
counts against Best Brains and Kumon, the approach fingerprint with confidence labels, and
verdicts A/B/C as an inline table with your recommendation. Tell me plainly whether Best
Brains can get him there, then wait for my word.

From Phase 1 on, run the Best Brains pipeline as the handoff lays it out: research, evidence
ledger, design defaults, the curriculum-architect and teacher personas, the curriculum, the
question engine (one exemplar unit through both gates before any fan-out), the experience
design, the build to the module contract, and the persona tests with a mock test in the
school's format. Stop for my word at each owner decision in §10. Fable for verdicts and design
reviews, Opus for research fan-out and build. Show me the exact pathspec before any commit.
```
