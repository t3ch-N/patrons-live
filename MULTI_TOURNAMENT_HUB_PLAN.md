# Multi-Tournament Hub Architecture

## Overview
Transform `mygolfhub.africa` into a dynamic platform hosting multiple golf tournaments with a centralized CMS.

---

## Architecture

### Current State
```
patronscup.mygolfhub.africa (Standalone)
└── Patrons Cup 2026 Tournament
```

### Target State
```
mygolfhub.africa (Main Hub)
├── Homepage (Tournament Listings)
├── /tournaments/patrons-cup-2026
├── /tournaments/karen-stableford-2026
├── /tournaments/nancy-millar-2026
└── /admin (CMS Dashboard)
```

---

## Database Schema (Already Ready!)

Your Supabase database already supports multi-tournament:

```sql
-- Core Tables
tournaments (id, name, slug, status, start_date, end_date, format)
teams (id, name, tournament_id, ...)
players (id, name, tournament_id, ...)
scores (id, team_id, tournament_id, ...)
matches (id, tournament_id, ...)
```

**Key Features:**
- ✅ Tournament isolation via `tournament_id`
- ✅ Slug-based routing (`patrons-cup-2026`)
- ✅ Multiple tournament formats supported
- ✅ Shared player/team data across tournaments

---

## Main Hub Features

### 1. Homepage (`/`)
```typescript
// Display all active tournaments
- Tournament cards with:
  - Name, dates, status
  - Live scores (if active)
  - Quick links to leaderboard
  - Featured matches
  - Countdown timer
```

### 2. Tournament Routes (`/tournaments/[slug]`)
```typescript
// Dynamic routing for each tournament
- Reuse existing Patrons Cup components
- Context-aware based on tournament slug
- Shared layout and navigation
```

### 3. Admin CMS (`/admin`)
```typescript
// Centralized management dashboard
- Create/edit tournaments
- Manage teams and players
- Configure scoring formats
- Live score entry
- Match scheduling
- Results publishing
```

---

## Implementation Plan

### Phase 1: Standalone Deployment (IMMEDIATE)
**Timeline: Today**

1. Deploy current app to `patronscup.mygolfhub.africa`
2. No code changes needed
3. Fully functional standalone site

**Files to create:**
- None (already complete)

**Deployment:**
- Follow DEPLOYMENT_GUIDE.md
- Set up DNS CNAME record
- Configure Netlify/Vercel

---

### Phase 2: Main Hub Setup (NEXT WEEK)
**Timeline: 1-2 weeks**

**Create new repository: `mygolfhub-main`**

```bash
npx create-next-app@latest mygolfhub-main
cd mygolfhub-main
```

**Key Files to Create:**

1. **Homepage** (`app/page.tsx`)
```typescript
// Tournament listing with live status
export default function HomePage() {
  const tournaments = useTournaments();
  return (
    <div>
      <h1>MyGolfHub Africa</h1>
      <TournamentGrid tournaments={tournaments} />
    </div>
  );
}
```

2. **Dynamic Tournament Routes** (`app/tournaments/[slug]/page.tsx`)
```typescript
// Load tournament by slug
export default function TournamentPage({ params }) {
  const tournament = useTournament(params.slug);
  return <TournamentLayout tournament={tournament} />;
}
```

3. **Admin Dashboard** (`app/admin/page.tsx`)
```typescript
// CMS for managing all tournaments
export default function AdminDashboard() {
  return (
    <AdminLayout>
      <TournamentManager />
      <TeamManager />
      <ScoreEntry />
    </AdminLayout>
  );
}
```

**Shared Components:**
- Copy from `patrons-cup-live/src/components`
- Make tournament-agnostic
- Use TournamentContext for data

---

### Phase 3: Integration (MONTH 2)
**Timeline: 2-4 weeks**

**Migrate Patrons Cup:**
1. Move components to main hub
2. Update routes to `/tournaments/patrons-cup-2026`
3. Test thoroughly
4. Redirect old domain

