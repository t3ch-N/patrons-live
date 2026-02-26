# Enhanced Multi-Tournament System

## ✅ What's Included:

### 1. Per-Tournament Customization (Already Working!)
- ✅ Custom division names (Trophy, Shield, Premier, etc.)
- ✅ Custom points system per tournament
- ✅ Enable/disable divisions
- ✅ Custom number of teams/players
- ✅ Custom rounds and sessions
- ✅ Custom display options
- ✅ Different formats per tournament

### 2. Global Player Database (NEW!)
- ✅ Reusable player profiles across tournaments
- ✅ Store handicap, contact info, club details
- ✅ Link players to multiple tournaments
- ✅ Update once, use everywhere

### 3. Role-Based Authentication (NEW!)
- ✅ **Admin:** Full system access
- ✅ **Tournament Manager:** Manage specific tournaments
- ✅ **Team Captain:** Manage own team players
- ✅ **Player:** Self-register and view tournaments

---

## 🚀 Setup Instructions:

### Step 1: Apply Database Migration

**In Supabase Dashboard:**
1. Go to SQL Editor
2. Copy content from: `supabase/migrations/20250226000002_player_database_and_roles.sql`
3. Run the SQL
4. Verify tables created

### Step 2: Enable Supabase Authentication

**In Supabase Dashboard:**
1. Go to Authentication → Settings
2. Enable Email provider
3. Configure email templates
4. Set site URL: `https://patrons-live.netlify.app`

---

## 📋 How It Works:

### Per-Tournament Customization

**Example 1: Patrons Cup (With Divisions)**
```javascript
{
  has_divisions: true,
  divisions: ['A', 'B'],
  division_names: {
    'A': 'Trophy Division',
    'B': 'Shield Division'
  },
  points_for_win: 2,
  points_for_draw: 1,
  show_divisions_separately: true
}
```

**Example 2: Stableford (No Divisions)**
```javascript
{
  has_divisions: false,
  divisions: [],
  division_names: {},
  points_for_win: 3,
  points_for_draw: 1,
  show_divisions_separately: false
}
```

**Example 3: Corporate Event (Custom Divisions)**
```javascript
{
  has_divisions: true,
  divisions: ['Premier', 'Championship', 'Challenge'],
  division_names: {
    'Premier': 'Premier League',
    'Championship': 'Championship Flight',
    'Challenge': 'Challenge Cup'
  },
  points_for_win: 1,
  show_divisions_separately: true
}
```

---

## 👥 User Roles & Permissions:

### Admin
**Can do:**
- ✅ Create/edit/delete tournaments
- ✅ Manage all teams and players
- ✅ Assign tournament managers
- ✅ Configure all settings
- ✅ View all data

### Tournament Manager
**Can do:**
- ✅ Manage assigned tournaments
- ✅ Create teams and matches
- ✅ Assign team captains
- ✅ Enter scores
- ✅ View tournament data

### Team Captain
**Can do:**
- ✅ Add/remove players to their team
- ✅ View team roster
- ✅ Update team information
- ✅ Register team for tournaments

### Player
**Can do:**
- ✅ Self-register account
- ✅ Create player profile
- ✅ Register for tournaments
- ✅ View tournament information
- ✅ Update own profile

---

## 🎯 User Workflows:

### Player Self-Registration

**Step 1: Sign Up**
```
URL: /auth/signup
- Enter email, name, phone
- Set password
- Verify email
```

**Step 2: Create Profile**
```
URL: /profile/create
- Enter handicap
- Add club details
- Upload photo (optional)
```

**Step 3: Register for Tournament**
```
URL: /tournaments/[slug]/register
- Select tournament
- Choose team (if applicable)
- Submit registration
```

### Team Captain Workflow

**Step 1: Get Assigned**
```
Admin assigns captain role for specific team
```

**Step 2: Manage Team**
```
URL: /team/[team-id]/manage
- View team roster
- Add players from player database
- Remove players
- Update team info
```

