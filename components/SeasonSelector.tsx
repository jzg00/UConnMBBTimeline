"use client";

import type { Season } from "../data/seasons";

type SeasonSelectorProps = {
  seasons: Season[];
  current: Season;
  onSelectSeasonId: (seasonId: string) => void;
};

export default function SeasonSelector({ seasons, current, onSelectSeasonId }: SeasonSelectorProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {seasons.map((season) => (
        <button
          key={season.id}
          type="button"
          onClick={() => onSelectSeasonId(season.id)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            season.id === current.id
              ? "border-sky-400 bg-sky-400/15 text-sky-200"
              : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          }`}
        >
          {season.id}
        </button>
      ))}
    </div>
  );
}
