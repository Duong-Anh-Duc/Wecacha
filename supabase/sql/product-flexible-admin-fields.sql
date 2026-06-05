-- Flexible product admin fields for modal product form.
-- Run this in Supabase SQL Editor before relying on multi-category and price-tier persistence.

create table if not exists public.products_backup_before_flexible_admin_20260603
as table public.products;

alter table public.products
  add column if not exists category_slugs text[] not null default '{}',
  add column if not exists price_tiers jsonb not null default '[]'::jsonb,
  add column if not exists base_unit text not null default '';

update public.products
set category_slugs = array[category]
where coalesce(array_length(category_slugs, 1), 0) = 0
  and coalesce(category, '') <> '';

create index if not exists products_category_slugs_gin_idx
  on public.products using gin (category_slugs);

create index if not exists products_price_tiers_gin_idx
  on public.products using gin (price_tiers);
