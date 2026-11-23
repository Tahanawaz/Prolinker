import type { UserRole } from '../enums';

/** Shape returned by GET /auth/me. */
export interface CurrentUser {
  id: string;
  email: string | null;
  fullName: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  city: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface HealthStatus {
  status: 'ok' | 'degraded';
  uptimeSeconds: number;
  timestamp: string;
  checks?: Record<string, 'ok' | 'fail'>;
}
