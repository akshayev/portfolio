create table if not exists public.contact_messages_archive (
  id uuid primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null,
  archived_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_archive_created_at
on public.contact_messages_archive(created_at);

create index if not exists idx_contact_messages_archive_archived_at
on public.contact_messages_archive(archived_at);

create or replace function public.purge_old_contact_messages()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  insert into public.contact_messages_archive (id, name, email, message, created_at, archived_at)
  select id, name, email, message, created_at, now()
  from public.contact_messages
  where created_at < now() - interval '180 days'
  on conflict (id) do nothing;

  delete from public.contact_messages
  where created_at < now() - interval '180 days';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on public.contact_messages_archive from public;
grant select, insert, update, delete on public.contact_messages_archive to service_role;

revoke all on function public.purge_old_contact_messages() from public;
grant execute on function public.purge_old_contact_messages() to service_role;
