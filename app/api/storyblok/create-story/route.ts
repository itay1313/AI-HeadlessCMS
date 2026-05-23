import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { landingPageDraftSchema } from "@/lib/validation/landingPageSchema";
import { mapDraftToStoryContent } from "@/lib/storyblok/mapper";
import {
  createStory,
  ensureLandingFolder,
  findStoryBySlug,
} from "@/lib/storyblok/management";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = landingPageDraftSchema.safeParse(body?.draft);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_draft", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const draft = parsed.data;
  const fullSlug = `landing/${draft.slug}`;
  const existing = await findStoryBySlug(fullSlug);
  if (existing) {
    return NextResponse.json(
      { error: "slug_taken", fullSlug },
      { status: 409 },
    );
  }
  const parentId = await ensureLandingFolder();
  const content = mapDraftToStoryContent(draft, {
    createdBy: body?.createdBy ?? "",
  });
  try {
    const created = await createStory({
      name: draft.pageName,
      slug: draft.slug,
      content,
      parent_id: parentId,
    });
    return NextResponse.json({ story: created.story });
  } catch (err) {
    const message = err instanceof Error ? err.message : "create_failed";
    return NextResponse.json({ error: "create_failed", message }, { status: 500 });
  }
}
