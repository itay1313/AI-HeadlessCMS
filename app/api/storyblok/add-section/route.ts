import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthorizedRequest } from "@/lib/auth";
import { generateSection } from "@/lib/ai/generateSection";
import { mapSection } from "@/lib/storyblok/mapper";
import {
  getStoryById,
  updateStory,
  publishStory,
} from "@/lib/storyblok/management";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const storyId = Number(body?.storyId);
  const prompt = String(body?.prompt ?? "").trim();
  if (!Number.isFinite(storyId)) {
    return NextResponse.json({ error: "missing_story_id" }, { status: 400 });
  }
  if (prompt.length < 5) {
    return NextResponse.json({ error: "prompt_too_short" }, { status: 400 });
  }

  try {
    // 1. AI generates one validated section
    const { section, modelUsed } = await generateSection(prompt);
    const blok = mapSection(section);

    // 2. Append to the story's existing sections
    const { story } = await getStoryById(storyId);
    const content = (story.content ?? {}) as {
      sections?: unknown[];
      [k: string]: unknown;
    };
    content.sections = Array.isArray(content.sections)
      ? [...content.sections, blok]
      : [blok];

    // 3. Save + publish
    await updateStory(storyId, { content });
    await publishStory(storyId);

    // 4. Revalidate the public page
    const slug = story.full_slug.replace(/^landing\//, "");
    revalidateTag("landing-pages");
    revalidateTag(`landing:${slug}`);
    revalidatePath(`/landing/${slug}`);

    return NextResponse.json({
      ok: true,
      component: section.component,
      modelUsed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "add_section_failed";
    return NextResponse.json(
      { error: "add_section_failed", message },
      { status: 500 },
    );
  }
}
