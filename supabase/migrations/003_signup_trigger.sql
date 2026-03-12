-- ============================================================
-- 003: Auto-create business + profile on signup
--
-- When a new row is inserted into auth.users (i.e. someone
-- signs up), this trigger creates a businesses row and a
-- profiles row so the user is immediately ready to use the
-- dashboard.
--
-- Business name is pulled from raw_user_meta_data, which is
-- set via the `data` option in supabase.auth.signUp().
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = ''
language plpgsql
as $$
declare
  new_business_id uuid;
begin
  insert into public.businesses (name)
  values (coalesce(new.raw_user_meta_data->>'business_name', 'My Business'))
  returning id into new_business_id;

  insert into public.profiles (id, business_id, full_name)
  values (
    new.id,
    new_business_id,
    nullif(new.raw_user_meta_data->>'full_name', '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
