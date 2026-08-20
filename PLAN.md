# Phase 1.8.1: Multi-Problem Worksheet View - Implementation Plan

## Overview
Transform the single-problem-at-a-time interface into a multi-problem worksheet view that mimics real Kumon worksheets, showing multiple problems per page.

## Current State
- `StudyPage.tsx` shows **one problem at a time**
- Uses `generateProblem()` to create individual problems
- `ProblemDisplay` renders a single problem with answer input
- Session completes after 10 problems (one at a time)

## Target State
- Show **multiple problems per page** like real worksheets
- Problems per page varies by level (1-5 problems)
- Inline answer inputs for each problem
- Option to submit all at once or one-by-one
- Worksheet advances after completing all pages

---

## Problems Per Page Configuration

| Level Range | Problems/Page | Pages/Worksheet | Rationale |
|-------------|---------------|-----------------|-----------|
| 7A-6A (Pre-K) | 1 | 10 | Young children need focus |
| 5A-4A | 2 | 5 | Building attention span |
| 3A-2A | 5 | 2 | Elementary comfort zone |
| A-F | 5 | 2 | Standard Kumon format |
| G+ (Middle+) | 3 | ~3-4 | Complex problems need space |

---

## Implementation Steps

### Step 1: Create Configuration Utility
**File**: `src/utils/worksheetConfig.ts`

```typescript
export function getProblemsPerPage(level: KumonLevel): number {
  if (['7A', '6A'].includes(level)) return 1
  if (['5A', '4A'].includes(level)) return 2
  if (['3A', '2A', 'A', 'B', 'C', 'D', 'E', 'F'].includes(level)) return 5
  return 3 // G+ levels
}

export function getTotalPages(level: KumonLevel): number {
  const problemsPerPage = getProblemsPerPage(level)
  return Math.ceil(10 / problemsPerPage)
}
```

### Step 2: Create WorksheetProblem Component
**File**: `src/components/worksheet/WorksheetProblem.tsx`

A compact problem display with inline answer input:
- Shows problem (horizontal or vertical format)
- Has integrated input field (not separate NumberPad)
- Shows problem number (1, 2, 3...)
- Visual feedback for correct/incorrect after submission

### Step 3: Create WorksheetView Component
**File**: `src/components/worksheet/WorksheetView.tsx`

Main component that:
- Generates multiple problems for the current page
- Arranges problems in a grid/list layout
- Manages answers for all problems on the page
- Handles page navigation (Next Page / Previous Page)
- Shows page indicator (Page 1 of 2)

### Step 4: Create WorksheetNumberPad Component
**File**: `src/components/worksheet/WorksheetNumberPad.tsx`

A shared NumberPad that:
- Appears at bottom of screen (fixed position)
- Inputs to the currently focused problem
- Tracks which problem is active
- Supports keyboard input

### Step 5: Modify StudyPage
**File**: `src/pages/StudyPage.tsx`

Update to use the new worksheet view:
- Replace single problem display with WorksheetView
- Track current page number (1, 2, etc.)
- Handle page completion → next page
- Handle worksheet completion → advance worksheet number
- Preserve existing functionality (timer, session tracking, etc.)

---

## Component Architecture

```
StudyPage
├── Header (name, level, controls)
├── Timer + SessionProgress
├── WorksheetInfo (level, worksheet number)
├── WorksheetView
│   ├── PageIndicator ("Page 1 of 2")
│   ├── ProblemGrid
│   │   ├── WorksheetProblem (problem 1)
│   │   ├── WorksheetProblem (problem 2)
│   │   ├── WorksheetProblem (problem 3)
│   │   ├── WorksheetProblem (problem 4)
│   │   └── WorksheetProblem (problem 5)
│   └── PageNavigation (Submit Page / Next Page)
├── WorksheetNumberPad (fixed at bottom)
└── ParentControls
```

---

## State Management

```typescript
interface WorksheetState {
  currentPage: number           // 1-based page number
  totalPages: number            // calculated from level
  problems: Problem[]           // all problems for current page
  answers: Record<number, string>  // problemIndex -> answer
  activeIndex: number           // which problem is focused
  submitted: boolean[]          // which problems have been submitted
  results: Record<number, boolean>  // problemIndex -> correct/incorrect
}
```

---

## User Flow

1. **Page Load**: Generate problems for page 1
2. **User taps problem**: That problem becomes active (highlighted)
3. **User enters answer**: NumberPad input goes to active problem
4. **User taps another problem**: Focus switches
5. **User submits page**: All answers checked, feedback shown
6. **User clicks "Next Page"**: Move to page 2, generate new problems
7. **All pages complete**: Worksheet advances, session ends

---

## Submit Modes

### Mode 1: Submit All (Default)
- User fills in all answers
- Clicks "Submit Page" button
- All answers checked at once
- Shows results for all problems
- Then "Next Page" button appears

### Mode 2: Submit One-by-One (Optional toggle)
- User fills in one answer
- Press Enter or "Check" to submit that one
- Immediate feedback
- Move to next problem automatically

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/utils/worksheetConfig.ts` | CREATE |
| `src/components/worksheet/WorksheetProblem.tsx` | CREATE |
| `src/components/worksheet/WorksheetView.tsx` | CREATE |
| `src/components/worksheet/WorksheetNumberPad.tsx` | CREATE |
| `src/components/worksheet/PageIndicator.tsx` | CREATE |
| `src/pages/StudyPage.tsx` | MODIFY |

---

## Testing Checklist

- [ ] Level 7A shows 1 problem per page (10 pages)
- [ ] Level 3A shows 5 problems per page (2 pages)
- [ ] Level G shows 3 problems per page
- [ ] Tapping a problem focuses it
- [ ] NumberPad input goes to focused problem
- [ ] Keyboard input works
- [ ] Submit Page checks all answers
- [ ] Correct/incorrect feedback displays
- [ ] Page navigation works
- [ ] Worksheet advances after all pages complete
- [ ] Progress is saved to database
- [ ] Pre-K levels still use TapToSelect

---

## Backwards Compatibility

- Pre-K levels (7A, 6A) with TapToSelect will continue to work
- Sequence problems will display normally
- All existing problem types supported
- Parent mode controls unchanged
