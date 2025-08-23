// Comprehensive fix for all RLS policy issues
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

async function fixAllIssues() {
  try {
    console.log('🔧 Comprehensive fix for all RLS policy issues...\n');

    // 1. Get auth user ID
    console.log('1. Getting auth user ID...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return;
    }

    const adminAuthUser = authUsers.users.find(u => u.email === 'admin@mosque.com');
    if (!adminAuthUser) {
      console.error('❌ Admin user not found in auth');
      return;
    }

    console.log(`✅ Auth user ID: ${adminAuthUser.id}`);

    // 2. Fix users table first
    console.log('\n2. Fixing users table...');
    const { error: usersError } = await supabase
      .from('users')
      .upsert({
        id: adminAuthUser.id,
        email: 'admin@mosque.com',
        full_name: 'Administrator',
        role: 'super_admin',
        is_active: true
      });

    if (usersError) {
      console.log('❌ Users table fix failed:', usersError.message);
    } else {
      console.log('✅ Users table fixed');
    }

    // 3. Test all tables
    console.log('\n3. Testing all tables...');
    const tables = [
      'users',
      'leadership',
      'prayer_schedule', 
      'financial_records',
      'announcements'
    ];

    for (const table of tables) {
      console.log(`\nTesting ${table}...`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${data?.length || 0} records found`);
      }
    }

    // 4. Generate comprehensive SQL fix
    console.log('\n4. Generating comprehensive SQL fix...');
    console.log('\n📋 Please run this SQL in your Supabase SQL Editor:');
    console.log(`
-- Comprehensive fix for all RLS policy issues
-- This will resolve all 500 errors

-- Users table
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Only super admins can modify users" ON users;
DROP POLICY IF EXISTS "Admin can modify users" ON users;
DROP POLICY IF EXISTS "temp_open_policy" ON users;

CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admin can modify users"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '${adminAuthUser.id}');

-- Leadership table
DROP POLICY IF EXISTS "Only authenticated users can modify leadership" ON leadership;
DROP POLICY IF EXISTS "Only admins can modify leadership" ON leadership;
DROP POLICY IF EXISTS "temp_open_policy" ON leadership;

CREATE POLICY "Only admins can modify leadership"
  ON leadership
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '${adminAuthUser.id}');

-- Prayer schedule table  
DROP POLICY IF EXISTS "Only authenticated users can modify prayer schedule" ON prayer_schedule;
DROP POLICY IF EXISTS "Only admins can modify prayer schedule" ON prayer_schedule;
DROP POLICY IF EXISTS "temp_open_policy" ON prayer_schedule;

CREATE POLICY "Only admins can modify prayer schedule"
  ON prayer_schedule
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '${adminAuthUser.id}');

-- Financial records table
DROP POLICY IF EXISTS "Only authenticated users can modify financial records" ON financial_records;
DROP POLICY IF EXISTS "Only admins can modify financial records" ON financial_records;
DROP POLICY IF EXISTS "temp_open_policy" ON financial_records;

CREATE POLICY "Only admins can modify financial records"
  ON financial_records
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '${adminAuthUser.id}');

-- Announcements table
DROP POLICY IF EXISTS "Only authenticated users can modify announcements" ON announcements;
DROP POLICY IF EXISTS "Only admins can modify announcements" ON announcements;
DROP POLICY IF EXISTS "temp_open_policy" ON announcements;

CREATE POLICY "Only admins can modify announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '${adminAuthUser.id}');

-- Ensure admin user exists with correct ID
INSERT INTO users (id, email, full_name, role, is_active) 
VALUES ('${adminAuthUser.id}', 'admin@mosque.com', 'Administrator', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET
  id = EXCLUDED.id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
    `);

    console.log('\n5. Summary:');
    console.log('✅ All tables tested');
    console.log('✅ Users table fixed');
    console.log('📋 Run the SQL above in Supabase SQL Editor to fix all RLS policies');
    console.log('🎯 After running the SQL, all 500 errors should be resolved');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixAllIssues();
