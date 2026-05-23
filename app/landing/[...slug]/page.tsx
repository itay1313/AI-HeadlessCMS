import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { getStoryBySlug, listLandingPages } from "@/lib/storyblok/client";
import StoryblokRenderer from "@/components/storyblok/StoryblokRenderer";
import AiSectionFab from "@/components/builder/AiSectionFab";
import type { SeoBlok, StoryblokBlok } from "@/types/storyblok";

export const revalidate = 60;
export const dynamicParams = true;

type Params = { slug: string[] };

export async function generateStaticParams() {
  try {
    const stories = await listLandingPages();
    return stories.map((s) => ({
      slug: s.full_slug.replace(/^landing\//, "").split("/"),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug.join("/"));
  if (!story) return { title: "Not found" };
  const seo: SeoBlok | undefined = story.content.seo?.[0];
  return {
    title: seo?.meta_title ?? story.name,
    description: seo?.meta_description,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
    robots: seo?.no_index ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.meta_title ?? story.name,
      description: seo?.meta_description,
      images: seo?.og_image?.filename ? [seo.og_image.filename] : undefined,
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const dm = await draftMode();
  const story = await getStoryBySlug(slug.join("/"), { draft: dm.isEnabled });
  if (!story) notFound();

  const sections = (story.content.sections ?? []) as StoryblokBlok[];
  const spaceId = process.env.NEXT_PUBLIC_STORYBLOK_SPACE_ID ?? "";
  const editUrl = `https://app.storyblok.com/#/me/spaces/${spaceId}/stories/0/0/${story.id}`;
  const showEditButton = process.env.NODE_ENV !== "production";

  return (
    <main id="main">
      {dm.isEnabled && (
        <div className="bg-yellow-300 px-4 py-2 text-center text-sm font-medium text-ink">
          Draft preview · <a href="/api/draft" className="underline">exit</a>
        </div>
      )}
      <StoryblokRenderer sections={sections} />

      {showEditButton && spaceId && (
        <a
          href={editUrl}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:bg-gray-800"
        >
          ✏️ Edit in Storyblok ↗
        </a>
      )}

      {showEditButton && (
        <AiSectionFab storyId={story.id} slug={slug.join("/")} />
      )}
    </main>
  );
}
