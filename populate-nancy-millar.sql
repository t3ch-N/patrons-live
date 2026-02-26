-- Populate Nancy Millar Trophy 2026 Tournament Data

-- 1. Create tournament
INSERT INTO tournaments (id, name, slug, description, start_date, end_date, status, format)
VALUES (
  3,
  'Nancy Millar Trophy 2026',
  'nancy-millar-2026',
  'Annual Nancy Millar Trophy - Ladies Golf Championship',
  '2026-09-15',
  '2026-09-17',
  'upcoming',
  'stroke_play'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status,
  format = EXCLUDED.format;

-- 2. Create tournament settings
INSERT INTO tournament_settings (tournament_id, has_divisions, divisions, num_teams, points_for_win, points_for_draw, points_for_loss, total_rounds, sessions_per_round, show_divisions_separately, show_holes_won, show_strokes_differential)
VALUES (
  3,
  false,
  ARRAY[]::TEXT[],
  24,
  1,
  0,
  0,
  3,
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
(301, 'Sarah Johnson', NULL, '#FF6B6B', 'Nancy Millar Trophy Participant', 3),
(302, 'Mary Williams', NULL, '#4ECDC4', 'Nancy Millar Trophy Participant', 3),
(303, 'Patricia Brown', NULL, '#45B7D1', 'Nancy Millar Trophy Participant', 3),
(304, 'Jennifer Davis', NULL, '#96CEB4', 'Nancy Millar Trophy Participant', 3),
(305, 'Linda Miller', NULL, '#FFEAA7', 'Nancy Millar Trophy Participant', 3),
(306, 'Elizabeth Wilson', NULL, '#DFE6E9', 'Nancy Millar Trophy Participant', 3),
(307, 'Barbara Moore', NULL, '#74B9FF', 'Nancy Millar Trophy Participant', 3),
(308, 'Susan Taylor', NULL, '#A29BFE', 'Nancy Millar Trophy Participant', 3),
(309, 'Jessica Anderson', NULL, '#FD79A8', 'Nancy Millar Trophy Participant', 3),
(310, 'Karen Thomas', NULL, '#FDCB6E', 'Nancy Millar Trophy Participant', 3),
(311, 'Nancy Jackson', NULL, '#6C5CE7', 'Nancy Millar Trophy Participant', 3),
(312, 'Betty White', NULL, '#00B894', 'Nancy Millar Trophy Participant', 3),
(313, 'Helen Harris', NULL, '#E17055', 'Nancy Millar Trophy Participant', 3),
(314, 'Sandra Martin', NULL, '#0984E3', 'Nancy Millar Trophy Participant', 3),
(315, 'Donna Thompson', NULL, '#00CEC9', 'Nancy Millar Trophy Participant', 3),
(316, 'Carol Garcia', NULL, '#B2BEC3', 'Nancy Millar Trophy Participant', 3),
(317, 'Ruth Martinez', NULL, '#FF7675', 'Nancy Millar Trophy Participant', 3),
(318, 'Sharon Robinson', NULL, '#55EFC4', 'Nancy Millar Trophy Participant', 3),
(319, 'Michelle Clark', NULL, '#81ECEC', 'Nancy Millar Trophy Participant', 3),
(320, 'Laura Rodriguez', NULL, '#FAB1A0', 'Nancy Millar Trophy Participant', 3),
(321, 'Dorothy Lewis', NULL, '#FD79A8', 'Nancy Millar Trophy Participant', 3),
(322, 'Kimberly Lee', NULL, '#FDCB6E', 'Nancy Millar Trophy Participant', 3),
(323, 'Emily Walker', NULL, '#E17055', 'Nancy Millar Trophy Participant', 3),
(324, 'Deborah Hall', NULL, '#74B9FF', 'Nancy Millar Trophy Participant', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color;

-- 4. Create players
INSERT INTO players (id, name, team_id, handicap, tournament_id) VALUES
(301, 'Sarah Johnson', 301, 10, 3),
(302, 'Mary Williams', 302, 11, 3),
(303, 'Patricia Brown', 303, 12, 3),
(304, 'Jennifer Davis', 304, 13, 3),
(305, 'Linda Miller', 305, 14, 3),
(306, 'Elizabeth Wilson', 306, 15, 3),
(307, 'Barbara Moore', 307, 16, 3),
(308, 'Susan Taylor', 308, 17, 3),
(309, 'Jessica Anderson', 309, 18, 3),
(310, 'Karen Thomas', 310, 19, 3),
(311, 'Nancy Jackson', 311, 20, 3),
(312, 'Betty White', 312, 21, 3),
(313, 'Helen Harris', 313, 22, 3),
(314, 'Sandra Martin', 314, 23, 3),
(315, 'Donna Thompson', 315, 24, 3),
(316, 'Carol Garcia', 316, 25, 3),
(317, 'Ruth Martinez', 317, 26, 3),
(318, 'Sharon Robinson', 318, 27, 3),
(319, 'Michelle Clark', 319, 28, 3),
(320, 'Laura Rodriguez', 320, 29, 3),
(321, 'Dorothy Lewis', 321, 10, 3),
(322, 'Kimberly Lee', 322, 11, 3),
(323, 'Emily Walker', 323, 12, 3),
(324, 'Deborah Hall', 324, 13, 3)
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
  3
FROM teams
WHERE tournament_id = 3
ON CONFLICT (team_id, tournament_id) DO NOTHING;

-- Success message
SELECT 'Nancy Millar Trophy 2026 data populated successfully!' as message;
