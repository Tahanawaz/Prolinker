import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // Deterministic, non-secret values so the app can boot without a real project.
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
      SUPABASE_URL: 'https://test-project.supabase.co',
      SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      SUPABASE_JWT_SECRET: 'test-jwt-secret-that-is-at-least-32-chars-long',
      CORS_ORIGINS: 'http://localhost:5173',
    },
  },
});
