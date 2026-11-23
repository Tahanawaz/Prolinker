import { Router } from 'express';

import { globalLimiter } from '../middleware/rateLimiters';
import { authRouter } from '../modules/auth/auth.routes';
import { healthRouter } from '../modules/health/health.routes';

/** Mounted at /api/v1. Feature routers are added here phase by phase. */
export function createApiRouter(): Router {
  const router = Router();

  // Health checks are polled by the platform, so they sit before the rate limiter.
  router.use('/health', healthRouter);

  router.use(globalLimiter);
  router.use('/auth', authRouter);

  return router;
}
