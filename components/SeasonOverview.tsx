"use client";
import type { Season } from "../data/seasons";
import { motion } from "framer-motion";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

type SeasonOverviewProps = {
  current: Season;
};

function SeasonTitle({ title }: { title: string }) {
  const match = title.match(/^(.+?)\s+(Back to Back)$/i);
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
  return <h2 className="text-3xl font-bold tracking-tight">{title}</h2>;
}

function SummaryWithOverallHighlight({ text }: { text: string }) {
  const parts = text.split(/(\boverall\b)/gi);
  return (
    <p className="mt-3 text-slate-300">
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

export default function SeasonOverview({ current }: SeasonOverviewProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center">
      <motion.div
        className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl shadow-black/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <SeasonTitle title={current.title} />
        <SummaryWithOverallHighlight text={current.summary} />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {current.analytics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
