-- =============================================================================
-- 0004 · Bonus rules, bonuses, emergency fund
-- =============================================================================

-- ---------------------------------------------------------------------------
-- bonus_rules — admin-configurable
-- ---------------------------------------------------------------------------
create table public.bonus_rules (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 3 and 80),
  period        public.bonus_period not null,
  min_jobs      integer not null check (min_jobs >= 0),
  min_rating    numeric(3, 2) not null check (min_rating between 0 and 5),
  bonus_amount  numeric(12, 2) not null check (bonus_amount > 0),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index bonus_rules_active_idx on public.bonus_rules (period) where is_active;

-- ---------------------------------------------------------------------------
-- bonuses — awarded per worker / rule / period (idempotent by unique key)
-- ---------------------------------------------------------------------------
create table public.bonuses (
  id               uuid primary key default gen_random_uuid(),
  worker_id        uuid not null references public.workers (profile_id) on delete cascade,
  rule_id          uuid not null references public.bonus_rules (id) on delete restrict,
  period_start     date not null,
  period_end       date not null,
  jobs_completed   integer not null default 0 check (jobs_completed >= 0),
  rating_snapshot  numeric(3, 2) not null default 0 check (rating_snapshot between 0 and 5),
  amount           numeric(12, 2) not null check (amount > 0),
  status           public.bonus_status not null default 'pending',
  paid_at          timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint bonuses_period_valid check (period_end >= period_start),
  constraint bonuses_unique_award unique (worker_id, rule_id, period_start)
);

create index bonuses_worker_idx on public.bonuses (worker_id, period_start desc);
create index bonuses_status_idx on public.bonuses (status);

-- ---------------------------------------------------------------------------
-- emergency_fund_requests
-- ---------------------------------------------------------------------------
create table public.emergency_fund_requests (
  id                uuid primary key default gen_random_uuid(),
  worker_id         uuid not null references public.workers (profile_id) on delete cascade,
  reason            text not null check (char_length(reason) between 20 and 2000),
  amount_requested  numeric(12, 2) not null check (amount_requested > 0),
  status            public.request_status not null default 'pending',
  admin_note        text check (char_length(admin_note) <= 1000),
  reviewed_by       uuid references public.profiles (id) on delete set null,
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index fund_requests_worker_idx on public.emergency_fund_requests (worker_id, created_at desc);
create index fund_requests_status_idx on public.emergency_fund_requests (status, created_at);

-- ---------------------------------------------------------------------------
-- emergency_fund_transactions — append-only ledger (no updated_at by design)
-- ---------------------------------------------------------------------------
create table public.emergency_fund_transactions (
  id          uuid primary key default gen_random_uuid(),
  type        public.fund_txn_type not null,
  amount      numeric(12, 2) not null check (amount > 0),
  booking_id  uuid references public.bookings (id) on delete restrict,
  request_id  uuid unique references public.emergency_fund_requests (id) on delete restrict,
  note        text check (char_length(note) <= 500),
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  constraint fund_txn_shape check (
    (type = 'payout' and request_id is not null and booking_id is null)
    or (type = 'contribution' and request_id is null)
  )
);

-- A booking can contribute to the fund only once.
create unique index fund_txn_booking_contribution_uidx
  on public.emergency_fund_transactions (booking_id)
  where type = 'contribution' and booking_id is not null;
create index fund_txn_created_idx on public.emergency_fund_transactions (created_at desc);
