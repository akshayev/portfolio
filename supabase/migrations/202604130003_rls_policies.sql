create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin_user() from public;
grant execute on function public.is_admin_user() to anon, authenticated;

create or replace function public.apply_public_read_admin_write_policies(
  target_table text,
  read_condition text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  execute format('alter table public.%I enable row level security', target_table);

  execute format('drop policy if exists %I on public.%I', target_table || '_public_select', target_table);
  execute format(
    'create policy %I on public.%I for select to anon, authenticated using (%s)',
    target_table || '_public_select',
    target_table,
    read_condition
  );

  execute format('drop policy if exists %I on public.%I', target_table || '_admin_insert', target_table);
  execute format(
    'create policy %I on public.%I for insert to authenticated with check (public.is_admin_user())',
    target_table || '_admin_insert',
    target_table
  );

  execute format('drop policy if exists %I on public.%I', target_table || '_admin_update', target_table);
  execute format(
    'create policy %I on public.%I for update to authenticated using (public.is_admin_user()) with check (public.is_admin_user())',
    target_table || '_admin_update',
    target_table
  );

  execute format('drop policy if exists %I on public.%I', target_table || '_admin_delete', target_table);
  execute format(
    'create policy %I on public.%I for delete to authenticated using (public.is_admin_user())',
    target_table || '_admin_delete',
    target_table
  );
end;
$$;

select public.apply_public_read_admin_write_policies('site_settings', 'is_active = true');
select public.apply_public_read_admin_write_policies('hero_sections', 'is_active = true');
select public.apply_public_read_admin_write_policies('about_sections', 'is_active = true');
select public.apply_public_read_admin_write_policies('contact_settings', 'is_active = true');
select public.apply_public_read_admin_write_policies('global_visual_settings', 'is_active = true');
select public.apply_public_read_admin_write_policies('social_links', 'is_active = true');
select public.apply_public_read_admin_write_policies('skills', 'is_active = true');
select public.apply_public_read_admin_write_policies('experiences', 'is_active = true');
select public.apply_public_read_admin_write_policies('education', 'is_active = true');
select public.apply_public_read_admin_write_policies('certifications', 'is_active = true');
select public.apply_public_read_admin_write_policies('projects', 'is_active = true');

alter table public.import_sources enable row level security;
alter table public.import_logs enable row level security;

drop policy if exists import_sources_admin_select on public.import_sources;
create policy import_sources_admin_select
on public.import_sources
for select
to authenticated
using (public.is_admin_user());

drop policy if exists import_sources_admin_insert on public.import_sources;
create policy import_sources_admin_insert
on public.import_sources
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists import_sources_admin_update on public.import_sources;
create policy import_sources_admin_update
on public.import_sources
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists import_sources_admin_delete on public.import_sources;
create policy import_sources_admin_delete
on public.import_sources
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists import_logs_admin_select on public.import_logs;
create policy import_logs_admin_select
on public.import_logs
for select
to authenticated
using (public.is_admin_user());

drop policy if exists import_logs_admin_insert on public.import_logs;
create policy import_logs_admin_insert
on public.import_logs
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists import_logs_admin_update on public.import_logs;
create policy import_logs_admin_update
on public.import_logs
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists import_logs_admin_delete on public.import_logs;
create policy import_logs_admin_delete
on public.import_logs
for delete
to authenticated
using (public.is_admin_user());

alter table public.admin_users enable row level security;

drop policy if exists admin_users_select on public.admin_users;
create policy admin_users_select
on public.admin_users
for select
to authenticated
using (user_id = auth.uid() or public.is_admin_user());

drop policy if exists admin_users_insert on public.admin_users;
create policy admin_users_insert
on public.admin_users
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists admin_users_update on public.admin_users;
create policy admin_users_update
on public.admin_users
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists admin_users_delete on public.admin_users;
create policy admin_users_delete
on public.admin_users
for delete
to authenticated
using (public.is_admin_user());

drop function if exists public.apply_public_read_admin_write_policies(text, text);
