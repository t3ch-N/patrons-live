# 🚀 Quick Start: Connect to Supabase

Your Next.js app is **already configured** for Supabase! Follow these steps to get it running.

## ✅ Step 1: Verify Supabase Project

1. Go to https://supabase.com/dashboard
2. Check if project `kcziaodnfwoinssxiipr` is active
3. If paused, click "Resume" to activate it

## 📊 Step 2: Set Up Database Tables

### Option A: Using Supabase Dashboard (Recommended)

1. Open your project: https://supabase.com/dashboard/project/kcziaodnfwoinssxiipr
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/20250101000000_multi_tournament_support.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

This creates all tables: `tournaments`, `teams`, `players`, `matches`, `holes`, `scores`

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref kcziaodnfwoinssxiipr

# Run migrations
supabase db push
```

## 🔄 Step 3: Enable Realtime (Optional)

For live score updates:

1. Go to **Database** → **Replication**
2. Enable replication for:
   - ✅ `matches`
   - ✅ `holes`
   - ✅ `scores`

## 📝 Step 4: Add Data

### If you have existing JSON data:

Your project has data in `src/data/`:
- `teams.json`
- `players.json`
- `matches.json`
- `scores.json`

Run the migration script:
```bash
npm run migrate
```

### Or add data manually:

1. Go to **Table Editor** in Supabase Dashboard
2. Select a table (e.g., `tournaments`)
3. Click **Insert** → **Insert row**
4. Fill in the data and save

## 🏃 Step 5: Run Your App

```bash
npm run dev
```

Open http://localhost:3000

## 🔍 Verify Connection

Test if everything is connected:

```bash
node test-connection.js
```

You should see:
```
✅ Tournaments table exists
✅ Teams table exists
✅ Players table exists
✅ Matches table exists
```

## 🎯 What's Already Configured

Your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kcziaodnfwoinssxiipr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Your app uses:
- `src/lib/supabase.ts` - Supabase client
- `src/context/SupabaseTournamentContext.tsx` - Real-time data context
- Automatic realtime updates for live scoring

## 🐛 Troubleshooting

### "fetch failed" error
- Check if Supabase project is active (not paused)
- Verify internet connection
- Confirm URL in `.env.local` is correct

### "relation does not exist" error
- Tables haven't been created yet
- Run the migration SQL in Step 2

### No data showing
- Check if tables have data (Table Editor)
- Run `npm run migrate` to import JSON data
- Verify `tournament_id` matches in all tables

## 📚 Database Schema

```
tournaments
├── id (primary key)
├── name, slug, description
├── start_date, end_date, status
└── format, divisions, point_system

teams
├── id (primary key)
├── name, division, color
├── tournament_id (foreign key)
└── session_points, players_per_session

players
├── id (primary key)
├── name, team_id, handicap
└── tournament_id (foreign key)

matches
├── id (primary key)
├── team_a_id, team_b_id, team_c_id
├── match_type, session, status
├── tournament_id (foreign key)
└── players (JSONB)

holes
├── id (primary key)
├── match_id (foreign key)
├── hole_number, par
└── team scores and player scores

scores
├── id (primary key)
├── team_id, tournament_id
└── points, matches_played, position
```

## 🎉 You're Done!

Once the migration runs successfully, your app will:
- ✅ Connect to Supabase automatically
- ✅ Load tournament data from the database
- ✅ Update scores in real-time
- ✅ Display live leaderboards

Visit https://patronscup.mygolfhub.africa/ to see it live!