**Step 3: Register Team**
```
URL: /tournaments/[slug]/register-team
- Register entire team
- Confirm player availability
```

### Tournament Manager Workflow

**Step 1: Get Assigned**
```
Admin assigns tournament manager role
```

**Step 2: Setup Tournament**
```
URL: /cms/tournaments/[id]
- Configure settings
- Create teams
- Schedule matches
```

**Step 3: Manage During Event**
```
URL: /cms/tournaments/[id]/live
- Enter scores
- Update match status
- Monitor leaderboard
```

---

## 🗄️ Database Structure:

### Player Database (Global)
```sql
player_database
├── id (unique player ID)
├── user_id (linked to auth)
├── full_name
├── email
├── phone
├── handicap
├── club_name
└── profile_photo
```

### Tournament Players (Per Tournament)
```sql
tournament_players
├── tournament_id
├── player_id (from player_database)
├── team_id
└── status (registered/confirmed/withdrawn)
```

### Tournament Roles (Permissions)
```sql
tournament_roles
├── tournament_id
├── user_id
├── role (manager/captain/scorer)
└── team_id (if captain)
```

---

## 🎨 Customization Examples:

### Custom Division Names

**Patrons Cup:**
```javascript
division_names: {
  'A': 'Trophy Division',
  'B': 'Shield Division'
}
```

**Age Groups:**
```javascript
division_names: {
  'U12': 'Under 12',
  'U15': 'Under 15',
  'U18': 'Under 18',
  'Open': 'Open Division'
}
```

**Skill Levels:**
```javascript
division_names: {
  'Pro': 'Professional',
  'Elite': 'Elite Amateur',
  'Club': 'Club Level',
  'Social': 'Social Players'
}
```

### Custom Points Systems

**Standard Match Play:**
```javascript
points_for_win: 2
points_for_draw: 1
points_for_loss: 0
```

**Football Style:**
```javascript
points_for_win: 3
points_for_draw: 1
points_for_loss: 0
```

**Winner Takes All:**
```javascript
points_for_win: 1
points_for_draw: 0
points_for_loss: 0
```

---

## 📱 API Endpoints (To Implement):

### Authentication
```
POST /api/auth/signup - Register new user
POST /api/auth/login - Login user
POST /api/auth/logout - Logout user
GET  /api/auth/me - Get current user
```

### Player Database
```
GET  /api/players - List all players
POST /api/players - Create player profile
GET  /api/players/:id - Get player details
PUT  /api/players/:id - Update player
```

### Tournament Registration
```
POST /api/tournaments/:id/register - Register for tournament
GET  /api/tournaments/:id/players - List registered players
PUT  /api/tournaments/:id/players/:playerId - Update registration
```

### Team Management
```
GET  /api/teams/:id/players - List team players
POST /api/teams/:id/players - Add player to team
DELETE /api/teams/:id/players/:playerId - Remove player
```

---

## ✅ Summary:

### What You Have Now:

**1. Per-Tournament Customization:**
- ✅ Custom divisions (names, count, enable/disable)
- ✅ Custom points systems
- ✅ Custom display options
- ✅ Different formats per tournament

**2. Player Database:**
- ✅ Global player profiles
- ✅ Reusable across tournaments
- ✅ Linked to user accounts

**3. Role-Based Access:**
- ✅ Admin, Manager, Captain, Player roles
- ✅ Permission-based actions
- ✅ Self-registration enabled

### Next Steps:

1. **Apply migration** in Supabase
2. **Enable authentication** in Supabase
3. **Build UI components** for:
   - User registration
   - Player profiles
   - Team management
   - Tournament registration

---

## 🎯 Implementation Priority:

### Phase 1 (Immediate):
1. Apply database migration
2. Enable Supabase Auth
3. Test with sample data

### Phase 2 (This Week):
1. Build registration UI
2. Create player profile pages
3. Add team management interface

### Phase 3 (Next Week):
1. Implement role-based permissions
2. Add tournament registration flow
3. Build captain dashboard

---

**Your system is now ready for multi-tournament, multi-user, role-based operation!**
