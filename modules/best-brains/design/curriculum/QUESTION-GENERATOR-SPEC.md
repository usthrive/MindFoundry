# QUESTION-GENERATOR SPEC — Weekly Concept Packs (Best Brains-Inspired Math Module, Mind Foundry)

**Phase 4B deliverable · Curriculum Architect · 2026-07-19**
**Governed by:** `METHODOLOGY-MODEL.md` (the constitution). Cites `EVIDENCE-LEDGER-FINAL.md` (E-rows, incl. rev. P3.1) and `DESIGN-DEFAULTS.md` (DD-rows). Everything not cited is `[original design]`.
**Legal posture:** All schemas, templates, item content, puzzle formats' names, and sample packs below are 100% original. Structural shape (weekly packet, day structure, dual strands, front-of-packet worked examples) cites ledger rows as inspiration only; no Best Brains worksheet content, code, or branding is copied. The module's own puzzle mark is **"Puzzle Grove"** `[original design]` — never Best Brains' branded puzzle names.

---

## 1. Pack anatomy

One **WeeklyConceptPack** = the complete authored content for one Level × Week cell of the curriculum graph (week = primary key, per METHODOLOGY-MODEL §2). Components, each traceable:

| # | Component | Spec | Source |
|---|---|---|---|
| 1 | **Identity + versioning** | Level (A–E), week (1–24), conceptId, concept name, band, strand tags (labels per E25), prerequisite weeks; `contentVersion` on every pack so a "wrong book" state is impossible | E27/E94 addressing shape `[original design codes]`; DD15 vs E87 |
| 2 | **Teacher explanation** | Concept-intro script for the persona's 5–10 min lesson: hook → why-before-how → 3–5 scripted segments (visual-first per E60) → summary → kid-glossed vocabulary (vocabulary-as-content per E63) | DD4 instruction slice; E5 concept-first |
| 3 | **Guided examples (3–5)** | Scaffold-fade sequence: `modeled` (persona solves, thinking aloud) → `completion` (child fills missing steps) → `prompted` → `independent`. Pinned to the packet front all week | DD4 "I do / we do"; E99 front-matter convention; worked-example effect per DD3 |
| 4 | **Days 1–5** | Day-numbered (not weekday-named) per DD3: Day 1 concept echo · Days 2–3 fluency + application · Day 4 word problems (per E38 lever) · Day 5 non-computational page (DD12). 2–3 pages/day, 3–6 problems/page (density per E64/E62), 5–15 min dose (E12). Daily unlock enforced (E46/E79) | DD3 |
| 5 | **Spiral-review slots** | 20–30% of daily items flagged `isRetrieval`, styled as warm-ups, drawn backward-only from completed weeks (cross-level allowed) at expanding intervals | DD8 **[DIVERGENCE — never describe as Best Brains practice, per E4/E100]** |
| 6 | **Word problems** | Guaranteed Day-4 slot; band-matched contexts; multi-step from Level C up | DD3, E38 |
| 7 | **Puzzle** | One "Puzzle Grove" page per week, band-matched (multi-modal at A per E57 · logic at B/C per E58 · error-analysis/A-S/N at D/E per E59), always same-concept transfer (strand-coupling law) | DD12, E26 |
| 8 | **Timed fluency mini-set** | 2-minute ungraded self-referenced sprint, **Level B and up only**, source skill mastered ≥2 weeks prior, ≤2/week, scheduled on Day 2–3; `null` for Level A | DD11; ungraded-timed philosophy per E54 |
| 9 | **Mastery check** | Form A (weekly-check objective items, lives on Day 5) + **Form B parallel isomorphs** (served only in the corrective loop, never identical pages); Pass ≥ 85% (band 80–90), fast-track ≥ 95% | DD1 **[DIVERGENCE vs evidenced ~45–62% bracket, per E31/E98]** |
| 10 | **Common-mistake bank** | Anticipated wrong answers, each tagged with one DD7 error class (+ optional subtype), with distractor rationale and a reteach pointer; feeds MC distractors, diagnosis, and the corrective micro-reteach | DD7; E52/E88 repair |
| 11 | **Parent-summary seed** | Seed text for the weekly report, keyed to the confirmed Progress-Book field structure: what was covered · needs reinforcement · improving · focus at home | E102, DD6; optional school-sync hook per E103 |

