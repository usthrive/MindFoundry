# Problem Generator QA Analysis
## MindFoundry Math Tutor vs Official Kumon Methodology

**Date**: January 13, 2026
**QA Analyst Persona**: Expert Kumon Teacher + QA Engineer
**Reference**: `/Requirements/06-KUMON-OFFICIAL-PROGRESSION.md`

---

## Executive Summary

This document provides a comprehensive QA analysis of MindFoundry's problem generators against official Kumon methodology. Critical issues have been identified that could negatively impact student learning by introducing concepts prematurely or using incorrect problem formats.

### Critical Findings Overview

| Severity | Issue | Levels Affected | Fix Priority | Status |
|----------|-------|-----------------|--------------|--------|
| **CRITICAL** | Missing addend problems appear in Level 2A | Level 2A | IMMEDIATE | **FIXED** |
| **CRITICAL** | Missing addend/subtrahend problems appear randomly in Level A (should be worksheet 150+ only) | Level A | IMMEDIATE | **FIXED** |
| **HIGH** | Level A subtraction has missing minuend/subtrahend variants randomly | Level A | HIGH | **FIXED** |
| **MEDIUM** | Sequence display uses `displayFormat: 'sequenceBoxes'` but StudyPage doesn't route to SequenceDisplay | Level 5A, 3A | MEDIUM | **FIXED** |
| **LOW** | Decimal answer validation is strict (may reject equivalent forms) | Level F | LOW | Pending |

### Fixes Applied (January 13, 2026)

1. **Level 2A Generator** (`level-2a.ts`):
   - Removed `'missing_first'` and `'missing_second'` variants
   - Now only generates `'standard'` and `'commutative'` formats
   - All problems are now `a + b = ?` format

2. **Level A Generator** (`level-a.ts`):
   - Addition: Missing addend variants only allowed for worksheets 150+
   - Subtraction: Missing operand variants only allowed for worksheets 170+
   - Early worksheets (1-149 for addition, 81-169 for subtraction) now use standard format only

3. **Sequence Display** (`StudyPage.tsx`):
   - Added detection for sequence problems (`displayFormat: 'sequenceBoxes'`)
   - Routes sequence problems to existing `SequenceDisplay` component with inline input
   - Hides NumberPad/InputDisplay for sequence problems
   - Added "Check Answer" button for sequence submissions

---

## Level-by-Level Analysis

### Level 7A: Counting to 10

**File**: `frontend/src/services/generators/pre-k/level-7a.ts`

**Kumon Spec**:
- Counting pictures/dots only
- Number recognition
- NO addition, sequences, or writing

**Status**: NOT FULLY REVIEWED (file exists but not read in this session)

**Recommendation**: Verify no premature concept introduction.

---

### Level 6A: Counting to 30

**File**: `frontend/src/services/generators/pre-k/level-6a.ts`

**Kumon Spec**:
- Extended counting to 30
- Number reading
- NO addition or subtraction

**Status**: NOT FULLY REVIEWED

---

### Level 5A: Reading Numbers to 50

**File**: `frontend/src/services/generators/pre-k/level-5a.ts`

**Kumon Spec**:
- Number reading 1-50
- Sequences (forward counting ONLY)
- NO backward counting
- NO addition or subtraction

**Current Implementation Analysis**:

```typescript
// Lines 38-43: CORRECTLY removed backward counting
return {
  type: 'sequence_to_50',  // Continue with forward sequences
  maxNumber: 50,
  part: 4
}
```

**Findings**:

| Check | Status | Notes |
|-------|--------|-------|
| Forward sequences only | PASS | Code comment confirms backward counting removed |
| No addition | PASS | Only generates sequence and number reading |
| Display format | ISSUE | Uses `displayFormat: 'sequenceBoxes'` but ProblemDisplay doesn't render this |

**Issue: Sequence Display Format**

```typescript
// Level 5A line 126
displayFormat: 'sequenceBoxes',
```

The `ProblemDisplay.tsx` component only handles `'horizontal'` and `'vertical'` formats. The `'sequenceBoxes'` format is not rendered, causing sequences to display incorrectly (answer input appears at bottom instead of inline).

**Severity**: MEDIUM
**Fix Required**: Add `sequenceBoxes` handling to ProblemDisplay.tsx

---

### Level 4A: Writing Numbers to 50

**File**: `frontend/src/services/generators/pre-k/level-4a.ts`

**Kumon Spec**:
- Number tracing and writing
- Number table completion
- NO addition or subtraction

**Status**: NOT FULLY REVIEWED

---

