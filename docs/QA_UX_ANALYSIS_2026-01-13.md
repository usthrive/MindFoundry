# UX Quality Analysis: MindFoundry Math Tutor
## From the Perspective of Expert Teacher, Student, and AI Evaluator

**Date**: January 13, 2026
**Analyst Personas**:
- Expert Kumon Teacher (pedagogical correctness)
- Student User (usability, engagement)
- AI Teacher (data needed for learning assessment)

---

## Executive Summary

This document analyzes the UX of MindFoundry Math Tutor with three critical perspectives:

1. **Teacher View**: What does an effective math tutor need to see?
2. **Student View**: What makes learning easier and more engaging?
3. **AI Evaluator View**: What data is needed to assess true understanding?

**Key Finding**: The current single-answer input model is insufficient for levels B+ where showing work is essential for:
- Detecting misconceptions (not just wrong answers)
- Teaching proper mathematical process
- Building skills that transfer to paper tests

---

## Part 1: The "Show Your Work" Problem

### Why Answer-Only is Insufficient

| Level | Problem Type | Why Work Matters |
|-------|--------------|------------------|
| 7A-2A | Simple arithmetic | Answer-only OK - mental math expected |
| A | Basic subtraction | Answer-only OK for most |
| B | Vertical add/sub with regrouping | **WORK NEEDED** - carrying/borrowing process |
| C | Multiplication/Division | **WORK NEEDED** - multi-step process |
| D | Long division, fractions | **WORK CRITICAL** - complex algorithms |
| E-F | Fraction operations, decimals | **WORK CRITICAL** - multiple steps |
| G+ | Algebra, calculus | **WORK ESSENTIAL** - process IS the learning |

### Teacher Perspective

> "If I only see a wrong answer, I can't help. Did the student:
> - Make a careless error in one digit?
> - Not understand carrying/borrowing at all?
> - Set up the problem wrong?
> - Calculate correctly but copy wrong?
>
> Without seeing the work, I'm guessing."

### Student Perspective

> "When I do math on paper, I write down each step. But in the app,
> I have to do it in my head or on separate paper, then type just the answer.
> This feels harder than real worksheets."

### AI Evaluator Perspective

> "To provide targeted feedback, I need:
> - The intermediate steps (not just final answer)
> - Where in the process the error occurred
> - Pattern of errors across multiple problems
> - Time spent on each step (indicates struggle points)"

---

## Part 2: Proposed Work Capture System

### 2.1 Capture Methods (Multi-Modal)

| Method | Best For | Implementation |
|--------|----------|----------------|
| **Digital Canvas** | Tablet/stylus users | HTML5 Canvas with pressure sensitivity |
| **Photo Upload** | Paper workers | Camera capture with crop/enhance |
| **Structured Input** | Vertical problems | Step-by-step guided input boxes |
| **Voice Narration** | Explaining thinking | Audio recording (future) |

### 2.2 Digital Canvas Design

```
┌─────────────────────────────────────────────────────────┐
│ Problem:    47                                          │
│           + 28                                          │
│           ────                                          │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │     [Scratch/Working Area - Canvas]                 │ │
│ │                                                     │ │
│ │     Student draws: carried 1, column work, etc.    │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Final Answer: [____]                                    │
│                                                         │
│ [Clear Canvas] [Undo] [Submit]                         │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Photo Capture Workflow

```
1. Student works problem on paper
2. Taps "Upload Work" button
3. Camera opens with framing guide
4. Auto-crop and enhance
5. Preview and confirm
6. Attach to problem submission
```

### 2.4 Structured Step Input (for Vertical Problems)

```
┌─────────────────────────────────────────────────────────┐
│ Problem:       47                                       │
│              + 28                                       │
│              ────                                       │
│                                                         │
│ Step 1: Add ones column                                │
│         7 + 8 = [__]  → Write [_] carry [_]           │
│                                                         │
│ Step 2: Add tens column (with carry)                   │
│         4 + 2 + carried = [__]                         │
│                                                         │
│ Final Answer: [____]                                    │
│                                                         │
│ [Submit All Steps]                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Part 3: Data Storage Strategy

### 3.1 What to Store

| Data Type | Storage Format | Retention | Size Estimate |
|-----------|----------------|-----------|---------------|
| Canvas drawing | PNG (compressed) | 14 days | ~50-100 KB each |
| Photo upload | JPEG (compressed) | 14 days | ~100-200 KB each |
| Structured steps | JSON | 90 days | ~1-2 KB each |
| Audio narration | MP3 (compressed) | 14 days | ~100-500 KB each |

### 3.2 Storage Optimization

**Goal**: Keep 14 days of work without excessive storage costs

