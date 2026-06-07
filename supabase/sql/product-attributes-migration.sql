create table if not exists public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists bulk_price_tiers jsonb not null default '[]'::jsonb;

insert into public.product_attributes (name, sort_order, is_visible)
values
  ('CÂN NẶNG', 10, true),
  ('MÀU', 20, true),
  ('DUNG TÍCH', 30, true),
  ('KHỐI LƯỢNG', 40, true)
on conflict (name) do nothing;

create index if not exists product_attributes_visible_order_idx
  on public.product_attributes(is_visible, sort_order);

alter table public.product_attributes enable row level security;

drop policy if exists "anyone_read_product_attributes" on public.product_attributes;
create policy "anyone_read_product_attributes"
  on public.product_attributes for select
  using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "admin_manage_product_attributes" on public.product_attributes;
create policy "admin_manage_product_attributes"
  on public.product_attributes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
