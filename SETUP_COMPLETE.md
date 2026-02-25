# ✅ Supabase Connection - Complete Setup

Your Next.js app is **already configured** to connect to Supabase! Here's everything you need to know.

## 🎯 What's Already Done

✅ Supabase client configured (`src/lib/supabase.ts`)
✅ Environment variables set (`.env.local`)
✅ Database schema ready (`supabase/migrations/`)
✅ Context providers for real-time data
✅ JSON data files ready to migrate

## 🚀 Quick Start (3 Steps)

### Step 1: Set Up Database Tables

Go to your Supabase Dashboard:
👉 https://supabase.com/dashboard/project/kcziaodnfwoinssxiipr

1. Click **SQL Editor** in the sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/20250101000000_multi_tournament_support.sql`
4. Paste and click **Run**

This creates all tables: `tournaments`, `teams`, `players`, `matches`, `holes`, `scores`

### Step 2: Migrate Your Data

Run this command to populate the database with your existing data:

```bash
node migrate-data.js
```

This will:
- Create the Patrons Cup 2025 tournament
- Import all 15 teams
- Import all 265 players
- Initialize score tracking

### Step 3: Start Your App

```bash
npm run dev
```

Visit http://localhost:3000

## 🔍 Verify Everything Works

Test the connection:
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

## 📊 Your Database Structure

```
tournaments (1 record)
├── Patrons Cup 2025
│
teams (15 records)
├── MGC, Nyali, Railway (Trophy)
├── Vet Lab, Sigona, Kiambu (Shield)
├── Limuru, Golf Park, Thika (Plaque)
├── Royal, Karen, Eldoret (Bowl)
└── Windsor, Mombasa, Ruiru (Mug)
│
players (265 records)
└── All players assigned to teams
│
matches (to be added)
└── Match schedules and scores
│
holes (to be added)
└── Hole-by-hole scoring
│
scores (15 records)
└── Team standings initialized
```

## 🔄 Enable Real-time Updates (Optional)

For live score updates:

1. Go to **Database** → **Replication** in Supabase
2. Enable replication for:
   - ✅ `matches`
   - ✅ `holes`
   - ✅ `scores`

## 🎮 Admin Features

Your app includes an admin panel at:
- http://localhost:3000/admin

Use this to:
- Create and manage matches
- Update scores in real-time
- View live leaderboards

## 📝 Environment Variables

Your `.env.local` contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://kcziaodnfwoinssxiipr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 🐛 Troubleshooting

### "fetch failed" error
- Ensure Supabase project is active (not paused)
- Check internet connection

### "relation does not exist"
- Run the migration SQL from Step 1

### No data showing
- Run `node migrate-data.js` from Step 2

### Connection timeout
- Verify credentials in `.env.local`
- Check Supabase project status

## 📚 Key Files

- `src/lib/supabase.ts` - Supabase client
- `src/context/SupabaseTournamentContext.tsx` - Real-time data
- `supabase/migrations/` - Database schema
- `src/data/` - JSON data files
- `.env.local` - Environment variables

## 🎉 You're All Set!

Once you complete the 3 steps above:
1. ✅ Database tables created
2. ✅ Data migrated
3. ✅ App running

Your website will:
- Load data from Supabase
- Update scores in real-time
- Display live leaderboards
- Support multiple tournaments

## 🌐 Production Deployment

Your app is ready for:
- Vercel (recommended)
- Netlify
- AWS Amplify

Just ensure environment variables are set in your hosting platform.

---

**Need help?** Check the files:
- `QUICKSTART.md` - Detailed setup guide
- `SUPABASE_SETUP.md` - Database configuration
- `test-connection.js` - Connection testing
- `migrate-data.js` - Data migration

🏌️ Happy golfing!
