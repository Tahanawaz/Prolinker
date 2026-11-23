-- =============================================================================
-- Seed data (idempotent). Demo user accounts are created by
-- `npm run seed:users` via the Supabase Auth Admin API, not here.
-- =============================================================================

insert into public.categories (name, name_ur, slug, icon, sort_order)
values
  ('Plumber',        'پلمبر',           'plumber',        'wrench',      1),
  ('Electrician',    'الیکٹریشن',       'electrician',    'zap',         2),
  ('Carpenter',      'بڑھئی',           'carpenter',      'hammer',      3),
  ('Painter',        'پینٹر',           'painter',        'paint-roller',4),
  ('AC Technician',  'اے سی ٹیکنیشن',   'ac-technician',  'snowflake',   5),
  ('Cleaner',        'صفائی والا',      'cleaner',        'sparkles',    6),
  ('Mason',          'مستری',           'mason',          'brick-wall',  7),
  ('Labourer',       'مزدور',           'labourer',       'hard-hat',    8)
on conflict (slug) do update
  set name       = excluded.name,
      name_ur    = excluded.name_ur,
      icon       = excluded.icon,
      sort_order = excluded.sort_order;

insert into public.bonus_rules (name, period, min_jobs, min_rating, bonus_amount)
select v.name, v.period::public.bonus_period, v.min_jobs, v.min_rating, v.bonus_amount
from (values
  ('Monthly Star',       'monthly', 20,  4.5, 3000.00),
  ('Monthly Performer',  'monthly', 10,  4.0, 1500.00),
  ('Yearly Champion',    'yearly',  200, 4.5, 25000.00)
) as v(name, period, min_jobs, min_rating, bonus_amount)
where not exists (select 1 from public.bonus_rules br where br.name = v.name);
