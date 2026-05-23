"use client";

import { useState } from "react";
import BriefForm from "@/components/builder/BriefForm";
import GeneratedJsonPreview from "@/components/builder/GeneratedJsonPreview";
import PagePreview from "@/components/builder/PagePreview";
import PublishActions from "@/components/builder/PublishActions";
import type { Brief, LandingPageDraft } from "@/types/landing-page";

export default function BuilderClient({ secret }: { secret: string }) {
  const [draft, setDraft] = useState<LandingPageDraft | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"preview" | "json">("preview");

  async function generate(brief: Brief) {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-builder-secret": secret,
        },
        body: JSON.stringify(brief),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? json?.error ?? "failed");
      setDraft(json.draft);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <section>
        <h2 className="mb-4 text-lg font-bold">Page brief</h2>
        <BriefForm onGenerate={generate} generating={generating} />
        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      <section>
        {!draft ? (
          <div className="flex h-full min-h-[400px] items-center justify-center rounded-md border border-dashed border-gray-300 bg-white text-gray-500">
            Fill in the brief and click "Generate".
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex rounded-md border border-gray-300 bg-white p-1 text-sm">
                <button
                  onClick={() => setTab("preview")}
                  className={`rounded px-3 py-1 ${tab === "preview" ? "bg-brand text-white" : ""}`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setTab("json")}
                  className={`rounded px-3 py-1 ${tab === "json" ? "bg-brand text-white" : ""}`}
                >
                  JSON
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Slug: <code>{draft.slug}</code>
              </div>
            </div>

            {tab === "preview" ? (
              <PagePreview draft={draft} />
            ) : (
              <GeneratedJsonPreview draft={draft} onChange={setDraft} />
            )}

            <PublishActions draft={draft} secret={secret} />
          </div>
        )}
      </section>
    </div>
  );
}
