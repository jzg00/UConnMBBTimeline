"use client";

import { useState } from "react";
import type { Season } from "@/data/seasons";
import SeasonOverview from "@/components/SeasonOverview";
import SeasonSelector from "@/components/SeasonSelector";
import StatsPanel from "@/components/StatsPanel";
import Timeline from "@/components/Timeline";

type HomeClientProps = {
  seasons: Season[];
};

export default function HomeClient({ seasons }: HomeClientProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const i = seasons.findIndex((s) => s.id === "2022-2023");
    return i >= 0 ? i : 0;
  });
  const current = seasons[currentIndex] ?? seasons[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        {current.heroVideo ? (
          <>
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
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 to-slate-950/95" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 to-slate-950/95" />
        )}

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-sky-300">
              UConn Men’s Basketball Timeline
            </p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Rings. Runs. Moments.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
              Explore the Huskies’ most recent championship success through season-by-season
              timelines, major tournament moments, media, and analytics.
            </p>

            <SeasonSelector
              seasons={seasons}
              current={current}
              onSelectSeasonId={(id) => {
                const idx = seasons.findIndex((s) => s.id === id);
                if (idx >= 0) setCurrentIndex(idx);
              }}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <SeasonOverview current={current} />
        <Timeline events={current.events} uconnLogo={current.uconnLogo} />
        <StatsPanel />
      </main>
    </div>
  );
}
