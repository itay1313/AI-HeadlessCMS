import { editable } from "./editable";
import type { StoryblokBlok } from "@/types/storyblok";

type Item = { _uid: string; icon?: string; title?: string; description?: string };
type Blok = StoryblokBlok<"benefits"> & { title?: string; items?: Item[] };

export default function Benefits({ blok }: { blok: Blok }) {
  const items = blok.items ?? [];
  return (
    <section {...editable(blok)} className="bg-gray-50/70 px-6 py-24 md:py-32">
      <div className="container-x">
        {blok.title && (
          <h2 className="text-balance mx-auto mb-16 max-w-2xl text-center font-display text-heading font-bold">
            {blok.title}
          </h2>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it._uid}
              className="group rounded-3xl bg-white p-8 shadow-soft ring-1 ring-black/[0.04] transition hover:-translate-y-1 hover:shadow-lift"
            >
              {it.icon && (
                <div
                  aria-hidden="true"
                  className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-2xl transition group-hover:scale-110"
                >
                  {it.icon}
                </div>
              )}
              <h3 className="text-xl font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">
                {it.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
