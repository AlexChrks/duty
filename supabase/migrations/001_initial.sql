-- Lead statuses and sources
create type lead_status as enum ('new', 'contacted', 'converted', 'archived');
create type lead_source as enum ('voice', 'manual', 'api');
create type business_vertical as enum ('taxi', 'car_service', 'other');

-- Businesses
create table businesses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  vertical business_vertical not null default 'other',
  telegram_chat_id text,
  settings jsonb
);

alter table businesses enable row level security;

create policy "Users can view own businesses"
  on businesses for select using (auth.uid() = owner_id);
create policy "Users can insert own businesses"
  on businesses for insert with check (auth.uid() = owner_id);
create policy "Users can update own businesses"
  on businesses for update using (auth.uid() = owner_id);

-- Leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  business_id uuid not null references businesses(id) on delete cascade,
  caller_phone text not null,
  caller_name text,
  summary text,
  status lead_status not null default 'new',
  metadata jsonb,
  source lead_source not null default 'voice'
);

alter table leads enable row level security;

create policy "Users can view leads for their businesses"
  on leads for select using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );
create policy "Users can update leads for their businesses"
  on leads for update using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );
-- Service role inserts (from voice webhook) bypass RLS

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger businesses_updated_at
  before update on businesses
  for each row execute function update_updated_at();

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- Indexes
create index leads_business_id_idx on leads(business_id);
create index leads_status_idx on leads(status);
create index leads_created_at_idx on leads(created_at desc);
