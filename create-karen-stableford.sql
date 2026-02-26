-- Create Karen Stableford 2026 Tournament
-- Complete setup with teams, players, settings, and matches

-- 1. Create tournament
INSERT INTO tournaments (id, name, slug, description, start_date, end_date, status, format)
VALUES (
  4,
  'Karen Stableford 2026',
  'karen-stableford-2026',
  'Annual Karen Stableford Tournament - Individual Stableford Competition',
  '2026-10-15',
  '2026-10-17',
  'upcoming',
  'stableford'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status,
  format = EXCLUDED.format;

-- 2. Create tournament settings (no divisions, individual competition)
INSERT INTO tournament_settings (
  tournament_id, 
  has_divisions, 
  divisions, 
  num_teams, 
  points_for_win, 
  points_for_draw, 
  points_for_loss, 
  total_rounds, 
  sessions_per_round, 
  show_divisions_separately, 
  show_holes_won, 
  show_strokes_differential
)
VALUES (
  4,
  false,
  ARRAY[]::TEXT[],
  30,
  3,
  1,
  0,
  2,
  1,
  false,
  false,
  true
)
ON CONFLICT (tournament_id) DO UPDATE SET
  has_divisions = EXCLUDED.has_divisions,
  num_teams = EXCLUDED.num_teams,
  points_for_win = EXCLUDED.points_for_win;

-- 3. Create teams (players)
INSERT INTO teams (id, name, division, color, description, tournament_id) VALUES
(401, 'Alice Cooper', NULL, '#FF6B6B', 'Karen Stableford Participant', 4),
(402, 'Betty Anderson', NULL, '#4ECDC4', 'Karen Stableford Participant', 4),
(403, 'Catherine Brown', NULL, '#45B7D1', 'Karen Stableford Participant', 4),
(404, 'Diana Clark', NULL, '#96CEB4', 'Karen Stableford Participant', 4),
(405, 'Emma Davis', NULL, '#FFEAA7', 'Karen Stableford Participant', 4),
(406, 'Fiona Evans', NULL, '#DFE6E9', 'Karen Stableford Participant', 4),
(407, 'Grace Foster', NULL, '#74B9FF', 'Karen Stableford Participant', 4),
(408, 'Hannah Green', NULL, '#A29BFE', 'Karen Stableford Participant', 4),
(409, 'Isabel Harris', NULL, '#FD79A8', 'Karen Stableford Participant', 4),
(410, 'Julia Hill', NULL, '#FDCB6E', 'Karen Stableford Participant', 4),
(411, 'Kate Irving', NULL, '#6C5CE7', 'Karen Stableford Participant', 4),
(412, 'Laura James', NULL, '#00B894', 'Karen Stableford Participant', 4),
(413, 'Monica King', NULL, '#E17055', 'Karen Stableford Participant', 4),
(414, 'Nancy Lee', NULL, '#0984E3', 'Karen Stableford Participant', 4),
(415, 'Olivia Martin', NULL, '#00CEC9', 'Karen Stableford Participant', 4),
(416, 'Patricia Moore', NULL, '#B2BEC3', 'Karen Stableford Participant', 4),
(417, 'Quinn Nelson', NULL, '#FF7675', 'Karen Stableford Participant', 4),
(418, 'Rachel Owen', NULL, '#55EFC4', 'Karen Stableford Participant', 4),
(419, 'Sophie Parker', NULL, '#81ECEC', 'Karen Stableford Participant', 4),
(420, 'Teresa Quinn', NULL, '#FAB1A0', 'Karen Stableford Participant', 4),
(421, 'Uma Roberts', NULL, '#FD79A8', 'Karen Stableford Participant', 4),
(422, 'Victoria Scott', NULL, '#FDCB6E', 'Karen Stableford Participant', 4),
(423, 'Wendy Taylor', NULL, '#E17055', 'Karen Stableford Participant', 4),
(424, 'Xena Turner', NULL, '#74B9FF', 'Karen Stableford Participant', 4),
(425, 'Yvonne Walker', NULL, '#A29BFE', 'Karen Stableford Participant', 4),
(426, 'Zara White', NULL, '#FF6B6B', 'Karen Stableford Participant', 4),
(427, 'Amy Wilson', NULL, '#4ECDC4', 'Karen Stableford Participant', 4),
(428, 'Brenda Young', NULL, '#45B7D1', 'Karen Stableford Participant', 4),
(429, 'Claire Adams', NULL, '#96CEB4', 'Karen Stableford Participant', 4),
(430, 'Debra Baker', NULL, '#FFEAA7', 'Karen Stableford Participant', 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color;

-- 4. Create players
INSERT INTO players (id, name, team_id, handicap, tournament_id) VALUES
(401, 'Alice Cooper', 401, 12, 4),
(402, 'Betty Anderson', 402, 14, 4),
(403, 'Catherine Brown', 403, 16, 4),
(404, 'Diana Clark', 404, 18, 4),
(405, 'Emma Davis', 405, 20, 4),
(406, 'Fiona Evans', 406, 22, 4),
(407, 'Grace Foster', 407, 24, 4),
(408, 'Hannah Green', 408, 26, 4),
(409, 'Isabel Harris', 409, 28, 4),
(410, 'Julia Hill', 410, 15, 4),
(411, 'Kate Irving', 411, 17, 4),
(412, 'Laura James', 412, 19, 4),
(413, 'Monica King', 413, 21, 4),
(414, 'Nancy Lee', 414, 23, 4),
(415, 'Olivia Martin', 415, 25, 4),
(416, 'Patricia Moore', 416, 27, 4),
(417, 'Quinn Nelson', 417, 13, 4),
(418, 'Rachel Owen', 418, 15, 4),
(419, 'Sophie Parker', 419, 17, 4),
(420, 'Teresa Quinn', 420, 19, 4),
(421, 'Uma Roberts', 421, 21, 4),
(422, 'Victoria Scott', 422, 23, 4),
(423, 'Wendy Taylor', 423, 25, 4),
(424, 'Xena Turner', 424, 14, 4),
(425, 'Yvonne Walker', 425, 16, 4),
(426, 'Zara White', 426, 18, 4),
(427, 'Amy Wilson', 427, 20, 4),
(428, 'Brenda Young', 428, 22, 4),
(429, 'Claire Adams', 429, 24, 4),
(430, 'Debra Baker', 430, 26, 4)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  handicap = EXCLUDED.handicap;

-- 5. Initialize scores
INSERT INTO scores (team_id, division, points, matches_played, matches_won, matches_lost, matches_halved, holes_won, holes_lost, total_strokes, strokes_differential, current_round, position, position_change, tournament_id)
SELECT 
  id,
  NULL,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  NULL,
  'same',
  4
FROM teams
WHERE tournament_id = 4
ON CONFLICT (team_id, tournament_id) DO NOTHING;

-- Success message
SELECT 'Karen Stableford 2026 tournament created successfully!' as message,
       '30 players added' as players,
       'Access at: /tournaments/karen-stableford-2026' as url;
