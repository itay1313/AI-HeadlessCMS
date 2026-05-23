"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "Add a section with a big image and a bold title",
  "Add a pricing section with 3 plans",
  "Add an FAQ with 4 common questions",
  "Add customer testimonials",
];

export default function AiSectionFab({
  storyId,
  slug,
}: {
  storyId: number;
  slug: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when the modal opens; close on Escape.
  useEffect(() => {
    if (!open) return;
    textareaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy]);

  async function addSection() {
    if (prompt.trim().length < 5) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/storyblok/add-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, prompt: prompt.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(
            "Not signed in. Open /builder and sign in first, then try again.",
          );
        }
        throw new Error(json?.message ?? json?.error ?? "Failed to add section");
      }
      setDone(json.component);
      setPrompt("");
      // Give Storyblok's CDN a moment, then re-fetch server data WITHOUT a
      // full reload — keeps the modal + button mounted so you can add more.
      setTimeout(() => {
        router.refresh();
        setBusy(false);
        // Clear the success note shortly after so the form is ready again.
        setTimeout(() => setDone(null), 2500);
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating action button (bottom-left) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="fixed bottom-5 left-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
      >
        ✨ Add section with AI
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-section-title"
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => !busy && setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal card */}
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 text-ink shadow-lift md:p-8">
            <div className="mb-1 flex items-start justify-between gap-4">
              <h2
                id="ai-section-title"
                className="font-display text-2xl font-bold"
              >
                Add a section with AI
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
            <p className="mb-4 text-sm text-ink-muted">
              Describe the section you want. The AI builds it from approved
              blocks and publishes it to this page.
            </p>

            <label htmlFor="ai-section-prompt" className="sr-only">
              Describe the section to add
            </label>
            <textarea
              id="ai-section-prompt"
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={busy}
              placeholder="e.g. Add a section with a big image and a bold title"
              className="w-full resize-y rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  disabled={busy}
                  onClick={() => setPrompt(ex)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-ink-muted transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
                >
                  {ex}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {done && (
              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                Added a “{done}” section ✓ — add another, or close.
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => !busy && setOpen(false)}
                disabled={busy}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink-muted hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addSection}
                disabled={busy || prompt.trim().length < 5}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {busy ? "Adding…" : "Add section"}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-ink-muted">
              Want to tweak existing sections? Edit them in{" "}
              <a
                href={`https://app.storyblok.com/#/me/spaces/${process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? ""}/stories/0/0/${storyId}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand underline"
              >
                Storyblok
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
}
