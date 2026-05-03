/**
 * Hero background videos served from Cloudflare R2 (`uconnmbb` bucket).
 * Public base URL — `NEXT_PUBLIC_MEDIA_BASE_URL` (e.g. https://media.uconnmbb.com).
 *
 * Supabase Storage is not used for hero videos (avoids storage egress quotas).
 */

export const HERO_VIDEOS: Record<string, string> = {
  "2022-23": "2023hero.mp4",
  "2023-24": "2024hero.mp4",
};

export function resolveHeroVideoUrl(seasonId: string): string | undefined {
  const path = HERO_VIDEOS[seasonId]?.trim();
  const base = normalizeBase(process.env.NEXT_PUBLIC_MEDIA_BASE_URL);
  if (!path || !base) return undefined;
  return joinPublicUrl(base, path);
}

function normalizeBase(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;
  return raw.trim().replace(/\/+$/, "");
}

function joinPublicUrl(baseNoSlash: string, objectKeyRaw: string): string {
  const key = objectKeyRaw.replace(/^\/+/, "");
  const encoded = key
    .split("/")
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return encoded ? `${baseNoSlash}/${encoded}` : baseNoSlash;
}
