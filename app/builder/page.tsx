import Link from "next/link";
import { listLandingPages } from "@/lib/storyblok/client";

export const dynamic = "force-dynamic";

const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? "";

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
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Landing pages
          </h1>
          <p className="mt-2 text-ink-muted">
            Generate with AI, edit in Storyblok, publish in one click.
          </p>
        </div>
        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-ink-soft"
        >
          <span aria-hidden="true" className="text-base leading-none">
            +
          </span>
          New page
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <Stat label="Total" value={stories.length} />
        <Stat label="Published" value={publishedCount} dot="bg-emerald-500" />
        <Stat label="Drafts" value={draftCount} dot="bg-gray-300" />
      </div>

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
        <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-2xl text-white">
            +
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

      {/* Pages */}
      {!error && hasPages && (
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            All pages · {stories.length}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => {
              const slug = s.full_slug.replace(/^landing\//, "");
              const published = Boolean(s.published_at);
              return (
                <article
                  key={s.id}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-soft"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 font-display text-lg font-bold text-ink">
                        {s.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold tracking-tight">
                          {s.name}
                        </h3>
                        <div className="truncate font-mono text-xs text-ink-muted">
                          /{s.full_slug}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-muted">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-gray-300"}`}
                      />
                      {published ? "Live" : "Draft"}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2">
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
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="rounded-3xl border border-gray-100 bg-gray-50/60 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold">How it works</h2>
          <a
            href={`https://app.storyblok.com/#/me/spaces/${spaceId}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-ink transition hover:bg-gray-50"
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
  dot,
}: {
  label: string;
  value: number;
  dot?: string;
}) {
  return (
    <div className="px-6 py-5">
      <div className="flex items-center gap-2">
        {dot && (
          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${dot}`} />
        )}
        <span className="font-display text-3xl font-bold tracking-tight">
          {value}
        </span>
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
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
    <div className="rounded-2xl bg-white p-5 ring-1 ring-black/[0.04]">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
        {n}
      </span>
      <h3 className="mt-3 font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{body}</p>
    </div>
  );
}
