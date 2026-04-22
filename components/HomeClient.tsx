"use client";

import { useState } from "react";
import type { Season, TeamGameLogRow } from "@/data/seasons";
import SeasonOverview from "@/components/SeasonOverview";
import SeasonSelector from "@/components/SeasonSelector";
import StatsPanel from "@/components/StatsPanel";
import Timeline from "@/components/Timeline";

type HomeClientProps = {
  seasons: Season[];
  gamesBySeason: Record<string, TeamGameLogRow[]>;
};

export default function HomeClient({ seasons, gamesBySeason }: HomeClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToAnalytics = () => {
    document
      .getElementById("analytics")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (seasons.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-200">
        <div className="max-w-lg">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">
            UConn Men&apos;s Basketball
          </p>
          <h1 className="mt-4 text-3xl font-bold">No seasons loaded yet</h1>
          <p className="mt-3 text-slate-400">
            <code className="rounded bg-white/10 px-1 py-0.5">public.seasons</code> returned
            no rows. Run <code className="rounded bg-white/10 px-1 py-0.5">supabase/seed.sql</code>{" "}
            (or add rows manually via the Supabase Table Editor) to see the timeline.
          </p>
        </div>
      </div>
    );
  }

  const current = seasons[currentIndex] ?? seasons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        {current.heroVideo ? (
          <video
            key={current.id}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={current.heroVideo} type="video/mp4" />
          </video>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/50 to-slate-950" />

        <div className="relative mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-44">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-sky-300">
              UConn Men&apos;s Basketball
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Rings. Runs. <span className="italic text-sky-300">Dynasty.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
              Explore the Huskies&apos; most recent championship runs through season-by-season
              timelines, major tournament moments, and analytics.
            </p>

            <SeasonSelector
              seasons={seasons}
              current={current}
              onSelectSeasonId={(id) => {
                const idx = seasons.findIndex((s) => s.id === id);
                if (idx >= 0) setCurrentIndex(idx);
              }}
            />

            <button
              type="button"
              onClick={scrollToAnalytics}
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sky-300 underline decoration-sky-300/40 decoration-1 underline-offset-4 transition hover:text-white hover:decoration-white/70"
            >
              See analytics
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 0 1 .75.75v10.69l3.72-3.72a.75.75 0 1 1 1.06 1.06l-5 5a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 1 1 1.06-1.06l3.72 3.72V3.75A.75.75 0 0 1 10 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <SeasonOverview current={current} />
        <Timeline events={current.events} uconnLogo={current.uconnLogo} />
        <StatsPanel current={current} games={gamesBySeason[current.id] ?? []} />
      </main>
    </div>
  );
}
