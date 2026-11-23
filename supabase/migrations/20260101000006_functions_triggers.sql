-- =============================================================================
-- 0006 · Functions & triggers
--
-- Conventions
--  * Every SECURITY DEFINER function pins `search_path = ''` and fully qualifies
--    object names (prevents search_path hijacking).
--  * Business RPCs raise exceptions whose MESSAGE is a stable machine code
--    (e.g. 'BOOKING_NOT_FOUND'); the API maps these to HTTP errors.
--  * "Client" writes are those made with role `authenticated`/`anon`. Writes
--    from `service_role` / `postgres` are trusted server-side writes.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- updated_at triggers for every table that has the column
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'workers', 'categories', 'bookings', 'payments', 'reviews', 'messages',
    'bonus_rules', 'bonuses', 'emergency_fund_requests', 'complaints', 'notifications',
    'platform_settings'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Role helpers used by RLS policies. STABLE + SECURITY DEFINER avoids policy
-- recursion on `profiles`; wrap calls as `(select public.is_admin())` in
-- policies so Postgres evaluates them once per statement, not once per row.
-- ---------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid() and p.is_active;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create or replace function public.is_client_write()
returns boolean
language sql
stable
set search_path = ''
as $$
  select current_user in ('authenticated', 'anon');
$$;

-- ---------------------------------------------------------------------------
-- New auth user -> profile (+ worker row). Self-signup can only ever produce
-- 'customer' or 'worker'; admins are promoted server-side.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  safe_role public.user_role :=
    case when meta ->> 'role' = 'worker' then 'worker'::public.user_role
         else 'customer'::public.user_role end;
begin
  insert into public.profiles (id, full_name, phone, role, city)
  values (
    new.id,
    left(coalesce(btrim(meta ->> 'full_name'), ''), 120),
    nullif(new.phone, ''),
    safe_role,
    nullif(left(btrim(coalesce(meta ->> 'city', '')), 80), '')
  );

  if safe_role = 'worker' then
    insert into public.workers (profile_id) values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Guard privileged profile columns (defence in depth on top of column GRANTs)
-- ---------------------------------------------------------------------------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.is_client_write() and (
       new.id is distinct from old.id
    or new.role is distinct from old.role
    or new.is_active is distinct from old.is_active
  ) then
    raise exception 'FORBIDDEN_FIELD_UPDATE' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger guard_profile_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------------------------------------------------------------------------
-- Workers: clients can never self-verify; changing identity documents after
-- approval sends the worker back to review; a new TEVTA file drops the badge.
-- ---------------------------------------------------------------------------
create or replace function public.guard_worker_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not public.is_client_write() then
    return new;
  end if;

  if new.verification_status is distinct from old.verification_status
     or new.verification_note is distinct from old.verification_note
     or new.verified_at is distinct from old.verified_at
     or new.tevta_certified is distinct from old.tevta_certified
     or new.avg_rating is distinct from old.avg_rating
     or new.total_jobs is distinct from old.total_jobs then
    raise exception 'FORBIDDEN_FIELD_UPDATE' using errcode = '42501';
  end if;

  if (new.cnic_number is distinct from old.cnic_number
      or new.cnic_document_path is distinct from old.cnic_document_path)
     and old.verification_status <> 'pending' then
    new.verification_status := 'pending';
    new.verified_at := null;
  end if;

  if new.tevta_certificate_path is distinct from old.tevta_certificate_path then
    new.tevta_certified := false;
  end if;

  return new;
end;
$$;

create trigger guard_worker_update
  before update on public.workers
  for each row execute function public.guard_worker_update();

