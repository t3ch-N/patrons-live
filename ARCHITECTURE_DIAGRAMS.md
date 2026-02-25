# Architecture Diagrams

## Current Setup (Standalone Deployment)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         patronscup.mygolfhub.africa                     │
│         (Standalone Next.js App)                        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  Homepage                                        │  │
│  │  ├── Leaderboard                                 │  │
│  │  ├── Schedule                                    │  │
│  │  ├── Teams                                       │  │
│  │  ├── Live Scoring                                │  │
│  │  └── Admin Panel                                 │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│                        ↓                                │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Supabase Database                        │  │
│  │  ├── tournaments (multi-tenant ready)            │  │
│  │  ├── teams                                       │  │
│  │  ├── players                                     │  │
│  │  ├── matches                                     │  │
│  │  └── scores                                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘

Deployment: Netlify/Vercel
DNS: CNAME patronscup → netlify.app
Status: ✅ READY TO DEPLOY
```

---

## Future Setup (Multi-Tournament Platform)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    mygolfhub.africa                                 │
│                    (Main Hub Platform)                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Homepage (/)                                                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                                                         │ │ │
│  │  │  🏆 Active Tournaments                                  │ │ │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │ │
│  │  │  │ Patrons Cup  │  │   Karen      │  │    Nancy     │ │ │ │
│  │  │  │    2026      │  │  Stableford  │  │   Millar     │ │ │ │
│  │  │  │              │  │    2026      │  │    2026      │ │ │ │
│  │  │  │  Live Now    │  │  Upcoming    │  │  Completed   │ │ │ │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │ │
│  │  │                                                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Tournament Routes (/tournaments/[slug])                      │ │
│  │                                                               │ │
│  │  /tournaments/patrons-cup-2026                                │ │
│  │  ├── /leaderboard                                             │ │
│  │  ├── /schedule                                                │ │
│  │  ├── /teams                                                   │ │
│  │  ├── /live                                                    │ │
│  │  └── /stats                                                   │ │
│  │                                                               │ │
│  │  /tournaments/karen-stableford-2026                           │ │
│  │  ├── /leaderboard                                             │ │
│  │  ├── /schedule                                                │ │
│  │  └── ...                                                      │ │
│  │                                                               │ │
│  │  /tournaments/nancy-millar-2026                               │ │
│  │  └── ...                                                      │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Admin CMS (/admin)                                           │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                                                         │ │ │
│  │  │  🔧 Tournament Management                               │ │ │
│  │  │  ├── Create/Edit Tournaments                            │ │ │
│  │  │  ├── Manage Teams & Players                             │ │ │
│  │  │  ├── Live Score Entry                                   │ │ │
│  │  │  ├── Match Scheduling                                   │ │ │
│  │  │  └── Results Publishing                                 │ │ │
│  │  │                                                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│                              ↓                                      │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │              Shared Supabase Database                         │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                                                         │ │ │
│  │  │  tournaments (id, name, slug, status, dates)            │ │ │
│  │  │  ├── patrons-cup-2026                                   │ │ │
│  │  │  ├── karen-stableford-2026                              │ │ │
│  │  │  └── nancy-millar-2026                                  │ │ │
│  │  │                                                         │ │ │
│  │  │  teams (id, name, tournament_id, ...)                   │ │ │
│  │  │  players (id, name, tournament_id, ...)                 │ │ │
│  │  │  matches (id, tournament_id, ...)                       │ │ │
│  │  │  scores (id, team_id, tournament_id, ...)               │ │ │
│  │  │                                                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Deployment: Netlify/Vercel
DNS: A/CNAME @ → netlify.app
Status: 📋 PLANNED FOR FUTURE
```

---

## Data Flow

### Current (Standalone)

```
User Browser
     ↓
patronscup.mygolfhub.africa
     ↓
Next.js App (SSR/Client)
     ↓
Supabase Client
     ↓
Supabase Database
     ↓
Real-time Updates
     ↓
User Browser (Live Scores)
```

### Future (Multi-Tournament)

```
User Browser
     ↓
mygolfhub.africa
     ↓
Main Hub App
     ↓
Tournament Router (by slug)
     ↓
Tournament-Specific Components
     ↓
Shared Supabase Client
     ↓
Supabase Database (Multi-Tenant)
     ↓
Real-time Updates (Per Tournament)
     ↓
User Browser (Live Scores)
```

---

## Component Reusability

### Shared Components (Used Across All Tournaments)

```
components/shared/
├── Leaderboard.tsx          ← Format-agnostic
├── ScoreCard.tsx            ← Supports multiple formats
├── TeamCard.tsx             ← Reusable
├── PlayerCard.tsx           ← Reusable
├── LiveFeed.tsx             ← Real-time updates
├── Navbar.tsx               ← Navigation
└── TournamentCountdown.tsx  ← Countdown timer
```

### Tournament-Specific Components

