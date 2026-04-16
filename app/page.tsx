import SeasonOverview from "@/components/SeasonOverview";
import SeasonSelector from "@/components/SeasonSelector";
import StatsPanel from "@/components/StatsPanel";
import Timeline from "@/components/Timeline";
import { seasons } from "@/data/seasons";

export default function Home() {
  const current = seasons[1];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section
        className="relative overflow-hidden border-b border-white/10"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(2,6,23,.55), rgba(2,6,23,.95)), url(${current.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
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

            <SeasonSelector seasons={seasons} current={current} />
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
