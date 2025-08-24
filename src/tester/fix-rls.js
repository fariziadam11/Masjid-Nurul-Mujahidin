// Fix RLS policies script
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

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies...\n');

    // Get the admin user ID from our users table
    const { data: adminUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@mosque.com')
      .single();

    if (userError || !adminUser) {
      console.error('❌ Admin user not found in users table');
      return;
    }

    console.log(`✅ Found admin user: ${adminUser.id}`);

    // Test current access
    console.log('\n1. Testing current access...');
    const { data: testData, error: testError } = await supabase
      .from('leadership')
      .select('*')
      .limit(1);

    if (testError) {
      console.log(`❌ Current access failed: ${testError.message}`);
    } else {
      console.log('✅ Current access works');
    }

    // Create a temporary policy that allows all access for testing
    console.log('\n2. Creating temporary open policy for testing...');
    
    const { error: tempPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "temp_open_policy" ON leadership;
        CREATE POLICY "temp_open_policy" ON leadership FOR ALL USING (true);
      `
    });

    if (tempPolicyError) {
      console.log('❌ Could not create temporary policy:', tempPolicyError.message);
    } else {
      console.log('✅ Temporary policy created');
    }

    // Test access with temporary policy
    console.log('\n3. Testing with temporary policy...');
    const { data: tempData, error: tempError } = await supabase
      .from('leadership')
      .select('*')
      .limit(1);

    if (tempError) {
      console.log(`❌ Temporary policy failed: ${tempError.message}`);
    } else {
      console.log('✅ Temporary policy works');
    }

    // Now create proper admin-only policies
    console.log('\n4. Creating proper admin policies...');
    
    const { error: adminPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "temp_open_policy" ON leadership;
        DROP POLICY IF EXISTS "Only authenticated users can modify leadership" ON leadership;
        DROP POLICY IF EXISTS "Only admins can modify leadership" ON leadership;
        
        CREATE POLICY "Only admins can modify leadership"
          ON leadership
          FOR ALL
          TO authenticated
          USING (
            EXISTS (
              SELECT 1 FROM users 
              WHERE id = auth.uid()::uuid 
              AND role IN ('admin', 'super_admin')
              AND is_active = true
            )
          );
      `
    });

    if (adminPolicyError) {
      console.log('❌ Could not create admin policy:', adminPolicyError.message);
    } else {
      console.log('✅ Admin policy created');
    }

    // Test final access
    console.log('\n5. Testing final access...');
    const { data: finalData, error: finalError } = await supabase
      .from('leadership')
      .select('*')
      .limit(1);

    if (finalError) {
      console.log(`❌ Final access failed: ${finalError.message}`);
      console.log('   This suggests the RLS policy is too restrictive');
    } else {
      console.log('✅ Final access works');
    }

    console.log('\n📋 Summary:');
    console.log('If the final test fails, you may need to:');
    console.log('1. Check that the admin user ID matches between auth and users table');
    console.log('2. Ensure the admin user has the correct role');
    console.log('3. Verify that is_active is true');

  } catch (error) {
    console.error('❌ Fix RLS failed:', error);
  }
}

fixRLSPolicies();
