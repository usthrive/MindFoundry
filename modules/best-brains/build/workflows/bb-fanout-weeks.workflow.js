export const meta = {
  name: 'bb-fanout-weeks',
  description: 'Author Level-D v2 blueprints (one agent per week) following the fan-out kit; each self-verifies seed-invariant',
  phases: [{ title: 'Author', detail: 'one agent per week writes + self-verifies its dNN.ts' }],
}

const ROOT = '/home/usthr/Penta_University/Math_Tutor/MindFoundry'
const G = `${ROOT}/frontend/src/modules/best-brains/generator`
const parsed = typeof args === 'string' ? JSON.parse(args) : args
const WEEKS = Array.isArray(parsed) ? parsed : []

const REPORT = {
  type: 'object', additionalProperties: false,
  properties: {
    week: { type: 'number' },
    status: { type: 'string', enum: ['green', 'blocked'] },
    conceptId: { type: 'string' },
    summary: { type: 'string' },
    blocker: { type: 'string' },
  },
  required: ['week', 'status', 'summary'],
}

function prompt(w) {
  const ww = String(w).padStart(2, '0')
  return `You are authoring Level-D **Week ${w}** of the Best Brains math module as a v2 pedagogy blueprint.

READ FIRST, IN THIS ORDER (all are on disk):
1. The authoring kit: ${ROOT}/modules/best-brains/build/FANOUT-AUTHORING-KIT.md — follow it EXACTLY. Find the row for **D${w}** in section D (per-week recipes) — that is your brief (family, anchor, multi-step idea, error-analysis verify template, discrimination, situation types).
2. The proven exemplar to COPY the structure of: ${G}/templates/weeks/d04.ts (this is the reference — D4 scored ACCEPT 4.21 on the style gate). Mirror its shape: module-scope generators with FIXED role-based name-free hints, the two()/three() name helpers, the 5-day layout, mastery, puzzle+puzzleMeta, mistakeBank, parentSummarySeed.
3. The exact concept identity: ${G}/../content/catalog.ts — find the Level-D week-${w} row for the precise conceptId, conceptName, computationalFocus, and the Day-5 (noncomputational) focus. Use that conceptId VERBATIM (the correctness gate checks conceptId matches the catalog).
4. The library API you compose from: ${G}/templates/lib/ (situations.ts, multistep.ts, discrimination.ts, erroranalysis.ts, metacog.ts, items.ts, compute.ts for the registered templateIds + verify templates). The kit section B lists the signatures.

THEN:
- WRITE ${G}/templates/weeks/d${ww}.ts, REPLACING the existing v1 file. Set pedagogyContract:'v2', conceptualAnchor, puzzleMeta, and (if the concept shares a family with a prior week per the kit) deepeningDelta. Keep prerequisiteWeeks + strandTags consistent with the catalog/prior version.
- Every computational answer MUST come from a registered template (answerFor) or a multi-step op-chain — never hand-typed. Error-analysis MUST use a verify template that returns {correct,wrong}; embed v.wrong in the prompt.
- SELF-VERIFY with the section-E command for D${w} (import buildD${ww} directly; 200 seeds). Iterate your file until it prints "D${w} SEED-INVARIANT: 200 seeds, 0 throws, 0 invalid". The pedagogical preflight throws inside the builder with a precise message telling you which gate failed — read it and fix the composition (e.g. add a multi-step item, add a discrimination item, vary a reused generator's hints, name the conceptualAnchor in whyBeforeHow).

HARD CONSTRAINTS (from real bugs): hints are FIXED, role-based, no names/numbers (seed-invariant dedup); reuse each generator ≤2× in daily core; draw distinct names (never hardcode a name that is also in the pool); rung-1 of every core hint is an algorithm-free orienting question. Do NOT touch any shared lib file, packGenerator.ts, or any other week — ONLY your d${ww}.ts.

Report status 'green' ONLY if the self-verify prints SEED-INVARIANT. Give a one-line summary of your multi-step / error-analysis / discrimination / situation choices. If blocked after real effort, report 'blocked' with the exact blocker.`
}

const results = await parallel(
  WEEKS.map((w) => () =>
    agent(prompt(w), { label: `author:D${w}`, phase: 'Author', schema: REPORT, agentType: 'general-purpose' })),
)

const clean = results.filter(Boolean)
const green = clean.filter((r) => r.status === 'green').map((r) => 'D' + r.week)
const blocked = clean.filter((r) => r.status !== 'green').map((r) => `D${r.week}: ${r.blocker || '?'}`)
return { greenCount: green.length, green, blocked, details: clean }
