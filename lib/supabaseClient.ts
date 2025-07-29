
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// In a Vite-based project, environment variables exposed to the client-side code
// must be prefixed with `VITE_` and are accessed via `import.meta.env`.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This error will be shown in the developer console if the environment variables are not set.
  // This is a common setup issue, so providing a clear message is helpful.
  const errorMessage = 'Supabase client initialization failed: Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` environment variables. Please ensure they are set in your deployment environment (e.g., Netlify) or a local .env file.';
  console.error(errorMessage);
  // We throw an error to prevent the app from continuing in a broken state.
  throw new Error(errorMessage);
}

// The `createClient` function initializes the Supabase client.
// The if-check above ensures that `supabaseUrl` and `supabaseAnonKey` are valid strings.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
