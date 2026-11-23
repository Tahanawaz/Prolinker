/**
 * AI module contracts (Phase 6).
 * Feature code depends only on these interfaces, so real implementations
 * (heuristic, LLM-backed, etc.) can be swapped in without refactoring callers.
 */
import type { SupportedLanguage } from '@prolinker/shared';

export interface GeoPoint {
  lat: number;
  lng: number;
}

// ---------------------------------------------------------------------------
// Smart worker matching
// ---------------------------------------------------------------------------
export interface MatchCriteria {
  categoryId: string;
  location?: GeoPoint;
  city?: string;
  /** Free-text skills the customer needs, e.g. ["geyser", "pipe fitting"]. */
  requiredSkills?: string[];
  scheduledAt?: string;
  limit?: number;
}

/** Each factor is normalised to 0..1 before weighting. */
export interface MatchScoreBreakdown {
  distance: number;
  rating: number;
  skills: number;
  availability: number;
  tevta: number;
}

export type MatchWeights = Readonly<MatchScoreBreakdown>;

export interface RankedWorker {
  workerId: string;
  /** Weighted total in 0..1. */
  score: number;
  breakdown: MatchScoreBreakdown;
  distanceKm: number | null;
}

export interface WorkerMatcher {
  rank(criteria: MatchCriteria): Promise<RankedWorker[]>;
}

// ---------------------------------------------------------------------------
// Problem description -> category
// ---------------------------------------------------------------------------
export interface CategoryPrediction {
  categoryId: string;
  slug: string;
  /** 0..1 */
  confidence: number;
}

export interface CategoryClassifier {
  detect(input: { text: string; language: SupportedLanguage }): Promise<CategoryPrediction[]>;
}

// ---------------------------------------------------------------------------
// Support chatbot (English / Urdu)
// ---------------------------------------------------------------------------
export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatbotRequest {
  messages: ChatTurn[];
  language: SupportedLanguage;
  userId?: string;
}

export interface ChatbotReply {
  message: string;
  /** Suggested follow-up actions, e.g. deep links into the app. */
  suggestions?: { label: string; href: string }[];
}

export interface SupportChatbot {
  reply(request: ChatbotRequest): Promise<ChatbotReply>;
}

export interface AiServices {
  matcher: WorkerMatcher;
  classifier: CategoryClassifier;
  chatbot: SupportChatbot;
}
