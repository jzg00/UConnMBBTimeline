import type { Season } from "../data/seasons";

type SeasonOverviewProps = {
  current: Season;
};

export default function SeasonOverview({ current }: SeasonOverviewProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Selected season</p>
        <h2 className="mt-2 text-3xl font-bold">{current.title}</h2>
        <p className="mt-3 text-slate-300">{current.summary}</p>
        <div className="mt-4 inline-flex rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
          {current.analytics[3].value}
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
    </section>
  );
}
