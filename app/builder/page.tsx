import Link from "next/link";
import { listLandingPages } from "@/lib/storyblok/client";

export const dynamic = "force-dynamic";

const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? "";

// Deterministic soft gradient per card based on the page id.
const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-sky-500 to-indigo-600",
  "from-fuchsia-500 to-pink-600",
  "from-violet-500 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-fuchsia-600",
];

export default async function BuilderHome() {
  let stories: Awaited<ReturnType<typeof listLandingPages>> = [];
  let error: string | null = null;
  try {
    stories = await listLandingPages({ draft: true });
  } catch (e) {
    error = e instanceof Error ? e.message : "load_failed";
  }

  const hasPages = stories.length > 0;
  const publishedCount = stories.filter((s) => s.published_at).length;
  const draftCount = stories.length - publishedCount;

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl bg-ink px-8 py-10 text-white md:px-12 md:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-brand/40 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[110px]"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Dashboard
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Your landing pages
            </h1>
            <p className="mt-3 max-w-lg text-white/70">
              Generate with AI, edit visually in Storyblok, publish in one click.
            </p>
          </div>
          <Link
            href="/builder/new"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-glow transition hover:-translate-y-0.5"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              +
            </span>
            New page
          </Link>
        </div>

        {/* Stats */}
        <div className="relative mt-10 grid max-w-md grid-cols-3 gap-4">
          <Stat label="Total" value={stories.length} />
          <Stat label="Published" value={publishedCount} accent="text-green-300" />
          <Stat label="Drafts" value={draftCount} accent="text-amber-300" />
        </div>
      </header>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <strong>Couldn&apos;t reach Storyblok.</strong> Check your tokens in{" "}
          <code className="rounded bg-white px-1">.env.local</code>.
          <div className="mt-1 font-mono text-xs opacity-70">{error}</div>
        </div>
      )}

      {/* Empty state */}
      {!error && !hasPages && (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl text-white shadow-glow">
            ✨
          </div>
          <h3 className="font-display text-2xl font-bold">No pages yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-ink-muted">
            Generate your first landing page with AI — it takes about 30 seconds.
          </p>
          <Link
            href="/builder/new"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Create your first page →
          </Link>
        </div>
      )}

      {/* Page grid */}
      {!error && hasPages && (
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-muted">
              All pages · {stories.length}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s, i) => {
              const slug = s.full_slug.replace(/^landing\//, "");
              const published = Boolean(s.published_at);
              const grad = GRADIENTS[i % GRADIENTS.length];
              return (
                <article
                  key={s.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/[0.04] transition hover:-translate-y-1 hover:shadow-lift"
                >
                  {/* Gradient banner */}
                  <div
                    className={`relative h-24 bg-gradient-to-br ${grad}`}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] [background-size:18px_18px] opacity-40" />
                    <span className="absolute bottom-3 left-4 font-display text-3xl font-bold text-white/90">
                      {s.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-semibold tracking-tight">
                        {s.name}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          published
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {published ? "Live" : "Draft"}
                      </span>
                    </div>
                    <div className="mt-1 truncate font-mono text-xs text-ink-muted">
                      /{s.full_slug}
                    </div>

                    <div className="mt-5 flex gap-2 pt-1">
                      <Link
                        href={`/landing/${slug}`}
                        className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-center text-xs font-semibold text-ink transition hover:bg-gray-50"
                      >
                        View
                      </Link>
                      <a
                        href={`https://app.storyblok.com/#/me/spaces/${spaceId}/stories/0/0/${s.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-full bg-ink px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-ink-soft"
                      >
                        Edit ↗
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* How it works (refined, secondary) */}
      <section className="rounded-3xl border border-gray-100 bg-gray-50/70 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold">How it works</h2>
          <a
            href={`https://app.storyblok.com/#/me/spaces/${spaceId}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-indigo-50"
          >
            Open Storyblok ↗
          </a>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <FlowStep n="1" title="Generate" body="Describe your audience and product. AI returns a structured page in seconds." />
          <FlowStep n="2" title="Edit in Storyblok" body="Your team changes any field — text, images, CTAs — visually, no code." />
          <FlowStep n="3" title="Publish" body="One click publishes the story and updates your live site instantly." />
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = "text-white",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10 backdrop-blur">
      <div className={`font-display text-3xl font-bold ${accent}`}>{value}</div>
      <div className="mt-0.5 text-xs uppercase tracking-wider text-white/50">
        {label}
      </div>
    </div>
  );
}

function FlowStep({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/[0.04]">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white">
        {n}
      </span>
      <h3 className="mt-3 font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{body}</p>
    </div>
  );
}
