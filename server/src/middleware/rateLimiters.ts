import { ERROR_CODES, type ApiFailure } from '@prolinker/shared';
import type { RequestHandler } from 'express';
import { rateLimit, type Options } from 'express-rate-limit';

import { env } from '../config/env';
import { requestIdOf } from '../lib/requestId';

const onLimitReached: Options['handler'] = (req, res, _next, options) => {
  const requestId = requestIdOf(req);
  const body: ApiFailure = {
    success: false,
    data: null,
    error: {
      code: ERROR_CODES.RATE_LIMITED,
      message: 'Too many requests, please try again later',
      ...(requestId ? { requestId } : {}),
    },
  };
  res.status(options.statusCode).json(body);
};

/**
 * NOTE (scaling): the default store is in-memory, i.e. per instance. When
 * running more than one API instance, plug in a shared store
 * (e.g. `rate-limit-redis`) via the `store` option here.
 */
function createLimiter(windowMs: number, limit: number): RequestHandler {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: onLimitReached,
  });
}

/** Baseline limit for every API route. */
export const globalLimiter = createLimiter(env.RATE_LIMIT_WINDOW_MS, env.RATE_LIMIT_MAX);

/** Stricter limit for abuse-prone endpoints (contact form, uploads, OTP, AI). */
export const sensitiveLimiter = createLimiter(15 * 60 * 1000, 20);
