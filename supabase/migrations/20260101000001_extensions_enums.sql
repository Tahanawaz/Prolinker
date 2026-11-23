-- =============================================================================
-- 0001 · Extensions, enum types and shared helpers
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Enum types (kept in sync with shared/src/enums.ts)
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('customer', 'worker', 'admin');

create type public.verification_status as enum ('pending', 'approved', 'rejected');

create type public.booking_status as enum (
  'pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'
);

create type public.payment_method as enum ('cash', 'jazzcash', 'easypaisa', 'card');

create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create type public.bonus_period as enum ('monthly', 'yearly');

create type public.bonus_status as enum ('pending', 'approved', 'paid', 'rejected');

create type public.request_status as enum ('pending', 'approved', 'rejected');

create type public.fund_txn_type as enum ('contribution', 'payout');

create type public.complaint_status as enum ('open', 'in_review', 'resolved', 'rejected');

create type public.notification_type as enum (
  'booking', 'payment', 'review', 'message', 'verification',
  'bonus', 'emergency_fund', 'complaint', 'system'
);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
