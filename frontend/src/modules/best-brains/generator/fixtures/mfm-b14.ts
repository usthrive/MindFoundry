/**
 * Static reference fixture — QUESTION-GENERATOR-SPEC §4.2 worked sample pack,
 * ported VERBATIM (original spec content). Level B · Week 14 "Subtraction
 * within 100 with regrouping". Served by the fixture loader for (B, 14)
 * regardless of seed; pinned at contentVersion 1.0.0.
 */

import type { WeeklyConceptPack } from '../../types';

export const MFM_B14: WeeklyConceptPack = {
  "schemaVersion": "1.0",
  "packId": "MFM-B14",
  "contentVersion": "1.0.0",
  "identity": {
    "level": "B", "week": 14,
    "conceptId": "sub-within-100-regrouping",
    "conceptName": "Subtraction within 100 with regrouping",
    "band": "intermediate",
    "strandTags": ["addition-subtraction", "number-sense-counting"],
    "prerequisiteWeeks": [{ "level": "B", "week": 2 }, { "level": "B", "week": 10 }, { "level": "B", "week": 13 }]
  },
  "presentation": {
    "audioFirst": false,
    "oneOperationPerPage": false,
    "scaffoldNotes": "Labeled tens|ones column scaffold with color headers on Days 1-2 (convention per E53); scaffold optional Day 3, absent Day 4-5. Base-ten block imagery on Day 1. Dual audio+text directions."
  },
  "explanation": {
    "hook": "You have 2 loose ones, and the problem wants to take away 7. Try it. Stuck? Good - that stuck feeling is the whole reason today's trick exists.",
    "whyBeforeHow": "Sometimes a column doesn't have enough ones to subtract. But a ten is just ten ones in a bundle! Trading (regrouping) breaks one ten back into ten ones. Nothing is added, nothing is lost - the number is the same, just dressed differently. That is WHY the written method crosses out the tens digit: it is bookkeeping for a real trade.",
    "script": [
      { "say": "Watch 52 take away 17 with blocks. The ones column asks: can I take 7 ones from 2 ones? Not enough!", "visual": "Five rods and two loose cubes — and seven cubes needing to come away.",
        "figure": { "type": "base-ten-blocks", "alt": "five fused rods and two loose cubes, the ones highlighted — not enough loose cubes to give seven",
          "params": { "state": { "rods": 5, "ones": 2, "label": "52" }, "highlight": "ones" } } },
      { "say": "So I trade: one rod becomes ten loose ones. Now I have 4 rods and 12 ones. Still 52 - count it!", "visual": "Five rods and two cubes, then the trade: four rods and twelve loose cubes — still 52.",
        "figure": { "type": "base-ten-blocks", "alt": "five rods and two cubes becoming four rods and twelve loose cubes — the same fifty-two",
          "params": { "state": { "rods": 5, "ones": 2, "label": "52" }, "then": { "rods": 4, "ones": 12, "label": "still 52" }, "connector": "becomes", "highlight": "rods" } } },
      { "say": "NOW the ones can pay: 12 minus 7 leaves 5. And the tens: 4 rods minus 1 rod leaves 3. Answer: 35.", "visual": "Four rods and twelve cubes, then what remains after paying: three rods and five cubes.",
        "figure": { "type": "base-ten-blocks", "alt": "four rods and twelve cubes becoming three rods and five cubes — thirty-five left",
          "params": { "state": { "rods": 4, "ones": 12 }, "then": { "rods": 3, "ones": 5, "label": "35" }, "connector": "beside" } } },
      { "say": "The written method is the same story in ink: cross out the 5, write 4, put a little 1 by the 2 to make 12. Every mark means a real trade.", "visual": "The column method beside the blocks: the 5 struck and 4 above it, the little 1 making 12, the answer 35.",
        "figure": { "type": "column-method", "alt": "fifty-two minus seventeen in columns: the five struck out with four written above, a little one beside the two making twelve, and thirty-five below the line",
          "params": { "op": "−", "rows": [
            { "cells": ["4", "12"], "role": "carry" },
            { "cells": ["5", "2"], "role": "operand", "struck": [0, 1] },
            { "cells": ["1", "7"], "role": "operand" },
            { "cells": ["3", "5"], "role": "result" } ] } } },
      { "say": "Last habit: estimate first. 52 - 17 is about 50 - 20 = 30, so an answer near 30 makes sense - and 85 would smell wrong.", "visual": "Number line arc from 52 back about 20.",
        // The only drawable visual in this pack: rods and cubes have no primitive,
        // but the estimate arc is exactly what `number-line` hops are for. No
        // assertion — a script segment has no answer or params to assert against.
        "figure": { "type": "number-line", "alt": "a number line with one arc jumping back about 20 from 52, landing near 30",
          "params": { "min": 0, "max": 60, "step": 10, "labels": "majors",
            "marks": [{ "at": 52, "label": "52", "style": "flag" }],
            "hops": [{ "from": 52, "to": 32, "label": "back about 20" }] } } }
    ],
    "summary": "When the ones can't pay, trade one ten for ten ones. Subtract ones, then tens. Estimate first so wrong answers feel wrong.",
    "vocabulary": [
      { "term": "regroup (trade)", "kidGloss": "break one ten into ten ones" },
      { "term": "difference", "kidGloss": "the answer to a subtraction" },
      { "term": "estimate", "kidGloss": "a close-enough answer you find fast, to check the real one" }
    ]
  },
  "guidedExamples": [
    {
      "id": "B14-GE-01", "fadeLevel": "modeled",
      "prompt": "41 - 17 with blocks only.",
      "steps": [
        { "teacherSay": "Ones ask: take 7 from 1? Not enough. I trade a rod: now 3 rods, 11 ones. Still 41." },
        { "teacherSay": "11 - 7 = 4 ones. 3 rods - 1 rod = 2 rods. Answer 24. Estimate check: about 40 - 20 = 20. Close - sensible!", "expected": "24" }
      ],
      "answer": "24"
    },
    {
      "id": "B14-GE-02", "fadeLevel": "completion",
      "prompt": "53 - 28, blocks AND written method side by side.",
      "steps": [
        { "teacherSay": "I trade the rod in the blocks. You make the matching ink marks in the column." },
        { "childDo": "Cross out 5, write 4; make the 3 into 13.", "expected": "4 tens, 13 ones" },
        { "childDo": "Now finish both columns.", "expected": "13-8=5, 4-2=2 -> 25" }
      ],
      "answer": "25"
    },
    {
      "id": "B14-GE-03", "fadeLevel": "prompted",
      "prompt": "62 - 45, written only. Narrate every move.",
      "steps": [
        { "teacherSay": "First question every time?", "expected": "Can the ones pay? 2 - 5: no." },
        { "childDo": "Trade, narrate, solve.", "expected": "5 tens 12 ones; 12-5=7; 5-4=1 -> 17" }
      ],
      "answer": "17"
    },
    {
      "id": "B14-GE-04", "fadeLevel": "independent",
      "prompt": "74 - 38. Solve cold, then check with an estimate.",
      "steps": [
        { "childDo": "Solve, then say the estimate check.", "expected": "36; about 70 - 40 = 30, sensible" }
      ],
      "answer": "36"
    }
  ],
  "days": [
    {
      "day": 1, "focus": "concept-echo", "pageCount": 3,
      "items": [
        { "id": "B14-D1-01", "type": "computation", "prompt": "Warm-up! 8 + 6 = ? (make ten: 8 + 2 + 4)",
          "answer": { "value": "14", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "B", "week": 5 },
          "hintLadder": ["How much does 8 need to make 10?"], "errorTags": ["fact-recall"] },
        { "id": "B14-D1-02", "type": "computation", "prompt": "Warm-up! 36 + 27 = ?",
          "answer": { "value": "63", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "B", "week": 13 },
          "hintLadder": ["Ones first: 6 + 7 crosses ten - carry it."], "errorTags": ["procedure-slip"] },
        { "id": "B14-D1-03", "type": "computation", "prompt": "[image: base-ten model of 45] 45 - 27 = ? Trade first if the ones can't pay.",
          "figure": { "type": "base-ten-blocks", "alt": "four fused rods and five loose cubes — forty-five as blocks",
            "params": { "state": { "rods": 4, "ones": 5, "label": "45" } } },
          "answer": { "value": "18", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "generator": { "templateId": "sub_2digit_regroup_v1", "params": { "minuend": 45, "subtrahend": 27, "forceRegroup": true }, "seed": 1401 },
          "hintLadder": ["Can 5 ones pay 7 ones?", "Trade one rod: 3 tens, 15 ones. Now subtract."], "errorTags": ["concept-misconception", "procedure-slip"] },
        { "id": "B14-D1-04", "type": "computation", "prompt": "52 - 38 = ? (column scaffold shown)",
          "answer": { "value": "14", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Ones first: can 2 pay 8?", "Cross out the 5, make the 2 into 12."], "errorTags": ["concept-misconception", "procedure-slip"] },
        { "id": "B14-D1-05", "type": "reasoning", "prompt": "Do you need to trade? 57 - 24. Answer yes or no, then solve.",
          "answer": { "value": "no; 33", "acceptableForms": ["no, 33", "no 33"], "validation": "short-text-keyword" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Only the ones column decides: can 7 pay 4?"], "errorTags": ["concept-misconception"] },
        { "id": "B14-D1-06", "type": "reasoning", "prompt": "Do you need to trade? 60 - 42. Answer yes or no, then solve.",
          "answer": { "value": "yes; 18", "acceptableForms": ["yes, 18", "yes 18"], "validation": "short-text-keyword" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Can 0 ones pay 2 ones?", "Trade: 5 tens, 10 ones."], "errorTags": ["procedure-slip"] }
      ]
    },
    {
      "day": 2, "focus": "fluency-application", "pageCount": 2,
      "items": [
        { "id": "B14-D2-01", "type": "computation", "prompt": "Warm-up! 6 + ▢ = 14",
          "answer": { "value": "8", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "B", "week": 7 },
          "hintLadder": ["Think addition: 6 plus what makes 14?"], "errorTags": ["fact-recall"] },
        { "id": "B14-D2-02", "type": "computation", "prompt": "71 - 46 = ?",
          "answer": { "value": "25", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Ones first: can 1 pay 6?"], "errorTags": ["concept-misconception", "procedure-slip"] },
        { "id": "B14-D2-03", "type": "computation", "prompt": "84 - 29 = ?",
          "answer": { "value": "55", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Trade first, then subtract ones."], "errorTags": ["procedure-slip"] },
        { "id": "B14-D2-04", "type": "computation", "prompt": "66 - 32 = ?",
          "answer": { "value": "34", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Check first: do you even need to trade here?"], "errorTags": ["procedure-slip"] },
        { "id": "B14-D2-05", "type": "computation", "prompt": "90 - 57 = ?",
          "answer": { "value": "33", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["0 ones can't pay 7. Trade a ten."], "errorTags": ["procedure-slip"] },
        { "id": "B14-D2-06", "type": "reasoning", "prompt": "Estimate FIRST: 62 - 19 is about ▢ (use nearest tens). Then solve exactly.",
          "answer": { "value": "about 40; exactly 43", "acceptableForms": ["40; 43", "40, 43"], "validation": "short-text-keyword" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["62 is near 60; 19 is near 20."], "errorTags": ["procedure-slip", "concept-misconception"] }
      ]
    },
    {
      "day": 3, "focus": "fluency-application", "pageCount": 2,
      "items": [
        { "id": "B14-D3-01", "type": "computation", "prompt": "Warm-up! 48 + 30 = ?",
          "answer": { "value": "78", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "B", "week": 10 },
          "hintLadder": ["Only the tens move: 4 tens + 3 tens."], "errorTags": ["fact-recall"] },
        { "id": "B14-D3-02", "type": "computation", "prompt": "73 - 45 = ?",
          "answer": { "value": "28", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Ones first. Trade if 3 can't pay 5."], "errorTags": ["concept-misconception"] },
        { "id": "B14-D3-03", "type": "computation", "prompt": "57 + 26 = ? (careful - this one is ADDING)",
          "answer": { "value": "83", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "B", "week": 13 },
          "hintLadder": ["Read the sign before you touch the columns."], "errorTags": ["task-comprehension"] },
        { "id": "B14-D3-04", "type": "computation", "prompt": "81 - 36 = ?",
          "answer": { "value": "45", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Can 1 pay 6? Trade."], "errorTags": ["procedure-slip"] },
        { "id": "B14-D3-05", "type": "computation", "prompt": "45 - 18 = ? Then CHECK by adding back: your answer + 18 should make 45.",
          "answer": { "value": "27", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Solve first, then add your answer to 18 - do you land on 45?"], "errorTags": ["procedure-slip"] },
        { "id": "B14-D3-06", "type": "error-analysis", "prompt": "Sam solved 63 - 47 like this: ones: 7 - 3 = 4; tens: 6 - 4 = 2; answer 24. What went wrong?",
          "choices": [
            { "key": "A", "text": "Nothing - 24 is correct.", "isCorrect": false, "errorTag": "concept-misconception", "rationale": "Accepts the smaller-from-larger bug as valid." },
            { "key": "B", "text": "Sam flipped the ones: he did 7 - 3 instead of trading so 13 can pay 7.", "isCorrect": true },
            { "key": "C", "text": "Sam should have added the numbers instead.", "isCorrect": false, "errorTag": "task-comprehension", "rationale": "Mistakes the operation entirely; catches sign-inattentive readers." }
          ],
          "answer": { "value": "B", "acceptableForms": [], "validation": "choice-key" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["In 63 - 47, WHICH number's ones must pay?", "Can 3 ones pay 7 ones without a trade?"], "errorTags": ["concept-misconception"] }
      ]
    },
    {
      "day": 4, "focus": "word-problems", "pageCount": 2,
      "items": [
        { "id": "B14-D4-01", "type": "word-problem", "prompt": "Ella saved 62 cents. She spends 35 cents on a sticker. How much money is left?",
          "answer": { "value": "27", "acceptableForms": ["27 cents", "27¢"], "validation": "exact-numeric", "units": "cents" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Money is leaving - which operation?", "Can 2 ones pay 5 ones?"], "errorTags": ["task-comprehension", "concept-misconception"] },
        { "id": "B14-D4-02", "type": "word-problem", "prompt": "A book has 84 pages. Leo has read 48 pages. How many pages are left to read?",
          "answer": { "value": "36", "acceptableForms": ["36 pages"], "validation": "exact-numeric", "units": "pages" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Whole book minus the part already read."], "errorTags": ["task-comprehension"] },
        { "id": "B14-D4-03", "type": "word-problem", "prompt": "Warm-up! Mia had 15 marbles. After giving some away, she has 8 left. How many did she give away?",
          "answer": { "value": "7", "acceptableForms": ["7 marbles"], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "B", "week": 9 },
          "hintLadder": ["Think: 8 plus what makes 15?"], "errorTags": ["task-comprehension"] },
        { "id": "B14-D4-04", "type": "word-problem", "prompt": "Sam has 45 cents. He finds 30 cents more. Then he buys a pencil for 58 cents. How much does he have now?",
          "answer": { "value": "17", "acceptableForms": ["17 cents", "17¢"], "validation": "exact-numeric", "units": "cents" },
          "difficulty": 5, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Two steps: first the finding, then the buying.", "45 + 30 first. Then subtract 58 - trade if needed."], "errorTags": ["task-comprehension", "procedure-slip"] }
      ]
    },
    {
      "day": 5, "focus": "noncomputational", "pageCount": 2,
      "items": [
        { "id": "B14-D5-01", "type": "error-analysis", "prompt": "Ava solved 62 - 28 by trading: 62 becomes 5 tens 12 ones, so 34. Ben counted UP: 28 to 30 is 2, 30 to 62 is 32, so 34. Do BOTH methods work? Explain in one sentence.",
          "answer": { "value": "yes", "acceptableForms": ["yes", "both", "34"], "validation": "short-text-keyword" },
          "difficulty": 4, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["Did they get the same answer?", "Trading takes away; counting up measures the gap. Same distance, two directions."], "errorTags": ["concept-misconception"] },
        { "id": "B14-D5-02", "type": "reasoning", "prompt": "Which method would YOU pick for 100 - 98: trading or counting up? Why?",
          "answer": { "value": "counting up", "acceptableForms": ["counting up", "count up", "count on"], "validation": "short-text-keyword" },
          "difficulty": 3, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["How far apart are 98 and 100?"], "errorTags": ["concept-misconception"] },
        { "id": "B14-D5-03", "type": "error-analysis", "prompt": "Find the mistake: 70 - 26 was solved as: ones: 0 - 6 'can't do it, so write 0'; tens: 7 - 2 = 5; answer 50. What step was skipped, and what is the real answer?",
          "answer": { "value": "the trade was skipped; 44", "acceptableForms": ["trade", "regroup", "44"], "validation": "short-text-keyword" },
          "difficulty": 4, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["'Can't do it' is the signal to do WHAT?", "Trade: 6 tens, 10 ones. Now finish."], "errorTags": ["procedure-slip"] },
        { "id": "B14-D5-04", "type": "drawing", "prompt": "Warm-up! Draw the clock hands for half past 3.",
          "answer": { "value": "hour hand between 3 and 4, minute hand on 6", "acceptableForms": [], "validation": "manual-review" },
          "difficulty": 2, "strand": "noncomputational", "isRetrieval": true, "retrievalSource": { "level": "B", "week": 12 },
          "hintLadder": ["Half past means the minute hand points straight down."], "errorTags": ["representation-misread"] }
      ]
    }
  ],
  "puzzle": {
    "id": "B14-PZ-01",
    "title": "Puzzle Grove: The Mystery Number",
    "puzzleType": "logic",
    "prompt": "I am thinking of a number. If you subtract 27 from my number, you get 35. What is my number? (Careful: this puzzle runs BACKWARD.)",
    "answer": { "value": "62", "acceptableForms": [], "validation": "exact-numeric" },
    "hintLadder": ["Backward puzzles undo: what undoes 'subtract 27'?", "35 + 27 = ?"],
    "errorTags": ["task-comprehension", "concept-misconception"]
  },
  "fluencySprint": {
    "id": "B14-FS-01",
    "skill": "Adding tens to 2-digit numbers (e.g., 34 + 20)",
    "sourceWeek": { "level": "B", "week": 10 },
    "durationSeconds": 120,
    "itemCount": 20,
    "scheduledDay": 3,
    "selfReferenced": true,
    "graded": false,
    "generator": { "templateId": "add_tens_2digit_v1", "params": { "baseRange": [21, 69], "tensRange": [10, 30], "noCross100": true }, "seed": 1410 }
  },
  "masteryCheck": {
    "passThresholdPct": 85,
    "fastTrackPct": 95,
    "formA": [
      { "id": "B14-MA-01", "type": "computation", "prompt": "64 - 28 = ?",
        "answer": { "value": "36", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Ones first: can 4 pay 8?"], "errorTags": ["concept-misconception", "procedure-slip"] },
      { "id": "B14-MA-02", "type": "computation", "prompt": "92 - 45 = ?",
        "answer": { "value": "47", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Trade, then subtract each column."], "errorTags": ["procedure-slip"] },
      { "id": "B14-MA-03", "type": "computation", "prompt": "75 - 33 = ?",
        "answer": { "value": "42", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Check first: is a trade even needed?"], "errorTags": ["procedure-slip"] },
      { "id": "B14-MA-04", "type": "computation", "prompt": "80 - 46 = ?",
        "answer": { "value": "34", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["0 ones can't pay 6 - trade."], "errorTags": ["procedure-slip"] },
      { "id": "B14-MA-05", "type": "word-problem", "prompt": "A jar holds 53 beans. 27 beans spill out. How many beans are left?",
        "answer": { "value": "26", "acceptableForms": ["26 beans"], "validation": "exact-numeric", "units": "beans" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Beans are leaving the jar - which operation?"], "errorTags": ["task-comprehension"] },
      { "id": "B14-MA-06", "type": "reasoning", "prompt": "Do you need to trade? 41 - 25. Answer yes or no, then solve.",
        "answer": { "value": "yes; 16", "acceptableForms": ["yes, 16", "yes 16"], "validation": "short-text-keyword" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Only the ones column decides."], "errorTags": ["concept-misconception"] }
    ],
    "formB": [
      { "id": "B14-MB-01", "type": "computation", "prompt": "63 - 29 = ?",
        "answer": { "value": "34", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Ones first: can 3 pay 9?"], "errorTags": ["concept-misconception", "procedure-slip"] },
      { "id": "B14-MB-02", "type": "computation", "prompt": "85 - 47 = ?",
        "answer": { "value": "38", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Trade, then subtract each column."], "errorTags": ["procedure-slip"] },
      { "id": "B14-MB-03", "type": "computation", "prompt": "68 - 24 = ?",
        "answer": { "value": "44", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Check first: is a trade even needed?"], "errorTags": ["procedure-slip"] },
      { "id": "B14-MB-04", "type": "computation", "prompt": "90 - 38 = ?",
        "answer": { "value": "52", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["0 ones can't pay 8 - trade."], "errorTags": ["procedure-slip"] },
      { "id": "B14-MB-05", "type": "word-problem", "prompt": "A box holds 62 crayons. 35 crayons are handed out. How many crayons are left in the box?",
        "answer": { "value": "27", "acceptableForms": ["27 crayons"], "validation": "exact-numeric", "units": "crayons" },
        "difficulty": 4, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Crayons are leaving the box - which operation?"], "errorTags": ["task-comprehension"] },
      { "id": "B14-MB-06", "type": "reasoning", "prompt": "Do you need to trade? 52 - 36. Answer yes or no, then solve.",
        "answer": { "value": "yes; 16", "acceptableForms": ["yes, 16", "yes 16"], "validation": "short-text-keyword" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Only the ones column decides."], "errorTags": ["concept-misconception"] }
    ],
    "isomorphNotes": "Pairs by index; all from sub_2digit_regroup_v1 param classes. 01-02: forced regroup (ones(minuend) < ones(subtrahend)), minuend 60-95. 03: no-regroup control (must keep the trade-or-not decision live). 04: zero-ones minuend (the E53-scaffold stress case). 05: separate-result-unknown story, container context swapped (jar/beans -> box/crayons), forced regroup. 06: yes/no decision + solve, forced regroup both forms (error-affordance preserved). No operand pair reused from Form A or daily items."
  },
  "mistakeBank": [
    { "errorTag": "concept-misconception", "subtype": "smaller-from-larger", "description": "Subtracts the smaller digit from the larger in each column regardless of position (63-47 -> 24). Place value is not yet driving the procedure.", "exampleWrongAnswer": "63 - 47 = 24", "distractorRationale": "Compute each column as |digit difference| and offer that result.", "reteachPointer": "guidedExamples/B14-GE-01 (blocks make the trade physical)" },
    { "errorTag": "procedure-slip", "subtype": "unreduced-tens", "description": "Trades for the ones but forgets to reduce the tens digit (63-47: 13-7=6 but tens stay 6: 6-4=2 -> 26).", "exampleWrongAnswer": "63 - 47 = 26", "distractorRationale": "Offer (correct + 10) on regrouping items.", "reteachPointer": "guidedExamples/B14-GE-02 (every ink mark = a real trade)" },
    { "errorTag": "procedure-slip", "subtype": "zero-ones-skip", "description": "On a zero-ones minuend writes 0 in the ones ('0-6 can't, so 0') and never trades.", "exampleWrongAnswer": "70 - 26 = 50", "distractorRationale": "Offer (tens-only difference)x10 on zero-ones items.", "reteachPointer": "explanation/script[1] + D5-03 replay" },
    { "errorTag": "fact-recall", "subtype": "teen-minus-fact", "description": "Trade is correct but the teen subtraction fact inside is wrong (13 - 7 = 5).", "exampleWrongAnswer": "63 - 47 = 15", "distractorRationale": "Offer correct +/- 1 alongside the structural distractors.", "reteachPointer": "60-second think-addition fact refresh; add fact to sprint pool" },
    { "errorTag": "task-comprehension", "subtype": "operation-flip", "description": "Adds in a take-away story or subtracts in the middle of a two-step problem's first step.", "exampleWrongAnswer": "Ella: 62 + 35 = 97 cents", "distractorRationale": "Offer the sum on subtraction stories.", "reteachPointer": "Day-4 story replay: 'is the amount growing or shrinking?'" },
    { "errorTag": "representation-misread", "subtype": "model-miscount", "description": "Reads the base-ten model wrong (counts a rod as one, or miscounts cubes).", "exampleWrongAnswer": "reads 45 as 9", "distractorRationale": "Offer rods+cubes counted as units.", "reteachPointer": "explanation/script[0] (a rod IS ten ones)" }
  ],
  "parentSummarySeed": {
    "whatWeWorkedOn": "Subtracting two-digit numbers when a column can't pay - trading one ten for ten ones (regrouping), first with blocks, then with the written column method, plus estimating first as a self-check.",
    "improvingCandidates": [
      "estimating before subtracting and noticing when an answer 'smells wrong'",
      "narrating the trade out loud instead of moving digits silently",
      "checking subtraction by adding back"
    ],
    "strengtheningByTag": [
      { "errorTag": "concept-misconception", "text": "resisting the shortcut of flipping the digits (doing 7-3 when the problem needs 13-7 after a trade) - the block model will stay alongside the written method a little longer" },
      { "errorTag": "procedure-slip", "text": "remembering the tens digit shrinks after a trade - warm-ups will keep one traded problem in the mix for several weeks" },
      { "errorTag": "task-comprehension", "text": "reading whether a story is a growing or a shrinking situation before choosing + or -" }
    ],
    "homeFocus": {
      "praiseLine": "I saw you check your answer with an estimate before anyone asked - that is real mathematician behavior.",
      "questionForChild": "Why do we sometimes trade a ten for ten ones when we subtract?",
      "schoolSyncHook": "If you share what your child's class is doing in math right now, we will lean the warm-ups toward it."
    },
    "vocabularyForParent": ["regroup / trade (break one ten into ten ones)", "difference (the subtraction answer)", "estimate (a fast close-enough check)"]
  }
};
