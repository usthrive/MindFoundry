# MICRO-ANIMATIONS-SPEC — motion for the lesson figures

Written 2026-08-20 by the design session, for a standalone Opus execution session.
Owner approved the program ("micro animations could be good, we can try") AFTER the
corpus-wide figure fill (scene debt 119 → 7, commit `d157c45`).

## 0. The tension this spec resolves — read before coding

The figure system's own history argues AGAINST animation, and the argument is recorded in
`786f8a8`: "Stepping the lesson IS the motion, and a pre-reader can dwell on the middle
state, which a playing animation denies him." That argument is honoured, not overruled:

- Motion is a PATH TO the verified still, never a replacement for it. Every animation ends
  at exactly the static render, and the resting picture is what the child dwells on.
- Motion plays ONCE, on segment entry, briefly. The child's step-through remains the
  primary motion; the micro-animation is the teacher's hand moving once as the board
  settles.
- A child who cannot or should not watch motion loses NOTHING: reduced-motion shows the
  still immediately, and the still carries the full teaching by construction (it already
  passed every gate before animation existed).

## 1. Hard laws — each is a gate check, none may be weakened

L1 **End-state identity.** With animations enabled, the figure's final resting geometry is
   byte-identical to the static render. Implementation must make this structural: animation
   is ADDITIVE (CSS classes/keyframes over the same SVG elements), never a parallel render
   path. The gate strips animation-only attributes/classes and compares markup to the
   `animate=false` render — exact match or fail.

L2 **Once, on entry, never looping.** An animation runs once when its lesson segment
   becomes active. Re-entering the segment (child steps back, then forward) replays it —
   that is the child's control, which is the dwell principle in action. No loop, no idle
   motion, no attention-pulling repeat.

L3 **Reduced motion = the still, immediately.** `prefers-reduced-motion: reduce` disables
   all figure motion. No fade-substitutes: the finished picture, at once.

L4 **Brief and calm.** Total duration per figure ≤ 900ms, single ease-out family, no
   bounce, no overshoot, nothing moves that the segment's say does not describe moving.

L5 **LESSON SURFACES ONLY.** LessonRoom script segments animate. Item surfaces (practice,
   mastery, warm-ups, puzzle, sprint) NEVER animate — watching a carry digit appear IS the
   answer on an assessment page; the dangerous figure is the helpful one (L33). Guided
   examples: out of scope this pass (most have no figures yet).

L6 **No new dependencies, no bundle growth.** CSS keyframes/transitions on SVG elements,
   authored inline in the renderer components. No animation library, no SMIL. Bundle delta
   after `npm run build`: entry chunk grows ≤ 10 KB gzip or the change is wrong.

L7 **No content morphing.** Only opacity, transform (translate/scale), and
   stroke-dashoffset draw-on. Text never changes mid-animation; nothing is redrawn as
   something else.

## 2. The five treatments

Each renderer takes an optional `animate?: boolean` prop (default false → exact current
behaviour; every existing call site is untouched).

1. **BaseTenBlocksFig — `connector: 'becomes'` pairs only.** The `highlight`ed pieces of
   the before-state fade/slide a few units toward the arrow as the arrow draws itself
   (dashoffset), then the after-state fades in. `beside` pairs do NOT animate — a
   comparison is not a change. (B2's "ten cubes magnetize into a rod" is the flagship:
   the ten highlighted ones dim as the fused rod arrives.)
2. **NumberLineFig — hops.** Hop arcs draw sequentially (dashoffset), each landing mark
   scaling 0.85 → 1 as its arc lands. Marks/flags without hops just fade in.
3. **ColumnMethodFig.** Stagger in algorithm order: operand rows visible at once → strike
   lines draw → carry/borrow digits drop in from just above their column (4–6 units) →
   rule line draws → result digits fade in. Blank result rows (the answer-unwritten form)
   end the sequence at the rule.
4. **MathSentenceFig.** Tokens visible at once; pen-marks (ring/underline/box) draw
   themselves via dashoffset afterwards — the teacher circling while talking. For `then`
   lines: connector arrow draws, second line fades in. `and` (peer) lines fade in together
   with no arrow.
5. **BarModelFig.** Minimal by design: the brace and its total label fade in last
   (~200ms), after the bars are already present. Bars do not slide — a quantity arriving
   from off-screen is motion the say never describes. (If this feels too subtle in review,
   escalate rather than embellish.)

## 3. The trigger

LessonRoom passes `animate` to `BBFigureView` (which forwards to the primitive) keyed to
the active segment index, so mount/re-mount on segment change restarts CSS animations
naturally. No timers in React state; the CSS owns the timeline. `PromptFigure` and every
other call site never pass `animate` — enforced by the gate, not by convention.

## 4. The gate — `scripts/bb-animation-test.ts`, joining the battery

1. **L1 end-state identity**: for every animated render case (extend the figure-render
   CASES), render `animate=true`, strip `data-anim` classes/attributes and `<style>`
   keyframe blocks, byte-compare against `animate=false`. Exact or fail.
2. **L3**: rendering with the reduced-motion flag set produces zero animation classes.
3. **L4**: parse declared durations/delays per figure; total ≤ 900ms or fail.
4. **L5**: static scan — `animate` is passed from LessonRoom only; any other call site
   passing it fails the gate with the file named.
5. Existing battery must stay green untouched — the static path is unchanged by
   construction, and `bb-figure-render-test` proves it.

## 5. Escalation list — STOP and bring these to the owner (for the Fable design session)

- Any animation that cannot satisfy L1 for a case: DROP the animation for that case and
  record it; escalate only if the drop guts a whole treatment.
- Any change to figure params, types.ts, assert.ts, or anything under `generator/` —
  schema and gates are orchestrator territory, not this build's.
- Any new dependency, any bundle growth past L6, any SMIL/JS-timeline temptation.
- Any urge to animate an item surface or guided example — out of scope, full stop.
- LessonRoom behavioural changes beyond the `animate` pass-through of §3.

## 6. Ship checklist (house rules, non-negotiable)

tsc to completion · full battery + the new animation gate · `npm run build` with the
bundle-delta check · explain-before-commit to the owner (exact pathspec) · push · PR →
`gh pr merge --squash` (plain `git merge` is blocked) · **reset the branch onto main after
the squash** (`git checkout -B best-brains-content-engine origin/main` + push
`--force-with-lease`) · **NOTHING auto-deploys this site**: build, zip `frontend/dist`,
POST to the Netlify API with the token from the Windows CLI config (see
`~/.claude/projects/-home/memory/mindfoundry-figure-fill.md` for the exact path), verify
the live entry-chunk hash equals the local dist before reporting done.
