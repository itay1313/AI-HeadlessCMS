"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingNavTools({
  storyId,
  name,
  published,
}: {
  storyId: number;
  name: string;
  published: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pageName, setPageName] = useState(name);
  const [isPublished, setIsPublished] = useState(published);
  const [busy, setBusy] = useState<"rename" | "publish" | "unpublish" | null>(
    null,
  );
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  async function call(action: "rename" | "publish" | "unpublish") {
    setBusy(action);
    setError(null);
    setNote(null);
    try {
      const res = await fetch("/api/storyblok/page-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          action,
          name: action === "rename" ? pageName.trim() : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Sign in at /builder first, then try again.");
        throw new Error(json?.message ?? json?.error ?? "Failed");
      }
      if (action === "publish") setIsPublished(true);
      if (action === "unpublish") setIsPublished(false);
      setNote(
        action === "rename"
          ? "Renamed ✓"
          : action === "publish"
            ? "Published ✓"
            : "Hidden (unpublished) ✓",
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {/* Back to all pages — top-left */}
      <Link
        href="/builder"
        className="fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
      >
        ← All pages
      </Link>

      {/* Page settings — top-right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="fixed right-5 top-5 z-50 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-lg ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
      >
        ⚙ Page
        <span
          className={`inline-block h-2 w-2 rounded-full ${isPublished ? "bg-green-500" : "bg-amber-500"}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="page-settings-title"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => !busy && setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 text-ink shadow-lift md:p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2 id="page-settings-title" className="font-display text-2xl font-bold">
                Page settings
              </h2>
              <button
                type="button"
                onClick={() => !busy && setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-ink-muted hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Status */}
            <div className="mb-5 flex items-center gap-2 text-sm">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${isPublished ? "bg-green-500" : "bg-amber-500"}`}
                aria-hidden="true"
              />
              <span className="font-medium">
                {isPublished ? "Published — live on the site" : "Hidden — not live"}
              </span>
            </div>

            {/* Rename */}
            <label htmlFor="page-name" className="mb-1.5 block text-sm font-medium">
              Page name
            </label>
            <div className="flex gap-2">
              <input
                id="page-name"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                disabled={busy !== null}
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => call("rename")}
                disabled={busy !== null || pageName.trim() === name || !pageName.trim()}
                className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40"
              >
                {busy === "rename" ? "Saving…" : "Save"}
              </button>
            </div>

            {/* Publish / Hide */}
            <div className="mt-6 flex gap-3">
              {isPublished ? (
                <button
                  type="button"
                  onClick={() => call("unpublish")}
                  disabled={busy !== null}
                  className="flex-1 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
                >
                  {busy === "unpublish" ? "Hiding…" : "Hide (unpublish)"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => call("publish")}
                  disabled={busy !== null}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {busy === "publish" ? "Publishing…" : "Publish"}
                </button>
              )}
            </div>

            {note && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                {note}
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <p className="mt-5 text-center text-xs text-ink-muted">
              <a
                href={`https://app.storyblok.com/#/me/spaces/${process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? ""}/stories/0/0/${storyId}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand underline"
              >
                Open in Storyblok ↗
              </a>{" "}
              for full editing.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
