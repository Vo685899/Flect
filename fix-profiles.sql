-- Run this in Supabase SQL Editor if signup is failing
-- It fixes the profiles table to allow upsert on signup

-- Drop and recreate the trigger function more robustly
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', '')
  )
  on conflict (id) do update
    set display_name = coalesce(excluded.display_name, profiles.display_name);
  return new;
end;
$$ language plpgsql security definer;

-- Make sure RLS allows the upsert from the client
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
