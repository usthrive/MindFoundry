# Feature Management System

## Overview

MathFoundry's Feature Management System provides a database-driven approach to manage which features are available at each subscription tier. This allows administrators to:

- **Enable/disable features** for specific subscription tiers without code changes
- **Add new features** as they are developed and assign them to tiers
- **Preview gated features** for users on lower tiers (shows blurred preview with upgrade prompt)
- **Test features** during development using a dev-only tier override panel
- **Track feature usage** for analytics and potential usage limits

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Database Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  features                    │  feature_tier_mappings           │
│  ├─ id (PRIMARY KEY)         │  ├─ feature_id                   │
│  ├─ name                     │  ├─ tier_id                      │
│  ├─ description              │  ├─ is_enabled                   │
│  ├─ category                 │  ├─ usage_limit                  │
│  ├─ is_active (global)       │  └─ limit_period                 │
│  ├─ preview_available        │                                  │
│  └─ icon                     │                                  │
├─────────────────────────────────────────────────────────────────┤
│                        Frontend Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  config/features.ts          │  hooks/useFeatureAccess.ts       │
│  ├─ FEATURES constants       │  ├─ hasFeature()                 │
│  ├─ TIER_LEVELS             │  ├─ checkFeatureAccess()         │
│  ├─ FEATURE_METADATA        │  ├─ getRequiredTier()            │
│  └─ DEFAULT_FEATURE_TIERS   │  └─ Dev override methods          │
├─────────────────────────────────────────────────────────────────┤
│  components/subscription/    │  components/admin/                │
│  └─ FeatureGate.tsx         │  └─ FeatureManagement.tsx         │
│     ├─ Conditional render    │     ├─ Feature matrix view       │
│     ├─ Upgrade prompts       │     ├─ Toggle features/tiers     │
│     └─ Preview mode          │     └─ Real-time database sync   │
├─────────────────────────────────────────────────────────────────┤
│  components/dev/             │                                  │
│  └─ DevTierPanel.tsx        │                                  │
│     ├─ Switch tiers          │                                  │
│     └─ View feature access   │                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Subscription Tiers

| Tier | Level | Price (Monthly) | Price (Annual) | Description |
|------|-------|-----------------|----------------|-------------|
| Foundation | 1 | $7.99 | $67.00 | Core features for all users |
| Foundation AI | 2 | $14.99 | $127.00 | Core + AI-powered features |
| VIP | 3 | $49.99 | $420.00 | All features + human support |

**Tier Hierarchy**: Higher tiers include all features from lower tiers.

---

## Feature Categories

| Category | Icon | Description | Example Features |
|----------|------|-------------|------------------|
| Core | 🎯 | Essential features in all plans | Hints, Progress Tracking, Animations |
| AI | 🤖 | AI-powered learning enhancements | AI Hints, AI Explanations, Voice Assistant |
| Premium | ⭐ | Advanced features for subscribers | Live Tutor, Custom Curriculum |
| Support | 🛟 | Support and assistance options | Priority Support |

---

## Current Features

### Core Features (Foundation Tier)

| Feature ID | Name | Description |
|------------|------|-------------|
| `basic_hints` | Basic Hints | Static hint cards for problem solving |
| `progress_tracking` | Progress Tracking | Track learning progress and worksheet completion |
| `animations` | Animations | Visual animations for math concepts |
| `parent_dashboard` | Parent Dashboard | Dashboard for parents to monitor progress |
| `video_lessons` | Video Lessons | Pre-recorded instructional videos |

### AI Features (Foundation AI Tier)

| Feature ID | Name | Description | Preview? |
|------------|------|-------------|----------|
| `ai_hints` | AI Hints | AI-generated contextual hints based on specific mistakes | ✅ |
| `ai_explanations` | AI Explanations | AI explains why an answer is wrong and how to fix it | ✅ |
| `voice_assistant` | Voice Assistant | Voice-based help for reading problems and hints | ❌ |
| `personalized_path` | Personalized Learning | AI adjusts difficulty based on performance | ❌ |
| `ai_problem_generator` | AI Problem Generator | Generate custom practice problems | ❌ |

