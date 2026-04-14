insert into public.admin_users (user_id)
values ('01786dcb-db24-44f2-b251-b8a266848ea3'::uuid)
on conflict (user_id) do nothing;select id, email from auth.users order by created_at desc;