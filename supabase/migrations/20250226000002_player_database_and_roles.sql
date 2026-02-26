-- Enhanced Multi-Tournament System with Player Database and Role-Based Access

-- 1. Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'player', -- admin, tournament_manager, team_captain, player
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create global player database (reusable across tournaments)
CREATE TABLE IF NOT EXISTS player_database (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  handicap DECIMAL,
  date_of_birth DATE,
  gender TEXT,
  membership_number TEXT,
  club_name TEXT,
  profile_photo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create tournament_roles table (who can manage what)
CREATE TABLE IF NOT EXISTS tournament_roles (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- tournament_manager, team_captain, scorer
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tournament_id, user_id, role)
);

-- 4. Link players to tournaments (from player database)
CREATE TABLE IF NOT EXISTS tournament_players (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES player_database(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'registered', -- registered, confirmed, withdrawn
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tournament_id, player_id)
);

-- 5. Update tournament_settings to support custom division names
ALTER TABLE tournament_settings 
  ADD COLUMN IF NOT EXISTS division_names JSONB DEFAULT '{"A": "Trophy Division", "B": "Shield Division"}'::jsonb,
  ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- 6. Create RLS policies for role-based access

-- Users can read their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Player database - public read, authenticated write
ALTER TABLE player_database ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read player_database" ON player_database FOR SELECT USING (true);
CREATE POLICY "Authenticated create player_database" ON player_database FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users update own player_database" ON player_database FOR UPDATE 
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'tournament_manager')
  ));

-- Tournament roles - managers can assign roles
ALTER TABLE tournament_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tournament_roles" ON tournament_roles FOR SELECT USING (true);
CREATE POLICY "Managers assign roles" ON tournament_roles FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'tournament_manager')
  ));

-- Tournament players - captains can manage their team
ALTER TABLE tournament_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read tournament_players" ON tournament_players FOR SELECT USING (true);
CREATE POLICY "Captains manage team players" ON tournament_players FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'tournament_manager'))
    OR EXISTS (
      SELECT 1 FROM tournament_roles 
      WHERE user_id = auth.uid() 
      AND tournament_id = tournament_players.tournament_id
      AND role = 'team_captain'
      AND team_id = tournament_players.team_id
    )
  );

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_player_database_user_id ON player_database(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_roles_user_id ON tournament_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_roles_tournament_id ON tournament_roles(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_players_tournament_id ON tournament_players(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_players_player_id ON tournament_players(player_id);

-- 8. Create function to register user and create player profile
CREATE OR REPLACE FUNCTION register_player(
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_handicap DECIMAL DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_player_id INTEGER;
BEGIN
  -- Create user account
  INSERT INTO users (email, full_name, phone, role)
  VALUES (p_email, p_full_name, p_phone, 'player')
  RETURNING id INTO v_user_id;
  
  -- Create player profile
  INSERT INTO player_database (user_id, full_name, email, phone, handicap)
  VALUES (v_user_id, p_full_name, p_email, p_phone, p_handicap)
  RETURNING id INTO v_player_id;
  
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'player_id', v_player_id,
    'message', 'Player registered successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Enhanced multi-tournament system created!' as message,
       'Features: Player database, Role-based access, Self-registration' as features;
