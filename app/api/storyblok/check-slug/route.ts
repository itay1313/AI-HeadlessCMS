import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { findStoryBySlug } from "@/lib/storyblok/management";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "missing_slug" }, { status: 400 });
  }
  const existing = await findStoryBySlug(`landing/${slug}`);
  return NextResponse.json({ available: !existing });
}
