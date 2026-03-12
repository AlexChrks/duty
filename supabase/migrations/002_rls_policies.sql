-- ============================================================
-- 002: Harden RLS policies
--
-- Fixes applied to the 001 baseline:
--   1. Add `with check` to all UPDATE policies (prevents
--      cross-tenant data migration via business_id change)
--   2. Add `with check` to INSERT policies for consistency
--   3. Scope every policy to the `authenticated` role
--   4. Add missing INSERT policy on `leads` (manual creation)
--   5. Add missing UPDATE policy on `calls` (dashboard edits)
--   6. Harden get_business_id() with search_path
-- ============================================================

-- ------------------------------------------------------------
-- Harden the tenant-resolution helper
-- ------------------------------------------------------------

create or replace function public.get_business_id()
returns uuid
language sql
security definer
stable
set search_path = ''
as $$
  select business_id from public.profiles where id = auth.uid()
$$;

-- ============================================================
-- Drop all existing policies so this migration is idempotent
-- ============================================================

-- businesses
drop policy if exists "select own business"     on businesses;
drop policy if exists "update own business"     on businesses;

-- profiles
drop policy if exists "select own profile"      on profiles;
drop policy if exists "update own profile"      on profiles;

-- agent_configs
drop policy if exists "select own agent configs" on agent_configs;
drop policy if exists "insert own agent configs" on agent_configs;
drop policy if exists "update own agent configs" on agent_configs;

-- calls
drop policy if exists "select own calls"        on calls;

-- call_events
drop policy if exists "select own call events"  on call_events;

-- leads
drop policy if exists "select own leads"        on leads;
drop policy if exists "update own leads"        on leads;

-- integrations
drop policy if exists "select own integrations" on integrations;
drop policy if exists "insert own integrations" on integrations;
drop policy if exists "update own integrations" on integrations;
drop policy if exists "delete own integrations" on integrations;

-- ============================================================
-- Recreate policies
-- ============================================================

-- businesses ------------------------------------------------
-- No INSERT: business rows are created by the signup flow
-- using the service_role key.
-- No DELETE: destroying a business is an admin action.

create policy "select own business"
  on businesses for select
  to authenticated
  using (id = public.get_business_id());

create policy "update own business"
  on businesses for update
  to authenticated
  using  (id = public.get_business_id())
  with check (id = public.get_business_id());

-- profiles --------------------------------------------------
-- SELECT is scoped to the user's own row.  When you add team
-- members later, widen this to business_id-based access.
-- No INSERT: profile rows are created during signup (trigger
-- or service_role).

create policy "select own profile"
  on profiles for select
  to authenticated
  using (id = auth.uid());

create policy "update own profile"
  on profiles for update
  to authenticated
  using  (id = auth.uid())
  with check (id = auth.uid());

-- agent_configs ---------------------------------------------

create policy "select own agent configs"
  on agent_configs for select
  to authenticated
  using (business_id = public.get_business_id());

create policy "insert own agent configs"
  on agent_configs for insert
  to authenticated
  with check (business_id = public.get_business_id());

create policy "update own agent configs"
  on agent_configs for update
  to authenticated
  using  (business_id = public.get_business_id())
  with check (business_id = public.get_business_id());

-- calls -----------------------------------------------------
-- INSERT: voice server uses service_role, so no INSERT policy.
-- UPDATE: dashboard users may edit summary or metadata.

create policy "select own calls"
  on calls for select
  to authenticated
  using (business_id = public.get_business_id());

create policy "update own calls"
  on calls for update
  to authenticated
  using  (business_id = public.get_business_id())
  with check (business_id = public.get_business_id());

-- call_events -----------------------------------------------
-- Read-only for dashboard users.  The voice server writes
-- events via service_role.  Events are immutable once written.

create policy "select own call events"
  on call_events for select
  to authenticated
  using (business_id = public.get_business_id());

-- leads -----------------------------------------------------
-- INSERT: dashboard users can create manual leads.
-- UPDATE: dashboard users change lead status, add notes, etc.

create policy "select own leads"
  on leads for select
  to authenticated
  using (business_id = public.get_business_id());

create policy "insert own leads"
  on leads for insert
  to authenticated
  with check (business_id = public.get_business_id());

create policy "update own leads"
  on leads for update
  to authenticated
  using  (business_id = public.get_business_id())
  with check (business_id = public.get_business_id());

-- integrations ----------------------------------------------

create policy "select own integrations"
  on integrations for select
  to authenticated
  using (business_id = public.get_business_id());

create policy "insert own integrations"
  on integrations for insert
  to authenticated
  with check (business_id = public.get_business_id());

create policy "update own integrations"
  on integrations for update
  to authenticated
  using  (business_id = public.get_business_id())
  with check (business_id = public.get_business_id());

create policy "delete own integrations"
  on integrations for delete
  to authenticated
  using (business_id = public.get_business_id());
