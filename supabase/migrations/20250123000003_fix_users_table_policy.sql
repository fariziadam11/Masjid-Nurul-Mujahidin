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
  USING (auth.uid()::text = '9fa0dc0f-a185-4238-9570-897ff5f2da32');

-- Ensure admin user exists with correct ID
INSERT INTO users (id, email, full_name, role, is_active) 
VALUES ('9fa0dc0f-a185-4238-9570-897ff5f2da32', 'admin@mosque.com', 'Administrator', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET
  id = EXCLUDED.id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
