# SPEC 2026-09-22 — Ms. Wren reads the explanation (AI review of manual-review items)

Owner ruling 2026-09-22: option (a) — grade and coach. When a band B/C child taps
"Tell Ms. Wren" on a `manual-review` item, the sentence is read by Claude
against the item's own rubric; the child gets Ms. Wren's line (and a hint if
needed); the verdict is stored and shown to the parent. Formative only: it never
touches a score, a day's accuracy, or the weekly gate. Band A items are NOT
sent (make/show/tell tasks answered away from the screen).

Facts (verified): the only LLM edge function is `supabase/functions/ai-service/
index.ts` (Anthropic SDK `npm:@anthropic-ai/sdk@0.36.3`, key `ANTHROPIC_API_KEY`
as a Supabase secret, JWT checked in-function via service-role client, no quota,
no timeout, `ai_usage_log` written but NEVER CREATED by any migration, plain-text
JSON parsed by `parseJsonResponse()`). Frontend calls it with raw `fetch` +
`Authorization: Bearer <access_token>` + `apikey` (`frontend/src/services/ai/
edgeFunctionClient.ts:197-203`). Persona rules: `modules/best-brains/design/
curriculum/TEACHER-PERSONA.md` (band A ≤10 words/sentence; B avg ≤15; C natural;
never "wrong"; Acknowledge → Locate → Guide → Re-attempt). Feedback copy shapes:
`copy.ts` CONFIRMS / MISS_OPENER / puzzleClose.

## 1. Shared prompt module (one source for the function AND the eval)
`supabase/functions/ai-service/review-prompt.ts` — NO imports (Deno and tsx both
load it). Exports:
- `interface ReviewInput { band: 'B'|'C'; level: string; conceptName: string;
  prompt: string; modelAnswer: string; acceptableForms: string[]; hints: string[];
  errorTags: string[]; whyBeforeHow: string /* pack.explanation.whyBeforeHow,
  truncated 900 chars */; childText: string /* ≤500 chars */ }`
- `interface ReviewVerdict { verdict: 'got-it'|'partly'|'not-yet';
  line: string /* Ms. Wren, ≤2 sentences, band voice */; nudge: string|null
  /* one question, only for partly/not-yet */; reason: string /* ≤120 chars,
  parent-facing, never shown to the child */ }`
- `buildReviewSystem(band)`: the Ms. Wren persona for THIS task, distilled from
  TEACHER-PERSONA.md (warm, specific, never "wrong", never the answer for
  not-yet, band sentence limits, no praise inflation, treats "said-aloud" and
  empty text as `not-yet` with a gentle line asking to say it in words).
- `buildReviewUser(input)`: rubric block (model answer, accepted forms, hints,
  error tags, the why) + the child's text, and an instruction to answer ONLY
  with a JSON object of the ReviewVerdict shape.
- `parseReviewVerdict(text): ReviewVerdict` — strips fences, validates every
  field and enum, throws on anything else. Line length enforced: if the line
  breaks the band's sentence rule, fall back to a band-appropriate canned line
  (`FALLBACK_LINE[band][verdict]`, also exported) rather than showing it.

## 2. Edge function: operation `reviewExplanation`
In `index.ts`, following the existing `{operation, params}` switch:
- Model: **`claude-sonnet-5`** (add to MODELS as `sonnet5`). `max_tokens: 400`.
  Do NOT pass `temperature` (rejected on Sonnet 5). Use `anthropic.messages.create`
  exactly as the other operations do — do not change the pinned SDK version or
  any existing operation.
- Timeout: `anthropic.messages.create(..., { timeout: 6000 })` if the pinned SDK's
  per-request options support it (it does — `RequestOptions.timeout`, ms);
  otherwise wrap in `Promise.race` with a 6 s rejection. On timeout/error return
  `{ verdict: 'unavailable' }` with HTTP 200 (the client shows the ack line).
- Quota: before calling the model, count today's rows in `bb_explanation_reviews`
  for `child_id`; if ≥ 10, return `{ verdict: 'unavailable', reason: 'quota' }`.
- Params: `{ childId, packId, itemId, day, band, level, conceptName, prompt,
  modelAnswer, acceptableForms, hints, errorTags, whyBeforeHow, childText }`.
  Verify the caller's JWT user is a parent of `childId` (children.parent_id —
  read how the other operations check ownership and mirror it).
- After a verdict: insert into `bb_explanation_reviews` (service role) and into
  `ai_usage_log` with feature `reviewExplanation`, model, tokens. Log failures
  are non-fatal.
