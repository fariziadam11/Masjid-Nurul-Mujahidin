-- Fix RLS policies to prevent 500 errors
-- This migration updates the policies to properly check admin roles

-- Drop old policies that don't check admin roles
DROP POLICY IF EXISTS "Only authenticated users can modify leadership" ON leadership;
DROP POLICY IF EXISTS "Only authenticated users can modify prayer schedule" ON prayer_schedule;
DROP POLICY IF EXISTS "Only authenticated users can modify financial records" ON financial_records;
DROP POLICY IF EXISTS "Only authenticated users can modify announcements" ON announcements;

-- Create new policies that properly check admin roles
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

CREATE POLICY "Only admins can modify prayer schedule"
  ON prayer_schedule
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

CREATE POLICY "Only admins can modify financial records"
  ON financial_records
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

CREATE POLICY "Only admins can modify announcements"
  ON announcements
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

-- Also ensure the users table exists and has proper policies
-- This is a safety check in case the users table migration hasn't been run
DO $$
BEGIN
  -- Check if users table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    -- Create users table if it doesn't exist
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      full_name text,
      role text DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
      is_active boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS on users table
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    -- Create policies for users table
    CREATE POLICY "Users can view their own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid()::text = id::text);

    CREATE POLICY "Only super admins can modify users"
      ON users
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE id = auth.uid()::uuid 
          AND role = 'super_admin'
        )
      );

    -- Insert default admin user if not exists
    INSERT INTO users (id, email, full_name, role) VALUES
      ('00000000-0000-0000-0000-000000000001', 'admin@mosque.com', 'Administrator', 'super_admin')
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;
