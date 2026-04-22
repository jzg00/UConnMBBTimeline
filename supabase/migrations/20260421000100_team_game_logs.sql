-- =============================================================================
-- 20260421000100_team_game_logs.sql
-- Adds public.team_game_logs: one row per game, mirrors the BBR "Team Game Log
-- (Basic)" CSV export 1:1 plus a `season_id` column that the importer adds.
-- Verified against https://www.sports-reference.com/cbb/schools/connecticut/men/2023-gamelogs.html
-- (2022-23 season, 39 games: 31 REG + 2 CTOURN + 6 NCAA).
-- =============================================================================

create table if not exists public.team_game_logs (
  -- identity / links
  season_id     text        not null references public.seasons(id) on delete cascade,
  rk            integer,                                         -- BBR "Rk" (row index on the BBR page)
  game_num      integer     not null,                            -- BBR "Gtm"
  game_date     date        not null,                            -- BBR "Date"
  venue         text        check (venue is null or venue in ('@', 'N')),
                                                                 -- BBR blank col: NULL = home, '@' = away, 'N' = neutral
  opponent      text        not null,                            -- BBR "Opp" (col 5)
  game_type     text,                                            -- BBR "Type": 'REG (Non-Conf)', 'REG (Conf)', 'CTOURN', 'ROUND-64', 'ROUND-32', 'ROUND-16', 'ROUND-8', 'NATIONAL-SEMI', 'NATIONAL-FINAL'
  result        text        check (result in ('W','L')),         -- BBR "Rslt"
  team_pts      integer,                                         -- BBR "Tm"
  opp_pts       integer,                                         -- BBR "Opp" (col 9)
  ot            text,                                             -- BBR "OT": '', 'OT', '2OT', ...

  -- Team box score (BBR cols 11..31)
  fg            integer,
  fga           integer,
  fg_pct        numeric(5,3),
  three_p       integer,                                         -- BBR "3P"
  three_pa      integer,                                         -- BBR "3PA"
  three_pct     numeric(5,3),                                    -- BBR "3P%"
  two_p         integer,                                         -- BBR "2P"
  two_pa        integer,                                         -- BBR "2PA"
  two_pct       numeric(5,3),                                    -- BBR "2P%"
  efg_pct       numeric(5,3),                                    -- BBR "eFG%"
  ft            integer,
  fta           integer,
  ft_pct        numeric(5,3),
  orb           integer,
  drb           integer,
  trb           integer,
  ast           integer,
  stl           integer,
  blk           integer,
  tov           integer,
  pf            integer,

  -- Opponent box score (BBR cols 32..52)
  opp_fg        integer,
  opp_fga       integer,
  opp_fg_pct    numeric(5,3),
  opp_three_p   integer,
  opp_three_pa  integer,
  opp_three_pct numeric(5,3),
  opp_two_p     integer,
  opp_two_pa    integer,
  opp_two_pct   numeric(5,3),
  opp_efg_pct   numeric(5,3),
  opp_ft        integer,
  opp_fta       integer,
  opp_ft_pct    numeric(5,3),
  opp_orb       integer,
  opp_drb       integer,
  opp_trb       integer,
  opp_ast       integer,
  opp_stl       integer,
  opp_blk       integer,
  opp_tov       integer,
  opp_pf        integer,

  -- bookkeeping
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  primary key (season_id, game_num),
  unique (season_id, game_date, opponent)
);

create index if not exists ix_team_game_logs_season_date
  on public.team_game_logs (season_id, game_date);

create index if not exists ix_team_game_logs_season_type
  on public.team_game_logs (season_id, game_type);

-- ---------------------------------------------------------------------------
-- updated_at trigger, reusing the helper from 20260421000000_simplify.sql.
-- ---------------------------------------------------------------------------
drop trigger if exists tg_team_game_logs_updated_at on public.team_game_logs;
create trigger tg_team_game_logs_updated_at
  before update on public.team_game_logs
  for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: public read, writes via service_role only. Mirrors seasons / tournament_games.
-- ---------------------------------------------------------------------------
alter table public.team_game_logs enable row level security;

drop policy if exists team_game_logs_read_all on public.team_game_logs;
create policy team_game_logs_read_all on public.team_game_logs for select using (true);

grant select on public.team_game_logs to anon, authenticated;
grant all    on public.team_game_logs to service_role;
