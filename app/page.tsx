import { supabase } from "@/lib/supabase";
import HomeClient from "@/components/HomeClient";
import {
  buildSeasons,
  type SeasonRow,
  type TournamentGameRow,
} from "@/data/seasons";

export default async function Page() {
  const [seasonRes, gameRes] = await Promise.all([
    supabase.from("seasons").select("*").order("sort_order"),
    supabase.from("tournament_games").select("*").order("round_order"),
  ]);

  if (seasonRes.error) console.error("seasons error:", seasonRes.error);
  if (gameRes.error) console.error("tournament_games error:", gameRes.error);

  const seasons = buildSeasons(
    (seasonRes.data ?? []) as SeasonRow[],
    (gameRes.data ?? []) as TournamentGameRow[]
  );

  return <HomeClient seasons={seasons} />;
}