-- ---------------------------------------------------------------------------
-- Booking state machine + timeline timestamps
--   pending     -> accepted | rejected | cancelled
--   accepted    -> in_progress | cancelled
--   in_progress -> completed
-- ---------------------------------------------------------------------------
create or replace function public.enforce_booking_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.customer_id is distinct from old.customer_id
     or new.worker_id is distinct from old.worker_id
     or new.category_id is distinct from old.category_id then
    raise exception 'BOOKING_PARTIES_IMMUTABLE' using errcode = '42501';
  end if;

  if new.status is distinct from old.status then
    if not (
         (old.status = 'pending'     and new.status in ('accepted', 'rejected', 'cancelled'))
      or (old.status = 'accepted'    and new.status in ('in_progress', 'cancelled'))
      or (old.status = 'in_progress' and new.status = 'completed')
    ) then
      raise exception 'INVALID_STATUS_TRANSITION' using errcode = 'P0001';
    end if;

    case new.status
      when 'accepted'    then new.accepted_at  := now();
      when 'rejected'    then new.rejected_at  := now();
      when 'in_progress' then new.started_at   := now();
      when 'completed'   then new.completed_at := now();
      when 'cancelled'   then new.cancelled_at := now();
      else null;
    end case;
  end if;

  -- Amounts are frozen once the job is completed (payment depends on them).
  if old.status = 'completed' and (
       new.final_amount is distinct from old.final_amount
    or new.quoted_amount is distinct from old.quoted_amount
  ) then
    raise exception 'BOOKING_AMOUNT_LOCKED' using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger enforce_booking_transition
  before update on public.bookings
  for each row execute function public.enforce_booking_transition();

-- Increment worker.total_jobs when a booking completes (completed is terminal).
create or replace function public.bump_worker_total_jobs()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.workers
     set total_jobs = total_jobs + 1
   where profile_id = new.worker_id;
  return new;
end;
$$;

create trigger bump_worker_total_jobs
  after update of status on public.bookings
  for each row
  when (new.status = 'completed' and old.status is distinct from 'completed')
  execute function public.bump_worker_total_jobs();

-- ---------------------------------------------------------------------------
-- Reviews: must match a completed booking; keep workers.avg_rating fresh
-- ---------------------------------------------------------------------------
create or replace function public.validate_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform 1
     from public.bookings b
    where b.id = new.booking_id
      and b.status = 'completed'
      and b.customer_id = new.customer_id
      and b.worker_id = new.worker_id;
  if not found then
    raise exception 'REVIEW_NOT_ALLOWED' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger validate_review
  before insert or update of booking_id, customer_id, worker_id on public.reviews
  for each row execute function public.validate_review();

create or replace function public.refresh_worker_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.worker_id, old.worker_id);
begin
  update public.workers w
     set avg_rating = coalesce(
           (select round(avg(r.rating)::numeric, 2) from public.reviews r where r.worker_id = target),
           0)
   where w.profile_id = target;
  return null;
end;
$$;

create trigger refresh_worker_rating
  after insert or update of rating or delete on public.reviews
  for each row execute function public.refresh_worker_rating();

-- ---------------------------------------------------------------------------
-- Money integrity: paid payments are immutable (except refund status);
-- the fund ledger is append-only.
-- ---------------------------------------------------------------------------
create or replace function public.guard_payment_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'paid' and (
       new.amount is distinct from old.amount
    or new.commission_rate is distinct from old.commission_rate
    or new.commission_amount is distinct from old.commission_amount
    or new.worker_amount is distinct from old.worker_amount
    or new.emergency_fund_amount is distinct from old.emergency_fund_amount
    or new.booking_id is distinct from old.booking_id
    or new.status not in ('paid', 'refunded')
  ) then
    raise exception 'PAYMENT_LOCKED' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger guard_payment_update
  before update on public.payments
  for each row execute function public.guard_payment_update();

create or replace function public.prevent_ledger_mutation()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'LEDGER_IMMUTABLE' using errcode = '42501';
end;
$$;

create trigger prevent_ledger_mutation
  before update or delete on public.emergency_fund_transactions
  for each row execute function public.prevent_ledger_mutation();

