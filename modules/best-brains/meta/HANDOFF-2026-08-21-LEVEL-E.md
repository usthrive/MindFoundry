# HANDOFF 2026-08-21 — Level E fill, resuming at E15

Written at the end of the session that shipped **E14** (`9c35da5`). Supersedes the deltas in
`HANDOFF-2026-08-12-LEVEL-E.md` (which still reads E at 3/24); that file's method sections stand.

---

## 1. Where the corpus actually is

**109 of 120 weeks.** A 23/24 (a15 missing) · B 24/24 · C 24/24 · D 24/24 · **E 14/24**.

Level E holds: E1–E11, E13, **E14**, E21.

| Missing | Concept (catalog) | State |
|---|---|---|
| **E12** | Equivalent expressions | unblocked · **R-flagged** (prove-in-general is the open part) |
| **E15** | Inequalities | unblocked · **cheapest next** |
| **E16** | Proportional relationships | unblocked |
| **E17** | Percent applications | unblocked |
| E18 | Area of polygons | **BLOCKED — no geometry family** |
| E19 | Circles | **BLOCKED** · also R-flagged (measure-π lab) |
| E20 | Surface area & volume | **BLOCKED** |
| **E22** | Data displays | unblocked · R-flagged (build-a-histogram) |
| **E23** | Probability | unblocked · R-flagged (invent-a-fair-game) |
| **E24** | Pre-algebra capstone | unblocked · R-lite |

**Why E15 is the cheapest next week:** every generator its recipe needs already exists in
`templates/lib/algebra.ts` — `solveInequality('one'|'two')`, `readInequalityGraph()`,
`openOrClosedDotTrap()`, `eaFlipWhenAdding()` and the registered `e_alg_verify_flip_v1`. It is
blueprint-only, and inequalities continue the balance thread E13 → E14 has been building: the same
model with the beam allowed to rest over instead of level.

**The E18–E20 blocker is an owner decision, not a week.** There is no geometry family in
`templates/lib/` (the "G9" that was planned and never built, the way G5 was built before E6). Area,
circles and surface-area/volume all need computation those four families cannot do. Building one is
a shared-library commitment: design, the exact-arithmetic audit `compute.ts` demands, registered
template defs, then a full battery. **Do not start it inside a week.**

---

## 2. Read these before writing a line

1. `modules/best-brains/build/FILL-AGENT-BRIEF.md` — the standing contract. **§4a is band E** and
   carries `GATE_PROFILE.E`, every row of which is a floor.
2. `modules/best-brains/build/FANOUT-KIT-LEVELS-ABCE.md` — §B gate profile, §C the dose arithmetic,
   §E2 the traps (read §E2.2, §E2.3, §E2.8, §E2.9a, §E2.11 in full), §F the unchanging rules,
   §G the self-verify command.
3. `modules/best-brains/build/FILL-ARCHITECTURE.md` **§6** — the per-week recipe row for the cell
   you are authoring, and §7 if it is R-flagged.
4. `frontend/src/modules/best-brains/generator/templates/weeks/e13.ts` and **`e14.ts`** — the two
   on-thread exemplars. E14 is the more recent and carries the newer decisions in its header.
5. `frontend/src/modules/best-brains/content/catalog.ts` — `LEVEL_E`, for the cell's conceptId,
   concept name and strand tags. The builder's `conceptId` must match it exactly.

---

## 3. What E14 established, that the next week inherits

**A library gap was closed rather than routed around.** `errorAnalysis` refuses an authored wrong
number — it recomputes both values from a registered `verifyFor`. E14's recipe named a step-order
slip with no transform to compute it, and it is genuinely not derivable from
`d_verify_binop_misconception_v1` (an operation swap over a fixed operand pair cannot produce
`(c−b)/a` against `c/a − b`). So `e_alg_verify_step_order_v1` was added to `lib/algebra.ts`:
strictly additive, one function plus one registered id, and the FULL battery re-run because a
shared file changed. Precedent for the call is in that same file — `verifyMisgroup`'s comment
records it being made for E11.

**The rule this sets:** prove impossibility properly first (kit §E2.3's preference order, ten
minutes on the identity), and if the recipe's own item is genuinely unbuildable from what exists,
adding the transform beats borrowing a sibling's misconception — but it is a shared-file change,
so it triggers the full battery and belongs to whoever is holding the orchestrator role.

**The verify gap that remains is the OPERAND swap** (E4's inverted fraction, E5's LCM). Untouched.

---

## 4. The verification protocol, in order

Run every step. Steps 4 and 6 are the ones that found real defects this session.

1. **200-seed sweep** (kit §G) — import YOUR OWN builder, never `packGenerator`:
   ```bash
   cd frontend && npx tsx -e "
   import { buildE15 } from './src/modules/best-brains/generator/templates/weeks/e15';
   import { validatePack } from './src/modules/best-brains/generator/validator';
   let bad = '';
   for (let i = 0; i < 200; i++) { const s = i * 13 + 3;
     try { const p = buildE15(s, '1.2.0'); const r = validatePack(p, { contract: 'v2' });
       if (!r.valid && !bad) bad = 'INVALID seed ' + s + ': ' + r.violations.map(v => v.gate + '@' + v.path).slice(0,3).join(' | '); }
     catch (e) { if (!bad) bad = 'THROW seed ' + s + ': ' + e.message; } }
   console.log(bad || 'E15 SEED-INVARIANT: 200 seeds, 0 throws, 0 invalid');"
   ```
