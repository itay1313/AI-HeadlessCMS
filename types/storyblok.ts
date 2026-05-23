import type { ComponentName } from "@/lib/ai/registry";

export type StoryblokAsset = {
  id?: number | null;
  filename: string;
  alt?: string;
  name?: string;
};

export type StoryblokBlok<T extends ComponentName = ComponentName> = {
  _uid: string;
  component: T;
  [key: string]: unknown;
};

export type SeoBlok = {
  _uid: string;
  component: "seo";
  meta_title: string;
  meta_description: string;
  og_image?: StoryblokAsset | null;
  canonical_url?: string;
  no_index?: boolean;
};

export type LandingPageContent = {
  _uid: string;
  component: "landing_page";
  seo: SeoBlok[];
  sections: StoryblokBlok[];
  generated_by_ai?: boolean;
  ai_brief?: string;
  created_by?: string;
};

export type StoryblokStory = {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  full_slug: string;
  content: LandingPageContent;
  published_at: string | null;
  first_published_at: string | null;
};
