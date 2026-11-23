-- =============================================================================
-- 0005 · Complaints, notifications, platform settings
-- =============================================================================

-- ---------------------------------------------------------------------------
-- complaints
-- ---------------------------------------------------------------------------
create table public.complaints (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references public.bookings (id) on delete cascade,
  raised_by    uuid not null references public.profiles (id) on delete cascade,
  description  text not null check (char_length(description) between 10 and 2000),
  status       public.complaint_status not null default 'open',
  resolution   text check (char_length(resolution) <= 2000),
  resolved_by  uuid references public.profiles (id) on delete set null,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index complaints_status_idx on public.complaints (status, created_at desc);
create index complaints_booking_idx on public.complaints (booking_id);
create index complaints_raised_by_idx on public.complaints (raised_by, created_at desc);

-- ---------------------------------------------------------------------------
-- notifications
-- title/body are English fallbacks; clients localise using `type` + `data`.
-- ---------------------------------------------------------------------------
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null check (char_length(title) <= 150),
  body        text not null check (char_length(body) <= 1000),
  type        public.notification_type not null default 'system',
  data        jsonb not null default '{}'::jsonb,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_unread_idx on public.notifications (user_id) where not is_read;

-- ---------------------------------------------------------------------------
-- platform_settings — single-row table (id is always true)
-- ---------------------------------------------------------------------------
create table public.platform_settings (
  id                   boolean primary key default true check (id),
  commission_rate      numeric(5, 4) not null default 0.10
                         check (commission_rate >= 0 and commission_rate < 1),
  emergency_fund_rate  numeric(5, 4) not null default 0.10
                         check (emergency_fund_rate >= 0 and emergency_fund_rate <= 1),
  updated_by           uuid references public.profiles (id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

comment on column public.platform_settings.emergency_fund_rate is
  'Share of the platform commission (not of the job amount) routed to the worker emergency fund.';

-- The app cannot run without this row, so it lives in the migration, not the seed.
insert into public.platform_settings (id) values (true) on conflict (id) do nothing;
