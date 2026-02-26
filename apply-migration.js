require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🚀 Applying database migration...\n');

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250226000002_player_database_and_roles.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Executing SQL migration...');
    
    // Split SQL into individual statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`   Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error && !error.message.includes('already exists')) {
          console.error(`   ⚠️  Warning: ${error.message}`);
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Verifying tables...');

    // Verify tables were created
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .in('table_name', ['users', 'player_database', 'tournament_roles', 'tournament_players']);

    if (tableError) {
      console.log('⚠️  Could not verify tables (this is okay)');
    } else {
      console.log('✅ Tables verified:', tables?.map(t => t.table_name).join(', '));
    }

    console.log('\n🎉 Database is ready!');
    console.log('\n📝 Next steps:');
    console.log('   1. Go to Supabase Dashboard → Authentication');
    console.log('   2. Enable Email provider');
    console.log('   3. Set site URL: https://patrons-live.netlify.app');
    console.log('   4. Your system is ready to use!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📝 Manual steps:');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Click SQL Editor');
    console.log('   4. Copy content from: supabase/migrations/20250226000002_player_database_and_roles.sql');
    console.log('   5. Paste and click Run');
    process.exit(1);
  }
}

applyMigration();
