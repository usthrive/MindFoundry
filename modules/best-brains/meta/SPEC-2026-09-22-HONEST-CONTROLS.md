# SPEC 2026-09-22 — honest answer controls, prompt lines, true/false form, and the gate

Owner ruling 2026-09-22 ("I am ok with all"): from item B3-D5-03 (Level B, Day 5,
Grove): a three-claim prompt in one paragraph, a bare "Your answer / Check" box
for an item nothing grades, no format guidance. Fix the class, not the item, and
add a gate so it cannot recur. Module: `frontend/src/modules/best-brains`.

Verified facts (REPORT-2026-09-04 §11 will carry them): `promptText()`
collapses whitespace (figures/prompt.ts:33-39); `manual-review` → `{correct:true,
ungraded:true}` (answers.ts:99); band A gets "I did it!" (AnswerEntry.tsx:72-109),
bands B/C fall to the text branch (AnswerEntry.tsx:141-177) via `TYPED_VALIDATIONS`
(inputSurface.ts:28-38); 147 manual-review items, 0 with choices, 0 in the mastery
check; the stored `answer` column is read by nothing; BB-G2 (pedagogy.ts:266-272)
REQUIRES one such item per pack; B3-D5-03 and C13-D5-02 are the only prompts with
≥2 comparison sentences.

## PIECE 1 — prompts may carry lines

1. `figures/prompt.ts promptText()`: preserve single `\n` (collapse runs of spaces/
   tabs only; collapse 2+ newlines to one). `speakablePrompt()`: a `\n` becomes
   `. ` so the voice pauses (keep any existing symbol-to-speech handling).
2. Every element that renders `promptText(...)` as text gets `whitespace-pre-line`
   (callers: PracticePage, WarmUp, PuzzleGrove, TreasureChest, SprintRun,
   PlacementActivity, GuidedPractice, CheckRunner, AnchorPanel, BBScratchPad —
   check each; a caller that only measures text needs nothing).
3. A line that starts with `• ` renders as it is (the bullet is authored text).

## PIECE 2 — honest controls for text-shaped answers (bands B and C)

In `components/AnswerEntry.tsx`, BEFORE the typed branch:
- `manual-review` (band ≠ A): a 2-row `<textarea>` (min-h 96px, same border
  styling), placeholder band B "In your own words…" / band C "Explain in a
  sentence or two.", aria-label "Your explanation"; primary button **"Tell Ms.
  Wren"** (disabled when empty); secondary button **"I said it out loud"** that
  submits the literal `said-aloud`. NO "Check" anywhere on this form.
- Typed graded forms keep "Check" but the placeholder says the shape:
  `short-text-keyword` → "A few words"; `ordered-list` → an example in the exact
  separator `listEqual` accepts (read answers.ts and use it, e.g. "e.g. 3, 7, 12");
  `set` → same; `number-sentence` → "e.g. 4 + 3 = 7" (read answers.ts for what it
  accepts); numeric → "Your answer". Export `placeholderFor(validation, band)` so
  the gate can assert it.
- `inputSurface.ts`: add `{ kind: 'explain' }` returned for manual-review at bands
  B/C (mirror of the new branch, in the same order); `describeSurface` updated.
  `scripts/bb-answerability-gate.ts` must treat 'explain' as satisfiable (read it).

## PIECE 3 — a true/false form: validation `truth-set`

- `types.ts`: `AnswerValidation` += `'truth-set'`; `PackItem` += `statements?:
  string[]` (the claims, in order, ≥2). `answer.value` = `T`/`F` per statement
  joined by `,` (e.g. `T,F,T`), `acceptableForms: []`.
- `answers.ts`: `truth-set` — normalise the given (split `,`, trim, first letter
  upper-cased, `TRUE/YES`→T, `FALSE/NO`→F) and compare to `value`; graded.
- `generator/validator.ts`: `VALIDATIONS` += `truth-set`; S-SCHEMA: `statements`
  present with length ≥2 and equal to the value's token count, tokens only T/F,
  at least one T and one F (a set that is all-true or all-false is guessable).
  QG-5 skips answer recomputation for it (as for manual-review — check `answerFor`).
- `generator/templates/lib/items.ts`: `judge({ prompt, statements: Array<{ text,
  truth }>, hints, errorTags })` → type `'reasoning'`, strand `'noncomputational'`,
  validation `truth-set`, `statements` texts, value from truths. Make sure
  `emitItem` (templates/shared.ts) and `ItemDraft` carry `statements` through.
- `inputSurface.ts`: `{ kind: 'truth', n }` for truth-set at every band (after the
  choices rule). `AnswerEntry`: one row per statement — the statement text (≥ text-lg,
  2xl at band A) and two toggle buttons **True** / **False** (min 48×48, selected =
  filled primary, unselected = white with border; aria-pressed); a **Check** button
  enabled only when every row is chosen; submit `T,F,…`. Speech: `speakablePrompt`
  callers pass the prompt; add the statements to the spoken text as "Sentence one:
  62 is greater than 58." (map `>`→"is greater than", `<`→"is less than", `=`→"equals";
  find any existing symbol-speech map first and reuse it).
- `figures/prompt.ts`: nothing else.
- Content: `weeks/b03.ts` — replace `reasoningProveOrFix` with
  `judge({ prompt: 'Which sentences are true?', statements: ['62 > 58','71 < 68',
  '45 = 45'] with truths [T,F,T], hints: keep the two, errorTags: keep })`. Then
  run `generatePack('B',3,1262874861,'1.2.0')` and `validatePack` to prove the pack
  still builds (BB-G2 is still met by B3-D5-02, manual-review). `weeks/c13.ts`
  D5-02: read it; if it is the same "which are true" shape convert it to `judge`,
  otherwise rewrite its prompt with `\n• ` lines.
- Every script under `frontend/scripts/` that enumerates validations (grep
  `'choice-key'`) must handle `truth-set` sensibly (guessability: 2^n−… options;
  spoken-answer: the value is never in the prompt; readability: statements count as
  prompt text). Do NOT run the battery; make the code paths total and report which
  scripts you touched.

## PIECE 4 — the gate (`scripts/bb-screen-contract-test.ts`), with controls

Add, each with a `--selftest` control that proves it fires:
- `control-honesty` (strict): for every served item at its level's band,
  `inputSurfaceFor` must not return `text`/`pad` for `manual-review` (only `ack` or
  `explain`), and must return `truth` for `truth-set`.
- `multi-claim-prompt` (strict): a prompt with ≥2 matches of `/\d+\s*[<>=≠≤≥]\s*\d+/`
  or ≥2 of `/\b(sentence|statement)\b/i` must be `truth-set` or contain `\n`.
- `typed-format-hint` (strict): for every typed surface kind, `placeholderFor`
  returns something other than "Your answer" unless the validation is numeric.
- `prompt-lines-render` (strict, source check): every file under `src/modules/
  best-brains` containing `promptText(` in JSX text position also contains
  `whitespace-pre-line`; and `promptText('a\nb')` still contains `\n`.
- `run-on-prompt` (report-only census): prompts > 220 chars or with ≥3 imperative
  sentences (`/\b(Write|Fix|Tell|Draw|Then|Show|Explain)\b/g` ≥3), count per level,
  top 10 ids with 100 chars each. Owner reads it.

## Rules for the builder
tsc at most twice, whole output read. No battery, no vite build, no dev server
(the verifier photographs and runs the battery). Explain-before-commit: do NOT
commit. Report: files changed, the b03/c13 item as generated (prompt, statements,
value), the placeholder table, which scripts enumerate validations and what you
did in each, and anything you could not verify.
