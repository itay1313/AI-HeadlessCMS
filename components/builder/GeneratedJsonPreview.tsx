"use client";

import type { LandingPageDraft } from "@/types/landing-page";

export default function GeneratedJsonPreview({
  draft,
  onChange,
}: {
  draft: LandingPageDraft;
  onChange: (next: LandingPageDraft) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-gray-600">
        Generated JSON (editable)
      </div>
      <textarea
        value={JSON.stringify(draft, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // ignore parse errors while typing
          }
        }}
        rows={30}
        spellCheck={false}
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 font-mono text-xs"
      />
    </div>
  );
}
