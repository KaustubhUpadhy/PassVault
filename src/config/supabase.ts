import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types for better TypeScript support
export interface DatabasePassword {
  id: string;
  user_id: string;
  site_name: string;
  username: string;
  encrypted_password: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Frontend types (with decrypted password)
export interface Password {
  id: string;
  title: string; // Maps to site_name in database
  username: string;
  password: string; // This will be the decrypted password
  notes?: string;
  created_at: string;
  updated_at: string;
}