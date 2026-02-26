-- Tournament Registration and Payment System

-- 1. Create registration_types table (Individual, 4-Ball, etc.)
CREATE TABLE IF NOT EXISTS registration_types (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Individual', '4-Ball', etc.
  description TEXT,
  base_price DECIMAL NOT NULL,
  early_bird_price DECIMAL,
  early_bird_deadline TIMESTAMP,
  max_participants INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create tournament_registrations table
CREATE TABLE IF NOT EXISTS tournament_registrations (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
  registration_type_id INTEGER REFERENCES registration_types(id) ON DELETE CASCADE,
  player_id INTEGER REFERENCES player_database(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  amount_paid DECIMAL NOT NULL,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT DEFAULT 'mpesa',
  mpesa_receipt_number TEXT,
  mpesa_transaction_id TEXT,
  checkout_request_id TEXT,
  registered_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  additional_players JSONB, -- For 4-Ball registrations
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create mpesa_transactions table for tracking
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER REFERENCES tournament_registrations(id) ON DELETE CASCADE,
  merchant_request_id TEXT,
  checkout_request_id TEXT UNIQUE,
  result_code TEXT,
  result_desc TEXT,
  amount DECIMAL,
  mpesa_receipt_number TEXT,
  transaction_date TIMESTAMP,
  phone_number TEXT,
  callback_received_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Add payment configuration to tournaments
ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS payment_paybill TEXT,
  ADD COLUMN IF NOT EXISTS payment_account TEXT,
  ADD COLUMN IF NOT EXISTS payment_enabled BOOLEAN DEFAULT false;

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_tournament_id ON tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_player_id ON tournament_registrations(player_id);
CREATE INDEX IF NOT EXISTS idx_tournament_registrations_payment_status ON tournament_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_checkout_request_id ON mpesa_transactions(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_registration_types_tournament_id ON registration_types(tournament_id);

-- 6. Create RLS policies
ALTER TABLE registration_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read registration_types" ON registration_types FOR SELECT USING (true);
CREATE POLICY "Admins manage registration_types" ON registration_types FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'tournament_manager')
  ));

ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read own registrations" ON tournament_registrations FOR SELECT 
  USING (email = (SELECT email FROM users WHERE id = auth.uid()) OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'tournament_manager')
  ));
CREATE POLICY "Anyone can register" ON tournament_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins update registrations" ON tournament_registrations FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'tournament_manager')
  ));

ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read mpesa_transactions" ON mpesa_transactions FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'tournament_manager')
  ));
CREATE POLICY "System insert mpesa_transactions" ON mpesa_transactions FOR INSERT WITH CHECK (true);

-- Success message
SELECT 'Tournament registration and M-Pesa payment system created!' as message;
