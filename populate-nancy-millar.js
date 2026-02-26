require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateNancyMillar() {
  console.log('🏌️ Populating Nancy Millar Trophy data...\n');

  try {
    // 1. Create tournament
    console.log('📋 Creating Nancy Millar Trophy tournament...');
    const { data: tournament, error: tourError } = await supabase
      .from('tournaments')
      .upsert({
        id: 3,
        name: 'Nancy Millar Trophy 2026',
        slug: 'nancy-millar-2026',
        description: 'Annual Nancy Millar Trophy - Ladies Golf Championship',
        start_date: '2026-09-15',
        end_date: '2026-09-17',
        status: 'upcoming',
        format: 'stroke_play'
      }, { onConflict: 'id' })
      .select()
      .single();

    if (tourError) throw tourError;
    console.log('✅ Tournament created\n');

    // 2. Create tournament settings
    console.log('📋 Creating tournament settings...');
    const { error: settingsError } = await supabase
      .from('tournament_settings')
      .upsert({
        tournament_id: 3,
        has_divisions: false,
        divisions: [],
        num_teams: 24,
        points_for_win: 1,
        points_for_draw: 0,
        points_for_loss: 0,
        total_rounds: 3,
        sessions_per_round: 1,
        show_divisions_separately: false,
        show_holes_won: false,
        show_strokes_differential: true
      }, { onConflict: 'tournament_id' });

    if (settingsError) throw settingsError;
    console.log('✅ Settings created\n');

    // 3. Create teams (individual players)
    console.log('📋 Creating players...');
    const players = [
      { id: 301, name: 'Sarah Johnson', color: '#FF6B6B' },
      { id: 302, name: 'Mary Williams', color: '#4ECDC4' },
      { id: 303, name: 'Patricia Brown', color: '#45B7D1' },
      { id: 304, name: 'Jennifer Davis', color: '#96CEB4' },
      { id: 305, name: 'Linda Miller', color: '#FFEAA7' },
      { id: 306, name: 'Elizabeth Wilson', color: '#DFE6E9' },
      { id: 307, name: 'Barbara Moore', color: '#74B9FF' },
      { id: 308, name: 'Susan Taylor', color: '#A29BFE' },
      { id: 309, name: 'Jessica Anderson', color: '#FD79A8' },
      { id: 310, name: 'Karen Thomas', color: '#FDCB6E' },
      { id: 311, name: 'Nancy Jackson', color: '#6C5CE7' },
      { id: 312, name: 'Betty White', color: '#00B894' },
      { id: 313, name: 'Helen Harris', color: '#E17055' },
      { id: 314, name: 'Sandra Martin', color: '#0984E3' },
      { id: 315, name: 'Donna Thompson', color: '#00CEC9' },
      { id: 316, name: 'Carol Garcia', color: '#B2BEC3' },
      { id: 317, name: 'Ruth Martinez', color: '#FF7675' },
      { id: 318, name: 'Sharon Robinson', color: '#55EFC4' },
      { id: 319, name: 'Michelle Clark', color: '#81ECEC' },
      { id: 320, name: 'Laura Rodriguez', color: '#FAB1A0' },
      { id: 321, name: 'Dorothy Lewis', color: '#FD79A8' },
      { id: 322, name: 'Kimberly Lee', color: '#FDCB6E' },
      { id: 323, name: 'Emily Walker', color: '#E17055' },
      { id: 324, name: 'Deborah Hall', color: '#74B9FF' }
    ];

    const teamsToInsert = players.map(p => ({
      id: p.id,
      name: p.name,
      division: null,
      color: p.color,
      description: 'Nancy Millar Trophy Participant',
      tournament_id: 3
    }));

    const { error: teamsError } = await supabase
      .from('teams')
      .upsert(teamsToInsert, { onConflict: 'id' });

    if (teamsError) throw teamsError;
    console.log(`✅ Created ${teamsToInsert.length} players\n`);

    // 4. Create player records
    console.log('📋 Creating player records...');
    const playersToInsert = players.map((p, idx) => ({
      id: p.id,
      name: p.name,
      team_id: p.id,
      handicap: 10 + (idx % 20),
      tournament_id: 3
    }));

    const { error: playersError } = await supabase
      .from('players')
      .upsert(playersToInsert, { onConflict: 'id' });

    if (playersError) throw playersError;
    console.log(`✅ Created ${playersToInsert.length} player records\n`);

    // 5. Initialize scores
    console.log('📋 Initializing scores...');
    const scoresToInsert = players.map(p => ({
      team_id: p.id,
      division: null,
      points: 0,
      matches_played: 0,
      matches_won: 0,
      matches_lost: 0,
      matches_halved: 0,
      holes_won: 0,
      holes_lost: 0,
      total_strokes: 0,
      strokes_differential: 0,
      current_round: 0,
      position: null,
      position_change: 'same',
      tournament_id: 3
    }));

    const { error: scoresError } = await supabase
      .from('scores')
      .upsert(scoresToInsert, { onConflict: 'team_id,tournament_id' });

    if (scoresError) throw scoresError;
    console.log(`✅ Initialized scores for ${scoresToInsert.length} players\n`);

    console.log('🎉 Nancy Millar Trophy data populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 tournament (Nancy Millar Trophy 2026)`);
    console.log(`   - ${teamsToInsert.length} players`);
    console.log(`   - ${scoresToInsert.length} score records`);
    console.log('\n✅ Tournament ready!');
    console.log('🔗 Access at: /tournaments/nancy-millar-2026');

  } catch (error) {
    console.error('\n❌ Population failed:', error.message);
    process.exit(1);
  }
}

populateNancyMillar();
