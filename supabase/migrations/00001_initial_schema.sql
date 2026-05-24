-- Pickly Initial Schema (idempotent)
-- Safe to run multiple times

-- ─── Extensions ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "pg_trgm" with schema extensions;
create extension if not exists "cube" with schema extensions;
create extension if not exists "earthdistance" with schema extensions;

-- ─── Users (extends Supabase auth.users) ────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  avatar      text,
  skill_level text not null default 'beginner'
                check (skill_level in ('beginner','3.0','3.5','4.0','4.5','5.0+')),
  city        text,
  zip         text,
  lat         double precision,
  lng         double precision,
  dupr_rating numeric(3,1),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can view all profiles') then
    create policy "Users can view all profiles" on public.profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
end $$;

-- ─── Courts ─────────────────────────────────────────────────────────────────

create table if not exists public.courts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  address      text not null,
  lat          double precision not null,
  lng          double precision not null,
  indoor       boolean not null default false,
  surface_type text not null default 'asphalt'
                 check (surface_type in ('asphalt','concrete','sport_court')),
  num_courts   integer not null default 1,
  amenities    text[] default '{}',
  photos       text[] default '{}',
  created_by   uuid references public.profiles(id),
  verified     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.courts enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'courts' and policyname = 'Courts are publicly viewable') then
    create policy "Courts are publicly viewable" on public.courts for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'courts' and policyname = 'Authenticated users can create courts') then
    create policy "Authenticated users can create courts" on public.courts for insert with check (auth.role() = 'authenticated');
  end if;
end $$;

-- ─── Games ──────────────────────────────────────────────────────────────────

create table if not exists public.games (
  id            uuid primary key default gen_random_uuid(),
  court_id      uuid not null references public.courts(id) on delete cascade,
  host_id       uuid not null references public.profiles(id) on delete cascade,
  date          date not null,
  start_time    time not null,
  skill_min     text not null default '3.0'
                  check (skill_min in ('beginner','3.0','3.5','4.0','4.5','5.0+')),
  skill_max     text not null default '4.0'
                  check (skill_max in ('beginner','3.0','3.5','4.0','4.5','5.0+')),
  max_players   integer not null check (max_players >= 2),
  current_count integer not null default 1,
  notes         text,
  status        text not null default 'open'
                  check (status in ('open','full','completed','cancelled')),
  created_at    timestamptz not null default now()
);

alter table public.games enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'games' and policyname = 'Games are publicly viewable') then
    create policy "Games are publicly viewable" on public.games for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'games' and policyname = 'Authenticated users can create games') then
    create policy "Authenticated users can create games" on public.games for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'games' and policyname = 'Hosts can update their games') then
    create policy "Hosts can update their games" on public.games for update using (auth.uid() = host_id);
  end if;
end $$;

-- ─── Match Requests ─────────────────────────────────────────────────────────

create table if not exists public.match_requests (
  id         uuid primary key default gen_random_uuid(),
  game_id    uuid not null references public.games(id) on delete cascade,
  player_id  uuid not null references public.profiles(id) on delete cascade,
  status     text not null default 'pending'
               check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  unique(game_id, player_id)
);

alter table public.match_requests enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'match_requests' and policyname = 'Players can view own requests') then
    create policy "Players can view own requests" on public.match_requests for select using (auth.uid() = player_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'match_requests' and policyname = 'Hosts can view requests for their games') then
    create policy "Hosts can view requests for their games" on public.match_requests for select using (
      exists (select 1 from public.games where games.id = match_requests.game_id and games.host_id = auth.uid())
    );
  end if;
  if not exists (select 1 from pg_policies where tablename = 'match_requests' and policyname = 'Players can create requests') then
    create policy "Players can create requests" on public.match_requests for insert with check (auth.uid() = player_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'match_requests' and policyname = 'Hosts can update requests') then
    create policy "Hosts can update requests" on public.match_requests for update using (
      exists (select 1 from public.games where games.id = match_requests.game_id and games.host_id = auth.uid())
    );
  end if;
