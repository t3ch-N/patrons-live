# Customizable Tournament System

## Overview
Fully customizable tournament management system where each tournament can have its own settings for divisions, points, teams, and standings display.

---

## Key Features

### ✅ Flexible Tournament Settings
- Enable/disable divisions per tournament
- Custom number of teams
- Configurable points system (win/draw/loss)
- Custom rounds and sessions
- Flexible standings display

### ✅ Dynamic Leaderboard
- Adapts to tournament settings
- Shows/hides divisions based on config
- Displays only relevant columns
- Custom tiebreaker rules

### ✅ Per-Tournament Customization
- Each tournament has independent settings
- No hardcoded assumptions
- Fully CMS-driven

---

## Tournament Settings

### Basic Settings
```typescript
{
  has_divisions: boolean,        // Enable/disable divisions
  divisions: string[],           // e.g., ['A', 'B'] or ['Premier', 'Championship']
  num_teams: number,             // Total teams in tournament
  teams_per_division: number     // Teams per division (if divisions enabled)
}
```

### Points System
```typescript
{
  points_for_win: number,        // e.g., 2, 3, 1
  points_for_draw: number,       // e.g., 1, 0.5
  points_for_loss: number,       // e.g., 0
  bonus_points_enabled: boolean, // Extra points for specific achievements
  bonus_points_config: {
    // Custom bonus rules
  }
}
```

### Match Format
```typescript
{
  total_rounds: number,          // e.g., 3, 4, 5
  sessions_per_round: number,    // e.g., 2 (morning/afternoon)
  matches_per_session: number,   // e.g., 6, 8, 12
  match_types: string[]          // e.g., ['fourballs', 'foursomes', 'singles']
}
```

### Standings Display
```typescript
{
  show_divisions_separately: boolean,    // Separate tables per division
  show_holes_won: boolean,               // Show holes won column
  show_strokes_differential: boolean,    // Show strokes +/- column
  tiebreaker_order: string[]             // e.g., ['points', 'holes_won', 'strokes']
}
```

---

## Usage Examples

### Example 1: Patrons Cup (With Divisions)
```javascript
{
  has_divisions: true,
  divisions: ['A', 'B'],
  num_teams: 12,
  points_for_win: 2,
  points_for_draw: 1,
  points_for_loss: 0,
  total_rounds: 3,
  sessions_per_round: 2,
  show_divisions_separately: true,
  show_holes_won: true,
  show_strokes_differential: true
}
```

**Result:**
- 2 separate leaderboards (Division A & B)
- 6 teams per division
- Standard 2-1-0 points
- Shows holes won and strokes differential

---

### Example 2: Stableford (No Divisions)
```javascript
{
  has_divisions: false,
  divisions: [],
  num_teams: 20,
  points_for_win: 3,
  points_for_draw: 1,
  points_for_loss: 0,
  total_rounds: 2,
  sessions_per_round: 1,
  show_divisions_separately: false,
  show_holes_won: false,
  show_strokes_differential: true
}
```

**Result:**
- Single leaderboard for all teams
- 20 teams total
- 3-1-0 points system
- Only shows strokes differential

---

### Example 3: Stroke Play (Simple)
```javascript
{
  has_divisions: false,
  divisions: [],
  num_teams: 30,
  points_for_win: 1,
  points_for_draw: 0,
  points_for_loss: 0,
  total_rounds: 4,
  sessions_per_round: 1,
  show_divisions_separately: false,
  show_holes_won: false,
  show_strokes_differential: true
}
```

**Result:**
- Single leaderboard
- 30 individual players/teams
- Simple win counting
- Focus on strokes differential

---

## CMS Configuration

### Creating Tournament with Custom Settings

1. **Go to CMS:** `/cms`
2. **Click "Tournaments" → "+ New"**
3. **Fill Basic Info:**
   - Name, Slug, Dates, Format