**Add New Tournaments:**
1. Create tournament in Supabase
2. Add teams and players
3. Configure format and rules
4. Publish to main hub

---

## CMS Features

### Tournament Management
```typescript
interface TournamentCMS {
  // CRUD operations
  createTournament(data: TournamentInput): Promise<Tournament>;
  updateTournament(id: number, data: Partial<Tournament>): Promise<void>;
  deleteTournament(id: number): Promise<void>;
  
  // Status management
  activateTournament(id: number): Promise<void>;
  completeTournament(id: number): Promise<void>;
  
  // Bulk operations
  importTeams(tournamentId: number, csv: File): Promise<void>;
  importPlayers(tournamentId: number, csv: File): Promise<void>;
}
```

### Score Entry Interface
```typescript
interface ScoreEntryCMS {
  // Live scoring
  updateMatchScore(matchId: number, scores: HoleScores): Promise<void>;
  finalizeMatch(matchId: number): Promise<void>;
  
  // Bulk updates
  importRoundScores(roundId: number, csv: File): Promise<void>;
  
  // Real-time sync
  subscribeToMatch(matchId: number): RealtimeChannel;
}
```

### Team & Player Management
```typescript
interface TeamPlayerCMS {
  // Teams
  createTeam(tournamentId: number, data: TeamInput): Promise<Team>;
  assignPlayers(teamId: number, playerIds: number[]): Promise<void>;
  
  // Players
  createPlayer(data: PlayerInput): Promise<Player>;
  updateHandicap(playerId: number, handicap: number): Promise<void>;
  
  // Bulk operations
  importFromCSV(file: File): Promise<void>;
}
```

---

## Minimal CMS Components

### 1. Tournament Selector
```typescript
// components/admin/TournamentSelector.tsx
export function TournamentSelector() {
  const { tournaments, selectTournament } = useTournaments();
  return (
    <select onChange={(e) => selectTournament(e.target.value)}>
      {tournaments.map(t => (
        <option key={t.id} value={t.id}>{t.name}</option>
      ))}
    </select>
  );
}
```

### 2. Quick Score Entry
```typescript
// components/admin/QuickScoreEntry.tsx
export function QuickScoreEntry({ matchId }: { matchId: number }) {
  const [scores, setScores] = useState<HoleScores>({});
  
  const handleSubmit = async () => {
    await updateMatchScores(matchId, scores);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {[...Array(18)].map((_, i) => (
        <input
          key={i}
          type="number"
          placeholder={`Hole ${i + 1}`}
          onChange={(e) => setScores({...scores, [i+1]: +e.target.value})}
        />
      ))}
      <button type="submit">Save Scores</button>
    </form>
  );
}
```

### 3. Tournament Status Toggle
```typescript
// components/admin/TournamentStatus.tsx
export function TournamentStatus({ tournament }: { tournament: Tournament }) {
  const updateStatus = async (status: string) => {
    await supabase
      .from('tournaments')
      .update({ status })
      .eq('id', tournament.id);
  };
  
  return (
    <div>
      <button onClick={() => updateStatus('active')}>Activate</button>
      <button onClick={() => updateStatus('completed')}>Complete</button>
    </div>
  );
}
```

---

## Routing Strategy

### Main Hub Routes
```
/ → Homepage (tournament listings)
/tournaments → All tournaments
/tournaments/[slug] → Specific tournament
/tournaments/[slug]/leaderboard → Leaderboard
/tournaments/[slug]/schedule → Schedule
/tournaments/[slug]/teams → Teams
/tournaments/[slug]/live → Live scoring
/admin → CMS dashboard
/admin/tournaments → Manage tournaments
/admin/scores → Score entry
/admin/teams → Team management
```

### URL Examples
```
https://mygolfhub.africa/
https://mygolfhub.africa/tournaments/patrons-cup-2026
https://mygolfhub.africa/tournaments/karen-stableford-2026/leaderboard
https://mygolfhub.africa/admin/scores
```

---

## Shared Components Library