end $$;

-- ─── Tournaments ────────────────────────────────────────────────────────────

create table if not exists public.tournaments (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  court_id      uuid references public.courts(id) on delete set null,
  organizer_id  uuid not null references public.profiles(id) on delete cascade,
  date          date not null,
  format        text not null
                  check (format in ('singles','doubles','round_robin','single_elim')),
  max_players   integer not null check (max_players >= 2),
  entry_fee     numeric(10,2),
  status        text not null default 'draft'
                  check (status in ('draft','registration_open','in_progress','completed')),
  public_slug   text not null unique,
  created_at    timestamptz not null default now()
);

alter table public.tournaments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'tournaments' and policyname = 'Tournaments are publicly viewable') then
    create policy "Tournaments are publicly viewable" on public.tournaments for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tournaments' and policyname = 'Auth users can create tournaments') then
    create policy "Auth users can create tournaments" on public.tournaments for insert with check (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'tournaments' and policyname = 'Organizers can update tournaments') then
    create policy "Organizers can update tournaments" on public.tournaments for update using (auth.uid() = organizer_id);
  end if;
end $$;

-- ─── Registrations ─────────────────────────────────────────────────────────

create table if not exists public.registrations (
  id              uuid primary key default gen_random_uuid(),
  tournament_id   uuid not null references public.tournaments(id) on delete cascade,
  player_id       uuid not null references public.profiles(id) on delete cascade,
  registered_at   timestamptz not null default now(),
  paid            boolean not null default false,
  unique(tournament_id, player_id)
);

alter table public.registrations enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'registrations' and policyname = 'Registrations are viewable by participants and organizers') then
    create policy "Registrations are viewable by participants and organizers"
      on public.registrations for select using (
        auth.uid() = player_id or
        exists (select 1 from public.tournaments where tournaments.id = registrations.tournament_id and tournaments.organizer_id = auth.uid())
      );
  end if;
  if not exists (select 1 from pg_policies where tablename = 'registrations' and policyname = 'Players can register') then
    create policy "Players can register" on public.registrations for insert with check (auth.uid() = player_id);
  end if;
end $$;

-- ─── Brackets ───────────────────────────────────────────────────────────────

create table if not exists public.brackets (
  id             uuid primary key default gen_random_uuid(),
  tournament_id  uuid not null references public.tournaments(id) on delete cascade,
  rounds         jsonb not null default '[]'::jsonb,
  unique(tournament_id)
);

alter table public.brackets enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'brackets' and policyname = 'Brackets are publicly viewable') then
    create policy "Brackets are publicly viewable" on public.brackets for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'brackets' and policyname = 'Organizers can manage brackets') then
    create policy "Organizers can manage brackets" on public.brackets for insert with check (
      exists (select 1 from public.tournaments where tournaments.id = brackets.tournament_id and tournaments.organizer_id = auth.uid())
    );
  end if;
  if not exists (select 1 from pg_policies where tablename = 'brackets' and policyname = 'Organizers can update brackets') then
    create policy "Organizers can update brackets" on public.brackets for update using (
      exists (select 1 from public.tournaments where tournaments.id = brackets.tournament_id and tournaments.organizer_id = auth.uid())
    );
  end if;
end $$;

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists idx_courts_location on public.courts using gist (ll_to_earth(lat, lng));
create index if not exists idx_games_date on public.games(date);
create index if not exists idx_games_court on public.games(court_id);
create index if not exists idx_tournaments_date on public.tournaments(date);
create index if not exists idx_tournaments_slug on public.tournaments(public_slug);
create index if not exists idx_match_requests_game on public.match_requests(game_id);
create index if not exists idx_registrations_tournament on public.registrations(tournament_id);

-- ─── Auto-create profile on signup ─────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, skill_level)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', 'Player'), 'beginner');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
