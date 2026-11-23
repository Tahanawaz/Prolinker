import { AppError } from '../../lib/AppError';
import type { MatchWeights, RankedWorker, WorkerMatcher } from '../types';

/** Default factor weights (sum = 1). Tunable in Phase 6. */
export const DEFAULT_MATCH_WEIGHTS: MatchWeights = {
  distance: 0.3,
  rating: 0.25,
  skills: 0.2,
  availability: 0.15,
  tevta: 0.1,
};

/** Placeholder until Phase 6. */
export class NotImplementedWorkerMatcher implements WorkerMatcher {
  rank(): Promise<RankedWorker[]> {
    return Promise.reject(AppError.notImplemented('Smart worker matching'));
  }
}
