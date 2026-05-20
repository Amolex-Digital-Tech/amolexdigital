# Supabase setup

1. Create a Supabase project and grab `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (Settings → API). Copy them into `.env.local` using `.env.example` as a template.
2. Apply the schema: open `supabase/schema.sql` in the Supabase SQL editor and run it, or run `supabase db push` if you use the CLI.
3. The `handle_new_user` trigger seeds a personal tenant and membership for every new sign-up. Add extra tenants by inserting into `tenants` and `memberships`.
4. Roles come from the Supabase user metadata `role` (fallbacks to `member`). Set `role` and `tenant_id` via the Supabase dashboard or Admin API after inviting users.
5. The dashboard uses Supabase auth for `requireAdminSession`; only `owner` and `admin` roles can access protected pages.
6. Example data fetching: `GET /api/reports` returns reports for the signed-in user’s tenant.