**Strategy**:
1. **Compress aggressively**: Canvas → PNG with 8-bit color (sufficient for pencil work)
2. **Resize photos**: Max 1024px width (readable but compact)
3. **Tiered storage**:
   - Hot (14 days): Supabase Storage
   - Archive (90 days): Compressed bundles in cold storage
   - Beyond: Delete unless flagged for review

**Estimated Storage per Student**:
- 10 problems/day × 100KB avg × 14 days = ~14 MB per student
- 100 students = 1.4 GB (very manageable)

### 3.3 Database Schema Addition

```sql
-- New table for work submissions
CREATE TABLE problem_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES problem_attempts(id),
  child_id UUID REFERENCES children(id),
  work_type VARCHAR(20), -- 'canvas', 'photo', 'structured', 'audio'
  storage_path TEXT, -- Path in Supabase Storage
  file_size_kb INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Teacher review fields
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  review_status VARCHAR(20), -- 'pending', 'approved', 'needs_work'
  review_notes TEXT,

  -- AI review fields (future)
  ai_reviewed_at TIMESTAMPTZ,
  ai_assessment JSONB,
  ai_confidence DECIMAL(3,2)
);

-- Index for efficient queries
CREATE INDEX idx_problem_work_child_date ON problem_work(child_id, created_at DESC);
CREATE INDEX idx_problem_work_review ON problem_work(review_status, created_at);
```

---

## Part 4: Teacher Review Workflow

### 4.1 Review Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ 📋 Student Work Review                                  │
│                                                         │
│ Filter: [All Students ▼] [Past 7 days ▼] [Pending ▼]   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Ahmed - Level B, Worksheet 45                       │ │
│ │ 3 problems submitted • 2 need review                │ │
│ │ [View Work →]                                       │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Sara - Level A, Worksheet 112                       │ │
│ │ 5 problems submitted • All correct                  │ │
│ │ [View Work →]                                       │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Individual Problem Review

```
┌─────────────────────────────────────────────────────────┐
│ Review: Ahmed's Work                                    │
│ Problem: 47 + 28 = ?    Answer: 75 ✓                   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ [Student's handwritten/drawn work displayed]        │ │
│ │                                                     │ │
│ │     Shows: carried 1, column alignment, etc.       │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Assessment:                                             │
│ ○ Excellent work - process correct                     │
│ ○ Correct answer but work needs improvement            │
│ ○ Needs practice - [select misconception]              │
│                                                         │
│ Notes: [________________________________]               │
│                                                         │
│ [← Previous] [Mark Reviewed ✓] [Next →]                │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Batch Review Mode

For efficiency, teachers can:
1. View multiple problems in gallery mode
2. Quick-mark as "Good" with one click
3. Flag specific problems for detailed review
4. Add notes only where needed

---

## Part 5: AI Evaluation Strategy

### 5.1 The Core Question

> "Where should AI be used vs. simple algorithmic checking?"

### 5.2 Evaluation Tiers

| Tier | Evaluation Method | When to Use | Cost |
|------|-------------------|-------------|------|
| **Tier 1: Algorithmic** | Code comparison | Answer checking, simple format | $0 |
| **Tier 2: Rule-Based** | Pattern matching | Common misconceptions | $0 |
| **Tier 3: AI-Assisted** | Claude Vision/Analysis | Work review, explanation | ~$0.01-0.05/problem |
| **Tier 4: Human** | Teacher review | Complex cases, disputes | Teacher time |

### 5.3 Decision Matrix: When to Use AI

```
                        Simple Answer    Multi-Step Work    Handwritten
                        ─────────────    ───────────────    ───────────
Correct Answer          Tier 1 (free)    Tier 1 (free)      Tier 1 (free)

Wrong Answer,           Tier 2 (free)    Tier 3 (AI)        Tier 3 (AI)
Pattern Match           Rule detects     Analyze steps      OCR + Analysis

Wrong Answer,           Tier 2 (free)    Tier 3 (AI)        Tier 4 (Human)
No Pattern              Generic hint     Find error point   Teacher review

"Check My Work"         N/A              Tier 3 (AI)        Tier 3 (AI)
(student request)                        Step validation    Image analysis
```

### 5.4 Cost-Benefit Analysis

#### Scenario: 1000 Students, 10 problems/day

**Without AI (Current)**:
- Answer checking: Free (algorithmic)
- Work review: 0 (not captured)
- Misconception detection: Limited to answer patterns
- Teacher workload: HIGH for struggling students

**With Tiered AI (Proposed)**:
- Tier 1 (90% of checks): Free
- Tier 2 (8% of checks): Free
- Tier 3 (2% of checks): ~$0.03/problem average
  - 1000 students × 10 problems × 2% × $0.03 = $6/day = ~$180/month
- Teacher workload: REDUCED to flagged cases only

**ROI Calculation**:
```
Teacher time saved: ~2 hours/day × $30/hour = $60/day
AI cost: $6/day
Net savings: $54/day = $1,620/month

