# Supabase Credentials Guide

## 📍 Where to Get Your Credentials

### Step 1: Create Supabase Project

1. Go to **[https://supabase.com/dashboard](https://supabase.com/dashboard)**
2. Sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** `mindfoundry-prod`
   - **Database Password:** Create strong password (SAVE THIS!)
   - **Region:** `us-east-1` (or closest to you)
5. Click **"Create new project"**
6. Wait ~2 minutes for provisioning

---

### Step 2: Get API Credentials (For Frontend)

1. In your Supabase dashboard, click **⚙️ Project Settings** (bottom left)
2. Click **API** in the left sidebar
3. You'll see this page with your credentials:

#### **A. Project URL** ✅
```
https://abcdefghijklmnop.supabase.co
```
- Located under **"Project URL"**
- Copy the entire URL
- This is your **`VITE_SUPABASE_URL`**

#### **B. API Keys** ✅
You'll see two keys:

**1. `anon` `public` key** (Safe for frontend)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzA4MTY5MCwiZXhwIjoxOTM4NjU3NjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Located under **"anon public"**
- Click **"Copy"** button
- This is your **`VITE_SUPABASE_ANON_KEY`**
- ✅ **Safe to use in frontend code**
- ✅ **Safe to commit to Git** (RLS protects your data)

**2. `service_role` `secret` key** (Admin access)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjIzMDgxNjkwLCJleHAiOjE5Mzg2NTc2OTB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- Located under **"service_role secret"**
- Click **"Copy"** button
- ⚠️ **KEEP THIS SECRET!**
- ⚠️ **NEVER commit to Git!**
- Only use in backend/server code

---

### Step 3: Get Project Reference ID (For CLI/MCP)

Still in **Project Settings**:

1. Click **General** in the left sidebar
2. Scroll to **Reference ID**
```
abcdefghijklmnop
```
- This is the first part of your URL
- Copy this ID
- Used for `supabase link` command

---

### Step 4: Get Database Password (For Direct DB Access)

⚠️ **IMPORTANT:** You set this when creating the project

- If you forgot it, you can reset it:
  1. Go to **Project Settings → Database**
  2. Click **"Reset database password"**
  3. Enter new password and save

---

## 🔑 What Keys to Use Where

### **Frontend (.env file)** ✅
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Use:** `anon public` key
**Why:** Safe for client-side, RLS protects data

---

### **Supabase CLI** (For Migrations)
```bash
supabase link --project-ref abcdefghijklmnop
```
**Use:** Project Reference ID
**Why:** Links CLI to your project

You'll also need to log in first:
```bash
supabase login
```
This opens a browser to authenticate.

---

### **Supabase MCP** (For AI Assistant Access)

The Supabase MCP needs configuration in Claude Desktop.

#### **Option 1: Using Project Credentials** (Recommended)
Edit `~/.config/claude/claude_desktop_config.json` or similar:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://abcdefghijklmnop.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

**Keys Needed:**
- `SUPABASE_URL` = Your Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = **service_role secret** key

⚠️ **Use `service_role` key for MCP** - It needs admin access to create tables, run migrations, etc.

#### **Option 2: Using Access Token** (Advanced)
You can also use a Supabase Access Token:

1. Go to **Supabase Dashboard → Account → Access Tokens**
2. Click **"Generate New Token"**
3. Name it: `MCP Access Token`
4. Copy the token
5. Use in MCP config:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_xxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

---

## 📋 Complete Checklist

### For MindFoundry Project:

- [ ] **Create Supabase project** (`mindfoundry-prod`)
- [ ] **Copy Project URL** → Add to `.env` as `VITE_SUPABASE_URL`
- [ ] **Copy `anon public` key** → Add to `.env` as `VITE_SUPABASE_ANON_KEY`
- [ ] **Copy `service_role secret` key** → Save securely (for MCP)
- [ ] **Copy Project Reference ID** → Save (for CLI)
- [ ] **Save Database Password** → Save securely

### Create `.env` File:

```bash
cd /home/usthr/Penta_University/Math_Tutor/MindFoundry/frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ANON_KEY
VITE_APP_ENV=development
```

---

## 🔒 Security Best Practices

### ✅ **Safe to Commit to Git:**
- `anon public` key (protected by RLS)
- Project URL
- Project Reference ID

### ⚠️ **NEVER Commit to Git:**
- `service_role secret` key (admin access!)
- Database password
- Access tokens
- `.env` file (it's gitignored)

### 🔐 **Where to Store Secrets:**
1. **Development:** `.env` file (gitignored)
2. **Production:** Environment variables on Netlify
3. **Team Sharing:** Use password manager (1Password, Bitwarden)

---

## 🧪 Test Your Setup

### 1. Test Frontend Connection

```bash
cd frontend
npm run dev
```

Open browser console (F12), paste:
```javascript
// Import Supabase client
const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')

// Use your credentials
const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_ANON_KEY'
)

// Test query
const { data, error } = await supabase.from('children').select('*')
console.log({ data, error })
```

**Expected:** `{ data: [], error: null }` (empty array means connected!)

---

### 2. Test CLI Connection

```bash
cd supabase
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase db push
```

**Expected:**
```
✓ Linked to project: mindfoundry-prod
✓ All done. 8 tables created.
```

---

## 🆘 Troubleshooting

### "Invalid API key"
- Check you copied the **entire** key (it's very long ~200 characters)
- Make sure no extra spaces or quotes
- Verify you're using the correct key type (`anon` for frontend, `service_role` for MCP)

### "Project not found"
- Verify Project Reference ID is correct
- Make sure project is fully provisioned (wait 2 min after creation)
- Try logging out and back in: `supabase logout && supabase login`

### MCP can't connect
- Check MCP config JSON syntax is valid
- Verify `service_role` key is correct
- Restart Claude Desktop after config changes

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **MCP Docs:** https://github.com/modelcontextprotocol/servers/tree/main/src/supabase
- **Project Issues:** `/home/usthr/Penta_University/Math_Tutor/MindFoundry/`

---

**Ready to get your credentials?** Start at [supabase.com/dashboard](https://supabase.com/dashboard) 🚀
