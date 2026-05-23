"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LandingPageDraft } from "@/types/landing-page";

type Status = "idle" | "saving" | "publishing" | "saved" | "published";

export default function PublishActions({
  draft,
  secret,
}: {
  draft: LandingPageDraft;
  secret: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [storyId, setStoryId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(): Promise<number | null> {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/storyblok/create-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-builder-secret": secret,
        },
        body: JSON.stringify({ draft }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? json?.error ?? "save_failed");
      setStoryId(json.story.id);
      setStatus("saved");
      return json.story.id as number;
    } catch (e) {
      setError(e instanceof Error ? e.message : "save_failed");
      setStatus("idle");
      return null;
    }
  }

  async function publish(id: number) {
    setStatus("publishing");
    setError(null);
    try {
      const res = await fetch("/api/storyblok/publish-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-builder-secret": secret,
        },
        body: JSON.stringify({ storyId: id }),
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.message ?? json?.error ?? "publish_failed");
      setStatus("published");
      // Storyblok CDN can lag a few seconds; give it a beat.
      setTimeout(() => router.push(`/landing/${draft.slug}`), 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "publish_failed");
      setStatus("saved");
    }
  }

  async function saveAndPublish() {
    const id = storyId ?? (await save());
    if (id) await publish(id);
  }

  const busy = status === "saving" || status === "publishing";
  const label =
    status === "saving"
      ? "Saving to Storyblok…"
      : status === "publishing"
        ? "Publishing…"
        : status === "published"
          ? "Published ✓"
          : "🚀 Save & Publish";

  return (
    <div className="space-y-3">
      <button
        onClick={saveAndPublish}
        disabled={busy || status === "published"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {label}
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {!storyId && (
            <button
              onClick={save}
              disabled={busy}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Save as draft only
            </button>
          )}
          {storyId && (
            <a
              href={`https://app.storyblok.com/#/me/spaces/${process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? ""}/stories/0/0/${storyId}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
            >
              Edit in Storyblok ↗
            </a>
          )}
        </div>
        {storyId && status !== "published" && (
          <button
            onClick={() => publish(storyId)}
            disabled={busy}
            className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Publish now
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {status === "published" && (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Published! Redirecting to your live page…
        </div>
      )}
    </div>
  );
}
