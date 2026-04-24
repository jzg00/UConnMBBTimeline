"use client";
import type { SeasonEvent } from "../data/seasons";
import { motion } from "framer-motion";
import { parseYouTubeId, youTubeEmbedUrl } from "@/lib/youtube";

type GameCardProps = {
  event: SeasonEvent;
  index: number;
  eventCount: number;
  uconnLogo?: string;
};

/**
 * Inline YouTube highlight embed. Uses the privacy-friendly youtube-nocookie
 * domain and `loading="lazy"` so browsers only request the iframe when the
 * card scrolls near the viewport. If the stored URL isn't a recognizable
 * YouTube link we fall back to the original placeholder state.
 */
function HighlightEmbed({ clip, opponent }: { clip: string; opponent: string }) {
  const videoId = parseYouTubeId(clip);

  if (!videoId) {
    return (
      <div className="mt-4 rounded-2xl bg-slate-900/50 p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Highlight</p>
        <div className="mt-4 flex h-40 items-center justify-center rounded-2xl bg-black/30 text-sm text-slate-400">
          {clip}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl bg-black">
      <div className="aspect-video w-full">
        <iframe
          src={youTubeEmbedUrl(videoId)}
          title={`UConn vs ${opponent} highlights`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}

export default function GameCard({ event, index, eventCount, uconnLogo }: GameCardProps) {
  const isLeft = index % 2 === 0;

  const staggerDelay = index * 0.08;

  const content = (
    <motion.div
      className="w-full max-w-xl"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: staggerDelay }}
    >
      <div className="rounded-2xl bg-slate-900/70 p-5">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-300">{event.round}</p>
        <p className="mt-2 text-sm text-slate-400">{event.date}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xl font-bold tracking-tight text-white md:text-2xl">
          <span className="inline-flex items-center gap-2">
            {uconnLogo ? (
              <img
                src={uconnLogo}
                alt=""
                className="h-8 w-8 shrink-0 object-contain"
              />
            ) : null}
            <span>UConn</span>
          </span>
          <span className="font-semibold text-slate-500">vs</span>
          <span className="inline-flex items-center gap-2">
            <span>{event.opponent}</span>
            {event.opponentLogo ? (
              <img
                src={event.opponentLogo}
                alt=""
                className="h-8 w-8 shrink-0 object-contain"
              />
            ) : null}
          </span>
        </div>
        <div className="mt-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
          {event.stat}
        </div>
        <p className="mt-4 text-slate-300">{event.description}</p>
      </div>

      <HighlightEmbed clip={event.clip} opponent={event.opponent} />
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] md:items-stretch md:gap-x-6 md:gap-y-0">
      <div
        className={
          isLeft
            ? "order-2 flex flex-col md:order-1 md:items-end md:pr-2"
            : "order-2 hidden min-h-0 md:order-1 md:block"
        }
        aria-hidden={!isLeft}
      >
        {isLeft ? content : null}
      </div>

      <div className="order-1 flex shrink-0 justify-center md:order-2">
        <div className="flex w-14 flex-col items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/15 font-bold text-sky-200">
            {index + 1}
          </div>
          {index !== eventCount - 1 && (
            <div className="mt-2 w-px flex-1 min-h-[4rem] bg-gradient-to-b from-sky-400/50 to-transparent" />
          )}
        </div>
      </div>

      <div
        className={
          !isLeft
            ? "order-2 flex flex-col md:order-3 md:items-start md:pl-2"
            : "hidden min-h-0 md:order-3 md:block"
        }
        aria-hidden={isLeft}
      >
        {!isLeft ? content : null}
      </div>
    </div>
  );
}
