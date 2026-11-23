import type { PostgrestError } from '@supabase/supabase-js';

import { AppError } from './AppError';

/**
 * Domain error codes raised by our Postgres functions/triggers
 * (raise exception 'CODE') mapped to HTTP semantics.
 */
const DOMAIN_ERRORS: Readonly<Partial<Record<string, { status: number; message: string }>>> = {
  ACTOR_NOT_ALLOWED: { status: 403, message: 'You are not allowed to perform this action' },
  FORBIDDEN_FIELD_UPDATE: { status: 403, message: 'You cannot change this field' },
  BOOKING_PARTIES_IMMUTABLE: { status: 403, message: 'Booking parties cannot be changed' },
  BOOKING_AMOUNT_LOCKED: { status: 409, message: 'Amounts are locked after completion' },
  PAYMENT_LOCKED: { status: 409, message: 'Completed payments cannot be modified' },
  LEDGER_IMMUTABLE: { status: 409, message: 'Fund ledger entries cannot be modified' },
  BOOKING_NOT_FOUND: { status: 404, message: 'Booking not found' },
  REQUEST_NOT_FOUND: { status: 404, message: 'Request not found' },
  INVALID_STATUS_TRANSITION: { status: 409, message: 'This status change is not allowed' },
  BOOKING_NOT_COMPLETED: { status: 409, message: 'Booking is not completed yet' },
  PAYMENT_ALREADY_COMPLETED: { status: 409, message: 'Payment has already been completed' },
  REQUEST_ALREADY_REVIEWED: { status: 409, message: 'Request has already been reviewed' },
  INSUFFICIENT_FUNDS: { status: 409, message: 'The emergency fund balance is insufficient' },
  WORKER_NOT_VERIFIED: { status: 403, message: 'Worker is not verified yet' },
  FINAL_AMOUNT_REQUIRED: { status: 422, message: 'Final amount is required to complete the job' },
  INVALID_AMOUNT: { status: 422, message: 'Invalid amount' },
  REVIEW_NOT_ALLOWED: { status: 403, message: 'You cannot review this booking' },
};

/** Convert a PostgREST/Postgres error into an AppError without leaking internals. */
export function toAppError(error: PostgrestError, context: string): AppError {
  const domain = DOMAIN_ERRORS[error.message];
  if (domain) {
    return new AppError(domain.status, error.message, domain.message);
  }

  switch (error.code) {
    case '23505':
      return AppError.conflict('A record with these details already exists');
    case '23503':
      return AppError.badRequest('A referenced record does not exist');
    case '23514':
    case '22P02':
      return AppError.badRequest('Invalid data');
    case '42501':
      return AppError.forbidden();
    case 'PGRST116':
      return AppError.notFound();
    default:
      return AppError.internal(`Database error during ${context}`, error);
  }
}
