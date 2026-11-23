import { AppError } from '../../lib/AppError';
import type { CategoryClassifier, CategoryPrediction } from '../types';

/** Placeholder until Phase 6. */
export class NotImplementedCategoryClassifier implements CategoryClassifier {
  detect(): Promise<CategoryPrediction[]> {
    return Promise.reject(AppError.notImplemented('Category auto-detection'));
  }
}
