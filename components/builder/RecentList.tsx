"use client";

import Link from "next/link";
import { useState } from "react";

export type PageItem = {
  id: number;
  name: string;
  fullSlug: string;
  published: boolean;
};

export default function RecentList({
  items,
  error,
  spaceId,
}: {
  items: PageItem[];
  error: string | null;
  spaceId: string;
}) {
  const [tab, setTab] = useState<"recent" | "drafts">("recent");
  const shown = tab === "drafts" ? items.filter((i) => !i.published) : items;

  return (
    <section id="recent" className="pt-2">
      <div className="mb-4 flex items-center gap-1 rounded-full bg-white/[0.04] p-1 text-sm w-fit ring-1 ring-white/10">
        {(["recent", "drafts"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 font-medium capitalize transition ${
              tab === t ? "bg-white text-ink" : "text-white/60 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          <strong>Couldn&apos;t reach Storyblok.</strong> Check your tokens in{" "}
          <code className="rounded bg-white/10 px-1">.env.local</code>.
        </div>
      )}

      {!error && shown.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-white/40">
          {tab === "drafts" ? "No drafts." : "No pages yet — create your first one."}
        </div>
      )}

      <ul className="space-y-2">
        {shown.map((s) => {
          const slug = s.fullSlug.replace(/^landing\//, "");
          return (
            <li
              key={s.id}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 font-display text-lg font-bold text-white/80 ring-1 ring-white/10">
                  {s.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold">{s.name}</span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-white/45">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${s.published ? "bg-emerald-400" : "bg-amber-400"}`}
                      />
                      {s.published ? "Live" : "Draft"}
                    </span>
                  </div>
                  <div className="truncate font-mono text-xs text-white/35">
                    /{s.fullSlug}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/landing/${slug}`}
                  className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                >
                  View
                </Link>
                <a
                  href={`https://app.storyblok.com/#/me/spaces/${spaceId}/stories/0/0/${s.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink transition hover:bg-white/90"
                >
                  Edit ↗
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
