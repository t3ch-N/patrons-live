# MyGolfHub Africa - Main Hub (Future Implementation)

## Overview
Central platform for hosting multiple golf tournaments with a unified CMS.

---

## Quick Start (When Ready to Build)

### 1. Create New Next.js App
```bash
npx create-next-app@latest mygolfhub-main
cd mygolfhub-main
npm install @supabase/supabase-js lucide-react
```

### 2. Project Structure
```
mygolfhub-main/
├── app/
│   ├── page.tsx                    # Homepage (tournament listings)
│   ├── tournaments/
│   │   └── [slug]/
│   │       ├── page.tsx            # Tournament detail
│   │       ├── leaderboard/
│   │       ├── schedule/
│   │       ├── teams/
│   │       └── live/
│   └── admin/
│       ├── page.tsx                # Admin dashboard
│       ├── tournaments/
│       ├── scores/
│       └── teams/
├── components/
│   ├── shared/                     # Reusable components
│   ├── admin/                      # CMS components
│   └── layouts/
├── lib/
│   └── supabase.ts                 # Shared Supabase client
└── types/
    └── tournament.ts               # Shared types
```

### 3. Copy Components from Patrons Cup
```bash
# Copy reusable components
cp -r ../patrons-cup-live/src/components/shared ./components/
cp -r ../patrons-cup-live/src/lib ./lib/
cp -r ../patrons-cup-live/src/types ./types/
```

### 4. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## Core Features to Implement

### 1. Homepage (`app/page.tsx`)
```typescript
import { createClient } from '@/lib/supabase';

export default async function HomePage() {
  const supabase = createClient();
  
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('*')
    .eq('status', 'active')
    .order('start_date', { ascending: false });

  return (
    <div>
      <h1>MyGolfHub Africa</h1>
      <p>Your home for golf tournaments in Kenya</p>
      
      <div className="tournament-grid">
        {tournaments?.map(tournament => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}
```

### 2. Tournament Detail (`app/tournaments/[slug]/page.tsx`)
```typescript
export default async function TournamentPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*, teams(*), players(*)')
    .eq('slug', params.slug)
    .single();

  if (!tournament) return <div>Tournament not found</div>;

  return (
    <TournamentLayout tournament={tournament}>
      <TournamentOverview tournament={tournament} />
      <LiveLeaderboard tournamentId={tournament.id} />
      <UpcomingMatches tournamentId={tournament.id} />
    </TournamentLayout>
  );
}
```

### 3. Admin Dashboard (`app/admin/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { TournamentManager } from '@/components/admin/TournamentManager';
import { ScoreEntry } from '@/components/admin/ScoreEntry';
import { TeamManager } from '@/components/admin/TeamManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tournaments');

  return (
    <AdminLayout>
      <nav>
        <button onClick={() => setActiveTab('tournaments')}>Tournaments</button>
        <button onClick={() => setActiveTab('scores')}>Scores</button>
        <button onClick={() => setActiveTab('teams')}>Teams</button>
      </nav>

      {activeTab === 'tournaments' && <TournamentManager />}
      {activeTab === 'scores' && <ScoreEntry />}
      {activeTab === 'teams' && <TeamManager />}
    </AdminLayout>
  );
}
```

---

## Minimal CMS Components

### Tournament Manager
```typescript
// components/admin/TournamentManager.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';

