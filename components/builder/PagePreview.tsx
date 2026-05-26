"use client";

import { mapDraftToStoryContent } from "@/lib/storyblok/mapper";
import StoryblokRenderer from "@/components/storyblok/StoryblokRenderer";
import { templateStyle } from "@/lib/theme";
import type { LandingPageDraft } from "@/types/landing-page";
import type { StoryblokBlok } from "@/types/storyblok";

// Renders the in-memory draft using the same components used on the live site.
// We pass the draft through the mapper to get Storyblok-shaped bloks, so the
// preview is faithful to what editors will see after saving.
export default function PagePreview({ draft }: { draft: LandingPageDraft }) {
  const content = mapDraftToStoryContent(draft);
  const sections = (content.sections as StoryblokBlok[]) ?? [];
  return (
    <div
      style={templateStyle(draft.template)}
      className="overflow-hidden rounded-md border border-gray-200 bg-white"
    >
      <StoryblokRenderer sections={sections} />
    </div>
  );
}
