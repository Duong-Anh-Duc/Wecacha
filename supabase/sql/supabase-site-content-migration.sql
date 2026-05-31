-- Wecacha site content CMS layer
-- Run this after supabase/sql/supabase-cms-migration.sql in Supabase Dashboard -> SQL Editor.

alter table public.products
  add column if not exists journey_vi jsonb not null default '[]'::jsonb,
  add column if not exists journey_en jsonb not null default '[]'::jsonb;

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  key text not null unique,
  path text not null,
  title_vi text not null default '',
  title_en text not null default '',
  description_vi text not null default '',
  description_en text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists public.site_sections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  page_key text not null references public.site_pages(key) on delete cascade,
  section_key text not null,
  type text not null default 'section',
  eyebrow_vi text not null default '',
  eyebrow_en text not null default '',
  title_vi text not null default '',
  title_en text not null default '',
  copy_vi text not null default '',
  copy_en text not null default '',
  quote_vi text not null default '',
  quote_en text not null default '',
  cta_label_vi text not null default '',
  cta_label_en text not null default '',
  cta_href text,
  media jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  constraint site_sections_page_section_unique unique (page_key, section_key)
);

create table if not exists public.site_section_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  page_key text not null,
  section_key text not null,
  item_key text not null,
  type text not null default 'item',
  label_vi text not null default '',
  label_en text not null default '',
  title_vi text not null default '',
  title_en text not null default '',
  subtitle_vi text not null default '',
  subtitle_en text not null default '',
  body_vi text not null default '',
  body_en text not null default '',
  href text,
  media jsonb not null default '{}'::jsonb,
  data jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  constraint site_section_items_section_fk
    foreign key (page_key, section_key)
    references public.site_sections(page_key, section_key)
    on delete cascade,
  constraint site_section_items_unique unique (page_key, section_key, item_key)
);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  review_key text not null unique,
  product_slug text references public.products(slug) on delete set null,
  name_vi text not null default '',
  name_en text not null default '',
  review_vi text not null default '',
  review_en text not null default '',
  rating numeric(2, 1) not null default 5,
  is_verified boolean not null default true,
  avatar_url text,
  is_visible boolean not null default true,
  sort_order integer not null default 0
);

create index if not exists site_pages_visible_order_idx
  on public.site_pages(is_visible, sort_order, key);

create index if not exists site_sections_page_order_idx
  on public.site_sections(page_key, is_visible, sort_order);

create index if not exists site_section_items_section_order_idx
  on public.site_section_items(page_key, section_key, is_visible, sort_order);

create index if not exists product_reviews_visible_order_idx
  on public.product_reviews(product_slug, is_visible, sort_order);

alter table public.site_pages enable row level security;
alter table public.site_sections enable row level security;
alter table public.site_section_items enable row level security;
alter table public.product_reviews enable row level security;

drop policy if exists "anyone_read_visible_site_pages" on public.site_pages;
create policy "anyone_read_visible_site_pages"
  on public.site_pages for select
  using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "admin_manage_site_pages" on public.site_pages;
create policy "admin_manage_site_pages"
  on public.site_pages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "anyone_read_visible_site_sections" on public.site_sections;
create policy "anyone_read_visible_site_sections"
  on public.site_sections for select
  using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "admin_manage_site_sections" on public.site_sections;
create policy "admin_manage_site_sections"
  on public.site_sections for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "anyone_read_visible_site_section_items" on public.site_section_items;
create policy "anyone_read_visible_site_section_items"
  on public.site_section_items for select
  using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "admin_manage_site_section_items" on public.site_section_items;
create policy "admin_manage_site_section_items"
  on public.site_section_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "anyone_read_visible_product_reviews" on public.product_reviews;
create policy "anyone_read_visible_product_reviews"
  on public.product_reviews for select
  using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "admin_manage_product_reviews" on public.product_reviews;
create policy "admin_manage_product_reviews"
  on public.product_reviews for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
