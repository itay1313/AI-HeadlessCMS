import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthorizedRequest } from "@/lib/auth";
import {
  getStoryById,
  updateStory,
  publishStory,
  unpublishStory,
} from "@/lib/storyblok/management";

export const runtime = "nodejs";

type Action = "rename" | "publish" | "unpublish";

export async function POST(req: Request) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const storyId = Number(body?.storyId);
  const action = body?.action as Action;
  if (!Number.isFinite(storyId)) {
    return NextResponse.json({ error: "missing_story_id" }, { status: 400 });
  }

  try {
    const { story } = await getStoryById(storyId);
    const slug = story.full_slug.replace(/^landing\//, "");

    if (action === "rename") {
      const name = String(body?.name ?? "").trim();
      if (name.length < 1) {
        return NextResponse.json({ error: "empty_name" }, { status: 400 });
      }
      // Preserve slug + content; only change the display name.
      await updateStory(storyId, {
        name,
        slug,
        content: story.content as Record<string, unknown>,
      });
      // Republish so the change is live (if it was published).
      if (story && (story as { published_at?: string }).published_at) {
        await publishStory(storyId);
      }
    } else if (action === "publish") {
      await publishStory(storyId);
    } else if (action === "unpublish") {
      await unpublishStory(storyId);
    } else {
      return NextResponse.json({ error: "unknown_action" }, { status: 400 });
    }

    revalidateTag("landing-pages");
    revalidateTag(`landing:${slug}`);
    revalidatePath(`/landing/${slug}`);

    return NextResponse.json({ ok: true, action });
  } catch (err) {
    const message = err instanceof Error ? err.message : "page_settings_failed";
    return NextResponse.json(
      { error: "page_settings_failed", message },
      { status: 500 },
    );
  }
}
