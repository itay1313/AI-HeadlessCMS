import StoryblokClient from "storyblok-js-client";
import type { StoryblokStory } from "@/types/storyblok";

const publicToken = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN;
const previewToken = process.env.STORYBLOK_PREVIEW_TOKEN;

if (!publicToken) {
  // Allowed at build time so type-check passes without env; runtime guards below.
  console.warn("[storyblok] NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN is not set");
}

export const publishedClient = new StoryblokClient({
  accessToken: publicToken ?? "",
  cache: { clear: "auto", type: "memory" },
});

export const draftClient = new StoryblokClient({
  accessToken: previewToken ?? publicToken ?? "",
});

export type FetchOptions = { draft?: boolean };

export async function getStoryBySlug(
  slug: string,
  opts: FetchOptions = {},
): Promise<StoryblokStory | null> {
  const client = opts.draft ? draftClient : publishedClient;
  const fullSlug = `landing/${slug.replace(/^\/+|\/+$/g, "")}`;
  try {
    const { data } = await client.get(`cdn/stories/${fullSlug}`, {
      version: opts.draft ? "draft" : "published",
      resolve_links: "url",
    });
    return (data?.story as StoryblokStory) ?? null;
  } catch (err: unknown) {
    const e = err as { status?: number; response?: { status?: number } };
    if (e?.status === 404 || e?.response?.status === 404) return null;
    throw err;
  }
}

export async function listLandingPages(
  opts: FetchOptions = {},
): Promise<StoryblokStory[]> {
  const client = opts.draft ? draftClient : publishedClient;
  const { data } = await client.get("cdn/stories", {
    version: opts.draft ? "draft" : "published",
    starts_with: "landing/",
    per_page: 100,
  });
  return (data?.stories as StoryblokStory[]) ?? [];
}