### Level 3A: Adding 1, 2, 3

**File**: `frontend/src/services/generators/elementary-basic/level-3a.ts`

**Kumon Spec**:
| Worksheets | Content |
|------------|---------|
| 1-70 | Sequences ONLY (no addition) |
| 71-130 | Adding +1 ONLY |
| 131-160 | Adding +2 ONLY |
| 161-180 | Adding +3 ONLY |
| 181-200 | Mixed +1, +2, +3 |

**NO SUBTRACTION, NO MISSING ADDEND**

**Current Implementation Analysis**:

```typescript
// Lines 12-17: Worksheet config
if (worksheet <= 70) {
  if (worksheet <= 30) return { type: 'sequence_to_100', maxFirst: 100 }
  if (worksheet <= 60) return { type: 'sequence_to_100', maxFirst: 100 }
  return { type: 'sequence_to_120', maxFirst: 120 }
}
```

**Findings**:

| Check | Status | Notes |
|-------|--------|-------|
| Worksheets 1-70 sequences only | PASS | Correctly generates sequences |
| +1 only for 71-130 | PASS | `addend: 1` enforced |
| +2 only for 131-160 | PASS | `addend: 2` enforced |
| +3 only for 161-180 | PASS | `addend: 3` enforced |
| No missing addend | PASS | Code comment confirms removal |
| No subtraction | PASS | Only addition generated |
| Horizontal format only | PASS | Comment at line 95 confirms |

**Code Quality Note** (Line 95):
```typescript
// FIXED: Kumon 3A is HORIZONTAL ONLY - removed 'vertical' and 'missing_addend'
```

**Status**: PASS - Generator correctly implements Kumon 3A spec.

---

### Level 2A: Adding 4 through 10

**File**: `frontend/src/services/generators/elementary-basic/level-2a.ts`

**Kumon Spec**:
| Worksheets | Content |
|------------|---------|
| 1-10 | Review +1, +2, +3 |
| 11-30 | Adding +4 ONLY |
| 31-50 | Adding +5 ONLY |
| 51-70 | Mixed +1 to +5 |
| 71-90 | Adding +6 ONLY |
| 91-110 | Adding +7 ONLY |
| 111-130 | Mixed +1 to +7 |
| 131-150 | Adding +8 ONLY |
| 151-160 | Adding +9 ONLY |
| 161-170 | Adding +10 ONLY |
| 171-200 | Mixed +1 to +10 |

**CRITICAL: NO SUBTRACTION, NO MISSING ADDEND**

**Current Implementation Analysis**:

```typescript
// Lines 47-48: PROBLEM - Random variant selection
const problemVariants = ['standard', 'commutative', 'missing_first', 'missing_second'] as const
const variant = problemVariants[randomInt(0, problemVariants.length - 1)]
```

**CRITICAL ISSUE FOUND**:

The generator randomly selects from four variants including `'missing_first'` and `'missing_second'`. According to Kumon methodology:

> **"Missing addend (__ + 3 = 7) - First Introduced At: Level A, late worksheets - DO NOT show before: Never in 3A-2A"**

**Lines 69-86 (Missing First Variant)**:
```typescript
if (variant === 'missing_first') {
  return {
    // ...
    question: `___ + ${addend} = ${sum}`,  // VIOLATION: Missing addend
    correctAnswer: first,
    // ...
  }
}
```

**Lines 88-105 (Missing Second Variant)**:
```typescript
if (variant === 'missing_second') {
  return {
    // ...
    question: `${first} + ___ = ${sum}`,  // VIOLATION: Missing addend
    correctAnswer: addend,
    // ...
  }
}
```

**Severity**: **CRITICAL**
**Impact**: Students are exposed to missing addend problems before they've mastered basic addition, violating Kumon's core principle of "one skill at a time."

**Required Fix**:
```typescript
// REMOVE 'missing_first' and 'missing_second' from Level 2A
const problemVariants = ['standard', 'commutative'] as const
```

---

### Level A: Subtraction Introduced

**File**: `frontend/src/services/generators/elementary-basic/level-a.ts`

**Kumon Spec**:
| Worksheets | Content |
|------------|---------|
| 1-80 | Addition (sums to 28) |
| 81-90 | Subtracting -1 ONLY |
| 91-100 | Subtracting -2 ONLY |
| 101-110 | Subtracting -3 ONLY |
| 111+ | Progressive subtraction mastery |

**Missing Addend Rules**:
- Addition variants with missing operands can appear in LATE Level A (around worksheet 150+)
- Subtraction: `a - b = ?` format ONLY until late worksheets

