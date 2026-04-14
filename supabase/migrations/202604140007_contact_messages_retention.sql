create extension if not exists pg_cron with schema extensions;

create or replace function public.purge_old_contact_messages()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  delete from public.contact_messages
  where created_at < now() - interval '180 days';

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_old_contact_messages() from public;
grant execute on function public.purge_old_contact_messages() to service_role;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    if not exists (
      select 1
      from cron.job
      where jobname = 'purge_old_contact_messages_daily'
    ) then
      perform cron.schedule(
        'purge_old_contact_messages_daily',
        '17 3 * * *',
        'select public.purge_old_contact_messages();'
      );
    end if;
  end if;
end;
$$;
