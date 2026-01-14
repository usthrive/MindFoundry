# MindFoundry Future Enhancements Roadmap

**Created**: January 13, 2026
**Last Updated**: January 13, 2026

### Quick Status
- ✅ **Responsive NumberPad** - DONE
- ⏳ **Decimal Validation** - Low priority, pending
- 🔜 **Work Capture System** - Next major feature

---

## Enhancement Phases Overview

| Phase | Focus | Status | Dependencies |
|-------|-------|--------|--------------|
| Phase 1 | Core UX Improvements | ✅ Complete (1/2 items done, 1 low-priority pending) | None |
| Phase 2 | Work Capture System | **NEXT** | Phase 1 |
| Phase 3 | AI Review Integration | Planned | Phase 2 |
| Phase 4 | Human Review (Teacher Login) | Planned | Phase 3 |
| Phase 5 | Multi-Problem Worksheet View | Deferred | Phase 1 |

---

## Phase 1: Core UX Improvements (MOSTLY COMPLETE)

### 1.1 Responsive NumberPad
**Priority**: HIGH
**Status**: ✅ COMPLETED (2026-01-13)

Make NumberPad dynamically adjust to device size:
- Phone: Compact layout, 44px buttons (min touch target)
- Tablet: Medium layout, 56px buttons
- Desktop: Large layout, 64px buttons

**Implementation Completed**:
- Added `size` prop with options: `'compact'`, `'medium'`, `'large'`, `'auto'`
- Default `'auto'` uses Tailwind breakpoints (`sm:`, `lg:`) to respond to screen size
- Minimum touch target 44x44px maintained for accessibility
- Button gap, border radius, and container max-width all scale with device size
- Action buttons (Clear, Delete, Submit) also scale appropriately

**File Modified**: `frontend/src/components/input/NumberPad.tsx`

### 1.2 Decimal Validation (Level F)
**Priority**: LOW
**Status**: Pending

Accept equivalent decimal forms (`2.0` = `2` = `2.00`).

---

## Phase 2: Work Capture System

### 2.1 Canvas Drawing
**Priority**: HIGH
**Status**: Planned

Allow students to show work on-screen using touch/mouse drawing.

**Features**:
- Drawing canvas overlay
- Undo/redo functionality
- Clear canvas option
- Color selection (pen colors)
- Eraser tool

**Storage Decision**: Save to Google Drive, store link in Supabase

### 2.2 Photo Upload
**Priority**: HIGH
**Status**: Planned

Allow students/parents to photograph paper work.

**Features**:
- Camera capture (mobile)
- File upload (desktop)
- Image preview before submission
- Crop/rotate tools

**Storage Decision**: Save to Google Drive, store link in Supabase

### 2.3 Database Schema

```sql
-- Store work references (not actual files)
CREATE TABLE problem_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_attempt_id UUID REFERENCES problem_attempts(id),
  child_id UUID REFERENCES children(id),
  work_type TEXT NOT NULL, -- 'canvas' | 'photo'
  storage_url TEXT NOT NULL, -- Google Drive link
  storage_provider TEXT DEFAULT 'google_drive',
  file_size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- 14-day retention
);

-- Index for cleanup job
CREATE INDEX idx_problem_work_expires ON problem_work(expires_at);
```

### 2.4 Google Drive Integration

**Why Google Drive?**
- No Supabase storage costs
- Familiar to parents
- Easy sharing with teachers
- 15GB free per account

**Implementation Approach**:
1. Use Google Drive API
2. Create app folder in user's Drive
3. Organize by child/date/session
4. Store shareable link in Supabase
5. Automatic cleanup after 14 days (optional)

**Folder Structure**:
```
MindFoundry/
  └── [Child Name]/
      └── [Date YYYY-MM-DD]/
          └── session_[id]/
              ├── problem_1_canvas.png
              ├── problem_2_photo.jpg
              └── ...
```

---

## Phase 3: AI Review Integration

### 3.1 Tiered Evaluation System

| Tier | Method | Cost | Use Case |
|------|--------|------|----------|
| Tier 1 | Algorithmic | Free | Answer validation |
| Tier 2 | Pattern Detection | Free | Common misconceptions |
| Tier 3 | AI Analysis | ~$0.01-0.05/problem | Work analysis, hints |
| Tier 4 | Human Review | Manual | Complex cases |

### 3.2 AI Work Analysis
**Status**: Planned (after Phase 2)

Use Claude/GPT to analyze student work images:
- Identify calculation errors
- Detect misconceptions
- Suggest targeted practice
- Generate personalized hints

**Cost Estimate**: ~$180/month for 1000 active students
- Assumes 20 problems/day/student
- 10% of problems need AI review
- ~$0.03 per AI analysis

### 3.3 Misconception Detection

Pre-built patterns for common errors:
- Digit reversal (21 vs 12)
- Counting errors (+1/-1)
- Carrying/borrowing mistakes
- Place value confusion

---

## Phase 4: Human Review (Teacher Login)

### 4.1 Teacher Account System
**Status**: Planned (after Phase 3)
**Dependencies**: AI Review must be working first

**Features**:
- Separate teacher login
- Link teacher to students
- Review queue dashboard
- Marking tools
- Progress reports

### 4.2 Review Workflow

```
Student submits work
    ↓
Tier 1-2: Automatic validation
    ↓
Tier 3: AI flags issues (optional)
    ↓
Tier 4: Teacher reviews flagged items
    ↓
Feedback returned to student
```

### 4.3 Teacher Dashboard Features

- View student work images
- Mark correct/incorrect steps
- Add written feedback
- Track student progress over time
- Generate reports for parents

---

## Phase 5: Multi-Problem Worksheet View (DEFERRED)

### 5.1 Overview
**Status**: Deferred (keep on radar)

Display multiple problems per screen like Kumon worksheets.

**Recommended Layout by Level**:
| Level | Problems Per Screen |
|-------|---------------------|
| 7A-6A | 1 |
| 5A-4A | 1-2 |
| 3A-2A | 3-5 |
| A | 3-5 |
| B | 2-3 |
| C-F | 3-5 |
| G+ | 2-3 |

### 5.2 Benefits
- Students see patterns
- Matches Kumon worksheet experience
- Faster session completion feel
- Better progress visibility

### 5.3 Implementation Notes
- Create `WorksheetView` component
- Inline answer inputs for each problem
- Submit one at a time OR batch submit
- Scroll support for longer worksheets

---

## Technical Debt & Maintenance

### Ongoing Tasks
- [ ] Review and update Kumon compliance as levels are used
- [ ] Monitor Supabase storage if work capture implemented differently
- [ ] Performance testing on mobile devices
- [ ] Accessibility audit (screen readers, keyboard navigation)

### Code Quality
- [ ] Add unit tests for generators
- [ ] Add integration tests for StudyPage
- [ ] Document all generator compliance rules

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-13 | Use Google Drive for work storage | Avoid Supabase storage costs, familiar to users |
| 2026-01-13 | Defer multi-problem view | Critical fixes prioritized first |
| 2026-01-13 | Teacher review after AI integration | AI can pre-filter, reducing teacher workload |
| 2026-01-13 | ✅ Responsive NumberPad completed | Added size prop with auto-responsive breakpoints |

---

## Next Actions (Priority Order)

1. ~~**Responsive NumberPad** - Make touch targets adapt to device~~ ✅ DONE
2. **Work Capture Design** - Finalize Google Drive integration approach
3. **Canvas Component** - Build drawing overlay
4. **Photo Upload** - Build camera/file upload
5. **AI Integration Research** - Cost/benefit for specific use cases

---

*This document should be updated as decisions are made and phases complete.*
