import type { Tables, TablesUpdate } from '@prolinker/shared';

import { supabaseAdmin, type DbClient } from '../../config/supabase';
import { AppError } from '../../lib/AppError';
import { toAppError } from '../../lib/dbError';

export type ProfileRow = Tables<'profiles'>;
export type AuthProfile = Pick<ProfileRow, 'id' | 'role' | 'is_active'>;

export const authRepository = {
  /** Minimal lookup used by the auth middleware on every request (service role). */
  async findAuthProfile(userId: string): Promise<AuthProfile | null> {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, role, is_active')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw toAppError(error, 'loading auth profile');
    return data;
  },

  async findProfileById(db: DbClient, userId: string): Promise<ProfileRow | null> {
    const { data, error } = await db.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (error) throw toAppError(error, 'loading profile');
    return data;
  },

  /** Runs with the user's RLS client: column GRANTs limit what can change. */
  async updateProfile(
    db: DbClient,
    userId: string,
    patch: TablesUpdate<'profiles'>,
  ): Promise<ProfileRow> {
    const { data, error } = await db
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select('*')
      .maybeSingle();
    if (error) throw toAppError(error, 'updating profile');
    if (!data) throw AppError.notFound('Profile');
    return data;
  },
};
