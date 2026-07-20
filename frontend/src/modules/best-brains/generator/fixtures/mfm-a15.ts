/**
 * Static reference fixture — QUESTION-GENERATOR-SPEC §4.1 worked sample pack,
 * ported VERBATIM (original spec content). Level A · Week 15 "Addition within 10".
 * Served by the fixture loader for (A, 15) regardless of seed; pinned at
 * contentVersion 1.0.0.
 */

import type { WeeklyConceptPack } from '../../types';

export const MFM_A15: WeeklyConceptPack = {
  "schemaVersion": "1.0",
  "packId": "MFM-A15",
  "contentVersion": "1.0.0",
  "identity": {
    "level": "A", "week": 15,
    "conceptId": "addition-within-10",
    "conceptName": "Addition within 10",
    "band": "beginner",
    "strandTags": ["addition-subtraction", "number-sense-counting"],
    "prerequisiteWeeks": [{ "level": "A", "week": 12 }, { "level": "A", "week": 13 }, { "level": "A", "week": 14 }]
  },
  "presentation": {
    "audioFirst": true,
    "oneOperationPerPage": true,
    "scaffoldNotes": "Oversized answer boxes; all prompts read aloud; ten-frames available on Days 2-3; mascot present."
  },
  "explanation": {
    "hook": "Two little duck teams are swimming to the SAME pond. Splash! When groups join, a new bigger group is born. How big? That's what adding tells us.",
    "whyBeforeHow": "Adding means JOINING two groups. We could count every single one from the start each time - but that is slow. If we start with the bigger group and count on, we get there faster. The why: the big group is already counted, so we don't count it again.",
    "script": [
      { "say": "Watch me join 4 ducks and 3 ducks. I count ALL of them: 1, 2, 3, 4, 5, 6, 7. Seven ducks in all!", "visual": "Two duck groups slide together into one pond." },
      { "say": "Now the fast way. The 4-duck team is ALREADY counted. I hold 4 in my head... and count on: 5, 6, 7. Same answer, fewer counts!", "visual": "Number 4 glows; three hops animate: 5, 6, 7." },
      { "say": "We can write the story as a number sentence: 4 + 3 = 7. Plus means join. Equals means 'in all'.", "visual": "4 + 3 = 7 builds symbol by symbol under the ducks." },
      { "say": "Secret: 4 + 3 and 3 + 4 land on the same number. Joining is fair - it doesn't care who came first. So always start with the BIG number.", "visual": "The two groups swap sides; total stays 7." }
    ],
    "summary": "Adding joins two groups. Start big, count on. Write it as a number sentence with + and =.",
    "vocabulary": [
      { "term": "add", "kidGloss": "join groups together" },
      { "term": "in all", "kidGloss": "how many when everyone is together" },
      { "term": "number sentence", "kidGloss": "a math story like 4 + 3 = 7" },
      { "term": "count on", "kidGloss": "start big, keep counting up" }
    ]
  },
  "guidedExamples": [
    {
      "id": "A15-GE-01", "fadeLevel": "modeled",
      "prompt": "[image: 4 ducks in a pond, 3 ducks arriving] How many ducks in all?",
      "steps": [
        { "teacherSay": "I join the groups and count every duck: 1, 2, 3, 4, 5, 6, 7.", "expected": "7" },
        { "teacherSay": "Seven in all. Now watch the fast way on the next one." }
      ],
      "answer": "7"
    },
    {
      "id": "A15-GE-02", "fadeLevel": "completion",
      "prompt": "Same ducks: 4 + 3. This time we start big and count on.",
      "steps": [
        { "teacherSay": "The 4 is done - hold it in your head." },
        { "childDo": "Tap each new duck and count on from 4.", "expected": "5, 6, 7" },
        { "teacherSay": "Seven again! Counting on works." }
      ],
      "answer": "7"
    },
    {
      "id": "A15-GE-03", "fadeLevel": "prompted",
      "prompt": "[image: 5 ladybugs, 2 ladybugs] The number sentence is started: 5 + 2 = ?",
      "steps": [
        { "teacherSay": "Which number do we start with?", "expected": "5" },
        { "childDo": "Count on 2 from 5 and fill the box.", "expected": "6, 7 -> 7" }
      ],
      "answer": "7"
    },
    {
      "id": "A15-GE-04", "fadeLevel": "independent",
      "prompt": "[image: 6 snails, 3 snails] Build the whole number sentence yourself and solve.",
      "steps": [
        { "childDo": "Write the number sentence and the total.", "expected": "6 + 3 = 9" }
      ],
      "answer": "6 + 3 = 9"
    }
  ],
  "days": [
    {
      "day": 1, "focus": "concept-echo", "pageCount": 2,
      "items": [
        { "id": "A15-D1-01", "type": "representation", "prompt": "Warm-up! Listen: SEVEN. Write the number.",
          "answer": { "value": "7", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 1, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "A", "week": 3 },
          "hintLadder": ["Say it slowly: sev-en. Which numeral says that?"], "errorTags": ["fact-recall"] },
        { "id": "A15-D1-02", "type": "representation", "prompt": "Warm-up! [image: 5-frame with 2 dots shown, rest hidden] 5 is 2 and how many hiding?",
          "answer": { "value": "3", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 1, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "A", "week": 12 },
          "hintLadder": ["Count up from 2 until you reach 5."], "errorTags": ["fact-recall"] },
        { "id": "A15-D1-03", "type": "computation", "prompt": "[image: 3 red apples, 2 green apples] How many apples in all?",
          "answer": { "value": "5", "acceptableForms": ["five"], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Touch each apple as you count.", "Start at 3, count on: 4... ?"], "errorTags": ["representation-misread"] },
        { "id": "A15-D1-04", "type": "representation", "prompt": "[image: 2 stars, 4 stars] Write the number sentence.",
          "answer": { "value": "2+4=6", "acceptableForms": ["4+2=6"], "validation": "number-sentence" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["How many in the first group? The second?", "Groups... plus... equals in all."], "errorTags": ["concept-misconception"] },
        { "id": "A15-D1-05", "type": "computation", "prompt": "Start at 6. Count on 2. Where do you land?",
          "answer": { "value": "8", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "generator": { "templateId": "count_on_v1", "params": { "start": 6, "hop": 2 }, "seed": 4151 },
          "hintLadder": ["Hold 6 in your head. Hop twice: 7... ?"], "errorTags": ["procedure-slip"] },
        { "id": "A15-D1-06", "type": "computation", "prompt": "[image: 5 buttons, 4 buttons] How many in all?",
          "answer": { "value": "9", "acceptableForms": ["nine"], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Which group is bigger? Start there.", "Hold 5, count on: 6, 7, 8... ?"], "errorTags": ["procedure-slip", "representation-misread"] }
      ]
    },
    {
      "day": 2, "focus": "fluency-application", "pageCount": 2,
      "items": [
        { "id": "A15-D2-01", "type": "representation", "prompt": "Warm-up! [image: hand showing 1 finger, hidden hand] Together they make 5. How many hiding?",
          "answer": { "value": "4", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 1, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "A", "week": 12 },
          "hintLadder": ["Count up from 1 to 5 on your fingers."], "errorTags": ["fact-recall"] },
        { "id": "A15-D2-02", "type": "computation", "prompt": "[image: ten-frame with 7 counters] 7 + 2 = ?",
          "answer": { "value": "9", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["The frame already shows 7. Count on: 8... ?"], "errorTags": ["procedure-slip"] },
        { "id": "A15-D2-03", "type": "computation", "prompt": "9 + 1 = ?",
          "answer": { "value": "10", "acceptableForms": ["ten"], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Just one hop up from 9."], "errorTags": ["fact-recall"] },
        { "id": "A15-D2-04", "type": "computation", "prompt": "2 + 6 = ? Which number is bigger? Start there and count on.",
          "answer": { "value": "8", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["6 is bigger than 2 - start at 6.", "Hold 6: 7... ?"], "errorTags": ["procedure-slip"] },
        { "id": "A15-D2-05", "type": "computation", "prompt": "[image: ten-frame with 5 counters] 5 + 3 = ?",
          "answer": { "value": "8", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["The top row is full - that's 5. Count on 3."], "errorTags": ["procedure-slip"] },
        { "id": "A15-D2-06", "type": "representation", "prompt": "Warm-up! [image: 13 dots in a scatter] Count the dots.",
          "answer": { "value": "13", "acceptableForms": ["thirteen"], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "A", "week": 9 },
          "hintLadder": ["Cross out each dot as you count it."], "errorTags": ["representation-misread"] }
      ]
    },
    {
      "day": 3, "focus": "fluency-application", "pageCount": 2,
      "items": [
        { "id": "A15-D3-01", "type": "computation", "prompt": "Warm-up! What number comes between 7 and 9?",
          "answer": { "value": "8", "acceptableForms": ["eight"], "validation": "exact-numeric" },
          "difficulty": 1, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "A", "week": 6 },
          "hintLadder": ["Say the number path: 7, ?, 9."], "errorTags": ["fact-recall"] },
        { "id": "A15-D3-02", "type": "computation", "prompt": "3 + 3 = ?",
          "answer": { "value": "6", "acceptableForms": ["six"], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Twins! Hold 3, count on 3."], "errorTags": ["fact-recall"] },
        { "id": "A15-D3-03", "type": "computation", "prompt": "[image: 4 striped fish, 4 spotted fish] How many fish in all?",
          "answer": { "value": "8", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 2, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Hold 4 in your head and count the spotted ones on."], "errorTags": ["representation-misread"] },
        { "id": "A15-D3-04", "type": "computation", "prompt": "1 + 8 = ? Which number do you start with?",
          "answer": { "value": "9", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Starting at 1 means counting 8 hops - too many! Start at 8."], "errorTags": ["procedure-slip"] },
        { "id": "A15-D3-05", "type": "representation", "prompt": "[image: 3 red kites, 5 blue kites] Write the number sentence and solve.",
          "answer": { "value": "3+5=8", "acceptableForms": ["5+3=8"], "validation": "number-sentence" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Count each kite group first.", "Groups plus groups equals in all."], "errorTags": ["concept-misconception"] },
        { "id": "A15-D3-06", "type": "computation", "prompt": "7 + 3 = ?",
          "answer": { "value": "10", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Hold 7: 8, 9... ?"], "errorTags": ["fact-recall", "procedure-slip"] }
      ]
    },
    {
      "day": 4, "focus": "word-problems", "pageCount": 2,
      "items": [
        { "id": "A15-D4-01", "type": "word-problem", "prompt": "(Read aloud) Maya has 4 crackers. Dad gives her 5 more. How many crackers does Maya have now?",
          "answer": { "value": "9", "acceptableForms": ["nine"], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Is Maya's group getting bigger or smaller?", "Start big: hold 5, count Maya's 4 on."], "errorTags": ["task-comprehension"] },
        { "id": "A15-D4-02", "type": "word-problem", "prompt": "(Read aloud) 5 frogs sit on a log. 2 more frogs hop on. How many frogs on the log?",
          "answer": { "value": "7", "acceptableForms": ["seven"], "validation": "exact-numeric" },
          "difficulty": 3, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Frogs are JOINING. Hold 5 and count the new ones on."], "errorTags": ["task-comprehension"] },
        { "id": "A15-D4-03", "type": "classification", "prompt": "Warm-up! [image: 7 red balloons, 5 blue balloons] Which color has MORE?",
          "choices": [
            { "key": "A", "text": "red", "isCorrect": true },
            { "key": "B", "text": "blue", "isCorrect": false, "errorTag": "representation-misread", "rationale": "Blue balloons are drawn larger and spread out - traps judging by space instead of count (conservation)." }
          ],
          "answer": { "value": "A", "acceptableForms": ["red"], "validation": "choice-key" },
          "difficulty": 2, "strand": "computational", "isRetrieval": true, "retrievalSource": { "level": "A", "week": 5 },
          "hintLadder": ["Don't trust your eyes - count each color."], "errorTags": ["representation-misread"] },
        { "id": "A15-D4-04", "type": "word-problem", "prompt": "(Read aloud) 3 big dogs and 6 small dogs are at the park. How many dogs in all?",
          "answer": { "value": "9", "acceptableForms": [], "validation": "exact-numeric" },
          "difficulty": 4, "strand": "computational", "isRetrieval": false,
          "hintLadder": ["Big AND small dogs are all dogs - join the groups.", "Start with 6, count on 3."], "errorTags": ["task-comprehension", "procedure-slip"] }
      ]
    },
    {
      "day": 5, "focus": "noncomputational", "pageCount": 2,
      "items": [
        { "id": "A15-D5-01", "type": "representation", "prompt": "[image: 3 bunnies eating, 4 bunnies hopping] Write a number sentence and solve.",
          "answer": { "value": "3+4=7", "acceptableForms": ["4+3=7"], "validation": "number-sentence" },
          "difficulty": 3, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["Two bunny groups. Count each one first."], "errorTags": ["concept-misconception"] },
        { "id": "A15-D5-02", "type": "representation", "prompt": "[image: 6 ants on a leaf, 4 ants marching over] Write a number sentence and solve.",
          "answer": { "value": "6+4=10", "acceptableForms": ["4+6=10"], "validation": "number-sentence" },
          "difficulty": 3, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["Which group is bigger? Put it first if you like - both ways work."], "errorTags": ["concept-misconception"] },
        { "id": "A15-D5-03", "type": "drawing", "prompt": "Draw your own picture for 2 + 3. Then write how many in all.",
          "answer": { "value": "5", "acceptableForms": ["drawing shows 2 and 3 objects; total 5"], "validation": "manual-review" },
          "difficulty": 3, "strand": "noncomputational", "isRetrieval": false,
          "hintLadder": ["Draw a group of 2 anything, then a group of 3."], "errorTags": ["representation-misread"] },
        { "id": "A15-D5-04", "type": "classification", "prompt": "Warm-up! [image: triangle, circle, square] Circle the triangle.",
          "choices": [
            { "key": "A", "text": "triangle", "isCorrect": true },
            { "key": "B", "text": "circle", "isCorrect": false, "errorTag": "fact-recall", "rationale": "Shape-name confusion; no corner-counting applied." },
            { "key": "C", "text": "square", "isCorrect": false, "errorTag": "fact-recall", "rationale": "Both have straight sides; traps children who don't count corners." }
          ],
          "answer": { "value": "A", "acceptableForms": ["triangle"], "validation": "choice-key" },
          "difficulty": 1, "strand": "noncomputational", "isRetrieval": true, "retrievalSource": { "level": "A", "week": 7 },
          "hintLadder": ["Count the corners: a triangle has 3."], "errorTags": ["fact-recall"] }
      ],
      "teacherNoteStrip": "For grown-ups: this week your child learned 'counting on' - starting from the bigger number instead of recounting everything (6 + 2: hold 6, say '7, 8'). If they still count all from 1, that's a normal stage; invite 'start big!' rather than correcting. Ask them to READ a number sentence aloud like a story: '4 plus 3 equals 7' means 4 and 3 joined make 7 in all."
    }
  ],
  "puzzle": {
    "id": "A15-PZ-01",
    "title": "Puzzle Grove: Add-and-Color Garden",
    "puzzleType": "math-art",
    "prompt": "[image: garden of 6 flowers, each labeled with a sum: 4+4, 5+4, 6+2, 3+6, 7+1, 2+7] Solve each sum. Color the flowers that make 8 YELLOW. Color the flowers that make 9 PURPLE.",
    "answer": {
      "value": "yellow: 4+4, 6+2, 7+1; purple: 5+4, 3+6, 2+7",
      "acceptableForms": [],
      "validation": "set"
    },
    "hintLadder": ["Solve every flower's sum first, in pencil.", "Close answers are tricky: 8 and 9 are neighbors, so count carefully."],
    "errorTags": ["fact-recall", "procedure-slip"]
  },
  "fluencySprint": null,
  "masteryCheck": {
    "passThresholdPct": 85,
    "fastTrackPct": 95,
    "formA": [
      { "id": "A15-MA-01", "type": "computation", "prompt": "[image: 2 cats, 5 cats] How many cats in all?",
        "answer": { "value": "7", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Start with the bigger group and count on."], "errorTags": ["representation-misread"] },
      { "id": "A15-MA-02", "type": "computation", "prompt": "4 + 2 = ?",
        "answer": { "value": "6", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Hold 4, hop twice."], "errorTags": ["fact-recall"] },
      { "id": "A15-MA-03", "type": "computation", "prompt": "3 + 7 = ?",
        "answer": { "value": "10", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Which number is bigger? Start there."], "errorTags": ["procedure-slip"] },
      { "id": "A15-MA-04", "type": "computation", "prompt": "Start at 8. Count on 2. Where do you land?",
        "answer": { "value": "10", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Hold 8: 9... ?"], "errorTags": ["procedure-slip"] },
      { "id": "A15-MA-05", "type": "representation", "prompt": "[image: 6 pears, 3 pears] Write the number sentence and solve.",
        "answer": { "value": "6+3=9", "acceptableForms": ["3+6=9"], "validation": "number-sentence" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Two groups, a plus, an equals, a total."], "errorTags": ["concept-misconception"] },
      { "id": "A15-MA-06", "type": "computation", "prompt": "8 + 1 = ?",
        "answer": { "value": "9", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["One hop up from 8."], "errorTags": ["fact-recall"] }
    ],
    "formB": [
      { "id": "A15-MB-01", "type": "computation", "prompt": "[image: 3 hens, 4 chicks] How many birds in all?",
        "answer": { "value": "7", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Start with the bigger group and count on."], "errorTags": ["representation-misread"] },
      { "id": "A15-MB-02", "type": "computation", "prompt": "5 + 2 = ?",
        "answer": { "value": "7", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Hold 5, hop twice."], "errorTags": ["fact-recall"] },
      { "id": "A15-MB-03", "type": "computation", "prompt": "2 + 8 = ?",
        "answer": { "value": "10", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Which number is bigger? Start there."], "errorTags": ["procedure-slip"] },
      { "id": "A15-MB-04", "type": "computation", "prompt": "Start at 6. Count on 3. Where do you land?",
        "answer": { "value": "9", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Hold 6: 7... ?"], "errorTags": ["procedure-slip"] },
      { "id": "A15-MB-05", "type": "representation", "prompt": "[image: 5 red cups, 3 blue cups] Write the number sentence and solve.",
        "answer": { "value": "5+3=8", "acceptableForms": ["3+5=8"], "validation": "number-sentence" },
        "difficulty": 3, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["Two groups, a plus, an equals, a total."], "errorTags": ["concept-misconception"] },
      { "id": "A15-MB-06", "type": "computation", "prompt": "7 + 1 = ?",
        "answer": { "value": "8", "acceptableForms": [], "validation": "exact-numeric" },
        "difficulty": 2, "strand": "computational", "isRetrieval": false,
        "hintLadder": ["One hop up from 7."], "errorTags": ["fact-recall"] }
    ],
    "isomorphNotes": "Pairs by index. 01: picture count-all/count-on, a+b<=8, mixed animal nouns, smaller group first. 02: a+2 fact, a in 3..6. 03: small-number-first make-ten pair (forces start-big choice), sum=10. 04: count-on stated form, start 5..8, hop 2..3. 05: picture-to-sentence, sum 8..9, commuted forms accepted. 06: a+1 neighbor fact, a in 6..8. No operand tuple reused from Form A or daily items; answers differ from Form A at indexes 2,4,6."
  },
  "mistakeBank": [
    { "errorTag": "procedure-slip", "subtype": "count-on-off-by-one", "description": "Child counts the starting number as the first hop: 6 + 2 -> '6, 7' -> answers 7.", "exampleWrongAnswer": "6 + 2 = 7", "distractorRationale": "Offer (correct - 1) as a distractor on count-on items.", "reteachPointer": "guidedExamples/A15-GE-02 (hold-it-in-your-head move)" },
    { "errorTag": "representation-misread", "subtype": "miscount", "description": "Skips or double-counts pictured objects, especially scattered sets.", "exampleWrongAnswer": "counts 9 dots as 8", "distractorRationale": "Offer (correct +/- 1) on picture-count items.", "reteachPointer": "explanation/script[0] (touch-count every one)" },
    { "errorTag": "concept-misconception", "subtype": "equals-as-next", "description": "Writes one of the parts (or the next counting number) after '=', treating '=' as 'write something' rather than 'in all'.", "exampleWrongAnswer": "3 + 4 = 4", "distractorRationale": "On sentence items accept-and-flag a part written as the total.", "reteachPointer": "explanation/script[2] (equals means 'in all')" },
    { "errorTag": "task-comprehension", "subtype": "story-misheard", "description": "Answers about the wrong quantity in a story (e.g., only the new frogs, not the total).", "exampleWrongAnswer": "5 frogs + 2 more -> answers 2", "distractorRationale": "Offer the addend alone as a distractor on story items.", "reteachPointer": "Day-4 read-aloud replay: 'what is the story asking IN ALL?'" }
  ],
  "parentSummarySeed": {
    "whatWeWorkedOn": "Adding two groups within 10 - first by joining and counting everything, then the faster 'start big and count on' strategy, and writing it as a number sentence like 4 + 3 = 7.",
    "improvingCandidates": [
      "starting from the bigger number instead of recounting from 1",
      "reading a number sentence aloud like a story",
      "building a number sentence from a picture without help"
    ],
    "strengtheningByTag": [
      { "errorTag": "procedure-slip", "text": "counting on without counting the starting number itself (6 + 2 is '7, 8', not '6, 7') - the warm-ups will keep practicing this hold-it-in-your-head move" },
      { "errorTag": "concept-misconception", "text": "remembering that the number after '=' means 'how many in all' - we will keep pairing pictures with sentences until it settles" },
      { "errorTag": "representation-misread", "text": "careful touch-counting of pictures before answering - speed is not the goal" }
    ],
    "homeFocus": {
      "praiseLine": "I saw you start with the big number and count on - that is a clever shortcut, not a cheat!",
      "questionForChild": "If you have 6 grapes and I give you 2 more, how do you add them without counting from 1?",
      "schoolSyncHook": "If you share what your child's class is counting or adding at school, we will lean the warm-ups toward it."
    },
    "vocabularyForParent": ["add (join groups)", "in all (the total)", "number sentence (e.g., 4 + 3 = 7)", "count on (start big, count up)"]
  }
};
