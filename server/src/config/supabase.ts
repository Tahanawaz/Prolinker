import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@prolinker/shared';

import { env } from './env';

export type DbClient = SupabaseClient<Database>;

const serverAuthOptions = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
} as const;

/**
 * Service-role client: BYPASSES RLS. Use only inside services for trusted,
 * server-authorised operations (admin actions, money movement, notifications).
 */
export const supabaseAdmin: DbClient = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  serverAuthOptions,
);

/**
 * Per-request client acting as the end user, so Postgres RLS still applies.
 * Prefer this for user-scoped reads/writes (defence in depth).
 */
export function createUserClient(accessToken: string): DbClient {
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    ...serverAuthOptions,
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}
