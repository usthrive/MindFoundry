/**
 * Static reference fixture — QUESTION-GENERATOR-SPEC §4.3 worked sample pack,
 * ported VERBATIM (original spec content). Level D · Week 17 "Adding and
 * subtracting fractions with unlike denominators". Served by the fixture
 * loader for (D, 17) regardless of seed; pinned at contentVersion 1.0.0.
 */

import type { WeeklyConceptPack } from '../../types';

export const MFM_D17: WeeklyConceptPack = {
  "schemaVersion": "1.0",
  "packId": "MFM-D17",
  "contentVersion": "1.0.0",
  "identity": {
    "level": "D", "week": 17,
    "conceptId": "frac-addsub-unlike-denominators",
    "conceptName": "Adding and subtracting fractions with unlike denominators",
    "band": "transition",
    "strandTags": ["decimals-fractions"],
    "prerequisiteWeeks": [{ "level": "D", "week": 9 }, { "level": "D", "week": 10 }, { "level": "C", "week": 15 }]
  },
  "presentation": {
    "audioFirst": false,
    "oneOperationPerPage": false,
    "scaffoldNotes": "Parallel number-line scaffold with scaling factors shown on Day 1; scaling factors hidden Day 2; no scaffold Days 3-5 (introduce-then-fade per band law). Written explanation lines mandatory on Day 5."
  },
  "explanation": {
    "hook": "Try to add 1/2 + 1/3 the direct way. Half a brick plus a third of a brick is... what do we even CALL that? That naming problem is the whole lesson.",
    "whyBeforeHow": "Fractions are counts of same-size pieces (the unit-brick idea from way back). 3/4 means three 1/4-bricks. You can only COUNT pieces together when the pieces are the same size - so before adding unlike fractions, we re-cut both amounts into same-size pieces. Renaming changes the NAME, never the AMOUNT: 1/2 = 3/6 is the same length wearing a different label. That is why the method works - and why adding tops and bottoms cannot.",
    "script": [
      { "say": "I'll try 1/2 + 1/3 head-on. Half a bar... a third of a bar... I can't say 'two somethings' because the pieces don't match. I'm stuck - on purpose.", "visual": "Two bars, one cut in halves, one in thirds; mismatched pieces refuse to stack." },
      { "say": "Re-cut both into sixths: 1/2 becomes 3/6, 1/3 becomes 2/6. Watch the amounts hold still - only the cut lines change.", "visual": "Parallel number lines; extra cut lines fade in; lengths unchanged." },
      { "say": "Now the pieces match: 3 sixths + 2 sixths = 5 sixths. Counting works again.", "visual": "Five matching sixth-pieces snap together." },
      { "say": "Which common size? ANY common multiple of the denominators works - the least one just keeps numbers small. For 4 and 6, twelfths are tidy; twenty-fourths also work.", "visual": "Same sum done in twelfths and twenty-fourths, same value." },
      { "say": "Last habit: estimate before you compute. 1/2 + 2/5: both less than or about a half, so the answer is near 1 but under it. If you get 3/7 - smaller than one of the addends! - something's wrong.", "visual": "Benchmark number line with 0, 1/2, 1 flags." }
    ],
    "summary": "Same-size pieces first: rename both fractions to a common denominator (any common multiple; the least is tidy), then add or subtract the counts. Estimate first with benchmarks so wrong answers feel wrong.",
    "vocabulary": [
      { "term": "denominator", "kidGloss": "the size of the pieces (how many cuts make one whole)" },
      { "term": "equivalent fraction", "kidGloss": "same amount, different name (1/2 = 3/6)" },
      { "term": "common denominator", "kidGloss": "a piece-size both fractions can be re-cut into" },
      { "term": "benchmark", "kidGloss": "a friendly landmark like 0, 1/2, or 1 for estimating" }
    ]
  },
  "guidedExamples": [
    {
      "id": "D17-GE-01", "fadeLevel": "modeled",
      "prompt": "1/2 + 1/3 - the head-on attempt, then the rename.",
      "steps": [
        { "teacherSay": "Direct adding fails: the pieces don't match, so there is nothing to count. I need same-size pieces." },
        { "teacherSay": "Sixths fit both. 1/2 = 3/6 and 1/3 = 2/6. Now: 3 + 2 sixths = 5/6.", "expected": "5/6" }
      ],
      "answer": "5/6"
    },
    {
      "id": "D17-GE-02", "fadeLevel": "completion",
      "prompt": "3/4 - 1/6 on parallel number lines. The lines are drawn; you supply the renames.",
      "steps": [
        { "teacherSay": "Twelfths fit both 4 and 6. Watch the amounts hold still while the cut lines appear." },
        { "childDo": "Rename both fractions to twelfths.", "expected": "9/12 and 2/12" },
        { "childDo": "Subtract the counts.", "expected": "7/12" }
      ],
      "answer": "7/12"
    },
    {
      "id": "D17-GE-03", "fadeLevel": "prompted",
      "prompt": "2/5 + 1/2, scaffold shows the scaling factors only.",
      "steps": [
        { "teacherSay": "Estimate first: more or less than 1?", "expected": "less - both under or at a half" },
        { "childDo": "Choose the common denominator and rename.", "expected": "tenths: 4/10 + 5/10" },
        { "childDo": "Add.", "expected": "9/10" }
      ],
      "answer": "9/10"
    },
    {
      "id": "D17-GE-04", "fadeLevel": "independent",
      "prompt": "5/6 - 1/4. Solve cold: estimate, rename, compute.",
      "steps": [
        { "childDo": "State an estimate, then solve.", "expected": "a bit more than 1/2; 10/12 - 3/12 = 7/12" }
      ],
      "answer": "7/12"
    },
    {
      "id": "D17-GE-05", "fadeLevel": "independent",
      "prompt": "Mixed numbers with regrouping: 3 1/4 - 1 2/3.",
      "steps": [
        { "childDo": "Rename the fraction parts, regroup across the whole if needed, solve.", "expected": "3 3/12 - 1 8/12 -> 2 15/12 - 1 8/12 = 1 7/12" }
      ],
      "answer": "1 7/12"
    }
  ],
  "days": [
    {
      "day": 1, "focus": "concept-echo", "pageCount": 2,
      "items": [
        { "id": "D17-D1-01", "type": "computation", "prompt": "Warm-up! Fill in: 2/3 = ▢/12",
          "answer": { "value": "8", "acceptableForms": ["8/12"], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "D", "week": 9 },
          "hintLadder": ["How many 3rds fit in 12ths? Scale top and bottom by the same factor."], "errorTags": ["procedure-slip"] },
        { "id": "D17-D1-02", "type": "reasoning", "prompt": "Warm-up! Which is bigger: 5/8 or 1/2? Answer and give the one-line reason.",
          "answer": { "value": "5/8", "acceptableForms": ["5/8; because 4/8 is one half"], "validation": "short-text-keyword" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "D", "week": 9 },
          "hintLadder": ["What is 1/2 written in eighths?"], "errorTags": ["concept-misconception"] },
        { "id": "D17-D1-03", "type": "computation", "prompt": "1/2 + 1/6 = ? (number-line scaffold in sixths provided)",
          "answer": { "value": "4/6", "acceptableForms": ["2/3"], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "generator": { "templateId": "frac_addsub_unlike_v1", "params": { "d1": 2, "d2": 6, "op": "+" }, "seed": 1701 },
          "hintLadder": ["Rename 1/2 as sixths first.", "1/2 = 3/6. Now count sixths."], "errorTags": ["concept-misconception", "procedure-slip"] },
        { "id": "D17-D1-04", "type": "computation", "prompt": "1/3 + 1/4 = ? (rename both to twelfths)",
          "answer": { "value": "7/12", "acceptableForms": [], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Twelfths fit both 3 and 4.", "1/3 = 4/12 and 1/4 = 3/12."], "errorTags": ["concept-misconception", "procedure-slip"] },
        { "id": "D17-D1-05", "type": "computation", "prompt": "3/4 - 1/2 = ?",
          "answer": { "value": "1/4", "acceptableForms": ["2/8", "3/12"], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Rename 1/2 as fourths."], "errorTags": ["procedure-slip"] },
        { "id": "D17-D1-06", "type": "reasoning", "prompt": "BEFORE computing: is 1/2 + 2/5 more or less than 1? Say which, then solve.",
          "answer": { "value": "less; 9/10", "acceptableForms": ["less than 1; 9/10"], "validation": "short-text-keyword" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Compare each addend to 1/2.", "Rename to tenths."], "errorTags": ["concept-misconception"] }
      ]
    },
    {
      "day": 2, "focus": "fluency-application", "pageCount": 2,
      "items": [
        { "id": "D17-D2-01", "type": "reasoning", "prompt": "Warm-up! Which is greater: 0.4 or 0.35? Explain in one line.",
          "answer": { "value": "0.4", "acceptableForms": ["0.4; because 0.40 > 0.35"], "validation": "short-text-keyword" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "D", "week": 13 },
          "hintLadder": ["Write 0.4 as hundredths."], "errorTags": ["concept-misconception"] },
        { "id": "D17-D2-02", "type": "computation", "prompt": "2/3 + 1/6 = ?",
          "answer": { "value": "5/6", "acceptableForms": [], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Only one fraction needs renaming here."], "errorTags": ["procedure-slip"] },
        { "id": "D17-D2-03", "type": "computation", "prompt": "5/6 - 1/4 = ?",
          "answer": { "value": "7/12", "acceptableForms": [], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Twelfths fit both 6 and 4."], "errorTags": ["procedure-slip", "fact-recall"] },
        { "id": "D17-D2-04", "type": "computation", "prompt": "3/8 + 1/4 = ?",
          "answer": { "value": "5/8", "acceptableForms": [], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Rename 1/4 as eighths."], "errorTags": ["procedure-slip"] },
        { "id": "D17-D2-05", "type": "computation", "prompt": "7/10 - 2/5 = ?",
          "answer": { "value": "3/10", "acceptableForms": [], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Rename 2/5 as tenths."], "errorTags": ["procedure-slip"] },
        { "id": "D17-D2-06", "type": "computation", "prompt": "1/2 + 1/3 + 1/6 = ?",
          "answer": { "value": "1", "acceptableForms": ["6/6", "1/1"], "validation": "equivalent-fraction" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["One common denominator fits all three.", "Sixths: 3 + 2 + 1 sixths."], "errorTags": ["procedure-slip", "concept-misconception"] }
      ]
    },
    {
      "day": 3, "focus": "fluency-application", "pageCount": 2,
      "items": [
        { "id": "D17-D3-01", "type": "computation", "prompt": "Warm-up! 4/9 + 2/9 = ?",
          "answer": { "value": "6/9", "acceptableForms": ["2/3"], "validation": "equivalent-fraction" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "D", "week": 10 },
          "hintLadder": ["Same-size pieces already - just count."], "errorTags": ["concept-misconception"] },
        { "id": "D17-D3-02", "type": "computation", "prompt": "1 1/2 + 2 1/3 = ?",
          "answer": { "value": "3 5/6", "acceptableForms": ["23/6"], "validation": "equivalent-fraction" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Wholes with wholes, fractions with fractions.", "Rename the fraction parts to sixths."], "errorTags": ["procedure-slip"] },
        { "id": "D17-D3-03", "type": "computation", "prompt": "5/12 + 1/4 = ?",
          "answer": { "value": "8/12", "acceptableForms": ["2/3"], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Rename 1/4 as twelfths."], "errorTags": ["procedure-slip"] },
        { "id": "D17-D3-04", "type": "computation", "prompt": "4 1/4 - 2 3/4 = ?",
          "answer": { "value": "1 1/2", "acceptableForms": ["3/2", "1 2/4"], "validation": "equivalent-fraction" },
          "difficulty": 5, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Can 1/4 pay 3/4? Regroup a whole: 4 1/4 = 3 5/4.", "3 5/4 - 2 3/4: now subtract."], "errorTags": ["procedure-slip", "concept-misconception"] },
        { "id": "D17-D3-05", "type": "computation", "prompt": "7/8 - 3/8 = ?",
          "answer": { "value": "4/8", "acceptableForms": ["1/2"], "validation": "equivalent-fraction" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "D", "week": 10 },
          "hintLadder": ["Same pieces - no rename needed. Notice the difference from the others!"], "errorTags": ["concept-misconception"] },
        { "id": "D17-D3-06", "type": "classification", "prompt": "To add 1/6 + 3/8, which common denominator works?",
          "choices": [
            { "key": "A", "text": "14", "isCorrect": false, "errorTag": "concept-misconception", "rationale": "6 + 8 = 14: adds the denominators - the signature tops-and-bottoms idea applied to piece-sizes." },
            { "key": "B", "text": "24", "isCorrect": false, "errorTag": "concept-misconception", "rationale": "Correct but incomplete - marked wrong only in combination; children who reject 48 believe ONLY the least common denominator is legal." },
            { "key": "C", "text": "48", "isCorrect": false, "errorTag": "concept-misconception", "rationale": "Same incompleteness in the other direction." },
            { "key": "D", "text": "both 24 and 48 work", "isCorrect": true }
          ],
          "answer": { "value": "D", "acceptableForms": [], "validation": "choice-key" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["A common denominator is any number BOTH 6 and 8 divide into.", "Does 6 divide 48? Does 8?"], "errorTags": ["concept-misconception"] }
      ]
    },
    {
      "day": 4, "focus": "word-problems", "pageCount": 2,
      "items": [
        { "id": "D17-D4-01", "type": "word-problem", "prompt": "A recipe needs 3/4 cup of flour and 2/3 cup of oats. How many cups of dry ingredients is that in all?",
          "answer": { "value": "1 5/12", "acceptableForms": ["17/12"], "validation": "equivalent-fraction", "units": "cups" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Estimate first: each is more than 1/2, so expect more than 1.", "Twelfths fit both 4 and 3."], "errorTags": ["concept-misconception", "procedure-slip"] },
        { "id": "D17-D4-02", "type": "word-problem", "prompt": "Ken ran 5/6 of a mile. Ria ran 3/4 of a mile. How much farther did Ken run?",
          "answer": { "value": "1/12", "acceptableForms": [], "validation": "equivalent-fraction", "units": "mile" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["'How much farther' compares - which operation?", "Rename both to twelfths."], "errorTags": ["task-comprehension", "procedure-slip"] },
        { "id": "D17-D4-03", "type": "word-problem", "prompt": "A tank held 7/8 gallon of water. 1/2 gallon was used, then 1/4 gallon was poured in. How much water is in the tank now?",
          "answer": { "value": "5/8", "acceptableForms": [], "validation": "equivalent-fraction", "units": "gallon" },
          "difficulty": 5, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Two steps: out, then in. Don't stop after the first.", "Eighths fit everything here."], "errorTags": ["task-comprehension", "procedure-slip"] },
        { "id": "D17-D4-04", "type": "computation", "prompt": "Warm-up! 3 × 2/5 = ?",
          "answer": { "value": "6/5", "acceptableForms": ["1 1/5"], "validation": "equivalent-fraction" },
          "difficulty": 3, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "D", "week": 11 },
          "hintLadder": ["Three copies of two fifth-bricks."], "errorTags": ["fact-recall", "concept-misconception"] }
      ]
    },
    {
      "day": 5, "focus": "noncomputational", "pageCount": 2,
      "items": [
        { "id": "D17-D5-01", "type": "error-analysis", "prompt": "Jo claims 1/3 + 1/4 = 2/7. Draw or describe a picture that PROVES Jo wrong, then write the true sum. (Written explanation required.)",
          "answer": { "value": "picture shows 1/3 + 1/4 > 1/2 while 2/7 < 1/2; true sum 7/12", "acceptableForms": ["7/12"], "validation": "manual-review" },
          "difficulty": 4, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["Compare 2/7 to one of the addends. Can a sum SHRINK below what you started with?", "Draw 1/3 and 1/4 on one bar; is the total closer to 1/2 or to 2/7?"], "errorTags": ["concept-misconception"] },
        { "id": "D17-D5-02", "type": "reasoning", "prompt": "Explain to a younger student why we rename fractions before adding. Your explanation must use the word 'pieces'.",
          "answer": { "value": "you can only count pieces together when the pieces are the same size", "acceptableForms": ["pieces", "same size"], "validation": "short-text-keyword" },
          "difficulty": 3, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["What goes wrong when the pieces are different sizes?"], "errorTags": ["concept-misconception"] },
        { "id": "D17-D5-03", "type": "reasoning", "prompt": "True or false: you may use ANY common denominator, not just the least one. Show your answer is right by doing 1/2 + 1/4 in EIGHTHS.",
          "answer": { "value": "true; 4/8 + 2/8 = 6/8 = 3/4", "acceptableForms": ["true", "6/8", "3/4"], "validation": "short-text-keyword" },
          "difficulty": 4, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["Does 2 divide 8? Does 4?", "Rename both to eighths and add."], "errorTags": ["concept-misconception"] },
        { "id": "D17-D5-04", "type": "classification", "prompt": "Always, sometimes, or never true: 'The sum of two fractions that are each less than 1/2 is less than 1.' Explain your choice in one sentence.",
          "choices": [
            { "key": "A", "text": "Always", "isCorrect": true },
            { "key": "B", "text": "Sometimes", "isCorrect": false, "errorTag": "concept-misconception", "rationale": "Hedging without testing the boundary: less-than-half plus less-than-half cannot reach 1." },
            { "key": "C", "text": "Never", "isCorrect": false, "errorTag": "task-comprehension", "rationale": "Reads the claim backwards (as 'the sum is never less than 1')." }
          ],
          "answer": { "value": "A", "acceptableForms": ["always"], "validation": "choice-key" },
          "difficulty": 5, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["What is the biggest each addend could get close to?", "1/2 + 1/2 = 1 exactly - and both of ours stay UNDER 1/2."], "errorTags": ["concept-misconception"] }
      ]
    }
  ],
  "puzzle": {
    "id": "D17-PZ-01",
    "title": "Puzzle Grove: Make One",
    "puzzleType": "game",
    "prompt": "Cards: 1/2, 1/4, 1/3, 1/6, 1/8, 5/8, 1/12. Choose THREE different cards whose sum is exactly 1. There are exactly two winning trios - find both.",
    "answer": {
      "value": "1/2 + 1/3 + 1/6 = 1 and 1/4 + 1/8 + 5/8 = 1",
      "acceptableForms": ["{1/2,1/3,1/6} and {1/4,1/8,5/8}"],
      "validation": "set"
    },
    "hintLadder": ["Pick a big card first and ask: how much is LEFT to make 1?", "If you take 1/2, you still need 1/2 - which two cards make exactly 1/2?"],
    "errorTags": ["concept-misconception", "fact-recall"]
  },
  "fluencySprint": {
    "id": "D17-FS-01",
    "skill": "Single-digit multiplication facts (full table)",
    "sourceWeek": { "level": "C", "week": 12 },
    "durationSeconds": 120,
    "itemCount": 20,
    "scheduledDay": 3,
    "selfReferenced": true,
    "graded": false,
    "generator": { "templateId": "mult_facts_v1", "params": { "factorRange": [2, 9], "mix": "uniform" }, "seed": 1712 }
  },
  "masteryCheck": {
    "passThresholdPct": 85,
    "fastTrackPct": 95,
    "formA": [
      { "id": "D17-MA-01", "type": "computation", "prompt": "1/5 + 1/2 = ?",
        "answer": { "value": "7/10", "acceptableForms": [], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Tenths fit both 5 and 2."], "errorTags": ["concept-misconception", "procedure-slip"] },
      { "id": "D17-MA-02", "type": "computation", "prompt": "2/3 - 1/2 = ?",
        "answer": { "value": "1/6", "acceptableForms": [], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Sixths fit both."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MA-03", "type": "computation", "prompt": "3/8 + 1/2 = ?",
        "answer": { "value": "7/8", "acceptableForms": [], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Only one fraction needs renaming."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MA-04", "type": "computation", "prompt": "1 2/3 + 2 1/4 = ?",
        "answer": { "value": "3 11/12", "acceptableForms": ["47/12"], "validation": "equivalent-fraction" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Wholes with wholes; rename the fraction parts to twelfths."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MA-05", "type": "computation", "prompt": "9/10 - 1/2 = ?",
        "answer": { "value": "4/10", "acceptableForms": ["2/5"], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Rename 1/2 as tenths."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MA-06", "type": "word-problem", "prompt": "Pia poured 1/2 cup of milk and 1/3 cup of cream into a bowl. How much liquid is that in all?",
        "answer": { "value": "5/6", "acceptableForms": [], "validation": "equivalent-fraction", "units": "cup" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Estimate first: should it be more or less than 1?"], "errorTags": ["concept-misconception", "task-comprehension"] }
    ],
    "formB": [
      { "id": "D17-MB-01", "type": "computation", "prompt": "1/2 + 1/8 = ?",
        "answer": { "value": "5/8", "acceptableForms": [], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Eighths fit both 2 and 8."], "errorTags": ["concept-misconception", "procedure-slip"] },
      { "id": "D17-MB-02", "type": "computation", "prompt": "3/4 - 2/3 = ?",
        "answer": { "value": "1/12", "acceptableForms": [], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Twelfths fit both."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MB-03", "type": "computation", "prompt": "5/8 + 1/4 = ?",
        "answer": { "value": "7/8", "acceptableForms": [], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Only one fraction needs renaming."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MB-04", "type": "computation", "prompt": "2 3/4 + 1 1/6 = ?",
        "answer": { "value": "3 11/12", "acceptableForms": ["47/12"], "validation": "equivalent-fraction" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Wholes with wholes; rename the fraction parts to twelfths."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MB-05", "type": "computation", "prompt": "7/8 - 1/2 = ?",
        "answer": { "value": "3/8", "acceptableForms": [], "validation": "equivalent-fraction" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Rename 1/2 as eighths."], "errorTags": ["procedure-slip"] },
      { "id": "D17-MB-06", "type": "word-problem", "prompt": "A pitcher holds 3/4 liter of juice and 1/6 liter of fizzy water. How much drink is that in all?",
        "answer": { "value": "11/12", "acceptableForms": [], "validation": "equivalent-fraction", "units": "liter" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Estimate first: should it be more or less than 1?"], "errorTags": ["concept-misconception", "task-comprehension"] }
    ],
    "isomorphNotes": "Pairs by index; all from frac_addsub_unlike_v1 classes. 01: unit fraction + 1/2 family, lcm <= 10. 02: proper - proper, adjacent-denominator pair, answer a unit fraction. 03: non-unit + one-rename item (only one fraction rescales - affordance preserved). 04: mixed + mixed, no regroup, twelfth target, answer collision allowed here because operands are disjoint and the skill is the rename+wholes split. 05: proper - 1/2, single rename. 06: join story, kitchen-liquid context swapped, sum < 1 (estimate affordance preserved). No operand pair reused from Form A or daily items."
  },
  "mistakeBank": [
    { "errorTag": "concept-misconception", "subtype": "tops-and-bottoms", "description": "Adds numerators and denominators separately: 1/3 + 1/4 = 2/7. The fraction is treated as two independent whole numbers.", "exampleWrongAnswer": "1/3 + 1/4 = 2/7", "distractorRationale": "Offer (a+c)/(b+d) as a distractor on every unlike-denominator MC item.", "reteachPointer": "explanation/script[0-2] + guidedExamples/D17-GE-01 (the naming wall)" },
    { "errorTag": "procedure-slip", "subtype": "numerator-not-scaled", "description": "Renames the denominator but forgets to scale the numerator: 1/3 -> 1/12 instead of 4/12.", "exampleWrongAnswer": "1/3 + 1/4 = 2/12", "distractorRationale": "Scale denominators only and offer the resulting sum.", "reteachPointer": "guidedExamples/D17-GE-02 (amounts hold still - both numbers move together)" },
    { "errorTag": "procedure-slip", "subtype": "rename-one-only", "description": "Renames one fraction and leaves the other untouched, then adds mismatched counts.", "exampleWrongAnswer": "5/6 - 1/4 -> 10/12 - 1/4 = 9/12", "distractorRationale": "Rename only the first operand and offer the result.", "reteachPointer": "guidedExamples/D17-GE-03 (both fractions get the same piece-size)" },
    { "errorTag": "fact-recall", "subtype": "lcm-or-product-error", "description": "Common-denominator choice or the scaling multiplication itself is wrong (6 x 4 = 28; picks 12 for 6 and 8).", "exampleWrongAnswer": "1/6 + 3/8 in twelfths", "distractorRationale": "Offer a near-miss multiple as a common-denominator choice.", "reteachPointer": "60-second multiples ladder for the two denominators; feed sprint pool" },
    { "errorTag": "representation-misread", "subtype": "line-misread", "description": "Reads the wrong tick scale on the number-line scaffold (counts twelfths as tenths).", "exampleWrongAnswer": "9/12 read as 9/10", "distractorRationale": "Offer the same numerator over the misread denominator.", "reteachPointer": "guidedExamples/D17-GE-02 (count the cuts in one whole first)" },
    { "errorTag": "task-comprehension", "subtype": "multi-step-stop", "description": "Stops after the first operation of a two-step problem (answers the tank's level after use, ignoring the refill).", "exampleWrongAnswer": "tank problem answered 3/8", "distractorRationale": "Offer the intermediate result as a distractor.", "reteachPointer": "Day-4 replay: restate the question AFTER computing - 'did I answer what was asked?'" }
  ],
  "parentSummarySeed": {
    "whatWeWorkedOn": "Adding and subtracting fractions with different denominators - re-cutting both fractions into same-size pieces (a common denominator) before combining, with estimate-first checks using benchmarks like 1/2 and 1.",
    "improvingCandidates": [
      "estimating a fraction sum against 1/2 and 1 before computing",
      "renaming fractions on the number line while keeping the amount unchanged",
      "explaining WHY unlike pieces can't be counted together"
    ],
    "strengtheningByTag": [
      { "errorTag": "concept-misconception", "text": "resisting the adds-tops-and-bottoms shortcut - the picture-proof page this week is exactly the medicine, and the model stays available until the symbolic work is steady" },
      { "errorTag": "procedure-slip", "text": "scaling BOTH numbers of a fraction when renaming (1/3 is 4/12, not 1/12) - warm-ups will keep one rename in the mix" },
      { "errorTag": "fact-recall", "text": "quick multiples (for choosing common denominators) - the two-minute practice sprints are already targeting these" }
    ],
    "homeFocus": {
      "praiseLine": "Your picture-proof of why 1/3 + 1/4 can't be 2/7 would convince anybody - that's the hard part, and you own it.",
      "questionForChild": "If we're adding 2/3 + 1/6, what size pieces would you re-cut them into - and why does that work?",
      "schoolSyncHook": "If you share which fraction topics your child's class is on, we will lean the warm-ups toward them."
    },
    "vocabularyForParent": ["denominator (piece size)", "equivalent fraction (same amount, new name)", "common denominator (a piece size both fractions can share)", "benchmark (friendly landmark like 1/2 for estimating)"]
  }
};