- Never send the child's name; the prompt contains item data + childText only.

## 3. Migration `supabase/migrations/20260922000001_bb_explanation_reviews.sql`
- `ai_usage_log` — create IF NOT EXISTS with the columns the function already
  writes (`child_id uuid, feature text, model text, input_tokens int,
  output_tokens int`) plus `created_at timestamptz default now()`, RLS on,
  no client policies (service role only).
- `bb_explanation_reviews` (`id uuid pk default gen_random_uuid(), child_id uuid
  references children, pack_id text, item_id text, day int, child_text text,
  verdict text check in ('got-it','partly','not-yet'), line text, nudge text,
  reason text, model text, input_tokens int, output_tokens int, created_at
  timestamptz default now()`), index (child_id, created_at), RLS on, SELECT
  policy for the child's parent (mirror the policy pattern used by
  `bb_item_attempts` in `20260719000001_bb_module_schema.sql`).

## 4. Frontend
- `frontend/src/modules/best-brains/services/bbReviewService.ts`:
  `reviewExplanation(input): Promise<ReviewVerdict | { verdict: 'unavailable' }>`
  — same fetch/auth shape as edgeFunctionClient (do not import that class; copy
  the 12 lines), `AbortController` at 7 s, never throws. Builds the input from
  `PackItem` + `pack.explanation` + band. `listExplanationReviews(childId,
  packId)` for the parent report (RLS-scoped select).
- `AnswerEntry` explain form: unchanged controls; while the review is in flight
  the "Tell Ms. Wren" button shows "Ms. Wren is reading…" and is disabled (band C
  text "Reading…"); the textarea stays visible with the child's words.
- `PuzzleGrove.tsx` and `PracticePage.tsx` `handleAnswer` for `manual-review` at
  band B/C: record the attempt as today (correct:true, ungraded) THEN call the
  review. Verdict handling:
  - `got-it` → WrenBubble with `line`, button "Next" (existing confirm path).
  - `partly` / `not-yet` → WrenBubble with `line` + `nudge`, TWO buttons:
    "Try once more" (re-opens the explain form with the child's previous text
    kept; a second verdict is final — after it, only "On we go") and "On we go".
    Never a third review per item (client-side guard).
  - `unavailable` → today's acknowledgement line, unchanged.
  - `said-aloud` → skip the review entirely (nothing to read), today's ack line.
  Band A: untouched (never reaches this branch).
- Parent report `screens/parent/WeeklyReport.tsx`: a section "In their own
  words" listing, per review: the item's prompt (first 90 chars), the child's
  text, the verdict as a plain word (Got it / Getting there / Not yet), and
  `reason`. Hidden when there are none. Uses `listExplanationReviews`.

## 5. Eval `frontend/scripts/bb-review-eval.ts` (run by hand, NOT in the battery)
- Imports `review-prompt.ts` via a relative path, and `@anthropic-ai/sdk` from
  frontend's node_modules (add it as a devDependency if absent — check first).
  Reads `ANTHROPIC_API_KEY` from env; exits 2 with a clear message if unset.
- 20 fixtures: 5 real items (B3-D5-02 chestnut trays, C13-D5-02, D1-D5-01,
  one Level E manual-review, one more Level B) × 4 child answers each — a
  correct one in child words with a spelling slip, a partial one, a plausible
  wrong one carrying the item's own misconception, and one off-topic/gibberish
  — each with an expected verdict. Generate the items with `generatePack`.
- Prints a table (item, child text, expected, got, line, nudge) and an accuracy
  count; exits 1 if accuracy < 16/20. Prints total input/output tokens and the
  cost at $2/$10 per MTok.

## 6. Gate
`bb-screen-contract-test`: report-only census `review-rubric` — every band B/C
manual-review item's rubric strength (has modelAnswer, #acceptableForms, #hints);
list items with an empty modelAnswer (they would be unreviewable).

## Builder rules
tsc at most twice (default config; `scripts/` is not type-checked by it — also
run `npx tsc --noEmit -p` a temp config that includes scripts/bb-review-eval.ts
once, or run the eval's import path with `npx tsx scripts/bb-review-eval.ts`
WITHOUT a key to prove it resolves and exits 2). Do NOT run the battery, vite,
or a dev server; do NOT deploy the function or apply the migration; do NOT
commit. Report ≤ 900 words with file:line, and the exact commands to deploy
(`supabase functions deploy ai-service`, `supabase db push`) plus the SQL of the
migration in full.
