import { USER_ROLES } from '@prolinker/shared';
import type { RequestHandler } from 'express';
import { createRemoteJWKSet, errors as joseErrors, jwtVerify, type JWTPayload } from 'jose';
import { z } from 'zod';

import { env } from '../config/env';
import { createUserClient, type DbClient } from '../config/supabase';
import { AppError } from '../lib/AppError';
import { logger } from '../lib/logger';
import { authRepository } from '../modules/auth/auth.repository';

const issuer = `${env.SUPABASE_URL}/auth/v1`;
const audience = 'authenticated';

/**
 * Verify Supabase access tokens locally (no network round-trip per request).
 *  - Projects on asymmetric signing keys: verified against the cached JWKS.
 *  - Legacy projects: verified with SUPABASE_JWT_SECRET (HS256).
 */
const hsSecret = env.SUPABASE_JWT_SECRET ? new TextEncoder().encode(env.SUPABASE_JWT_SECRET) : null;
const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`), {
  cacheMaxAge: 10 * 60 * 1000,
  cooldownDuration: 30 * 1000,
});

const claimsSchema = z.object({
  sub: z.uuid(),
  role: z.literal('authenticated'),
  email: z.string().optional(),
});

async function verifyAccessToken(token: string): Promise<JWTPayload> {
  if (hsSecret) {
    const { payload } = await jwtVerify(token, hsSecret, {
      issuer,
      audience,
      algorithms: ['HS256'],
    });
    return payload;
  }
  const { payload } = await jwtVerify(token, jwks, {
    issuer,
    audience,
    algorithms: ['ES256', 'RS256'],
  });
  return payload;
}

function extractBearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token || token.length > 4096) return null;
  return token;
}

/**
 * Requires a valid Supabase session. Populates `req.auth` with the user id,
 * role (from `profiles`, never from the token) and an RLS-scoped DB client.
 */
export const authenticate: RequestHandler = (req, _res, next) => {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) {
    next(AppError.unauthorized());
    return;
  }

  const run = async (): Promise<void> => {
    let payload: JWTPayload;
    try {
      payload = await verifyAccessToken(token);
    } catch (error) {
      if (error instanceof joseErrors.JWKSTimeout || error instanceof joseErrors.JWKSInvalid) {
        logger.error({ err: error }, 'Unable to load Supabase JWKS');
        throw AppError.serviceUnavailable('Authentication service unavailable');
      }
      throw AppError.unauthorized('Invalid or expired session');
    }

    const claims = claimsSchema.safeParse(payload);
    if (!claims.success) throw AppError.unauthorized('Invalid session');

    const profile = await authRepository.findAuthProfile(claims.data.sub);
    if (!profile) throw AppError.unauthorized('Account not found');
    if (!profile.is_active) throw AppError.forbidden('Your account has been deactivated');
    if (!USER_ROLES.includes(profile.role)) throw AppError.forbidden();

    let userDb: DbClient | null = null;
    req.auth = {
      userId: profile.id,
      email: claims.data.email ?? null,
      role: profile.role,
      db: () => (userDb ??= createUserClient(token)),
    };
  };

  run().then(() => {
    next();
  }, next);
};
