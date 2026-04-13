-- Replace this UUID with the auth.users.id of your first admin account.
-- Example usage in SQL editor:
--   select * from auth.users order by created_at desc;

insert into public.admin_users (user_id)
values ('00000000-0000-0000-0000-000000000000'::uuid)
on conflict (user_id) do nothing;