**Current Implementation Analysis**:

**Addition Function (Lines 31-99)**:
```typescript
// Line 36-37
const variants = ['standard', 'commutative', 'missing'] as const
const variant = variants[randomInt(0, variants.length - 1)]
```

**Issue**: Missing addend variants appear randomly regardless of worksheet number.

**Subtraction Function (Lines 102-170)**:
```typescript
// Lines 111-112
const variants = ['standard', 'missing_subtrahend', 'missing_minuend'] as const
const variant = variants[randomInt(0, variants.length - 1)]
```

**CRITICAL ISSUE**: Subtraction randomly generates:
- `17 - ___ = 3` (missing_subtrahend)
- `___ - 14 = 3` (missing_minuend)

When student at worksheet 102 should ONLY see: `17 - 14 = ?`

**Worksheet Config (Lines 4-29)**:
```typescript
// Correctly maps worksheets to problem types
if (worksheet <= 80) return { type: 'addition_sums_to_28', maxSum: 28 }
if (worksheet <= 90) return { type: 'subtract_1', subtrahend: 1, maxMinuend: 20 }
if (worksheet <= 100) return { type: 'subtract_2', subtrahend: 2, maxMinuend: 20 }
```

The worksheet config is correct, but the problem generation function ignores the worksheet number when selecting variants.

**Severity**: **CRITICAL**
**Impact**: Student doing worksheet 90 (subtracting 1 only) may see `___ - 1 = 5` instead of `6 - 1 = ?`

**Required Fix**:

```typescript
function generateSubtractionProblem(
  subtrahend: number | undefined,
  maxMinuend: number,
  subtype: LevelAProblemType,
  worksheetNumber: number  // ADD THIS PARAMETER
): Problem {
  // Only allow missing variants for worksheets 150+
  const variants = worksheetNumber >= 150
    ? ['standard', 'missing_subtrahend', 'missing_minuend'] as const
    : ['standard'] as const

  const variant = variants[randomInt(0, variants.length - 1)]
  // ...
}
```

---

### Level B: Vertical Operations & Regrouping

**File**: `frontend/src/services/generators/elementary-basic/level-b.ts`

**Kumon Spec**:
| Worksheets | Content |
|------------|---------|
| 1-10 | Addition review (horizontal) |
| 11-40 | 2-digit addition NO carry |
| 41-70 | 2-digit addition WITH carry |
| 71-100 | 3-digit addition |
| 101-120 | Subtraction review |
| 121-150 | 2-digit subtraction NO borrow |
| 151-180 | 2-digit subtraction WITH borrow |
| 181-200 | 3-digit subtraction |

**Current Implementation Analysis**:

**Worksheet Config (Lines 4-35)**:
```typescript
if (worksheet <= 10) {
  return { type: 'addition_review', digits: 1, allowCarry: false, allowBorrow: false }
}
if (worksheet <= 40) {
  return { type: 'vertical_addition_2digit_no_carry', digits: 2, allowCarry: false, ... }
}
// ... correctly structured
```

**Findings**:

| Check | Status | Notes |
|-------|--------|-------|
| Horizontal review 1-10 | PARTIAL | Config says `digits: 1` but format not explicitly horizontal |
| No carry before ws 41 | PASS | `allowCarry: false` enforced |
| Carry introduced at 41 | PASS | `allowCarry: true` at ws 41+ |
| No borrow before ws 151 | CHECK | Need to verify `allowBorrow` logic |
| Vertical format | PASS | All multi-digit problems use vertical |

**Potential Issue** (Line 156):
```typescript
// Uses 'vertical' for subtraction at line 158
displayFormat: 'vertical',
```

Level B should introduce vertical format, and this is correctly implemented.

**Status**: MOSTLY PASS - Minor review needed for early worksheet horizontal format.

---

### Level C: Multiplication & Division

**File**: `frontend/src/services/generators/elementary-advanced/level-c.ts`

**Kumon Spec**:
- Worksheets 1-10: Review
- Worksheets 11-110: Multiplication (tables 2-9, then multi-digit)
- Worksheets 111+: Division introduced

**Status**: NOT FULLY REVIEWED

---

### Level D: Long Division & Fractions

**File**: `frontend/src/services/generators/elementary-advanced/level-d.ts`

**Kumon Spec**:
- Worksheets 1-130: Multiplication and division mastery
- Worksheets 131+: Fractions INTRODUCED (no operations)

**Status**: NOT FULLY REVIEWED

---

### Level E: Fraction Operations

