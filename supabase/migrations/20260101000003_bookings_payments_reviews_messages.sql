-- =============================================================================
-- 0003 · Bookings, payments, reviews, messages
-- =============================================================================

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create table public.bookings (
  id             uuid primary key default gen_random_uuid(),
  customer_id    uuid not null references public.profiles (id) on delete restrict,
  worker_id      uuid not null references public.workers (profile_id) on delete restrict,
  category_id    uuid not null references public.categories (id) on delete restrict,
  description    text not null check (char_length(description) between 10 and 2000),
  address        text not null check (char_length(address) between 5 and 300),
  city           text check (char_length(city) <= 80),
  lat            numeric(9, 6) check (lat between -90 and 90),
  lng            numeric(9, 6) check (lng between -180 and 180),
  scheduled_at   timestamptz not null,
  status         public.booking_status not null default 'pending',
  quoted_amount  numeric(12, 2) check (quoted_amount >= 0),
  final_amount   numeric(12, 2) check (final_amount >= 0),
  cancel_reason  text check (char_length(cancel_reason) <= 500),
  -- status timeline (set by trigger, never by clients)
  accepted_at    timestamptz,
  rejected_at    timestamptz,
  started_at     timestamptz,
  completed_at   timestamptz,
  cancelled_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint bookings_distinct_parties check (customer_id <> worker_id),
  constraint bookings_completed_has_amount check (status <> 'completed' or final_amount is not null)
);

create index bookings_customer_idx on public.bookings (customer_id, created_at desc);
create index bookings_worker_status_idx on public.bookings (worker_id, status, created_at desc);
create index bookings_status_idx on public.bookings (status, created_at desc);
create index bookings_category_idx on public.bookings (category_id);
create index bookings_completed_at_idx on public.bookings (completed_at) where status = 'completed';

-- ---------------------------------------------------------------------------
-- payments — one per booking; commission split computed in DB function only
-- ---------------------------------------------------------------------------
create table public.payments (
  id                     uuid primary key default gen_random_uuid(),
  booking_id             uuid not null unique references public.bookings (id) on delete restrict,
  amount                 numeric(12, 2) not null check (amount > 0),
  commission_rate        numeric(5, 4) not null check (commission_rate >= 0 and commission_rate < 1),
  commission_amount      numeric(12, 2) not null check (commission_amount >= 0),
  worker_amount          numeric(12, 2) not null check (worker_amount >= 0),
  emergency_fund_amount  numeric(12, 2) not null default 0 check (emergency_fund_amount >= 0),
  method                 public.payment_method not null,
  status                 public.payment_status not null default 'pending',
  provider_ref           text check (char_length(provider_ref) <= 200),
  paid_at                timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint payments_split_balances check (commission_amount + worker_amount = amount),
  constraint payments_fund_within_commission check (emergency_fund_amount <= commission_amount),
  constraint payments_paid_has_timestamp check (status <> 'paid' or paid_at is not null)
);

create index payments_status_idx on public.payments (status, created_at desc);
create index payments_paid_at_idx on public.payments (paid_at) where status = 'paid';
create unique index payments_provider_ref_uidx on public.payments (method, provider_ref)
  where provider_ref is not null;

-- ---------------------------------------------------------------------------
-- reviews — exactly one per completed booking
-- ---------------------------------------------------------------------------
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null unique references public.bookings (id) on delete cascade,
  customer_id  uuid not null references public.profiles (id) on delete cascade,
  worker_id    uuid not null references public.workers (profile_id) on delete cascade,
  rating       smallint not null check (rating between 1 and 5),
  comment      text check (char_length(comment) <= 1000),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index reviews_worker_idx on public.reviews (worker_id, created_at desc);
create index reviews_customer_idx on public.reviews (customer_id);

-- ---------------------------------------------------------------------------
-- messages — booking-scoped chat
-- ---------------------------------------------------------------------------
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references public.bookings (id) on delete cascade,
  sender_id   uuid not null references public.profiles (id) on delete cascade,
  content     text not null check (char_length(btrim(content)) between 1 and 2000),
  read_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index messages_booking_idx on public.messages (booking_id, created_at);
create index messages_unread_idx on public.messages (booking_id, sender_id) where read_at is null;