Plus intangible benefits:
- Better misconception detection
- Faster feedback to students
- Scalability without linear teacher cost increase
```

### 5.5 AI Evaluation Implementation (Phase 2)

#### 5.5.1 What AI Will Analyze

```typescript
interface AIWorkAnalysis {
  // Basic assessment
  isWorkCorrect: boolean;
  workQualityScore: 1-5;  // 1=illegible, 5=exemplary

  // Process analysis
  stepsIdentified: string[];
  errorLocation?: {
    step: number;
    description: string;
    misconceptionId?: string;
  };

  // Feedback generation
  studentFeedback: string;  // Age-appropriate
  teacherNotes: string;     // Technical description

  // Confidence
  confidence: number;  // 0-1, below 0.7 → flag for human review
}
```

#### 5.5.2 AI Prompt Strategy

```
System: You are analyzing a student's math work. The student is at
Kumon Level [B], working on vertical addition with carrying.

Problem: 47 + 28 = ?
Correct Answer: 75
Student Answer: 75 (correct)

[Image of student's handwritten work attached]

Analyze:
1. Can you read the work clearly? (confidence 0-1)
2. Did the student show carrying correctly?
3. Is the column alignment proper?
4. Are there any concerning patterns even though answer is correct?

Respond in JSON format with studentFeedback (encouraging, age 7-8)
and teacherNotes (technical).
```

#### 5.5.3 When AI Should NOT Be Used

1. **Pre-K to Level 2A**: Problems too simple, answer-only sufficient
2. **High-stakes decisions**: Level advancement should include human review
3. **Low confidence cases**: AI confidence < 0.7 → human review
4. **Parent disputes**: Always escalate to human

---

## Part 6: Level-Specific UX Requirements

### 6.1 UX Requirements by Level

| Level | Input Type | Work Capture | AI Evaluation |
|-------|------------|--------------|---------------|
| 7A-6A | Tap/count | None needed | No |
| 5A-4A | Number input | Optional scratch | No |
| 3A-2A | Number input | Optional scratch | No |
| A | Number input | Optional scratch | Tier 2 only |
| B | Number input | **Required for regrouping** | Tier 2-3 |
| C | Number input | **Required for mult/div** | Tier 2-3 |
| D | Number input | **Required for long div** | Tier 3 |
| E-F | Number/fraction | **Required** | Tier 3 |
| G+ | Expression input | **Required** | Tier 3-4 |

### 6.2 Display Format by Level

| Level | Problems/Screen | Work Area | Special UI |
|-------|----------------|-----------|------------|
| 7A-6A | 1 | None | Large touch targets, pictures |
| 5A-4A | 1-2 | Optional | Sequence boxes with inline input |
| 3A-2A | 3-5 | Optional | Horizontal problems, large numbers |
| A | 3-5 | Optional | Same as above |
| B | 2-3 | **Below each problem** | Vertical format, grid lines |
| C | 2-3 | **Below each problem** | Multiplication/division layout |
| D | 1-2 | **Large work area** | Long division bracket format |
| E-F | 2-3 | **Required** | Fraction bars, decimal alignment |
| G+ | 1-2 | **Required** | Equation editor, graph paper |

---

## Part 7: Student Experience Improvements

### 7.1 Current Pain Points (Student Perspective)

1. **"I have to do work on paper anyway, then type answer"**
   - Solution: Integrated work capture

2. **"One problem at a time feels slow"**
   - Solution: Multi-problem view for appropriate levels

3. **"I can't go back and check my work"**
   - Solution: Session review before submission

4. **"The app doesn't show me what I did wrong"**
   - Solution: Step-by-step feedback when work is captured

5. **"Sequences make me input answer separately"**
   - Solution: Inline input in sequence boxes

### 7.2 Proposed Student UX Flow

```
┌─────────────────────────────────────────────────────────┐
│ Session Start                                           │
│ "Today's worksheet: Level B, Sheet 45"                 │
│ "10 problems • Vertical addition with carrying"        │
│ [Start Session]                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Problem View (3 problems shown)                         │
│                                                         │
│   47      |    56      |    38                          │
│ + 28      |  + 27      |  + 45                          │
│ ────      |  ────      |  ────                          │
│ [Work]    |  [Work]    |  [Work]                        │
│ [___]     |  [___]     |  [___]                         │
│                                                         │
│ [Previous Page] [3/10 problems] [Next Page]            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Work Capture (when [Work] tapped)                       │
│                                                         │
│ Problem: 47 + 28                                        │
│                                                         │
│ ┌─────────────────────────────────────────┐            │
│ │ [Draw your work here]                   │            │
│ │                                         │            │
│ │  Canvas with pencil/eraser tools        │            │
│ │                                         │            │
│ └─────────────────────────────────────────┘            │
│                                                         │
│ [Clear] [Undo] [📷 Photo Instead] [Done]               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Session Complete                                        │
│                                                         │
│ 🎉 Great work! You got 8/10 correct                    │
│                                                         │
│ Review your answers:                                    │
│ ✓ 47+28=75  ✓ 56+27=83  ✗ 38+45=73 (should be 83)    │
│                                                         │
│ [See detailed feedback] [Continue to next sheet]       │
└─────────────────────────────────────────────────────────┘
```

---

## Part 8: Implementation Phases

### Phase 1: Foundation (Current Sprint)

**Deliverables**:
1. Fix question mark position in generators
2. Fix sequence inline display
3. Add basic canvas component (no storage yet)
4. Multi-problem view for levels 3A-A

**No AI Required**

### Phase 2: Work Capture (Next Sprint)

**Deliverables**:
1. Canvas drawing with save to Supabase Storage
2. Photo capture and upload
3. Database schema for problem_work table
4. 14-day retention policy
5. Basic teacher review dashboard

**No AI Required** (but prepares data for AI)

### Phase 3: Teacher Tools (Future)

**Deliverables**:
1. Full teacher review workflow
2. Batch review mode
3. Misconception tagging
4. Progress reports with work samples

**No AI Required**

### Phase 4: AI Integration (Future)

**Deliverables**:
1. AI work analysis for Levels B+
2. Automated misconception detection from work
3. Confidence-based routing (AI vs human review)
4. Cost monitoring dashboard

**AI Required** - Estimated $150-300/month for 1000 students

---

## Part 9: Balancing AI vs Non-AI

### 9.1 Guiding Principles

1. **AI is a tool, not a replacement**: Human teachers make final decisions
2. **Start simple, add AI where it adds clear value**: Don't over-engineer
3. **Transparency**: Parents/teachers should know when AI is used
4. **Cost-conscious but not cost-limited**: If AI adds real value, use it

### 9.2 The "AI Necessity Test"

For each feature, ask:
1. Can this be done with simple code? → Do that first
2. Does AI meaningfully improve outcomes? → Consider AI
3. Is the cost justified by time savings? → Calculate ROI
4. What's the fallback if AI fails? → Ensure graceful degradation

### 9.3 Recommended AI Usage

| Feature | Use AI? | Rationale |
|---------|---------|-----------|
| Answer checking | No | Simple comparison |
| Basic misconception hints | No | Pattern matching sufficient |
| Work legibility check | Maybe | Simple image quality check might suffice |
| Step-by-step work analysis | Yes | AI excels at visual analysis |
| Handwriting OCR | Yes | AI is far better than rule-based |
| Personalized feedback | Yes | AI can be encouraging and specific |
| Level advancement decision | No | Human oversight required |
| Explaining concepts | Yes | AI tutor (Ms. Guide) |

### 9.4 Cost Optimization Strategies

1. **Cache common patterns**: If AI analyzes "carrying error in ones column," save that analysis
2. **Batch processing**: Analyze work in batches during off-peak hours
3. **Tiered models**: Use Claude Haiku for simple checks, Sonnet for complex analysis
4. **Human-in-the-loop**: AI suggests, human confirms for high-stakes decisions

---

## Part 10: Open Questions for User

1. **Work requirement policy**: Should work capture be:
   - Required for Level B+?
   - Optional but encouraged?
   - Configurable by parent/teacher?

2. **Teacher access**: Who can review work?
   - Parent only?
   - Assigned tutor?
   - Any teacher (future classroom feature)?

3. **AI feedback visibility**: Should students see:
   - AI-generated feedback directly?
   - Only teacher-approved feedback?
   - Hybrid (AI suggests, teacher can edit)?

4. **Storage retention**: 14 days proposed. Is this sufficient?

---

## Summary

This UX analysis identifies that the current answer-only model is insufficient for meaningful learning assessment at Level B and above. The proposed work capture system:

1. **Captures student work** via canvas, photo, or structured input
2. **Stores efficiently** with 14-day retention (~14MB per student)
3. **Enables teacher review** with batch and detailed modes
4. **Prepares for AI** without requiring it immediately
5. **Balances cost and value** with tiered evaluation approach

**Estimated Implementation**:
- Phase 1-2: 2-3 weeks (no AI cost)
- Phase 3: 1-2 weeks (no AI cost)
- Phase 4: 1-2 weeks ($150-300/month ongoing)

**Key Insight**: The investment in work capture is worthwhile even without AI, as it enables meaningful teacher review. AI amplifies the value but is not required for the core benefit.
