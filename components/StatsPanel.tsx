export default function StatsPanel() {
  return (
    <section className="mt-10 grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Analytics ideas</p>
        <h3 className="mt-2 text-2xl font-bold">Stats you should show</h3>
        <div className="mt-6 grid gap-3 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">Net rating by tournament game</div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">Point differential across the run</div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">Top scorers and rebounders per game</div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">Team shooting splits and turnovers</div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">Bracket path with seeds and margins</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Build notes</p>
        <h3 className="mt-2 text-2xl font-bold">How to make it feel cool</h3>
        <div className="mt-6 space-y-3 text-sm text-slate-300">
          <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            Use smooth scroll animations so each game card fades/slides in as the user moves down the page.
          </p>
          <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            Add a sticky season selector so users can instantly switch from one championship run to another.
          </p>
          <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            Embed short highlight clips or YouTube videos inside each major game card.
          </p>
          <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            Use navy, white, silver, and championship-gold accents to match the UConn feel.
          </p>
        </div>
      </div>
    </section>
  );
}
