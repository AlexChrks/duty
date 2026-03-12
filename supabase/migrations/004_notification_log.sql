-- ============================================================
-- 004: Notification delivery log
--
-- Tracks every outbound notification attempt per lead.
-- provider is plain text (like integrations.type) so adding
-- new channels requires no schema migration.
-- ============================================================

create table notification_log (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses on delete cascade,
  lead_id     uuid references leads on delete set null,
  provider    text not null,
  status      text not null,
  destination text,
  error       text,
  payload     jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index notification_log_business_id_idx
  on notification_log (business_id);

create index notification_log_lead_id_idx
  on notification_log (lead_id)
  where lead_id is not null;

create index notification_log_created_at_idx
  on notification_log (created_at desc);

-- RLS --------------------------------------------------------

alter table notification_log enable row level security;

create policy "select own notification log"
  on notification_log for select
  to authenticated
  using (business_id = public.get_business_id());
