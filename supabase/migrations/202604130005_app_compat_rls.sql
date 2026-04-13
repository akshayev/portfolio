create or replace function public.apply_app_compat_public_read_admin_write_policies(
  target_table text
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
    'create policy %I on public.%I for select to anon, authenticated using (is_active = true)',
    target_table || '_public_select',
    target_table
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

select public.apply_app_compat_public_read_admin_write_policies('settings');
select public.apply_app_compat_public_read_admin_write_policies('hero');
select public.apply_app_compat_public_read_admin_write_policies('about');
select public.apply_app_compat_public_read_admin_write_policies('experience');
select public.apply_app_compat_public_read_admin_write_policies('publications');

drop function if exists public.apply_app_compat_public_read_admin_write_policies(text);
