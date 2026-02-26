# CMS Implementation Guide

## Overview
Complete CMS system for managing multiple tournaments and dynamic main website content.

---

## Features Implemented

### 1. Tournament CMS (`/cms`)
- ✅ Create/edit/delete tournaments
- ✅ Manage tournament status (upcoming/active/completed)
- ✅ Create custom matches with flexible scheduling
- ✅ Manage teams and divisions
- ✅ Support multiple tournament formats

### 2. Main Website CMS (`/cms/main-site`)
- ✅ Edit homepage hero section
- ✅ Manage about text
- ✅ Display active tournaments dynamically
- ✅ Link to tournament subdomains

---

## Access CMS

### Tournament Management
```
URL: https://patronscup.mygolfhub.africa/cms
```

### Main Website Management
```
URL: https://patronscup.mygolfhub.africa/cms/main-site
```

---

## Database Setup

### Run Migration
```bash
# Apply CMS tables migration
psql -h your-supabase-host -U postgres -d postgres -f supabase/migrations/20250226000000_cms_tables.sql
```

Or in Supabase Dashboard:
1. Go to SQL Editor
2. Copy content from `supabase/migrations/20250226000000_cms_tables.sql`
3. Run the SQL

---

## Usage Guide

### Creating a New Tournament

1. **Go to CMS:** `/cms`
2. **Click "Tournaments" tab**
3. **Click "+ New" button**
4. **Fill in details:**
   - Name: e.g., "Karen Stableford 2026"
   - Slug: e.g., "karen-stableford-2026"
   - Start Date: Tournament start
   - End Date: Tournament end
   - Format: Select format (Patrons Cup, Stableford, etc.)
   - Status: Upcoming/Active/Completed
5. **Click "Create"**

### Creating Matches

1. **Go to "Matches" tab**
2. **Click "+ New"**
3. **Configure match:**
   - Round: 1, 2, 3, etc.
   - Session: Morning/Afternoon
   - Match Type: Four Balls/Foursomes/Singles
   - Scheduled Time: Date and time
   - Team 1 & Team 2: Select from dropdown
4. **Click "Create"**

### Managing Teams

1. **Go to "Teams" tab**
2. **Click "+ New"**
3. **Enter details:**
   - Team Name
   - Division: A or B
   - Color: Pick team color
4. **Click "Create"**

### Updating Main Website

1. **Go to:** `/cms/main-site`
2. **Edit content:**
   - Hero Title: Main headline
   - Hero Subtitle: Tagline
   - About Text: Description
3. **Click "Save Changes"**
4. **Changes appear on:** `www.mygolfhub.africa`

---

## Main Website Structure

### Dynamic Homepage
```typescript
// app/page.tsx (for www.mygolfhub.africa)
export default async function HomePage() {
  const supabase = createClient();
  
  // Load dynamic content
  const { data: content } = await supabase
    .from('site_content')
    .select('*')
    .single();
  
  // Load active tournaments
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('*')
    .eq('status', 'active')
    .order('start_date');
  
  return (
    <div>
      <Hero title={content.hero_title} subtitle={content.hero_subtitle} />
      <TournamentGrid tournaments={tournaments} />
      <About text={content.about_text} />
    </div>
  );
}
```

### Tournament Links
Each tournament links to its subdomain:
```
Patrons Cup 2026 → patronscup.mygolfhub.africa
Karen Stableford → karen.mygolfhub.africa
Nancy Millar → nancy.mygolfhub.africa
```

---

## Multi-Tournament Architecture

### Database Schema
```
tournaments (id, name, slug, status, format, dates)
├── teams (tournament_id, name, division, color)
├── players (tournament_id, team_id, name, handicap)
├── matches (tournament_id, round, teams, schedule)
└── scores (tournament_id, team_id, points)

site_content (hero_title, hero_subtitle, about_text)
```

### URL Structure
```
www.mygolfhub.africa → Main hub (dynamic CMS)
├── /cms → Tournament management
├── /cms/main-site → Main website CMS
└── Links to:
    ├── patronscup.mygolfhub.africa
    ├── karen.mygolfhub.africa
    └── nancy.mygolfhub.africa
```

---

## Deployment Steps

### 1. Deploy Current App
```bash
# Already done - patronscup.mygolfhub.africa
```

### 2. Create Main Website
```bash
# Create new Next.js app for www.mygolfhub.africa
npx create-next-app@latest mygolfhub-main
cd mygolfhub-main

# Copy CMS components
cp -r ../patrons-cup-live/src/app/cms ./src/app/
cp -r ../patrons-cup-live/src/lib ./src/

# Deploy to www.mygolfhub.africa
```

### 3. Configure DNS
```
# Main website
Type: A or CNAME
Name: @ (root) or www
Value: [netlify-url]

# Tournament subdomains
Type: CNAME
Name: patronscup
Value: patronscup-live.netlify.app

Type: CNAME
Name: karen
Value: karen-stableford.netlify.app
```

---

## Features Summary

### Tournament CMS
✅ Create unlimited tournaments
✅ Customize match schedules
✅ Flexible team management
✅ Multiple tournament formats
✅ Real-time status updates

### Main Website CMS
✅ Dynamic homepage content
✅ Editable hero section
✅ Tournament listings
✅ About section management
✅ No code changes needed

---

## Next Steps

1. **Test CMS:** Visit `/cms` and create a test tournament
2. **Apply Migration:** Run SQL migration for site_content table
3. **Create Main Website:** Build www.mygolfhub.africa with dynamic content
4. **Deploy:** Deploy main website to root domain
5. **Link Tournaments:** Add links from main site to tournament subdomains

---

## Access URLs

### Current
- Tournament App: `patronscup.mygolfhub.africa`
- Tournament CMS: `patronscup.mygolfhub.africa/cms`
- Main Site CMS: `patronscup.mygolfhub.africa/cms/main-site`

### Future
- Main Website: `www.mygolfhub.africa`
- Tournament 1: `patronscup.mygolfhub.africa`
- Tournament 2: `karen.mygolfhub.africa`
- Tournament 3: `nancy.mygolfhub.africa`

---

## Support

All CMS features are now available. Test by visiting:
- `/cms` - Tournament management
- `/cms/main-site` - Main website content

Database migration file: `supabase/migrations/20250226000000_cms_tables.sql`
