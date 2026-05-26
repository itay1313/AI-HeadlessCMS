import Link from "next/link";
import { listLandingPages } from "@/lib/storyblok/client";
import RecentList from "@/components/builder/RecentList";

export const dynamic = "force-dynamic";

const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? "";

const sw = "1.8";
const ic = "h-6 w-6";

const ACTIONS = [
  {
    title: "Generate from a prompt",
    desc: "Describe your page — AI writes the copy, picks sections and a design.",
    href: "/builder/new",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <path d="M5 19 19 5M14 5h.01M19 10h.01M9 4h.01M4 9h.01" strokeLinecap="round" />
        <path d="m13 7 4 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Pick a design template",
    desc: "AI styles each page — modern, editorial, vibrant, fresh, and more.",
    href: "/builder/new",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 21V9" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Browse your pages",
    desc: "See everything you've built. Open, edit, publish, or hide.",
    href: "#recent",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Edit content in Storyblok",
    desc: "Your team changes text, images, and CTAs visually — no code.",
    href: `https://app.storyblok.com/#/me/spaces/${spaceId}`,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 9h5M9 13h6M9 9v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Add a section with AI",
    desc: "On any page, describe a section and the AI appends it instantly.",
    href: "/builder/new",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "View the live site",
    desc: "See published pages exactly as your visitors do.",
    href: "/",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} className={ic}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </svg>
    ),
  },
];

export default async function BuilderHome() {
  let stories: Awaited<ReturnType<typeof listLandingPages>> = [];
  let error: string | null = null;
  try {
    stories = await listLandingPages({ draft: true });
  } catch (e) {
    error = e instanceof Error ? e.message : "load_failed";
  }

  const items = stories.map((s) => ({
    id: s.id,
    name: s.name,
    fullSlug: s.full_slug,
    published: Boolean(s.published_at),
  }));
  const publishedCount = items.filter((i) => i.published).length;

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-white/45">What do you want to build today?</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-white/70">
            {items.length} pages · {publishedCount} live
          </span>
        </div>
      </div>

      {/* Feature banner */}
      <Link
        href="/builder/new"
        className="group relative block overflow-hidden rounded-3xl border border-white/10 p-8 md:p-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/15 via-fuchsia-600/15 to-indigo-600/20" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-[90px]"
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15">
            <span className="rounded-full bg-white px-1.5 text-[10px] font-bold text-ink">NEW</span>
            AI page generation
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            Describe it.{" "}
            <span className="bg-gradient-to-r from-amber-300 to-fuchsia-300 bg-clip-text text-transparent">
              We build it.
            </span>
          </h2>
          <p className="mt-2 max-w-xl text-white/70">
            Turn one prompt into a full, themed landing page — synced to
            Storyblok and ready to publish.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition group-hover:-translate-y-0.5">
            Create a page →
          </span>
        </div>
      </Link>

      {/* Action cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => {
          const inner = (
            <>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/80 ring-1 ring-white/10 transition group-hover:text-white">
                {a.icon}
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                {a.desc}
              </p>
            </>
          );
          const cls =
            "group rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]";
          return a.external ? (
            <a key={a.title} href={a.href} target="_blank" rel="noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <Link key={a.title} href={a.href} className={cls}>
              {inner}
            </Link>
          );
        })}
      </div>

      {/* Recent / Drafts */}
      <RecentList items={items} error={error} spaceId={spaceId} />
    </div>
  );
}
