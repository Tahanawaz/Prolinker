import 'dotenv/config';

import { z } from 'zod';

const csv = z
  .string()
  .default('')
  .transform((value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET: z
    .string()
    .optional()
    .transform((value) => (value === '' ? undefined : value))
    .refine((value) => value === undefined || value.length >= 32, 'must be at least 32 chars'),

  CORS_ORIGINS: csv.pipe(z.array(z.url()).min(1, 'at least one origin is required')),
  TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),

  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  // Accept Supabase's current key names as well as the legacy ones.
  const source = {
    ...process.env,
    SUPABASE_ANON_KEY: process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    // Print field names + reasons only, never values (they may be secrets).
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    console.error(`Invalid server environment configuration:\n${issues}`);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
