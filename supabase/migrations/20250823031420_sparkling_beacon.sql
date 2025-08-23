/*
  # Mosque Website Database Schema

  1. New Tables
    - `leadership`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text) - Chairman, Secretary, Treasurer, etc.
      - `photo_url` (text) - URL to photo
      - `created_at` (timestamp)
    
    - `prayer_schedule`
      - `id` (uuid, primary key)
      - `prayer_name` (text) - Subuh, Dzuhur, Ashar, Maghrib, Isya
      - `time` (text) - prayer time
      - `date` (date) - schedule date
      - `created_at` (timestamp)
    
    - `financial_records`
      - `id` (uuid, primary key)
      - `type` (text) - income or expenditure
      - `description` (text)
      - `amount` (numeric)
      - `date` (date)
      - `created_at` (timestamp)
    
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Leadership table
CREATE TABLE IF NOT EXISTS leadership (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  photo_url text DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leadership ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leadership visible to everyone"
  ON leadership
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can modify leadership"
  ON leadership
  FOR ALL
  TO authenticated
  USING (true);

-- Prayer schedule table
CREATE TABLE IF NOT EXISTS prayer_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_name text NOT NULL,
  time text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prayer_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prayer schedule visible to everyone"
  ON prayer_schedule
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can modify prayer schedule"
  ON prayer_schedule
  FOR ALL
  TO authenticated
  USING (true);

-- Financial records table
CREATE TABLE IF NOT EXISTS financial_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('income', 'expenditure')),
  description text NOT NULL,
  amount numeric NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Financial records visible to everyone"
  ON financial_records
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can modify financial records"
  ON financial_records
  FOR ALL
  TO authenticated
  USING (true);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements visible to everyone"
  ON announcements
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can modify announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO leadership (name, role, photo_url) VALUES
  ('Ahmad Ibrahim', 'Chairman', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  ('Fatimah Zahra', 'Secretary', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  ('Umar Hassan', 'Treasurer', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop');

INSERT INTO prayer_schedule (prayer_name, time) VALUES
  ('Subuh', '05:30'),
  ('Dzuhur', '12:15'),
  ('Ashar', '15:45'),
  ('Maghrib', '18:20'),
  ('Isya', '19:40');

INSERT INTO financial_records (type, description, amount, date) VALUES
  ('income', 'Monthly Donations', 2500000, '2024-01-01'),
  ('income', 'Zakat Collection', 1800000, '2024-01-05'),
  ('expenditure', 'Electricity Bill', 350000, '2024-01-10'),
  ('expenditure', 'Maintenance', 500000, '2024-01-15'),
  ('income', 'Event Fundraising', 1200000, '2024-01-20');

INSERT INTO announcements (title, content, date) VALUES
  ('Ramadan Schedule Update', 'Please note that prayer times will be adjusted during Ramadan. Iftar will be served daily at the mosque.', '2024-01-15'),
  ('Community Fundraising Event', 'Join us for our annual fundraising dinner on February 20th. All proceeds will go towards mosque maintenance.', '2024-01-10'),
  ('Islamic Studies Classes', 'New Islamic studies classes for children start every Sunday at 2:00 PM. Registration is now open.', '2024-01-05');