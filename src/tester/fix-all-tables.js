// Fix all tables RLS policies
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

async function fixAllTables() {
  try {
    console.log('🔧 Fixing RLS policies for all tables...\n');

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

    // 2. Update users table with correct ID
    console.log('\n2. Updating users table...');
    const { error: updateError } = await supabase
      .from('users')
      .upsert({
        id: adminAuthUser.id,
        email: 'admin@mosque.com',
        full_name: 'Administrator',
        role: 'super_admin',
        is_active: true
      });

    if (updateError) {
      console.log('❌ Update error:', updateError.message);
      return;
    } else {
      console.log('✅ User record updated');
    }

    // 3. Test all tables
    console.log('\n3. Testing all tables...');
    const tables = [
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

    // 4. Create SQL to fix all policies
    console.log('\n4. Generating SQL to fix all policies...');
    console.log('\n📋 Please run this SQL in your Supabase SQL Editor:');
    console.log(`
-- Fix RLS policies for all tables
-- This will resolve the 500 errors

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
    `);

    console.log('\n5. Testing after SQL fix...');
    console.log('After running the SQL above, test the application again.');
    console.log('The 500 errors should be resolved.');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixAllTables();
