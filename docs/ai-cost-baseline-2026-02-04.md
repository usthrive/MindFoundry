# MindFoundry AI Architecture & Cost Projections Baseline

**Document Date:** February 4, 2026
**Purpose:** Baseline documentation for AI flow and cost projections to compare against actual performance

---

## 1. AI Architecture Overview

### Service Architecture (3-Tier)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Browser)                            │
│   frontend/src/services/ai/edgeFunctionClient.ts                    │
│   - Calls Supabase Edge Functions via secure HTTP                   │
│   - JWT token authentication                                         │
│   - Never exposes API keys                                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   SUPABASE EDGE FUNCTION                             │
│   supabase/functions/ai-service/index.ts                            │
│   - Deno-based serverless function                                   │
│   - Validates JWT tokens                                             │
│   - Routes to appropriate AI handlers                                │
│   - Secure proxy to Claude API                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     ANTHROPIC CLAUDE API                             │
│   - Direct SDK calls from Edge Function only                        │
│   - API key stored in Supabase secrets                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. AI Modes & Flows

### Homework Helper Mode (`hw_helper`)

**Purpose:** Help students with 1-4 homework images

```
Upload 1-4 Images
      ↓
Validate Image Quality (Haiku)
      ↓
Extract Problems (Haiku + Vision) ◄── COST DRIVER #1: ~1,334 tokens/image
      ↓
Student Reviews Problems
      ↓
Student Enters Answer
      ↓
Generate Ms. Guide Explanation (Sonnet) ◄── COST DRIVER #2: ~$0.018/explanation
      ↓
Chat Follow-ups (Sonnet) ◄── COST DRIVER #3: Growing context
      ↓
[Optional] Generate Similar Problem (Haiku)
      ↓
[Optional] Play Audio (Google TTS)
```

### Exam Prep Mode (`exam_prep`)

**Purpose:** Create practice tests from 5-30 homework images

```
Upload 5-30 Images
      ↓
Batch Extract Problems (Haiku + Vision) ◄── COST DRIVER #1: ~1,334 tokens/image
      ↓
Classify Topics (Client-side)
      ↓
Generate Practice Test (Haiku)
      ↓
Student Takes Test (Timed optional)
      ↓
Batch Evaluate Answers (Haiku) ◄── Efficient single API call
      ↓
For WRONG answers only:
  └→ Explanation (Sonnet) ◄── COST DRIVER #2
  └→ Chat (Sonnet) ◄── COST DRIVER #3
```

---

## 3. Models Used by Task

| Task | Model | Temperature | Cost (per 1M tokens) | Rationale |
|------|-------|-------------|---------------------|-----------|
| **Image Extraction** | Claude Haiku 4.5 | 0.0 | $0.80 in / $4.00 out | Vision capability, cost-effective, consistency |
| **Image Quality Assessment** | Claude Haiku 4.5 | 0.0 | $0.80 in / $4.00 out | Quick validation |
| **Problem Generation** | Claude Haiku 4.5 | 0.5 | $0.80 in / $4.00 out | Straightforward generation |
| **Answer Evaluation** | Claude Haiku 4.5 | 0.0 | $0.80 in / $4.00 out | Simple correct/incorrect, batch efficient |
| **Ms. Guide Explanations** | Claude Sonnet 4.5 | 0.7 | $3.00 in / $15.00 out | Quality matters for teaching |
| **Chat with Ms. Guide** | Claude Sonnet 4.5 | 0.7 | $3.00 in / $15.00 out | Natural conversation |

**Model Selection Rationale:**
- **Haiku** for 4 of 7 operations (cost-effective)
- **Sonnet** only where quality directly impacts learning experience
- **Temperature 0.0** for consistency (extraction, evaluation)
- **Temperature 0.7** for engagement (explanations, chat)

---

## 4. Token Estimates

### Per-Operation Token Usage

| Operation | Input Tokens | Output Tokens | Notes |
|-----------|-------------|---------------|-------|
| **Image (vision)** | ~1,334 | - | Per homework photo |
| **Extraction prompt** | ~500 | ~100/problem | System + user prompt |
| **Problem explanation** | ~400 | ~600 | Full Ms. Guide response |
| **Chat message** | ~800 | ~200 | Growing with history |
| **Batch evaluation** | ~50/problem + 500 | ~50/problem | Efficient batching |
| **Similar problem gen** | ~300 | ~150 | Single problem |
| **Practice test gen** | ~1,000 + context | ~150/problem | Multiple problems |

