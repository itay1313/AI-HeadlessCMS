import Image from "next/image";
import { editable } from "./editable";
import type { StoryblokBlok, StoryblokAsset } from "@/types/storyblok";

type Feature = {
  _uid: string;
  title?: string;
  description?: string;
  image?: StoryblokAsset | null;
};
type Blok = StoryblokBlok<"features"> & { title?: string; features?: Feature[] };

export default function Features({ blok }: { blok: Blok }) {
  const features = blok.features ?? [];
  return (
    <section {...editable(blok)} className="px-6 py-24 md:py-32">
      <div className="container-x">
        {blok.title && (
          <h2 className="text-balance mx-auto mb-16 max-w-2xl text-center font-display text-heading font-bold">
            {blok.title}
          </h2>
        )}
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article key={f._uid} className="flex flex-col">
              {f.image?.filename ? (
                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
                  <Image
                    src={f.image.filename}
                    alt={f.image.alt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div aria-hidden="true" className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 font-display text-lg font-bold text-brand">
                  {String(i + 1).padStart(2, "0")}
                </div>
              )}
              <h3 className="text-xl font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
