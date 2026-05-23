import Image from "next/image";
import { editable } from "./editable";
import type { StoryblokBlok, StoryblokAsset } from "@/types/storyblok";

type Blok = StoryblokBlok<"image_text"> & {
  title?: string;
  body?: string;
  image?: StoryblokAsset | null;
  image_position?: "left" | "right";
  cta_text?: string;
  cta_url?: string;
};

export default function ImageTextSection({ blok }: { blok: Blok }) {
  const right = blok.image_position === "right";
  return (
    <section {...editable(blok)} className="px-6 py-24 md:py-32">
      <div className="container-x grid items-center gap-12 md:grid-cols-2">
        {blok.image?.filename && (
          <div
            className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-lift ring-1 ring-black/5 ${
              right ? "md:order-2" : ""
            }`}
          >
            <Image
              src={blok.image.filename}
              alt={blok.image.alt ?? ""}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div>
          {blok.title && (
            <h2 className="text-balance font-display text-heading font-bold">
              {blok.title}
            </h2>
          )}
          {blok.body && (
            <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-ink-muted">
              {blok.body}
            </p>
          )}
          {blok.cta_text && blok.cta_url && (
            <a
              href={blok.cta_url}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              {blok.cta_text}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
