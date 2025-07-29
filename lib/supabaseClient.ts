import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Debug: Logge die Environment Variables
console.log('DEBUG - VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('DEBUG - VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = 'Supabase client initialization failed: Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` environment variables. Please ensure they are set in your deployment environment (e.g., Netlify) or a local .env file.';
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
