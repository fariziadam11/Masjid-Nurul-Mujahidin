// Fix users table RLS policy
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

async function fixUsersTable() {
  try {
    console.log('🔧 Fixing users table RLS policy...\n');

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

    // 2. Test current users table access
    console.log('\n2. Testing current users table access...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminAuthUser.id)
      .single();

    if (testError) {
      console.log(`❌ Current access failed: ${testError.message}`);
    } else {
      console.log('✅ Current access works');
      console.log('User data:', testData);
    }

    // 3. Generate SQL to fix users table policy
    console.log('\n3. Generating SQL to fix users table policy...');
    console.log('\n📋 Please run this SQL in your Supabase SQL Editor:');
    console.log(`
-- Fix users table RLS policy
-- This will resolve the 500 error on users table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Only super admins can modify users" ON users;
DROP POLICY IF EXISTS "temp_open_policy" ON users;

-- Create simple policy for users table
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policy for admin to modify users
CREATE POLICY "Admin can modify users"
  ON users
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

    // 4. Alternative: Try to fix directly with service role
    console.log('\n4. Trying direct fix with service role...');
    const { error: directError } = await supabase
      .from('users')
      .upsert({
        id: adminAuthUser.id,
        email: 'admin@mosque.com',
        full_name: 'Administrator',
        role: 'super_admin',
        is_active: true
      });

    if (directError) {
      console.log('❌ Direct fix failed:', directError.message);
    } else {
      console.log('✅ Direct fix successful');
    }

    // 5. Test after fix
    console.log('\n5. Testing after fix...');
    const { data: finalData, error: finalError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminAuthUser.id)
      .single();

    if (finalError) {
      console.log(`❌ Final test failed: ${finalError.message}`);
      console.log('\n🔧 Manual steps needed:');
      console.log('1. Run the SQL above in Supabase SQL Editor');
      console.log('2. Check if users table has RLS enabled');
      console.log('3. Verify admin user exists in the table');
    } else {
      console.log('✅ Final test successful');
      console.log('User data:', finalData);
    }

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixUsersTable();
