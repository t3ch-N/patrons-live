-- Add site_content table for main website CMS
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  hero_title TEXT DEFAULT 'MyGolfHub Africa',
  hero_subtitle TEXT DEFAULT 'Your home for golf tournaments in Kenya',
  about_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  social_facebook TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default content
INSERT INTO site_content (hero_title, hero_subtitle, about_text)
VALUES (
  'MyGolfHub Africa',
  'Your home for golf tournaments in Kenya',
  'MyGolfHub Africa is the premier platform for golf tournaments across Kenya. We provide live scoring, tournament management, and comprehensive coverage of all major golf events.'
)
ON CONFLICT DO NOTHING;

-- Add RLS policies
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Admin write site_content" ON site_content FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
