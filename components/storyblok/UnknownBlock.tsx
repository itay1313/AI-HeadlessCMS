import type { StoryblokBlok } from "@/types/storyblok";

export default function UnknownBlock({ blok }: { blok: StoryblokBlok }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="m-6 rounded-md border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-900">
      Unknown block: <code>{blok.component}</code>
    </div>
  );
}
