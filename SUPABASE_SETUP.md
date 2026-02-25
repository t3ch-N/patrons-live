# Supabase Setup Guide

Your Next.js app is already configured to connect to Supabase! Here's what you need to do:

## ✅ Already Configured

Your `.env.local` file contains:
- `NEXT_PUBLIC_SUPABASE_URL`: https://kcziaodnfwoinssxiipr.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

## 🗄️ Database Setup

### Step 1: Run the Migration SQL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/kcziaodnfwoinssxiipr
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20250101000000_multi_tournament_support.sql`
5. Click **Run** to execute the migration

This will create all necessary tables:
- `tournaments` - Tournament information
- `teams` - Team data
- `players` - Player information
- `matches` - Match details
- `holes` - Hole-by-hole scoring
- `scores` - Team standings

### Step 2: Verify Tables

Run this query in SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see: `holes`, `matches`, `players`, `scores`, `teams`, `tournaments`

### Step 3: Enable Realtime (Optional)

For live score updates:

1. Go to **Database** → **Replication** in Supabase Dashboard
2. Enable replication for these tables:
   - `matches`
   - `holes`
   - `scores`

## 🚀 Run Your App

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 📊 Populate Data

If you have existing data in JSON files (`src/data/`), you can migrate it using:

```bash
npm run migrate
```

Or manually insert data through the Supabase Dashboard → **Table Editor**.

## 🔧 Troubleshooting

If you see connection errors:
1. Verify your Supabase project is active
2. Check that the URL and keys in `.env.local` are correct
3. Ensure RLS policies allow public access (already configured in migration)

## 📝 Next Steps

1. Run the migration SQL in Supabase Dashboard
2. Populate your database with tournament data
3. Start the development server
4. Your app will automatically connect to Supabase for live data!
