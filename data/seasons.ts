import { getPublicStorageUrl } from "@/lib/supabase-storage";

/** Single game row rendered in the Timeline. */
export type SeasonEvent = {
  round: string;
  date: string;
  opponent: string;
  opponentLogo?: string;
  stat: string;
  description: string;
  clip: string;
};

/** A season as the UI consumes it. Shape is intentionally decoupled from the DB. */
export type Season = {
  id: string;
  title: string;
  record: string;
  summary: string;
  heroVideo?: string;
  uconnLogo?: string;
  analytics: { label: string; value: string }[];
  events: SeasonEvent[];
};

// ---------------------------------------------------------------------------
// DB row types. These mirror the columns in public.seasons and
// public.tournament_games. Nullable columns (BBR stats that may not be
// populated yet) are typed as `| null`.
// ---------------------------------------------------------------------------

export type SeasonRow = {
  id: string;
  title: string;
  summary: string | null;
  sort_order: number;

  hero_video_bucket: string | null;
  hero_video_path: string | null;
  uconn_logo_path: string | null;

  head_coach: string | null;

  games: number | null;
  wins: number | null;
  losses: number | null;
  conference: string | null;
  conf_wins: number | null;
  conf_losses: number | null;
  ap_preseason_rank: number | null;
  ap_final_rank: number | null;

  srs: number | null;
  sos: number | null;
  pace: number | null;
  off_rtg: number | null;
  def_rtg: number | null;

  pts_per_game: number | null;
  opp_pts_per_game: number | null;

  ncaa_seed: number | null;
  postseason_result: string | null;
};

export type TournamentGameRow = {
  id: number;
  season_id: string;
  round_order: number;
  round: string;
  game_date: string;
  opponent: string;
  opponent_logo_path: string | null;
  uconn_score: number | null;
  opponent_score: number | null;
  description: string | null;
  highlight_clip_url: string | null;
};

/**
 * Mirrors public.team_game_logs. One row per UConn game for a season; every
 * column maps 1:1 to a BBR "Team Game Log (Basic)" column after tiny renames
 * (3P -> three_p, etc). See supabase/migrations/20260421000100_team_game_logs.sql
 * and docs/bbr-ingest.md.
 */
export type TeamGameLogRow = {
  season_id: string;
  rk: number | null;
  game_num: number;
  game_date: string;
  venue: "@" | "N" | null;
  opponent: string;
  game_type: string | null;
  result: "W" | "L" | null;
  team_pts: number | null;
  opp_pts: number | null;
  ot: string | null;

  fg: number | null;
  fga: number | null;
  fg_pct: number | null;
  three_p: number | null;
  three_pa: number | null;
  three_pct: number | null;
  two_p: number | null;
  two_pa: number | null;
  two_pct: number | null;
  efg_pct: number | null;
  ft: number | null;
  fta: number | null;
  ft_pct: number | null;
  orb: number | null;
  drb: number | null;
  trb: number | null;
  ast: number | null;
  stl: number | null;
  blk: number | null;
  tov: number | null;
  pf: number | null;

  opp_fg: number | null;
  opp_fga: number | null;
  opp_fg_pct: number | null;
  opp_three_p: number | null;
  opp_three_pa: number | null;
  opp_three_pct: number | null;
  opp_two_p: number | null;
  opp_two_pa: number | null;
  opp_two_pct: number | null;
  opp_efg_pct: number | null;
  opp_ft: number | null;
  opp_fta: number | null;
  opp_ft_pct: number | null;
  opp_orb: number | null;
  opp_drb: number | null;
  opp_trb: number | null;
  opp_ast: number | null;
  opp_stl: number | null;
  opp_blk: number | null;
  opp_tov: number | null;
  opp_pf: number | null;
};

// ---------------------------------------------------------------------------
// DB row → UI mappers.
// ---------------------------------------------------------------------------

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

function formatGameDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : DATE_FMT.format(d);
}

function formatStatLine(row: TournamentGameRow): string {
  if (row.uconn_score == null || row.opponent_score == null) return "";
  const uconnWon = row.uconn_score > row.opponent_score;
  const verb = uconnWon ? "Won" : "Lost";
  const [high, low] = [
    Math.max(row.uconn_score, row.opponent_score),
    Math.min(row.uconn_score, row.opponent_score),
  ];
  return `${verb} ${high}-${low}`;
}

function mapTournamentGameRow(row: TournamentGameRow): SeasonEvent {
  return {
    round: row.round,
    date: formatGameDate(row.game_date),
    opponent: row.opponent,
    opponentLogo: row.opponent_logo_path ?? undefined,
    stat: formatStatLine(row),
    description: row.description ?? "",
    clip: row.highlight_clip_url ?? "Add game highlights here",
  };
}

/**
 * Build the analytics panel rows shown on the season overview card. Which
 * stats we surface here is intentionally a small curated set; the full BBR
 * column set lives on the `SeasonRow` and is available for a richer dashboard
 * later.
 */
function buildAnalytics(row: SeasonRow, events: SeasonEvent[]): Season["analytics"] {
  const out: Season["analytics"] = [];

  if (row.wins != null && row.losses != null) {
    out.push({ label: "Overall Record", value: `${row.wins}-${row.losses}` });
  }

  if (events.length > 0) {
    const tourneyWins = events.filter((e) => /^Won/.test(e.stat)).length;
    out.push({
      label: "Tournament Record",
      value: `${tourneyWins}-${events.length - tourneyWins}`,
    });
  }

  if (row.ncaa_seed != null) {
    out.push({ label: "Seed", value: String(row.ncaa_seed) });
  }

  return out;
}

function mapSeasonRow(row: SeasonRow, games: TournamentGameRow[]): Season {
  const events = games
    .slice()
    .sort((a, b) => a.round_order - b.round_order)
    .map(mapTournamentGameRow);

  const record =
    row.wins != null && row.losses != null ? `${row.wins}-${row.losses}` : "";

  return {
    id: row.id,
    title: row.title,
    record,
    summary: row.summary ?? "",
    heroVideo: getPublicStorageUrl(row.hero_video_bucket, row.hero_video_path),
    uconnLogo: row.uconn_logo_path ?? "/logos/uconn.png",
    analytics: buildAnalytics(row, events),
    events,
  };
}

/** Join season rows with their tournament games. */
export function buildSeasons(
  seasonRows: SeasonRow[],
  gameRows: TournamentGameRow[]
): Season[] {
  const bySeason = new Map<string, TournamentGameRow[]>();
  for (const g of gameRows) {
    const list = bySeason.get(g.season_id) ?? [];
    list.push(g);
    bySeason.set(g.season_id, list);
  }
  return seasonRows.map((s) => mapSeasonRow(s, bySeason.get(s.id) ?? []));
}
