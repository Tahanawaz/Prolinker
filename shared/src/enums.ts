/**
 * Domain enums — the single source of truth on the TypeScript side.
 * Must stay in sync with the Postgres enum types in supabase/migrations/*_extensions_enums.sql.
 */
export const USER_ROLES = ['customer', 'worker', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Roles a user may pick at self-signup. `admin` is never self-assignable. */
export const SIGNUP_ROLES = ['customer', 'worker'] as const satisfies readonly UserRole[];
export type SignupRole = (typeof SIGNUP_ROLES)[number];

export const VERIFICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const BOOKING_STATUSES = [
  'pending',
  'accepted',
  'rejected',
  'in_progress',
  'completed',
  'cancelled',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_METHODS = ['cash', 'jazzcash', 'easypaisa', 'card'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const BONUS_PERIODS = ['monthly', 'yearly'] as const;
export type BonusPeriod = (typeof BONUS_PERIODS)[number];

export const BONUS_STATUSES = ['pending', 'approved', 'paid', 'rejected'] as const;
export type BonusStatus = (typeof BONUS_STATUSES)[number];

export const REQUEST_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const FUND_TXN_TYPES = ['contribution', 'payout'] as const;
export type FundTxnType = (typeof FUND_TXN_TYPES)[number];

export const COMPLAINT_STATUSES = ['open', 'in_review', 'resolved', 'rejected'] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const NOTIFICATION_TYPES = [
  'booking',
  'payment',
  'review',
  'message',
  'verification',
  'bonus',
  'emergency_fund',
  'complaint',
  'system',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const SUPPORTED_LANGUAGES = ['en', 'ur'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Valid booking state transitions (mirrors the DB trigger `enforce_booking_transition`). */
export const BOOKING_TRANSITIONS: Readonly<Record<BookingStatus, readonly BookingStatus[]>> = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: [],
  rejected: [],
  cancelled: [],
};
