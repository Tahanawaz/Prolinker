-- =============================================================================
-- 0008 · Privileges + Row Level Security
--
-- Two layers:
--  1. GRANTs — deny-by-default. `anon`/`authenticated` get SELECT where needed
--     and INSERT/UPDATE only on explicitly listed columns. Everything else
--     (status changes, money, verification, admin actions) goes through the
--     API using service_role and the RPCs in 0006.
--  2. RLS — row filtering on every table.
--
-- Performance: auth.uid() / helper calls are wrapped in (select ...) so the
-- planner evaluates them once per statement (initPlan) instead of per row.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Reset to deny-by-default
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

-- Future objects created by the migration role are also private by default.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- Narrow definer helper: customers cannot read `workers` rows under RLS, but
-- booking creation must check the target worker is bookable.
create or replace function public.is_bookable_worker(p_worker_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.workers w
      join public.profiles p on p.id = w.profile_id
     where w.profile_id = p_worker_id
       and w.verification_status = 'approved'
       and w.is_available
       and p.is_active
  );
$$;

revoke execute on function public.is_bookable_worker(uuid) from public, anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- Helpers needed inside RLS policies.
grant execute on function public.current_user_role() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_client_write() to anon, authenticated, service_role;
grant execute on function public.is_bookable_worker(uuid) to authenticated, service_role;

-- Business RPCs: server only.
grant execute on function public.transition_booking(uuid, uuid, public.booking_status, numeric, numeric, text) to service_role;
grant execute on function public.complete_payment(uuid, public.payment_method, text) to service_role;
grant execute on function public.review_fund_request(uuid, uuid, boolean, text) to service_role;

-- ---------------------------------------------------------------------------
-- 2. Table / column grants
-- ---------------------------------------------------------------------------
-- Public read
grant select on public.categories, public.worker_categories, public.reviews,
                public.platform_settings, public.worker_public_profiles
  to anon, authenticated;

-- Authenticated read (rows filtered by RLS)
grant select on public.profiles, public.workers, public.bookings, public.payments,
                public.messages, public.bonus_rules, public.bonuses,
                public.emergency_fund_requests, public.emergency_fund_transactions,
                public.emergency_fund_balance, public.complaints, public.notifications
  to authenticated;

-- Column-scoped writes
grant update (full_name, phone, avatar_url, city) on public.profiles to authenticated;

grant update (cnic_number, cnic_document_path, skills, experience_years, hourly_rate,
              service_area, bio, is_available, tevta_certificate_path)
  on public.workers to authenticated;

grant insert, delete on public.worker_categories to authenticated;

grant insert (customer_id, worker_id, category_id, description, address, city, lat, lng, scheduled_at)
  on public.bookings to authenticated;

grant insert (booking_id, customer_id, worker_id, rating, comment) on public.reviews to authenticated;

grant insert (booking_id, sender_id, content) on public.messages to authenticated;
grant update (read_at) on public.messages to authenticated;

grant insert (worker_id, reason, amount_requested) on public.emergency_fund_requests to authenticated;

grant insert (booking_id, raised_by, description) on public.complaints to authenticated;

grant update (is_read) on public.notifications to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Enable RLS everywhere
-- ---------------------------------------------------------------------------
alter table public.profiles                    enable row level security;
alter table public.workers                     enable row level security;
alter table public.categories                  enable row level security;
alter table public.worker_categories           enable row level security;
alter table public.bookings                    enable row level security;
alter table public.payments                    enable row level security;
alter table public.reviews                     enable row level security;
alter table public.messages                    enable row level security;
alter table public.bonus_rules                 enable row level security;
alter table public.bonuses                     enable row level security;
alter table public.emergency_fund_requests     enable row level security;
alter table public.emergency_fund_transactions enable row level security;
alter table public.complaints                  enable row level security;
alter table public.notifications               enable row level security;
alter table public.platform_settings           enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.is_admin())
    -- booking counterparts can see each other's contact details
    or exists (
      select 1 from public.bookings b
       where (b.customer_id = (select auth.uid()) and b.worker_id = profiles.id)
          or (b.worker_id = (select auth.uid()) and b.customer_id = profiles.id)
    )
  );

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- workers (full row incl. CNIC: owner + admin only; public uses the view)
-- ---------------------------------------------------------------------------
create policy workers_select on public.workers
  for select to authenticated
  using (profile_id = (select auth.uid()) or (select public.is_admin()));

