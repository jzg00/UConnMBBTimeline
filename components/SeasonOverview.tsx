"use client";
import type { Season } from "../data/seasons";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

type SeasonOverviewProps = {
  current: Season;
};

function SeasonTitle({ title }: { title: string }) {
  const bebasPatterns = [
    /^(.+?)\s+(Back to Back)$/i,
    /^(.+?)\s+(The Return)$/i,
    /^(.+?)\s+(National Championship Run)$/i,
  ];
  for (const pattern of bebasPatterns) {
    const match = title.match(pattern);
    if (match) {
      const [, prefix, phrase] = match;
      return (
        <h2>
          <span className="block text-xl font-semibold tracking-tight text-slate-300 md:text-2xl">{prefix}</span>
          <span
            className={`mt-1 block text-5xl leading-none tracking-wide text-white md:text-6xl ${bebas.className}`}
          >
            {phrase.toUpperCase()}
          </span>
        </h2>
      );
    }
  }
  return <h2 className="text-3xl font-bold tracking-tight">{title}</h2>;
}

function SummaryWithOverallHighlight({ text }: { text: string }) {
  const parts = text.split(/(\boverall\b)/gi);
  return (
    <p className="mx-auto max-w-xl text-slate-300">
      {parts.map((part, i) =>
        part.toLowerCase() === "overall" ? (
          <span key={i} className="font-semibold text-sky-200">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

/** Keyed by `current.id` so `useInView` resets and the same fade runs as on first load. */
function SeasonOverviewCard({ current }: SeasonOverviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={cardRef}
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl shadow-black/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: cardInView ? 1 : 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <SeasonTitle title={current.title} />
      {/* Reserve height for the longer 2023–24 summary so the stats row does not jump between seasons. */}
      <div className="mt-3 min-h-[5.25rem] md:min-h-[4.75rem]">
        <SummaryWithOverallHighlight text={current.summary} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {current.analytics.map((item) => (
          <div key={item.label} className="p-4">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SeasonOverview({ current }: SeasonOverviewProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center">
      <SeasonOverviewCard key={current.id} current={current} />
    </section>
  );
}
