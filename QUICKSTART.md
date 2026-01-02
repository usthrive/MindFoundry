# MindFoundry - Quick Start

## 🚀 Get Running in 5 Minutes

### 1. Create Supabase Project (2 minutes)

1. Go to **[https://supabase.com/dashboard](https://supabase.com/dashboard)**
2. Click **"New Project"**
3. Fill in:
   - **Name:** `mindfoundry-prod`
   - **Database Password:** (save this!)
   - **Region:** Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for setup

### 2. Get Your Credentials (1 minute)

1. Go to **Project Settings** (gear icon)
2. Click **API** in sidebar
3. Copy:
   - **Project URL** (looks like `https://abcdefg.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Configure Environment (1 minute)

```bash
cd /home/usthr/Penta_University/Math_Tutor/MindFoundry/frontend

# Create .env file
cp .env.example .env

# Edit .env and paste your credentials:
# VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
# VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 4. Run Database Migration (1 minute)

```bash
cd /home/usthr/Penta_University/Math_Tutor/MindFoundry/supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push schema to database
supabase db push
```

You should see: "✓ All done. 8 tables created."

### 5. Start Development (30 seconds)

```bash
cd /home/usthr/Penta_University/Math_Tutor/MindFoundry/frontend
npm run dev
```

Open **http://localhost:5173** in your browser!

---

## ✅ Verify It Works

### Check Database Connection

1. Open browser DevTools (F12)
2. Go to Console tab
3. Paste:
```javascript
// Test query
const response = await fetch('YOUR_SUPABASE_URL/rest/v1/children', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
const data = await response.json()
console.log(data) // Should return empty array []
```

If you see `[]`, you're connected! 🎉

---

## 🎯 Next: Build First Component

See **[PROJECT_STATUS.md](PROJECT_STATUS.md)** for detailed roadmap.

**Suggested order:**
1. Button component
2. Problem display
3. Number pad
4. Profile selection page

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection fails
1. Check `.env` file exists
2. Verify PROJECT_URL and ANON_KEY are correct (no quotes, no trailing slashes)
3. Make sure Supabase project is "Active" in dashboard

### Port 5173 already in use
```bash
# Kill existing process
lsof -ti:5173 | xargs kill -9

# Or change port in vite.config.ts:
export default defineConfig({
  server: { port: 3000 }
})
```

---

## 📚 Helpful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Database
supabase db push        # Push migrations
supabase db reset       # Reset database (⚠️ deletes all data)
supabase status         # Check connection

# Code Quality
npm run lint            # Check for errors
```

---

## 🔗 Important Files

- **[SETUP_GUIDE.md](docs/SETUP_GUIDE.md)** - Complete setup instructions
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current status & roadmap
- **[Requirements](Requirements/)** - Full specifications

---

**Ready to code!** 🚀

Start with: `cd frontend && npm run dev`
