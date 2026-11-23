import type { ApiFailure } from '@prolinker/shared';
import { SignJWT } from 'jose';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../src/app';
import { authRepository } from '../src/modules/auth/auth.repository';

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
const ISSUER = `${process.env.SUPABASE_URL ?? ''}/auth/v1`;
const USER_ID = '11111111-1111-4111-8111-111111111111';

async function signToken(
  overrides: { sub?: string; role?: string; issuer?: string; expiresIn?: string } = {},
): Promise<string> {
  return new SignJWT({ role: overrides.role ?? 'authenticated', email: 'user@example.com' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(overrides.sub ?? USER_ID)
    .setIssuer(overrides.issuer ?? ISSUER)
    .setAudience('authenticated')
    .setIssuedAt()
    .setExpirationTime(overrides.expiresIn ?? '1h')
    .sign(JWT_SECRET);
}

const app = createApp();

describe('API foundation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/health returns the standard success envelope', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, error: null, data: { status: 'ok' } });
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('sets security headers and hides the framework', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toContain("default-src 'none'");
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, data: null, error: { code: 'NOT_FOUND' } });
  });

  it('allows configured CORS origins and ignores others', async () => {
    const allowed = await request(app).get('/api/v1/health').set('Origin', 'http://localhost:5173');
    const blocked = await request(app).get('/api/v1/health').set('Origin', 'https://evil.example');

    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .patch('/api/v1/auth/me')
      .set('Content-Type', 'application/json')
      .send('{"fullName":');

    expect(res.status).toBe(400);
    expect((res.body as ApiFailure).error.code).toBe('BAD_REQUEST');
  });
});

describe('authentication middleware', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('requires a bearer token', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect((res.body as ApiFailure).error.code).toBe('UNAUTHORIZED');
  });

  it('rejects tokens signed with the wrong key', async () => {
    const forged = await new SignJWT({ role: 'authenticated' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(USER_ID)
      .setIssuer(ISSUER)
      .setAudience('authenticated')
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode('a-completely-different-secret-value-123'));

    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });

  it('rejects expired tokens', async () => {
    const token = await signToken({ expiresIn: '-1m' });
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('rejects tokens from another issuer', async () => {
    const token = await signToken({ issuer: 'https://other.supabase.co/auth/v1' });
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('rejects anon-role tokens', async () => {
    const token = await signToken({ role: 'anon' });
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it('blocks deactivated accounts with 403', async () => {
    vi.spyOn(authRepository, 'findAuthProfile').mockResolvedValue({
      id: USER_ID,
      role: 'customer',
      is_active: false,
    });
    const token = await signToken();

    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('validates the request body before touching the database', async () => {
    vi.spyOn(authRepository, 'findAuthProfile').mockResolvedValue({
      id: USER_ID,
      role: 'customer',
      is_active: true,
    });
    const update = vi.spyOn(authRepository, 'updateProfile');
    const token = await signToken();

    const res = await request(app)
      .patch('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' });

    expect(res.status).toBe(422);
    expect((res.body as ApiFailure).error.code).toBe('VALIDATION_ERROR');
    expect(update).not.toHaveBeenCalled();
  });
});
