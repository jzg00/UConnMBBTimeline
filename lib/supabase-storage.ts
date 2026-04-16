const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const heroVideosBucket = process.env.NEXT_PUBLIC_SUPABASE_HERO_VIDEOS_BUCKET;

export function getHeroVideoUrl(objectPath: string) {
  if (!supabaseUrl || !heroVideosBucket) return undefined;
  const normalizedObjectPath = objectPath.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${heroVideosBucket}/${normalizedObjectPath}`;
}
