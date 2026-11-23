import { AppError } from '../../lib/AppError';
import type { ChatbotReply, SupportChatbot } from '../types';

/** Placeholder until Phase 6. */
export class NotImplementedSupportChatbot implements SupportChatbot {
  reply(): Promise<ChatbotReply> {
    return Promise.reject(AppError.notImplemented('Support chatbot'));
  }
}
