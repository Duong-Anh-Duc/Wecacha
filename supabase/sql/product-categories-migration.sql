-- Wecacha product categories CMS
-- Run in Supabase Dashboard -> SQL Editor.

create table if not exists public.product_categories (
  slug text primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name_vi text not null,
  name_en text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

insert into public.product_categories (slug, name_vi, name_en, sort_order, is_visible)
values
  ('beans', 'Hạt rang', 'Roasted beans', 10, true),
  ('ground', 'Cà phê xay', 'Ground coffee', 20, true),
  ('phin', 'Cà phê phin', 'Phin coffee', 30, true),
  ('gifts', 'Quà tặng', 'Gifts', 40, true)
on conflict (slug) do update
set
  name_vi = excluded.name_vi,
  name_en = excluded.name_en,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible,
  updated_at = now();

alter table public.products
  drop constraint if exists products_category_check;

create index if not exists product_categories_visible_order_idx
  on public.product_categories(is_visible, sort_order);

alter table public.product_categories enable row level security;

drop policy if exists "anyone_read_product_categories" on public.product_categories;
create policy "anyone_read_product_categories"
  on public.product_categories for select
  using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "admin_manage_product_categories" on public.product_categories;
create policy "admin_manage_product_categories"
  on public.product_categories for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
