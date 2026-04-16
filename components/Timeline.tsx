import type { SeasonEvent } from "../data/seasons";
import GameCard from "./GameCard";

type TimelineProps = {
  events: SeasonEvent[];
  uconnLogo?: string;
};

export default function Timeline({ events, uconnLogo }: TimelineProps) {
  const eventCount = events.length;

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Tournament timeline</p>
      </div>

      <div className="mt-8 space-y-6">
        {events.map((event, index) => (
          <GameCard
            key={`${event.date}-${event.round}-${index}`}
            event={event}
            index={index}
            eventCount={eventCount}
            uconnLogo={uconnLogo}
          />
        ))}
      </div>
    </section>
  );
}
