import type { SeasonEvent } from "../data/seasons";
import GameCard from "./GameCard";

type TimelineProps = {
  events: SeasonEvent[];
};

export default function Timeline({ events }: TimelineProps) {
  const eventCount = events.length;

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Tournament timeline</p>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl">Major moments</h3>
        </div>
        <p className="text-sm text-slate-400">Scroll through the run game by game</p>
      </div>

      <div className="mt-8 space-y-6">
        {events.map((event, index) => (
          <GameCard key={event.title} event={event} index={index} eventCount={eventCount} />
        ))}
      </div>
    </section>
  );
}
