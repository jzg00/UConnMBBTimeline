import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";
import {
  buildSeasons,
  type SeasonRow,
  type TournamentGameRow,
  type TeamGameLogRow,
} from "@/data/seasons";

export default async function Page() {
  const [seasonRes, tourneyRes, gameLogRes] = await Promise.all([
    supabase.from("seasons").select("*").order("sort_order"),
    supabase.from("tournament_games").select("*").order("round_order"),
    supabase.from("team_game_logs").select("*").order("game_num"),
  ]);

  if (seasonRes.error) console.error("seasons error:", seasonRes.error);
  if (tourneyRes.error) console.error("tournament_games error:", tourneyRes.error);
  if (gameLogRes.error) console.error("team_game_logs error:", gameLogRes.error);

  const seasons = buildSeasons(
    (seasonRes.data ?? []) as SeasonRow[],
    (tourneyRes.data ?? []) as TournamentGameRow[]
  );

  const teamGameLogs = (gameLogRes.data ?? []) as TeamGameLogRow[];
  const gamesBySeason: Record<string, TeamGameLogRow[]> = {};
  for (const g of teamGameLogs) {
    (gamesBySeason[g.season_id] ??= []).push(g);
  }

  return <HomeClient seasons={seasons} gamesBySeason={gamesBySeason} />;
}
