create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 255),
  message text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Allow public form submissions
drop policy if exists "anon_can_insert_contact_messages" on public.contact_messages;
create policy "anon_can_insert_contact_messages"
on public.contact_messages
for insert
to anon
with check (true);

-- Block public reads/updates/deletes by simply not creating those anon policies.