-- =============================================
-- BẢNG 1: Đăng ký trải nghiệm
-- =============================================
create table if not exists experience_registrations (
  id         uuid        default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name       text        not null,
  phone      text        not null,
  address    text,
  note       text
);

-- =============================================
-- BẢNG 2: Bài viết tin tức
-- =============================================
create table if not exists news_articles (
  id                  uuid        default gen_random_uuid() primary key,
  created_at          timestamptz default now(),
  published_at        timestamptz default now(),
  slug                text        not null unique,
  title_vi            text        not null,
  title_en            text        not null,
  intro_vi            text        not null,
  intro_en            text        not null,
  content_vi          text        not null,
  content_en          text        not null,
  image_url           text,
  secondary_image_url text
);

-- =============================================
-- BẬT ROW LEVEL SECURITY
-- =============================================
alter table experience_registrations enable row level security;
alter table news_articles enable row level security;

-- =============================================
-- POLICY: experience_registrations
-- =============================================
create policy "anyone_can_register" on experience_registrations
  for insert with check (true);

create policy "admin_manage_registrations" on experience_registrations
  for all using (auth.role() = 'authenticated');

-- =============================================
-- POLICY: news_articles
-- =============================================
create policy "anyone_read_articles" on news_articles
  for select using (true);

create policy "admin_manage_articles" on news_articles
  for all using (auth.role() = 'authenticated');
