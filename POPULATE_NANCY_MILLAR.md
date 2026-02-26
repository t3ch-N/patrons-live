# Populate Nancy Millar Trophy Data

## Quick Steps

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Copy & Paste SQL**
   - Open file: `populate-nancy-millar.sql`
   - Copy all content
   - Paste into SQL Editor

4. **Run Query**
   - Click "Run" button
   - Wait for success message

5. **Verify**
   - Go to Table Editor
   - Check `tournaments` table
   - Should see "Nancy Millar Trophy 2026"

---

### Option 2: Using Node Script

```bash
node populate-nancy-millar.js
```

---

## What Gets Created

### Tournament
- **Name:** Nancy Millar Trophy 2026
- **Slug:** nancy-millar-2026
- **Format:** Stroke Play
- **Dates:** Sept 15-17, 2026
- **Status:** Upcoming

### Settings
- **Divisions:** None (individual competition)
- **Players:** 24
- **Points:** 1-0-0 (win only)
- **Rounds:** 3
- **Display:** Strokes differential only

### Players (24 total)
- Sarah Johnson
- Mary Williams
- Patricia Brown
- Jennifer Davis
- Linda Miller
- Elizabeth Wilson
- Barbara Moore
- Susan Taylor
- Jessica Anderson
- Karen Thomas
- Nancy Jackson
- Betty White
- Helen Harris
- Sandra Martin
- Donna Thompson
- Carol Garcia
- Ruth Martinez
- Sharon Robinson
- Michelle Clark
- Laura Rodriguez
- Dorothy Lewis
- Kimberly Lee
- Emily Walker
- Deborah Hall

---

## Access Tournament

### URL
```
/tournaments/nancy-millar-2026
```

Or via CMS:
```
/cms → Tournaments → Nancy Millar Trophy 2026
```

---

## Verify Data

### Check Tournament
```sql
SELECT * FROM tournaments WHERE slug = 'nancy-millar-2026';
```

### Check Players
```sql
SELECT * FROM teams WHERE tournament_id = 3;
```

### Check Scores
```sql
SELECT * FROM scores WHERE tournament_id = 3;
```

---

## Next Steps

1. ✅ Run SQL script
2. ✅ Verify data in Supabase
3. ✅ Access tournament page
4. ✅ Add matches via CMS
5. ✅ Start scoring

---

## Files

- `populate-nancy-millar.sql` - SQL script (use this)
- `populate-nancy-millar.js` - Node script (alternative)
- `POPULATE_NANCY_MILLAR.md` - This guide
