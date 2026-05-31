-- Wecacha CMS upgrade
-- Run this once in Supabase Dashboard -> SQL Editor.

-- 1. Experience registration workflow fields
alter table public.experience_registrations
  add column if not exists status text not null default 'new',
  add column if not exists admin_note text,
  add column if not exists contacted_at timestamptz,
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'experience_registrations_status_check'
  ) then
    alter table public.experience_registrations
      add constraint experience_registrations_status_check
      check (status in ('new', 'contacted', 'closed'));
  end if;
end $$;

-- 2. Article CMS placement and visibility fields
alter table public.news_articles
  add column if not exists is_visible boolean not null default true,
  add column if not exists placement text not null default 'news',
  add column if not exists sort_order integer not null default 0,
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'news_articles_placement_check'
  ) then
    alter table public.news_articles
      add constraint news_articles_placement_check
      check (placement in ('home', 'news', 'both'));
  end if;
end $$;

-- 3. Products for product CRUD
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  slug text not null unique,
  category text not null default 'beans',
  name_vi text not null,
  name_en text not null,
  short_vi text not null default '',
  short_en text not null default '',
  description_vi text not null default '',
  description_en text not null default '',
  farmer_story_vi text not null default '',
  farmer_story_en text not null default '',
  price integer not null default 0,
  original_price integer,
  weight text not null default '',
  altitude text not null default '',
  roast_vi text not null default '',
  roast_en text not null default '',
  origin_vi text not null default '',
  origin_en text not null default '',
  notes_vi text[] not null default '{}',
  notes_en text[] not null default '{}',
  brew_guide_vi text[] not null default '{}',
  brew_guide_en text[] not null default '{}',
  journey_vi jsonb not null default '[]'::jsonb,
  journey_en jsonb not null default '[]'::jsonb,
  images text[] not null default '{}',
  featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0
);

alter table public.products
  add column if not exists journey_vi jsonb not null default '[]'::jsonb,
  add column if not exists journey_en jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_category_check'
  ) then
    alter table public.products
      add constraint products_category_check
      check (category in ('beans', 'ground', 'phin', 'gifts'));
  end if;
end $$;

-- 4. Orders and order items
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text not null default 'new',
  customer_name text not null,
  phone text not null,
  city text not null,
  ward text not null,
  address text not null,
  note text,
  admin_note text,
  subtotal integer not null default 0,
  shipping integer not null default 0,
  total integer not null default 0,
  payment_method text not null default 'cod'
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_status_check'
  ) then
    alter table public.orders
      add constraint orders_status_check
      check (status in ('new', 'confirmed', 'shipping', 'completed', 'cancelled'));
  end if;
end $$;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  image text,
  weight text,
  quantity integer not null default 1,
  price integer not null default 0,
  line_total integer not null default 0
);

-- Helpful indexes for admin lists and public reads
create index if not exists experience_registrations_status_created_idx
  on public.experience_registrations(status, created_at desc);

create index if not exists news_articles_visible_order_idx
  on public.news_articles(is_visible, placement, sort_order, published_at desc);

create index if not exists products_visible_order_idx
  on public.products(is_visible, category, sort_order, created_at desc);

create index if not exists orders_status_created_idx
  on public.orders(status, created_at desc);

create index if not exists order_items_order_id_idx
  on public.order_items(order_id);

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "anyone_read_visible_products" on public.products;
create policy "anyone_read_visible_products"
  on public.products for select
  using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "admin_manage_products" on public.products;
create policy "admin_manage_products"
  on public.products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "anyone_create_orders" on public.orders;
create policy "anyone_create_orders"
  on public.orders for insert
  with check (true);

drop policy if exists "admin_manage_orders" on public.orders;
create policy "admin_manage_orders"
  on public.orders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "anyone_create_order_items" on public.order_items;
create policy "anyone_create_order_items"
  on public.order_items for insert
  with check (true);

drop policy if exists "admin_manage_order_items" on public.order_items;
create policy "admin_manage_order_items"
  on public.order_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
