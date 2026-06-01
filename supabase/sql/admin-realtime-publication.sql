-- Enable Supabase Realtime for admin live refresh tables.
-- Run this in Supabase Dashboard -> SQL Editor.

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'experience_registrations'
  ) then
    alter publication supabase_realtime add table public.experience_registrations;
  end if;
end $$;
