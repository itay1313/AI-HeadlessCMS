import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthorizedRequest } from "@/lib/auth";
import { getStoryById, publishStory } from "@/lib/storyblok/management";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const storyId = Number(body?.storyId);
  if (!Number.isFinite(storyId)) {
    return NextResponse.json({ error: "missing_story_id" }, { status: 400 });
  }
  try {
    await publishStory(storyId);
    const { story } = await getStoryById(storyId);
    const slug = story.full_slug.replace(/^landing\//, "");
    revalidateTag("landing-pages");
    revalidateTag(`landing:${slug}`);
    revalidatePath(`/landing/${slug}`);
    return NextResponse.json({ ok: true, fullSlug: story.full_slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "publish_failed";
    return NextResponse.json({ error: "publish_failed", message }, { status: 500 });
  }
}
