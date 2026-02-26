# Dynamic Hub Implementation Plan

## Executive Summary

This document outlines how to transform `mygolfhub.africa` into a dynamic multi-tournament platform with a CMS.

**Current State:**
- `patronscup.mygolfhub.africa` - Standalone tournament site (static)

**Target State:**
- `mygolfhub.africa` - Dynamic platform hosting multiple tournaments
- All tournaments have links from the hub
- Full CMS for managing tournaments, teams, scores

---

## DNS Configuration

### Question: Subdomain or Point to patronscup.mygolfhub.africa?

**Answer: You can do BOTH or either:**

```
Option 1: Keep Both Running
├── mygolfhub.africa              → NEW Main Hub (dynamic)
├── patronscup.mygolfhub.africa   → Existing standalone
├── karen.mygolfhub.africa        → Future Karen tournament
└── nancy.mygolfhub.africa        → Future Nancy tournament
```

```
Option 2: Path-Based (Recommended)
├── mygolfhub.africa                         → Homepage (all tournaments)
├── mygolfhub.africa/tournaments/patrons-cup-2026
├── mygolfhub.africa/tournaments/karen-stableford-2026
└── mygolfhub.africa/tournaments/nancy-millar-2026
```

**Recommended Approach: Option 2 (Path-Based)**
- Simpler DNS (only one domain)
- Single SSL certificate
- All tournaments on one platform

---

## Implementation Steps

### Phase 1: Deploy Main Hub (Next Step)

Create a new Next.js application for the hub:

```
bash
npx create-next-app@latest mygolfhub-main
cd mygolfhub-main
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### Phase 2: Core Structure

#### 2.1 Homepage (`app/page.tsx`)
```
typescript
// Displays all tournaments with links
export default function HomePage() {
  return (
    <div>
      <h1>MyGolfHub Africa</h1>
      <TournamentGrid tournaments={tournaments} />
    </div>
  );
}
```

#### 2.2 Dynamic Tournament Routes (`app/tournaments/[slug]/page.tsx`)
```
typescript
// /tournaments/patrons-cup-2026
// /tournaments/karen-stableford-2026
export default function TournamentPage({ params }) {
  const tournament = useTournament(params.slug);
  return <TournamentLayout tournament={tournament} />;
}
```

#### 2.3 Admin CMS (`app/admin/page.tsx`)
```
typescript
// Full CMS dashboard
export default function AdminDashboard() {
  return (
    <AdminLayout>
      <TournamentManager />
      <TeamManager />
      <PlayerManager />
      <ScoreEntry />
      <MatchScheduler />
    </AdminLayout>
  );
}
```

---

## CMS Features

### Required Features

| Feature | Description |
|---------|-------------|
| **Tournament Management** | Create, edit, delete tournaments |
| **Team Management** | Add/remove teams per tournament |
| **Player Management** | Add players, assign to teams |
| **Score Entry** | Live scoring interface |
| **Match Scheduling** | Schedule and manage matches |
| **Results Publishing** | Publish final results |

### Optional Features

| Feature | Description |
|---------|-------------|
| **User Authentication** | Different roles (admin, scorer, viewer) |
| **Media Management** | Upload tournament photos |
| **News/Updates** | Tournament announcements |
| **Statistics** | Player performance analytics |

---

## Database Schema (Already Ready!)

Your Supabase database already has multi-tournament support:

```
sql
-- tournaments table
id, name, slug, status, start_date, end_date, format

-- teams table  
id, name, tournament_id, ...

-- players table
id, name, handicap, tournament_id, ...

-- matches table
id, tournament_id, team_a, team_b, ...

-- scores table
id, team_id, tournament_id, hole_scores, ...
```

**No database changes needed!** ✅

---

## Reusable Components

Copy these from your existing project:

```
Existing (patrons-cup-live):
├── src/components/Leaderboard.tsx
├── src/components/ScoreCard.tsx
├── src/components/TeamCard.tsx
├── src/components/Navbar.tsx
├── src/components/admin/*.tsx
└── src/context/TournamentContext.tsx
```

These can be adapted for the hub with minor modifications.

---

## URL Structure

```
Main Hub (mygolfhub.africa)
├── /                              → Homepage (all tournaments)
├── /tournaments                   → Tournament listings
├── /tournaments/[slug]            → Tournament homepage
├── /tournaments/[slug]/leaderboard
├── /tournaments/[slug]/schedule
├── /tournaments/[slug]/teams
├── /tournaments/[slug]/live
├── /admin                         → CMS Dashboard
├── /admin/tournaments             → Manage tournaments
├── /admin/teams                   → Manage teams
├── /admin/players                 → Manage players
├── /admin/scores                  → Live score entry
└── /admin/matches                 → Match management
```

---

## Migration Path

### Option A: Keep Both Running
1. Keep `patronscup.mygolfhub.africa` as is
2. Deploy new hub to `mygolfhub.africa`
3. Add Patrons Cup to the hub
4. Eventually redirect or keep both

### Option B: Migrate Everything
1. Deploy new hub to `mygolfhub.africa`
2. Migrate Patrons Cup to `/tournaments/patrons-cup-2026`
3. Configure DNS to point `patronscup.mygolfhub.africa` to the hub
4. Deprecate standalone

**Recommended: Option A** - Run both during transition period

---

## Quick Start

### Step 1: Create New Hub Application
```
bash
npx create-next-app@latest mygolfhub-main
cd mygolfhub-main
npm install @supabase/supabase-js
```

### Step 2: Set Up Supabase Client
```
typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Step 3: Create Homepage
Fetch tournaments from Supabase and display them as cards with links.

### Step 4: Create Dynamic Routes
Use `[slug]` parameter to load tournament-specific data.

### Step 5: Build CMS
Create admin pages for CRUD operations on tournaments, teams, players.

### Step 6: Deploy & Configure DNS
Deploy to Netlify/Vercel and configure DNS.

---

## Next Steps

1. **Confirm:** Should I start building the new hub application?
2. **DNS Decision:** 
   - Create new subdomain `hub.mygolfhub.africa`?
   - Or use root domain `mygolfhub.africa`?
3. **Features:** Which CMS features are priority?

---

## Documentation Reference

For more details, see:
- `MULTI_TOURNAMENT_HUB_PLAN.md` - Full architecture
- `MAIN_HUB_STARTER.md` - Implementation guide
- `DNS_SETUP_GUIDE.md` - DNS configuration
- `DEPLOYMENT_GUIDE.md` - Deployment steps
