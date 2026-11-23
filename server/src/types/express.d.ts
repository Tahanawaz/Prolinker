import type { UserRole } from '@prolinker/shared';

import type { DbClient } from '../config/supabase';

export interface AuthContext {
  userId: string;
  email: string | null;
  role: UserRole;
  /** Supabase client acting as this user (RLS enforced). Created lazily. */
  db: () => DbClient;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export {};
