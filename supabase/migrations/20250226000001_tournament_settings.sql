-- Enhanced tournament settings with full customization
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{
  "has_divisions": true,
  "divisions": ["A", "B"],
  "num_teams": 12,
  "points_system": {
    "win": 2,
    "draw": 1,
    "loss": 0,
    "bonus_points": false
  },
  "match_format": {
    "rounds": 3,
    "sessions_per_round": 2,
    "matches_per_session": 6
  },
  "standings_display": {
    "show_divisions": true,
    "show_holes_won": true,
    "show_strokes": true,
    "tiebreaker": ["points", "holes_won", "strokes_differential"]
  }
}'::jsonb;

-- Add tournament_settings table for more complex configurations
CREATE TABLE IF NOT EXISTS tournament_settings (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  
  -- Division settings
  has_divisions BOOLEAN DEFAULT true,
  divisions TEXT[] DEFAULT ARRAY['A', 'B'],
  
  -- Team settings
  num_teams INTEGER DEFAULT 12,
  teams_per_division INTEGER,
  
  -- Points system
  points_for_win DECIMAL DEFAULT 2,
  points_for_draw DECIMAL DEFAULT 1,
  points_for_loss DECIMAL DEFAULT 0,
  bonus_points_enabled BOOLEAN DEFAULT false,
  bonus_points_config JSONB,
  
  -- Match format
  total_rounds INTEGER DEFAULT 3,
  sessions_per_round INTEGER DEFAULT 2,
  matches_per_session INTEGER DEFAULT 6,
  match_types TEXT[] DEFAULT ARRAY['fourballs', 'foursomes', 'singles'],
  
  -- Standings configuration
  show_divisions_separately BOOLEAN DEFAULT true,
  show_holes_won BOOLEAN DEFAULT true,
  show_strokes_differential BOOLEAN DEFAULT true,
  tiebreaker_order TEXT[] DEFAULT ARRAY['points', 'holes_won', 'strokes_differential'],
  
  -- Custom fields
  custom_scoring_rules JSONB,
  custom_display_fields JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_tournament_settings_tournament_id ON tournament_settings(tournament_id);

-- Add RLS
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tournament_settings" ON tournament_settings FOR SELECT USING (true);
CREATE POLICY "Admin write tournament_settings" ON tournament_settings FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
