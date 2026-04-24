"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import type { Season, TeamGameLogRow } from "@/data/seasons";

type StatsPanelProps = {
  current: Season;
  games: TeamGameLogRow[];
  seasons: Season[];
  onSelectSeasonId: (id: string) => void;
};

// ---------------------------------------------------------------------------
// Tab scopes. Each scope narrows the games array down to a subset before
// computeStats runs, so every section automatically re-renders from the
// filtered data.
// ---------------------------------------------------------------------------

type ScopeId = "all" | "regular" | "conf" | "ncaa";

type Scope = {
  id: ScopeId;
  label: string;
  shortLabel: string;
  description: string;
  match: (g: TeamGameLogRow) => boolean;
};

const SCOPES: Scope[] = [
  {
    id: "all",
    label: "All Games",
    shortLabel: "All",
    description: "Full season",
    match: () => true,
  },
  {
    id: "regular",
    label: "Regular Season",
    shortLabel: "Regular Season",
    description: "Non-conference + conference play",
    match: (g) => (g.game_type ?? "").startsWith("REG"),
  },
  {
    id: "conf",
    label: "Big East Tournament",
    shortLabel: "Big East Tournament",
    description: "Big East Tournament games",
    match: (g) => g.game_type === "CTOURN",
  },
  {
    id: "ncaa",
    label: "NCAA Tournament",
    shortLabel: "NCAA Tournament",
    description: "NCAA Tournament games",
    match: (g) => {
      const t = g.game_type ?? "";
      return t.startsWith("ROUND-") || t.startsWith("NATIONAL-");
    },
  },
];

// ---------------------------------------------------------------------------
// Stat computation. All derived values come from public.team_game_logs rows
// for the season passed in. Percentages are weighted by attempts, not arithmetic
// means of per-game percentages, so they match what BBR reports for the season.
// ---------------------------------------------------------------------------

type Split = { label: string; wins: number; losses: number };

type NotableGame = {
  label: string;
  headline: string;
  detail: string;
  gameKey: string;
};

type DashboardStats = {
  wins: number;
  losses: number;
  ppg: number;
  oppPpg: number;
  margin: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  efgPct: number;
  oppFgPct: number;
  oppThreePct: number;
  oppFtPct: number;
  oppEfgPct: number;
  reboundMargin: number;
  astToRatio: number;
  venueSplits: Split[];
  typeSplits: Split[];
  notable: NotableGame[];
};

function sum(arr: (number | null)[]): number {
  let total = 0;
  for (const v of arr) if (v != null) total += v;
  return total;
}

function safeDiv(n: number, d: number): number {
  return d === 0 ? 0 : n / d;
}

function recordFor(games: TeamGameLogRow[], predicate: (g: TeamGameLogRow) => boolean): Split {
  let wins = 0;
  let losses = 0;
  for (const g of games) {
    if (!predicate(g)) continue;
    if (g.result === "W") wins++;
    else if (g.result === "L") losses++;
  }
  return { label: "", wins, losses };
}

