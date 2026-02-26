# Apply Database Migration - Simple Steps

## Option 1: Automatic (Try This First)

**Run this command:**
```bash
node apply-migration.js
```

If it works, you're done! ✅

---

## Option 2: Manual (If Automatic Fails)

### Step 1: Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### Step 2: Select Your Project
Click on your project in the list

### Step 3: Open SQL Editor
Click "SQL Editor" in the left sidebar

### Step 4: Create New Query
Click "New query" button

### Step 5: Copy Migration SQL
Open this file in your project:
```
supabase/migrations/20250226000002_player_database_and_roles.sql
```

Copy ALL the content (Ctrl+A, Ctrl+C)

### Step 6: Paste and Run
1. Paste into SQL Editor (Ctrl+V)
2. Click "Run" button
3. Wait for completion

### Step 7: Verify
Run this query to check:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'player_database', 'tournament_roles', 'tournament_players');
```

Should show 4 tables.

---

## Option 3: Enable Authentication

### In Supabase Dashboard:
1. Click "Authentication" in sidebar
2. Click "Settings"
3. Under "Email" section:
   - Toggle "Enable Email provider" ON
4. Under "Site URL":
   - Enter: `https://patrons-live.netlify.app`
5. Click "Save"

---

## ✅ That's It!

After completing these steps:
- ✅ Player database is ready
- ✅ Role-based access is configured
- ✅ Authentication is enabled
- ✅ System is fully functional

---

## 🎯 Test It:

Visit: https://patrons-live.netlify.app/cms

You should be able to:
- Create tournaments with custom settings
- Add teams and players
- Manage matches
- Everything works!

---

## Need Help?

If you get stuck:
1. Check Supabase logs for errors
2. Verify environment variables are set
3. Make sure you're using the service role key