### Cost Thresholds (Anomaly Detection)

| Feature | Threshold |
|---------|-----------|
| Extraction | $0.10 |
| Explanation | $0.05 |
| Chat | $0.02 |
| Evaluation | $0.02 |
| Generation | $0.05 |
| Audio | $0.02 |

---

## 5. LLM Cost Projections

### Per-Session Estimates

| Session Type | Description | Estimated Cost |
|--------------|-------------|----------------|
| **Homework Helper (light)** | 2 images, 1 wrong answer, 2 chats | ~$0.04-0.06 |
| **Homework Helper (typical)** | 3 images, 2 wrong answers, 4 chats | ~$0.08-0.12 |
| **Homework Helper (heavy)** | 4 images, 3 wrong answers, 8 chats | ~$0.15-0.20 |
| **Exam Prep (small)** | 5 images, 10-Q test, 3 wrong | ~$0.08-0.12 |
| **Exam Prep (typical)** | 10 images, 20-Q test, 5 wrong | ~$0.15-0.25 |
| **Exam Prep (large)** | 20 images, 30-Q test, 10 wrong | ~$0.30-0.45 |

### Monthly Cost Per Child (Projected)

| User Type | Sessions/Month | Avg Cost/Session | Monthly LLM Cost |
|-----------|---------------|------------------|------------------|
| **Light** (busy schedule) | 2-3 | $0.08 | ~$0.16-0.24 |
| **Regular** (weekly use) | 4-8 | $0.12 | ~$0.48-0.96 |
| **Heavy** (daily practice) | 15-20 | $0.15 | ~$2.25-3.00 |
| **Average child** | ~8 | $0.12 | **~$0.96/month** |

### At Scale Projections (LLM Only)

| Active Users | Mix Assumption* | Monthly LLM Cost |
|--------------|-----------------|------------------|
| 10 children | Varied | ~$10 |
| 100 children | Varied | ~$96 |
| 500 children | Varied | ~$480 |
| 1,000 children | Varied | ~$960 |

*Mix: 60% light, 30% regular, 10% heavy users

---

## 6. TTS (Text-to-Speech) Cost Projections

### Current Configuration
- **Provider:** Google Cloud TTS
- **Voice:** en-US-Neural2-C (warm, child-friendly)
- **Pricing:** $16 per 1 million characters
- **Free Tier:** 1M Neural2 characters/month

### Per-Interaction Character Counts

| Component | Characters |
|-----------|------------|
| Ms. Guide greeting | ~100 |
| "What you did right" | ~150 |
| "The mistake" explanation | ~300 |
| Step-by-step solution (3-5 steps) | ~400-700 |
| Correct answer + encouragement | ~150 |
| **Total per problem help** | **~1,100-1,400 chars** |
| Chat follow-up response | ~300-500 each |

### Monthly TTS Cost Per Child

| User Type | Monthly Chars | Cost (@$16/1M) |
|-----------|---------------|----------------|
| Light user | ~15,000 | $0.24 |
| Regular user | ~80,000 | $1.28 |
| Heavy user | ~350,000 | $5.60 |
| **Average child** | ~100,000 | **~$1.60/month** |

### At Scale Projections (TTS)

| Active Users | Monthly Chars | Monthly TTS Cost |
|--------------|---------------|------------------|
| 10 children | ~1M | **FREE** (free tier) |
| 100 children | ~10M | ~$144 |
| 500 children | ~50M | ~$784 |
| 1,000 children | ~100M | ~$1,584 |

---

## 7. Total Cost Projections (LLM + TTS)

### Combined Monthly Cost Per Child

| User Type | LLM Cost | TTS Cost | **Total/Child** |
|-----------|----------|----------|-----------------|
| Light | $0.20 | $0.24 | **$0.44** |
| Regular | $0.72 | $1.28 | **$2.00** |
| Heavy | $2.63 | $5.60 | **$8.23** |
| **Average** | $0.96 | $1.60 | **$2.56** |

### At Scale Combined Projections

| Active Users | LLM Cost | TTS Cost | **Total Monthly** |
|--------------|----------|----------|-------------------|
| 10 children | ~$10 | FREE | **~$10** |
| 100 children | ~$96 | ~$144 | **~$240** |
| 500 children | ~$480 | ~$784 | **~$1,264** |
| 1,000 children | ~$960 | ~$1,584 | **~$2,544** |

### Cost Per Child Per Month at Scale