2. **Wire it**: `npx tsx scripts/bb-wire-weeks.ts` (rewrites the four marked regions of
   `packGenerator.ts`; never hand-edit them).
3. **`npx tsc` to completion, reading the WHOLE output** — pipe to a file and `cat` it. A piped
   grep has produced a false clean for two authors, and this session hit a genuine mid-edit parse
   error that only the full output showed.
4. **READ THE SERVED WEEK**: `npx tsx scripts/bb-dump-pack.ts E 15 <seed> /tmp/e15.json`, then read
   every prompt. Both of this session's real defects were found here and by nothing else.
5. **Full battery** — all 15 `bb-*` scripts, run **from `frontend/`** (they fail from the repo
   root). ~3.5 min on this machine. Mandatory in full if any `lib/` file changed.
6. **Measure, do not reason about:**
   - any metacognition probe's **served** split (kit §E2.9a — a probe has no answer key, so no gate
     can see it), plus one blind habit that could answer it;
   - the mastery slots' blind strategies: key-in-prompt, key = largest, key = smallest, across
     ≥200 seeds × all slots.
7. **Collision scan at the END, not the start** (kit §E2.8): grep the weeks directory for every
   real-world noun your prompts use and re-dress what collides.

---

## 5. Traps this session paid for

- **A metacognition probe can be a 100% giveaway and every gate stays green.** E14's first version
  asked "nearer five or nearer fifty?" over an answer drawn 6–24. Re-framed to straddle a dozen
  with the boundary value never drawn; served split then measured at 48.5/51.5 over 800 items.
- **`countNoun` pluralises the LAST word.** `'skeins of yarn'` printed "227 skeins of yarns". A noun
  phrase must end in its head noun.
- **The collision scan is about the SCENE, not the noun.** E14's first draft cut a ribbon (22
  sibling weeks already cut one), hired a coach (e03 fills one with passengers) and counted mosaic
  pieces — and e10 builds a mosaic border on the very same `a·x + b` shape. Re-dressed to guttering,
  a river trip and yarn skeins. `kayak`, `guttering` and `skein` were clear; `cord` (92 files) and
  `bead` (23) were not.
- **The gate wants the `conceptualAnchor` VERBATIM inside `whyBeforeHow`** (`pedagogy.ts` §6.9 does
  a `.includes()`), and a causal clause in the first 60%. Keep the anchor phrase short enough to sit
  inside a sentence naturally.
- **Escaping, when editing with a python heredoc:** an apostrophe inserted into a single-quoted TS
  string breaks the file, and `tsx` will fail with an esbuild error whose line number moves as you
  edit. Prefer the Edit tool for prose changes.
- **The shell's cwd persists between calls.** `npx tsx -e` with relative imports must run from
  `frontend/`.

---

## 6. Reported, not fixed

- **`twoStepEquation` (lib/algebra.ts)** draws `b = a + 1…20` independently of the product, so it
  can serve *"2 rows of seats with the same number in each, and 17 seats stay loose, 23
  altogether"* — sound arithmetic, lopsided scene. Affects E13 and E14.
- **`requireSimplestForm` is dead code** — every "simplest form" item is graded on value alone
  (carried over from the earlier fill; still open).
- Two gates are knowingly blind and both are owner decisions: `bb-spoken-answer-test` cannot see the
  compound-word leak (deliberate tokenizer choice), and QG-11's option branch catches a mis-keyed
  card only incidentally.

---

## 7. Repository state

- Branch `best-brains-content-engine`, at **`9c35da5`** (E14) — **NOT PUSHED**.
- `origin/main` is at `6770b03` (the Kumon Level-C work), which **is** pushed and **is** live:
  production entry chunk `index-BfMjZTLx.js`, sha256 `614446810729c9e2…`, verified against the
  local dist.
- Working tree clean at handoff. **Nothing auto-deploys this site** — a deploy is always a manual
  zip + Netlify API POST (`zip` is not installed in this WSL; use python's `zipfile`).

## 8. Other threads left open

1. **Push `9c35da5`** — a separate instruction from committing, by house rule.
2. **The Kumon return queue** — the designed-but-unbuilt piece that turns checking the times-table
   card into remembering it: any fact peeked, wrong, or slow returns ~5 problems later and seeds the
   next sheet, retiring after two clean unaided answers. Everything it needs exists (`tableChecked`
   is recorded per attempt; mixed sheets are now a deterministic walk that can be biased toward owed
   facts). The owner is watching his son use the card first — build it against what he actually did.
   See `[[mindfoundry-times-tables-support]]`.
3. **The Fable verdict session** on the micro-animations (`d46c81d`), owed since the spec was
   written.
