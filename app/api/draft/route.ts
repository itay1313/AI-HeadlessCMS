import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

// Storyblok Visual Editor opens /api/draft?secret=...&slug=... in the iframe.
// We toggle Next's draftMode and redirect to the landing page route.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug") ?? "";
  if (!process.env.STORYBLOK_PREVIEW_SECRET || secret !== process.env.STORYBLOK_PREVIEW_SECRET) {
    return NextResponse.json({ error: "invalid_secret" }, { status: 401 });
  }
  const dm = await draftMode();
  dm.enable();
  const target = new URL(`/landing/${slug.replace(/^\/+/, "")}`, url.origin);
  return NextResponse.redirect(target);
}

export async function DELETE() {
  const dm = await draftMode();
  dm.disable();
  return NextResponse.json({ ok: true });
}
