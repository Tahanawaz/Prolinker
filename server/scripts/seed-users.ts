/**
 * Creates one demo account per role (customer, worker, admin) via the
 * Supabase Auth Admin API. Idempotent: existing users are reused.
 *
 *   SEED_DEMO_PASSWORD=... npm run seed:users
 *
 * Refuses to run in production unless ALLOW_DEMO_SEED=true.
 */
import type { UserRole } from '@prolinker/shared';
import { z } from 'zod';

import { env } from '../src/config/env';
import { supabaseAdmin } from '../src/config/supabase';

const seedEnv = z
  .object({
    SEED_DEMO_PASSWORD: z
      .string({ error: 'SEED_DEMO_PASSWORD is required' })
      .min(12, 'SEED_DEMO_PASSWORD must be at least 12 characters')
      .regex(/[a-z]/, 'needs a lowercase letter')
      .regex(/[A-Z]/, 'needs an uppercase letter')
      .regex(/\d/, 'needs a digit'),
    SEED_EMAIL_DOMAIN: z.string().default('prolinker.example.com'),
    ALLOW_DEMO_SEED: z.enum(['true', 'false']).default('false'),
  })
  .safeParse(process.env);

if (!seedEnv.success) {
  console.error(seedEnv.error.issues.map((issue) => `- ${issue.message}`).join('\n'));
  process.exit(1);
}

const { SEED_DEMO_PASSWORD, SEED_EMAIL_DOMAIN, ALLOW_DEMO_SEED } = seedEnv.data;

if (env.NODE_ENV === 'production' && ALLOW_DEMO_SEED !== 'true') {
  console.error(
    'Refusing to seed demo users in production (set ALLOW_DEMO_SEED=true to override).',
  );
  process.exit(1);
}

interface DemoUser {
  email: string;
  fullName: string;
  city: string;
  role: UserRole;
}

const DEMO_USERS: readonly DemoUser[] = [
  {
    email: `customer@${SEED_EMAIL_DOMAIN}`,
    fullName: 'Ayesha Khan',
    city: 'Lahore',
    role: 'customer',
  },
  {
    email: `worker@${SEED_EMAIL_DOMAIN}`,
    fullName: 'Muhammad Bilal',
    city: 'Lahore',
    role: 'worker',
  },
  {
    email: `admin@${SEED_EMAIL_DOMAIN}`,
    fullName: 'ProLinker Admin',
    city: 'Islamabad',
    role: 'admin',
  },
];

async function findUserIdByEmail(email: string): Promise<string | null> {
  const perPage = 200;
  for (let page = 1; page <= 50; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match.id;
    if (data.users.length < perPage) return null;
  }
  return null;
}

async function ensureAuthUser(user: DemoUser): Promise<string> {
  const existingId = await findUserIdByEmail(user.email);
  if (existingId) {
    console.log(`= ${user.role.padEnd(8)} ${user.email} (exists)`);
    return existingId;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: user.email,
    password: SEED_DEMO_PASSWORD,
    email_confirm: true,
    // The signup trigger never grants admin; promotion happens below.
    user_metadata: {
      full_name: user.fullName,
      city: user.city,
      role: user.role === 'admin' ? 'customer' : user.role,
    },
  });
  if (error) throw error;
  console.log(`+ ${user.role.padEnd(8)} ${user.email}`);
  return data.user.id;
}

async function promoteToAdmin(userId: string): Promise<void> {
  const { error } = await supabaseAdmin.from('profiles').update({ role: 'admin' }).eq('id', userId);
  if (error) throw error;
}

async function setUpDemoWorker(userId: string): Promise<void> {
  const { error: workerError } = await supabaseAdmin
    .from('workers')
    .update({
      cnic_number: '35202-0000000-1',
      skills: ['Pipe fitting', 'Geyser repair', 'Leak detection', 'Wiring'],
      experience_years: 7,
      hourly_rate: 1200,
      service_area: 'Lahore — Gulberg, Model Town, Johar Town',
      bio: 'Experienced plumber and electrician. Punctual, clean work, fair prices.',
      is_available: true,
      verification_status: 'approved',
      verified_at: new Date().toISOString(),
      tevta_certified: true,
    })
    .eq('profile_id', userId);
  if (workerError) throw workerError;

  const { data: categories, error: categoryError } = await supabaseAdmin
    .from('categories')
    .select('id')
    .in('slug', ['plumber', 'electrician']);
  if (categoryError) throw categoryError;

  const { error: linkError } = await supabaseAdmin.from('worker_categories').upsert(
    categories.map((category) => ({ worker_id: userId, category_id: category.id })),
    { onConflict: 'worker_id,category_id', ignoreDuplicates: true },
  );
  if (linkError) throw linkError;
}

async function main(): Promise<void> {
  console.log('Seeding demo users…');
  for (const user of DEMO_USERS) {
    const userId = await ensureAuthUser(user);
    if (user.role === 'admin') await promoteToAdmin(userId);
    if (user.role === 'worker') await setUpDemoWorker(userId);
  }
  console.log('\nDone. All demo users share the password from SEED_DEMO_PASSWORD.');
}

main().catch((error: unknown) => {
  console.error('Seeding failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
