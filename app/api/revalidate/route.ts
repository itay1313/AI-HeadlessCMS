import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Optional webhook target for Storyblok "Story published" events.
// Configure secret in Storyblok webhook and STORYBLOK_WEBHOOK_SECRET in env.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (!process.env.STORYBLOK_WEBHOOK_SECRET || secret !== process.env.STORYBLOK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "invalid_secret" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as
    | { full_slug?: string; story_id?: number }
    | null;
  const fullSlug = body?.full_slug;
  if (fullSlug?.startsWith("landing/")) {
    const slug = fullSlug.replace(/^landing\//, "");
    revalidateTag(`landing:${slug}`);
    revalidatePath(`/landing/${slug}`);
  }
  revalidateTag("landing-pages");
  return NextResponse.json({ ok: true });
}
