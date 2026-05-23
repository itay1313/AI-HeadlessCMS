import { editable } from "./editable";
import type { StoryblokBlok } from "@/types/storyblok";

type Item = {
  _uid: string;
  quote?: string;
  author_name?: string;
  author_role?: string;
};
type Blok = StoryblokBlok<"testimonials"> & {
  title?: string;
  testimonials?: Item[];
};

export default function Testimonials({ blok }: { blok: Blok }) {
  const items = blok.testimonials ?? [];
  return (
    <section {...editable(blok)} className="bg-ink px-6 py-24 text-white md:py-32">
      <div className="container-x">
        {blok.title && (
          <h2 className="text-balance mx-auto mb-16 max-w-2xl text-center font-display text-heading font-bold">
            {blok.title}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t._uid}
              className="flex flex-col justify-between rounded-3xl bg-white/[0.04] p-8 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/[0.07]"
            >
              <blockquote className="text-lg leading-relaxed text-white/90">
                <span aria-hidden="true" className="mb-4 block font-display text-4xl leading-none text-brand-light">
                  &ldquo;
                </span>
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-fuchsia-500 text-sm font-bold">
                  {(t.author_name ?? "?").charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold">{t.author_name}</span>
                  {t.author_role && (
                    <span className="block text-sm text-white/50">
                      {t.author_role}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
