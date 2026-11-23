-- =============================================================================
-- 0002 · Profiles, workers, categories
-- =============================================================================

-- ---------------------------------------------------------------------------
-- profiles — 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null default '' check (char_length(full_name) <= 120),
  phone       text unique check (phone ~ '^\+?[0-9]{10,15}$'),
  role        public.user_role not null default 'customer',
  avatar_url  text check (char_length(avatar_url) <= 500),
  city        text check (char_length(city) <= 80),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Application profile for every auth user. Role changes are server-only.';

create index profiles_role_idx on public.profiles (role);
create index profiles_city_idx on public.profiles (lower(city));
create index profiles_created_at_idx on public.profiles (created_at desc);

-- ---------------------------------------------------------------------------
-- workers — extra data for profiles with role = 'worker'
-- profile_id doubles as the PK so bookings.worker_id = auth.uid() for workers.
-- ---------------------------------------------------------------------------
create table public.workers (
  profile_id              uuid primary key references public.profiles (id) on delete cascade,
  cnic_number             text unique check (cnic_number ~ '^[0-9]{5}-[0-9]{7}-[0-9]$'),
  cnic_document_path      text check (char_length(cnic_document_path) <= 300),
  skills                  text[] not null default '{}' check (cardinality(skills) <= 30),
  experience_years        smallint not null default 0 check (experience_years between 0 and 60),
  hourly_rate             numeric(10, 2) check (hourly_rate >= 0),
  service_area            text check (char_length(service_area) <= 200),
  bio                     text check (char_length(bio) <= 1000),
  is_available            boolean not null default false,
  verification_status     public.verification_status not null default 'pending',
  verification_note       text check (char_length(verification_note) <= 1000),
  verified_at             timestamptz,
  tevta_certified         boolean not null default false,
  tevta_certificate_path  text check (char_length(tevta_certificate_path) <= 300),
  avg_rating              numeric(3, 2) not null default 0 check (avg_rating between 0 and 5),
  total_jobs              integer not null default 0 check (total_jobs >= 0),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

comment on column public.workers.cnic_document_path is 'Path inside the private worker-documents bucket (never a public URL).';
comment on column public.workers.tevta_certificate_path is 'Path inside the private worker-documents bucket (never a public URL).';

create index workers_verification_idx on public.workers (verification_status);
-- Search hot path: only approved workers are ever listed publicly.
create index workers_search_idx
  on public.workers (tevta_certified desc, avg_rating desc)
  where verification_status = 'approved';
create index workers_available_idx
  on public.workers (is_available)
  where verification_status = 'approved';
create index workers_skills_gin_idx on public.workers using gin (skills);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 60),
  name_ur     text check (char_length(name_ur) <= 60),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon        text check (char_length(icon) <= 60),
  sort_order  smallint not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index categories_active_sort_idx on public.categories (is_active, sort_order);

-- ---------------------------------------------------------------------------
-- worker_categories — M:N
-- ---------------------------------------------------------------------------
create table public.worker_categories (
  worker_id    uuid not null references public.workers (profile_id) on delete cascade,
  category_id  uuid not null references public.categories (id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (worker_id, category_id)
);

-- PK covers worker_id lookups; this one serves "workers in category X".
create index worker_categories_category_idx on public.worker_categories (category_id, worker_id);
