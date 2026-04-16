import type { Season } from "../data/seasons";

type SeasonOverviewProps = {
  current: Season;
};

export default function SeasonOverview({ current }: SeasonOverviewProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Selected season</p>
            <h2 className="mt-2 text-3xl font-bold">{current.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-300">{current.summary}</p>
          </div>
          <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
            {current.analytics[3].value}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {current.analytics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Coach spotlight</p>
          <img
            src={current.coachImage}
            alt="Coach"
            className="mt-4 h-56 w-full rounded-2xl object-cover"
          />
          <p className="mt-4 text-sm text-slate-300">
            Add a portrait of Dan Hurley plus a short coaching summary or season quote.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Team image</p>
          <img
            src={current.teamImage}
            alt="Team"
            className="mt-4 h-56 w-full rounded-2xl object-cover"
          />
          <p className="mt-4 text-sm text-slate-300">
            Add a team celebration photo, championship cut-the-nets shot, or roster collage.
          </p>
        </div>
      </div>
    </section>
  );
}
