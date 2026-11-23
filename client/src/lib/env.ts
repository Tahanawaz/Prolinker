import { parseClientEnv } from './envSchema';

const result = parseClientEnv(import.meta.env);

// main.tsx validates before loading the app, so this only fires if that check is bypassed.
if (!result.ok) {
  throw new Error(`Invalid client environment configuration:\n${result.issues.join('\n')}`);
}

export const env = result.env;
