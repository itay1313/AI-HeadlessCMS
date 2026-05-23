// Minimal shared-secret guard for the builder dashboard and write APIs.
// Set BUILDER_SHARED_SECRET in env, then send `x-builder-secret: <value>`
// or include `?secret=<value>` for browser links.
import { cookies } from "next/headers";

export const SECRET_COOKIE = "builder_secret";

export function expectedSecret() {
  const s = process.env.BUILDER_SHARED_SECRET;
  if (!s) throw new Error("BUILDER_SHARED_SECRET is not set");
  return s;
}

export function isAuthorizedRequest(req: Request): boolean {
  const expected = expectedSecret();
  const header = req.headers.get("x-builder-secret");
  if (header && header === expected) return true;
  const url = new URL(req.url);
  const q = url.searchParams.get("secret");
  if (q && q === expected) return true;
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${SECRET_COOKIE}=([^;]+)`));
  return Boolean(match && match[1] === expected);
}

export async function isAuthorizedPage(): Promise<boolean> {
  const expected = process.env.BUILDER_SHARED_SECRET;
  if (!expected) return false;
  const c = await cookies();
  return c.get(SECRET_COOKIE)?.value === expected;
}
