# Existing Mind Foundry Infrastructure Survey

**Purpose:** Phase 6 build input. What exists today, what is reusable plumbing for the Best Brains module, and what is Kumon pedagogy that must NOT be inherited. Written at pipeline start (2026-07-19) from a full codebase survey.

## Stack

- **Frontend:** React 18 + TypeScript (strict) + Vite + Tailwind, at `frontend/`. React Router v6, TanStack Query, Framer Motion, PWA via vite-plugin-pwa (precache limit already raised to 4 MiB).
- **Backend:** Supabase project `mjooqyjofzsavuqqorcg` ("MindFoundry" — MCP alias `MindFoundry_SB`). Postgres + RLS on all tables, RPC functions, migrations in `supabase/migrations/`.
- **Deploy:** Netlify (`mindfoundry.netlify.app`), config in `netlify.toml`.

## Reusable infrastructure (plumbing — safe to reuse)

| Area | Where | Notes |
|------|-------|-------|
| Auth + session | `contexts/AuthContext.tsx`, `pages/AuthPage.tsx`, `AuthCallbackPage.tsx`, protected routes in `App.tsx` | Email/password + OAuth callback route. Parent account → child profiles with PIN. |
| Child profiles | `pages/ChildSelectPage.tsx`, `children` table | Multi-child, avatar, age/grade, current level fields. |
| **Module landing page** | `pages/PracticeModulesPage.tsx` (route `/home`) | Card-based module picker: "Kumon-Style Practice", "School Help", "Video Lessons", "My Progress". **Natural mount point for a Best Brains module card.** |
| Persistence layer | `services/progressService.ts`, `lib/` Supabase client | Session/attempt/mastery CRUD patterns, RPC call patterns (e.g., daily save limits). |
| Progress/reporting UI | `pages/ProgressDashboard.tsx`, `components/charts/` | Charts, badges, streaks — component patterns reusable; Kumon metrics not. |
| UI primitives | `components/ui/` (Button, Card, Progress), `components/input/` (NumberPad, InputDisplay, TapToSelect), design tokens in `tailwind.config.js` | Child-sized touch targets (48–80px), teal design system. |
| Feedback system | `components/feedback/` + `feedbackService.ts` + `feedback` table | In-app user feedback capture. |
| Achievements/celebrations | `contexts/CelebrationContext.tsx`, `services/achievements/` | Available but see product principles — Best Brains module is calm/not-gamey; use sparingly if at all. |
| TTS/STT | `services/ttsService.ts`, `useSoundEffects`, TTS A/B infra | Teacher-explanation voiceover could reuse this. |
| AI services | `services/ai/`, `homeworkService.ts`, `schoolProblemService.ts`, homework/exam-prep pages | Existing LLM plumbing (Homework Helper & Exam Prep) — patterns for AI teacher calls. |
| Animations | `components/animations/` (46 concept visualizations, AnimationPlayer) | Concept-teaching visuals reusable as a library where topics overlap. |
| Subscription/feature gating | `contexts/SubscriptionContext.tsx`, `subscriptionService.ts`, feature_management migration | Tier gating exists if module needs gating later. |
| Session controls | `hooks/useIdleTimeout.ts`, `SessionControls`, `TimeoutWarningModal` | Generic child-session safety; reusable. |

## Kumon pedagogy — must NOT be inherited (per meta-prompt §1/§9)

- Worksheet pacing: 200 worksheets/level, 10-problems-then-advance, problems-per-page ladder (`utils/worksheetConfig.ts`, `WorksheetView`).
- Repetition-driven mastery & level progression logic (`services/generators/*` sequencing, mastery_status semantics).
- Kumon session structure in `StudyPage.tsx` (2 sessions/day, count-up timer rhythm, SCT timing).
- 3-level graduated hint escalation tuned for drill worksheets (may be re-derived if evidence supports, not copied by default).

## Database (existing tables of note)

`users`, `children`, `practice_sessions`, `problem_attempts` (JSONB problem payloads — good precedent), `daily_practice`, `mastery_status`, `concept_intros_viewed`, `achievements`, `feedback`, `child_daily_saves`, homework/exam-prep tables, video tables, cohorts tables (`20260428+` migrations), subscription tables. Convention: JSONB payloads for generated content, RLS child→parent ownership, RPCs for atomic counters.

## Module Interface Contract — current state

**No formal contract exists.** The Kumon module is woven through `StudyPage` + generators + progressService. `PracticeModulesPage` is a de-facto module registry (hardcoded cards). Phase 6 must define the contract (levels/placement, concept catalog, session generator, progress schema, parent-report schema) and conform both modules to it — refactor gently, do not destabilize the live Kumon flow.

## Constraints noted for build

- Bundle already ~1 MB; vite chunk-splitting exists (Cohorts V1.2). New module should be lazy-loaded route chunks.
- Repo has uncommitted untracked artifacts (QA reports, screenshots, video/). Do not sweep them into module commits; commit pathspec-only.
- Live deploy on Netlify — keep main branch buildable at every commit.