export function TournamentManager() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const createTournament = async () => {
    const supabase = createClient();
    await supabase.from('tournaments').insert({
      name,
      slug,
      start_date: startDate,
      end_date: endDate,
      status: 'upcoming'
    });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); createTournament(); }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tournament Name" />
      <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-name" />
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <button type="submit">Create Tournament</button>
    </form>
  );
}
```

### Score Entry
```typescript
// components/admin/ScoreEntry.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export function ScoreEntry() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('tournaments').select('*');
    setTournaments(data || []);
  };

  const loadMatches = async (tournamentId: number) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('matches')
      .select('*, team1:teams!team1_id(*), team2:teams!team2_id(*)')
      .eq('tournament_id', tournamentId);
    setMatches(data || []);
  };

  return (
    <div>
      <select onChange={(e) => {
        setSelectedTournament(e.target.value);
        loadMatches(Number(e.target.value));
      }}>
        <option>Select Tournament</option>
        {tournaments.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      {matches.map(match => (
        <MatchScoreCard key={match.id} match={match} />
      ))}
    </div>
  );
}
```

---

## Database (Already Ready!)

Your Supabase database already supports this architecture:
- ✅ Multi-tournament support
- ✅ Slug-based routing
- ✅ Tournament isolation
- ✅ Shared components

No database changes needed!

---

## Deployment

### Main Hub
```bash
# Deploy to mygolfhub.africa
vercel --prod
# or
netlify deploy --prod
```

### DNS Configuration
```
Type: A or CNAME
Name: @ (root domain)
Value: [Netlify/Vercel IP or CNAME]
```

---

## Migration Strategy

### Phase 1: Parallel Deployment
- Keep `patronscup.mygolfhub.africa` running
- Deploy main hub to `mygolfhub.africa`
- Test thoroughly

### Phase 2: Integration
- Add Patrons Cup to main hub routes
- Test `/tournaments/patrons-cup-2026`
- Verify all features work

### Phase 3: Redirect
- Set up redirect from old subdomain
- Update all links
- Monitor traffic

### Phase 4: Deprecation
- Keep old subdomain for 1 month
- Show migration notice
- Eventually shut down

---

## Estimated Timeline

### Week 1: Setup
- Create new Next.js app
- Copy components
- Set up routing

### Week 2: Core Features
- Homepage with tournament listings
- Tournament detail pages
- Basic navigation

### Week 3: Admin CMS
- Tournament management
- Score entry interface
- Team/player management

### Week 4: Integration
- Migrate Patrons Cup
- Test thoroughly
- Deploy to production

### Week 5+: Expansion
- Add more tournaments
- Enhance CMS features
- Mobile optimization

---

## Cost Estimate

### Hosting
- Netlify/Vercel: Free tier (sufficient for 5-10 tournaments)
- Upgrade if needed: $20/month

### Database
- Supabase Free: 500MB, 2GB bandwidth
- Supabase Pro: $25/month (8GB, 50GB bandwidth)

### Domain
- Already owned: $0
- SSL: Free (Let's Encrypt)

### Total
- Initial: ~$0-25/month
- With growth: ~$45-75/month

---

## Key Decisions

### 1. Routing Strategy
**Option A: Subdomains** (Current)
```
patronscup.mygolfhub.africa
karen.mygolfhub.africa
nancy.mygolfhub.africa
```

**Option B: Path-based** (Recommended for main hub)
```
mygolfhub.africa/tournaments/patrons-cup-2026
mygolfhub.africa/tournaments/karen-stableford-2026
mygolfhub.africa/tournaments/nancy-millar-2026
```

### 2. Authentication
**Recommended: Supabase Auth**
- Already integrated
- Row-level security
- Easy to implement

### 3. CMS Approach
**Phase 1: Simple forms** (Quick to build)
**Phase 2: Rich editor** (Better UX)
**Phase 3: Self-service** (Scalable)

---

## Next Steps

1. ✅ Deploy Patrons Cup standalone
2. 📋 Design main hub mockups
3. 🏗️ Create main hub repository
4. 💻 Implement core features
5. 🔗 Integrate tournaments
6. 🚀 Launch main hub

---

## Resources

- **Current App:** `patrons-cup-live/`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Architecture Plan:** `MULTI_TOURNAMENT_HUB_PLAN.md`
- **DNS Setup:** `DNS_SETUP_GUIDE.md`

---

## Questions?

Refer to the detailed guides or reach out for help!
