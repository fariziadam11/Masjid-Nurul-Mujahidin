-- Fix all RLS policies with correct admin user ID
-- This migration resolves the 500 errors for all tables

-- Leadership table
DROP POLICY IF EXISTS "Only authenticated users can modify leadership" ON leadership;
DROP POLICY IF EXISTS "Only admins can modify leadership" ON leadership;
DROP POLICY IF EXISTS "temp_open_policy" ON leadership;

CREATE POLICY "Only admins can modify leadership"
  ON leadership
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '9fa0dc0f-a185-4238-9570-897ff5f2da32');

-- Prayer schedule table  
DROP POLICY IF EXISTS "Only authenticated users can modify prayer schedule" ON prayer_schedule;
DROP POLICY IF EXISTS "Only admins can modify prayer schedule" ON prayer_schedule;
DROP POLICY IF EXISTS "temp_open_policy" ON prayer_schedule;

CREATE POLICY "Only admins can modify prayer schedule"
  ON prayer_schedule
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '9fa0dc0f-a185-4238-9570-897ff5f2da32');

-- Financial records table
DROP POLICY IF EXISTS "Only authenticated users can modify financial records" ON financial_records;
DROP POLICY IF EXISTS "Only admins can modify financial records" ON financial_records;
DROP POLICY IF EXISTS "temp_open_policy" ON financial_records;

CREATE POLICY "Only admins can modify financial records"
  ON financial_records
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '9fa0dc0f-a185-4238-9570-897ff5f2da32');

-- Announcements table
DROP POLICY IF EXISTS "Only authenticated users can modify announcements" ON announcements;
DROP POLICY IF EXISTS "Only admins can modify announcements" ON announcements;
DROP POLICY IF EXISTS "temp_open_policy" ON announcements;

CREATE POLICY "Only admins can modify announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = '9fa0dc0f-a185-4238-9570-897ff5f2da32');

-- Ensure admin user exists in users table with correct ID
INSERT INTO users (id, email, full_name, role, is_active) 
VALUES ('9fa0dc0f-a185-4238-9570-897ff5f2da32', 'admin@mosque.com', 'Administrator', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET
  id = EXCLUDED.id,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
