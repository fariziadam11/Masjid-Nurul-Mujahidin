// Database check and diagnosis script
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  try {
    console.log('🔍 Checking database setup...\n');

    // 1. Check if tables exist
    console.log('1. Checking table existence...');
    
    const tables = ['leadership', 'prayer_schedule', 'financial_records', 'announcements', 'users'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: Exists`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`);
      }
    }

    console.log('\n2. Checking RLS policies...');
    
    // 2. Check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies');
    
    if (policiesError) {
      console.log('❌ Could not check policies:', policiesError.message);
    } else {
      console.log('✅ RLS policies checked');
    }

    // 3. Check users table
    console.log('\n3. Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log(`✅ Users table: ${users?.length || 0} users found`);
      if (users && users.length > 0) {
        users.forEach(user => {
          console.log(`   - ${user.email} (${user.role}, active: ${user.is_active})`);
        });
      }
    }

    // 4. Test leadership table access
    console.log('\n4. Testing leadership table access...');
    const { data: leadership, error: leadershipError } = await supabase
      .from('leadership')
      .select('*')
      .limit(5);
    
    if (leadershipError) {
      console.log('❌ Leadership table error:', leadershipError.message);
      console.log('   This is likely the cause of the 500 error');
    } else {
      console.log(`✅ Leadership table: ${leadership?.length || 0} records found`);
    }

    // 5. Check if admin user exists in auth
    console.log('\n5. Checking auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.log('❌ Auth users error:', authError.message);
    } else {
      const adminUser = authUsers.users.find(u => u.email === 'admin@mosque.com');
      if (adminUser) {
        console.log('✅ Admin user exists in auth');
        console.log(`   - ID: ${adminUser.id}`);
        console.log(`   - Email confirmed: ${adminUser.email_confirmed_at ? 'Yes' : 'No'}`);
      } else {
        console.log('❌ Admin user not found in auth');
      }
    }

    console.log('\n📋 Summary:');
    console.log('If you see any ❌ errors above, those need to be fixed.');
    console.log('The most common issues are:');
    console.log('1. Tables not created - Run the migration files');
    console.log('2. RLS policies not set - Run the migration files');
    console.log('3. Admin user not in auth - Create user manually in Supabase dashboard');
    console.log('4. Admin user not in users table - Run setup-admin.js');

  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();
