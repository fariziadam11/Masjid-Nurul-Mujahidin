// Simple RLS fix script
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

async function fixRLSSimple() {
  try {
    console.log('🔧 Simple RLS fix...\n');

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
      .update({ 
        id: adminAuthUser.id,
        is_active: true 
      })
      .eq('email', 'admin@mosque.com');

    if (updateError) {
      console.log('❌ Update error:', updateError.message);
      
      // Try to insert instead
      console.log('Trying to insert new record...');
      const { error: insertError } = await supabase
        .from('users')
        .upsert({
          id: adminAuthUser.id,
          email: 'admin@mosque.com',
          full_name: 'Administrator',
          role: 'super_admin',
          is_active: true
        });

      if (insertError) {
        console.log('❌ Insert error:', insertError.message);
        return;
      } else {
        console.log('✅ User record updated/inserted');
      }
    } else {
      console.log('✅ User record updated');
    }

    // 3. Test access
    console.log('\n3. Testing access...');
    const { data: testData, error: testError } = await supabase
      .from('leadership')
      .select('*')
      .limit(1);

    if (testError) {
      console.log(`❌ Access failed: ${testError.message}`);
      
      // If still failing, let's create a simple policy
      console.log('\n4. Creating simple policy...');
      console.log('Please run this SQL in your Supabase SQL Editor:');
      console.log(`
-- Drop old policies
DROP POLICY IF EXISTS "Only authenticated users can modify leadership" ON leadership;
DROP POLICY IF EXISTS "Only admins can modify leadership" ON leadership;

-- Create simple policy for now
CREATE POLICY "Simple admin policy" ON leadership
  FOR ALL TO authenticated
  USING (auth.uid()::text = '${adminAuthUser.id}');
      `);
      
    } else {
      console.log('✅ Access works!');
    }

    console.log('\n📋 Summary:');
    console.log('Admin user ID updated to match auth user ID');
    console.log('If access still fails, run the SQL above in Supabase SQL Editor');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixRLSSimple();