function computeStats(games: TeamGameLogRow[]): DashboardStats {
  const total = games.length;
  const wins = games.filter((g) => g.result === "W").length;
  const losses = games.filter((g) => g.result === "L").length;

  const ppg = safeDiv(sum(games.map((g) => g.team_pts)), total);
  const oppPpg = safeDiv(sum(games.map((g) => g.opp_pts)), total);

  const fgPct = safeDiv(sum(games.map((g) => g.fg)), sum(games.map((g) => g.fga)));
  const threePct = safeDiv(sum(games.map((g) => g.three_p)), sum(games.map((g) => g.three_pa)));
  const ftPct = safeDiv(sum(games.map((g) => g.ft)), sum(games.map((g) => g.fta)));
  // eFG% = (FG + 0.5 * 3P) / FGA
  const efgPct = safeDiv(
    sum(games.map((g) => g.fg)) + 0.5 * sum(games.map((g) => g.three_p)),
    sum(games.map((g) => g.fga))
  );

  const oppFgPct = safeDiv(sum(games.map((g) => g.opp_fg)), sum(games.map((g) => g.opp_fga)));
  const oppThreePct = safeDiv(
    sum(games.map((g) => g.opp_three_p)),
    sum(games.map((g) => g.opp_three_pa))
  );
  const oppFtPct = safeDiv(sum(games.map((g) => g.opp_ft)), sum(games.map((g) => g.opp_fta)));
  const oppEfgPct = safeDiv(
    sum(games.map((g) => g.opp_fg)) + 0.5 * sum(games.map((g) => g.opp_three_p)),
    sum(games.map((g) => g.opp_fga))
  );

  const reboundMargin = safeDiv(
    sum(games.map((g) => (g.trb ?? 0) - (g.opp_trb ?? 0))),
    total
  );
  const astToRatio = safeDiv(sum(games.map((g) => g.ast)), sum(games.map((g) => g.tov)));

  // Venue splits. Raw values: null = home, '@' = away, 'N' = neutral.
  const home = recordFor(games, (g) => g.venue == null);
  home.label = "Home";
  const away = recordFor(games, (g) => g.venue === "@");
  away.label = "Away";
  const neutral = recordFor(games, (g) => g.venue === "N");
  neutral.label = "Neutral";

  // Game-type splits. Raw BBR values: 'REG (...)' | 'CTOURN' | 'ROUND-*' | 'NATIONAL-*'.
  const regular = recordFor(games, (g) => (g.game_type ?? "").startsWith("REG"));
  regular.label = "Regular Season";
  const conferenceTourney = recordFor(games, (g) => g.game_type === "CTOURN");
  conferenceTourney.label = "Conference Tourney";
  const ncaa = recordFor(games, (g) => {
    const t = g.game_type ?? "";
    return t.startsWith("ROUND-") || t.startsWith("NATIONAL-");
  });
  ncaa.label = "NCAA Tournament";

  // Notable performances. Skip games missing scores rather than guess.
  const scored = games.filter((g) => g.team_pts != null && g.opp_pts != null);

  const biggestWin = scored
    .filter((g) => g.result === "W")
    .reduce<TeamGameLogRow | null>((best, g) => {
      const margin = (g.team_pts ?? 0) - (g.opp_pts ?? 0);
      const bestMargin = best ? (best.team_pts ?? 0) - (best.opp_pts ?? 0) : -Infinity;
      return margin > bestMargin ? g : best;
    }, null);

  const toughestLoss = scored
    .filter((g) => g.result === "L")
    .reduce<TeamGameLogRow | null>((worst, g) => {
      const margin = (g.opp_pts ?? 0) - (g.team_pts ?? 0);
      const worstMargin = worst ? (worst.opp_pts ?? 0) - (worst.team_pts ?? 0) : -Infinity;
      return margin > worstMargin ? g : worst;
    }, null);

  const highestScoring = scored.reduce<TeamGameLogRow | null>((best, g) => {
    return !best || (g.team_pts ?? 0) > (best.team_pts ?? 0) ? g : best;
  }, null);

  const bestDefense = scored.reduce<TeamGameLogRow | null>((best, g) => {
    return !best || (g.opp_pts ?? Infinity) < (best.opp_pts ?? Infinity) ? g : best;
  }, null);

  const gameKey = (g: TeamGameLogRow) => `${g.season_id}-${g.game_num}`;

  // Build all candidates in priority order. De-dupe by game below so that on
  // small scopes (e.g. the Big East Tournament with just 2 games) we don't
  // show the same game four times under different labels.
  const candidates: NotableGame[] = [];
  if (biggestWin) {
    candidates.push({
      label: "Biggest Win",
      headline: `${biggestWin.team_pts}-${biggestWin.opp_pts} vs ${biggestWin.opponent}`,
      detail: `+${(biggestWin.team_pts ?? 0) - (biggestWin.opp_pts ?? 0)} margin`,
      gameKey: gameKey(biggestWin),
    });
  }
  if (toughestLoss) {
    candidates.push({
      label: "Toughest Loss",
      headline: `${toughestLoss.team_pts}-${toughestLoss.opp_pts} ${
        toughestLoss.venue === "@" ? "@" : "vs"
      } ${toughestLoss.opponent}`,
      detail: `-${(toughestLoss.opp_pts ?? 0) - (toughestLoss.team_pts ?? 0)} margin`,
      gameKey: gameKey(toughestLoss),
    });
  }
  if (highestScoring) {
    candidates.push({
      label: "Highest-Scoring",
      headline: `${highestScoring.team_pts} points vs ${highestScoring.opponent}`,
      detail: formatDateISO(highestScoring.game_date),
      gameKey: gameKey(highestScoring),
    });
  }
  if (bestDefense) {
    candidates.push({
      label: "Best Defense",
      headline: `Held ${bestDefense.opponent} to ${bestDefense.opp_pts}`,
      detail: formatDateISO(bestDefense.game_date),
      gameKey: gameKey(bestDefense),
    });
  }

  const seen = new Set<string>();
  const notable: NotableGame[] = [];
  for (const c of candidates) {
    if (seen.has(c.gameKey)) continue;
    seen.add(c.gameKey);
    notable.push(c);
  }

  return {
    wins,
    losses,
    ppg,
    oppPpg,
    margin: ppg - oppPpg,
    fgPct,
    threePct,
    ftPct,
    efgPct,
    oppFgPct,
    oppThreePct,
    oppFtPct,
    oppEfgPct,
    reboundMargin,
    astToRatio,
    venueSplits: [home, away, neutral],
    typeSplits: [regular, conferenceTourney, ncaa],
    notable,
  };
}

