import { editable } from "./editable";
import type { StoryblokBlok } from "@/types/storyblok";

type TextBlok = StoryblokBlok<"text_section"> & {
  title?: string;
  body?: string;
  alignment?: "left" | "center" | "right";
  max_width?: "narrow" | "medium" | "wide";
};

const widthClass = {
  narrow: "max-w-2xl",
  medium: "max-w-3xl",
  wide: "max-w-5xl",
};

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function TextSection({ blok }: { blok: TextBlok }) {
  return (
    <section {...editable(blok)} className="px-6 py-20 md:py-24">
      <div
        className={`mx-auto ${widthClass[blok.max_width ?? "medium"]} ${alignClass[blok.alignment ?? "left"]}`}
      >
        {blok.title && (
          <h2 className="text-balance mb-6 font-display text-heading font-bold">
            {blok.title}
          </h2>
        )}
        {blok.body && (
          <div className="whitespace-pre-line text-lg leading-relaxed text-ink-muted">
            {blok.body}
          </div>
        )}
      </div>
    </section>
  );
}
