# Create Karen Stableford Tournament

## Quick Setup

### Step 1: Run SQL Script

**In Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor"
4. Click "New query"
5. Copy content from `create-karen-stableford.sql`
6. Paste and click "Run"

### Step 2: Verify

**Check in Supabase:**
```sql
-- Check tournament
SELECT * FROM tournaments WHERE slug = 'karen-stableford-2026';

-- Check players
SELECT COUNT(*) FROM teams WHERE tournament_id = 4;

-- Check settings
SELECT * FROM tournament_settings WHERE tournament_id = 4;
```

### Step 3: Access Tournament

**URL:**
```
https://your-site.netlify.app/tournaments/karen-stableford-2026
```

**Or via CMS:**
```
https://your-site.netlify.app/cms
→ Tournaments → Karen Stableford 2026
```

---

## What Gets Created

### Tournament Details
- **Name:** Karen Stableford 2026
- **Format:** Stableford (individual competition)
- **Dates:** Oct 15-17, 2026
- **Status:** Upcoming

### Settings
- **Divisions:** None (individual)
- **Players:** 30
- **Points:** 3-1-0 (win-draw-loss)
- **Rounds:** 2
- **Sessions:** 1 per round
- **Display:** Strokes differential only

### Players (30 total)
- Alice Cooper (HCP 12)
- Betty Anderson (HCP 14)
- Catherine Brown (HCP 16)
- Diana Clark (HCP 18)
- Emma Davis (HCP 20)
- ... and 25 more

---

## Next Steps

### Add Matches via CMS

1. **Go to CMS:**
   ```
   https://your-site.netlify.app/cms
   ```

2. **Click "Matches" tab**

3. **Click "+ New"**

4. **Fill in:**
   - Tournament: Karen Stableford 2026
   - Round: 1
   - Session: Morning
   - Match Type: Singles
   - Team 1: Alice Cooper
   - Team 2: Betty Anderson
   - Scheduled Time: 2026-10-15 08:00

5. **Click "Create"**

6. **Repeat for all matches**

---

## Alternative: Create via CMS

Instead of SQL, you can create everything via CMS:

### 1. Create Tournament
- Go to `/cms`
- Click "Tournaments" → "+ New"
- Fill in details
- Configure settings
- Click "Create Tournament"

### 2. Add Players
- Click "Teams" tab
- Click "+ New" for each player
- Enter name, handicap
- Click "Create"

### 3. Create Matches
- Click "Matches" tab
- Click "+ New" for each match
- Select players, time
- Click "Create"

---

## Tournament Configuration

### Stableford Scoring
- Points based on score vs par
- Best score wins
- Individual competition
- No team play

### Leaderboard Display
- Single table (no divisions)
- Shows: Position, Name, Points, Strokes +/-
- Sorted by points (highest first)
- Real-time updates

---

## Files Created

- `create-karen-stableford.sql` - SQL setup script
- `KAREN_STABLEFORD_SETUP.md` - This guide

---

## Summary

**Quick Setup:**
1. Run SQL script in Supabase
2. Verify data created
3. Access tournament at `/tournaments/karen-stableford-2026`
4. Add matches via CMS

**Or Manual Setup:**
1. Use CMS at `/cms`
2. Create tournament with settings
3. Add 30 players
4. Create matches

**Both methods work - SQL is faster, CMS is more visual!**