---

## 2. JSON Schema (draft-07)

Strict schema for a `WeeklyConceptPack`. Designed to be **generator-friendly** (every item may carry a `generator` block: templateId + params + seed, so packs are reproducible from templates) **and hand-authorable** (the `generator` block is optional; hand-written items validate identically). `[original design]`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://mindfoundry.app/schemas/weekly-concept-pack-1.0.json",
  "title": "WeeklyConceptPack",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "schemaVersion", "packId", "contentVersion", "identity", "explanation",
    "guidedExamples", "days", "puzzle", "fluencySprint", "masteryCheck",
    "mistakeBank", "parentSummarySeed"
  ],
  "properties": {
    "schemaVersion": { "type": "string", "const": "1.0" },
    "packId": {
      "type": "string",
      "pattern": "^MFM-[A-E](2[0-4]|1[0-9]|[1-9])$",
      "description": "MFM-<Level><Week>, e.g. MFM-B14. Original code scheme; structurally inspired by Level-x-Week addressing (E27/E94), shares no Best Brains codes."
    },
    "contentVersion": {
      "type": "string",
      "pattern": "^[0-9]+\\.[0-9]+\\.[0-9]+$",
      "description": "Semver. Any content change bumps this (versioned content pointers, DD15 vs E87)."
    },
    "identity": {
      "type": "object",
      "additionalProperties": false,
      "required": ["level", "week", "conceptId", "conceptName", "band", "strandTags", "prerequisiteWeeks"],
      "properties": {
        "level": { "type": "string", "enum": ["A", "B", "C", "D", "E"] },
        "week": { "type": "integer", "minimum": 1, "maximum": 24 },
        "conceptId": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" },
        "conceptName": { "type": "string", "maxLength": 80 },
        "band": { "type": "string", "enum": ["beginner", "intermediate", "transition", "advanced"] },
        "strandTags": {
          "type": "array", "minItems": 1, "maxItems": 3, "uniqueItems": true,
          "items": { "type": "string", "enum": [
            "number-sense-counting", "addition-subtraction", "multiplication-division",
            "decimals-fractions", "probability-statistics", "algebra-geometry"
          ] },
          "description": "Strand labels only, per E25."
        },
        "prerequisiteWeeks": {
          "type": "array", "items": { "$ref": "#/definitions/weekRef" },
          "description": "Feeds the curriculum graph (METHODOLOGY-MODEL §8)."
        }
      }
    },
    "presentation": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "audioFirst": { "type": "boolean", "description": "Required true for Level A (CURRICULUM-MAP Level A notes)." },
        "oneOperationPerPage": { "type": "boolean", "description": "Early Level A format, per E62." },
        "scaffoldNotes": { "type": "string", "description": "Band scaffold conventions in play (e.g. labeled place-value columns per E53; fade plan at Level D per E60)." }
      }
    },
    "explanation": {
      "type": "object",
      "additionalProperties": false,
      "required": ["hook", "whyBeforeHow", "script", "summary", "vocabulary"],
      "properties": {
        "hook": { "type": "string", "description": "Opening story/wonder moment (DD4 session script)." },
        "whyBeforeHow": { "type": "string", "description": "The concept's WHY, stated before any procedure (E5)." },
        "script": {
          "type": "array", "minItems": 2, "maxItems": 6,
          "items": {
            "type": "object", "additionalProperties": false,
            "required": ["say"],
            "properties": {
              "say": { "type": "string" },
              "visual": { "type": "string", "description": "Asset/manipulative direction; visual-first per E60." }
            }
          }
        },
        "summary": { "type": "string" },
        "vocabulary": {
          "type": "array", "minItems": 1, "maxItems": 6,
          "items": {
            "type": "object", "additionalProperties": false,
            "required": ["term", "kidGloss"],
            "properties": { "term": { "type": "string" }, "kidGloss": { "type": "string" } }
          }
        }
      }
    },
    "guidedExamples": {
      "type": "array", "minItems": 3, "maxItems": 5,
      "items": {
        "type": "object", "additionalProperties": false,
        "required": ["id", "fadeLevel", "prompt", "steps", "answer"],
        "properties": {
          "id": { "$ref": "#/definitions/contentId" },
          "fadeLevel": { "type": "string", "enum": ["modeled", "completion", "prompted", "independent"] },
          "prompt": { "type": "string" },
          "steps": {
            "type": "array", "minItems": 1, "maxItems": 8,
            "items": {
              "type": "object", "additionalProperties": false,
              "properties": {
                "teacherSay": { "type": "string" },
                "childDo": { "type": "string" },
                "expected": { "type": "string" }
              },
              "anyOf": [ { "required": ["teacherSay"] }, { "required": ["childDo"] } ]
            }
          },
          "answer": { "type": "string" }
        }
      },
      "description": "Must be ordered by fade (modeled first). Pinned to packet front all week (E99)."
    },
    "days": {
      "type": "array", "minItems": 5, "maxItems": 5,
      "items": {
        "type": "object", "additionalProperties": false,
        "required": ["day", "focus", "pageCount", "items"],
        "properties": {
          "day": { "type": "integer", "minimum": 1, "maximum": 5 },
          "focus": { "type": "string", "enum": ["concept-echo", "fluency-application", "word-problems", "noncomputational"] },
          "pageCount": { "type": "integer", "minimum": 1, "maximum": 3 },
          "items": { "type": "array", "minItems": 3, "maxItems": 8, "items": { "$ref": "#/definitions/item" } },
          "teacherNoteStrip": { "type": "string", "description": "Parent-facing pedagogy strip; beginner band Day 5 only (page type per E57)." }
        }
      },
      "description": "Array index i = Day i+1; DD3 template order is enforced by quality gate QG-8, not schema."
    },
    "puzzle": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "title", "puzzleType", "prompt", "answer", "hintLadder"],
      "properties": {
        "id": { "$ref": "#/definitions/contentId" },
        "title": { "type": "string", "description": "Presented under the module's own 'Puzzle Grove' mark [original design]." },
        "puzzleType": { "type": "string", "enum": ["logic", "pattern", "math-art", "game", "estimation", "construction", "error-analysis"] },
        "prompt": { "type": "string" },
        "answer": { "$ref": "#/definitions/answerSpec" },
        "hintLadder": { "$ref": "#/definitions/hintLadder" },
        "errorTags": { "$ref": "#/definitions/errorTags" }
      },
      "description": "Weekly non-computational transfer of the SAME concept (strand-coupling law, DD12/E26)."
    },
    "fluencySprint": {
      "description": "null for Level A (sprints begin at Level B, per DD11 + CURRICULUM-MAP Level A notes).",
      "oneOf": [
        { "type": "null" },
        {
          "type": "object",
          "additionalProperties": false,
          "required": ["id", "skill", "sourceWeek", "durationSeconds", "itemCount", "scheduledDay", "selfReferenced", "graded", "generator"],
          "properties": {
            "id": { "$ref": "#/definitions/contentId" },
            "skill": { "type": "string" },
            "sourceWeek": { "$ref": "#/definitions/weekRef", "description": "Must be mastered >=2 weeks prior; never the current concept (DD11)." },
            "durationSeconds": { "type": "integer", "const": 120 },
            "itemCount": { "type": "integer", "minimum": 10, "maximum": 30 },
            "scheduledDay": { "type": "integer", "minimum": 2, "maximum": 3 },
            "selfReferenced": { "type": "boolean", "const": true },
            "graded": { "type": "boolean", "const": false },
            "generator": { "$ref": "#/definitions/generatorSpec" }
          }
        }
      ]
    },
    "masteryCheck": {
      "type": "object",
      "additionalProperties": false,
      "required": ["passThresholdPct", "fastTrackPct", "formA", "formB", "isomorphNotes"],
      "properties": {
        "passThresholdPct": { "type": "integer", "minimum": 80, "maximum": 90, "description": "DD1 band; default 85. [DIVERGENCE vs evidenced ~45-62% bracket, E31/E98]" },
        "fastTrackPct": { "type": "integer", "const": 95 },
        "formA": { "type": "array", "minItems": 6, "maxItems": 10, "items": { "$ref": "#/definitions/item" } },
        "formB": { "type": "array", "minItems": 6, "maxItems": 10, "items": { "$ref": "#/definitions/item" } },
        "isomorphNotes": { "type": "string", "description": "Per-index isomorph class + parameter constraints (Form B pairs with Form A by array index)." }
      }
    },
    "mistakeBank": {
      "type": "array", "minItems": 3, "maxItems": 10,
      "items": {
        "type": "object", "additionalProperties": false,
        "required": ["errorTag", "description", "exampleWrongAnswer", "distractorRationale", "reteachPointer"],
        "properties": {
          "errorTag": { "$ref": "#/definitions/errorTag" },
          "subtype": { "type": "string", "description": "Optional finer label [original design extension of DD7]." },
          "description": { "type": "string" },
          "exampleWrongAnswer": { "type": "string" },
          "distractorRationale": { "type": "string", "description": "How to build an MC distractor that traps exactly this error." },
          "reteachPointer": { "type": "string", "description": "Which explanation segment / guided example the DD1 micro-reteach replays." }
        }
      }
    },
    "parentSummarySeed": {
      "type": "object",
      "additionalProperties": false,
      "required": ["whatWeWorkedOn", "improvingCandidates", "strengtheningByTag", "homeFocus", "vocabularyForParent"],
      "properties": {
        "whatWeWorkedOn": { "type": "string", "description": "Parent-plain concept description; opens the weekly report (E102 field 1)." },
        "improvingCandidates": { "type": "array", "minItems": 2, "items": { "type": "string" }, "description": "Evidence-slots the report generator fills from telemetry (E102 field 3 / E48)." },
        "strengtheningByTag": {
          "type": "array", "minItems": 2,
          "items": {
            "type": "object", "additionalProperties": false,
            "required": ["errorTag", "text"],
            "properties": { "errorTag": { "$ref": "#/definitions/errorTag" }, "text": { "type": "string" } }
          },
          "description": "Growth-area text per dominant DD7 tag (E102 field 2)."
        },
        "homeFocus": {
          "type": "object", "additionalProperties": false,
          "required": ["praiseLine", "questionForChild"],
          "properties": {
            "praiseLine": { "type": "string" },
            "questionForChild": { "type": "string" },
            "schoolSyncHook": { "type": "string", "description": "Optional, <=1/month (per E103)." }
          },
          "description": "E102 field 4, realized as conversation-not-grading (E71)."
        },
        "vocabularyForParent": { "type": "array", "items": { "type": "string" } }
      }
    }
  },
  "definitions": {
    "contentId": {
      "type": "string",
      "pattern": "^[A-E](2[0-4]|1[0-9]|[1-9])-(D[1-5]|GE|PZ|FS|MA|MB)-[0-9]{2}$",
      "description": "<Level><Week>-<slot>-<nn>, e.g. B14-D3-06, D17-MA-01."
    },
    "weekRef": {
      "type": "object", "additionalProperties": false,
      "required": ["level", "week"],
      "properties": {
        "level": { "type": "string", "enum": ["A", "B", "C", "D", "E"] },
        "week": { "type": "integer", "minimum": 1, "maximum": 24 }
      }
    },
    "errorTag": {
      "type": "string",
      "enum": ["fact-recall", "procedure-slip", "concept-misconception", "representation-misread", "task-comprehension"],
      "description": "Closed DD7 taxonomy. Extensions go in 'subtype', never new tags."
    },
    "errorTags": { "type": "array", "minItems": 1, "maxItems": 3, "uniqueItems": true, "items": { "$ref": "#/definitions/errorTag" } },
    "hintLadder": {
      "type": "array", "minItems": 1, "maxItems": 3, "items": { "type": "string" },
      "description": "Rung 1 orienting question; rung 2 locate the step/model; rung 3 worked SIMILAR example. Never contains the item's literal answer (QG-5)."
    },
    "answerSpec": {
      "type": "object", "additionalProperties": false,
      "required": ["value", "acceptableForms", "validation"],
      "properties": {
        "value": { "type": "string", "description": "Canonical answer as string (uniform for numbers, fractions, text)." },
        "acceptableForms": { "type": "array", "items": { "type": "string" }, "description": "Additional accepted surface forms (equivalents, commuted sentences, spelled-out numbers)." },
        "validation": {
          "type": "string",
          "enum": ["exact-numeric", "equivalent-numeric", "equivalent-fraction", "number-sentence", "choice-key", "short-text-keyword", "ordered-list", "set", "manual-review"]
        },
        "units": { "type": "string", "description": "Required unit, if any; see validation conventions §3.4." },
        "requireSimplestForm": { "type": "boolean", "default": false },
        "orderMatters": { "type": "boolean", "default": false, "description": "For number-sentence: reject commuted forms when order is the taught point." }
      }
    },
    "choice": {
      "type": "object", "additionalProperties": false,
      "required": ["key", "text", "isCorrect"],
      "properties": {
        "key": { "type": "string", "pattern": "^[A-F]$" },
        "text": { "type": "string" },
        "isCorrect": { "type": "boolean" },
        "errorTag": { "$ref": "#/definitions/errorTag", "description": "REQUIRED on distractors by QG-3 (schema cannot express conditionally)." },
        "rationale": { "type": "string" }
      }
    },
    "generatorSpec": {
      "type": "object", "additionalProperties": false,
      "required": ["templateId", "params", "seed"],
      "properties": {
        "templateId": { "type": "string" },
        "params": { "type": "object" },
        "seed": { "type": "integer", "minimum": 0 }
      },
      "description": "Seeded template instantiation for reproducible regeneration (§3.1)."
    },
    "item": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "type", "prompt", "answer", "difficulty", "strand", "isRetrieval", "hintLadder", "errorTags"],
      "properties": {
        "id": { "$ref": "#/definitions/contentId" },
        "type": {
          "type": "string",
          "enum": ["computation", "word-problem", "representation", "reasoning", "error-analysis", "classification", "drawing", "fluency"]
        },
        "prompt": { "type": "string", "description": "May embed asset placeholders like [image: 3 red apples, 2 green apples]." },
        "choices": { "type": "array", "minItems": 2, "maxItems": 6, "items": { "$ref": "#/definitions/choice" } },
        "answer": { "$ref": "#/definitions/answerSpec" },
        "difficulty": { "type": "integer", "minimum": 1, "maximum": 5 },
        "strand": { "type": "string", "enum": ["computational", "noncomputational"] },
        "isRetrieval": { "type": "boolean", "description": "Spaced-retrieval warm-up slot (DD8 [DIVERGENCE]); styled as 'warm-up', never 'review'." },
        "retrievalSource": { "$ref": "#/definitions/weekRef" },
        "hintLadder": { "$ref": "#/definitions/hintLadder" },
        "errorTags": { "$ref": "#/definitions/errorTags" },
        "generator": { "$ref": "#/definitions/generatorSpec" }
      },
      "if": { "properties": { "isRetrieval": { "const": true } } },
      "then": { "required": ["retrievalSource"] }
    }
  }
}
```

---

## 3. Generation rules

### 3.1 Item-template parameterization `[original design]`

- Every generated item derives from a registered **template**: `templateId` + typed `params` + integer `seed`. Same triple → byte-identical item (deterministic seeded RNG; PCG32 or equivalent). Hand-authored items simply omit `generator`.
- Template registry entries declare: param schema, answer function, hint-ladder skeleton (with param slots), difficulty function, band constraints, and the **error-affordance list** (which DD7 tags the item can trap — consumed by isomorph and distractor rules).
- Example registry entries used by the sample packs:
  - `add_within_10_pictures_v1` — params `{a:[1..9], b:[1..9], a+b<=10, contextNoun}`; affordances: representation-misread, task-comprehension.
  - `count_on_v1` — params `{start:[4..8], hop:[1..3]}`; affordance: procedure-slip (off-by-one: counting the start number).
  - `sub_2digit_regroup_v1` — params `{minuend:[30..99], subtrahend:[12..89], forceRegroup:bool (ones(minuend)<ones(subtrahend)), allowZeroOnes:bool, result>0}`; affordances: concept-misconception (smaller-from-larger), procedure-slip (unreduced tens; zero-ones skip), fact-recall.
  - `frac_addsub_unlike_v1` — params `{denoms:(d1,d2), d1≠d2, lcm<=24, properOrMixed, op:+|-}`; affordances: concept-misconception (tops-and-bottoms), procedure-slip (rename-one-only, numerator-not-scaled), fact-recall (LCM/product), representation-misread.
- Regeneration policy (per DD15/E87): re-rolling a seed or editing a template **bumps `contentVersion`**; item `id`s are stable; the platform never serves a pack whose `contentVersion` differs from the learner's assigned pointer.

### 3.2 Form-B isomorph generation (DD1) `[original design]`

Form B exists so the corrective re-check measures the skill, not memory of the pages (per DD1; resolves the E49 identical-vs-modified unknown on the modified side).

1. **Index pairing:** `formB[i]` is the isomorph of `formA[i]`; same template (or same declared isomorph class for hand-authored items).
2. **Same skill, same difficulty:** identical template + difficulty value; param draws from the same constraint region.
3. **Same error affordances:** if `formA[i]` can trap smaller-from-larger, `formB[i]` must too (e.g., regrouping still forced). An isomorph that removes the trap is invalid.
4. **Fresh surface:** no operand tuple reuse from Form A **or** from any daily item in the pack; word problems keep semantic structure (a change-result-unknown story stays change-result-unknown, per problem-type) but swap names, nouns, and numbers.
5. **Answer non-collision preferred:** avoid `formB[i].answer == formA[i].answer` where the param space allows, so a memorized answer can't pass.
6. Corrective-loop serving order: micro-reteach (from `mistakeBank.reteachPointer`) → Form B → rescore (DD1 state machine, METHODOLOGY-MODEL §5).

### 3.3 Difficulty ramps `[original design]`

- **Within a day:** retrieval warm-ups open the day at difficulty ≤ 3; then core items in non-decreasing difficulty; the last core item may step back one level (exit-on-success, protects the habit loop per E45's consistency doctrine).
- **Across the week:** mean core difficulty is non-decreasing Day 1 → Day 3; Day 4 word problems sit at Day-3 level in new clothing; Day 5's non-computational page is transfer-form (not ranked on the same scale but never introduces new mechanics).
- **Interleaving (DD8):** Days 2–3 must mix at least two problem subtypes (e.g., regroup/no-regroup; like/unlike denominators) — blocking a single subtype hides the discrimination the week is teaching.
- Difficulty 1–5 is band-relative (a "3" at Level A ≠ "3" at Level D); the placement engine (DD5) and dose model both read it.

### 3.4 Answer-validation conventions `[original design]`

| Validation | Rule |
|---|---|
| `exact-numeric` | String-normalized numeric equality (strip spaces, leading zeros). |
| `equivalent-numeric` | Numeric equality across notations (e.g., `0.5` = `.5`); decimals/integers only. |
| `equivalent-fraction` | Any fraction equal in value accepted (`4/6` = `2/3`) **unless** `requireSimplestForm`; mixed number ↔ improper accepted both ways; the persona then *names* the simplest form conversationally (teach, don't punish). |
| `number-sentence` | Parse and check the full sentence; commuted addends accepted (`3+5=8` / `5+3=8`) unless `orderMatters`. |
| `choice-key` | Matches `choices[].key`. |
| `short-text-keyword` | Accept if all required keywords (in `acceptableForms`) appear; else route to `manual-review`. |
| `ordered-list` / `set` | Sequence-sensitive / sequence-insensitive collection match. |
| `manual-review` | Never auto-marked wrong; routed to the persona for a guided conversation (DD13's explanation-on-miss law — a bare ✗ is banned everywhere). |
| **Units** | If `units` is set, an answer with the correct number but missing/wrong unit is treated as a `procedure-slip` prompt ("27 what?"), not a plain wrong. |

### 3.5 Age-band presentation constraints (per CURRICULUM-MAP §0.3 + level notes)

- **Level A (beginner, per E57/E60/E62):** `presentation.audioFirst=true` mandatory; one operation per page in early weeks; answers drawable/circlable/colorable (oversized boxes per E62/E65); prompts ≤ 12 words heard-aloud; no sprints (`fluencySprint: null`); mascot/decoration high; Day-5 `teacherNoteStrip` required (per E57).
- **Levels B–C (intermediate, per E53/E58):** labeled place-value column scaffolds; balance-scale graphics for equation work; dual audio+text directions; sprints begin (≤2/week); Puzzle Grove logic page weekly; written "explain" lines start appearing in Level C Block 2.
- **Level D (transition, per E60):** scaffolds introduced-then-faded within each concept (declare the fade in `presentation.scaffoldNotes`); written explanation mandatory on Day 5; decoration recedes.
- **Level E (advanced, per E59/E60):** symbolic work, Always/Sometimes/Never classification, error-analysis with written argument as weekly staples; minimal decoration; justification expected on every Day-5 item.

### 3.6 Quality gates (machine-checked before a pack ships) `[original design]`

| Gate | Rule |
|---|---|
| QG-1 | **No duplicate surface forms in a pack:** no repeated operand tuple in the same format among child-answered items (daily + puzzle + mastery). Commuted pairs or cross-format reuse allowed only ≥2 days apart. Guided examples are exempt (they are taught, not answered). |
| QG-2 | **Retrieval integrity (DD8):** every `isRetrieval` item's `retrievalSource` is strictly earlier in the curriculum graph (backward-only; cross-level allowed); pack-wide retrieval share of daily items = **20–30%**; retrieval never drawn from the current week. |
| QG-3 | **Distractor mapping:** every non-correct `choice` carries `errorTag` + `rationale`, and that tag appears in the pack's `mistakeBank`. |
| QG-4 | **Isomorph audit:** Form B passes §3.2 rules 1–5 against Form A and the daily items. |
| QG-5 | **Answer + hint audit:** all objective answers verified by the arithmetic checker; no `hintLadder` rung contains the item's literal answer; rung count ≤3. |
| QG-6 | **Dose check:** per-band time model estimates each day at 5–15 min (per E12); 3–6 problems/page (per E64/E62); 1–3 pages/day. |
| QG-7 | **Sprint legality (DD11):** sprint only for Level ≥ B; `sourceWeek` ≥2 weeks before the current week (counting completed cycles); ungraded/self-referenced constants intact. |
| QG-8 | **Template order (DD3) + strand coupling (DD12):** Day focuses = concept-echo / fluency-application / fluency-application / word-problems / noncomputational; Day 5 + puzzle exercise the SAME week-concept in transfer form; Day-5 noncomputational strand present at every level. |
| QG-9 | **Tag hygiene:** all `errorTags` from the closed DD7 enum; `mistakeBank` covers every tag used by the pack's choices. |
| QG-10 | **Versioning (DD15):** pack validates against this schema; any change bumps `contentVersion`; packs are immutable once assigned. |

---

## 4. Worked sample packs

Three complete, schema-conforming, 100% original packs. Week mappings are exact `CURRICULUM-MAP.md` cells. (Counts honest to spec: 26 daily items + 6+6 mastery items + puzzle per pack; hint ladders kept tight per authoring guidance.)

### 4.1 Sample pack 1 — Level A, Week 15: Addition within 10 (ages ~5–6)

Maps to CURRICULUM-MAP Level A, Week 15 ("Addition within 10"; Day-5 focus "write a number sentence and solve," page type per E57). `fluencySprint` is `null` (Level A, DD11). Retrieval sources: A3/A4 numeral writing, A12 bonds of 5, A9 counting 11–20, A6 ordering, A5 more/fewer, A7 shapes — all earlier weeks (QG-2).

```json
{
  "schemaVersion": "1.0",
  "packId": "MFM-A15",
  "contentVersion": "1.0.0",
  "identity": {
    "level": "A", "week": 15,
    "conceptId": "addition-within-10",
    "conceptName": "Addition within 10",
    "band": "beginner",
    "strandTags": ["addition-subtraction", "number-sense-counting"],
    "prerequisiteWeeks": [ { "level": "A", "week": 12 }, { "level": "A", "week": 13 }, { "level": "A", "week": 14 } ]
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
}
```

### 4.2 Sample pack 2 — Level B, Week 14: Subtraction within 100 with regrouping (ages ~7–8)

Maps to CURRICULUM-MAP Level B, Week 14 ("Subtraction within 100 (regrouping)"; Day-5 focus "Two students, two methods — do both work?", early error-analysis in the E59 spirit scaled down). Intermediate band: place-value column scaffolds per E53, sprint legal (DD11) — source = adding tens (B W10, 4 weeks prior). Retrieval sources: B5 make-ten, B13 addition with regrouping, B7 missing addends, B10 adding tens, B9 story problems, B12 time — all earlier (QG-2).

```json
{
  "schemaVersion": "1.0",
  "packId": "MFM-B14",
  "contentVersion": "1.0.0",
  "identity": {
    "level": "B", "week": 14,
    "conceptId": "sub-within-100-regrouping",
    "conceptName": "Subtraction within 100 with regrouping",
    "band": "intermediate",
    "strandTags": ["addition-subtraction", "number-sense-counting"],
    "prerequisiteWeeks": [ { "level": "B", "week": 2 }, { "level": "B", "week": 10 }, { "level": "B", "week": 13 } ]
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
      { "say": "Watch 52 take away 17 with blocks. The ones column asks: can I take 7 ones from 2 ones? Not enough!", "visual": "5 rods and 2 cubes; 7 cubes need removing." },
      { "say": "So I trade: one rod becomes ten loose ones. Now I have 4 rods and 12 ones. Still 52 - count it!", "visual": "One rod explodes into ten cubes; count confirms 52." },
      { "say": "NOW the ones can pay: 12 minus 7 leaves 5. And the tens: 4 rods minus 1 rod leaves 3. Answer: 35.", "visual": "Cubes and rods removed; 3 rods, 5 cubes remain." },
      { "say": "The written method is the same story in ink: cross out the 5, write 4, put a little 1 by the 2 to make 12. Every mark means a real trade.", "visual": "Column method animates beside the blocks, step-for-step." },
      { "say": "Last habit: estimate first. 52 - 17 is about 50 - 20 = 30, so an answer near 30 makes sense - and 85 would smell wrong.", "visual": "Number line arc from 52 back about 20." }
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
}
```

### 4.3 Sample pack 3 — Level D, Week 17: Adding & subtracting fractions with unlike denominators (ages ~9–10)

Maps to CURRICULUM-MAP Level D, Week 17 ("± fractions (unlike denominators)"; Day-5 focus "'Why can't we just add tops and bottoms?' — refute with a picture"). Transition band: scaffolds introduced-then-faded, written explanation mandatory on Day 5 (per E60). Sprint source = multiplication facts (Level C Week 12, cross-level per DD8). Retrieval sources: D9 equivalence, D10 like-denominator ±, D11 fraction × whole, D13 decimal compare, C12 × facts — all earlier (QG-2).

```json
{
  "schemaVersion": "1.0",
  "packId": "MFM-D17",
  "contentVersion": "1.0.0",
  "identity": {
    "level": "D", "week": 17,
    "conceptId": "frac-addsub-unlike-denominators",
    "conceptName": "Adding and subtracting fractions with unlike denominators",
    "band": "transition",
    "strandTags": ["decimals-fractions"],
    "prerequisiteWeeks": [ { "level": "D", "week": 9 }, { "level": "D", "week": 10 }, { "level": "C", "week": 15 } ]
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
}
```

---

*End of question-generator spec. Companion Phase-4B artifact: `TEACHER-PERSONA.md`. Any conflict resolves per the constitution's order of authority (METHODOLOGY-MODEL → ledger → DDs).*
