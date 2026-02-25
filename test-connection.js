// Test Supabase Connection
// Run with: node test-connection.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✓ Present' : '✗ Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check tournaments table
    console.log('\n📋 Test 1: Checking tournaments table...');
    const { data: tournaments, error: tourError } = await supabase
      .from('tournaments')
      .select('*')
      .limit(5);
    
    if (tourError) {
      console.log('❌ Tournaments table error:', tourError.message);
      console.log('   → Run the migration SQL in Supabase Dashboard');
    } else {
      console.log('✅ Tournaments table exists');
      console.log(`   Found ${tournaments.length} tournament(s)`);
    }

    // Test 2: Check teams table
    console.log('\n📋 Test 2: Checking teams table...');
    const { data: teams, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .limit(5);
    
    if (teamError) {
      console.log('❌ Teams table error:', teamError.message);
    } else {
      console.log('✅ Teams table exists');
      console.log(`   Found ${teams.length} team(s)`);
    }

    // Test 3: Check players table
    console.log('\n📋 Test 3: Checking players table...');
    const { data: players, error: playerError } = await supabase
      .from('players')
      .select('*')
      .limit(5);
    
    if (playerError) {
      console.log('❌ Players table error:', playerError.message);
    } else {
      console.log('✅ Players table exists');
      console.log(`   Found ${players.length} player(s)`);
    }

    // Test 4: Check matches table
    console.log('\n📋 Test 4: Checking matches table...');
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .limit(5);
    
    if (matchError) {
      console.log('❌ Matches table error:', matchError.message);
    } else {
      console.log('✅ Matches table exists');
      console.log(`   Found ${matches.length} match(es)`);
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    const hasErrors = tourError || teamError || playerError || matchError;
    
    if (hasErrors) {
      console.log('⚠️  Some tables are missing or have errors');
      console.log('\n📝 Next steps:');
      console.log('1. Go to: https://supabase.com/dashboard/project/kcziaodnfwoinssxiipr');
      console.log('2. Open SQL Editor');
      console.log('3. Run the migration from: supabase/migrations/20250101000000_multi_tournament_support.sql');
    } else {
      console.log('✅ All tables exist! Your database is ready.');
      console.log('\n🚀 You can now run: npm run dev');
    }
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
  }
}

testConnection();
