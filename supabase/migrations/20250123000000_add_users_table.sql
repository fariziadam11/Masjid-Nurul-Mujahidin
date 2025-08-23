-- Add users table for admin authentication
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

-- Policy for users table - only authenticated users can read their own data
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Policy for users table - only super admins can modify user data
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

-- Update existing policies to be more restrictive for admin access
DROP POLICY IF EXISTS "Only authenticated users can modify leadership" ON leadership;
DROP POLICY IF EXISTS "Only authenticated users can modify prayer schedule" ON prayer_schedule;
DROP POLICY IF EXISTS "Only authenticated users can modify financial records" ON financial_records;
DROP POLICY IF EXISTS "Only authenticated users can modify announcements" ON announcements;

-- New policies that check if user is admin
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

-- Insert default admin user (password: admin123)
-- Note: In production, you should create users through Supabase Auth and then insert into users table
INSERT INTO users (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@mosque.com', 'Administrator', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Create function to automatically create user record when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
