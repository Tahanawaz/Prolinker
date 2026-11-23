import type { CurrentUser, TablesUpdate, UpdateProfileInput } from '@prolinker/shared';

import { AppError } from '../../lib/AppError';
import type { AuthContext } from '../../types/express';
import { authRepository, type ProfileRow } from './auth.repository';

function toCurrentUser(profile: ProfileRow, email: string | null): CurrentUser {
  return {
    id: profile.id,
    email,
    fullName: profile.full_name,
    phone: profile.phone,
    role: profile.role,
    avatarUrl: profile.avatar_url,
    city: profile.city,
    isActive: profile.is_active,
    createdAt: profile.created_at,
  };
}

function toProfilePatch(input: UpdateProfileInput): TablesUpdate<'profiles'> {
  const patch: TablesUpdate<'profiles'> = {};
  if (input.fullName !== undefined) patch.full_name = input.fullName;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.city !== undefined) patch.city = input.city;
  if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl;
  return patch;
}

export const authService = {
  async getCurrentUser(auth: AuthContext): Promise<CurrentUser> {
    const profile = await authRepository.findProfileById(auth.db(), auth.userId);
    if (!profile) throw AppError.notFound('Profile');
    return toCurrentUser(profile, auth.email);
  },

  async updateCurrentUser(auth: AuthContext, input: UpdateProfileInput): Promise<CurrentUser> {
    const profile = await authRepository.updateProfile(
      auth.db(),
      auth.userId,
      toProfilePatch(input),
    );
    return toCurrentUser(profile, auth.email);
  },
};