**File**: `frontend/src/services/generators/elementary-advanced/level-e.ts`

**Kumon Spec**:
- All four fraction operations
- Same denominator first, then different denominators

**Status**: NOT FULLY REVIEWED

---

### Level F: Decimals & Order of Operations

**File**: `frontend/src/services/generators/elementary-advanced/level-f.ts`

**Kumon Spec**:
- Complex fractions
- Decimal conversions
- PEMDAS/Order of operations

**Current Implementation Analysis**:

**Decimal Answer Handling (Lines 143-166)**:
```typescript
function generateFractionToDecimal(): Problem {
  // ...
  const decimal = (num / denom).toFixed(...).replace(/\.?0+$/, '')
  // ...
  correctAnswer: parseFloat(decimal),
}
```

**Issue**: The `replace(/\.?0+$/, '')` strips trailing zeros, but answer validation may be strict.

Example: If the correct answer is `2.0`, but the code strips it to `2`, and the student types `2`, it should match. But if the original fraction produces `2.0` and the student types `2.0`, there may be a mismatch.

**Decimal Operations (Lines 260-297)**:
```typescript
correctAnswer: Math.round(result * 100) / 100,
```

Rounding is applied, which is correct for display but may cause precision issues.

**Severity**: LOW
**Recommendation**: Implement level-aware answer validation:
- Level F: Strict format matching (teaches precision)
- Level G+: Accept equivalent forms

---

## Display Component Analysis

### ProblemDisplay.tsx

**File**: `frontend/src/components/problem/ProblemDisplay.tsx`

**Current Display Formats Handled**:
1. `horizontal` - Standard `a + b = ?` format
2. `vertical` - Column format for multi-digit operations

**Missing Display Formats**:
1. `sequenceBoxes` - Inline sequence with missing number
2. `fraction` - Fraction display (may need visual fraction rendering)

**Horizontal Format Logic (Lines 52-173)**:

The component handles:
- Three-number addition (lines 54-96)
- Missing addend at position 1 (lines 99-135)
- Standard two-operand (lines 138-172)

**Issue with Question Mark Position**:

The component uses `missingPosition` to determine where to show the input:

```typescript
// Lines 99-135: Missing addend case
if (problem.missingPosition === 1) {
  // Shows: operand[0] + ? = operand[1]
}
```

This correctly displays the missing position, BUT the generators are sending `missingPosition` when they shouldn't (as documented above for Levels 2A and A).

**The display component is correct; the generators are wrong.**

---

## Sequence Display Issue

### Current Flow

1. Generator creates problem with `displayFormat: 'sequenceBoxes'`
2. ProblemDisplay receives it
3. ProblemDisplay doesn't have a case for `'sequenceBoxes'`
4. Falls through to vertical format (incorrect)
5. Answer input appears at bottom of screen

### Expected Behavior

```
Display: 23, 24, [____], 26, 27
                   ^
           Input here, inline
```

### Current Behavior

```
Display: Fill in the missing number: 23, 24, ___, 26, 27

[Answer input at bottom of screen]
```

**Fix Required**: Create `SequenceDisplay.tsx` component or add sequence handling to `ProblemDisplay.tsx`.

---

## Generator Utility Functions

### utils.ts Analysis

**File**: `frontend/src/services/generators/utils.ts`

**Key Functions**:

| Function | Purpose | Status |
|----------|---------|--------|
| `formatSequence()` | Creates sequence string | PASS |
| `hasCarry()` | Detects carrying | PASS |
| `hasBorrow()` | Detects borrowing | PASS |
| `simplifyFraction()` | Reduces fractions | PASS |
| `generateId()` | Unique IDs | PASS |

**Line 172-174**:
```typescript
export function formatSequence(numbers: (number | null)[], missingIndex: number): string {
  return numbers.map((n, i) => i === missingIndex ? '___' : n).join(', ')
}
```

This formats sequences for text display. The visual rendering is the issue, not this utility.

---

## Fix Implementation Priority

### IMMEDIATE (Before Next User Session)

1. **Level 2A: Remove missing addend variants**
   - File: `level-2a.ts`
   - Change: Remove `'missing_first'` and `'missing_second'` from variants array
   - Test: Generate 20 problems, verify all are `a + b = ?` format

2. **Level A: Restrict missing variants to late worksheets**
   - File: `level-a.ts`
   - Change: Add worksheet number check before allowing missing variants
   - Test: Generate problems at worksheets 50, 100, 150, 200

### HIGH PRIORITY (This Week)