```
components/tournaments/
├── patrons-cup/
│   ├── PatronsCupScoring.tsx
│   └── PatronsCupRules.tsx
├── karen-stableford/
│   ├── StablefordScoring.tsx
│   └── StablefordRules.tsx
└── nancy-millar/
    ├── NancyMillarScoring.tsx
    └── NancyMillarRules.tsx
```

---

## Database Schema (Multi-Tournament Ready)

```sql
tournaments
├── id (PK)
├── name
├── slug (unique)          ← Used for routing
├── status                 ← active, upcoming, completed
├── start_date
├── end_date
└── format                 ← patrons_cup, stableford, etc.

teams
├── id (PK)
├── tournament_id (FK)     ← Isolates by tournament
├── name
├── division
└── ...

players
├── id (PK)
├── tournament_id (FK)     ← Isolates by tournament
├── team_id (FK)
├── name
└── ...

matches
├── id (PK)
├── tournament_id (FK)     ← Isolates by tournament
├── team1_id (FK)
├── team2_id (FK)
└── ...

scores
├── id (PK)
├── tournament_id (FK)     ← Isolates by tournament
├── team_id (FK)
├── points
└── ...
```

**Key Feature:** Every table has `tournament_id` for multi-tenant isolation!

---

## Deployment Architecture

### Current (Standalone)

```
GitHub/GitLab Repository
         ↓
    Git Push
         ↓
Netlify/Vercel (Auto Deploy)
         ↓
Build Process (npm run build)
         ↓
Static Site Generation
         ↓
CDN Distribution
         ↓
patronscup.mygolfhub.africa
         ↓
    End Users
```

### Future (Multi-Tournament)

```
Main Hub Repository          Patrons Cup Repository
         ↓                            ↓
    Git Push                     Git Push
         ↓                            ↓
Netlify/Vercel                 Netlify/Vercel
         ↓                            ↓
mygolfhub.africa          patronscup.mygolfhub.africa
         ↓                            ↓
         └────────────┬───────────────┘
                      ↓
              Shared Supabase
                      ↓
                  End Users
```

**Or (Integrated):**

```
Main Hub Repository (includes all tournaments)
         ↓
    Git Push
         ↓
Netlify/Vercel (Auto Deploy)
         ↓
Build Process
         ↓
mygolfhub.africa
├── /
├── /tournaments/patrons-cup-2026
├── /tournaments/karen-stableford-2026
└── /tournaments/nancy-millar-2026
         ↓
    End Users
```

---

## Migration Path

### Phase 1: Standalone (NOW)

```
[Patrons Cup Standalone]
         ↓
patronscup.mygolfhub.africa
         ↓
    Supabase DB
```

### Phase 2: Parallel Deployment (NEXT MONTH)

```
[Patrons Cup Standalone]     [Main Hub]
         ↓                        ↓
patronscup.mygolfhub.africa  mygolfhub.africa
         ↓                        ↓
         └────────┬───────────────┘
                  ↓
            Supabase DB
```

### Phase 3: Integration (MONTH 2)

```
[Main Hub with Integrated Tournaments]
         ↓
mygolfhub.africa
├── /tournaments/patrons-cup-2026
├── /tournaments/karen-stableford-2026
└── /tournaments/nancy-millar-2026
         ↓
    Supabase DB
```

### Phase 4: Deprecation (MONTH 3)

```
[Main Hub Only]
         ↓
mygolfhub.africa
         ↓
    Supabase DB

(patronscup.mygolfhub.africa redirects to main hub)
```

---

## DNS Configuration

### Current Setup

```
DNS Provider (Cloudflare/Route53/etc.)
         ↓
mygolfhub.africa (A record)
         ↓
patronscup.mygolfhub.africa (CNAME)
         ↓
patronscup-live.netlify.app
         ↓
    End Users
```

### Future Setup

```
DNS Provider
         ↓
mygolfhub.africa (A/CNAME)
         ↓
mygolfhub-main.netlify.app
         ↓
    End Users
         ↓
/tournaments/patrons-cup-2026
/tournaments/karen-stableford-2026
/tournaments/nancy-millar-2026
```

---

## Authentication Flow (Future)

```
User Login
     ↓
Supabase Auth
     ↓
JWT Token
     ↓
Role Check (admin, scorer, viewer)
     ↓
Row-Level Security (RLS)
     ↓
Tournament-Specific Access
     ↓
Admin CMS / Score Entry
```

---

## Real-Time Updates

```
Score Entry (Admin)
     ↓
Supabase Client (Insert/Update)
     ↓
Supabase Database
     ↓
Supabase Realtime (WebSocket)
     ↓
All Connected Clients
     ↓
Live Leaderboard Update
     ↓
User Sees Updated Scores
```

---

## Summary

### Current State
✅ Standalone app ready to deploy
✅ Database multi-tournament ready
✅ Components reusable
✅ Real-time scoring works

### Future State
📋 Main hub with tournament listings
📋 Centralized CMS
📋 Multiple tournaments
📋 Self-service tournament creation

### Migration
🔄 Smooth transition path
🔄 No database changes needed
🔄 Can keep standalone or integrate
🔄 Flexible architecture
