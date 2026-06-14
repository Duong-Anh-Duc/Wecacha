-- Flavor wheel analytics: track flavor selections (clicks) and quiz completions (submits)
-- Run this in Supabase SQL Editor.

create table if not exists public.flavor_wheel_events (
  id uuid primary key default gen_random_uuid(),
  flavor_key text not null,
  type text not null check (type in ('click', 'submit')),
  locale text not null default 'vi',
  created_at timestamptz not null default now()
);

create index if not exists flavor_wheel_events_flavor_idx on public.flavor_wheel_events (flavor_key);
create index if not exists flavor_wheel_events_type_idx on public.flavor_wheel_events (type);
create index if not exists flavor_wheel_events_created_idx on public.flavor_wheel_events (created_at);

-- Row Level Security: allow anonymous inserts (public visitors record events),
-- block public reads. Admin reads happen via the service-role key (bypasses RLS).
alter table public.flavor_wheel_events enable row level security;

drop policy if exists "flavor_wheel_events public insert" on public.flavor_wheel_events;
create policy "flavor_wheel_events public insert"
  on public.flavor_wheel_events
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated admins can read the events for the stats dashboard.
drop policy if exists "flavor_wheel_events admin read" on public.flavor_wheel_events;
create policy "flavor_wheel_events admin read"
  on public.flavor_wheel_events
  for select
  to authenticated
  using (true);
