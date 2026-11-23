import { NotImplementedSupportChatbot } from './chatbot/SupportChatbot';
import { NotImplementedCategoryClassifier } from './classification/CategoryClassifier';
import { NotImplementedWorkerMatcher } from './matching/WorkerMatcher';
import type { AiServices } from './types';

export type * from './types';
export { DEFAULT_MATCH_WEIGHTS } from './matching/WorkerMatcher';

/** Composition root for AI services. Phase 6 swaps the implementations here only. */
export function createAiServices(): AiServices {
  return {
    matcher: new NotImplementedWorkerMatcher(),
    classifier: new NotImplementedCategoryClassifier(),
    chatbot: new NotImplementedSupportChatbot(),
  };
}