function formatDateISO(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function signed(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}

// ---------------------------------------------------------------------------
// Presentational pieces
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center transition hover:border-white/20 hover:bg-white/[0.07] sm:p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400 sm:text-[11px] sm:tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold text-white sm:mt-2 sm:text-2xl md:text-3xl">
        {value}
      </p>
      {sublabel ? (
        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">{sublabel}</p>
      ) : null}
    </div>
  );
}

function SplitRow({ split }: { split: Split }) {
  const total = split.wins + split.losses;
  const winPct = total === 0 ? 0 : split.wins / total;
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-24 shrink-0 truncate text-xs text-slate-300 sm:w-32 sm:text-sm">
        {split.label}
      </div>
      <div className="flex-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-sky-400/80"
            style={{ width: `${Math.round(winPct * 100)}%` }}
          />
        </div>
      </div>
      <div className="w-12 shrink-0 text-right font-mono text-xs text-white sm:w-14 sm:text-sm">
        {split.wins}-{split.losses}
      </div>
    </div>
  );
}

/**
 * Shows UConn vs opponent for a single shooting metric. On md+ we render the
 * mirrored side-by-side bar chart; on mobile that gets too cramped so we stack
 * the two sides as simple labeled bars.
 */
function ShootingRow({
  label,
  team,
  opp,
}: {
  label: string;
  team: number;
  opp: number;
}) {
  const teamBetter = team > opp;
  return (
    <div className="py-2.5">
      {/* Mobile stacked layout */}
      <div className="md:hidden">
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-[11px] uppercase tracking-wider text-slate-400">
              UConn
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-sky-400/70"
                style={{ width: `${Math.min(100, team * 100)}%` }}
              />
            </div>
            <span
              className={`w-12 shrink-0 text-right font-mono text-xs ${
                teamBetter ? "font-semibold text-white" : "text-slate-400"
              }`}
            >
              {pct(team)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 shrink-0 text-[11px] uppercase tracking-wider text-slate-400">
              Opp
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-rose-400/60"
                style={{ width: `${Math.min(100, opp * 100)}%` }}
              />
            </div>
            <span
              className={`w-12 shrink-0 text-right font-mono text-xs ${
                !teamBetter ? "font-semibold text-white" : "text-slate-400"
              }`}
            >
              {pct(opp)}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop mirrored layout */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="w-16 shrink-0 text-xs uppercase tracking-wider text-slate-400">
          {label}
        </div>
        <div className="flex flex-1 items-center gap-2">
          <span
            className={`font-mono text-sm ${
              teamBetter ? "font-semibold text-white" : "text-slate-400"
            }`}
          >
            {pct(team)}
          </span>
          <div className="flex-1">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-sky-400/70"
                style={{ width: `${Math.min(100, team * 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="flex-1">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="absolute inset-y-0 right-0 rounded-full bg-rose-400/60"
                style={{ width: `${Math.min(100, opp * 100)}%` }}
              />
            </div>
          </div>
          <span
            className={`font-mono text-sm ${
              !teamBetter ? "font-semibold text-white" : "text-slate-400"
            }`}
          >
            {pct(opp)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Subtle inline season switcher — a native <select> with its default chrome
 * stripped and a small chevron appended, so it reads like a quiet piece of
 * metadata next to the "Stats & Analytics" eyebrow. Uses the native picker
 * on mobile. Hides itself when there's only one season loaded.
 */
function SeasonSelect({
  seasons,
  currentId,
  onSelectSeasonId,
}: {
  seasons: Season[];
  currentId: string;
  onSelectSeasonId: (id: string) => void;
}) {
  if (seasons.length <= 1) return null;
  return (
    <label className="group relative inline-flex cursor-pointer items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
      <select
        value={currentId}
        onChange={(e) => onSelectSeasonId(e.target.value)}
        aria-label="Select season"
        className="cursor-pointer appearance-none bg-transparent pr-4 font-mono text-xs tracking-wide focus:outline-none"
      >
        {seasons.map((s) => (
          <option key={s.id} value={s.id} className="bg-slate-900 text-white">
            {s.id}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="pointer-events-none absolute right-0 h-3 w-3 opacity-60 transition group-hover:opacity-100"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}

function TabButton({
  scope,
  count,
  active,
  onClick,
}: {
  scope: Scope;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const disabled = count === 0;
  // On mobile the buttons stand on their own (2x2 grid), so they need a border
  // of their own. On sm+ they sit inside a pill container that draws the
  // surrounding border, so the per-button border collapses.
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-medium transition sm:border-transparent md:px-4 md:text-sm ${
        active
          ? "border-white bg-white text-slate-900 shadow-sm shadow-sky-400/10 sm:border-transparent"
          : disabled
            ? "cursor-not-allowed border-white/5 text-slate-600"
            : "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
      aria-pressed={active}
    >
      <span>{scope.shortLabel}</span>
      <span
        className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
          active ? "bg-slate-900/10 text-slate-700" : "bg-white/5 text-slate-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function GameRow({ game }: { game: TeamGameLogRow }) {
  const won = game.result === "W";
  const venueLabel =
    game.venue === "@" ? "at" : game.venue === "N" ? "vs" : "vs";
  const venueChip =
    game.venue === "@" ? "AWAY" : game.venue === "N" ? "NEUTRAL" : "HOME";
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-white/5 py-2.5 text-sm last:border-b-0 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-3">
      {/* Date column — hidden on mobile (shown inline under the opponent). */}
      <span className="hidden w-20 shrink-0 text-xs text-slate-500 sm:inline">
        {formatDateISO(game.game_date)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-white">
          <span className="text-slate-400">{venueLabel}</span>{" "}
          <span className="font-medium">{game.opponent}</span>
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] uppercase tracking-wider text-slate-500">
          <span className="sm:hidden">{formatDateISO(game.game_date)}</span>
          <span className="hidden sm:inline">{venueChip}</span>
          <span className="sm:hidden">&middot; {venueChip}</span>
          {game.game_type ? <span>&middot; {game.game_type}</span> : null}
          {game.ot ? <span>&middot; {game.ot}</span> : null}
        </p>
      </div>
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold sm:px-2 ${
          won
            ? "bg-emerald-400/15 text-emerald-300"
            : "bg-rose-400/15 text-rose-300"
        }`}
      >
        {game.result}
      </span>
      <span className="w-14 shrink-0 text-right font-mono text-xs text-white sm:w-20 sm:text-sm">
        {game.team_pts}-{game.opp_pts}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export default function StatsPanel({
  current,
  games,
  seasons,
  onSelectSeasonId,
}: StatsPanelProps) {
  const [scopeId, setScopeId] = useState<ScopeId>("all");

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  // Precompute per-scope game lists so tab counts and the active scope's
  // dashboard all read from the same source.
  const gamesByScope = useMemo(() => {
    const out: Record<ScopeId, TeamGameLogRow[]> = {
      all: [],
      regular: [],
      conf: [],
      ncaa: [],
    };
    for (const scope of SCOPES) {
      out[scope.id] = games.filter(scope.match);
    }
    return out;
  }, [games]);

  const activeScope = SCOPES.find((s) => s.id === scopeId) ?? SCOPES[0];
  const scopedGames = gamesByScope[activeScope.id];
  const stats = useMemo(
    () => (scopedGames.length > 0 ? computeStats(scopedGames) : null),
    [scopedGames]
  );

  if (games.length === 0) {
    return (
      <section id="analytics" className="mt-10 scroll-mt-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">
              Stats & Analytics
            </p>
            <SeasonSelect
              seasons={seasons}
              currentId={current.id}
              onSelectSeasonId={onSelectSeasonId}
            />
          </div>
          <p className="mt-3 text-lg text-slate-400">
            Coming soon for the {current.id} season.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="analytics" className="mt-10 scroll-mt-24" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 12 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 md:p-8"
      >
        {/* Header.
            `justify-between` + `shrink-0` on the right block pins the Record
            to the right edge. The left block uses `min-w-0` + `truncate` so
            the long scope descriptions never push the Record around — they
            just ellipsize inside their column. Right-side text is deliberately
            static ("Record", never "<scope> Record") so the right block's own
            width also stays constant. */}
        <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-4 sm:pb-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-300 sm:text-sm">
                Stats & Analytics
              </p>
              <SeasonSelect
                seasons={seasons}
                currentId={current.id}
                onSelectSeasonId={onSelectSeasonId}
              />
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">
              {activeScope.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 sm:text-[11px]">
              Record
            </p>
            <p className="mt-1 font-mono text-xl font-bold text-white sm:text-2xl">
              {stats ? `${stats.wins}-${stats.losses}` : "—"}
            </p>
          </div>
        </div>

        {/* Scope tabs.
            The four full labels don't fit on one row at mobile width, so on
            mobile we lay them out as a 2x2 grid (no container chrome). On sm+
            they all fit inline and we wrap them in the usual pill container. */}
        <div
          role="tablist"
          aria-label="Filter games by competition"
          className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-4 sm:flex sm:flex-wrap sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-white/10 sm:bg-white/[0.03] sm:p-1"
        >
          {SCOPES.map((scope) => (
            <TabButton
              key={scope.id}
              scope={scope}
              count={gamesByScope[scope.id].length}
              active={scope.id === activeScope.id}
              onClick={() => setScopeId(scope.id)}
            />
          ))}
        </div>

        {/* Scoped dashboard body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScope.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {stats ? (
              <>
                {/* Headline grid */}
                <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
                  <StatCard label="PPG" value={stats.ppg.toFixed(1)} />
                  <StatCard label="Opp PPG" value={stats.oppPpg.toFixed(1)} />
                  <StatCard
                    label="Scoring Margin"
                    value={signed(stats.margin)}
                    sublabel="per game"
                  />
                  <StatCard
                    label="FG%"
                    value={pct(stats.fgPct)}
                    sublabel={activeScope.id === "all" ? "season" : activeScope.shortLabel}
                  />
                  <StatCard
                    label="3P%"
                    value={pct(stats.threePct)}
                    sublabel={activeScope.id === "all" ? "season" : activeScope.shortLabel}
                  />
                  <StatCard
                    label="Reb Margin"
                    value={signed(stats.reboundMargin)}
                    sublabel="per game"
                  />
                </div>

                {/* Two-column: splits + shooting profile. Section headers do
                    the visual grouping instead of nested card containers. */}
                <div className="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-2 lg:gap-10">
                  {/* Splits */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Record Splits
                    </p>

                    <p className="mt-4 text-[11px] uppercase tracking-wider text-slate-500">
                      By Venue
                    </p>
                    <div className="mt-2 space-y-2">
                      {stats.venueSplits
                        .filter((s) => s.wins + s.losses > 0)
                        .map((s) => (
                          <SplitRow key={s.label} split={s} />
                        ))}
                    </div>

                    {/* The By-Game-Type breakdown is only meaningful on the All tab.
                        On filtered tabs every game has the same type, so hide it. */}
                    {activeScope.id === "all" ? (
                      <>
                        <p className="mt-5 text-[11px] uppercase tracking-wider text-slate-500">
                          By Game Type
                        </p>
                        <div className="mt-2 space-y-2">
                          {stats.typeSplits
                            .filter((s) => s.wins + s.losses > 0)
                            .map((s) => (
                              <SplitRow key={s.label} split={s} />
                            ))}
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/* Shooting profile */}
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Shooting Profile
                      </p>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1 text-slate-400">
                          <span className="inline-block h-2 w-2 rounded-full bg-sky-400/80" />
                          UConn
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <span className="inline-block h-2 w-2 rounded-full bg-rose-400/60" />
                          Opp
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 divide-y divide-white/5">
                      <ShootingRow label="FG%" team={stats.fgPct} opp={stats.oppFgPct} />
                      <ShootingRow
                        label="3P%"
                        team={stats.threePct}
                        opp={stats.oppThreePct}
                      />
                      <ShootingRow label="FT%" team={stats.ftPct} opp={stats.oppFtPct} />
                      <ShootingRow
                        label="eFG%"
                        team={stats.efgPct}
                        opp={stats.oppEfgPct}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs uppercase tracking-wider text-slate-400">
                        Assist / TO Ratio
                      </span>
                      <span className="font-mono text-base font-semibold text-white sm:text-lg">
                        {stats.astToRatio.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notable performances. The candidate list is de-duplicated
                    by game upstream, so on small scopes (e.g. Big East Tourney
                    with only 2 games) we end up with 1-2 cards instead of four
                    cards all pointing to the same game. The grid uses
                    `auto-cols` so it also looks fine with 1, 2, or 3 cards. */}
                {stats.notable.length > 0 ? (
                  <div className="mt-5 sm:mt-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Notable Performances
                    </p>
                    <div
                      className={`mt-3 grid grid-cols-1 gap-2 sm:gap-3 ${
                        stats.notable.length >= 4
                          ? "sm:grid-cols-2 lg:grid-cols-4"
                          : stats.notable.length === 3
                            ? "sm:grid-cols-3"
                            : stats.notable.length === 2
                              ? "sm:grid-cols-2"
                              : ""
                      }`}
                    >
                      {stats.notable.map((n) => (
                        <div
                          key={n.label}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                        >
                          <p className="text-[11px] uppercase tracking-wider text-sky-300/80">
                            {n.label}
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-snug text-white">
                            {n.headline}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{n.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Game-by-game list. Useful everywhere; essential on the NCAA tab. */}
                <div className="mt-6 sm:mt-8">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {activeScope.label} &middot; Game Log
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {scopedGames.length} {scopedGames.length === 1 ? "game" : "games"}
                    </p>
                  </div>
                  <div className="mt-1">
                    {scopedGames.map((g) => (
                      <GameRow key={`${g.season_id}-${g.game_num}`} game={g} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                <p className="text-sm text-slate-400">
                  No {activeScope.label.toLowerCase()} games for this season.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
