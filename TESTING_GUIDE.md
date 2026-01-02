# MindFoundry - Authentication & Progress Tracking Testing Guide

## What Changed

### Before:
- No authentication/login
- No database persistence
- Progress lost on page refresh
- All state stored only in React

### After:
- Full authentication flow (login/signup)
- Multi-child support
- All progress saved to Supabase
- Progress resumes automatically after refresh
- Parent Mode toggle for controlled navigation

---

## Testing Instructions

### Step 1: Access the Application

Open your browser to: **http://localhost:5174/**

You should now see the **Login Page** instead of the practice page.

---

### Step 2: Create a New Account

1. Click "Sign up" at the bottom
2. Enter:
   - Full Name: "Test Parent"
   - Email: `test@example.com` (use your real email if you want to test verification)
   - Password: `password123` (at least 6 characters)
   - Confirm Password: `password123`
3. Click "Sign Up"
4. You should see: **"Account Created! Please check your email..."**

**Note**: Supabase email verification is enabled by default. For testing, you can either:
- Option A: Check your email and click the verification link
- Option B: Disable email verification in Supabase dashboard temporarily

---

### Step 3: Sign In

1. Click "Go to Sign In" or navigate to login page
2. Enter:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Sign In"

---

### Step 4: Create a Test Child Profile

**Important**: Since we haven't built the "Add Child" UI yet, you need to manually create a child in the database.

**Option A - Using Browser Console**:
1. After logging in successfully, open browser DevTools (F12)
2. Go to Console tab
3. Paste this code and press Enter:

```javascript
// Import the utility
import('http://localhost:5174/src/utils/testData.ts').then(module => {
  // Get current user ID
  const userId = 'YOUR_USER_ID_HERE' // Replace with actual user ID
  module.createTestChild(userId)
})
```

**Option B - Using Supabase MCP (Recommended)**:

I'll create the child for you using Supabase MCP. First, I need to know your user ID.

**Option C - Via Supabase Dashboard**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Table Editor → children
4. Click "Insert Row"
5. Fill in:
   - `user_id`: (your user ID from auth.users table)
   - `name`: Emma
   - `age`: 7
   - `grade_level`: 1
   - `avatar`: 🦄
   - `current_level`: A
   - `current_worksheet`: 1
6. Save

---

### Step 5: Select Child

After creating a child:
1. Refresh the page or navigate to `/select-child`
2. You should see the child selector with "Emma 🦄"
3. Click on Emma

---

### Step 6: Start Practicing

You should now be on the **Practice Page** with:
- Header showing: "MindFoundry" and "Emma - Level A"
- Worksheet Info: "Level A - Worksheet 1/200 - Addition Mastery"
- Math problem displayed
- Number pad for input
- Timer and progress counter (0/10)

**Complete a full session**:
1. Solve 10 problems
2. After 10th problem, you should see: "🎉 Session Complete! You got X out of 10 correct!"
3. After 3 seconds, it should automatically advance to Worksheet 2

---

### Step 7: Test Progress Persistence

**THIS IS THE KEY TEST!**

1. Note your current worksheet number (should be 2 after completing one session)
2. **Refresh the page (F5)**
3. Expected result: You should see "Worksheet 2" - NOT back to Worksheet 1!
4. Your progress was saved to Supabase and restored!

---

### Step 8: Test Parent Mode Toggle

**Student Mode (Default)**:
1. Try clicking any "Jump to Worksheet" button
2. Expected: Alert saying "⚠️ Parent Mode required"
3. Try clicking a different level button (e.g., "2A")
4. Expected: Alert saying "⚠️ Parent Mode required"

**Parent Mode**:
1. Click "🔒 Parent Controls" button
2. Confirm the dialog
3. You should see:
   - Button changes to "🔓 Parent Mode ON"
   - Orange banner appears: "⚠️ Parent Mode Active"
   - Worksheet jump buttons become visible
   - Level selector buttons become visible
4. Now you can jump to any worksheet or level
5. Click "🔓 Parent Mode ON" again to disable

---

### Step 9: Test Sign Out

1. Click "Sign Out" in top-right corner
2. Expected: Redirected to login page
3. Sign back in
4. Select Emma again
5. Expected: You resume at the exact worksheet you left off!

---

### Step 10: Test Multi-Child Support (Optional)

**Create a second child**:

Using Supabase Table Editor or MCP, create another child:
- `name`: Noah
- `age`: 9
- `avatar`: 🚀
- `current_level`: C
- `current_worksheet`: 50

Then:
1. Go to `/select-child`
2. You should see both Emma and Noah
3. Click Noah → Start at Level C, Worksheet 50
4. Complete some problems
5. Switch back to Emma → You'll be at her separate progress

---

## Database Verification

### Check Data Was Saved

After completing sessions, verify in Supabase:

**Table: `children`**
- Check `current_worksheet` increments after each session
- Check `total_problems` and `total_correct` increase

**Table: `practice_sessions`**
- Should have one row per 10-problem session
- `problems_completed`, `problems_correct`, `time_spent` populated

**Table: `worksheet_progress`**
- Should have records for each worksheet attempted
- `status` should be 'completed' or 'in_progress'
- `best_score` should show highest score achieved

**Table: `problem_attempts`**
- Should have 10 rows per session
- Each row contains problem data, student answer, correctness

---

## Common Issues & Solutions

### Issue: "No children yet" after login
**Solution**: You need to manually create a child profile (see Step 4)

### Issue: Progress not saving
**Check**:
1. Are you logged in? (Check browser console for auth errors)
2. Is Supabase connection working? (Check `.env` file)
3. Are RLS policies correct? (Check Supabase dashboard)

### Issue: Can't see login page
**Solution**: Navigate directly to `http://localhost:5174/login`

### Issue: Email verification required
**Temporary fix**: Disable email verification in Supabase → Authentication → Settings → "Enable email confirmations" = OFF

---

## Next Steps (Not in this implementation)

- [ ] Build "Add Child" UI in ChildSelectPage
- [ ] Build Parent Dashboard with progress charts
- [ ] Add worksheet progress badges to WorksheetInfo
- [ ] Add streak tracking
- [ ] Add achievements/rewards system

---

## Quick Debug Commands

### Get your User ID:
```javascript
const { data: { user } } = await supabase.auth.getUser()
console.log('User ID:', user.id)
```

### Create test child programmatically:
```javascript
await supabase.from('children').insert({
  user_id: 'YOUR_USER_ID',
  name: 'Emma',
  age: 7,
  grade_level: 1,
  avatar: '🦄',
  current_level: 'A',
  current_worksheet: 1
})
```

### Check progress:
```javascript
const { data } = await supabase.from('worksheet_progress').select('*')
console.table(data)
```
