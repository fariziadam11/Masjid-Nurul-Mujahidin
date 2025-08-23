// Setup script for creating admin user
// Run this script after setting up your Supabase project

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to your .env

console.log('Checking environment variables...');
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Service Role Key:', supabaseServiceKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please create a .env file with:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    // First, check if user already exists in our users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@mosque.com')
      .single();

    if (existingUser) {
      console.log('Admin user already exists in database');
      console.log('Email: admin@mosque.com');
      console.log('Password: admin123');
      return;
    }

    // Create user in Supabase Auth
    console.log('Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@mosque.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        full_name: 'Administrator'
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      console.log('Trying to create user record manually...');
      
      // If auth creation fails, try to create just the user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          email: 'admin@mosque.com',
          full_name: 'Administrator',
          role: 'super_admin',
          is_active: true
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user record:', userError);
        return;
      }

      console.log('User record created manually:', userData);
      console.log('Admin setup completed!');
      console.log('Email: admin@mosque.com');
      console.log('Password: admin123');
      console.log('Note: You may need to create the auth user manually in Supabase dashboard');
      return;
    }

    console.log('Auth user created:', authData.user.id);

    // Insert user record into our users table
    console.log('Creating user record in database...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'admin@mosque.com',
        full_name: 'Administrator',
        role: 'super_admin',
        is_active: true
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user record:', userError);
      console.log('Auth user was created but database record failed');
      console.log('You may need to manually insert the user record');
      return;
    }

    console.log('User record created:', userData);
    console.log('Admin setup completed successfully!');
    console.log('Email: admin@mosque.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Function to update admin password
async function updateAdminPassword(newPassword) {
  try {
    console.log('Updating admin password...');
    
    // First, try to get user from auth.users
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }

    const adminUser = authUsers.users.find(user => user.email === 'admin@mosque.com');
    
    if (!adminUser) {
      console.log('Admin user not found in auth. Creating user first...');
      
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@mosque.com',
        password: newPassword,
        email_confirm: true,
        user_metadata: {
          full_name: 'Administrator'
        }
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return;
      }

      console.log('Auth user created with new password:', authData.user.id);

      // Also update/create user record in our table
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: authData.user.id,
          email: 'admin@mosque.com',
          full_name: 'Administrator',
          role: 'super_admin',
          is_active: true
        });

      if (upsertError) {
        console.error('Error updating user record:', upsertError);
      } else {
        console.log('User record updated');
      }

    } else {
      // Update existing user's password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { password: newPassword }
      );

      if (updateError) {
        console.error('Error updating password:', updateError);
        return;
      }

      console.log('Password updated successfully for existing user!');
    }

    console.log('Email: admin@mosque.com');
    console.log('New password:', newPassword);
    
  } catch (error) {
    console.error('Password update failed:', error);
  }
}

// Check if user wants to update password
const args = process.argv.slice(2);
if (args[0] === 'update-password' && args[1]) {
  updateAdminPassword(args[1]);
} else {
  setupAdmin();
}