-- =============================================================================
-- Business RPCs — callable by service_role only (see 0008 grants).
-- The API authenticates the user and passes the actor id explicitly.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- transition_booking: authorise actor, change status, notify counterpart
-- ---------------------------------------------------------------------------
create or replace function public.transition_booking(
  p_booking_id     uuid,
  p_actor_id       uuid,
  p_status         public.booking_status,
  p_quoted_amount  numeric default null,
  p_final_amount   numeric default null,
  p_reason         text default null
)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking     public.bookings;
  v_actor_role  public.user_role;
  v_recipient   uuid;
begin
  select role into v_actor_role
    from public.profiles
   where id = p_actor_id and is_active;
  if v_actor_role is null then
    raise exception 'ACTOR_NOT_ALLOWED';
  end if;

  select * into v_booking
    from public.bookings
   where id = p_booking_id
     for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;

  if p_status in ('accepted', 'rejected', 'in_progress', 'completed') then
    if v_booking.worker_id <> p_actor_id then
      raise exception 'ACTOR_NOT_ALLOWED';
    end if;
    v_recipient := v_booking.customer_id;
  elsif p_status = 'cancelled' then
    if v_booking.customer_id <> p_actor_id and v_actor_role <> 'admin' then
      raise exception 'ACTOR_NOT_ALLOWED';
    end if;
    v_recipient := v_booking.worker_id;
  else
    raise exception 'INVALID_STATUS_TRANSITION';
  end if;

  if p_status = 'accepted' then
    perform 1 from public.workers
     where profile_id = p_actor_id and verification_status = 'approved';
    if not found then
      raise exception 'WORKER_NOT_VERIFIED';
    end if;
  end if;

  if p_quoted_amount is not null and p_quoted_amount < 0
     or p_final_amount is not null and p_final_amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  if p_status = 'completed'
     and coalesce(p_final_amount, v_booking.final_amount, v_booking.quoted_amount) is null then
    raise exception 'FINAL_AMOUNT_REQUIRED';
  end if;

  update public.bookings
     set status        = p_status,
         quoted_amount = case when p_status = 'accepted'
                              then coalesce(p_quoted_amount, quoted_amount) else quoted_amount end,
         final_amount  = case when p_status = 'completed'
                              then coalesce(p_final_amount, final_amount, quoted_amount) else final_amount end,
         cancel_reason = case when p_status in ('cancelled', 'rejected')
                              then left(p_reason, 500) else cancel_reason end
   where id = p_booking_id
  returning * into v_booking;

  insert into public.notifications (user_id, title, body, type, data)
  values (
    v_recipient,
    'Booking update',
    'Booking status changed to ' || replace(p_status::text, '_', ' ') || '.',
    'booking',
    jsonb_build_object('booking_id', p_booking_id, 'status', p_status)
  );

  return v_booking;
end;
$$;

-- ---------------------------------------------------------------------------
-- complete_payment: compute commission server-side from platform_settings,
-- record payment, contribute to emergency fund, notify worker. Atomic.
--   commission     = round(amount * commission_rate, 2)
--   worker_amount  = amount - commission          (no paisa lost to rounding)
--   fund_amount    = round(commission * emergency_fund_rate, 2)
-- ---------------------------------------------------------------------------
create or replace function public.complete_payment(
  p_booking_id    uuid,
  p_method        public.payment_method,
  p_provider_ref  text default null
)
returns public.payments
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking     public.bookings;
  v_settings    public.platform_settings;
  v_amount      numeric(12, 2);
  v_commission  numeric(12, 2);
  v_fund        numeric(12, 2);
  v_payment     public.payments;
