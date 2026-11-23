import { Router } from 'express';

import { sendSuccess } from '../../lib/apiResponse';
import { handler } from '../../lib/handler';
import { healthService } from './health.service';

export const healthRouter = Router();

healthRouter.get(
  '/',
  handler({}, ({ res }) => {
    sendSuccess(res, healthService.liveness());
    return Promise.resolve();
  }),
);

healthRouter.get(
  '/ready',
  handler({}, async ({ res }) => {
    const status = await healthService.readiness();
    sendSuccess(res, status, status.status === 'ok' ? 200 : 503);
  }),
);
