-- =============================================================================
-- 0007 · Views
-- =============================================================================

-- ---------------------------------------------------------------------------
-- worker_public_profiles
-- Safe, public projection of approved + active workers. Excludes CNIC and
-- document paths. Intentionally NOT security_invoker: `workers` RLS only lets
-- a worker see their own row, and this view is the sanctioned public window.
-- ---------------------------------------------------------------------------
create view public.worker_public_profiles
with (security_barrier = true)
as
select
  w.profile_id,
  p.full_name,
  p.avatar_url,
  p.city,
  w.skills,
  w.experience_years,
  w.hourly_rate,
  w.service_area,
  w.bio,
  w.is_available,
  w.tevta_certified,
  w.avg_rating,
  w.total_jobs,
  array(
    select wc.category_id
      from public.worker_categories wc
     where wc.worker_id = w.profile_id
  ) as category_ids,
  w.created_at
from public.workers w
join public.profiles p on p.id = w.profile_id
where w.verification_status = 'approved'
  and p.is_active;

comment on view public.worker_public_profiles is
  'Public worker directory (approved + active only). No PII beyond display name, avatar and city.';

-- ---------------------------------------------------------------------------
-- emergency_fund_balance — runs with caller privileges, so only admins
-- (who can read the ledger under RLS) get a non-zero answer.
-- ---------------------------------------------------------------------------
create view public.emergency_fund_balance
with (security_invoker = true)
as
select
  coalesce(sum(amount) filter (where type = 'contribution'), 0)::numeric(14, 2) as total_contributions,
  coalesce(sum(amount) filter (where type = 'payout'), 0)::numeric(14, 2)       as total_payouts,
  coalesce(sum(case when type = 'contribution' then amount else -amount end), 0)::numeric(14, 2)
                                                                                as balance
from public.emergency_fund_transactions;