3. **Sequence Display**
   - File: `ProblemDisplay.tsx` or new `SequenceDisplay.tsx`
   - Change: Handle `displayFormat: 'sequenceBoxes'` with inline input
   - Test: Level 5A and 3A sequence problems

### MEDIUM PRIORITY (This Sprint)

4. **Level B horizontal review**
   - Verify worksheets 1-10 use horizontal format

5. **Decimal validation**
   - Add level-aware answer matching for Level F+

---

## Test Plan

### Unit Tests Required

```typescript
describe('Level 2A Generator', () => {
  it('should never generate missing addend problems', () => {
    for (let ws = 1; ws <= 200; ws++) {
      const problem = generate2AProblem(ws)
      expect(problem.question).not.toContain('___')
      expect(problem.question).toMatch(/\d+ \+ \d+ = ___/)
    }
  })
})

describe('Level A Generator', () => {
  it('should not have missing operands before worksheet 150', () => {
    for (let ws = 1; ws <= 149; ws++) {
      const problem = generateAProblem(ws)
      const questionMarks = (problem.question.match(/___/g) || []).length
      // Should only have one ___ at the end (the answer)
      expect(questionMarks).toBe(1)
      expect(problem.question).toMatch(/= ___$/)
    }
  })

  it('can have missing operands after worksheet 150', () => {
    // Verify missing operand problems are generated correctly
    // when worksheet >= 150
  })
})
```

### Manual Testing Checklist

- [ ] Level 2A worksheet 50: All problems are `a + b = ?`
- [ ] Level 2A worksheet 150: All problems are `a + b = ?`
- [ ] Level A worksheet 85: All problems are `a - b = ?`
- [ ] Level A worksheet 102: All problems are `a - b = ?`
- [ ] Level A worksheet 160: Can include `a - ? = b` format
- [ ] Level 5A sequence: Input appears inline with sequence
- [ ] Level 3A sequence: Input appears inline with sequence
- [ ] Level F decimal: `2.0` and `2` both accepted (or appropriate hint shown)

---

## Summary of Code Changes Required

### level-2a.ts

```typescript
// LINE 47-48: CHANGE FROM
const problemVariants = ['standard', 'commutative', 'missing_first', 'missing_second'] as const

// TO
const problemVariants = ['standard', 'commutative'] as const
```

### level-a.ts

```typescript
// Addition function (around line 36-37): Add worksheet check
function generateAdditionProblem(maxSum: number, subtype: LevelAProblemType, worksheet: number): Problem {
  // Only allow missing variants for late worksheets
  const variants = worksheet >= 150
    ? ['standard', 'commutative', 'missing'] as const
    : ['standard', 'commutative'] as const
  // ...
}

// Subtraction function (around line 111-112): Add worksheet check
function generateSubtractionProblem(
  subtrahend: number | undefined,
  maxMinuend: number,
  subtype: LevelAProblemType,
  worksheet: number  // ADD THIS
): Problem {
  // Only allow missing variants for late worksheets
  const variants = worksheet >= 170
    ? ['standard', 'missing_subtrahend', 'missing_minuend'] as const
    : ['standard'] as const
  // ...
}

// Update generateAProblem to pass worksheet number to helper functions
export function generateAProblem(worksheet: number): Problem {
  // ... pass worksheet to generateAdditionProblem and generateSubtractionProblem
}
```

### ProblemDisplay.tsx

```typescript
// Add case for sequenceBoxes format
if (problem.displayFormat === 'sequenceBoxes') {
  // Render sequence with inline input at missing position
  // See detailed implementation in separate design doc
}
```

---

## Appendix: Kumon Concept Introduction Timeline

| Concept | First Introduced | Notes |
|---------|-----------------|-------|
| Counting | Level 7A | Pictures and dots |
| Sequences | Level 5A | Forward only |
| Number Writing | Level 4A | Tracing first |
| Addition +1,+2,+3 | Level 3A (ws 71+) | One at a time |
| Addition +4-+10 | Level 2A | Sequential |
| Subtraction | Level A (ws 81+) | After addition mastery |
| Missing Addend | Level A (ws 150+) | After basic operations |
| Vertical Format | Level B | With regrouping |
| Multiplication | Level C (ws 11+) | Tables 2-9 |
| Division | Level C (ws 111+) | After multiplication |
| Fractions | Level D (ws 131+) | Recognition only |
| Fraction Operations | Level E | All four operations |
| Decimals | Level F | With conversions |
| Order of Operations | Level F | PEMDAS |

---

**Document Version**: 1.0
**Author**: QA Analysis Bot
**Next Review**: After fixes implemented
