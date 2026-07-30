# Level-D v2 Fan-out Authoring Kit

**Purpose:** everything an author (human or agent) needs to rewrite ONE Level-D week as a
`pedagogyContract: 'v2'` blueprint that clears BOTH gates. The architecture is proven — D4
scored ACCEPT (weighted 4.21 / depth 4.2, adversarially confirmed). Copy D4's shape exactly.

**Reference exemplar:** `frontend/src/modules/best-brains/generator/templates/weeks/d04.ts` — read it first.
**Contract:** `build/CONTENT-GENERATOR-FIX-SPEC.md` (§6 gates, §9 checklist). This kit operationalizes it.

---

## A. HARD RULES (each earned from a real bug the gates caught)

1. **Answers are code-computed, never authored.** Every computational item's answer comes from a
   registered template's `answerFor`; multi-step answers come from the shipped op-chain
   (`evalRatChain`/`evalDecChain`). The validator re-derives everything — a wrong key is impossible.
2. **SEED-INVARIANT hints.** Hint ladders MUST be fixed, role-based, and **name-free / number-free**
   ("Picture the first bar, then the copies for the second person" — never "Picture Pia's bar, 8
   copies"). The dedup gate normalizes digits and throws at >2 identical templates for **every seed**;
   name/number-templated hints are seed-variant and will break some learner's pack. **Reuse each
   generator ≤ 2× in the daily CORE** (retrieval warm-ups and mastery are exempt). Prompts KEEP names
   (variety is good); only HINTS go role-based.
3. **Distinct names.** Draw names fresh per item via `two(r)` / `three(r)` helpers (in d04.ts). NEVER
   hardcode a name (e.g. "Ken") that is also in the draw pool — it produced "Ken has 6 more than Ken".
4. **Rung-1 is an algorithm-free orienting question** (starts Does/Is/Are/Which/What/How/Why/Picture/
   Estimate/Compare or ends "?"). Never "Line up the places…", "Multiply…", "Add…".
5. **Both gates.** Your week must (a) generate + validate cleanly across **200 seeds** under
   `contract:'v2'` (0 throws, 0 invalid), then (b) pass the style gate. Self-verify (a) before reporting.
6. **Child-safe.** No %, red, "fail", "wrong"/"Review" aimed at the child. The only "wrong" allowed is
   inside an error-analysis task about a hypothetical third party ("A student wrote…").

---

## B. LIBRARY API (import from `../lib/…`; all stamp authorMeta for you)

```ts
situation({ situationType, cognitiveOp, usesPriorSkill?, draw:(r)=>({
  prompt, answerValue, templateId, params, units?, validation?, acceptableForms?, hints:[o,l], errorTags }) })
  // single-step word problem. templateId must be a registered answerFor (d_mul_v1, d_add_v1, d_sub_v1,
  // d_div_v1, d_frac_like_v1, d_frac_unlike_v1, d_frac_times_whole_v1, d_frac_times_frac_v1,
  // d_frac_div_v1, d_dec_addsub_v1, d_dec_mul_v1, d_dec_div_v1, d_interpret_rem_v1, …) with matching params.

multiStep({ situationType, cognitiveOp, usesPriorSkill?, draw:(r)=>({
  prompt, initN, initD?, steps:RatStep[], units?, validation?, acceptableForms?, hints:[o,l], errorTags }) })
  // ≥2-op WHOLE/FRACTION chain. RatStep={op:'add'|'sub'|'mul'|'div', n, d}. stepCount=steps.length (derived).
  // validation 'equivalent-fraction' for fractional results, else 'exact-numeric'.
  // *** CRITICAL: initN/initD is the FIRST STATED QUANTITY and MUST equal the prompt's first number. ***
  //   If the prompt says "pours 2/10 litre …", set initN:2, initD:10 (NOT initD:1). Forgetting initD
  //   makes the chain start at 2 WHOLE, so the code-computed answer silently CONTRADICTS the prose —
  //   the correctness gate passes (answer matches params) but the style gate REJECTs (BB-G7). If the
  //   first quantity is one whole, use initN:1, initD:1. Each step's {n,d} likewise matches its stated
  //   fraction. TEST: read your generated prompt and confirm answer.value is arithmetically consistent.

multiStepDec({ situationType, cognitiveOp, usesPriorSkill?, draw:(r)=>({
  prompt, init, steps:DecStep[], units?, acceptableForms?, hints:[o,l], errorTags }) })
  // ≥2-op DECIMAL chain. DecStep={op, v:'0.5'} ('div' operand must be a whole number string).

discrimination({ variant:'cross-op'|'structural', cognitiveOp?, draw:(r)=>({
  prompt, correct, correctForms?, distractors:[{text,errorTag,rationale}], hints:[o,l], errorTags }) })
  // classification trap forcing an operation/structure CHOICE. correct is code-selected. NO embedded
  // "a student wrote X" claim (that needs errorAnalysis). Put ≥1 on Day 2 or 3.

errorAnalysis({ verifyTemplateId, cognitiveOp?, drawParams:(r)=>params, build:(v,p,r)=>({
  prompt, extension, hints:[o,l], errorTags, answerKeywords? }) })
  // v={correct,wrong} recomputed by the verify template. prompt MUST embed v.wrong ("…wrote ${v.wrong}").
  // strand is noncomputational; goes on Day 5. Verify templates (choose by concept):
  //   d_verify_binop_misconception_v1  {a,b,op,wrongOp}            whole-number wrong-operation
  //   d_verify_remainder_v1            {a,b}                        division "q R r" truth
  //   d_verify_frac_v1                 {n1,d1,n2,d2,op,wrongMode}   wrongMode: tops-bottoms | num-only | wrong-op-add | wrong-op-mul
  //   d_verify_dec_v1                  {a,b,op,wrongMode}           wrongMode: right-align | point-drop | wrong-op-add | wrong-op-sub
  //   d_verify_ratchain_v1 / d_verify_binop_v1  (correct-only, for value checks)

withEstimateFirst(baseGen, verbalBenchmark)   // metacog; benchmark has NO digits. Also withReasonableness/withCheckBack.
reasoning({prompt,value,acceptableForms,keywords?,hints,errorTags})  // Day-5 open written item (noncomputational)
classify({prompt,correct,distractors,hints,errorTags})               // Day-5 Always/Sometimes/Never (noncomputational)
asWarmup(baseGen, sourceWeekRef)                                      // backward-only retrieval warm-up
```

Never author a `classify()`/`reasoning()` whose PROMPT asserts a specific worked number ("a student
got 674") — that trips the QG-11 v2 detector. Use `errorAnalysis` (it carries a verify template).

---

## C. THE §9 CHECKLIST (your week throws at generation time until ALL hold)

- `pedagogyContract:'v2'`, `conceptualAnchor:'<the concrete model>'`, `puzzleMeta:{stepCount,cognitiveOp}`.
- **Modeled GE** first: first-person think-aloud (I/Let me/watch/notice…) + a predict-pause (an
  `expected` on a teacherSay step, or `?`); a `completion`-tier GE exists; fade → independent.
- **whyBeforeHow** contains a causal clause (because/since/so/that is why) in its first 60% AND names
  the `conceptualAnchor`.
- **explanation.script** has ≥1 segment modeling estimate/reasonableness (estimate/about/near/check…).
- **Multi-step:** operation-family concepts → **≥2** multi-step week-wide incl. **≥1 on Day 4**;
  place-value-family → **≥1** week-wide (compose with a prior-week op; set `usesPriorSkill`).
- **≥3 distinct situationTypes** among word problems (structure-distinct, not noun-swap).
- **≥1 discrimination** item in Days 2–3.
- **≥1 error-analysis** item (Day 5) — generated, `noncomputational`.
- **≥1 metacog** item in Days 2–4 core.
- **Puzzle** (cognitiveOp,stepCount) ≠ any Day-1 core item's (a genuinely new application).
- **praiseLine** names an observable move (drew/estimated/checked/renamed…); no speed/trait/generic praise.
- **Day-5** carries ≥2 distinct non-comp reasoning forms (error-analysis + reasoning + classify is ideal).
- **deepeningDelta** set if the concept shares a family with a prior week (D9/D10/D13 etc.).
- Distractors each equal their named misconception's output; structured reteachPointers resolve to real ids.

Structure to copy: Day1 6 items (concept-echo, single-step only, ~3 retrieval); Day2 6 (fluency +
discrimination + metacog); Day3 6 (interleave discrimination + multi-step); Day4 4 (multi-step word
problems); Day5 3–4 (error-analysis + reasoning + classify [+ ramped warm-up]). Retrieval 20–30% pack-wide.
Mastery = 6 slots mixing single- and multi-step (isomorphic Form A/B).

---

## D. PER-WEEK RECIPES (family, anchor, multi-step, error-analysis, discrimination, situations)

**Op-family = ≥2 multi-step; PV-family = ≥1 (compose w/ prior op).**

| Wk | concept | family | anchor | multi-step idea | error-analysis (verify) | discrimination | situations |
|----|---------|--------|--------|------------------|--------------------------|----------------|------------|
| D1 | place value to 1,000,000 | PV | place-value chart | round to nearest 10k THEN compare two rounded (uses prior compare) | wrong digit value (d_verify_binop_v1 on digit×10^place) | which digit is worth more (place vs face value) | (mostly non-story; use "population/stadium" number contexts) |
| D2 | multi-digit ± fluency | OP | column/place | start, subtract, then add back (3-term chain) | borrowed-zero slip (d_verify_dec_v1 right-align on whole? use d_verify_binop_misconception_v1 add/sub) | is this add or subtract (keyword trap) | money, distance, population change |
| D3 | factors/multiples/primes | PV | rectangle=factor pair | list factors THEN pick the pair summing/closest (compose) | "is 51 prime?" mis-classified (d_verify_binop_v1 to show 51=3×17) | prime vs composite trap (odd≠prime) | (number-property contexts) |
| D5 | area-model multiplication | OP | area rectangle (rooms) | product THEN compare to an estimate; or two partials summed | dropped-partial (d_verify_binop_misconception_v1: a×b vs a×(b−ones)) | area-model vs repeated-add | packing, tiling, seating |
| D6 | division w/ remainders | OP | fair-sharing | share THEN interpret leftover (2 interpretations) | keyed "7 R 3" for 29÷4 (**d_verify_remainder_v1** — the exact old bug, now generated) | remainder-too-big trap | sharing, grouping, seating |
| D7 | interpreting remainders | OP | fair-sharing | divide THEN round-up/drop per story (genuine 2-step) | wrong interpretation (d_verify_remainder_v1 + mode) | round-up vs drop-vs-leftover | buses/tables/boxes/ribbons |
| D8 | 2-digit × 2-digit | OP | four rooms | four partials summed (multi-add chain); estimate check | fabricated "674" missing-room (**d_verify_ratchain_v1 / d_verify_binop_v1** on the true product — the exact old bug, generated) | 3-room vs 4-room | packing, arrays, seating |
| D9 | fraction equiv & compare | PV | unit-brick / number line | scale to common size THEN compare (compose w/ prior) | bigger-denominator-is-bigger (d_verify_frac_v1 compare) | which is greater (benchmark trap) | recipe/pizza/distance shares |
| D10 | ± fractions (like) | OP | unit-brick | add two like-fractions THEN subtract a third (chain) | tops-and-bottoms (**d_verify_frac_v1 tops-bottoms**) | add-tops-only vs add-both | recipe, distance, time |
| D11 | fraction × whole | OP | copies of a fraction | k copies THEN add a whole (chain) | multiplied denominator too (d_verify_frac_v1 wrong-op) | repeated-add vs multiply | recipe scaling, laps, batches |
| D12 | meeting decimals | PV | money / grid | fraction→decimal THEN compare/add (compose) | longer-is-bigger (d_verify_dec_v1 right-align on compare) | 0.8 vs 0.35 trap | money, measurement |
| D13 | decimal place value (thousandths) | PV | place chart | round to a place THEN compare (compose w/ prior) | miscounted place (d_verify_dec_v1) | tenths vs hundredths value | measurement, money |
| D14 | ± decimals | OP | aligned point | buy two items THEN make change (money 2-step) | right-align misalignment (**d_verify_dec_v1 right-align**) | align-point vs right-justify | money-change, measurement |
| D15 | multi-digit × fluency | OP | standard algorithm | product THEN compare to estimate; two-store total | place-shift partial (d_verify_binop_misconception_v1) | estimate vs exact reasonableness | packing, cost, seating |
| D16 | division: 2-digit divisors | OP | estimate-quotient | estimate quotient THEN refine/interpret (2-step) | remainder≥divisor (d_verify_remainder_v1) | which estimate brackets it | sharing, rate, boxes |
| D18 | multiplying fractions | OP | area square (part of a part) | fraction of a fraction THEN of a whole (chain) | added instead of multiplied (**d_verify_frac_v1 wrong-op-add**) | "of" = multiply vs add | garden/wall/field area |
| D19 | dividing unit fractions | OP | scooping | scoops in one whole THEN in k wholes (2-step) | inverted wrong / multiplied (d_verify_frac_v1) | ÷ by unit-fraction makes MORE | scooping, cutting, sharing |
| D20 | × ÷ decimals | OP | place-the-point | cost×qty THEN ÷ among people (money 2-step) | point-drop (**d_verify_dec_v1 point-drop**) | where does the point go | money-change, rate, measurement |
| D21 | order of operations | OP | grouping | evaluate a 3-term expression (genuine multi-op) | left-to-right ignoring ×-first (d_verify_binop_misconception_v1) | ×-before-+ vs left-to-right | (expression stories: tickets+combos) |
| D22 | coordinate plane & patterns | PV | grid / rule | find kth pattern term THEN plot it (patternTerm→plot, 2-step) | x/y swapped (d_verify_binop_v1 on term) | (x,y) vs (y,x) | treasure-map, pattern growth |
| D23 | angles & shape hierarchies | PV | angle sum | triangle third THEN classify by it (2-step) | classified by smallest angle (d_verify_binop_v1: 180−a−b) | acute/right/obtuse by LARGEST | (geometry contexts) |
| D24 | volume + ready for E | PV | unit cubes | volume of one box THEN combine two (2-step) | area-vs-volume confusion (d_verify_ratchain_v1 l×w×h) | area (2 dims) vs volume (3) | box packing, storage |

Notes: where a table cell suggests a verify template that is "correct-only" (d_verify_binop_v1 /
d_verify_ratchain_v1) but you need a shown `wrong` value, prefer `d_verify_binop_misconception_v1` /
`d_verify_frac_v1` / `d_verify_dec_v1` (they return `{correct, wrong}`). Figure-dependent Day-5 items
(D22 hidden-picture, D23 protractor, D24 net) ship the computational core + an `[image: …]` placeholder;
keep the numeric answer code-computed.

---

## E. SELF-VERIFY PROTOCOL (run before reporting done)

Import your OWN builder directly (NOT `packGenerator`, which imports every sibling week — a sibling
being rewritten in parallel would spuriously break your check). The retrieval ramp is inlined so the
validated pack matches what ships. Replace `<WEEK>` (e.g. `06`) and `<N>` (e.g. `6`):

```bash
cd frontend && npx tsx -e "
import { buildD<WEEK> } from './src/modules/best-brains/generator/templates/weeks/d<WEEK>';
import { validatePack } from './src/modules/best-brains/generator/validator';
function ramp(p){const d1=p.days.find(d=>d.day===1),d5=p.days.find(d=>d.day===5);if(!d1||!d5)return p;
  const r=d1.items.filter(i=>i.isRetrieval);if(r.length<2||d5.items.length>=8)return p;const m=r[r.length-1];
  d1.items=d1.items.filter(i=>i!==m);const{level,week}=p.identity;
  d5.items=[...d5.items,{...m,id:level+week+'-D5-'+String(d5.items.length+1).padStart(2,'0')}];return p;}
let bad=''; for(let i=0;i<200;i++){const s=i*13+3;
  try{const p=ramp(buildD<WEEK>(s,'1.1.0')); const r=validatePack(p,{contract:'v2'});
    if(!r.valid && !bad) bad='INVALID seed '+s+': '+r.violations.map(v=>v.gate+'@'+v.path).slice(0,4).join(', ');}
  catch(e){ if(!bad) bad='THROW seed '+s+': '+e.message; }}
console.log(bad || 'D<N> SEED-INVARIANT: 200 seeds, 0 throws, 0 invalid');"
```
Iterate your blueprint until it prints SEED-INVARIANT. Do NOT edit shared lib files, `packGenerator.ts`
(`V2_WEEKS`), or any other week — only your `weeks/dNN.ts`. The orchestrator wires `V2_WEEKS` and runs
the style gate on all 24 afterward.
