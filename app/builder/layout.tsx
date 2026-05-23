import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthorizedPage } from "@/lib/auth";

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAuthorizedPage();
  if (!ok) redirect("/builder-login");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/builder" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
              AI
            </span>
            <span className="font-bold">Landing Studio</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/builder"
              className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
            >
              Pages
            </Link>
            <Link
              href="/builder/new"
              className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
            >
              New
            </Link>
            <a
              href={`https://app.storyblok.com/#/me/spaces/${process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? ""}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
            >
              Storyblok ↗
            </a>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
