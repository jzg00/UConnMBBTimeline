const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

/** Build a public URL for an object in a Supabase Storage public bucket. */
export function getPublicStorageUrl(
  bucket: string | null | undefined,
  objectPath: string | null | undefined
): string | undefined {
  if (!supabaseUrl || !bucket || !objectPath) return undefined;
  const normalized = objectPath.replace(/^\/+/, "");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${normalized}`;
}
