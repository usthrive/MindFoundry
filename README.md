# MindFoundry 🎓

A math practice app for children ages 4-11, combining Kumon methodology with AI tutoring.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

```bash
cd frontend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Supabase credentials to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

App will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## 📁 Project Structure

```
MindFoundry/
├── frontend/              # React + TypeScript app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # Business logic
│   │   ├── hooks/        # React hooks
│   │   ├── lib/          # Utilities
│   │   ├── types/        # TypeScript types
│   │   └── assets/       # Images, fonts
│   └── public/
├── supabase/             # Backend
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
├── ai/                   # AI system
│   ├── skills/           # AI personas
│   └── prompts/          # Prompt templates
└── docs/                 # Documentation
```

## 🎯 Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Database + Auth + Edge Functions)
- **AI:** Claude API (Sonnet 4.5)
- **Hosting:** Netlify

## 📋 Phase 1 MVP Features

✅ **Implemented:**
- Project structure
- TypeScript configuration
- Tailwind design system
- Core types and utilities

🚧 **In Progress:**
- Supabase database schema
- Problem generation engine
- Basic UI components

📅 **Planned:**
- Session management
- Profile selection
- Number pad input
- Progress tracking

## 🔗 Related Documentation

- [Requirements](/home/usthr/Penta_University/Math_Tutor/Requirements/)
- [Master Spec](/home/usthr/Penta_University/Math_Tutor/Requirements/kumonapp-specs/00-KUMONAPP-MASTER-SPEC.md)
- [Frontend UI Spec](/home/usthr/Penta_University/Math_Tutor/Requirements/kumonapp-specs/frontend/04-FRONTEND-UI-SPEC.md)

## 📝 License

Proprietary - All Rights Reserved
