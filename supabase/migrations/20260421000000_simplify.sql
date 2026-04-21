-- =============================================================================
-- 20260421000000_simplify.sql
-- Radical simplification. Drops the multi-schema (core/content/analytics/staging)
-- setup and replaces it with two tables in `public`:
--
--   public.seasons           -- one row per season, BBR-flavored stats columns.
--   public.tournament_games  -- one row per NCAA tournament game for the timeline.
--
-- Everything the app needs comes from these two tables. No views, no enums,
-- no RLS acrobatics — just SELECT-all policies so the anon/publishable key
-- can read them.
-- =============================================================================

drop schema if exists staging   cascade;
drop schema if exists analytics cascade;
drop schema if exists content   cascade;
drop schema if exists core      cascade;

-- ---------------------------------------------------------------------------
-- public.seasons
-- Each row is a single UConn season. Columns are grouped by BBR section so
-- it's obvious where each value comes from when pasting from the BBR season
-- page.
-- ---------------------------------------------------------------------------
create table if not exists public.seasons (
  id                    text primary key,                          -- '2022-23'
  title                 text not null,                             -- '2022-23 The Return'
  summary               text,
  sort_order            integer not null default 0,

  hero_video_bucket     text,                                      -- Supabase Storage bucket
  hero_video_path       text,                                      -- object path within the bucket
  uconn_logo_path       text default '/logos/uconn.png',

  head_coach            text,

  -- BBR: School Stats (record / standings)
  games                 integer,
  wins                  integer,
  losses                integer,
  conference            text,
  conf_wins             integer,
  conf_losses           integer,
  ap_preseason_rank     integer,
  ap_final_rank         integer,

  -- BBR: Advanced
  srs                   numeric(6,2),
  sos                   numeric(6,2),
  pace                  numeric(5,1),
  off_rtg               numeric(5,1),
  def_rtg               numeric(5,1),

  -- BBR: Team Per-Game
  mp_per_game           numeric(4,1),
  fg_per_game           numeric(4,1),
  fga_per_game          numeric(4,1),
  fg_pct                numeric(4,3),
  fg3_per_game          numeric(4,1),
  fg3a_per_game         numeric(4,1),
  fg3_pct               numeric(4,3),
  ft_per_game           numeric(4,1),
  fta_per_game          numeric(4,1),
  ft_pct                numeric(4,3),
  orb_per_game          numeric(4,1),
  trb_per_game          numeric(4,1),
  ast_per_game          numeric(4,1),
  stl_per_game          numeric(4,1),
  blk_per_game          numeric(4,1),
  tov_per_game          numeric(4,1),
  pf_per_game           numeric(4,1),
  pts_per_game          numeric(5,1),

  -- BBR: Opponent Per-Game (parallel to Team Per-Game)
  opp_fg_per_game       numeric(4,1),
  opp_fga_per_game      numeric(4,1),
  opp_fg_pct            numeric(4,3),
  opp_fg3_per_game      numeric(4,1),
  opp_fg3a_per_game     numeric(4,1),
  opp_fg3_pct           numeric(4,3),
  opp_ft_per_game       numeric(4,1),
  opp_fta_per_game      numeric(4,1),
  opp_ft_pct            numeric(4,3),
  opp_orb_per_game      numeric(4,1),
  opp_trb_per_game      numeric(4,1),
  opp_ast_per_game      numeric(4,1),
  opp_stl_per_game      numeric(4,1),
  opp_blk_per_game      numeric(4,1),
  opp_tov_per_game      numeric(4,1),
  opp_pf_per_game       numeric(4,1),
  opp_pts_per_game      numeric(5,1),

  -- Postseason
  ncaa_seed             integer,
  postseason_result     text,                                      -- 'National Champion', 'Elite Eight', etc.

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists ix_seasons_sort_order on public.seasons (sort_order);

-- ---------------------------------------------------------------------------
-- public.tournament_games
-- One row per NCAA tournament game. Pure UI data — the round text is whatever
-- shows up in the Timeline, and game_date / opponent / scores drive the card.
-- ---------------------------------------------------------------------------
create table if not exists public.tournament_games (
  id                    bigint generated always as identity primary key,
  season_id             text not null references public.seasons(id) on delete cascade,

  round_order           smallint not null,                         -- 1..7
  round                 text     not null,                         -- 'Round of 64' .. 'National Championship'
  game_date             date     not null,
  opponent              text     not null,
  opponent_logo_path    text,                                      -- e.g. '/logos/iona.png'
  uconn_score           integer,
  opponent_score        integer,
  description           text,
  highlight_clip_url    text,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  unique (season_id, round_order)
);

create index if not exists ix_tournament_games_season
  on public.tournament_games (season_id, round_order);

-- ---------------------------------------------------------------------------
-- Keep updated_at fresh on row updates.
-- ---------------------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists tg_seasons_updated_at on public.seasons;
create trigger tg_seasons_updated_at
  before update on public.seasons
  for each row execute function public.tg_set_updated_at();

drop trigger if exists tg_tournament_games_updated_at on public.tournament_games;
create trigger tg_tournament_games_updated_at
  before update on public.tournament_games
  for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: everyone can read. Writes via service_role only (implicit).
-- ---------------------------------------------------------------------------
alter table public.seasons           enable row level security;
alter table public.tournament_games  enable row level security;

drop policy if exists seasons_read_all           on public.seasons;
drop policy if exists tournament_games_read_all  on public.tournament_games;

create policy seasons_read_all           on public.seasons           for select using (true);
create policy tournament_games_read_all  on public.tournament_games  for select using (true);

grant select on public.seasons           to anon, authenticated;
grant select on public.tournament_games  to anon, authenticated;
grant all    on public.seasons           to service_role;
grant all    on public.tournament_games  to service_role;