### Premium Features (VIP Tier)

| Feature ID | Name | Description |
|------------|------|-------------|
| `live_tutor` | Live Tutor | Access to human tutors via chat or video |
| `priority_support` | Priority Support | Fast response times for support requests |
| `custom_curriculum` | Custom Curriculum | Create custom problem sets and learning paths |
| `advanced_analytics` | Advanced Analytics | Detailed performance analytics and reports |
| `offline_mode` | Offline Mode | Download content for offline learning |

---

## Usage Guide

### 1. Gating Features in Components

Use the `FeatureGate` component to conditionally render UI based on feature access:

```tsx
import { FeatureGate } from '@/components/subscription'
import { FEATURES } from '@/config/features'

// Hide content if user doesn't have access
<FeatureGate feature={FEATURES.AI_HINTS}>
  <AIHintButton />
</FeatureGate>

// Show upgrade prompt instead
<FeatureGate feature={FEATURES.AI_HINTS} showUpgrade>
  <AIHintButton />
</FeatureGate>

// Show fallback content
<FeatureGate
  feature={FEATURES.AI_HINTS}
  fallback={<BasicHintButton />}
>
  <AIHintButton />
</FeatureGate>

// Show blurred preview with upgrade CTA
<FeatureGate feature={FEATURES.AI_HINTS} showPreview>
  <AIHintButton />
</FeatureGate>
```

### 2. Programmatic Feature Checks

Use the `useFeatureAccess` hook for programmatic checks:

```tsx
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { FEATURES } from '@/config/features'

function MyComponent() {
  const { hasFeature, checkFeatureAccess } = useFeatureAccess()

  // Simple boolean check
  if (hasFeature(FEATURES.AI_HINTS)) {
    // Show AI hint
  }

  // Detailed access result
  const result = checkFeatureAccess(FEATURES.AI_HINTS)
  if (result.reason === 'tier_required') {
    console.log(`Requires: ${result.requiredTier}`)
  }
}
```

### 3. Adding a New Feature

1. **Add to database** (via migration or admin panel):
   ```sql
   INSERT INTO features (id, name, description, category, icon, is_active)
   VALUES ('my_new_feature', 'My New Feature', 'Description here', 'ai', '🆕', true);
   ```

2. **Add to config** (`frontend/src/config/features.ts`):
   ```typescript
   export const FEATURES = {
     // ... existing
     MY_NEW_FEATURE: 'my_new_feature',
   }
   ```

3. **Add metadata** (same file):
   ```typescript
   export const FEATURE_METADATA: Record<FeatureId, FeatureMetadata> = {
     // ... existing
     [FEATURES.MY_NEW_FEATURE]: {
       id: FEATURES.MY_NEW_FEATURE,
       name: 'My New Feature',
       description: 'Description here',
       category: 'ai',
       icon: '🆕',
       previewAvailable: false,
     },
   }
   ```

4. **Add default tier mapping** (same file):
   ```typescript
   export const DEFAULT_FEATURE_TIERS = {
     // ... existing
     [FEATURES.MY_NEW_FEATURE]: 'foundation_ai',
   }
   ```

5. **Enable for tiers** (via Admin Panel or SQL):
   ```sql
   INSERT INTO feature_tier_mappings (feature_id, tier_id, is_enabled)
   VALUES ('my_new_feature', 'foundation_ai', true),
          ('my_new_feature', 'vip', true);
   ```

6. **Use in components**:
   ```tsx
   <FeatureGate feature={FEATURES.MY_NEW_FEATURE}>
     <MyNewFeatureComponent />
   </FeatureGate>
   ```

---

## Development Testing

### Dev Tier Panel

In development mode, a floating purple button appears in the bottom-right corner:

1. **Click the button** to open the dev panel
2. **Select a tier** to override your current subscription
3. **View features tab** to see which features are enabled/disabled
4. **Clear override** to return to your real subscription state

The override is stored in `localStorage` and persists across page reloads.

### Testing Workflow

