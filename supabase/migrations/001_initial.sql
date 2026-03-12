-- ============================================================
-- Duty MVP schema
-- Multi-tenant AI phone agent SaaS
-- ============================================================

-- ------------------------------------------------------------
-- Enum types
-- ------------------------------------------------------------

create type call_status as enum (
  'ringing',
  'in_progress',
  'completed',
  'failed',
  'missed'
);

create type call_event_type as enum (
  'transcript',
  'status_change',
  'action',
  'error'
);

create type lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'converted',
  'lost'
);

-- ------------------------------------------------------------
-- Utility: auto-update updated_at on row change
-- ------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------
-- businesses
-- The tenant table. Every other table hangs off business_id.
-- ------------------------------------------------------------

create table businesses (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  vertical    text not null default 'general',
  phone       text,
  timezone    text not null default 'UTC',
  settings    jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger businesses_updated_at
  before update on businesses
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- profiles
-- Links auth.users to a business. One row per user.
-- MVP: one user (owner) per business.
-- Future: multiple users per business with role-based access.
-- ------------------------------------------------------------

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  business_id uuid not null references businesses on delete cascade,
  full_name   text,
  role        text not null default 'owner',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index profiles_business_id_idx on profiles (business_id);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- Helper: resolve current user's business_id for RLS policies.
-- security definer so it can read profiles even with RLS on.
-- ------------------------------------------------------------

create or replace function public.get_business_id()
returns uuid
language sql
security definer
stable
as $$
  select business_id from public.profiles where id = auth.uid()
$$;

-- ------------------------------------------------------------
-- agent_configs
-- AI phone agent behaviour for a business.
-- MVP: one active config per business. The table allows
-- multiple rows so a business can keep drafts or history.
-- ------------------------------------------------------------

create table agent_configs (
  id               uuid primary key default gen_random_uuid(),
  business_id      uuid not null references businesses on delete cascade,
  name             text not null default 'Default Agent',
  system_prompt    text not null,
  greeting_message text not null default 'Hello, how can I help you?',
  voice_id         text not null default 'default',
  language         text not null default 'en',
  is_active        boolean not null default true,
  config           jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index agent_configs_business_id_idx on agent_configs (business_id);

create trigger agent_configs_updated_at
  before update on agent_configs
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- calls
-- One row per inbound phone call.
-- ------------------------------------------------------------

create table calls (
  id               uuid primary key default gen_random_uuid(),
  business_id      uuid not null references businesses on delete cascade,
  agent_config_id  uuid references agent_configs on delete set null,
  external_id      text,
  caller_phone     text,
  status           call_status not null default 'ringing',
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  duration_seconds integer,
  summary          text,
  recording_url    text,
  metadata         jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index calls_business_id_idx on calls (business_id);
create index calls_status_idx on calls (status);
create index calls_started_at_idx on calls (started_at desc);
create index calls_external_id_idx on calls (external_id) where external_id is not null;

create trigger calls_updated_at
  before update on calls
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- call_events
-- Time-ordered lifecycle events within a call:
--   transcript lines, status changes, agent actions, errors.
-- business_id is denormalised for fast RLS (avoids join to calls).
-- ------------------------------------------------------------

create table call_events (
  id          uuid primary key default gen_random_uuid(),
  call_id     uuid not null references calls on delete cascade,
  business_id uuid not null references businesses on delete cascade,
  event_type  call_event_type not null,
  speaker     text,
  content     text,
  payload     jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

create index call_events_call_id_occurred_idx on call_events (call_id, occurred_at);
create index call_events_business_id_idx on call_events (business_id);

-- ------------------------------------------------------------
-- leads
-- Structured customer/request info extracted from calls.
-- call_id is nullable: leads may also be created manually.
-- ------------------------------------------------------------

create table leads (
  id             uuid primary key default gen_random_uuid(),
  business_id    uuid not null references businesses on delete cascade,
  call_id        uuid references calls on delete set null,
  status         lead_status not null default 'new',
  customer_name  text,
  customer_phone text,
  summary        text,
  source         text not null default 'voice',
  extra_data     jsonb not null default '{}',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index leads_business_id_idx on leads (business_id);
create index leads_status_idx on leads (status);
create index leads_created_at_idx on leads (created_at desc);
create index leads_call_id_idx on leads (call_id) where call_id is not null;

create trigger leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- integrations
-- External integrations per business (Telegram first).
-- type is plain text so adding a new integration type does
-- not require a schema migration.
-- ------------------------------------------------------------

create table integrations (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses on delete cascade,
  type        text not null,
  is_active   boolean not null default true,
  config      jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint integrations_business_type_uq unique (business_id, type)
);

create index integrations_business_id_idx on integrations (business_id);

create trigger integrations_updated_at
  before update on integrations
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

-- Every tenant-scoped table: users can SELECT/UPDATE their own
-- business's data. INSERT and DELETE from the dashboard go
-- through server actions (service role) for MVP, but we
-- include insert policies where dashboard-direct inserts make
-- sense.  The voice server uses the service_role key and
-- bypasses RLS entirely.

-- businesses ------------------------------------------------

alter table businesses enable row level security;

create policy "select own business"
  on businesses for select
  using (id = public.get_business_id());

create policy "update own business"
  on businesses for update
  using (id = public.get_business_id());

-- profiles ---------------------------------------------------

alter table profiles enable row level security;

create policy "select own profile"
  on profiles for select
  using (id = auth.uid());

create policy "update own profile"
  on profiles for update
  using (id = auth.uid());

-- agent_configs ----------------------------------------------

alter table agent_configs enable row level security;

create policy "select own agent configs"
  on agent_configs for select
  using (business_id = public.get_business_id());

create policy "insert own agent configs"
  on agent_configs for insert
  with check (business_id = public.get_business_id());

create policy "update own agent configs"
  on agent_configs for update
  using (business_id = public.get_business_id());

-- calls ------------------------------------------------------

alter table calls enable row level security;

create policy "select own calls"
  on calls for select
  using (business_id = public.get_business_id());

-- call_events ------------------------------------------------

alter table call_events enable row level security;

create policy "select own call events"
  on call_events for select
  using (business_id = public.get_business_id());

-- leads ------------------------------------------------------

alter table leads enable row level security;

create policy "select own leads"
  on leads for select
  using (business_id = public.get_business_id());

create policy "update own leads"
  on leads for update
  using (business_id = public.get_business_id());

-- integrations -----------------------------------------------

alter table integrations enable row level security;

create policy "select own integrations"
  on integrations for select
  using (business_id = public.get_business_id());

create policy "insert own integrations"
  on integrations for insert
  with check (business_id = public.get_business_id());

create policy "update own integrations"
  on integrations for update
  using (business_id = public.get_business_id());

create policy "delete own integrations"
  on integrations for delete
  using (business_id = public.get_business_id());
