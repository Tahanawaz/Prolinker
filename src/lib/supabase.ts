import { createClient } from '@supabase/supabase-js';
import type { Database } from '@prolinker/shared';

import { env } from './env';

/**
 * Browser Supabase client: anon/publishable key only.
 * Used for auth, signed uploads and realtime; business data goes through the API.
 */
export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
