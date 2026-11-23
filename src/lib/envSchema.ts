import { z } from 'zod';

/**
 * Refuse to boot if a privileged Supabase key was put in the browser bundle.
 * Handles both new-style keys (sb_secret_…) and legacy JWT keys (role claim).
 */
function isPrivilegedKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) return true;
  const payload = key.split('.')[1];
  if (!payload) return false;
  try {
    const json: unknown = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return (
      typeof json === 'object' && json !== null && 'role' in json && json.role === 'service_role'
    );
  } catch {
    return false;
  }
}

const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.url('Must be your Supabase project URL, e.g. https://abcd.supabase.co'),
  VITE_SUPABASE_ANON_KEY: z
    .string({ error: 'Set VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)' })
    .min(1, 'Set VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)')
    .refine((key) => !isPrivilegedKey(key), {
      message: 'A service-role/secret key must never be used in the browser',
    }),
  VITE_API_URL: z.string().min(1).default('/api/v1'),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

export type ClientEnvResult = { ok: true; env: ClientEnv } | { ok: false; issues: string[] };

/**
 * Validate the Vite env. Accepts Supabase's current naming
 * (VITE_SUPABASE_PUBLISHABLE_KEY) and the legacy one (VITE_SUPABASE_ANON_KEY).
 */
export function parseClientEnv(source: ImportMetaEnv): ClientEnvResult {
  const parsed = clientEnvSchema.safeParse({
    ...source,
    VITE_SUPABASE_ANON_KEY: source.VITE_SUPABASE_PUBLISHABLE_KEY ?? source.VITE_SUPABASE_ANON_KEY,
  });
  if (parsed.success) return { ok: true, env: parsed.data };
  return {
    ok: false,
    issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
  };
}
