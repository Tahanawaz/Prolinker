import type { HealthStatus } from '@prolinker/shared';

import { supabaseAdmin } from '../../config/supabase';
import { logger } from '../../lib/logger';

const DB_CHECK_TIMEOUT_MS = 3000;

export const healthService = {
  liveness(): HealthStatus {
    return {
      status: 'ok',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  },

  /** Readiness: can we reach the database? Used by the hosting platform's health check. */
  async readiness(): Promise<HealthStatus> {
    let database: 'ok' | 'fail' = 'ok';
    try {
      const { error } = await supabaseAdmin
        .from('platform_settings')
        .select('id')
        .limit(1)
        .abortSignal(AbortSignal.timeout(DB_CHECK_TIMEOUT_MS));
      if (error) throw error;
    } catch (error) {
      logger.warn({ err: error }, 'Database readiness check failed');
      database = 'fail';
    }

    return {
      ...healthService.liveness(),
      status: database === 'ok' ? 'ok' : 'degraded',
      checks: { database },
    };
  },
};
