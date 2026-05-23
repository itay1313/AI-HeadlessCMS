import Link from "next/link";
import { listLandingPages } from "@/lib/storyblok/client";

export const dynamic = "force-dynamic";

export default async function BuilderHome() {
  let stories: Awaited<ReturnType<typeof listLandingPages>> = [];
  let error: string | null = null;
  try {
    stories = await listLandingPages({ draft: true });
  } catch (e) {
    error = e instanceof Error ? e.message : "load_failed";
  }

  const hasPages = stories.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your landing pages
          </h1>
          <p className="mt-1 text-gray-600">
            Generate, edit, and publish pages — your team can take it from
            there in Storyblok.
          </p>
        </div>
        <Link
          href="/builder/new"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700"
        >
          <span aria-hidden>+</span> New page
        </Link>
      </div>

      {/* Onboarding card (always visible) */}
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <h2 className="text-lg font-semibold">How this works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <FlowStep
            n="1"
            title="Generate"
            body="Click ‘New page’, describe your audience and product. AI returns a structured page in seconds."
          />
          <FlowStep
            n="2"
            title="Save to Storyblok"
            body="Saves your page as a story in Storyblok. Editors can change every field — text, images, CTAs."
          />
          <FlowStep
            n="3"
            title="Publish"
            body="One click publishes the story and updates your live site at /landing/<slug>."
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <a
            href={`https://app.storyblok.com/#/me/spaces/${process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? ""}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-white px-3 py-1.5 font-medium text-indigo-700 hover:bg-indigo-50"
          >
            Open Storyblok ↗
          </a>
          <span className="text-gray-500">
            Storyblok is where your team edits content after the AI draft.
          </span>
        </div>
      </section>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <strong>Couldn't reach Storyblok.</strong> Check your tokens in{" "}
          <code className="rounded bg-white px-1">.env.local</code>.
          <div className="mt-1 font-mono text-xs opacity-70">{error}</div>
        </div>
      )}

      {/* Empty state */}
      {!error && !hasPages && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl text-white">
            ✨
          </div>
          <h3 className="text-xl font-semibold">No pages yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-gray-600">
            Generate your first landing page with AI. It takes about 30 seconds.
          </p>
          <Link
            href="/builder/new"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Create your first page →
          </Link>
        </div>
      )}

      {/* Page list */}
      {!error && hasPages && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            All pages · {stories.length}
          </div>
          <ul className="divide-y divide-gray-100">
            {stories.map((s) => {
              const slug = s.full_slug.replace(/^landing\//, "");
              const published = Boolean(s.published_at);
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-gray-900">
                        {s.name}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          published
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate font-mono text-xs text-gray-500">
                      /{s.full_slug}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/landing/${slug}`}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <a
                      href={`https://app.storyblok.com/#/me/spaces/${process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? ""}/stories/0/0/${s.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Edit in Storyblok ↗
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
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
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-indigo-100">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
          {n}
        </span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}