### Reusable Across Tournaments
```
components/
├── shared/
│   ├── Leaderboard.tsx (format-agnostic)
│   ├── ScoreCard.tsx (supports multiple formats)
│   ├── TeamCard.tsx
│   ├── PlayerCard.tsx
│   └── LiveFeed.tsx
├── admin/
│   ├── TournamentForm.tsx
│   ├── ScoreEntry.tsx
│   ├── TeamManager.tsx
│   └── PlayerManager.tsx
└── layouts/
    ├── TournamentLayout.tsx
    ├── AdminLayout.tsx
    └── MainLayout.tsx
```

---

## Authentication & Permissions

### User Roles
```typescript
enum UserRole {
  ADMIN = 'admin',           // Full access
  TOURNAMENT_ADMIN = 'tournament_admin', // Specific tournament
  SCORER = 'scorer',         // Score entry only
  VIEWER = 'viewer'          // Public access
}
```

### RLS Policies (Supabase)
```sql
-- Public read access
CREATE POLICY "Public read tournaments"
  ON tournaments FOR SELECT
  USING (status = 'active');

-- Admin write access
CREATE POLICY "Admin write tournaments"
  ON tournaments FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Tournament-specific admin
CREATE POLICY "Tournament admin write"
  ON teams FOR ALL
  USING (
    tournament_id IN (
      SELECT tournament_id FROM tournament_admins
      WHERE user_id = auth.uid()
    )
  );
```

---

## Deployment Strategy

### Standalone (Current)
```
patronscup.mygolfhub.africa → Netlify/Vercel
└── Independent deployment
```

### Multi-Tournament (Future)
```
mygolfhub.africa → Netlify/Vercel
├── Main hub app
└── Dynamic tournament routes
```

### Migration Path
1. Keep standalone running
2. Deploy main hub to new domain
3. Test thoroughly
4. Redirect traffic
5. Deprecate standalone

---

## Cost Estimate

### Current (Standalone)
- Netlify/Vercel: Free tier
- Supabase: Free tier (500MB, 2GB bandwidth)
- Domain: ~$12/year
- **Total: ~$12/year**

### Multi-Tournament Platform
- Netlify/Vercel: Free tier (sufficient for 5-10 tournaments)
- Supabase: Pro tier ($25/month for 8GB, 50GB bandwidth)
- Domain: ~$12/year
- **Total: ~$312/year**

---

## Next Steps

### Immediate (Today)
1. ✅ Review this architecture
2. ✅ Deploy standalone to `patronscup.mygolfhub.africa`
3. ✅ Test thoroughly

### Short-term (This Week)
1. Create main hub repository
2. Design homepage mockup
3. Plan admin dashboard UI
4. Set up authentication

### Medium-term (This Month)
1. Build main hub app
2. Implement CMS features
3. Migrate Patrons Cup
4. Add second tournament

### Long-term (Next Quarter)
1. Add 3-5 more tournaments
2. Mobile app (React Native)
3. Advanced analytics
4. Sponsor integration
5. Payment processing

---

## Questions to Answer

1. **Domain Strategy:**
   - Keep standalone + main hub? ✅ Recommended
   - Or migrate everything to main hub? (Later)

2. **CMS Priority:**
   - Basic CRUD first? ✅ Yes
   - Or full-featured from start? (No)

3. **Authentication:**
   - Supabase Auth? ✅ Recommended
   - Or third-party (Auth0, Clerk)? (Optional)

4. **Hosting:**
   - Netlify? ✅ Current
   - Vercel? (Alternative)
   - AWS Amplify? (Enterprise)

---

## Success Metrics

### Phase 1 (Standalone)
- [ ] Site live at custom domain
- [ ] Real-time scoring works
- [ ] Mobile responsive
- [ ] <2s page load time

### Phase 2 (Main Hub)
- [ ] 3+ tournaments hosted
- [ ] Admin CMS functional
- [ ] 100+ concurrent users
- [ ] 99.9% uptime

### Phase 3 (Platform)
- [ ] 10+ tournaments
- [ ] Self-service tournament creation
- [ ] Mobile app launched
- [ ] 1000+ active users
