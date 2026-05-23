"use client";

import { useState } from "react";
import type { Brief } from "@/types/landing-page";

const EXAMPLES = [
  "A landing page for a SaaS that helps dog walkers schedule and bill clients. Friendly, playful tone. Include hero, benefits, pricing, testimonials, FAQ, and a final CTA.",
  "Launch page for a new AI note-taking app aimed at students. Modern, confident tone. Sections: hero with a demo, features, social proof, pricing, FAQ.",
  "Waitlist page for an indie coffee subscription. Warm, hand-crafted tone. Hero + benefits + how-it-works + signup form + FAQ.",
];

export default function BriefForm({
  onGenerate,
  generating,
}: {
  onGenerate: (brief: Brief) => void;
  generating: boolean;
}) {
  const [prompt, setPrompt] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (prompt.trim().length < 10) return;
        onGenerate({ prompt: prompt.trim() });
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-900">
          Describe the landing page you want
        </span>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
          required
          placeholder="e.g. A landing page for a SaaS that helps dog walkers schedule and bill clients. Friendly, playful tone. Include hero, benefits, pricing, testimonials, FAQ, and a final CTA."
          className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-gray-500">
          <span>
            Be specific about audience, tone, and which sections to include.
          </span>
          <span>{prompt.length}/2000</span>
        </div>
      </label>

      <div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Or try an example
        </div>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(ex)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={generating || prompt.trim().length < 10}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {generating ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Generating…
          </>
        ) : (
          <>
            ✨ Generate landing page
          </>
        )}
      </button>
    </form>
  );
}