begin
  select * into v_booking
    from public.bookings
   where id = p_booking_id
     for update;
  if not found then
    raise exception 'BOOKING_NOT_FOUND';
  end if;
  if v_booking.status <> 'completed' then
    raise exception 'BOOKING_NOT_COMPLETED';
  end if;

  v_amount := v_booking.final_amount;
  if v_amount is null or v_amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  select * into strict v_settings from public.platform_settings where id;

  v_commission := round(v_amount * v_settings.commission_rate, 2);
  v_fund       := round(v_commission * v_settings.emergency_fund_rate, 2);

  insert into public.payments (
    booking_id, amount, commission_rate, commission_amount, worker_amount,
    emergency_fund_amount, method, status, provider_ref, paid_at
  )
  values (
    p_booking_id, v_amount, v_settings.commission_rate, v_commission, v_amount - v_commission,
    v_fund, p_method, 'paid', p_provider_ref, now()
  )
  on conflict (booking_id) do update
     set amount                = excluded.amount,
         commission_rate       = excluded.commission_rate,
         commission_amount     = excluded.commission_amount,
         worker_amount         = excluded.worker_amount,
         emergency_fund_amount = excluded.emergency_fund_amount,
         method                = excluded.method,
         status                = 'paid',
         provider_ref          = excluded.provider_ref,
         paid_at               = excluded.paid_at
   where public.payments.status in ('pending', 'failed')
  returning * into v_payment;

  if v_payment.id is null then
    raise exception 'PAYMENT_ALREADY_COMPLETED';
  end if;

  if v_fund > 0 then
    insert into public.emergency_fund_transactions (type, amount, booking_id, note)
    values ('contribution', v_fund, p_booking_id, 'Commission share');
  end if;

  insert into public.notifications (user_id, title, body, type, data)
  values (
    v_booking.worker_id,
    'Payment received',
    'You earned PKR ' || to_char(v_payment.worker_amount, 'FM999,999,990.00') || ' for a completed job.',
    'payment',
    jsonb_build_object('booking_id', p_booking_id, 'payment_id', v_payment.id)
  );

  return v_payment;
end;
$$;

-- ---------------------------------------------------------------------------
-- review_fund_request: approve (balance-checked, serialised) or reject
-- ---------------------------------------------------------------------------
create or replace function public.review_fund_request(
  p_request_id  uuid,
  p_admin_id    uuid,
  p_approve     boolean,
  p_note        text default null
)
returns public.emergency_fund_requests
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request  public.emergency_fund_requests;
  v_balance  numeric(14, 2);
begin
  perform 1 from public.profiles
   where id = p_admin_id and role = 'admin' and is_active;
  if not found then
    raise exception 'ACTOR_NOT_ALLOWED';
  end if;

  -- Serialise all payouts so two approvals can never overdraw the fund.
  perform pg_advisory_xact_lock(hashtext('prolinker.emergency_fund'));

  select * into v_request
    from public.emergency_fund_requests
   where id = p_request_id
     for update;
  if not found then
    raise exception 'REQUEST_NOT_FOUND';
  end if;
  if v_request.status <> 'pending' then
    raise exception 'REQUEST_ALREADY_REVIEWED';
  end if;

  if p_approve then
    select coalesce(sum(case when type = 'contribution' then amount else -amount end), 0)
      into v_balance
      from public.emergency_fund_transactions;

    if v_balance < v_request.amount_requested then
      raise exception 'INSUFFICIENT_FUNDS';
    end if;

    insert into public.emergency_fund_transactions (type, amount, request_id, created_by, note)
    values ('payout', v_request.amount_requested, p_request_id, p_admin_id, left(p_note, 500));
  end if;

  update public.emergency_fund_requests
     set status      = case when p_approve then 'approved'::public.request_status
                            else 'rejected'::public.request_status end,
         admin_note  = left(p_note, 1000),
         reviewed_by = p_admin_id,
         reviewed_at = now()
   where id = p_request_id
  returning * into v_request;

  insert into public.notifications (user_id, title, body, type, data)
  values (
    v_request.worker_id,
    'Emergency fund request ' || v_request.status::text,
    case when p_approve then 'Your emergency fund request was approved.'
         else 'Your emergency fund request was not approved.' end,
    'emergency_fund',
    jsonb_build_object('request_id', p_request_id, 'status', v_request.status)
  );

  return v_request;
end;
$$;