4. **Configure Tournament Settings:**
   
   **Divisions:**
   - ☑ Has Divisions (check if needed)
   - Number of Teams: 12
   
   **Points System:**
   - Points for Win: 2
   - Points for Draw: 1
   - Points for Loss: 0
   
   **Match Format:**
   - Total Rounds: 3
   - Sessions per Round: 2
   
   **Standings Display:**
   - ☑ Show Divisions Separately
   - ☑ Show Holes Won
   - ☑ Show Strokes Differential

5. **Click "Create Tournament"**

---

## Database Schema

### tournament_settings Table
```sql
CREATE TABLE tournament_settings (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id),
  
  -- Division settings
  has_divisions BOOLEAN DEFAULT true,
  divisions TEXT[] DEFAULT ARRAY['A', 'B'],
  num_teams INTEGER DEFAULT 12,
  teams_per_division INTEGER,
  
  -- Points system
  points_for_win DECIMAL DEFAULT 2,
  points_for_draw DECIMAL DEFAULT 1,
  points_for_loss DECIMAL DEFAULT 0,
  
  -- Match format
  total_rounds INTEGER DEFAULT 3,
  sessions_per_round INTEGER DEFAULT 2,
  
  -- Display settings
  show_divisions_separately BOOLEAN DEFAULT true,
  show_holes_won BOOLEAN DEFAULT true,
  show_strokes_differential BOOLEAN DEFAULT true,
  tiebreaker_order TEXT[] DEFAULT ARRAY['points', 'holes_won', 'strokes_differential']
);
```

---

## Dynamic Leaderboard Component

### Usage
```typescript
import DynamicLeaderboard from '@/components/DynamicLeaderboard';

export default function LeaderboardPage() {
  return <DynamicLeaderboard tournamentId={1} />;
}
```

### Features
- Automatically loads tournament settings
- Adapts table columns based on settings
- Groups by division if enabled
- Applies custom tiebreaker rules
- Shows/hides columns dynamically

---

## Migration Steps

### 1. Apply Database Migration
```bash
# In Supabase Dashboard → SQL Editor
# Run: supabase/migrations/20250226000001_tournament_settings.sql
```

### 2. Update Existing Tournaments
```sql
-- Add default settings for existing tournaments
INSERT INTO tournament_settings (tournament_id, has_divisions, num_teams)
SELECT id, true, 12 FROM tournaments
WHERE id NOT IN (SELECT tournament_id FROM tournament_settings);
```

### 3. Use Dynamic Leaderboard
```typescript
// Replace static leaderboard with dynamic one
import DynamicLeaderboard from '@/components/DynamicLeaderboard';

// In your leaderboard page
<DynamicLeaderboard tournamentId={tournamentId} />
```

---

## Benefits

### ✅ No Code Changes Needed
- All settings managed via CMS
- No developer required for new tournaments
- Self-service tournament creation

### ✅ Maximum Flexibility
- Support any tournament format
- Custom points systems
- Flexible team structures
- Adaptable displays

### ✅ Consistent Experience
- Same codebase for all tournaments
- Unified CMS interface
- Shared components

---

## Testing

### Test Different Configurations

**Test 1: With Divisions**
```
has_divisions: true
divisions: ['A', 'B']
num_teams: 12
```
Expected: 2 separate leaderboards

**Test 2: Without Divisions**
```
has_divisions: false
num_teams: 20
```
Expected: Single leaderboard

**Test 3: Custom Points**
```
points_for_win: 3
points_for_draw: 1
```
Expected: 3-1-0 points system

---

## Next Steps

1. ✅ Apply migration: `20250226000001_tournament_settings.sql`
2. ✅ Test CMS: Create tournament with custom settings
3. ✅ Use DynamicLeaderboard component in your pages
4. ✅ Configure each tournament independently

---

## Files Created

1. `supabase/migrations/20250226000001_tournament_settings.sql` - Database schema
2. `src/app/cms/page.tsx` - Updated CMS with settings UI
3. `src/components/DynamicLeaderboard.tsx` - Adaptive leaderboard component
4. `CUSTOMIZABLE_TOURNAMENTS.md` - This guide

---

**Your tournament system is now fully customizable!**

Each tournament can have its own:
- Division structure
- Points system
- Team count
- Standings display
- Match format

All managed through the CMS without code changes.