| Scale | Cost/Child/Month |
|-------|------------------|
| 10 children | ~$1.00 |
| 100 children | ~$2.40 |
| 500 children | ~$2.53 |
| 1,000 children | ~$2.54 |

---

## 8. Primary Cost Drivers Summary

### Ranked by Impact

1. **Image Processing (Vision)** - Highest
   - ~1,334 tokens per image
   - More images = higher cost
   - Mitigation: "From Past Homework" feature reuses extracted text

2. **Ms. Guide Explanations** - Second Highest
   - Uses Sonnet (3.75x more expensive than Haiku)
   - ~$0.018 per explanation
   - Mitigation: Only generate for wrong answers

3. **TTS Audio** - Third Highest
   - $16/1M characters
   - Heavy users drive this cost
   - Mitigation: Free tier covers first 10 active users

4. **Chat Context Growth** - Accumulates
   - Each message adds to context window
   - 10-message chat: ~$0.04-0.06
   - Mitigation: Session-based limits

5. **Test Generation** - Moderate
   - Haiku-based (cheaper)
   - Scales with problem count
   - Already optimized

---

## 9. Cost Tracking Infrastructure

### Database Table: `homework_ai_usage`

```sql
CREATE TABLE homework_ai_usage (
  id UUID PRIMARY KEY,
  child_id UUID REFERENCES children(id),
  session_id UUID REFERENCES homework_sessions(id),
  feature TEXT,           -- extraction, evaluation, explanation, chat, audio
  model TEXT,             -- claude-haiku-4-5-20250101, claude-sonnet-4-5-20250101
  input_tokens INTEGER,
  output_tokens INTEGER,
  image_count INTEGER,
  estimated_cost DECIMAL,
  response_time_ms INTEGER,
  success BOOLEAN,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Key Queries for Analysis

```sql
-- Daily cost by feature
SELECT
  DATE(created_at) as day,
  feature,
  SUM(estimated_cost) as total_cost,
  COUNT(*) as call_count
FROM homework_ai_usage
WHERE success = true
GROUP BY DATE(created_at), feature
ORDER BY day DESC;

-- Cost per child
SELECT
  child_id,
  SUM(estimated_cost) as total_cost,
  COUNT(DISTINCT session_id) as sessions
FROM homework_ai_usage
GROUP BY child_id
ORDER BY total_cost DESC;

-- Model usage breakdown
SELECT
  model,
  SUM(input_tokens) as total_input,
  SUM(output_tokens) as total_output,
  SUM(estimated_cost) as total_cost
FROM homework_ai_usage
GROUP BY model;
```

---

## 10. Optimization Strategies in Place

| Strategy | Implementation | Savings |
|----------|----------------|---------|
| Haiku for bulk ops | 4 of 7 AI calls use cheaper model | ~60% on those calls |
| Sonnet only for quality | Explanations and chat only | Prevents unnecessary spend |
| Batch evaluation | Single API call for all test answers | ~80% vs individual calls |
| Past homework reuse | No image reprocessing for test prep | 100% vision cost savings |
| Temperature 0.0 | No retry waste on deterministic tasks | Consistency + cost |
| Free tier usage | First 1M TTS chars free | First ~10 users free |

---

## 11. Comparison Template

Use this template to compare projections vs actuals:

| Metric | Projected | Actual | Variance |
|--------|-----------|--------|----------|
| Avg cost per Homework Helper session | $0.08-0.12 | | |
| Avg cost per Exam Prep session | $0.15-0.25 | | |
| Avg TTS chars per session | ~1,200 | | |
| Avg LLM cost per child/month | $0.96 | | |
| Avg TTS cost per child/month | $1.60 | | |
| Total cost per child/month | $2.56 | | |
| Image tokens per photo | ~1,334 | | |
| Explanation tokens (output) | ~600 | | |

---

## 12. Key Assumptions

1. **User Mix:** 60% light, 30% regular, 10% heavy users
2. **Session Behavior:** Average 3 images for HW Helper, 10 for Exam Prep
3. **Wrong Answer Rate:** ~40% of problems need explanations
4. **Chat Engagement:** Average 3-4 follow-up messages per wrong answer
5. **TTS Usage:** ~50% of explanations have audio played
6. **Model Pricing:** As of February 2026 (Anthropic pricing)
7. **TTS Pricing:** As of February 2026 (Google Cloud pricing)

---

## Document History

| Date | Change |
|------|--------|
| 2026-02-04 | Initial baseline document created |

---

*This document serves as a baseline for comparing projected vs actual AI costs. Review monthly and update projections based on real usage patterns.*
