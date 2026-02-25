// Migrate JSON data to Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Starting migration...\n');

  try {
    // 1. Create tournament
    console.log('📋 Creating tournament...');
    const { data: tournament, error: tourError } = await supabase
      .from('tournaments')
      .upsert({
        id: 1,
        name: 'Patrons Cup 2026',
        slug: 'patrons-cup-2026',
        description: 'Annual Patrons Cup Tournament at Muthaiga Golf Club',
        start_date: '2026-08-21',
        end_date: '2026-08-23',
        status: 'active',
        format: 'patrons_cup'
      }, { onConflict: 'id' })
      .select()
      .single();

    if (tourError) throw tourError;
    console.log('✅ Tournament created\n');

    // 2. Migrate teams
    console.log('📋 Migrating teams...');
    const teamsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/teams.json'), 'utf8'));
    
    const teamsToInsert = teamsData.map(team => ({
      id: team.id,
      name: team.name,
      division: team.division,
      color: team.color,
      logo: team.logo,
      description: team.description,
      seed: team.seed,
      total_players: team.totalPlayers,
      max_points_available: team.maxPointsAvailable,
      session_points: team.sessionPoints,
      players_per_session: team.playersPerSession,
      resting_per_session: team.restingPerSession,
      points_per_match: team.pointsPerMatch,
      tournament_id: 1
    }));

    const { error: teamsError } = await supabase
      .from('teams')
      .upsert(teamsToInsert, { onConflict: 'id' });

    if (teamsError) throw teamsError;
    console.log(`✅ Migrated ${teamsToInsert.length} teams\n`);

    // 3. Migrate players
    console.log('📋 Migrating players...');
    const playersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/players.json'), 'utf8'));
    
    const playersToInsert = playersData.map(player => ({
      id: player.id,
      name: player.name,
      team_id: player.teamId,
      handicap: player.handicap,
      email: player.email,
      phone: player.phone,
      is_pro: player.isPro || false,
      is_ex_officio: player.isExOfficio || false,
      is_junior: player.isJunior || false,
      tournament_id: 1
    }));

    const { error: playersError } = await supabase
      .from('players')
      .upsert(playersToInsert, { onConflict: 'id' });

    if (playersError) throw playersError;
    console.log(`✅ Migrated ${playersToInsert.length} players\n`);

    // 4. Initialize scores
    console.log('📋 Initializing scores...');
    const scoresToInsert = teamsData.map(team => ({
      team_id: team.id,
      division: team.division,
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
      tournament_id: 1
    }));

    const { error: scoresError } = await supabase
      .from('scores')
      .upsert(scoresToInsert, { onConflict: 'team_id,tournament_id' });

    if (scoresError) throw scoresError;
    console.log(`✅ Initialized scores for ${scoresToInsert.length} teams\n`);

    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 tournament`);
    console.log(`   - ${teamsToInsert.length} teams`);
    console.log(`   - ${playersToInsert.length} players`);
    console.log(`   - ${scoresToInsert.length} score records`);
    console.log('\n✅ Your database is ready!');
    console.log('🚀 Run: npm run dev');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
