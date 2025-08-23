import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Leadership {
  id: string;
  name: string;
  role: string;
  photo_url: string;
  created_at: string;
}

export interface PrayerSchedule {
  id: string;
  prayer_name: string;
  time: string;
  date: string;
  created_at: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expenditure';
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}