/**
 * Extract the YouTube video id from any of the common URL shapes:
 *   https://www.youtube.com/watch?v=<id>
 *   https://youtu.be/<id>
 *   https://www.youtube.com/shorts/<id>
 *   https://www.youtube.com/embed/<id>
 * Returns null if the input isn't a recognizable YouTube URL.
 *
 * Stored URLs come from the `highlight_clip_url` column on tournament_games.
 */
export function parseYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const isYT = host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com";
  if (!isYT) return null;

  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return id || null;
  }

  const vParam = url.searchParams.get("v");
  if (vParam) return vParam;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts[0] === "shorts" || parts[0] === "embed") {
    return parts[1] ?? null;
  }

  return null;
}

export function youTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
