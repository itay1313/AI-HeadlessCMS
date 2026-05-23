import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SECRET_COOKIE, expectedSecret } from "@/lib/auth";

async function submit(formData: FormData) {
  "use server";
  const value = String(formData.get("secret") ?? "");
  if (value !== expectedSecret()) {
    redirect("/builder-login?error=1");
  }
  const c = await cookies();
  c.set(SECRET_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/builder");
}

export default async function BuilderLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
            AI
          </span>
          <span className="text-lg font-bold">Landing Studio</span>
        </div>

        <h1 className="text-2xl font-bold">Sign in</h1>

        <form action={submit} className="mt-6 space-y-3">
          <input
            name="secret"
            type="password"
            autoFocus
            required
            placeholder="Password"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {error && (
            <p className="text-sm text-red-600">Wrong password.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700"
          >
            Sign in
          </button>
        </form>

        {process.env.NODE_ENV !== "production" &&
          process.env.BUILDER_SHARED_SECRET && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-800">
              <span className="font-semibold">Test mode</span> · password:{" "}
              <code className="rounded bg-white px-1.5 py-0.5 font-mono">
                {process.env.BUILDER_SHARED_SECRET}
              </code>
            </div>
          )}
      </div>
    </main>
  );
}