create policy workers_update_own on public.workers
  for update to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create policy categories_select on public.categories
  for select to anon, authenticated
  using (is_active or (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- worker_categories
-- ---------------------------------------------------------------------------
create policy worker_categories_select on public.worker_categories
  for select to anon, authenticated
  using (true);

create policy worker_categories_insert_own on public.worker_categories
  for insert to authenticated
  with check (
    worker_id = (select auth.uid())
    and exists (select 1 from public.categories c where c.id = category_id and c.is_active)
  );

create policy worker_categories_delete_own on public.worker_categories
  for delete to authenticated
  using (worker_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------------
create policy bookings_select on public.bookings
  for select to authenticated
  using (
    customer_id = (select auth.uid())
    or worker_id = (select auth.uid())
    or (select public.is_admin())
  );

create policy bookings_insert_customer on public.bookings
  for insert to authenticated
  with check (
    customer_id = (select auth.uid())
    and (select public.current_user_role()) = 'customer'
    and scheduled_at > now()
    and public.is_bookable_worker(worker_id)
  );

-- ---------------------------------------------------------------------------
-- payments (read-only for participants)
-- ---------------------------------------------------------------------------
create policy payments_select on public.payments
  for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.bookings b
       where b.id = payments.booking_id
         and (b.customer_id = (select auth.uid()) or b.worker_id = (select auth.uid()))
    )
  );

-- ---------------------------------------------------------------------------
-- reviews (public read; customer of a completed booking may write once)
-- ---------------------------------------------------------------------------
create policy reviews_select on public.reviews
  for select to anon, authenticated
  using (true);

create policy reviews_insert_customer on public.reviews
  for insert to authenticated
  with check (
    customer_id = (select auth.uid())
    and exists (
      select 1 from public.bookings b
       where b.id = booking_id
         and b.customer_id = (select auth.uid())
         and b.worker_id = reviews.worker_id
         and b.status = 'completed'
    )
  );

-- ---------------------------------------------------------------------------
-- messages (booking participants only)
-- ---------------------------------------------------------------------------
create policy messages_select on public.messages
  for select to authenticated
  using (
    (select public.is_admin())
    or exists (
      select 1 from public.bookings b
       where b.id = messages.booking_id
         and (b.customer_id = (select auth.uid()) or b.worker_id = (select auth.uid()))
    )
  );

create policy messages_insert_participant on public.messages
  for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from public.bookings b
       where b.id = booking_id
         and (b.customer_id = (select auth.uid()) or b.worker_id = (select auth.uid()))
         and b.status in ('pending', 'accepted', 'in_progress', 'completed')
    )
  );

-- Recipient marks messages read (only read_at is granted).
create policy messages_update_recipient on public.messages
  for update to authenticated
  using (
    sender_id <> (select auth.uid())
    and exists (
      select 1 from public.bookings b
       where b.id = messages.booking_id
         and (b.customer_id = (select auth.uid()) or b.worker_id = (select auth.uid()))
    )
  )
  with check (sender_id <> (select auth.uid()));

-- ---------------------------------------------------------------------------
-- bonus_rules / bonuses
-- ---------------------------------------------------------------------------
create policy bonus_rules_select on public.bonus_rules
  for select to authenticated
  using (is_active or (select public.is_admin()));

create policy bonuses_select on public.bonuses
  for select to authenticated
  using (worker_id = (select auth.uid()) or (select public.is_admin()));

-- ---------------------------------------------------------------------------
-- emergency fund
-- ---------------------------------------------------------------------------
create policy fund_requests_select on public.emergency_fund_requests
  for select to authenticated
  using (worker_id = (select auth.uid()) or (select public.is_admin()));

create policy fund_requests_insert_worker on public.emergency_fund_requests
  for insert to authenticated
  with check (
    worker_id = (select auth.uid())
    and exists (
      select 1 from public.workers w
       where w.profile_id = (select auth.uid())
         and w.verification_status = 'approved'
    )
  );

create policy fund_txn_select_admin on public.emergency_fund_transactions
  for select to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- complaints
-- ---------------------------------------------------------------------------
create policy complaints_select on public.complaints
  for select to authenticated
  using (raised_by = (select auth.uid()) or (select public.is_admin()));

create policy complaints_insert_participant on public.complaints
  for insert to authenticated
  with check (
    raised_by = (select auth.uid())
    and exists (
      select 1 from public.bookings b
       where b.id = booking_id
         and (b.customer_id = (select auth.uid()) or b.worker_id = (select auth.uid()))
    )
  );

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create policy notifications_select_own on public.notifications
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy notifications_update_own on public.notifications
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- platform_settings (rates are public information; writes are server-only)
-- ---------------------------------------------------------------------------
create policy platform_settings_select on public.platform_settings
  for select to anon, authenticated
  using (true);
