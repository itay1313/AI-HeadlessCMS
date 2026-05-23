import { NextResponse } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { generateLandingPage } from "@/lib/ai/generateLandingPage";
import { briefSchema } from "@/lib/validation/landingPageSchema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAuthorizedRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = briefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_brief", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  try {
    const { draft, modelUsed } = await generateLandingPage(parsed.data);
    return NextResponse.json({ draft, modelUsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "generation_failed";
    return NextResponse.json({ error: "generation_failed", message }, { status: 500 });
  }
}
