-- Enhanced Player Database with Clubs and Additional Fields

-- 1. Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create club_managers table (links users to clubs they manage)
CREATE TABLE IF NOT EXISTS club_managers (
  id SERIAL PRIMARY KEY,
  club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- 3. Add club_manager role to users
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL;

-- 4. Update player_database with additional fields
ALTER TABLE player_database
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT,
  ADD COLUMN IF NOT EXISTS medical_conditions TEXT,
  ADD COLUMN IF NOT EXISTS dietary_requirements TEXT,
  ADD COLUMN IF NOT EXISTS shirt_size TEXT,
  ADD COLUMN IF NOT EXISTS travel_arrangements TEXT,
  ADD COLUMN IF NOT EXISTS accommodation_requirements TEXT,
  ADD COLUMN IF NOT EXISTS special_requests TEXT,
  ADD COLUMN IF NOT EXISTS club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL;

-- 5. Update club_name to reference clubs table (keep as text for backward compatibility)
-- Players can still have club_name as text, but club_id links to actual club entity

-- 6. Create RLS policies for clubs
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read clubs" ON clubs FOR SELECT USING (true);
CREATE POLICY "Admins manage clubs" ON clubs FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- 7. Create RLS policies for club_managers
ALTER TABLE club_managers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read club_managers" ON club_managers FOR SELECT USING (true);
CREATE POLICY "Admins manage club_managers" ON club_managers FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- 8. Create indexes
CREATE INDEX IF NOT EXISTS idx_clubs_name ON clubs(name);
CREATE INDEX IF NOT EXISTS idx_club_managers_club_id ON club_managers(club_id);
CREATE INDEX IF NOT EXISTS idx_club_managers_user_id ON club_managers(user_id);
CREATE INDEX IF NOT EXISTS idx_player_database_club_id ON player_database(club_id);
CREATE INDEX IF NOT EXISTS idx_users_club_id ON users(club_id);

-- 9. Create function for club manager to register players
CREATE OR REPLACE FUNCTION register_player_by_club_manager(
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_club_id INTEGER,
  p_handicap DECIMAL DEFAULT NULL,
  p_emergency_contact_name TEXT DEFAULT NULL,
  p_emergency_contact_phone TEXT DEFAULT NULL,
  p_medical_conditions TEXT DEFAULT NULL,
  p_dietary_requirements TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_player_id INTEGER;
  v_manager_club_id INTEGER;
BEGIN
  -- Verify caller is a club manager for this club
  SELECT club_id INTO v_manager_club_id
  FROM club_managers
  WHERE user_id = auth.uid() AND club_id = p_club_id;
  
  IF v_manager_club_id IS NULL THEN
    RAISE EXCEPTION 'Not authorized to register players for this club';
  END IF;
  
  -- Create user account
  INSERT INTO users (email, full_name, phone, role, club_id)
  VALUES (p_email, p_full_name, p_phone, 'player', p_club_id)
  RETURNING id INTO v_user_id;
  
  -- Create player profile
  INSERT INTO player_database (
    user_id, full_name, email, phone, handicap, club_id,
    emergency_contact_name, emergency_contact_phone,
    medical_conditions, dietary_requirements
  )
  VALUES (
    v_user_id, p_full_name, p_email, p_phone, p_handicap, p_club_id,
    p_emergency_contact_name, p_emergency_contact_phone,
    p_medical_conditions, p_dietary_requirements
  )
  RETURNING id INTO v_player_id;
  
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'player_id', v_player_id,
    'message', 'Player registered successfully by club manager'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Update existing register_player function to include new fields
CREATE OR REPLACE FUNCTION register_player(
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_handicap DECIMAL DEFAULT NULL,
  p_club_id INTEGER DEFAULT NULL,
  p_emergency_contact_name TEXT DEFAULT NULL,
  p_emergency_contact_phone TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_player_id INTEGER;
BEGIN
  -- Create user account
  INSERT INTO users (email, full_name, phone, role, club_id)
  VALUES (p_email, p_full_name, p_phone, 'player', p_club_id)
  RETURNING id INTO v_user_id;
  
  -- Create player profile
  INSERT INTO player_database (
    user_id, full_name, email, phone, handicap, club_id,
    emergency_contact_name, emergency_contact_phone
  )
  VALUES (
    v_user_id, p_full_name, p_email, p_phone, p_handicap, p_club_id,
    p_emergency_contact_name, p_emergency_contact_phone
  )
  RETURNING id INTO v_player_id;
  
  RETURN jsonb_build_object(
    'user_id', v_user_id,
    'player_id', v_player_id,
    'message', 'Player registered successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Clubs and enhanced player fields added!' as message,
       'Features: Club entities, Club managers, Emergency contacts, Medical info, Dietary requirements, Travel arrangements' as features;
