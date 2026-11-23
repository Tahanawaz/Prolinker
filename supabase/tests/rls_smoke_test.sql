-- =============================================================================
-- RLS / security smoke test
-- Run in the Supabase SQL editor (or psql) AFTER migrations are applied.
-- Everything happens inside a transaction that is ROLLED BACK — no data stays.
-- Success = the final NOTICE 'ALL RLS SMOKE TESTS PASSED'. Any failure raises.
-- =============================================================================
begin;

-- ---- fixtures (as postgres) -------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data, aud, role)
values
  ('00000000-0000-0000-0000-00000000000a', 'rls.cust.a@example.com',
     '{"full_name":"Cust A","role":"customer"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000b', 'rls.cust.b@example.com',
     '{"full_name":"Cust B","role":"customer"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000c', 'rls.worker@example.com',
     '{"full_name":"Worker W","role":"worker"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000d', 'rls.admin@example.com',
     '{"full_name":"Admin","role":"customer"}', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000e', 'rls.sneaky@example.com',
     '{"full_name":"Sneaky","role":"admin"}', 'authenticated', 'authenticated');

update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000d';
update public.workers
   set verification_status = 'approved', is_available = true, cnic_number = '35202-1234567-1'
 where profile_id = '00000000-0000-0000-0000-00000000000c';

insert into public.bookings (id, customer_id, worker_id, category_id, description, address, scheduled_at)
select '00000000-0000-0000-0000-0000000000f1',
       '00000000-0000-0000-0000-00000000000a',
       '00000000-0000-0000-0000-00000000000c',
       (select id from public.categories order by sort_order limit 1),
       'Kitchen tap is leaking badly', 'House 1, Street 2, Lahore', now() + interval '1 day';

-- ---- T1: self-signup can never become admin --------------------------------
do $$ begin
  if (select role from public.profiles where id = '00000000-0000-0000-0000-00000000000e') <> 'customer' then
    raise exception 'T1 FAILED: signup metadata escalated role';
  end if;
end $$;


set local role authenticated;

-- ---- T2: customers only see their own bookings ------------------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);
do $$ begin
  if (select count(*) from public.bookings) <> 1 then raise exception 'T2a FAILED: owner cannot see booking'; end if;
end $$;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}', true);
do $$ begin
  if (select count(*) from public.bookings) <> 0 then raise exception 'T2b FAILED: stranger sees booking'; end if;
end $$;

-- ---- T3: worker sees assigned booking; admin sees all -----------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000c","role":"authenticated"}', true);
do $$ begin
  if (select count(*) from public.bookings) <> 1 then raise exception 'T3a FAILED: worker cannot see assigned booking'; end if;
end $$;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000d","role":"authenticated"}', true);
do $$ begin
  if (select count(*) from public.bookings where id = '00000000-0000-0000-0000-0000000000f1') <> 1 then
    raise exception 'T3b FAILED: admin cannot see booking';
  end if;
end $$;

-- ---- T4: CNIC hidden from customers; public view works ----------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}', true);
do $$ begin
  if (select count(*) from public.workers) <> 0 then raise exception 'T4a FAILED: customer can read workers table'; end if;
  if (select count(*) from public.worker_public_profiles
       where profile_id = '00000000-0000-0000-0000-00000000000c') <> 1 then
    raise exception 'T4b FAILED: public worker view missing approved worker';
  end if;
end $$;

-- ---- T5: users cannot escalate their own role --------------------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);
do $$ begin
  begin
    update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000a';
    raise exception 'T5 FAILED: role update was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

-- ---- T6: workers cannot self-verify ------------------------------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000c","role":"authenticated"}', true);
do $$ begin
  begin
    update public.workers set tevta_certified = true
     where profile_id = '00000000-0000-0000-0000-00000000000c';
    raise exception 'T6 FAILED: worker set own TEVTA badge';
  exception when insufficient_privilege then null;
  end;
end $$;

-- ---- T7: clients cannot change booking status directly -----------------------
do $$ begin
  begin
    update public.bookings set status = 'completed' where id = '00000000-0000-0000-0000-0000000000f1';
    raise exception 'T7 FAILED: client changed booking status';
  exception when insufficient_privilege then null;
  end;
end $$;

-- ---- T8: clients cannot write payments or call business RPCs -----------------
do $$ begin
  begin
    perform public.complete_payment('00000000-0000-0000-0000-0000000000f1', 'cash');
    raise exception 'T8a FAILED: client called complete_payment';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.payments (booking_id, amount, commission_rate, commission_amount, worker_amount, method)
    values ('00000000-0000-0000-0000-0000000000f1', 100, 0, 0, 100, 'cash');
    raise exception 'T8b FAILED: client inserted payment';
  exception when insufficient_privilege then null;
  end;
end $$;

-- ---- T9: settings are read-only for clients ----------------------------------
do $$ begin
  begin
    update public.platform_settings set commission_rate = 0;
    raise exception 'T9 FAILED: client changed commission rate';
  exception when insufficient_privilege then null;
  end;
end $$;

-- ---- T10: commission math (server path) --------------------------------------
reset role;
update public.bookings set status = 'accepted', quoted_amount = 2500
 where id = '00000000-0000-0000-0000-0000000000f1';
update public.bookings set status = 'in_progress' where id = '00000000-0000-0000-0000-0000000000f1';
update public.bookings set status = 'completed', final_amount = 2999.99
 where id = '00000000-0000-0000-0000-0000000000f1';

do $$
declare p public.payments;
begin
  p := public.complete_payment('00000000-0000-0000-0000-0000000000f1', 'cash');
  if p.commission_amount <> 300.00 or p.worker_amount <> 2699.99 or p.emergency_fund_amount <> 30.00 then
    raise exception 'T10 FAILED: split was % / % / %', p.commission_amount, p.worker_amount, p.emergency_fund_amount;
  end if;
  begin
    perform public.complete_payment('00000000-0000-0000-0000-0000000000f1', 'cash');
    raise exception 'T10b FAILED: double payment allowed';
  exception when raise_exception then
    if sqlerrm <> 'PAYMENT_ALREADY_COMPLETED' then raise; end if;
  end;
end $$;

-- ---- T11: invalid state transitions are rejected ------------------------------
do $$ begin
  begin
    update public.bookings set status = 'pending' where id = '00000000-0000-0000-0000-0000000000f1';
    raise exception 'T11 FAILED: completed -> pending allowed';
  exception when raise_exception then
    if sqlerrm <> 'INVALID_STATUS_TRANSITION' then raise; end if;
  end;
end $$;

do $$ begin raise notice 'ALL RLS SMOKE TESTS PASSED'; end $$;

rollback;
