-- =============================================================================
-- seed.sql
-- Bootstraps the two championship seasons (2022-23 "The Return" and
-- 2023-24 "Back to Back") so the timeline has content to render immediately.
-- BBR stats columns are left NULL for now; fill them in from the BBR season
-- pages whenever you're ready.
--
-- Safe to re-run: uses UPSERT on (id) for seasons, and clears tournament_games
-- for the seeded seasons before inserting.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Seasons
-- ---------------------------------------------------------------------------
insert into public.seasons (
  id, title, summary, sort_order,
  hero_video_bucket, hero_video_path, uconn_logo_path,
  head_coach,
  games, wins, losses,
  ncaa_seed, postseason_result
) values
(
  '2022-23',
  '2022-23 The Return',
  'A dominant March run that culminated in UConn''s fifth national title, marking a return to the top and ushering in the Dan Hurley era.',
  10,
  'hero-videos', 'uconn2023hero.mp4', '/logos/uconn.png',
  'Dan Hurley',
  39, 31, 8,
  4, 'National Champion'
),
(
  '2023-24',
  '2023-24 Back to Back',
  'A powerhouse season that ended with UConn repeating as national champions and capturing its sixth title, highlighted by the program''s first-ever No. 1 overall seed in the NCAA Tournament.',
  20,
  'hero-videos', 'uconn2024hero.mp4', '/logos/uconn.png',
  'Dan Hurley',
  40, 37, 3,
  1, 'National Champion'
),
(
  '2025-26',
  '2025-26 Season',
  'Coming soon.',
  30,
  null, null, '/logos/uconn.png',
  null,
  null, null, null,
  null, null
)
on conflict (id) do update set
  title             = excluded.title,
  summary           = excluded.summary,
  sort_order        = excluded.sort_order,
  hero_video_bucket = excluded.hero_video_bucket,
  hero_video_path   = excluded.hero_video_path,
  uconn_logo_path   = excluded.uconn_logo_path,
  head_coach        = excluded.head_coach,
  games             = excluded.games,
  wins              = excluded.wins,
  losses            = excluded.losses,
  ncaa_seed         = excluded.ncaa_seed,
  postseason_result = excluded.postseason_result;

-- ---------------------------------------------------------------------------
-- Tournament games
-- Delete first so re-running the seed never leaves duplicates.
-- ---------------------------------------------------------------------------
delete from public.tournament_games where season_id in ('2022-23', '2023-24');

insert into public.tournament_games (
  season_id, round_order, round, game_date,
  opponent, opponent_logo_path,
  uconn_score, opponent_score, description
) values
-- 2022-23
('2022-23', 2, 'Round of 64',           '2023-03-17', 'Iona',              '/logos/iona.png',          87, 63,
  'UConn survives early pressure, then takes over in the second half to begin the tournament run.'),
('2022-23', 3, 'Round of 32',           '2023-03-19', 'Saint Mary''s',     '/logos/saint-marys.png',   70, 55,
  'A sharp two-way performance sends UConn comfortably into the Sweet 16.'),
('2022-23', 4, 'Sweet 16',              '2023-03-23', 'Arkansas',          '/logos/arkansas.png',      88, 65,
  'The Huskies handle a dangerous Arkansas team and keep building momentum.'),
('2022-23', 5, 'Elite Eight',           '2023-03-25', 'Gonzaga',           '/logos/gonzaga.png',       82, 54,
  'One of the most convincing wins of the run puts UConn in the Final Four.'),
('2022-23', 6, 'Final Four',            '2023-04-01', 'Miami',             '/logos/miami.png',         72, 59,
  'UConn controls the game and punches its ticket to the national championship.'),
('2022-23', 7, 'National Championship', '2023-04-03', 'San Diego State',   '/logos/sdsu.png',          76, 59,
  'The Huskies finish the job and claim another national title.'),

-- 2023-24
('2023-24', 2, 'Round of 64',           '2024-03-22', 'Stetson',           '/logos/stetson.png',       91, 52,
  'UConn opens the tournament with a comfortable first-round win.'),
('2023-24', 3, 'Round of 32',           '2024-03-24', 'Northwestern',      '/logos/northwestern.png',  75, 58,
  'The Huskies stay on track and move into the second weekend.'),
('2023-24', 4, 'Sweet 16',              '2024-03-28', 'San Diego State',   '/logos/sdsu.png',          82, 52,
  'A rematch of the previous title game ends the same way: UConn in control.'),
('2023-24', 5, 'Elite Eight',           '2024-03-30', 'Illinois',          '/logos/illinois.png',      77, 52,
  'A 30-0 run sends UConn back to the Final Four.'),
('2023-24', 6, 'Final Four',            '2024-04-06', 'Alabama',           '/logos/alabama.png',       86, 72,
  'The offense catches fire and UConn reaches another championship game.'),
('2023-24', 7, 'National Championship', '2024-04-08', 'Purdue',            '/logos/purdue.png',        75, 60,
  'UConn completes the repeat and cements its modern dynasty status.');
