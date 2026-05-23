import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { landingPageDraftSchema } from "@/lib/validation/landingPageSchema";
import { mapDraftToStoryContent } from "@/lib/storyblok/mapper";
import { updateStory } from "@/lib/storyblok/management";

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
  const parsed = landingPageDraftSchema.safeParse(body?.draft);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_draft", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const draft = parsed.data;
  const content = mapDraftToStoryContent(draft);
  try {
    const updated = await updateStory(storyId, {
      name: draft.pageName,
      slug: draft.slug,
      content,
    });
    return NextResponse.json({ story: updated.story });
  } catch (err) {
    const message = err instanceof Error ? err.message : "update_failed";
    return NextResponse.json({ error: "update_failed", message }, { status: 500 });
  }
}
