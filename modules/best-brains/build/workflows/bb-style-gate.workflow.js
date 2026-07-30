export const meta = {
  name: 'bb-style-gate',
  description: 'Best Brains authenticity/style gate — two-pass scorer + adversarial anti-drift re-check per week pack',
  phases: [
    { title: 'Score', detail: 'PASS-1 TAG + PASS-2 EVALUATE per the rubric' },
    { title: 'Adversarial', detail: 'anti-drift re-check of every scorer PASS' },
  ],
}

const RUBRIC = '/home/usthr/Penta_University/Math_Tutor/MindFoundry/modules/best-brains/build/CONTENT-STYLE-GATE.md'

// args: either [{week,packPath,ledgerPath,band,onAlgebraThread,conceptId}], OR a
// compact { packsDir, weeks:[...], algebra:[...] } that expands to per-week configs.
const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args
let WEEKS = []
if (Array.isArray(parsedArgs)) {
  WEEKS = parsedArgs
} else if (parsedArgs && parsedArgs.packsDir) {
  const algebra = new Set(parsedArgs.algebra || [])
  WEEKS = (parsedArgs.weeks || []).map((w) => ({
    week: w,
    packPath: `${parsedArgs.packsDir}/d${w}-pack.json`,
    ledgerPath: `${parsedArgs.packsDir}/d${w}-ledger.json`,
    band: 'transition',
    onAlgebraThread: algebra.has(w),
    conceptId: '(read it from the pack identity / catalog)',
  }))
}

const SCORE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    packId: { type: 'string' }, band: { type: 'string' }, weekIndex: { type: 'number' },
    hardGates: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { id: { type: 'string' }, verdict: { type: 'string', enum: ['PASS', 'FAIL', 'NEEDS_HUMAN'] }, evidence: { type: 'string' }, citedItemIds: { type: 'array', items: { type: 'string' } } },
      required: ['id', 'verdict', 'evidence'] } },
    weighted: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { id: { type: 'string' }, score: { type: 'string' }, evidence: { type: 'string' } }, required: ['id', 'score', 'evidence'] } },
    computed: { type: 'object', additionalProperties: true,
      properties: { multiStepShare: { type: 'string' }, cognitiveClusters: { type: 'string' }, depthSubsetMean: { type: 'number' }, weightedMeanApplicable: { type: 'number' }, anyWeighted1: { type: 'boolean' } } },
    decision: { type: 'string', enum: ['ACCEPT', 'REJECT', 'HUMAN_REVIEW'] },
    failingGateIds: { type: 'array', items: { type: 'string' } },
    regenerationHints: { type: 'array', items: { type: 'string' } },
  },
  required: ['packId', 'decision', 'hardGates', 'weighted', 'computed', 'failingGateIds', 'regenerationHints'],
}

const ADV_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    adversarialFoundFalsePass: { type: 'boolean' },
    finalDecision: { type: 'string', enum: ['ACCEPT', 'REJECT', 'HUMAN_REVIEW'] },
    overturnedCriteria: { type: 'array', items: { type: 'string' } },
    reasoning: { type: 'string' },
  },
  required: ['adversarialFoundFalsePass', 'finalDecision', 'reasoning'],
}

function scorePrompt(w) {
  return `You are the Best Brains AUTHENTICITY/STYLE GATE scorer. Read the FULL rubric at ${RUBRIC} (10 hard gates BB-G1..G10 + 14 weighted BB-W1..W14 + the decision logic + guards). Then evaluate this ONE generated content pack:
- pack JSON: ${w.packPath}   (read it in full)
- prior-week concept ledger (REQUIRED for BB-G1 newness/deepening + BB-G8 retrieval): ${w.ledgerPath}
- band: ${w.band} · weekIndex: ${w.week} · conceptId: ${w.conceptId} · on-algebra-thread: ${w.onAlgebraThread}

Run the MANDATORY two-pass protocol from the rubric:
PASS 1 — TAG every item (strand, cognitiveOperation, solutionStepCount, contextNoun); compute the BB-G5 cognitive clustering (cluster by cognitive-operation + step-count, NOT surface format), the multi-step share, and recompute every false-distractor's arithmetic for BB-W4. Resolve every reteachPointer.
PASS 2 — EVALUATE each hard gate PASS/FAIL/NEEDS_HUMAN and each weighted criterion 1-5 (or N/A), citing specific itemIds as evidence. Apply band-conditioning and the referent-check carve-out. Recompute arithmetic; never trust labels.
Apply the gate threshold EXACTLY: any hard-gate FAIL => REJECT; any NEEDS_HUMAN => HUMAN_REVIEW; else ACCEPT requires weighted mean >= 3.5 AND depth-subset {W1..W5} mean >= 3.0 AND no applicable criterion = 1; the 3.3-3.5 / single-depth-2 band => HUMAN_REVIEW. Output the strict JSON verdict.`
}

function advPrompt(w, score) {
  return `You are the Best Brains style-gate ADVERSARIAL ANTI-DRIFT reviewer. The base scorer returned a PASS-ish verdict for this pack; your job is to try to OVERTURN it — find where presentation polish (clean 5-day arc, fade tiers, hint ladders, mistakeBanks) may have fooled the scorer into rating drill/hollow content as authentic. Read the rubric ${RUBRIC}, the pack ${w.packPath}, and the ledger ${w.ledgerPath}.
Base scorer verdict (JSON):
${JSON.stringify(score, null, 1)}

Be skeptical and specific. Re-cluster the items by COGNITIVE OPERATION + STEP-COUNT yourself; recompute the multi-step share and every distractor's arithmetic. Especially scrutinize: BB-G7 multi-step density (is it genuine, week-wide, not one token 2-step?), BB-W5 discrimination (do Days 2-3 force an operation CHOICE?), BB-W2 modeled think-aloud (genuine narration or a bare rule+answer?), BB-W1 why-before-how (real reasoning or a restated recipe?), BB-W7 error-analysis (first-class analyze-a-worked-error with written argument?), BB-W4 distractor faithfulness + answer-key correctness. If you find a genuine false-pass, downgrade the decision (ACCEPT->HUMAN_REVIEW, or ->REJECT if a hard gate actually fails). If the pack genuinely holds up, confirm it. Output strict JSON.`
}

const results = await pipeline(
  WEEKS,
  (w) => agent(scorePrompt(w), { label: `score:D${w.week}`, phase: 'Score', schema: SCORE_SCHEMA }),
  async (score, w) => {
    if (!score) return { week: w.week, score: null, adversarial: null, final: 'ERROR' }
    // Adversarial re-check only when the scorer did not already REJECT.
    if (score.decision === 'REJECT') {
      return { week: w.week, packId: score.packId, score, adversarial: null, final: 'REJECT' }
    }
    const adv = await agent(advPrompt(w, score), { label: `adv:D${w.week}`, phase: 'Adversarial', schema: ADV_SCHEMA })
    return { week: w.week, packId: score.packId, score, adversarial: adv, final: adv ? adv.finalDecision : score.decision }
  },
)

const clean = results.filter(Boolean)
const summary = clean.map((r) => `D${r.week}: scorer=${r.score?.decision ?? '?'} -> final=${r.final}`)
return { summary, results: clean }
