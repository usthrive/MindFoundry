# MindFoundry Setup Guide

## ✅ Completed Setup

### 1. Project Structure ✓
```
/home/usthr/Penta_University/Math_Tutor/MindFoundry/
├── frontend/          ✓ React + TypeScript + Vite
├── supabase/          ✓ Database schema ready
├── ai/                ✓ Directory structure
└── docs/              ✓ Documentation
```

### 2. Frontend Configuration ✓
- ✅ Vite + React + TypeScript
- ✅ Tailwind CSS with custom design system
- ✅ Dependencies installed (234 packages)
- ✅ Development server working (localhost:5173)
- ✅ Custom color palette matching spec
- ✅ Touch-friendly sizing (48-60px targets)

### 3. TypeScript Setup ✓
- ✅ Core type definitions (`src/types/index.ts`)
- ✅ Utility functions (`src/lib/utils.ts`)
- ✅ Supabase client (`src/lib/supabase.ts`)

### 4. Database Schema ✓
Created migration file at: `supabase/migrations/20250101000001_init_schema.sql`

**Tables:**
- ✅ `users` - Parent accounts
- ✅ `children` - Student profiles
- ✅ `daily_practice` - Daily tracking
- ✅ `practice_sessions` - Sessions
- ✅ `problem_attempts` - Attempts
- ✅ `mastery_status` - Progress
- ✅ `concept_intros_viewed` - Animations
- ✅ `ai_interactions` - AI usage

**Features:**
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance
- ✅ Updated_at triggers
- ✅ Data validation constraints

---

## 🔐 Project Separation & Security

### **Important: Keeping MindFoundry Separate from Other Projects**

MindFoundry uses its **own Supabase project** separate from CascadeProjects:

| Project | Location | Supabase URL |
|---------|----------|--------------|
| **MindFoundry** | `/Penta_University/Math_Tutor/MindFoundry/` | `mjooqyjofzsavuqqorcg.supabase.co` |
| **CascadeProjects** | `/CascadeProjects/` | Different project |

### **How Separation Works:**

1. **Different `.env` Files**
   - Each project has its own `.env` with unique credentials
   - Never copy `.env` between projects!

2. **Directory Detection**
   - Before any database operation, verify current directory with `pwd`
   - If in `/MindFoundry/` → Use MindFoundry Supabase
   - If in `/CascadeProjects/` → Use Cascade Supabase

3. **MCP Configuration** (Optional)
   - You can configure multiple MCP instances in Claude Desktop
   - Each named differently: `supabase-mindfoundry`, `supabase-cascade`
   - See [CREDENTIALS.md](CREDENTIALS.md) for MCP setup

### **Safety Checklist:**
Before any database operation:
- [ ] Run `pwd` to verify location
- [ ] Check `.env` file has correct Supabase URL
- [ ] Confirm which project you're working on
- [ ] Verify migration/changes are intended for this project

---

## 🔜 Next Steps

### Step 1: ~~Create Supabase Project~~ ✅ DONE

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `mindfoundry-prod`
4. Choose region (closest to users)
5. Set strong database password
6. Wait for provisioning (~2 minutes)

### Step 2: Run Database Migration

```bash
cd /home/usthr/Penta_University/Math_Tutor/MindFoundry/supabase

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_ID

# Run the migration
supabase db push
```

### Step 3: Configure Environment

1. Copy environment file:
```bash
cd /home/usthr/Penta_University/Math_Tutor/MindFoundry/frontend
cp .env.example .env
```

2. Get Supabase credentials from dashboard:
   - Project Settings → API
   - Copy "Project URL" and "anon public" key

3. Update `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_APP_ENV=development
```

### Step 4: Test Database Connection

```bash
cd frontend
npm run dev
```

Then test Supabase connection in browser console:
```javascript
// In browser DevTools console
import { supabase } from './src/lib/supabase'
const { data, error } = await supabase.from('children').select('*')
console.log({ data, error })
```

---

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📋 Phase 1 Remaining Tasks

1. **Core UI Components** (Next)
   - Button component
   - Card component
   - Progress indicators

2. **Problem Generation Engine**
   - Addition generator (levels 6A-A)
   - Subtraction generator (levels 6A-B)
   - Problem difficulty logic

3. **Input Components**
   - Number Pad (60×60px keys)
   - Handwriting canvas (Phase 2)

4. **Display Components**
   - Problem display (horizontal/vertical)
   - Feedback component (success/error/hint)

5. **Session Management**
   - Age-based configuration
   - Timer (counting up)
   - Brain break system
   - Progress tracking

6. **Pages**
   - Profile selection
   - Problem screen
   - Session complete
   - Brain break

---

## 🔐 Security Notes

### Environment Variables
- ✅ `.env` is gitignored
- ✅ Use `.env.example` as template
- ⚠️ Never commit real API keys

### Supabase RLS
- ✅ All tables have RLS enabled
- ✅ Policies enforce child-to-parent ownership
- ✅ No public access without authentication

---

## 🎨 Design System Reference

### Colors
```typescript
primary: '#00B2A9'      // Teal - main actions
success: '#32CD32'      // Green - correct answers
error: '#FF6F61'        // Coral - gentle errors
warning: '#FFD966'      // Yellow - hints
background: '#F6F8FB'   // Light background
```

### Touch Targets
- Minimum: 48×48px
- Ideal: 60×60px
- Number pad keys: 60×60px
- Primary buttons: 60px height

### Typography
- Display: "Sassoon Primary" (child-friendly)
- Body: Verdana
- Math: SF Mono (monospace)

---

## 📚 Resources

- [Master Spec](/home/usthr/Penta_University/Math_Tutor/Requirements/kumonapp-specs/00-KUMONAPP-MASTER-SPEC.md)
- [Frontend UI Spec](/home/usthr/Penta_University/Math_Tutor/Requirements/kumonapp-specs/frontend/04-FRONTEND-UI-SPEC.md)
- [AI System Spec](/home/usthr/Penta_University/Math_Tutor/Requirements/kumonapp-specs/ai/01-MS-GUIDE-AI-SYSTEM.md)
- [Misconception Detection](/home/usthr/Penta_University/Math_Tutor/Requirements/kumonapp-specs/ai/02-MISCONCEPTION-DETECTION.md)
- [Animation System](/home/usthr/Penta_University/Math_Tutor/Requirements/kumonapp-specs/ai/03-ANIMATION-SYSTEM.md)

---

## 🐛 Troubleshooting

### Dev server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection error
1. Check `.env` file exists and has correct values
2. Verify Supabase project is active
3. Check network connectivity

### TypeScript errors
```bash
# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

**Last Updated:** 2025-01-01
**Status:** Phase 1 Setup Complete ✅
