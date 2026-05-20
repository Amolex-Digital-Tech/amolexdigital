-- Supabase schema for Amolex multi-tenant auth, social data, and reporting
-- Run this in the Supabase SQL editor or via `supabase db push`.

-- Extensions (enabled by default in Supabase, kept for local dev)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ========== Core auth/profile ==========
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active',
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'member',
  default_tenant uuid references public.tenants (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (user_id, tenant_id)
);

-- Keep profile in sync with auth.users metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  new_tenant_id uuid;
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;

  insert into public.tenants (name, slug, created_by)
  values (
    coalesce(new.raw_user_meta_data->>'company', 'Personal workspace'),
    'tenant-' || substr(new.id::text, 1, 8),
    new.id
  )
  on conflict (slug) do nothing
  returning id into new_tenant_id;

  -- Create owner membership for the user in their seed tenant
  insert into public.memberships (user_id, tenant_id, role)
  values (new.id, coalesce(new_tenant_id, (select id from public.tenants where created_by = new.id limit 1)), 'owner')
  on conflict (user_id, tenant_id) do nothing;

  update public.profiles
  set default_tenant = coalesce(new_tenant_id, default_tenant)
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========== Social data ==========
create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  provider text not null,
  account_handle text not null,
  external_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.social_posts (
  id bigserial primary key,
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  social_account_id uuid not null references public.social_accounts (id) on delete cascade,
  posted_at timestamptz not null default now(),
  content text,
  external_id text,
  metrics jsonb not null default '{}'::jsonb, -- impressions, clicks, likes, etc.
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists social_posts_tenant_idx on public.social_posts (tenant_id, posted_at desc);
create index if not exists social_posts_account_idx on public.social_posts (social_account_id, posted_at desc);

-- ========== Reporting ==========
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  title text not null,
  report_type text not null, -- e.g., "social-summary", "web-traffic"
  period_start date,
  period_end date,
  payload jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ========== Clients table for Telegram messaging ==========
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  email text not null unique,
  password text not null,
  telegram_username text,
  telegram_chat_id text,
  first_name text,
  supabase_user_id uuid,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists clients_telegram_username_idx on public.clients (telegram_username);
create index if not exists clients_email_idx on public.clients (email);

-- Row level security for clients
alter table public.clients enable row level security;

create policy "Clients readable to service role" on public.clients
  for select using (auth.role() = 'service_role');
create policy "Clients insert by service role" on public.clients
  for insert with check (auth.role() = 'service_role');
create policy "Clients update by service role" on public.clients
  for update using (auth.role() = 'service_role');
create policy "Clients delete by service role" on public.clients
  for delete using (auth.role() = 'service_role');

create table if not exists public.ingestion_logs (
  id bigserial primary key,
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  source text not null, -- facebook, twitter, custom-api, etc.
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  stats jsonb not null default '{}'::jsonb,
  error text
);

-- Daily social summary view for quick reporting
drop view if exists public.social_daily_summary;
create view public.social_daily_summary as
select
  tenant_id,
  social_account_id,
  date_trunc('day', posted_at) as day,
  count(*) as posts,
  coalesce(sum((metrics->>'impressions')::bigint), 0) as impressions,
  coalesce(sum((metrics->>'clicks')::bigint), 0) as clicks,
  coalesce(sum((metrics->>'likes')::bigint), 0) as likes,
  coalesce(sum((metrics->>'shares')::bigint), 0) as shares
from public.social_posts
group by tenant_id, social_account_id, date_trunc('day', posted_at);

-- ========== Row Level Security ==========
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.social_accounts enable row level security;
alter table public.social_posts enable row level security;
alter table public.reports enable row level security;
alter table public.ingestion_logs enable row level security;

-- Profiles
create policy "Profiles are self-visible" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles self-update" on public.profiles
  for update using (auth.uid() = id);
create policy "Profiles delete by self" on public.profiles
  for delete using (auth.uid() = id);

-- Tenants
create policy "Tenant readable to members" on public.tenants
  for select using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = tenants.id and m.user_id = auth.uid()
    )
  );
create policy "Tenant update for admins" on public.tenants
  for update using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = tenants.id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
create policy "Tenant delete by admins" on public.tenants
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = tenants.id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );

-- Tenant insert by members with existing tenant access
create policy "Tenant insert by members" on public.tenants
  for insert with check (
    exists (
      select 1 from public.memberships 
      where user_id = auth.uid()
    )
  );

-- Memberships
create policy "Membership readable to self" on public.memberships
  for select using (user_id = auth.uid());
create policy "Membership insert by tenant admins" on public.memberships
  for insert with check (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = memberships.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
create policy "Membership delete by tenant admins" on public.memberships
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = memberships.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );

-- Social accounts
create policy "Social accounts readable to tenant members" on public.social_accounts
  for select using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = social_accounts.tenant_id and m.user_id = auth.uid()
    )
  );
create policy "Social accounts insert by tenant admins" on public.social_accounts
  for insert with check (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = social_accounts.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
create policy "Social accounts update by tenant admins" on public.social_accounts
  for update using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = social_accounts.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
create policy "Social accounts delete by tenant admins" on public.social_accounts
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = social_accounts.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );

-- Social posts
create policy "Social posts readable to tenant members" on public.social_posts
  for select using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = social_posts.tenant_id and m.user_id = auth.uid()
    )
  );
create policy "Social posts insert by tenant admins" on public.social_posts
  for insert with check (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = social_posts.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
create policy "Social posts delete by tenant admins" on public.social_posts
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = social_posts.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );

-- Reports
create policy "Reports readable to tenant members" on public.reports
  for select using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = reports.tenant_id and m.user_id = auth.uid()
    )
  );
create policy "Reports insert by tenant admins" on public.reports
  for insert with check (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = reports.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
create policy "Reports update by tenant admins" on public.reports
  for update using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = reports.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
create policy "Reports delete by tenant admins" on public.reports
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = reports.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );

-- Ingestion logs
create policy "Ingestion logs readable to tenant admins" on public.ingestion_logs
  for select using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = ingestion_logs.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin','analyst')
    )
  );
create policy "Ingestion logs insert by service role" on public.ingestion_logs
  for insert with check (auth.role() = 'service_role');
create policy "Ingestion logs delete by tenant admins" on public.ingestion_logs
  for delete using (
    exists (
      select 1 from public.memberships m
      where m.tenant_id = ingestion_logs.tenant_id and m.user_id = auth.uid() and m.role in ('owner','admin')
    )
  );
