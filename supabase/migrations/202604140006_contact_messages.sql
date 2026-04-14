create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at);

alter table public.contact_messages enable row level security;

drop policy if exists contact_messages_anon_insert on public.contact_messages;
create policy contact_messages_anon_insert
on public.contact_messages
for insert
to anon
with check (true);

drop policy if exists contact_messages_service_role_all on public.contact_messages;
create policy contact_messages_service_role_all
on public.contact_messages
for all
to service_role
using (true)
with check (true);