1. Start the dev server: `npm run dev`
2. Click the 🧪 DEV button (bottom-right)
3. Select "Foundation" to test as a basic user
4. Navigate through the app - gated features should be hidden/show upgrade prompts
5. Switch to "Foundation AI" to test AI features
6. Switch to "VIP" to test all features
7. Clear override when done

---

## Admin Panel

Access the Feature Management admin panel to manage feature-tier mappings:

**Location**: `/admin/features` (or embedded in admin dashboard)

### Features:
- **Feature Matrix**: See all features organized by category
- **Global Toggle**: Enable/disable features globally (affects all tiers)
- **Tier Toggles**: Enable/disable features for specific tiers
- **Real-time Sync**: Changes are saved to database immediately
- **Summary Cards**: See feature count per tier

---

## Database Schema

### `features` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT PRIMARY KEY | Unique feature identifier |
| `name` | TEXT | Human-readable name |
| `description` | TEXT | What the feature does |
| `category` | TEXT | Grouping: 'core', 'ai', 'premium', 'support' |
| `is_active` | BOOLEAN | Global on/off switch |
| `preview_available` | BOOLEAN | Allow preview for lower tiers |
| `display_order` | INTEGER | UI ordering |
| `icon` | TEXT | Emoji or icon identifier |

### `feature_tier_mappings` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `feature_id` | TEXT | References features(id) |
| `tier_id` | TEXT | References subscription_tiers(id) |
| `is_enabled` | BOOLEAN | Is feature enabled for this tier? |
| `usage_limit` | INTEGER | Optional usage cap per period |
| `limit_period` | TEXT | 'daily', 'weekly', 'monthly', NULL |

### `tier_features` View

Combines features and mappings for easy querying:

```sql
SELECT * FROM tier_features WHERE tier_id = 'foundation_ai';
```

---

## Best Practices

### 1. Feature Naming
- Use lowercase with underscores: `ai_hints`, `voice_assistant`
- Be descriptive but concise
- Prefix related features: `ai_hints`, `ai_explanations`

### 2. Category Assignment
- **Core**: Features that should be available to all paying users
- **AI**: Features that use AI/ML capabilities
- **Premium**: High-value features for top tier
- **Support**: Customer support related features

### 3. Preview Features
- Enable `preview_available` for features that can be showcased
- Users see a blurred preview with upgrade CTA
- Increases conversion by showing value

### 4. Graceful Degradation
- Always provide fallback UI for gated features
- Show meaningful upgrade prompts, not errors
- Explain what the feature does and why it's valuable

### 5. Testing
- Always test features at all tier levels
- Use the Dev Tier Panel during development
- Test upgrade prompts and previews

---

## Migration Path

### From Hardcoded to Database

The system supports both approaches:

1. **Hardcoded defaults** in `config/features.ts`
2. **Database overrides** in `features` and `feature_tier_mappings` tables

If the database query fails, the system falls back to hardcoded defaults automatically.

### Adding Features Incrementally

1. Add to hardcoded config first (for immediate dev testing)
2. Add to database when ready for admin control
3. Both sources are checked - database takes precedence

---

## Troubleshooting

### Feature Not Showing

1. Check if feature is globally active (`is_active = true`)
2. Check if feature is enabled for user's tier
3. Check if user's subscription is active
4. Check browser console for errors

### Dev Override Not Working

1. Check if running in development mode (`import.meta.env.DEV`)
2. Clear localStorage and try again
3. Check browser console for errors

### Admin Panel Changes Not Reflecting

1. Check network tab for failed requests
2. Refresh the page
3. Check Supabase logs for errors

---

## File Reference

| File | Purpose |
|------|---------|
| `frontend/src/config/features.ts` | Feature constants and metadata |
| `frontend/src/hooks/useFeatureAccess.ts` | Feature access hook |
| `frontend/src/components/subscription/FeatureGate.tsx` | UI gating component |
| `frontend/src/components/dev/DevTierPanel.tsx` | Dev testing panel |
| `frontend/src/components/admin/FeatureManagement.tsx` | Admin feature matrix |
| `frontend/src/types/index.ts` | TypeScript types |
| `supabase/migrations/20260126000001_feature_management.sql` | Database schema |
