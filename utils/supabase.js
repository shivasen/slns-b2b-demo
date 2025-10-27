import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing. Please check your .env file.");
  alert("Application is not configured to connect to the backend. Please contact support.");
  throw new Error("Supabase credentials are not available.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
